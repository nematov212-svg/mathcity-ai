import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { adminAuth, AuthenticatedAdminRequest } from '../admin/admin.routes.js';
import { config } from '../../config/env.js';
import {
  validateFileTypeAndSize,
  uploadToStorage,
  FILE_LIMITS,
} from '../../utils/cloudStorage.js';

export const mediaRouter = Router();

// Memory storage for multer so we can stream or upload to cloud storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: FILE_LIMITS.VIDEO, // Upper bound: 200MB
  },
});

const uploadSchema = z.object({
  fileName: z.string().min(1, 'Fayl nomi kiritilishi shart.'),
  mimeType: z.string(),
  sizeBytes: z.number().positive(),
  purpose: z.string().default('LESSON_MEDIA'),
});

/**
 * POST /api/media/upload-file (Multipart Form-Data for Admin & Users)
 * Accepts 'file' field. Handles images (max 5MB), audio (max 20MB), and video (max 200MB).
 */
mediaRouter.post(
  '/upload-file',
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({
          success: false,
          error: 'Hech qanday fayl tanlanmadi.',
        });
      }

      const mimeType = file.mimetype;
      const sizeBytes = file.size;
      const originalName = file.originalname;

      const validation = validateFileTypeAndSize(mimeType, sizeBytes);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          error: validation.error,
        });
      }

      // Base URL from request or environment
      const protocol = req.protocol;
      const host = req.get('host') || (config.isProduction ? 'mathcity-ai-api.onrender.com' : 'localhost:4000');
      const baseUrl = `${protocol}://${host}`;

      const uploaded = await uploadToStorage(file.buffer, originalName, mimeType, baseUrl);

      return res.status(201).json({
        success: true,
        message: 'Fayl muvaffaqiyatli yuklandi.',
        data: uploaded,
      });
    } catch (err: any) {
      console.error('⚠️ Media upload error:', err);
      return res.status(500).json({
        success: false,
        error: `Fayl yuklashda xatolik yuz berdi: ${err?.message || 'Noma‘lum xato'}`,
      });
    }
  }
);

/**
 * GET /api/media/files/:filename
 * Streams uploaded media file with HTTP Range support for audio and video scrubbing.
 */
mediaRouter.get('/files/:filename', (req: Request, res: Response) => {
  const filename = path.basename(String(req.params.filename));
  const filePath = path.resolve(process.cwd(), 'uploads', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, error: 'Fayl topilmadi.' });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  // Determine content type
  const ext = path.extname(filename).toLowerCase();
  let contentType = 'application/octet-stream';
  if (['.jpg', '.jpeg'].includes(ext)) contentType = 'image/jpeg';
  else if (ext === '.png') contentType = 'image/png';
  else if (ext === '.webp') contentType = 'image/webp';
  else if (['.mp3'].includes(ext)) contentType = 'audio/mpeg';
  else if (['.wav'].includes(ext)) contentType = 'audio/wav';
  else if (['.m4a'].includes(ext)) contentType = 'audio/mp4';
  else if (['.mp4'].includes(ext)) contentType = 'video/mp4';
  else if (['.webm'].includes(ext)) contentType = 'video/webm';

  if (range) {
    // HTTP 206 Partial Content for video/audio seeking
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
      return;
    }

    const chunksize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': contentType,
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});

/**
 * Backward compatibility: POST /api/media/upload
 */
mediaRouter.post('/upload', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const parsed = uploadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.issues[0]?.message || 'Noto‘g‘ri ma’lumot formati.',
    });
  }

  const { fileName, mimeType, sizeBytes } = parsed.data;
  const validation = validateFileTypeAndSize(mimeType, sizeBytes);
  if (!validation.valid) {
    return res.status(400).json({ success: false, error: validation.error });
  }

  const userId = req.user?.id || 'demo-student-id';
  const fileKey = `attachments/${userId}/${randomUUID()}-${fileName}`;
  const storageUrl = `/api/media/files/${fileKey}`;

  return res.status(201).json({
    success: true,
    message: 'Fayl muvaffaqiyatli saqlandi.',
    data: {
      fileKey,
      storageUrl,
      mimeType,
      sizeBytes,
    },
  });
});
