import { LessonDef, buildLessonSeed, saveLessonFile } from './generatorTypes.js';

const lessons: LessonDef[] = [
  // 58. Yaxlit sonlar (10–100)
  {
    bookNumber: 58,
    order: 17,
    title: 'Yaxlit sonlar (10–100)',
    shortDesc: 'Oxiri nol bilan tugaydigan o‘nliklar va ular ustida amallar.',
    emoji: '🔟',
    intro: 'Yaxlit sonlar deb oxiri nol (0) bilan tugaydigan to‘liq o‘nliklarga aytiladi: 10, 20, 30, 40, 50, 60, 70, 80, 90, 100.',
    keyPoints: [
      '1 o‘nlik = 10, 2 o‘nlik = 20, 5 o‘nlik = 50, 10 o‘nlik = 100.',
      'Yaxlit sonlarni qo‘shishda faqat o‘nliklar raqami qo‘shiladi va orqasiga 0 yoziladi: 20 + 30 = 50 (2 o‘nlik + 3 o‘nlik = 5 o‘nlik).',
      'Yaxlit sonlarni ayirish: 70 - 30 = 40 (7 o‘nlik - 3 o‘nlik = 4 o‘nlik).'
    ],
    miniExample: {
      emojis: '📦 📦 📦 + 📦 📦 = 📦 📦 📦 📦 📦',
      text: '3 ta quti (30 dona) va 2 ta quti (20 dona): 30 + 20 = 50.'
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: '3 ta o‘nlik qanday songa teng?',
        options: ['30', '13', '3', '33'],
        correctIndex: 0,
        explanation: 'Har bir o‘nlik 10 ga teng bo‘lib, 3 ta o‘nlik 30 bo‘ladi.'
      },
      {
        text: 'Hisoblang: 40 + 20 = ?',
        options: ['60', '50', '70', '42'],
        correctIndex: 0,
        explanation: '4 o‘nlikka 2 o‘nlik qo‘shilsa 6 o‘nlik, ya’ni 60 bo‘ladi.'
      },
      {
        text: 'Hisoblang: 80 - 30 = ?',
        options: ['50', '60', '40', '55'],
        correctIndex: 0,
        explanation: '8 o‘nlikdan 3 o‘nlik ayirilsa 5 o‘nlik, ya’ni 50 qoladi.'
      }
    ],
    test: [
      // Easy (1-6)
      {
        text: '1 ta o‘nlik nechaga teng?',
        options: ['10', '1', '100', '0'],
        correctIndex: 0,
        explanation: '1 ta to‘liq o‘nlik 10 ga teng.'
      },
      {
        text: '4 ta o‘nlik qaysi sonni bildiradi?',
        options: ['40', '14', '4', '44'],
        correctIndex: 0,
        explanation: '4 ta o‘nlik 40 sonini bildiradi.'
      },
      {
        text: '70 sonida nechta o‘nlik bor?',
        options: ['7 ta', '70 ta', '17 ta', '1 ta'],
        correctIndex: 0,
        explanation: '70 sonida 7 ta to‘liq o‘nlik bor.'
      },
      {
        text: 'Hisoblang: 10 + 20 = ?',
        options: ['30', '21', '40', '12'],
        correctIndex: 0,
        explanation: '1 o‘nlik + 2 o‘nlik = 3 o‘nlik = 30.'
      },
      {
        text: 'Hisoblang: 50 - 10 = ?',
        options: ['40', '60', '30', '51'],
        correctIndex: 0,
        explanation: '50 dan 10 ayirilsa 40 qoladi.'
      },
      {
        text: '100 sonida nechta o‘nlik bor?',
        options: ['10 ta', '100 ta', '1 ta', '20 ta'],
        correctIndex: 0,
        explanation: '100 soni 10 ta o‘nlikdan iborat.'
      },

      // Medium (7-14)
      {
        text: 'Hisoblang: 30 + 40 = ?',
        options: ['70', '60', '80', '34'],
        correctIndex: 0,
        explanation: '30 + 40 = 70.'
      },
      {
        text: 'Hisoblang: 60 - 20 = ?',
        options: ['40', '50', '30', '42'],
        correctIndex: 0,
        explanation: '60 - 20 = 40.'
      },
      {
        text: 'Hisoblang: 50 + 50 = ?',
        options: ['100', '90', '80', '55'],
        correctIndex: 0,
        explanation: '50 + 50 = 100.'
      },
      {
        text: 'Hisoblang: 90 - 40 = ?',
        options: ['50', '60', '40', '49'],
        correctIndex: 0,
        explanation: '90 - 40 = 50.'
      },
      {
        text: 'Noma’lum sonni toping: ? + 30 = 70',
        options: ['40', '50', '30', '100'],
        correctIndex: 0,
        explanation: '70 - 30 = 40, demak noma’lum son 40.'
      },
      {
        text: 'Noma’lum sonni toping: 80 - ? = 20',
        options: ['60', '50', '70', '100'],
        correctIndex: 0,
        explanation: '80 - 20 = 60, demak ayriluvchi 60.'
      },
      {
        text: 'Hisoblang: 20 + 20 + 20 = ?',
        options: ['60', '40', '80', '50'],
        correctIndex: 0,
        explanation: '20 + 20 = 40, 40 + 20 = 60.'
      },
      {
        text: 'Qaysi taqqoslash to‘g‘ri?',
        options: ['40 + 20 > 50', '30 + 10 < 40', '70 - 20 = 40', '80 < 50 + 20'],
        correctIndex: 0,
        explanation: '40 + 20 = 60 va 60 > 50 to‘g‘ri.'
      },

      // Hard (15-18)
      {
        text: 'Hisoblang: 100 - 60 = ?',
        options: ['40', '50', '30', '60'],
        correctIndex: 0,
        explanation: '100 dan 60 ayirilsa 40 qoladi.'
      },
      {
        text: 'Hisoblang: 30 + 50 - 20 = ?',
        options: ['60', '70', '50', '80'],
        correctIndex: 0,
        explanation: '30 + 50 = 80, 80 - 20 = 60.'
      },
      {
        text: 'Hisoblang: 100 - 30 - 30 = ?',
        options: ['40', '50', '60', '30'],
        correctIndex: 0,
        explanation: '100 - 30 = 70, 70 - 30 = 40.'
      },
      {
        text: 'Yulduzcha o‘rniga to‘g‘ri ishorani qo‘ying: 90 - 30 * 40 + 20',
        options: ['=', '>', '<', '+'],
        correctIndex: 0,
        explanation: '90 - 30 = 60 va 40 + 20 = 60, ikkalasi teng (=).'
      },

      // Word problems (19-20)
      {
        text: 'Do‘konda 40 ta qizil va 30 ta ko‘k shar bor edi. Do‘konda jami nechta shar bor?',
        options: ['70 ta', '60 ta', '80 ta', '10 ta'],
        correctIndex: 0,
        explanation: '40 + 30 = 70 ta shar bor.'
      },
      {
        text: 'Avtobusda 50 nafar yo‘lovchi bor edi. Bekatda 20 nafar yo‘lovchi tushdi. Avtobusda necha nafar yo‘lovchi qoldi?',
        options: ['30 nafar', '40 nafar', '20 nafar', '70 nafar'],
        correctIndex: 0,
        explanation: '50 - 20 = 30 nafar yo‘lovchi qoldi.'
      }
    ]
  },

  // 59. 21 dan 100 gacha bo‘lgan sonlar
  {
    bookNumber: 59,
    order: 18,
    title: '21 dan 100 gacha bo‘lgan sonlar',
    shortDesc: 'Ikki xonali sonlarning o‘nlik va birliklar tarkibi.',
    emoji: '🔢',
    intro: '21 dan 100 gacha bo‘lgan sonlar o‘nliklar va birliklardan tuziladi. Masalan, 25 sonida 2 ta o‘nlik va 5 ta birlik bor.',
    keyPoints: [
      'Har qanday ikki xonali sonning chapdagi raqami o‘nlikni, o‘ngdagi raqami birlikni bildiradi.',
      'Misol: 37 = 30 + 7 (3 ta o‘nlik va 7 ta birlik).',
      'Misol: 84 = 80 + 4 (8 ta o‘nlik va 4 ta birlik).'
    ],
    miniExample: {
      emojis: '📦 📦 📦 + 🍬 🍬 🍬 🍬',
      text: '3 ta quti (30 ta) va 4 ta konfet: 30 + 4 = 34 ta konfet.'
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: '2 ta o‘nlik va 7 ta birlikdan qanday son hosil bo‘ladi?',
        options: ['27', '72', '20', '70'],
        correctIndex: 0,
        explanation: '2 ta o‘nlik (20) va 7 ta birlik (7) birlashib 27 hosil qiladi.'
      },
      {
        text: '45 sonida nechta o‘nlik bor?',
        options: ['4 ta', '5 ta', '45 ta', '9 ta'],
        correctIndex: 0,
        explanation: '45 sonida 4 ta o‘nlik va 5 ta birlik bor.'
      },
      {
        text: '60 + 8 ifodaning qiymati nechaga teng?',
        options: ['68', '86', '60', '78'],
        correctIndex: 0,
        explanation: '60 ga 8 qo‘shilsa 68 hosil bo‘ladi.'
      }
    ],
    test: [
      // Easy (1-6)
      {
        text: '3 ta o‘nlik va 2 ta birlik qaysi sonni bildiradi?',
        options: ['32', '23', '30', '5'],
        correctIndex: 0,
        explanation: '3 ta o‘nlik (30) va 2 ta birlik (2) soni 32 dir.'
      },
      {
        text: '56 sonining o‘nliklar xonasidagi raqami qaysi?',
        options: ['5', '6', '50', '56'],
        correctIndex: 0,
        explanation: '56 sonining chapdagi raqami 5 o‘nlikni bildiradi.'
      },
      {
        text: '73 sonining birliklar xonasidagi raqami qaysi?',
        options: ['3', '7', '70', '10'],
        correctIndex: 0,
        explanation: '73 sonining o‘ngdagi raqami 3 birlikni bildiradi.'
      },
      {
        text: '20 + 9 qaysi songa teng?',
        options: ['29', '92', '30', '19'],
        correctIndex: 0,
        explanation: '20 + 9 = 29.'
      },
      {
        text: '4 ta o‘nlik va 8 ta birlik qaysi son?',
        options: ['48', '84', '40', '12'],
        correctIndex: 0,
        explanation: '4 o‘nlik va 8 birlik 48 sonidir.'
      },
      {
        text: '91 sonida nechta birlik bor?',
        options: ['1 ta', '9 ta', '90 ta', '10 ta'],
        correctIndex: 0,
        explanation: '91 sonida 1 ta birlik bor.'
      },

      // Medium (7-14)
      {
        text: '54 sonini o‘nlik va birliklarga ajrating:',
        options: ['50 + 4', '5 + 4', '50 + 40', '40 + 5'],
        correctIndex: 0,
        explanation: '54 = 50 + 4 (5 ta o‘nlik va 4 ta birlik).'
      },
      {
        text: '6 ta o‘nlik va 0 ta birlik qaysi son?',
        options: ['60', '6', '66', '16'],
        correctIndex: 0,
        explanation: '6 ta o‘nlik va 0 ta birlik 60 sonini bildiradi.'
      },
      {
        text: '80 + 5 yig‘indisi nechaga teng?',
        options: ['85', '58', '90', '805'],
        correctIndex: 0,
        explanation: '80 + 5 = 85.'
      },
      {
        text: '67 sonida jami nechta o‘nlik va birlik bor?',
        options: ['6 ta o‘nlik va 7 ta birlik', '7 ta o‘nlik va 6 ta birlik', '60 ta birlik', '13 ta birlik'],
        correctIndex: 0,
        explanation: '67 da 6 ta o‘nlik va 7 ta birlik mavjud.'
      },
      {
        text: 'Noma’lum sonni toping: 40 + ? = 47',
        options: ['7', '4', '17', '40'],
        correctIndex: 0,
        explanation: '47 - 40 = 7.'
      },
      {
        text: 'Noma’lum sonni toping: ? + 3 = 83',
        options: ['80', '8', '70', '83'],
        correctIndex: 0,
        explanation: '83 - 3 = 80.'
      },
      {
        text: '28 sonidan oldin qaysi son keladi?',
        options: ['27', '29', '26', '30'],
        correctIndex: 0,
        explanation: '28 dan oldingi son 27 dir.'
      },
      {
        text: '39 sonidan keyin qaysi son keladi?',
        options: ['40', '38', '41', '50'],
        correctIndex: 0,
        explanation: '39 dan keyin 40 soni keladi.'
      },

      // Hard (15-18)
      {
        text: '9 o‘nlikdan 4 ta birlik ortiq son qaysi?',
        options: ['94', '49', '90', '86'],
        correctIndex: 0,
        explanation: '9 o‘nlik (90) va 4 ta birlik: 90 + 4 = 94.'
      },
      {
        text: 'O‘nliklar raqami 7 ga, birliklar raqami esa o‘nliklaridan 2 taga kam bo‘lgan son qaysi?',
        options: ['75', '72', '57', '79'],
        correctIndex: 0,
        explanation: 'Birliklar: 7 - 2 = 5. Demak son 75.'
      },
      {
        text: 'O‘nliklar va birliklar raqami bir xil bo‘lgan ikki xonali sonni toping:',
        options: ['66', '65', '76', '60'],
        correctIndex: 0,
        explanation: '66 sonida ikkala raqam ham 6 ga teng.'
      },
      {
        text: 'Raqamlari yig‘indisi 5 ga teng bo‘lgan eng katta ikki xonali son qaysi?',
        options: ['50', '41', '32', '23'],
        correctIndex: 0,
        explanation: '50 sonida 5 + 0 = 5 va u boshqalaridan katta.'
      },

      // Word problems (19-20)
      {
        text: 'Kitob javonida 3 ta to‘liq quti kitob (har birida 10 tadan) va yana 6 ta alohida kitob bor. Javonda jami nechta kitob bor?',
        options: ['36 ta', '63 ta', '30 ta', '16 ta'],
        correctIndex: 0,
        explanation: '3 ta o‘nlik (30) va 6 birlik: 30 + 6 = 36 ta kitob.'
      },
      {
        text: 'Gulshanning yoshi 7 da, buvisining yoshi esa 7 ta o‘nlikka teng. Buvisining yoshi nechada?',
        options: ['70 da', '77 da', '60 da', '17 da'],
        correctIndex: 0,
        explanation: '7 ta o‘nlik 70 sonini bildiradi.'
      }
    ]
  },

  // 60. 21 dan 100 gacha bo‘lgan sonlarning o‘qilishi va yozilishi
  {
    bookNumber: 60,
    order: 19,
    title: '21 dan 100 gacha sonlarning o‘qilishi va yozilishi',
    shortDesc: 'Sonlarning so‘z bilan ifodalanishi, o‘qilishi va xona birliklari.',
    emoji: '📝',
    intro: 'Ikki xonali sonlarni o‘qishda avval o‘nlik nomi, keyin birlik nomi aytiladi: masalan, yigirma besh (25), qirq yetti (47).',
    keyPoints: [
      'O‘nliklar: o‘n (10), yigirma (20), o‘ttiz (30), qirq (40), ellik (50), oltmish (60), yetmish (70), sakson (80), to‘qson (90), yuz (100).',
      'Ulug‘ vatandoshimiz Al-Xorazmiy o‘nlik sanoq sistemasini butun dunyoga tanitgan buyuk olimdir.',
      'O‘qilishi: "ellik uch" -> 53, "sakson olti" -> 86.'
    ],
    miniExample: {
      emojis: '🏛️ 📜 ✍️',
      text: '"yetmish sakkiz" so‘zi raqamlar bilan 78 deb yoziladi.'
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: '"O‘ttiz to‘rt" soni qanday yoziladi?',
        options: ['34', '43', '304', '13'],
        correctIndex: 0,
        explanation: '"O‘ttiz to‘rt" raqamlar bilan 34 deb yoziladi.'
      },
      {
        text: '59 soni qanday o‘qiladi?',
        options: ['Ellik to‘qqiz', 'Qirq to‘qqiz', 'To‘qson besh', 'Oltmish to‘qqiz'],
        correctIndex: 0,
        explanation: '59 soni "ellik to‘qqiz" deb o‘qiladi.'
      },
      {
        text: 'O‘nlik sanoq sistemasini dunyoga tanitgan buyuk vatandoshimiz kim?',
        options: ['Al-Xorazmiy', 'Ibn Sino', 'Amir Temur', 'Mirzo Ulug‘bek'],
        correctIndex: 0,
        explanation: 'Al-Xorazmiy o‘nlik sanoq sistemasi va nol raqamini fanga kiritgan.'
      }
    ],
    test: [
      // Easy (1-6)
      {
        text: '"Yigirma olti" soni raqam bilan qanday yoziladi?',
        options: ['26', '62', '206', '16'],
        correctIndex: 0,
        explanation: '"Yigirma olti" soni 26 deb yoziladi.'
      },
      {
        text: '41 soni qanday o‘qiladi?',
        options: ['Qirq bir', 'O‘ttiz bir', 'Bir yuz qirq', 'O‘n to‘rt'],
        correctIndex: 0,
        explanation: '41 soni "qirq bir" deb o‘qiladi.'
      },
      {
        text: '"Yetmish besh" soni raqamda qanday yoziladi?',
        options: ['75', '57', '705', '85'],
        correctIndex: 0,
        explanation: '"Yetmish besh" 75 deb yoziladi.'
      },
      {
        text: '88 soni qanday o‘qiladi?',
        options: ['Sakson sakkiz', 'Yetmish sakkiz', 'To‘qson sakkiz', 'Oltmish sakkiz'],
        correctIndex: 0,
        explanation: '88 soni "sakson sakkiz" deb o‘qiladi.'
      },
      {
        text: '"To‘qson ikki" soni raqam bilan qanday yoziladi?',
        options: ['92', '29', '902', '82'],
        correctIndex: 0,
        explanation: '"To‘qson ikki" 92 deb yoziladi.'
      },
      {
        text: '63 soni qanday o‘qiladi?',
        options: ['Oltmish uch', 'Ellik uch', 'Yetmish uch', 'O‘ttiz olti'],
        correctIndex: 0,
        explanation: '63 soni "oltmish uch" deb o‘qiladi.'
      },

      // Medium (7-14)
      {
        text: '"Ellik" so‘zi qaysi sonni bildiradi?',
        options: ['50', '15', '5', '55'],
        correctIndex: 0,
        explanation: '"Ellik" so‘zi 50 sonini bildiradi.'
      },
      {
        text: '37 soni qaysi ikkita xona birligidan tashkil topgan?',
        options: ['3 ta o‘nlik va 7 ta birlik', '7 ta o‘nlik va 3 ta birlik', '30 ta o‘nlik', '37 ta o‘nlik'],
        correctIndex: 0,
        explanation: '37 soni 3 ta o‘nlik va 7 ta birlikdan tashkil topgan.'
      },
      {
        text: '"Sakson to‘rt" sonining o‘nliklar xonasida qaysi raqam turadi?',
        options: ['8', '4', '80', '84'],
        correctIndex: 0,
        explanation: '"Sakson to‘rt" (84) sonining o‘nliklar xonasida 8 raqami turadi.'
      },
      {
        text: '"Qirq sakkiz" sonining birliklar xonasida qaysi raqam turadi?',
        options: ['8', '4', '40', '80'],
        correctIndex: 0,
        explanation: '"Qirq sakkiz" (48) sonining birliklar xonasida 8 raqami turadi.'
      },
      {
        text: '69 sonidan bitta keyingi son qanday o‘qiladi?',
        options: ['Yetmish', 'Oltmish sakkiz', 'Oltmish o‘n', 'Yetmish bir'],
        correctIndex: 0,
        explanation: '69 dan keyin 70 keladi va u "yetmish" deb o‘qiladi.'
      },
      {
        text: '50 sonidan bitta oldingi son qanday o‘qiladi?',
        options: ['Qirq to‘qqiz', 'Ellik bir', 'Qirq sakkiz', 'Oltmish'],
        correctIndex: 0,
        explanation: '50 dan bitta oldingi son 49 ("qirq to‘qqiz") dir.'
      },
      {
        text: 'Al-Xorazmiy qaysi fanga asos solgan buyuk alloma?',
        options: ['Algebra va matematika', 'Faqat geografiya', 'Faqat rasm', 'Faqat musiqa'],
        correctIndex: 0,
        explanation: 'Muhammad al-Xorazmiy algebra fanining asoschisidir.'
      },
      {
        text: '"To‘qson to‘qqiz" sonidan keyin qaysi son keladi?',
        options: ['Yuz (100)', 'To‘qson sakkiz (98)', 'To‘qson o‘n', 'Sakson (80)'],
        correctIndex: 0,
        explanation: '99 dan keyin 100 (yuz) soni keladi.'
      },

      // Hard (15-18)
      {
        text: 'O‘nliklar raqami "yetti", birliklar raqami "nol" bo‘lgan son qanday o‘qiladi?',
        options: ['Yetmish', 'Yetmish nol', 'O‘n yetti', 'Yetti yuz'],
        correctIndex: 0,
        explanation: '7 ta o‘nlik va 0 ta birlik 70 ("yetmish") bo‘ladi.'
      },
      {
        text: '"Oltmish besh" va "ellik olti" sonlaridan qaysi biri katta?',
        options: ['Oltmish besh (65)', 'Ellik olti (56)', 'Ikkalasi teng', 'Aniqlab bo‘lmaydi'],
        correctIndex: 0,
        explanation: '65 sonining o‘nligi (6) 56 nikidan (5) katta, shuning uchun 65 > 56.'
      },
      {
        text: 'Qaysi son "sakson yetti" dan 1 taga kam?',
        options: ['86', '88', '77', '85'],
        correctIndex: 0,
        explanation: '87 dan 1 taga kam son 86 dir.'
      },
      {
        text: 'Qaysi son "qirq to‘qqiz" dan 1 taga ko‘p?',
        options: ['50', '48', '51', '60'],
        correctIndex: 0,
        explanation: '49 dan 1 taga ko‘p son 50 dir.'
      },

      // Word problems (19-20)
      {
        text: 'Daftarda "qirq besh" deb yozilgan edi. Jasur unga 1 ni qo‘shdi. Qanday son hosil bo‘ldi?',
        options: ['Qirq olti (46)', 'Qirq to‘rt (44)', 'Ellik besh (55)', 'Qirq yetti (47)'],
        correctIndex: 0,
        explanation: '45 + 1 = 46 ("qirq olti").'
      },
      {
        text: 'Madina kitobning "yetmish to‘qqizinchi" sahifasini o‘qib bo‘ldi. Keyingi sahifa raqami qaysi?',
        options: ['Sakson (80)', 'Yetmish sakkiz (78)', 'Sakson bir (81)', 'Yetmish o‘n'],
        correctIndex: 0,
        explanation: '79 dan keyingi sahifa 80 ("sakson") bo‘ladi.'
      }
    ]
  },

  // 61. Cho‘t va o‘ylangan son
  {
    bookNumber: 61,
    order: 20,
    title: 'Cho‘t va o‘ylangan son',
    shortDesc: 'Abakus (cho‘t) da sonlarni ifodalash va mantiqiy topishmoqlar.',
    emoji: '🧮',
    intro: 'Cho‘t (abakus) qadimiy hisoblash asbobi bo‘lib, unda har bir sim alohida xonani (birliklar, o‘nliklar) bildiradi.',
    keyPoints: [
      'Cho‘tning o‘ngdagi simida birliklar, ikkinchi simida o‘nliklar sanaladi.',
      'O‘ylangan son jumboqlarini yechishda amallar teskari tartibda bajariladi: agar "5 qo‘shdim va 12 bo‘ldi" deyilsa, 12 dan 5 ayiriladi.',
      'Mantiqiy fikrlash matematikani oson va qiziqarli o‘rganishga yordam beradi.'
    ],
    miniExample: {
      emojis: '🧮 🔴🔴🔴 | 🔵🔵',
      text: '3 ta o‘nlik toshchasi va 2 ta birlik toshchasi: cho‘tda 32 soni ko‘rsatilgan.'
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: 'Cho‘tning o‘nliklar simida 4 ta, birliklar simida 5 ta toshcha bor. Cho‘tda qaysi son ko‘rsatilgan?',
        options: ['45', '54', '9', '405'],
        correctIndex: 0,
        explanation: '4 ta o‘nlik va 5 ta birlik 45 sonini bildiradi.'
      },
      {
        text: 'Men bir son o‘yladim. Unga 10 ni qo‘shsam 30 bo‘ldi. Men qaysi sonni o‘ylaganman?',
        options: ['20', '10', '40', '25'],
        correctIndex: 0,
        explanation: '30 dan 10 ayirilsa 20 qoladi. O‘ylangan son 20.'
      },
      {
        text: 'Cho‘tning o‘nliklar simida 6 ta toshcha bor, birliklar simi esa bo‘sh (0 ta). Bu qaysi son?',
        options: ['60', '6', '16', '66'],
        correctIndex: 0,
        explanation: '6 ta o‘nlik va 0 ta birlik 60 sonini bildiradi.'
      }
    ],
    test: [
      // Easy (1-6)
      {
        text: 'Cho‘tda 2 ta o‘nlik va 3 ta birlik toshchasi bor. Bu qaysi son?',
        options: ['23', '32', '5', '203'],
        correctIndex: 0,
        explanation: '2 o‘nlik va 3 birlik 23 sonidir.'
      },
      {
        text: 'Men bir son o‘yladim. Unga 5 ni qo‘shsam 15 bo‘ldi. O‘ylangan son qaysi?',
        options: ['10', '20', '5', '8'],
        correctIndex: 0,
        explanation: '15 - 5 = 10.'
      },
      {
        text: 'Cho‘tda 5 ta o‘nlik va 1 ta birlik ko‘rsatilgan. Bu son nechaga teng?',
        options: ['51', '15', '50', '6'],
        correctIndex: 0,
        explanation: '5 ta o‘nlik va 1 birlik 51 bo‘ladi.'
      },
      {
        text: 'Men bir son o‘yladim. Undan 4 ni ayirsam 10 qoldi. O‘ylangan son qaysi?',
        options: ['14', '6', '12', '16'],
        correctIndex: 0,
        explanation: '10 + 4 = 14.'
      },
      {
        text: 'Cho‘tda 7 ta o‘nlik va 0 ta birlik bor. Bu qaysi son?',
        options: ['70', '7', '17', '77'],
        correctIndex: 0,
        explanation: '7 o‘nlik va 0 birlik 70 sonidir.'
      },
      {
        text: 'Men bir son o‘yladim. Unga 20 ni qo‘shsam 50 bo‘ldi. Men qaysi sonni o‘yladim?',
        options: ['30', '40', '20', '70'],
        correctIndex: 0,
        explanation: '50 - 20 = 30.'
      },

      // Medium (7-14)
      {
        text: 'Cho‘tning o‘nliklar simida 3 ta, birliklarida 8 ta toshcha bor. Cho‘tdagi son qaysi?',
        options: ['38', '83', '11', '308'],
        correctIndex: 0,
        explanation: '3 ta o‘nlik va 8 ta birlik 38 sonini beradi.'
      },
      {
        text: 'Men bir son o‘yladim. Undan 20 ni ayirsam 40 qoldi. O‘ylangan son qaysi?',
        options: ['60', '50', '20', '80'],
        correctIndex: 0,
        explanation: '40 + 20 = 60.'
      },
      {
        text: 'Cho‘tda 42 soni ko‘rsatilgan edi. Birliklar simidan 2 ta toshcha olib tashlansa qaysi son qoladi?',
        options: ['40', '24', '44', '20'],
        correctIndex: 0,
        explanation: '42 dan 2 birlik ayirilsa 40 qoladi.'
      },
      {
        text: 'Men bir son o‘yladim. Unga 6 ni qo‘shib, keyin 2 ni ayirsam 14 bo‘ldi. O‘ylangan son qaysi?',
        options: ['10', '12', '8', '16'],
        correctIndex: 0,
        explanation: 'Teskari amal: 14 + 2 = 16, 16 - 6 = 10.'
      },
      {
        text: 'Cho‘tda 60 soni ko‘rsatilgan edi. O‘nliklar simiga yana 2 ta toshcha qo‘shilsa qaysi son hosil bo‘ladi?',
        options: ['80', '62', '70', '90'],
        correctIndex: 0,
        explanation: '6 o‘nlikka 2 o‘nlik qo‘shilsa 8 o‘nlik, ya’ni 80 bo‘ladi.'
      },
      {
        text: 'Men bir son o‘yladim. U 2 ta o‘nlik va 9 ta birlikdan iborat. Bu qaysi son?',
        options: ['29', '92', '20', '11'],
        correctIndex: 0,
        explanation: '2 o‘nlik va 9 birlik 29 sonidir.'
      },
      {
        text: 'Cho‘tda 95 sonini ifodalash uchun o‘nlik va birliklar simiga jami nechta toshcha kerak?',
        options: ['14 ta', '9 ta', '5 ta', '95 ta'],
        correctIndex: 0,
        explanation: '9 ta o‘nlik toshchasi + 5 ta birlik toshchasi = 14 ta toshcha.'
      },
      {
        text: 'Men bir son o‘yladim. U 40 dan 6 taga katta. Bu qaysi son?',
        options: ['46', '34', '50', '64'],
        correctIndex: 0,
        explanation: '40 + 6 = 46.'
      },

      // Hard (15-18)
      {
        text: 'Cho‘tdagi sonning o‘nliklar simida 7 ta toshcha bor. Birliklar toshchasi o‘nliklaridan 3 taga kam. Bu qaysi son?',
        options: ['74', '73', '47', '77'],
        correctIndex: 0,
        explanation: 'Birliklar: 7 - 3 = 4. Demak son 74.'
      },
      {
        text: 'Men bir son o‘yladim. Undan 15 ni ayirsam 20 qoldi. O‘ylangan son qaysi?',
        options: ['35', '25', '40', '30'],
        correctIndex: 0,
        explanation: '20 + 15 = 35.'
      },
      {
        text: 'Cho‘tda 50 soni bor. Birliklar simiga 7 ta toshcha qo‘shilsa, o‘nliklaridan 1 ta toshcha olinsa qaysi son hosil bo‘ladi?',
        options: ['47', '57', '37', '67'],
        correctIndex: 0,
        explanation: 'O‘nlik 5 - 1 = 4 (40), birlik 0 + 7 = 7. Hosil bo‘lgan son 47.'
      },
      {
        text: 'Men bir son o‘yladim. U 60 dan katta va 70 dan kichik, birliklar raqami 8 ga teng. Bu qaysi son?',
        options: ['68', '78', '58', '60'],
        correctIndex: 0,
        explanation: '60 va 70 orasidagi oxiri 8 bilan tugaydigan son 68 dir.'
      },

      // Word problems (19-20)
      {
        text: 'Anvar o‘ylagan soniga 30 ni qo‘shdi va 70 hosil qildi. Anvar qaysi sonni o‘ylagan?',
        options: ['40', '50', '30', '100'],
        correctIndex: 0,
        explanation: '70 - 30 = 40.'
      },
      {
        text: 'Sabina cho‘tda 35 sonini terdi. Dugonasi Nilufar cho‘tdagi o‘nliklar simiga yana 3 ta toshcha qo‘shdi. Endi cho‘tda qaysi son hosil bo‘ldi?',
        options: ['65', '38', '55', '75'],
        correctIndex: 0,
        explanation: '3 o‘nlikka 3 o‘nlik qo‘shilsa 6 o‘nlik (60) bo‘ladi, birlik 5 o‘zgarmaydi: 65.'
      }
    ]
  },

  // 62. Ikki xonali sonlarni taqqoslash
  {
    bookNumber: 62,
    order: 21,
    title: 'Ikki xonali sonlarni taqqoslash',
    shortDesc: 'Ikki xonali sonlarning o‘nlik va birliklarini solishtirish (>, <, =).',
    emoji: '⚖️',
    intro: 'Ikki xonali sonlarni taqqoslashda avval ularning o‘nliklar xonasi solishtiriladi. O‘nligi katta bo‘lgan son katta bo‘ladi.',
    keyPoints: [
      'Agar o‘nliklar teng bo‘lsa, birliklar solishtiriladi: masalan, 47 > 42, chunki 7 > 2.',
      'Agar o‘nliklari har xil bo‘lsa, birliklarga qarash shart emas: masalan, 51 > 39, chunki 5 > 3.',
      'Ikkala sonning o‘nliklari ham, birliklari ham teng bo‘lsa, sonlar teng bo‘ladi: 68 = 68.'
    ],
    miniExample: {
      emojis: '5️⃣3️⃣ > 4️⃣9️⃣',
      text: '53 sonining 5 ta o‘nligi bor, 49 da esa 4 ta. Shuning uchun 53 > 49.'
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: 'Taqqoslang: 35 va 28',
        options: ['35 > 28', '35 < 28', '35 = 28', 'Taqqoslab bo‘lmaydi'],
        correctIndex: 0,
        explanation: '3 ta o‘nlik 2 ta o‘nlikdan katta bo‘lgani uchun 35 > 28.'
      },
      {
        text: 'Taqqoslang: 62 va 67',
        options: ['62 < 67', '62 > 67', '62 = 67', '62 + 67'],
        correctIndex: 0,
        explanation: 'O‘nliklari teng (6), birliklarda esa 2 < 7. Demak 62 < 67.'
      },
      {
        text: 'Quyidagi sonlardan eng kattasini toping: 45, 71, 39, 68',
        options: ['71', '68', '45', '39'],
        correctIndex: 0,
        explanation: '71 sonining o‘nligi (7) barchasidan katta.'
      }
    ],
    test: [
      // Easy (1-6)
      {
        text: 'Taqqoslang: 40 va 30',
        options: ['40 > 30', '40 < 30', '40 = 30', '40 + 30'],
        correctIndex: 0,
        explanation: '4 o‘nlik 3 o‘nlikdan katta bo‘lgani uchun 40 > 30.'
      },
      {
        text: 'Taqqoslang: 25 va 52',
        options: ['25 < 52', '25 > 52', '25 = 52', '52 < 25'],
        correctIndex: 0,
        explanation: '25 da 2 ta o‘nlik, 52 da 5 ta o‘nlik bor. Demak 25 < 52.'
      },
      {
        text: 'Taqqoslang: 64 va 64',
        options: ['64 = 64', '64 > 64', '64 < 64', '64 + 64'],
        correctIndex: 0,
        explanation: 'Ikkala son bir xil bo‘lgani uchun ular teng (=).'
      },
      {
        text: 'Qaysi son 50 dan katta?',
        options: ['54', '49', '45', '39'],
        correctIndex: 0,
        explanation: '54 soni 50 dan katta.'
      },
      {
        text: 'Qaysi son 80 dan kichik?',
        options: ['79', '81', '85', '90'],
        correctIndex: 0,
        explanation: '79 soni 80 dan kichik.'
      },
      {
        text: 'Taqqoslang: 73 va 78',
        options: ['73 < 78', '73 > 78', '73 = 78', '78 < 73'],
        correctIndex: 0,
        explanation: 'O‘nliklari teng (7), birliklarda 3 < 8. Demak 73 < 78.'
      },

      // Medium (7-14)
      {
        text: 'Quyidagi taqqoslashlardan qaysi biri to‘g‘ri?',
        options: ['81 > 79', '43 > 51', '67 < 62', '90 < 89'],
        correctIndex: 0,
        explanation: '81 > 79 to‘g‘ri, chunki 8 ta o‘nlik 7 ta o‘nlikdan katta.'
      },
      {
        text: 'Quyidagi sonlar ichida eng kichigi qaysi: 65, 48, 72, 53',
        options: ['48', '53', '65', '72'],
        correctIndex: 0,
        explanation: '48 sonining o‘nligi (4) eng kichik.'
      },
      {
        text: 'Yulduzcha o‘rniga to‘g‘ri belgini qo‘ying: 50 + 4 * 60',
        options: ['<', '>', '=', '+'],
        correctIndex: 0,
        explanation: '50 + 4 = 54 va 54 < 60.'
      },
      {
        text: 'Yulduzcha o‘rniga to‘g‘ri belgini qo‘ying: 30 + 8 * 38',
        options: ['=', '>', '<', '-'],
        correctIndex: 0,
        explanation: '30 + 8 = 38 va 38 = 38.'
      },
      {
        text: 'Sonlarni o‘sish tartibida to‘g‘ri joylashtiring:',
        options: ['24, 37, 51, 68', '68, 51, 37, 24', '37, 24, 68, 51', '51, 68, 24, 37'],
        correctIndex: 0,
        explanation: 'O‘sish tartibi kichigidan kattasiga qarab: 24 < 37 < 51 < 68.'
      },
      {
        text: 'Sonlarni kamayish tartibida to‘g‘ri joylashtiring:',
        options: ['93, 76, 45, 18', '18, 45, 76, 93', '45, 76, 93, 18', '76, 93, 18, 45'],
        correctIndex: 0,
        explanation: 'Kamayish tartibi kattasidan kichigiga qarab: 93 > 76 > 45 > 18.'
      },
      {
        text: 'Qaysi son 65 dan katta, lekin 70 dan kichik?',
        options: ['68', '64', '72', '60'],
        correctIndex: 0,
        explanation: '68 soni 65 va 70 oralig‘ida joylashgan.'
      },
      {
        text: 'Yulduzcha o‘rniga to‘g‘ri belgini qo‘ying: 70 + 5 * 80 - 10',
        options: ['>', '<', '=', '+'],
        correctIndex: 0,
        explanation: '70 + 5 = 75, 80 - 10 = 70. 75 > 70.'
      },

      // Hard (15-18)
      {
        text: 'Tengsizlik to‘g‘ri bo‘lishi uchun nuqtalar o‘rniga qaysi raqamni qo‘yish mumkin: 4. < 43',
        options: ['2', '5', '4', '8'],
        correctIndex: 0,
        explanation: '42 < 43 to‘g‘ri bo‘ladi.'
      },
      {
        text: 'Tengsizlik to‘g‘ri bo‘lishi uchun nuqtalar o‘rniga qaysi raqamni qo‘yish mumkin: .6 > 76',
        options: ['8', '7', '6', '5'],
        correctIndex: 0,
        explanation: '86 > 76 to‘g‘ri bo‘ladi.'
      },
      {
        text: 'Ikki xonali eng kichik son bilan ikki xonali eng katta sonni taqqoslang:',
        options: ['10 < 99', '10 > 99', '10 = 99', '0 < 100'],
        correctIndex: 0,
        explanation: 'Eng kichik ikki xonali son 10, eng kattasi 99 bo‘lib, 10 < 99.'
      },
      {
        text: 'Hisoblang va taqqoslang: 40 + 30 * 90 - 20',
        options: ['=', '>', '<', '-'],
        correctIndex: 0,
        explanation: '40 + 30 = 70 va 90 - 20 = 70, demak ular teng (=).'
      },

      // Word problems (19-20)
      {
        text: 'Ali 36 ta yong‘oq terdi, Vali esa 42 ta yong‘oq terdi. Kim ko‘proq yong‘oq tergan?',
        options: ['Vali ko‘proq tergan', 'Ali ko‘proq tergan', 'Ikkalasi teng tergan', 'Aniqlab bo‘lmaydi'],
        correctIndex: 0,
        explanation: '42 > 36 bo‘lgani uchun Vali ko‘proq yong‘oq tergan.'
      },
      {
        text: '1-savatchada 55 ta olma, 2-savatchada esa 58 ta olma bor. Qaysi savatchada olma kamroq?',
        options: ['1-savatchada kamroq', '2-savatchada kamroq', 'Ikkalasida teng', '1-savatchada ko‘proq'],
        correctIndex: 0,
        explanation: '55 < 58 bo‘lgani uchun 1-savatchada kamroq olma bor.'
      }
    ]
  }
];

export function runPart2Chapter5() {
  console.log('--- 2-qism V bob (58–62-darslar) yaratilmoqda ---');
  for (const l of lessons) {
    const seed = buildLessonSeed(l);
    saveLessonFile(2, l.bookNumber, seed);
    console.log(`  ✓ Dars ${l.bookNumber}: ${l.title} saqlandi.`);
  }
}

runPart2Chapter5();
