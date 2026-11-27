// MathCity AI - Grade 2 Curriculum: 1-qism (44 ta birlik)
// 41 dars + 2 yakuniy dars + 1 amaliy topshiriqlar. Har birida 20 tadan test savoli va 3 tadan mashq savoli.
import fs from 'fs';
import path from 'path';
import { CurriculumLesson, CurriculumQuestion } from './grade1Curriculum.js';

export function getGrade2ChapterTitle(order: number): string {
  if (order <= 8) return 'I bob. Takrorlash';
  if (order <= 19) return 'II bob. Xona birliklari va yaxlit sonlar bilan amallar';
  if (order <= 27) return 'III bob. Xonadan o‘tib qo‘shish va ayirish';
  if (order <= 34) return 'IV bob. Ustun ko‘rinishida hisoblash';
  if (order <= 41) return 'V bob. Yig‘indi va ayirma xossalari, masalalar';
  return 'VI bob. Amaliy topshiriqlar';
}

function resolveGrade2SeedDir(): string {
  const candidates = [
    path.resolve(process.cwd(), 'seed/math/grade2/part1'),
    path.resolve(process.cwd(), 'backend/seed/math/grade2/part1'),
    path.resolve(process.cwd(), '../seed/math/grade2/part1'),
    path.resolve(process.cwd(), '../../seed/math/grade2/part1'),
    path.resolve('/Users/mirzobek/Downloads/mathcity-backend/seed/math/grade2/part1'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      const files = fs.readdirSync(c).filter((f) => f.endsWith('.json'));
      if (files.length > 0) return c;
    }
  }
  return candidates[0];
}

export function loadGrade2Part1Lessons(): CurriculumLesson[] {
  const seedDir = resolveGrade2SeedDir();
  const moduleId = 'module-g2-p1';
  const lessons: CurriculumLesson[] = [];

  for (let order = 1; order <= 44; order++) {
    const pad = order < 10 ? `0${order}` : `${order}`;
    const filename = `unit-${pad}.json`;
    const filePath = path.join(seedDir, filename);

    if (!fs.existsSync(filePath)) {
      console.warn(`[grade2Curriculum] Missing seed file: ${filePath}`);
      continue;
    }

    try {
      const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const lessonId = `lesson-g2-${pad}`;

      const practiceQuestions: CurriculumQuestion[] = (raw.practice || []).map((q: any, idx: number) => ({
        id: `q-${lessonId}-p${idx + 1}`,
        lessonId,
        order: idx + 1,
        step: 4,
        kind: 'practice' as const,
        text: q.text,
        prompt: q.text,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation || '',
      }));

      const testQuestions: CurriculumQuestion[] = (raw.test || []).map((q: any, idx: number) => ({
        id: `q-${lessonId}-t${idx + 1}`,
        lessonId,
        order: idx + 1,
        step: 5,
        kind: 'test' as const,
        text: q.text,
        prompt: q.text,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation || '',
      }));

      const miniExampleStr = typeof raw.miniExample === 'string'
        ? raw.miniExample
        : raw.miniExample?.text
          ? `${raw.miniExample.emojis ? raw.miniExample.emojis + '\n' : ''}${raw.miniExample.text}`
          : '';

      lessons.push({
        id: lessonId,
        moduleId,
        order: raw.order ?? order,
        bookNumber: raw.bookNumber ?? null,
        isReview: raw.unitType === 'FINAL_LESSON' || raw.unitType === 'PRACTICE',
        title: raw.title,
        chapterTitle: getGrade2ChapterTitle(raw.order ?? order),
        shortDesc: raw.shortDesc || '',
        emoji: raw.emoji || '📘',
        intro: raw.intro || '',
        keyPoints: raw.keyPoints || [],
        miniExample: miniExampleStr,
        xpReward: raw.xpReward || 100,
        coinReward: raw.coinReward || 10,
        estMinutes: raw.estMinutes || 8,
        questionCount: testQuestions.length || 20,
        practice: practiceQuestions,
        test: testQuestions,
        questions: testQuestions,
      });
    } catch (e: any) {
      console.error(`[grade2Curriculum] Error parsing ${filename}:`, e);
    }
  }

  return lessons;
}

export const grade2Part1Lessons: CurriculumLesson[] = loadGrade2Part1Lessons();
