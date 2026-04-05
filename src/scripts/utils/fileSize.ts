export const MAX_FILE_SIZE = 100 * 1024 * 1024;

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function checkFileSize(file: File): { valid: boolean; message?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      message: `File size ${formatFileSize(file.size)} exceeds maximum ${formatFileSize(MAX_FILE_SIZE)}` 
    };
  }
  return { valid: true };
}
