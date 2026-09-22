"use client";

import { useEffect, useState } from "react";
import DiscordLogin from "./discord";

function LiveClock() {
	const [time, setTime] = useState("");

	useEffect(() => {
		const updateClock = () => {
			const now = new Date();
			setTime(now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }));
		};
		updateClock();
		const timer = setInterval(updateClock, 1000);
		return () => clearInterval(timer);
	}, []);

	return (
		<span className="text-base font-mono font-bold text-black select-none tracking-wider whitespace-nowrap pl-1">
			{time || "--:--"}
		</span>
	);
}

export default function Footer() {
	const [showBubble, setShowBubble] = useState(false);

	return (
		<>
			<footer className="window h-12 bottom-0 fixed w-full z-30 flex items-center justify-between px-2 select-none">
				<div className="flex items-center">
					<DiscordLogin />
				</div>

				<div className="status-bar-field flex items-center gap-2 px-2 py-1 max-w-fit relative">
					<img
						src="/icon.png"
						alt="Proxot System Service"
						title="Proxot System"
						width={22}
						height={22}
						onClick={() => setShowBubble((prev) => !prev)}
						className="h-6 w-6 cursor-pointer select-none object-contain hover:brightness-110 active:translate-y-0.5"
					/>

					<LiveClock />

					{showBubble && (
						<div className="absolute bottom-14 right-0 z-50 w-72 bg-[#ffffe1] border border-black rounded-md shadow-xl p-3 select-none">
							<div className="flex items-center justify-between gap-2 mb-2">
								<div className="flex items-center gap-2">
									<div className="w-5 h-5 rounded-full bg-[#1084d0] text-white flex items-center justify-center font-bold text-xs select-none">
										i
									</div>
									<span className="text-sm font-bold text-black select-none">Proxot System</span>
								</div>
								<button
									type="button"
									onClick={() => setShowBubble(false)}
									aria-label="Close"
									className="!min-w-[16px] !max-w-[16px] !min-h-[16px] !max-h-[16px] !w-4 !h-4 !p-0 !m-0 !shadow-none !bg-white/70 hover:!bg-[#e81123] hover:!text-white !border !border-gray-400/80 rounded-[2px] flex items-center justify-center cursor-pointer select-none text-[10px] font-bold text-gray-700 leading-none transition-colors"
								>
									✕
								</button>
							</div>
							<p className="text-xs text-black leading-relaxed pl-7 select-none">
								Connection established
							</p>
							<div className="absolute -bottom-2 right-8 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-black">
								<div className="absolute -top-[9px] -left-[7px] w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-[#ffffe1]" />
							</div>
						</div>
					)}
				</div>
			</footer>
		</>
	);
}
