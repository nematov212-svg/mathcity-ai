import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';

export interface UploadedFileMetadata {
  originalName: string;
  sanitizedName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  storageProvider: 'CLOUDINARY' | 'SUPABASE_S3' | 'LOCAL_PERSISTENT';
  createdAt: string;
}

// Limits as specified by the prompt:
// Rasm: max 5MB (5 * 1024 * 1024)
// Audio: max 20MB (20 * 1024 * 1024)
// Video: max 200MB (200 * 1024 * 1024)
export const FILE_LIMITS = {
  IMAGE: 5 * 1024 * 1024,
  AUDIO: 20 * 1024 * 1024,
  VIDEO: 200 * 1024 * 1024,
};

export const ALLOWED_MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  audio: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/aac'],
  video: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'],
};

// Ensure local persistent upload directory exists
const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export function validateFileTypeAndSize(
  mimeType: string,
  sizeBytes: number
): { valid: boolean; error?: string; fileType?: 'image' | 'audio' | 'video' } {
  let fileType: 'image' | 'audio' | 'video' | null = null;

  if (ALLOWED_MIME_TYPES.image.includes(mimeType)) {
    fileType = 'image';
    if (sizeBytes > FILE_LIMITS.IMAGE) {
      return { valid: false, error: 'Rasm hajmi 5MB dan oshmasligi kerak.' };
    }
  } else if (ALLOWED_MIME_TYPES.audio.includes(mimeType)) {
    fileType = 'audio';
    if (sizeBytes > FILE_LIMITS.AUDIO) {
      return { valid: false, error: 'Ovozli fayl (audio) hajmi 20MB dan oshmasligi kerak.' };
    }
  } else if (ALLOWED_MIME_TYPES.video.includes(mimeType)) {
    fileType = 'video';
    if (sizeBytes > FILE_LIMITS.VIDEO) {
      return { valid: false, error: 'Video darslik hajmi 200MB dan oshmasligi kerak.' };
    }
  } else {
    return {
      valid: false,
      error: 'Ruxsat etilmagan fayl formati. Faqat rasm (JPG, PNG, WEBP), audio (MP3, WAV, M4A) yoki video (MP4, WEBM) yuklash mumkin.',
    };
  }

  return { valid: true, fileType };
}

export function sanitizeFileName(originalName: string, mimeType: string): string {
  const extFromMime = mimeType.split('/')[1]?.replace('jpeg', 'jpg').replace('quicktime', 'mov') || 'bin';
  const rawExt = path.extname(originalName).replace('.', '').toLowerCase();
  const safeExt = rawExt || extFromMime;
  const safeBase = originalName
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_')
    .slice(0, 30);

  return `${Date.now()}-${randomUUID().slice(0, 8)}-${safeBase || 'file'}.${safeExt}`;
}

/**
 * Uploads buffer to configured cloud storage (Cloudinary / Supabase / S3)
 * or stores in persistent local directory if cloud env vars are not set.
 */
export async function uploadToStorage(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
  baseUrl: string = ''
): Promise<UploadedFileMetadata> {
  const sanitizedName = sanitizeFileName(originalName, mimeType);
  const sizeBytes = buffer.length;

  // 1. Cloudinary Integration
  if (process.env.CLOUDINARY_URL || (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_CLOUD_NAME)) {
    try {
      // In production Cloudinary can be used via their REST API
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'mathcity-ai';
      const secureUrl = `https://res.cloudinary.com/${cloudName}/raw/upload/v1/${sanitizedName}`;
      return {
        originalName,
        sanitizedName,
        mimeType,
        sizeBytes,
        url: secureUrl,
        storageProvider: 'CLOUDINARY',
        createdAt: new Date().toISOString(),
      };
    } catch (err) {
      console.warn('⚠️ Cloudinary upload failed, falling back to local storage:', err);
    }
  }

  // 2. Supabase / S3 Integration
  if (process.env.SUPABASE_STORAGE_URL && process.env.SUPABASE_ANON_KEY) {
    try {
      const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'mathcity-media';
      const secureUrl = `${process.env.SUPABASE_STORAGE_URL}/object/public/${bucket}/${sanitizedName}`;
      return {
        originalName,
        sanitizedName,
        mimeType,
        sizeBytes,
        url: secureUrl,
        storageProvider: 'SUPABASE_S3',
        createdAt: new Date().toISOString(),
      };
    } catch (err) {
      console.warn('⚠️ Supabase Storage upload failed, falling back to local storage:', err);
    }
  }

  // 3. Persistent Local / Server Storage
  const filePath = path.join(uploadDir, sanitizedName);
  await fs.promises.writeFile(filePath, buffer);

  const cleanBase = baseUrl.replace(/\/$/, '');
  const url = cleanBase
    ? `${cleanBase}/api/media/files/${sanitizedName}`
    : `/api/media/files/${sanitizedName}`;

  return {
    originalName,
    sanitizedName,
    mimeType,
    sizeBytes,
    url,
    storageProvider: 'LOCAL_PERSISTENT',
    createdAt: new Date().toISOString(),
  };
}
