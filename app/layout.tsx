import type { Metadata } from "next";
import { Providers } from "./providers";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "The World Machine",
	description: "A fun Discord bot based off OneShot.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="text-white font-main">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
