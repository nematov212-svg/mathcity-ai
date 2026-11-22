import request from 'supertest';
import { app } from '../src/app.js';

describe('Exercises Endpoint (GET /api/exercises)', () => {
  it('1. GET /api/exercises returns 20 questions for level 1', async () => {
    const res = await request(app).get('/api/exercises?level=1&count=20');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(20);
    expect(res.body.data).toHaveLength(20);

    for (const q of res.body.data) {
      expect(q.options).toHaveLength(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.options[q.correctIndex]).toBe(q.answer);
    }
  });

  it('2. GET /api/exercises returns 20 questions for level 2', async () => {
    const res = await request(app).get('/api/exercises?level=2&count=20');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(20);
    expect(res.body.data).toHaveLength(20);
  });

  it('3. GET /api/exercises returns 20 questions for level 3', async () => {
    const res = await request(app).get('/api/exercises?level=3&count=20');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(20);
    expect(res.body.data).toHaveLength(20);
  });
});
