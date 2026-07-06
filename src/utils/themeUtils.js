import { DEFAULT_THEME, THEMES } from '../constants/terminal.js';

export function applyTheme(themeKey, darkMode) {
  const theme = THEMES[themeKey];

  if (!theme) {
    return;
  }

  const vars = darkMode ? theme.dark : theme.light;
  const root = document.documentElement;

  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  localStorage.setItem('terminal-theme', themeKey);
}

export function getSavedTheme() {
  return localStorage.getItem('terminal-theme') || DEFAULT_THEME;
}
