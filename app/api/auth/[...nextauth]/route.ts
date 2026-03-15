import NextAuth, { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

const authOptions: NextAuthOptions = {
	// Configure one or more authentication providers
	providers: [
		DiscordProvider({
			clientId: process.env.NEXT_PUBLIC_DISCORD_ID as string,
			clientSecret: process.env.NEXT_PUBLIC_DISCORD_SECRET as string,
			authorization: {
				params: {
					scope: "identify",
				},
			},
		}),
	],

	secret: process.env.NEXT_PUBLIC_SECRET as string,

	callbacks: {
		async jwt({ token, account }) {
			if (account) {
				token = Object.assign({}, token, {
					access_token: account.access_token,
				});
			}
			return token;
		},
		async session({ session, token }) {
			if (session) {
				session = Object.assign({}, session, {
					access_token: token.access_token,
				});
			}
			return session;
		},
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
