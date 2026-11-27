import fs from 'fs';
import path from 'path';

interface QuestionItem {
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface LessonSeed {
  bookNumber: number;
  isReview?: boolean;
  title: string;
  emoji: string;
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

function checkArithmetic(questionText: string, options: string[], correctIndex: number): string | null {
  if (
    /nomlanadi|nomi|ataladi|bildiradi|qaysi had|qaysi amal|o‘qiladi|o'qiladi|yoziladi|taqqoslang|to‘ldiring|to'ldiring|katakdagi|o‘rniga|o'rniga|noma’lum|noma'lum|tengsizlik|tenglik|xossasi|simmetriya|hajmli|shakl|chegara/i.test(
      questionText
    )
  ) {
    return null;
  }

  // 1. Equation checks: x + a = b, a + x = b, a - x = b, x - a = b
  const eqPatterns = [
    { regex: /x\s*\+\s*(\d+)\s*=\s*(\d+)/i, solve: (a: number, b: number) => b - a },
    { regex: /(\d+)\s*\+\s*x\s*=\s*(\d+)/i, solve: (a: number, b: number) => b - a },
    { regex: /(\d+)\s*-\s*x\s*=\s*(\d+)/i, solve: (a: number, b: number) => a - b },
    { regex: /x\s*-\s*(\d+)\s*=\s*(\d+)/i, solve: (a: number, b: number) => b + a },
  ];

  for (const { regex, solve } of eqPatterns) {
    const eqMatch = questionText.match(regex);
    if (eqMatch) {
      const a = parseInt(eqMatch[1], 10);
      const b = parseInt(eqMatch[2], 10);
      const expectedX = solve(a, b);
      const correctOpt = options[correctIndex]?.trim();
      const numInOpt = correctOpt.match(/-?\d+/);
      if (numInOpt) {
        const actualX = parseInt(numInOpt[0], 10);
        if (actualX !== expectedX) {
          return `Tenglama xatosi: "${eqMatch[0]}" yechimi x = ${expectedX} bo'lishi kerak, lekin to'g'ri variant "${correctOpt}" (${actualX}) deb ko'rsatilgan!`;
        }
      }
      return null;
    }
  }

  // 2. Standard arithmetic patterns
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
          const correctOptionStr = options[correctIndex]?.trim();
          const optMatch = correctOptionStr.match(/^(-?\d+)(?:\s*(?:ta|dona|kg|sm|metr|so‘m|so'm|kishi|nafar|bet|tup|qop))?$/i);
          if (optMatch) {
            const actualVal = parseInt(optMatch[1], 10);
            if (actualVal !== expectedVal) {
              return `Hisob-kitob xatosi: "${exprCandidate}" natijasi ${expectedVal} bo'lishi kerak, lekin to'g'ri variant sifatida "${correctOptionStr}" (${actualVal}) ko'rsatilgan!`;
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

  const part1Dir = path.join(targetDir, 'part1');
  const part2Dir = path.join(targetDir, 'part2');
  const part3Dir = path.join(targetDir, 'part3');
  const part4Dir = path.join(targetDir, 'part4');

  const part1Files = fs.existsSync(part1Dir) ? fs.readdirSync(part1Dir).filter((f) => f.endsWith('.json')) : [];
  const part2Files = fs.existsSync(part2Dir) ? fs.readdirSync(part2Dir).filter((f) => f.endsWith('.json')) : [];
  const part3Files = fs.existsSync(part3Dir) ? fs.readdirSync(part3Dir).filter((f) => f.endsWith('.json')) : [];
  const part4Files = fs.existsSync(part4Dir) ? fs.readdirSync(part4Dir).filter((f) => f.endsWith('.json')) : [];

  part1Files.sort();
  part2Files.sort();
  part3Files.sort();
  part4Files.sort();

  console.log(`🔍 Matematika darslarini tekshirish boshlandi:`);
  console.log(`   1-qism fayllari: ${part1Files.length} ta`);
  console.log(`   2-qism fayllari: ${part2Files.length} ta`);
  console.log(`   3-qism fayllari: ${part3Files.length} ta`);
  console.log(`   4-qism fayllari: ${part4Files.length} ta`);

  if (part1Files.length !== 41) {
    console.error(`❌ Xato: 1-qismda aynan 41 ta dars fayli bo'lishi kerak (hozir: ${part1Files.length})!`);
    process.exit(1);
  }

  if (part2Files.length !== 33) {
    console.error(`❌ Xato: 2-qismda aynan 33 ta dars fayli bo'lishi kerak (hozir: ${part2Files.length})!`);
    process.exit(1);
  }

  if (part3Files.length !== 40) {
    console.error(`❌ Xato: 3-qismda aynan 40 ta dars fayli bo'lishi kerak (hozir: ${part3Files.length})!`);
    process.exit(1);
  }

  if (part4Files.length !== 33) {
    console.error(`❌ Xato: 4-qismda aynan 33 ta dars fayli bo'lishi kerak (hozir: ${part4Files.length})!`);
    process.exit(1);
  }

  let totalQuestionsCount = 0;
  let totalPracticeCount = 0;

  const allLessons = [
    ...part1Files.map((f) => ({ file: f, path: path.join(part1Dir, f), part: 1 })),
    ...part2Files.map((f) => ({ file: f, path: path.join(part2Dir, f), part: 2 })),
    ...part3Files.map((f) => ({ file: f, path: path.join(part3Dir, f), part: 3 })),
    ...part4Files.map((f) => ({ file: f, path: path.join(part4Dir, f), part: 4 })),
  ];

  for (const { file, path: filePath } of allLessons) {
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
    if (!data.bookNumber || typeof data.bookNumber !== 'number') {
      console.error(`❌ ${file}: bookNumber maydoni raqam bo'lishi shart!`);
      process.exit(1);
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
    if (!data.isReview) {
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

      // Check unique text within lesson
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

      // Arithmetic & equation check
      const arithErr = checkArithmetic(q.text, q.options, q.correctIndex);
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
  console.log(`✅ TABRIKLAYMIZ! Barcha ${grandTotalLessons} ta dars tekshiruvdan toza o'tdi:`);
  console.log(`   - 1-qism: ${part1Files.length} ta dars`);
  console.log(`   - 2-qism: ${part2Files.length} ta dars`);
  console.log(`   - 3-qism: ${part3Files.length} ta dars`);
  console.log(`   - 4-qism: ${part4Files.length} ta dars`);
  console.log(`   - Jami ${totalQuestionsCount} ta test savoli (har darsda aynan 20 ta, 0 ta LaTeX)`);
  console.log(`   - Jami ${totalPracticeCount} ta mashq savoli`);
  console.log(`   - Variantlar taqsimoti (3–7) va arifmetik to'g'rilik to'liq tasdiqlandi.`);
  return true;
}

validateAllMathLessons();
