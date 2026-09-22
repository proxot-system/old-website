"use server";
import axios from "axios";
import { type Collection, MongoClient } from "mongodb";
import pLimit from "p-limit";
import { auth } from "@/auth";
import { config } from "./lib/config";
import {
	type BlogPost,
	type ItemData,
	type LeaderboardUser,
	type NikogotchiData,
	UserData,
} from "./components/database-parse-type";

const limit = pLimit(3);

const dbCfg = config.database.connection;
const username = encodeURIComponent(dbCfg.username);
const password = encodeURIComponent(dbCfg.password);
const uri = `mongodb://${username}:${password}@${dbCfg.host}:${dbCfg.port}/TheWorldMachine?authSource=admin`;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
	var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
	if (!global._mongoClientPromise) {
		client = new MongoClient(uri);
		global._mongoClientPromise = client.connect();
	}
	clientPromise = global._mongoClientPromise;
} else {
	client = new MongoClient(uri);
	clientPromise = client.connect();
}

async function getCollection(name: string): Promise<Collection<any>> {
	const connectedClient = await clientPromise;
	const db = connectedClient.db("TheWorldMachine");
	return db.collection<any>(name);
}

export async function Fetch(user: string): Promise<UserData | null> {
	const session = await auth();
	if (!session?.user_id || session.user_id !== user) {
		console.warn(`Authentication check failed for user: ${user}. Session user: ${session?.user_id}`);
		return null;
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
		return userDataFromDB as unknown as UserData;
	} else {
		const defaultData = new UserData();
		await user_data_collection.insertOne({ _id: safeUserId, ...defaultData });
		return Fetch(safeUserId);
	}
}

export async function GetNikogotchiData(
	user: string,
): Promise<NikogotchiData | null> {
	const session = await auth();
	if (!session?.user_id || session.user_id !== user) {
		return null;
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
	const session = await auth();
	if (!session || !session.user_id) {
		console.error("Update failed: User is not authenticated.");
		return;
	}

	const safeUserId = String(session.user_id);
	const user_data_collection = await getCollection("UserData");

	const filteredData: { [key: string]: any } = {};

	if (user.equipped_bg !== undefined && typeof user.equipped_bg === "string") {
		const existingUser = await user_data_collection.findOne(
			{ _id: safeUserId },
			{ projection: { owned_backgrounds: 1 } },
		);
		const owned = existingUser?.owned_backgrounds || ["Default"];
		if (owned.includes(user.equipped_bg)) {
			filteredData.equipped_bg = user.equipped_bg;
		}
	}

	if (
		user.badge_notifications !== undefined &&
		typeof user.badge_notifications === "boolean"
	) {
		filteredData.badge_notifications = user.badge_notifications;
	}

	if (
		user.translation_language !== undefined &&
		typeof user.translation_language === "string"
	) {
		filteredData.translation_language = user.translation_language;
	}

	if (
		user.profile_description !== undefined &&
		typeof user.profile_description === "string"
	) {
		let desc = user.profile_description;

		if (desc.length > 250) {
			desc = desc.substring(0, 250);
		}

		const lines = desc.split("\n");
		if (lines.length > 11) {
			desc = lines.slice(0, 11).join("\n");
		}

		filteredData.profile_description = desc;
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
		// Fetch 30 candidates to guarantee 10 valid non-deleted users
		const cursor = await user_data_collection.aggregate([
			{ $sort: { [safeSortBy]: -1 } },
			{ $limit: 30 },
			{ $project: { _id: 1, [safeSortBy]: 1, wool: 1 } },
		]);
		const result = await cursor.toArray();

		const userPromises = result.map((doc) =>
			limit(async () => {
				const username = await GetDiscordData(String(doc._id));
				if (
					!username ||
					username === "" ||
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

const users: Record<string, string> = {};
const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
let tokenUnauthorized = false;

export async function GetDiscordData(userID: string) {
	if (!userID) return "";

	const discordIdRegex = /^\d{17,20}$/;
	if (!discordIdRegex.test(userID)) {
		console.error(`Invalid Discord ID format received: ${userID}`);
		return "";
	}

	const safeUserId = String(userID);

	if (users[safeUserId] === undefined) {
		if (tokenUnauthorized) {
			users[safeUserId] = `User ${safeUserId}`;
			return users[safeUserId];
		}

		try {
			const botToken = config.discord?.token?.trim();
			const response = await axios.get(
				`https://discord.com/api/v10/users/${safeUserId}`,
				{
					headers: {
						Authorization: `Bot ${botToken}`,
						"User-Agent": "DiscordBot (https://theworldmachine.xyz, 1.0.0)",
					},
				},
			);

			const data = response.data;

			// Check Discord user flags: bit 34 (1<<34) = DELETED, bit 15 (1<<15) = UNDERAGE_DELETED
			const flags = BigInt(data.flags ?? data.public_flags ?? 0);
			if ((flags & (1n << 34n)) !== 0n || (flags & (1n << 15n)) !== 0n) {
				users[safeUserId] = "";
				return "";
			}

			users[safeUserId] = data.username;
		} catch (e: any) {
			if (e.response && e.response.status === 429) {
				const retryAfter = Number(e.response.data?.retry_after ?? e.response.headers["retry-after"] ?? 1);
				const delay = Number.isFinite(retryAfter) ? retryAfter : 1;
				await wait((delay + 0.5) * 1000);
				return await GetDiscordData(safeUserId);
			}
			if (e.response && e.response.status === 404) {
				users[safeUserId] = "";
				return "";
			}
			if (e.response && e.response.status === 401) {
				tokenUnauthorized = true;
				console.error("Discord bot token in config.yml is unauthorized (HTTP 401). Please update it with a valid token from Discord Developer Portal.");
				users[safeUserId] = `User ${safeUserId}`;
				return users[safeUserId];
			}
			console.error(`Failed to fetch Discord user ${safeUserId}:`, e.message);
			users[safeUserId] = "";
			return "";
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
	const session = await auth();
	const allowedAdmins = ["744276454946242723", "302883948424462346"];
	if (!session || !allowedAdmins.includes(`${session.user_id}`)) return;

	if (!post || typeof post.title !== "string" || typeof post.content !== "string") return;

	const blogData = await getCollection("Blog");
	const count = await blogData.countDocuments();

	const newPost: BlogPost = {
		title: post.title.slice(0, 150),
		description: typeof post.description === "string" ? post.description.slice(0, 300) : "",
		content: post.content.slice(0, 20000),
		datetime: new Date(),
		post_id: count,
	};

	const result = await blogData.insertOne(newPost);

	if (result?.insertedId) {
		console.log(`New post created with the following id: ${result.insertedId}`);
	} else {
		console.error("Failed to insert the blog post.");
	}
}
