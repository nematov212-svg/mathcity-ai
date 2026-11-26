import bcrypt from 'bcryptjs';
import { prisma, isDatabaseHealthy } from '../db/client.js';
import { config } from '../config/env.js';

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
  GameCarModel,
  initialGameCars,
} from './dataStore.js';
import { curriculum220Lessons } from './curriculum220.js';
import { mathQuestionBank, archivedDemoQuestions, QuestionBankItem } from './questionBank.js';
import { AgeMode } from './age.js';
import {
  getTashkentDateString,
  getTashkentWeekDays,
  getTashkentSecondsUntilMidnight,
  getTashkentDayOfWeek,
} from './tashkentTime.js';

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
  usernameLower?: string;
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
  claimedAchievements?: string[]; // achievementKeys claimed
  consecutiveCorrectAnswers?: number;
  currentStreak?: number;
  longestStreak?: number;
  lastActiveDate?: string; // YYYY-MM-DD
  isBlocked?: boolean;
  friendsCount?: number;
  isTestUser?: boolean;
  houseBuildingProgress?: {
    currentStage: number;
    completedStages: number[];
    isFinished: boolean;
    lastBuiltAt?: string;
  };
  settings?: {
    soundEnabled: boolean;
    animationsEnabled: boolean;
    dailyReminderEnabled: boolean;
    reminderTime: string;
    mode: string;
    theme: string;
  };
  gameResults?: Array<{
    id: string;
    gameKey: string;
    score: number;
    coinsEarned: number;
    xpEarned: number;
    playedAt: string;
  }>;
  createdAt: string;
}

export interface DailyActivityRecord {
  userId: string;
  date: string; // YYYY-MM-DD
  seconds: number;
  lessonsDone: number;
  problemsSolved: number;
  lastHeartbeat: number;
}

export type MissionStatus = 'ACTIVE' | 'COMPLETED' | 'CLAIMED' | 'EXPIRED';

export type AnnouncementType =
  | 'urgent'
  | 'special_offer'
  | 'info'
  | 'URGENT_ANNOUNCEMENT'
  | 'SPECIAL_OFFER'
  | 'ANNOUNCEMENT'
  | 'AD';

export interface LeaderboardContest {
  id: string;
  name: string;
  durationDays: number;
  startDate: string; // ISO
  endDate: string; // ISO
  prizes: { rank: number; coins: number }[];
  isEnded: boolean;
  awardedAt?: string;
  awardedWinners?: { rank: number; userId: string; username: string; coins: number }[];
}

export interface AnnouncementModel {
  id: string;
  title: string;
  text: string;
  imageUrl?: string;
  buttonText: string;
  buttonAction: string; // e.g. '/kids/leaderboard', '/kids/pro', 'url:https://...'
  buttonRoute?: string;
  type: AnnouncementType;
  startAt?: string; // ISO
  startDate: string; // ISO alias
  endAt?: string; // ISO
  endDate?: string; // ISO alias
  priority: number; // higher = shown first
  autoCloseSeconds: number; // default 5, 0 = no auto close
  showDelaySeconds: number; // 0 = immediate, 300 = 5 min
  delaySeconds: number; // alias
  audience: 'all' | 'new_users_within_days:3' | 'new_users_within_days:7' | 'new_users' | 'free_users' | 'pro_users';
  frequency: 'once' | 'every_open' | 'once_per_day' | 'once_per_session' | 'always';
  views: number;
  clicks: number;
  discountPercent?: number; // e.g. 30
  discountPrice?: number; // e.g. 20300
  originalPrice?: number; // e.g. 29000
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  design?: any;
}

export interface DailyMissionRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  templateId: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  rewardCoins: number;
  rewardXP: number;
  status: MissionStatus;
  isCompleted: boolean;
  claimed: boolean;
}

class DataRepository {
  private users: Map<string, UserAccount> = new Map();
  private lessons: LessonModel[] = (() => {
    const list: LessonModel[] = [...curriculum220Lessons];
    for (const initL of initialLessons) {
      if (!list.some((l) => l.id === initL.id)) {
        list.push(initL);
      }
    }
    return list;
  })();
  private buildings: BuildingModel[] = initialBuildings;
  private tasks: DailyTaskModel[] = initialDailyTasks;
  private achievements: AchievementModel[] = initialAchievements;
  private dailyActivities: Map<string, DailyActivityRecord> = new Map();
  private dailyMissions: Map<string, DailyMissionRecord[]> = new Map();
  private leaderboardContest: LeaderboardContest = {
    id: 'contest-season-1',
    name: '30 kunlik o‘quvchilar musobaqasi',
    durationDays: 30,
    startDate: new Date(Date.now() - 3600000).toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
    prizes: [
      { rank: 1, coins: 500 },
      { rank: 2, coins: 250 },
      { rank: 3, coins: 150 },
    ],
    isEnded: false,
  };
  private announcements: AnnouncementModel[] = [
    {
      id: 'announcement-urgent-01',
      title: '30 kun ichida 1, 2 yoki 3-o‘rinni egallasangiz, ko‘plab coin yutib olishingiz mumkin!',
      text: '1-o‘rin 500 coin, 2-o‘rin 250 coin, 3-o‘rin 150 coin.',
      buttonText: '1-o‘rinni egallash uchun harakat',
      buttonAction: '/kids/leaderboard',
      buttonRoute: '/kids/leaderboard',
      type: 'urgent',
      startAt: new Date(Date.now() - 3600000).toISOString(),
      startDate: new Date(Date.now() - 3600000).toISOString(),
      endAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      priority: 10,
      autoCloseSeconds: 5,
      showDelaySeconds: 0,
      delaySeconds: 0,
      audience: 'all',
      frequency: 'every_open',
      views: 0,
      clicks: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'announcement-special-offer-01',
      title: 'Maxsus taklif — MathCity AI dan',
      text: 'Yangi o‘quvchilar uchun MathCity PRO obunasiga 30% chegirma! 7 kun amal qiladi.',
      buttonText: 'PRO sotib olish',
      buttonAction: '/kids/pro',
      buttonRoute: '/kids/pro',
      type: 'special_offer',
      startAt: new Date(Date.now() - 3600000).toISOString(),
      startDate: new Date(Date.now() - 3600000).toISOString(),
      endAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      priority: 5,
      autoCloseSeconds: 0,
      showDelaySeconds: 300,
      delaySeconds: 300,
      audience: 'new_users_within_days:7',
      frequency: 'once',
      views: 0,
      clicks: 0,
      discountPercent: 30,
      discountPrice: 20300,
      originalPrice: 29000,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  constructor() { }

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

  getAllUsers(includeTestUsers: boolean = false): UserAccount[] {
    const unique = new Map<string, UserAccount>();
    for (const user of this.users.values()) {
      if (!includeTestUsers && user.isTestUser) continue;
      unique.set(user.id, user);
    }
    return Array.from(unique.values());
  }

  isUsernameTaken(rawUsername: string, excludeUserId?: string): boolean {
    const clean = (rawUsername || '').trim().toLowerCase();
    if (!clean) return false;
    for (const user of this.getAllUsers()) {
      if (excludeUserId && user.id === excludeUserId) continue;
      const lower = (user.usernameLower || user.username || '').trim().toLowerCase();
      if (lower === clean) return true;
    }
    return false;
  }

  createUser(user: UserAccount): UserAccount {
    if (user.username) {
      user.usernameLower = user.username.trim().toLowerCase();
    }
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
      this.persistUserToDatabase(user).catch((err) => {
        console.error(`❌ [PERSISTENCE ERROR] Error persisting user ${user.id} to PostgreSQL:`, err?.message);
      });
    } else if (config.isProduction) {
      console.error(`🚨 [CRITICAL ALERT] Cannot persist user ${user.id} to PostgreSQL: Database connection is not healthy!`);
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
    if (updates.username) {
      updates.usernameLower = updates.username.trim().toLowerCase();
    }
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
      this.persistUserToDatabase(updated).catch((err) => {
        console.error(`❌ [PERSISTENCE ERROR] Error updating user ${updated.id} in PostgreSQL:`, err?.message);
      });
    } else if (config.isProduction) {
      console.error(`🚨 [CRITICAL ALERT] Cannot update user ${updated.id} in PostgreSQL: Database connection is not healthy!`);
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
      prisma.user.delete({ where: { id } }).catch((err) => {
        console.error(`❌ [PERSISTENCE ERROR] Error deleting user ${id} in PostgreSQL:`, err?.message);
      });
    } else if (config.isProduction) {
      console.error(`🚨 [CRITICAL ALERT] Cannot delete user ${id} in PostgreSQL: Database connection is not healthy!`);
    }

    return true;
  }

  async persistUserToDatabase(user: UserAccount): Promise<void> {
    if (!isDatabaseHealthy()) return;
    try {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {
          email: user.email.toLowerCase(),
          username: user.username?.trim() || null,
          usernameLower: user.username ? user.username.trim().toLowerCase() : null,
          passwordHash: user.passwordHash || null,
          googleId: user.googleId || null,
          appleId: user.appleId || null,
        },
        create: {
          id: user.id,
          email: user.email.toLowerCase(),
          username: user.username?.trim() || null,
          usernameLower: user.username ? user.username.trim().toLowerCase() : null,
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
        const proStart = user.subscription.proStartedAt ? new Date(user.subscription.proStartedAt) : null;
        const proExpiry = user.subscription.proExpiresAt ? new Date(user.subscription.proExpiresAt) : null;
        await prisma.subscription.upsert({
          where: { userId: user.id },
          update: {
            status: user.subscription.status as any,
            trialStartedAt: isNaN(trialStart.getTime()) ? new Date() : trialStart,
            trialExpiresAt: isNaN(trialExpiry.getTime()) ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : trialExpiry,
            proStartedAt: proStart && !isNaN(proStart.getTime()) ? proStart : null,
            proExpiresAt: proExpiry && !isNaN(proExpiry.getTime()) ? proExpiry : null,
          },
          create: {
            userId: user.id,
            status: user.subscription.status as any,
            trialStartedAt: isNaN(trialStart.getTime()) ? new Date() : trialStart,
            trialExpiresAt: isNaN(trialExpiry.getTime()) ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : trialExpiry,
            proStartedAt: proStart && !isNaN(proStart.getTime()) ? proStart : null,
            proExpiresAt: proExpiry && !isNaN(proExpiry.getTime()) ? proExpiry : null,
          },
        });
      }

      // Persist completed lessons
      if (user.completedLessons && user.completedLessons.length > 0) {
        for (const lessonId of user.completedLessons) {
          try {
            await prisma.lessonProgress.upsert({
              where: { userId_lessonId: { userId: user.id, lessonId } },
              update: { isCompleted: true },
              create: { userId: user.id, lessonId, isCompleted: true },
            });
          } catch (_) { }
        }
      }

      // Persist placed buildings
      if (user.placedBuildings && user.placedBuildings.length > 0) {
        for (const b of user.placedBuildings) {
          try {
            await prisma.ownedBuilding.upsert({
              where: { userId_gridX_gridY: { userId: user.id, gridX: b.gridX, gridY: b.gridY } },
              update: { buildingKey: b.buildingKey },
              create: { userId: user.id, buildingKey: b.buildingKey, gridX: b.gridX, gridY: b.gridY },
            });
          } catch (_) { }
        }
      }

      // Persist unlocked achievements
      if (user.unlockedAchievements && user.unlockedAchievements.length > 0) {
        for (const achievementKey of user.unlockedAchievements) {
          try {
            await prisma.studentAchievement.upsert({
              where: { userId_achievementKey: { userId: user.id, achievementKey } },
              update: {},
              create: { userId: user.id, achievementKey },
            });
          } catch (_) { }
        }
      }

      // Persist rewarded questions
      if (user.rewardedQuestionIds && user.rewardedQuestionIds.length > 0) {
        for (const questionId of user.rewardedQuestionIds) {
          try {
            await prisma.rewardedQuestion.upsert({
              where: { userId_questionId: { userId: user.id, questionId } },
              update: {},
              create: { userId: user.id, questionId },
            });
          } catch (_) { }
        }
      }
    } catch (_) { }
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
          lessonProgress: true,
          rewardedQuestions: true,
          ownedBuildings: true,
          achievements: true,
          dailyTasks: true,
        },
      });

      for (const u of dbUsers) {
        const prof = u.studentProfile;
        const sub = u.subscription;
        const wallet = u.coinWallet;
        const xp = u.studentXP;

        const completedLessons = (u.lessonProgress || [])
          .filter((lp) => lp.isCompleted)
          .map((lp) => lp.lessonId);
        const rewardedQuestionIds = (u.rewardedQuestions || []).map((rq) => rq.questionId);
        const placedBuildings = (u.ownedBuildings || []).map((b) => ({
          buildingKey: b.buildingKey,
          gridX: b.gridX,
          gridY: b.gridY,
          constructedAt: b.constructedAt.toISOString(),
        }));
        const unlockedAchievements = (u.achievements || []).map((a) => a.achievementKey);
        const dailyTaskProgress: Record<string, { currentCount: number; isCompleted: boolean; claimed: boolean }> = {};
        for (const dt of u.dailyTasks || []) {
          dailyTaskProgress[dt.taskId] = {
            currentCount: dt.currentCount,
            isCompleted: dt.isCompleted,
            claimed: Boolean(dt.claimedAt),
          };
        }

        const userAccount: UserAccount = {
          id: u.id,
          email: u.email,
          username: u.username || undefined,
          usernameLower: (u as any).usernameLower || (u.username ? u.username.toLowerCase() : undefined),
          passwordHash: u.passwordHash || undefined,
          googleId: u.googleId || undefined,
          appleId: u.appleId || undefined,
          displayName: prof?.displayName || 'O‘quvchi',
          dateOfBirth: prof?.dateOfBirth ? prof.dateOfBirth.toISOString().split('T')[0] : '2015-05-15',
          age: prof?.age || 10,
          mode: (prof?.mode as any) || 'KIDS',
          grade: prof?.grade || 4,
          avatarUrl: prof?.avatarUrl || 'assets/images/avatar_kid.png',
          profileCompleted: Boolean(u.username && prof?.displayName),
          coinBalance: wallet?.balance ?? 0,
          totalXP: xp?.totalXP ?? 0,
          level: xp?.level ?? 1,
          cityLevel: prof?.cityLevel ?? 1,
          subscription: {
            status: (sub?.status as any) || 'FREE_TRIAL_ACTIVE',
            trialStartedAt: sub?.trialStartedAt ? sub.trialStartedAt.toISOString() : new Date().toISOString(),
            trialExpiresAt: sub?.trialExpiresAt ? sub.trialExpiresAt.toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            proStartedAt: sub?.proStartedAt ? sub.proStartedAt.toISOString() : undefined,
            proExpiresAt: sub?.proExpiresAt ? sub.proExpiresAt.toISOString() : undefined,
            planName: 'MathCity Free Trial',
            priceMonthlyUzs: 29000,
          },
          placedBuildings,
          completedLessons,
          completedSections: [],
          solvedQuestions: completedLessons.length > 0 ? [...completedLessons] : [],
          rewardedQuestionIds,
          attemptedQuestionCount: completedLessons.length * 4,
          correctQuestionCount: completedLessons.length * 3,
          incorrectQuestionCount: completedLessons.length,
          dailyTaskProgress,
          unlockedAchievements,
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
    } catch (_) { }
  }

  // --- Curriculum Hierarchy Queries ---
  getLessons(mode?: 'KIDS', grade?: number, includeDrafts: boolean = false): LessonModel[] {
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
    // Alias fallback for known legacy ID
    if (id === 'lesson-k3-01') return this.lessons.find((l) => l.id === 'lesson-g3-addsub');
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

  getQuestionsForTest(grade?: number, count = 10, topic?: string, audience?: 'KIDS'): QuestionBankItem[] {
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
    this.persistUserToDatabase(user).catch(() => { });
    return { newBalance: user.coinBalance };
  }

  debitCoins(userId: string, amount: number, reason: string): { newBalance: number } {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Foydalanuvchi topilmadi');
    if (user.coinBalance < amount) {
      throw new Error('Yetarli oltin tanga mavjud emas');
    }
    user.coinBalance -= amount;
    this.persistUserToDatabase(user).catch(() => { });
    return { newBalance: user.coinBalance };
  }

  // --- 1 COIN PER QUESTION CRITICAL BUSINESS LOGIC ---
  submitQuestionAnswer(
    userId: string,
    questionId: string,
    isCorrect: boolean,
    forceSingleCoin: boolean = false
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

      // Practice /answer enforces strictly 1 coin; Paid Pro on other submit endpoints gets 3
      const isPaidPro = user.subscription.status === 'PRO_ACTIVE';
      const eligibleCoinReward = forceSingleCoin ? 1 : (isPaidPro ? 3 : 1);

      // STRICT RULE: Award coins ONLY if this question has NOT previously awarded coins
      if (!user.rewardedQuestionIds.includes(questionId)) {
        user.rewardedQuestionIds.push(questionId);
        coinsAwarded = eligibleCoinReward;
        xpAwarded = 10;
        user.coinBalance += eligibleCoinReward;
        isFirstTimeCorrect = true;
      } else {
        // Repeated solve: 0 extra coins, 0 extra XP (strictly idempotent)
        coinsAwarded = 0;
        xpAwarded = 0;
      }

      // Add XP & level check
      if (xpAwarded > 0) {
        this.addXP(userId, xpAwarded);
      }

      // Update daily task: task_solve_5
      if (user.dailyTaskProgress['task_solve_5']) {
        const t = user.dailyTaskProgress['task_solve_5'];
        t.currentCount = Math.min(5, t.currentCount + 1);
        if (t.currentCount >= 5) t.isCompleted = true;
      }

      // Consecutive correct answers & achievement: ach_math_whiz
      user.consecutiveCorrectAnswers = (user.consecutiveCorrectAnswers || 0) + 1;
      if (user.consecutiveCorrectAnswers >= 10 && !user.unlockedAchievements.includes('ach_math_whiz')) {
        user.unlockedAchievements.push('ach_math_whiz');
      }

      // Check achievement: ach_sharp_shooter (>= 50 attempts, >= 90% accuracy)
      if (user.attemptedQuestionCount >= 50) {
        const acc = Math.round((user.correctQuestionCount / user.attemptedQuestionCount) * 100);
        if (acc >= 90 && !user.unlockedAchievements.includes('ach_sharp_shooter')) {
          user.unlockedAchievements.push('ach_sharp_shooter');
        }
      }

      // Advance daily mission & record activity
      this.advanceMissionProgress(userId, 'SOLVE_PROBLEM', 1);
      const todayStr = getTashkentDateString();
      const actKey = `${userId}:${todayStr}`;
      let act = this.dailyActivities.get(actKey);
      if (!act) {
        act = { userId, date: todayStr, seconds: 60, lessonsDone: 0, problemsSolved: 0, lastHeartbeat: Date.now() };
        this.dailyActivities.set(actKey, act);
      }
      act.problemsSolved++;
      this.calculateStreak(userId);
    } else {
      user.incorrectQuestionCount++;
      user.consecutiveCorrectAnswers = 0;
    }

    const accuracyPercentage =
      user.attemptedQuestionCount > 0
        ? Math.round((user.correctQuestionCount / user.attemptedQuestionCount) * 100)
        : 100;

    this.persistUserToDatabase(user).catch(() => { });

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
    this.persistUserToDatabase(user).catch(() => { });
    return { totalXP: user.totalXP, level: user.level, leveledUp };
  }

  // --- City Buildings & Purchase ---
  getBuildings(mode?: 'KIDS'): BuildingModel[] {
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
    proDaysRemaining?: number;
    originalPriceMonthlyUzs?: number;
    hasNewUserDiscount?: boolean;
    discountPercent?: number;
    discountPriceUzs?: number;
    discountExpiresAt?: string;
    discountDaysRemaining?: number;
    discountSecondsRemaining?: number;
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

    let proDaysRemaining = 0;
    if (user.subscription.proExpiresAt) {
      const pDiff = new Date(user.subscription.proExpiresAt).getTime() - now.getTime();
      proDaysRemaining = Math.max(0, Math.ceil(pDiff / (1000 * 60 * 60 * 24)));
    }

    // 7-day new user 30% discount calculation (from user.createdAt)
    const userCreatedAt = user.createdAt ? new Date(user.createdAt).getTime() : now.getTime();
    const discountExpiresAtMs = userCreatedAt + 7 * 24 * 60 * 60 * 1000;
    const isNewUserDiscountActive = now.getTime() < discountExpiresAtMs && status !== 'PRO_ACTIVE';
    const discountSecondsRemaining = isNewUserDiscountActive
      ? Math.max(0, Math.floor((discountExpiresAtMs - now.getTime()) / 1000))
      : 0;
    const discountDaysRemaining = Math.ceil(discountSecondsRemaining / 86400);

    const priceMonthlyUzs = user.subscription.priceMonthlyUzs || 29000;

    return {
      status,
      planName: status === 'PRO_ACTIVE' ? (user.subscription.planName || 'MathCity Pro') : 'MathCity Free Trial',
      trialDaysRemaining,
      isTrialActive: status === 'FREE_TRIAL_ACTIVE',
      isProActive: status === 'PRO_ACTIVE',
      priceMonthlyUzs,
      originalPriceMonthlyUzs: 29000,
      hasNewUserDiscount: isNewUserDiscountActive,
      discountPercent: isNewUserDiscountActive ? 30 : 0,
      discountPriceUzs: 20300,
      discountExpiresAt: new Date(discountExpiresAtMs).toISOString(),
      discountDaysRemaining,
      discountSecondsRemaining,
      trialExpiresAt: user.subscription.trialExpiresAt,
      proExpiresAt: user.subscription.proExpiresAt,
      proDaysRemaining,
    };
  }

  // --- Leaderboard Contest Management (Idempotent 500/250/150 rewards) ---
  getLeaderboardContest(): LeaderboardContest {
    return { ...this.leaderboardContest };
  }

  updateLeaderboardContest(data: any): LeaderboardContest {
    let normalizedPrizes = this.leaderboardContest.prizes;
    if (data.prizes) {
      if (Array.isArray(data.prizes)) {
        normalizedPrizes = data.prizes;
      } else if (typeof data.prizes === 'object') {
        normalizedPrizes = [
          { rank: 1, coins: Number(data.prizes.first || data.prizes['1'] || 500) },
          { rank: 2, coins: Number(data.prizes.second || data.prizes['2'] || 250) },
          { rank: 3, coins: Number(data.prizes.third || data.prizes['3'] || 150) },
        ];
      }
    }
    this.leaderboardContest = {
      ...this.leaderboardContest,
      ...data,
      prizes: normalizedPrizes,
      id: this.leaderboardContest.id,
    };
    return { ...this.leaderboardContest };
  }

  checkAndAwardContestPrizes(): boolean {
    const now = Date.now();
    const end = new Date(this.leaderboardContest.endDate).getTime();
    if (now < end || this.leaderboardContest.isEnded) {
      return false;
    }

    const allUsers = this.getAllUsers();
    const sorted = [...allUsers].sort((a, b) => {
      const cA = a.coinBalance || 0;
      const cB = b.coinBalance || 0;
      if (cB !== cA) return cB - cA;
      const xA = a.totalXP || 0;
      const xB = b.totalXP || 0;
      if (xB !== xA) return xB - xA;
      const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tA - tB;
    });

    const winners: { rank: number; userId: string; username: string; coins: number }[] = [];
    const prizeMap: Record<number, number> = { 1: 500, 2: 250, 3: 150 };
    for (const p of this.leaderboardContest.prizes) {
      prizeMap[p.rank] = p.coins;
    }

    for (let i = 0; i < Math.min(3, sorted.length); i++) {
      const rank = i + 1;
      const winner = sorted[i];
      const coins = prizeMap[rank] || (rank === 1 ? 500 : rank === 2 ? 250 : 150);
      winner.coinBalance = (winner.coinBalance || 0) + coins;
      this.updateUser(winner.id, { coinBalance: winner.coinBalance });
      winners.push({
        rank,
        userId: winner.id,
        username: winner.username || winner.displayName || `user_${winner.id.slice(0, 6)}`,
        coins,
      });
    }

    this.leaderboardContest.isEnded = true;
    this.leaderboardContest.awardedAt = new Date().toISOString();
    this.leaderboardContest.awardedWinners = winners;
    return true;
  }

  finalizeContestManually(): { success: boolean; winners: any[] } {
    if (this.leaderboardContest.isEnded) {
      return { success: false, winners: this.leaderboardContest.awardedWinners || [] };
    }
    this.leaderboardContest.endDate = new Date().toISOString();
    this.checkAndAwardContestPrizes();
    return { success: true, winners: this.leaderboardContest.awardedWinners || [] };
  }

  // --- Announcements & Advertisements Management ---
  getAllAnnouncements(): AnnouncementModel[] {
    return [...this.announcements];
  }

  getActiveAnnouncements(userCreatedAt?: string): AnnouncementModel[] {
    const now = Date.now();
    return this.announcements
      .filter((a) => {
        if (!a.isActive) return false;
        const startStr = a.startAt || a.startDate;
        if (startStr) {
          const start = new Date(startStr).getTime();
          if (!isNaN(start) && now < start) return false;
        }
        const endStr = a.endAt || a.endDate;
        if (endStr) {
          const end = new Date(endStr).getTime();
          if (!isNaN(end) && now > end) return false;
        }

        // Audience check
        const audience = a.audience || 'all';
        if (audience.startsWith('new_users_within_days:')) {
          const days = parseInt(audience.split(':')[1], 10) || 7;
          if (!userCreatedAt) return false;
          const regTime = new Date(userCreatedAt).getTime();
          if (isNaN(regTime) || now - regTime > days * 24 * 3600 * 1000) {
            return false;
          }
        } else if (a.type === 'SPECIAL_OFFER' || a.type === 'special_offer') {
          if (userCreatedAt) {
            const regTime = new Date(userCreatedAt).getTime();
            if (!isNaN(regTime) && now - regTime > 7 * 24 * 3600 * 1000) {
              return false;
            }
          }
        }
        return true;
      })
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  getAnnouncementById(id: string): AnnouncementModel | undefined {
    return this.announcements.find((a) => a.id === id);
  }

  createAnnouncement(data: Partial<AnnouncementModel>): AnnouncementModel {
    const id = `announcement-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const btnAct = data.buttonAction || data.buttonRoute || '/kids/leaderboard';
    const delay = typeof data.showDelaySeconds === 'number'
      ? data.showDelaySeconds
      : (typeof data.delaySeconds === 'number' ? data.delaySeconds : 0);
    const item: AnnouncementModel = {
      id,
      title: data.title || 'E‘lon',
      text: data.text || '',
      imageUrl: data.imageUrl,
      buttonText: data.buttonText || 'Batafsil',
      buttonAction: btnAct,
      buttonRoute: btnAct,
      type: data.type || 'info',
      startAt: data.startAt || data.startDate || now,
      startDate: data.startDate || data.startAt || now,
      endAt: data.endAt || data.endDate,
      endDate: data.endDate || data.endAt,
      priority: typeof data.priority === 'number' ? data.priority : 0,
      autoCloseSeconds: typeof data.autoCloseSeconds === 'number' ? data.autoCloseSeconds : 5,
      showDelaySeconds: delay,
      delaySeconds: delay,
      audience: data.audience || 'all',
      frequency: data.frequency || 'every_open',
      views: typeof data.views === 'number' ? data.views : 0,
      clicks: typeof data.clicks === 'number' ? data.clicks : 0,
      discountPercent: data.discountPercent,
      discountPrice: data.discountPrice,
      originalPrice: data.originalPrice,
      isActive: data.isActive !== false,
      createdAt: now,
      updatedAt: now,
      design: data.design,
    };
    this.announcements.unshift(item);
    return item;
  }

  updateAnnouncement(id: string, data: Partial<AnnouncementModel>): AnnouncementModel {
    const index = this.announcements.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error('E‘lon topilmadi');
    }
    const current = this.announcements[index];
    const btnAct = data.buttonAction || data.buttonRoute || current.buttonAction || current.buttonRoute || '/kids/leaderboard';
    const delay = typeof data.showDelaySeconds === 'number'
      ? data.showDelaySeconds
      : (typeof data.delaySeconds === 'number' ? data.delaySeconds : current.showDelaySeconds);
    const updated: AnnouncementModel = {
      ...current,
      ...data,
      buttonAction: btnAct,
      buttonRoute: btnAct,
      showDelaySeconds: delay,
      delaySeconds: delay,
      id: current.id,
      updatedAt: new Date().toISOString(),
    };
    this.announcements[index] = updated;
    return updated;
  }

  deleteAnnouncement(id: string): boolean {
    const index = this.announcements.findIndex((a) => a.id === id);
    if (index === -1) return false;
    this.announcements.splice(index, 1);
    return true;
  }

  incrementAnnouncementView(id: string): boolean {
    const item = this.announcements.find((a) => a.id === id);
    if (!item) return false;
    item.views = (item.views || 0) + 1;
    item.updatedAt = new Date().toISOString();
    return true;
  }

  incrementAnnouncementClick(id: string): boolean {
    const item = this.announcements.find((a) => a.id === id);
    if (!item) return false;
    item.clicks = (item.clicks || 0) + 1;
    item.updatedAt = new Date().toISOString();
    return true;
  }



  private usedPurchaseTokens: Set<string> = new Set();

  activatePro(
    userId: string,
    platform: 'google_play' | 'app_store' | 'web',
    orderId?: string,
    purchaseToken?: string,
    planType: 'MONTHLY' | 'YEARLY' = 'MONTHLY'
  ): { status: SubscriptionStatus; message: string; proExpiresAt: string; proDaysRemaining: number } {
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
    const durationDays = planType === 'YEARLY' ? 365 : 30;
    const durationMs = durationDays * 24 * 60 * 60 * 1000;

    let baseTime = now.getTime();
    // Pro davrida qayta sotib olsa, muddat mavjud muddatga QO'SHILSIN!
    if (
      user.subscription.status === 'PRO_ACTIVE' &&
      user.subscription.proExpiresAt &&
      new Date(user.subscription.proExpiresAt).getTime() > baseTime
    ) {
      baseTime = new Date(user.subscription.proExpiresAt).getTime();
    }

    const proExpiry = new Date(baseTime + durationMs);
    const msDiff = proExpiry.getTime() - now.getTime();
    const proDaysRemaining = Math.max(0, Math.ceil(msDiff / (1000 * 60 * 60 * 24)));

    user.subscription = {
      status: 'PRO_ACTIVE',
      planName: planType === 'YEARLY' ? 'MathCity Pro 1 Yillik' : 'MathCity Pro 1 Oylik',
      trialStartedAt: user.subscription.trialStartedAt,
      trialExpiresAt: user.subscription.trialExpiresAt,
      proStartedAt: user.subscription.proStartedAt || now.toISOString(),
      proExpiresAt: proExpiry.toISOString(),
      priceMonthlyUzs: planType === 'YEARLY' ? 250000 : 29000,
    };

    return {
      status: 'PRO_ACTIVE',
      message: 'MathCity Pro muvaffaqiyatli faollashtirildi!',
      proExpiresAt: proExpiry.toISOString(),
      proDaysRemaining,
    };
  }

  // --- Daily Tasks & Achievements ---
  getDailyTasks(): DailyTaskModel[] {
    return this.tasks;
  }

  getAchievements(): AchievementModel[] {
    return this.achievements;
  }

  // --- Daily Activity & Heartbeat ---
  recordHeartbeat(userId: string, seconds = 15): { todayMinutes: number; totalMinutes: number } {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Foydalanuvchi topilmadi');

    const todayStr = getTashkentDateString();
    const key = `${userId}:${todayStr}`;

    let activity = this.dailyActivities.get(key);
    if (!activity) {
      activity = {
        userId,
        date: todayStr,
        seconds: 0,
        lessonsDone: 0,
        problemsSolved: 0,
        lastHeartbeat: Date.now(),
      };
      this.dailyActivities.set(key, activity);
    }

    // Max 16 hours (57,600s) cap per day
    const MAX_SECONDS = 16 * 3600;
    activity.seconds = Math.min(MAX_SECONDS, activity.seconds + Math.min(30, Math.max(1, seconds)));
    activity.lastHeartbeat = Date.now();

    const todayMinutes = Math.floor(activity.seconds / 60);

    // Check 10-minute mission
    if (todayMinutes >= 10) {
      this.advanceMissionProgress(userId, 'STUDY_MINUTES', todayMinutes);
    }

    let totalSeconds = 0;
    for (const act of this.dailyActivities.values()) {
      if (act.userId === userId) {
        totalSeconds += act.seconds;
      }
    }
    const totalMinutes = Math.floor(totalSeconds / 60);

    return { todayMinutes, totalMinutes };
  }

  getOnlineUsers(withinSeconds = 30): {
    count: number;
    users: Array<{ id: string; name: string; username: string; grade: number; mode: string; lastSeenSecondsAgo: number }>;
  } {
    const now = Date.now();
    const thresholdMs = withinSeconds * 1000;
    const onlineMap = new Map<string, number>();

    for (const act of this.dailyActivities.values()) {
      if (act.lastHeartbeat && now - act.lastHeartbeat <= thresholdMs) {
        onlineMap.set(act.userId, Math.round((now - act.lastHeartbeat) / 1000));
      }
    }

    const resultUsers: Array<{ id: string; name: string; username: string; grade: number; mode: string; lastSeenSecondsAgo: number }> = [];
    for (const [userId, lastSeenSecondsAgo] of onlineMap.entries()) {
      const u = this.getUserById(userId);
      if (u) {
        resultUsers.push({
          id: u.id,
          name: u.displayName,
          username: u.username || '—',
          grade: u.grade,
          mode: u.mode,
          lastSeenSecondsAgo,
        });
      }
    }

    return {
      count: resultUsers.length,
      users: resultUsers,
    };
  }

  getWeeklyActivity(userId: string): {
    week: Array<{
      dayKey: string;
      dayName: string;
      dateStr: string;
      minutes: number;
      lessonsDone: number;
      problemsSolved: number;
      isToday: boolean;
      dayIndex: number;
    }>;
    currentDayIndex: number;
    todayDateStr: string;
    currentStreak: number;
  } {
    const weekDays = getTashkentWeekDays();
    const currentDayIndex = getTashkentDayOfWeek();
    const todayDateStr = getTashkentDateString();
    const streak = this.calculateStreak(userId);

    const week = weekDays.map((w) => {
      const key = `${userId}:${w.dateStr}`;
      const act = this.dailyActivities.get(key);
      return {
        dayKey: w.dayKey,
        dayName: w.dayName,
        dateStr: w.dateStr,
        minutes: act ? Math.floor(act.seconds / 60) : 0,
        lessonsDone: act ? act.lessonsDone : 0,
        problemsSolved: act ? act.problemsSolved : 0,
        isToday: w.isToday,
        dayIndex: w.dayIndex,
      };
    });

    return {
      week,
      currentDayIndex,
      todayDateStr,
      currentStreak: streak.currentStreak,
    };
  }

  getStudyHistory7Days(userId: string): {
    history: Array<{
      dateStr: string;
      dayName: string;
      dayKey: string;
      minutes: number;
      lessonsDone: number;
      problemsSolved: number;
    }>;
    totalMinutes: number;
    todayMinutes: number;
  } {
    const todayStr = getTashkentDateString();
    const [y, m, d] = todayStr.split('-').map(Number);
    const todayDate = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));

    const history = [];
    let totalMinutes = 0;
    let todayMinutes = 0;

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(todayDate.getTime() - i * 24 * 3600 * 1000);
      const dateStr = getTashkentDateString(dayDate);
      const dayIdx = getTashkentDayOfWeek(dayDate);
      const dayKey = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'][dayIdx];
      const dayName = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'][dayIdx];

      const act = this.dailyActivities.get(`${userId}:${dateStr}`);
      const mins = act ? Math.floor(act.seconds / 60) : 0;
      if (i === 0) todayMinutes = mins;
      totalMinutes += mins;

      history.push({
        dateStr,
        dayName,
        dayKey,
        minutes: mins,
        lessonsDone: act ? act.lessonsDone : 0,
        problemsSolved: act ? act.problemsSolved : 0,
      });
    }

    return { history, totalMinutes, todayMinutes };
  }

  // --- Streak Calculation ---
  calculateStreak(userId: string): { currentStreak: number; longestStreak: number } {
    const user = this.getUserById(userId);
    if (!user) return { currentStreak: 0, longestStreak: 0 };

    if (user.currentStreak === undefined) user.currentStreak = 1;
    if (user.longestStreak === undefined) user.longestStreak = Math.max(1, user.currentStreak);

    const todayStr = getTashkentDateString();
    const [y, m, d] = todayStr.split('-').map(Number);
    const todayDate = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));

    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(todayDate.getTime() - i * 24 * 3600 * 1000);
      const dateStr = getTashkentDateString(checkDate);
      const key = `${userId}:${dateStr}`;
      const act = this.dailyActivities.get(key);

      const hadActivity =
        (act && (act.lessonsDone > 0 || act.problemsSolved > 0 || act.seconds >= 60)) ||
        (i === 0 && (user.completedLessons.length > 0 || user.solvedQuestions.length > 0));

      if (hadActivity) {
        streak++;
      } else {
        if (i === 0) continue; // if today is just starting, streak from yesterday still counts
        break;
      }
    }

    user.currentStreak = Math.max(user.currentStreak, streak);
    user.longestStreak = Math.max(user.longestStreak, user.currentStreak);

    if (user.currentStreak >= 7 && !user.unlockedAchievements.includes('ach_streak_hero')) {
      user.unlockedAchievements.push('ach_streak_hero');
    }

    return { currentStreak: user.currentStreak, longestStreak: user.longestStreak };
  }

  // --- Daily Missions (Strictly 3 per day, Asia/Tashkent 00:00 midnight reset) ---
  getTodayMissions(userId: string): {
    missions: DailyMissionRecord[];
    secondsUntilMidnight: number;
    completedCount: number;
    claimedCount: number;
    todayDateStr: string;
  } {
    const user = this.getUserById(userId);
    const today = getTashkentDateString();
    const secondsUntilMidnight = getTashkentSecondsUntilMidnight();

    if (!user) {
      const templates = [
        {
          templateId: 'misol_5',
          title: '5 ta misolni to‘g‘ri yeching',
          description: 'Dars yoki mashqlardan 5 ta to‘g‘ri javob toping.',
          targetCount: 5,
          rewardCoins: 1,
          rewardXP: 10,
        },
        {
          templateId: 'dars_1',
          title: '1 ta darsni tugating',
          description: 'O‘quv mavzusidan kamida 1 ta darsni muvaffaqiyatli yakunlang.',
          targetCount: 1,
          rewardCoins: 2,
          rewardXP: 20,
        },
        {
          templateId: 'kosmik_1',
          title: 'Kosmik hisob o‘yinini o‘ynang',
          description: 'Fazoviy arifmetika o‘yinida kamida 1 raund o‘ynang.',
          targetCount: 1,
          rewardCoins: 1,
          rewardXP: 10,
        },
      ];

      const guestMissions = templates.map((tmpl) => ({
        id: `mission_guest_${today}_${tmpl.templateId}`,
        userId: 'guest',
        date: today,
        templateId: tmpl.templateId,
        title: tmpl.title,
        description: tmpl.description,
        targetCount: tmpl.targetCount,
        currentCount: 0,
        rewardCoins: tmpl.rewardCoins,
        rewardXP: tmpl.rewardXP,
        status: 'ACTIVE' as MissionStatus,
        isCompleted: false,
        claimed: false,
      }));

      return {
        missions: guestMissions,
        secondsUntilMidnight,
        completedCount: 0,
        claimedCount: 0,
        todayDateStr: today,
      };
    }

    const userMissions = this.dailyMissions.get(userId) || [];

    // Expire older uncompleted missions
    for (const m of userMissions) {
      if (m.date !== today && m.status !== 'CLAIMED') {
        m.status = 'EXPIRED';
      }
    }

    let todayMissions = userMissions.filter((m) => m.date === today);

    // If not created yet today, create exactly 3 missions from templates
    if (todayMissions.length === 0) {
      const templates = [
        {
          templateId: 'misol_5',
          title: '5 ta misolni to‘g‘ri yeching',
          description: 'Dars yoki mashqlardan 5 ta to‘g‘ri javob toping.',
          targetCount: 5,
          rewardCoins: 1,
          rewardXP: 10,
        },
        {
          templateId: 'dars_1',
          title: '1 ta darsni tugating',
          description: 'O‘quv mavzusidan kamida 1 ta darsni muvaffaqiyatli yakunlang.',
          targetCount: 1,
          rewardCoins: 2,
          rewardXP: 20,
        },
        {
          templateId: 'kosmik_1',
          title: 'Kosmik hisob o‘yinini o‘ynang',
          description: 'Fazoviy arifmetika o‘yinida kamida 1 raund o‘ynang.',
          targetCount: 1,
          rewardCoins: 1,
          rewardXP: 10,
        },
      ];

      todayMissions = templates.map((tmpl) => ({
        id: `mission_${userId}_${today}_${tmpl.templateId}`,
        userId,
        date: today,
        templateId: tmpl.templateId,
        title: tmpl.title,
        description: tmpl.description,
        targetCount: tmpl.targetCount,
        currentCount: 0,
        rewardCoins: tmpl.rewardCoins,
        rewardXP: tmpl.rewardXP,
        status: 'ACTIVE' as MissionStatus,
        isCompleted: false,
        claimed: false,
      }));

      this.dailyMissions.set(userId, [...userMissions.filter((m) => m.date !== today), ...todayMissions]);
    }

    const completedCount = todayMissions.filter((m) => m.isCompleted || m.status === 'COMPLETED' || m.status === 'CLAIMED').length;
    const claimedCount = todayMissions.filter((m) => m.claimed || m.status === 'CLAIMED').length;

    return {
      missions: todayMissions,
      secondsUntilMidnight,
      completedCount,
      claimedCount,
      todayDateStr: today,
    };
  }

  advanceMissionProgress(userId: string, type: 'SOLVE_PROBLEM' | 'COMPLETE_LESSON' | 'PLAY_GAME' | 'AI_CONSULT' | 'STUDY_MINUTES', count = 1): void {
    const user = this.getUserById(userId);
    if (!user) return;

    const { missions } = this.getTodayMissions(userId);
    const templateMapping: Record<string, string> = {
      SOLVE_PROBLEM: 'misol_5',
      COMPLETE_LESSON: 'dars_1',
      PLAY_GAME: 'kosmik_1',
      AI_CONSULT: 'ziyo_1',
      STUDY_MINUTES: 'vaqt_10',
    };
    const targetTemplateId = templateMapping[type];

    for (const m of missions) {
      if (m.status === 'CLAIMED' || m.status === 'EXPIRED') continue;
      if (m.templateId === targetTemplateId) {
        m.currentCount = Math.min(m.targetCount, m.currentCount + count);
        if (m.currentCount >= m.targetCount) {
          m.isCompleted = true;
          if (m.status === 'ACTIVE') {
            m.status = 'COMPLETED';
          }
        }
      }
    }
  }

  claimMissionReward(userId: string, missionIdOrKey: string): {
    success: boolean;
    coinsAwarded: number;
    newCoinBalance: number;
    newTotalXP: number;
    error?: string;
  } {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Foydalanuvchi topilmadi');

    const { missions } = this.getTodayMissions(userId);
    const mission = missions.find((m) => m.id === missionIdOrKey || m.templateId === missionIdOrKey);

    if (!mission) {
      return { success: false, coinsAwarded: 0, newCoinBalance: user.coinBalance, newTotalXP: user.totalXP, error: 'Vazifa topilmadi.' };
    }

    if (mission.status === 'CLAIMED') {
      return { success: false, coinsAwarded: 0, newCoinBalance: user.coinBalance, newTotalXP: user.totalXP, error: 'Mukofot allaqachon olingan.' };
    }

    if (mission.currentCount < mission.targetCount) {
      return { success: false, coinsAwarded: 0, newCoinBalance: user.coinBalance, newTotalXP: user.totalXP, error: 'Ushbu vazifa hali yakunlanmagan.' };
    }

    mission.claimed = true;
    mission.status = 'CLAIMED';

    this.creditCoins(userId, mission.rewardCoins, `Kunlik vazifa mukofoti: ${mission.title}`);
    this.addXP(userId, mission.rewardXP);

    return {
      success: true,
      coinsAwarded: mission.rewardCoins,
      newCoinBalance: user.coinBalance,
      newTotalXP: user.totalXP,
    };
  }

  // --- Pro-Only Achievements ---
  getAchievementsForUser(userId: string): {
    isPro: boolean;
    unlockedCount: number;
    achievements: Array<{
      key: string;
      title: string;
      description: string;
      iconName: string;
      rewardCoins: number;
      rewardXP: number;
      isUnlocked: boolean;
      isClaimed: boolean;
      progressText: string;
      progressRatio: number;
    }>;
  } {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Foydalanuvchi topilmadi');

    const isPro = user.subscription?.status === 'PRO_ACTIVE';
    user.unlockedAchievements = user.unlockedAchievements || [];
    user.claimedAchievements = user.claimedAchievements || [];
    user.completedLessons = user.completedLessons || [];

    const all = this.achievements.map((ach) => {
      const isUnlocked = user.unlockedAchievements!.includes(ach.key);
      const isClaimed = user.claimedAchievements!.includes(ach.key);

      let progressText = isUnlocked ? 'Ochilgan' : '0/1';
      let progressRatio = isUnlocked ? 1.0 : 0.0;

      if (ach.key === 'ach_first_step') {
        const count = user.completedLessons!.length;
        progressRatio = Math.min(1.0, count / 1);
        progressText = isUnlocked ? '1/1 dars' : `${count}/1 dars`;
      } else if (ach.key === 'ach_math_whiz') {
        const consec = user.consecutiveCorrectAnswers || (isUnlocked ? 10 : 0);
        progressRatio = Math.min(1.0, consec / 10);
        progressText = `${consec}/10 xatosiz`;
      } else if (ach.key === 'ach_streak_hero') {
        const s = user.currentStreak || 0;
        progressRatio = Math.min(1.0, s / 7);
        progressText = `${s}/7 kun`;
      } else if (ach.key === 'ach_sharp_shooter') {
        const att = user.attemptedQuestionCount || 0;
        const acc = att > 0 ? Math.round((user.correctQuestionCount / att) * 100) : 0;
        progressRatio = att >= 50 && acc >= 90 ? 1.0 : Math.min(1.0, att / 50);
        progressText = `${acc}% (${att}/50)`;
      } else if (ach.key === 'ach_space_cadet') {
        progressText = isUnlocked ? 'Yutildi' : '1-daraja';
      }

      return {
        key: ach.key,
        title: ach.title,
        description: ach.description,
        iconName: ach.iconName,
        rewardCoins: ach.rewardCoins,
        rewardXP: ach.rewardXP,
        isUnlocked,
        isClaimed,
        progressText,
        progressRatio,
      };
    });

    const unlockedCount = all.filter((a) => a.isUnlocked).length;
    return { isPro, unlockedCount, achievements: all };
  }

  claimAchievementReward(userId: string, achievementKey: string): {
    success: boolean;
    coinsAwarded: number;
    xpAwarded: number;
    newCoinBalance: number;
    newTotalXP: number;
    error?: string;
  } {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Foydalanuvchi topilmadi');

    if (user.subscription?.status !== 'PRO_ACTIVE') {
      return {
        success: false,
        coinsAwarded: 0,
        xpAwarded: 0,
        newCoinBalance: user.coinBalance,
        newTotalXP: user.totalXP,
        error: 'Yutuqlar mukofoti faqat MathCity Pro tarifida ochiladi.',
      };
    }

    user.claimedAchievements = user.claimedAchievements || [];
    if (user.claimedAchievements.includes(achievementKey)) {
      return {
        success: false,
        coinsAwarded: 0,
        xpAwarded: 0,
        newCoinBalance: user.coinBalance,
        newTotalXP: user.totalXP,
        error: 'Mukofot avval olingan.',
      };
    }

    const def = this.achievements.find((a) => a.key === achievementKey);
    if (!def) {
      return {
        success: false,
        coinsAwarded: 0,
        xpAwarded: 0,
        newCoinBalance: user.coinBalance,
        newTotalXP: user.totalXP,
        error: 'Yutuq topilmadi.',
      };
    }

    if (!user.unlockedAchievements.includes(achievementKey)) {
      return {
        success: false,
        coinsAwarded: 0,
        xpAwarded: 0,
        newCoinBalance: user.coinBalance,
        newTotalXP: user.totalXP,
        error: 'Ushbu yutuq hali ochilmagan.',
      };
    }

    user.claimedAchievements.push(achievementKey);
    this.creditCoins(userId, def.rewardCoins, `Yutuq mukofoti: ${def.title}`);
    this.addXP(userId, def.rewardXP);

    return {
      success: true,
      coinsAwarded: def.rewardCoins,
      xpAwarded: def.rewardXP,
      newCoinBalance: user.coinBalance,
      newTotalXP: user.totalXP,
    };
  }

  // --- Learning Statistics ---
  getDailyActivity(userId: string, dateStr: string): DailyActivityRecord | undefined {
    return this.dailyActivities.get(`${userId}:${dateStr}`);
  }

  getTodayStudyMinutes(userId: string): number {
    const todayStr = getTashkentDateString();
    const act = this.dailyActivities.get(`${userId}:${todayStr}`);
    return act ? Math.floor(act.seconds / 60) : 0;
  }

  getLearningStats(userId: string): {
    attemptedQuestions: number;
    correctQuestions: number;
    accuracyPercentage: number;
    studyMinutesTotal: number;
    longestStreak: number;
    currentStreak: number;
    totalCoins: number;
    totalXP: number;
    level: number;
    completedLessons: number;
    weeklyActivity: Array<{ dayKey: string; count: number; isToday: boolean }>;
    topicMastery: Array<{
      chapterTitle: string;
      totalLessons: number;
      completedLessons: number;
      accuracy: number;
      masteryPercentage: number;
      statusLabel: string;
      statusColor: string;
    }>;
  } {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Foydalanuvchi topilmadi');

    const attempted = user.attemptedQuestionCount || 0;
    const correct = user.correctQuestionCount || 0;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 100;

    const weekDays = getTashkentWeekDays();
    const weeklyActivity = weekDays.map((w) => {
      const act = this.dailyActivities.get(`${userId}:${w.dateStr}`);
      return {
        dayKey: w.dayKey,
        count: act ? act.problemsSolved : 0,
        isToday: w.isToday,
      };
    });

    const topicMastery = this.getTopicMastery(userId);

    let totalSeconds = 0;
    for (const act of this.dailyActivities.values()) {
      if (act.userId === userId) {
        totalSeconds += act.seconds;
      }
    }
    const studyMinutesTotal = Math.floor(totalSeconds / 60);
    const streak = this.calculateStreak(userId);

    return {
      attemptedQuestions: attempted,
      correctQuestions: correct,
      accuracyPercentage: accuracy,
      studyMinutesTotal,
      longestStreak: streak.longestStreak,
      currentStreak: streak.currentStreak,
      totalCoins: user.coinBalance,
      totalXP: user.totalXP,
      level: user.level || 1,
      completedLessons: user.completedLessons.length,
      weeklyActivity,
      topicMastery,
    };
  }

  getTopicMastery(userId: string): Array<{
    chapterTitle: string;
    totalLessons: number;
    completedLessons: number;
    accuracy: number;
    masteryPercentage: number;
    statusLabel: string;
    statusColor: string;
  }> {
    const user = this.getUserById(userId);
    if (!user) return [];

    const chaptersMap = new Map<string, { total: number; completed: number }>();
    for (const lesson of this.lessons) {
      const ch = lesson.chapterTitle || 'Boshlang‘ich matematika';
      let entry = chaptersMap.get(ch);
      if (!entry) {
        entry = { total: 0, completed: 0 };
        chaptersMap.set(ch, entry);
      }
      entry.total++;
      if (user.completedLessons.includes(lesson.id)) {
        entry.completed++;
      }
    }

    const overallAccuracy = user.attemptedQuestionCount > 0
      ? (user.correctQuestionCount / user.attemptedQuestionCount) * 100
      : 100;

    return Array.from(chaptersMap.entries()).map(([chapterTitle, stats]) => {
      const lessonRatio = stats.total > 0 ? stats.completed / stats.total : 0;
      const accuracyPortion = stats.completed > 0 ? overallAccuracy : 0;

      // Formula: 0.6 * (completed / total) + 0.4 * last30Accuracy
      let mastery = Math.round(0.6 * lessonRatio * 100 + 0.4 * accuracyPortion);

      let statusLabel = 'Boshlanmagan';
      let statusColor = '#94A3B8';

      if (stats.completed > 0 || mastery > 0) {
        if (mastery >= 90) {
          statusLabel = 'A‘lo';
          statusColor = '#22C55E';
        } else if (mastery >= 75) {
          statusLabel = 'Yaxshi';
          statusColor = '#6C55E0';
        } else {
          statusLabel = 'Qoniqarli';
          statusColor = '#F59E0B';
        }
      }

      return {
        chapterTitle,
        totalLessons: stats.total,
        completedLessons: stats.completed,
        accuracy: Math.round(accuracyPortion),
        masteryPercentage: mastery,
        statusLabel,
        statusColor,
      };
    });
  }

  // --- User Settings ---
  getUserSettings(userId: string) {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Foydalanuvchi topilmadi');
    return (
      user.settings || {
        soundEnabled: true,
        animationsEnabled: true,
        dailyReminderEnabled: true,
        reminderTime: '18:00',
        mode: user.mode || 'KIDS',
        theme: 'SYSTEM',
      }
    );
  }

  updateUserSettings(
    userId: string,
    patch: Partial<{
      soundEnabled: boolean;
      animationsEnabled: boolean;
      dailyReminderEnabled: boolean;
      reminderTime: string;
      mode: string;
      theme: string;
    }>
  ) {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Foydalanuvchi topilmadi');

    user.settings = { ...this.getUserSettings(userId), ...patch };
    if (patch.mode && patch.mode === 'KIDS') {
      user.mode = 'KIDS';
    }
    return user.settings;
  }

  exportUserData(userId: string) {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Foydalanuvchi topilmadi');
    const { history } = this.getStudyHistory7Days(userId);
    const { week } = this.getWeeklyActivity(userId);
    const stats = this.getLearningStats(userId);

    return {
      profile: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        grade: user.grade,
        mode: user.mode,
        coinBalance: user.coinBalance,
        totalXP: user.totalXP,
        level: user.level,
        currentStreak: user.currentStreak || 1,
        longestStreak: user.longestStreak || 1,
        subscription: user.subscription,
      },
      stats,
      weeklyStudyHistory: history,
      weeklyActivity: week,
      completedLessons: user.completedLessons,
      gameResults: user.gameResults || [],
      exportedAt: new Date().toISOString(),
    };
  }

  // --- Real Game Rewards & Anti-Farming ---
  finishGame(
    userId: string,
    gameKey: string,
    score: number,
    durationSeconds: number
  ): {
    success: boolean;
    coinsEarned: number;
    xpEarned: number;
    newCoinBalance: number;
    newTotalXP: number;
    highScore: number;
    timesPlayed: number;
  } {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Foydalanuvchi topilmadi');

    user.gameResults = user.gameResults || [];

    // Coin award: 1 coin per 10 points up to 15 coins per game
    const baseCoins = Math.min(15, Math.floor(score / 10));
    const coinsEarned = baseCoins > 0 ? baseCoins : score >= 5 ? 1 : 0;
    const xpEarned = Math.min(50, Math.max(10, Math.floor(score * 1.5)));

    if (coinsEarned > 0) {
      this.creditCoins(userId, coinsEarned, `${gameKey === 'kosmik_hisob' ? 'Kosmik hisob' : 'Kasrlar jangi'} yutug‘i`);
    }
    if (xpEarned > 0) {
      this.addXP(userId, xpEarned);
    }

    user.gameResults.unshift({
      id: `game_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      gameKey,
      score,
      coinsEarned,
      xpEarned,
      playedAt: new Date().toISOString(),
    });
    if (user.gameResults.length > 20) {
      user.gameResults = user.gameResults.slice(0, 20);
    }

    // Advance daily mission
    this.advanceMissionProgress(userId, 'PLAY_GAME', 1);

    // Check achievement: ach_space_cadet
    if (score >= 50 && !user.unlockedAchievements.includes('ach_space_cadet')) {
      user.unlockedAchievements.push('ach_space_cadet');
    }

    const userGames = user.gameResults.filter((g) => g.gameKey === gameKey);
    const highScore = userGames.reduce((max, g) => Math.max(max, g.score), score);
    const timesPlayed = userGames.length;

    return {
      success: true,
      coinsEarned,
      xpEarned,
      newCoinBalance: user.coinBalance,
      newTotalXP: user.totalXP,
      highScore,
      timesPlayed,
    };
  }

  getRecentGameResults(userId: string) {
    const user = this.getUserById(userId);
    if (!user) return [];
    return (user.gameResults || []).slice(0, 3).map((g) => ({
      ...g,
      title: g.gameKey === 'uy_qurish' ? 'Uy qurish' : g.gameKey === 'kosmik_hisob' ? 'Kosmik hisob' : 'Kasrlar jangi',
    }));
  }

  // --- House Building Game ---
  getHouseBuildingProgress(userId: string) {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Foydalanuvchi topilmadi');
    if (!user.houseBuildingProgress) {
      user.houseBuildingProgress = {
        currentStage: 0,
        completedStages: [],
        isFinished: false,
      };
    }
    const stages = [
      { stage: 1, title: 'Poydevor', cost: 50, xp: 50, description: 'Mustahkam beton poydevor va yer maydoni' },
      { stage: 2, title: 'Uy devorlari', cost: 150, xp: 150, description: 'Zamonaviy arxitektura va g‘ishtli devorlar' },
      { stage: 3, title: 'Uy tomi', cost: 100, xp: 100, description: 'Zamonaviy terassali tekis tom' },
      { stage: 4, title: 'Derazalar', cost: 50, xp: 80, description: 'Panoramali shaffof oynali derazalar' },
      { stage: 5, title: 'Eshiklar', cost: 90, xp: 100, description: 'Yog‘och kirish eshigi va garaj darvozasi' },
      { stage: 6, title: 'Mashina', cost: 300, xp: 300, description: 'Hovlida zamonaviy sport avtomobili va landshaft' },
    ];
    return {
      currentStage: user.houseBuildingProgress.currentStage,
      completedStages: user.houseBuildingProgress.completedStages,
      isFinished: user.houseBuildingProgress.isFinished,
      stages,
      userCoins: user.coinBalance,
      userXP: user.totalXP,
    };
  }

  buildHouseStage(userId: string, stage: number) {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Foydalanuvchi topilmadi');
    if (!user.houseBuildingProgress) {
      user.houseBuildingProgress = {
        currentStage: 0,
        completedStages: [],
        isFinished: false,
      };
    }

    const currentStage = user.houseBuildingProgress.currentStage;
    if (user.houseBuildingProgress.completedStages.includes(stage)) {
      return {
        success: false,
        error: `${stage}-bosqich allaqachon qurilgan!`,
      };
    }
    if (stage !== currentStage + 1) {
      return {
        success: false,
        error: `Avval ${currentStage + 1}-bosqichni qurishingiz kerak!`,
      };
    }

    const stages = [
      { stage: 1, title: 'Poydevor', cost: 50, xp: 50 },
      { stage: 2, title: 'Uy devorlari', cost: 150, xp: 150 },
      { stage: 3, title: 'Uy tomi', cost: 100, xp: 100 },
      { stage: 4, title: 'Derazalar', cost: 50, xp: 80 },
      { stage: 5, title: 'Eshiklar', cost: 90, xp: 100 },
      { stage: 6, title: 'Mashina', cost: 300, xp: 300 },
    ];
    const stageConfig = stages.find((s) => s.stage === stage);
    if (!stageConfig) {
      return {
        success: false,
        error: 'Bunday bosqich mavjud emas.',
      };
    }

    if (user.coinBalance < stageConfig.cost) {
      return {
        success: false,
        error: 'Tangalar yetarli emas! Misol yechib tanga ishlab ol',
        neededCoins: stageConfig.cost,
        userCoins: user.coinBalance,
      };
    }

    this.debitCoins(userId, stageConfig.cost, `Uy qurish: ${stageConfig.title}`);
    this.addXP(userId, stageConfig.xp);

    user.houseBuildingProgress.completedStages.push(stage);
    user.houseBuildingProgress.currentStage = stage;
    user.houseBuildingProgress.isFinished = stage >= 6;
    user.houseBuildingProgress.lastBuiltAt = new Date().toISOString();

    if (user.houseBuildingProgress.isFinished && !user.unlockedAchievements.includes('ach_master_builder')) {
      user.unlockedAchievements.push('ach_master_builder');
    }

    this.persistUserToDatabase(user).catch(() => { });

    return {
      success: true,
      stage,
      progress: user.houseBuildingProgress,
      coinBalance: user.coinBalance,
      totalXP: user.totalXP,
      xpEarned: stageConfig.xp,
      coinsSpent: stageConfig.cost,
      isFinished: user.houseBuildingProgress.isFinished,
    };
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

  // --- 3D Car Game & Drift Mode Store ---
  private userCars: Map<string, UserGameCarItem[]> = new Map();
  private driftScores: GameDriftScoreItem[] = [];

  getGameCars(userId: string): Array<GameCarModel & { isUnlocked: boolean; isOwned: boolean; selectedColor: string; selectedWheels: string; condition: number; timesDriven: number }> {
    let cars = this.userCars.get(userId);
    if (!cars) {
      const defaultCar = initialGameCars[0];
      cars = [
        {
          id: `car_${Date.now()}_default`,
          userId,
          carKey: defaultCar.key,
          isUnlocked: true,
          selectedColor: defaultCar.defaultColor,
          selectedWheels: defaultCar.defaultWheels,
          condition: 100,
          timesDriven: 0,
          unlockedAt: new Date().toISOString(),
        },
      ];
      this.userCars.set(userId, cars);
    }

    return initialGameCars.map((car) => {
      const owned = cars?.find((c) => c.carKey === car.key && c.isUnlocked);
      return {
        ...car,
        isUnlocked: Boolean(owned?.isUnlocked),
        isOwned: Boolean(owned?.isUnlocked),
        selectedColor: owned?.selectedColor || car.defaultColor,
        selectedWheels: owned?.selectedWheels || car.defaultWheels,
        condition: owned ? owned.condition : 100,
        timesDriven: owned ? owned.timesDriven : 0,
      };
    });
  }

  buyGameCar(userId: string, carKey: string): { success: boolean; car: GameCarModel; newCoinBalance: number } {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Foydalanuvchi topilmadi');

    const carDef = initialGameCars.find((c) => c.key === carKey);
    if (!carDef) throw new Error('Mashina modeli topilmadi');

    let cars = this.userCars.get(userId) || [];
    const alreadyOwned = cars.find((c) => c.carKey === carKey && c.isUnlocked);
    if (alreadyOwned) {
      throw new Error('Siz bu mashinani allaqachon sotib olgansiz');
    }

    if (user.coinBalance < carDef.priceCoins) {
      throw new Error(`Mashinani sotib olish uchun tangalar yetarli emas (kerak: ${carDef.priceCoins}, sizda: ${user.coinBalance})`);
    }

    if (carDef.priceCoins > 0) {
      this.debitCoins(userId, carDef.priceCoins, `${carDef.name} mashinasini sotib olish`);
    }

    const newCarItem: UserGameCarItem = {
      id: `car_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      carKey: carDef.key,
      isUnlocked: true,
      selectedColor: carDef.defaultColor,
      selectedWheels: carDef.defaultWheels,
      condition: 100,
      timesDriven: 0,
      unlockedAt: new Date().toISOString(),
    };

    cars.push(newCarItem);
    this.userCars.set(userId, cars);

    return {
      success: true,
      car: carDef,
      newCoinBalance: user.coinBalance,
    };
  }

  customizeGameCar(userId: string, carKey: string, color?: string, wheels?: string): { success: boolean; carKey: string; selectedColor: string; selectedWheels: string } {
    const cars = this.userCars.get(userId) || [];
    const carItem = cars.find((c) => c.carKey === carKey && c.isUnlocked);
    if (!carItem) {
      throw new Error('Avval ushbu mashinani ochishingiz yoki sotib olishingiz kerak');
    }

    if (color) carItem.selectedColor = color;
    if (wheels) carItem.selectedWheels = wheels;

    return {
      success: true,
      carKey,
      selectedColor: carItem.selectedColor,
      selectedWheels: carItem.selectedWheels,
    };
  }

  repairGameCar(userId: string, carKey: string): { success: boolean; condition: number; coinsDeducted: number; newCoinBalance: number } {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Foydalanuvchi topilmadi');

    const cars = this.userCars.get(userId) || [];
    const carItem = cars.find((c) => c.carKey === carKey && c.isUnlocked);
    if (!carItem) {
      throw new Error('Mashina topilmadi');
    }

    if (carItem.condition >= 100) {
      return {
        success: true,
        condition: 100,
        coinsDeducted: 0,
        newCoinBalance: user.coinBalance,
      };
    }

    const damagePercent = 100 - carItem.condition;
    const repairCost = Math.ceil(damagePercent * 0.3);

    if (repairCost > 0 && user.coinBalance < repairCost) {
      throw new Error(`Mashinani ta’mirlash uchun tangalar yetarli emas (kerak: ${repairCost})`);
    }

    if (repairCost > 0) {
      this.debitCoins(userId, repairCost, 'Mashinani garajda ta’mirlash');
    }

    carItem.condition = 100;

    return {
      success: true,
      condition: 100,
      coinsDeducted: repairCost,
      newCoinBalance: user.coinBalance,
    };
  }

  saveDriftScore(
    userId: string,
    carKey: string,
    score: number,
    maxCombo: number
  ): {
    score: number;
    maxCombo: number;
    coinsAwarded: number;
    xpAwarded: number;
    newCoinBalance: number;
    newTotalXP: number;
  } {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Foydalanuvchi topilmadi');

    const coinsAwarded = Math.min(50, Math.floor(score / 400));
    const xpAwarded = Math.min(150, Math.floor(score / 150));

    if (coinsAwarded > 0) {
      this.creditCoins(userId, coinsAwarded, `MathCity Drift rekordi: ${score} ball (x${maxCombo} combo)`);
    }
    if (xpAwarded > 0) {
      this.addXP(userId, xpAwarded);
    }

    const entry: GameDriftScoreItem = {
      id: `drift_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      carKey,
      score,
      maxCombo,
      coinsAwarded,
      xpAwarded,
      createdAt: new Date().toISOString(),
      user: {
        id: user.id,
        fullName: user.displayName || user.username || 'Foydalanuvchi',
        avatarUrl: user.avatarUrl,
      },
    };

    this.driftScores.push(entry);

    const cars = this.userCars.get(userId) || [];
    const carItem = cars.find((c) => c.carKey === carKey);
    if (carItem) {
      carItem.timesDriven = (carItem.timesDriven || 0) + 1;
      carItem.lastDrivenAt = new Date().toISOString();
    }

    return {
      score,
      maxCombo,
      coinsAwarded,
      xpAwarded,
      newCoinBalance: user.coinBalance,
      newTotalXP: user.totalXP,
    };
  }

  getDriftLeaderboard(limit: number = 20): GameDriftScoreItem[] {
    return [...this.driftScores]
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}

export interface UserGameCarItem {
  id: string;
  userId: string;
  carKey: string;
  isUnlocked: boolean;
  selectedColor: string;
  selectedWheels: string;
  condition: number;
  timesDriven: number;
  unlockedAt: string;
  lastDrivenAt?: string;
  car?: GameCarModel;
}

export interface GameDriftScoreItem {
  id: string;
  userId: string;
  carKey: string;
  score: number;
  maxCombo: number;
  coinsAwarded: number;
  xpAwarded: number;
  createdAt: string;
  user?: {
    id: string;
    fullName: string;
    avatarUrl?: string;
  };
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

