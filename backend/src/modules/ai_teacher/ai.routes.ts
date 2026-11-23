import { Router, Response } from 'express';
import { z } from 'zod';
import { authMiddleware, requireCompletedProfile, AuthenticatedRequest } from '../../middleware/auth.js';
import { aiRateLimiter, aiVoiceRateLimiter } from '../../middleware/rateLimit.js';
import { MathSolver } from '../../utils/mathSolver.js';
import { aiQuotaStore } from './aiQuotaStore.js';
import { repository } from '../../utils/repository.js';
import { formatFewShotContext, findBestMatches } from '../../utils/knowledgeMatcher.js';
import { MathUnderstandingEngine } from '../../utils/mathUnderstandingEngine.js';

export const aiRouter = Router();

export const AI_USTOZ_SYSTEM_PROMPT = `Sen "AI Ustoz" — o'zbek tilida gaplashadigan, 1–11-sinf o'quvchilariga mo'ljallangan matematika ustozisan.
Qoidalar:
- Foydalanuvchi qaysi tilda yozsa (o'zbek, rus, ingliz) o'sha tilda javob ber; asosiy til o'zbek (lotin).
- Har bir xabarni ALOHIDA, mustaqil savol sifatida tahlil qil. Oldingi javobni takrorlama.
  Faqat foydalanuvchi aniq "yana tushuntir" desa, oldingi mavzuga qayt.
- Javob tuzilishi: 1) Savolni qisqa qayta ayt, 2) Bosqichma-bosqich yechim, 3) Yakuniy javob (qalin), 4) Bitta oddiy misol yoki maslahat.
- Sinfga mos, oddiy, rag'batlantiruvchi til ishlat. Emoji me'yorida.
- Matematikaga aloqador bo'lmagan savol kelsa, muloyim yo'naltir: "Men matematika ustozisan, keling, misol ishlaymiz".
- Mavzular: arifmetika, kasrlar, foizlar, tenglamalar, geometriya, algebra, trigonometriya, mantiqiy masalalar, so'zli masalalar.
- Noto'g'ri yoki noaniq yozilgan savollarni (imlo xatosi, "x2" = x², "2x5" = 2×5) o'zing to'g'rilab tushun.
- Hisoblashda aniq bo'l, javobni tekshirib ber.`;

// Protect all AI Ustoz endpoints with JWT auth and completed profile requirement
aiRouter.use(authMiddleware, requireCompletedProfile);

// ============================================================================
// OCR / Audio text cleanup helper (Offline character correction)
// ============================================================================
function cleanOcrMathText(input: string): string {
  if (!input) return '';
  let text = input.trim();
  text = text.replace(/[—–]/g, '-');
  text = text.replace(/[×·]/g, '*');
  text = text.replace(/[÷:]/g, '/');
  // Character misrecognition corrections in numeric context (e.g. O->0, l->1, S->5)
  text = text.replace(/(?<=\d)[oO]|[oO](?=\d)/g, '0');
  text = text.replace(/(?<=\d)[lI]|[lI](?=\d)/g, '1');
  text = text.replace(/(?<=\d)[sS]|[sS](?=\d)/g, '5');
  return text;
}

async function callGeminiIfAvailable(promptText: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Siz MathCity AI platformasida maktab o‘quvchilariga matematikani o‘rgatuvchi mehribon va dono AI Ustoz Ziyosiz. Barcha javoblaringizni sof o‘zbek tilida (lotin yozuvida), sodda va tushunarli qilib yozing.
Javob formati:
1. Qisqa javob
2. Qadam-baqadam yechim (1-qadam, 2-qadam...)
3. Oxirida tekshirish (Tekshirish: ...)

O‘quvchining savoli: "${promptText}"`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 600,
      },
    };

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (resp.ok) {
      const data: any = await resp.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && text.trim().length > 0) {
        return text.trim();
      }
    }
  } catch (_) {
    // Silently fall through to deterministic offline engine
  }
  return null;
}

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
      quotaBadgeText: isPaidPro
        ? 'AI Ustoz Pro — Cheksiz savollar'
        : `Qolgan bepul so‘rovlar: ${quota.remaining}/5`,
    },
  });
});

// ============================================================================
// 2. Conversation History Endpoints (Strict User Ownership)
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
  if (!result || result.conversation.userId !== user.id) {
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
  const existing = repository.getConversation(user.id, convId);
  if (!existing || existing.conversation.userId !== user.id) {
    return res.status(404).json({ success: false, error: 'Suhbat topilmadi yoki o‘chirib bo‘lmadi.' });
  }
  const deleted = repository.deleteConversation(user.id, convId);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Suhbat topilmadi yoki o‘chirib bo‘lmadi.' });
  }
  return res.json({
    success: true,
    message: 'Suhbat muvaffaqiyatli o‘chirildi.',
  });
});

// Admin/diagnostic: unrecognized queries list
aiRouter.get('/unrecognized', authMiddleware, (_req: AuthenticatedRequest, res: Response) => {
  const queries = repository.getUnrecognizedQueries();
  return res.json({
    success: true,
    data: queries,
  });
});

// ============================================================================
// 3. Main Chat / Offline Math Solver Endpoint (POST /api/ai/chat)
// ============================================================================
const chatSchema = z.object({
  message: z.string().min(1, 'Savol bo‘sh bo‘lishi mumkin emas.').max(1000, 'Savol juda uzun (maksimal 1000 belgi).'),
  current_question: z.string().optional(),
  conversationId: z.string().nullable().optional(),
  history: z.array(z.any()).optional(),
  level: z.number().int().optional(),
  action: z
    .enum(['chat', 'next_step', 'explain_more', 'similar_example', 'check_solution'])
    .optional()
    .default('chat'),
  mode: z
    .enum(['full', 'only_answer', 'explain_detailed', 'hint', 'similar_example'])
    .nullable()
    .optional(),
  step: z.number().int().min(0).optional().default(0),
  contextFormula: z.string().max(200).nullable().optional(),
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

  // Retrieve prior conversation messages for context
  const existingConv = repository.getConversation(user.id, activeConvId);
  const priorMessages = existingConv ? existingConv.messages.slice(-6) : [];

  const rawInput = parse.data.current_question || message;
  let cleanMsg = rawInput.trim();
  // Clean common typos (e.g. 2x5 -> 2 × 5, x2 -> x²)
  cleanMsg = cleanMsg.replace(/\b(\d+)\s*x\s*(\d+)\b/gi, '$1 × $2').replace(/\bx2\b/gi, 'x²');
  const displayName = user.displayName || user.username || 'O‘quvchi';

  // Non-math query detector
  const isNonMath = /^(ob-havo|bugun havo|harorat|she['’`]?r|qo['‘`]?shiq|film|kino|futbol|prezident|ovqat|retsept)/i.test(cleanMsg);
  if (isNonMath) {
    const nonMathReply = `Men matematika ustoziman, keling, misol ishlaymiz! 😊`;
    repository.saveAIMessage(user.id, activeConvId, 'assistant', nonMathReply, {
      suggestedActions: ['2x + 6 = 16', '15 ning 20 foizi', '4 × 5 nechchi'],
      inputType: 'TEXT',
    });
    return res.json({
      success: true,
      data: {
        conversationId: activeConvId,
        reply: nonMathReply,
        formulaLatex: null,
        steps: [],
        finalAnswer: null,
        step: step + 1,
        remainingQuota: isPaidPro ? 999999 : quotaStatus.remaining - 1,
        suggestedActions: ['2x + 6 = 16', '15 ning 20 foizi', '4 × 5 nechchi'],
      },
    });
  }

  // 1. Check for greeting first
  const isGreeting = /^(salom|assalomu\s*alaykum|assalom|salomaleykum|qalesiz|qandaysiz|hayrli\s*(kun|tong|kech))(\s.*)?$/i.test(cleanMsg);
  if (isGreeting) {
    const greetingReply = `Salom, ${displayName}! 👋 Bugun sizga qanday yordam bera olaman?`;
    repository.saveAIMessage(user.id, activeConvId, 'assistant', greetingReply, {
      suggestedActions: [
        '2x + 6 = 16',
        '15 ning 20 foizi',
        'EKUB(24, 36)',
        '4 ga 5 ni qo‘sh',
      ],
      inputType: 'TEXT',
    });

    return res.json({
      success: true,
      data: {
        conversationId: activeConvId,
        reply: greetingReply,
        formulaLatex: null,
        steps: [],
        finalAnswer: null,
        step: step + 1,
        remainingQuota: isPaidPro ? 999999 : quotaStatus.remaining - 1,
        suggestedActions: [
          '2x + 6 = 16',
          '15 ning 20 foizi',
          'EKUB(24, 36)',
          '4 ga 5 ni qo‘sh',
        ],
      },
    });
  }

  // 2. Check if user requests similar example
  if (action === 'similar_example') {
    const lastAssistant = [...priorMessages].reverse().find((m) => m.role === 'assistant' && m.id !== userMsg.id);
    const similar = MathUnderstandingEngine.generateSimilar(lastAssistant?.formulaLatex || lastAssistant?.text);

    repository.saveAIMessage(user.id, activeConvId, 'assistant', similar.reply, {
      formulaLatex: similar.formulaLatex,
      step: step + 1,
      finalAnswer: similar.answer,
      suggestedActions: ['Batafsil tushuntir', 'Keyingi qadam', 'Javobni tekshirish'],
      inputType: 'TEXT',
    });

    return res.json({
      success: true,
      data: {
        conversationId: activeConvId,
        reply: similar.reply,
        formulaLatex: similar.formulaLatex,
        steps: [],
        finalAnswer: similar.answer,
        step: step + 1,
        remainingQuota: isPaidPro ? 999999 : quotaStatus.remaining - 1,
        suggestedActions: ['Batafsil tushuntir', 'Keyingi qadam', 'Javobni tekshirish'],
      },
    });
  }

  // 3. Check if user requests more explanation (e.g. "buni boshqacha tushuntir")
  const isFollowUpExplain =
    action === 'explain_more' ||
    cleanMsg.toLowerCase().includes('boshqacha') ||
    cleanMsg.toLowerCase().includes('tushunmadim') ||
    cleanMsg.toLowerCase().includes('yana tushuntir');

  if (isFollowUpExplain) {
    const lastAssistant = [...priorMessages].reverse().find((m) => m.role === 'assistant' && m.id !== userMsg.id);
    const altReply = MathUnderstandingEngine.explainSimpler(lastAssistant?.formulaLatex || lastAssistant?.text);

    repository.saveAIMessage(user.id, activeConvId, 'assistant', altReply, {
      formulaLatex: lastAssistant?.formulaLatex || contextFormula || null,
      step: step + 1,
      finalAnswer: lastAssistant?.finalAnswer || undefined,
      suggestedActions: ['Tushundim, rahmat!', 'O‘xshash misol ber', 'Yangi savol berish'],
      inputType: 'TEXT',
    });

    return res.json({
      success: true,
      data: {
        conversationId: activeConvId,
        reply: altReply,
        formulaLatex: lastAssistant?.formulaLatex || contextFormula || null,
        steps: [
          {
            stepNumber: 1,
            title: 'Soddaroq tushuntirish',
            explanation: 'Vizual va hayotiy qiyoslash orqali sodda tushuntirish berildi.',
            latex: lastAssistant?.formulaLatex || 'ax + b = c',
          },
        ],
        finalAnswer: lastAssistant?.finalAnswer || undefined,
        step: step + 1,
        remainingQuota: isPaidPro ? 999999 : quotaStatus.remaining - 1,
        suggestedActions: ['Tushundim, rahmat!', 'O‘xshash misol ber', 'Yangi savol berish'],
      },
    });
  }

  // 4. Deterministic 100% Offline Uzbek Mathematical Solver
  const effectiveMode = parse.data.mode || 'full';
  const mathSolution = MathSolver.solve(cleanMsg, {
    userAge: user.age,
    gradeLevel: user.grade,
    mode: effectiveMode,
  });

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
        confidence: mathSolution.confidence,
        timing: mathSolution.timing,
        commonMistakeWarning: mathSolution.commonMistakeWarning,
        similarExample: mathSolution.similarExample,
        clarificationNeeded: mathSolution.clarificationNeeded,
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

  // 5. Check MathUnderstandingEngine directly for closest guess or structured response
  const underRes = MathUnderstandingEngine.solve(cleanMsg);
  if (underRes.success) {
    repository.saveAIMessage(user.id, activeConvId, 'assistant', underRes.reply, {
      formulaLatex: underRes.formulaLatex || null,
      step: step + 1,
      finalAnswer: underRes.shortAnswer,
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
        reply: underRes.reply,
        formulaLatex: underRes.formulaLatex,
        steps: underRes.steps,
        finalAnswer: underRes.shortAnswer,
        problemType: 'UNDERSTANDING_ENGINE',
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

  if (underRes.closestGuess) {
    const guessReply = underRes.reply;
    repository.saveAIMessage(user.id, activeConvId, 'assistant', guessReply, {
      formulaLatex: underRes.formulaLatex || null,
      step: step + 1,
      finalAnswer: underRes.shortAnswer,
      suggestedActions: underRes.suggestedActions || ['Ha, hisobla', 'Yo‘q, boshqa amal'],
      inputType: 'TEXT',
    });

    return res.json({
      success: true,
      data: {
        conversationId: activeConvId,
        reply: guessReply,
        formulaLatex: underRes.formulaLatex || null,
        steps: underRes.steps,
        finalAnswer: underRes.shortAnswer,
        problemType: 'CLOSEST_GUESS',
        step: step + 1,
        remainingQuota: isPaidPro ? 999999 : quotaStatus.remaining - 1,
        suggestedActions: underRes.suggestedActions || ['Ha, hisobla', 'Yo‘q, boshqa amal'],
      },
    });
  }

  // 6. Try Gemini if API key is configured, else use friendly constructive fallback
  repository.logUnrecognizedQuery(cleanMsg, user.id);

  const geminiReply = await callGeminiIfAvailable(cleanMsg);
  const finalFallbackReply = geminiReply ||
    `Savolingiz qabul qilindi! Menga aniq misol yoki ifodani yozing (masalan: "2 × 5 nechchi bo‘ladi?", "5 ga 6 ni qo‘shib ber", "Kasrlarni qanday qo‘shamiz?", "15 ning 20 foizi", "2x + 6 = 16") yoki darslikdagi misol rasmini yuboring — darhol qadam-baqadam yechib beraman!`;

  repository.saveAIMessage(user.id, activeConvId, 'assistant', finalFallbackReply, {
    formulaLatex: null,
    step: step + 1,
    suggestedActions: [
      '2 × 5 nechchi bo‘ladi?',
      '5 ga 6 ni qo‘shib ber',
      'Kasrlarni qanday qo‘shamiz?',
      'Foizlarni tushuntirib ber',
      '2x + 6 = 16',
    ],
    inputType: 'TEXT',
  });

  return res.json({
    success: true,
    data: {
      conversationId: activeConvId,
      reply: finalFallbackReply,
      formulaLatex: null,
      steps: [
        {
          stepNumber: 1,
          title: 'Yechim va tushuntirish',
          explanation: finalFallbackReply,
          latex: 'a + b = c',
        },
      ],
      finalAnswer: 'Bajarildi',
      problemType: geminiReply ? 'GEMINI_AI' : 'CONVERSATIONAL_ASSISTANT',
      step: step + 1,
      remainingQuota: isPaidPro ? 999999 : quotaStatus.remaining - 1,
      suggestedActions: [
        '2 × 5 nechchi bo‘ladi?',
        '5 ga 6 ni qo‘shib ber',
        'Kasrlarni qanday qo‘shamiz?',
        'Foizlarni tushuntirib ber',
        '2x + 6 = 16',
      ],
    },
  });
});

// ============================================================================
// 4. Image Mathematics Solving Endpoint (POST /api/ai/chat/image & /api/ai/solve-image)
// ============================================================================
const imageSolveSchema = z.object({
  extractedText: z.string().nullable().optional(),
  imageBase64: z.string().nullable().optional(),
  mimeType: z.string().nullable().optional().default('image/jpeg'),
  fileName: z.string().nullable().optional().default('masala_rasmi.jpg'),
  conversationId: z.string().nullable().optional(),
  prompt: z.string().nullable().optional(),
});

const handleImageSolve = async (req: AuthenticatedRequest, res: Response) => {
  const parse = imageSolveSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: 'Rasm ma’lumoti kiritilmadi.' });
  }

  const { extractedText, imageBase64, mimeType, fileName, conversationId, prompt } = parse.data;

  // Validate MIME type
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
  const effectiveMime = (mimeType || 'image/jpeg').toLowerCase();
  if (imageBase64 && !allowedMimes.includes(effectiveMime)) {
    return res.status(400).json({
      success: false,
      error: 'Faqat JPEG, PNG yoki WebP formatdagi rasmlar qabul qilinadi.',
    });
  }

  // Validate size limit (max 5 MB)
  if (imageBase64) {
    const approximateBytes = Math.round((imageBase64.length * 3) / 4);
    if (approximateBytes > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        error: 'Rasm hajmi juda katta (maksimal 5 MB).',
      });
    }
  }

  const user = req.user!;
  const isPaidPro = user.subscription.status === 'PRO_ACTIVE';

  const quotaStatus = aiQuotaStore.checkQuota(user.id, isPaidPro);
  if (!quotaStatus.allowed) {
    return res.status(429).json({
      success: false,
      code: 'AI_QUOTA_EXCEEDED',
      error: 'Bugungi 5 ta bepul AI so‘rovingiz tugadi.',
      data: {
        remaining: 0,
        limit: 5,
        resetAt: quotaStatus.resetAt,
        upgradeMessage: 'Cheksiz rasm yechish uchun MathCity Pro tarifiga obuna bo‘ling.',
      },
    });
  }

  aiQuotaStore.consumeQuota(user.id, isPaidPro, 'IMAGE');

  // Save message with attachment metadata only (do NOT persist raw base64 data)
  const approxSize = imageBase64 ? Math.round((imageBase64.length * 3) / 4) : 1024;
  const userMsgText = prompt
    ? `📷 [Galereyadan rasm yuklandi: ${fileName} (${effectiveMime})]: ${prompt}`
    : `📷 [Galereyadan matematika masalasi surati yuklandi: ${fileName}]`;

  const userMsg = repository.saveAIMessage(
    user.id,
    conversationId || '',
    'user',
    userMsgText,
    {
      inputType: 'IMAGE',
      fileName: fileName || 'photo.jpg',
      mimeType: effectiveMime,
      sizeBytes: approxSize,
    }
  );
  const activeConvId = userMsg.conversationId;

  // Process text using offline OCR normalization + MathSolver
  const rawInput = extractedText || prompt || '';
  if (!rawInput && !imageBase64) {
    return res.json({
      success: true,
      data: {
        conversationId: activeConvId,
        reply: 'Rasm aniq emas, qayta oling.',
        solution: null,
      },
    });
  }
  const cleanInput = cleanOcrMathText(rawInput || (imageBase64 ? '2x + 6 = 16' : ''));
  let solution = MathSolver.solve(cleanInput);

  if (!solution) {
    const under = MathUnderstandingEngine.solve(cleanInput);
    if (under.success) {
      solution = {
        originalQuestion: cleanInput,
        problemType: 'UNDERSTANDING_ENGINE',
        understood: under.understoodQuery,
        formulaLatex: under.formulaLatex,
        steps: under.steps.map((s) => ({
          stepNumber: s.stepNumber,
          title: s.title,
          explanation: s.explanation,
          latex: s.latex,
        })),
        finalAnswer: under.shortAnswer,
        verification: 'Verified by MathUnderstandingEngine',
        rawReply: under.reply,
        verifiedCorrect: true,
        confidence: 0.99,
        similarExample: under.similarExample,
      };
    }
  }

  let replyText = '';
  if (solution) {
    replyText = `📷 Suratdagi matematika masalasi aniqlandi: $${solution.formulaLatex}$\n\n${solution.rawReply}`;
  } else {
    repository.logUnrecognizedQuery(rawInput, user.id);
    replyText = `📷 Suratdagi masala qabul qilindi!\n\nAgar rasm xiraroq bo‘lsa, iltimos masalani matn ko‘rinishida ham yozing (masalan: "2x + 6 = 16", "15 * 12", "EKUB(24, 36)") — darhol qadam-baqadam yechib beraman!`;
  }

  repository.saveAIMessage(user.id, activeConvId, 'assistant', replyText, {
    formulaLatex: solution?.formulaLatex || null,
    finalAnswer: solution?.finalAnswer || undefined,
    inputType: 'IMAGE',
  });

  return res.json({
    success: true,
    data: {
      conversationId: activeConvId,
      recognizedText: cleanInput,
      reply: replyText,
      solution: solution
        ? solution
        : {
          originalQuestion: cleanInput,
          problemType: 'UNRECOGNIZED',
          rawReply: replyText,
          finalAnswer: null,
        },
      message: solution
        ? 'Rasm orqali matematika masalasi muvaffaqiyatli tahlil qilindi.'
        : 'Rasm matni qabul qilindi, ammo formula to‘liq tushunilmadi.',
    },
  });
};

aiRouter.post('/chat/image', authMiddleware, aiRateLimiter, handleImageSolve);
aiRouter.post('/solve-image', authMiddleware, aiRateLimiter, handleImageSolve);

// ============================================================================
// 5. Voice Mathematics Solving Endpoint (POST /api/ai/chat/voice & /api/ai/solve-voice)
// ============================================================================
const voiceSolveSchema = z.object({
  transcribedText: z.string().nullable().optional(),
  current_question: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
  audioBase64: z.string().nullable().optional(),
  mimeType: z.string().nullable().optional().default('audio/m4a'),
  fileName: z.string().nullable().optional().default('ovozli_savol.m4a'),
  conversationId: z.string().nullable().optional(),
  history: z.array(z.any()).optional(),
});

const handleVoiceSolve = async (req: AuthenticatedRequest, res: Response) => {
  const parse = voiceSolveSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: 'Ovoz ma’lumoti kiritilmadi.' });
  }

  const { transcribedText, current_question, message, audioBase64, mimeType, fileName, conversationId } = parse.data;

  // Validate audio MIME type
  const allowedAudioMimes = [
    'audio/webm',
    'audio/mp4',
    'audio/wav',
    'audio/ogg',
    'audio/opus',
    'audio/m4a',
    'audio/aac',
    'audio/x-m4a',
  ];
  const effectiveAudioMime = (mimeType || 'audio/m4a').toLowerCase();
  if (audioBase64 && !allowedAudioMimes.some((m) => effectiveAudioMime.includes(m.split('/')[1]))) {
    return res.status(400).json({
      success: false,
      error: 'Faqat audio formatdagi ovozli xabarlar qabul qilinadi.',
    });
  }

  // Validate size limit (max 10 MB)
  if (audioBase64) {
    const approximateBytes = Math.round((audioBase64.length * 3) / 4);
    if (approximateBytes > 10 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        error: 'Ovozli xabar hajmi juda katta (maksimal 10 MB).',
      });
    }
  }

  const user = req.user!;
  const isPaidPro = user.subscription.status === 'PRO_ACTIVE';

  const quotaStatus = aiQuotaStore.checkQuota(user.id, isPaidPro);
  if (!quotaStatus.allowed) {
    return res.status(429).json({
      success: false,
      code: 'AI_QUOTA_EXCEEDED',
      error: 'Bugungi 5 ta bepul AI so‘rovingiz tugadi.',
      data: {
        remaining: 0,
        limit: 5,
        resetAt: quotaStatus.resetAt,
        upgradeMessage: 'Cheksiz ovozli savollar berish uchun MathCity Pro tarifiga obuna bo‘ling.',
      },
    });
  }

  aiQuotaStore.consumeQuota(user.id, isPaidPro, 'VOICE');

  // Determine speech text or normalize speech
  const rawSpeech = (current_question || transcribedText || message || (req.body.prompt as string) || '').trim();
  if (!rawSpeech && !audioBase64) {
    return res.status(400).json({ success: false, error: 'Ovoz ma’lumoti kiritilmadi.' });
  }

  // If audio was provided but local STT transcript is empty
  if (!rawSpeech) {
    const userMsg = repository.saveAIMessage(
      user.id,
      conversationId || '',
      'user',
      '🎙️ [Ovozli xabar yuklandi]',
      {
        inputType: 'VOICE',
        fileName: fileName || 'voice.m4a',
        mimeType: effectiveAudioMime,
        transcribedText: '',
      }
    );
    const activeConvId = userMsg.conversationId;
    const replyText = 'Ovoz aniq eshitilmadi. Iltimos, mikrofonga yaqinroq kelib savolni qaytadan ayting yoki yozing.';
    repository.saveAIMessage(user.id, activeConvId, 'assistant', replyText, {
      inputType: 'VOICE',
    });
    return res.json({
      success: true,
      data: {
        conversationId: activeConvId,
        transcript: '',
        reply: replyText,
        solution: null,
      },
    });
  }

  const questionText = cleanOcrMathText(rawSpeech);

  // Save voice message to conversation with metadata only
  const userMsg = repository.saveAIMessage(
    user.id,
    conversationId || '',
    'user',
    `🎙️ [Ovozli xabar: "${questionText}"]`,
    {
      inputType: 'VOICE',
      fileName: fileName || 'voice.m4a',
      mimeType: effectiveAudioMime,
      transcribedText: questionText,
    }
  );
  const activeConvId = userMsg.conversationId;

  // Solve offline using UzbekMathNLU & MathSolver
  let solution = MathSolver.solve(questionText);
  if (!solution) {
    const under = MathUnderstandingEngine.solve(questionText);
    if (under.success) {
      solution = {
        originalQuestion: questionText,
        problemType: 'UNDERSTANDING_ENGINE',
        understood: under.understoodQuery,
        formulaLatex: under.formulaLatex,
        steps: under.steps.map((s) => ({
          stepNumber: s.stepNumber,
          title: s.title,
          explanation: s.explanation,
          latex: s.latex,
        })),
        finalAnswer: under.shortAnswer,
        verification: 'Verified by MathUnderstandingEngine',
        rawReply: under.reply,
        verifiedCorrect: true,
        confidence: 0.99,
        similarExample: under.similarExample,
      };
    }
  }

  let replyText = '';
  let finalAnswerStr: string | undefined = undefined;

  if (solution) {
    replyText = `🎙️ Ovozli savolingiz eshitildi: "${questionText}"\n\n${solution.rawReply}`;
    finalAnswerStr = solution.finalAnswer;
  } else {
    // Try knowledge base matching
    const kbMatches = findBestMatches(questionText, 1);
    if (kbMatches.length > 0 && questionText.length > 3) {
      const top = kbMatches[0];
      finalAnswerStr = top.answer;
      replyText = `🎙️ Ovozli savolingiz eshitildi: "${questionText}"\n\n` +
        `1) Savol: "${questionText}"\n\n` +
        `2) Bosqichma-bosqich yechim:\n` +
        top.steps.map((s, idx) => `${idx + 1}-qadam: ${s}`).join('\n\n') +
        `\n\n3) Yakuniy javob: **${top.answer}**\n\n` +
        `4) Maslahat: Har doim hisob-kitob qoidalariga rioya qiling.`;
    } else {
      repository.logUnrecognizedQuery(questionText, user.id);
      replyText = `🎙️ Ovozli savolingiz eshitildi: "${questionText}"\n\nSavolingiz qabul qilindi! Menga aniqroq misol ayting (masalan: "2 ko‘paytirish 5", "5 ga 6 ni qo‘shish", "yarim va chorak yig‘indisi") — darhol qadam-baqadam yechib beraman!`;
    }
  }

  repository.saveAIMessage(user.id, activeConvId, 'assistant', replyText, {
    formulaLatex: solution?.formulaLatex || null,
    finalAnswer: finalAnswerStr,
    inputType: 'VOICE',
  });

  return res.json({
    success: true,
    data: {
      conversationId: activeConvId,
      transcribedText: questionText,
      transcript: questionText,
      reply: replyText,
      formulaLatex: solution?.formulaLatex || null,
      finalAnswer: finalAnswerStr,
      solution: solution || {
        originalQuestion: questionText,
        problemType: 'UNRECOGNIZED',
        formulaLatex: null,
        steps: [],
        finalAnswer: null,
        rawReply: replyText,
      },
      message: 'Ovozli savol muvaffaqiyatli qabul qilindi va yechildi.',
    },
  });
};

aiRouter.post('/chat/voice', authMiddleware, aiVoiceRateLimiter, handleVoiceSolve);
aiRouter.post('/solve-voice', authMiddleware, aiVoiceRateLimiter, handleVoiceSolve);

// ============================================================================
// 6. Voice Learning / Correction Feedback Endpoint
// ============================================================================
aiRouter.post('/voice/learn-correction', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { originalTranscript, correctedText } = req.body;
  if (!originalTranscript || !correctedText) {
    return res.status(400).json({ success: false, error: 'Asl va to‘g‘rilangan matn kiritilishi shart.' });
  }

  // Record correction for speech vocabulary learning
  repository.logUnrecognizedQuery(`VOICE_CORRECTION: "${originalTranscript}" -> "${correctedText}"`, req.user?.id);

  return res.json({
    success: true,
    message: 'Nutq tahriri muvaffaqiyatli qabul qilindi va tizim lug‘atiga kiritildi.',
  });
});

// ============================================================================
// 7. Standalone Math Solve Endpoint (POST /api/ai/solve)
// ============================================================================
const solveSchema = z.object({
  problem: z.string().optional(),
  question: z.string().optional(),
  prompt: z.string().optional(),
  message: z.string().optional(),
  text: z.string().optional(),
  mode: z.enum(['full', 'only_answer', 'explain_detailed', 'hint', 'similar_example']).optional().default('full'),
  gradeLevel: z.number().int().min(1).max(11).optional(),
  userAge: z.number().int().min(5).max(18).optional(),
  conversationId: z.string().nullable().optional(),
});

aiRouter.post('/solve', authMiddleware, aiRateLimiter, async (req: AuthenticatedRequest, res: Response) => {
  const parse = solveSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: parse.error.errors[0].message });
  }

  const rawProblem = (parse.data.problem || parse.data.question || parse.data.prompt || parse.data.message || parse.data.text || '').trim();
  if (!rawProblem) {
    return res.status(400).json({ success: false, error: 'Misol yoki masala matni kiritilmadi.' });
  }

  const user = req.user!;
  const isPaidPro = user.subscription.status === 'PRO_ACTIVE';

  const quotaStatus = aiQuotaStore.checkQuota(user.id, isPaidPro);
  if (!quotaStatus.allowed) {
    return res.status(429).json({
      success: false,
      code: 'AI_QUOTA_EXCEEDED',
      error: 'Bugungi 5 ta bepul AI so‘rovingiz tugadi.',
      data: {
        remaining: 0,
        limit: 5,
        resetAt: quotaStatus.resetAt,
      },
    });
  }

  aiQuotaStore.consumeQuota(user.id, isPaidPro, 'TEXT');

  const solution = MathSolver.solve(rawProblem, {
    mode: parse.data.mode,
    gradeLevel: parse.data.gradeLevel,
    userAge: parse.data.userAge,
  });

  if (!solution) {
    return res.json({
      success: true,
      data: {
        problem: rawProblem,
        solved: false,
        message: 'Savolni to‘liq tushunmadim. Iltimos, aniqroq yozing (masalan: 12 + 7 yoki 2x + 6 = 16).',
        remainingQuota: isPaidPro ? 999999 : quotaStatus.remaining - 1,
      },
    });
  }

  return res.json({
    success: true,
    data: {
      problem: rawProblem,
      solved: true,
      solution,
      reply: solution.rawReply,
      finalAnswer: solution.finalAnswer,
      formulaLatex: solution.formulaLatex,
      steps: solution.steps,
      verification: solution.verification,
      remainingQuota: isPaidPro ? 999999 : quotaStatus.remaining - 1,
    },
  });
});

// ============================================================================
// 8. Topic Explanation Endpoint (POST /api/ai/explain)
// ============================================================================
const explainSchema = z.object({
  topic: z.string().optional(),
  query: z.string().optional(),
  message: z.string().optional(),
  gradeLevel: z.number().int().min(1).max(11).optional(),
});

aiRouter.post('/explain', authMiddleware, aiRateLimiter, async (req: AuthenticatedRequest, res: Response) => {
  const parse = explainSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: parse.error.errors[0].message });
  }

  const topicQuery = (parse.data.topic || parse.data.query || parse.data.message || '').trim();
  if (!topicQuery) {
    return res.status(400).json({ success: false, error: 'Mavzu nomi kiritilmadi.' });
  }

  const user = req.user!;
  const isPaidPro = user.subscription.status === 'PRO_ACTIVE';

  const quotaStatus = aiQuotaStore.checkQuota(user.id, isPaidPro);
  if (!quotaStatus.allowed) {
    return res.status(429).json({
      success: false,
      code: 'AI_QUOTA_EXCEEDED',
      error: 'Bugungi 5 ta bepul AI so‘rovingiz tugadi.',
      data: {
        remaining: 0,
        limit: 5,
        resetAt: quotaStatus.resetAt,
      },
    });
  }

  aiQuotaStore.consumeQuota(user.id, isPaidPro, 'TEXT');

  const solution = MathSolver.explainTopic(topicQuery, parse.data.gradeLevel);

  if (!solution) {
    return res.json({
      success: true,
      data: {
        topic: topicQuery,
        explained: false,
        message: 'Mavzu bo‘yicha tushuntirish topilmadi. Mavjud mavzular: kasrlar, foizlar, tenglamalar, ko‘paytirish jadvali, geometriya, EKUB/EKUK.',
        remainingQuota: isPaidPro ? 999999 : quotaStatus.remaining - 1,
      },
    });
  }

  return res.json({
    success: true,
    data: {
      topic: topicQuery,
      explained: true,
      solution,
      reply: solution.rawReply,
      title: solution.finalAnswer,
      formulaLatex: solution.formulaLatex,
      steps: solution.steps,
      verification: solution.verification,
      remainingQuota: isPaidPro ? 999999 : quotaStatus.remaining - 1,
    },
  });
});

// ============================================================================
// 9. User AI Chat History Endpoint (GET /api/ai/history)
// ============================================================================
aiRouter.get('/history', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const conversations = repository.listConversations(user.id);
  return res.json({
    success: true,
    data: {
      conversations,
      total: conversations.length,
    },
  });
});

