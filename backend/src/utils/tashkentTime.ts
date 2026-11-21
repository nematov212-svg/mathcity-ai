/**
 * Tashkent Time Utilities (Asia/Tashkent - UTC+5)
 * All daily resets, streaks, and missions use Tashkent midnight boundary.
 */

export const TASHKENT_TIMEZONE = 'Asia/Tashkent';
export const TASHKENT_OFFSET_MS = 5 * 60 * 60 * 1000; // +5 hours in milliseconds

export const UZ_DAY_KEYS = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'] as const;
export const UZ_DAY_NAMES = [
  'Dushanba',
  'Seshanba',
  'Chorshanba',
  'Payshanba',
  'Juma',
  'Shanba',
  'Yakshanba',
] as const;

export type UzDayKey = (typeof UZ_DAY_KEYS)[number];

/**
 * Returns YYYY-MM-DD string for Tashkent timezone.
 */
export function getTashkentDateString(date: Date = new Date()): string {
  // Using Intl for robust timezone conversion
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TASHKENT_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date); // en-CA produces YYYY-MM-DD
}

/**
 * Returns day of week in Tashkent:
 * 0 = Monday (Du), 1 = Tuesday (Se), ..., 6 = Sunday (Ya)
 */
export function getTashkentDayOfWeek(date: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TASHKENT_TIMEZONE,
    weekday: 'short',
  }).format(date);

  switch (parts) {
    case 'Mon':
      return 0;
    case 'Tue':
      return 1;
    case 'Wed':
      return 2;
    case 'Thu':
      return 3;
    case 'Fri':
      return 4;
    case 'Sat':
      return 5;
    case 'Sun':
    default:
      return 6;
  }
}

/**
 * Returns Tashkent day key (Du, Se, Ch, Pa, Ju, Sh, Ya)
 */
export function getTashkentDayKey(date: Date = new Date()): UzDayKey {
  const idx = getTashkentDayOfWeek(date);
  return UZ_DAY_KEYS[idx];
}

/**
 * Seconds remaining until the next 00:00:00 Tashkent midnight
 */
export function getTashkentSecondsUntilMidnight(date: Date = new Date()): number {
  // Convert current time to Tashkent time representation
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TASHKENT_TIMEZONE,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });
  const timeStr = formatter.format(date);
  const [h, m, s] = timeStr.split(':').map((v) => parseInt(v, 10));

  const totalSecondsInDay = 24 * 3600;
  const currentSeconds = h * 3600 + m * 60 + s;
  return Math.max(0, totalSecondsInDay - currentSeconds);
}

/**
 * Returns the 7 date strings (YYYY-MM-DD) for the current Tashkent week (Monday to Sunday)
 */
export function getTashkentWeekDays(date: Date = new Date()): {
  dayKey: UzDayKey;
  dayName: string;
  dateStr: string;
  isToday: boolean;
  dayIndex: number;
}[] {
  const currentDayIndex = getTashkentDayOfWeek(date);
  const todayStr = getTashkentDateString(date);

  // Parse today's year, month, day in Tashkent
  const [year, month, day] = todayStr.split('-').map(Number);
  const baseTashkentDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

  const week = [];
  for (let i = 0; i < 7; i++) {
    const diff = i - currentDayIndex;
    const d = new Date(baseTashkentDate.getTime() + diff * 24 * 3600 * 1000);
    const dateStr = getTashkentDateString(d);
    week.push({
      dayKey: UZ_DAY_KEYS[i],
      dayName: UZ_DAY_NAMES[i],
      dateStr,
      isToday: i === currentDayIndex,
      dayIndex: i,
    });
  }

  return week;
}
