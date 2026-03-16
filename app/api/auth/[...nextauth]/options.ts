import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: NextAuthOptions = {
	providers: [
		DiscordProvider({
			clientId: process.env.DISCORD_CLIENT_ID as string,
			clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
			authorization: {
				params: {
					scope: "identify",
				},
			},
		}),
	],

	secret: process.env.NEXTAUTH_SECRET as string,

	callbacks: {
		async jwt({ token, account }) {
			if (account) {
				token = Object.assign({}, token, {
					access_token: account.access_token,
					// Store the Discord ID on the secure server token
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