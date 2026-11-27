import { LessonDataDef, buildLessonSeed, saveLessonFile } from './generatorTypes.js';

const lessonsPart3Ch2A: LessonDataDef[] = [
  // 14-dars. Sonni orttirish va kamaytirishga doir masalalar
  {
    bookNumber: 14,
    title: 'Sonni orttirish va kamaytirishga doir masalalar',
    emoji: '⬆️',
    shortDesc: '«Necha birlik ko‘p» va «necha birlik kam» munosabatlari.',
    intro: '«Ko‘p» so‘zi sonni orttirishni (qo‘shish), «kam» so‘zi esa sonni kamaytirishni (ayirish) bildiradi.',
    keyPoints: [
      '«Biror sondan n ta ko‘p» — son ustiga n qo‘shiladi (+).',
      '«Biror sondan n ta kam» — sondan n ayiriladi (-).',
      'Sxema yordamida ikkinchi miqdor aniq belgilanadi.',
    ],
    miniExample: {
      emojis: '✏️ 6 ta qalam + 4 ta ko‘p = 10 ta qalam',
      text: 'Jasurda 6 ta qalam bor, Anvarda undan 4 ta ko‘p. Anvarda: 6 + 4 = 10 ta qalam.',
    },
    xpReward: 95,
    coinReward: 10,
    estMinutes: 8,
    practice: [
      {
        text: 'Jasurda 6 ta qalam bor. Anvarda undan 4 ta ko‘p qalam bor. Anvarda nechta qalam bor?',
        correctAnswer: '10 ta (6 + 4 = 10)',
        distractors: ['2 ta (6 - 4 = 2)', '9 ta', '12 ta'],
        explanation: '4 ta ko‘p bo‘lgani uchun qo‘shamiz: 6 + 4 = 10 ta qalam.',
      },
      {
        text: '«Sondir n ta kam» jumlasi qaysi arifmetik amalni bildiradi?',
        correctAnswer: 'Ayirish amali (-)',
        distractors: ['Qo‘shish amali (+)', 'Taqqoslash amali', 'O‘zgarmaslik'],
        explanation: '«Kam» so‘zi miqdorning kamayishini, ya’ni ayirishni bildiradi.',
      },
      {
        text: 'Madinada 15 ta daftar bor, singlisida undan 5 ta kam. Singlisida nechta daftar bor?',
        correctAnswer: '10 ta (15 - 5 = 10)',
        distractors: ['20 ta (15 + 5 = 20)', '12 ta', '8 ta'],
        explanation: '5 ta kam: 15 - 5 = 10 ta daftar.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: '«7 dan 3 ta ko‘p» sonni toping:',
        correctAnswer: '10 (7 + 3 = 10)',
        distractors: ['4 (7 - 3 = 4)', '9', '11'],
        explanation: '7 + 3 = 10.',
      },
      {
        text: '«12 dan 4 ta kam» son nechaga teng?',
        correctAnswer: '8 (12 - 4 = 8)',
        distractors: ['16 (12 + 4 = 16)', '7', '9'],
        explanation: '12 - 4 = 8.',
      },
      {
        text: 'Daftarda 10 ta stiker bor, albomda undan 5 ta ko‘p stiker bor. Albomda nechta stiker bor?',
        correctAnswer: '15 ta (10 + 5 = 15)',
        distractors: ['5 ta (10 - 5 = 5)', '14 ta', '16 ta'],
        explanation: '10 + 5 = 15 ta.',
      },
      {
        text: 'Savatchada 18 ta nok bor, likopchada undan 8 ta kam. Likopchada nechta nok bor?',
        correctAnswer: '10 ta (18 - 8 = 10)',
        distractors: ['26 ta', '8 ta', '12 ta'],
        explanation: '18 - 8 = 10 ta.',
      },
      {
        text: '«20 dan 6 ta ortiq» son qaysi?',
        correctAnswer: '26 (20 + 6 = 26)',
        distractors: ['14 (20 - 6 = 14)', '24', '28'],
        explanation: '20 + 6 = 26.',
      },
      {
        text: '«30 dan 10 ta kam» son nechaga teng?',
        correctAnswer: '20 (30 - 10 = 20)',
        distractors: ['40 (30 + 10 = 40)', '25', '15'],
        explanation: '30 - 10 = 20.',
      },

      // 8 ta o'rtacha
      {
        text: 'Akmal 1-kuni 14 ta misol yechdi, 2-kuni undan 5 ta ko‘p yechdi. Akmal 2-kuni nechta misol yechgan?',
        correctAnswer: '19 ta (14 + 5 = 19)',
        distractors: ['9 ta (14 - 5 = 9)', '18 ta', '20 ta'],
        explanation: '14 + 5 = 19 ta misol.',
      },
      {
        text: 'Bog‘da 35 tup olma daraxti bor, nok daraxti undan 12 tup kam. Bog‘da nechta nok daraxti bor?',
        correctAnswer: '23 tup (35 - 12 = 23)',
        distractors: ['47 tup (35 + 12 = 47)', '20 tup', '25 tup'],
        explanation: '35 - 12 = 23 tup.',
      },
      {
        text: 'Sxema: I son = 40, II son undan 15 ta ortiq. II sonni toping:',
        correctAnswer: '55 (40 + 15 = 55)',
        distractors: ['25 (40 - 15 = 25)', '50', '60'],
        explanation: '40 + 15 = 55.',
      },
      {
        text: 'Poyezdning 1-vagonida 48 yo‘lovchi bor, 2-vagonida undan 16 ta kam yo‘lovchi bor. 2-vagonda necha yo‘lovchi bor?',
        correctAnswer: '32 nafar (48 - 16 = 32)',
        distractors: ['64 nafar', '30 nafar', '34 nafar'],
        explanation: '48 - 16 = 32 nafar.',
      },
      {
        text: 'Maktab kutubxonasiga 54 ta ertak kitobi keltirildi, darsliklar esa undan 20 ta ko‘p. Nechta darslik keltirilgan?',
        correctAnswer: '74 ta (54 + 20 = 74)',
        distractors: ['34 ta (54 - 20 = 34)', '70 ta', '76 ta'],
        explanation: '54 + 20 = 74 ta darslik.',
      },
      {
        text: 'Do‘konda 60 kg kartoshka bor, piyoz undan 25 kg kam. Do‘konda necha kg piyoz bor?',
        correctAnswer: '35 kg (60 - 25 = 35)',
        distractors: ['85 kg (60 + 25 = 85)', '30 kg', '40 kg'],
        explanation: '60 - 25 = 35 kg.',
      },
      {
        text: '«45 sonini 14 taga orttiring». Natija necha bo‘ladi?',
        correctAnswer: '59 (45 + 14 = 59)',
        distractors: ['31 (45 - 14 = 31)', '58', '60'],
        explanation: '45 + 14 = 59.',
      },
      {
        text: '«78 sonini 23 taga kamaytiring». Natija qanday bo‘ladi?',
        correctAnswer: '55 (78 - 23 = 55)',
        distractors: ['101', '50', '56'],
        explanation: '78 - 23 = 55.',
      },

      // 4 ta qiyinroq
      {
        text: 'Zuhra 24 ta she’r yod oldi. Fotima undan 6 ta ko‘p, Salim esa Zuhra yod olgandan 4 ta kam yod oldi. Salim nechta she’r yod olgan?',
        correctAnswer: '20 ta (24 - 4 = 20)',
        distractors: ['30 ta (24 + 6 = 30)', '18 ta', '22 ta'],
        explanation: 'Salim Zuhra yod olgandan 4 ta kam: 24 - 4 = 20 ta she’r.',
      },
      {
        text: 'Avtosaroyda 36 ta yengil mashina bor. Yuk mashinalari undan 14 ta kam, avtobuslar esa yengil mashinadan 10 ta ko‘p. Avtobuslar nechta?',
        correctAnswer: '46 ta (36 + 10 = 46)',
        distractors: ['22 ta (36 - 14 = 22)', '40 ta', '50 ta'],
        explanation: 'Avtobuslar yengil mashinadan 10 ta ko‘p: 36 + 10 = 46 ta.',
      },
      {
        text: '1-qutida 32 ta qalam bor, 2-qutida undan 13 ta ko‘p qalam bor. Ikkala qutida birgalikda nechta qalam bor?',
        correctAnswer: '77 ta (2-quti: 45; 32 + 45 = 77)',
        distractors: ['45 ta', '64 ta', '75 ta'],
        explanation: '2-qutida: 32 + 13 = 45 ta. Ikkala qutida: 32 + 45 = 77 ta.',
      },
      {
        text: 'Maktab bog‘ida 40 tup terak bor. Qayrag‘ochlar undan 15 tup kam. Bog‘dagi jami terak va qayrag‘ochlar soni nechta?',
        correctAnswer: '65 tup (Qayrag‘och: 25; 40 + 25 = 65)',
        distractors: ['25 tup', '55 tup', '70 tup'],
        explanation: 'Qayrag‘och: 40 - 15 = 25 tup. Jami: 40 + 25 = 65 tup.',
      },

      // 2 ta murakkab masala
      {
        text: 'Omborda 50 qop guruch bor edi. Bug‘doy undan 20 qop ko‘p, arpa esa guruchdan 15 qop kam. Omborda jami necha qop don bor?',
        correctAnswer: '155 qop (Bug‘doy: 70, Arpa: 35; 50 + 70 + 35 = 155)',
        distractors: ['140 qop', '150 qop', '160 qop'],
        explanation: 'Guruch: 50. Bug‘doy: 50 + 20 = 70. Arpa: 50 - 15 = 35. Jami: 50 + 70 + 35 = 155 qop.',
      },
      {
        text: 'Dukonga 1-kuni 25 quti shokolad keltirildi. 2-kuni undan 10 quti ko‘p keltirildi. Dukonga ikki kunda jami necha quti shokolad keltirilgan?',
        correctAnswer: '60 quti (2-kun: 35; 25 + 35 = 60)',
        distractors: ['35 quti', '55 quti', '70 quti'],
        explanation: '2-kun: 25 + 10 = 35 quti. Jami: 25 + 35 = 60 quti.',
      },
    ],
  },

  // 15-dars. Sonni orttirish va kamaytirishga doir masalalar (2)
  {
    bookNumber: 15,
    title: 'Sonni orttirish va kamaytirishga doir masalalar (2)',
    emoji: '⬇️',
    shortDesc: 'Katta sonlarni orttirish va kamaytirish, o‘g‘il va qiz bolalar masalalari.',
    intro: '«52 dan 17 ta ortiq» yoki «49 dan 18 ta kam» kabi ikki xonali sonlarni qo‘shish va ayirish orqali hisoblaymiz.',
    keyPoints: [
      '52 dan 17 ta ortiq: 52 + 17 = 69.',
      '49 dan 18 ta kam: 49 − 18 = 31.',
      '70 dan 20 ta ortiq: 70 + 20 = 90.',
    ],
    miniExample: {
      emojis: '👦 52 o‘g‘il bola, qizlar undan 17 ta ortiq 👧',
      text: 'Oromgohda 52 o‘g‘il bola bor, qizlar undan 17 ta ortiq. Qizlar: 52 + 17 = 69 nafar.',
    },
    xpReward: 95,
    coinReward: 10,
    estMinutes: 8,
    practice: [
      {
        text: '«52 dan 17 ta ortiq» sonni toping:',
        correctAnswer: '69 (52 + 17 = 69)',
        distractors: ['35 (52 - 17 = 35)', '68', '70'],
        explanation: '52 + 17 = 69.',
      },
      {
        text: '«49 dan 18 ta kam» son nechaga teng?',
        correctAnswer: '31 (49 - 18 = 31)',
        distractors: ['67 (49 + 18 = 67)', '30', '32'],
        explanation: '49 - 18 = 31.',
      },
      {
        text: '«70 dan 20 ta ortiq» sonni toping:',
        correctAnswer: '90 (70 + 20 = 90)',
        distractors: ['50 (70 - 20 = 50)', '80', '100'],
        explanation: '70 + 20 = 90.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: '52 sonini 17 taga orttirsak, qaysi son hosil bo‘ladi?',
        correctAnswer: '69',
        distractors: ['35', '68', '70'],
        explanation: '52 + 17 = 69.',
      },
      {
        text: '49 sonini 18 taga kamaytirsak, qaysi son hosil bo‘ladi?',
        correctAnswer: '31',
        distractors: ['67', '30', '32'],
        explanation: '49 - 18 = 31.',
      },
      {
        text: '70 sonini 20 taga orttiring:',
        correctAnswer: '90',
        distractors: ['50', '80', '100'],
        explanation: '70 + 20 = 90.',
      },
      {
        text: '80 sonini 30 taga kamaytiring:',
        correctAnswer: '50',
        distractors: ['110', '40', '60'],
        explanation: '80 - 30 = 50.',
      },
      {
        text: 'Sinfda 16 nafar o‘g‘il bola bor, qizlar undan 3 nafar ko‘p. Qizlar nechta?',
        correctAnswer: '19 nafar (16 + 3 = 19)',
        distractors: ['13 nafar', '18 nafar', '20 nafar'],
        explanation: '16 + 3 = 19 nafar qiz.',
      },
      {
        text: 'Maktab hovlisida 28 ta o‘g‘il bola o‘ynayapti, qizlar undan 6 nafar kam. Qizlar nechta?',
        correctAnswer: '22 nafar (28 - 6 = 22)',
        distractors: ['34 nafar', '20 nafar', '24 nafar'],
        explanation: '28 - 6 = 22 nafar qiz.',
      },

      // 8 ta o'rtacha
      {
        text: 'Oromgohda 52 nafar o‘g‘il bola dam olyapti. Qizlar esa o‘g‘il bolalardan 17 nafar ortiq. Qizlar soni qancha?',
        correctAnswer: '69 nafar (52 + 17 = 69)',
        distractors: ['35 nafar', '68 nafar', '70 nafar'],
        explanation: '52 + 17 = 69 nafar qiz.',
      },
      {
        text: 'Kinoteatrda 65 ta o‘rin bor. Tomoshabinlar o‘rindiqlar sonidan 14 ta kam. Tomoshabinlar nechta?',
        correctAnswer: '51 nafar (65 - 14 = 51)',
        distractors: ['79 nafar', '50 nafar', '52 nafar'],
        explanation: '65 - 14 = 51 nafar.',
      },
      {
        text: 'Bog‘bon 43 kg shaftoli uzdi, nok esa undan 24 kg ortiq uzildi. Qancha nok uzilgan?',
        correctAnswer: '67 kg (43 + 24 = 67)',
        distractors: ['19 kg', '65 kg', '70 kg'],
        explanation: '43 + 24 = 67 kg nok.',
      },
      {
        text: 'Kutubxonada 86 ta o‘zbekcha kitob bor, ruscha kitoblar undan 32 ta kam. Ruscha kitoblar nechta?',
        correctAnswer: '54 ta (86 - 32 = 54)',
        distractors: ['118 ta', '50 ta', '55 ta'],
        explanation: '86 - 32 = 54 ta kitob.',
      },
      {
        text: '34 sonidan 25 ta ortiq bo‘lgan sonni toping:',
        correctAnswer: '59 (34 + 25 = 59)',
        distractors: ['9 (34 - 25 = 9)', '58', '60'],
        explanation: '34 + 25 = 59.',
      },
      {
        text: '76 sonidan 42 ta kam bo‘lgan sonni toping:',
        correctAnswer: '34 (76 - 42 = 34)',
        distractors: ['118', '30', '35'],
        explanation: '76 - 42 = 34.',
      },
      {
        text: 'Boks to‘garagiga 38 nafar bola qatnashadi. Dzyudo to‘garagiga esa undan 11 nafar kam bola qatnashadi. Dzyudochilar nechta?',
        correctAnswer: '27 nafar (38 - 11 = 27)',
        distractors: ['49 nafar', '25 nafar', '28 nafar'],
        explanation: '38 - 11 = 27 nafar bola.',
      },
      {
        text: 'Birinchi savatda 26 kg anor bor, ikkinchi savatda undan 13 kg ortiq. Ikkinchi savatda necha kg anor bor?',
        correctAnswer: '39 kg (26 + 13 = 39)',
        distractors: ['13 kg', '38 kg', '40 kg'],
        explanation: '26 + 13 = 39 kg anor.',
      },

      // 4 ta qiyinroq
      {
        text: 'Maktabda 45 nafar o‘g‘il bola va ulardan 12 nafar ortiq qiz bola bor. Maktabda jami necha nafar o‘quvchi bor?',
        correctAnswer: '102 nafar (Qizlar: 57; 45 + 57 = 102)',
        distractors: ['57 nafar', '90 nafar', '100 nafar'],
        explanation: 'Qizlar: 45 + 12 = 57 nafar. Jami: 45 + 57 = 102 nafar.',
      },
      {
        text: 'Tikuvchilik sexida 68 metr oq mato bor. Moviy mato undan 25 metr kam. Sexda jami necha metr mato bor?',
        correctAnswer: '111 metr (Moviy: 43; 68 + 43 = 111)',
        distractors: ['43 metr', '100 metr', '110 metr'],
        explanation: 'Moviy mato: 68 - 25 = 43 metr. Jami: 68 + 43 = 111 metr.',
      },
      {
        text: 'Fermada 54 ta sigir bor. Qo‘ylar sigirlardan 30 ta ortiq, echkilar esa sigirlardan 20 ta kam. Qo‘ylar soni echkilar sonidan qancha ko‘p?',
        correctAnswer: '50 ta (Qo‘y: 84, Echki: 34; 84 - 34 = 50)',
        distractors: ['10 ta', '40 ta', '60 ta'],
        explanation: 'Qo‘ylar: 54 + 30 = 84. Echkilar: 54 - 20 = 34. Farq: 84 - 34 = 50 ta.',
      },
      {
        text: 'Bir qutida 48 dona qalam bor, ikkinchi qutida undan 15 dona kam. Ikkala qutida jami nechta qalam bor?',
        correctAnswer: '81 dona (2-quti: 33; 48 + 33 = 81)',
        distractors: ['33 dona', '70 dona', '85 dona'],
        explanation: '2-quti: 48 - 15 = 33 dona. Jami: 48 + 33 = 81 dona.',
      },

      // 2 ta murakkab masala
      {
        text: 'Avtobusda 35 yo‘lovchi bor edi. Bekatda 15 kishi tushdi va 20 kishi chiqdi. Avtobusda necha yo‘lovchi bo‘ldi?',
        correctAnswer: '40 nafar (35 - 15 + 20 = 40)',
        distractors: ['30 nafar', '45 nafar', '50 nafar'],
        explanation: '35 - 15 = 20, 20 + 20 = 40 nafar yo‘lovchi.',
      },
      {
        text: 'Kutubxonadagi 90 ta kitobdan 1-kuni 25 ta, 2-kuni undan 5 ta kam kitob olindi. Kutubxonada nechta kitob qoldi?',
        correctAnswer: '45 ta (2-kuni: 20 ta; 90 - 25 - 20 = 45)',
        distractors: ['40 ta', '50 ta', '35 ta'],
        explanation: '2-kuni: 25 - 5 = 20 ta kitob. Qolgani: 90 - 25 - 20 = 45 ta.',
      },
    ],
  },

  // 16-dars. Sonni orttirish va kamaytirishga doir masalalar (3)
  {
    bookNumber: 16,
    title: 'Sonni orttirish va kamaytirishga doir masalalar (3)',
    emoji: '🧮',
    shortDesc: 'Sxemalar bo‘yicha ifoda tuzish va hisoblashni mustahkamlash.',
    intro: 'Sxemalarga qarab, sonning orttirilgan yoki kamaytirilgan qismini aniq ifoda orqali ifodalashni o‘rganamiz.',
    keyPoints: [
      'Sxemadagi qo‘shimcha bo‘lak orttirishni bildiradi (+).',
      'Sxemada kesib olingan yoki tushirilgan bo‘lak kamaytirishni bildiradi (-).',
      'Noma’lum ikkinchi son topilgach, shart to‘liq yechiladi.',
    ],
    miniExample: {
      emojis: '🧮 I son: 18, II son: undan 7 ta ortiq = 25',
      text: 'Sxema bo‘yicha: I kesma 18 sm, II kesma 7 sm uzun. II kesma: 18 + 7 = 25 sm.',
    },
    xpReward: 100,
    coinReward: 10,
    estMinutes: 8,
    practice: [
      {
        text: 'Sxema: I kesma = 18 sm, II kesma 7 sm ortiq. II kesma uzunligini toping:',
        correctAnswer: '25 sm (18 + 7 = 25)',
        distractors: ['11 sm (18 - 7 = 11)', '24 sm', '26 sm'],
        explanation: '18 + 7 = 25 sm.',
      },
      {
        text: 'Sxema: I kesma = 30 sm, II kesma 10 sm qisqa. II kesma uzunligi qancha?',
        correctAnswer: '20 sm (30 - 10 = 20)',
        distractors: ['40 sm (30 + 10 = 40)', '25 sm', '15 sm'],
        explanation: '30 - 10 = 20 sm.',
      },
      {
        text: 'Birinchi son 45, ikkinchi son undan 15 ta kam. Ikkinchi sonni toping:',
        correctAnswer: '30 (45 - 15 = 30)',
        distractors: ['60 (45 + 15 = 60)', '25', '35'],
        explanation: '45 - 15 = 30.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'Sxemada birinchi son 25, ikkinchisi 10 ta ortiq deb ko‘rsatilgan. Ikkinchi son nechaga teng?',
        correctAnswer: '35 (25 + 10 = 35)',
        distractors: ['15 (25 - 10 = 15)', '30', '40'],
        explanation: '25 + 10 = 35.',
      },
      {
        text: 'Sxemada birinchi son 40, ikkinchisi 15 ta kam ko‘rsatilgan. Ikkinchi son qaysi?',
        correctAnswer: '25 (40 - 15 = 25)',
        distractors: ['55 (40 + 15 = 55)', '20', '30'],
        explanation: '40 - 15 = 25.',
      },
      {
        text: '«50 sonini 12 taga orttiring». Natija qancha?',
        correctAnswer: '62 (50 + 12 = 62)',
        distractors: ['38', '60', '65'],
        explanation: '50 + 12 = 62.',
      },
      {
        text: '«64 sonini 20 taga kamaytiring». Natija qanday?',
        correctAnswer: '44 (64 - 20 = 44)',
        distractors: ['84', '40', '50'],
        explanation: '64 - 20 = 44.',
      },
      {
        text: 'Daftar qalamdan 8 ta ko‘p. Agar qalam 12 ta bo‘lsa, daftar nechta?',
        correctAnswer: '20 ta (12 + 8 = 20)',
        distractors: ['4 ta', '18 ta', '22 ta'],
        explanation: '12 + 8 = 20 ta.',
      },
      {
        text: 'Savatdagi olma nokdan 10 ta kam. Agar nok 35 ta bo‘lsa, olma nechta?',
        correctAnswer: '25 ta (35 - 10 = 25)',
        distractors: ['45 ta', '20 ta', '30 ta'],
        explanation: '35 - 10 = 25 ta.',
      },

      // 8 ta o'rtacha
      {
        text: 'Sxema: I qism = 33, II qism undan 21 ta ortiq. II qismni hisoblang:',
        correctAnswer: '54 (33 + 21 = 54)',
        distractors: ['12 (33 - 21 = 12)', '50', '55'],
        explanation: '33 + 21 = 54.',
      },
      {
        text: 'Sxema: I qism = 76, II qism undan 34 ta kam. II qismni hisoblang:',
        correctAnswer: '42 (76 - 34 = 42)',
        distractors: ['110', '40', '45'],
        explanation: '76 - 34 = 42.',
      },
      {
        text: '1-javonda 42 ta kitob bor. 2-javonda undan 15 ta ko‘p kitob bor. 2-javonda nechta kitob bor?',
        correctAnswer: '57 ta (42 + 15 = 57)',
        distractors: ['27 ta', '55 ta', '60 ta'],
        explanation: '42 + 15 = 57 ta kitob.',
      },
      {
        text: 'Dukonga 88 kg un keltirildi. Guruch undan 26 kg kam keltirildi. Necha kg guruch keltirilgan?',
        correctAnswer: '62 kg (88 - 26 = 62)',
        distractors: ['114 kg', '60 kg', '65 kg'],
        explanation: '88 - 26 = 62 kg guruch.',
      },
      {
        text: 'Sxema bo‘yicha: I chiziq 55 sm, II chiziq undan 23 sm qisqa. II chiziq uzunligini toping:',
        correctAnswer: '32 sm (55 - 23 = 32)',
        distractors: ['78 sm', '30 sm', '35 sm'],
        explanation: '55 - 23 = 32 sm.',
      },
      {
        text: 'Toshkent - Guliston yo‘nalishida 1-avtobusda 36 yo‘lovchi, 2-avtobusda undan 11 nafar ko‘p yo‘lovchi bor. 2-avtobusda necha yo‘lovchi bor?',
        correctAnswer: '47 nafar (36 + 11 = 47)',
        distractors: ['25 nafar', '45 nafar', '50 nafar'],
        explanation: '36 + 11 = 47 nafar.',
      },
      {
        text: 'Noma’lum sonni toping: □ soni 37 dan 12 ta ortiq.',
        correctAnswer: '49 (37 + 12 = 49)',
        distractors: ['25 (37 - 12 = 25)', '48', '50'],
        explanation: '37 + 12 = 49.',
      },
      {
        text: 'Noma’lum sonni toping: □ soni 85 dan 31 ta kam.',
        correctAnswer: '54 (85 - 31 = 54)',
        distractors: ['116', '50', '55'],
        explanation: '85 - 31 = 54.',
      },

      // 4 ta qiyinroq
      {
        text: 'Sxema bo‘yicha: I son = 24, II son undan 12 ta ortiq. Ikkala sonning yig‘indisi nechaga teng?',
        correctAnswer: '60 (II son: 36; 24 + 36 = 60)',
        distractors: ['36', '48', '55'],
        explanation: 'II son: 24 + 12 = 36. Yig‘indi: 24 + 36 = 60.',
      },
      {
        text: 'Sxema: I son = 58, II son undan 16 ta kam. Ikkala sonning yig‘indisini toping:',
        correctAnswer: '100 (II son: 42; 58 + 42 = 100)',
        distractors: ['42', '90', '116'],
        explanation: 'II son: 58 - 16 = 42. Yig‘indi: 58 + 42 = 100.',
      },
      {
        text: 'G‘olib 40 ta misol yechdi. Umid undan 10 ta kam, Jasur esa Umiddan 5 ta ko‘p yechdi. Jasur nechta misol yechgan?',
        correctAnswer: '35 ta (Umid: 30; 30 + 5 = 35)',
        distractors: ['30 ta', '45 ta', '25 ta'],
        explanation: 'Umid: 40 - 10 = 30 ta. Jasur: 30 + 5 = 35 ta.',
      },
      {
        text: '1-kun do‘konda 34 ta velosiped sotildi. 2-kuni undan 12 ta ko‘p sotildi. Ikki kunda jami nechta velosiped sotilgan?',
        correctAnswer: '80 ta (2-kun: 46; 34 + 46 = 80)',
        distractors: ['46 ta', '70 ta', '86 ta'],
        explanation: '2-kun: 34 + 12 = 46 ta. Jami: 34 + 46 = 80 ta.',
      },

      // 2 ta murakkab masala
      {
        text: 'Bog‘bon 60 tup gilos ekdi. Olma gilosdan 20 tup kam, shaftoli esa olmadan 10 tup ortiq ekildi. Bog‘da jami nechta daraxt ekilgan?',
        correctAnswer: '150 tup (Olma: 40, Shaftoli: 50; 60 + 40 + 50 = 150)',
        distractors: ['140 tup', '160 tup', '130 tup'],
        explanation: 'Olma: 60 - 20 = 40. Shaftoli: 40 + 10 = 50. Jami: 60 + 40 + 50 = 150 tup.',
      },
      {
        text: 'O‘quvchilar daryo bo‘yiga sayohatga chiqishdi. 1-avtobusda 32 bola, 2-avtobusda undan 6 nafar ko‘p, 3-avtobusda 1-avtobusdagidan 4 nafar kam bola bordi. Jami necha bola borgan?',
        correctAnswer: '98 nafar (2-avtobus: 38, 3-avtobus: 28; 32 + 38 + 28 = 98)',
        distractors: ['90 nafar', '95 nafar', '100 nafar'],
        explanation: '2-avtobus: 38 nafar. 3-avtobus: 32 - 4 = 28 nafar. Jami: 32 + 38 + 28 = 98 nafar.',
      },
    ],
  },

  // 17-dars. Sonni orttirish va kamaytirishga doir masalalar (4)
  {
    bookNumber: 17,
    title: 'Sonni orttirish va kamaytirishga doir masalalar (4)',
    emoji: '📐',
    shortDesc: 'Sxemalar bo‘yicha ikkala sonning yig‘indisini topish.',
    intro: 'Birinchi son berilgan, ikkinchisi esa bir necha birlik ortiq yoki kam bo‘lsa, avval ikkinchi son, so‘ng ularning yig‘indisi topiladi.',
    keyPoints: [
      'Sxema: Birinchi son 12, ikkinchisi 7 ta ortiq ➔ Ikkinchi son 12 + 7 = 19.',
      'Ikkala son yig‘indisi: 12 + 19 = 31.',
      'Sxema: Birinchi son 46, ikkinchisi 13 ta kam ➔ 46 − 13 = 33; jami 46 + 33 = 79.',
    ],
    miniExample: {
      emojis: '📐 I son = 12, II son = 12 + 7 = 19 ➔ Jami = 31',
      text: 'Birinchi son 12, ikkinchisi 7 ta ortiq. Ikkala son yig‘indisi: 12 + 19 = 31.',
    },
    xpReward: 100,
    coinReward: 10,
    estMinutes: 8,
    practice: [
      {
        text: 'Birinchi son 12, ikkinchisi undan 7 ta ortiq. Ikkinchi son nechaga teng?',
        correctAnswer: '19 (12 + 7 = 19)',
        distractors: ['5 (12 - 7 = 5)', '18', '20'],
        explanation: '12 + 7 = 19.',
      },
      {
        text: 'Birinchi son 12, ikkinchisi 19 bo‘lsa, ularning yig‘indisi nechaga teng?',
        correctAnswer: '31 (12 + 19 = 31)',
        distractors: ['30', '32', '7'],
        explanation: '12 + 19 = 31.',
      },
      {
        text: 'Birinchi son 46, ikkinchisi undan 13 ta kam. Ikkinchi sonni toping:',
        correctAnswer: '33 (46 - 13 = 33)',
        distractors: ['59 (46 + 13 = 59)', '30', '35'],
        explanation: '46 - 13 = 33.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'Birinchi son 10, ikkinchisi undan 5 ta ortiq. Ikkinchi sonni toping:',
        correctAnswer: '15 (10 + 5 = 15)',
        distractors: ['5 (10 - 5 = 5)', '14', '16'],
        explanation: '10 + 5 = 15.',
      },
      {
        text: 'Birinchi son 20, ikkinchisi undan 6 ta kam. Ikkinchi son nechaga teng?',
        correctAnswer: '14 (20 - 6 = 14)',
        distractors: ['26 (20 + 6 = 26)', '15', '13'],
        explanation: '20 - 6 = 14.',
      },
      {
        text: 'Birinchi son 15, ikkinchi son 25. Ularning yig‘indisi necha bo‘ladi?',
        correctAnswer: '40 (15 + 25 = 40)',
        distractors: ['10 (25 - 15 = 10)', '35', '45'],
        explanation: '15 + 25 = 40.',
      },
      {
        text: 'Birinchi son 46, ikkinchisi 33 bo‘lsa, ularning yig‘indisi nechaga teng?',
        correctAnswer: '79 (46 + 33 = 79)',
        distractors: ['13 (46 - 33 = 13)', '78', '80'],
        explanation: '46 + 33 = 79.',
      },
      {
        text: '«Birinchi son 30, ikkinchisi undan 10 ta ortiq». Ikkinchi son qaysi?',
        correctAnswer: '40 (30 + 10 = 40)',
        distractors: ['20 (30 - 10 = 20)', '35', '50'],
        explanation: '30 + 10 = 40.',
      },
      {
        text: '«Birinchi son 50, ikkinchisi undan 20 ta kam». Ikkinchi son nechaga teng?',
        correctAnswer: '30 (50 - 20 = 30)',
        distractors: ['70 (50 + 20 = 70)', '35', '25'],
        explanation: '50 - 20 = 30.',
      },

      // 8 ta o'rtacha
      {
        text: 'Sxema: I son = 12, II son undan 7 ta ortiq. Ikkala sonning yig‘indisi qancha?',
        correctAnswer: '31 (12 + 19 = 31)',
        distractors: ['19', '30', '32'],
        explanation: 'II son = 12 + 7 = 19. Yig‘indi: 12 + 19 = 31.',
      },
      {
        text: 'Sxema: I son = 46, II son undan 13 ta kam. Ikkala sonning yig‘indisini toping:',
        correctAnswer: '79 (46 + 33 = 79)',
        distractors: ['33', '75', '80'],
        explanation: 'II son = 46 - 13 = 33. Yig‘indi: 46 + 33 = 79.',
      },
      {
        text: 'Alida 15 ta yong‘oq bor, Valida undan 5 ta ko‘p yong‘oq bor. Ikkala bolada jami nechta yong‘oq bor?',
        correctAnswer: '35 ta (Valida: 20; 15 + 20 = 35)',
        distractors: ['20 ta', '30 ta', '40 ta'],
        explanation: 'Vali: 15 + 5 = 20 ta. Jami: 15 + 20 = 35 ta.',
      },
      {
        text: 'Birinchi savatda 24 ta olma bor, ikkinchi savatda undan 10 ta kam. Ikkala savatda birgalikda nechta olma bor?',
        correctAnswer: '38 ta (2-savat: 14; 24 + 14 = 38)',
        distractors: ['14 ta', '34 ta', '40 ta'],
        explanation: '2-savat: 24 - 10 = 14 ta. Jami: 24 + 14 = 38 ta.',
      },
      {
        text: 'Sxema bo‘yicha: I kesma 25 sm, II kesma undan 12 sm uzun. Ikkala kesma birgalikda necha sm bo‘ladi?',
        correctAnswer: '62 sm (II kesma: 37 sm; 25 + 37 = 62)',
        distractors: ['37 sm', '60 sm', '65 sm'],
        explanation: 'II kesma: 25 + 12 = 37 sm. Jami: 25 + 37 = 62 sm.',
      },
      {
        text: 'Do‘konda 35 ta koptok bor edi. Chanoqlar koptokdan 11 ta kam. Do‘konda jami nechta o‘yinchoq bor?',
        correctAnswer: '59 ta (Chanoq: 24; 35 + 24 = 59)',
        distractors: ['24 ta', '55 ta', '60 ta'],
        explanation: 'Chanoqlar: 35 - 11 = 24 ta. Jami: 35 + 24 = 59 ta.',
      },
      {
        text: '1-qutida 30 dona konfet bor, 2-qutida undan 15 dona ko‘p. Ikkala qutida jami nechta konfet bor?',
        correctAnswer: '75 dona (2-quti: 45; 30 + 45 = 75)',
        distractors: ['45 dona', '70 dona', '80 dona'],
        explanation: '2-quti: 30 + 15 = 45 dona. Jami: 30 + 45 = 75 dona.',
      },
      {
        text: 'Bir xaltada 40 kg kartoshka bor, ikkinchisida undan 12 kg kam. Ikkala xaltada necha kg kartoshka bor?',
        correctAnswer: '68 kg (2-xalta: 28; 40 + 28 = 68)',
        distractors: ['28 kg', '65 kg', '70 kg'],
        explanation: '2-xalta: 40 - 12 = 28 kg. Jami: 40 + 28 = 68 kg.',
      },

      // 4 ta qiyinroq
      {
        text: 'Sxema: I son = 35, II son undan 15 ta ortiq, III son esa I sondan 10 ta kam. Uchala sonning yig‘indisi nechaga teng?',
        correctAnswer: '110 (II son: 50, III son: 25; 35 + 50 + 25 = 110)',
        distractors: ['100', '105', '115'],
        explanation: 'II: 35 + 15 = 50. III: 35 - 10 = 25. Jami: 35 + 50 + 25 = 110.',
      },
      {
        text: 'Kutubxonada 1-javonda 44 ta kitob bor. 2-javonda undan 14 ta kam kitob bor. Ikkala javonda jami nechta kitob bor?',
        correctAnswer: '74 ta (2-javon: 30; 44 + 30 = 74)',
        distractors: ['30 ta', '70 ta', '80 ta'],
        explanation: '2-javon: 44 - 14 = 30 ta. Jami: 44 + 30 = 74 ta.',
      },
      {
        text: 'Avtosaroyda 28 ta avtobus bor, yengil mashinalar undan 14 ta ortiq. Saroyda jami nechta transport vositasi bor?',
        correctAnswer: '70 ta (Yengil: 42; 28 + 42 = 70)',
        distractors: ['42 ta', '68 ta', '75 ta'],
        explanation: 'Yengil mashina: 28 + 14 = 42 ta. Jami: 28 + 42 = 70 ta.',
      },
      {
        text: 'Bir guruhda 36 nafar sayyoh bor, ikkinchi guruhda undan 12 nafar kam. Ikkala guruhda jami necha sayyoh bor?',
        correctAnswer: '60 nafar (2-guruh: 24; 36 + 24 = 60)',
        distractors: ['24 nafar', '58 nafar', '64 nafar'],
        explanation: '2-guruh: 36 - 12 = 24 nafar. Jami: 36 + 24 = 60 nafar.',
      },

      // 2 ta murakkab masala
      {
        text: 'Sport maktabida 1-zalda 45 ta to‘p bor. 2-zalda undan 15 ta kam, 3-zalda esa 2-zaldagidan 10 ta ko‘p to‘p bor. Uchala zalda jami nechta to‘p bor?',
        correctAnswer: '115 ta (2-zal: 30, 3-zal: 40; 45 + 30 + 40 = 115)',
        distractors: ['105 ta', '110 ta', '120 ta'],
        explanation: '2-zal: 45 - 15 = 30 ta. 3-zal: 30 + 10 = 40 ta. Jami: 45 + 30 + 40 = 115 ta.',
      },
      {
        text: 'Fermer xo‘jaligida 1-brigada 50 tonna, 2-brigada undan 15 tonna kam, 3-brigada esa 2-brigadadan 10 tonna ortiq paxta terdi. Uchala brigada jami necha tonna paxta tergan?',
        correctAnswer: '130 tonna (2-brigada: 35, 3-brigada: 45; 50 + 35 + 45 = 130)',
        distractors: ['120 tonna', '125 tonna', '135 tonna'],
        explanation: '2-brigada: 50 - 15 = 35 t. 3-brigada: 35 + 10 = 45 t. Jami: 50 + 35 + 45 = 130 t.',
      },
    ],
  },

  // 18-dars. Taqqoslashga doir masalalar
  {
    bookNumber: 18,
    title: 'Taqqoslashga doir masalalar',
    emoji: '⚖️',
    shortDesc: '«Qancha ko‘p?» va «qancha kam?» savollariga javob berish.',
    intro: 'Bir son ikkinchisidan qancha ko‘p yoki kamligini bilish uchun har doim katta sondan kichik son ayiriladi.',
    keyPoints: [
      'Qoida: Qancha ko‘p yoki qancha kamligini topish uchun kattasidan kichigi ayiriladi.',
      'Misol: 8 ta va 6 ta rasm ➔ 8 − 6 = 2 ta ko‘p (yoki kam).',
      'Taqqoslash masalalarida har doim ayirish amali qo‘llaniladi.',
    ],
    miniExample: {
      emojis: '🖼️ 8 ta rangli rasm va 6 ta oq-qora rasm ➔ 8 - 6 = 2 ta farq',
      text: '8 ta rangli rasm 6 ta oq-qora rasmdan 2 ta ko‘p: 8 - 6 = 2 ta.',
    },
    xpReward: 95,
    coinReward: 10,
    estMinutes: 8,
    practice: [
      {
        text: 'Bir son ikkinchisidan qancha ko‘p yoki kamligini topish uchun qaysi amal bajariladi?',
        correctAnswer: 'Katta sondan kichik son ayiriladi',
        distractors: ['Sonlar bir-biriga qo‘shiladi', 'Sonlar o‘rni almashtiriladi', 'Hech qanday amal bajarilmaydi'],
        explanation: 'Taqqoslashda farqni topish uchun katta sondan kichik son ayiriladi.',
      },
      {
        text: '8 ta rangli rasm 6 ta oq-qora rasmdan nechta ko‘p?',
        correctAnswer: '2 ta (8 - 6 = 2)',
        distractors: ['14 ta (8 + 6 = 14)', '3 ta', '1 ta'],
        explanation: '8 - 6 = 2 ta ko‘p.',
      },
      {
        text: 'Anvarda 15 ta, Akmalda 10 ta qalam bor. Akmalning qalamlari Anvarnikidan nechta kam?',
        correctAnswer: '5 ta (15 - 10 = 5)',
        distractors: ['25 ta (15 + 10 = 25)', '4 ta', '6 ta'],
        explanation: '15 - 10 = 5 ta kam.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: '8 soni 6 sonidan qancha ko‘p?',
        correctAnswer: '2 ga ko‘p (8 - 6 = 2)',
        distractors: ['14 ga ko‘p', '3 ga ko‘p', '1 ga ko‘p'],
        explanation: '8 - 6 = 2.',
      },
      {
        text: '10 soni 17 sonidan qancha kam?',
        correctAnswer: '7 ga kam (17 - 10 = 7)',
        distractors: ['27 ga kam', '6 ga kam', '8 ga kam'],
        explanation: '17 - 10 = 7.',
      },
      {
        text: 'Sinfda 18 ta qiz va 12 ta o‘g‘il bola bor. Qizlar o‘g‘il bolalardan nechta ko‘p?',
        correctAnswer: '6 nafar (18 - 12 = 6)',
        distractors: ['30 nafar', '5 nafar', '7 nafar'],
        explanation: '18 - 12 = 6 nafar.',
      },
      {
        text: 'Savatda 20 ta olma va 15 ta nok bor. Noklar olmalardan nechta kam?',
        correctAnswer: '5 ta (20 - 15 = 5)',
        distractors: ['35 ta', '4 ta', '6 ta'],
        explanation: '20 - 15 = 5 ta.',
      },
      {
        text: '«Qaysi biri ko‘p va qancha ko‘p?» 25 ta qalam yoki 20 ta qalam?',
        correctAnswer: '25 ta qalam 5 taga ko‘p',
        distractors: ['20 ta qalam 5 taga ko‘p', 'Ikkalasi teng', '45 taga ko‘p'],
        explanation: '25 soni 20 dan 5 taga ko‘p (25 - 20 = 5).',
      },
      {
        text: '30 soni 40 sonidan qancha kichik?',
        correctAnswer: '10 ga kichik (40 - 30 = 10)',
        distractors: ['70 ga kichik', '5 ga kichik', '15 ga kichik'],
        explanation: '40 - 30 = 10.',
      },

      // 8 ta o'rtacha
      {
        text: 'Dardona 38 ta, Madina 25 ta gul terdi. Dardona Madinadan nechta ko‘p gul tergan?',
        correctAnswer: '13 ta (38 - 25 = 13)',
        distractors: ['63 ta', '10 ta', '15 ta'],
        explanation: '38 - 25 = 13 ta gul.',
      },
      {
        text: 'Kutubxonada 76 ta ertak va 42 ta hikoyalar kitobi bor. Ertaklar hikoyalardan nechta ko‘p?',
        correctAnswer: '34 ta (76 - 42 = 34)',
        distractors: ['118 ta', '30 ta', '36 ta'],
        explanation: '76 - 42 = 34 ta kitob.',
      },
      {
        text: '1-xaltada 55 kg, 2-xaltada 32 kg bug‘doy bor. 2-xalta 1-xaltadan necha kg yengil?',
        correctAnswer: '23 kg (55 - 32 = 23)',
        distractors: ['87 kg', '20 kg', '25 kg'],
        explanation: '55 - 32 = 23 kg.',
      },
      {
        text: 'Toshkentdan Samarqandgacha poyezdda 48 yo‘lovchi, avtobusda 36 yo‘lovchi ketmoqda. Poyezdda avtobusdagidan necha kishi ko‘p?',
        correctAnswer: '12 nafar (48 - 36 = 12)',
        distractors: ['84 nafar', '10 nafar', '14 nafar'],
        explanation: '48 - 36 = 12 nafar.',
      },
      {
        text: '89 soni 54 sonidan qancha katta?',
        correctAnswer: '35 ga (89 - 54 = 35)',
        distractors: ['143 ga', '30 ga', '40 ga'],
        explanation: '89 - 54 = 35.',
      },
      {
        text: '27 soni 68 sonidan qancha kichik?',
        correctAnswer: '41 ga (68 - 27 = 41)',
        distractors: ['95 ga', '40 ga', '43 ga'],
        explanation: '68 - 27 = 41.',
      },
      {
        text: 'Bog‘bon 64 tup shaftoli va 41 tup anor o‘tqazdi. Shaftolilar anordan nechta ko‘p?',
        correctAnswer: '23 tup (64 - 41 = 23)',
        distractors: ['105 tup', '20 tup', '25 tup'],
        explanation: '64 - 41 = 23 tup.',
      },
      {
        text: 'Dukonda 90 ta velosiped va 60 ta samokat sotildi. Samokatlar velosipedlardan nechta kam sotilgan?',
        correctAnswer: '30 ta (90 - 60 = 30)',
        distractors: ['150 ta', '25 ta', '35 ta'],
        explanation: '90 - 60 = 30 ta.',
      },

      // 4 ta qiyinroq
      {
        text: 'Akmal 1-kuni 24 bet, 2-kuni 36 bet kitob o‘qidi. Akmal 2-kuni 1-kunidagidan necha bet ko‘p o‘qigan?',
        correctAnswer: '12 bet (36 - 24 = 12)',
        distractors: ['60 bet', '10 bet', '14 bet'],
        explanation: '36 - 24 = 12 bet.',
      },
      {
        text: '1-omborga 75 qop guruch, 2-omborga 45 qop guruch keltirildi. 1-omborga necha qop ortiq guruch keltirilgan?',
        correctAnswer: '30 qop (75 - 45 = 30)',
        distractors: ['120 qop', '25 qop', '35 qop'],
        explanation: '75 - 45 = 30 qop.',
      },
      {
        text: 'Pochta droni Toshkentda 58 ta, Samarqandda 35 ta jo‘natma tashidi. Samarqandda Toshkentdagidan nechta kam jo‘natma tashilgan?',
        correctAnswer: '23 ta (58 - 35 = 23)',
        distractors: ['93 ta', '20 ta', '25 ta'],
        explanation: '58 - 35 = 23 ta.',
      },
      {
        text: 'Maktabda 96 nafar a’lochi va 64 nafar zarbdor o‘quvchi bor. A’lochilar zarbdorlardan necha nafar ko‘p?',
        correctAnswer: '32 nafar (96 - 64 = 32)',
        distractors: ['160 nafar', '30 nafar', '34 nafar'],
        explanation: '96 - 64 = 32 nafar.',
      },

      // 2 ta murakkab masala
      {
        text: '1-fermer 40 tonna, 2-fermer 30 tonna bug‘doy yetishtirdi. 3-fermer esa ikkala fermerning jami hosilidan 20 tonna kam bug‘doy yetishtirdi. 3-fermer necha tonna bug‘doy yetishtirgan?',
        correctAnswer: '50 tonna (40 + 30 = 70; 70 - 20 = 50)',
        distractors: ['40 tonna', '60 tonna', '70 tonna'],
        explanation: 'Ikkala fermer: 40 + 30 = 70 tonna. 3-fermer: 70 - 20 = 50 tonna.',
      },
      {
        text: 'Do‘konda 48 ta qizil va 32 ta ko‘k to‘p bor edi. Yashil to‘plar esa qizil va ko‘k to‘plar orasidagi farqdan 10 ta ko‘p. Do‘konda nechta yashil to‘p bor?',
        correctAnswer: '26 ta (48 - 32 = 16; 16 + 10 = 26)',
        distractors: ['16 ta', '20 ta', '30 ta'],
        explanation: 'Farq: 48 - 32 = 16 ta. Yashil to‘plar: 16 + 10 = 26 ta.',
      },
    ],
  },

  // 19-dars. Taqqoslashga doir masalalar (2)
  {
    bookNumber: 19,
    title: 'Taqqoslashga doir masalalar (2)',
    emoji: '🪐',
    shortDesc: 'Sayyoralar yo‘ldoshlari jadvali bo‘yicha taqqoslash.',
    intro: 'Quyosh tizimi sayyoralarining yo‘ldoshlari jadvali orqali sonlarni taqqoslash va farqini hisoblashni o‘rganamiz.',
    keyPoints: [
      'Jadval: Yupiter 79, Saturn 82, Uran 27, Neptun 14, Mars 2, Yer 1, Merkuriy va Venera 0 ta.',
      'Eng ko‘p yo‘ldoshga ega sayyora: Saturn (82 ta).',
      'Yo‘ldoshi yo‘q sayyoralar: Merkuriy va Venera (0 ta).',
    ],
    miniExample: {
      emojis: '🪐 Saturn: 82 ta, Yupiter: 79 ta ➔ Farq: 82 - 79 = 3 ta',
      text: 'Saturnning yo‘ldoshlari Yupiterdan nechta ko‘p? 82 - 79 = 3 ta ko‘p.',
    },
    xpReward: 95,
    coinReward: 10,
    estMinutes: 8,
    practice: [
      {
        text: 'Jadvalga ko‘ra Saturnning 82 ta, Yupiterning 79 ta yo‘ldoshi bor. Saturnning yo‘ldoshlari Yupiterdan nechta ko‘p?',
        correctAnswer: '3 ta (82 - 79 = 3)',
        distractors: ['2 ta', '4 ta', '161 ta'],
        explanation: '82 - 79 = 3 ta.',
      },
      {
        text: 'Qaysi sayyoralarning yo‘ldoshlari umuman yo‘q (0 ta)?',
        correctAnswer: 'Merkuriy va Venera',
        distractors: ['Yer va Mars', 'Uran va Neptun', 'Yupiter va Saturn'],
        explanation: 'Merkuriy va Venera sayyoralarining tabiiy yo‘ldoshi yo‘q (0 ta).',
      },
      {
        text: 'Uranning 27 ta, Neptunning 14 ta yo‘ldoshi bor. Uranning yo‘ldoshlari Neptunnikidan nechta ko‘p?',
        correctAnswer: '13 ta (27 - 14 = 13)',
        distractors: ['41 ta', '10 ta', '15 ta'],
        explanation: '27 - 14 = 13 ta.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'Jadval bo‘yicha Saturn (82 ta) Yupiterdan (79 ta) nechta ko‘p yo‘ldoshga ega?',
        correctAnswer: '3 ta (82 - 79 = 3)',
        distractors: ['2 ta', '4 ta', '5 ta'],
        explanation: '82 - 79 = 3 ta.',
      },
      {
        text: 'Uranning 27 ta va Marsning 2 ta yo‘ldoshi bor. Ular orasidagi farq qancha?',
        correctAnswer: '25 ta (27 - 2 = 25)',
        distractors: ['29 ta', '24 ta', '26 ta'],
        explanation: '27 - 2 = 25 ta.',
      },
      {
        text: 'Yerning nechta tabiiy yo‘ldoshi bor?',
        correctAnswer: '1 ta (Oy)',
        distractors: ['2 ta', '0 ta', '4 ta'],
        explanation: 'Yerning bitta tabiiy yo‘ldoshi bor, u Oydir.',
      },
      {
        text: 'Marsning (2 ta) Yerdan (1 ta) nechta ko‘p yo‘ldoshi bor?',
        correctAnswer: '1 ta (2 - 1 = 1)',
        distractors: ['3 ta', '2 ta', '0 ta'],
        explanation: '2 - 1 = 1 ta.',
      },
      {
        text: 'Neptunning 14 ta yo‘ldoshi bor. Merkuriyda esa 0 ta. Farq nechaga teng?',
        correctAnswer: '14 ta (14 - 0 = 14)',
        distractors: ['0 ta', '15 ta', '1 ta'],
        explanation: '14 - 0 = 14 ta.',
      },
      {
        text: 'Jadvalda eng ko‘p yo‘ldoshga ega bo‘lgan sayyora qaysi?',
        correctAnswer: 'Saturn (82 ta)',
        distractors: ['Yupiter (79 ta)', 'Uran (27 ta)', 'Yer (1 ta)'],
        explanation: 'Jadvalda eng katta son 82, u Saturn sayyorasiga tegishli.',
      },

      // 8 ta o'rtacha
      {
        text: 'Uranning 27 ta, Neptunning 14 ta yo‘ldoshi bor. Neptun Uranga qaraganda nechta kam yo‘ldoshga ega?',
        correctAnswer: '13 ta (27 - 14 = 13)',
        distractors: ['41 ta', '12 ta', '14 ta'],
        explanation: '27 - 14 = 13 ta.',
      },
      {
        text: 'Yupiterning 79 ta, Neptunning 14 ta yo‘ldoshi bor. Yupiterning yo‘ldoshlari Neptundan qancha ko‘p?',
        correctAnswer: '65 ta (79 - 14 = 65)',
        distractors: ['93 ta', '60 ta', '70 ta'],
        explanation: '79 - 14 = 65 ta.',
      },
      {
        text: 'Saturn (82 ta) Uranga (27 ta) qaraganda qancha ko‘p yo‘ldoshga ega?',
        correctAnswer: '55 ta (82 - 27 = 55)',
        distractors: ['109 ta', '50 ta', '60 ta'],
        explanation: '82 - 27 = 55 ta.',
      },
      {
        text: 'Yer (1 ta) va Mars (2 ta) yo‘ldoshlari soni birgalikda nechta bo‘ladi?',
        correctAnswer: '3 ta (1 + 2 = 3)',
        distractors: ['1 ta', '2 ta', '4 ta'],
        explanation: '1 + 2 = 3 ta.',
      },
      {
        text: 'Neptunning 14 ta yo‘ldoshi Yer va Mars yo‘ldoshlari yig‘indisidan (3 ta) qancha ko‘p?',
        correctAnswer: '11 ta (14 - 3 = 11)',
        distractors: ['17 ta', '10 ta', '12 ta'],
        explanation: '14 - 3 = 11 ta.',
      },
      {
        text: 'Uranning 27 ta yo‘ldoshi Marsning 2 ta yo‘ldoshidan qancha ortiq?',
        correctAnswer: '25 ta (27 - 2 = 25)',
        distractors: ['29 ta', '24 ta', '26 ta'],
        explanation: '27 - 2 = 25 ta.',
      },
      {
        text: 'Jadvaldagi barcha yo‘ldoshsiz sayyoralar soni nechta?',
        correctAnswer: '2 ta (Merkuriy va Venera)',
        distractors: ['1 ta', '3 ta', '0 ta'],
        explanation: 'Merkuriy va Venera (jami 2 ta sayyora).',
      },
      {
        text: 'Saturn (82 ta) va Neptun (14 ta) yo‘ldoshlari farqi nechaga teng?',
        correctAnswer: '68 ta (82 - 14 = 68)',
        distractors: ['96 ta', '66 ta', '70 ta'],
        explanation: '82 - 14 = 68 ta.',
      },

      // 4 ta qiyinroq
      {
        text: 'Uran (27 ta) va Neptun (14 ta) sayyoralari yo‘ldoshlarining jami soni nechta?',
        correctAnswer: '41 ta (27 + 14 = 41)',
        distractors: ['13 ta (27 - 14 = 13)', '40 ta', '42 ta'],
        explanation: '27 + 14 = 41 ta.',
      },
      {
        text: 'Yupiterning 79 ta yo‘ldoshi Uran va Neptun yo‘ldoshlari yig‘indisidan (41 ta) qancha ko‘p?',
        correctAnswer: '38 ta (79 - 41 = 38)',
        distractors: ['120 ta', '35 ta', '40 ta'],
        explanation: '79 - 41 = 38 ta.',
      },
      {
        text: 'Sayyoralar yo‘ldoshlari soni o‘sish tartibida qaysi qatorda to‘g‘ri joylashgan?',
        correctAnswer: 'Yer (1), Mars (2), Neptun (14), Uran (27)',
        distractors: ['Neptun (14), Uran (27), Mars (2), Yer (1)', 'Saturn (82), Yupiter (79), Uran (27)', 'Mars (2), Yer (1), Uran (27)'],
        explanation: '1 < 2 < 14 < 27 — to‘g‘ri o‘sish tartibi.',
      },
      {
        text: 'Saturn (82 ta) va Yupiter (79 ta) yo‘ldoshlari yig‘indisi nechaga teng?',
        correctAnswer: '161 ta (82 + 79 = 161)',
        distractors: ['3 ta (82 - 79 = 3)', '160 ta', '159 ta'],
        explanation: '82 + 79 = 161 ta.',
      },

      // 2 ta murakkab masala
      {
        text: 'Astronomik markaz Uran va Neptun yo‘ldoshlarini o‘rganish uchun 50 ta maxsus teleskop ajratdi. Ularning har bir yo‘ldoshiga bittadan teleskop to‘g‘ri kelsa (27 + 14 = 41), nechta teleskop ortib qoladi?',
        correctAnswer: '9 ta (50 - 41 = 9)',
        distractors: ['10 ta', '8 ta', '11 ta'],
        explanation: 'Jami yo‘ldoshlar: 27 + 14 = 41 ta. Ortib qolgani: 50 - 41 = 9 ta teleskop.',
      },
      {
        text: 'Koinot kemasi Yer, Mars va Neptun sayyoralari atrofida uchib o‘tdi. Bu sayyoralarning jami yo‘ldoshlari soni nechta bo‘ladi? (1 + 2 + 14)',
        correctAnswer: '17 ta (1 + 2 + 14 = 17)',
        distractors: ['16 ta', '18 ta', '15 ta'],
        explanation: '1 + 2 = 3, 3 + 14 = 17 ta yo‘ldosh.',
      },
    ],
  },

  // 20-dars. Taqqoslashga doir masalalar (3)
  {
    bookNumber: 20,
    title: 'Taqqoslashga doir masalalar (3)',
    emoji: '⭐',
    shortDesc: 'Yulduz turkumlari, sonlarni orttirish/kamaytirish va farqini topish.',
    intro: 'Yulduz turkumlari va yulduzlar sonini hisoblash orqali taqqoslash ko‘nikmalarini chuqurlashtiramiz.',
    keyPoints: [
      '7 dan 8 ta ortiq son: 7 + 8 = 15.',
      '16 dan 9 ta kam son: 16 − 9 = 7.',
      '70 soni 85 dan qancha kam: 85 − 70 = 15 ga kam.',
    ],
    miniExample: {
      emojis: '⭐ Katta Ayiq: 7 ta yulduz, Kichik Ayiq: 7 ta yulduz',
      text: '70 soni 85 dan qancha kam? Farqni topamiz: 85 - 70 = 15 ga kam.',
    },
    xpReward: 100,
    coinReward: 10,
    estMinutes: 8,
    practice: [
      {
        text: '«7 dan 8 ta ortiq» sonni toping:',
        correctAnswer: '15 (7 + 8 = 15)',
        distractors: ['1 (8 - 7 = 1)', '14', '16'],
        explanation: '7 + 8 = 15.',
      },
      {
        text: '«16 dan 9 ta kam» son nechaga teng?',
        correctAnswer: '7 (16 - 9 = 7)',
        distractors: ['25 (16 + 9 = 25)', '6', '8'],
        explanation: '16 - 9 = 7.',
      },
      {
        text: '70 soni 85 sonidan qancha kam?',
        correctAnswer: '15 ga (85 - 70 = 15)',
        distractors: ['155 ga', '10 ga', '20 ga'],
        explanation: '85 - 70 = 15 ga kam.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: '7 sonini 8 taga orttirsak, necha hosil bo‘ladi?',
        correctAnswer: '15',
        distractors: ['1', '14', '16'],
        explanation: '7 + 8 = 15.',
      },
      {
        text: '16 sonini 9 taga kamaytirsak, qaysi son chiqadi?',
        correctAnswer: '7',
        distractors: ['25', '6', '8'],
        explanation: '16 - 9 = 7.',
      },
      {
        text: '70 soni 85 dan qancha kam?',
        correctAnswer: '15 ga kam',
        distractors: ['10 ga kam', '20 ga kam', '25 ga kam'],
        explanation: '85 - 70 = 15.',
      },
      {
        text: 'Katta Ayiq yulduz turkumida 7 ta yorqin yulduz bor. Kichik Ayiqda ham 7 ta yulduz bor. Ular soni tengmi?',
        correctAnswer: 'Ha, ikkalasi teng (7 = 7)',
        distractors: ['Yo‘q, Katta Ayiqda ko‘p', 'Yo‘q, Kichik Ayiqda ko‘p', 'Bilib bo‘lmaydi'],
        explanation: '7 = 7, ikkala yulduz turkumi yulduzlari soni teng.',
      },
      {
        text: '«50 soni 70 dan qancha kichik?»',
        correctAnswer: '20 ga kichik (70 - 50 = 20)',
        distractors: ['120 ga', '15 ga', '25 ga'],
        explanation: '70 - 50 = 20.',
      },
      {
        text: '12 sonidan 6 ta ortiq son qaysi?',
        correctAnswer: '18 (12 + 6 = 18)',
        distractors: ['6 (12 - 6 = 6)', '16', '20'],
        explanation: '12 + 6 = 18.',
      },

      // 8 ta o'rtacha
      {
        text: 'Orion yulduz turkumida 14 ta, Qavs turkumida 20 ta yulduz sanaldi. Qavsda nechta ko‘p yulduz sanalgan?',
        correctAnswer: '6 ta (20 - 14 = 6)',
        distractors: ['34 ta', '5 ta', '7 ta'],
        explanation: '20 - 14 = 6 ta.',
      },
      {
        text: 'Rasaddan 48 ta yulduz kuzatildi. Ertasi kuni 16 ta kam yulduz ko‘rindi. 2-kuni nechta yulduz ko‘ringan?',
        correctAnswer: '32 ta (48 - 16 = 32)',
        distractors: ['64 ta', '30 ta', '34 ta'],
        explanation: '48 - 16 = 32 ta yulduz.',
      },
      {
        text: '65 soni 90 sonidan qancha kam?',
        correctAnswer: '25 ga (90 - 65 = 25)',
        distractors: ['155 ga', '20 ga', '30 ga'],
        explanation: '90 - 65 = 25.',
      },
      {
        text: '«35 dan 18 ta ortiq» bo‘lgan sonni toping:',
        correctAnswer: '53 (35 + 18 = 53)',
        distractors: ['17 (35 - 18 = 17)', '50', '55'],
        explanation: '35 + 18 = 53.',
      },
      {
        text: 'Ulug‘bek rasadxonasida birinchi guruh 36 ta, ikkinchi guruh 24 ta yulduzni xaritaga tushirdi. 1-guruh nechtaga ko‘p yulduz tushirgan?',
        correctAnswer: '12 ta (36 - 24 = 12)',
        distractors: ['60 ta', '10 ta', '14 ta'],
        explanation: '36 - 24 = 12 ta.',
      },
      {
        text: 'Qaysi guruhda yulduzlar soni eng ko‘p: A guruhda 45 ta, B guruhda 38 ta, C guruhda 52 ta?',
        correctAnswer: 'C guruhda (52 ta)',
        distractors: ['A guruhda (45 ta)', 'B guruhda (38 ta)', 'Hammasi teng'],
        explanation: '52 soni 45 va 38 dan katta.',
      },
      {
        text: '40 soni 68 sonidan qancha kam?',
        correctAnswer: '28 ga (68 - 40 = 28)',
        distractors: ['108 ga', '20 ga', '30 ga'],
        explanation: '68 - 40 = 28.',
      },
      {
        text: '«42 dan 19 ta kam» bo‘lgan sonni toping:',
        correctAnswer: '23 (42 - 19 = 23)',
        distractors: ['61 (42 + 19 = 61)', '20', '25'],
        explanation: '42 - 19 = 23.',
      },

      // 4 ta qiyinroq
      {
        text: 'Astronom 1-kuni 25 ta, 2-kuni undan 10 ta ko‘p yulduz qayd etdi. Ikkala kunda jami nechta yulduz qayd etilgan?',
        correctAnswer: '60 ta (2-kun: 35; 25 + 35 = 60)',
        distractors: ['35 ta', '55 ta', '70 ta'],
        explanation: '2-kuni: 25 + 10 = 35 ta. Jami: 25 + 35 = 60 ta.',
      },
      {
        text: 'Planetariyga ertalab 45 o‘quvchi, tushda undan 15 nafar kam o‘quvchi keldi. Kun davomida jami necha o‘quvchi kelgan?',
        correctAnswer: '75 nafar (Tushda: 30; 45 + 30 = 75)',
        distractors: ['30 nafar', '70 nafar', '80 nafar'],
        explanation: 'Tushda: 45 - 15 = 30 nafar. Jami: 45 + 30 = 75 nafar.',
      },
      {
        text: 'Sonlarni kamayish tartibida joylashtiring: 85, 70, 90, 65',
        correctAnswer: '90, 85, 70, 65',
        distractors: ['65, 70, 85, 90', '90, 70, 85, 65', '85, 90, 70, 65'],
        explanation: 'Kamayish tartibi eng kattasidan eng kichigiga qarab: 90 > 85 > 70 > 65.',
      },
      {
        text: '70 soni 95 sonidan qancha kam bo‘lsa, 40 soni 65 sonidan shuncha kammi?',
        correctAnswer: 'Ha, ikkalasida ham 25 ga kam (95 - 70 = 25, 65 - 40 = 25)',
        distractors: ['Yo‘q, biri 20 ga, biri 30 ga kam', 'Yo‘q, teng emas', 'Bilib bo‘lmaydi'],
        explanation: '95 - 70 = 25 va 65 - 40 = 25. Farqlari teng.',
      },

      // 2 ta murakkab masala
      {
        text: 'Teleskop orqali 3 ta yulduz turkumi kuzatildi: 1-sida 15 ta, 2-sida 20 ta, 3-sida esa 1-sidagidan 5 ta ko‘p yulduz bor. Jami nechta yulduz kuzatildi?',
        correctAnswer: '55 ta (3-turkum: 20 ta; 15 + 20 + 20 = 55)',
        distractors: ['50 ta', '60 ta', '45 ta'],
        explanation: '3-turkumda: 15 + 5 = 20 ta. Jami: 15 + 20 + 20 = 55 ta yulduz.',
      },
      {
        text: 'Sayyohlar rasadxonada 50 ta yulduzni ko‘rishdi. Agar ular yana 25 ta ko‘rishsa, jami soni 100 tadan qancha kam bo‘ladi?',
        correctAnswer: '25 taga kam (50 + 25 = 75; 100 - 75 = 25)',
        distractors: ['20 taga kam', '30 taga kam', '15 taga kam'],
        explanation: 'Ko‘rilgani: 50 + 25 = 75 ta. 100 tagacha farq: 100 - 75 = 25 ta kam.',
      },
    ],
  },
];

console.log('Generating Part 3 Chapter 2A lessons (14-20)...');
for (const lessonDef of lessonsPart3Ch2A) {
  const seed = buildLessonSeed(lessonDef);
  saveLessonFile(3, lessonDef.bookNumber, seed);
  console.log(`✅ Saved lesson-${lessonDef.bookNumber}.json`);
}
