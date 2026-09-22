"use client";
import Desktop from "./components/desktop";
import Window from "./components/window";

export default function NotFound() {
	return (
		<Desktop>
			<Window title="Error!" className="">
				<div className="text-xl text-black text-center">
					{"Page not found :("}
				</div>
				<img src="/pnf.png" alt="404" width={500} className="mt-2 h-auto" />
			</Window>
		</Desktop>
	);
}
