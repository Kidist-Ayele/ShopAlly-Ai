// tailwind.config.ts
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-white": "#ffffff",
        "brand-yellow": "#ffd300",
        "brand-gray": "#757b81",
        "brand-darkGray": "#262b32",
        "brand-dark": "#090c11",
      },
    },
  },
  plugins: [],
};
