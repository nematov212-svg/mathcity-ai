import request from 'supertest';
import { app } from '../src/app';
import { repository } from '../src/utils/repository';

describe('Real User Leaderboard Ranking & Cleanup Verification', () => {
  const createdUserIds: string[] = [];
  const tokens: Record<string, string> = {};

  afterAll(async () => {
    // Clean up all test users created in this test
    for (const id of createdUserIds) {
      repository.deleteUser(id);
    }
  });

  it('1. Registers 5 real accounts with different coins & XP and verifies ordering & me rank', async () => {
    // Account 1: Bobur - 300 coins, 800 XP
    const res1 = await request(app).post('/api/auth/register').send({
      displayName: 'Bobur',
      loginOrEmail: 'bobur_test_real_1',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    expect(res1.status).toBe(201);
    const user1 = res1.body.data.user;
    tokens['user1'] = res1.body.data.token;
    createdUserIds.push(user1.id);

    // Account 2: Kamola - 200 coins, 500 XP
    const res2 = await request(app).post('/api/auth/register').send({
      displayName: 'Kamola',
      loginOrEmail: 'kamola_test_real_2',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    expect(res2.status).toBe(201);
    const user2 = res2.body.data.user;
    tokens['user2'] = res2.body.data.token;
    createdUserIds.push(user2.id);

    // Account 3: Sardor - 100 coins, 300 XP
    const res3 = await request(app).post('/api/auth/register').send({
      displayName: 'Sardor',
      loginOrEmail: 'sardor_test_real_3',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    expect(res3.status).toBe(201);
    const user3 = res3.body.data.user;
    tokens['user3'] = res3.body.data.token;
    createdUserIds.push(user3.id);

    // Account 4: Zilola - 50 coins, 150 XP
    const res4 = await request(app).post('/api/auth/register').send({
      displayName: 'Zilola',
      loginOrEmail: 'zilola_test_real_4',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    expect(res4.status).toBe(201);
    const user4 = res4.body.data.user;
    tokens['user4'] = res4.body.data.token;
    createdUserIds.push(user4.id);

    // Account 5: Anvar - 0 coins, 0 XP (Fresh 0-coin user)
    const res5 = await request(app).post('/api/auth/register').send({
      displayName: 'Anvar',
      loginOrEmail: 'anvar_test_real_5',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    expect(res5.status).toBe(201);
    const user5 = res5.body.data.user;
    tokens['user5'] = res5.body.data.token;
    createdUserIds.push(user5.id);

    // Credit coins & XP via repository
    repository.creditCoins(user1.id, 300, 'SYSTEM_GRANT');
    repository.addXP(user1.id, 800);

    repository.creditCoins(user2.id, 200, 'SYSTEM_GRANT');
    repository.addXP(user2.id, 500);

    repository.creditCoins(user3.id, 100, 'SYSTEM_GRANT');
    repository.addXP(user3.id, 300);

    repository.creditCoins(user4.id, 50, 'SYSTEM_GRANT');
    repository.addXP(user4.id, 150);

    // User 5 remains at 0 coins, 0 XP

    // 2. Query /api/students/leaderboard
    const lbRes = await request(app)
      .get('/api/students/leaderboard?limit=100')
      .set('Authorization', `Bearer ${tokens['user3']}`);

    expect(lbRes.status).toBe(200);
    expect(lbRes.body.success).toBe(true);
    const list = lbRes.body.data.leaderboard;

    // Verify ordering: coins DESC -> xp DESC -> createdAt ASC
    for (let i = 0; i < list.length - 1; i++) {
      const a = list[i];
      const b = list[i + 1];
      if (a.coins === b.coins) {
        expect(a.xp).toBeGreaterThanOrEqual(b.xp);
      } else {
        expect(a.coins).toBeGreaterThan(b.coins);
      }
    }

    // Verify 0-coin user is present in leaderboard
    const user5Entry = list.find((u: any) => u.userId === user5.id);
    expect(user5Entry).toBeDefined();
    expect(user5Entry.coins).toBe(0);
    expect(user5Entry.rank).toBeGreaterThan(0);

    // Verify me object in /leaderboard
    expect(lbRes.body.data.me).toBeDefined();
    expect(lbRes.body.data.me.userId).toBe(user3.id);
    const user3ExpectedRank = list.find((u: any) => u.userId === user3.id).rank;
    expect(lbRes.body.data.me.rank).toBe(user3ExpectedRank);

    // 3. Query /api/students/leaderboard/me for User 5 (0 coins)
    const me5Res = await request(app)
      .get('/api/students/leaderboard/me')
      .set('Authorization', `Bearer ${tokens['user5']}`);

    expect(me5Res.status).toBe(200);
    expect(me5Res.body.data.hasRank).toBe(true);
    expect(typeof me5Res.body.data.rank).toBe('number');
    expect(me5Res.body.data.coins).toBe(0);
    expect(me5Res.body.data.message).toContain('o‘rindasiz');
  });

  it('2. Cleans up all 5 test accounts safely leaving only real users', async () => {
    for (const id of createdUserIds) {
      const deleted = repository.deleteUser(id);
      expect(deleted).toBe(true);
      expect(repository.getUserById(id)).toBeUndefined();
    }
    // Verify none of the test users remain
    const remaining = repository.getAllUsers();
    for (const id of createdUserIds) {
      expect(remaining.some((u) => u.id === id)).toBe(false);
    }
  });
});
