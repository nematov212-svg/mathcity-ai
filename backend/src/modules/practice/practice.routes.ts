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
  isRetry: z.boolean().optional(),
});

const bulkSubmitSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string(),
      answer: z.string(),
    })
  ),
});

// Solved question memory for session rotation (20 questions per cycle without repeat)

const userSolvedInCycle = new Map<string, Set<string>>();

/**
 * GET /api/practice/session
 * Generates 20 random questions from topic/grade, avoiding questions solved in previous sessions.
 * Resets user history cycle when questions are exhausted. Strips correctAnswer so clients cannot cheat.
 */
practiceRouter.get('/session', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const lengthParam = 20;
  const gradeParam = req.query.grade ? parseInt(req.query.grade as string, 10) : user.grade;
  const topicParam = req.query.topic ? (req.query.topic as string) : undefined;

  let solvedSet = userSolvedInCycle.get(user.id);
  if (!solvedSet) {
    solvedSet = new Set<string>(user.solvedQuestions || []);
    userSolvedInCycle.set(user.id, solvedSet);
  }

  // Get pool of questions
  let pool = repository.getQuestionsForTest(gradeParam, 100, topicParam);
  if (pool.length === 0) {
    pool = repository.getQuestionsForTest(user.grade, 100);
  }

  // Filter out already solved questions in this cycle
  let available = pool.filter((q) => !solvedSet!.has(q.id));

  // If pool exhausted or fewer than 20 questions available, reset cycle history
  if (available.length < lengthParam) {
    solvedSet.clear();
    available = [...pool];
  }

  // Shuffle and pick 20
  const shuffled = [...available].sort(() => 0.5 - Math.random()).slice(0, lengthParam);
  const questionsToServe = shuffled.length > 0 ? shuffled : pool.slice(0, lengthParam);

  // Strip correctAnswer and solutions for client security
  const clientQuestions = questionsToServe.map((q) => ({
    id: q.id,
    grade: q.grade,
    topic: q.topic,
    difficulty: q.difficulty,
    prompt: q.prompt,
    type: q.type,
    options: q.options,
    hint: q.hint,
    imageUrl: q.imageUrl,
  }));

  return res.json({
    success: true,
    data: {
      sessionLength: clientQuestions.length,
      grade: gradeParam,
      topic: topicParam || 'Misollar',
      questions: clientQuestions,
    },
  });
});

/**
 * GET /api/practice/test (Legacy / backward compatible test generation)
 */
practiceRouter.get('/test', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const lengthParam = req.query.length ? parseInt(req.query.length as string, 10) : 10;
  const gradeParam = req.query.grade ? parseInt(req.query.grade as string, 10) : user.grade;
  const topicParam = req.query.topic ? (req.query.topic as string) : undefined;

  const validLengths = [10, 20, 30];
  const requestedLength = validLengths.includes(lengthParam) ? lengthParam : 10;

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

/**
 * POST /api/practice/submit
 * Server-authoritative answer grading: evaluates correctness, awards +1 coin and +10 XP idempotently,
 * and reveals the correct answer and explanation.
 */
practiceRouter.post('/submit', authMiddleware, practiceRateLimiter, (req: AuthenticatedRequest, res: Response) => {
  const parse = submitSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: 'Javob ma’lumoti noto‘g‘ri.' });
  }

  const { questionId, answer, isRetry } = parse.data;
  const user = req.user!;

  const found = repository.findQuestionById(questionId);
  if (!found) {
    return res.status(404).json({ success: false, error: 'Savol topilmadi.' });
  }

  const targetQuestion = found.question;
  const isCorrect = MathEngine.evaluateAnswer(answer, targetQuestion.correctAnswer);

  // Authoritative server-side evaluation with EXACTLY +1 coin rule
  const result = repository.submitQuestionAnswer(user.id, questionId, isCorrect);

  // Track in rotation cycle
  let solvedSet = userSolvedInCycle.get(user.id);
  if (!solvedSet) {
    solvedSet = new Set<string>();
    userSolvedInCycle.set(user.id, solvedSet);
  }
  if (isCorrect) {
    solvedSet.add(questionId);
  }

  return res.json({
    success: true,
    data: {
      questionId,
      isCorrect,
      explanation: targetQuestion.explanation,
      hint: targetQuestion.hint,
      correctAnswer: targetQuestion.correctAnswer, // Always revealed after submission so user sees it
      coinsAwarded: result.coinsAwarded, // EXACTLY 1 for first time, 0 for repeats
      xpAwarded: result.xpAwarded, // +10 XP
      newCoinBalance: result.newCoinBalance,
      newTotalXP: result.newTotalXP,
      isFirstTimeCorrect: result.isFirstTimeCorrect,
      accuracyPercentage: result.accuracyPercentage,
      totalAttempted: result.totalAttempted,
      totalCorrect: result.totalCorrect,
    },
  });
});

/**
 * POST /api/practice/test/submit
 */
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
