import React from "react";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";

export default function DiscordLogin() {
	const startSignIn = () => {
		signIn("discord", { callbackUrl: "/profile" });
	};

	const { data: session, status } = useSession();

	if (!session && status !== "loading") {
		return (
			<div>
				<button
					onClick={() => startSignIn()}
					className="w-auto text-lg flex ml-3"
				>
					Sign In
				</button>
			</div>
		);
	} else if (status === "loading") {
		return (
			<div>
				<button className="w-auto text-lg flex ml-3">Loading</button>
			</div>
		);
	}

	if (session) {
		return (
			<div>
				<button
					onClick={() => signOut()}
					className="w-auto text-lg flex ml-3 h-8 my-auto"
				>
					Sign Out
				</button>
			</div>
		);
	}
}
