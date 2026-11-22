import { MathUnderstandingEngine } from '../src/utils/mathUnderstandingEngine.js';

describe('MathUnderstandingEngine — 200+ Uzbek Mathematical Language Tests', () => {
  // --------------------------------------------------------------------------
  // Category 1: User's Primary Required Tests
  // --------------------------------------------------------------------------
  test('1. "5 ga 6 ni qo‘shib ber" -> 11', () => {
    const res = MathUnderstandingEngine.solve("5 ga 6 ni qo'shib ber");
    expect(res.success).toBe(true);
    expect(res.shortAnswer).toBe('11');
  });

  test('2. "manga beshga oltini qo‘shib bir" -> 11', () => {
    const res = MathUnderstandingEngine.solve('manga beshga oltini qo‘shib bir');
    expect(res.success).toBe(true);
    expect(res.shortAnswer).toBe('11');
  });

  // --------------------------------------------------------------------------
  // Category 2: Addition variations (30 tests)
  // --------------------------------------------------------------------------


  const additionCases: [string, string][] = [
    ["5 ga 6 ni qo'sh", '11'],
    ["5 ga 6 qo'shsak", '11'],
    ["5 va 6 ning yig'indisi", '11'],
    ['5 plyus 6', '11'],
    ['5 + 6', '11'],
    ['besh plyus olti', '11'],
    ['beshga oltini qoshib ber', '11'],
    ['besh va olti yigindisi', '11'],
    ['12 ga 8 ni qoshib ber', '20'],
    ['yigirma beshga o‘ttiz beshni qo‘shib ber', '60'],
    ['100 ga 250 ni qo‘sh', '350'],
    ['bir yuz ellikka ellikni qo‘sh', '200'],
    ['o‘n besh plyus yigirma', '35'],
    ['7 bilan 8 ning yig‘indisi', '15'],
    ['yetti va sakkiz yig‘indisi', '15'],
    ['nolga beshni qo‘sh', '5'],
    ['o‘n ikkiga o‘n sakkizni qo‘sh', '30'],
    ['40 ga 60 qo‘shsak', '100'],
    ['qirqga oltmishni qo‘shib ber', '100'],
    ['99 ga 1 ni qo‘sh', '100'],
    ['to‘qson to‘qqizga birni qo‘shib ber', '100'],
    ['14 + 16', '30'],
    ['25 + 75', '100'],
    ['123 + 321', '444'],
    ['beshga beshni qo‘sh', '10'],
    ['uchga to‘rtni qo‘shib bir', '7'],
    ['ikkiga uchni qo‘sh', '5'],
    ['o‘ttizga qirqni qo‘sh', '70'],
    ['saksonga yigirmani qo‘sh', '100'],
    ['bir mingga ikki mingni qo‘sh', '3000'],
  ];

  additionCases.forEach(([prompt, expected], idx) => {
    test(`Addition #${idx + 1}: "${prompt}" -> ${expected}`, () => {
      const res = MathUnderstandingEngine.solve(prompt);
      expect(res.success).toBe(true);
      expect(res.shortAnswer).toBe(expected);
    });
  });

  // --------------------------------------------------------------------------
  // Category 3: Subtraction variations (30 tests)
  // --------------------------------------------------------------------------
  const subtractionCases: [string, string][] = [
    ['10 dan 4 ni ayir', '6'],
    ['10 dan 4 ayirsak', '6'],
    ['10 minus 4', '6'],
    ['10 va 4 ning ayirmasi', '6'],
    ['10 - 4', '6'],
    ['o‘ndan to‘rtni ayir', '6'],
    ['o‘ndan to‘rtni ayirib ber', '6'],
    ['yigirmadan o‘nni ayir', '10'],
    ['50 dan 15 ni ayir', '35'],
    ['ellikdan o‘n beshni ayirib bir', '35'],
    ['100 dan 45 ni ayir', '55'],
    ['yuzdan qirq beshni ayir', '55'],
    ['75 minus 25', '50'],
    ['sakson beshdan yigirmani ayir', '65'],
    ['to‘qqizdan uchni ayir', '6'],
    ['o‘n yettidan sakkizni ayir', '9'],
    ['yigirma besh minus o‘n besh', '10'],
    ['30 dan 12 ayirsak', '18'],
    ['qirqdan o‘n beshni ayir', '25'],
    ['60 dan 25 ni ayirib ber', '35'],
    ['oltmishdan yigirma beshni ayir', '35'],
    ['200 dan 50 ni ayir', '150'],
    ['ikki yuzdan ellikni ayir', '150'],
    ['15 - 7', '8'],
    ['50 - 20', '30'],
    ['500 dan 200 ayir', '300'],
    ['o‘ttizdan o‘n beshni ayir', '15'],
    ['o‘n sakkiz minus to‘qqiz', '9'],
    ['yetmishdan o‘ttizni ayir', '40'],
    ['bir mingdan uch yuzni ayir', '700'],
  ];

  subtractionCases.forEach(([prompt, expected], idx) => {
    test(`Subtraction #${idx + 1}: "${prompt}" -> ${expected}`, () => {
      const res = MathUnderstandingEngine.solve(prompt);
      expect(res.success).toBe(true);
      expect(res.shortAnswer).toBe(expected);
    });
  });

  // --------------------------------------------------------------------------
  // Category 4: Multiplication variations (30 tests)
  // --------------------------------------------------------------------------
  const multiplicationCases: [string, string][] = [
    ['5 ni 6 ga ko‘paytir', '30'],
    ['5 marta 6', '30'],
    ['5 ko‘paytirish 6', '30'],
    ['5 va 6 ning ko‘paytmasi', '30'],
    ['5 * 6', '30'],
    ['5 karra 6', '30'],
    ['beshni oltiga ko‘paytir', '30'],
    ['beshni oltiga kopaytirib ber', '30'],
    ['besh karra olti', '30'],
    ['to‘rtni beshga ko‘paytir', '20'],
    ['uch karra yetti', '21'],
    ['sakkiz karra sakkiz', '64'],
    ['to‘qqiz karra to‘qqiz', '81'],
    ['o‘nni o‘nga ko‘paytir', '100'],
    ['12 ni 5 ga ko‘paytir', '60'],
    ['15 marta 4', '60'],
    ['yigirmani uchga ko‘paytir', '60'],
    ['25 ni 4 ga ko‘paytir', '100'],
    ['yigirma besh karra to‘rt', '100'],
    ['ellikni ikkiga ko‘paytir', '100'],
    ['6 * 7', '42'],
    ['olti karra yetti', '42'],
    ['oltini yettiga ko‘paytirib bir', '42'],
    ['8 * 9', '72'],
    ['sakkizni to‘qqizga ko‘paytir', '72'],
    ['30 ni 3 ga ko‘paytir', '90'],
    ['11 karra 11', '121'],
    ['20 marta 5', '100'],
    ['uchni o‘nga ko‘paytir', '30'],
    ['yuzni ikkiga ko‘paytir', '200'],
  ];

  multiplicationCases.forEach(([prompt, expected], idx) => {
    test(`Multiplication #${idx + 1}: "${prompt}" -> ${expected}`, () => {
      const res = MathUnderstandingEngine.solve(prompt);
      expect(res.success).toBe(true);
      expect(res.shortAnswer).toBe(expected);
    });
  });

  // --------------------------------------------------------------------------
  // Category 5: Division variations (30 tests)
  // --------------------------------------------------------------------------
  const divisionCases: [string, string][] = [
    ['20 ni 4 ga bo‘l', '5'],
    ['20 bo‘lish 4', '5'],
    ['20 va 4 ning bo‘linmasi', '5'],
    ['20 / 4', '5'],
    ['yigirmani to‘rtga bo‘l', '5'],
    ['yigirmani tortga bolib ber', '5'],
    ['yigirmani to‘rtga bo‘lib bir', '5'],
    ['100 ni 5 ga bo‘l', '20'],
    ['yuzni beshga bo‘l', '20'],
    ['yuzni ikkiga bo‘l', '50'],
    ['50 ni 2 ga bo‘l', '25'],
    ['ellikni ikkiga bo‘lib ber', '25'],
    ['36 ni 6 ga bo‘l', '6'],
    ['o‘ttiz oltini oltiga bo‘l', '6'],
    ['45 ni 9 ga bo‘l', '5'],
    ['qirq beshni to‘qqizga bo‘l', '5'],
    ['64 ni 8 ga bo‘l', '8'],
    ['oltmish to‘rtni sakkizga bo‘l', '8'],
    ['81 ni 9 ga bo‘l', '9'],
    ['sakson birni to‘qqizga bo‘l', '9'],
    ['10 / 2', '5'],
    ['12 / 3', '4'],
    ['15 / 5', '3'],
    ['18 / 2', '9'],
    ['o‘n ikkini uchga bo‘l', '4'],
    ['o‘n beshni uchga bo‘l', '5'],
    ['yetmish ikkini sakkizga bo‘l', '9'],
    ['90 ni 3 ga bo‘l', '30'],
    ['to‘qsonni uchga bo‘l', '30'],
    ['500 ni 5 ga bo‘l', '100'],
  ];

  divisionCases.forEach(([prompt, expected], idx) => {
    test(`Division #${idx + 1}: "${prompt}" -> ${expected}`, () => {
      const res = MathUnderstandingEngine.solve(prompt);
      expect(res.success).toBe(true);
      expect(res.shortAnswer).toBe(expected);
    });
  });

  // --------------------------------------------------------------------------
  // Category 6: Percentage variations (20 tests)
  // --------------------------------------------------------------------------
  const percentageCases: [string, string][] = [
    ['15 ning 20 foizi', '3'],
    ['200 ning 15%', '30'],
    ['100 ning 10 foizi', '10'],
    ['100 ning 25 foizi', '25'],
    ['100 ning 50 foizi', '50'],
    ['200 ning 50 foizi', '100'],
    ['50 ning 10 foizi', '5'],
    ['80 ning 25 foizi', '20'],
    ['60 ning 30 foizi', '18'],
    ['40 ning 50 foizi', '20'],
    ['50 soni 10 foizga oshsa', '55'],
    ['50 soni 10 foizga kamaysa', '45'],
    ['100 soni 20 foizga oshsa', '120'],
    ['100 soni 20 foizga kamaysa', '80'],
    ['200 soni 10 foizga oshsa', '220'],
    ['40 soni 25 foizga oshsa', '50'],
    ['300 ning 10 foizi', '30'],
    ['500 ning 20 foizi', '100'],
    ['80 soni 50 foizga oshsa', '120'],
    ['80 soni 50 foizga kamaysa', '40'],
  ];

  percentageCases.forEach(([prompt, expected], idx) => {
    test(`Percentage #${idx + 1}: "${prompt}" -> ${expected}`, () => {
      const res = MathUnderstandingEngine.solve(prompt);
      expect(res.success).toBe(true);
      expect(res.shortAnswer).toBe(expected);
    });
  });

  // --------------------------------------------------------------------------
  // Category 7: Powers & Roots (20 tests)
  // --------------------------------------------------------------------------
  const powerRootCases: [string, string][] = [
    ['5 ning kvadrati', '25'],
    ['besh ning kvadrati', '25'],
    ['6 ning kvadrati', '36'],
    ['olti ning kvadrati', '36'],
    ['7 ning kvadrati', '49'],
    ['8 ning kvadrati', '64'],
    ['9 ning kvadrati', '81'],
    ['10 ning kvadrati', '100'],
    ['o‘n ning kvadrati', '100'],
    ['2 ning kubi', '8'],
    ['3 ning kubi', '27'],
    ['4 ning kubi', '64'],
    ['2 ning 3-darajasi', '8'],
    ['2 ning 4-darajasi', '16'],
    ['3 ning 2-darajasi', '9'],
    ['16 ning kvadrat ildizi', '4'],
    ['ildiz ostida 25', '5'],
    ['ildiz ostida 36', '6'],
    ['ildiz ostida 49', '7'],
    ['ildiz ostida 64', '8'],
  ];

  powerRootCases.forEach(([prompt, expected], idx) => {
    test(`Powers & Roots #${idx + 1}: "${prompt}" -> ${expected}`, () => {
      const res = MathUnderstandingEngine.solve(prompt);
      expect(res.success).toBe(true);
      expect(res.shortAnswer).toBe(expected);
    });
  });

  // --------------------------------------------------------------------------
  // Category 8: Equations (20 tests)
  // --------------------------------------------------------------------------
  const equationCases: [string, string][] = [
    ['x + 3 = 10 ni yech', 'x = 7'],
    ['x + 5 = 15', 'x = 10'],
    ['x - 4 = 10', 'x = 14'],
    ['x - 7 = 3', 'x = 10'],
    ['2x + 6 = 16', 'x = 5'],
    ['3x + 9 = 21', 'x = 4'],
    ['4x - 8 = 12', 'x = 5'],
    ['5x + 10 = 35', 'x = 5'],
    ['2x = 10', 'x = 5'],
    ['3x = 18', 'x = 6'],
    ['4x = 24', 'x = 6'],
    ['5x = 45', 'x = 9'],
    ['6x = 42', 'x = 7'],
    ['x + 20 = 50', 'x = 30'],
    ['x - 15 = 25', 'x = 40'],
    ['2x + 4 = 20', 'x = 8'],
    ['3x - 6 = 18', 'x = 8'],
    ['x^2 - 5x + 6 = 0', 'x₁ = 3, x₂ = 2'],
    ['x^2 - 4 = 0', 'x₁ = 2, x₂ = -2'],
    ['x^2 - 9 = 0', 'x₁ = 3, x₂ = -3'],
  ];

  equationCases.forEach(([prompt, expected], idx) => {
    test(`Equations #${idx + 1}: "${prompt}" -> ${expected}`, () => {
      const res = MathUnderstandingEngine.solve(prompt);
      expect(res.success).toBe(true);
      expect(res.shortAnswer).toBe(expected);
    });
  });

  // --------------------------------------------------------------------------
  // Category 9: Fractions, GCD, LCM & Geometry (25 tests)
  // --------------------------------------------------------------------------
  const miscMathCases: [string, string][] = [
    ['1/2 + 1/4', '3/4'],
    ['yarim va chorak yig‘indisi', '3/4'],
    ['1/3 + 1/3', '2/3'],
    ['1/5 + 2/5', '3/5'],
    ['3/4 - 1/4', '1/2'],
    ['24 va 36 ning EKUB', '12'],
    ['12 va 18 ning EKUB', '6'],
    ['18 va 24 ning EKUB', '6'],
    ['8 va 12 ning EKUB', '4'],
    ['10 va 15 ning EKUB', '5'],
    ['12 va 18 ning EKUK', '36'],
    ['4 va 6 ning EKUK', '12'],
    ['8 va 12 ning EKUK', '24'],
    ['10 va 15 ning EKUK', '30'],
    ['6 va 9 ning EKUK', '18'],
    ['tomoni 5 bo‘lgan kvadrat yuzi', '25'],
    ['tomoni 6 bo‘lgan kvadrat yuzi', '36'],
    ['tomoni 4 bo‘lgan kvadrat perimetri', '16'],
    ['tomoni 7 bo‘lgan kvadrat perimetri', '28'],
    ['tomonlari 4 va 6 bo‘lgan to‘rtburchak yuzi', '24'],
    ['tomonlari 3 va 5 bo‘lgan to‘rtburchak yuzi', '15'],
    ['katetlari 3 va 4 bo‘lgan uchburchak gipotenuzasi', '5'],
    ['katetlari 6 va 8 bo‘lgan uchburchak gipotenuzasi', '10'],
    ['Alida 5 ta olma bor edi, 3 tasini berdi. Nechta qoldi?', '2'],
    ['Maktabda 10 ta to‘p bor edi, 4 tasini berdi. Nechta qoldi?', '6'],
  ];

  miscMathCases.forEach(([prompt, expected], idx) => {
    test(`Misc Math #${idx + 1}: "${prompt}" -> ${expected}`, () => {
      const res = MathUnderstandingEngine.solve(prompt);
      expect(res.success).toBe(true);
      expect(res.shortAnswer).toBe(expected);
    });
  });

  // --------------------------------------------------------------------------
  // Category 10: Closest Guess on Incomplete / Ambiguous Queries
  // --------------------------------------------------------------------------
  test('Ambiguous query "besh olti" generates closest guess 5 + 6 = 11 with actions', () => {
    const res = MathUnderstandingEngine.solve('besh olti');
    expect(res.closestGuess).toBeDefined();
    expect(res.closestGuess?.guess).toBe('5 + 6');
    expect(res.suggestedActions).toContain('Ha, 5 + 6 ni hisobla');
  });

  test('Non-math query politely redirects to math', () => {
    const res = MathUnderstandingEngine.solve('Bugun ob-havo qanday?');
    expect(res.isMathematical).toBe(false);
    expect(res.reply).toContain('Men matematika ustoziman');
  });
});
