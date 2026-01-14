/**
 * Shadow Tokens for AyScroll
 * 
 * Defines box shadows for elevation and glow effects.
 * These adapt to theme mode for proper visual hierarchy.
 */

// Base shadows (neutral)
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const;

// Brand glow shadows (pink/orange theme)
export const glowShadows = {
  pink: '0 0 20px hsl(350 89% 60% / 0.3)',
  pinkStrong: '0 0 40px hsl(350 89% 60% / 0.5)',
  pinkSubtle: '0 0 10px hsl(350 89% 60% / 0.15)',
  orange: '0 0 20px hsl(25 95% 55% / 0.3)',
  orangeStrong: '0 0 40px hsl(25 95% 55% / 0.5)',
  purple: '0 0 20px hsl(270 76% 60% / 0.3)',
} as const;

// Card shadows for dark mode
export const cardShadows = {
  dark: {
    default: '0 4px 6px -1px rgb(0 0 0 / 0.2), 0 2px 4px -2px rgb(0 0 0 / 0.2)',
    elevated: '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
    floating: '0 25px 50px -12px rgb(0 0 0 / 0.5)',
  },
  light: {
    default: '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
    elevated: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.08)',
    floating: '0 25px 50px -12px rgb(0 0 0 / 0.2)',
  },
} as const;

// Interactive element shadows
export const interactiveShadows = {
  button: {
    default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    hover: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    active: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  },
  input: {
    focus: '0 0 0 3px hsl(350 89% 60% / 0.15)',
  },
} as const;

// CSS custom property names for runtime theming
export const shadowVariables = {
  card: '--shadow-card',
  elevated: '--shadow-elevated',
  glow: '--shadow-glow',
} as const;
