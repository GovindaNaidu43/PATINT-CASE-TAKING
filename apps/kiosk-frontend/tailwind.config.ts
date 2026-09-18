import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'royal-bg': '#0D0A1A',
        'royal-surface': '#1A1535',
        'royal-gold': '#C9A84C',
        'royal-crimson': '#8B1A1A',
        'royal-ivory': '#F5ECD7',
        'royal-teal': '#2DD4BF',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444'
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        sans: ['"Noto Sans"', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(201,168,76,0.4)',
      },
      borderRadius: {
        'mandala': '50%',
      }
    },
  },
  plugins: [],
}
export default config
