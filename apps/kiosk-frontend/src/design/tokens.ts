// Design tokens — kept in sync with tailwind.config.ts
export const colors = {
  royalBg:      '#FAF3E8',  // warm cream
  royalSurface: '#FFFDF8',  // card white
  royalGold:    '#B8863C',  // muted gold
  royalCrimson: '#A7685D',  // warm terracotta
  royalIvory:   '#3E2E1E',  // dark brown text
  royalMuted:   '#8A745A',  // muted brown
  royalBorder:  '#E8D9BC',  // soft gold border
  royalTeal:    '#8CA383',  // sage green
  success:      '#8CA383',
  warning:      '#C9974B',
  error:        '#A7685D',
} as const;

export const shadows = {
  goldGlow: '0 12px 28px rgba(184,134,60,0.12)',
} as const;
