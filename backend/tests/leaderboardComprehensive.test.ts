import request from 'supertest';
import { app } from '../src/app.js';
import { repository } from '../src/utils/repository.js';

describe('Task 1 — Comprehensive Leaderboard & Single-Source Coins/XP Tests', () => {
  let u1Token: string, u1Id: string;
  let u2Token: string, u2Id: string;
  let u3Token: string, u3Id: string;
  let u4Token: string, u4Id: string;
  let u5Token: string, u5Id: string;
  let u0Token: string, u0Id: string;

  beforeAll(async () => {
    // 0. Create Top User: 200 coins, 800 XP
    const res0 = await request(app).post('/api/auth/register').send({
      email: 'leader_u0@mathcity.ai',
      username: 'leader_u0',
      password: 'Password123!',
      displayName: 'Top Leader',
      dateOfBirth: '2013-12-12',
      grade: 6,
    });
    u0Token = res0.body.data.token;
    u0Id = res0.body.data.user.id;
    const user0 = repository.getUserById(u0Id)!;
    user0.coinBalance = 200;
    user0.totalXP = 800;

    // 1. Create User 1: 50 coins, 200 XP
    const res1 = await request(app).post('/api/auth/register').send({
      email: 'leader_u1@mathcity.ai',
      username: 'leader_u1',
      password: 'Password123!',
      displayName: 'User One',
      dateOfBirth: '2014-01-01',
      grade: 4,
    });
    u1Token = res1.body.data.token;
    u1Id = res1.body.data.user.id;
    const user1 = repository.getUserById(u1Id)!;
    user1.coinBalance = 50;
    user1.totalXP = 200;

    // 2. Create User 2: 100 coins, 500 XP
    const res2 = await request(app).post('/api/auth/register').send({
      email: 'leader_u2@mathcity.ai',
      username: 'leader_u2',
      password: 'Password123!',
      displayName: 'User Two',
      dateOfBirth: '2014-02-02',
      grade: 5,
    });
    u2Token = res2.body.data.token;
    u2Id = res2.body.data.user.id;
    const user2 = repository.getUserById(u2Id)!;
    user2.coinBalance = 100;
    user2.totalXP = 500;

    // 3. Create User 3: 100 coins, 600 XP (same coins as U2, higher XP)
    const res3 = await request(app).post('/api/auth/register').send({
      email: 'leader_u3@mathcity.ai',
      username: 'leader_u3',
      password: 'Password123!',
      displayName: 'User Three',
      dateOfBirth: '2014-03-03',
      grade: 5,
    });
    u3Token = res3.body.data.token;
    u3Id = res3.body.data.user.id;
    const user3 = repository.getUserById(u3Id)!;
    user3.coinBalance = 100;
    user3.totalXP = 600;

    // 4. Create User 4: 0 coins, 10 XP
    const res4 = await request(app).post('/api/auth/register').send({
      email: 'leader_u4@mathcity.ai',
      username: 'leader_u4',
      password: 'Password123!',
      displayName: 'User Four',
      dateOfBirth: '2014-04-04',
      grade: 4,
    });
    u4Token = res4.body.data.token;
    u4Id = res4.body.data.user.id;
    const user4 = repository.getUserById(u4Id)!;
    user4.coinBalance = 0;
    user4.totalXP = 10;

    // 5. Create User 5: Brand new user with strictly 0 coins and 0 XP
    const res5 = await request(app).post('/api/auth/register').send({
      email: 'leader_u5@mathcity.ai',
      username: 'leader_u5',
      password: 'Password123!',
      displayName: 'User Five',
      dateOfBirth: '2015-05-05',
      grade: 3,
    });
    u5Token = res5.body.data.token;
    u5Id = res5.body.data.user.id;
    // user5 stays with exactly 0 coins and 0 XP
  });

  describe('1. Leaderboard Ranking & Sorting Order', () => {
    it('returns all users ordered by coins DESC -> xp DESC -> createdAt ASC', async () => {
      const res = await request(app)
        .get('/api/students/leaderboard?limit=200')
        .set('Authorization', `Bearer ${u1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const list = res.body.data.leaderboard;
      expect(Array.isArray(list)).toBe(true);
      expect(list.length).toBeGreaterThanOrEqual(5);

      // Verify required fields in each leaderboard item: rank, userId, username, avatarUrl, level, coins, xp
      for (const item of list) {
        expect(item.rank).toBeDefined();
        expect(item.userId).toBeDefined();
        expect(item.username).toBeDefined();
        expect(item.level).toBeDefined();
        expect(typeof item.coins).toBe('number');
        expect(typeof item.xp).toBe('number');
      }

      // Find indices of our 5 test users
      const idx3 = list.findIndex((u: any) => u.userId === u3Id);
      const idx2 = list.findIndex((u: any) => u.userId === u2Id);
      const idx1 = list.findIndex((u: any) => u.userId === u1Id);
      const idx4 = list.findIndex((u: any) => u.userId === u4Id);
      const idx5 = list.findIndex((u: any) => u.userId === u5Id);

      // User 3 (100 coins, 600 xp) must be strictly before User 2 (100 coins, 500 xp)
      expect(idx3).toBeLessThan(idx2);
      // User 2 (100 coins) must be strictly before User 1 (50 coins)
      expect(idx2).toBeLessThan(idx1);
      // User 1 (50 coins) must be strictly before User 4 (0 coins, 10 xp)
      expect(idx1).toBeLessThan(idx4);
      // User 4 (0 coins, 10 xp) must be strictly before User 5 (0 coins, 0 xp)
      expect(idx4).toBeLessThan(idx5);

      // Verify rank numbers reflect order
      expect(list[idx3].rank).toBeLessThan(list[idx2].rank);
      expect(list[idx2].rank).toBeLessThan(list[idx1].rank);
      expect(list[idx1].rank).toBeLessThan(list[idx4].rank);
      expect(list[idx4].rank).toBeLessThan(list[idx5].rank);
    });

    it('new user with 0 coins and 0 XP is included and has a valid rank', async () => {
      const res = await request(app)
        .get('/api/students/leaderboard/me')
        .set('Authorization', `Bearer ${u5Token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.hasRank).toBe(true);
      expect(res.body.data.rank).toBeGreaterThan(0);
      expect(res.body.data.coins).toBe(0);
      expect(res.body.data.xp).toBe(0);
      expect(res.body.data.message).toContain(`Siz ${res.body.data.rank}-o‘rindasiz`);
    });

    it('returns "me" object even when user is querying top5 and user is not in top5', async () => {
      const res = await request(app)
        .get('/api/students/leaderboard?scope=top5')
        .set('Authorization', `Bearer ${u5Token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.leaderboard.length).toBeLessThanOrEqual(5);

      // User 5 is not in top 5, but response MUST contain their "me" object with accurate rank
      expect(res.body.data.me).toBeDefined();
      expect(res.body.data.me.userId).toBe(u5Id);
      expect(res.body.data.me.rank).toBeGreaterThan(5);
      expect(res.body.data.me.isTop100).toBeDefined();
    });
  });

  describe('2. Single Source of Truth for Coins & XP', () => {
    it('when User 5 earns coins on server, leaderboard immediately reflects new balance and improved rank', async () => {
      // Check User 5 initial rank
      const initialMe = await request(app)
        .get('/api/students/leaderboard/me')
        .set('Authorization', `Bearer ${u5Token}`);
      const oldRank = initialMe.body.data.rank;

      // User 5 completes a lesson and earns 200 coins and 300 XP
      repository.creditCoins(u5Id, 200, 'Lesson completion award');
      repository.addXP(u5Id, 300);

      // Fetch leaderboard again
      const afterRes = await request(app)
        .get('/api/students/leaderboard?limit=200')
        .set('Authorization', `Bearer ${u5Token}`);

      const listAfter = afterRes.body.data.leaderboard;
      const u5Entry = listAfter.find((u: any) => u.userId === u5Id);
      expect(u5Entry).toBeDefined();
      expect(u5Entry.coins).toBe(200);
      expect(u5Entry.xp).toBe(300);

      // User 5 now has 200 coins, higher than User 3 (100 coins)!
      const idx3 = listAfter.findIndex((u: any) => u.userId === u3Id);
      const idx5 = listAfter.findIndex((u: any) => u.userId === u5Id);
      expect(idx5).toBeLessThan(idx3); // User 5 is now ahead of User 3!
      expect(u5Entry.rank).toBeLessThan(oldRank); // Rank improved!

      // /profile/summary and /me must show the exact same 200 coins and rank
      const summaryRes = await request(app)
        .get('/api/profile/summary')
        .set('Authorization', `Bearer ${u5Token}`);
      expect(summaryRes.body.data.coinBalance).toBe(200);
      expect(summaryRes.body.data.coins).toBe(200);
      expect(summaryRes.body.data.rank).toBe(u5Entry.rank);

      const meRes = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${u5Token}`);
      expect(meRes.body.data.coinBalance).toBe(200);
      expect(meRes.body.data.rank).toBe(u5Entry.rank);
    });
  });

  describe('3. Global Aliases /leaderboard', () => {
    it('GET /leaderboard and GET /api/leaderboard work identically', async () => {
      const res1 = await request(app)
        .get('/leaderboard?limit=10')
        .set('Authorization', `Bearer ${u1Token}`);
      expect(res1.status).toBe(200);
      expect(res1.body.success).toBe(true);

      const res2 = await request(app)
        .get('/api/leaderboard?limit=10')
        .set('Authorization', `Bearer ${u1Token}`);
      expect(res2.status).toBe(200);
      expect(res2.body.success).toBe(true);
      expect(res1.body.data.leaderboard.length).toBe(res2.body.data.leaderboard.length);
    });
  });
});
