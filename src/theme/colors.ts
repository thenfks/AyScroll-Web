/**
 * Color Tokens for AyScroll
 * 
 * These are the raw color values used to generate CSS variables.
 * In components, always use Tailwind classes that reference CSS variables:
 * - bg-background, text-foreground (semantic tokens)
 * - bg-primary, text-primary-foreground (brand colors)
 * 
 * DO NOT use these raw values directly in components.
 */

// Brand Colors (HSL values without hsl() wrapper)
export const brandColors = {
  pink: {
    hsl: '350 89% 60%',
    hex: '#ec4899',
  },
  orange: {
    hsl: '25 95% 55%',
    hex: '#f97316',
  },
  purple: {
    hsl: '270 76% 60%',
    hex: '#a855f7',
  },
} as const;

// Semantic Color Tokens (HSL values)
export const semanticColors = {
  dark: {
    background: '0 0% 7%',
    foreground: '0 0% 98%',
    card: '0 0% 10%',
    cardForeground: '0 0% 98%',
    popover: '0 0% 10%',
    popoverForeground: '0 0% 98%',
    primary: '350 89% 60%',
    primaryForeground: '0 0% 100%',
    secondary: '0 0% 14%',
    secondaryForeground: '0 0% 98%',
    muted: '0 0% 15%',
    mutedForeground: '0 0% 55%',
    accent: '350 89% 60%',
    accentForeground: '0 0% 100%',
    destructive: '0 84% 60%',
    destructiveForeground: '0 0% 98%',
    border: '0 0% 18%',
    input: '0 0% 18%',
    ring: '350 89% 60%',
    // Success states
    success: '142 76% 36%',
    successForeground: '0 0% 100%',
  },
  light: {
    background: '0 0% 100%',
    foreground: '0 0% 9%',
    card: '0 0% 98%',
    cardForeground: '0 0% 9%',
    popover: '0 0% 100%',
    popoverForeground: '0 0% 9%',
    primary: '350 89% 55%',
    primaryForeground: '0 0% 100%',
    secondary: '0 0% 96%',
    secondaryForeground: '0 0% 9%',
    muted: '0 0% 94%',
    mutedForeground: '0 0% 40%',
    accent: '350 89% 55%',
    accentForeground: '0 0% 100%',
    destructive: '0 84% 55%',
    destructiveForeground: '0 0% 100%',
    border: '0 0% 90%',
    input: '0 0% 90%',
    ring: '350 89% 55%',
    // Success states
    success: '142 76% 36%',
    successForeground: '0 0% 100%',
  },
} as const;

// Topic/Category Colors
export const topicColors = {
  blue: {
    hsl: '210 100% 60%',
    hex: '#3b82f6',
  },
  green: {
    hsl: '142 76% 50%',
    hex: '#22c55e',
  },
  purple: {
    hsl: '270 76% 60%',
    hex: '#a855f7',
  },
  orange: {
    hsl: '25 95% 55%',
    hex: '#f97316',
  },
  pink: {
    hsl: '350 89% 60%',
    hex: '#ec4899',
  },
} as const;

// Sidebar-specific colors
export const sidebarColors = {
  dark: {
    background: '0 0% 9%',
    foreground: '0 0% 70%',
    primary: '350 89% 60%',
    primaryForeground: '0 0% 100%',
    accent: '0 0% 14%',
    accentForeground: '0 0% 98%',
    border: '0 0% 15%',
    ring: '350 89% 60%',
  },
  light: {
    background: '0 0% 98%',
    foreground: '0 0% 40%',
    primary: '350 89% 55%',
    primaryForeground: '0 0% 100%',
    accent: '0 0% 94%',
    accentForeground: '0 0% 9%',
    border: '0 0% 90%',
    ring: '350 89% 55%',
  },
} as const;

export type ThemeMode = 'light' | 'dark';
