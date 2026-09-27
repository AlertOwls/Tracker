/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        foreground: "#f4f4f5",
        card: {
          DEFAULT: "#121215",
          foreground: "#f4f4f5",
        },
        popover: {
          DEFAULT: "#121215",
          foreground: "#f4f4f5",
        },
        primary: {
          DEFAULT: "#fafafa",
          foreground: "#18181b",
        },
        secondary: {
          DEFAULT: "#27272a",
          foreground: "#f4f4f5",
        },
        muted: {
          DEFAULT: "#27272a",
          foreground: "#a1a1aa",
        },
        accent: {
          DEFAULT: "#27272a",
          foreground: "#f4f4f5",
        },
        border: "#27272a",
        input: "#27272a",
        ring: "#d4d4d8",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
    },
  },
  plugins: [],
};
