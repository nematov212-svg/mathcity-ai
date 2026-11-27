import { LessonDataDef, buildLessonSeed, saveLessonFile } from './generatorTypes.js';

const lessons: LessonDataDef[] = [
  // 20. 1 dan 5 gacha bo‘lgan sonlar bilan amallar
  {
    bookNumber: 20,
    title: "1 dan 5 gacha bo‘lgan sonlar bilan amallar",
    emoji: "🧮",
    shortDesc: "5 ichida qo‘shish va ayirish amallari, ifodani rasm bilan bog‘lash va masalalar.",
    intro: "5 ichida sonlarni qo‘shish va ayirishni o‘rganib, mustahkam hisoblaymiz.",
    keyPoints: [
      "5 ichida qo‘shish: 1+4, 2+3, 3+2, 4+1.",
      "5 ichida ayirish: 5-1, 5-2, 5-3, 5-4, 5-5.",
      "Masala shartini tushunib, to‘g‘ri amalni (+ yoki −) tanlaymiz."
    ],
    miniExample: {
      emojis: "🍎🍎 + 🍎🍎🍎 = 5️⃣",
      text: "2 ta olma va 3 ta olma — jami 5 ta olma! (2 + 3 = 5)"
    },
    xpReward: 85,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Hisoblang: 3 + 2 = ?",
        correctAnswer: "5",
        distractors: ["4", "6", "1"],
        explanation: "3 + 2 = 5."
      },
      {
        text: "Hisoblang: 5 − 3 = ?",
        correctAnswer: "2",
        distractors: ["3", "1", "4"],
        explanation: "5 − 3 = 2."
      },
      {
        text: "Akmalda 4 ta daftar bor edi, 2 tasini ishlatdi. Nechta qoldi?",
        correctAnswer: "2 ta",
        distractors: ["1 ta", "3 ta", "6 ta"],
        explanation: "4 − 2 = 2 ta daftar."
      }
    ],
    test: [
      {
        text: "Misolni hisoblang: 1 + 3 = ?",
        correctAnswer: "4",
        distractors: ["3", "5", "2"],
        explanation: "1 + 3 = 4."
      },
      {
        text: "Misolni hisoblang: 2 + 3 = ?",
        correctAnswer: "5",
        distractors: ["4", "6", "3"],
        explanation: "2 + 3 = 5."
      },
      {
        text: "Misolni hisoblang: 3 + 1 = ?",
        correctAnswer: "4",
        distractors: ["2", "5", "6"],
        explanation: "3 + 1 = 4."
      },
      {
        text: "Misolni hisoblang: 4 + 1 = ?",
        correctAnswer: "5",
        distractors: ["3", "4", "6"],
        explanation: "4 + 1 = 5."
      },
      {
        text: "Misolni hisoblang: 5 − 2 = ?",
        correctAnswer: "3",
        distractors: ["2", "4", "1"],
        explanation: "5 − 2 = 3."
      },
      {
        text: "Misolni hisoblang: 5 − 4 = ?",
        correctAnswer: "1",
        distractors: ["2", "0", "3"],
        explanation: "5 − 4 = 1."
      },
      {
        text: "Misolni hisoblang: 4 − 2 = ?",
        correctAnswer: "2",
        distractors: ["1", "3", "4"],
        explanation: "4 − 2 = 2."
      },
      {
        text: "Misolni hisoblang: 3 − 2 = ?",
        correctAnswer: "1",
        distractors: ["2", "0", "3"],
        explanation: "3 − 2 = 1."
      },
      {
        text: "Misolni hisoblang: 2 − 1 = ?",
        correctAnswer: "1",
        distractors: ["0", "2", "3"],
        explanation: "2 − 1 = 1."
      },
      {
        text: "Misolni hisoblang: 5 − 1 = ?",
        correctAnswer: "4",
        distractors: ["3", "5", "2"],
        explanation: "5 − 1 = 4."
      },
      {
        text: "Tenglikni to‘ldiring: 2 + □ = 5. Katakdagi son nima?",
        correctAnswer: "3",
        distractors: ["2", "4", "1"],
        explanation: "5 − 2 = 3 bo‘lgani uchun katakda 3 bo‘ladi."
      },
      {
        text: "Tenglikni to‘ldiring: 4 − □ = 1. Katakdagi son nima?",
        correctAnswer: "3",
        distractors: ["2", "1", "5"],
        explanation: "4 − 3 = 1."
      },
      {
        text: "Tenglikni to‘ldiring: □ + 1 = 5. Katakdagi son nima?",
        correctAnswer: "4",
        distractors: ["3", "5", "2"],
        explanation: "5 − 1 = 4."
      },
      {
        text: "Qaysi ifodaning qiymati 3 ga teng?",
        correctAnswer: "5 − 2",
        distractors: ["4 − 2", "1 + 1", "5 − 1"],
        explanation: "5 − 2 = 3."
      },
      {
        text: "Qaysi ifodaning qiymati 5 ga teng?",
        correctAnswer: "3 + 2",
        distractors: ["2 + 2", "4 + 2", "5 − 2"],
        explanation: "3 + 2 = 5."
      },
      {
        text: "Stolda 3 ta piyola bor edi. Oydin yana 2 ta qo‘ydi. Piyolalar nechta bo‘ldi?",
        correctAnswer: "5 ta piyola",
        distractors: ["4 ta", "6 ta", "1 ta"],
        explanation: "3 + 2 = 5 ta piyola."
      },
      {
        text: "Daraxtda 5 ta qush bor edi. 3 tasi uchib ketdi. Nechta qush qoldi?",
        correctAnswer: "2 ta qush",
        distractors: ["3 ta", "1 ta", "4 ta"],
        explanation: "5 − 3 = 2 ta qush."
      },
      {
        text: "Sobir 1 ta kitob, singlisi esa 3 ta kitob o‘qidi. Ular birgalikda nechta kitob o‘qishdi?",
        correctAnswer: "4 ta kitob",
        distractors: ["3 ta", "5 ta", "2 ta"],
        explanation: "1 + 3 = 4 ta kitob."
      },
      {
        text: "Gulshanning 5 ta shari bor edi. 1 tasi yorildi. Nechta shar qoldi?",
        correctAnswer: "4 ta shar",
        distractors: ["3 ta", "5 ta", "2 ta"],
        explanation: "5 − 1 = 4 ta shar."
      },
      {
        text: "2 ta quyonchaga yana 2 ta quyoncha qo‘shildi. Jami quyonchalar nechta bo‘ldi?",
        correctAnswer: "4 ta quyoncha",
        distractors: ["3 ta", "5 ta", "2 ta"],
        explanation: "2 + 2 = 4 ta quyoncha."
      }
    ]
  },

  // 21. 6 soni va raqami
  {
    bookNumber: 21,
    title: "6 soni va raqami",
    emoji: "6️⃣",
    shortDesc: "6 raqami, sanash, tarkibi (1+5, 2+4, 3+3) va qo‘shnilari.",
    intro: "6 soni — oltita narsani bildiradi, uning tarkibi 1+5, 2+4 va 3+3 dir.",
    keyPoints: [
      "Hasharotlarning (chumoli, pashsha) 6 ta oyog‘i bo‘ladi.",
      "6 sonining tarkibi: 1+5=6, 2+4=6, 3+3=6.",
      "6 ning qo‘shnilari 5 va 7 sonlaridir."
    ],
    miniExample: {
      emojis: "🎲 6️⃣",
      text: "O‘yin zarcha toshida eng katta son — 6: 3 + 3 = 6!"
    },
    xpReward: 85,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Hisoblang: 3 + 3 = ?",
        correctAnswer: "6",
        distractors: ["5", "7", "8"],
        explanation: "3 + 3 = 6."
      },
      {
        text: "Hasharotlarda nechta oyoq bo‘ladi?",
        correctAnswer: "6 ta oyoq 🐜",
        distractors: ["4 ta", "8 ta", "2 ta"],
        explanation: "Barcha hasharotlar 6 ta oyoqqa ega."
      },
      {
        text: "6 sonining qo‘shnilarini toping:",
        correctAnswer: "5 va 7",
        distractors: ["4 va 8", "6 va 7", "3 va 5"],
        explanation: "6 ning oldida 5, keyin 7 keladi."
      }
    ],
    test: [
      {
        text: "Misolni hisoblang: 5 + 1 = ?",
        correctAnswer: "6",
        distractors: ["5", "7", "4"],
        explanation: "5 + 1 = 6."
      },
      {
        text: "Misolni hisoblang: 4 + 2 = ?",
        correctAnswer: "6",
        distractors: ["5", "7", "8"],
        explanation: "4 + 2 = 6."
      },
      {
        text: "Misolni hisoblang: 3 + 3 = ?",
        correctAnswer: "6",
        distractors: ["5", "7", "9"],
        explanation: "3 + 3 = 6."
      },
      {
        text: "Misolni hisoblang: 6 − 1 = ?",
        correctAnswer: "5",
        distractors: ["4", "6", "7"],
        explanation: "6 − 1 = 5."
      },
      {
        text: "Misolni hisoblang: 6 − 2 = ?",
        correctAnswer: "4",
        distractors: ["3", "5", "2"],
        explanation: "6 − 2 = 4."
      },
      {
        text: "Misolni hisoblang: 6 − 3 = ?",
        correctAnswer: "3",
        distractors: ["2", "4", "1"],
        explanation: "6 − 3 = 3."
      },
      {
        text: "Misolni hisoblang: 6 − 4 = ?",
        correctAnswer: "2",
        distractors: ["1", "3", "4"],
        explanation: "6 − 4 = 2."
      },
      {
        text: "Misolni hisoblang: 6 − 5 = ?",
        correctAnswer: "1",
        distractors: ["2", "0", "3"],
        explanation: "6 − 5 = 1."
      },
      {
        text: "Misolni hisoblang: 6 − 6 = ?",
        correctAnswer: "0",
        distractors: ["1", "6", "12"],
        explanation: "6 − 6 = 0."
      },
      {
        text: "6 soni juft sonmi yoki toq son?",
        correctAnswer: "Juft son",
        distractors: ["Toq son", "Nol son", "Tub son"],
        explanation: "6 soni 2 ga qoldiqsiz bo‘linadi, demak juft son."
      },
      {
        text: "Oltiburchakning nechta tomoni bor?",
        correctAnswer: "6 ta tomoni ⬡",
        distractors: ["5 ta", "7 ta", "8 ta"],
        explanation: "Oltiburchak 6 ta burchak va 6 ta tomonga ega."
      },
      {
        text: "6 sonining tarkibiga kirmaydigan juftlikni toping:",
        correctAnswer: "2 va 5 (chunki yig‘indisi 7)",
        distractors: ["1 va 5", "2 va 4", "3 va 3"],
        explanation: "2 + 5 = 7, bu 6 ning tarkibi emas."
      },
      {
        text: "6 sonining oldingi qo‘shnisi kim?",
        correctAnswer: "5",
        distractors: ["4", "7", "3"],
        explanation: "6 dan oldin 5 turadi."
      },
      {
        text: "6 sonining keyingi qo‘shnisi kim?",
        correctAnswer: "7",
        distractors: ["5", "8", "9"],
        explanation: "6 dan keyin 7 keladi."
      },
      {
        text: "Taqqoslang: 6 ... 5. Qaysi belgi to‘g‘ri?",
        correctAnswer: ">",
        distractors: ["<", "=", "+"],
        explanation: "6 soni 5 dan katta (6 > 5)."
      },
      {
        text: "Taqqoslang: 6 ... 7. Qaysi belgi to‘g‘ri?",
        correctAnswer: "<",
        distractors: [">", "=", "−"],
        explanation: "6 soni 7 dan kichik (6 < 7)."
      },
      {
        text: "Gulshanning 6 ta olmasi bor edi, 2 tasini ukasiga berdi. Nechta olma qoldi?",
        correctAnswer: "4 ta olma",
        distractors: ["3 ta", "5 ta", "2 ta"],
        explanation: "6 − 2 = 4 ta olma."
      },
      {
        text: "Daraxtda 4 ta chumchuq bor edi, yana 2 ta uchib keldi. Jami nechta bo‘ldi?",
        correctAnswer: "6 ta chumchuq",
        distractors: ["5 ta", "7 ta", "8 ta"],
        explanation: "4 + 2 = 6 ta chumchuq."
      },
      {
        text: "Zar toshida 🎲 eng katta ochko necha?",
        correctAnswer: "6",
        distractors: ["5", "7", "10"],
        explanation: "O‘yin kubigining yuzlarida 1 dan 6 gacha nuqtalar bor."
      },
      {
        text: "Katakda 6 ta doiracha chizildi. 3 tasi qizil, qolgani ko‘k. Ko‘k doirachalar nechta?",
        correctAnswer: "3 ta",
        distractors: ["2 ta", "4 ta", "1 ta"],
        explanation: "6 − 3 = 3 ta ko‘k doiracha."
      }
    ]
  },

  // 22. 7 soni va raqami
  {
    bookNumber: 22,
    title: "7 soni va raqami",
    emoji: "7️⃣",
    shortDesc: "7 raqami, sanash, tarkibi (1+6, 2+5, 3+4), hafta kunlari va qo‘shnilari.",
    intro: "7 soni — yettita narsani bildiradi, haftada 7 kun va kamalakda 7 rang bor.",
    keyPoints: [
      "Kamalak 7 xil rangdan iborat.",
      "7 sonining tarkibi: 1+6=7, 2+5=7, 3+4=7.",
      "7 ning qo‘shnilari 6 va 8 sonlaridir."
    ],
    miniExample: {
      emojis: "🌈 7️⃣",
      text: "Kamalakda 7 ta go‘zal rang bor: 3 + 4 = 7!"
    },
    xpReward: 85,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Hisoblang: 4 + 3 = ?",
        correctAnswer: "7",
        distractors: ["6", "8", "5"],
        explanation: "4 + 3 = 7."
      },
      {
        text: "Haftada nechta kun bor?",
        correctAnswer: "7 ta kun 📅",
        distractors: ["5 ta", "6 ta", "10 ta"],
        explanation: "Bir hafta 7 kundan iborat."
      },
      {
        text: "7 sonining qo‘shnilarini toping:",
        correctAnswer: "6 va 8",
        distractors: ["5 va 9", "7 va 8", "4 va 6"],
        explanation: "7 ning oldida 6, keyin 8 turadi."
      }
    ],
    test: [
      {
        text: "Misolni hisoblang: 6 + 1 = ?",
        correctAnswer: "7",
        distractors: ["6", "8", "5"],
        explanation: "6 + 1 = 7."
      },
      {
        text: "Misolni hisoblang: 5 + 2 = ?",
        correctAnswer: "7",
        distractors: ["6", "8", "9"],
        explanation: "5 + 2 = 7."
      },
      {
        text: "Misolni hisoblang: 4 + 3 = ?",
        correctAnswer: "7",
        distractors: ["6", "8", "5"],
        explanation: "4 + 3 = 7."
      },
      {
        text: "Misolni hisoblang: 7 − 1 = ?",
        correctAnswer: "6",
        distractors: ["5", "7", "8"],
        explanation: "7 − 1 = 6."
      },
      {
        text: "Misolni hisoblang: 7 − 2 = ?",
        correctAnswer: "5",
        distractors: ["4", "6", "3"],
        explanation: "7 − 2 = 5."
      },
      {
        text: "Misolni hisoblang: 7 − 3 = ?",
        correctAnswer: "4",
        distractors: ["3", "5", "2"],
        explanation: "7 − 3 = 4."
      },
      {
        text: "Misolni hisoblang: 7 − 4 = ?",
        correctAnswer: "3",
        distractors: ["2", "4", "5"],
        explanation: "7 − 4 = 3."
      },
      {
        text: "Misolni hisoblang: 7 − 5 = ?",
        correctAnswer: "2",
        distractors: ["1", "3", "4"],
        explanation: "7 − 5 = 2."
      },
      {
        text: "Misolni hisoblang: 7 − 6 = ?",
        correctAnswer: "1",
        distractors: ["2", "0", "3"],
        explanation: "7 − 6 = 1."
      },
      {
        text: "Misolni hisoblang: 7 − 7 = ?",
        correctAnswer: "0",
        distractors: ["1", "7", "14"],
        explanation: "7 − 7 = 0."
      },
      {
        text: "Kamalakda nechta rang jilolanadi?",
        correctAnswer: "7 ta rang 🌈",
        distractors: ["5 ta", "6 ta", "10 ta"],
        explanation: "Kamalakda 7 xil rang bo‘ladi."
      },
      {
        text: "7 soni toq sonmi yoki juft son?",
        correctAnswer: "Toq son",
        distractors: ["Juft son", "Ikkalasi ham", "Nol son"],
        explanation: "7 soni toq sondir."
      },
      {
        text: "7 sonining tarkibi qanday?",
        correctAnswer: "3 va 4 (yoki 2 va 5, 1 va 6)",
        distractors: ["3 va 5", "4 va 4", "2 va 4"],
        explanation: "3 + 4 = 7."
      },
      {
        text: "7 sonining oldingi qo‘shnisi kim?",
        correctAnswer: "6",
        distractors: ["5", "8", "4"],
        explanation: "7 dan oldin 6 turadi."
      },
      {
        text: "7 sonining keyingi qo‘shnisi kim?",
        correctAnswer: "8",
        distractors: ["6", "9", "10"],
        explanation: "7 dan keyin 8 keladi."
      },
      {
        text: "Taqqoslang: 7 ... 6. Qaysi belgi to‘g‘ri?",
        correctAnswer: ">",
        distractors: ["<", "=", "−"],
        explanation: "7 soni 6 dan katta (7 > 6)."
      },
      {
        text: "Taqqoslang: 7 ... 8. Qaysi belgi to‘g‘ri?",
        correctAnswer: "<",
        distractors: [">", "=", "+"],
        explanation: "7 soni 8 dan kichik (7 < 8)."
      },
      {
        text: "Anvarda 5 ta daftar bor edi, u yana 2 ta oldi. Daftarlari nechta bo‘ldi?",
        correctAnswer: "7 ta daftar",
        distractors: ["6 ta", "8 ta", "5 ta"],
        explanation: "5 + 2 = 7 ta daftar."
      },
      {
        text: "Bog‘dan 7 ta shaftoli uzildi. 3 tasi yeyildi. Nechta shaftoli qoldi?",
        correctAnswer: "4 ta shaftoli",
        distractors: ["3 ta", "5 ta", "2 ta"],
        explanation: "7 − 3 = 4 ta shaftoli."
      },
      {
        text: "Ertakda 'Yetti xazinaning biri' deyiladi. Xazinalar soni nechta?",
        correctAnswer: "7 ta",
        distractors: ["5 ta", "10 ta", "3 ta"],
        explanation: "Xalq maqollarida 7 xazina aytiladi."
      }
    ]
  },

  // 23. 8 soni va raqami
  {
    bookNumber: 23,
    title: "8 soni va raqami",
    emoji: "8️⃣",
    shortDesc: "8 raqami, sanash, tarkibi (1+7, 2+6, 3+5, 4+4), o‘rgimchak va qo‘shnilari.",
    intro: "8 soni — sakkizta narsani bildiradi, o‘rgimchakning 8 ta oyog‘i bor.",
    keyPoints: [
      "O‘rgimchak va sakkizoyoqning (osminog) 8 ta oyog‘i bo‘ladi.",
      "8 sonining tarkibi: 1+7, 2+6, 3+5, 4+4.",
      "8 ning qo‘shnilari 7 va 9 sonlaridir."
    ],
    miniExample: {
      emojis: "🕷️ 8️⃣",
      text: "O‘rgimchakning 8 ta oyog‘i bor: 4 + 4 = 8!"
    },
    xpReward: 85,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Hisoblang: 4 + 4 = ?",
        correctAnswer: "8",
        distractors: ["7", "9", "6"],
        explanation: "4 + 4 = 8."
      },
      {
        text: "O‘rgimchakning nechta oyog‘i bo‘ladi?",
        correctAnswer: "8 ta oyoq 🕷️",
        distractors: ["6 ta", "4 ta", "10 ta"],
        explanation: "O‘rgimchaklar 8 ta oyoqqa ega."
      },
      {
        text: "8 sonining qo‘shnilarini toping:",
        correctAnswer: "7 va 9",
        distractors: ["6 va 8", "8 va 9", "5 va 10"],
        explanation: "8 ning oldida 7, keyin 9 turadi."
      }
    ],
    test: [
      {
        text: "Misolni hisoblang: 7 + 1 = ?",
        correctAnswer: "8",
        distractors: ["7", "9", "6"],
        explanation: "7 + 1 = 8."
      },
      {
        text: "Misolni hisoblang: 6 + 2 = ?",
        correctAnswer: "8",
        distractors: ["7", "9", "10"],
        explanation: "6 + 2 = 8."
      },
      {
        text: "Misolni hisoblang: 5 + 3 = ?",
        correctAnswer: "8",
        distractors: ["7", "9", "6"],
        explanation: "5 + 3 = 8."
      },
      {
        text: "Misolni hisoblang: 4 + 4 = ?",
        correctAnswer: "8",
        distractors: ["6", "7", "9"],
        explanation: "4 + 4 = 8."
      },
      {
        text: "Misolni hisoblang: 8 − 1 = ?",
        correctAnswer: "7",
        distractors: ["6", "8", "9"],
        explanation: "8 − 1 = 7."
      },
      {
        text: "Misolni hisoblang: 8 − 2 = ?",
        correctAnswer: "6",
        distractors: ["5", "7", "4"],
        explanation: "8 − 2 = 6."
      },
      {
        text: "Misolni hisoblang: 8 − 3 = ?",
        correctAnswer: "5",
        distractors: ["4", "6", "7"],
        explanation: "8 − 3 = 5."
      },
      {
        text: "Misolni hisoblang: 8 − 4 = ?",
        correctAnswer: "4",
        distractors: ["3", "5", "2"],
        explanation: "8 − 4 = 4."
      },
      {
        text: "Misolni hisoblang: 8 − 5 = ?",
        correctAnswer: "3",
        distractors: ["2", "4", "1"],
        explanation: "8 − 5 = 3."
      },
      {
        text: "Misolni hisoblang: 8 − 6 = ?",
        correctAnswer: "2",
        distractors: ["1", "3", "0"],
        explanation: "8 − 6 = 2."
      },
      {
        text: "Misolni hisoblang: 8 − 7 = ?",
        correctAnswer: "1",
        distractors: ["2", "0", "3"],
        explanation: "8 − 7 = 1."
      },
      {
        text: "Misolni hisoblang: 8 − 8 = ?",
        correctAnswer: "0",
        distractors: ["1", "8", "16"],
        explanation: "8 − 8 = 0."
      },
      {
        text: "Dengizdagi sakkizoyoqning (osminog) nechta paypasi bor?",
        correctAnswer: "8 ta 🐙",
        distractors: ["6 ta", "10 ta", "4 ta"],
        explanation: "Sakkizoyoq nomi bilan 8 ta paypasga ega."
      },
      {
        text: "8 soni juft sonmi yoki toq son?",
        correctAnswer: "Juft son",
        distractors: ["Toq son", "Nol son", "Tub son"],
        explanation: "8 soni 2 ga bo‘linadigan juft sondir."
      },
      {
        text: "8 sonining tarkibi qaysi juftlikdan iborat?",
        correctAnswer: "4 va 4 (yoki 3 va 5, 2 va 6)",
        distractors: ["3 va 4", "5 va 4", "2 va 5"],
        explanation: "4 + 4 = 8."
      },
      {
        text: "8 sonining oldingi qo‘shnisi kim?",
        correctAnswer: "7",
        distractors: ["6", "9", "5"],
        explanation: "8 dan oldin 7 turadi."
      },
      {
        text: "8 sonining keyingi qo‘shnisi kim?",
        correctAnswer: "9",
        distractors: ["7", "10", "6"],
        explanation: "8 dan keyin 9 keladi."
      },
      {
        text: "Taqqoslang: 8 ... 7. Qaysi belgi to‘g‘ri?",
        correctAnswer: ">",
        distractors: ["<", "=", "+"],
        explanation: "8 soni 7 dan katta (8 > 7)."
      },
      {
        text: "Taqqoslang: 8 ... 9. Qaysi belgi to‘g‘ri?",
        correctAnswer: "<",
        distractors: [">", "=", "−"],
        explanation: "8 soni 9 dan kichik (8 < 9)."
      },
      {
        text: "Sardor 5 ta oq va 3 ta qora shaxmat donasini terdi. Donalar jami nechta bo‘ldi?",
        correctAnswer: "8 ta dona",
        distractors: ["7 ta", "9 ta", "6 ta"],
        explanation: "5 + 3 = 8 ta dona."
      }
    ]
  },

  // 24. 9 soni va raqami
  {
    bookNumber: 24,
    title: "9 soni va raqami",
    emoji: "9️⃣",
    shortDesc: "9 raqami, sanash, tarkibi (1+8, 2+7, 3+6, 4+5) va eng katta bir xonali son.",
    intro: "9 soni — to‘qqizta narsani bildiradi va eng katta bir xonali sondir.",
    keyPoints: [
      "9 — bir xonali sonlarning eng kattasi.",
      "9 sonining tarkibi: 1+8, 2+7, 3+6, 4+5.",
      "9 ning qo‘shnilari 8 va 10 sonlaridir."
    ],
    miniExample: {
      emojis: "🍎x9 = 9️⃣",
      text: "9 eng katta bir xonali son: 4 + 5 = 9!"
    },
    xpReward: 85,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Hisoblang: 5 + 4 = ?",
        correctAnswer: "9",
        distractors: ["8", "10", "7"],
        explanation: "5 + 4 = 9."
      },
      {
        text: "Eng katta bir xonali son qaysi?",
        correctAnswer: "9",
        distractors: ["8", "10", "1"],
        explanation: "9 — bitta raqam bilan yoziladigan eng katta son."
      },
      {
        text: "9 sonining qo‘shnilarini toping:",
        correctAnswer: "8 va 10",
        distractors: ["7 va 9", "9 va 10", "6 va 8"],
        explanation: "9 ning oldida 8, keyin 10 keladi."
      }
    ],
    test: [
      {
        text: "Misolni hisoblang: 8 + 1 = ?",
        correctAnswer: "9",
        distractors: ["8", "10", "7"],
        explanation: "8 + 1 = 9."
      },
      {
        text: "Misolni hisoblang: 7 + 2 = ?",
        correctAnswer: "9",
        distractors: ["8", "10", "6"],
        explanation: "7 + 2 = 9."
      },
      {
        text: "Misolni hisoblang: 6 + 3 = ?",
        correctAnswer: "9",
        distractors: ["8", "10", "7"],
        explanation: "6 + 3 = 9."
      },
      {
        text: "Misolni hisoblang: 5 + 4 = ?",
        correctAnswer: "9",
        distractors: ["8", "10", "6"],
        explanation: "5 + 4 = 9."
      },
      {
        text: "Misolni hisoblang: 9 − 1 = ?",
        correctAnswer: "8",
        distractors: ["7", "9", "10"],
        explanation: "9 − 1 = 8."
      },
      {
        text: "Misolni hisoblang: 9 − 2 = ?",
        correctAnswer: "7",
        distractors: ["6", "8", "5"],
        explanation: "9 − 2 = 7."
      },
      {
        text: "Misolni hisoblang: 9 − 3 = ?",
        correctAnswer: "6",
        distractors: ["5", "7", "4"],
        explanation: "9 − 3 = 6."
      },
      {
        text: "Misolni hisoblang: 9 − 4 = ?",
        correctAnswer: "5",
        distractors: ["4", "6", "3"],
        explanation: "9 − 4 = 5."
      },
      {
        text: "Misolni hisoblang: 9 − 5 = ?",
        correctAnswer: "4",
        distractors: ["3", "5", "6"],
        explanation: "9 − 5 = 4."
      },
      {
        text: "Misolni hisoblang: 9 − 6 = ?",
        correctAnswer: "3",
        distractors: ["2", "4", "1"],
        explanation: "9 − 6 = 3."
      },
      {
        text: "Misolni hisoblang: 9 − 7 = ?",
        correctAnswer: "2",
        distractors: ["1", "3", "4"],
        explanation: "9 − 7 = 2."
      },
      {
        text: "Misolni hisoblang: 9 − 8 = ?",
        correctAnswer: "1",
        distractors: ["0", "2", "3"],
        explanation: "9 − 8 = 1."
      },
      {
        text: "Misolni hisoblang: 9 − 9 = ?",
        correctAnswer: "0",
        distractors: ["1", "9", "18"],
        explanation: "9 − 9 = 0."
      },
      {
        text: "Bir xonali sonlarning eng kattasi qaysi?",
        correctAnswer: "9",
        distractors: ["8", "10", "7"],
        explanation: "9 bir xonali eng katta son."
      },
      {
        text: "9 soni toq sonmi yoki juft son?",
        correctAnswer: "Toq son",
        distractors: ["Juft son", "Ikkalasi ham", "Nol son"],
        explanation: "9 soni toq sondir."
      },
      {
        text: "9 sonining tarkibi qanday bo‘lishi mumkin?",
        correctAnswer: "4 va 5 (yoki 3 va 6, 2 va 7)",
        distractors: ["4 va 4", "5 va 5", "3 va 5"],
        explanation: "4 + 5 = 9."
      },
      {
        text: "9 sonining oldingi qo‘shnisi kim?",
        correctAnswer: "8",
        distractors: ["7", "10", "6"],
        explanation: "9 dan oldin 8 keladi."
      },
      {
        text: "9 sonining keyingi qo‘shnisi kim?",
        correctAnswer: "10",
        distractors: ["8", "11", "7"],
        explanation: "9 dan keyin 10 keladi."
      },
      {
        text: "Taqqoslang: 9 ... 8. Qaysi belgi to‘g‘ri?",
        correctAnswer: ">",
        distractors: ["<", "=", "+"],
        explanation: "9 soni 8 dan katta (9 > 8)."
      },
      {
        text: "Madinaning 9 ta olxo‘risi bor edi. 4 tasini dugonasiga berdi. Nechta olxo‘ri qoldi?",
        correctAnswer: "5 ta olxo‘ri",
        distractors: ["4 ta", "6 ta", "3 ta"],
        explanation: "9 − 4 = 5 ta olxo‘ri."
      }
    ]
  },

  // 25. 0 soni va raqami
  {
    bookNumber: 25,
    title: "0 soni va raqami",
    emoji: "0️⃣",
    shortDesc: "0 raqami (hech narsa yo‘q), a + 0, a − 0, a − a va 0 ni taqqoslash.",
    intro: "0 soni (nol) — narsalar yo‘qligini, bo‘sh qolgan joyni bildiradi.",
    keyPoints: [
      "0 raqami bitta ham narsa yo‘qligini ko‘rsatadi.",
      "Har qanday songa 0 qo‘shilsa yoki ayirilsa, o‘sha son o‘zgarmaydi: a + 0 = a, a − 0 = a.",
      "Songa o‘zini ayirsak, natija 0 bo‘ladi: a − a = 0."
    ],
    miniExample: {
      emojis: "🍎 - 🍎 = 0️⃣",
      text: "Bitta olma yeyildi, likopcha bo‘sh qoldi: 1 − 1 = 0!"
    },
    xpReward: 85,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Misolni hisoblang: 5 + 0 = ?",
        correctAnswer: "5",
        distractors: ["0", "6", "50"],
        explanation: "5 ga 0 qo‘shilsa 5 bo‘lib qoladi."
      },
      {
        text: "Misolni hisoblang: 4 − 0 = ?",
        correctAnswer: "4",
        distractors: ["0", "3", "5"],
        explanation: "4 dan 0 ayirilsa 4 qoladi."
      },
      {
        text: "Misolni hisoblang: 3 − 3 = ?",
        correctAnswer: "0",
        distractors: ["3", "1", "6"],
        explanation: "Sonning o‘zidan o‘zi ayirilsa 0 qoladi."
      }
    ],
    test: [
      {
        text: "Quyidagilardan qaysi biri 0 sonining ma’nosini to‘g‘ri tushuntiradi?",
        correctAnswer: "Bitta ham narsa yo‘q (bo‘sh tovoq)",
        distractors: ["Juda ko‘p narsa bor", "Bitta narsa bor", "Ikkita narsa bor"],
        explanation: "0 — bu narsa yo‘qligini bildiruvchi son."
      },
      {
        text: "Misolni hisoblang: 0 + 0 = ?",
        correctAnswer: "0",
        distractors: ["1", "10", "00"],
        explanation: "0 + 0 = 0."
      },
      {
        text: "Misolni hisoblang: 1 + 0 = ?",
        correctAnswer: "1",
        distractors: ["0", "2", "10"],
        explanation: "1 + 0 = 1."
      },
      {
        text: "Misolni hisoblang: 7 + 0 = ?",
        correctAnswer: "7",
        distractors: ["0", "8", "70"],
        explanation: "7 + 0 = 7."
      },
      {
        text: "Misolni hisoblang: 9 − 0 = ?",
        correctAnswer: "9",
        distractors: ["0", "8", "10"],
        explanation: "9 − 0 = 9."
      },
      {
        text: "Misolni hisoblang: 6 − 0 = ?",
        correctAnswer: "6",
        distractors: ["0", "5", "7"],
        explanation: "6 − 0 = 6."
      },
      {
        text: "Misolni hisoblang: 5 − 5 = ?",
        correctAnswer: "0",
        distractors: ["5", "1", "10"],
        explanation: "5 − 5 = 0."
      },
      {
        text: "Misolni hisoblang: 8 − 8 = ?",
        correctAnswer: "0",
        distractors: ["8", "1", "16"],
        explanation: "8 − 8 = 0."
      },
      {
        text: "Misolni hisoblang: 2 − 2 = ?",
        correctAnswer: "0",
        distractors: ["2", "1", "4"],
        explanation: "2 − 2 = 0."
      },
      {
        text: "0 soni 1 sonidan kattami yoki kichik?",
        correctAnswer: "Kichik (0 < 1)",
        distractors: ["Katta (0 > 1)", "Teng", "Bir xil"],
        explanation: "0 soni 1 dan kichikdir."
      },
      {
        text: "0 natural son hisoblanadimi?",
        correctAnswer: "Yo‘q, 0 natural son emas",
        distractors: ["Ha, natural son", "Faqat maktabda natural", "Barcha sonlar natural"],
        explanation: "Natural sonlar sanoqda ishlatiladi (1 dan boshlanadi), 0 natural son emas."
      },
      {
        text: "Taqqoslang: 0 ... 5. Qaysi belgi to‘g‘ri?",
        correctAnswer: "<",
        distractors: [">", "=", "+"],
        explanation: "0 soni 5 dan kichik (0 < 5)."
      },
      {
        text: "Taqqoslang: 4 ... 0. Qaysi belgi to‘g‘ri?",
        correctAnswer: ">",
        distractors: ["<", "=", "−"],
        explanation: "4 soni 0 dan katta (4 > 0)."
      },
      {
        text: "Likopchada 3 ta nok bor edi. 3 tasini ham yeyishdi. Likopchada nechta nok qoldi?",
        correctAnswer: "0 ta nok (hech qancha qolmadi)",
        distractors: ["1 ta nok", "3 ta nok", "2 ta nok"],
        explanation: "3 − 3 = 0 ta nok."
      },
      {
        text: "Shoxda 2 ta qush o‘tirgan edi, ikkalasi ham uchib ketdi. Shoxda nechta qush qoldi?",
        correctAnswer: "0 ta qush",
        distractors: ["1 ta", "2 ta", "3 ta"],
        explanation: "2 − 2 = 0 ta qush."
      },
      {
        text: "To‘g‘ri tenglikni toping:",
        correctAnswer: "7 − 0 = 7",
        distractors: ["7 − 0 = 0", "7 + 0 = 0", "7 − 7 = 7"],
        explanation: "7 − 0 = 7 to‘g‘ri tenglikdir."
      },
      {
        text: "0 soni sonlar o‘qida 1 dan qaysi tomonda turadi?",
        correctAnswer: "Chap tomonda",
        distractors: ["O‘ng tomonda", "Tepasida", "Orqasida"],
        explanation: "0 soni 1 ning chap tomonida joylashadi."
      },
      {
        text: "Akmal cho‘ntagidagi 5 ta yong‘oqni o‘rtoqlariga tarqatdi, o‘zida hech narsa qolmadi. Unda nechta yong‘oq qoldi?",
        correctAnswer: "0 ta yong‘oq",
        distractors: ["5 ta", "1 ta", "2 ta"],
        explanation: "5 − 5 = 0 ta yong‘oq."
      },
      {
        text: "Quyidagi ifodalardan qaysi birining qiymati 0 ga teng?",
        correctAnswer: "4 − 4",
        distractors: ["4 + 0", "4 − 0", "4 − 1"],
        explanation: "4 − 4 = 0."
      },
      {
        text: "Savat bo‘sh bo‘lsa, unda nechta olma bor deymiz?",
        correctAnswer: "0 ta olma",
        distractors: ["1 ta olma", "10 ta olma", "Ko‘p olma"],
        explanation: "Bo‘sh savatda 0 ta narsa bo‘ladi."
      }
    ]
  },

  // 26. 10 soni
  {
    bookNumber: 26,
    title: "10 soni",
    emoji: "🔟",
    shortDesc: "10 soni, tarkibi (1+9...5+5), 10 gacha to‘ldirish va birinchi ikki xonali son.",
    intro: "10 soni — bir o‘nlikni bildiradi va u birinchi ikki xonali sondir.",
    keyPoints: [
      "Ikkala qo‘limizda jami 10 ta barmoq bor.",
      "10 sonining tarkibi: 1+9, 2+8, 3+7, 4+6, 5+5.",
      "10 soni 1 va 0 raqamlari yordamida yoziladi."
    ],
    miniExample: {
      emojis: "✋ ✋ = 🔟",
      text: "Ikkala qo‘lda 5 + 5 = 10 ta barmoq bor!"
    },
    xpReward: 85,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Hisoblang: 5 + 5 = ?",
        correctAnswer: "10",
        distractors: ["9", "11", "8"],
        explanation: "5 + 5 = 10."
      },
      {
        text: "Ikkala qo‘lda jami nechta barmoq bor?",
        correctAnswer: "10 ta 👐",
        distractors: ["5 ta", "8 ta", "12 ta"],
        explanation: "5 + 5 = 10 ta barmoq."
      },
      {
        text: "10 dan oldingi son qaysi?",
        correctAnswer: "9",
        distractors: ["8", "11", "7"],
        explanation: "10 dan oldin 9 turadi."
      }
    ],
    test: [
      {
        text: "Misolni hisoblang: 9 + 1 = ?",
        correctAnswer: "10",
        distractors: ["9", "11", "8"],
        explanation: "9 + 1 = 10."
      },
      {
        text: "Misolni hisoblang: 8 + 2 = ?",
        correctAnswer: "10",
        distractors: ["9", "11", "7"],
        explanation: "8 + 2 = 10."
      },
      {
        text: "Misolni hisoblang: 7 + 3 = ?",
        correctAnswer: "10",
        distractors: ["9", "11", "8"],
        explanation: "7 + 3 = 10."
      },
      {
        text: "Misolni hisoblang: 6 + 4 = ?",
        correctAnswer: "10",
        distractors: ["9", "11", "8"],
        explanation: "6 + 4 = 10."
      },
      {
        text: "Misolni hisoblang: 5 + 5 = ?",
        correctAnswer: "10",
        distractors: ["9", "11", "12"],
        explanation: "5 + 5 = 10."
      },
      {
        text: "Misolni hisoblang: 10 − 1 = ?",
        correctAnswer: "9",
        distractors: ["8", "10", "7"],
        explanation: "10 − 1 = 9."
      },
      {
        text: "Misolni hisoblang: 10 − 2 = ?",
        correctAnswer: "8",
        distractors: ["7", "9", "6"],
        explanation: "10 − 2 = 8."
      },
      {
        text: "Misolni hisoblang: 10 − 3 = ?",
        correctAnswer: "7",
        distractors: ["6", "8", "5"],
        explanation: "10 − 3 = 7."
      },
      {
        text: "Misolni hisoblang: 10 − 4 = ?",
        correctAnswer: "6",
        distractors: ["5", "7", "8"],
        explanation: "10 − 4 = 6."
      },
      {
        text: "Misolni hisoblang: 10 − 5 = ?",
        correctAnswer: "5",
        distractors: ["4", "6", "7"],
        explanation: "10 − 5 = 5."
      },
      {
        text: "Misolni hisoblang: 10 − 6 = ?",
        correctAnswer: "4",
        distractors: ["3", "5", "6"],
        explanation: "10 − 6 = 4."
      },
      {
        text: "Misolni hisoblang: 10 − 7 = ?",
        correctAnswer: "3",
        distractors: ["2", "4", "5"],
        explanation: "10 − 7 = 3."
      },
      {
        text: "Misolni hisoblang: 10 − 8 = ?",
        correctAnswer: "2",
        distractors: ["1", "3", "4"],
        explanation: "10 − 8 = 2."
      },
      {
        text: "Misolni hisoblang: 10 − 9 = ?",
        correctAnswer: "1",
        distractors: ["0", "2", "3"],
        explanation: "10 − 9 = 1."
      },
      {
        text: "Misolni hisoblang: 10 − 10 = ?",
        correctAnswer: "0",
        distractors: ["1", "10", "20"],
        explanation: "10 − 10 = 0."
      },
      {
        text: "10 soni bir xonali sonmi yoki ikki xonali son?",
        correctAnswer: "Ikki xonali son (eng kichik ikki xonali son)",
        distractors: ["Bir xonali son", "Uch xonali son", "Nol xonali"],
        explanation: "10 soni 1 va 0 raqamlaridan iborat ikki xonali sondir."
      },
      {
        text: "7 sonini 10 gacha to‘ldirish uchun unga necha qo‘shish kerak?",
        correctAnswer: "3",
        distractors: ["2", "4", "1"],
        explanation: "10 − 7 = 3."
      },
      {
        text: "8 sonini 10 gacha to‘ldirish uchun unga necha qo‘shish kerak?",
        correctAnswer: "2",
        distractors: ["1", "3", "4"],
        explanation: "10 − 8 = 2."
      },
      {
        text: "6 sonini 10 gacha to‘ldirish uchun unga necha qo‘shish kerak?",
        correctAnswer: "4",
        distractors: ["3", "5", "2"],
        explanation: "10 − 6 = 4."
      },
      {
        text: "Toshkent ko‘chasida 10 ta daraxt ko‘chatlari ekildi. 8 tasi chinor, qolgani archa. Archalar nechta?",
        correctAnswer: "2 ta archa",
        distractors: ["3 ta", "1 ta", "4 ta"],
        explanation: "10 − 8 = 2 ta archa."
      }
    ]
  },

  // 27. 1 dan 10 gacha bo‘lgan sonlar. Sonlarni taqqoslash
  {
    bookNumber: 27,
    title: "1 dan 10 gacha bo‘lgan sonlar. Sonlarni taqqoslash",
    emoji: "📊",
    shortDesc: "Sonlarni o‘sish va kamayish tartibida joylashtirish, eng katta va eng kichik son.",
    intro: "1 dan 10 gacha bo‘lgan barcha sonlarni o‘zaro taqqoslaymiz va tartiblaymiz.",
    keyPoints: [
      "1 < 2 < 3 < 4 < 5 < 6 < 7 < 8 < 9 < 10.",
      "10 dan boshlab kamayish tartibi: 10, 9, 8, 7, 6, 5, 4, 3, 2, 1.",
      "Eng kichik bir xonali natural son 1, eng kattasi 9, 10 esa ikki xonali."
    ],
    miniExample: {
      emojis: "1️⃣ < 🔟",
      text: "1 eng kichik natural son, 10 esa eng kattasi!"
    },
    xpReward: 85,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "1 dan 10 gacha sonlar ichida eng kattasi qaysi?",
        correctAnswer: "10",
        distractors: ["9", "8", "7"],
        explanation: "10 ushbu qatorda eng kattadir."
      },
      {
        text: "Taqqoslang: 9 ... 10. Qaysi belgi to‘g‘ri?",
        correctAnswer: "<",
        distractors: [">", "=", "+"],
        explanation: "9 soni 10 dan kichik (9 < 10)."
      },
      {
        text: "Sonlarni o‘sish tartibida joylashtiring: 7, 3, 5",
        correctAnswer: "3, 5, 7",
        distractors: ["7, 5, 3", "5, 3, 7", "3, 7, 5"],
        explanation: "Kichigidan kattasiga: 3, 5, 7."
      }
    ],
    test: [
      {
        text: "Taqqoslang: 10 ... 7. Qaysi belgi to‘g‘ri?",
        correctAnswer: ">",
        distractors: ["<", "=", "+"],
        explanation: "10 soni 7 dan katta (10 > 7)."
      },
      {
        text: "Taqqoslang: 6 ... 9. Qaysi belgi to‘g‘ri?",
        correctAnswer: "<",
        distractors: [">", "=", "−"],
        explanation: "6 soni 9 dan kichik (6 < 9)."
      },
      {
        text: "Taqqoslang: 8 ... 8. Qaysi belgi to‘g‘ri?",
        correctAnswer: "=",
        distractors: [">", "<", "+"],
        explanation: "8 va 8 teng (8 = 8)."
      },
      {
        text: "Taqqoslang: 10 ... 10. Qaysi belgi to‘g‘ri?",
        correctAnswer: "=",
        distractors: [">", "<", "−"],
        explanation: "10 va 10 teng (10 = 10)."
      },
      {
        text: "Taqqoslang: 5 ... 8. Qaysi belgi to‘g‘ri?",
        correctAnswer: "<",
        distractors: [">", "=", "+"],
        explanation: "5 soni 8 dan kichik (5 < 8)."
      },
      {
        text: "Taqqoslang: 9 ... 4. Qaysi belgi to‘g‘ri?",
        correctAnswer: ">",
        distractors: ["<", "=", "−"],
        explanation: "9 soni 4 dan katta (9 > 4)."
      },
      {
        text: "Taqqoslang: 3 ... 7. Qaysi belgi to‘g‘ri?",
        correctAnswer: "<",
        distractors: [">", "=", "+"],
        explanation: "3 soni 7 dan kichik (3 < 7)."
      },
      {
        text: "Taqqoslang: 10 ... 1. Qaysi belgi to‘g‘ri?",
        correctAnswer: ">",
        distractors: ["<", "=", "−"],
        explanation: "10 soni 1 dan katta (10 > 1)."
      },
      {
        text: "Sonlarni o‘sish tartibida joylashtiring: 4, 1, 9",
        correctAnswer: "1, 4, 9",
        distractors: ["9, 4, 1", "4, 1, 9", "1, 9, 4"],
        explanation: "Kichigidan kattasiga: 1, 4, 9."
      },
      {
        text: "Sonlarni kamayish tartibida joylashtiring: 2, 8, 5",
        correctAnswer: "8, 5, 2",
        distractors: ["2, 5, 8", "5, 8, 2", "8, 2, 5"],
        explanation: "Kattasidan kichigiga: 8, 5, 2."
      },
      {
        text: "Quyidagi sonlardan qaysi biri 6 dan katta, lekin 8 dan kichik?",
        correctAnswer: "7",
        distractors: ["5", "9", "8"],
        explanation: "6 va 8 orasidagi son 7 dir."
      },
      {
        text: "Quyidagi sonlardan qaysi biri 8 dan katta, lekin 10 dan kichik?",
        correctAnswer: "9",
        distractors: ["7", "11", "8"],
        explanation: "8 va 10 orasidagi son 9 dir."
      },
      {
        text: "2, 5, 7, 10 sonlari ichida eng kichigi qaysi?",
        correctAnswer: "2",
        distractors: ["5", "7", "10"],
        explanation: "Ushbu to‘rttalikda 2 eng kichigidir."
      },
      {
        text: "3, 6, 9, 4 sonlari ichida eng kattasi qaysi?",
        correctAnswer: "9",
        distractors: ["6", "3", "4"],
        explanation: "Ushbu to‘rttalikda 9 eng kattasidir."
      },
      {
        text: "Quyidagi taqqoslashlardan qaysi biri to‘g‘ri?",
        correctAnswer: "6 > 4",
        distractors: ["3 > 7", "2 > 5", "1 > 8"],
        explanation: "6 soni 4 dan katta."
      },
      {
        text: "Qaysi taqqoslash to‘g‘ri yozilgan?",
        correctAnswer: "5 < 9",
        distractors: ["8 < 3", "7 < 2", "10 < 6"],
        explanation: "5 soni 9 dan kichik."
      },
      {
        text: "Ali 8 yoshda, ukasi Vali 6 yoshda. Kim katta?",
        correctAnswer: "Ali katta (8 > 6)",
        distractors: ["Vali katta", "Ikkalasi teng", "Vali Alidan katta"],
        explanation: "8 soni 6 dan katta bo‘lgani uchun Ali katta."
      },
      {
        text: "Birinchi sinfda 10 ta o‘g‘il va 9 ta qiz o‘qiydi. O‘g‘il bolalar ko‘pmi yoki qizlar?",
        correctAnswer: "O‘g‘il bolalar ko‘p (10 > 9)",
        distractors: ["Qizlar ko‘p", "Ikkalasi teng", "O‘g‘il bolalar kam"],
        explanation: "10 > 9 bo‘lgani uchun o‘g‘il bolalar ko‘p."
      },
      {
        text: "Toshkentdan Samarqandgacha poyezd 2 soatda, avtobus esa 5 soatda yetib boradi. Qaysi biri tezroq?",
        correctAnswer: "Poyezd tezroq (2 soat < 5 soat)",
        distractors: ["Avtobus tezroq", "Ikkalasi bir xil", "Avtobus 2 soatda"],
        explanation: "Kamroq vaqt sarflagan transport tezroq hisoblanadi (2 < 5)."
      },
      {
        text: "Nodirada 7 ta, Zahrada 10 ta kitob bor. Zahrada nechta ko‘p kitob bor?",
        correctAnswer: "3 ta ko‘p kitob (10 − 7 = 3)",
        distractors: ["2 ta", "4 ta", "1 ta"],
        explanation: "10 − 7 = 3 ta ko‘p kitob."
      }
    ]
  },

  // 28. Natural sonlar
  {
    bookNumber: 28,
    title: "Natural sonlar",
    emoji: "🌱",
    shortDesc: "Natural son tushunchasi, 0 natural son emasligi, bir va ikki xonali sonlar.",
    intro: "Sanoqda ishlatiladigan 1, 2, 3, 4, ... sonlari natural sonlar deyiladi. 0 natural son emas!",
    keyPoints: [
      "Natural sonlar narsalarni sanashda ishlatiladi: 1, 2, 3, 4, 5...",
      "0 soni sanoqda aytilmaydi, shuning uchun 0 natural son emas.",
      "1 dan 9 gacha bo‘lgan natural sonlar bir xonali, 10 esa ikki xonali son."
    ],
    miniExample: {
      emojis: "1️⃣ 2️⃣ 3️⃣ ... 🔟",
      text: "Natural sonlar 1 dan boshlanadi, 0 natural son emas!"
    },
    xpReward: 85,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Quyidagilardan qaysi biri eng kichik natural son?",
        correctAnswer: "1",
        distractors: ["0", "2", "3"],
        explanation: "Eng kichik natural son 1 dir. 0 natural son emas."
      },
      {
        text: "0 soni natural sonmi?",
        correctAnswer: "Yo‘q, 0 natural son emas",
        distractors: ["Ha, natural son", "Faqat qishda natural", "Barcha sonlar natural"],
        explanation: "Sanoqda 0 soni ishlatilmaydi, shuning uchun u natural son emas."
      },
      {
        text: "10 soni bir xonali sonmi yoki ikki xonali?",
        correctAnswer: "Ikki xonali son",
        distractors: ["Bir xonali son", "Uch xonali son", "Natural emas"],
        explanation: "10 soni ikkita raqamdan iborat bo‘lib, ikki xonali sondir."
      }
    ],
    test: [
      {
        text: "Natural sonlar qaysi maqsadda ishlatiladi?",
        correctAnswer: "Narsalarni sanash uchun",
        distractors: ["Faqat chizish uchun", "Ranglarni bo‘yash uchun", "Hech narsa uchun emas"],
        explanation: "Narsalarni sanashda ishlatiladigan sonlar natural sonlar deyiladi."
      },
      {
        text: "Quyidagilardan qaysi biri natural son emas?",
        correctAnswer: "0 (nol)",
        distractors: ["1", "5", "10"],
        explanation: "0 natural son emas."
      },
      {
        text: "Eng kichik natural son qaysi?",
        correctAnswer: "1",
        distractors: ["0", "2", "10"],
        explanation: "Natural sonlar qatori 1 dan boshlanadi."
      },
      {
        text: "Natural sonlar qatorida 1 dan keyin qaysi son keladi?",
        correctAnswer: "2",
        distractors: ["0", "3", "4"],
        explanation: "1 dan keyin 2 keladi."
      },
      {
        text: "1 dan 9 gacha bo‘lgan sonlar qanday sonlar deyiladi?",
        correctAnswer: "Bir xonali natural sonlar",
        distractors: ["Ikki xonali sonlar", "Uch xonali sonlar", "Manfiy sonlar"],
        explanation: "Ular bitta raqam bilan yozilgani uchun bir xonali sonlar deyiladi."
      },
      {
        text: "Eng katta bir xonali natural son qaysi?",
        correctAnswer: "9",
        distractors: ["8", "10", "7"],
        explanation: "9 — eng katta bir xonali sondir."
      },
      {
        text: "Eng kichik ikki xonali natural son qaysi?",
        correctAnswer: "10",
        distractors: ["9", "11", "20"],
        explanation: "10 — birinchi va eng kichik ikki xonali sondir."
      },
      {
        text: "Narsalarni sanashda qaysi sondan boshlaymiz?",
        correctAnswer: "1 dan: bir, ikki, uch...",
        distractors: ["0 dan: nol, bir, ikki...", "5 dan", "10 dan"],
        explanation: "Sanoq 1 dan boshlanadi."
      },
      {
        text: "Quyidagi sonlardan qaysi biri natural sonlar guruhiga kiradi?",
        correctAnswer: "7",
        distractors: ["0", "Yarim", "Chorak"],
        explanation: "7 — butun natural sondir."
      },
      {
        text: "Bir xonali natural sonlar nechta?",
        correctAnswer: "9 ta (1, 2, 3, 4, 5, 6, 7, 8, 9)",
        distractors: ["10 ta", "8 ta", "5 ta"],
        explanation: "1 dan 9 gacha jami 9 ta bir xonali son bor."
      },
      {
        text: "Natural sonlar qatorida oxirgi (eng katta) son bormi?",
        correctAnswer: "Yo‘q, natural sonlar cheksiz davom etadi",
        distractors: ["Ha, 10 soni oxirgi", "Ha, 100 soni oxirgi", "Ha, 9 soni"],
        explanation: "Har qanday songa yana 1 qo‘shib yangi son hosil qilish mumkin, ular cheksizdir."
      },
      {
        text: "4 sonidan keyingi natural son qaysi?",
        correctAnswer: "5",
        distractors: ["3", "6", "7"],
        explanation: "4 dan keyin 5 keladi."
      },
      {
        text: "6 sonidan oldingi natural son qaysi?",
        correctAnswer: "5",
        distractors: ["7", "4", "3"],
        explanation: "6 dan oldin 5 turadi."
      },
      {
        text: "0 natural son emasligining asosiy sababi nima?",
        correctAnswer: "Narsalarni sanashda 'nolta kitob' deb sanalmaydi",
        distractors: ["U chiroyli emasligi uchun", "U doira shaklida bo‘lgani uchun", "Sababi yo‘q"],
        explanation: "Sanoq paytida narsalar 1 dan boshlab sanaladi."
      },
      {
        text: "Qaysi qatorda faqat natural sonlar yozilgan?",
        correctAnswer: "1, 2, 3, 4, 5",
        distractors: ["0, 1, 2, 3, 4", "0, 2, 4, 6", "−1, 0, 1, 2"],
        explanation: "0 qatnashmagan 1, 2, 3, 4, 5 qatori toza natural sonlardir."
      },
      {
        text: "10 sonida nechta o‘nlik bor?",
        correctAnswer: "1 ta o‘nlik",
        distractors: ["2 ta o‘nlik", "0 ta o‘nlik", "10 ta o‘nlik"],
        explanation: "10 soni 1 ta o‘nlikni bildiradi."
      },
      {
        text: "Natural sonlar qatorida 8 dan keyin qaysi son keladi?",
        correctAnswer: "9",
        distractors: ["7", "10", "6"],
        explanation: "8 dan keyingi son 9 dir."
      },
      {
        text: "Daftarga 3 ta yulduzcha chizildi. Chizilgan yulduzchalar soni natural sonmi?",
        correctAnswer: "Ha, 3 — natural son",
        distractors: ["Yo‘q, natural emas", "Faqat 10 natural", "Yulduzcha son emas"],
        explanation: "3 — natural son."
      },
      {
        text: "Agar xonada hech kim bo‘lmasa, odamlar soni 0 bo‘ladi. Bu son natural son hisoblanadimi?",
        correctAnswer: "Yo‘q, 0 natural son emas",
        distractors: ["Ha, albatta", "Faqat bo‘sh xonada natural", "Bilmayman"],
        explanation: "0 narsa yo‘qligini bildiradi va natural son emas."
      },
      {
        text: "Aziz 1 dan 10 gacha bo‘lgan barcha natural sonlarni daftarga yozdi. U nechta son yozdi?",
        correctAnswer: "10 ta son",
        distractors: ["9 ta", "11 ta", "8 ta"],
        explanation: "1 dan 10 gacha roppa-rosa 10 ta natural son bor."
      }
    ]
  },

  // 29. Juft va toq sonlar
  {
    bookNumber: 29,
    title: "Juft va toq sonlar",
    emoji: "🏠",
    shortDesc: "Juft (0, 2, 4, 6, 8, 10) va toq (1, 3, 5, 7, 9) sonlar, ortiqchasini topish.",
    intro: "Sonlar ikkiga teng bo‘linishiga qarab juft va toq sonlarga ajratiladi.",
    keyPoints: [
      "Juft sonlar: 0, 2, 4, 6, 8, 10 — ularni ikkita teng guruhga bo‘lish mumkin.",
      "Toq sonlar: 1, 3, 5, 7, 9 — ularni ikkiga bo‘lganda 1 ta ortib qoladi.",
      "Juft va toq sonlar sonlar qatorida navbat bilan almashib keladi."
    ],
    miniExample: {
      emojis: "👥 2️⃣ 4️⃣ 6️⃣",
      text: "Juft sonlar juft-juft bo‘ladi: 2, 4, 6, 8, 10!"
    },
    xpReward: 85,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Quyidagilardan qaysi biri juft son?",
        correctAnswer: "4",
        distractors: ["3", "5", "7"],
        explanation: "4 soni ikkiga teng bo‘linadi (2 + 2), demak juft son."
      },
      {
        text: "Quyidagilardan qaysi biri toq son?",
        correctAnswer: "5",
        distractors: ["2", "4", "6"],
        explanation: "5 soni toq son hisoblanadi."
      },
      {
        text: "Quyidagi qatorda qaysi son ortiqcha: 2, 4, 6, 7, 8?",
        correctAnswer: "7 (chunki u toq son)",
        distractors: ["2", "4", "8"],
        explanation: "Qolgan barcha sonlar juft, 7 esa toq son."
      }
    ],
    test: [
      {
        text: "Quyidagi sonlardan qaysi biri juft son?",
        correctAnswer: "6",
        distractors: ["3", "5", "7"],
        explanation: "6 juft sondir (3 + 3 = 6)."
      },
      {
        text: "Quyidagi sonlardan qaysi biri toq son?",
        correctAnswer: "7",
        distractors: ["2", "4", "8"],
        explanation: "7 toq sondir."
      },
      {
        text: "1 dan 10 gacha bo‘lgan juft sonlar to‘g‘ri ko‘rsatilgan qatorni toping:",
        correctAnswer: "2, 4, 6, 8, 10",
        distractors: ["1, 3, 5, 7, 9", "1, 2, 3, 4, 5", "2, 3, 4, 5, 6"],
        explanation: "2, 4, 6, 8, 10 — juft sonlardir."
      },
      {
        text: "1 dan 10 gacha bo‘lgan toq sonlar to‘g‘ri ko‘rsatilgan qatorni toping:",
        correctAnswer: "1, 3, 5, 7, 9",
        distractors: ["2, 4, 6, 8, 10", "1, 2, 3, 4, 5", "3, 5, 7, 8, 9"],
        explanation: "1, 3, 5, 7, 9 — toq sonlardir."
      },
      {
        text: "2 soni qanday son?",
        correctAnswer: "Juft son",
        distractors: ["Toq son", "Nol son", "Manfiy son"],
        explanation: "2 — juft son."
      },
      {
        text: "3 soni qanday son?",
        correctAnswer: "Toq son",
        distractors: ["Juft son", "Ikkalasi ham", "Manfiy son"],
        explanation: "3 — toq son."
      },
      {
        text: "8 soni qanday son?",
        correctAnswer: "Juft son",
        distractors: ["Toq son", "Nol son", "Toq ham juft ham"],
        explanation: "8 — juft son."
      },
      {
        text: "9 soni qanday son?",
        correctAnswer: "Toq son",
        distractors: ["Juft son", "Nol son", "Ikkalasi ham"],
        explanation: "9 — toq son."
      },
      {
        text: "10 soni qanday son?",
        correctAnswer: "Juft son (0 bilan tugaydi)",
        distractors: ["Toq son", "Nol son", "Faqat bir xonali"],
        explanation: "10 soni 0 bilan tugagani uchun juft son."
      },
      {
        text: "Quyidagi qatorda qaysi son ortiqcha: 1, 3, 5, 6, 7?",
        correctAnswer: "6 (chunki u juft son)",
        distractors: ["1", "3", "7"],
        explanation: "Qolgan barcha sonlar toq, 6 esa juft sondir."
      },
      {
        text: "Quyidagi qatorda qaysi son ortiqcha: 2, 4, 5, 8, 10?",
        correctAnswer: "5 (chunki u toq son)",
        distractors: ["2", "4", "10"],
        explanation: "5 toq son, qolganlari juft."
      },
      {
        text: "2 ta poyabzal 👟👟 kiygan odamda poyabzallar soni juftmi yoki toq?",
        correctAnswer: "Juft son (2 dona)",
        distractors: ["Toq son", "Nol son", "Bilmayman"],
        explanation: "2 soni juft sondir."
      },
      {
        text: "4 ta do‘st ikki-ikkita bo‘lib juftlashdi. Ortiqcha bola qoldimi?",
        correctAnswer: "Qolmadi, 4 juft son",
        distractors: ["1 ta ortib qoldi", "2 ta ortib qoldi", "Juftlashib bo‘lmaydi"],
        explanation: "4 soni ikkiga qoldiqsiz bo‘linadi (2 juftlik)."
      },
      {
        text: "5 ta konfetni 2 bolaga teng bo‘lib bersa nima bo‘ladi?",
        correctAnswer: "2 tadan tegadi va 1 ta ortib qoladi (chunki 5 toq son)",
        distractors: ["Teng bo‘linadi va ortib qolmaydi", "3 tadan tegadi", "Bo‘lib bo‘lmaydi"],
        explanation: "5 toq son bo‘lgani uchun 1 ta ortib qoladi (2 + 2 + 1)."
      },
      {
        text: "Toq songa 1 qo‘shilsa qanday son hosil bo‘ladi (masalan, 3 + 1 = 4)?",
        correctAnswer: "Juft son hosil bo‘ladi",
        distractors: ["Toq son hosil bo‘ladi", "Nol hosil bo‘ladi", "O‘zgarmaydi"],
        explanation: "Toq sondan keyin doim juft son keladi."
      },
      {
        text: "Juft songa 1 qo‘shilsa qanday son hosil bo‘ladi (masalan, 4 + 1 = 5)?",
        correctAnswer: "Toq son hosil bo‘ladi",
        distractors: ["Juft son hosil bo‘ladi", "Nol hosil bo‘ladi", "O‘zgarmaydi"],
        explanation: "Juft sondan keyin doim toq son keladi."
      },
      {
        text: "O‘zbekiston avtomobil yo‘llarida 2 ta mashina yonma-yon ketyapti. Mashinalar soni qanday?",
        correctAnswer: "Juft son",
        distractors: ["Toq son", "Nol son", "Uchburchak"],
        explanation: "2 soni juft sondir."
      },
      {
        text: "Guldastada 7 ta atirgul bor. Gullar soni juftmi yoki toq?",
        correctAnswer: "Toq son",
        distractors: ["Juft son", "Ikkalasi ham", "Nol"],
        explanation: "7 soni toq sondir."
      },
      {
        text: "Qaysi juftlikdagi ikkala son ham juft son hisoblanadi?",
        correctAnswer: "4 va 8",
        distractors: ["3 va 6", "5 va 7", "1 va 4"],
        explanation: "4 ham, 8 ham juft sonlardir."
      },
      {
        text: "Qaysi juftlikdagi ikkala son ham toq son hisoblanadi?",
        correctAnswer: "5 va 9",
        distractors: ["2 va 7", "4 va 6", "8 va 10"],
        explanation: "5 ham, 9 ham toq sonlardir."
      }
    ]
  }
];

export function runPart1Chapter2B() {
  console.log('--- 1-qism II bob B qismi (20–29-darslar) yaratilmoqda ---');
  for (const l of lessons) {
    const seed = buildLessonSeed(l);
    saveLessonFile(1, l.bookNumber, seed);
    console.log(`  ✓ Dars ${l.bookNumber}: ${l.title} saqlandi.`);
  }
}

runPart1Chapter2B();
