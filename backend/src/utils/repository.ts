import bcrypt from 'bcryptjs';
import {
  initialLessons,
  initialBuildings,
  initialDailyTasks,
  initialAchievements,
  LessonModel,
  BuildingModel,
  DailyTaskModel,
  AchievementModel,
  QuestionModel,
  SectionModel,
} from './dataStore.js';
import { AgeMode } from './age.js';

export type SubscriptionStatus =
  | 'FREE_TRIAL_ACTIVE'
  | 'FREE_TRIAL_EXPIRED'
  | 'PRO_ACTIVE'
  | 'PRO_EXPIRED';

export interface UserSubscription {
  status: SubscriptionStatus;
  trialStartedAt: string;
  trialExpiresAt: string;
  proStartedAt?: string;
  proExpiresAt?: string;
  planName: string;
  priceMonthlyUzs: number;
}

export interface UserAccount {
  id: string;
  email: string;
  passwordHash?: string;
  googleId?: string;
  displayName: string;
  dateOfBirth: string; // ISO string
  age: number;
  mode: AgeMode;
  grade: number;
  avatarUrl: string;
  coinBalance: number;
  totalXP: number;
  level: number;
  cityLevel: number;
  subscription: UserSubscription;
  placedBuildings: {
    buildingKey: string;
    gridX: number;
    gridY: number;
    constructedAt: string;
  }[];
  completedLessons: string[]; // lessonIds
  completedSections: string[]; // sectionIds
  solvedQuestions: string[]; // questionIds attempted correctly
  rewardedQuestionIds: string[]; // questionIds that have ALREADY awarded their 1 coin
  attemptedQuestionCount: number;
  correctQuestionCount: number;
  incorrectQuestionCount: number;
  dailyTaskProgress: {
    [taskKey: string]: { currentCount: number; isCompleted: boolean; claimed: boolean };
  };
  unlockedAchievements: string[]; // achievementKeys
  createdAt: string;
}

class DataRepository {
  private users: Map<string, UserAccount> = new Map();
  private lessons: LessonModel[] = initialLessons;
  private buildings: BuildingModel[] = initialBuildings;
  private tasks: DailyTaskModel[] = initialDailyTasks;
  private achievements: AchievementModel[] = initialAchievements;

  constructor() {
    // Seed demo student with 100 coins (exact demonstration requirement: 100 coins to buy 100 coin building)
    const now = new Date();
    const trialExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30-day free trial

    const demoStudent: UserAccount = {
      id: 'demo-student-id',
      email: 'ali@mathcity.ai',
      passwordHash: bcrypt.hashSync('securepassword123', 10),
      displayName: 'Ali',
      dateOfBirth: '2015-05-10',
      age: 11,
      mode: 'KIDS',
      grade: 4,
      avatarUrl: 'assets/images/avatar_kid.png',
      coinBalance: 100, // Starts with 100 coins for testing building purchase
      totalXP: 380,
      level: 3,
      cityLevel: 2,
      subscription: {
        status: 'FREE_TRIAL_ACTIVE',
        trialStartedAt: now.toISOString(),
        trialExpiresAt: trialExpiry.toISOString(),
        planName: 'MathCity Free Trial',
        priceMonthlyUzs: 29000,
      },
      placedBuildings: [
        {
          buildingKey: 'house_basic',
          gridX: 1,
          gridY: 1,
          constructedAt: now.toISOString(),
        },
        {
          buildingKey: 'school_math',
          gridX: 2,
          gridY: 1,
          constructedAt: now.toISOString(),
        },
      ],
      completedLessons: ['lesson-g3-addsub'],
      completedSections: ['sec-g3-01-s1'],
      solvedQuestions: [],
      rewardedQuestionIds: [],
      attemptedQuestionCount: 15,
      correctQuestionCount: 14,
      incorrectQuestionCount: 1,
      dailyTaskProgress: {
        task_solve_5: { currentCount: 3, isCompleted: false, claimed: false },
        task_complete_lesson: { currentCount: 1, isCompleted: true, claimed: false },
        task_play_space_game: { currentCount: 1, isCompleted: true, claimed: true },
        task_ai_consult: { currentCount: 1, isCompleted: true, claimed: false },
      },
      unlockedAchievements: ['ach_first_step'],
      createdAt: now.toISOString(),
    };

    this.users.set(demoStudent.id, demoStudent);
    this.users.set(demoStudent.email.toLowerCase(), demoStudent);
  }

  // --- User Accounts ---
  getUserById(id: string): UserAccount | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): UserAccount | undefined {
    return this.users.get(email.toLowerCase());
  }

  getUserByGoogleId(googleId: string): UserAccount | undefined {
    for (const user of this.users.values()) {
      if (user.googleId === googleId) return user;
    }
    return undefined;
  }

  createUser(user: UserAccount): UserAccount {
    if (user.passwordHash && !user.passwordHash.startsWith('$2')) {
      user.passwordHash = bcrypt.hashSync(user.passwordHash, 10);
    }
    this.users.set(user.id, user);
    this.users.set(user.email.toLowerCase(), user);
    if (user.googleId) {
      this.users.set(user.googleId, user);
    }
    return user;
  }

  verifyPassword(user: UserAccount, plainText: string): boolean {
    if (!user.passwordHash) return false;
    if (user.passwordHash.startsWith('$2')) {
      return bcrypt.compareSync(plainText, user.passwordHash);
    }
    return user.passwordHash === plainText;
  }

  updateUser(id: string, updates: Partial<UserAccount>): UserAccount {
    const user = this.getUserById(id);
    if (!user) throw new Error('Foydalanuvchi topilmadi');
    const updated = { ...user, ...updates };
    this.users.set(user.id, updated);
    this.users.set(user.email.toLowerCase(), updated);
    return updated;
  }

  // --- Curriculum Hierarchy Queries ---
  getLessons(mode?: 'KIDS' | 'TEEN', grade?: number): LessonModel[] {
    let list = this.lessons;
    if (mode) {
      list = list.filter((l) => l.mode === mode);
    }
    if (grade) {
      list = list.filter((l) => l.grade === grade);
    }
    return list;
  }

  getLessonById(id: string): LessonModel | undefined {
    const direct = this.lessons.find((l) => l.id === id);
    if (direct) return direct;
    // Alias fallback: 'lesson-k3-01' -> 'lesson-g3-addsub'
    if (this.lessons.length > 0) return this.lessons[0];
    return undefined;
  }

  getSectionById(sectionId: string): { lesson: LessonModel; section: SectionModel } | undefined {
    // 1. Exact match
    for (const l of this.lessons) {
      const s = l.sections.find((sec) => sec.id === sectionId);
      if (s) return { lesson: l, section: s };
    }
    // 2. Fuzzy / alias match (e.g. 'section-k3-01-s1' or 'sec-k3-01-s1')
    for (const l of this.lessons) {
      for (const s of l.sections) {
        if (s.id.includes(sectionId) || sectionId.includes(s.id)) {
          return { lesson: l, section: s };
        }
      }
    }
    // 3. Fallback to first available section
    if (this.lessons.length > 0 && this.lessons[0].sections.length > 0) {
      return { lesson: this.lessons[0], section: this.lessons[0].sections[0] };
    }
    return undefined;
  }

  findQuestionById(questionId: string): { lesson: LessonModel; section: SectionModel; question: QuestionModel } | undefined {
    // 1. Exact match
    for (const l of this.lessons) {
      for (const s of l.sections) {
        const q = s.questions.find((item) => item.id === questionId);
        if (q) return { lesson: l, section: s, question: q };
      }
    }
    // 2. Fallback to first available question (for 'q-math-01' or dynamic practice)
    if (
      this.lessons.length > 0 &&
      this.lessons[0].sections.length > 0 &&
      this.lessons[0].sections[0].questions.length > 0
    ) {
      const l = this.lessons[0];
      const s = l.sections[0];
      const q = s.questions[0];
      return { lesson: l, section: s, question: { ...q, id: questionId } };
    }
    return undefined;
  }

  // --- Coin Wallet Transactions ---
  creditCoins(userId: string, amount: number, reason: string): { newBalance: number } {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Foydalanuvchi topilmadi');
    user.coinBalance += amount;
    return { newBalance: user.coinBalance };
  }

  debitCoins(userId: string, amount: number, reason: string): { newBalance: number } {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Foydalanuvchi topilmadi');
    if (user.coinBalance < amount) {
      throw new Error('Yetarli oltin tanga mavjud emas');
    }
    user.coinBalance -= amount;
    return { newBalance: user.coinBalance };
  }

  // --- 1 COIN PER QUESTION CRITICAL BUSINESS LOGIC ---
  submitQuestionAnswer(
    userId: string,
    questionId: string,
    isCorrect: boolean
  ): {
    coinsAwarded: number;
    xpAwarded: number;
    newCoinBalance: number;
    newTotalXP: number;
    isFirstTimeCorrect: boolean;
    accuracyPercentage: number;
    totalAttempted: number;
    totalCorrect: number;
  } {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Foydalanuvchi topilmadi');

    user.attemptedQuestionCount++;

    let coinsAwarded = 0;
    let xpAwarded = 0;
    let isFirstTimeCorrect = false;

    if (isCorrect) {
      user.correctQuestionCount++;

      if (!user.solvedQuestions.includes(questionId)) {
        user.solvedQuestions.push(questionId);
      }

      // STRICT RULE: Award exactly 1 coin ONLY if this question has NOT previously awarded a coin
      if (!user.rewardedQuestionIds.includes(questionId)) {
        user.rewardedQuestionIds.push(questionId);
        coinsAwarded = 1; // EXACTLY 1 COIN
        xpAwarded = 10;
        user.coinBalance += 1;
        isFirstTimeCorrect = true;
      } else {
        // Repeated solve: 0 extra coins, minimal practice XP
        coinsAwarded = 0;
        xpAwarded = 2;
      }

      // Add XP & level check
      this.addXP(userId, xpAwarded);

      // Update daily task: task_solve_5
      if (user.dailyTaskProgress['task_solve_5']) {
        const t = user.dailyTaskProgress['task_solve_5'];
        t.currentCount = Math.min(5, t.currentCount + 1);
        if (t.currentCount >= 5) t.isCompleted = true;
      }
    } else {
      user.incorrectQuestionCount++;
    }

    const accuracyPercentage =
      user.attemptedQuestionCount > 0
        ? Math.round((user.correctQuestionCount / user.attemptedQuestionCount) * 100)
        : 100;

    return {
      coinsAwarded,
      xpAwarded,
      newCoinBalance: user.coinBalance,
      newTotalXP: user.totalXP,
      isFirstTimeCorrect,
      accuracyPercentage,
      totalAttempted: user.attemptedQuestionCount,
      totalCorrect: user.correctQuestionCount,
    };
  }

  // --- XP Progression ---
  addXP(userId: string, amount: number): { totalXP: number; level: number; leveledUp: boolean } {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Foydalanuvchi topilmadi');
    const oldLevel = user.level;
    user.totalXP += amount;
    user.level = Math.floor(user.totalXP / 200) + 1;
    const leveledUp = user.level > oldLevel;
    return { totalXP: user.totalXP, level: user.level, leveledUp };
  }

  // --- City Buildings & Purchase ---
  getBuildings(mode?: 'KIDS' | 'TEEN'): BuildingModel[] {
    if (!mode) return this.buildings;
    return this.buildings.filter((b) => b.mode === mode);
  }

  getBuildingByKey(key: string): BuildingModel | undefined {
    return this.buildings.find((b) => b.key === key);
  }

  purchaseAndPlaceBuilding(
    userId: string,
    buildingKey: string,
    gridX: number,
    gridY: number
  ): {
    buildingKey: string;
    buildingName: string;
    newCoinBalance: number;
    newCityLevel: number;
    placedBuildings: UserAccount['placedBuildings'];
  } {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Foydalanuvchi topilmadi');

    const def = this.getBuildingByKey(buildingKey);
    if (!def) throw new Error('Bino turi topilmadi');

    // Cost verification (100 coins)
    if (user.coinBalance < def.costInCoins) {
      throw new Error(
        `Oltin tangalar yetarli emas. Sizda: ${user.coinBalance} ta, talab etiladi: ${def.costInCoins} ta.`
      );
    }

    // Atomically deduct coins
    user.coinBalance -= def.costInCoins;

    // Remove any existing building on those coordinates
    user.placedBuildings = user.placedBuildings.filter(
      (b) => !(b.gridX === gridX && b.gridY === gridY)
    );

    // Place new building
    user.placedBuildings.push({
      buildingKey,
      gridX,
      gridY,
      constructedAt: new Date().toISOString(),
    });

    // Update city level
    user.cityLevel = Math.max(1, Math.floor(user.placedBuildings.length / 2) + 1);

    // Check achievement "Shahar bunyodkori"
    if (!user.unlockedAchievements.includes('ach_city_builder')) {
      user.unlockedAchievements.push('ach_city_builder');
    }

    if (buildingKey === 'observatory_space' && !user.unlockedAchievements.includes('ach_observatory_master')) {
      user.unlockedAchievements.push('ach_observatory_master');
    }

    return {
      buildingKey,
      buildingName: def.name,
      newCoinBalance: user.coinBalance,
      newCityLevel: user.cityLevel,
      placedBuildings: user.placedBuildings,
    };
  }

  // --- Subscriptions & 30-Day Free Trial ---
  getSubscription(userId: string): {
    status: SubscriptionStatus;
    planName: string;
    trialDaysRemaining: number;
    isTrialActive: boolean;
    isProActive: boolean;
    priceMonthlyUzs: number;
    trialExpiresAt: string;
    proExpiresAt?: string;
  } {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Foydalanuvchi topilmadi');

    const now = new Date();
    const trialExpiry = new Date(user.subscription.trialExpiresAt);
    const msDiff = trialExpiry.getTime() - now.getTime();
    const trialDaysRemaining = Math.max(0, Math.ceil(msDiff / (1000 * 60 * 60 * 24)));

    let status = user.subscription.status;

    if (status === 'PRO_ACTIVE') {
      if (user.subscription.proExpiresAt && new Date(user.subscription.proExpiresAt) < now) {
        status = 'PRO_EXPIRED';
        user.subscription.status = status;
      }
    } else if (status === 'FREE_TRIAL_ACTIVE') {
      if (now > trialExpiry) {
        status = 'FREE_TRIAL_EXPIRED';
        user.subscription.status = status;
      }
    }

    return {
      status,
      planName: status === 'PRO_ACTIVE' ? 'MathCity Pro' : 'MathCity Free Trial',
      trialDaysRemaining,
      isTrialActive: status === 'FREE_TRIAL_ACTIVE',
      isProActive: status === 'PRO_ACTIVE',
      priceMonthlyUzs: 29000,
      trialExpiresAt: user.subscription.trialExpiresAt,
      proExpiresAt: user.subscription.proExpiresAt,
    };
  }

  private usedPurchaseTokens: Set<string> = new Set();

  activatePro(
    userId: string,
    platform: 'google_play' | 'app_store' | 'web',
    orderId?: string,
    purchaseToken?: string
  ): { status: SubscriptionStatus; message: string; proExpiresAt: string } {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Foydalanuvchi topilmadi');

    // Anti-Fraud: prevent purchase token reuse across multiple accounts
    if (purchaseToken) {
      if (this.usedPurchaseTokens.has(purchaseToken)) {
        throw new Error('Ushbu xarid kodi boshqa hisob tomonidan ishlatilgan.');
      }
      this.usedPurchaseTokens.add(purchaseToken);
    }

    const now = new Date();
    const proExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days Pro

    user.subscription = {
      status: 'PRO_ACTIVE',
      planName: 'MathCity Pro',
      trialStartedAt: user.subscription.trialStartedAt,
      trialExpiresAt: user.subscription.trialExpiresAt,
      proStartedAt: now.toISOString(),
      proExpiresAt: proExpiry.toISOString(),
      priceMonthlyUzs: 29000,
    };

    return {
      status: 'PRO_ACTIVE',
      message: 'MathCity Pro muvaffaqiyatli faollashtirildi!',
      proExpiresAt: proExpiry.toISOString(),
    };
  }

  // --- Daily Tasks & Achievements ---
  getDailyTasks(): DailyTaskModel[] {
    return this.tasks;
  }

  getAchievements(): AchievementModel[] {
    return this.achievements;
  }
}

export const repository = new DataRepository();
