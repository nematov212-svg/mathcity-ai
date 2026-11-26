import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config/env.js';
import { repository, AnnouncementModel } from '../../utils/repository.js';

export const announcementsRouter = Router();

/**
 * Helper to optionally extract authenticated user without rejecting unauthenticated requests
 */
function getOptionalUser(req: Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
    return repository.getUserById(decoded.userId) || null;
  } catch {
    return null;
  }
}

/**
 * GET /api/announcements/active
 * Returns all currently active announcements and advertisements for the mobile/web app.
 * If user is logged in and was registered <= 7 days ago, special offer with 30% discount is included.
 */

announcementsRouter.get('/active', (req: Request, res: Response) => {
  const user = getOptionalUser(req);
  const userCreatedAt = user?.createdAt;
  const list = repository.getActiveAnnouncements(userCreatedAt);

  return res.json({
    success: true,
    data: list,
    meta: {
      total: list.length,
      serverTime: new Date().toISOString(),
      userCreatedAt: userCreatedAt || null,
      hasNewUserDiscount: user ? repository.getSubscription(user.id).hasNewUserDiscount : true,
    },
  });
});

/**
 * POST /api/announcements/:id/view
 * Increment announcement view count
 */
announcementsRouter.post('/:id/view', (req: Request, res: Response) => {
  const success = repository.incrementAnnouncementView(String(req.params.id));
  const item = repository.getAnnouncementById(String(req.params.id));
  return res.json({ success, views: item?.views || 0 });
});

/**
 * POST /api/announcements/:id/click
 * Increment announcement click count
 */
announcementsRouter.post('/:id/click', (req: Request, res: Response) => {
  const success = repository.incrementAnnouncementClick(String(req.params.id));
  const item = repository.getAnnouncementById(String(req.params.id));
  return res.json({ success, clicks: item?.clicks || 0 });
});

/**
 * GET /api/announcements/:id
 */
announcementsRouter.get('/:id', (req: Request, res: Response) => {
  const item = repository.getAnnouncementById(String(req.params.id));
  if (!item) {
    return res.status(404).json({ success: false, error: 'E‘lon topilmadi.' });
  }
  return res.json({ success: true, data: item });
});
