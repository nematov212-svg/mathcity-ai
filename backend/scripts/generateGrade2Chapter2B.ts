import { Grade2UnitDef, buildGrade2UnitSeed, saveGrade2UnitFile } from './generatorTypes';

console.log("Generating Grade 2 Part 1 Chapter IIB (order 14-19)...");

export const unit14: Grade2UnitDef = {
  order: 14,
  bookNumber: 14,
  unitType: "LESSON",
  title: "Sonlarni ayirish (30 - 7)",
  emoji: "📅",
  crossTopic: "Taqvim",
  shortDesc: "Yaxlit o'nlikdan bir xonali sonni ayirish usuli",
  intro: "Taqvimda 30 kun bor. 7 kun o'tgach qancha kun qolishini bilish uchun yaxlit o'nlikdan birlikni ayirishni o'rganamiz.",
  keyPoints: [
    "30 sonini 20 va 10 ga ajratamiz: 10 - 7 = 3, 20 + 3 = 23.",
    "Yaxlit sondan bir xonali son ayirilganda o'nlik 1 taga kamayadi.",
    "Taqvim va sanalarni hisoblashda o'nlikdan ayirish qulay yordam beradi."
  ],
  miniExample: {
    emojis: "📅 30 - 7 = 23",
    text: "30 dan 7 ni ayirish: 10 dan 7 ni ayirsak 3, qolgan 2 ta o'nlik bilan 23 bo'ladi."
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Hisoblang: 30 - 7",
      correctAnswer: "23",
      distractors: ["27", "24", "13"],
      explanation: "30 - 7 = 20 + (10 - 7) = 23."
    },
    {
      text: "Hisoblang: 40 - 6",
      correctAnswer: "34",
      distractors: ["36", "32", "44"],
      explanation: "40 - 6 = 30 + (10 - 6) = 34."
    },
    {
      text: "Taqvimda bir oy 30 kun. 8 kuni dam olish bo'lsa, ish kunlari nechta?",
      correctAnswer: "22",
      distractors: ["20", "24", "26"],
      explanation: "30 - 8 = 22 ta ish kuni."
    }
  ],
  test: [
    {
      text: "Hisoblang: 30 - 7",
      correctAnswer: "23",
      distractors: ["27", "24", "13"],
      explanation: "30 - 7 = 20 + (10 - 7) = 23."
    },
    {
      text: "Hisoblang: 40 - 6",
      correctAnswer: "34",
      distractors: ["36", "32", "44"],
      explanation: "40 - 6 = 30 + (10 - 6) = 34."
    },
    {
      text: "Hisoblang: 50 - 8",
      correctAnswer: "42",
      distractors: ["48", "38", "44"],
      explanation: "50 - 8 = 40 + (10 - 8) = 42."
    },
    {
      text: "Taqvimda oy 30 kun. 9 kun o'tgach yana necha kun qoldi?",
      correctAnswer: "21",
      distractors: ["19", "22", "20"],
      explanation: "30 - 9 = 21 kun qoldi."
    },
    {
      text: "Hisoblang: 60 - 5",
      correctAnswer: "55",
      distractors: ["50", "45", "65"],
      explanation: "60 - 5 = 55."
    },
    {
      text: "Hisoblang: 70 - 4",
      correctAnswer: "66",
      distractors: ["64", "65", "56"],
      explanation: "70 - 4 = 66."
    },
    {
      text: "Hisoblang: 80 - 9",
      correctAnswer: "71",
      distractors: ["79", "69", "72"],
      explanation: "80 - 9 = 71."
    },
    {
      text: "Hisoblang: 90 - 3",
      correctAnswer: "87",
      distractors: ["83", "93", "77"],
      explanation: "90 - 3 = 87."
    },
    {
      text: "Hisoblang: 30 - 2",
      correctAnswer: "28",
      distractors: ["27", "29", "18"],
      explanation: "30 - 2 = 28."
    },
    {
      text: "Haftada 7 kun bor. 30 kunda 4 to'liq hafta (28 kun) va yana necha kun bor?",
      correctAnswer: "2",
      distractors: ["1", "3", "4"],
      explanation: "30 - 28 = 2 kun ortiqcha."
    },
    {
      text: "Hisoblang: 20 - 7",
      correctAnswer: "13",
      distractors: ["17", "14", "15"],
      explanation: "20 - 7 = 13."
    },
    {
      text: "Tenglamani yeching: 30 - x = 24",
      correctAnswer: "6",
      distractors: ["5", "7", "4"],
      explanation: "x = 30 - 24 = 6."
    },
    {
      text: "Tenglamani yeching: y + 8 = 40",
      correctAnswer: "32",
      distractors: ["38", "48", "30"],
      explanation: "y = 40 - 8 = 32."
    },
    {
      text: "Taqqoslang: 30 - 7 va 20 + 4",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "30 - 7 = 23, 20 + 4 = 24. 23 < 24."
    },
    {
      text: "Taqqoslang: 50 - 6 va 40 + 4",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "50 - 6 = 44, 40 + 4 = 44. Ular teng: 44 = 44."
    },
    {
      text: "Kutubxonadagi 30 ta yangi taqvimdan 5 tasi tarqatildi. Nechta taqvim qoldi?",
      correctAnswer: "25",
      distractors: ["20", "24", "26"],
      explanation: "30 - 5 = 25 ta taqvim qoldi."
    },
    {
      text: "40 - 3 amalini bajarishda 40 soni qanday ikkita songa ajratiladi?",
      correctAnswer: "30 va 10",
      distractors: ["20 va 20", "35 va 5", "38 va 2"],
      explanation: "Birlikni ayirish uchun 40 soni 30 va 10 ga ajratiladi."
    },
    {
      text: "Hisoblang: 60 - 8",
      correctAnswer: "52",
      distractors: ["51", "54", "48"],
      explanation: "60 - 8 = 52."
    },
    {
      text: "Hisoblang: 100 - 4",
      correctAnswer: "96",
      distractors: ["94", "95", "86"],
      explanation: "100 - 4 = 96."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: 50 - * = 41?",
      correctAnswer: "9",
      distractors: ["8", "7", "11"],
      explanation: "50 - 41 = 9."
    }
  ]
};

export const unit15: Grade2UnitDef = {
  order: 15,
  bookNumber: 15,
  unitType: "LESSON",
  title: "Sonlarni qo‘shish (21 + 39)",
  emoji: "🤝",
  crossTopic: "Hamkorlikdagi mehnat",
  shortDesc: "Birliklar yig'indisi 10 bo'ladigan sonlarni qo'shish usuli",
  intro: "Hamkorlikdagi mehnatda kuch birlashadi. Matematikada ham birliklar yig'indisi 10 bo'lganda yangi o'nlik hosil bo'ladi: 21 + 39 = 60!",
  keyPoints: [
    "Birliklar qo'shiladi: 1 + 9 = 10 (bitta o'nlik).",
    "O'nliklar qo'shiladi: 20 + 30 = 50.",
    "Hammasi birlashtiriladi: 50 + 10 = 60."
  ],
  miniExample: {
    emojis: "🤝 21 + 39 = 60",
    text: "21 ga 39 ni qo'shish: 20 + 30 = 50, 1 + 9 = 10; 50 + 10 = 60."
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Hisoblang: 21 + 39",
      correctAnswer: "60",
      distractors: ["50", "59", "61"],
      explanation: "20 + 30 = 50, 1 + 9 = 10. 50 + 10 = 60."
    },
    {
      text: "Hisoblang: 34 + 26",
      correctAnswer: "60",
      distractors: ["58", "62", "50"],
      explanation: "30 + 20 = 50, 4 + 6 = 10. 50 + 10 = 60."
    },
    {
      text: "Hasharda bolalar 14 ta archa va 36 ta terak ko'chati o'tqazdilar. Jami nechta daraxt ekildi?",
      correctAnswer: "50",
      distractors: ["40", "48", "52"],
      explanation: "14 + 36 = 10 + 30 + 4 + 6 = 40 + 10 = 50."
    }
  ],
  test: [
    {
      text: "Hisoblang: 21 + 39",
      correctAnswer: "60",
      distractors: ["50", "59", "61"],
      explanation: "20 + 30 = 50, 1 + 9 = 10. 50 + 10 = 60."
    },
    {
      text: "Hisoblang: 34 + 26",
      correctAnswer: "60",
      distractors: ["58", "62", "50"],
      explanation: "30 + 20 = 50, 4 + 6 = 10. 50 + 10 = 60."
    },
    {
      text: "Hisoblang: 17 + 43",
      correctAnswer: "60",
      distractors: ["50", "59", "70"],
      explanation: "10 + 40 = 50, 7 + 3 = 10. 50 + 10 = 60."
    },
    {
      text: "Hasharda bir guruh 25 ta, ikkinchi guruh 35 ta daraxt oqladi. Jami nechta daraxt oqlandi?",
      correctAnswer: "60",
      distractors: ["50", "55", "65"],
      explanation: "25 + 35 = 20 + 30 + 5 + 5 = 50 + 10 = 60."
    },
    {
      text: "Hisoblang: 48 + 32",
      correctAnswer: "80",
      distractors: ["70", "78", "82"],
      explanation: "40 + 30 = 70, 8 + 2 = 10. 70 + 10 = 80."
    },
    {
      text: "Hisoblang: 56 + 24",
      correctAnswer: "80",
      distractors: ["70", "82", "78"],
      explanation: "50 + 20 = 70, 6 + 4 = 10. 70 + 10 = 80."
    },
    {
      text: "Hisoblang: 63 + 17",
      correctAnswer: "80",
      distractors: ["70", "79", "83"],
      explanation: "60 + 10 = 70, 3 + 7 = 10. 70 + 10 = 80."
    },
    {
      text: "Hisoblang: 72 + 18",
      correctAnswer: "90",
      distractors: ["80", "88", "92"],
      explanation: "70 + 10 = 80, 2 + 8 = 10. 80 + 10 = 90."
    },
    {
      text: "Hisoblang: 29 + 41",
      correctAnswer: "70",
      distractors: ["60", "68", "72"],
      explanation: "20 + 40 = 60, 9 + 1 = 10. 60 + 10 = 70."
    },
    {
      text: "Bir brigada 31 metr, ikkinchi brigada 49 metr yo'l ta'mirladi. Jami necha metr yo'l ta'mirlandi?",
      correctAnswer: "80",
      distractors: ["70", "75", "85"],
      explanation: "31 + 49 = 80 metr."
    },
    {
      text: "Tenglamani yeching: x - 26 = 34",
      correctAnswer: "60",
      distractors: ["50", "58", "62"],
      explanation: "x = 34 + 26 = 60."
    },
    {
      text: "Tenglamani yeching: y + 38 = 70",
      correctAnswer: "32",
      distractors: ["30", "42", "22"],
      explanation: "y = 70 - 38 = 32."
    },
    {
      text: "Hisoblang: 15 + 65",
      correctAnswer: "80",
      distractors: ["70", "75", "85"],
      explanation: "10 + 60 = 70, 5 + 5 = 10. 70 + 10 = 80."
    },
    {
      text: "Taqqoslang: 21 + 39 va 15 + 45",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "21 + 39 = 60 va 15 + 45 = 60. Ular teng: 60 = 60."
    },
    {
      text: "Taqqoslang: 37 + 23 va 50 + 9",
      correctAnswer: ">",
      distractors: ["<", "=", "+"],
      explanation: "37 + 23 = 60, 50 + 9 = 59. 60 > 59."
    },
    {
      text: "Hisoblang: 44 + 36",
      correctAnswer: "80",
      distractors: ["70", "78", "82"],
      explanation: "40 + 30 = 70, 4 + 6 = 10. 70 + 10 = 80."
    },
    {
      text: "Qaysi juftlikdagi sonlar yig'indisi yaxlit o'nlik bo'ladi?",
      correctAnswer: "21 va 39",
      distractors: ["22 va 35", "14 va 23", "31 va 42"],
      explanation: "21 + 39 = 60. Birliklari 1 + 9 = 10 bo'lgani uchun natija yaxlit o'nlik."
    },
    {
      text: "Hisoblang: 53 + 37",
      correctAnswer: "90",
      distractors: ["80", "88", "92"],
      explanation: "50 + 30 = 80, 3 + 7 = 10. 80 + 10 = 90."
    },
    {
      text: "Hisoblang: 12 + 68",
      correctAnswer: "80",
      distractors: ["70", "78", "82"],
      explanation: "10 + 60 = 70, 2 + 8 = 10. 70 + 10 = 80."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: * + 27 = 50?",
      correctAnswer: "23",
      distractors: ["25", "33", "27"],
      explanation: "50 - 27 = 23."
    }
  ]
};

export const unit16: Grade2UnitDef = {
  order: 16,
  bookNumber: 16,
  unitType: "LESSON",
  title: "Sonlarni qo‘shish (21 + 39)",
  emoji: "⛏️",
  crossTopic: "Foydali qazilmalar",
  shortDesc: "O'nlik hosil qilib qo'shishni mustahkamlash va masalalar",
  intro: "Konchilar mehnat qilib ko'mir, oltin va mis qazib olishadi. Biz esa yaxlit sonlar hosil qilish orqali masalalarni yechamiz.",
  keyPoints: [
    "Qo'shishda qulay guruhlash: (21 + 15) + 39 = (21 + 39) + 15 = 60 + 15 = 75.",
    "Birliklari 10 ni beruvchi sonlar: 1 va 9, 2 va 8, 3 va 7, 4 va 6, 5 va 5.",
    "Foydali qazilmalar hajmini hisoblashda yaxlit sonlar amallarni tezlashtiradi."
  ],
  miniExample: {
    emojis: "⛏️ (21 + 39) + 15 = 75",
    text: "21 va 39 ni guruhlasak 60 bo'ladi, 60 ga 15 ni qo'shsak 75!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Qulay usulda hisoblang: (21 + 39) + 14",
      correctAnswer: "74",
      distractors: ["64", "84", "70"],
      explanation: "21 + 39 = 60, 60 + 14 = 74."
    },
    {
      text: "Konda 32 tonna temir va 48 tonna mis qazildi. Jami necha tonna ruda qazildi?",
      correctAnswer: "80",
      distractors: ["70", "78", "85"],
      explanation: "32 + 48 = 80 tonna."
    },
    {
      text: "Hisoblang: 64 + 16",
      correctAnswer: "80",
      distractors: ["70", "78", "82"],
      explanation: "60 + 10 = 70, 4 + 6 = 10. 70 + 10 = 80."
    }
  ],
  test: [
    {
      text: "Hisoblang: 21 + 39",
      correctAnswer: "60",
      distractors: ["58", "62", "70"],
      explanation: "20 + 30 = 50, 1 + 9 = 10. 50 + 10 = 60."
    },
    {
      text: "Hisoblang: 32 + 48",
      correctAnswer: "80",
      distractors: ["70", "78", "82"],
      explanation: "30 + 40 = 70, 2 + 8 = 10. 70 + 10 = 80."
    },
    {
      text: "Kondan birinchi smenada 26 vagon, ikkinchi smenada 34 vagon ko'mir chiqarildi. Jami necha vagon?",
      correctAnswer: "60",
      distractors: ["50", "55", "65"],
      explanation: "26 + 34 = 60 vagon."
    },
    {
      text: "Qulay usulda hisoblang: (17 + 23) + 18",
      correctAnswer: "58",
      distractors: ["60", "48", "68"],
      explanation: "17 + 23 = 40, 40 + 18 = 58."
    },
    {
      text: "Hisoblang: 54 + 26",
      correctAnswer: "80",
      distractors: ["70", "78", "84"],
      explanation: "50 + 20 = 70, 4 + 6 = 10. 70 + 10 = 80."
    },
    {
      text: "Hisoblang: 61 + 29",
      correctAnswer: "90",
      distractors: ["80", "89", "91"],
      explanation: "60 + 20 = 80, 1 + 9 = 10. 80 + 10 = 90."
    },
    {
      text: "Oltin konida 13 ta katta va 27 ta kichik texnika ishlamoqda. Jami texnikalar soni nechta?",
      correctAnswer: "40",
      distractors: ["30", "35", "45"],
      explanation: "13 + 27 = 40 ta."
    },
    {
      text: "Tenglamani yeching: a - 39 = 21",
      correctAnswer: "60",
      distractors: ["50", "58", "62"],
      explanation: "a = 21 + 39 = 60."
    },
    {
      text: "Tenglamani yeching: x + 44 = 70",
      correctAnswer: "26",
      distractors: ["24", "36", "16"],
      explanation: "x = 70 - 44 = 26."
    },
    {
      text: "Hisoblang: 35 + 45",
      correctAnswer: "80",
      distractors: ["70", "75", "85"],
      explanation: "30 + 40 = 70, 5 + 5 = 10. 70 + 10 = 80."
    },
    {
      text: "Hisoblang: 73 + 17",
      correctAnswer: "90",
      distractors: ["80", "88", "92"],
      explanation: "70 + 10 = 80, 3 + 7 = 10. 80 + 10 = 90."
    },
    {
      text: "Taqqoslang: 21 + 39 va 40 + 20",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "21 + 39 = 60 va 40 + 20 = 60. Ular teng: 60 = 60."
    },
    {
      text: "Taqqoslang: 36 + 24 va 70 - 15",
      correctAnswer: ">",
      distractors: ["<", "=", "+"],
      explanation: "36 + 24 = 60, 70 - 15 = 55. 60 > 55."
    },
    {
      text: "Hisoblang: 28 + 52",
      correctAnswer: "80",
      distractors: ["70", "78", "82"],
      explanation: "20 + 50 = 70, 8 + 2 = 10. 70 + 10 = 80."
    },
    {
      text: "Qulay usulda hisoblang: 25 + 37 + 15",
      correctAnswer: "77",
      distractors: ["75", "87", "67"],
      explanation: "(25 + 15) + 37 = 40 + 37 = 77."
    },
    {
      text: "Geologlar 19 km tog' yo'lidan va 31 km tekislikdan yurdilar. Jami masofa necha kilometr?",
      correctAnswer: "50",
      distractors: ["40", "45", "55"],
      explanation: "19 + 31 = 50 km."
    },
    {
      text: "Hisoblang: 47 + 23",
      correctAnswer: "70",
      distractors: ["60", "68", "72"],
      explanation: "40 + 20 = 60, 7 + 3 = 10. 60 + 10 = 70."
    },
    {
      text: "Hisoblang: 16 + 54",
      correctAnswer: "70",
      distractors: ["60", "68", "72"],
      explanation: "10 + 50 = 60, 6 + 4 = 10. 60 + 10 = 70."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: 33 + * = 70?",
      correctAnswer: "37",
      distractors: ["47", "33", "27"],
      explanation: "70 - 33 = 37."
    },
    {
      text: "Hisoblang: 38 + 42",
      correctAnswer: "80",
      distractors: ["70", "78", "82"],
      explanation: "30 + 40 = 70, 8 + 2 = 10. 70 + 10 = 80."
    }
  ]
};

export const unit17: Grade2UnitDef = {
  order: 17,
  bookNumber: 17,
  unitType: "LESSON",
  title: "Ayirish (50 - 22)",
  emoji: "🧭",
  crossTopic: "Kompas",
  shortDesc: "Yaxlit sondan ikki xonali sonni ayirish usuli",
  intro: "Sayohatchilar kompas bilan to'g'ri yo'nalishni topishadi. Biz esa 50 - 22 kabi ayirish amallarini bosqichma-bosqich yechishni o'rganamiz.",
  keyPoints: [
    "22 sonini o'nlik va birliklarga ajratamiz: 20 va 2.",
    "1-qadam: Yaxlit sondan o'nlikni ayiramiz: 50 - 20 = 30.",
    "2-qadam: Chiqqan natijadan birlikni ayiramiz: 30 - 2 = 28."
  ],
  miniExample: {
    emojis: "🧭 50 - 22 = 28",
    text: "50 dan 22 ni ayirish: 50 - 20 = 30, so'ngra 30 - 2 = 28!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Hisoblang: 50 - 22",
      correctAnswer: "28",
      distractors: ["38", "26", "32"],
      explanation: "50 - 20 = 30, 30 - 2 = 28."
    },
    {
      text: "Hisoblang: 60 - 27",
      correctAnswer: "33",
      distractors: ["43", "37", "35"],
      explanation: "60 - 20 = 40, 40 - 7 = 33."
    },
    {
      text: "Sayyohlar 40 km yo'ldan 18 km yurgach, yana necha kilometr qoldi?",
      correctAnswer: "22",
      distractors: ["20", "24", "32"],
      explanation: "40 - 18 = 40 - 10 - 8 = 22 km."
    }
  ],
  test: [
    {
      text: "Hisoblang: 50 - 22",
      correctAnswer: "28",
      distractors: ["38", "26", "32"],
      explanation: "50 - 20 = 30, 30 - 2 = 28."
    },
    {
      text: "Hisoblang: 60 - 27",
      correctAnswer: "33",
      distractors: ["43", "37", "35"],
      explanation: "60 - 20 = 40, 40 - 7 = 33."
    },
    {
      text: "Hisoblang: 40 - 15",
      correctAnswer: "25",
      distractors: ["35", "20", "30"],
      explanation: "40 - 10 = 30, 30 - 5 = 25."
    },
    {
      text: "Sayohatchilar 50 km yo'lning 34 km qismini bosib o'tdilar. Qolgan masofani toping.",
      correctAnswer: "16",
      distractors: ["14", "26", "18"],
      explanation: "50 - 34 = 50 - 30 - 4 = 16 km."
    },
    {
      text: "Hisoblang: 70 - 43",
      correctAnswer: "27",
      distractors: ["37", "23", "33"],
      explanation: "70 - 40 = 30, 30 - 3 = 27."
    },
    {
      text: "Hisoblang: 80 - 36",
      correctAnswer: "44",
      distractors: ["54", "46", "56"],
      explanation: "80 - 30 = 50, 50 - 6 = 44."
    },
    {
      text: "Hisoblang: 90 - 52",
      correctAnswer: "38",
      distractors: ["48", "32", "42"],
      explanation: "90 - 50 = 40, 40 - 2 = 38."
    },
    {
      text: "Hisoblang: 50 - 18",
      correctAnswer: "32",
      distractors: ["42", "28", "38"],
      explanation: "50 - 10 = 40, 40 - 8 = 32."
    },
    {
      text: "Hisoblang: 30 - 14",
      correctAnswer: "16",
      distractors: ["26", "14", "18"],
      explanation: "30 - 10 = 20, 20 - 4 = 16."
    },
    {
      text: "Tenglamani yeching: 50 - x = 28",
      correctAnswer: "22",
      distractors: ["32", "18", "24"],
      explanation: "x = 50 - 28 = 22."
    },
    {
      text: "Tenglamani yeching: 70 - y = 35",
      correctAnswer: "35",
      distractors: ["45", "25", "40"],
      explanation: "y = 70 - 35 = 35."
    },
    {
      text: "Taqqoslang: 50 - 22 va 60 - 32",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "50 - 22 = 28 va 60 - 32 = 28. Ular teng: 28 = 28."
    },
    {
      text: "Taqqoslang: 50 - 22 va 30",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "50 - 22 = 28. 28 < 30."
    },
    {
      text: "Hisoblang: 60 - 19",
      correctAnswer: "41",
      distractors: ["51", "39", "49"],
      explanation: "60 - 10 = 50, 50 - 9 = 41."
    },
    {
      text: "Hisoblang: 80 - 64",
      correctAnswer: "16",
      distractors: ["26", "18", "24"],
      explanation: "80 - 60 = 20, 20 - 4 = 16."
    },
    {
      text: "Sayyohlar 100 km yo'ldan 45 km yurishdi. Qolgan masofani toping.",
      correctAnswer: "55",
      distractors: ["45", "65", "50"],
      explanation: "100 - 45 = 55 km."
    },
    {
      text: "Hisoblang: 50 - 27",
      correctAnswer: "23",
      distractors: ["33", "27", "17"],
      explanation: "50 - 20 = 30, 30 - 7 = 23."
    },
    {
      text: "Hisoblang: 70 - 58",
      correctAnswer: "12",
      distractors: ["22", "14", "18"],
      explanation: "70 - 50 = 20, 20 - 8 = 12."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: 60 - * = 37?",
      correctAnswer: "23",
      distractors: ["33", "27", "17"],
      explanation: "60 - 37 = 23."
    },
    {
      text: "Hisoblang: 40 - 23",
      correctAnswer: "17",
      distractors: ["27", "13", "23"],
      explanation: "40 - 20 = 20, 20 - 3 = 17."
    }
  ]
};

export const unit18: Grade2UnitDef = {
  order: 18,
  bookNumber: 18,
  unitType: "LESSON",
  title: "Ayirish (50 - 22)",
  emoji: "🌱",
  crossTopic: "Bahorgi yumushlar",
  shortDesc: "Yaxlit sondan ayirishni mustahkamlash va tekshirish",
  intro: "Bahorda har bir nihol mehr bilan ekiladi. Ayirish amallarini to'g'ri bajarib, natijani qo'shish bilan tekshiramiz.",
  keyPoints: [
    "50 - 22 = 28 ekanini tekshirish uchun 28 ga 22 ni qo'shamiz: 28 + 22 = 50.",
    "Ayirma bilan ayriluvchi yig'indisi kamayuvchiga teng bo'ladi.",
    "Bahorgi ekinlar va ko'chatlar soni bo'yicha masalalarni oson yechamiz."
  ],
  miniExample: {
    emojis: "🌱 50 - 22 = 28",
    text: "Tekshirish: 28 + 22 = 50. Demak, ayirish to'g'ri bajarilgan!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Hisoblang: 50 - 22",
      correctAnswer: "28",
      distractors: ["38", "26", "32"],
      explanation: "50 - 20 = 30, 30 - 2 = 28."
    },
    {
      text: "Bog'bon 50 tup ko'chatdan 26 tasini o'tqazdi. Yana nechta ko'chat ekilishi kerak?",
      correctAnswer: "24",
      distractors: ["34", "26", "22"],
      explanation: "50 - 26 = 24 ta ko'chat."
    },
    {
      text: "Hisoblang: 60 - 35",
      correctAnswer: "25",
      distractors: ["35", "20", "30"],
      explanation: "60 - 30 = 30, 30 - 5 = 25."
    }
  ],
  test: [
    {
      text: "Hisoblang: 50 - 22",
      correctAnswer: "28",
      distractors: ["38", "26", "32"],
      explanation: "50 - 20 = 30, 30 - 2 = 28."
    },
    {
      text: "Bog'bon 50 ta ko'chatdan 26 tasini o'tqazdi. Yana nechta ko'chat ekilishi kerak?",
      correctAnswer: "24",
      distractors: ["34", "26", "22"],
      explanation: "50 - 26 = 24 ta ko'chat."
    },
    {
      text: "Hisoblang: 60 - 35",
      correctAnswer: "25",
      distractors: ["35", "20", "30"],
      explanation: "60 - 30 = 30, 30 - 5 = 25."
    },
    {
      text: "Hisoblang: 70 - 28",
      correctAnswer: "42",
      distractors: ["52", "48", "38"],
      explanation: "70 - 20 = 50, 50 - 8 = 42."
    },
    {
      text: "Issiqxonada 80 tup guldan 33 tasi ochildi. Nechta gul hali ochilmagan?",
      correctAnswer: "47",
      distractors: ["57", "43", "53"],
      explanation: "80 - 33 = 47 ta."
    },
    {
      text: "Hisoblang: 90 - 46",
      correctAnswer: "44",
      distractors: ["54", "46", "34"],
      explanation: "90 - 40 = 50, 50 - 6 = 44."
    },
    {
      text: "Hisoblang: 40 - 17",
      correctAnswer: "23",
      distractors: ["33", "27", "17"],
      explanation: "40 - 10 = 30, 30 - 7 = 23."
    },
    {
      text: "Tenglamani yeching: 50 - y = 19",
      correctAnswer: "31",
      distractors: ["41", "29", "39"],
      explanation: "y = 50 - 19 = 31."
    },
    {
      text: "Tenglamani yeching: x + 24 = 60",
      correctAnswer: "36",
      distractors: ["46", "34", "44"],
      explanation: "x = 60 - 24 = 36."
    },
    {
      text: "50 - 22 = 28 ekanligini qaysi ifoda bilan to'g'ri tekshirish mumkin?",
      correctAnswer: "28 + 22 = 50",
      distractors: ["50 + 22 = 72", "28 - 22 = 6", "50 + 28 = 78"],
      explanation: "Ayirish amali qo'shish bilan tekshiriladi: 28 + 22 = 50."
    },
    {
      text: "Taqqoslang: 60 - 25 va 50 - 15",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "60 - 25 = 35 va 50 - 15 = 35. Ular teng: 35 = 35."
    },
    {
      text: "Taqqoslang: 70 - 22 va 50",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "70 - 22 = 48. 48 < 50."
    },
    {
      text: "Hisoblang: 80 - 53",
      correctAnswer: "27",
      distractors: ["37", "23", "33"],
      explanation: "80 - 50 = 30, 30 - 3 = 27."
    },
    {
      text: "Hisoblang: 30 - 12",
      correctAnswer: "18",
      distractors: ["28", "16", "22"],
      explanation: "30 - 10 = 20, 20 - 2 = 18."
    },
    {
      text: "Gulzorga 70 ta guldan 38 tasi qizil lola, qolgani sariq. Sariq lolalar nechta?",
      correctAnswer: "32",
      distractors: ["42", "38", "28"],
      explanation: "70 - 38 = 32 ta sariq lola."
    },
    {
      text: "Hisoblang: 50 - 36",
      correctAnswer: "14",
      distractors: ["24", "16", "26"],
      explanation: "50 - 30 = 20, 20 - 6 = 14."
    },
    {
      text: "Hisoblang: 100 - 34",
      correctAnswer: "66",
      distractors: ["76", "64", "56"],
      explanation: "100 - 30 = 70, 70 - 4 = 66."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: 80 - * = 45?",
      correctAnswer: "35",
      distractors: ["45", "25", "30"],
      explanation: "80 - 45 = 35."
    },
    {
      text: "Hisoblang: 60 - 47",
      correctAnswer: "13",
      distractors: ["23", "17", "27"],
      explanation: "60 - 40 = 20, 20 - 7 = 13."
    },
    {
      text: "Hisoblang: 50 - 29",
      correctAnswer: "21",
      distractors: ["31", "19", "29"],
      explanation: "50 - 20 = 30, 30 - 9 = 21."
    }
  ]
};

export const unit19: Grade2UnitDef = {
  order: 19,
  bookNumber: null,
  unitType: "FINAL_LESSON",
  title: "Mavzu bo'yicha yakuniy dars",
  emoji: "🌍",
  crossTopic: "Men va tabiat",
  shortDesc: "II bob bo'yicha yakuniy mustahkamlash va test",
  intro: "II bobda ikki xonali sonlar, xona birliklari, yaxlit sonlar bilan qo'shish va ayirishni o'rgandik. Tabiatni asrash va bilimlarimizni sinovdan o'tkazamiz!",
  keyPoints: [
    "1 o'nlik = 10 birlik, 1 yuzlik = 100 birlik.",
    "Yaxlit o'nlikka to'ldirish: 21 + 39 = 60.",
    "Yaxlit o'nlikdan ayirish: 30 - 7 = 23 va 50 - 22 = 28."
  ],
  miniExample: {
    emojis: "🌍 30 - 7 = 23 | 21 + 39 = 60 | 50 - 22 = 28",
    text: "II bobdagi barcha asosiy amallarni mustahkamlaymiz!"
  },
  xpReward: 130,
  coinReward: 15,
  estMinutes: 10,
  practice: [
    {
      text: "Hisoblang: 30 - 6",
      correctAnswer: "24",
      distractors: ["26", "34", "14"],
      explanation: "30 - 6 = 24."
    },
    {
      text: "Hisoblang: 21 + 39",
      correctAnswer: "60",
      distractors: ["50", "59", "61"],
      explanation: "20 + 30 = 50, 1 + 9 = 10. 50 + 10 = 60."
    },
    {
      text: "Hisoblang: 50 - 22",
      correctAnswer: "28",
      distractors: ["38", "26", "32"],
      explanation: "50 - 20 = 30, 30 - 2 = 28."
    }
  ],
  test: [
    {
      text: "Hisoblang: 30 - 6",
      correctAnswer: "24",
      distractors: ["26", "34", "14"],
      explanation: "30 - 6 = 24."
    },
    {
      text: "Hisoblang: 21 + 39",
      correctAnswer: "60",
      distractors: ["50", "59", "61"],
      explanation: "20 + 30 = 50, 1 + 9 = 10. 50 + 10 = 60."
    },
    {
      text: "Hisoblang: 50 - 22",
      correctAnswer: "28",
      distractors: ["38", "26", "32"],
      explanation: "50 - 20 = 30, 30 - 2 = 28."
    },
    {
      text: "4 o'nlik va 8 birlikdan iborat son qaysi?",
      correctAnswer: "48",
      distractors: ["84", "40", "80"],
      explanation: "4 o'nlik va 8 birlik = 48."
    },
    {
      text: "Hisoblang: 60 - 9",
      correctAnswer: "51",
      distractors: ["59", "49", "52"],
      explanation: "60 - 9 = 51."
    },
    {
      text: "Hisoblang: 35 + 45",
      correctAnswer: "80",
      distractors: ["70", "75", "85"],
      explanation: "30 + 40 = 70, 5 + 5 = 10. 70 + 10 = 80."
    },
    {
      text: "Hisoblang: 70 - 34",
      correctAnswer: "36",
      distractors: ["46", "34", "44"],
      explanation: "70 - 30 = 40, 40 - 4 = 36."
    },
    {
      text: "Qaysi juftlikdagi sonlar yig'indisi 50 ga teng?",
      correctAnswer: "23 va 27",
      distractors: ["21 va 39", "18 va 22", "35 va 25"],
      explanation: "23 + 27 = 50."
    },
    {
      text: "Tabiat burchagi uchun 40 tup gul ekish kerak edi. 17 tup ekildi. Yana nechta ekish kerak?",
      correctAnswer: "23",
      distractors: ["21", "27", "33"],
      explanation: "40 - 17 = 23 ta."
    },
    {
      text: "Tenglamani yeching: x + 28 = 50",
      correctAnswer: "22",
      distractors: ["32", "24", "18"],
      explanation: "x = 50 - 28 = 22."
    },
    {
      text: "Tenglamani yeching: 60 - y = 25",
      correctAnswer: "35",
      distractors: ["45", "25", "30"],
      explanation: "y = 60 - 25 = 35."
    },
    {
      text: "Taqqoslang: 30 - 8 va 15 + 7",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "30 - 8 = 22 va 15 + 7 = 22. Ular teng: 22 = 22."
    },
    {
      text: "Taqqoslang: 50 - 16 va 40 - 5",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "50 - 16 = 34, 40 - 5 = 35. 34 < 35."
    },
    {
      text: "Hisoblang: (50 - 20) - 7",
      correctAnswer: "23",
      distractors: ["25", "33", "27"],
      explanation: "50 - 20 = 30, 30 - 7 = 23."
    },
    {
      text: "Bog'da 80 ta daraxt bor: 26 olma, 34 nok, qolgani olcha. Olcha nechta?",
      correctAnswer: "20",
      distractors: ["18", "22", "24"],
      explanation: "26 + 34 = 60, 80 - 60 = 20 ta olcha."
    },
    {
      text: "Hisoblang: 48 + 32",
      correctAnswer: "80",
      distractors: ["70", "78", "82"],
      explanation: "40 + 30 = 70, 8 + 2 = 10. 70 + 10 = 80."
    },
    {
      text: "Hisoblang: 100 - 47",
      correctAnswer: "53",
      distractors: ["63", "57", "43"],
      explanation: "100 - 40 = 60, 60 - 7 = 53."
    },
    {
      text: "Hisoblang: 70 - 46",
      correctAnswer: "24",
      distractors: ["34", "26", "36"],
      explanation: "70 - 40 = 30, 30 - 6 = 24."
    },
    {
      text: "Yulduzchaning o'rniga qaysi son mos keladi: * + 36 = 60?",
      correctAnswer: "24",
      distractors: ["34", "26", "36"],
      explanation: "60 - 36 = 24."
    },
    {
      text: "Yaxlit sondan ayirishda to'g'ri ifodani toping.",
      correctAnswer: "50 - 23 = 27",
      distractors: ["50 - 23 = 37", "50 - 23 = 26", "50 - 23 = 33"],
      explanation: "50 - 20 = 30, 30 - 3 = 27."
    }
  ]
};

const allUnits = [unit14, unit15, unit16, unit17, unit18, unit19];

for (const u of allUnits) {
  const seed = buildGrade2UnitSeed(u);
  saveGrade2UnitFile(u.order, seed);
  console.log(`✅ Saved Grade 2 unit-${u.order < 10 ? '0' + u.order : u.order}.json`);
}
