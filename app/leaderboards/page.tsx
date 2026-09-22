"use client";
import Desktop from "../components/desktop";
import Window from "../components/window";
import icons from "./icons.json";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { GetLeaderboard } from "../database";
import { LeaderboardUser } from "../components/database-parse-type";

function Title({ children }: { children: React.ReactNode }) {
	return <div className="text-xl font-bold text-black text-center mb-1">{children}</div>;
}

function Header({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex window justify-center items-center text-lg font-bold text-black text-center py-1">
			{children}
		</div>
	);
}

function TWMTable({ children }: { children: React.ReactNode }) {
	return <div className="flex justify-center w-full">{children}</div>;
}

function TableNumberColumn({ children }: { children: React.ReactNode }) {
	return <div className="flex flex-col w-10 sm:w-11 flex-shrink-0">{children}</div>;
}

function TableUserColumn({ children }: { children: React.ReactNode }) {
	return <div className="flex flex-col flex-1 min-w-0">{children}</div>;
}

function TableAmountColumn({ children }: { children: React.ReactNode }) {
	return <div className="flex flex-col w-28 sm:w-32 flex-shrink-0">{children}</div>;
}

function TableHeader({ name }: { name: string }) {
	return (
		<div className="window text-center text-black flex items-center justify-center h-9 box-border">
			<p className="text-base font-bold truncate px-1">{name}</p>
		</div>
	);
}

function TableItem({ item, className = "" }: { item: string; className?: string }) {
	return (
		<div className={`flex items-center justify-center bg-white text-black px-2 h-9 border border-gray-400 box-border ${className}`}>
			<p className="text-base truncate">{item}</p>
		</div>
	);
}

function PageStatus(status: string) {
	if (status === "loading") {
		return (
			<Desktop>
				<Window title="Leaderboards" className="sm:w-[540px]">
					<div className="text-base text-black p-4">Loading...</div>
				</Window>
			</Desktop>
		);
	} else if (status === "authing") {
		return (
			<Desktop>
				<Window title="Leaderboards" className="sm:w-[540px]">
					<div className="text-base text-black p-4">Authenticating...</div>
				</Window>
			</Desktop>
		);
	} else if (status === "error") {
		return (
			<Desktop>
				<Window title="Error!" className="sm:w-[540px]">
					<div className="text-base text-black p-4">
						An error has occurred. Please try again later.
					</div>
				</Window>
			</Desktop>
		);
	} else if (status === "unauthenticated") {
		return (
			<Desktop>
				<Window title="Error!" className="sm:w-[540px] grid justify-center items-center p-4">
					<div className="text-base text-black text-center mb-4">
						You need to be signed in to Discord to access this page!
					</div>
					<div className="flex justify-center gap-3">
						<button onClick={() => signIn("discord")} className="text-base font-bold py-1 px-4">Sign In</button>
						<button onClick={() => (window.location.href = "/")} className="text-base font-bold py-1 px-4">Okay</button>
					</div>
				</Window>
			</Desktop>
		);
	}
}

function Page(
	wool: LeaderboardUser[],
	suns: LeaderboardUser[],
	times_shattered: LeaderboardUser[],
	times_transmitted: LeaderboardUser[],
) {
	return (
		<Desktop>
			<Window title="Leaderboards" className="sm:w-[540px]">
				<Title>Global Leaderboards</Title>
				<p className="text-center text-sm text-gray-700 mb-3">(Loading may take a while.)</p>

				<Header>
					<span className="mr-2">Suns</span>{" "}
					<img src={icons.sun_icon} alt="Suns" className="h-6 w-6 inline" />
				</Header>
				<div className="mt-1" />
				{AssignToLeaderboard("suns", suns)}
				<div className="mt-4" />

				<Header>
					<span className="mr-2">Times Shattered</span>{" "}
					<img src={icons.explode_icon} alt="Times Shattered" className="h-6 w-6 inline" />
				</Header>
				<div className="mt-1" />
				{AssignToLeaderboard("times_shattered", times_shattered)}
				<div className="mt-4" />

				<Header>
					<span className="mr-2">Times Transmitted</span>{" "}
					<img src={icons.transmit_icon} alt="Times Transmitted" className="h-6 w-6 inline" />
				</Header>
				<div className="mt-1" />
				{AssignToLeaderboard("times_transmitted", times_transmitted)}
				<div className="mt-4" />

				<Header>
					<span className="mr-2">Wool</span>{" "}
					<img src={icons.wool_icon} alt="Wool" className="h-6 w-6 inline" />
				</Header>
				<div className="mt-1" />
				{AssignToLeaderboard("wool", wool)}
				<div className="mt-4" />
			</Window>
		</Desktop>
	);
}

function AssignToLeaderboard(
	type_name: string,
	leaderboard: LeaderboardUser[],
) {
	if (leaderboard.length === 0) {
		return (
			<TWMTable>
				<TableNumberColumn>
					<TableHeader name="#" />
					<TableItem item="1." />
				</TableNumberColumn>
				<TableUserColumn>
					<TableHeader name="User" />
					<TableItem item="Loading..." />
				</TableUserColumn>
				<TableAmountColumn>
					<TableHeader name="Amount" />
					<TableItem item="Loading..." />
				</TableAmountColumn>
			</TWMTable>
		);
	} else {
		return (
			<TWMTable>
				<TableNumberColumn>
					<TableHeader name="#" />
					{leaderboard.map((_user, index) => (
						<TableItem item={`${index + 1}.`} key={index} />
					))}
				</TableNumberColumn>
				<TableUserColumn>
					<TableHeader name="User" />
					{leaderboard.map((user, index) => (
						<TableItem item={user.name} key={index} className="truncate" />
					))}
				</TableUserColumn>
				<TableAmountColumn>
					<TableHeader name="Amount" />
					{leaderboard.map((user, index) => {
						const rawValue = (user.data as any)?.[type_name];
						const displayValue =
							rawValue !== undefined && rawValue !== null
								? typeof rawValue === "number"
									? rawValue.toLocaleString()
									: String(rawValue)
								: "0";
						return <TableItem item={displayValue} key={index} />;
					})}
				</TableAmountColumn>
			</TWMTable>
		);
	}
}

export default function Main() {
	const [pageStatus, setPageStatus] = useState("loading");

	const [rankedWoolUsers, setRankedWoolUsers] = useState<LeaderboardUser[]>([]);
	const [rankedSunUsers, setRankedSunUsers] = useState<LeaderboardUser[]>([]);
	const [rankedTimesTransmittedUsers, setRankedTimesTransmittedUsers] =
		useState<LeaderboardUser[]>([]);
	const [rankedTimesShatteredUsers, setRankedTimesShatteredUsers] = useState<
		LeaderboardUser[]
	>([]);

	useEffect(() => {
		async function grabLeaderboardData() {
			try {
				setRankedSunUsers(await GetLeaderboard("suns"));
				setRankedTimesShatteredUsers(await GetLeaderboard("times_shattered"));
				setRankedTimesTransmittedUsers(
					await GetLeaderboard("times_transmitted"),
				);
				setRankedWoolUsers(await GetLeaderboard("wool"));

				setPageStatus("success");
			} catch (error) {
				console.error("Error fetching leaderboard data:", error);
				setPageStatus("error");
			}
		}

		grabLeaderboardData();
	}, []);

	if (pageStatus === "error") {
		return PageStatus("error");
	}

	return Page(
		rankedWoolUsers,
		rankedSunUsers,
		rankedTimesShatteredUsers,
		rankedTimesTransmittedUsers,
	);
}
