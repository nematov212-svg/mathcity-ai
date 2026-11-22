import request from 'supertest';
import { app } from '../src/app.js';
import { loadKnowledgeBase, findBestMatches } from '../src/utils/knowledgeMatcher.js';

describe('AI Ustoz — Voice, Knowledge Base & Multi-modal Verification', () => {
  let studentToken: string;

  beforeAll(async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: `voice_test_${Date.now()}@mathcity.ai`,
      password: 'StrongPassword123!',
      displayName: 'VoiceTester',
      dateOfBirth: '2013-05-15',
    });
    studentToken = res.body.data.token;
  });

  test('1. Math Knowledge base loads 2000 items across 7 topics', () => {
    const all = loadKnowledgeBase();
    expect(all.length).toBe(2000);

    const topics = new Set(all.map((item) => item.topic));
    expect(topics.has('arifmetika')).toBe(true);
    expect(topics.has('kasrlar')).toBe(true);
    expect(topics.has('foizlar')).toBe(true);
    expect(topics.has('tenglamalar')).toBe(true);
    expect(topics.has('geometriya')).toBe(true);
    expect(topics.has('algebra')).toBe(true);
    expect(topics.has("so'zli masalalar")).toBe(true);
  });

  test('2. Knowledge matcher finds top 3 relevant examples', () => {
    const matches = findBestMatches('kasrlar va umumiy maxraj', 3);
    expect(matches.length).toBe(3);
    expect(matches[0].topic).toBe('kasrlar');
  });

  test('3. Voice Question 1: "2 ko‘paytirish 5" produces distinct correct answer 10', async () => {
    const res = await request(app)
      .post('/api/ai/chat/voice')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        transcribedText: '2 ko‘paytirish 5',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.finalAnswer).toBe('10');
    expect(res.body.data.reply).toContain('10');
  });

  test('4. Voice Question 2: "yarim va chorak yig‘indisi" produces distinct correct answer 3/4', async () => {
    const res = await request(app)
      .post('/api/ai/chat/voice')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        transcribedText: 'yarim va chorak yig‘indisi',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(['3/4', '0.75']).toContain(res.body.data.finalAnswer);
    expect(res.body.data.reply).toMatch(/3\/4|0\.75/);
  });

  test('5. Voice Question 3: "x + 3 = 10 ni yech" produces distinct correct equation root x = 7', async () => {
    const res = await request(app)
      .post('/api/ai/chat/voice')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        transcribedText: 'x + 3 = 10 ni yech',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.finalAnswer).toBe('x = 7');
    expect(res.body.data.reply).toContain('x = 7');
  });

  test('6. Non-math query politely redirects user to mathematics', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        message: 'Bugun havo qanday bo‘ladi?',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.reply).toContain('Men matematika ustoziman');
  });
});
