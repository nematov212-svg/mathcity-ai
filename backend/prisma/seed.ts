import { PrismaClient, Mode, QuestionType, SubscriptionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  initialLessons,
  initialBuildings,
  initialDailyTasks,
  initialAchievements,
} from '../src/utils/dataStore.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding MathCity AI PostgreSQL Database...');

  // 1. Seed Building Definitions
  console.log('🏗️ Seeding Building Definitions...');
  for (const b of initialBuildings) {
    await prisma.buildingDefinition.upsert({
      where: { key: b.key },
      update: {
        name: b.name,
        category: b.category,
        costInCoins: b.costInCoins,
        requiredLevel: b.requiredLevel,
        description: b.description,
        iconName: b.iconName,
        mode: b.mode as Mode,
      },
      create: {
        key: b.key,
        name: b.name,
        category: b.category,
        costInCoins: b.costInCoins,
        requiredLevel: b.requiredLevel,
        description: b.description,
        iconName: b.iconName,
        mode: b.mode as Mode,
      },
    });
  }

  // 2. Seed Daily Tasks
  console.log('📋 Seeding Daily Tasks...');
  for (const t of initialDailyTasks) {
    await prisma.dailyTask.upsert({
      where: { key: t.key },
      update: {
        title: t.title,
        description: t.description,
        targetCount: t.targetCount,
        rewardCoins: t.rewardCoins,
        rewardXP: t.rewardXP,
      },
      create: {
        key: t.key,
        title: t.title,
        description: t.description,
        targetCount: t.targetCount,
        rewardCoins: t.rewardCoins,
        rewardXP: t.rewardXP,
      },
    });
  }

  // 3. Seed Achievements
  console.log('🏆 Seeding Achievements...');
  for (const a of initialAchievements) {
    await prisma.achievement.upsert({
      where: { key: a.key },
      update: {
        title: a.title,
        description: a.description,
        iconName: a.iconName,
        rewardCoins: a.rewardCoins,
        rewardXP: a.rewardXP,
      },
      create: {
        key: a.key,
        title: a.title,
        description: a.description,
        iconName: a.iconName,
        rewardCoins: a.rewardCoins,
        rewardXP: a.rewardXP,
      },
    });
  }

  // 4. Seed Courses, Lessons, Sections, and Questions
  console.log(`📚 Seeding ${initialLessons.length} Mathematics Lessons...`);
  for (const l of initialLessons) {
    // Upsert Course
    const course = await prisma.course.upsert({
      where: { id: l.courseId },
      update: {
        title: `${l.grade}-sinf Matematika kursi`,
        description: `${l.grade}-sinf uchun mo‘ljallangan interaktiv matematika darslari to‘plami`,
        gradeMin: l.grade,
        gradeMax: l.grade,
        mode: l.mode as Mode,
      },
      create: {
        id: l.courseId,
        title: `${l.grade}-sinf Matematika kursi`,
        description: `${l.grade}-sinf uchun mo‘ljallangan interaktiv matematika darslari to‘plami`,
        gradeMin: l.grade,
        gradeMax: l.grade,
        mode: l.mode as Mode,
      },
    });

    // Upsert Lesson
    const lesson = await prisma.lesson.upsert({
      where: { id: l.id },
      update: {
        title: l.title,
        topicKey: l.topicKey,
        description: l.description,
        contentMd: l.contentMd,
        formulaLatex: l.formulaLatex,
        rewardXP: l.rewardXP,
        rewardCoins: l.rewardCoins,
        orderIndex: l.orderIndex,
      },
      create: {
        id: l.id,
        courseId: course.id,
        title: l.title,
        topicKey: l.topicKey,
        description: l.description,
        contentMd: l.contentMd,
        formulaLatex: l.formulaLatex,
        rewardXP: l.rewardXP,
        rewardCoins: l.rewardCoins,
        orderIndex: l.orderIndex,
      },
    });

    // Seed Sections & Questions
    if (l.sections && Array.isArray(l.sections)) {
      for (const s of l.sections) {
        const section = await prisma.section.upsert({
          where: { id: s.id },
          update: {
            title: s.title,
            orderIndex: s.orderIndex,
          },
          create: {
            id: s.id,
            lessonId: lesson.id,
            title: s.title,
            orderIndex: s.orderIndex,
          },
        });

        for (const q of s.questions || []) {
          await prisma.question.upsert({
            where: { id: q.id },
            update: {
              prompt: q.prompt,
              type: (q.type as QuestionType) || QuestionType.MULTIPLE_CHOICE,
              optionsJson: JSON.stringify(q.options || []),
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              hint: q.hint,
              formulaLatex: q.formulaLatex,
              orderIndex: q.orderIndex,
            },
            create: {
              id: q.id,
              lessonId: lesson.id,
              sectionId: section.id,
              prompt: q.prompt,
              type: (q.type as QuestionType) || QuestionType.MULTIPLE_CHOICE,
              optionsJson: JSON.stringify(q.options || []),
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              hint: q.hint,
              formulaLatex: q.formulaLatex,
              orderIndex: q.orderIndex,
            },
          });
        }
      }
    }
  }

  // 5. Seed Demo Student
  console.log('👤 Seeding Demo Student Account...');
  const demoEmail = 'ali@mathcity.ai';
  const hashedPassword = await bcrypt.hash('securepassword123', 10);
  const now = new Date();
  const trialExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const demoUser = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {
      username: 'ali',
      isActive: true,
    },
    create: {
      id: 'demo-student-id',
      email: demoEmail,
      username: 'ali',
      passwordHash: hashedPassword,
      isActive: true,
    },
  });

  await prisma.studentProfile.upsert({
    where: { userId: demoUser.id },
    update: {
      displayName: 'Ali',
      grade: 4,
      age: 11,
      mode: Mode.KIDS,
    },
    create: {
      userId: demoUser.id,
      displayName: 'Ali',
      dateOfBirth: new Date('2015-05-10'),
      age: 11,
      mode: Mode.KIDS,
      grade: 4,
      avatarUrl: 'assets/images/avatar_kid.png',
      cityLevel: 2,
    },
  });

  await prisma.subscription.upsert({
    where: { userId: demoUser.id },
    update: {
      status: SubscriptionStatus.FREE_TRIAL_ACTIVE,
    },
    create: {
      userId: demoUser.id,
      status: SubscriptionStatus.FREE_TRIAL_ACTIVE,
      trialStartedAt: now,
      trialExpiresAt: trialExpiry,
      platform: 'web',
    },
  });

  await prisma.coinWallet.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      balance: 100,
    },
  });

  await prisma.studentXP.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      totalXP: 380,
      level: 3,
    },
  });

  console.log('🎉 MathCity AI PostgreSQL Database Seeding Finished Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
