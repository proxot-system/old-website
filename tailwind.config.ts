import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			darkMode: "class",

			backgroundImage: {
				twm: "url('/background.png')",
				"glens-bg": "url('/glens-background.png')",
			},
			colors: {
				"twm-logo-bg": "#170B23",
				"twm-logo-bg-light": "#210142",
				"twm-highlight": "#9319FF",
				"twm-sun": "#FFEB4A",

				"glens-dark": "#031245",
				"glens-light": "#009A80",
				"glens-highlight": "#01F9EE",
				"glens-accent": "#003A95",

				"refuge-dark": "#4A0D30",
				"refuge-light": "#94143A",
				"refuge-highlight": "#D45EA9",
			},
			fontFamily: {
				main: "TERMINUS",
			},
		},
	},
	plugins: [],
};
export default config;
