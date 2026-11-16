import { Router, Response } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { repository } from '../../utils/repository.js';

export const lessonsRouter = Router();

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
    rewardXP: l.rewardXP,
    rewardCoins: l.rewardCoins,
    orderIndex: l.orderIndex,
    sectionCount: l.sections.length,
    isCompleted: user.completedLessons.includes(l.id),
  }));

  return res.json({ success: true, data: mapped });
});

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
      isCompleted: user.completedLessons.includes(lesson.id),
      sections: lesson.sections.map((s) => ({
        id: s.id,
        title: s.title,
        orderIndex: s.orderIndex,
        questionCount: s.questions.length, // Exactly 10 questions
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
      questions: section.questions.map((q) => ({
        id: q.id,
        prompt: q.prompt,
        type: q.type,
        options: q.options,
        formulaLatex: q.formulaLatex,
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

  // Check if all sections in lesson are completed
  const allCompleted = found.lesson.sections.every((s) => user.completedSections.includes(s.id));
  if (allCompleted && !user.completedLessons.includes(lessonId)) {
    user.completedLessons.push(lessonId);
  }

  // Find next section if exists
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
