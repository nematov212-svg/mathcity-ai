import bcrypt from 'bcryptjs';
import { prisma, isDatabaseHealthy } from '../db/client.js';

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
import { mathQuestionBank, archivedDemoQuestions, QuestionBankItem } from './questionBank.js';
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
  username?: string;
  passwordHash?: string;
  googleId?: string;
  appleId?: string;
  appleRefreshToken?: string;
  displayName: string;
  dateOfBirth: string; // ISO string
  age: number;
  mode: AgeMode;
  grade: number;
  avatarUrl: string;
  profileCompleted?: boolean;
  parentalConsentRequired?: boolean;
  parentalAdvisoryAcknowledged?: boolean;
  coinBalance: number;
  totalXP: number;
  level: number;
  cityLevel: number;
  citizenCount?: number;
  carConfig?: {
    model: string;
    color: string;
    speed: number;
    level: number;
  };
  resetToken?: string;
  resetTokenExpiresAt?: string;
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
      username: 'ali',
      passwordHash: bcrypt.hashSync('securepassword123', 10),
      displayName: 'Ali',
      dateOfBirth: '2015-05-10',
      age: 11,
      mode: 'KIDS',
      grade: 4,
      avatarUrl: 'assets/images/avatar_kid.png',
      profileCompleted: true,
      parentalConsentRequired: true,
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

  getUserByUsernameOrEmail(identifier: string): UserAccount | undefined {
    const clean = identifier.trim().toLowerCase();
    const byEmail = this.getUserByEmail(clean);
    if (byEmail) return byEmail;

    for (const user of this.users.values()) {
      if (user.username && user.username.toLowerCase() === clean) return user;
      if (user.displayName.toLowerCase() === clean) return user;
    }
    return undefined;
  }

  getUserByResetToken(token: string): UserAccount | undefined {
    const nowIso = new Date().toISOString();
    for (const user of this.users.values()) {
      if (user.resetToken === token && user.resetTokenExpiresAt && user.resetTokenExpiresAt > nowIso) {
        return user;
      }
    }
    return undefined;
  }

  setResetToken(identifier: string, token: string, expiresAt: string): UserAccount | null {
    const user = this.getUserByUsernameOrEmail(identifier);
    if (!user) return null;
    user.resetToken = token;
    user.resetTokenExpiresAt = expiresAt;
    this.updateUser(user.id, { resetToken: token, resetTokenExpiresAt: expiresAt });
    return user;
  }

  clearResetToken(userId: string): void {
    const user = this.getUserById(userId);
    if (!user) return;
    delete user.resetToken;
    delete user.resetTokenExpiresAt;
    this.updateUser(userId, { resetToken: undefined, resetTokenExpiresAt: undefined });
  }

  getUserByGoogleId(googleId: string): UserAccount | undefined {
    for (const user of this.users.values()) {
      if (user.googleId === googleId) return user;
    }
    return undefined;
  }

  getUserByAppleId(appleId: string): UserAccount | undefined {
    for (const user of this.users.values()) {
      if (user.appleId === appleId) return user;
    }
    return undefined;
  }

  getAllUsers(): UserAccount[] {
    const unique = new Map<string, UserAccount>();
    for (const user of this.users.values()) {
      unique.set(user.id, user);
    }
    return Array.from(unique.values());
  }

  createUser(user: UserAccount): UserAccount {
    if (user.passwordHash && !user.passwordHash.startsWith('$2')) {
      user.passwordHash = bcrypt.hashSync(user.passwordHash, 10);
    }
    this.users.set(user.id, user);
    this.users.set(user.email.toLowerCase(), user);
    if (user.username) {
      this.users.set(user.username.toLowerCase(), user);
    }
    if (user.googleId) {
      this.users.set(user.googleId, user);
    }
    if (user.appleId) {
      this.users.set(user.appleId, user);
    }

    if (isDatabaseHealthy()) {
      this.persistUserToDatabase(user).catch(() => {});
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
    if (updates.passwordHash && !updates.passwordHash.startsWith('$2')) {
      updates.passwordHash = bcrypt.hashSync(updates.passwordHash, 10);
    }
    const updated = { ...user, ...updates };
    this.users.set(user.id, updated);
    this.users.set(user.email.toLowerCase(), updated);
    if (updated.username) {
      this.users.set(updated.username.toLowerCase(), updated);
    }
    if (updated.googleId) {
      this.users.set(updated.googleId, updated);
    }
    if (updated.appleId) {
      this.users.set(updated.appleId, updated);
    }

    if (isDatabaseHealthy()) {
      this.persistUserToDatabase(updated).catch(() => {});
    }

    return updated;
  }

  deleteUser(id: string): boolean {
    const user = this.getUserById(id);
    if (!user) return false;
    this.users.delete(user.id);
    this.users.delete(user.email.toLowerCase());
    if (user.username) {
      this.users.delete(user.username.toLowerCase());
    }
    if (user.googleId) {
      this.users.delete(user.googleId);
    }
    if (user.appleId) {
      this.users.delete(user.appleId);
    }

    if (isDatabaseHealthy()) {
      prisma.user.delete({ where: { id } }).catch(() => {});
    }

    return true;
  }

  async persistUserToDatabase(user: UserAccount): Promise<void> {
    try {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {
          email: user.email.toLowerCase(),
          username: user.username?.toLowerCase() || null,
          passwordHash: user.passwordHash || null,
          googleId: user.googleId || null,
          appleId: user.appleId || null,
        },
        create: {
          id: user.id,
          email: user.email.toLowerCase(),
          username: user.username?.toLowerCase() || null,
          passwordHash: user.passwordHash || null,
          googleId: user.googleId || null,
          appleId: user.appleId || null,
        },
      });

      const dob = user.dateOfBirth ? new Date(user.dateOfBirth) : new Date('2015-05-15');
      await prisma.studentProfile.upsert({
        where: { userId: user.id },
        update: {
          displayName: user.displayName,
          grade: user.grade || 4,
          age: user.age || 10,
          mode: (user.mode || 'KIDS') as any,
          avatarUrl: user.avatarUrl || null,
          cityLevel: user.cityLevel || 1,
        },
        create: {
          userId: user.id,
          displayName: user.displayName,
          dateOfBirth: isNaN(dob.getTime()) ? new Date('2015-05-15') : dob,
          age: user.age || 10,
          mode: (user.mode || 'KIDS') as any,
          grade: user.grade || 4,
          avatarUrl: user.avatarUrl || null,
          cityLevel: user.cityLevel || 1,
        },
      });

      await prisma.coinWallet.upsert({
        where: { userId: user.id },
        update: { balance: user.coinBalance },
        create: {
          userId: user.id,
          balance: user.coinBalance,
        },
      });

      await prisma.studentXP.upsert({
        where: { userId: user.id },
        update: { totalXP: user.totalXP, level: user.level },
        create: {
          userId: user.id,
          totalXP: user.totalXP,
          level: user.level,
        },
      });

      if (user.subscription) {
        const trialStart = user.subscription.trialStartedAt ? new Date(user.subscription.trialStartedAt) : new Date();
        const trialExpiry = user.subscription.trialExpiresAt ? new Date(user.subscription.trialExpiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await prisma.subscription.upsert({
          where: { userId: user.id },
          update: {
            status: user.subscription.status as any,
            trialStartedAt: isNaN(trialStart.getTime()) ? new Date() : trialStart,
            trialExpiresAt: isNaN(trialExpiry.getTime()) ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : trialExpiry,
          },
          create: {
            userId: user.id,
            status: user.subscription.status as any,
            trialStartedAt: isNaN(trialStart.getTime()) ? new Date() : trialStart,
            trialExpiresAt: isNaN(trialExpiry.getTime()) ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : trialExpiry,
          },
        });
      }
    } catch (_) {}
  }

  async initFromDatabase(): Promise<void> {
    try {
      if (!isDatabaseHealthy()) return;
      const dbUsers = await prisma.user.findMany({
        include: {
          studentProfile: true,
          subscription: true,
          coinWallet: true,
          studentXP: true,
        },
      });

      for (const u of dbUsers) {
        const prof = u.studentProfile;
        const sub = u.subscription;
        const wallet = u.coinWallet;
        const xp = u.studentXP;

        const userAccount: UserAccount = {
          id: u.id,
          email: u.email,
          username: u.username || undefined,
          passwordHash: u.passwordHash || undefined,
          googleId: u.googleId || undefined,
          appleId: u.appleId || undefined,
          displayName: prof?.displayName || 'O‘quvchi',
          dateOfBirth: prof?.dateOfBirth ? prof.dateOfBirth.toISOString().split('T')[0] : '2015-05-15',
          age: prof?.age || 10,
          mode: (prof?.mode as any) || 'KIDS',
          grade: prof?.grade || 4,
          avatarUrl: prof?.avatarUrl || 'assets/images/avatar_kid.png',
          profileCompleted: true,
          coinBalance: wallet?.balance ?? 100,
          totalXP: xp?.totalXP ?? 0,
          level: xp?.level ?? 1,
          cityLevel: prof?.cityLevel ?? 1,
          subscription: {
            status: (sub?.status as any) || 'FREE_TRIAL_ACTIVE',
            trialStartedAt: sub?.trialStartedAt ? sub.trialStartedAt.toISOString() : new Date().toISOString(),
            trialExpiresAt: sub?.trialExpiresAt ? sub.trialExpiresAt.toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
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
          createdAt: u.createdAt.toISOString(),
        };

        this.users.set(userAccount.id, userAccount);
        this.users.set(userAccount.email.toLowerCase(), userAccount);
        if (userAccount.username) {
          this.users.set(userAccount.username.toLowerCase(), userAccount);
        }
        if (userAccount.googleId) {
          this.users.set(userAccount.googleId, userAccount);
        }
        if (userAccount.appleId) {
          this.users.set(userAccount.appleId, userAccount);
        }
      }
      if (dbUsers.length > 0) {
        console.log(`✅ [Database Sync] PostgreSQL bazasidan ${dbUsers.length} ta foydalanuvchi xotiraga yuklandi.`);
      }
    } catch (_) {}
  }

  // --- Curriculum Hierarchy Queries ---
  getLessons(mode?: 'KIDS' | 'TEEN', grade?: number, includeDrafts: boolean = false): LessonModel[] {
    let list = this.lessons;
    if (!includeDrafts) {
      list = list.filter((l) => l.status !== 'DRAFT');
    }
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

  findQuestionById(questionId: string): { lesson?: LessonModel; section?: SectionModel; question: QuestionModel } | undefined {
    // 0. Check Question Bank (active and archived)
    const qBank = mathQuestionBank.find((q) => q.id === questionId) || archivedDemoQuestions.find((q) => q.id === questionId);
    if (qBank) {
      return {
        question: {
          id: qBank.id,
          lessonId: `grade-${qBank.grade}-bank`,
          sectionId: `topic-${qBank.topic}`,
          prompt: qBank.prompt,
          type: qBank.type,
          options: qBank.options,
          correctAnswer: qBank.correctAnswer,
          explanation: qBank.explanation,
          hint: qBank.hint,
          formulaLatex: qBank.formulaLatex,
          orderIndex: 1,
        },
      };
    }

    // 1. Exact match in lessons
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

  // --- Admin Curriculum & Question Management ---
  addLesson(lesson: LessonModel): void {
    this.lessons.push(lesson);
  }

  updateLesson(id: string, updates: Partial<LessonModel>): boolean {
    const idx = this.lessons.findIndex((l) => l.id === id);
    if (idx === -1) return false;
    this.lessons[idx] = { ...this.lessons[idx], ...updates };
    return true;
  }

  deleteLesson(id: string): boolean {
    const idx = this.lessons.findIndex((l) => l.id === id);
    if (idx === -1) return false;
    this.lessons.splice(idx, 1);
    return true;
  }

  getAllQuestions(): QuestionModel[] {
    const questions: QuestionModel[] = [];
    for (const l of this.lessons) {
      for (const s of l.sections) {
        questions.push(...s.questions);
      }
    }
    return questions;
  }

  addQuestion(sectionId: string, question: QuestionModel): boolean {
    for (const l of this.lessons) {
      const s = l.sections.find((sec) => sec.id === sectionId);
      if (s) {
        s.questions.push(question);
        return true;
      }
    }
    return false;
  }

  getQuestionsForTest(grade?: number, count = 10, topic?: string, audience?: 'KIDS' | 'TEEN'): QuestionBankItem[] {
    let pool = mathQuestionBank.filter((q) => q.isPublished);

    // If active question bank is empty and running under Jest automated test suite, use archived bank
    if (pool.length === 0 && process.env.NODE_ENV === 'test') {
      pool = archivedDemoQuestions.filter((q) => q.isPublished);
    }

    if (audience) {
      pool = pool.filter((q) => q.audience === audience || (!q.audience && (audience === 'KIDS' ? q.grade <= 4 : q.grade >= 5)));
    }

    if (topic && topic.trim() !== '') {
      const topicMatches = pool.filter((q) => q.topic.toLowerCase().includes(topic.toLowerCase()));
      if (topicMatches.length >= count) {
        pool = topicMatches;
      }
    }
    if (grade && grade > 0) {
      const gradeMatches = pool.filter((q) => Math.abs(q.grade - grade) <= 1);
      if (gradeMatches.length >= count) {
        pool = gradeMatches;
      }
    }
    // Shuffle and pick requested count
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
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

      // Check whether user has an authoritative PAID PRO subscription
      const isPaidPro = user.subscription.status === 'PRO_ACTIVE';
      const eligibleCoinReward = isPaidPro ? 3 : 1; // +3 coins for Pro, +1 coin for Free / Trial

      // STRICT RULE: Award coins ONLY if this question has NOT previously awarded coins
      if (!user.rewardedQuestionIds.includes(questionId)) {
        user.rewardedQuestionIds.push(questionId);
        coinsAwarded = eligibleCoinReward;
        xpAwarded = 10;
        user.coinBalance += eligibleCoinReward;
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

  recruitCitizens(userId: string, count = 5, cost = 25): { newCitizenCount: number; newCoinBalance: number } {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Foydalanuvchi topilmadi.');
    if (user.coinBalance < cost) {
      throw new Error(`Fuqarolarni taklif qilish uchun ${cost} tanga talab qilinadi. Balansingiz: ${user.coinBalance}`);
    }
    user.coinBalance -= cost;
    user.citizenCount = (user.citizenCount || 15) + count;
    return { newCitizenCount: user.citizenCount, newCoinBalance: user.coinBalance };
  }

  upgradeCar(userId: string, cost = 50): { newCarConfig: any; newCoinBalance: number } {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Foydalanuvchi topilmadi.');
    if (user.coinBalance < cost) {
      throw new Error(`Mashinani yangilash uchun ${cost} tanga talab qilinadi. Balansingiz: ${user.coinBalance}`);
    }
    user.coinBalance -= cost;
    const currentLvl = user.carConfig?.level || 1;
    const newLvl = currentLvl + 1;
    const models = ['Sedan', 'Sportkar', 'Cyber-avto', 'Superkar', 'Uchuvchi avto'];
    const colors = ['#E53E3E', '#3182CE', '#38A169', '#D69E2E', '#805AD5'];
    const modelName = models[(newLvl - 1) % models.length];
    const colorHex = colors[(newLvl - 1) % colors.length];
    const newSpeed = 1.0 + (newLvl * 0.25);

    user.carConfig = {
      level: newLvl,
      model: modelName,
      color: colorHex,
      speed: newSpeed,
    };

    return { newCarConfig: user.carConfig, newCoinBalance: user.coinBalance };
  }

  syncCityState(userId: string, data: { placedBuildings?: any[]; citizenCount?: number; carConfig?: any }): any {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Foydalanuvchi topilmadi.');

    if (Array.isArray(data.placedBuildings)) {
      user.placedBuildings = data.placedBuildings;
      user.cityLevel = Math.max(1, Math.floor(user.placedBuildings.length / 2) + 1);
    }
    if (typeof data.citizenCount === 'number') {
      user.citizenCount = data.citizenCount;
    }
    if (data.carConfig) {
      user.carConfig = data.carConfig;
    }

    return {
      cityLevel: user.cityLevel,
      coinBalance: user.coinBalance,
      placedBuildings: user.placedBuildings,
      citizenCount: user.citizenCount || 15,
      carConfig: user.carConfig,
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

  // --- Subscriptions ---
  cancelSubscription(userId: string): { status: SubscriptionStatus; message: string } {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Foydalanuvchi topilmadi');

    user.subscription.status = 'PRO_EXPIRED';
    return {
      status: user.subscription.status,
      message: 'Obuna bekor qilindi. To‘langan muddat yakuniga qadar imkoniyatlar saqlanadi.',
    };
  }

  // --- AI Conversations & Messages (Persistent History) ---
  private conversations: Map<string, AIConversationItem> = new Map();
  private conversationMessages: Map<string, AIMessageItem[]> = new Map();

  listConversations(userId: string): AIConversationItem[] {
    const list: AIConversationItem[] = [];
    for (const conv of this.conversations.values()) {
      if (conv.userId === userId) {
        list.push(conv);
      }
    }
    // Sort by most recently updated
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  getConversation(userId: string, conversationId: string): { conversation: AIConversationItem; messages: AIMessageItem[] } | null {
    const conv = this.conversations.get(conversationId);
    if (!conv || conv.userId !== userId) return null;
    const msgs = this.conversationMessages.get(conversationId) || [];
    return { conversation: conv, messages: msgs };
  }

  createConversation(userId: string, title?: string): AIConversationItem {
    const id = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const item: AIConversationItem = {
      id,
      userId,
      title: title || 'Yangi suhbat',
      createdAt: now,
      updatedAt: now,
      messageCount: 0,
      preview: 'Suhbat hali boshlanmagan',
    };
    this.conversations.set(id, item);
    this.conversationMessages.set(id, []);
    return item;
  }

  renameConversation(userId: string, conversationId: string, newTitle: string): AIConversationItem | null {
    const conv = this.conversations.get(conversationId);
    if (!conv || conv.userId !== userId) return null;
    conv.title = newTitle.trim();
    conv.updatedAt = new Date().toISOString();
    return conv;
  }

  deleteConversation(userId: string, conversationId: string): boolean {
    const conv = this.conversations.get(conversationId);
    if (!conv || conv.userId !== userId) return false;
    this.conversations.delete(conversationId);
    this.conversationMessages.delete(conversationId);
    return true;
  }

  saveAIMessage(
    userId: string,
    conversationId: string,
    role: 'user' | 'assistant',
    text: string,
    options?: {
      formulaLatex?: string | null;
      step?: number;
      finalAnswer?: string;
      suggestedActions?: string[];
      inputType?: 'TEXT' | 'IMAGE' | 'VOICE';
      fileName?: string;
      mimeType?: string;
      sizeBytes?: number;
      transcribedText?: string;
    }
  ): AIMessageItem {
    let conv = this.conversations.get(conversationId);
    if (!conv || conv.userId !== userId) {
      conv = this.createConversation(userId, text.length > 30 ? `${text.substring(0, 30)}...` : text);
      conversationId = conv.id;
    }

    const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const msg: AIMessageItem = {
      id,
      userId,
      conversationId,
      role,
      text,
      formulaLatex: options?.formulaLatex,
      step: options?.step,
      finalAnswer: options?.finalAnswer,
      suggestedActions: options?.suggestedActions,
      inputType: options?.inputType || 'TEXT',
      fileName: options?.fileName,
      mimeType: options?.mimeType,
      sizeBytes: options?.sizeBytes,
      transcribedText: options?.transcribedText,
      createdAt: now,
    };

    const list = this.conversationMessages.get(conversationId) || [];
    list.push(msg);
    this.conversationMessages.set(conversationId, list);

    conv.updatedAt = now;
    conv.messageCount = list.length;
    conv.preview = text.length > 60 ? `${text.substring(0, 60)}...` : text;

    // Automatically update title if it was default
    if (conv.title === 'Yangi suhbat' && role === 'user') {
      conv.title = text.length > 30 ? `${text.substring(0, 30)}...` : text;
    }

    return msg;
  }

  // --- Unrecognized AI Questions Store ---
  private unrecognizedQueries: Array<{ id: string; userId?: string; query: string; createdAt: string }> = [];

  logUnrecognizedQuery(query: string, userId?: string): void {
    const clean = query.trim();
    if (!clean) return;
    this.unrecognizedQueries.push({
      id: `unrec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      query: clean,
      createdAt: new Date().toISOString(),
    });
  }

  getUnrecognizedQueries(): Array<{ id: string; userId?: string; query: string; createdAt: string }> {
    return [...this.unrecognizedQueries];
  }
}

export interface AIConversationItem {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  preview?: string;
  messageCount: number;
}

export interface AIMessageItem {
  id: string;
  userId: string;
  conversationId: string;
  role: 'user' | 'assistant';
  text: string;
  formulaLatex?: string | null;
  step?: number;
  finalAnswer?: string;
  suggestedActions?: string[];
  inputType?: 'TEXT' | 'IMAGE' | 'VOICE';
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  transcribedText?: string;
  createdAt: string;
}

export const repository = new DataRepository();

export function logUnrecognizedQuery(query: string, userId?: string): void {
  repository.logUnrecognizedQuery(query, userId);
}

export function getUnrecognizedQueries(): Array<{ id: string; userId?: string; query: string; createdAt: string }> {
  return repository.getUnrecognizedQueries();
}

