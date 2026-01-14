/**
 * Gradient Tokens for AyScroll
 * 
 * Brand gradients and utility gradient definitions.
 * Use with Tailwind: bg-gradient-to-r from-pink-500 to-orange-500
 * Or custom: bg-brand-gradient
 */

// Primary brand gradients
export const brandGradients = {
  // Main pink to orange gradient
  primary: 'linear-gradient(135deg, hsl(350 89% 60%) 0%, hsl(25 95% 55%) 100%)',
  primaryHover: 'linear-gradient(135deg, hsl(350 89% 55%) 0%, hsl(25 95% 50%) 100%)',
  
  // Purple to pink accent
  accent: 'linear-gradient(135deg, hsl(270 76% 60%) 0%, hsl(350 89% 60%) 100%)',
  
  // Full spectrum (purple -> pink -> orange)
  spectrum: 'linear-gradient(135deg, hsl(270 76% 60%) 0%, hsl(350 89% 60%) 50%, hsl(25 95% 55%) 100%)',
  
  // Flashcard gradient
  flashcard: 'linear-gradient(to bottom right, hsl(270 76% 60%), hsl(350 89% 60%) 50%, hsl(25 95% 55%) 100%)',
} as const;

// UI gradients
export const uiGradients = {
  dark: {
    // Card overlays
    card: 'linear-gradient(180deg, hsl(0 0% 12%) 0%, hsl(0 0% 8%) 100%)',
    cardHover: 'linear-gradient(180deg, hsl(0 0% 14%) 0%, hsl(0 0% 10%) 100%)',
    
    // Glass effect background
    glass: 'linear-gradient(180deg, hsl(0 0% 100% / 0.05) 0%, hsl(0 0% 100% / 0) 100%)',
    
    // Fade effects
    fadeBottom: 'linear-gradient(to bottom, transparent 0%, hsl(0 0% 7%) 100%)',
    fadeTop: 'linear-gradient(to top, transparent 0%, hsl(0 0% 7%) 100%)',
    
    // Sidebar gradient
    sidebar: 'linear-gradient(180deg, hsl(0 0% 10%) 0%, hsl(0 0% 7%) 100%)',
  },
  light: {
    // Card overlays
    card: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(0 0% 98%) 100%)',
    cardHover: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(0 0% 96%) 100%)',
    
    // Glass effect background
    glass: 'linear-gradient(180deg, hsl(0 0% 100% / 0.8) 0%, hsl(0 0% 100% / 0.6) 100%)',
    
    // Fade effects
    fadeBottom: 'linear-gradient(to bottom, transparent 0%, hsl(0 0% 100%) 100%)',
    fadeTop: 'linear-gradient(to top, transparent 0%, hsl(0 0% 100%) 100%)',
    
    // Sidebar gradient
    sidebar: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(0 0% 98%) 100%)',
  },
} as const;

// Text gradients (for gradient text effect)
export const textGradients = {
  primary: 'linear-gradient(135deg, hsl(350 89% 60%) 0%, hsl(25 95% 55%) 100%)',
  purple: 'linear-gradient(135deg, hsl(270 76% 60%) 0%, hsl(350 89% 60%) 100%)',
  rainbow: 'linear-gradient(90deg, hsl(350 89% 60%), hsl(25 95% 55%), hsl(270 76% 60%))',
} as const;

// CSS class definitions for easy usage
export const gradientClasses = {
  // Use as: className="bg-brand-gradient"
  brandGradient: 'bg-gradient-to-r from-pink-500 to-orange-500',
  // Use as: className="text-gradient-primary"
  textGradient: 'bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent',
} as const;
