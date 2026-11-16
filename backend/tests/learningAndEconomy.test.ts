import { repository } from '../src/utils/repository.js';

describe('MathCity AI Core Learning, Economy & Subscription Engine', () => {
  const testUserId = 'test-student-unique-101';

  beforeEach(() => {
    // Reset test user with 0 coins
    const now = new Date();
    const trialExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    repository.createUser({
      id: testUserId,
      email: 'test@mathcity.ai',
      displayName: 'Temur',
      dateOfBirth: '2015-01-01',
      age: 11,
      mode: 'KIDS',
      grade: 4,
      avatarUrl: 'avatar.png',
      coinBalance: 0, // Starts at 0 coins
      totalXP: 0,
      level: 1,
      cityLevel: 1,
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
    });
  });

  test('Required Test: Solve 10 unique mathematics questions correctly -> exactly 10 coins earned', () => {
    let lastResult: any;

    for (let i = 1; i <= 10; i++) {
      const qId = `g3-s1-q${i}`;
      lastResult = repository.submitQuestionAnswer(testUserId, qId, true);
      expect(lastResult.coinsAwarded).toBe(1); // EXACTLY +1 coin per unique question
      expect(lastResult.newCoinBalance).toBe(i); // Balance increments by 1
    }

    expect(lastResult.newCoinBalance).toBe(10);
    expect(lastResult.totalAttempted).toBe(10);
    expect(lastResult.totalCorrect).toBe(10);
    expect(lastResult.accuracyPercentage).toBe(100);
  });

  test('Required Test: Repeat one already rewarded question -> balance remains 10 coins (+0 coins)', () => {
    // First, earn 10 coins by solving 10 questions
    for (let i = 1; i <= 10; i++) {
      repository.submitQuestionAnswer(testUserId, `g3-s1-q${i}`, true);
    }
    const userBefore = repository.getUserById(testUserId)!;
    expect(userBefore.coinBalance).toBe(10);

    // Repeat question 1
    const repeatResult = repository.submitQuestionAnswer(testUserId, 'g3-s1-q1', true);
    expect(repeatResult.coinsAwarded).toBe(0); // 0 extra coins!
    expect(repeatResult.newCoinBalance).toBe(10); // Balance remains strictly 10!
    expect(repeatResult.isFirstTimeCorrect).toBe(false);
  });

  test('Required Demonstration Case: Start with 100 coins -> Buy 100-coin building -> Balance is 0 -> Building appears in city and persists', () => {
    // Credit 100 coins
    repository.creditCoins(testUserId, 100, 'Test credit');
    const user = repository.getUserById(testUserId)!;
    expect(user.coinBalance).toBe(100);

    // Purchase 100-coin building "Kichik uy"
    const purchase = repository.purchaseAndPlaceBuilding(testUserId, 'house_basic', 2, 2);
    expect(purchase.newCoinBalance).toBe(0); // Exactly 0 balance!
    expect(purchase.buildingKey).toBe('house_basic');

    // Verify persistence
    const reloaded = repository.getUserById(testUserId)!;
    expect(reloaded.coinBalance).toBe(0);
    expect(reloaded.placedBuildings.some((b) => b.buildingKey === 'house_basic' && b.gridX === 2 && b.gridY === 2)).toBe(true);
  });

  test('30-Day Free Trial & Subscription Entitlement', () => {
    const sub = repository.getSubscription(testUserId);
    expect(sub.status).toBe('FREE_TRIAL_ACTIVE');
    expect(sub.trialDaysRemaining).toBeGreaterThanOrEqual(29);
    expect(sub.priceMonthlyUzs).toBe(29000);
    expect(sub.planName).toBe('MathCity Free Trial');

    // Activate Pro
    const pro = repository.activatePro(testUserId, 'google_play', 'order-12345');
    expect(pro.status).toBe('PRO_ACTIVE');

    const updatedSub = repository.getSubscription(testUserId);
    expect(updatedSub.status).toBe('PRO_ACTIVE');
    expect(updatedSub.isProActive).toBe(true);
  });
});
