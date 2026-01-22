// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  // 只有 index.html 設定 .dark 時才會深色模式, 在 main.ts 以強制為淺色模式
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [],
};
