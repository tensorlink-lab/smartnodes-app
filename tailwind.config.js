/** @type {import('tailwindcss').Config} */

const defaultTheme = "dark";

module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  mode: "jit",
  theme: {
    extend: {
      colors: {
        light: "rgba(0, 60, 255, 0.15)",
        dark: "rgba(5, 5, 5, 1)",
        secondary: "rgba(26, 82, 255, 0.91)",
        dimWhite: "rgba(255, 255, 255, 0.7)",
        dimBlue: "rgba(9, 151, 124, 0.1)",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
    screens: {
      xxs: "250px",
      xs: "400px",
      ss: "550px",
      sm: "670px",
      md: "860px",
      lg: "1150px",
      xl: "1500px",
      xxl: "1900px",
      veryshort: { raw: "(max-height: 750px)" },
      short: { raw: "(max-height: 1000px)" },
      tall: { raw: "(max-height: 1400px)" },
    },
  },
  plugins: [],
  variants: {
    extend: {
      display: ["responsive"],
    },
  },
};
