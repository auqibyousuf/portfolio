/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lexend', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Lexend', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: "#09110c",
        moss: "#101b14",
        ink: "#eef2e6",
        mute: "#9db0a1",
        leaf: "#cfe8b4",
        bloom: "#f2c9d4",
        line: "rgba(238,242,230,0.12)",
      },
    },
  },
  plugins: [],
};
