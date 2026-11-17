import request from 'supertest';
import { app } from '../src/app.js';
import crypto from 'crypto';

describe('MathCity AI — Master Test Suite: Payments, Pro Rewards, Ziyo AI & Quota', () => {
  let freeStudentToken: string;
  let freeStudentId: string;
  let proStudentToken: string;
  let proStudentId: string;
  const adminSecret = process.env.ADMIN_API_KEY || 'mathcity_admin_master_secret_2026';

  beforeAll(async () => {
    // 1. Register Free student
    const freeRes = await request(app).post('/api/auth/register').send({
      email: `free_student_${Date.now()}@mathcity.ai`,
      password: 'StrongPassword123!',
      displayName: 'Free Student',
      dateOfBirth: '2014-06-15',
    });
    freeStudentToken = freeRes.body.data.token;
    freeStudentId = freeRes.body.data.user.id;

    // 2. Register Pro student
    const proRes = await request(app).post('/api/auth/register').send({
      email: `pro_student_${Date.now()}@mathcity.ai`,
      password: 'StrongPassword123!',
      displayName: 'Pro Student',
      dateOfBirth: '2013-05-10',
    });
    proStudentToken = proRes.body.data.token;
    proStudentId = proRes.body.data.user.id;

    // Upgrade pro student via signed Click Complete or direct repository activation
    const CLICK_SECRET_KEY = process.env.CLICK_SECRET_KEY || 'mathcity_click_secret_key_mock';
    const clickTransId = `clk_pro_setup_${Date.now()}`;
    const amount = 29000;
    const signTime = '2026-11-16 12:00:05';
    const merchantPrepareId = '1001';
    const completeSign = `${clickTransId}10001${CLICK_SECRET_KEY}${proStudentId}${merchantPrepareId}${amount}1${signTime}`;
    const completeHash = crypto.createHash('md5').update(completeSign).digest('hex');

    const clickRes = await request(app).post('/api/payments/click/complete').send({
      click_trans_id: clickTransId,
      service_id: 10001,
      click_paydoc_id: 999123,
      merchant_trans_id: proStudentId,
      merchant_prepare_id: merchantPrepareId,
      amount: amount,
      action: 1,
      error: 0,
      error_note: 'Success',
      sign_time: signTime,
      sign_string: completeHash,
    });

    expect(clickRes.body.error).toBe(0);
  });

  describe('1. Free +1 vs Pro +3 Coin Rewards (Priority 4)', () => {
    it('Free student gets +1 coin per unique correct answer', async () => {
      const res = await request(app)
        .post('/api/practice/submit')
        .set('Authorization', `Bearer ${freeStudentToken}`)
        .send({
          questionId: 'q-add-01',
          answer: '12', // correct answer for 7 + 5
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isCorrect).toBe(true);
      expect(res.body.data.coinsAwarded).toBe(1); // EXACTLY +1 COIN FOR FREE
    });

    it('Paid Pro student gets +3 coins per unique correct answer', async () => {
      const res = await request(app)
        .post('/api/practice/submit')
        .set('Authorization', `Bearer ${proStudentToken}`)
        .send({
          questionId: 'q-add-01',
          answer: '12', // correct answer for 7 + 5
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isCorrect).toBe(true);
      expect(res.body.data.coinsAwarded).toBe(3); // EXACTLY +3 COINS FOR PRO!
    });

    it('Duplicate question solve awards 0 coins to prevent coin farming', async () => {
      const res = await request(app)
        .post('/api/practice/submit')
        .set('Authorization', `Bearer ${proStudentToken}`)
        .send({
          questionId: 'q-add-01', // repeating the same question
          answer: '12',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.coinsAwarded).toBe(0); // 0 extra coins on repeat
    });
  });

  describe('2. Real Ziyo AI Mathematical Solver (Priority 6)', () => {
    it('Solves linear equation "2x + 6 = 16" step by step with x = 5', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .set('Authorization', `Bearer ${freeStudentToken}`)
        .send({
          message: '2x + 6 = 16 tenglamani yech',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.finalAnswer).toBe('x = 5');
      expect(res.body.data.steps.length).toBeGreaterThanOrEqual(2);
      expect(res.body.data.reply).toContain('x = 5');
    });

    it('Solves arithmetic division "25 / 5" correctly', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .set('Authorization', `Bearer ${freeStudentToken}`)
        .send({
          message: '25 / 5',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.finalAnswer).toBe('5');
    });

    it('Solves math problem from image recognition endpoint', async () => {
      const res = await request(app)
        .post('/api/ai/solve-image')
        .set('Authorization', `Bearer ${freeStudentToken}`)
        .send({
          extractedText: '2x + 6 = 16',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.solution.finalAnswer).toBe('x = 5');
    });

    it('Solves Uzbek voice question "Yigirma beshni beshga bo‘lsak nechchi bo‘ladi"', async () => {
      const res = await request(app)
        .post('/api/ai/solve-voice')
        .set('Authorization', `Bearer ${freeStudentToken}`)
        .send({
          transcribedText: 'Yigirma beshni beshga bo‘lsak nechchi bo‘ladi',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.solution.finalAnswer).toBe('5');
    });
  });

  describe('3. Ziyo AI Quota: 5 Requests / 24 Hours for Free vs Unlimited for Pro (Priority 7 & 8)', () => {
    it('Free student quota exhausts after 5 total requests and returns 429 on 6th request', async () => {
      // Free student already used 4 requests above (eq, arith, image, voice)
      // Send 5th request: should succeed
      const res5 = await request(app)
        .post('/api/ai/chat')
        .set('Authorization', `Bearer ${freeStudentToken}`)
        .send({ message: '10 + 10' });

      expect(res5.status).toBe(200);

      // Send 6th request: MUST be blocked with 429 and localized Uzbek message
      const res6 = await request(app)
        .post('/api/ai/chat')
        .set('Authorization', `Bearer ${freeStudentToken}`)
        .send({ message: '30 + 30' });

      expect(res6.status).toBe(429);
      expect(res6.body.success).toBe(false);
      expect(res6.body.code).toBe('AI_QUOTA_EXCEEDED');
      expect(res6.body.error).toBe(
        'Bugungi 5 ta bepul AI so‘rovingiz tugadi. Limit 24 soatlik muddat asosida yangilanadi.'
      );
    });

    it('Paid Pro student has unlimited AI queries with no 429 restriction', async () => {
      for (let i = 0; i < 7; i++) {
        const res = await request(app)
          .post('/api/ai/chat')
          .set('Authorization', `Bearer ${proStudentToken}`)
          .send({ message: `${i + 1} * 2` });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
      }
    });
  });

  describe('4. Real Payment Flow & Security (Priority 1, 2, 3)', () => {
    it('Creates payment order with server-verified 29 000 UZS amount', async () => {
      const res = await request(app)
        .post('/api/payments/create-order')
        .set('Authorization', `Bearer ${freeStudentToken}`)
        .send({ paymentMethod: 'UZCARD_HUMO_CLICK' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.amountUzs).toBe(29000);
      expect(res.body.data.checkoutUrl).toContain('my.click.uz');
    });

    it('Rejects forged Click callback with invalid MD5 signature', async () => {
      const res = await request(app).post('/api/payments/click/complete').send({
        click_trans_id: 'fake_tx_123',
        service_id: 10001,
        click_paydoc_id: 888123,
        merchant_trans_id: freeStudentId,
        merchant_prepare_id: 1001,
        amount: 29000,
        action: 1,
        error: 0,
        error_note: 'Success',
        sign_time: '2026-11-16 12:00:05',
        sign_string: 'FORGED_INVALID_SIGNATURE',
      });

      expect(res.status).toBe(200);
      expect(res.body.error).toBe(-1);
      expect(res.body.error_note).toBe('SIGN CHECK FAILED');
    });

    it('Admin dashboard displays verified revenue, fees, and owner card 7821 payouts', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('x-admin-key', adminSecret);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.proSubscribers).toBeGreaterThanOrEqual(1);
      expect(res.body.data.payoutDestination.maskedCard).toContain('7821');
      expect(res.body.data.totalFeesUzs).toBeGreaterThan(0); // 2% fee
    });
  });

  describe('6. Complete Authentication, Zero-Balance & Onboarding Verification', () => {
    let appleStudentToken: string;

    it('Sign in with Apple creates new account with absolute zero progress', async () => {
      const res = await request(app).post('/api/auth/apple').send({
        appleUserId: '001928.apple.unique.sub.test',
        email: 'test_apple@privaterelay.appleid.com',
        displayName: 'AppleNewbie',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isNewUser).toBe(true);
      expect(res.body.data.user.coinBalance).toBe(0);
      expect(res.body.data.user.totalXP).toBe(0);
      expect(res.body.data.user.level).toBe(1);
      expect(res.body.data.token).toBeDefined();

      appleStudentToken = res.body.data.token;
    });

    it('Check-username endpoint validates uniqueness and format', async () => {
      // Existing username taken
      const takenRes = await request(app)
        .get('/api/auth/check-username')
        .query({ username: 'Ali' });
      expect(takenRes.status).toBe(200);
      expect(takenRes.body.data.available).toBe(false);

      // Available new username
      const availRes = await request(app)
        .get('/api/auth/check-username')
        .query({ username: 'MathHero2026' });
      expect(availRes.status).toBe(200);
      expect(availRes.body.data.available).toBe(true);
    });

    it('Complete onboarding sets username and birthdate, assigning Kids Mode (10yo)', async () => {
      const res = await request(app)
        .post('/api/auth/complete-onboarding')
        .set('Authorization', `Bearer ${appleStudentToken}`)
        .send({
          username: 'MathHero2026',
          day: 15,
          month: 5,
          year: 2016, // 10 years old
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.displayName).toBe('MathHero2026');
      expect(res.body.data.user.mode).toBe('KIDS');
      expect(res.body.data.user.coinBalance).toBe(0);
      expect(res.body.data.user.totalXP).toBe(0);
    });

    it('Test questions do not expose formulaLatex solution before submission', async () => {
      const res = await request(app)
        .get('/api/practice/test')
        .set('Authorization', `Bearer ${appleStudentToken}`)
        .query({ grade: 3, length: 10 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const questions = res.body.data.questions;
      expect(questions.length).toBe(10);
      for (const q of questions) {
        // Solution formulaLatex must NEVER be sent before grading
        expect((q as any).formulaLatex).toBeUndefined();
        expect((q as any).correctAnswer).toBeUndefined();
      }
    });
  });
});
