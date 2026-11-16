export type AgeMode = 'KIDS' | 'TEEN';

export interface AgeEligibilityResult {
  eligible: boolean;
  age: number;
  mode: AgeMode | null;
  message: string;
}

/**
 * Calculates accurate chronological age from date of birth.
 * Accurate down to exact day and leap-year boundaries.
 */
export function calculateAge(dob: Date, referenceDate: Date = new Date()): number {
  let age = referenceDate.getFullYear() - dob.getFullYear();
  const monthDiff = referenceDate.getMonth() - dob.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

/**
 * Evaluates whether a student is eligible for MathCity AI.
 * Rules:
 * - Age 6-12: KIDS Mode
 * - Age 13-16: TEEN Mode
 * - Age >= 17: Access Denied
 * - Age < 6: Unsupported
 */
export function checkAgeEligibility(dob: Date, referenceDate: Date = new Date()): AgeEligibilityResult {
  const age = calculateAge(dob, referenceDate);

  if (age < 6) {
    return {
      eligible: false,
      age,
      mode: null,
      message: "MathCity AI faqat 6 yoshdan oshgan o'quvchilar uchun mo'ljallangan.",
    };
  }

  if (age >= 17) {
    return {
      eligible: false,
      age,
      mode: null,
      message: "MathCity AI faqat 16 yoshgacha bo‘lgan o‘quvchilar uchun mo‘ljallangan. Afsuski, siz kira olmaysiz.",
    };
  }

  if (age >= 6 && age <= 12) {
    return {
      eligible: true,
      age,
      mode: 'KIDS',
      message: "Xush kelibsiz! Bolalar rejimi (Kids Mode) faollashtirildi.",
    };
  }

  return {
    eligible: true,
    age,
    mode: 'TEEN',
    message: "Xush kelibsiz! O'smirlar rejimi (Teen Mode) faollashtirildi.",
  };
}
