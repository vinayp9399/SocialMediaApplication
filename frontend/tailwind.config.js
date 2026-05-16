/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./context/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: {
          950: "#0A0A0F", 900: "#111118", 800: "#1A1A24",
          700: "#242433", 600: "#32324A", 500: "#4A4A6A",
          400: "#6B6B8E", 300: "#9090B0", 200: "#B8B8CC",
          100: "#E2E2EE", 50:  "#F4F4FA",
        },
        gold: { 500: "#F5A623", 400: "#F7B84B", 300: "#FAD07A" },
        jade: { 400: "#00D09C", 100: "#E0FBF4" },
        rose: { 600: "#E03E5A", 500: "#F04E6B", 100: "#FEE8EC" },
      },
      borderRadius: { 4: "4px", 8: "8px", 12: "12px" },
      boxShadow: { card: "0 1px 2px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)" },
      keyframes: {
        fadeUp: { "0%": { opacity: "0", transform: "translateY(10px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        shimmer: { "0%": { backgroundPosition: "200% 50%" }, "100%": { backgroundPosition: "-200% 50%" } },
      },
      animation: { "fade-up": "fadeUp 0.3s ease forwards", shimmer: "shimmer 1.5s ease infinite" },
    },
  },
  plugins: [],
};
