import mammoth from 'mammoth';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { showError, showSuccess } from '../utils/notification';
import { saveFile } from '../utils/fileSaver';
import { MAX_FILE_SIZE } from '../utils/fileSize';

let currentFileName = 'document';

export function initWordToPdfLogic() {
  const initialUploadArea = document.getElementById('initial-upload-area');
  const initialFileInput = document.getElementById('initial-file-input') as HTMLInputElement;
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('file-input') as HTMLInputElement;
  const outputContainer = document.getElementById('output-container');
  const uploadOnlyArea = document.getElementById('upload-only-area');
  const previewArea = document.getElementById('preview-area');
  const pageSizeSelect = document.getElementById('page-size') as HTMLSelectElement;
  const pageOrientationSelect = document.getElementById('page-orientation') as HTMLSelectElement;
  const pageMarginSelect = document.getElementById('page-margin') as HTMLSelectElement;
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
    if (!file.name.endsWith('.docx')) {
      showError('error.invalidFormat');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      showError('error.fileTooLarge');
      return;
    }

    currentFileName = file.name.replace(/\.docx$/i, '');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });

      if (previewArea) {
        previewArea.innerHTML = `
          <style>
            .word-content { font-family: 'Times New Roman', serif; line-height: 1.6; }
            .word-content p { margin: 0.5em 0; }
            .word-content h1, .word-content h2, .word-content h3 { margin: 1em 0 0.5em; }
            .word-content table { border-collapse: collapse; width: 100%; margin: 1em 0; }
            .word-content td, .word-content th { border: 1px solid #ccc; padding: 8px; }
            .word-content img { max-width: 100%; height: auto; }
          </style>
          <div class="word-content">${result.value}</div>
        `;
      }

      if (uploadOnlyArea) uploadOnlyArea.style.display = 'none';
      if (outputContainer) outputContainer.style.display = 'grid';

      showSuccess('success.converted');
    } catch (error) {
      console.error('转换失败:', error);
      showError('error.convertFailed');
    }
  }

  downloadBtn?.addEventListener('click', async () => {
    if (!previewArea?.innerHTML) {
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

  async function generatePdf(pageSize: string, orientation: 'portrait' | 'landscape', margin: number) {
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

  clearBtn?.addEventListener('click', () => {
    currentFileName = 'document';
    previewArea.innerHTML = '';
    if (outputContainer) outputContainer.style.display = 'none';
    if (uploadOnlyArea) uploadOnlyArea.style.display = 'block';
  });
}
