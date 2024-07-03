/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        sma: { max: "639px" },
      },
      keyframes: {
        fade: {
          "0%": {
            opacity: 0,
            transform: "translateX(45%)",
          },
          "100%": {
            opacity: 100,
            transform: "translateX(0%)",
          },
        },
      },
      animation: {
        "spin-fast": "spin .8s linear infinite",
      },
    },
  },
  plugins: [],
};
