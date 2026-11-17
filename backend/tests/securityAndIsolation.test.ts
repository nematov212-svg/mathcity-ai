import request from 'supertest';
import { app } from '../src/app.js';
import { repository } from '../src/utils/repository.js';

describe('MathCity AI — Security, Authorization & Data Isolation Tests', () => {
  let studentAToken: string;
  let studentBToken: string;
  let studentAId: string;
  let studentBId: string;

  beforeAll(async () => {
    // 1. Register Student A (10 years old)
    const resA = await request(app).post('/api/auth/register').send({
      email: 'student_a@mathcity.ai',
      password: 'passwordA123!',
      displayName: 'Student Alpha',
      dateOfBirth: '2016-03-15',
      grade: 4,
    });
    studentAToken = resA.body.data.token;
    studentAId = resA.body.data.user.id;

    // 2. Register Student B (14 years old, Teen mode)
    const resB = await request(app).post('/api/auth/register').send({
      email: 'student_b@mathcity.ai',
      password: 'passwordB123!',
      displayName: 'Student Beta',
      dateOfBirth: '2012-08-20',
      grade: 8,
    });
    studentBToken = resB.body.data.token;
    studentBId = resB.body.data.user.id;
  });

  describe('1. Authentication & Password Security (Bcrypt)', () => {
    it('authenticates valid credentials using bcrypt', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'student_a@mathcity.ai',
        password: 'passwordA123!',
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it('rejects invalid password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'student_a@mathcity.ai',
        password: 'wrongPassword!',
      });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('enforces age boundary: 16 allowed, 17 strictly rejected', async () => {
      // 16-year-old student
      const res16 = await request(app).post('/api/auth/register').send({
        email: 'eligible16@mathcity.ai',
        password: 'password123!',
        displayName: 'Sixteen Year Old',
        dateOfBirth: '2010-06-01',
        grade: 10,
      });
      expect(res16.status).toBe(201);
      expect(res16.body.data.user.mode).toBe('TEEN');

      // 17-year-old student
      const res17 = await request(app).post('/api/auth/register').send({
        email: 'denied17@mathcity.ai',
        password: 'password123!',
        displayName: 'Seventeen Year Old',
        dateOfBirth: '2009-01-01',
        grade: 11,
      });
      expect(res17.status).toBe(403);
      expect(res17.body.errorCode).toBe('ELIGIBILITY_FAILED');
    });

    it('Google Sign-In initializes new account with 0 coins and 0 XP, and preserves existing data', async () => {
      // 1. New Google user
      const googleRes1 = await request(app).post('/api/auth/google').send({
        googleId: 'google-sub-998877',
        email: 'new_google_student@mathcity.ai',
        displayName: 'Google Student',
        dateOfBirth: '2015-05-15',
      });

      expect(googleRes1.status).toBe(200);
      expect(googleRes1.body.success).toBe(true);
      expect(googleRes1.body.data.user.coinBalance).toBe(0);
      expect(googleRes1.body.data.user.totalXP).toBe(0);
      const studentId = googleRes1.body.data.user.id;

      // 2. Student earns 5 coins
      const userInDb = repository.getUserById(studentId);
      if (userInDb) {
        userInDb.coinBalance = 5;
        userInDb.totalXP = 50;
      }

      // 3. Second Google Login: preserves existing coins and XP
      const googleRes2 = await request(app).post('/api/auth/google').send({
        googleId: 'google-sub-998877',
        email: 'new_google_student@mathcity.ai',
        displayName: 'Google Student',
      });

      expect(googleRes2.status).toBe(200);
      expect(googleRes2.body.data.user.id).toBe(studentId);
      expect(googleRes2.body.data.user.coinBalance).toBe(5);
      expect(googleRes2.body.data.user.totalXP).toBe(50);
    });
  });

  describe('2. Strict Student Data Isolation (Phase 6)', () => {
    it('Student B cannot access Student A’s profile data', async () => {
      // Student A updates profile
      await request(app)
        .put('/api/students/profile')
        .set('Authorization', `Bearer ${studentAToken}`)
        .send({ displayName: 'Alpha Secret Name' });

      // Student B queries /api/students/profile
      const resB = await request(app)
        .get('/api/students/profile')
        .set('Authorization', `Bearer ${studentBToken}`);

      expect(resB.status).toBe(200);
      // Student B strictly sees Student B, NOT Student A
      expect(resB.body.data.id).toBe(studentBId);
      expect(resB.body.data.displayName).toBe('Student Beta');
      expect(resB.body.data.email).toBe('student_b@mathcity.ai');
    });

    it('Student B cannot access Student A’s coin wallet or modify it', async () => {
      const resB = await request(app)
        .get('/api/coins/balance')
        .set('Authorization', `Bearer ${studentBToken}`);

      expect(resB.status).toBe(200);
      expect(resB.body.data.balance).toBe(0); // New accounts start from absolute zero
    });

    it('Student B cannot access Student A’s city island', async () => {
      // Grant Student A 100 coins to purchase building
      repository.creditCoins(studentAId, 100, 'Test building funds');

      // Student A places a building at (0, 0)
      await request(app)
        .post('/api/city/purchase')
        .set('Authorization', `Bearer ${studentAToken}`)
        .send({ buildingKey: 'house_basic', gridX: 0, gridY: 0 });

      // Student B checks city
      const resB = await request(app)
        .get('/api/city')
        .set('Authorization', `Bearer ${studentBToken}`);

      expect(resB.status).toBe(200);
      // Student B's city does NOT contain Student A's building at (0, 0)
      const hasStudentABuilding = resB.body.data.placedBuildings.some(
        (b: any) => b.gridX === 0 && b.gridY === 0
      );
      expect(hasStudentABuilding).toBe(false);
    });
  });

  describe('3. Coin & XP Reward Security (Phase 7 & 8)', () => {
    it('awards exactly 1 coin for unique correct answer and 0 for repeats', async () => {
      const questionId = 'g3-s1-q1'; // "12 + 6 = ?" -> "18"

      // Initial balance check
      const initialRes = await request(app)
        .get('/api/coins/balance')
        .set('Authorization', `Bearer ${studentBToken}`);
      const initialCoins = initialRes.body.data.balance;

      // 1. First solve: correct answer "18"
      const res1 = await request(app)
        .post('/api/practice/submit')
        .set('Authorization', `Bearer ${studentBToken}`)
        .send({ questionId, answer: '18' });

      expect(res1.status).toBe(200);
      expect(res1.body.data.isCorrect).toBe(true);
      expect(res1.body.data.coinsAwarded).toBe(1);
      expect(res1.body.data.newCoinBalance).toBe(initialCoins + 1);

      // 2. Repeat solve of same question: correct answer "18"
      const res2 = await request(app)
        .post('/api/practice/submit')
        .set('Authorization', `Bearer ${studentBToken}`)
        .send({ questionId, answer: '18' });

      expect(res2.status).toBe(200);
      expect(res2.body.data.isCorrect).toBe(true);
      // STRICT ANTI-FARMING: EXACTLY 0 extra coins!
      expect(res2.body.data.coinsAwarded).toBe(0);
      expect(res2.body.data.newCoinBalance).toBe(initialCoins + 1);
    });
  });

  describe('4. Subscription Security & Purchase Replay Protection (Phase 10)', () => {
    it('prevents purchase token reuse across multiple students', async () => {
      const uniqueToken = 'google_play_token_xyz_998877';

      // Student A claims purchase token
      const resA = await request(app)
        .post('/api/subscriptions/purchase')
        .set('Authorization', `Bearer ${studentAToken}`)
        .send({
          platform: 'google_play',
          orderId: 'GPA.1234-5678-9012-34567',
          purchaseToken: uniqueToken,
        });

      expect(resA.status).toBe(200);
      expect(resA.body.data.status).toBe('PRO_ACTIVE');

      // Student B attempts to replay the same purchase token to steal Pro entitlement
      const resB = await request(app)
        .post('/api/subscriptions/purchase')
        .set('Authorization', `Bearer ${studentBToken}`)
        .send({
          platform: 'google_play',
          orderId: 'GPA.1234-5678-9012-34567',
          purchaseToken: uniqueToken,
        });

      // Rejected with Conflict/Forbidden
      expect(resB.status).toBe(409);
      expect(resB.body.success).toBe(false);
      expect(resB.body.error).toContain('ishlatilgan');
    });
  });

  describe('5. Health Probes (Phase 14)', () => {
    it('GET /health/live returns 200 alive', async () => {
      const res = await request(app).get('/health/live');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('alive');
    });

    it('GET /health/ready returns 200 ready', async () => {
      const res = await request(app).get('/health/ready');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ready');
    });
  });
});
