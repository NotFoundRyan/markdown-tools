# Markdown Tools

<p align="center">
  <img src="images/screenshot-home.png" alt="Captura de pantalla de Markdown Tools" width="800">
</p>

<p align="center">
  <strong>Un convertidor de documentos moderno y centrado en la privacidad</strong>
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

Una aplicación web moderna y centrada en la privacidad para convertir entre formatos Markdown, Word, HTML y PDF. Todas las conversiones ocurren localmente en tu navegador - ningún dato es enviado a ningún servidor.

## ✨ Características

- **Markdown a Word** - Convertir archivos Markdown a documentos Word (.docx) preservando el formato
- **Word a Markdown** - Convertir documentos Word a formato Markdown para fácil edición
- **Markdown a PDF** - Convertir Markdown a documentos PDF, adecuado para imprimir y compartir
- **Markdown a HTML** - Convertir Markdown a código HTML para publicación web
- **HTML a Markdown** - Convertir código HTML a formato Markdown
- **Word a PDF** - Convertir documentos Word a archivos PDF
- **PDF a Word** - Convertir archivos PDF a documentos Word

## 🌟 Puntos Destacados

- 🔒 **Privacidad Primero** - Todas las conversiones ocurren localmente en tu navegador, ningún dato es enviado a ningún servidor
- 🖥️ **Soporte App de Escritorio** - Puede ser empaquetado como aplicación de escritorio Windows/macOS/Linux
- 🌍 **Soporte Multiidioma** - Soporta 7 idiomas: chino, inglés, japonés, francés, español, alemán y ruso
- 🎨 **Interfaz Moderna** - Diseño glassmorphism limpio con soporte tema claro/oscuro
- 📱 **Diseño Responsivo** - Funciona en dispositivos de escritorio y móviles
- ⚡ **Rápido y Eficiente** - Construido con Vite, Web Worker para procesamiento en segundo plano de archivos grandes
- 📝 **Soporte LaTeX** - Markdown a Word/PDF/HTML soporta renderizado de fórmulas matemáticas
- 📊 **Indicador de Progreso** - Muestra barra de progreso al procesar archivos grandes

## 🛠️ Stack Tecnológico

- **Vite** - Herramienta de build frontend de próxima generación
- **TypeScript** - JavaScript type-safe
- **Tauri** - Framework de aplicación de escritorio multiplataforma
- **marked** - Analizador Markdown
- **marked-katex-extension** - Soporte de fórmulas matemáticas LaTeX
- **docx** - Generador de documentos Word
- **mammoth** - Analizador de documentos Word
- **turndown** - Convertidor HTML a Markdown
- **jspdf** + **html2canvas** - Generación PDF
- **pdfjs-dist** - Análisis PDF

## 🚀 Inicio Rápido

### Requisitos

- Node.js 18+
- npm o yarn
- Rust (requerido para build de aplicación de escritorio solamente)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/NotFoundRyan/markdown-tools.git

# Entrar al directorio del proyecto
cd markdown-tools

# Instalar dependencias
npm install
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo (versión Web)
npm run dev

# Iniciar servidor de desarrollo (aplicación de escritorio)
npm run tauri:dev
```

La aplicación se ejecutará en `http://localhost:3000`

### Build de Producción

```bash
# Build versión web
npm run build

# Build aplicación de escritorio
npm run tauri:build
```

## 📁 Estructura del Proyecto

```
markdown-tools/
├── public/
│   └── favicon.svg
├── scripts/
│   └── start-dev.ps1       # Script de inicio desarrollo Windows
├── src/
│   ├── main.ts              # Punto de entrada de la aplicación
│   ├── scripts/
│   │   ├── pages/           # Componentes de página
│   │   ├── utils/           # Funciones de utilidad
│   │   ├── workers/         # Web Workers
│   │   └── router.ts        # Enrutamiento del lado del cliente
│   └── styles/
│       ├── components/      # Estilos de componentes
│       └── pages/           # Estilos de páginas
├── src-tauri/               # Configuración aplicación de escritorio Tauri
│   ├── src/
│   │   └── main.rs
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── capabilities/
├── docs/                    # Documentación
│   ├── README.en.md
│   ├── README.ja.md
│   └── images/
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 📖 Detalles de Características

### Internacionalización (i18n)

La aplicación soporta 7 idiomas:
- 🇨🇳 中文
- 🇺🇸 English
- 🇯🇵 日本語
- 🇫🇷 Français
- 🇪🇸 Español
- 🇩🇪 Deutsch
- 🇷🇺 Русский

La selección de idioma es detectada automáticamente desde la configuración del navegador y guardada en localStorage.

### Soporte de Tema

- Modo claro
- Modo oscuro
- Seguir el sistema (cambia automáticamente según la configuración del OS)

### Formatos de Archivo Soportados

| Entrada | Salida |
|---------|--------|
| `.md`, `.markdown`, `.txt` | `.docx`, `.pdf`, `.html` |
| `.docx` | `.md`, `.pdf` |
| `.html`, `.htm` | `.md` |
| `.pdf` | `.docx` |

### Límite de Tamaño de Archivo

- Todos los tipos de archivo: Máximo **100MB**

### Procesamiento de Archivos Grandes

- Usa **Web Worker** para procesamiento en hilo de segundo plano para evitar bloquear la UI
- Muestra barra de progreso con retroalimentación en tiempo real
- Soporta procesamiento por trozos para archivos muy grandes

### Fórmulas Matemáticas LaTeX

Soporta fórmulas en línea y en bloque:

```markdown
Fórmula en línea: $E = mc^2$

Fórmula en bloque:
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### Características de Aplicación de Escritorio

- Modo instancia única - Previene conflictos de recursos de múltiples instancias
- Diálogo de guardado de archivo nativo - Elegir ubicación de guardado
- Uso sin conexión - No requiere conexión de red

## 🌐 Soporte de Navegadores

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Siéntete libre de enviar una Pull Request.

1. Haz fork de este repositorio
2. Crea tu rama de característica (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre una Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](../LICENSE) para más detalles.

## 🙏 Agradecimientos

- [marked](https://github.com/markedjs/marked) - Analizador Markdown
- [marked-katex-extension](https://github.com/UziTech/marked-katex-extension) - Extensión de fórmulas matemáticas LaTeX
- [KaTeX](https://github.com/KaTeX/KaTeX) - Motor de renderizado LaTeX
- [docx](https://github.com/dolanmiu/docx) - Generador de documentos Word
- [mammoth](https://github.com/mwilliamson/mammoth.js) - Analizador de documentos Word
- [turndown](https://github.com/mixmark-io/turndown) - Convertidor HTML a Markdown
- [jspdf](https://github.com/parallax/jsPDF) - Generación PDF
- [html2canvas](https://github.com/niklasvh/html2canvas) - Renderizador HTML a canvas
- [pdf.js](https://github.com/nicholasday/pdf.js) - Análisis PDF
- [Tauri](https://tauri.app/) - Framework de aplicación de escritorio multiplataforma

---

Made by Ryan © 2026
