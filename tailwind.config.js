/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./pages/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: { min: "300px", max: "600px" },
      xsm: { min: "300px", max: "1023px" },
      md: { min: "600px", max: "1023px" },
      lg: { min: "1024px" },
      lg2: { min: "1092px" },
      xl: { min: "1280px" },
      "2xl": { min: "1536px" },
      "3xl": { min: "1792px" },
    },
    boxShadow: {},
    extend: {
      backgroundImage: () => ({}),
      gridTemplateColumns: {},
      gridTemplateRows: {},
      colors: {
        primary: "#D2FF3A",
      },
    },
    plugins: [],
  },
  plugins: [],
};
