import { MathSolver, UzbekMathNLU } from '../src/utils/mathSolver.js';

describe('MathCity AI — 100% Offline Uzbek MathSolver Engine (200+ Unit Tests across 18 Categories)', () => {

  // ==========================================================================
  // Category 0: Uzbek NLU & Number Words (15 Tests)
  // ==========================================================================
  describe('0. O‘zbek Tili NLU va Son So‘zlari', () => {
    test('0.1 bir = 1', () => expect(UzbekMathNLU.wordsToDigits('bir')).toBe('1'));
    test('0.2 besh = 5', () => expect(UzbekMathNLU.wordsToDigits('besh')).toBe('5'));
    test('0.3 o‘n = 10', () => expect(UzbekMathNLU.wordsToDigits('o‘n')).toBe('10'));
    test('0.4 yigirma = 20', () => expect(UzbekMathNLU.wordsToDigits('yigirma')).toBe('20'));
    test('0.5 o‘ttiz besh = 35', () => expect(UzbekMathNLU.wordsToDigits('o‘ttiz besh')).toBe('35'));
    test('0.6 qirq ikki = 42', () => expect(UzbekMathNLU.wordsToDigits('qirq ikki')).toBe('42'));
    test('0.7 ellik = 50', () => expect(UzbekMathNLU.wordsToDigits('ellik')).toBe('50'));
    test('0.8 oltmish to‘rt = 64', () => expect(UzbekMathNLU.wordsToDigits('oltmish to‘rt')).toBe('64'));
    test('0.9 yetmish = 70', () => expect(UzbekMathNLU.wordsToDigits('yetmish')).toBe('70'));
    test('0.10 sakson to‘qqiz = 89', () => expect(UzbekMathNLU.wordsToDigits('sakson to‘qqiz')).toBe('89'));
    test('0.11 to‘qson = 90', () => expect(UzbekMathNLU.wordsToDigits('to‘qson')).toBe('90'));
    test('0.12 bir yuz yigirma uch = 123', () => expect(UzbekMathNLU.wordsToDigits('bir yuz yigirma uch')).toBe('123'));
    test('0.13 yarim = 0.5', () => expect(UzbekMathNLU.wordsToDigits('yarim')).toBe('0.5'));
    test('0.14 chorak = 0.25', () => expect(UzbekMathNLU.wordsToDigits('chorak')).toBe('0.25'));
    test('0.15 apostrof turlari: o‘, o\', o`, oʻ standartlashtiriladi', () => {
      const norm = UzbekMathNLU.normalize("o'n qo‘shuv to`qqiz");
      expect(norm).toContain('10');
      expect(norm).toContain('9');
    });
  });

  // ==========================================================================
  // Category 1: Arifmetika (15 Tests)
  // ==========================================================================
  describe('1. Arifmetika', () => {
    test('1.1 5 + 7', () => {
      const s = MathSolver.solve('5 + 7');
      expect(s?.finalAnswer).toBe('12');
    });
    test('1.2 25 - 13', () => {
      const s = MathSolver.solve('25 - 13');
      expect(s?.finalAnswer).toBe('12');
    });
    test('1.3 6 * 7', () => {
      const s = MathSolver.solve('6 * 7');
      expect(s?.finalAnswer).toBe('42');
    });
    test('1.4 6 × 7 (ko‘paytirish belgisi)', () => {
      const s = MathSolver.solve('6 × 7');
      expect(s?.finalAnswer).toBe('42');
    });
    test('1.5 56 ÷ 8', () => {
      const s = MathSolver.solve('56 ÷ 8');
      expect(s?.finalAnswer).toBe('7');
    });
    test('1.6 100 : 4', () => {
      const s = MathSolver.solve('100 : 4');
      expect(s?.finalAnswer).toBe('25');
    });
    test('1.7 4 ga 5 ni qo‘sh', () => {
      const s = MathSolver.solve('4 ga 5 ni qo‘sh');
      expect(s?.finalAnswer).toBe('9');
    });
    test('1.8 10 dan 3 ni ayir', () => {
      const s = MathSolver.solve('10 dan 3 ni ayir');
      expect(s?.finalAnswer).toBe('7');
    });
    test('1.9 6 bilan 7 ni ko‘paytir', () => {
      const s = MathSolver.solve('6 bilan 7 ni ko‘paytir');
      expect(s?.finalAnswer).toBe('42');
    });
    test('1.10 20 ni 4 ga bo‘l', () => {
      const s = MathSolver.solve('20 ni 4 ga bo‘l');
      expect(s?.finalAnswer).toBe('5');
    });
    test('1.11 nolga bo‘lish xatoligi: 10 / 0', () => {
      const s = MathSolver.solve('10 / 0');
      expect(s?.rawReply).toContain('mumkin emas');
    });
    test('1.12 o‘n beshga yigirmani qo‘sh', () => {
      const s = MathSolver.solve('o‘n beshga yigirmani qo‘sh');
      expect(s?.finalAnswer).toBe('35');
    });
    test('1.13 ellikdan o‘ttizni ayir', () => {
      const s = MathSolver.solve('ellikdan o‘ttizni ayir');
      expect(s?.finalAnswer).toBe('20');
    });
    test('1.14 sakkizni to‘qqizga ko‘paytir', () => {
      const s = MathSolver.solve('sakkizni to‘qqizga ko‘paytir');
      expect(s?.finalAnswer).toBe('72');
    });
    test('1.15 saksonni o‘nga bo‘l', () => {
      const s = MathSolver.solve('saksonni o‘nga bo‘l');
      expect(s?.finalAnswer).toBe('8');
    });
  });

  // ==========================================================================
  // Category 2: Ifoda hisoblash (15 Tests)
  // ==========================================================================
  describe('2. Ifoda hisoblash', () => {
    test('2.1 2 + 3 * 4 = 14', () => {
      const s = MathSolver.solve('2 + 3 * 4');
      expect(s?.finalAnswer).toBe('14');
    });
    test('2.2 (2 + 3) * 4 = 20', () => {
      const s = MathSolver.solve('(2 + 3) * 4');
      expect(s?.finalAnswer).toBe('20');
    });
    test('2.3 50 - (10 + 5) * 2 = 20', () => {
      const s = MathSolver.solve('50 - (10 + 5) * 2');
      expect(s?.finalAnswer).toBe('20');
    });
    test('2.4 100 / (5 * 2) = 10', () => {
      const s = MathSolver.solve('100 / (5 * 2)');
      expect(s?.finalAnswer).toBe('10');
    });
    test('2.5 12 + 4 * (10 - 2 * 3) = 28', () => {
      const s = MathSolver.solve('12 + 4 * (10 - 2 * 3)');
      expect(s?.finalAnswer).toBe('28');
    });
    test('2.6 ((3 + 5) * 2) - 6 = 10', () => {
      const s = MathSolver.solve('((3 + 5) * 2) - 6');
      expect(s?.finalAnswer).toBe('10');
    });
    test('2.7 15 + 25 / 5 = 20', () => {
      const s = MathSolver.solve('15 + 25 / 5');
      expect(s?.finalAnswer).toBe('20');
    });
    test('2.8 4 * 5 + 6 * 7 = 62', () => {
      const s = MathSolver.solve('4 * 5 + 6 * 7');
      expect(s?.finalAnswer).toBe('62');
    });
    test('2.9 (100 - 20) / (8 - 4) = 20', () => {
      const s = MathSolver.solve('(100 - 20) / (8 - 4)');
      expect(s?.finalAnswer).toBe('20');
    });
    test('2.10 30 - 2 * 5 + 8 / 4 = 22', () => {
      const s = MathSolver.solve('30 - 2 * 5 + 8 / 4');
      expect(s?.finalAnswer).toBe('22');
    });
    test('2.11 7 * (8 + 2) - 50 = 20', () => {
      const s = MathSolver.solve('7 * (8 + 2) - 50');
      expect(s?.finalAnswer).toBe('20');
    });
    test('2.12 10 * (15 - 5) / 2 = 50', () => {
      const s = MathSolver.solve('10 * (15 - 5) / 2');
      expect(s?.finalAnswer).toBe('50');
    });
    test('2.13 (4 + 6) * (8 - 3) = 50', () => {
      const s = MathSolver.solve('(4 + 6) * (8 - 3)');
      expect(s?.finalAnswer).toBe('50');
    });
    test('2.14 200 - 50 * 3 + 10 = 60', () => {
      const s = MathSolver.solve('200 - 50 * 3 + 10');
      expect(s?.finalAnswer).toBe('60');
    });
    test('2.15 (12 / 3 + 6) * 5 = 50', () => {
      const s = MathSolver.solve('(12 / 3 + 6) * 5');
      expect(s?.finalAnswer).toBe('50');
    });
  });

  // ==========================================================================
  // Category 3: Chiziqli tenglamalar (15 Tests)
  // ==========================================================================
  describe('3. Chiziqli tenglamalar', () => {
    test('3.1 2x + 5 = 17', () => {
      const s = MathSolver.solve('2x + 5 = 17');
      expect(s?.finalAnswer).toBe('x = 6');
    });
    test('3.2 2x + 6 = 16', () => {
      const s = MathSolver.solve('2x + 6 = 16');
      expect(s?.finalAnswer).toBe('x = 5');
    });
    test('3.3 3x - 9 = 0', () => {
      const s = MathSolver.solve('3x - 9 = 0');
      expect(s?.finalAnswer).toBe('x = 3');
    });
    test('3.4 5x + 10 = 35', () => {
      const s = MathSolver.solve('5x + 10 = 35');
      expect(s?.finalAnswer).toBe('x = 5');
    });
    test('3.5 4x - 8 = 12', () => {
      const s = MathSolver.solve('4x - 8 = 12');
      expect(s?.finalAnswer).toBe('x = 5');
    });
    test('3.6 7x = 49', () => {
      const s = MathSolver.solve('7x = 49');
      expect(s?.finalAnswer).toBe('x = 7');
    });
    test('3.7 x + 15 = 40', () => {
      const s = MathSolver.solve('x + 15 = 40');
      expect(s?.finalAnswer).toBe('x = 25');
    });
    test('3.8 x - 20 = 50', () => {
      const s = MathSolver.solve('x - 20 = 50');
      expect(s?.finalAnswer).toBe('x = 70');
    });
    test('3.9 3x + 12 = x + 24', () => {
      const s = MathSolver.solve('3x + 12 = x + 24');
      expect(s?.finalAnswer).toBe('x = 6');
    });
    test('3.10 5x - 4 = 2x + 11', () => {
      const s = MathSolver.solve('5x - 4 = 2x + 11');
      expect(s?.finalAnswer).toBe('x = 5');
    });
    test('3.11 6x + 3 = 4x + 15', () => {
      const s = MathSolver.solve('6x + 3 = 4x + 15');
      expect(s?.finalAnswer).toBe('x = 6');
    });
    test('3.12 10x - 20 = 5x + 10', () => {
      const s = MathSolver.solve('10x - 20 = 5x + 10');
      expect(s?.finalAnswer).toBe('x = 6');
    });
    test('3.13 2x + 1 = 1', () => {
      const s = MathSolver.solve('2x + 1 = 1');
      expect(s?.finalAnswer).toBe('x = 0');
    });
    test('3.14 -3x + 9 = 0', () => {
      const s = MathSolver.solve('-3x + 9 = 0');
      expect(s?.finalAnswer).toBe('x = 3');
    });
    test('3.15 8x + 16 = 0', () => {
      const s = MathSolver.solve('8x + 16 = 0');
      expect(s?.finalAnswer).toBe('x = -2');
    });
  });

  // ==========================================================================
  // Category 4: Kvadrat tenglamalar (15 Tests)
  // ==========================================================================
  describe('4. Kvadrat tenglamalar', () => {
    test('4.1 x^2 - 5x + 6 = 0', () => {
      const s = MathSolver.solve('x^2 - 5x + 6 = 0');
      expect(s?.finalAnswer).toContain('x_1 = 3');
      expect(s?.finalAnswer).toContain('x_2 = 2');
    });
    test('4.2 x^2 - 7x + 12 = 0', () => {
      const s = MathSolver.solve('x^2 - 7x + 12 = 0');
      expect(s?.finalAnswer).toContain('4');
      expect(s?.finalAnswer).toContain('3');
    });
    test('4.3 x^2 - 4 = 0', () => {
      const s = MathSolver.solve('x^2 - 4 = 0');
      expect(s?.finalAnswer).toContain('2');
      expect(s?.finalAnswer).toContain('-2');
    });
    test('4.4 x^2 - 9 = 0', () => {
      const s = MathSolver.solve('x^2 - 9 = 0');
      expect(s?.finalAnswer).toContain('3');
      expect(s?.finalAnswer).toContain('-3');
    });
    test('4.5 x^2 - 6x + 9 = 0 (bitta ildiz)', () => {
      const s = MathSolver.solve('x^2 - 6x + 9 = 0');
      expect(s?.finalAnswer).toContain('3');
    });
    test('4.6 x^2 + 4x + 4 = 0', () => {
      const s = MathSolver.solve('x^2 + 4x + 4 = 0');
      expect(s?.finalAnswer).toContain('-2');
    });
    test('4.7 x^2 - 8x + 15 = 0', () => {
      const s = MathSolver.solve('x^2 - 8x + 15 = 0');
      expect(s?.finalAnswer).toContain('5');
      expect(s?.finalAnswer).toContain('3');
    });
    test('4.8 2x^2 - 8 = 0', () => {
      const s = MathSolver.solve('2x^2 - 8 = 0');
      expect(s?.finalAnswer).toContain('2');
      expect(s?.finalAnswer).toContain('-2');
    });
    test('4.9 x^2 + 2x - 8 = 0', () => {
      const s = MathSolver.solve('x^2 + 2x - 8 = 0');
      expect(s?.finalAnswer).toContain('2');
      expect(s?.finalAnswer).toContain('-4');
    });
    test('4.10 x^2 - x - 6 = 0', () => {
      const s = MathSolver.solve('x^2 - x - 6 = 0');
      expect(s?.finalAnswer).toContain('3');
      expect(s?.finalAnswer).toContain('-2');
    });
    test('4.11 x^2 + 5x + 6 = 0', () => {
      const s = MathSolver.solve('x^2 + 5x + 6 = 0');
      expect(s?.finalAnswer).toContain('-2');
      expect(s?.finalAnswer).toContain('-3');
    });
    test('4.12 x^2 + x + 5 = 0 (haqiqiy ildiz yo‘q D < 0)', () => {
      const s = MathSolver.solve('x^2 + x + 5 = 0');
      expect(s?.rawReply).toContain('Haqiqiy ildizlarga ega emas');
    });
    test('4.13 x^2 - 16 = 0', () => {
      const s = MathSolver.solve('x^2 - 16 = 0');
      expect(s?.finalAnswer).toContain('4');
      expect(s?.finalAnswer).toContain('-4');
    });
    test('4.14 x^2 - 25 = 0', () => {
      const s = MathSolver.solve('x^2 - 25 = 0');
      expect(s?.finalAnswer).toContain('5');
      expect(s?.finalAnswer).toContain('-5');
    });
    test('4.15 2x^2 - 5x + 2 = 0', () => {
      const s = MathSolver.solve('2x^2 - 5x + 2 = 0');
      expect(s?.finalAnswer).toContain('2');
      expect(s?.finalAnswer).toContain('0.5');
    });
  });

  // ==========================================================================
  // Category 5: Tenglamalar sistemasi (10 Tests)
  // ==========================================================================
  describe('5. Tenglamalar sistemasi', () => {
    test('5.1 x + y = 10, x - y = 2', () => {
      const s = MathSolver.solve('x + y = 10, x - y = 2');
      expect(s?.finalAnswer).toContain('x = 6');
      expect(s?.finalAnswer).toContain('y = 4');
    });
    test('5.2 x + y = 15, x - y = 5', () => {
      const s = MathSolver.solve('x + y = 15, x - y = 5');
      expect(s?.finalAnswer).toContain('x = 10');
      expect(s?.finalAnswer).toContain('y = 5');
    });
    test('5.3 2x + y = 7, x - y = 2', () => {
      const s = MathSolver.solve('2x + y = 7, x - y = 2');
      expect(s?.finalAnswer).toContain('x = 3');
      expect(s?.finalAnswer).toContain('y = 1');
    });
    test('5.4 x + 2y = 8, x - 2y = 0', () => {
      const s = MathSolver.solve('x + 2y = 8, x - 2y = 0');
      expect(s?.finalAnswer).toContain('x = 4');
      expect(s?.finalAnswer).toContain('y = 2');
    });
    test('5.5 3x + y = 11, 2x - y = 4', () => {
      const s = MathSolver.solve('3x + y = 11, 2x - y = 4');
      expect(s?.finalAnswer).toContain('x = 3');
      expect(s?.finalAnswer).toContain('y = 2');
    });
    test('5.6 x + y = 20, x - y = 4', () => {
      const s = MathSolver.solve('x + y = 20, x - y = 4');
      expect(s?.finalAnswer).toContain('x = 12');
      expect(s?.finalAnswer).toContain('y = 8');
    });
    test('5.7 2x + 3y = 12, 2x - 3y = 0', () => {
      const s = MathSolver.solve('2x + 3y = 12, 2x - 3y = 0');
      expect(s?.finalAnswer).toContain('x = 3');
      expect(s?.finalAnswer).toContain('y = 2');
    });
    test('5.8 x + y = 50, x - y = 10', () => {
      const s = MathSolver.solve('x + y = 50, x - y = 10');
      expect(s?.finalAnswer).toContain('x = 30');
      expect(s?.finalAnswer).toContain('y = 20');
    });
    test('5.9 4x + y = 13, 2x - y = 5', () => {
      const s = MathSolver.solve('4x + y = 13, 2x - y = 5');
      expect(s?.finalAnswer).toContain('x = 3');
      expect(s?.finalAnswer).toContain('y = 1');
    });
    test('5.10 x + y = 100, x - y = 20', () => {
      const s = MathSolver.solve('x + y = 100, x - y = 20');
      expect(s?.finalAnswer).toContain('x = 60');
      expect(s?.finalAnswer).toContain('y = 40');
    });
  });

  // ==========================================================================
  // Category 6: Tengsizliklar (10 Tests)
  // ==========================================================================
  describe('6. Tengsizliklar', () => {
    test('6.1 2x + 4 > 10', () => {
      const s = MathSolver.solve('2x + 4 > 10');
      expect(s?.finalAnswer).toContain('x > 3');
    });
    test('6.2 3x - 6 < 9', () => {
      const s = MathSolver.solve('3x - 6 < 9');
      expect(s?.finalAnswer).toContain('x < 5');
    });
    test('6.3 5x + 10 >= 30', () => {
      const s = MathSolver.solve('5x + 10 >= 30');
      expect(s?.finalAnswer).toContain('x >= 4');
    });
    test('6.4 4x - 8 <= 12', () => {
      const s = MathSolver.solve('4x - 8 <= 12');
      expect(s?.finalAnswer).toContain('x <= 5');
    });
    test('6.5 x + 7 > 15', () => {
      const s = MathSolver.solve('x + 7 > 15');
      expect(s?.finalAnswer).toContain('x > 8');
    });
    test('6.6 2x - 3 < 7', () => {
      const s = MathSolver.solve('2x - 3 < 7');
      expect(s?.finalAnswer).toContain('x < 5');
    });
    test('6.7 6x >= 36', () => {
      const s = MathSolver.solve('6x >= 36');
      expect(s?.finalAnswer).toContain('x >= 6');
    });
    test('6.8 x - 5 <= 10', () => {
      const s = MathSolver.solve('x - 5 <= 10');
      expect(s?.finalAnswer).toContain('x <= 15');
    });
    test('6.9 7x + 14 > 49', () => {
      const s = MathSolver.solve('7x + 14 > 49');
      expect(s?.finalAnswer).toContain('x > 5');
    });
    test('6.10 3x + 1 <= 10', () => {
      const s = MathSolver.solve('3x + 1 <= 10');
      expect(s?.finalAnswer).toContain('x <= 3');
    });
  });

  // ==========================================================================
  // Category 7: Kasrlar (15 Tests)
  // ==========================================================================
  describe('7. Kasrlar', () => {
    test('7.1 3/4 + 1/2', () => {
      const s = MathSolver.solve('3/4 + 1/2');
      expect(s?.finalAnswer).toContain('5/4');
      expect(s?.finalAnswer).toContain('1 1/4');
    });
    test('7.2 5/6 - 1/3', () => {
      const s = MathSolver.solve('5/6 - 1/3');
      expect(s?.finalAnswer).toBe('1/2');
    });
    test('7.3 2/3 * 3/4', () => {
      const s = MathSolver.solve('2/3 * 3/4');
      expect(s?.finalAnswer).toBe('1/2');
    });
    test('7.4 3/5 / 2/5', () => {
      const s = MathSolver.solve('3/5 / 2/5');
      expect(s?.finalAnswer).toContain('3/2');
      expect(s?.finalAnswer).toContain('1 1/2');
    });
    test('7.5 1/4 + 2/4', () => {
      const s = MathSolver.solve('1/4 + 2/4');
      expect(s?.finalAnswer).toBe('3/4');
    });
    test('7.6 7/8 - 3/8', () => {
      const s = MathSolver.solve('7/8 - 3/8');
      expect(s?.finalAnswer).toBe('1/2');
    });
    test('7.7 1/2 + 1/3', () => {
      const s = MathSolver.solve('1/2 + 1/3');
      expect(s?.finalAnswer).toBe('5/6');
    });
    test('7.8 2/5 + 1/10', () => {
      const s = MathSolver.solve('2/5 + 1/10');
      expect(s?.finalAnswer).toBe('1/2');
    });
    test('7.9 4/5 * 5/8', () => {
      const s = MathSolver.solve('4/5 * 5/8');
      expect(s?.finalAnswer).toBe('1/2');
    });
    test('7.10 5/7 / 5/14', () => {
      const s = MathSolver.solve('5/7 / 5/14');
      expect(s?.finalAnswer).toBe('2');
    });
    test('7.11 12/16 kasrni qisqartir', () => {
      const s = MathSolver.solve('12/16 kasrni qisqartir');
      expect(s?.finalAnswer).toBe('3/4');
    });
    test('7.12 18/24 kasrni qisqartir', () => {
      const s = MathSolver.solve('18/24 kasrni qisqartir');
      expect(s?.finalAnswer).toBe('3/4');
    });
    test('7.13 25/30 kasrni qisqartir', () => {
      const s = MathSolver.solve('25/30 kasrni qisqartir');
      expect(s?.finalAnswer).toBe('5/6');
    });
    test('7.14 7/4 aralash kasrga aylantir', () => {
      const s = MathSolver.solve('7/4');
      expect(s?.finalAnswer).toContain('1 3/4');
    });
    test('7.15 9/2 aralash kasrga aylantir', () => {
      const s = MathSolver.solve('9/2');
      expect(s?.finalAnswer).toContain('4 1/2');
    });
  });

  // ==========================================================================
  // Category 8: Foiz masalalari (15 Tests)
  // ==========================================================================
  describe('8. Foiz masalalari', () => {
    test('8.1 15 ning 20 foizi', () => {
      const s = MathSolver.solve('15 ning 20 foizi');
      expect(s?.finalAnswer).toBe('3');
    });
    test('8.2 200 ning 15 foizi', () => {
      const s = MathSolver.solve('200 ning 15 foizi');
      expect(s?.finalAnswer).toBe('30');
    });
    test('8.3 50 ning 10%', () => {
      const s = MathSolver.solve('50 ning 10%');
      expect(s?.finalAnswer).toBe('5');
    });
    test('8.4 100 ning 25 foizi', () => {
      const s = MathSolver.solve('100 ning 25 foizi');
      expect(s?.finalAnswer).toBe('25');
    });
    test('8.5 80 ning 50 foizi', () => {
      const s = MathSolver.solve('80 ning 50 foizi');
      expect(s?.finalAnswer).toBe('40');
    });
    test('8.6 40 ning 75 foizi', () => {
      const s = MathSolver.solve('40 ning 75 foizi');
      expect(s?.finalAnswer).toBe('30');
    });
    test('8.7 1000 ning 5 foizi', () => {
      const s = MathSolver.solve('1000 ning 5 foizi');
      expect(s?.finalAnswer).toBe('50');
    });
    test('8.8 60 ning 30 foizi', () => {
      const s = MathSolver.solve('60 ning 30 foizi');
      expect(s?.finalAnswer).toBe('18');
    });
    test('8.9 500 ning 12 foizi', () => {
      const s = MathSolver.solve('500 ning 12 foizi');
      expect(s?.finalAnswer).toBe('60');
    });
    test('8.10 250 ning 20 foizi', () => {
      const s = MathSolver.solve('250 ning 20 foizi');
      expect(s?.finalAnswer).toBe('50');
    });
    test('8.11 120 ning 10 foizi', () => {
      const s = MathSolver.solve('120 ning 10 foizi');
      expect(s?.finalAnswer).toBe('12');
    });
    test('8.12 300 ning 40 foizi', () => {
      const s = MathSolver.solve('300 ning 40 foizi');
      expect(s?.finalAnswer).toBe('120');
    });
    test('8.13 90 ning 50 foizi', () => {
      const s = MathSolver.solve('90 ning 50 foizi');
      expect(s?.finalAnswer).toBe('45');
    });
    test('8.14 70 ning 20 foizi', () => {
      const s = MathSolver.solve('70 ning 20 foizi');
      expect(s?.finalAnswer).toBe('14');
    });
    test('8.15 150 ning 10 foizi', () => {
      const s = MathSolver.solve('150 ning 10 foizi');
      expect(s?.finalAnswer).toBe('15');
    });
  });

  // ==========================================================================
  // Category 9: Daraja va ildiz (15 Tests)
  // ==========================================================================
  describe('9. Daraja va ildiz', () => {
    test('9.1 2^3', () => {
      const s = MathSolver.solve('2^3');
      expect(s?.finalAnswer).toBe('8');
    });
    test('9.2 5^2', () => {
      const s = MathSolver.solve('5^2');
      expect(s?.finalAnswer).toBe('25');
    });
    test('9.3 3^4', () => {
      const s = MathSolver.solve('3^4');
      expect(s?.finalAnswer).toBe('81');
    });
    test('9.4 10^3', () => {
      const s = MathSolver.solve('10^3');
      expect(s?.finalAnswer).toBe('1000');
    });
    test('9.5 4^3', () => {
      const s = MathSolver.solve('4^3');
      expect(s?.finalAnswer).toBe('64');
    });
    test('9.6 sqrt(16)', () => {
      const s = MathSolver.solve('sqrt(16)');
      expect(s?.finalAnswer).toBe('4');
    });
    test('9.7 ildiz(25)', () => {
      const s = MathSolver.solve('ildiz(25)');
      expect(s?.finalAnswer).toBe('5');
    });
    test('9.8 sqrt(49)', () => {
      const s = MathSolver.solve('sqrt(49)');
      expect(s?.finalAnswer).toBe('7');
    });
    test('9.9 sqrt(64)', () => {
      const s = MathSolver.solve('sqrt(64)');
      expect(s?.finalAnswer).toBe('8');
    });
    test('9.10 sqrt(100)', () => {
      const s = MathSolver.solve('sqrt(100)');
      expect(s?.finalAnswer).toBe('10');
    });
    test('9.11 2^5', () => {
      const s = MathSolver.solve('2^5');
      expect(s?.finalAnswer).toBe('32');
    });
    test('9.12 7^2', () => {
      const s = MathSolver.solve('7^2');
      expect(s?.finalAnswer).toBe('49');
    });
    test('9.13 6^2', () => {
      const s = MathSolver.solve('6^2');
      expect(s?.finalAnswer).toBe('36');
    });
    test('9.14 sqrt(81)', () => {
      const s = MathSolver.solve('sqrt(81)');
      expect(s?.finalAnswer).toBe('9');
    });
    test('9.15 sqrt(144)', () => {
      const s = MathSolver.solve('sqrt(144)');
      expect(s?.finalAnswer).toBe('12');
    });
  });

  // ==========================================================================
  // Category 10: EKUB va EKUK (10 Tests)
  // ==========================================================================
  describe('10. EKUB va EKUK', () => {
    test('10.1 EKUB(24, 36)', () => {
      const s = MathSolver.solve('EKUB(24, 36)');
      expect(s?.finalAnswer).toBe('12');
    });
    test('10.2 EKUK(12, 18)', () => {
      const s = MathSolver.solve('EKUK(12, 18)');
      expect(s?.finalAnswer).toBe('36');
    });
    test('10.3 EKUB(15, 25)', () => {
      const s = MathSolver.solve('EKUB(15, 25)');
      expect(s?.finalAnswer).toBe('5');
    });
    test('10.4 EKUK(4, 6)', () => {
      const s = MathSolver.solve('EKUK(4, 6)');
      expect(s?.finalAnswer).toBe('12');
    });
    test('10.5 EKUB(48, 72)', () => {
      const s = MathSolver.solve('EKUB(48, 72)');
      expect(s?.finalAnswer).toBe('24');
    });
    test('10.6 EKUK(15, 20)', () => {
      const s = MathSolver.solve('EKUK(15, 20)');
      expect(s?.finalAnswer).toBe('60');
    });
    test('10.7 EKUB(100, 150)', () => {
      const s = MathSolver.solve('EKUB(100, 150)');
      expect(s?.finalAnswer).toBe('50');
    });
    test('10.8 EKUK(8, 12)', () => {
      const s = MathSolver.solve('EKUK(8, 12)');
      expect(s?.finalAnswer).toBe('24');
    });
    test('10.9 EKUB(17, 19)', () => {
      const s = MathSolver.solve('EKUB(17, 19)');
      expect(s?.finalAnswer).toBe('1');
    });
    test('10.10 EKUK(5, 7)', () => {
      const s = MathSolver.solve('EKUK(5, 7)');
      expect(s?.finalAnswer).toBe('35');
    });
  });

  // ==========================================================================
  // Category 11: Tub sonlar va ko‘paytuvchilar (10 Tests)
  // ==========================================================================
  describe('11. Tub sonlar va ko‘paytuvchilar', () => {
    test('11.1 29 tub sonmi?', () => {
      const s = MathSolver.solve('29 tub sonmi');
      expect(s?.finalAnswer).toContain('Tub son');
    });
    test('11.2 30 tub sonmi?', () => {
      const s = MathSolver.solve('30 tub sonmi');
      expect(s?.finalAnswer).toContain('Murakkab son');
    });
    test('11.3 60 ni tub ko‘paytuvchilarga ajrat', () => {
      const s = MathSolver.solve('60 ni tub ko‘paytuvchilarga ajrat');
      expect(s?.finalAnswer).toContain('2^2 * 3 * 5');
    });
    test('11.4 12 ni tub ko‘paytuvchilarga ajrat', () => {
      const s = MathSolver.solve('12 ni tub ko‘paytuvchilarga ajrat');
      expect(s?.finalAnswer).toContain('2^2 * 3');
    });
    test('11.5 13 tub sonmi?', () => {
      const s = MathSolver.solve('13 tub sonmi');
      expect(s?.finalAnswer).toContain('Tub son');
    });
    test('11.6 49 tub sonmi?', () => {
      const s = MathSolver.solve('49 tub sonmi');
      expect(s?.finalAnswer).toContain('Murakkab son');
    });
    test('11.7 100 ni tub ko‘paytuvchilarga ajrat', () => {
      const s = MathSolver.solve('100 ni tub ko‘paytuvchilarga ajrat');
      expect(s?.finalAnswer).toContain('2^2 * 5^2');
    });
    test('11.8 17 tub sonmi?', () => {
      const s = MathSolver.solve('17 tub sonmi');
      expect(s?.finalAnswer).toContain('Tub son');
    });
    test('11.9 91 tub sonmi?', () => {
      const s = MathSolver.solve('91 tub sonmi');
      expect(s?.finalAnswer).toContain('Murakkab son');
    });
    test('11.10 36 ni tub ko‘paytuvchilarga ajrat', () => {
      const s = MathSolver.solve('36 ni tub ko‘paytuvchilarga ajrat');
      expect(s?.finalAnswer).toContain('2^2 * 3^2');
    });
  });

  // ==========================================================================
  // Category 12: Hosila (10 Tests)
  // ==========================================================================
  describe('12. Hosila', () => {
    test('12.1 (x^2) hosilasi', () => {
      const s = MathSolver.solve('x^2 hosilasi');
      expect(s?.finalAnswer).toContain('2x');
    });
    test('12.2 (x^3) hosilasi', () => {
      const s = MathSolver.solve('x^3 hosilasi');
      expect(s?.finalAnswer).toContain('3x^2');
    });
    test('12.3 (3x^2) hosilasi', () => {
      const s = MathSolver.solve('3x^2 hosilasi');
      expect(s?.finalAnswer).toContain('6x');
    });
    test('12.4 (5x) hosilasi', () => {
      const s = MathSolver.solve('5x hosilasi');
      expect(s?.finalAnswer).toBe('5');
    });
    test('12.5 (x^4) hosilasi', () => {
      const s = MathSolver.solve('x^4 hosilasi');
      expect(s?.finalAnswer).toContain('4x^3');
    });
    test('12.6 (2x^3) hosilasi', () => {
      const s = MathSolver.solve('2x^3 hosilasi');
      expect(s?.finalAnswer).toContain('6x^2');
    });
    test('12.7 (7x) hosilasi', () => {
      const s = MathSolver.solve('7x hosilasi');
      expect(s?.finalAnswer).toBe('7');
    });
    test('12.8 (x^5) hosilasi', () => {
      const s = MathSolver.solve('x^5 hosilasi');
      expect(s?.finalAnswer).toContain('5x^4');
    });
    test('12.9 (4x^2) hosilasi', () => {
      const s = MathSolver.solve('4x^2 hosilasi');
      expect(s?.finalAnswer).toContain('8x');
    });
    test('12.10 (10x) hosilasi', () => {
      const s = MathSolver.solve('10x hosilasi');
      expect(s?.finalAnswer).toBe('10');
    });
  });

  // ==========================================================================
  // Category 13: Integral (10 Tests)
  // ==========================================================================
  describe('13. Integral', () => {
    test('13.1 integral(x)', () => {
      const s = MathSolver.solve('integral(x)');
      expect(s?.finalAnswer).toContain('x^2/2 + C');
    });
    test('13.2 integral(x^2)', () => {
      const s = MathSolver.solve('integral(x^2)');
      expect(s?.finalAnswer).toContain('x^3/3 + C');
    });
    test('13.3 integral(2x)', () => {
      const s = MathSolver.solve('integral(2x)');
      expect(s?.finalAnswer).toContain('x^2 + C');
    });
    test('13.4 integral(3x^2)', () => {
      const s = MathSolver.solve('integral(3x^2)');
      expect(s?.finalAnswer).toContain('x^3 + C');
    });
    test('13.5 integral(5)', () => {
      const s = MathSolver.solve('integral(5)');
      expect(s?.finalAnswer).toContain('5x + C');
    });
    test('13.6 integral(x^3)', () => {
      const s = MathSolver.solve('integral(x^3)');
      expect(s?.finalAnswer).toContain('x^4/4 + C');
    });
    test('13.7 integral(4x^3)', () => {
      const s = MathSolver.solve('integral(4x^3)');
      expect(s?.finalAnswer).toContain('x^4 + C');
    });
    test('13.8 integral(6x)', () => {
      const s = MathSolver.solve('integral(6x)');
      expect(s?.finalAnswer).toContain('3x^2 + C');
    });
    test('13.9 integral(10)', () => {
      const s = MathSolver.solve('integral(10)');
      expect(s?.finalAnswer).toContain('10x + C');
    });
    test('13.10 integral(x^4)', () => {
      const s = MathSolver.solve('integral(x^4)');
      expect(s?.finalAnswer).toContain('x^5/5 + C');
    });
  });

  // ==========================================================================
  // Category 14: Limit (10 Tests)
  // ==========================================================================
  describe('14. Limit', () => {
    test('14.1 lim(2x + 1) as x->3', () => {
      const s = MathSolver.solve('lim (2x + 1) x->3');
      expect(s?.finalAnswer).toBe('7');
    });
    test('14.2 lim(x^2 - 4) as x->2', () => {
      const s = MathSolver.solve('lim (x^2 - 4) x->2');
      expect(s?.finalAnswer).toBe('0');
    });
    test('14.3 lim(3x + 5) as x->0', () => {
      const s = MathSolver.solve('lim (3x + 5) x->0');
      expect(s?.finalAnswer).toBe('5');
    });
    test('14.4 lim(x^2 + 1) as x->4', () => {
      const s = MathSolver.solve('lim (x^2 + 1) x->4');
      expect(s?.finalAnswer).toBe('17');
    });
    test('14.5 lim(5x - 2) as x->2', () => {
      const s = MathSolver.solve('lim (5x - 2) x->2');
      expect(s?.finalAnswer).toBe('8');
    });
    test('14.6 lim(x^3) as x->2', () => {
      const s = MathSolver.solve('lim (x^3) x->2');
      expect(s?.finalAnswer).toBe('8');
    });
    test('14.7 lim(4x) as x->5', () => {
      const s = MathSolver.solve('lim (4x) x->5');
      expect(s?.finalAnswer).toBe('20');
    });
    test('14.8 lim(x + 10) as x->10', () => {
      const s = MathSolver.solve('lim (x + 10) x->10');
      expect(s?.finalAnswer).toBe('20');
    });
    test('14.9 lim(2x^2) as x->3', () => {
      const s = MathSolver.solve('lim (2x^2) x->3');
      expect(s?.finalAnswer).toBe('18');
    });
    test('14.10 lim(x - 7) as x->10', () => {
      const s = MathSolver.solve('lim (x - 7) x->10');
      expect(s?.finalAnswer).toBe('3');
    });
  });

  // ==========================================================================
  // Category 15: Geometriya (12 Tests)
  // ==========================================================================
  describe('15. Geometriya', () => {
    test('15.1 To‘g‘ri to‘rtburchak a=4, b=6 yuzi', () => {
      const s = MathSolver.solve('To‘g‘ri to‘rtburchak a=4, b=6 yuzi');
      expect(s?.finalAnswer).toContain('S = 24');
    });
    test('15.2 To‘g‘ri to‘rtburchak a=5, b=8 perimetri', () => {
      const s = MathSolver.solve('To‘g‘ri to‘rtburchak a=5, b=8 perimetri');
      expect(s?.finalAnswer).toContain('P = 26');
    });
    test('15.3 Kvadrat a=5 yuzi', () => {
      const s = MathSolver.solve('Kvadrat tomoni 5 yuzi');
      expect(s?.finalAnswer).toContain('S = 25');
    });
    test('15.4 Kvadrat a=6 perimetri', () => {
      const s = MathSolver.solve('Kvadrat tomoni 6 perimetri');
      expect(s?.finalAnswer).toContain('P = 24');
    });
    test('15.5 Uchburchak a=6, h=4 yuzi', () => {
      const s = MathSolver.solve('Uchburchak a=6, h=4 yuzi');
      expect(s?.finalAnswer).toContain('S = 12');
    });
    test('15.6 Doira radiusi r=7 yuzi', () => {
      const s = MathSolver.solve('Doira r=7 yuzi');
      expect(s?.finalAnswer).toContain('153.94');
    });
    test('15.7 Doira radiusi r=5 uzunligi', () => {
      const s = MathSolver.solve('Doira r=5 uzunligi');
      expect(s?.finalAnswer).toContain('31.42');
    });
    test('15.8 To‘g‘ri burchakli uchburchak a=3, b=4 gipotenuza', () => {
      const s = MathSolver.solve('Pifagor a=3, b=4 c=?');
      expect(s?.finalAnswer).toContain('c = 5');
    });
    test('15.9 Pifagor a=6, b=8 c=?', () => {
      const s = MathSolver.solve('Pifagor a=6, b=8 c=?');
      expect(s?.finalAnswer).toContain('c = 10');
    });
    test('15.10 Pifagor a=5, b=12 c=?', () => {
      const s = MathSolver.solve('Pifagor a=5, b=12 c=?');
      expect(s?.finalAnswer).toContain('c = 13');
    });
    test('15.11 Kvadrat a=10 yuzi', () => {
      const s = MathSolver.solve('Kvadrat tomoni 10 yuzi');
      expect(s?.finalAnswer).toContain('S = 100');
    });
    test('15.12 To‘g‘ri to‘rtburchak a=10, b=20 yuzi', () => {
      const s = MathSolver.solve('To‘g‘ri to‘rtburchak a=10, b=20 yuzi');
      expect(s?.finalAnswer).toContain('S = 200');
    });
  });

  // ==========================================================================
  // Category 16: Progressiyalar (10 Tests)
  // ==========================================================================
  describe('16. Progressiyalar', () => {
    test('16.1 Arifmetik progressiya a_1=2, d=3, n=5', () => {
      const s = MathSolver.solve('Arifmetik progressiya a_1=2, d=3, n=5');
      expect(s?.finalAnswer).toContain('a_5 = 14');
    });
    test('16.2 Arifmetik progressiya a_1=1, d=2, n=10', () => {
      const s = MathSolver.solve('Arifmetik progressiya a_1=1, d=2, n=10');
      expect(s?.finalAnswer).toContain('a_10 = 19');
    });
    test('16.3 Arifmetik progressiya a_1=5, d=5, n=6', () => {
      const s = MathSolver.solve('Arifmetik progressiya a_1=5, d=5, n=6');
      expect(s?.finalAnswer).toContain('a_6 = 30');
    });
    test('16.4 Geometrik progressiya b_1=2, q=2, n=4', () => {
      const s = MathSolver.solve('Geometrik progressiya b_1=2, q=2, n=4');
      expect(s?.finalAnswer).toContain('b_4 = 16');
    });
    test('16.5 Geometrik progressiya b_1=3, q=2, n=3', () => {
      const s = MathSolver.solve('Geometrik progressiya b_1=3, q=2, n=3');
      expect(s?.finalAnswer).toContain('b_3 = 12');
    });
    test('16.6 Arifmetik progressiya a_1=10, d=-2, n=4', () => {
      const s = MathSolver.solve('Arifmetik progressiya a_1=10, d=-2, n=4');
      expect(s?.finalAnswer).toContain('a_4 = 4');
    });
    test('16.7 Geometrik progressiya b_1=1, q=3, n=4', () => {
      const s = MathSolver.solve('Geometrik progressiya b_1=1, q=3, n=4');
      expect(s?.finalAnswer).toContain('b_4 = 27');
    });
    test('16.8 Arifmetik progressiya a_1=3, d=4, n=5', () => {
      const s = MathSolver.solve('Arifmetik progressiya a_1=3, d=4, n=5');
      expect(s?.finalAnswer).toContain('a_5 = 19');
    });
    test('16.9 Geometrik progressiya b_1=5, q=2, n=3', () => {
      const s = MathSolver.solve('Geometrik progressiya b_1=5, q=2, n=3');
      expect(s?.finalAnswer).toContain('b_3 = 20');
    });
    test('16.10 Arifmetik progressiya a_1=100, d=-10, n=5', () => {
      const s = MathSolver.solve('Arifmetik progressiya a_1=100, d=-10, n=5');
      expect(s?.finalAnswer).toContain('a_5 = 60');
    });
  });

  // ==========================================================================
  // Category 17: Birlik o‘zgartirish (10 Tests)
  // ==========================================================================
  describe('17. Birlik o‘zgartirish', () => {
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
    test('17.7 2 metr necha santimetr', () => {
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
  });

  // ==========================================================================
  // Category 18: Matnli so‘zli masalalar (10 Tests)
  // ==========================================================================
  describe('18. Matnli so‘zli masalalar', () => {
    test('18.1 Mashina 60 km/soat tezlikda 3 soatda qancha masofa bosadi?', () => {
      const s = MathSolver.solve('Mashina 60 km/soat tezlikda 3 soatda qancha masofa yuradi');
      expect(s?.finalAnswer).toContain('180 km');
    });
    test('18.2 Poyezd 240 km masofani 4 soatda bosib o‘tsa, tezligi qancha?', () => {
      const s = MathSolver.solve('Poyezd 240 km masofani 4 soatda bosib o‘tsa tezligi qancha');
      expect(s?.finalAnswer).toContain('60 km/soat');
    });
    test('18.3 Piyoda 15 km masofani 5 km/soat tezlikda necha soatda bosadi?', () => {
      const s = MathSolver.solve('Piyoda 15 km masofani 5 km/soat tezlikda necha soatda o‘tadi');
      expect(s?.finalAnswer).toContain('3 soat');
    });
    test('18.4 Velosipedchi 20 km/soat tezlikda 2 soatda qancha yuradi?', () => {
      const s = MathSolver.solve('Velosipedchi 20 km/soat tezlikda 2 soatda qancha masofa bosadi');
      expect(s?.finalAnswer).toContain('40 km');
    });
    test('18.5 Mashina 300 km masofani 5 soatda bosib o‘tsa, tezligi qancha?', () => {
      const s = MathSolver.solve('Mashina 300 km masofani 5 soatda bosib o‘tsa tezligi');
      expect(s?.finalAnswer).toContain('60 km/soat');
    });
    test('18.6 Samolyot 800 km/soat tezlikda 2 soatda qancha uchadi?', () => {
      const s = MathSolver.solve('Samolyot 800 km/soat tezlikda 2 soatda qancha masofa uchadi');
      expect(s?.finalAnswer).toContain('1600 km');
    });
    test('18.7 Mashina 100 km/soat tezlikda 4 soatda qancha masofa bosadi?', () => {
      const s = MathSolver.solve('Mashina 100 km/soat tezlikda 4 soatda qancha masofa');
      expect(s?.finalAnswer).toContain('400 km');
    });
    test('18.8 180 km masofani 90 km/soat tezlikda necha soatda bosadi?', () => {
      const s = MathSolver.solve('180 km masofani 90 km/soat tezlikda necha soatda bosib o‘tadi');
      expect(s?.finalAnswer).toContain('2 soat');
    });
    test('18.9 500 km masofani 100 km/soat tezlikda necha soatda bosadi?', () => {
      const s = MathSolver.solve('500 km masofani 100 km/soat tezlikda necha soatda');
      expect(s?.finalAnswer).toContain('5 soat');
    });
    test('18.10 Avtobus 50 km/soat tezlikda 6 soatda qancha yo‘l yuradi?', () => {
      const s = MathSolver.solve('Avtobus 50 km/soat tezlikda 6 soatda qancha yo‘l yuradi');
      expect(s?.finalAnswer).toContain('300 km');
    });
  });

  // ==========================================================================
  // Dual-Method Verification & 4-Part Structure (5 Tests)
  // ==========================================================================
  describe('19. Ikki usul bilan tekshirish va Qat’iy 4 qismli format', () => {
    test('19.1 Standart 4 qismli format mavjudligi', () => {
      const s = MathSolver.solve('2x + 6 = 16');
      expect(s?.rawReply).toContain('Tushunganim:');
      expect(s?.rawReply).toContain('Yechish:');
      expect(s?.rawReply).toContain('Javob:');
      expect(s?.rawReply).toContain('Tekshirish:');
    });

    test('19.2 Tenglamani o‘rniga qo‘yish orqali tekshirish', () => {
      const s = MathSolver.solve('3x + 9 = 24');
      expect(s?.verification).toContain('Tekshirish:');
      expect(s?.finalAnswer).toBe('x = 5');
    });

    test('19.3 Arifmetik teskari amal orqali tekshirish', () => {
      const s = MathSolver.solve('45 * 2');
      expect(s?.rawReply).toContain('Tekshirish:');
      expect(s?.finalAnswer).toBe('90');
    });

    test('19.4 Kvadrat tenglamada Vieta formulasi bilan tekshirish', () => {
      const s = MathSolver.solve('x^2 - 5x + 6 = 0');
      expect(s?.verification).toContain('Vieta');
    });

    test('19.5 Tushunilmagan savol uchun null qaytarish va gallyutsinatsiya qilmaslik', () => {
      const s = MathSolver.solve('Bugun havo qanday bo‘ladi?');
      expect(s).toBeNull();
    });
  });

});
