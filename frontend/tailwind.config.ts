import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0a0a0b",
          900: "#111113",
          800: "#1a1a1d",
          700: "#26262b",
          600: "#3a3a40",
          500: "#57575f",
          400: "#86868f",
          300: "#b4b4ba",
          200: "#dcdce0",
          100: "#eeeef0",
          50: "#f7f7f8",
        },
        accent: {
          DEFAULT: "#3b5bfd",
          dark: "#2a44d6",
          light: "#eef1ff",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(10,10,11,0.04), 0 1px 1px 0 rgba(10,10,11,0.02)",
        nav: "0 -1px 0 0 rgba(10,10,11,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
