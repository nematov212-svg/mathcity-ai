import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

/**
 * MathCity AI — Render Free PostgreSQL 30-Day Expiration Backup Utility
 * Exports all authoritative records to a local JSON backup.
 */
export async function backupPostgresDatabase(): Promise<{
  success: boolean;
  backupFile?: string;
  counts?: Record<string, number>;
  error?: string;
}> {
  console.log('📦 Boshlandi: PostgreSQL maʼlumotlar bazasidan to‘liq zaxira (Backup) olish...');

  const backupDir = path.resolve(process.cwd(), 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(backupDir, `postgres-backup-${timestamp}.json`);

  try {
    const users = await prisma.user.findMany({
      include: {
        studentProfile: true,
        subscription: true,
        coinWallet: true,
        studentXP: true,
        ownedBuildings: true,
        lessonProgress: true,
        dailyTasks: true,
        achievements: true,
      },
    });

    const courses = await prisma.course.findMany({
      include: {
        lessons: {
          include: {
            sections: {
              include: {
                questions: true,
              },
            },
          },
        },
      },
    });

    const buildingDefinitions = await prisma.buildingDefinition.findMany();
    const dailyTasks = await prisma.dailyTask.findMany();
    const achievements = await prisma.achievement.findMany();
    const aiConversations = await prisma.aIConversation.findMany({
      include: { messages: true },
    });

    const fullDump = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      databaseProvider: 'postgresql (Render Free)',
      summary: {
        totalUsers: users.length,
        totalCourses: courses.length,
        totalBuildingDefinitions: buildingDefinitions.length,
        totalDailyTasks: dailyTasks.length,
        totalAchievements: achievements.length,
        totalAIConversations: aiConversations.length,
      },
      data: {
        users,
        courses,
        buildingDefinitions,
        dailyTasks,
        achievements,
        aiConversations,
      },
    };

    fs.writeFileSync(backupFile, JSON.stringify(fullDump, null, 2), 'utf-8');
    console.log(`✅ Zaxira nusxa muvaffaqiyatli saqlandi: ${backupFile}`);

    return {
      success: true,
      backupFile,
      counts: fullDump.summary,
    };
  } catch (err: any) {
    console.error('❌ Zaxira olishda xatolik:', err);
    return {
      success: false,
      error: err?.message || 'Nomaʼlum xatolik',
    };
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv[1]?.includes('backupPostgres')) {
  backupPostgresDatabase()
    .then((res) => {
      console.log('Natija:', res);
      process.exit(res.success ? 0 : 1);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
