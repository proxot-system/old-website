"use server";
import axios from "axios";
import { type Collection, MongoClient } from "mongodb";
import { getServerSession } from "next-auth/next";
import pLimit from "p-limit";
import { authOptions } from "./api/auth/[...nextauth]/options";
import { config } from "./lib/config"; // Ensure this path is correct
import {
	type BlogPost,
	type ItemData,
	type LeaderboardUser,
	type NikogotchiData,
	UserData,
} from "./components/database-parse-type";

const limit = pLimit(3);
const collection: null | Collection<any> = null;

const dbCfg = config.database.connection;
const username = encodeURIComponent(dbCfg.username);
const password = encodeURIComponent(dbCfg.password);
const uri = `mongodb://${username}:${password}@${dbCfg.host}:${dbCfg.port}/TheWorldMachine?authSource=admin`;
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
	if (!session?.user_id) {
		throw new Error("AUTH_REQUIRED");
	}

	if (session.user_id !== user) {
		throw new Error("Unauthorized");
	}


	if (!user) return null;
	const safeUserId = String(user);

	const user_data_collection = await getCollection("UserData");

	const userDataFromDB = await user_data_collection.findOne(
		{ _id: safeUserId },
		{
			projection: {
				_id: 1,
				profile_description: 1,
				equipped_bg: 1,
				owned_backgrounds: 1,
				badge_notifications: 1,
				translation_language: 1,
			},
		},
	);

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
		throw new Error("AUTH_REQUIRED");
	}

	if (!user) return null;
	const safeUserId = String(user);

	const user_data_collection = await getCollection("UserNikogotchis");
	const userDataFromDB = await user_data_collection.findOne({
		_id: safeUserId,
	});

	if (userDataFromDB) {
		return userDataFromDB as unknown as NikogotchiData;
	} else {
		return null;
	}
}

export async function Update(user: Partial<UserData>) {
	const session = await getServerSession(authOptions);
	if (!session || !session.user_id) {
		throw new Error("AUTH_REQUIRED");
	}

	const safeUserId = String(session.user_id);
	const user_data_collection = await getCollection("UserData");

	const ALLOWED_FIELDS = [
		"equipped_bg",
		"badge_notifications",
		"profile_description",
		"translation_language",
	];

	const filteredData: { [key: string]: any } = {};

	ALLOWED_FIELDS.forEach((field) => {
		if (user[field as keyof UserData] !== undefined) {
			filteredData[field as keyof UserData] = user[field as keyof UserData];
		}
	});

	if (filteredData.profile_description !== undefined) {
		if (typeof filteredData.profile_description !== "string") {
			delete filteredData.profile_description;
		} else if (filteredData.profile_description.length > 250) {
			filteredData.profile_description =
				filteredData.profile_description.substring(0, 250);
		}
	}

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
		console.error(`Error updating database: ${error}`);
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
						Authorization: `Bot ${config.discord.token}`,
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
	if (!session || ["744276454946242723", "302883948424462346"].includes(`${session.user_id}`))return;

	if (!post) return;

	const blogData = await getCollection("Blog");

	const result = await blogData.insertOne(post);

	if (result?.insertedId) {
		console.log(`New post created with the following id: ${result.insertedId}`);
	} else {
		console.error("Failed to insert the blog post.");
	}
}