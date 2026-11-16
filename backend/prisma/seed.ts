import { PrismaClient, Mode, QuestionType } from '@prisma/client';
import { initialLessons, initialBuildings, initialDailyTasks, initialAchievements } from '../src/utils/dataStore.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding MathCity AI Database...');

  // 1. Seed Buildings
  for (const b of initialBuildings) {
    await prisma.buildingDefinition.upsert({
      where: { key: b.key },
      update: {},
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
  for (const t of initialDailyTasks) {
    await prisma.dailyTask.upsert({
      where: { key: t.key },
      update: {},
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
  for (const a of initialAchievements) {
    await prisma.achievement.upsert({
      where: { key: a.key },
      update: {},
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

  // 4. Seed Courses & Lessons
  for (const l of initialLessons) {
    // Find or create course
    const course = await prisma.course.upsert({
      where: { id: l.courseId },
      update: {},
      create: {
        id: l.courseId,
        title: `${l.grade}-sinf Matematika kursi`,
        description: `${l.grade}-sinf uchun mo‘ljallangan interaktiv matematika darslari to‘plami`,
        gradeMin: l.grade,
        gradeMax: l.grade,
        mode: l.mode as Mode,
      },
    });

    const lesson = await prisma.lesson.upsert({
      where: { id: l.id },
      update: {},
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

    // Seed questions
    for (const q of l.questions) {
      await prisma.question.upsert({
        where: { id: q.id },
        update: {},
        create: {
          id: q.id,
          lessonId: lesson.id,
          prompt: q.prompt,
          type: q.type as QuestionType,
          optionsJson: JSON.stringify(q.options),
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          hint: q.hint,
          formulaLatex: q.formulaLatex,
          orderIndex: q.orderIndex,
        },
      });
    }
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
