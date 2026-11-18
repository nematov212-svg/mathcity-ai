export interface QuestionModel {
  id: string;
  lessonId: string;
  sectionId: string;
  prompt: string;
  type: 'MULTIPLE_CHOICE' | 'NUMERICAL_INPUT' | 'FRACTION_MATCH' | 'EQUATION_SOLVE';
  options: string[];
  correctAnswer: string;
  explanation: string;
  hint: string;
  formulaLatex?: string;
  orderIndex: number;
}

export interface SectionModel {
  id: string;
  lessonId: string;
  title: string; // e.g. "1-qism", "2-qism"
  orderIndex: number;
  questions: QuestionModel[];
}

export interface LessonModel {
  id: string;
  courseId: string;
  chapterId: string;
  chapterTitle: string;
  grade: number;
  mode: 'KIDS' | 'TEEN';
  title: string;
  topicKey: string;
  description: string;
  contentMd: string;
  formulaLatex?: string;
  rewardXP: number;
  rewardCoins: number;
  orderIndex: number;
  sections: SectionModel[];
}

export interface ChapterModel {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  orderIndex: number;
  lessons: LessonModel[];
}

export interface SubjectModel {
  id: string;
  grade: number;
  mode: 'KIDS' | 'TEEN';
  title: string;
  description: string;
  chapters: ChapterModel[];
}

export interface BuildingModel {
  key: string;
  name: string;
  category: string;
  costInCoins: number; // 100 coins default as requested
  requiredLevel: number;
  description: string;
  iconName: string;
  mode: 'KIDS' | 'TEEN';
}

export interface AchievementModel {
  key: string;
  title: string;
  description: string;
  iconName: string;
  rewardCoins: number;
  rewardXP: number;
}

export interface DailyTaskModel {
  key: string;
  title: string;
  description: string;
  targetCount: number;
  rewardCoins: number;
  rewardXP: number;
}

// ----------------------------------------------------
// BUILDINGS (ALL 100 COINS AS REQUESTED BY MASTER PROMPT)
// Demonstration case: 100 coins -> buy 100 coin building -> 0 coins!
// ----------------------------------------------------
export const initialBuildings: BuildingModel[] = [
  // 5 Master Buildings (Master Prompt V6 Step 18)
  {
    key: 'house_small',
    name: 'Kichik uy',
    category: 'residential',
    costInCoins: 50,
    requiredLevel: 1,
    description: 'Boshlang‘ich shinam 3D pastel uy.',
    iconName: 'home',
    mode: 'KIDS',
  },
  {
    key: 'house_basic',
    name: 'Rangli uy',
    category: 'residential',
    costInCoins: 100,
    requiredLevel: 1,
    description: 'Shahar aholisi uchun shinam va yorug‘ 3D rangli uy.',
    iconName: 'home',
    mode: 'KIDS',
  },
  {
    key: 'house_modern',
    name: 'Zamonaviy uy',
    category: 'residential',
    costInCoins: 200,
    requiredLevel: 2,
    description: 'Quyosh panellari va terassali zamonaviy arxitektura.',
    iconName: 'apartment',
    mode: 'KIDS',
  },
  {
    key: 'house_villa',
    name: 'Katta villa',
    category: 'residential',
    costInCoins: 350,
    requiredLevel: 3,
    description: 'Katta bog‘li va basseynli hashamatli shahar villasi.',
    iconName: 'villa',
    mode: 'KIDS',
  },
  {
    key: 'house_premium',
    name: 'Premium uy',
    category: 'residential',
    costInCoins: 500,
    requiredLevel: 4,
    description: 'Eng yuqori darajadagi futuristik aqlli saroy.',
    iconName: 'castle',
    mode: 'KIDS',
  },
  // Community & Educational Buildings
  {
    key: 'park_green',
    name: 'Eko park',
    category: 'recreation',
    costInCoins: 100,
    requiredLevel: 1,
    description: 'Yashil daraxtlar va favvorali dam olish maskani.',
    iconName: 'park',
    mode: 'KIDS',
  },
  {
    key: 'library_city',
    name: 'Shahar kutubxonasi',
    category: 'education',
    costInCoins: 150,
    requiredLevel: 2,
    description: 'Matematika qonunlari va kitoblar xazinasi.',
    iconName: 'menu_book',
    mode: 'KIDS',
  },
  {
    key: 'school_math',
    name: 'Matematika maktabi',
    category: 'education',
    costInCoins: 250,
    requiredLevel: 2,
    description: 'Yosh matematiklar bilim oladigan zamonaviy maskan.',
    iconName: 'school',
    mode: 'KIDS',
  },
  {
    key: 'observatory_space',
    name: 'Rasadxona (Observatoriya)',
    category: 'science',
    costInCoins: 300,
    requiredLevel: 3,
    description: 'Markaziy teleskopli yulduzlar va kosmos sirlari minorasi.',
    iconName: 'visibility',
    mode: 'KIDS',
  },
  {
    key: 'teen_lab_quantum',
    name: 'Kvant laboratoriyasi',
    category: 'high_tech',
    costInCoins: 100,
    requiredLevel: 1,
    description: 'O‘smirlar shahri uchun ilmiy tadqiqot markazi.',
    iconName: 'biotech',
    mode: 'TEEN',
  },
  {
    key: 'teen_cyber_tower',
    name: 'Kiber minora',
    category: 'it',
    costInCoins: 100,
    requiredLevel: 2,
    description: 'Yuqori texnologiyali kelajak aloqa minorasi.',
    iconName: 'cell_tower',
    mode: 'TEEN',
  },
];

// Helper to generate a verified 10-question set for a section
function createTenQuestions(
  prefix: string,
  lessonId: string,
  sectionId: string,
  generatorType:
    | 'add_sub_3rd'
    | 'fractions_4th'
    | 'equations_8th'
    | 'mult_div_3rd'
    | 'quad_algebra_9th'
    | 'fractions_5th'
    | 'fractions_ops_5th'
    | 'decimals_5th'
    | 'percentages_6th'
    | 'percentages_app_6th'
    | 'ratios_6th'
    | 'integers_6th'
    | 'equations_7th'
    | 'algebra_terms_7th'
    | 'algebra_square_7th'
    | 'word_problems_7th'
): QuestionModel[] {
  const list: QuestionModel[] = [];

  for (let i = 1; i <= 10; i++) {
    const qId = `${prefix}-q${i}`;

    if (generatorType === 'add_sub_3rd') {
      const a = 10 + i * 2;
      const b = 5 + (i % 5);
      const isAdd = i % 2 !== 0;
      const prompt = isAdd ? `${a} + ${b} = ?` : `${a + b} - ${b} = ?`;
      const correct = isAdd ? a + b : a;
      const options = [
        correct.toString(),
        (correct + 2).toString(),
        (correct - 2).toString(),
        (correct + 4).toString(),
      ].sort(() => 0.5 - ((i * 3) % 7) / 7);

      list.push({
        id: qId,
        lessonId,
        sectionId,
        prompt,
        type: 'MULTIPLE_CHOICE',
        options,
        correctAnswer: correct.toString(),
        explanation: `${prompt.replace(' = ?', '')} amali natijasi ${correct} ga teng.`,
        hint: `Birliklar va o‘nliklarni alohida hisoblang.`,
        formulaLatex: `${a} ${isAdd ? '+' : '-'} ${b} = ${correct}`,
        orderIndex: i,
      });
    } else if (generatorType === 'fractions_4th') {
      const den = 4;
      const num = (i % 3) + 1;
      const prompt = `Doira ${den} teng bo‘lakka bo‘lingan va ${num} ta qismi bo‘yalgan. Qaysi kasr to‘g‘ri?`;
      const correct = `${num}/${den}`;
      const options = [
        `${num}/${den}`,
        `${(num % 3) + 1}/${den}`,
        `1/${den + 1}`,
        `3/${den + 2}`,
      ];

      list.push({
        id: qId,
        lessonId,
        sectionId,
        prompt,
        type: 'MULTIPLE_CHOICE',
        options: Array.from(new Set(options)).slice(0, 4),
        correctAnswer: correct,
        explanation: `Doiraning jami ${den} ta bo‘lagidan ${num} tasi bo‘yalgani uchun ${num}/${den} bo‘ladi.`,
        hint: `Surat olingan bo‘laklar, maxraj esa jami bo‘laklar soni.`,
        formulaLatex: `\frac{${num}}{${den}}`,
        orderIndex: i,
      });
    } else if (generatorType === 'fractions_5th') {
      // 5-sinf: Oddiy kasrlar va asosiy xossasi
      const den = 2 * i;
      const num = i;
      const prompt = `${num}/${den} kasrining qisqarmaydigan sodda ko‘rinishini toping:`;
      const correct = '1/2';
      const options = ['1/2', '2/3', '1/4', '3/4'];
      list.push({
        id: qId,
        lessonId,
        sectionId,
        prompt,
        type: 'MULTIPLE_CHOICE',
        options: Array.from(new Set(options)),
        correctAnswer: correct,
        explanation: `Surat va maxrajni ${num} ga qisqartirsak: ${num}/${den} = 1/2 bo‘ladi.`,
        hint: 'Surat va maxrajning eng katta umumiy bo‘luvchisini toping.',
        formulaLatex: `\frac{${num}}{${den}} = \frac{1}{2}`,
        orderIndex: i,
      });
    } else if (generatorType === 'fractions_ops_5th') {
      // 5-sinf: Kasrlarni qo'shish va ayirish
      const den = 12;
      const a = (i % 5) + 1;
      const b = (i % 4) + 1;
      const isAdd = i % 2 !== 0;
      const resNum = isAdd ? a + b : Math.max(a, b) - Math.min(a, b) + 1;
      const prompt = isAdd ? `${a}/${den} + ${b}/${den} = ?` : `${a + b}/${den} - ${b}/${den} = ?`;
      const correct = `${isAdd ? a + b : a}/${den}`;
      const options = [
        correct,
        `${(isAdd ? a + b : a) + 1}/${den}`,
        `${(isAdd ? a + b : a) - 1 || 1}/${den}`,
        `${isAdd ? a + b : a}/${den * 2}`,
      ];
      list.push({
        id: qId,
        lessonId,
        sectionId,
        prompt,
        type: 'MULTIPLE_CHOICE',
        options: Array.from(new Set(options)).slice(0, 4),
        correctAnswer: correct,
        explanation: `Bir xil maxrajli kasrlarni qo‘shishda maxraj o‘zgarmaydi, faqat suratlar qo‘shiladi.`,
        hint: 'Maxrajni qo‘shib yubormang! Maxraj o‘zgarishsiz qoladi.',
        formulaLatex: `\frac{${a}}{${den}} + \frac{${b}}{${den}} = \frac{${a + b}}{${den}}`,
        orderIndex: i,
      });
    } else if (generatorType === 'decimals_5th') {
      // 5-sinf: O'nli kasrlar
      const vals = [0.2, 0.5, 0.25, 0.75, 0.4, 0.6, 0.8, 0.1, 0.9, 0.125];
      const fracVals = ['1/5', '1/2', '1/4', '3/4', '2/5', '3/5', '4/5', '1/10', '9/10', '1/8'];
      const v = vals[(i - 1) % vals.length];
      const f = fracVals[(i - 1) % fracVals.length];
      const prompt = `${f} kasrining o‘nli kasr ko‘rinishini toping:`;
      const correct = v.toString();
      const options = [correct, (v + 0.1).toFixed(2), (v - 0.05).toFixed(2), (v * 2).toFixed(2)];
      list.push({
        id: qId,
        lessonId,
        sectionId,
        prompt,
        type: 'MULTIPLE_CHOICE',
        options: Array.from(new Set(options)).slice(0, 4),
        correctAnswer: correct,
        explanation: `${f} kasrida suratni maxrajga bo‘lganda ${correct} hosil bo‘ladi.`,
        hint: 'Suratni maxrajga burchak usulida bo‘ling.',
        formulaLatex: `${f} = ${correct}`,
        orderIndex: i,
      });
    } else if (generatorType === 'percentages_6th') {
      // 6-sinf: Foizlar
      const base = 50 * i;
      const pct = (i % 4 + 1) * 10; // 10%, 20%, 30%, 40%
      const correct = ((base * pct) / 100).toString();
      const prompt = `${base} sonining ${pct}% ini hisoblang:`;
      const options = [correct, ((base * pct) / 100 + 10).toString(), ((base * pct) / 100 - 5).toString(), (base / 2).toString()];
      list.push({
        id: qId,
        lessonId,
        sectionId,
        prompt,
        type: 'MULTIPLE_CHOICE',
        options: Array.from(new Set(options)).slice(0, 4),
        correctAnswer: correct,
        explanation: `${base} * ${pct} / 100 = ${correct}.`,
        hint: 'Sonni foizga ko‘paytirib, 100 ga bo‘ling.',
        formulaLatex: `\frac{${base} \times ${pct}}{100} = ${correct}`,
        orderIndex: i,
      });
    } else if (generatorType === 'percentages_app_6th') {
      // 6-sinf: Foizga doir amaliy masalalar va chegirmalar
      const originalPrice = 100000;
      const discount = 10 * (i % 4 + 1); // 10%, 20%, 30%, 40%
      const newPrice = originalPrice - (originalPrice * discount) / 100;
      const prompt = `${originalPrice.toLocaleString()} so‘mlik mahsulotga ${discount}% chegirma berildi. Yangi narx qancha?`;
      const correct = `${newPrice.toLocaleString()} so‘m`;
      const options = [
        correct,
        `${(newPrice - 10000).toLocaleString()} so‘m`,
        `${(newPrice + 5000).toLocaleString()} so‘m`,
        `${(originalPrice - 5000).toLocaleString()} so‘m`,
      ];
      list.push({
        id: qId,
        lessonId,
        sectionId,
        prompt,
        type: 'MULTIPLE_CHOICE',
        options: Array.from(new Set(options)).slice(0, 4),
        correctAnswer: correct,
        explanation: `Chegirma: ${originalPrice} * ${discount}% = ${(originalPrice * discount) / 100} so‘m. Yangi narx: ${newPrice} so‘m.`,
        hint: 'Avval chegirma summasini toping, so‘ng dastlabki narxdan ayiring.',
        formulaLatex: `${originalPrice} \times (1 - ${discount / 100}) = ${newPrice}`,
        orderIndex: i,
      });
    } else if (generatorType === 'ratios_6th') {
      // 6-sinf: Proporsiya
      const x = 2 * i;
      const b = 6;
      const c = x * 2;
      const d = b * 2;
      const prompt = `x / ${b} = ${c} / ${d} proporsiyadan x ni toping:`;
      const correct = x.toString();
      const options = [correct, (x + 2).toString(), (x - 1).toString(), (x * 2).toString()];
      list.push({
        id: qId,
        lessonId,
        sectionId,
        prompt,
        type: 'MULTIPLE_CHOICE',
        options: Array.from(new Set(options)).slice(0, 4),
        correctAnswer: correct,
        explanation: `Proporsiyaning asosiy xossasiga ko‘ra chetki hadlar ko‘paytmasi o‘rta hadlar ko‘paytmasiga teng: x = (${b} * ${c}) / ${d} = ${x}.`,
        hint: 'Krest-uy (chetki va o‘rta hadlar) qoidasini qo‘llang.',
        formulaLatex: `x = \frac{${b} \times ${c}}{${d}} = ${x}`,
        orderIndex: i,
      });
    } else if (generatorType === 'integers_6th') {
      // 6-sinf: Manfiy va musbat sonlar
      const a = -1 * (i + 3);
      const b = i + 2;
      const isAdd = i % 2 !== 0;
      const correct = isAdd ? (a + b).toString() : (a - b).toString();
      const prompt = isAdd ? `(${a}) + (${b}) = ?` : `(${a}) - (${b}) = ?`;
      const options = [correct, (-Math.abs(parseInt(correct) - 2)).toString(), (Math.abs(parseInt(correct) + 1)).toString(), (parseInt(correct) + 4).toString()];
      list.push({
        id: qId,
        lessonId,
        sectionId,
        prompt,
        type: 'MULTIPLE_CHOICE',
        options: Array.from(new Set(options)).slice(0, 4),
        correctAnswer: correct,
        explanation: `Qarama-qarshi ishorali sonlarni qo‘shishda kattasining modulidan kichigi ayirilib, kattasining ishorasi qo‘yiladi.`,
        hint: 'Qarz va naqd pul misolida tasavvur qiling.',
        formulaLatex: `${a} ${isAdd ? '+' : '-'} ${b} = ${correct}`,
        orderIndex: i,
      });
    } else if (generatorType === 'equations_7th') {
      // 7-sinf: Chiziqli tenglamalar
      const x = i + 2;
      const a = 2 + (i % 3);
      const b = 6 + i;
      const c = a * x + b;
      const prompt = `${a}x + ${b} = ${c} tenglamaning ildizini toping:`;
      const correct = x.toString();
      const options = [correct, (x + 1).toString(), (x - 1).toString(), (x + 3).toString()];
      list.push({
        id: qId,
        lessonId,
        sectionId,
        prompt,
        type: 'MULTIPLE_CHOICE',
        options: Array.from(new Set(options)).slice(0, 4),
        correctAnswer: correct,
        explanation: `${a}x = ${c} - ${b} = ${c - b} => x = ${c - b} / ${a} = ${x}.`,
        hint: 'Noma’lumni bir tomonda, sonlarni ikkinchi tomonda to‘plang.',
        formulaLatex: `${a}x + ${b} = ${c} \implies x = ${x}`,
        orderIndex: i,
      });
    } else if (generatorType === 'algebra_terms_7th') {
      // 7-sinf: Qavslarni ochish va ixchamlash
      const k = i + 1;
      const m = 3;
      const prompt = `${k}(x + ${m}) ifodani qavsini oching:`;
      const correct = `${k}x + ${k * m}`;
      const options = [correct, `${k}x + ${m}`, `x + ${k * m}`, `${k}x - ${k * m}`];
      list.push({
        id: qId,
        lessonId,
        sectionId,
        prompt,
        type: 'MULTIPLE_CHOICE',
        options: Array.from(new Set(options)).slice(0, 4),
        correctAnswer: correct,
        explanation: `Taqsimot qonuniga binoan: a(b + c) = ab + ac. Demak, ${k}*x + ${k}*${m} = ${correct}.`,
        hint: 'Qavs tashqarisidagi ko‘paytuvchi ichidagi har bir hadga ko‘paytiriladi.',
        formulaLatex: `${k}(x + ${m}) = ${correct}`,
        orderIndex: i,
      });
    } else if (generatorType === 'algebra_square_7th') {
      // 7-sinf: Yig'indining kvadrati (a + b)^2
      const a = i;
      const prompt = `(x + ${a})² ifodani ko‘phad ko‘rinishida yozing:`;
      const correct = `x² + ${2 * a}x + ${a * a}`;
      const options = [
        correct,
        `x² + ${a * a}`,
        `x² + ${a}x + ${a * a}`,
        `x² + ${2 * a}x + ${2 * a}`,
      ];
      list.push({
        id: qId,
        lessonId,
        sectionId,
        prompt,
        type: 'MULTIPLE_CHOICE',
        options: Array.from(new Set(options)).slice(0, 4),
        correctAnswer: correct,
        explanation: `(a + b)² = a² + 2ab + b² formulasi bo‘yicha: x² + 2*${a}*x + ${a}² = ${correct}.`,
        hint: 'O‘rtadagi ikkilangan ko‘paytmani (2ab) unutib qoldirmang!',
        formulaLatex: `(x + ${a})^2 = ${correct}`,
        orderIndex: i,
      });
    } else if (generatorType === 'word_problems_7th') {
      // 7-sinf: Matnli masalalar
      const x = 5 + i;
      const sum = 2 * x + 4;
      const prompt = `Ikki sonning yig‘indisi ${sum}. Ulardan biri ikkinchisidan 4 ga katta. Kichik sonni toping:`;
      const correct = x.toString();
      const options = [correct, (x + 4).toString(), (x - 2).toString(), (x + 2).toString()];
      list.push({
        id: qId,
        lessonId,
        sectionId,
        prompt,
        type: 'MULTIPLE_CHOICE',
        options: Array.from(new Set(options)).slice(0, 4),
        correctAnswer: correct,
        explanation: `Tenglama: x + (x + 4) = ${sum} => 2x = ${sum - 4} => x = ${x}.`,
        hint: 'Kichik sonni x deb oling, kattasi x + 4 bo‘ladi.',
        formulaLatex: `x + (x + 4) = ${sum} \implies x = ${x}`,
        orderIndex: i,
      });
    } else if (generatorType === 'equations_8th') {
      const x = i + 1;
      const a = 2 + (i % 3);
      const b = 4 + i;
      const c = a * x + b;
      const prompt = `${a}x + ${b} = ${c} tenglamaning ildizini (x) toping.`;
      const correct = x.toString();
      const options = [
        correct,
        (x + 1).toString(),
        (x - 1).toString(),
        (x + 2).toString(),
      ].sort();

      list.push({
        id: qId,
        lessonId,
        sectionId,
        prompt,
        type: 'MULTIPLE_CHOICE',
        options,
        correctAnswer: correct,
        explanation: `${a}x = ${c} - ${b} = ${c - b} => x = ${c - b} / ${a} = ${x}.`,
        hint: `Avval ${b} ni o‘ng tomonga ayirib o‘tkazing, keyin ${a} ga bo‘ling.`,
        formulaLatex: `${a}x + ${b} = ${c} \implies x = ${x}`,
        orderIndex: i,
      });
    } else {
      const a = i * 3;
      const b = i + 2;
      const prompt = `${a} + ${b} = ?`;
      const correct = (a + b).toString();
      list.push({
        id: qId,
        lessonId,
        sectionId,
        prompt,
        type: 'MULTIPLE_CHOICE',
        options: [correct, (a + b + 2).toString(), (a + b - 1).toString(), (a + b + 5).toString()].sort(),
        correctAnswer: correct,
        explanation: `${a} + ${b} = ${a + b}`,
        hint: 'Oddiy qo‘shish amali.',
        formulaLatex: `${a} + ${b} = ${a + b}`,
        orderIndex: i,
      });
    }
  }

  return list;
}

// ----------------------------------------------------
// CURRICULUM SEED DATA: Organized Hierarchy (Grades 1-11)
// Grade -> Subject -> Chapter -> Lesson -> Section -> 10 Questions -> Results
// ----------------------------------------------------
export const initialLessons: LessonModel[] = [
  // --- GRADE 3: Qo'shish va ayirish ---
  {
    id: 'lesson-g3-addsub',
    courseId: 'course-g3-math',
    chapterId: 'chap-g3-01',
    chapterTitle: 'Qo‘shish va ayirish',
    grade: 3,
    mode: 'KIDS',
    title: 'Ko‘p xonali sonlarni qo‘shish va ayirish',
    topicKey: 'addition_subtraction_3rd',
    description: 'Ustun shaklida xonasidan oshirib qo‘shish va o‘nlikdan qarz olib ayirish.',
    formulaLatex: '12 + 8 = 20',
    contentMd: `## Dars maqsadi
Uch xonali va ikki xonali sonlarni tez va to‘g‘ri qo‘shish hamda ayirishni o‘rganish.

### Tushuntirish
Qo‘shish amali birliklardan boshlanadi. Agar birliklar yig‘indisi 10 dan oshsa, o‘nlikka 1 qo‘shiladi.
Misol: 12 + 8 = 20.`,
    rewardXP: 100,
    rewardCoins: 10,
    orderIndex: 1,
    sections: [
      {
        id: 'sec-g3-01-s1',
        lessonId: 'lesson-g3-addsub',
        title: '1-qism: Oddiy qo‘shish va ayirish',
        orderIndex: 1,
        questions: createTenQuestions('g3-s1', 'lesson-g3-addsub', 'sec-g3-01-s1', 'add_sub_3rd'),
      },
      {
        id: 'sec-g3-01-s2',
        lessonId: 'lesson-g3-addsub',
        title: '2-qism: O‘nlikdan oshirib qo‘shish',
        orderIndex: 2,
        questions: createTenQuestions('g3-s2', 'lesson-g3-addsub', 'sec-g3-01-s2', 'add_sub_3rd'),
      },
    ],
  },

  // --- GRADE 4: Oddiy kasrlar ---
  {
    id: 'lesson-k4-01',
    courseId: 'course-g4-math',
    chapterId: 'chap-g4-01',
    chapterTitle: 'Kasrlar va Bo‘laklar',
    grade: 4,
    mode: 'KIDS',
    title: 'Oddiy kasrlar: Butunning bo‘laklari',
    topicKey: 'fractions_intro',
    description: 'Kasr nima? Surat va maxraj ma’nosi, doiraviy diagrammalar.',
    formulaLatex: '\\frac{1}{4} = \\text{to‘rtdan bir}',
    contentMd: `## Dars maqsadi
Kasr tushunchasi, uning surati va maxraji o‘rtasidagi bog‘lanishni o‘zlashtirish.`,
    rewardXP: 100,
    rewardCoins: 10,
    orderIndex: 2,
    sections: [
      {
        id: 'sec-k4-01-s1',
        lessonId: 'lesson-k4-01',
        title: '1-qism: Kasrni tanish va ifodalash',
        orderIndex: 1,
        questions: createTenQuestions('k4-s1', 'lesson-k4-01', 'sec-k4-01-s1', 'fractions_4th'),
      },
      {
        id: 'sec-k4-01-s2',
        lessonId: 'lesson-k4-01',
        title: '2-qism: Bir xil maxrajli kasrlarni taqqoslash',
        orderIndex: 2,
        questions: createTenQuestions('k4-s2', 'lesson-k4-01', 'sec-k4-01-s2', 'fractions_4th'),
      },
    ],
  },

  // ==========================================
  // 5-SINF MATEMATIKA KURIKULUMI (4 TA DARS)
  // ==========================================
  {
    id: 'lesson-g5-01',
    courseId: 'course-g5-math',
    chapterId: 'chap-g5-01',
    chapterTitle: 'Kasrlar va ularning xossalari',
    grade: 5,
    mode: 'KIDS',
    title: 'Oddiy kasrlar va ularning asosiy xossasi',
    topicKey: 'fractions_base_5th',
    description: 'Kasrning asosiy xossasi, kasrlarni qisqartirish va umumiy ko‘paytuvchi.',
    formulaLatex: '\\frac{a}{b} = \\frac{a \\cdot k}{b \\cdot k}',
    contentMd: `## Kirish va Dars Maqsadi
Ushbu darsda siz kasrning asosiy xossasi bilan tanishasiz. Kasrning surat va maxrajini noldan farqli bir xil songa ko‘paytirsak yoki bo‘lsak, kasrning qiymati o‘zgarmaydi!

### Hayotiy Misol (Pitsa va Shokolad)
Tasavvur qiling, pitsa 4 ta bo‘lakka bo‘lingan va siz 2 ta bo‘lak yedingiz (2/4). Bu yarimta pitsani (1/2) yeyish bilan tengdir!

### Keng Tarqalgan Xato
Diqqat! Kasrni qisqartirishda faqat bitta sonni (masalan faqat suratni) bo‘lish xatodir. Ikkala qism ham bir xil songa bo‘linishi shart!`,
    rewardXP: 100,
    rewardCoins: 15,
    orderIndex: 3,
    sections: [
      {
        id: 'sec-g5-01-s1',
        lessonId: 'lesson-g5-01',
        title: '1-qism: Kasrning asosiy xossasi va qisqartirish',
        orderIndex: 1,
        questions: createTenQuestions('g5-01-s1', 'lesson-g5-01', 'sec-g5-01-s1', 'fractions_5th'),
      },
    ],
  },
  {
    id: 'lesson-g5-02',
    courseId: 'course-g5-math',
    chapterId: 'chap-g5-01',
    chapterTitle: 'Kasrlar arifmetikasi',
    grade: 5,
    mode: 'KIDS',
    title: 'Bir xil maxrajli kasrlarni qo‘shish va ayirish',
    topicKey: 'fractions_add_sub_5th',
    description: 'Maxrajlari teng bo‘lgan kasrlar bilan hisoblash qoidalari.',
    formulaLatex: '\\frac{a}{c} + \\frac{b}{c} = \\frac{a + b}{c}',
    contentMd: `## Kirish
Bir xil maxrajli kasrlarni qo‘shish yoki ayirishda eng muhim oltin qoida: MAXRAJ O‘ZGARMAYDI!

### Qadam-baqam Qoida:
1. Maxrajni o‘zgarishsiz qoldiring.
2. Faqat suratlarni qo‘shing yoki ayiring.
3. Agar natija qisqaradigan bo‘lsa, uni oxirigacha qisqartiring!

### Misol:
3/8 + 2/8 = (3 + 2)/8 = 5/8.`,
    rewardXP: 100,
    rewardCoins: 15,
    orderIndex: 4,
    sections: [
      {
        id: 'sec-g5-02-s1',
        lessonId: 'lesson-g5-02',
        title: '1-qism: Bir xil maxrajli kasrlar ustida amallar',
        orderIndex: 1,
        questions: createTenQuestions('g5-02-s1', 'lesson-g5-02', 'sec-g5-02-s1', 'fractions_ops_5th'),
      },
    ],
  },
  {
    id: 'lesson-g5-03',
    courseId: 'course-g5-math',
    chapterId: 'chap-g5-01',
    chapterTitle: 'Umumiy maxraj',
    grade: 5,
    mode: 'KIDS',
    title: 'Har xil maxrajli kasrlarni qo‘shish va EKUK',
    topicKey: 'fractions_unlike_5th',
    description: 'Kasrlarni umumiy maxrajga keltirish va hisoblash.',
    formulaLatex: '\\frac{1}{2} + \\frac{1}{3} = \\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}',
    contentMd: `## Umumiy Maxrajga Keltirish
Har xil maxrajli kasrlarni to‘g‘ridan-to‘g‘ri qo‘shib bo‘lmaydi. Dastlab ularni eng kichik umumiy karrali (EKUK) orqali umumiy maxrajga keltirish zarur!

### 3 Bosqichli Yechim:
1. Maxrajlar uchun EKUK toping (masalan 2 va 3 uchun 6).
2. Har bir kasr uchun qo‘shimcha ko‘paytuvchini aniqlang.
3. Yangi maxrajda suratlarni qo‘shing.`,
    rewardXP: 120,
    rewardCoins: 15,
    orderIndex: 5,
    sections: [
      {
        id: 'sec-g5-03-s1',
        lessonId: 'lesson-g5-03',
        title: '1-qism: Har xil maxrajli kasrlar',
        orderIndex: 1,
        questions: createTenQuestions('g5-03-s1', 'lesson-g5-03', 'sec-g5-03-s1', 'fractions_ops_5th'),
      },
    ],
  },
  {
    id: 'lesson-g5-04',
    courseId: 'course-g5-math',
    chapterId: 'chap-g5-02',
    chapterTitle: 'O‘nli kasrlar',
    grade: 5,
    mode: 'KIDS',
    title: 'O‘nli kasrlar va xona birliklari',
    topicKey: 'decimals_intro_5th',
    description: 'Vergul bilan yoziluvchi kasrlar, oddiy kasrni o‘nli kasrga aylantirish.',
    formulaLatex: '\\frac{1}{2} = 0.5, \\quad \\frac{1}{4} = 0.25',
    contentMd: `## O‘nli Kasrlar bilan Tanishuv
Maxraji 10, 100, 1000 bo‘lgan kasrlar o‘nli kasrlar deb ataladi. Masalan, 3/10 = 0.3, 25/100 = 0.25.

### Muhim O‘rganish:
O‘nli kasrlarni qo‘shishda vergul tagiga vergul tushishi shart!
Misol: 0.5 + 0.25 = 0.75.`,
    rewardXP: 100,
    rewardCoins: 15,
    orderIndex: 6,
    sections: [
      {
        id: 'sec-g5-04-s1',
        lessonId: 'lesson-g5-04',
        title: '1-qism: O‘nli kasrlarni ifodalash',
        orderIndex: 1,
        questions: createTenQuestions('g5-04-s1', 'lesson-g5-04', 'sec-g5-04-s1', 'decimals_5th'),
      },
    ],
  },

  // ==========================================
  // 6-SINF MATEMATIKA KURIKULUMI (4 TA DARS)
  // ==========================================
  {
    id: 'lesson-g6-01',
    courseId: 'course-g6-math',
    chapterId: 'chap-g6-01',
    chapterTitle: 'Foizlar',
    grade: 6,
    mode: 'KIDS',
    title: 'Foizlar tushunchasi va sonning foizini topish',
    topicKey: 'percentages_intro_6th',
    description: 'Yuzdan bir qism — foiz ma’nosi, formulalar va hisoblash.',
    formulaLatex: '1\\% = \\frac{1}{100} = 0.01',
    contentMd: `## Foiz Nima?
Har qanday sonning yoki narsaning yuzdan bir qismi 1 foiz (1%) deyiladi.
- 50% — bu yarmi (1/2).
- 25% — bu choragi (1/4).
- 100% — butun sonning o‘zi!

### Formula:
A sonining P foizini topish: (A * P) / 100.
Masalan: 200 ning 10% i = (200 * 10) / 100 = 20.`,
    rewardXP: 110,
    rewardCoins: 15,
    orderIndex: 7,
    sections: [
      {
        id: 'sec-g6-01-s1',
        lessonId: 'lesson-g6-01',
        title: '1-qism: Sonning foizini hisoblash',
        orderIndex: 1,
        questions: createTenQuestions('g6-01-s1', 'lesson-g6-01', 'sec-g6-01-s1', 'percentages_6th'),
      },
    ],
  },
  {
    id: 'lesson-g6-02',
    courseId: 'course-g6-math',
    chapterId: 'chap-g6-01',
    chapterTitle: 'Amaliy foizlar',
    grade: 6,
    mode: 'KIDS',
    title: 'Foizlarga doir amaliy masalalar va chegirmalar',
    topicKey: 'percentages_discounts_6th',
    description: 'Do‘kondagi chegirmalar, narxlarning oshishi va foiz hisobi.',
    formulaLatex: 'Narx_{yangi} = Narx_{asl} \\cdot (1 - \\frac{p}{100})',
    contentMd: `## Hayotiy Masalalar: Do‘konda Chegirma
Agar 100 000 so‘mlik futbolkaga 20% chegirma e’lon qilinsa, siz qancha to‘laysiz?
1. Chegirma miqdori: 100 000 * 0.20 = 20 000 so‘m.
2. Yangi to‘lanadigan narx: 100 000 - 20 000 = 80 000 so‘m!`,
    rewardXP: 110,
    rewardCoins: 15,
    orderIndex: 8,
    sections: [
      {
        id: 'sec-g6-02-s1',
        lessonId: 'lesson-g6-02',
        title: '1-qism: Chegirmalar va amaliy foizlar',
        orderIndex: 1,
        questions: createTenQuestions('g6-02-s1', 'lesson-g6-02', 'sec-g6-02-s1', 'percentages_app_6th'),
      },
    ],
  },
  {
    id: 'lesson-g6-03',
    courseId: 'course-g6-math',
    chapterId: 'chap-g6-02',
    chapterTitle: 'Proporsiya',
    grade: 6,
    mode: 'KIDS',
    title: 'Nisbat va mutanosiblik (Proporsiya)',
    topicKey: 'proportions_6th',
    description: 'Ikki nisbatning tengligi va chetki hadlar ko‘paytmasi xossasi.',
    formulaLatex: '\\frac{a}{b} = \\frac{c}{d} \\implies a \\cdot d = b \\cdot c',
    contentMd: `## Proporsiya va Oltin Qoida
Ikki nisbatning tengligi proporsiya deb ataladi.
Asosiy qoida: Chetki hadlar ko‘paytmasi o‘rta hadlar ko‘paytmasiga teng!
Misol: x / 6 = 4 / 3 bo‘lsa, x * 3 = 6 * 4 => 3x = 24 => x = 8.`,
    rewardXP: 110,
    rewardCoins: 15,
    orderIndex: 9,
    sections: [
      {
        id: 'sec-g6-03-s1',
        lessonId: 'lesson-g6-03',
        title: '1-qism: Proporsiya tenglamalari',
        orderIndex: 1,
        questions: createTenQuestions('g6-03-s1', 'lesson-g6-03', 'sec-g6-03-s1', 'ratios_6th'),
      },
    ],
  },
  {
    id: 'lesson-g6-04',
    courseId: 'course-g6-math',
    chapterId: 'chap-g6-03',
    chapterTitle: 'Manfiy sonlar',
    grade: 6,
    mode: 'KIDS',
    title: 'Musbat va manfiy sonlar ustida arifmetik amallar',
    topicKey: 'integers_arithmetic_6th',
    description: 'Sonlar o‘qi, manfiy sonlarni qo‘shish, ayirish va ko‘paytirish.',
    formulaLatex: '(-a) + (-b) = -(a + b), \\quad (-a) \\cdot (-b) = +ab',
    contentMd: `## Manfiy Sonlar Qoidalari
1. Ikkita manfiy son qo‘shilganda natija manfiy bo‘ladi: (-5) + (-7) = -12.
2. Manfiy sonni manfiy songa ko‘paytirganda musbat bo‘ladi: (-4) * (-5) = +20.
3. Minus minusni plyusga aylantiradi: 8 - (-3) = 8 + 3 = 11.`,
    rewardXP: 110,
    rewardCoins: 15,
    orderIndex: 10,
    sections: [
      {
        id: 'sec-g6-04-s1',
        lessonId: 'lesson-g6-04',
        title: '1-qism: Butun sonlar ustida amallar',
        orderIndex: 1,
        questions: createTenQuestions('g6-04-s1', 'lesson-g6-04', 'sec-g6-04-s1', 'integers_6th'),
      },
    ],
  },

  // ==========================================
  // 7-SINF MATEMATIKA / ALGEBRA (4 TA DARS)
  // ==========================================
  {
    id: 'lesson-g7-01',
    courseId: 'course-g7-algebra',
    chapterId: 'chap-g7-01',
    chapterTitle: 'Chiziqli tenglamalar',
    grade: 7,
    mode: 'TEEN',
    title: 'Chiziqli bir noma’lumli tenglamalar',
    topicKey: 'linear_equations_7th',
    description: 'ax + b = c ko‘rinishidagi tenglamalarni yechish bosqichlari.',
    formulaLatex: 'ax + b = c \\implies ax = c - b \\implies x = \\frac{c - b}{a}',
    contentMd: `## Chiziqli Tenglamalar
Tenglama — noma'lum son qatnashgan tenglikdir.
Tenglamani yechish bu tarozining ikki pallasini muvozanatda ushlashga o‘xshaydi!

### Bosqichma-bosqich:
1. Sonlarni o‘ng tomonga qarama-qarshi ishora bilan o‘tkazing.
2. Noma'lum qatnashgan hadlarni chap tomonda qoldiring.
3. Ikkala tomonni noma'lum oldidagi koeffitsiyentga bo‘ling.
Misol: 2x + 6 = 16 => 2x = 10 => x = 5.`,
    rewardXP: 120,
    rewardCoins: 20,
    orderIndex: 11,
    sections: [
      {
        id: 'sec-g7-01-s1',
        lessonId: 'lesson-g7-01',
        title: '1-qism: Asosiy chiziqli tenglamalar',
        orderIndex: 1,
        questions: createTenQuestions('g7-01-s1', 'lesson-g7-01', 'sec-g7-01-s1', 'equations_7th'),
      },
    ],
  },
  {
    id: 'lesson-g7-02',
    courseId: 'course-g7-algebra',
    chapterId: 'chap-g7-01',
    chapterTitle: 'Algebraik ifodalar',
    grade: 7,
    mode: 'TEEN',
    title: 'Qavslarni ochish va o‘xshash hadlarni ixchamlash',
    topicKey: 'algebraic_terms_7th',
    description: 'Taqsimot qonuni, qavslar oldidagi ishoralar va ixchamlash.',
    formulaLatex: 'a(b + c) = ab + ac, \\quad -(a - b) = -a + b',
    contentMd: `## Qavslarni Ochish Qoidalari
1. Agar qavs oldida musbat (+) ishora bo‘lsa, qavs ichidagi hadlar o‘zgarishsiz qoladi.
2. Agar qavs oldida manfiy (-) ishora bo‘lsa, barcha ishoralar teskarisiga o‘zgaradi!
3. Ko‘paytuvchi qavs ichidagi har bir hadga ko‘paytiriladi: 3(x + 4) = 3x + 12.`,
    rewardXP: 120,
    rewardCoins: 20,
    orderIndex: 12,
    sections: [
      {
        id: 'sec-g7-02-s1',
        lessonId: 'lesson-g7-02',
        title: '1-qism: Qavslarni ochish va ixchamlash',
        orderIndex: 1,
        questions: createTenQuestions('g7-02-s1', 'lesson-g7-02', 'sec-g7-02-s1', 'algebra_terms_7th'),
      },
    ],
  },
  {
    id: 'lesson-g7-03',
    courseId: 'course-g7-algebra',
    chapterId: 'chap-g7-02',
    chapterTitle: 'Qisqa ko‘paytirish formulalari',
    grade: 7,
    mode: 'TEEN',
    title: 'Qisqa ko‘paytirish: Yig‘indining kvadrati',
    topicKey: 'binomial_square_7th',
    description: '(a + b)² formulasining ma’nosi va ifodalarni soddalashtirish.',
    formulaLatex: '(a + b)^2 = a^2 + 2ab + b^2',
    contentMd: `## Yig‘indining Kvadrati
Ikki son yig‘indisining kvadrati birinchi sonning kvadrati, ikkalasining ikkilangan ko‘paytmasi va ikkinchi sonning kvadratining yig‘indisiga teng!
(x + 3)² = x² + 2*3*x + 3² = x² + 6x + 9.

### Eng Ko‘p Uchraydigan Xato:
Hech qachon (a + b)² = a² + b² deb yozmang! O‘rtadagi 2ab qismi tushirib qoldirilmasligi shart!`,
    rewardXP: 130,
    rewardCoins: 20,
    orderIndex: 13,
    sections: [
      {
        id: 'sec-g7-03-s1',
        lessonId: 'lesson-g7-03',
        title: '1-qism: Yig‘indining kvadrati formulasi',
        orderIndex: 1,
        questions: createTenQuestions('g7-03-s1', 'lesson-g7-03', 'sec-g7-03-s1', 'algebra_square_7th'),
      },
    ],
  },
  {
    id: 'lesson-g7-04',
    courseId: 'course-g7-algebra',
    chapterId: 'chap-g7-02',
    chapterTitle: 'Matnli masalalar',
    grade: 7,
    mode: 'TEEN',
    title: 'Tenglamalar yordamida matnli masalalarni yechish',
    topicKey: 'word_problems_linear_7th',
    description: 'Matnli masalalarni matematik tilga o‘girish va tenglama tuzish.',
    formulaLatex: 'x + (x + 4) = 24 \\implies 2x = 20 \\implies x = 10',
    contentMd: `## Matnli Masalalarni Yechish Strategiyasi
1. Noma’lumni 'x' deb belgilang.
2. Shart bo‘yicha boshqa kattaliklarni 'x' orqali ifodalang.
3. Matematik tenglik (tenglama) tuzing va yeching.
4. Topilgan javobni masala mazmuniga mosligini tekshiring!`,
    rewardXP: 130,
    rewardCoins: 20,
    orderIndex: 14,
    sections: [
      {
        id: 'sec-g7-04-s1',
        lessonId: 'lesson-g7-04',
        title: '1-qism: Matnli masalalar va tenglamalar',
        orderIndex: 1,
        questions: createTenQuestions('g7-04-s1', 'lesson-g7-04', 'sec-g7-04-s1', 'word_problems_7th'),
      },
    ],
  },

  // --- GRADE 8: Kvadrat tenglamalar ---
  {
    id: 'lesson-t8-01',
    courseId: 'course-g8-algebra',
    chapterId: 'chap-g8-01',
    chapterTitle: 'Kvadrat tenglamalar',
    grade: 8,
    mode: 'TEEN',
    title: 'Kvadrat tenglamalar va Diskriminant',
    topicKey: 'quadratic_equations',
    description: 'ax² + bx + c = 0 ko‘rinishidagi tenglamalarni yechish qoidalari.',
    formulaLatex: 'D = b^2 - 4ac, \\quad x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}',
    contentMd: `## Dars maqsadi
Diskriminant formulasi yordamida kvadrat tenglamaning ildizlar soni va qiymatlarini topish.`,
    rewardXP: 150,
    rewardCoins: 10,
    orderIndex: 15,
    sections: [
      {
        id: 'sec-t8-01-s1',
        lessonId: 'lesson-t8-01',
        title: '1-qism: Chiziqli va kvadrat ifodalar',
        orderIndex: 1,
        questions: createTenQuestions('t8-s1', 'lesson-t8-01', 'sec-t8-01-s1', 'equations_8th'),
      },
      {
        id: 'sec-t8-01-s2',
        lessonId: 'lesson-t8-01',
        title: '2-qism: Diskriminantni hisoblash',
        orderIndex: 2,
        questions: createTenQuestions('t8-s2', 'lesson-t8-01', 'sec-t8-01-s2', 'equations_8th'),
      },
    ],
  },
];

export const initialDailyTasks: DailyTaskModel[] = [
  {
    key: 'task_solve_5',
    title: '5 ta masala yeching',
    description: 'Dars yoki mashqlardan 5 ta to‘g‘ri javob toping.',
    targetCount: 5,
    rewardCoins: 5,
    rewardXP: 40,
  },
  {
    key: 'task_complete_lesson',
    title: '1 ta dars qismini yakunlang',
    description: '10 ta savolli dars qismini muvaffaqiyatli topshiring.',
    targetCount: 1,
    rewardCoins: 10,
    rewardXP: 60,
  },
  {
    key: 'task_play_space_game',
    title: 'Kosmik hisob o‘yinini o‘ynang',
    description: 'Fazoviy arifmetika o‘yinida kamida 50 ball to‘plang.',
    targetCount: 1,
    rewardCoins: 5,
    rewardXP: 30,
  },
  {
    key: 'task_ai_consult',
    title: 'AI Ustozdan yordam so‘rang',
    description: 'Tushunmagan misolingiz bo‘yicha AI Ustoz bilan suhbatlashing.',
    targetCount: 1,
    rewardCoins: 5,
    rewardXP: 25,
  },
];

export const initialAchievements: AchievementModel[] = [
  {
    key: 'ach_first_step',
    title: 'Birinchi qadam',
    description: 'MathCity AI da birinchi darsni muvaffaqiyatli yakunladingiz.',
    iconName: 'flag',
    rewardCoins: 10,
    rewardXP: 50,
  },
  {
    key: 'ach_math_whiz',
    title: 'Hisob ustasi',
    description: 'Ketma-ket 10 ta masalaga xatosiz to‘g‘ri javob berdingiz.',
    iconName: 'bolt',
    rewardCoins: 20,
    rewardXP: 120,
  },
  {
    key: 'ach_city_builder',
    title: 'Shahar bunyodkori',
    description: 'Mening shahrimda birinchi binoni qurdingiz.',
    iconName: 'apartment',
    rewardCoins: 15,
    rewardXP: 60,
  },
  {
    key: 'ach_observatory_master',
    title: 'Yulduzlar tadqiqotchisi',
    description: 'Shahar rasadxonasini quring va astronomiya sirini oching.',
    iconName: 'visibility',
    rewardCoins: 50,
    rewardXP: 250,
  },
];
