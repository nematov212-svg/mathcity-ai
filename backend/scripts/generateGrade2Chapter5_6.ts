import { Grade2UnitDef, buildGrade2UnitSeed, saveGrade2UnitFile } from './generatorTypes';

console.log("Generating Grade 2 Part 1 Chapter V & VI (order 35-44)...");

// ─────────────────────────────────────────────────────────────
// 35. Yig'indidan sonni ayirish ✈️
// ─────────────────────────────────────────────────────────────
export const unit35: Grade2UnitDef = {
  order: 35,
  bookNumber: 34,
  unitType: "LESSON",
  title: "Yig‘indidan sonni ayirish",
  emoji: "✈️",
  crossTopic: "Uchuvchi vositalar",
  shortDesc: "Yig'indidan sonni qulay usulda ayirish: (a + b) - c qoidasi",
  intro: "Samolyotlar va vertolyotlar havoda marshrutlarni qisqa yo'llar orqali tanlaydi. Matematikada ham (35 + 24) - 15 ifodasini avval 35 dan 15 ni ayirib, so'ngra 24 ni qo'shish qulay: 20 + 24 = 44!",
  keyPoints: [
    "Qoida: Yig'indidan sonni ayirishda shu sonni qo'shiluvchilarning biridan ayirib, natijaga ikkinchisini qo'shish mumkin.",
    "(a + b) - c = (a - c) + b (agar a >= c bo'lsa).",
    "(a + b) - c = a + (b - c) (agar b >= c bo'lsa)."
  ],
  miniExample: {
    emojis: "✈️ (35 + 24) - 15 = (35 - 15) + 24 = 44",
    text: "35 dan 15 ni ayirsak 20 qoladi, 20 ga 24 ni qo'shsak 44 samolyot!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Qulay usulda hisoblang: (35 + 24) - 15",
      correctAnswer: "44",
      distractors: ["43", "45", "42"],
      explanation: "(35 - 15) + 24 = 20 + 24 = 44."
    },
    {
      text: "Qulay usulda hisoblang: (48 + 26) - 18",
      correctAnswer: "56",
      distractors: ["55", "57", "54"],
      explanation: "(48 - 18) + 26 = 30 + 26 = 56."
    },
    {
      text: "Aerodromda 28 ta yo'lovchi va 15 ta yuk samolyoti bor edi. 8 ta samolyot havoga ko'tarildi. Qancha samolyot qoldi?",
      correctAnswer: "35",
      distractors: ["34", "36", "33"],
      explanation: "(28 - 8) + 15 = 20 + 15 = 35 ta."
    }
  ],
  test: [
    {
      text: "Qulay usulda hisoblang: (35 + 24) - 15",
      correctAnswer: "44",
      distractors: ["43", "45", "42"],
      explanation: "(35 - 15) + 24 = 20 + 24 = 44."
    },
    {
      text: "Qulay usulda hisoblang: (48 + 26) - 18",
      correctAnswer: "56",
      distractors: ["55", "57", "54"],
      explanation: "(48 - 18) + 26 = 30 + 26 = 56."
    },
    {
      text: "Qulay usulda hisoblang: (57 + 19) - 17",
      correctAnswer: "59",
      distractors: ["58", "60", "57"],
      explanation: "(57 - 17) + 19 = 40 + 19 = 59."
    },
    {
      text: "Qulay usulda hisoblang: (64 + 23) - 14",
      correctAnswer: "73",
      distractors: ["72", "74", "71"],
      explanation: "(64 - 14) + 23 = 50 + 23 = 73."
    },
    {
      text: "Aeroportda 36 ta samolyot va 14 ta vertolyot bor edi. 16 ta havo vositasi uchib ketdi. Nechtasi qoldi?",
      correctAnswer: "34",
      distractors: ["33", "35", "32"],
      explanation: "36 + 14 = 50, 50 - 16 = 34 ta."
    },
    {
      text: "Qulay usulda hisoblang: (72 + 15) - 22",
      correctAnswer: "65",
      distractors: ["64", "66", "63"],
      explanation: "(72 - 22) + 15 = 50 + 15 = 65."
    },
    {
      text: "Qulay usulda hisoblang: (43 + 38) - 18",
      correctAnswer: "63",
      distractors: ["62", "64", "61"],
      explanation: "43 + (38 - 18) = 43 + 20 = 63."
    },
    {
      text: "Qulay usulda hisoblang: (56 + 27) - 16",
      correctAnswer: "67",
      distractors: ["66", "68", "65"],
      explanation: "(56 - 16) + 27 = 40 + 27 = 67."
    },
    {
      text: "Tenglamani yeching: x + 15 = 59",
      correctAnswer: "44",
      distractors: ["43", "45", "42"],
      explanation: "x = 59 - 15 = 44."
    },
    {
      text: "Tenglamani yeching: y + 18 = 74",
      correctAnswer: "56",
      distractors: ["55", "57", "54"],
      explanation: "y = 74 - 18 = 56."
    },
    {
      text: "Taqqoslang: (35 + 24) - 15 va 44",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "(35 + 24) - 15 = 44. Ular teng: 44 = 44."
    },
    {
      text: "Taqqoslang: (48 + 26) - 18 va 60",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "(48 + 26) - 18 = 56. 56 < 60."
    },
    {
      text: "Dronlar maydonchasida 25 ta oq va 18 ta qora dron bor edi. 15 ta dron parvoz qildi. Nechta dron qoldi?",
      correctAnswer: "28",
      distractors: ["27", "29", "26"],
      explanation: "(25 - 15) + 18 = 10 + 18 = 28 ta."
    },
    {
      text: "Qulay usulda hisoblang: (84 + 12) - 34",
      correctAnswer: "62",
      distractors: ["61", "63", "60"],
      explanation: "(84 - 34) + 12 = 50 + 12 = 62."
    },
    {
      text: "Qulay usulda hisoblang: (63 + 29) - 19",
      correctAnswer: "73",
      distractors: ["72", "74", "71"],
      explanation: "63 + (29 - 19) = 63 + 10 = 73."
    },
    {
      text: "Qulay usulda hisoblang: (51 + 36) - 21",
      correctAnswer: "66",
      distractors: ["65", "67", "64"],
      explanation: "(51 - 21) + 36 = 30 + 36 = 66."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: (45 + 20) - * = 50?",
      correctAnswer: "15",
      distractors: ["14", "16", "13"],
      explanation: "65 - 50 = 15."
    },
    {
      text: "Qulay usulda hisoblang: (76 + 18) - 26",
      correctAnswer: "68",
      distractors: ["67", "69", "66"],
      explanation: "(76 - 26) + 18 = 50 + 18 = 68."
    },
    {
      text: "Qulay usulda hisoblang: (39 + 45) - 25",
      correctAnswer: "59",
      distractors: ["58", "60", "57"],
      explanation: "39 + (45 - 25) = 39 + 20 = 59."
    },
    {
      text: "Qulay usulda hisoblang: (68 + 27) - 38",
      correctAnswer: "57",
      distractors: ["56", "58", "55"],
      explanation: "(68 - 38) + 27 = 30 + 27 = 57."
    }
  ]
};

// ─────────────────────────────────────────────────────────────
// 36. Yig'indidan sonni ayirish 🐮
// ─────────────────────────────────────────────────────────────
export const unit36: Grade2UnitDef = {
  order: 36,
  bookNumber: 35,
  unitType: "LESSON",
  title: "Yig‘indidan sonni ayirish",
  emoji: "🐮",
  crossTopic: "Uy hayvonlari",
  shortDesc: "Yig'indidan sonni ayirish usulini mustahkamlash va ferma masalalari",
  intro: "Fermada sigirlar, qo'ylar va otlar boqiladi. Hayvonlar soni bo'yicha masalalarni yechishda (42 + 28) - 18 kabi ifodalarni qulay ayirish usuli bilan hisoblaymiz: 42 + (28 - 18) = 42 + 10 = 52!",
  keyPoints: [
    "Qaysi qo'shiluvchidan ayirish oson bo'lsa, o'shandan ayirish qulay.",
    "28 dan 18 ni ayirsa 10 qoladi, 42 ga 10 ni qo'shish juda oson.",
    "Uy hayvonlari parvarishi va mahsulotlar hisob-kitobida tezkor usullar."
  ],
  miniExample: {
    emojis: "🐮 (42 + 28) - 18 = 42 + 10 = 52",
    text: "28 dan 18 ni ayirsak 10 qoladi, 42 ga 10 ni qo'shsak 52 ta hayvon!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Qulay usulda hisoblang: (42 + 28) - 18",
      correctAnswer: "52",
      distractors: ["51", "53", "50"],
      explanation: "42 + (28 - 18) = 42 + 10 = 52."
    },
    {
      text: "Qulay usulda hisoblang: (53 + 37) - 23",
      correctAnswer: "67",
      distractors: ["66", "68", "65"],
      explanation: "(53 - 23) + 37 = 30 + 37 = 67."
    },
    {
      text: "Fermada 34 ta buzoq va 26 ta qo'zichoq bor edi. 14 ta hayvon ko'chaga chiqarildi. Nechtasi qoldi?",
      correctAnswer: "46",
      distractors: ["45", "47", "44"],
      explanation: "(34 - 14) + 26 = 20 + 26 = 46 ta."
    }
  ],
  test: [
    {
      text: "Qulay usulda hisoblang: (42 + 28) - 18",
      correctAnswer: "52",
      distractors: ["51", "53", "50"],
      explanation: "42 + (28 - 18) = 42 + 10 = 52."
    },
    {
      text: "Qulay usulda hisoblang: (53 + 37) - 23",
      correctAnswer: "67",
      distractors: ["66", "68", "65"],
      explanation: "(53 - 23) + 37 = 30 + 37 = 67."
    },
    {
      text: "Qulay usulda hisoblang: (64 + 25) - 34",
      correctAnswer: "55",
      distractors: ["54", "56", "53"],
      explanation: "(64 - 34) + 25 = 30 + 25 = 55."
    },
    {
      text: "Qulay usulda hisoblang: (38 + 46) - 26",
      correctAnswer: "58",
      distractors: ["57", "59", "56"],
      explanation: "38 + (46 - 26) = 38 + 20 = 58."
    },
    {
      text: "Fermada 45 ta oq qo'y va 28 ta qora qo'y bor edi. 18 ta qo'y yaylovga haydaldi. Qo'rada nechtasi qoldi?",
      correctAnswer: "55",
      distractors: ["54", "56", "53"],
      explanation: "45 + (28 - 18) = 45 + 10 = 55 ta."
    },
    {
      text: "Qulay usulda hisoblang: (75 + 18) - 35",
      correctAnswer: "58",
      distractors: ["57", "59", "56"],
      explanation: "(75 - 35) + 18 = 40 + 18 = 58."
    },
    {
      text: "Qulay usulda hisoblang: (49 + 33) - 23",
      correctAnswer: "59",
      distractors: ["58", "60", "57"],
      explanation: "49 + (33 - 23) = 49 + 10 = 59."
    },
    {
      text: "Qulay usulda hisoblang: (61 + 29) - 19",
      correctAnswer: "71",
      distractors: ["70", "72", "69"],
      explanation: "61 + (29 - 19) = 61 + 10 = 71."
    },
    {
      text: "Tenglamani yeching: a + 18 = 70",
      correctAnswer: "52",
      distractors: ["51", "53", "50"],
      explanation: "a = 70 - 18 = 52."
    },
    {
      text: "Tenglamani yeching: b + 23 = 90",
      correctAnswer: "67",
      distractors: ["66", "68", "65"],
      explanation: "b = 90 - 23 = 67."
    },
    {
      text: "Taqqoslang: (42 + 28) - 18 va 50",
      correctAnswer: ">",
      distractors: ["<", "=", "+"],
      explanation: "(42 + 28) - 18 = 52. 52 > 50."
    },
    {
      text: "Taqqoslang: (53 + 37) - 23 va 70",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "(53 + 37) - 23 = 67. 67 < 70."
    },
    {
      text: "Tovuqxonada 32 ta oq tovuq va 25 ta qizil tovuq bor edi. 12 ta tovuq sotildi. Nechtasi qoldi?",
      correctAnswer: "45",
      distractors: ["44", "46", "43"],
      explanation: "(32 - 12) + 25 = 20 + 25 = 45 ta."
    },
    {
      text: "Qulay usulda hisoblang: (86 + 13) - 46",
      correctAnswer: "53",
      distractors: ["52", "54", "51"],
      explanation: "(86 - 46) + 13 = 40 + 13 = 53."
    },
    {
      text: "Qulay usulda hisoblang: (57 + 34) - 24",
      correctAnswer: "67",
      distractors: ["66", "68", "65"],
      explanation: "57 + (34 - 24) = 57 + 10 = 67."
    },
    {
      text: "Qulay usulda hisoblang: (68 + 22) - 38",
      correctAnswer: "52",
      distractors: ["51", "53", "50"],
      explanation: "(68 - 38) + 22 = 30 + 22 = 52."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: (50 + 35) - * = 65?",
      correctAnswer: "20",
      distractors: ["19", "21", "18"],
      explanation: "85 - 65 = 20."
    },
    {
      text: "Qulay usulda hisoblang: (79 + 16) - 39",
      correctAnswer: "56",
      distractors: ["55", "57", "54"],
      explanation: "(79 - 39) + 16 = 40 + 16 = 56."
    },
    {
      text: "Qulay usulda hisoblang: (44 + 38) - 18",
      correctAnswer: "64",
      distractors: ["63", "65", "62"],
      explanation: "44 + (38 - 18) = 44 + 20 = 64."
    },
    {
      text: "Qulay usulda hisoblang: (58 + 25) - 28",
      correctAnswer: "55",
      distractors: ["54", "56", "53"],
      explanation: "(58 - 28) + 25 = 30 + 25 = 55."
    }
  ]
};

// ─────────────────────────────────────────────────────────────
// 37. Sondan yig'indini ayirish 🖥️
// ─────────────────────────────────────────────────────────────
export const unit37: Grade2UnitDef = {
  order: 37,
  bookNumber: 36,
  unitType: "LESSON",
  title: "Sondan yig‘indini ayirish",
  emoji: "🖥️",
  crossTopic: "Gadjetlar",
  shortDesc: "Sondan yig'indini qulay usulda ayirish: a - (b + c) qoidasi",
  intro: "Kompyuter dasturlarida murakkab amallar bosqichma-bosqich bajariladi. Sondan yig'indini ayirishda ham sonlarni ketma-ket ayirib borish qulay: 65 - (25 + 18) = (65 - 25) - 18 = 40 - 18 = 22!",
  keyPoints: [
    "Qoida: Sondan yig'indini ayirish uchun shu sondan avval birinchi qo'shiluvchini, so'ng ikkinchisini ayirish mumkin.",
    "a - (b + c) = (a - b) - c = (a - c) - b.",
    "Yaxlit son hosil bo'ladigan tartibda ayirish juda qulay."
  ],
  miniExample: {
    emojis: "🖥️ 65 - (25 + 18) = (65 - 25) - 18 = 22",
    text: "65 dan 25 ni ayirsak 40, 40 dan 18 ni ayirsak 22 qoladi!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Qulay usulda hisoblang: 65 - (25 + 18)",
      correctAnswer: "22",
      distractors: ["21", "23", "20"],
      explanation: "65 - 25 = 40, 40 - 18 = 22."
    },
    {
      text: "Qulay usulda hisoblang: 74 - (34 + 17)",
      correctAnswer: "23",
      distractors: ["22", "24", "21"],
      explanation: "74 - 34 = 40, 40 - 17 = 23."
    },
    {
      text: "Do'konda 50 ta planshet bor edi. Ertalab 15 ta, tushdan keyin 12 ta sotildi. Nechta qoldi?",
      correctAnswer: "23",
      distractors: ["22", "24", "21"],
      explanation: "50 - (15 + 12) = 50 - 27 = 23 ta planshet."
    }
  ],
  test: [
    {
      text: "Qulay usulda hisoblang: 65 - (25 + 18)",
      correctAnswer: "22",
      distractors: ["21", "23", "20"],
      explanation: "65 - 25 = 40, 40 - 18 = 22."
    },
    {
      text: "Qulay usulda hisoblang: 74 - (34 + 17)",
      correctAnswer: "23",
      distractors: ["22", "24", "21"],
      explanation: "74 - 34 = 40, 40 - 17 = 23."
    },
    {
      text: "Qulay usulda hisoblang: 86 - (26 + 25)",
      correctAnswer: "35",
      distractors: ["34", "36", "33"],
      explanation: "86 - 26 = 60, 60 - 25 = 35."
    },
    {
      text: "Qulay usulda hisoblang: 93 - (43 + 28)",
      correctAnswer: "22",
      distractors: ["21", "23", "20"],
      explanation: "93 - 43 = 50, 50 - 28 = 22."
    },
    {
      text: "Do'konga 80 ta fleshka keltirildi. Birinchi kuni 25 ta, ikkinchi kuni 20 ta sotildi. Nechtasi qoldi?",
      correctAnswer: "35",
      distractors: ["34", "36", "33"],
      explanation: "80 - (25 + 20) = 80 - 45 = 35 ta."
    },
    {
      text: "Qulay usulda hisoblang: 58 - (18 + 16)",
      correctAnswer: "24",
      distractors: ["23", "25", "22"],
      explanation: "58 - 18 = 40, 40 - 16 = 24."
    },
    {
      text: "Qulay usulda hisoblang: 67 - (27 + 19)",
      correctAnswer: "21",
      distractors: ["20", "22", "19"],
      explanation: "67 - 27 = 40, 40 - 19 = 21."
    },
    {
      text: "Qulay usulda hisoblang: 75 - (35 + 24)",
      correctAnswer: "16",
      distractors: ["15", "17", "14"],
      explanation: "75 - 35 = 40, 40 - 24 = 16."
    },
    {
      text: "Tenglamani yeching: x + 43 = 65",
      correctAnswer: "22",
      distractors: ["21", "23", "20"],
      explanation: "x = 65 - 43 = 22."
    },
    {
      text: "Tenglamani yeching: y + 51 = 74",
      correctAnswer: "23",
      distractors: ["22", "24", "21"],
      explanation: "y = 74 - 51 = 23."
    },
    {
      text: "Taqqoslang: 65 - (25 + 18) va 22",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "65 - (25 + 18) = 22. Ular teng: 22 = 22."
    },
    {
      text: "Taqqoslang: 74 - (34 + 17) va 25",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "74 - (34 + 17) = 23. 23 < 25."
    },
    {
      text: "Kutubxonada 70 ta axborot texnologiyalari kitobi bor edi. 18 ta darslik va 22 ta qo'llanma olindi. Nechtasi qoldi?",
      correctAnswer: "30",
      distractors: ["29", "31", "28"],
      explanation: "70 - (18 + 22) = 70 - 40 = 30 ta."
    },
    {
      text: "Qulay usulda hisoblang: 82 - (32 + 27)",
      correctAnswer: "23",
      distractors: ["22", "24", "21"],
      explanation: "82 - 32 = 50, 50 - 27 = 23."
    },
    {
      text: "Qulay usulda hisoblang: 94 - (44 + 36)",
      correctAnswer: "14",
      distractors: ["13", "15", "12"],
      explanation: "94 - 44 = 50, 50 - 36 = 14."
    },
    {
      text: "Qulay usulda hisoblang: 62 - (22 + 15)",
      correctAnswer: "25",
      distractors: ["24", "26", "23"],
      explanation: "62 - 22 = 40, 40 - 15 = 25."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: 60 - (* + 15) = 25?",
      correctAnswer: "20",
      distractors: ["19", "21", "18"],
      explanation: "60 - 25 = 35, 35 - 15 = 20."
    },
    {
      text: "Qulay usulda hisoblang: 88 - (38 + 29)",
      correctAnswer: "21",
      distractors: ["20", "22", "19"],
      explanation: "88 - 38 = 50, 50 - 29 = 21."
    },
    {
      text: "Qulay usulda hisoblang: 56 - (16 + 23)",
      correctAnswer: "17",
      distractors: ["16", "18", "15"],
      explanation: "56 - 16 = 40, 40 - 23 = 17."
    },
    {
      text: "Qulay usulda hisoblang: 79 - (29 + 32)",
      correctAnswer: "18",
      distractors: ["17", "19", "16"],
      explanation: "79 - 29 = 50, 50 - 32 = 18."
    }
  ]
};

// ─────────────────────────────────────────────────────────────
// 38. Sondan yig'indini ayirish 🎓
// ─────────────────────────────────────────────────────────────
export const unit38: Grade2UnitDef = {
  order: 38,
  bookNumber: 37,
  unitType: "LESSON",
  title: "Sondan yig‘indini ayirish",
  emoji: "🎓",
  crossTopic: "Ta'lim",
  shortDesc: "Sondan yig'indini ayirishni mustahkamlash va ta'lim masalalari",
  intro: "Ta'lim olish kelajak poydevoridir. O'quv qurollari, darslar va topshiriqlarni hisoblashda 70 - (30 + 14) kabi ifodalarni og'zaki va qulay usulda yechishni mustahkamlaymiz: (70 - 30) - 14 = 40 - 14 = 26!",
  keyPoints: [
    "Ketma-ket ayirish hisoblashni osonlashtiradi.",
    "70 dan avval 30 ayirilib 40 olinadi, so'ngra 40 dan 14 ayirilib 26 hosil bo'ladi.",
    "Daftarlar, kitoblar va o'quv qurollari masalalarida qulay qo'llaniladi."
  ],
  miniExample: {
    emojis: "🎓 70 - (30 + 14) = 40 - 14 = 26",
    text: "70 dan 30 ni ayirsak 40, 40 dan 14 ni ayirsak 26 daftar qoladi!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Qulay usulda hisoblang: 70 - (30 + 14)",
      correctAnswer: "26",
      distractors: ["25", "27", "24"],
      explanation: "70 - 30 = 40, 40 - 14 = 26."
    },
    {
      text: "Qulay usulda hisoblang: 80 - (40 + 23)",
      correctAnswer: "17",
      distractors: ["16", "18", "15"],
      explanation: "80 - 40 = 40, 40 - 23 = 17."
    },
    {
      text: "Maktab kutubxonasiga 90 ta yangi daftar keltirildi. 1-sinfga 30 ta, 2-sinfga 28 ta berildi. Qancha qoldi?",
      correctAnswer: "32",
      distractors: ["31", "33", "30"],
      explanation: "90 - (30 + 28) = 60 - 28 = 32 ta."
    }
  ],
  test: [
    {
      text: "Qulay usulda hisoblang: 70 - (30 + 14)",
      correctAnswer: "26",
      distractors: ["25", "27", "24"],
      explanation: "70 - 30 = 40, 40 - 14 = 26."
    },
    {
      text: "Qulay usulda hisoblang: 80 - (40 + 23)",
      correctAnswer: "17",
      distractors: ["16", "18", "15"],
      explanation: "80 - 40 = 40, 40 - 23 = 17."
    },
    {
      text: "Qulay usulda hisoblang: 60 - (20 + 15)",
      correctAnswer: "25",
      distractors: ["24", "26", "23"],
      explanation: "60 - 20 = 40, 40 - 15 = 25."
    },
    {
      text: "Qulay usulda hisoblang: 90 - (50 + 26)",
      correctAnswer: "14",
      distractors: ["13", "15", "12"],
      explanation: "90 - 50 = 40, 40 - 26 = 14."
    },
    {
      text: "O'quvchida 50 varaq oq qog'oz bor edi. Rasm darsida 14 varaq, mehnat darsida 16 varaq ishlatildi. Nechta varaq qoldi?",
      correctAnswer: "20",
      distractors: ["19", "21", "18"],
      explanation: "50 - (14 + 16) = 50 - 30 = 20 varaq."
    },
    {
      text: "Qulay usulda hisoblang: 100 - (60 + 25)",
      correctAnswer: "15",
      distractors: ["14", "16", "13"],
      explanation: "100 - 60 = 40, 40 - 25 = 15."
    },
    {
      text: "Qulay usulda hisoblang: 75 - (25 + 32)",
      correctAnswer: "18",
      distractors: ["17", "19", "16"],
      explanation: "75 - 25 = 50, 50 - 32 = 18."
    },
    {
      text: "Qulay usulda hisoblang: 84 - (34 + 28)",
      correctAnswer: "22",
      distractors: ["21", "23", "20"],
      explanation: "84 - 34 = 50, 50 - 28 = 22."
    },
    {
      text: "Tenglamani yeching: 70 - x = 44",
      correctAnswer: "26",
      distractors: ["25", "27", "24"],
      explanation: "x = 70 - 44 = 26."
    },
    {
      text: "Tenglamani yeching: 80 - y = 63",
      correctAnswer: "17",
      distractors: ["16", "18", "15"],
      explanation: "y = 80 - 63 = 17."
    },
    {
      text: "Taqqoslang: 70 - (30 + 14) va 25",
      correctAnswer: ">",
      distractors: ["<", "=", "+"],
      explanation: "70 - (30 + 14) = 26. 26 > 25."
    },
    {
      text: "Taqqoslang: 60 - (20 + 15) va 25",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "60 - (20 + 15) = 25. Ular teng: 25 = 25."
    },
    {
      text: "Sinf kutubxonasidagi 65 ta kitobdan dushanba kuni 15 ta, seshanba kuni 20 ta kitob olindi. Nechta kitob qoldi?",
      correctAnswer: "30",
      distractors: ["29", "31", "28"],
      explanation: "65 - (15 + 20) = 65 - 35 = 30 ta."
    },
    {
      text: "Qulay usulda hisoblang: 96 - (46 + 27)",
      correctAnswer: "23",
      distractors: ["22", "24", "21"],
      explanation: "96 - 46 = 50, 50 - 27 = 23."
    },
    {
      text: "Qulay usulda hisoblang: 85 - (35 + 34)",
      correctAnswer: "16",
      distractors: ["15", "17", "14"],
      explanation: "85 - 35 = 50, 50 - 34 = 16."
    },
    {
      text: "Qulay usulda hisoblang: 63 - (23 + 19)",
      correctAnswer: "21",
      distractors: ["20", "22", "19"],
      explanation: "63 - 23 = 40, 40 - 19 = 21."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: 70 - (20 + *) = 35?",
      correctAnswer: "15",
      distractors: ["14", "16", "13"],
      explanation: "70 - 35 = 35, 35 - 20 = 15."
    },
    {
      text: "Qulay usulda hisoblang: 87 - (37 + 35)",
      correctAnswer: "15",
      distractors: ["14", "16", "13"],
      explanation: "87 - 37 = 50, 50 - 35 = 15."
    },
    {
      text: "Qulay usulda hisoblang: 54 - (14 + 25)",
      correctAnswer: "15",
      distractors: ["14", "16", "13"],
      explanation: "54 - 14 = 40, 40 - 25 = 15."
    },
    {
      text: "Qulay usulda hisoblang: 78 - (28 + 36)",
      correctAnswer: "14",
      distractors: ["13", "15", "12"],
      explanation: "78 - 28 = 50, 50 - 36 = 14."
    }
  ]
};

// ─────────────────────────────────────────────────────────────
// 39. Masalalar yechish va o'tilgan mavzularni mustahkamlash 🏥
// ─────────────────────────────────────────────────────────────
export const unit39: Grade2UnitDef = {
  order: 39,
  bookNumber: 38,
  unitType: "LESSON",
  title: "Masalalar yechish va o‘tilgan mavzularni mustahkamlash",
  emoji: "🏥",
  crossTopic: "Tibbiyot",
  shortDesc: "Ikki amalli murakkab matnli masalalar yechish ko'nikmasi",
  intro: "Shifokorlar insonlar salomatligini asraydi. Dori-darmonlar va vitaminlar miqdorini aniq hisoblashda ikki amalli masalalar va ularning qisqa shartini to'g'ri tuzishni mashq qilamiz.",
  keyPoints: [
    "Masalaning shartini diqqat bilan o'qish va qisqa shartini yozish.",
    "Savolga javob berish uchun qaysi oraliq amal kerakligini aniqlash.",
    "Yechimni ifoda ko'rinishida yozish va natijani tekshirish."
  ],
  miniExample: {
    emojis: "🏥 (25 + 18) - 13 = 30",
    text: "Dorixonaga 25 ta vitamin va 18 ta sirop keldi, 13 tasi berildi: 43 - 13 = 30 ta qoldi!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Dorixonada 25 quti vitamin va 18 quti sirop bor edi. 13 quti dori berildi. Nechta quti qoldi?",
      correctAnswer: "30",
      distractors: ["29", "31", "28"],
      explanation: "25 + 18 = 43, 43 - 13 = 30 quti."
    },
    {
      text: "Shifoxonada 1-qavatda 32 ta, 2-qavatda 28 ta xona bor. 45 ta xonada bemorlar bor. Bo'sh xonalar nechta?",
      correctAnswer: "15",
      distractors: ["14", "16", "13"],
      explanation: "32 + 28 = 60, 60 - 45 = 15 ta bo'sh xona."
    },
    {
      text: "Hisoblang: (36 + 24) - 25",
      correctAnswer: "35",
      distractors: ["34", "36", "33"],
      explanation: "36 + 24 = 60, 60 - 25 = 35."
    }
  ],
  test: [
    {
      text: "Dorixonada 25 quti vitamin va 18 quti sirop bor edi. 13 quti dori berildi. Nechta quti qoldi?",
      correctAnswer: "30",
      distractors: ["29", "31", "28"],
      explanation: "25 + 18 = 43, 43 - 13 = 30."
    },
    {
      text: "Shifoxonada 32 ta katta va 28 ta kichik palata bor. 45 ta palata band bo'lsa, nechta bo'sh palata bor?",
      correctAnswer: "15",
      distractors: ["14", "16", "13"],
      explanation: "32 + 28 = 60, 60 - 45 = 15."
    },
    {
      text: "Hisoblang: (45 + 35) - 28",
      correctAnswer: "52",
      distractors: ["51", "53", "50"],
      explanation: "45 + 35 = 80, 80 - 28 = 52."
    },
    {
      text: "Poliklinikaga bir kunda 46 ta bola va 38 ta katta yoshli fuqaro keldi. Ulardan 54 nafari ko'rikdan o'tdi. Qolganlar nechta?",
      correctAnswer: "30",
      distractors: ["29", "31", "28"],
      explanation: "46 + 38 = 84, 84 - 54 = 30 nafar."
    },
    {
      text: "Hisoblang: 70 - (24 + 16)",
      correctAnswer: "30",
      distractors: ["29", "31", "28"],
      explanation: "24 + 16 = 40, 70 - 40 = 30."
    },
    {
      text: "Tibbiyot xodimida 50 ta shprits bor edi. Ertalab 18 ta, tushdan keyin 15 ta ishlatildi. Nechta shprits qoldi?",
      correctAnswer: "17",
      distractors: ["16", "18", "15"],
      explanation: "50 - (18 + 15) = 50 - 33 = 17 ta."
    },
    {
      text: "Hisoblang: (52 + 18) - 34",
      correctAnswer: "36",
      distractors: ["35", "37", "34"],
      explanation: "52 + 18 = 70, 70 - 34 = 36."
    },
    {
      text: "Hisoblang: 85 - (35 + 25)",
      correctAnswer: "25",
      distractors: ["24", "26", "23"],
      explanation: "85 - 60 = 25."
    },
    {
      text: "Tenglamani yeching: x + 25 = 80",
      correctAnswer: "55",
      distractors: ["54", "56", "53"],
      explanation: "x = 80 - 25 = 55."
    },
    {
      text: "Tenglamani yeching: y - 18 = 60",
      correctAnswer: "78",
      distractors: ["77", "79", "76"],
      explanation: "y = 60 + 18 = 78."
    },
    {
      text: "Taqqoslang: (25 + 18) - 13 va 30",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "(25 + 18) - 13 = 30. Ular teng: 30 = 30."
    },
    {
      text: "Taqqoslang: (45 + 35) - 28 va 50",
      correctAnswer: ">",
      distractors: ["<", "=", "+"],
      explanation: "(45 + 35) - 28 = 52. 52 > 50."
    },
    {
      text: "Tez yordam mashinasida 40 litr yonilg'i bor edi. 1-chaqiruvga 12 litr, 2-chaqiruvga 14 litr sarflandi. Qancha yonilg'i qoldi?",
      correctAnswer: "14",
      distractors: ["13", "15", "12"],
      explanation: "40 - (12 + 14) = 40 - 26 = 14 litr."
    },
    {
      text: "Hisoblang: (63 + 27) - 45",
      correctAnswer: "45",
      distractors: ["44", "46", "43"],
      explanation: "63 + 27 = 90, 90 - 45 = 45."
    },
    {
      text: "Hisoblang: 90 - (38 + 22)",
      correctAnswer: "30",
      distractors: ["29", "31", "28"],
      explanation: "38 + 22 = 60, 90 - 60 = 30."
    },
    {
      text: "Hisoblang: (41 + 29) - 36",
      correctAnswer: "34",
      distractors: ["33", "35", "32"],
      explanation: "41 + 29 = 70, 70 - 36 = 34."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: (30 + 40) - * = 45?",
      correctAnswer: "25",
      distractors: ["24", "26", "23"],
      explanation: "70 - 45 = 25."
    },
    {
      text: "Hisoblang: 75 - (25 + 18)",
      correctAnswer: "32",
      distractors: ["31", "33", "30"],
      explanation: "75 - 25 = 50, 50 - 18 = 32."
    },
    {
      text: "Hisoblang: (54 + 26) - 48",
      correctAnswer: "32",
      distractors: ["31", "33", "30"],
      explanation: "54 + 26 = 80, 80 - 48 = 32."
    },
    {
      text: "Hisoblang: 100 - (45 + 35)",
      correctAnswer: "20",
      distractors: ["19", "21", "18"],
      explanation: "100 - 80 = 20."
    }
  ]
};

// ─────────────────────────────────────────────────────────────
// 40. Masalalar yechish 💳
// ─────────────────────────────────────────────────────────────
export const unit40: Grade2UnitDef = {
  order: 40,
  bookNumber: 39,
  unitType: "LESSON",
  title: "Masalalar yechish",
  emoji: "💳",
  crossTopic: "Plastik kartalar",
  shortDesc: "Moliyaviy hisob-kitoblar va Rim raqamlarini taqqoslash",
  intro: "Bank kartalari orqali xaridlar qilish va hisobni tekshirish qulay. Plastik karta balansini hisoblash hamda Rim raqamlarini taqqoslashni o'rganamiz!",
  keyPoints: [
    "Karta hisobiga pul tushishi (+) va sarflanishi (-) amallari.",
    "Rim raqamlarini taqqoslash: XVI < XX, XXXV < XL, XL > XXX, L > XL.",
    "Moliyaviy savodxonlik: sarf-xarajatlarni to'g'ri rejalashtirish."
  ],
  miniExample: {
    emojis: "💳 XVI < XX | XXXV < XL | 50 - 25 = 25",
    text: "XVI (16) kichik XX (20) dan! 50 ming so'mdan 25 ming sarflansa, 25 ming qoladi."
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Rim raqamlarini taqqoslang: XVI ... XX",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "XVI = 16, XX = 20. 16 < 20."
    },
    {
      text: "Rim raqamlarini taqqoslang: XXXV ... XL",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "XXXV = 35, XL = 40. 35 < 40."
    },
    {
      text: "Kartada 60 ming so'm bor edi. 24 ming so'mga kitob olindi. Kartada qancha pul qoldi?",
      correctAnswer: "36",
      distractors: ["35", "37", "34"],
      explanation: "60 - 24 = 36 ming so'm."
    }
  ],
  test: [
    {
      text: "Rim raqamlarini taqqoslang: XVI ... XX",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "XVI = 16, XX = 20. 16 < 20."
    },
    {
      text: "Rim raqamlarini taqqoslang: XXXV ... XL",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "XXXV = 35, XL = 40. 35 < 40."
    },
    {
      text: "Rim raqamlarini taqqoslang: XL ... XXX",
      correctAnswer: ">",
      distractors: ["<", "=", "+"],
      explanation: "XL = 40, XXX = 30. 40 > 30."
    },
    {
      text: "Rim raqamlarini taqqoslang: L ... XL",
      correctAnswer: ">",
      distractors: ["<", "=", "+"],
      explanation: "L = 50, XL = 40. 50 > 40."
    },
    {
      text: "Kartada 80 ming so'm bor edi. 35 ming so'm sarflandi. Qancha pul qoldi?",
      correctAnswer: "45",
      distractors: ["44", "46", "43"],
      explanation: "80 - 35 = 45 ming so'm."
    },
    {
      text: "Kartaga 40 ming so'm va 30 ming so'm tushdi. 25 ming so'm xarid qilindi. Qancha qoldi?",
      correctAnswer: "45",
      distractors: ["44", "46", "43"],
      explanation: "40 + 30 = 70, 70 - 25 = 45 ming so'm."
    },
    {
      text: "Rim raqamlarini taqqoslang: XII ... XV",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "XII = 12, XV = 15. 12 < 15."
    },
    {
      text: "Rim raqamlarini taqqoslang: XXVIII ... XXV",
      correctAnswer: ">",
      distractors: ["<", "=", "+"],
      explanation: "XXVIII = 28, XXV = 25. 28 > 25."
    },
    {
      text: "Tenglamani yeching: x + 35 = 80",
      correctAnswer: "45",
      distractors: ["44", "46", "43"],
      explanation: "x = 80 - 35 = 45."
    },
    {
      text: "Tenglamani yeching: y - 24 = 36",
      correctAnswer: "60",
      distractors: ["59", "61", "58"],
      explanation: "y = 36 + 24 = 60."
    },
    {
      text: "Rim raqamlarini taqqoslang: XVIII ... XVIII",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "18 = 18. XVIII = XVIII."
    },
    {
      text: "Taqqoslang: 60 - 24 va 35",
      correctAnswer: ">",
      distractors: ["<", "=", "+"],
      explanation: "60 - 24 = 36. 36 > 35."
    },
    {
      text: "Kartada 90 ming so'm bor edi. 45 ming so'mga darslik, 20 ming so'mga daftar olindi. Qancha qoldi?",
      correctAnswer: "25",
      distractors: ["24", "26", "23"],
      explanation: "90 - (45 + 20) = 90 - 65 = 25 ming so'm."
    },
    {
      text: "Rim raqamlarida hisoblang: XX + XV",
      correctAnswer: "XXXV",
      distractors: ["XXX", "XL", "XXV"],
      explanation: "20 + 15 = 35 (XXXV)."
    },
    {
      text: "Rim raqamlarida hisoblang: L - X",
      correctAnswer: "XL",
      distractors: ["XXX", "L", "XXXV"],
      explanation: "50 - 10 = 40 (XL)."
    },
    {
      text: "Kartada 75 ming so'm bor edi. 28 ming so'm sarflangach, necha ming so'm qoladi?",
      correctAnswer: "47",
      distractors: ["46", "48", "45"],
      explanation: "75 - 28 = 47 ming so'm."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: * + 36 = 60?",
      correctAnswer: "24",
      distractors: ["23", "25", "22"],
      explanation: "60 - 36 = 24."
    },
    {
      text: "Rim raqamlarini taqqoslang: XXIV ... XXX",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "XXIV = 24, XXX = 30. 24 < 30."
    },
    {
      text: "Rim raqamlarida hisoblang: XIV + XIV",
      correctAnswer: "XXVIII",
      distractors: ["XXVII", "XXIX", "XXVI"],
      explanation: "14 + 14 = 28 (XXVIII)."
    },
    {
      text: "Kartaga 50 ming so'm solindi, so'ngra 18 ming so'm yechib olindi. Qancha pul qoldi?",
      correctAnswer: "32",
      distractors: ["31", "33", "30"],
      explanation: "50 - 18 = 32 ming so'm."
    }
  ]
};

// ─────────────────────────────────────────────────────────────
// 41. Mavzu bo'yicha yakuniy dars 💡 (FINAL_LESSON, bookNumber: null)
// ─────────────────────────────────────────────────────────────
export const unit41: Grade2UnitDef = {
  order: 41,
  bookNumber: null,
  unitType: "FINAL_LESSON",
  title: "Mavzu bo'yicha yakuniy dars",
  emoji: "💡",
  crossTopic: "Men va texnologiyalar",
  shortDesc: "V bob bo'yicha umumlashtiruvchi yakuniy sinov",
  intro: "Zamonaviy texnologiyalar insoniyat bilimlarining mahsulidir. V bobda yig'indidan sonni ayirish, sondan yig'indini ayirish va matnli masalalarni o'rgandik. Bilimlarimizni sinovdan o'tkazamiz!",
  keyPoints: [
    "(a + b) - c va a - (b + c) qoidalarini to'g'ri qo'llash.",
    "Ikki amalli masalalarni qisqa shart orqali tezkor yechish.",
    "Rim raqamlarida amallar va ularni taqqoslash."
  ],
  miniExample: {
    emojis: "💡 (35 + 25) - 20 = 40 | XVI < XX",
    text: "V bob xulosasi: barcha xossalar va hisoblash ko'nikmalari mustahkamlandi!"
  },
  xpReward: 130,
  coinReward: 15,
  estMinutes: 10,
  practice: [
    {
      text: "Qulay usulda hisoblang: (36 + 24) - 16",
      correctAnswer: "44",
      distractors: ["43", "45", "42"],
      explanation: "(36 - 16) + 24 = 20 + 24 = 44."
    },
    {
      text: "Qulay usulda hisoblang: 70 - (20 + 15)",
      correctAnswer: "35",
      distractors: ["34", "36", "33"],
      explanation: "70 - 20 = 50, 50 - 15 = 35."
    },
    {
      text: "Rim raqamlarini taqqoslang: XXX ... XL",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "XXX = 30, XL = 40. 30 < 40."
    }
  ],
  test: [
    {
      text: "Qulay usulda hisoblang: (36 + 24) - 16",
      correctAnswer: "44",
      distractors: ["43", "45", "42"],
      explanation: "(36 - 16) + 24 = 20 + 24 = 44."
    },
    {
      text: "Qulay usulda hisoblang: 70 - (20 + 15)",
      correctAnswer: "35",
      distractors: ["34", "36", "33"],
      explanation: "70 - 20 = 50, 50 - 15 = 35."
    },
    {
      text: "Rim raqamlarini taqqoslang: XXX ... XL",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "XXX = 30, XL = 40. 30 < 40."
    },
    {
      text: "Hisoblang: (48 + 32) - 25",
      correctAnswer: "55",
      distractors: ["54", "56", "53"],
      explanation: "48 + 32 = 80, 80 - 25 = 55."
    },
    {
      text: "Hisoblang: 85 - (35 + 20)",
      correctAnswer: "30",
      distractors: ["29", "31", "28"],
      explanation: "85 - 35 = 50, 50 - 20 = 30."
    },
    {
      text: "Rim raqamlarida hisoblang: XI + IX",
      correctAnswer: "XX",
      distractors: ["XIX", "XXI", "XVIII"],
      explanation: "11 + 9 = 20 (XX)."
    },
    {
      text: "Kutubxonada 80 ta kitob bor edi. 24 ta darslik va 26 ta ertak olindi. Nechta kitob qoldi?",
      correctAnswer: "30",
      distractors: ["29", "31", "28"],
      explanation: "80 - (24 + 26) = 80 - 50 = 30 ta."
    },
    {
      text: "Hisoblang: (54 + 26) - 34",
      correctAnswer: "46",
      distractors: ["45", "47", "44"],
      explanation: "(54 - 34) + 26 = 20 + 26 = 46."
    },
    {
      text: "Tenglamani yeching: x + 24 = 60",
      correctAnswer: "36",
      distractors: ["35", "37", "34"],
      explanation: "x = 60 - 24 = 36."
    },
    {
      text: "Tenglamani yeching: 70 - y = 35",
      correctAnswer: "35",
      distractors: ["34", "36", "33"],
      explanation: "y = 70 - 35 = 35."
    },
    {
      text: "Taqqoslang: (36 + 24) - 16 va 44",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "(36 + 24) - 16 = 44. Ular teng: 44 = 44."
    },
    {
      text: "Taqqoslang: 70 - (20 + 15) va 40",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "70 - (20 + 15) = 35. 35 < 40."
    },
    {
      text: "Do'konga 90 ta telefon keldi. Ertalab 32 ta, tushdan keyin 28 ta sotildi. Qancha qoldi?",
      correctAnswer: "30",
      distractors: ["29", "31", "28"],
      explanation: "90 - (32 + 28) = 90 - 60 = 30 ta."
    },
    {
      text: "Rim raqamlarida hisoblang: XL - X",
      correctAnswer: "XXX",
      distractors: ["XX", "L", "XXXV"],
      explanation: "40 - 10 = 30 (XXX)."
    },
    {
      text: "Hisoblang: (63 + 17) - 38",
      correctAnswer: "42",
      distractors: ["41", "43", "40"],
      explanation: "63 + 17 = 80, 80 - 38 = 42."
    },
    {
      text: "Hisoblang: 95 - (45 + 23)",
      correctAnswer: "27",
      distractors: ["26", "28", "25"],
      explanation: "95 - 45 = 50, 50 - 23 = 27."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: (50 + 30) - * = 45?",
      correctAnswer: "35",
      distractors: ["34", "36", "33"],
      explanation: "80 - 45 = 35."
    },
    {
      text: "Rim raqamlarini taqqoslang: XVIII ... XX",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "XVIII = 18, XX = 20. 18 < 20."
    },
    {
      text: "Hisoblang: (72 + 18) - 46",
      correctAnswer: "44",
      distractors: ["43", "45", "42"],
      explanation: "72 + 18 = 90, 90 - 46 = 44."
    },
    {
      text: "Hisoblang: 100 - (35 + 35)",
      correctAnswer: "30",
      distractors: ["29", "31", "28"],
      explanation: "100 - 70 = 30."
    }
  ]
};

// ─────────────────────────────────────────────────────────────
// 42. Amaliy topshiriqlar 🏃
// ─────────────────────────────────────────────────────────────
export const unit42: Grade2UnitDef = {
  order: 42,
  bookNumber: 40,
  unitType: "LESSON",
  title: "Amaliy topshiriqlar",
  emoji: "🏃",
  crossTopic: "Intellektual marafon",
  shortDesc: "Intellektual marafon: tenglamalar va o'lchov birliklari",
  intro: "Intellektual marafonda chaqqonlik va zukkolik sinovdan o'tkaziladi. Ushbu darsda tenglamalar (x - 25 = 25, a - 0 = 15) va uzunlik o'lchov birliklarini (dm, cm) hisoblashni bajaramiz!",
  keyPoints: [
    "Tenglamalarni yechish: x - 25 = 25 bo'lsa x = 25 + 25 = 50.",
    "0 bilan amallar: a - 0 = 15 bo'lsa a = 15.",
    "O'lchov birliklari: 1 dm = 10 cm, 4 dm 5 cm = 45 cm."
  ],
  miniExample: {
    emojis: "🏃 x - 25 = 25 (x = 50) | 4 dm 5 cm = 45 cm",
    text: "x - 25 = 25 tenglamaning yechimi 50! 4 dm 5 cm = 45 cm!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Tenglamani yeching: x - 25 = 25",
      correctAnswer: "50",
      distractors: ["40", "45", "55"],
      explanation: "x = 25 + 25 = 50."
    },
    {
      text: "Tenglamani yeching: a - 0 = 15",
      correctAnswer: "15",
      distractors: ["0", "14", "16"],
      explanation: "a = 15 + 0 = 15."
    },
    {
      text: "Santimetrlarda ifodalang: 4 dm 5 cm necha cm bo'ladi?",
      correctAnswer: "45 cm",
      distractors: ["40 cm", "54 cm", "50 cm"],
      explanation: "4 dm = 40 cm, 40 + 5 = 45 cm."
    }
  ],
  test: [
    {
      text: "Tenglamani yeching: x - 25 = 25",
      correctAnswer: "50",
      distractors: ["40", "45", "55"],
      explanation: "x = 25 + 25 = 50."
    },
    {
      text: "Tenglamani yeching: a - 0 = 15",
      correctAnswer: "15",
      distractors: ["0", "14", "16"],
      explanation: "a = 15 + 0 = 15."
    },
    {
      text: "Santimetrlarda ifodalang: 4 dm 5 cm necha cm bo'ladi?",
      correctAnswer: "45 cm",
      distractors: ["40 cm", "54 cm", "50 cm"],
      explanation: "4 dm = 40 cm, 40 + 5 = 45 cm."
    },
    {
      text: "Tenglamani yeching: y + 16 = 40",
      correctAnswer: "24",
      distractors: ["23", "25", "22"],
      explanation: "y = 40 - 16 = 24."
    },
    {
      text: "Santimetrlarda ifodalang: 6 dm 8 cm necha cm bo'ladi?",
      correctAnswer: "68 cm",
      distractors: ["60 cm", "86 cm", "78 cm"],
      explanation: "6 dm = 60 cm, 60 + 8 = 68 cm."
    },
    {
      text: "Tenglamani yeching: 50 - z = 18",
      correctAnswer: "32",
      distractors: ["31", "33", "30"],
      explanation: "z = 50 - 18 = 32."
    },
    {
      text: "Santimetrlarda ifodalang: 3 dm 2 cm necha cm bo'ladi?",
      correctAnswer: "32 cm",
      distractors: ["30 cm", "23 cm", "35 cm"],
      explanation: "3 dm = 30 cm, 30 + 2 = 32 cm."
    },
    {
      text: "Tenglamani yeching: m - 34 = 34",
      correctAnswer: "68",
      distractors: ["67", "69", "66"],
      explanation: "m = 34 + 34 = 68."
    },
    {
      text: "Tenglamani yeching: k + 0 = 28",
      correctAnswer: "28",
      distractors: ["0", "27", "29"],
      explanation: "k = 28."
    },
    {
      text: "Tenglamani yeching: 70 - x = 25",
      correctAnswer: "45",
      distractors: ["44", "46", "43"],
      explanation: "x = 70 - 25 = 45."
    },
    {
      text: "Taqqoslang: 4 dm 5 cm va 50 cm",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "4 dm 5 cm = 45 cm. 45 cm < 50 cm."
    },
    {
      text: "Taqqoslang: 6 dm va 60 cm",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "6 dm = 60 cm. Ular teng: 60 cm = 60 cm."
    },
    {
      text: "Sportchi 5 dm 4 cm masofaga sakradi. Bu necha santimetrga teng?",
      correctAnswer: "54 cm",
      distractors: ["50 cm", "45 cm", "55 cm"],
      explanation: "5 dm 4 cm = 54 cm."
    },
    {
      text: "Tenglamani yeching: x - 18 = 18",
      correctAnswer: "36",
      distractors: ["35", "37", "34"],
      explanation: "x = 18 + 18 = 36."
    },
    {
      text: "Santimetrlarda ifodalang: 8 dm 3 cm necha cm bo'ladi?",
      correctAnswer: "83 cm",
      distractors: ["80 cm", "38 cm", "85 cm"],
      explanation: "8 dm = 80 cm, 80 + 3 = 83 cm."
    },
    {
      text: "Tenglamani yeching: 80 - y = 44",
      correctAnswer: "36",
      distractors: ["35", "37", "34"],
      explanation: "y = 80 - 44 = 36."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: * - 20 = 20?",
      correctAnswer: "40",
      distractors: ["39", "41", "30"],
      explanation: "20 + 20 = 40."
    },
    {
      text: "Santimetrlarda ifodalang: 7 dm 9 cm necha cm bo'ladi?",
      correctAnswer: "79 cm",
      distractors: ["70 cm", "97 cm", "89 cm"],
      explanation: "7 dm 9 cm = 79 cm."
    },
    {
      text: "Tenglamani yeching: a - 45 = 45",
      correctAnswer: "90",
      distractors: ["80", "85", "95"],
      explanation: "a = 45 + 45 = 90."
    },
    {
      text: "Tenglamani yeching: 60 - b = 27",
      correctAnswer: "33",
      distractors: ["32", "34", "31"],
      explanation: "b = 60 - 27 = 33."
    }
  ]
};

// ─────────────────────────────────────────────────────────────
// 43. Amaliy topshiriqlar 🏅
// ─────────────────────────────────────────────────────────────
export const unit43: Grade2UnitDef = {
  order: 43,
  bookNumber: 41,
  unitType: "LESSON",
  title: "Amaliy topshiriqlar",
  emoji: "🏅",
  crossTopic: "Intellektual marafon",
  shortDesc: "Ko'p amalli ifodalar va qavsli amallar tartibi",
  intro: "Marafonda g'olib bo'lish uchun intizom va tartib kerak. Matematikada amallar tartibi qoidasiga rioya qilib, murakkab ifodalarni yechamiz: avval qavs ichi, so'ngra ketma-ket qo'shish va ayirish!",
  keyPoints: [
    "Qavsli ifodalarda birinchi navbatda qavs ichidagi amal bajariladi.",
    "Qavssiz ifodalarda amallar chapdan o'ngga qarab tartib bilan bajariladi.",
    "Amallarni to'g'ri ketma-ketlikda bajarish aniq natijaga olib keladi."
  ],
  miniExample: {
    emojis: "🏅 100 - (34 + 26) = 100 - 60 = 40",
    text: "Avval qavs: 34 + 26 = 60, so'ng 100 - 60 = 40 medal!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Hisoblang: 100 - (34 + 26)",
      correctAnswer: "40",
      distractors: ["39", "41", "30"],
      explanation: "34 + 26 = 60, 100 - 60 = 40."
    },
    {
      text: "Hisoblang: (45 + 25) - (18 + 12)",
      correctAnswer: "40",
      distractors: ["39", "41", "30"],
      explanation: "70 - 30 = 40."
    },
    {
      text: "Hisoblang: 65 - 25 + 18",
      correctAnswer: "58",
      distractors: ["57", "59", "56"],
      explanation: "65 - 25 = 40, 40 + 18 = 58."
    }
  ],
  test: [
    {
      text: "Hisoblang: 100 - (34 + 26)",
      correctAnswer: "40",
      distractors: ["39", "41", "30"],
      explanation: "34 + 26 = 60, 100 - 60 = 40."
    },
    {
      text: "Hisoblang: (45 + 25) - (18 + 12)",
      correctAnswer: "40",
      distractors: ["39", "41", "30"],
      explanation: "70 - 30 = 40."
    },
    {
      text: "Hisoblang: 65 - 25 + 18",
      correctAnswer: "58",
      distractors: ["57", "59", "56"],
      explanation: "65 - 25 = 40, 40 + 18 = 58."
    },
    {
      text: "Hisoblang: 80 - (28 + 22)",
      correctAnswer: "30",
      distractors: ["29", "31", "28"],
      explanation: "28 + 22 = 50, 80 - 50 = 30."
    },
    {
      text: "Musobaqada 1-o'rin 50 ball, 2-o'rin 30 ball oldi. Hakamlar jarima sifatida 15 ball ayirdi. Jami nechta ball qoldi?",
      correctAnswer: "65",
      distractors: ["64", "66", "63"],
      explanation: "50 + 30 = 80, 80 - 15 = 65 ball."
    },
    {
      text: "Hisoblang: (56 - 16) + (38 - 18)",
      correctAnswer: "60",
      distractors: ["59", "61", "58"],
      explanation: "40 + 20 = 60."
    },
    {
      text: "Hisoblang: 90 - (42 + 18)",
      correctAnswer: "30",
      distractors: ["29", "31", "28"],
      explanation: "42 + 18 = 60, 90 - 60 = 30."
    },
    {
      text: "Hisoblang: 74 - 34 + 27",
      correctAnswer: "67",
      distractors: ["66", "68", "65"],
      explanation: "74 - 34 = 40, 40 + 27 = 67."
    },
    {
      text: "Tenglamani yeching: x + 40 = 70",
      correctAnswer: "30",
      distractors: ["29", "31", "28"],
      explanation: "x = 70 - 40 = 30."
    },
    {
      text: "Tenglamani yeching: y - 50 = 25",
      correctAnswer: "75",
      distractors: ["74", "76", "73"],
      explanation: "y = 25 + 50 = 75."
    },
    {
      text: "Taqqoslang: 100 - (34 + 26) va 40",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "100 - 60 = 40. Ular teng: 40 = 40."
    },
    {
      text: "Taqqoslang: 65 - 25 + 18 va 60",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "65 - 25 + 18 = 58. 58 < 60."
    },
    {
      text: "Marafonchi 1-soatda 24 km, 2-soatda 18 km yugurdi. U 60 km masofani bosib o'tishi uchun yana necha km yugurishi kerak?",
      correctAnswer: "18",
      distractors: ["17", "19", "16"],
      explanation: "60 - (24 + 18) = 60 - 42 = 18 km."
    },
    {
      text: "Hisoblang: (68 + 12) - (25 + 25)",
      correctAnswer: "30",
      distractors: ["29", "31", "28"],
      explanation: "80 - 50 = 30."
    },
    {
      text: "Hisoblang: 85 - 35 + 22",
      correctAnswer: "72",
      distractors: ["71", "73", "70"],
      explanation: "85 - 35 = 50, 50 + 22 = 72."
    },
    {
      text: "Hisoblang: 70 - (17 + 23)",
      correctAnswer: "30",
      distractors: ["29", "31", "28"],
      explanation: "17 + 23 = 40, 70 - 40 = 30."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: (40 + 20) - * = 35?",
      correctAnswer: "25",
      distractors: ["24", "26", "23"],
      explanation: "60 - 35 = 25."
    },
    {
      text: "Hisoblang: (92 - 42) + (18 - 8)",
      correctAnswer: "60",
      distractors: ["59", "61", "58"],
      explanation: "50 + 10 = 60."
    },
    {
      text: "Hisoblang: 100 - (48 + 22)",
      correctAnswer: "30",
      distractors: ["29", "31", "28"],
      explanation: "48 + 22 = 70, 100 - 70 = 30."
    },
    {
      text: "Hisoblang: 58 - 18 + 36",
      correctAnswer: "76",
      distractors: ["75", "77", "74"],
      explanation: "58 - 18 = 40, 40 + 36 = 76."
    }
  ]
};

// ─────────────────────────────────────────────────────────────
// 44. Amaliy topshiriqlar 🧩 (PRACTICE, bookNumber: null)
// ─────────────────────────────────────────────────────────────
export const unit44: Grade2UnitDef = {
  order: 44,
  bookNumber: null,
  unitType: "PRACTICE",
  title: "Amaliy topshiriqlar",
  emoji: "🧩",
  crossTopic: null,
  shortDesc: "Mantiqiy masalalar, qonuniyatlar va yakuniy amaliy mashqlar",
  intro: "1-qismning yakuniy amaliy darsi! Mantiqiy topshiriqlar, qonuniyatlar (ketma-ketliklar) va geometrik shakllar bo'yicha mustaqil topshiriqlarni bajaramiz.",
  keyPoints: [
    "Qonuniyatni topish: ketma-ket sonlar orasidagi farqni aniqlash.",
    "Mantiqiy masalalarni mulohaza va chizma orqali yechish.",
    "2-sinf 1-qismida egallangan barcha bilimlarni erkin qo'llash."
  ],
  miniExample: {
    emojis: "🧩 5, 10, 15, 20, ? (25) | To'g'ri to'rtburchak",
    text: "Ketma-ketlik har safar 5 taga ortmoqda, keyingi son 25!"
  },
  xpReward: 140,
  coinReward: 15,
  estMinutes: 10,
  practice: [
    {
      text: "Qonuniyatni aniqlang va keyingi sonni toping: 5, 10, 15, 20, ?",
      correctAnswer: "25",
      distractors: ["24", "26", "30"],
      explanation: "Sonlar 5 tadan ortib bormoqda: 20 + 5 = 25.",
      meta: { seq: [5, 10, 15, 20], next: 25 }
    },
    {
      text: "Qonuniyatni aniqlang va keyingi sonni toping: 2, 4, 6, 8, ?",
      correctAnswer: "10",
      distractors: ["9", "11", "12"],
      explanation: "Sonlar 2 tadan ortmoqda: 8 + 2 = 10.",
      meta: { seq: [2, 4, 6, 8], next: 10 }
    },
    {
      text: "To'g'ri to'rtburchakning nechta burchagi bor?",
      correctAnswer: "4 ta",
      distractors: ["3 ta", "5 ta", "6 ta"],
      explanation: "To'g'ri to'rtburchakning 4 ta to'g'ri burchagi bor."
    }
  ],
  test: [
    {
      text: "Qonuniyatni aniqlang va keyingi sonni toping: 5, 10, 15, 20, ?",
      correctAnswer: "25",
      distractors: ["24", "26", "30"],
      explanation: "Sonlar 5 tadan ortmoqda: 20 + 5 = 25.",
      meta: { seq: [5, 10, 15, 20], next: 25 }
    },
    {
      text: "Qonuniyatni aniqlang va keyingi sonni toping: 10, 20, 30, 40, ?",
      correctAnswer: "50",
      distractors: ["45", "55", "60"],
      explanation: "Sonlar 10 tadan ortmoqda: 40 + 10 = 50.",
      meta: { seq: [10, 20, 30, 40], next: 50 }
    },
    {
      text: "Qonuniyatni aniqlang va keyingi sonni toping: 3, 6, 9, 12, ?",
      correctAnswer: "15",
      distractors: ["14", "16", "18"],
      explanation: "Sonlar 3 tadan ortmoqda: 12 + 3 = 15.",
      meta: { seq: [3, 6, 9, 12], next: 15 }
    },
    {
      text: "Qonuniyatni aniqlang va keyingi sonni toping: 50, 45, 40, 35, ?",
      correctAnswer: "30",
      distractors: ["25", "35", "20"],
      explanation: "Sonlar 5 tadan kamaymoqda: 35 - 5 = 30.",
      meta: { seq: [50, 45, 40, 35], next: 30 }
    },
    {
      text: "Uchburchakning nechta tomoni bor?",
      correctAnswer: "3 ta",
      distractors: ["4 ta", "5 ta", "2 ta"],
      explanation: "Uchburchakning 3 ta tomoni va 3 ta burchagi bor."
    },
    {
      text: "Qonuniyatni aniqlang va keyingi sonni toping: 4, 8, 12, 16, ?",
      correctAnswer: "20",
      distractors: ["18", "22", "24"],
      explanation: "Sonlar 4 tadan ortmoqda: 16 + 4 = 20.",
      meta: { seq: [4, 8, 12, 16], next: 20 }
    },
    {
      text: "Kvadratning barcha tomonlari qanday?",
      correctAnswer: "Teng",
      distractors: ["Har xil", "To'g'ri", "Egri"],
      explanation: "Kvadratning 4 ta tomoni bir-biriga teng."
    },
    {
      text: "Qonuniyatni aniqlang va keyingi sonni toping: 100, 90, 80, 70, ?",
      correctAnswer: "60",
      distractors: ["50", "65", "55"],
      explanation: "Sonlar 10 tadan kamaymoqda: 70 - 10 = 60.",
      meta: { seq: [100, 90, 80, 70], next: 60 }
    },
    {
      text: "Tenglamani yeching: x + 30 = 75",
      correctAnswer: "45",
      distractors: ["44", "46", "43"],
      explanation: "x = 75 - 30 = 45."
    },
    {
      text: "Tenglamani yeching: y - 25 = 50",
      correctAnswer: "75",
      distractors: ["74", "76", "73"],
      explanation: "y = 50 + 25 = 75."
    },
    {
      text: "Taqqoslang: 3 dm 5 cm va 35 cm",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "3 dm 5 cm = 35 cm. Ular teng: 35 cm = 35 cm."
    },
    {
      text: "Taqqoslang: 48 - 18 va 35",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "48 - 18 = 30. 30 < 35."
    },
    {
      text: "Ahmad va Anvar birgalikda 40 ta yong'oq terishdi. Ahmad 24 ta tergan bo'lsa, Anvar nechta tergan?",
      correctAnswer: "16",
      distractors: ["15", "17", "14"],
      explanation: "40 - 24 = 16 ta yong'oq."
    },
    {
      text: "Qonuniyatni aniqlang va keyingi sonni toping: 7, 14, 21, 28, ?",
      correctAnswer: "35",
      distractors: ["34", "36", "32"],
      explanation: "Sonlar 7 tadan ortmoqda: 28 + 7 = 35.",
      meta: { seq: [7, 14, 21, 28], next: 35 }
    },
    {
      text: "Hisoblang: 100 - (45 + 25)",
      correctAnswer: "30",
      distractors: ["29", "31", "28"],
      explanation: "45 + 25 = 70, 100 - 70 = 30."
    },
    {
      text: "Kesmaning nechta uchi bor?",
      correctAnswer: "2 ta",
      distractors: ["1 ta", "3 ta", "Uchi yo'q"],
      explanation: "Kesma ikki tomondan nuqta bilan chegaralangan, uning 2 ta uchi bor."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: 50 + * = 85?",
      correctAnswer: "35",
      distractors: ["34", "36", "33"],
      explanation: "85 - 50 = 35."
    },
    {
      text: "Qonuniyatni aniqlang va keyingi sonni toping: 60, 50, 40, 30, ?",
      correctAnswer: "20",
      distractors: ["10", "25", "15"],
      explanation: "Sonlar 10 tadan kamaymoqda: 30 - 10 = 20.",
      meta: { seq: [60, 50, 40, 30], next: 20 }
    },
    {
      text: "Rim raqamlarida hisoblang: XXV + XXV",
      correctAnswer: "L",
      distractors: ["XL", "XXX", "LV"],
      explanation: "25 + 25 = 50 (L)."
    },
    {
      text: "To'g'ri to'rtburchakning qarama-qarshi tomonlari qanday bo'ladi?",
      correctAnswer: "Teng",
      distractors: ["Har xil", "Egri", "Kesişuvchi"],
      explanation: "To'g'ri to'rtburchakning qarama-qarshi tomonlari o'zaro teng bo'ladi."
    }
  ]
};

const allUnits = [unit35, unit36, unit37, unit38, unit39, unit40, unit41, unit42, unit43, unit44];

for (const u of allUnits) {
  const seed = buildGrade2UnitSeed(u);
  saveGrade2UnitFile(u.order, seed);
  console.log(`✅ Saved Grade 2 unit-${u.order < 10 ? '0' + u.order : u.order}.json`);
}
