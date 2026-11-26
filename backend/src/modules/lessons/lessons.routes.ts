import { Router, Response } from 'express';
import { authMiddleware, optionalAuthMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { repository } from '../../utils/repository.js';
import { getTashkentDateString } from '../../utils/tashkentTime.js';

export const lessonsRouter = Router();

// Set of connected Server-Sent Event (SSE) clients for real-time lesson sync
const sseClients = new Set<Response>();

export function broadcastLessonEvent(event: string, payload: any) {
  const data = JSON.stringify({ event, payload, timestamp: new Date().toISOString() });
  for (const client of sseClients) {
    try {
      client.write(`event: ${event}\ndata: ${data}\n\n`);
    } catch (_) {
      sseClients.delete(client);
    }
  }
}

/**
 * GET /api/lessons/stream (SSE real-time stream)
 */
lessonsRouter.get('/stream', (req, res: Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  res.write(`data: ${JSON.stringify({ status: 'connected', time: new Date().toISOString() })}\n\n`);

  sseClients.add(res);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

/**
 * GET /api/lessons
 */
lessonsRouter.get('/', optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  const completedLessons = user?.completedLessons || [];
  const modeQuery = (req.query.mode as string | undefined)?.toUpperCase();
  const modeParam: 'KIDS' | undefined = undefined; // Return curriculum openly across all grades

  const gradeParam = req.query.grade ? parseInt(req.query.grade as string, 10) : undefined;
  const searchQuery = (req.query.search || req.query.q || '').toString().toLowerCase().trim();
  const categoryQuery = (req.query.category || req.query.subject || '').toString().toLowerCase().trim();

  let lessons = repository.getLessons(modeParam, gradeParam);

  if (searchQuery) {
    lessons = lessons.filter(
      (l) =>
        l.title.toLowerCase().includes(searchQuery) ||
        l.description.toLowerCase().includes(searchQuery) ||
        l.topicKey.toLowerCase().includes(searchQuery) ||
        (l.chapterTitle && l.chapterTitle.toLowerCase().includes(searchQuery))
    );
  }

  if (categoryQuery) {
    lessons = lessons.filter(
      (l) =>
        (l.chapterTitle && l.chapterTitle.toLowerCase().includes(categoryQuery)) ||
        l.topicKey.toLowerCase().includes(categoryQuery)
    );
  }

  // Sort by grade asc, orderIndex asc
  lessons.sort((a, b) => {
    if (a.grade !== b.grade) return a.grade - b.grade;
    return (a.orderIndex || 0) - (b.orderIndex || 0);
  });

  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit as string, 10) || 100);
  const total = lessons.length;
  const startIndex = (page - 1) * limit;
  const paginated = lessons.slice(startIndex, startIndex + limit);

  const mapped = paginated.map((l, idx) => {
    const isCompleted = completedLessons.includes(l.id);
    // Determine default icon based on topic/content
    const defaultIcon = l.icon || (
      l.topicKey.includes('fraction') || l.title.toLowerCase().includes('kasr') ? '½' :
      l.topicKey.includes('mult') || l.title.toLowerCase().includes('karra') ? '×' :
      l.topicKey.includes('geom') || l.title.toLowerCase().includes('shakllar') ? '📐' :
      l.topicKey.includes('equat') || l.title.toLowerCase().includes('tenglama') ? 'x=' :
      l.topicKey.includes('add') || l.topicKey.includes('sub') ? '±' :
      l.topicKey.includes('percent') || l.title.toLowerCase().includes('foiz') ? '%' :
      '📚'
    );

    const defaultColor = l.accentColor || (
      l.topicKey.includes('fraction') || l.title.toLowerCase().includes('kasr') ? '#6C47FF' :
      l.topicKey.includes('mult') || l.title.toLowerCase().includes('karra') ? '#059669' :
      l.topicKey.includes('geom') || l.title.toLowerCase().includes('shakllar') ? '#D97706' :
      l.topicKey.includes('equat') || l.title.toLowerCase().includes('tenglama') ? '#E11D48' :
      '#6366F1'
    );

    // Locking logic: first lesson is unlocked; subsequent lessons are unlocked if previous is completed
    const isLocked = l.orderIndex > 1 && !isCompleted && idx > 0 && !completedLessons.includes(lessons[idx - 1]?.id);

    return {
      id: l.id,
      courseId: l.courseId,
      chapterId: l.chapterId,
      chapterTitle: l.chapterTitle,
      grade: l.grade,
      mode: l.mode,
      title: l.title,
      topicKey: l.topicKey,
      description: l.description,
      formulaLatex: l.formulaLatex,
      icon: defaultIcon,
      accentColor: defaultColor,
      coverImage: l.coverImage || null,
      gallery: l.gallery || [],
      videoUrl: l.videoUrl || null,
      audioUrl: l.audioUrl || null,
      textExplanation: l.textExplanation || l.contentMd || '',
      rewardXP: l.rewardXP,
      rewardCoins: l.rewardCoins,
      orderIndex: l.orderIndex,
      status: l.status || 'PUBLISHED',
      sectionCount: l.sections ? l.sections.length : 0,
      isCompleted,
      isLocked: false, // Keep accessible in MVP unless explicitly locked
    };
  });

  return res.json({ success: true, total, page, limit, data: mapped });
});

/**
 * GET /api/lessons/:id
 */
lessonsRouter.get('/:id', optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const lessonId = String(req.params.id);
  const lesson = repository.getLessonById(lessonId);

  if (!lesson) {
    return res.status(404).json({ success: false, error: 'Dars topilmadi.' });
  }

  return res.json({
    success: true,
    data: {
      ...lesson,
      coverImage: lesson.coverImage || null,
      gallery: lesson.gallery || [],
      videoUrl: lesson.videoUrl || null,
      audioUrl: lesson.audioUrl || null,
      textExplanation: lesson.textExplanation || lesson.contentMd || '',
      isCompleted: (user?.completedLessons || []).includes(lesson.id) || (user?.completedLessons || []).includes(lessonId),
      sections: (lesson.sections || []).map((s) => ({
        id: s.id,
        title: s.title,
        orderIndex: s.orderIndex,
        questionCount: s.questions ? s.questions.length : 0,
        isCompleted: (user?.completedSections || []).includes(s.id),
      })),
    },
  });
});

lessonsRouter.get('/:id/sections/:sectionId', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const sectionId = String(req.params.sectionId);
  const found = repository.getSectionById(sectionId);

  if (!found) {
    return res.status(404).json({ success: false, error: 'Dars qismi topilmadi.' });
  }

  const { lesson, section } = found;

  return res.json({
    success: true,
    data: {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      chapterTitle: lesson.chapterTitle,
      grade: lesson.grade,
      sectionId: section.id,
      sectionTitle: section.title,
      orderIndex: section.orderIndex,
      isCompleted: user.completedSections.includes(section.id),
      questions: (section.questions || []).map((q) => ({
        id: q.id,
        prompt: q.prompt,
        type: q.type,
        options: q.options,
        orderIndex: q.orderIndex,
        isAlreadySolved: user.solvedQuestions.includes(q.id),
        isAlreadyRewarded: user.rewardedQuestionIds.includes(q.id),
      })),
    },
  });
});

lessonsRouter.post('/:id/sections/:sectionId/complete', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const lessonId = String(req.params.id);
  const sectionId = String(req.params.sectionId);

  const found = repository.getSectionById(sectionId);
  if (!found) {
    return res.status(404).json({ success: false, error: 'Dars qismi topilmadi.' });
  }

  if (!user.completedSections.includes(sectionId)) {
    user.completedSections.push(sectionId);
  }

  const allCompleted = found.lesson.sections.every((s) => user.completedSections.includes(s.id));
  if (allCompleted && !user.completedLessons.includes(lessonId)) {
    user.completedLessons.push(lessonId);
    repository.advanceMissionProgress(user.id, 'COMPLETE_LESSON', 1);
    if (!user.unlockedAchievements.includes('ach_first_step')) {
      user.unlockedAchievements.push('ach_first_step');
    }
    const todayStr = getTashkentDateString();
    const actKey = `${user.id}:${todayStr}`;
    let act = (repository as any).dailyActivities?.get(actKey);
    if (!act) {
      act = { userId: user.id, date: todayStr, seconds: 120, lessonsDone: 1, problemsSolved: 0, lastHeartbeat: Date.now() };
      (repository as any).dailyActivities?.set(actKey, act);
    } else {
      act.lessonsDone++;
    }
    repository.calculateStreak(user.id);
    repository.persistUserToDatabase(user).catch(() => {});
  }

  const nextSection = found.lesson.sections.find((s) => s.orderIndex === found.section.orderIndex + 1);

  return res.json({
    success: true,
    data: {
      sectionId,
      message: `${found.section.title} muvaffaqiyatli yakunlandi!`,
      isLessonFullyCompleted: allCompleted,
      nextSectionId: nextSection ? nextSection.id : null,
      nextSectionTitle: nextSection ? nextSection.title : null,
      coinBalance: user.coinBalance,
      totalXP: user.totalXP,
    },
  });
});

/**
 * POST /api/lessons/:id/complete
 * Directly completes the entire lesson, awards coins & XP on first pass,
 * updates streak, daily activity and unlocks next progress.
 */
lessonsRouter.post('/:id/complete', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const lessonId = String(req.params.id);
  const lesson = repository.getLessonById(lessonId);

  if (!lesson) {
    return res.status(404).json({ success: false, error: 'Dars topilmadi.' });
  }

  const isFirstCompletion = !user.completedLessons.includes(lessonId);
  const coinsAwarded = isFirstCompletion ? (lesson.rewardCoins || 12) : 0;
  const xpAwarded = isFirstCompletion ? (lesson.rewardXP || 100) : 0;

  if (isFirstCompletion) {
    user.completedLessons.push(lessonId);
    user.coinBalance += coinsAwarded;
    user.totalXP += xpAwarded;

    if (lesson.sections) {
      for (const s of lesson.sections) {
        if (!user.completedSections.includes(s.id)) {
          user.completedSections.push(s.id);
        }
      }
    }

    repository.advanceMissionProgress(user.id, 'COMPLETE_LESSON', 1);
    if (!user.unlockedAchievements.includes('ach_first_step')) {
      user.unlockedAchievements.push('ach_first_step');
    }

    repository.recordDailyLessonCompleted(user.id, lessonId);
    repository.persistUserToDatabase(user).catch(() => {});
  }

  broadcastLessonEvent('lesson_completed', {
    userId: user.id,
    lessonId,
    totalXP: user.totalXP,
    coinBalance: user.coinBalance,
  });

  return res.json({
    success: true,
    data: {
      lessonId,
      title: lesson.title,
      isFirstCompletion,
      coinsAwarded,
      xpAwarded,
      coinBalance: user.coinBalance,
      totalXP: user.totalXP,
      completedLessons: user.completedLessons,
      message: isFirstCompletion
        ? `Tabriklaymiz! "${lesson.title}" darsini muvaffaqiyatli yakunladingiz! +${coinsAwarded} tanga va +${xpAwarded} XP berildi.`
        : `"${lesson.title}" darsini qayta ko‘rib chiqdingiz!`,
    },
  });
});

