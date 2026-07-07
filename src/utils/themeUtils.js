import { THEMES } from '../constants/terminal.js';

export function applyTheme(themeKey, darkMode) {
  const root = document.documentElement;
  const theme = THEMES[themeKey];

  if (!theme) return;

  const vars = darkMode ? theme.dark : theme.light;

  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  document.body.setAttribute('data-theme', themeKey);
}

export function getSavedTheme() {
  return 'default';
}
