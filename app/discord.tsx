"use server";

import axios from "axios";
import { Session } from "next-auth";
import { Fetch } from "./database";
import { UserData } from "./components/database-parse-type";

export async function DiscordLogIn(
	discordData: Session,
): Promise<UserData | null> {
	if (!discordData?.access_token) {
		return null;
	} // If there's no access token then we don't need to do anything yet.

	const response = await axios.get("https://discord.com/api/users/@me", {
		headers: { Authorization: `Bearer ${discordData.access_token}` },
	});

	if (response.status != 200) {
		return null;
	}

	const id = response.data.id;

	const userData = await Fetch(id);

	if (userData == null) {
		return null;
	}

	return userData;
}
