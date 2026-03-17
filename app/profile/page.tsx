"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { type ChangeEvent, useEffect, useState } from "react";
import type { ItemData, UserData } from "../components/database-parse-type";
import Desktop from "../components/desktop";
import BackgroundSelection from "../components/profile/background-selector";
import Window from "../components/window";
import { FetchItemData, Update as updateToDatabase } from "../database";
import { DiscordLogIn } from "../discord";

export default function Profile() {
	const [pageStatus, setPageStatus] = useState("loading");

	const [userData, setUserData] = useState<null | UserData>(null);
	const [userToUpdate, setUserToUpdate] = useState<null | UserData>(null);

	const [userID, setUserID] = useState<null | string>(null);
	const [saveToDatabase, setSaveToDatabase] = useState<boolean>(false);

	const [items, setItems] = useState<ItemData>();
	const [textLength, setTextLength] = useState<number>(0);
	const [checked, setChecked] = useState(false);

	const [saveStatus, setSaveStatus] = useState("...");
	const [saved, setSaved] = useState(true);

	const { data: discordData, status } = useSession();

	useEffect(() => {
		if (status === "unauthenticated") {
			signIn("discord");
		}
	}, [status]);

	function PageStatus(status: string) {
		if (status === "authenticating") {
			return (
				<Desktop>
					<Window title="Profile" className="">
						<div className="text-xl text-black">Authenticating...</div>
					</Window>
				</Desktop>
			);
		} else if (status === "loading") {
			return (
				<Desktop>
					<Window title="Profile" className="">
						<div className="text-xl text-black">Loading...</div>
					</Window>
				</Desktop>
			);
		} else if (status === "authenticated") {
			return (
				<Desktop>
					<Window title="Profile" className="">
						<div className="text-xl text-black">Loading Profile...</div>
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
		} else if (status === "unauthenticated") {
			return (
				<Desktop>
					<Window
						title="Redirecting..."
						className="grid justify-center items-center"
					>
						<div className="text-xl text-black text-center">
							Session expired. Redirecting to login...
						</div>
					</Window>
				</Desktop>
			);
		}
	}

	function Page() {
		const saveChanges = () => {
			setSaveToDatabase(true);

			setUserData(userToUpdate);
			setSaveStatus("...");
			setSaved(true);
		};

		const shouldSave = (data: any) => {
			setUserToUpdate((prevUser) => ({ ...prevUser, ...data }) as UserData);

			setSaveStatus("You have unsaved changes!");
			setSaved(false);
		};

		const updateLanguage = (value: string) => {
			shouldSave({ translation_language: value });
		};

		const updateProfileDescription = (
			event: ChangeEvent<HTMLTextAreaElement>,
		) => {
			const newValue = event.target.value.substring(0, 250);
			shouldSave({ profile_description: newValue });
			setTextLength(newValue.length);
		};

		const updateBadgeNotifications = (e: any) => {
			shouldSave({ badge_notifications: e.target.checked });
			setChecked(e.target.checked);
		};

		const updateBackground = (background: string) => {
			shouldSave({ equipped_bg: background });
		};

		return (
			<Desktop>
				<Window title="Profile" className="max-w-[500px]">
					<div className="window w-full sticky top-0 bg-opacity-100 z-10">
						<div className="font-main flex justify-center">
							<p className="text-sm sm:text-xl text-center text-black mr-6 my-auto">
								{saveStatus}
							</p>
							<button
								onClick={saveChanges}
								type="submit"
								disabled={saved}
								className={
									saved
										? "hover:cursor-not-allowed text-xl mb-2 my-2"
										: "text-xl mb-2 my-2"
								}
							>
								Save Changes
							</button>
						</div>
					</div>

					<div className="font-main my-10 mx-10 grid place-content-center">
						<h1 className="text-3xl ml-5 text-black text-center">Settings</h1>
						<div className="field-row mx-auto scale-150">
							<label className="text-black">
								<input
									title="Disable or enable badge notifications. If enabled, this will show you when you get a new badge."
									type="checkbox"
									checked={checked}
									onChange={updateBadgeNotifications}
								/>{" "}
								Badge Notifications
							</label>
						</div>

						<hr className="my-10" />

						<h1 className="text-3xl mt-2 text-black text-center">Profile</h1>

						<h1 className="text-xl text-black text-center mt-5 mb-5">
							Description
						</h1>
						<h1 className="text-black text-sm text-right">{textLength}/250</h1>
						<textarea
							id="description"
							name="description"
							title="Change your profile description. This shows up when you run the /profile <user> command."
							value={userToUpdate?.profile_description ?? ""}
							onChange={(e) => updateProfileDescription(e)}
							maxLength={250}
							className="field-row resize-none text-black text-lg p-2 mb-2 text-center"
						/>

						<h1 className="text-xl text-black text-center mt-5 mb-5">
							Background
						</h1>

						<BackgroundSelection
							ownedBackgrounds={userToUpdate?.owned_backgrounds ?? ["Default"]}
							equippedBackground={userToUpdate?.equipped_bg ?? "Default"}
							allBackgrounds={items?.backgrounds ?? {}}
							onChange={updateBackground}
						/>
					</div>
				</Window>
			</Desktop>
		);
	}

	useEffect(() => {
		const fetchItems = async () => {
			const data = await FetchItemData();

			if (!data) {
				console.error("For some reason data was never fetched.");
				setPageStatus("error");
				return;
			}

			setItems(data);
		};

		fetchItems();
	}, []);

	useEffect(() => {
		const login = async () => {
			if (pageStatus === "success") {
				return;
			}

			if (status === "loading") {
				setPageStatus("loading");
				return;
			}

			setPageStatus("authenticating");

			try {
				if (!discordData) {
					setPageStatus("unauthenticated");
					return;
				}

				if (!discordData?.access_token) {
					return;
				}

				const data = await DiscordLogIn(discordData);

				if (data == null) {
					setPageStatus("error");
					return;
				}

				setUserData(data);

				setPageStatus("authenticated");

				setTextLength(data.profile_description.length);
				setChecked(data.badge_notifications);
				setUserToUpdate({ ...data } as UserData);

				setPageStatus("success");
			} catch (error: any) {
				if (error.message === "AUTH_REQUIRED") {
					console.warn("Session is invalid, triggering re-authentication.");
					await signOut({ redirect: false });
					signIn("discord");
				} else {
					console.error("Error fetching data from discord:", error);
					setPageStatus("error");
				}
			}
		};

		login();
	}, [discordData, status]);

	useEffect(() => {
		const updateData = async () => {
			if (!saveToDatabase) {
				return;
			}
			if (!userData) {
				return;
			}

			try {
				await updateToDatabase(userData);
			} catch (e: any) {
				if (e.message === "AUTH_REQUIRED") {
					await signOut({ redirect: false });
					signIn("discord");
				}
			}

			setSaveToDatabase(false);
		};

		updateData();
	}, [saveToDatabase]);

	if (pageStatus === "success") {
		return Page();
	} else {
		return PageStatus(pageStatus);
	}
}