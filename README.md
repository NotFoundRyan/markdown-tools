# Markdown Tools

一个现代化的、本地优先的 Web 应用程序，用于在 Markdown、Word、HTML 和 PDF 格式之间进行转换。以隐私为核心设计 - 所有转换都在您的浏览器中本地进行。

## 功能特性

- **Markdown 转 Word** - 将 Markdown 文件转换为 Word 文档（.docx），保留格式
- **Word 转 Markdown** - 将 Word 文档转换为 Markdown 格式，便于编辑
- **Markdown 转 PDF** - 将 Markdown 转换为 PDF 文档，适合打印和分享
- **Markdown 转 HTML** - 将 Markdown 转换为 HTML 代码，用于网页发布
- **HTML 转 Markdown** - 将 HTML 代码转换为 Markdown 格式
- **Word 转 PDF** - 将 Word 文档转换为 PDF 文件
- **PDF 转 Word** - 将 PDF 文件转换为 Word 文档

## 主要亮点

- 🔒 **隐私优先** - 所有转换都在您的浏览器中本地进行，不会向任何服务器发送数据
- 🌍 **多语言支持** - 支持 7 种语言：中文、英语、日语、法语、西班牙语、德语和俄语
- 🎨 **现代化界面** - 简洁的磨砂玻璃设计，支持亮色/暗色主题
- 📱 **响应式设计** - 适用于桌面和移动设备
- ⚡ **快速高效** - 使用 Vite 构建，开发速度快，生产构建优化
- 📝 **LaTeX 支持** - Markdown 转 Word/PDF/HTML 支持数学公式渲染

## 技术栈

- **Vite** - 下一代前端构建工具
- **TypeScript** - 类型安全的 JavaScript
- **marked** - Markdown 解析器
- **marked-katex-extension** - LaTeX 数学公式支持
- **docx** - Word 文档生成器
- **mammoth** - Word 文档解析器
- **turndown** - HTML 转 Markdown 转换器
- **jspdf** + **html2canvas** - PDF 生成
- **pdfjs-dist** - PDF 解析

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

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
# 启动开发服务器
npm run dev
```

应用程序将在 `http://localhost:3000` 上运行

### 生产构建

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 项目结构

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
│   │   │   ├── md-to-docx.ts
│   │   │   ├── word-to-md.ts
│   │   │   ├── md-to-pdf.ts
│   │   │   ├── md-to-html.ts
│   │   │   ├── html-to-md.ts
│   │   │   ├── word-to-pdf.ts
│   │   │   └── pdf-to-word.ts
│   │   ├── utils/           # 工具函数
│   │   │   ├── i18n.ts      # 国际化
│   │   │   ├── theme.ts     # 主题管理
│   │   │   └── notification.ts
│   │   └── router.ts        # 客户端路由
│   └── styles/
│       ├── components/      # 组件样式
│       │   ├── navbar.css
│       │   ├── buttons.css
│       │   ├── editor.css
│       │   ├── uploader.css
│       │   ├── notification.css
│       │   └── footer.css
│       ├── pages/           # 页面样式
│       │   ├── home.css
│       │   └── converter.css
│       ├── variables.css    # CSS 变量
│       ├── base.css         # 基础样式
│       ├── glass.css        # 磨砂玻璃效果
│       └── main.css         # 主样式表
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 功能详解

### 国际化 (i18n)

应用程序支持 7 种语言：
- 🇨🇳 中文
- 🇺🇸 English
- 🇯🇵 日本語
- 🇫🇷 Français
- 🇪🇸 Español
- 🇩🇪 Deutsch
- 🇷🇺 Русский

语言选择会自动从浏览器设置中检测，并保存在 localStorage 中。

### 主题支持

- 亮色模式
- 暗色模式
- 跟随系统（根据操作系统设置自动切换）

### 支持的文件格式

| 输入 | 输出 |
|-------|--------|
| `.md`, `.markdown`, `.txt` | `.docx`, `.pdf`, `.html` |
| `.docx` | `.md`, `.pdf` |
| `.html`, `.htm` | `.md` |
| `.pdf` | `.docx` |

### 文件大小限制

- Markdown/Word/HTML 文件：最大 10MB
- PDF 文件：最大 20MB

### LaTeX 数学公式

支持行内公式和块级公式：

```markdown
行内公式：$E = mc^2$

块级公式：
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

## API 参考

### i18n 模块

```typescript
import { t, setLang, getCurrentLang, getAllLanguages } from './utils/i18n';

// 获取翻译
const text = t('nav.home');

// 设置语言
setLang('en');

// 获取当前语言
const lang = getCurrentLang();

// 获取所有可用语言
const languages = getAllLanguages();
```

### 通知模块

```typescript
import { showNotification, showError, showSuccess } from './utils/notification';

// 显示通知
showNotification('消息', 'success');

// 显示错误（使用 i18n 键）
showError('error.fileTooLarge');

// 显示成功（使用 i18n 键）
showSuccess('success.converted');
```

## 浏览器支持

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## 贡献

欢迎贡献！请随时提交 Pull Request。

1. Fork 本仓库
2. 创建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详情请查看 [LICENSE](LICENSE) 文件。

## 致谢

- [marked](https://github.com/markedjs/marked) - Markdown 解析器
- [marked-katex-extension](https://github.com/UziTech/marked-katex-extension) - LaTeX 数学公式扩展
- [KaTeX](https://github.com/KaTeX/KaTeX) - LaTeX 渲染引擎
- [docx](https://github.com/dolanmiu/docx) - Word 文档生成器
- [mammoth](https://github.com/mwilliamson/mammoth.js) - Word 文档解析器
- [turndown](https://github.com/mixmark-io/turndown) - HTML 转 Markdown 转换器
- [jspdf](https://github.com/parallax/jsPDF) - PDF 生成
- [html2canvas](https://github.com/niklasvh/html2canvas) - HTML 转画布渲染器
- [pdf.js](https://github.com/nicholasday/pdf.js) - PDF 解析

---

Made by Ryan © 2026
