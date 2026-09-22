"use client";
import Footer from "../components/footer";
import Navigation from "../components/navigation";
import { ReactNode } from "react";

export default function Desktop(props: { children: ReactNode }) {
	return (
		<main className="desktop bg-[#167E95] h-screen overflow-hidden relative select-none">
			{props.children}
			<Navigation />
			<Footer />
		</main>
	);
}
