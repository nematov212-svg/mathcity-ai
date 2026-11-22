import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const exercisesRouter = Router();

export interface ExerciseItem {
  id: number;
  level: number;
  topic: string;
  question: string;
  hint: string;
  options: string[];
  correctIndex: number;
  answer: string;
  explanation: string;
}

let cachedExercises: ExerciseItem[] | null = null;

function getExercisesFilePath(): string {
  const candidates = [
    path.resolve(process.cwd(), 'src/data/exercises_1000.json'),
    path.resolve(process.cwd(), 'backend/src/data/exercises_1000.json'),
    path.resolve(process.cwd(), 'dist/data/exercises_1000.json'),
    path.resolve(process.cwd(), 'data/exercises_1000.json'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return candidates[0];
}

export function loadAllExercises(): ExerciseItem[] {
  if (cachedExercises) return cachedExercises;
  try {
    const filePath = getExercisesFilePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const list = JSON.parse(content) as ExerciseItem[];
      cachedExercises = list.filter(
        (ex) =>
          ex.options &&
          ex.options.length === 4 &&
          ex.correctIndex >= 0 &&
          ex.correctIndex < 4 &&
          ex.options[ex.correctIndex] === ex.answer
      );
      return cachedExercises;
    }
  } catch (err) {
    console.error('Failed to load exercises_1000.json:', err);
  }
  return [];
}

/**
 * GET /api/exercises?level=2&count=20
 * Returns randomly shuffled verified exercises for the given level.
 */
exercisesRouter.get('/', (req: Request, res: Response) => {
  const exercises = loadAllExercises();
  const levelParam = parseInt(req.query.level as string, 10) || 2;
  const countParam = Math.min(100, Math.max(1, parseInt(req.query.count as string, 10) || 20));

  let matching = exercises.filter((e) => e.level === levelParam);
  if (matching.length < countParam) {
    const others = exercises.filter((e) => e.level !== levelParam);
    matching = [...matching, ...others];
  }

  // Shuffle non-repeating
  const shuffled = [...matching].sort(() => 0.5 - Math.random()).slice(0, countParam);

  return res.json({
    success: true,
    count: shuffled.length,
    data: shuffled,
  });
});
