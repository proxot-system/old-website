import { config } from "../../../lib/config";
import type { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

process.env.NEXTAUTH_URL = config.nextauth.url;

const token = config.discord.token;
const clientId = atob(token.split(".")[0]);

if (!clientId || !config.discord.client_secret) {
	console.error("Discord OAuth credentials are missing in config.yml.");
}

export const authOptions: NextAuthOptions = {
	providers: [
		DiscordProvider({
			clientId: clientId,
			clientSecret: config.discord.client_secret,
			authorization: {
				params: {
					scope: "identify",
				},
			},
		}),
	],

	secret: config.nextauth.secret,

	callbacks: {
		async jwt({ token, account }) {
			if (account) {
				token.access_token = account.access_token;
				token.user_id = account.providerAccountId;
			}
			return token;
		},
		async session({ session, token }) {
			if (session && token) {
				(session as any).access_token = token.access_token;
				(session as any).user_id = token.user_id;
			}
			return session;
		},
	},
};