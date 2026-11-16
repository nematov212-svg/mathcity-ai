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
