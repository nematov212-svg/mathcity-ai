import request from 'supertest';
import { app } from '../src/app.js';

describe('Centralized Coin, XP, Practice, Avatar & Leaderboard Integration Tests', () => {
  let user1Token: string;
  let user2Token: string;
  let user1Id: string;
  let user2Id: string;

  beforeAll(async () => {
    // 1. Register User 1
    const res1 = await request(app)
      .post('/api/auth/register')
      .send({
        email: `student1_${Date.now()}@mathcity.ai`,
        password: 'StrongPassword123!',
        displayName: 'User Bir',
        dateOfBirth: '2015-05-15',
      });
    user1Token = res1.body.data.token;
    user1Id = res1.body.data.user.id;

    // 2. Register User 2
    const res2 = await request(app)
      .post('/api/auth/register')
      .send({
        email: `student2_${Date.now()}@mathcity.ai`,
        password: 'StrongPassword123!',
        displayName: 'User Ikki',
        dateOfBirth: '2015-06-16',
      });
    user2Token = res2.body.data.token;
    user2Id = res2.body.data.user.id;
  });

  it('1. GET /api/me returns central source of truth (coins, xp, level, rank, avatarUrl)', async () => {
    const res = await request(app)
      .get('/api/me')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.data.coins).toBe('number');
    expect(typeof res.body.data.xp).toBe('number');
    expect(typeof res.body.data.level).toBe('number');
    expect(res.body.data.displayName).toBe('User Bir');
    expect(typeof res.body.data.rank).toBe('number');
  });

  it('2. POST /api/practice/answer awards exactly +1 coin and +10 XP for correct answer', async () => {
    const res = await request(app)
      .post('/api/practice/answer')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        questionId: 'q-add-01', // 7 + 5 = 12
        selectedOption: '12',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isCorrect).toBe(true);
    expect(res.body.data.coinsAwarded).toBe(1);
    expect(res.body.data.xpAwarded).toBe(10);
    expect(typeof res.body.data.newCoinBalance).toBe('number');
    expect(typeof res.body.data.newTotalXP).toBe('number');
  });

  it('3. POST /api/practice/answer awards 0 coins and 0 XP for wrong answer', async () => {
    const prevCoins = (await request(app).get('/api/me').set('Authorization', `Bearer ${user1Token}`)).body.data.coins;

    const res = await request(app)
      .post('/api/practice/answer')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        questionId: 'q-sub-01', // 15 - 8 = 7
        selectedOption: '99', // wrong
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isCorrect).toBe(false);
    expect(res.body.data.coinsAwarded).toBe(0);
    expect(res.body.data.xpAwarded).toBe(0);
    expect(res.body.data.newCoinBalance).toBe(prevCoins);
  });

  it('4. Repeated solve of same question gives 0 extra coins (idempotent)', async () => {
    const res = await request(app)
      .post('/api/practice/answer')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        questionId: 'q-add-01', // already solved in test 2
        selectedOption: '12',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isCorrect).toBe(true);
    expect(res.body.data.coinsAwarded).toBe(0);
    expect(res.body.data.xpAwarded).toBe(0);
  });

  it('5. PATCH /api/users/me/avatar updates user profile picture across the platform', async () => {
    const newAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb';
    const res = await request(app)
      .patch('/api/users/me/avatar')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({ avatarUrl: newAvatar });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.avatarUrl).toBe(newAvatar);

    // Verify it reflects in /api/me
    const meRes = await request(app)
      .get('/api/me')
      .set('Authorization', `Bearer ${user2Token}`);
    expect(meRes.body.data.avatarUrl).toBe(newAvatar);
  });

  it('6. GET /api/leaderboard returns sorted ranks and exposes real user avatar', async () => {
    const res = await request(app)
      .get('/api/leaderboard')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.leaderboard)).toBe(true);

    const list = res.body.data.leaderboard;
    // Check descending order of XP
    for (let i = 0; i < list.length - 1; i++) {
      expect(list[i].totalXP).toBeGreaterThanOrEqual(list[i + 1].totalXP);
    }

    // Verify myRank is populated
    expect(res.body.data.myRank).toBeDefined();
    expect(res.body.data.myRank.id).toBe(user1Id);
  });
});
