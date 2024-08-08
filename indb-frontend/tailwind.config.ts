import type { Config } from "tailwindcss";

const config: Config = {
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
        indblight: {
          "50": "#f0f8ff",
          "100": "#e0effe",
          "200": "#bbe0fc",
          "300": "#7fc8fa",
          "400": "#28a4f4",
          "500": "#1192e6",
          "600": "#0573c4",
          "700": "#055b9f",
          "800": "#094e83",
          "900": "#0e426c",
          "950": "#092a48",
        },
        indbdark: {
          "50": "#eaf4ff",
          "100": "#d9eaff",
          "200": "#bad6ff",
          "300": "#91baff",
          "400": "#6590ff",
          "500": "#4267ff",
          "600": "#213bff",
          "700": "#162bec",
          "800": "#1528be",
          "900": "#1a2a95",
          "950": "#080c2c",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
export default config;
