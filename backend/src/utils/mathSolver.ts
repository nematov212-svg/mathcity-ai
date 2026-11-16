export interface MathSolution {
  originalQuestion: string;
  problemType: 'EQUATION' | 'ARITHMETIC' | 'FRACTION' | 'PERCENTAGE' | 'GEOMETRY' | 'GENERAL';
  formulaLatex: string;
  steps: { stepNumber: number; title: string; explanation: string; latex: string }[];
  finalAnswer: string;
  similarExample: { prompt: string; formulaLatex: string };
  rawReply: string;
}

export class MathSolver {
  /**
   * Translates common Uzbek spoken or written math phrases to canonical mathematical symbols
   */
  public static normalizeQuestion(input: string): string {
    let clean = input
      .trim()
      .replace(/tenglamani\s+yech/gi, '')
      .replace(/yechib\s+ber/gi, '')
      .replace(/hisoblang/gi, '')
      .replace(/hisoblab\s+ber/gi, '')
      .replace(/javobi\s+qancha/gi, '')
      .replace(/nechchi\s+bo‘ladi/gi, '')
      .replace(/necha\s+bo‘ladi/gi, '')
      .replace(/nechiga\s+teng/gi, '')
      .replace(/\?/g, '')
      .trim();

    // Convert Uzbek number words if present (for voice queries)
    clean = clean
      .replace(/nol/gi, '0')
      .replace(/bir/gi, '1')
      .replace(/ikki/gi, '2')
      .replace(/uch/gi, '3')
      .replace(/to‘rt|tort/gi, '4')
      .replace(/besh/gi, '5')
      .replace(/olti/gi, '6')
      .replace(/yetti/gi, '7')
      .replace(/sakkiz/gi, '8')
      .replace(/to‘qqiz|toqqiz/gi, '9')
      .replace(/o‘n|on/gi, '10')
      .replace(/yigirma/gi, '20')
      .replace(/o‘ttiz|ottiz/gi, '30')
      .replace(/qirq/gi, '40')
      .replace(/ellik/gi, '50')
      .replace(/oltmish/gi, '60')
      .replace(/yetmish/gi, '70')
      .replace(/sakson/gi, '80')
      .replace(/to‘qson|toqson/gi, '90')
      .replace(/yuz/gi, '100');

    // Convert spoken operators
    clean = clean
      .replace(/qo‘shsak|qo‘shish|plus|\+/gi, '+')
      .replace(/ayirsak|ayirish|minus|\-/gi, '-')
      .replace(/ko‘paytirsak|kopaytirsak|karra|ko‘paytirish|\*|×/gi, '*')
      .replace(/bo‘lsak|bolsak|bo‘lish|bolish|\/|÷|:/gi, '/');

    return clean.replace(/\s+/g, ' ').trim();
  }

  /**
   * Deterministically solves linear equations, arithmetic, and expressions in Uzbek
   */
  public static solve(question: string): MathSolution | null {
    const norm = this.normalizeQuestion(question);

    // 1. Linear Equation: ax + b = c  (e.g., "2x + 6 = 16" or "2x - 6 = 16")
    const eqMatch = norm.match(/^([+-]?\d*)\s*([a-zA-Z])\s*([+-])\s*(\d+)\s*=\s*([+-]?\d+)$/);
    if (eqMatch) {
      const aStr = eqMatch[1].trim();
      const variable = eqMatch[2];
      const sign = eqMatch[3];
      const b = parseInt(eqMatch[4], 10);
      const c = parseInt(eqMatch[5], 10);
      const a = aStr === '' || aStr === '+' ? 1 : aStr === '-' ? -1 : parseInt(aStr, 10);

      const rhs1 = sign === '+' ? c - b : c + b;
      const xVal = rhs1 / a;
      const formattedAns = Number.isInteger(xVal) ? xVal.toString() : xVal.toFixed(2);

      const steps = [
        {
          stepNumber: 1,
          title: "Berilgan tenglama",
          explanation: `Boshlang‘ich tenglamani yozib olamiz:`,
          latex: `${a === 1 ? '' : a}${variable} ${sign} ${b} = ${c}`,
        },
        {
          stepNumber: 2,
          title: "Ozod hadni o‘ng tomonga o‘tkazish",
          explanation: sign === '+' 
            ? `Tenglikning har ikki tomonidan ${b} ni ayiramiz:`
            : `Tenglikning har ikki tomoniga ${b} ni qo‘shamiz:`,
          latex: `${a === 1 ? '' : a}${variable} = ${c} ${sign === '+' ? '-' : '+'} ${b} \\implies ${a === 1 ? '' : a}${variable} = ${rhs1}`,
        },
        {
          stepNumber: 3,
          title: `Noma’lum ${variable} ni topish`,
          explanation: a !== 1 
            ? `Tenglikning har ikki tomonini ${variable} ning koeffitsiyenti (${a}) ga bo‘lamiz:`
            : `Noma’lum topildi:`,
          latex: `${variable} = \\frac{${rhs1}}{${a}} \\implies ${variable} = ${formattedAns}`,
        },
      ];

      return {
        originalQuestion: question,
        problemType: 'EQUATION',
        formulaLatex: `${a === 1 ? '' : a}${variable} ${sign} ${b} = ${c}`,
        steps,
        finalAnswer: `${variable} = ${formattedAns}`,
        similarExample: {
          prompt: `3x + 4 = 19 tenglamani yeching`,
          formulaLatex: `3x + 4 = 19`,
        },
        rawReply: `Tenglama bosqichma-bosqich yechildi:\n\n1. ${a === 1 ? '' : a}${variable} ${sign} ${b} = ${c}\n2. ${sign === '+' ? `${b} ni ayiramiz` : `${b} ni qo‘shamiz`}: ${a === 1 ? '' : a}${variable} = ${rhs1}\n3. ${a} ga bo‘lamiz: ${variable} = ${formattedAns}\n\nJavob: ${variable} = ${formattedAns}`,
      };
    }

    // 2. Simple Linear Equation: ax = c (e.g. "5x = 35")
    const simpleEqMatch = norm.match(/^([+-]?\d*)\s*([a-zA-Z])\s*=\s*([+-]?\d+)$/);
    if (simpleEqMatch) {
      const aStr = simpleEqMatch[1].trim();
      const variable = simpleEqMatch[2];
      const c = parseInt(simpleEqMatch[3], 10);
      const a = aStr === '' || aStr === '+' ? 1 : aStr === '-' ? -1 : parseInt(aStr, 10);
      const xVal = c / a;
      const formattedAns = Number.isInteger(xVal) ? xVal.toString() : xVal.toFixed(2);

      return {
        originalQuestion: question,
        problemType: 'EQUATION',
        formulaLatex: `${a}${variable} = ${c}`,
        steps: [
          {
            stepNumber: 1,
            title: "Berilgan tenglama",
            explanation: `Boshlang‘ich ifoda:`,
            latex: `${a}${variable} = ${c}`,
          },
          {
            stepNumber: 2,
            title: "Bo‘lish amali",
            explanation: `Har ikki tomonni ${a} ga bo‘lamiz:`,
            latex: `${variable} = \\frac{${c}}{${a}} = ${formattedAns}`,
          },
        ],
        finalAnswer: `${variable} = ${formattedAns}`,
        similarExample: {
          prompt: `4x = 28`,
          formulaLatex: `4x = 28`,
        },
        rawReply: `Tenglama yechimi:\n${a}${variable} = ${c} => ${variable} = ${c} / ${a} => ${variable} = ${formattedAns}`,
      };
    }

    // 3. Basic Arithmetic: A + B, A - B, A * B, A / B (e.g. "25 / 5" or "12 * 8")
    const arithMatch = norm.match(/^(\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\d+(?:\.\d+)?)$/);
    if (arithMatch) {
      const num1 = parseFloat(arithMatch[1]);
      const op = arithMatch[2];
      const num2 = parseFloat(arithMatch[3]);
      let ans = 0;
      let opName = '';
      let latexSymbol = op;

      if (op === '+') {
        ans = num1 + num2;
        opName = "qo‘shish";
        latexSymbol = '+';
      } else if (op === '-') {
        ans = num1 - num2;
        opName = "ayirish";
        latexSymbol = '-';
      } else if (op === '*') {
        ans = num1 * num2;
        opName = "ko‘paytirish";
        latexSymbol = '\\times';
      } else if (op === '/') {
        if (num2 === 0) return null;
        ans = num1 / num2;
        opName = "bo‘lish";
        latexSymbol = '\\div';
      }

      const formattedAns = Number.isInteger(ans) ? ans.toString() : ans.toFixed(2);

      return {
        originalQuestion: question,
        problemType: 'ARITHMETIC',
        formulaLatex: `${num1} ${latexSymbol} ${num2} = ${formattedAns}`,
        steps: [
          {
            stepNumber: 1,
            title: `${opName.toUpperCase()} amali`,
            explanation: `${num1} soniga ${num2} sonini ${opName} bajaramiz:`,
            latex: `${num1} ${latexSymbol} ${num2} = ${formattedAns}`,
          },
        ],
        finalAnswer: formattedAns,
        similarExample: {
          prompt: `O‘xshash misol: ${num1 + 5} ${latexSymbol} ${num2}`,
          formulaLatex: `${num1 + 5} ${latexSymbol} ${num2}`,
        },
        rawReply: `${num1} va ${num2} sonlari ustida ${opName} amali bajarildi:\n${num1} ${latexSymbol} ${num2} = ${formattedAns}`,
      };
    }

    // 4. Percentage: X ning Y foizi (e.g. "40 ning 20 foizi")
    const percMatch = question.match(/(\d+)\s*(?:ning|dan)?\s*(\d+)\s*foizi?/i);
    if (percMatch) {
      const total = parseFloat(percMatch[1]);
      const percent = parseFloat(percMatch[2]);
      const result = (total * percent) / 100;

      return {
        originalQuestion: question,
        problemType: 'PERCENTAGE',
        formulaLatex: `\\frac{${total} \\times ${percent}}{100} = ${result}`,
        steps: [
          {
            stepNumber: 1,
            title: "Foiz formulasi",
            explanation: `Sonning foizini topish uchun sonni foiz ko‘rsatkichiga ko‘paytirib, 100 ga bo‘lamiz:`,
            latex: `\\text{Natija} = \\frac{A \\times P}{100}`,
          },
          {
            stepNumber: 2,
            title: "Hisoblash",
            explanation: `${total} × ${percent} = ${total * percent}. Endi 100 ga bo‘lamiz:`,
            latex: `\\frac{${total * percent}}{100} = ${result}`,
          },
        ],
        finalAnswer: result.toString(),
        similarExample: {
          prompt: `50 ning 10 foizi qancha?`,
          formulaLatex: `\\frac{50 \\times 10}{100} = 5`,
        },
        rawReply: `${total} ning ${percent}% i hisoblandi: ${result}`,
      };
    }

    return null;
  }
}
