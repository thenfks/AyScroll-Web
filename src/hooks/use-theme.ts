import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // Initialize theme from storage or default
    const savedTheme = localStorage.getItem('ayscroll-theme') as Theme | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);

    // Listen for theme changes via MutationObserver
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme' || mutation.attributeName === 'class') {
          const currentTheme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
          setTheme(currentTheme);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const setThemeValue = (newTheme: Theme) => {
    const root = document.documentElement;
    
    if (newTheme === 'light') {
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
    }
    
    localStorage.setItem('ayscroll-theme', newTheme);
    setTheme(newTheme);
  };

  const toggleTheme = () => {
    setThemeValue(theme === 'dark' ? 'light' : 'dark');
  };

  return {
    theme,
    setTheme: setThemeValue,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
}
