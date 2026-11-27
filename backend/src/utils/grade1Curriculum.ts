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
  isReview?: boolean;
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
  {
    id: 'module-g1-p3',
    grade: 1,
    subject: 'Matematika',
    part: 3,
    title: 'Matematika · 3-qism',
    orderIndex: 3,
    comingSoon: false,
  },
  {
    id: 'module-g1-p4',
    grade: 1,
    subject: 'Matematika',
    part: 4,
    title: 'Matematika · 4-qism',
    orderIndex: 4,
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

function resolveSeedDir(part: 1 | 2 | 3 | 4): string {
  const candidates = [
    path.resolve(process.cwd(), `seed/math/grade1/part${part}`),
    path.resolve(process.cwd(), `backend/seed/math/grade1/part${part}`),
    path.resolve(process.cwd(), `../seed/math/grade1/part${part}`),
    path.resolve(process.cwd(), `../../seed/math/grade1/part${part}`),
    path.resolve('/Users/mirzobek/Downloads/mathcity-backend/seed/math/grade1', `part${part}`),
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
        isReview: false,
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

function getPart3ChapterTitle(bookNumber: number): string {
  if (bookNumber <= 11) return 'I bob. Masala va uning yechilishi';
  if (bookNumber === 12) return 'I bob. 1-nazorat ishi';
  if (bookNumber <= 26) return 'II bob. Orttirish, kamaytirish va taqqoslash';
  if (bookNumber === 27) return 'II bob. 2-nazorat ishi';
  if (bookNumber <= 42) return 'III bob. Kattaliklar (uzunlik, massa, hajm)';
  return 'III bob. 3-nazorat ishi';
}

export const part3Structure = [
  // I bob: Masala va uning yechilishi (1-11) + Nazorat (12)
  { bookNumber: 1, isReview: false, order: 1 },
  { bookNumber: 2, isReview: false, order: 2 },
  { bookNumber: 3, isReview: false, order: 3 },
  { bookNumber: 4, isReview: false, order: 4 },
  { bookNumber: 5, isReview: false, order: 5 },
  { bookNumber: 6, isReview: false, order: 6 },
  { bookNumber: 7, isReview: false, order: 7 },
  { bookNumber: 8, isReview: false, order: 8 },
  { bookNumber: 9, isReview: false, order: 9 },
  { bookNumber: 10, isReview: false, order: 10 },
  { bookNumber: 11, isReview: false, order: 11 },
  { bookNumber: 12, isReview: true, order: 12 },
  // II bob: Orttirish, kamaytirish va taqqoslash (14-26) + Nazorat (27)
  { bookNumber: 14, isReview: false, order: 13 },
  { bookNumber: 15, isReview: false, order: 14 },
  { bookNumber: 16, isReview: false, order: 15 },
  { bookNumber: 17, isReview: false, order: 16 },
  { bookNumber: 18, isReview: false, order: 17 },
  { bookNumber: 19, isReview: false, order: 18 },
  { bookNumber: 20, isReview: false, order: 19 },
  { bookNumber: 21, isReview: false, order: 20 },
  { bookNumber: 22, isReview: false, order: 21 },
  { bookNumber: 23, isReview: false, order: 22 },
  { bookNumber: 24, isReview: false, order: 23 },
  { bookNumber: 25, isReview: false, order: 24 },
  { bookNumber: 26, isReview: false, order: 25 },
  { bookNumber: 27, isReview: true, order: 26 },
  // III bob: Kattaliklar (uzunlik, massa, hajm) (30-42) + Nazorat (43)
  { bookNumber: 30, isReview: false, order: 27 },
  { bookNumber: 31, isReview: false, order: 28 },
  { bookNumber: 32, isReview: false, order: 29 },
  { bookNumber: 33, isReview: false, order: 30 },
  { bookNumber: 34, isReview: false, order: 31 },
  { bookNumber: 35, isReview: false, order: 32 },
  { bookNumber: 36, isReview: false, order: 33 },
  { bookNumber: 37, isReview: false, order: 34 },
  { bookNumber: 38, isReview: false, order: 35 },
  { bookNumber: 39, isReview: false, order: 36 },
  { bookNumber: 40, isReview: false, order: 37 },
  { bookNumber: 41, isReview: false, order: 38 },
  { bookNumber: 42, isReview: false, order: 39 },
  { bookNumber: 43, isReview: true, order: 40 },
];

function loadPart3Lessons(): CurriculumLesson[] {
  const seedDir = resolveSeedDir(3);
  const moduleId = 'module-g1-p3';
  const lessons: CurriculumLesson[] = [];

  for (const entry of part3Structure) {
    const pad = entry.bookNumber < 10 ? `0${entry.bookNumber}` : `${entry.bookNumber}`;
    const filename = entry.isReview ? `review-${entry.bookNumber}.json` : `lesson-${pad}.json`;
    const filePath = path.join(seedDir, filename);

    if (!fs.existsSync(filePath)) {
      continue;
    }

    try {
      const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const lessonId = `lesson-g1-p3-${pad}`;

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
        order: entry.order,
        bookNumber: entry.bookNumber,
        isReview: entry.isReview,
        title: raw.title,
        chapterTitle: getPart3ChapterTitle(entry.bookNumber),
        shortDesc: raw.shortDesc || '',
        emoji: raw.emoji || (entry.isReview ? '📝' : '📘'),
        intro: raw.intro || '',
        keyPoints: raw.keyPoints || [],
        miniExample: miniExampleStr,
        xpReward: raw.xpReward || (entry.isReview ? 120 : 100),
        coinReward: raw.coinReward || 12,
        estMinutes: raw.estMinutes || 8,
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

export function getPart4ChapterTitle(bookNumber: number): string {
  if (bookNumber <= 115) return 'I bob. Kesma va siniq chiziq';
  if (bookNumber <= 128) return 'II bob. Geometrik shakllar';
  if (bookNumber <= 136) return 'III bob. Ifodalar va tengsizliklar';
  if (bookNumber <= 141) return 'IV bob. Tenglamalar';
  return 'V bob. Takrorlash';
}

export const part4Structure = Array.from({ length: 33 }, (_, i) => ({
  bookNumber: 112 + i,
  order: i + 1,
  isReview: false,
}));

function loadPart4Lessons(): CurriculumLesson[] {
  const seedDir = resolveSeedDir(4);
  const moduleId = 'module-g1-p4';
  const lessons: CurriculumLesson[] = [];

  for (const entry of part4Structure) {
    const filename = `lesson-${entry.bookNumber}.json`;
    const filePath = path.join(seedDir, filename);

    if (!fs.existsSync(filePath)) {
      continue;
    }

    try {
      const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const lessonId = `lesson-g1-p4-${entry.bookNumber}`;

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
        order: entry.order,
        bookNumber: entry.bookNumber,
        isReview: false,
        title: raw.title,
        chapterTitle: getPart4ChapterTitle(entry.bookNumber),
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
      console.error(`[grade1Curriculum] Error parsing ${filename}:`, e);
    }
  }

  return lessons;
}

export const grade1Part1Lessons: CurriculumLesson[] = loadPartLessons(1, 1, 41);
export const grade1Part2Lessons: CurriculumLesson[] = loadPartLessons(2, 42, 74);
export const grade1Part3Lessons: CurriculumLesson[] = loadPart3Lessons();
export const grade1Part4Lessons: CurriculumLesson[] = loadPart4Lessons();
export const allGrade1Lessons: CurriculumLesson[] = [
  ...grade1Part1Lessons,
  ...grade1Part2Lessons,
  ...grade1Part3Lessons,
  ...grade1Part4Lessons,
];
