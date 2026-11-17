export interface MathEvaluation {
  isCorrect: boolean;
  expected: string;
  feedback: string;
}

export class MathEngine {
  /**
   * Normalizes an answer string by trimming, removing whitespace, and converting commas to dots.
   */
  static normalize(str: string): string {
    return str.trim().toLowerCase().replace(/\s+/g, '').replace(',', '.');
  }

  /**
   * Evaluates fraction equality (e.g., 2/4 is equivalent to 1/2).
   */
  static evaluateFraction(input: string, target: string): boolean {
    const parse = (s: string): number | null => {
      const parts = s.split('/');
      if (parts.length === 1) {
        const num = Number(parts[0]);
        return isNaN(num) ? null : num;
      }
      if (parts.length === 2) {
        const num = Number(parts[0]);
        const den = Number(parts[1]);
        if (isNaN(num) || isNaN(den) || den === 0) return null;
        return num / den;
      }
      return null;
    };

    const val1 = parse(this.normalize(input));
    const val2 = parse(this.normalize(target));

    if (val1 === null || val2 === null) return false;
    return Math.abs(val1 - val2) < 0.0001;
  }

  /**
   * Evaluates simple numerical answer or equation solution.
   */
  static evaluateAnswer(submitted: string, expected: string): boolean {
    const cleanSub = this.normalize(submitted);
    const cleanExp = this.normalize(expected);

    if (cleanSub === cleanExp) return true;

    // Check if either is a fraction
    if (cleanSub.includes('/') || cleanExp.includes('/')) {
      return this.evaluateFraction(cleanSub, cleanExp);
    }

    // Check numerical float equality
    const numSub = Number(cleanSub);
    const numExp = Number(cleanExp);
    if (!isNaN(numSub) && !isNaN(numExp)) {
      return Math.abs(numSub - numExp) < 0.0001;
    }

    return false;
  }

  /**
   * Procedural question generator for Kosmik Hisob game.
   */
  static generateSpaceMathQuestion(level: number = 1): {
    id: string;
    prompt: string;
    options: string[];
    correctAnswer: string;
    formulaLatex: string;
    timeLimitSeconds: number;
  } {
    const id = `kosmik-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    if (level === 1) {
      // Simple addition / subtraction (Kids 6-8)
      const a = Math.floor(Math.random() * 15) + 2;
      const b = Math.floor(Math.random() * 15) + 1;
      const isAdd = Math.random() > 0.4;
      const prompt = isAdd ? `${a} + ${b} = ?` : `${a + b} - ${b} = ?`;
      const correct = isAdd ? a + b : a;

      const wrong1 = correct + 1;
      const wrong2 = Math.max(1, correct - 2);
      const wrong3 = correct + 3;
      const options = [correct.toString(), wrong1.toString(), wrong2.toString(), wrong3.toString()].sort(
        () => Math.random() - 0.5
      );

      return {
        id,
        prompt,
        options,
        correctAnswer: correct.toString(),
        formulaLatex: isAdd ? `${a} + ${b}` : `${a + b} - ${b}`,
        timeLimitSeconds: 20,
      };
    } else if (level === 2) {
      // Multiplication / Division (Kids 9-12)
      const a = Math.floor(Math.random() * 9) + 2;
      const b = Math.floor(Math.random() * 9) + 2;
      const isMul = Math.random() > 0.5;
      const prompt = isMul ? `${a} × ${b} = ?` : `${a * b} ÷ ${a} = ?`;
      const correct = isMul ? a * b : b;

      const wrong1 = correct + (Math.random() > 0.5 ? 2 : -2);
      const wrong2 = correct + 5;
      const wrong3 = Math.max(1, correct - 4);
      const options = [correct.toString(), wrong1.toString(), wrong2.toString(), wrong3.toString()].sort(
        () => Math.random() - 0.5
      );

      return {
        id,
        prompt,
        options,
        correctAnswer: correct.toString(),
        formulaLatex: isMul ? `${a} \\times ${b}` : `\\frac{${a * b}}{${a}}`,
        timeLimitSeconds: 15,
      };
    } else {
      // Linear equation / Fractions (Teens 13-16)
      const x = Math.floor(Math.random() * 8) + 2;
      const a = Math.floor(Math.random() * 4) + 2;
      const b = Math.floor(Math.random() * 10) + 1;
      const c = a * x + b;
      const prompt = `${a}x + ${b} = ${c}.  x = ?`;
      const correct = x;

      const options = [
        correct.toString(),
        (correct + 1).toString(),
        Math.max(1, correct - 1).toString(),
        (correct + 2).toString(),
      ].sort(() => Math.random() - 0.5);

      return {
        id,
        prompt,
        options,
        correctAnswer: correct.toString(),
        formulaLatex: `${a}x + ${b} = ${c}`,
        timeLimitSeconds: 25,
      };
    }
  }

  /**
   * Procedural question generator for Kasrlar Jangi game.
   */
  static generateFractionBattleQuestion(level: number = 1): {
    id: string;
    levelTitle: string;
    fractionA: { numerator: number; denominator: number; label: string };
    fractionB: { numerator: number; denominator: number; label: string };
    correctOperator: '<' | '=' | '>';
    options: string[];
    explanation: string;
  } {
    const id = `kasr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const fractionsPool = [
      { n: 3, d: 4, l: '3/4' },
      { n: 1, d: 2, l: '1/2' },
      { n: 2, d: 4, l: '2/4' },
      { n: 1, d: 4, l: '1/4' },
      { n: 2, d: 3, l: '2/3' },
      { n: 1, d: 3, l: '1/3' },
      { n: 4, d: 6, l: '4/6' },
      { n: 3, d: 6, l: '3/6' },
      { n: 5, d: 8, l: '5/8' },
      { n: 3, d: 8, l: '3/8' },
    ];

    const idxA = Math.floor(Math.random() * fractionsPool.length);
    let idxB = Math.floor(Math.random() * fractionsPool.length);
    if (Math.random() > 0.3 && idxB === idxA) {
      idxB = (idxA + 1) % fractionsPool.length;
    }

    const fA = fractionsPool[idxA];
    const fB = fractionsPool[idxB];
    const valA = fA.n / fA.d;
    const valB = fB.n / fB.d;

    let correctOperator: '<' | '=' | '>' = '=';
    if (Math.abs(valA - valB) > 0.001) {
      correctOperator = valA > valB ? '>' : '<';
    }

    const levelTitles = [
      '01 • KASRLAR OROLI',
      '02 • KASRLAR BO‘G‘OZI',
      '03 • PIROT KASRLAR',
      '04 • OLTIN QUTI KASRLARI',
    ];
    const levelTitle = levelTitles[(level - 1) % levelTitles.length];

    return {
      id,
      levelTitle,
      fractionA: { numerator: fA.n, denominator: fA.d, label: fA.l },
      fractionB: { numerator: fB.n, denominator: fB.d, label: fB.l },
      correctOperator,
      options: ['<', '=', '>'],
      explanation: `Bo‘laklar soniga emas, ularning umumiy kattaligiga e’tibor bering.`,
    };
  }
}
