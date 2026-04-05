# Markdown Tools

<p align="center">
  <img src="images/screenshot-home.png" alt="Markdown Tools Screenshot" width="800">
</p>

<p align="center">
  <strong>A modern, privacy-first document converter</strong>
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

A modern, privacy-first web application for converting between Markdown, Word, HTML, and PDF formats. All conversions happen locally in your browser - no data is sent to any server.

## ✨ Features

- **Markdown to Word** - Convert Markdown files to Word documents (.docx) with formatting preserved
- **Word to Markdown** - Convert Word documents to Markdown format for easy editing
- **Markdown to PDF** - Convert Markdown to PDF documents, suitable for printing and sharing
- **Markdown to HTML** - Convert Markdown to HTML code for web publishing
- **HTML to Markdown** - Convert HTML code to Markdown format
- **Word to PDF** - Convert Word documents to PDF files
- **PDF to Word** - Convert PDF files to Word documents

## 🌟 Highlights

- 🔒 **Privacy First** - All conversions happen locally in your browser, no data is sent to any server
- 🖥️ **Desktop App Support** - Can be packaged as Windows/macOS/Linux desktop application
- 🌍 **Multi-language Support** - Supports 7 languages: Chinese, English, Japanese, French, Spanish, German, and Russian
- 🎨 **Modern UI** - Clean glassmorphism design with light/dark theme support
- 📱 **Responsive Design** - Works on desktop and mobile devices
- ⚡ **Fast & Efficient** - Built with Vite, Web Worker for background processing of large files
- 📝 **LaTeX Support** - Markdown to Word/PDF/HTML supports math formula rendering
- 📊 **Progress Indicator** - Shows progress bar when processing large files

## 🛠️ Tech Stack

- **Vite** - Next generation frontend build tool
- **TypeScript** - Type-safe JavaScript
- **Tauri** - Cross-platform desktop application framework
- **marked** - Markdown parser
- **marked-katex-extension** - LaTeX math formula support
- **docx** - Word document generator
- **mammoth** - Word document parser
- **turndown** - HTML to Markdown converter
- **jspdf** + **html2canvas** - PDF generation
- **pdfjs-dist** - PDF parsing

## 🚀 Quick Start

### Requirements

- Node.js 18+
- npm or yarn
- Rust (required for desktop app build only)

### Installation

```bash
# Clone the repository
git clone https://github.com/NotFoundRyan/markdown-tools.git

# Enter project directory
cd markdown-tools

# Install dependencies
npm install
```

### Development

```bash
# Start development server (Web)
npm run dev

# Start development server (Desktop app)
npm run tauri:dev
```

The application will run at `http://localhost:3000`

### Production Build

```bash
# Build web version
npm run build

# Build desktop app
npm run tauri:build
```

## 📁 Project Structure

```
markdown-tools/
├── public/
│   └── favicon.svg
├── scripts/
│   └── start-dev.ps1       # Windows development startup script
├── src/
│   ├── main.ts              # Application entry
│   ├── scripts/
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Utility functions
│   │   ├── workers/         # Web Workers
│   │   └── router.ts        # Client-side routing
│   └── styles/
│       ├── components/      # Component styles
│       └── pages/           # Page styles
├── src-tauri/               # Tauri desktop app config
│   ├── src/
│   │   └── main.rs
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── capabilities/
├── docs/                    # Documentation
│   ├── README.en.md
│   ├── README.ja.md
│   └── images/
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 📖 Feature Details

### Internationalization (i18n)

The application supports 7 languages:
- 🇨🇳 中文
- 🇺🇸 English
- 🇯🇵 日本語
- 🇫🇷 Français
- 🇪🇸 Español
- 🇩🇪 Deutsch
- 🇷🇺 Русский

Language selection is automatically detected from browser settings and saved in localStorage.

### Theme Support

- Light mode
- Dark mode
- Follow system (automatically switches based on OS settings)

### Supported File Formats

| Input | Output |
|-------|--------|
| `.md`, `.markdown`, `.txt` | `.docx`, `.pdf`, `.html` |
| `.docx` | `.md`, `.pdf` |
| `.html`, `.htm` | `.md` |
| `.pdf` | `.docx` |

### File Size Limit

- All file types: Maximum **100MB**

### Large File Processing

- Uses **Web Worker** for background thread processing to avoid blocking UI
- Shows processing progress bar with real-time feedback
- Supports chunked processing for very large files

### LaTeX Math Formulas

Supports inline and block formulas:

```markdown
Inline formula: $E = mc^2$

Block formula:
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### Desktop App Features

- Single instance mode - Prevents resource conflicts from multiple instances
- Native file save dialog - Choose save location
- Offline usage - No network connection required

## 🌐 Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## 🤝 Contributing

Contributions are welcome! Feel free to submit a Pull Request.

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgements

- [marked](https://github.com/markedjs/marked) - Markdown parser
- [marked-katex-extension](https://github.com/UziTech/marked-katex-extension) - LaTeX math formula extension
- [KaTeX](https://github.com/KaTeX/KaTeX) - LaTeX rendering engine
- [docx](https://github.com/dolanmiu/docx) - Word document generator
- [mammoth](https://github.com/mwilliamson/mammoth.js) - Word document parser
- [turndown](https://github.com/mixmark-io/turndown) - HTML to Markdown converter
- [jspdf](https://github.com/parallax/jsPDF) - PDF generation
- [html2canvas](https://github.com/niklasvh/html2canvas) - HTML to canvas renderer
- [pdf.js](https://github.com/nicholasday/pdf.js) - PDF parsing
- [Tauri](https://tauri.app/) - Cross-platform desktop application framework

---

Made by Ryan © 2026
