import { withProgress } from './progress';

const workerCache = new Map<string, Worker>();

function getMarkdownWorker(): Worker {
  if (workerCache.has('markdown')) {
    return workerCache.get('markdown')!;
  }

  const worker = new Worker(
    new URL('../workers/markdown.worker.ts', import.meta.url),
    { type: 'module' }
  );

  workerCache.set('markdown', worker);
  return worker;
}

interface WorkerTaskOptions {
  showProgress?: boolean;
  progressTitle?: string;
  progressMessage?: string;
}

export function parseMarkdownWithWorker(
  markdown: string,
  options: WorkerTaskOptions = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const worker = getMarkdownWorker();
    const id = Date.now().toString();

    const handleProgress = (progress: number) => {
      if (options.showProgress) {
        const { updateProgress } = require('./progress');
        updateProgress(progress);
      }
    };

    const handleMessage = (e: MessageEvent) => {
      if (e.data.id !== id) return;

      switch (e.data.type) {
        case 'progress':
          handleProgress(e.data.progress);
          break;
        case 'result':
          worker.removeEventListener('message', handleMessage);
          resolve(e.data.result);
          break;
        case 'error':
          worker.removeEventListener('message', handleMessage);
          reject(new Error(e.data.error));
          break;
      }
    };

    worker.addEventListener('message', handleMessage);

    const taskType = markdown.length > 50000 ? 'parseMarkdownChunked' : 'parseMarkdown';
    worker.postMessage({ type: taskType, data: markdown, id });
  });
}

export async function parseMarkdownWithProgress(
  markdown: string,
  options: WorkerTaskOptions = {}
): Promise<string> {
  if (options.showProgress) {
    return withProgress(
      (update) => parseMarkdownWithWorker(markdown, { ...options, showProgress: false })
        .then(result => {
          update(100);
          return result;
        }),
      {
        title: options.progressTitle || 'Processing Markdown...',
        message: options.progressMessage || 'Please wait while we parse your content',
      }
    );
  }

  return parseMarkdownWithWorker(markdown, options);
}

export function terminateWorkers(): void {
  workerCache.forEach(worker => worker.terminate());
  workerCache.clear();
}
