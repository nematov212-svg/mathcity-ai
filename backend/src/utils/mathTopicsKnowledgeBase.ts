/**
 * MathCity AI — Built-in Local Offline Mathematics Knowledge Base
 * 100% Rules-Based, Deterministic, Zero External API Dependency
 * Grades 1–11 Comprehensive Curriculum
 */

export interface TopicExample {
  problem: string;
  formulaLatex: string;
  given: string;
  rule: string;
  calculation: string[];
  answer: string;
  verification: string;
}

export interface MathTopic {
  id: string;
  title: string;
  keywords: string[];
  gradeLevel: number;
  category: string;
  theory: string;
  ruleName: string;
  formulaLatex: string;
  examples: TopicExample[];
  commonMistake: string;
}

export const MATH_TOPICS_KNOWLEDGE_BASE: MathTopic[] = [
  {
    id: 'kasrlar_qoshish',
    title: 'Kasrlarni qo‘shish va ayirish',
    keywords: [
      'kasrlarni qanday qo‘shamiz',
      'kasrlarni qanday qoshamiz',
      'kasr qo‘shish',
      'kasr qoshish',
      'kasrlarni qo‘shish',
      'kasrlarni ayirish',
      'kasr ayirish',
      'oddiy kasrlar',
      'kasr',
      'kasrlar',
    ],
    gradeLevel: 5,
    category: 'Kasrlar',
    theory:
      'Kasrlarni qo‘shish yoki ayirish uchun ularning maxrajlari bir xil bo‘lishi shart. Agar maxrajlar har xil bo‘lsa, avval umumiy maxraj (EKUK) topiladi, kasrlar kengaytiriladi va keyin suratlari qo‘shiladi yoki ayiriladi.',
    ruleName: 'Umumiy maxrajga keltirish qoidasi',
    formulaLatex: '\\frac{a}{m} + \\frac{b}{m} = \\frac{a+b}{m}, \\quad \\frac{a}{c} + \\frac{b}{d} = \\frac{ad + bc}{cd}',
    examples: [
      {
        problem: '3/4 + 1/2',
        formulaLatex: '\\frac{3}{4} + \\frac{1}{2} = \\frac{3}{4} + \\frac{2}{4} = \\frac{5}{4} = 1\\frac{1}{4}',
        given: 'Ikki kasr berilgan: 3/4 va 1/2. Ularning maxrajlari: 4 va 2.',
        rule: 'Maxrajlar har xil bo‘lgani uchun EKUK(4, 2) = 4 umumiy maxraj bo‘ladi.',
        calculation: [
          '1-qadam: 1/2 kasrining surat va maxrajini 2 ga ko‘paytiramiz: 1/2 = 2/4.',
          '2-qadam: Maxrajlari bir xil bo‘lgan kasrlarni qo‘shamiz: 3/4 + 2/4 = (3 + 2)/4 = 5/4.',
          '3-qadam: Noto‘g‘ri kasrni aralash songa aylantiramiz: 5/4 = 1 butun 1/4 (yoki 1.25).',
        ],
        answer: '5/4 yoki 1 butun 1/4 (1.25)',
        verification: 'Teskari amal bilan tekshiramiz: 5/4 - 2/4 = 3/4 (to‘g‘ri ✓).',
      },
      {
        problem: '5/6 - 1/3',
        formulaLatex: '\\frac{5}{6} - \\frac{1}{3} = \\frac{5}{6} - \\frac{2}{6} = \\frac{3}{6} = \\frac{1}{2}',
        given: '5/6 va 1/3 kasrlarining ayirmasi.',
        rule: 'EKUK(6, 3) = 6. 1/3 kasri 2 ga kengaytiriladi.',
        calculation: [
          '1-qadam: 1/3 kasrining surat va maxrajini 2 ga ko‘paytiramiz: 1/3 = 2/6.',
          '2-qadam: Suratlarni ayiramiz: 5/6 - 2/6 = 3/6.',
          '3-qadam: Kasrni 3 ga qisqartiramiz: 3/6 = 1/2.',
        ],
        answer: '1/2 (yoki 0.5)',
        verification: '1/2 + 1/3 = 3/6 + 2/6 = 5/6 (to‘g‘ri ✓).',
      },
      {
        problem: '2/7 + 3/7',
        formulaLatex: '\\frac{2}{7} + \\frac{3}{7} = \\frac{2+3}{7} = \\frac{5}{7}',
        given: 'Maxrajlari bir xil bo‘lgan 2/7 va 3/7 kasrlari.',
        rule: 'Bir xil maxrajli kasrlarni qo‘shganda suratlari qo‘shiladi, maxraj o‘zgarishsiz qoladi.',
        calculation: [
          '1-qadam: Suratlarni qo‘shamiz: 2 + 3 = 5.',
          '2-qadam: Umumiy maxraj 7 ni yozamiz: 5/7.',
        ],
        answer: '5/7',
        verification: '5/7 - 3/7 = 2/7 (to‘g‘ri ✓).',
      },
    ],
    commonMistake:
      'Eng ko‘p uchraydigan xato: suratlarni va maxrajlarni to‘g‘ridan-to‘g‘ri qo‘shish (masalan 1/2 + 1/3 ni 2/5 deb hisoblash mutlaqo noto‘g‘ri!). Har doim umumiy maxraj topilishi shart.',
  },
  {
    id: 'foizlar',
    title: 'Foizlar va ularni hisoblash',
    keywords: [
      'foizlarni tushuntirib ber',
      'foizni tushuntir',
      'foizlar',
      'foiz',
      'foiz qoidasi',
      'sonning foizi',
      'foiz hisoblash',
      'foiz nima',
    ],
    gradeLevel: 6,
    category: 'Foizlar',
    theory:
      'Foiz — bu butunning yuzdan bir qismidir (1% = 1/100 = 0.01). Sonning p foizini topish uchun shu sonni p ga ko‘paytirib, 100 ga bo‘lish kerak.',
    ruleName: 'Sonning foizini topish qoidasi',
    formulaLatex: 'A \\text{ ning } p\\%\\text{ i} = \\frac{A \\cdot p}{100} = A \\cdot 0.01p',
    examples: [
      {
        problem: '150 ning 20% i',
        formulaLatex: '\\frac{150 \\cdot 20}{100} = \\frac{3000}{100} = 30',
        given: 'Asosiy son: A = 150, foiz miqdori: p = 20%.',
        rule: 'Sonning foizini topish uchun son foiz ko‘rsatkichiga ko‘paytirilib, 100 ga bo‘linadi.',
        calculation: [
          '1-qadam: 150 ni 20 ga ko‘paytiramiz: 150 · 20 = 3000.',
          '2-qadam: Chiqqan natijani 100 ga bo‘lamiz: 3000 / 100 = 30.',
          'Muqobil tezkor usul: 20% = 0.2 bo‘lgani uchun 150 · 0.2 = 30.',
        ],
        answer: '30',
        verification: '30 / 150 = 0.20 = 20% (to‘g‘ri ✓).',
      },
      {
        problem: '200 ning 15 foizi',
        formulaLatex: '\\frac{200 \\cdot 15}{100} = 2 \\cdot 15 = 30',
        given: 'A = 200, p = 15%.',
        rule: 'Formula: (200 · 15) / 100.',
        calculation: [
          '1-qadam: 200 va 100 ni 100 ga qisqartiramiz: 2 qoladi.',
          '2-qadam: 2 ni 15 ga ko‘paytiramiz: 2 · 15 = 30.',
        ],
        answer: '30',
        verification: '30 / 200 = 0.15 = 15% (to‘g‘ri ✓).',
      },
      {
        problem: '80 ning 50 foizi',
        formulaLatex: '\\frac{80 \\cdot 50}{100} = \\frac{80}{2} = 40',
        given: 'A = 80, p = 50%.',
        rule: '50% — bu sonning aynan yarmi (1/2 qismi) hisoblanadi.',
        calculation: [
          '1-qadam: 80 ni 2 ga bo‘lamiz: 80 / 2 = 40.',
        ],
        answer: '40',
        verification: '40 · 2 = 80 (to‘g‘ri ✓).',
      },
    ],
    commonMistake:
      'Foizni oddiy songa aylantirmasdan hisoblash (masalan 150 + 20% ni 170 deb xato hisoblash; aslida 150 ning 20% i 30 bo‘lib, 150 + 30 = 180 bo‘ladi).',
  },
  {
    id: 'tenglamalar',
    title: 'Tenglamalarni yechish qoidalari',
    keywords: [
      'tenglamalarni yechishni o‘rgat',
      'tenglamalarni yechishni orgat',
      'tenglamalarni yechish',
      'tenglama yechish',
      'chiziqli tenglamalar',
      'tenglamalar',
      'tenglama',
      'tenglama nima',
    ],
    gradeLevel: 6,
    category: 'Tenglamalar',
    theory:
      'Tenglama — bu noma’lum son (odatda x) qatnashgan matematik tenglikdir. Tenglamani yechish — uning to‘g‘ri tenglikka aylantiruvchi ildizini (noma’lum qiymatini) topish demakdir. Asosiy qoida: noma’lumlarni bir tomonga, ma’lumlarni ikkinchi tomonga o‘tkazamiz, bunda ishora qarama-qarshisiga o‘zgaradi.',
    ruleName: 'Haddarni ishorasini o‘zgartirib o‘tkazish qoidasi',
    formulaLatex: 'ax + b = c \\implies ax = c - b \\implies x = \\frac{c - b}{a}',
    examples: [
      {
        problem: '2x + 5 = 15',
        formulaLatex: '2x + 5 = 15 \\implies 2x = 15 - 5 \\implies 2x = 10 \\implies x = 5',
        given: 'Chiziqli tenglama: 2x + 5 = 15.',
        rule: '+5 o‘ng tomonga -5 bo‘lib o‘tadi, so‘ngra ikkala tomon x oldidagi 2 koeffitsiyentiga bo‘linadi.',
        calculation: [
          '1-qadam: +5 ni o‘ng tomonga -5 qilib o‘tkazamiz: 2x = 15 - 5.',
          '2-qadam: O‘ng tomonni hisoblaymiz: 2x = 10.',
          '3-qadam: Ikkala tomonni x oldidagi songa (2 ga) bo‘lamiz: x = 10 / 2 = 5.',
        ],
        answer: 'x = 5',
        verification: 'Tekshirish: 2 · 5 + 5 = 10 + 5 = 15 (15 = 15 to‘g‘ri ✓).',
      },
      {
        problem: 'x + 12 = 30',
        formulaLatex: 'x = 30 - 12 = 18',
        given: 'x + 12 = 30.',
        rule: 'Noma’lum qo‘shiluvchini topish uchun yig‘indidan ma’lum qo‘shiluvchi ayiriladi.',
        calculation: [
          '1-qadam: 12 ni o‘ng tomonga ayirish bilan o‘tkazamiz: x = 30 - 12.',
          '2-qadam: x = 18.',
        ],
        answer: 'x = 18',
        verification: '18 + 12 = 30 (to‘g‘ri ✓).',
      },
      {
        problem: '3x - 6 = 12',
        formulaLatex: '3x = 12 + 6 = 18 \\implies x = 6',
        given: '3x - 6 = 12.',
        rule: '-6 o‘ng tomonga +6 bo‘lib o‘tadi.',
        calculation: [
          '1-qadam: 3x = 12 + 6 = 18.',
          '2-qadam: x = 18 / 3 = 6.',
        ],
        answer: 'x = 6',
        verification: '3 · 6 - 6 = 18 - 6 = 12 (to‘g‘ri ✓).',
      },
    ],
    commonMistake:
      'Haddarni tenglikning ikkinchi tomoniga o‘tkazganda ishorasini almashtirishni unutish (+ ni o‘zgartirmasdan qoldirish).',
  },
  {
    id: 'kopaytirish_jadvali',
    title: 'Ko‘paytirish jadvali va tez hisoblash',
    keywords: [
      'kopaytirish jadvali',
      'ko‘paytirish jadvali',
      'ko‘paytirishni o‘rgat',
      'kopaytirishni orgat',
      'jadval',
      'ko‘paytirish',
      'kopaytirish',
      'karra jadvali',
    ],
    gradeLevel: 2,
    category: 'Arifmetika',
    theory:
      'Ko‘paytirish — bir xil qo‘shiluvchilarni qo‘shishning qisqa yozuvidir (masalan, 3 × 4 = 4 + 4 + 4 = 12). Ko‘paytirishda ko‘paytuvchilarning o‘rni almashgani bilan ko‘paytma o‘zgarmaydi: a × b = b × a.',
    ruleName: 'Ko‘paytirishning o‘rin almashtirish xossasi',
    formulaLatex: 'a \\cdot b = b \\cdot a, \\quad a \\cdot 0 = 0, \\quad a \\cdot 1 = a',
    examples: [
      {
        problem: '2 × 5 nechchi bo‘ladi?',
        formulaLatex: '2 \\times 5 = 5 + 5 = 10',
        given: '2 va 5 sonlarining ko‘paytmasi.',
        rule: 'Ko‘paytirish bir xil sonlarni qo‘shishni bildiradi: 2 ta 5 ning yig‘indisi.',
        calculation: [
          '1-qadam: 5 ni 2 marta qo‘shamiz: 5 + 5 = 10.',
          '2-qadam: Karra jadvali bo‘yicha: 2 × 5 = 10.',
        ],
        answer: '10',
        verification: '10 ÷ 2 = 5 va 10 ÷ 5 = 2 (to‘g‘ri ✓).',
      },
      {
        problem: '7 × 8',
        formulaLatex: '7 \\times 8 = 56',
        given: '7 bilan 8 sonlarining ko‘paytmasi.',
        rule: 'Ko‘paytirish jadvali asosi: 7 × 8 = 56.',
        calculation: [
          'Tezkor eslab qolish usuli: 5, 6, 7, 8 qatori (56 = 7 × 8).',
        ],
        answer: '56',
        verification: '56 ÷ 8 = 7 (to‘g‘ri ✓).',
      },
      {
        problem: '9 × 6',
        formulaLatex: '9 \\times 6 = 54',
        given: '9 va 6 sonlari.',
        rule: '9 ga ko‘paytirish barmoq qoidasi: 10 ga ko‘paytirib, sonning o‘zini ayirish: 10 × 6 - 6 = 60 - 6 = 54.',
        calculation: [
          '1-qadam: 10 × 6 = 60.',
          '2-qadam: 60 - 6 = 54.',
        ],
        answer: '54',
        verification: '54 / 9 = 6 (to‘g‘ri ✓).',
      },
    ],
    commonMistake:
      'Nolga ko‘paytirishda sonning o‘zini yozish (har qanday sonni 0 ga ko‘paytirsa doimo 0 chiqadi!).',
  },
  {
    id: 'geometriya',
    title: 'Geometriya: Perimetr, Yuza va Pifagor',
    keywords: [
      'geometriyani tushuntir',
      'perimetr nima',
      'yuza nima',
      'geometriya',
      'perimetr',
      'yuza',
      'pifagor',
      'pifagor teoremasi',
      'uchburchak yuzi',
      'tortburchak yuzi',
    ],
    gradeLevel: 7,
    category: 'Geometriya',
    theory:
      'Perimetr (P) — shaklning barcha tomonlari uzunliklarining yig‘indisidir. Yuza (S) — shakl tekislikda egallagan maydon o‘lchovidir. To‘g‘ri burchakli uchburchakda Pifagor teoremasi o‘rinli: katetlarning kvadratlari yig‘indisi gipotenuzaning kvadratiga teng.',
    ruleName: 'Perimetr, yuza va Pifagor formulalari',
    formulaLatex: 'P = 2(a+b), \\quad S = a \\cdot b, \\quad c^2 = a^2 + b^2',
    examples: [
      {
        problem: 'To‘g‘ri to‘rtburchak a=4, b=6 yuzi va perimetri',
        formulaLatex: 'S = 4 \\cdot 6 = 24, \\quad P = 2(4 + 6) = 20',
        given: 'To‘g‘ri to‘rtburchak tomonlari: a = 4 sm, b = 6 sm.',
        rule: 'Yuza S = a · b, Perimetr P = 2(a + b).',
        calculation: [
          '1-qadam: Yuzani hisoblaymiz: S = 4 · 6 = 24 sm².',
          '2-qadam: Perimetrni hisoblaymiz: P = 2 · (4 + 6) = 2 · 10 = 20 sm.',
        ],
        answer: 'Yuza S = 24 sm², Perimetr P = 20 sm',
        verification: '24 / 4 = 6 va (20 / 2) - 4 = 6 (to‘g‘ri ✓).',
      },
      {
        problem: 'Katetlari a=3 va b=4 bo‘lgan gipotenuzani toping',
        formulaLatex: 'c = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5',
        given: 'Katetlar: a = 3, b = 4.',
        rule: 'Pifagor teoremasi: c² = a² + b².',
        calculation: [
          '1-qadam: Katetlar kvadratlarini topamiz: 3² = 9, 4² = 16.',
          '2-qadam: Yig‘indini topamiz: 9 + 16 = 25.',
          '3-qadam: Kvadrat ildiz chiqaramiz: c = √25 = 5.',
        ],
        answer: 'Gipotenuza c = 5 (Misr uchburchagi)',
        verification: '5² = 25 = 9 + 16 (to‘g‘ri ✓).',
      },
    ],
    commonMistake:
      'Perimetr (uzunlik birligi: sm, m) bilan Yuzani (kvadrat birlik: sm², m²) adashtirish.',
  },
  {
    id: 'boluvchilar_va_ekub_ekuk',
    title: 'Bo‘linish alomatlari, EKUB va EKUK',
    keywords: [
      'ekub nima',
      'ekuk nima',
      'ekub',
      'ekuk',
      'boluvchilar',
      'bo‘luvchilar',
      'tub sonlar',
      'tub son',
      'karralilar',
    ],
    gradeLevel: 5,
    category: 'Sonlar nazariyasi',
    theory:
      'EKUB — berilgan sonlarning eng katta umumiy bo‘luvchisi. EKUK — berilgan sonlarga qoldiqsiz bo‘linadigan eng kichik umumiy karrali. Tub son faqat 1 ga va o‘ziga bo‘linadi (2, 3, 5, 7, 11...). 2 — yagona juft tub son.',
    ruleName: 'Tub ko‘paytuvchilarga ajratish usuli',
    formulaLatex: '\\text{EKUB}(a, b) \\cdot \\text{EKUK}(a, b) = a \\cdot b',
    examples: [
      {
        problem: 'EKUB(24, 36)',
        formulaLatex: '\\text{EKUB}(24, 36) = 12',
        given: 'Ikkita son: 24 va 36.',
        rule: 'Sonlar tub ko‘paytuvchilarga ajratiladi va umumiy ko‘paytuvchilarning eng kichik darajalari olinadi.',
        calculation: [
          '1-qadam: 24 = 2³ · 3.',
          '2-qadam: 36 = 2² · 3².',
          '3-qadam: Umumiy qismi: 2² · 3 = 4 · 3 = 12.',
        ],
        answer: '12',
        verification: '24 / 12 = 2 va 36 / 12 = 3. 2 va 3 o‘zaro tub sonlar (to‘g‘ri ✓).',
      },
      {
        problem: 'EKUK(12, 18)',
        formulaLatex: '\\text{EKUK}(12, 18) = 36',
        given: '12 va 18 sonlari.',
        rule: 'EKUK = (a · b) / EKUB(a, b).',
        calculation: [
          '1-qadam: EKUB(12, 18) = 6.',
          '2-qadam: EKUK = (12 · 18) / 6 = 216 / 6 = 36.',
        ],
        answer: '36',
        verification: '36 / 12 = 3 va 36 / 18 = 2 (to‘g‘ri ✓).',
      },
    ],
    commonMistake:
      '1 sonini tub son deb o‘ylash (1 tub son ham, murakkab son ham emas).',
  },
];

/**
 * Finds matching math topic from user natural language query
 */
export function findTopicExplanation(query: string): MathTopic | null {
  if (!query || !query.trim()) return null;
  const clean = query.toLowerCase().trim().replace(/['ʻʼ`]/g, '‘');

  // Exact or keyword match
  for (const topic of MATH_TOPICS_KNOWLEDGE_BASE) {
    for (const kw of topic.keywords) {
      const cleanKw = kw.toLowerCase().replace(/['ʻʼ`]/g, '‘');
      if (clean.includes(cleanKw)) {
        return topic;
      }
    }
  }

  // Token overlap fallback with stop words excluded
  const stopWords = new Set(['haqida', 'nima', 'qanday', 'gapir', 'aytib', 'ber', 'uchun', 'bilan', 'yoki', 'qilib', 'boladi', 'nechchi', 'nechi', 'tarixi']);
  const tokens = clean.split(/\s+/).filter((t) => t.length >= 3 && !stopWords.has(t));
  if (tokens.length === 0) return null;

  let bestTopic: MathTopic | null = null;
  let maxMatches = 0;

  for (const topic of MATH_TOPICS_KNOWLEDGE_BASE) {
    let matches = 0;
    for (const kw of topic.keywords) {
      const kwWords = kw.toLowerCase().split(/\s+/);
      for (const token of tokens) {
        if (kwWords.includes(token)) matches++;
      }
    }
    if (matches > maxMatches) {
      maxMatches = matches;
      bestTopic = topic;
    }
  }

  return maxMatches >= 2 ? bestTopic : null;
}
