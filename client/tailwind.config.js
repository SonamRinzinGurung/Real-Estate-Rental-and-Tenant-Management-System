/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ada2ff",
        primaryDark: "#8f86d7",
        secondary: "#EE9B01",
        secondaryDark: "#d48b02",
        tertiary: "#00ACCF",
        tertiaryDark: "#0496b4",
      },
    },
    fontFamily: {
      serif: ["Open Sans", "sans-serif"],
      display: ["Righteous", "sans-serif"],
      roboto: ["Roboto Condensed", "sans-serif"],
      robotoNormal: ["Roboto", "sans-serif"],
      heading: ["Montserrat", "sans-serif"],
    },
  },
  plugins: [],
};
