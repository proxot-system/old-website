"use client";
import Desktop from "./components/desktop";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Window from "./components/window";

const introMessages = [
	"...",
	"You got to this place.",
	"...Why?",
	"You're already too late. This World is just like the others.",
	"This will be apparent when you see some of the characters.",
	"This place was never worth your time.",
	"Do you still want to get in?",
	"Very well. Then remember this.",
];

export default function Page() {
	const [index, setIndex] = useState(0);
	const [completed, setCompleted] = useState(false);

	useEffect(() => {
		if (Cookies.get("seen_intro") === "true") {
			setCompleted(true);
		}
	}, []);

	const handleNext = () => {
		if (index >= introMessages.length - 1) {
			setCompleted(true);
			Cookies.set("seen_intro", "true");
			setTimeout(() => {
				alert("You only have one shot, user.");
			}, 30);
		} else {
			setIndex((prev) => prev + 1);
		}
	};

	if (completed) {
		return <Desktop>{null}</Desktop>;
	}

	return (
		<Desktop>
			<Window
				title="???"
				className="sm:w-[380px]"
			>
				<div className="p-3 text-center">
					<p className="text-base text-black font-main leading-relaxed mb-5 select-none">
						{introMessages[index]}
					</p>
					<div className="flex justify-center">
						<button
							onClick={handleNext}
							className="px-6 py-1 text-base font-bold min-w-[80px]"
						>
							Ok
						</button>
					</div>
				</div>
			</Window>
		</Desktop>
	);
}
