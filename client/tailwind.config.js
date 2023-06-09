/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lightGreen: "rgb(34,44,50)",
        darkGreen: "rgb(19,27,32)",
        lighterGreen: "rgb(45,57,66)",
        midGreen: "rgb(38,91,76)",
      },
    },
  },
  plugins: [],
};
