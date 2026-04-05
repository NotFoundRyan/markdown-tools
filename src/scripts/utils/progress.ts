export interface ProgressOptions {
  title?: string;
  message?: string;
  progress?: number;
  showProgress?: boolean;
}

let progressOverlay: HTMLDivElement | null = null;
let progressBar: HTMLDivElement | null = null;
let progressText: HTMLSpanElement | null = null;
let progressMessage: HTMLParagraphElement | null = null;

function createProgressOverlay(): HTMLDivElement {
  if (progressOverlay) return progressOverlay;

  progressOverlay = document.createElement('div');
  progressOverlay.id = 'progress-overlay';
  progressOverlay.innerHTML = `
    <div class="progress-content">
      <div class="progress-spinner"></div>
      <h3 class="progress-title">Processing...</h3>
      <p class="progress-message">Please wait...</p>
      <div class="progress-bar-container">
        <div class="progress-bar"></div>
      </div>
      <span class="progress-text">0%</span>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    #progress-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      backdrop-filter: blur(4px);
    }
    
    .progress-content {
      background: var(--bg-secondary, #2a2a2a);
      border-radius: 16px;
      padding: 32px 48px;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      max-width: 400px;
      width: 90%;
    }
    
    .progress-spinner {
      width: 48px;
      height: 48px;
      border: 4px solid var(--border-color, #444);
      border-top-color: var(--primary-color, #4a9eff);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .progress-title {
      color: var(--text-primary, #fff);
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 600;
    }
    
    .progress-message {
      color: var(--text-secondary, #aaa);
      margin: 0 0 20px;
      font-size: 14px;
    }
    
    .progress-bar-container {
      width: 100%;
      height: 8px;
      background: var(--bg-tertiary, #333);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 12px;
    }
    
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--primary-color, #4a9eff), var(--accent-color, #6c5ce7));
      border-radius: 4px;
      width: 0%;
      transition: width 0.3s ease;
    }
    
    .progress-text {
      color: var(--text-secondary, #aaa);
      font-size: 14px;
    }
    
    @media (prefers-color-scheme: light) {
      .progress-content {
        background: #fff;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      }
      
      .progress-title {
        color: #1a1a1a;
      }
      
      .progress-message, .progress-text {
        color: #666;
      }
      
      .progress-bar-container {
        background: #e0e0e0;
      }
      
      .progress-spinner {
        border-color: #e0e0e0;
        border-top-color: #4a9eff;
      }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(progressOverlay);

  progressBar = progressOverlay.querySelector('.progress-bar');
  progressText = progressOverlay.querySelector('.progress-text');
  progressMessage = progressOverlay.querySelector('.progress-message');

  return progressOverlay;
}

export function showProgress(options: ProgressOptions = {}): void {
  const overlay = createProgressOverlay();
  overlay.style.display = 'flex';

  const title = overlay.querySelector('.progress-title');
  if (title && options.title) {
    title.textContent = options.title;
  }

  if (progressMessage && options.message) {
    progressMessage.textContent = options.message;
  }

  if (options.showProgress !== false) {
    updateProgress(options.progress || 0);
  } else {
    const barContainer = overlay.querySelector('.progress-bar-container') as HTMLElement;
    const textEl = overlay.querySelector('.progress-text') as HTMLElement;
    if (barContainer) barContainer.style.display = 'none';
    if (textEl) textEl.style.display = 'none';
  }
}

export function updateProgress(progress: number, message?: string): void {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  if (progressBar) {
    progressBar.style.width = `${clampedProgress}%`;
  }

  if (progressText) {
    progressText.textContent = `${Math.round(clampedProgress)}%`;
  }

  if (message && progressMessage) {
    progressMessage.textContent = message;
  }
}

export function hideProgress(): void {
  if (progressOverlay) {
    progressOverlay.style.display = 'none';
    updateProgress(0);
  }
}

export async function withProgress<T>(
  task: (update: (progress: number, message?: string) => void) => Promise<T>,
  options: ProgressOptions = {}
): Promise<T> {
  showProgress(options);
  try {
    const result = await task((progress, message) => {
      updateProgress(progress, message);
    });
    return result;
  } finally {
    hideProgress();
  }
}
