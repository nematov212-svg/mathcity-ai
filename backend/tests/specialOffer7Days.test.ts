import request from 'supertest';
import { app } from '../src/app.js';
import { repository, UserAccount } from '../src/utils/repository.js';
import { paymentDataStore } from '../src/modules/payments/paymentStore.js';
import { discountStore } from '../src/modules/pricing/discountStore.js';
import jwt from 'jsonwebtoken';
import { config } from '../src/config/env.js';

function createTestUser(overrides: Partial<UserAccount>): UserAccount {
  const now = new Date();
  const defaultUser: UserAccount = {
    id: `user_offer_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: `offer_test_${Date.now()}_${Math.random().toString(36).substring(2, 5)}@mathcity.ai`,
    displayName: 'Test O‘quvchi',
    dateOfBirth: '2016-01-01',
    age: 9,
    mode: 'KIDS',
    grade: 3,
    avatarUrl: 'assets/images/avatar_kid.png',
    profileCompleted: true,
    parentalConsentRequired: false,
    coinBalance: 100,
    totalXP: 50,
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
  return defaultUser;
}

describe('Maxsus taklif • 30% chegirma (7 kunlik qoida & Server Authority)', () => {
  beforeEach(() => {
    discountStore.updateSettings({
      enabled: true,
      discountPercent: 30,
      durationDays: 7,
      applicablePlans: ['monthly', 'yearly'],
    });
  });

  // 1. Yangi foydalanuvchi (ro'yxatdan o'tganiga 1 soat bo'lgan) -> eligible: true
  it('1. Yangi foydalanuvchida (1 soat oldin ochilgan) 30% chegirma faol, narxlar 20 300 va 175 000 so‘m', async () => {
    const oneHourAgo = new Date(Date.now() - 3600 * 1000).toISOString();
    const user = createTestUser({ createdAt: oneHourAgo });
    const token = jwt.sign({ userId: user.id }, config.jwtSecret);

    const res = await request(app)
      .get('/api/user/offer')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.eligible).toBe(true);
    expect(res.body.discountPercent).toBe(30);
    expect(res.body.monthlyPrice).toBe(20300);
    expect(res.body.yearlyPrice).toBe(175000);
    expect(res.body.baseMonthlyPrice).toBe(29000);
    expect(res.body.baseYearlyPrice).toBe(250000);
    expect(res.body.expiresAt).toBeTruthy();

    const expiry = new Date(res.body.expiresAt).getTime();
    const created = new Date(oneHourAgo).getTime();
    const diffDays = (expiry - created) / (86400 * 1000);
    expect(Math.round(diffDays)).toBe(7);
  });

  // 2. 7 kundan oshgan foydalanuvchi (7 kun + 1 daqiqa) -> eligible: false, narxlar oddiy
  it('2. 7 kundan oshgan foydalanuvchida chegirma yo‘qoladi, narxlar 29 000 va 250 000 so‘m bo‘ladi', async () => {
    const sevenDaysAgo = new Date(Date.now() - (7 * 86400 * 1000 + 60 * 1000)).toISOString();
    const user = createTestUser({ createdAt: sevenDaysAgo });
    const token = jwt.sign({ userId: user.id }, config.jwtSecret);

    const res = await request(app)
      .get('/api/user/offer')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.eligible).toBe(false);
    expect(res.body.expiresAt).toBeNull();
    expect(res.body.monthlyPrice).toBe(29000);
    expect(res.body.yearlyPrice).toBe(250000);
  });

  // 3. Pro sotib olgan foydalanuvchi -> eligible: false
  it('3. Pro sotib olgan yoki Pro faol bo‘lgan foydalanuvchida chegirma qayta ko‘rinmaydi', async () => {
    const newUser = createTestUser({
      createdAt: new Date().toISOString(),
      subscription: {
        status: 'PRO_ACTIVE',
        planName: 'MathCity Pro',
        trialStartedAt: new Date().toISOString(),
        trialExpiresAt: new Date().toISOString(),
        proStartedAt: new Date().toISOString(),
        proExpiresAt: new Date(Date.now() + 30 * 86400 * 1000).toISOString(),
        priceMonthlyUzs: 29000,
      },
    });
    const token = jwt.sign({ userId: newUser.id }, config.jwtSecret);

    const res = await request(app)
      .get('/api/user/offer')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.eligible).toBe(false);
    expect(res.body.monthlyPrice).toBe(29000);
    expect(res.body.yearlyPrice).toBe(250000);
  });

  // 4. Chegirmani allaqachon ishlatgan foydalanuvchi -> eligible: false
  it('4. Chegirmadan oldin foydalangan (newUserDiscountUsedAt) foydalanuvchiga qayta ko‘rsatilmaydi', async () => {
    const usedUser = createTestUser({
      createdAt: new Date().toISOString(),
      newUserDiscountUsedAt: new Date().toISOString(),
    });
    const token = jwt.sign({ userId: usedUser.id }, config.jwtSecret);

    const res = await request(app)
      .get('/api/user/offer')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.eligible).toBe(false);
  });

  // 5. Telefon soatini o'zgartirish holati (Server authority)
  it('5. Telefon soatini o‘zgartirib bo‘lmaydi: server faqat server vaqti va serverdagi createdAt bo‘yicha hisoblaydi', async () => {
    // User registered 8 days ago on server
    const oldUser = createTestUser({
      createdAt: new Date(Date.now() - 8 * 86400 * 1000).toISOString(),
    });
    const token = jwt.sign({ userId: oldUser.id }, config.jwtSecret);

    // Client passes arbitrary client timestamps or fake headers
    const res = await request(app)
      .get('/api/user/offer')
      .set('Authorization', `Bearer ${token}`)
      .set('x-client-time', new Date(Date.now() - 1000).toISOString())
      .set('x-device-now', new Date().toISOString());

    expect(res.status).toBe(200);
    // Server rejects eligibility regardless of client clock
    expect(res.body.eligible).toBe(false);
    expect(res.body.monthlyPrice).toBe(29000);
    expect(res.body.yearlyPrice).toBe(250000);
  });

  // 6. To'lovda chegirmali narxni tekshirish (eligible bo'lmasa 400 rad etiladi)
  it('6. Muddati o‘tgan user chegirmali narx bilan to‘lov boshlasa, server 400 bilan rad etadi', async () => {
    const expiredUser = createTestUser({
      createdAt: new Date(Date.now() - 9 * 86400 * 1000).toISOString(),
    });
    const token = jwt.sign({ userId: expiredUser.id }, config.jwtSecret);

    const res = await request(app)
      .post('/api/payments/create-order')
      .set('Authorization', `Bearer ${token}`)
      .send({ planType: 'MONTHLY', applyDiscount: true, requestedPrice: 20300 });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Chegirma muddati tugagan');
  });

  // 7. Yangi foydalanuvchi chegirma bilan to'lov qilsa, buyurtma 20 300 so'm bilan yaratiladi
  it('7. Yangi eligible foydalanuvchi chegirma bilan to‘lov yarata oladi (20 300 so‘m oylik, 175 000 so‘m yillik)', async () => {
    const newUser = createTestUser({
      createdAt: new Date().toISOString(),
    });
    const token = jwt.sign({ userId: newUser.id }, config.jwtSecret);

    // Monthly
    const resMonthly = await request(app)
      .post('/api/payments/create-order')
      .set('Authorization', `Bearer ${token}`)
      .send({ planType: 'MONTHLY', applyDiscount: true });

    expect(resMonthly.status).toBe(200);
    expect(resMonthly.body.data.amountUzs).toBe(20300);

    // Yearly
    const resYearly = await request(app)
      .post('/api/payments/create-order')
      .set('Authorization', `Bearer ${token}`)
      .send({ planType: 'YEARLY', applyDiscount: true });

    expect(resYearly.status).toBe(200);
    expect(resYearly.body.data.amountUzs).toBe(175000);
  });
});
