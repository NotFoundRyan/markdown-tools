# Markdown Tools

<p align="center">
  <img src="docs/images/screenshot-home.png" alt="Markdown Tools 截图" width="800">
</p>

<p align="center">
  <strong>现代化、隐私优先的文档转换工具</strong>
</p>

<p align="center">
  <a href="README.md">简体中文</a> | 
  <a href="docs/README.en.md">English</a> | 
  <a href="docs/README.ja.md">日本語</a> | 
  <a href="docs/README.fr.md">Français</a> | 
  <a href="docs/README.es.md">Español</a> | 
  <a href="docs/README.de.md">Deutsch</a> | 
  <a href="docs/README.ru.md">Русский</a>
</p>

---

一款现代化、隐私优先的 Web 应用，支持 Markdown、Word、HTML 和 PDF 格式之间的相互转换。所有转换都在浏览器本地完成，数据不会发送到任何服务器。

## ✨ 功能特性

- **Markdown 转 Word** - 将 Markdown 文件转换为 Word 文档（.docx），保留格式
- **Word 转 Markdown** - 将 Word 文档转换为 Markdown 格式，便于编辑
- **Markdown 转 PDF** - 将 Markdown 转换为 PDF 文档，适合打印和分享
- **Markdown 转 HTML** - 将 Markdown 转换为 HTML 代码，用于网页发布
- **HTML 转 Markdown** - 将 HTML 代码转换为 Markdown 格式
- **Word 转 PDF** - 将 Word 文档转换为 PDF 文件
- **PDF 转 Word** - 将 PDF 文件转换为 Word 文档

## 🌟 核心亮点

- 🔒 **隐私优先** - 所有转换都在浏览器本地完成，数据不会上传到服务器
- 🖥️ **桌面应用支持** - 可打包为 Windows/macOS/Linux 桌面应用
- 🌍 **多语言支持** - 支持 7 种语言：中文、英文、日文、法文、西班牙文、德文、俄文
- 🎨 **现代化界面** - 简洁的玻璃态设计，支持亮色/暗色主题
- 📱 **响应式设计** - 支持桌面端和移动端
- ⚡ **快速高效** - 使用 Vite 构建，Web Worker 处理大文件
- 📝 **LaTeX 支持** - Markdown 转 Word/PDF/HTML 支持数学公式渲染
- 📊 **进度显示** - 处理大文件时显示进度条

## 🛠️ 技术栈

- **Vite** - 下一代前端构建工具
- **TypeScript** - 类型安全的 JavaScript
- **Tauri** - 跨平台桌面应用框架
- **marked** - Markdown 解析器
- **marked-katex-extension** - LaTeX 数学公式支持
- **docx** - Word 文档生成器
- **mammoth** - Word 文档解析器
- **turndown** - HTML 转 Markdown 转换器
- **jspdf** + **html2canvas** - PDF 生成
- **pdfjs-dist** - PDF 解析

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn
- Rust（仅桌面应用构建需要）

### 安装

```bash
# 克隆仓库
git clone https://github.com/NotFoundRyan/markdown-tools.git

# 进入项目目录
cd markdown-tools

# 安装依赖
npm install
```

### 开发

```bash
# 启动开发服务器（Web 版）
npm run dev

# 启动开发服务器（桌面应用）
npm run tauri:dev
```

应用将在 `http://localhost:3000` 运行

### 生产构建

```bash
# 构建 Web 版本
npm run build

# 构建桌面应用
npm run tauri:build
```

## 📁 项目结构

```
markdown-tools/
├── public/
│   └── favicon.svg
├── scripts/
│   └── start-dev.ps1       # Windows 开发启动脚本
├── src/
│   ├── main.ts              # 应用入口
│   ├── scripts/
│   │   ├── pages/           # 页面组件
│   │   ├── utils/           # 工具函数
│   │   ├── workers/         # Web Workers
│   │   └── router.ts        # 客户端路由
│   └── styles/
│       ├── components/      # 组件样式
│       └── pages/           # 页面样式
├── src-tauri/               # Tauri 桌面应用配置
│   ├── src/
│   │   └── main.rs
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── capabilities/
├── docs/                    # 文档
│   ├── README.en.md
│   ├── README.ja.md
│   └── images/
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 📖 功能详情

### 国际化（i18n）

应用支持 7 种语言：
- 🇨🇳 中文
- 🇺🇸 English
- 🇯🇵 日本語
- 🇫🇷 Français
- 🇪🇸 Español
- 🇩🇪 Deutsch
- 🇷🇺 Русский

语言选择会自动从浏览器设置检测，并保存在 localStorage 中。

### 主题支持

- 亮色模式
- 暗色模式
- 跟随系统（根据操作系统设置自动切换）

### 支持的文件格式

| 输入 | 输出 |
|------|------|
| `.md`, `.markdown`, `.txt` | `.docx`, `.pdf`, `.html` |
| `.docx` | `.md`, `.pdf` |
| `.html`, `.htm` | `.md` |
| `.pdf` | `.docx` |

### 文件大小限制

- 所有文件类型：最大 **100MB**

### 大文件处理

- 使用 **Web Worker** 在后台线程处理，避免阻塞 UI
- 显示处理进度条，提供实时反馈
- 支持超大文件的分块处理

### LaTeX 数学公式

支持行内公式和块级公式：

```markdown
行内公式：$E = mc^2$

块级公式：
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### 桌面应用特性

- 单实例模式 - 防止多个实例的资源冲突
- 原生文件保存对话框 - 选择保存位置
- 离线使用 - 无需网络连接

## 🌐 浏览器支持

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## 🤝 参与贡献

欢迎贡献代码！请随时提交 Pull Request。

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详情请查看 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [marked](https://github.com/markedjs/marked) - Markdown 解析器
- [marked-katex-extension](https://github.com/UziTech/marked-katex-extension) - LaTeX 数学公式扩展
- [KaTeX](https://github.com/KaTeX/KaTeX) - LaTeX 渲染引擎
- [docx](https://github.com/dolanmiu/docx) - Word 文档生成器
- [mammoth](https://github.com/mwilliamson/mammoth.js) - Word 文档解析器
- [turndown](https://github.com/mixmark-io/turndown) - HTML 转 Markdown 转换器
- [jspdf](https://github.com/parallax/jsPDF) - PDF 生成
- [html2canvas](https://github.com/niklasvh/html2canvas) - HTML 转画布渲染器
- [pdf.js](https://github.com/nicholasday/pdf.js) - PDF 解析
- [Tauri](https://tauri.app/) - 跨平台桌面应用框架

---

Made by Ryan © 2026
