import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        colorSkyBlue: "#ffbc53",
        colorDeepCharcoal: "#222434",
        colorMidnightNavy: "#161829",
        colorSlateBlue: "#4C4D5A",
        colorMintGreen: "#4cffd7",
        textbase: "#c5c5ca",
        titlebase: "#fff", //white
        titlebase2: "#ffbc53", // SkyBlue
        titlebase3: "#4cffd7", // MintGreen
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        chakra: ["Chakra Petch", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;


