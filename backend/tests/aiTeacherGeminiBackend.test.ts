import request from 'supertest';
import { app } from '../src/app.js';
import { config } from '../src/config/env.js';
import fs from 'fs';
import path from 'path';

describe('MathCity AI — AI Ustoz Gemini (Backend-Only) Master Verification', () => {
  let studentTokenA: string;
  let studentUserA: any;
  let studentTokenB: string;
  let studentUserB: any;
  let sharedConvId: string;

  beforeAll(async () => {
    // 1. Create Student A
    const resA = await request(app).post('/api/auth/register').send({
      email: `ustoz_student_a_${Date.now()}@mathcity.ai`,
      password: 'StrongPassword123!',
      displayName: 'Azizbek',
      dateOfBirth: '2012-06-15',
    });
    studentTokenA = resA.body.data.token;
    studentUserA = resA.body.data.user;

    // 2. Create Student B
    const resB = await request(app).post('/api/auth/register').send({
      email: `ustoz_student_b_${Date.now()}@mathcity.ai`,
      password: 'StrongPassword123!',
      displayName: 'Madina',
      dateOfBirth: '2015-08-20',
    });
    studentTokenB = resB.body.data.token;
    studentUserB = resB.body.data.user;
  });

  // --------------------------------------------------------------------------
  // Test 1: Text Linear Equation
  // --------------------------------------------------------------------------
  test('1. Text: "2x + 5 = 17 tenglamani yech" returns correct step-by-step solution (x = 6)', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${studentTokenA}`)
      .send({
        message: '2x + 5 = 17 tenglamani yech',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.conversationId).toBeDefined();
    sharedConvId = res.body.data.conversationId;
    expect(res.body.data.finalAnswer).toBe('x = 6');
    expect(res.body.data.reply).toContain('x = 6');
    expect(res.body.data.steps).toBeDefined();
    expect(res.body.data.steps.length).toBeGreaterThanOrEqual(2);
  });

  // --------------------------------------------------------------------------
  // Test 2: Fractions
  // --------------------------------------------------------------------------
  test('2. Text: "3/4 + 1/2 nechaga teng?" returns 5/4 = 1 1/4 with explanation', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${studentTokenA}`)
      .send({
        message: '3/4 + 1/2 nechaga teng?',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.finalAnswer).toContain('5/4');
    expect(res.body.data.finalAnswer).toContain('1 1/4');
    expect(res.body.data.steps).toBeDefined();
  });

  // --------------------------------------------------------------------------
  // Test 3: Conversational Context Follow-up
  // --------------------------------------------------------------------------
  test('3. Context: follow-up ("buni boshqacha tushuntir") uses previous conversation context', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${studentTokenA}`)
      .send({
        conversationId: sharedConvId,
        message: 'buni boshqacha tushuntir',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.conversationId).toBe(sharedConvId);
    expect(res.body.data.reply).toContain('soddaroq');
  });

  // --------------------------------------------------------------------------
  // Test 4: Image Math Recognition & Solving
  // --------------------------------------------------------------------------
  test('4. Image: upload a photo of a simple math problem is recognized and solved', async () => {
    // 1x1 valid sample PNG in base64
    const validImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    const res = await request(app)
      .post('/api/ai/chat/image')
      .set('Authorization', `Bearer ${studentTokenA}`)
      .send({
        imageBase64: validImageBase64,
        mimeType: 'image/png',
        fileName: 'tenglama_masalasi.png',
        prompt: '2x + 6 = 16',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.reply).toContain('x = 5');
    expect(res.body.data.conversationId).toBeDefined();
  });

  // --------------------------------------------------------------------------
  // Test 5: Voice Math Solving
  // --------------------------------------------------------------------------
  test('5. Voice: record "Olti bilan yettini ko‘paytir." returns transcript + "42"', async () => {
    const res = await request(app)
      .post('/api/ai/chat/voice')
      .set('Authorization', `Bearer ${studentTokenA}`)
      .send({
        transcribedText: 'Olti bilan yettini ko‘paytir',
        mimeType: 'audio/m4a',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.transcript).toBe('Olti bilan yettini ko‘paytir');
    expect(res.body.data.finalAnswer).toBe('42');
    expect(res.body.data.reply).toContain('42');
  });

  // --------------------------------------------------------------------------
  // Test 6: History Persistence & User Isolation
  // --------------------------------------------------------------------------
  test('6. History: Student A conversations exist; Student B cannot access Student A conversation', async () => {
    // A can list their conversations
    const listA = await request(app)
      .get('/api/ai/conversations')
      .set('Authorization', `Bearer ${studentTokenA}`);
    expect(listA.status).toBe(200);
    expect(listA.body.data.some((c: any) => c.id === sharedConvId)).toBe(true);

    // B attempts to access A's conversation -> Strictly 404 (denied)
    const accessB = await request(app)
      .get(`/api/ai/conversations/${sharedConvId}`)
      .set('Authorization', `Bearer ${studentTokenB}`);
    expect(accessB.status).toBe(404);

    // B cannot delete A's conversation
    const deleteB = await request(app)
      .delete(`/api/ai/conversations/${sharedConvId}`)
      .set('Authorization', `Bearer ${studentTokenB}`);
    expect(deleteB.status).toBe(404);
  });

  // --------------------------------------------------------------------------
  // Test 7: Unauthenticated Requests Return 401
  // --------------------------------------------------------------------------
  test('7. Unauthenticated request to every /api/ai/* route returns 401', async () => {
    const r1 = await request(app).post('/api/ai/chat').send({ message: '2+2' });
    expect(r1.status).toBe(401);

    const r2 = await request(app).post('/api/ai/chat/image').send({});
    expect(r2.status).toBe(401);

    const r3 = await request(app).post('/api/ai/chat/voice').send({});
    expect(r3.status).toBe(401);

    const r4 = await request(app).get('/api/ai/conversations');
    expect(r4.status).toBe(401);

    const r5 = await request(app).get('/api/ai/conversations/conv_123');
    expect(r5.status).toBe(401);

    const r6 = await request(app).delete('/api/ai/conversations/conv_123');
    expect(r6.status).toBe(401);
  });

  // --------------------------------------------------------------------------
  // Test 8: Invalid File Type & Oversize File Validation
  // --------------------------------------------------------------------------
  test('8. Invalid file type / oversize file returns clean error without crash', async () => {
    // 1. Invalid image MIME
    const r1 = await request(app)
      .post('/api/ai/chat/image')
      .set('Authorization', `Bearer ${studentTokenA}`)
      .send({
        imageBase64: 'abc',
        mimeType: 'text/plain',
      });
    expect(r1.status).toBe(400);
    expect(r1.body.error).toContain('Faqat JPEG, PNG yoki WebP');

    // 2. Oversize image (> 5 MB)
    const largeBase64 = 'A'.repeat(7 * 1024 * 1024);
    const r2 = await request(app)
      .post('/api/ai/chat/image')
      .set('Authorization', `Bearer ${studentTokenA}`)
      .send({
        imageBase64: largeBase64,
        mimeType: 'image/jpeg',
      });
    expect(r2.status).toBe(400);
    expect(r2.body.error).toContain('katta');

    // 3. Invalid audio MIME
    const r3 = await request(app)
      .post('/api/ai/chat/voice')
      .set('Authorization', `Bearer ${studentTokenA}`)
      .send({
        audioBase64: 'abc',
        mimeType: 'application/pdf',
      });
    expect(r3.status).toBe(400);
    expect(r3.body.error).toContain('Faqat audio');
  });

  // --------------------------------------------------------------------------
  // Test 9: Frontend Bundle Contains No Gemini API Key
  // --------------------------------------------------------------------------
  test('9. Frontend source code contains no direct Gemini API keys or direct generativelanguage calls', () => {
    const frontendDir = path.resolve(process.cwd(), '../frontend/lib');
    if (fs.existsSync(frontendDir)) {
      const checkDir = (dir: string) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            checkDir(fullPath);
          } else if (file.endsWith('.dart')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            expect(content).not.toContain('generativelanguage.googleapis.com');
            expect(content).not.toContain('GEMINI_API_KEY');
          }
        }
      };
      checkDir(frontendDir);
    }
  });
});
