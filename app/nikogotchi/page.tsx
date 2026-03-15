"use client";

import { signIn, useSession } from "next-auth/react";
import Desktop from "../components/desktop";
import Window from "../components/window";
import { useState, useEffect } from "react";
import axios from "axios";

import {
  Fetch as fetchFromDatabase,
  FetchItemData,
  GetBackgrounds,
  GetNikogotchiData,
  Update as updateToDatabase,
} from "../database";
import { redirect } from "next/navigation";

export default function Page() {
  const [pageStatus, setPageStatus] = useState("loading");
  const [userID, setUserID] = useState<null | string>(null);

  function PageStatus(status: string) {
    if (status === "authenticating") {
      return (
        <Desktop>
          <Window title="Nikogotchi" className="">
            <div className="text-xl text-black">Authenticating...</div>
          </Window>
        </Desktop>
      );
    } else if (status === "loading") {
      return (
        <Desktop>
          <Window title="Nikogotchi" className="">
            <div className="text-xl text-black">Loading...</div>
          </Window>
        </Desktop>
      );
    } else if (status === "authenticated") {
      return (
        <Desktop>
          <Window title="Nikogotchi" className="">
            <div className="text-xl text-black">Loading Nikogotchi...</div>
          </Window>
        </Desktop>
      );
    } else if (status === "error") {
      return (
        <Desktop>
          <Window title="Error!" className="">
            <div className="text-xl text-black">
              An error has occurred. Please try again later.
            </div>
          </Window>
        </Desktop>
      );
    } else if (status === "no-nikogotchi") {
      return (
        <Desktop>
          <Window title="Error!" className="">
            <div className="text-l text-black">
              You don't have a Nikogotchi! Use the shop to buy a capsule and
              then use /nikogotchi check!
            </div>
            <img
              className="mx-auto"
              src="/nikogotchi/demonstration.gif"
              width={300}
            />
            <button onClick={() => (window.location.href = "/profile")}>
              Go Back
            </button>
          </Window>
        </Desktop>
      );
    } else if (status === "unauthenticated") {
      return (
        <Desktop>
          <Window title="Error!" className="grid justify-center items-center">
            <div className="text-xl text-black text-center">
              You need to be signed in to Discord to access this page!
            </div>
            <div className="mx-auto mt-5 scale-120">
              <button onClick={() => signIn("discord")}>Sign In</button>{" "}
              <button onClick={() => (window.location.href = "/")}>Okay</button>
            </div>
          </Window>
        </Desktop>
      );
    }
  }

  const { data: discordData, status } = useSession();

  useEffect(() => {
    const login = async () => {
      if (pageStatus === "success") {
        return;
      } // We don't need to get discord data when page is successfully loaded.

      if (status === "loading") {
        setPageStatus("loading");
        return;
      }

      setPageStatus("authenticating");

      try {
        if (!discordData) {
          // If discordData is null, then user has not signed in to the website.
          setPageStatus("unauthenticated");
          return;
        }

        if (!discordData?.access_token) {
          return;
        } // If there's no access token then we don't need to do anything yet.

        const response = await axios.get("https://discord.com/api/users/@me", {
          headers: { Authorization: `Bearer ${discordData.access_token}` },
        });

        setUserID(response.data.id);
      } catch (error) {
        console.error("Error fetching data from discord:", error);
        setPageStatus("error");
      }
    };

    login();
  }, [discordData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userID) {
          return;
        } // Don't do anything if we don't have the userID yet.

        if (pageStatus === "success") {
          return;
        }

        setPageStatus("authenticated");

        const data = await GetNikogotchiData(userID);

        console.log(data);

        if (!data) {
          console.error("For some reason data was never fetched.");
          setPageStatus("error"); // Run error scenario if data doesn't exist... for whatever reason.
          return;
        }

        setPageStatus("no-nikogotchi");
      } catch (error) {
        console.error("Error fetching data from database:", error);
        setPageStatus("error");
      }
    };

    fetchData();
  }, [userID]);

  if (pageStatus === "success") {
    return Page();
  } else {
    return PageStatus(pageStatus);
  }
}
