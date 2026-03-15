"use client";

import DiscordLogin from "./discord";

export default function Footer() {
	return (
		<div className="window h-12 bottom-0 fixed w-screen z-20">
			<div className="flex justify-between mt-1">
				<DiscordLogin />
				<div className="text-black right-5 text-sm sm:text-xl mx-auto my-auto">
					The World Machine
				</div>
			</div>
		</div>
	);
}
