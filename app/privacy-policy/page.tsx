"use client";

import NavBar from "../components/NavBar/nav-bar";
import Footer from "../components/footer";

export default function PrivacyPolicy() {
	return (
		<div className="bg-black h-max w-full">
			<div className="font-main py-32 grid justify-center">
				<div className="px-5 w-auto max-w-[1000px] h-screen">
					<h1 className="text-5xl text-twm-sun text-center">Privacy Policy</h1>
					<p className="text-xl my-4 text-center">
						Last updated: March 14th, 2026
					</p>
					<p className="text-md my-4 text-center">
						This Privacy Policy is intended to inform users about how we handle
						data and ensure their privacy when using our bot.
					</p>
					<p className="text-xl mt-8 text-center">Data Collection</p>
					<p className="text-md text-center">
						1.1. Message Content: The Proxot System processes message content
						when users utilize the /transmit command to communicate with other
						servers. We do not store this information in any form, and we only
						use the message content to send messages to the designated server
						with the user's consent.
					</p>
					<p className="text-md mt-2 text-center">
						1.2. Usage Data: We do collect and store information about the total
						number of times all commands have been executed. This data is
						aggregated and used to track the usage and popularity of bot
						commands. This information is not associated with specific users and
						is used solely for statistical purposes.
					</p>
					<p className="text-xl mt-8 text-center">Changes to Privacy Policy</p>
					<p className="text-md text-center">
						We may update this Privacy Policy from time to time to reflect
						changes in our data handling practices. Users will be notified of
						any significant changes.
					</p>
					<p className="text-xl mt-8 text-center">Contact</p>
					<p className="text-md text-center">
						If you have any questions or concerns about our Privacy Policy,
						please contact us at our{" "}
						<a
							href="https://discord.gg/gtfeHfka5h"
							className="text-twm-highlight"
						>
							Discord Support Server
						</a>, or email <a href="mailto:proxot.system@gmail.com" className="text-twm-highlight">proxot.system@gmail.com</a>.
					</p>
				</div>
				<button
					onClick={() => (window.location.href = "/")}
					className="text-2xl text-black w-1/12 mx-auto"
				>
					Back
				</button>
			</div>
		</div>
	);
}
