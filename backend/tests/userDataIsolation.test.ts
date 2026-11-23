import request from 'supertest';
import { app } from '../src/app.js';
import { repository } from '../src/utils/repository.js';

describe('Task 8 — Complete User Data Isolation Tests', () => {
  let tokenUser1: string;
  let tokenUser2: string;
  let user1Id: string;
  let user2Id: string;

  beforeAll(async () => {
    // 1. Register User 1 (Alisher)
    const res1 = await request(app).post('/api/auth/register').send({
      email: 'user_alisher@mathcity.ai',
      password: 'StrongPassword123!',
      displayName: 'Alisher Navoiy',
      dateOfBirth: '2015-02-09',
      grade: 4,
    });
    expect(res1.status).toBe(201);
    tokenUser1 = res1.body.data.token;
    user1Id = res1.body.data.user.id;

    // 2. Register User 2 (Bobur)
    const res2 = await request(app).post('/api/auth/register').send({
      email: 'user_bobur@mathcity.ai',
      password: 'StrongPassword123!',
      displayName: 'Zahiriddin Bobur',
      dateOfBirth: '2014-02-14',
      grade: 5,
    });
    expect(res2.status).toBe(201);
    tokenUser2 = res2.body.data.token;
    user2Id = res2.body.data.user.id;
  });

  describe('1. Brand New User Initial State (Zero Baseline)', () => {
    it('initializes both users with exactly 0 coins and 0 XP', async () => {
      const res1 = await request(app)
        .get('/api/coins/balance')
        .set('Authorization', `Bearer ${tokenUser1}`);
      expect(res1.status).toBe(200);
      expect(res1.body.data.balance).toBe(0);

      const res2 = await request(app)
        .get('/api/coins/balance')
        .set('Authorization', `Bearer ${tokenUser2}`);
      expect(res2.status).toBe(200);
      expect(res2.body.data.balance).toBe(0);
    });

    it('initializes both users with empty completed lessons and non-pro subscriptions', async () => {
      const u1 = repository.getUserById(user1Id);
      const u2 = repository.getUserById(user2Id);

      expect(u1).toBeDefined();
      expect(u2).toBeDefined();
      expect(u1!.completedLessons).toEqual([]);
      expect(u2!.completedLessons).toEqual([]);
      expect(u1!.totalXP).toBe(0);
      expect(u2!.totalXP).toBe(0);

      const sub1 = repository.getSubscription(user1Id);
      const sub2 = repository.getSubscription(user2Id);
      expect(sub1.isProActive).toBe(false);
      expect(sub2.isProActive).toBe(false);
    });
  });

  describe('2. Lesson Progress & Coin Isolation', () => {
    const lessonId1 = 'lesson-g4-01';
    const lessonId2 = 'lesson-g4-02';

    it('User 1 completes a lesson: User 1 gains coins/XP, User 2 remains completely untouched', async () => {
      // User 1 completes lesson 1
      const completeRes = await request(app)
        .post(`/api/lessons/${lessonId1}/complete`)
        .set('Authorization', `Bearer ${tokenUser1}`);

      expect(completeRes.status).toBe(200);
      expect(completeRes.body.success).toBe(true);
      expect(completeRes.body.data.isFirstCompletion).toBe(true);
      expect(completeRes.body.data.coinsAwarded).toBeGreaterThan(0);
      expect(completeRes.body.data.xpAwarded).toBeGreaterThan(0);

      const user1CoinsAfter = completeRes.body.data.coinBalance;
      const user1XPAfter = completeRes.body.data.totalXP;
      expect(user1CoinsAfter).toBeGreaterThan(0);
      expect(user1XPAfter).toBeGreaterThan(0);

      // Verify in-memory/DB state for User 1
      const user1InDb = repository.getUserById(user1Id);
      expect(user1InDb!.completedLessons).toContain(lessonId1);
      expect(user1InDb!.coinBalance).toBe(user1CoinsAfter);
      expect(user1InDb!.totalXP).toBe(user1XPAfter);

      // CRITICAL ASSERTION: User 2 state must be COMPLETELY UNTOUCHED!
      const user2InDb = repository.getUserById(user2Id);
      expect(user2InDb!.completedLessons).toEqual([]);
      expect(user2InDb!.coinBalance).toBe(0);
      expect(user2InDb!.totalXP).toBe(0);

      // Verify via User 2 API call
      const resUser2Coins = await request(app)
        .get('/api/coins/balance')
        .set('Authorization', `Bearer ${tokenUser2}`);
      expect(resUser2Coins.status).toBe(200);
      expect(resUser2Coins.body.data.balance).toBe(0);
    });

    it('User 2 completes a different lesson: records stay strictly isolated', async () => {
      // User 2 completes lesson 2
      const completeRes2 = await request(app)
        .post(`/api/lessons/${lessonId2}/complete`)
        .set('Authorization', `Bearer ${tokenUser2}`);

      expect(completeRes2.status).toBe(200);
      expect(completeRes2.body.data.isFirstCompletion).toBe(true);
      expect(completeRes2.body.data.coinBalance).toBeGreaterThan(0);

      const user1InDb = repository.getUserById(user1Id);
      const user2InDb = repository.getUserById(user2Id);

      // User 1 has only lesson 1
      expect(user1InDb!.completedLessons).toContain(lessonId1);
      expect(user1InDb!.completedLessons).not.toContain(lessonId2);

      // User 2 has only lesson 2
      expect(user2InDb!.completedLessons).toContain(lessonId2);
      expect(user2InDb!.completedLessons).not.toContain(lessonId1);
    });
  });

  describe('3. Practice Answers & Quotas Isolation', () => {
    it('User 1 solving an exercise does not affect User 2 daily missions or scores', async () => {
      const questionId = 'g3-s1-q1'; // 12 + 6 = 18

      const submitRes = await request(app)
        .post('/api/practice/submit')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send({ questionId, answer: '18' });

      expect(submitRes.status).toBe(200);
      expect(submitRes.body.data.isCorrect).toBe(true);

      const u1 = repository.getUserById(user1Id);
      const u2 = repository.getUserById(user2Id);

      expect(u1!.solvedQuestions).toContain(questionId);
      expect(u2!.solvedQuestions).not.toContain(questionId);
    });
  });

  describe('4. MathCity Pro Subscription Isolation', () => {
    it('User 1 activating Pro leaves User 2 strictly on Free status', async () => {
      // Activate Pro for User 1 via payments order
      const orderRes = await request(app)
        .post('/api/payments/create-order')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send({
          planType: 'MONTHLY',
          amount: 29000,
          provider: 'CLICK',
        });

      expect(orderRes.status).toBe(200);
      const orderId = orderRes.body.data.orderId;

      const confirmRes = await request(app)
        .post('/api/payments/confirm-order')
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send({
          orderId,
          transactionId: 'click_tx_test_user1_99',
        });

      expect(confirmRes.status).toBe(200);
      expect(confirmRes.body.data.isProActive).toBe(true);

      // User 1 must be PRO_ACTIVE
      const sub1 = repository.getSubscription(user1Id);
      expect(sub1.isProActive).toBe(true);
      expect(sub1.status).toBe('PRO_ACTIVE');

      // User 2 MUST STILL BE FREE!
      const sub2 = repository.getSubscription(user2Id);
      expect(sub2.isProActive).toBe(false);
      expect(sub2.status).not.toBe('PRO_ACTIVE');

      // User 2 query via API
      const profileRes2 = await request(app)
        .get('/api/students/profile')
        .set('Authorization', `Bearer ${tokenUser2}`);

      expect(profileRes2.status).toBe(200);
      expect(profileRes2.body.data.subscription.isProActive).toBe(false);
    });
  });

  describe('5. Profile Query Endpoint Scoping', () => {
    it('JWT authentication strictly maps to the caller, never leaks another user', async () => {
      const res1 = await request(app)
        .get('/api/students/profile')
        .set('Authorization', `Bearer ${tokenUser1}`);
      expect(res1.body.data.id).toBe(user1Id);
      expect(res1.body.data.username).toBe('user_alisher');

      const res2 = await request(app)
        .get('/api/students/profile')
        .set('Authorization', `Bearer ${tokenUser2}`);
      expect(res2.body.data.id).toBe(user2Id);
      expect(res2.body.data.username).toBe('user_bobur');
    });
  });
});
