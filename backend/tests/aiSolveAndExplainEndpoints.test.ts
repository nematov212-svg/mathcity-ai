import request from 'supertest';
import { app } from '../src/app.js';
import { repository } from '../src/utils/repository.js';
import { aiQuotaStore } from '../src/modules/ai_teacher/aiQuotaStore.js';

describe('Block 7: AI Ustoz Endpoints (100% Offline, Zero External APIs, Pure Rules-Based MathSolver)', () => {
  let userToken: string;
  let testUserId: string;

  beforeAll(async () => {
    // Register unique test student for Block 7
    const email = `ai_tester_${Date.now()}@mathcity.ai`;
    const regRes = await request(app).post('/api/auth/register').send({
      email,
      password: 'StrongPassword123!',
      displayName: 'AI Test O‘quvchi',
      dateOfBirth: '2014-05-15',
    });

    userToken = regRes.body.data.token;
    testUserId = regRes.body.data.user.id;

    // Complete profile
    await request(app)
      .post('/api/auth/complete-profile')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        birthDate: '2014-05-15',
        username: `aitest${Date.now().toString().slice(-6)}`,
      });
  });

  beforeEach(() => {
    // Reset quota before tests if needed
    if (testUserId) {
      aiQuotaStore.resetQuota(testUserId);
    }
  });

  // ==========================================================================
  // 1. POST /api/ai/explain — Conceptual Knowledge Base
  // ==========================================================================
  describe('POST /api/ai/explain', () => {
    const topicsToTest = [
      {
        query: 'Kasrlarni qanday qo‘shamiz?',
        expectedCategory: 'Kasrlar',
        expectedTitle: 'Kasrlarni qo‘shish va ayirish',
      },
      {
        query: 'Foizlarni tushuntirib ber.',
        expectedCategory: 'Foizlar',
        expectedTitle: 'Foizlar va ularni hisoblash',
      },
      {
        query: 'Tenglamalarni yechishni o‘rgat.',
        expectedCategory: 'Tenglamalar',
        expectedTitle: 'Tenglamalarni yechish qoidalari',
      },
      {
        query: 'Ko‘paytirish jadvalini tushuntir',
        expectedCategory: 'Arifmetika',
        expectedTitle: 'Ko‘paytirish jadvali va tez hisoblash',
      },
      {
        query: 'Geometriyani tushuntir: perimetr va yuza',
        expectedCategory: 'Geometriya',
        expectedTitle: 'Geometriya: Perimetr, Yuza va Pifagor',
      },
      {
        query: 'EKUB va EKUK nima?',
        expectedCategory: 'Sonlar nazariyasi',
        expectedTitle: 'Bo‘linish alomatlari, EKUB va EKUK',
      },
    ];

    topicsToTest.forEach(({ query, expectedTitle }) => {
      it(`Tushuntirish: "${query}" -> ${expectedTitle}`, async () => {
        const t0 = performance.now();
        const res = await request(app)
          .post('/api/ai/explain')
          .set('Authorization', `Bearer ${userToken}`)
          .send({ topic: query });

        const elapsedMs = performance.now() - t0;
        expect(elapsedMs).toBeLessThan(1000); // Response time < 1s

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.explained).toBe(true);
        expect(res.body.data.title).toBe(expectedTitle);
        expect(res.body.data.steps.length).toBeGreaterThanOrEqual(3);

        // Verify 5-part structure
        const reply = res.body.data.reply;
        expect(reply).toContain('1) Berilgan:');
        expect(reply).toContain('2) Qoida:');
        expect(reply).toContain('3) Hisoblash');
        expect(reply).toContain('4) Javob:');
        expect(reply).toContain('5) Tekshirish:');
      });
    });

    it('Noma’lum mavzu kiritilganda taklif va xabar beradi', async () => {
      const res = await request(app)
        .post('/api/ai/explain')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ topic: 'Qadimgi Rim tarixi haqida gapir' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.explained).toBe(false);
      expect(res.body.data.message).toContain('Mavzu bo‘yicha tushuntirish topilmadi');
    });
  });

  // ==========================================================================
  // 2. POST /api/ai/solve — 100+ Mathematical Problems (Sub-second execution)
  // ==========================================================================
  describe('POST /api/ai/solve — 100+ Math Problems across Categories', () => {
    // 20 Arithmetic problems
    const arithmeticProblems = [
      { q: '12 + 15', ans: '27' },
      { q: '50 - 23', ans: '27' },
      { q: '7 * 8', ans: '56' },
      { q: '6 × 9', ans: '54' },
      { q: '72 / 9', ans: '8' },
      { q: '100 : 4', ans: '25' },
      { q: '25 + 75 - 30', ans: '70' },
      { q: '14 * 5 + 10', ans: '80' },
      { q: '100 - (20 + 30)', ans: '50' },
      { q: '(15 + 25) * 2', ans: '80' },
      { q: '200 / (10 * 2)', ans: '10' },
      { q: '8 * (12 - 5)', ans: '56' },
      { q: '45 + 55 / 5', ans: '56' },
      { q: '3 * 4 + 5 * 6', ans: '42' },
      { q: '2^3', ans: '8' },
      { q: 'sqrt(64)', ans: '8' },
      { q: '2 × 5 nechchi bo‘ladi?', ans: '10' },
      { q: '4 ga 5 ni qo‘sh', ans: '9' },
      { q: '20 dan 7 ni ayir', ans: '13' },
      { q: '6 bilan 8 ni ko‘paytir', ans: '48' },
    ];

    // 20 Fractions problems
    const fractionProblems = [
      { q: '1/2 + 1/4', ans: '3/4' },
      { q: '3/4 - 1/2', ans: '1/4' },
      { q: '2/3 * 3/4', ans: '1/2' },
      { q: '5/6 - 1/3', ans: '1/2' },
      { q: '2/5 + 1/10', ans: '1/2' },
      { q: '3/8 + 1/8', ans: '1/2' },
      { q: '4/5 * 5/8', ans: '1/2' },
      { q: '1/3 + 1/6', ans: '1/2' },
      { q: '7/10 - 2/10', ans: '1/2' },
      { q: '3/5 / 2/5', ans: '3/2' },
      { q: '1/4 + 2/4', ans: '3/4' },
      { q: '7/8 - 3/8', ans: '1/2' },
      { q: '1/2 + 1/3', ans: '5/6' },
      { q: '2/3 + 1/4', ans: '11/12' },
      { q: '5/7 / 5/14', ans: '2' },
      { q: '12/16 kasrni qisqartir', ans: '3/4' },
      { q: '18/24 kasrni qisqartir', ans: '3/4' },
      { q: '25/30 kasrni qisqartir', ans: '5/6' },
      { q: '7/4 aralash kasrga aylantir', ans: '1 3/4' },
      { q: '9/2 aralash kasrga aylantir', ans: '4 1/2' },
    ];

    // 20 Percentages problems
    const percentProblems = [
      { q: '15 ning 20 foizi', ans: '3' },
      { q: '200 ning 15 foizi', ans: '30' },
      { q: '50 ning 10%', ans: '5' },
      { q: '100 ning 25 foizi', ans: '25' },
      { q: '80 ning 50 foizi', ans: '40' },
      { q: '40 ning 75 foizi', ans: '30' },
      { q: '1000 ning 5 foizi', ans: '50' },
      { q: '60 ning 30 foizi', ans: '18' },
      { q: '500 ning 12 foizi', ans: '60' },
      { q: '250 ning 20 foizi', ans: '50' },
      { q: '120 ning 10 foizi', ans: '12' },
      { q: '300 ning 40 foizi', ans: '120' },
      { q: '90 ning 50 foizi', ans: '45' },
      { q: '70 ning 20 foizi', ans: '14' },
      { q: '150 ning 10 foizi', ans: '15' },
      { q: '400 ning 25 foizi', ans: '100' },
      { q: '80 ning 25 foizi', ans: '20' },
      { q: '50 ning 40 foizi', ans: '20' },
      { q: '20 ning 50 foizi', ans: '10' },
      { q: '60 ning 50 foizi', ans: '30' },
    ];

    // 20 Linear and Quadratic Equations
    const equationProblems = [
      { q: '2x + 6 = 16', ans: 'x = 5' },
      { q: '3x - 9 = 0', ans: 'x = 3' },
      { q: '5x + 10 = 35', ans: 'x = 5' },
      { q: '4x - 8 = 12', ans: 'x = 5' },
      { q: '7x = 49', ans: 'x = 7' },
      { q: 'x + 15 = 40', ans: 'x = 25' },
      { q: 'x - 20 = 50', ans: 'x = 70' },
      { q: '3x + 12 = x + 24', ans: 'x = 6' },
      { q: '5x - 4 = 2x + 11', ans: 'x = 5' },
      { q: '6x + 3 = 4x + 15', ans: 'x = 6' },
      { q: '10x - 20 = 5x + 10', ans: 'x = 6' },
      { q: '2x + 1 = 1', ans: 'x = 0' },
      { q: '-3x + 9 = 0', ans: 'x = 3' },
      { q: '8x + 16 = 0', ans: 'x = -2' },
      { q: 'x^2 - 4 = 0', ans: '2' },
      { q: 'x^2 - 9 = 0', ans: '3' },
      { q: 'x^2 - 5x + 6 = 0', ans: '2' },
      { q: 'x^2 - 7x + 12 = 0', ans: '3' },
      { q: 'x^2 - 6x + 9 = 0', ans: '3' },
      { q: 'x^2 - 16 = 0', ans: '4' },
    ];

    // 20 Word Problems, Geometry, Divisors & Powers
    const mixedProblems = [
      { q: 'To‘g‘ri to‘rtburchak a=4, b=6 yuzi', ans: '24' },
      { q: 'To‘g‘ri to‘rtburchak a=5, b=8 perimetri', ans: '26' },
      { q: 'Kvadrat a=5 yuzi', ans: '25' },
      { q: 'Kvadrat a=6 perimetri', ans: '24' },
      { q: 'Pifagor a=3, b=4 c=?', ans: '5' },
      { q: 'Pifagor a=6, b=8 c=?', ans: '10' },
      { q: 'Pifagor a=5, b=12 c=?', ans: '13' },
      { q: 'EKUB(24, 36)', ans: '12' },
      { q: 'EKUK(12, 18)', ans: '36' },
      { q: 'EKUB(15, 25)', ans: '5' },
      { q: 'EKUK(4, 6)', ans: '12' },
      { q: '29 tub sonmi?', ans: 'Tub son' },
      { q: '30 tub sonmi?', ans: 'Murakkab son' },
      { q: '5 km necha metr', ans: '5000' },
      { q: '2500 m necha km', ans: '2.5' },
      { q: '3 soat necha minut', ans: '180' },
      { q: '4 kg necha gramm', ans: '4000' },
      { q: 'Mashina 60 km/soat tezlikda 3 soatda qancha masofa bosadi?', ans: '180' },
      { q: 'Poyezd 240 km masofani 4 soatda bosib o‘tsa, tezligi qancha?', ans: '60' },
      { q: 'Piyoda 15 km masofani 5 km/soat tezlikda necha soatda bosadi?', ans: '3' },
    ];

    const all100Problems = [
      ...arithmeticProblems,
      ...fractionProblems,
      ...percentProblems,
      ...equationProblems,
      ...mixedProblems,
    ];

    it(`100 ta turli matematik misol (jami: ${all100Problems.length} ta) 1 soniyadan tez yechiladi va to‘g‘ri chiqadi`, async () => {
      // Run batch of problems to confirm speed and accuracy
      for (const item of all100Problems) {
        const t0 = performance.now();
        const res = await request(app)
          .post('/api/ai/solve')
          .set('Authorization', `Bearer ${userToken}`)
          .send({ problem: item.q });

        const elapsedMs = performance.now() - t0;
        expect(elapsedMs).toBeLessThan(1000); // Strict sub-second constraint
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.solved).toBe(true);
        expect(res.body.data.finalAnswer).toBeTruthy();
        expect(res.body.data.finalAnswer).toContain(item.ans);

        // Reset quota for user so we can test all 100 in the loop
        aiQuotaStore.resetQuota(testUserId);
      }
    });
  });

  // ==========================================================================
  // 3. GET /api/ai/history & Quota Limits
  // ==========================================================================
  describe('GET /api/ai/history va 5/5 Kvota nazorati', () => {
    it('GET /api/ai/history foydalanuvchi suhbatlar ro‘yxatini qaytaradi', async () => {
      const res = await request(app)
        .get('/api/ai/history')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.conversations)).toBe(true);
    });

    it('5/5 bepul kvota tugaganda 429 xato qaytaradi', async () => {
      aiQuotaStore.resetQuota(testUserId);

      // Consume all 5 quota slots
      for (let i = 0; i < 5; i++) {
        const res = await request(app)
          .post('/api/ai/solve')
          .set('Authorization', `Bearer ${userToken}`)
          .send({ problem: '2 + 2' });
        expect(res.status).toBe(200);
      }

      // 6th request must fail with 429 AI_QUOTA_EXCEEDED
      const failRes = await request(app)
        .post('/api/ai/solve')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ problem: '2 + 2' });

      expect(failRes.status).toBe(429);
      expect(failRes.body.success).toBe(false);
      expect(failRes.body.code).toBe('AI_QUOTA_EXCEEDED');
      expect(failRes.body.error).toContain('Bugungi 5 ta bepul AI so‘rovingiz tugadi');
    });
  });
});
