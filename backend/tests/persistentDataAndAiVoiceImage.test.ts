import request from 'supertest';
import { app } from '../src/app.js';
import { repository, UserAccount } from '../src/utils/repository.js';
import { MathUnderstandingEngine } from '../src/utils/mathUnderstandingEngine.js';
import { backupPostgresDatabase } from '../src/db/backupPostgres.js';
import { randomUUID } from 'crypto';

describe('A & B: Persistent Data, Unified Auth, AI Voice & Image Multimodal', () => {
  const testUserId = `test-user-${Date.now()}`;
  const testEmail = `pers_test_${Date.now()}@mathcity.ai`;
  let testUserToken = '';

  beforeAll(async () => {
    // 1. Create test user via /api/auth/register
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: testEmail,
        password: 'Password123!',
        displayName: 'Test O‘quvchi',
        dateOfBirth: '2014-06-15',
        grade: 5,
        username: `pers_${Date.now().toString().slice(-6)}`,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.avatarUrl).toBeDefined();
    testUserToken = res.body.data.token;
  });

  describe('A: Data Persistence and Unified User State', () => {
    it('A1: GET /api/auth/me returns complete profile, avatarUrl, coins, XP, and streak', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const user = res.body.data;
      expect(user.email).toBe(testEmail.toLowerCase());
      expect(user.avatarUrl).toBeDefined();
      expect(user.coinBalance).toBeDefined();
      expect(user.totalXP).toBeDefined();
      expect(user.completedLessons).toBeDefined();
      expect(Array.isArray(user.completedLessons)).toBe(true);
    });

    it('A2: PATCH /api/students/avatar updates avatar and persists without disappearing', async () => {
      const newAvatar = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP...';
      const patchRes = await request(app)
        .patch('/api/students/avatar')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({ avatarUrl: newAvatar });

      expect(patchRes.status).toBe(200);
      expect(patchRes.body.success).toBe(true);
      expect(patchRes.body.data.avatarUrl).toBeDefined();

      // Verify on /me
      const meRes = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(meRes.body.data.avatarUrl).toBe(patchRes.body.data.avatarUrl);
    });

    it('A3: Completing a lesson persists progress and rewards in central repository', async () => {
      const lessonId = repository.getLessons()[0]?.id || 'lesson-g3-addsub';
      const lessonRes = await request(app)
        .post(`/api/lessons/${lessonId}/complete`)
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(lessonRes.status).toBe(200);
      expect(lessonRes.body.success).toBe(true);

      // Verify on /me that completedLessons contains the completed lesson
      const meRes = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(meRes.body.data.completedLessons).toContain(lessonId);
      expect(meRes.body.data.completedLessonsCount).toBeGreaterThanOrEqual(1);
    });

    it('A4: Database backup function executes safely', async () => {
      const backupResult = await backupPostgresDatabase();
      expect(backupResult).toBeDefined();
      expect(typeof backupResult.success).toBe('boolean');
    });
  });

  describe('B: AI Ustoz Voice & Natural Math Understanding', () => {
    it('B1: "5 ga 6 ni qo\'shib ber" -> 5 + 6 = 11', () => {
      const res = MathUnderstandingEngine.solve("5 ga 6 ni qo'shib ber");
      expect(res.success).toBe(true);
      expect(res.shortAnswer).toBe('11');
    });

    it('B2: "beshga oltini qo\'shib bir" -> 5 + 6 = 11 (spoken "bir" = "ber")', () => {
      const res = MathUnderstandingEngine.solve("beshga oltini qo'shib bir");
      expect(res.success).toBe(true);
      expect(res.shortAnswer).toBe('11');
    });

    it('B3: "o\'n ikki ko\'paytirish uch" -> 12 * 3 = 36', () => {
      const res = MathUnderstandingEngine.solve("o'n ikki ko'paytirish uch");
      expect(res.success).toBe(true);
      expect(res.shortAnswer).toBe('36');
    });

    it('B4: "sakkizni ikkiga bo\'l" -> 8 / 2 = 4', () => {
      const res = MathUnderstandingEngine.solve("sakkizni ikkiga bo'l");
      expect(res.success).toBe(true);
      expect(res.shortAnswer).toBe('4');
    });

    it('B5: "ildiz ostida 16" and "kvadrat ildiz 64" -> 4 and 8', () => {
      const r16 = MathUnderstandingEngine.solve('ildiz ostida 16');
      expect(r16.success).toBe(true);
      expect(r16.shortAnswer).toBe('4');

      const r64 = MathUnderstandingEngine.solve('kvadrat ildiz 64');
      expect(r64.success).toBe(true);
      expect(r64.shortAnswer).toBe('8');
    });

    it('B6: "yuzning yigirma foizi" -> 20', () => {
      const res = MathUnderstandingEngine.solve('yuzning yigirma foizi');
      expect(res.success).toBe(true);
      expect(res.shortAnswer).toBe('20');
    });

    it('B7: Russian verbal numbers: "пять плюс шесть" -> 11', () => {
      const res = MathUnderstandingEngine.solve('пять плюс шесть');
      expect(res.success).toBe(true);
      expect(res.shortAnswer).toBe('11');
    });

    it('B8: POST /api/ai/ask endpoint accepts multimodal questions with steps and answers', async () => {
      const askRes = await request(app)
        .post('/api/ai/ask')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({
          message: '25 ni 4 ga ko‘paytirib ber',
        });

      expect(askRes.status).toBe(200);
      expect(askRes.body.success).toBe(true);
      expect(askRes.body.data.reply).toBeDefined();
      expect(askRes.body.data.shortAnswer).toBe('100');
    });
  });
});
