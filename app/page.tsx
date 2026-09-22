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
	"You only have one shot, user.",
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
			Cookies.set("seen_intro", "true");
			setCompleted(true);
		} else {
			setIndex((prev) => prev + 1);
		}
	};

	if (completed) {
		return <Desktop>{null}</Desktop>;
	}

	const isLast = index === introMessages.length - 1;

	return (
		<Desktop>
			<Window
				title="The World Machine"
				className="sm:w-[420px]"
			>
				<div className="p-3">
					<div className="flex items-start gap-4 mb-6">
						<img
							src="/icon.png"
							alt="Notice"
							width={36}
							height={36}
							className="h-9 w-9 flex-shrink-0 mt-1 object-contain select-none"
						/>
						<p className="text-base text-black font-main leading-relaxed select-none">
							{introMessages[index]}
						</p>
					</div>
					<div className="flex justify-center">
						<button
							onClick={handleNext}
							className="px-6 py-1 text-base font-bold min-w-[90px]"
						>
							{isLast ? "OK" : "Next"}
						</button>
					</div>
				</div>
			</Window>
		</Desktop>
	);
}
