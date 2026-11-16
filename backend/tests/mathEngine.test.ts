import { MathEngine } from '../src/utils/mathEngine.js';

describe('Math Engine Verification', () => {
  test('Exact string normalization and numerical equality', () => {
    expect(MathEngine.evaluateAnswer('5', '5')).toBe(true);
    expect(MathEngine.evaluateAnswer(' 5 ', '5')).toBe(true);
    expect(MathEngine.evaluateAnswer('4.0', '4')).toBe(true);
    expect(MathEngine.evaluateAnswer('3,5', '3.5')).toBe(true);
  });

  test('Fractions equivalence (2/4 == 1/2)', () => {
    expect(MathEngine.evaluateAnswer('2/4', '1/2')).toBe(true);
    expect(MathEngine.evaluateAnswer('3/6', '1/2')).toBe(true);
    expect(MathEngine.evaluateAnswer('2/3', '4/6')).toBe(true);
    expect(MathEngine.evaluateAnswer('1/4', '1/2')).toBe(false);
  });

  test('Procedural Kosmik Hisob question generation', () => {
    const q1 = MathEngine.generateSpaceMathQuestion(1);
    expect(q1.options.length).toBe(4);
    expect(q1.options).toContain(q1.correctAnswer);

    const q2 = MathEngine.generateSpaceMathQuestion(2);
    expect(q2.options.length).toBe(4);
    expect(q2.options).toContain(q2.correctAnswer);

    const q3 = MathEngine.generateSpaceMathQuestion(3);
    expect(q3.options.length).toBe(4);
    expect(q3.options).toContain(q3.correctAnswer);
  });
});
