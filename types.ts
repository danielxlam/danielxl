
export interface UploadedImage {
  id: string;
  file: File;
  base64: string;
  name: string;
  type: string;
}

export interface HistoryEntry {
  prompt: string;
  thumbnail: string; // The base64 data URL for the small thumbnail image
  timestamp: number;
  fullImage?: string; // The full-resolution base64 data URL, for session restore
}

export interface GeminiEditResponse {
    image: string | null;
    text: string | null;
}
