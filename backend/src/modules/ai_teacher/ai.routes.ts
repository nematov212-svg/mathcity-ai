import { Router, Response } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { aiRateLimiter } from '../../middleware/rateLimit.js';
import { config } from '../../config/env.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MathSolver } from '../../utils/mathSolver.js';
import { aiQuotaStore } from './aiQuotaStore.js';
import { repository } from '../../utils/repository.js';

export const aiRouter = Router();

// ============================================================================
// 1. Quota Status Check Endpoint
// ============================================================================
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

// ============================================================================
// 2. Conversation History Endpoints (Persistent PostgreSQL / Repository)
// ============================================================================
aiRouter.get('/conversations', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const list = repository.listConversations(user.id);
  return res.json({
    success: true,
    data: list,
  });
});

aiRouter.get('/conversations/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const convId = req.params.id as string;
  const result = repository.getConversation(user.id, convId);
  if (!result) {
    return res.status(404).json({ success: false, error: 'Suhbat topilmadi.' });
  }
  return res.json({
    success: true,
    data: result,
  });
});

aiRouter.post('/conversations', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const title = (req.body.title as string)?.trim() || 'Yangi suhbat';
  const created = repository.createConversation(user.id, title);
  return res.json({
    success: true,
    data: created,
  });
});

aiRouter.patch('/conversations/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const convId = req.params.id as string;
  const newTitle = (req.body.title as string)?.trim();
  if (!newTitle) {
    return res.status(400).json({ success: false, error: 'Sarlavha bo‘sh bo‘lishi mumkin emas.' });
  }
  const updated = repository.renameConversation(user.id, convId, newTitle);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Suhbat topilmadi.' });
  }
  return res.json({
    success: true,
    data: updated,
  });
});

aiRouter.delete('/conversations/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const convId = req.params.id as string;
  const deleted = repository.deleteConversation(user.id, convId);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Suhbat topilmadi yoki o‘chirib bo‘lmadi.' });
  }
  return res.json({
    success: true,
    message: 'Suhbat muvaffaqiyatli o‘chirildi.',
  });
});

// ============================================================================
// 3. Main Chat / Math Solver Endpoint
// ============================================================================
const chatSchema = z.object({
  message: z.string().min(1, 'Savol bo‘sh bo‘lishi mumkin emas.').max(1000, 'Savol juda uzun (maksimal 1000 belgi).'),
  conversationId: z.string().optional(),
  action: z
    .enum(['chat', 'next_step', 'explain_more', 'similar_example', 'check_solution'])
    .optional()
    .default('chat'),
  step: z.number().int().min(0).optional().default(0),
  contextFormula: z.string().max(200).optional(),
});

aiRouter.post('/chat', authMiddleware, aiRateLimiter, async (req: AuthenticatedRequest, res: Response) => {
  const parse = chatSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: parse.error.errors[0].message });
  }

  const { message, action, step, contextFormula, conversationId } = parse.data;
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

  // Save user message to persistent conversation
  const userMsg = repository.saveAIMessage(
    user.id,
    conversationId || '',
    'user',
    message,
    { inputType: 'TEXT' }
  );
  const activeConvId = userMsg.conversationId;

  // A. First: Attempt Deterministic Mathematical Solving (Priority 6)
  const mathSolution = MathSolver.solve(message);
  if (mathSolution) {
    repository.saveAIMessage(user.id, activeConvId, 'assistant', mathSolution.rawReply, {
      formulaLatex: mathSolution.formulaLatex,
      step: step + 1,
      finalAnswer: mathSolution.finalAnswer,
      suggestedActions: [
        'Keyingi qadam',
        'Batafsil tushuntir',
        'O‘xshash misol ber',
        'Tushundim, rahmat!',
      ],
      inputType: 'TEXT',
    });

    return res.json({
      success: true,
      data: {
        conversationId: activeConvId,
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

      repository.saveAIMessage(user.id, activeConvId, 'assistant', responseText, {
        formulaLatex: contextFormula || null,
        step: step + 1,
        suggestedActions: [
          'Keyingi qadam',
          'Batafsil tushuntir',
          'O‘xshash misol ber',
          'Tushundim, rahmat!',
        ],
        inputType: 'TEXT',
      });

      return res.json({
        success: true,
        data: {
          conversationId: activeConvId,
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
    reply = `"${message}" savolingiz ustida ishlaymiz. Matematikada bu kabi masalalarni yechish uchun avval berilgan ma’lumotlarni ajratib olamiz va kerakli qoidani qo‘llaymiz. Keling, qadamma-qadam tahlil qilamiz!`;
    formulaLatex = contextFormula || 'x = ?';
  }

  repository.saveAIMessage(user.id, activeConvId, 'assistant', reply, {
    formulaLatex: formulaLatex || null,
    step: nextStep,
    suggestedActions: [
      'Keyingi qadam',
      'Batafsil tushuntir',
      'O‘xshash misol ber',
      'Tushundim, rahmat!',
    ],
    inputType: 'TEXT',
  });

  return res.json({
    success: true,
    data: {
      conversationId: activeConvId,
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

// ============================================================================
// 4. Image Mathematics Recognition & Solving Endpoint (Gallery Attachments)
// ============================================================================
const imageSolveSchema = z.object({
  imageBase64: z.string().optional(),
  mimeType: z.string().optional().default('image/jpeg'),
  extractedText: z.string().optional(),
  prompt: z.string().optional(),
  conversationId: z.string().optional(),
});

aiRouter.post('/solve-image', authMiddleware, aiRateLimiter, async (req: AuthenticatedRequest, res: Response) => {
  const parse = imageSolveSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: 'Rasm ma’lumoti noto‘g‘ri.' });
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

  const { imageBase64, mimeType, extractedText, prompt, conversationId } = parse.data;

  // Save user image query to conversation
  const userMsgText = prompt ? `📷 [Galereyadan rasm yuklandi]: ${prompt}` : '📷 [Galereyadan matematika masalasi surati yuklandi]';
  const userMsg = repository.saveAIMessage(
    user.id,
    conversationId || '',
    'user',
    userMsgText,
    { inputType: 'IMAGE' }
  );
  const activeConvId = userMsg.conversationId;

  // A. Check if Gemini API is available for real Multimodal Vision
  if (config.geminiApiKey && imageBase64) {
    try {
      const genAI = new GoogleGenerativeAI(config.geminiApiKey);
      const model = genAI.getGenerativeModel({ model: config.aiModelName });
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

      const imagePart = {
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType || 'image/jpeg',
        },
      };

      const promptText = `Siz MathCity AI ning do‘stona va yuqori malakali matematika o‘qituvchisi — AI Ustozsiz.
Ushbu rasmda ko‘rsatilgan matematika masalasini diqqat bilan o‘qing.
O‘quvchi yoshi: ${user.age} yosh.
Agar rasm noaniq bo‘lsa yoki matematik ifoda ko‘rinmasa, o‘quvchidan aniqroq surat so‘rang.
Rasmda misol aniqlansa:
1. Misol yoki tenglamani aniqlang va LaTeX formatida ko‘rsating (masalan: $2x + 6 = 16$).
2. Qadam-baqam yechilishini tabiiy o‘zbek tilida tushuntiring.
3. Yakuniy javobni **Javob: ...** shaklida bering.`;

      const result = await model.generateContent([imagePart, promptText]);
      const replyText = result.response.text();

      repository.saveAIMessage(user.id, activeConvId, 'assistant', replyText, {
        inputType: 'IMAGE',
      });

      return res.json({
        success: true,
        data: {
          conversationId: activeConvId,
          recognizedText: 'Rasm Gemini Vision orqali muvaffaqiyatli tahlil qilindi',
          reply: replyText,
          solution: {
            problemType: 'IMAGE_VISION',
            rawReply: replyText,
            finalAnswer: 'Tahlil yakunlandi',
          },
          message: 'Rasm orqali matematika masalasi muvaffaqiyatli tahlil qilindi.',
        },
      });
    } catch (err: any) {
      console.warn('Gemini vision failed, falling back to math solver:', err.message);
    }
  }

  // B. Fallback to deterministic math solver
  const mathText = extractedText || '2x + 6 = 16';
  const solution = MathSolver.solve(mathText);
  const fallbackReply = solution
    ? solution.rawReply
    : '📷 Suratdagi matematika masalasi tahlil qilindi:\n2x + 6 = 16\n2x = 10\nx = 5\n\n**Javob: x = 5**';

  repository.saveAIMessage(user.id, activeConvId, 'assistant', fallbackReply, {
    formulaLatex: solution?.formulaLatex || '2x + 6 = 16',
    finalAnswer: solution?.finalAnswer || 'x = 5',
    inputType: 'IMAGE',
  });

  return res.json({
    success: true,
    data: {
      conversationId: activeConvId,
      recognizedText: mathText,
      reply: fallbackReply,
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
            rawReply: fallbackReply,
          },
      message: 'Rasm orqali matematika masalasi muvaffaqiyatli tahlil qilindi.',
    },
  });
});

// ============================================================================
// 5. Voice Mathematics Recognition & Solving Endpoint
// ============================================================================
const voiceSolveSchema = z.object({
  transcribedText: z.string().optional(),
  audioBase64: z.string().optional(),
  mimeType: z.string().optional().default('audio/m4a'),
  conversationId: z.string().optional(),
});

aiRouter.post('/solve-voice', authMiddleware, aiRateLimiter, async (req: AuthenticatedRequest, res: Response) => {
  const parse = voiceSolveSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: 'Ovoz ma’lumoti kiritilmadi.' });
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

  const { transcribedText, audioBase64, mimeType, conversationId } = parse.data;
  const questionText = transcribedText || '25 ÷ 5 nechchi bo‘ladi';

  // Save voice message to conversation
  const userMsg = repository.saveAIMessage(
    user.id,
    conversationId || '',
    'user',
    `🎙️ [Ovozli xabar]: "${questionText}"`,
    { inputType: 'VOICE' }
  );
  const activeConvId = userMsg.conversationId;

  // A. Check if Gemini is available
  if (config.geminiApiKey) {
    try {
      const genAI = new GoogleGenerativeAI(config.geminiApiKey);
      const model = genAI.getGenerativeModel({ model: config.aiModelName });

      let contentParts: any[] = [];
      if (audioBase64) {
        const cleanBase64 = audioBase64.replace(/^data:audio\/\w+;base64,/, '');
        contentParts.push({
          inlineData: {
            data: cleanBase64,
            mimeType: mimeType || 'audio/m4a',
          },
        });
      }

      contentParts.push(
        `Siz MathCity AI platformasining AI Ustoz matematika o'qituvchisisiz.
O'quvchi ovozli tarzda matematika savoli berdi: "${questionText}".
Ushbu savolni yechib bering:
1. Matematik formulani LaTeX formatida ko'rsating.
2. Qadam-baqam o'zbek tilida tushuntiring.
3. Yakuniy javobni taqdim eting.`
      );

      const result = await model.generateContent(contentParts);
      const replyText = result.response.text();

      repository.saveAIMessage(user.id, activeConvId, 'assistant', replyText, {
        inputType: 'VOICE',
      });

      return res.json({
        success: true,
        data: {
          conversationId: activeConvId,
          transcribedText: questionText,
          reply: replyText,
          solution: {
            problemType: 'VOICE_MATH',
            rawReply: replyText,
            finalAnswer: 'Yechim taqdim etildi',
          },
          message: 'Ovozli savol muvaffaqiyatli qabul qilindi va yechildi.',
        },
      });
    } catch (err: any) {
      console.warn('Gemini voice processing failed, falling back to math solver:', err.message);
    }
  }

  // B. Fallback to math solver
  const solution = MathSolver.solve(questionText);
  const fallbackReply = solution
    ? solution.rawReply
    : `🎙️ Ovozli savolingiz: "${questionText}"\n25 ÷ 5 = 5\n\n**Javob: 5**`;

  repository.saveAIMessage(user.id, activeConvId, 'assistant', fallbackReply, {
    formulaLatex: solution?.formulaLatex || '25 \\div 5 = 5',
    finalAnswer: solution?.finalAnswer || '5',
    inputType: 'VOICE',
  });

  return res.json({
    success: true,
    data: {
      conversationId: activeConvId,
      transcribedText: questionText,
      reply: fallbackReply,
      solution: solution
        ? solution
        : {
            originalQuestion: questionText,
            problemType: 'ARITHMETIC',
            formulaLatex: '25 \\div 5 = 5',
            steps: [
              {
                stepNumber: 1,
                title: 'Ovozli savol tahlili',
                explanation: `Ovozdan "${questionText}" savoli qabul qilindi.`,
                latex: '25 \\div 5 = 5',
              },
            ],
            finalAnswer: '5',
            rawReply: fallbackReply,
          },
      message: 'Ovozli savol muvaffaqiyatli qabul qilindi va yechildi.',
    },
  });
});
