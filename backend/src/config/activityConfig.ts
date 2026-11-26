/**
 * MathCity AI — Daily Activity & Streak Configuration
 * Configurable thresholds for activity levels and score multipliers.
 */

export type ActivityLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';

export interface ActivityThresholdDef {
  min: number;
  max?: number;
  labelUz: string;
}

export const ACTIVITY_THRESHOLDS: Record<ActivityLevel, ActivityThresholdDef> = {
  NONE: { min: 0, max: 0, labelUz: 'Bajarilmagan' },
  LOW: { min: 1, max: 9, labelUz: 'Kam' },
  MEDIUM: { min: 10, max: 24, labelUz: 'O‘rtacha' },
  HIGH: { min: 25, labelUz: 'Ko‘p' },
};

/**
 * Score calculation weights:
 * bal = to'g'ri javoblar soni + (tugatilgan darslar soni × 5)
 */
export const ACTIVITY_WEIGHTS = {
  CORRECT_ANSWER_SCORE: 1,
  LESSON_COMPLETED_SCORE: 5,
} as const;

/**
 * Calculate total activity score from correct answers and completed lessons.
 * Error answers do NOT add any score.
 */
export function calculateActivityScore(
  correctAnswers: number,
  lessonsCompleted: number
): number {
  const safeCorrect = Math.max(0, Math.floor(correctAnswers || 0));
  const safeLessons = Math.max(0, Math.floor(lessonsCompleted || 0));
  return safeCorrect * ACTIVITY_WEIGHTS.CORRECT_ANSWER_SCORE +
    safeLessons * ACTIVITY_WEIGHTS.LESSON_COMPLETED_SCORE;
}

/**
 * Determine activity level from score:
 * - NONE: score = 0
 * - LOW: score 1 - 9
 * - MEDIUM: score 10 - 24
 * - HIGH: score >= 25
 */
export function calculateActivityLevel(score: number): ActivityLevel {
  const safeScore = Math.max(0, Math.floor(score || 0));
  if (safeScore >= ACTIVITY_THRESHOLDS.HIGH.min) {
    return 'HIGH';
  }
  if (safeScore >= ACTIVITY_THRESHOLDS.MEDIUM.min) {
    return 'MEDIUM';
  }
  if (safeScore >= ACTIVITY_THRESHOLDS.LOW.min) {
    return 'LOW';
  }
  return 'NONE';
}
