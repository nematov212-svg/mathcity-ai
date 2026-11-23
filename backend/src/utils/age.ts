export type AgeMode = 'KIDS';

export interface AgeEligibilityResult {
  eligible: boolean;
  age: number;
  mode: AgeMode;
  message: string;
}

/**
 * Calculates chronological age from date of birth.
 * Accurate down to exact day and leap-year boundaries.
 */
export function calculateAge(dob: Date, referenceDate: Date = new Date()): number {
  let age = referenceDate.getFullYear() - dob.getFullYear();
  const monthDiff = referenceDate.getMonth() - dob.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < dob.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

/**
 * Universal registration eligibility for MathCity AI:
 * No age barriers - learners of any age can register and learn mathematics.
 */
export function checkAgeEligibility(dob: Date, referenceDate: Date = new Date()): AgeEligibilityResult {
  const age = calculateAge(dob, referenceDate);

  return {
    eligible: true,
    age,
    mode: 'KIDS',
    message: "Xush kelibsiz! Matematika rejimi faollashtirildi.",
  };
}
