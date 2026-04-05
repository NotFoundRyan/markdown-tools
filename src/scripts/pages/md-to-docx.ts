import { marked, Token } from 'marked';
import markedKatex from 'marked-katex-extension';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle, Table, TableRow, TableCell, WidthType } from 'docx';
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

export function initMdToDocxLogic() {
  const inputEditor = document.getElementById('input-editor') as HTMLTextAreaElement;
  const previewArea = document.getElementById('preview-area');
  const clearBtn = document.getElementById('clear-btn');
  const downloadBtn = document.getElementById('download-btn');
  const exampleBtn = document.getElementById('example-btn');
  const fileInput = document.getElementById('file-input') as HTMLInputElement;
  const uploadArea = document.getElementById('upload-area');
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

  uploadArea?.addEventListener('click', () => {
    fileInput?.click();
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

  exampleBtn?.addEventListener('click', () => {
    inputEditor.value = EXAMPLE_MARKDOWN;
    currentMarkdown = EXAMPLE_MARKDOWN;
    previewArea.innerHTML = marked.parse(currentMarkdown) as string;
    updateLineCount();
  });

  clearBtn?.addEventListener('click', () => {
    inputEditor.value = '';
    currentMarkdown = '';
    previewArea.innerHTML = '';
    currentFileName = 'document';
    updateLineCount();
  });

  downloadBtn?.addEventListener('click', async () => {
    if (!currentMarkdown.trim()) {
      showError('error.emptyContent');
      return;
    }

    try {
      const doc = await convertMarkdownToDocx(currentMarkdown);
      const blob = await Packer.toBlob(doc);
      const saved = await saveFile(blob, `${currentFileName}.docx`, [
        { name: 'Word Document', extensions: ['docx'] },
      ]);
      if (saved) {
        showSuccess('success.downloaded');
      }
    } catch (error) {
      console.error('转换失败:', error);
      showError('error.convertFailed');
    }
  });

  updateLineCount();
}

async function convertMarkdownToDocx(markdown: string): Promise<Document> {
  const tokens = marked.lexer(markdown);
  const children: (Paragraph | Table)[] = [];

  for (const token of tokens) {
    const elements = await processToken(token);
    children.push(...elements);
  }

  return new Document({
    sections: [{
      properties: {},
      children: children,
    }],
  });
}

async function processToken(token: Token): Promise<(Paragraph | Table)[]> {
  const elements: (Paragraph | Table)[] = [];

  switch (token.type) {
    case 'heading':
      elements.push(new Paragraph({
        text: token.text,
        heading: token.depth === 1 ? HeadingLevel.HEADING_1 :
                 token.depth === 2 ? HeadingLevel.HEADING_2 :
                 token.depth === 3 ? HeadingLevel.HEADING_3 :
                 token.depth === 4 ? HeadingLevel.HEADING_4 :
                 HeadingLevel.HEADING_5,
      }));
      break;

    case 'paragraph':
      const runs = parseInlineTokens(token.tokens || []);
      elements.push(new Paragraph({ children: runs }));
      break;

    case 'list':
      if (token.items) {
        for (const item of token.items) {
          const itemRuns = parseInlineTokens(item.tokens || []);
          elements.push(new Paragraph({
            children: itemRuns,
            bullet: token.ordered ? { level: 0 } : { level: 0 },
          }));
        }
      }
      break;

    case 'code':
      elements.push(new Paragraph({
        children: [new TextRun({
          text: token.text,
          font: 'Consolas',
          size: 20,
        })],
        shading: { fill: 'F5F5F5' },
      }));
      break;

    case 'blockquote':
      const quoteRuns = parseInlineTokens(token.tokens || []);
      elements.push(new Paragraph({
        children: quoteRuns,
        indent: { left: 720 },
        border: {
          left: { style: BorderStyle.SINGLE, size: 12, color: 'CCCCCC' },
        },
      }));
      break;

    case 'hr':
      elements.push(new Paragraph({
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' },
        },
      }));
      break;

    case 'table':
      const rows: TableRow[] = [];
      if (token.header) {
        const headerCells = token.header.map((cell: string) =>
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: cell, bold: true })] })],
            width: { size: 100 / token.header.length, type: WidthType.PERCENTAGE },
          })
        );
        rows.push(new TableRow({ children: headerCells }));
      }
      if (token.rows) {
        for (const row of token.rows) {
          const rowCells = row.map((cell: string) =>
            new TableCell({
              children: [new Paragraph({ text: cell })],
              width: { size: 100 / row.length, type: WidthType.PERCENTAGE },
            })
          );
          rows.push(new TableRow({ children: rowCells }));
        }
      }
      elements.push(new Table({ rows }));
      break;

    case 'space':
      break;

    default:
      if ('raw' in token && token.raw) {
        elements.push(new Paragraph({ text: token.raw }));
      }
  }

  return elements;
}

function parseInlineTokens(tokens: Token[]): TextRun[] {
  const runs: TextRun[] = [];

  for (const token of tokens) {
    switch (token.type) {
      case 'text':
        runs.push(new TextRun({ text: token.text || '' }));
        break;
      case 'strong':
        runs.push(new TextRun({ text: token.text || '', bold: true }));
        break;
      case 'em':
        runs.push(new TextRun({ text: token.text || '', italics: true }));
        break;
      case 'code':
        runs.push(new TextRun({
          text: token.text || '',
          font: 'Consolas',
          shading: { fill: 'F5F5F5' },
        }));
        break;
      case 'link':
        runs.push(new TextRun({
          text: token.text || '',
          style: 'Hyperlink',
        }));
        break;
      default:
        if ('raw' in token && token.raw) {
          runs.push(new TextRun({ text: token.raw }));
        }
    }
  }

  return runs;
}
