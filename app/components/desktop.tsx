"use client";
import Footer from "../components/footer";
import Navigation from "../components/navigation";
import { ReactNode } from "react";
import Head from "next/head";

export default function Desktop(props: { children: ReactNode }) {
	return (
		<main className="desktop bg-[#167E95] h-screen">
			<Head>
				<title>Proxot System</title>
				<link rel="canonical" href="https://www.theworldmachine.xyz/" />
				<meta
					name="description"
					
					content="Proxy to a OneShot world and more. Part of it is also a discord bot called The World Machine. Invite it to your server and get neat features such as games, textbox dialogue generating and more!"
				/>

				<meta name="og:title" content="Proxot System" />
				<meta
					name="og:description"
					content="Proxy to a OneShot world and more. Part of it is also a discord bot called The World Machine. Invite it to your server and get neat features such as games, textbox dialogue generating and more!"
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
