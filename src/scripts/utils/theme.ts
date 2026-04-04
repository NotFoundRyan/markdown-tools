type Theme = 'light' | 'dark' | 'system';

const THEME_KEY = 'theme';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.setAttribute('data-theme', theme);
}

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system';
}

export function setTheme(theme: Theme) {
  localStorage.setItem(THEME_KEY, theme);
  
  if (theme === 'system') {
    applyTheme(getSystemTheme());
  } else {
    applyTheme(theme);
  }
}

export function toggleTheme() {
  const current = getStoredTheme();
  const currentApplied = document.documentElement.getAttribute('data-theme') as 'light' | 'dark';
  
  if (current === 'system') {
    setTheme(currentApplied === 'dark' ? 'light' : 'dark');
  } else {
    setTheme(current === 'dark' ? 'light' : 'dark');
  }
}

export function getCurrentAppliedTheme(): 'light' | 'dark' {
  return (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light';
}

export function initTheme() {
  const stored = getStoredTheme();
  
  if (stored === 'system') {
    applyTheme(getSystemTheme());
    
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (getStoredTheme() === 'system') {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  } else {
    applyTheme(stored);
  }
}
