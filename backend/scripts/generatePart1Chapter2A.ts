import { LessonDataDef, buildLessonSeed, saveLessonFile } from './generatorTypes.js';

const lessons: LessonDataDef[] = [
  // 9. 1 dan 10 gacha bo‘lgan sonlar
  {
    bookNumber: 9,
    title: "1 dan 10 gacha bo‘lgan sonlar",
    emoji: "🔢",
    shortDesc: "1 dan 10 gacha sonlar ketma-ketligi, sanash va tushirib qoldirilgan son.",
    intro: "1 dan 10 gacha bo‘lgan sonlar birin-ketin o‘sib boradi: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10.",
    keyPoints: [
      "Har bir keyingi son oldingisidan 1 taga katta bo‘ladi.",
      "Sonlar qatorida tushib qolgan sonni qatorga qarab topamiz.",
      "1 eng kichik bir xonali natural son, 10 esa birinchi ikki xonali son."
    ],
    miniExample: {
      emojis: "1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣",
      text: "Tartib bilan sanaymiz: bir, ikki, uch, to‘rt, besh!"
    },
    xpReward: 80,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Qatorda tushib qolgan sonni toping: 1, 2, 3, ?, 5",
        correctAnswer: "4",
        distractors: ["6", "7", "2"],
        explanation: "3 dan keyin va 5 dan oldin 4 soni keladi."
      },
      {
        text: "1 dan 10 gacha sonlar ichida eng kattasi qaysi?",
        correctAnswer: "10",
        distractors: ["9", "8", "5"],
        explanation: "1 dan 10 gacha bo‘lgan qatorda 10 eng katta sondir."
      },
      {
        text: "5 dan keyin qaysi son keladi?",
        correctAnswer: "6",
        distractors: ["4", "7", "8"],
        explanation: "5 dan keyingi son 6 dir."
      }
    ],
    test: [
      {
        text: "Quyidagi qatorda qaysi son tushib qolgan: 1, 2, ?, 4, 5?",
        correctAnswer: "3",
        distractors: ["6", "7", "0"],
        explanation: "2 dan keyin 3 soni keladi."
      },
      {
        text: "6 dan keyingi son qaysi?",
        correctAnswer: "7",
        distractors: ["5", "8", "9"],
        explanation: "6 ga 1 qo‘shilsa 7 bo‘ladi."
      },
      {
        text: "8 dan oldingi son qaysi?",
        correctAnswer: "7",
        distractors: ["9", "6", "5"],
        explanation: "8 dan oldin 7 soni turadi."
      },
      {
        text: "Qatorda tushib qolgan sonni toping: 6, 7, 8, ?, 10",
        correctAnswer: "9",
        distractors: ["5", "11", "7"],
        explanation: "8 va 10 orasida 9 soni joylashgan."
      },
      {
        text: "1 dan 10 gacha sonlar to‘g‘ri o‘sish tartibida yozilgan qatorni toping:",
        correctAnswer: "1, 2, 3, 4, 5, 6, 7, 8, 9, 10",
        distractors: ["1, 3, 2, 4, 5, 6, 7, 8, 9, 10", "10, 9, 8, 7, 6, 5, 4, 3, 2, 1", "2, 4, 6, 8, 1, 3, 5, 7, 9, 10"],
        explanation: "Sonlar 1 dan 10 gacha birma-bir o‘sib boradi."
      },
      {
        text: "4 sonidan 1 taga katta bo‘lgan son qaysi?",
        correctAnswer: "5",
        distractors: ["3", "6", "2"],
        explanation: "4 + 1 = 5."
      },
      {
        text: "7 sonidan 1 taga kichik bo‘lgan son qaysi?",
        correctAnswer: "6",
        distractors: ["8", "5", "9"],
        explanation: "7 − 1 = 6."
      },
      {
        text: "1 dan 10 gacha sonlar ichida eng kichik natural son qaysi?",
        correctAnswer: "1",
        distractors: ["0", "2", "3"],
        explanation: "1 — eng kichik natural son hisoblanadi."
      },
      {
        text: "Sanoq paytida 9 dan keyin qaysi son aytiladi?",
        correctAnswer: "10",
        distractors: ["8", "11", "7"],
        explanation: "9 dan keyin 10 soni keladi."
      },
      {
        text: "Qatorda tushib qolgan sonni toping: 3, 4, ?, 6, 7",
        correctAnswer: "5",
        distractors: ["2", "8", "9"],
        explanation: "4 va 6 orasidagi son 5 dir."
      },
      {
        text: "Qaysi son 2 dan katta, lekin 4 dan kichik?",
        correctAnswer: "3",
        distractors: ["1", "5", "6"],
        explanation: "2 va 4 orasida faqat 3 soni bor."
      },
      {
        text: "Qaysi son 7 dan katta, lekin 9 dan kichik?",
        correctAnswer: "8",
        distractors: ["6", "10", "5"],
        explanation: "7 va 9 orasida 8 soni joylashgan."
      },
      {
        text: "10 soni nechta raqam bilan yoziladi?",
        correctAnswer: "2 ta raqam (1 va 0)",
        distractors: ["1 ta raqam", "3 ta raqam", "Raqam bilan yozilmaydi"],
        explanation: "10 soni 1 va 0 raqamlaridan tuzilgan ikki xonali sondir."
      },
      {
        text: "9 soni bir xonali sonmi yoki ikki xonali?",
        correctAnswer: "Bir xonali son (bitta raqamdan iborat)",
        distractors: ["Ikki xonali son", "Uch xonali son", "Nol xonali"],
        explanation: "9 soni faqat bitta raqam bilan yoziladi."
      },
      {
        text: "Teskari tartibda sanalganda: 5, 4, 3, ?, 1. Qaysi son tushib qolgan?",
        correctAnswer: "2",
        distractors: ["6", "0", "7"],
        explanation: "Teskari sanoqda 3 dan keyin 2 keladi."
      },
      {
        text: "Daftarga 8 ta doiracha chizish kerak edi. Sobir 7 ta chizdi. Yana nechta chizishi kerak?",
        correctAnswer: "1 ta doiracha",
        distractors: ["2 ta", "3 ta", "Yetarli"],
        explanation: "8 bo‘lishi uchun 7 ga yana 1 ta yetmaydi (8 − 7 = 1)."
      },
      {
        text: "Qatorni to‘ldiring: 2, 4, 6, 8, ?",
        correctAnswer: "10",
        distractors: ["9", "7", "5"],
        explanation: "Sonlar ikkitalab o‘sib bormoqda: 8 + 2 = 10."
      },
      {
        text: "Gulshanning 10 ta qalami bor edi, 1 tasini singlisiga berdi. Unda nechta qalam qoldi?",
        correctAnswer: "9 ta qalam",
        distractors: ["8 ta", "10 ta", "7 ta"],
        explanation: "10 − 1 = 9 ta qalam qoladi."
      },
      {
        text: "Sinfda 10 ta parta bor. O‘qituvchi 1-partadan 5-partagacha bo‘lgan partalarni sanadi. Yana nechta parta qoldi?",
        correctAnswer: "5 ta parta",
        distractors: ["4 ta", "6 ta", "3 ta"],
        explanation: "10 − 5 = 5 ta parta qoladi."
      },
      {
        text: "Navbatda 10 kishi turibdi. Javohir eng oldinda, demak u nechanchi?",
        correctAnswer: "Birinchi (1-o‘rinda)",
        distractors: ["O‘ninchi (10-o‘rinda)", "Beshinchi (5-o‘rinda)", "Ikkinchi (2-o‘rinda)"],
        explanation: "Eng oldingi odam 1-o‘rinda turadi."
      }
    ]
  },

  // 10. Narsalar sanog‘i (qo‘shnilar)
  {
    bookNumber: 10,
    title: "Narsalar sanog‘i (qo‘shnilar)",
    emoji: "🐣",
    shortDesc: "Sondan oldingi va keyingi son, qo‘shni sonlar va teskari sanash.",
    intro: "Har bir sonning chap va o‘ng tomonida o‘z qo‘shni sonlari bo‘ladi.",
    keyPoints: [
      "Oldingi son berilgan sondan 1 taga kichik bo‘ladi.",
      "Keyingi son berilgan sondan 1 taga katta bo‘ladi.",
      "Masalan, 5 ning qo‘shnilari — 4 va 6 dir."
    ],
    miniExample: {
      emojis: "4️⃣ ⬅️ 5️⃣ ➡️ 6️⃣",
      text: "5 ning chap qo‘shnisi 4, o‘ng qo‘shnisi esa 6!"
    },
    xpReward: 80,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "4 sonining qo‘shnilari qaysilar?",
        correctAnswer: "3 va 5",
        distractors: ["2 va 6", "1 va 3", "4 va 5"],
        explanation: "4 dan oldin 3, keyin esa 5 keladi."
      },
      {
        text: "6 sonidan oldingi sonni toping.",
        correctAnswer: "5",
        distractors: ["7", "4", "8"],
        explanation: "6 dan oldin 5 turadi."
      },
      {
        text: "9 sonining keyingi qo‘shnisi qaysi?",
        correctAnswer: "10",
        distractors: ["8", "7", "11"],
        explanation: "9 dan keyin 10 keladi."
      }
    ],
    test: [
      {
        text: "3 sonining qo‘shni sonlarini toping:",
        correctAnswer: "2 va 4",
        distractors: ["1 va 5", "3 va 4", "2 va 5"],
        explanation: "3 ning chap qo‘shnisi 2, o‘ng qo‘shnisi 4 dir."
      },
      {
        text: "7 sonining qo‘shni sonlarini toping:",
        correctAnswer: "6 va 8",
        distractors: ["5 va 9", "7 va 8", "6 va 7"],
        explanation: "7 dan oldin 6, keyin 8 keladi."
      },
      {
        text: "2 sonidan oldingi son qaysi?",
        correctAnswer: "1",
        distractors: ["3", "0", "4"],
        explanation: "2 ning oldingi qo‘shnisi 1 dir."
      },
      {
        text: "8 sonining keyingi qo‘shnisi qaysi?",
        correctAnswer: "9",
        distractors: ["7", "10", "6"],
        explanation: "8 dan keyin 9 keladi."
      },
      {
        text: "Qaysi sonning qo‘shnilari 4 va 6 dir?",
        correctAnswer: "5",
        distractors: ["3", "7", "2"],
        explanation: "4 va 6 orasidagi son 5 dir."
      },
      {
        text: "Qaysi sonning qo‘shnilari 1 va 3 dir?",
        correctAnswer: "2",
        distractors: ["4", "0", "5"],
        explanation: "1 va 3 orasida 2 soni joylashgan."
      },
      {
        text: "Qaysi sonning qo‘shnilari 8 va 10 dir?",
        correctAnswer: "9",
        distractors: ["7", "6", "5"],
        explanation: "8 va 10 o‘rtasidagi son 9 dir."
      },
      {
        text: "5 sonining oldingi qo‘shnisi kim?",
        correctAnswer: "4",
        distractors: ["6", "3", "7"],
        explanation: "5 dan oldin 4 turadi."
      },
      {
        text: "6 sonining keyingi qo‘shnisi kim?",
        correctAnswer: "7",
        distractors: ["5", "8", "9"],
        explanation: "6 dan keyingi son 7 dir."
      },
      {
        text: "1 sonining natural sanoqdagi keyingi qo‘shnisi qaysi?",
        correctAnswer: "2",
        distractors: ["0", "3", "4"],
        explanation: "1 dan keyin 2 keladi."
      },
      {
        text: "Quyidagi juftliklardan qaysi biri 6 ning qo‘shnilari emas?",
        correctAnswer: "4 va 8 (ular qo‘shni emas)",
        distractors: ["5 va 7", "Besh va yetti", "5 hamda 7"],
        explanation: "6 ning haqiqiy qo‘shnilari 5 va 7 dir."
      },
      {
        text: "Teskari sanoqda: 10, 9, 8, 7, ... keyingi son nima bo‘ladi?",
        correctAnswer: "6",
        distractors: ["5", "8", "7"],
        explanation: "7 dan oldingi son 6 dir."
      },
      {
        text: "Teskari sanoqda: 6, 5, 4, 3, ... keyingi son nima bo‘ladi?",
        correctAnswer: "2",
        distractors: ["1", "5", "0"],
        explanation: "3 dan oldin 2 keladi."
      },
      {
        text: "Bir xonali sonlar ichida 9 ning o‘ng qo‘shnisi qaysi son?",
        correctAnswer: "10 (ikki xonali son)",
        distractors: ["8", "7", "11"],
        explanation: "9 dan keyin 10 keladi."
      },
      {
        text: "Qo‘shnilari 2 va 4 bo‘lgan son qaysi?",
        correctAnswer: "3",
        distractors: ["5", "1", "6"],
        explanation: "2 va 4 ning o‘rtasida 3 turadi."
      },
      {
        text: "Qo‘shnilari 7 va 9 bo‘lgan son qaysi?",
        correctAnswer: "8",
        distractors: ["6", "10", "5"],
        explanation: "7 va 9 ning o‘rtasida 8 turadi."
      },
      {
        text: "Uy raqamlari qatorda: 4-uy, 5-uy, 6-uy. 5-uyning qo‘shnilari qaysilar?",
        correctAnswer: "4-uy va 6-uy",
        distractors: ["3-uy va 7-uy", "1-uy va 2-uy", "Faqat 6-uy"],
        explanation: "5 ning qo‘shnilari 4 va 6 dir."
      },
      {
        text: "Sanobar 7 yoshda. Uning ukasi 1 yoshga kichik, opasi esa 1 yoshga katta. Ukasi va opasi necha yoshda?",
        correctAnswer: "Ukasi 6 yoshda, opasi 8 yoshda",
        distractors: ["Ukasi 5 yoshda, opasi 9 yoshda", "Ukasi 7 yoshda, opasi 7 yoshda", "Ukasi 8 yoshda, opasi 6 yoshda"],
        explanation: "7 ning qo‘shnilari 6 va 8 dir."
      },
      {
        text: "Avtobus 3-bekatdan o‘tdi. Undan oldingi va keyingi bekatlar qaysilar?",
        correctAnswer: "2-bekat va 4-bekat",
        distractors: ["1-bekat va 5-bekat", "3-bekat va 4-bekat", "4-bekat va 5-bekat"],
        explanation: "3 ning oldingi bekati 2, keyingisi 4 dir."
      },
      {
        text: "Temur poyezdning 5-vagonida ketmoqda. Uning vagoni qaysi vagonlar orasida joylashgan?",
        correctAnswer: "4-vagon va 6-vagon orasida",
        distractors: ["3-vagon va 7-vagon orasida", "1-vagon va 2-vagon orasida", "Faqat lokomotiv orqasida"],
        explanation: "5-vagon 4 va 6-vagonlar o‘rtasida bo‘ladi."
      }
    ]
  },

  // 11. Qo‘shish
  {
    bookNumber: 11,
    title: "Qo‘shish",
    emoji: "➕",
    shortDesc: "Qo‘shish ma’nosi (birlashtirish), yig‘indi, + belgisi va masalalar.",
    intro: "Qo‘shish — bu narsalarni bir joyga to‘plash, birlashtirish amali.",
    keyPoints: [
      "Qo‘shishda '+' (plyus) belgisi ishlatiladi.",
      "Natijada hosil bo‘lgan son yig‘indi deyiladi.",
      "Narsalar birlashtirilganda ularning soni ko‘payadi."
    ],
    miniExample: {
      emojis: "🍎🍎 + 🍎",
      text: "2 ta olmaga 1 ta olma qo‘shilsa, 3 ta olma bo‘ladi! (2 + 1 = 3)"
    },
    xpReward: 85,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Misolni hisoblang: 3 + 2 = ?",
        correctAnswer: "5",
        distractors: ["4", "6", "1"],
        explanation: "3 ga 2 qo‘shilsa 5 bo‘ladi."
      },
      {
        text: "Qo‘shish amali qaysi belgi bilan yoziladi?",
        correctAnswer: "+ (plyus)",
        distractors: ["− (minus)", "= (teng)", "> (katta)"],
        explanation: "Qo‘shish amali '+' belgisi bilan belgilanadi."
      },
      {
        text: "Bog‘da 4 ta lola va 2 ta chinnigul ochildi. Jami nechta gul ochilgan?",
        correctAnswer: "6 ta gul",
        distractors: ["5 ta", "7 ta", "2 ta"],
        explanation: "4 + 2 = 6 ta gul ochilgan."
      }
    ],
    test: [
      {
        text: "Misolni hisoblang: 2 + 1 = ?",
        correctAnswer: "3",
        distractors: ["2", "4", "1"],
        explanation: "2 ga 1 qo‘shilsa 3 bo‘ladi."
      },
      {
        text: "Misolni hisoblang: 3 + 3 = ?",
        correctAnswer: "6",
        distractors: ["5", "7", "4"],
        explanation: "3 ga 3 qo‘shilsa 6 bo‘ladi."
      },
      {
        text: "Misolni hisoblang: 4 + 1 = ?",
        correctAnswer: "5",
        distractors: ["3", "6", "4"],
        explanation: "4 ga 1 qo‘shilsa 5 bo‘ladi."
      },
      {
        text: "Misolni hisoblang: 5 + 2 = ?",
        correctAnswer: "7",
        distractors: ["6", "8", "9"],
        explanation: "5 ga 2 qo‘shilsa 7 bo‘ladi."
      },
      {
        text: "Misolni hisoblang: 6 + 2 = ?",
        correctAnswer: "8",
        distractors: ["7", "9", "5"],
        explanation: "6 ga 2 qo‘shilsa 8 bo‘ladi."
      },
      {
        text: "Misolni hisoblang: 7 + 1 = ?",
        correctAnswer: "8",
        distractors: ["6", "9", "10"],
        explanation: "7 ga 1 qo‘shilsa 8 bo‘ladi."
      },
      {
        text: "Misolni hisoblang: 4 + 4 = ?",
        correctAnswer: "8",
        distractors: ["7", "9", "6"],
        explanation: "4 ga 4 qo‘shilsa 8 bo‘ladi."
      },
      {
        text: "Misolni hisoblang: 5 + 4 = ?",
        correctAnswer: "9",
        distractors: ["8", "10", "7"],
        explanation: "5 ga 4 qo‘shilsa 9 bo‘ladi."
      },
      {
        text: "Misolni hisoblang: 8 + 2 = ?",
        correctAnswer: "10",
        distractors: ["9", "7", "6"],
        explanation: "8 ga 2 qo‘shilsa 10 bo‘ladi."
      },
      {
        text: "Misolni hisoblang: 6 + 3 = ?",
        correctAnswer: "9",
        distractors: ["8", "10", "7"],
        explanation: "6 ga 3 qo‘shilsa 9 bo‘ladi."
      },
      {
        text: "Misolni hisoblang: 7 + 3 = ?",
        correctAnswer: "10",
        distractors: ["9", "8", "6"],
        explanation: "7 ga 3 qo‘shilsa 10 bo‘ladi."
      },
      {
        text: "Qaysi ifodaning qiymati 6 ga teng?",
        correctAnswer: "4 + 2",
        distractors: ["3 + 2", "5 + 2", "6 + 1"],
        explanation: "4 + 2 = 6."
      },
      {
        text: "Qaysi ifodaning qiymati 7 ga teng?",
        correctAnswer: "5 + 2",
        distractors: ["4 + 2", "6 + 2", "3 + 3"],
        explanation: "5 + 2 = 7."
      },
      {
        text: "Qaysi ifodaning qiymati 10 ga teng?",
        correctAnswer: "5 + 5",
        distractors: ["4 + 5", "6 + 3", "7 + 2"],
        explanation: "5 + 5 = 10."
      },
      {
        text: "Narsalar birlashtirilganda qaysi amal bajariladi?",
        correctAnswer: "Qo‘shish amali (+)",
        distractors: ["Ayirish amali (−)", "Bo‘lish amali", "Taqqoslash amali faqat"],
        explanation: "Birlashtirish va ko‘paytirish ma’nosida qo‘shish amali bajariladi."
      },
      {
        text: "Qo‘shish natijasi nima deb ataladi?",
        correctAnswer: "Yig‘indi",
        distractors: ["Ayirma", "Qo‘shiluvchi", "Qoldiq"],
        explanation: "Qo‘shish amali natijasi yig‘indi deyiladi."
      },
      {
        text: "Akmalda 3 ta daftar bor edi. Dadasi yana 2 ta daftar olib berdi. Daftarlar nechta bo‘ldi?",
        correctAnswer: "5 ta daftar",
        distractors: ["4 ta", "6 ta", "1 ta"],
        explanation: "3 + 2 = 5 ta daftar."
      },
      {
        text: "Daraxtda 4 ta chumchuq o‘tirgan edi. Yana 3 ta chumchuq uchib keldi. Chumchuqlar nechta bo‘ldi?",
        correctAnswer: "7 ta chumchuq",
        distractors: ["6 ta", "8 ta", "5 ta"],
        explanation: "4 + 3 = 7 ta chumchuq."
      },
      {
        text: "Nodirada 5 ta qizil va 3 ta yashil qalam bor. Unda jami nechta qalam bor?",
        correctAnswer: "8 ta qalam",
        distractors: ["7 ta", "9 ta", "2 ta"],
        explanation: "5 + 3 = 8 ta qalam."
      },
      {
        text: "Samir 6 ta misol yechdi, so‘ng yana 4 ta misol yechdi. U jami nechta misol yechdi?",
        correctAnswer: "10 ta misol",
        distractors: ["9 ta", "8 ta", "2 ta"],
        explanation: "6 + 4 = 10 ta misol."
      }
    ]
  },

  // 12. Ayirish
  {
    bookNumber: 12,
    title: "Ayirish",
    emoji: "➖",
    shortDesc: "Ayirish ma’nosi (olib tashlash), ayirma, − belgisi va masalalar.",
    intro: "Ayirish — bu guruhdan bir qismini olib tashlash, kamaytirish amali.",
    keyPoints: [
      "Ayirishda '−' (minus) belgisi ishlatiladi.",
      "Natijada hosil bo‘lgan son ayirma deyiladi.",
      "Narsalar olinganda yoki ketganda ularning soni kamayadi."
    ],
    miniExample: {
      emojis: "🍎🍎🍎 − 🍎",
      text: "3 ta olmadan 1 tasini yesak, 2 ta olma qoladi! (3 − 1 = 2)"
    },
    xpReward: 85,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Misolni hisoblang: 5 − 2 = ?",
        correctAnswer: "3",
        distractors: ["4", "2", "7"],
        explanation: "5 dan 2 ayirilsa 3 qoladi."
      },
      {
        text: "Ayirish amali qaysi belgi bilan yoziladi?",
        correctAnswer: "− (minus)",
        distractors: ["+ (plyus)", "= (teng)", "× (ko‘paytirish)"],
        explanation: "Ayirish amali '−' belgisi bilan belgilanadi."
      },
      {
        text: "Likopchada 4 ta olma bor edi, 1 tasi yeyildi. Nechta qoldi?",
        correctAnswer: "3 ta",
        distractors: ["2 ta", "4 ta", "5 ta"],
        explanation: "4 − 1 = 3 ta olma qoladi."
      }
    ],
    test: [
      {
        text: "Misolni hisoblang: 3 − 1 = ?",
        correctAnswer: "2",
        distractors: ["1", "3", "4"],
        explanation: "3 − 1 = 2."
      },
      {
        text: "Misolni hisoblang: 4 − 2 = ?",
        correctAnswer: "2",
        distractors: ["1", "3", "6"],
        explanation: "4 − 2 = 2."
      },
      {
        text: "Misolni hisoblang: 5 − 1 = ?",
        correctAnswer: "4",
        distractors: ["3", "5", "6"],
        explanation: "5 − 1 = 4."
      },
      {
        text: "Misolni hisoblang: 6 − 3 = ?",
        correctAnswer: "3",
        distractors: ["2", "4", "9"],
        explanation: "6 − 3 = 3."
      },
      {
        text: "Misolni hisoblang: 7 − 2 = ?",
        correctAnswer: "5",
        distractors: ["4", "6", "9"],
        explanation: "7 − 2 = 5."
      },
      {
        text: "Misolni hisoblang: 8 − 3 = ?",
        correctAnswer: "5",
        distractors: ["4", "6", "7"],
        explanation: "8 − 3 = 5."
      },
      {
        text: "Misolni hisoblang: 9 − 4 = ?",
        correctAnswer: "5",
        distractors: ["4", "6", "3"],
        explanation: "9 − 4 = 5."
      },
      {
        text: "Misolni hisoblang: 10 − 2 = ?",
        correctAnswer: "8",
        distractors: ["7", "9", "6"],
        explanation: "10 − 2 = 8."
      },
      {
        text: "Misolni hisoblang: 8 − 4 = ?",
        correctAnswer: "4",
        distractors: ["3", "5", "2"],
        explanation: "8 − 4 = 4."
      },
      {
        text: "Misolni hisoblang: 10 − 5 = ?",
        correctAnswer: "5",
        distractors: ["4", "6", "7"],
        explanation: "10 − 5 = 5."
      },
      {
        text: "Misolni hisoblang: 9 − 2 = ?",
        correctAnswer: "7",
        distractors: ["6", "8", "5"],
        explanation: "9 − 2 = 7."
      },
      {
        text: "Misolni hisoblang: 7 − 4 = ?",
        correctAnswer: "3",
        distractors: ["2", "4", "5"],
        explanation: "7 − 4 = 3."
      },
      {
        text: "Qaysi ifodaning qiymati 4 ga teng?",
        correctAnswer: "6 − 2",
        distractors: ["7 − 2", "5 − 2", "8 − 3"],
        explanation: "6 − 2 = 4."
      },
      {
        text: "Qaysi ifodaning qiymati 6 ga teng?",
        correctAnswer: "8 − 2",
        distractors: ["9 − 2", "7 − 2", "10 − 3"],
        explanation: "8 − 2 = 6."
      },
      {
        text: "Ayirish natijasi nima deb ataladi?",
        correctAnswer: "Ayirma",
        distractors: ["Yig‘indi", "Qo‘shiluvchi", "Ko‘paytma"],
        explanation: "Ayirish amali natijasiga ayirma deyiladi."
      },
      {
        text: "Narsalar guruhidan bir qismi olib tashlansa, qaysi amal bajariladi?",
        correctAnswer: "Ayirish amali (−)",
        distractors: ["Qo‘shish amali (+)", "Taqqoslash amali faqat", "Hech qanday amal"],
        explanation: "Olib tashlash yoki kamaytirishda ayirish amali qo‘llanadi."
      },
      {
        text: "Stol ustida 6 ta shaftoli bor edi. Bolalar 2 tasini yeyishdi. Nechta shaftoli qoldi?",
        correctAnswer: "4 ta shaftoli",
        distractors: ["3 ta", "5 ta", "8 ta"],
        explanation: "6 − 2 = 4 ta shaftoli qoladi."
      },
      {
        text: "Simda 7 ta qaldirg‘och o‘tirgan edi. 3 tasi uchib ketdi. Nechta qaldirg‘och qoldi?",
        correctAnswer: "4 ta qaldirg‘och",
        distractors: ["3 ta", "5 ta", "10 ta"],
        explanation: "7 − 3 = 4 ta qaldirg‘och qoladi."
      },
      {
        text: "Savatchada 9 ta tuxum bor edi. 2 tasi ishlatildi. Nechta tuxum qoldi?",
        correctAnswer: "7 ta tuxum",
        distractors: ["6 ta", "8 ta", "5 ta"],
        explanation: "9 − 2 = 7 ta tuxum."
      },
      {
        text: "Avtobusda 10 ta yo‘lovchi bor edi. Bekatda 3 kishi tushdi. Avtobusda nechta yo‘lovchi qoldi?",
        correctAnswer: "7 ta yo‘lovchi",
        distractors: ["6 ta", "8 ta", "5 ta"],
        explanation: "10 − 3 = 7 ta yo‘lovchi qoladi."
      }
    ]
  },

  // 13. Sonlarni taqqoslash
  {
    bookNumber: 13,
    title: "Sonlarni taqqoslash",
    emoji: "🔍",
    shortDesc: ">, <, = belgilari, katta va kichik son, tartiblash.",
    intro: "Sonlarni taqqoslashda 'katta' (>), 'kichik' (<) va 'teng' (=) belgilaridan foydalanamiz.",
    keyPoints: [
      "Katta son tomon belgining ochiq tomoni qaraydi: 5 > 3.",
      "Kichik son tomon belgining uchi (burchagi) qaraydi: 2 < 4.",
      "Sonlar bir xil bo‘lsa, tenglik (=) belgisi qo‘yiladi: 6 = 6."
    ],
    miniExample: {
      emojis: "5️⃣ > 3️⃣ va 2️⃣ < 4️⃣",
      text: "5 katta 3 dan, 2 kichik 4 dan!"
    },
    xpReward: 85,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Nuqtalar o‘rniga to‘g‘ri belgini qo‘ying: 6 ... 4",
        correctAnswer: "> (katta)",
        distractors: ["< (kichik)", "= (teng)", "+ (qo‘shuv)"],
        explanation: "6 soni 4 dan katta, shuning uchun '>' belgisi qo‘yiladi."
      },
      {
        text: "Nuqtalar o‘rniga to‘g‘ri belgini qo‘ying: 3 ... 7",
        correctAnswer: "< (kichik)",
        distractors: ["> (katta)", "= (teng)", "− (ayiruv)"],
        explanation: "3 soni 7 dan kichik, shuning uchun '<' belgisi qo‘yiladi."
      },
      {
        text: "Nuqtalar o‘rniga to‘g‘ri belgini qo‘ying: 5 ... 5",
        correctAnswer: "= (teng)",
        distractors: ["> (katta)", "< (kichik)", "+ (qo‘shuv)"],
        explanation: "Ikkala son bir xil bo‘lgani uchun '=' belgisi qo‘yiladi."
      }
    ],
    test: [
      {
        text: "Taqqoslang: 7 ... 5. Qaysi belgi to‘g‘ri?",
        correctAnswer: ">",
        distractors: ["<", "=", "+"],
        explanation: "7 soni 5 dan katta (7 > 5)."
      },
      {
        text: "Taqqoslang: 2 ... 8. Qaysi belgi to‘g‘ri?",
        correctAnswer: "<",
        distractors: [">", "=", "−"],
        explanation: "2 soni 8 dan kichik (2 < 8)."
      },
      {
        text: "Taqqoslang: 9 ... 9. Qaysi belgi to‘g‘ri?",
        correctAnswer: "=",
        distractors: [">", "<", "+"],
        explanation: "Ikkala son teng (9 = 9)."
      },
      {
        text: "Taqqoslang: 10 ... 8. Qaysi belgi to‘g‘ri?",
        correctAnswer: ">",
        distractors: ["<", "=", "−"],
        explanation: "10 soni 8 dan katta (10 > 8)."
      },
      {
        text: "Taqqoslang: 4 ... 6. Qaysi belgi to‘g‘ri?",
        correctAnswer: "<",
        distractors: [">", "=", "+"],
        explanation: "4 soni 6 dan kichik (4 < 6)."
      },
      {
        text: "Taqqoslang: 3 ... 1. Qaysi belgi to‘g‘ri?",
        correctAnswer: ">",
        distractors: ["<", "=", "−"],
        explanation: "3 soni 1 dan katta (3 > 1)."
      },
      {
        text: "Taqqoslang: 1 ... 10. Qaysi belgi to‘g‘ri?",
        correctAnswer: "<",
        distractors: [">", "=", "+"],
        explanation: "1 soni 10 dan ancha kichik (1 < 10)."
      },
      {
        text: "Quyidagi kattalik (>) tengsizliklaridan qaysi biri to‘g‘ri?",
        correctAnswer: "8 > 3",
        distractors: ["2 > 5", "4 > 7", "1 > 6"],
        explanation: "Faqat 8 > 3 tengsizligi to‘g‘ri."
      },
      {
        text: "Quyidagi kichiklik (<) tengsizliklaridan qaysi biri to‘g‘ri?",
        correctAnswer: "3 < 9",
        distractors: ["7 < 4", "8 < 2", "6 < 1"],
        explanation: "3 soni 9 dan kichik (3 < 9)."
      },
      {
        text: "To‘g‘ri tenglikni toping:",
        correctAnswer: "7 = 7",
        distractors: ["7 = 6", "7 = 8", "7 = 5"],
        explanation: "Faqat 7 = 7 tengligi to‘g‘ri."
      },
      {
        text: "Quyidagi sonlardan qaysi biri 5 dan katta?",
        correctAnswer: "8",
        distractors: ["2", "4", "3"],
        explanation: "8 soni 5 dan katta."
      },
      {
        text: "Quyidagi sonlardan qaysi biri 6 dan kichik?",
        correctAnswer: "4",
        distractors: ["7", "8", "9"],
        explanation: "4 soni 6 dan kichik."
      },
      {
        text: "1, 4, 7, 2 sonlari ichida eng kattasi qaysi?",
        correctAnswer: "7",
        distractors: ["4", "2", "1"],
        explanation: "Ushbu sonlar ichida 7 eng kattasidir."
      },
      {
        text: "3, 8, 2, 9 sonlari ichida eng kichigi qaysi?",
        correctAnswer: "2",
        distractors: ["3", "8", "9"],
        explanation: "Ushbu sonlar ichida 2 eng kichigidir."
      },
      {
        text: "Sonlarni o‘sish tartibida to‘g‘ri joylashtiring:",
        correctAnswer: "2, 5, 8",
        distractors: ["8, 5, 2", "5, 2, 8", "2, 8, 5"],
        explanation: "Kichigidan kattasiga: 2, 5, 8."
      },
      {
        text: "Sonlarni kamayish tartibida to‘g‘ri joylashtiring:",
        correctAnswer: "9, 6, 3",
        distractors: ["3, 6, 9", "6, 9, 3", "9, 3, 6"],
        explanation: "Kattasidan kichigiga: 9, 6, 3."
      },
      {
        text: "Anvarda 6 ta daftar, Sobirda 4 ta daftar bor. Kimning daftari ko‘p?",
        correctAnswer: "Anvarda ko‘p (6 > 4)",
        distractors: ["Sobirda ko‘p", "Ikkalasida teng", "Anvarda kam"],
        explanation: "6 > 4 bo‘lgani uchun Anvarda ko‘p."
      },
      {
        text: "Guldastada 5 ta qizil va 8 ta oq gul bor. Qaysi gullar kam?",
        correctAnswer: "Qizil gullar kam (5 < 8)",
        distractors: ["Oq gullar kam", "Gullar teng", "Qizil gullar ko‘p"],
        explanation: "5 < 8 bo‘lgani sababli qizil gullar kam."
      },
      {
        text: "Birinchi savatda 7 ta, ikkinchi savatda ham 7 ta olma bor. Savatlar haqida nima deymiz?",
        correctAnswer: "Savatlardagi olmalar soni teng (7 = 7)",
        distractors: ["1-savatda ko‘p", "2-savatda ko‘p", "Taqqoslab bo‘lmaydi"],
        explanation: "7 = 7, savatlardagi olmalar soni teng."
      },
      {
        text: "Toshkentda havo harorati 9 daraja, Samarqandda esa 7 daraja bo‘ldi. Qayerda havo iliqroq?",
        correctAnswer: "Toshkentda (9 > 7)",
        distractors: ["Samarqandda", "Ikkala shaharda bir xil", "Toshkentda sovuqroq"],
        explanation: "9 daraja 7 darajadan yuqori (issiqroq)."
      }
    ]
  },

  // 14. 1 soni va raqami
  {
    bookNumber: 14,
    title: "1 soni va raqami",
    emoji: "1️⃣",
    shortDesc: "1 raqamini tanish, sanash, 1 ning tarkibi va qo‘shnilari.",
    intro: "1 soni — bitta narsani bildiradi va natural sanoq boshidir.",
    keyPoints: [
      "Bitta quyosh ☀️, bitta oy 🌙 — 1 soniga misol.",
      "1 raqami katakning o‘rtasidan boshlab chiziladi.",
      "1 ning o‘ng qo‘shnisi 2 sonidir."
    ],
    miniExample: {
      emojis: "☀️ 1️⃣",
      text: "Osmonda bitta quyosh bor — bu 1 soni!"
    },
    xpReward: 80,
    coinReward: 10,
    estMinutes: 5,
    practice: [
      {
        text: "Quyidagilardan qaysi biri 1 dona narsani bildiradi?",
        correctAnswer: "Bitta qalam ✏️",
        distractors: ["Ikkita olma 🍎🍎", "Uchta koptok ⚽⚽⚽", "To‘rtta gul 🌸🌸🌸🌸"],
        explanation: "Bitta qalam 1 soniga mos keladi."
      },
      {
        text: "1 raqamidan keyin qaysi raqam keladi?",
        correctAnswer: "2",
        distractors: ["0", "3", "4"],
        explanation: "1 dan keyin 2 keladi."
      },
      {
        text: "Inson tanasida bitta bo‘lgan a’zoni toping:",
        correctAnswer: "Burun 👃",
        distractors: ["Ko‘z 👀", "Quloq 👂", "Qo‘l ✋"],
        explanation: "Insonning burni bitta bo‘ladi, ko‘z va quloqlar esa ikkitadan."
      }
    ],
    test: [
      {
        text: "1 soni nechta narsani bildiradi?",
        correctAnswer: "Bitta narsani",
        distractors: ["Ikkita narsani", "Uchta narsani", "Hech narsani emas"],
        explanation: "1 soni bitta dona narsani bildiradi."
      },
      {
        text: "Osmonda nechta quyosh bor?",
        correctAnswer: "1 ta ☀️",
        distractors: ["2 ta", "3 ta", "Ko‘p"],
        explanation: "Yerimiz uchun bitta quyosh porlaydi."
      },
      {
        text: "Qaysi belgi 1 raqamini bildiradi?",
        correctAnswer: "1",
        distractors: ["2", "7", "4"],
        explanation: "'1' — bir raqamining yozilish shaklidir."
      },
      {
        text: "1 soniga 0 qo‘shilsa necha bo‘ladi: 1 + 0 = ?",
        correctAnswer: "1",
        distractors: ["0", "2", "10"],
        explanation: "Har qanday songa 0 qo‘shilsa, sonning o‘zi chiqadi."
      },
      {
        text: "1 sonidan 1 ayirilsa necha qoladi: 1 − 1 = ?",
        correctAnswer: "0",
        distractors: ["1", "2", "yo‘q"],
        explanation: "1 dan 1 ayirilsa 0 qoladi."
      },
      {
        text: "1 ning o‘ng qo‘shnisi (keyingi son) qaysi?",
        correctAnswer: "2",
        distractors: ["0", "3", "4"],
        explanation: "1 dan keyingi son 2 dir."
      },
      {
        text: "O‘zbekiston Respublikasining poytaxti nechta?",
        correctAnswer: "1 ta (Toshkent shahri) 🏙️",
        distractors: ["2 ta", "3 ta", "12 ta"],
        explanation: "Har bir davlatning bitta poytaxti bo‘ladi, bizda bu — Toshkent."
      },
      {
        text: "Insonning nechta yuragi bo‘ladi?",
        correctAnswer: "1 ta ❤️",
        distractors: ["2 ta", "3 ta", "4 ta"],
        explanation: "Inson tanasida 1 ta yurak urib turadi."
      },
      {
        text: "Quyidagi ifodalardan qaysi birining qiymati 1 ga teng?",
        correctAnswer: "2 − 1",
        distractors: ["1 + 1", "3 − 1", "0 + 0"],
        explanation: "2 − 1 = 1."
      },
      {
        text: "1 soni natural sonlar qatorida nechanchi o‘rinda turadi?",
        correctAnswer: "Birinchi o‘rinda",
        distractors: ["Ikkinchi o‘rinda", "Oxirgi o‘rinda", "O‘rtada"],
        explanation: "Natural sonlar 1 dan boshlanadi."
      },
      {
        text: "1 soni 2 sonidan kattami yoki kichik?",
        correctAnswer: "Kichik (1 < 2)",
        distractors: ["Katta (1 > 2)", "Teng", "Bir xil"],
        explanation: "1 soni 2 dan 1 taga kichikdir."
      },
      {
        text: "Bir haftada nechta dushanba kuni bor?",
        correctAnswer: "1 ta",
        distractors: ["2 ta", "7 ta", "5 ta"],
        explanation: "Har bir haftada bitta dushanba kuni bo‘ladi."
      },
      {
        text: "Qaysi qush faqat bitta shoxda o‘tiribdi: 🦜?",
        correctAnswer: "1 ta to‘tiqush",
        distractors: ["2 ta to‘tiqush", "3 ta to‘tiqush", "0 ta"],
        explanation: "Bu yerda bitta to‘tiqush ko‘rsatilgan."
      },
      {
        text: "Bir xonali eng kichik natural son qaysi?",
        correctAnswer: "1",
        distractors: ["0", "2", "9"],
        explanation: "0 natural son emas, eng kichik natural son 1 dir."
      },
      {
        text: "Sinf xonasida o‘qituvchi stoli odatda nechta bo‘ladi?",
        correctAnswer: "1 ta",
        distractors: ["5 ta", "10 ta", "20 ta"],
        explanation: "Sinfda o‘qituvchi uchun bitta asosiy stol bo‘ladi."
      },
      {
        text: "1 soni toq sonmi yoki juft son?",
        correctAnswer: "Toq son",
        distractors: ["Juft son", "Ikkalasi ham", "Nol son"],
        explanation: "1 soni toq sonlar qatoriga kiradi."
      },
      {
        text: "Alisher 1 ta daftar sotib oldi. U nechta daftar oldi?",
        correctAnswer: "1 ta",
        distractors: ["2 ta", "3 ta", "0 ta"],
        explanation: "Masala shartida 1 ta daftar aytilgan."
      },
      {
        text: "To‘g‘ri taqqoslashni toping:",
        correctAnswer: "1 < 3",
        distractors: ["1 > 3", "1 = 3", "1 > 5"],
        explanation: "1 soni 3 dan kichik (1 < 3)."
      },
      {
        text: "Katak daftarda 1 raqami nechanchi katakchaga sig‘adi?",
        correctAnswer: "Bitta katak ichiga",
        distractors: ["To‘rtta katakka", "O‘nta katakka", "Daftarning yarmiga"],
        explanation: "Har bir raqam chiroyli qilib bitta katak ichiga yoziladi."
      },
      {
        text: "Dilshod 1 ta savolga to‘g‘ri javob berdi. U nechta to‘g‘ri javob topdi?",
        correctAnswer: "1 ta to‘g‘ri javob",
        distractors: ["2 ta", "0 ta", "5 ta"],
        explanation: "U 1 ta savolni to‘g‘ri yechgan."
      }
    ]
  },

  // 15. 2 soni va raqami
  {
    bookNumber: 15,
    title: "2 soni va raqami",
    emoji: "2️⃣",
    shortDesc: "2 raqami, sanash, tarkibi (1 + 1), juftlik va qo‘shnilari.",
    intro: "2 soni — bir juft narsani bildiradi, uning tarkibi 1 va 1 dir.",
    keyPoints: [
      "Ikkita narsa juftlik hosil qiladi: 2 ta qo‘l, 2 ta ko‘z.",
      "2 soni 1 va 1 ning yig‘indisidan iborat (1 + 1 = 2).",
      "2 ning qo‘shnilari 1 va 3 sonlaridir."
    ],
    miniExample: {
      emojis: "👁️ 👁️ = 2️⃣",
      text: "Bizda ikkita ko‘z bor: 1 + 1 = 2!"
    },
    xpReward: 80,
    coinReward: 10,
    estMinutes: 5,
    practice: [
      {
        text: "Misolni hisoblang: 1 + 1 = ?",
        correctAnswer: "2",
        distractors: ["1", "3", "4"],
        explanation: "1 ga 1 qo‘shilsa 2 bo‘ladi."
      },
      {
        text: "Inson tanasida ikkita bo‘lgan a’zoni toping:",
        correctAnswer: "Quloqlar 👂👂",
        distractors: ["Burun 👃", "Og‘iz 👄", "Bosh 👤"],
        explanation: "Bizda 2 ta quloq va 2 ta ko‘z bor."
      },
      {
        text: "2 sonining qo‘shnilari qaysilar?",
        correctAnswer: "1 va 3",
        distractors: ["0 va 4", "2 va 3", "3 va 4"],
        explanation: "2 ning oldida 1, orqasida 3 turadi."
      }
    ],
    test: [
      {
        text: "Quyidagilardan qaysi biri 2 raqamini bildiradi?",
        correctAnswer: "2",
        distractors: ["1", "3", "5"],
        explanation: "'2' — ikki raqami."
      },
      {
        text: "Misolni hisoblang: 1 + 1 = ?",
        correctAnswer: "2",
        distractors: ["1", "3", "0"],
        explanation: "1 + 1 = 2."
      },
      {
        text: "Misolni hisoblang: 2 − 1 = ?",
        correctAnswer: "1",
        distractors: ["0", "2", "3"],
        explanation: "2 dan 1 ayirilsa 1 qoladi."
      },
      {
        text: "Misolni hisoblang: 2 − 2 = ?",
        correctAnswer: "0",
        distractors: ["1", "2", "4"],
        explanation: "Sonning o‘zidan o‘zi ayirilsa 0 bo‘ladi."
      },
      {
        text: "Qushning nechta qanoti bor?",
        correctAnswer: "2 ta qanoti 🪽🪽",
        distractors: ["1 ta", "3 ta", "4 ta"],
        explanation: "Qushlar 2 ta qanoti bilan osmonda uchadi."
      },
      {
        text: "Bitta poyabzal juftida nechta poyabzal bo‘ladi?",
        correctAnswer: "2 ta (o‘ng va chap oyoq uchun) 👟👟",
        distractors: ["1 ta", "3 ta", "4 ta"],
        explanation: "Poyabzal juft bo‘lib, 2 donadan iborat."
      },
      {
        text: "2 sonining tarkibi qanday?",
        correctAnswer: "1 va 1",
        distractors: ["2 va 1", "0 va 0", "1 va 2"],
        explanation: "2 soni 1 va 1 dan tashkil topgan."
      },
      {
        text: "2 soni juft sonmi yoki toq son?",
        correctAnswer: "Juft son (eng kichik musbat juft son)",
        distractors: ["Toq son", "Nol son", "Manfiy son"],
        explanation: "2 soni birinchi juft natural sondir."
      },
      {
        text: "2 sonining keyingi qo‘shnisi qaysi?",
        correctAnswer: "3",
        distractors: ["1", "4", "5"],
        explanation: "2 dan keyin 3 keladi."
      },
      {
        text: "2 sonining oldingi qo‘shnisi qaysi?",
        correctAnswer: "1",
        distractors: ["0", "3", "4"],
        explanation: "2 dan oldin 1 turadi."
      },
      {
        text: "Qaysi ifodaning qiymati 2 ga teng?",
        correctAnswer: "3 − 1",
        distractors: ["4 − 1", "2 + 1", "1 + 0"],
        explanation: "3 − 1 = 2."
      },
      {
        text: "Velosipedda nechta g‘ildirak bor?",
        correctAnswer: "2 ta 🚲",
        distractors: ["1 ta", "3 ta", "4 ta"],
        explanation: "Oddiy velosiped 2 g‘ildirakli bo‘ladi."
      },
      {
        text: "Taqqoslang: 2 ... 1. Qaysi belgi to‘g‘ri?",
        correctAnswer: ">",
        distractors: ["<", "=", "+"],
        explanation: "2 soni 1 dan katta (2 > 1)."
      },
      {
        text: "Taqqoslang: 2 ... 3. Qaysi belgi to‘g‘ri?",
        correctAnswer: "<",
        distractors: [">", "=", "−"],
        explanation: "2 soni 3 dan kichik (2 < 3)."
      },
      {
        text: "2 ta olmaga yana hech narsa qo‘shilmasa (0 qo‘shilsa), nechta bo‘ladi?",
        correctAnswer: "2 ta bo‘lib qoladi",
        distractors: ["0 ta", "3 ta", "1 ta"],
        explanation: "2 + 0 = 2."
      },
      {
        text: "Azizning 1 ta ruchkasi bor edi, unga yana 1 ta sovg‘a qilishdi. Ruchkalari nechta bo‘ldi?",
        correctAnswer: "2 ta ruchka",
        distractors: ["1 ta", "3 ta", "0 ta"],
        explanation: "1 + 1 = 2 ta ruchka."
      },
      {
        text: "Ko‘lmakda 2 ta o‘rdak suzib yurgan edi, 1 tasi qirg‘oqqa chiqdi. Ko‘lmakda nechta o‘rdak qoldi?",
        correctAnswer: "1 ta o‘rdak",
        distractors: ["2 ta", "0 ta", "3 ta"],
        explanation: "2 − 1 = 1 ta o‘rdak."
      },
      {
        text: "2 ta qo‘lda nechta bosh barmog‘imiz bor?",
        correctAnswer: "2 ta bosh barmoq 👍👍",
        distractors: ["1 ta", "5 ta", "10 ta"],
        explanation: "Har bir qo‘lda bittadan, jami 2 ta bosh barmoq bor."
      },
      {
        text: "To‘g‘ri tenglikni toping:",
        correctAnswer: "1 + 1 = 2",
        distractors: ["1 + 1 = 3", "2 − 1 = 2", "2 + 1 = 2"],
        explanation: "1 + 1 = 2 to‘g‘ri tenglikdir."
      },
      {
        text: "Kechki payt Malika 2 ta ertak tingladi va uxlab qoldi. U nechta ertak eshitdi?",
        correctAnswer: "2 ta ertak",
        distractors: ["1 ta", "3 ta", "4 ta"],
        explanation: "Malika 2 ta ertak tinglagan."
      }
    ]
  },

  // 16. 3 soni va raqami
  {
    bookNumber: 16,
    title: "3 soni va raqami",
    emoji: "3️⃣",
    shortDesc: "3 raqami, sanash, tarkibi (1 + 2), svetofor va qo‘shnilari.",
    intro: "3 soni — uchta narsani bildiradi, uning tarkibi 1 va 2 dir.",
    keyPoints: [
      "Svetoforda 3 ta rangli chiroq bor: qizil, sariq, yashil.",
      "Uchburchakning 3 ta tomoni va 3 ta burchagi bo‘ladi.",
      "3 ning qo‘shnilari 2 va 4 sonlaridir."
    ],
    miniExample: {
      emojis: "🔺 3️⃣",
      text: "Uchburchakda 3 ta tomon bor: 1 + 2 = 3!"
    },
    xpReward: 80,
    coinReward: 10,
    estMinutes: 5,
    practice: [
      {
        text: "Misolni hisoblang: 2 + 1 = ?",
        correctAnswer: "3",
        distractors: ["2", "4", "5"],
        explanation: "2 ga 1 qo‘shilsa 3 bo‘ladi."
      },
      {
        text: "Svetoforda nechta chiroq bor?",
        correctAnswer: "3 ta 🚦",
        distractors: ["2 ta", "4 ta", "1 ta"],
        explanation: "Svetoforda 3 ta rang bor."
      },
      {
        text: "3 sonining qo‘shnilari qaysilar?",
        correctAnswer: "2 va 4",
        distractors: ["1 va 5", "3 va 4", "0 va 3"],
        explanation: "3 ning oldida 2, keyin 4 keladi."
      }
    ],
    test: [
      {
        text: "Quyidagilardan qaysi biri 3 raqamini bildiradi?",
        correctAnswer: "3",
        distractors: ["2", "8", "5"],
        explanation: "'3' — uch raqamidir."
      },
      {
        text: "Misolni hisoblang: 1 + 2 = ?",
        correctAnswer: "3",
        distractors: ["2", "4", "5"],
        explanation: "1 + 2 = 3."
      },
      {
        text: "Misolni hisoblang: 3 − 1 = ?",
        correctAnswer: "2",
        distractors: ["1", "3", "0"],
        explanation: "3 − 1 = 2."
      },
      {
        text: "Misolni hisoblang: 3 − 2 = ?",
        correctAnswer: "1",
        distractors: ["2", "0", "4"],
        explanation: "3 − 2 = 1."
      },
      {
        text: "Misolni hisoblang: 3 − 3 = ?",
        correctAnswer: "0",
        distractors: ["1", "2", "3"],
        explanation: "3 − 3 = 0."
      },
      {
        text: "Uchburchakning nechta uchi bor?",
        correctAnswer: "3 ta uchi 🔺",
        distractors: ["2 ta", "4 ta", "0 ta"],
        explanation: "Uchburchak 3 ta uch va burchakka ega."
      },
      {
        text: "3 sonining tarkibi qanday bo‘lishi mumkin?",
        correctAnswer: "1 va 2 (yoki 2 va 1)",
        distractors: ["2 va 2", "3 va 1", "0 va 2"],
        explanation: "1 + 2 = 3."
      },
      {
        text: "3 sonining oldingi qo‘shnisi qaysi?",
        correctAnswer: "2",
        distractors: ["1", "4", "0"],
        explanation: "3 dan oldin 2 turadi."
      },
      {
        text: "3 sonining keyingi qo‘shnisi qaysi?",
        correctAnswer: "4",
        distractors: ["2", "5", "6"],
        explanation: "3 dan keyin 4 keladi."
      },
      {
        text: "Taqqoslang: 3 ... 2. Qaysi belgi to‘g‘ri?",
        correctAnswer: ">",
        distractors: ["<", "=", "+"],
        explanation: "3 soni 2 dan katta (3 > 2)."
      },
      {
        text: "Taqqoslang: 3 ... 4. Qaysi belgi to‘g‘ri?",
        correctAnswer: "<",
        distractors: [">", "=", "−"],
        explanation: "3 soni 4 dan kichik (3 < 4)."
      },
      {
        text: "Qaysi ifodaning qiymati 3 ga teng?",
        correctAnswer: "4 − 1",
        distractors: ["5 − 1", "3 + 1", "2 + 2"],
        explanation: "4 − 1 = 3."
      },
      {
        text: "Ertaklarda odatda nechta aka-uka yoki uchta tilak bo‘ladi?",
        correctAnswer: "3 ta 🧞",
        distractors: ["2 ta", "5 ta", "10 ta"],
        explanation: "O‘zbek xalq ertaklarida ko‘pincha 3 aka-uka qahramon bo‘ladi."
      },
      {
        text: "Uch g‘ildirakli bolalar velosipedida nechta g‘ildirak bor?",
        correctAnswer: "3 ta g‘ildirak",
        distractors: ["2 ta", "4 ta", "1 ta"],
        explanation: "Uch g‘ildirakli velosiped 3 ta g‘ildirakka ega."
      },
      {
        text: "Stolda 1 ta olma bor edi, onasi yana 2 ta qo‘ydi. Olmalar nechta bo‘ldi?",
        correctAnswer: "3 ta olma",
        distractors: ["2 ta", "4 ta", "5 ta"],
        explanation: "1 + 2 = 3 ta olma."
      },
      {
        text: "Guldonada 3 ta atirgul bor edi. 1 tasini xolaga berishdi. Nechta atirgul qoldi?",
        correctAnswer: "2 ta atirgul",
        distractors: ["1 ta", "3 ta", "0 ta"],
        explanation: "3 − 1 = 2 ta atirgul."
      },
      {
        text: "3 soni toq sonmi yoki juft son?",
        correctAnswer: "Toq son",
        distractors: ["Juft son", "Ikkalasi ham", "Nol son"],
        explanation: "3 soni toq sondir."
      },
      {
        text: "1, 2, 3 sonlari ichida eng kattasi qaysi?",
        correctAnswer: "3",
        distractors: ["1", "2", "0"],
        explanation: "Ushbu uchtalikda 3 eng kattadir."
      },
      {
        text: "To‘g‘ri tenglikni toping:",
        correctAnswer: "2 + 1 = 3",
        distractors: ["2 + 1 = 4", "3 − 1 = 1", "3 + 1 = 3"],
        explanation: "2 + 1 = 3 to‘g‘ri tenglik."
      },
      {
        text: "Botir darsdan keyin 3 ta kitob o‘qidi. U nechta kitob o‘qigan?",
        correctAnswer: "3 ta kitob",
        distractors: ["2 ta", "4 ta", "1 ta"],
        explanation: "Botir 3 ta kitob mutolaa qilgan."
      }
    ]
  },

  // 17. 4 soni va raqami
  {
    bookNumber: 17,
    title: "4 soni va raqami",
    emoji: "4️⃣",
    shortDesc: "4 raqami, sanash, tarkibi (1 + 3, 2 + 2) va qo‘shnilari.",
    intro: "4 soni — to‘rtta narsani bildiradi, uning tarkibi 1 va 3 yoki 2 va 2 dir.",
    keyPoints: [
      "Stol va stulning 4 ta oyog‘i, avtomobilning 4 ta g‘ildiragi bor.",
      "Kvadrat va to‘g‘ri to‘rtburchak 4 ta tomondan iborat.",
      "4 ning qo‘shnilari 3 va 5 sonlaridir."
    ],
    miniExample: {
      emojis: "🚗 = 4️⃣",
      text: "Mashinaning 4 ta g‘ildiragi bor: 2 + 2 = 4!"
    },
    xpReward: 80,
    coinReward: 10,
    estMinutes: 5,
    practice: [
      {
        text: "Misolni hisoblang: 2 + 2 = ?",
        correctAnswer: "4",
        distractors: ["3", "5", "6"],
        explanation: "2 ga 2 qo‘shilsa 4 bo‘ladi."
      },
      {
        text: "Mashinada nechta g‘ildirak bo‘ladi?",
        correctAnswer: "4 ta 🚗",
        distractors: ["2 ta", "3 ta", "6 ta"],
        explanation: "Yengil mashinada 4 ta asosiy g‘ildirak bor."
      },
      {
        text: "4 sonining qo‘shnilarini toping:",
        correctAnswer: "3 va 5",
        distractors: ["2 va 6", "4 va 5", "1 va 4"],
        explanation: "4 ning oldida 3, keyin 5 turadi."
      }
    ],
    test: [
      {
        text: "Quyidagilardan qaysi biri 4 raqamini bildiradi?",
        correctAnswer: "4",
        distractors: ["1", "7", "3"],
        explanation: "'4' — to‘rt raqami."
      },
      {
        text: "Misolni hisoblang: 3 + 1 = ?",
        correctAnswer: "4",
        distractors: ["3", "5", "6"],
        explanation: "3 + 1 = 4."
      },
      {
        text: "Misolni hisoblang: 2 + 2 = ?",
        correctAnswer: "4",
        distractors: ["5", "3", "2"],
        explanation: "2 + 2 = 4."
      },
      {
        text: "Misolni hisoblang: 4 − 1 = ?",
        correctAnswer: "3",
        distractors: ["2", "4", "5"],
        explanation: "4 − 1 = 3."
      },
      {
        text: "Misolni hisoblang: 4 − 2 = ?",
        correctAnswer: "2",
        distractors: ["1", "3", "4"],
        explanation: "4 − 2 = 2."
      },
      {
        text: "Misolni hisoblang: 4 − 3 = ?",
        correctAnswer: "1",
        distractors: ["2", "0", "3"],
        explanation: "4 − 3 = 1."
      },
      {
        text: "Misolni hisoblang: 4 − 4 = ?",
        correctAnswer: "0",
        distractors: ["1", "2", "4"],
        explanation: "4 − 4 = 0."
      },
      {
        text: "Kvadratning nechta tomoni bor?",
        correctAnswer: "4 ta tomoni",
        distractors: ["3 ta", "5 ta", "2 ta"],
        explanation: "Kvadrat 4 ta teng tomonga ega."
      },
      {
        text: "Yilda nechta fasl bor?",
        correctAnswer: "4 ta fasl 🌸☀️🍂❄️",
        distractors: ["3 ta", "5 ta", "12 ta"],
        explanation: "Yil 4 fasldan iborat: bahor, yoz, kuz, qish."
      },
      {
        text: "Mushukchaning 🐱 nechta oyog‘i bor?",
        correctAnswer: "4 ta oyog‘i",
        distractors: ["2 ta", "3 ta", "6 ta"],
        explanation: "To‘rt oyoqli hayvonlarda 4 ta oyoq bo‘ladi."
      },
      {
        text: "4 sonining tarkibi qanday bo‘lishi mumkin?",
        correctAnswer: "2 va 2 (yoki 1 va 3)",
        distractors: ["2 va 3", "3 va 3", "1 va 2"],
        explanation: "2 + 2 = 4 hamda 1 + 3 = 4."
      },
      {
        text: "4 soni juft sonmi yoki toq son?",
        correctAnswer: "Juft son",
        distractors: ["Toq son", "Nol son", "Manfiy son"],
        explanation: "4 soni 2 ga bo‘linadi, shuning uchun juft son."
      },
      {
        text: "4 sonining oldingi qo‘shnisi kim?",
        correctAnswer: "3",
        distractors: ["2", "5", "1"],
        explanation: "4 dan oldin 3 keladi."
      },
      {
        text: "4 sonining keyingi qo‘shnisi kim?",
        correctAnswer: "5",
        distractors: ["3", "6", "7"],
        explanation: "4 dan keyin 5 keladi."
      },
      {
        text: "Taqqoslang: 4 ... 3. Qaysi belgi to‘g‘ri?",
        correctAnswer: ">",
        distractors: ["<", "=", "−"],
        explanation: "4 soni 3 dan katta (4 > 3)."
      },
      {
        text: "Taqqoslang: 4 ... 5. Qaysi belgi to‘g‘ri?",
        correctAnswer: "<",
        distractors: [">", "=", "+"],
        explanation: "4 soni 5 dan kichik (4 < 5)."
      },
      {
        text: "Hovlida 2 ta tovuq va 2 ta xo‘roz yuribdi. Jami nechta parranda bor?",
        correctAnswer: "4 ta parranda",
        distractors: ["3 ta", "5 ta", "2 ta"],
        explanation: "2 + 2 = 4 ta parranda."
      },
      {
        text: "Likopchada 4 ta somsa bor edi. Ali 1 tasini yedi. Nechta somsa qoldi?",
        correctAnswer: "3 ta somsa",
        distractors: ["2 ta", "4 ta", "1 ta"],
        explanation: "4 − 1 = 3 ta somsa."
      },
      {
        text: "Daftar varag‘ining nechta burchagi bor?",
        correctAnswer: "4 ta burchagi",
        distractors: ["3 ta", "2 ta", "5 ta"],
        explanation: "To‘g‘ri to‘rtburchak shaklidagi varaq 4 burchakka ega."
      },
      {
        text: "Jasur 4 ta shar sotib oldi. 2 tasi uchib ketdi. Unda nechta shar qoldi?",
        correctAnswer: "2 ta shar 🎈🎈",
        distractors: ["3 ta", "1 ta", "0 ta"],
        explanation: "4 − 2 = 2 ta shar."
      }
    ]
  },

  // 18. 5 soni va raqami
  {
    bookNumber: 18,
    title: "5 soni va raqami",
    emoji: "5️⃣",
    shortDesc: "5 raqami, sanash, tarkibi (1 + 4, 2 + 3) va sonlar chizig‘i.",
    intro: "5 soni — beshta narsani bildiradi, bitta qo‘lda 5 ta barmoq bor.",
    keyPoints: [
      "Bitta qo‘l panjasida roppa-rosa 5 ta barmoq bo‘ladi.",
      "5 sonining tarkibi: 1 + 4 = 5 va 2 + 3 = 5.",
      "Sonlar chizig‘ida 5 soni 4 va 6 ning o‘rtasida turadi."
    ],
    miniExample: {
      emojis: "✋ 5️⃣",
      text: "Qo‘limizda 5 ta barmoq bor: 2 + 3 = 5!"
    },
    xpReward: 80,
    coinReward: 10,
    estMinutes: 5,
    practice: [
      {
        text: "Misolni hisoblang: 3 + 2 = ?",
        correctAnswer: "5",
        distractors: ["4", "6", "7"],
        explanation: "3 ga 2 qo‘shilsa 5 bo‘ladi."
      },
      {
        text: "Bitta qo‘lda nechta barmoq bor?",
        correctAnswer: "5 ta ✋",
        distractors: ["4 ta", "6 ta", "10 ta"],
        explanation: "Qo‘limizda 5 ta barmoq bor."
      },
      {
        text: "5 sonining qo‘shnilarini toping:",
        correctAnswer: "4 va 6",
        distractors: ["3 va 5", "5 va 6", "2 va 7"],
        explanation: "5 ning oldida 4, keyin 6 keladi."
      }
    ],
    test: [
      {
        text: "Quyidagilardan qaysi biri 5 raqamini bildiradi?",
        correctAnswer: "5",
        distractors: ["2", "3", "6"],
        explanation: "'5' — besh raqami."
      },
      {
        text: "Misolni hisoblang: 4 + 1 = ?",
        correctAnswer: "5",
        distractors: ["4", "6", "3"],
        explanation: "4 + 1 = 5."
      },
      {
        text: "Misolni hisoblang: 2 + 3 = ?",
        correctAnswer: "5",
        distractors: ["4", "6", "7"],
        explanation: "2 + 3 = 5."
      },
      {
        text: "Misolni hisoblang: 5 − 1 = ?",
        correctAnswer: "4",
        distractors: ["3", "5", "6"],
        explanation: "5 − 1 = 4."
      },
      {
        text: "Misolni hisoblang: 5 − 2 = ?",
        correctAnswer: "3",
        distractors: ["2", "4", "1"],
        explanation: "5 − 2 = 3."
      },
      {
        text: "Misolni hisoblang: 5 − 3 = ?",
        correctAnswer: "2",
        distractors: ["3", "1", "4"],
        explanation: "5 − 3 = 2."
      },
      {
        text: "Misolni hisoblang: 5 − 4 = ?",
        correctAnswer: "1",
        distractors: ["2", "0", "3"],
        explanation: "5 − 4 = 1."
      },
      {
        text: "Misolni hisoblang: 5 − 5 = ?",
        correctAnswer: "0",
        distractors: ["1", "5", "10"],
        explanation: "5 − 5 = 0."
      },
      {
        text: "Beshburchakning nechta tomoni bor?",
        correctAnswer: "5 ta tomoni ⬟",
        distractors: ["4 ta", "6 ta", "3 ta"],
        explanation: "Beshburchak 5 ta burchak va 5 ta tomonga ega."
      },
      {
        text: "5 sonining tarkibi qanday?",
        correctAnswer: "2 va 3 (yoki 1 va 4)",
        distractors: ["2 va 2", "3 va 3", "1 va 3"],
        explanation: "2 + 3 = 5 va 1 + 4 = 5."
      },
      {
        text: "5 soni toq sonmi yoki juft son?",
        correctAnswer: "Toq son",
        distractors: ["Juft son", "Nol son", "Ikkalasi ham"],
        explanation: "5 soni toq sondir."
      },
      {
        text: "5 sonining oldingi qo‘shnisi kim?",
        correctAnswer: "4",
        distractors: ["3", "6", "2"],
        explanation: "5 dan oldin 4 turadi."
      },
      {
        text: "5 sonining keyingi qo‘shnisi kim?",
        correctAnswer: "6",
        distractors: ["4", "7", "8"],
        explanation: "5 dan keyin 6 keladi."
      },
      {
        text: "Taqqoslang: 5 ... 4. Qaysi belgi to‘g‘ri?",
        correctAnswer: ">",
        distractors: ["<", "=", "+"],
        explanation: "5 soni 4 dan katta (5 > 4)."
      },
      {
        text: "Taqqoslang: 5 ... 6. Qaysi belgi to‘g‘ri?",
        correctAnswer: "<",
        distractors: [">", "=", "−"],
        explanation: "5 soni 6 dan kichik (5 < 6)."
      },
      {
        text: "Dengiz yulduzining ⭐️ nechta uchi bor?",
        correctAnswer: "5 ta uchi",
        distractors: ["4 ta", "6 ta", "3 ta"],
        explanation: "Dengiz yulduzi odatda 5 ta nurlarga ega."
      },
      {
        text: "Bog‘chada 3 ta o‘g‘il bola va 2 ta qiz bola o‘ynamoqda. Jami nechta bola bor?",
        correctAnswer: "5 ta bola",
        distractors: ["4 ta", "6 ta", "3 ta"],
        explanation: "3 + 2 = 5 ta bola."
      },
      {
        text: "Nodir 5 ta qushchani ko‘rdi, 2 tasi uchib ketdi. Nechta qushcha qoldi?",
        correctAnswer: "3 ta qushcha",
        distractors: ["2 ta", "4 ta", "1 ta"],
        explanation: "5 − 2 = 3 ta qushcha."
      },
      {
        text: "Qaysi ifodaning qiymati 5 ga teng?",
        correctAnswer: "1 + 4",
        distractors: ["2 + 2", "3 + 1", "5 + 1"],
        explanation: "1 + 4 = 5."
      },
      {
        text: "O‘quvchi a’lo baho olsa, qaysi bahoni oladi?",
        correctAnswer: "5 (a’lo)",
        distractors: ["4", "3", "2"],
        explanation: "Maktabda eng yuqori a’lo baho bu — 5 dir."
      }
    ]
  },

  // 19. 1 dan 5 gacha bo‘lgan sonlar
  {
    bookNumber: 19,
    title: "1 dan 5 gacha bo‘lgan sonlar",
    emoji: "✋",
    shortDesc: "Sanash, tartib, taqqoslash va tushirib qoldirilgan son (1–5).",
    intro: "1, 2, 3, 4, 5 sonlarini puxta o‘rganib, ularni bir-biri bilan taqqoslaymiz.",
    keyPoints: [
      "1, 2, 3, 4, 5 — sanoqning birinchi beshligi.",
      "O‘sish tartibi: 1 < 2 < 3 < 4 < 5.",
      "Kamayish tartibi: 5 > 4 > 3 > 2 > 1."
    ],
    miniExample: {
      emojis: "1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣",
      text: "Kichigidan kattasiga: 1 dan 5 gacha tartib!"
    },
    xpReward: 80,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "1, 2, 3, 4, 5 sonlaridan eng kattasi qaysi?",
        correctAnswer: "5",
        distractors: ["1", "3", "4"],
        explanation: "5 soni bu beshlikda eng kattasidir."
      },
      {
        text: "Qatorda tushib qolgan sonni toping: 1, 2, ?, 4, 5",
        correctAnswer: "3",
        distractors: ["0", "6", "2"],
        explanation: "2 va 4 orasidagi son 3 dir."
      },
      {
        text: "Qaysi son 3 dan katta, lekin 5 dan kichik?",
        correctAnswer: "4",
        distractors: ["2", "1", "6"],
        explanation: "3 va 5 orasidagi son 4 dir."
      }
    ],
    test: [
      {
        text: "1 dan 5 gacha bo‘lgan sonlar ichida eng kichigi qaysi?",
        correctAnswer: "1",
        distractors: ["2", "3", "5"],
        explanation: "1 — sanoqdagi eng kichik son."
      },
      {
        text: "1 dan 5 gacha bo‘lgan sonlar ichida eng kattasi qaysi?",
        correctAnswer: "5",
        distractors: ["4", "3", "2"],
        explanation: "5 — bu beshlikdagi eng katta son."
      },
      {
        text: "Qatorda qaysi son tushib qolgan: 1, ?, 3, 4, 5?",
        correctAnswer: "2",
        distractors: ["0", "4", "6"],
        explanation: "1 va 3 orasida 2 soni joylashgan."
      },
      {
        text: "Qatorda qaysi son tushib qolgan: 1, 2, 3, ?, 5?",
        correctAnswer: "4",
        distractors: ["2", "6", "5"],
        explanation: "3 va 5 orasidagi son 4 dir."
      },
      {
        text: "Teskari tartibda to‘g‘ri yozilgan qatorni toping:",
        correctAnswer: "5, 4, 3, 2, 1",
        distractors: ["1, 2, 3, 4, 5", "5, 3, 4, 2, 1", "4, 5, 3, 2, 1"],
        explanation: "Kattasidan kichigiga: 5, 4, 3, 2, 1."
      },
      {
        text: "O‘sish tartibida to‘g‘ri yozilgan qatorni toping:",
        correctAnswer: "1, 2, 3, 4, 5",
        distractors: ["5, 4, 3, 2, 1", "1, 3, 2, 4, 5", "2, 1, 4, 3, 5"],
        explanation: "Kichigidan kattasiga: 1, 2, 3, 4, 5."
      },
      {
        text: "1 va 5 oralig‘idagi o‘rtadagi son qaysi?",
        correctAnswer: "3",
        distractors: ["2", "4", "1"],
        explanation: "3 soni 1 va 5 ning qoq o‘rtasida joylashgan."
      },
      {
        text: "Qaysi juftlikdagi sonlar yig‘indisi 5 ga teng?",
        correctAnswer: "2 va 3",
        distractors: ["1 va 3", "2 va 2", "3 va 3"],
        explanation: "2 + 3 = 5."
      },
      {
        text: "Qaysi juftlikdagi sonlar yig‘indisi 4 ga teng?",
        correctAnswer: "2 va 2",
        distractors: ["2 va 3", "1 va 2", "3 va 2"],
        explanation: "2 + 2 = 4."
      },
      {
        text: "Qaysi juftlikdagi sonlar yig‘indisi 3 ga teng?",
        correctAnswer: "1 va 2",
        distractors: ["2 va 2", "1 va 1", "3 va 1"],
        explanation: "1 + 2 = 3."
      },
      {
        text: "Taqqoslang: 5 ... 2. Qaysi belgi to‘g‘ri?",
        correctAnswer: ">",
        distractors: ["<", "=", "+"],
        explanation: "5 soni 2 dan katta (5 > 2)."
      },
      {
        text: "Taqqoslang: 1 ... 4. Qaysi belgi to‘g‘ri?",
        correctAnswer: "<",
        distractors: [">", "=", "−"],
        explanation: "1 soni 4 dan kichik (1 < 4)."
      },
      {
        text: "Taqqoslang: 3 ... 3. Qaysi belgi to‘g‘ri?",
        correctAnswer: "=",
        distractors: [">", "<", "+"],
        explanation: "3 va 3 teng (3 = 3)."
      },
      {
        text: "1 dan 5 gacha bo‘lgan sonlar ichida nechta toq son bor?",
        correctAnswer: "3 ta (1, 3, 5)",
        distractors: ["2 ta", "4 ta", "1 ta"],
        explanation: "1, 3 va 5 toq sonlar, jami 3 ta."
      },
      {
        text: "1 dan 5 gacha bo‘lgan sonlar ichida nechta juft son bor?",
        correctAnswer: "2 ta (2 va 4)",
        distractors: ["3 ta", "1 ta", "4 ta"],
        explanation: "2 va 4 juft sonlar, jami 2 ta."
      },
      {
        text: "Qaysi son 1 dan katta, lekin 3 dan kichik?",
        correctAnswer: "2",
        distractors: ["4", "5", "0"],
        explanation: "1 va 3 orasida 2 soni bor."
      },
      {
        text: "Sayyoh 5 kun sayohat qildi. U 3-kundan keyin nechanchi kunda bo‘ldi?",
        correctAnswer: "4-kunda",
        distractors: ["2-kunda", "5-kunda", "1-kunda"],
        explanation: "3-kundan keyingi kun 4-kundir."
      },
      {
        text: "Savatda 5 ta olma bor edi. 3 ta bolaga bittadan berildi. Nechta olma qoldi?",
        correctAnswer: "2 ta olma",
        distractors: ["1 ta", "3 ta", "0 ta"],
        explanation: "5 − 3 = 2 ta olma qoladi."
      },
      {
        text: "Akmal 1-qavatdan 5-qavatgacha chiqishi kerak. U 4-qavatdan keyin qaysi qavatga chiqadi?",
        correctAnswer: "5-qavatga",
        distractors: ["3-qavatga", "6-qavatga", "1-qavatga"],
        explanation: "4-qavatdan so‘ng 5-qavat keladi."
      },
      {
        text: "Kamola 1, 2, 3, 4, 5 sonlaridan kartochkalar yasadi. Eng o‘rtadagi kartochka qaysi?",
        correctAnswer: "3 raqami yozilgan kartochka",
        distractors: ["1 raqami", "5 raqami", "2 raqami"],
        explanation: "1, 2, 3, 4, 5 qatorining o‘rtasida 3 turadi."
      }
    ]
  }
];

export function runPart1Chapter2A() {
  console.log('--- 1-qism II bob A qismi (9–19-darslar) yaratilmoqda ---');
  for (const l of lessons) {
    const seed = buildLessonSeed(l);
    saveLessonFile(1, l.bookNumber, seed);
    console.log(`  ✓ Dars ${l.bookNumber}: ${l.title} saqlandi.`);
  }
}

runPart1Chapter2A();
