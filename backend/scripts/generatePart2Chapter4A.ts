import { LessonDataDef, buildLessonSeed, saveLessonFile } from './generatorTypes.js';

const lessons: LessonDataDef[] = [
  // 42. 11 dan 20 gacha bo‘lgan sonlar
  {
    bookNumber: 42,
    title: "11 dan 20 gacha bo‘lgan sonlar",
    emoji: "🔢",
    shortDesc: "11 dan 20 gacha nomlari, o‘nlik va birlik, 1 o‘nl. 3 birl. = 13, 10 + 1.",
    intro: "10 dan keyin o‘n bir, o‘n ikki, ..., yigirma sonlari keladi. Ular o‘nlik va birliklardan tuziladi.",
    keyPoints: [
      "10 ta birlik 1 ta o‘nlikni tashkil qiladi.",
      "1 o‘nlik va 3 birlik — bu 13 soni (10 + 3 = 13).",
      "11 dan 20 gacha bo‘lgan barcha sonlar ikki xonali sonlardir."
    ],
    miniExample: {
      emojis: "🔟 + 3️⃣ = 1️⃣3️⃣",
      text: "1 o‘nlik va 3 birlik — bu 13 soni! (10 + 3 = 13)"
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "1 o‘nlik va 4 birlik qaysi sonni bildiradi?",
        correctAnswer: "14",
        distractors: ["41", "15", "13"],
        explanation: "1 o‘nlik (10) va 4 birlik (4) yig‘indisi 14 dir."
      },
      {
        text: "Hisoblang: 10 + 5 = ?",
        correctAnswer: "15",
        distractors: ["14", "16", "51"],
        explanation: "10 + 5 = 15."
      },
      {
        text: "12 sonidan keyin qaysi son keladi?",
        correctAnswer: "13",
        distractors: ["11", "14", "21"],
        explanation: "12 dan keyingi son 13 dir."
      }
    ],
    test: [
      {
        text: "1 o‘nlik va 1 birlik qaysi son?",
        correctAnswer: "11",
        distractors: ["12", "10", "21"],
        explanation: "10 + 1 = 11 (o‘n bir)."
      },
      {
        text: "1 o‘nlik va 2 birlik qaysi son?",
        correctAnswer: "12",
        distractors: ["11", "13", "20"],
        explanation: "10 + 2 = 12 (o‘n ikki)."
      },
      {
        text: "1 o‘nlik va 5 birlik qaysi son?",
        correctAnswer: "15",
        distractors: ["14", "16", "51"],
        explanation: "10 + 5 = 15 (o‘n besh)."
      },
      {
        text: "1 o‘nlik va 7 birlik qaysi son?",
        correctAnswer: "17",
        distractors: ["16", "18", "71"],
        explanation: "10 + 7 = 17 (o‘n yetti)."
      },
      {
        text: "1 o‘nlik va 8 birlik qaysi son?",
        correctAnswer: "18",
        distractors: ["17", "19", "81"],
        explanation: "10 + 8 = 18 (o‘n sakkiz)."
      },
      {
        text: "2 ta o‘nlik qaysi sonni bildiradi?",
        correctAnswer: "20 (yigirma)",
        distractors: ["12", "2", "200"],
        explanation: "2 ta o‘nlik 20 ga teng."
      },
      {
        text: "Misolni hisoblang: 10 + 6 = ?",
        correctAnswer: "16",
        distractors: ["15", "17", "61"],
        explanation: "10 + 6 = 16."
      },
      {
        text: "Misolni hisoblang: 10 + 9 = ?",
        correctAnswer: "19",
        distractors: ["18", "20", "91"],
        explanation: "10 + 9 = 19."
      },
      {
        text: "14 sonida nechta o‘nlik va nechta birlik bor?",
        correctAnswer: "1 ta o‘nlik va 4 ta birlik",
        distractors: ["4 ta o‘nlik va 1 ta birlik", "14 ta o‘nlik", "1 ta o‘nlik va 5 ta birlik"],
        explanation: "14 = 1 o‘nlik + 4 birlik."
      },
      {
        text: "16 sonida nechta o‘nlik va nechta birlik bor?",
        correctAnswer: "1 ta o‘nlik va 6 ta birlik",
        distractors: ["6 ta o‘nlik va 1 ta birlik", "16 ta birlik faqat", "2 ta o‘nlik"],
        explanation: "16 = 1 o‘nlik + 6 birlik."
      },
      {
        text: "15 dan keyingi son qaysi?",
        correctAnswer: "16",
        distractors: ["14", "17", "18"],
        explanation: "15 dan keyin 16 keladi."
      },
      {
        text: "18 dan oldingi son qaysi?",
        correctAnswer: "17",
        distractors: ["19", "16", "15"],
        explanation: "18 dan oldin 17 turadi."
      },
      {
        text: "13 va 15 orasidagi son qaysi?",
        correctAnswer: "14",
        distractors: ["12", "16", "17"],
        explanation: "13 va 15 orasida 14 soni joylashgan."
      },
      {
        text: "17 va 19 orasidagi son qaysi?",
        correctAnswer: "18",
        distractors: ["16", "20", "15"],
        explanation: "17 va 19 orasida 18 soni joylashgan."
      },
      {
        text: "Sonli chizg‘ichda 12 dan 3 qadam o‘ngga yursak (12 + 3) qaysi songa boramiz?",
        correctAnswer: "15",
        distractors: ["14", "16", "13"],
        explanation: "12 + 3 = 15."
      },
      {
        text: "Sonli chizg‘ichda 14 dan 2 qadam o‘ngga yursak qaysi songa boramiz?",
        correctAnswer: "16",
        distractors: ["15", "17", "12"],
        explanation: "14 + 2 = 16."
      },
      {
        text: "Daftarga 10 ta katak chizildi, yana 3 ta qo‘shildi. Jami nechta katak bo‘ldi?",
        correctAnswer: "13 ta katak",
        distractors: ["12 ta", "14 ta", "15 ta"],
        explanation: "10 + 3 = 13."
      },
      {
        text: "Sardor 10 ta yong‘oqqa yana 7 ta yong‘oq qo‘shdi. Yong‘oqlar nechta bo‘ldi?",
        correctAnswer: "17 ta yong‘oq",
        distractors: ["16 ta", "18 ta", "71 ta"],
        explanation: "10 + 7 = 17 ta yong‘oq."
      },
      {
        text: "Buxorodan Toshkentga kelayotgan poyezdning 19-vagonidan oldingi vagon qaysi?",
        correctAnswer: "18-vagon",
        distractors: ["20-vagon", "17-vagon", "1-vagon"],
        explanation: "19 dan oldingi vagon — 18-vagondir."
      },
      {
        text: "2-qismning 1-mavzusi (42-mavzu) muvaffaqiyatli ochildi! 42-dars qaysi modulga tegishli?",
        correctAnswer: "Matematika · 2-qism",
        distractors: ["Matematika · 1-qism", "Alifbe", "Ona tili"],
        explanation: "42-dars 2-qism modulining birinchi darsidir."
      }
    ]
  },

  // 43. 11 dan 20 gacha bo‘lgan sonlarning o‘nlikda yozilishi
  {
    bookNumber: 43,
    title: "11 dan 20 gacha bo‘lgan sonlarning o‘nlikda yozilishi",
    emoji: "🔢",
    shortDesc: "Ikki xonali son ikkita raqam bilan yoziladi: birinchi raqam o‘nlik, ikkinchisi birlik.",
    intro: "Ikki xonali sonda chapdagi raqam o‘nliklar sonini, o‘ngdagi raqam birliklar sonini bildiradi.",
    keyPoints: [
      "Xonalar nomi: o‘nlar xonasi va birlar xonasi.",
      "13 sonida: 1 ta o‘nlik va 3 ta birlik bor.",
      "10 + 3 = 13 ko‘rinishida xona qo‘shiluvchilariga ajratiladi."
    ],
    miniExample: {
      emojis: "1️⃣ o‘nl. 3️⃣ birl. = 1️⃣3️⃣",
      text: "1 o‘nlik + 3 birlik = 13 (10 + 3 = 13)!"
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "15 sonida o‘nliklar xonasida qaysi raqam turibdi?",
        correctAnswer: "1",
        distractors: ["5", "10", "0"],
        explanation: "Chapdagi 1 raqami o‘nlikni bildiradi."
      },
      {
        text: "15 sonida birliklar xonasida qaysi raqam turibdi?",
        correctAnswer: "5",
        distractors: ["1", "15", "0"],
        explanation: "O‘ngdagi 5 raqami birliklarni bildiradi."
      },
      {
        text: "18 sonini xona qo‘shiluvchilariga ajrating:",
        correctAnswer: "10 + 8",
        distractors: ["10 + 7", "10 + 9", "18 + 0"],
        explanation: "18 = 10 + 8."
      }
    ],
    test: [
      {
        text: "17 sonida nechta o‘nlik bor?",
        correctAnswer: "1 ta o‘nlik",
        distractors: ["7 ta o‘nlik", "17 ta o‘nlik", "0 ta"],
        explanation: "17 sonida 1 ta o‘nlik bor."
      },
      {
        text: "17 sonida nechta birlik bor?",
        correctAnswer: "7 ta birlik",
        distractors: ["1 ta birlik", "17 ta birlik", "10 ta birlik"],
        explanation: "17 sonida 7 ta birlik bor."
      },
      {
        text: "12 sonini xona qo‘shiluvchilariga ajrating:",
        correctAnswer: "10 + 2",
        distractors: ["10 + 1", "10 + 3", "20 + 2"],
        explanation: "12 = 10 + 2."
      },
      {
        text: "14 sonini xona qo‘shiluvchilariga ajrating:",
        correctAnswer: "10 + 4",
        distractors: ["10 + 3", "10 + 5", "40 + 1"],
        explanation: "14 = 10 + 4."
      },
      {
        text: "16 sonini xona qo‘shiluvchilariga ajrating:",
        correctAnswer: "10 + 6",
        distractors: ["10 + 5", "10 + 7", "60 + 1"],
        explanation: "16 = 10 + 6."
      },
      {
        text: "19 sonini xona qo‘shiluvchilariga ajrating:",
        correctAnswer: "10 + 9",
        distractors: ["10 + 8", "10 + 10", "90 + 1"],
        explanation: "19 = 10 + 9."
      },
      {
        text: "Ikki xonali sonda birinchi (chapdagi) raqam nimani bildiradi?",
        correctAnswer: "O‘nliklar sonini",
        distractors: ["Birliklar sonini", "Yuzliklar sonini", "Natijani"],
        explanation: "Chapdagi birinchi raqam o‘nliklar xonasidir."
      },
      {
        text: "Ikki xonali sonda ikkinchi (o‘ngdagi) raqam nimani bildiradi?",
        correctAnswer: "Birliklar sonini",
        distractors: ["O‘nliklar sonini", "Yuzliklar sonini", "Bo‘linuvchini"],
        explanation: "O‘ngdagi ikkinchi raqam birliklar xonasidir."
      },
      {
        text: "20 sonida nechta o‘nlik va nechta birlik bor?",
        correctAnswer: "2 ta o‘nlik va 0 ta birlik",
        distractors: ["0 ta o‘nlik va 2 ta birlik", "1 ta o‘nlik va 10 ta birlik", "20 ta o‘nlik"],
        explanation: "20 da 2 ta o‘nlik va 0 ta birlik bor."
      },
      {
        text: "13 sonidan 10 ni ayirsak necha qoladi: 13 − 10 = ?",
        correctAnswer: "3 (birliklar qoladi)",
        distractors: ["2", "4", "1"],
        explanation: "13 − 10 = 3."
      },
      {
        text: "17 sonidan 10 ni ayirsak necha qoladi: 17 − 10 = ?",
        correctAnswer: "7",
        distractors: ["6", "8", "1"],
        explanation: "17 − 10 = 7."
      },
      {
        text: "15 sonidan 5 ni ayirsak necha qoladi: 15 − 5 = ?",
        correctAnswer: "10 (to‘liq o‘nlik qoladi)",
        distractors: ["9", "11", "1"],
        explanation: "15 − 5 = 10."
      },
      {
        text: "18 sonidan 8 ni ayirsak necha qoladi: 18 − 8 = ?",
        correctAnswer: "10",
        distractors: ["9", "11", "8"],
        explanation: "18 − 8 = 10."
      },
      {
        text: "11 sonidan 1 ni ayirsak necha qoladi: 11 − 1 = ?",
        correctAnswer: "10",
        distractors: ["9", "1", "11"],
        explanation: "11 − 1 = 10."
      },
      {
        text: "Katak daftarda 14 soni nechta katakka yoziladi?",
        correctAnswer: "2 ta katakka (har bir raqam bitta katakka)",
        distractors: ["1 ta katakka", "3 ta katakka", "4 ta katakka"],
        explanation: "1 raqami bir katakka, 4 raqami yonidagi katakka yoziladi."
      },
      {
        text: "Qaysi sonda birliklar soni 6 ga teng?",
        correctAnswer: "16",
        distractors: ["15", "17", "60"],
        explanation: "16 sonida birliklar 6 ga teng."
      },
      {
        text: "Qaysi sonda birliklar soni 8 ga teng?",
        correctAnswer: "18",
        distractors: ["17", "19", "80"],
        explanation: "18 sonida birliklar 8 ga teng."
      },
      {
        text: "O‘qituvchi doskaga 1 ta o‘nlik va 9 ta birlik yozdi. Bu qaysi son?",
        correctAnswer: "19",
        distractors: ["18", "91", "20"],
        explanation: "1 o‘nlik va 9 birlik — 19 soni."
      },
      {
        text: "Dilnoza 10 ta qizil va 4 ta ko‘k qalam oldi. Jami qalamlar nechta?",
        correctAnswer: "14 ta qalam (10 + 4 = 14)",
        distractors: ["13 ta", "15 ta", "41 ta"],
        explanation: "10 + 4 = 14 ta qalam."
      },
      {
        text: "To‘g‘ri tenglikni toping:",
        correctAnswer: "10 + 7 = 17",
        distractors: ["10 + 7 = 16", "10 + 7 = 71", "10 + 7 = 18"],
        explanation: "10 + 7 = 17 to‘g‘ri tenglikdir."
      }
    ]
  },

  // 44. 11 va 12 sonlari
  {
    bookNumber: 44,
    title: "11 va 12 sonlari",
    emoji: "🔢",
    shortDesc: "11 va 12 sonlari tarkibi (10+1, 9+2, 8+3; 6+6), 11+5, 12-4 va masalalar.",
    intro: "11 va 12 sonlarining qo‘shish va ayirish tarkibini mukammal o‘rganamiz.",
    keyPoints: [
      "11 sonining tarkibi: 10+1, 9+2, 8+3, 7+4, 6+5.",
      "12 sonining tarkibi: 10+2, 9+3, 8+4, 7+5, 6+6.",
      "12 dan ayirish: 12 − 4 = 8, 12 − 6 = 6."
    ],
    miniExample: {
      emojis: "6️⃣ + 6️⃣ = 1️⃣2️⃣",
      text: "6 va 6 qo‘shilsa 12 bo‘ladi: bir do‘jina (12 ta)!"
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Hisoblang: 9 + 2 = ?",
        correctAnswer: "11",
        distractors: ["10", "12", "13"],
        explanation: "9 + 2 = 11."
      },
      {
        text: "Hisoblang: 6 + 6 = ?",
        correctAnswer: "12",
        distractors: ["11", "13", "10"],
        explanation: "6 + 6 = 12."
      },
      {
        text: "Hisoblang: 12 − 4 = ?",
        correctAnswer: "8",
        distractors: ["7", "9", "6"],
        explanation: "12 − 4 = 8."
      }
    ],
    test: [
      {
        text: "Misolni hisoblang: 10 + 1 = ?",
        correctAnswer: "11",
        distractors: ["10", "12", "20"],
        explanation: "10 + 1 = 11."
      },
      {
        text: "Misolni hisoblang: 10 + 2 = ?",
        correctAnswer: "12",
        distractors: ["11", "13", "20"],
        explanation: "10 + 2 = 12."
      },
      {
        text: "Misolni hisoblang: 9 + 2 = ?",
        correctAnswer: "11",
        distractors: ["10", "12", "13"],
        explanation: "9 + 2 = 11."
      },
      {
        text: "Misolni hisoblang: 8 + 3 = ?",
        correctAnswer: "11",
        distractors: ["10", "12", "14"],
        explanation: "8 + 3 = 11."
      },
      {
        text: "Misolni hisoblang: 7 + 4 = ?",
        correctAnswer: "11",
        distractors: ["10", "12", "13"],
        explanation: "7 + 4 = 11."
      },
      {
        text: "Misolni hisoblang: 6 + 5 = ?",
        correctAnswer: "11",
        distractors: ["10", "12", "13"],
        explanation: "6 + 5 = 11."
      },
      {
        text: "Misolni hisoblang: 9 + 3 = ?",
        correctAnswer: "12",
        distractors: ["11", "13", "14"],
        explanation: "9 + 3 = 12."
      },
      {
        text: "Misolni hisoblang: 8 + 4 = ?",
        correctAnswer: "12",
        distractors: ["11", "13", "10"],
        explanation: "8 + 4 = 12."
      },
      {
        text: "Misolni hisoblang: 7 + 5 = ?",
        correctAnswer: "12",
        distractors: ["11", "13", "14"],
        explanation: "7 + 5 = 12."
      },
      {
        text: "Misolni hisoblang: 6 + 6 = ?",
        correctAnswer: "12",
        distractors: ["11", "13", "14"],
        explanation: "6 + 6 = 12."
      },
      {
        text: "Misolni hisoblang: 11 − 1 = ?",
        correctAnswer: "10",
        distractors: ["9", "11", "8"],
        explanation: "11 − 1 = 10."
      },
      {
        text: "Misolni hisoblang: 11 − 2 = ?",
        correctAnswer: "9",
        distractors: ["8", "10", "7"],
        explanation: "11 − 2 = 9."
      },
      {
        text: "Misolni hisoblang: 11 − 3 = ?",
        correctAnswer: "8",
        distractors: ["7", "9", "6"],
        explanation: "11 − 3 = 8."
      },
      {
        text: "Misolni hisoblang: 12 − 2 = ?",
        correctAnswer: "10",
        distractors: ["9", "11", "8"],
        explanation: "12 − 2 = 10."
      },
      {
        text: "Misolni hisoblang: 12 − 3 = ?",
        correctAnswer: "9",
        distractors: ["8", "10", "7"],
        explanation: "12 − 3 = 9."
      },
      {
        text: "Misolni hisoblang: 12 − 4 = ?",
        correctAnswer: "8",
        distractors: ["7", "9", "6"],
        explanation: "12 − 4 = 8."
      },
      {
        text: "Misolni hisoblang: 12 − 6 = ?",
        correctAnswer: "6",
        distractors: ["5", "7", "8"],
        explanation: "12 − 6 = 6."
      },
      {
        text: "Misolni hisoblang: 11 + 5 = ?",
        correctAnswer: "16",
        distractors: ["15", "17", "14"],
        explanation: "11 + 5 = 16."
      },
      {
        text: "Akmalda 11 ta qalam bor edi, 3 tasini ukasiga berdi. Unda nechta qalam qoldi?",
        correctAnswer: "8 ta qalam",
        distractors: ["7 ta", "9 ta", "6 ta"],
        explanation: "11 − 3 = 8 ta qalam."
      },
      {
        text: "Bir yilda nechta oy bor?",
        correctAnswer: "12 ta oy 📅",
        distractors: ["10 ta oy", "11 ta oy", "24 ta oy"],
        explanation: "Bir yil 12 oydan iborat (yanvardan dekabrgacha)."
      }
    ]
  },

  // 45. 13 va 14 sonlari
  {
    bookNumber: 45,
    title: "13 va 14 sonlari",
    emoji: "🔢",
    shortDesc: "13 va 14 sonlari tarkibi (10+3, 9+4, 7+6; 7+7), misollar va tushirib qoldirilgan son.",
    intro: "13 va 14 sonlarining tarkibini o‘rganamiz: 7 + 7 = 14 va 7 + 6 = 13.",
    keyPoints: [
      "13 sonining tarkibi: 10+3, 9+4, 8+5, 7+6.",
      "14 sonining tarkibi: 10+4, 9+5, 8+6, 7+7.",
      "14 − 7 = 7, 13 − 6 = 7 amallarini oson hisoblaymiz."
    ],
    miniExample: {
      emojis: "7️⃣ + 7️⃣ = 1️⃣4️⃣",
      text: "Ikkita yetti qo‘shilsa 14 bo‘ladi: 7 + 7 = 14!"
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Hisoblang: 7 + 7 = ?",
        correctAnswer: "14",
        distractors: ["13", "15", "12"],
        explanation: "7 + 7 = 14."
      },
      {
        text: "Hisoblang: 7 + 6 = ?",
        correctAnswer: "13",
        distractors: ["12", "14", "15"],
        explanation: "7 + 6 = 13."
      },
      {
        text: "Hisoblang: 14 − 5 = ?",
        correctAnswer: "9",
        distractors: ["8", "10", "7"],
        explanation: "14 − 5 = 9."
      }
    ],
    test: [
      {
        text: "Misolni hisoblang: 10 + 3 = ?",
        correctAnswer: "13",
        distractors: ["12", "14", "15"],
        explanation: "10 + 3 = 13."
      },
      {
        text: "Misolni hisoblang: 9 + 4 = ?",
        correctAnswer: "13",
        distractors: ["12", "14", "15"],
        explanation: "9 + 4 = 13."
      },
      {
        text: "Misolni hisoblang: 8 + 5 = ?",
        correctAnswer: "13",
        distractors: ["12", "14", "15"],
        explanation: "8 + 5 = 13."
      },
      {
        text: "Misolni hisoblang: 7 + 6 = ?",
        correctAnswer: "13",
        distractors: ["12", "14", "11"],
        explanation: "7 + 6 = 13."
      },
      {
        text: "Misolni hisoblang: 10 + 4 = ?",
        correctAnswer: "14",
        distractors: ["13", "15", "16"],
        explanation: "10 + 4 = 14."
      },
      {
        text: "Misolni hisoblang: 9 + 5 = ?",
        correctAnswer: "14",
        distractors: ["13", "15", "16"],
        explanation: "9 + 5 = 14."
      },
      {
        text: "Misolni hisoblang: 8 + 6 = ?",
        correctAnswer: "14",
        distractors: ["13", "15", "12"],
        explanation: "8 + 6 = 14."
      },
      {
        text: "Misolni hisoblang: 7 + 7 = ?",
        correctAnswer: "14",
        distractors: ["13", "15", "16"],
        explanation: "7 + 7 = 14."
      },
      {
        text: "Misolni hisoblang: 13 − 3 = ?",
        correctAnswer: "10",
        distractors: ["9", "11", "3"],
        explanation: "13 − 3 = 10."
      },
      {
        text: "Misolni hisoblang: 13 − 4 = ?",
        correctAnswer: "9",
        distractors: ["8", "10", "7"],
        explanation: "13 − 4 = 9."
      },
      {
        text: "Misolni hisoblang: 13 − 5 = ?",
        correctAnswer: "8",
        distractors: ["7", "9", "6"],
        explanation: "13 − 5 = 8."
      },
      {
        text: "Misolni hisoblang: 13 − 6 = ?",
        correctAnswer: "7",
        distractors: ["6", "8", "5"],
        explanation: "13 − 6 = 7."
      },
      {
        text: "Misolni hisoblang: 14 − 4 = ?",
        correctAnswer: "10",
        distractors: ["9", "11", "4"],
        explanation: "14 − 4 = 10."
      },
      {
        text: "Misolni hisoblang: 14 − 5 = ?",
        correctAnswer: "9",
        distractors: ["8", "10", "7"],
        explanation: "14 − 5 = 9."
      },
      {
        text: "Misolni hisoblang: 14 − 6 = ?",
        correctAnswer: "8",
        distractors: ["7", "9", "6"],
        explanation: "14 − 6 = 8."
      },
      {
        text: "Misolni hisoblang: 14 − 7 = ?",
        correctAnswer: "7",
        distractors: ["6", "8", "9"],
        explanation: "14 − 7 = 7."
      },
      {
        text: "Tenglikni to‘ldiring: 9 + □ = 13. Katakdagi son nima?",
        correctAnswer: "4",
        distractors: ["3", "5", "6"],
        explanation: "13 − 9 = 4."
      },
      {
        text: "Tenglikni to‘ldiring: 8 + □ = 14. Katakdagi son nima?",
        correctAnswer: "6",
        distractors: ["5", "7", "4"],
        explanation: "14 − 8 = 6."
      },
      {
        text: "Bog‘dan 14 ta shaftoli uzildi. 6 tasi yeyildi. Nechta shaftoli qoldi?",
        correctAnswer: "8 ta shaftoli",
        distractors: ["7 ta", "9 ta", "6 ta"],
        explanation: "14 − 6 = 8 ta shaftoli."
      },
      {
        text: "Sinfda 13 ta o‘quvchi bor. Ulardan 7 tasi qiz bola bo‘lsa, o‘g‘il bolalar nechta?",
        correctAnswer: "6 ta o‘g‘il bola",
        distractors: ["5 ta", "7 ta", "8 ta"],
        explanation: "13 − 7 = 6 ta o‘g‘il bola."
      }
    ]
  },

  // 46. 15 va 16 sonlari
  {
    bookNumber: 46,
    title: "15 va 16 sonlari",
    emoji: "🔢",
    shortDesc: "15 va 16 sonlari tarkibi (8+7, 9+6; 8+8), ifoda qiymati va tartiblash.",
    intro: "15 va 16 sonlarining tarkibi: 8 + 8 = 16, 8 + 7 = 15 va 9 + 7 = 16.",
    keyPoints: [
      "15 sonining tarkibi: 10+5, 9+6, 8+7.",
      "16 sonining tarkibi: 10+6, 9+7, 8+8.",
      "15 va 16 sonlari 11–20 qatorining o‘rtasida joylashgan."
    ],
    miniExample: {
      emojis: "8️⃣ + 8️⃣ = 1️⃣6️⃣",
      text: "Ikkita sakkiz yig‘indisi 16 bo‘ladi: 8 + 8 = 16!"
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Hisoblang: 8 + 8 = ?",
        correctAnswer: "16",
        distractors: ["15", "17", "14"],
        explanation: "8 + 8 = 16."
      },
      {
        text: "Hisoblang: 8 + 7 = ?",
        correctAnswer: "15",
        distractors: ["14", "16", "17"],
        explanation: "8 + 7 = 15."
      },
      {
        text: "Hisoblang: 16 − 8 = ?",
        correctAnswer: "8",
        distractors: ["7", "9", "6"],
        explanation: "16 − 8 = 8."
      }
    ],
    test: [
      {
        text: "Misolni hisoblang: 10 + 5 = ?",
        correctAnswer: "15",
        distractors: ["14", "16", "17"],
        explanation: "10 + 5 = 15."
      },
      {
        text: "Misolni hisoblang: 9 + 6 = ?",
        correctAnswer: "15",
        distractors: ["14", "16", "17"],
        explanation: "9 + 6 = 15."
      },
      {
        text: "Misolni hisoblang: 8 + 7 = ?",
        correctAnswer: "15",
        distractors: ["14", "16", "13"],
        explanation: "8 + 7 = 15."
      },
      {
        text: "Misolni hisoblang: 10 + 6 = ?",
        correctAnswer: "16",
        distractors: ["15", "17", "18"],
        explanation: "10 + 6 = 16."
      },
      {
        text: "Misolni hisoblang: 9 + 7 = ?",
        correctAnswer: "16",
        distractors: ["15", "17", "18"],
        explanation: "9 + 7 = 16."
      },
      {
        text: "Misolni hisoblang: 8 + 8 = ?",
        correctAnswer: "16",
        distractors: ["15", "17", "14"],
        explanation: "8 + 8 = 16."
      },
      {
        text: "Misolni hisoblang: 15 − 5 = ?",
        correctAnswer: "10",
        distractors: ["9", "11", "5"],
        explanation: "15 − 5 = 10."
      },
      {
        text: "Misolni hisoblang: 15 − 6 = ?",
        correctAnswer: "9",
        distractors: ["8", "10", "7"],
        explanation: "15 − 6 = 9."
      },
      {
        text: "Misolni hisoblang: 15 − 7 = ?",
        correctAnswer: "8",
        distractors: ["7", "9", "6"],
        explanation: "15 − 7 = 8."
      },
      {
        text: "Misolni hisoblang: 15 − 8 = ?",
        correctAnswer: "7",
        distractors: ["6", "8", "9"],
        explanation: "15 − 8 = 7."
      },
      {
        text: "Misolni hisoblang: 16 − 6 = ?",
        correctAnswer: "10",
        distractors: ["9", "11", "6"],
        explanation: "16 − 6 = 10."
      },
      {
        text: "Misolni hisoblang: 16 − 7 = ?",
        correctAnswer: "9",
        distractors: ["8", "10", "7"],
        explanation: "16 − 7 = 9."
      },
      {
        text: "Misolni hisoblang: 16 − 8 = ?",
        correctAnswer: "8",
        distractors: ["7", "9", "6"],
        explanation: "16 − 8 = 8."
      },
      {
        text: "Misolni hisoblang: 16 − 9 = ?",
        correctAnswer: "7",
        distractors: ["6", "8", "9"],
        explanation: "16 − 9 = 7."
      },
      {
        text: "Tenglikni to‘ldiring: 7 + □ = 15. Katakdagi son nima?",
        correctAnswer: "8",
        distractors: ["7", "9", "6"],
        explanation: "15 − 7 = 8."
      },
      {
        text: "Tenglikni to‘ldiring: 9 + □ = 16. Katakdagi son nima?",
        correctAnswer: "7",
        distractors: ["6", "8", "9"],
        explanation: "16 − 9 = 7."
      },
      {
        text: "15 soni toq sonmi yoki juft son?",
        correctAnswer: "Toq son (5 bilan tugaydi)",
        distractors: ["Juft son", "Nol son", "Bir xonali"],
        explanation: "Oxiri 5 bilan tugagan sonlar toq sondir."
      },
      {
        text: "16 soni toq sonmi yoki juft son?",
        correctAnswer: "Juft son (6 bilan tugaydi)",
        distractors: ["Toq son", "Nol son", "Manfiy son"],
        explanation: "Oxiri 6 bilan tugagan sonlar juft sondir."
      },
      {
        text: "Avtobusda 16 ta o‘rindiq bor. 9 tasiga yo‘lovchi o‘tirdi. Nechta bo‘sh o‘rindiq qoldi?",
        correctAnswer: "7 ta bo‘sh o‘rindiq",
        distractors: ["6 ta", "8 ta", "5 ta"],
        explanation: "16 − 9 = 7 ta o‘rindiq."
      },
      {
        text: "Daftar 15 varaq edi. Kamola 6 varaq yozdi. Nechta toza varaq qoldi?",
        correctAnswer: "9 ta toza varaq",
        distractors: ["8 ta", "10 ta", "7 ta"],
        explanation: "15 − 6 = 9 ta varaq."
      }
    ]
  },

  // 47. 17 va 18 sonlari
  {
    bookNumber: 47,
    title: "17 va 18 sonlari",
    emoji: "🔢",
    shortDesc: "17 va 18 sonlari tarkibi (9+8, 10+7; 9+9), ifodani qiymati bilan bog‘lash.",
    intro: "17 va 18 sonlarining tarkibi: 9 + 9 = 18 va 9 + 8 = 17.",
    keyPoints: [
      "17 sonining tarkibi: 10+7, 9+8.",
      "18 sonining tarkibi: 10+8, 9+9.",
      "18 − 9 = 9, 17 − 8 = 9, 17 − 9 = 8."
    ],
    miniExample: {
      emojis: "9️⃣ + 9️⃣ = 1️⃣8️⃣",
      text: "Ikkita to‘qqiz yig‘indisi 18 bo‘ladi: 9 + 9 = 18!"
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Hisoblang: 9 + 9 = ?",
        correctAnswer: "18",
        distractors: ["17", "19", "16"],
        explanation: "9 + 9 = 18."
      },
      {
        text: "Hisoblang: 9 + 8 = ?",
        correctAnswer: "17",
        distractors: ["16", "18", "19"],
        explanation: "9 + 8 = 17."
      },
      {
        text: "Hisoblang: 18 − 9 = ?",
        correctAnswer: "9",
        distractors: ["8", "10", "7"],
        explanation: "18 − 9 = 9."
      }
    ],
    test: [
      {
        text: "Misolni hisoblang: 10 + 7 = ?",
        correctAnswer: "17",
        distractors: ["16", "18", "19"],
        explanation: "10 + 7 = 17."
      },
      {
        text: "Misolni hisoblang: 9 + 8 = ?",
        correctAnswer: "17",
        distractors: ["16", "18", "19"],
        explanation: "9 + 8 = 17."
      },
      {
        text: "Misolni hisoblang: 10 + 8 = ?",
        correctAnswer: "18",
        distractors: ["17", "19", "20"],
        explanation: "10 + 8 = 18."
      },
      {
        text: "Misolni hisoblang: 9 + 9 = ?",
        correctAnswer: "18",
        distractors: ["17", "19", "16"],
        explanation: "9 + 9 = 18."
      },
      {
        text: "Misolni hisoblang: 17 − 7 = ?",
        correctAnswer: "10",
        distractors: ["9", "11", "7"],
        explanation: "17 − 7 = 10."
      },
      {
        text: "Misolni hisoblang: 17 − 8 = ?",
        correctAnswer: "9",
        distractors: ["8", "10", "7"],
        explanation: "17 − 8 = 9."
      },
      {
        text: "Misolni hisoblang: 17 − 9 = ?",
        correctAnswer: "8",
        distractors: ["7", "9", "6"],
        explanation: "17 − 9 = 8."
      },
      {
        text: "Misolni hisoblang: 18 − 8 = ?",
        correctAnswer: "10",
        distractors: ["9", "11", "8"],
        explanation: "18 − 8 = 10."
      },
      {
        text: "Misolni hisoblang: 18 − 9 = ?",
        correctAnswer: "9",
        distractors: ["8", "10", "7"],
        explanation: "18 − 9 = 9."
      },
      {
        text: "Tenglikni to‘ldiring: 9 + □ = 17. Katakdagi son nima?",
        correctAnswer: "8",
        distractors: ["7", "9", "6"],
        explanation: "17 − 9 = 8."
      },
      {
        text: "Tenglikni to‘ldiring: 9 + □ = 18. Katakdagi son nima?",
        correctAnswer: "9",
        distractors: ["8", "10", "7"],
        explanation: "18 − 9 = 9."
      },
      {
        text: "Tenglikni to‘ldiring: 17 − □ = 9. Katakdagi son nima?",
        correctAnswer: "8",
        distractors: ["7", "9", "6"],
        explanation: "17 − 9 = 8."
      },
      {
        text: "Tenglikni to‘ldiring: 18 − □ = 9. Katakdagi son nima?",
        correctAnswer: "9",
        distractors: ["8", "10", "7"],
        explanation: "18 − 9 = 9."
      },
      {
        text: "17 soni toq sonmi yoki juft son?",
        correctAnswer: "Toq son (7 bilan tugaydi)",
        distractors: ["Juft son", "Nol son", "Manfiy son"],
        explanation: "Oxirgi raqami 7 bo‘lgani uchun 17 toq sondir."
      },
      {
        text: "18 soni toq sonmi yoki juft son?",
        correctAnswer: "Juft son (8 bilan tugaydi)",
        distractors: ["Toq son", "Nol son", "Toq ham juft ham"],
        explanation: "Oxirgi raqami 8 bo‘lgani uchun 18 juft sondir."
      },
      {
        text: "17 ning qo‘shnilari qaysilar?",
        correctAnswer: "16 va 18",
        distractors: ["15 va 19", "17 va 18", "14 va 16"],
        explanation: "17 ning oldida 16, keyin 18 keladi."
      },
      {
        text: "18 ning qo‘shnilari qaysilar?",
        correctAnswer: "17 va 19",
        distractors: ["16 va 20", "18 va 19", "15 va 17"],
        explanation: "18 ning oldida 17, keyin 19 keladi."
      },
      {
        text: "Sayyohlar avtobusida 18 ta yo‘lovchi bor edi. Bekatda 9 kishi tushdi. Avtobusda nechta yo‘lovchi qoldi?",
        correctAnswer: "9 ta yo‘lovchi",
        distractors: ["8 ta", "10 ta", "7 ta"],
        explanation: "18 − 9 = 9 ta yo‘lovchi."
      },
      {
        text: "Sardor 17 ta misoldan 8 tasini yechdi. Yana nechta misol qoldi?",
        correctAnswer: "9 ta misol",
        distractors: ["8 ta", "10 ta", "7 ta"],
        explanation: "17 − 8 = 9 ta misol."
      },
      {
        text: "Qaysi ifodaning qiymati 18 ga teng?",
        correctAnswer: "9 + 9",
        distractors: ["8 + 8", "9 + 8", "10 + 7"],
        explanation: "9 + 9 = 18."
      }
    ]
  },

  // 48. 19 va 20 sonlari
  {
    bookNumber: 48,
    title: "19 va 20 sonlari",
    emoji: "🔢",
    shortDesc: "19 va 20 sonlari tarkibi, juft/toq qoidasi (0,2,4,6,8 juft; 1,3,5,7,9 toq).",
    intro: "19 va 20 sonlari — ikkinchi o‘nlikning oxirgi sonlaridir. 20 soni to‘liq 2 ta o‘nlikni bildiradi.",
    keyPoints: [
      "Juft sonlar 0, 2, 4, 6, 8 raqamlari bilan tugaydi (masalan, 20 — juft son).",
      "Toq sonlar 1, 3, 5, 7, 9 raqamlari bilan tugaydi (masalan, 19 — toq son).",
      "20 = 10 + 10 = 2 ta o‘nlik."
    ],
    miniExample: {
      emojis: "1️⃣9️⃣ (toq) va 2️⃣0️⃣ (juft)",
      text: "19 toq son (9 bilan tugaydi), 20 esa juft son (0 bilan tugaydi)!"
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "20 soni juftmi yoki toq son?",
        correctAnswer: "Juft son (0 bilan tugaydi)",
        distractors: ["Toq son", "Nol son", "Bir xonali"],
        explanation: "0 bilan tugagan har qanday son juft sondir."
      },
      {
        text: "19 soni juftmi yoki toq son?",
        correctAnswer: "Toq son (9 bilan tugaydi)",
        distractors: ["Juft son", "Ikkalasi ham", "Manfiy son"],
        explanation: "9 bilan tugagan sonlar toq sondir."
      },
      {
        text: "Hisoblang: 10 + 10 = ?",
        correctAnswer: "20",
        distractors: ["19", "21", "100"],
        explanation: "10 + 10 = 20."
      }
    ],
    test: [
      {
        text: "Misolni hisoblang: 10 + 9 = ?",
        correctAnswer: "19",
        distractors: ["18", "20", "21"],
        explanation: "10 + 9 = 19."
      },
      {
        text: "Misolni hisoblang: 10 + 10 = ?",
        correctAnswer: "20",
        distractors: ["19", "21", "100"],
        explanation: "10 + 10 = 20."
      },
      {
        text: "Misolni hisoblang: 19 − 9 = ?",
        correctAnswer: "10",
        distractors: ["9", "11", "1"],
        explanation: "19 − 9 = 10."
      },
      {
        text: "Misolni hisoblang: 19 − 10 = ?",
        correctAnswer: "9",
        distractors: ["8", "10", "19"],
        explanation: "19 − 10 = 9."
      },
      {
        text: "Misolni hisoblang: 20 − 10 = ?",
        correctAnswer: "10",
        distractors: ["9", "11", "0"],
        explanation: "20 − 10 = 10."
      },
      {
        text: "Misolni hisoblang: 20 − 1 = ?",
        correctAnswer: "19",
        distractors: ["18", "20", "17"],
        explanation: "20 − 1 = 19."
      },
      {
        text: "19 dan keyingi son qaysi?",
        correctAnswer: "20",
        distractors: ["18", "21", "22"],
        explanation: "19 dan keyin 20 keladi."
      },
      {
        text: "20 dan oldingi son qaysi?",
        correctAnswer: "19",
        distractors: ["18", "21", "10"],
        explanation: "20 dan oldin 19 turadi."
      },
      {
        text: "Juft sonlar qaysi raqamlar bilan tugaydi?",
        correctAnswer: "0, 2, 4, 6, 8 bilan",
        distractors: ["1, 3, 5, 7, 9 bilan", "Faqat 0 bilan", "Faqat 2 bilan"],
        explanation: "Oxiri 0, 2, 4, 6, 8 bo‘lgan sonlar juft sonlardir."
      },
      {
        text: "Toq sonlar qaysi raqamlar bilan tugaydi?",
        correctAnswer: "1, 3, 5, 7, 9 bilan",
        distractors: ["0, 2, 4, 6, 8 bilan", "Faqat 1 bilan", "Faqat 9 bilan"],
        explanation: "Oxiri 1, 3, 5, 7, 9 bo‘lgan sonlar toq sonlardir."
      },
      {
        text: "12 soni juftmi yoki toq?",
        correctAnswer: "Juft son (chunki 2 bilan tugaydi)",
        distractors: ["Toq son", "Nol son", "Manfiy son"],
        explanation: "2 bilan tugagani uchun juft son."
      },
      {
        text: "15 soni juftmi yoki toq?",
        correctAnswer: "Toq son (chunki 5 bilan tugaydi)",
        distractors: ["Juft son", "Ikkalasi ham", "Nol son"],
        explanation: "5 bilan tugagani uchun toq son."
      },
      {
        text: "18 soni juftmi yoki toq?",
        correctAnswer: "Juft son (chunki 8 bilan tugaydi)",
        distractors: ["Toq son", "Nol son", "Bilmayman"],
        explanation: "8 bilan tugagani uchun juft son."
      },
      {
        text: "13 soni juftmi yoki toq?",
        correctAnswer: "Toq son (chunki 3 bilan tugaydi)",
        distractors: ["Juft son", "Ikkalasi ham", "Nol son"],
        explanation: "3 bilan tugagani uchun toq son."
      },
      {
        text: "20 sonida nechta o‘nlik bor?",
        correctAnswer: "2 ta o‘nlik (va 0 ta birlik)",
        distractors: ["1 ta o‘nlik", "20 ta o‘nlik", "0 ta o‘nlik"],
        explanation: "20 da roppa-rosa 2 ta o‘nlik bor."
      },
      {
        text: "19 soni 20 dan qancha kichik?",
        correctAnswer: "1 taga kichik (20 − 19 = 1)",
        distractors: ["2 taga", "10 taga", "Teng"],
        explanation: "20 − 19 = 1."
      },
      {
        text: "Daftarga 20 ta katak chizildi. 10 tasi bo‘yaldi. Nechta ochiq katak qoldi?",
        correctAnswer: "10 ta katak",
        distractors: ["9 ta", "11 ta", "12 ta"],
        explanation: "20 − 10 = 10."
      },
      {
        text: "Bog‘bon 20 tup ko‘chat ekdi. 1 tasi qurib qoldi, qolgani ko‘kardi. Nechta ko‘chat ko‘kardi?",
        correctAnswer: "19 tup ko‘chat",
        distractors: ["18 tup", "20 tup", "10 tup"],
        explanation: "20 − 1 = 19."
      },
      {
        text: "Quyidagi sonlardan qaysi biri juft son: 11, 13, 17, 20?",
        correctAnswer: "20",
        distractors: ["11", "13", "17"],
        explanation: "Faqat 20 juft son, qolganlari toq."
      },
      {
        text: "Quyidagi sonlardan qaysi biri toq son: 12, 14, 16, 19?",
        correctAnswer: "19",
        distractors: ["12", "14", "16"],
        explanation: "Faqat 19 toq son, qolganlari juft."
      }
    ]
  },

  // 49. Sonlarni taqqoslash (11–20)
  {
    bookNumber: 49,
    title: "Sonlarni taqqoslash (11–20)",
    emoji: "🔍",
    shortDesc: "11–20 sonlarini tarkibi va sonlar qatori bo‘yicha taqqoslash (16 > 13).",
    intro: "11 dan 20 gacha bo‘lgan sonlarni o‘nlik va birliklariga qarab taqqoslaymiz: 16 > 13.",
    keyPoints: [
      "O‘nliklari teng bo‘lsa, birliklari kattasi katta bo‘ladi: 16 > 13 (chunki 6 > 3).",
      "20 soni barcha 11–19 sonlaridan katta (chunki 2 ta o‘nligi bor).",
      "Sonlar qatorida o‘ngda turgan son doimo chapdagi sondan katta bo‘ladi."
    ],
    miniExample: {
      emojis: "1️⃣6️⃣ > 1️⃣3️⃣",
      text: "16 katta 13 dan, chunki 6 ta birlik 3 ta birlikdan ko‘p!"
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Taqqoslang: 16 ... 13. Qaysi belgi to‘g‘ri?",
        correctAnswer: ">",
        distractors: ["<", "=", "+"],
        explanation: "16 soni 13 dan katta (16 > 13)."
      },
      {
        text: "Taqqoslang: 12 ... 18. Qaysi belgi to‘g‘ri?",
        correctAnswer: "<",
        distractors: [">", "=", "−"],
        explanation: "12 soni 18 dan kichik (12 < 18)."
      },
      {
        text: "11 dan 20 gacha sonlar ichida eng kattasi qaysi?",
        correctAnswer: "20",
        distractors: ["19", "18", "11"],
        explanation: "20 soni bu oraliqda eng kattadir."
      }
    ],
    test: [
      {
        text: "Taqqoslang: 14 ... 11. Qaysi belgi to‘g‘ri?",
        correctAnswer: ">",
        distractors: ["<", "=", "+"],
        explanation: "14 soni 11 dan katta (14 > 11)."
      },
      {
        text: "Taqqoslang: 13 ... 17. Qaysi belgi to‘g‘ri?",
        correctAnswer: "<",
        distractors: [">", "=", "−"],
        explanation: "13 soni 17 dan kichik (13 < 17)."
      },
      {
        text: "Taqqoslang: 15 ... 15. Qaysi belgi to‘g‘ri?",
        correctAnswer: "=",
        distractors: [">", "<", "+"],
        explanation: "Ikkala son teng (15 = 15)."
      },
      {
        text: "Taqqoslang: 20 ... 19. Qaysi belgi to‘g‘ri?",
        correctAnswer: ">",
        distractors: ["<", "=", "−"],
        explanation: "20 soni 19 dan katta (20 > 19)."
      },
      {
        text: "Taqqoslang: 12 ... 20. Qaysi belgi to‘g‘ri?",
        correctAnswer: "<",
        distractors: [">", "=", "+"],
        explanation: "12 soni 20 dan kichik (12 < 20)."
      },
      {
        text: "Taqqoslang: 18 ... 16. Qaysi belgi to‘g‘ri?",
        correctAnswer: ">",
        distractors: ["<", "=", "−"],
        explanation: "18 soni 16 dan katta (18 > 16)."
      },
      {
        text: "Taqqoslang: 11 ... 19. Qaysi belgi to‘g‘ri?",
        correctAnswer: "<",
        distractors: [">", "=", "+"],
        explanation: "11 soni 19 dan kichik (11 < 19)."
      },
      {
        text: "Taqqoslang: 10 + 4 ... 15. Qaysi belgi to‘g‘ri?",
        correctAnswer: "< (chunki 14 < 15)",
        distractors: [">", "=", "+"],
        explanation: "10 + 4 = 14, 14 < 15."
      },
      {
        text: "Taqqoslang: 10 + 8 ... 17. Qaysi belgi to‘g‘ri?",
        correctAnswer: "> (chunki 18 > 17)",
        distractors: ["<", "=", "−"],
        explanation: "10 + 8 = 18, 18 > 17."
      },
      {
        text: "Taqqoslang: 10 + 6 ... 16. Qaysi belgi to‘g‘ri?",
        correctAnswer: "= (chunki 16 = 16)",
        distractors: [">", "<", "+"],
        explanation: "10 + 6 = 16, ikkalasi teng."
      },
      {
        text: "11, 15, 19, 13 sonlari ichida eng kattasi qaysi?",
        correctAnswer: "19",
        distractors: ["15", "13", "11"],
        explanation: "19 eng katta sondir."
      },
      {
        text: "14, 12, 18, 16 sonlari ichida eng kichigi qaysi?",
        correctAnswer: "12",
        distractors: ["14", "16", "18"],
        explanation: "12 eng kichik sondir."
      },
      {
        text: "Sonlarni o‘sish tartibida to‘g‘ri joylashtiring:",
        correctAnswer: "11, 14, 17, 20",
        distractors: ["20, 17, 14, 11", "14, 11, 17, 20", "11, 17, 14, 20"],
        explanation: "Kichigidan kattasiga: 11, 14, 17, 20."
      },
      {
        text: "Sonlarni kamayish tartibida to‘g‘ri joylashtiring:",
        correctAnswer: "19, 16, 13, 10",
        distractors: ["10, 13, 16, 19", "16, 19, 13, 10", "19, 13, 16, 10"],
        explanation: "Kattasidan kichigiga: 19, 16, 13, 10."
      },
      {
        text: "Quyidagi sonlardan qaysi biri 14 dan katta, lekin 16 dan kichik?",
        correctAnswer: "15",
        distractors: ["13", "17", "16"],
        explanation: "14 va 16 orasida 15 soni bor."
      },
      {
        text: "Quyidagi sonlardan qaysi biri 17 dan katta, lekin 19 dan kichik?",
        correctAnswer: "18",
        distractors: ["16", "20", "19"],
        explanation: "17 va 19 orasida 18 soni bor."
      },
      {
        text: "Akmal 15 ta misol yechdi, Sobir 18 ta misol yechdi. Kim ko‘p misol yechdi?",
        correctAnswer: "Sobir ko‘p yechdi (18 > 15)",
        distractors: ["Akmal ko‘p yechdi", "Ikkalasi teng", "Akmal 18 ta yechdi"],
        explanation: "18 soni 15 dan katta."
      },
      {
        text: "Madinada 14 ta rangli qalam, singlisida 11 ta qalam bor. Qalamlar kimda kam?",
        correctAnswer: "Singlisida kam (11 < 14)",
        distractors: ["Madinada kam", "Ikkalasida teng", "Singlisida ko‘p"],
        explanation: "11 soni 14 dan kichik."
      },
      {
        text: "1-sinfda 19 ta o‘quvchi, 2-sinfda 20 ta o‘quvchi bor. Qaysi sinfda ko‘p?",
        correctAnswer: "2-sinfda ko‘p (20 > 19)",
        distractors: ["1-sinfda ko‘p", "Ikkalasida teng", "2-sinfda kam"],
        explanation: "20 soni 19 dan katta."
      },
      {
        text: "To‘g‘ri taqqoslashni toping:",
        correctAnswer: "17 > 12",
        distractors: ["12 > 17", "17 = 12", "12 > 20"],
        explanation: "17 soni 12 dan katta."
      }
    ]
  }
];

export function runPart2Chapter4A() {
  console.log('--- 2-qism IV bob A qismi (42–49-darslar) yaratilmoqda ---');
  for (const l of lessons) {
    const seed = buildLessonSeed(l);
    saveLessonFile(2, l.bookNumber, seed);
    console.log(`  ✓ Dars ${l.bookNumber}: ${l.title} saqlandi.`);
  }
}

runPart2Chapter4A();
