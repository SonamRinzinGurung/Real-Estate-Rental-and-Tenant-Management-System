/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#68904D",
        primaryLight: "#8ABF6F",
        primaryDark: "#14471E",
        secondary: "#EE9B01",
        tertiary: "#DA6A00",
      },
    },
    fontFamily: {
      serif: ["Cabin", "sans-serif"],
      display: ["Roboto Condensed", "sans-serif"],
    },
  },
  plugins: [],
};
