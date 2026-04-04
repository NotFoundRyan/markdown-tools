import TurndownService from 'turndown';
import { showError, showSuccess } from '../utils/notification';
import { t } from '../utils/i18n';

let currentHtml = '';
let currentMarkdown = '';
let currentFileName = 'document';

const EXAMPLE_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>HTML 示例文档</title>
</head>
<body>
  <h1>HTML 示例文档</h1>

  <h2>标题示例</h2>
  <p>这是一段普通的文本。支持 <strong>粗体</strong>、<em>斜体</em> 和 <code>行内代码</code>。</p>

  <h3>列表示例</h3>
  <ul>
    <li>第一项</li>
    <li>第二项</li>
    <li>第三项</li>
  </ul>

  <ol>
    <li>有序列表项 1</li>
    <li>有序列表项 2</li>
  </ol>

  <h3>代码块示例</h3>
  <pre><code>function hello() {
  console.log('Hello, World!');
}</code></pre>

  <h3>引用示例</h3>
  <blockquote>
    <p>这是一段引用文本</p>
    <p>可以有多行</p>
  </blockquote>

  <h3>链接和图片</h3>
  <p><a href="https://example.com">这是一个链接</a></p>

  <hr>

  <p><em>文档结束</em></p>
</body>
</html>`;

export function initHtmlToMdLogic() {
  const inputEditor = document.getElementById('input-editor') as HTMLTextAreaElement;
  const outputArea = document.getElementById('output-area');
  const inputLines = document.getElementById('input-lines');
  const outputLines = document.getElementById('output-lines');
  const copyBtn = document.getElementById('copy-btn');
  const downloadBtn = document.getElementById('download-btn');
  const clearBtn = document.getElementById('clear-btn');
  const exampleBtn = document.getElementById('example-btn');
  const fileInput = document.getElementById('file-input') as HTMLInputElement;
  const uploadArea = document.getElementById('upload-area');

  if (!inputEditor || !outputArea) return;

  const updateLineCount = () => {
    const inputLineCount = inputEditor.value ? inputEditor.value.split('\n').length : 0;
    const outputLineCount = currentMarkdown ? currentMarkdown.split('\n').length : 0;
    if (inputLines) inputLines.textContent = `${inputLineCount} lines`;
    if (outputLines) outputLines.textContent = `${outputLineCount} lines`;
  };

  const convertHtmlToMd = () => {
    currentHtml = inputEditor.value;

    if (!currentHtml.trim()) {
      currentMarkdown = '';
      outputArea.textContent = '';
      updateLineCount();
      return;
    }

    try {
      const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
      });

      turndownService.addRule('table', {
        filter: 'table',
        replacement: function(content, node) {
          const table = node as HTMLTableElement;
          const rows = table.querySelectorAll('tr');
          if (rows.length === 0) return content;

          let md = '\n';
          let headerProcessed = false;

          rows.forEach((row, rowIndex) => {
            const cells = row.querySelectorAll('th, td');
            if (cells.length === 0) return;

            const cellContents = Array.from(cells).map(cell => {
              const text = cell.textContent?.trim() || '';
              return text.replace(/\|/g, '\\|');
            });

            md += '| ' + cellContents.join(' | ') + ' |\n';

            if (!headerProcessed && (row.querySelector('th') || rowIndex === 0)) {
              md += '| ' + cellContents.map(() => '---').join(' | ') + ' |\n';
              headerProcessed = true;
            }
          });

          return md + '\n';
        }
      });

      currentMarkdown = turndownService.turndown(currentHtml);
      outputArea.textContent = currentMarkdown;
      updateLineCount();
    } catch (error) {
      console.error('转换失败:', error);
      showError('error.convertFailed');
    }
  };

  inputEditor.addEventListener('input', convertHtmlToMd);

  uploadArea?.addEventListener('click', () => {
    fileInput?.click();
  });

  uploadArea?.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.add('dragover');
  });

  uploadArea?.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.remove('dragover');
  });

  uploadArea?.addEventListener('drop', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.remove('dragover');

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  });

  fileInput?.addEventListener('change', async () => {
    if (fileInput.files && fileInput.files.length > 0) {
      await processFile(fileInput.files[0]);
    }
  });

  async function processFile(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      showError('error.fileTooLarge');
      return;
    }

    currentFileName = file.name.replace(/\.(html|htm|txt)$/i, '');

    try {
      const text = await file.text();
      inputEditor.value = text;
      currentHtml = text;
      convertHtmlToMd();
      showSuccess('success.converted');
    } catch (error) {
      console.error('文件读取失败:', error);
      showError('error.convertFailed');
    }
  }

  exampleBtn?.addEventListener('click', () => {
    inputEditor.value = EXAMPLE_HTML;
    currentHtml = EXAMPLE_HTML;
    convertHtmlToMd();
  });

  clearBtn?.addEventListener('click', () => {
    inputEditor.value = '';
    currentHtml = '';
    currentMarkdown = '';
    currentFileName = 'document';
    outputArea.textContent = '';
    updateLineCount();
  });

  copyBtn?.addEventListener('click', async () => {
    if (!currentMarkdown.trim()) {
      showError('error.emptyContent');
      return;
    }

    await navigator.clipboard.writeText(currentMarkdown);
    showNotification(t('btn.copied'), 'success');
  });

  downloadBtn?.addEventListener('click', () => {
    if (!currentMarkdown.trim()) {
      showError('error.emptyContent');
      return;
    }

    const blob = new Blob([currentMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentFileName}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSuccess('success.downloaded');
  });

  updateLineCount();
}

function showNotification(message: string, type: 'success' | 'error') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 2000);
}
