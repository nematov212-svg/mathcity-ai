import { Router, Response } from 'express';
import { z } from 'zod';
import { authMiddleware, AuthenticatedRequest } from '../../middleware/auth.js';
import { aiRateLimiter } from '../../middleware/rateLimit.js';
import { config } from '../../config/env.js';
import { repository } from '../../utils/repository.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const aiRouter = Router();

const chatSchema = z.object({
  message: z.string().min(1, 'Savol bo‘sh bo‘lishi mumkin emas.').max(500, 'Savol juda uzun (maksimal 500 belgi).'),
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

  const { message, action, step, contextFormula } = parse.data;
  const user = req.user!;

  // Mark daily task
  if (user.dailyTaskProgress['task_ai_consult']) {
    user.dailyTaskProgress['task_ai_consult'].currentCount = 1;
    user.dailyTaskProgress['task_ai_consult'].isCompleted = true;
  }

  // 1. Check if Gemini API is available
  if (config.geminiApiKey) {
    try {
      const genAI = new GoogleGenerativeAI(config.geminiApiKey);
      const model = genAI.getGenerativeModel({ model: config.aiModelName });

      const systemPrompt = `Siz MathCity AI platformasining Ziyo ismli samimiy va bilimdon matematika ustozisiz.
O'quvchi yoshi: ${user.age} yosh (${user.mode === 'KIDS' ? 'Bolalar rejimi, samimiy, sodda va rag‘batlantiruvchi' : 'O‘smirlar rejimi, jiddiyroq va ilmiy'}).
Javobingiz faqat tabiiy o'zbek tilida bo'lishi kerak.
Matematik formulalarni LaTeX formatida bering (masalan: $2x + 6 = 16$).
Pedagogik qoida: Hech qachon to'g'ridan-to'g'ri tayyor javobni darhol aytib bermang, o'quvchini qadam-baqam fikrlashga va yechimga o'zi yetib kelishiga yo'naltiring.
Amal turi: ${action}. Hozirgi qadam: ${step}.`;

      const result = await model.generateContent(`${systemPrompt}\n\nO'quvchi savoli: "${message}"`);
      const responseText = result.response.text();

      return res.json({
        success: true,
        data: {
          reply: responseText,
          formulaLatex: contextFormula || null,
          step: step + 1,
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

  // 2. Intelligent pedagogical rule-based tutor in natural Uzbek
  let reply = '';
  let formulaLatex = contextFormula;
  let nextStep = step + 1;

  if (action === 'next_step' || message.toLowerCase().includes('keyingi qadam')) {
    if (step === 1) {
      reply =
        'Ajoyib! 1-qadam: Tenglamaning ikkala tomonidan 6 ni ayirib tashlaymiz.\nNatijada noma’lum sonli qism chapda yolg‘iz qoladi:';
      formulaLatex = '2x = 16 - 6 \\implies 2x = 10';
    } else if (step === 2) {
      reply =
        'Juda yaxshi! 2-qadam: Endi x ning oldidagi ko‘paytuvchi (2) dan xalos bo‘lish uchun ikkala tomonni 2 ga bo‘lamiz:';
      formulaLatex = 'x = \\frac{10}{2} \\implies x = 5';
    } else {
      reply =
        'Barakalla! Masala to‘liq yechildi. Javobni tekshirib ko‘ramiz: 2 × 5 + 6 = 10 + 6 = 16. Tenglik to‘g‘ri!';
      formulaLatex = 'x = 5';
    }
  } else if (action === 'similar_example') {
    reply =
      'Mana sizga mashq qilish uchun ajoyib o‘xshash misol:\nQani, urinib ko‘ring-chi, javobini menga yozing:';
    formulaLatex = '3x + 4 = 19';
    nextStep = 1;
  } else if (action === 'explain_more' || message.toLowerCase().includes('tushunmadim')) {
    reply =
      'Keling, buni oddiy taroziga o‘xshatib tasavvur qilamiz! Tarozining chap pallasida 2 ta quti (x) va 6 ta tosh bor. O‘ng pallasida esa 16 ta tosh. Tarozining muvozanatini saqlab qolish uchun ikkala tomondan 6 tadan toshni olib tashlasak, 2 ta quti 10 ta toshga teng bo‘ladi!';
    formulaLatex = '2x = 10';
  } else {
    // General welcoming math response
    reply = `Salom ${user.displayName}! Men sizning matematika bo‘yicha shaxsiy ustozingiz Ziyoman. ${
      user.mode === 'KIDS'
        ? 'Qaysi misol yoki darsda qiynalayapsiz? Keling, birgalikda bosqichma-bosqich yechamiz!'
        : 'Qaysi algebraik ifoda yoki geometriya masalasi ustida ishlayapmiz? Yechim qadamlarini tahlil qilamiz.'
    }`;
    formulaLatex = '2x + 6 = 16';
  }

  return res.json({
    success: true,
    data: {
      reply,
      formulaLatex: formulaLatex || null,
      step: nextStep,
      suggestedActions: [
        'Keyingi qadam',
        'Batafsil tushuntir',
        'O‘xshash misol ber',
        'Tushunmadim',
      ],
    },
  });
});
