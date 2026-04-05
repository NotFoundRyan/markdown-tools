import './styles/main.css';
import 'katex/dist/katex.min.css';
import { initRouter } from './scripts/router';
import { initTheme, toggleTheme, getCurrentAppliedTheme } from './scripts/utils/theme';
import { initI18n, setLang, getCurrentLang, t, getAllLanguages } from './scripts/utils/i18n';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initI18n();
  initRouter();
  initEventListeners();
  updateThemeIcon();
  renderLanguageMenu();
});

function initEventListeners() {
  const themeToggle = document.getElementById('theme-toggle');
  const langToggle = document.getElementById('lang-toggle');
  const langMenu = document.getElementById('lang-menu');

  themeToggle?.addEventListener('click', () => {
    toggleTheme();
    updateThemeIcon();
  });

  langToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    langMenu?.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.lang-dropdown')) {
      langMenu?.classList.remove('active');
    }
  });
}

function renderLanguageMenu() {
  const langMenu = document.getElementById('lang-menu');
  if (!langMenu) return;

  const languages = getAllLanguages();
  const currentLang = getCurrentLang();

  langMenu.innerHTML = languages.map(lang => `
    <button class="lang-dropdown-item ${lang.code === currentLang ? 'active' : ''}" data-lang="${lang.code}">
      ${lang.name}
    </button>
  `).join('');

  langMenu.querySelectorAll('.lang-dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const langCode = target.getAttribute('data-lang');
      if (langCode) {
        setLang(langCode as 'zh' | 'en' | 'ja' | 'fr' | 'es' | 'de' | 'ru');
        updatePageTexts();
        renderLanguageMenu();
        langMenu.classList.remove('active');
      }
    });
  });
}

function updateThemeIcon() {
  const themeIcon = document.getElementById('theme-icon');
  if (!themeIcon) return;

  const isDark = getCurrentAppliedTheme() === 'dark';

  if (isDark) {
    themeIcon.innerHTML = `
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    `;
  } else {
    themeIcon.innerHTML = `
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    `;
  }
}

function updatePageTexts() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      el.textContent = t(key);
    }
  });
}
