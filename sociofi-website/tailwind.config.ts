import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  darkMode: "class",
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1440px',
    },
    extend: {
      colors: {
        navy: { DEFAULT: "#3A589E", deep: "#2C4478", bright: "#4A6CB8" },
        teal: { DEFAULT: "#59A392", light: "#72C4B2", pale: "#A3DFD2" },
        studio: "#72C4B2",
        services: "#4DBFA8",
        labs: "#7B6FE8",
        products: "#E8916F",
        academy: "#E8B84D",
        ventures: "#6BA3E8",
        cloud: "#5BB5E0",
        dark: { DEFAULT: "#0C0C1D", 2: "#111128", 3: "#161636", card: "#13132B" },
        light: { DEFAULT: "#FAFBFE", 2: "#F1F4F9", 3: "#E8ECF4", card: "#FFFFFF" },
        slate: { dim: "#4A5578", mid: "#7C8DB0", char: "#CBD5E1" },
      },
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        body: ["var(--font-outfit)", "sans-serif"],
        mono: ["var(--font-fira)", "monospace"],
      },
      borderRadius: {
        sm: "10px",
        md: "16px",
        lg: "24px",
        xl: "32px",
      },
      spacing: {
        section: "120px",
        "section-sm": "80px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "grid-drift": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(80px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        shimmer: "shimmer 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "grid-drift": "grid-drift 20s linear infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
