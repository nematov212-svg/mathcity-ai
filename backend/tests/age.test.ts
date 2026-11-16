import { calculateAge, checkAgeEligibility } from '../src/utils/age.js';

describe('Strict Age Eligibility Engine', () => {
  const refDate = new Date('2026-11-16');

  test('Age 6: Should be eligible for KIDS mode', () => {
    const dob = new Date('2020-11-16'); // Exactly 6 years old today
    const res = checkAgeEligibility(dob, refDate);
    expect(res.eligible).toBe(true);
    expect(res.age).toBe(6);
    expect(res.mode).toBe('KIDS');
  });

  test('Age 12: Should be eligible for KIDS mode', () => {
    const dob = new Date('2014-05-10'); // 12 years old
    const res = checkAgeEligibility(dob, refDate);
    expect(res.eligible).toBe(true);
    expect(res.age).toBe(12);
    expect(res.mode).toBe('KIDS');
  });

  test('Age 13: Should transition to TEEN mode', () => {
    const dob = new Date('2013-11-10'); // 13 years old
    const res = checkAgeEligibility(dob, refDate);
    expect(res.eligible).toBe(true);
    expect(res.age).toBe(13);
    expect(res.mode).toBe('TEEN');
  });

  test('Age 16: Should be allowed and in TEEN mode', () => {
    const dob = new Date('2010-02-14'); // 16 years old
    const res = checkAgeEligibility(dob, refDate);
    expect(res.eligible).toBe(true);
    expect(res.age).toBe(16);
    expect(res.mode).toBe('TEEN');
  });

  test('Age 17: MUST be strictly denied student access', () => {
    const dob = new Date('2009-10-01'); // 17 years old
    const res = checkAgeEligibility(dob, refDate);
    expect(res.eligible).toBe(false);
    expect(res.age).toBe(17);
    expect(res.mode).toBeNull();
    expect(res.message).toContain('faqat 16 yoshgacha');
  });

  test('Age 18: MUST be strictly denied student access', () => {
    const dob = new Date('2008-01-01'); // 18 years old
    const res = checkAgeEligibility(dob, refDate);
    expect(res.eligible).toBe(false);
    expect(res.age).toBe(18);
    expect(res.mode).toBeNull();
  });

  test('Under 6: Unsupported', () => {
    const dob = new Date('2022-01-01'); // 4 years old
    const res = checkAgeEligibility(dob, refDate);
    expect(res.eligible).toBe(false);
    expect(res.age).toBe(4);
  });
});
