import request from 'supertest';
import { app } from '../src/app';
import { repository } from '../src/utils/repository';
import {
  calculateActivityScore,
  calculateActivityLevel,
  ACTIVITY_THRESHOLDS,
  ACTIVITY_WEIGHTS,
} from '../src/config/activityConfig';
import {
  getTashkentDateString,
  getTashkentWeekDays,
} from '../src/utils/tashkentTime';

describe('MathCity AI — Weekly Activity Calendar & Streak System', () => {
  const createdUserIds: string[] = [];
  let userToken: string = '';
  let testUserId: string = '';

  beforeAll(async () => {
    const regRes = await request(app).post('/api/auth/register').send({
      displayName: 'StreakMaster',
      loginOrEmail: 'streak_tester_' + Date.now(),
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    expect(regRes.status).toBe(201);
    testUserId = regRes.body.data.user.id;
    userToken = regRes.body.data.token;
    createdUserIds.push(testUserId);
  });

  afterAll(async () => {
    for (const id of createdUserIds) {
      repository.deleteUser(id);
    }
  });

  describe('1. Activity Score & Level Boundary Tests', () => {
    it('Calculates score strictly: correctAnswers + (lessonsCompleted * 5)', () => {
      expect(calculateActivityScore(0, 0)).toBe(0);
      expect(calculateActivityScore(1, 0)).toBe(1);
      expect(calculateActivityScore(0, 1)).toBe(5);
      expect(calculateActivityScore(4, 2)).toBe(14); // 4 + (2 * 5) = 14
      expect(calculateActivityScore(5, 4)).toBe(25); // 5 + (4 * 5) = 25
    });

    it('Maps thresholds correctly: NONE (0), LOW (1-9), MEDIUM (10-24), HIGH (25+)', () => {
      // 0 -> NONE
      expect(calculateActivityLevel(0)).toBe('NONE');

      // 1 - 9 -> LOW
      expect(calculateActivityLevel(1)).toBe('LOW');
      expect(calculateActivityLevel(5)).toBe('LOW');
      expect(calculateActivityLevel(9)).toBe('LOW');

      // 10 - 24 -> MEDIUM
      expect(calculateActivityLevel(10)).toBe('MEDIUM');
      expect(calculateActivityLevel(18)).toBe('MEDIUM');
      expect(calculateActivityLevel(24)).toBe('MEDIUM');

      // 25+ -> HIGH
      expect(calculateActivityLevel(25)).toBe('HIGH');
      expect(calculateActivityLevel(100)).toBe('HIGH');
    });
  });

  describe('2. Idempotency Verification for Questions and Lessons', () => {
    it('Does not double-increment score for the same questionId on the same day', () => {
      const qId = 'exercise_geom_01';
      const res1 = repository.recordDailyCorrectAnswer(testUserId, qId);
      expect(res1.isNew).toBe(true);
      const scoreAfterFirst = res1.activity.score;

      const res2 = repository.recordDailyCorrectAnswer(testUserId, qId);
      expect(res2.isNew).toBe(false);
      expect(res2.activity.score).toBe(scoreAfterFirst);
    });

    it('Does not double-increment score for the same lessonId on the same day', () => {
      const lId = 'lesson_add_01';
      const res1 = repository.recordDailyLessonCompleted(testUserId, lId);
      expect(res1.isNew).toBe(true);
      const scoreAfterFirst = res1.activity.score;

      const res2 = repository.recordDailyLessonCompleted(testUserId, lId);
      expect(res2.isNew).toBe(false);
      expect(res2.activity.score).toBe(scoreAfterFirst);
    });
  });

  describe('3. Streak Calculation & Grace Period Tests', () => {
    it('Maintains streak when yesterday was active and today is pending (todayNeedSave = true)', async () => {
      const regRes = await request(app).post('/api/auth/register').send({
        displayName: 'GraceUser',
        loginOrEmail: 'streak_grace_' + Date.now(),
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });
      expect(regRes.status).toBe(201);
      const uid = regRes.body.data.user.id;
      createdUserIds.push(uid);

      const todayStr = getTashkentDateString();
      const [y, m, d] = todayStr.split('-').map(Number);
      const todayDate = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));

      // 1 day ago (yesterday): active with 5 questions
      const yesterday = getTashkentDateString(new Date(todayDate.getTime() - 24 * 3600 * 1000));
      repository.setDailyActivityForTesting(uid, yesterday, 5, 0);

      // 2 days ago: active with 1 lesson
      const twoDaysAgo = getTashkentDateString(new Date(todayDate.getTime() - 2 * 24 * 3600 * 1000));
      repository.setDailyActivityForTesting(uid, twoDaysAgo, 0, 1);

      // Today has 0 activity
      const streakInfo = repository.calculateStreak(uid);
      expect(streakInfo.currentStreak).toBe(2);
      expect(streakInfo.todayNeedSave).toBe(true);

      // User solves 1 question today: streak increments to 3, todayNeedSave becomes false
      repository.recordDailyCorrectAnswer(uid, 'q_today_save');
      const updatedStreak = repository.calculateStreak(uid);
      expect(updatedStreak.currentStreak).toBe(3);
      expect(updatedStreak.todayNeedSave).toBe(false);
    });

    it('Resets streak to 0 when both today and yesterday have no activity', async () => {
      const regRes = await request(app).post('/api/auth/register').send({
        displayName: 'ResetUser',
        loginOrEmail: 'streak_reset_' + Date.now(),
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });
      expect(regRes.status).toBe(201);
      const uid = regRes.body.data.user.id;
      createdUserIds.push(uid);

      const todayStr = getTashkentDateString();
      const [y, m, d] = todayStr.split('-').map(Number);
      const todayDate = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));

      // 2 days ago was active, but yesterday was missed!
      const twoDaysAgo = getTashkentDateString(new Date(todayDate.getTime() - 2 * 24 * 3600 * 1000));
      repository.setDailyActivityForTesting(uid, twoDaysAgo, 10, 0);

      const streakInfo = repository.calculateStreak(uid);
      expect(streakInfo.currentStreak).toBe(0);
      expect(streakInfo.todayNeedSave).toBe(false);
    });
  });

  describe('4. Midnight Transition in Tashkent Timezone (UTC+5)', () => {
    it('Transitions day boundary at 00:00 Tashkent time (19:00 UTC)', () => {
      // 2026-11-26 18:59:59 UTC = 2026-11-26 23:59:59 Tashkent time -> Day is 2026-11-26
      const beforeMidnightUTC = new Date('2026-11-26T18:59:59Z');
      expect(getTashkentDateString(beforeMidnightUTC)).toBe('2026-11-26');

      // 2026-11-26 19:00:01 UTC = 2026-11-27 00:00:01 Tashkent time -> Day is 2026-11-27
      const afterMidnightUTC = new Date('2026-11-26T19:00:01Z');
      expect(getTashkentDateString(afterMidnightUTC)).toBe('2026-11-27');
    });
  });

  describe('5. GET /api/activity/week Endpoint Verification', () => {
    it('Returns 7 days for the current week, streak info, and today level', async () => {
      const res = await request(app)
        .get('/api/activity/week')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();

      const { days, currentStreak, maxStreak, todayLevel, serverDate, secondsUntilMidnight } = res.body.data;
      expect(Array.isArray(days)).toBe(true);
      expect(days.length).toBe(7);

      // Verify each day object structure
      for (const day of days) {
        expect(day.date).toBeDefined();
        expect(day.weekday).toBeDefined();
        expect(day.weekdayName).toBeDefined();
        expect(typeof day.correctAnswers).toBe('number');
        expect(typeof day.lessonsCompleted).toBe('number');
        expect(typeof day.score).toBe('number');
        expect(['NONE', 'LOW', 'MEDIUM', 'HIGH']).toContain(day.level);
        expect(typeof day.isToday).toBe('boolean');
        expect(typeof day.isFuture).toBe('boolean');
      }

      expect(typeof currentStreak).toBe('number');
      expect(typeof maxStreak).toBe('number');
      expect(['NONE', 'LOW', 'MEDIUM', 'HIGH']).toContain(todayLevel);
      expect(typeof serverDate).toBe('string');
      expect(typeof secondsUntilMidnight).toBe('number');
    });
  });
});
