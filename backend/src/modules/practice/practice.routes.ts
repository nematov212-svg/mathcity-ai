import { Router, Response } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { practiceRateLimiter } from '../../middleware/rateLimit.js';
import { repository } from '../../utils/repository.js';
import { MathEngine } from '../../utils/mathEngine.js';

export const practiceRouter = Router();

const submitSchema = z.object({
  questionId: z.string(),
  answer: z.string(),
});

const bulkSubmitSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string(),
      answer: z.string(),
    })
  ),
});

// GET /api/practice/test - Generates 10 (Free) or 20/30 (Pro) question test
practiceRouter.get('/test', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const lengthParam = req.query.length ? parseInt(req.query.length as string, 10) : 10;
  const gradeParam = req.query.grade ? parseInt(req.query.grade as string, 10) : user.grade;
  const topicParam = req.query.topic ? (req.query.topic as string) : undefined;

  const validLengths = [10, 20, 30];
  const requestedLength = validLengths.includes(lengthParam) ? lengthParam : 10;

  // Pro validation for 20 and 30 question tests
  const isProEligible =
    user.subscription.status === 'PRO_ACTIVE' || user.subscription.status === 'FREE_TRIAL_ACTIVE';

  if (requestedLength > 10 && !isProEligible) {
    return res.status(403).json({
      success: false,
      error: '20 va 30 talik to‘liq testlar faqat MathCity Pro obunachilari uchun ochiq.',
      code: 'PRO_SUBSCRIPTION_REQUIRED',
    });
  }

  const rawQuestions = repository.getQuestionsForTest(gradeParam, requestedLength, topicParam);

  // Strip correctAnswer and resolved formulas for security so the client cannot inspect solutions ahead of submission
  const clientQuestions = rawQuestions.map((q) => ({
    id: q.id,
    grade: q.grade,
    topic: q.topic,
    difficulty: q.difficulty,
    prompt: q.prompt,
    type: q.type,
    options: q.options,
    hint: q.hint,
  }));

  return res.json({
    success: true,
    data: {
      testLength: clientQuestions.length,
      grade: gradeParam,
      topic: topicParam || 'Aralash',
      questions: clientQuestions,
    },
  });
});

// POST /api/practice/test/submit - Bulk grading for 10, 20, or 30 question tests
practiceRouter.post('/test/submit', authMiddleware, practiceRateLimiter, (req: AuthenticatedRequest, res: Response) => {
  const parse = bulkSubmitSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: 'Test javoblari noto‘g‘ri formatda.' });
  }

  const { answers } = parse.data;
  const user = req.user!;

  let totalCorrect = 0;
  let totalCoinsAwarded = 0;
  let totalXpAwarded = 0;
  const results = [];

  for (const item of answers) {
    const found = repository.findQuestionById(item.questionId);
    if (!found) continue;

    const targetQuestion = found.question;
    const isCorrect = MathEngine.evaluateAnswer(item.answer, targetQuestion.correctAnswer);

    const submission = repository.submitQuestionAnswer(user.id, item.questionId, isCorrect);

    if (isCorrect) totalCorrect++;
    totalCoinsAwarded += submission.coinsAwarded;
    totalXpAwarded += submission.xpAwarded;

    results.push({
      questionId: item.questionId,
      userAnswer: item.answer,
      isCorrect,
      correctAnswer: targetQuestion.correctAnswer,
      explanation: targetQuestion.explanation,
      coinsAwarded: submission.coinsAwarded,
      xpAwarded: submission.xpAwarded,
    });
  }

  const updatedUser = repository.getUserById(user.id)!;

  return res.json({
    success: true,
    data: {
      totalQuestions: answers.length,
      correctCount: totalCorrect,
      incorrectCount: answers.length - totalCorrect,
      scorePercentage: answers.length > 0 ? Math.round((totalCorrect / answers.length) * 100) : 0,
      totalCoinsAwarded,
      totalXpAwarded,
      currentCoinBalance: updatedUser.coinBalance,
      currentTotalXP: updatedUser.totalXP,
      results,
    },
  });
});

practiceRouter.post('/submit', authMiddleware, practiceRateLimiter, (req: AuthenticatedRequest, res: Response) => {
  const parse = submitSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: 'Javob ma’lumoti noto‘g‘ri.' });
  }

  const { questionId, answer } = parse.data;
  const user = req.user!;

  // Find question in repository hierarchy
  const found = repository.findQuestionById(questionId);

  if (!found) {
    return res.status(404).json({ success: false, error: 'Savol topilmadi.' });
  }

  const targetQuestion = found.question;
  const isCorrect = MathEngine.evaluateAnswer(answer, targetQuestion.correctAnswer);

  // Authoritative server-side evaluation with EXACTLY +1 coin rule
  const result = repository.submitQuestionAnswer(user.id, questionId, isCorrect);

  return res.json({
    success: true,
    data: {
      questionId,
      isCorrect,
      explanation: targetQuestion.explanation,
      hint: targetQuestion.hint,
      correctAnswer: isCorrect ? targetQuestion.correctAnswer : null,
      coinsAwarded: result.coinsAwarded, // EXACTLY 1 for first time, 0 for repeats!
      xpAwarded: result.xpAwarded,
      newCoinBalance: result.newCoinBalance,
      newTotalXP: result.newTotalXP,
      isFirstTimeCorrect: result.isFirstTimeCorrect,
      accuracyPercentage: result.accuracyPercentage,
      totalAttempted: result.totalAttempted,
      totalCorrect: result.totalCorrect,
    },
  });
});
