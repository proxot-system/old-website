"use client";
import Link from "next/link";
import Desktop from "../components/desktop";
import Window from "../components/window";

function Title({ children }: { children: React.ReactNode }) {
	return <div className="text-3xl text-black mt-4">{children}</div>;
}

function Header({ children }: { children: React.ReactNode }) {
	return <div className="text-2xl mt-4 text-twm-sun">{children}</div>;
}

function HeaderTwo({ children }: { children: React.ReactNode }) {
	return <div className="text-xl mt-2 text-twm-highlight">{children}</div>;
}

function Text({ children }: { children: React.ReactNode }) {
	return (
		<div className="text-lg mx-auto max-w-[500px] text-black">{children}</div>
	);
}

export default function Page() {
	return (
		<Desktop>
			<Window title="Credits :3" className="max-w-[600px]">
				<Title>Credits</Title>

				<Header>Developers</Header>
				<Text>meqativ</Text>
				<Text>fily.gif (funding / hosting)</Text>
				<Text>Axiinyaa (founder)</Text>

				<Header>Localization</Header>
				<Text>Thanks to the people who help translate the project over at <a href={"https://translate.theworldmachine.xyz/"} className="text-twm-highlight">our translation website</a>! You can see specific names of translators who wished to be credited using the /about command in the bot.</Text>

				<Header>Artists</Header>
				<Text>Thanks to the artists that have contributed their art to the textbox facepic selector! You can see who exactly drew the art pieces when selecting them.</Text>

				<div className="mt-5" />
				<Header>Software</Header>
				<Text><a href={"https://weblate.org/"} className="text-twm-highlight">Weblate</a> - our translation infrastructure.</Text>
				<Text><a href={"https://github.com/Leo40Git/OneShot-Textbox-Maker/"} className="text-twm-highlight">OneShot Textbox Maker (by Leo40Git)</a> - their text formatting syntax was a huge inspiration for our /textbox create command.</Text>
				<Text>And of course, <a href="https://oneshot.wiki.gg/wiki/OneShot" className="text-twm-highlight">OneShot</a>! The wonderful game this project was inspired by! Many parts of this project reference/directly show assets from this game.</Text>
			</Window>
		</Desktop>
	);
}
