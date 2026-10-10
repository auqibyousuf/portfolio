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
        paper: "#F4F5F7",
        card: "#FFFFFF",
        ink: "#0F1218",
        mute: "#5D6573",
        soft: "#E8EAEE",
        line: "rgba(15,18,24,0.10)",
        accent: "#D4223A",
        "accent-deep": "#B01A2F",
      },
      borderRadius: { card: "28px" },
      boxShadow: {
        card: "0 1px 0 rgba(15,18,24,0.04), 0 24px 50px -28px rgba(15,18,24,0.22)",
        lift: "0 1px 0 rgba(15,18,24,0.05), 0 36px 70px -30px rgba(15,18,24,0.3)",
      },
    },
  },
  plugins: [],
};
