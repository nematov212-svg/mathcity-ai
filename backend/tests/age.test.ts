import { calculateAge, checkAgeEligibility } from '../src/utils/age.js';

describe('Universal Age Eligibility Engine (No Age Limits)', () => {
  const refDate = new Date('2026-11-16');

  test('Age 6: Should be eligible', () => {
    const dob = new Date('2020-11-16');
    const res = checkAgeEligibility(dob, refDate);
    expect(res.eligible).toBe(true);
    expect(res.age).toBe(6);
    expect(res.mode).toBe('KIDS');
  });

  test('Age 12: Should be eligible', () => {
    const dob = new Date('2014-05-10');
    const res = checkAgeEligibility(dob, refDate);
    expect(res.eligible).toBe(true);
    expect(res.age).toBe(12);
    expect(res.mode).toBe('KIDS');
  });

  test('Age 13: Should be eligible without restriction', () => {
    const dob = new Date('2013-11-10');
    const res = checkAgeEligibility(dob, refDate);
    expect(res.eligible).toBe(true);
    expect(res.age).toBe(13);
    expect(res.mode).toBe('KIDS');
  });

  test('Age 17: Should be eligible without restriction', () => {
    const dob = new Date('2009-10-01');
    const res = checkAgeEligibility(dob, refDate);
    expect(res.eligible).toBe(true);
    expect(res.age).toBe(17);
    expect(res.mode).toBe('KIDS');
  });

  test('Age 25: Should be eligible without restriction', () => {
    const dob = new Date('2001-01-01');
    const res = checkAgeEligibility(dob, refDate);
    expect(res.eligible).toBe(true);
    expect(res.age).toBe(25);
    expect(res.mode).toBe('KIDS');
  });

  test('Age 5: Should be eligible', () => {
    const dob = new Date('2021-01-01');
    const res = checkAgeEligibility(dob, refDate);
    expect(res.eligible).toBe(true);
    expect(res.age).toBe(5);
    expect(res.mode).toBe('KIDS');
  });
});
