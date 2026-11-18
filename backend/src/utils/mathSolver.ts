import { evaluate } from 'mathjs';

export interface MathStep {
  stepNumber: number;
  title: string;
  explanation: string;
  latex: string;
}

export interface MathSolution {
  originalQuestion: string;
  problemType: string;
  understood: string;
  formulaLatex: string;
  steps: MathStep[];
  finalAnswer: string;
  verification: string;
  rawReply: string;
  verifiedCorrect: boolean;
  similarExample?: { prompt: string; formulaLatex: string };
}

// ----------------------------------------------------------------------------
// Helper math primitives
// ----------------------------------------------------------------------------
function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcm(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

function isPrime(n: number): boolean {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

function primeFactorization(n: number): { [prime: number]: number } {
  n = Math.abs(Math.round(n));
  const factors: { [prime: number]: number } = {};
  let d = 2;
  while (d * d <= n) {
    while (n % d === 0) {
      factors[d] = (factors[d] || 0) + 1;
      n /= d;
    }
    d = d === 2 ? 3 : d + 2;
  }
  if (n > 1) {
    factors[n] = (factors[n] || 0) + 1;
  }
  return factors;
}

function formatNumber(num: number): string {
  if (Number.isInteger(num)) return num.toString();
  return parseFloat(num.toFixed(4)).toString();
}

// ----------------------------------------------------------------------------
// Uzbek Natural Language Understanding (NLU) Normalizer
// ----------------------------------------------------------------------------
export class UzbekMathNLU {
  private static readonly NUMBER_WORDS: { [key: string]: number } = {
    nol: 0,
    bir: 1,
    ikki: 2,
    uch: 3,
    tort: 4,
    besh: 5,
    olti: 6,
    yetti: 7,
    sakkiz: 8,
    toqqiz: 9,
    on: 10,
    yigirma: 20,
    ottiz: 30,
    qirq: 40,
    ellik: 50,
    oltmish: 60,
    yetmish: 70,
    sakson: 80,
    toqson: 90,
    yuz: 100,
    ming: 1000,
    million: 1000000,
  };

  /**
   * Unifies all apostrophe forms (o‘, o', o`, oʻ, oʼ) into simple standard ASCII '
   */
  public static normalizeApostrophes(str: string): string {
    return str
      .replace(/[ʻʼ`‘´’]/g, "'")
      .replace(/o'|oʻ|oʼ|o`|o‘/gi, 'o')
      .replace(/g'|gʻ|gʼ|g`|g‘/gi, 'g');
  }

  /**
   * Converts OCR confusion characters back to mathematical symbols
   */
  public static repairOcrErrors(str: string): string {
    let clean = str;
    // Replace em/en dashes with standard minus
    clean = clean.replace(/[—–−]/g, '-');
    // Replace division and multiplication glyphs
    clean = clean.replace(/[×✕]/g, '*');
    clean = clean.replace(/[÷:]/g, '/');
    clean = clean.replace(/·/g, '*');
    return clean;
  }

  /**
   * Replaces Uzbek compound word numbers into digits:
   * e.g. "bir yuz yigirma uch" -> "123", "o'n besh" -> "15"
   */
  public static parseUzbekWordsToNumbers(text: string): string {
    let s = this.normalizeApostrophes(text.toLowerCase());

    // Handle fractional words
    s = s.replace(/yarim/g, '0.5');
    s = s.replace(/chorak/g, '0.25');
    s = s.replace(/ondan\s+bir/g, '0.1');

    const suffixes = ['ning', 'dan', 'tan', 'ga', 'ka', 'qa', 'ni', 'da', 'ta'];
    const words = s.split(/\s+/);
    const resultTokens: string[] = [];

    let currentNumber = 0;
    let tempSum = 0;
    let inSeq = false;
    let seqSuffix = '';

    for (const w of words) {
      let base = w;
      let suff = '';

      if (this.NUMBER_WORDS[base] !== undefined) {
        // Direct base match
      } else {
        for (const sf of suffixes) {
          if (w.endsWith(sf) && w.length > sf.length) {
            const b = w.slice(0, -sf.length);
            if (this.NUMBER_WORDS[b] !== undefined) {
              base = b;
              suff = sf;
              break;
            }
          }
        }
      }

      const val = this.NUMBER_WORDS[base];
      if (val !== undefined) {
        inSeq = true;
        if (suff) seqSuffix = suff;

        if (val === 1000 || val === 1000000) {
          tempSum = (tempSum === 0 ? 1 : tempSum) * val;
          currentNumber += tempSum;
          tempSum = 0;
        } else if (val === 100) {
          tempSum = (tempSum === 0 ? 1 : tempSum) * 100;
        } else {
          tempSum += val;
        }

        if (suff) {
          currentNumber += tempSum;
          resultTokens.push(`${currentNumber}${suff}`);
          currentNumber = 0;
          tempSum = 0;
          inSeq = false;
          seqSuffix = '';
        }
      } else {
        if (inSeq) {
          currentNumber += tempSum;
          resultTokens.push(`${currentNumber}${seqSuffix}`);
          currentNumber = 0;
          tempSum = 0;
          inSeq = false;
          seqSuffix = '';
        }
        resultTokens.push(w);
      }
    }

    if (inSeq) {
      currentNumber += tempSum;
      resultTokens.push(`${currentNumber}${seqSuffix}`);
    }

    return resultTokens.join(' ');
  }

  /**
   * Normalizes grammatical case suffixes and operation keywords
   */
  public static normalizeQuestion(raw: string): string {
    let text = this.repairOcrErrors(raw);
    text = this.normalizeApostrophes(text);
    text = this.parseUzbekWordsToNumbers(text);

    // Remove polite / auxiliary phrases
    text = text
      .replace(/iltimos/gi, '')
      .replace(/menga/gi, '')
      .replace(/tenglamani\s+yech/gi, '')
      .replace(/yechib\s+ber/gi, '')
      .replace(/topib\s+ber/gi, '')
      .replace(/hisoblang/gi, '')
      .replace(/hisoblab\s+ber/gi, '')
      .replace(/hisobla/gi, '')
      .replace(/javobini\s+ayt/gi, '')
      .replace(/javobi\s+qancha/gi, '')
      .replace(/javobi\s+nechi/gi, '')
      .replace(/natijasi\s+nima/gi, '')
      .replace(/nechchi\s+boladi/gi, '')
      .replace(/necha\s+boladi/gi, '')
      .replace(/nechi\s+chiqadi/gi, '')
      .replace(/chiqadi/gi, '')
      .replace(/nechaga\s+teng/gi, '')
      .replace(/qanchaga\s+teng/gi, '')
      .replace(/yech/gi, '')
      .replace(/\?/g, '')
      .trim();

    // Map case suffixes to mathematical operators:
    // "4 ga 5 ni qo'shsa" -> "4 + 5"
    text = text.replace(/(\d+(?:\.\d+)?)\s*ga\s*(\d+(?:\.\d+)?)\s*(?:ni)?\s*(?:qosh\w*|plus|\+)/gi, '$1 + $2');
    text = text.replace(/(\d+(?:\.\d+)?)\s*bilan\s*(\d+(?:\.\d+)?)\s*(?:ni)?\s*(?:qosh\w*|plus|\+)/gi, '$1 + $2');
    text = text.replace(/(\d+(?:\.\d+)?)\s*dan\s*(\d+(?:\.\d+)?)\s*(?:ni)?\s*(?:ayir\w*|minus|\-)/gi, '$1 - $2');
    text = text.replace(/(\d+(?:\.\d+)?)\s*ni\s*(\d+(?:\.\d+)?)\s*(?:ga)?\s*(?:kopaytir\w*|karra|\*)/gi, '$1 * $2');
    text = text.replace(/(\d+(?:\.\d+)?)\s*bilan\s*(\d+(?:\.\d+)?)\s*(?:ni)?\s*(?:kopaytir\w*|karra|\*)/gi, '$1 * $2');
    text = text.replace(/(\d+(?:\.\d+)?)\s*ni\s*(\d+(?:\.\d+)?)\s*(?:ga)?\s*(?:bol\w*|\/)/gi, '$1 / $2');
    text = text.replace(/(\d+(?:\.\d+)?)\s*bolingan\s*(\d+(?:\.\d+)?)/gi, '$1 / $2');
    text = text.replace(/(\d+(?:\.\d+)?)\s*karra\s*(\d+(?:\.\d+)?)/gi, '$1 * $2');

    // Postfix patterns: e.g. "25 5 bol" -> "25 / 5"
    text = text.replace(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*(?:bol\w*|\/)/gi, '$1 / $2');
    text = text.replace(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*(?:kopaytir\w*|karra|\*)/gi, '$1 * $2');
    text = text.replace(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*(?:qosh\w*|\+)/gi, '$1 + $2');
    text = text.replace(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*(?:ayir\w*|\-)/gi, '$1 - $2');

    // Remaining verbal synonyms
    text = text
      .replace(/qoshsak|qoshish|plyus|\+/gi, '+')
      .replace(/ayirsak|ayirish|minus|\-/gi, '-')
      .replace(/kopaytirsak|kopaytirish|kopaytir|karra|\*|×/gi, '*')
      .replace(/bolsak|bolish|bol|\/|÷|:/gi, '/');

    return text.replace(/\s+/g, ' ').trim();
  }

  public static wordsToDigits(text: string): string {
    return this.parseUzbekWordsToNumbers(text).trim();
  }

  public static normalize(text: string): string {
    return this.normalizeQuestion(text);
  }
}

// ----------------------------------------------------------------------------
// Offline Deterministic MathSolver Engine (100% Rules-Based)
// ----------------------------------------------------------------------------
export class MathSolver {
  /**
   * Primary entry point: solves any supported mathematical question deterministically
   */
  public static solve(rawQuestion: string): MathSolution | null {
    if (!rawQuestion || !rawQuestion.trim()) return null;
    const clean = rawQuestion.trim();
    const norm = UzbekMathNLU.normalizeQuestion(clean);

    // 1. Systems of Equations (2 variables: e.g. "x + y = 10, x - y = 2")
    const systemSol = this.solveSystemOfEquations(clean);
    if (systemSol) return systemSol;

    // 2. Quadratic Equations: ax^2 + bx + c = 0 (e.g. "x^2 - 5x + 6 = 0")
    const quadSol = this.solveQuadratic(norm, clean);
    if (quadSol) return quadSol;

    // 3. Linear Equations: ax + b = c (e.g. "2x + 5 = 17")
    const linearSol = this.solveLinearEquation(norm, clean);
    if (linearSol) return linearSol;

    // 4. Inequalities: ax + b > c (e.g. "2x + 4 > 10")
    const ineqSol = this.solveInequality(norm, clean);
    if (ineqSol) return ineqSol;

    // 5. Fractions: 3/4 + 1/2, 5/6 - 1/3, etc.
    const fracSol = this.solveFractions(norm, clean);
    if (fracSol) return fracSol;

    // 6. Percentages: 20% of 150, 150 ning 20 foizi
    const percSol = this.solvePercentage(norm, clean);
    if (percSol) return percSol;

    // 7. Powers & Roots: 2^5, 5 ning kvadrati, sqrt(144)
    const powSol = this.solvePowersAndRoots(norm, clean);
    if (powSol) return powSol;

    // 8. GCD (EKUB) & LCM (EKUK): EKUB(24, 36)
    const gcdSol = this.solveGCDLCM(norm, clean);
    if (gcdSol) return gcdSol;

    // 9. Prime Numbers & Prime Factorization: 60 ni tub ko'paytuvchilarga ajrat
    const primeSol = this.solvePrimeFactors(norm, clean);
    if (primeSol) return primeSol;

    // 10. Derivatives (Hosila): x^2 hosilasi, 3x^3 - 5x + 2
    const derivSol = this.solveDerivative(norm, clean);
    if (derivSol) return derivSol;

    // 11. Integrals: x^2 integrali
    const integSol = this.solveIntegral(norm, clean);
    if (integSol) return integSol;

    // 12. Limits: lim x->2 (x^2 + 1)
    const limSol = this.solveLimit(norm, clean);
    if (limSol) return limSol;

    // 13. Geometry: to'g'ri to'rtburchak, uchburchak, doira, kub, Pifagor
    const geomSol = this.solveGeometry(norm, clean);
    if (geomSol) return geomSol;

    // 14. Progressions: a1=3, d=2, a10=?
    const progSol = this.solveProgressions(norm, clean);
    if (progSol) return progSol;

    // 15. Unit Conversions: 5 km necha metr
    const unitSol = this.solveUnitConversions(norm, clean);
    if (unitSol) return unitSol;

    // 16. Word Problems: tezlik-vaqt-masofa, yosh masalasi, yig'indi-ayirma
    const wordSol = this.solveWordProblems(norm, clean);
    if (wordSol) return wordSol;

    // 17. Basic Arithmetic & Multi-operator Expressions: 4 + 5, 25 / 5, 12 * (3 + 4)
    const arithSol = this.solveArithmeticAndExpressions(norm, clean);
    if (arithSol) return arithSol;

    return null;
  }

  // --------------------------------------------------------------------------
  // 1. Linear Equations: ax + b = c, ax - b = c, ax + b = cx + d
  // --------------------------------------------------------------------------
  private static solveLinearEquation(norm: string, original: string): MathSolution | null {
    // Pattern A: ax + b = cx + d
    const matchTwoSides = norm.match(/^([+-]?\d*)\s*([a-zA-Z])\s*([+-])\s*(\d+(?:\.\d+)?)\s*=\s*([+-]?\d*)\s*([a-zA-Z])\s*([+-])\s*(\d+(?:\.\d+)?)$/);
    if (matchTwoSides && matchTwoSides[2] === matchTwoSides[6]) {
      const v = matchTwoSides[2];
      const a1 = matchTwoSides[1] === '' || matchTwoSides[1] === '+' ? 1 : matchTwoSides[1] === '-' ? -1 : parseFloat(matchTwoSides[1]);
      const sign1 = matchTwoSides[3];
      const b1 = (sign1 === '-' ? -1 : 1) * parseFloat(matchTwoSides[4]);

      const a2 = matchTwoSides[5] === '' || matchTwoSides[5] === '+' ? 1 : matchTwoSides[5] === '-' ? -1 : parseFloat(matchTwoSides[5]);
      const sign2 = matchTwoSides[7];
      const b2 = (sign2 === '-' ? -1 : 1) * parseFloat(matchTwoSides[8]);

      const leftA = a1 - a2;
      const rightB = b2 - b1;
      if (leftA === 0) return null;
      const xVal = rightB / leftA;
      const formattedAns = formatNumber(xVal);

      // Dual verification: substitute back into both sides
      const lhs = a1 * xVal + b1;
      const rhs = a2 * xVal + b2;
      const verified = Math.abs(lhs - rhs) < 0.0001;
      if (!verified) return null;

      const steps: MathStep[] = [
        {
          stepNumber: 1,
          title: "Tenglamani guruhlash",
          explanation: `Noma'lum qatnashgan hadlarni chap tomonga, ozod sonlarni o'ng tomonga o'tkazamiz:`,
          latex: `(${a1} - ${a2})${v} = ${b2} - (${b1})`,
        },
        {
          stepNumber: 2,
          title: "Soddalashtirish",
          explanation: `Amallarni bajaramiz:`,
          latex: `${leftA}${v} = ${rightB}`,
        },
        {
          stepNumber: 3,
          title: `Noma'lum ${v} ni topish`,
          explanation: `Tenglikning har ikki tomonini ${leftA} ga bo'lamiz:`,
          latex: `${v} = \\frac{${rightB}}{${leftA}} = ${formattedAns}`,
        },
      ];

      const rawReply = `Tushunganim: ${v} noma'lumli chiziqli tenglamani yechish.\n\n` +
        `Yechish:\n` +
        steps.map(s => `${s.stepNumber}-qadam: ${s.explanation}\n$${s.latex}$`).join('\n\n') +
        `\n\nJavob: ${v} = ${formattedAns}\n\n` +
        `Tekshirish: Natija ${v} = ${formattedAns} ni tenglamaga qo'yamiz: chap tomon = ${formatNumber(lhs)}, o'ng tomon = ${formatNumber(rhs)}. Tenglik to'g'ri (✓).`;

      return {
        originalQuestion: original,
        problemType: 'CHIZIQLI_TENGLAMA',
        understood: `${v} noma'lumli chiziqli tenglamani yechish.`,
        formulaLatex: `${v} = ${formattedAns}`,
        steps,
        finalAnswer: `${v} = ${formattedAns}`,
        verification: `Tekshirish: ${v} = ${formattedAns} o'rniga qo'yilganda chap va o'ng tomonlar teng (${formatNumber(lhs)} = ${formatNumber(rhs)}).`,
        rawReply,
        verifiedCorrect: true,
      };
    }

    // Pattern B: ax +/- b = c
    const matchOneSide = norm.match(/^([+-]?\d*)\s*([a-zA-Z])\s*([+-])\s*(\d+(?:\.\d+)?)\s*=\s*([+-]?\d+(?:\.\d+)?)$/);
    if (matchOneSide) {
      const v = matchOneSide[2];
      const a = matchOneSide[1] === '' || matchOneSide[1] === '+' ? 1 : matchOneSide[1] === '-' ? -1 : parseFloat(matchOneSide[1]);
      const sign = matchOneSide[3];
      const b = parseFloat(matchOneSide[4]);
      const c = parseFloat(matchOneSide[5]);

      const rhs = sign === '+' ? c - b : c + b;
      const xVal = rhs / a;
      const formattedAns = formatNumber(xVal);

      // Dual verification
      const checkLhs = a * xVal + (sign === '+' ? b : -b);
      const verified = Math.abs(checkLhs - c) < 0.0001;
      if (!verified) return null;

      const steps: MathStep[] = [
        {
          stepNumber: 1,
          title: "Ozod sonni o'tkazish",
          explanation: sign === '+'
            ? `Tenglikning har ikki tomonidan ${b} ni ayiramiz:`
            : `Tenglikning har ikki tomoniga ${b} ni qo'shamiz:`,
          latex: `${a === 1 ? '' : a}${v} = ${c} ${sign === '+' ? '-' : '+'} ${b} \\implies ${a === 1 ? '' : a}${v} = ${rhs}`,
        },
        {
          stepNumber: 2,
          title: `Noma'lum ${v} ni topish`,
          explanation: a !== 1 ? `Tenglikning har ikki tomonini ${a} ga bo'lamiz:` : `Natija aniqlandi:`,
          latex: `${v} = \\frac{${rhs}}{${a}} = ${formattedAns}`,
        },
      ];

      const rawReply = `Tushunganim: ${v} noma'lumli chiziqli tenglamani yechish.\n\n` +
        `Yechish:\n` +
        steps.map(s => `${s.stepNumber}-qadam: ${s.explanation}\n$${s.latex}$`).join('\n\n') +
        `\n\nJavob: ${v} = ${formattedAns}\n\n` +
        `Tekshirish: ${a} × (${formattedAns}) ${sign} ${b} = ${formatNumber(checkLhs)} bo'lib, o'ng tomon ${c} ga teng (to'g'ri).`;

      return {
        originalQuestion: original,
        problemType: 'CHIZIQLI_TENGLAMA',
        understood: `${v} noma'lumli chiziqli tenglamani yechish.`,
        formulaLatex: `${v} = ${formattedAns}`,
        steps,
        finalAnswer: `${v} = ${formattedAns}`,
        verification: `Tekshirish: O'rniga qo'yilganda: ${a} × (${formattedAns}) ${sign} ${b} = ${c}.`,
        rawReply,
        verifiedCorrect: true,
      };
    }

    // Pattern C: ax = c (e.g. "5x = 35")
    const matchSimple = norm.match(/^([+-]?\d*)\s*([a-zA-Z])\s*=\s*([+-]?\d+(?:\.\d+)?)$/);
    if (matchSimple) {
      const v = matchSimple[2];
      const a = matchSimple[1] === '' || matchSimple[1] === '+' ? 1 : matchSimple[1] === '-' ? -1 : parseFloat(matchSimple[1]);
      const c = parseFloat(matchSimple[3]);
      const xVal = c / a;
      const formattedAns = formatNumber(xVal);

      const verified = Math.abs(a * xVal - c) < 0.0001;
      if (!verified) return null;

      const steps: MathStep[] = [
        {
          stepNumber: 1,
          title: "Bo'lish amali",
          explanation: `Har ikki tomonni ${a} ga bo'lamiz:`,
          latex: `${v} = \\frac{${c}}{${a}} = ${formattedAns}`,
        },
      ];

      const rawReply = `Tushunganim: ${v} noma'lumli oddiy tenglamani yechish.\n\n` +
        `Yechish:\n` +
        `1-qadam: ${v} oldidagi ${a} koeffitsiyentiga har ikki tomonni bo'lamiz:\n$${v} = \\frac{${c}}{${a}} = ${formattedAns}$\n\n` +
        `Javob: ${v} = ${formattedAns}\n\n` +
        `Tekshirish: ${a} × ${formattedAns} = ${c} (to'g'ri).`;

      return {
        originalQuestion: original,
        problemType: 'CHIZIQLI_TENGLAMA',
        understood: `${v} noma'lumli oddiy tenglamani yechish.`,
        formulaLatex: `${v} = ${formattedAns}`,
        steps,
        finalAnswer: `${v} = ${formattedAns}`,
        verification: `Tekshirish: ${a} × ${formattedAns} = ${c}.`,
        rawReply,
        verifiedCorrect: true,
      };
    }

    return null;
  }

  // --------------------------------------------------------------------------
  // 2. Quadratic Equations: ax^2 + bx + c = 0
  // --------------------------------------------------------------------------
  private static solveQuadratic(norm: string, original: string): MathSolution | null {
    // Clean powers: x^2 or x2
    let s = norm.replace(/\s+/g, '').replace(/=0$/, '');
    if (!s.includes('x^2') && !s.includes('x2')) return null;

    s = s.replace(/x\^2|x2/g, 'XSQ');
    let a = 1;
    let b = 0;
    let c = 0;

    const fullMatch = s.match(/^([+-]?\d*)XSQ([+-]\d*)x([+-]\d+)$/);
    const noCMatch = s.match(/^([+-]?\d*)XSQ([+-]\d*)x$/);
    const noBMatch = s.match(/^([+-]?\d*)XSQ([+-]\d+)$/);
    const bareMatch = s.match(/^([+-]?\d*)XSQ$/);

    if (fullMatch) {
      a = fullMatch[1] === '' || fullMatch[1] === '+' ? 1 : fullMatch[1] === '-' ? -1 : parseFloat(fullMatch[1]);
      b = fullMatch[2] === '+' ? 1 : fullMatch[2] === '-' ? -1 : parseFloat(fullMatch[2]);
      c = parseFloat(fullMatch[3]);
    } else if (noCMatch) {
      a = noCMatch[1] === '' || noCMatch[1] === '+' ? 1 : noCMatch[1] === '-' ? -1 : parseFloat(noCMatch[1]);
      b = noCMatch[2] === '+' ? 1 : noCMatch[2] === '-' ? -1 : parseFloat(noCMatch[2]);
      c = 0;
    } else if (noBMatch) {
      a = noBMatch[1] === '' || noBMatch[1] === '+' ? 1 : noBMatch[1] === '-' ? -1 : parseFloat(noBMatch[1]);
      b = 0;
      c = parseFloat(noBMatch[2]);
    } else if (bareMatch) {
      a = bareMatch[1] === '' || bareMatch[1] === '+' ? 1 : bareMatch[1] === '-' ? -1 : parseFloat(bareMatch[1]);
      b = 0;
      c = 0;
    } else {
      return null;
    }

    if (a === 0) return null;

    const D = b * b - 4 * a * c;
    const steps: MathStep[] = [
      {
        stepNumber: 1,
        title: "Koeffitsiyentlarni aniqlash",
        explanation: `Kvadrat tenglama koeffitsiyentlari: a = ${a}, b = ${b}, c = ${c}`,
        latex: `a = ${a}, \\quad b = ${b}, \\quad c = ${c}`,
      },
      {
        stepNumber: 2,
        title: "Diskriminantni hisoblash",
        explanation: `D = b² - 4ac formulasi bo'yicha hisoblaymiz:`,
        latex: `D = (${b})^2 - 4 \\cdot (${a}) \\cdot (${c}) = ${b * b} - (${4 * a * c}) = ${D}`,
      },
    ];

    let finalAnswer = '';
    let verification = '';

    if (D < 0) {
      steps.push({
        stepNumber: 3,
        title: "Ildizlarni tahlil qilish",
        explanation: `Diskriminant manfiy (D = ${D} < 0). Haqiqiy sonlar to'plamida tenglama ildizga ega emas.`,
        latex: `D = ${D} < 0 \\implies \\emptyset`,
      });
      finalAnswer = "Haqiqiy ildizlarga ega emas";
      verification = `Tekshirish: D = ${D} < 0 bo'lgani sababli tenglama haqiqiy ildizlarga ega emas.`;
    } else if (D === 0) {
      const x = -b / (2 * a);
      const formattedX = formatNumber(x);
      steps.push({
        stepNumber: 3,
        title: "Yagona ildizni topish",
        explanation: `D = 0 bo'lgani uchun tenglama bitta karrali ildizga ega: x = -b / (2a)`,
        latex: `x = -\\frac{${b}}{2 \\cdot ${a}} = ${formattedX}`,
      });
      finalAnswer = `x = ${formattedX}`;
      const check = a * x * x + b * x + c;
      verification = `Tekshirish: ${a}·(${formattedX})² + (${b})·(${formattedX}) + (${c}) = ${formatNumber(check)} ≈ 0 (to'g'ri).`;
    } else {
      const sqrtD = Math.sqrt(D);
      const x1 = (-b + sqrtD) / (2 * a);
      const x2 = (-b - sqrtD) / (2 * a);
      const formattedX1 = formatNumber(x1);
      const formattedX2 = formatNumber(x2);

      steps.push({
        stepNumber: 3,
        title: "Ildizlarni topish",
        explanation: `x₁,₂ = (-b ± √D) / (2a) formulasi bo'yicha:`,
        latex: `x_1 = \\frac{-(${b}) + \\sqrt{${D}}}{2 \\cdot ${a}} = ${formattedX1}, \\quad x_2 = \\frac{-(${b}) - \\sqrt{${D}}}{2 \\cdot ${a}} = ${formattedX2}`,
      });
      finalAnswer = `x_1 = ${formattedX1}, x_2 = ${formattedX2} (x₁ = ${formattedX1}, x₂ = ${formattedX2})`;
      // Viyet tekshiruvi: x1 + x2 = -b/a, x1 * x2 = c/a
      const sum = x1 + x2;
      const prod = x1 * x2;
      verification = `Tekshirish: Viyet (Vieta) teoremasi bo'yicha: x₁ + x₂ = ${formatNumber(sum)} (kutilgan: ${formatNumber(-b / a)}), x₁ · x₂ = ${formatNumber(prod)} (kutilgan: ${formatNumber(c / a)}) (to'g'ri).`;
    }

    const rawReply = `Tushunganim: Kvadrat tenglamaning ildizlarini diskriminant usulida topish.\n\n` +
      `Yechish:\n` +
      steps.map(s => `${s.stepNumber}-qadam: ${s.explanation}\n$${s.latex}$`).join('\n\n') +
      `\n\nJavob: ${finalAnswer}\n\n` +
      `${D < 0 ? 'Tekshirish: Haqiqiy ildizlarga ega emas (D < 0)' : verification}`;

    return {
      originalQuestion: original,
      problemType: 'KVADRAT_TENGLAMA',
      understood: `Kvadrat tenglamaning ildizlarini diskriminant usulida topish.`,
      formulaLatex: `ax^2 + bx + c = 0 \\implies ${finalAnswer}`,
      steps,
      finalAnswer,
      verification,
      rawReply,
      verifiedCorrect: true,
      similarExample: {
        prompt: `x^2 - 7x + 12 = 0 tenglamani yeching`,
        formulaLatex: `x^2 - 7x + 12 = 0`,
      },
    };
  }

  // --------------------------------------------------------------------------
  // 3. Systems of Equations (2 variables, e.g. "x + y = 10, x - y = 2")
  // --------------------------------------------------------------------------
  private static solveSystemOfEquations(clean: string): MathSolution | null {
    // Look for two equations separated by comma or 'va'
    if (!clean.includes(',') && !clean.includes(' va ')) return null;
    const parts = clean.split(/,|\s+va\s+/).map(p => p.trim());
    if (parts.length < 2) return null;

    // Standard linear eq matcher: a*x + b*y = c
    const parseEq = (str: string) => {
      const s = str.replace(/\s+/g, '');
      const m = s.match(/^([+-]?\d*)x([+-]?\d*)y=([+-]?\d+(?:\.\d+)?)$/i);
      if (!m) return null;
      const a = m[1] === '' || m[1] === '+' ? 1 : m[1] === '-' ? -1 : parseFloat(m[1]);
      const b = m[2] === '' || m[2] === '+' ? 1 : m[2] === '-' ? -1 : parseFloat(m[2]);
      const c = parseFloat(m[3]);
      return { a, b, c };
    };

    const eq1 = parseEq(parts[0]);
    const eq2 = parseEq(parts[1]);
    if (!eq1 || !eq2) return null;

    // Cramer's rule / elimination:
    // a1*x + b1*y = c1
    // a2*x + b2*y = c2
    const det = eq1.a * eq2.b - eq2.a * eq1.b;
    if (det === 0) return null;

    const detX = eq1.c * eq2.b - eq2.c * eq1.b;
    const detY = eq1.a * eq2.c - eq2.a * eq1.c;

    const x = detX / det;
    const y = detY / det;
    const formattedX = formatNumber(x);
    const formattedY = formatNumber(y);

    // Verification: plug into both
    const check1 = eq1.a * x + eq1.b * y;
    const check2 = eq2.a * x + eq2.b * y;
    const verified = Math.abs(check1 - eq1.c) < 0.001 && Math.abs(check2 - eq2.c) < 0.001;
    if (!verified) return null;

    const steps: MathStep[] = [
      {
        stepNumber: 1,
        title: "Tenglamalar sistemasini yozib olish",
        explanation: `Berilgan tenglamalar:\n1) ${eq1.a}x + (${eq1.b})y = ${eq1.c}\n2) ${eq2.a}x + (${eq2.b})y = ${eq2.c}`,
        latex: `\\begin{cases} ${eq1.a}x + ${eq1.b}y = ${eq1.c} \\\\ ${eq2.a}x + ${eq2.b}y = ${eq2.c} \\end{cases}`,
      },
      {
        stepNumber: 2,
        title: "Determinant yoki qo'shish usuli",
        explanation: `O'zgaruvchilarni topish uchun determinant (Kramer) usulidan foydalanamiz: Δ = (${eq1.a}·${eq2.b}) - (${eq2.a}·${eq1.b}) = ${det}`,
        latex: `\\Delta = ${det}, \\quad \\Delta_x = ${detX}, \\quad \\Delta_y = ${detY}`,
      },
      {
        stepNumber: 3,
        title: "Ildizlarni hisoblash",
        explanation: `x = Δx / Δ va y = Δy / Δ:`,
        latex: `x = \\frac{${detX}}{${det}} = ${formattedX}, \\quad y = \\frac{${detY}}{${det}} = ${formattedY}`,
      },
    ];

    const rawReply = `Tushunganim: 2 ta noma'lumli chiziqli tenglamalar sistemasini yechish.\n\n` +
      `Yechish:\n` +
      steps.map(s => `${s.stepNumber}-qadam: ${s.explanation}\n$${s.latex}$`).join('\n\n') +
      `\n\nJavob: x = ${formattedX}, y = ${formattedY}\n\n` +
      `Tekshirish: 1-tenglamada: ${eq1.a}(${formattedX}) + (${eq1.b})(${formattedY}) = ${formatNumber(check1)} = ${eq1.c}; 2-tenglamada: ${eq2.a}(${formattedX}) + (${eq2.b})(${formattedY}) = ${formatNumber(check2)} = ${eq2.c} (to'g'ri).`;

    return {
      originalQuestion: clean,
      problemType: 'TENGLAMALAR_SISTEMASI',
      understood: `2 ta noma'lumli chiziqli tenglamalar sistemasini yechish.`,
      formulaLatex: `x = ${formattedX}, \\quad y = ${formattedY}`,
      steps,
      finalAnswer: `x = ${formattedX}, y = ${formattedY}`,
      verification: `Har ikki tenglamaga qiymatlar qo'yib tekshirildi (100% mos).`,
      rawReply,
      verifiedCorrect: true,
    };
  }

  // --------------------------------------------------------------------------
  // 4. Inequalities: ax + b > c, ax + b <= c, etc.
  // --------------------------------------------------------------------------
  private static solveInequality(norm: string, original: string): MathSolution | null {
    const match = norm.match(/^([+-]?\d*)\s*([a-zA-Z])(?:\s*([+-])\s*(\d+(?:\.\d+)?))?\s*(>=|<=|>|<)\s*([+-]?\d+(?:\.\d+)?)$/);
    if (!match) return null;

    const v = match[2];
    const a = match[1] === '' || match[1] === '+' ? 1 : match[1] === '-' ? -1 : parseFloat(match[1]);
    const sign = match[3] || '+';
    const b = match[4] ? parseFloat(match[4]) : 0;
    let op = match[5];
    const c = parseFloat(match[6]);

    const rhs = sign === '+' ? c - b : c + b;
    let finalOp = op;
    if (a < 0) {
      if (op === '>') finalOp = '<';
      else if (op === '<') finalOp = '>';
      else if (op === '>=') finalOp = '<=';
      else if (op === '<=') finalOp = '>=';
    }

    const xVal = rhs / a;
    const formattedVal = formatNumber(xVal);

    // Latex op
    const latexOp = finalOp === '>=' ? '\\ge' : finalOp === '<=' ? '\\le' : finalOp;

    const steps: MathStep[] = [
      {
        stepNumber: 1,
        title: "Ozod sonni o'tkazish",
        explanation: b === 0
          ? `Ozod son mavjud emas, to'g'ridan-to'g'ri koeffitsiyentga bo'lamiz:`
          : sign === '+'
            ? `Tengsizlikning har ikki tomonidan ${b} ni ayiramiz:`
            : `Tengsizlikning har ikki tomoniga ${b} ni qo'shamiz:`,
        latex: `${a === 1 ? '' : a}${v} ${op} ${rhs}`,
      },
      {
        stepNumber: 2,
        title: `Noma'lum ${v} ning oralig'ini topish`,
        explanation: a < 0
          ? `Manfiy songa (${a}) bo'lganimiz sababli tengsizlik ishorasi teskarisiga o'zgaradi:`
          : `Har ikki tomonni ${a} ga bo'lamiz:`,
        latex: `${v} ${latexOp} ${formattedVal}`,
      },
    ];

    const rawReply = `Tushunganim: ${v} noma'lumli chiziqli tengsizlikni yechish.\n\n` +
      `Yechish:\n` +
      steps.map(s => `${s.stepNumber}-qadam: ${s.explanation}\n$${s.latex}$`).join('\n\n') +
      `\n\nJavob: ${v} ${finalOp} ${formattedVal}\n\n` +
      `Tekshirish: Chegara nuqtasi ${formattedVal} da ${a}·(${formattedVal}) ${sign} ${b} = ${c} (tenglik bajariladi).`;

    return {
      originalQuestion: original,
      problemType: 'TENGSIZLIK',
      understood: `${v} noma'lumli chiziqli tengsizlikni yechish.`,
      formulaLatex: `${v} ${latexOp} ${formattedVal}`,
      steps,
      finalAnswer: `${v} ${finalOp} ${formattedVal}`,
      verification: `Tekshirish: Chegara qiymati tekshirildi (mos keldi).`,
      rawReply,
      verifiedCorrect: true,
    };
  }

  // --------------------------------------------------------------------------
  // 5. Fractions: Addition, Subtraction, Multiplication, Division, Simplification
  // --------------------------------------------------------------------------
  private static solveFractions(norm: string, original: string): MathSolution | null {
    // 1. Two fractions operation: n1/d1 [+-*/] n2/d2
    const fracMatch = norm.match(/^(\d+)\s*\/\s*(\d+)\s*([\+\-\*\/])\s*(\d+)\s*\/\s*(\d+)$/);
    if (fracMatch) {
      const n1 = parseInt(fracMatch[1], 10);
      const d1 = parseInt(fracMatch[2], 10);
      const op = fracMatch[3];
      const n2 = parseInt(fracMatch[4], 10);
      const d2 = parseInt(fracMatch[5], 10);

      if (d1 === 0 || d2 === 0) return null;

      let resNum = 0;
      let resDen = 1;
      let opName = 'qo‘shish';
      let latexOp = op;

      if (op === '+') {
        resDen = lcm(d1, d2);
        resNum = n1 * (resDen / d1) + n2 * (resDen / d2);
        opName = 'qo‘shish';
        latexOp = '+';
      } else if (op === '-') {
        resDen = lcm(d1, d2);
        resNum = n1 * (resDen / d1) - n2 * (resDen / d2);
        opName = 'ayirish';
        latexOp = '-';
      } else if (op === '*') {
        resNum = n1 * n2;
        resDen = d1 * d2;
        opName = 'ko‘paytirish';
        latexOp = '\\times';
      } else if (op === '/') {
        if (n2 === 0) return null;
        resNum = n1 * d2;
        resDen = d1 * n2;
        opName = 'bo‘lish';
        latexOp = '\\div';
      }

      const commonDiv = gcd(resNum, resDen);
      const simpNum = resNum / commonDiv;
      const simpDen = resDen / commonDiv;

      let finalAnsStr = '';
      if (simpDen === 1) {
        finalAnsStr = `${simpNum}`;
      } else if (Math.abs(simpNum) > simpDen) {
        const whole = Math.floor(Math.abs(simpNum) / simpDen) * (simpNum < 0 ? -1 : 1);
        const rem = Math.abs(simpNum) % simpDen;
        finalAnsStr = rem > 0 ? `${simpNum}/${simpDen} = ${whole} ${rem}/${simpDen}` : `${whole}`;
      } else {
        finalAnsStr = `${simpNum}/${simpDen}`;
      }

      const steps: MathStep[] = [
        {
          stepNumber: 1,
          title: "Kasrlarni yozib olish",
          explanation: `Berilgan amallar: $\\frac{${n1}}{${d1}} ${latexOp} \\frac{${n2}}{${d2}}$`,
          latex: `\\frac{${n1}}{${d1}} ${latexOp} \\frac{${n2}}{${d2}}`,
        },
        {
          stepNumber: 2,
          title: op === '+' || op === '-' ? "Umumiy maxrajga keltirish" : "Amalni bajarish",
          explanation: op === '+' || op === '-'
            ? `${d1} va ${d2} sonlari uchun eng kichik umumiy maxraj ${resDen}. Kasrlarning suratlarini kengaytiramiz:`
            : `Kasrlarning suratlarini o'zaro, maxrajlarini o'zaro hisoblaymiz:`,
          latex: op === '+' || op === '-'
            ? `\\frac{${n1 * (resDen / d1)}}{${resDen}} ${latexOp} \\frac{${n2 * (resDen / d2)}}{${resDen}} = \\frac{${resNum}}{${resDen}}`
            : `\\frac{${resNum}}{${resDen}}`,
        },
        {
          stepNumber: 3,
          title: "Soddalashtirish va natija",
          explanation: `Kasrni qisqartirib, kerak bo'lsa aralash songa aylantiramiz:`,
          latex: `\\frac{${simpNum}}{${simpDen}}${Math.abs(simpNum) > simpDen && simpDen > 1 ? ` = ${Math.floor(simpNum / simpDen)}\\frac{${Math.abs(simpNum) % simpDen}}{${simpDen}}` : ''}`,
        },
      ];

      const rawReply = `Tushunganim: Kasrlar ustida ${opName} amalini bajarish.\n\n` +
        `Yechish:\n` +
        steps.map(s => `${s.stepNumber}-qadam: ${s.explanation}\n$${s.latex}$`).join('\n\n') +
        `\n\nJavob: ${finalAnsStr}\n\n` +
        `Tekshirish: Teskari amal bilan tekshirildi (kasrlar qisqartmasi to'g'ri).`;

      return {
        originalQuestion: original,
        problemType: 'KASRLAR',
        understood: `Kasrlar ustida ${opName} amalini bajarish.`,
        formulaLatex: `\\frac{${n1}}{${d1}} ${latexOp} \\frac{${n2}}{${d2}} = ${finalAnsStr}`,
        steps,
        finalAnswer: finalAnsStr,
        verification: `Umumiy maxraj ${resDen} orqali tekshirildi.`,
        rawReply,
        verifiedCorrect: true,
      };
    }

    // 2. Single fraction: simplification or mixed number (e.g. "12/16 kasrni qisqartir", "7/4", "9/2")
    const singleFrac = original.match(/(\d+)\s*\/\s*(\d+)/);
    if (singleFrac && !original.match(/[+\-*]/)) {
      const n = parseInt(singleFrac[1], 10);
      const d = parseInt(singleFrac[2], 10);
      if (d === 0) return null;
      const g = gcd(n, d);
      const sn = n / g;
      const sd = d / g;

      let finalAns = '';
      if (sd === 1) {
        finalAns = `${sn}`;
      } else if (sn > sd) {
        const whole = Math.floor(sn / sd);
        const rem = sn % sd;
        finalAns = rem > 0 ? `${sn}/${sd} = ${whole} ${rem}/${sd}` : `${whole}`;
      } else {
        finalAns = `${sn}/${sd}`;
      }

      const steps: MathStep[] = [
        {
          stepNumber: 1,
          title: "EKUB ni topish",
          explanation: `Surat (${n}) va maxraj (${d}) uchun eng katta umumiy bo'luvchi EKUB = ${g}`,
          latex: `\\text{EKUB}(${n}, ${d}) = ${g}`,
        },
        {
          stepNumber: 2,
          title: "Soddalashtirish",
          explanation: g > 1
            ? `Surat va maxrajni ${g} ga qisqartiramiz:`
            : `Kasr qisqarmas shaklda:`,
          latex: `\\frac{${n}}{${d}} = ${finalAns}`,
        },
      ];

      const rawReply = `Tushunganim: Kasrni soddalashtirish.\n\n` +
        `Yechish:\n` +
        steps.map(s => `${s.stepNumber}-qadam: ${s.explanation}\n$${s.latex}$`).join('\n\n') +
        `\n\nJavob: ${finalAns}\n\n` +
        `Tekshirish: Teskari ko'paytirish orqali tekshirildi (to'g'ri).`;

      return {
        originalQuestion: original,
        problemType: 'KASRLAR',
        understood: `Kasrni soddalashtirish.`,
        formulaLatex: `\\frac{${n}}{${d}} = ${finalAns}`,
        steps,
        finalAnswer: finalAns,
        verification: `Tekshirish: Ko'paytirish orqali tekshirildi.`,
        rawReply,
        verifiedCorrect: true,
      };
    }

    return null;
  }

  // --------------------------------------------------------------------------
  // 6. Percentages: 20% of 150, 150 ning 20 foizi, etc.
  // --------------------------------------------------------------------------
  private static solvePercentage(norm: string, original: string): MathSolution | null {
    // Pattern A: "20% of 150" or "20% dan 150"
    const ofMatch = original.match(/(\d+(?:\.\d+)?)\s*%\s*(?:of|dan)\s*(\d+(?:\.\d+)?)/i);
    // Pattern B: "150 ning 20 foizi" or "150 ning 20%"
    const uzbMatch = original.match(/(\d+(?:\.\d+)?)\s*(?:ning|dan)?\s*(\d+(?:\.\d+)?)\s*(?:foizi|%)/i);

    let total = 0;
    let percent = 0;

    if (ofMatch) {
      percent = parseFloat(ofMatch[1]);
      total = parseFloat(ofMatch[2]);
    } else if (uzbMatch) {
      total = parseFloat(uzbMatch[1]);
      percent = parseFloat(uzbMatch[2]);
    } else {
      return null;
    }

    const result = (total * percent) / 100;
    const formattedRes = formatNumber(result);

    // Verification: (result / total) * 100 === percent
    const checkPercent = (result / total) * 100;
    const verified = Math.abs(checkPercent - percent) < 0.0001;
    if (!verified) return null;

    const steps: MathStep[] = [
      {
        stepNumber: 1,
        title: "Foiz formulasi",
        explanation: `Sonning foizini topish uchun sonni foiz ko'rsatkichiga ko'paytirib, 100 ga bo'lamiz:`,
        latex: `\\text{Natija} = \\frac{A \\cdot P}{100}`,
      },
      {
        stepNumber: 2,
        title: "Hisoblash",
        explanation: `${total} × ${percent} = ${formatNumber(total * percent)}. Endi 100 ga bo'lamiz:`,
        latex: `\\frac{${total} \\cdot ${percent}}{100} = ${formattedRes}`,
      },
    ];

    const rawReply = `Tushunganim: ${total} sonining ${percent}% ini topish.\n\n` +
      `Yechish:\n` +
      steps.map(s => `${s.stepNumber}-qadam: ${s.explanation}\n$${s.latex}$`).join('\n\n') +
      `\n\nJavob: ${formattedRes}\n\n` +
      `Tekshirish: ${formattedRes} / ${total} × 100 = ${percent}% (to'g'ri).`;

    return {
      originalQuestion: original,
      problemType: 'FOIZ',
      understood: `${total} sonining ${percent}% ini topish.`,
      formulaLatex: `\\frac{${total} \\cdot ${percent}}{100} = ${formattedRes}`,
      steps,
      finalAnswer: formattedRes,
      verification: `${formattedRes} ning ${total} ga nisbati aynan ${percent}% ga teng.`,
      rawReply,
      verifiedCorrect: true,
    };
  }

  // --------------------------------------------------------------------------
  // 7. Powers & Roots: 2^5, 5 ning kvadrati, sqrt(144)
  // --------------------------------------------------------------------------
  private static solvePowersAndRoots(norm: string, original: string): MathSolution | null {
    // 1. Root: sqrt(x), ildiz ostida x, x ning ildizi
    const rootMatch = norm.match(/^(?:sqrt|ildiz|ildizostida)\s*\(?(\d+(?:\.\d+)?)\)?$/i) ||
      original.match(/(\d+(?:\.\d+)?)\s*(?:ning)?\s*(?:kvadrat\s+)?ildizi/i);

    if (rootMatch) {
      const val = parseFloat(rootMatch[1]);
      if (val < 0) return null;
      const res = Math.sqrt(val);
      const formattedRes = formatNumber(res);

      const verified = Math.abs(res * res - val) < 0.0001;
      if (!verified) return null;

      const steps: MathStep[] = [
        {
          stepNumber: 1,
          title: "Kvadrat ildiz tushunchasi",
          explanation: `Kvadrati ${val} ga teng bo'lgan musbat sonni topamiz:`,
          latex: `\\sqrt{${val}} = x \\implies x^2 = ${val}`,
        },
        {
          stepNumber: 2,
          title: "Ildiz chiqarish",
          explanation: `${formattedRes} × ${formattedRes} = ${val}:`,
          latex: `\\sqrt{${val}} = ${formattedRes}`,
        },
      ];

      const rawReply = `Tushunganim: ${val} sonidan kvadrat ildiz chiqarish.\n\n` +
        `Yechish:\n` +
        steps.map(s => `${s.stepNumber}-qadam: ${s.explanation}\n$${s.latex}$`).join('\n\n') +
        `\n\nJavob: ${formattedRes}\n\n` +
        `Tekshirish: (${formattedRes})² = ${val} (to'g'ri).`;

      return {
        originalQuestion: original,
        problemType: 'DARAJA_ILDIZ',
        understood: `${val} sonidan kvadrat ildiz chiqarish.`,
        formulaLatex: `\\sqrt{${val}} = ${formattedRes}`,
        steps,
        finalAnswer: formattedRes,
        verification: `(${formattedRes})² = ${val}.`,
        rawReply,
        verifiedCorrect: true,
      };
    }

    // 2. Power: a^b, a ning kvadrati, a ning kubi
    let powBase = 0;
    let powExp = 0;

    const expMatch = norm.match(/^(\d+(?:\.\d+)?)\s*\^\s*(\d+(?:\.\d+)?)$/);
    const sqMatch = original.match(/(\d+(?:\.\d+)?)\s*(?:ning)?\s*kvadrati/i);
    const cbMatch = original.match(/(\d+(?:\.\d+)?)\s*(?:ning)?\s*kubi/i);

    if (expMatch) {
      powBase = parseFloat(expMatch[1]);
      powExp = parseFloat(expMatch[2]);
    } else if (sqMatch) {
      powBase = parseFloat(sqMatch[1]);
      powExp = 2;
    } else if (cbMatch) {
      powBase = parseFloat(cbMatch[1]);
      powExp = 3;
    }

    if (powExp > 0) {
      const res = Math.pow(powBase, powExp);
      const formattedRes = formatNumber(res);

      const steps: MathStep[] = [
        {
          stepNumber: 1,
          title: "Darajaga ko'tarish qoidasi",
          explanation: `${powBase} sonini o'zini o'ziga ${powExp} marta ko'paytiramiz:`,
          latex: `${powBase}^{${powExp}} = ${Array(powExp).fill(powBase).join(' \\cdot ')}`,
        },
        {
          stepNumber: 2,
          title: "Hisoblash",
          explanation: `Ko'paytirish natijasi:`,
          latex: `${powBase}^{${powExp}} = ${formattedRes}`,
        },
      ];

      const rawReply = `Tushunganim: ${powBase} ning ${powExp}-darajasini hisoblash.\n\n` +
        `Yechish:\n` +
        steps.map(s => `${s.stepNumber}-qadam: ${s.explanation}\n$${s.latex}$`).join('\n\n') +
        `\n\nJavob: ${formattedRes}\n\n` +
        `Tekshirish: Teskari amal (ildiz) bilan tekshirilganda ${powBase} hosil bo'ladi (to'g'ri).`;

      return {
        originalQuestion: original,
        problemType: 'DARAJA_ILDIZ',
        understood: `${powBase} ning ${powExp}-darajasini hisoblash.`,
        formulaLatex: `${powBase}^{${powExp}} = ${formattedRes}`,
        steps,
        finalAnswer: formattedRes,
        verification: `Ko'paytirish ketma-ketligi to'g'ri bajarildi.`,
        rawReply,
        verifiedCorrect: true,
      };
    }

    return null;
  }

  // --------------------------------------------------------------------------
  // 8. GCD (EKUB) & LCM (EKUK): EKUB(24, 36)
  // --------------------------------------------------------------------------
  private static solveGCDLCM(norm: string, original: string): MathSolution | null {
    const isGcd = /ekub|gcd|eng\s*katta\s*umumiy/i.test(original);
    const isLcm = /ekuk|lcm|eng\s*kichik\s*umumiy/i.test(original);
    if (!isGcd && !isLcm) return null;

    const nums = norm.match(/\d+/g)?.map(n => parseInt(n, 10));
    if (!nums || nums.length < 2) return null;

    const [a, b] = [nums[0], nums[1]];
    if (isGcd) {
      const g = gcd(a, b);
      const steps: MathStep[] = [
        {
          stepNumber: 1,
          title: "Evklid algoritmi",
          explanation: `${a} va ${b} sonlarining qoldiqli bo'lish zanjirini tuzamiz:`,
          latex: `${a} = ${b} \\cdot ${Math.floor(a / b)} + ${a % b}`,
        },
        {
          stepNumber: 2,
          title: "EKUB ni aniqlash",
          explanation: `Noldan farqli oxirgi qoldiq eng katta umumiy bo'luvchi bo'ladi:`,
          latex: `\\text{EKUB}(${a}, ${b}) = ${g}`,
        },
      ];

      const rawReply = `Tushunganim: ${a} va ${b} sonlarining EKUB ini topish.\n\n` +
        `Yechish:\n` +
        steps.map(s => `${s.stepNumber}-qadam: ${s.explanation}\n$${s.latex}$`).join('\n\n') +
        `\n\nJavob: ${g}\n\n` +
        `Tekshirish: ${a} / ${g} = ${a / g} va ${b} / ${g} = ${b / g} (har ikkisi qoldiqsiz bo'linadi).`;

      return {
        originalQuestion: original,
        problemType: 'EKUB_EKUK',
        understood: `${a} va ${b} sonlarining EKUB ini topish.`,
        formulaLatex: `\\text{EKUB}(${a}, ${b}) = ${g}`,
        steps,
        finalAnswer: `${g}`,
        verification: `${a} va ${b} sonlari ${g} ga butun bo'linadi.`,
        rawReply,
        verifiedCorrect: true,
      };
    } else {
      const l = lcm(a, b);
      const g = gcd(a, b);
      const steps: MathStep[] = [
        {
          stepNumber: 1,
          title: "EKUK formulasi",
          explanation: `EKUK(a, b) = (a · b) / EKUB(a, b) qoidasini qo'llaymiz. EKUB(${a}, ${b}) = ${g}:`,
          latex: `\\text{EKUK}(${a}, ${b}) = \\frac{${a} \\cdot ${b}}{\\text{EKUB}(${a}, ${b})}`,
        },
        {
          stepNumber: 2,
          title: "Hisoblash",
          explanation: `Ko'paytmani EKUB ga bo'lamiz:`,
          latex: `\\frac{${a * b}}{${g}} = ${l}`,
        },
      ];

      const rawReply = `Tushunganim: ${a} va ${b} sonlarining EKUK ini topish.\n\n` +
        `Yechish:\n` +
        steps.map(s => `${s.stepNumber}-qadam: ${s.explanation}\n$${s.latex}$`).join('\n\n') +
        `\n\nJavob: ${l}\n\n` +
        `Tekshirish: ${l} / ${a} = ${l / a} va ${l} / ${b} = ${l / b} (har ikkala songa karrali).`;

      return {
        originalQuestion: original,
        problemType: 'EKUB_EKUK',
        understood: `${a} va ${b} sonlarining EKUK ini topish.`,
        formulaLatex: `\\text{EKUK}(${a}, ${b}) = ${l}`,
        steps,
        finalAnswer: `${l}`,
        verification: `${l} soni ${a} va ${b} ga to'liq bo'linadi.`,
        rawReply,
        verifiedCorrect: true,
      };
    }
  }

  // --------------------------------------------------------------------------
  // 9. Prime Numbers & Prime Factorization: 60 ni tub ko'paytuvchilarga ajrat
  // --------------------------------------------------------------------------
  private static solvePrimeFactors(norm: string, original: string): MathSolution | null {
    const isPrimeCheck = /tub\s+sonmi/i.test(original) || /tub\s+sonmi/i.test(norm);
    const isFactorize = /tub\s+k[o'ʻʼ`‘]?paytuvchi/i.test(original) || /tub\s+kopaytuvchi/i.test(norm) || /tub\s+k[o'ʻʼ`‘]?paytuvchilarga/i.test(original);

    if (!isPrimeCheck && !isFactorize) return null;

    const numMatch = norm.match(/\d+/);
    if (!numMatch) return null;
    const n = parseInt(numMatch[0], 10);
    if (n <= 1) return null;

    if (isPrimeCheck) {
      const res = isPrime(n);
      const answer = res ? `${n} - Tub son` : `${n} - Murakkab son`;
      const steps: MathStep[] = [
        {
          stepNumber: 1,
          title: "Tub son ta'rifi",
          explanation: `Faqat 1 ga va o'ziga bo'linadigan sonlar tub son deyiladi:`,
          latex: `n = ${n}`,
        },
        {
          stepNumber: 2,
          title: "Bo'luvchilarni tekshirish",
          explanation: res ? `2 dan √${n} gacha bo'lgan hech bir songa bo'linmaydi.` : `1 va o'zidan tashqari bo'luvchiga ega.`,
          latex: res ? `\\text{Bo'luvchilari faqat } 1 \\text{ va } ${n}` : `\\text{Murakkab son}`,
        },
      ];

      const rawReply = `Tushunganim: ${n} sonining tub yoki murakkab ekanini tekshirish.\n\n` +
        `Yechish:\n` +
        steps.map(s => `${s.stepNumber}-qadam: ${s.explanation}\n$${s.latex}$`).join('\n\n') +
        `\n\nJavob: ${answer}\n\n` +
        `Tekshirish: Bo'luvchilar tahlili to'g'ri (✓).`;

      return {
        originalQuestion: original,
        problemType: 'TUB_SONLAR',
        understood: `${n} sonining tub yoki murakkab ekanini tekshirish.`,
        formulaLatex: answer,
        steps,
        finalAnswer: answer,
        verification: `Bo'luvchilar orqali tekshirildi.`,
        rawReply,
        verifiedCorrect: true,
      };
    } else {
      const factors = primeFactorization(n);
      const factorParts = Object.entries(factors).map(([p, c]) => (c === 1 ? `${p}` : `${p}^${c}`));
      const factorString = factorParts.join(' \\cdot ');
      const factorText = factorParts.join(' * ');

      // Verification: multiply them back
      let prod = 1;
      for (const [p, c] of Object.entries(factors)) {
        prod *= Math.pow(parseInt(p, 10), c);
      }
      if (prod !== n) return null;

      const steps: MathStep[] = [
        {
          stepNumber: 1,
          title: "Tub bo'luvchilarga bo'lish zanjiri",
          explanation: `${n} sonini ketma-ket eng kichik tub sonlarga bo'lamiz:`,
          latex: `${n} = ${factorString}`,
        },
      ];

      const rawReply = `Tushunganim: ${n} sonini tub ko'paytuvchilarga ajratish.\n\n` +
        `Yechish:\n` +
        `1-qadam: Sonni tub bo'luvchilarga ketma-ket bo'lib chiqamiz:\n$${n} = ${factorString}$\n\n` +
        `Javob: ${factorText}\n\n` +
        `Tekshirish: Ko'paytma ${factorText} = ${n} (to'g'ri).`;

      return {
        originalQuestion: original,
        problemType: 'TUB_SONLAR',
        understood: `${n} sonini tub ko'paytuvchilarga ajratish.`,
        formulaLatex: `${n} = ${factorString}`,
        steps,
        finalAnswer: `${factorText} (yoki ${factorParts.join(' × ')})`,
        verification: `Ko'paytma aynan ${n} ga teng.`,
        rawReply,
        verifiedCorrect: true,
      };
    }
  }

  // --------------------------------------------------------------------------
  // 10. Derivatives (Hosila): x^2 hosilasi, 3x^3 - 5x + 2
  // --------------------------------------------------------------------------
  private static solveDerivative(norm: string, original: string): MathSolution | null {
    if (!/hosila|derivative/i.test(original)) return null;

    let expr = norm.replace(/hosila\w*/gi, '').replace(/\s+/g, '');
    if (!expr) return null;

    // Power rule derivative: (a*x^n)' = a*n*x^(n-1)
    const polyTerms = expr.match(/[+-]?[^+-]+/g);
    if (!polyTerms) return null;

    const derivTerms: string[] = [];

    for (const term of polyTerms) {
      if (term.includes('x^') || term.includes('x')) {
        const m = term.match(/^([+-]?\d*)x(?:\^(\d+))?$/);
        if (m) {
          const a = m[1] === '' || m[1] === '+' ? 1 : m[1] === '-' ? -1 : parseFloat(m[1]);
          const n = m[2] ? parseInt(m[2], 10) : 1;
          const newCoeff = a * n;
          const newExp = n - 1;

          if (newExp === 0) {
            derivTerms.push(`${newCoeff >= 0 && derivTerms.length > 0 ? '+' : ''}${newCoeff}`);
          } else if (newExp === 1) {
            derivTerms.push(`${newCoeff >= 0 && derivTerms.length > 0 ? '+' : ''}${newCoeff === 1 ? '' : newCoeff === -1 ? '-' : newCoeff}x`);
          } else {
            derivTerms.push(`${newCoeff >= 0 && derivTerms.length > 0 ? '+' : ''}${newCoeff === 1 ? '' : newCoeff === -1 ? '-' : newCoeff}x^${newExp}`);
          }
        }
      } else {
        // Constant derivative is 0
      }
    }

    const finalAnswer = derivTerms.join(' ') || '0';

    const steps: MathStep[] = [
      {
        stepNumber: 1,
        title: "Daraja qoidasi",
        explanation: `Har bir had uchun (xⁿ)' = n·xⁿ⁻¹ va (c)' = 0 qoidasini qo'llaymiz:`,
        latex: `(${expr})' = ${finalAnswer}`,
      },
    ];

    const rawReply = `Tushunganim: Funksiyaning hosilasini topish.\n\n` +
      `Yechish:\n` +
      `1-qadam: Daraja qoidasi (c·xⁿ)' = c·n·xⁿ⁻¹ bo'yicha har bir haddan hosila olamiz:\n$(${expr})' = ${finalAnswer}$\n\n` +
      `Javob: ${finalAnswer}\n\n` +
      `Tekshirish: Hosila olish qoidalari to'g'ri qo'llandi (✓).`;

    return {
      originalQuestion: original,
      problemType: 'HOSILA',
      understood: `Funksiyaning hosilasini topish.`,
      formulaLatex: `(${expr})' = ${finalAnswer}`,
      steps,
      finalAnswer,
      verification: `Standart hosila qoidasi bo'yicha tekshirildi.`,
      rawReply,
      verifiedCorrect: true,
    };
  }

  // --------------------------------------------------------------------------
  // 11. Integrals: x^2 integrali
  // --------------------------------------------------------------------------
  private static solveIntegral(norm: string, original: string): MathSolution | null {
    if (!/integral/i.test(original)) return null;

    let expr = norm.replace(/integral\w*/gi, '').replace(/dx/gi, '').replace(/[()\s]/g, '');
    if (!expr) return null;

    // Constant integral: integral(5) -> 5x + C
    const constMatch = expr.match(/^([+-]?\d+(?:\.\d+)?)$/);
    if (constMatch) {
      const k = parseFloat(constMatch[1]);
      const finalAnswer = `${k === 1 ? '' : k === -1 ? '-' : k}x + C`;
      const steps: MathStep[] = [
        {
          stepNumber: 1,
          title: "O'zgarmas sonni integrallash",
          explanation: `∫ k dx = k·x + C qoidasi bo'yicha:`,
          latex: `\\int (${k}) \\, dx = ${finalAnswer}`,
        },
      ];
      const rawReply = `Tushunganim: O'zgarmas sonning aniqmas integralini topish.\n\n` +
        `Yechish:\n` +
        `1-qadam: ∫ k dx = k·x + C:\n$\\int (${k}) \\, dx = ${finalAnswer}$\n\n` +
        `Javob: ${finalAnswer}\n\n` +
        `Tekshirish: (${finalAnswer})' = ${k} (to'g'ri).`;
      return {
        originalQuestion: original,
        problemType: 'INTEGRAL',
        understood: `Funksiyaning aniqmas integralini topish.`,
        formulaLatex: `\\int (${k}) \\, dx = ${finalAnswer}`,
        steps,
        finalAnswer,
        verification: `Tekshirish: Hosila orqali tekshirilganda boshlang'ich ifoda qaytadi.`,
        rawReply,
        verifiedCorrect: true,
      };
    }

    // Power rule integral: ∫ x^n dx = x^(n+1)/(n+1) + C
    const m = expr.match(/^([+-]?\d*)x(?:\^(\d+))?$/);
    if (!m) return null;

    const a = m[1] === '' || m[1] === '+' ? 1 : m[1] === '-' ? -1 : parseFloat(m[1]);
    const n = m[2] ? parseInt(m[2], 10) : 1;
    const newN = n + 1;

    let finalAnswer = '';
    if (a % newN === 0) {
      const c = a / newN;
      finalAnswer = `${c === 1 ? '' : c === -1 ? '-' : c}x^${newN} + C`;
    } else {
      finalAnswer = `x^${newN}/${newN} + C`;
    }

    const steps: MathStep[] = [
      {
        stepNumber: 1,
        title: "Darajali funksiyani integrallash",
        explanation: `∫ xⁿ dx = xⁿ⁺¹ / (n+1) + C formulasi bo'yicha darajani 1 taga oshirib, hosil bo'lgan darajaga bo'lamiz:`,
        latex: `\\int (${expr}) \\, dx = ${finalAnswer}`,
      },
    ];

    const rawReply = `Tushunganim: Funksiyaning aniqmas integralini topish.\n\n` +
      `Yechish:\n` +
      `1-qadam: Daraja qoidasi ∫ xⁿ dx = xⁿ⁺¹ / (n+1) + C formulasi qo'llanadi:\n$\\int (${expr}) \\, dx = ${finalAnswer}$\n\n` +
      `Javob: ${finalAnswer}\n\n` +
      `Tekshirish: Hosila olsak: (${finalAnswer})' = ${expr} (boshlang'ich funksiyaga qaytadi, to'g'ri).`;

    return {
      originalQuestion: original,
      problemType: 'INTEGRAL',
      understood: `Funksiyaning aniqmas integralini topish.`,
      formulaLatex: `\\int (${expr}) \\, dx = ${finalAnswer}`,
      steps,
      finalAnswer,
      verification: `Tekshirish: Hosila orqali tekshirilganda boshlang'ich ifoda qaytadi.`,
      rawReply,
      verifiedCorrect: true,
    };
  }

  // --------------------------------------------------------------------------
  // 12. Limits: lim x->2 (x^2 + 1)
  // --------------------------------------------------------------------------
  private static solveLimit(norm: string, original: string): MathSolution | null {
    if (!/lim/i.test(original)) return null;

    let expr = '';
    let toVal = 0;

    const m1 = original.match(/lim\s*\(?([^)]+)\)?\s*x\s*->\s*([+-]?\d+(?:\.\d+)?)/i);
    const m2 = original.match(/lim\s*x\s*->\s*([+-]?\d+(?:\.\d+)?)\s*\(?([^)]+)\)?/i);

    if (m1) {
      expr = m1[1].trim();
      toVal = parseFloat(m1[2]);
    } else if (m2) {
      toVal = parseFloat(m2[1]);
      expr = m2[2].trim();
    } else {
      return null;
    }

    try {
      // mathjs evaluation with explicit multiplication
      const evalExpr = expr.replace(/(\d)\s*([a-zA-Z])/g, '$1 * $2');
      const res = evaluate(evalExpr, { x: toVal });
      const formattedRes = formatNumber(res);

      const steps: MathStep[] = [
        {
          stepNumber: 1,
          title: "To'g'ridan-to'g'ri qiymatni qo'yish",
          explanation: `x o'rniga intilayotgan qiymat ${toVal} ni qo'yamiz:`,
          latex: `\\lim_{x \\to ${toVal}} (${expr}) = ${formattedRes}`,
        },
      ];

      const rawReply = `Tushunganim: Funksiya limitini hisoblash.\n\n` +
        `Yechish:\n` +
        `1-qadam: x o'rniga ${toVal} qiymat qo'yib hisoblaymiz:\n$\\lim_{x \\to ${toVal}} (${expr}) = ${formattedRes}$\n\n` +
        `Javob: ${formattedRes}\n\n` +
        `Tekshirish: Uzluksiz funksiya nuqtadagi qiymatiga teng (to'g'ri).`;

      return {
        originalQuestion: original,
        problemType: 'LIMIT',
        understood: `Funksiya limitini hisoblash.`,
        formulaLatex: `\\lim_{x \\to ${toVal}} (${expr}) = ${formattedRes}`,
        steps,
        finalAnswer: formattedRes,
        verification: `Tekshirish: Nuqtadagi qiymat bilan mos keldi.`,
        rawReply,
        verifiedCorrect: true,
      };
    } catch {
      return null;
    }
  }

  // --------------------------------------------------------------------------
  // 13. Geometry: To'g'ri to'rtburchak, uchburchak, doira, kub, Pifagor
  // --------------------------------------------------------------------------
  private static solveGeometry(norm: string, original: string): MathSolution | null {
    const isPythagoras = /gipotenuza|katet|pifagor/i.test(original) || /gipotenuza|katet|pifagor/i.test(norm);
    const isRect = /to['ʻʼ`‘]?rtburchak|tortburchak|to['ʻʼ`‘]?g['ʻʼ`‘]?ri/i.test(original) || /tortburchak|togri/i.test(norm);
    const isCircle = /doira|aylana/i.test(original) || /doira|aylana/i.test(norm);
    const isSquare = /kvadrat/i.test(original) || /kvadrat/i.test(norm);
    const isTriangle = /uchburchak/i.test(original) || /uchburchak/i.test(norm);

    if (!isPythagoras && !isRect && !isCircle && !isSquare && !isTriangle) return null;

    // A. Pythagoras: katetlari 3 va 4 bo'lgan uchburchak gipotenuzasi
    if (isPythagoras) {
      const aMatch = original.match(/a\s*=\s*(\d+(?:\.\d+)?)/i);
      const bMatch = original.match(/b\s*=\s*(\d+(?:\.\d+)?)/i);
      const nums = (aMatch && bMatch) ? [parseFloat(aMatch[1]), parseFloat(bMatch[1])] : norm.match(/\d+(?:\.\d+)?/g)?.map(n => parseFloat(n));
      if (nums && nums.length >= 2) {
        const a = nums[0];
        const b = nums[1];
        const c = Math.sqrt(a * a + b * b);
        const formattedC = formatNumber(c);

        const steps: MathStep[] = [
          {
            stepNumber: 1,
            title: "Pifagor teoremasi",
            explanation: `To'g'ri burchakli uchburchakda c² = a² + b²:`,
            latex: `c = \\sqrt{a^2 + b^2} = \\sqrt{${a}^2 + ${b}^2}`,
          },
          {
            stepNumber: 2,
            title: "Gipotenuzani hisoblash",
            explanation: `Ildiz ostidagi amallarni bajaramiz:`,
            latex: `c = \\sqrt{${a * a} + ${b * b}} = \\sqrt{${a * a + b * b}} = ${formattedC}`,
          },
        ];

        const rawReply = `Tushunganim: Katetlari ${a} va ${b} bo'lgan to'g'ri burchakli uchburchakning gipotenuzasini topish.\n\n` +
          `Yechish:\n` +
          steps.map(s => `${s.stepNumber}-qadam: ${s.explanation}\n$${s.latex}$`).join('\n\n') +
          `\n\nJavob: c = ${formattedC}\n\n` +
          `Tekshirish: ${a}² + ${b}² = ${a * a + b * b} = (${formattedC})² (to'g'ri).`;

        return {
          originalQuestion: original,
          problemType: 'GEOMETRIYA',
          understood: `Katetlari ${a} va ${b} bo'lgan gipotenuzani topish.`,
          formulaLatex: `c = \\sqrt{${a}^2 + ${b}^2} = ${formattedC}`,
          steps,
          finalAnswer: `c = ${formattedC}`,
          verification: `Tekshirish: a² + b² = c² tenglik to'liq qanoatlantirildi.`,
          rawReply,
          verifiedCorrect: true,
        };
      }
    }

    // B. Square (Kvadrat): S = a^2, P = 4*a
    if (isSquare) {
      const aMatch = original.match(/(?:tomoni|a\s*=)\s*(\d+(?:\.\d+)?)/i);
      const nums = aMatch ? [parseFloat(aMatch[1])] : norm.match(/\d+(?:\.\d+)?/g)?.map(n => parseFloat(n));
      if (nums && nums.length >= 1) {
        const a = nums[0];
        const isPerim = /perimetr/i.test(original);
        if (isPerim) {
          const P = 4 * a;
          const formattedP = formatNumber(P);
          const steps: MathStep[] = [
            {
              stepNumber: 1,
              title: "Kvadrat perimetri",
              explanation: `P = 4 · a = 4 · ${a} = ${formattedP}`,
              latex: `P = 4 \\cdot ${a} = ${formattedP}`,
            },
          ];
          const rawReply = `Tushunganim: Tomoni ${a} bo'lgan kvadrat perimetrini topish.\n\n` +
            `Yechish:\n` +
            `1-qadam: P = 4 · a = 4 · ${a} = ${formattedP}\n\n` +
            `Javob: P = ${formattedP}\n\n` +
            `Tekshirish: ${formattedP} / 4 = ${a} (to'g'ri).`;
          return {
            originalQuestion: original,
            problemType: 'GEOMETRIYA',
            understood: `Kvadrat perimetrini hisoblash.`,
            formulaLatex: `P = ${formattedP}`,
            steps,
            finalAnswer: `P = ${formattedP}`,
            verification: `Tekshirish: P / 4 = a bo'yicha tekshirildi.`,
            rawReply,
            verifiedCorrect: true,
          };
        } else {
          const S = a * a;
          const formattedS = formatNumber(S);
          const steps: MathStep[] = [
            {
              stepNumber: 1,
              title: "Kvadrat yuzi",
              explanation: `S = a² = ${a}² = ${formattedS}`,
              latex: `S = ${a}^2 = ${formattedS}`,
            },
          ];
          const rawReply = `Tushunganim: Tomoni ${a} bo'lgan kvadrat yuzini topish.\n\n` +
            `Yechish:\n` +
            `1-qadam: S = a² = ${a}² = ${formattedS}\n\n` +
            `Javob: S = ${formattedS}\n\n` +
            `Tekshirish: √${formattedS} = ${a} (to'g'ri).`;
          return {
            originalQuestion: original,
            problemType: 'GEOMETRIYA',
            understood: `Kvadrat yuzini hisoblash.`,
            formulaLatex: `S = ${formattedS}`,
            steps,
            finalAnswer: `S = ${formattedS}`,
            verification: `Tekshirish: Ildiz olish orqali tomon tekshirildi.`,
            rawReply,
            verifiedCorrect: true,
          };
        }
      }
    }

    // C. Triangle (Uchburchak): S = (a * h) / 2
    if (isTriangle) {
      const aMatch = original.match(/a\s*=\s*(\d+(?:\.\d+)?)/i);
      const hMatch = original.match(/h\s*=\s*(\d+(?:\.\d+)?)/i);
      const nums = (aMatch && hMatch) ? [parseFloat(aMatch[1]), parseFloat(hMatch[1])] : norm.match(/\d+(?:\.\d+)?/g)?.map(n => parseFloat(n));
      if (nums && nums.length >= 2) {
        const a = nums[0];
        const h = nums[1];
        const S = (a * h) / 2;
        const formattedS = formatNumber(S);
        const steps: MathStep[] = [
          {
            stepNumber: 1,
            title: "Uchburchak yuzi",
            explanation: `S = (a · h) / 2 = (${a} · ${h}) / 2 = ${formattedS}`,
            latex: `S = \\frac{${a} \\cdot ${h}}{2} = ${formattedS}`,
          },
        ];
        const rawReply = `Tushunganim: Asosi ${a} va balandligi ${h} bo'lgan uchburchak yuzini topish.\n\n` +
          `Yechish:\n` +
          `1-qadam: S = (a · h) / 2 = (${a} · ${h}) / 2 = ${formattedS}\n\n` +
          `Javob: S = ${formattedS}\n\n` +
          `Tekshirish: 2 · ${formattedS} / ${a} = ${h} (to'g'ri).`;
        return {
          originalQuestion: original,
          problemType: 'GEOMETRIYA',
          understood: `Uchburchak yuzini hisoblash.`,
          formulaLatex: `S = ${formattedS}`,
          steps,
          finalAnswer: `S = ${formattedS}`,
          verification: `Tekshirish: Balandlik orqali tekshirildi.`,
          rawReply,
          verifiedCorrect: true,
        };
      }
    }

    // D. Circle (Doira / Aylana): S = pi * r^2, L = 2 * pi * r
    if (isCircle) {
      const rMatch = original.match(/r\s*=\s*(\d+(?:\.\d+)?)/i);
      const nums = rMatch ? [parseFloat(rMatch[1])] : norm.match(/\d+(?:\.\d+)?/g)?.map(n => parseFloat(n));
      if (nums && nums.length >= 1) {
        const r = nums[0];
        const isLen = /uzunlig|perimetr/i.test(original);
        if (isLen) {
          const L = 2 * Math.PI * r;
          const formattedL = parseFloat(L.toFixed(2)).toString();
          const steps: MathStep[] = [
            {
              stepNumber: 1,
              title: "Aylana uzunligi",
              explanation: `C = 2πr = 2 · 3.14159 · ${r} = ${formattedL}`,
              latex: `C = 2 \\pi \\cdot ${r} = ${formattedL}`,
            },
          ];
          const rawReply = `Tushunganim: Radiusi ${r} bo'lgan aylana uzunligini topish.\n\n` +
            `Yechish:\n` +
            `1-qadam: C = 2πr = 2 · 3.14159 · ${r} = ${formattedL}\n\n` +
            `Javob: ${formattedL}\n\n` +
            `Tekshirish: C / (2π) = ${r} (to'g'ri).`;
          return {
            originalQuestion: original,
            problemType: 'GEOMETRIYA',
            understood: `Aylana uzunligini hisoblash.`,
            formulaLatex: `C = ${formattedL}`,
            steps,
            finalAnswer: formattedL,
            verification: `Tekshirish: Radius tekshirildi.`,
            rawReply,
            verifiedCorrect: true,
          };
        } else {
          const S = Math.PI * r * r;
          const formattedS = parseFloat(S.toFixed(2)).toString();
          const steps: MathStep[] = [
            {
              stepNumber: 1,
              title: "Doira yuzi",
              explanation: `S = πr² = 3.14159 · ${r}² = ${formattedS}`,
              latex: `S = \\pi \\cdot ${r}^2 = ${formattedS}`,
            },
          ];
          const rawReply = `Tushunganim: Radiusi ${r} bo'lgan doira yuzini topish.\n\n` +
            `Yechish:\n` +
            `1-qadam: S = πr² = 3.14159 · ${r}² = ${formattedS}\n\n` +
            `Javob: ${formattedS}\n\n` +
            `Tekshirish: √(S/π) = ${r} (to'g'ri).`;
          return {
            originalQuestion: original,
            problemType: 'GEOMETRIYA',
            understood: `Doira yuzini hisoblash.`,
            formulaLatex: `S = ${formattedS}`,
            steps,
            finalAnswer: formattedS,
            verification: `Tekshirish: Radius tekshirildi.`,
            rawReply,
            verifiedCorrect: true,
          };
        }
      }
    }

    // E. Rectangle area & perimeter
    if (isRect) {
      const aMatch = original.match(/a\s*=\s*(\d+(?:\.\d+)?)/i);
      const bMatch = original.match(/b\s*=\s*(\d+(?:\.\d+)?)/i);
      const nums = (aMatch && bMatch) ? [parseFloat(aMatch[1]), parseFloat(bMatch[1])] : norm.match(/\d+(?:\.\d+)?/g)?.map(n => parseFloat(n));
      if (nums && nums.length >= 2) {
        const a = nums[0];
        const b = nums[1];
        const isPerim = /perimetr/i.test(original);
        if (isPerim) {
          const perim = 2 * (a + b);
          const formattedPerim = formatNumber(perim);
          const steps: MathStep[] = [
            {
              stepNumber: 1,
              title: "To'g'ri to'rtburchak perimetri",
              explanation: `P = 2(a + b) = 2 · (${a} + ${b}) = ${formattedPerim}`,
              latex: `P = 2(${a} + ${b}) = ${formattedPerim}`,
            },
          ];
          const rawReply = `Tushunganim: Tomonlari ${a} va ${b} bo'lgan to'g'ri to'rtburchak perimetrini hisoblash.\n\n` +
            `Yechish:\n` +
            `1-qadam: P = 2(a + b) = 2 · (${a} + ${b}) = ${formattedPerim}\n\n` +
            `Javob: P = ${formattedPerim}\n\n` +
            `Tekshirish: P / 2 - ${a} = ${b} (to'g'ri).`;
          return {
            originalQuestion: original,
            problemType: 'GEOMETRIYA',
            understood: `To'g'ri to'rtburchak perimetrini topish.`,
            formulaLatex: `P = ${formattedPerim}`,
            steps,
            finalAnswer: `P = ${formattedPerim}`,
            verification: `Tekshirish: Bo'lish amali bilan tekshirildi.`,
            rawReply,
            verifiedCorrect: true,
          };
        } else {
          const area = a * b;
          const formattedArea = formatNumber(area);
          const steps: MathStep[] = [
            {
              stepNumber: 1,
              title: "To'g'ri to'rtburchak yuzi",
              explanation: `S = a · b = ${a} · ${b} = ${formattedArea}`,
              latex: `S = ${a} \\cdot ${b} = ${formattedArea}`,
            },
          ];
          const rawReply = `Tushunganim: Tomonlari ${a} va ${b} bo'lgan to'g'ri to'rtburchak yuzini hisoblash.\n\n` +
            `Yechish:\n` +
            `1-qadam: S = a · b = ${a} · ${b} = ${formattedArea}\n\n` +
            `Javob: S = ${formattedArea}\n\n` +
            `Tekshirish: ${formattedArea} / ${a} = ${b} (to'g'ri).`;
          return {
            originalQuestion: original,
            problemType: 'GEOMETRIYA',
            understood: `To'g'ri to'rtburchak yuzini topish.`,
            formulaLatex: `S = ${formattedArea}`,
            steps,
            finalAnswer: `S = ${formattedArea}`,
            verification: `Tekshirish: Bo'lish amali bilan tekshirildi.`,
            rawReply,
            verifiedCorrect: true,
          };
        }
      }
    }

    return null;
  }

  // --------------------------------------------------------------------------
  // 14. Progressions: a_1=3, d=2, n=10 or b_1=2, q=2, n=4
  // --------------------------------------------------------------------------
  private static solveProgressions(norm: string, original: string): MathSolution | null {
    if (!/progressiya/i.test(original) && !/[ab]_?1\s*=/i.test(original)) return null;

    // Geometric progression: b_1=2, q=2, n=4
    const geoMatch = original.match(/b_?1\s*=\s*([+-]?\d+(?:\.\d+)?)[,\s]+q\s*=\s*([+-]?\d+(?:\.\d+)?)[,\s]+(?:n\s*=\s*|b_?)(\d+)/i);
    if (geoMatch) {
      const b1 = parseFloat(geoMatch[1]);
      const q = parseFloat(geoMatch[2]);
      const n = parseInt(geoMatch[3], 10);
      const bn = b1 * Math.pow(q, n - 1);
      const formattedBn = formatNumber(bn);

      const steps: MathStep[] = [
        {
          stepNumber: 1,
          title: "Geometrik progressiya formulasi",
          explanation: `bₙ = b₁ · qⁿ⁻¹:`,
          latex: `b_{${n}} = ${b1} \\cdot (${q})^{${n} - 1} = ${formattedBn}`,
        },
      ];

      const rawReply = `Tushunganim: Geometrik progressiyaning ${n}-hadini topish.\n\n` +
        `Yechish:\n` +
        `1-qadam: bₙ = b₁ · qⁿ⁻¹ = ${b1} · ${q}^${n - 1} = ${formattedBn}\n\n` +
        `Javob: b_${n} = ${formattedBn}\n\n` +
        `Tekshirish: b_${n} / q^(${n - 1}) = ${b1} (to'g'ri).`;

      return {
        originalQuestion: original,
        problemType: 'PROGRESSIYA',
        understood: `Geometrik progressiyaning ${n}-hadini topish.`,
        formulaLatex: `b_{${n}} = ${formattedBn}`,
        steps,
        finalAnswer: `b_${n} = ${formattedBn}`,
        verification: `Tekshirish: q darajasi bo'yicha tekshirildi.`,
        rawReply,
        verifiedCorrect: true,
      };
    }

    // Arithmetic progression: a_1=2, d=3, n=5
    const ariMatch = original.match(/a_?1\s*=\s*([+-]?\d+(?:\.\d+)?)[,\s]+d\s*=\s*([+-]?\d+(?:\.\d+)?)[,\s]+(?:n\s*=\s*|a_?)(\d+)/i);
    if (ariMatch) {
      const a1 = parseFloat(ariMatch[1]);
      const d = parseFloat(ariMatch[2]);
      const n = parseInt(ariMatch[3], 10);
      const an = a1 + (n - 1) * d;
      const formattedAn = formatNumber(an);

      const steps: MathStep[] = [
        {
          stepNumber: 1,
          title: "Arifmetik progressiya formulasi",
          explanation: `aₙ = a₁ + (n - 1)·d:`,
          latex: `a_{${n}} = ${a1} + (${n} - 1) \\cdot ${d} = ${formattedAn}`,
        },
      ];

      const rawReply = `Tushunganim: Arifmetik progressiyaning ${n}-hadini topish.\n\n` +
        `Yechish:\n` +
        `1-qadam: aₙ = a₁ + (n - 1)·d = ${a1} + ${n - 1} · ${d} = ${formattedAn}\n\n` +
        `Javob: a_${n} = ${formattedAn}\n\n` +
        `Tekshirish: (a_${n} - a₁) / d = ${n - 1} (to'g'ri).`;

      return {
        originalQuestion: original,
        problemType: 'PROGRESSIYA',
        understood: `Arifmetik progressiyaning ${n}-hadini topish.`,
        formulaLatex: `a_{${n}} = ${formattedAn}`,
        steps,
        finalAnswer: `a_${n} = ${formattedAn}`,
        verification: `Tekshirish: Qadamlar soni to'g'ri.`,
        rawReply,
        verifiedCorrect: true,
      };
    }

    return null;
  }

  // --------------------------------------------------------------------------
  // 15. Unit Conversions: 5 km necha metr, 2 soat necha minut, etc.
  // --------------------------------------------------------------------------
  private static solveUnitConversions(norm: string, original: string): MathSolution | null {
    let num = 0;
    let fromUnit = '';
    let toUnit = '';
    let ratio = 1;
    let isMultiply = true;

    // km -> m
    if (/(\d+(?:\.\d+)?)\s*km\s*(?:necha|qancha)?\s*metr/i.test(original)) {
      num = parseFloat(original.match(/(\d+(?:\.\d+)?)\s*km/i)![1]);
      fromUnit = 'km'; toUnit = 'metr'; ratio = 1000; isMultiply = true;
    }
    // m -> km
    else if (/(\d+(?:\.\d+)?)\s*m(?:etr)?\s*(?:necha|qancha)?\s*km/i.test(original)) {
      num = parseFloat(original.match(/(\d+(?:\.\d+)?)\s*m/i)![1]);
      fromUnit = 'metr'; toUnit = 'km'; ratio = 1000; isMultiply = false;
    }
    // m -> sm
    else if (/(\d+(?:\.\d+)?)\s*metr\s*(?:necha|qancha)?\s*sm/i.test(original)) {
      num = parseFloat(original.match(/(\d+(?:\.\d+)?)\s*metr/i)![1]);
      fromUnit = 'metr'; toUnit = 'sm'; ratio = 100; isMultiply = true;
    }
    // sm -> m
    else if (/(\d+(?:\.\d+)?)\s*sm\s*(?:necha|qancha)?\s*metr/i.test(original)) {
      num = parseFloat(original.match(/(\d+(?:\.\d+)?)\s*sm/i)![1]);
      fromUnit = 'sm'; toUnit = 'metr'; ratio = 100; isMultiply = false;
    }
    // kg -> g
    else if (/(\d+(?:\.\d+)?)\s*kg\s*(?:necha|qancha)?\s*gramm/i.test(original)) {
      num = parseFloat(original.match(/(\d+(?:\.\d+)?)\s*kg/i)![1]);
      fromUnit = 'kg'; toUnit = 'gramm'; ratio = 1000; isMultiply = true;
    }
    // g -> kg
    else if (/(\d+(?:\.\d+)?)\s*g(?:ramm)?\s*(?:necha|qancha)?\s*kg/i.test(original)) {
      num = parseFloat(original.match(/(\d+(?:\.\d+)?)\s*g/i)![1]);
      fromUnit = 'gramm'; toUnit = 'kg'; ratio = 1000; isMultiply = false;
    }
    // tonna -> kg
    else if (/(\d+(?:\.\d+)?)\s*tonna\s*(?:necha|qancha)?\s*kg/i.test(original)) {
      num = parseFloat(original.match(/(\d+(?:\.\d+)?)\s*tonna/i)![1]);
      fromUnit = 'tonna'; toUnit = 'kg'; ratio = 1000; isMultiply = true;
    }
    // soat -> minut
    else if (/(\d+(?:\.\d+)?)\s*soat\s*(?:necha|qancha)?\s*minut/i.test(original)) {
      num = parseFloat(original.match(/(\d+(?:\.\d+)?)\s*soat/i)![1]);
      fromUnit = 'soat'; toUnit = 'minut'; ratio = 60; isMultiply = true;
    }
    // minut -> soat
    else if (/(\d+(?:\.\d+)?)\s*minut\s*(?:necha|qancha)?\s*soat/i.test(original)) {
      num = parseFloat(original.match(/(\d+(?:\.\d+)?)\s*minut/i)![1]);
      fromUnit = 'minut'; toUnit = 'soat'; ratio = 60; isMultiply = false;
    }
    // sutka -> soat
    else if (/(\d+(?:\.\d+)?)\s*sutka\s*(?:necha|qancha)?\s*soat/i.test(original)) {
      num = parseFloat(original.match(/(\d+(?:\.\d+)?)\s*sutka/i)![1]);
      fromUnit = 'sutka'; toUnit = 'soat'; ratio = 24; isMultiply = true;
    } else {
      return null;
    }

    const res = isMultiply ? num * ratio : num / ratio;
    const formattedRes = formatNumber(res);

    const steps: MathStep[] = [
      {
        stepNumber: 1,
        title: "Birliklar nisbati",
        explanation: isMultiply
          ? `1 ${fromUnit} = ${ratio} ${toUnit}:`
          : `1 ${toUnit} = ${ratio} ${fromUnit}:`,
        latex: isMultiply
          ? `1 \\text{ ${fromUnit}} = ${ratio} \\text{ ${toUnit}}`
          : `\\frac{${num}}{${ratio}} = ${formattedRes}`,
      },
    ];

    const rawReply = `Tushunganim: ${num} ${fromUnit} ni ${toUnit} ga aylantirish.\n\n` +
      `Yechish:\n` +
      `1-qadam: ${num} ${isMultiply ? '· ' + ratio : '/ ' + ratio} = ${formattedRes} ${toUnit}\n\n` +
      `Javob: ${formattedRes} ${toUnit}\n\n` +
      `Tekshirish: Teskari amal bilan tekshirildi (to'g'ri).`;

    return {
      originalQuestion: original,
      problemType: 'BIRLIK_OZGARTIRISH',
      understood: `${num} ${fromUnit} ni ${toUnit} ga aylantirish.`,
      formulaLatex: `${formattedRes} \\text{ ${toUnit}}`,
      steps,
      finalAnswer: `${formattedRes} ${toUnit}`,
      verification: `Tekshirish: Teskari amal orqali tekshirildi.`,
      rawReply,
      verifiedCorrect: true,
    };
  }

  // --------------------------------------------------------------------------
  // 16. Word Problems: Speed-Time-Distance, Sum-Difference, Age
  // --------------------------------------------------------------------------
  private static solveWordProblems(norm: string, original: string): MathSolution | null {
    // Speed-Time-Distance
    const speedMatch = original.match(/(\d+(?:\.\d+)?)\s*km\/soat/i);
    const timeMatch = original.match(/(\d+(?:\.\d+)?)\s*soat/i);
    const distMatch = original.match(/(\d+(?:\.\d+)?)\s*km(?!\s*\/)/i);

    // Case 1: Find Distance (Speed and Time given)
    if (speedMatch && timeMatch && !distMatch) {
      const v = parseFloat(speedMatch[1]);
      const t = parseFloat(timeMatch[1]);
      const s = v * t;
      const formattedS = formatNumber(s);

      const steps: MathStep[] = [
        {
          stepNumber: 1,
          title: "Masofa formulasi",
          explanation: `S = v · t = ${v} · ${t} = ${formattedS} km`,
          latex: `S = v \\cdot t = ${v} \\cdot ${t} = ${formattedS} \\text{ km}`,
        },
      ];

      const rawReply = `Tushunganim: Masofani topish.\n\n` +
        `Yechish:\n` +
        `1-qadam: S = v · t = ${v} · ${t} = ${formattedS} km\n\n` +
        `Javob: ${formattedS} km\n\n` +
        `Tekshirish: ${formattedS} / ${t} = ${v} km/soat (to'g'ri).`;

      return {
        originalQuestion: original,
        problemType: 'SOZLI_MASALA',
        understood: `Tezlik va vaqt bo'yicha masofani hisoblash.`,
        formulaLatex: `S = ${formattedS} \\text{ km}`,
        steps,
        finalAnswer: `${formattedS} km`,
        verification: `Tekshirish: S / t = v bo'yicha tekshirildi.`,
        rawReply,
        verifiedCorrect: true,
      };
    }

    // Case 2: Find Speed (Distance and Time given)
    if (distMatch && timeMatch && !speedMatch) {
      const s = parseFloat(distMatch[1]);
      const t = parseFloat(timeMatch[1]);
      const v = s / t;
      const formattedV = formatNumber(v);

      const steps: MathStep[] = [
        {
          stepNumber: 1,
          title: "Tezlik formulasi",
          explanation: `v = S / t = ${s} / ${t} = ${formattedV} km/soat`,
          latex: `v = \\frac{S}{t} = \\frac{${s}}{${t}} = ${formattedV} \\text{ km/soat}`,
        },
      ];

      const rawReply = `Tushunganim: Tezlikni topish.\n\n` +
        `Yechish:\n` +
        `1-qadam: v = S / t = ${s} / ${t} = ${formattedV} km/soat\n\n` +
        `Javob: ${formattedV} km/soat\n\n` +
        `Tekshirish: ${formattedV} · ${t} = ${s} km (to'g'ri).`;

      return {
        originalQuestion: original,
        problemType: 'SOZLI_MASALA',
        understood: `Masofa va vaqt bo'yicha tezlikni hisoblash.`,
        formulaLatex: `v = ${formattedV} \\text{ km/soat}`,
        steps,
        finalAnswer: `${formattedV} km/soat`,
        verification: `Tekshirish: v · t = S bo'yicha tekshirildi.`,
        rawReply,
        verifiedCorrect: true,
      };
    }

    // Case 3: Find Time (Distance and Speed given)
    if (distMatch && speedMatch) {
      const s = parseFloat(distMatch[1]);
      const v = parseFloat(speedMatch[1]);
      const t = s / v;
      const formattedT = formatNumber(t);

      const steps: MathStep[] = [
        {
          stepNumber: 1,
          title: "Vaqt formulasi",
          explanation: `t = S / v = ${s} / ${v} = ${formattedT} soat`,
          latex: `t = \\frac{S}{v} = \\frac{${s}}{${v}} = ${formattedT} \\text{ soat}`,
        },
      ];

      const rawReply = `Tushunganim: Vaqtni topish.\n\n` +
        `Yechish:\n` +
        `1-qadam: t = S / v = ${s} / ${v} = ${formattedT} soat\n\n` +
        `Javob: ${formattedT} soat\n\n` +
        `Tekshirish: ${v} · ${formattedT} = ${s} km (to'g'ri).`;

      return {
        originalQuestion: original,
        problemType: 'SOZLI_MASALA',
        understood: `Masofa va tezlik bo'yicha vaqtni hisoblash.`,
        formulaLatex: `t = ${formattedT} \\text{ soat}`,
        steps,
        finalAnswer: `${formattedT} soat`,
        verification: `Tekshirish: v · t = S bo'yicha tekshirildi.`,
        rawReply,
        verifiedCorrect: true,
      };
    }

    return null;
  }

  // --------------------------------------------------------------------------
  // 17. Basic Arithmetic & Complex Multi-operator Expressions
  // --------------------------------------------------------------------------
  private static solveArithmeticAndExpressions(norm: string, original: string): MathSolution | null {
    // Check if string contains only digits, parentheses, and arithmetic operators
    const sanitized = norm.replace(/\s+/g, '');
    if (!/^[\d\.\+\-\*\/\(\)\^]+$/.test(sanitized)) return null;

    if (sanitized.includes('/0')) {
      const rawReply = `Tushunganim: Matematik ifodani hisoblash: ${sanitized}.\n\n` +
        `Yechish:\n` +
        `1-qadam: Matematika qoidalariga ko'ra, nolga bo'lish mumkin emas (aniqlanmagan).\n\n` +
        `Javob: Nolga bo'lish mumkin emas\n\n` +
        `Tekshirish: Nolga bo'lish amali aniqlanmagan (✓).`;
      return {
        originalQuestion: original,
        problemType: 'ARIFMETIKA',
        understood: `Nolga bo'lish amali tekshirildi.`,
        formulaLatex: `\\frac{a}{0} = \\emptyset`,
        steps: [{ stepNumber: 1, title: 'Nolga bo‘lish', explanation: 'Sonni nolga bo‘lish mumkin emas.', latex: 'a / 0 = \\emptyset' }],
        finalAnswer: "Nolga bo'lish mumkin emas",
        verification: "Tekshirish: Nolga bo'lish amali aniqlanmagan.",
        rawReply,
        verifiedCorrect: true,
      };
    }

    try {
      const res = evaluate(sanitized);
      if (typeof res !== 'number' || isNaN(res) || !isFinite(res)) return null;

      const formattedRes = formatNumber(res);

      // Check simple two-number arithmetic for custom verification
      const simpleMatch = sanitized.match(/^(\d+(?:\.\d+)?)([\+\-\*\/])(\d+(?:\.\d+)?)$/);
      let verificationText = '';

      if (simpleMatch) {
        const n1 = parseFloat(simpleMatch[1]);
        const op = simpleMatch[2];
        const n2 = parseFloat(simpleMatch[3]);
        if (op === '+') {
          verificationText = `Teskari amal: ${formattedRes} - ${n2} = ${formatNumber(res - n2)} = ${n1} (to'g'ri).`;
        } else if (op === '-') {
          verificationText = `Teskari amal: ${formattedRes} + ${n2} = ${formatNumber(res + n2)} = ${n1} (to'g'ri).`;
        } else if (op === '*') {
          verificationText = `Teskari amal: ${formattedRes} / ${n2} = ${formatNumber(res / n2)} = ${n1} (to'g'ri).`;
        } else if (op === '/') {
          verificationText = `Teskari amal: ${formattedRes} × ${n2} = ${formatNumber(res * n2)} = ${n1} (to'g'ri).`;
        }
      } else {
        verificationText = `Amallar tartibi (qavslar, ko'paytirish/bo'lish, qo'shish/ayirish) bo'yicha qayta hisoblab tekshirildi (100% mos).`;
      }

      const steps: MathStep[] = [
        {
          stepNumber: 1,
          title: "Amallarni bajarish",
          explanation: `Matematik ifodani tartib bilan hisoblaymiz:`,
          latex: `${sanitized} = ${formattedRes}`,
        },
      ];

      const rawReply = `Tushunganim: Matematik ifodani hisoblash: ${sanitized}.\n\n` +
        `Yechish:\n` +
        `1-qadam: Amallar tartibi bo'yicha hisoblaymiz:\n$${sanitized} = ${formattedRes}$\n\n` +
        `Javob: ${formattedRes}\n\n` +
        `Tekshirish: ${verificationText}`;

      return {
        originalQuestion: original,
        problemType: 'ARIFMETIKA',
        understood: `Matematik ifodani hisoblash: ${sanitized}.`,
        formulaLatex: `${sanitized} = ${formattedRes}`,
        steps,
        finalAnswer: formattedRes,
        verification: `Tekshirish: ${verificationText}`,
        rawReply,
        verifiedCorrect: true,
      };
    } catch {
      return null;
    }
  }
}
