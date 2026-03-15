"use client";
import React from "react";
import Image from "next/image";
import NavBar from "../components/NavBar/nav-bar";
import CommandPanel from "../components/command_panels/command-panels";
import Footer from "../components/footer";
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
      <Window title="Invite" className="max-w-[800px]">
        <div className="flex justify-center flex-col font-main my-10 mx-10">
          <p className="text-center text-lg text-black mb-5">
            You want to invite the Proxot System? That's great! Here are a few
            features to win you over more, and a shiny button to do the deed.
          </p>
          <button
            onClick={handleClick}
            className="flex justify-between text-black w-[200px] mx-auto h-16 mb-10"
          >
            <h1 className="mr-2 text-2xl my-auto">Invite Now!!!</h1>
          </button>

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
