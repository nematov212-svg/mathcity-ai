import { Router, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
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
lessonsRouter.get('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const modeParam = (req.query.mode as 'KIDS' | 'TEEN') || user.mode;
  const gradeParam = req.query.grade ? parseInt(req.query.grade as string, 10) : undefined;

  const lessons = repository.getLessons(modeParam, gradeParam);

  const mapped = lessons.map((l) => ({
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
    isCompleted: user.completedLessons.includes(l.id),
  }));

  return res.json({ success: true, data: mapped });
});

/**
 * GET /api/lessons/:id
 */
lessonsRouter.get('/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
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
      isCompleted: user.completedLessons.includes(lesson.id),
      sections: (lesson.sections || []).map((s) => ({
        id: s.id,
        title: s.title,
        orderIndex: s.orderIndex,
        questionCount: s.questions ? s.questions.length : 0,
        isCompleted: user.completedSections.includes(s.id),
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
