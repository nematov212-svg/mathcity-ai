import { Grade2UnitDef, buildGrade2UnitSeed, saveGrade2UnitFile } from './generatorTypes';

console.log("Generating Grade 2 Part 1 Chapter IV (order 28-34)...");

// ─────────────────────────────────────────────────────────────
// 28. Ustun ko'rinishida qo'shish va ayirish 🤖
// ─────────────────────────────────────────────────────────────
export const unit28: Grade2UnitDef = {
  order: 28,
  bookNumber: 27,
  unitType: "LESSON",
  title: "Ustun ko‘rinishida qo‘shish va ayirish",
  emoji: "🤖",
  crossTopic: "Robotlar",
  shortDesc: "Amallarni ustun shaklida xatolarsiz yozish va hisoblash qoidalari",
  intro: "Robotlar aniq qoidalar asosida ishlaydi. Ustun ko'rinishida hisoblashda ham qat'iy qoida bor: birliklar tagiga birliklar, o'nliklar tagiga o'nliklar yoziladi!",
  keyPoints: [
    "Qo'shish va ayirish har doim birliklar xonasidan boshlanadi.",
    "Birliklar birliklarga qo'shiladi yoki ayiriladi.",
    "O'nliklar o'nliklarga qo'shiladi yoki ayiriladi."
  ],
  miniExample: {
    emojis: "🤖 34 + 25 = 59 | 68 - 24 = 44",
    text: "Birliklar tagiga birliklar: 4 + 5 = 9, 3 + 2 = 5 o'nlik. Natija: 59!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Ustun shaklida hisoblang: 34 + 25",
      correctAnswer: "59",
      distractors: ["58", "60", "49"],
      explanation: "4 + 5 = 9, 3 + 2 = 5. Natija: 59."
    },
    {
      text: "Ustun shaklida hisoblang: 68 - 24",
      correctAnswer: "44",
      distractors: ["43", "45", "42"],
      explanation: "8 - 4 = 4, 6 - 2 = 4. Natija: 44."
    },
    {
      text: "Robotlar musobaqasida 1-robot 45 ball, 2-robot 32 ball to'pladi. Jami ballar nechta?",
      correctAnswer: "77",
      distractors: ["76", "78", "75"],
      explanation: "45 + 32 = 77 ball."
    }
  ],
  test: [
    {
      text: "Ustun shaklida hisoblang: 34 + 25",
      correctAnswer: "59",
      distractors: ["58", "60", "49"],
      explanation: "4 + 5 = 9, 3 + 2 = 5. Natija: 59."
    },
    {
      text: "Ustun shaklida hisoblang: 68 - 24",
      correctAnswer: "44",
      distractors: ["43", "45", "42"],
      explanation: "8 - 4 = 4, 6 - 2 = 4. Natija: 44."
    },
    {
      text: "Ustun shaklida hisoblang: 42 + 36",
      correctAnswer: "78",
      distractors: ["77", "79", "76"],
      explanation: "2 + 6 = 8, 4 + 3 = 7. Natija: 78."
    },
    {
      text: "Ustun shaklida hisoblang: 79 - 35",
      correctAnswer: "44",
      distractors: ["43", "45", "42"],
      explanation: "9 - 5 = 4, 7 - 3 = 4. Natija: 44."
    },
    {
      text: "Robototexnika to'garagida 24 ta qiz va 35 ta o'g'il bola qatnashmoqda. Jami o'quvchilar nechta?",
      correctAnswer: "59",
      distractors: ["58", "60", "57"],
      explanation: "24 + 35 = 59 nafar."
    },
    {
      text: "Ustun shaklida hisoblang: 53 + 24",
      correctAnswer: "77",
      distractors: ["76", "78", "75"],
      explanation: "3 + 4 = 7, 5 + 2 = 7. Natija: 77."
    },
    {
      text: "Ustun shaklida hisoblang: 87 - 43",
      correctAnswer: "44",
      distractors: ["43", "45", "42"],
      explanation: "7 - 3 = 4, 8 - 4 = 4. Natija: 44."
    },
    {
      text: "Ustun shaklida hisoblang: 31 + 47",
      correctAnswer: "78",
      distractors: ["77", "79", "76"],
      explanation: "1 + 7 = 8, 3 + 4 = 7. Natija: 78."
    },
    {
      text: "Tenglamani yeching: x - 32 = 45",
      correctAnswer: "77",
      distractors: ["76", "78", "75"],
      explanation: "x = 45 + 32 = 77."
    },
    {
      text: "Tenglamani yeching: y + 23 = 68",
      correctAnswer: "45",
      distractors: ["44", "46", "43"],
      explanation: "y = 68 - 23 = 45."
    },
    {
      text: "Taqqoslang: 34 + 25 va 60",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "34 + 25 = 59. 59 < 60."
    },
    {
      text: "Taqqoslang: 68 - 24 va 22 + 22",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "68 - 24 = 44 va 22 + 22 = 44. Ular teng: 44 = 44."
    },
    {
      text: "Fabrikada robot 56 ta detal yig'di, operator esa 31 ta detal yig'di. Jami detallar nechta?",
      correctAnswer: "87",
      distractors: ["86", "88", "85"],
      explanation: "56 + 31 = 87 ta detal."
    },
    {
      text: "Ustun shaklida hisoblang: 46 + 33",
      correctAnswer: "79",
      distractors: ["78", "80", "77"],
      explanation: "6 + 3 = 9, 4 + 3 = 7. Natija: 79."
    },
    {
      text: "Ustun shaklida hisoblang: 98 - 56",
      correctAnswer: "42",
      distractors: ["41", "43", "40"],
      explanation: "8 - 6 = 2, 9 - 5 = 4. Natija: 42."
    },
    {
      text: "Ustun shaklida hisoblang: 62 + 25",
      correctAnswer: "87",
      distractors: ["86", "88", "85"],
      explanation: "2 + 5 = 7, 6 + 2 = 8. Natija: 87."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: 54 + * = 78?",
      correctAnswer: "24",
      distractors: ["23", "25", "22"],
      explanation: "78 - 54 = 24."
    },
    {
      text: "Ustun shaklida hisoblang: 76 - 42",
      correctAnswer: "34",
      distractors: ["33", "35", "32"],
      explanation: "6 - 2 = 4, 7 - 4 = 3. Natija: 34."
    },
    {
      text: "Ustun shaklida hisoblang: 23 + 54",
      correctAnswer: "77",
      distractors: ["76", "78", "75"],
      explanation: "3 + 4 = 7, 2 + 5 = 7. Natija: 77."
    },
    {
      text: "Ustun shaklida hisoblang: 89 - 67",
      correctAnswer: "22",
      distractors: ["21", "23", "20"],
      explanation: "9 - 7 = 2, 8 - 6 = 2. Natija: 22."
    }
  ]
};

// ─────────────────────────────────────────────────────────────
// 29. Sonlarni ayirish (43 - 16) 🎨
// ─────────────────────────────────────────────────────────────
export const unit29: Grade2UnitDef = {
  order: 29,
  bookNumber: 28,
  unitType: "LESSON",
  title: "Sonlarni ayirish (43 - 16)",
  emoji: "🎨",
  crossTopic: "San'at",
  shortDesc: "Ikki xonali sondan ikki xonali sonni xonadan o'tib ayirish",
  intro: "San'atkor ranglarni aralashtirib ajoyib manzaralar yaratadi. Matematikada esa 43 - 16 kabi ifodalarni xona birliklari orqali qulay ayiramiz: 43 - 10 = 33, so'ngra 33 - 6 = 27!",
  keyPoints: [
    "1-qadam: 16 sonini 10 va 6 ga ajratamiz.",
    "2-qadam: 43 dan avval o'nlikni ayiramiz: 43 - 10 = 33.",
    "3-qadam: Chiqqan natijadan birlikni ayiramiz: 33 - 6 = 27."
  ],
  miniExample: {
    emojis: "🎨 43 - 16 = (43 - 10) - 6 = 27",
    text: "43 dan 16 ni ayirish: 43 - 10 = 33, 33 - 6 = 27 bo'yoq!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Hisoblang: 43 - 16",
      correctAnswer: "27",
      distractors: ["26", "28", "25"],
      explanation: "43 - 10 = 33, 33 - 6 = 27."
    },
    {
      text: "Hisoblang: 52 - 25",
      correctAnswer: "27",
      distractors: ["26", "28", "25"],
      explanation: "52 - 20 = 32, 32 - 5 = 27."
    },
    {
      text: "Rassomda 44 ta qalam bor edi. 18 tasi ishlatildi. Nechta yangi qalam qoldi?",
      correctAnswer: "26",
      distractors: ["25", "27", "24"],
      explanation: "44 - 18 = 44 - 10 - 8 = 26 ta."
    }
  ],
  test: [
    {
      text: "Hisoblang: 43 - 16",
      correctAnswer: "27",
      distractors: ["26", "28", "25"],
      explanation: "43 - 10 = 33, 33 - 6 = 27."
    },
    {
      text: "Hisoblang: 54 - 27",
      correctAnswer: "27",
      distractors: ["26", "28", "25"],
      explanation: "54 - 20 = 34, 34 - 7 = 27."
    },
    {
      text: "Hisoblang: 62 - 35",
      correctAnswer: "27",
      distractors: ["26", "28", "25"],
      explanation: "62 - 30 = 32, 32 - 5 = 27."
    },
    {
      text: "Hisoblang: 75 - 38",
      correctAnswer: "37",
      distractors: ["36", "38", "35"],
      explanation: "75 - 30 = 45, 45 - 8 = 37."
    },
    {
      text: "San'at ko'rgazmasida 51 ta rasm bor edi. 19 tasi sotildi. Nechta rasm qoldi?",
      correctAnswer: "32",
      distractors: ["31", "33", "30"],
      explanation: "51 - 19 = 32 ta rasm."
    },
    {
      text: "Hisoblang: 83 - 46",
      correctAnswer: "37",
      distractors: ["36", "38", "35"],
      explanation: "83 - 40 = 43, 43 - 6 = 37."
    },
    {
      text: "Hisoblang: 91 - 54",
      correctAnswer: "37",
      distractors: ["36", "38", "35"],
      explanation: "91 - 50 = 41, 41 - 4 = 37."
    },
    {
      text: "Hisoblang: 65 - 28",
      correctAnswer: "37",
      distractors: ["36", "38", "35"],
      explanation: "65 - 20 = 45, 45 - 8 = 37."
    },
    {
      text: "Tenglamani yeching: x + 16 = 43",
      correctAnswer: "27",
      distractors: ["26", "28", "25"],
      explanation: "x = 43 - 16 = 27."
    },
    {
      text: "Tenglamani yeching: y + 25 = 62",
      correctAnswer: "37",
      distractors: ["36", "38", "35"],
      explanation: "y = 62 - 25 = 37."
    },
    {
      text: "Taqqoslang: 43 - 16 va 53 - 26",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "43 - 16 = 27 va 53 - 26 = 27. Ular teng: 27 = 27."
    },
    {
      text: "Taqqoslang: 52 - 17 va 36",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "52 - 17 = 35. 35 < 36."
    },
    {
      text: "Albimda 60 ta rasmdan 24 tasi rangli, qolgani oq-qora. Oq-qora rasmlar nechta?",
      correctAnswer: "36",
      distractors: ["35", "37", "34"],
      explanation: "60 - 24 = 36 ta."
    },
    {
      text: "Hisoblang: 72 - 36",
      correctAnswer: "36",
      distractors: ["35", "37", "34"],
      explanation: "72 - 30 = 42, 42 - 6 = 36."
    },
    {
      text: "Hisoblang: 84 - 47",
      correctAnswer: "37",
      distractors: ["36", "38", "35"],
      explanation: "84 - 40 = 44, 44 - 7 = 37."
    },
    {
      text: "Hisoblang: 46 - 19",
      correctAnswer: "27",
      distractors: ["26", "28", "25"],
      explanation: "46 - 10 = 36, 36 - 9 = 27."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: 43 - * = 18?",
      correctAnswer: "25",
      distractors: ["24", "26", "23"],
      explanation: "43 - 18 = 25."
    },
    {
      text: "Hisoblang: 66 - 29",
      correctAnswer: "37",
      distractors: ["36", "38", "35"],
      explanation: "66 - 20 = 46, 46 - 9 = 37."
    },
    {
      text: "Hisoblang: 93 - 48",
      correctAnswer: "45",
      distractors: ["44", "46", "43"],
      explanation: "93 - 40 = 53, 53 - 8 = 45."
    },
    {
      text: "Hisoblang: 55 - 18",
      correctAnswer: "37",
      distractors: ["36", "38", "35"],
      explanation: "55 - 10 = 45, 45 - 8 = 37."
    }
  ]
};

// ─────────────────────────────────────────────────────────────
// 30. Sonlarni ayirish (43 - 16) 🍰
// ─────────────────────────────────────────────────────────────
export const unit30: Grade2UnitDef = {
  order: 30,
  bookNumber: 29,
  unitType: "LESSON",
  title: "Sonlarni ayirish (43 - 16)",
  emoji: "🍰",
  crossTopic: "Qandolatchilik",
  shortDesc: "Ikki xonali sondan ayirishni mustahkamlash va shirinliklar masalalari",
  intro: "Qandolatchilar bayram uchun mazali tort va pishiriqlar tayyorlashadi. Masalliqlar va buyurtmalarni hisoblashda 43 - 16 kabi ayirish amallarini qo'llaymiz.",
  keyPoints: [
    "Ayirishni tekshirish: 27 + 16 = 43.",
    "Birliklar yetmaganda o'nlikdan 1 ta o'nlik olinadi: 13 - 6 = 7.",
    "Qandolat mahsulotlari soni va vazni bo'yicha amaliy masalalar."
  ],
  miniExample: {
    emojis: "🍰 43 - 16 = 27 | 27 + 16 = 43",
    text: "43 ta tortdan 16 tasi sotilsa, 27 ta tort qoladi!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Hisoblang: 43 - 16",
      correctAnswer: "27",
      distractors: ["26", "28", "25"],
      explanation: "43 - 16 = 27."
    },
    {
      text: "Qandolat do'konida 50 ta pirogdan 23 tasi sotildi. Nechta pirog qoldi?",
      correctAnswer: "27",
      distractors: ["26", "28", "25"],
      explanation: "50 - 23 = 27 ta pirog."
    },
    {
      text: "Hisoblang: 64 - 28",
      correctAnswer: "36",
      distractors: ["35", "37", "34"],
      explanation: "64 - 20 = 44, 44 - 8 = 36."
    }
  ],
  test: [
    {
      text: "Hisoblang: 43 - 16",
      correctAnswer: "27",
      distractors: ["26", "28", "25"],
      explanation: "43 - 16 = 27."
    },
    {
      text: "Hisoblang: 52 - 18",
      correctAnswer: "34",
      distractors: ["33", "35", "32"],
      explanation: "52 - 10 = 42, 42 - 8 = 34."
    },
    {
      text: "Hisoblang: 63 - 27",
      correctAnswer: "36",
      distractors: ["35", "37", "34"],
      explanation: "63 - 20 = 43, 43 - 7 = 36."
    },
    {
      text: "Do'konga 70 ta shokoladli rulet keltirildi. 34 tasi sotildi. Nechtasi qoldi?",
      correctAnswer: "36",
      distractors: ["35", "37", "34"],
      explanation: "70 - 34 = 36 ta rulet."
    },
    {
      text: "Hisoblang: 81 - 45",
      correctAnswer: "36",
      distractors: ["35", "37", "34"],
      explanation: "81 - 40 = 41, 41 - 5 = 36."
    },
    {
      text: "Hisoblang: 92 - 56",
      correctAnswer: "36",
      distractors: ["35", "37", "34"],
      explanation: "92 - 50 = 42, 42 - 6 = 36."
    },
    {
      text: "Hisoblang: 45 - 19",
      correctAnswer: "26",
      distractors: ["25", "27", "24"],
      explanation: "45 - 10 = 35, 35 - 9 = 26."
    },
    {
      text: "Qandolatchi 48 ta keks pishirdi. 19 tasi ertalab sotildi. Nechtasi qoldi?",
      correctAnswer: "29",
      distractors: ["28", "30", "27"],
      explanation: "48 - 19 = 29 ta keks."
    },
    {
      text: "Tenglamani yeching: x + 16 = 43",
      correctAnswer: "27",
      distractors: ["26", "28", "25"],
      explanation: "x = 43 - 16 = 27."
    },
    {
      text: "Tenglamani yeching: y + 28 = 65",
      correctAnswer: "37",
      distractors: ["36", "38", "35"],
      explanation: "y = 65 - 28 = 37."
    },
    {
      text: "Taqqoslang: 43 - 16 va 14 + 13",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "43 - 16 = 27 va 14 + 13 = 27. Ular teng: 27 = 27."
    },
    {
      text: "Taqqoslang: 54 - 28 va 25",
      correctAnswer: ">",
      distractors: ["<", "=", "+"],
      explanation: "54 - 28 = 26. 26 > 25."
    },
    {
      text: "Bayram dasturxoni uchun 60 ta kulcha pishirildi. 25 tasi mehmonlarga berildi. Nechtasi qoldi?",
      correctAnswer: "35",
      distractors: ["34", "36", "33"],
      explanation: "60 - 25 = 35 ta."
    },
    {
      text: "Hisoblang: 73 - 38",
      correctAnswer: "35",
      distractors: ["34", "36", "33"],
      explanation: "73 - 30 = 43, 43 - 8 = 35."
    },
    {
      text: "Hisoblang: 86 - 49",
      correctAnswer: "37",
      distractors: ["36", "38", "35"],
      explanation: "86 - 40 = 46, 46 - 9 = 37."
    },
    {
      text: "Hisoblang: 42 - 17",
      correctAnswer: "25",
      distractors: ["24", "26", "23"],
      explanation: "42 - 10 = 32, 32 - 7 = 25."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: 51 - * = 26?",
      correctAnswer: "25",
      distractors: ["24", "26", "23"],
      explanation: "51 - 26 = 25."
    },
    {
      text: "Hisoblang: 67 - 39",
      correctAnswer: "28",
      distractors: ["27", "29", "26"],
      explanation: "67 - 30 = 37, 37 - 9 = 28."
    },
    {
      text: "Hisoblang: 95 - 58",
      correctAnswer: "37",
      distractors: ["36", "38", "35"],
      explanation: "95 - 50 = 45, 45 - 8 = 37."
    },
    {
      text: "Hisoblang: 56 - 29",
      correctAnswer: "27",
      distractors: ["26", "28", "25"],
      explanation: "56 - 20 = 36, 36 - 9 = 27."
    }
  ]
};

// ─────────────────────────────────────────────────────────────
// 31. Ustun ko'rinishida qo'shish 🗣️
// ─────────────────────────────────────────────────────────────
export const unit31: Grade2UnitDef = {
  order: 31,
  bookNumber: 30,
  unitType: "LESSON",
  title: "Ustun ko‘rinishida qo‘shish",
  emoji: "🗣️",
  crossTopic: "Til o‘rganish",
  shortDesc: "Xonadan o'tib ustun ko'rinishida qo'shish algoritmi",
  intro: "Yangi til o'rganishda harflar va so'zlar birlashib gap hosil qiladi. Ustun ko'rinishida qo'shishda ham birliklar o'nlikka o'tib yangi xonani hosil qiladi!",
  keyPoints: [
    "Birliklar qo'shiladi: masalan, 7 + 5 = 12.",
    "2 birliklar tagiga yoziladi, 1 o'nlik esda saqlanadi.",
    "O'nliklar qo'shiladi va yoddagi 1 qo'shib qo'yiladi."
  ],
  miniExample: {
    emojis: "🗣️ 37 + 25 = 62",
    text: "7 + 5 = 12 (2 yozamiz, 1 dilda), 3 + 2 = 5, dildagi bilan 6 o'nlik = 62!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Ustun shaklida hisoblang: 37 + 25",
      correctAnswer: "62",
      distractors: ["61", "63", "60"],
      explanation: "7 + 5 = 12 (2 yoziladi, 1 dilda), 3 + 2 + 1 = 6. Natija: 62."
    },
    {
      text: "Ustun shaklida hisoblang: 48 + 36",
      correctAnswer: "84",
      distractors: ["83", "85", "82"],
      explanation: "8 + 6 = 14 (4 yoziladi, 1 dilda), 4 + 3 + 1 = 8. Natija: 84."
    },
    {
      text: "Til kursida 28 ta yangi so'z va 15 ta qoida o'rganildi. Jami nechta mavzu o'rganildi?",
      correctAnswer: "43",
      distractors: ["42", "44", "41"],
      explanation: "28 + 15 = 43."
    }
  ],
  test: [
    {
      text: "Ustun shaklida hisoblang: 37 + 25",
      correctAnswer: "62",
      distractors: ["61", "63", "60"],
      explanation: "7 + 5 = 12, 3 + 2 + 1 = 6. Natija: 62."
    },
    {
      text: "Ustun shaklida hisoblang: 46 + 28",
      correctAnswer: "74",
      distractors: ["73", "75", "72"],
      explanation: "6 + 8 = 14, 4 + 2 + 1 = 7. Natija: 74."
    },
    {
      text: "Ustun shaklida hisoblang: 58 + 26",
      correctAnswer: "84",
      distractors: ["83", "85", "82"],
      explanation: "8 + 6 = 14, 5 + 2 + 1 = 8. Natija: 84."
    },
    {
      text: "Ustun shaklida hisoblang: 29 + 37",
      correctAnswer: "66",
      distractors: ["65", "67", "64"],
      explanation: "9 + 7 = 16, 2 + 3 + 1 = 6. Natija: 66."
    },
    {
      text: "O'quvchi ingliz tilidan 36 ta, fransuz tilidan 18 ta lug'at kartochkasi tayyorladi. Jami kartochkalar nechta?",
      correctAnswer: "54",
      distractors: ["53", "55", "52"],
      explanation: "36 + 18 = 54 ta."
    },
    {
      text: "Ustun shaklida hisoblang: 67 + 24",
      correctAnswer: "91",
      distractors: ["90", "92", "89"],
      explanation: "7 + 4 = 11, 6 + 2 + 1 = 9. Natija: 91."
    },
    {
      text: "Ustun shaklida hisoblang: 48 + 45",
      correctAnswer: "93",
      distractors: ["92", "94", "91"],
      explanation: "8 + 5 = 13, 4 + 4 + 1 = 9. Natija: 93."
    },
    {
      text: "Ustun shaklida hisoblang: 35 + 47",
      correctAnswer: "82",
      distractors: ["81", "83", "80"],
      explanation: "5 + 7 = 12, 3 + 4 + 1 = 8. Natija: 82."
    },
    {
      text: "Tenglamani yeching: x - 28 = 45",
      correctAnswer: "73",
      distractors: ["72", "74", "71"],
      explanation: "x = 45 + 28 = 73."
    },
    {
      text: "Tenglamani yeching: y - 37 = 29",
      correctAnswer: "66",
      distractors: ["65", "67", "64"],
      explanation: "y = 29 + 37 = 66."
    },
    {
      text: "Taqqoslang: 37 + 25 va 60",
      correctAnswer: ">",
      distractors: ["<", "=", "+"],
      explanation: "37 + 25 = 62. 62 > 60."
    },
    {
      text: "Taqqoslang: 48 + 26 va 50 + 24",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "48 + 26 = 74 va 50 + 24 = 74. Ular teng: 74 = 74."
    },
    {
      text: "Kutubxonada 34 ta chet tili darsligi va 29 ta badiiy kitob bor. Jami kitoblar nechta?",
      correctAnswer: "63",
      distractors: ["62", "64", "61"],
      explanation: "34 + 29 = 63 ta."
    },
    {
      text: "Ustun shaklida hisoblang: 56 + 38",
      correctAnswer: "94",
      distractors: ["93", "95", "92"],
      explanation: "6 + 8 = 14, 5 + 3 + 1 = 9. Natija: 94."
    },
    {
      text: "Ustun shaklida hisoblang: 27 + 45",
      correctAnswer: "72",
      distractors: ["71", "73", "70"],
      explanation: "7 + 5 = 12, 2 + 4 + 1 = 7. Natija: 72."
    },
    {
      text: "Ustun shaklida hisoblang: 49 + 34",
      correctAnswer: "83",
      distractors: ["82", "84", "81"],
      explanation: "9 + 4 = 13, 4 + 3 + 1 = 8. Natija: 83."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: 38 + * = 64?",
      correctAnswer: "26",
      distractors: ["25", "27", "24"],
      explanation: "64 - 38 = 26."
    },
    {
      text: "Ustun shaklida hisoblang: 64 + 18",
      correctAnswer: "82",
      distractors: ["81", "83", "80"],
      explanation: "4 + 8 = 12, 6 + 1 + 1 = 8. Natija: 82."
    },
    {
      text: "Ustun shaklida hisoblang: 19 + 57",
      correctAnswer: "76",
      distractors: ["75", "77", "74"],
      explanation: "9 + 7 = 16, 1 + 5 + 1 = 7. Natija: 76."
    },
    {
      text: "Ustun shaklida hisoblang: 39 + 43",
      correctAnswer: "82",
      distractors: ["81", "83", "80"],
      explanation: "9 + 3 = 12, 3 + 4 + 1 = 8. Natija: 82."
    }
  ]
};

// ─────────────────────────────────────────────────────────────
// 32. Qo'shishning xossalari 🌳
// ─────────────────────────────────────────────────────────────
export const unit32: Grade2UnitDef = {
  order: 32,
  bookNumber: 31,
  unitType: "LESSON",
  title: "Qo‘shishning xossalari",
  emoji: "🌳",
  crossTopic: "Madaniy ekinlar",
  shortDesc: "Guruhlash va o'rin almashtirish xossalarini qo'llab qulay hisoblash",
  intro: "Bog'da olma, nok va shaftoli daraxtlari parvarishlanadi. Bir nechta sonni qo'shishda qulay sonlarni guruhlash hisoblashni osonlashtiradi: (24 + 17) + 26 = (24 + 26) + 17 = 50 + 17 = 67!",
  keyPoints: [
    "Qo'shishning guruhlash xossasi: (a + b) + c = a + (b + c).",
    "Birliklari yig'indisi 10 bo'lgan sonlarni birinchi qo'shish juda qulay.",
    "Madaniy ekinlar hosildorligini hisoblashda qulay usullardan foydalanamiz."
  ],
  miniExample: {
    emojis: "🌳 (24 + 26) + 17 = 50 + 17 = 67",
    text: "24 bilan 26 ni guruhlasak 50 bo'ladi, 50 + 17 = 67!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Qulay usulda hisoblang: 24 + 17 + 26",
      correctAnswer: "67",
      distractors: ["66", "68", "65"],
      explanation: "(24 + 26) + 17 = 50 + 17 = 67."
    },
    {
      text: "Qulay usulda hisoblang: 35 + 18 + 15",
      correctAnswer: "68",
      distractors: ["67", "69", "66"],
      explanation: "(35 + 15) + 18 = 50 + 18 = 68."
    },
    {
      text: "Bog'da 22 tup olma, 19 tup nok va 28 tup shaftoli bor. Jami daraxtlar nechta?",
      correctAnswer: "69",
      distractors: ["68", "70", "67"],
      explanation: "(22 + 28) + 19 = 50 + 19 = 69 ta."
    }
  ],
  test: [
    {
      text: "Qulay usulda hisoblang: 24 + 17 + 26",
      correctAnswer: "67",
      distractors: ["66", "68", "65"],
      explanation: "(24 + 26) + 17 = 50 + 17 = 67."
    },
    {
      text: "Qulay usulda hisoblang: 31 + 25 + 19",
      correctAnswer: "75",
      distractors: ["74", "76", "73"],
      explanation: "(31 + 19) + 25 = 50 + 25 = 75."
    },
    {
      text: "Qulay usulda hisoblang: 43 + 18 + 17",
      correctAnswer: "78",
      distractors: ["77", "79", "76"],
      explanation: "(43 + 17) + 18 = 60 + 18 = 78."
    },
    {
      text: "Qulay usulda hisoblang: 52 + 14 + 18",
      correctAnswer: "84",
      distractors: ["83", "85", "82"],
      explanation: "(52 + 18) + 14 = 70 + 14 = 84."
    },
    {
      text: "Fermer 27 qop bug'doy, 16 qop arpa va 23 qop makkajo'xori yig'di. Jami qoplar nechta?",
      correctAnswer: "66",
      distractors: ["65", "67", "64"],
      explanation: "(27 + 23) + 16 = 50 + 16 = 66 qop."
    },
    {
      text: "Qulay usulda hisoblang: 36 + 29 + 14",
      correctAnswer: "79",
      distractors: ["78", "80", "77"],
      explanation: "(36 + 14) + 29 = 50 + 29 = 79."
    },
    {
      text: "Qulay usulda hisoblang: 45 + 23 + 15",
      correctAnswer: "83",
      distractors: ["82", "84", "81"],
      explanation: "(45 + 15) + 23 = 60 + 23 = 83."
    },
    {
      text: "Qulay usulda hisoblang: 18 + 37 + 32",
      correctAnswer: "87",
      distractors: ["86", "88", "85"],
      explanation: "(18 + 32) + 37 = 50 + 37 = 87."
    },
    {
      text: "Tenglamani yeching: x - 17 = 50",
      correctAnswer: "67",
      distractors: ["66", "68", "65"],
      explanation: "x = 50 + 17 = 67."
    },
    {
      text: "Tenglamani yeching: y - 25 = 50",
      correctAnswer: "75",
      distractors: ["74", "76", "73"],
      explanation: "y = 50 + 25 = 75."
    },
    {
      text: "Taqqoslang: (24 + 26) + 15 va 65",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "(24 + 26) + 15 = 50 + 15 = 65. Ular teng: 65 = 65."
    },
    {
      text: "Taqqoslang: 32 + 18 + 14 va 65",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "32 + 18 + 14 = 50 + 14 = 64. 64 < 65."
    },
    {
      text: "Issiqxonada 16 tup pomidor, 24 tup bodring va 35 tup qalampir ko'chatlari bor. Jami nechta?",
      correctAnswer: "75",
      distractors: ["74", "76", "73"],
      explanation: "(16 + 24) + 35 = 40 + 35 = 75 ta."
    },
    {
      text: "Qulay usulda hisoblang: 28 + 33 + 12",
      correctAnswer: "73",
      distractors: ["72", "74", "71"],
      explanation: "(28 + 12) + 33 = 40 + 33 = 73."
    },
    {
      text: "Qulay usulda hisoblang: 41 + 19 + 27",
      correctAnswer: "87",
      distractors: ["86", "88", "85"],
      explanation: "(41 + 19) + 27 = 60 + 27 = 87."
    },
    {
      text: "Qulay usulda hisoblang: 34 + 26 + 28",
      correctAnswer: "88",
      distractors: ["87", "89", "86"],
      explanation: "(34 + 26) + 28 = 60 + 28 = 88."
    },
    {
      text: "Qaysi xossaga ko'ra (a + b) + c = a + (b + c) tenglik to'g'ri?",
      correctAnswer: "Guruhlash xossasi",
      distractors: ["Ayirish xossasi", "Ko'paytirish xossasi", "Taqsimot qonuni"],
      explanation: "Qo'shishning guruhlash xossasiga ko'ra qo'shiluvchilarni qulay guruhlash mumkin."
    },
    {
      text: "Qulay usulda hisoblang: 23 + 45 + 17",
      correctAnswer: "85",
      distractors: ["84", "86", "83"],
      explanation: "(23 + 17) + 45 = 40 + 45 = 85."
    },
    {
      text: "Qulay usulda hisoblang: 15 + 48 + 25",
      correctAnswer: "88",
      distractors: ["87", "89", "86"],
      explanation: "(15 + 25) + 48 = 40 + 48 = 88."
    },
    {
      text: "Qulay usulda hisoblang: 39 + 24 + 11",
      correctAnswer: "74",
      distractors: ["73", "75", "72"],
      explanation: "(39 + 11) + 24 = 50 + 24 = 74."
    }
  ]
};

// ─────────────────────────────────────────────────────────────
// 33. Ustun ko'rinishida ayirish 🛎️
// ─────────────────────────────────────────────────────────────
export const unit33: Grade2UnitDef = {
  order: 33,
  bookNumber: 32,
  unitType: "LESSON",
  title: "Ustun ko‘rinishida ayirish",
  emoji: "🛎️",
  crossTopic: "Zamonaviy xizmatlar",
  shortDesc: "Xonadan o'tib ustun shaklida ayirish usuli",
  intro: "Zamonaviy xizmatlar va yetkazib berish xizmatlari hisob-kitobni daqiqalarda amalga oshiradi. Ustun shaklida xonadan o'tib ayirishda o'nlikdan 1 ta o'nlik maydalanadi!",
  keyPoints: [
    "Birlikdan birlikni ayirishning iloji bo'lmasa, qo'shni o'nlikdan 1 o'nlik (10 birlik) olinadi.",
    "Olingan 10 birlikka mavjud birlik qo'shiladi va ayiriladi.",
    "O'nliklar xonasidagi son 1 taga kamayadi."
  ],
  miniExample: {
    emojis: "🛎️ 52 - 27 = 25",
    text: "2 dan 7 chiqmaydi: 12 - 7 = 5, 5 o'nlikdan 1 ketgach 4 qoladi, 4 - 2 = 2. Natija: 25!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Ustun shaklida hisoblang: 52 - 27",
      correctAnswer: "25",
      distractors: ["24", "26", "23"],
      explanation: "12 - 7 = 5, 4 - 2 = 2. Natija: 25."
    },
    {
      text: "Ustun shaklida hisoblang: 64 - 38",
      correctAnswer: "26",
      distractors: ["25", "27", "24"],
      explanation: "14 - 8 = 6, 5 - 3 = 2. Natija: 26."
    },
    {
      text: "Kuryerda 45 ta buyurtma bor edi. 28 tasi yetkazildi. Nechta buyurtma qoldi?",
      correctAnswer: "17",
      distractors: ["16", "18", "15"],
      explanation: "45 - 28 = 17 ta buyurtma."
    }
  ],
  test: [
    {
      text: "Ustun shaklida hisoblang: 52 - 27",
      correctAnswer: "25",
      distractors: ["24", "26", "23"],
      explanation: "12 - 7 = 5, 4 - 2 = 2. Natija: 25."
    },
    {
      text: "Ustun shaklida hisoblang: 63 - 35",
      correctAnswer: "28",
      distractors: ["27", "29", "26"],
      explanation: "13 - 5 = 8, 5 - 3 = 2. Natija: 28."
    },
    {
      text: "Ustun shaklida hisoblang: 71 - 44",
      correctAnswer: "27",
      distractors: ["26", "28", "25"],
      explanation: "11 - 4 = 7, 6 - 4 = 2. Natija: 27."
    },
    {
      text: "Ustun shaklida hisoblang: 84 - 56",
      correctAnswer: "28",
      distractors: ["27", "29", "26"],
      explanation: "14 - 6 = 8, 7 - 5 = 2. Natija: 28."
    },
    {
      text: "Mehmonxonada 50 ta xonadan 26 tasi band bo'ldi. Bo'sh xonalar nechta?",
      correctAnswer: "24",
      distractors: ["23", "25", "22"],
      explanation: "50 - 26 = 24 ta bo'sh xona."
    },
    {
      text: "Ustun shaklida hisoblang: 93 - 67",
      correctAnswer: "26",
      distractors: ["25", "27", "24"],
      explanation: "13 - 7 = 6, 8 - 6 = 2. Natija: 26."
    },
    {
      text: "Ustun shaklida hisoblang: 75 - 48",
      correctAnswer: "27",
      distractors: ["26", "28", "25"],
      explanation: "15 - 8 = 7, 6 - 4 = 2. Natija: 27."
    },
    {
      text: "Ustun shaklida hisoblang: 62 - 39",
      correctAnswer: "23",
      distractors: ["22", "24", "21"],
      explanation: "12 - 9 = 3, 5 - 3 = 2. Natija: 23."
    },
    {
      text: "Tenglamani yeching: x + 27 = 52",
      correctAnswer: "25",
      distractors: ["24", "26", "23"],
      explanation: "x = 52 - 27 = 25."
    },
    {
      text: "Tenglamani yeching: y + 38 = 64",
      correctAnswer: "26",
      distractors: ["25", "27", "24"],
      explanation: "y = 64 - 38 = 26."
    },
    {
      text: "Taqqoslang: 52 - 27 va 25",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "52 - 27 = 25. Ular teng: 25 = 25."
    },
    {
      text: "Taqqoslang: 64 - 38 va 30",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "64 - 38 = 26. 26 < 30."
    },
    {
      text: "Avtoservisga 43 ta mashina keldi. 17 tasi ta'mirdan chiqdi. Nechtasi qoldi?",
      correctAnswer: "26",
      distractors: ["25", "27", "24"],
      explanation: "43 - 17 = 26 ta mashina."
    },
    {
      text: "Ustun shaklida hisoblang: 81 - 53",
      correctAnswer: "28",
      distractors: ["27", "29", "26"],
      explanation: "11 - 3 = 8, 7 - 5 = 2. Natija: 28."
    },
    {
      text: "Ustun shaklida hisoblang: 95 - 68",
      correctAnswer: "27",
      distractors: ["26", "28", "25"],
      explanation: "15 - 8 = 7, 8 - 6 = 2. Natija: 27."
    },
    {
      text: "Ustun shaklida hisoblang: 54 - 29",
      correctAnswer: "25",
      distractors: ["24", "26", "23"],
      explanation: "14 - 9 = 5, 4 - 2 = 2. Natija: 25."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: 73 - * = 48?",
      correctAnswer: "25",
      distractors: ["24", "26", "23"],
      explanation: "73 - 48 = 25."
    },
    {
      text: "Ustun shaklida hisoblang: 82 - 47",
      correctAnswer: "35",
      distractors: ["34", "36", "33"],
      explanation: "12 - 7 = 5, 7 - 4 = 3. Natija: 35."
    },
    {
      text: "Ustun shaklida hisoblang: 66 - 38",
      correctAnswer: "28",
      distractors: ["27", "29", "26"],
      explanation: "16 - 8 = 8, 5 - 3 = 2. Natija: 28."
    },
    {
      text: "Ustun shaklida hisoblang: 91 - 45",
      correctAnswer: "46",
      distractors: ["45", "47", "44"],
      explanation: "11 - 5 = 6, 8 - 4 = 4. Natija: 46."
    }
  ]
};

// ─────────────────────────────────────────────────────────────
// 34. Og'zaki hisoblash usullari 🧠
// ─────────────────────────────────────────────────────────────
export const unit34: Grade2UnitDef = {
  order: 34,
  bookNumber: 33,
  unitType: "LESSON",
  title: "Og‘zaki hisoblash usullari",
  emoji: "🧠",
  crossTopic: "Transport",
  shortDesc: "Og'zaki tez hisoblash usullari va Rim raqamlari bilan amallar",
  intro: "Transport harakatida tezkor qaror qabul qilish juda muhim. Og'zaki hisoblash va Rim raqamlarida amallarni bajarish aql charxidir!",
  keyPoints: [
    "Sonlarni yaxlit o'nlikka yaqinlashtirib og'zaki hisoblash.",
    "Rim raqamlari: I=1, V=5, X=10, L=50, C=100.",
    "Rim raqamlarida amallar: XI + V = XVI (11 + 5 = 16), XVIII + XVIII = XXXVI (18 + 18 = 36), XXXIII - XIV = XIX (33 - 14 = 19), XXVII - XIV = XIII (27 - 14 = 13)."
  ],
  miniExample: {
    emojis: "🧠 XI + V = XVI | XXXIII - XIV = XIX",
    text: "11 + 5 = 16 (XVI) va 33 - 14 = 19 (XIX)!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Rim raqamlarida hisoblang: XI + V",
      correctAnswer: "XVI",
      distractors: ["XV", "XVII", "XIV"],
      explanation: "XI = 11, V = 5; 11 + 5 = 16 (XVI)."
    },
    {
      text: "Rim raqamlarida hisoblang: XXVII - XIV",
      correctAnswer: "XIII",
      distractors: ["XII", "XIV", "XI"],
      explanation: "XXVII = 27, XIV = 14; 27 - 14 = 13 (XIII)."
    },
    {
      text: "Og'zaki hisoblang: 39 + 25",
      correctAnswer: "64",
      distractors: ["63", "65", "62"],
      explanation: "39 + 1 = 40, 40 + 24 = 64."
    }
  ],
  test: [
    {
      text: "Rim raqamlarida hisoblang: XI + V",
      correctAnswer: "XVI",
      distractors: ["XV", "XVII", "XIV"],
      explanation: "11 + 5 = 16 (XVI)."
    },
    {
      text: "Rim raqamlarida hisoblang: XVIII + XVIII",
      correctAnswer: "XXXVI",
      distractors: ["XXXV", "XXXVII", "XXXIV"],
      explanation: "18 + 18 = 36 (XXXVI)."
    },
    {
      text: "Rim raqamlarida hisoblang: XXXIII - XIV",
      correctAnswer: "XIX",
      distractors: ["XVIII", "XX", "XVII"],
      explanation: "33 - 14 = 19 (XIX)."
    },
    {
      text: "Rim raqamlarida hisoblang: XXVII - XIV",
      correctAnswer: "XIII",
      distractors: ["XII", "XIV", "XI"],
      explanation: "27 - 14 = 13 (XIII)."
    },
    {
      text: "Og'zaki hisoblang: 49 + 35",
      correctAnswer: "84",
      distractors: ["83", "85", "82"],
      explanation: "49 + 1 = 50, 50 + 34 = 84."
    },
    {
      text: "Og'zaki hisoblang: 60 - 28",
      correctAnswer: "32",
      distractors: ["31", "33", "30"],
      explanation: "60 - 20 = 40, 40 - 8 = 32."
    },
    {
      text: "Rim raqamlarida hisoblang: XV + XV",
      correctAnswer: "XXX",
      distractors: ["XXV", "XXXV", "XX"],
      explanation: "15 + 15 = 30 (XXX)."
    },
    {
      text: "Rim raqamlarida hisoblang: XXV - XI",
      correctAnswer: "XIV",
      distractors: ["XIII", "XV", "XII"],
      explanation: "25 - 11 = 14 (XIV)."
    },
    {
      text: "Tenglamani yeching: x + 19 = 50",
      correctAnswer: "31",
      distractors: ["30", "32", "29"],
      explanation: "x = 50 - 19 = 31."
    },
    {
      text: "Tenglamani yeching: 70 - y = 34",
      correctAnswer: "36",
      distractors: ["35", "37", "34"],
      explanation: "y = 70 - 34 = 36."
    },
    {
      text: "Taqqoslang: XI + V va XVI",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "XI + V = 16 va XVI = 16. Ular teng: XVI = XVI."
    },
    {
      text: "Taqqoslang: XXVII - XIV va XV",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "XXVII - XIV = 13 (XIII). 13 < 15."
    },
    {
      text: "Avtobus 1-bekatdan 29 yo'lovchi, 2-bekatdan 18 yo'lovchi oldi. Jami nechta yo'lovchi bo'ldi?",
      correctAnswer: "47",
      distractors: ["46", "48", "45"],
      explanation: "29 + 18 = 47 nafar."
    },
    {
      text: "Og'zaki hisoblang: 58 + 26",
      correctAnswer: "84",
      distractors: ["83", "85", "82"],
      explanation: "58 + 2 = 60, 60 + 24 = 84."
    },
    {
      text: "Og'zaki hisoblang: 80 - 43",
      correctAnswer: "37",
      distractors: ["36", "38", "35"],
      explanation: "80 - 40 = 40, 40 - 3 = 37."
    },
    {
      text: "Rim raqamlarida hisoblang: XII + VIII",
      correctAnswer: "XX",
      distractors: ["XIX", "XXI", "XVIII"],
      explanation: "12 + 8 = 20 (XX)."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: 44 + * = 70?",
      correctAnswer: "26",
      distractors: ["25", "27", "24"],
      explanation: "70 - 44 = 26."
    },
    {
      text: "Og'zaki hisoblang: 67 + 19",
      correctAnswer: "86",
      distractors: ["85", "87", "84"],
      explanation: "67 + 20 - 1 = 86."
    },
    {
      text: "Rim raqamlarida hisoblang: XL - X",
      correctAnswer: "XXX",
      distractors: ["XX", "XXXV", "L"],
      explanation: "40 - 10 = 30 (XXX)."
    },
    {
      text: "Og'zaki hisoblang: 90 - 56",
      correctAnswer: "34",
      distractors: ["33", "35", "32"],
      explanation: "90 - 50 = 40, 40 - 6 = 34."
    }
  ]
};

const allUnits = [unit28, unit29, unit30, unit31, unit32, unit33, unit34];

for (const u of allUnits) {
  const seed = buildGrade2UnitSeed(u);
  saveGrade2UnitFile(u.order, seed);
  console.log(`✅ Saved Grade 2 unit-${u.order < 10 ? '0' + u.order : u.order}.json`);
}
