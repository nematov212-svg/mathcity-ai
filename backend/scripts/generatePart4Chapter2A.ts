import { LessonDataDef, buildLessonSeed, saveLessonFile } from './generatorTypes.js';

const lessonsPart4Ch2A: LessonDataDef[] = [
  // 116-dars. Ko'pburchak
  {
    bookNumber: 116,
    order: 5,
    title: 'Ko‘pburchak',
    emoji: '🔷',
    shortDesc: 'Yopiq siniq chiziq bilan chegaralangan ko‘pburchaklar va ularning turlari.',
    intro: 'Hamma tomondan yopiq siniq chiziq bilan chegaralangan tekis shakl ko‘pburchak deyiladi.',
    keyPoints: [
      'Ko‘pburchak nomi uning burchaklari (uchlari) va tomonlari soniga bog‘liq.',
      '3 ta tomoni bo‘lsa — uchburchak 🔺, 4 ta tomoni bo‘lsa — to‘rtburchak 🟦, 5 ta tomoni bo‘lsa — beshburchak ⬟.',
      'Ko‘pburchak chegarasi har doim yopiq siniq chiziqdan iborat bo‘ladi.',
    ],
    miniExample: {
      emojis: '🔺 Uchburchak: 3 ta tomon, 3 ta burchak',
      text: 'Uchburchakda 3 ta tomon va 3 ta burchak bor. To‘rtburchakda 4 ta tomon va 4 ta burchak bor.',
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 7,
    practice: [
      {
        text: '3 ta tomoni va 3 ta burchagi bo‘lgan ko‘pburchak qanday ataladi?',
        correctAnswer: 'Uchburchak 🔺',
        distractors: ['To‘rtburchak 🟦', 'Beshburchak', 'Doira ⭕'],
        explanation: '3 ta tomon va 3 ta uchga ega shakl uchburchak deyiladi.',
      },
      {
        text: 'Ko‘pburchak chegarasi qanday chiziqdan iborat?',
        correctAnswer: 'Yopiq siniq chiziqdan',
        distractors: ['Ochiq siniq chiziqdan', 'Egri chiziqdan', 'Nurdan'],
        explanation: 'Ko‘pburchak yopiq siniq chiziq bilan chegaralanadi.',
      },
      {
        text: 'Beshburchakning nechta tomoni va nechta uchi bor?',
        correctAnswer: '5 ta tomoni va 5 ta uchi',
        distractors: ['4 ta tomoni va 4 ta uchi', '6 ta tomoni va 6 ta uchi', '3 ta tomoni va 3 ta uchi'],
        explanation: 'Beshburchakda 5 ta tomon va 5 ta uch (burchak) bo‘ladi.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'Ko‘pburchak nima?',
        correctAnswer: 'Yopiq siniq chiziq bilan chegaralangan shakl',
        distractors: ['Istalgan to‘g‘ri chiziq', 'Aylana shakli', 'Ochiq siniq chiziq'],
        explanation: 'Ko‘pburchak yopiq siniq chiziq bilan chegaralangan tekis shakldir.',
      },
      {
        text: 'To‘rtburchakning nechta tomoni bor?',
        correctAnswer: '4 ta tomoni',
        distractors: ['3 ta tomoni', '5 ta tomoni', '6 ta tomoni'],
        explanation: 'To‘rtburchakda 4 ta tomon bor.',
      },
      {
        text: 'Uchburchakning nechta uchi bor?',
        correctAnswer: '3 ta uchi',
        distractors: ['2 ta uchi', '4 ta uchi', '5 ta uchi'],
        explanation: 'Uchburchakda 3 ta uch bor.',
      },
      {
        text: 'Qaysi shakl ko‘pburchak hisoblanmaydi?',
        correctAnswer: 'Doira ⭕ (aylana)',
        distractors: ['Uchburchak 🔺', 'Kvadrat 🟦', 'Oltiburchak'],
        explanation: 'Doira to‘g‘ri kesmalardan (siniq chiziqdan) iborat emas, shuning uchun ko‘pburchak emas.',
      },
      {
        text: '6 ta tomoni va 6 ta burchagi bo‘lgan shakl qanday ataladi?',
        correctAnswer: 'Oltiburchak',
        distractors: ['Beshburchak', 'Yettiburchak', 'To‘rtburchak'],
        explanation: '6 ta burchakka ega shakl oltiburchak deyiladi.',
      },
      {
        text: 'Ko‘pburchakning uchi deb nimaga aytiladi?',
        correctAnswer: 'Ikkita tomon tutashgan nuqtaga',
        distractors: ['Shaklning o‘rtasiga', 'Faqat pastki tomoniga', 'Aylananing markaziga'],
        explanation: 'Tomonlar tutashgan nuqtalar ko‘pburchakning uchlari deyiladi.',
      },

      // 8 ta o'rtacha
      {
        text: 'Uchburchak va to‘rtburchakning jami tomonlari soni nechta?',
        correctAnswer: '7 ta (3 + 4 = 7)',
        distractors: ['6 ta', '8 ta', '12 ta'],
        explanation: '3 + 4 = 7 ta tomon.',
      },
      {
        text: 'Quyidagi shakllardan ortiqchasini toping: Uchburchak, To‘rtburchak, Doira, Beshburchak',
        correctAnswer: 'Doira (u ko‘pburchak emas)',
        distractors: ['Uchburchak', 'To‘rtburchak', 'Beshburchak'],
        explanation: 'Doira burchak va to‘g‘ri tomonlarga ega emas.',
      },
      {
        text: 'Ikkita uchburchakni yonma-yon birlashtirsak, qanday ko‘pburchak hosil bo‘lishi mumkin?',
        correctAnswer: 'To‘rtburchak 🟦',
        distractors: ['Aylana ⭕', 'Nuqta', 'To‘g‘ri chiziq'],
        explanation: 'Ikkita uchburchak birlashsa 4 ta tomonli to‘rtburchak hosil bo‘lishi mumkin.',
      },
      {
        text: 'Yettiburchakning nechta tomoni va burchagi bor?',
        correctAnswer: '7 ta tomoni va 7 ta burchagi',
        distractors: ['6 ta tomoni va 7 ta burchagi', '8 ta tomoni va 8 ta burchagi', '5 ta tomoni'],
        explanation: 'Yettiburchakda 7 ta tomon va 7 ta burchak bo‘ladi.',
      },
      {
        text: '3 ta to‘rtburchakning jami nechta tomoni bor?',
        correctAnswer: '12 ta (4 + 4 + 4 = 12)',
        distractors: ['10 ta', '14 ta', '16 ta'],
        explanation: '4 + 4 + 4 = 12 ta tomon.',
      },
      {
        text: '2 ta beshburchakning jami nechta uchi bor?',
        correctAnswer: '10 ta (5 + 5 = 10)',
        distractors: ['8 ta', '12 ta', '15 ta'],
        explanation: '5 + 5 = 10 ta uch.',
      },
      {
        text: 'Uchburchakning bir tomoni 5 sm, ikkinchi tomoni 4 sm, uchinchi tomoni 3 sm. Bu qanday shakl?',
        correctAnswer: 'Ko‘pburchak (uchburchak)',
        distractors: ['Kvadrat', 'Doira', 'Beshburchak'],
        explanation: '3 ta tomoni bo‘lgan shakl uchburchakdir.',
      },
      {
        text: 'Tangram o‘yinidagi 7 ta shaklning nechtasi uchburchak?',
        correctAnswer: '5 tasi uchburchak',
        distractors: ['2 tasi', '3 tasi', '7 tasi'],
        explanation: 'Tangramda 5 ta uchburchak, 1 ta kvadrat va 1 ta parallelogramm bo‘ladi.',
      },

      // 4 ta qiyinroq
      {
        text: 'To‘rtburchakning bitta burchagi to‘g‘ri chiziq bilan kesib tashlansa, qanday ko‘pburchak hosil bo‘ladi?',
        correctAnswer: 'Beshburchak ⬟ (yangi burchak paydo bo‘ladi)',
        distractors: ['Uchburchak', 'Oltiburchak', 'To‘rtburchak'],
        explanation: 'Bitta burchak kesilganda 2 ta yangi burchak paydo bo‘lib, jami 5 ta burchak hosil bo‘ladi.',
      },
      {
        text: 'Uchburchakning bitta burchagi kesib tashlansa, qanday shakl hosil bo‘ladi?',
        correctAnswer: 'To‘rtburchak 🟦',
        distractors: ['Uchburchak', 'Ikki burchak', 'Doira'],
        explanation: '3 - 1 + 2 = 4 ta burchakli to‘rtburchak hosil bo‘ladi.',
      },
      {
        text: 'Sinf doskasida 4 ta uchburchak va 2 ta to‘rtburchak chizilgan. Jami burchaklar soni nechta?',
        correctAnswer: '20 ta (4 x 3 = 12; 2 x 4 = 8; 12 + 8 = 20)',
        distractors: ['18 ta', '22 ta', '24 ta'],
        explanation: '12 + 8 = 20 ta burchak.',
      },
      {
        text: 'Ko‘pburchakning tomonlari soni har doim nimaning soniga teng?',
        correctAnswer: 'Uchlari (burchaklari) soniga',
        distractors: ['Bo‘g‘inlar ayirmasiga', 'Har doim 4 ga', 'Nolga'],
        explanation: 'Istalgan ko‘pburchakda tomonlar soni burchaklar (uchlar) soniga teng bo‘ladi.',
      },

      // 2 ta murakkab masala
      {
        text: 'Jasur gugurt cho‘plaridan 2 ta alohida kvadrat va 3 ta alohida uchburchak yasadi. U jami nechta gugurt cho‘pini ishlatgan?',
        correctAnswer: '17 ta (Kvadratlar: 4 + 4 = 8; Uchburchaklar: 3 + 3 + 3 = 9; 8 + 9 = 17)',
        distractors: ['15 ta', '16 ta', '18 ta'],
        explanation: '2 ta kvadratga: 2 x 4 = 8 ta. 3 ta uchburchakka: 3 x 3 = 9 ta. Jami: 8 + 9 = 17 ta cho‘p.',
      },
      {
        text: 'Alisher qog‘ozdan 3 ta to‘rtburchak va 4 ta beshburchak qirqib oldi. Bu shakllarning jami uchlari soni nechta?',
        correctAnswer: '32 ta (3 x 4 = 12; 4 x 5 = 20; 12 + 20 = 32)',
        distractors: ['30 ta', '34 ta', '28 ta'],
        explanation: '3 x 4 = 12, 4 x 5 = 20. Jami: 12 + 20 = 32 ta uch.',
      },
    ],
  },

  // 117-dars. Ko'pburchakning perimetri
  {
    bookNumber: 117,
    order: 6,
    title: 'Ko‘pburchakning perimetri',
    emoji: '🔲',
    shortDesc: 'Perimetr — barcha tomonlar uzunliklari yig‘indisi ekanligini o‘rganish.',
    intro: 'Ko‘pburchakning barcha tomonlari uzunliklarining yig‘indisi uning perimetri deb ataladi.',
    keyPoints: [
      'Perimetr — ko‘pburchakning hamma tomonlari uzunliklari yig‘indisidir.',
      'Muntazam ko‘pburchakning barcha tomonlari bir-biriga teng bo‘ladi.',
      'Santimetrlarni detsimetrga o‘tkazish: masalan 30 sm = 3 dm.',
    ],
    miniExample: {
      emojis: '🔲 3 sm + 4 sm + 5 sm = 12 sm',
      text: 'Tomonlari 3 sm, 4 sm va 5 sm bo‘lgan uchburchakning perimetri: 3 + 4 + 5 = 12 sm.',
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 7,
    practice: [
      {
        text: 'Ko‘pburchakning perimetri nima?',
        correctAnswer: 'Barcha tomonlari uzunliklarining yig‘indisi',
        distractors: ['Faqat bitta tomoni uzunligi', 'Tomonlarining ayirmasi', 'Burchaklari soni'],
        explanation: 'Perimetr barcha tomonlar yig‘indisidir.',
      },
      {
        text: 'Tomonlari 3 sm, 4 sm, 5 sm bo‘lgan uchburchak perimetrini toping:',
        correctAnswer: '12 sm (3 + 4 + 5 = 12)',
        distractors: ['10 sm', '14 sm', '15 sm'],
        explanation: '3 + 4 + 5 = 12 sm.',
      },
      {
        text: '30 sm necha detsimetrga teng?',
        correctAnswer: '3 dm',
        distractors: ['30 dm', '1 dm', '300 dm'],
        explanation: '30 sm = 3 dm.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'Perimetr so‘zining ma’nosi nima?',
        correctAnswer: 'Barcha tomonlar uzunliklarining yig‘indisi',
        distractors: ['Shaklning rangi', 'Burchaklar soni', 'Shaklning og‘irligi'],
        explanation: 'Perimetr barcha tomonlar yig‘indisini anglatadi.',
      },
      {
        text: 'Tomonlari 2 sm, 3 sm, 4 sm bo‘lgan uchburchak perimetrini hisoblang:',
        correctAnswer: '9 sm (2 + 3 + 4 = 9)',
        distractors: ['8 sm', '10 sm', '7 sm'],
        explanation: '2 + 3 + 4 = 9 sm.',
      },
      {
        text: 'Hamma tomonlari teng bo‘lgan ko‘pburchak qanday ataladi?',
        correctAnswer: 'Muntazam ko‘pburchak',
        distractors: ['Noto‘g‘ri ko‘pburchak', 'Egri ko‘pburchak', 'Aylana'],
        explanation: 'Barcha tomonlari teng ko‘pburchak muntazam ko‘pburchak deb ataladi.',
      },
      {
        text: '40 sm necha detsimetr bo‘ladi?',
        correctAnswer: '4 dm',
        distractors: ['40 dm', '14 dm', '400 dm'],
        explanation: '40 sm = 4 dm.',
      },
      {
        text: 'Tomonlari 5 sm, 5 sm, 5 sm bo‘lgan teng tomonli uchburchak perimetrini toping:',
        correctAnswer: '15 sm (5 + 5 + 5 = 15)',
        distractors: ['10 sm', '12 sm', '20 sm'],
        explanation: '5 + 5 + 5 = 15 sm.',
      },
      {
        text: 'Tomonlari 2 sm, 3 sm, 2 sm, 3 sm bo‘lgan to‘rtburchak perimetri nechaga teng?',
        correctAnswer: '10 sm (2 + 3 + 2 + 3 = 10)',
        distractors: ['8 sm', '12 sm', '14 sm'],
        explanation: '2 + 3 + 2 + 3 = 10 sm = 1 dm.',
      },

      // 8 ta o'rtacha
      {
        text: 'Tomonlari 6 sm, 8 sm, 6 sm, 8 sm bo‘lgan to‘g‘ri to‘rtburchak perimetrini toping:',
        correctAnswer: '28 sm (6 + 8 + 6 + 8 = 28)',
        distractors: ['26 sm', '30 sm', '14 sm'],
        explanation: '6 + 8 + 6 + 8 = 28 sm.',
      },
      {
        text: 'Beshburchakning hamma 5 ta tomoni 4 sm dan. Uning perimetri qancha?',
        correctAnswer: '20 sm (4 + 4 + 4 + 4 + 4 = 20)',
        distractors: ['16 sm', '24 sm', '25 sm'],
        explanation: '4 + 4 + 4 + 4 + 4 = 20 sm = 2 dm.',
      },
      {
        text: 'Uchburchakning perimetri 18 sm. Ikki tomoni 6 sm va 7 sm bo‘lsa, uchinchi tomoni necha santimetr?',
        correctAnswer: '5 sm (18 - 6 - 7 = 5)',
        distractors: ['4 sm', '6 sm', '8 sm'],
        explanation: '6 + 7 = 13 sm, 18 - 13 = 5 sm.',
      },
      {
        text: 'Kvadratning har bir tomoni 5 sm. Uning perimetri necha santimetr?',
        correctAnswer: '20 sm (5 + 5 + 5 + 5 = 20)',
        distractors: ['15 sm', '25 sm', '10 sm'],
        explanation: '5 + 5 + 5 + 5 = 20 sm.',
      },
      {
        text: 'Tomonlari 10 sm, 10 sm, 10 sm bo‘lgan uchburchak perimetri necha detsimetr bo‘ladi?',
        correctAnswer: '3 dm (30 sm = 3 dm)',
        distractors: ['30 dm', '1 dm', '300 dm'],
        explanation: '10 + 10 + 10 = 30 sm = 3 dm.',
      },
      {
        text: 'Oltiburchakning hamma tomonlari 2 sm dan. Uning perimetrini toping:',
        correctAnswer: '12 sm (2 x 6 = 12)',
        distractors: ['10 sm', '14 sm', '16 sm'],
        explanation: '6 x 2 = 12 sm.',
      },
      {
        text: 'Tomonlari 7 sm, 8 sm va 9 sm bo‘lgan uchburchak perimetri qancha?',
        correctAnswer: '24 sm (7 + 8 + 9 = 24)',
        distractors: ['22 sm', '25 sm', '26 sm'],
        explanation: '7 + 8 + 9 = 24 sm.',
      },
      {
        text: 'To‘rtburchakning uchta tomoni 5 sm, 4 sm va 6 sm. Perimetri 20 sm bo‘lsa, to‘rtinchi tomoni qancha?',
        correctAnswer: '5 sm (20 - 5 - 4 - 6 = 5)',
        distractors: ['4 sm', '6 sm', '7 sm'],
        explanation: '5 + 4 + 6 = 15 sm, 20 - 15 = 5 sm.',
      },

      // 4 ta qiyinroq
      {
        text: 'Teng tomonli uchburchakning perimetri 21 sm. Uning bitta tomoni uzunligi qancha?',
        correctAnswer: '7 sm (7 + 7 + 7 = 21)',
        distractors: ['6 sm', '8 sm', '9 sm'],
        explanation: '7 + 7 + 7 = 21 sm.',
      },
      {
        text: 'Kvadratning perimetri 16 sm. Uning bitta tomoni necha santimetr?',
        correctAnswer: '4 sm (4 + 4 + 4 + 4 = 16)',
        distractors: ['3 sm', '5 sm', '8 sm'],
        explanation: '4 + 4 + 4 + 4 = 16 sm.',
      },
      {
        text: 'Tomonlari 1 dm va 2 dm bo‘lgan to‘g‘ri to‘rtburchak perimetri necha detsimetr?',
        correctAnswer: '6 dm (1 + 2 + 1 + 2 = 6)',
        distractors: ['5 dm', '7 dm', '8 dm'],
        explanation: '1 + 2 + 1 + 2 = 6 dm.',
      },
      {
        text: 'Tomonlari 12 sm, 18 sm va 10 sm bo‘lgan uchburchak perimetri necha detsimetrga teng? (1 dm = 10 sm)',
        correctAnswer: '4 dm (12 + 18 + 10 = 40 sm = 4 dm)',
        distractors: ['3 dm', '5 dm', '40 dm'],
        explanation: '12 + 18 + 10 = 40 sm = 4 dm.',
      },

      // 2 ta murakkab masala
      {
        text: 'Maktab tomorqasi to‘g‘ri to‘rtburchak shaklida: uzunligi 15 m, eni 5 m. Tomorqa atrofini to‘liq o‘rash uchun necha metr sim to‘r kerak?',
        correctAnswer: '40 metr (15 + 5 + 15 + 5 = 40)',
        distractors: ['35 metr', '45 metr', '50 metr'],
        explanation: '15 + 5 + 15 + 5 = 40 metr.',
      },
      {
        text: 'Hovuz to‘rtburchak shaklida bo‘lib, qarama-qarshi tomonlari 14 m va 6 m. Bolalar hovuz atrofini 1 marta aylanib yugurishdi. Ular necha metr masofa bosib o‘tishdi?',
        correctAnswer: '40 metr (14 + 6 + 14 + 6 = 40)',
        distractors: ['38 metr', '42 metr', '20 metr'],
        explanation: '14 + 6 + 14 + 6 = 40 metr.',
      },
    ],
  },

  // 118-dars. Ko'pburchakning perimetri (2)
  {
    bookNumber: 118,
    order: 7,
    title: 'Ko‘pburchakning perimetri (2)',
    emoji: '📐',
    shortDesc: 'P belgisi bilan perimetr yozish, muntazam shakllar va noma’lum tomonni topish.',
    intro: 'Matematikada perimetr lotincha P harfi bilan belgilanadi: P = a + b + c.',
    keyPoints: [
      'Perimetr P harfi bilan belgilanadi: masalan P = 18 sm.',
      'Teng tomonli uchburchak perimetri: agar tomoni 3 sm bo‘lsa, P = 3 + 3 + 3 = 9 sm.',
      'Tomonlari yig‘indisidan noma’lum tomonni topish: P − (a + b) = c.',
    ],
    miniExample: {
      emojis: '📐 P = a + b + c',
      text: 'Tomonlari 3 sm, 4 sm, 5 sm bo‘lsa: P = 3 + 4 + 5 = 12 sm.',
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 7,
    practice: [
      {
        text: 'Perimetr qaysi harf bilan belgilanadi?',
        correctAnswer: 'P harfi bilan',
        distractors: ['S harfi bilan', 'V harfi bilan', 'T harfi bilan'],
        explanation: 'Perimetr bosh harf P bilan belgilanadi.',
      },
      {
        text: 'Teng tomonli uchburchak tomoni 3 sm. Uning perimetrini toping:',
        correctAnswer: 'P = 9 sm (3 + 3 + 3 = 9)',
        distractors: ['P = 6 sm', 'P = 12 sm', 'P = 8 sm'],
        explanation: 'P = 3 + 3 + 3 = 9 sm.',
      },
      {
        text: 'Uchburchak perimetri P = 15 sm. Ikki tomoni 5 sm va 6 sm bo‘lsa, 3-tomoni qancha?',
        correctAnswer: '4 sm (15 - 5 - 6 = 4)',
        distractors: ['5 sm', '3 sm', '6 sm'],
        explanation: '15 - (5 + 6) = 15 - 11 = 4 sm.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'Perimetrni qisqacha ifodalash uchun qaysi lotin harfi ishlatiladi?',
        correctAnswer: 'P',
        distractors: ['A', 'B', 'C'],
        explanation: 'Perimetr P harfi bilan belgilanadi.',
      },
      {
        text: 'Tomoni 4 sm bo‘lgan teng tomonli uchburchak perimetri qancha?',
        correctAnswer: 'P = 12 sm (4 + 4 + 4 = 12)',
        distractors: ['P = 8 sm', 'P = 16 sm', 'P = 10 sm'],
        explanation: 'P = 4 + 4 + 4 = 12 sm.',
      },
      {
        text: 'Tomoni 3 sm bo‘lgan kvadrat perimetrini toping:',
        correctAnswer: 'P = 12 sm (3 + 3 + 3 + 3 = 12)',
        distractors: ['P = 9 sm', 'P = 6 sm', 'P = 15 sm'],
        explanation: 'P = 3 + 3 + 3 + 3 = 12 sm.',
      },
      {
        text: 'Tomonlari a = 4 sm, b = 5 sm, c = 6 sm bo‘lsa, P = ?',
        correctAnswer: 'P = 15 sm (4 + 5 + 6 = 15)',
        distractors: ['P = 14 sm', 'P = 16 sm', 'P = 13 sm'],
        explanation: 'P = 4 + 5 + 6 = 15 sm.',
      },
      {
        text: 'P = a + b + c formulasi qaysi shaklning perimetriga tegishli?',
        correctAnswer: 'Uchburchak perimetriga',
        distractors: ['Kvadrat perimetriga', 'Doiraga', 'To‘rtburchakka'],
        explanation: '3 ta tomon (a, b, c) yig‘indisi uchburchakka tegishli.',
      },
      {
        text: 'P = a + a + a + a formulasi qaysi shakl perimetriga tegishli?',
        correctAnswer: 'Kvadrat perimetriga (barcha tomonlari teng)',
        distractors: ['Uchburchak perimetriga', 'Beshburchakka', 'Doiraga'],
        explanation: '4 ta teng tomon kvadratga xosdir.',
      },

      // 8 ta o'rtacha
      {
        text: 'Uchburchak perimetri P = 20 sm. Ikki tomoni 8 sm va 7 sm bo‘lsa, uchinchi tomoni nechaga teng?',
        correctAnswer: '5 sm (20 - 8 - 7 = 5)',
        distractors: ['4 sm', '6 sm', '7 sm'],
        explanation: '8 + 7 = 15 sm, 20 - 15 = 5 sm.',
      },
      {
        text: 'Besh qirrali yulduzning 10 ta tomoni bor va har bir tomoni 2 sm. Yulduz perimetri nechaga teng?',
        correctAnswer: 'P = 20 sm (10 x 2 = 20)',
        distractors: ['P = 10 sm', 'P = 15 sm', 'P = 25 sm'],
        explanation: '10 ta 2 sm: 10 x 2 = 20 sm = 2 dm.',
      },
      {
        text: 'Kvadrat perimetri P = 24 sm. Kvadratning bitta tomoni qancha?',
        correctAnswer: '6 sm (6 + 6 + 6 + 6 = 24)',
        distractors: ['5 sm', '7 sm', '8 sm'],
        explanation: '6 + 6 + 6 + 6 = 24 sm.',
      },
      {
        text: 'Teng tomonli uchburchak perimetri P = 27 sm. Uning tomoni necha santimetr?',
        correctAnswer: '9 sm (9 + 9 + 9 = 27)',
        distractors: ['8 sm', '10 sm', '7 sm'],
        explanation: '9 + 9 + 9 = 27 sm.',
      },
      {
        text: 'Tomonlari 8 sm, 12 sm, 8 sm, 12 sm bo‘lgan to‘rtburchak perimetri qancha?',
        correctAnswer: 'P = 40 sm (8 + 12 + 8 + 12 = 40)',
        distractors: ['P = 38 sm', 'P = 42 sm', 'P = 20 sm'],
        explanation: '8 + 12 + 8 + 12 = 40 sm = 4 dm.',
      },
      {
        text: 'Beshburchak perimetri P = 25 sm bo‘lib, hamma tomonlari teng. Bitta tomoni qancha?',
        correctAnswer: '5 sm (5 x 5 = 25)',
        distractors: ['4 sm', '6 sm', '7 sm'],
        explanation: '5 + 5 + 5 + 5 + 5 = 25 sm.',
      },
      {
        text: 'Oltiburchak perimetri P = 30 sm. Agar barcha tomonlari teng bo‘lsa, har bir tomon necha santimetr?',
        correctAnswer: '5 sm (6 x 5 = 30)',
        distractors: ['4 sm', '6 sm', '7 sm'],
        explanation: '6 x 5 = 30 sm.',
      },
      {
        text: 'To‘rtburchak perimetri P = 36 sm. Uchta tomoni 8 sm, 10 sm va 11 sm bo‘lsa, to‘rtinchi tomoni qancha?',
        correctAnswer: '7 sm (36 - 8 - 10 - 11 = 7)',
        distractors: ['6 sm', '8 sm', '9 sm'],
        explanation: '8 + 10 + 11 = 29 sm, 36 - 29 = 7 sm.',
      },

      // 4 ta qiyinroq
      {
        text: 'Kvadrat tomoni a = 1 dm bo‘lsa, uning perimetri necha santimetr bo‘ladi? (1 dm = 10 sm)',
        correctAnswer: 'P = 40 sm (10 + 10 + 10 + 10 = 40)',
        distractors: ['P = 4 sm', 'P = 20 sm', 'P = 100 sm'],
        explanation: '1 dm = 10 sm. 4 x 10 = 40 sm = 4 dm.',
      },
      {
        text: 'To‘g‘ri to‘rtburchak perimetri P = 26 sm. Uzunligi 8 sm bo‘lsa, eni necha santimetr?',
        correctAnswer: '5 sm (8 + 5 + 8 + 5 = 26)',
        distractors: ['4 sm', '6 sm', '7 sm'],
        explanation: '8 + 8 = 16 sm, 26 - 16 = 10 sm, 10 ning yarmi 5 sm.',
      },
      {
        text: 'Teng tomonli uchburchak va kvadratning perimetrlari teng: P = 12 sm. Kvadratning tomoni uchburchakning tomonidan qancha qisqa?',
        correctAnswer: '1 sm ga qisqa (Uchburchak: 4 sm, Kvadrat: 3 sm; 4 - 3 = 1)',
        distractors: ['2 sm ga', 'Teng', '3 sm ga'],
        explanation: 'Uchburchak tomoni: 12 / 3 = 4 sm. Kvadrat tomoni: 12 / 4 = 3 sm. Farq: 4 - 3 = 1 sm.',
      },
      {
        text: 'To‘g‘ri to‘rtburchak perimetri P = 30 sm. Eni 5 sm bo‘lsa, uzunligi necha santimetr?',
        correctAnswer: '10 sm (5 + 10 + 5 + 10 = 30)',
        distractors: ['8 sm', '12 sm', '15 sm'],
        explanation: '5 + 5 = 10 sm, 30 - 10 = 20 sm, 20 ning yarmi 10 sm.',
      },

      // 2 ta murakkab masala
      {
        text: 'Bolalar bog‘chasidagi qum maydonchasi kvadrat shaklida. Uning perimetri P = 32 metr. Qum maydonchasining bitta tomoni necha metr?',
        correctAnswer: '8 metr (8 + 8 + 8 + 8 = 32)',
        distractors: ['7 metr', '9 metr', '10 metr'],
        explanation: '8 + 8 + 8 + 8 = 32 metr.',
      },
      {
        text: 'Shaxmat taxtasi kvadrat shaklida, har bir tomoni 40 sm. Uning perimetrini detsimetrlarda toping: (1 dm = 10 sm)',
        correctAnswer: 'P = 16 dm (40 sm = 4 dm; 4 x 4 = 16 dm)',
        distractors: ['P = 12 dm', 'P = 160 dm', 'P = 8 dm'],
        explanation: '40 + 40 + 40 + 40 = 160 sm = 16 dm.',
      },
    ],
  },

  // 119-dars. To'g'ri to'rtburchak va kvadrat
  {
    bookNumber: 119,
    order: 8,
    title: 'To‘g‘ri to‘rtburchak va kvadrat',
    emoji: '🟦',
    shortDesc: 'Kvadrat va to‘g‘ri to‘rtburchakning xossalari hamda perimetr jadvali.',
    intro: 'Kvadratning barcha 4 ta tomoni teng, to‘g‘ri to‘rtburchakning esa qarama-qarshi tomonlari teng bo‘ladi.',
    keyPoints: [
      'Kvadrat: barcha 4 ta tomoni teng va burchaklari to‘g‘ri burchak.',
      'To‘g‘ri to‘rtburchak: qarama-qarshi tomonlari o‘zaro teng va burchaklari to‘g‘ri burchak.',
      'Perimetr jadvali: kvadrat tomoni 12 dm bo‘lsa, P = 48 dm; to‘g‘ri to‘rtburchak 20 dm va 4 dm bo‘lsa, P = 48 dm.',
    ],
    miniExample: {
      emojis: '🟦 Kvadrat: a = 5 sm => P = 20 sm',
      text: 'Kvadratning hamma tomoni 5 sm: 5 + 5 + 5 + 5 = 20 sm.',
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 7,
    practice: [
      {
        text: 'Kvadratning qaysi tomonlari teng bo‘ladi?',
        correctAnswer: 'Barcha 4 ta tomoni teng',
        distractors: ['Faqat 2 ta tomoni', 'Qarama-qarshi tomonlari teng, qolgani har xil', 'Tomonlari teng emas'],
        explanation: 'Kvadratning hamma 4 ta tomoni teng bo‘ladi.',
      },
      {
        text: 'To‘g‘ri to‘rtburchakning qaysi tomonlari teng?',
        correctAnswer: 'Qarama-qarshi tomonlari o‘zaro teng',
        distractors: ['Barcha 4 ta tomoni teng', 'Hech qaysi tomoni teng emas', 'Faqat bitta tomoni teng'],
        explanation: 'To‘g‘ri to‘rtburchakda qarama-qarshi tomonlar teng bo‘ladi.',
      },
      {
        text: 'Tomonlari 20 dm va 4 dm bo‘lgan to‘g‘ri to‘rtburchak perimetrini toping:',
        correctAnswer: '48 dm (20 + 4 + 20 + 4 = 48)',
        distractors: ['24 dm', '44 dm', '50 dm'],
        explanation: '20 + 4 + 20 + 4 = 48 dm.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'Kvadratning nechta tomoni bor va ular qanday?',
        correctAnswer: '4 ta tomoni bor va hammasi teng',
        distractors: ['3 ta tomoni bor', '4 ta tomoni bor va hammasi har xil', '2 ta tomoni bor'],
        explanation: 'Kvadratning 4 ta tomoni bor va barchasi o‘zaro teng.',
      },
      {
        text: 'To‘g‘ri to‘rtburchakning qarama-qarshi tomonlari haqida qaysi fikr to‘g‘ri?',
        correctAnswer: 'Qarama-qarshi tomonlari o‘zaro teng',
        distractors: ['Qarama-qarshi tomonlari har xil', 'Barcha tomonlari har xil', 'Uchburchakka o‘xshaydi'],
        explanation: 'To‘g‘ri to‘rtburchakda qarama-qarshi tomonlar tengdir.',
      },
      {
        text: 'Tomoni 6 sm bo‘lgan kvadrat perimetrini toping:',
        correctAnswer: '24 sm (6 + 6 + 6 + 6 = 24)',
        distractors: ['18 sm', '20 sm', '36 sm'],
        explanation: '6 + 6 + 6 + 6 = 24 sm.',
      },
      {
        text: 'Tomonlari 5 sm va 2 sm bo‘lgan to‘g‘ri to‘rtburchak perimetri qancha?',
        correctAnswer: '14 sm (5 + 2 + 5 + 2 = 14)',
        distractors: ['10 sm', '12 sm', '7 sm'],
        explanation: '5 + 2 + 5 + 2 = 14 sm.',
      },
      {
        text: 'Kvadratning barcha burchaklari qanday burchak hisoblanadi?',
        correctAnswer: 'To‘g‘ri burchaklar',
        distractors: ['O‘tkir burchaklar', 'O‘tmas burchaklar', 'Yoyiq burchaklar'],
        explanation: 'Kvadratning barcha 4 ta burchagi to‘g‘ri burchakdir.',
      },
      {
        text: 'Qaysi shakl kvadrat: tomonlari 4 sm, 4 sm, 4 sm, 4 sm bo‘lgan shaklmi?',
        correctAnswer: 'Ha, kvadrat (barcha tomonlari teng)',
        distractors: ['Yo‘q, uchburchak', 'Yo‘q, beshburchak', 'Doira'],
        explanation: '4 ta tomoni teng va to‘g‘ri burchakli shakl kvadratdir.',
      },

      // 8 ta o'rtacha
      {
        text: 'Kvadrat tomoni 12 dm bo‘lsa, uning perimetri qancha?',
        correctAnswer: '48 dm (12 + 12 + 12 + 12 = 48)',
        distractors: ['44 dm', '50 dm', '24 dm'],
        explanation: '12 + 12 + 12 + 12 = 48 dm.',
      },
      {
        text: 'Tomonlari 15 sm va 5 sm bo‘lgan to‘g‘ri to‘rtburchak perimetri nechaga teng?',
        correctAnswer: '40 sm (15 + 5 + 15 + 5 = 40)',
        distractors: ['35 sm', '45 sm', '20 sm'],
        explanation: '15 + 5 + 15 + 5 = 40 sm = 4 dm.',
      },
      {
        text: 'Milliy gilamning bo‘yi 3 m, eni 2 m. Uning perimetrini toping:',
        correctAnswer: '10 metr (3 + 2 + 3 + 2 = 10)',
        distractors: ['8 metr', '12 metr', '5 metr'],
        explanation: '3 + 2 + 3 + 2 = 10 metr.',
      },
      {
        text: 'Kvadrat perimetri 28 sm. Uning bitta tomoni qancha?',
        correctAnswer: '7 sm (7 + 7 + 7 + 7 = 28)',
        distractors: ['6 sm', '8 sm', '9 sm'],
        explanation: '7 x 4 = 28 sm.',
      },
      {
        text: 'To‘g‘ri to‘rtburchakning perimetri 20 sm. Uzunligi 7 sm bo‘lsa, eni qancha?',
        correctAnswer: '3 sm (7 + 3 + 7 + 3 = 20)',
        distractors: ['4 sm', '5 sm', '6 sm'],
        explanation: '7 + 7 = 14 sm, 20 - 14 = 6 sm, 6 ning yarmi 3 sm.',
      },
      {
        text: 'Kvadrat tomoni 10 sm bo‘lsa, perimetri necha detsimetr bo‘ladi?',
        correctAnswer: '4 dm (40 sm = 4 dm)',
        distractors: ['40 dm', '1 dm', '2 dm'],
        explanation: '10 + 10 + 10 + 10 = 40 sm = 4 dm.',
      },
      {
        text: 'To‘g‘ri to‘rtburchakning bo‘yi 9 sm, eni undan 4 sm kalta. Eni necha santimetr?',
        correctAnswer: '5 sm (9 - 4 = 5)',
        distractors: ['4 sm', '6 sm', '13 sm'],
        explanation: '9 - 4 = 5 sm.',
      },
      {
        text: 'Har qanday kvadrat to‘g‘ri to‘rtburchak hisoblanadimi?',
        correctAnswer: 'Ha, kvadrat — bu barcha tomonlari teng to‘g‘ri to‘rtburchak',
        distractors: ['Yo‘q, ular butunlay boshqa shakllar', 'Faqat aylana bilan birga', 'Faqat uchburchak bo‘lsa'],
        explanation: 'Kvadrat to‘g‘ri to‘rtburchakning xususiy (barcha tomoni teng) holidir.',
      },

      // 4 ta qiyinroq
      {
        text: 'Kvadratning tomoni 8 sm. To‘g‘ri to‘rtburchakning bo‘yi 10 sm, eni 6 sm. Qaysi shaklning perimetri katta?',
        correctAnswer: 'Ikkalasining perimetri teng (32 sm = 32 sm)',
        distractors: ['Kvadratniki katta', 'To‘g‘ri to‘rtburchakniki katta', 'Taqqoslab bo‘lmaydi'],
        explanation: 'Kvadrat: 8 x 4 = 32 sm. To‘g‘ri to‘rtburchak: 10 + 6 + 10 + 6 = 32 sm. Teng!',
      },
      {
        text: 'To‘g‘ri to‘rtburchak perimetri 34 sm. Eni 7 sm bo‘lsa, uzunligi necha santimetr?',
        correctAnswer: '10 sm (7 + 10 + 7 + 10 = 34)',
        distractors: ['9 sm', '11 sm', '12 sm'],
        explanation: '7 + 7 = 14 sm, 34 - 14 = 20 sm, 20 ning yarmi 10 sm.',
      },
      {
        text: 'Kvadrat shaklidagi ro‘molchaning tomoni 25 sm. Uning to‘rt tomoniga lenta tikish uchun necha sm lenta kerak?',
        correctAnswer: '100 sm (25 + 25 + 25 + 25 = 100 sm = 1 metr)',
        distractors: ['50 sm', '75 sm', '90 sm'],
        explanation: '25 + 25 + 25 + 25 = 100 sm = 1 metr.',
      },
      {
        text: 'Kvadratning perimetri 36 dm. Uning tomoni necha detsimetr?',
        correctAnswer: '9 dm (9 + 9 + 9 + 9 = 36)',
        distractors: ['8 dm', '10 dm', '12 dm'],
        explanation: '9 x 4 = 36 dm.',
      },

      // 2 ta murakkab masala
      {
        text: 'Mehmonxonadagi to‘g‘ri to‘rtburchak zalning uzunligi 16 metr, eni 8 metr. Zal perimetri bo‘ylab plintus qo‘yish uchun necha metr plintus kerak?',
        correctAnswer: '48 metr (16 + 8 + 16 + 8 = 48)',
        distractors: ['44 metr', '50 metr', '24 metr'],
        explanation: '16 + 8 = 24 metr, 24 + 24 = 48 metr.',
      },
      {
        text: 'Bog‘bon kvadrat shaklidagi gulzorni to‘sib chiqdi. Bitta tomoni 11 metr bo‘lsa, jami to‘siq uzunligi necha metr?',
        correctAnswer: '44 metr (11 + 11 + 11 + 11 = 44)',
        distractors: ['40 metr', '42 metr', '48 metr'],
        explanation: '11 x 4 = 44 metr.',
      },
    ],
  },

  // 120-dars. To'g'ri to'rtburchak va kvadrat (2)
  {
    bookNumber: 120,
    order: 9,
    title: 'To‘g‘ri to‘rtburchak va kvadrat (2)',
    emoji: '🛍️',
    shortDesc: 'Haqiqiy maydonlarni o‘lchash, perimetrni hisoblash va amaliy masalalar.',
    intro: 'Bozor maydoni, favvora hovuzi kabi obyektlarning perimetrini amaliy o‘lchab hisoblaymiz.',
    keyPoints: [
      'Amaliy o‘lchash: 6 sm va 3 sm li to‘g‘ri to‘rtburchak perimetri P = 18 sm.',
      'Kvadrat va to‘g‘ri to‘rtburchak farqi: kvadratning barcha tomoni teng, to‘g‘ri to‘rtburchakning faqat qarama-qarshi tomonlari teng.',
      'Perimetr bo‘yicha noma’lum tomonni topish va taqqoslash.',
    ],
    miniExample: {
      emojis: '🛍️ 6 sm va 3 sm => P = 18 sm',
      text: 'To‘g‘ri to‘rtburchakning bo‘yi 6 sm, eni 3 sm bo‘lsa: P = 6 + 3 + 6 + 3 = 18 sm.',
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 7,
    practice: [
      {
        text: 'Bo‘yi 6 sm, eni 3 sm bo‘lgan to‘g‘ri to‘rtburchak perimetri qancha?',
        correctAnswer: '18 sm (6 + 3 + 6 + 3 = 18)',
        distractors: ['15 sm', '20 sm', '9 sm'],
        explanation: '6 + 3 + 6 + 3 = 18 sm.',
      },
      {
        text: 'Bozordagi rastaning bo‘yi 4 metr, eni 2 metr. Uning perimetrini toping:',
        correctAnswer: '12 metr (4 + 2 + 4 + 2 = 12)',
        distractors: ['10 metr', '14 metr', '8 metr'],
        explanation: '4 + 2 + 4 + 2 = 12 metr.',
      },
      {
        text: 'Kvadrat favvora hovuzining har bir tomoni 5 metr. Uning perimetri qancha?',
        correctAnswer: '20 metr (5 + 5 + 5 + 5 = 20)',
        distractors: ['15 metr', '25 metr', '10 metr'],
        explanation: '5 + 5 + 5 + 5 = 20 metr.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'Bo‘yi 6 sm, eni 3 sm li to‘g‘ri to‘rtburchak perimetrini hisoblang:',
        correctAnswer: '18 sm (6 + 3 + 6 + 3 = 18)',
        distractors: ['16 sm', '20 sm', '9 sm'],
        explanation: '6 + 3 + 6 + 3 = 18 sm.',
      },
      {
        text: 'Bo‘yi 7 sm, eni 3 sm li shakl perimetri nechaga teng?',
        correctAnswer: '20 sm (7 + 3 + 7 + 3 = 20)',
        distractors: ['18 sm', '22 sm', '10 sm'],
        explanation: '7 + 3 + 7 + 3 = 20 sm = 2 dm.',
      },
      {
        text: 'Kvadrat maydonchaning tomoni 6 m. Perimetri necha metr?',
        correctAnswer: '24 metr (6 + 6 + 6 + 6 = 24)',
        distractors: ['20 metr', '26 metr', '18 metr'],
        explanation: '6 x 4 = 24 metr.',
      },
      {
        text: 'Bo‘yi 8 sm, eni 2 sm li to‘rtburchak perimetri qancha?',
        correctAnswer: '20 sm (8 + 2 + 8 + 2 = 20)',
        distractors: ['18 sm', '22 sm', '10 sm'],
        explanation: '8 + 2 + 8 + 2 = 20 sm.',
      },
      {
        text: 'Kvadratning tomoni 7 sm. Uning perimetri qancha?',
        correctAnswer: '28 sm (7 x 4 = 28)',
        distractors: ['24 sm', '30 sm', '14 sm'],
        explanation: '7 x 4 = 28 sm.',
      },
      {
        text: 'To‘g‘ri to‘rtburchakning bo‘yi 5 dm, eni 4 dm. Perimetri necha detsimetr?',
        correctAnswer: '18 dm (5 + 4 + 5 + 4 = 18)',
        distractors: ['16 dm', '20 dm', '9 dm'],
        explanation: '5 + 4 + 5 + 4 = 18 dm.',
      },

      // 8 ta o'rtacha
      {
        text: 'Toshkentdagi yangi bog‘da favvora kvadrat shaklida qurilgan, tomoni 9 m. Uning atrofini aylanib chiqish uchun necha metr yurish kerak?',
        correctAnswer: '36 metr (9 x 4 = 36)',
        distractors: ['32 metr', '40 metr', '18 metr'],
        explanation: '9 + 9 + 9 + 9 = 36 metr.',
      },
      {
        text: 'Oshxona stoli to‘g‘ri to‘rtburchak shaklida: uzunligi 12 dm, eni 8 dm. Stol perimetrini toping:',
        correctAnswer: '40 dm (12 + 8 + 12 + 8 = 40)',
        distractors: ['38 dm', '42 dm', '20 dm'],
        explanation: '12 + 8 + 12 + 8 = 40 dm = 4 m.',
      },
      {
        text: 'Kvadrat tomoni 15 sm bo‘lsa, uning perimetri necha detsimetr bo‘ladi? (1 dm = 10 sm)',
        correctAnswer: '6 dm (60 sm = 6 dm)',
        distractors: ['60 dm', '4 dm', '5 dm'],
        explanation: '15 + 15 + 15 + 15 = 60 sm = 6 dm.',
      },
      {
        text: 'To‘g‘ri to‘rtburchak perimetri 24 sm. Uzunligi 8 sm bo‘lsa, eni qancha?',
        correctAnswer: '4 sm (8 + 4 + 8 + 4 = 24)',
        distractors: ['3 sm', '5 sm', '6 sm'],
        explanation: '8 + 8 = 16 sm, 24 - 16 = 8 sm, 8 ning yarmi 4 sm.',
      },
      {
        text: 'Kvadrat perimetri 40 sm. Bitta tomoni necha santimetr?',
        correctAnswer: '10 sm (1 dm)',
        distractors: ['8 sm', '12 sm', '20 sm'],
        explanation: '40 / 4 = 10 sm = 1 dm.',
      },
      {
        text: 'Bozor pavilonining bo‘yi 25 m, eni 15 m. Pavilon perimetrini toping:',
        correctAnswer: '80 metr (25 + 15 + 25 + 15 = 80)',
        distractors: ['70 metr', '90 metr', '40 metr'],
        explanation: '25 + 15 = 40 m, 40 + 40 = 80 metr.',
      },
      {
        text: 'Daftar muqovasi 20 sm va 15 sm. Muqova perimetrini hisoblang:',
        correctAnswer: '70 sm (20 + 15 + 20 + 15 = 70)',
        distractors: ['65 sm', '75 sm', '35 sm'],
        explanation: '20 + 15 + 20 + 15 = 70 sm = 7 dm.',
      },
      {
        text: 'Tomoni 8 dm bo‘lgan kvadrat perimetri nechaga teng?',
        correctAnswer: '32 dm (8 x 4 = 32)',
        distractors: ['30 dm', '34 dm', '16 dm'],
        explanation: '8 x 4 = 32 dm.',
      },

      // 4 ta qiyinroq
      {
        text: 'To‘g‘ri to‘rtburchak perimetri 50 sm. Eni 10 sm bo‘lsa, bo‘yi necha santimetr?',
        correctAnswer: '15 sm (10 + 15 + 10 + 15 = 50)',
        distractors: ['12 sm', '16 sm', '20 sm'],
        explanation: '10 + 10 = 20 sm, 50 - 20 = 30 sm, 30 ning yarmi 15 sm.',
      },
      {
        text: 'Kvadrat va to‘g‘ri to‘rtburchakning perimetri teng: P = 28 sm. To‘g‘ri to‘rtburchakning eni 4 sm bo‘lsa, kvadratning tomoni uning enidan necha sm uzun?',
        correctAnswer: '3 sm uzun (Kvadrat tomoni 7 sm; 7 - 4 = 3)',
        distractors: ['2 sm', '4 sm', '5 sm'],
        explanation: 'Kvadrat tomoni: 28 / 4 = 7 sm. Farq: 7 - 4 = 3 sm.',
      },
      {
        text: 'Tomoni 12 m bo‘lgan kvadrat maydon atrofiga har 4 metrda ustun o‘rnatildi. Jami nechta ustun kerak? (P = 48 m)',
        correctAnswer: '12 ta ustun (48 / 4 = 12)',
        distractors: ['10 ta', '14 ta', '16 ta'],
        explanation: 'Maydon perimetri: 12 x 4 = 48 metr. 48 / 4 = 12 ta ustun.',
      },
      {
        text: 'To‘g‘ri to‘rtburchak shaklidagi sport zali bo‘yi 22 m, eni 18 m. Zal perimetri qancha?',
        correctAnswer: '80 metr (22 + 18 + 22 + 18 = 80)',
        distractors: ['75 metr', '85 metr', '40 metr'],
        explanation: '22 + 18 = 40 m, 40 + 40 = 80 metr.',
      },

      // 2 ta murakkab masala
      {
        text: 'Akromjon kvadrat shaklidagi qum maydonchasi atrofini 3 marta aylanib chiqdi. Maydoncha tomoni 5 metr bo‘lsa, Akromjon jami necha metr yugurgan?',
        correctAnswer: '60 metr (1 aylanish: 20 m; 3 x 20 = 60)',
        distractors: ['50 metr', '70 metr', '45 metr'],
        explanation: '1 aylanish: 5 x 4 = 20 m. 3 marta: 20 x 3 = 60 metr.',
      },
      {
        text: 'Fermer to‘g‘ri to‘rtburchak shaklidagi poliz ekinzorining atrofiga sim to‘r tortdi: bo‘yi 30 m, eni 20 m. Agar darvoza uchun 4 metr ochiq qoldirilgan bo‘lsa, necha metr sim to‘r ishlatilgan?',
        correctAnswer: '96 metr (Perimetr: 100 m; 100 - 4 = 96)',
        distractors: ['100 metr', '94 metr', '90 metr'],
        explanation: 'Perimetr: 30 + 20 + 30 + 20 = 100 m. Darvoza chiqarilsa: 100 - 4 = 96 metr.',
      },
    ],
  },

  // 121-dars. Burchak
  {
    bookNumber: 121,
    order: 10,
    title: 'Burchak',
    emoji: '📐',
    shortDesc: 'Burchak turlari: to‘g‘ri, o‘tkir va o‘tmas burchaklar hamda nur tushunchasi.',
    intro: 'Bir nuqtadan chiquvchi ikkita nur burchak hosil qiladi: to‘g‘ri, o‘tkir va o‘tmas burchaklar mavjud.',
    keyPoints: [
      'Boshi bor, lekin oxiri yo‘q to‘g‘ri chiziq nur deb ataladi.',
      'To‘g‘ri burchak — kvadrat yoki kitob burchagiga o‘xshaydi.',
      'O‘tkir burchak to‘g‘ri burchakdan kichik, o‘tmas burchak esa to‘g‘ri burchakdan katta bo‘ladi.',
    ],
    miniExample: {
      emojis: '📐 To‘g‘ri burchak |_ , O‘tkir burchak /_ , O‘tmas burchak \\_',
      text: 'To‘g‘ri burchak — chizg‘ich burchagi. Undan kichigi o‘tkir, kattasi o‘tmas burchakdir.',
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 7,
    practice: [
      {
        text: 'To‘g‘ri burchakdan kichik bo‘lgan burchak qanday ataladi?',
        correctAnswer: 'O‘tkir burchak',
        distractors: ['O‘tmas burchak', 'To‘g‘ri burchak', 'Yoyiq burchak'],
        explanation: 'To‘g‘ri burchakdan kichik burchak o‘tkir burchak deyiladi.',
      },
      {
        text: 'Boshi bor, lekin oxiri yo‘q chiziq nima deb ataladi?',
        correctAnswer: 'Nur',
        distractors: ['Kesma', 'Siniq chiziq', 'Aylana'],
        explanation: 'Bir nuqtadan boshlanib cheksiz davom etuvchi to‘g‘ri chiziq nur deyiladi.',
      },
      {
        text: 'Kitob yoki daftarning burchagi qanday burchak hisoblanadi?',
        correctAnswer: 'To‘g‘ri burchak',
        distractors: ['O‘tkir burchak', 'O‘tmas burchak', 'Dumaloq burchak'],
        explanation: 'Kitob va daftar burchaklari to‘g‘ri burchakdir.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'To‘g‘ri chiziqning boshi bor, lekin oxiri yo‘q qismi nima deyiladi?',
        correctAnswer: 'Nur',
        distractors: ['Kesma', 'Siniq chiziq', 'Nuqta'],
        explanation: 'Boshi bor, oxiri yo‘q chiziq nur deyiladi.',
      },
      {
        text: 'Burchak qanday hosil bo‘ladi?',
        correctAnswer: 'Bitta nuqtadan chiquvchi ikkita nurdan',
        distractors: ['Ikkita parallel chiziqdan', 'Bitta doiradan', 'Uchta nuqtadan'],
        explanation: 'Bitta umumiy nuqtadan chiquvchi ikkita nur burchak hosil qiladi.',
      },
      {
        text: 'To‘g‘ri burchakdan katta bo‘lgan burchak qanday ataladi?',
        correctAnswer: 'O‘tmas burchak',
        distractors: ['O‘tkir burchak', 'To‘g‘ri burchak', 'Kichik burchak'],
        explanation: 'To‘g‘ri burchakdan kattasi o‘tmas burchak deyiladi.',
      },
      {
        text: 'To‘g‘ri burchakdan kichik bo‘lgan burchak qaysi?',
        correctAnswer: 'O‘tkir burchak',
        distractors: ['O‘tmas burchak', 'Katta burchak', 'Yassi burchak'],
        explanation: 'To‘g‘ri burchakdan kichigi o‘tkir burchak deyiladi.',
      },
      {
        text: 'Kvadratda nechta to‘g‘ri burchak bor?',
        correctAnswer: '4 ta to‘g‘ri burchak',
        distractors: ['3 ta', '2 ta', '5 ta'],
        explanation: 'Kvadratning barcha 4 ta burchagi to‘g‘ri burchakdir.',
      },
      {
        text: 'To‘g‘ri to‘rtburchakda nechta to‘g‘ri burchak bor?',
        correctAnswer: '4 ta to‘g‘ri burchak',
        distractors: ['2 ta', '3 ta', '5 ta'],
        explanation: 'To‘g‘ri to‘rtburchakda 4 ta to‘g‘ri burchak bor.',
      },

      // 8 ta o'rtacha
      {
        text: 'Soat millari roppa-rosa soat 3:00 ni ko‘rsatganda ular orasida qanday burchak hosil bo‘ladi?',
        correctAnswer: 'To‘g‘ri burchak',
        distractors: ['O‘tkir burchak', 'O‘tmas burchak', 'Burchak hosil bo‘lmaydi'],
        explanation: 'Soat 3:00 da soat va minut millari to‘g‘ri burchak (90 gradus) hosil qiladi.',
      },
      {
        text: 'Soat millari 2:00 ni ko‘rsatganda ular orasida qanday burchak bo‘ladi?',
        correctAnswer: 'O‘tkir burchak (to‘g‘ri burchakdan kichik)',
        distractors: ['To‘g‘ri burchak', 'O‘tmas burchak', 'Yoyiq burchak'],
        explanation: '2:00 da millar orasi 3:00 dan kichik, demak o‘tkir burchak.',
      },
      {
        text: 'Soat millari 4:00 ni ko‘rsatganda ular orasida qanday burchak bo‘ladi?',
        correctAnswer: 'O‘tmas burchak (to‘g‘ri burchakdan katta)',
        distractors: ['To‘g‘ri burchak', 'O‘tkir burchak', 'Yassi burchak'],
        explanation: '4:00 da millar orasi 3:00 dan katta, demak o‘tmas burchak.',
      },
      {
        text: 'Qaychi birozgina ochilganda uning tig‘lari qanday burchak hosil qiladi?',
        correctAnswer: 'O‘tkir burchak',
        distractors: ['O‘tmas burchak', 'Dumaloq burchak', 'To‘g‘ri burchak'],
        explanation: 'Kichik ochilgan qaychi o‘tkir burchak hosil qiladi.',
      },
      {
        text: 'Uchburchakda eng ko‘pi bilan nechta to‘g‘ri burchak bo‘lishi mumkin?',
        correctAnswer: 'Faqat 1 ta to‘g‘ri burchak',
        distractors: ['2 ta', '3 ta', '4 ta'],
        explanation: 'Uchburchakda faqat 1 ta to‘g‘ri burchak bo‘lishi mumkin.',
      },
      {
        text: 'Burchakning uchidan chiquvchi nurlar nima deb ataladi?',
        correctAnswer: 'Burchakning tomonlari',
        distractors: ['Burchakning markazi', 'Perimetr', 'Siniq chiziq'],
        explanation: 'Burchakni hosil qiluvchi nurlar uning tomonlari deyiladi.',
      },
      {
        text: 'To‘g‘ri to‘rtburchak shaklidagi partada nechta burchak bor?',
        correctAnswer: '4 ta burchak',
        distractors: ['3 ta', '5 ta', '6 ta'],
        explanation: 'To‘rtburchakda 4 ta burchak bor.',
      },
      {
        text: 'Ochiq eshik devor bilan qanday burchak hosil qilishi mumkin?',
        correctAnswer: 'O‘tkir, to‘g‘ri yoki o‘tmas burchak',
        distractors: ['Faqat doira', 'Faqat kesma', 'Burchak hosil qilmaydi'],
        explanation: 'Eshikning ochilish darajasiga qarab o‘tkir, to‘g‘ri yoki o‘tmas burchak bo‘ladi.',
      },

      // 4 ta qiyinroq
      {
        text: 'To‘g‘ri burchakli uchburchakda 1 ta to‘g‘ri burchak va 2 ta ... burchak bo‘ladi:',
        correctAnswer: 'O‘tkir burchak',
        distractors: ['O‘tmas burchak', 'To‘g‘ri burchak', 'Yoyiq burchak'],
        explanation: 'Qolgan 2 ta burchak har doim o‘tkir burchak bo‘ladi.',
      },
      {
        text: 'Romb shaklida qanday burchaklar bo‘ladi?',
        correctAnswer: '2 ta o‘tkir va 2 ta o‘tmas burchak',
        distractors: ['Barchasi to‘g‘ri burchak', 'Faqat o‘tkir burchaklar', 'Burchaklari yo‘q'],
        explanation: 'Oddiy rombda 2 ta o‘tkir va 2 ta o‘tmas burchak bo‘ladi.',
      },
      {
        text: 'Quyidagi ifodani hisoblang va natijasi burchaklar soni bilan bog‘liq bo‘lsin: 15 - (7 + 4)',
        correctAnswer: '4 (to‘rtburchak burchaklari soni)',
        distractors: ['3 (uchburchak)', '5 (beshburchak)', '6'],
        explanation: '7 + 4 = 11, 15 - 11 = 4 ta burchak.',
      },
      {
        text: 'Uchburchakda 1 ta o‘tmas burchak bo‘lsa, qolgan 2 ta burchak qanday bo‘ladi?',
        correctAnswer: 'Ikkalasi ham o‘tkir burchak',
        distractors: ['To‘g‘ri burchaklar', 'O‘tmas burchaklar', 'Burchak bo‘lmaydi'],
        explanation: 'Uchburchakda faqat 1 ta o‘tmas burchak bo‘lishi mumkin, qolgani o‘tkir bo‘ladi.',
      },

      // 2 ta murakkab masala
      {
        text: 'Sinfdagi 5 ta to‘rtburchak va 4 ta uchburchak shakllarida jami nechta to‘g‘ri burchak bo‘lishi mumkin, agar har bir uchburchak to‘g‘ri burchakli bo‘lsa?',
        correctAnswer: '24 ta (5 x 4 = 20; 4 x 1 = 4; 20 + 4 = 24)',
        distractors: ['20 ta', '22 ta', '26 ta'],
        explanation: '5 ta to‘rtburchakda: 5 x 4 = 20 ta. 4 ta uchburchakda: 4 x 1 = 4 ta. Jami: 20 + 4 = 24 ta.',
      },
      {
        text: 'Arxitektor Samarqand darvozasining peshtoq chizmasida 2 ta to‘g‘ri burchak, 4 ta o‘tkir burchak va 2 ta o‘tmas burchak chizdi. Chizmada jami nechta burchak bor?',
        correctAnswer: '8 ta burchak (2 + 4 + 2 = 8)',
        distractors: ['6 ta', '10 ta', '7 ta'],
        explanation: '2 + 4 + 2 = 8 ta burchak.',
      },
    ],
  },

  // 122-dars. To'rtburchaklar
  {
    bookNumber: 122,
    order: 11,
    title: 'To‘rtburchaklar',
    emoji: '🎭',
    shortDesc: 'To‘rtburchaklar oilasi: kvadrat, to‘g‘ri to‘rtburchak, romb va ularning belgilari.',
    intro: 'Bir-biri bilan tutashtirilgan 4 ta kesma (tomon) va 4 ta nuqta (uch)dan iborat yopiq shakl to‘rtburchak deyiladi.',
    keyPoints: [
      'To‘rtburchak 4 ta tomon, 4 ta uch va 4 ta burchakdan iborat.',
      'To‘rtburchak turlari: to‘g‘ri to‘rtburchak, kvadrat, romb.',
      'Rombning barcha 4 ta tomoni teng bo‘ladi, lekin burchaklari to‘g‘ri bo‘lmasligi mumkin.',
    ],
    miniExample: {
      emojis: '🎭 Kvadrat, to‘g‘ri to‘rtburchak, romb',
      text: 'Bularning barchasi 4 ta tomonga ega bo‘lgani uchun to‘rtburchaklar oilasiga kiradi.',
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 7,
    practice: [
      {
        text: 'To‘rtburchakning nechta tomoni va nechta burchagi bor?',
        correctAnswer: '4 ta tomoni va 4 ta burchagi',
        distractors: ['3 ta tomoni va 3 ta burchagi', '5 ta tomoni va 5 ta burchagi', '4 ta tomoni va 2 ta burchagi'],
        explanation: 'To‘rtburchakda 4 ta tomon va 4 ta burchak bo‘ladi.',
      },
      {
        text: 'Quyidagilardan qaysi biri to‘rtburchaklar oilasiga kiradi?',
        correctAnswer: 'To‘g‘ri to‘rtburchak, kvadrat va romb',
        distractors: ['Uchburchak va doira', 'Faqat aylana', 'Beshburchak va nur'],
        explanation: 'Bularning barchasi 4 ta tomonga ega to‘rtburchaklardir.',
      },
      {
        text: 'Rombning barcha tomonlari qanday bo‘ladi?',
        correctAnswer: 'O‘zaro teng bo‘ladi',
        distractors: ['Har xil bo‘ladi', 'Faqat 2 tasi teng bo‘ladi', 'Tomonlari bo‘lmaydi'],
        explanation: 'Rombning barcha 4 ta tomoni teng bo‘ladi.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'To‘rtburchakning nechta uchi bor?',
        correctAnswer: '4 ta uchi',
        distractors: ['3 ta uchi', '5 ta uchi', '6 ta uchi'],
        explanation: 'To‘rtburchakda 4 ta uch bor.',
      },
      {
        text: 'Quyidagi shakllardan qaysi biri to‘rtburchak?',
        correctAnswer: 'Kvadrat 🟦',
        distractors: ['Uchburchak 🔺', 'Doira ⭕', 'Beshburchak ⬟'],
        explanation: 'Kvadrat 4 ta tomonli shakl — to‘rtburchakdir.',
      },
      {
        text: 'Barcha tomonlari teng bo‘lgan to‘rtburchaklar qaysilar?',
        correctAnswer: 'Kvadrat va romb',
        distractors: ['Faqat to‘g‘ri to‘rtburchak', 'Uchburchak va kvadrat', 'Trapetsiya va doira'],
        explanation: 'Kvadrat va rombning barcha 4 ta tomoni teng bo‘ladi.',
      },
      {
        text: 'Rombning nechta tomoni bor?',
        correctAnswer: '4 ta tomoni',
        distractors: ['3 ta', '5 ta', '6 ta'],
        explanation: 'Romb to‘rtburchak bo‘lib, 4 ta tomonga ega.',
      },
      {
        text: 'Tomonlari 5 sm bo‘lgan rombning perimetrini hisoblang:',
        correctAnswer: '20 sm (5 + 5 + 5 + 5 = 20)',
        distractors: ['15 sm', '25 sm', '10 sm'],
        explanation: '5 + 5 + 5 + 5 = 20 sm.',
      },
      {
        text: 'To‘rtburchakda nechta qarama-qarshi tomonlar juftligi bor?',
        correctAnswer: '2 juft (2 ta qarama-qarshi tomonlar jufti)',
        distractors: ['1 juft', '3 juft', '4 juft'],
        explanation: 'To‘rtburchakda 2 juft qarama-qarshi tomonlar bo‘ladi.',
      },

      // 8 ta o'rtacha
      {
        text: 'Kvadrat bilan rombning asosiy o‘xshashligi nimada?',
        correctAnswer: 'Ikkalasining ham barcha 4 ta tomoni teng',
        distractors: ['Ikkalasining ham 3 ta tomoni bor', 'Ikkalasi ham doira shaklida', 'Burchaklari yo‘q'],
        explanation: 'Kvadrat va rombning barcha tomonlari o‘zaro tengdir.',
      },
      {
        text: 'Kvadrat bilan oddiy rombning asosiy farqi nimada?',
        correctAnswer: 'Kvadratning barcha burchaklari to‘g‘ri, rombda esa o‘tkir va o‘tmas burchaklar bo‘ladi',
        distractors: ['Rombning 5 ta tomoni bor', 'Kvadratning 3 ta tomoni bor', 'Ular bir xil shakl'],
        explanation: 'Kvadratda hamma burchak to‘g‘ri (90°), rombda esa o‘tkir va o‘tmas burchaklar bo‘ladi.',
      },
      {
        text: 'Rombning tomoni 8 sm. Uning perimetrini toping:',
        correctAnswer: '32 sm (8 x 4 = 32)',
        distractors: ['24 sm', '30 sm', '16 sm'],
        explanation: '8 + 8 + 8 + 8 = 32 sm.',
      },
      {
        text: 'Tomonlari 6 sm va 4 sm bo‘lgan to‘g‘ri to‘rtburchak perimetri qancha?',
        correctAnswer: '20 sm (6 + 4 + 6 + 4 = 20)',
        distractors: ['18 sm', '22 sm', '24 sm'],
        explanation: '6 + 4 + 6 + 4 = 20 sm = 2 dm.',
      },
      {
        text: 'Quyidagi shakllardan ortiqchasini toping: Kvadrat, To‘g‘ri to‘rtburchak, Romb, Uchburchak',
        correctAnswer: 'Uchburchak (uning 3 ta tomoni bor, qolganlari to‘rtburchak)',
        distractors: ['Kvadrat', 'To‘g‘ri to‘rtburchak', 'Romb'],
        explanation: 'Uchburchak 3 tomonli, qolgan uchtasi esa to‘rtburchakdir.',
      },
      {
        text: 'Romb perimetri 28 sm bo‘lsa, uning bitta tomoni necha santimetr?',
        correctAnswer: '7 sm (7 x 4 = 28)',
        distractors: ['6 sm', '8 sm', '9 sm'],
        explanation: '28 / 4 = 7 sm.',
      },
      {
        text: 'Bir varaq qog‘ozda 3 ta to‘rtburchak bor. Ularning jami uchlari nechta?',
        correctAnswer: '12 ta (3 x 4 = 12)',
        distractors: ['10 ta', '14 ta', '16 ta'],
        explanation: '3 x 4 = 12 ta uch.',
      },
      {
        text: 'To‘g‘ri to‘rtburchakning bo‘yi 11 sm, eni 9 sm. Perimetrini hisoblang:',
        correctAnswer: '40 sm (11 + 9 + 11 + 9 = 40)',
        distractors: ['38 sm', '42 sm', '20 sm'],
        explanation: '11 + 9 = 20 sm, 20 + 20 = 40 sm.',
      },

      // 4 ta qiyinroq
      {
        text: 'Rombning perimetri 36 dm. Uning bitta tomoni necha detsimetr?',
        correctAnswer: '9 dm (9 + 9 + 9 + 9 = 36)',
        distractors: ['8 dm', '10 dm', '12 dm'],
        explanation: '36 / 4 = 9 dm.',
      },
      {
        text: 'Ikkita teng kvadrat yonma-yon qo‘yilsa, qanday shakl hosil bo‘ladi?',
        correctAnswer: 'To‘g‘ri to‘rtburchak',
        distractors: ['Yana bitta kvadrat', 'Uchburchak', 'Doira'],
        explanation: 'Ikkita teng kvadrat birlashsa bo‘yi enidan 2 barobar uzun to‘g‘ri to‘rtburchak hosil bo‘ladi.',
      },
      {
        text: 'Tomoni 5 sm bo‘lgan ikkita kvadrat yonma-yon qo‘yilib to‘g‘ri to‘rtburchak yasaldi. Yangi to‘rtburchak perimetri qancha?',
        correctAnswer: '30 sm (Bo‘yi 10 sm, eni 5 sm; 10 + 5 + 10 + 5 = 30)',
        distractors: ['40 sm', '25 sm', '35 sm'],
        explanation: 'Bo‘yi: 5 + 5 = 10 sm, eni: 5 sm. Perimetr: 10 + 5 + 10 + 5 = 30 sm.',
      },
      {
        text: 'Romb va to‘g‘ri to‘rtburchakning perimetrlari teng: P = 24 sm. To‘g‘ri to‘rtburchak bo‘yi 7 sm bo‘lsa, romb tomoni to‘rtburchak enidan necha sm katta?',
        correctAnswer: '1 sm katta (Romb tomoni 6 sm, to‘rtburchak eni 5 sm; 6 - 5 = 1)',
        distractors: ['2 sm', '3 sm', 'Teng'],
        explanation: 'Romb tomoni: 24 / 4 = 6 sm. To‘g‘ri to‘rtburchak eni: (24 - 14) / 2 = 5 sm. Farq: 6 - 5 = 1 sm.',
      },

      // 2 ta murakkab masala
      {
        text: 'Usta milliy naqsh uchun 4 ta bir xil romb shaklidagi yog‘och tayyorladi. Har bir romb tomoni 10 sm. To‘rtta rombning hamma tomonlari yig‘indisi necha santimetr?',
        correctAnswer: '160 sm (Har biri: 40 sm; 40 x 4 = 160 sm = 16 dm)',
        distractors: ['140 sm', '150 sm', '180 sm'],
        explanation: '1 ta romb perimetri: 10 x 4 = 40 sm. 4 ta romb: 40 x 4 = 160 sm.',
      },
      {
        text: 'Navro‘z bayramida maydonga kvadrat va to‘g‘ri to‘rtburchak shaklidagi ikkita sahna o‘rnatildi. Kvadrat sahna tomoni 8 metr, to‘g‘ri to‘rtburchak sahna bo‘yi 10 m, eni 6 m. Ikkala sahna perimetrlari yig‘indisi necha metr?',
        correctAnswer: '64 metr (Kvadrat: 32 m; To‘rtburchak: 32 m; 32 + 32 = 64)',
        distractors: ['60 metr', '62 metr', '68 metr'],
        explanation: 'Kvadrat: 8 x 4 = 32 m. To‘g‘ri to‘rtburchak: 10 + 6 + 10 + 6 = 32 m. Jami: 32 + 32 = 64 metr.',
      },
    ],
  },
];

console.log('Generating Part 4 Chapter 2A lessons (116-122)...');
for (const lessonDef of lessonsPart4Ch2A) {
  const seed = buildLessonSeed(lessonDef);
  saveLessonFile(4, lessonDef.bookNumber, seed, false);
  console.log(`✅ Saved lesson-${lessonDef.bookNumber}.json`);
}
