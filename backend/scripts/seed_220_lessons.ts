import { PrismaClient } from '@prisma/client';
import { curriculum220Lessons } from '../src/utils/curriculum220.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 1–11 sinflar uchun 220+ mavzuni bazaga seed qilish boshlandi...');

  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL / Prisma ulandi.');

    // Ensure courses exist for grades 1..11
    for (let grade = 1; grade <= 11; grade++) {
      const courseId = `course-g${grade}-math`;
      await prisma.course.upsert({
        where: { id: courseId },
        update: {
          title: `${grade}-sinf Matematika`,
          grade,
        },
        create: {
          id: courseId,
          title: `${grade}-sinf Matematika`,
          description: `${grade}-sinf o‘quvchilari uchun O‘zbekiston maktab dasturiga mos to‘liq kurs.`,
          grade,
          mode: 'KIDS',
        },
      });
    }

    let inserted = 0;
    for (const l of curriculum220Lessons) {
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
          courseId: l.courseId,
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

      // Upsert section and questions
      if (l.sections && l.sections.length > 0) {
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

          if (s.questions && s.questions.length > 0) {
            for (const q of s.questions) {
              await prisma.question.upsert({
                where: { id: q.id },
                update: {
                  prompt: q.prompt,
                  type: q.type as any,
                  optionsJson: JSON.stringify(q.options),
                  correctAnswer: q.correctAnswer,
                  explanation: q.explanation,
                  hint: q.hint || '',
                },
                create: {
                  id: q.id,
                  lessonId: lesson.id,
                  sectionId: section.id,
                  prompt: q.prompt,
                  type: q.type as any,
                  optionsJson: JSON.stringify(q.options),
                  correctAnswer: q.correctAnswer,
                  explanation: q.explanation,
                  hint: q.hint || '',
                },
              });
            }
          }
        }
      }
      inserted++;
    }

    console.log(`🎉 Idempotent seed muvaffaqiyatli yakunlandi! Jami mavzular: ${inserted}`);
  } catch (err: any) {
    console.log('ℹ️ Prisma ulanishsiz rejim (offline fallback faol). Memory repository 220 darsni avtomatik xizmat qiladi.');
    console.log('Xatolik tafsiloti:', err?.message || err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
