import { PrismaClient, Mode, QuestionType, SubscriptionStatus } from '@prisma/client';
import {
  initialLessons,
  initialBuildings,
  initialDailyTasks,
  initialAchievements,
} from '../utils/dataStore.js';
import { repository } from '../utils/repository.js';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function runLocalDataMigration(): Promise<{
  success: boolean;
  migratedUsers: number;
  migratedLessons: number;
  migratedBuildings: number;
  backupPath?: string;
  error?: string;
}> {
  console.log('🔄 Boshlandi: MathCity AI mahalliy maʼlumotlarni PostgreSQL-ga ko‘chirish (Migration)...');

  // 1. Zaxira nusxa yaratish (Local Data Backup)
  const backupDir = path.resolve(process.cwd(), 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `backup-before-migration-${timestamp}.json`);

  const backupData = {
    timestamp: new Date().toISOString(),
    lessonsCount: initialLessons.length,
    buildingsCount: initialBuildings.length,
    tasksCount: initialDailyTasks.length,
    achievementsCount: initialAchievements.length,
  };

  fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), 'utf-8');
  console.log(`💾 Mahalliy maʼlumotlar xavfsiz zaxira nusxasi saqlandi: ${backupPath}`);

  let migratedUsers = 0;
  let migratedLessons = 0;
  let migratedBuildings = 0;

  try {
    // 2. Binolar va shahar obyektlarini ko'chirish
    for (const b of initialBuildings) {
      await prisma.buildingDefinition.upsert({
        where: { key: b.key },
        update: {
          name: b.name,
          costInCoins: b.costInCoins,
          requiredLevel: b.requiredLevel,
          description: b.description,
          iconName: b.iconName,
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
      migratedBuildings++;
    }

    // 3. Matematika darslari va test mashqlarini ko'chirish
    for (const l of initialLessons) {
      const course = await prisma.course.upsert({
        where: { id: l.courseId },
        update: {},
        create: {
          id: l.courseId,
          title: `${l.grade}-sinf Matematika kursi`,
          description: `${l.grade}-sinf matematika darslari to‘plami`,
          gradeMin: l.grade,
          gradeMax: l.grade,
          mode: l.mode as Mode,
        },
      });

      const lesson = await prisma.lesson.upsert({
        where: { id: l.id },
        update: {
          title: l.title,
          topicKey: l.topicKey,
          contentMd: l.contentMd,
          rewardXP: l.rewardXP,
          rewardCoins: l.rewardCoins,
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

      if (l.sections && Array.isArray(l.sections)) {
        for (const s of l.sections) {
          const section = await prisma.section.upsert({
            where: { id: s.id },
            update: { title: s.title },
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
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
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
      migratedLessons++;
    }

    // 4. Foydalanuvchi hisoblarini ko'chirish (Demo & mavjud profillar)
    const demoUser = repository.getUserById('demo-student-id');
    if (demoUser) {
      const user = await prisma.user.upsert({
        where: { email: demoUser.email },
        update: {
          username: demoUser.username || 'ali',
        },
        create: {
          id: demoUser.id,
          email: demoUser.email,
          username: demoUser.username || 'ali',
          passwordHash: demoUser.passwordHash,
          isActive: true,
        },
      });

      await prisma.studentProfile.upsert({
        where: { userId: user.id },
        update: {
          displayName: demoUser.displayName,
          grade: demoUser.grade,
          age: demoUser.age,
        },
        create: {
          userId: user.id,
          displayName: demoUser.displayName,
          dateOfBirth: new Date(demoUser.dateOfBirth),
          age: demoUser.age,
          mode: demoUser.mode as Mode,
          grade: demoUser.grade,
          avatarUrl: demoUser.avatarUrl,
          cityLevel: demoUser.cityLevel,
        },
      });

      await prisma.coinWallet.upsert({
        where: { userId: user.id },
        update: { balance: demoUser.coinBalance },
        create: {
          userId: user.id,
          balance: demoUser.coinBalance,
        },
      });

      await prisma.studentXP.upsert({
        where: { userId: user.id },
        update: { totalXP: demoUser.totalXP, level: demoUser.level },
        create: {
          userId: user.id,
          totalXP: demoUser.totalXP,
          level: demoUser.level,
        },
      });

      migratedUsers++;
    }

    console.log(`✅ Migratsiya muvaffaqiyatli: ${migratedLessons} ta dars, ${migratedBuildings} ta bino, ${migratedUsers} ta foydalanuvchi.`);
    return {
      success: true,
      migratedUsers,
      migratedLessons,
      migratedBuildings,
      backupPath,
    };
  } catch (error: any) {
    console.error('❌ Migratsiya xatoligi:', error);
    return {
      success: false,
      migratedUsers,
      migratedLessons,
      migratedBuildings,
      backupPath,
      error: error?.message || 'Nomaʼlum xatolik',
    };
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv[1]?.includes('migrateLocalData')) {
  runLocalDataMigration()
    .then((res) => {
      console.log('Natija:', res);
      process.exit(res.success ? 0 : 1);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
