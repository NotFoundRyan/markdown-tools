import mammoth from 'mammoth';
import TurndownService from 'turndown';
import { marked } from 'marked';
import { showNotification, showError, showSuccess } from '../utils/notification';
import { t } from '../utils/i18n';

let currentMarkdown = '';
let currentFileName = 'document';

export function initWordToMdLogic() {
  const initialUploadArea = document.getElementById('initial-upload-area');
  const initialFileInput = document.getElementById('initial-file-input') as HTMLInputElement;
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('file-input') as HTMLInputElement;
  const outputContainer = document.getElementById('output-container');
  const uploadOnlyArea = document.getElementById('upload-only-area');
  const outputContent = document.getElementById('output-content') as HTMLTextAreaElement;
  const previewArea = document.getElementById('preview-area');
  const outputLines = document.getElementById('output-lines');
  const copyBtn = document.getElementById('copy-btn');
  const downloadBtn = document.getElementById('download-btn');
  const clearBtn = document.getElementById('clear-btn');

  if (!outputContent || !previewArea) return;

  const updateLineCount = () => {
    const lineCount = outputContent.value ? outputContent.value.split('\n').length : 0;
    if (outputLines) outputLines.textContent = `${lineCount} lines`;
  };

  initialUploadArea?.addEventListener('click', () => {
    initialFileInput?.click();
  });

  uploadArea?.addEventListener('click', () => {
    fileInput?.click();
  });

  const setupDragDrop = (element: HTMLElement | null) => {
    if (!element) return;

    element.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      element.classList.add('dragover');
    });

    element.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      element.classList.remove('dragover');
    });

    element.addEventListener('drop', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      element.classList.remove('dragover');

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        await processFile(files[0]);
      }
    });
  };

  setupDragDrop(initialUploadArea);
  setupDragDrop(uploadArea);

  initialFileInput?.addEventListener('change', async () => {
    if (initialFileInput.files && initialFileInput.files.length > 0) {
      await processFile(initialFileInput.files[0]);
    }
  });

  fileInput?.addEventListener('change', async () => {
    if (fileInput.files && fileInput.files.length > 0) {
      await processFile(fileInput.files[0]);
    }
  });

  async function processFile(file: File) {
    if (!file.name.endsWith('.docx')) {
      showError('error.invalidFormat');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showError('error.fileTooLarge');
      return;
    }

    currentFileName = file.name.replace(/\.docx$/i, '');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });

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

      turndownService.addRule('image', {
        filter: 'img',
        replacement: function(_content, node) {
          const img = node as HTMLImageElement;
          const alt = img.alt || '图片';
          const src = img.getAttribute('src') || '';
          if (src.startsWith('data:')) {
            return `\n![${alt}](图片已移除)\n`;
          }
          return `![${alt}](${src})`;
        }
      });

      currentMarkdown = turndownService.turndown(result.value);

      outputContent.value = currentMarkdown;
      if (previewArea) {
        previewArea.innerHTML = marked.parse(currentMarkdown) as string;
      }
      updateLineCount();

      if (uploadOnlyArea) uploadOnlyArea.style.display = 'none';
      if (outputContainer) outputContainer.style.display = 'grid';

      showSuccess('success.converted');
    } catch (error) {
      console.error('转换失败:', error);
      showError('error.convertFailed');
    }
  }

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

  clearBtn?.addEventListener('click', () => {
    currentMarkdown = '';
    currentFileName = 'document';
    outputContent.value = '';
    previewArea.innerHTML = '';
    updateLineCount();
    if (outputContainer) outputContainer.style.display = 'none';
    if (uploadOnlyArea) uploadOnlyArea.style.display = 'block';
  });
}
