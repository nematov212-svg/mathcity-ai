import { Router, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { repository } from '../../utils/repository.js';

export const analyticsRouter = Router();

/**
 * GET /api/analytics & GET /api/analytics/stats & GET /api/stats
 * Real educational analytics for MathCity AI:
 * - 6 KPI metrics: attempted questions, accuracy percentage, study minutes total, longest streak, coins, level
 * - Weekly problems activity (Du–Ya)
 * - Topic mastery percentage: 0.6 * (completed / total) + 0.4 * accuracy
 * - Recommended next lesson
 */
analyticsRouter.get(['/', '/stats'], authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const stats = repository.getLearningStats(user.id);

  // Find next recommended lesson
  const allLessons = repository.getLessons(user.mode);
  const nextLesson = allLessons.find((l) => !user.completedLessons.includes(l.id)) || allLessons[0];

  return res.json({
    success: true,
    data: {
      ...stats,
      nextLesson: nextLesson
        ? {
            id: nextLesson.id,
            title: nextLesson.title,
            grade: nextLesson.grade,
            order: nextLesson.orderIndex,
            chapterId: nextLesson.chapterId,
            chapterTitle: nextLesson.chapterTitle,
          }
        : null,
    },
  });
});
