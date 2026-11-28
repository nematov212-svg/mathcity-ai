import request from 'supertest';
import { app } from '../src/app.js';
import { repository, UserAccount } from '../src/utils/repository.js';
import jwt from 'jsonwebtoken';
import { config } from '../src/config/env.js';

function createTestUser(overrides: Partial<UserAccount>): { user: UserAccount; token: string } {
  const now = new Date();
  const id = `user_game_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const defaultUser: UserAccount = {
    id,
    email: `game_player_${Date.now()}_${Math.random().toString(36).substring(2, 5)}@mathcity.ai`,
    displayName: 'Game Player',
    dateOfBirth: '2016-01-01',
    age: 9,
    mode: 'KIDS',
    grade: 3,
    avatarUrl: 'assets/images/avatar_kid.png',
    profileCompleted: true,
    parentalConsentRequired: false,
    coinBalance: 50,
    totalXP: 20,
    level: 1,
    cityLevel: 1,
    currentStreak: 1,
    longestStreak: 1,
    subscription: {
      status: 'FREE_TRIAL_ACTIVE',
      trialStartedAt: now.toISOString(),
      trialExpiresAt: new Date(now.getTime() + 30 * 86400 * 1000).toISOString(),
      planName: 'MathCity Free Trial',
      priceMonthlyUzs: 29000,
    },
    placedBuildings: [],
    completedLessons: [],
    completedSections: [],
    solvedQuestions: [],
    rewardedQuestionIds: [],
    attemptedQuestionCount: 0,
    correctQuestionCount: 0,
    incorrectQuestionCount: 0,
    dailyTaskProgress: {},
    unlockedAchievements: [],
    createdAt: now.toISOString(),
    ...overrides,
  };
  repository.createUser(defaultUser);
  const token = jwt.sign({ userId: defaultUser.id }, config.jwtSecret);
  return { user: defaultUser, token };
}

describe('MathCity AI — Games Daily Limit, Anti-Cheat & Rewards System Tests', () => {
  let freeUser: UserAccount;
  let freeUserToken: string;

  let proUser: UserAccount;
  let proUserToken: string;

  beforeAll(() => {
    // 1. Free User
    const free = createTestUser({ displayName: 'Free Player' });
    freeUser = free.user;
    freeUserToken = free.token;

    // 2. Pro User
    const pro = createTestUser({
      displayName: 'Pro Player',
      subscription: {
        status: 'PRO_ACTIVE',
        planName: 'MathCity Pro Yillik',
        priceMonthlyUzs: 175000,
        trialStartedAt: new Date().toISOString(),
        trialExpiresAt: new Date().toISOString(),
        proStartedAt: new Date().toISOString(),
        proExpiresAt: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
      },
    });
    proUser = pro.user;
    proUserToken = pro.token;
  });

  it('1. GET /api/games/status returns initial 1/1 limit for Free user', async () => {
    const res = await request(app)
      .get('/api/games/status')
      .set('Authorization', `Bearer ${freeUserToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isPro).toBe(false);
    expect(res.body.data.games.tezkor_hisob).toBeDefined();
    expect(res.body.data.games.tezkor_hisob.used).toBe(0);
    expect(res.body.data.games.tezkor_hisob.limit).toBe(1);
    expect(res.body.data.games.tezkor_hisob.remaining).toBe(1);
    expect(res.body.data.games.tezkor_hisob.unlimited).toBe(false);
  });

  it('2. POST /api/games/:id/start creates session on 1st play for Free user', async () => {
    const res = await request(app)
      .post('/api/games/tezkor_hisob/start')
      .set('Authorization', `Bearer ${freeUserToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.sessionId).toBeDefined();
    expect(res.body.data.gameId).toBe('tezkor_hisob');
  });

  it('3. POST /api/games/:id/finish gives +20 coins for win and updates limit to 0/1', async () => {
    // Start session
    const startRes = await request(app)
      .post('/api/games/tezkor_hisob/start')
      .set('Authorization', `Bearer ${freeUserToken}`);

    const sessionId = startRes.body.data.sessionId;

    const finishRes = await request(app)
      .post('/api/games/tezkor_hisob/finish')
      .set('Authorization', `Bearer ${freeUserToken}`)
      .send({
        sessionId,
        result: 'win',
        score: 15,
        durationSeconds: 58,
        correctAnswers: 15,
        totalQuestions: 16,
      });

    expect(finishRes.status).toBe(200);
    expect(finishRes.body.success).toBe(true);
    expect(finishRes.body.data.coinsAwarded).toBe(20);
    expect(finishRes.body.data.remaining).toBe(0);

    // Verify status endpoint reflects used: 1, remaining: 0
    const statusRes = await request(app)
      .get('/api/games/status')
      .set('Authorization', `Bearer ${freeUserToken}`);

    expect(statusRes.body.data.games.tezkor_hisob.used).toBe(1);
    expect(statusRes.body.data.games.tezkor_hisob.remaining).toBe(0);
  });

  it('4. POST /api/games/:id/start rejects with 403 when daily limit is exhausted', async () => {
    const res = await request(app)
      .post('/api/games/tezkor_hisob/start')
      .set('Authorization', `Bearer ${freeUserToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.isLimitReached).toBe(true);
    expect(res.body.error).toContain('Pro');
  });

  it('5. Each game has an independent daily limit (e.g. xotira_kartalari is still available)', async () => {
    const statusRes = await request(app)
      .get('/api/games/status')
      .set('Authorization', `Bearer ${freeUserToken}`);

    expect(statusRes.body.data.games.xotira_kartalari.used).toBe(0);
    expect(statusRes.body.data.games.xotira_kartalari.remaining).toBe(1);

    // Starting xotira_kartalari succeeds
    const startRes = await request(app)
      .post('/api/games/xotira_kartalari/start')
      .set('Authorization', `Bearer ${freeUserToken}`);

    expect(startRes.status).toBe(200);
    expect(startRes.body.success).toBe(true);
  });

  it('6. Pro user has unlimited plays (unlimited: true, remaining: 999) and never gets 403', async () => {
    const statusRes = await request(app)
      .get('/api/games/status')
      .set('Authorization', `Bearer ${proUserToken}`);

    expect(statusRes.status).toBe(200);
    expect(statusRes.body.data.isPro).toBe(true);
    expect(statusRes.body.data.games.tezkor_hisob.unlimited).toBe(true);

    // 1st play
    const s1 = await request(app)
      .post('/api/games/tezkor_hisob/start')
      .set('Authorization', `Bearer ${proUserToken}`);
    expect(s1.status).toBe(200);

    const f1 = await request(app)
      .post('/api/games/tezkor_hisob/finish')
      .set('Authorization', `Bearer ${proUserToken}`)
      .send({ sessionId: s1.body.data.sessionId, result: 'win', score: 20 });
    expect(f1.status).toBe(200);

    // 2nd play immediately succeeds without 403
    const s2 = await request(app)
      .post('/api/games/tezkor_hisob/start')
      .set('Authorization', `Bearer ${proUserToken}`);
    expect(s2.status).toBe(200);

    const f2 = await request(app)
      .post('/api/games/tezkor_hisob/finish')
      .set('Authorization', `Bearer ${proUserToken}`)
      .send({ sessionId: s2.body.data.sessionId, result: 'draw', score: 8 });
    expect(f2.status).toBe(200);
    expect(f2.body.data.coinsAwarded).toBe(10); // Draw gives +10 coins
  });

  it('7. Anti-cheat: cannot reuse a finished sessionId', async () => {
    const s = await request(app)
      .post('/api/games/matematik_duel/start')
      .set('Authorization', `Bearer ${proUserToken}`);

    const sessionId = s.body.data.sessionId;

    // Finish 1st time
    const f1 = await request(app)
      .post('/api/games/matematik_duel/finish')
      .set('Authorization', `Bearer ${proUserToken}`)
      .send({ sessionId, result: 'participated', score: 3 });
    expect(f1.status).toBe(200);
    expect(f1.body.data.coinsAwarded).toBe(5); // Loss/participated gives +5 coins

    // Replay attack with same session
    const f2 = await request(app)
      .post('/api/games/matematik_duel/finish')
      .set('Authorization', `Bearer ${proUserToken}`)
      .send({ sessionId, result: 'win', score: 10 });
    expect(f2.status).toBe(400);
    expect(f2.body.success).toBe(false);
  });

  it('8. Midnight date rollover (Tashkent UTC+5) resets daily limits to 1/1', async () => {
    // Manually simulate yesterday for freeUser
    const user = repository.getUserById(freeUser.id)!;
    user.dailyGamePlays = {
      date: '2026-01-01',
      plays: { tezkor_hisob: 1, xotira_kartalari: 1 },
      dailyCoinsEarned: 30,
    };
    repository.updateUser(freeUser.id, { dailyGamePlays: user.dailyGamePlays });

    // Calling status today triggers midnight reset
    const statusRes = await request(app)
      .get('/api/games/status')
      .set('Authorization', `Bearer ${freeUserToken}`);

    expect(statusRes.status).toBe(200);
    expect(statusRes.body.data.games.tezkor_hisob.used).toBe(0);
    expect(statusRes.body.data.games.tezkor_hisob.remaining).toBe(1);
    expect(statusRes.body.data.games.xotira_kartalari.used).toBe(0);
    expect(statusRes.body.data.games.xotira_kartalari.remaining).toBe(1);
  });
});
