import request from 'supertest';
import { app } from '../src/app.js';
import { repository } from '../src/utils/repository.js';

describe('Block 9: Admin Lessons CRUD, Immediate Visibility & Student Block/Unblock', () => {
  let adminToken: string;
  let studentToken: string;
  let studentId: string;
  let createdLessonId: string;

  beforeAll(async () => {
    // 1. Admin login to get JWT
    const adminRes = await request(app)
      .post('/api/admin/login')
      .send({ username: 'mirzobek', password: 'mirzobek' });

    expect(adminRes.status).toBe(200);
    expect(adminRes.body.success).toBe(true);
    adminToken = adminRes.body.data.token;
    expect(adminToken).toBeDefined();

    // 2. Register a student user
    const uniqueEmail = `test_student_${Date.now()}@mathcity.ai`;
    const studentRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: uniqueEmail,
        password: 'Password123!',
        displayName: 'Test O‘quvchi',
        dateOfBirth: '2015-05-10',
      });

    expect(studentRes.status).toBe(201);
    expect(studentRes.body.success).toBe(true);
    studentToken = studentRes.body.data.token;
    studentId = studentRes.body.data.user.id;
  });

  describe('1. Security & RBAC: Student Token Denied on Admin Endpoints (403)', () => {
    it('should reject unauthenticated request on /api/admin/lessons with 401', async () => {
      const res = await request(app).get('/api/admin/lessons');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject student JWT token on /api/admin/lessons with 403', async () => {
      const res = await request(app)
        .get('/api/admin/lessons')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.toLowerCase()).toContain('ruxsat');
    });

    it('should reject student JWT token on /api/admin/students with 403', async () => {
      const res = await request(app)
        .get('/api/admin/students')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('2. Lesson Management: Create, Read, Update, Publish/Unpublish, Delete', () => {
    it('POST /api/admin/lessons creates a full lesson with exercises and returns 201', async () => {
      const payload = {
        title: 'Oddiy kasrlarni ko‘paytirish sirlari',
        audience: 'KIDS',
        grade: 4,
        subject: 'Kasrlar',
        icon: '½',
        accentColor: '#6C47FF',
        orderIndex: 5,
        description: 'Kasrlarni bir-biriga ko‘paytirish qoidalari.',
        contentMd: 'Suratni suratga, maxrajni maxrajga ko‘paytiramiz.',
        formulaLatex: '\\frac{a}{b} \\times \\frac{c}{d} = \\frac{a \\times c}{b \\times d}',
        rewardXP: 100,
        rewardCoins: 15,
        status: 'PUBLISHED',
        examples: [
          {
            id: 'ex-01',
            title: 'Misol 1',
            problem: '1/2 * 3/4 ni hisoblang',
            solution: '(1*3)/(2*4) = 3/8',
          },
        ],
        exercises: [
          {
            prompt: '1/3 * 2/5 = ?',
            options: ['2/15', '3/8', '2/8', '5/15'],
            correctAnswer: '2/15',
            explanation: '1*2=2, 3*5=15 -> 2/15',
          },
          {
            prompt: '2/3 * 3/4 = ?',
            options: ['6/12', '1/2', '5/7', '6/7'],
            correctAnswer: '1/2',
            explanation: '6/12 qisqaradi va 1/2 bo‘ladi',
          },
        ],
      };

      const res = await request(app)
        .post('/api/admin/lessons')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(payload.title);
      expect(res.body.data.icon).toBe('½');
      expect(res.body.data.accentColor).toBe('#6C47FF');
      expect(res.body.data.sections[0].questions.length).toBe(2);

      createdLessonId = res.body.data.id;
      expect(createdLessonId).toBeDefined();
    });

    it('GET /api/lessons (client) immediately returns the newly added lesson', async () => {
      const res = await request(app)
        .get('/api/lessons')
        .query({ mode: 'ALL' })
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const found = res.body.data.find((l: any) => l.id === createdLessonId);
      expect(found).toBeDefined();
      expect(found.title).toBe('Oddiy kasrlarni ko‘paytirish sirlari');
      expect(found.icon).toBe('½');
      expect(found.rewardCoins).toBe(15);
      expect(found.rewardXP).toBe(100);
    });

    it('PUT /api/admin/lessons/:id updates the lesson details and exercises', async () => {
      const updates = {
        title: 'Oddiy kasrlarni ko‘paytirish va bo‘lish',
        description: 'Ko‘paytirish hamda bo‘lish amallari.',
        rewardCoins: 20,
        rewardXP: 120,
        icon: '×',
        accentColor: '#059669',
      };

      const res = await request(app)
        .put(`/api/admin/lessons/${createdLessonId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updates);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const checkRes = await request(app)
        .get(`/api/admin/lessons/${createdLessonId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(checkRes.status).toBe(200);
      expect(checkRes.body.data.title).toBe(updates.title);
      expect(checkRes.body.data.description).toBe(updates.description);
      expect(checkRes.body.data.rewardCoins).toBe(20);
      expect(checkRes.body.data.rewardXP).toBe(120);
      expect(checkRes.body.data.icon).toBe('×');
    });

    it('PATCH /api/admin/lessons/:id/unpublish hides the lesson from clients', async () => {
      const unpubRes = await request(app)
        .patch(`/api/admin/lessons/${createdLessonId}/unpublish`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(unpubRes.status).toBe(200);
      expect(unpubRes.body.success).toBe(true);

      // Verify client GET /api/lessons does NOT return the draft lesson
      const clientRes = await request(app)
        .get('/api/lessons')
        .query({ mode: 'ALL' })
        .set('Authorization', `Bearer ${studentToken}`);

      const found = clientRes.body.data.find((l: any) => l.id === createdLessonId);
      expect(found).toBeUndefined();
    });

    it('PATCH /api/admin/lessons/:id/publish republishes the lesson', async () => {
      const pubRes = await request(app)
        .patch(`/api/admin/lessons/${createdLessonId}/publish`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(pubRes.status).toBe(200);
      expect(pubRes.body.success).toBe(true);

      const clientRes = await request(app)
        .get('/api/lessons')
        .query({ mode: 'ALL' })
        .set('Authorization', `Bearer ${studentToken}`);

      const found = clientRes.body.data.find((l: any) => l.id === createdLessonId);
      expect(found).toBeDefined();
    });

    it('DELETE /api/admin/lessons/:id deletes the lesson completely', async () => {
      const delRes = await request(app)
        .delete(`/api/admin/lessons/${createdLessonId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(delRes.status).toBe(200);
      expect(delRes.body.success).toBe(true);

      const checkRes = await request(app)
        .get(`/api/admin/lessons/${createdLessonId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(checkRes.status).toBe(404);
    });
  });

  describe('3. Student Management: List, Block & Unblock', () => {
    it('GET /api/admin/students returns list of students with isBlocked field', async () => {
      const res = await request(app)
        .get('/api/admin/students')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);

      const studentEntry = res.body.data.find((s: any) => s.id === studentId);
      expect(studentEntry).toBeDefined();
      expect(studentEntry.isBlocked).toBe(false);
    });

    it('PATCH /api/admin/students/:id/block blocks the student account', async () => {
      const res = await request(app)
        .patch(`/api/admin/students/${studentId}/block`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isBlocked).toBe(true);

      // Verify that student is blocked from accessing protected APIs
      const studentApiRes = await request(app)
        .get('/api/lessons')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(studentApiRes.status).toBe(403);
      expect(studentApiRes.body.errorCode).toBe('ACCOUNT_BLOCKED');
      expect(studentApiRes.body.error).toContain('bloklangan');
    });

    it('PATCH /api/admin/students/:id/unblock restores access for the student', async () => {
      const res = await request(app)
        .patch(`/api/admin/students/${studentId}/unblock`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isBlocked).toBe(false);

      // Verify that student can now access protected APIs
      const studentApiRes = await request(app)
        .get('/api/lessons')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(studentApiRes.status).toBe(200);
      expect(studentApiRes.body.success).toBe(true);
    });
  });
});
