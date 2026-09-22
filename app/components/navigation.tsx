import DesktopIcon from "./desktop-icon";

export default function Navigation() {
	return (
		<div className="absolute font-main z-0 bottom-14 left-2 right-2 flex justify-around sm:bottom-auto sm:top-3 sm:left-3 sm:right-auto sm:flex-col sm:justify-start sm:gap-3 select-none">
			<DesktopIcon
				filename="invite"
				icon_name="Invite Bot"
				redirect="/invite"
			/>
			<DesktopIcon
				filename="person"
				icon_name="Edit Profile"
				redirect="/profile"
			/>
			<DesktopIcon
				filename="leaderboard"
				icon_name="Leader boards"
				redirect="/leaderboards"
			/>
			<DesktopIcon filename="credits" icon_name="Credits" redirect="/credits" />
			<DesktopIcon
				filename="../discord-icon"
				icon_name="Support Server"
				redirect="https://discord.gg/gtfeHfka5h"
			/>
			<DesktopIcon
				filename="sun"
				icon_name="Buy OneShot"
				redirect="https://store.steampowered.com/app/2915460/"
			/>
		</div>
	);
}
