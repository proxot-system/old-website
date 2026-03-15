"use client";
import React from "react";

export default function RedirectButton({
	text,
	page,
}: {
	text: string;
	page: string;
}) {
	const handleClick = () => {
		window.location.href = page;
	};

	return (
		<div
			onClick={handleClick}
			className="text-twm-highlight mx-5 w-auto rounded-lg
        hover:bg-twm-highlight bg-[length:0_0] hover:bg-auto hover:text-white hover:cursor-pointer scale-100 hover:scale-105 transition-transform duration-150'"
		>
			<p className="align-middle my-1 mx-10 text-center text-2xl">{text}</p>
		</div>
	);
}
