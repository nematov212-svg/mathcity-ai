import { Grade2UnitDef, buildGrade2UnitSeed, saveGrade2UnitFile } from './generatorTypes';

console.log("Generating Grade 2 Part 1 Chapter III (order 20-27)...");

// ─────────────────────────────────────────────────────────────
// 20. Sonlarni qo'shish (25 + 6) 🏗️
// ─────────────────────────────────────────────────────────────
export const unit20: Grade2UnitDef = {
  order: 20,
  bookNumber: 20,
  unitType: "LESSON",
  title: "Sonlarni qo‘shish (25 + 6)",
  emoji: "🏗️",
  crossTopic: "Qurilish",
  shortDesc: "Xonadan o'tib qo'shish: birlikni 10 gacha to'ldirish",
  intro: "Qurilish maydonida kranlar baland binolarni ko'tarmoqda. Xonadan o'tib sonlarni qo'shishda ham avval o'nlikni to'ldiramiz, so'ng qolganini qo'shamiz: 25 + 6 = 31!",
  keyPoints: [
    "6 sonini 5 va 1 ga ajratamiz: 25 + 5 = 30.",
    "Hosil bo'lgan yaxlit o'nlikka 1 ni qo'shamiz: 30 + 1 = 31.",
    "Birliklar yig'indisi 10 dan oshganda yangi o'nlik paydo bo'ladi."
  ],
  miniExample: {
    emojis: "🏗️ 25 + 6 = (25 + 5) + 1 = 31",
    text: "25 ga 6 ni qo'shish: 25 + 5 = 30, 30 + 1 = 31."
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Hisoblang: 25 + 6",
      correctAnswer: "31",
      distractors: ["30", "32", "29"],
      explanation: "25 + 5 = 30, 30 + 1 = 31."
    },
    {
      text: "Hisoblang: 37 + 5",
      correctAnswer: "42",
      distractors: ["41", "43", "32"],
      explanation: "37 + 3 = 40, 40 + 2 = 42."
    },
    {
      text: "Qurilishga 28 ta g'isht yuk mashinasi va 7 ta kran keltirildi. Jami texnikalar nechta?",
      correctAnswer: "35",
      distractors: ["34", "36", "38"],
      explanation: "28 + 7 = 28 + 2 + 5 = 30 + 5 = 35."
    }
  ],
  test: [
    {
      text: "Hisoblang: 25 + 6",
      correctAnswer: "31",
      distractors: ["30", "32", "29"],
      explanation: "25 + 5 = 30, 30 + 1 = 31."
    },
    {
      text: "Hisoblang: 38 + 5",
      correctAnswer: "43",
      distractors: ["42", "44", "41"],
      explanation: "38 + 2 = 40, 40 + 3 = 43."
    },
    {
      text: "Hisoblang: 47 + 6",
      correctAnswer: "53",
      distractors: ["52", "54", "43"],
      explanation: "47 + 3 = 50, 50 + 3 = 53."
    },
    {
      text: "Hisoblang: 56 + 7",
      correctAnswer: "63",
      distractors: ["62", "64", "61"],
      explanation: "56 + 4 = 60, 60 + 3 = 63."
    },
    {
      text: "Quruvchilar bir kunda 29 qavat, ikkinchi kuni 4 qavat derazasini o'rnatdilar. Jami necha qavat?",
      correctAnswer: "33",
      distractors: ["32", "34", "35"],
      explanation: "29 + 4 = 33 qavat."
    },
    {
      text: "Hisoblang: 68 + 4",
      correctAnswer: "72",
      distractors: ["71", "73", "70"],
      explanation: "68 + 2 = 70, 70 + 2 = 72."
    },
    {
      text: "Hisoblang: 75 + 8",
      correctAnswer: "83",
      distractors: ["82", "84", "81"],
      explanation: "75 + 5 = 80, 80 + 3 = 83."
    },
    {
      text: "Hisoblang: 89 + 3",
      correctAnswer: "92",
      distractors: ["91", "93", "90"],
      explanation: "89 + 1 = 90, 90 + 2 = 92."
    },
    {
      text: "Hisoblang: 17 + 8",
      correctAnswer: "25",
      distractors: ["24", "26", "23"],
      explanation: "17 + 3 = 20, 20 + 5 = 25."
    },
    {
      text: "Tenglamani yeching: x - 6 = 25",
      correctAnswer: "31",
      distractors: ["30", "32", "29"],
      explanation: "x = 25 + 6 = 31."
    },
    {
      text: "Tenglamani yeching: y - 5 = 38",
      correctAnswer: "43",
      distractors: ["42", "44", "33"],
      explanation: "y = 38 + 5 = 43."
    },
    {
      text: "Taqqoslang: 25 + 6 va 24 + 7",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "25 + 6 = 31 va 24 + 7 = 31. Ular teng: 31 = 31."
    },
    {
      text: "Taqqoslang: 36 + 7 va 45",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "36 + 7 = 43. 43 < 45."
    },
    {
      text: "Hisoblang: 44 + 9",
      correctAnswer: "53",
      distractors: ["52", "54", "51"],
      explanation: "44 + 6 = 50, 50 + 3 = 53."
    },
    {
      text: "Qurilishga 35 tonna sement va 8 tonna qum keltirildi. Jami necha tonna material kelgan?",
      correctAnswer: "43",
      distractors: ["42", "44", "45"],
      explanation: "35 + 8 = 43 tonna."
    },
    {
      text: "Hisoblang: 58 + 7",
      correctAnswer: "65",
      distractors: ["64", "66", "63"],
      explanation: "58 + 2 = 60, 60 + 5 = 65."
    },
    {
      text: "Hisoblang: 65 + 7",
      correctAnswer: "72",
      distractors: ["71", "73", "70"],
      explanation: "65 + 5 = 70, 70 + 2 = 72."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: 25 + * = 32?",
      correctAnswer: "7",
      distractors: ["6", "8", "5"],
      explanation: "32 - 25 = 7."
    },
    {
      text: "Hisoblang: 87 + 5",
      correctAnswer: "92",
      distractors: ["91", "93", "90"],
      explanation: "87 + 3 = 90, 90 + 2 = 92."
    },
    {
      text: "Hisoblang: 26 + 8",
      correctAnswer: "34",
      distractors: ["33", "35", "32"],
      explanation: "26 + 4 = 30, 30 + 4 = 34."
    }
  ]
};

// ─────────────────────────────────────────────────────────────
// 21. Sonlarni qo'shish (25 + 6) 🚇
// ─────────────────────────────────────────────────────────────
export const unit21: Grade2UnitDef = {
  order: 21,
  bookNumber: 21,
  unitType: "LESSON",
  title: "Sonlarni qo‘shish (25 + 6)",
  emoji: "🚇",
  crossTopic: "Transport",
  shortDesc: "Xonadan o'tib qo'shishni mustahkamlash va transport masalalari",
  intro: "Metropoliten poyezdlari har kuni minglab yo'lovchilarni tashiydi. Transport yo'nalishlarida vaqt va masofani hisoblashda xonadan o'tib qo'shishni qo'llaymiz.",
  keyPoints: [
    "Qo'shiluvchini o'nlikka to'ldiruvchi qismga ajratish: 26 + 7 = 26 + 4 + 3 = 33.",
    "O'nliklar ortadi, birliklar yangi xonani to'ldiradi.",
    "Transport bekatlari va yo'lovchilar soni bo'yicha amaliy masalalar."
  ],
  miniExample: {
    emojis: "🚇 27 + 6 = 33",
    text: "27 + 3 = 30, 30 + 3 = 33 yo'lovchi!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Hisoblang: 27 + 6",
      correctAnswer: "33",
      distractors: ["32", "34", "31"],
      explanation: "27 + 3 = 30, 30 + 3 = 33."
    },
    {
      text: "Metro vagonida 35 kishi bor edi. Bekatda yana 8 kishi chiqdi. Jami nechta bo'ldi?",
      correctAnswer: "43",
      distractors: ["42", "44", "41"],
      explanation: "35 + 8 = 43 kishi."
    },
    {
      text: "Hisoblang: 46 + 7",
      correctAnswer: "53",
      distractors: ["52", "54", "51"],
      explanation: "46 + 4 = 50, 50 + 3 = 53."
    }
  ],
  test: [
    {
      text: "Hisoblang: 27 + 6",
      correctAnswer: "33",
      distractors: ["32", "34", "31"],
      explanation: "27 + 3 = 30, 30 + 3 = 33."
    },
    {
      text: "Avtobusda 26 yo'lovchi bor edi. Bekatda yana 8 yo'lovchi chiqdi. Jami yo'lovchilar soni nechta?",
      correctAnswer: "34",
      distractors: ["33", "35", "32"],
      explanation: "26 + 8 = 34."
    },
    {
      text: "Hisoblang: 38 + 6",
      correctAnswer: "44",
      distractors: ["43", "45", "42"],
      explanation: "38 + 2 = 40, 40 + 4 = 44."
    },
    {
      text: "Hisoblang: 49 + 5",
      correctAnswer: "54",
      distractors: ["53", "55", "52"],
      explanation: "49 + 1 = 50, 50 + 4 = 54."
    },
    {
      text: "Poyezdda 55 yo'lovchi ketayotgan edi, keyingi bekatda yana 9 kishi chiqdi. Jami yo'lovchilar nechta?",
      correctAnswer: "64",
      distractors: ["63", "65", "62"],
      explanation: "55 + 9 = 64."
    },
    {
      text: "Hisoblang: 67 + 5",
      correctAnswer: "72",
      distractors: ["71", "73", "70"],
      explanation: "67 + 3 = 70, 70 + 2 = 72."
    },
    {
      text: "Hisoblang: 78 + 6",
      correctAnswer: "84",
      distractors: ["83", "85", "82"],
      explanation: "78 + 2 = 80, 80 + 4 = 84."
    },
    {
      text: "Hisoblang: 86 + 7",
      correctAnswer: "93",
      distractors: ["92", "94", "91"],
      explanation: "86 + 4 = 90, 90 + 3 = 93."
    },
    {
      text: "Tenglamani yeching: m - 8 = 28",
      correctAnswer: "36",
      distractors: ["35", "37", "34"],
      explanation: "m = 28 + 8 = 36."
    },
    {
      text: "Tenglamani yeching: k - 7 = 45",
      correctAnswer: "52",
      distractors: ["51", "53", "50"],
      explanation: "k = 45 + 7 = 52."
    },
    {
      text: "Taqqoslang: 28 + 6 va 35",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "28 + 6 = 34. 34 < 35."
    },
    {
      text: "Taqqoslang: 37 + 8 va 40 + 5",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "37 + 8 = 45 va 40 + 5 = 45. Ular teng: 45 = 45."
    },
    {
      text: "Tramvayda 19 kishi bor edi. Yana 7 kishi chiqdi. Nechta yo'lovchi bo'ldi?",
      correctAnswer: "26",
      distractors: ["25", "27", "24"],
      explanation: "19 + 7 = 26."
    },
    {
      text: "Hisoblang: 34 + 8",
      correctAnswer: "42",
      distractors: ["41", "43", "40"],
      explanation: "34 + 6 = 40, 40 + 2 = 42."
    },
    {
      text: "Hisoblang: 58 + 5",
      correctAnswer: "63",
      distractors: ["62", "64", "61"],
      explanation: "58 + 2 = 60, 60 + 3 = 63."
    },
    {
      text: "Hisoblang: 66 + 9",
      correctAnswer: "75",
      distractors: ["74", "76", "73"],
      explanation: "66 + 4 = 70, 70 + 5 = 75."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: 47 + * = 55?",
      correctAnswer: "8",
      distractors: ["7", "9", "6"],
      explanation: "55 - 47 = 8."
    },
    {
      text: "Hisoblang: 79 + 4",
      correctAnswer: "83",
      distractors: ["82", "84", "81"],
      explanation: "79 + 1 = 80, 80 + 3 = 83."
    },
    {
      text: "Hisoblang: 23 + 9",
      correctAnswer: "32",
      distractors: ["31", "33", "30"],
      explanation: "23 + 7 = 30, 30 + 2 = 32."
    },
    {
      text: "Hisoblang: 88 + 4",
      correctAnswer: "92",
      distractors: ["91", "93", "90"],
      explanation: "88 + 2 = 90, 90 + 2 = 92."
    }
  ]
};

// ─────────────────────────────────────────────────────────────
// 22. Sonlarni qo'shish (6 + 25) 🍳
// ─────────────────────────────────────────────────────────────
export const unit22: Grade2UnitDef = {
  order: 22,
  bookNumber: 22,
  unitType: "LESSON",
  title: "Sonlarni qo‘shish (6 + 25)",
  emoji: "🍳",
  crossTopic: "Oshxona",
  shortDesc: "Qo'shishning o'rin almashtirish qonuni: 6 + 25 = 25 + 6",
  intro: "Oshxonada shirin taomlar tayyorlashda masalliqlar tartibi o'zgarsa ham ta'mi o'zgarmaydi. Matematikada ham qo'shiluvchilarning o'rni almashsa, yig'indi o'zgarmaydi: 6 + 25 = 25 + 6 = 31!",
  keyPoints: [
    "Qo'shishning o'rin almashtirish qonuni: a + b = b + a.",
    "Kichik songa katta sonni qo'shgandan ko'ra, katta songa kichik sonni qo'shish ancha osonroq.",
    "6 + 25 amalini bajarishda avval 25 ga 6 ni qo'shib hisoblaymiz: 25 + 6 = 31."
  ],
  miniExample: {
    emojis: "🍳 6 + 25 = 25 + 6 = 31",
    text: "Katta songa kichik sonni qo'shish osonroq: 25 + 6 = 31!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Hisoblang: 6 + 25",
      correctAnswer: "31",
      distractors: ["30", "32", "29"],
      explanation: "6 + 25 = 25 + 6 = 31."
    },
    {
      text: "Hisoblang: 7 + 38",
      correctAnswer: "45",
      distractors: ["44", "46", "43"],
      explanation: "7 + 38 = 38 + 7 = 45."
    },
    {
      text: "Oshxonada 5 ta qoshiq va 27 ta vilka yuvildi. Jami nechta idish yuvildi?",
      correctAnswer: "32",
      distractors: ["31", "33", "30"],
      explanation: "5 + 27 = 27 + 5 = 32 ta."
    }
  ],
  test: [
    {
      text: "Hisoblang: 6 + 25",
      correctAnswer: "31",
      distractors: ["30", "32", "29"],
      explanation: "6 + 25 = 25 + 6 = 31."
    },
    {
      text: "Hisoblang: 7 + 35",
      correctAnswer: "42",
      distractors: ["41", "43", "40"],
      explanation: "7 + 35 = 35 + 7 = 42."
    },
    {
      text: "Hisoblang: 8 + 44",
      correctAnswer: "52",
      distractors: ["51", "53", "50"],
      explanation: "8 + 44 = 44 + 8 = 52."
    },
    {
      text: "Hisoblang: 5 + 57",
      correctAnswer: "62",
      distractors: ["61", "63", "60"],
      explanation: "5 + 57 = 57 + 5 = 62."
    },
    {
      text: "Oshxonada idishga 9 dona olma va 24 dona gilos solindi. Jami mevalar nechta?",
      correctAnswer: "33",
      distractors: ["32", "34", "31"],
      explanation: "9 + 24 = 24 + 9 = 33."
    },
    {
      text: "Hisoblang: 4 + 68",
      correctAnswer: "72",
      distractors: ["71", "73", "70"],
      explanation: "4 + 68 = 68 + 4 = 72."
    },
    {
      text: "Hisoblang: 8 + 76",
      correctAnswer: "84",
      distractors: ["83", "85", "82"],
      explanation: "8 + 76 = 76 + 8 = 84."
    },
    {
      text: "Hisoblang: 3 + 89",
      correctAnswer: "92",
      distractors: ["91", "93", "90"],
      explanation: "3 + 89 = 89 + 3 = 92."
    },
    {
      text: "Tenglamani yeching: 7 + x = 34",
      correctAnswer: "27",
      distractors: ["26", "28", "25"],
      explanation: "x = 34 - 7 = 27."
    },
    {
      text: "Tenglamani yeching: 6 + y = 52",
      correctAnswer: "46",
      distractors: ["45", "47", "44"],
      explanation: "y = 52 - 6 = 46."
    },
    {
      text: "Taqqoslang: 6 + 25 va 25 + 6",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "Qo'shishning o'rin almashtirish qonuniga ko'ra ular teng: 31 = 31."
    },
    {
      text: "Taqqoslang: 8 + 36 va 45",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "8 + 36 = 44. 44 < 45."
    },
    {
      text: "Oshxonada 6 ta kosa va 28 ta likopcha bor. Jami idishlar nechta?",
      correctAnswer: "34",
      distractors: ["33", "35", "32"],
      explanation: "6 + 28 = 28 + 6 = 34 ta."
    },
    {
      text: "Hisoblang: 9 + 45",
      correctAnswer: "54",
      distractors: ["53", "55", "52"],
      explanation: "9 + 45 = 45 + 9 = 54."
    },
    {
      text: "Hisoblang: 7 + 55",
      correctAnswer: "62",
      distractors: ["61", "63", "60"],
      explanation: "7 + 55 = 55 + 7 = 62."
    },
    {
      text: "Hisoblang: 8 + 67",
      correctAnswer: "75",
      distractors: ["74", "76", "73"],
      explanation: "8 + 67 = 67 + 8 = 75."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: * + 26 = 33?",
      correctAnswer: "7",
      distractors: ["6", "8", "5"],
      explanation: "33 - 26 = 7."
    },
    {
      text: "Hisoblang: 5 + 78",
      correctAnswer: "83",
      distractors: ["82", "84", "81"],
      explanation: "5 + 78 = 78 + 5 = 83."
    },
    {
      text: "Hisoblang: 9 + 17",
      correctAnswer: "26",
      distractors: ["25", "27", "24"],
      explanation: "9 + 17 = 17 + 9 = 26."
    },
    {
      text: "Hisoblang: 4 + 88",
      correctAnswer: "92",
      distractors: ["91", "93", "90"],
      explanation: "4 + 88 = 88 + 4 = 92."
    }
  ]
};

// ─────────────────────────────────────────────────────────────
// 23. Sonlarni ayirish (33 - 7) 🏫
// ─────────────────────────────────────────────────────────────
export const unit23: Grade2UnitDef = {
  order: 23,
  bookNumber: 23,
  unitType: "LESSON",
  title: "Sonlarni ayirish (33 - 7)",
  emoji: "🏫",
  crossTopic: "Maktab",
  shortDesc: "Xonadan o'tib ayirish: bo'lib-bo'lib ayirish usuli",
  intro: "Maktabda har kuni yangi fanlarni o'rganamiz. Xonadan o'tib ayirishda ayiriluvchi sonni qulay qismlarga ajratamiz: 33 - 7 = (33 - 3) - 4 = 30 - 4 = 26!",
  keyPoints: [
    "7 sonini 3 va 4 ga ajratamiz, chunki 33 dan 3 ni ayirsak yaxlit 30 qoladi.",
    "Hosil bo'lgan 30 dan qolgan 4 ni ayiramiz: 30 - 4 = 26.",
    "Demak: 33 - 7 = 26."
  ],
  miniExample: {
    emojis: "🏫 33 - 7 = (33 - 3) - 4 = 26",
    text: "33 dan 7 ni ayirish: 33 - 3 = 30, so'ng 30 - 4 = 26!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Hisoblang: 33 - 7",
      correctAnswer: "26",
      distractors: ["25", "27", "24"],
      explanation: "33 - 3 = 30, 30 - 4 = 26."
    },
    {
      text: "Hisoblang: 32 - 5",
      correctAnswer: "27",
      distractors: ["26", "28", "25"],
      explanation: "32 - 2 = 30, 30 - 3 = 27."
    },
    {
      text: "Sinfda 34 ta daftar bor edi. 8 tasi tarqatildi. Nechta daftar qoldi?",
      correctAnswer: "26",
      distractors: ["25", "27", "24"],
      explanation: "34 - 8 = 34 - 4 - 4 = 26 ta daftar."
    }
  ],
  test: [
    {
      text: "Hisoblang: 33 - 7",
      correctAnswer: "26",
      distractors: ["25", "27", "24"],
      explanation: "33 - 3 = 30, 30 - 4 = 26."
    },
    {
      text: "Hisoblang: 35 - 8",
      correctAnswer: "27",
      distractors: ["26", "28", "25"],
      explanation: "35 - 5 = 30, 30 - 3 = 27."
    },
    {
      text: "Hisoblang: 32 - 6",
      correctAnswer: "26",
      distractors: ["25", "27", "24"],
      explanation: "32 - 2 = 30, 30 - 4 = 26."
    },
    {
      text: "Hisoblang: 34 - 9",
      correctAnswer: "25",
      distractors: ["24", "26", "23"],
      explanation: "34 - 4 = 30, 30 - 5 = 25."
    },
    {
      text: "Kutubxonada 31 ta kitobdan 5 tasi o'qishga berildi. Nechta kitob qoldi?",
      correctAnswer: "26",
      distractors: ["25", "27", "24"],
      explanation: "31 - 5 = 26 ta kitob."
    },
    {
      text: "Hisoblang: 36 - 8",
      correctAnswer: "28",
      distractors: ["27", "29", "26"],
      explanation: "36 - 6 = 30, 30 - 2 = 28."
    },
    {
      text: "Hisoblang: 33 - 5",
      correctAnswer: "28",
      distractors: ["27", "29", "26"],
      explanation: "33 - 3 = 30, 30 - 2 = 28."
    },
    {
      text: "Hisoblang: 31 - 7",
      correctAnswer: "24",
      distractors: ["23", "25", "22"],
      explanation: "31 - 1 = 30, 30 - 6 = 24."
    },
    {
      text: "Tenglamani yeching: 33 - x = 25",
      correctAnswer: "8",
      distractors: ["7", "9", "6"],
      explanation: "x = 33 - 25 = 8."
    },
    {
      text: "Tenglamani yeching: y + 7 = 33",
      correctAnswer: "26",
      distractors: ["25", "27", "24"],
      explanation: "y = 33 - 7 = 26."
    },
    {
      text: "Taqqoslang: 33 - 7 va 20 + 6",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "33 - 7 = 26 va 20 + 6 = 26. Ular teng: 26 = 26."
    },
    {
      text: "Taqqoslang: 32 - 8 va 25",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "32 - 8 = 24. 24 < 25."
    },
    {
      text: "Sinf xonasida 35 ta parta bor. 9 ta parta bo'yaldi. Bo'yalmagan partalar nechta?",
      correctAnswer: "26",
      distractors: ["25", "27", "24"],
      explanation: "35 - 9 = 26 ta."
    },
    {
      text: "Hisoblang: 34 - 7",
      correctAnswer: "27",
      distractors: ["26", "28", "25"],
      explanation: "34 - 4 = 30, 30 - 3 = 27."
    },
    {
      text: "Hisoblang: 36 - 9",
      correctAnswer: "27",
      distractors: ["26", "28", "25"],
      explanation: "36 - 6 = 30, 30 - 3 = 27."
    },
    {
      text: "Hisoblang: 32 - 7",
      correctAnswer: "25",
      distractors: ["24", "26", "23"],
      explanation: "32 - 2 = 30, 30 - 5 = 25."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: 33 - * = 27?",
      correctAnswer: "6",
      distractors: ["5", "7", "8"],
      explanation: "33 - 27 = 6."
    },
    {
      text: "Hisoblang: 35 - 6",
      correctAnswer: "29",
      distractors: ["28", "30", "27"],
      explanation: "35 - 5 = 30, 30 - 1 = 29."
    },
    {
      text: "Hisoblang: 31 - 4",
      correctAnswer: "27",
      distractors: ["26", "28", "25"],
      explanation: "31 - 1 = 30, 30 - 3 = 27."
    },
    {
      text: "Hisoblang: 33 - 9",
      correctAnswer: "24",
      distractors: ["23", "25", "22"],
      explanation: "33 - 3 = 30, 30 - 6 = 24."
    }
  ]
};

// ─────────────────────────────────────────────────────────────
// 24. Sonlarni ayirish (43 - 7) 🧸
// ─────────────────────────────────────────────────────────────
export const unit24: Grade2UnitDef = {
  order: 24,
  bookNumber: 24,
  unitType: "LESSON",
  title: "Sonlarni ayirish (43 - 7)",
  emoji: "🧸",
  crossTopic: "O‘yinchoqlar",
  shortDesc: "Ixtiyoriy ikki xonali sondan bir xonali sonni xonadan o'tib ayirish",
  intro: "O'yinchoqlar do'konida bolalar uchun xilma-xil o'yinchoqlar bor. 43 - 7 amalini bajarishda 43 = 30 + 13 deb olamiz: 13 - 7 = 6, 30 + 6 = 36!",
  keyPoints: [
    "1-usul: 7 ni 3 va 4 ga ajratish: 43 - 3 = 40, 40 - 4 = 36.",
    "2-usul: 43 ni 30 va 13 ga ajratish: 13 - 7 = 6, 30 + 6 = 36.",
    "Ikkala usul ham to'g'ri natijaga olib keladi."
  ],
  miniExample: {
    emojis: "🧸 43 - 7 = 36",
    text: "43 dan 7 ni ayirish: 43 - 3 = 40, 40 - 4 = 36 o'yinchoq!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Hisoblang: 43 - 7",
      correctAnswer: "36",
      distractors: ["35", "37", "34"],
      explanation: "43 - 3 = 40, 40 - 4 = 36."
    },
    {
      text: "Hisoblang: 52 - 6",
      correctAnswer: "46",
      distractors: ["45", "47", "44"],
      explanation: "52 - 2 = 50, 50 - 4 = 46."
    },
    {
      text: "Do'konda 42 ta ayiqcha bor edi. 8 tasi sotildi. Nechta ayiqcha qoldi?",
      correctAnswer: "34",
      distractors: ["33", "35", "32"],
      explanation: "42 - 8 = 34 ta ayiqcha."
    }
  ],
  test: [
    {
      text: "Hisoblang: 43 - 7",
      correctAnswer: "36",
      distractors: ["35", "37", "34"],
      explanation: "43 - 3 = 40, 40 - 4 = 36."
    },
    {
      text: "Hisoblang: 54 - 8",
      correctAnswer: "46",
      distractors: ["45", "47", "44"],
      explanation: "54 - 4 = 50, 50 - 4 = 46."
    },
    {
      text: "Hisoblang: 62 - 5",
      correctAnswer: "57",
      distractors: ["56", "58", "55"],
      explanation: "62 - 2 = 60, 60 - 3 = 57."
    },
    {
      text: "Hisoblang: 75 - 9",
      correctAnswer: "66",
      distractors: ["65", "67", "64"],
      explanation: "75 - 5 = 70, 70 - 4 = 66."
    },
    {
      text: "Qutida 45 ta o'yinchoq mashina bor edi. 8 tasi bolalarga berildi. Nechtasi qoldi?",
      correctAnswer: "37",
      distractors: ["36", "38", "35"],
      explanation: "45 - 8 = 37 ta mashina."
    },
    {
      text: "Hisoblang: 83 - 6",
      correctAnswer: "77",
      distractors: ["76", "78", "75"],
      explanation: "83 - 3 = 80, 80 - 3 = 77."
    },
    {
      text: "Hisoblang: 91 - 4",
      correctAnswer: "87",
      distractors: ["86", "88", "85"],
      explanation: "91 - 1 = 90, 90 - 3 = 87."
    },
    {
      text: "Hisoblang: 64 - 7",
      correctAnswer: "57",
      distractors: ["56", "58", "55"],
      explanation: "64 - 4 = 60, 60 - 3 = 57."
    },
    {
      text: "Tenglamani yeching: 43 - x = 35",
      correctAnswer: "8",
      distractors: ["7", "9", "6"],
      explanation: "x = 43 - 35 = 8."
    },
    {
      text: "Tenglamani yeching: y + 9 = 52",
      correctAnswer: "43",
      distractors: ["42", "44", "41"],
      explanation: "y = 52 - 9 = 43."
    },
    {
      text: "Taqqoslang: 43 - 7 va 30 + 6",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "43 - 7 = 36 va 30 + 6 = 36. Ular teng: 36 = 36."
    },
    {
      text: "Taqqoslang: 51 - 6 va 46",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "51 - 6 = 45. 45 < 46."
    },
    {
      text: "Konstruktor to'plamida 53 ta detal bor. 9 tasi ishlatildi. Ishlatilmagan detallar nechta?",
      correctAnswer: "44",
      distractors: ["43", "45", "42"],
      explanation: "53 - 9 = 44 ta detal."
    },
    {
      text: "Hisoblang: 72 - 8",
      correctAnswer: "64",
      distractors: ["63", "65", "62"],
      explanation: "72 - 2 = 70, 70 - 6 = 64."
    },
    {
      text: "Hisoblang: 85 - 7",
      correctAnswer: "78",
      distractors: ["77", "79", "76"],
      explanation: "85 - 5 = 80, 80 - 2 = 78."
    },
    {
      text: "Hisoblang: 46 - 8",
      correctAnswer: "38",
      distractors: ["37", "39", "36"],
      explanation: "46 - 6 = 40, 40 - 2 = 38."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: 43 - * = 34?",
      correctAnswer: "9",
      distractors: ["8", "7", "10"],
      explanation: "43 - 34 = 9."
    },
    {
      text: "Hisoblang: 66 - 9",
      correctAnswer: "57",
      distractors: ["56", "58", "55"],
      explanation: "66 - 6 = 60, 60 - 3 = 57."
    },
    {
      text: "Hisoblang: 94 - 6",
      correctAnswer: "88",
      distractors: ["87", "89", "86"],
      explanation: "94 - 4 = 90, 90 - 2 = 88."
    },
    {
      text: "Hisoblang: 55 - 8",
      correctAnswer: "47",
      distractors: ["46", "48", "45"],
      explanation: "55 - 5 = 50, 50 - 3 = 47."
    }
  ]
};

// ─────────────────────────────────────────────────────────────
// 25. Sonlarni ayirish (43 - 7) 🎲
// ─────────────────────────────────────────────────────────────
export const unit25: Grade2UnitDef = {
  order: 25,
  bookNumber: 25,
  unitType: "LESSON",
  title: "Sonlarni ayirish (43 - 7)",
  emoji: "🎲",
  crossTopic: "O‘yinlar",
  shortDesc: "Xonadan o'tib ayirishni mustahkamlash va mantiqiy o'yinlar",
  intro: "Shaxmat, shashka va mantiqiy o'yinlar diqqatni oshiradi. Ayirish amallarini tez va to'g'ri bajarish o'yinda g'alaba qozonishga yordam beradi!",
  keyPoints: [
    "Amallar zanjirida ketma-ket hisoblash: 43 - 7 = 36, 36 - 6 = 30.",
    "Ayirishni qo'shish bilan tekshirish: 36 + 7 = 43.",
    "O'yin ballari va yutuqlarni hisoblashda xonadan o'tib ayirish."
  ],
  miniExample: {
    emojis: "🎲 43 - 7 = 36 | 36 + 7 = 43",
    text: "Tekshirish: 36 + 7 = 43. Amallar to'g'ri bajarilgan!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Hisoblang: 43 - 7",
      correctAnswer: "36",
      distractors: ["35", "37", "34"],
      explanation: "43 - 7 = 36."
    },
    {
      text: "Shaxmat musobaqasida 44 ishtirokchidan 9 nafari keyingi bosqichga chiqmadi. Nechta o'yinchi qoldi?",
      correctAnswer: "35",
      distractors: ["34", "36", "33"],
      explanation: "44 - 9 = 35 nafar."
    },
    {
      text: "Hisoblang: 63 - 8",
      correctAnswer: "55",
      distractors: ["54", "56", "53"],
      explanation: "63 - 3 = 60, 60 - 5 = 55."
    }
  ],
  test: [
    {
      text: "Hisoblang: 43 - 7",
      correctAnswer: "36",
      distractors: ["35", "37", "34"],
      explanation: "43 - 7 = 36."
    },
    {
      text: "Hisoblang: 51 - 5",
      correctAnswer: "46",
      distractors: ["45", "47", "44"],
      explanation: "51 - 1 = 50, 50 - 4 = 46."
    },
    {
      text: "Hisoblang: 65 - 8",
      correctAnswer: "57",
      distractors: ["56", "58", "55"],
      explanation: "65 - 5 = 60, 60 - 3 = 57."
    },
    {
      text: "Stol o'yinida Ahmad 42 ochkodan 6 ochko yo'qotdi. Unda necha ochko qoldi?",
      correctAnswer: "36",
      distractors: ["35", "37", "34"],
      explanation: "42 - 6 = 36 ochko."
    },
    {
      text: "Hisoblang: 73 - 9",
      correctAnswer: "64",
      distractors: ["63", "65", "62"],
      explanation: "73 - 3 = 70, 70 - 6 = 64."
    },
    {
      text: "Hisoblang: 82 - 7",
      correctAnswer: "75",
      distractors: ["74", "76", "73"],
      explanation: "82 - 2 = 80, 80 - 5 = 75."
    },
    {
      text: "Hisoblang: 93 - 5",
      correctAnswer: "88",
      distractors: ["87", "89", "86"],
      explanation: "93 - 3 = 90, 90 - 2 = 88."
    },
    {
      text: "Hisoblang: 44 - 6",
      correctAnswer: "38",
      distractors: ["37", "39", "36"],
      explanation: "44 - 4 = 40, 40 - 2 = 38."
    },
    {
      text: "Tenglamani yeching: z + 8 = 42",
      correctAnswer: "34",
      distractors: ["33", "35", "32"],
      explanation: "z = 42 - 8 = 34."
    },
    {
      text: "Tenglamani yeching: 64 - x = 58",
      correctAnswer: "6",
      distractors: ["5", "7", "8"],
      explanation: "x = 64 - 58 = 6."
    },
    {
      text: "Taqqoslang: 43 - 7 va 52 - 16",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "43 - 7 = 36 va 52 - 16 = 36. Ular teng: 36 = 36."
    },
    {
      text: "Taqqoslang: 61 - 7 va 55",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "61 - 7 = 54. 54 < 55."
    },
    {
      text: "Shashka to'plamida 48 ta donadan 9 tasi yo'qoldi. Nechta dona qolgan?",
      correctAnswer: "39",
      distractors: ["38", "40", "37"],
      explanation: "48 - 9 = 39 ta."
    },
    {
      text: "Hisoblang: 74 - 8",
      correctAnswer: "66",
      distractors: ["65", "67", "64"],
      explanation: "74 - 4 = 70, 70 - 4 = 66."
    },
    {
      text: "Hisoblang: 86 - 9",
      correctAnswer: "77",
      distractors: ["76", "78", "75"],
      explanation: "86 - 6 = 80, 80 - 3 = 77."
    },
    {
      text: "Hisoblang: 52 - 4",
      correctAnswer: "48",
      distractors: ["47", "49", "46"],
      explanation: "52 - 2 = 50, 50 - 2 = 48."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: 71 - * = 64?",
      correctAnswer: "7",
      distractors: ["6", "8", "9"],
      explanation: "71 - 64 = 7."
    },
    {
      text: "Hisoblang: 95 - 8",
      correctAnswer: "87",
      distractors: ["86", "88", "85"],
      explanation: "95 - 5 = 90, 90 - 3 = 87."
    },
    {
      text: "Hisoblang: 41 - 5",
      correctAnswer: "36",
      distractors: ["35", "37", "34"],
      explanation: "41 - 1 = 40, 40 - 4 = 36."
    },
    {
      text: "Hisoblang: 62 - 7",
      correctAnswer: "55",
      distractors: ["54", "56", "53"],
      explanation: "62 - 2 = 60, 60 - 5 = 55."
    }
  ]
};

// ─────────────────────────────────────────────────────────────
// 26. Sonlarni qo'shish (28 + 14) 📱
// ─────────────────────────────────────────────────────────────
export const unit26: Grade2UnitDef = {
  order: 26,
  bookNumber: 26,
  unitType: "LESSON",
  title: "Sonlarni qo‘shish (28 + 14)",
  emoji: "📱",
  crossTopic: "Gadjetlar",
  shortDesc: "Ikki xonali sonlarni xonadan o'tib qo'shish usuli",
  intro: "Zamonaviy gadjetlar va dasturlar orqali murakkab hisoblashlar bir zumda bajariladi. Biz ham 28 + 14 amalini qulay qismlarga ajratib o'rganamiz: 28 + 10 = 38, so'ng 38 + 4 = 42!",
  keyPoints: [
    "1-qadam: 14 sonini o'nlik va birliklarga ajratamiz: 10 va 4.",
    "2-qadam: Avval o'nlikni qo'shamiz: 28 + 10 = 38.",
    "3-qadam: Chiqqan songa birlikni qo'shamiz: 38 + 4 = 42.",
    "Boshqa usul: 28 + 2 + 12 = 30 + 12 = 42."
  ],
  miniExample: {
    emojis: "📱 28 + 14 = (28 + 10) + 4 = 42",
    text: "28 ga 14 ni qo'shish: 28 + 10 = 38, so'ng 38 + 4 = 42!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Hisoblang: 28 + 14",
      correctAnswer: "42",
      distractors: ["41", "43", "40"],
      explanation: "28 + 10 = 38, 38 + 4 = 42."
    },
    {
      text: "Hisoblang: 37 + 25",
      correctAnswer: "62",
      distractors: ["61", "63", "60"],
      explanation: "37 + 20 = 57, 57 + 5 = 62."
    },
    {
      text: "Do'konda 28 ta telefon va 14 ta planshet sotildi. Jami nechta gadjet sotildi?",
      correctAnswer: "42",
      distractors: ["41", "43", "40"],
      explanation: "28 + 14 = 42 ta gadjet."
    }
  ],
  test: [
    {
      text: "Hisoblang: 28 + 14",
      correctAnswer: "42",
      distractors: ["41", "43", "40"],
      explanation: "28 + 10 = 38, 38 + 4 = 42."
    },
    {
      text: "Hisoblang: 36 + 18",
      correctAnswer: "54",
      distractors: ["53", "55", "52"],
      explanation: "36 + 10 = 46, 46 + 8 = 54."
    },
    {
      text: "Hisoblang: 47 + 25",
      correctAnswer: "72",
      distractors: ["71", "73", "70"],
      explanation: "47 + 20 = 67, 67 + 5 = 72."
    },
    {
      text: "Hisoblang: 58 + 16",
      correctAnswer: "74",
      distractors: ["73", "75", "72"],
      explanation: "58 + 10 = 68, 68 + 6 = 74."
    },
    {
      text: "Servis markazida 29 ta smartfon va 15 ta noutbuk ta'mirlandi. Jami qurilmalar nechta?",
      correctAnswer: "44",
      distractors: ["43", "45", "42"],
      explanation: "29 + 15 = 44 ta qurilma."
    },
    {
      text: "Hisoblang: 65 + 17",
      correctAnswer: "82",
      distractors: ["81", "83", "80"],
      explanation: "65 + 10 = 75, 75 + 7 = 82."
    },
    {
      text: "Hisoblang: 48 + 26",
      correctAnswer: "74",
      distractors: ["73", "75", "72"],
      explanation: "48 + 20 = 68, 68 + 6 = 74."
    },
    {
      text: "Hisoblang: 39 + 33",
      correctAnswer: "72",
      distractors: ["71", "73", "70"],
      explanation: "39 + 30 = 69, 69 + 3 = 72."
    },
    {
      text: "Tenglamani yeching: x - 14 = 28",
      correctAnswer: "42",
      distractors: ["41", "43", "40"],
      explanation: "x = 28 + 14 = 42."
    },
    {
      text: "Tenglamani yeching: y - 18 = 36",
      correctAnswer: "54",
      distractors: ["53", "55", "52"],
      explanation: "y = 36 + 18 = 54."
    },
    {
      text: "Taqqoslang: 28 + 14 va 30 + 12",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "28 + 14 = 42 va 30 + 12 = 42. Ular teng: 42 = 42."
    },
    {
      text: "Taqqoslang: 37 + 16 va 55",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "37 + 16 = 53. 53 < 55."
    },
    {
      text: "Do'konda bir kunda 38 ta aqlli soat va 24 ta quloqchin sotildi. Jami nechta aksessuar sotildi?",
      correctAnswer: "62",
      distractors: ["61", "63", "60"],
      explanation: "38 + 24 = 62 ta aksessuar."
    },
    {
      text: "Hisoblang: 56 + 28",
      correctAnswer: "84",
      distractors: ["83", "85", "82"],
      explanation: "56 + 20 = 76, 76 + 8 = 84."
    },
    {
      text: "Hisoblang: 27 + 36",
      correctAnswer: "63",
      distractors: ["62", "64", "61"],
      explanation: "27 + 30 = 57, 57 + 6 = 63."
    },
    {
      text: "Hisoblang: 49 + 17",
      correctAnswer: "66",
      distractors: ["65", "67", "64"],
      explanation: "49 + 10 = 59, 59 + 7 = 66."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: 28 + * = 45?",
      correctAnswer: "17",
      distractors: ["16", "18", "15"],
      explanation: "45 - 28 = 17."
    },
    {
      text: "Hisoblang: 67 + 25",
      correctAnswer: "92",
      distractors: ["91", "93", "90"],
      explanation: "67 + 20 = 87, 87 + 5 = 92."
    },
    {
      text: "Hisoblang: 19 + 45",
      correctAnswer: "64",
      distractors: ["63", "65", "62"],
      explanation: "19 + 40 = 59, 59 + 5 = 64."
    },
    {
      text: "Hisoblang: 38 + 34",
      correctAnswer: "72",
      distractors: ["71", "73", "70"],
      explanation: "38 + 30 = 68, 68 + 4 = 72."
    }
  ]
};

// ─────────────────────────────────────────────────────────────
// 27. Sonlarni qo'shish (28 + 14) 💻 (crossTopic: null)
// ─────────────────────────────────────────────────────────────
export const unit27: Grade2UnitDef = {
  order: 27,
  bookNumber: 26,
  unitType: "LESSON",
  title: "Sonlarni qo‘shish (28 + 14)",
  emoji: "💻",
  crossTopic: null,
  shortDesc: "Xonadan o'tib qo'shish amalini mustahkamlash",
  intro: "Ikki xonali sonlarni xonadan o'tib qo'shish ko'nikmasini turli ifodalar va amaliy topshiriqlar orqali mustahkamlaymiz.",
  keyPoints: [
    "Ustun ko'rinishida va satrda qulay hisoblash usullari.",
    "Birliklar: 8 + 4 = 12 (2 yoziladi, 1 o'nlik yodda saqlanadi).",
    "O'nliklar: 2 + 1 + 1 (yoddagi) = 4 o'nlik. Natija: 42."
  ],
  miniExample: {
    emojis: "💻 28 + 14 = 42",
    text: "Birliklar 8 + 4 = 12, o'nliklar 2 + 1 = 3, yoddagi 1 bilan 4 o'nlik = 42!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Hisoblang: 28 + 14",
      correctAnswer: "42",
      distractors: ["41", "43", "40"],
      explanation: "28 + 14 = 42."
    },
    {
      text: "Hisoblang: 35 + 27",
      correctAnswer: "62",
      distractors: ["61", "63", "60"],
      explanation: "35 + 20 = 55, 55 + 7 = 62."
    },
    {
      text: "Kutubxonaga 46 ta ertak va 28 ta darslik keltirildi. Jami nechta kitob keltirildi?",
      correctAnswer: "74",
      distractors: ["73", "75", "72"],
      explanation: "46 + 28 = 74 ta kitob."
    }
  ],
  test: [
    {
      text: "Hisoblang: 28 + 14",
      correctAnswer: "42",
      distractors: ["41", "43", "40"],
      explanation: "28 + 14 = 42."
    },
    {
      text: "Hisoblang: 45 + 17",
      correctAnswer: "62",
      distractors: ["61", "63", "60"],
      explanation: "45 + 10 = 55, 55 + 7 = 62."
    },
    {
      text: "Hisoblang: 36 + 26",
      correctAnswer: "62",
      distractors: ["61", "63", "60"],
      explanation: "36 + 20 = 56, 56 + 6 = 62."
    },
    {
      text: "Hisoblang: 57 + 18",
      correctAnswer: "75",
      distractors: ["74", "76", "73"],
      explanation: "57 + 10 = 67, 67 + 8 = 75."
    },
    {
      text: "O'quvchi birinchi kuni 28 sahifa, ikkinchi kuni 15 sahifa kitob o'qidi. Jami necha sahifa o'qilgan?",
      correctAnswer: "43",
      distractors: ["42", "44", "41"],
      explanation: "28 + 15 = 43 sahifa."
    },
    {
      text: "Hisoblang: 68 + 24",
      correctAnswer: "92",
      distractors: ["91", "93", "90"],
      explanation: "68 + 20 = 88, 88 + 4 = 92."
    },
    {
      text: "Hisoblang: 39 + 25",
      correctAnswer: "64",
      distractors: ["63", "65", "62"],
      explanation: "39 + 20 = 59, 59 + 5 = 64."
    },
    {
      text: "Hisoblang: 48 + 35",
      correctAnswer: "83",
      distractors: ["82", "84", "81"],
      explanation: "48 + 30 = 78, 78 + 5 = 83."
    },
    {
      text: "Tenglamani yeching: a - 26 = 38",
      correctAnswer: "64",
      distractors: ["63", "65", "62"],
      explanation: "a = 38 + 26 = 64."
    },
    {
      text: "Tenglamani yeching: b - 17 = 45",
      correctAnswer: "62",
      distractors: ["61", "63", "60"],
      explanation: "b = 45 + 17 = 62."
    },
    {
      text: "Taqqoslang: 28 + 14 va 50 - 8",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "28 + 14 = 42 va 50 - 8 = 42. Ular teng: 42 = 42."
    },
    {
      text: "Taqqoslang: 46 + 19 va 66",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "46 + 19 = 65. 65 < 66."
    },
    {
      text: "Dala maydonidan 37 qop sabzi va 25 qop piyoz yig'ib olindi. Jami necha qop sabzavot yig'ildi?",
      correctAnswer: "62",
      distractors: ["61", "63", "60"],
      explanation: "37 + 25 = 62 qop."
    },
    {
      text: "Hisoblang: 58 + 27",
      correctAnswer: "85",
      distractors: ["84", "86", "83"],
      explanation: "58 + 20 = 78, 78 + 7 = 85."
    },
    {
      text: "Hisoblang: 29 + 36",
      correctAnswer: "65",
      distractors: ["64", "66", "63"],
      explanation: "29 + 30 = 59, 59 + 6 = 65."
    },
    {
      text: "Hisoblang: 47 + 38",
      correctAnswer: "85",
      distractors: ["84", "86", "83"],
      explanation: "47 + 30 = 77, 77 + 8 = 85."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: 34 + * = 52?",
      correctAnswer: "18",
      distractors: ["17", "19", "16"],
      explanation: "52 - 34 = 18."
    },
    {
      text: "Hisoblang: 64 + 19",
      correctAnswer: "83",
      distractors: ["82", "84", "81"],
      explanation: "64 + 10 = 74, 74 + 9 = 83."
    },
    {
      text: "Hisoblang: 18 + 55",
      correctAnswer: "73",
      distractors: ["72", "74", "71"],
      explanation: "18 + 50 = 68, 68 + 5 = 73."
    },
    {
      text: "Hisoblang: 37 + 46",
      correctAnswer: "83",
      distractors: ["82", "84", "81"],
      explanation: "37 + 40 = 77, 77 + 6 = 83."
    }
  ]
};

const allUnits = [unit20, unit21, unit22, unit23, unit24, unit25, unit26, unit27];

for (const u of allUnits) {
  const seed = buildGrade2UnitSeed(u);
  saveGrade2UnitFile(u.order, seed);
  console.log(`✅ Saved Grade 2 unit-${u.order < 10 ? '0' + u.order : u.order}.json`);
}
