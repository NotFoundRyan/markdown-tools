import * as pdfjsLib from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle } from 'docx';
import { showError, showSuccess } from '../utils/notification';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

let currentFileName = 'document';
let pdfDocument: pdfjsLib.PDFDocumentProxy | null = null;

interface TextItem {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontName: string;
  fontSize: number;
}

interface LineData {
  items: TextItem[];
  y: number;
}

function isCodeFont(fontName: string): boolean {
  const codeFonts = ['Courier', 'Consolas', 'Monaco', 'Menlo', 'monospace', 'Code', 'Mono'];
  return codeFonts.some(f => fontName.toLowerCase().includes(f.toLowerCase()));
}

function isPageNumber(str: string): boolean {
  const trimmed = str.trim();
  return /^第\s*\d+\s*页$/.test(trimmed) || /^Page\s*\d+$/i.test(trimmed);
}

function isButtonArtifact(str: string): boolean {
  const artifacts = ['复制编辑', '复制', '编辑', 'Copy', 'Edit', '分享', 'Share'];
  return artifacts.includes(str.trim());
}

function detectHeading(text: string, fontSize: number, avgFontSize: number): boolean {
  const trimmed = text.trim();
  if (trimmed.length > 50) return false;
  if (fontSize > avgFontSize * 1.3) return true;
  if (/^[一二三四五六七八九十]+[、.．]/.test(trimmed)) return true;
  if (/^\d+[.．、]\s*[^.．、]+$/.test(trimmed) && trimmed.length < 20) return true;
  return false;
}

function processPageText(items: TextItem[], avgFontSize: number): string[] {
  if (items.length === 0) return [];

  const lineHeightThreshold = avgFontSize * 0.8;

  const lines: LineData[] = [];

  for (const item of items) {
    if (isPageNumber(item.str) || isButtonArtifact(item.str)) {
      continue;
    }

    let foundLine = false;
    for (const line of lines) {
      if (Math.abs(line.y - item.y) < lineHeightThreshold) {
        line.items.push(item);
        foundLine = true;
        break;
      }
    }

    if (!foundLine) {
      lines.push({
        items: [item],
        y: item.y,
      });
    }
  }

  lines.sort((a, b) => b.y - a.y);

  for (const line of lines) {
    line.items.sort((a, b) => a.x - b.x);
  }

  const paragraphs: string[] = [];
  for (const line of lines) {
    const text = line.items
      .map(i => i.str)
      .join('')
      .replace(/\s+/g, ' ')
      .trim();

    if (text) {
      paragraphs.push(text);
    }
  }

  return paragraphs;
}

function mergeLinesIntoParagraphs(lines: string[]): string[] {
  if (lines.length === 0) return [];

  const mergedLines: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = i < lines.length - 1 ? lines[i + 1] : '';

    if (/^答案\s*$/.test(line.trim()) && /^：/.test(nextLine)) {
      mergedLines.push(line + nextLine);
      i++;
    } else {
      mergedLines.push(line);
    }
  }

  const result: string[] = [];
  let currentParagraph = '';

  for (let i = 0; i < mergedLines.length; i++) {
    const line = mergedLines[i];
    const nextLine = i < mergedLines.length - 1 ? mergedLines[i + 1] : '';

    const endsWithPunctuation = /[。！？；：）】」』"']$/.test(line);
    const startsWithPunctuation = /^[（【「『"']/.test(nextLine);
    const isShortLine = line.length < 30;
    const nextIsHeading = /^[一二三四五六七八九十]+[、.．]/.test(nextLine) || /^\d+[.．、]\s/.test(nextLine);

    if (currentParagraph === '') {
      currentParagraph = line;
    } else {
      currentParagraph += line;
    }

    if (endsWithPunctuation || startsWithPunctuation || isShortLine || nextIsHeading || i === mergedLines.length - 1) {
      result.push(currentParagraph);
      currentParagraph = '';
    }
  }

  if (currentParagraph) {
    result.push(currentParagraph);
  }

  return result;
}

export function initPdfToWordLogic() {
  const initialUploadArea = document.getElementById('initial-upload-area');
  const initialFileInput = document.getElementById('initial-file-input') as HTMLInputElement;
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('file-input') as HTMLInputElement;
  const outputContainer = document.getElementById('output-container');
  const uploadOnlyArea = document.getElementById('upload-only-area');
  const previewArea = document.getElementById('preview-area');
  const pageCount = document.getElementById('page-count');
  const downloadBtn = document.getElementById('download-btn');
  const clearBtn = document.getElementById('clear-btn');

  if (!previewArea) return;

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
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      showError('error.invalidFormat');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      showError('error.fileTooLarge');
      return;
    }

    currentFileName = file.name.replace(/\.pdf$/i, '');

    try {
      const arrayBuffer = await file.arrayBuffer();
      pdfDocument = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      const numPages = pdfDocument.numPages;
      if (pageCount) pageCount.textContent = `${numPages} 页`;

      const allLines: string[] = [];
      let totalFontSize = 0;
      let fontSizeCount = 0;
      const pageTextItems: TextItem[][] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();
        const pageItems: TextItem[] = [];

        for (const item of textContent.items) {
          if ('str' in item && item.str.trim()) {
            const tx = item.transform;
            const fontSize = Math.abs(tx[0]) || 12;

            pageItems.push({
              str: item.str,
              x: tx[4],
              y: tx[5],
              width: item.width,
              height: item.height,
              fontName: item.fontName || '',
              fontSize,
            });

            totalFontSize += fontSize;
            fontSizeCount++;
          }
        }
        pageTextItems.push(pageItems);
      }

      const avgFontSize = fontSizeCount > 0 ? totalFontSize / fontSizeCount : 12;

      for (const pageItems of pageTextItems) {
        const pageLines = processPageText(pageItems, avgFontSize);
        allLines.push(...pageLines);
      }

      const paragraphs = mergeLinesIntoParagraphs(allLines);

      let htmlContent = '';
      for (const para of paragraphs) {
        const isHeading = detectHeading(para, avgFontSize, avgFontSize);
        const isCode = isCodeFont(para) || /^[a-zA-Z_][a-zA-Z0-9_\s]*[=:]/.test(para);

        if (isCode && para.length < 100) {
          htmlContent += `<pre class="code-block"><code>${escapeHtml(para)}</code></pre>`;
        } else if (isHeading) {
          htmlContent += `<h3>${escapeHtml(para)}</h3>`;
        } else {
          htmlContent += `<p>${escapeHtml(para)}</p>`;
        }
      }

      if (previewArea) {
        previewArea.innerHTML = `
          <style>
            .pdf-content { font-family: 'Microsoft YaHei', sans-serif; line-height: 1.8; }
            .pdf-content p { margin: 0.5em 0; text-indent: 2em; }
            .pdf-content h3 { margin: 1em 0 0.5em; font-weight: bold; text-indent: 0; }
            .code-block {
              background: #f5f5f5;
              border: 1px solid #ddd;
              border-radius: 4px;
              padding: 12px;
              margin: 1em 0;
              font-family: 'Consolas', 'Monaco', monospace;
              font-size: 13px;
              overflow-x: auto;
              white-space: pre;
              text-indent: 0;
            }
            .code-block code { white-space: pre; }
          </style>
          <div class="pdf-content">${htmlContent}</div>
        `;
      }

      if (uploadOnlyArea) uploadOnlyArea.style.display = 'none';
      if (outputContainer) outputContainer.style.display = 'grid';

      showSuccess('success.converted');
    } catch (error) {
      console.error('PDF 解析失败:', error);
      showError('error.convertFailed');
    }
  }

  function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  downloadBtn?.addEventListener('click', async () => {
    if (!pdfDocument) {
      showError('error.emptyContent');
      return;
    }

    if (downloadBtn) {
      downloadBtn.classList.add('loading');
      downloadBtn.setAttribute('disabled', 'true');
    }

    try {
      await generateWord();
    } finally {
      if (downloadBtn) {
        downloadBtn.classList.remove('loading');
        downloadBtn.removeAttribute('disabled');
      }
    }
  });

  async function generateWord() {
    if (!pdfDocument) return;

    try {
      const docParagraphs: Paragraph[] = [];
      const numPages = pdfDocument.numPages;

      const allLines: string[] = [];
      let totalFontSize = 0;
      let fontSizeCount = 0;
      const pageTextItems: TextItem[][] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();
        const pageItems: TextItem[] = [];

        for (const item of textContent.items) {
          if ('str' in item && item.str.trim()) {
            const tx = item.transform;
            const fontSize = Math.abs(tx[0]) || 12;

            pageItems.push({
              str: item.str,
              x: tx[4],
              y: tx[5],
              width: item.width,
              height: item.height,
              fontName: item.fontName || '',
              fontSize,
            });

            totalFontSize += fontSize;
            fontSizeCount++;
          }
        }
        pageTextItems.push(pageItems);
      }

      const avgFontSize = fontSizeCount > 0 ? totalFontSize / fontSizeCount : 12;

      for (const pageItems of pageTextItems) {
        const pageLines = processPageText(pageItems, avgFontSize);
        allLines.push(...pageLines);
      }

      const paragraphs = mergeLinesIntoParagraphs(allLines);

      for (const para of paragraphs) {
        const isHeading = detectHeading(para, avgFontSize, avgFontSize);
        const isCode = isCodeFont(para) || /^[a-zA-Z_][a-zA-Z0-9_\s]*[=:]/.test(para);

        if (isCode && para.length < 100) {
          docParagraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: para,
                  font: 'Consolas',
                  size: 20,
                }),
              ],
              spacing: { after: 0, line: 276 },
              shading: {
                fill: 'F5F5F5',
              },
              border: {
                left: {
                  style: BorderStyle.SINGLE,
                  size: 12,
                  color: 'CCCCCC',
                },
              },
              indent: { left: 200 },
            })
          );
          docParagraphs.push(
            new Paragraph({
              children: [],
              spacing: { after: 120 },
            })
          );
        } else if (isHeading) {
          docParagraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: para,
                  bold: true,
                  size: 28,
                }),
              ],
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 240, after: 120 },
            })
          );
        } else {
          docParagraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: para,
                  size: 24,
                }),
              ],
              spacing: { after: 120 },
              indent: {
                firstLine: 480,
              },
            })
          );
        }
      }

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: docParagraphs,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentFileName}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showSuccess('success.downloaded');
    } catch (error) {
      console.error('Word 生成失败:', error);
      showError('error.convertFailed');
    }
  }

  clearBtn?.addEventListener('click', () => {
    currentFileName = 'document';
    pdfDocument = null;
    previewArea.innerHTML = '';
    if (pageCount) pageCount.textContent = '0 页';
    if (outputContainer) outputContainer.style.display = 'none';
    if (uploadOnlyArea) uploadOnlyArea.style.display = 'block';
  });
}
