import request from 'supertest';
import { app } from '../src/app.js';
import crypto from 'crypto';

describe('MathCity AI — Master Prompt V6 Features Verification', () => {
  let studentToken: string;
  let studentId: string;
  const adminSecret = process.env.ADMIN_API_KEY || 'mathcity_admin_master_secret_2026';

  beforeAll(async () => {
    // Register a fresh student
    const regRes = await request(app).post('/api/auth/register').send({
      email: `test_v6_${Date.now()}@mathcity.ai`,
      password: 'StrongPassword123!',
      displayName: 'Test V6 Student',
      dateOfBirth: '2014-06-15',
    });
    studentToken = regRes.body.data.token;
    studentId = regRes.body.data.user.id;
  });

  describe('1. 100+ Question Bank & Test Length System', () => {
    it('serves 10 questions for Free / Trial student without exposing correctAnswer', async () => {
      const res = await request(app)
        .get('/api/practice/test?length=10')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.questions.length).toBe(10);
      expect(res.body.data.questions[0].id).toBeDefined();
      expect(res.body.data.questions[0].prompt).toBeDefined();
      // Crucial security test: correctAnswer MUST NOT be leaked to client
      expect(res.body.data.questions[0].correctAnswer).toBeUndefined();
    });

    it('allows 20 and 30 question tests when Free Trial is active', async () => {
      const res20 = await request(app)
        .get('/api/practice/test?length=20')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res20.status).toBe(200);
      expect(res20.body.data.questions.length).toBe(20);

      const res30 = await request(app)
        .get('/api/practice/test?length=30')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res30.status).toBe(200);
      expect(res30.body.data.questions.length).toBe(30);
    });

    it('grades bulk test submission and awards exact coins (+1 per unique correct question)', async () => {
      // Fetch 10 questions
      const testRes = await request(app)
        .get('/api/practice/test?length=10')
        .set('Authorization', `Bearer ${studentToken}`);

      const questions = testRes.body.data.questions;
      // Answer first 2 questions with '12' (valid for q-add-01) or random guess
      const submitRes = await request(app)
        .post('/api/practice/test/submit')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          answers: [
            { questionId: 'q-add-01', answer: '12' }, // correct
            { questionId: 'q-add-02', answer: '999' }, // incorrect
          ],
        });

      expect(submitRes.status).toBe(200);
      expect(submitRes.body.success).toBe(true);
      expect(submitRes.body.data.totalQuestions).toBe(2);
      expect(submitRes.body.data.correctCount).toBe(1);
      expect(submitRes.body.data.incorrectCount).toBe(1);
      expect(submitRes.body.data.totalCoinsAwarded).toBe(1);
    });
  });

  describe('2. Click Business Payment Integration', () => {
    const CLICK_SECRET_KEY = process.env.CLICK_SECRET_KEY || 'mathcity_click_secret_key_mock';
    const clickTransId = `clk_test_${Date.now()}`;
    const amount = 29000;
    const signString = `${clickTransId}10001${CLICK_SECRET_KEY}${studentId}1${amount}0`;
    const signHash = crypto.createHash('md5').update(signString).digest('hex');

    it('processes Click Prepare action successfully', async () => {
      const res = await request(app).post('/api/payments/click/prepare').send({
        click_trans_id: clickTransId,
        service_id: 10001,
        click_paydoc_id: 888123,
        merchant_trans_id: studentId,
        amount: amount,
        action: 0,
        error: 0,
        error_note: 'Success',
        sign_time: '2026-11-16 12:00:00',
        sign_string: signHash,
      });

      expect(res.status).toBe(200);
      expect(res.body.error).toBe(0);
      expect(res.body.merchant_prepare_id).toBeDefined();
    });

    it('processes Click Complete action and activates Pro subscription', async () => {
      const completeSign = `${clickTransId}10001${CLICK_SECRET_KEY}${studentId}1${amount}1`;
      const completeHash = crypto.createHash('md5').update(completeSign).digest('hex');

      const res = await request(app).post('/api/payments/click/complete').send({
        click_trans_id: clickTransId,
        service_id: 10001,
        click_paydoc_id: 888123,
        merchant_trans_id: studentId,
        merchant_prepare_id: 1001,
        amount: amount,
        action: 1,
        error: 0,
        error_note: 'Success',
        sign_time: '2026-11-16 12:00:05',
        sign_string: completeHash,
      });

      expect(res.status).toBe(200);
      expect(res.body.error).toBe(0);

      // Verify student subscription is now PRO_ACTIVE
      const profileRes = await request(app)
        .get('/api/students/profile')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(profileRes.body.data.subscription.status).toBe('PRO_ACTIVE');
    });
  });

  describe('3. Admin Operator Dashboard', () => {
    it('rejects unauthorized requests without admin key', async () => {
      const res = await request(app).get('/api/admin/dashboard');
      expect(res.status).toBe(401);
    });

    it('returns exact subscriber metrics and revenue for valid admin key', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('x-admin-key', adminSecret);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.proSubscribers).toBeGreaterThanOrEqual(1);
      expect(res.body.data.verifiedRevenueUzs).toBe(res.body.data.proSubscribers * 29000);
    });

    it('returns masked student list for privacy', async () => {
      const res = await request(app)
        .get('/api/admin/students')
        .set('x-admin-key', adminSecret);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].maskedEmail).toContain('***');
    });
  });
});
