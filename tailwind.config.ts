import type { Config } from "tailwindcss";

const config: Config = {
  prefix: "tw-", // Custom prefix
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "custom-yellow": "#FFD89C",
        "custom-gray": "#E5E5E5",
        "custom-green": "#A2CDB0",
        "custom-green-button": "#DBFFAF",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        modalFadeIn: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        modalFadeOut: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.8)", opacity: "0" },
        },
        modalContentFadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        modalContentFadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
        fadeOut: "fadeOut 0.5s ease-in-out",
        modalFadeIn: "modalFadeIn 0.5s ease-in-out",
        modalFadeOut: "modalFadeOut 0.5s ease-in-out",
        modalContentFadeIn: "modalContentFadeIn 0.5s ease-in-out",
        modalContentFadeOut: "modalContentFadeOut 0.5s ease-in-out",
      },
      screens: {
        "custom-sm": { raw: "(max-width: 639px)" },
      },
      writingMode: {
        vertical: 'vertical-rl',
      },
    },
  },
  plugins: [],
};

export default config;
