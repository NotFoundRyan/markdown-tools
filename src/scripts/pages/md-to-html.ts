import { marked } from 'marked';
import markedKatex from 'marked-katex-extension';
import katex from 'katex';
import { showNotification, showError, showSuccess } from '../utils/notification';

if (!document.querySelector('link[href*="katex"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
  document.head.appendChild(link);
}

marked.use(markedKatex({
  throwOnError: false,
  output: 'html',
  nonStandard: true,
}));

const renderLatexInHtml = (html: string): string => {
  let result = html;

  result = result.replace(/\$\$([\s\S]+?)\$\$/g, (_match, formula) => {
    try {
      return katex.renderToString(formula.trim(), {
        displayMode: true,
        throwOnError: false,
        output: 'html',
      });
    } catch {
      return _match;
    }
  });

  result = result.replace(/\$(?!\$)([^\$\n]+?)\$(?!\$)/g, (_match, formula) => {
    if (formula.trim() === '') return _match;
    try {
      return katex.renderToString(formula.trim(), {
        displayMode: false,
        throwOnError: false,
        output: 'html',
      });
    } catch {
      return _match;
    }
  });

  return result;
};

let currentMarkdown = '';
let currentHtml = '';
let currentFileName = 'document';

const EXAMPLE_MARKDOWN = `# Markdown 示例文档

## 标题示例

这是一段普通的文本。支持 **粗体**、*斜体* 和 \`行内代码\`。

### 列表示例

- 第一项
- 第二项
- 第三项

1. 有序列表项 1
2. 有序列表项 2

### 代码块示例

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\`

### 引用示例

> 这是一段引用文本
> 可以有多行

### 链接和图片

[这是一个链接](https://example.com)

---

*文档结束*
`;

export function initMdToHtmlLogic() {
  const inputEditor = document.getElementById('input-editor') as HTMLTextAreaElement;
  const outputHtml = document.getElementById('output-html');
  const outputPreview = document.getElementById('output-preview');
  const inputLines = document.getElementById('input-lines');
  const outputLines = document.getElementById('output-lines');
  const clearBtn = document.getElementById('clear-btn');
  const copyBtn = document.getElementById('copy-btn');
  const downloadBtn = document.getElementById('download-btn');
  const exampleBtn = document.getElementById('example-btn');
  const fileInput = document.getElementById('file-input') as HTMLInputElement;
  const uploadSection = document.querySelector('.upload-section');
  const tabHtml = document.getElementById('tab-html');
  const tabPreview = document.getElementById('tab-preview');

  if (!inputEditor || !outputHtml || !outputPreview) return;

  const updateLineCount = () => {
    const inputLineCount = inputEditor.value ? inputEditor.value.split('\n').length : 0;
    const outputLineCount = currentHtml ? currentHtml.split('\n').length : 0;
    if (inputLines) inputLines.textContent = `${inputLineCount} lines`;
    if (outputLines) outputLines.textContent = `${outputLineCount} lines`;
  };

  const updateOutput = () => {
    currentMarkdown = inputEditor.value;
    let html = marked.parse(currentMarkdown) as string;
    html = renderLatexInHtml(html);
    currentHtml = html;
    outputHtml.textContent = currentHtml;
    outputPreview.innerHTML = currentHtml;
    updateLineCount();
  };

  const switchTab = (tab: string) => {
    if (tab === 'html') {
      outputHtml.style.display = 'block';
      outputPreview.style.display = 'none';
      tabHtml?.classList.add('active');
      tabPreview?.classList.remove('active');
    } else {
      outputHtml.style.display = 'none';
      outputPreview.style.display = 'block';
      tabHtml?.classList.remove('active');
      tabPreview?.classList.add('active');
    }
  };

  switchTab('preview');

  tabHtml?.addEventListener('click', () => switchTab('html'));
  tabPreview?.addEventListener('click', () => switchTab('preview'));

  inputEditor.addEventListener('input', updateOutput);

  uploadSection?.addEventListener('click', () => {
    fileInput?.click();
  });

  uploadSection?.addEventListener('dragover', ((e: DragEvent) => {
    e.preventDefault();
    uploadSection.classList.add('drag-over');
  }) as unknown as EventListener);

  uploadSection?.addEventListener('dragleave', () => {
    uploadSection.classList.remove('drag-over');
  });

  uploadSection?.addEventListener('drop', (async (e: DragEvent) => {
    e.preventDefault();
    uploadSection.classList.remove('drag-over');
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      await handleFile(files[0]);
    }
  }) as unknown as EventListener);

  fileInput?.addEventListener('change', async () => {
    if (fileInput.files && fileInput.files.length > 0) {
      await handleFile(fileInput.files[0]);
      fileInput.value = '';
    }
  });

  async function handleFile(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      showError('error.fileTooLarge');
      return;
    }

    currentFileName = file.name.replace(/\.(md|txt|markdown)$/i, '');

    try {
      const text = await file.text();
      inputEditor.value = text;
      updateOutput();
      showSuccess('success.converted');
    } catch (error) {
      console.error('文件读取失败:', error);
      showError('error.convertFailed');
    }
  }

  exampleBtn?.addEventListener('click', () => {
    inputEditor.value = EXAMPLE_MARKDOWN;
    updateOutput();
  });

  document.addEventListener('paste', async (e) => {
    const activeElement = document.activeElement;
    if (activeElement === inputEditor) {
      return;
    }

    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.kind === 'file') {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          if (file.size > 10 * 1024 * 1024) {
            showError('error.fileTooLarge');
            return;
          }

          if (file.name) {
            currentFileName = file.name.replace(/\.(md|txt|markdown)$/i, '');
          }

          try {
            const text = await file.text();
            inputEditor.value = text;
            updateOutput();
            showSuccess('success.converted');
          } catch (error) {
            console.error('文件读取失败:', error);
            showError('error.convertFailed');
          }
        }
        break;
      }
    }
  });

  clearBtn?.addEventListener('click', () => {
    inputEditor.value = '';
    currentMarkdown = '';
    currentHtml = '';
    currentFileName = 'document';
    outputHtml.textContent = '';
    outputPreview.innerHTML = '';
    updateLineCount();
  });

  copyBtn?.addEventListener('click', async () => {
    if (!currentHtml.trim()) {
      showError('error.emptyContent');
      return;
    }

    await navigator.clipboard.writeText(currentHtml);
    showNotification('已复制到剪贴板', 'success');
  });

  downloadBtn?.addEventListener('click', () => {
    if (!currentHtml.trim()) {
      showError('error.emptyContent');
      return;
    }

    const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${currentFileName}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    pre { background: #f5f5f5; padding: 16px; border-radius: 8px; overflow-x: auto; }
    code { background: #f5f5f5; padding: 2px 6px; border-radius: 4px; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 16px; color: #666; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f5f5f5; }
    .katex-display { margin: 1em 0; overflow-x: auto; }
  </style>
</head>
<body>
${currentHtml}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentFileName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSuccess('success.downloaded');
  });
}
