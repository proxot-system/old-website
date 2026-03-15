"use client";
import Footer from "../components/footer";
import Navigation from "../components/navigation";
import { ReactNode } from "react";
import Head from "next/head";

export default function Desktop(props: { children: ReactNode }) {
	return (
		<main className="desktop bg-[#167E95] h-screen">
			<Head>
				<title>The World Machine</title>
				<link rel="canonical" href="https://www.theworldmachine.xyz/" />
				<meta
					name="description"
					content="The World Machine is a discord bot inspired by the game OneShot. Invite them to your server and get neat features such as music, games and more!"
				/>

				<meta name="og:title" content="The World Machine" />
				<meta
					name="og:description"
					content="The World Machine is a discord bot inspired by the game OneShot. Invite them to your server and get neat features such as music, games and more!"
				/>
				<meta
					name="og:image"
					content="https://media.discordapp.net/attachments/1162885547749023784/1182724930652082294/twm_reallynow.png"
				/>
			</Head>
			{props.children}
			<Navigation />
			<Footer />
		</main>
	);
}
