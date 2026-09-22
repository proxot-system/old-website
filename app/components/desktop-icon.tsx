"use client";

import { useRouter } from "next/navigation";

export default function Icon({
	filename,
	icon_name,
	redirect,
}: {
	filename: string;
	icon_name: string;
	redirect: string;
}) {
	const router = useRouter();

	const handleClick = () => {
		if (redirect.startsWith("http://") || redirect.startsWith("https://")) {
			window.open(redirect, "_blank", "noopener,noreferrer");
		} else {
			router.push(redirect);
		}
	};

	return (
		<div
			onClick={handleClick}
			className="hover:cursor-pointer flex flex-col items-center justify-start font-main w-14 mb-2 select-none cursor-pointer"
		>
			<img
				src={`/desktop-icons/${filename}.png`}
				alt={icon_name}
				width={32}
				height={32}
				loading="eager"
				decoding="sync"
				className="mx-auto block h-8 w-8 object-contain"
			/>
			<span className="text-center text-white text-xs mt-1 leading-tight select-none [text-shadow:none]">
				{icon_name}
			</span>
		</div>
	);
}
