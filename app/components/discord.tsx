import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function DiscordLogin() {
	const { data: session, status } = useSession();

	if (status === "loading") {
		return (
			<button disabled className="h-8 text-base font-bold px-3 flex items-center">
				Loading...
			</button>
		);
	}

	if (!session) {
		return (
			<button
				onClick={() => signIn("discord", { callbackUrl: "/profile" })}
				className="h-8 text-base font-bold px-3 flex items-center"
			>
				Sign In
			</button>
		);
	}

	return (
		<button
			onClick={() => signOut()}
			className="h-8 text-base font-bold px-3 flex items-center"
		>
			Sign Out
		</button>
	);
}
