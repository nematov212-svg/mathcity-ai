import { LessonDef, buildLessonSeed, saveLessonFile } from './generatorTypes.js';

const lessons: LessonDef[] = [
  // 63. Ikki xonali sonlarni qo‘shish (1) (birlikka birlik)
  {
    bookNumber: 63,
    order: 22,
    title: 'Ikki xonali sonlarni qo‘shish (1)',
    shortDesc: 'Ikki xonali songa bir xonali sonni qo‘shish (xonadan o‘tmasdan).',
    emoji: '➕',
    intro: 'Ikki xonali songa bir xonali son qo‘shilganda, birliklar birliklarga qo‘shiladi, o‘nliklar o‘zgarmaydi. Masalan: 42 + 5 = 47.',
    keyPoints: [
      'Birliklarni qo‘shamiz: 2 + 5 = 7.',
      'O‘nliklar o‘zgarmaydi: 4 ta o‘nlik (40) saqlanib qoladi.',
      'Yig‘indi: 40 + 7 = 47.'
    ],
    miniExample: {
      emojis: '🟦🟦🟦🟦 ◽◽ + ◽◽◽◽◽ = 4️⃣7️⃣',
      text: '42 + 5 = 47 (birliklarni qo‘shdik: 2 + 5 = 7).'
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: 'Hisoblang: 32 + 4 = ?',
        options: ['36', '35', '37', '72'],
        correctIndex: 0,
        explanation: '2 + 4 = 6, 30 + 6 = 36.'
      },
      {
        text: 'Hisoblang: 51 + 6 = ?',
        options: ['57', '56', '58', '67'],
        correctIndex: 0,
        explanation: '1 + 6 = 7, 50 + 7 = 57.'
      },
      {
        text: 'Hisoblang: 73 + 5 = ?',
        options: ['78', '77', '79', '88'],
        correctIndex: 0,
        explanation: '3 + 5 = 8, 70 + 8 = 78.'
      }
    ],
    test: [
      // Easy (1-6)
      {
        text: 'Hisoblang: 21 + 3 = ?',
        options: ['24', '23', '25', '51'],
        correctIndex: 0,
        explanation: '1 + 3 = 4, 20 + 4 = 24.'
      },
      {
        text: 'Hisoblang: 44 + 2 = ?',
        options: ['46', '45', '47', '64'],
        correctIndex: 0,
        explanation: '4 + 2 = 6, 40 + 6 = 46.'
      },
      {
        text: 'Hisoblang: 63 + 4 = ?',
        options: ['67', '66', '68', '77'],
        correctIndex: 0,
        explanation: '3 + 4 = 7, 60 + 7 = 67.'
      },
      {
        text: 'Hisoblang: 85 + 3 = ?',
        options: ['88', '87', '89', '853'],
        correctIndex: 0,
        explanation: '5 + 3 = 8, 80 + 8 = 88.'
      },
      {
        text: 'Hisoblang: 30 + 7 = ?',
        options: ['37', '73', '307', '47'],
        correctIndex: 0,
        explanation: '30 + 7 = 37.'
      },
      {
        text: 'Hisoblang: 92 + 6 = ?',
        options: ['98', '97', '99', '88'],
        correctIndex: 0,
        explanation: '2 + 6 = 8, 90 + 8 = 98.'
      },

      // Medium (7-14)
      {
        text: 'Hisoblang: 35 + 4 = ?',
        options: ['39', '38', '40', '49'],
        correctIndex: 0,
        explanation: '5 + 4 = 9, 30 + 9 = 39.'
      },
      {
        text: 'Hisoblang: 52 + 7 = ?',
        options: ['59', '58', '60', '57'],
        correctIndex: 0,
        explanation: '2 + 7 = 9, 50 + 9 = 59.'
      },
      {
        text: 'Noma’lum sonni toping: 43 + ? = 48',
        options: ['5', '4', '6', '3'],
        correctIndex: 0,
        explanation: '48 - 43 = 5.'
      },
      {
        text: 'Noma’lum sonni toping: ? + 4 = 67',
        options: ['63', '62', '64', '71'],
        correctIndex: 0,
        explanation: '67 - 4 = 63.'
      },
      {
        text: 'Hisoblang: 74 + 3 = ?',
        options: ['77', '76', '78', '75'],
        correctIndex: 0,
        explanation: '4 + 3 = 7, 70 + 7 = 77.'
      },
      {
        text: 'Taqqoslang: 53 + 4 va 58',
        options: ['53 + 4 < 58', '53 + 4 > 58', '53 + 4 = 58', '53 + 4 + 58'],
        correctIndex: 0,
        explanation: '53 + 4 = 57 va 57 < 58.'
      },
      {
        text: 'Hisoblang: 81 + 8 = ?',
        options: ['89', '88', '90', '99'],
        correctIndex: 0,
        explanation: '1 + 8 = 9, 80 + 9 = 89.'
      },
      {
        text: 'Hisoblang: 26 + 3 = ?',
        options: ['29', '28', '30', '39'],
        correctIndex: 0,
        explanation: '6 + 3 = 9, 20 + 9 = 29.'
      },

      // Hard (15-18)
      {
        text: 'Hisoblang: 41 + 3 + 4 = ?',
        options: ['48', '47', '49', '50'],
        correctIndex: 0,
        explanation: '41 + 3 = 44, 44 + 4 = 48.'
      },
      {
        text: 'Hisoblang: 62 + 5 + 2 = ?',
        options: ['69', '68', '70', '67'],
        correctIndex: 0,
        explanation: '62 + 5 = 67, 67 + 2 = 69.'
      },
      {
        text: 'Yulduzcha o‘rniga to‘g‘ri belgini qo‘ying: 34 + 5 * 32 + 7',
        options: ['=', '>', '<', '+'],
        correctIndex: 0,
        explanation: '34 + 5 = 39 va 32 + 7 = 39, demak teng (=).'
      },
      {
        text: 'Qaysi ifodaning qiymati 78 ga teng?',
        options: ['72 + 6', '71 + 5', '73 + 4', '75 + 2'],
        correctIndex: 0,
        explanation: '72 + 6 = 78.'
      },

      // Word problems (19-20)
      {
        text: 'Sardor 43 bet kitob o‘qigan edi. U yana 5 bet o‘qidi. Sardor jami necha bet kitob o‘qidi?',
        options: ['48 bet', '47 bet', '49 bet', '50 bet'],
        correctIndex: 0,
        explanation: '43 + 5 = 48 bet o‘qidi.'
      },
      {
        text: 'Gulshanning 31 ta nishoni bor edi. Unga ukasi yana 6 ta nishon sovg‘a qildi. Gulshanda nechta nishon bo‘ldi?',
        options: ['37 ta', '36 ta', '38 ta', '47 ta'],
        correctIndex: 0,
        explanation: '31 + 6 = 37 ta nishon bo‘ldi.'
      }
    ]
  },

  // 64. Ikki xonali sonlarni qo‘shish (2) (yaxlit o‘nlikni qo‘shish)
  {
    bookNumber: 64,
    order: 23,
    title: 'Ikki xonali sonlarni qo‘shish (2)',
    shortDesc: 'Ikki xonali songa to‘liq o‘nliklarni qo‘shish: 34 + 20 = 54.',
    emoji: '➕',
    intro: 'Ikki xonali songa to‘liq o‘nlik qo‘shilganda, faqat o‘nliklar o‘zgaradi, birliklar esa o‘zgarishsiz qoladi. Masalan: 34 + 20 = 54.',
    keyPoints: [
      'O‘nliklarni qo‘shamiz: 3 o‘nlik + 2 o‘nlik = 5 o‘nlik (50).',
      'Birliklar o‘zgarmaydi: 4 birlik qoladi.',
      'Yig‘indi: 50 + 4 = 54.'
    ],
    miniExample: {
      emojis: '📦📦📦 + 📦📦 + ◽◽◽◽ = 5️⃣4️⃣',
      text: '34 + 20 = 54 (o‘nliklarni qo‘shdik: 30 + 20 = 50, birlik 4).'
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: 'Hisoblang: 25 + 30 = ?',
        options: ['55', '50', '65', '45'],
        correctIndex: 0,
        explanation: '20 + 30 = 50, 50 + 5 = 55.'
      },
      {
        text: 'Hisoblang: 43 + 20 = ?',
        options: ['63', '53', '73', '60'],
        correctIndex: 0,
        explanation: '40 + 20 = 60, 60 + 3 = 63.'
      },
      {
        text: 'Hisoblang: 61 + 30 = ?',
        options: ['91', '81', '90', '71'],
        correctIndex: 0,
        explanation: '60 + 30 = 90, 90 + 1 = 91.'
      }
    ],
    test: [
      // Easy (1-6)
      {
        text: 'Hisoblang: 14 + 20 = ?',
        options: ['34', '24', '44', '30'],
        correctIndex: 0,
        explanation: '10 + 20 = 30, 30 + 4 = 34.'
      },
      {
        text: 'Hisoblang: 32 + 30 = ?',
        options: ['62', '52', '72', '60'],
        correctIndex: 0,
        explanation: '30 + 30 = 60, 60 + 2 = 62.'
      },
      {
        text: 'Hisoblang: 55 + 10 = ?',
        options: ['65', '56', '75', '60'],
        correctIndex: 0,
        explanation: '55 + 10 = 65.'
      },
      {
        text: 'Hisoblang: 47 + 40 = ?',
        options: ['87', '77', '97', '80'],
        correctIndex: 0,
        explanation: '40 + 40 = 80, 80 + 7 = 87.'
      },
      {
        text: 'Hisoblang: 28 + 50 = ?',
        options: ['78', '68', '88', '70'],
        correctIndex: 0,
        explanation: '20 + 50 = 70, 70 + 8 = 78.'
      },
      {
        text: 'Hisoblang: 63 + 20 = ?',
        options: ['83', '73', '93', '80'],
        correctIndex: 0,
        explanation: '60 + 20 = 80, 80 + 3 = 83.'
      },

      // Medium (7-14)
      {
        text: 'Hisoblang: 36 + 40 = ?',
        options: ['76', '66', '86', '70'],
        correctIndex: 0,
        explanation: '30 + 40 = 70, 70 + 6 = 76.'
      },
      {
        text: 'Noma’lum sonni toping: 24 + ? = 64',
        options: ['40', '30', '50', '20'],
        correctIndex: 0,
        explanation: '64 - 24 = 40.'
      },
      {
        text: 'Noma’lum sonni toping: ? + 30 = 85',
        options: ['55', '45', '65', '35'],
        correctIndex: 0,
        explanation: '85 - 30 = 55.'
      },
      {
        text: 'Taqqoslang: 42 + 30 va 70',
        options: ['42 + 30 > 70', '42 + 30 < 70', '42 + 30 = 70', '42 + 30 + 70'],
        correctIndex: 0,
        explanation: '42 + 30 = 72 va 72 > 70.'
      },
      {
        text: 'Hisoblang: 19 + 60 = ?',
        options: ['79', '69', '89', '70'],
        correctIndex: 0,
        explanation: '10 + 60 = 70, 70 + 9 = 79.'
      },
      {
        text: 'Hisoblang: 51 + 40 = ?',
        options: ['91', '81', '90', '95'],
        correctIndex: 0,
        explanation: '50 + 40 = 90, 90 + 1 = 91.'
      },
      {
        text: 'Hisoblang: 70 + 23 = ?',
        options: ['93', '83', '90', '73'],
        correctIndex: 0,
        explanation: '70 + 20 = 90, 90 + 3 = 93.'
      },
      {
        text: 'Hisoblang: 30 + 45 = ?',
        options: ['75', '65', '85', '70'],
        correctIndex: 0,
        explanation: '30 + 40 = 70, 70 + 5 = 75.'
      },

      // Hard (15-18)
      {
        text: 'Hisoblang: 23 + 30 + 20 = ?',
        options: ['73', '63', '83', '70'],
        correctIndex: 0,
        explanation: '23 + 30 = 53, 53 + 20 = 73.'
      },
      {
        text: 'Hisoblang: 15 + 40 + 30 = ?',
        options: ['85', '75', '95', '80'],
        correctIndex: 0,
        explanation: '15 + 40 = 55, 55 + 30 = 85.'
      },
      {
        text: 'Yulduzcha o‘rniga to‘g‘ri belgini qo‘ying: 36 + 30 * 26 + 40',
        options: ['=', '>', '<', '+'],
        correctIndex: 0,
        explanation: '36 + 30 = 66 va 26 + 40 = 66, ikkalasi teng (=).'
      },
      {
        text: 'Qaysi ifodaning qiymati 87 ga teng?',
        options: ['47 + 40', '37 + 40', '57 + 20', '27 + 50'],
        correctIndex: 0,
        explanation: '47 + 40 = 87.'
      },

      // Word problems (19-20)
      {
        text: 'Kutubxonada 45 ta ertak kitob bor edi. Yana 30 ta yangi ertak kitob keltirildi. Kutubxonada jami nechta ertak kitob bo‘ldi?',
        options: ['75 ta', '65 ta', '85 ta', '70 ta'],
        correctIndex: 0,
        explanation: '45 + 30 = 75 ta kitob bo‘ldi.'
      },
      {
        text: 'Avtoparkda 24 ta yengil mashina va 50 ta avtobus bor. Avtoparkda jami nechta transport vositasi bor?',
        options: ['74 ta', '64 ta', '84 ta', '70 ta'],
        correctIndex: 0,
        explanation: '24 + 50 = 74 ta transport bor.'
      }
    ]
  },

  // 65. Ikki xonali sonlarni qo‘shish (3) (o‘nlikka o‘nlik, birlikka birlik)
  {
    bookNumber: 65,
    order: 24,
    title: 'Ikki xonali sonlarni qo‘shish (3)',
    shortDesc: 'Ikki xonali songa ikki xonali sonni qo‘shish: 23 + 14 = 37.',
    emoji: '➕',
    intro: 'Ikki xonali sonlarni qo‘shishda o‘nliklar o‘nliklarga, birliklar birliklarga qo‘shiladi: 23 + 14 = (20 + 10) + (3 + 4) = 30 + 7 = 37.',
    keyPoints: [
      'O‘nliklarni qo‘shamiz: 20 + 10 = 30.',
      'Birliklarni qo‘shamiz: 3 + 4 = 7.',
      'Natijalarni birlashtiramiz: 30 + 7 = 37.'
    ],
    miniExample: {
      emojis: '2️⃣3️⃣ + 1️⃣4️⃣ = 3️⃣7️⃣',
      text: '20 + 10 = 30; 3 + 4 = 7; 30 + 7 = 37.'
    },
    xpReward: 95,
    coinReward: 10,
    estMinutes: 7,
    practice: [
      {
        text: 'Hisoblang: 34 + 23 = ?',
        options: ['57', '56', '58', '67'],
        correctIndex: 0,
        explanation: '30 + 20 = 50, 4 + 3 = 7, 50 + 7 = 57.'
      },
      {
        text: 'Hisoblang: 42 + 35 = ?',
        options: ['77', '76', '78', '87'],
        correctIndex: 0,
        explanation: '40 + 30 = 70, 2 + 5 = 7, 70 + 7 = 77.'
      },
      {
        text: 'Hisoblang: 51 + 27 = ?',
        options: ['78', '77', '79', '68'],
        correctIndex: 0,
        explanation: '50 + 20 = 70, 1 + 7 = 8, 70 + 8 = 78.'
      }
    ],
    test: [
      // Easy (1-6)
      {
        text: 'Hisoblang: 12 + 23 = ?',
        options: ['35', '34', '36', '45'],
        correctIndex: 0,
        explanation: '10 + 20 = 30, 2 + 3 = 5, 30 + 5 = 35.'
      },
      {
        text: 'Hisoblang: 24 + 31 = ?',
        options: ['55', '54', '56', '65'],
        correctIndex: 0,
        explanation: '20 + 30 = 50, 4 + 1 = 5, 50 + 5 = 55.'
      },
      {
        text: 'Hisoblang: 43 + 15 = ?',
        options: ['58', '57', '59', '68'],
        correctIndex: 0,
        explanation: '40 + 10 = 50, 3 + 5 = 8, 50 + 8 = 58.'
      },
      {
        text: 'Hisoblang: 52 + 24 = ?',
        options: ['76', '75', '77', '86'],
        correctIndex: 0,
        explanation: '50 + 20 = 70, 2 + 4 = 6, 70 + 6 = 76.'
      },
      {
        text: 'Hisoblang: 36 + 42 = ?',
        options: ['78', '77', '79', '88'],
        correctIndex: 0,
        explanation: '30 + 40 = 70, 6 + 2 = 8, 70 + 8 = 78.'
      },
      {
        text: 'Hisoblang: 61 + 25 = ?',
        options: ['86', '85', '87', '76'],
        correctIndex: 0,
        explanation: '60 + 20 = 80, 1 + 5 = 6, 80 + 6 = 86.'
      },

      // Medium (7-14)
      {
        text: 'Hisoblang: 33 + 34 = ?',
        options: ['67', '66', '68', '77'],
        correctIndex: 0,
        explanation: '30 + 30 = 60, 3 + 4 = 7, 60 + 7 = 67.'
      },
      {
        text: 'Hisoblang: 45 + 52 = ?',
        options: ['97', '96', '98', '87'],
        correctIndex: 0,
        explanation: '40 + 50 = 90, 5 + 2 = 7, 90 + 7 = 97.'
      },
      {
        text: 'Noma’lum sonni toping: 25 + ? = 48',
        options: ['23', '22', '24', '13'],
        correctIndex: 0,
        explanation: '48 - 25 = 23.'
      },
      {
        text: 'Noma’lum sonni toping: ? + 31 = 76',
        options: ['45', '44', '46', '35'],
        correctIndex: 0,
        explanation: '76 - 31 = 45.'
      },
      {
        text: 'Hisoblang: 54 + 33 = ?',
        options: ['87', '86', '88', '77'],
        correctIndex: 0,
        explanation: '50 + 30 = 80, 4 + 3 = 7, 80 + 7 = 87.'
      },
      {
        text: 'Taqqoslang: 24 + 13 va 40',
        options: ['24 + 13 < 40', '24 + 13 > 40', '24 + 13 = 40', '24 + 13 + 40'],
        correctIndex: 0,
        explanation: '24 + 13 = 37 va 37 < 40.'
      },
      {
        text: 'Hisoblang: 62 + 27 = ?',
        options: ['89', '88', '90', '79'],
        correctIndex: 0,
        explanation: '60 + 20 = 80, 2 + 7 = 9, 80 + 9 = 89.'
      },
      {
        text: 'Hisoblang: 71 + 18 = ?',
        options: ['89', '88', '90', '99'],
        correctIndex: 0,
        explanation: '70 + 10 = 80, 1 + 8 = 9, 80 + 9 = 89.'
      },

      // Hard (15-18)
      {
        text: 'Hisoblang: 21 + 32 + 14 = ?',
        options: ['67', '66', '68', '57'],
        correctIndex: 0,
        explanation: '21 + 32 = 53, 53 + 14 = 67.'
      },
      {
        text: 'Hisoblang: 34 + 21 + 23 = ?',
        options: ['78', '77', '79', '68'],
        correctIndex: 0,
        explanation: '34 + 21 = 55, 55 + 23 = 78.'
      },
      {
        text: 'Yulduzcha o‘rniga to‘g‘ri belgini qo‘ying: 43 + 25 * 32 + 36',
        options: ['=', '>', '<', '+'],
        correctIndex: 0,
        explanation: '43 + 25 = 68 va 32 + 36 = 68, demak teng (=).'
      },
      {
        text: 'Qaysi ifodaning qiymati 99 ga teng?',
        options: ['64 + 35', '54 + 35', '64 + 25', '74 + 15'],
        correctIndex: 0,
        explanation: '64 + 35 = 99.'
      },

      // Word problems (19-20)
      {
        text: 'Bog‘bon birinchi daraxtdan 32 kg, ikkinchi daraxtdan esa 25 kg olma terdi. Bog‘bon jami necha kg olma terdi?',
        options: ['57 kg', '56 kg', '58 kg', '67 kg'],
        correctIndex: 0,
        explanation: '32 + 25 = 57 kg olma terdi.'
      },
      {
        text: '1-A sinfda 24 nafar, 1-B sinfda esa 23 nafar o‘quvchi bor. Ikkala sinfda jami necha nafar o‘quvchi bor?',
        options: ['47 nafar', '46 nafar', '48 nafar', '57 nafar'],
        correctIndex: 0,
        explanation: '24 + 23 = 47 nafar o‘quvchi bor.'
      }
    ]
  },

  // 66. Ikki xonali sonlarni ayirish (1) (birlikdan birlikni ayirish)
  {
    bookNumber: 66,
    order: 25,
    title: 'Ikki xonali sonlarni ayirish (1)',
    shortDesc: 'Ikki xonali sondan bir xonali sonni ayirish: 37 - 4 = 33.',
    emoji: '➖',
    intro: 'Ikki xonali sondan bir xonali son ayirilganda, birliklardan birliklar ayiriladi, o‘nliklar esa o‘zgarmaydi. Masalan: 37 - 4 = 33.',
    keyPoints: [
      'Birliklardan ayiramiz: 7 - 4 = 3.',
      'O‘nliklar o‘zgarmaydi: 3 ta o‘nlik (30) qoladi.',
      'Natija: 30 + 3 = 33.'
    ],
    miniExample: {
      emojis: '3️⃣7️⃣ - 4️⃣ = 3️⃣3️⃣',
      text: '37 - 4 = 33 (birlikdan ayirdik: 7 - 4 = 3).'
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: 'Hisoblang: 48 - 5 = ?',
        options: ['43', '42', '44', '33'],
        correctIndex: 0,
        explanation: '8 - 5 = 3, 40 + 3 = 43.'
      },
      {
        text: 'Hisoblang: 67 - 3 = ?',
        options: ['64', '63', '65', '54'],
        correctIndex: 0,
        explanation: '7 - 3 = 4, 60 + 4 = 64.'
      },
      {
        text: 'Hisoblang: 89 - 6 = ?',
        options: ['83', '82', '84', '73'],
        correctIndex: 0,
        explanation: '9 - 6 = 3, 80 + 3 = 83.'
      }
    ],
    test: [
      // Easy (1-6)
      {
        text: 'Hisoblang: 25 - 3 = ?',
        options: ['22', '21', '23', '12'],
        correctIndex: 0,
        explanation: '5 - 3 = 2, 20 + 2 = 22.'
      },
      {
        text: 'Hisoblang: 39 - 7 = ?',
        options: ['32', '31', '33', '22'],
        correctIndex: 0,
        explanation: '9 - 7 = 2, 30 + 2 = 32.'
      },
      {
        text: 'Hisoblang: 56 - 4 = ?',
        options: ['52', '51', '53', '42'],
        correctIndex: 0,
        explanation: '6 - 4 = 2, 50 + 2 = 52.'
      },
      {
        text: 'Hisoblang: 78 - 5 = ?',
        options: ['73', '72', '74', '63'],
        correctIndex: 0,
        explanation: '8 - 5 = 3, 70 + 3 = 73.'
      },
      {
        text: 'Hisoblang: 47 - 7 = ?',
        options: ['40', '41', '39', '47'],
        correctIndex: 0,
        explanation: '47 dan 7 ayirilsa to‘liq 40 qoladi.'
      },
      {
        text: 'Hisoblang: 94 - 2 = ?',
        options: ['92', '91', '93', '82'],
        correctIndex: 0,
        explanation: '4 - 2 = 2, 90 + 2 = 92.'
      },

      // Medium (7-14)
      {
        text: 'Hisoblang: 38 - 6 = ?',
        options: ['32', '31', '33', '22'],
        correctIndex: 0,
        explanation: '8 - 6 = 2, 30 + 2 = 32.'
      },
      {
        text: 'Hisoblang: 65 - 4 = ?',
        options: ['61', '60', '62', '51'],
        correctIndex: 0,
        explanation: '5 - 4 = 1, 60 + 1 = 61.'
      },
      {
        text: 'Noma’lum sonni toping: 59 - ? = 54',
        options: ['5', '4', '6', '3'],
        correctIndex: 0,
        explanation: '59 - 54 = 5.'
      },
      {
        text: 'Noma’lum sonni toping: ? - 3 = 72',
        options: ['75', '74', '76', '69'],
        correctIndex: 0,
        explanation: '72 + 3 = 75.'
      },
      {
        text: 'Hisoblang: 87 - 5 = ?',
        options: ['82', '81', '83', '72'],
        correctIndex: 0,
        explanation: '7 - 5 = 2, 80 + 2 = 82.'
      },
      {
        text: 'Taqqoslang: 46 - 4 va 40',
        options: ['46 - 4 > 40', '46 - 4 < 40', '46 - 4 = 40', '46 - 4 + 40'],
        correctIndex: 0,
        explanation: '46 - 4 = 42 va 42 > 40.'
      },
      {
        text: 'Hisoblang: 99 - 8 = ?',
        options: ['91', '90', '92', '81'],
        correctIndex: 0,
        explanation: '9 - 8 = 1, 90 + 1 = 91.'
      },
      {
        text: 'Hisoblang: 76 - 3 = ?',
        options: ['73', '72', '74', '63'],
        correctIndex: 0,
        explanation: '6 - 3 = 3, 70 + 3 = 73.'
      },

      // Hard (15-18)
      {
        text: 'Hisoblang: 58 - 3 - 2 = ?',
        options: ['53', '52', '54', '55'],
        correctIndex: 0,
        explanation: '58 - 3 = 55, 55 - 2 = 53.'
      },
      {
        text: 'Hisoblang: 77 - 4 - 3 = ?',
        options: ['70', '71', '69', '72'],
        correctIndex: 0,
        explanation: '77 - 4 = 73, 73 - 3 = 70.'
      },
      {
        text: 'Yulduzcha o‘rniga to‘g‘ri belgini qo‘ying: 68 - 5 * 61 + 2',
        options: ['=', '>', '<', '+'],
        correctIndex: 0,
        explanation: '68 - 5 = 63 va 61 + 2 = 63, demak teng (=).'
      },
      {
        text: 'Qaysi ifodaning qiymati 84 ga teng?',
        options: ['89 - 5', '88 - 5', '87 - 4', '86 - 3'],
        correctIndex: 0,
        explanation: '89 - 5 = 84.'
      },

      // Word problems (19-20)
      {
        text: 'Savatda 38 dona tuxum bor edi. Taom tayyorlash uchun 6 dona tuxum ishlatildi. Savatda nechta tuxum qoldi?',
        options: ['32 dona', '31 dona', '33 dona', '22 dona'],
        correctIndex: 0,
        explanation: '38 - 6 = 32 dona tuxum qoldi.'
      },
      {
        text: 'Avtobusda 47 nafar yo‘lovchi bor edi. Bekatda 5 nafar yo‘lovchi tushdi. Avtobusda necha nafar yo‘lovchi qoldi?',
        options: ['42 nafar', '41 nafar', '43 nafar', '32 nafar'],
        correctIndex: 0,
        explanation: '47 - 5 = 42 nafar yo‘lovchi qoldi.'
      }
    ]
  },

  // 67. Ikki xonali sonlarni ayirish (2) (yaxlit o‘nlikni ayirish)
  {
    bookNumber: 67,
    order: 26,
    title: 'Ikki xonali sonlarni ayirish (2)',
    shortDesc: 'Ikki xonali sondan to‘liq o‘nliklarni ayirish: 56 - 20 = 36.',
    emoji: '➖',
    intro: 'Ikki xonali sondan to‘liq o‘nlik ayirilganda, o‘nliklardan o‘nliklar ayiriladi, birliklar o‘zgarmaydi. Masalan: 56 - 20 = 36.',
    keyPoints: [
      'O‘nliklardan ayiramiz: 50 - 20 = 30.',
      'Birliklar o‘zgarmaydi: 6 qoladi.',
      'Natija: 30 + 6 = 36.'
    ],
    miniExample: {
      emojis: '5️⃣6️⃣ - 2️⃣0️⃣ = 3️⃣6️⃣',
      text: '56 - 20 = 36 (o‘nliklardan ayirdik: 50 - 20 = 30, birlik 6).'
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: 'Hisoblang: 47 - 20 = ?',
        options: ['27', '26', '28', '37'],
        correctIndex: 0,
        explanation: '40 - 20 = 20, 20 + 7 = 27.'
      },
      {
        text: 'Hisoblang: 65 - 30 = ?',
        options: ['35', '34', '36', '45'],
        correctIndex: 0,
        explanation: '60 - 30 = 30, 30 + 5 = 35.'
      },
      {
        text: 'Hisoblang: 82 - 50 = ?',
        options: ['32', '31', '33', '42'],
        correctIndex: 0,
        explanation: '80 - 50 = 30, 30 + 2 = 32.'
      }
    ],
    test: [
      // Easy (1-6)
      {
        text: 'Hisoblang: 35 - 10 = ?',
        options: ['25', '24', '26', '15'],
        correctIndex: 0,
        explanation: '30 - 10 = 20, 20 + 5 = 25.'
      },
      {
        text: 'Hisoblang: 54 - 20 = ?',
        options: ['34', '33', '35', '24'],
        correctIndex: 0,
        explanation: '50 - 20 = 30, 30 + 4 = 34.'
      },
      {
        text: 'Hisoblang: 76 - 40 = ?',
        options: ['36', '35', '37', '46'],
        correctIndex: 0,
        explanation: '70 - 40 = 30, 30 + 6 = 36.'
      },
      {
        text: 'Hisoblang: 88 - 30 = ?',
        options: ['58', '57', '59', '48'],
        correctIndex: 0,
        explanation: '80 - 30 = 50, 50 + 8 = 58.'
      },
      {
        text: 'Hisoblang: 63 - 50 = ?',
        options: ['13', '12', '14', '23'],
        correctIndex: 0,
        explanation: '60 - 50 = 10, 10 + 3 = 13.'
      },
      {
        text: 'Hisoblang: 91 - 60 = ?',
        options: ['31', '30', '32', '21'],
        correctIndex: 0,
        explanation: '90 - 60 = 30, 30 + 1 = 31.'
      },

      // Medium (7-14)
      {
        text: 'Hisoblang: 49 - 30 = ?',
        options: ['19', '18', '20', '29'],
        correctIndex: 0,
        explanation: '40 - 30 = 10, 10 + 9 = 19.'
      },
      {
        text: 'Noma’lum sonni toping: 74 - ? = 44',
        options: ['30', '20', '40', '50'],
        correctIndex: 0,
        explanation: '74 - 44 = 30.'
      },
      {
        text: 'Noma’lum sonni toping: ? - 40 = 25',
        options: ['65', '55', '75', '45'],
        correctIndex: 0,
        explanation: '25 + 40 = 65.'
      },
      {
        text: 'Taqqoslang: 58 - 30 va 30',
        options: ['58 - 30 < 30', '58 - 30 > 30', '58 - 30 = 30', '58 - 30 + 30'],
        correctIndex: 0,
        explanation: '58 - 30 = 28 va 28 < 30.'
      },
      {
        text: 'Hisoblang: 83 - 60 = ?',
        options: ['23', '22', '24', '33'],
        correctIndex: 0,
        explanation: '80 - 60 = 20, 20 + 3 = 23.'
      },
      {
        text: 'Hisoblang: 97 - 70 = ?',
        options: ['27', '26', '28', '17'],
        correctIndex: 0,
        explanation: '90 - 70 = 20, 20 + 7 = 27.'
      },
      {
        text: 'Hisoblang: 66 - 20 = ?',
        options: ['46', '45', '47', '36'],
        correctIndex: 0,
        explanation: '60 - 20 = 40, 40 + 6 = 46.'
      },
      {
        text: 'Hisoblang: 72 - 50 = ?',
        options: ['22', '21', '23', '32'],
        correctIndex: 0,
        explanation: '70 - 50 = 20, 20 + 2 = 22.'
      },

      // Hard (15-18)
      {
        text: 'Hisoblang: 86 - 30 - 20 = ?',
        options: ['36', '35', '37', '26'],
        correctIndex: 0,
        explanation: '86 - 30 = 56, 56 - 20 = 36.'
      },
      {
        text: 'Hisoblang: 95 - 40 - 30 = ?',
        options: ['25', '24', '26', '35'],
        correctIndex: 0,
        explanation: '95 - 40 = 55, 55 - 30 = 25.'
      },
      {
        text: 'Yulduzcha o‘rniga to‘g‘ri belgini qo‘ying: 74 - 20 * 34 + 20',
        options: ['=', '>', '<', '+'],
        correctIndex: 0,
        explanation: '74 - 20 = 54 va 34 + 20 = 54, demak teng (=).'
      },
      {
        text: 'Qaysi ifodaning qiymati 42 ga teng?',
        options: ['72 - 30', '62 - 30', '82 - 30', '52 - 20'],
        correctIndex: 0,
        explanation: '72 - 30 = 42.'
      },

      // Word problems (19-20)
      {
        text: 'Omborda 68 qop un bor edi. Nonvoyxonaga 40 qop un jo‘natildi. Omborda necha qop un qoldi?',
        options: ['28 qop', '27 qop', '29 qop', '18 qop'],
        correctIndex: 0,
        explanation: '68 - 40 = 28 qop un qoldi.'
      },
      {
        text: 'Samolyotda 85 nafar yo‘lovchi bor edi. Birinchi oraliq qo‘nishda 50 nafar yo‘lovchi tushdi. Samolyotda necha nafar yo‘lovchi qoldi?',
        options: ['35 nafar', '34 nafar', '36 nafar', '25 nafar'],
        correctIndex: 0,
        explanation: '85 - 50 = 35 nafar yo‘lovchi qoldi.'
      }
    ]
  },

  // 68. Ikki xonali sonlarni ayirish (3) (ikki xonalidan ikki xonali)
  {
    bookNumber: 68,
    order: 27,
    title: 'Ikki xonali sonlarni ayirish (3)',
    shortDesc: 'Ikki xonali sondan ikki xonali sonni ayirish: 48 - 25 = 23.',
    emoji: '➖',
    intro: 'Ikki xonali sondan ikki xonali sonni ayirishda o‘nliklardan o‘nliklar, birliklardan birliklar ayiriladi: 48 - 25 = (40 - 20) + (8 - 5) = 20 + 3 = 23.',
    keyPoints: [
      'O‘nliklarni ayiramiz: 40 - 20 = 20.',
      'Birliklarni ayiramiz: 8 - 5 = 3.',
      'Natijalarni qo‘shamiz: 20 + 3 = 23.'
    ],
    miniExample: {
      emojis: '4️⃣8️⃣ - 2️⃣5️⃣ = 2️⃣3️⃣',
      text: '40 - 20 = 20; 8 - 5 = 3; 20 + 3 = 23.'
    },
    xpReward: 95,
    coinReward: 10,
    estMinutes: 7,
    practice: [
      {
        text: 'Hisoblang: 57 - 24 = ?',
        options: ['33', '32', '34', '23'],
        correctIndex: 0,
        explanation: '50 - 20 = 30, 7 - 4 = 3, 30 + 3 = 33.'
      },
      {
        text: 'Hisoblang: 68 - 35 = ?',
        options: ['33', '32', '34', '43'],
        correctIndex: 0,
        explanation: '60 - 30 = 30, 8 - 5 = 3, 30 + 3 = 33.'
      },
      {
        text: 'Hisoblang: 79 - 46 = ?',
        options: ['33', '32', '34', '23'],
        correctIndex: 0,
        explanation: '70 - 40 = 30, 9 - 6 = 3, 30 + 3 = 33.'
      }
    ],
    test: [
      // Easy (1-6)
      {
        text: 'Hisoblang: 35 - 12 = ?',
        options: ['23', '22', '24', '13'],
        correctIndex: 0,
        explanation: '30 - 10 = 20, 5 - 2 = 3, 20 + 3 = 23.'
      },
      {
        text: 'Hisoblang: 46 - 23 = ?',
        options: ['23', '22', '24', '33'],
        correctIndex: 0,
        explanation: '40 - 20 = 20, 6 - 3 = 3, 20 + 3 = 23.'
      },
      {
        text: 'Hisoblang: 58 - 34 = ?',
        options: ['24', '23', '25', '14'],
        correctIndex: 0,
        explanation: '50 - 30 = 20, 8 - 4 = 4, 20 + 4 = 24.'
      },
      {
        text: 'Hisoblang: 67 - 45 = ?',
        options: ['22', '21', '23', '32'],
        correctIndex: 0,
        explanation: '60 - 40 = 20, 7 - 5 = 2, 20 + 2 = 22.'
      },
      {
        text: 'Hisoblang: 79 - 26 = ?',
        options: ['53', '52', '54', '43'],
        correctIndex: 0,
        explanation: '70 - 20 = 50, 9 - 6 = 3, 50 + 3 = 53.'
      },
      {
        text: 'Hisoblang: 84 - 51 = ?',
        options: ['33', '32', '34', '23'],
        correctIndex: 0,
        explanation: '80 - 50 = 30, 4 - 1 = 3, 30 + 3 = 33.'
      },

      // Medium (7-14)
      {
        text: 'Hisoblang: 49 - 27 = ?',
        options: ['22', '21', '23', '12'],
        correctIndex: 0,
        explanation: '40 - 20 = 20, 9 - 7 = 2, 20 + 2 = 22.'
      },
      {
        text: 'Hisoblang: 66 - 33 = ?',
        options: ['33', '32', '34', '23'],
        correctIndex: 0,
        explanation: '60 - 30 = 30, 6 - 3 = 3, 30 + 3 = 33.'
      },
      {
        text: 'Noma’lum sonni toping: 75 - ? = 42',
        options: ['33', '32', '34', '23'],
        correctIndex: 0,
        explanation: '75 - 42 = 33.'
      },
      {
        text: 'Noma’lum sonni toping: ? - 21 = 54',
        options: ['75', '74', '76', '65'],
        correctIndex: 0,
        explanation: '54 + 21 = 75.'
      },
      {
        text: 'Hisoblang: 88 - 56 = ?',
        options: ['32', '31', '33', '22'],
        correctIndex: 0,
        explanation: '80 - 50 = 30, 8 - 6 = 2, 30 + 2 = 32.'
      },
      {
        text: 'Taqqoslang: 65 - 23 va 40',
        options: ['65 - 23 > 40', '65 - 23 < 40', '65 - 23 = 40', '65 - 23 + 40'],
        correctIndex: 0,
        explanation: '65 - 23 = 42 va 42 > 40.'
      },
      {
        text: 'Hisoblang: 96 - 44 = ?',
        options: ['52', '51', '53', '42'],
        correctIndex: 0,
        explanation: '90 - 40 = 50, 6 - 4 = 2, 50 + 2 = 52.'
      },
      {
        text: 'Hisoblang: 77 - 35 = ?',
        options: ['42', '41', '43', '32'],
        correctIndex: 0,
        explanation: '70 - 30 = 40, 7 - 5 = 2, 40 + 2 = 42.'
      },

      // Hard (15-18)
      {
        text: 'Hisoblang: 89 - 34 - 23 = ?',
        options: ['32', '31', '33', '22'],
        correctIndex: 0,
        explanation: '89 - 34 = 55, 55 - 23 = 32.'
      },
      {
        text: 'Hisoblang: 78 - 25 - 31 = ?',
        options: ['22', '21', '23', '32'],
        correctIndex: 0,
        explanation: '78 - 25 = 53, 53 - 31 = 22.'
      },
      {
        text: 'Yulduzcha o‘rniga to‘g‘ri belgini qo‘ying: 58 - 24 * 69 - 35',
        options: ['=', '>', '<', '+'],
        correctIndex: 0,
        explanation: '58 - 24 = 34 va 69 - 35 = 34, demak teng (=).'
      },
      {
        text: 'Qaysi ifodaning qiymati 31 ga teng?',
        options: ['65 - 34', '65 - 24', '75 - 34', '55 - 14'],
        correctIndex: 0,
        explanation: '65 - 34 = 31.'
      },

      // Word problems (19-20)
      {
        text: 'Maktab bog‘ida 56 tup gul bor edi. Bolalar 23 tup gulni sug‘orishdi. Yana necha tup gulni sug‘orish kerak?',
        options: ['33 tup', '32 tup', '34 tup', '23 tup'],
        correctIndex: 0,
        explanation: '56 - 23 = 33 tup gul qoldi.'
      },
      {
        text: 'Karvon 68 km yo‘l bosishi kerak edi. Ular 35 km yo‘l yurishdi. Karvonga yana necha km yo‘l qoldi?',
        options: ['33 km', '32 km', '34 km', '23 km'],
        correctIndex: 0,
        explanation: '68 - 35 = 33 km qoldi.'
      }
    ]
  }
];

export function runPart2Chapter6A() {
  console.log('--- 2-qism VI bob A qismi (63–68-darslar) yaratilmoqda ---');
  for (const l of lessons) {
    const seed = buildLessonSeed(l);
    saveLessonFile(2, l.bookNumber, seed);
    console.log(`  ✓ Dars ${l.bookNumber}: ${l.title} saqlandi.`);
  }
}

runPart2Chapter6A();
