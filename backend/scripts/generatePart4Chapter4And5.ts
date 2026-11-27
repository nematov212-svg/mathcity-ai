import { LessonDef, buildLessonSeed, saveLessonFile } from './generatorTypes';

console.log("Generating Part 4 Chapter 4 & 5 lessons (137-144)...");

export const lesson137: LessonDef = {
  bookNumber: 137,
  title: "Tenglamalar",
  emoji: "🧩",
  shortDesc: "Noma'lum qo'shiluvchini topish: x + a = b va a + x = b ko'rinishidagi tenglamalar",
  intro: "Noma'lum son qatnashgan tenglikka tenglama deyiladi. Noma'lum son odatda x (iks) lotin harfi bilan belgilanadi. Tenglamani yechish — x o'rniga qo'yilganda to'g'ri tenglik hosil qiladigan sonni (tenglama ildizini) topish demakdir.",
  keyPoints: [
    "Tenglama — noma'lum sonli tenglik (masalan, x + 5 = 20).",
    "Noma'lum qo'shiluvchini topish uchun yig'indidan ma'lum qo'shiluvchi ayriladi.",
    "x + 5 = 20 bo'lsa, x = 20 - 5 = 15.",
    "Tekshirish: topilgan sonni x o'rniga qo'yamiz: 15 + 5 = 20 (to'g'ri!)."
  ],
  miniExample: {
    emojis: "🧩 x + 5 = 20 -> x = 15",
    text: "Qaysi songa 5 ni qo'shsak 20 bo'ladi? Yig'indidan 5 ni ayiramiz: 20 - 5 = 15. Demak, x = 15!"
  },
  xpReward: 110,
  coinReward: 12,
  estMinutes: 9,
  practice: [
    {
      text: "x + 6 = 14 tenglamani yeching:",
      correctAnswer: "x = 8",
      distractors: ["x = 20", "x = 7", "x = 9"],
      explanation: "x = 14 - 6 = 8."
    },
    {
      text: "7 + x = 15 tenglamada x nechaga teng?",
      correctAnswer: "x = 8",
      distractors: ["x = 9", "x = 22", "x = 6"],
      explanation: "x = 15 - 7 = 8."
    },
    {
      text: "x + 10 = 30 tenglamaning ildizini toping:",
      correctAnswer: "x = 20",
      distractors: ["x = 40", "x = 15", "x = 25"],
      explanation: "x = 30 - 10 = 20."
    }
  ],
  test: [
    {
      text: "x + 5 = 20 tenglamada x nimaga teng?",
      correctAnswer: "x = 15",
      distractors: ["x = 25", "x = 14", "x = 16"],
      explanation: "x = 20 - 5 = 15."
    },
    {
      text: "x + 8 = 18 tenglamani yeching:",
      correctAnswer: "x = 10",
      distractors: ["x = 26", "x = 8", "x = 12"],
      explanation: "x = 18 - 8 = 10."
    },
    {
      text: "4 + x = 12 tenglamada x nechaga teng?",
      correctAnswer: "x = 8",
      distractors: ["x = 16", "x = 6", "x = 9"],
      explanation: "x = 12 - 4 = 8."
    },
    {
      text: "x + 9 = 15 tenglamaning yechimini toping:",
      correctAnswer: "x = 6",
      distractors: ["x = 24", "x = 5", "x = 7"],
      explanation: "x = 15 - 9 = 6."
    },
    {
      text: "12 + x = 20 tenglamada x nimaga teng?",
      correctAnswer: "x = 8",
      distractors: ["x = 32", "x = 7", "x = 9"],
      explanation: "x = 20 - 12 = 8."
    },
    {
      text: "x + 15 = 25 tenglamani yeching:",
      correctAnswer: "x = 10",
      distractors: ["x = 40", "x = 15", "x = 5"],
      explanation: "x = 25 - 15 = 10."
    },
    {
      text: "Tenglamada noma'lum qo'shiluvchini topish qoidasi qaysi?",
      correctAnswer: "Yig'indidan ma'lum qo'shiluvchi ayriladi",
      distractors: [
        "Yig'indiga ma'lum qo'shiluvchi qo'shiladi",
        "Ikkala son ko'paytiriladi",
        "Amal o'zgartirilmaydi"
      ],
      explanation: "Noma'lum qo'shiluvchini topish uchun yig'indidan ma'lum qo'shiluvchi ayiriladi."
    },
    {
      text: "20 + x = 50 tenglamada x nechaga teng?",
      correctAnswer: "x = 30",
      distractors: ["x = 70", "x = 25", "x = 35"],
      explanation: "x = 50 - 20 = 30."
    },
    {
      text: "x + 30 = 70 tenglamaning ildizini toping:",
      correctAnswer: "x = 40",
      distractors: ["x = 100", "x = 35", "x = 50"],
      explanation: "x = 70 - 30 = 40."
    },
    {
      text: "x + 7 = 16 tenglamani yeching:",
      correctAnswer: "x = 9",
      distractors: ["x = 23", "x = 8", "x = 10"],
      explanation: "x = 16 - 7 = 9."
    },
    {
      text: "11 + x = 19 tenglamada x nimaga teng?",
      correctAnswer: "x = 8",
      distractors: ["x = 30", "x = 9", "x = 7"],
      explanation: "x = 19 - 11 = 8."
    },
    {
      text: "x + 22 = 45 tenglamani yeching:",
      correctAnswer: "x = 23",
      distractors: ["x = 67", "x = 21", "x = 25"],
      explanation: "x = 45 - 22 = 23."
    },
    {
      text: "14 + x = 30 tenglamada x nechaga teng?",
      correctAnswer: "x = 16",
      distractors: ["x = 44", "x = 14", "x = 18"],
      explanation: "x = 30 - 14 = 16."
    },
    {
      text: "x + 0 = 18 tenglamaning ildizi nechaga teng?",
      correctAnswer: "x = 18",
      distractors: ["x = 0", "x = 1", "x = 19"],
      explanation: "x = 18 - 0 = 18."
    },
    {
      text: "Agar x = 7 bo'lsa, qaysi tenglama to'g'ri bo'ladi?",
      correctAnswer: "x + 8 = 15",
      distractors: ["x + 5 = 11", "x + 10 = 20", "x + 4 = 13"],
      explanation: "7 + 8 = 15 to'g'ri tenglik."
    },
    {
      text: "x + 13 = 26 tenglamani yeching:",
      correctAnswer: "x = 13",
      distractors: ["x = 39", "x = 12", "x = 14"],
      explanation: "x = 26 - 13 = 13."
    },
    {
      text: "25 + x = 60 tenglamada x nechaga teng?",
      correctAnswer: "x = 35",
      distractors: ["x = 85", "x = 30", "x = 40"],
      explanation: "x = 60 - 25 = 35."
    },
    {
      text: "x + 40 = 90 tenglamani yeching:",
      correctAnswer: "x = 50",
      distractors: ["x = 130", "x = 45", "x = 55"],
      explanation: "x = 90 - 40 = 50."
    },
    {
      text: "Tenglamaning to'g'riligini qanday tekshiramiz?",
      correctAnswer: "Topilgan sonni x o'rniga qo'yib hisoblaymiz",
      distractors: [
        "Sonlarni bir-biriga qo'shamiz",
        "Faqat javobga qaraymiz",
        "Boshqa tenglama tuzamiz"
      ],
      explanation: "Ildiz x o'rniga qo'yilganda tenglik to'g'ri chiqsa, tenglama to'g'ri yechilgan."
    },
    {
      text: "x + 17 = 20 tenglamaning ildizi nechaga teng?",
      correctAnswer: "x = 3",
      distractors: ["x = 37", "x = 2", "x = 4"],
      explanation: "x = 20 - 17 = 3."
    }
  ]
};

export const lesson138: LessonDef = {
  bookNumber: 138,
  title: "Tenglamalar (2)",
  emoji: "🪜",
  shortDesc: "Noma'lum ayriluvchi va kamayuvchini topish: a - x = b va x - a = b",
  intro: "Ayirish amali qatnashgan tenglamalarda noma'lum son ayriluvchi (a - x = b) yoki kamayuvchi (x - a = b) bo'lishi mumkin. Noma'lum ayriluvchini topish uchun kamayuvchidan ayirma ayriladi. Noma'lum kamayuvchini topish uchun esa ayirmaga ayriluvchi qo'shiladi.",
  keyPoints: [
    "Noma'lum ayriluvchini topish: 45 - x = 22 -> x = 45 - 22 = 23.",
    "Noma'lum kamayuvchini topish: x - 7 = 10 -> x = 10 + 7 = 17.",
    "Kamayuvchi doim ayriluvchi va ayirmadan katta bo'ladi.",
    "Yechimni tekshirish: 45 - 23 = 22 (to'g'ri!)."
  ],
  miniExample: {
    emojis: "🪜 45 - x = 22 | x - 7 = 10",
    text: "45 dan nechini ayirsak 22 qoladi? 45 - 22 = 23 (x = 23). Qaysi sondan 7 ni ayirsak 10 qoladi? 10 + 7 = 17 (x = 17)!"
  },
  xpReward: 110,
  coinReward: 12,
  estMinutes: 9,
  practice: [
    {
      text: "45 - x = 22 tenglamani yeching:",
      correctAnswer: "x = 23",
      distractors: ["x = 67", "x = 22", "x = 25"],
      explanation: "x = 45 - 22 = 23."
    },
    {
      text: "x - 7 = 10 tenglamada x nechaga teng?",
      correctAnswer: "x = 17",
      distractors: ["x = 3", "x = 16", "x = 18"],
      explanation: "x = 10 + 7 = 17."
    },
    {
      text: "20 - x = 8 tenglamaning yechimini toping:",
      correctAnswer: "x = 12",
      distractors: ["x = 28", "x = 10", "x = 14"],
      explanation: "x = 20 - 8 = 12."
    }
  ],
  test: [
    {
      text: "45 - x = 22 tenglamada x nimaga teng?",
      correctAnswer: "x = 23",
      distractors: ["x = 67", "x = 21", "x = 24"],
      explanation: "x = 45 - 22 = 23."
    },
    {
      text: "x - 7 = 10 tenglamani yeching:",
      correctAnswer: "x = 17",
      distractors: ["x = 3", "x = 15", "x = 18"],
      explanation: "x = 10 + 7 = 17."
    },
    {
      text: "15 - x = 9 tenglamada x nechaga teng?",
      correctAnswer: "x = 6",
      distractors: ["x = 24", "x = 5", "x = 7"],
      explanation: "x = 15 - 9 = 6."
    },
    {
      text: "x - 5 = 15 tenglamaning ildizini toping:",
      correctAnswer: "x = 20",
      distractors: ["x = 10", "x = 25", "x = 15"],
      explanation: "x = 15 + 5 = 20."
    },
    {
      text: "30 - x = 12 tenglamani yeching:",
      correctAnswer: "x = 18",
      distractors: ["x = 42", "x = 16", "x = 20"],
      explanation: "x = 30 - 12 = 18."
    },
    {
      text: "x - 10 = 25 tenglamada x nimaga teng?",
      correctAnswer: "x = 35",
      distractors: ["x = 15", "x = 30", "x = 40"],
      explanation: "x = 25 + 10 = 35."
    },
    {
      text: "Noma'lum kamayuvchini topish uchun nima qilinadi?",
      correctAnswer: "Ayirmaga ayriluvchi qo'shiladi",
      distractors: [
        "Ayirmadan ayriluvchi ayriladi",
        "Ikkala son bir-biriga ko'paytiriladi",
        "Amal o'zgartirilmaydi"
      ],
      explanation: "x - a = b bo'lsa, kamayuvchi x = b + a bo'ladi."
    },
    {
      text: "Noma'lum ayriluvchini topish uchun nima qilinadi?",
      correctAnswer: "Kamayuvchidan ayirma ayriladi",
      distractors: [
        "Kamayuvchiga ayirma qo'shiladi",
        "Sonlar bir-biriga bo'linadi",
        "Hech qanday amal bajarilmaydi"
      ],
      explanation: "a - x = b bo'lsa, ayriluvchi x = a - b bo'ladi."
    },
    {
      text: "50 - x = 20 tenglamani yeching:",
      correctAnswer: "x = 30",
      distractors: ["x = 70", "x = 25", "x = 35"],
      explanation: "x = 50 - 20 = 30."
    },
    {
      text: "x - 8 = 12 tenglamada x nechaga teng?",
      correctAnswer: "x = 20",
      distractors: ["x = 4", "x = 18", "x = 22"],
      explanation: "x = 12 + 8 = 20."
    },
    {
      text: "40 - x = 15 tenglamaning ildizini toping:",
      correctAnswer: "x = 25",
      distractors: ["x = 55", "x = 20", "x = 30"],
      explanation: "x = 40 - 15 = 25."
    },
    {
      text: "x - 20 = 30 tenglamani yeching:",
      correctAnswer: "x = 50",
      distractors: ["x = 10", "x = 40", "x = 60"],
      explanation: "x = 30 + 20 = 50."
    },
    {
      text: "60 - x = 35 tenglamada x nimaga teng?",
      correctAnswer: "x = 25",
      distractors: ["x = 95", "x = 20", "x = 30"],
      explanation: "x = 60 - 35 = 25."
    },
    {
      text: "x - 14 = 16 tenglamaning yechimini toping:",
      correctAnswer: "x = 30",
      distractors: ["x = 2", "x = 28", "x = 32"],
      explanation: "x = 16 + 14 = 30."
    },
    {
      text: "75 - x = 50 tenglamani yeching:",
      correctAnswer: "x = 25",
      distractors: ["x = 125", "x = 20", "x = 30"],
      explanation: "x = 75 - 50 = 25."
    },
    {
      text: "x - 25 = 25 tenglamada x nechaga teng?",
      correctAnswer: "x = 50",
      distractors: ["x = 0", "x = 45", "x = 55"],
      explanation: "x = 25 + 25 = 50."
    },
    {
      text: "18 - x = 18 tenglamani yeching:",
      correctAnswer: "x = 0",
      distractors: ["x = 36", "x = 1", "x = 18"],
      explanation: "x = 18 - 18 = 0."
    },
    {
      text: "x - 0 = 34 tenglamaning ildizi nechaga teng?",
      correctAnswer: "x = 34",
      distractors: ["x = 0", "x = 35", "x = 33"],
      explanation: "x = 34 + 0 = 34."
    },
    {
      text: "Agar x = 14 bo'lsa, qaysi tenglama to'g'ri bo'ladi?",
      correctAnswer: "20 - x = 6",
      distractors: ["x - 5 = 8", "30 - x = 15", "x - 10 = 5"],
      explanation: "20 - 14 = 6 to'g'ri tenglik."
    },
    {
      text: "100 - x = 40 tenglamani yeching:",
      correctAnswer: "x = 60",
      distractors: ["x = 140", "x = 50", "x = 70"],
      explanation: "x = 100 - 40 = 60."
    }
  ]
};

export const lesson139: LessonDef = {
  bookNumber: 139,
  title: "Tenglamalar (3)",
  emoji: "🌳",
  shortDesc: "Yirikroq sonli va tekshirishli tenglamalarni yechish",
  intro: "Bu darsda biz 100 ichidagi yirik sonlar qatnashgan tenglamalarni yechishni mustahkamlaymiz va yechimning to'g'riligini amalda tekshirish ko'nikmasini rivojlantiramiz.",
  keyPoints: [
    "Qo'shish va ayirish qoidalarini aniq qo'llash.",
    "x + 24 = 60 -> x = 60 - 24 = 36.",
    "80 - x = 35 -> x = 80 - 35 = 45.",
    "Har bir topilgan ildizni tenglamaga qo'yib tekshirish shart."
  ],
  miniExample: {
    emojis: "🌳 x + 24 = 60 -> x = 36",
    text: "x ni topish uchun 60 dan 24 ni ayiramiz: 60 - 24 = 36. Tekshirish: 36 + 24 = 60. To'g'ri!"
  },
  xpReward: 115,
  coinReward: 12,
  estMinutes: 9,
  practice: [
    {
      text: "x + 24 = 60 tenglamani yeching:",
      correctAnswer: "x = 36",
      distractors: ["x = 84", "x = 34", "x = 38"],
      explanation: "x = 60 - 24 = 36."
    },
    {
      text: "80 - x = 35 tenglamada x nechaga teng?",
      correctAnswer: "x = 45",
      distractors: ["x = 115", "x = 40", "x = 55"],
      explanation: "x = 80 - 35 = 45."
    },
    {
      text: "x - 32 = 28 tenglamaning ildizini toping:",
      correctAnswer: "x = 60",
      distractors: ["x = 4", "x = 50", "x = 64"],
      explanation: "x = 28 + 32 = 60."
    }
  ],
  test: [
    {
      text: "x + 24 = 60 tenglamaning ildizi nechaga teng?",
      correctAnswer: "x = 36",
      distractors: ["x = 84", "x = 35", "x = 37"],
      explanation: "x = 60 - 24 = 36."
    },
    {
      text: "80 - x = 35 tenglamani yeching:",
      correctAnswer: "x = 45",
      distractors: ["x = 115", "x = 43", "x = 47"],
      explanation: "x = 80 - 35 = 45."
    },
    {
      text: "x - 45 = 15 tenglamada x nimaga teng?",
      correctAnswer: "x = 60",
      distractors: ["x = 30", "x = 55", "x = 65"],
      explanation: "x = 15 + 45 = 60."
    },
    {
      text: "54 + x = 70 tenglamani yeching:",
      correctAnswer: "x = 16",
      distractors: ["x = 124", "x = 14", "x = 18"],
      explanation: "x = 70 - 54 = 16."
    },
    {
      text: "90 - x = 42 tenglamaning ildizini toping:",
      correctAnswer: "x = 48",
      distractors: ["x = 132", "x = 46", "x = 50"],
      explanation: "x = 90 - 42 = 48."
    },
    {
      text: "x - 26 = 34 tenglamada x nechaga teng?",
      correctAnswer: "x = 60",
      distractors: ["x = 8", "x = 58", "x = 62"],
      explanation: "x = 34 + 26 = 60."
    },
    {
      text: "38 + x = 50 tenglamani yeching:",
      correctAnswer: "x = 12",
      distractors: ["x = 88", "x = 11", "x = 13"],
      explanation: "x = 50 - 38 = 12."
    },
    {
      text: "72 - x = 20 tenglamaning ildizini toping:",
      correctAnswer: "x = 52",
      distractors: ["x = 92", "x = 50", "x = 54"],
      explanation: "x = 72 - 20 = 52."
    },
    {
      text: "x - 18 = 42 tenglamada x nimaga teng?",
      correctAnswer: "x = 60",
      distractors: ["x = 24", "x = 58", "x = 62"],
      explanation: "x = 42 + 18 = 60."
    },
    {
      text: "46 + x = 80 tenglamani yeching:",
      correctAnswer: "x = 34",
      distractors: ["x = 126", "x = 32", "x = 36"],
      explanation: "x = 80 - 46 = 34."
    },
    {
      text: "65 - x = 30 tenglamaning yechimini toping:",
      correctAnswer: "x = 35",
      distractors: ["x = 95", "x = 30", "x = 40"],
      explanation: "x = 65 - 30 = 35."
    },
    {
      text: "x - 35 = 45 tenglamada x nechaga teng?",
      correctAnswer: "x = 80",
      distractors: ["x = 10", "x = 75", "x = 85"],
      explanation: "x = 45 + 35 = 80."
    },
    {
      text: "27 + x = 60 tenglamani yeching:",
      correctAnswer: "x = 33",
      distractors: ["x = 87", "x = 31", "x = 35"],
      explanation: "x = 60 - 27 = 33."
    },
    {
      text: "85 - x = 40 tenglamaning yechimi qanday?",
      correctAnswer: "x = 45",
      distractors: ["x = 125", "x = 42", "x = 48"],
      explanation: "x = 85 - 40 = 45."
    },
    {
      text: "x - 50 = 50 tenglamada x nimaga teng?",
      correctAnswer: "x = 100",
      distractors: ["x = 0", "x = 90", "x = 95"],
      explanation: "x = 50 + 50 = 100."
    },
    {
      text: "19 + x = 40 tenglamani yeching:",
      correctAnswer: "x = 21",
      distractors: ["x = 59", "x = 20", "x = 22"],
      explanation: "x = 40 - 19 = 21."
    },
    {
      text: "100 - x = 25 tenglamaning ildizini toping:",
      correctAnswer: "x = 75",
      distractors: ["x = 125", "x = 70", "x = 80"],
      explanation: "x = 100 - 25 = 75."
    },
    {
      text: "x - 15 = 65 tenglamada x nechaga teng?",
      correctAnswer: "x = 80",
      distractors: ["x = 50", "x = 75", "x = 85"],
      explanation: "x = 65 + 15 = 80."
    },
    {
      text: "Agar x = 24 bo'lsa, x + 36 tenglama qiymati qancha bo'ladi?",
      correctAnswer: "60",
      distractors: ["58", "62", "70"],
      explanation: "24 + 36 = 60."
    },
    {
      text: "Tenglamani tekshirish nima uchun zarur?",
      correctAnswer: "Topilgan javob to'g'ri ekanligiga to'liq ishonch hosil qilish uchun",
      distractors: [
        "Faqat daftarni to'ldirish uchun",
        "Amallarni o'chirib tashlash uchun",
        "Keragi yo'q"
      ],
      explanation: "Tekshirish hisoblashdagi xatolarni aniqlash va javobning to'g'riligini isbotlash uchun kerak."
    }
  ]
};

export const lesson140: LessonDef = {
  bookNumber: 140,
  title: "Masalalarni tenglamalar yordamida yechish",
  emoji: "🏅",
  shortDesc: "Matnli masalalarni tenglama tuzish orqali yechish usullari",
  intro: "Ko'pgina qiziqarli masalalarni tenglamalar yordamida juda oson yechish mumkin. Buning uchun masaladagi noma'lum miqdorni x harfi bilan belgilaymiz, matnga qarab tenglama tuzamiz va uni yechamiz.",
  keyPoints: [
    "1-qadam: Noma'lum miqdorni x deb belgilang.",
    "2-qadam: Masala shartiga mos tenglama tuzing.",
    "3-qadam: Tenglamani yechib, x ni toping.",
    "4-qadam: Masala savoliga to'liq javob yozing."
  ],
  miniExample: {
    emojis: "🍎 x + 5 = 20 -> x = 15",
    text: "Dildorada bir nechta olma bor edi. Onasi 5 ta bergach 20 ta bo'ldi. Avval nechta olma bo'lgan? x + 5 = 20 -> x = 15 ta olma!"
  },
  xpReward: 115,
  coinReward: 12,
  estMinutes: 9,
  practice: [
    {
      text: "Savatda bir nechta nok bor edi. Unga 6 ta nok qo'shilgach, 15 ta bo'ldi. Dastlab nechta nok bo'lgan?",
      correctAnswer: "9 ta (x + 6 = 15 -> x = 9)",
      distractors: ["10 ta", "8 ta", "21 ta"],
      explanation: "x + 6 = 15, x = 15 - 6 = 9 ta."
    },
    {
      text: "Avtobusda bir nechta yo'lovchi bor edi. Bekatda 7 kishi tushgach, 14 kishi qoldi. Dastlab necha kishi bo'lgan?",
      correctAnswer: "21 kishi (x - 7 = 14 -> x = 21)",
      distractors: ["20 kishi", "18 kishi", "7 kishi"],
      explanation: "x - 7 = 14, x = 14 + 7 = 21 kishi."
    },
    {
      text: "Gulshanda 25 ta atirgul bor edi. Bir nechtasi uzilgach, 18 ta qoldi. Nechta atirgul uzilgan?",
      correctAnswer: "7 ta (25 - x = 18 -> x = 7)",
      distractors: ["8 ta", "6 ta", "43 ta"],
      explanation: "25 - x = 18, x = 25 - 18 = 7 ta."
    }
  ],
  test: [
    {
      text: "Dildorada bir nechta olma bor edi. Unga onasi 5 ta bergach 20 ta bo'ldi. Masala tenglamasi qaysi?",
      correctAnswer: "x + 5 = 20",
      distractors: ["x - 5 = 20", "20 + 5 = x", "x = 20 + 5"],
      explanation: "Noma'lum olma soniga 5 ta qo'shilganda 20 ta bo'ldi: x + 5 = 20."
    },
    {
      text: "Bu masalada Dildorada dastlab nechta olma bo'lgan (x + 5 = 20)?",
      correctAnswer: "15 ta",
      distractors: ["25 ta", "14 ta", "16 ta"],
      explanation: "x = 20 - 5 = 15 ta."
    },
    {
      text: "Avtobusda x nafar yo'lovchi bor edi. 7 kishi tushgach 14 kishi qoldi. Masala tenglamasini toping:",
      correctAnswer: "x - 7 = 14",
      distractors: ["x + 7 = 14", "7 - x = 14", "x = 14 - 7"],
      explanation: "7 kishi tushgani uchun ayirish: x - 7 = 14."
    },
    {
      text: "Avtobusda dastlab necha kishi bo'lgan (x - 7 = 14)?",
      correctAnswer: "21 kishi",
      distractors: ["7 kishi", "20 kishi", "22 kishi"],
      explanation: "x = 14 + 7 = 21 kishi."
    },
    {
      text: "Akmal 30 ta daftar sotib oldi. Bir nechtasini ishlatgach, 12 ta qoldi. Nechta daftar ishlatilgan?",
      correctAnswer: "18 ta (30 - x = 12)",
      distractors: ["16 ta", "20 ta", "42 ta"],
      explanation: "30 - x = 12, x = 30 - 12 = 18 ta."
    },
    {
      text: "Sardor o'ylagan songa 10 ni qo'shsa 28 hosil bo'ladi. Sardor qaysi sonni o'ylagan?",
      correctAnswer: "18 (x + 10 = 28)",
      distractors: ["38", "16", "19"],
      explanation: "x + 10 = 28, x = 28 - 10 = 18."
    },
    {
      text: "Madina bir sondan 8 ni ayirsa 16 qoldi. Madina qaysi sonni o'ylagan?",
      correctAnswer: "24 (x - 8 = 16)",
      distractors: ["8", "22", "26"],
      explanation: "x - 8 = 16, x = 16 + 8 = 24."
    },
    {
      text: "Kutubxonada bir nechta kitob bor edi. Yana 15 ta kitob keltirilgach, 40 ta bo'ldi. Avval nechta kitob bo'lgan?",
      correctAnswer: "25 ta (x + 15 = 40)",
      distractors: ["55 ta", "20 ta", "30 ta"],
      explanation: "x + 15 = 40, x = 40 - 15 = 25 ta."
    },
    {
      text: "Do'konda 50 quti shokolad bor edi. Bir nechtasi sotilgach, 22 quti qoldi. Nechta quti sotilgan?",
      correctAnswer: "28 quti (50 - x = 22)",
      distractors: ["72 quti", "26 quti", "30 quti"],
      explanation: "50 - x = 22, x = 50 - 22 = 28 quti."
    },
    {
      text: "Bir fermada bir nechta buzoq bor edi. Yana 8 ta buzoq tug'ilgach, 24 ta bo'ldi. Avval nechta buzoq bor edi?",
      correctAnswer: "16 ta (x + 8 = 24)",
      distractors: ["32 ta", "15 ta", "18 ta"],
      explanation: "x + 8 = 24, x = 24 - 8 = 16 ta."
    },
    {
      text: "Bog'bon daraxtdan 35 ta olma uzdi. Bir nechtasini bolalarga bergach, 20 ta qoldi. Bolalarga nechta berilgan?",
      correctAnswer: "15 ta (35 - x = 20)",
      distractors: ["55 ta", "12 ta", "18 ta"],
      explanation: "35 - x = 20, x = 35 - 20 = 15 ta."
    },
    {
      text: "O'quvchi bir nechta misol yechdi. Yana 9 ta yechsa jami 25 ta bo'ladi. U nechta misol yechgan?",
      correctAnswer: "16 ta (x + 9 = 25)",
      distractors: ["34 ta", "15 ta", "17 ta"],
      explanation: "x + 9 = 25, x = 25 - 9 = 16 ta."
    },
    {
      text: "Qutida bir nechta tugma bor edi. Undan 14 ta olingach, 16 ta qoldi. Dastlab qutida nechta tugma bo'lgan?",
      correctAnswer: "30 ta (x - 14 = 16)",
      distractors: ["2 ta", "28 ta", "32 ta"],
      explanation: "x - 14 = 16, x = 16 + 14 = 30 ta."
    },
    {
      text: "Sayyoh 18 km yo'l yurdi. U yana bir necha km yursa, jami 30 km bo'ladi. Yana necha km yurishi kerak?",
      correctAnswer: "12 km (18 + x = 30)",
      distractors: ["48 km", "10 km", "14 km"],
      explanation: "18 + x = 30, x = 30 - 18 = 12 km."
    },
    {
      text: "Bozorda 45 kg sabzi bor edi. Tushgacha bir necha kg sotilgach, 15 kg qoldi. Necha kg sabzi sotilgan?",
      correctAnswer: "30 kg (45 - x = 15)",
      distractors: ["60 kg", "25 kg", "35 kg"],
      explanation: "45 - x = 15, x = 45 - 15 = 30 kg."
    },
    {
      text: "Anvarda x ta yong'oq bor edi. Ukasiga 6 ta bergach 12 ta qoldi. Anvarda dastlab nechta bo'lgan?",
      correctAnswer: "18 ta (x - 6 = 12)",
      distractors: ["6 ta", "16 ta", "20 ta"],
      explanation: "x - 6 = 12, x = 12 + 6 = 18 ta."
    },
    {
      text: "Tikuvchi 60 metr matodan ko'ylaklar tikdi va 25 metr mato ortib qoldi. Necha metr mato ishlatilgan?",
      correctAnswer: "35 metr (60 - x = 25)",
      distractors: ["85 metr", "30 metr", "40 metr"],
      explanation: "60 - x = 25, x = 60 - 25 = 35 metr."
    },
    {
      text: "Hovuzda bir nechta o'rdak suzayotgan edi. Yana 12 ta o'rdak uchib kelgach, 28 ta bo'ldi. Dastlab nechta o'rdak bor edi?",
      correctAnswer: "16 ta (x + 12 = 28)",
      distractors: ["40 ta", "14 ta", "18 ta"],
      explanation: "x + 12 = 28, x = 28 - 12 = 16 ta."
    },
    {
      text: "Qaysi bosqich masalani tenglama bilan yechishda eng birinchi qilinadi?",
      correctAnswer: "Noma'lum miqdorni x harfi bilan belgilash",
      distractors: [
        "Javobni darhol taxmin qilish",
        "Amallarni aralashtirish",
        "Kitobni yopib qo'yish"
      ],
      explanation: "Masalani tushunib, qidirilayotgan noma'lumni x deb belgilash — birinchi qadamdir."
    },
    {
      text: "Tenglama orqali masala yechishning asosiy afzalligi nimada?",
      correctAnswer: "Masalaning yechilish yo'li aniq va tushunarli bo'ladi",
      distractors: [
        "Masala o'z-o'zidan yo'qolib ketadi",
        "Faqat bitta raqam yoziladi",
        "Hech qanday afzalligi yo'q"
      ],
      explanation: "Tenglama mantiqiy bog'lanishlarni matematik tilda sodda va aniq ko'rsatib beradi."
    }
  ]
};

export const lesson141: LessonDef = {
  bookNumber: 141,
  title: "Masalalarni tenglamalar yordamida yechish (2)",
  emoji: "🎳",
  shortDesc: "Taqqoslashli va murakkabroq matnli masalalarni tenglama orqali yechish",
  intro: "Bu darsda biz ikki do'st, ikki savat yoki ikki guruh o'rtasidagi munosabatlarga doir qiziqarli masalalarni tenglamalar yordamida yechamiz. Tenglama tuzish masalani qisqa va qulay yechishga yordam beradi.",
  keyPoints: [
    "Jami son va bitta qism ma'lum bo'lsa, ikkinchi qismni topish: x + a = b.",
    "Farq va bitta qism ma'lum bo'lganda noma'lumni topish: x - a = b yoki a - x = b.",
    "Masalani diqqat bilan o'qib, 'kimda ko'p?', 'kimda kam?' ekanligini aniqlash.",
    "Topilgan javobni tekshirib ko'rish."
  ],
  miniExample: {
    emojis: "🎳 x + 12 = 30 -> x = 18",
    text: "Akmal va Anvarda jami 30 ta koptok bor. Anvarda 12 ta bo'lsa, Akmalda nechta koptok bor? x + 12 = 30 -> x = 18 ta!"
  },
  xpReward: 115,
  coinReward: 12,
  estMinutes: 9,
  practice: [
    {
      text: "Akmal va Anvarda jami 30 ta koptok bor. Anvarda 12 ta bo'lsa, Akmalda nechta?",
      correctAnswer: "18 ta (x + 12 = 30 -> x = 18)",
      distractors: ["42 ta", "16 ta", "20 ta"],
      explanation: "x + 12 = 30, x = 30 - 12 = 18 ta."
    },
    {
      text: "Ikkita javonda jami 50 ta kitob bor. Birinchi javonda 28 ta kitob bo'lsa, ikkinchisida nechta?",
      correctAnswer: "22 ta (28 + x = 50 -> x = 22)",
      distractors: ["20 ta", "24 ta", "78 ta"],
      explanation: "28 + x = 50, x = 50 - 28 = 22 ta."
    },
    {
      text: "Nodirada dugonasidan 7 ta kam qalam bor. Nodirada 14 ta qalam bo'lsa, dugonasida nechta?",
      correctAnswer: "21 ta (x - 7 = 14 -> x = 21)",
      distractors: ["7 ta", "20 ta", "22 ta"],
      explanation: "x - 7 = 14, x = 14 + 7 = 21 ta."
    }
  ],
  test: [
    {
      text: "Akmal va Anvarda jami 30 ta koptok bor. Anvarda 12 ta bo'lsa, Akmalda nechta koptok bor?",
      correctAnswer: "18 ta",
      distractors: ["42 ta", "16 ta", "19 ta"],
      explanation: "x + 12 = 30, x = 30 - 12 = 18 ta."
    },
    {
      text: "Ikkita javonda 50 ta kitob bor. Birinchi javonda 28 ta bo'lsa, ikkinchisida nechta?",
      correctAnswer: "22 ta",
      distractors: ["20 ta", "24 ta", "78 ta"],
      explanation: "x = 50 - 28 = 22 ta."
    },
    {
      text: "Ikkita savatda jami 45 kg uzum bor. Birinchi savatda 20 kg bo'lsa, ikkinchisida necha kg?",
      correctAnswer: "25 kg (20 + x = 45)",
      distractors: ["65 kg", "23 kg", "27 kg"],
      explanation: "x = 45 - 20 = 25 kg."
    },
    {
      text: "Shahnozada bir nechta stiker bor edi. Dugonasi unga 14 ta bergach, unda 32 ta bo'ldi. Avval nechta bo'lgan?",
      correctAnswer: "18 ta (x + 14 = 32)",
      distractors: ["46 ta", "16 ta", "20 ta"],
      explanation: "x = 32 - 14 = 18 ta."
    },
    {
      text: "Sinfda 28 nafar o'quvchi bor. Agar o'g'il bolalar 15 nafar bo'lsa, qizlar necha nafar?",
      correctAnswer: "13 nafar (15 + x = 28)",
      distractors: ["12 nafar", "14 nafar", "43 nafar"],
      explanation: "x = 28 - 15 = 13 nafar."
    },
    {
      text: "Daftar va qalam birgalikda 40 tanga turadi. Qalam 15 tanga bo'lsa, daftar necha tanga?",
      correctAnswer: "25 tanga (x + 15 = 40)",
      distractors: ["55 tanga", "20 tanga", "30 tanga"],
      explanation: "x = 40 - 15 = 25 tanga."
    },
    {
      text: "Jasur va Rustam baliq ovlashdi. Jasur Rustamdan 8 ta ortiq baliq tutdi. Jasur 20 ta tutgan bo'lsa, Rustam nechta?",
      correctAnswer: "12 ta (x + 8 = 20)",
      distractors: ["28 ta", "10 ta", "14 ta"],
      explanation: "x + 8 = 20, x = 20 - 8 = 12 ta."
    },
    {
      text: "Bir dalada ikkinchisiga qaraganda 15 tonna ko'p bug'doy o'rildi. Ikkinchi daladan 30 tonna o'rilgan bo'lsa, birinchisidan qancha?",
      correctAnswer: "45 tonna (x - 15 = 30)",
      distractors: ["15 tonna", "40 tonna", "50 tonna"],
      explanation: "x - 15 = 30, x = 30 + 15 = 45 tonna."
    },
    {
      text: "Maktab oshxonasiga 70 litr sut keltirildi. Tushlikda bir necha litr ishlatilgach, 25 litr qoldi. Qancha sut ishlatilgan?",
      correctAnswer: "45 litr (70 - x = 25)",
      distractors: ["95 litr", "40 litr", "50 litr"],
      explanation: "x = 70 - 25 = 45 litr."
    },
    {
      text: "Temir yo'l vagonida bir nechta yo'lovchi bor edi. Bekatda 20 kishi chiqdi va jami 60 kishi bo'ldi. Avval nechta edi?",
      correctAnswer: "40 kishi (x + 20 = 60)",
      distractors: ["80 kishi", "35 kishi", "45 kishi"],
      explanation: "x = 60 - 20 = 40 kishi."
    },
    {
      text: "Ikki qutida 80 ta bo'r bor. Birinchi qutida 42 ta bo'lsa, ikkinchi qutida nechta bo'r bor?",
      correctAnswer: "38 ta (42 + x = 80)",
      distractors: ["122 ta", "36 ta", "40 ta"],
      explanation: "x = 80 - 42 = 38 ta."
    },
    {
      text: "Fotimaning yoshi Zuhroning yoshiga teng. Ikkalasining yoshlari yig'indisi 16 bo'lsa, Fotima necha yoshda?",
      correctAnswer: "8 yoshda (x + x = 16)",
      distractors: ["7 yoshda", "9 yoshda", "10 yoshda"],
      explanation: "x + x = 16 -> 8 + 8 = 16, demak Fotima 8 yoshda."
    },
    {
      text: "Bog'da jami 60 ta mevali daraxt bor. Shulardan 35 tasi olma, qolganlari nok. Nok daraxtlari nechta?",
      correctAnswer: "25 ta (35 + x = 60)",
      distractors: ["95 ta", "20 ta", "30 ta"],
      explanation: "x = 60 - 35 = 25 ta."
    },
    {
      text: "Azizning puli 50 so'm edi. U kitob sotib olgach, 18 so'mi qoldi. Kitob necha so'm?",
      correctAnswer: "32 so'm (50 - x = 18)",
      distractors: ["68 so'm", "30 so'm", "35 so'm"],
      explanation: "x = 50 - 18 = 32 so'm."
    },
    {
      text: "Sport seksiyasida 36 nafar bola shug'ullanadi. Futbolga 20 nafar qatnashadi, qolganlari basketbolga. Basketbolga nechtasi qatnashadi?",
      correctAnswer: "16 nafar (20 + x = 36)",
      distractors: ["56 nafar", "14 nafar", "18 nafar"],
      explanation: "x = 36 - 20 = 16 nafar."
    },
    {
      text: "O'ymakor usta 28 ta kosani naqshladi. Yana bir nechtasini naqshlasa, jami 50 ta bo'ladi. U yana nechta kosani naqshlashi kerak?",
      correctAnswer: "22 ta (28 + x = 50)",
      distractors: ["78 ta", "20 ta", "24 ta"],
      explanation: "x = 50 - 28 = 22 ta."
    },
    {
      text: "Toychoq va qo'zichoqning birgalikdagi vazni 48 kg. Agar qo'zichoq 18 kg bo'lsa, toychoq necha kg?",
      correctAnswer: "30 kg (x + 18 = 48)",
      distractors: ["66 kg", "28 kg", "32 kg"],
      explanation: "x = 48 - 18 = 30 kg."
    },
    {
      text: "Avtosaroyda 90 ta mashina bor edi. Ertalab bir nechasi yo'lga chiqib ketgach, 35 ta qoldi. Nechta mashina yo'lga chiqqan?",
      correctAnswer: "55 ta (90 - x = 35)",
      distractors: ["125 ta", "50 ta", "60 ta"],
      explanation: "x = 90 - 35 = 55 ta."
    },
    {
      text: "Masalani tenglama yordamida yechgach nima qilish kerak?",
      correctAnswer: "Javobni masala shartiga qo'yib tekshirib ko'rish",
      distractors: [
        "Hech narsa qilmaslik",
        "Javobni o'chirib tashlash",
        "Boshqa shart o'ylab topish"
      ],
      explanation: "Topilgan qiymat masala ma'nosiga to'g'ri kelishini tekshirish muhim."
    },
    {
      text: "Tenglamalar tuzish orqali masala yechish bizga qanday ko'nikma beradi?",
      correctAnswer: "Mantiqiy fikrlash va masalalarni tartibli yechish",
      distractors: [
        "Faqat tez yozish",
        "Raqamlarni unutish",
        "Rasmlar chizish"
      ],
      explanation: "Tenglama tuzish tizimli mantiq va mustaqil fikrlash qobiliyatini yuksaltiradi."
    }
  ]
};

export const lesson142: LessonDef = {
  bookNumber: 142,
  isReview: true,
  title: "Takrorlash (1)",
  emoji: "🏪",
  shortDesc: "Geometriya va kattaliklar bo'yicha yakuniy takrorlash",
  intro: "1-sinf matematika kursining yakuniy takrorlash darslariga xush kelibsiz! Ushbu darsda biz geometrik shakllar, kesmalar, perimetr, uzunlik, massa va sig'im o'lchov birliklarini takrorlaymiz.",
  keyPoints: [
    "Kesma — ikki tomondan chegaralangan to'g'ri chiziq bo'lagi. 1 dm = 10 sm.",
    "Perimetr — ko'pburchak barcha tomonlari uzunliklarining yig'indisi.",
    "Kvadrat (4 ta tomoni teng, 4 ta to'g'ri burchak), to'g'ri to'rtburchak (qarama-qarshi tomonlari teng).",
    "Massa kilogrammda (kg), sig'im litrda (l) o'lchanadi."
  ],
  miniExample: {
    emojis: "📏 P = 4 x a | 1 dm = 10 sm",
    text: "Tomoni 5 sm bo'lgan kvadrat perimetri: 5 + 5 + 5 + 5 = 20 sm = 2 dm!"
  },
  xpReward: 120,
  coinReward: 12,
  estMinutes: 10,
  practice: [
    {
      text: "3 dm necha santimetrga teng?",
      correctAnswer: "30 sm",
      distractors: ["3 sm", "300 sm", "13 sm"],
      explanation: "1 dm = 10 sm bo'lgani uchun 3 dm = 30 sm."
    },
    {
      text: "Tomoni 6 sm bo'lgan kvadratning perimetrini toping:",
      correctAnswer: "24 sm",
      distractors: ["12 sm", "18 sm", "36 sm"],
      explanation: "6 + 6 + 6 + 6 = 24 sm."
    },
    {
      text: "Suyuqliklar miqdori qaysi birlikda o'lchanadi?",
      correctAnswer: "Litrda (l)",
      distractors: ["Kilogrammda", "Santimetrda", "Detsimetrda"],
      explanation: "Suv, sut va sharbat litrda o'lchanadi."
    }
  ],
  test: [
    {
      text: "1 detsimetr necha santimetrga teng?",
      correctAnswer: "10 sm",
      distractors: ["1 sm", "100 sm", "5 sm"],
      explanation: "1 dm = 10 sm."
    },
    {
      text: "4 dm 5 sm necha santimetr bo'ladi?",
      correctAnswer: "45 sm",
      distractors: ["40 sm", "54 sm", "9 sm"],
      explanation: "4 dm = 40 sm, 40 + 5 = 45 sm."
    },
    {
      text: "70 santimetr necha detsimetrga teng?",
      correctAnswer: "7 dm",
      distractors: ["70 dm", "700 dm", "17 dm"],
      explanation: "70 sm = 7 dm."
    },
    {
      text: "Kvadratning tomoni 4 sm. Perimetri qancha?",
      correctAnswer: "16 sm",
      distractors: ["12 sm", "20 sm", "8 sm"],
      explanation: "4 x 4 = 16 sm."
    },
    {
      text: "Bo'yi 5 sm, eni 3 sm bo'lgan to'g'ri to'rtburchak perimetrini hisoblang:",
      correctAnswer: "16 sm (5 + 3 + 5 + 3 = 16)",
      distractors: ["15 sm", "18 sm", "8 sm"],
      explanation: "5 + 3 + 5 + 3 = 16 sm."
    },
    {
      text: "Teng tomonli uchburchakning tomoni 5 sm. Uning perimetri qancha?",
      correctAnswer: "15 sm (5 + 5 + 5 = 15)",
      distractors: ["10 sm", "20 sm", "25 sm"],
      explanation: "5 + 5 + 5 = 15 sm."
    },
    {
      text: "Kvadratda nechta to'g'ri burchak bor?",
      correctAnswer: "4 ta",
      distractors: ["2 ta", "3 ta", "0 ta"],
      explanation: "Kvadratning barcha 4 ta burchagi to'g'ri burchakdir."
    },
    {
      text: "Kubning nechta yog'i bor?",
      correctAnswer: "6 ta",
      distractors: ["4 ta", "8 ta", "12 ta"],
      explanation: "Kub 6 ta teng kvadrat yoqqa ega."
    },
    {
      text: "Qaysi shakl dumalay oladi va uning uchi yo'q?",
      correctAnswer: "Shar",
      distractors: ["Kub", "Piramida", "Kvadrat"],
      explanation: "Shar silliq dumaloq shakl bo'lib, har tomonga dumalaydi."
    },
    {
      text: "Kvadratda nechta simmetriya o'qi bor?",
      correctAnswer: "4 ta",
      distractors: ["2 ta", "3 ta", "1 ta"],
      explanation: "Kvadratda 4 ta simmetriya o'qi mavjud."
    },
    {
      text: "To'g'ri to'rtburchakda nechta simmetriya o'qi bor?",
      correctAnswer: "2 ta",
      distractors: ["4 ta", "1 ta", "3 ta"],
      explanation: "To'g'ri to'rtburchak 2 ta simmetriya o'qiga ega."
    },
    {
      text: "Doirada nechta simmetriya o'qi mavjud?",
      correctAnswer: "Cheksiz ko'p",
      distractors: ["4 ta", "10 ta", "1 ta"],
      explanation: "Doira markazidan o'tuvchi har qanday to'g'ri chiziq simmetriya o'qidir."
    },
    {
      text: "Bir chelakda 10 l, ikkinchisida 8 l suv bor. Jami necha litr suv bor?",
      correctAnswer: "18 litr (10 + 8 = 18)",
      distractors: ["16 litr", "20 litr", "2 litr"],
      explanation: "10 + 8 = 18 litr."
    },
    {
      text: "Bir qop kartoshka 25 kg, ikkinchisi 20 kg. Jami necha kg kartoshka bor?",
      correctAnswer: "45 kg (25 + 20 = 45)",
      distractors: ["40 kg", "50 kg", "5 kg"],
      explanation: "25 + 20 = 45 kg."
    },
    {
      text: "3 ta bo'g'indan iborat siniq chiziq uzunliklari: 4 sm, 6 sm va 5 sm. Siniq chiziq uzunligi qancha?",
      correctAnswer: "15 sm (4 + 6 + 5 = 15)",
      distractors: ["14 sm", "16 sm", "20 sm"],
      explanation: "4 + 6 + 5 = 15 sm."
    },
    {
      text: "Kesmaning uzunligi 12 sm. Undan 4 sm kesib olinsa, necha sm qoladi?",
      correctAnswer: "8 sm (12 - 4 = 8)",
      distractors: ["6 sm", "7 sm", "16 sm"],
      explanation: "12 - 4 = 8 sm."
    },
    {
      text: "Qaysi ko'pburchakning 5 ta tomoni va 5 ta uchi bor?",
      correctAnswer: "Beshburchak",
      distractors: ["To'rtburchak", "Oltiburchak", "Uchburchak"],
      explanation: "5 ta tomonli ko'pburchak beshburchak deyiladi."
    },
    {
      text: "Silindrning asoslari qanday shaklda?",
      correctAnswer: "Doira",
      distractors: ["Kvadrat", "Uchburchak", "To'g'ri to'rtburchak"],
      explanation: "Silindrning pastki va yuqori asoslari doiralardan iborat."
    },
    {
      text: "20 sm necha detsimetr bo'ladi?",
      correctAnswer: "2 dm",
      distractors: ["20 dm", "1 dm", "3 dm"],
      explanation: "20 sm = 2 dm."
    },
    {
      text: "Geometrik shakllarni o'rganish bizga hayotda nima uchun kerak?",
      correctAnswer: "Tevarak-atrofimizdagi narsalarning o'lchami va shaklini to'g'ri anglash uchun",
      distractors: [
        "Faqat rasm chizish uchun",
        "Chalg'ish uchun",
        "Faqat kitob o'qish uchun"
      ],
      explanation: "Geometriya uylar qurish, buyumlar yasash va tabiatni tushunishda asosiy vositadir."
    }
  ]
};

export const lesson143: LessonDef = {
  bookNumber: 143,
  isReview: true,
  title: "Takrorlash (2)",
  emoji: "📚",
  shortDesc: "100 ichida qo'shish, ayirish va arifmetik amallar bo'yicha takrorlash",
  intro: "Ushbu takrorlash darsida biz 1-sinfda o'rgangan barcha hisoblash usullarini: 100 ichida o'nliklar va birliklarni qo'shish, ayirish, qavsli ifodalar hamda qulay hisoblash usullarini umumlashtiramiz.",
  keyPoints: [
    "O'nliklar bilan hisoblash: 40 + 30 = 70, 90 - 40 = 50.",
    "Xonadan o'tmasdan va o'tib hisoblash: 34 + 5 = 39, 27 + 5 = 32.",
    "Qavsli amallarda birinchi qavs ichi bajariladi: 50 - (20 + 10) = 20.",
    "Qulay usul: yig'indisi 10 yoki 20 bo'ladigan sonlar birinchi qo'shiladi."
  ],
  miniExample: {
    emojis: "📚 38 + 24 = 62 | 70 - 25 = 45",
    text: "38 + 24 = (38 + 20) + 4 = 58 + 4 = 62. 70 dan 25 ni ayirish: 70 - 20 = 50, 50 - 5 = 45!"
  },
  xpReward: 120,
  coinReward: 12,
  estMinutes: 10,
  practice: [
    {
      text: "45 + 25 yig'indisini hisoblang:",
      correctAnswer: "70",
      distractors: ["60", "65", "75"],
      explanation: "45 + 25 = 70."
    },
    {
      text: "80 - 34 ayirmasini toping:",
      correctAnswer: "46",
      distractors: ["44", "45", "56"],
      explanation: "80 - 30 = 50, 50 - 4 = 46."
    },
    {
      text: "17 + 8 + 3 ifodasini qulay usulda hisoblang:",
      correctAnswer: "28 ((17 + 3) + 8 = 20 + 8 = 28)",
      distractors: ["26", "27", "30"],
      explanation: "17 + 3 = 20, 20 + 8 = 28."
    }
  ],
  test: [
    {
      text: "30 + 40 yig'indisi nechaga teng?",
      correctAnswer: "70",
      distractors: ["60", "80", "50"],
      explanation: "3 o'nlik + 4 o'nlik = 7 o'nlik = 70."
    },
    {
      text: "90 - 50 ayirmasi qancha bo'ladi?",
      correctAnswer: "40",
      distractors: ["30", "50", "60"],
      explanation: "9 o'nlik - 5 o'nlik = 4 o'nlik = 40."
    },
    {
      text: "56 + 4 yig'indisini toping:",
      correctAnswer: "60",
      distractors: ["58", "62", "70"],
      explanation: "56 + 4 = 60."
    },
    {
      text: "70 - 8 ayirmasi nechaga teng?",
      correctAnswer: "62",
      distractors: ["60", "63", "52"],
      explanation: "70 - 8 = 62."
    },
    {
      text: "43 + 25 yig'indisini hisoblang:",
      correctAnswer: "68",
      distractors: ["67", "69", "78"],
      explanation: "40 + 20 = 60, 3 + 5 = 8; 60 + 8 = 68."
    },
    {
      text: "67 - 24 ayirmasi nechaga teng?",
      correctAnswer: "43",
      distractors: ["41", "45", "33"],
      explanation: "60 - 20 = 40, 7 - 4 = 3; 40 + 3 = 43."
    },
    {
      text: "28 + 15 yig'indisini hisoblang:",
      correctAnswer: "43",
      distractors: ["41", "42", "44"],
      explanation: "28 + 10 = 38, 38 + 5 = 43."
    },
    {
      text: "52 - 17 ayirmasini toping:",
      correctAnswer: "35",
      distractors: ["34", "36", "45"],
      explanation: "52 - 10 = 42, 42 - 7 = 35."
    },
    {
      text: "35 + 35 yig'indisi nechaga teng?",
      correctAnswer: "70",
      distractors: ["60", "65", "80"],
      explanation: "35 + 35 = 70."
    },
    {
      text: "100 - 45 ayirmasini hisoblang:",
      correctAnswer: "55",
      distractors: ["50", "65", "45"],
      explanation: "100 - 40 = 60, 60 - 5 = 55."
    },
    {
      text: "16 + 9 + 4 ifodasini qulay usulda hisoblang:",
      correctAnswer: "29 ((16 + 4) + 9 = 20 + 9 = 29)",
      distractors: ["27", "28", "30"],
      explanation: "16 + 4 = 20, 20 + 9 = 29."
    },
    {
      text: "25 + 18 + 5 ifodasining qiymatini toping:",
      correctAnswer: "48 ((25 + 5) + 18 = 30 + 18 = 48)",
      distractors: ["46", "49", "50"],
      explanation: "25 + 5 = 30, 30 + 18 = 48."
    },
    {
      text: "60 - (25 + 15) ifodasining qiymati qancha?",
      correctAnswer: "20",
      distractors: ["30", "10", "25"],
      explanation: "25 + 15 = 40. Keyin 60 - 40 = 20."
    },
    {
      text: "40 + (30 - 12) ifodasining natijasi nechaga teng?",
      correctAnswer: "58",
      distractors: ["48", "68", "56"],
      explanation: "30 - 12 = 18. Keyin 40 + 18 = 58."
    },
    {
      text: "48 sonida nechta o'nlik va nechta birlik bor?",
      correctAnswer: "4 ta o'nlik va 8 ta birlik",
      distractors: ["8 ta o'nlik va 4 ta birlik", "48 ta o'nlik", "4 ta birlik"],
      explanation: "48 = 4 o'nlik va 8 birlik."
    },
    {
      text: "7 o'nlik va 3 birlikdan iborat son qaysi?",
      correctAnswer: "73",
      distractors: ["37", "70", "703"],
      explanation: "7 o'nlik (70) + 3 birlik = 73."
    },
    {
      text: "Eng katta ikki xonali son qaysi?",
      correctAnswer: "99",
      distractors: ["100", "90", "98"],
      explanation: "Ikki xonali sonlarning eng kattasi 99 dir."
    },
    {
      text: "Eng kichik ikki xonali son qaysi?",
      correctAnswer: "10",
      distractors: ["0", "1", "11"],
      explanation: "Eng kichik ikki xonali son 10 dir."
    },
    {
      text: "48 + 32 yig'indisi nechaga teng?",
      correctAnswer: "80",
      distractors: ["70", "78", "82"],
      explanation: "48 + 32 = 80."
    },
    {
      text: "Qo'shish va ayirish amallarini to'g'ri bilish bizga nima beradi?",
      correctAnswer: "Kundalik hayotda mustaqil va aniq hisob-kitob qilishni",
      distractors: [
        "Faqat o'yin o'ynashni",
        "Kitobni yirtishni",
        "Amallarni chalkashtirishni"
      ],
      explanation: "Tez va aniq hisoblash — maktabda va hayotda eng kerakli ko'nikmadir."
    }
  ]
};

export const lesson144: LessonDef = {
  bookNumber: 144,
  isReview: true,
  title: "Takrorlash (3)",
  emoji: "🎓",
  shortDesc: "1-sinf yakuniy nazorati: tenglamalar, tengsizliklar va Rim raqamlari",
  intro: "Tabriklaymiz! Siz 1-sinf matematika darslarining eng oxirgi yakuniy bosqichiga yetib keldingiz! Ushbu darsda tenglamalar (x + 5 = 20, 45 - x = 22), oraliq tengsizliklar (18 < x < 22) va Rim raqamlari (V + V = X, XX + XL = LX) bo'yicha yakuniy bilimingizni sinovdan o'tkazasiz.",
  keyPoints: [
    "Tenglamalar: x + 5 = 20 (x = 15), 45 - x = 22 (x = 23), x - 7 = 10 (x = 17).",
    "Oraliq tengsizlik: 18 < x < 22 bo'lsa, x soni 19, 20 yoki 21 bo'lishi mumkin.",
    "Rim raqamlari: I = 1, V = 5, X = 10, L = 50, C = 100.",
    "Rim raqamlarida amallar: V + V = X (10), XX + XL = LX (60)."
  ],
  miniExample: {
    emojis: "🎓 x + 5 = 20 | 18 < x < 22 | V + V = X",
    text: "x = 15. 18 va 22 orasidagi sonlar: 19, 20, 21. V + V = X (5 + 5 = 10). Siz 1-sinfni a'lo baholarga bitirdingiz!"
  },
  xpReward: 120,
  coinReward: 15,
  estMinutes: 10,
  practice: [
    {
      text: "x + 5 = 20 tenglamada x nechaga teng?",
      correctAnswer: "x = 15",
      distractors: ["x = 25", "x = 14", "x = 16"],
      explanation: "x = 20 - 5 = 15."
    },
    {
      text: "18 < x < 22 tengsizlikni qanoatlantiruvchi sonlarni toping:",
      correctAnswer: "19, 20, 21",
      distractors: ["18, 19, 20", "20, 21, 22", "17, 18, 19"],
      explanation: "18 dan katta va 22 dan kichik sonlar: 19, 20, 21."
    },
    {
      text: "V + V amali Rim raqamlarida nimaga teng?",
      correctAnswer: "X (5 + 5 = 10)",
      distractors: ["VV", "XV", "L"],
      explanation: "V = 5, 5 + 5 = 10 (X)."
    }
  ],
  test: [
    {
      text: "x + 5 = 20 tenglamaning ildizi nechaga teng?",
      correctAnswer: "x = 15",
      distractors: ["x = 25", "x = 14", "x = 16"],
      explanation: "x = 20 - 5 = 15."
    },
    {
      text: "45 - x = 22 tenglamani yeching:",
      correctAnswer: "x = 23",
      distractors: ["x = 67", "x = 21", "x = 24"],
      explanation: "x = 45 - 22 = 23."
    },
    {
      text: "x - 7 = 10 tenglamada x nechaga teng?",
      correctAnswer: "x = 17",
      distractors: ["x = 3", "x = 16", "x = 18"],
      explanation: "x = 10 + 7 = 17."
    },
    {
      text: "18 < x < 22 tengsizlikni qanoatlantiruvchi barcha butun sonlar qaysilar?",
      correctAnswer: "19, 20, 21",
      distractors: ["18, 19, 20", "20, 21, 22", "17, 18, 19"],
      explanation: "18 dan katta va 22 dan kichik sonlar: 19, 20 va 21."
    },
    {
      text: "V + V amali natijasi Rim raqamida qanday yoziladi?",
      correctAnswer: "X (5 + 5 = 10)",
      distractors: ["XV", "L", "VV"],
      explanation: "5 + 5 = 10, ya'ni X."
    },
    {
      text: "XX + XL amali natijasini toping (20 + 40):",
      correctAnswer: "LX (60)",
      distractors: ["L (50)", "LXX (70)", "XXXX (40)"],
      explanation: "XX (20) + XL (40) = LX (60)."
    },
    {
      text: "Rim raqami L qaysi sonni ifodalaydi?",
      correctAnswer: "50",
      distractors: ["10", "100", "5"],
      explanation: "L = 50."
    },
    {
      text: "Rim raqami C qaysi songa teng?",
      correctAnswer: "100",
      distractors: ["50", "10", "1000"],
      explanation: "C = 100."
    },
    {
      text: "x + 12 = 30 tenglamada x nechaga teng?",
      correctAnswer: "x = 18",
      distractors: ["x = 42", "x = 16", "x = 20"],
      explanation: "x = 30 - 12 = 18."
    },
    {
      text: "50 - x = 25 tenglamaning ildizi nechaga teng?",
      correctAnswer: "x = 25",
      distractors: ["x = 75", "x = 20", "x = 30"],
      explanation: "x = 50 - 25 = 25."
    },
    {
      text: "x - 15 = 25 tenglamani yeching:",
      correctAnswer: "x = 40",
      distractors: ["x = 10", "x = 35", "x = 45"],
      explanation: "x = 25 + 15 = 40."
    },
    {
      text: "28 < a < 31 tengsizlikning yechimlari qaysilar?",
      correctAnswer: "29 va 30",
      distractors: ["28 va 29", "30 va 31", "Faqat 29"],
      explanation: "28 dan katta va 31 dan kichik sonlar: 29 va 30."
    },
    {
      text: "Rim raqamida 15 qanday yoziladi?",
      correctAnswer: "XV (10 + 5)",
      distractors: ["VXX", "VVV", "IXV"],
      explanation: "10 + 5 = 15, ya'ni XV."
    },
    {
      text: "L - X amali natijasi nechaga teng (50 - 10)?",
      correctAnswer: "XL (40)",
      distractors: ["LX (60)", "XXX (30)", "L (50)"],
      explanation: "50 - 10 = 40, bu esa XL deb yoziladi."
    },
    {
      text: "Akmalda x ta daftar bor edi. Unga 8 ta daftar berilgach 24 ta bo'ldi. Akmalda nechta daftar bo'lgan?",
      correctAnswer: "16 ta (x + 8 = 24 -> x = 16)",
      distractors: ["32 ta", "15 ta", "18 ta"],
      explanation: "x + 8 = 24, x = 24 - 8 = 16 ta."
    },
    {
      text: "Savatda 40 ta olma bor edi. Bir nechtasi olingach 25 ta qoldi. Nechta olma olingan?",
      correctAnswer: "15 ta (40 - x = 25 -> x = 15)",
      distractors: ["65 ta", "12 ta", "18 ta"],
      explanation: "40 - x = 25, x = 40 - 25 = 15 ta."
    },
    {
      text: "Kvadratning tomoni 5 sm bo'lsa, uning perimetri qancha bo'ladi?",
      correctAnswer: "20 sm (2 dm)",
      distractors: ["15 sm", "25 sm", "10 sm"],
      explanation: "5 x 4 = 20 sm = 2 dm."
    },
    {
      text: "1 dm 8 sm necha santimetrga teng?",
      correctAnswer: "18 sm",
      distractors: ["10 sm", "28 sm", "9 sm"],
      explanation: "1 dm = 10 sm, 10 + 8 = 18 sm."
    },
    {
      text: "Rim raqamlarida nol (0) bormi?",
      correctAnswer: "Yo'q, Rim raqamlarida nol yo'q",
      distractors: ["Ha, 0 deb yoziladi", "Ha, N deb yoziladi", "Ha, Z deb yoziladi"],
      explanation: "Rim raqamlari tizimida nol belgisi bo'lmagan."
    },
    {
      text: "1-sinf matematika fanini o'rganish sizga nima berdi?",
      correctAnswer: "Matematik tafakkur, hisoblash tezligi va hayotiy amaliy ko'nikmalar",
      distractors: [
        "Faqat charchoq",
        "Raqamlardan qo'rqish",
        "Hech narsa bermadi"
      ],
      explanation: "1-sinf kursi qunt bilan o'rganilganda butun umrga mustahkam bilim poydevori yaratiladi!"
    }
  ]
};

// Save all Chapter 4 and 5 lessons
const lessons = [
  lesson137,
  lesson138,
  lesson139,
  lesson140,
  lesson141,
  lesson142,
  lesson143,
  lesson144
];

for (const lessonDef of lessons) {
  const seed = buildLessonSeed(lessonDef);
  saveLessonFile(4, lessonDef.bookNumber, seed, false);
  console.log(`✅ Saved lesson-${lessonDef.bookNumber}.json`);
}
