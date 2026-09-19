import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'royal-bg':      '#FAF3E8',   // warm cream
        'royal-surface': '#FFFDF8',   // card white
        'royal-gold':    '#B8863C',   // muted gold
        'royal-crimson': '#A7685D',   // warm terracotta
        'royal-ivory':   '#3E2E1E',   // dark brown text
        'royal-muted':   '#8A745A',   // muted brown
        'royal-border':  '#E8D9BC',   // soft gold border
        'royal-teal':    '#8CA383',   // sage green
        success:  '#8CA383',
        warning:  '#C9974B',
        error:    '#A7685D',
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        sans: ['"Noto Sans"', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 12px 28px rgba(184,134,60,0.12)',
      },
      borderRadius: {
        'mandala': '50%',
      },
      animation: {
        'spin-slow':      'spin 60s linear infinite',
        'spin-very-slow': 'spin-reverse 90s linear infinite',
      },
      keyframes: {
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to:   { transform: 'rotate(0deg)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
