// tailwind.config.ts
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          white: "#ffffff",
          yellow: "#ffd300",
          gray: "#757b81",
          dark: "#262b32",
          black: "#090c11",
        },
      },
    },
  },
  plugins: [],
};
