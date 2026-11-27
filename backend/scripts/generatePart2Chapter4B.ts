import { LessonDataDef, buildLessonSeed, saveLessonFile } from './generatorTypes.js';

const lessons: LessonDataDef[] = [
  // 50. Qavslar
  {
    bookNumber: 50,
    title: "Qavslar",
    emoji: "🧩",
    shortDesc: "Qavssiz ifodada amallar chapdan o‘ngga, qavs birinchi bajariladigan amalni ko‘rsatadi.",
    intro: "Qavslar — birinchi navbatda qaysi amal bajarilishi kerakligini ko‘rsatuvchi maxsus belgidir.",
    keyPoints: [
      "Qavs ichidagi amal birinchi navbatda bajariladi.",
      "Qavssiz ifodalarda amallar chapdan o‘ngga tartib bilan bajariladi.",
      "Misol: 6 + (3 + 7) da avval 3 + 7 = 10, so‘ng 6 + 10 = 16 hisoblanadi."
    ],
    miniExample: {
      emojis: "6️⃣ + (3️⃣ + 7️⃣) = 1️⃣6️⃣",
      text: "Avval qavs ichi: 3 + 7 = 10, keyin 6 + 10 = 16!"
    },
    xpReward: 100,
    coinReward: 11,
    estMinutes: 7,
    practice: [
      {
        text: "Hisoblang: 4 + (2 + 3) = ?",
        correctAnswer: "9",
        distractors: ["8", "10", "7"],
        explanation: "Avval qavs ichi: 2 + 3 = 5, keyin 4 + 5 = 9."
      },
      {
        text: "Ifodada qaysi amal birinchi bajariladi: 8 + (6 − 2)?",
        correctAnswer: "Qavs ichidagi ayirish (6 − 2)",
        distractors: ["Qo‘shish (8 + 6)", "Chapdagi 8 soni", "Istalgan amal"],
        explanation: "Qoida bo‘yicha qavs ichidagi amal doim birinchi bajariladi."
      },
      {
        text: "Hisoblang: (10 − 4) + 3 = ?",
        correctAnswer: "9",
        distractors: ["8", "10", "3"],
        explanation: "10 − 4 = 6, 6 + 3 = 9."
      }
    ],
    test: [
      {
        text: "Hisoblang: 5 + (3 + 2) = ?",
        correctAnswer: "10",
        distractors: ["9", "11", "8"],
        explanation: "Avval 3 + 2 = 5, keyin 5 + 5 = 10."
      },
      {
        text: "Hisoblang: 6 + (3 + 7) = ?",
        correctAnswer: "16",
        distractors: ["15", "17", "14"],
        explanation: "3 + 7 = 10, 6 + 10 = 16."
      },
      {
        text: "Hisoblang: 10 + (4 + 5) = ?",
        correctAnswer: "19",
        distractors: ["18", "20", "15"],
        explanation: "4 + 5 = 9, 10 + 9 = 19."
      },
      {
        text: "Hisoblang: 8 + (10 − 8) = ?",
        correctAnswer: "10",
        distractors: ["9", "11", "12"],
        explanation: "10 − 8 = 2, 8 + 2 = 10."
      },
      {
        text: "Hisoblang: (9 − 3) + 4 = ?",
        correctAnswer: "10",
        distractors: ["8", "11", "9"],
        explanation: "9 − 3 = 6, 6 + 4 = 10."
      },
      {
        text: "Hisoblang: (7 + 3) − 5 = ?",
        correctAnswer: "5",
        distractors: ["4", "6", "15"],
        explanation: "7 + 3 = 10, 10 − 5 = 5."
      },
      {
        text: "Hisoblang: 15 − (3 + 2) = ?",
        correctAnswer: "10",
        distractors: ["9", "11", "14"],
        explanation: "3 + 2 = 5, 15 − 5 = 10."
      },
      {
        text: "Hisoblang: 18 − (6 + 2) = ?",
        correctAnswer: "10",
        distractors: ["9", "11", "12"],
        explanation: "6 + 2 = 8, 18 − 8 = 10."
      },
      {
        text: "Hisoblang: (12 − 2) + 6 = ?",
        correctAnswer: "16",
        distractors: ["15", "17", "14"],
        explanation: "12 − 2 = 10, 10 + 6 = 16."
      },
      {
        text: "Hisoblang: 7 + (8 − 5) = ?",
        correctAnswer: "10",
        distractors: ["9", "11", "12"],
        explanation: "8 − 5 = 3, 7 + 3 = 10."
      },
      {
        text: "Qavsli ifodalarda birinchi navbatda qaysi amal bajariladi?",
        correctAnswer: "Qavs ichidagi amal",
        distractors: ["Qavsdan tashqaridagi amal", "Faqat qo‘shish", "Faqat oxirgi amal"],
        explanation: "Qavs amallar tartibini o‘zgartirib, birinchi navbatda bajarilishini talab qiladi."
      },
      {
        text: "Qavssiz ifodada (masalan, 8 − 3 + 2) amallar qanday tartibda bajariladi?",
        correctAnswer: "Chapdan o‘ngga qarab ketma-ket",
        distractors: ["O‘ngdan chapga", "Faqat avval qo‘shish", "Ixtiyoriy tartibda"],
        explanation: "Qavs bo‘lmasa amallar chapdan o‘ngga qarab bajariladi."
      },
      {
        text: "Taqqoslang: 6 + (2 + 1) ... (6 + 2) + 1. Qaysi belgi to‘g‘ri?",
        correctAnswer: "= (ikkalasi ham 9)",
        distractors: [">", "<", "+"],
        explanation: "6 + 3 = 9 va 8 + 1 = 9, demak 9 = 9."
      },
      {
        text: "Hisoblang: 20 − (5 + 5) = ?",
        correctAnswer: "10",
        distractors: ["9", "11", "0"],
        explanation: "5 + 5 = 10, 20 − 10 = 10."
      },
      {
        text: "Hisoblang: (14 − 4) − 3 = ?",
        correctAnswer: "7",
        distractors: ["6", "8", "5"],
        explanation: "14 − 4 = 10, 10 − 3 = 7."
      },
      {
        text: "Akmal 10 ta olmadan avval 2 tasini, keyin 3 tasini yedi: 10 − (2 + 3). Nechta olma qoldi?",
        correctAnswer: "5 ta olma",
        distractors: ["4 ta", "6 ta", "15 ta"],
        explanation: "2 + 3 = 5 ta yeyildi, 10 − 5 = 5 ta qoldi."
      },
      {
        text: "Gulshanning 12 ta guli bor edi. U 4 ta qizil va 2 ta oq gul sovg‘a qildi: 12 − (4 + 2). Nechta gul qoldi?",
        correctAnswer: "6 ta gul",
        distractors: ["5 ta", "7 ta", "8 ta"],
        explanation: "4 + 2 = 6 ta sovg‘a qilindi, 12 − 6 = 6 ta qoldi."
      },
      {
        text: "Sardor 5 ta misol yechdi, singlisi esa 3 ta va 2 ta misol yechdi: 5 + (3 + 2). Ular jami nechta misol yechishdi?",
        correctAnswer: "10 ta misol",
        distractors: ["9 ta", "11 ta", "8 ta"],
        explanation: "3 + 2 = 5, 5 + 5 = 10 ta misol."
      },
      {
        text: "To‘g‘ri tenglikni toping:",
        correctAnswer: "7 + (2 + 1) = 10",
        distractors: ["7 + (2 + 1) = 9", "7 + (2 + 1) = 8", "7 + (2 + 1) = 11"],
        explanation: "2 + 1 = 3, 7 + 3 = 10."
      },
      {
        text: "Qaysi ifodaning qiymati 8 ga teng?",
        correctAnswer: "12 − (2 + 2)",
        distractors: ["12 − (3 + 2)", "12 − (1 + 1)", "10 − (4 + 1)"],
        explanation: "2 + 2 = 4, 12 − 4 = 8."
      }
    ]
  },

  // 51. Qavslar (amallar tartibi)
  {
    bookNumber: 51,
    title: "Qavslar (amallar tartibi)",
    emoji: "🧩",
    shortDesc: "1) qavs ichidagi, 2) chapdan o‘ngga; 18 - (3 + 2) va (18 - 3) + 2 farqi.",
    intro: "Qavsning o‘rni natijaga jiddiy ta’sir qiladi: 18 − (3 + 2) = 13, lekin (18 − 3) + 2 = 17!",
    keyPoints: [
      "1-qoida: Birinchi navbatda qavs ichidagi amallar bajariladi.",
      "2-qoida: Qavslar bir nechta bo‘lsa, har biri chapdan o‘ngga bajariladi.",
      "3-qoida: Qolgan amallar chapdan o‘ngga tartibda bajariladi."
    ],
    miniExample: {
      emojis: "1️⃣8️⃣ − (3️⃣ + 2️⃣) = 1️⃣3️⃣",
      text: "18 − (3 + 2) = 13 bo‘ladi, lekin (18 − 3) + 2 = 17!"
    },
    xpReward: 100,
    coinReward: 11,
    estMinutes: 7,
    practice: [
      {
        text: "Hisoblang: 18 − (3 + 2) = ?",
        correctAnswer: "13",
        distractors: ["17", "14", "12"],
        explanation: "3 + 2 = 5, 18 − 5 = 13."
      },
      {
        text: "Hisoblang: (18 − 3) + 2 = ?",
        correctAnswer: "17",
        distractors: ["13", "16", "18"],
        explanation: "18 − 3 = 15, 15 + 2 = 17."
      },
      {
        text: "Qaysi ifodaning qiymati katta: 18 − (3 + 2) yoki (18 − 3) + 2?",
        correctAnswer: "(18 − 3) + 2 katta (17 > 13)",
        distractors: ["18 − (3 + 2) katta", "Ikkalasi teng", "Bilmayman"],
        explanation: "17 soni 13 dan katta."
      }
    ],
    test: [
      {
        text: "Hisoblang: 16 − (4 + 2) = ?",
        correctAnswer: "10",
        distractors: ["14", "9", "12"],
        explanation: "4 + 2 = 6, 16 − 6 = 10."
      },
      {
        text: "Hisoblang: (16 − 4) + 2 = ?",
        correctAnswer: "14",
        distractors: ["10", "13", "15"],
        explanation: "16 − 4 = 12, 12 + 2 = 14."
      },
      {
        text: "Hisoblang: 15 − (6 + 3) = ?",
        correctAnswer: "6",
        distractors: ["12", "7", "5"],
        explanation: "6 + 3 = 9, 15 − 9 = 6."
      },
      {
        text: "Hisoblang: (15 − 6) + 3 = ?",
        correctAnswer: "12",
        distractors: ["6", "11", "13"],
        explanation: "15 − 6 = 9, 9 + 3 = 12."
      },
      {
        text: "Hisoblang: 20 − (7 + 3) = ?",
        correctAnswer: "10",
        distractors: ["16", "9", "11"],
        explanation: "7 + 3 = 10, 20 − 10 = 10."
      },
      {
        text: "Hisoblang: (20 − 7) + 3 = ?",
        correctAnswer: "16",
        distractors: ["10", "15", "17"],
        explanation: "20 − 7 = 13, 13 + 3 = 16."
      },
      {
        text: "Hisoblang: (5 + 5) + (4 + 3) = ?",
        correctAnswer: "17",
        distractors: ["16", "18", "15"],
        explanation: "10 + 7 = 17."
      },
      {
        text: "Hisoblang: (10 + 2) − (4 + 2) = ?",
        correctAnswer: "6",
        distractors: ["5", "7", "8"],
        explanation: "12 − 6 = 6."
      },
      {
        text: "Hisoblang: (9 + 3) − (5 + 1) = ?",
        correctAnswer: "6",
        distractors: ["5", "7", "8"],
        explanation: "12 − 6 = 6."
      },
      {
        text: "Hisoblang: 14 − (2 + 5) = ?",
        correctAnswer: "7",
        distractors: ["6", "8", "11"],
        explanation: "2 + 5 = 7, 14 − 7 = 7."
      },
      {
        text: "Hisoblang: (14 − 2) + 5 = ?",
        correctAnswer: "17",
        distractors: ["7", "16", "18"],
        explanation: "14 − 2 = 12, 12 + 5 = 17."
      },
      {
        text: "Amallar tartibida 1-raqam qaysi amal ustiga qo‘yiladi: 12 + (8 − 3)?",
        correctAnswer: "Qavs ichidagi (8 − 3) ayirish ustiga",
        distractors: ["Qo‘shish (12 + 8) ustiga", "12 soni ustiga", "Tenglik ustiga"],
        explanation: "Qavs ichidagi amal doim 1-bo‘lib bajariladi."
      },
      {
        text: "Taqqoslang: 15 − (4 + 1) ... (15 − 4) + 1. Qaysi belgi to‘g‘ri?",
        correctAnswer: "< (10 < 12)",
        distractors: [">", "=", "+"],
        explanation: "15 − 5 = 10, 11 + 1 = 12. 10 < 12."
      },
      {
        text: "Taqqoslang: 16 − (5 + 2) ... 16 − 5 − 2. Qaysi belgi to‘g‘ri?",
        correctAnswer: "= (ikkalasi ham 9)",
        distractors: [">", "<", "−"],
        explanation: "16 − 7 = 9 va 11 − 2 = 9. Ular teng."
      },
      {
        text: "Qaysi ifodaning qiymati 15 ga teng?",
        correctAnswer: "(20 − 10) + 5",
        distractors: ["20 − (10 + 5)", "(20 − 15) + 5", "20 − (5 + 5)"],
        explanation: "10 + 5 = 15."
      },
      {
        text: "Do‘konda 18 ta daftar bor edi. Ertalab 5 ta, tushdan keyin 3 ta daftar sotildi: 18 − (5 + 3). Nechta daftar qoldi?",
        correctAnswer: "10 ta daftar",
        distractors: ["9 ta", "11 ta", "16 ta"],
        explanation: "5 + 3 = 8 ta sotildi, 18 − 8 = 10 ta qoldi."
      },
      {
        text: "Avtobusda 17 kishi bor edi. Bekatda 4 kishi tushdi, keyin 2 kishi chiqdi: (17 − 4) + 2. Nechta yo‘lovchi bo‘ldi?",
        correctAnswer: "15 ta yo‘lovchi",
        distractors: ["11 ta", "14 ta", "16 ta"],
        explanation: "17 − 4 = 13, 13 + 2 = 15."
      },
      {
        text: "To‘g‘ri tenglikni toping:",
        correctAnswer: "18 − (3 + 2) = 13",
        distractors: ["18 − (3 + 2) = 17", "18 − (3 + 2) = 15", "18 − (3 + 2) = 12"],
        explanation: "18 − 5 = 13 to‘g‘ri."
      },
      {
        text: "Hisoblang: (8 + 2) + (6 + 4) = ?",
        correctAnswer: "20",
        distractors: ["19", "18", "16"],
        explanation: "10 + 10 = 20."
      },
      {
        text: "Hisoblang: 17 − (5 + 5) = ?",
        correctAnswer: "7",
        distractors: ["6", "8", "12"],
        explanation: "5 + 5 = 10, 17 − 10 = 7."
      }
    ]
  },

  // 52. Bir xonali sonlarni o‘nlikdan o‘tib qo‘shish
  {
    bookNumber: 52,
    title: "Bir xonali sonlarni o‘nlikdan o‘tib qo‘shish",
    emoji: "➕",
    shortDesc: "Qo‘shiluvchini 10 gacha to‘ldirish (8+5=(8+2)+3), to‘liq o‘nlikni ajratish, 9+4, 7+6.",
    intro: "O‘nlikdan o‘tib qo‘shishda ikkinchi son shunday bo‘laklanadiki, birinchi son 10 gacha to‘ldiriladi.",
    keyPoints: [
      "Qoida: Birinchi qo‘shiluvchini 10 gacha to‘ldiramiz.",
      "Misol: 8 + 5 = 8 + (2 + 3) = (8 + 2) + 3 = 10 + 3 = 13.",
      "9 + 4 = (9 + 1) + 3 = 13, 7 + 6 = (7 + 3) + 3 = 13."
    ],
    miniExample: {
      emojis: "8️⃣ + 5️⃣ ➡️ (8+2)+3 = 1️⃣3️⃣",
      text: "8 ga 2 ni qo‘shib 10 qilamiz, qolgan 3 ni qo‘shsak 13 bo‘ladi!"
    },
    xpReward: 110,
    coinReward: 12,
    estMinutes: 7,
    practice: [
      {
        text: "Hisoblang: 9 + 4 = ?",
        correctAnswer: "13",
        distractors: ["12", "14", "15"],
        explanation: "9 + 1 = 10, 10 + 3 = 13."
      },
      {
        text: "8 sonini 10 gacha to‘ldirish uchun necha kerak?",
        correctAnswer: "2",
        distractors: ["1", "3", "4"],
        explanation: "8 + 2 = 10."
      },
      {
        text: "Hisoblang: 7 + 6 = ?",
        correctAnswer: "13",
        distractors: ["12", "14", "15"],
        explanation: "7 + 3 = 10, 10 + 3 = 13."
      }
    ],
    test: [
      {
        text: "Misolni hisoblang: 9 + 2 = ?",
        correctAnswer: "11",
        distractors: ["10", "12", "13"],
        explanation: "9 + 1 = 10, 10 + 1 = 11."
      },
      {
        text: "Misolni hisoblang: 9 + 3 = ?",
        correctAnswer: "12",
        distractors: ["11", "13", "14"],
        explanation: "9 + 1 = 10, 10 + 2 = 12."
      },
      {
        text: "Misolni hisoblang: 9 + 4 = ?",
        correctAnswer: "13",
        distractors: ["12", "14", "15"],
        explanation: "9 + 1 = 10, 10 + 3 = 13."
      },
      {
        text: "Misolni hisoblang: 9 + 5 = ?",
        correctAnswer: "14",
        distractors: ["13", "15", "16"],
        explanation: "9 + 1 = 10, 10 + 4 = 14."
      },
      {
        text: "Misolni hisoblang: 8 + 3 = ?",
        correctAnswer: "11",
        distractors: ["10", "12", "13"],
        explanation: "8 + 2 = 10, 10 + 1 = 11."
      },
      {
        text: "Misolni hisoblang: 8 + 4 = ?",
        correctAnswer: "12",
        distractors: ["11", "13", "14"],
        explanation: "8 + 2 = 10, 10 + 2 = 12."
      },
      {
        text: "Misolni hisoblang: 8 + 5 = ?",
        correctAnswer: "13",
        distractors: ["12", "14", "15"],
        explanation: "8 + 2 = 10, 10 + 3 = 13."
      },
      {
        text: "Misolni hisoblang: 7 + 4 = ?",
        correctAnswer: "11",
        distractors: ["10", "12", "13"],
        explanation: "7 + 3 = 10, 10 + 1 = 11."
      },
      {
        text: "Misolni hisoblang: 7 + 5 = ?",
        correctAnswer: "12",
        distractors: ["11", "13", "14"],
        explanation: "7 + 3 = 10, 10 + 2 = 12."
      },
      {
        text: "Misolni hisoblang: 7 + 6 = ?",
        correctAnswer: "13",
        distractors: ["12", "14", "15"],
        explanation: "7 + 3 = 10, 10 + 3 = 13."
      },
      {
        text: "Misolni hisoblang: 6 + 5 = ?",
        correctAnswer: "11",
        distractors: ["10", "12", "13"],
        explanation: "6 + 4 = 10, 10 + 1 = 11."
      },
      {
        text: "8 + 5 ni hisoblashda 5 soni qaysi ikkita songa ajratiladi?",
        correctAnswer: "2 va 3 ga (chunki 8 + 2 = 10)",
        distractors: ["1 va 4 ga", "2 va 2 ga", "3 va 3 ga"],
        explanation: "8 ni 10 ga to‘ldirish uchun 2 olinadi, qolgani 3."
      },
      {
        text: "7 + 6 ni hisoblashda 6 soni qaysi ikkita songa ajratiladi?",
        correctAnswer: "3 va 3 ga (chunki 7 + 3 = 10)",
        distractors: ["2 va 4 ga", "1 va 5 ga", "4 va 2 ga"],
        explanation: "7 ni 10 ga to‘ldirish uchun 3 kerak, 6 dan 3 qoladi."
      },
      {
        text: "9 + 7 ni hisoblashda 7 soni qaysi ikkita songa ajratiladi?",
        correctAnswer: "1 va 6 ga (chunki 9 + 1 = 10)",
        distractors: ["2 va 5 ga", "3 va 4 ga", "1 va 5 ga"],
        explanation: "9 ni 10 qilish uchun 1 olinadi, qolgani 6."
      },
      {
        text: "Qaysi ifodaning qiymati 12 ga teng?",
        correctAnswer: "8 + 4",
        distractors: ["8 + 3", "7 + 4", "9 + 2"],
        explanation: "8 + 4 = 12."
      },
      {
        text: "Qaysi ifodaning qiymati 13 ga teng?",
        correctAnswer: "9 + 4",
        distractors: ["9 + 3", "8 + 4", "7 + 5"],
        explanation: "9 + 4 = 13."
      },
      {
        text: "Savatda 8 ta olma bor edi. Dilshod yana 5 ta solsa jami nechta bo‘ladi?",
        correctAnswer: "13 ta olma",
        distractors: ["12 ta", "14 ta", "15 ta"],
        explanation: "8 + 5 = 13 ta olma."
      },
      {
        text: "Gulshanning 9 ta oq va 4 ta sariq atirguli bor. Jami atirgullar nechta?",
        correctAnswer: "13 ta atirgul",
        distractors: ["12 ta", "14 ta", "15 ta"],
        explanation: "9 + 4 = 13 ta atirgul."
      },
      {
        text: "Stol ustida 7 ta qalam bor edi, yana 6 ta qo‘yildi. Qalamlar nechta bo‘ldi?",
        correctAnswer: "13 ta qalam",
        distractors: ["12 ta", "14 ta", "11 ta"],
        explanation: "7 + 6 = 13 ta qalam."
      },
      {
        text: "To‘g‘ri tenglikni toping:",
        correctAnswer: "8 + 5 = 13",
        distractors: ["8 + 5 = 12", "8 + 5 = 14", "8 + 5 = 15"],
        explanation: "8 + 5 = 13 to‘g‘ri tenglikdir."
      }
    ]
  },

  // 53. Bir xonali sonlarni o‘nlikdan o‘tib qo‘shish (2)
  {
    bookNumber: 53,
    title: "Bir xonali sonlarni o‘nlikdan o‘tib qo‘shish (2)",
    emoji: "➕",
    shortDesc: "7+5, 9+7, 8+8, 8+3 kabi ifodalar tuzib masala yechish.",
    intro: "Kattaroq sonlarni o‘nlikdan o‘tib qo‘shish: 8 + 8 = 16, 9 + 7 = 16, 7 + 5 = 12.",
    keyPoints: [
      "9 ga qo‘shish eng oson: ikkinchi sondan 1 ni olib 10 qilamiz.",
      "8 + 8 = 16, 9 + 8 = 17, 9 + 9 = 18.",
      "Masalalarda ifoda tuzib, o‘nlikdan o‘tish usulini qo‘llaymiz."
    ],
    miniExample: {
      emojis: "9️⃣ + 7️⃣ ➡️ (9+1)+6 = 1️⃣6️⃣",
      text: "9 + 7: 9 ga 1 ni qo‘shib 10 qilamiz, 6 ni qo‘shsak 16 bo‘ladi!"
    },
    xpReward: 110,
    coinReward: 12,
    estMinutes: 7,
    practice: [
      {
        text: "Hisoblang: 9 + 7 = ?",
        correctAnswer: "16",
        distractors: ["15", "17", "18"],
        explanation: "9 + 1 = 10, 10 + 6 = 16."
      },
      {
        text: "Hisoblang: 8 + 8 = ?",
        correctAnswer: "16",
        distractors: ["15", "17", "14"],
        explanation: "8 + 8 = 16."
      },
      {
        text: "Hisoblang: 9 + 8 = ?",
        correctAnswer: "17",
        distractors: ["16", "18", "19"],
        explanation: "9 + 8 = 17."
      }
    ],
    test: [
      {
        text: "Misolni hisoblang: 9 + 6 = ?",
        correctAnswer: "15",
        distractors: ["14", "16", "17"],
        explanation: "9 + 6 = 15."
      },
      {
        text: "Misolni hisoblang: 9 + 7 = ?",
        correctAnswer: "16",
        distractors: ["15", "17", "18"],
        explanation: "9 + 7 = 16."
      },
      {
        text: "Misolni hisoblang: 9 + 8 = ?",
        correctAnswer: "17",
        distractors: ["16", "18", "19"],
        explanation: "9 + 8 = 17."
      },
      {
        text: "Misolni hisoblang: 9 + 9 = ?",
        correctAnswer: "18",
        distractors: ["17", "19", "16"],
        explanation: "9 + 9 = 18."
      },
      {
        text: "Misolni hisoblang: 8 + 6 = ?",
        correctAnswer: "14",
        distractors: ["13", "15", "16"],
        explanation: "8 + 6 = 14."
      },
      {
        text: "Misolni hisoblang: 8 + 7 = ?",
        correctAnswer: "15",
        distractors: ["14", "16", "17"],
        explanation: "8 + 7 = 15."
      },
      {
        text: "Misolni hisoblang: 8 + 8 = ?",
        correctAnswer: "16",
        distractors: ["15", "17", "14"],
        explanation: "8 + 8 = 16."
      },
      {
        text: "Misolni hisoblang: 8 + 9 = ?",
        correctAnswer: "17",
        distractors: ["16", "18", "19"],
        explanation: "8 + 9 = 17."
      },
      {
        text: "Misolni hisoblang: 7 + 7 = ?",
        correctAnswer: "14",
        distractors: ["13", "15", "16"],
        explanation: "7 + 7 = 14."
      },
      {
        text: "Misolni hisoblang: 7 + 8 = ?",
        correctAnswer: "15",
        distractors: ["14", "16", "17"],
        explanation: "7 + 8 = 15."
      },
      {
        text: "Misolni hisoblang: 7 + 9 = ?",
        correctAnswer: "16",
        distractors: ["15", "17", "18"],
        explanation: "7 + 9 = 16."
      },
      {
        text: "Misolni hisoblang: 6 + 6 = ?",
        correctAnswer: "12",
        distractors: ["11", "13", "14"],
        explanation: "6 + 6 = 12."
      },
      {
        text: "Misolni hisoblang: 6 + 7 = ?",
        correctAnswer: "13",
        distractors: ["12", "14", "15"],
        explanation: "6 + 7 = 13."
      },
      {
        text: "Misolni hisoblang: 6 + 8 = ?",
        correctAnswer: "14",
        distractors: ["13", "15", "16"],
        explanation: "6 + 8 = 14."
      },
      {
        text: "Misolni hisoblang: 6 + 9 = ?",
        correctAnswer: "15",
        distractors: ["14", "16", "17"],
        explanation: "6 + 9 = 15."
      },
      {
        text: "Qaysi ifodaning qiymati 16 ga teng?",
        correctAnswer: "8 + 8",
        distractors: ["8 + 7", "9 + 6", "7 + 8"],
        explanation: "8 + 8 = 16."
      },
      {
        text: "Qaysi ifodaning qiymati 18 ga teng?",
        correctAnswer: "9 + 9",
        distractors: ["9 + 8", "8 + 8", "10 + 7"],
        explanation: "9 + 9 = 18."
      },
      {
        text: "Bog‘bon 8 tup olma va 7 tup o‘rik ko‘chati o‘tqazdi. U jami nechta ko‘chat o‘tqazdi?",
        correctAnswer: "15 tup ko‘chat",
        distractors: ["14 tup", "16 tup", "17 tup"],
        explanation: "8 + 7 = 15 tup ko‘chat."
      },
      {
        text: "Avtobusda 9 ta bola va 8 ta katta odam ketmoqda. Avtobusda jami nechta yo‘lovchi bor?",
        correctAnswer: "17 ta yo‘lovchi",
        distractors: ["16 ta", "18 ta", "19 ta"],
        explanation: "9 + 8 = 17 ta yo‘lovchi."
      },
      {
        text: "Kutubxonada 8 ta ertak kitob va 8 ta she’riy kitob olindi. Jami nechta kitob olindi?",
        correctAnswer: "16 ta kitob",
        distractors: ["15 ta", "17 ta", "14 ta"],
        explanation: "8 + 8 = 16 ta kitob."
      }
    ]
  },

  // 54. Bir xonali sonlarni o‘nlikdan o‘tib qo‘shish (3)
  {
    bookNumber: 54,
    title: "Bir xonali sonlarni o‘nlikdan o‘tib qo‘shish (3)",
    emoji: "➕",
    shortDesc: "Aralash misollar, sonli qatorda qo‘shish va hayotiy masalalar (daraxtlar, kaptarlar).",
    intro: "O‘nlikdan o‘tib qo‘shish malakalarini mustahkamlaymiz va qiziqarli masalalar yechamiz.",
    keyPoints: [
      "Sonli to‘g‘ri chiziqda o‘ngga qarab qadamlab qo‘shish mumkin.",
      "Masalalarni yechishda qisqa shart tuzib, to‘g‘ri ifoda yozamiz.",
      "Barcha bir xonali sonlarning o‘nlikdan o‘tib qo‘shilishini tez hisoblaymiz."
    ],
    miniExample: {
      emojis: "🌳 8️⃣ + 6️⃣ = 1️⃣4️⃣",
      text: "Bog‘da 8 tup chinor va 6 tup terak — jami 14 tup daraxt!"
    },
    xpReward: 110,
    coinReward: 12,
    estMinutes: 7,
    practice: [
      {
        text: "Hisoblang: 8 + 6 = ?",
        correctAnswer: "14",
        distractors: ["13", "15", "16"],
        explanation: "8 + 2 = 10, 10 + 4 = 14."
      },
      {
        text: "Hisoblang: 7 + 8 = ?",
        correctAnswer: "15",
        distractors: ["14", "16", "17"],
        explanation: "7 + 3 = 10, 10 + 5 = 15."
      },
      {
        text: "Tomda 8 ta kaptar o‘tirgan edi, yana 5 ta qo‘ndi. Jami nechta bo‘ldi?",
        correctAnswer: "13 ta kaptar",
        distractors: ["12 ta", "14 ta", "15 ta"],
        explanation: "8 + 5 = 13 ta kaptar."
      }
    ],
    test: [
      {
        text: "Misolni hisoblang: 9 + 5 = ?",
        correctAnswer: "14",
        distractors: ["13", "15", "16"],
        explanation: "9 + 5 = 14."
      },
      {
        text: "Misolni hisoblang: 8 + 7 = ?",
        correctAnswer: "15",
        distractors: ["14", "16", "17"],
        explanation: "8 + 7 = 15."
      },
      {
        text: "Misolni hisoblang: 7 + 6 = ?",
        correctAnswer: "13",
        distractors: ["12", "14", "15"],
        explanation: "7 + 6 = 13."
      },
      {
        text: "Misolni hisoblang: 9 + 8 = ?",
        correctAnswer: "17",
        distractors: ["16", "18", "19"],
        explanation: "9 + 8 = 17."
      },
      {
        text: "Misolni hisoblang: 6 + 7 = ?",
        correctAnswer: "13",
        distractors: ["12", "14", "11"],
        explanation: "6 + 7 = 13."
      },
      {
        text: "Misolni hisoblang: 8 + 8 = ?",
        correctAnswer: "16",
        distractors: ["15", "17", "14"],
        explanation: "8 + 8 = 16."
      },
      {
        text: "Misolni hisoblang: 7 + 9 = ?",
        correctAnswer: "16",
        distractors: ["15", "17", "18"],
        explanation: "7 + 9 = 16."
      },
      {
        text: "Misolni hisoblang: 9 + 9 = ?",
        correctAnswer: "18",
        distractors: ["17", "19", "20"],
        explanation: "9 + 9 = 18."
      },
      {
        text: "Misolni hisoblang: 5 + 8 = ?",
        correctAnswer: "13",
        distractors: ["12", "14", "15"],
        explanation: "5 + 8 = 13."
      },
      {
        text: "Misolni hisoblang: 6 + 8 = ?",
        correctAnswer: "14",
        distractors: ["13", "15", "16"],
        explanation: "6 + 8 = 14."
      },
      {
        text: "Tenglikni to‘ldiring: □ + 7 = 15. Katakdagi son nima?",
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
        text: "Tenglikni to‘ldiring: 8 + □ = 17. Katakdagi son nima?",
        correctAnswer: "9",
        distractors: ["8", "10", "7"],
        explanation: "17 − 8 = 9."
      },
      {
        text: "Taqqoslang: 8 + 6 ... 9 + 5. Qaysi belgi to‘g‘ri?",
        correctAnswer: "= (chunki 14 = 14)",
        distractors: [">", "<", "+"],
        explanation: "8 + 6 = 14 va 9 + 5 = 14. 14 = 14."
      },
      {
        text: "Taqqoslang: 7 + 8 ... 9 + 7. Qaysi belgi to‘g‘ri?",
        correctAnswer: "< (15 < 16)",
        distractors: [">", "=", "−"],
        explanation: "7 + 8 = 15 va 9 + 7 = 16. 15 < 16."
      },
      {
        text: "Maktab hovlisida 8 ta archa va 9 ta kashtan daraxti ekildi. Jami nechta daraxt ekildi?",
        correctAnswer: "17 ta daraxt",
        distractors: ["16 ta", "18 ta", "15 ta"],
        explanation: "8 + 9 = 17 ta daraxt."
      },
      {
        text: "Simda 9 ta qaldirg‘och o‘tirgan edi, yana 7 ta qaldirg‘och qo‘ndi. Jami nechta bo‘ldi?",
        correctAnswer: "16 ta qaldirg‘och",
        distractors: ["15 ta", "17 ta", "18 ta"],
        explanation: "9 + 7 = 16 ta qaldirg‘och."
      },
      {
        text: "Anvar 8 ta oq va 6 ta ko‘k sharni shishirdi. U jami nechta shar tayyorladi?",
        correctAnswer: "14 ta shar",
        distractors: ["13 ta", "15 ta", "16 ta"],
        explanation: "8 + 6 = 14 ta shar."
      },
      {
        text: "Bog‘dan 7 ta shaftoli va 8 ta nok uzildi. Jami mevalar soni nechta?",
        correctAnswer: "15 ta meva",
        distractors: ["14 ta", "16 ta", "17 ta"],
        explanation: "7 + 8 = 15 ta meva."
      },
      {
        text: "To‘g‘ri tenglikni toping:",
        correctAnswer: "9 + 6 = 15",
        distractors: ["9 + 6 = 14", "9 + 6 = 16", "9 + 6 = 17"],
        explanation: "9 + 6 = 15 to‘g‘ri."
      }
    ]
  },

  // 55. Sonlarni ayirish (birliklardan ayirish)
  {
    bookNumber: 55,
    title: "Sonlarni ayirish",
    emoji: "➖",
    shortDesc: "Birliklardan ayirish (18-2 = 10 + (8-2) = 16), 17-4, 15-2 va masalalar.",
    intro: "Ikki xonali sondan bir xonali sonni ayirishda birliklar birliklardan ayiriladi, o‘nlik o‘zgarishsiz qoladi.",
    keyPoints: [
      "Qoida: Birliklarni birlikdan ayiramiz: 18 − 2 da 8 − 2 = 6, o‘nlik qo‘shilsa 16 bo‘ladi.",
      "17 − 4 = 13 (chunki 7 − 4 = 3).",
      "15 − 2 = 13 (chunki 5 − 2 = 3)."
    ],
    miniExample: {
      emojis: "1️⃣8️⃣ − 2️⃣ = 1️⃣6️⃣",
      text: "18 − 2 = 10 + (8 − 2) = 10 + 6 = 16!"
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Hisoblang: 18 − 3 = ?",
        correctAnswer: "15",
        distractors: ["14", "16", "13"],
        explanation: "8 − 3 = 5, o‘nlik bilan 15."
      },
      {
        text: "Hisoblang: 17 − 4 = ?",
        correctAnswer: "13",
        distractors: ["12", "14", "15"],
        explanation: "7 − 4 = 3, o‘nlik bilan 13."
      },
      {
        text: "Hisoblang: 16 − 5 = ?",
        correctAnswer: "11",
        distractors: ["10", "12", "13"],
        explanation: "6 − 5 = 1, o‘nlik bilan 11."
      }
    ],
    test: [
      {
        text: "Misolni hisoblang: 14 − 2 = ?",
        correctAnswer: "12",
        distractors: ["11", "13", "10"],
        explanation: "4 − 2 = 2, natija 12."
      },
      {
        text: "Misolni hisoblang: 15 − 3 = ?",
        correctAnswer: "12",
        distractors: ["11", "13", "14"],
        explanation: "5 − 3 = 2, natija 12."
      },
      {
        text: "Misolni hisoblang: 16 − 4 = ?",
        correctAnswer: "12",
        distractors: ["11", "13", "10"],
        explanation: "6 − 4 = 2, natija 12."
      },
      {
        text: "Misolni hisoblang: 17 − 5 = ?",
        correctAnswer: "12",
        distractors: ["11", "13", "14"],
        explanation: "7 − 5 = 2, natija 12."
      },
      {
        text: "Misolni hisoblang: 18 − 6 = ?",
        correctAnswer: "12",
        distractors: ["11", "13", "14"],
        explanation: "8 − 6 = 2, natija 12."
      },
      {
        text: "Misolni hisoblang: 19 − 7 = ?",
        correctAnswer: "12",
        distractors: ["11", "13", "14"],
        explanation: "9 − 7 = 2, natija 12."
      },
      {
        text: "Misolni hisoblang: 17 − 3 = ?",
        correctAnswer: "14",
        distractors: ["13", "15", "16"],
        explanation: "7 − 3 = 4, natija 14."
      },
      {
        text: "Misolni hisoblang: 18 − 4 = ?",
        correctAnswer: "14",
        distractors: ["13", "15", "12"],
        explanation: "8 − 4 = 4, natija 14."
      },
      {
        text: "Misolni hisoblang: 19 − 5 = ?",
        correctAnswer: "14",
        distractors: ["13", "15", "16"],
        explanation: "9 − 5 = 4, natija 14."
      },
      {
        text: "Misolni hisoblang: 16 − 3 = ?",
        correctAnswer: "13",
        distractors: ["12", "14", "15"],
        explanation: "6 − 3 = 3, natija 13."
      },
      {
        text: "Misolni hisoblang: 15 − 2 = ?",
        correctAnswer: "13",
        distractors: ["12", "14", "11"],
        explanation: "5 − 2 = 3, natija 13."
      },
      {
        text: "Misolni hisoblang: 18 − 2 = ?",
        correctAnswer: "16",
        distractors: ["15", "17", "14"],
        explanation: "8 − 2 = 6, natija 16."
      },
      {
        text: "Misolni hisoblang: 19 − 3 = ?",
        correctAnswer: "16",
        distractors: ["15", "17", "18"],
        explanation: "9 − 3 = 6, natija 16."
      },
      {
        text: "Misolni hisoblang: 17 − 2 = ?",
        correctAnswer: "15",
        distractors: ["14", "16", "13"],
        explanation: "7 − 2 = 5, natija 15."
      },
      {
        text: "Misolni hisoblang: 19 − 1 = ?",
        correctAnswer: "18",
        distractors: ["17", "19", "20"],
        explanation: "9 − 1 = 8, natija 18."
      },
      {
        text: "Birliklardan ayirish qoidasi qaysi javobda to‘g‘ri?",
        correctAnswer: "Bir xonali son ikki xonali sonning birliklaridan ayiriladi",
        distractors: ["O‘nlikdan ayiriladi", "Ikkala raqamdan ham ayiriladi", "Amal bajarilmaydi"],
        explanation: "18 − 2 da 2 faqat 8 dan ayiriladi."
      },
      {
        text: "Savatda 18 ta nok bor edi. 5 tasi yeyildi. Nechta nok qoldi?",
        correctAnswer: "13 ta nok",
        distractors: ["12 ta", "14 ta", "15 ta"],
        explanation: "18 − 5 = 13 ta nok."
      },
      {
        text: "Avtobusda 16 kishi bor edi. Bekatda 2 kishi tushdi. Nechta kishi qoldi?",
        correctAnswer: "14 kishi",
        distractors: ["13 kishi", "15 kishi", "12 kishi"],
        explanation: "16 − 2 = 14 kishi."
      },
      {
        text: "Daftar 19 varaq edi. Anvar 4 varag‘iga rasm chizdi. Nechta toza varaq qoldi?",
        correctAnswer: "15 ta toza varaq",
        distractors: ["14 ta", "16 ta", "17 ta"],
        explanation: "19 − 4 = 15 ta varaq."
      },
      {
        text: "Qaysi ifodaning qiymati 11 ga teng?",
        correctAnswer: "17 − 6",
        distractors: ["18 − 6", "16 − 6", "19 − 6"],
        explanation: "17 − 6 = 11."
      }
    ]
  },

  // 56. Sonlarni bo‘laklab ayirish
  {
    bookNumber: 56,
    title: "Sonlarni bo‘laklab ayirish",
    emoji: "➖",
    shortDesc: "Ayriluvchini ikki songa ajratish (13-9=(13-3)-6=4), 15-7, 12-6, 16-9.",
    intro: "O‘nlikdan o‘tib ayirishda ayriluvchi bo‘laklanadi: avval 10 gacha kamaytiriladi, so‘ng qolgani ayiriladi.",
    keyPoints: [
      "Qoida: Ayriluvchini kamayuvchining birliklariga teng qilib ajratamiz.",
      "Misol: 13 − 9 da 9 ni 3 va 6 ga ajratamiz: (13 − 3) − 6 = 10 − 6 = 4.",
      "15 − 7 = (15 − 5) − 2 = 10 − 2 = 8."
    ],
    miniExample: {
      emojis: "1️⃣3️⃣ − 9️⃣ ➡️ (13-3)-6 = 4️⃣",
      text: "13 dan 3 ni ayirib 10 qilamiz, keyin 6 ni ayirsak 4 qoladi!"
    },
    xpReward: 110,
    coinReward: 12,
    estMinutes: 7,
    practice: [
      {
        text: "Hisoblang: 13 − 9 = ?",
        correctAnswer: "4",
        distractors: ["3", "5", "6"],
        explanation: "13 − 3 = 10, 10 − 6 = 4."
      },
      {
        text: "Hisoblang: 15 − 7 = ?",
        correctAnswer: "8",
        distractors: ["7", "9", "6"],
        explanation: "15 − 5 = 10, 10 − 2 = 8."
      },
      {
        text: "Hisoblang: 12 − 6 = ?",
        correctAnswer: "6",
        distractors: ["5", "7", "8"],
        explanation: "12 − 2 = 10, 10 − 4 = 6."
      }
    ],
    test: [
      {
        text: "Misolni hisoblang: 11 − 4 = ?",
        correctAnswer: "7",
        distractors: ["6", "8", "9"],
        explanation: "11 − 1 = 10, 10 − 3 = 7."
      },
      {
        text: "Misolni hisoblang: 11 − 5 = ?",
        correctAnswer: "6",
        distractors: ["5", "7", "8"],
        explanation: "11 − 1 = 10, 10 − 4 = 6."
      },
      {
        text: "Misolni hisoblang: 12 − 5 = ?",
        correctAnswer: "7",
        distractors: ["6", "8", "9"],
        explanation: "12 − 2 = 10, 10 − 3 = 7."
      },
      {
        text: "Misolni hisoblang: 12 − 7 = ?",
        correctAnswer: "5",
        distractors: ["4", "6", "8"],
        explanation: "12 − 2 = 10, 10 − 5 = 5."
      },
      {
        text: "Misolni hisoblang: 13 − 6 = ?",
        correctAnswer: "7",
        distractors: ["6", "8", "5"],
        explanation: "13 − 3 = 10, 10 − 3 = 7."
      },
      {
        text: "Misolni hisoblang: 13 − 8 = ?",
        correctAnswer: "5",
        distractors: ["4", "6", "7"],
        explanation: "13 − 3 = 10, 10 − 5 = 5."
      },
      {
        text: "Misolni hisoblang: 14 − 6 = ?",
        correctAnswer: "8",
        distractors: ["7", "9", "6"],
        explanation: "14 − 4 = 10, 10 − 2 = 8."
      },
      {
        text: "Misolni hisoblang: 14 − 8 = ?",
        correctAnswer: "6",
        distractors: ["5", "7", "8"],
        explanation: "14 − 4 = 10, 10 − 4 = 6."
      },
      {
        text: "Misolni hisoblang: 15 − 8 = ?",
        correctAnswer: "7",
        distractors: ["6", "8", "9"],
        explanation: "15 − 5 = 10, 10 − 3 = 7."
      },
      {
        text: "Misolni hisoblang: 15 − 9 = ?",
        correctAnswer: "6",
        distractors: ["5", "7", "8"],
        explanation: "15 − 5 = 10, 10 − 4 = 6."
      },
      {
        text: "Misolni hisoblang: 16 − 7 = ?",
        correctAnswer: "9",
        distractors: ["8", "10", "6"],
        explanation: "16 − 6 = 10, 10 − 1 = 9."
      },
      {
        text: "Misolni hisoblang: 16 − 9 = ?",
        correctAnswer: "7",
        distractors: ["6", "8", "9"],
        explanation: "16 − 6 = 10, 10 − 3 = 7."
      },
      {
        text: "13 − 9 da 9 qaysi ikkita songa ajratiladi?",
        correctAnswer: "3 va 6 ga (chunki 13 − 3 = 10)",
        distractors: ["4 va 5 ga", "2 va 7 ga", "1 va 8 ga"],
        explanation: "Avval 10 gacha kamaytirish uchun 3 olinadi, qolgani 6."
      },
      {
        text: "15 − 7 da 7 qaysi ikkita songa ajratiladi?",
        correctAnswer: "5 va 2 ga (chunki 15 − 5 = 10)",
        distractors: ["3 va 4 ga", "1 va 6 ga", "4 va 3 ga"],
        explanation: "15 ni 10 qilish uchun 5 olinadi, qolgani 2."
      },
      {
        text: "14 − 8 da 8 qaysi ikkita songa ajratiladi?",
        correctAnswer: "4 va 4 ga (chunki 14 − 4 = 10)",
        distractors: ["3 va 5 ga", "2 va 6 ga", "1 va 7 ga"],
        explanation: "14 ni 10 qilish uchun 4 olinadi, qolgani 4."
      },
      {
        text: "Qaysi ifodaning qiymati 8 ga teng?",
        correctAnswer: "15 − 7",
        distractors: ["15 − 6", "14 − 7", "13 − 6"],
        explanation: "15 − 7 = 8."
      },
      {
        text: "Qaysi ifodaning qiymati 9 ga teng?",
        correctAnswer: "16 − 7",
        distractors: ["16 − 8", "15 − 7", "14 − 6"],
        explanation: "16 − 7 = 9."
      },
      {
        text: "Savatda 13 ta nok bor edi. Bolalar 5 tasini yeyishdi. Nechta nok qoldi?",
        correctAnswer: "8 ta nok",
        distractors: ["7 ta", "9 ta", "6 ta"],
        explanation: "13 − 5 = 8 ta nok."
      },
      {
        text: "Daraxtda 15 ta qush o‘tirgan edi. 8 tasi uchib ketdi. Nechta qush qoldi?",
        correctAnswer: "7 ta qush",
        distractors: ["6 ta", "8 ta", "9 ta"],
        explanation: "15 − 8 = 7 ta qush."
      },
      {
        text: "Sardor 16 ta misoldan 9 tasini yechdi. Yana nechta misol qoldi?",
        correctAnswer: "7 ta misol",
        distractors: ["6 ta", "8 ta", "9 ta"],
        explanation: "16 − 9 = 7 ta misol."
      }
    ]
  },

  // 57. O‘nlikdan ayirish usuli
  {
    bookNumber: 57,
    title: "O‘nlikdan ayirish usuli",
    emoji: "➖",
    shortDesc: "O‘nlikdan ayirish usuli (12-8 = 2 + (10-8) = 4), 14-8, 16-9, 17-8 va taqqoslash.",
    intro: "O‘nlikdan ayirish usulida son 10 va birliklarga ajratiladi: avval 10 dan ayirib, so‘ng birliklar qo‘shiladi.",
    keyPoints: [
      "12 − 8: 12 ni 10 va 2 deb olamiz.",
      "10 dan 8 ni ayiramiz: 10 − 8 = 2.",
      "Natijaga birlikni qo‘shamiz: 2 + 2 = 4!"
    ],
    miniExample: {
      emojis: "1️⃣2️⃣ − 8️⃣ ➡️ 2 + (10−8) = 4️⃣",
      text: "10 dan 8 ni ayirsak 2, unga 2 ni qo‘shsak 4 bo‘ladi!"
    },
    xpReward: 110,
    coinReward: 12,
    estMinutes: 7,
    practice: [
      {
        text: "Hisoblang: 14 − 8 = ?",
        correctAnswer: "6",
        distractors: ["5", "7", "8"],
        explanation: "10 − 8 = 2, 2 + 4 = 6."
      },
      {
        text: "Hisoblang: 16 − 9 = ?",
        correctAnswer: "7",
        distractors: ["6", "8", "9"],
        explanation: "10 − 9 = 1, 1 + 6 = 7."
      },
      {
        text: "Hisoblang: 17 − 8 = ?",
        correctAnswer: "9",
        distractors: ["8", "10", "7"],
        explanation: "10 − 8 = 2, 2 + 7 = 9."
      }
    ],
    test: [
      {
        text: "Misolni hisoblang: 11 − 8 = ?",
        correctAnswer: "3",
        distractors: ["2", "4", "5"],
        explanation: "10 − 8 = 2, 2 + 1 = 3."
      },
      {
        text: "Misolni hisoblang: 11 − 9 = ?",
        correctAnswer: "2",
        distractors: ["1", "3", "4"],
        explanation: "10 − 9 = 1, 1 + 1 = 2."
      },
      {
        text: "Misolni hisoblang: 12 − 8 = ?",
        correctAnswer: "4",
        distractors: ["3", "5", "6"],
        explanation: "10 − 8 = 2, 2 + 2 = 4."
      },
      {
        text: "Misolni hisoblang: 12 − 9 = ?",
        correctAnswer: "3",
        distractors: ["2", "4", "5"],
        explanation: "10 − 9 = 1, 1 + 2 = 3."
      },
      {
        text: "Misolni hisoblang: 13 − 7 = ?",
        correctAnswer: "6",
        distractors: ["5", "7", "8"],
        explanation: "10 − 7 = 3, 3 + 3 = 6."
      },
      {
        text: "Misolni hisoblang: 13 − 8 = ?",
        correctAnswer: "5",
        distractors: ["4", "6", "7"],
        explanation: "10 − 8 = 2, 2 + 3 = 5."
      },
      {
        text: "Misolni hisoblang: 13 − 9 = ?",
        correctAnswer: "4",
        distractors: ["3", "5", "6"],
        explanation: "10 − 9 = 1, 1 + 3 = 4."
      },
      {
        text: "Misolni hisoblang: 14 − 7 = ?",
        correctAnswer: "7",
        distractors: ["6", "8", "9"],
        explanation: "10 − 7 = 3, 3 + 4 = 7."
      },
      {
        text: "Misolni hisoblang: 14 − 8 = ?",
        correctAnswer: "6",
        distractors: ["5", "7", "8"],
        explanation: "10 − 8 = 2, 2 + 4 = 6."
      },
      {
        text: "Misolni hisoblang: 14 − 9 = ?",
        correctAnswer: "5",
        distractors: ["4", "6", "7"],
        explanation: "10 − 9 = 1, 1 + 4 = 5."
      },
      {
        text: "Misolni hisoblang: 15 − 8 = ?",
        correctAnswer: "7",
        distractors: ["6", "8", "9"],
        explanation: "10 − 8 = 2, 2 + 5 = 7."
      },
      {
        text: "Misolni hisoblang: 15 − 9 = ?",
        correctAnswer: "6",
        distractors: ["5", "7", "8"],
        explanation: "10 − 9 = 1, 1 + 5 = 6."
      },
      {
        text: "Misolni hisoblang: 16 − 8 = ?",
        correctAnswer: "8",
        distractors: ["7", "9", "6"],
        explanation: "10 − 8 = 2, 2 + 6 = 8."
      },
      {
        text: "Misolni hisoblang: 16 − 9 = ?",
        correctAnswer: "7",
        distractors: ["6", "8", "9"],
        explanation: "10 − 9 = 1, 1 + 6 = 7."
      },
      {
        text: "Misolni hisoblang: 17 − 8 = ?",
        correctAnswer: "9",
        distractors: ["8", "10", "7"],
        explanation: "10 − 8 = 2, 2 + 7 = 9."
      },
      {
        text: "Misolni hisoblang: 17 − 9 = ?",
        correctAnswer: "8",
        distractors: ["7", "9", "10"],
        explanation: "10 − 9 = 1, 1 + 7 = 8."
      },
      {
        text: "Misolni hisoblang: 18 − 9 = ?",
        correctAnswer: "9",
        distractors: ["8", "10", "7"],
        explanation: "10 − 9 = 1, 1 + 8 = 9."
      },
      {
        text: "12 − 8 da o‘nlikdan ayirish qoidasi qanday yoziladi?",
        correctAnswer: "2 + (10 − 8) = 4",
        distractors: ["(12 − 2) − 6", "12 − 10 + 8", "10 − 2 + 8"],
        explanation: "2 + (10 − 8) = 2 + 2 = 4."
      },
      {
        text: "Kutubxonada 15 ta kitobdan 9 tasi berildi. Nechta kitob qoldi?",
        correctAnswer: "6 ta kitob",
        distractors: ["5 ta", "7 ta", "8 ta"],
        explanation: "15 − 9 = 6 ta kitob."
      },
      {
        text: "IV bob yakuni: 11 dan 20 gacha sonlar va amallarni a’lo o‘rgangansiz! 57-dars qaysi bobga tegishli?",
        correctAnswer: "IV bob (11 dan 20 gacha sonlar)",
        distractors: ["I bob", "II bob", "V bob"],
        explanation: "57-dars IV bobning yakuniy darsidir."
      }
    ]
  }
];

export function runPart2Chapter4B() {
  console.log('--- 2-qism IV bob B qismi (50–57-darslar) yaratilmoqda ---');
  for (const l of lessons) {
    const seed = buildLessonSeed(l);
    saveLessonFile(2, l.bookNumber, seed);
    console.log(`  ✓ Dars ${l.bookNumber}: ${l.title} saqlandi.`);
  }
}

runPart2Chapter4B();
