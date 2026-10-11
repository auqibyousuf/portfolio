/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque Variable"', "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ['"Manrope Variable"', "ui-sans-serif", "system-ui", "sans-serif"],
        script: ['"Mrs Saint Delafield"', "cursive"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        paper: "rgb(var(--paper) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        onink: "rgb(var(--onink) / <alpha-value>)",
        mute: "rgb(var(--mute) / <alpha-value>)",
        soft: "rgb(var(--soft) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        night: "rgb(var(--night) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-deep": "rgb(var(--accent-deep) / <alpha-value>)",
      },
      borderRadius: { card: "28px" },
      boxShadow: {
        card: "0 1px 0 rgb(var(--ink) / 0.04), 0 24px 50px -28px rgb(var(--ink) / 0.22)",
        lift: "0 1px 0 rgb(var(--ink) / 0.05), 0 36px 70px -30px rgb(var(--ink) / 0.3)",
      },
    },
  },
  plugins: [],
};
