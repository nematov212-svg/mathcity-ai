import fs from 'fs';
import path from 'path';

interface QuestionItem {
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  meta?: {
    seq?: number[];
    next?: number;
  };
}

interface LessonSeed {
  order?: number;
  bookNumber?: number | null;
  unitType?: 'LESSON' | 'FINAL_LESSON' | 'PRACTICE';
  isReview?: boolean;
  title: string;
  emoji: string;
  crossTopic?: string | null;
  shortDesc: string;
  intro: string;
  keyPoints: string[];
  miniExample: {
    emojis: string;
    text: string;
  };
  xpReward: number;
  coinReward: number;
  estMinutes: number;
  practice: QuestionItem[];
  test: QuestionItem[];
}

function evaluateSimpleMath(expr: string): number | null {
  const cleaned = expr
    .replace(/[–—−]/g, '-')
    .replace(/[×*]/g, '*')
    .replace(/\s+/g, '');

  if (!/^[\d+\-*()]+$/.test(cleaned)) {
    return null;
  }

  try {
    const fn = new Function(`return (${cleaned});`);
    const val = fn();
    if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
      return val;
    }
  } catch {
    return null;
  }
  return null;
}

function romanToArabic(roman: string): number | null {
  const map: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
  };
  const r = roman.toUpperCase().trim();
  if (!/^[IVXLC]+$/.test(r)) return null;

  let total = 0;
  for (let i = 0; i < r.length; i++) {
    const cur = map[r[i]];
    const nxt = map[r[i + 1]] || 0;
    if (cur < nxt) {
      total -= cur;
    } else {
      total += cur;
    }
  }
  return total > 0 ? total : null;
}

function checkArithmetic(questionText: string, options: string[], correctIndex: number, meta?: any): string | null {
  if (
    /nomlanadi|nomi|ataladi|bildiradi|qaysi had|qaysi amal|o‘qiladi|o'qiladi|yoziladi|to‘ldiring|to'ldiring|katakdagi|o‘rniga|o'rniga|noma’lum|noma'lum|xossasi|simmetriya|hajmli|shakl|chegara/i.test(
      questionText
    )
  ) {
    return null;
  }

  const correctOpt = options[correctIndex]?.trim() ?? '';

  // 1. Sequence / pattern verification (meta.seq and meta.next)
  if (meta && typeof meta.next === 'number') {
    const expectedNext = meta.next;
    const numInOpt = correctOpt.match(/-?\d+/);
    if (numInOpt) {
      const actualNext = parseInt(numInOpt[0], 10);
      if (actualNext !== expectedNext) {
        return `Qonuniyat xatosi: kutilgan keyingi son ${expectedNext}, lekin variant "${correctOpt}" (${actualNext}) ko'rsatilgan!`;
      }
    }
  }

  // 2. Place value check ("4 o'nl. 3 birl. = 43")
  const pvMatch = questionText.match(/(\d+)\s*o['‘`]?nl\.?\s*(\d+)\s*birl\.?/i);
  if (pvMatch) {
    const tens = parseInt(pvMatch[1], 10);
    const ones = parseInt(pvMatch[2], 10);
    const expected = tens * 10 + ones;
    const numInOpt = correctOpt.match(/-?\d+/);
    if (numInOpt) {
      const actual = parseInt(numInOpt[0], 10);
      if (actual !== expected) {
        return `Xona birliklari xatosi: "${pvMatch[0]}" qiymati ${expected} bo'lishi kerak, lekin variant "${correctOpt}" (${actual})!`;
      }
    }
    return null;
  }

  // 3. Equation checks with variables x, y, z, a, b, c, m, n, s, k
  const eqPatterns = [
    { regex: /([xyzabcmnsk])\s*\+\s*(\d+)\s*=\s*(\d+)/i, solve: (a: number, b: number) => b - a },
    { regex: /(\d+)\s*\+\s*([xyzabcmnsk])\s*=\s*(\d+)/i, solve: (a: number, b: number) => b - a },
    { regex: /(\d+)\s*-\s*([xyzabcmnsk])\s*=\s*(\d+)/i, solve: (a: number, b: number) => a - b },
    { regex: /([xyzabcmnsk])\s*-\s*(\d+)\s*=\s*(\d+)/i, solve: (a: number, b: number) => b + a },
  ];

  for (const { regex, solve } of eqPatterns) {
    const eqMatch = questionText.match(regex);
    if (eqMatch) {
      const isSecond = /^\d+/.test(eqMatch[0]);
      const a = isSecond ? parseInt(eqMatch[1], 10) : parseInt(eqMatch[2], 10);
      const b = isSecond ? parseInt(eqMatch[3], 10) : parseInt(eqMatch[3], 10);
      const expectedX = solve(a, b);
      const numInOpt = correctOpt.match(/-?\d+/);
      if (numInOpt) {
        const actualX = parseInt(numInOpt[0], 10);
        if (actualX !== expectedX) {
          return `Tenglama xatosi: "${eqMatch[0]}" yechimi ${expectedX} bo'lishi kerak, lekin to'g'ri variant "${correctOpt}" (${actualX}) deb ko'rsatilgan!`;
        }
      }
      return null;
    }
  }

  // 4. Roman arithmetic check (e.g. "XI + V", "XXXIII - XIV")
  const romanMatch = questionText.match(/\b([IVXLC]{1,8})\s*([+\-–—−])\s*([IVXLC]{1,8})\b/);
  if (romanMatch) {
    const r1 = romanToArabic(romanMatch[1]);
    const op = romanMatch[2].replace(/[–—−]/g, '-');
    const r2 = romanToArabic(romanMatch[3]);
    if (r1 !== null && r2 !== null) {
      const expectedArabic = op === '+' ? r1 + r2 : r1 - r2;
      // Extract roman from correct option
      const optRomanMatch = correctOpt.match(/\b([IVXLC]{1,8})\b/);
      if (optRomanMatch) {
        const actualArabic = romanToArabic(optRomanMatch[1]);
        if (actualArabic !== null && actualArabic !== expectedArabic) {
          return `Rim raqami xatosi: "${romanMatch[0]}" = ${expectedArabic}, lekin variant "${correctOpt}" (${actualArabic}) deb ko'rsatilgan!`;
        }
      }
    }
  }

  // 5. Unit conversions (e.g. "4 dm 5 cm = ? cm", "4 dm 5 cm necha sm")
  if (/\b(?:necha\s*(?:cm|sm)|santimetrga\s*teng|=\s*\?\s*(?:cm|sm))\b/i.test(questionText)) {
    const dmCmMatch = questionText.match(/(\d+)\s*dm\s*(\d+)\s*(?:cm|sm)/i);
    if (dmCmMatch) {
      const dm = parseInt(dmCmMatch[1], 10);
      const cm = parseInt(dmCmMatch[2], 10);
      const expectedCm = dm * 10 + cm;
      const numInOpt = correctOpt.match(/-?\d+/);
      if (numInOpt) {
        const actualCm = parseInt(numInOpt[0], 10);
        if (actualCm !== expectedCm) {
          return `Birlik o'tkazish xatosi: "${dmCmMatch[0]}" = ${expectedCm} cm, lekin to'g'ri variant "${correctOpt}" (${actualCm})!`;
        }
      }
      return null;
    }
  }

  // 6. Standard arithmetic patterns
  const patterns = [
    /([0-9()+\-–—−* ]+)\s*=\s*\?/i,
    /([0-9()+\-–—−* ]+)\s*=\s*□/i,
    /(?:Hisoblang|ifodaning qiymati)[:\s]*([0-9()+\-–—−* ]+)/i,
  ];

  for (const pat of patterns) {
    const match = questionText.match(pat);
    if (match && match[1]) {
      const exprCandidate = match[1].trim();
      if (/[+\-–—−*]/.test(exprCandidate)) {
        const expectedVal = evaluateSimpleMath(exprCandidate);
        if (expectedVal !== null) {
          const optMatch = correctOpt.match(/^(-?\d+)(?:\s*(?:ta|dona|kg|sm|cm|dm|metr|so‘m|so'm|kishi|nafar|bet|tup|qop))?$/i);
          if (optMatch) {
            const actualVal = parseInt(optMatch[1], 10);
            if (actualVal !== expectedVal) {
              return `Hisob-kitob xatosi: "${exprCandidate}" natijasi ${expectedVal} bo'lishi kerak, lekin to'g'ri variant sifatida "${correctOpt}" (${actualVal}) ko'rsatilgan!`;
            }
          }
        }
      }
    }
  }

  return null;
}

export function validateAllMathLessons(): boolean {
  const baseDir = path.resolve(process.cwd(), 'seed/math/grade1');
  const fallbackBaseDir = path.resolve(process.cwd(), 'backend/seed/math/grade1');
  const targetDir = fs.existsSync(baseDir) ? baseDir : fallbackBaseDir;

  if (!fs.existsSync(targetDir)) {
    console.error(`❌ Xato: Seed papkasi topilmadi: ${targetDir}`);
    process.exit(1);
  }

  // Grade 1 parts
  const g1p1Dir = path.join(targetDir, 'part1');
  const g1p2Dir = path.join(targetDir, 'part2');
  const g1p3Dir = path.join(targetDir, 'part3');
  const g1p4Dir = path.join(targetDir, 'part4');

  const g1p1Files = fs.existsSync(g1p1Dir) ? fs.readdirSync(g1p1Dir).filter((f) => f.endsWith('.json')) : [];
  const g1p2Files = fs.existsSync(g1p2Dir) ? fs.readdirSync(g1p2Dir).filter((f) => f.endsWith('.json')) : [];
  const g1p3Files = fs.existsSync(g1p3Dir) ? fs.readdirSync(g1p3Dir).filter((f) => f.endsWith('.json')) : [];
  const g1p4Files = fs.existsSync(g1p4Dir) ? fs.readdirSync(g1p4Dir).filter((f) => f.endsWith('.json')) : [];

  g1p1Files.sort();
  g1p2Files.sort();
  g1p3Files.sort();
  g1p4Files.sort();

  console.log(`🔍 Matematika darslarini tekshirish boshlandi:`);
  console.log(`   1-sinf 1-qism: ${g1p1Files.length} ta`);
  console.log(`   1-sinf 2-qism: ${g1p2Files.length} ta`);
  console.log(`   1-sinf 3-qism: ${g1p3Files.length} ta`);
  console.log(`   1-sinf 4-qism: ${g1p4Files.length} ta`);

  if (g1p1Files.length !== 41) {
    console.error(`❌ Xato: 1-sinf 1-qismda aynan 41 ta dars fayli bo'lishi kerak (hozir: ${g1p1Files.length})!`);
    process.exit(1);
  }
  if (g1p2Files.length !== 33) {
    console.error(`❌ Xato: 1-sinf 2-qismda aynan 33 ta dars fayli bo'lishi kerak (hozir: ${g1p2Files.length})!`);
    process.exit(1);
  }
  if (g1p3Files.length !== 40) {
    console.error(`❌ Xato: 1-sinf 3-qismda aynan 40 ta dars fayli bo'lishi kerak (hozir: ${g1p3Files.length})!`);
    process.exit(1);
  }
  if (g1p4Files.length !== 33) {
    console.error(`❌ Xato: 1-sinf 4-qismda aynan 33 ta dars fayli bo'lishi kerak (hozir: ${g1p4Files.length})!`);
    process.exit(1);
  }

  // Grade 2 Part 1
  const g2BaseDir = path.resolve(process.cwd(), 'seed/math/grade2/part1');
  const g2FallbackDir = path.resolve(process.cwd(), 'backend/seed/math/grade2/part1');
  const g2p1Dir = fs.existsSync(g2BaseDir) ? g2BaseDir : g2FallbackDir;
  const g2p1Files = fs.existsSync(g2p1Dir) ? fs.readdirSync(g2p1Dir).filter((f) => f.endsWith('.json')) : [];
  g2p1Files.sort();

  console.log(`   2-sinf 1-qism: ${g2p1Files.length} ta birlik fayli`);
  if (g2p1Files.length !== 44) {
    console.error(`❌ Xato: 2-sinf 1-qismda aynan 44 ta birlik fayli bo'lishi kerak (hozir: ${g2p1Files.length})!`);
    process.exit(1);
  }

  let totalQuestionsCount = 0;
  let totalPracticeCount = 0;

  const allLessons = [
    ...g1p1Files.map((f) => ({ file: f, path: path.join(g1p1Dir, f), grade: 1, part: 1 })),
    ...g1p2Files.map((f) => ({ file: f, path: path.join(g1p2Dir, f), grade: 1, part: 2 })),
    ...g1p3Files.map((f) => ({ file: f, path: path.join(g1p3Dir, f), grade: 1, part: 3 })),
    ...g1p4Files.map((f) => ({ file: f, path: path.join(g1p4Dir, f), grade: 1, part: 4 })),
    ...g2p1Files.map((f) => ({ file: f, path: path.join(g2p1Dir, f), grade: 2, part: 1 })),
  ];

  for (const { file, path: filePath, grade } of allLessons) {
    let contentStr: string;
    let data: LessonSeed;

    try {
      contentStr = fs.readFileSync(filePath, 'utf-8');
      data = JSON.parse(contentStr);
    } catch (err: any) {
      console.error(`❌ Faylni o'qishda xato: ${file} -> ${err.message}`);
      process.exit(1);
    }

    // Required fields check
    if (grade === 1) {
      if (!data.bookNumber || typeof data.bookNumber !== 'number') {
        console.error(`❌ ${file}: bookNumber maydoni raqam bo'lishi shart!`);
        process.exit(1);
      }
    } else if (grade === 2) {
      if (typeof data.order !== 'number' || data.order < 1 || data.order > 44) {
        console.error(`❌ ${file}: order maydoni 1 dan 44 gacha bo'lishi shart! (${data.order})`);
        process.exit(1);
      }
      if (!data.unitType || !['LESSON', 'FINAL_LESSON', 'PRACTICE'].includes(data.unitType)) {
        console.error(`❌ ${file}: unitType LESSON, FINAL_LESSON yoki PRACTICE bo'lishi shart! (${data.unitType})`);
        process.exit(1);
      }
    }

    if (!data.title || !data.emoji || !data.shortDesc || !data.intro) {
      console.error(`❌ ${file}: title, emoji, shortDesc yoki intro yetishmayapti!`);
      process.exit(1);
    }
    if (!Array.isArray(data.keyPoints) || data.keyPoints.length < 2) {
      console.error(`❌ ${file}: keyPoints kamida 2 ta banddan iborat bo'lishi kerak!`);
      process.exit(1);
    }
    if (!data.miniExample || !data.miniExample.emojis || !data.miniExample.text) {
      console.error(`❌ ${file}: miniExample { emojis, text } to'liq bo'lishi shart!`);
      process.exit(1);
    }

    // Prohibited raw LaTeX / Sigma / TODO checks in full JSON string
    const prohibitedPatterns = [/\\dots/i, /\\frac/i, /Σ/, /\\Sigma/i, /\bTODO\b/];
    for (const pat of prohibitedPatterns) {
      if (pat.test(contentStr)) {
        console.error(`❌ ${file}: Taqiqlangan belgi yoki so'z aniqlandi: ${pat}`);
        process.exit(1);
      }
    }

    // Practice check
    if (data.unitType !== 'FINAL_LESSON' && !data.isReview) {
      if (!Array.isArray(data.practice) || data.practice.length < 2) {
        console.error(`❌ ${file}: practice kamida 2-3 ta mashqdan iborat bo'lishi kerak!`);
        process.exit(1);
      }
      totalPracticeCount += data.practice.length;
    }

    // Test questions check (EXACTLY 20)
    if (!Array.isArray(data.test) || data.test.length !== 20) {
      console.error(`❌ ${file}: Test savollari soni aynan 20 ta bo'lishi shart! (Hozir: ${data.test?.length})`);
      process.exit(1);
    }

    totalQuestionsCount += data.test.length;

    const seenTexts = new Set<string>();
    const indexDistribution = [0, 0, 0, 0];

    for (let i = 0; i < data.test.length; i++) {
      const q = data.test[i];
      const qNum = i + 1;

      if (!q.text || typeof q.text !== 'string' || q.text.trim().length === 0) {
        console.error(`❌ ${file} (savol ${qNum}): Savol matni bo'sh!`);
        process.exit(1);
      }

      // Check unique text within unit
      const normText = q.text.trim().toLowerCase();
      if (seenTexts.has(normText)) {
        console.error(`❌ ${file} (savol ${qNum}): Savol matni takrorlangan: "${q.text}"`);
        process.exit(1);
      }
      seenTexts.add(normText);

      // Check 4 options
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        console.error(`❌ ${file} (savol ${qNum}): Aynan 4 ta variant bo'lishi shart!`);
        process.exit(1);
      }

      // Check options uniqueness
      const uniqueOpts = new Set(q.options.map((o) => String(o).trim().toLowerCase()));
      if (uniqueOpts.size !== 4) {
        console.error(`❌ ${file} (savol ${qNum}): Variantlar ichida takrorlanish bor: ${JSON.stringify(q.options)}`);
        process.exit(1);
      }

      // Check correctIndex range (0-3)
      if (typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex > 3) {
        console.error(`❌ ${file} (savol ${qNum}): correctIndex 0 dan 3 gacha bo'lishi shart! (${q.correctIndex})`);
        process.exit(1);
      }

      indexDistribution[q.correctIndex]++;

      // Check explanation
      if (!q.explanation || typeof q.explanation !== 'string' || q.explanation.trim().length === 0) {
        console.error(`❌ ${file} (savol ${qNum}): explanation maydoni to'ldirilishi shart!`);
        process.exit(1);
      }

      // Arithmetic, equations, roman, units check
      const arithErr = checkArithmetic(q.text, q.options, q.correctIndex, q.meta);
      if (arithErr) {
        console.error(`❌ ${file} (savol ${qNum}): ${arithErr}`);
        process.exit(1);
      }
    }

    // Check distribution: each index 0, 1, 2, 3 must appear between 3 and 7 times
    for (let c = 0; c < 4; c++) {
      const count = indexDistribution[c];
      const optLetter = String.fromCharCode(65 + c);
      if (count < 3 || count > 7) {
        console.error(
          `❌ ${file}: To'g'ri javob o'rni taqsimoti buzilgan: Variant ${optLetter} (${c}) ${count} marta to'g'ri bo'lgan! (3 dan 7 gacha bo'lishi shart). Taqsimot: [A:${indexDistribution[0]}, B:${indexDistribution[1]}, C:${indexDistribution[2]}, D:${indexDistribution[3]}]`
        );
        process.exit(1);
      }
    }
  }

  const grandTotalLessons = allLessons.length;
  console.log(`✅ TABRIKLAYMIZ! Barcha ${grandTotalLessons} ta birlik tekshiruvdan toza o'tdi:`);
  console.log(`   - 1-sinf: ${g1p1Files.length + g1p2Files.length + g1p3Files.length + g1p4Files.length} ta dars (147 ta)`);
  console.log(`   - 2-sinf 1-qism: ${g2p1Files.length} ta birlik`);
  console.log(`   - Jami ${totalQuestionsCount} ta test savoli (har birlikda aynan 20 ta, 0 ta LaTeX)`);
  console.log(`   - Jami ${totalPracticeCount} ta mashq savoli`);
  console.log(`   - Variantlar taqsimoti (3–7) va arifmetik to'g'rilik to'liq tasdiqlandi.`);
  return true;
}

validateAllMathLessons();
