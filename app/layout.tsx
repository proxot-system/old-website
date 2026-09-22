import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
	title: "Proxot System",
	description: "Proxy to a OneShot world and more (also known as The World Machine discord bot)",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				{/* Preload fonts */}
				<link
					rel="preload"
					href="/font/TerminusTTF-Bold.woff"
					as="font"
					type="font/woff"
					crossOrigin="anonymous"
				/>

				{/* Preload desktop and tray icons */}
				<link rel="preload" href="/icon.png" as="image" />
				<link rel="preload" href="/desktop-icons/invite.png" as="image" />
				<link rel="preload" href="/desktop-icons/person.png" as="image" />
				<link rel="preload" href="/desktop-icons/leaderboard.png" as="image" />
				<link rel="preload" href="/desktop-icons/credits.png" as="image" />
				<link rel="preload" href="/desktop-icons/sun.png" as="image" />
				<link rel="preload" href="/discord-icon.png" as="image" />
			</head>
			<body className="text-white font-main select-none">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
