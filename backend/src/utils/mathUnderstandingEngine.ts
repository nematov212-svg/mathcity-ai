/**
 * MathCity AI — MathUnderstandingEngine
 * 100% Deterministic, Rules-Based Uzbek Mathematical Language Understanding & Solver.
 * Independent of external LLMs/Gemini keys.
 *
 * Architecture:
 * Layer 1: Normalization (lowercase, apostrophes, typo correction, voice prefix removal)
 * Layer 2: Uzbek Word-to-Number & Compound Phrase Parser
 * Layer 3: Mathematical Intent Recognition & Verified Arithmetic (via MathJS & exact arithmetic)
 */

import { evaluate } from 'mathjs';

export interface UnderstandingStep {
  stepNumber: number;
  title: string;
  explanation: string;
  latex: string;
}

export interface UnderstandingResult {
  success: boolean;
  understoodQuery: string;
  shortAnswer: string;
  formulaLatex: string;
  steps: UnderstandingStep[];
  similarExample?: { prompt: string; formulaLatex: string; answer: string };
  closestGuess?: { guess: string; prompt: string };
  suggestedActions?: string[];
  reply: string;
  isMathematical: boolean;
}

export class MathUnderstandingEngine {
  // Numbers in Uzbek
  private static readonly ONES: Record<string, number> = {
    nol: 0,
    bir: 1,
    ikki: 2,
    uch: 3,
    tort: 4,
    "to'rt": 4,
    besh: 5,
    olti: 6,
    yetti: 7,
    sakkiz: 8,
    toqqiz: 9,
    "to'qqiz": 9,
  };

  private static readonly TENS: Record<string, number> = {
    on: 10,
    "o'n": 10,
    yigirma: 20,
    ottiz: 30,
    "o'ttiz": 30,
    qirq: 40,
    ellik: 50,
    oltmish: 60,
    yetmish: 70,
    sakson: 80,
    toqson: 90,
    "to'qson": 90,
  };

  private static readonly SCALES: Record<string, number> = {
    yuz: 100,
    ming: 1000,
    million: 1000000,
    milliard: 1000000000,
  };

  // --------------------------------------------------------------------------
  // LAYER 1: NORMALIZATION
  // --------------------------------------------------------------------------
  public static normalize(raw: string): string {
    if (!raw) return '';

    let text = raw.toLowerCase().trim();

    // 1. Remove voice speech-to-text introductory prefixes
    text = text
      .replace(/^ovozli\s+savolingiz\s+eshitildi\s*[:\-–]?\s*/gi, '')
      .replace(/^🎙️\s*\[ovozli\s+xabar\s*[:\-–]?\s*"?/gi, '')
      .replace(/^🎙️\s*"?/gi, '')
      .replace(/"?\s*\]$/g, '')
      .replace(/"$/g, '');

    // 2. Normalize all apostrophe variants to standard single quote '
    text = text.replace(/[ʻʼ`‘´’]/g, "'");

    // 3. Normalize common Uzbek spoken colloquialisms & voice typos
    // "manga" -> "menga", "sanga" -> "senga"
    text = text.replace(/\bmanga\b/gi, 'menga');
    text = text.replace(/\bsanga\b/gi, 'senga');

    // Spoken "bir" at end of imperative verbs ("qo'shib bir", "yechib bir") means "ber"
    text = text.replace(/\b(qoshib|qo'shib|yechib|hisoblab|ayirib|kopaytirib|ko'paytirib|bolib|bo'lib|topib|chiqarib|qilib)\s+bir\b/gi, '$1 ber');

    // Fix typical phonetic variants
    text = text.replace(/\bqoshib\b/gi, "qo'shib");
    text = text.replace(/\bqoshsak\b/gi, "qo'shsak");
    text = text.replace(/\bqosh\b/gi, "qo'sh");
    text = text.replace(/\bkopaytir\b/gi, "ko'paytir");
    text = text.replace(/\bkopaytirish\b/gi, "ko'paytirish");
    text = text.replace(/\bkopaytirsak\b/gi, "ko'paytirsak");
    text = text.replace(/\bkopaytirib\b/gi, "ko'paytirib");
    text = text.replace(/\bkopaytma\b/gi, "ko'paytma");
    text = text.replace(/\bkopaytmasi\b/gi, "ko'paytmasi");
    text = text.replace(/\bbolib\b/gi, "bo'lib");
    text = text.replace(/\bbolish\b/gi, "bo'lish");
    text = text.replace(/\bbolsak\b/gi, "bo'lsak");
    text = text.replace(/\bbol\b/gi, "bo'l");
    text = text.replace(/\bbolinma\b/gi, "bo'linma");
    text = text.replace(/\bbolinmasi\b/gi, "bo'linmasi");
    text = text.replace(/\byigindisi\b/gi, "yig'indisi");
    text = text.replace(/\byigindi\b/gi, "yig'indi");
    text = text.replace(/\btogri\b/gi, "to'g'ri");
    text = text.replace(/\btortburchak\b/gi, "to'rtburchak");
    text = text.replace(/\btoqqiz\b/gi, "to'qqiz");
    text = text.replace(/\bottiz\b/gi, "o'ttiz");
    text = text.replace(/\btoqson\b/gi, "to'qson");

    // Replace mathematical symbols with standardized ones
    text = text.replace(/[—–−]/g, '-');
    text = text.replace(/[×✕x]/gi, (match, offset, str) => {
      // If 'x' is surrounded by digits or preceded/followed by digits, treat as *
      const before = str[offset - 1] || '';
      const after = str[offset + 1] || '';
      if (/\d/.test(before) && /\d/.test(after)) return '*';
      return match;
    });
    text = text.replace(/[÷:]/g, '/');
    text = text.replace(/·/g, '*');

    // Remove polite words that don't affect math logic
    text = text
      .replace(/\biltimos\b/gi, '')
      .replace(/\bmenga\b/gi, '')
      .replace(/\bmarhamat\b/gi, '')
      .replace(/\bqani\b/gi, '');

    return text.replace(/\s+/g, ' ').trim();
  }

  // --------------------------------------------------------------------------
  // LAYER 2: SO'Z-RAQAM PARSERI (Uzbek Word-to-Number Converter)
  // --------------------------------------------------------------------------
  public static parseWordsToNumbers(text: string): string {
    const tokens = text.split(/\s+/);
    const result: string[] = [];
    let i = 0;

    const suffixes = [
      'ning', 'dan', 'tan', 'ga', 'ka', 'qa', 'ni', 'da', 'ta', 'tadan', 'tasi', 'tasini'
    ];

    while (i < tokens.length) {
      const token = tokens[i];

      // Check special spoken fractions: "yarim" -> "1/2", "chorak" -> "1/4"
      if (token === 'yarim') {
        result.push('1/2');
        i++;
        continue;
      }
      if (token === 'chorak') {
        result.push('1/4');
        i++;
        continue;
      }

      // Check for fractional patterns like "uchdan bir" (1/3), "to'rtdan uch" (3/4)
      // Only parse as fraction if NOT a subtraction sentence ("ayir", "ayirib", "ayirsak", "minus")
      const isSubtractionContext = /\b(ayir|ayirib|ayirsak|ayirish|ayirmasi|minus)\b/i.test(text);
      if (!isSubtractionContext && i + 1 < tokens.length) {
        const first = tokens[i];
        const second = tokens[i + 1];
        const nextWord = tokens[i + 2];
        const fracMatch = this.tryParseFraction(first, second, nextWord);
        if (fracMatch !== null) {
          result.push(fracMatch);
          i += 2;
          continue;
        }
      }

      // Try parsing compound number sequence starting at i
      const parsedNum = this.parseCompoundNumber(tokens, i, suffixes);
      if (parsedNum !== null) {
        result.push(parsedNum.text);
        i += parsedNum.consumed;
      } else {
        result.push(token);
        i++;
      }
    }

    return result.join(' ');
  }

  private static tryParseFraction(denomWord: string, numWord: string, nextWord?: string): string | null {
    // If nextWord is also a number (e.g. "o'n besh"), it's not a fraction
    if (nextWord) {
      const cleanNext = nextWord.replace(/[ʻʼ`‘´’]/g, "'");
      if (this.lookupSingleNumber(cleanNext) !== null) return null;
      for (const sf of ['dan', 'tan', 'ga', 'ka', 'qa', 'ni', 'da', 'ta']) {
        if (cleanNext.endsWith(sf)) {
          const pb = cleanNext.slice(0, -sf.length);
          if (this.lookupSingleNumber(pb) !== null) return null;
        }
      }
    }

    // e.g. "uchdan bir" -> "1/3", "to'rtdan uch" -> "3/4"
    let denomBase = denomWord;
    let hasDan = false;
    for (const sf of ['dan', 'tan']) {
      if (denomWord.endsWith(sf)) {
        denomBase = denomWord.slice(0, -sf.length);
        hasDan = true;
        break;
      }
    }
    if (!hasDan) return null;

    const denomVal = this.lookupSingleNumber(denomBase);
    const numVal = this.lookupSingleNumber(numWord);

    // Fractions typically have small units or 100 as denominator and single unit numerator
    if (denomVal !== null && numVal !== null && denomVal !== 0 && this.ONES[numWord] !== undefined) {
      return `${numVal}/${denomVal}`;
    }
    return null;
  }

  private static lookupSingleNumber(word: string): number | null {
    const clean = word.replace(/[ʻʼ`‘´’]/g, "'");
    if (this.ONES[clean] !== undefined) return this.ONES[clean];
    if (this.TENS[clean] !== undefined) return this.TENS[clean];
    if (this.SCALES[clean] !== undefined) return this.SCALES[clean];
    return null;
  }

  private static parseCompoundNumber(
    tokens: string[],
    startIndex: number,
    suffixes: string[]
  ): { text: string; consumed: number } | null {
    let index = startIndex;
    let total = 0;
    let current = 0;
    let matchedAny = false;
    let trailingSuffix = '';
    let prevVal: number | null = null;

    while (index < tokens.length) {
      let rawToken = tokens[index];
      let cleanToken = rawToken.replace(/[ʻʼ`‘´’]/g, "'");
      let suffix = '';

      // Check if it's "bir" followed by "ber" or imperative verb
      if (cleanToken === 'bir') {
        const next = tokens[index + 1] || '';
        if (['ber', 'qo‘shib', "qo'shib", 'qilib', 'yechib'].includes(next)) {
          break;
        }
      }

      // Extract suffix if present
      let base = cleanToken;
      if (this.lookupSingleNumber(base) === null) {
        for (const sf of suffixes) {
          if (cleanToken.endsWith(sf) && cleanToken.length > sf.length) {
            const possibleBase = cleanToken.slice(0, -sf.length);
            if (this.lookupSingleNumber(possibleBase) !== null) {
              base = possibleBase;
              suffix = sf;
              break;
            }
          }
        }
      }

      const val = this.lookupSingleNumber(base);
      if (val === null) {
        // Not a number word
        break;
      }

      // Check compound number grammar rules:
      if (prevVal !== null) {
        // If previous was a ONE (1-9), next must be a SCALE (>= 100). E.g. "besh olti" cannot form a compound number
        if (prevVal < 10 && val < 100) {
          break;
        }
        // If previous was a TEN (10-90), next can only be a ONE (< 10). E.g. "yigirma o'ttiz" cannot form a compound number
        if (prevVal >= 10 && prevVal < 100 && val >= 10) {
          break;
        }
      }

      matchedAny = true;
      prevVal = val;
      if (suffix) {
        trailingSuffix = suffix;
      }

      if (val === 1000 || val === 1000000 || val === 1000000000) {
        current = (current === 0 ? 1 : current) * val;
        total += current;
        current = 0;
      } else if (val === 100) {
        current = (current === 0 ? 1 : current) * 100;
      } else {
        current += val;
      }

      index++;
      // If suffix was attached, the number unit ends here (e.g. "yigirma beshga" ends at "beshga")
      if (suffix) {
        break;
      }
    }

    if (!matchedAny) return null;

    total += current;
    const consumed = index - startIndex;
    const resultText = trailingSuffix ? `${total}${trailingSuffix}` : `${total}`;
    return { text: resultText, consumed };
  }

  // --------------------------------------------------------------------------
  // LAYER 3: INTENT RECOGNITION & VERIFIED EVALUATION
  // --------------------------------------------------------------------------
  public static solve(rawQuery: string): UnderstandingResult {
    const normalized = this.normalize(rawQuery);
    const converted = this.parseWordsToNumbers(normalized);

    // 1. Check if user is asking for EKUB / EKUK (GCD / LCM)
    const gcdLcmResult = this.trySolveGcdLcm(converted, rawQuery);
    if (gcdLcmResult) return gcdLcmResult;

    // 2. Check linear or quadratic equations
    const equationResult = this.trySolveEquation(converted, rawQuery);
    if (equationResult) return equationResult;

    // 3. Check percentage problems (e.g. "15 ning 20 foizi", "50 soni 10 foizga oshsa")
    const percentageResult = this.trySolvePercentage(converted, rawQuery);
    if (percentageResult) return percentageResult;

    // 4. Check powers and square roots ("5 ning kvadrati", "16 ning kvadrat ildizi")
    const powerRootResult = this.trySolvePowersAndRoots(converted, rawQuery);
    if (powerRootResult) return powerRootResult;

    // 5. Check geometry calculations (square, rectangle, triangle, circle perimeter/area, Pythagoras)
    const geometryResult = this.trySolveGeometry(converted, rawQuery);
    if (geometryResult) return geometryResult;

    // 6. Check basic word problems ("Alida 5 ta olma bor edi, 3 tasini berdi...")
    const wordProblemResult = this.trySolveSimpleWordProblem(converted, rawQuery);
    if (wordProblemResult) return wordProblemResult;

    // 7. Check natural arithmetic questions:
    // e.g. "5 ga 6 ni qo'shib ber", "10 dan 4 ni ayir", "5 ni 6 ga ko'paytir", "20 ni 4 ga bo'l"
    const naturalArithmeticResult = this.trySolveNaturalArithmetic(converted, rawQuery);
    if (naturalArithmeticResult) return naturalArithmeticResult;

    // 8. General mathematical expression evaluation via mathjs
    const exprResult = this.trySolveDirectExpression(converted, rawQuery);
    if (exprResult) return exprResult;

    // 9. If not strictly recognized, generate closest helpful mathematical guess
    return this.generateClosestGuess(rawQuery, converted);
  }

  // --------------------------------------------------------------------------
  // OPERATION SOLVERS
  // --------------------------------------------------------------------------

  private static trySolveGcdLcm(text: string, rawQuery: string): UnderstandingResult | null {
    const isGcd = /\b(ekub|e\.k\.u\.b|eng\s+katta\s+umumiy\s+bo'luvchi)\b/i.test(text);
    const isLcm = /\b(ekuk|e\.k\.u\.k|eng\s+kichik\s+umumiy\s+karrali)\b/i.test(text);

    if (!isGcd && !isLcm) return null;

    const nums = text.match(/\d+/g)?.map(Number) || [];
    if (nums.length < 2) return null;

    const [a, b] = nums;
    if (isGcd) {
      const result = this.gcd(a, b);
      return {
        success: true,
        isMathematical: true,
        understoodQuery: `${a} va ${b} ning EKUB`,
        shortAnswer: `${result}`,
        formulaLatex: `\\text{EKUB}(${a}, ${b}) = ${result}`,
        steps: [
          {
            stepNumber: 1,
            title: "Bo'luvchilarni aniqlash",
            explanation: `${a} va ${b} sonlarining umumiy eng katta natural bo'luvchisi topiladi.`,
            latex: `\\text{EKUB}(${a}, ${b})`,
          },
          {
            stepNumber: 2,
            title: 'Yevklid algoritmi',
            explanation: `Ikkala sonni qoldiqli bo'lish orqali umumiy bo'luvchi ${result} ga tengligi hisoblandi.`,
            latex: `${a} = ${b} \\cdot q + r \\implies ${result}`,
          },
          {
            stepNumber: 3,
            title: 'Yakuniy javob',
            explanation: `${a} va ${b} sonlarining EKUBi ${result} ga teng.`,
            latex: `\\mathbf{${result}}`,
          },
        ],
        similarExample: {
          prompt: '18 va 24 ning EKUBini toping',
          formulaLatex: '\\text{EKUB}(18, 24) = 6',
          answer: '6',
        },
        reply: `**${result}**\n\n1) Savol: ${a} va ${b} ning EKUBi.\n2) Yechim: Ikkala sonni bo'luvchi eng katta son — ${result}.\n3) Yakuniy javob: **${result}**\n4) O'xshash misol: EKUB(18, 24) = 6`,
      };
    } else {
      const result = this.lcm(a, b);
      return {
        success: true,
        isMathematical: true,
        understoodQuery: `${a} va ${b} ning EKUK`,
        shortAnswer: `${result}`,
        formulaLatex: `\\text{EKUK}(${a}, ${b}) = ${result}`,
        steps: [
          {
            stepNumber: 1,
            title: 'Karralilarni aniqlash',
            explanation: `${a} va ${b} sonlariga qoldiqsiz bo'linadigan eng kichik musbat son topiladi.`,
            latex: `\\text{EKUK}(${a}, ${b})`,
          },
          {
            stepNumber: 2,
            title: 'Formula orqali hisoblash',
            explanation: `EKUK(a, b) = (a * b) / EKUB(a, b) = (${a} * ${b}) / ${this.gcd(a, b)} = ${result}.`,
            latex: `\\frac{${a} \\times ${b}}{${this.gcd(a, b)}} = ${result}`,
          },
        ],
        similarExample: {
          prompt: '8 va 12 ning EKUKini toping',
          formulaLatex: '\\text{EKUK}(8, 12) = 24',
          answer: '24',
        },
        reply: `**${result}**\n\n1) Savol: ${a} va ${b} ning EKUKi.\n2) Yechim: Ikkala songa bo'linadigan eng kichik son — ${result}.\n3) Yakuniy javob: **${result}**\n4) O'xshash misol: EKUK(8, 12) = 24`,
      };
    }
  }

  private static trySolveEquation(text: string, rawQuery: string): UnderstandingResult | null {
    // Check if equation contains '=', or 'yech'
    if (!text.includes('=') && !/\bx\b/i.test(text)) return null;

    // Linear: ax + b = c, x + a = b, ax = b
    const clean = text
      .replace(/tenglamani\s+yech/gi, '')
      .replace(/ni\s+yech/gi, '')
      .replace(/yech/gi, '')
      .replace(/\?/g, '')
      .trim();

    // 1. Linear: ax + b = c or x + a = b
    const linearMatch = clean.match(/^(-?\d*)\s*x\s*([+-]\s*\d+)?\s*=\s*(-?\d+)$/i);
    if (linearMatch) {
      const aStr = linearMatch[1];
      const a = aStr === '' || aStr === '+' ? 1 : aStr === '-' ? -1 : parseFloat(aStr);
      const bStr = (linearMatch[2] || '0').replace(/\s+/g, '');
      const b = parseFloat(bStr);
      const c = parseFloat(linearMatch[3]);

      const root = (c - b) / a;
      const formattedRoot = Number.isInteger(root) ? `${root}` : root.toFixed(2);

      return {
        success: true,
        isMathematical: true,
        understoodQuery: clean,
        shortAnswer: `x = ${formattedRoot}`,
        formulaLatex: `${clean} \\implies x = ${formattedRoot}`,
        steps: [
          {
            stepNumber: 1,
            title: "O'zgaruvchini ajratish",
            explanation: `Ozod had ${b} o'ng tarafga qarama-qarshi ishora bilan o'tkaziladi: ${a}x = ${c} - (${b}) = ${c - b}.`,
            latex: `${a === 1 ? '' : a}x = ${c - b}`,
          },
          {
            stepNumber: 2,
            title: 'Ildizni topish',
            explanation: `Ikkala tomon noma'lum oldidagi koeffitsient ${a} ga bo'linadi: x = ${c - b} / ${a} = ${formattedRoot}.`,
            latex: `x = ${formattedRoot}`,
          },
        ],
        similarExample: {
          prompt: 'x + 4 = 12 tenglamasini yeching',
          formulaLatex: 'x + 4 = 12 \\implies x = 8',
          answer: 'x = 8',
        },
        reply: `**x = ${formattedRoot}**\n\n1) Tenglama: ${clean}\n2) Yechim: x = (${c} - ${b}) / ${a} = ${formattedRoot}\n3) Yakuniy javob: **x = ${formattedRoot}**`,
      };
    }

    // 2. Quadratic: ax^2 + bx + c = 0
    const quadMatch = clean.match(/^(-?\d*)\s*x\^?2\s*([+-]\s*\d*x)?\s*([+-]\s*\d+)?\s*=\s*0$/i);
    if (quadMatch) {
      const aStr = quadMatch[1];
      const a = aStr === '' || aStr === '+' ? 1 : aStr === '-' ? -1 : parseFloat(aStr);
      const bRaw = (quadMatch[2] || '+0x').replace(/x/i, '').replace(/\s+/g, '');
      const b = bRaw === '' || bRaw === '+' ? 1 : bRaw === '-' ? -1 : parseFloat(bRaw);
      const c = parseFloat((quadMatch[3] || '0').replace(/\s+/g, ''));

      const D = b * b - 4 * a * c;
      if (D < 0) {
        return {
          success: true,
          isMathematical: true,
          understoodQuery: clean,
          shortAnswer: "Haqiqiy ildizlar yo'q",
          formulaLatex: `D = ${D} < 0`,
          steps: [
            {
              stepNumber: 1,
              title: 'Diskriminantni hisoblash',
              explanation: `D = b² - 4ac = (${b})² - 4 * (${a}) * (${c}) = ${D}.`,
              latex: `D = ${D} < 0`,
            },
            {
              stepNumber: 2,
              title: 'Xulosa',
              explanation: "Diskriminant noldan kichik bo'lgani uchun tenglama haqiqiy sonlar to'plamida ildizga ega emas.",
              latex: '\\emptyset',
            },
          ],
          reply: `**Haqiqiy ildizlar yo'q**\n\nDiskriminant D = ${D} < 0 bo'lgani uchun tenglama haqiqiy ildizga ega emas.`,
        };
      }

      const x1 = (-b + Math.sqrt(D)) / (2 * a);
      const x2 = (-b - Math.sqrt(D)) / (2 * a);
      const ansStr = x1 === x2 ? `x = ${x1}` : `x₁ = ${x1}, x₂ = ${x2}`;

      return {
        success: true,
        isMathematical: true,
        understoodQuery: clean,
        shortAnswer: ansStr,
        formulaLatex: ansStr,
        steps: [
          {
            stepNumber: 1,
            title: 'Diskriminant',
            explanation: `D = b² - 4ac = ${b * b} - 4 * ${a} * ${c} = ${D}.`,
            latex: `D = ${D}`,
          },
          {
            stepNumber: 2,
            title: 'Ildizlar formulasi',
            explanation: `x = (-b ± √D) / (2a) bo'yicha ildizlar: ${ansStr}.`,
            latex: `x_{1,2} = \\frac{-(${b}) \\pm \\sqrt{${D}}}{2 \\cdot ${a}}`,
          },
        ],
        reply: `**${ansStr}**\n\n1) Tenglama: ${clean}\n2) Diskriminant: D = ${D}\n3) Yakuniy javob: **${ansStr}**`,
      };
    }

    return null;
  }

  private static trySolvePercentage(text: string, rawQuery: string): UnderstandingResult | null {
    // "15 ning 20 foizi", "200 ning 15%"
    const match1 = text.match(/(\d+(?:\.\d+)?)\s*(?:ning)?\s+(\d+(?:\.\d+)?)\s*(?:foiz|foizi|%)/i);
    if (match1) {
      const base = parseFloat(match1[1]);
      const pct = parseFloat(match1[2]);
      const res = (base * pct) / 100;
      return {
        success: true,
        isMathematical: true,
        understoodQuery: `${base} ning ${pct}% foizi`,
        shortAnswer: `${res}`,
        formulaLatex: `${base} \\times \\frac{${pct}}{100} = ${res}`,
        steps: [
          {
            stepNumber: 1,
            title: 'Foiz ta’rifi',
            explanation: `Sonning ${pct}% ini topish uchun uni ${pct}/100 ga ko'paytiramiz.`,
            latex: `${base} \\times \\frac{${pct}}{100}`,
          },
          {
            stepNumber: 2,
            title: 'Hisoblash',
            explanation: `${base} * ${pct} = ${base * pct}; ${base * pct} / 100 = ${res}.`,
            latex: `\\mathbf{${res}}`,
          },
        ],
        similarExample: {
          prompt: '100 ning 25 foizini toping',
          formulaLatex: '100 \\times \\frac{25}{100} = 25',
          answer: '25',
        },
        reply: `**${res}**\n\n1) Savol: ${base} ning ${pct}% foizi.\n2) Yechim: ${base} * (${pct} / 100) = ${res}.\n3) Yakuniy javob: **${res}**`,
      };
    }

    // "50 soni 10 foizga oshsa", "50 soni 10 foizga kamaysa"
    const match2 = text.match(/(\d+(?:\.\d+)?)\s*(?:soni)?\s+(\d+(?:\.\d+)?)\s*foizga\s*(oshsa|kamaysa)/i);
    if (match2) {
      const base = parseFloat(match2[1]);
      const pct = parseFloat(match2[2]);
      const isIncrease = match2[3].toLowerCase() === 'oshsa';
      const delta = (base * pct) / 100;
      const res = isIncrease ? base + delta : base - delta;

      return {
        success: true,
        isMathematical: true,
        understoodQuery: `${base} soni ${pct}% ga ${isIncrease ? 'oshsa' : 'kamaysa'}`,
        shortAnswer: `${res}`,
        formulaLatex: `${base} ${isIncrease ? '+' : '-'} ${delta} = ${res}`,
        steps: [
          {
            stepNumber: 1,
            title: 'O‘zgarish miqdorini topish',
            explanation: `${base} ning ${pct}% foizi ${delta} ga teng.`,
            latex: `\\Delta = ${base} \\times \\frac{${pct}}{100} = ${delta}`,
          },
          {
            stepNumber: 2,
            title: 'Yangi qiymat',
            explanation: `${base} ${isIncrease ? 'oshirilganda' : 'kamaytirilganda'}: ${base} ${isIncrease ? '+' : '-'} ${delta} = ${res}.`,
            latex: `\\mathbf{${res}}`,
          },
        ],
        reply: `**${res}**\n\n1) Savol: ${base} soni ${pct}% ga ${isIncrease ? 'oshsa' : 'kamaysa'}.\n2) Yechim: ${base} ${isIncrease ? '+' : '-'} ${delta} = ${res}.\n3) Yakuniy javob: **${res}**`,
      };
    }

    return null;
  }

  private static trySolvePowersAndRoots(text: string, rawQuery: string): UnderstandingResult | null {
    // "5 ning kvadrati", "5 ning kubi", "2 ning 3-darajasi"
    const sqMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:ning)?\s*kvadrati\b/i);
    if (sqMatch) {
      const n = parseFloat(sqMatch[1]);
      const res = n * n;
      return {
        success: true,
        isMathematical: true,
        understoodQuery: `${n} ning kvadrati`,
        shortAnswer: `${res}`,
        formulaLatex: `${n}^2 = ${res}`,
        steps: [
          {
            stepNumber: 1,
            title: 'Kvadratga ko‘tarish',
            explanation: `Sonni kvadratga ko'tarish o'zini o'ziga ko'paytirish demakdir: ${n} * ${n}.`,
            latex: `${n} \\times ${n} = ${res}`,
          },
        ],
        reply: `**${res}**\n\n1) Savol: ${n} ning kvadrati.\n2) Yechim: ${n}² = ${res}.\n3) Yakuniy javob: **${res}**`,
      };
    }

    const cubeMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:ning)?\s*kubi\b/i);
    if (cubeMatch) {
      const n = parseFloat(cubeMatch[1]);
      const res = n * n * n;
      return {
        success: true,
        isMathematical: true,
        understoodQuery: `${n} ning kubi`,
        shortAnswer: `${res}`,
        formulaLatex: `${n}^3 = ${res}`,
        steps: [
          {
            stepNumber: 1,
            title: 'Kubga ko‘tarish',
            explanation: `${n} * ${n} * ${n} = ${res}.`,
            latex: `${n}^3 = ${res}`,
          },
        ],
        reply: `**${res}**\n\n1) Savol: ${n} ning kubi.\n2) Yechim: ${n}³ = ${res}.\n3) Yakuniy javob: **${res}**`,
      };
    }

    const powMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:ning)?\s*(\d+(?:\.\d+)?)\s*[- ]?(?:darajasi|daraja)\b/i);
    if (powMatch) {
      const base = parseFloat(powMatch[1]);
      const exp = parseFloat(powMatch[2]);
      const res = Math.pow(base, exp);
      return {
        success: true,
        isMathematical: true,
        understoodQuery: `${base} ning ${exp}-darajasi`,
        shortAnswer: `${res}`,
        formulaLatex: `${base}^{${exp}} = ${res}`,
        steps: [
          {
            stepNumber: 1,
            title: 'Darajaga ko‘tarish',
            explanation: `${base} soni ${exp} marta o'ziga ko'paytiriladi.`,
            latex: `${base}^{${exp}} = ${res}`,
          },
        ],
        reply: `**${res}**\n\n1) Savol: ${base} ning ${exp}-darajasi.\n2) Yechim: ${base}^${exp} = ${res}.\n3) Yakuniy javob: **${res}**`,
      };
    }

    // "16 ning kvadrat ildizi", "ildiz ostida 16"
    const rootMatch = text.match(/(?:(\d+(?:\.\d+)?)\s*(?:ning)?\s*kvadrat\s+ildizi|ildiz\s+ostida\s+(\d+(?:\.\d+)?))/i);
    if (rootMatch) {
      const n = parseFloat(rootMatch[1] || rootMatch[2]);
      const res = Math.sqrt(n);
      return {
        success: true,
        isMathematical: true,
        understoodQuery: `${n} ning kvadrat ildizi`,
        shortAnswer: `${res}`,
        formulaLatex: `\\sqrt{${n}} = ${res}`,
        steps: [
          {
            stepNumber: 1,
            title: 'Kvadrat ildiz chiqarish',
            explanation: `Qaysi sonning kvadrati ${n} ga teng ekanligi aniqlanadi: ${res}² = ${n}.`,
            latex: `\\sqrt{${n}} = ${res}`,
          },
        ],
        reply: `**${res}**\n\n1) Savol: √${n} kvadrat ildizi.\n2) Yechim: √${n} = ${res}.\n3) Yakuniy javob: **${res}**`,
      };
    }

    return null;
  }

  private static trySolveGeometry(text: string, rawQuery: string): UnderstandingResult | null {
    // 1. Kvadrat yuzi va perimetri: "tomoni 5 bolgan kvadrat yuzi"
    const sqArea = text.match(/tomoni\s+(\d+(?:\.\d+)?)\s*(?:bo'lgan|bolgan|teng)?\s*kvadrat(?:ning)?\s*(yuzi|yuzasi)/i);
    if (sqArea) {
      const a = parseFloat(sqArea[1]);
      const S = a * a;
      return {
        success: true,
        isMathematical: true,
        understoodQuery: `Tomoni ${a} bo'lgan kvadrat yuzi`,
        shortAnswer: `${S}`,
        formulaLatex: `S = a^2 = ${a}^2 = ${S}`,
        steps: [
          {
            stepNumber: 1,
            title: 'Kvadrat yuzi formulasi',
            explanation: 'Kvadratning yuzi uning tomoni kvadratiga teng: S = a².',
            latex: `S = ${a}^2 = ${S}`,
          },
        ],
        reply: `**${S}**\n\nKvadrat yuzi: S = a² = ${a}² = **${S}**.`,
      };
    }

    const sqPerim = text.match(/tomoni\s+(\d+(?:\.\d+)?)\s*(?:bo'lgan|bolgan|teng)?\s*kvadrat(?:ning)?\s*perimetri/i);
    if (sqPerim) {
      const a = parseFloat(sqPerim[1]);
      const P = 4 * a;
      return {
        success: true,
        isMathematical: true,
        understoodQuery: `Tomoni ${a} bo'lgan kvadrat perimetri`,
        shortAnswer: `${P}`,
        formulaLatex: `P = 4a = 4 \\times ${a} = ${P}`,
        steps: [
          {
            stepNumber: 1,
            title: 'Kvadrat perimetri',
            explanation: 'Kvadrat perimetri uning 4 ta tomoni yig‘indisiga teng: P = 4a.',
            latex: `P = 4 \\times ${a} = ${P}`,
          },
        ],
        reply: `**${P}**\n\nKvadrat perimetri: P = 4a = 4 * ${a} = **${P}**.`,
      };
    }

    // 2. To'g'ri to'rtburchak: "tomonlari 4 va 6 bolgan togri tortburchak yuzi"
    const rectArea = text.match(/tomonlari\s+(\d+(?:\.\d+)?)\s*va\s+(\d+(?:\.\d+)?)\s*(?:bo'lgan|bolgan|teng)?\s*(?:tog'ri\s+to'rtburchak|to'rtburchak)\s*(?:yuzi|yuzasi)/i);
    if (rectArea) {
      const a = parseFloat(rectArea[1]);
      const b = parseFloat(rectArea[2]);
      const S = a * b;
      return {
        success: true,
        isMathematical: true,
        understoodQuery: `Tomonlari ${a} va ${b} to'rtburchak yuzi`,
        shortAnswer: `${S}`,
        formulaLatex: `S = a \\times b = ${a} \\times ${b} = ${S}`,
        steps: [
          {
            stepNumber: 1,
            title: 'Yuz formulasi',
            explanation: 'To‘g‘ri to‘rtburchak yuzi bo‘yi va eni ko‘paytmasiga teng: S = a * b.',
            latex: `S = ${a} \\times ${b} = ${S}`,
          },
        ],
        reply: `**${S}**\n\nTo‘g‘ri to‘rtburchak yuzi: S = a * b = ${a} * ${b} = **${S}**.`,
      };
    }

    // 3. Pifagor teoremasi: "katetlari 3 va 4 bolgan uchburchak gipotenuzasi"
    const pythagoras = text.match(/katetlari\s+(\d+(?:\.\d+)?)\s*va\s+(\d+(?:\.\d+)?)\s*(?:bo'lgan|bolgan)?.*gipotenuz/i);
    if (pythagoras) {
      const a = parseFloat(pythagoras[1]);
      const b = parseFloat(pythagoras[2]);
      const c = Math.sqrt(a * a + b * b);
      return {
        success: true,
        isMathematical: true,
        understoodQuery: `Katetlari ${a} va ${b} gipotenuzasi`,
        shortAnswer: `${c}`,
        formulaLatex: `c = \\sqrt{a^2 + b^2} = \\sqrt{${a}^2 + ${b}^2} = ${c}`,
        steps: [
          {
            stepNumber: 1,
            title: 'Pifagor teoremasi',
            explanation: 'To‘g‘ri burchakli uchburchakda gipotenuza kvadrati katetlar kvadratlari yig‘indisiga teng: c² = a² + b².',
            latex: `c = \\sqrt{${a * a} + ${b * b}} = ${c}`,
          },
        ],
        reply: `**${c}**\n\nPifagor teoremasi: c = √(a² + b²) = √(${a}² + ${b}²) = **${c}**.`,
      };
    }

    return null;
  }

  private static trySolveSimpleWordProblem(text: string, rawQuery: string): UnderstandingResult | null {
    // "Alida 5 ta olma bor edi, 3 tasini berdi. Nechta qoldi?"
    const match = text.match(/(\d+)\s*ta\s*([^\s,]+)\s*bor\s*edi[,\s]+(\d+)\s*(?:tasini|tasi|ta)?\s*(?:berdi|yedi|ketdi|ayirildi|sotdi).*nechta\s*qoldi/i);
    if (match) {
      const initial = parseInt(match[1], 10);
      const item = match[2];
      const given = parseInt(match[3], 10);
      const remaining = initial - given;

      return {
        success: true,
        isMathematical: true,
        understoodQuery: `${initial} ta ${item}dan ${given} tasi berildi`,
        shortAnswer: `${remaining}`,
        formulaLatex: `${initial} - ${given} = ${remaining}`,
        steps: [
          {
            stepNumber: 1,
            title: 'Dastlabki miqdor',
            explanation: `Dastlab ${initial} ta ${item} bor edi.`,
            latex: `${initial}`,
          },
          {
            stepNumber: 2,
            title: 'Kamayish miqdori',
            explanation: `${given} tasi berildi, shuning uchun ayiramiz: ${initial} - ${given} = ${remaining}.`,
            latex: `${initial} - ${given} = ${remaining}`,
          },
        ],
        reply: `**${remaining} ta ${item} qoldi**\n\n1) Dastlab: ${initial} ta\n2) Berildi: ${given} ta\n3) Qoldi: ${initial} - ${given} = **${remaining}**`,
      };
    }
    return null;
  }

  private static trySolveNaturalArithmetic(text: string, rawQuery: string): UnderstandingResult | null {
    let expr = text;

    // Normalizing conversational phrases:
    // "5 ga 6 ni qo'shib ber", "beshga oltini qo'shib ber"
    // "5 ga 6 ni qo'sh", "5 ga 6 qo'shsak"
    // "5 va 6 ning yig'indisi", "5 plyus 6"
    expr = expr
      .replace(/(\d+(?:\.\d+)?|\d+\/\d+)\s*(?:ga|ka|qa)\s*(\d+(?:\.\d+)?|\d+\/\d+)\s*(?:ni)?\s*(?:qo'shib\s+ber|qo'sh|qo'shsak|qo'shish|yig'indisi|yigindi|plyus|\+)/gi, '$1 + $2')
      .replace(/(\d+(?:\.\d+)?|\d+\/\d+)\s*bilan\s*(\d+(?:\.\d+)?|\d+\/\d+)\s*(?:ning|ni)?\s*(?:qo'shib\s+ber|qo'sh|qo'shsak|qo'shish|yig'indisi|yigindi|plyus|\+)/gi, '$1 + $2')
      .replace(/(\d+(?:\.\d+)?|\d+\/\d+)\s*va\s*(\d+(?:\.\d+)?|\d+\/\d+)\s*(?:ning)?\s*(?:yig'indisi|yig'indi|yigindisi|yigindi)/gi, '$1 + $2')
      .replace(/(\d+(?:\.\d+)?|\d+\/\d+)\s*plyus\s*(\d+(?:\.\d+)?|\d+\/\d+)/gi, '$1 + $2');

    // Subtraction: "10 dan 4 ni ayir", "10 dan 4 ayirsak", "10 minus 4", "10 va 4 ning ayirmasi"
    expr = expr
      .replace(/(\d+(?:\.\d+)?|\d+\/\d+)\s*dan\s*(\d+(?:\.\d+)?|\d+\/\d+)\s*(?:ni)?\s*(?:ayirib\s+ber|ayir|ayirsak|ayirish|ayirmasi|minus|\-)/gi, '$1 - $2')
      .replace(/(\d+(?:\.\d+)?|\d+\/\d+)\s*va\s*(\d+(?:\.\d+)?|\d+\/\d+)\s*(?:ning)?\s*(?:ayirmasi|ayirma)/gi, '$1 - $2')
      .replace(/(\d+(?:\.\d+)?|\d+\/\d+)\s*minus\s*(\d+(?:\.\d+)?|\d+\/\d+)/gi, '$1 - $2');

    // Multiplication: "5 ni 6 ga ko'paytir", "5 marta 6", "5 ko'paytirish 6", "5 va 6 ning ko'paytmasi", "5 karra 6"
    expr = expr
      .replace(/(\d+(?:\.\d+)?|\d+\/\d+)\s*ni\s*(\d+(?:\.\d+)?|\d+\/\d+)\s*(?:ga|ka|qa)?\s*(?:ko'paytirib\s+ber|ko'paytir|ko'paytirsak|ko'paytirish|karra|\*)/gi, '$1 * $2')
      .replace(/(\d+(?:\.\d+)?|\d+\/\d+)\s*(?:ko'paytirish|ko'paytir|karra|marta)\s*(\d+(?:\.\d+)?|\d+\/\d+)/gi, '$1 * $2')
      .replace(/(\d+(?:\.\d+)?|\d+\/\d+)\s*va\s*(\d+(?:\.\d+)?|\d+\/\d+)\s*(?:ning)?\s*(?:ko'paytmasi|ko'paytma)/gi, '$1 * $2');

    // Division: "20 ni 4 ga bo'l", "20 bo'lish 4", "20 va 4 ning bo'linmasi"
    expr = expr
      .replace(/(\d+(?:\.\d+)?|\d+\/\d+)\s*ni\s*(\d+(?:\.\d+)?|\d+\/\d+)\s*(?:ga|ka|qa)?\s*(?:bo'lib\s+ber|bo'l|bo'lsak|bo'lish|\/)/gi, '$1 / $2')
      .replace(/(\d+(?:\.\d+)?|\d+\/\d+)\s*(?:bo'lish|bo'l|bo'lingan)\s*(\d+(?:\.\d+)?|\d+\/\d+)/gi, '$1 / $2')
      .replace(/(\d+(?:\.\d+)?|\d+\/\d+)\s*va\s*(\d+(?:\.\d+)?|\d+\/\d+)\s*(?:ning)?\s*(?:bo'linmasi|bo'linma)/gi, '$1 / $2');

    // Clean remaining trailing words like "ber", "chiqadi", "bo'ladi", "teng"
    expr = expr
      .replace(/\b(ber|qo'shib\s+ber|hisoblab\s+ber|chiqadi|bo'ladi|teng|nechi|nechchi|necha|qancha|natija)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    return this.trySolveDirectExpression(expr, rawQuery);
  }

  private static trySolveDirectExpression(exprStr: string, rawQuery: string): UnderstandingResult | null {
    // Check if exprStr is a valid mathematical expression
    const cleanExpr = exprStr.replace(/[^0-9+\-*/().^]/g, '').trim();
    if (!cleanExpr || !/\d/.test(cleanExpr)) return null;

    // Must contain at least one mathematical operator to be evaluated (bare numbers are not expressions)
    if (!/[+\-*/^]/.test(cleanExpr)) return null;

    // Check if it has at least one operator or is a valid arithmetic expression
    try {
      const evaluated = evaluate(cleanExpr);
      if (typeof evaluated !== 'number' && typeof evaluated !== 'object') return null;

      let answerNum: number;
      if (typeof evaluated === 'object' && 'entries' in evaluated) {
        answerNum = Number(evaluated.entries[0]);
      } else {
        answerNum = Number(evaluated);
      }

      if (isNaN(answerNum) || !isFinite(answerNum)) return null;

      const formattedAnswer = Number.isInteger(answerNum)
        ? `${answerNum}`
        : `${Math.round(answerNum * 10000) / 10000}`;

      // Check if expression was fractional addition like 1/2 + 1/4 -> 3/4
      let fractionAnswer = '';
      if (cleanExpr.includes('/')) {
        const fracRes = this.tryRationalArithmetic(cleanExpr);
        if (fracRes) fractionAnswer = fracRes;
      }

      const finalAnswer = fractionAnswer || formattedAnswer;

      return {
        success: true,
        isMathematical: true,
        understoodQuery: cleanExpr,
        shortAnswer: finalAnswer,
        formulaLatex: `${cleanExpr} = ${finalAnswer}`,
        steps: [
          {
            stepNumber: 1,
            title: 'Ifodani aniqlash',
            explanation: `Berilgan savol arifmetik ifodaga keltirildi: ${cleanExpr}.`,
            latex: cleanExpr,
          },
          {
            stepNumber: 2,
            title: 'Hisoblash',
            explanation: `Amallar tartibi bo‘yicha hisoblandi: natija ${finalAnswer}.`,
            latex: `${cleanExpr} = ${finalAnswer}`,
          },
        ],
        similarExample: {
          prompt: `Shunga o‘xshash misol: ${cleanExpr}`,
          formulaLatex: `${cleanExpr} = ${finalAnswer}`,
          answer: finalAnswer,
        },
        reply: `**${finalAnswer}**\n\n1) Savol: ${cleanExpr}\n2) Yechim: ${cleanExpr} = ${finalAnswer}\n3) Yakuniy javob: **${finalAnswer}**\n4) Maslahat: Har doim amallar tartibiga rioya qiling.`,
      };
    } catch {
      return null;
    }
  }

  private static tryRationalArithmetic(expr: string): string | null {
    // Simple fraction addition/subtraction: a/b + c/d
    const fracMatch = expr.match(/^(\d+)\/(\d+)\s*([+\-*/])\s*(\d+)\/(\d+)$/);
    if (!fracMatch) return null;

    const n1 = parseInt(fracMatch[1], 10);
    const d1 = parseInt(fracMatch[2], 10);
    const op = fracMatch[3];
    const n2 = parseInt(fracMatch[4], 10);
    const d2 = parseInt(fracMatch[5], 10);

    let num = 0;
    let den = 1;

    if (op === '+') {
      den = this.lcm(d1, d2);
      num = n1 * (den / d1) + n2 * (den / d2);
    } else if (op === '-') {
      den = this.lcm(d1, d2);
      num = n1 * (den / d1) - n2 * (den / d2);
    } else if (op === '*') {
      num = n1 * n2;
      den = d1 * d2;
    } else if (op === '/') {
      num = n1 * d2;
      den = d1 * n2;
    }

    const g = this.gcd(num, den);
    num /= g;
    den /= g;

    if (den === 1) return `${num}`;
    return `${num}/${den}`;
  }

  // --------------------------------------------------------------------------
  // CLOSEST GUESS / FALLBACK
  // --------------------------------------------------------------------------
  private static generateClosestGuess(rawQuery: string, converted: string): UnderstandingResult {
    // Extract any numbers found in query
    const nums = converted.match(/\d+(?:\.\d+)?/g);

    if (nums && nums.length >= 2) {
      const a = nums[0];
      const b = nums[1];
      const sum = parseFloat(a) + parseFloat(b);
      const guessStr = `${a} + ${b}`;

      return {
        success: true,
        isMathematical: true,
        understoodQuery: rawQuery,
        shortAnswer: `${sum}`,
        formulaLatex: `${guessStr} = ${sum}`,
        closestGuess: {
          guess: guessStr,
          prompt: `Siz ${a} ga ${b} ni qo‘shishni so‘rayapsizmi?`,
        },
        suggestedActions: [
          `Ha, ${guessStr} ni hisobla`,
          `Yo‘q, boshqa amal`
        ],
        steps: [
          {
            stepNumber: 1,
            title: 'Taxminiy amal',
            explanation: `Savolda ${a} va ${b} sonlari aniqlandi. Ehtimoliy amal: ${guessStr} = ${sum}.`,
            latex: `${guessStr} = ${sum}`,
          },
        ],
        reply: `Siz **${a} + ${b}** ni so‘rayapsizmi?\n\nAgar shunday bo‘lsa, javob: **${sum}**.\n\nAks holda, iltimos amallarni aniqroq yozing (masalan: "${a} * ${b}" yoki "${a} dan ${b} ni ayir").`,
      };
    }

    return {
      success: false,
      isMathematical: false,
      understoodQuery: rawQuery,
      shortAnswer: 'Savol noaniq',
      formulaLatex: '',
      suggestedActions: [
        '5 ga 6 ni qo‘shib ber',
        '24 va 36 ning EKUB',
        '10 dan 4 ni ayir',
        '15 ning 20 foizi'
      ],
      steps: [],
      reply: 'Savolni to‘liq tushunmadim. Men matematika ustoziman! Iltimos, namunadagidek savol bering:\n- "5 ga 6 ni qo‘shib ber"\n- "10 dan 4 ni ayir"\n- "15 ning 20 foizi"\n- "2x + 6 = 16"',
    };
  }

  // Primitives
  private static gcd(a: number, b: number): number {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  }

  private static lcm(a: number, b: number): number {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / this.gcd(a, b);
  }

  public static generateSimilar(previousFormulaOrText?: string): { prompt: string; formulaLatex: string; answer: string; reply: string } {
    if (!previousFormulaOrText) {
      return {
        prompt: '4 ga 7 ni qo‘shib ber',
        formulaLatex: '4 + 7 = 11',
        answer: '11',
        reply: 'Mana sizga mashq qilish uchun ajoyib misol:\n\n**4 + 7 = ?**\nQani, urinib ko‘ring-chi!',
      };
    }

    const clean = previousFormulaOrText.replace(/\$/g, '').trim();

    // If it was linear equation: e.g. x + a = b
    const eqMatch = clean.match(/x\s*([+-])\s*(\d+)\s*=\s*(\d+)/i);
    if (eqMatch) {
      const op = eqMatch[1];
      const a = parseInt(eqMatch[2], 10) + 2;
      const b = parseInt(eqMatch[3], 10) + 5;
      const ans = op === '+' ? b - a : b + a;
      const expr = `x ${op} ${a} = ${b}`;
      return {
        prompt: `${expr} tenglamasini yeching`,
        formulaLatex: expr,
        answer: `x = ${ans}`,
        reply: `Mana sizga o‘xshash yangi tenglama:\n\n$${expr}$\n\nQani, x ning qiymatini topishga urinib ko‘ring!`,
      };
    }

    // If it was arithmetic: a + b, a - b, a * b, a / b
    const arithMatch = clean.match(/(\d+)\s*([+\-*\/])\s*(\d+)/);
    if (arithMatch) {
      const a = parseInt(arithMatch[1], 10) + 3;
      const op = arithMatch[2];
      const b = parseInt(arithMatch[3], 10) + 2;
      let ans = 0;
      if (op === '+') ans = a + b;
      else if (op === '-') ans = a - b;
      else if (op === '*') ans = a * b;
      else if (op === '/') ans = Math.round((a / b) * 100) / 100;

      const expr = `${a} ${op} ${b}`;
      return {
        prompt: `${expr} ni hisoblang`,
        formulaLatex: `${expr} = ${ans}`,
        answer: `${ans}`,
        reply: `Oldingi misolga o‘xshash yangi mashq:\n\n**${expr} = ?**\n\nQani, hisoblab ko‘ring!`,
      };
    }

    // Default fallback
    return {
      prompt: '8 ga 9 ni qo‘shing',
      formulaLatex: '8 + 9 = 17',
      answer: '17',
      reply: 'Mana sizga mashq qilish uchun ajoyib misol:\n\n**8 + 9 = ?**\nQani, urinib ko‘ring-chi!',
    };
  }

  public static explainSimpler(previousFormulaOrText?: string): string {
    if (!previousFormulaOrText) {
      return 'Keling, buni oddiyroq tushuntiraman: Har bir matematik amal — bu hayotdagi oddiy sanash jarayonidir. Masalan, qo‘shish — narsalarni bir savatga to‘plash, ayirish esa ulardan ayrimlarini ajratib olishdir!';
    }

    const clean = previousFormulaOrText.replace(/\$/g, '').trim();
    if (clean.includes('=')) {
      return `Keling, tenglamani yanada soddaroq, qadimiy tarozi qoidasi bilan tushuntiraman!\n\n` +
        `Tasavvur qiling, tenglama — bu muvozanatda turgan ikki pallali tarozi. ` +
        `Bir pallada noma’lum (x) va ma’lum sonlar, ikkinchi pallada esa natija turibdi.\n\n` +
        `Muvozanat buzilmasligi uchun, bir tomonga nima qilsak (qo‘shsak yoki ayirsak), ikkinchi tomonga ham xuddi shuni qilishimiz kerak! ` +
        `Shu sababli sonlar tenglikning narigi tomoniga qarama-qarshi ishora bilan o‘tadi.`;
    }

    return `Ushbu amalni yanada soddaroq qadamlar bilan tushuntiraman:\n\n` +
      `Keling, buni olma yoki qalamlar misolida ko‘ramiz. Masalan, bitta qutida ma’lum miqdorda narsalar bor. ` +
      `Amalni bosqichma-bosqich bo‘lib bajarsak, hisoblash juda oson va qiziqarli bo‘ladi!`;
  }
}
