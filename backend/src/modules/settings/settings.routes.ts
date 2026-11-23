import { Router, Response } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { repository } from '../../utils/repository.js';

export const settingsRouter = Router();

/**
 * GET /api/settings
 * Returns user settings (interfaceMode, themeMode, soundEnabled, animationsEnabled, dailyReminderEnabled, reminderTime).
 */
settingsRouter.get('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const settings = repository.getUserSettings(user.id);
  return res.json({
    success: true,
    data: settings,
  });
});

const updateSettingsSchema = z.object({
  interfaceMode: z.string().optional(),
  themeMode: z.enum(['LIGHT', 'DARK', 'SYSTEM']).optional(),
  soundEnabled: z.boolean().optional(),
  animationsEnabled: z.boolean().optional(),
  dailyReminderEnabled: z.boolean().optional(),
  reminderTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
});

/**
 * PATCH /api/settings
 * Updates user settings and syncs across devices.
 */
settingsRouter.patch('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const parse = updateSettingsSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({
      success: false,
      error: parse.error.errors[0].message,
    });
  }

  const updated = repository.updateUserSettings(user.id, parse.data);
  return res.json({
    success: true,
    data: updated,
  });
});

/**
 * GET /api/settings/export & GET /api/me/export
 * Exports all user educational data, stats, and activity as structured JSON.
 */
settingsRouter.get(['/export', '/export-data'], authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const exportData = repository.exportUserData(user.id);
  return res.json({
    success: true,
    data: exportData,
  });
});

/**
 * DELETE /api/settings/account & DELETE /api/me
 * Permanently deletes user account and personal data after confirmation.
 */
settingsRouter.delete(['/', '/account'], authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const { username } = req.body || {};

  if (username && username !== user.username) {
    return res.status(400).json({
      success: false,
      error: 'Tasdiqlash uchun kiritilgan foydalanuvchi nomi mos kelmadi.',
    });
  }

  const deleted = repository.deleteUser(user.id);
  return res.json({
    success: true,
    message: 'Hisob va barcha shaxsiy ma’lumotlar butunlay o‘chirildi.',
  });
});
