"use server";
import axios, { all, AxiosError } from "axios";
import { Collection, MongoClient, ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/options";
import {
	UserData,
	LeaderboardUser,
	ItemData,
	NikogotchiInformation,
	NikogotchiData,
	BlogPost,
} from "./components/database-parse-type";
import pLimit from "p-limit";

const limit = pLimit(3);

let collection: null | Collection<any> = null;

const uri = process.env.DB_URI as string;
const dbClient: MongoClient = new MongoClient(uri);
dbClient.connect();

async function isConnected(client: MongoClient) {
	if (!client) {
		return false;
	}
	try {
		const adminDb = client.db().admin();
		const result = await adminDb.ping();
		return result && result.ok === 1;
	} catch (error) {
		client.close();
		return false;
	}
}
async function getCollection(name: string) {
	if (collection != null) {
		return collection;
	}
	if (await isConnected(dbClient)) await dbClient.connect();

	const db = dbClient.db("TheWorldMachine");

	return db.collection<any>(name);
}

export async function Fetch(user: string): Promise<UserData | null> {
	const session = await getServerSession(authOptions);
	if (!session?.user_id || session.user_id !== user) {
		throw new Error("Unauthorized");
	}

	if (!user) return null;
	const safeUserId = String(user);

	const user_data_collection = await getCollection("UserData");
	const userDataFromDB = await user_data_collection.findOne({ _id: safeUserId });

	if (userDataFromDB) {
		return userDataFromDB;
	} else {
		const defaultData = new UserData();
		await user_data_collection.insertOne({ _id: safeUserId, ...defaultData });
		return Fetch(safeUserId);
	}
}

export async function GetNikogotchiData(
	user: string,
): Promise<NikogotchiData | null> {
	const session = await getServerSession(authOptions);
	if (!session?.user_id || session.user_id !== user) {
		throw new Error("Unauthorized");
	}

	if (!user) return null;
	const safeUserId = String(user);

	const user_data_collection = await getCollection("UserNikogotchis");
	const userDataFromDB = await user_data_collection.findOne({ _id: safeUserId });

	if (userDataFromDB) {
		return userDataFromDB as unknown as NikogotchiData;
	} else {
		return null;
	}
}

export async function Update(user: Partial<UserData>) {
	const session = await getServerSession(authOptions);
	if (!session || !session.user_id) {
		throw new Error("Unauthorized");
	}

	// Trust the ID from the server session instead of the client's payload.
	const safeUserId = String(session.user_id);
	const user_data_collection = await getCollection("UserData");

	// VULNERABILITY FIX: Define a strict, server-side allowlist of modifiable fields.
	// This prevents clients from modifying protected fields like 'wool' or 'suns'.
	const ALLOWED_FIELDS = [
		"equipped_bg",
		"badge_notifications",
		"profile_description",
		"translation_language",
	];

	const filteredData: { [key: string]: any } = {};

	// Iterate over the secure allowlist, not client-provided data.
	ALLOWED_FIELDS.forEach((field) => {
		if (user[field as keyof UserData] !== undefined) {
			filteredData[field as keyof UserData] = user[field as keyof UserData];
		}
	});

	// Prevent sending an empty update to the database.
	if (Object.keys(filteredData).length === 0) {
		console.log("No valid fields to update.");
		return;
	}

	try {
		const result = await user_data_collection.updateOne(
			{ _id: safeUserId },
			{ $set: filteredData },
		);
		console.log(result.matchedCount);
	} catch (error) {
		console.error("Error updating database: " + error);
	}
}


export async function GetLeaderboard(sortBy: string) {
	const allowedSortFields = [
		"wool",
		"suns",
		"times_asked",
		"times_shattered",
		"times_transmitted",
	];
	if (!sortBy || !allowedSortFields.includes(sortBy)) {
		return [];
	}

	const safeSortBy = String(sortBy);

	const user_data_collection = await getCollection("UserData");
	const leaderboard: LeaderboardUser[] = [];

	try {
		const cursor = await user_data_collection.aggregate([
			{ $sort: { [safeSortBy]: -1 } },
			{ $limit: 15 },
			{ $project: { _id: 1, [safeSortBy]: 1, wool: 1 } },
		]);
		const result = await cursor.toArray();

		const userPromises = result.map((doc) =>
			limit(async () => {
				const username = await GetDiscordData(String(doc._id));
				if (
					username == "" ||
					["twm", "the world machine", "proxot", "proxot system"].some((a) =>
						username.toLowerCase().includes(a),
					)
				)
					return null;

				return {
					name: username,
					type: safeSortBy,
					data: {
						...doc,
						wool: doc.wool ? doc.wool.toLocaleString() : "0",
					} as UserData,
				} as LeaderboardUser;
			}),
		);

		const users = await Promise.all(userPromises);

		const validUsers: LeaderboardUser[] = users.filter(
			(user): user is LeaderboardUser => user !== null,
		);
		leaderboard.push(...validUsers.slice(0, 10));
	} catch (error) {
		console.error(error);
	}

	return leaderboard;
}

export async function FetchItemData() {
	const data = await getCollection("ItemData");

	const itemData = await data.findOne({ access: "ItemData" });

	if (itemData) {
		return itemData as unknown as ItemData;
	} else {
		return null;
	}
}

const users: any = {};
const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function GetDiscordData(userID: string) {
	if (!userID) return "";

	const discordIdRegex = /^\d{17,20}$/;
	if (!discordIdRegex.test(userID)) {
		console.error(`Invalid Discord ID format received: ${userID}`);
		return "";
	}

	const safeUserId = String(userID);

	if (users[safeUserId] === undefined) {
		try {
			const response = await axios.get(
				`https://discord.com/api/users/${safeUserId}`,
				{
					headers: {
						Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
					},
				},
			);

			users[safeUserId] = response.data.username;
		} catch (e: any) {
			if (e.message === "Request failed with status code 429") {
				await wait((e.response.data.retry_after + 0.5) * 1000);
				return await GetDiscordData(safeUserId);
			}
			if (e.response && e.response.status === 404) {
				users[safeUserId] = `[Deleted User]`;
				return users[safeUserId];
			}
			throw e;
		}
	}

	return users[safeUserId];
}

export async function GetBackgrounds() {
	const end_point = "https://api.npoint.io/6940a9826da1e0473197/backgrounds";

	const responseBackgrounds = await fetch(end_point);
	return await responseBackgrounds.json();
}

export async function FetchBlogPosts() {
	const blogPosts: BlogPost[] = [];

	const blogData = await getCollection("Blog");

	const blogPostList = await blogData.find({}).toArray();

	const blogPostPromises = blogPostList.map(async (blogDocs) => {
		return { ...blogDocs } as BlogPost;
	});

	const allBlogPosts = await Promise.all(blogPostPromises);

	blogPosts.push(...allBlogPosts);

	return blogPosts;
}

export async function UploadBlogPost(post: BlogPost) {
	const session = await getServerSession(authOptions);
	if (!session || session.user_id !== "302883948424462346") {
		throw new Error("Unauthorized");
	}

	if (post == undefined) {
		return;
	}

	const blogData = await getCollection("Blog");

	const result = await blogData.insertOne(post);

	if (result && result.insertedId) {
		console.log(`New post created with the following id: ${result.insertedId}`);
	} else {
		console.error("Failed to insert the blog post.");
	}
}