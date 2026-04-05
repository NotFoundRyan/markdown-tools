# Markdown Tools

<p align="center">
  <img src="images/screenshot-home.png" alt="Скриншот Markdown Tools" width="800">
</p>

<p align="center">
  <strong>Современный конвертер документов с приоритетом конфиденциальности</strong>
</p>

<p align="center">
  <a href="../README.md">简体中文</a> | 
  <a href="README.en.md">English</a> | 
  <a href="README.ja.md">日本語</a> | 
  <a href="README.fr.md">Français</a> | 
  <a href="README.es.md">Español</a> | 
  <a href="README.de.md">Deutsch</a> | 
  <a href="README.ru.md">Русский</a>
</p>

---

Современное веб-приложение с приоритетом конфиденциальности для конвертации между форматами Markdown, Word, HTML и PDF. Все преобразования происходят локально в вашем браузере - никакие данные не отправляются на сервер.

## ✨ Функции

- **Markdown в Word** - Конвертировать файлы Markdown в документы Word (.docx) с сохранением форматирования
- **Word в Markdown** - Конвертировать документы Word в формат Markdown для удобного редактирования
- **Markdown в PDF** - Конвертировать Markdown в PDF-документы, подходит для печати и обмена
- **Markdown в HTML** - Конвертировать Markdown в HTML-код для веб-публикации
- **HTML в Markdown** - Конвертировать HTML-код в формат Markdown
- **Word в PDF** - Конвертировать документы Word в PDF-файлы
- **PDF в Word** - Конвертировать PDF-файлы в документы Word

## 🌟 Особенности

- 🔒 **Конфиденциальность прежде всего** - Все преобразования происходят локально в вашем браузере, данные не отправляются на сервер
- 🖥️ **Поддержка десктопного приложения** - Может быть упаковано как десктопное приложение Windows/macOS/Linux
- 🌍 **Многоязычная поддержка** - Поддерживает 7 языков: китайский, английский, японский, французский, испанский, немецкий и русский
- 🎨 **Современный интерфейс** - Чистый дизайн в стиле glassmorphism с поддержкой светлой/тёмной темы
- 📱 **Адаптивный дизайн** - Работает на десктопных и мобильных устройствах
- ⚡ **Быстро и эффективно** - Построено на Vite, Web Worker для фоновой обработки больших файлов
- 📝 **Поддержка LaTeX** - Markdown в Word/PDF/HTML поддерживает рендеринг математических формул
- 📊 **Индикатор прогресса** - Показывает прогресс-бар при обработке больших файлов

## 🛠️ Технологический стек

- **Vite** - Инструмент сборки фронтенда нового поколения
- **TypeScript** - Типобезопасный JavaScript
- **Tauri** - Кроссплатформенный фреймворк для десктопных приложений
- **marked** - Парсер Markdown
- **marked-katex-extension** - Поддержка математических формул LaTeX
- **docx** - Генератор документов Word
- **mammoth** - Парсер документов Word
- **turndown** - Конвертер HTML в Markdown
- **jspdf** + **html2canvas** - Генерация PDF
- **pdfjs-dist** - Анализ PDF

## 🚀 Быстрый старт

### Требования

- Node.js 18+
- npm или yarn
- Rust (требуется только для сборки десктопного приложения)

### Установка

```bash
# Клонировать репозиторий
git clone https://github.com/NotFoundRyan/markdown-tools.git

# Перейти в директорию проекта
cd markdown-tools

# Установить зависимости
npm install
```

### Разработка

```bash
# Запустить сервер разработки (веб-версия)
npm run dev

# Запустить сервер разработки (десктопное приложение)
npm run tauri:dev
```

Приложение будет запущено на `http://localhost:3000`

### Продакшн сборка

```bash
# Сборка веб-версии
npm run build

# Сборка десктопного приложения
npm run tauri:build
```

## 📁 Структура проекта

```
markdown-tools/
├── public/
│   └── favicon.svg
├── scripts/
│   └── start-dev.ps1       # Скрипт запуска разработки Windows
├── src/
│   ├── main.ts              # Точка входа приложения
│   ├── scripts/
│   │   ├── pages/           # Компоненты страниц
│   │   ├── utils/           # Утилиты
│   │   ├── workers/         # Web Workers
│   │   └── router.ts        # Клиентский роутинг
│   └── styles/
│       ├── components/      # Стили компонентов
│       └── pages/           # Стили страниц
├── src-tauri/               # Конфигурация десктопного приложения Tauri
│   ├── src/
│   │   └── main.rs
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── capabilities/
├── docs/                    # Документация
│   ├── README.en.md
│   ├── README.ja.md
│   └── images/
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 📖 Подробности функций

### Интернационализация (i18n)

Приложение поддерживает 7 языков:
- 🇨🇳 中文
- 🇺🇸 English
- 🇯🇵 日本語
- 🇫🇷 Français
- 🇪🇸 Español
- 🇩🇪 Deutsch
- 🇷🇺 Русский

Выбор языка автоматически определяется из настроек браузера и сохраняется в localStorage.

### Поддержка темы

- Светлая тема
- Тёмная тема
- Системная (автоматическое переключение в зависимости от настроек ОС)

### Поддерживаемые форматы файлов

| Вход | Выход |
|------|-------|
| `.md`, `.markdown`, `.txt` | `.docx`, `.pdf`, `.html` |
| `.docx` | `.md`, `.pdf` |
| `.html`, `.htm` | `.md` |
| `.pdf` | `.docx` |

### Лимит размера файла

- Все типы файлов: Максимум **100MB**

### Обработка больших файлов

- Использует **Web Worker** для обработки в фоновом потоке, чтобы избежать блокировки UI
- Показывает прогресс-бар с обратной связью в реальном времени
- Поддерживает поэтапную обработку для очень больших файлов

### Математические формулы LaTeX

Поддерживает встроенные и блочные формулы:

```markdown
Встроенная формула: $E = mc^2$

Блочная формула:
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### Функции десктопного приложения

- Режим одного экземпляра - Предотвращает конфликты ресурсов нескольких экземпляров
- Нативный диалог сохранения файла - Выбор места сохранения
- Офлайн-использование - Не требует сетевого подключения

## 🌐 Поддержка браузеров

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## 🤝 Участие в разработке

Приветствуются любые вклады! Не стесняйтесь отправлять Pull Request.

1. Сделайте форк этого репозитория
2. Создайте ветку функции (`git checkout -b feature/AmazingFeature`)
3. Зафиксируйте изменения (`git commit -m 'Add some AmazingFeature'`)
4. Отправьте в ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под лицензией MIT - см. файл [LICENSE](../LICENSE) для подробностей.

## 🙏 Благодарности

- [marked](https://github.com/markedjs/marked) - Парсер Markdown
- [marked-katex-extension](https://github.com/UziTech/marked-katex-extension) - Расширение математических формул LaTeX
- [KaTeX](https://github.com/KaTeX/KaTeX) - Движок рендеринга LaTeX
- [docx](https://github.com/dolanmiu/docx) - Генератор документов Word
- [mammoth](https://github.com/mwilliamson/mammoth.js) - Парсер документов Word
- [turndown](https://github.com/mixmark-io/turndown) - Конвертер HTML в Markdown
- [jspdf](https://github.com/parallax/jsPDF) - Генерация PDF
- [html2canvas](https://github.com/niklasvh/html2canvas) - Рендерер HTML в canvas
- [pdf.js](https://github.com/nicholasday/pdf.js) - Анализ PDF
- [Tauri](https://tauri.app/) - Кроссплатформенный фреймворк для десктопных приложений

---

Made by Ryan © 2026
