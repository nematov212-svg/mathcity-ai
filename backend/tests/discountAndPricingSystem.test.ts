import request from 'supertest';
import { app } from '../src/app.js';
import { repository, UserAccount } from '../src/utils/repository.js';
import { paymentDataStore } from '../src/modules/payments/paymentStore.js';
import { discountStore } from '../src/modules/pricing/discountStore.js';
import jwt from 'jsonwebtoken';
import { config } from '../src/config/env.js';

function createTestUser(overrides: Partial<UserAccount>): UserAccount {
  const now = new Date();
  const trialExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const defaultUser: UserAccount = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: `test_${Date.now()}_${Math.random().toString(36).substring(2, 5)}@mathcity.ai`,
    displayName: 'Test O‘quvchi',
    dateOfBirth: '2015-05-10',
    age: 11,
    mode: 'KIDS',
    grade: 4,
    avatarUrl: 'assets/images/avatar_kid.png',
    profileCompleted: true,
    parentalConsentRequired: false,
    coinBalance: 0,
    totalXP: 0,
    level: 1,
    cityLevel: 1,
    currentStreak: 1,
    longestStreak: 1,
    subscription: {
      status: 'FREE_TRIAL_ACTIVE',
      trialStartedAt: now.toISOString(),
      trialExpiresAt: trialExpiry.toISOString(),
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

describe('1-BOSQICH: Chegirma Tizimi (Server-side Authoritative Pricing & Rules)', () => {
  const adminSecret = process.env.ADMIN_API_KEY || 'mathcity_admin_master_secret_2026';

  beforeEach(() => {
    // Reset discount settings to defaults: 30%, 7 days, monthly only
    discountStore.updateSettings({
      enabled: true,
      discountPercent: 30,
      durationDays: 7,
      applicablePlans: ['monthly'],
    });
  });

  it('1. 6 kun 23 soat 59 daqiqalik yangi foydalanuvchida 30% chegirma mavjud (20 300 so‘m)', async () => {
    const sixDaysAgo = new Date(Date.now() - (6 * 86400 * 1000 + 23 * 3600 * 1000 + 59 * 60 * 1000)).toISOString();
    const user = createTestUser({
      createdAt: sixDaysAgo,
    });
    const token = jwt.sign({ userId: user.id }, config.jwtSecret);

    const res = await request(app)
      .get('/api/pricing')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const data = res.body.data;
    expect(data.hasDiscount).toBe(true);
    expect(data.discountPercent).toBe(30);
    expect(data.eligibility.eligible).toBe(true);

    const monthly = data.plans.find((p: any) => p.planId === 'monthly');
    expect(monthly.basePrice).toBe(29000);
    expect(monthly.finalPrice).toBe(20300);
    expect(monthly.isDiscounted).toBe(true);

    const yearly = data.plans.find((p: any) => p.planId === 'yearly');
    expect(yearly.basePrice).toBe(250000);
    expect(yearly.finalPrice).toBe(250000); // Only monthly has discount by default
    expect(yearly.isDiscounted).toBe(false);

    expect(data.discountEndsAt).toBeTruthy();
    expect(data.serverNow).toBeTruthy();
  });

  it('2. 7 kun + 1 soniya o‘tgan foydalanuvchida chegirma yo‘qoladi (asl narx: 29 000 so‘m)', async () => {
    const sevenDaysPlusOneSec = new Date(Date.now() - (7 * 86400 * 1000 + 1000)).toISOString();
    const user = createTestUser({
      createdAt: sevenDaysPlusOneSec,
    });
    const token = jwt.sign({ userId: user.id }, config.jwtSecret);

    const res = await request(app)
      .get('/api/pricing')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const data = res.body.data;
    expect(data.hasDiscount).toBe(false);
    expect(data.discountPercent).toBe(0);
    expect(data.eligibility.eligible).toBe(false);

    const monthly = data.plans.find((p: any) => p.planId === 'monthly');
    expect(monthly.finalPrice).toBe(29000);
    expect(monthly.isDiscounted).toBe(false);
  });

  it('3. Allaqachon Pro bo‘lgan foydalanuvchiga chegirma ko‘rsatilmaydi', async () => {
    const newUserTime = new Date().toISOString();
    const user = createTestUser({
      createdAt: newUserTime,
      subscription: {
        status: 'PRO_ACTIVE',
        planName: 'MathCity Pro',
        trialStartedAt: newUserTime,
        trialExpiresAt: newUserTime,
        proStartedAt: newUserTime,
        proExpiresAt: new Date(Date.now() + 30 * 86400 * 1000).toISOString(),
        priceMonthlyUzs: 29000,
      },
    });
    const token = jwt.sign({ userId: user.id }, config.jwtSecret);

    const res = await request(app)
      .get('/api/pricing')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const data = res.body.data;
    expect(data.hasDiscount).toBe(false);
    expect(data.eligibility.eligible).toBe(false);
    expect(data.eligibility.reason).toContain('allaqachon PRO');
    const monthly = data.plans.find((p: any) => p.planId === 'monthly');
    expect(monthly.finalPrice).toBe(29000);
  });

  it('4. To‘lov qilgan foydalanuvchida keyingi safar chegirma bo‘lmaydi (bir marta amal qiladi)', async () => {
    const newUserTime = new Date().toISOString();
    const user = createTestUser({
      createdAt: newUserTime,
    });
    const token = jwt.sign({ userId: user.id }, config.jwtSecret);

    // Record a paid transaction in payment store
    paymentDataStore.recordTransaction({
      orderId: `ord_${Date.now()}`,
      userId: user.id,
      amountUzs: 20300,
      feeUzs: 406,
      netAmountUzs: 19894,
      status: 'SUCCESS',
      paymentMethod: 'CLICK',
      maskedCard: '8600 **** **** 1234',
      settled: true,
    });

    const res = await request(app)
      .get('/api/pricing')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const data = res.body.data;
    expect(data.hasDiscount).toBe(false);
    expect(data.eligibility.eligible).toBe(false);
    expect(data.eligibility.reason).toContain('faqat bir marta');
  });

  it('5. create-order: yangi foydalanuvchiga 20 300 so‘m beradi, muddati o‘tgan soxta chegirmali buyurtmani rad etadi (400)', async () => {
    // A) Eligible user
    const newUser = createTestUser({
      createdAt: new Date().toISOString(),
    });
    const eligibleToken = jwt.sign({ userId: newUser.id }, config.jwtSecret);

    const orderRes = await request(app)
      .post('/api/payments/create-order')
      .set('Authorization', `Bearer ${eligibleToken}`)
      .send({ planType: 'MONTHLY', applyDiscount: true });

    expect(orderRes.status).toBe(200);
    expect(orderRes.body.data.amountUzs).toBe(20300);

    // B) Expired user trying to claim discount
    const expiredUser = createTestUser({
      createdAt: new Date(Date.now() - 10 * 86400 * 1000).toISOString(), // 10 days ago
    });
    const expiredToken = jwt.sign({ userId: expiredUser.id }, config.jwtSecret);

    const rejectedRes = await request(app)
      .post('/api/payments/create-order')
      .set('Authorization', `Bearer ${expiredToken}`)
      .send({ planType: 'MONTHLY', applyDiscount: true });

    expect(rejectedRes.status).toBe(400);
    expect(rejectedRes.body.success).toBe(false);
    expect(rejectedRes.body.error).toContain('Chegirma muddati tugagan');
  });

  it('6. Admin panel > Sozlamalar: chegirma foizi, muddati va tariflarni o‘zgartirish auditga yoziladi', async () => {
    const updateRes = await request(app)
      .put('/api/admin/settings/discount')
      .set('x-admin-key', adminSecret)
      .send({
        enabled: true,
        discountPercent: 40,
        durationDays: 14,
        applicablePlans: ['monthly', 'yearly'],
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.discountPercent).toBe(40);
    expect(updateRes.body.data.durationDays).toBe(14);
    expect(updateRes.body.data.applicablePlans).toEqual(['monthly', 'yearly']);

    // Check pricing reflects updated 40% discount
    const pricingRes = await request(app).get('/api/pricing');
    const data = pricingRes.body.data;
    expect(data.discountPercent).toBe(40);
    const monthly = data.plans.find((p: any) => p.planId === 'monthly');
    expect(monthly.finalPrice).toBe(Math.round(29000 * 0.6)); // 17400
  });
});
