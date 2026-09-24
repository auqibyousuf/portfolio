/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"JetBrains Mono"', 'monospace'],
        display: ['"JetBrains Mono"', 'monospace'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        bg: "hsl(var(--bg))",
        surface: "hsl(var(--surface))",
        "text-primary": "hsl(var(--text))",
        muted: "hsl(var(--muted))",
        stroke: "hsl(var(--stroke))",
        accent: "hsl(var(--accent))",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate")
  ],
}
