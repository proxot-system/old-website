import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

if (!process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET) {
	console.error("CRITICAL ERROR: Discord OAuth credentials are missing in environment variables.");
}

export const authOptions: NextAuthOptions = {
	providers: [
		DiscordProvider({
			clientId: process.env.DISCORD_CLIENT_ID ?? "",
			clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
			authorization: {
				params: {
					scope: "identify",
				},
			},
		}),
	],

	secret: process.env.NEXTAUTH_SECRET,

	callbacks: {
		async jwt({ token, account }) {
			if (account) {
				token = Object.assign({}, token, {
					access_token: account.access_token,
					user_id: account.providerAccountId, 
				});
			}
			return token;
		},
		async session({ session, token }) {
			if (session) {
				session = Object.assign({}, session, {
					access_token: token.access_token,
					user_id: token.user_id,
				});
			}
			return session;
		},
	},
};