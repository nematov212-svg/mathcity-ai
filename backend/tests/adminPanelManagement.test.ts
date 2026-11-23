import request from 'supertest';
import { app } from '../src/app.js';
import { mathQuestionBank, getActiveQuestions } from '../src/utils/questionBank.js';

describe('MathCity AI — Complete Admin Panel Management System Tests', () => {
  let adminToken: string;
  let studentToken: string;

  beforeAll(async () => {
    // 1. Create a regular student to test unauthorized access
    const regRes = await request(app).post('/api/auth/register').send({
      email: 'student_tester@mathcity.ai',
      username: 'student_tester',
      password: 'student_password_123',
      confirmPassword: 'student_password_123',
      displayName: 'Student Tester',
      dateOfBirth: '2014-06-15',
    });
    studentToken = regRes.body.data.token;
  });

  describe('1. Admin Authentication & Role Protection', () => {
    it('Rejects invalid administrator credentials', async () => {
      const res = await request(app).post('/api/admin/login').send({
        username: 'mirzobek',
        password: 'wrong_password_999',
      });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('Successfully authenticates with development credentials: mirzobek / mirzobek', async () => {
      const res = await request(app).post('/api/admin/login').send({
        username: 'mirzobek',
        password: 'mirzobek',
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.role).toBe('SUPER_ADMIN');
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.mustChangePassword).toBe(true); // First login security requirement
      adminToken = res.body.data.token;
    });

    it('Strictly denies ordinary student accounts from accessing admin endpoints', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${studentToken}`);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('Allows changing admin password to a strong new password', async () => {
      const res = await request(app)
        .post('/api/admin/change-password')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          oldPassword: 'mirzobek',
          newPassword: 'MyNewSecureAdminPass2026!',
        });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.mustChangePassword).toBe(false);
      adminToken = res.body.data.token;
    });
  });

  describe('2. Question Bank Zero State & Clean Reset', () => {
    it('Verifies initial active question bank has exactly 0 questions', async () => {
      // In clean state
      const res = await request(app)
        .get('/api/admin/questions')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(0);
      expect(res.body.kidsCount).toBe(0);
      expect(res.body.teensCount).toBe(0);
      expect(res.body.data.length).toBe(0);
    });
  });

  describe('3. Kids vs Teens Question Bank Segregation', () => {
    let kidsQuestionId: string;
    let teensQuestionId: string;

    it('Admin creates a Kids question (Grade 3) with full metadata and published status', async () => {
      const res = await request(app)
        .post('/api/admin/questions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          audience: 'KIDS',
          grade: 3,
          subject: 'Matematika',
          topic: 'Ko‘paytirish jadvali',
          difficulty: 'EASY',
          type: 'MULTIPLE_CHOICE',
          prompt: '4 × 6 nechiga teng?',
          correctAnswer: '24',
          options: ['20', '22', '24', '28'],
          explanation: '4 ni 6 ga ko‘paytirsak 24 bo‘ladi.',
          rewardXP: 10,
          rewardCoins: 1,
          status: 'PUBLISHED',
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.audience).toBe('KIDS');
      expect(res.body.data.isPublished).toBe(true);
      kidsQuestionId = res.body.data.id;
    });

    it('Admin creates an O‘smirlar (Teens) algebra question (Grade 7)', async () => {
      const res = await request(app)
        .post('/api/admin/questions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          audience: 'TEEN',
          grade: 7,
          subject: 'Algebra',
          topic: 'Chiziqli tenglamalar',
          difficulty: 'MEDIUM',
          type: 'EQUATION_SOLVE',
          prompt: '2x + 6 = 16 tenglamani yeching.',
          formulaLatex: '2x + 6 = 16',
          correctAnswer: 'x = 5',
          options: ['x = 4', 'x = 5', 'x = 6'],
          explanation: '2x = 16 - 6 => 2x = 10 => x = 5.',
          rewardXP: 20,
          rewardCoins: 2,
          status: 'PUBLISHED',
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.audience).toBe('KIDS');
      teensQuestionId = res.body.data.id;
    });

    it('Grade query returns questions matching the requested grade', async () => {
      const res = await request(app)
        .get('/api/admin/questions')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ grade: 3 });
      expect(res.status).toBe(200);
      expect(res.body.data.some((q: any) => q.id === kidsQuestionId)).toBe(true);
      expect(res.body.data.some((q: any) => q.id === teensQuestionId)).toBe(false);
    });

    it('Grade 7 query returns the Grade 7 question', async () => {
      const res = await request(app)
        .get('/api/admin/questions')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ grade: 7 });
      expect(res.status).toBe(200);
      expect(res.body.data.some((q: any) => q.id === teensQuestionId)).toBe(true);
      expect(res.body.data.some((q: any) => q.id === kidsQuestionId)).toBe(false);
    });

    it('Allows unpublishing (setting to draft) and re-publishing question', async () => {
      const unpubRes = await request(app)
        .patch(`/api/admin/questions/${kidsQuestionId}/unpublish`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(unpubRes.status).toBe(200);
      expect(unpubRes.body.data.isPublished).toBe(false);
      expect(unpubRes.body.data.status).toBe('DRAFT');

      const pubRes = await request(app)
        .patch(`/api/admin/questions/${kidsQuestionId}/publish`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(pubRes.status).toBe(200);
      expect(pubRes.body.data.isPublished).toBe(true);
    });
  });

  describe('4. Lesson Management & Publishing Workflow', () => {
    let createdLessonId: string;

    it('Admin creates a draft lesson with worked examples and formula', async () => {
      const res = await request(app)
        .post('/api/admin/lessons')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Oddiy kasrlar va ularning tushunchasi',
          audience: 'TEEN',
          grade: 5,
          subject: 'Arifmetika',
          topic: 'Kasrlar',
          description: 'Ushbu darsda o‘quvchilar kasrlar asoslarini o‘rganadilar.',
          contentMd: '## Kasrlar haqida\n\nSurat va maxraj tushunchasi.',
          formulaLatex: '\\frac{a}{b}',
          rewardCoins: 10,
          rewardXP: 50,
          status: 'DRAFT',
          examples: [
            {
              id: 'ex-01',
              title: 'Misol 1',
              problem: '1/3 + 1/3 ni hisoblang',
              solution: 'Maxrajlar teng, suratlarni qo‘shamiz: 2/3',
            },
          ],
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('DRAFT');
      createdLessonId = res.body.data.id;
    });

    it('Draft lesson is HIDDEN from ordinary student lesson API', async () => {
      const res = await request(app)
        .get('/api/lessons')
        .set('Authorization', `Bearer ${studentToken}`)
        .query({ mode: 'TEEN', grade: 5 });
      expect(res.status).toBe(200);
      const containsDraft = res.body.data.some((l: any) => l.id === createdLessonId);
      expect(containsDraft).toBe(false);
    });

    it('Admin publishes the lesson and it becomes immediately visible to students', async () => {
      const pubRes = await request(app)
        .patch(`/api/admin/lessons/${createdLessonId}/publish`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(pubRes.status).toBe(200);

      const studentRes = await request(app)
        .get('/api/lessons')
        .set('Authorization', `Bearer ${studentToken}`)
        .query({ mode: 'TEEN', grade: 5 });
      expect(studentRes.status).toBe(200);
      const isVisible = studentRes.body.data.some((l: any) => l.id === createdLessonId);
      expect(isVisible).toBe(true);
    });
  });

  describe('5. Real Student Registrations & Analytics', () => {
    it('Fetches real registered students list with masked email for privacy', async () => {
      const res = await request(app)
        .get('/api/admin/students')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      const student = res.body.data.find((s: any) => s.username === 'student_tester');
      expect(student).toBeDefined();
      expect(student.maskedEmail).toContain('***@');
    });

    it('Fetches real-time student statistics for Tashkent day boundary', async () => {
      const res = await request(app)
        .get('/api/admin/students/stats')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.totalRegistered).toBeGreaterThan(0);
      expect(res.body.data.kidsCount).toBeGreaterThanOrEqual(0);
      expect(res.body.data.teensCount).toBeGreaterThanOrEqual(0);
    });

    it('Admin audit logs record operations', async () => {
      const res = await request(app)
        .get('/api/admin/audit-logs')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.total).toBeGreaterThan(0);
    });
  });
});
