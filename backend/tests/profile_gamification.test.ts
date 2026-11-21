import request from 'supertest';
import { app } from '../src/app.js';
import { repository } from '../src/utils/repository.js';
import {
  getTashkentDateString,
  getTashkentDayOfWeek,
  getTashkentWeekDays,
  getTashkentSecondsUntilMidnight,
} from '../src/utils/tashkentTime.js';

describe('Profile, Missions, Achievements & Gamification Test Suite', () => {
  let freeUserToken: string;
  let freeUserId: string;
  let proUserToken: string;
  let proUserId: string;

  beforeAll(async () => {
    // 1. Create Free User
    const freeRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: `free_user_${Date.now()}@mathcity.uz`,
        password: 'Password123!',
        displayName: 'Free O‘quvchi',
        dateOfBirth: '2015-05-10',
      });
    expect(freeRes.status).toBe(201);
    freeUserToken = freeRes.body.data.token || freeRes.body.data.tokens?.accessToken;
    freeUserId = freeRes.body.data.user.id;

    // 2. Create Pro User
    const proRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: `pro_user_${Date.now()}@mathcity.uz`,
        password: 'Password123!',
        displayName: 'Pro O‘quvchi',
        dateOfBirth: '2014-03-12',
      });
    expect(proRes.status).toBe(201);
    proUserToken = proRes.body.data.token || proRes.body.data.tokens?.accessToken;
    proUserId = proRes.body.data.user.id;

    // Activate Pro for proUser
    repository.activatePro(proUserId, 'web');
  });

  describe('1. Asia/Tashkent Timezone & Week Days', () => {
    it('should format date string in YYYY-MM-DD for Asia/Tashkent', () => {
      const dateStr = getTashkentDateString();
      expect(dateStr).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should return exactly 7 week days from Monday (Du) to Sunday (Ya)', () => {
      const days = getTashkentWeekDays();
      expect(days.length).toBe(7);
      expect(days[0].dayKey).toBe('Du');
      expect(days[1].dayKey).toBe('Se');
      expect(days[2].dayKey).toBe('Ch');
      expect(days[3].dayKey).toBe('Pa');
      expect(days[4].dayKey).toBe('Ju');
      expect(days[5].dayKey).toBe('Sh');
      expect(days[6].dayKey).toBe('Ya');

      const todayFound = days.filter((d) => d.isToday);
      expect(todayFound.length).toBe(1);
    });

    it('should calculate seconds until Tashkent midnight correctly', () => {
      const seconds = getTashkentSecondsUntilMidnight();
      expect(seconds).toBeGreaterThan(0);
      expect(seconds).toBeLessThanOrEqual(86400);
    });
  });

  describe('2. Daily Missions (Strictly 3 per day, 1-2 coins)', () => {
    it('GET /api/daily-tasks/today should return exactly 3 missions and seconds to midnight', async () => {
      const res = await request(app)
        .get('/api/daily-tasks/today')
        .set('Authorization', `Bearer ${freeUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.missions.length).toBe(3);
      expect(res.body.data.secondsUntilMidnight).toBeGreaterThan(0);

      // Verify coin rewards are 1 or 2
      for (const m of res.body.data.missions) {
        expect([1, 2]).toContain(m.rewardCoins);
      }
    });

    it('POST /api/daily-tasks/:key/claim should reject uncompleted missions with 0 reward', async () => {
      const today = repository.getTodayMissions(freeUserId);
      const uncompleted = today.missions.find((m) => !m.isCompleted);
      expect(uncompleted).toBeDefined();

      const res = await request(app)
        .post(`/api/daily-tasks/${uncompleted!.id}/claim`)
        .set('Authorization', `Bearer ${freeUserToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/daily-tasks/:key/claim should award 1-2 coins idempotently when completed', async () => {
      const initialCoins = repository.getUserById(freeUserId)!.coinBalance;

      // Complete a mission via repository
      repository.advanceMissionProgress(freeUserId, 'SOLVE_PROBLEM', 10);
      const today = repository.getTodayMissions(freeUserId);
      const completedMission = today.missions.find((m) => m.isCompleted);
      expect(completedMission).toBeDefined();

      // First claim: success
      const claim1 = await request(app)
        .post(`/api/daily-tasks/${completedMission!.id}/claim`)
        .set('Authorization', `Bearer ${freeUserToken}`);

      expect(claim1.status).toBe(200);
      expect(claim1.body.success).toBe(true);
      expect(claim1.body.data.coinsAwarded).toBe(completedMission!.rewardCoins);

      const afterCoins = repository.getUserById(freeUserId)!.coinBalance;
      expect(afterCoins).toBe(initialCoins + completedMission!.rewardCoins);

      // Second claim: idempotent (already claimed, does not double-award)
      const claim2 = await request(app)
        .post(`/api/daily-tasks/${completedMission!.id}/claim`)
        .set('Authorization', `Bearer ${freeUserToken}`);

      expect(claim2.status).toBe(400);
      expect(repository.getUserById(freeUserId)!.coinBalance).toBe(afterCoins);
    });
  });

  describe('3. Achievements (Pro Gated, 403 for Free, Unlocked for Pro)', () => {
    it('GET /api/achievements should return 403 with isProRequired for Free users', async () => {
      const res = await request(app)
        .get('/api/achievements')
        .set('Authorization', `Bearer ${freeUserToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.isProRequired).toBe(true);
      expect(res.body.error).toContain('Pro');
    });

    it('GET /api/achievements should return achievements list with progress for Pro users', async () => {
      const res = await request(app)
        .get('/api/achievements')
        .set('Authorization', `Bearer ${proUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.isPro).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(5);

      // Check no city achievements exist
      const titles = res.body.data.map((a: any) => a.title);
      expect(titles).not.toContain('Shahar bunyodkori');
      expect(titles).not.toContain('Yulduzlar tadqiqotchisi');
    });

    it('POST /api/achievements/:key/claim should award 10-20 coins and XP for Pro users', async () => {
      // Unlock "ach_first_step" for pro user
      const proUser = repository.getUserById(proUserId)!;
      if (!proUser.unlockedAchievements.includes('ach_first_step')) {
        proUser.unlockedAchievements.push('ach_first_step');
      }

      const initialCoins = proUser.coinBalance;
      const initialXP = proUser.totalXP;

      const claimRes = await request(app)
        .post('/api/achievements/ach_first_step/claim')
        .set('Authorization', `Bearer ${proUserToken}`);

      expect(claimRes.status).toBe(200);
      expect(claimRes.body.success).toBe(true);
      expect(claimRes.body.data.coinsEarned).toBeGreaterThanOrEqual(10);
      expect(claimRes.body.data.xpEarned).toBeGreaterThanOrEqual(50);

      expect(proUser.coinBalance).toBe(initialCoins + claimRes.body.data.coinsEarned);
      expect(proUser.totalXP).toBe(initialXP + claimRes.body.data.xpEarned);

      // Duplicate claim attempt: idempotent
      const dupRes = await request(app)
        .post('/api/achievements/ach_first_step/claim')
        .set('Authorization', `Bearer ${proUserToken}`);
      expect(dupRes.status).toBe(400);
    });
  });

  describe('4. Learning Stats & Topic Mastery Formula', () => {
    it('GET /api/stats should return 6 KPI cards, weekly activity, and topic mastery', async () => {
      const res = await request(app)
        .get('/api/stats')
        .set('Authorization', `Bearer ${freeUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('attemptedQuestions');
      expect(res.body.data).toHaveProperty('accuracyPercentage');
      expect(res.body.data).toHaveProperty('studyMinutesTotal');
      expect(res.body.data).toHaveProperty('longestStreak');
      expect(res.body.data).toHaveProperty('totalCoins');
      expect(res.body.data).toHaveProperty('level');
      expect(res.body.data).toHaveProperty('topicMastery');
      expect(Array.isArray(res.body.data.topicMastery)).toBe(true);
    });
  });

  describe('5. Profile Summary, Heartbeat & Settings', () => {
    it('POST /api/profile/heartbeat should record study minutes', async () => {
      const res = await request(app)
        .post('/api/profile/heartbeat')
        .set('Authorization', `Bearer ${freeUserToken}`)
        .send({ seconds: 15 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('todayMinutes');
      expect(res.body.data).toHaveProperty('totalMinutes');
    });

    it('GET /api/profile/summary should return profile overview', async () => {
      const res = await request(app)
        .get('/api/profile/summary')
        .set('Authorization', `Bearer ${freeUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('coins');
      expect(res.body.data).toHaveProperty('xp');
      expect(res.body.data).toHaveProperty('studyMinutesToday');
      expect(res.body.data).toHaveProperty('currentStreak');
      expect(res.body.data).toHaveProperty('isPro', false);
    });

    it('PATCH /api/settings should update and persist user settings', async () => {
      const res = await request(app)
        .patch('/api/settings')
        .set('Authorization', `Bearer ${freeUserToken}`)
        .send({
          themeMode: 'DARK',
          soundEnabled: false,
          animationsEnabled: true,
          reminderTime: '19:30',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.themeMode).toBe('DARK');
      expect(res.body.data.soundEnabled).toBe(false);
      expect(res.body.data.reminderTime).toBe('19:30');
    });
  });

  describe('6. Games Finish & Rewards', () => {
    it('POST /api/games/:key/finish should calculate rewards and advance missions', async () => {
      const res = await request(app)
        .post('/api/games/kosmik_hisob/finish')
        .set('Authorization', `Bearer ${freeUserToken}`)
        .send({
          score: 60,
          durationSeconds: 45,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.coinsEarned).toBeGreaterThan(0);
      expect(res.body.data.xpEarned).toBeGreaterThan(0);
    });

    it('GET /api/games/results/recent should return recent game results', async () => {
      const res = await request(app)
        .get('/api/games/results/recent')
        .set('Authorization', `Bearer ${freeUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });
});
