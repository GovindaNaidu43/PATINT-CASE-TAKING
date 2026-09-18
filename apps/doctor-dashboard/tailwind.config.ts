import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'royal-bg': '#FAF3E8',
        'royal-surface': '#FFFDF8',
        'royal-sidebar': '#FBF7EF',
        'royal-gold': '#B8863C',
        'royal-crimson': '#A7685D',
        'royal-ivory': '#3E2E1E',
        'royal-teal': '#8CA383',
        success: '#8CA383',
        warning: '#C9974B',
        error: '#A7685D',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        sans: ['Nunito Sans', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 12px 28px rgba(184,134,60,0.10)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
