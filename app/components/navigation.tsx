import DesktopIcon from "./desktop-icon";

export default function Navigation() {
  return (
    <div className="absolute max-h-[700px] font-main bottom-2 grid gap-5 scale-90 grid-cols-6 sm:grid-cols-2 sm:grid-rows-6 sm:top-1 sm:grid-flow-col sm:left-10 sm:mx-auto sm:gap-1">
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
      {/*<DesktopIcon filename="blog" icon_name="Blog" redirect="/blog" />*/}
      <DesktopIcon filename="credits" icon_name="Credits" redirect="/credits" />
      <DesktopIcon
        filename="../discord-icon"
        icon_name="Support Server"
        redirect="https://discord.gg/gtfeHfka5h"
      />
      <DesktopIcon
        filename="sun"
        icon_name="Buy OneShot"
        redirect="https://store.steampowered.com/app/420530/OneShot/"
      />
    </div>
  );
}
