// Unified Design Tokens for MediKiosk Platform (Kiosk, Doctor Dashboard, Mobile Companion)
export const colors = {
  royalBg: '#FAF3E8', // Warm cream
  royalSurface: '#FFFDF8', // Card warm white
  royalSidebar: '#FBF7EF', // Subtle warm sidebar
  royalGold: '#B8863C', // Classical gold primary
  royalGoldAccent: '#C9974B', // Bright gold accent
  royalGoldLight: '#F0DEC0', // Parchment gold tone
  royalCrimson: '#A7685D', // Terracotta warning / priority
  royalIvory: '#3E2E1E', // Dark brown typography for high contrast
  royalMuted: '#8A745A', // Muted earthy brown for secondary text
  royalBorder: '#E8D9BC', // Subtle gold border
  royalTeal: '#8CA383', // Sage green / Ayurvedic healing
  royalDarkBrown: '#2C1F12', // Deep brown accent
  success: '#8CA383',
  warning: '#C9974B',
  error: '#A7685D',
} as const;

export const shadows = {
  goldGlow: '0 12px 28px rgba(184, 134, 60, 0.12)',
  cardShadow: '0 8px 24px rgba(184, 134, 60, 0.08)',
  accentGlow: '0 0 20px rgba(201, 151, 75, 0.25)',
} as const;

export const typography = {
  displayFont: 'Cinzel, "Cormorant Garamond", Georgia, serif',
  sansFont: '"Noto Sans", "Nunito Sans", sans-serif',
} as const;
