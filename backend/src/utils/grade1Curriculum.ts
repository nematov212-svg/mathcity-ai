// MathCity AI - Grade 1 Curriculum: 1-qism (41 mavzu) va 2-qism (33 mavzu)
// Jami 74 ta dars, har birida 20 tadan nazorat test savoli va 3 tadan mashq savoli.
import fs from 'fs';
import path from 'path';

export interface CurriculumModule {
  id: string;
  grade: number;
  subject: string;
  part: number;
  title: string;
  orderIndex: number;
  comingSoon: boolean;
}

export interface CurriculumQuestion {
  id: string;
  lessonId: string;
  order: number;
  step?: number;
  kind?: 'practice' | 'test';
  text: string;
  prompt?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CurriculumLesson {
  id: string;
  moduleId: string;
  order: number;
  bookNumber: number;
  title: string;
  chapterTitle: string;
  shortDesc: string;
  emoji: string;
  intro: string;
  keyPoints: string[];
  miniExample: string;
  xpReward: number;
  coinReward: number;
  estMinutes: number;
  questionCount: number;
  practice: CurriculumQuestion[];
  test: CurriculumQuestion[];
  questions: CurriculumQuestion[];
}

export const allCurriculumModules: CurriculumModule[] = [
  // 1-sinf
  {
    id: 'module-g1-p1',
    grade: 1,
    subject: 'Matematika',
    part: 1,
    title: 'Matematika · 1-qism',
    orderIndex: 1,
    comingSoon: false,
  },
  {
    id: 'module-g1-p2',
    grade: 1,
    subject: 'Matematika',
    part: 2,
    title: 'Matematika · 2-qism',
    orderIndex: 2,
    comingSoon: false,
  },
  // 2-11 sinflar
  ...Array.from({ length: 10 }, (_, i) => {
    const grade = i + 2;
    return [
      {
        id: `module-g${grade}-p1`,
        grade,
        subject: 'Matematika',
        part: 1,
        title: `Matematika · 1-qism`,
        orderIndex: 1,
        comingSoon: true,
      },
      {
        id: `module-g${grade}-p2`,
        grade,
        subject: 'Matematika',
        part: 2,
        title: `Matematika · 2-qism`,
        orderIndex: 2,
        comingSoon: true,
      },
    ];
  }).flat(),
];

function getChapterTitle(bookNumber: number): string {
  if (bookNumber <= 8) return 'I bob. Narsalar va ularning xossalari';
  if (bookNumber <= 29) return 'II bob. 1 dan 10 gacha bo‘lgan sonlar';
  if (bookNumber <= 41) return 'III bob. Ifodalar, tengliklar va xossalar';
  if (bookNumber <= 57) return 'IV bob. 11 dan 20 gacha bo‘lgan sonlar va amallar';
  if (bookNumber <= 62) return 'V bob. 21 dan 100 gacha bo‘lgan sonlar';
  return 'VI bob. Ikki xonali sonlar ustida amallar va ifodalar';
}

function resolveSeedDir(part: 1 | 2): string {
  const candidates = [
    path.resolve(process.cwd(), `seed/math/grade1/part${part}`),
    path.resolve(process.cwd(), `backend/seed/math/grade1/part${part}`),
    path.resolve(process.cwd(), `../seed/math/grade1/part${part}`),
    path.resolve(process.cwd(), `../../seed/math/grade1/part${part}`),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      const files = fs.readdirSync(c).filter((f) => f.endsWith('.json'));
      if (files.length > 0) return c;
    }
  }
  return candidates[0];
}

function loadPartLessons(part: 1 | 2, startNum: number, endNum: number): CurriculumLesson[] {
  const seedDir = resolveSeedDir(part);
  const moduleId = `module-g1-p${part}`;
  const lessons: CurriculumLesson[] = [];

  for (let bookNum = startNum; bookNum <= endNum; bookNum++) {
    const pad = bookNum < 10 ? `0${bookNum}` : `${bookNum}`;
    const filename = `lesson-${pad}.json`;
    const filePath = path.join(seedDir, filename);

    if (!fs.existsSync(filePath)) {
      console.warn(`[grade1Curriculum] Seed file not found: ${filePath}`);
      continue;
    }

    try {
      const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const lessonId = `lesson-g1-${pad}`;
      const order = part === 1 ? bookNum : bookNum - 41;

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
        order,
        bookNumber: bookNum,
        title: raw.title,
        chapterTitle: getChapterTitle(bookNum),
        shortDesc: raw.shortDesc || '',
        emoji: raw.emoji || '📘',
        intro: raw.intro || '',
        keyPoints: raw.keyPoints || [],
        miniExample: miniExampleStr,
        xpReward: raw.xpReward || 100,
        coinReward: raw.coinReward || 12,
        estMinutes: raw.estMinutes || 7,
        questionCount: testQuestions.length || 20,
        practice: practiceQuestions,
        test: testQuestions,
        questions: testQuestions,
      });
    } catch (e: any) {
      console.error(`[grade1Curriculum] Error parsing ${filename}:`, e);
    }
  }

  return lessons;
}

export const grade1Part1Lessons: CurriculumLesson[] = loadPartLessons(1, 1, 41);
export const grade1Part2Lessons: CurriculumLesson[] = loadPartLessons(2, 42, 74);
export const allGrade1Lessons: CurriculumLesson[] = [...grade1Part1Lessons, ...grade1Part2Lessons];
