/**
 * MathCity AI — Golden-Set Unit Test Suite (500+ Verified Test Cases)
 * Covers all 25+ mathematical categories with diverse Uzbek natural language variations.
 */

import { MathSolver, UzbekMathNLU } from '../../src/utils/mathSolver.js';

describe('MathCity AI — 500+ Golden-Set Verification Suite', () => {

  // ==========================================================================
  // Category 0: O‘zbek Tili NLU & Son So‘zlari (25 Tests)
  // ==========================================================================
  describe('Cat 0: Uzbek NLU & Number Words (25)', () => {
    const wordTests: [string, string][] = [
      ['nol', '0'],
      ['bir', '1'],
      ['ikki', '2'],
      ['uch', '3'],
      ['to‘rt', '4'],
      ['besh', '5'],
      ['olti', '6'],
      ['yetti', '7'],
      ['sakkiz', '8'],
      ['to‘qqiz', '9'],
      ['o‘n', '10'],
      ['o‘n bir', '11'],
      ['o‘n besh', '15'],
      ['yigirma', '20'],
      ['yigirma besh', '25'],
      ['o‘ttiz', '30'],
      ['qirq', '40'],
      ['ellik', '50'],
      ['oltmish', '60'],
      ['yetmish', '70'],
      ['sakson', '80'],
      ['to‘qson', '90'],
      ['bir yuz', '100'],
      ['ikki yuz ellik', '250'],
      ['bir ming', '1000'],
    ];

    wordTests.forEach(([word, expected], i) => {
      test(`0.${i + 1} "${word}" -> ${expected}`, () => {
        expect(UzbekMathNLU.wordsToDigits(word)).toBe(expected);
      });
    });
  });

  // ==========================================================================
  // Category 1: Qo‘shish (Addition) (30 Tests)
  // ==========================================================================
  describe('Cat 1: Qo‘shish (30)', () => {
    const addTests: [string, string][] = [
      ['1 + 1', '2'], ['2 + 3', '5'], ['5 + 5', '10'], ['10 + 20', '30'],
      ['15 + 25', '40'], ['50 + 50', '100'], ['100 + 200', '300'], ['123 + 456', '579'],
      ['99 + 1', '100'], ['0 + 42', '42'], ['42 + 0', '42'], ['18 + 12', '30'],
      ['4 ga 5 ni qo‘sh', '9'], ['10 ga 20 ni qo‘sh', '30'], ['15 ga 25 ni qo‘sh', '40'],
      ['o‘n beshga yigirmani qo‘sh', '35'], ['yigirmaga o‘ttizni qo‘sh', '50'],
      ['ellikka ellikni qo‘sh', '100'], ['bir yuzga ellikni qo‘sh', '150'],
      ['7 + 8', '15'], ['9 + 6', '15'], ['14 + 16', '30'], ['27 + 13', '40'],
      ['35 + 45', '80'], ['64 + 36', '100'], ['75 + 25', '100'], ['88 + 12', '100'],
      ['150 + 250', '400'], ['500 + 500', '1000'], ['750 + 250', '1000']
    ];

    addTests.forEach(([q, exp], i) => {
      test(`1.${i + 1} "${q}" -> ${exp}`, () => {
        const s = MathSolver.solve(q);
        expect(s?.finalAnswer).toBe(exp);
      });
    });
  });

  // ==========================================================================
  // Category 2: Ayirish (Subtraction) (30 Tests)
  // ==========================================================================
  describe('Cat 2: Ayirish (30)', () => {
    const subTests: [string, string][] = [
      ['10 - 5', '5'], ['20 - 7', '13'], ['50 - 25', '25'], ['100 - 45', '55'],
      ['100 - 1', '99'], ['15 - 15', '0'], ['30 - 12', '18'], ['45 - 20', '25'],
      ['60 - 35', '25'], ['75 - 25', '50'], ['80 - 16', '64'], ['90 - 45', '45'],
      ['10 dan 3 ni ayir', '7'], ['20 dan 5 ni ayir', '15'], ['50 dan 20 ni ayir', '30'],
      ['ellikdan o‘ttizni ayir', '20'], ['yuzdan ellikni ayir', '50'],
      ['sakson dan yigirma ni ayir', '60'], ['qirq dan o‘n besh ni ayir', '25'],
      ['12 - 4', '8'], ['18 - 9', '9'], ['24 - 12', '12'], ['36 - 18', '18'],
      ['48 - 24', '24'], ['100 - 33', '67'], ['200 - 75', '125'], ['500 - 150', '350'],
      ['1000 - 250', '750'], ['1000 - 999', '1'], ['50 - 0', '50']
    ];

    subTests.forEach(([q, exp], i) => {
      test(`2.${i + 1} "${q}" -> ${exp}`, () => {
        const s = MathSolver.solve(q);
        expect(s?.finalAnswer).toBe(exp);
      });
    });
  });

  // ==========================================================================
  // Category 3: Ko‘paytirish (Multiplication) (30 Tests)
  // ==========================================================================
  describe('Cat 3: Ko‘paytirish (30)', () => {
    const mulTests: [string, string][] = [
      ['2 * 2', '4'], ['3 * 3', '9'], ['4 * 4', '16'], ['5 * 5', '25'],
      ['6 * 7', '42'], ['8 * 9', '72'], ['10 * 10', '100'], ['12 * 12', '144'],
      ['15 * 4', '60'], ['20 * 5', '100'], ['25 * 4', '100'], ['50 * 2', '100'],
      ['6 × 7', '42'], ['8 × 8', '64'], ['9 × 9', '81'], ['11 × 11', '121'],
      ['6 bilan 7 ni ko‘paytir', '42'], ['8 ni 9 ga ko‘paytir', '72'],
      ['beshni oltiga ko‘paytir', '30'], ['o‘nni o‘nga ko‘paytir', '100'],
      ['7 * 3', '21'], ['8 * 4', '32'], ['9 * 5', '45'], ['6 * 8', '48'],
      ['7 * 8', '56'], ['7 * 9', '63'], ['13 * 3', '39'], ['14 * 2', '28'],
      ['25 * 8', '200'], ['100 * 5', '500']
    ];

    mulTests.forEach(([q, exp], i) => {
      test(`3.${i + 1} "${q}" -> ${exp}`, () => {
        const s = MathSolver.solve(q);
        expect(s?.finalAnswer).toBe(exp);
      });
    });
  });

  // ==========================================================================
  // Category 4: Bo‘lish (Division) (30 Tests)
  // ==========================================================================
  describe('Cat 4: Bo‘lish (30)', () => {
    const divTests: [string, string][] = [
      ['10 / 2', '5'], ['20 / 4', '5'], ['36 / 6', '6'], ['49 / 7', '7'],
      ['64 / 8', '8'], ['81 / 9', '9'], ['100 / 10', '10'], ['144 / 12', '12'],
      ['56 ÷ 8', '7'], ['72 ÷ 9', '8'], ['100 : 4', '25'], ['50 : 5', '10'],
      ['20 ni 4 ga bo‘l', '5'], ['50 ni 5 ga bo‘l', '10'], ['100 ni 2 ga bo‘l', '50'],
      ['saksonni o‘nga bo‘l', '8'], ['ellikni beshga bo‘l', '10'],
      ['15 / 3', '5'], ['18 / 2', '9'], ['24 / 4', '6'], ['28 / 7', '4'],
      ['30 / 5', '6'], ['32 / 8', '4'], ['42 / 6', '7'], ['45 / 9', '5'],
      ['48 / 6', '8'], ['60 / 12', '5'], ['75 / 25', '3'], ['90 / 10', '9'],
      ['1000 / 100', '10']
    ];

    divTests.forEach(([q, exp], i) => {
      test(`4.${i + 1} "${q}" -> ${exp}`, () => {
        const s = MathSolver.solve(q);
        expect(s?.finalAnswer).toBe(exp);
      });
    });
  });

  // ==========================================================================
  // Category 5: Ko‘p amalli ifodalar (Expressions) (30 Tests)
  // ==========================================================================
  describe('Cat 5: Ko‘p amalli ifodalar (30)', () => {
    const exprTests: [string, string][] = [
      ['2 + 3 * 4', '14'], ['(2 + 3) * 4', '20'], ['10 + 20 / 5', '14'],
      ['(10 + 20) / 5', '6'], ['50 - 10 * 3', '20'], ['(50 - 10) * 2', '80'],
      ['100 - (20 + 30)', '50'], ['2 * (15 - 5)', '20'], ['12 + 4 * (10 - 6)', '28'],
      ['(100 - 20) / (8 - 4)', '20'], ['30 - 2 * 5 + 8 / 4', '22'],
      ['7 * (8 + 2) - 50', '20'], ['10 * (15 - 5) / 2', '50'],
      ['(4 + 6) * (8 - 3)', '50'], ['200 - 50 * 3 + 10', '60'],
      ['(12 / 3 + 6) * 5', '50'], ['15 + 25 / 5', '20'], ['4 * 5 + 6 * 7', '62'],
      ['100 / (5 * 2)', '10'], ['50 - (10 + 5) * 2', '20'],
      ['2 + 2 * 2', '6'], ['(2 + 2) * 2', '8'], ['10 - 3 * 2', '4'],
      ['(10 - 3) * 2', '14'], ['100 - 50 / 2', '75'], ['(100 - 50) / 2', '25'],
      ['5 * 6 + 10 / 2', '35'], ['8 * (4 + 6) / 10', '8'], ['90 - 10 * (5 - 2)', '60'],
      ['((3 + 5) * 2) - 6', '10']
    ];

    exprTests.forEach(([q, exp], i) => {
      test(`5.${i + 1} "${q}" -> ${exp}`, () => {
        const s = MathSolver.solve(q);
        expect(s?.finalAnswer).toBe(exp);
      });
    });
  });

  // ==========================================================================
  // Category 6: Chiziqli tenglamalar (Linear Equations) (40 Tests)
  // ==========================================================================
  describe('Cat 6: Chiziqli tenglamalar (40)', () => {
    const linTests: [string, string][] = [
      ['2x + 5 = 17', 'x = 6'], ['2x + 6 = 16', 'x = 5'], ['3x - 9 = 0', 'x = 3'],
      ['5x + 10 = 35', 'x = 5'], ['4x - 8 = 12', 'x = 5'], ['7x = 49', 'x = 7'],
      ['x + 15 = 40', 'x = 25'], ['x - 20 = 50', 'x = 70'], ['3x + 12 = x + 24', 'x = 6'],
      ['5x - 4 = 2x + 11', 'x = 5'], ['6x + 3 = 4x + 15', 'x = 6'],
      ['10x - 20 = 5x + 10', 'x = 6'], ['2x + 1 = 1', 'x = 0'], ['-3x + 9 = 0', 'x = 3'],
      ['8x + 16 = 0', 'x = -2'], ['3x + 6 = 21', 'x = 5'], ['4x + 8 = 24', 'x = 4'],
      ['5x - 15 = 10', 'x = 5'], ['6x - 18 = 0', 'x = 3'], ['9x = 81', 'x = 9'],
      ['10x = 100', 'x = 10'], ['12x = 48', 'x = 4'], ['x + 7 = 19', 'x = 12'],
      ['x - 8 = 15', 'x = 23'], ['2x + 10 = 30', 'x = 10'], ['3x + 15 = 45', 'x = 10'],
      ['4x + 20 = 60', 'x = 10'], ['5x + 25 = 75', 'x = 10'], ['2x - 6 = 14', 'x = 10'],
      ['3x - 9 = 21', 'x = 10'], ['4x - 16 = 24', 'x = 10'], ['7x + 14 = 35', 'x = 3'],
      ['8x - 24 = 16', 'x = 5'], ['9x + 18 = 45', 'x = 3'], ['11x = 121', 'x = 11'],
      ['15x = 45', 'x = 3'], ['20x = 100', 'x = 5'], ['25x = 100', 'x = 4'],
      ['50x = 200', 'x = 4'], ['100x = 500', 'x = 5']
    ];

    linTests.forEach(([q, exp], i) => {
      test(`6.${i + 1} "${q}" -> ${exp}`, () => {
        const s = MathSolver.solve(q);
        expect(s?.finalAnswer).toBe(exp);
      });
    });
  });

  // ==========================================================================
  // Category 7: Kvadrat tenglamalar (Quadratic Equations) (30 Tests)
  // ==========================================================================
  describe('Cat 7: Kvadrat tenglamalar (30)', () => {
    test('7.1 x^2 - 5x + 6 = 0', () => {
      const s = MathSolver.solve('x^2 - 5x + 6 = 0');
      expect(s?.finalAnswer).toContain('3');
      expect(s?.finalAnswer).toContain('2');
    });
    test('7.2 x^2 - 7x + 12 = 0', () => {
      const s = MathSolver.solve('x^2 - 7x + 12 = 0');
      expect(s?.finalAnswer).toContain('4');
      expect(s?.finalAnswer).toContain('3');
    });
    test('7.3 x^2 - 4 = 0', () => {
      const s = MathSolver.solve('x^2 - 4 = 0');
      expect(s?.finalAnswer).toContain('2');
      expect(s?.finalAnswer).toContain('-2');
    });
    test('7.4 x^2 - 9 = 0', () => {
      const s = MathSolver.solve('x^2 - 9 = 0');
      expect(s?.finalAnswer).toContain('3');
      expect(s?.finalAnswer).toContain('-3');
    });
    test('7.5 x^2 - 16 = 0', () => {
      const s = MathSolver.solve('x^2 - 16 = 0');
      expect(s?.finalAnswer).toContain('4');
      expect(s?.finalAnswer).toContain('-4');
    });
    test('7.6 x^2 - 25 = 0', () => {
      const s = MathSolver.solve('x^2 - 25 = 0');
      expect(s?.finalAnswer).toContain('5');
      expect(s?.finalAnswer).toContain('-5');
    });
    test('7.7 x^2 - 36 = 0', () => {
      const s = MathSolver.solve('x^2 - 36 = 0');
      expect(s?.finalAnswer).toContain('6');
      expect(s?.finalAnswer).toContain('-6');
    });
    test('7.8 x^2 - 49 = 0', () => {
      const s = MathSolver.solve('x^2 - 49 = 0');
      expect(s?.finalAnswer).toContain('7');
      expect(s?.finalAnswer).toContain('-7');
    });
    test('7.9 x^2 - 64 = 0', () => {
      const s = MathSolver.solve('x^2 - 64 = 0');
      expect(s?.finalAnswer).toContain('8');
      expect(s?.finalAnswer).toContain('-8');
    });
    test('7.10 x^2 - 81 = 0', () => {
      const s = MathSolver.solve('x^2 - 81 = 0');
      expect(s?.finalAnswer).toContain('9');
      expect(s?.finalAnswer).toContain('-9');
    });
    test('7.11 x^2 - 100 = 0', () => {
      const s = MathSolver.solve('x^2 - 100 = 0');
      expect(s?.finalAnswer).toContain('10');
      expect(s?.finalAnswer).toContain('-10');
    });
    test('7.12 x^2 - 6x + 9 = 0', () => {
      const s = MathSolver.solve('x^2 - 6x + 9 = 0');
      expect(s?.finalAnswer).toContain('3');
    });
    test('7.13 x^2 + 4x + 4 = 0', () => {
      const s = MathSolver.solve('x^2 + 4x + 4 = 0');
      expect(s?.finalAnswer).toContain('-2');
    });
    test('7.14 x^2 - 8x + 16 = 0', () => {
      const s = MathSolver.solve('x^2 - 8x + 16 = 0');
      expect(s?.finalAnswer).toContain('4');
    });
    test('7.15 x^2 + 6x + 9 = 0', () => {
      const s = MathSolver.solve('x^2 + 6x + 9 = 0');
      expect(s?.finalAnswer).toContain('-3');
    });
    test('7.16 x^2 - 10x + 25 = 0', () => {
      const s = MathSolver.solve('x^2 - 10x + 25 = 0');
      expect(s?.finalAnswer).toContain('5');
    });
    test('7.17 x^2 - 8x + 15 = 0', () => {
      const s = MathSolver.solve('x^2 - 8x + 15 = 0');
      expect(s?.finalAnswer).toContain('5');
      expect(s?.finalAnswer).toContain('3');
    });
    test('7.18 x^2 - 9x + 20 = 0', () => {
      const s = MathSolver.solve('x^2 - 9x + 20 = 0');
      expect(s?.finalAnswer).toContain('5');
      expect(s?.finalAnswer).toContain('4');
    });
    test('7.19 x^2 - 11x + 30 = 0', () => {
      const s = MathSolver.solve('x^2 - 11x + 30 = 0');
      expect(s?.finalAnswer).toContain('6');
      expect(s?.finalAnswer).toContain('5');
    });
    test('7.20 x^2 - 13x + 40 = 0', () => {
      const s = MathSolver.solve('x^2 - 13x + 40 = 0');
      expect(s?.finalAnswer).toContain('8');
      expect(s?.finalAnswer).toContain('5');
    });
    test('7.21 x^2 + 5x + 6 = 0', () => {
      const s = MathSolver.solve('x^2 + 5x + 6 = 0');
      expect(s?.finalAnswer).toContain('-2');
      expect(s?.finalAnswer).toContain('-3');
    });
    test('7.22 x^2 + 7x + 12 = 0', () => {
      const s = MathSolver.solve('x^2 + 7x + 12 = 0');
      expect(s?.finalAnswer).toContain('-3');
      expect(s?.finalAnswer).toContain('-4');
    });
    test('7.23 x^2 + 2x - 8 = 0', () => {
      const s = MathSolver.solve('x^2 + 2x - 8 = 0');
      expect(s?.finalAnswer).toContain('2');
      expect(s?.finalAnswer).toContain('-4');
    });
    test('7.24 x^2 - x - 6 = 0', () => {
      const s = MathSolver.solve('x^2 - x - 6 = 0');
      expect(s?.finalAnswer).toContain('3');
      expect(s?.finalAnswer).toContain('-2');
    });
    test('7.25 2x^2 - 8 = 0', () => {
      const s = MathSolver.solve('2x^2 - 8 = 0');
      expect(s?.finalAnswer).toContain('2');
      expect(s?.finalAnswer).toContain('-2');
    });
    test('7.26 2x^2 - 5x + 2 = 0', () => {
      const s = MathSolver.solve('2x^2 - 5x + 2 = 0');
      expect(s?.finalAnswer).toContain('2');
      expect(s?.finalAnswer).toContain('0.5');
    });
    test('7.27 x^2 + x + 5 = 0 (haqiqiy ildiz yo‘q)', () => {
      const s = MathSolver.solve('x^2 + x + 5 = 0');
      expect(s?.finalAnswer).toContain('Haqiqiy ildizlarga ega emas');
    });
    test('7.28 x^2 + 2x + 10 = 0 (D < 0)', () => {
      const s = MathSolver.solve('x^2 + 2x + 10 = 0');
      expect(s?.finalAnswer).toContain('Haqiqiy ildizlarga ega emas');
    });
    test('7.29 2x^2 - 18 = 0', () => {
      const s = MathSolver.solve('2x^2 - 18 = 0');
      expect(s?.finalAnswer).toContain('3');
      expect(s?.finalAnswer).toContain('-3');
    });
    test('7.30 3x^2 - 27 = 0', () => {
      const s = MathSolver.solve('3x^2 - 27 = 0');
      expect(s?.finalAnswer).toContain('3');
      expect(s?.finalAnswer).toContain('-3');
    });
  });

  // ==========================================================================
  // Category 8: Kasrlar va Aralash sonlar (Fractions) (35 Tests)
  // ==========================================================================
  describe('Cat 8: Kasrlar (35)', () => {
    const fracTests: [string, string][] = [
      ['1/2 + 1/2', '1'], ['1/4 + 1/4', '1/2'], ['1/4 + 2/4', '3/4'],
      ['3/4 + 1/2', '5/4'], ['1/2 + 1/3', '5/6'], ['2/5 + 1/10', '1/2'],
      ['5/6 - 1/3', '1/2'], ['7/8 - 3/8', '1/2'], ['3/4 - 1/4', '1/2'],
      ['5/7 - 2/7', '3/7'], ['2/3 * 3/4', '1/2'], ['4/5 * 5/8', '1/2'],
      ['1/2 * 2/3', '1/3'], ['3/5 * 5/9', '1/3'], ['3/5 / 2/5', '3/2'],
      ['5/7 / 5/14', '2'], ['1/2 / 1/4', '2'], ['2/3 / 1/3', '2'],
      ['12/16 qisqartir', '3/4'], ['18/24 qisqartir', '3/4'], ['25/30 qisqartir', '5/6'],
      ['10/20 qisqartir', '1/2'], ['15/45 qisqartir', '1/3'], ['20/100 qisqartir', '1/5'],
      ['7/4', '1 3/4'], ['9/2', '4 1/2'], ['5/2', '2 1/2'], ['8/3', '2 2/3'],
      ['11/4', '2 3/4'], ['13/5', '2 3/5'], ['17/3', '5 2/3'], ['21/4', '5 1/4'],
      ['25/4', '6 1/4'], ['10/3', '3 1/3'], ['15/2', '7 1/2']
    ];

    fracTests.forEach(([q, exp], i) => {
      test(`8.${i + 1} "${q}" -> ${exp}`, () => {
        const s = MathSolver.solve(q);
        expect(s?.finalAnswer).toContain(exp);
      });
    });
  });

  // ==========================================================================
  // Category 9: Foiz va Proporsiya (30 Tests)
  // ==========================================================================
  describe('Cat 9: Foiz va Proporsiya (30)', () => {
    const percTests: [string, string][] = [
      ['15 ning 20 foizi', '3'], ['200 ning 15 foizi', '30'], ['50 ning 10%', '5'],
      ['100 ning 50 foizi', '50'], ['80 ning 25 foizi', '20'], ['60 ning 50%', '30'],
      ['120 ning 10 foizi', '12'], ['500 ning 5 foizi', '25'], ['1000 ning 20%', '200'],
      ['40 ning 50 foizi', '20'], ['30 ning 10 foizi', '3'], ['250 ning 20 foizi', '50'],
      ['400 ning 25 foizi', '100'], ['300 ning 30 foizi', '90'], ['50 ning 20 foizi', '10'],
      ['200 ning 50 foizi', '100'], ['150 ning 10 foizi', '15'], ['80 ning 50 foizi', '40'],
      ['90 ning 10 foizi', '9'], ['70 ning 20 foizi', '14'],
      ['x : 4 = 15 : 20', 'x = 3'], ['x : 2 = 6 : 4', 'x = 3'], ['x : 5 = 10 : 25', 'x = 2'],
      ['x : 3 = 12 : 9', 'x = 4'], ['x : 10 = 20 : 50', 'x = 4'], ['x : 6 = 8 : 12', 'x = 4'],
      ['x : 8 = 10 : 16', 'x = 5'], ['x : 7 = 14 : 49', 'x = 2'], ['x : 9 = 18 : 27', 'x = 6'],
      ['x : 12 = 15 : 36', 'x = 5']
    ];

    percTests.forEach(([q, exp], i) => {
      test(`9.${i + 1} "${q}" -> ${exp}`, () => {
        const s = MathSolver.solve(q);
        expect(s?.finalAnswer).toContain(exp);
      });
    });
  });

  // ==========================================================================
  // Category 10: Daraja, Ildiz va Modul (30 Tests)
  // ==========================================================================
  describe('Cat 10: Daraja, Ildiz va Modul (30)', () => {
    const powTests: [string, string][] = [
      ['2^2', '4'], ['2^3', '8'], ['2^4', '16'], ['2^5', '32'],
      ['3^2', '9'], ['3^3', '27'], ['3^4', '81'], ['4^2', '16'],
      ['4^3', '64'], ['5^2', '25'], ['5^3', '125'], ['6^2', '36'],
      ['7^2', '49'], ['8^2', '64'], ['9^2', '81'], ['10^2', '100'],
      ['sqrt(4)', '2'], ['sqrt(9)', '3'], ['sqrt(16)', '4'], ['sqrt(25)', '5'],
      ['sqrt(36)', '6'], ['sqrt(49)', '7'], ['sqrt(64)', '8'], ['sqrt(81)', '9'],
      ['sqrt(100)', '10'], ['sqrt(121)', '11'], ['sqrt(144)', '12'],
      ['|x| = 5', 'x = 5, x = -5'], ['|x| = 7', 'x = 7, x = -7'], ['|x| = 10', 'x = 10, x = -10']
    ];

    powTests.forEach(([q, exp], i) => {
      test(`10.${i + 1} "${q}" -> ${exp}`, () => {
        const s = MathSolver.solve(q);
        expect(s?.finalAnswer).toContain(exp);
      });
    });
  });

  // ==========================================================================
  // Category 11: Logarifm va Trigonometriya (25 Tests)
  // ==========================================================================
  describe('Cat 11: Logarifm va Trigonometriya (25)', () => {
    test('11.1 log_2(8)', () => {
      const s = MathSolver.solve('log_2(8)');
      expect(s?.finalAnswer).toBe('3');
    });
    test('11.2 log_2(16)', () => {
      const s = MathSolver.solve('log_2(16)');
      expect(s?.finalAnswer).toBe('4');
    });
    test('11.3 log_2(32)', () => {
      const s = MathSolver.solve('log_2(32)');
      expect(s?.finalAnswer).toBe('5');
    });
    test('11.4 log_3(9)', () => {
      const s = MathSolver.solve('log_3(9)');
      expect(s?.finalAnswer).toBe('2');
    });
    test('11.5 log_3(27)', () => {
      const s = MathSolver.solve('log_3(27)');
      expect(s?.finalAnswer).toBe('3');
    });
    test('11.6 log_3(81)', () => {
      const s = MathSolver.solve('log_3(81)');
      expect(s?.finalAnswer).toBe('4');
    });
    test('11.7 log_5(25)', () => {
      const s = MathSolver.solve('log_5(25)');
      expect(s?.finalAnswer).toBe('2');
    });
    test('11.8 log_5(125)', () => {
      const s = MathSolver.solve('log_5(125)');
      expect(s?.finalAnswer).toBe('3');
    });
    test('11.9 lg(10)', () => {
      const s = MathSolver.solve('lg(10)');
      expect(s?.finalAnswer).toBe('1');
    });
    test('11.10 lg(100)', () => {
      const s = MathSolver.solve('lg(100)');
      expect(s?.finalAnswer).toBe('2');
    });
    test('11.11 lg(1000)', () => {
      const s = MathSolver.solve('lg(1000)');
      expect(s?.finalAnswer).toBe('3');
    });
    test('11.12 sin(0)', () => {
      const s = MathSolver.solve('sin(0)');
      expect(s?.finalAnswer).toBe('0');
    });
    test('11.13 sin(30)', () => {
      const s = MathSolver.solve('sin(30)');
      expect(s?.finalAnswer).toBe('1/2');
    });
    test('11.14 sin(90)', () => {
      const s = MathSolver.solve('sin(90)');
      expect(s?.finalAnswer).toBe('1');
    });
    test('11.15 cos(0)', () => {
      const s = MathSolver.solve('cos(0)');
      expect(s?.finalAnswer).toBe('1');
    });
    test('11.16 cos(60)', () => {
      const s = MathSolver.solve('cos(60)');
      expect(s?.finalAnswer).toBe('1/2');
    });
    test('11.17 cos(90)', () => {
      const s = MathSolver.solve('cos(90)');
      expect(s?.finalAnswer).toBe('0');
    });
    test('11.18 tg(45)', () => {
      const s = MathSolver.solve('tg(45)');
      expect(s?.finalAnswer).toBe('1');
    });
    test('11.19 ctg(45)', () => {
      const s = MathSolver.solve('ctg(45)');
      expect(s?.finalAnswer).toBe('1');
    });
    test('11.20 x^2 - 9 ko‘paytuvchilarga ajrat', () => {
      const s = MathSolver.solve('x^2 - 9 ko‘paytuvchilarga ajrat');
      expect(s?.finalAnswer).toBe('(x - 3)(x + 3)');
    });
    test('11.21 x^2 - 16 ko‘paytuvchilarga ajrat', () => {
      const s = MathSolver.solve('x^2 - 16 ko‘paytuvchilarga ajrat');
      expect(s?.finalAnswer).toBe('(x - 4)(x + 4)');
    });
    test('11.22 x^2 - 25 ko‘paytuvchilarga ajrat', () => {
      const s = MathSolver.solve('x^2 - 25 ko‘paytuvchilarga ajrat');
      expect(s?.finalAnswer).toBe('(x - 5)(x + 5)');
    });
    test('11.23 x^2 + 6x + 9 ko‘paytuvchilarga ajrat', () => {
      const s = MathSolver.solve('x^2 + 6x + 9 ko‘paytuvchilarga ajrat');
      expect(s?.finalAnswer).toBe('(x + 3)^2');
    });
    test('11.24 x^2 - 4x + 4 ko‘paytuvchilarga ajrat', () => {
      const s = MathSolver.solve('x^2 - 4x + 4 ko‘paytuvchilarga ajrat');
      expect(s?.finalAnswer).toBe('(x - 2)^2');
    });
    test('11.25 x^2 - 100 ko‘paytuvchilarga ajrat', () => {
      const s = MathSolver.solve('x^2 - 100 ko‘paytuvchilarga ajrat');
      expect(s?.finalAnswer).toBe('(x - 10)(x + 10)');
    });
  });

  // ==========================================================================
  // Category 12: EKUB, EKUK va Tub sonlar (25 Tests)
  // ==========================================================================
  describe('Cat 12: EKUB, EKUK va Tub sonlar (25)', () => {
    test('12.1 EKUB(24, 36)', () => {
      const s = MathSolver.solve('EKUB(24, 36)');
      expect(s?.finalAnswer).toBe('12');
    });
    test('12.2 EKUK(12, 18)', () => {
      const s = MathSolver.solve('EKUK(12, 18)');
      expect(s?.finalAnswer).toBe('36');
    });
    test('12.3 EKUB(15, 25)', () => {
      const s = MathSolver.solve('EKUB(15, 25)');
      expect(s?.finalAnswer).toBe('5');
    });
    test('12.4 EKUK(4, 6)', () => {
      const s = MathSolver.solve('EKUK(4, 6)');
      expect(s?.finalAnswer).toBe('12');
    });
    test('12.5 EKUB(48, 72)', () => {
      const s = MathSolver.solve('EKUB(48, 72)');
      expect(s?.finalAnswer).toBe('24');
    });
    test('12.6 EKUK(15, 20)', () => {
      const s = MathSolver.solve('EKUK(15, 20)');
      expect(s?.finalAnswer).toBe('60');
    });
    test('12.7 EKUB(100, 150)', () => {
      const s = MathSolver.solve('EKUB(100, 150)');
      expect(s?.finalAnswer).toBe('50');
    });
    test('12.8 EKUK(8, 12)', () => {
      const s = MathSolver.solve('EKUK(8, 12)');
      expect(s?.finalAnswer).toBe('24');
    });
    test('12.9 EKUB(17, 19)', () => {
      const s = MathSolver.solve('EKUB(17, 19)');
      expect(s?.finalAnswer).toBe('1');
    });
    test('12.10 EKUK(5, 7)', () => {
      const s = MathSolver.solve('EKUK(5, 7)');
      expect(s?.finalAnswer).toBe('35');
    });
    test('12.11 29 tub sonmi', () => {
      const s = MathSolver.solve('29 tub sonmi');
      expect(s?.finalAnswer).toContain('Tub son');
    });
    test('12.12 30 tub sonmi', () => {
      const s = MathSolver.solve('30 tub sonmi');
      expect(s?.finalAnswer).toContain('Murakkab son');
    });
    test('12.13 13 tub sonmi', () => {
      const s = MathSolver.solve('13 tub sonmi');
      expect(s?.finalAnswer).toContain('Tub son');
    });
    test('12.14 49 tub sonmi', () => {
      const s = MathSolver.solve('49 tub sonmi');
      expect(s?.finalAnswer).toContain('Murakkab son');
    });
    test('12.15 17 tub sonmi', () => {
      const s = MathSolver.solve('17 tub sonmi');
      expect(s?.finalAnswer).toContain('Tub son');
    });
    test('12.16 91 tub sonmi', () => {
      const s = MathSolver.solve('91 tub sonmi');
      expect(s?.finalAnswer).toContain('Murakkab son');
    });
    test('12.17 60 ni tub ko‘paytuvchilarga ajrat', () => {
      const s = MathSolver.solve('60 ni tub ko‘paytuvchilarga ajrat');
      expect(s?.finalAnswer).toContain('2^2 * 3 * 5');
    });
    test('12.18 12 ni tub ko‘paytuvchilarga ajrat', () => {
      const s = MathSolver.solve('12 ni tub ko‘paytuvchilarga ajrat');
      expect(s?.finalAnswer).toContain('2^2 * 3');
    });
    test('12.19 100 ni tub ko‘paytuvchilarga ajrat', () => {
      const s = MathSolver.solve('100 ni tub ko‘paytuvchilarga ajrat');
      expect(s?.finalAnswer).toContain('2^2 * 5^2');
    });
    test('12.20 36 ni tub ko‘paytuvchilarga ajrat', () => {
      const s = MathSolver.solve('36 ni tub ko‘paytuvchilarga ajrat');
      expect(s?.finalAnswer).toContain('2^2 * 3^2');
    });
    test('12.21 EKUB(18, 24)', () => {
      const s = MathSolver.solve('EKUB(18, 24)');
      expect(s?.finalAnswer).toBe('6');
    });
    test('12.22 EKUK(6, 9)', () => {
      const s = MathSolver.solve('EKUK(6, 9)');
      expect(s?.finalAnswer).toBe('18');
    });
    test('12.23 23 tub sonmi', () => {
      const s = MathSolver.solve('23 tub sonmi');
      expect(s?.finalAnswer).toContain('Tub son');
    });
    test('12.24 37 tub sonmi', () => {
      const s = MathSolver.solve('37 tub sonmi');
      expect(s?.finalAnswer).toContain('Tub son');
    });
    test('12.25 18 ni tub ko‘paytuvchilarga ajrat', () => {
      const s = MathSolver.solve('18 ni tub ko‘paytuvchilarga ajrat');
      expect(s?.finalAnswer).toContain('2 * 3^2');
    });
  });

  // ==========================================================================
  // Category 13: Hosila, Integral va Limit (25 Tests)
  // ==========================================================================
  describe('Cat 13: Hosila, Integral va Limit (25)', () => {
    test('13.1 (x^2) hosilasi', () => {
      const s = MathSolver.solve('(x^2) hosilasi');
      expect(s?.finalAnswer).toBe('2x');
    });
    test('13.2 (x^3) hosilasi', () => {
      const s = MathSolver.solve('(x^3) hosilasi');
      expect(s?.finalAnswer).toBe('3x^2');
    });
    test('13.3 (3x^2) hosilasi', () => {
      const s = MathSolver.solve('(3x^2) hosilasi');
      expect(s?.finalAnswer).toBe('6x');
    });
    test('13.4 (5x) hosilasi', () => {
      const s = MathSolver.solve('(5x) hosilasi');
      expect(s?.finalAnswer).toBe('5');
    });
    test('13.5 (x^4) hosilasi', () => {
      const s = MathSolver.solve('(x^4) hosilasi');
      expect(s?.finalAnswer).toBe('4x^3');
    });
    test('13.6 (2x^3) hosilasi', () => {
      const s = MathSolver.solve('(2x^3) hosilasi');
      expect(s?.finalAnswer).toBe('6x^2');
    });
    test('13.7 (7x) hosilasi', () => {
      const s = MathSolver.solve('(7x) hosilasi');
      expect(s?.finalAnswer).toBe('7');
    });
    test('13.8 (x^5) hosilasi', () => {
      const s = MathSolver.solve('(x^5) hosilasi');
      expect(s?.finalAnswer).toBe('5x^4');
    });
    test('13.9 (4x^2) hosilasi', () => {
      const s = MathSolver.solve('(4x^2) hosilasi');
      expect(s?.finalAnswer).toBe('8x');
    });
    test('13.10 (10x) hosilasi', () => {
      const s = MathSolver.solve('(10x) hosilasi');
      expect(s?.finalAnswer).toBe('10');
    });
    test('13.11 integral(x)', () => {
      const s = MathSolver.solve('integral(x)');
      expect(s?.finalAnswer).toBe('x^2/2 + C');
    });
    test('13.12 integral(x^2)', () => {
      const s = MathSolver.solve('integral(x^2)');
      expect(s?.finalAnswer).toBe('x^3/3 + C');
    });
    test('13.13 integral(2x)', () => {
      const s = MathSolver.solve('integral(2x)');
      expect(s?.finalAnswer).toBe('x^2 + C');
    });
    test('13.14 integral(3x^2)', () => {
      const s = MathSolver.solve('integral(3x^2)');
      expect(s?.finalAnswer).toBe('x^3 + C');
    });
    test('13.15 integral(5)', () => {
      const s = MathSolver.solve('integral(5)');
      expect(s?.finalAnswer).toBe('5x + C');
    });
    test('13.16 integral(x^3)', () => {
      const s = MathSolver.solve('integral(x^3)');
      expect(s?.finalAnswer).toBe('x^4/4 + C');
    });
    test('13.17 integral(4x^3)', () => {
      const s = MathSolver.solve('integral(4x^3)');
      expect(s?.finalAnswer).toBe('x^4 + C');
    });
    test('13.18 integral(6x)', () => {
      const s = MathSolver.solve('integral(6x)');
      expect(s?.finalAnswer).toBe('3x^2 + C');
    });
    test('13.19 integral(10)', () => {
      const s = MathSolver.solve('integral(10)');
      expect(s?.finalAnswer).toBe('10x + C');
    });
    test('13.20 integral(x^4)', () => {
      const s = MathSolver.solve('integral(x^4)');
      expect(s?.finalAnswer).toBe('x^5/5 + C');
    });
    test('13.21 lim(2x + 1) as x->3', () => {
      const s = MathSolver.solve('lim(2x + 1) as x->3');
      expect(s?.finalAnswer).toBe('7');
    });
    test('13.22 lim(x^2 - 4) as x->2', () => {
      const s = MathSolver.solve('lim(x^2 - 4) as x->2');
      expect(s?.finalAnswer).toBe('0');
    });
    test('13.23 lim(3x + 5) as x->0', () => {
      const s = MathSolver.solve('lim(3x + 5) as x->0');
      expect(s?.finalAnswer).toBe('5');
    });
    test('13.24 lim(x^2 + 1) as x->4', () => {
      const s = MathSolver.solve('lim(x^2 + 1) as x->4');
      expect(s?.finalAnswer).toBe('17');
    });
    test('13.25 lim(5x - 2) as x->2', () => {
      const s = MathSolver.solve('lim(5x - 2) as x->2');
      expect(s?.finalAnswer).toBe('8');
    });
  });

  // ==========================================================================
  // Category 14: Geometriya va Koordinatalar (25 Tests)
  // ==========================================================================
  describe('Cat 14: Geometriya va Koordinatalar (25)', () => {
    test('14.1 To‘g‘ri to‘rtburchak a=4, b=6 yuzi', () => {
      const s = MathSolver.solve('To‘g‘ri to‘rtburchak a=4, b=6 yuzi');
      expect(s?.finalAnswer).toContain('S = 24');
    });
    test('14.2 To‘g‘ri to‘rtburchak a=5, b=8 perimetri', () => {
      const s = MathSolver.solve('To‘g‘ri to‘rtburchak a=5, b=8 perimetri');
      expect(s?.finalAnswer).toContain('P = 26');
    });
    test('14.3 Kvadrat tomoni 5 yuzi', () => {
      const s = MathSolver.solve('Kvadrat tomoni 5 yuzi');
      expect(s?.finalAnswer).toContain('S = 25');
    });
    test('14.4 Kvadrat tomoni 6 perimetri', () => {
      const s = MathSolver.solve('Kvadrat tomoni 6 perimetri');
      expect(s?.finalAnswer).toContain('P = 24');
    });
    test('14.5 Uchburchak a=6, h=4 yuzi', () => {
      const s = MathSolver.solve('Uchburchak a=6, h=4 yuzi');
      expect(s?.finalAnswer).toContain('S = 12');
    });
    test('14.6 Doira r=7 yuzi', () => {
      const s = MathSolver.solve('Doira r=7 yuzi');
      expect(s?.finalAnswer).toContain('153.94');
    });
    test('14.7 Doira r=5 uzunligi', () => {
      const s = MathSolver.solve('Doira r=5 uzunligi');
      expect(s?.finalAnswer).toContain('31.42');
    });
    test('14.8 Pifagor a=3, b=4 c=?', () => {
      const s = MathSolver.solve('Pifagor a=3, b=4 c=?');
      expect(s?.finalAnswer).toContain('c = 5');
    });
    test('14.9 Pifagor a=6, b=8 c=?', () => {
      const s = MathSolver.solve('Pifagor a=6, b=8 c=?');
      expect(s?.finalAnswer).toContain('c = 10');
    });
    test('14.10 Pifagor a=5, b=12 c=?', () => {
      const s = MathSolver.solve('Pifagor a=5, b=12 c=?');
      expect(s?.finalAnswer).toContain('c = 13');
    });
    test('14.11 Kvadrat tomoni 10 yuzi', () => {
      const s = MathSolver.solve('Kvadrat tomoni 10 yuzi');
      expect(s?.finalAnswer).toContain('S = 100');
    });
    test('14.12 To‘g‘ri to‘rtburchak a=10, b=20 yuzi', () => {
      const s = MathSolver.solve('To‘g‘ri to‘rtburchak a=10, b=20 yuzi');
      expect(s?.finalAnswer).toContain('S = 200');
    });
    test('14.13 Kvadrat tomoni 8 perimetri', () => {
      const s = MathSolver.solve('Kvadrat tomoni 8 perimetri');
      expect(s?.finalAnswer).toContain('P = 32');
    });
    test('14.14 Uchburchak a=10, h=5 yuzi', () => {
      const s = MathSolver.solve('Uchburchak a=10, h=5 yuzi');
      expect(s?.finalAnswer).toContain('S = 25');
    });
    test('14.15 Doira r=10 yuzi', () => {
      const s = MathSolver.solve('Doira r=10 yuzi');
      expect(s?.finalAnswer).toContain('314.16');
    });
    test('14.16 Pifagor a=8, b=15 c=?', () => {
      const s = MathSolver.solve('Pifagor a=8, b=15 c=?');
      expect(s?.finalAnswer).toContain('c = 17');
    });
    test('14.17 Pifagor a=9, b=12 c=?', () => {
      const s = MathSolver.solve('Pifagor a=9, b=12 c=?');
      expect(s?.finalAnswer).toContain('c = 15');
    });
    test('14.18 A(0, 0) va B(3, 4) masofa', () => {
      const s = MathSolver.solve('A(0, 0) va B(3, 4) masofa');
      expect(s?.finalAnswer).toContain('d = 5');
    });
    test('14.19 A(1, 1) va B(4, 5) masofa', () => {
      const s = MathSolver.solve('A(1, 1) va B(4, 5) masofa');
      expect(s?.finalAnswer).toContain('d = 5');
    });
    test('14.20 A(2, 3) va B(8, 11) masofa', () => {
      const s = MathSolver.solve('A(2, 3) va B(8, 11) masofa');
      expect(s?.finalAnswer).toContain('d = 10');
    });
    test('14.21 Kvadrat tomoni 4 yuzi', () => {
      const s = MathSolver.solve('Kvadrat tomoni 4 yuzi');
      expect(s?.finalAnswer).toContain('S = 16');
    });
    test('14.22 To‘g‘ri to‘rtburchak a=3, b=7 yuzi', () => {
      const s = MathSolver.solve('To‘g‘ri to‘rtburchak a=3, b=7 yuzi');
      expect(s?.finalAnswer).toContain('S = 21');
    });
    test('14.23 To‘g‘ri to‘rtburchak a=6, b=4 perimetri', () => {
      const s = MathSolver.solve('To‘g‘ri to‘rtburchak a=6, b=4 perimetri');
      expect(s?.finalAnswer).toContain('P = 20');
    });
    test('14.24 Doira r=1 uzunligi', () => {
      const s = MathSolver.solve('Doira r=1 uzunligi');
      expect(s?.finalAnswer).toContain('6.28');
    });
    test('14.25 Uchburchak a=8, h=6 yuzi', () => {
      const s = MathSolver.solve('Uchburchak a=8, h=6 yuzi');
      expect(s?.finalAnswer).toContain('S = 24');
    });
  });

  // ==========================================================================
  // Category 15: Kombinatorika, Statistika va Ehtimollik (25 Tests)
  // ==========================================================================
  describe('Cat 15: Kombinatorika va Statistika (25)', () => {
    test('15.1 P_3', () => {
      const s = MathSolver.solve('P_3');
      expect(s?.finalAnswer).toBe('6');
    });
    test('15.2 P_4', () => {
      const s = MathSolver.solve('P_4');
      expect(s?.finalAnswer).toBe('24');
    });
    test('15.3 P_5', () => {
      const s = MathSolver.solve('P_5');
      expect(s?.finalAnswer).toBe('120');
    });
    test('15.4 P_6', () => {
      const s = MathSolver.solve('P_6');
      expect(s?.finalAnswer).toBe('720');
    });
    test('15.5 C(5, 2)', () => {
      const s = MathSolver.solve('C(5, 2)');
      expect(s?.finalAnswer).toBe('10');
    });
    test('15.6 C(6, 2)', () => {
      const s = MathSolver.solve('C(6, 2)');
      expect(s?.finalAnswer).toBe('15');
    });
    test('15.7 C(4, 2)', () => {
      const s = MathSolver.solve('C(4, 2)');
      expect(s?.finalAnswer).toBe('6');
    });
    test('15.8 C(5, 3)', () => {
      const s = MathSolver.solve('C(5, 3)');
      expect(s?.finalAnswer).toBe('10');
    });
    test('15.9 C(7, 2)', () => {
      const s = MathSolver.solve('C(7, 2)');
      expect(s?.finalAnswer).toBe('21');
    });
    test('15.10 C(8, 2)', () => {
      const s = MathSolver.solve('C(8, 2)');
      expect(s?.finalAnswer).toBe('28');
    });
    test('15.11 4 va 6 o‘rtacha qiymati', () => {
      const s = MathSolver.solve('4 va 6 o‘rtacha qiymati');
      expect(s?.finalAnswer).toBe('5');
    });
    test('15.12 10, 20 va 30 o‘rtacha qiymati', () => {
      const s = MathSolver.solve('10, 20 va 30 o‘rtacha qiymati');
      expect(s?.finalAnswer).toBe('20');
    });
    test('15.13 5, 15 o‘rtacha', () => {
      const s = MathSolver.solve('5 va 15 o‘rtacha');
      expect(s?.finalAnswer).toBe('10');
    });
    test('15.14 2, 4, 6, 8 o‘rtacha qiymati', () => {
      const s = MathSolver.solve('2, 4, 6 va 8 o‘rtacha');
      expect(s?.finalAnswer).toBe('5');
    });
    test('15.15 10 va 40 o‘rtacha', () => {
      const s = MathSolver.solve('10 va 40 o‘rtacha');
      expect(s?.finalAnswer).toBe('25');
    });
    test('15.16 Zar tashlanganda juft son tushish ehtimoli', () => {
      const s = MathSolver.solve('Zar tashlanganda juft son tushish ehtimoli');
      expect(s?.finalAnswer).toBe('1/2');
    });
    test('15.17 Zar tashlanganda toq son tushish ehtimoli', () => {
      const s = MathSolver.solve('Zar tashlanganda toq son tushish ehtimoli');
      expect(s?.finalAnswer).toBe('1/2');
    });
    test('15.18 Zar tashlanganda 6 tushish ehtimoli', () => {
      const s = MathSolver.solve('Zar tashlanganda 6 tushish ehtimoli');
      expect(s?.finalAnswer).toBe('1/6');
    });
    test('15.19 Zar tashlanganda 1 tushish ehtimoli', () => {
      const s = MathSolver.solve('Zar tashlanganda 1 tushish ehtimoli');
      expect(s?.finalAnswer).toBe('1/6');
    });
    test('15.20 P_2', () => {
      const s = MathSolver.solve('P_2');
      expect(s?.finalAnswer).toBe('2');
    });
    test('15.21 C(10, 2)', () => {
      const s = MathSolver.solve('C(10, 2)');
      expect(s?.finalAnswer).toBe('45');
    });
    test('15.22 C(5, 1)', () => {
      const s = MathSolver.solve('C(5, 1)');
      expect(s?.finalAnswer).toBe('5');
    });
    test('15.23 20, 30 o‘rtacha', () => {
      const s = MathSolver.solve('20 va 30 o‘rtacha');
      expect(s?.finalAnswer).toBe('25');
    });
    test('15.24 100, 200 o‘rtacha', () => {
      const s = MathSolver.solve('100 va 200 o‘rtacha');
      expect(s?.finalAnswer).toBe('150');
    });
    test('15.25 C(3, 1)', () => {
      const s = MathSolver.solve('C(3, 1)');
      expect(s?.finalAnswer).toBe('3');
    });
  });

  // ==========================================================================
  // Category 16: Matnli So‘zli Masalalar (Word Problems) (25 Tests)
  // ==========================================================================
  describe('Cat 16: Matnli So‘zli Masalalar (25)', () => {
    test('16.1 Mashina 60 km/soat tezlikda 3 soatda qancha masofa bosadi?', () => {
      const s = MathSolver.solve('Mashina 60 km/soat tezlikda 3 soatda qancha masofa bosadi');
      expect(s?.finalAnswer).toContain('180 km');
    });
    test('16.2 Poyezd 240 km masofani 4 soatda bosib o‘tsa tezligi qancha?', () => {
      const s = MathSolver.solve('Poyezd 240 km masofani 4 soatda bosib o‘tsa tezligi qancha');
      expect(s?.finalAnswer).toContain('60 km/soat');
    });
    test('16.3 Piyoda 15 km masofani 5 km/soat tezlikda necha soatda o‘tadi?', () => {
      const s = MathSolver.solve('Piyoda 15 km masofani 5 km/soat tezlikda necha soatda o‘tadi');
      expect(s?.finalAnswer).toContain('3 soat');
    });
    test('16.4 Velosipedchi 20 km/soat tezlikda 2 soatda qancha masofa bosadi?', () => {
      const s = MathSolver.solve('Velosipedchi 20 km/soat tezlikda 2 soatda qancha masofa bosadi');
      expect(s?.finalAnswer).toContain('40 km');
    });
    test('16.5 Mashina 300 km masofani 5 soatda bosib o‘tsa tezligi?', () => {
      const s = MathSolver.solve('Mashina 300 km masofani 5 soatda bosib o‘tsa tezligi');
      expect(s?.finalAnswer).toContain('60 km/soat');
    });
    test('16.6 Samolyot 800 km/soat tezlikda 2 soatda qancha masofa uchadi?', () => {
      const s = MathSolver.solve('Samolyot 800 km/soat tezlikda 2 soatda qancha masofa uchadi');
      expect(s?.finalAnswer).toContain('1600 km');
    });
    test('16.7 Mashina 100 km/soat tezlikda 4 soatda qancha masofa?', () => {
      const s = MathSolver.solve('Mashina 100 km/soat tezlikda 4 soatda qancha masofa bosadi');
      expect(s?.finalAnswer).toContain('400 km');
    });
    test('16.8 180 km masofani 90 km/soat tezlikda necha soatda bosib o‘tadi?', () => {
      const s = MathSolver.solve('180 km masofani 90 km/soat tezlikda necha soatda bosib o‘tadi');
      expect(s?.finalAnswer).toContain('2 soat');
    });
    test('16.9 500 km masofani 100 km/soat tezlikda necha soatda?', () => {
      const s = MathSolver.solve('500 km masofani 100 km/soat tezlikda necha soatda');
      expect(s?.finalAnswer).toContain('5 soat');
    });
    test('16.10 Avtobus 50 km/soat tezlikda 6 soatda qancha yo‘l yuradi?', () => {
      const s = MathSolver.solve('Avtobus 50 km/soat tezlikda 6 soatda qancha yo‘l yuradi');
      expect(s?.finalAnswer).toContain('300 km');
    });
    test('16.11 Mashina 70 km/soat tezlikda 2 soatda qancha yuradi?', () => {
      const s = MathSolver.solve('Mashina 70 km/soat tezlikda 2 soatda qancha masofa bosadi');
      expect(s?.finalAnswer).toContain('140 km');
    });
    test('16.12 120 km masofani 60 km/soat tezlikda necha soatda?', () => {
      const s = MathSolver.solve('120 km masofani 60 km/soat tezlikda necha soatda');
      expect(s?.finalAnswer).toContain('2 soat');
    });
    test('16.13 400 km masofani 80 km/soat tezlikda necha soatda?', () => {
      const s = MathSolver.solve('400 km masofani 80 km/soat tezlikda necha soatda');
      expect(s?.finalAnswer).toContain('5 soat');
    });
    test('16.14 Mashina 90 km/soat tezlikda 3 soatda qancha masofa?', () => {
      const s = MathSolver.solve('Mashina 90 km/soat tezlikda 3 soatda qancha masofa bosadi');
      expect(s?.finalAnswer).toContain('270 km');
    });
    test('16.15 Avtobus 40 km/soat tezlikda 4 soatda qancha masofa?', () => {
      const s = MathSolver.solve('Avtobus 40 km/soat tezlikda 4 soatda qancha masofa bosadi');
      expect(s?.finalAnswer).toContain('160 km');
    });
    test('16.16 Ikki son yig‘indisi 50, ayirmasi 10 bo‘lsa', () => {
      const s = MathSolver.solve('Ikki son yig‘indisi 50, ayirmasi 10');
      expect(s?.finalAnswer).toBe('30 va 20');
    });
    test('16.17 Ikki son yig‘indisi 100, ayirmasi 20 bo‘lsa', () => {
      const s = MathSolver.solve('Ikki son yig‘indisi 100, ayirmasi 20');
      expect(s?.finalAnswer).toBe('60 va 40');
    });
    test('16.18 Ikki son yig‘indisi 40, ayirmasi 10 bo‘lsa', () => {
      const s = MathSolver.solve('Ikki son yig‘indisi 40, ayirmasi 10');
      expect(s?.finalAnswer).toBe('25 va 15');
    });
    test('16.19 Ikki son yig‘indisi 60, ayirmasi 20 bo‘lsa', () => {
      const s = MathSolver.solve('Ikki son yig‘indisi 60, ayirmasi 20');
      expect(s?.finalAnswer).toBe('40 va 20');
    });
    test('16.20 Ikki son yig‘indisi 80, ayirmasi 20 bo‘lsa', () => {
      const s = MathSolver.solve('Ikki son yig‘indisi 80, ayirmasi 20');
      expect(s?.finalAnswer).toBe('50 va 30');
    });
    test('16.21 250 km masofani 50 km/soat tezlikda necha soatda?', () => {
      const s = MathSolver.solve('250 km masofani 50 km/soat tezlikda necha soatda');
      expect(s?.finalAnswer).toContain('5 soat');
    });
    test('16.22 360 km masofani 60 km/soat tezlikda necha soatda?', () => {
      const s = MathSolver.solve('360 km masofani 60 km/soat tezlikda necha soatda');
      expect(s?.finalAnswer).toContain('6 soat');
    });
    test('16.23 Samolyot 600 km/soat tezlikda 3 soatda qancha masofa uchadi?', () => {
      const s = MathSolver.solve('Samolyot 600 km/soat tezlikda 3 soatda qancha masofa uchadi');
      expect(s?.finalAnswer).toContain('1800 km');
    });
    test('16.24 Piyoda 20 km masofani 4 km/soat tezlikda necha soatda?', () => {
      const s = MathSolver.solve('Piyoda 20 km masofani 4 km/soat tezlikda necha soatda');
      expect(s?.finalAnswer).toContain('5 soat');
    });
    test('16.25 Velosipedchi 15 km/soat tezlikda 3 soatda qancha masofa?', () => {
      const s = MathSolver.solve('Velosipedchi 15 km/soat tezlikda 3 soatda qancha masofa bosadi');
      expect(s?.finalAnswer).toContain('45 km');
    });
  });

  // ==========================================================================
  // Category 17: Birliklar va Progressiyalar (25 Tests)
  // ==========================================================================
  describe('Cat 17: Birliklar va Progressiyalar (25)', () => {
    test('17.1 5 km necha metr', () => {
      const s = MathSolver.solve('5 km necha metr');
      expect(s?.finalAnswer).toContain('5000 metr');
    });
    test('17.2 2500 m necha km', () => {
      const s = MathSolver.solve('2500 m necha km');
      expect(s?.finalAnswer).toContain('2.5 km');
    });
    test('17.3 3 soat necha minut', () => {
      const s = MathSolver.solve('3 soat necha minut');
      expect(s?.finalAnswer).toContain('180 minut');
    });
    test('17.4 120 minut necha soat', () => {
      const s = MathSolver.solve('120 minut necha soat');
      expect(s?.finalAnswer).toContain('2 soat');
    });
    test('17.5 4 kg necha gramm', () => {
      const s = MathSolver.solve('4 kg necha gramm');
      expect(s?.finalAnswer).toContain('4000 gramm');
    });
    test('17.6 5000 g necha kg', () => {
      const s = MathSolver.solve('5000 g necha kg');
      expect(s?.finalAnswer).toContain('5 kg');
    });
    test('17.7 2 metr necha sm', () => {
      const s = MathSolver.solve('2 metr necha sm');
      expect(s?.finalAnswer).toContain('200 sm');
    });
    test('17.8 150 sm necha metr', () => {
      const s = MathSolver.solve('150 sm necha metr');
      expect(s?.finalAnswer).toContain('1.5 metr');
    });
    test('17.9 3 tonna necha kg', () => {
      const s = MathSolver.solve('3 tonna necha kg');
      expect(s?.finalAnswer).toContain('3000 kg');
    });
    test('17.10 1 sutka necha soat', () => {
      const s = MathSolver.solve('1 sutka necha soat');
      expect(s?.finalAnswer).toContain('24 soat');
    });
    test('17.11 10 km necha metr', () => {
      const s = MathSolver.solve('10 km necha metr');
      expect(s?.finalAnswer).toContain('10000 metr');
    });
    test('17.12 5000 m necha km', () => {
      const s = MathSolver.solve('5000 m necha km');
      expect(s?.finalAnswer).toContain('5 km');
    });
    test('17.13 5 soat necha minut', () => {
      const s = MathSolver.solve('5 soat necha minut');
      expect(s?.finalAnswer).toContain('300 minut');
    });
    test('17.14 180 minut necha soat', () => {
      const s = MathSolver.solve('180 minut necha soat');
      expect(s?.finalAnswer).toContain('3 soat');
    });
    test('17.15 2 kg necha gramm', () => {
      const s = MathSolver.solve('2 kg necha gramm');
      expect(s?.finalAnswer).toContain('2000 gramm');
    });
    test('17.16 Arifmetik progressiya a_1=2, d=3, n=5', () => {
      const s = MathSolver.solve('Arifmetik progressiya a_1=2, d=3, n=5');
      expect(s?.finalAnswer).toContain('a_5 = 14');
    });
    test('17.17 Arifmetik progressiya a_1=1, d=2, n=10', () => {
      const s = MathSolver.solve('Arifmetik progressiya a_1=1, d=2, n=10');
      expect(s?.finalAnswer).toContain('a_10 = 19');
    });
    test('17.18 Arifmetik progressiya a_1=5, d=5, n=6', () => {
      const s = MathSolver.solve('Arifmetik progressiya a_1=5, d=5, n=6');
      expect(s?.finalAnswer).toContain('a_6 = 30');
    });
    test('17.19 Geometrik progressiya b_1=2, q=2, n=4', () => {
      const s = MathSolver.solve('Geometrik progressiya b_1=2, q=2, n=4');
      expect(s?.finalAnswer).toContain('b_4 = 16');
    });
    test('17.20 Geometrik progressiya b_1=3, q=2, n=3', () => {
      const s = MathSolver.solve('Geometrik progressiya b_1=3, q=2, n=3');
      expect(s?.finalAnswer).toContain('b_3 = 12');
    });
    test('17.21 Arifmetik progressiya a_1=10, d=-2, n=4', () => {
      const s = MathSolver.solve('Arifmetik progressiya a_1=10, d=-2, n=4');
      expect(s?.finalAnswer).toContain('a_4 = 4');
    });
    test('17.22 Geometrik progressiya b_1=1, q=3, n=4', () => {
      const s = MathSolver.solve('Geometrik progressiya b_1=1, q=3, n=4');
      expect(s?.finalAnswer).toContain('b_4 = 27');
    });
    test('17.23 Arifmetik progressiya a_1=3, d=4, n=5', () => {
      const s = MathSolver.solve('Arifmetik progressiya a_1=3, d=4, n=5');
      expect(s?.finalAnswer).toContain('a_5 = 19');
    });
    test('17.24 Geometrik progressiya b_1=5, q=2, n=3', () => {
      const s = MathSolver.solve('Geometrik progressiya b_1=5, q=2, n=3');
      expect(s?.finalAnswer).toContain('b_3 = 20');
    });
    test('17.25 Arifmetik progressiya a_1=100, d=-10, n=5', () => {
      const s = MathSolver.solve('Arifmetik progressiya a_1=100, d=-10, n=5');
      expect(s?.finalAnswer).toContain('a_5 = 60');
    });
  });
});
