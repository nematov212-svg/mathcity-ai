import { LessonDef, buildLessonSeed, saveLessonFile } from './generatorTypes';

console.log("Generating Part 4 Chapter 3 lessons (129-136)...");

export const lesson129: LessonDef = {
  bookNumber: 129,
  title: "Tenglik va tengsizliklar",
  emoji: "⚖️",
  shortDesc: "Sonli tenglik va tengsizliklar, =, ≠, >, < belgilari",
  intro: "Matematikada ikki ifoda yoki son o'rtasiga tenglik (=) yoki tengsizlik (>, <, ≠) belgilari qo'yiladi. Agar ikkala tomon qiymati bir xil bo'lsa — bu tenglik, har xil bo'lsa — tengsizlikdir.",
  keyPoints: [
    "= belgisi tenglikni bildiradi: masalan, 6 + 4 = 10.",
    "≠ belgisi teng emaslikni bildiradi: masalan, 5 + 2 ≠ 8.",
    "> belgisi katta, < belgisi kichik ekanligini ko'rsatadi: 9 > 7 va 3 < 8.",
    "Tengsizlikda belgi doim katta son tomonga ochiladi (ochiq og'iz katta songa qaraydi)."
  ],
  miniExample: {
    emojis: "⚖️ 7 + 3 = 10 | 12 > 8",
    text: "7 ga 3 ni qo'shsak 10 bo'ladi, demak 7 + 3 = 10 (tenglik). 12 soni 8 dan katta, demak 12 > 8 (tengsizlik)."
  },
  xpReward: 95,
  coinReward: 10,
  estMinutes: 8,
  practice: [
    {
      text: "8 + 4 ... 12 ifodaga qaysi belgi mos keladi?",
      correctAnswer: "=",
      distractors: [">", "<", "≠"],
      explanation: "8 + 4 = 12 bo'lgani uchun tenglik (=) belgisi qo'yiladi."
    },
    {
      text: "15 ... 9 ifodaga qaysi belgi to'g'ri keladi?",
      correctAnswer: ">",
      distractors: ["<", "=", "+"],
      explanation: "15 soni 9 dan katta, shuning uchun > belgisi qo'yiladi: 15 > 9."
    },
    {
      text: "Quyidagilardan qaysi biri to'g'ri tenglik?",
      correctAnswer: "14 - 4 = 10",
      distractors: ["10 + 5 = 16", "8 + 3 = 12", "20 - 5 = 14"],
      explanation: "14 dan 4 ni ayirsak aynan 10 qoladi, demak 14 - 4 = 10 to'g'ri tenglik."
    }
  ],
  test: [
    {
      text: "7 + 5 ... 12 yozuviga qaysi belgi qo'yiladi?",
      correctAnswer: "=",
      distractors: [">", "<", "≠"],
      explanation: "7 + 5 = 12, shuning uchun tenglik belgisi (=) mos."
    },
    {
      text: "20 ... 18 ifodaga qaysi belgi to'g'ri?",
      correctAnswer: ">",
      distractors: ["<", "=", "+"],
      explanation: "20 soni 18 dan katta: 20 > 18."
    },
    {
      text: "9 ... 14 ifodaga qaysi belgi qo'yilishi kerak?",
      correctAnswer: "<",
      distractors: [">", "=", "-"],
      explanation: "9 soni 14 dan kichik: 9 < 14."
    },
    {
      text: "10 + 6 ... 16 yozuviga mos belgini tanlang:",
      correctAnswer: "=",
      distractors: [">", "<", "≠"],
      explanation: "10 + 6 = 16, ikkala tomon teng."
    },
    {
      text: "30 - 10 ... 15 ifodada qaysi belgi to'g'ri?",
      correctAnswer: ">",
      distractors: ["<", "=", "-"],
      explanation: "30 - 10 = 20, 20 esa 15 dan katta (20 > 15)."
    },
    {
      text: "12 + 3 ... 20 ifodada qaysi belgi mos?",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "12 + 3 = 15, 15 soni 20 dan kichik (15 < 20)."
    },
    {
      text: "Quyidagi ifodalardan qaysi biri tenglik hisoblanadi?",
      correctAnswer: "18 - 8 = 10",
      distractors: ["18 > 10", "15 < 25", "12 ≠ 14"],
      explanation: "Tenglik belgisi (=) bo'lgan ifoda tenglik deyiladi: 18 - 8 = 10."
    },
    {
      text: "Quyidagilardan qaysi biri tengsizlik hisoblanadi?",
      correctAnswer: "25 > 19",
      distractors: ["10 + 5 = 15", "40 - 20 = 20", "7 + 7 = 14"],
      explanation: "> belgisi qatnashgan 25 > 19 ifodasi tengsizlikdir."
    },
    {
      text: "8 + 8 ... 17 ifodaga qaysi belgi mos keladi?",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "8 + 8 = 16, 16 soni 17 dan kichik (16 < 17)."
    },
    {
      text: "25 - 5 ... 20 ifodaga qaysi belgi qo'yiladi?",
      correctAnswer: "=",
      distractors: [">", "<", "≠"],
      explanation: "25 - 5 = 20, demak 25 - 5 = 20 to'g'ri tenglik."
    },
    {
      text: "40 ... 50 - 5 ifodasiga qaysi belgi mos?",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "50 - 5 = 45, 40 soni 45 dan kichik (40 < 45)."
    },
    {
      text: "16 + 4 ... 30 - 10 ifodalarini taqqoslang:",
      correctAnswer: "=",
      distractors: [">", "<", "≠"],
      explanation: "16 + 4 = 20 va 30 - 10 = 20. Ikkalasi teng: 20 = 20."
    },
    {
      text: "50 + 8 ... 60 ifodada qaysi belgi to'g'ri?",
      correctAnswer: "<",
      distractors: [">", "=", "-"],
      explanation: "50 + 8 = 58, 58 soni 60 dan kichik (58 < 60)."
    },
    {
      text: "70 - 20 ... 45 ifodada qaysi belgi mos?",
      correctAnswer: ">",
      distractors: ["<", "=", "+"],
      explanation: "70 - 20 = 50, 50 esa 45 dan katta (50 > 45)."
    },
    {
      text: "Bir savatda 14 ta olma, ikkinchisida 10 + 4 ta olma bor. Olmalar soni qanday?",
      correctAnswer: "Teng (14 = 14)",
      distractors: ["Birinchisida ko'p", "Ikkinchisida ko'p", "Taqqoslab bo'lmaydi"],
      explanation: "10 + 4 = 14, har ikkala savatda ham 14 tadan olma bor."
    },
    {
      text: "Akramda 35 ta, Sardorda 40 ta daftar bor. Ularni taqqoslang:",
      correctAnswer: "35 < 40 (Sardorda ko'p)",
      distractors: ["35 > 40", "35 = 40", "Sardorda kam"],
      explanation: "35 soni 40 dan kichik, Sardorning daftari ko'proq."
    },
    {
      text: "Qaysi tenglik TO'G'RI?",
      correctAnswer: "13 + 7 = 20",
      distractors: ["13 + 7 = 21", "13 + 7 = 19", "13 - 7 = 20"],
      explanation: "13 + 7 = 20 to'g'ri arifmetik tenglik."
    },
    {
      text: "Qaysi tengsizlik TO'G'RI?",
      correctAnswer: "48 > 42",
      distractors: ["48 < 42", "48 = 42", "42 > 48"],
      explanation: "48 soni 42 dan katta bo'lgani uchun 48 > 42 to'g'ri."
    },
    {
      text: "19 ≠ 20 yozuvi nimani bildiradi?",
      correctAnswer: "19 soni 20 ga teng emasligini",
      distractors: ["19 soni 20 ga tengligini", "19 katta ekanligini", "19 nolga tengligini"],
      explanation: "≠ belgisi teng emaslikni (not equal) bildiradi."
    },
    {
      text: "Tenglik va tengsizlik haqidagi to'g'ri xulosani toping:",
      correctAnswer: "= belgisi bo'lsa tenglik, > yoki < bo'lsa tengsizlik bo'ladi",
      distractors: [
        "Hamma amallar faqat tenglik bo'ladi",
        "> belgisi doim kichik sonni bildiradi",
        "Tengsizlikda sonlar doim bir xil bo'ladi"
      ],
      explanation: "Tenglikda = belgisi, tengsizlikda esa > yoki < belgilari ishlatiladi."
    }
  ]
};

export const lesson130: LessonDef = {
  bookNumber: 130,
  title: "Sonli va harfiy ifodalar",
  emoji: "🔤",
  shortDesc: "Sonli ifodalar va harflar qatnashgan harfiy ifodalar",
  intro: "Matematikada ifodalar ikki xil bo'ladi: sonli ifodalar va harfiy ifodalar. Sonli ifodalarda faqat sonlar va amallar qatnashadi (masalan, 7 + 5). Harfiy ifodalarda esa sonlar bilan birga lotin harflari ham qatnashadi (masalan, a + 5, x - 3).",
  keyPoints: [
    "Sonli ifoda — faqat sonlar va amallardan tuzilgan ifoda: 12 + 8, 45 - 5.",
    "Harfiy ifoda — tarkibida harf qatnashgan ifoda: x + 7, a - 4, b + c.",
    "Harflar o'rniga turli sonlarni qo'yish mumkin.",
    "Boshlang'ich sinflarda ko'pincha a, b, c, x, y kabi kichik lotin harflari ishlatiladi."
  ],
  miniExample: {
    emojis: "🔢 15 + 5 | 🔤 a + 5",
    text: "15 + 5 — bu sonli ifoda. a + 5 — bu harfiy ifoda, bu yerda a harfi istalgan son bo'lishi mumkin."
  },
  xpReward: 95,
  coinReward: 10,
  estMinutes: 8,
  practice: [
    {
      text: "8 + 6 ifodasi qanday ifoda?",
      correctAnswer: "Sonli ifoda",
      distractors: ["Harfiy ifoda", "Geometrik ifoda", "Matnli ifoda"],
      explanation: "Unda faqat sonlar (8 va 6) qatnashgani uchun bu sonli ifoda."
    },
    {
      text: "a + 10 ifodasi qanday ifoda?",
      correctAnswer: "Harfiy ifoda",
      distractors: ["Sonli ifoda", "Shaklli ifoda", "Oddiy tenglama"],
      explanation: "Tarkibida 'a' harfi borligi uchun bu harfiy ifoda deyiladi."
    },
    {
      text: "Quyidagilardan qaysi biri harfiy ifoda?",
      correctAnswer: "x - 5",
      distractors: ["20 - 5", "14 + 6", "10 + 10"],
      explanation: "x - 5 ifodasida noma'lum 'x' harfi qatnashgan."
    }
  ],
  test: [
    {
      text: "Sonli ifodada nimalar qatnashadi?",
      correctAnswer: "Faqat sonlar va amal belgilari",
      distractors: ["Faqat harflar", "Harflar va so'zlar", "Geometrik shakllar"],
      explanation: "Sonli ifoda sonlar va amal belgilaridan (+, -) tuziladi."
    },
    {
      text: "Harfiy ifodada nima albatta qatnashadi?",
      correctAnswer: "Kamida bitta harf",
      distractors: ["Faqat kasr", "Faqat doira", "Hech narsa"],
      explanation: "Harfiy ifoda bo'lishi uchun unda kamida bitta harf qatnashishi shart."
    },
    {
      text: "Quyidagilardan qaysi biri sonli ifoda?",
      correctAnswer: "25 + 15",
      distractors: ["a + 15", "x - 4", "b + c"],
      explanation: "25 + 15 ifodasida harf yo'q, faqat sonlar bor."
    },
    {
      text: "Quyidagilardan qaysi biri harfiy ifoda?",
      correctAnswer: "b + 12",
      distractors: ["18 - 8", "30 + 20", "50 - 15"],
      explanation: "b + 12 ifodasida 'b' harfi bor."
    },
    {
      text: "y - 7 ifodasida 'y' nima hisoblanadi?",
      correctAnswer: "Noma'lum sonni bildiruvchi harf",
      distractors: ["Amal belgisi", "Tenglik belgisi", "Nuqta"],
      explanation: "Lotin harfi 'y' noma'lum sonni ifodalaydi."
    },
    {
      text: "14 + 9 sonli ifodasining qiymati nechaga teng?",
      correctAnswer: "23",
      distractors: ["22", "24", "21"],
      explanation: "14 + 9 = 23."
    },
    {
      text: "30 - 12 sonli ifodasining qiymati nechaga teng?",
      correctAnswer: "18",
      distractors: ["16", "20", "22"],
      explanation: "30 - 12 = 18."
    },
    {
      text: "a + 4 ifodasida a = 6 bo'lsa, qiymat necha bo'ladi?",
      correctAnswer: "10",
      distractors: ["8", "12", "14"],
      explanation: "a o'rniga 6 qo'yamiz: 6 + 4 = 10."
    },
    {
      text: "x - 3 ifodasida x = 15 bo'lsa, qiymat qancha bo'ladi?",
      correctAnswer: "12",
      distractors: ["10", "14", "18"],
      explanation: "x o'rniga 15 qo'yamiz: 15 - 3 = 12."
    },
    {
      text: "c + 20 ifodasida c = 30 bo'lsa, ifodaning qiymati:",
      correctAnswer: "50",
      distractors: ["40", "60", "70"],
      explanation: "30 + 20 = 50."
    },
    {
      text: "Qaysi ifoda harfiy ifodalar qatoriga kiradi?",
      correctAnswer: "m + n",
      distractors: ["10 + 20", "40 - 10", "15 + 5"],
      explanation: "m + n ikkita harfdan tuzilgan harfiy ifodadir."
    },
    {
      text: "Qaysi ifoda sonli ifodalar qatoriga kiradi?",
      correctAnswer: "100 - 40",
      distractors: ["100 - x", "a + b", "y + 40"],
      explanation: "100 - 40 faqat sonlardan iborat sonli ifoda."
    },
    {
      text: "Daftar narxi a so'm, qalam narxi 500 so'm. Jami narx qanday ifodalanadi?",
      correctAnswer: "a + 500",
      distractors: ["a - 500", "500 - a", "a = 500"],
      explanation: "Jami narxni topish uchun narxlar qo'shiladi: a + 500."
    },
    {
      text: "Bog'da x ta olma daraxti va 10 ta nok daraxti bor. Daraxtlar jami nechta?",
      correctAnswer: "x + 10",
      distractors: ["x - 10", "10 - x", "10x"],
      explanation: "Jami daraxtlar soni: x + 10."
    },
    {
      text: "Savatda 20 ta tuxum bor edi. y tasi ishlatildi. Nechta tuxum qoldi?",
      correctAnswer: "20 - y",
      distractors: ["20 + y", "y - 20", "20y"],
      explanation: "Qolgan tuxumlar ayirma bilan ifodalanadi: 20 - y."
    },
    {
      text: "Sonli ifoda bilan harfiy ifodaning asosiy farqi nimada?",
      correctAnswer: "Harfiy ifodada harf (o'zgaruvchi) qatnashadi",
      distractors: [
        "Sonli ifodada amal bo'lmaydi",
        "Harfiy ifoda faqat geometriyada bo'ladi",
        "Hech qanday farqi yo'q"
      ],
      explanation: "Harfiy ifoda harf qatnashishi bilan sonli ifodadan farqlanadi."
    },
    {
      text: "k + 8 ifodasida k ning o'rniga qanday sonlarni qo'yish mumkin?",
      correctAnswer: "Istalgan mos sonlarni (masalan, 1, 2, 5...)",
      distractors: ["Faqat 0 sonini", "Faqat manfiy sonlarni", "Hech qanday sonni"],
      explanation: "O'zgaruvchi k harfi o'rniga turli sonlarni qo'yib hisoblash mumkin."
    },
    {
      text: "Agar b = 7 bo'lsa, 20 - b ifodaning qiymati necha bo'ladi?",
      correctAnswer: "13",
      distractors: ["11", "15", "14"],
      explanation: "20 - 7 = 13."
    },
    {
      text: "Agar a = 8, b = 5 bo'lsa, a + b ifodaning qiymatini toping:",
      correctAnswer: "13",
      distractors: ["12", "14", "15"],
      explanation: "8 + 5 = 13."
    },
    {
      text: "Harfiy ifodalar matematikada nima uchun kerak?",
      correctAnswer: "Umumiy qoidalarni va noma'lumlarni ifodalash uchun",
      distractors: [
        "Faqat so'z yozish uchun",
        "Raqamlarni chalg'itish uchun",
        "Daftarni to'ldirish uchun"
      ],
      explanation: "Harfiy ifodalar qonuniyatlarni, formulalarni va masalalarni umumiy yozishda qo'llaniladi."
    }
  ]
};

export const lesson131: LessonDef = {
  bookNumber: 131,
  title: "Ifoda",
  emoji: "✍️",
  shortDesc: "Yig'indi, ayirma va qavsli ifodalarni tuzish hamda hisoblash",
  intro: "Sonlar va amallarni birlashtirib turli ifodalar tuzamiz. Qo'shish amali qatnashgan ifoda — yig'indi, ayirish amali qatnashgani — ayirma deyiladi. Qavslar esa amallarning bajarilish tartibini belgilaydi.",
  keyPoints: [
    "Yig'indi: masalan, 9 va 4 ning yig'indisi 9 + 4 = 13.",
    "Ayirma: masalan, 15 va 7 ning ayirmasi 15 - 7 = 8.",
    "Qavsli ifodalarda birinchi navbatda qavs ichidagi amal bajariladi.",
    "Masalan, 20 - (5 + 3) ifodasida avval 5 + 3 = 8, so'ngra 20 - 8 = 12 hisoblanadi."
  ],
  miniExample: {
    emojis: "🔢 20 - (6 + 4) = 10",
    text: "Qavs ichidagi amal birinchi: 6 + 4 = 10. Keyin ayiramiz: 20 - 10 = 10!"
  },
  xpReward: 95,
  coinReward: 10,
  estMinutes: 8,
  practice: [
    {
      text: "12 va 8 ning yig'indisini toping:",
      correctAnswer: "20",
      distractors: ["18", "22", "4"],
      explanation: "12 + 8 = 20."
    },
    {
      text: "16 va 9 ning ayirmasi nechaga teng?",
      correctAnswer: "7",
      distractors: ["5", "8", "9"],
      explanation: "16 - 9 = 7."
    },
    {
      text: "15 - (3 + 2) ifodasining qiymatini hisoblang:",
      correctAnswer: "10",
      distractors: ["14", "12", "8"],
      explanation: "Avval qavs ichi: 3 + 2 = 5. So'ngra: 15 - 5 = 10."
    }
  ],
  test: [
    {
      text: "8 va 7 ning yig'indisini hisoblang:",
      correctAnswer: "15",
      distractors: ["14", "16", "1"],
      explanation: "8 + 7 = 15."
    },
    {
      text: "18 va 6 ning ayirmasi nechaga teng?",
      correctAnswer: "12",
      distractors: ["10", "14", "24"],
      explanation: "18 - 6 = 12."
    },
    {
      text: "Qavsli ifodalarda qaysi amal birinchi bajariladi?",
      correctAnswer: "Qavs ichidagi amal",
      distractors: ["Eng oxirgi amal", "Xohlagan amal", "Faqat ayirish"],
      explanation: "Matematika qoidasiga ko'ra, qavs ichidagi amal har doim birinchi bajariladi."
    },
    {
      text: "14 - (4 + 6) ifodasining qiymati nechaga teng?",
      correctAnswer: "4",
      distractors: ["16", "10", "6"],
      explanation: "Qavs ichi: 4 + 6 = 10. Keyin: 14 - 10 = 4."
    },
    {
      text: "20 + (10 - 5) ifodasining qiymatini toping:",
      correctAnswer: "25",
      distractors: ["15", "30", "20"],
      explanation: "Qavs ichi: 10 - 5 = 5. Keyin: 20 + 5 = 25."
    },
    {
      text: "30 - (15 - 5) ifodasining qiymati nechaga teng?",
      correctAnswer: "20",
      distractors: ["10", "25", "35"],
      explanation: "Qavs ichi: 15 - 5 = 10. Keyin: 30 - 10 = 20."
    },
    {
      text: "50 - (20 + 10) ifodasining natijasi qanday?",
      correctAnswer: "20",
      distractors: ["30", "40", "10"],
      explanation: "Qavs ichi: 20 + 10 = 30. Keyin: 50 - 30 = 20."
    },
    {
      text: "(12 + 8) - 10 ifodasining qiymati nechaga teng?",
      correctAnswer: "10",
      distractors: ["20", "30", "5"],
      explanation: "Qavs ichi: 12 + 8 = 20. Keyin: 20 - 10 = 10."
    },
    {
      text: "(45 - 5) + 8 ifodasining natijasini toping:",
      correctAnswer: "48",
      distractors: ["40", "50", "42"],
      explanation: "Qavs ichi: 45 - 5 = 40. Keyin: 40 + 8 = 48."
    },
    {
      text: "'25 sonidan 5 va 3 ning yig'indisini ayirish' qanday yoziladi?",
      correctAnswer: "25 - (5 + 3)",
      distractors: ["(25 - 5) + 3", "25 + (5 - 3)", "25 - 5 - 3"],
      explanation: "5 va 3 ning yig'indisi (5 + 3) bo'lib, u 25 dan ayiriladi: 25 - (5 + 3)."
    },
    {
      text: "25 - (5 + 3) ifodasining qiymati nechaga teng?",
      correctAnswer: "17",
      distractors: ["23", "15", "18"],
      explanation: "5 + 3 = 8, so'ngra 25 - 8 = 17."
    },
    {
      text: "'10 ga 8 va 2 ning ayirmasini qo'shish' qanday yoziladi?",
      correctAnswer: "10 + (8 - 2)",
      distractors: ["(10 + 8) - 2", "10 - (8 + 2)", "10 + 8 + 2"],
      explanation: "8 va 2 ning ayirmasi (8 - 2) bo'lib, u 10 ga qo'shiladi: 10 + (8 - 2)."
    },
    {
      text: "10 + (8 - 2) ifodasining natijasini toping:",
      correctAnswer: "16",
      distractors: ["20", "14", "18"],
      explanation: "8 - 2 = 6, 10 + 6 = 16."
    },
    {
      text: "60 - (30 - 10) ifodasining natijasi qanday?",
      correctAnswer: "40",
      distractors: ["20", "30", "50"],
      explanation: "30 - 10 = 20, 60 - 20 = 40."
    },
    {
      text: "(15 - 7) + (6 + 4) ifodasining qiymatini hisoblang:",
      correctAnswer: "18",
      distractors: ["16", "20", "14"],
      explanation: "Birinchi qavs: 15 - 7 = 8. Ikkinchi qavs: 6 + 4 = 10. Jami: 8 + 10 = 18."
    },
    {
      text: "Qaysi ifoda '17 va 3 ning yig'indisidan 10 ni ayirish' ma'nosini bildiradi?",
      correctAnswer: "(17 + 3) - 10",
      distractors: ["17 + (3 - 10)", "17 - (3 + 10)", "(17 - 3) + 10"],
      explanation: "(17 + 3) yig'indisidan 10 ayriladi: (17 + 3) - 10."
    },
    {
      text: "(17 + 3) - 10 ifodasining qiymati nechaga teng?",
      correctAnswer: "10",
      distractors: ["20", "5", "12"],
      explanation: "17 + 3 = 20, 20 - 10 = 10."
    },
    {
      text: "40 - (15 + 5) ifodasining natijasi:",
      correctAnswer: "20",
      distractors: ["30", "25", "10"],
      explanation: "15 + 5 = 20, 40 - 20 = 20."
    },
    {
      text: "Ifodada qavs bo'lmasa va faqat qo'shish-ayirish bo'lsa, amallar qanday tartibda bajariladi?",
      correctAnswer: "Chapdan o'ngga qarab ketma-ket",
      distractors: ["O'ngdan chapga qarab", "Faqat ayirish avval", "Ixtiyoriy tartibda"],
      explanation: "Qavssiz bir bosqichli amallar chapdan o'ngga qarab ketma-ket bajariladi."
    },
    {
      text: "15 - 5 + 4 ifodasini hisoblang (qavssiz):",
      correctAnswer: "14",
      distractors: ["6", "16", "10"],
      explanation: "Chapdan o'ngga: 15 - 5 = 10, so'ngra 10 + 4 = 14."
    }
  ]
};

export const lesson132: LessonDef = {
  bookNumber: 132,
  title: "Ifodalarning qiymatlarini taqqoslash",
  emoji: "🔍",
  shortDesc: "Ikki ifodaning natijasini hisoblab, >, < yoki = belgilari bilan taqqoslash",
  intro: "Ikki ifodani taqqoslash uchun avval har bir ifodaning sonli qiymatini alohida hisoblab olamiz. So'ngra chiqqan natijalarni o'zaro taqqoslab, >, < yoki = belgisini qo'yamiz.",
  keyPoints: [
    "1-qadam: Chap tomondagi ifodaning qiymatini hisoblang.",
    "2-qadam: O'ng tomondagi ifodaning qiymatini hisoblang.",
    "3-qadam: Natijalarni taqqoslab, >, < yoki = belgisini qo'ying.",
    "Masalan: 8 + 4 ... 7 + 5 -> 12 ... 12 -> demak 8 + 4 = 7 + 5."
  ],
  miniExample: {
    emojis: "🔍 (9 + 5) ... (8 + 7)",
    text: "9 + 5 = 14, 8 + 7 = 15. 14 soni 15 dan kichik, demak 9 + 5 < 8 + 7!"
  },
  xpReward: 95,
  coinReward: 10,
  estMinutes: 8,
  practice: [
    {
      text: "7 + 6 ... 8 + 5 ifodalarini taqqoslang:",
      correctAnswer: "=",
      distractors: [">", "<", "≠"],
      explanation: "7 + 6 = 13 va 8 + 5 = 13. Ikkalasi teng: 13 = 13."
    },
    {
      text: "15 - 5 ... 12 - 4 ifodalariga qaysi belgi mos?",
      correctAnswer: ">",
      distractors: ["<", "=", "+"],
      explanation: "15 - 5 = 10 va 12 - 4 = 8. 10 > 8 bo'lgani uchun > belgisi mos."
    },
    {
      text: "20 - 8 ... 10 + 5 ifodalarini taqqoslang:",
      correctAnswer: "<",
      distractors: [">", "=", "-"],
      explanation: "20 - 8 = 12 va 10 + 5 = 15. 12 < 15 bo'ladi."
    }
  ],
  test: [
    {
      text: "6 + 4 ... 5 + 5 ifodasiga qaysi belgi mos?",
      correctAnswer: "=",
      distractors: [">", "<", "≠"],
      explanation: "6 + 4 = 10 va 5 + 5 = 10, natijalar teng: 10 = 10."
    },
    {
      text: "9 + 3 ... 8 + 2 ifodasiga qaysi belgi to'g'ri?",
      correctAnswer: ">",
      distractors: ["<", "=", "+"],
      explanation: "9 + 3 = 12 va 8 + 2 = 10. 12 > 10."
    },
    {
      text: "7 + 4 ... 6 + 6 ifodalarini taqqoslang:",
      correctAnswer: "<",
      distractors: [">", "=", "≠"],
      explanation: "7 + 4 = 11 va 6 + 6 = 12. 11 < 12."
    },
    {
      text: "14 - 6 ... 15 - 7 ifodalariga qaysi belgi qo'yiladi?",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "14 - 6 = 8 va 15 - 7 = 8. Ikkala tomon teng: 8 = 8."
    },
    {
      text: "18 - 9 ... 16 - 8 ifodasini taqqoslang:",
      correctAnswer: ">",
      distractors: ["<", "=", "-"],
      explanation: "18 - 9 = 9 va 16 - 8 = 8. 9 > 8."
    },
    {
      text: "25 - 5 ... 15 + 6 ifodasiga qaysi belgi mos?",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "25 - 5 = 20 va 15 + 6 = 21. 20 < 21."
    },
    {
      text: "30 + 10 ... 50 - 10 ifodalarini taqqoslang:",
      correctAnswer: "=",
      distractors: [">", "<", "≠"],
      explanation: "30 + 10 = 40 va 50 - 10 = 40. Ikkala tomon ham 40 ga teng."
    },
    {
      text: "45 - 5 ... 30 + 12 ifodasiga qaysi belgi mos?",
      correctAnswer: "<",
      distractors: [">", "=", "-"],
      explanation: "45 - 5 = 40 va 30 + 12 = 42. 40 < 42."
    },
    {
      text: "10 + 8 ... 25 - 7 ifodalariga qaysi belgi qo'yiladi?",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "10 + 8 = 18 va 25 - 7 = 18. Natijalar teng."
    },
    {
      text: "50 - 20 ... 20 + 5 ifodalarini taqqoslang:",
      correctAnswer: ">",
      distractors: ["<", "=", "+"],
      explanation: "50 - 20 = 30 va 20 + 5 = 25. 30 > 25."
    },
    {
      text: "13 + 7 ... 30 - 8 ifodasiga qaysi belgi mos?",
      correctAnswer: "<",
      distractors: [">", "=", "-"],
      explanation: "13 + 7 = 20 va 30 - 8 = 22. 20 < 22."
    },
    {
      text: "16 + 4 ... 12 + 8 ifodasini taqqoslang:",
      correctAnswer: "=",
      distractors: [">", "<", "≠"],
      explanation: "16 + 4 = 20 va 12 + 8 = 20. 20 = 20."
    },
    {
      text: "40 - 15 ... 10 + 14 ifodalariga qaysi belgi mos?",
      correctAnswer: ">",
      distractors: ["<", "=", "+"],
      explanation: "40 - 15 = 25 va 10 + 14 = 24. 25 > 24."
    },
    {
      text: "90 - 40 ... 20 + 30 ifodalarini taqqoslang:",
      correctAnswer: "=",
      distractors: [">", "<", "≠"],
      explanation: "90 - 40 = 50 va 20 + 30 = 50. 50 = 50."
    },
    {
      text: "60 + 5 ... 70 - 4 ifodalariga qaysi belgi mos keladi?",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "60 + 5 = 65 va 70 - 4 = 66. 65 < 66."
    },
    {
      text: "80 - 30 ... 25 + 24 ifodasini taqqoslang:",
      correctAnswer: ">",
      distractors: ["<", "=", "-"],
      explanation: "80 - 30 = 50 va 25 + 24 = 49. 50 > 49."
    },
    {
      text: "100 - 50 ... 20 + 30 ifodasiga mos belgi:",
      correctAnswer: "=",
      distractors: [">", "<", "≠"],
      explanation: "100 - 50 = 50 va 20 + 30 = 50. Ikkalasi teng."
    },
    {
      text: "Ali 14 + 6 ta, Vali 12 + 7 ta masalani yechdi. Kim ko'p masala yechgan?",
      correctAnswer: "Ali ko'p yechgan (20 > 19)",
      distractors: ["Vali ko'p yechgan", "Ikkalasi teng yechgan", "Vali 21 ta yechgan"],
      explanation: "Ali: 14 + 6 = 20 ta. Vali: 12 + 7 = 19 ta. 20 > 19, demak Ali ko'p."
    },
    {
      text: "Daftar 15 - 5 ta, kitob 8 + 3 ta. Narsa sonlarini taqqoslang:",
      correctAnswer: "Daftar kam (10 < 11)",
      distractors: ["Daftar ko'p", "Ikkalasi teng", "Daftar 12 ta"],
      explanation: "Daftar: 15 - 5 = 10 ta. Kitob: 8 + 3 = 11 ta. 10 < 11."
    },
    {
      text: "Ifodalarni taqqoslashda birinchi nima qilish kerak?",
      correctAnswer: "Har bir ifodaning natijasini alohida hisoblab olish",
      distractors: [
        "Faqat birinchi sonni solishtirish",
        "Tenglik belgisini taxminan qo'yish",
        "Amallarni bajarmasdan o'tkazib yuborish"
      ],
      explanation: "To'g'ri taqqoslash uchun avval ikkala tomonning aniq qiymatini hisoblab olamiz."
    }
  ]
};

export const lesson133: LessonDef = {
  bookNumber: 133,
  title: "Ifodaning qiymatini hisoblash",
  emoji: "🧮",
  shortDesc: "Harfiy ifodadagi harf o'rniga berilgan sonni qo'yib hisoblash",
  intro: "Harfiy ifodada harf ma'lum bir songa teng deb berilsa, harf o'rniga o'sha sonni qo'yamiz va hosil bo'lgan sonli ifodaning qiymatini hisoblaymiz.",
  keyPoints: [
    "Agar a + 5 ifodada a = 7 bo'lsa, 7 + 5 = 12 bo'ladi.",
    "Agar 30 - x ifodada x = 10 bo'lsa, 30 - 10 = 20 bo'ladi.",
    "Bitta harfiy ifodaning qiymati harfga berilgan songa qarab har xil chiqishi mumkin.",
    "Masalani yechishda avval ifoda yoziladi, keyin son qo'yiladi."
  ],
  miniExample: {
    emojis: "🧮 x = 8 bo'lsa, x + 7 = ?",
    text: "x ning o'rniga 8 qo'yamiz: 8 + 7 = 15. Ifodaning qiymati 15 ga teng!"
  },
  xpReward: 110,
  coinReward: 12,
  estMinutes: 9,
  practice: [
    {
      text: "a = 9 bo'lsa, a + 6 ifodaning qiymatini toping:",
      correctAnswer: "15",
      distractors: ["14", "16", "13"],
      explanation: "9 + 6 = 15."
    },
    {
      text: "x = 4 bo'lsa, 20 - x ifodaning qiymati nechaga teng?",
      correctAnswer: "16",
      distractors: ["14", "15", "18"],
      explanation: "20 - 4 = 16."
    },
    {
      text: "b = 10 bo'lsa, b + b ifodaning qiymati qancha bo'ladi?",
      correctAnswer: "20",
      distractors: ["10", "30", "15"],
      explanation: "10 + 10 = 20."
    }
  ],
  test: [
    {
      text: "a = 8 bo'lsa, a + 7 ifodaning qiymatini hisoblang:",
      correctAnswer: "15",
      distractors: ["14", "16", "17"],
      explanation: "8 + 7 = 15."
    },
    {
      text: "x = 6 bo'lsa, 14 - x ifodaning qiymati nechaga teng?",
      correctAnswer: "8",
      distractors: ["7", "9", "10"],
      explanation: "14 - 6 = 8."
    },
    {
      text: "y = 5 bo'lsa, y + 15 ifodaning natijasini toping:",
      correctAnswer: "20",
      distractors: ["18", "22", "25"],
      explanation: "5 + 15 = 20."
    },
    {
      text: "c = 12 bo'lsa, 30 - c ifodaning qiymati qancha bo'ladi?",
      correctAnswer: "18",
      distractors: ["16", "20", "22"],
      explanation: "30 - 12 = 18."
    },
    {
      text: "m = 25 bo'lsa, m + 5 ifodaning qiymati nechaga teng?",
      correctAnswer: "30",
      distractors: ["28", "32", "35"],
      explanation: "25 + 5 = 30."
    },
    {
      text: "k = 8 bo'lsa, 48 - k ifodaning qiymati qancha?",
      correctAnswer: "40",
      distractors: ["38", "42", "44"],
      explanation: "48 - 8 = 40."
    },
    {
      text: "Agar a = 14 bo'lsa, a - 9 ifodaning natijasi nechaga teng?",
      correctAnswer: "5",
      distractors: ["4", "6", "7"],
      explanation: "14 - 9 = 5."
    },
    {
      text: "Agar b = 7 bo'lsa, 50 + b ifodaning qiymatini toping:",
      correctAnswer: "57",
      distractors: ["55", "58", "60"],
      explanation: "50 + 7 = 57."
    },
    {
      text: "Agar x = 20 bo'lsa, 100 - x ifodaning qiymati nechaga teng?",
      correctAnswer: "80",
      distractors: ["70", "85", "90"],
      explanation: "100 - 20 = 80."
    },
    {
      text: "Agar n = 15 bo'lsa, n + n ifodaning qiymati qancha bo'ladi?",
      correctAnswer: "30",
      distractors: ["25", "35", "20"],
      explanation: "15 + 15 = 30."
    },
    {
      text: "a = 6, b = 8 bo'lsa, a + b ifodaning qiymatini hisoblang:",
      correctAnswer: "14",
      distractors: ["12", "15", "16"],
      explanation: "6 + 8 = 14."
    },
    {
      text: "x = 20, y = 8 bo'lsa, x - y ifodaning qiymati nechaga teng?",
      correctAnswer: "12",
      distractors: ["10", "14", "15"],
      explanation: "20 - 8 = 12."
    },
    {
      text: "c = 30, d = 15 bo'lsa, c + d ifodaning natijasini toping:",
      correctAnswer: "45",
      distractors: ["40", "50", "35"],
      explanation: "30 + 15 = 45."
    },
    {
      text: "Agar a = 10 bo'lsa, (a + 5) - 3 ifodasining qiymati nechaga teng?",
      correctAnswer: "12",
      distractors: ["10", "14", "15"],
      explanation: "(10 + 5) - 3 = 15 - 3 = 12."
    },
    {
      text: "Agar x = 7 bo'lsa, 25 - (x + 3) ifodasining qiymatini hisoblang:",
      correctAnswer: "15",
      distractors: ["13", "17", "18"],
      explanation: "x + 3 = 7 + 3 = 10. Keyin 25 - 10 = 15."
    },
    {
      text: "Agar y = 9 bo'lsa, (y - 4) + 10 ifodaning qiymati nechaga teng?",
      correctAnswer: "15",
      distractors: ["13", "14", "16"],
      explanation: "9 - 4 = 5. So'ngra 5 + 10 = 15."
    },
    {
      text: "Bir qutida 12 ta, ikkinchisida k ta qalam bor. Agar k = 8 bo'lsa, jami qalamlar nechta?",
      correctAnswer: "20 ta (12 + 8 = 20)",
      distractors: ["18 ta", "22 ta", "19 ta"],
      explanation: "12 + k = 12 + 8 = 20 ta."
    },
    {
      text: "Avtobusda 35 ta yo'lovchi bor edi. Bekatda p ta yo'lovchi tushdi. Agar p = 15 bo'lsa, nechta yo'lovchi qoldi?",
      correctAnswer: "20 ta (35 - 15 = 20)",
      distractors: ["18 ta", "22 ta", "25 ta"],
      explanation: "35 - p = 35 - 15 = 20 ta yo'lovchi qoldi."
    },
    {
      text: "Agar a = 0 bo'lsa, 45 + a ifodaning qiymati nima bo'ladi?",
      correctAnswer: "45",
      distractors: ["0", "40", "50"],
      explanation: "Nol qo'shilganda sonning o'zi saqlanib qoladi: 45 + 0 = 45."
    },
    {
      text: "Agar x = 25 bo'lsa, x - x ifodaning natijasi nechaga teng?",
      correctAnswer: "0",
      distractors: ["25", "50", "1"],
      explanation: "Sondan o'zi ayrilsa natija nol bo'ladi: 25 - 25 = 0."
    }
  ]
};

export const lesson134: LessonDef = {
  bookNumber: 134,
  title: "Matematik amallarning xossalari",
  emoji: "🔁",
  shortDesc: "Qo'shishning o'rin almashtirish va guruhlash xossalari, qulay hisoblash",
  intro: "Qo'shish amali juda ajoyib xossalarga ega. Qo'shiluvchilarning o'rni almashgani bilan yig'indi o'zgarmaydi (a + b = b + a). Sonlarni qulay guruhlab qo'shish hisoblashni ancha osonlashtiradi!",
  keyPoints: [
    "O'rin almashtirish xossasi: a + b = b + a (masalan, 7 + 3 = 3 + 7 = 10).",
    "Guruhlash xossasi: (a + b) + c = a + (b + c).",
    "Qulay usul: yig'indisi 10 yoki 20 bo'ladigan sonlarni avval qo'shib olish yaxshi natija beradi.",
    "Masalan: 17 + 8 + 3 = (17 + 3) + 8 = 20 + 8 = 28."
  ],
  miniExample: {
    emojis: "🔁 16 + 9 + 4 = (16 + 4) + 9",
    text: "16 ga 4 ni qo'shsak 20 bo'ladi, keyin 9 ni qo'shamiz: 20 + 9 = 29. Juda oson va tez!"
  },
  xpReward: 95,
  coinReward: 10,
  estMinutes: 8,
  practice: [
    {
      text: "6 + 9 = ? + 6 tenglikda so'roq belgisi o'rnida qaysi son bo'ladi?",
      correctAnswer: "9",
      distractors: ["6", "15", "3"],
      explanation: "O'rin almashtirish xossasiga ko'ra 6 + 9 = 9 + 6."
    },
    {
      text: "14 + 7 + 6 ifodasini qulay usulda hisoblang:",
      correctAnswer: "27 ((14 + 6) + 7 = 20 + 7 = 27)",
      distractors: ["25", "28", "26"],
      explanation: "14 va 6 yig'indisi 20, 20 + 7 = 27."
    },
    {
      text: "Qo'shiluvchilarning o'rni almashsa yig'indi nima bo'ladi?",
      correctAnswer: "O'zgarmaydi",
      distractors: ["Kattalashadi", "Kamayadi", "Nol bo'ladi"],
      explanation: "Qo'shishning o'rin almashtirish xossasiga ko'ra yig'indi o'zgarmaydi."
    }
  ],
  test: [
    {
      text: "8 + 5 = 5 + 8 tenglik qaysi xossani ifodalaydi?",
      correctAnswer: "Qo'shishning o'rin almashtirish xossasi",
      distractors: ["Guruhlash xossasi", "Ayirish xossasi", "Tengsizlik qoidasi"],
      explanation: "Qo'shiluvchilarning o'rni almashsa yig'indi o'zgarmasligi — o'rin almashtirish xossasidir."
    },
    {
      text: "12 + 7 ifodasini o'rin almashtirish xossasi bilan yozing:",
      correctAnswer: "7 + 12",
      distractors: ["12 - 7", "7 - 12", "12 + 12"],
      explanation: "Qo'shiluvchilar o'rni almashadi: 7 + 12."
    },
    {
      text: "23 + 4 = 4 + ? tenglikda bo'sh joyga qaysi son mos keladi?",
      correctAnswer: "23",
      distractors: ["27", "4", "20"],
      explanation: "23 + 4 = 4 + 23."
    },
    {
      text: "15 + 8 + 5 ifodasini qulay usulda hisoblang:",
      correctAnswer: "28 ((15 + 5) + 8 = 20 + 8 = 28)",
      distractors: ["26", "30", "27"],
      explanation: "15 + 5 = 20, 20 + 8 = 28."
    },
    {
      text: "18 + 9 + 2 ifodasini qulay usulda hisoblang:",
      correctAnswer: "29 ((18 + 2) + 9 = 20 + 9 = 29)",
      distractors: ["27", "30", "28"],
      explanation: "18 + 2 = 20, 20 + 9 = 29."
    },
    {
      text: "24 + 7 + 6 ifodasining qulay hisoblash natijasi qanday?",
      correctAnswer: "37 ((24 + 6) + 7 = 30 + 7 = 37)",
      distractors: ["35", "38", "36"],
      explanation: "24 + 6 = 30, 30 + 7 = 37."
    },
    {
      text: "31 + 8 + 9 ifodasini qulay usulda hisoblang:",
      correctAnswer: "48 ((31 + 9) + 8 = 40 + 8 = 48)",
      distractors: ["46", "49", "50"],
      explanation: "31 + 9 = 40, 40 + 8 = 48."
    },
    {
      text: "45 + 16 + 5 ifodasining qiymati nechaga teng?",
      correctAnswer: "66 ((45 + 5) + 16 = 50 + 16 = 66)",
      distractors: ["64", "65", "68"],
      explanation: "45 + 5 = 50, 50 + 16 = 66."
    },
    {
      text: "(a + b) + c = a + (b + c) tenglik qaysi xossani ifodalaydi?",
      correctAnswer: "Qo'shishning guruhlash xossasi",
      distractors: ["O'rin almashtirish", "Ayirish", "Bo'lish"],
      explanation: "Qo'shiluvchilarni qavs yordamida guruhlash — guruhlash xossasidir."
    },
    {
      text: "50 + 0 yig'indi nechaga teng?",
      correctAnswer: "50",
      distractors: ["0", "5", "500"],
      explanation: "Istalgan songa nol qo'shilsa, sonning o'zi chiqadi."
    },
    {
      text: "0 + 38 yig'indisi nechaga teng?",
      correctAnswer: "38",
      distractors: ["0", "30", "40"],
      explanation: "Nolga son qo'shilganda yig'indi o'sha songa teng bo'ladi."
    },
    {
      text: "13 + 25 + 7 ifodasini qulay hisoblang:",
      correctAnswer: "45 ((13 + 7) + 25 = 20 + 25 = 45)",
      distractors: ["43", "47", "50"],
      explanation: "13 + 7 = 20, 20 + 25 = 45."
    },
    {
      text: "26 + 14 + 15 ifodasining qiymatini toping:",
      correctAnswer: "55 ((26 + 14) + 15 = 40 + 15 = 55)",
      distractors: ["50", "54", "56"],
      explanation: "26 + 14 = 40, 40 + 15 = 55."
    },
    {
      text: "33 + 19 + 7 ifodasini hisoblang:",
      correctAnswer: "59 ((33 + 7) + 19 = 40 + 19 = 59)",
      distractors: ["57", "58", "60"],
      explanation: "33 + 7 = 40, 40 + 19 = 59."
    },
    {
      text: "Qaysi tenglik xato tuzilgan?",
      correctAnswer: "15 - 5 = 5 - 15",
      distractors: ["15 + 5 = 5 + 15", "8 + 4 = 4 + 8", "20 + 10 = 10 + 20"],
      explanation: "Ayirish amalida o'rin almashtirish xossasi bajarilmaydi (15 - 5 ≠ 5 - 15)."
    },
    {
      text: "Ayirish amali uchun o'rin almashtirish xossasi to'g'rimi?",
      correctAnswer: "Yo'q, ayirishda o'rinni almashtirib bo'lmaydi",
      distractors: ["Ha, doim to'g'ri", "Faqat juft sonlarda", "Faqat nol bo'lganda"],
      explanation: "Kamayuvchi va ayriluvchi o'rnini almashtirib bo'lmaydi."
    },
    {
      text: "42 + 28 + 9 ifodasini qulay hisoblang:",
      correctAnswer: "79 ((42 + 28) + 9 = 70 + 9 = 79)",
      distractors: ["78", "80", "89"],
      explanation: "42 + 28 = 70, 70 + 9 = 79."
    },
    {
      text: "54 + 8 + 6 ifodasining natijasi qanday?",
      correctAnswer: "68 ((54 + 6) + 8 = 60 + 8 = 68)",
      distractors: ["66", "69", "70"],
      explanation: "54 + 6 = 60, 60 + 8 = 68."
    },
    {
      text: "Birinchi savatda 17 ta, ikkinchisida 8 ta, uchinchisida 3 ta olma bor. Jami olmalarni qulay hisoblang:",
      correctAnswer: "28 ta ((17 + 3) + 8 = 28)",
      distractors: ["26 ta", "27 ta", "30 ta"],
      explanation: "17 + 3 = 20, 20 + 8 = 28 ta olma."
    },
    {
      text: "Qulay hisoblash usuli bizga nima beradi?",
      correctAnswer: "Tez va oson og'zaki hisoblash imkonini",
      distractors: [
        "Javobni kattalashtirib beradi",
        "Masalani chalkashtiradi",
        "Amallarni yo'qotadi"
      ],
      explanation: "Xossalar yordamida sonlarni yaxlitlab oson va xatosiz hisoblash mumkin."
    }
  ]
};

export const lesson135: LessonDef = {
  bookNumber: 135,
  title: "Sonli va harfiy tengsizliklar",
  emoji: "↔️",
  shortDesc: "Oraliq tengsizliklar: 18 < x < 22 va harfiy tengsizliklarni yechish",
  intro: "Harfiy tengsizliklarda noma'lum son harf bilan belgilanadi. Masalan, x > 5 ifodasi 5 dan katta barcha sonlarni bildiradi. Oraliq tengsizlikda esa (masalan, 18 < x < 22) x soni ikki son orasidagi qatorda joylashadi (19, 20, 21).",
  keyPoints: [
    "Harfiy tengsizlik: masalan, x < 6 (x o'rniga 0, 1, 2, 3, 4, 5 qo'yish mumkin).",
    "Oraliq tengsizlik: masalan, 18 < x < 22 (x o'rniga 19, 20, 21 sonlari to'g'ri keladi).",
    "x ning o'rniga qo'yilganda to'g'ri tengsizlik hosil qiladigan sonlar tengsizlikning yechimlari deyiladi.",
    "18 < x < 22 tengsizlik 'x soni 18 dan katta va 22 dan kichik' deb o'qiladi."
  ],
  miniExample: {
    emojis: "↔️ 18 < x < 22",
    text: "x soni 18 dan katta, lekin 22 dan kichik. Demak, x soni 19, 20 yoki 21 bo'lishi mumkin!"
  },
  xpReward: 110,
  coinReward: 12,
  estMinutes: 9,
  practice: [
    {
      text: "18 < x < 22 tengsizlikni qanoatlantiruvchi sonlarni toping:",
      correctAnswer: "19, 20, 21",
      distractors: ["18, 19, 20", "20, 21, 22", "17, 18, 19"],
      explanation: "18 dan katta va 22 dan kichik sonlar: 19, 20 va 21."
    },
    {
      text: "x < 4 tengsizlikka qaysi sonlar to'g'ri keladi?",
      correctAnswer: "0, 1, 2, 3",
      distractors: ["4, 5, 6", "1, 2, 3, 4", "5, 6, 7"],
      explanation: "4 dan kichik sonlar: 0, 1, 2 va 3."
    },
    {
      text: "10 < y < 14 tengsizlikda y nechaga teng bo'lishi mumkin?",
      correctAnswer: "11, 12, 13",
      distractors: ["10, 11, 12", "12, 13, 14", "9, 10, 11"],
      explanation: "10 dan katta va 14 dan kichik sonlar: 11, 12 va 13."
    }
  ],
  test: [
    {
      text: "18 < x < 22 tengsizlik qanday o'qiladi?",
      correctAnswer: "x soni 18 dan katta va 22 dan kichik",
      distractors: [
        "x soni 18 dan kichik va 22 dan katta",
        "x soni 18 va 22 ga teng",
        "x faqat 20 ga teng"
      ],
      explanation: "Qo'sh tengsizlik o'rtadagi harfdan boshlab o'qiladi: x soni 18 dan katta va 22 dan kichik."
    },
    {
      text: "18 < x < 22 tengsizlikka qaysi son mos KELMAYDI?",
      correctAnswer: "22",
      distractors: ["19", "20", "21"],
      explanation: "22 soni 22 dan kichik emas (22 < 22 noto'g'ri), shuning uchun u kirmaydi."
    },
    {
      text: "18 < x < 22 tengsizlikka 18 soni kiradimi?",
      correctAnswer: "Yo'q, 18 kirmaydi (qat'iy katta)",
      distractors: ["Ha, albatta kiradi", "Faqat bir marta kiradi", "x=18 bo'lishi shart"],
      explanation: "18 < x deyilgan, ya'ni x soni 18 dan qat'iy katta bo'lishi kerak."
    },
    {
      text: "15 < a < 19 tengsizlikning barcha butun yechimlarini toping:",
      correctAnswer: "16, 17, 18",
      distractors: ["15, 16, 17", "17, 18, 19", "16, 18, 20"],
      explanation: "15 dan katta va 19 dan kichik sonlar: 16, 17 va 18."
    },
    {
      text: "28 < y < 32 tengsizlikni qanoatlantiruvchi sonlar qatori:",
      correctAnswer: "29, 30, 31",
      distractors: ["28, 29, 30", "30, 31, 32", "27, 28, 29"],
      explanation: "28 dan keyingi va 32 dan oldingi sonlar: 29, 30, 31."
    },
    {
      text: "9 < m < 13 tengsizlikda nechta yechim bor?",
      correctAnswer: "3 ta (10, 11, 12)",
      distractors: ["2 ta", "4 ta", "1 ta"],
      explanation: "10, 11 va 12 sonlari, ya'ni jami 3 ta yechim bor."
    },
    {
      text: "40 < k < 44 oraliqdagi sonlar qaysilar?",
      correctAnswer: "41, 42, 43",
      distractors: ["40, 41, 42", "42, 43, 44", "41, 43, 45"],
      explanation: "40 va 44 orasidagi sonlar: 41, 42, 43."
    },
    {
      text: "x + 3 < 7 tengsizlikda x o'rniga qaysi son to'g'ri keladi?",
      correctAnswer: "2 (chunki 2 + 3 = 5 < 7)",
      distractors: ["4 (chunki 4 + 3 = 7)", "5 (chunki 5 + 3 = 8)", "6 (chunki 6 + 3 = 9)"],
      explanation: "x = 2 bo'lsa, 2 + 3 = 5, 5 < 7 to'g'ri."
    },
    {
      text: "y - 2 > 6 tengsizlikda y qaysi son bo'lishi mumkin?",
      correctAnswer: "10 (chunki 10 - 2 = 8 > 6)",
      distractors: ["8 (chunki 8 - 2 = 6)", "7 (chunki 7 - 2 = 5)", "5 (chunki 5 - 2 = 3)"],
      explanation: "10 - 2 = 8, 8 esa 6 dan katta, demak y = 10 to'g'ri."
    },
    {
      text: "50 < x < 55 oralig'idagi eng katta son qaysi?",
      correctAnswer: "54",
      distractors: ["55", "53", "50"],
      explanation: "55 dan kichik bo'lgan eng katta butun son 54 dir."
    },
    {
      text: "50 < x < 55 oralig'idagi eng kichik son qaysi?",
      correctAnswer: "51",
      distractors: ["50", "52", "49"],
      explanation: "50 dan katta bo'lgan eng kichik butun son 51 dir."
    },
    {
      text: "1 < x < 5 tengsizlikning yechimlari yig'indisini toping:",
      correctAnswer: "9 (2 + 3 + 4 = 9)",
      distractors: ["10", "8", "6"],
      explanation: "Yechimlar: 2, 3, 4. Yig'indisi: 2 + 3 + 4 = 9."
    },
    {
      text: "8 < b < 11 tengsizlikda nechta son bor?",
      correctAnswer: "2 ta (9 va 10)",
      distractors: ["3 ta", "1 ta", "0 ta"],
      explanation: "8 va 11 orasida faqat 9 va 10 sonlari bor, jami 2 ta."
    },
    {
      text: "70 < z < 73 tengsizlikda z qanday sonlar bo'lishi mumkin?",
      correctAnswer: "71 va 72",
      distractors: ["70 va 71", "72 va 73", "Faqat 71"],
      explanation: "70 dan katta va 73 dan kichik sonlar: 71 va 72."
    },
    {
      text: "Dildoraning yoshi 7 dan katta, lekin 10 dan kichik. U necha yoshda bo'lishi mumkin?",
      correctAnswer: "8 yoki 9 yoshda",
      distractors: ["7 yoki 8 yoshda", "9 yoki 10 yoshda", "Faqat 10 yoshda"],
      explanation: "7 < x < 10 bo'lgani uchun Dildora 8 yoki 9 yoshda."
    },
    {
      text: "Savatdagi olmalar soni 15 dan ko'p va 18 dan kam. Savatda nechta olma bo'lishi mumkin?",
      correctAnswer: "16 yoki 17 ta",
      distractors: ["15 yoki 16 ta", "17 yoki 18 ta", "Faqat 15 ta"],
      explanation: "15 < x < 18 oraliqdagi sonlar 16 va 17 dir."
    },
    {
      text: "Qaysi tengsizlik to'g'ri yozilgan?",
      correctAnswer: "20 < 25 < 30",
      distractors: ["30 < 25 < 20", "25 < 20 < 30", "20 > 25 > 30"],
      explanation: "20 soni 25 dan kichik, 25 soni 30 dan kichik: 20 < 25 < 30 to'g'ri."
    },
    {
      text: "0 < x < 3 tengsizlikning yechimlari qaysilar?",
      correctAnswer: "1 va 2",
      distractors: ["0, 1, 2", "1, 2, 3", "Faqat 2"],
      explanation: "0 dan katta va 3 dan kichik sonlar 1 va 2 dir."
    },
    {
      text: "Agar x = 20 bo'lsa, u 18 < x < 22 tengsizlikni qanoatlantiradimi?",
      correctAnswer: "Ha, chunki 18 < 20 < 22 to'g'ri",
      distractors: ["Yo'q, qanoatlantirmaydi", "Faqat juft bo'lsa", "Faqat toq bo'lsa"],
      explanation: "18 < 20 va 20 < 22 to'g'ri bo'lgani uchun x = 20 yechim bo'ladi."
    },
    {
      text: "Oraliq tengsizliklar bizga nima haqida ma'lumot beradi?",
      correctAnswer: "Noma'lum son qaysi ikki chegara orasida joylashganini",
      distractors: [
        "Faqat bitta sonni",
        "Hamma sonlar tengligini",
        "Faqat manfiy sonlarni"
      ],
      explanation: "Oraliq tengsizlik noma'lum miqdorning quyi va yuqori chegaralarini belgilab beradi."
    }
  ]
};

export const lesson136: LessonDef = {
  bookNumber: 136,
  title: "Rim raqamlari",
  emoji: "🏛️",
  shortDesc: "Rim raqamlari (I, V, X, L, C) va ular ustida arifmetik amallar",
  intro: "Qadimiy Rimda sonlarni yozish uchun maxsus harflardan foydalanilgan: I = 1, V = 5, X = 10, L = 50, C = 100. Bugungi kunda ham soat siferblatlarida, kitob fasllarida va asrlarni belgilashda Rim raqamlari keng ishlatiladi!",
  keyPoints: [
    "Asosiy belgilar: I = 1, V = 5, X = 10, L = 50, C = 100.",
    "Birlashtirish: o'ng tomonga yozilsa qo'shiladi (VI = 6, XI = 11, XV = 15).",
    "Chap tomonga yozilsa ayriladi (IV = 4, IX = 9, XL = 40, XC = 90).",
    "Rim raqamlarida amallar: V + V = X (5 + 5 = 10), XX + XL = LX (20 + 40 = 60)."
  ],
  miniExample: {
    emojis: "🏛️ V + V = X | XX + XL = LX",
    text: "V (5) ga V (5) ni qo'shsak X (10) bo'ladi. XX (20) ga XL (40) ni qo'shsak LX (60) bo'ladi!"
  },
  xpReward: 95,
  coinReward: 10,
  estMinutes: 8,
  practice: [
    {
      text: "Rim raqamida X qaysi sonni bildiradi?",
      correctAnswer: "10",
      distractors: ["5", "1", "50"],
      explanation: "X belgisi 10 sonini bildiradi."
    },
    {
      text: "V + V amali Rim raqamlarida nimaga teng?",
      correctAnswer: "X (5 + 5 = 10)",
      distractors: ["VV", "XV", "L"],
      explanation: "V = 5 bo'lib, 5 + 5 = 10 (X)."
    },
    {
      text: "Rim raqamida IV qaysi sonni bildiradi?",
      correctAnswer: "4 (5 - 1 = 4)",
      distractors: ["6", "5", "14"],
      explanation: "I harfi V dan oldin kelgani uchun 5 - 1 = 4 bo'ladi."
    }
  ],
  test: [
    {
      text: "Rim raqami V qaysi songa teng?",
      correctAnswer: "5",
      distractors: ["1", "10", "50"],
      explanation: "V belgisi 5 sonini anglatadi."
    },
    {
      text: "Rim raqami I nimani bildiradi?",
      correctAnswer: "1",
      distractors: ["2", "5", "10"],
      explanation: "I belgisi 1 sonini bildiradi."
    },
    {
      text: "Rim raqami L qaysi sonni ifodalaydi?",
      correctAnswer: "50",
      distractors: ["10", "100", "5"],
      explanation: "L belgisi 50 sonini ifodalaydi."
    },
    {
      text: "Rim raqami C qaysi songa teng?",
      correctAnswer: "100",
      distractors: ["50", "10", "1000"],
      explanation: "C belgisi 100 sonini bildiradi (Centum — yuz)."
    },
    {
      text: "Rim raqamida 7 qanday yoziladi?",
      correctAnswer: "VII (5 + 2)",
      distractors: ["VI", "VIII", "IIIV"],
      explanation: "V (5) ga ikkita I (2) qo'shiladi: VII = 7."
    },
    {
      text: "Rim raqamida 9 qanday yoziladi?",
      correctAnswer: "IX (10 - 1)",
      distractors: ["VIIII", "XI", "VIV"],
      explanation: "10 dan 1 ayriladi: IX = 9."
    },
    {
      text: "V + V amali natijasi qaysi Rim raqami bo'ladi?",
      correctAnswer: "X (5 + 5 = 10)",
      distractors: ["XV", "L", "VV"],
      explanation: "5 + 5 = 10, bu esa Rim raqamida X deb yoziladi."
    },
    {
      text: "XX + XL amali natijasini toping (20 + 40):",
      correctAnswer: "LX (60)",
      distractors: ["L (50)", "LXX (70)", "XXXX (40)"],
      explanation: "XX = 20, XL = 40. 20 + 40 = 60, bu Rim raqamida LX dir."
    },
    {
      text: "X + V amali Rim raqamlarida nimaga teng?",
      correctAnswer: "XV (10 + 5 = 15)",
      distractors: ["XX", "V", "L"],
      explanation: "10 + 5 = 15, bu esa XV deb yoziladi."
    },
    {
      text: "L - X amali natijasi qaysi Rim raqami bo'ladi (50 - 10)?",
      correctAnswer: "XL (40)",
      distractors: ["LX (60)", "XXX (30)", "L (50)"],
      explanation: "50 - 10 = 40, Rim raqamida 40 bu XL deb yoziladi."
    },
    {
      text: "Rim raqamida 12 qanday yoziladi?",
      correctAnswer: "XII (10 + 2)",
      distractors: ["IIX", "IXI", "XIII"],
      explanation: "10 + 2 = 12, ya'ni XII."
    },
    {
      text: "Rim raqamida 20 qanday yoziladi?",
      correctAnswer: "XX (10 + 10)",
      distractors: ["VVVV", "XV", "X"],
      explanation: "20 soni ikkita o'nlik: XX."
    },
    {
      text: "Rim raqamida 3 qanday yoziladi?",
      correctAnswer: "III",
      distractors: ["II", "IV", "V"],
      explanation: "3 ta tayoqcha: III."
    },
    {
      text: "Rim raqamida 6 qanday yoziladi?",
      correctAnswer: "VI (5 + 1)",
      distractors: ["IV", "VII", "V"],
      explanation: "5 + 1 = 6, ya'ni VI."
    },
    {
      text: "Rim raqamida 11 qanday yoziladi?",
      correctAnswer: "XI (10 + 1)",
      distractors: ["IX", "XII", "X"],
      explanation: "10 + 1 = 11, ya'ni XI."
    },
    {
      text: "Soat siferblatida eng yuqoridagi son odatda qanday yoziladi?",
      correctAnswer: "XII (12)",
      distractors: ["VI (6)", "X (10)", "I (1)"],
      explanation: "Soatning eng tepasida 12 soni, ya'ni XII turadi."
    },
    {
      text: "Soatning eng pastki qismida qaysi Rim raqami bo'ladi?",
      correctAnswer: "VI (6)",
      distractors: ["XII", "IX", "III"],
      explanation: "Soatning pastida 6 soni, ya'ni VI joylashgan."
    },
    {
      text: "X + X amali nimaga teng?",
      correctAnswer: "XX (20)",
      distractors: ["XV (15)", "L (50)", "X (10)"],
      explanation: "10 + 10 = 20, bu XX dir."
    },
    {
      text: "C - L amali natijasi nechaga teng (100 - 50)?",
      correctAnswer: "L (50)",
      distractors: ["C (100)", "XL (40)", "LX (60)"],
      explanation: "100 - 50 = 50, Rim raqamida 50 bu L."
    },
    {
      text: "Rim raqamlarida nol (0) bormi?",
      correctAnswer: "Yo'q, Rim raqamlarida nol belgisi yo'q",
      distractors: ["Ha, 0 deb yoziladi", "Ha, N harfi bor", "Ha, O harfi bor"],
      explanation: "Qadimgi Rim raqamlari tizimida nol soni uchun alohida belgi bo'lmagan."
    }
  ]
};

// Save all Chapter 3 lessons
const lessons = [
  lesson129,
  lesson130,
  lesson131,
  lesson132,
  lesson133,
  lesson134,
  lesson135,
  lesson136
];

for (const lessonDef of lessons) {
  const seed = buildLessonSeed(lessonDef);
  saveLessonFile(4, lessonDef.bookNumber, seed, false);
  console.log(`✅ Saved lesson-${lessonDef.bookNumber}.json`);
}
