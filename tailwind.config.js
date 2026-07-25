/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#080c18",
        surface: "#0f1623",
        surface2: "#162032",
        surface3: "#1d2a3f",
        accent: "#00e5a0",
        accent2: "#00b87e",
        accentBlue: "#3b82f6",
        accentBlueDark: "#1d4ed8",
        danger: "#ef4444",
        warn: "#f59e0b",
        safe: "#10b981",
        purpleTag: "#a78bfa"
      },
      fontFamily: {
        sans: ['Instrument Sans', 'sans-serif'],
        syne: ['Syne', 'sans-serif']
      }
    },
  },
  plugins: [],
}
