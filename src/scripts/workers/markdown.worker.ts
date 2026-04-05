import { marked } from 'marked';
import markedKatex from 'marked-katex-extension';

const katexExtension = markedKatex({
  throwOnError: false,
  output: 'html',
});

marked.setOptions({
  gfm: true,
  breaks: true,
});
marked.use(katexExtension);

self.onmessage = async (e: MessageEvent) => {
  const { type, data, id } = e.data;

  try {
    let result: string;

    switch (type) {
      case 'parseMarkdown':
        self.postMessage({ type: 'progress', id, progress: 10 });
        
        result = await marked.parse(data) as string;
        
        self.postMessage({ type: 'progress', id, progress: 90 });
        self.postMessage({ type: 'result', id, result });
        break;

      case 'parseMarkdownChunked':
        const chunkSize = 10000;
        const chunks = Math.ceil(data.length / chunkSize);
        let html = '';
        
        for (let i = 0; i < chunks; i++) {
          const start = i * chunkSize;
          const end = Math.min(start + chunkSize, data.length);
          const chunk = data.slice(start, end);
          
          html += await marked.parse(chunk) as string;
          
          const progress = 10 + Math.round((i / chunks) * 80);
          self.postMessage({ type: 'progress', id, progress });
        }
        
        self.postMessage({ type: 'result', id, result: html });
        break;

      default:
        self.postMessage({ type: 'error', id, error: 'Unknown task type' });
    }
  } catch (error) {
    self.postMessage({ 
      type: 'error', 
      id, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

export {};
