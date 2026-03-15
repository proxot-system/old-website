import { ObjectId } from "mongodb";

interface OwnedTreasures {
	[treasure: string]: number;
}

export class UserData {
	constructor(
		public wool: number = 5000,
		public suns: number = 0,
		public translation_language: string = "english",
		public profile_description: string = "Hello!",
		public badge_notifications: boolean = true,
		public ask_limit: number = 14,
		public last_asked: Date = new Date(2000, 1, 1, 0, 0, 0),
		public daily_sun_timestamp: Date = new Date(2000, 1, 1, 0, 0, 0),
		public daily_wool_timestamp: Date = new Date(2000, 1, 1, 0, 0, 0),
		public equipped_bg: string = "Default",
		public owned_backgrounds: string[] = [
			"Default",
			"Blue",
			"Red",
			"Green",
			"Pink",
			"Yellow",
		],
		public owned_badges: string[] = [],
		public owned_treasures: OwnedTreasures = { journal: 5 },
		public times_asked: number = 0,
		public times_shattered: number = 0,
		public times_transmitted: number = 0,
		public _id?: string,
	) {}
}

export interface NikogotchiValues {
	value: number;
	max: number;
}

export interface NikogotchiData {
	last_interacted: Date;
	hatched: Date;
	nikogotchi_available: boolean;
	rarity: string;

	_id?: string;
	data: object;
	pancakes: number;
	golden_pancakes: number;
	glitched_pancakes: number;

	level: number;
	health: NikogotchiValues;
	energy: NikogotchiValues;
	hunger: NikogotchiValues;
	cleanliness: NikogotchiValues;
	happiness: NikogotchiValues;

	room_data: number[];
	name: string;
	status: number;
	immortal: boolean;
}

export interface LeaderboardUser {
	name: string;
	type: string;
	data: UserData;
}

export function ParseType(data: string) {
	try {
		return Number(data);
	} catch (error) {
		try {
			return JSON.parse(data);
		} catch (error) {
			return data;
		}
	}
}

interface Background {
	purchasable: number;
	cost: number;
	image: string;
}

export interface Backgrounds {
	[key: string]: Background;
}

export interface Item {
	id: string;
	cost: number;
	image: string;
}

interface Treasure {
	cost: number;
	image: string;
}

export interface Treasures {
	[key: string]: Treasure;
}

interface Badge {
	id: number;
	image: string;
	type: string;
	requirement: number;
	emoji: string;
}

export interface Badges {
	[key: string]: Badge;
}

export interface NikogotchiInformation {
	name: string;
	emoji: string;
	type: string;
}

export interface ItemData {
	backgrounds: Backgrounds;
	items: {
		capsules: Item[];
		pancakes: Item[];
		treasures: Treasures;
	};
	badges: Badges;
	nikogotchi: NikogotchiInformation[];
}

export interface BlogPost {
	title: string;
	content: string;
	description: string;
	datetime: Date;
	post_id: number;
}
