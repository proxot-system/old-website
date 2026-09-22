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
						<div className="text-base text-black p-4">Authenticating...</div>
					</Window>
				</Desktop>
			);
		} else if (status === "loading") {
			return (
				<Desktop>
					<Window title="Profile" className="">
						<div className="text-base text-black p-4">Loading...</div>
					</Window>
				</Desktop>
			);
		} else if (status === "authenticated") {
			return (
				<Desktop>
					<Window title="Profile" className="">
						<div className="text-base text-black p-4">Loading Profile...</div>
					</Window>
				</Desktop>
			);
		} else if (status === "error") {
			return (
				<Desktop>
					<Window title="Error!" className="">
						<div className="text-base text-black p-4">
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
						className="grid justify-center items-center p-4"
					>
						<div className="text-base text-black text-center">
							Session expired. Redirecting to login...
						</div>
					</Window>
				</Desktop>
			);
		}
	}

	const saveChanges = async () => {
		if (!userToUpdate) return;
		setSaveStatus("Saving...");
		try {
			await updateToDatabase(userToUpdate);
			setUserData(userToUpdate);
			setSaveStatus("Saved successfully!");
			setSaved(true);
		} catch (e) {
			console.error("Update failed, attempting re-auth", e);
			setSaveStatus("Save failed!");
			signIn("discord");
		}
	};

	const shouldSave = (data: Partial<UserData>) => {
		setUserToUpdate((prevUser) => ({ ...prevUser, ...data }) as UserData);
		setSaveStatus("Unsaved changes");
		setSaved(false);
	};

	const updateProfileDescription = (
		event: ChangeEvent<HTMLTextAreaElement>,
	) => {
		const newValue = event.target.value.substring(0, 250);
		shouldSave({ profile_description: newValue });
		setTextLength(newValue.length);
	};

	const updateBadgeNotifications = (e: React.ChangeEvent<HTMLInputElement>) => {
		shouldSave({ badge_notifications: e.target.checked });
		setChecked(e.target.checked);
	};

	const updateBackground = (background: string) => {
		shouldSave({ equipped_bg: background });
	};

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

			if (status === "unauthenticated") {
				signIn("discord");
				return;
			}

			setPageStatus("authenticating");

			try {
				if (!discordData || !discordData.access_token) {
					return;
				}

				const data = await DiscordLogIn(discordData);

				if (data === null) {
					console.warn(
						"Received null user data, session is likely invalid. Resetting session.",
					);
					await signOut({ redirect: false });
					signIn("discord");
					return;
				}

				setUserData(data);
				setPageStatus("authenticated");

				setTextLength(data.profile_description.length);
				setChecked(data.badge_notifications);
				setUserToUpdate({ ...data } as UserData);

				setPageStatus("success");
			} catch (error) {
				console.error("An unexpected error occurred during login:", error);
				setPageStatus("error");
			}
		};

		login();
	}, [discordData, status]);

	if (pageStatus === "success" && userToUpdate) {
		return (
			<Desktop>
				<Window title="Profile Properties" className="w-full">
					<div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-400">
						<span className="text-base font-bold text-black">{saveStatus}</span>
						<button
							onClick={saveChanges}
							type="button"
							disabled={saved}
							className="text-base font-bold py-1 px-4"
						>
							Save Changes
						</button>
					</div>

					<fieldset>
						<legend>Notifications</legend>
						<div className="flex items-center py-1">
							<input
								id="badge_notif"
								type="checkbox"
								checked={checked}
								onChange={updateBadgeNotifications}
								className="cursor-pointer mr-3"
							/>
							<label htmlFor="badge_notif" className="text-base text-black cursor-pointer select-none">
								Badge Notifications
							</label>
						</div>
					</fieldset>

					<fieldset>
						<legend>Profile Description</legend>
						<div className="flex justify-between items-center mb-1">
							<label htmlFor="description" className="text-base font-bold text-black">
								Bio:
							</label>
							<span className="text-sm text-gray-700">{textLength}/250</span>
						</div>
						<textarea
							id="description"
							name="description"
							value={userToUpdate?.profile_description ?? ""}
							onChange={updateProfileDescription}
							maxLength={250}
							rows={4}
							className="w-full text-base font-main p-2 text-black bg-white resize-none text-left box-border"
						/>
					</fieldset>

					<fieldset className="mb-0">
						<legend>Background Selection</legend>
						<BackgroundSelection
							ownedBackgrounds={userToUpdate?.owned_backgrounds ?? ["Default"]}
							equippedBackground={userToUpdate?.equipped_bg ?? "Default"}
							allBackgrounds={items?.backgrounds ?? {}}
							onChange={updateBackground}
						/>
					</fieldset>
				</Window>
			</Desktop>
		);
	} else {
		return PageStatus(pageStatus);
	}
}
