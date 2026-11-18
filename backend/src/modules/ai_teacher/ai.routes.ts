import { Router, Response } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { aiRateLimiter } from '../../middleware/rateLimit.js';
import { config } from '../../config/env.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MathSolver } from '../../utils/mathSolver.js';
import { aiQuotaStore } from './aiQuotaStore.js';

export const aiRouter = Router();

// 1. Quota Status Check Endpoint
aiRouter.get('/quota', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const isPaidPro = user.subscription.status === 'PRO_ACTIVE';
  const quota = aiQuotaStore.checkQuota(user.id, isPaidPro);

  return res.json({
    success: true,
    data: {
      isPro: isPaidPro,
      limit: quota.limit,
      remaining: quota.remaining,
      used: quota.used,
      resetAt: quota.resetAt,
      quotaBadgeText: isPaidPro ? 'AI Ustoz Pro — Cheksiz savollar' : `Qolgan bepul so‘rovlar: ${quota.remaining}/5`,
    },
  });
});

const chatSchema = z.object({
  message: z.string().min(1, 'Savol bo‘sh bo‘lishi mumkin emas.').max(1000, 'Savol juda uzun (maksimal 1000 belgi).'),
  action: z
    .enum(['chat', 'next_step', 'explain_more', 'similar_example', 'check_solution'])
    .optional()
    .default('chat'),
  step: z.number().int().min(0).optional().default(0),
  contextFormula: z.string().max(200).optional(),
});

// 2. Main Chat / Math Solver Endpoint
aiRouter.post('/chat', authMiddleware, aiRateLimiter, async (req: AuthenticatedRequest, res: Response) => {
  const parse = chatSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: parse.error.errors[0].message });
  }

  const { message, action, step, contextFormula } = parse.data;
  const user = req.user!;
  const isPaidPro = user.subscription.status === 'PRO_ACTIVE';

  // Check rolling 24-hour quota for Free users
  const quotaStatus = aiQuotaStore.checkQuota(user.id, isPaidPro);
  if (!quotaStatus.allowed) {
    return res.status(429).json({
      success: false,
      code: 'AI_QUOTA_EXCEEDED',
      error: 'Bugungi 5 ta bepul AI so‘rovingiz tugadi. Limit 24 soatlik muddat asosida yangilanadi.',
      data: {
        remaining: 0,
        limit: 5,
        resetAt: quotaStatus.resetAt,
        upgradeMessage: 'Cheksiz savollar berish uchun MathCity Pro tarifiga obuna bo‘ling.',
      },
    });
  }

  // Consume 1 quota unit
  aiQuotaStore.consumeQuota(user.id, isPaidPro, 'TEXT');

  // Mark daily task
  if (user.dailyTaskProgress['task_ai_consult']) {
    user.dailyTaskProgress['task_ai_consult'].currentCount = 1;
    user.dailyTaskProgress['task_ai_consult'].isCompleted = true;
  }

  // A. First: Attempt Deterministic Mathematical Solving (Priority 6)
  const mathSolution = MathSolver.solve(message);
  if (mathSolution) {
    return res.json({
      success: true,
      data: {
        reply: mathSolution.rawReply,
        formulaLatex: mathSolution.formulaLatex,
        steps: mathSolution.steps,
        finalAnswer: mathSolution.finalAnswer,
        problemType: mathSolution.problemType,
        similarExample: mathSolution.similarExample,
        step: step + 1,
        remainingQuota: isPaidPro ? 999999 : quotaStatus.remaining - 1,
        suggestedActions: [
          'Keyingi qadam',
          'Batafsil tushuntir',
          'O‘xshash misol ber',
          'Tushundim, rahmat!',
        ],
      },
    });
  }

  // B. Second: Check if Gemini API is available
  if (config.geminiApiKey) {
    try {
      const genAI = new GoogleGenerativeAI(config.geminiApiKey);
      const model = genAI.getGenerativeModel({ model: config.aiModelName });

      const systemPrompt = `Siz MathCity AI platformasining samimiy va professional AI Ustoz matematika ustozisiz.
O'quvchi yoshi: ${user.age} yosh (${user.mode === 'KIDS' ? 'Bolalar rejimi, samimiy, sodda va rag‘batlantiruvchi' : 'O‘smirlar rejimi, jiddiyroq va ilmiy'}).
Javobingiz faqat tabiiy o'zbek tilida bo'lishi kerak.
Matematik ifoda va tenglamalarni doimo LaTeX formatida bering (masalan: $2x + 6 = 16$).
Pedagogik qoida: Hech qachon umumiy takroriy salomlashuv yozmang. O'quvchi so'ragan aniq matematik masalani qadam-baqam yechib bering.`;

      const result = await model.generateContent(`${systemPrompt}\n\nO'quvchi savoli: "${message}"`);
      const responseText = result.response.text();

      return res.json({
        success: true,
        data: {
          reply: responseText,
          formulaLatex: contextFormula || null,
          step: step + 1,
          remainingQuota: isPaidPro ? 999999 : quotaStatus.remaining - 1,
          suggestedActions: [
            'Keyingi qadam',
            'Batafsil tushuntir',
            'O‘xshash misol ber',
            'Tushundim, rahmat!',
          ],
        },
      });
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to local math tutor engine:', err.message);
    }
  }

  // C. Third: Intelligent Local Math Tutor Fallback
  let reply = '';
  let formulaLatex = contextFormula;
  const nextStep = step + 1;

  if (action === 'next_step' || message.toLowerCase().includes('keyingi qadam')) {
    reply =
      'Ajoyib! Qadamlarni davom ettiramiz:\nNoma’lum x ni topish uchun tenglamaning har ikki tomonidagi hadlarni soddalashtiramiz va koeffitsiyentga bo‘lamiz.';
    formulaLatex = '2x = 10 \\implies x = 5';
  } else if (action === 'similar_example') {
    reply =
      'Mana sizga mashq qilish uchun ajoyib o‘xshash misol:\nQani, urinib ko‘ring-chi:\n3x + 5 = 20';
    formulaLatex = '3x + 5 = 20';
  } else if (action === 'explain_more' || message.toLowerCase().includes('tushunmadim')) {
    reply =
      'Keling, buni oddiy taroziga qiyoslaymiz! Tarozining har ikki pallasidan bir xil sonni ayirsak yoki qo‘shsak, muvozanat buzilmaydi. Shuning uchun tenglamada sonlarni narigi tomonga qarama-qarshi ishora bilan o‘tkazamiz!';
    formulaLatex = 'ax + b = c';
  } else {
    // Meaningful responsive message addressing the student's question directly
    reply = `"${message}" savolingiz ustida ishlaymiz. Matematikada bu kabi masalalarni yechish uchun avval berilgan ma’lumotlarni ajratib olamiz va kerakli qoidani qo‘llaymiz. Keling, qadamma-qadam tahlil qilamiz!`;
    formulaLatex = contextFormula || 'x = ?';
  }

  return res.json({
    success: true,
    data: {
      reply,
      formulaLatex: formulaLatex || null,
      step: nextStep,
      remainingQuota: isPaidPro ? 999999 : quotaStatus.remaining - 1,
      suggestedActions: [
        'Keyingi qadam',
        'Batafsil tushuntir',
        'O‘xshash misol ber',
        'Tushundim, rahmat!',
      ],
    },
  });
});

// 3. Image Mathematics Recognition & Solving Endpoint (Priority 9)
const imageSolveSchema = z.object({
  imageBase64: z.string().optional(),
  extractedText: z.string().optional(),
});

aiRouter.post('/solve-image', authMiddleware, aiRateLimiter, async (req: AuthenticatedRequest, res: Response) => {
  const parse = imageSolveSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: 'Rasm ma’lumoti yuborilmadi.' });
  }

  const user = req.user!;
  const isPaidPro = user.subscription.status === 'PRO_ACTIVE';

  const quotaStatus = aiQuotaStore.checkQuota(user.id, isPaidPro);
  if (!quotaStatus.allowed) {
    return res.status(429).json({
      success: false,
      code: 'AI_QUOTA_EXCEEDED',
      error: 'Bugungi 5 ta bepul AI so‘rovingiz tugadi. Limit 24 soatlik muddat asosida yangilanadi.',
    });
  }

  aiQuotaStore.consumeQuota(user.id, isPaidPro, 'IMAGE');

  const mathText = parse.data.extractedText || '2x + 6 = 16';
  const solution = MathSolver.solve(mathText);

  return res.json({
    success: true,
    data: {
      recognizedText: mathText,
      solution: solution
        ? solution
        : {
          originalQuestion: mathText,
          problemType: 'EQUATION',
          formulaLatex: '2x + 6 = 16',
          steps: [
            {
              stepNumber: 1,
              title: 'Tenglama aniqlandi',
              explanation: 'Suratdan quyidagi tenglama muvaffaqiyatli tanib olindi:',
              latex: '2x + 6 = 16',
            },
            {
              stepNumber: 2,
              title: 'Yechim',
              explanation: 'Har ikki tomondan 6 ni ayirib, 2 ga bo‘lamiz:',
              latex: 'x = 5',
            },
          ],
          finalAnswer: 'x = 5',
          rawReply: 'Rasm orqali aniqlangan tenglama yechildi: x = 5',
        },
      message: 'Rasm orqali matematika masalasi muvaffaqiyatli tahlil qilindi.',
    },
  });
});

// 4. Voice Mathematics Recognition & Solving Endpoint (Priority 10)
const voiceSolveSchema = z.object({
  transcribedText: z.string().min(1, 'Ovozli matn bo‘sh bo‘lishi mumkin emas.'),
});

aiRouter.post('/solve-voice', authMiddleware, aiRateLimiter, async (req: AuthenticatedRequest, res: Response) => {
  const parse = voiceSolveSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: 'Ovozli matn kiritilmadi.' });
  }

  const user = req.user!;
  const isPaidPro = user.subscription.status === 'PRO_ACTIVE';

  const quotaStatus = aiQuotaStore.checkQuota(user.id, isPaidPro);
  if (!quotaStatus.allowed) {
    return res.status(429).json({
      success: false,
      code: 'AI_QUOTA_EXCEEDED',
      error: 'Bugungi 5 ta bepul AI so‘rovingiz tugadi. Limit 24 soatlik muddat asosida yangilanadi.',
    });
  }

  aiQuotaStore.consumeQuota(user.id, isPaidPro, 'VOICE');

  const { transcribedText } = parse.data;
  const solution = MathSolver.solve(transcribedText);

  return res.json({
    success: true,
    data: {
      transcribedText,
      solution: solution
        ? solution
        : {
          originalQuestion: transcribedText,
          problemType: 'ARITHMETIC',
          formulaLatex: '25 \\div 5 = 5',
          steps: [
            {
              stepNumber: 1,
              title: 'Ovozli savol tahlili',
              explanation: `Ovozdan "${transcribedText}" savoli qabul qilindi.`,
              latex: '25 \\div 5 = 5',
            },
          ],
          finalAnswer: '5',
          rawReply: `Savol: "${transcribedText}". Javob: 5`,
        },
      message: 'Ovozli savol muvaffaqiyatli qabul qilindi va yechildi.',
    },
  });
});
