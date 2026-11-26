import request from 'supertest';
import { app } from '../src/app';
import { repository } from '../src/utils/repository';

describe('Leaderboard Contest & Announcements System Tests', () => {
  const createdUserIds: string[] = [];
  let token1: string = '';
  let token2: string = '';
  let token3: string = '';
  let adminToken: string = '';

  beforeAll(async () => {
    // Admin login with development credentials
    const adminRes = await request(app).post('/api/admin/login').send({
      username: 'mirzobek',
      password: 'mirzobek',
    });
    if (adminRes.body && adminRes.body.data && adminRes.body.data.token) {
      adminToken = adminRes.body.data.token;
    }

    // Create 3 test users
    const u1 = await request(app).post('/api/auth/register').send({
      displayName: 'ContestUserOne',
      loginOrEmail: 'contest_user_1_' + Date.now(),
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    token1 = u1.body.data.token;
    createdUserIds.push(u1.body.data.user.id);
    repository.updateUser(u1.body.data.user.id, { coinBalance: 300, totalXP: 1000 });

    const u2 = await request(app).post('/api/auth/register').send({
      displayName: 'ContestUserTwo',
      loginOrEmail: 'contest_user_2_' + Date.now(),
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    token2 = u2.body.data.token;
    createdUserIds.push(u2.body.data.user.id);
    repository.updateUser(u2.body.data.user.id, { coinBalance: 200, totalXP: 800 });

    const u3 = await request(app).post('/api/auth/register').send({
      displayName: 'ContestUserThree',
      loginOrEmail: 'contest_user_3_' + Date.now(),
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    token3 = u3.body.data.token;
    createdUserIds.push(u3.body.data.user.id);
    repository.updateUser(u3.body.data.user.id, { coinBalance: 100, totalXP: 500 });
  });

  afterAll(async () => {
    for (const id of createdUserIds) {
      repository.deleteUser(id);
    }
  });

  it('1. GET /api/leaderboard returns ordered users, me rank, and contest data', async () => {
    const res = await request(app)
      .get('/api/leaderboard?limit=10')
      .set('Authorization', `Bearer ${token1}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.me).toBeDefined();
    expect(res.body.contest).toBeDefined();
    expect(Array.isArray(res.body.contest.prizes)).toBe(true);
    expect(res.body.contest.prizes[0].coins).toBe(500);

    // Verify ordering by coins descending
    const data = res.body.data;
    for (let i = 0; i < data.length - 1; i++) {
      if (data[i].coins === data[i + 1].coins) {
        expect(data[i].xp).toBeGreaterThanOrEqual(data[i + 1].xp);
      } else {
        expect(data[i].coins).toBeGreaterThanOrEqual(data[i + 1].coins);
      }
    }
  });

  it('2. Admin can get and update contest settings', async () => {
    const getRes = await request(app)
      .get('/api/admin/contest')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.success).toBe(true);
    expect(getRes.body.data.name).toBeDefined();

    const putRes = await request(app)
      .put('/api/admin/contest')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Bahor musobaqasi 2026',
        durationDays: 14,
        prizes: { first: 600, second: 300, third: 200 },
      });
    expect(putRes.status).toBe(200);
    expect(putRes.body.success).toBe(true);
    expect(putRes.body.data.name).toBe('Bahor musobaqasi 2026');
    expect(putRes.body.data.prizes[0].coins).toBe(600);
  });

  it('3. Contest finalization awards prizes idempotently', async () => {
    const user1Before = repository.getUserById(createdUserIds[0]);
    const coinsBefore1 = user1Before?.coinBalance || 0;

    const finalizeRes = await request(app)
      .post('/api/admin/contest/finalize')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(finalizeRes.status).toBe(200);
    expect(finalizeRes.body.success).toBe(true);

    const user1After = repository.getUserById(createdUserIds[0]);
    expect(user1After?.coinBalance).toBeGreaterThanOrEqual(coinsBefore1);

    // Running checkAndAwardContestPrizes again should be idempotent (no duplicate prizes)
    const contestAfter = repository.getLeaderboardContest();
    expect(contestAfter.isEnded).toBe(true);
    const coinsSnapshot = user1After?.coinBalance;
    repository.checkAndAwardContestPrizes();
    const user1AfterSecondCheck = repository.getUserById(createdUserIds[0]);
    expect(user1AfterSecondCheck?.coinBalance).toBe(coinsSnapshot);
  });

  it('4. Announcements active endpoint, view tracking and click tracking', async () => {
    const activeRes = await request(app).get('/api/announcements/active');
    expect(activeRes.status).toBe(200);
    expect(activeRes.body.success).toBe(true);
    expect(Array.isArray(activeRes.body.data)).toBe(true);

    if (activeRes.body.data.length > 0) {
      const annId = activeRes.body.data[0].id;
      const initialViews = activeRes.body.data[0].views || 0;
      const initialClicks = activeRes.body.data[0].clicks || 0;

      // View
      const viewRes = await request(app).post(`/api/announcements/${annId}/view`);
      expect(viewRes.status).toBe(200);
      expect(viewRes.body.success).toBe(true);
      expect(viewRes.body.views).toBe(initialViews + 1);

      // Click
      const clickRes = await request(app).post(`/api/announcements/${annId}/click`);
      expect(clickRes.status).toBe(200);
      expect(clickRes.body.success).toBe(true);
      expect(clickRes.body.clicks).toBe(initialClicks + 1);

      // Toggle status
      const toggleRes = await request(app)
        .patch(`/api/admin/announcements/${annId}/toggle`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(toggleRes.status).toBe(200);
      expect(toggleRes.body.success).toBe(true);

      // Toggle back
      await request(app)
        .patch(`/api/admin/announcements/${annId}/toggle`)
        .set('Authorization', `Bearer ${adminToken}`);
    }
  });
});
