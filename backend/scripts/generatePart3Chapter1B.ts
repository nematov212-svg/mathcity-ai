import { LessonDataDef, buildLessonSeed, saveLessonFile } from './generatorTypes.js';

const lessonsPart3Ch1B: LessonDataDef[] = [
  // 7-dars. Butunni topishga doir masalalar (2)
  {
    bookNumber: 7,
    title: 'Butunni topishga doir masalalar (2)',
    emoji: '🧹',
    shortDesc: 'Xonalar bo‘yicha va qulay usulda qo‘shish orqali butunni topish.',
    intro: 'Sonlarni xonalariga ajratib: o‘nliklarni o‘nliklarga, birliklarni birliklarga qo‘shish butunni tez topish imkonini beradi.',
    keyPoints: [
      'Xonalar bo‘yicha qo‘shish: 3 o‘nlik 4 birlik + 2 o‘nlik 1 birlik = 5 o‘nlik 5 birlik (55).',
      'Qulay usulda qo‘shish: yaxlit o‘nliklarni alohida qo‘shib olinadi.',
      'Shartdagi qismlarni to‘ldirib, so‘ng butun topiladi.',
    ],
    miniExample: {
      emojis: '🧹 22 xona + 36 xona = 58 xona tozalash',
      text: 'Tozalovchi robot 22 ta va 36 ta xonani tozaladi. Qulay qo‘shish: 20 + 30 = 50, 2 + 6 = 8, jami 58 ta.',
    },
    xpReward: 95,
    coinReward: 10,
    estMinutes: 8,
    practice: [
      {
        text: '3 o‘nlik 4 birlik va 2 o‘nlik 1 birlik yig‘indisi nechaga teng?',
        correctAnswer: '55 (5 o‘nlik 5 birlik)',
        distractors: ['54', '45', '65'],
        explanation: '30 + 20 = 50, 4 + 1 = 5. Jami: 55.',
      },
      {
        text: '22 + 36 yig‘indisini qulay usulda hisoblang:',
        correctAnswer: '58 (20 + 30 = 50, 2 + 6 = 8)',
        distractors: ['56', '60', '48'],
        explanation: 'O‘nliklar 50, birliklar 8, jami 58.',
      },
      {
        text: 'Maktab binosida 1-qavatda 24 ta, 2-qavatda 25 ta xona bor. Binoda jami nechta xona bor?',
        correctAnswer: '49 ta (24 + 25 = 49)',
        distractors: ['48 ta', '50 ta', '39 ta'],
        explanation: '24 + 25 = 49 ta xona.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: '4 o‘nlik 2 birlik va 3 o‘nlik 5 birlik yig‘indisi necha bo‘ladi?',
        correctAnswer: '77 (7 o‘nlik 7 birlik)',
        distractors: ['75', '87', '67'],
        explanation: '40 + 30 = 70, 2 + 5 = 7. Natija: 77.',
      },
      {
        text: 'Qulay hisoblash usuli: 31 + 45 = ?',
        correctAnswer: '76 (30 + 40 = 70, 1 + 5 = 6)',
        distractors: ['75', '86', '66'],
        explanation: '70 + 6 = 76.',
      },
      {
        text: 'Bir xaltada 23 ta, ikkinchi xaltada 34 ta yong‘oq bor. Ikkala xaltada jami nechta yong‘oq bor?',
        correctAnswer: '57 ta (23 + 34 = 57)',
        distractors: ['55 ta', '59 ta', '11 ta'],
        explanation: '23 + 34 = 57 ta yong‘oq.',
      },
      {
        text: '52 + 16 ifodaning qiymati nechaga teng?',
        correctAnswer: '68',
        distractors: ['66', '70', '58'],
        explanation: '50 + 10 = 60, 2 + 6 = 8. Natija: 68.',
      },
      {
        text: '«1 o‘nlik 8 birlik + 2 o‘nlik 1 birlik = ?»',
        correctAnswer: '39 (3 o‘nlik 9 birlik)',
        distractors: ['29', '49', '38'],
        explanation: '10 + 20 = 30, 8 + 1 = 9. Jami 39.',
      },
      {
        text: 'Sinfdagi kitob javonida 41 ta ertak va 27 ta she’riy kitob bor. Javonda jami nechta kitob bor?',
        correctAnswer: '68 ta (41 + 27 = 68)',
        distractors: ['67 ta', '69 ta', '14 ta'],
        explanation: '41 + 27 = 68 ta kitob.',
      },

      // 8 ta o'rtacha
      {
        text: '22 + 36 misolini yechishda o‘nliklar yig‘indisi nechaga teng bo‘ladi?',
        correctAnswer: '50 (20 + 30 = 50)',
        distractors: ['40', '60', '8'],
        explanation: '2 ta o‘nlik va 3 ta o‘nlik: 20 + 30 = 50.',
      },
      {
        text: 'Robot-tozalagich 1-binoda 34 xona, 2-binoda 44 xonani tozaladi. Robot jami nechta xona tozalagan?',
        correctAnswer: '78 ta (34 + 44 = 78)',
        distractors: ['76 ta', '80 ta', '10 ta'],
        explanation: '34 + 44 = 78 ta xona.',
      },
      {
        text: 'Qaysi ifoda 6 o‘nlik 8 birlikni ifodalaydi?',
        correctAnswer: '45 + 23 (chunki 45 + 23 = 68)',
        distractors: ['40 + 20', '50 + 15', '30 + 30'],
        explanation: '45 + 23 = 68 = 6 o‘nlik 8 birlik.',
      },
      {
        text: 'O‘quvchilar bog‘ga 33 tup qayrag‘och va 25 tup terak ekishdi. Bog‘ga jami nechta daraxt ekildi?',
        correctAnswer: '58 tup (33 + 25 = 58)',
        distractors: ['57 tup', '60 tup', '8 tup'],
        explanation: '33 + 25 = 58 tup ko‘chat.',
      },
      {
        text: '61 + 27 yig‘indisini hisoblang:',
        correctAnswer: '88',
        distractors: ['87', '89', '78'],
        explanation: '60 + 20 = 80, 1 + 7 = 8. Natija: 88.',
      },
      {
        text: 'Dukonda 1-kuni 26 qop un, 2-kuni 32 qop un sotildi. Ikki kunda jami necha qop un sotilgan?',
        correctAnswer: '58 qop (26 + 32 = 58)',
        distractors: ['56 qop', '60 qop', '6 qop'],
        explanation: '26 + 32 = 58 qop un.',
      },
      {
        text: 'Bo‘sh katakni to‘ldiring: 43 + □ = 75',
        correctAnswer: '32 (75 - 43 = 32)',
        distractors: ['30', '35', '118'],
        explanation: '75 - 43 = 32.',
      },
      {
        text: 'Toshkent shahrida 1-avtobus saroyiga 35 ta, 2-saroyga 42 ta yangi avtobus berildi. Jami nechta yangi avtobus berildi?',
        correctAnswer: '77 ta (35 + 42 = 77)',
        distractors: ['75 ta', '80 ta', '7 ta'],
        explanation: '35 + 42 = 77 ta avtobus.',
      },

      // 4 ta qiyinroq
      {
        text: 'Qisqa yozuv: I qism — 3 o‘nlik 2 birlik, II qism — 4 o‘nlik 6 birlik. Butun miqdor qancha?',
        correctAnswer: '78 (7 o‘nlik 8 birlik)',
        distractors: ['76', '80', '14'],
        explanation: '32 + 46 = 78.',
      },
      {
        text: 'Maktab oshxonasiga 24 kg pishloq va 45 kg go‘sht keltirildi. Jami necha kg oziq-ovqat keltirildi?',
        correctAnswer: '69 kg (24 + 45 = 69)',
        distractors: ['65 kg', '70 kg', '21 kg'],
        explanation: '24 + 45 = 69 kg.',
      },
      {
        text: 'Bog‘bon 53 tup anjir va 24 tup anor ko‘chati o‘tqazdi. Jami ko‘chatlar soni nechta?',
        correctAnswer: '77 tup (53 + 24 = 77)',
        distractors: ['75 tup', '80 tup', '29 tup'],
        explanation: '53 + 24 = 77 tup.',
      },
      {
        text: 'Sport musobaqasida 1-guruhda 36 nafar, 2-guruhda 43 nafar bola qatnashdi. Musobaqada jami necha bola qatnashgan?',
        correctAnswer: '79 nafar (36 + 43 = 79)',
        distractors: ['77 nafar', '80 nafar', '7 nafar'],
        explanation: '36 + 43 = 79 nafar bola.',
      },

      // 2 ta murakkab masala
      {
        text: 'Pochta droni 1-reysda 23 ta, 2-reysda 31 ta va 3-reysda 25 ta xat tashidi. Dron uchala reysda jami nechta xat tashigan?',
        correctAnswer: '79 ta (23 + 31 + 25 = 79)',
        distractors: ['75 ta', '80 ta', '69 ta'],
        explanation: '23 + 31 = 54, 54 + 25 = 79 ta xat.',
      },
      {
        text: 'Qurilish maydoniga 1-kuni 32 ta, 2-kuni 24 ta va 3-kuni 22 ta temir-beton plita olib kelindi. Jami nechta plita olib kelindi?',
        correctAnswer: '78 ta (32 + 24 + 22 = 78)',
        distractors: ['76 ta', '80 ta', '68 ta'],
        explanation: '32 + 24 = 56, 56 + 22 = 78 ta plita.',
      },
    ],
  },

  // 8-dars. Butunni topishga doir masalalar (3)
  {
    bookNumber: 8,
    title: 'Butunni topishga doir masalalar (3)',
    emoji: '🏥',
    shortDesc: 'Qonuniyatlar, qo‘shni sonlar va kasalxona robotlari masalalari.',
    intro: 'Aqlli robotlar xizmati orqali butunni hisoblash, qonuniyatli ketma-ketliklar va qo‘shni sonlar yig‘indisini o‘rganamiz.',
    keyPoints: [
      'Kasalxona roboti palatalarni tozalashida qismlar: 22 ta va 24 ta palata = 46 ta.',
      'Qo‘shni sonlar: biri ikkinchisidan 1 ga farq qiladigan sonlar (masalan, 7 va 8).',
      'Qonuniyatni aniqlash butunni oldindan hisoblashga yordam beradi.',
    ],
    miniExample: {
      emojis: '🏥 22 palata + 24 palata = 46 palata',
      text: 'Robot shifoxonaning 1-qavatida 22 ta, 2-qavatida 24 ta palatani tozaladi. Jami: 22 + 24 = 46 palata.',
    },
    xpReward: 95,
    coinReward: 10,
    estMinutes: 8,
    practice: [
      {
        text: 'Robot palatalarni tozalaydi: 1-bo‘limda 22 ta, 2-bo‘limda 24 ta palata. Jami palatalar soni nechta?',
        correctAnswer: '46 ta (22 + 24 = 46)',
        distractors: ['44 ta', '48 ta', '2 ta'],
        explanation: '22 + 24 = 46 ta palata.',
      },
      {
        text: '7 va uning o‘ng qo‘shnisi (8) yig‘indisi nechaga teng?',
        correctAnswer: '15 (7 + 8 = 15)',
        distractors: ['14', '16', '13'],
        explanation: '7 ning o‘ng qo‘shnisi 8, 7 + 8 = 15.',
      },
      {
        text: 'Shifoxonada 7 ta o‘g‘il bola va 4 ta qiz bola davolanmoqda. Jami nechta bola davolanmoqda?',
        correctAnswer: '11 nafar (7 + 4 = 11)',
        distractors: ['10 nafar', '12 nafar', '3 nafar'],
        explanation: '7 + 4 = 11 nafar bola.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: '22 va 24 sonlarining yig‘indisini hisoblang:',
        correctAnswer: '46',
        distractors: ['44', '48', '40'],
        explanation: '22 + 24 = 46.',
      },
      {
        text: '7 va 4 sonlarining yig‘indisi nechaga teng?',
        correctAnswer: '11',
        distractors: ['10', '12', '3'],
        explanation: '7 + 4 = 11.',
      },
      {
        text: '9 sonining ikkala qo‘shnisi (8 va 10) yig‘indisi nechaga teng?',
        correctAnswer: '18 (8 + 10 = 18)',
        distractors: ['17', '19', '16'],
        explanation: '9 ning chap qo‘shnisi 8, o‘ng qo‘shnisi 10. 8 + 10 = 18.',
      },
      {
        text: 'Kasalxonada ertalab 14 nafar, tushdan keyin 15 nafar bemor qabul qilindi. Jami nechta bemor qabul qilindi?',
        correctAnswer: '29 nafar (14 + 15 = 29)',
        distractors: ['28 nafar', '30 nafar', '1 nafar'],
        explanation: '14 + 15 = 29 nafar bemor.',
      },
      {
        text: 'Robot birinchi xonada 10 daqiqa, ikkinchi xonada 20 daqiqa ishladi. Robot jami necha daqiqa ishlagan?',
        correctAnswer: '30 daqiqa (10 + 20 = 30)',
        distractors: ['25 daqiqa', '35 daqiqa', '10 daqiqa'],
        explanation: '10 + 20 = 30 daqiqa.',
      },
      {
        text: '25 + 23 yig‘indisini toping:',
        correctAnswer: '48',
        distractors: ['46', '50', '2'],
        explanation: '25 + 23 = 48.',
      },

      // 8 ta o'rtacha
      {
        text: 'Robot-hamshira 1-qavatdagi 31 bemorga, 2-qavatdagi 27 bemorga dori tarqatdi. Jami necha bemorga dori tarqatildi?',
        correctAnswer: '58 nafar (31 + 27 = 58)',
        distractors: ['56 nafar', '60 nafar', '4 nafar'],
        explanation: '31 + 27 = 58 nafar bemor.',
      },
      {
        text: 'Qonuniyatni davom ettiring: 10, 20, 30, □. Bo‘sh o‘rindagi son nechaga teng?',
        correctAnswer: '40',
        distractors: ['35', '50', '45'],
        explanation: 'Sonlar 10 tadan ortib bormoqda, keyingi son 40.',
      },
      {
        text: '15 sonining chap (14) va o‘ng (16) qo‘shnilari yig‘indisi nechaga teng?',
        correctAnswer: '30 (14 + 16 = 30)',
        distractors: ['29', '31', '28'],
        explanation: '14 + 16 = 30.',
      },
      {
        text: 'Kasalxonada 42 ta oq karavot va 35 ta ko‘k karavot bor. Kasalxonada jami nechta karavot bor?',
        correctAnswer: '77 ta (42 + 35 = 77)',
        distractors: ['75 ta', '80 ta', '7 ta'],
        explanation: '42 + 35 = 77 ta karavot.',
      },
      {
        text: 'Qonuniyatni toping: 2, 5, 8, 11, □. Keyingi son qaysi?',
        correctAnswer: '14 (chunki 3 tadan ortmoqda)',
        distractors: ['13', '15', '12'],
        explanation: 'Har bir son 3 taga ortmoqda: 11 + 3 = 14.',
      },
      {
        text: 'Dorixonada 36 quti vitamin va 23 quti malham bor. Dorixonada jami nechta quti dori bor?',
        correctAnswer: '59 quti (36 + 23 = 59)',
        distractors: ['57 quti', '60 quti', '13 quti'],
        explanation: '36 + 23 = 59 quti.',
      },
      {
        text: 'Tenglikni to‘g‘rilang: 54 + 25 = □',
        correctAnswer: '79',
        distractors: ['77', '80', '29'],
        explanation: '50 + 20 = 70, 4 + 5 = 9. Yig‘indi 79.',
      },
      {
        text: 'Shifokor birinchi kuni 16 ta, ikkinchi kuni 13 ta operatsiya o‘tkazdi. Shifokor jami nechta operatsiya o‘tkazgan?',
        correctAnswer: '29 ta (16 + 13 = 29)',
        distractors: ['28 ta', '30 ta', '3 ta'],
        explanation: '16 + 13 = 29 ta.',
      },

      // 4 ta qiyinroq
      {
        text: 'Robot-tozalagich ertalab 33 ta xona, tushda 24 ta xona, kechqurun 12 ta xona tozaladi. Kun davomida jami nechta xona tozalangan?',
        correctAnswer: '69 ta (33 + 24 + 12 = 69)',
        distractors: ['67 ta', '70 ta', '57 ta'],
        explanation: '33 + 24 = 57, 57 + 12 = 69 ta xona.',
      },
      {
        text: 'Uchta ketma-ket son berilgan: 19, 20, 21. Ularning eng kichigi va eng kattasining yig‘indisi nechaga teng?',
        correctAnswer: '40 (19 + 21 = 40)',
        distractors: ['39', '41', '42'],
        explanation: 'Eng kichigi 19, eng kattasi 21. 19 + 21 = 40.',
      },
      {
        text: 'Qonuniyat bo‘yicha keyingi ikkita sonni toping: 4, 8, 12, 16, □, □',
        correctAnswer: '20 va 24 (4 tadan ortmoqda)',
        distractors: ['18 va 22', '20 va 22', '19 va 23'],
        explanation: 'Har bir qadam 4 taga ortadi: 16 + 4 = 20, 20 + 4 = 24.',
      },
      {
        text: 'Tibbiyot markazida 45 ta katta va 34 ta kichik tibbiy apparat bor. Markazda jami nechta apparat bor?',
        correctAnswer: '79 ta (45 + 34 = 79)',
        distractors: ['77 ta', '80 ta', '11 ta'],
        explanation: '45 + 34 = 79 ta apparat.',
      },

      // 2 ta murakkab masala
      {
        text: 'Tez yordam mashinasi 1-chaqiruvga 15 km, 2-chaqiruvga 14 km, 3-chaqiruvga 20 km yo‘l bosdi. Jami necha km yo‘l bosilgan?',
        correctAnswer: '49 km (15 + 14 + 20 = 49)',
        distractors: ['48 km', '50 km', '39 km'],
        explanation: '15 + 14 = 29, 29 + 20 = 49 km.',
      },
      {
        text: 'Shifoxona oshxonasiga 30 kg olma, 25 kg nok va 14 kg uzum keltirildi. Oshxonaga jami necha kg meva keltirilgan?',
        correctAnswer: '69 kg (30 + 25 + 14 = 69)',
        distractors: ['65 kg', '70 kg', '59 kg'],
        explanation: '30 + 25 = 55, 55 + 14 = 69 kg.',
      },
    ],
  },

  // 9-dars. Qismlarni topishga doir masalalar
  {
    bookNumber: 9,
    title: 'Qismlarni topishga doir masalalar',
    emoji: '🔧',
    shortDesc: 'Butun va ma’lum qism orqali noma’lum qismni topish (Butun - Qism = Qism).',
    intro: 'Noma’lum qismni topish uchun butun miqdordan ma’lum qism ayiriladi: Butun − Qism = Qism.',
    keyPoints: [
      'Sxema: Noma’lum qism = Butun − Ma’lum qism.',
      'Misol: 46 − 36 = 10, 49 − 15 = 34.',
      'Masalada «ortib qoldi», «qoldi», «ikkinchi qism» so‘zlariga e’tibor beriladi.',
    ],
    miniExample: {
      emojis: '🔧 46 ta detal bor edi ➔ 36 tasi ishlatildi, 10 tasi qoldi',
      text: 'Ustaxonada 46 ta detal bor edi, 36 tasi ishlatildi. Qolgan qism: 46 - 36 = 10 ta detal.',
    },
    xpReward: 95,
    coinReward: 10,
    estMinutes: 8,
    practice: [
      {
        text: 'Noma’lum qismni topish uchun qaysi formuladan foydalaniladi?',
        correctAnswer: 'Qism = Butun - Ma’lum qism',
        distractors: ['Qism = Butun + Ma’lum qism', 'Qism = Butun - Butun', 'Qism = 0'],
        explanation: 'Noma’lum qism butun miqdordan ma’lum qismni ayirish orqali topiladi.',
      },
      {
        text: '46 - 36 ifodaning qiymatini hisoblang:',
        correctAnswer: '10',
        distractors: ['82', '12', '6'],
        explanation: '46 - 36 = 10.',
      },
      {
        text: '49 ta kitobdan 15 tasi javonga taxlandi. Nechtasi qoldi?',
        correctAnswer: '34 ta (49 - 15 = 34)',
        distractors: ['30 ta', '35 ta', '64 ta'],
        explanation: '49 - 15 = 34 ta kitob qoldi.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: '46 - 36 ifodaning qiymati nechaga teng?',
        correctAnswer: '10',
        distractors: ['12', '8', '82'],
        explanation: '46 - 36 = 10.',
      },
      {
        text: '49 - 15 ayirmani hisoblang:',
        correctAnswer: '34',
        distractors: ['30', '35', '64'],
        explanation: '49 - 15 = 34.',
      },
      {
        text: 'Sxema: Butun = 50, I qism = 30. II noma’lum qismni toping:',
        correctAnswer: '20 (50 - 30 = 20)',
        distractors: ['80 (50 + 30 = 80)', '15', '25'],
        explanation: '50 - 30 = 20.',
      },
      {
        text: 'Ustaxonada 38 ta mashina bor edi. Ta’mirlashdan so‘ng 18 tasi topshirildi. Nechta mashina qoldi?',
        correctAnswer: '20 ta (38 - 18 = 20)',
        distractors: ['22 ta', '18 ta', '56 ta'],
        explanation: '38 - 18 = 20 ta mashina.',
      },
      {
        text: 'Noma’lum qo‘shiluvchini toping: □ + 20 = 60',
        correctAnswer: '40 (60 - 20 = 40)',
        distractors: ['30', '50', '80'],
        explanation: '60 - 20 = 40.',
      },
      {
        text: '75 - 25 ayirmaning qiymati nechaga teng?',
        correctAnswer: '50',
        distractors: ['45', '55', '100'],
        explanation: '75 - 25 = 50.',
      },

      // 8 ta o'rtacha
      {
        text: 'Avtobusda 36 nafar yo‘lovchi bor edi. Bekatda bir necha kishi tushgach, 16 kishi qoldi. Necha kishi tushgan?',
        correctAnswer: '20 nafar (36 - 16 = 20)',
        distractors: ['22 nafar', '18 nafar', '52 nafar'],
        explanation: '36 - 16 = 20 nafar tushgan.',
      },
      {
        text: 'Sxema: Butun = 68, II qism = 45. I qism nechaga teng?',
        correctAnswer: '23 (68 - 45 = 23)',
        distractors: ['20', '25', '113'],
        explanation: '68 - 45 = 23.',
      },
      {
        text: 'Tenglikdagi so‘roq belgisi o‘rnidagi sonni toping: 58 - ? = 24',
        correctAnswer: '34 (chunki 58 - 34 = 24)',
        distractors: ['30', '35', '82'],
        explanation: 'Ayriluvchini topish: 58 - 24 = 34.',
      },
      {
        text: 'Omborda 87 qop bug‘doy bor edi. Tegirmonga 52 qop jo‘natildi. Omborda necha qop bug‘doy qoldi?',
        correctAnswer: '35 qop (87 - 52 = 35)',
        distractors: ['30 qop', '40 qop', '139 qop'],
        explanation: '87 - 52 = 35 qop.',
      },
      {
        text: 'Gulshanda 64 ta atirgul bor edi. Gullardan 31 tasi guldastaga uzildi. Gulshanda nechta atirgul qoldi?',
        correctAnswer: '33 ta (64 - 31 = 33)',
        distractors: ['30 ta', '35 ta', '95 ta'],
        explanation: '64 - 31 = 33 ta atirgul.',
      },
      {
        text: 'Noma’lum qo‘shiluvchini toping: 32 + □ = 76',
        correctAnswer: '44 (76 - 32 = 44)',
        distractors: ['40', '46', '108'],
        explanation: '76 - 32 = 44.',
      },
      {
        text: 'Kutubxonadagi 98 ta kitobdan 46 tasi bolalar kitobi, qolgani darsliklar. Darsliklar soni nechta?',
        correctAnswer: '52 ta (98 - 46 = 52)',
        distractors: ['50 ta', '54 ta', '42 ta'],
        explanation: '98 - 46 = 52 ta darslik.',
      },
      {
        text: 'Idishda 48 litr sut bor edi. Bir qismi sotilgach, 14 litr sut qoldi. Necha litr sut sotilgan?',
        correctAnswer: '34 l (48 - 14 = 34)',
        distractors: ['30 l', '36 l', '62 l'],
        explanation: '48 - 14 = 34 litr sotilgan.',
      },

      // 4 ta qiyinroq
      {
        text: 'Sxema bo‘yicha: Butun = 89, I qism = 35, II qism = 21, III qism = ? Uchinchi qismni toping:',
        correctAnswer: '33 (89 - 35 - 21 = 33)',
        distractors: ['30', '35', '43'],
        explanation: '89 - 35 = 54, 54 - 21 = 33.',
      },
      {
        text: 'Do‘konda 75 ta televizor bor edi. 1-haftada 22 ta, 2-haftada 31 ta sotildi. Do‘konda nechta televizor qoldi?',
        correctAnswer: '22 ta (75 - 22 - 31 = 22)',
        distractors: ['20 ta', '24 ta', '32 ta'],
        explanation: 'Jami sotilgani: 22 + 31 = 53 ta. Qolgani: 75 - 53 = 22 ta.',
      },
      {
        text: 'Balandligi 96 sm bo‘lgan ko‘chatdan 32 sm kesib olindi. Ko‘chatning qolgan bo‘yi necha sm?',
        correctAnswer: '64 sm (96 - 32 = 64)',
        distractors: ['60 sm', '65 sm', '54 sm'],
        explanation: '96 - 32 = 64 sm.',
      },
      {
        text: 'Toshkentdan Buxoroga 88 km yo‘l bosishi kerak bo‘lgan yuk mashinasi 55 km yurdi. Yana necha km yo‘l qoldi?',
        correctAnswer: '33 km (88 - 55 = 33)',
        distractors: ['30 km', '35 km', '143 km'],
        explanation: '88 - 55 = 33 km.',
      },

      // 2 ta murakkab masala
      {
        text: 'Tikuvchida 90 metr gazlama bor edi. U ko‘ylaklarga 40 metr, kostyumlarga 30 metr ishlatdi. Necha metr gazlama ortib qoldi?',
        correctAnswer: '20 metr (90 - 40 - 30 = 20)',
        distractors: ['25 metr', '15 metr', '30 metr'],
        explanation: '90 - 70 = 20 metr gazlama qoldi.',
      },
      {
        text: 'Fermer xo‘jaligida 85 quti olma bor edi. 1-kuni 30 quti, 2-kuni 25 quti jo‘natildi. Xo‘jalikda necha quti olma qoldi?',
        correctAnswer: '30 quti (85 - 30 - 25 = 30)',
        distractors: ['35 quti', '25 quti', '20 quti'],
        explanation: '85 - 55 = 30 quti olma qoldi.',
      },
    ],
  },

  // 10-dars. Qismlarni topishga doir masalalar (2)
  {
    bookNumber: 10,
    title: 'Qismlarni topishga doir masalalar (2)',
    emoji: '📅',
    shortDesc: 'Taqvim, jadvallar va necha birlik orttirish kerakligi masalalari.',
    intro: 'Sonni kerakli miqdorgacha yetkazish uchun necha birlik orttirish kerakligini ayirish orqali aniqlaymiz: 17 − 13 = 4.',
    keyPoints: [
      '13 dan 17 hosil bo‘lishi uchun 4 birlik orttirish kerak (17 − 13 = 4).',
      'Taqvimdagi sanalar va kunlar farqini topishda ayirish ishlatiladi.',
      'Jadvaldagi bo‘sh qator va ustunlar noma’lum qism formulasi bilan to‘ldiriladi.',
    ],
    miniExample: {
      emojis: '📅 13-kun ➔ 17-kunga yetish uchun: 17 - 13 = 4 kun kerak',
      text: 'Bugun 13-sana bo‘lsa, 17-sanagacha yana necha kun bor? 17 - 13 = 4 kun.',
    },
    xpReward: 95,
    coinReward: 10,
    estMinutes: 8,
    practice: [
      {
        text: '13 dan 17 hosil bo‘lishi uchun uni necha birlik orttirish kerak?',
        correctAnswer: '4 birlik (17 - 13 = 4)',
        distractors: ['3 birlik', '5 birlik', '30 birlik'],
        explanation: '17 - 13 = 4 birlik orttirish kerak.',
      },
      {
        text: '48 - 18 ayirmani hisoblang:',
        correctAnswer: '30',
        distractors: ['28', '38', '66'],
        explanation: '48 - 18 = 30.',
      },
      {
        text: 'Taqvimda bugun 12-may, bayram esa 19-mayda. Bayramga necha kun qoldi?',
        correctAnswer: '7 kun (19 - 12 = 7)',
        distractors: ['6 kun', '8 kun', '31 kun'],
        explanation: '19 - 12 = 7 kun qoldi.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: '48 - 18 ifodaning qiymati nechaga teng?',
        correctAnswer: '30',
        distractors: ['28', '32', '66'],
        explanation: '48 - 18 = 30.',
      },
      {
        text: '20 dan 28 hosil qilish uchun 20 ni necha birlik orttirish kerak?',
        correctAnswer: '8 birlik (28 - 20 = 8)',
        distractors: ['6 birlik', '10 birlik', '48 birlik'],
        explanation: '28 - 20 = 8 birlik.',
      },
      {
        text: 'Bugun oyning 5-kuni. Oyning 15-kunigacha necha kun bor?',
        correctAnswer: '10 kun (15 - 5 = 10)',
        distractors: ['9 kun', '11 kun', '20 kun'],
        explanation: '15 - 5 = 10 kun.',
      },
      {
        text: 'Jadvalda: Bor edi — 40 ta, Qoldi — 25 ta. Sarflandi — ?',
        correctAnswer: '15 ta (40 - 25 = 15)',
        distractors: ['65 ta', '10 ta', '20 ta'],
        explanation: '40 - 25 = 15 ta sarflangan.',
      },
      {
        text: '35 dan 40 hosil qilish uchun necha birlik qo‘shish lozim?',
        correctAnswer: '5 birlik (40 - 35 = 5)',
        distractors: ['4 birlik', '6 birlik', '75 birlik'],
        explanation: '40 - 35 = 5 birlik.',
      },
      {
        text: '59 - 29 ayirmaning qiymati necha bo‘ladi?',
        correctAnswer: '30',
        distractors: ['20', '40', '88'],
        explanation: '59 - 29 = 30.',
      },

      // 8 ta o'rtacha
      {
        text: '34 sonini 56 gacha yetkazish uchun unga necha birlik qo‘shish lozim?',
        correctAnswer: '22 (56 - 34 = 22)',
        distractors: ['20', '24', '90'],
        explanation: '56 - 34 = 22 birlik.',
      },
      {
        text: 'Taqvimda haftaning dushanba kuni 7-sana bo‘lsa, yakshanba kuni (7 kundan keyin) nechanchi sana bo‘ladi?',
        correctAnswer: '13-sana (7 + 6 = 13)',
        distractors: ['14-sana', '12-sana', '15-sana'],
        explanation: 'Dushanbadan yakshanbagacha 6 kun o‘tadi: 7 + 6 = 13-sana.',
      },
      {
        text: 'Jadval: Reja — 68 ta detal, Tayyorlandi — 45 ta detal. Yana nechta detal tayyorlanishi kerak?',
        correctAnswer: '23 ta (68 - 45 = 23)',
        distractors: ['20 ta', '25 ta', '113 ta'],
        explanation: '68 - 45 = 23 ta detal.',
      },
      {
        text: 'Samiraning 14 ta stikeri bor. Unga 25 ta stiker to‘plami bo‘lishi uchun yana nechta kerak?',
        correctAnswer: '11 ta (25 - 14 = 11)',
        distractors: ['10 ta', '12 ta', '39 ta'],
        explanation: '25 - 14 = 11 ta stiker.',
      },
      {
        text: '78 - 38 ayirmaning qiymatini hisoblang:',
        correctAnswer: '40',
        distractors: ['30', '50', '116'],
        explanation: '78 - 38 = 40.',
      },
      {
        text: 'Shahzod 42 bet kitob o‘qidi. Kitob 75 betli bo‘lsa, u yana necha bet o‘qishi kerak?',
        correctAnswer: '33 bet (75 - 42 = 33)',
        distractors: ['30 bet', '35 bet', '117 bet'],
        explanation: '75 - 42 = 33 bet.',
      },
      {
        text: 'Taqvim bo‘yicha ta’til 20-iyunda boshlanadi. Bugun 8-iyun bo‘lsa, ta’tilgacha necha kun qoldi?',
        correctAnswer: '12 kun (20 - 8 = 12)',
        distractors: ['10 kun', '14 kun', '28 kun'],
        explanation: '20 - 8 = 12 kun.',
      },
      {
        text: 'Jadval: Hammasi — 54 dona, 1-qutida — 31 dona. 2-qutida nechta?',
        correctAnswer: '23 dona (54 - 31 = 23)',
        distractors: ['20 dona', '25 dona', '85 dona'],
        explanation: '54 - 31 = 23 dona.',
      },

      // 4 ta qiyinroq
      {
        text: 'Kamron 45 sonini o‘yladi. Unga necha qo‘shilsa, 89 hosil bo‘ladi?',
        correctAnswer: '44 (89 - 45 = 44)',
        distractors: ['40', '46', '134'],
        explanation: '89 - 45 = 44.',
      },
      {
        text: 'Avtobus jadvaliga ko‘ra, poyezd yetib kelishiga 48 daqiqa qoldi. 18 daqiqa o‘tgach, poyezdgacha necha daqiqa qoladi?',
        correctAnswer: '30 daqiqa (48 - 18 = 30)',
        distractors: ['25 daqiqa', '35 daqiqa', '66 daqiqa'],
        explanation: '48 - 18 = 30 daqiqa.',
      },
      {
        text: 'Taqvimda 1-iyul chorshanba bo‘lsa, 8-iyul haftaning qaysi kuniga to‘g‘ri keladi?',
        correctAnswer: 'Chorshanba (chunki 7 kundan so‘ng yana shu kun keladi)',
        distractors: ['Payshanba', 'Seshanba', 'Juma'],
        explanation: 'Haftada 7 kun bor, shuning uchun 1 + 7 = 8-sana yana chorshanbaga to‘g‘ri keladi.',
      },
      {
        text: 'Jadval bo‘yicha: Uchala ustaxona jami 95 ta buyum yasashi kerak. 1-ustaxona 30 ta, 2-ustaxona 40 ta yasadi. 3-ustaxona nechta yasashi kerak?',
        correctAnswer: '25 ta (95 - 30 - 40 = 25)',
        distractors: ['20 ta', '30 ta', '35 ta'],
        explanation: '95 - 70 = 25 ta buyum.',
      },

      // 2 ta murakkab masala
      {
        text: 'Botir har kuni 10 betdan kitob o‘qiydi. Kitob 50 bet bo‘lsa, Botir 2 kundan keyin yana necha bet o‘qishi kerak?',
        correctAnswer: '30 bet (50 - 20 = 30)',
        distractors: ['40 bet', '20 bet', '35 bet'],
        explanation: '2 kunda 20 bet o‘qiydi: 50 - 20 = 30 bet qoladi.',
      },
      {
        text: 'Taqvimda ta’til 1-iyuldan 25-iyulgacha davom etadi. Alisher ta’tilning dastlabki 12 kunini qishloqda o‘tkazdi. Ta’tilning necha kuni qoldi?',
        correctAnswer: '13 kun (25 - 12 = 13)',
        distractors: ['12 kun', '14 kun', '15 kun'],
        explanation: '25 - 12 = 13 kun qoldi.',
      },
    ],
  },

  // 11-dars. Masalalar yechish (butun va qismlar)
  {
    bookNumber: 11,
    title: 'Masalalar yechish (butun va qismlar)',
    emoji: '📮',
    shortDesc: 'Butun va qismlarni topishga doir aralash amaliy masalalar.',
    intro: 'Pochta jo‘natmalari va xonadonlar misolida butun yoki qismni aniqlash amallarini mustahkamlaymiz.',
    keyPoints: [
      'Agar jami miqdor so‘ralsa: Qism + Qism = Butun.',
      'Agar bir qism so‘ralsa: Butun − Ma’lum qism = Noma’lum qism.',
      'Shartni to‘g‘ri tahlil qilish to‘g‘ri amalni tanlash kafolatidir.',
    ],
    miniExample: {
      emojis: '📮 37 ta jo‘natmadan 23 tasi Toshkentga, 14 tasi Samarqandga',
      text: '37 ta jo‘natmadan 23 tasi Toshkentga, qolgani Samarqandga. Qolgan jo‘natmalar: 37 - 23 = 14 ta.',
    },
    xpReward: 95,
    coinReward: 10,
    estMinutes: 8,
    practice: [
      {
        text: '37 ta jo‘natmadan 23 tasi Toshkentga jo‘natildi. Samarqandga nechta jo‘natma qoldi?',
        correctAnswer: '14 ta (37 - 23 = 14)',
        distractors: ['12 ta', '15 ta', '60 ta'],
        explanation: '37 - 23 = 14 ta jo‘natma.',
      },
      {
        text: 'Uydagi 78 ta xonadondan 32 tasiga gazeta tarqatildi. Nechta xonadon qoldi?',
        correctAnswer: '46 ta (78 - 32 = 46)',
        distractors: ['40 ta', '48 ta', '110 ta'],
        explanation: '78 - 32 = 46 ta xonadon qoldi.',
      },
      {
        text: 'Xat tashuvchi ertalab 25 ta, tushdan keyin 34 ta maktub tarqatdi. Jami nechta maktub tarqatilgan?',
        correctAnswer: '59 ta (25 + 34 = 59)',
        distractors: ['57 ta', '60 ta', '9 ta'],
        explanation: '25 + 34 = 59 ta maktub.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'Pochtachi sumkasida 37 ta xat bor edi, 23 tasini egalariga berdi. Sumkada nechta xat qoldi?',
        correctAnswer: '14 ta (37 - 23 = 14)',
        distractors: ['12 ta', '15 ta', '60 ta'],
        explanation: '37 - 23 = 14 ta xat.',
      },
      {
        text: 'Kop qavatli uydagi 78 xonadondan 32 tasiga gazeta berildi. Yana necha xonadonga berilishi kerak?',
        correctAnswer: '46 ta (78 - 32 = 46)',
        distractors: ['40 ta', '48 ta', '110 ta'],
        explanation: '78 - 32 = 46 ta xonadon.',
      },
      {
        text: '24 ta posilka va 35 ta xat jami nechta jo‘natma bo‘ladi?',
        correctAnswer: '59 ta (24 + 35 = 59)',
        distractors: ['58 ta', '60 ta', '11 ta'],
        explanation: '24 + 35 = 59 ta jo‘natma.',
      },
      {
        text: 'Pochta bo‘limiga 50 ta gazeta keltirildi. 30 tasi tarqatilgach, nechta gazeta qoldi?',
        correctAnswer: '20 ta (50 - 30 = 20)',
        distractors: ['15 ta', '25 ta', '80 ta'],
        explanation: '50 - 30 = 20 ta gazeta.',
      },
      {
        text: 'Noma’lum qismni toping: □ + 21 = 55',
        correctAnswer: '34 (55 - 21 = 34)',
        distractors: ['30', '36', '76'],
        explanation: '55 - 21 = 34.',
      },
      {
        text: 'Xat tashuvchi velosipedda 1-kuni 12 km, 2-kuni 14 km yo‘l yurdi. U jami necha km yo‘l yurgan?',
        correctAnswer: '26 km (12 + 14 = 26)',
        distractors: ['24 km', '28 km', '2 km'],
        explanation: '12 + 14 = 26 km.',
      },

      // 8 ta o'rtacha
      {
        text: 'Pochtada 65 ta posilka bor edi. Ertalab 21 ta, tushdan keyin 24 ta posilka berildi. Nechta posilka qoldi?',
        correctAnswer: '20 ta (65 - 21 - 24 = 20)',
        distractors: ['25 ta', '15 ta', '30 ta'],
        explanation: 'Jami berilgan posilkalar: 21 + 24 = 45 ta. Qolgani: 65 - 45 = 20 ta.',
      },
      {
        text: 'Jadval: Toshkentga — 42 ta jo‘natma, Buxoroga — 33 ta jo‘natma. Jami jo‘natmalar soni nechta?',
        correctAnswer: '75 ta (42 + 33 = 75)',
        distractors: ['70 ta', '80 ta', '9 ta'],
        explanation: '42 + 33 = 75 ta jo‘natma.',
      },
      {
        text: 'Xat qutisida 48 ta maktub bor edi. Pochtachi undan bir nechtasini olgach, 15 ta maktub qoldi. Pochtachi nechta maktub olgan?',
        correctAnswer: '33 ta (48 - 15 = 33)',
        distractors: ['30 ta', '35 ta', '63 ta'],
        explanation: '48 - 15 = 33 ta maktub.',
      },
      {
        text: 'Sxema bo‘yicha ifoda tuzing: Butun = 86, I qism = 54, II qism = ?',
        correctAnswer: '86 - 54 = 32',
        distractors: ['86 + 54 = 140', '54 - 32 = 22', '86 - 32 = 54'],
        explanation: 'Ikkinchi qism: 86 - 54 = 32.',
      },
      {
        text: 'Yangi mahallada 94 ta uy bor. Shulardan 61 tasiga pochta qutisi o‘rnatildi. Yana nechta uyga o‘rnatish kerak?',
        correctAnswer: '33 ta (94 - 61 = 33)',
        distractors: ['30 ta', '35 ta', '155 ta'],
        explanation: '94 - 61 = 33 ta uy.',
      },
      {
        text: 'Pochta droni 26 ta xat va 23 ta dori qutisini manzilga yetkazdi. Dron jami nechta yuk yetkazgan?',
        correctAnswer: '49 ta (26 + 23 = 49)',
        distractors: ['47 ta', '50 ta', '3 ta'],
        explanation: '26 + 23 = 49 ta yuk.',
      },
      {
        text: 'Tenglikni to‘ldiring: 87 - □ = 44',
        correctAnswer: '43 (87 - 44 = 43)',
        distractors: ['40', '45', '131'],
        explanation: '87 - 44 = 43.',
      },
      {
        text: 'Jadval: Omborda bor — 76 ta xat, Tarqatildi — 42 ta xat. Omborda qolgan xatlar soni nechta?',
        correctAnswer: '34 ta (76 - 42 = 34)',
        distractors: ['30 ta', '36 ta', '118 ta'],
        explanation: '76 - 42 = 34 ta xat.',
      },

      // 4 ta qiyinroq
      {
        text: 'Pochta xodimi 80 ta bildirishnoma tarqatishi kerak edi. U 1-soatda 25 ta, 2-soatda 30 ta tarqatdi. Yana nechta bildirishnoma qoldi?',
        correctAnswer: '25 ta (80 - 25 - 30 = 25)',
        distractors: ['20 ta', '30 ta', '35 ta'],
        explanation: '80 - 55 = 25 ta bildirishnoma qoldi.',
      },
      {
        text: 'Sxema bo‘yicha: Butun = 98 jo‘natma. Toshkentga 40 ta, Samarqandga 30 ta, qolgani Buxoroga. Buxoroga nechta jo‘natma ketadi?',
        correctAnswer: '28 ta (98 - 40 - 30 = 28)',
        distractors: ['25 ta', '30 ta', '38 ta'],
        explanation: '98 - 70 = 28 ta jo‘natma.',
      },
      {
        text: 'Kuryer 56 ta manzilga buyurtma yetkazishi kerak. Ertalab 24 ta, tushda 20 ta buyurtma yetkazildi. Nechta buyurtma qoldi?',
        correctAnswer: '12 ta (56 - 24 - 20 = 12)',
        distractors: ['10 ta', '14 ta', '16 ta'],
        explanation: '56 - 44 = 12 ta buyurtma.',
      },
      {
        text: 'Xat qutisida 68 ta maktub bor edi. 1-pochta mashinasi 25 ta, 2-mashina 22 ta oldi. Qutida nechta maktub qoldi?',
        correctAnswer: '21 ta (68 - 25 - 22 = 21)',
        distractors: ['20 ta', '23 ta', '25 ta'],
        explanation: '68 - 47 = 21 ta maktub.',
      },

      // 2 ta murakkab masala
      {
        text: 'Pochtaga 1-kuni 35 ta, 2-kuni 24 ta posilka keldi. Xodimlar 40 ta posilkani egalariga berishdi. Nechta posilka qoldi?',
        correctAnswer: '19 ta (35 + 24 - 40 = 19)',
        distractors: ['18 ta', '20 ta', '29 ta'],
        explanation: 'Jami kelgan: 35 + 24 = 59 ta. Berilgach: 59 - 40 = 19 ta posilka.',
      },
      {
        text: 'Markaziy pochtada 90 ta gazeta bor edi. Ertalab 30 tasi, tushdan keyin 35 tasi tarqatildi. Nechta gazeta qoldi?',
        correctAnswer: '25 ta (90 - 30 - 35 = 25)',
        distractors: ['20 ta', '30 ta', '35 ta'],
        explanation: '90 - 65 = 25 ta gazeta qoldi.',
      },
    ],
  },

  // 12-dars. 1-nazorat ishi (isReview: true)
  {
    bookNumber: 12,
    isReview: true,
    title: '1-nazorat ishi',
    emoji: '📝',
    shortDesc: 'I bob bo‘yicha nazorat mini-testi (masala tarkibi, reja, butun va qismlar).',
    intro: 'I bobda o‘rganilgan barcha mavzular (masala sharti, savol, reja, butun va qismlarni topish) bo‘yicha 20 savolli nazorat testi.',
    keyPoints: [
      'Masalaning 4 ta asosiy qismi: shart, savol, yechim va javob.',
      'Butunni topish: Qism + Qism = Butun.',
      'Qismni topish: Butun − Qism = Qism.',
    ],
    miniExample: {
      emojis: '📝 20 ta nazorat savoli ➔ 60% dan yuqori natija keyingi bobni ochadi!',
      text: 'Barcha mavzulardan saralangan 20 ta savolga diqqat bilan javob bering.',
    },
    xpReward: 120,
    coinReward: 12,
    estMinutes: 10,
    practice: [],
    test: [
      // 1-11 darslardan teng ulushda olingan 20 ta maxsus nazorat savoli
      // 6 ta oson
      {
        text: 'Masalaning ma’lumotlar berilgan qismi nima deb ataladi?',
        correctAnswer: 'Shart',
        distractors: ['Savol', 'Yechim', 'Javob'],
        explanation: 'Masala shartida ma’lumotlar va sonlar bayon qilinadi.',
      },
      {
        text: 'Qism + Qism ifodasi orqali nima topiladi?',
        correctAnswer: 'Butun',
        distractors: ['Noma’lum qism', 'Ayirma', 'Nol'],
        explanation: 'Qismlar yig‘indisi butunni tashkil qiladi.',
      },
      {
        text: 'Butun − Qism ifodasi orqali nima topiladi?',
        correctAnswer: 'Ikkinchi qism',
        distractors: ['Butun miqdor', 'Yig‘indi', 'Nol'],
        explanation: 'Butundan ma’lum qism ayirilsa, ikkinchi noma’lum qism topiladi.',
      },
      {
        text: 'Masala yechish algoritmining oxirgi qadami nima?',
        correctAnswer: 'Javobni yozish va tekshirish',
        distractors: ['Shartni o‘qish', 'Savol tanlash', 'Daftarni yopish'],
        explanation: 'Yakuniy to‘rtinchi qadam natijani tekshirish va javobni yozishdir.',
      },
      {
        text: '46 - 36 ayirmaning qiymati necha bo‘ladi?',
        correctAnswer: '10',
        distractors: ['12', '8', '82'],
        explanation: '46 - 36 = 10.',
      },
      {
        text: '22 + 24 yig‘indisini hisoblang:',
        correctAnswer: '46',
        distractors: ['44', '48', '40'],
        explanation: '22 + 24 = 46.',
      },

      // 8 ta o'rtacha
      {
        text: 'Fotimada 12 ta rangli va 7 ta oq-qora rasm bor. Jami rasmlar soni nechta?',
        correctAnswer: '19 ta (12 + 7 = 19)',
        distractors: ['5 ta', '18 ta', '20 ta'],
        explanation: '12 + 7 = 19 ta rasm.',
      },
      {
        text: 'Kutubxonadagi 88 ta darslikdan 30 tasi berildi. Nechta darslik qoldi?',
        correctAnswer: '58 ta (88 - 30 = 58)',
        distractors: ['50 ta', '60 ta', '48 ta'],
        explanation: '88 - 30 = 58 ta darslik.',
      },
      {
        text: 'Samolyotdagi 64 ta o‘rindiqdan 42 tasi band bo‘lsa, nechta bo‘sh o‘rindiq bor?',
        correctAnswer: '22 ta (64 - 42 = 22)',
        distractors: ['20 ta', '24 ta', '12 ta'],
        explanation: '64 - 42 = 22 ta bo‘sh joy.',
      },
      {
        text: 'Sehrli kvadratning har bir yo‘nalishidagi sonlar yig‘indisi necha bo‘ladi?',
        correctAnswer: '15',
        distractors: ['10', '20', '30'],
        explanation: '1 dan 9 gacha sonlardan tuzilgan 3x3 sehrli kvadratda yig‘indi 15 bo‘ladi.',
      },
      {
        text: 'Omborda 46 qop bug‘doy va 42 qop arpa bor. Omborda jami necha qop don bor?',
        correctAnswer: '88 qop (46 + 42 = 88)',
        distractors: ['84 qop', '90 qop', '78 qop'],
        explanation: '46 + 42 = 88 qop.',
      },
      {
        text: 'Pochta droni 14 ta katta va 32 ta kichik jo‘natma yetkazdi. Jami jo‘natmalar nechta?',
        correctAnswer: '46 ta (14 + 32 = 46)',
        distractors: ['44 ta', '48 ta', '18 ta'],
        explanation: '14 + 32 = 46 ta jo‘natma.',
      },
      {
        text: '3 o‘nlik 4 birlik + 2 o‘nlik 1 birlik yig‘indisi nechaga teng?',
        correctAnswer: '55 (5 o‘nlik 5 birlik)',
        distractors: ['54', '45', '65'],
        explanation: '34 + 21 = 55.',
      },
      {
        text: '13 dan 17 hosil qilish uchun 13 ni necha birlik orttirish kerak?',
        correctAnswer: '4 birlik (17 - 13 = 4)',
        distractors: ['3 birlik', '5 birlik', '30 birlik'],
        explanation: '17 - 13 = 4 birlik.',
      },

      // 4 ta qiyinroq
      {
        text: '37 ta jo‘natmadan 23 tasi Toshkentga jo‘natildi. Qolgan jo‘natmalar soni nechta?',
        correctAnswer: '14 ta (37 - 23 = 14)',
        distractors: ['12 ta', '15 ta', '60 ta'],
        explanation: '37 - 23 = 14 ta jo‘natma.',
      },
      {
        text: 'Uydagi 78 xonadondan 32 tasiga gazeta tarqatildi. Yana necha xonadon qoldi?',
        correctAnswer: '46 ta (78 - 32 = 46)',
        distractors: ['40 ta', '48 ta', '110 ta'],
        explanation: '78 - 32 = 46 ta xonadon.',
      },
      {
        text: 'Sxema bo‘yicha: Butun = 76, I qism = 42. II noma’lum qismni toping:',
        correctAnswer: '34 (76 - 42 = 34)',
        distractors: ['30', '36', '118'],
        explanation: '76 - 42 = 34.',
      },
      {
        text: '48 - 18 ifodaning qiymatini hisoblang:',
        correctAnswer: '30',
        distractors: ['28', '38', '66'],
        explanation: '48 - 18 = 30.',
      },

      // 2 ta murakkab masala
      {
        text: 'Pochta bo‘limida 80 ta maktub bor edi. Ertalab 25 ta, tushda 30 ta tarqatildi. Nechta maktub qoldi?',
        correctAnswer: '25 ta (80 - 25 - 30 = 25)',
        distractors: ['20 ta', '30 ta', '35 ta'],
        explanation: '80 - 55 = 25 ta maktub qoldi.',
      },
      {
        text: 'Avtobusda 30 kishi bor edi. 1-bekatda 6 kishi, 2-bekatda 4 kishi tushdi. Avtobusda nechta yo‘lovchi qoldi?',
        correctAnswer: '20 nafar (30 - 6 - 4 = 20)',
        distractors: ['24 nafar', '22 nafar', '18 nafar'],
        explanation: '30 - 10 = 20 nafar yo‘lovchi qoldi.',
      },
    ],
  },
];

console.log('Generating Part 3 Chapter 1B lessons (7-11 and review 12)...');
for (const lessonDef of lessonsPart3Ch1B) {
  const seed = buildLessonSeed(lessonDef);
  saveLessonFile(3, lessonDef.bookNumber, seed, lessonDef.isReview);
  console.log(`✅ Saved ${lessonDef.isReview ? 'review' : 'lesson'}-${lessonDef.bookNumber < 10 ? '0' : ''}${lessonDef.bookNumber}.json`);
}
