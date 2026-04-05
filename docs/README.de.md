# Markdown Tools

<p align="center">
  <img src="images/screenshot-home.png" alt="Markdown Tools Screenshot" width="800">
</p>

<p align="center">
  <strong>Ein moderner, datenschutzorientierter Dokumentenkonverter</strong>
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

Eine moderne, datenschutzorientierte Webanwendung zur Konvertierung zwischen Markdown-, Word-, HTML- und PDF-Formaten. Alle Konvertierungen erfolgen lokal in Ihrem Browser - keine Daten werden an einen Server gesendet.

## ✨ Funktionen

- **Markdown zu Word** - Markdown-Dateien in Word-Dokumente (.docx) konvertieren, Formatierung beibehalten
- **Word zu Markdown** - Word-Dokumente in Markdown-Format konvertieren für einfache Bearbeitung
- **Markdown zu PDF** - Markdown in PDF-Dokumente konvertieren, geeignet zum Drucken und Teilen
- **Markdown zu HTML** - Markdown in HTML-Code konvertieren für Web-Veröffentlichung
- **HTML zu Markdown** - HTML-Code in Markdown-Format konvertieren
- **Word zu PDF** - Word-Dokumente in PDF-Dateien konvertieren
- **PDF zu Word** - PDF-Dateien in Word-Dokumente konvertieren

## 🌟 Highlights

- 🔒 **Datenschutz zuerst** - Alle Konvertierungen erfolgen lokal in Ihrem Browser, keine Daten werden an einen Server gesendet
- 🖥️ **Desktop-App-Unterstützung** - Kann als Windows/macOS/Linux-Desktop-Anwendung verpackt werden
- 🌍 **Mehrsprachige Unterstützung** - Unterstützt 7 Sprachen: Chinesisch, Englisch, Japanisch, Französisch, Spanisch, Deutsch und Russisch
- 🎨 **Moderne Benutzeroberfläche** - Sauberes Glassmorphism-Design mit Hell-/Dunkel-Theme-Unterstützung
- 📱 **Responsives Design** - Funktioniert auf Desktop- und Mobilgeräten
- ⚡ **Schnell und effizient** - Mit Vite erstellt, Web Worker für Hintergrundverarbeitung großer Dateien
- 📝 **LaTeX-Unterstützung** - Markdown zu Word/PDF/HTML unterstützt mathematische Formelrendering
- 📊 **Fortschrittsanzeige** - Zeigt Fortschrittsbalken bei der Verarbeitung großer Dateien

## 🛠️ Tech-Stack

- **Vite** - Frontend-Build-Tool der nächsten Generation
- **TypeScript** - Typsicheres JavaScript
- **Tauri** - Cross-Platform-Desktop-Anwendungsframework
- **marked** - Markdown-Parser
- **marked-katex-extension** - LaTeX-Matheformel-Unterstützung
- **docx** - Word-Dokument-Generator
- **mammoth** - Word-Dokument-Parser
- **turndown** - HTML-zu-Markdown-Konverter
- **jspdf** + **html2canvas** - PDF-Generierung
- **pdfjs-dist** - PDF-Analyse

## 🚀 Schnellstart

### Voraussetzungen

- Node.js 18+
- npm oder yarn
- Rust (nur für Desktop-App-Build erforderlich)

### Installation

```bash
# Repository klonen
git clone https://github.com/NotFoundRyan/markdown-tools.git

# Projektverzeichnis betreten
cd markdown-tools

# Abhängigkeiten installieren
npm install
```

### Entwicklung

```bash
# Entwicklungsserver starten (Web-Version)
npm run dev

# Entwicklungsserver starten (Desktop-App)
npm run tauri:dev
```

Die Anwendung wird unter `http://localhost:3000` ausgeführt

### Produktions-Build

```bash
# Web-Version erstellen
npm run build

# Desktop-App erstellen
npm run tauri:build
```

## 📁 Projektstruktur

```
markdown-tools/
├── public/
│   └── favicon.svg
├── scripts/
│   └── start-dev.ps1       # Windows-Entwicklungsstartskript
├── src/
│   ├── main.ts              # Anwendungseinstieg
│   ├── scripts/
│   │   ├── pages/           # Seitenkomponenten
│   │   ├── utils/           # Hilfsfunktionen
│   │   ├── workers/         # Web Workers
│   │   └── router.ts        # Client-seitiges Routing
│   └── styles/
│       ├── components/      # Komponenten-Stile
│       └── pages/           # Seiten-Stile
├── src-tauri/               # Tauri-Desktop-App-Konfiguration
│   ├── src/
│   │   └── main.rs
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── capabilities/
├── docs/                    # Dokumentation
│   ├── README.en.md
│   ├── README.ja.md
│   └── images/
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 📖 Funktionsdetails

### Internationalisierung (i18n)

Die Anwendung unterstützt 7 Sprachen:
- 🇨🇳 中文
- 🇺🇸 English
- 🇯🇵 日本語
- 🇫🇷 Français
- 🇪🇸 Español
- 🇩🇪 Deutsch
- 🇷🇺 Русский

Die Sprachauswahl wird automatisch aus den Browser-Einstellungen erkannt und in localStorage gespeichert.

### Theme-Unterstützung

- Hell-Modus
- Dunkel-Modus
- System folgen (wechselt automatisch basierend auf OS-Einstellungen)

### Unterstützte Dateiformate

| Eingabe | Ausgabe |
|---------|---------|
| `.md`, `.markdown`, `.txt` | `.docx`, `.pdf`, `.html` |
| `.docx` | `.md`, `.pdf` |
| `.html`, `.htm` | `.md` |
| `.pdf` | `.docx` |

### Dateigrößenlimit

- Alle Dateitypen: Maximum **100MB**

### Verarbeitung großer Dateien

- Verwendet **Web Worker** für Hintergrund-Thread-Verarbeitung, um UI-Blockierung zu vermeiden
- Zeigt Verarbeitungsfortschrittsbalken mit Echtzeit-Feedback
- Unterstützt stückweise Verarbeitung für sehr große Dateien

### LaTeX-Matheformeln

Unterstützt Inline- und Block-Formeln:

```markdown
Inline-Formel: $E = mc^2$

Block-Formel:
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### Desktop-App-Funktionen

- Einzelinstanz-Modus - Verhindert Ressourcenkonflikte mehrerer Instanzen
- Nativer Datei-Speichern-Dialog - Speicherort wählen
- Offline-Nutzung - Keine Netzwerkverbindung erforderlich

## 🌐 Browser-Unterstützung

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## 🤝 Mitwirken

Beiträge sind willkommen! Fühlen Sie sich frei, eine Pull Request einzureichen.

1. Forken Sie dieses Repository
2. Erstellen Sie Ihren Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committen Sie Ihre Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Pushen Sie zum Branch (`git push origin feature/AmazingFeature`)
5. Öffnen Sie eine Pull Request

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe die [LICENSE](../LICENSE)-Datei für Details.

## 🙏 Danksagungen

- [marked](https://github.com/markedjs/marked) - Markdown-Parser
- [marked-katex-extension](https://github.com/UziTech/marked-katex-extension) - LaTeX-Matheformel-Erweiterung
- [KaTeX](https://github.com/KaTeX/KaTeX) - LaTeX-Rendering-Engine
- [docx](https://github.com/dolanmiu/docx) - Word-Dokument-Generator
- [mammoth](https://github.com/mwilliamson/mammoth.js) - Word-Dokument-Parser
- [turndown](https://github.com/mixmark-io/turndown) - HTML-zu-Markdown-Konverter
- [jspdf](https://github.com/parallax/jsPDF) - PDF-Generierung
- [html2canvas](https://github.com/niklasvh/html2canvas) - HTML-zu-Canvas-Renderer
- [pdf.js](https://github.com/nicholasday/pdf.js) - PDF-Analyse
- [Tauri](https://tauri.app/) - Cross-Platform-Desktop-Anwendungsframework

---

Made by Ryan © 2026
