import { save } from '@tauri-apps/plugin-dialog';
import { writeFile } from '@tauri-apps/plugin-fs';

export function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI__' in window;
}

export async function saveFile(
  blob: Blob,
  defaultName: string,
  filters?: { name: string; extensions: string[] }[]
): Promise<boolean> {
  if (isTauri()) {
    try {
      const filePath = await save({
        defaultPath: defaultName,
        filters: filters || [{ name: 'All Files', extensions: ['*'] }],
      });

      if (filePath) {
        const arrayBuffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        await writeFile(filePath, uint8Array);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Tauri save failed, falling back to browser download:', error);
      return browserDownload(blob, defaultName);
    }
  } else {
    return browserDownload(blob, defaultName);
  }
}

function browserDownload(blob: Blob, filename: string): boolean {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  return true;
}
