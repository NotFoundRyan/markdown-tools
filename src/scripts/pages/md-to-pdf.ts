import { marked } from 'marked';
import markedKatex from 'marked-katex-extension';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { showError, showSuccess } from '../utils/notification';
import { saveFile } from '../utils/fileSaver';
import { MAX_FILE_SIZE } from '../utils/fileSize';

if (!document.querySelector('link[href*="katex"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
  document.head.appendChild(link);
}

marked.use(markedKatex({
  throwOnError: false,
  output: 'html',
}));

let currentMarkdown = '';
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

export function initMdToPdfLogic() {
  const inputEditor = document.getElementById('input-editor') as HTMLTextAreaElement;
  const previewArea = document.getElementById('preview-area');
  const clearBtn = document.getElementById('clear-btn');
  const downloadBtn = document.getElementById('download-btn');
  const exampleBtn = document.getElementById('example-btn');
  const fileInput = document.getElementById('file-input') as HTMLInputElement;
  const uploadArea = document.getElementById('upload-area');
  const pageSizeSelect = document.getElementById('page-size') as HTMLSelectElement;
  const pageOrientationSelect = document.getElementById('page-orientation') as HTMLSelectElement;
  const pageMarginSelect = document.getElementById('page-margin') as HTMLSelectElement;
  const inputLines = document.getElementById('input-lines');

  if (!inputEditor || !previewArea) return;

  const updateLineCount = () => {
    const lineCount = inputEditor.value ? inputEditor.value.split('\n').length : 0;
    if (inputLines) inputLines.textContent = `${lineCount} lines`;
  };

  const updatePreview = () => {
    currentMarkdown = inputEditor.value;
    previewArea.innerHTML = marked.parse(currentMarkdown) as string;
    updateLineCount();
  };

  inputEditor.addEventListener('input', updatePreview);

  inputEditor.addEventListener('scroll', () => {
    if (!previewArea) return;
    const scrollRatio = inputEditor.scrollTop / (inputEditor.scrollHeight - inputEditor.clientHeight);
    previewArea.scrollTop = scrollRatio * (previewArea.scrollHeight - previewArea.clientHeight);
  });

  uploadArea?.addEventListener('click', () => {
    fileInput?.click();
  });

  exampleBtn?.addEventListener('click', () => {
    inputEditor.value = EXAMPLE_MARKDOWN;
    currentMarkdown = EXAMPLE_MARKDOWN;
    previewArea.innerHTML = marked.parse(currentMarkdown) as string;
    updateLineCount();
  });

  fileInput?.addEventListener('change', async () => {
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      if (file.size > MAX_FILE_SIZE) {
        showError('error.fileTooLarge');
        return;
      }

      currentFileName = file.name.replace(/\.(md|txt|markdown)$/i, '');

      try {
        const text = await file.text();
        inputEditor.value = text;
        currentMarkdown = text;
        previewArea.innerHTML = marked.parse(currentMarkdown) as string;
        updateLineCount();
        showSuccess('success.converted');
      } catch (error) {
        console.error('文件读取失败:', error);
        showError('error.convertFailed');
      }
    }
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
      const file = files[0];

      if (file.size > MAX_FILE_SIZE) {
        showError('error.fileTooLarge');
        return;
      }

      currentFileName = file.name.replace(/\.(md|txt|markdown)$/i, '');

      try {
        const text = await file.text();
        inputEditor.value = text;
        currentMarkdown = text;
        previewArea.innerHTML = marked.parse(currentMarkdown) as string;
        updateLineCount();
        showSuccess('success.converted');
      } catch (error) {
        console.error('文件读取失败:', error);
        showError('error.convertFailed');
      }
    }
  });

  clearBtn?.addEventListener('click', () => {
    inputEditor.value = '';
    currentMarkdown = '';
    currentFileName = 'document';
    previewArea.innerHTML = '';
    updateLineCount();
  });

  downloadBtn?.addEventListener('click', async () => {
    if (!currentMarkdown.trim()) {
      showError('error.emptyContent');
      return;
    }

    const pageSize = pageSizeSelect?.value || 'a4';
    const orientation = pageOrientationSelect?.value || 'portrait';
    const margin = parseInt(pageMarginSelect?.value || '10');

    if (downloadBtn) {
      downloadBtn.classList.add('loading');
      downloadBtn.setAttribute('disabled', 'true');
    }

    try {
      await generatePdf(pageSize, orientation as 'portrait' | 'landscape', margin);
    } finally {
      if (downloadBtn) {
        downloadBtn.classList.remove('loading');
        downloadBtn.removeAttribute('disabled');
      }
    }
  });

  updateLineCount();
}

async function generatePdf(pageSize: string, orientation: 'portrait' | 'landscape', margin: number) {
  const previewArea = document.getElementById('preview-area');
  if (!previewArea) return;

  try {
    const canvas = await html2canvas(previewArea, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: previewArea.scrollWidth,
      windowHeight: previewArea.scrollHeight,
    });

    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: pageSize as 'a3' | 'a4' | 'letter' | 'legal',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const contentWidth = pageWidth - 2 * margin;
    const contentHeight = pageHeight - 2 * margin;

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = contentWidth / imgWidth;
    const scaledHeight = imgHeight * ratio;

    const usablePageHeight = contentHeight;
    const numPages = Math.ceil(scaledHeight / usablePageHeight);

    for (let page = 0; page < numPages; page++) {
      if (page > 0) {
        pdf.addPage();
      }

      const sourceY = (page * usablePageHeight) / ratio;
      const sourceHeight = Math.min(usablePageHeight / ratio, imgHeight - sourceY);

      if (sourceHeight <= 0) break;

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = imgWidth;
      tempCanvas.height = sourceHeight;
      const ctx = tempCanvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(
          canvas,
          0, sourceY, imgWidth, sourceHeight,
          0, 0, imgWidth, sourceHeight
        );

        const pageImgData = tempCanvas.toDataURL('image/png');
        const pageScaledHeight = sourceHeight * ratio;

        pdf.addImage(pageImgData, 'PNG', margin, margin, contentWidth, pageScaledHeight);
      }
    }

    const pdfBlob = pdf.output('blob');
    const saved = await saveFile(pdfBlob, `${currentFileName}.pdf`, [
      { name: 'PDF Document', extensions: ['pdf'] },
    ]);
    if (saved) {
      showSuccess('success.downloaded');
    }
  } catch (error) {
    console.error('PDF 生成失败:', error);
    showError('error.convertFailed');
  }
}
