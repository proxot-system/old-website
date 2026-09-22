"use client";
import React from "react";
import CommandPanel from "../components/command_panels/command-panels";
import Desktop from "../components/desktop";
import Window from "../components/window";

export default function Invite() {
  const handleClick = () => {
    window.open(
      "https://discord.com/api/oauth2/authorize?client_id=1015629604536463421&permissions=431681300544&scope=applications.commands%20bot",
      "_blank",
      "popup width=1500 height=800",
    );
  };

  return (
    <Desktop>
      <Window title="Invite" className="sm:w-[720px]">
        <div className="flex flex-col font-main p-2">
          <p className="text-center text-base text-black mb-4 leading-relaxed">
            You want to interact with The World Machine through Proxot? That's great! You can do that using their Discord bot profile, here's a few
            things you'll also be able to do, and a shiny button to do the deed.
          </p>
          <div className="flex justify-center mb-6">
            <button
              onClick={handleClick}
              className="text-base font-bold px-6 py-2"
            >
              Add Now
            </button>
          </div>

          <CommandPanel
            image="transmissions"
            title="Transmissions"
            description="Communicate with other Discord servers using Transmissions, discover different discord servers, and perhaps make new friends. Any servers you have previously transmitted with can be called again, so you can always get back to where you left off."
          />
          <CommandPanel
            image="nikogotchi"
            title="Nikogotchi"
            description="Take care of OneShot characters like a pet. You can feed them, pet them, send them off to find treasure, and MOST importantly, feed them pancakes. Otherwise they might perish. That might be bad."
          />
        </div>
      </Window>
    </Desktop>
  );
}
