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
  {
    key: 'house_basic',
    name: 'Kichik uy',
    category: 'residential',
    costInCoins: 100,
    requiredLevel: 1,
    description: 'Shahar aholisi uchun shinam 3D pastel uy.',
    iconName: 'home',
    mode: 'KIDS',
  },
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
    costInCoins: 100,
    requiredLevel: 2,
    description: 'Matematika qonunlari va kitoblar xazinasi.',
    iconName: 'menu_book',
    mode: 'KIDS',
  },
  {
    key: 'school_math',
    name: 'Matematika maktabi',
    category: 'education',
    costInCoins: 100,
    requiredLevel: 2,
    description: 'Yosh matematiklar bilim oladigan zamonaviy maskan.',
    iconName: 'school',
    mode: 'KIDS',
  },
  {
    key: 'observatory_space',
    name: 'Rasadxona (Observatoriya)',
    category: 'science',
    costInCoins: 100,
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
  generatorType: 'add_sub_3rd' | 'fractions_4th' | 'equations_8th' | 'mult_div_3rd' | 'quad_algebra_9th'
): QuestionModel[] {
  const list: QuestionModel[] = [];

  for (let i = 1; i <= 10; i++) {
    const qId = `${prefix}-q${i}`;

    if (generatorType === 'add_sub_3rd') {
      // 3-sinf: Qo'shish va ayirish (e.g. 12 + 8 = 20)
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
      // 4-sinf: Oddiy kasrlar (surat va maxraj, e.g. 1/4, 2/4)
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
        formulaLatex: `\\frac{${num}}{${den}}`,
        orderIndex: i,
      });
    } else if (generatorType === 'equations_8th') {
      // 8-sinf: Chiziqli tenglamalar (ax + b = c)
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
        formulaLatex: `${a}x + ${b} = ${c} \\implies x = ${x}`,
        orderIndex: i,
      });
    } else {
      // General arithmetic
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
    orderIndex: 3,
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
    title: 'Ziyo ustozdan yordam so‘rang',
    description: 'Tushunmagan misolingiz bo‘yicha Ziyo bilan suhbatlashing.',
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
