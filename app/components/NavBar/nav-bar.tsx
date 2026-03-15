"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import RedirectButton from "./redirect-button";
export default function NavBar() {
	const [open, setOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	// Function to set the scale to 100
	const openMenu = () => {
		setOpen(!open);
	};

	// create a function that changes the page to #
	const handleClick = () => {
		window.location.href = "/";
	};

	useEffect(() => {
		const userAgent = window.navigator.userAgent;
		const mobileRegex =
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

		setIsMobile(mobileRegex.test(userAgent));
	}, []);

	function HamburgerMenu() {
		return (
			<div>
				<Image
					onClick={() => openMenu()}
					src="/hamburger-mmm.svg"
					alt="menu"
					width={50}
					height={50}
					className="hover:scale-110 transition-transform duration-200 my-auto"
				/>

				<div
					className={`absolute w-[250px] h-full bg-twm-logo-bg flex flex-col justify-evenly font-main origin-top-left rounded-xl z-50 ${open ? "menu-open" : "menu-hidden"}`}
				>
					<RedirectButton text="Invite" page="/invite" />
					<RedirectButton text="Profile" page="/profile" />
				</div>
			</div>
		);
	}

	return (
		<div className="flex justify-between p-5 bg-twm-logo-bg w-full h-full font-main">
			<h1
				onClick={() => handleClick()}
				className="text-3xl text-twm-highlight my-auto ml-4 hover:cursor-pointer hover:scale-105 transition-transform duration-200 hover:text-twm-sun"
			>
				Proxot System
			</h1>

			{isMobile ? (
				<HamburgerMenu />
			) : (
				<div className="flex justify-between mx-10 my-auto">
					<div className="flex justify-between my-10">
						<RedirectButton text="Invite" page="/invite" />
						<RedirectButton text="Profile" page="/profile" />
					</div>
				</div>
			)}
		</div>
	);
}
