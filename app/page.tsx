"use client";
import Desktop from "./components/desktop";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Window from "./components/window";

export default function Page() {
  const [currentWindow, setCurrentWindow] = useState<any>(<div />);
  const [index, setIndex] = useState(0);

  let seenIntroduction = Cookies.get("seen_intro");

  useEffect(() => {
    if (seenIntroduction === "true") {
      return;
    }

    switch (index) {
      case 0:
        setCurrentWindow(() => {
          return (
            <Window title="???" className="">
              <p className="text-xl text-black mb-2">...</p>
              <button
                className="mx-uato position-relative text-lg"
                onClick={() => {
                  setIndex((prev) => prev + 1);
                }}
              >
                Ok
              </button>
            </Window>
          );
        });
        break;
      case 1:
        setCurrentWindow(() => {
          return (
            <Window title="???" className="">
              <p className="text-xl text-black mb-2">You got to this place.</p>
              <button
                className="mx-auto position-relative text-lg"
                onClick={() => {
                  setIndex((prev) => prev + 1);
                }}
              >
                Ok
              </button>
            </Window>
          );
        });
        break;
      case 2:
        setCurrentWindow(() => {
          return (
            <Window title="???" className="">
              <p className="text-xl text-black mb-2">...Why?</p>
              <button
                className="mx-auto position-relative text-lg"
                onClick={() => {
                  setIndex((prev) => prev + 1);
                }}
              >
                Ok
              </button>
            </Window>
          );
        });
        break;
      case 3:
        setCurrentWindow(() => {
          return (
            <Window title="???" className="">
              <p className="text-xl text-black mb-2">
                You're already too late. This World is just like the
                others.
              </p>
              <button
                className="mx-auto position-relative text-lg"
                onClick={() => {
                  setIndex((prev) => prev + 1);
                }}
              >
                Ok
              </button>
            </Window>
          );
        });
        break;
      case 4:
        setCurrentWindow(() => {
          return (
            <Window title="???" className="">
              <p className="text-xl text-black mb-2">
                This will be apparent when you see some of the characters.
              </p>
              <button
                className="mx-auto position-relative text-lg"
                onClick={() => {
                  setIndex((prev) => prev + 1);
                }}
              >
                Ok
              </button>
            </Window>
          );
        });
        break;
      case 4:
        setCurrentWindow(() => {
          return (
            <Window title="???" className="">
              <p className="text-xl text-black mb-2">
                This place was never worth your time.
              </p>
              <button
                className="mx-auto position-relative text-lg"
                onClick={() => {
                  setIndex((prev) => prev + 1);
                }}
              >
                Ok
              </button>
            </Window>
          );
        });
        break;
      case 5:
        setCurrentWindow(() => {
          return (
            <Window title="???" className="">
              <p className="text-xl text-black mb-2">
                Do you still want to get in?
              </p>
              <button
                className="mx-auto position-relative text-lg"
                onClick={() => {
                  setIndex((prev) => prev + 1);
                }}
              >
                Ok
              </button>
            </Window>
          );
        });
        break;
      case 6:
        setCurrentWindow(() => {
          return (
            <Window title="???" className="">
              <p className="text-xl text-black mb-2">
                Very well. Then remember this.
              </p>
              <button
                className="mx-auto position-relative text-lg"
                onClick={() => {
                  setIndex((prev) => prev + 1);
                }}
              >
                Ok
              </button>
            </Window>
          );
        });
        break;
      case 7:
        setCurrentWindow(<div />);
        alert("You only have one shot, user.");
        Cookies.set("seen_intro", "true");
        break;
    }
  }, [index]);

  return <Desktop>{currentWindow}</Desktop>;
}
