/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				background: "#0a0a0c",
				foreground: "#ffffff",
				card: "#121216",
				border: "#25252b",
				primary: "#3b82f6",
				accent: "#8b5cf6",
			}
		},
	},
	plugins: [],
}
