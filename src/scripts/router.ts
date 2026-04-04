type Route = {
  path: string;
  title: string;
  component: () => void;
};

const routes: Route[] = [
  { path: '/', title: 'Home', component: renderHome },
  { path: '/md-to-docx', title: 'Markdown to Word', component: renderMdToDocx },
  { path: '/word-to-md', title: 'Word to Markdown', component: renderWordToMd },
  { path: '/md-to-pdf', title: 'Markdown to PDF', component: renderMdToPdf },
  { path: '/md-to-html', title: 'Markdown to HTML', component: renderMdToHtml },
  { path: '/html-to-md', title: 'HTML to Markdown', component: renderHtmlToMd },
  { path: '/word-to-pdf', title: 'Word to PDF', component: renderWordToPdf },
  { path: '/pdf-to-word', title: 'PDF to Word', component: renderPdfToWord },
  { path: '/changelog', title: 'Changelog', component: renderChangelog },
];

function getPath(): string {
  return window.location.hash.slice(1) || '/';
}

function findRoute(path: string): Route | undefined {
  return routes.find((r) => r.path === path);
}

export function navigate(path: string) {
  window.location.hash = path;
}

function updateActiveLink() {
  const currentPath = getPath();
  document.querySelectorAll('.navbar-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === `#${currentPath}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function renderNavbar() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <nav class="navbar">
      <a href="#/" class="navbar-brand" data-i18n="nav.home">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" rx="10" fill="currentColor"/>
          <text x="50" y="65" font-size="50" text-anchor="middle" fill="white" font-family="Arial" font-weight="bold">M</text>
        </svg>
        Markdown Tools
      </a>
      <button class="navbar-toggle" id="navbar-toggle">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12h18M3 6h18M3 18h18"/>
        </svg>
      </button>
      <div class="navbar-menu" id="navbar-menu">
        <a href="#/md-to-docx" class="navbar-link" data-i18n="nav.md-to-docx">Markdown 转 Word</a>
        <a href="#/word-to-md" class="navbar-link" data-i18n="nav.word-to-md">Word 转 Markdown</a>
        <a href="#/md-to-pdf" class="navbar-link" data-i18n="nav.md-to-pdf">Markdown 转 PDF</a>
        <a href="#/md-to-html" class="navbar-link" data-i18n="nav.md-to-html">Markdown 转 HTML</a>
        <a href="#/html-to-md" class="navbar-link" data-i18n="nav.html-to-md">HTML 转 Markdown</a>
        <a href="#/word-to-pdf" class="navbar-link" data-i18n="nav.word-to-pdf">Word 转 PDF</a>
        <a href="#/pdf-to-word" class="navbar-link" data-i18n="nav.pdf-to-word">PDF 转 Word</a>
        <a href="#/changelog" class="navbar-link" data-i18n="nav.changelog">更新日志</a>
      </div>
      <div class="navbar-actions">
        <button class="navbar-btn" id="theme-toggle" title="Toggle theme">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" id="theme-icon">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        </button>
        <div class="lang-dropdown">
          <button class="navbar-btn" id="lang-toggle" title="Switch language">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </button>
          <div class="lang-dropdown-menu" id="lang-menu"></div>
        </div>
      </div>
    </nav>
    <main id="main-content"></main>
    <footer class="footer">
      <div class="footer-content">
        <span class="footer-author">Made by Ryan © 2026</span>
        <a href="https://github.com/NotFoundRyan/markdown-tools" target="_blank" rel="noopener noreferrer" class="footer-link" data-i18n="footer.github">GitHub</a>
      </div>
    </footer>
  `;

  const toggle = document.getElementById('navbar-toggle');
  const menu = document.getElementById('navbar-menu');

  toggle?.addEventListener('click', () => {
    menu?.classList.toggle('active');
  });

  document.querySelectorAll('.navbar-link').forEach((link) => {
    link.addEventListener('click', () => {
      menu?.classList.remove('active');
    });
  });
}

function render() {
  const path = getPath();
  const route = findRoute(path);
  const main = document.getElementById('main-content');

  if (main && route) {
    route.component();
  } else if (main) {
    main.innerHTML = '<div class="converter"><div class="converter-header"><h1>404</h1><p>Page not found</p></div></div>';
  }

  updateActiveLink();
}

export function initRouter() {
  renderNavbar();
  render();

  window.addEventListener('hashchange', render);
}

function renderHome() {
  const main = document.getElementById('main-content');
  if (!main) return;

  main.innerHTML = `
    <div class="home">
      <div class="home-hero">
        <h1 class="home-title" data-i18n="home.title">Markdown 转换工具</h1>
        <p class="home-subtitle" data-i18n="home.subtitle">本地运行，隐私安全，支持多种格式互转</p>
      </div>
      <div class="home-grid">
        <a href="#/md-to-docx" class="home-card">
          <svg class="home-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          <h3 class="home-card-title" data-i18n="home.md-to-docx.title">Markdown 转 Word</h3>
          <p class="home-card-desc" data-i18n="home.md-to-docx.desc">将 Markdown 文件转换为 Word 文档，保留格式和样式</p>
        </a>
        <a href="#/word-to-md" class="home-card">
          <svg class="home-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          <h3 class="home-card-title" data-i18n="home.word-to-md.title">Word 转 Markdown</h3>
          <p class="home-card-desc" data-i18n="home.word-to-md.desc">将 Word 文档转换为 Markdown 格式，便于编辑和版本管理</p>
        </a>
        <a href="#/md-to-pdf" class="home-card">
          <svg class="home-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <path d="M10 12v6"/>
            <path d="M14 12v6"/>
            <path d="M10 15h4"/>
          </svg>
          <h3 class="home-card-title" data-i18n="home.md-to-pdf.title">Markdown 转 PDF</h3>
          <p class="home-card-desc" data-i18n="home.md-to-pdf.desc">将 Markdown 转换为 PDF 文档，适合打印和分享</p>
        </a>
        <a href="#/md-to-html" class="home-card">
          <svg class="home-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"/>
            <polyline points="8 6 2 12 8 18"/>
          </svg>
          <h3 class="home-card-title" data-i18n="home.md-to-html.title">Markdown 转 HTML</h3>
          <p class="home-card-desc" data-i18n="home.md-to-html.desc">将 Markdown 转换为 HTML 代码，便于网页发布</p>
        </a>
        <a href="#/html-to-md" class="home-card">
          <svg class="home-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="8 6 2 12 8 18"/>
            <polyline points="16 18 22 12 16 6"/>
          </svg>
          <h3 class="home-card-title" data-i18n="home.html-to-md.title">HTML 转 Markdown</h3>
          <p class="home-card-desc" data-i18n="home.html-to-md.desc">将 HTML 代码转换为 Markdown 格式</p>
        </a>
        <a href="#/word-to-pdf" class="home-card">
          <svg class="home-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <path d="M10 12v6"/>
            <path d="M14 12v6"/>
            <path d="M10 15h4"/>
          </svg>
          <h3 class="home-card-title" data-i18n="home.word-to-pdf.title">Word 转 PDF</h3>
          <p class="home-card-desc" data-i18n="home.word-to-pdf.desc">将 Word 文档转换为 PDF 文件，适合打印和分享</p>
        </a>
        <a href="#/pdf-to-word" class="home-card">
          <svg class="home-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          <h3 class="home-card-title" data-i18n="home.pdf-to-word.title">PDF 转 Word</h3>
          <p class="home-card-desc" data-i18n="home.pdf-to-word.desc">将 PDF 文件转换为 Word 文档，便于编辑和修改</p>
        </a>
      </div>
    </div>
  `;
}

function renderMdToDocx() {
  const main = document.getElementById('main-content');
  if (!main) return;

  main.innerHTML = `
    <div class="converter md-html-page">
      <div class="converter-header">
        <h1 class="converter-title" data-i18n="home.md-to-docx.title">Markdown 转 Word</h1>
        <p class="converter-desc" data-i18n="home.md-to-docx.desc">将 Markdown 文件转换为 Word 文档，保留格式和样式</p>
      </div>
      <div class="converter-content">
        <div class="md-html-container">
          <div class="md-html-left">
            <div class="card upload-card">
              <div class="card-header">
                <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <h2 class="card-title">上传 Markdown 文件</h2>
              </div>
              <div class="upload-area" id="upload-area">
                <input type="file" id="file-input" accept=".md,.txt,.markdown" style="display: none;">
                <input type="file" id="batch-file-input" accept=".md,.txt,.markdown" multiple style="display: none;">
                <div class="upload-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <path d="M12 18v-6"/>
                    <path d="M9 15l3-3 3 3"/>
                  </svg>
                </div>
                <p class="upload-main-text">拖放 <code>.md</code>、<code>.markdown</code> 或 <code>.txt</code> 文件到此处</p>
                <p class="upload-sub-text">或点击选择文件</p>
                <p class="upload-limit">支持最大 10MB 的 Markdown 和文本文件</p>
              </div>
            </div>
            <div class="card editor-card">
              <div class="card-header">
                <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
                <h2 class="card-title">Markdown 内容</h2>
                <span class="line-count" id="input-lines">0 lines</span>
                <button class="btn btn-ghost btn-sm" id="example-btn" data-i18n="btn.example">加载示例</button>
              </div>
              <div class="editor-wrapper">
                <textarea class="editor-textarea" id="input-editor" placeholder="在此输入 Markdown 内容..." data-i18n-placeholder="editor.placeholder"></textarea>
              </div>
            </div>
          </div>
          <div class="md-html-right">
            <div class="card output-card">
              <div class="card-header">
                <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <h2 class="card-title">预览</h2>
              </div>
              <div class="output-wrapper">
                <div class="output-preview" id="preview-area"></div>
              </div>
              <div class="card-footer">
                <button class="btn btn-primary" id="download-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px; margin-right: 6px;">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  下载 Word
                </button>
                <button class="btn btn-ghost" id="clear-btn">清空</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  initMdToDocxLogic();
}

function renderWordToMd() {
  const main = document.getElementById('main-content');
  if (!main) return;

  main.innerHTML = `
    <div class="converter md-html-page">
      <div class="converter-header">
        <h1 class="converter-title" data-i18n="home.word-to-md.title">Word 转 Markdown</h1>
        <p class="converter-desc" data-i18n="home.word-to-md.desc">将 Word 文档转换为 Markdown 格式，便于编辑和版本管理</p>
      </div>
      <div class="converter-content">
        <div class="md-html-container" id="output-container" style="display: none;">
          <div class="md-html-left">
            <div class="card upload-card">
              <div class="card-header">
                <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <h2 class="card-title">上传 Word 文件</h2>
              </div>
              <div class="upload-area" id="upload-area">
                <input type="file" id="file-input" accept=".docx" style="display: none;">
                <div class="upload-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <path d="M12 18v-6"/>
                    <path d="M9 15l3-3 3 3"/>
                  </svg>
                </div>
                <p class="upload-main-text">拖放 <code>.docx</code> 文件到此处</p>
                <p class="upload-sub-text">或点击选择文件</p>
                <p class="upload-limit">支持最大 10MB 的 Word 文档</p>
              </div>
            </div>
            <div class="card editor-card">
              <div class="card-header">
                <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
                <h2 class="card-title">Markdown 输出</h2>
                <span class="line-count" id="output-lines">0 lines</span>
                <button class="btn btn-ghost btn-sm" id="copy-btn" data-i18n="btn.copy">复制</button>
              </div>
              <div class="editor-wrapper">
                <textarea class="editor-textarea" id="output-content" readonly placeholder="转换后的 Markdown 内容将显示在这里..."></textarea>
              </div>
            </div>
          </div>
          <div class="md-html-right">
            <div class="card output-card">
              <div class="card-header">
                <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <h2 class="card-title">预览</h2>
              </div>
              <div class="output-wrapper">
                <div class="output-preview" id="preview-area"></div>
              </div>
              <div class="card-footer">
                <button class="btn btn-primary" id="download-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px; margin-right: 6px;">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  下载 Markdown
                </button>
                <button class="btn btn-ghost" id="clear-btn">清空</button>
              </div>
            </div>
          </div>
        </div>
        <div class="card upload-only-card" id="upload-only-area">
          <div class="card-header">
            <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <h2 class="card-title">上传 Word 文件</h2>
          </div>
          <div class="upload-area upload-area-large" id="initial-upload-area">
            <input type="file" id="initial-file-input" accept=".docx" style="display: none;">
            <div class="upload-icon upload-icon-large">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <path d="M12 18v-6"/>
                <path d="M9 15l3-3 3 3"/>
              </svg>
            </div>
            <p class="upload-main-text">拖放 <code>.docx</code> 文件到此处</p>
            <p class="upload-sub-text">或点击选择文件</p>
            <p class="upload-limit">支持最大 10MB 的 Word 文档</p>
          </div>
        </div>
      </div>
    </div>
  `;

  initWordToMdLogic();
}

function renderMdToPdf() {
  const main = document.getElementById('main-content');
  if (!main) return;

  main.innerHTML = `
    <div class="converter md-html-page">
      <div class="converter-header">
        <h1 class="converter-title" data-i18n="home.md-to-pdf.title">Markdown 转 PDF</h1>
        <p class="converter-desc" data-i18n="home.md-to-pdf.desc">将 Markdown 转换为 PDF 文档，适合打印和分享</p>
      </div>
      <div class="converter-content">
        <div class="md-html-container">
          <div class="md-html-left">
            <div class="card upload-card">
              <div class="card-header">
                <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <h2 class="card-title">上传 Markdown 文件</h2>
              </div>
              <div class="upload-area" id="upload-area">
                <input type="file" id="file-input" accept=".md,.txt,.markdown" style="display: none;">
                <div class="upload-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <path d="M12 18v-6"/>
                    <path d="M9 15l3-3 3 3"/>
                  </svg>
                </div>
                <p class="upload-main-text">拖放 <code>.md</code>、<code>.markdown</code> 或 <code>.txt</code> 文件到此处</p>
                <p class="upload-sub-text">或点击选择文件</p>
                <p class="upload-limit">支持最大 10MB 的 Markdown 和文本文件</p>
              </div>
            </div>
            <div class="card editor-card">
              <div class="card-header">
                <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
                <h2 class="card-title">Markdown 内容</h2>
                <span class="line-count" id="input-lines">0 lines</span>
                <button class="btn btn-ghost btn-sm" id="example-btn" data-i18n="btn.example">加载示例</button>
              </div>
              <div class="editor-wrapper">
                <textarea class="editor-textarea" id="input-editor" placeholder="在此输入 Markdown 内容..." data-i18n-placeholder="editor.placeholder"></textarea>
              </div>
            </div>
          </div>
          <div class="md-html-right">
            <div class="card output-card">
              <div class="card-header">
                <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <h2 class="card-title">预览</h2>
              </div>
              <div class="output-wrapper">
                <div class="output-preview" id="preview-area"></div>
              </div>
              <div class="card-footer pdf-options">
                <div class="pdf-option-group">
                  <label class="pdf-option-label">页面大小</label>
                  <select id="page-size" class="pdf-select">
                    <option value="a4">A4</option>
                    <option value="a3">A3</option>
                    <option value="letter">Letter</option>
                    <option value="legal">Legal</option>
                  </select>
                </div>
                <div class="pdf-option-group">
                  <label class="pdf-option-label">方向</label>
                  <select id="page-orientation" class="pdf-select">
                    <option value="portrait">纵向</option>
                    <option value="landscape">横向</option>
                  </select>
                </div>
                <div class="pdf-option-group">
                  <label class="pdf-option-label">边距</label>
                  <select id="page-margin" class="pdf-select">
                    <option value="10">标准 (10mm)</option>
                    <option value="15">宽 (15mm)</option>
                    <option value="5">窄 (5mm)</option>
                    <option value="0">无边距</option>
                  </select>
                </div>
                <button class="btn btn-primary" id="download-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px; margin-right: 6px;">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  下载 PDF
                </button>
                <button class="btn btn-ghost" id="clear-btn">清空</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  initMdToPdfLogic();
}

function renderMdToHtml() {
  const main = document.getElementById('main-content');
  if (!main) return;

  main.innerHTML = `
    <div class="converter md-html-page">
      <div class="converter-header">
        <h1 class="converter-title" data-i18n="home.md-to-html.title">Markdown 转 HTML</h1>
        <p class="converter-desc" data-i18n="home.md-to-html.desc">将 Markdown 转换为 HTML 代码，便于网页发布</p>
      </div>
      <div class="converter-content">
        <div class="md-html-container">
          <div class="md-html-left">
            <div class="left-section">
              <h2 class="section-title">上传 Markdown 文件</h2>
              <div class="upload-section">
                <input type="file" id="file-input" accept=".md,.txt,.markdown" style="display: none;">
                <div class="upload-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <path d="M12 18v-6"/>
                    <path d="M9 15l3-3 3 3"/>
                  </svg>
                </div>
                <p class="upload-main-text">拖放 <code>.md</code>、<code>.markdown</code> 或 <code>.txt</code> 文件到此处，或点击选择</p>
                <p class="upload-limit">支持最大 10MB 的 Markdown 和文本文件</p>
              </div>
            </div>
            <div class="left-section">
              <div class="section-header">
                <h2 class="section-title">Markdown 内容</h2>
                <span class="line-count" id="input-lines">0 lines</span>
                <button class="btn btn-ghost btn-sm" id="example-btn">加载示例</button>
              </div>
              <div class="editor-wrapper">
                <textarea class="editor-textarea" id="input-editor" placeholder="在此输入 Markdown 内容..."></textarea>
              </div>
            </div>
          </div>
          <div class="md-html-right">
            <div class="section-header">
              <h2 class="section-title">生成的 HTML</h2>
              <span class="line-count" id="output-lines">0 lines</span>
              <div class="tab-capsule">
                <button class="capsule-btn" id="tab-html">HTML</button>
                <button class="capsule-btn active" id="tab-preview">预览</button>
              </div>
            </div>
            <div class="output-wrapper">
              <pre class="output-code" id="output-html" style="display: none;"></pre>
              <div class="output-preview" id="output-preview"></div>
            </div>
            <div class="action-buttons">
              <button class="btn btn-primary" id="copy-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px; margin-right: 6px;">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                复制 HTML
              </button>
              <button class="btn btn-secondary" id="download-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px; margin-right: 6px;">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                下载 .html
              </button>
              <button class="btn btn-ghost" id="clear-btn">清空</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  initMdToHtmlLogic();
}

function renderHtmlToMd() {
  const main = document.getElementById('main-content');
  if (!main) return;

  main.innerHTML = `
    <div class="converter md-html-page">
      <div class="converter-header">
        <h1 class="converter-title" data-i18n="home.html-to-md.title">HTML 转 Markdown</h1>
        <p class="converter-desc" data-i18n="home.html-to-md.desc">将 HTML 代码转换为 Markdown 格式</p>
      </div>
      <div class="converter-content">
        <div class="md-html-container">
          <div class="md-html-left">
            <div class="card upload-card">
              <div class="card-header">
                <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <h2 class="card-title">上传 HTML 文件</h2>
              </div>
              <div class="upload-area" id="upload-area">
                <input type="file" id="file-input" accept=".html,.htm,.txt" style="display: none;">
                <div class="upload-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <path d="M12 18v-6"/>
                    <path d="M9 15l3-3 3 3"/>
                  </svg>
                </div>
                <p class="upload-main-text">拖放 <code>.html</code> 或 <code>.htm</code> 文件到此处</p>
                <p class="upload-sub-text">或点击选择文件</p>
                <p class="upload-limit">支持最大 10MB 的 HTML 文件</p>
              </div>
            </div>
            <div class="card editor-card">
              <div class="card-header">
                <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="16 18 22 12 16 6"/>
                  <polyline points="8 6 2 12 8 18"/>
                </svg>
                <h2 class="card-title">HTML 输入</h2>
                <span class="line-count" id="input-lines">0 lines</span>
                <button class="btn btn-ghost btn-sm" id="example-btn" data-i18n="btn.example">加载示例</button>
              </div>
              <div class="editor-wrapper">
                <textarea class="editor-textarea" id="input-editor" placeholder="在此输入 HTML 内容..." data-i18n-placeholder="editor.placeholder"></textarea>
              </div>
            </div>
          </div>
          <div class="md-html-right">
            <div class="card output-card">
              <div class="card-header">
                <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
                <h2 class="card-title">Markdown 输出</h2>
                <span class="line-count" id="output-lines">0 lines</span>
                <button class="btn btn-ghost btn-sm" id="copy-btn" data-i18n="btn.copy">复制</button>
              </div>
              <div class="output-wrapper">
                <pre class="output-code" id="output-area"></pre>
              </div>
              <div class="card-footer">
                <button class="btn btn-primary" id="download-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px; margin-right: 6px;">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  下载 Markdown
                </button>
                <button class="btn btn-ghost" id="clear-btn">清空</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  initHtmlToMdLogic();
}

function renderChangelog() {
  const main = document.getElementById('main-content');
  if (!main) return;

  main.innerHTML = `
    <div class="converter">
      <div class="converter-header">
        <h1 class="converter-title" data-i18n="changelog.title">更新日志</h1>
      </div>
      <div class="converter-content">
        <div class="changelog-list">
          ${renderChangelogItems()}
        </div>
      </div>
    </div>
  `;
}

function renderChangelogItems(): string {
  const changelogs = [
    {
      version: 'V1.0.1',
      date: '2026-04-05',
      changes: [
        { type: 'fix', text: '修复 Markdown 转 HTML 页面 HTML/预览 Tab 切换功能：原 CSS 使用 flex 布局导致 display:none 无法正确隐藏元素，改为 position:absolute 定位实现正确的切换效果' },
        { type: 'fix', text: '修复 LaTeX 行内公式渲染问题：marked-katex-extension 要求块级公式 $$ 必须独立成行，改进 renderLatexInHtml 后处理函数，使用负向先行断言 /\\$(?!\\$)/ 正则匹配未被处理的行内公式' },
        { type: 'opt', text: '优化 Markdown 转 HTML 页面布局结构：将上传区域和 Markdown 编辑器整合到左侧上下排列，生成的 HTML 输出区域独立在右侧，三模块同被 md-html-container 容器包裹' }
      ]
    },
    {
      version: 'V1.0.0',
      date: '2026-04-04',
      changes: [
        { type: 'new', text: '项目初版上线，支持 Markdown 转 Word、PDF、HTML，Word 转 Markdown，HTML 转 Markdown' }
      ]
    }
  ];

  return changelogs.map(item => `
    <div class="changelog-item glass" style="margin-bottom: var(--spacing-lg); padding: var(--spacing-lg); border-radius: var(--radius-lg);">
      <div style="display: flex; align-items: center; gap: var(--spacing-md); margin-bottom: var(--spacing-md);">
        <span style="font-size: var(--font-size-lg); font-weight: 600;">${item.version}</span>
        <span style="font-size: var(--font-size-sm); color: var(--color-text-tertiary);">${item.date}</span>
      </div>
      <ul style="list-style: none;">
        ${item.changes.map(change => `
          <li style="display: flex; align-items: flex-start; gap: var(--spacing-sm); margin-bottom: var(--spacing-sm);">
            <span class="changelog-badge changelog-badge-${change.type}" style="
              padding: 2px 8px;
              border-radius: var(--radius-sm);
              font-size: var(--font-size-xs);
              font-weight: 500;
              background: ${change.type === 'new' ? 'var(--color-accent)' : change.type === 'fix' ? '#e74c3c' : '#3498db'};
              color: white;
              flex-shrink: 0;
            ">${change.type === 'new' ? '新增' : change.type === 'fix' ? '修复' : '优化'}</span>
            <span style="color: var(--color-text-secondary);">${change.text}</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `).join('');
}

function renderWordToPdf() {
  const main = document.getElementById('main-content');
  if (!main) return;

  main.innerHTML = `
    <div class="converter md-html-page">
      <div class="converter-header">
        <h1 class="converter-title" data-i18n="home.word-to-pdf.title">Word 转 PDF</h1>
        <p class="converter-desc" data-i18n="home.word-to-pdf.desc">将 Word 文档转换为 PDF 文件，适合打印和分享</p>
      </div>
      <div class="converter-content">
        <div class="upload-only-card" id="upload-only-area">
          <div class="card-header">
            <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <h2 class="card-title">上传 Word 文件</h2>
          </div>
          <div class="upload-area upload-area-large" id="initial-upload-area">
            <input type="file" id="initial-file-input" accept=".docx" style="display: none;">
            <div class="upload-icon upload-icon-large">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <path d="M12 18v-6"/>
                <path d="M9 15l3-3 3 3"/>
              </svg>
            </div>
            <p class="upload-main-text">拖放 <code>.docx</code> 文件到此处</p>
            <p class="upload-sub-text">或点击选择文件</p>
            <p class="upload-limit">支持最大 10MB 的 Word 文档</p>
          </div>
        </div>
        <div class="md-html-container" id="output-container" style="display: none;">
          <div class="md-html-left">
            <div class="card upload-card">
              <div class="card-header">
                <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <h2 class="card-title">上传 Word 文件</h2>
              </div>
              <div class="upload-area" id="upload-area">
                <input type="file" id="file-input" accept=".docx" style="display: none;">
                <div class="upload-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <path d="M12 18v-6"/>
                    <path d="M9 15l3-3 3 3"/>
                  </svg>
                </div>
                <p class="upload-main-text">拖放 <code>.docx</code> 文件到此处</p>
                <p class="upload-sub-text">或点击选择文件</p>
                <p class="upload-limit">支持最大 10MB 的 Word 文档</p>
              </div>
            </div>
          </div>
          <div class="md-html-right">
            <div class="card output-card">
              <div class="card-header">
                <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <h2 class="card-title">预览</h2>
              </div>
              <div class="output-wrapper">
                <div class="output-preview" id="preview-area"></div>
              </div>
              <div class="card-footer pdf-options">
                <div class="pdf-option-group">
                  <label class="pdf-option-label">页面大小</label>
                  <select id="page-size" class="pdf-select">
                    <option value="a4">A4</option>
                    <option value="a3">A3</option>
                    <option value="letter">Letter</option>
                    <option value="legal">Legal</option>
                  </select>
                </div>
                <div class="pdf-option-group">
                  <label class="pdf-option-label">方向</label>
                  <select id="page-orientation" class="pdf-select">
                    <option value="portrait">纵向</option>
                    <option value="landscape">横向</option>
                  </select>
                </div>
                <div class="pdf-option-group">
                  <label class="pdf-option-label">边距</label>
                  <select id="page-margin" class="pdf-select">
                    <option value="10">标准 (10mm)</option>
                    <option value="15">宽 (15mm)</option>
                    <option value="5">窄 (5mm)</option>
                    <option value="0">无边距</option>
                  </select>
                </div>
                <button class="btn btn-primary" id="download-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px; margin-right: 6px;">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  下载 PDF
                </button>
                <button class="btn btn-ghost" id="clear-btn">清空</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  initWordToPdfLogic();
}

function renderPdfToWord() {
  const main = document.getElementById('main-content');
  if (!main) return;

  main.innerHTML = `
    <div class="converter md-html-page">
      <div class="converter-header">
        <h1 class="converter-title" data-i18n="home.pdf-to-word.title">PDF 转 Word</h1>
        <p class="converter-desc" data-i18n="home.pdf-to-word.desc">将 PDF 文件转换为 Word 文档，便于编辑和修改</p>
      </div>
      <div class="converter-content">
        <div class="upload-only-card" id="upload-only-area">
          <div class="card-header">
            <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <h2 class="card-title">上传 PDF 文件</h2>
          </div>
          <div class="upload-area upload-area-large" id="initial-upload-area">
            <input type="file" id="initial-file-input" accept=".pdf" style="display: none;">
            <div class="upload-icon upload-icon-large">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <path d="M12 18v-6"/>
                <path d="M9 15l3-3 3 3"/>
              </svg>
            </div>
            <p class="upload-main-text">拖放 <code>.pdf</code> 文件到此处</p>
            <p class="upload-sub-text">或点击选择文件</p>
            <p class="upload-limit">支持最大 20MB 的 PDF 文件</p>
          </div>
        </div>
        <div class="md-html-container" id="output-container" style="display: none;">
          <div class="md-html-left">
            <div class="card upload-card">
              <div class="card-header">
                <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <h2 class="card-title">上传 PDF 文件</h2>
              </div>
              <div class="upload-area" id="upload-area">
                <input type="file" id="file-input" accept=".pdf" style="display: none;">
                <div class="upload-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <path d="M12 18v-6"/>
                    <path d="M9 15l3-3 3 3"/>
                  </svg>
                </div>
                <p class="upload-main-text">拖放 <code>.pdf</code> 文件到此处</p>
                <p class="upload-sub-text">或点击选择文件</p>
                <p class="upload-limit">支持最大 20MB 的 PDF 文件</p>
              </div>
            </div>
          </div>
          <div class="md-html-right">
            <div class="card output-card">
              <div class="card-header">
                <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <h2 class="card-title">预览</h2>
                <span class="line-count" id="page-count">0 页</span>
              </div>
              <div class="output-wrapper">
                <div class="output-preview" id="preview-area"></div>
              </div>
              <div class="card-footer">
                <button class="btn btn-primary" id="download-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px; margin-right: 6px;">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  下载 Word
                </button>
                <button class="btn btn-ghost" id="clear-btn">清空</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  initPdfToWordLogic();
}

import { initMdToDocxLogic } from './pages/md-to-docx';
import { initWordToMdLogic } from './pages/word-to-md';
import { initMdToPdfLogic } from './pages/md-to-pdf';
import { initMdToHtmlLogic } from './pages/md-to-html';
import { initHtmlToMdLogic } from './pages/html-to-md';
import { initWordToPdfLogic } from './pages/word-to-pdf';
import { initPdfToWordLogic } from './pages/pdf-to-word';
