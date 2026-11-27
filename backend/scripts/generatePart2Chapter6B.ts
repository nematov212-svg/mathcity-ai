import { LessonDef, buildLessonSeed, saveLessonFile } from './generatorTypes.js';

const lessons: LessonDef[] = [
  // 69. Qo‘shish va ayirishning o‘zaro bog‘lanishi
  {
    bookNumber: 69,
    order: 28,
    title: 'Qo‘shish va ayirishning o‘zaro bog‘lanishi',
    shortDesc: 'Qo‘shish va ayirish o‘zaro teskari amallardir: a + b = c bo‘lsa, c - b = a va c - a = b.',
    emoji: '🔄',
    intro: 'Qo‘shish amalini ayirish orqali, ayirish amalini esa qo‘shish orqali tekshirish mumkin. Masalan, 34 + 12 = 46 bo‘lsa, 46 - 12 = 34 bo‘ladi.',
    keyPoints: [
      'Agar yig‘indidan qo‘shiluvchilardan biri ayirilsa, ikkinchi qo‘shiluvchi hosil bo‘ladi.',
      'Agar ayirmaga ayriluvchi qo‘shilsa, kamayuvchi hosil bo‘ladi: 46 - 12 = 34 -> 34 + 12 = 46.',
      'Bu qoida hisoblash to‘g‘riligini tekshirishda katta yordam beradi.'
    ],
    miniExample: {
      emojis: '3️⃣4️⃣ + 1️⃣2️⃣ = 4️⃣6️⃣ 🔄 4️⃣6️⃣ - 1️⃣2️⃣ = 3️⃣4️⃣',
      text: '34 + 12 = 46 amalining to‘g‘riligini 46 - 12 = 34 bilan tekshiramiz.'
    },
    xpReward: 95,
    coinReward: 10,
    estMinutes: 7,
    practice: [
      {
        text: 'Agar 25 + 14 = 39 bo‘lsa, 39 - 14 nechaga teng bo‘ladi?',
        options: ['25', '14', '39', '53'],
        correctIndex: 0,
        explanation: 'Yig‘indidan ikkinchi qo‘shiluvchi ayirilsa, birinchi qo‘shiluvchi (25) chiqadi.'
      },
      {
        text: '58 - 23 = 35 amali qaysi qo‘shish orqali to‘g‘ri tekshiriladi?',
        options: ['35 + 23 = 58', '58 + 23 = 81', '35 - 23 = 12', '58 + 35 = 93'],
        correctIndex: 0,
        explanation: 'Ayirmaga ayriluvchi qo‘shilsa kamayuvchi chiqadi: 35 + 23 = 58.'
      },
      {
        text: 'Noma’lum qo‘shiluvchini toping: ? + 32 = 75',
        options: ['43', '42', '44', '33'],
        correctIndex: 0,
        explanation: '75 - 32 = 43.'
      }
    ],
    test: [
      // Easy (1-6)
      {
        text: 'Agar 20 + 30 = 50 bo‘lsa, 50 - 30 nechaga teng?',
        options: ['20', '30', '50', '80'],
        correctIndex: 0,
        explanation: '50 - 30 = 20.'
      },
      {
        text: 'Agar 45 - 20 = 25 bo‘lsa, 25 + 20 nechaga teng?',
        options: ['45', '25', '20', '65'],
        correctIndex: 0,
        explanation: '25 + 20 = 45.'
      },
      {
        text: 'Qaysi amal 60 - 20 = 40 ning teskarisi hisoblanadi?',
        options: ['40 + 20 = 60', '60 + 20 = 80', '40 - 20 = 20', '60 - 40 = 20'],
        correctIndex: 0,
        explanation: '40 + 20 = 60 ayirishga teskari qo‘shish amalidir.'
      },
      {
        text: 'Agar 15 + 42 = 57 bo‘lsa, 57 - 15 nechaga teng?',
        options: ['42', '15', '57', '72'],
        correctIndex: 0,
        explanation: '57 - 15 = 42.'
      },
      {
        text: 'Kamayuvchini toping: ? - 14 = 32',
        options: ['46', '45', '18', '48'],
        correctIndex: 0,
        explanation: 'Kamayuvchini topish uchun ayirmaga ayriluvchi qo‘shiladi: 32 + 14 = 46.'
      },
      {
        text: 'Ayriluvchini toping: 68 - ? = 45',
        options: ['23', '22', '24', '13'],
        correctIndex: 0,
        explanation: 'Ayriluvchini topish uchun kamayuvchidan ayirma ayiriladi: 68 - 45 = 23.'
      },

      // Medium (7-14)
      {
        text: 'Agar 36 + 43 = 79 bo‘lsa, 79 - 43 nechaga teng?',
        options: ['36', '43', '79', '33'],
        correctIndex: 0,
        explanation: '79 - 43 = 36.'
      },
      {
        text: 'Agar 87 - 35 = 52 bo‘lsa, 52 + 35 nechaga teng?',
        options: ['87', '52', '35', '97'],
        correctIndex: 0,
        explanation: '52 + 35 = 87.'
      },
      {
        text: 'Noma’lum qo‘shiluvchini toping: 41 + ? = 95',
        options: ['54', '53', '55', '44'],
        correctIndex: 0,
        explanation: '95 - 41 = 54.'
      },
      {
        text: 'Noma’lum kamayuvchini toping: ? - 26 = 53',
        options: ['79', '78', '80', '27'],
        correctIndex: 0,
        explanation: '53 + 26 = 79.'
      },
      {
        text: 'Tenglik to‘g‘ri bo‘lishi uchun yulduzcha o‘rniga qaysi sonni qo‘yish kerak: * + 24 = 67',
        options: ['43', '42', '44', '33'],
        correctIndex: 0,
        explanation: '67 - 24 = 43.'
      },
      {
        text: 'Quyidagi tengliklardan qaysi biri 54 + 23 = 77 dan kelib chiqmaydi?',
        options: ['77 + 23 = 100', '77 - 23 = 54', '77 - 54 = 23', '23 + 54 = 77'],
        correctIndex: 0,
        explanation: '77 + 23 = 100 bu tenglikka teskari yoki bog‘langan emas.'
      },
      {
        text: 'Noma’lum ayriluvchini toping: 98 - ? = 36',
        options: ['62', '61', '63', '52'],
        correctIndex: 0,
        explanation: '98 - 36 = 62.'
      },
      {
        text: 'Agar birinchi qo‘shiluvchi 24, yig‘indi esa 58 bo‘lsa, ikkinchi qo‘shiluvchi nechaga teng?',
        options: ['34', '33', '35', '24'],
        correctIndex: 0,
        explanation: '58 - 24 = 34.'
      },

      // Hard (15-18)
      {
        text: 'Ikki sonning yig‘indisi 86 ga teng. Qo‘shiluvchilardan biri 53 bo‘lsa, ikkinchisi qaysi?',
        options: ['33', '32', '34', '23'],
        correctIndex: 0,
        explanation: '86 - 53 = 33.'
      },
      {
        text: 'Kamayuvchi 97 ga, ayirma 45 ga teng. Ayriluvchini toping:',
        options: ['52', '51', '53', '42'],
        correctIndex: 0,
        explanation: '97 - 45 = 52.'
      },
      {
        text: 'Qaysi ifoda 44 + 35 = 79 amalini tekshirish uchun to‘g‘ri keladi?',
        options: ['79 - 35 = 44', '79 + 35 = 114', '44 - 35 = 9', '79 - 25 = 54'],
        correctIndex: 0,
        explanation: '79 - 35 = 44 to‘g‘ri tekshirish usulidir.'
      },
      {
        text: 'O‘ylangan songa 27 qo‘shilsa 69 bo‘ladi. O‘ylangan son qaysi?',
        options: ['42', '41', '43', '32'],
        correctIndex: 0,
        explanation: '69 - 27 = 42.'
      },

      // Word problems (19-20)
      {
        text: 'Daftarda bir nechta varaq bor edi. Nodir 15 varaq yozgach, 32 ta bo‘sh varaq qoldi. Daftarda dastlab nechta varaq bo‘lgan?',
        options: ['47 ta', '46 ta', '48 ta', '17 ta'],
        correctIndex: 0,
        explanation: '32 + 15 = 47 ta varaq bo‘lgan.'
      },
      {
        text: 'Savatchada 58 ta shaftoli bor edi. Bir nechtasi yeyilgach, 24 ta shaftoli qoldi. Nechta shaftoli yeyilgan?',
        options: ['34 ta', '33 ta', '35 ta', '24 ta'],
        correctIndex: 0,
        explanation: '58 - 24 = 34 ta shaftoli yeyilgan.'
      }
    ]
  },

  // 70. Ko‘p komponentli qo‘shish
  {
    bookNumber: 70,
    order: 29,
    title: 'Ko‘p komponentli qo‘shish',
    shortDesc: 'Uch yoki undan ortiq qo‘shiluvchini ketma-ket qo‘shish: 20 + 30 + 40 = 90.',
    emoji: '➕',
    intro: 'Ko‘p komponentli qo‘shishda uchta yoki undan ortiq sonlar ketma-ket qo‘shiladi. Amallarni tartib bilan yoki qulay usulda bajarish mumkin.',
    keyPoints: [
      'Ketma-ket qo‘shish: avval dastlabki ikkita son qo‘shiladi, keyin chiqqan natijaga uchinchi son qo‘shiladi.',
      'Misol: 20 + 30 + 40 -> 20 + 30 = 50, so‘ng 50 + 40 = 90.',
      'To‘liq o‘nlik hosil qiladigan sonlarni oldin qo‘shib olish hisoblashni osonlashtiradi.'
    ],
    miniExample: {
      emojis: '2️⃣0️⃣ + 3️⃣0️⃣ + 4️⃣0️⃣ = 9️⃣0️⃣',
      text: '20 + 30 = 50, 50 + 40 = 90.'
    },
    xpReward: 95,
    coinReward: 10,
    estMinutes: 7,
    practice: [
      {
        text: 'Hisoblang: 10 + 20 + 30 = ?',
        options: ['60', '50', '70', '40'],
        correctIndex: 0,
        explanation: '10 + 20 = 30, 30 + 30 = 60.'
      },
      {
        text: 'Hisoblang: 30 + 20 + 40 = ?',
        options: ['90', '80', '100', '70'],
        correctIndex: 0,
        explanation: '30 + 20 = 50, 50 + 40 = 90.'
      },
      {
        text: 'Hisoblang: 12 + 8 + 15 = ?',
        options: ['35', '34', '36', '25'],
        correctIndex: 0,
        explanation: '12 + 8 = 20, 20 + 15 = 35.'
      }
    ],
    test: [
      // Easy (1-6)
      {
        text: 'Hisoblang: 10 + 10 + 10 = ?',
        options: ['30', '20', '40', '100'],
        correctIndex: 0,
        explanation: '10 + 10 = 20, 20 + 10 = 30.'
      },
      {
        text: 'Hisoblang: 20 + 20 + 30 = ?',
        options: ['70', '60', '80', '50'],
        correctIndex: 0,
        explanation: '20 + 20 = 40, 40 + 30 = 70.'
      },
      {
        text: 'Hisoblang: 30 + 30 + 30 = ?',
        options: ['90', '80', '100', '60'],
        correctIndex: 0,
        explanation: '30 + 30 = 60, 60 + 30 = 90.'
      },
      {
        text: 'Hisoblang: 40 + 10 + 20 = ?',
        options: ['70', '60', '80', '50'],
        correctIndex: 0,
        explanation: '40 + 10 = 50, 50 + 20 = 70.'
      },
      {
        text: 'Hisoblang: 50 + 20 + 10 = ?',
        options: ['80', '70', '90', '60'],
        correctIndex: 0,
        explanation: '50 + 20 = 70, 70 + 10 = 80.'
      },
      {
        text: 'Hisoblang: 15 + 5 + 20 = ?',
        options: ['40', '35', '45', '30'],
        correctIndex: 0,
        explanation: '15 + 5 = 20, 20 + 20 = 40.'
      },

      // Medium (7-14)
      {
        text: 'Hisoblang: 24 + 6 + 30 = ?',
        options: ['60', '50', '70', '54'],
        correctIndex: 0,
        explanation: '24 + 6 = 30, 30 + 30 = 60.'
      },
      {
        text: 'Hisoblang: 31 + 9 + 25 = ?',
        options: ['65', '55', '75', '60'],
        correctIndex: 0,
        explanation: '31 + 9 = 40, 40 + 25 = 65.'
      },
      {
        text: 'Hisoblang: 42 + 8 + 33 = ?',
        options: ['83', '82', '84', '73'],
        correctIndex: 0,
        explanation: '42 + 8 = 50, 50 + 33 = 83.'
      },
      {
        text: 'Hisoblang: 14 + 16 + 20 = ?',
        options: ['50', '40', '60', '45'],
        correctIndex: 0,
        explanation: '14 + 16 = 30, 30 + 20 = 50.'
      },
      {
        text: 'Hisoblang: 23 + 7 + 45 = ?',
        options: ['75', '65', '85', '70'],
        correctIndex: 0,
        explanation: '23 + 7 = 30, 30 + 45 = 75.'
      },
      {
        text: 'Noma’lum sonni toping: 20 + 30 + ? = 80',
        options: ['30', '20', '40', '10'],
        correctIndex: 0,
        explanation: '20 + 30 = 50, 80 - 50 = 30.'
      },
      {
        text: 'Noma’lum sonni toping: 10 + ? + 40 = 70',
        options: ['20', '30', '10', '40'],
        correctIndex: 0,
        explanation: '10 + 40 = 50, 70 - 50 = 20.'
      },
      {
        text: 'Taqqoslang: 20 + 30 + 10 va 70',
        options: ['20 + 30 + 10 < 70', '20 + 30 + 10 > 70', '20 + 30 + 10 = 70', '60 > 70'],
        correctIndex: 0,
        explanation: '20 + 30 + 10 = 60 va 60 < 70.'
      },

      // Hard (15-18)
      {
        text: 'Hisoblang: 17 + 13 + 24 + 6 = ?',
        options: ['60', '50', '70', '55'],
        correctIndex: 0,
        explanation: '(17 + 13) + (24 + 6) = 30 + 30 = 60.'
      },
      {
        text: 'Hisoblang: 25 + 15 + 32 + 8 = ?',
        options: ['80', '70', '90', '75'],
        correctIndex: 0,
        explanation: '(25 + 15) + (32 + 8) = 40 + 40 = 80.'
      },
      {
        text: 'Yulduzcha o‘rniga to‘g‘ri belgini qo‘ying: 30 + 20 + 40 * 50 + 40',
        options: ['=', '>', '<', '+'],
        correctIndex: 0,
        explanation: '30 + 20 + 40 = 90 va 50 + 40 = 90, demak teng (=).'
      },
      {
        text: 'Qaysi uchta sonning yig‘indisi 100 ga teng?',
        options: ['40 + 30 + 30', '40 + 20 + 30', '50 + 20 + 20', '30 + 30 + 30'],
        correctIndex: 0,
        explanation: '40 + 30 + 30 = 100.'
      },

      // Word problems (19-20)
      {
        text: 'Madina do‘kondan 20 so‘mga qalam, 30 so‘mga daftar va 40 so‘mga kitob sotib oldi. Madina jami qancha pul to‘ladi?',
        options: ['90 so‘m', '80 so‘m', '100 so‘m', '70 so‘m'],
        correctIndex: 0,
        explanation: '20 + 30 + 40 = 90 so‘m to‘ladi.'
      },
      {
        text: 'Birinchi qutida 15 ta, ikkinchi qutida 5 ta va uchinchi qutida 25 ta qalam bor. Uchta qutida jami nechta qalam bor?',
        options: ['45 ta', '40 ta', '50 ta', '35 ta'],
        correctIndex: 0,
        explanation: '15 + 5 + 25 = 20 + 25 = 45 ta qalam bor.'
      }
    ]
  },

  // 71. Guruhlash xossasi
  {
    bookNumber: 71,
    order: 30,
    title: 'Guruhlash xossasi',
    shortDesc: 'Qo‘shishning guruhlash xossasi: (a + b) + c = a + (b + c) va qulay hisoblash.',
    emoji: '🤝',
    intro: 'Qo‘shishning guruhlash xossasiga ko‘ra, qo‘shiluvchilar qanday guruhlansa ham, yig‘indi o‘zgarmaydi. Qulay guruhlash orqali misollarni oson yechish mumkin.',
    keyPoints: [
      'Xossa qoidasi: (a + b) + c = a + (b + c).',
      'Qulay usul: qo‘shilganda to‘liq o‘nlik (10, 20, 30...) beradigan sonlar oldin guruhlanadi.',
      'Misol: 17 + 25 + 3 = (17 + 3) + 25 = 20 + 25 = 45.'
    ],
    miniExample: {
      emojis: '(1️⃣7️⃣ + 3️⃣) + 2️⃣5️⃣ = 2️⃣0️⃣ + 2️⃣5️⃣ = 4️⃣5️⃣',
      text: '17 ga 3 ni qo‘shib 20 qildik, keyin 25 ni qo‘shdik: 45.'
    },
    xpReward: 95,
    coinReward: 10,
    estMinutes: 7,
    practice: [
      {
        text: '16 + 28 + 4 ifodani qulay usulda hisoblash uchun qaysi sonlarni guruhlash kerak?',
        options: ['16 va 4', '28 va 4', '16 va 28', 'Hammasini baravar'],
        correctIndex: 0,
        explanation: '16 + 4 = 20 to‘liq o‘nlik hosil qiladi, shuning uchun ularni guruhlash qulay.'
      },
      {
        text: 'Qulay usulda hisoblang: (34 + 6) + 15 = ?',
        options: ['55', '54', '56', '45'],
        correctIndex: 0,
        explanation: '34 + 6 = 40, 40 + 15 = 55.'
      },
      {
        text: 'Qulay usulda hisoblang: 27 + 33 + 12 = ?',
        options: ['72', '71', '73', '62'],
        correctIndex: 0,
        explanation: '27 + 33 = 60, 60 + 12 = 72.'
      }
    ],
    test: [
      // Easy (1-6)
      {
        text: 'Hisoblang: (12 + 8) + 10 = ?',
        options: ['30', '28', '32', '20'],
        correctIndex: 0,
        explanation: '12 + 8 = 20, 20 + 10 = 30.'
      },
      {
        text: 'Hisoblang: (25 + 5) + 30 = ?',
        options: ['60', '50', '70', '55'],
        correctIndex: 0,
        explanation: '25 + 5 = 30, 30 + 30 = 60.'
      },
      {
        text: 'Hisoblang: (41 + 9) + 20 = ?',
        options: ['70', '60', '80', '69'],
        correctIndex: 0,
        explanation: '41 + 9 = 50, 50 + 20 = 70.'
      },
      {
        text: 'Hisoblang: 30 + (14 + 6) = ?',
        options: ['50', '40', '60', '45'],
        correctIndex: 0,
        explanation: '14 + 6 = 20, 30 + 20 = 50.'
      },
      {
        text: 'Hisoblang: 50 + (18 + 2) = ?',
        options: ['70', '60', '80', '68'],
        correctIndex: 0,
        explanation: '18 + 2 = 20, 50 + 20 = 70.'
      },
      {
        text: 'Hisoblang: (36 + 4) + 40 = ?',
        options: ['80', '70', '90', '76'],
        correctIndex: 0,
        explanation: '36 + 4 = 40, 40 + 40 = 80.'
      },

      // Medium (7-14)
      {
        text: 'Qulay usulda hisoblang: 18 + 35 + 2 = ?',
        options: ['55', '54', '56', '45'],
        correctIndex: 0,
        explanation: '(18 + 2) + 35 = 20 + 35 = 55.'
      },
      {
        text: 'Qulay usulda hisoblang: 23 + 44 + 7 = ?',
        options: ['74', '73', '75', '64'],
        correctIndex: 0,
        explanation: '(23 + 7) + 44 = 30 + 44 = 74.'
      },
      {
        text: 'Qulay usulda hisoblang: 46 + 19 + 4 = ?',
        options: ['69', '68', '70', '59'],
        correctIndex: 0,
        explanation: '(46 + 4) + 19 = 50 + 19 = 69.'
      },
      {
        text: 'Qulay usulda hisoblang: 31 + 27 + 9 = ?',
        options: ['67', '66', '68', '57'],
        correctIndex: 0,
        explanation: '(31 + 9) + 27 = 40 + 27 = 67.'
      },
      {
        text: 'Quyidagi ifodalardan qaysi biri 24 + 15 + 6 ifodaga teng?',
        options: ['(24 + 6) + 15', '(24 + 15) - 6', '24 - (15 + 6)', '(24 + 15) + 15'],
        correctIndex: 0,
        explanation: 'Guruhlash xossasiga ko‘ra (24 + 6) + 15 unga teng.'
      },
      {
        text: 'Qulay usulda hisoblang: 52 + 13 + 8 = ?',
        options: ['73', '72', '74', '63'],
        correctIndex: 0,
        explanation: '(52 + 8) + 13 = 60 + 13 = 73.'
      },
      {
        text: 'Taqqoslang: (27 + 3) + 14 va 45',
        options: ['(27 + 3) + 14 < 45', '(27 + 3) + 14 > 45', '(27 + 3) + 14 = 45', '44 > 45'],
        correctIndex: 0,
        explanation: '30 + 14 = 44 va 44 < 45.'
      },
      {
        text: 'Qulay usulda hisoblang: 37 + 29 + 3 = ?',
        options: ['69', '68', '70', '59'],
        correctIndex: 0,
        explanation: '(37 + 3) + 29 = 40 + 29 = 69.'
      },

      // Hard (15-18)
      {
        text: 'Qulay usulda hisoblang: 15 + 24 + 25 + 16 = ?',
        options: ['80', '70', '90', '75'],
        correctIndex: 0,
        explanation: '(15 + 25) + (24 + 16) = 40 + 40 = 80.'
      },
      {
        text: 'Qulay usulda hisoblang: 32 + 18 + 23 + 17 = ?',
        options: ['90', '80', '100', '85'],
        correctIndex: 0,
        explanation: '(32 + 18) + (23 + 17) = 50 + 40 = 90.'
      },
      {
        text: 'Yulduzcha o‘rniga to‘g‘ri belgini qo‘ying: (45 + 5) + 23 * 40 + (28 + 5)',
        options: ['=', '>', '<', '+'],
        correctIndex: 0,
        explanation: '50 + 23 = 73 va 40 + 33 = 73, demak teng (=).'
      },
      {
        text: 'Qaysi guruhlash 18 + 43 + 12 ifodani eng oson yechishga yordam beradi?',
        options: ['(18 + 12) + 43', '(43 + 12) + 18', '(18 + 43) + 12', 'Hammasi bir xil qiyin'],
        correctIndex: 0,
        explanation: '18 + 12 = 30 to‘liq o‘nlik bo‘lgani uchun (18 + 12) + 43 eng qulay.'
      },

      // Word problems (19-20)
      {
        text: 'Avtobusda 14 nafar bola bor edi. Birinchi bekatda 25 nafar, ikkinchi bekatda 6 nafar bola chiqdi. Avtobusda jami nechta bola bo‘ldi?',
        options: ['45 nafar', '44 nafar', '46 nafar', '35 nafar'],
        correctIndex: 0,
        explanation: '(14 + 6) + 25 = 20 + 25 = 45 nafar bola bo‘ldi.'
      },
      {
        text: 'Jasur dushanba kuni 17 ta, seshanba kuni 28 ta va chorshanba kuni 13 ta misol yechdi. Jasur uch kunda jami nechta misol yechdi?',
        options: ['58 ta', '57 ta', '59 ta', '48 ta'],
        correctIndex: 0,
        explanation: '(17 + 13) + 28 = 30 + 28 = 58 ta misol yechdi.'
      }
    ]
  },

  // 72. Tarkibli ifodalar
  {
    bookNumber: 72,
    order: 31,
    title: 'Tarkibli ifodalar',
    shortDesc: 'Bir nechta amalli ifodalarni ketma-ket (chapdan o‘ngga) hisoblash.',
    emoji: '⛓️',
    intro: 'Qavssiz tarkibli ifodalarda qo‘shish va ayirish amallari chapdan o‘ngga qarab tartib bilan ketma-ket bajariladi: 50 + 20 - 30 = 40.',
    keyPoints: [
      'Amallar chapdan o‘ngga qarab bajariladi.',
      'Misol: 60 - 20 + 10 -> avval 60 - 20 = 40, so‘ng 40 + 10 = 50.',
      'Har bir oraliq natijani to‘g‘ri hisoblash yakuniy javobning to‘g‘ri chiqishini ta’minlaydi.'
    ],
    miniExample: {
      emojis: '5️⃣0️⃣ + 2️⃣0️⃣ - 3️⃣0️⃣ = 4️⃣0️⃣',
      text: '50 + 20 = 70, 70 - 30 = 40.'
    },
    xpReward: 95,
    coinReward: 10,
    estMinutes: 7,
    practice: [
      {
        text: 'Hisoblang: 40 + 30 - 20 = ?',
        options: ['50', '60', '40', '70'],
        correctIndex: 0,
        explanation: '40 + 30 = 70, 70 - 20 = 50.'
      },
      {
        text: 'Hisoblang: 70 - 30 + 15 = ?',
        options: ['55', '45', '65', '50'],
        correctIndex: 0,
        explanation: '70 - 30 = 40, 40 + 15 = 55.'
      },
      {
        text: 'Hisoblang: 25 + 14 - 10 = ?',
        options: ['29', '28', '30', '19'],
        correctIndex: 0,
        explanation: '25 + 14 = 39, 39 - 10 = 29.'
      }
    ],
    test: [
      // Easy (1-6)
      {
        text: 'Hisoblang: 30 + 20 - 10 = ?',
        options: ['40', '50', '30', '20'],
        correctIndex: 0,
        explanation: '30 + 20 = 50, 50 - 10 = 40.'
      },
      {
        text: 'Hisoblang: 50 - 20 + 30 = ?',
        options: ['60', '50', '70', '40'],
        correctIndex: 0,
        explanation: '50 - 20 = 30, 30 + 30 = 60.'
      },
      {
        text: 'Hisoblang: 80 - 40 - 20 = ?',
        options: ['20', '30', '10', '40'],
        correctIndex: 0,
        explanation: '80 - 40 = 40, 40 - 20 = 20.'
      },
      {
        text: 'Hisoblang: 45 + 5 - 20 = ?',
        options: ['30', '25', '35', '40'],
        correctIndex: 0,
        explanation: '45 + 5 = 50, 50 - 20 = 30.'
      },
      {
        text: 'Hisoblang: 60 - 10 + 25 = ?',
        options: ['75', '65', '85', '70'],
        correctIndex: 0,
        explanation: '60 - 10 = 50, 50 + 25 = 75.'
      },
      {
        text: 'Hisoblang: 20 + 40 - 30 = ?',
        options: ['30', '20', '40', '50'],
        correctIndex: 0,
        explanation: '20 + 40 = 60, 60 - 30 = 30.'
      },

      // Medium (7-14)
      {
        text: 'Hisoblang: 36 + 23 - 15 = ?',
        options: ['44', '43', '45', '34'],
        correctIndex: 0,
        explanation: '36 + 23 = 59, 59 - 15 = 44.'
      },
      {
        text: 'Hisoblang: 58 - 24 + 13 = ?',
        options: ['47', '46', '48', '37'],
        correctIndex: 0,
        explanation: '58 - 24 = 34, 34 + 13 = 47.'
      },
      {
        text: 'Hisoblang: 67 - 35 - 12 = ?',
        options: ['20', '21', '19', '30'],
        correctIndex: 0,
        explanation: '67 - 35 = 32, 32 - 12 = 20.'
      },
      {
        text: 'Hisoblang: 42 + 25 - 34 = ?',
        options: ['33', '32', '34', '23'],
        correctIndex: 0,
        explanation: '42 + 25 = 67, 67 - 34 = 33.'
      },
      {
        text: 'Hisoblang: 74 - 20 + 15 = ?',
        options: ['69', '68', '70', '59'],
        correctIndex: 0,
        explanation: '74 - 20 = 54, 54 + 15 = 69.'
      },
      {
        text: 'Noma’lum sonni toping: 50 + 20 - ? = 40',
        options: ['30', '20', '40', '50'],
        correctIndex: 0,
        explanation: '50 + 20 = 70, 70 - 40 = 30.'
      },
      {
        text: 'Taqqoslang: 60 - 20 + 10 va 45',
        options: ['60 - 20 + 10 > 45', '60 - 20 + 10 < 45', '60 - 20 + 10 = 45', '50 < 45'],
        correctIndex: 0,
        explanation: '60 - 20 + 10 = 50 va 50 > 45.'
      },
      {
        text: 'Hisoblang: 89 - 45 + 22 = ?',
        options: ['66', '65', '67', '56'],
        correctIndex: 0,
        explanation: '89 - 45 = 44, 44 + 22 = 66.'
      },

      // Hard (15-18)
      {
        text: 'Hisoblang: 48 - 15 + 23 - 12 = ?',
        options: ['44', '43', '45', '34'],
        correctIndex: 0,
        explanation: '48 - 15 = 33, 33 + 23 = 56, 56 - 12 = 44.'
      },
      {
        text: 'Hisoblang: 65 + 14 - 32 + 10 = ?',
        options: ['57', '56', '58', '47'],
        correctIndex: 0,
        explanation: '65 + 14 = 79, 79 - 32 = 47, 47 + 10 = 57.'
      },
      {
        text: 'Yulduzcha o‘rniga to‘g‘ri belgini qo‘ying: 70 - 30 + 20 * 80 - 40 + 20',
        options: ['=', '>', '<', '+'],
        correctIndex: 0,
        explanation: '70 - 30 + 20 = 60 va 80 - 40 + 20 = 60, demak teng (=).'
      },
      {
        text: 'Qaysi ifodaning qiymati 52 ga teng?',
        options: ['75 - 30 + 7', '80 - 40 + 15', '60 + 10 - 20', '90 - 50 + 10'],
        correctIndex: 0,
        explanation: '75 - 30 = 45, 45 + 7 = 52.'
      },

      // Word problems (19-20)
      {
        text: 'Avtobusda 35 kishi bor edi. Birinchi bekatda 12 kishi tushdi va 10 kishi chiqdi. Avtobusda necha kishi bo‘ldi?',
        options: ['33 kishi', '32 kishi', '34 kishi', '23 kishi'],
        correctIndex: 0,
        explanation: '35 - 12 = 23, 23 + 10 = 33 kishi bo‘ldi.'
      },
      {
        text: 'Do‘konda 50 ta daftar bor edi. Ertalab 20 ta sotildi, tushdan keyin yana 35 ta yangi daftar keltirildi. Do‘konda nechta daftar bo‘ldi?',
        options: ['65 ta', '55 ta', '75 ta', '60 ta'],
        correctIndex: 0,
        explanation: '50 - 20 = 30, 30 + 35 = 65 ta daftar bo‘ldi.'
      }
    ]
  },

  // 73. Qavsli tarkibli ifodalar
  {
    bookNumber: 73,
    order: 32,
    title: 'Qavsli tarkibli ifodalar',
    shortDesc: 'Qavs ichidagi amallar avval bajariladi: 70 - (20 + 30) = 20.',
    emoji: '🔣',
    intro: 'Qavsli ifodalarda qoida qat’iy: avval qavs ichidagi amal bajariladi, so‘ngra qavsdan tashqaridagi amallar ketma-ket bajariladi.',
    keyPoints: [
      '1-qadam: qavs ichidagi amal bajariladi.',
      '2-qadam: qavsdan tashqaridagi amal bajariladi.',
      'Misol: 80 - (20 + 30) -> 20 + 30 = 50, keyin 80 - 50 = 30.'
    ],
    miniExample: {
      emojis: '8️⃣0️⃣ - (2️⃣0️⃣ + 3️⃣0️⃣) = 3️⃣0️⃣',
      text: 'Avval qavs ichi: 20 + 30 = 50, so‘ng: 80 - 50 = 30.'
    },
    xpReward: 100,
    coinReward: 12,
    estMinutes: 8,
    practice: [
      {
        text: 'Hisoblang: 90 - (40 + 20) = ?',
        options: ['30', '40', '50', '20'],
        correctIndex: 0,
        explanation: 'Qavs ichi: 40 + 20 = 60. So‘ng 90 - 60 = 30.'
      },
      {
        text: 'Hisoblang: 35 + (50 - 20) = ?',
        options: ['65', '55', '75', '45'],
        correctIndex: 0,
        explanation: 'Qavs ichi: 50 - 20 = 30. So‘ng 35 + 30 = 65.'
      },
      {
        text: 'Hisoblang: 68 - (24 + 14) = ?',
        options: ['30', '28', '32', '38'],
        correctIndex: 0,
        explanation: 'Qavs ichi: 24 + 14 = 38. So‘ng 68 - 38 = 30.'
      }
    ],
    test: [
      // Easy (1-6)
      {
        text: 'Hisoblang: 60 - (20 + 10) = ?',
        options: ['30', '40', '20', '50'],
        correctIndex: 0,
        explanation: '20 + 10 = 30, 60 - 30 = 30.'
      },
      {
        text: 'Hisoblang: 70 - (30 + 20) = ?',
        options: ['20', '30', '10', '40'],
        correctIndex: 0,
        explanation: '30 + 20 = 50, 70 - 50 = 20.'
      },
      {
        text: 'Hisoblang: 40 + (30 - 10) = ?',
        options: ['60', '50', '70', '40'],
        correctIndex: 0,
        explanation: '30 - 10 = 20, 40 + 20 = 60.'
      },
      {
        text: 'Hisoblang: 50 + (40 - 20) = ?',
        options: ['70', '60', '80', '50'],
        correctIndex: 0,
        explanation: '40 - 20 = 20, 50 + 20 = 70.'
      },
      {
        text: 'Hisoblang: 80 - (50 - 20) = ?',
        options: ['50', '60', '40', '30'],
        correctIndex: 0,
        explanation: '50 - 20 = 30, 80 - 30 = 50.'
      },
      {
        text: 'Hisoblang: 100 - (60 + 30) = ?',
        options: ['10', '20', '0', '30'],
        correctIndex: 0,
        explanation: '60 + 30 = 90, 100 - 90 = 10.'
      },

      // Medium (7-14)
      {
        text: 'Hisoblang: 56 - (16 + 20) = ?',
        options: ['20', '21', '19', '30'],
        correctIndex: 0,
        explanation: '16 + 20 = 36, 56 - 36 = 20.'
      },
      {
        text: 'Hisoblang: 45 + (38 - 15) = ?',
        options: ['68', '67', '69', '58'],
        correctIndex: 0,
        explanation: '38 - 15 = 23, 45 + 23 = 68.'
      },
      {
        text: 'Hisoblang: 78 - (25 + 23) = ?',
        options: ['30', '29', '31', '20'],
        correctIndex: 0,
        explanation: '25 + 23 = 48, 78 - 48 = 30.'
      },
      {
        text: 'Hisoblang: 86 - (54 - 12) = ?',
        options: ['44', '43', '45', '34'],
        correctIndex: 0,
        explanation: '54 - 12 = 42, 86 - 42 = 44.'
      },
      {
        text: 'Noma’lum sonni toping: 70 - (20 + ?) = 30',
        options: ['20', '10', '30', '40'],
        correctIndex: 0,
        explanation: '70 - 30 = 40, 20 + ? = 40, demak 20.'
      },
      {
        text: 'Taqqoslang: 60 - (15 + 5) va 45',
        options: ['60 - (15 + 5) < 45', '60 - (15 + 5) > 45', '60 - (15 + 5) = 45', '40 > 45'],
        correctIndex: 0,
        explanation: '15 + 5 = 20, 60 - 20 = 40 va 40 < 45.'
      },
      {
        text: 'Hisoblang: (42 + 18) - (25 + 15) = ?',
        options: ['20', '30', '10', '40'],
        correctIndex: 0,
        explanation: '42 + 18 = 60, 25 + 15 = 40, 60 - 40 = 20.'
      },
      {
        text: 'Hisoblang: (55 - 25) + (34 - 14) = ?',
        options: ['50', '40', '60', '45'],
        correctIndex: 0,
        explanation: '55 - 25 = 30, 34 - 14 = 20, 30 + 20 = 50.'
      },

      // Hard (15-18)
      {
        text: 'Hisoblang: 95 - (32 + 23) - 15 = ?',
        options: ['25', '24', '26', '35'],
        correctIndex: 0,
        explanation: '32 + 23 = 55, 95 - 55 = 40, 40 - 15 = 25.'
      },
      {
        text: 'Hisoblang: 30 + (80 - 45) - 20 = ?',
        options: ['45', '44', '46', '35'],
        correctIndex: 0,
        explanation: '80 - 45 = 35, 30 + 35 = 65, 65 - 20 = 45.'
      },
      {
        text: 'Yulduzcha o‘rniga to‘g‘ri belgini qo‘ying: 90 - (30 + 20) * 80 - (20 + 20)',
        options: ['=', '>', '<', '+'],
        correctIndex: 0,
        explanation: '90 - 50 = 40 va 80 - 40 = 40, demak teng (=).'
      },
      {
        text: 'Qaysi ifodaning qiymati 35 ga teng?',
        options: ['65 - (18 + 12)', '70 - (20 + 10)', '85 - (30 + 15)', '55 - (15 + 10)'],
        correctIndex: 0,
        explanation: '18 + 12 = 30, 65 - 30 = 35.'
      },

      // Word problems (19-20)
      {
        text: 'Sardorda 70 ta yong‘oq bor edi. U ukasiga 20 ta, singlisiga 15 ta yong‘oq berdi. Sardorda nechta yong‘oq qoldi?',
        options: ['35 ta', '34 ta', '36 ta', '45 ta'],
        correctIndex: 0,
        explanation: '70 - (20 + 15) = 70 - 35 = 35 ta yong‘oq qoldi.'
      },
      {
        text: 'Do‘konda 80 kg guruch bor edi. Birinchi xaridor 25 kg, ikkinchi xaridor 35 kg guruch sotib oldi. Do‘konda necha kg guruch qoldi?',
        options: ['20 kg', '25 kg', '15 kg', '30 kg'],
        correctIndex: 0,
        explanation: '80 - (25 + 35) = 80 - 60 = 20 kg guruch qoldi.'
      }
    ]
  },

  // 74. Misol va masalalar yechish (1-sinf yakuniy takrorlash)
  {
    bookNumber: 74,
    order: 33,
    title: 'Misol va masalalar yechish',
    shortDesc: '1-sinf matematika kursining yakuniy takrorlash va mustahkamlash darsi.',
    emoji: '🎓',
    intro: 'Tabriklaymiz! Siz 1-sinf matematikasining barcha mavzularini muvaffaqiyatli o‘rganib chiqdingiz. Bu darsda olgan barcha bilimlaringizni sinab ko‘rasiz.',
    keyPoints: [
      '1 dan 100 gacha sonlar, ularning o‘nlik va birliklar tarkibi.',
      'Ikki xonali sonlarni qo‘shish, ayirish, taqqoslash va qavsli ifodalar.',
      'Matnli masalalarni tahlil qilish, reja tuzish va to‘g‘ri yechish.'
    ],
    miniExample: {
      emojis: '🏆 1️⃣0️⃣0️⃣ 🎓 🌟 🥇',
      text: '1-sinf matematika fani yakuniy sinoviga xush kelibsiz!'
    },
    xpReward: 120,
    coinReward: 12,
    estMinutes: 10,
    practice: [
      {
        text: 'Hisoblang: 34 + 25 = ?',
        options: ['59', '58', '60', '49'],
        correctIndex: 0,
        explanation: '30 + 20 = 50, 4 + 5 = 9, 50 + 9 = 59.'
      },
      {
        text: 'Hisoblang: 78 - 34 = ?',
        options: ['44', '43', '45', '34'],
        correctIndex: 0,
        explanation: '70 - 30 = 40, 8 - 4 = 4, 40 + 4 = 44.'
      },
      {
        text: 'Hisoblang: 80 - (25 + 15) = ?',
        options: ['40', '50', '30', '45'],
        correctIndex: 0,
        explanation: '25 + 15 = 40, 80 - 40 = 40.'
      }
    ],
    test: [
      // Easy (1-6)
      {
        text: 'Hisoblang: 40 + 30 = ?',
        options: ['70', '60', '80', '50'],
        correctIndex: 0,
        explanation: '40 + 30 = 70.'
      },
      {
        text: 'Hisoblang: 65 - 5 = ?',
        options: ['60', '55', '65', '50'],
        correctIndex: 0,
        explanation: '65 - 5 = 60.'
      },
      {
        text: '3 ta o‘nlik va 5 ta birlik qaysi sonni tashkil qiladi?',
        options: ['35', '53', '30', '8'],
        correctIndex: 0,
        explanation: '3 o‘nlik va 5 birlik 35 sonidir.'
      },
      {
        text: 'Taqqoslang: 48 va 52',
        options: ['48 < 52', '48 > 52', '48 = 52', '52 < 48'],
        correctIndex: 0,
        explanation: '4 ta o‘nlik 5 ta o‘nlikdan kam, shuning uchun 48 < 52.'
      },
      {
        text: 'Hisoblang: 23 + 4 = ?',
        options: ['27', '26', '28', '37'],
        correctIndex: 0,
        explanation: '3 + 4 = 7, 20 + 7 = 27.'
      },
      {
        text: 'Hisoblang: 59 - 7 = ?',
        options: ['52', '51', '53', '42'],
        correctIndex: 0,
        explanation: '9 - 7 = 2, 50 + 2 = 52.'
      },

      // Medium (7-14)
      {
        text: 'Hisoblang: 42 + 36 = ?',
        options: ['78', '77', '79', '88'],
        correctIndex: 0,
        explanation: '40 + 30 = 70, 2 + 6 = 8, 70 + 8 = 78.'
      },
      {
        text: 'Hisoblang: 87 - 45 = ?',
        options: ['42', '41', '43', '32'],
        correctIndex: 0,
        explanation: '80 - 40 = 40, 7 - 5 = 2, 40 + 2 = 42.'
      },
      {
        text: 'Hisoblang: 30 + 45 - 20 = ?',
        options: ['55', '54', '56', '65'],
        correctIndex: 0,
        explanation: '30 + 45 = 75, 75 - 20 = 55.'
      },
      {
        text: 'Hisoblang: 70 - (18 + 12) = ?',
        options: ['40', '50', '30', '45'],
        correctIndex: 0,
        explanation: '18 + 12 = 30, 70 - 30 = 40.'
      },
      {
        text: 'Qulay usulda hisoblang: 26 + 35 + 4 = ?',
        options: ['65', '64', '66', '55'],
        correctIndex: 0,
        explanation: '(26 + 4) + 35 = 30 + 35 = 65.'
      },
      {
        text: 'Noma’lum sonni toping: ? + 24 = 68',
        options: ['44', '43', '45', '34'],
        correctIndex: 0,
        explanation: '68 - 24 = 44.'
      },
      {
        text: 'Noma’lum sonni toping: 95 - ? = 42',
        options: ['53', '52', '54', '43'],
        correctIndex: 0,
        explanation: '95 - 42 = 53.'
      },
      {
        text: 'Taqqoslang: 35 + 24 va 70 - 11',
        options: ['35 + 24 = 70 - 11', '35 + 24 > 70 - 11', '35 + 24 < 70 - 11', '59 > 59'],
        correctIndex: 0,
        explanation: '35 + 24 = 59 va 70 - 11 = 59, ular teng (=).'
      },

      // Hard (15-18)
      {
        text: 'Hisoblang: 100 - (34 + 26) = ?',
        options: ['40', '50', '30', '45'],
        correctIndex: 0,
        explanation: '34 + 26 = 60, 100 - 60 = 40.'
      },
      {
        text: 'Hisoblang: (47 - 15) + (38 - 18) = ?',
        options: ['52', '51', '53', '42'],
        correctIndex: 0,
        explanation: '47 - 15 = 32, 38 - 18 = 20, 32 + 20 = 52.'
      },
      {
        text: 'Yulduzcha o‘rniga to‘g‘ri belgini qo‘ying: 85 - (20 + 15) * 42 + 8',
        options: ['=', '>', '<', '+'],
        correctIndex: 0,
        explanation: '85 - 35 = 50 va 42 + 8 = 50, demak teng (=).'
      },
      {
        text: 'Qaysi ifodaning qiymati 67 ga teng?',
        options: ['43 + 24', '33 + 24', '53 + 24', '43 + 14'],
        correctIndex: 0,
        explanation: '43 + 24 = 67.'
      },

      // Word problems (19-20)
      {
        text: 'Kutubxonada 45 ta o‘zbek va 32 ta ingliz tilidagi ertak kitob bor edi. O‘quvchilar 24 ta kitobni o‘qishga olishdi. Kutubxonada nechta ertak kitob qoldi?',
        options: ['53 ta', '52 ta', '54 ta', '43 ta'],
        correctIndex: 0,
        explanation: '45 + 32 = 77, 77 - 24 = 53 ta kitob qoldi.'
      },
      {
        text: 'Maktab hovlisiga 26 tup terak, 34 tup archa va 15 tup chinor ekildi. Maktab hovlisiga jami nechta daraxt ekildi?',
        options: ['75 tup', '74 tup', '76 tup', '65 tup'],
        correctIndex: 0,
        explanation: '26 + 34 = 60, 60 + 15 = 75 tup daraxt ekildi.'
      }
    ]
  }
];

export function runPart2Chapter6B() {
  console.log('--- 2-qism VI bob B qismi (69–74-darslar) yaratilmoqda ---');
  for (const l of lessons) {
    const seed = buildLessonSeed(l);
    saveLessonFile(2, l.bookNumber, seed);
    console.log(`  ✓ Dars ${l.bookNumber}: ${l.title} saqlandi.`);
  }
}

runPart2Chapter6B();
