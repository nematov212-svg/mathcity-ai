import { LessonDataDef, buildLessonSeed, saveLessonFile } from './generatorTypes.js';

const lessons: LessonDataDef[] = [
  // 30. Nuqta. To‘g‘ri va egri chiziq
  {
    bookNumber: 30,
    title: "Nuqta. To‘g‘ri va egri chiziq",
    emoji: "✏️",
    shortDesc: "Nuqta, to‘g‘ri chiziq va egri chiziqni ajratish, chizg‘ich bilan chizish.",
    intro: "Qalam uchini qog‘ozga tekkizsak nuqta hosil bo‘ladi, chizg‘ich yordamida to‘g‘ri chiziq chiziladi.",
    keyPoints: [
      "Nuqta — eng sodda geometrik shakl.",
      "Chizg‘ich bo‘ylab tortilgan chiziq to‘g‘ri chiziq deyiladi.",
      "To‘lqinsimon yoki aylanma chiziqlar egri chiziqlar deyiladi."
    ],
    miniExample: {
      emojis: "📏 ✏️ 〰️",
      text: "Chizg‘ich bilan to‘g‘ri chiziq, erkin qo‘l bilan egri chiziq chizamiz!"
    },
    xpReward: 85,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "To‘g‘ri chiziq chizish uchun qaysi asbob kerak?",
        correctAnswer: "Chizg‘ich 📏",
        distractors: ["O‘chirg‘ich 🧼", "Qaychi ✂️", "Yelim 🧴"],
        explanation: "To‘g‘ri chiziq chizg‘ich yordamida chiziladi."
      },
      {
        text: "Daryoning oqishi qanday chiziqqa o‘xshaydi?",
        correctAnswer: "Egri chiziqqa 〰️",
        distractors: ["To‘g‘ri chiziqqa", "Nuqtaga", "Aylanaga"],
        explanation: "Daryolar burilib-burilib, egri chiziq hosil qilib oqadi."
      },
      {
        text: "Ikki nuqta orasidagi eng qisqa yo‘l qanday chiziq bo‘ladi?",
        correctAnswer: "To‘g‘ri chiziq",
        distractors: ["Egri chiziq", "Siniq chiziq", "Aylanma yo‘l"],
        explanation: "Ikki nuqtani birlashtiruvchi eng qisqa yo‘l to‘g‘ri chiziqdir."
      }
    ],
    test: [
      {
        text: "Qalam uchini qog‘ozga bir marta tekkizganda nima hosil bo‘ladi?",
        correctAnswer: "Nuqta •",
        distractors: ["Kvadrat", "Uchburchak", "Aylana"],
        explanation: "Qalam uchi qog‘ozda nuqta qoldiradi."
      },
      {
        text: "Chizg‘ich yordamida qanday chiziq chiziladi?",
        correctAnswer: "To‘g‘ri chiziq",
        distractors: ["Egri chiziq", "To‘lqinli chiziq", "Dumaloq chiziq"],
        explanation: "Chizg‘ich to‘g‘ri chiziq chizish uchun xizmat qiladi."
      },
      {
        text: "Ilonning 🐍 yerda sudralib yurishi qanday chiziqqa o‘xshaydi?",
        correctAnswer: "Egri chiziqqa",
        distractors: ["To‘g‘ri chiziqqa", "Nuqtaga", "Kvadratga"],
        explanation: "Ilon buralib, egri chiziq hosil qiladi."
      },
      {
        text: "Ikki nuqta orasidagi eng to‘g‘ri va qisqa yo‘l qaysi?",
        correctAnswer: "To‘g‘ri chiziq bo‘ylab yo‘l",
        distractors: ["Aylanma egri yo‘l", "Siniq yo‘l", "To‘lqinsimon yo‘l"],
        explanation: "To‘g‘ri chiziq eng qisqa masofani ifodalaydi."
      },
      {
        text: "Kamalak 🌈 qanday chiziq shaklida ko‘rinadi?",
        correctAnswer: "Egri chiziq (yoy)",
        distractors: ["To‘g‘ri chiziq", "Nuqta", "Kvadrat"],
        explanation: "Kamalak osmonda egri yoy shaklida hosil bo‘ladi."
      },
      {
        text: "Temir yo‘l relslari tekis maydonda qanday chiziq bo‘ladi?",
        correctAnswer: "To‘g‘ri chiziq",
        distractors: ["Egri chiziq", "Aylanma", "Nuqta"],
        explanation: "Tekis yo‘ldagi relslar to‘g‘ri chiziq bo‘ylab yotqiziladi."
      },
      {
        text: "Nuqtaning o‘lchami (uzunligi yoki kengligi) bormi?",
        correctAnswer: "Nuqtaning o‘lchami yo‘q, u faqat o‘rinni bildiradi",
        distractors: ["Uzunligi 5 sm", "Kengligi 2 sm", "Og‘irligi bor"],
        explanation: "Geometriyada nuqta o‘lchamsiz shakl hisoblanadi."
      },
      {
        text: "Quyidagilardan qaysi biri to‘g‘ri chiziqqa misol bo‘ladi?",
        correctAnswer: "Tarang tortilgan ip",
        distractors: ["Bo‘sh tashlangan egri ip", "Daryo o‘zani", "Daraxt shoxi"],
        explanation: "Tarang tortilgan ip to‘g‘ri chiziq shaklini oladi."
      },
      {
        text: "Quyidagilardan qaysi biri egri chiziqqa misol bo‘ladi?",
        correctAnswer: "To‘lqinlanayotgan dengiz suvi 🌊",
        distractors: ["Chizg‘ich qirrasi 📏", "Daftar cheti", "Qalamning o‘zi ✏️"],
        explanation: "Dengiz to‘lqinlari egri chiziq bo‘lib harakatlanadi."
      },
      {
        text: "Bitta nuqtadan nechta to‘g‘ri chiziq o‘tkazish mumkin?",
        correctAnswer: "Cheksiz ko‘p to‘g‘ri chiziq",
        distractors: ["Faqat 1 ta", "Faqat 2 ta", "Faqat 10 ta"],
        explanation: "Bitta nuqta orqali xohlagancha ko‘p to‘g‘ri chiziq o‘tkazsa bo‘ladi."
      },
      {
        text: "Ikkita turli nuqta orqali nechta to‘g‘ri chiziq o‘tkazish mumkin?",
        correctAnswer: "Faqat 1 ta to‘g‘ri chiziq",
        distractors: ["2 ta", "3 ta", "Cheksiz ko‘p"],
        explanation: "Ikki nuqta orqali faqat bitta to‘g‘ri chiziq o‘tadi."
      },
      {
        text: "Quyosh nurlari ☀️ qanday chiziqlar bo‘lib tarqaladi?",
        correctAnswer: "To‘g‘ri chiziq bo‘ylab (nurlar)",
        distractors: ["Egri aylanma chiziq", "Siniq to‘lqin", "Nuqtalar"],
        explanation: "Yorug‘lik to‘g‘ri chiziq bo‘ylab tarqaladi."
      },
      {
        text: "Kapalakning havoda uchib yurgan izi qanday chiziq bo‘ladi?",
        correctAnswer: "Egri chiziq 〰️",
        distractors: ["To‘g‘ri chiziq", "Nuqta", "Uchburchak"],
        explanation: "Kapalak guldan gulga egri chiziq bo‘ylab uchadi."
      },
      {
        text: "Koptok tepilganda uning havodagi uchish yo‘li qanday?",
        correctAnswer: "Egri chiziq (yoy)",
        distractors: ["Tik to‘g‘ri chiziq", "Kvadrat", "Nuqta"],
        explanation: "Koptok havoda yoy shaklidagi egri chiziq chizib tushadi."
      },
      {
        text: "Chizg‘ichning tekis qirrasi qanday chiziqni eslatadi?",
        correctAnswer: "To‘g‘ri chiziqni",
        distractors: ["Egri chiziqni", "Nuqtani", "Aylanani"],
        explanation: "Chizg‘ich qirrasi to‘g‘ri chiziqdir."
      },
      {
        text: "Daftarga 3 ta nuqta qo‘yildi. Nechta nuqta belgilandi?",
        correctAnswer: "3 ta nuqta",
        distractors: ["2 ta", "4 ta", "1 ta"],
        explanation: "Daftarda 3 ta nuqta bor."
      },
      {
        text: "Avtomobil to‘g‘ri shosse yo‘lida 🛣️ qanday chiziq bo‘ylab harakatlanadi?",
        correctAnswer: "To‘g‘ri chiziq bo‘ylab",
        distractors: ["Egri chiziq bo‘ylab", "Aylanib", "Orqaga"],
        explanation: "To‘g‘ri yo‘lda harakat to‘g‘ri chiziqdir."
      },
      {
        text: "Tog‘ so‘qmog‘i burilib-burilib ketgan bo‘lsa, u qanday yo‘l?",
        correctAnswer: "Egri chiziqli yo‘l",
        distractors: ["To‘g‘ri chiziqli yo‘l", "Nuqtali yo‘l", "To‘rtburchak yo‘l"],
        explanation: "Burilishli tog‘ yo‘llari egri chiziq hosil qiladi."
      },
      {
        text: "Doira chizig‘i qanday chiziq turiga kiradi?",
        correctAnswer: "Yopiq egri chiziq ⭕",
        distractors: ["To‘g‘ri chiziq", "Siniq chiziq", "Nuqta"],
        explanation: "Doira silliq yopiq egri chiziqdan iborat."
      },
      {
        text: "Jasur chizg‘ichsiz qo‘li bilan chiziq tortdi. Chiziq biroz qiyshiq chiqdi. Bu qanday chiziq?",
        correctAnswer: "Egri chiziq",
        distractors: ["To‘g‘ri chiziq", "Nuqta", "Kvadrat"],
        explanation: "Qo‘lda qiyshaygan chiziq egri chiziq hisoblanadi."
      }
    ]
  },

  // 31. To‘g‘ri chiziq kesmasi. Siniq chiziq
  {
    bookNumber: 31,
    title: "To‘g‘ri chiziq kesmasi. Siniq chiziq",
    emoji: "📐",
    shortDesc: "Kesma nima, kesmaning uchlari (oxirlari), kesmalarni sanash va siniq chiziq.",
    intro: "Ikki tomondan nuqtalar bilan chegaralangan to‘g‘ri chiziq bo‘lagi kesma deyiladi.",
    keyPoints: [
      "Kesmaning boshi va oxiri (2 ta uchi) bo‘ladi.",
      "Kesmani chizg‘ich bilan o‘lchash mumkin (santimetrlarda).",
      "Bir necha kesmalar ketma-ket tutashsa, siniq chiziq hosil bo‘ladi."
    ],
    miniExample: {
      emojis: "•——• 📐",
      text: "Nuqtalar orasidagi chiziq — kesma: uning 2 ta uchi bor!"
    },
    xpReward: 85,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Kesmaning nechta uchi (chegarasi) bo‘ladi?",
        correctAnswer: "2 ta uchi",
        distractors: ["1 ta uchi", "3 ta uchi", "Uchi bo‘lmaydi"],
        explanation: "Kesma ikki chetidan nuqtalar bilan chegaralanadi."
      },
      {
        text: "Uchburchak 🔺 nechta kesmadan tuzilgan?",
        correctAnswer: "3 ta kesmadan",
        distractors: ["4 ta", "2 ta", "5 ta"],
        explanation: "Uchburchakning har bir tomoni bitta kesmadir, jami 3 ta."
      },
      {
        text: "To‘rtburchak 🔲 nechta kesmadan tuzilgan?",
        correctAnswer: "4 ta kesmadan",
        distractors: ["3 ta", "5 ta", "6 ta"],
        explanation: "To‘rtburchak 4 ta kesmadan iborat."
      }
    ],
    test: [
      {
        text: "To‘g‘ri chiziqning ikki nuqta bilan chegaralangan qismi nima deyiladi?",
        correctAnswer: "Kesma",
        distractors: ["Nur", "Nuqta", "Aylana"],
        explanation: "Ikki cheti chegaralangan qism kesma deyiladi."
      },
      {
        text: "Kesmaning nechta chegaraviy nuqtasi (uchi) bor?",
        correctAnswer: "2 ta",
        distractors: ["1 ta", "3 ta", "Cheksiz"],
        explanation: "Kesma boshlang‘ich va oxirgi 2 ta nuqtaga ega."
      },
      {
        text: "Bir nechta kesmalar ulanib, to‘g‘ri chiziq hosil qilmasa nima deyiladi?",
        correctAnswer: "Siniq chiziq",
        distractors: ["To‘g‘ri chiziq", "Egri chiziq", "Doira"],
        explanation: "Kesmalarning burchak hosil qilib ulanishi siniq chiziq deyiladi."
      },
      {
        text: "Siniq chiziqni tashkil qiluvchi har bir kesma nima deyiladi?",
        correctAnswer: "Siniq chiziqning bo‘g‘ini",
        distractors: ["Aylana", "Radius", "Diametr"],
        explanation: "Siniq chiziqdagi kesmalarga uning bo‘g‘inlari deyiladi."
      },
      {
        text: "3 ta bo‘g‘indan iborat siniq chiziqda nechta kesma bor?",
        correctAnswer: "3 ta kesma",
        distractors: ["2 ta", "4 ta", "5 ta"],
        explanation: "3 ta bo‘g‘in 3 ta kesmadan iborat."
      },
      {
        text: "Kvadratning tomonlari qanday chiziqlardan iborat?",
        correctAnswer: "4 ta teng kesmadan",
        distractors: ["4 ta egri chiziqdan", "3 ta kesmadan", "Aylanadan"],
        explanation: "Kvadrat 4 ta teng kesmaning tutashuvidan hosil bo‘ladi."
      },
      {
        text: "Kesmaning uzunligini qaysi asbob bilan o‘lchash mumkin?",
        correctAnswer: "Chizg‘ich bilan (santimetrlarda) 📏",
        distractors: ["Tarozi bilan", "Soat bilan", "Termometr bilan"],
        explanation: "Uzunlik chizg‘ich yordamida santimetrda o‘lchanadi."
      },
      {
        text: "Quyidagilardan qaysi biri yopiq siniq chiziq hisoblanadi?",
        correctAnswer: "Uchburchak 🔺",
        distractors: ["Ochiq zinasimon chiziq", "Yoy chiziq", "Nuqta"],
        explanation: "Uchburchak uchi tutashgan yopiq siniq chiziqdir."
      },
      {
        text: "To‘g‘ri chiziq bilan kesmaning farqi nimada?",
        correctAnswer: "To‘g‘ri chiziq cheksiz, kesmaning esa boshi va oxiri bor",
        distractors: ["Kesma egri bo‘ladi", "To‘g‘ri chiziq burchakli bo‘ladi", "Farqi yo‘q"],
        explanation: "Kesma chegaralangan, to‘g‘ri chiziq esa cheksiz davom etadi."
      },
      {
        text: "4 ta bo‘g‘inli siniq chiziqda nechta bo‘g‘in (kesma) bor?",
        correctAnswer: "4 ta",
        distractors: ["3 ta", "5 ta", "2 ta"],
        explanation: "4 ta bo‘g‘inli siniq chiziqda 4 ta kesma mavjud."
      },
      {
        text: "Yulduzcha ⭐️ shakli qanday chiziqdan yasalgan?",
        correctAnswer: "Yopiq siniq chiziqdan",
        distractors: ["Bitta to‘g‘ri chiziqdan", "Doiradan", "Nuqtadan"],
        explanation: "Yulduzcha ko‘plab kesmalarning yopiq tutashuvidir."
      },
      {
        text: "Kesmaning uzunligi 5 sm bo‘lsa, u haqida nima deymiz?",
        correctAnswer: "U 5 santimetrli aniq o‘lchamga ega",
        distractors: ["U cheksiz uzun", "Uning o‘lchami yo‘q", "U 5 metr"],
        explanation: "Kesmaning aniq uzunligi bo‘ladi."
      },
      {
        text: "Beshburchak ⬟ nechta kesmadan tuzilgan?",
        correctAnswer: "5 ta kesmadan",
        distractors: ["4 ta", "6 ta", "3 ta"],
        explanation: "Beshburchak 5 ta kesmaning yopiq birikmasidir."
      },
      {
        text: "Agar kesmaning bir uchi o‘chirilsa, u nima bo‘lib qolishi mumkin?",
        correctAnswer: "Bir tomoni cheksiz nur",
        distractors: ["Doira", "Nuqta", "Uchburchak"],
        explanation: "Boshi bor, lekin cheki yo‘q chiziqqa nur deyiladi."
      },
      {
        text: "Zina shaklidagi chiziq qanday chiziqqa misol bo‘ladi?",
        correctAnswer: "Siniq chiziqqa",
        distractors: ["Egri chiziqqa", "Aylanaga", "Nuqtaga"],
        explanation: "Zinapoyaning qirralari to‘g‘ri burchakli siniq chiziq hosil qiladi."
      },
      {
        text: "Ali qog‘ozga 2 ta nuqta qo‘ydi va ularni chizg‘ich bilan tutashtirdi. U nima chizdi?",
        correctAnswer: "Kesma chizdi",
        distractors: ["Doira chizdi", "Egri chiziq chizdi", "Kub chizdi"],
        explanation: "Ikki nuqta tutashtirilsa kesma hosil bo‘ladi."
      },
      {
        text: "1-kesma 3 sm, 2-kesma 5 sm. Qaysi kesma uzun?",
        correctAnswer: "2-kesma uzun (5 sm > 3 sm)",
        distractors: ["1-kesma uzun", "Ikkalasi teng", "O‘lchab bo‘lmaydi"],
        explanation: "5 sm 3 sm dan uzun."
      },
      {
        text: "1-kesma 4 sm, 2-kesma ham 4 sm. Kesmalar haqida nima deymiz?",
        correctAnswer: "Ikkala kesma teng uzunlikda (4 sm = 4 sm)",
        distractors: ["1-kesma uzun", "2-kesma uzun", "Kesmalar har xil"],
        explanation: "Uzunliklari bir xil bo‘lsa, kesmalar teng deyiladi."
      },
      {
        text: "Daftar katagining bir tomoni odatda qancha bo‘ladi?",
        correctAnswer: "Yarim santimetr (5 millimetr)",
        distractors: ["1 metr", "10 santimetr", "5 metr"],
        explanation: "Maktab daftari katagining tomoni 5 mm (yarim sm) bo‘ladi."
      },
      {
        text: "Oltiburchak nechta kesmadan tuziladi?",
        correctAnswer: "6 ta kesmadan",
        distractors: ["5 ta", "7 ta", "8 ta"],
        explanation: "Oltiburchakda 6 ta tomon, ya’ni 6 ta kesma bor."
      }
    ]
  },

  // 32. Qo‘shish hadlari (qo‘shiluvchi va yig‘indi)
  {
    bookNumber: 32,
    title: "Qo‘shish hadlari",
    emoji: "🧩",
    shortDesc: "Qo‘shiluvchi, qo‘shiluvchi, yig‘indi nomlari, jadval to‘ldirish va yig‘indi.",
    intro: "Qo‘shish amalida qatnashuvchi sonlar: 1-qo‘shiluvchi, 2-qo‘shiluvchi va yig‘indi deyiladi.",
    keyPoints: [
      "Qo‘shilayotgan sonlar — 'qo‘shiluvchilar'.",
      "Natijada hosil bo‘lgan son — 'yig‘indi'.",
      "Masalan: 3 (1-qo‘shiluvchi) + 4 (2-qo‘shiluvchi) = 7 (yig‘indi)."
    ],
    miniExample: {
      emojis: "3️⃣ + 4️⃣ = 7️⃣",
      text: "3 — qo‘shiluvchi, 4 — qo‘shiluvchi, 7 — yig‘indi!"
    },
    xpReward: 85,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "5 + 2 = 7 ifodasida 5 nima deyiladi?",
        correctAnswer: "Qo‘shiluvchi (1-qo‘shiluvchi)",
        distractors: ["Yig‘indi", "Ayirma", "Kamayuvchi"],
        explanation: "Qo‘shilayotgan sonlar qo‘shiluvchi deyiladi."
      },
      {
        text: "4 + 3 = 7 ifodasida 7 nima deyiladi?",
        correctAnswer: "Yig‘indi (natija)",
        distractors: ["Qo‘shiluvchi", "Ayriluvchi", "Ayirma"],
        explanation: "Qo‘shish natijasi yig‘indi deyiladi."
      },
      {
        text: "1-qo‘shiluvchi 6, 2-qo‘shiluvchi 2. Yig‘indini toping: 6 + 2 = ?",
        correctAnswer: "8",
        distractors: ["7", "9", "4"],
        explanation: "6 + 2 = 8."
      }
    ],
    test: [
      {
        text: "3 + 5 = 8 ifodasida 3 va 5 sonlari nima deb ataladi?",
        correctAnswer: "Qo‘shiluvchilar",
        distractors: ["Ayirmalar", "Kamayuvchilar", "Natijalar"],
        explanation: "Qo‘shilayotgan har bir son qo‘shiluvchidir."
      },
      {
        text: "3 + 5 = 8 ifodasida 8 soni nima deb ataladi?",
        correctAnswer: "Yig‘indi",
        distractors: ["Qo‘shiluvchi", "Ayirma", "Ayriluvchi"],
        explanation: "Qo‘shish natijasidagi son yig‘indi deyiladi."
      },
      {
        text: "1-qo‘shiluvchi 4, 2-qo‘shiluvchi 3 bo‘lsa, yig‘indi nechaga teng?",
        correctAnswer: "7 (chunki 4 + 3 = 7)",
        distractors: ["6", "8", "1"],
        explanation: "4 + 3 = 7."
      },
      {
        text: "1-qo‘shiluvchi 2, 2-qo‘shiluvchi 6 bo‘lsa, yig‘indi nechaga teng?",
        correctAnswer: "8 (chunki 2 + 6 = 8)",
        distractors: ["7", "9", "4"],
        explanation: "2 + 6 = 8."
      },
      {
        text: "1-qo‘shiluvchi 5, 2-qo‘shiluvchi 5 bo‘lsa, yig‘indi nechaga teng?",
        correctAnswer: "10 (chunki 5 + 5 = 10)",
        distractors: ["9", "0", "8"],
        explanation: "5 + 5 = 10."
      },
      {
        text: "6 + 1 = 7 ifodasida 1 soni nima?",
        correctAnswer: "2-qo‘shiluvchi",
        distractors: ["Yig‘indi", "Kamayuvchi", "Ayirma"],
        explanation: "1 — ikkinchi qo‘shiluvchidir."
      },
      {
        text: "Qaysi ifodada yig‘indi 9 ga teng?",
        correctAnswer: "6 + 3",
        distractors: ["5 + 3", "7 + 1", "4 + 4"],
        explanation: "6 + 3 = 9."
      },
      {
        text: "Qaysi ifodada yig‘indi 6 ga teng?",
        correctAnswer: "4 + 2",
        distractors: ["3 + 2", "5 + 2", "6 + 1"],
        explanation: "4 + 2 = 6."
      },
      {
        text: "Jadval: 1-qo‘shiluvchi 7, 2-qo‘shiluvchi 1. Yig‘indini toping.",
        correctAnswer: "8",
        distractors: ["6", "9", "7"],
        explanation: "7 + 1 = 8."
      },
      {
        text: "Jadval: 1-qo‘shiluvchi 3, 2-qo‘shiluvchi 4. Yig‘indini toping.",
        correctAnswer: "7",
        distractors: ["6", "8", "1"],
        explanation: "3 + 4 = 7."
      },
      {
        text: "Qo‘shiluvchilar 2 va 7 bo‘lsa, yig‘indi nechaga teng?",
        correctAnswer: "9",
        distractors: ["8", "10", "5"],
        explanation: "2 + 7 = 9."
      },
      {
        text: "Qo‘shiluvchilar 8 va 2 bo‘lsa, yig‘indi nechaga teng?",
        correctAnswer: "10",
        distractors: ["9", "6", "11"],
        explanation: "8 + 2 = 10."
      },
      {
        text: "Qo‘shiluvchilar 1 va 9 bo‘lsa, yig‘indi nechaga teng?",
        correctAnswer: "10",
        distractors: ["8", "9", "0"],
        explanation: "1 + 9 = 10."
      },
      {
        text: "Yig‘indisi 5 bo‘lgan qo‘shiluvchilarni toping:",
        correctAnswer: "2 va 3 (2 + 3 = 5)",
        distractors: ["2 va 2", "3 va 3", "1 va 3"],
        explanation: "2 + 3 = 5."
      },
      {
        text: "Yig‘indisi 8 bo‘lgan qo‘shiluvchilarni toping:",
        correctAnswer: "4 va 4 (4 + 4 = 8)",
        distractors: ["3 va 4", "5 va 4", "2 va 5"],
        explanation: "4 + 4 = 8."
      },
      {
        text: "Qo‘shish amali qaysi belgi bilan ko‘rsatiladi?",
        correctAnswer: "+ (qo‘shuv belgisi)",
        distractors: ["− (ayiruv)", "= (tenglik)", "> (katta)"],
        explanation: "Qo‘shuv amali '+' belgisi bilan yoziladi."
      },
      {
        text: "Anvar 4 ta olma, singlisi 2 ta olma uzdi. Yig‘indini toping.",
        correctAnswer: "6 ta olma (4 + 2 = 6)",
        distractors: ["5 ta", "7 ta", "2 ta"],
        explanation: "4 + 2 = 6 ta olma."
      },
      {
        text: "Daftarga 5 ta ko‘k va 3 ta qizil katak bo‘yaldi. Jami bo‘yalgan kataklar yig‘indisi nechta?",
        correctAnswer: "8 ta katak",
        distractors: ["7 ta", "9 ta", "2 ta"],
        explanation: "5 + 3 = 8 ta katak."
      },
      {
        text: "Agar birinchi qo‘shiluvchi 0 bo‘lsa, yig‘indi nimaga teng bo‘ladi?",
        correctAnswer: "Ikkinchi qo‘shiluvchining o‘ziga teng bo‘ladi",
        distractors: ["0 ga teng bo‘ladi", "1 ga teng bo‘ladi", "10 ga teng bo‘ladi"],
        explanation: "0 + a = a, ya’ni ikkinchi sonning o‘zi chiqadi."
      },
      {
        text: "Sobir 3 ta, do‘sti ham 3 ta baliq tutdi. Ular tutgan baliqlar yig‘indisi qancha?",
        correctAnswer: "6 ta baliq",
        distractors: ["5 ta", "7 ta", "0 ta"],
        explanation: "3 + 3 = 6 ta baliq."
      }
    ]
  },

  // 33. Ayirish hadlari (kamayuvchi, ayriluvchi, ayirma)
  {
    bookNumber: 33,
    title: "Ayirish hadlari",
    emoji: "🧩",
    shortDesc: "Kamayuvchi, ayriluvchi, ayirma nomlari, jadval to‘ldirish va ayirma.",
    intro: "Ayirish amalida qatnashuvchi sonlar: kamayuvchi, ayriluvchi va ayirma deyiladi.",
    keyPoints: [
      "Kamayuvchi — dastlabki eng katta son (kamayadigan son).",
      "Ayriluvchi — olib tashlanadigan son.",
      "Ayirma — ayirish amali natijasi. Masalan: 7 (kamayuvchi) − 2 (ayriluvchi) = 5 (ayirma)."
    ],
    miniExample: {
      emojis: "7️⃣ − 2️⃣ = 5️⃣",
      text: "7 — kamayuvchi, 2 — ayriluvchi, 5 — ayirma!"
    },
    xpReward: 85,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "8 − 3 = 5 ifodasida 8 nima deyiladi?",
        correctAnswer: "Kamayuvchi",
        distractors: ["Ayriluvchi", "Ayirma", "Qo‘shiluvchi"],
        explanation: "Dastlabki kamayadigan son kamayuvchi deyiladi."
      },
      {
        text: "8 − 3 = 5 ifodasida 3 nima deyiladi?",
        correctAnswer: "Ayriluvchi",
        distractors: ["Kamayuvchi", "Ayirma", "Yig‘indi"],
        explanation: "Ayirilayotgan son ayriluvchi deyiladi."
      },
      {
        text: "8 − 3 = 5 ifodasida 5 nima deyiladi?",
        correctAnswer: "Ayirma (natija)",
        distractors: ["Kamayuvchi", "Ayriluvchi", "Qo‘shiluvchi"],
        explanation: "Ayirish natijasi ayirma deyiladi."
      }
    ],
    test: [
      {
        text: "6 − 2 = 4 ifodasida 6 soni nima deb ataladi?",
        correctAnswer: "Kamayuvchi",
        distractors: ["Ayriluvchi", "Ayirma", "Yig‘indi"],
        explanation: "6 — kamayuvchi son."
      },
      {
        text: "6 − 2 = 4 ifodasida 2 soni nima deb ataladi?",
        correctAnswer: "Ayriluvchi",
        distractors: ["Kamayuvchi", "Ayirma", "Yig‘indi"],
        explanation: "2 — ayriluvchi son."
      },
      {
        text: "6 − 2 = 4 ifodasida 4 soni nima deb ataladi?",
        correctAnswer: "Ayirma",
        distractors: ["Kamayuvchi", "Ayriluvchi", "Qo‘shiluvchi"],
        explanation: "4 — ayirma."
      },
      {
        text: "Kamayuvchi 9, ayriluvchi 3 bo‘lsa, ayirma nechaga teng?",
        correctAnswer: "6 (chunki 9 − 3 = 6)",
        distractors: ["5", "7", "12"],
        explanation: "9 − 3 = 6."
      },
      {
        text: "Kamayuvchi 8, ayriluvchi 5 bo‘lsa, ayirma nechaga teng?",
        correctAnswer: "3 (chunki 8 − 5 = 3)",
        distractors: ["2", "4", "13"],
        explanation: "8 − 5 = 3."
      },
      {
        text: "Kamayuvchi 10, ayriluvchi 4 bo‘lsa, ayirma nechaga teng?",
        correctAnswer: "6 (chunki 10 − 4 = 6)",
        distractors: ["5", "7", "14"],
        explanation: "10 − 4 = 6."
      },
      {
        text: "Kamayuvchi 7, ayriluvchi 2 bo‘lsa, ayirmani toping.",
        correctAnswer: "5",
        distractors: ["4", "6", "9"],
        explanation: "7 − 2 = 5."
      },
      {
        text: "Kamayuvchi 5, ayriluvchi 1 bo‘lsa, ayirmani toping.",
        correctAnswer: "4",
        distractors: ["3", "5", "6"],
        explanation: "5 − 1 = 4."
      },
      {
        text: "Kamayuvchi 10, ayriluvchi 7 bo‘lsa, ayirmani toping.",
        correctAnswer: "3",
        distractors: ["2", "4", "17"],
        explanation: "10 − 7 = 3."
      },
      {
        text: "Qaysi ifodada ayirma 2 ga teng?",
        correctAnswer: "5 − 3",
        distractors: ["6 − 3", "7 − 4", "4 − 1"],
        explanation: "5 − 3 = 2."
      },
      {
        text: "Qaysi ifodada ayirma 5 ga teng?",
        correctAnswer: "9 − 4",
        distractors: ["8 − 4", "7 − 3", "10 − 4"],
        explanation: "9 − 4 = 5."
      },
      {
        text: "Ayirish amali qaysi belgi bilan yoziladi?",
        correctAnswer: "− (minus belgisi)",
        distractors: ["+ (plyus)", "= (tenglik)", "× (ko‘paytirish)"],
        explanation: "Ayirish amali '−' belgisi bilan yoziladi."
      },
      {
        text: "Kamayuvchi va ayriluvchi teng bo‘lsa (masalan, 6 − 6), ayirma nimaga teng?",
        correctAnswer: "0 ga teng bo‘ladi",
        distractors: ["1 ga teng", "6 ga teng", "12 ga teng"],
        explanation: "Sonning o‘zidan o‘zi ayirilsa 0 qoladi."
      },
      {
        text: "Ayriluvchi 0 bo‘lsa (masalan, 8 − 0), ayirma nimaga teng?",
        correctAnswer: "Kamayuvchining o‘ziga (8 ga) teng",
        distractors: ["0 ga teng", "1 ga teng", "Bilmayman"],
        explanation: "8 − 0 = 8."
      },
      {
        text: "Likopchada 10 ta o‘rik bor edi, 6 tasi yeyildi. Kamayuvchi qaysi son?",
        correctAnswer: "10 (dastlabki barcha o‘riklar)",
        distractors: ["6 (yeyilgan o‘riklar)", "4 (qolgan o‘riklar)", "0"],
        explanation: "Boshlang‘ich son — 10 kamayuvchidir."
      },
      {
        text: "Likopchada 10 ta o‘rikdan 6 tasi yeyildi. Ayriluvchi qaysi son?",
        correctAnswer: "6 (olib tashlangan son)",
        distractors: ["10", "4", "16"],
        explanation: "Yeyilgan 6 ta o‘rik ayriluvchidir."
      },
      {
        text: "Likopchada 10 ta o‘rikdan 6 tasi yeyildi. Ayirma nechaga teng?",
        correctAnswer: "4 ta o‘rik (10 − 6 = 4)",
        distractors: ["5 ta", "3 ta", "6 ta"],
        explanation: "Qolgan 4 ta o‘rik ayirmadir."
      },
      {
        text: "Kamayuvchi 7, ayriluvchi 5 bo‘lgan ifodani toping:",
        correctAnswer: "7 − 5",
        distractors: ["5 − 7", "7 + 5", "5 + 7"],
        explanation: "Kamayuvchi birinchi, ayriluvchi ikkinchi yoziladi: 7 − 5."
      },
      {
        text: "To‘g‘ri ayirmani toping:",
        correctAnswer: "8 − 6 = 2",
        distractors: ["8 − 6 = 3", "8 − 6 = 1", "8 − 6 = 4"],
        explanation: "8 − 6 = 2 to‘g‘ri ayirmadir."
      },
      {
        text: "Shahzod 9 ta misoldan 7 tasini yechdi. Yechilmagan misollar ayirmasi qancha?",
        correctAnswer: "2 ta misol",
        distractors: ["3 ta", "1 ta", "16 ta"],
        explanation: "9 − 7 = 2 ta misol."
      }
    ]
  },

  // 34. Noma’lum qo‘shiluvchini topish (□ + 3 = 8)
  {
    bookNumber: 34,
    title: "Noma’lum qo‘shiluvchini topish",
    emoji: "❓",
    shortDesc: "□ + 3 = 8 ko‘rinishidagi tenglamalar, qoida va so‘zli masalalar.",
    intro: "Noma’lum qo‘shiluvchini topish uchun yig‘indidan ma’lum qo‘shiluvchi ayiriladi.",
    keyPoints: [
      "Qoida: Noma’lum qo‘shiluvchi = Yig‘indi − Ma’lum qo‘shiluvchi.",
      "Misol: □ + 3 = 8 bo‘lsa, □ = 8 − 3 = 5.",
      "Tekshirish: 5 + 3 = 8 (to‘g‘ri!)."
    ],
    miniExample: {
      emojis: "□ + 3️⃣ = 8️⃣",
      text: "□ = 8 − 3 = 5: bo‘sh katakka 5 qo‘yiladi!"
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Tenglikni to‘ldiring: □ + 2 = 6. Katakdagi son nima?",
        correctAnswer: "4",
        distractors: ["3", "5", "8"],
        explanation: "6 − 2 = 4 bo‘ladi."
      },
      {
        text: "Tenglikni to‘ldiring: 3 + □ = 7. Katakdagi son nima?",
        correctAnswer: "4",
        distractors: ["3", "5", "10"],
        explanation: "7 − 3 = 4 bo‘ladi."
      },
      {
        text: "Noma’lum qo‘shiluvchini qanday topamiz?",
        correctAnswer: "Yig‘indidan ikkinchi qo‘shiluvchini ayiramiz",
        distractors: ["Qo‘shiluvchilarni qo‘shamiz", "Bo‘lamiz", "Sonlarni o‘zgartiramiz"],
        explanation: "Noma’lum qo‘shiluvchi yig‘indidan ma’lum qo‘shiluvchini ayirish bilan topiladi."
      }
    ],
    test: [
      {
        text: "Tenglikdagi noma’lum sonni toping: □ + 4 = 7",
        correctAnswer: "3",
        distractors: ["2", "4", "11"],
        explanation: "7 − 4 = 3."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: □ + 5 = 9",
        correctAnswer: "4",
        distractors: ["3", "5", "14"],
        explanation: "9 − 5 = 4."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: 2 + □ = 8",
        correctAnswer: "6",
        distractors: ["5", "7", "10"],
        explanation: "8 − 2 = 6."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: 6 + □ = 10",
        correctAnswer: "4",
        distractors: ["3", "5", "16"],
        explanation: "10 − 6 = 4."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: □ + 3 = 10",
        correctAnswer: "7",
        distractors: ["6", "8", "13"],
        explanation: "10 − 3 = 7."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: 1 + □ = 9",
        correctAnswer: "8",
        distractors: ["7", "9", "10"],
        explanation: "9 − 1 = 8."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: □ + 2 = 5",
        correctAnswer: "3",
        distractors: ["2", "4", "7"],
        explanation: "5 − 2 = 3."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: 7 + □ = 9",
        correctAnswer: "2",
        distractors: ["1", "3", "16"],
        explanation: "9 − 7 = 2."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: □ + 6 = 8",
        correctAnswer: "2",
        distractors: ["1", "3", "14"],
        explanation: "8 − 6 = 2."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: 5 + □ = 8",
        correctAnswer: "3",
        distractors: ["2", "4", "13"],
        explanation: "8 − 5 = 3."
      },
      {
        text: "Noma’lum qo‘shiluvchini topish qoidasi to‘g‘ri berilgan javobni toping:",
        correctAnswer: "Yig‘indidan ma’lum qo‘shiluvchi ayiriladi",
        distractors: ["Yig‘indiga ma’lum qo‘shiluvchi qo‘shiladi", "Qo‘shiluvchilar ko‘paytiriladi", "Ayirmadan ayiriladi"],
        explanation: "Noma’lum qo‘shiluvchi = Yig‘indi − Ma’lum qo‘shiluvchi."
      },
      {
        text: "Tenglikni to‘ldiring: □ + 0 = 6. Katakdagi son nima?",
        correctAnswer: "6",
        distractors: ["0", "5", "7"],
        explanation: "6 − 0 = 6."
      },
      {
        text: "Tenglikni to‘ldiring: 8 + □ = 8. Katakdagi son nima?",
        correctAnswer: "0",
        distractors: ["1", "8", "16"],
        explanation: "8 − 8 = 0."
      },
      {
        text: "Qaysi tenglikda noma’lum son 5 ga teng?",
        correctAnswer: "□ + 2 = 7",
        distractors: ["□ + 3 = 7", "□ + 1 = 7", "□ + 4 = 7"],
        explanation: "7 − 2 = 5."
      },
      {
        text: "Qaysi tenglikda noma’lum son 4 ga teng?",
        correctAnswer: "3 + □ = 7",
        distractors: ["2 + □ = 7", "4 + □ = 9", "1 + □ = 6"],
        explanation: "7 − 3 = 4."
      },
      {
        text: "Avtobusda bir nechta odam bor edi. Bekatda 3 kishi chiqdi va jami 8 kishi bo‘ldi. Avval nechta odam bo‘lgan?",
        correctAnswer: "5 ta odam (8 − 3 = 5)",
        distractors: ["4 ta", "6 ta", "11 ta"],
        explanation: "□ + 3 = 8, demak □ = 8 − 3 = 5."
      },
      {
        text: "Akmal bir nechta daftar oldi. Dadasi yana 2 ta bergach, daftarlari 6 ta bo‘ldi. Akmal avval nechta daftar olgan?",
        correctAnswer: "4 ta daftar",
        distractors: ["3 ta", "5 ta", "8 ta"],
        explanation: "6 − 2 = 4 ta daftar."
      },
      {
        text: "Gulshanning bir nechta guli bor edi. Unga yana 4 ta sovg‘a qilishdi va gullari 9 ta bo‘ldi. Avval nechta guli bo‘lgan?",
        correctAnswer: "5 ta gul",
        distractors: ["4 ta", "6 ta", "13 ta"],
        explanation: "9 − 4 = 5 ta gul."
      },
      {
        text: "Sinfda 10 ta o‘quvchi to‘garakka qatnashadi. Ulardan 6 tasi o‘g‘il bola, qolganlari qiz bola. Qizlar nechta?",
        correctAnswer: "4 ta qiz bola (10 − 6 = 4)",
        distractors: ["5 ta", "3 ta", "16 ta"],
        explanation: "6 + □ = 10, demak □ = 10 − 6 = 4."
      },
      {
        text: "Hovuzda suzayotgan 2 ta o‘rdakka yana bir nechtasi qo‘shildi va jami 7 ta bo‘ldi. Nechta o‘rdak qo‘shilgan?",
        correctAnswer: "5 ta o‘rdak",
        distractors: ["4 ta", "6 ta", "9 ta"],
        explanation: "7 − 2 = 5 ta o‘rdak."
      }
    ]
  },

  // 35. Noma’lum kamayuvchini topish (□ − 4 = 5)
  {
    bookNumber: 35,
    title: "Noma’lum kamayuvchini topish",
    emoji: "❓",
    shortDesc: "□ − 4 = 5 ko‘rinishidagi amallar, qoida va masalalar.",
    intro: "Noma’lum kamayuvchini topish uchun ayirmaga ayriluvchi qo‘shiladi.",
    keyPoints: [
      "Qoida: Noma’lum kamayuvchi = Ayirma + Ayriluvchi.",
      "Misol: □ − 4 = 5 bo‘lsa, □ = 5 + 4 = 9.",
      "Kamayuvchi har doim ayriluvchi va ayirmaning yig‘indisiga teng (eng katta son)."
    ],
    miniExample: {
      emojis: "□ − 4️⃣ = 5️⃣",
      text: "□ = 5 + 4 = 9: dastlab 9 ta narsa bo‘lgan!"
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Tenglikdagi noma’lum kamayuvchini toping: □ − 3 = 4",
        correctAnswer: "7",
        distractors: ["6", "8", "1"],
        explanation: "4 + 3 = 7."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: □ − 2 = 5",
        correctAnswer: "7",
        distractors: ["3", "8", "6"],
        explanation: "5 + 2 = 7."
      },
      {
        text: "Noma’lum kamayuvchini qanday qoida bilan topamiz?",
        correctAnswer: "Ayirmaga ayriluvchini qo‘shamiz",
        distractors: ["Ayirmadan ayriluvchini ayiramiz", "Bo‘lamiz", "Faqat taxmin qilamiz"],
        explanation: "Kamayuvchi = Ayirma + Ayriluvchi."
      }
    ],
    test: [
      {
        text: "Tenglikdagi noma’lum sonni toping: □ − 1 = 6",
        correctAnswer: "7",
        distractors: ["5", "8", "6"],
        explanation: "6 + 1 = 7."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: □ − 2 = 6",
        correctAnswer: "8",
        distractors: ["4", "7", "9"],
        explanation: "6 + 2 = 8."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: □ − 3 = 5",
        correctAnswer: "8",
        distractors: ["2", "7", "9"],
        explanation: "5 + 3 = 8."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: □ − 4 = 6",
        correctAnswer: "10",
        distractors: ["2", "9", "8"],
        explanation: "6 + 4 = 10."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: □ − 5 = 2",
        correctAnswer: "7",
        distractors: ["3", "6", "8"],
        explanation: "2 + 5 = 7."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: □ − 2 = 8",
        correctAnswer: "10",
        distractors: ["6", "9", "7"],
        explanation: "8 + 2 = 10."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: □ − 4 = 3",
        correctAnswer: "7",
        distractors: ["1", "6", "8"],
        explanation: "3 + 4 = 7."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: □ − 3 = 3",
        correctAnswer: "6",
        distractors: ["0", "5", "7"],
        explanation: "3 + 3 = 6."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: □ − 5 = 5",
        correctAnswer: "10",
        distractors: ["0", "8", "9"],
        explanation: "5 + 5 = 10."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: □ − 1 = 8",
        correctAnswer: "9",
        distractors: ["7", "10", "8"],
        explanation: "8 + 1 = 9."
      },
      {
        text: "Noma’lum kamayuvchini topish formulasi qaysi?",
        correctAnswer: "Kamayuvchi = Ayirma + Ayriluvchi",
        distractors: ["Kamayuvchi = Ayirma − Ayriluvchi", "Kamayuvchi = Ayriluvchi − Ayirma", "Kamayuvchi = Yig‘indi + 1"],
        explanation: "Kamayuvchi ayirma va ayriluvchi yig‘indisiga teng."
      },
      {
        text: "Tenglikni to‘ldiring: □ − 0 = 7. Katakdagi son nima?",
        correctAnswer: "7",
        distractors: ["0", "6", "8"],
        explanation: "7 + 0 = 7."
      },
      {
        text: "Qaysi tenglikda noma’lum kamayuvchi 9 ga teng?",
        correctAnswer: "□ − 4 = 5",
        distractors: ["□ − 3 = 5", "□ − 5 = 5", "□ − 2 = 5"],
        explanation: "5 + 4 = 9."
      },
      {
        text: "Qaysi tenglikda noma’lum kamayuvchi 8 ga teng?",
        correctAnswer: "□ − 2 = 6",
        distractors: ["□ − 3 = 6", "□ − 1 = 6", "□ − 4 = 6"],
        explanation: "6 + 2 = 8."
      },
      {
        text: "Savatda bir nechta olma bor edi. 3 tasi yeyilgach, 5 ta olma qoldi. Dastlab savatda nechta olma bo‘lgan?",
        correctAnswer: "8 ta olma (5 + 3 = 8)",
        distractors: ["2 ta", "7 ta", "9 ta"],
        explanation: "□ − 3 = 5, demak □ = 5 + 3 = 8 ta olma."
      },
      {
        text: "Shoxdan 2 ta qush uchib ketdi va 4 ta qush qoldi. Dastlab shoxda nechta qush bo‘lgan?",
        correctAnswer: "6 ta qush (4 + 2 = 6)",
        distractors: ["2 ta", "5 ta", "7 ta"],
        explanation: "4 + 2 = 6 ta qush."
      },
      {
        text: "Botir bir nechta daftar sotib oldi. 2 tasini ishlatgach, 7 ta yangi daftari qoldi. Dastlab nechta daftar bo‘lgan?",
        correctAnswer: "9 ta daftar",
        distractors: ["5 ta", "8 ta", "10 ta"],
        explanation: "7 + 2 = 9 ta daftar."
      },
      {
        text: "Avtobusdan 4 kishi tushgach, ichkarida 6 kishi qoldi. Dastlab avtobusda nechta yo‘lovchi bo‘lgan?",
        correctAnswer: "10 ta yo‘lovchi",
        distractors: ["2 ta", "8 ta", "9 ta"],
        explanation: "6 + 4 = 10 ta yo‘lovchi."
      },
      {
        text: "Kamola dugonalariga 5 ta konfet ulashgach, o‘zida 3 ta qoldi. Dastlab unda nechta konfet bor edi?",
        correctAnswer: "8 ta konfet",
        distractors: ["2 ta", "7 ta", "9 ta"],
        explanation: "3 + 5 = 8 ta konfet."
      },
      {
        text: "Akvariumdan 1 ta baliq olib qo‘yilgach, 8 ta baliq qoldi. Dastlab akvariumda nechta baliq bo‘lgan?",
        correctAnswer: "9 ta baliq",
        distractors: ["7 ta", "10 ta", "8 ta"],
        explanation: "8 + 1 = 9 ta baliq."
      }
    ]
  },

  // 36. Noma’lum ayriluvchini topish (8 − □ = 7)
  {
    bookNumber: 36,
    title: "Noma’lum ayriluvchini topish",
    emoji: "❓",
    shortDesc: "8 − □ = 7 ko‘rinishidagi amallar, qoida va javobni tekshirish.",
    intro: "Noma’lum ayriluvchini topish uchun kamayuvchidan ayirma ayiriladi.",
    keyPoints: [
      "Qoida: Noma’lum ayriluvchi = Kamayuvchi − Ayirma.",
      "Misol: 8 − □ = 7 bo‘lsa, □ = 8 − 7 = 1.",
      "Tekshirish: 8 − 1 = 7 (to‘g‘ri!)."
    ],
    miniExample: {
      emojis: "8️⃣ − □ = 7️⃣",
      text: "□ = 8 − 7 = 1: bo‘sh katakka 1 qo‘yiladi!"
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Tenglikdagi noma’lum ayriluvchini toping: 7 − □ = 4",
        correctAnswer: "3",
        distractors: ["2", "4", "11"],
        explanation: "7 − 4 = 3 bo‘ladi."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: 9 − □ = 7",
        correctAnswer: "2",
        distractors: ["1", "3", "16"],
        explanation: "9 − 7 = 2 bo‘ladi."
      },
      {
        text: "Noma’lum ayriluvchini topish uchun nima qilamiz?",
        correctAnswer: "Kamayuvchidan ayirmani ayiramiz",
        distractors: ["Kamayuvchiga ayirmani qo‘shamiz", "Bo‘lamiz", "Nol qo‘yamiz"],
        explanation: "Ayriluvchi = Kamayuvchi − Ayirma."
      }
    ],
    test: [
      {
        text: "Tenglikdagi noma’lum sonni toping: 6 − □ = 4",
        correctAnswer: "2",
        distractors: ["1", "3", "10"],
        explanation: "6 − 4 = 2."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: 8 − □ = 5",
        correctAnswer: "3",
        distractors: ["2", "4", "13"],
        explanation: "8 − 5 = 3."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: 7 − □ = 2",
        correctAnswer: "5",
        distractors: ["4", "6", "9"],
        explanation: "7 − 2 = 5."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: 9 − □ = 6",
        correctAnswer: "3",
        distractors: ["2", "4", "15"],
        explanation: "9 − 6 = 3."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: 10 − □ = 8",
        correctAnswer: "2",
        distractors: ["1", "3", "18"],
        explanation: "10 − 8 = 2."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: 10 − □ = 4",
        correctAnswer: "6",
        distractors: ["5", "7", "14"],
        explanation: "10 − 4 = 6."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: 8 − □ = 1",
        correctAnswer: "7",
        distractors: ["6", "8", "9"],
        explanation: "8 − 1 = 7."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: 5 − □ = 1",
        correctAnswer: "4",
        distractors: ["3", "5", "6"],
        explanation: "5 − 1 = 4."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: 6 − □ = 1",
        correctAnswer: "5",
        distractors: ["4", "6", "7"],
        explanation: "6 − 1 = 5."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: 9 − □ = 5",
        correctAnswer: "4",
        distractors: ["3", "5", "14"],
        explanation: "9 − 5 = 4."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: 10 − □ = 3",
        correctAnswer: "7",
        distractors: ["6", "8", "13"],
        explanation: "10 − 3 = 7."
      },
      {
        text: "Tenglikdagi noma’lum sonni toping: 7 − □ = 7",
        correctAnswer: "0",
        distractors: ["1", "7", "14"],
        explanation: "7 − 7 = 0."
      },
      {
        text: "Noma’lum ayriluvchini topish qoidasi qaysi?",
        correctAnswer: "Ayriluvchi = Kamayuvchi − Ayirma",
        distractors: ["Ayriluvchi = Kamayuvchi + Ayirma", "Ayriluvchi = Ayirma − Kamayuvchi", "Ayriluvchi = Yig‘indi + 1"],
        explanation: "Ayriluvchi = Kamayuvchi − Ayirma."
      },
      {
        text: "Qaysi tenglikda noma’lum ayriluvchi 3 ga teng?",
        correctAnswer: "8 − □ = 5",
        distractors: ["8 − □ = 4", "8 − □ = 6", "8 − □ = 2"],
        explanation: "8 − 5 = 3."
      },
      {
        text: "Qaysi tenglikda noma’lum ayriluvchi 2 ga teng?",
        correctAnswer: "7 − □ = 5",
        distractors: ["7 − □ = 4", "7 − □ = 6", "7 − □ = 3"],
        explanation: "7 − 5 = 2."
      },
      {
        text: "Likopchada 8 ta shirinlik bor edi. Bolalar bir nechtasini yeyishgach, 5 ta shirinlik qoldi. Nechta shirinlik yeyilgan?",
        correctAnswer: "3 ta shirinlik (8 − 5 = 3)",
        distractors: ["2 ta", "4 ta", "13 ta"],
        explanation: "8 − □ = 5, demak □ = 8 − 5 = 3 ta shirinlik."
      },
      {
        text: "Daraxtda 9 ta qush bor edi. Bir nechtasi uchib ketgach, 6 ta qush qoldi. Nechta qush uchib ketgan?",
        correctAnswer: "3 ta qush",
        distractors: ["2 ta", "4 ta", "15 ta"],
        explanation: "9 − 6 = 3 ta qush."
      },
      {
        text: "Anvarda 10 ta yong‘oq bor edi. U ukasiga bir nechtasini berdi va o‘zida 7 ta qoldi. Ukasiga nechta bergan?",
        correctAnswer: "3 ta yong‘oq",
        distractors: ["2 ta", "4 ta", "17 ta"],
        explanation: "10 − 7 = 3 ta yong‘oq."
      },
      {
        text: "Savatda 6 ta olma bor edi. Bir nechta olma olingach, 2 ta olma qoldi. Nechta olma olingan?",
        correctAnswer: "4 ta olma",
        distractors: ["3 ta", "5 ta", "8 ta"],
        explanation: "6 − 2 = 4 ta olma."
      },
      {
        text: "Garajda 8 ta mashina bor edi. Bir nechtasi yo‘lga chiqqach, 4 ta mashina qoldi. Nechta mashina yo‘lga chiqqan?",
        correctAnswer: "4 ta mashina",
        distractors: ["3 ta", "5 ta", "12 ta"],
        explanation: "8 − 4 = 4 ta mashina."
      }
    ]
  },

  // 37. Qo‘shish va ayirish orasidagi o‘zaro bog‘liqlik
  {
    bookNumber: 37,
    title: "Qo‘shish va ayirish orasidagi o‘zaro bog‘liqlik",
    emoji: "🔄",
    shortDesc: "Teskari amallar, 3+4=7 dan 7-3=4 va 7-4=3 hosil qilish va tekshirish.",
    intro: "Qo‘shish va ayirish — bir-biriga teskari amallardir.",
    keyPoints: [
      "Agar 3 + 4 = 7 bo‘lsa, u holda 7 − 3 = 4 va 7 − 4 = 3 bo‘ladi.",
      "Yig‘indidan bir qo‘shiluvchi ayirilsa, ikkinchi qo‘shiluvchi chiqadi.",
      "Qo‘shish natijasini ayirish bilan tekshirish mumkin."
    ],
    miniExample: {
      emojis: "3️⃣ + 4️⃣ = 7️⃣ 🔄 7️⃣ − 4️⃣ = 3️⃣",
      text: "Qo‘shish va ayirish doim bir-birini tekshiradi!"
    },
    xpReward: 85,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Agar 2 + 5 = 7 bo‘lsa, 7 − 5 necha bo‘ladi?",
        correctAnswer: "2",
        distractors: ["3", "5", "7"],
        explanation: "Qo‘shishdan ayirish hosil qilinadi: 7 − 5 = 2."
      },
      {
        text: "Agar 6 + 3 = 9 bo‘lsa, 9 − 6 necha bo‘ladi?",
        correctAnswer: "3",
        distractors: ["2", "4", "6"],
        explanation: "9 − 6 = 3."
      },
      {
        text: "Qo‘shish amaliga qaysi amal teskari?",
        correctAnswer: "Ayirish amali",
        distractors: ["Ko‘paytirish amali", "Taqqoslash amali", "Qo‘shishning o‘zi"],
        explanation: "Ayirish qo‘shishning teskari amalidir."
      }
    ],
    test: [
      {
        text: "3 + 4 = 7 tengligidan qaysi ayirish tengligi kelib chiqadi?",
        correctAnswer: "7 − 3 = 4",
        distractors: ["7 + 3 = 10", "4 − 3 = 1", "7 − 1 = 6"],
        explanation: "Yig‘indidan 3 ayirilsa 4 qoladi."
      },
      {
        text: "4 + 5 = 9 tengligidan qaysi ayirish tengligi kelib chiqadi?",
        correctAnswer: "9 − 5 = 4",
        distractors: ["9 + 4 = 13", "5 − 4 = 1", "9 − 1 = 8"],
        explanation: "9 − 5 = 4."
      },
      {
        text: "Agar 5 + 3 = 8 bo‘lsa, 8 − 3 nechaga teng?",
        correctAnswer: "5",
        distractors: ["3", "8", "2"],
        explanation: "8 − 3 = 5."
      },
      {
        text: "Agar 6 + 2 = 8 bo‘lsa, 8 − 2 nechaga teng?",
        correctAnswer: "6",
        distractors: ["4", "2", "8"],
        explanation: "8 − 2 = 6."
      },
      {
        text: "Agar 7 + 3 = 10 bo‘lsa, 10 − 7 nechaga teng?",
        correctAnswer: "3",
        distractors: ["7", "10", "4"],
        explanation: "10 − 7 = 3."
      },
      {
        text: "Agar 1 + 8 = 9 bo‘lsa, 9 − 8 nechaga teng?",
        correctAnswer: "1",
        distractors: ["2", "8", "0"],
        explanation: "9 − 8 = 1."
      },
      {
        text: "8 − 3 = 5 tengligini qaysi qo‘shish ifodasi bilan tekshirish mumkin?",
        correctAnswer: "5 + 3 = 8",
        distractors: ["8 + 3 = 11", "5 − 3 = 2", "8 + 5 = 13"],
        explanation: "Ayirmaga ayriluvchini qo‘shsak kamayuvchi chiqadi: 5 + 3 = 8."
      },
      {
        text: "10 − 4 = 6 tengligini qaysi qo‘shish ifodasi bilan tekshirish mumkin?",
        correctAnswer: "6 + 4 = 10",
        distractors: ["10 + 4 = 14", "6 − 4 = 2", "10 − 6 = 4"],
        explanation: "6 + 4 = 10."
      },
      {
        text: "7 − 2 = 5 tengligini qaysi qo‘shish bilan tekshiramiz?",
        correctAnswer: "5 + 2 = 7",
        distractors: ["7 + 2 = 9", "5 − 2 = 3", "7 + 5 = 12"],
        explanation: "5 + 2 = 7."
      },
      {
        text: "Agar a + b = c bo‘lsa, c − a nimaga teng?",
        correctAnswer: "b ga teng",
        distractors: ["a ga teng", "c ga teng", "0 ga teng"],
        explanation: "Yig‘indidan birinchi qo‘shiluvchini ayirsak, ikkinchi qo‘shiluvchi b chiqadi."
      },
      {
        text: "Agar a + b = c bo‘lsa, c − b nimaga teng?",
        correctAnswer: "a ga teng",
        distractors: ["b ga teng", "c ga teng", "1 ga teng"],
        explanation: "c − b = a."
      },
      {
        text: "2 + 6 = 8 tengligiga mos bo‘lmagan ifodani toping:",
        correctAnswer: "8 + 2 = 10 (chunki bu yangi ifoda)",
        distractors: ["8 − 6 = 2", "8 − 2 = 6", "6 + 2 = 8"],
        explanation: "8 + 2 = 10 ifodasi 2+6=8 dan bevosita kelib chiqmaydi."
      },
      {
        text: "1 + 7 = 8 tengligidan ikkita ayirish ifodasi tuzing:",
        correctAnswer: "8 − 7 = 1 va 8 − 1 = 7",
        distractors: ["8 + 1 = 9 va 8 + 7 = 15", "7 − 1 = 6 va 8 − 0 = 8", "8 − 2 = 6 va 8 − 3 = 5"],
        explanation: "Bitta qo‘shish tengligidan 2 ta ayirish hosil qilinadi."
      },
      {
        text: "Qaysi juftlik o‘zaro teskari bog‘langan tengliklar hisoblanadi?",
        correctAnswer: "4 + 3 = 7 va 7 − 3 = 4",
        distractors: ["4 + 3 = 7 va 5 + 2 = 7", "4 − 3 = 1 va 1 + 2 = 3", "7 − 4 = 3 va 6 − 3 = 3"],
        explanation: "4 + 3 = 7 va 7 − 3 = 4 bir-biriga teskari tengliklardir."
      },
      {
        text: "Ali 5 ta qizil va 4 ta sariq olma terib, jami 9 ta qildi (5 + 4 = 9). Agar u 4 ta sariq olmani olib qo‘ysa, nechta olma qoladi?",
        correctAnswer: "5 ta qizil olma (9 − 4 = 5)",
        distractors: ["4 ta", "9 ta", "1 ta"],
        explanation: "9 − 4 = 5 ta qizil olma qoladi."
      },
      {
        text: "Sinfda 8 ta bola bor edi. 3 tasi sport to‘garagiga ketgach 5 tasi qoldi (8 − 3 = 5). Qaytganlarida yana nechta bo‘ladi?",
        correctAnswer: "8 ta bola (5 + 3 = 8)",
        distractors: ["6 ta", "7 ta", "10 ta"],
        explanation: "5 + 3 = 8 ta bola."
      },
      {
        text: "9 − 7 = 2 ifodasi to‘g‘ri yechilganini tekshirish uchun nima qilamiz?",
        correctAnswer: "2 ga 7 ni qo‘shamiz: 2 + 7 = 9",
        distractors: ["9 dan 2 ni ayiramiz: 9 − 2 = 7", "9 ga 7 ni qo‘shamiz", "7 dan 2 ni ayiramiz"],
        explanation: "Ayirmaga ayriluvchini qo‘shib tekshiriladi: 2 + 7 = 9."
      },
      {
        text: "6 − 5 = 1 ifodasini tekshirish uchun to‘g‘ri qo‘shish ifodasi qaysi?",
        correctAnswer: "1 + 5 = 6",
        distractors: ["6 + 1 = 7", "5 − 1 = 4", "6 + 5 = 11"],
        explanation: "1 + 5 = 6."
      },
      {
        text: "Agar bitta savatdagi 10 ta mevaning 6 tasi nok bo‘lsa, qolganlari olma. Olmalar nechta?",
        correctAnswer: "4 ta olma (10 − 6 = 4)",
        distractors: ["5 ta", "6 ta", "16 ta"],
        explanation: "6 + 4 = 10, demak 10 − 6 = 4."
      },
      {
        text: "3 + 6 = 9 bo‘lsa, 9 − 3 nimaga teng bo‘ladi?",
        correctAnswer: "6",
        distractors: ["3", "9", "5"],
        explanation: "9 − 3 = 6."
      }
    ]
  },

  // 38. Qo‘shishning o‘rin almashtirish xossasi (a + b = b + a)
  {
    bookNumber: 38,
    title: "Qo‘shishning o‘rin almashtirish xossasi",
    emoji: "🔁",
    shortDesc: "a + b = b + a qoidasi, yig‘indining o‘zgarmasligi va qulay hisoblash.",
    intro: "Qo‘shiluvchilarning o‘rni almashgani bilan yig‘indi o‘zgarmaydi: a + b = b + a.",
    keyPoints: [
      "Qoida: Qo‘shiluvchilar o‘rni almashsa ham natija bir xil bo‘ladi.",
      "Masalan: 4 + 2 = 6 va 2 + 4 = 6.",
      "Katta songa kichik sonni qo‘shish osonroq va qulayroq."
    ],
    miniExample: {
      emojis: "4️⃣ + 2️⃣ = 2️⃣ + 4️⃣ = 6️⃣",
      text: "4 + 2 bo‘ladimi yoki 2 + 4 bo‘ladimi — yig‘indi baribir 6!"
    },
    xpReward: 85,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Qo‘shiluvchilarning o‘rni almashsa yig‘indi qanday o‘zgaradi?",
        correctAnswer: "Yig‘indi o‘zgarmaydi",
        distractors: ["Kattalashadi", "Kamayadi", "Nol bo‘ladi"],
        explanation: "Qo‘shishning o‘rin almashtirish qonuniga ko‘ra yig‘indi o‘zgarmaydi."
      },
      {
        text: "3 + 5 = 8 bo‘lsa, 5 + 3 necha bo‘ladi?",
        correctAnswer: "8",
        distractors: ["7", "9", "2"],
        explanation: "O‘rni almashgani bilan yig‘indi 8 bo‘lib qoladi."
      },
      {
        text: "1 + 7 ni hisoblash uchun qaysi usul qulayroq?",
        correctAnswer: "7 ga 1 ni qo‘shish (7 + 1 = 8)",
        distractors: ["1 ga 7 marta 1 qo‘shish", "8 dan 1 ayirish", "Faqat barmoqda sanash"],
        explanation: "Katta songa kichik sonni qo‘shish tez va qulaydir."
      }
    ],
    test: [
      {
        text: "Qo‘shishning o‘rin almashtirish qoidasi qaysi javobda to‘g‘ri ifodalangan?",
        correctAnswer: "a + b = b + a",
        distractors: ["a − b = b − a", "a + b = a − b", "a + 0 = 0"],
        explanation: "Qo‘shiluvchilar o‘rni almashsa ham yig‘indi teng: a + b = b + a."
      },
      {
        text: "Agar 2 + 6 = 8 bo‘lsa, 6 + 2 nechaga teng?",
        correctAnswer: "8",
        distractors: ["7", "9", "4"],
        explanation: "6 + 2 = 8."
      },
      {
        text: "Agar 3 + 7 = 10 bo‘lsa, 7 + 3 nechaga teng?",
        correctAnswer: "10",
        distractors: ["9", "11", "4"],
        explanation: "7 + 3 = 10."
      },
      {
        text: "Agar 1 + 9 = 10 bo‘lsa, 9 + 1 nechaga teng?",
        correctAnswer: "10",
        distractors: ["9", "8", "11"],
        explanation: "9 + 1 = 10."
      },
      {
        text: "Agar 4 + 5 = 9 bo‘lsa, 5 + 4 nechaga teng?",
        correctAnswer: "9",
        distractors: ["8", "10", "1"],
        explanation: "5 + 4 = 9."
      },
      {
        text: "Qaysi tenglik qo‘shishning o‘rin almashtirish xossasini ko‘rsatadi?",
        correctAnswer: "3 + 4 = 4 + 3",
        distractors: ["3 + 4 = 7", "7 − 3 = 4", "4 + 3 = 7"],
        explanation: "3 + 4 = 4 + 3 o‘rin almashtirishni bevosita ifodalaydi."
      },
      {
        text: "Qaysi tenglik to‘g‘ri?",
        correctAnswer: "6 + 1 = 1 + 6",
        distractors: ["6 − 1 = 1 − 6", "6 + 1 = 6 − 1", "6 + 0 = 0 + 0"],
        explanation: "6 + 1 = 1 + 6 to‘g‘ri tenglikdir."
      },
      {
        text: "Ayirish amalida o‘rin almashtirish xossasi o‘rinlimi (masalan, 5 − 2 va 2 − 5 bir xilmi)?",
        correctAnswer: "Yo‘q, ayirishda o‘rin almashtirib bo‘lmaydi!",
        distractors: ["Ha, albatta bir xil", "Faqat qishda bir xil", "Har doim bir xil"],
        explanation: "Ayirishda sonlar o‘rnini almashtirib bo‘lmaydi: 5 − 2 = 3, lekin 2 dan 5 ni ayirib bo‘lmaydi."
      },
      {
        text: "2 + 8 ni qulay hisoblash uchun qanday yozish yaxshi?",
        correctAnswer: "8 + 2 (katta songa kichik son qo‘shiladi)",
        distractors: ["8 − 2", "2 + 2 + 2 + 2", "10 − 2"],
        explanation: "8 ga 2 ni qo‘shish hisoblashni osonlashtiradi."
      },
      {
        text: "1 + 6 ni qulay hisoblash uchun qanday yozamiz?",
        correctAnswer: "6 + 1",
        distractors: ["6 − 1", "1 + 1 + 6", "7 − 1"],
        explanation: "6 + 1 = 7."
      },
      {
        text: "Tenglikni to‘ldiring: 5 + 3 = 3 + □. Katakdagi son nima?",
        correctAnswer: "5",
        distractors: ["3", "8", "2"],
        explanation: "5 + 3 = 3 + 5."
      },
      {
        text: "Tenglikni to‘ldiring: 7 + 2 = □ + 7. Katakdagi son nima?",
        correctAnswer: "2",
        distractors: ["7", "9", "5"],
        explanation: "7 + 2 = 2 + 7."
      },
      {
        text: "Tenglikni to‘ldiring: 4 + 6 = 6 + □. Katakdagi son nima?",
        correctAnswer: "4",
        distractors: ["6", "10", "2"],
        explanation: "4 + 6 = 6 + 4."
      },
      {
        text: "Tenglikni to‘ldiring: □ + 8 = 8 + 1. Katakdagi son nima?",
        correctAnswer: "1",
        distractors: ["8", "9", "0"],
        explanation: "1 + 8 = 8 + 1."
      },
      {
        text: "Quyidagi ifodalardan qaysi biri 2 + 7 ifodasiga teng?",
        correctAnswer: "7 + 2",
        distractors: ["7 − 2", "2 + 8", "9 − 2"],
        explanation: "2 + 7 = 7 + 2."
      },
      {
        text: "Akmal 2 ta olma, so‘ng 4 ta nok yedi. Singlisi esa avval 4 ta nok, so‘ng 2 ta olma yedi. Ular yegan mevalar soni tengmi?",
        correctAnswer: "Teng (2 + 4 = 4 + 2 = 6)",
        distractors: ["Akmal ko‘p yedi", "Singlisi ko‘p yedi", "Taqqoslab bo‘lmaydi"],
        explanation: "Qo‘shiluvchilar o‘rni almashgani bilan yig‘indi 6 bo‘lib qoladi."
      },
      {
        text: "1-savatchada 3 ta, 2-savatchada 5 ta gul bor. Savatlarning o‘rnini almashtirsak, jami gullar soni o‘zgaradimi?",
        correctAnswer: "O‘zgarmaydi, jami 8 ta gul bo‘ladi",
        distractors: ["Ko‘payadi", "Kamayadi", "Nol bo‘ladi"],
        explanation: "3 + 5 = 5 + 3 = 8."
      },
      {
        text: "Sobir 8 ga 1 ni qo‘shdi, Karim esa 1 ga 8 ni qo‘shdi. Ularning natijalari qanday?",
        correctAnswer: "Ikkalasida ham bir xil (9)",
        distractors: ["Sobirda ko‘p", "Karimda ko‘p", "Ikkalasida xato"],
        explanation: "8 + 1 = 9 va 1 + 8 = 9."
      },
      {
        text: "To‘g‘ri tenglikni toping:",
        correctAnswer: "5 + 4 = 4 + 5",
        distractors: ["5 + 4 = 5 − 4", "5 + 4 = 9 + 1", "5 − 4 = 4 − 5"],
        explanation: "5 + 4 = 4 + 5 to‘g‘ri."
      },
      {
        text: "Qo‘shishning o‘rin almashtirish xossasidan foydalanib 3 + 6 ifodasini o‘zgartiring:",
        correctAnswer: "6 + 3",
        distractors: ["6 − 3", "3 − 6", "9 + 3"],
        explanation: "3 + 6 ning o‘rni almashsa 6 + 3 bo‘ladi."
      }
    ]
  },

  // 39. Qo‘shish jadvali
  {
    bookNumber: 39,
    title: "Qo‘shish jadvali",
    emoji: "📋",
    shortDesc: "Qo‘shish jadvalidan yig‘indini topish, jadvalni to‘ldirish va mos qo‘shiluvchi.",
    intro: "Qo‘shish jadvali 10 ichidagi barcha yig‘indilarni tez va oson eslab qolishga yordam beradi.",
    keyPoints: [
      "Jadvalda qator va ustundagi sonlar qo‘shiladi.",
      "Masalan, 3-qator va 4-ustun kesishmasida 7 soni turadi (3 + 4 = 7).",
      "Jadval yordamida har qanday yig‘indini tekshirish mumkin."
    ],
    miniExample: {
      emojis: "📊 ➕ = 🔟",
      text: "Jadvaldan qaraymiz: 4 va 5 kesishmasida 9 soni turadi!"
    },
    xpReward: 85,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Jadval bo‘yicha 4 va 3 ning yig‘indisini toping: 4 + 3 = ?",
        correctAnswer: "7",
        distractors: ["6", "8", "9"],
        explanation: "4 + 3 = 7."
      },
      {
        text: "Jadval bo‘yicha 5 va 4 ning yig‘indisini toping: 5 + 4 = ?",
        correctAnswer: "9",
        distractors: ["8", "10", "7"],
        explanation: "5 + 4 = 9."
      },
      {
        text: "Qaysi ikki sonning yig‘indisi 10 ga teng?",
        correctAnswer: "5 va 5",
        distractors: ["4 va 5", "6 va 3", "7 va 2"],
        explanation: "5 + 5 = 10."
      }
    ],
    test: [
      {
        text: "Qo‘shish jadvali bo‘yicha 2 + 5 nechaga teng?",
        correctAnswer: "7",
        distractors: ["6", "8", "9"],
        explanation: "2 + 5 = 7."
      },
      {
        text: "Qo‘shish jadvali bo‘yicha 3 + 6 nechaga teng?",
        correctAnswer: "9",
        distractors: ["8", "10", "7"],
        explanation: "3 + 6 = 9."
      },
      {
        text: "Qo‘shish jadvali bo‘yicha 4 + 4 nechaga teng?",
        correctAnswer: "8",
        distractors: ["7", "9", "6"],
        explanation: "4 + 4 = 8."
      },
      {
        text: "Qo‘shish jadvali bo‘yicha 1 + 8 nechaga teng?",
        correctAnswer: "9",
        distractors: ["8", "10", "7"],
        explanation: "1 + 8 = 9."
      },
      {
        text: "Qo‘shish jadvali bo‘yicha 6 + 4 nechaga teng?",
        correctAnswer: "10",
        distractors: ["9", "8", "11"],
        explanation: "6 + 4 = 10."
      },
      {
        text: "Qo‘shish jadvali bo‘yicha 7 + 2 nechaga teng?",
        correctAnswer: "9",
        distractors: ["8", "10", "6"],
        explanation: "7 + 2 = 9."
      },
      {
        text: "Qo‘shish jadvali bo‘yicha 3 + 5 nechaga teng?",
        correctAnswer: "8",
        distractors: ["7", "9", "6"],
        explanation: "3 + 5 = 8."
      },
      {
        text: "Qo‘shish jadvalida yig‘indisi 6 bo‘lgan qatorni toping:",
        correctAnswer: "3 + 3 = 6",
        distractors: ["4 + 3 = 6", "2 + 5 = 6", "1 + 6 = 6"],
        explanation: "3 + 3 = 6."
      },
      {
        text: "Qo‘shish jadvalida yig‘indisi 7 bo‘lgan qatorni toping:",
        correctAnswer: "5 + 2 = 7",
        distractors: ["4 + 2 = 7", "6 + 2 = 7", "3 + 3 = 7"],
        explanation: "5 + 2 = 7."
      },
      {
        text: "Qo‘shish jadvalida yig‘indisi 10 bo‘lgan qatorni toping:",
        correctAnswer: "8 + 2 = 10",
        distractors: ["7 + 2 = 10", "9 + 2 = 10", "6 + 3 = 10"],
        explanation: "8 + 2 = 10."
      },
      {
        text: "Jadval katagida 5 va □ kesishmasida 8 turibdi. □ o‘rnidagi son nima?",
        correctAnswer: "3",
        distractors: ["2", "4", "1"],
        explanation: "5 + 3 = 8."
      },
      {
        text: "Jadval katagida 6 va □ kesishmasida 9 turibdi. □ o‘rnidagi son nima?",
        correctAnswer: "3",
        distractors: ["2", "4", "5"],
        explanation: "6 + 3 = 9."
      },
      {
        text: "Jadval katagida 7 va □ kesishmasida 10 turibdi. □ o‘rnidagi son nima?",
        correctAnswer: "3",
        distractors: ["2", "4", "1"],
        explanation: "7 + 3 = 10."
      },
      {
        text: "Jadval katagida 4 va □ kesishmasida 6 turibdi. □ o‘rnidagi son nima?",
        correctAnswer: "2",
        distractors: ["1", "3", "4"],
        explanation: "4 + 2 = 6."
      },
      {
        text: "Qo‘shish jadvalida eng katta yig‘indi (10 ichida) qaysi son?",
        correctAnswer: "10",
        distractors: ["9", "8", "11"],
        explanation: "10 ichidagi jadvalda eng katta son 10 dir."
      },
      {
        text: "Qo‘shish jadvalida eng kichik natural yig‘indi qaysi son?",
        correctAnswer: "2 (chunki 1 + 1 = 2)",
        distractors: ["1", "0", "3"],
        explanation: "1 + 1 = 2 eng kichik natural yig‘indidir."
      },
      {
        text: "Madina jadvaldan 4 + 5 ni qidirib 9 sonini topdi. U to‘g‘ri topdimi?",
        correctAnswer: "Ha, 4 + 5 = 9 to‘g‘ri",
        distractors: ["Yo‘q, 8 bo‘lishi kerak", "Yo‘q, 10 bo‘lishi kerak", "Jadvalda bunday son yo‘q"],
        explanation: "4 + 5 = 9 to‘g‘ri."
      },
      {
        text: "Jadvalda 2 soniga qaysi son qo‘shilsa 9 chiqadi?",
        correctAnswer: "7",
        distractors: ["6", "8", "5"],
        explanation: "2 + 7 = 9."
      },
      {
        text: "Jadvalda 1 soniga qaysi son qo‘shilsa 8 chiqadi?",
        correctAnswer: "7",
        distractors: ["6", "8", "9"],
        explanation: "1 + 7 = 8."
      },
      {
        text: "Jadvalda bir xil sonlar qo‘shilgan qatorni toping:",
        correctAnswer: "4 + 4 = 8",
        distractors: ["4 + 3 = 7", "4 + 5 = 9", "4 + 2 = 6"],
        explanation: "4 va 4 bir xil sonlardir (4 + 4 = 8)."
      }
    ]
  },

  // 40. Taqqoslash xossasi (6 > 3 bo‘lgani uchun a + 6 > a + 3)
  {
    bookNumber: 40,
    title: "Taqqoslash xossasi",
    emoji: "⚖️",
    shortDesc: "Hisoblamay taqqoslash, 6 > 3 bo‘lsa a + 6 > a + 3 qoidasi.",
    intro: "Bir xil songa kattaroq son qo‘shilsa, natija ham kattaroq bo‘ladi.",
    keyPoints: [
      "Qoida: Agar b > c bo‘lsa, u holda a + b > a + c bo‘ladi.",
      "Misol: 6 > 3 bo‘lgani uchun, 2 + 6 > 2 + 3.",
      "Hisoblab o‘tirmasdan, qo‘shilayotgan sonlarga qarab taqqoslash mumkin."
    ],
    miniExample: {
      emojis: "6️⃣ > 3️⃣ ➡️ (2+6) > (2+3)",
      text: "6 katta 3 dan, demak 2 ga 6 ni qo‘shsak kattaroq chiqadi!"
    },
    xpReward: 85,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Hisoblamay taqqoslang: 4 + 5 ... 4 + 2. Qaysi belgi to‘g‘ri?",
        correctAnswer: "> (chunki 5 > 2)",
        distractors: ["<", "=", "+"],
        explanation: "Ikkalasida ham 4 bor, 5 esa 2 dan katta, demak 4 + 5 > 4 + 2."
      },
      {
        text: "Hisoblamay taqqoslang: 3 + 1 ... 3 + 4. Qaysi belgi to‘g‘ri?",
        correctAnswer: "< (chunki 1 < 4)",
        distractors: [">", "=", "−"],
        explanation: "1 soni 4 dan kichik, demak 3 + 1 < 3 + 4."
      },
      {
        text: "Hisoblamay taqqoslang: 7 + 2 ... 2 + 7. Qaysi belgi to‘g‘ri?",
        correctAnswer: "= (o‘rin almashgan, teng)",
        distractors: [">", "<", "+"],
        explanation: "Qo‘shiluvchilar o‘rni almashgani bilan yig‘indi teng bo‘ladi."
      }
    ],
    test: [
      {
        text: "Hisoblamay taqqoslang: 5 + 4 ... 5 + 2. Qaysi belgi to‘g‘ri?",
        correctAnswer: ">",
        distractors: ["<", "=", "+"],
        explanation: "4 > 2 bo‘lgani uchun 5 + 4 > 5 + 2."
      },
      {
        text: "Hisoblamay taqqoslang: 2 + 6 ... 2 + 8. Qaysi belgi to‘g‘ri?",
        correctAnswer: "<",
        distractors: [">", "=", "−"],
        explanation: "6 < 8 bo‘lgani uchun 2 + 6 < 2 + 8."
      },
      {
        text: "Hisoblamay taqqoslang: 6 + 3 ... 6 + 3. Qaysi belgi to‘g‘ri?",
        correctAnswer: "=",
        distractors: [">", "<", "+"],
        explanation: "Ikkala tomon aynan bir xil (6 + 3 = 6 + 3)."
      },
      {
        text: "Hisoblamay taqqoslang: 7 + 1 ... 7 + 3. Qaysi belgi to‘g‘ri?",
        correctAnswer: "<",
        distractors: [">", "=", "−"],
        explanation: "1 < 3 bo‘lgani uchun 7 + 1 < 7 + 3."
      },
      {
        text: "Hisoblamay taqqoslang: 8 + 2 ... 8 + 1. Qaysi belgi to‘g‘ri?",
        correctAnswer: ">",
        distractors: ["<", "=", "+"],
        explanation: "2 > 1 bo‘lgani uchun 8 + 2 > 8 + 1."
      },
      {
        text: "Hisoblamay taqqoslang: 3 + 4 ... 4 + 3. Qaysi belgi to‘g‘ri?",
        correctAnswer: "=",
        distractors: [">", "<", "−"],
        explanation: "O‘rin almashtirish xossasiga ko‘ra ular teng (3 + 4 = 4 + 3)."
      },
      {
        text: "Hisoblamay taqqoslang: 1 + 9 ... 1 + 7. Qaysi belgi to‘g‘ri?",
        correctAnswer: ">",
        distractors: ["<", "=", "+"],
        explanation: "9 > 7 bo‘lgani uchun 1 + 9 > 1 + 7."
      },
      {
        text: "Hisoblamay taqqoslang: 4 + 2 ... 4 + 6. Qaysi belgi to‘g‘ri?",
        correctAnswer: "<",
        distractors: [">", "=", "−"],
        explanation: "2 < 6 bo‘lgani uchun 4 + 2 < 4 + 6."
      },
      {
        text: "Quyidagi taqqoslashlardan qaysi biri to‘g‘ri?",
        correctAnswer: "5 + 3 > 5 + 1",
        distractors: ["5 + 3 < 5 + 1", "5 + 3 = 5 + 1", "5 + 1 > 5 + 3"],
        explanation: "3 > 1 bo‘lgani sababli 5 + 3 > 5 + 1."
      },
      {
        text: "Qaysi taqqoslash to‘g‘ri yozilgan?",
        correctAnswer: "2 + 7 < 2 + 8",
        distractors: ["2 + 7 > 2 + 8", "2 + 7 = 2 + 8", "2 + 8 < 2 + 7"],
        explanation: "7 < 8 bo‘lgani uchun 2 + 7 < 2 + 8."
      },
      {
        text: "Agar 5 > 2 bo‘lsa, 4 + 5 bilan 4 + 2 taqqoslanganda qaysi biri katta?",
        correctAnswer: "4 + 5 katta",
        distractors: ["4 + 2 katta", "Ikkalasi teng", "Bilmayman"],
        explanation: "Kattaroq son qo‘shilgan ifoda katta bo‘ladi."
      },
      {
        text: "Agar 6 < 9 bo‘lsa, 1 + 6 bilan 1 + 9 taqqoslanganda qaysi biri kichik?",
        correctAnswer: "1 + 6 kichik",
        distractors: ["1 + 9 kichik", "Ikkalasi teng", "1 + 6 katta"],
        explanation: "6 kichik bo‘lgani uchun 1 + 6 kichikdir."
      },
      {
        text: "Taqqoslang: 10 − 2 ... 10 − 5. Qaysi belgi to‘g‘ri?",
        correctAnswer: "> (kamroq ayirilsa ko‘proq qoladi)",
        distractors: ["<", "=", "+"],
        explanation: "10 dan 2 ayirilsa 8, 5 ayirilsa 5 qoladi, demak 8 > 5."
      },
      {
        text: "Taqqoslang: 8 − 1 ... 8 − 4. Qaysi belgi to‘g‘ri?",
        correctAnswer: ">",
        distractors: ["<", "=", "−"],
        explanation: "Kamroq son ayirilsa natija kattaroq bo‘ladi: 7 > 4."
      },
      {
        text: "Taqqoslang: 9 − 6 ... 9 − 2. Qaysi belgi to‘g‘ri?",
        correctAnswer: "<",
        distractors: [">", "=", "+"],
        explanation: "Ko‘proq son ayirilsa natija kichik bo‘ladi: 3 < 7."
      },
      {
        text: "Anvar va Sobirda 3 tadan daftar bor edi. Anvarga 5 ta, Sobirga 2 ta berishdi. Kimda ko‘p bo‘ldi?",
        correctAnswer: "Anvarda ko‘p bo‘ldi (3 + 5 > 3 + 2)",
        distractors: ["Sobirda ko‘p bo‘ldi", "Ikkalasida teng", "Anvarda kam bo‘ldi"],
        explanation: "5 > 2 bo‘lgani uchun Anvarda ko‘p bo‘ladi."
      },
      {
        text: "Ikkita bir xil likopchada 4 tadan olma bor edi. 1-likopchadan 1 ta, 2-likopchadan 3 ta olindi. Qayerda ko‘p qoldi?",
        correctAnswer: "1-likopchada ko‘p qoldi (chunki kamroq olindi)",
        distractors: ["2-likopchada ko‘p qoldi", "Ikkalasida teng", "Hech qaysisida qolmadi"],
        explanation: "4 − 1 = 3 ta qoladi, 4 − 3 = 1 ta qoladi. 3 > 1."
      },
      {
        text: "To‘g‘ri taqqoslashni toping:",
        correctAnswer: "6 + 4 = 4 + 6",
        distractors: ["6 + 4 > 4 + 6", "6 + 4 < 4 + 6", "6 − 4 = 4 − 6"],
        explanation: "O‘rin almashtirish xossasiga ko‘ra tenglik to‘g‘ri."
      },
      {
        text: "Hisoblamasdan ayting: 3 + 7 kattami yoki 3 + 5?",
        correctAnswer: "3 + 7 katta",
        distractors: ["3 + 5 katta", "Ikkalasi teng", "Ikkalasi ham kichik"],
        explanation: "7 soni 5 dan katta bo‘lgani uchun 3 + 7 katta."
      },
      {
        text: "Hisoblamasdan ayting: 8 + 1 kichikmi yoki 8 + 2?",
        correctAnswer: "8 + 1 kichik",
        distractors: ["8 + 2 kichik", "Ikkalasi teng", "O‘lchab bo‘lmaydi"],
        explanation: "1 soni 2 dan kichik bo‘lgani uchun 8 + 1 kichik."
      }
    ]
  },

  // 41. Ifodalar (sonli ifoda va uning qiymati)
  {
    bookNumber: 41,
    title: "Ifodalar",
    emoji: "🧠",
    shortDesc: "Sonli ifoda va uning qiymati, ifoda tuzish, o‘qish va qiymatini taqqoslash.",
    intro: "Sonlar va amallar belgilaridan tuzilgan yozuv sonli ifoda deyiladi.",
    keyPoints: [
      "Masalan, '4 + 3' — bu sonli ifoda, '7' esa uning qiymatidir.",
      "Ifodani 'to‘rt va uchning yig‘indisi' deb o‘qiymiz.",
      "Ifodalarning qiymatlarini hisoblab, o‘zaro taqqoslash mumkin."
    ],
    miniExample: {
      emojis: "4️⃣ + 3️⃣ = 7️⃣",
      text: "4 + 3 — bu ifoda, 7 — ifodaning qiymati!"
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 7,
    practice: [
      {
        text: "'5 + 2' ifodasining qiymati nechaga teng?",
        correctAnswer: "7",
        distractors: ["6", "8", "3"],
        explanation: "5 + 2 = 7."
      },
      {
        text: "'8 − 3' ifodasi qanday o‘qiladi?",
        correctAnswer: "Sakkiz va uchning ayirmasi",
        distractors: ["Sakkiz va uchning yig‘indisi", "Sakkiz qo‘shuv uch", "Sakkizta uch"],
        explanation: "Minus belgili ifoda ayirma deb o‘qiladi."
      },
      {
        text: "Quyidagilardan qaysi biri sonli ifoda?",
        correctAnswer: "6 + 3",
        distractors: ["Faqat 9 soni", "Rasm", "Harf"],
        explanation: "Sonlar va amal belgisi qatnashgan yozuv sonli ifodadir."
      }
    ],
    test: [
      {
        text: "'6 + 2' ifodasining qiymatini toping:",
        correctAnswer: "8",
        distractors: ["7", "9", "4"],
        explanation: "6 + 2 = 8."
      },
      {
        text: "'7 − 4' ifodasining qiymatini toping:",
        correctAnswer: "3",
        distractors: ["2", "4", "11"],
        explanation: "7 − 4 = 3."
      },
      {
        text: "'10 − 3' ifodasining qiymatini toping:",
        correctAnswer: "7",
        distractors: ["6", "8", "5"],
        explanation: "10 − 3 = 7."
      },
      {
        text: "'4 + 5' ifodasining qiymatini toping:",
        correctAnswer: "9",
        distractors: ["8", "10", "1"],
        explanation: "4 + 5 = 9."
      },
      {
        text: "'9 − 5' ifodasining qiymatini toping:",
        correctAnswer: "4",
        distractors: ["3", "5", "14"],
        explanation: "9 − 5 = 4."
      },
      {
        text: "'3 + 7' ifodasining qiymatini toping:",
        correctAnswer: "10",
        distractors: ["9", "8", "4"],
        explanation: "3 + 7 = 10."
      },
      {
        text: "'Besh va uchning yig‘indisi' qanday yoziladi?",
        correctAnswer: "5 + 3",
        distractors: ["5 − 3", "5 = 3", "5 > 3"],
        explanation: "Yig‘indi so‘zi qo‘shuv belgisini bildiradi: 5 + 3."
      },
      {
        text: "'Yetti va ikkining ayirmasi' qanday yoziladi?",
        correctAnswer: "7 − 2",
        distractors: ["7 + 2", "7 = 2", "2 − 7"],
        explanation: "Ayirma so‘zi ayiruv belgisini bildiradi: 7 − 2."
      },
      {
        text: "'To‘qqiz va to‘rtning ayirmasi' ifodasining qiymati nechaga teng?",
        correctAnswer: "5 (chunki 9 − 4 = 5)",
        distractors: ["4", "6", "13"],
        explanation: "9 − 4 = 5."
      },
      {
        text: "'Olti va to‘rtning yig‘indisi' ifodasining qiymati nechaga teng?",
        correctAnswer: "10 (chunki 6 + 4 = 10)",
        distractors: ["9", "2", "8"],
        explanation: "6 + 4 = 10."
      },
      {
        text: "Taqqoslang: 3 + 4 ... 2 + 5. Qaysi belgi to‘g‘ri?",
        correctAnswer: "= (chunki ikkalasi ham 7)",
        distractors: [">", "<", "+"],
        explanation: "3 + 4 = 7 va 2 + 5 = 7, demak 7 = 7."
      },
      {
        text: "Taqqoslang: 6 + 2 ... 5 + 4. Qaysi belgi to‘g‘ri?",
        correctAnswer: "< (8 < 9)",
        distractors: [">", "=", "+"],
        explanation: "6 + 2 = 8, 5 + 4 = 9, 8 < 9."
      },
      {
        text: "Taqqoslang: 10 − 4 ... 9 − 5. Qaysi belgi to‘g‘ri?",
        correctAnswer: "> (6 > 4)",
        distractors: ["<", "=", "−"],
        explanation: "10 − 4 = 6, 9 − 5 = 4, 6 > 4."
      },
      {
        text: "Taqqoslang: 8 − 3 ... 2 + 3. Qaysi belgi to‘g‘ri?",
        correctAnswer: "= (5 = 5)",
        distractors: [">", "<", "−"],
        explanation: "8 − 3 = 5 va 2 + 3 = 5, demak 5 = 5."
      },
      {
        text: "Qaysi ifodaning qiymati eng katta?",
        correctAnswer: "5 + 5 (qiymati 10)",
        distractors: ["3 + 6 (qiymati 9)", "8 − 1 (qiymati 7)", "4 + 4 (qiymati 8)"],
        explanation: "10 berilgan qiymatlar ichida eng kattasidir."
      },
      {
        text: "Qaysi ifodaning qiymati eng kichik?",
        correctAnswer: "4 − 3 (qiymati 1)",
        distractors: ["2 + 1 (qiymati 3)", "5 − 3 (qiymati 2)", "1 + 3 (qiymati 4)"],
        explanation: "1 eng kichik qiymatdir."
      },
      {
        text: "Qaysi ifodaning qiymati 8 ga teng?",
        correctAnswer: "10 − 2",
        distractors: ["9 − 2", "7 + 2", "6 + 3"],
        explanation: "10 − 2 = 8."
      },
      {
        text: "Akmal 4 ta qizil va 3 ta yashil olma terdi. Bu holatga mos ifoda qaysi?",
        correctAnswer: "4 + 3",
        distractors: ["4 − 3", "4 = 3", "4 × 3"],
        explanation: "Jami olmalarni topish uchun 4 + 3 ifodasi tuziladi."
      },
      {
        text: "Savatdagi 8 ta tuxumdan 3 tasi ishlatildi. Qolganini topish ifodasi qaysi?",
        correctAnswer: "8 − 3",
        distractors: ["8 + 3", "8 = 3", "3 − 8"],
        explanation: "Qolganini topish uchun ayirish ifodasi 8 − 3 tuziladi."
      },
      {
        text: "1-qism yakuni: 41-darsni muvaffaqiyatli o‘tdingiz! 1-qismda nechta mavzu o‘rganildi?",
        correctAnswer: "41 ta mavzu",
        distractors: ["30 ta mavzu", "20 ta mavzu", "10 ta mavzu"],
        explanation: "1-sinf Matematika 1-qismida to‘liq 41 ta mavzu o‘rganildi."
      }
    ]
  }
];

export function runPart1Chapter3() {
  console.log('--- 1-qism III bob (30–41-darslar) yaratilmoqda ---');
  for (const l of lessons) {
    const seed = buildLessonSeed(l);
    saveLessonFile(1, l.bookNumber, seed);
    console.log(`  ✓ Dars ${l.bookNumber}: ${l.title} saqlandi.`);
  }
}

runPart1Chapter3();
