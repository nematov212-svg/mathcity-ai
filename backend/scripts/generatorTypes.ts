import fs from 'fs';
import path from 'path';

export interface RawQuestion {
  text: string;
  correctAnswer?: string;
  distractors?: string[];
  options?: string[];
  correctIndex?: number;
  explanation: string;
}

export interface FinalQuestion {
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonDataDef {
  bookNumber: number;
  order?: number;
  isReview?: boolean;
  title: string;
  emoji: string;
  shortDesc: string;
  intro: string;
  keyPoints: string[];
  miniExample: {
    emojis: string;
    text: string;
  };
  xpReward: number;
  coinReward: number;
  estMinutes: number;
  practice: RawQuestion[];
  test: RawQuestion[];
}

export type LessonDef = LessonDataDef;

function extractAnswers(raw: RawQuestion): { correctAnswer: string; distractors: string[] } {
  if (raw.correctAnswer && raw.distractors) {
    return { correctAnswer: raw.correctAnswer, distractors: raw.distractors };
  }
  if (raw.options && raw.options.length === 4) {
    const cIdx = raw.correctIndex ?? 0;
    const correctAnswer = raw.options[cIdx];
    const distractors = raw.options.filter((_, i) => i !== cIdx);
    return { correctAnswer, distractors };
  }
  throw new Error(`Invalid RawQuestion format for: "${raw.text}"`);
}

export function buildLessonSeed(def: LessonDataDef): any {
  if (def.test.length !== 20) {
    throw new Error(`Lesson ${def.bookNumber} must have exactly 20 test questions, got ${def.test.length}`);
  }

  // Desired distribution for 20 questions: 5 of each (0, 1, 2, 3)
  // Let's create target indices array and interleave them nicely:
  const targetIndices = [
    0, 2, 1, 3,
    1, 0, 3, 2,
    2, 3, 0, 1,
    3, 1, 2, 0,
    0, 3, 1, 2
  ];

  const finalTest: FinalQuestion[] = [];
  const seenTexts = new Set<string>();

  for (let i = 0; i < def.test.length; i++) {
    const raw = def.test[i];
    const normText = raw.text.trim().toLowerCase();
    if (seenTexts.has(normText)) {
      throw new Error(`Duplicate text in lesson ${def.bookNumber}: "${raw.text}"`);
    }
    seenTexts.add(normText);

    const { correctAnswer, distractors } = extractAnswers(raw);
    const targetIdx = targetIndices[i];
    const options: string[] = ['', '', '', ''];
    options[targetIdx] = correctAnswer;

    // Fill the remaining 3 slots with distractors
    let distractorIdx = 0;
    for (let slot = 0; slot < 4; slot++) {
      if (slot !== targetIdx) {
        options[slot] = distractors[distractorIdx++];
      }
    }

    // Verify all 4 options are unique
    const uniqueCheck = new Set(options.map((o) => o.trim().toLowerCase()));
    if (uniqueCheck.size !== 4) {
      throw new Error(
        `Duplicate options in lesson ${def.bookNumber}, question ${i + 1}: ${JSON.stringify(options)}`
      );
    }

    finalTest.push({
      text: raw.text,
      options,
      correctIndex: targetIdx,
      explanation: raw.explanation,
    });
  }

  // Practice questions (typically 3)
  const finalPractice: FinalQuestion[] = [];
  const practiceTargets = [0, 1, 2, 3, 0];
  for (let i = 0; i < def.practice.length; i++) {
    const raw = def.practice[i];
    const { correctAnswer, distractors } = extractAnswers(raw);
    const targetIdx = practiceTargets[i % practiceTargets.length];
    const options: string[] = ['', '', '', ''];
    options[targetIdx] = correctAnswer;
    let distractorIdx = 0;
    for (let slot = 0; slot < 4; slot++) {
      if (slot !== targetIdx) {
        options[slot] = distractors[distractorIdx++];
      }
    }
    finalPractice.push({
      text: raw.text,
      options,
      correctIndex: targetIdx,
      explanation: raw.explanation,
    });
  }

  return {
    bookNumber: def.bookNumber,
    isReview: def.isReview || false,
    title: def.title,
    emoji: def.emoji,
    shortDesc: def.shortDesc,
    intro: def.intro,
    keyPoints: def.keyPoints,
    miniExample: def.miniExample,
    xpReward: def.xpReward,
    coinReward: def.coinReward,
    estMinutes: def.estMinutes,
    practice: finalPractice,
    test: finalTest,
  };
}

export function saveLessonFile(part: 1 | 2 | 3 | 4, lessonNum: number, data: any, isReview = false) {
  const padNum = lessonNum < 10 ? `0${lessonNum}` : `${lessonNum}`;
  const filename = isReview ? `review-${lessonNum}.json` : `lesson-${padNum}.json`;

  const dirs = [
    path.resolve(__dirname, `../seed/math/grade1/part${part}`),
    path.resolve(__dirname, `../../seed/math/grade1/part${part}`),
    path.resolve('/Users/mirzobek/Downloads/mathcity-backend/seed/math/grade1', `part${part}`),
  ];

  const jsonStr = JSON.stringify(data, null, 2);
  for (const d of dirs) {
    try {
      fs.mkdirSync(d, { recursive: true });
      fs.writeFileSync(path.join(d, filename), jsonStr, 'utf-8');
    } catch (_) {}
  }
}

export interface RawGrade2Question extends RawQuestion {
  meta?: {
    seq?: number[];
    next?: number;
  };
}

export interface FinalGrade2Question extends FinalQuestion {
  meta?: {
    seq?: number[];
    next?: number;
  };
}

export interface Grade2UnitDef {
  order: number;
  bookNumber: number | null;
  unitType: 'LESSON' | 'FINAL_LESSON' | 'PRACTICE';
  title: string;
  emoji: string;
  crossTopic: string | null;
  shortDesc: string;
  intro: string;
  keyPoints: string[];
  miniExample: {
    emojis: string;
    text: string;
  };
  xpReward: number;
  coinReward: number;
  estMinutes: number;
  practice: RawGrade2Question[];
  test: RawGrade2Question[];
}

export function buildGrade2UnitSeed(def: Grade2UnitDef): any {
  if (def.test.length !== 20) {
    throw new Error(`Unit ${def.order} must have exactly 20 test questions, got ${def.test.length}`);
  }

  // Desired distribution for 20 questions: 5 of each (0, 1, 2, 3)
  const targetIndices = [
    0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3
  ];

  const finalTest: FinalGrade2Question[] = [];
  for (let i = 0; i < def.test.length; i++) {
    const raw = def.test[i];
    const { correctAnswer, distractors } = extractAnswers(raw);
    const targetIdx = targetIndices[i];
    const options: string[] = ['', '', '', ''];
    options[targetIdx] = correctAnswer;
    let distractorIdx = 0;
    for (let slot = 0; slot < 4; slot++) {
      if (slot !== targetIdx) {
        options[slot] = distractors[distractorIdx++];
      }
    }

    finalTest.push({
      text: raw.text,
      options,
      correctIndex: targetIdx,
      explanation: raw.explanation,
      ...(raw.meta ? { meta: raw.meta } : {}),
    });
  }

  // Practice questions (typically 3-5)
  const finalPractice: FinalGrade2Question[] = [];
  const practiceTargets = [0, 1, 2, 3, 0];
  for (let i = 0; i < def.practice.length; i++) {
    const raw = def.practice[i];
    const { correctAnswer, distractors } = extractAnswers(raw);
    const targetIdx = practiceTargets[i % practiceTargets.length];
    const options: string[] = ['', '', '', ''];
    options[targetIdx] = correctAnswer;
    let distractorIdx = 0;
    for (let slot = 0; slot < 4; slot++) {
      if (slot !== targetIdx) {
        options[slot] = distractors[distractorIdx++];
      }
    }
    finalPractice.push({
      text: raw.text,
      options,
      correctIndex: targetIdx,
      explanation: raw.explanation,
      ...(raw.meta ? { meta: raw.meta } : {}),
    });
  }

  return {
    order: def.order,
    bookNumber: def.bookNumber,
    unitType: def.unitType,
    title: def.title,
    emoji: def.emoji,
    crossTopic: def.crossTopic,
    shortDesc: def.shortDesc,
    intro: def.intro,
    keyPoints: def.keyPoints,
    miniExample: def.miniExample,
    xpReward: def.xpReward,
    coinReward: def.coinReward,
    estMinutes: def.estMinutes,
    practice: finalPractice,
    test: finalTest,
  };
}

export function saveGrade2UnitFile(order: number, data: any) {
  const padOrder = order < 10 ? `0${order}` : `${order}`;
  const filename = `unit-${padOrder}.json`;

  const dirs = [
    path.resolve(__dirname, `../seed/math/grade2/part1`),
    path.resolve(__dirname, `../../seed/math/grade2/part1`),
    path.resolve('/Users/mirzobek/Downloads/mathcity-backend/seed/math/grade2/part1'),
  ];

  const jsonStr = JSON.stringify(data, null, 2);
  for (const d of dirs) {
    try {
      fs.mkdirSync(d, { recursive: true });
      fs.writeFileSync(path.join(d, filename), jsonStr, 'utf-8');
    } catch (_) {}
  }
}
