import { LessonDataDef, buildLessonSeed, saveLessonFile } from './generatorTypes.js';

const lessonsPart4Ch1: LessonDataDef[] = [
  // 112-dars. Kesma va uning uzunligi
  {
    bookNumber: 112,
    order: 1,
    title: 'Kesma va uning uzunligi',
    emoji: '📏',
    shortDesc: 'Kesma uzunligini santimetr (sm) va detsimetrlarda (dm) o‘lchash hamda yozish.',
    intro: 'Kesmaning ikki uchi bo‘lib, uning uzunligi santimetr (sm) va detsimetrlarda (dm) o‘lchanadi.',
    keyPoints: [
      'Kesma ikki nuqtani tutashtiruvchi to‘g‘ri chiziq bo‘lagidir: masalan AB = 5 sm.',
      '1 dm = 10 sm. 10 ta santimetr 1 detsimetrni tashkil qiladi.',
      'Kesmalar uzunligini qo‘shish va taqqoslash mumkin: 6 sm + 4 sm = 10 sm = 1 dm.',
    ],
    miniExample: {
      emojis: '📏 AB = 5 sm, CD = 3 sm',
      text: 'AB kesma 5 sm, CD kesma 3 sm. Ikkala kesma yig‘indisi: 5 + 3 = 8 sm.',
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 7,
    practice: [
      {
        text: 'Kesmaning nechta uchi bor?',
        correctAnswer: '2 ta uchi bor',
        distractors: ['1 ta uchi bor', 'Uchi yo‘q', '4 ta uchi bor'],
        explanation: 'Kesma ikki tomondan nuqtalar bilan chegaralangan, ya’ni 2 ta uchi bor.',
      },
      {
        text: '1 detsimetr necha santimetrga teng?',
        correctAnswer: '10 sm',
        distractors: ['100 sm', '1 sm', '5 sm'],
        explanation: '1 dm = 10 sm.',
      },
      {
        text: 'AB kesma 6 sm, BC kesma 4 sm. Ularning yig‘indisi necha santimetr?',
        correctAnswer: '10 sm (6 + 4 = 10)',
        distractors: ['8 sm', '12 sm', '2 sm'],
        explanation: '6 + 4 = 10 sm.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'Kesma nima?',
        correctAnswer: 'Ikki nuqta bilan chegaralangan to‘g‘ri chiziq bo‘lagi',
        distractors: ['Boshi bor, lekin oxiri yo‘q chiziq', 'Cheksiz to‘g‘ri chiziq', 'Aylana chizig‘i'],
        explanation: 'Kesma ikki nuqta bilan chegaralangan to‘g‘ri chiziq bo‘lagidir.',
      },
      {
        text: 'Kesma uzunligi qaysi asbob yordamida o‘lchanadi?',
        correctAnswer: 'Chizg‘ich',
        distractors: ['Tarozi', 'Soat', 'Termometr'],
        explanation: 'Kesma va masofalar chizg‘ich yordamida o‘lchanadi.',
      },
      {
        text: '1 dm necha santimetrga teng?',
        correctAnswer: '10 sm',
        distractors: ['1 sm', '20 sm', '100 sm'],
        explanation: '1 dm = 10 sm.',
      },
      {
        text: '20 sm necha detsimetrga teng?',
        correctAnswer: '2 dm',
        distractors: ['1 dm', '20 dm', '10 dm'],
        explanation: '20 sm = 2 dm.',
      },
      {
        text: 'AB = 7 sm va CD = 5 sm kesmalardan qaysi biri uzunroq?',
        correctAnswer: 'AB kesma (7 sm > 5 sm)',
        distractors: ['CD kesma', 'Ikkalasi teng', 'Taqqoslab bo‘lmaydi'],
        explanation: '7 sm 5 sm dan katta, demak AB kesma uzunroq.',
      },
      {
        text: '3 sm va 5 sm uzunlikdagi kesmalar yig‘indisini toping:',
        correctAnswer: '8 sm (3 + 5 = 8)',
        distractors: ['7 sm', '9 sm', '2 sm'],
        explanation: '3 + 5 = 8 sm.',
      },

      // 8 ta o'rtacha
      {
        text: 'AB kesma uzunligi 8 sm, CD kesma esa 1 dm. Qaysi kesma qisqaroq? (1 dm = 10 sm)',
        correctAnswer: 'AB kesma (8 sm < 10 sm)',
        distractors: ['CD kesma', 'Ikkalasi teng', 'Taqqoslab bo‘lmaydi'],
        explanation: '1 dm = 10 sm. 8 sm < 10 sm, demak AB kesma qisqaroq.',
      },
      {
        text: '1 dm 4 sm necha santimetr bo‘ladi?',
        correctAnswer: '14 sm (10 + 4 = 14)',
        distractors: ['10 sm', '15 sm', '40 sm'],
        explanation: '1 dm = 10 sm, 10 + 4 = 14 sm.',
      },
      {
        text: '25 sm kesmani detsimetr va santimetrlarga ajrating:',
        correctAnswer: '2 dm 5 sm',
        distractors: ['5 dm 2 sm', '2 dm 0 sm', '25 dm'],
        explanation: '25 sm = 20 sm + 5 sm = 2 dm 5 sm.',
      },
      {
        text: 'Qizil kesma 12 sm, ko‘k kesma undan 4 sm qisqa. Ko‘k kesma uzunligi qancha?',
        correctAnswer: '8 sm (12 - 4 = 8)',
        distractors: ['16 sm', '7 sm', '9 sm'],
        explanation: '12 - 4 = 8 sm.',
      },
      {
        text: 'Yashil tasma 9 sm, sariq tasma 7 sm. Ikkala tasma birgalikda necha santimetr?',
        correctAnswer: '16 sm (9 + 7 = 16)',
        distractors: ['15 sm', '17 sm', '2 sm'],
        explanation: '9 + 7 = 16 sm.',
      },
      {
        text: 'Daftardagi kesma 1 dm ga teng. Bu necha santimetr?',
        correctAnswer: '10 sm',
        distractors: ['100 sm', '5 sm', '1 sm'],
        explanation: '1 dm = 10 sm.',
      },
      {
        text: 'Kesmaning birinchi bo‘lagi 6 sm, ikkinchi bo‘lagi 7 sm. Butun kesma necha santimetr?',
        correctAnswer: '13 sm (6 + 7 = 13)',
        distractors: ['12 sm', '14 sm', '1 sm'],
        explanation: '6 + 7 = 13 sm.',
      },
      {
        text: 'Taqqoslang: 1 dm 2 sm va 15 sm',
        correctAnswer: '1 dm 2 sm < 15 sm (12 sm < 15 sm)',
        distractors: ['1 dm 2 sm > 15 sm', '1 dm 2 sm = 15 sm', 'Taqqoslab bo‘lmaydi'],
        explanation: '1 dm 2 sm = 12 sm. 12 sm < 15 sm.',
      },

      // 4 ta qiyinroq
      {
        text: 'Samarqanddagi Registon maydoni maketida yo‘lakcha 18 sm qilib chizilgan. Uni dm va sm da yozing:',
        correctAnswer: '1 dm 8 sm',
        distractors: ['8 dm 1 sm', '2 dm', '18 dm'],
        explanation: '18 sm = 10 sm + 8 sm = 1 dm 8 sm.',
      },
      {
        text: 'AB kesma 14 sm. Unda C nuqta belgilandi. Agar AC = 6 sm bo‘lsa, CB kesma necha santimetr?',
        correctAnswer: '8 sm (14 - 6 = 8)',
        distractors: ['7 sm', '9 sm', '20 sm'],
        explanation: 'CB = AB - AC = 14 - 6 = 8 sm.',
      },
      {
        text: 'Uchta kesmaning uzunliklari: 4 sm, 6 sm va 10 sm. Jami uzunlik necha detsimetr bo‘ladi?',
        correctAnswer: '2 dm (20 sm = 2 dm)',
        distractors: ['1 dm', '3 dm', '20 dm'],
        explanation: '4 + 6 + 10 = 20 sm = 2 dm.',
      },
      {
        text: 'Birinchi kesma 11 sm, ikkinchisi undan 3 sm uzun. Ikkinchi kesma necha santimetr?',
        correctAnswer: '14 sm (11 + 3 = 14)',
        distractors: ['8 sm', '13 sm', '15 sm'],
        explanation: '11 + 3 = 14 sm.',
      },

      // 2 ta murakkab masala
      {
        text: 'Anvar 15 sm uzunlikdagi ipdan 7 sm qirqib oldi. Qolgan ipga 4 sm yangi ip uladi. Ipning hozirgi uzunligi necha santimetr?',
        correctAnswer: '12 sm (15 - 7 + 4 = 12)',
        distractors: ['11 sm', '13 sm', '10 sm'],
        explanation: '15 - 7 = 8 sm, 8 + 4 = 12 sm.',
      },
      {
        text: 'To‘g‘ri chiziqda ketma-ket uchta kesma joylashgan: AB = 5 sm, BC = 8 sm, CD = 7 sm. AD kesmaning umumiy uzunligi qancha?',
        correctAnswer: '20 sm (5 + 8 + 7 = 20 sm = 2 dm)',
        distractors: ['18 sm', '19 sm', '22 sm'],
        explanation: '5 + 8 + 7 = 20 sm.',
      },
    ],
  },

  // 113-dars. Berilgan uzunlikda kesma chizish
  {
    bookNumber: 113,
    order: 2,
    title: 'Berilgan uzunlikda kesma chizish',
    emoji: '✏️',
    shortDesc: 'Chizg‘ich yordamida berilgan o‘lchamda aniq kesma chizish tartibi.',
    intro: 'Kesma chizish 0 nuqtadan boshlanadi va kerakli santimetrgacha to‘g‘ri chiziq tortiladi.',
    keyPoints: [
      'Chizish tartibi: 1) boshlang‘ich nuqta qo‘yish, 2) chizg‘ich 0 belgisini qo‘yish, 3) ikkinchi nuqtani belgilash, 4) tutashtirish.',
      'O‘lchash har doim chizg‘ichning 0 belgisidan boshlanadi.',
      'Uzunlikni xonalarga yoyish: 32 sm = 30 sm + 2 sm.',
    ],
    miniExample: {
      emojis: '✏️ 0 dan 7 gacha: 7 sm li kesma',
      text: 'Daftarga 0 dan boshlab 7 sm gacha chiziq tortsak, uzunligi 7 sm bo‘lgan kesma hosil bo‘ladi.',
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 7,
    practice: [
      {
        text: 'Kesma chizishda chizg‘ichning qaysi belgisidan boshlanadi?',
        correctAnswer: '0 belgisidan',
        distractors: ['1 belgisidan', 'Chekkasidan', 'Xohlagan joyidan'],
        explanation: 'Kesma o‘lchash va chizish doimo 0 belgisidan boshlanadi.',
      },
      {
        text: '32 sm uzunlikni o‘nlik va birliklarga ajrating:',
        correctAnswer: '30 sm + 2 sm',
        distractors: ['3 sm + 2 sm', '20 sm + 3 sm', '30 sm + 20 sm'],
        explanation: '32 sm = 30 sm + 2 sm.',
      },
      {
        text: 'AB = 27 sm. BC kesma undan 6 sm qisqa bo‘lsa, BC kesma necha santimetr?',
        correctAnswer: '21 sm (27 - 6 = 21)',
        distractors: ['20 sm', '22 sm', '33 sm'],
        explanation: '27 - 6 = 21 sm.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'Chizg‘ichda kesma chizishni qaysi raqamdan boshlaymiz?',
        correctAnswer: '0 raqamidan',
        distractors: ['1 raqamidan', '5 raqamidan', '10 raqamidan'],
        explanation: 'Kesma chizish chizg‘ichning 0 belgisidan boshlanadi.',
      },
      {
        text: 'Berilgan uzunlikdagi kesma chizishning 1-bosqichi nima?',
        correctAnswer: 'Boshlang‘ich nuqta qo‘yish',
        distractors: ['Chiziqni bo‘yash', 'Nuqtalarni o‘chirish', 'Daftarni yopish'],
        explanation: 'Avval boshlang‘ich nuqta belgilanadi.',
      },
      {
        text: '45 sm ni xona birliklariga yoying:',
        correctAnswer: '40 sm + 5 sm',
        distractors: ['4 sm + 5 sm', '40 sm + 50 sm', '30 sm + 15 sm'],
        explanation: '45 sm = 40 sm + 5 sm.',
      },
      {
        text: 'Daftarga 6 sm li kesma chizish uchun 0 dan necha sm gacha chizamiz?',
        correctAnswer: '6 sm gacha',
        distractors: ['5 sm gacha', '7 sm gacha', '10 sm gacha'],
        explanation: '6 sm li kesma uchun 0 dan 6 gacha chiziladi.',
      },
      {
        text: '50 sm + 4 sm necha santimetr bo‘ladi?',
        correctAnswer: '54 sm',
        distractors: ['50 sm', '45 sm', '55 sm'],
        explanation: '50 + 4 = 54 sm.',
      },
      {
        text: '1 dm 5 sm li kesma chizish uchun necha santimetr chizish kerak?',
        correctAnswer: '15 sm (10 + 5 = 15)',
        distractors: ['12 sm', '14 sm', '50 sm'],
        explanation: '1 dm 5 sm = 15 sm.',
      },

      // 8 ta o'rtacha
      {
        text: 'AB kesma 27 sm. BC kesma undan 6 sm kichik bo‘lsa, BC kesma uzunligi qancha?',
        correctAnswer: '21 sm (27 - 6 = 21)',
        distractors: ['20 sm', '22 sm', '33 sm'],
        explanation: '27 - 6 = 21 sm.',
      },
      {
        text: 'MN kesma 15 sm. NK kesma undan 5 sm uzun. NK kesma necha santimetr?',
        correctAnswer: '20 sm (15 + 5 = 20)',
        distractors: ['18 sm', '25 sm', '10 sm'],
        explanation: '15 + 5 = 20 sm.',
      },
      {
        text: 'Daftar eni 12 sm. O‘quvchi undan 3 sm qisqa kesma chizdi. Kesma necha santimetr?',
        correctAnswer: '9 sm (12 - 3 = 9)',
        distractors: ['8 sm', '10 sm', '15 sm'],
        explanation: '12 - 3 = 9 sm.',
      },
      {
        text: '68 sm ni xona qo‘shiluvchilariga ajrating:',
        correctAnswer: '60 sm + 8 sm',
        distractors: ['6 sm + 8 sm', '60 sm + 18 sm', '50 sm + 8 sm'],
        explanation: '68 sm = 60 sm + 8 sm.',
      },
      {
        text: 'Nodir 8 sm li kesma chizdi, Jasur undan 2 sm uzun kesma chizdi. Jasurning kesmasi necha santimetr?',
        correctAnswer: '10 sm (8 + 2 = 10)',
        distractors: ['6 sm', '9 sm', '11 sm'],
        explanation: '8 + 2 = 10 sm.',
      },
      {
        text: 'Chizg‘ichning 2 belgisidan 8 belgisigacha chizilgan kesmaning uzunligi necha santimetr?',
        correctAnswer: '6 sm (8 - 2 = 6)',
        distractors: ['8 sm', '2 sm', '10 sm'],
        explanation: '8 - 2 = 6 sm.',
      },
      {
        text: 'Chizg‘ichning 3 belgisidan 10 belgisigacha bo‘lgan kesma uzunligi qancha?',
        correctAnswer: '7 sm (10 - 3 = 7)',
        distractors: ['10 sm', '3 sm', '8 sm'],
        explanation: '10 - 3 = 7 sm.',
      },
      {
        text: 'O‘quvchi 1 dm li kesma chizmoqchi. U necha santimetr chizishi kerak?',
        correctAnswer: '10 sm',
        distractors: ['1 sm', '20 sm', '100 sm'],
        explanation: '1 dm = 10 sm.',
      },

      // 4 ta qiyinroq
      {
        text: 'Malika 14 sm li kesma chizdi. So‘ngra uning 5 santimetrini o‘chirib tashladi. Qolgan kesma uzunligi qancha?',
        correctAnswer: '9 sm (14 - 5 = 9)',
        distractors: ['8 sm', '10 sm', '19 sm'],
        explanation: '14 - 5 = 9 sm.',
      },
      {
        text: 'Kesmaning uzunligi 1 dm 3 sm. Uni santimetrlarda ifodalang:',
        correctAnswer: '13 sm',
        distractors: ['10 sm', '15 sm', '30 sm'],
        explanation: '1 dm 3 sm = 10 + 3 = 13 sm.',
      },
      {
        text: 'Toshkent metrosining yer usti liniyasi chizmasida har 1 km ga 1 sm to‘g‘ri kelsa, 16 km masofa necha santimetr chiziladi?',
        correctAnswer: '16 sm',
        distractors: ['10 sm', '6 sm', '26 sm'],
        explanation: 'Har 1 km 1 sm bo‘lsa, 16 km = 16 sm chiziladi.',
      },
      {
        text: 'AB kesma 18 sm. Unda K nuqta shunday qo‘yildiki, AK = 10 sm bo‘ldi. KB kesma uzunligini toping:',
        correctAnswer: '8 sm (18 - 10 = 8)',
        distractors: ['7 sm', '9 sm', '28 sm'],
        explanation: 'KB = 18 - 10 = 8 sm.',
      },

      // 2 ta murakkab masala
      {
        text: 'Madina avval 7 sm li kesma chizdi, so‘ng unga ulab 6 sm li kesma qo‘shdi. Keyin butun kesmadan 3 sm o‘chirdi. Qolgan kesma necha santimetr?',
        correctAnswer: '10 sm (7 + 6 - 3 = 10)',
        distractors: ['9 sm', '11 sm', '13 sm'],
        explanation: '7 + 6 = 13 sm, 13 - 3 = 10 sm.',
      },
      {
        text: 'Bir varaqda 22 sm li chiziq bor. Undan 12 sm li va 5 sm li ikkita kesma qirqib olindi. Necha santimetr chiziq qoldi?',
        correctAnswer: '5 sm (22 - 12 - 5 = 5)',
        distractors: ['4 sm', '6 sm', '7 sm'],
        explanation: '22 - 12 = 10 sm, 10 - 5 = 5 sm.',
      },
    ],
  },

  // 114-dars. Kesma xossalari
  {
    bookNumber: 114,
    order: 3,
    title: 'Kesma xossalari',
    emoji: '⚖️',
    shortDesc: 'Kesmalarni taqqoslash usullari va bo‘laklar yig‘indisi xossasi.',
    intro: 'Kesmaning bo‘laklari yig‘indisi butun kesmaga teng: AC + CB = AB.',
    keyPoints: [
      'Kesmalarni taqqoslash usullari: chamalab, ustiga qo‘yib, chizg‘ich yordamida o‘lchab.',
      'Butun kesma uning bo‘laklari yig‘indisiga teng: AC + CB = AB.',
      'Teskari misollar: agar AC + CB = AB bo‘lsa, AB − CB = AC va AB − AC = CB.',
    ],
    miniExample: {
      emojis: '⚖️ AC (4 sm) + CB (3 sm) = AB (7 sm)',
      text: 'Katta kesma 7 sm. Agar bitta bo‘lagi 4 sm bo‘lsa, ikkinchi bo‘lagi: 7 - 4 = 3 sm.',
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 7,
    practice: [
      {
        text: 'Kesmalarni taqqoslashning eng aniq usuli qaysi?',
        correctAnswer: 'Chizg‘ich bilan o‘lchash',
        distractors: ['Ko‘z bilan chamalash', 'Qo‘l bilan ushlab ko‘rish', 'Taxmin qilish'],
        explanation: 'Chizg‘ich yordamida aniq santimetrlari o‘lchanadi.',
      },
      {
        text: 'Agar AC = 4 sm va CB = 5 sm bo‘lsa, AB kesma uzunligi qancha?',
        correctAnswer: '9 sm (4 + 5 = 9)',
        distractors: ['8 sm', '10 sm', '1 sm'],
        explanation: 'AB = AC + CB = 4 + 5 = 9 sm.',
      },
      {
        text: 'Agar NM = 12 sm va TM = 4 sm bo‘lsa, NT bo‘lak uzunligini toping (NT + TM = NM):',
        correctAnswer: '8 sm (12 - 4 = 8)',
        distractors: ['16 sm', '7 sm', '9 sm'],
        explanation: 'NT = NM - TM = 12 - 4 = 8 sm.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'Kesmalarni taqqoslash usullarini ko‘rsating:',
        correctAnswer: 'Chamalab, ustiga qo‘yib, chizg‘ich bilan o‘lchab',
        distractors: ['Faqat tarozida tortib', 'Faqat bo‘yab ko‘rib', 'Taqqoslab bo‘lmaydi'],
        explanation: 'Kesmalar ko‘z bilan chamalab, ustiga qo‘yib yoki chizg‘ich bilan taqqoslanadi.',
      },
      {
        text: 'AC + CB = AB tenglik nimani bildiradi?',
        correctAnswer: 'Kesma bo‘laklarining yig‘indisi butun kesmaga teng',
        distractors: ['Kesmalar har doim teng', 'Kesma uchburchak hosil qiladi', 'Kesma o‘lchab bo‘lmaydi'],
        explanation: 'Butun kesma uning bo‘laklari yig‘indisiga teng.',
      },
      {
        text: 'Agar AC = 5 sm va CB = 3 sm bo‘lsa, butun AB kesma necha santimetr?',
        correctAnswer: '8 sm (5 + 3 = 8)',
        distractors: ['7 sm', '9 sm', '2 sm'],
        explanation: '5 + 3 = 8 sm.',
      },
      {
        text: 'Butun kesma 10 sm. Birinchi bo‘lagi 6 sm bo‘lsa, ikkinchi bo‘lagi qancha?',
        correctAnswer: '4 sm (10 - 6 = 4)',
        distractors: ['3 sm', '5 sm', '16 sm'],
        explanation: '10 - 6 = 4 sm.',
      },
      {
        text: 'NT + TM = NM ifodaga teskari amal qaysi?',
        correctAnswer: 'NM - TM = NT',
        distractors: ['NM + TM = NT', 'NT - TM = NM', 'NM + NT = TM'],
        explanation: 'Qo‘shishga teskari amal ayirishdir: NM - TM = NT.',
      },
      {
        text: 'Ikkita kesma bir-birining ustiga qo‘yilganda uchlari to‘liq ustma-ust tushdi. Bu kesmalar qanday kesmalar?',
        correctAnswer: 'Teng kesmalar',
        distractors: ['Har xil kesmalar', 'Siniq chiziqlar', 'Egri chiziqlar'],
        explanation: 'Ustma-ust tushgan kesmalar uzunligi bir xil, ya’ni teng bo‘ladi.',
      },

      // 8 ta o'rtacha
      {
        text: 'AB kesma 15 sm. C nuqta uni ikkita teng bo‘lakka bo‘ldi. Har bir bo‘lak necha santimetr bo‘lishi mumkin emas?',
        correctAnswer: 'Har biri 10 sm bo‘lishi mumkin emas',
        distractors: ['AC + CB = 15 sm', 'AC = 7 sm va CB = 8 sm', 'AC = 5 sm va CB = 10 sm'],
        explanation: 'Ikkita bo‘lak yig‘indisi 15 sm bo‘lishi shart, 10 + 10 = 20 sm bo‘lib ketadi.',
      },
      {
        text: 'Gilam hoshiyasining bir tomoni 20 dm, ikkinchi tomoni 30 dm. Ikkala tomon yig‘indisi necha detsimetr?',
        correctAnswer: '50 dm (20 + 30 = 50)',
        distractors: ['40 dm', '60 dm', '10 dm'],
        explanation: '20 + 30 = 50 dm.',
      },
      {
        text: 'NM kesma 18 sm, TM = 7 sm bo‘lsa, NT = ?',
        correctAnswer: '11 sm (18 - 7 = 11)',
        distractors: ['10 sm', '12 sm', '25 sm'],
        explanation: 'NT = 18 - 7 = 11 sm.',
      },
      {
        text: 'AB kesma 1 dm. Unda AC = 4 sm bo‘lsa, CB necha santimetr? (1 dm = 10 sm)',
        correctAnswer: '6 sm (10 - 4 = 6)',
        distractors: ['5 sm', '7 sm', '14 sm'],
        explanation: '10 - 4 = 6 sm.',
      },
      {
        text: 'Agar a + b = c bo‘lsa, c − a ifoda nimaga teng?',
        correctAnswer: 'b ga teng',
        distractors: ['a ga teng', 'c ga teng', '0 ga teng'],
        explanation: 'Qo‘shiluvchini topish uchun yig‘indidan ikkinchi qo‘shiluvchi ayiriladi: c - a = b.',
      },
      {
        text: 'Kesma uchta bo‘lakka bo‘lindi: 2 sm, 3 sm va 5 sm. Butun kesma necha santimetr?',
        correctAnswer: '10 sm (2 + 3 + 5 = 10)',
        distractors: ['9 sm', '11 sm', '8 sm'],
        explanation: '2 + 3 + 5 = 10 sm.',
      },
      {
        text: 'Uzunligi 16 sm bo‘lgan kesmadan 9 sm li bo‘lak kesib olindi. Qolgan bo‘lak necha santimetr?',
        correctAnswer: '7 sm (16 - 9 = 7)',
        distractors: ['6 sm', '8 sm', '25 sm'],
        explanation: '16 - 9 = 7 sm.',
      },
      {
        text: 'Qaysi tenglik xato?',
        correctAnswer: '7 sm + 5 sm = 11 sm',
        distractors: ['7 sm + 5 sm = 12 sm', '12 sm - 5 sm = 7 sm', '12 sm - 7 sm = 5 sm'],
        explanation: '7 + 5 = 12 sm bo‘ladi, 11 sm emas.',
      },

      // 4 ta qiyinroq
      {
        text: 'To‘g‘ri chiziqda A, B, C nuqtalar yotadi. AB = 8 sm, BC = 6 sm. AC kesma uzunligi qancha bo‘ladi?',
        correctAnswer: '14 sm (8 + 6 = 14)',
        distractors: ['12 sm', '15 sm', '2 sm'],
        explanation: 'AC = AB + BC = 8 + 6 = 14 sm.',
      },
      {
        text: 'Kesmaning yarmi 6 sm ga teng. Butun kesmaning uzunligi necha santimetr?',
        correctAnswer: '12 sm (6 + 6 = 12)',
        distractors: ['10 sm', '14 sm', '3 sm'],
        explanation: '6 + 6 = 12 sm.',
      },
      {
        text: 'Ip 20 sm edi. Undan teng ikkita bo‘lak kesildi. Har bir bo‘lak necha santimetr?',
        correctAnswer: '10 sm (10 + 10 = 20)',
        distractors: ['5 sm', '15 sm', '8 sm'],
        explanation: '10 + 10 = 20 sm.',
      },
      {
        text: 'AB kesma 17 sm. C nuqta shunday tanlanganki, AC kesma CB dan 3 sm uzun. AC = 10 sm bo‘lsa, CB = ?',
        correctAnswer: '7 sm (17 - 10 = 7)',
        distractors: ['6 sm', '8 sm', '14 sm'],
        explanation: 'CB = 17 - 10 = 7 sm (10 - 7 = 3 sm, shart to‘g‘ri).',
      },

      // 2 ta murakkab masala
      {
        text: 'Yog‘och bo‘lagi 24 sm edi. Duradgor undan 8 sm va 6 sm li ikkita bo‘lak kesib oldi. Yog‘ochdan necha santimetr qoldi?',
        correctAnswer: '10 sm (24 - 8 - 6 = 10)',
        distractors: ['12 sm', '9 sm', '14 sm'],
        explanation: '24 - 8 = 16 sm, 16 - 6 = 10 sm.',
      },
      {
        text: 'Kesma to‘rtta teng bo‘lakka bo‘lingan. Har bir bo‘lak 5 sm. Butun kesma necha detsimetrga teng? (1 dm = 10 sm)',
        correctAnswer: '2 dm (5 + 5 + 5 + 5 = 20 sm = 2 dm)',
        distractors: ['1 dm', '4 dm', '20 dm'],
        explanation: '5 + 5 + 5 + 5 = 20 sm = 2 dm.',
      },
    ],
  },

  // 115-dars. Siniq chiziqning uzunligi
  {
    bookNumber: 115,
    order: 4,
    title: 'Siniq chiziqning uzunligi',
    emoji: '📈',
    shortDesc: 'Siniq chiziq bo‘g‘inlari va uning umumiy uzunligini hisoblash.',
    intro: 'Siniq chiziqning uzunligi uning barcha bo‘g‘inlari uzunliklari yig‘indisiga teng.',
    keyPoints: [
      'Siniq chiziq ketma-ket ulangan kesmalardan (bo‘g‘inlardan) iborat.',
      'Siniq chiziq ochiq yoki yopiq bo‘ladi.',
      'Siniq chiziq uzunligini topish uchun uning barcha bo‘g‘inlari uzunligi qo‘shiladi.',
    ],
    miniExample: {
      emojis: '📈 3 sm + 4 sm + 5 sm = 12 sm',
      text: 'Siniq chiziq 3 ta bo‘g‘indan iborat: 3 sm, 4 sm va 5 sm. Jami uzunligi: 3 + 4 + 5 = 12 sm.',
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 7,
    practice: [
      {
        text: 'Siniq chiziq nimadan tashkil topadi?',
        correctAnswer: 'Ketma-ket tutashgan kesmalardan (bo‘g‘inlardan)',
        distractors: ['Aylanadan', 'Bitta to‘g‘ri chiziqdan', 'Egri chiziqdan'],
        explanation: 'Siniq chiziq bo‘g‘in deb ataluvchi kesmalardan tashkil topadi.',
      },
      {
        text: 'Siniq chiziq 3 ta bo‘g‘indan iborat: 4 sm, 5 sm, 6 sm. Uning umumiy uzunligi qancha?',
        correctAnswer: '15 sm (4 + 5 + 6 = 15)',
        distractors: ['14 sm', '16 sm', '10 sm'],
        explanation: '4 + 5 + 6 = 15 sm.',
      },
      {
        text: 'Siniq chiziqning boshlang‘ich va oxirgi nuqtalari tutashsa, qanday siniq chiziq hosil bo‘ladi?',
        correctAnswer: 'Yopiq siniq chiziq',
        distractors: ['Ochiq siniq chiziq', 'To‘g‘ri chiziq', 'Nur'],
        explanation: 'Boshi va oxiri tutashgan siniq chiziq yopiq siniq chiziq deyiladi.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'Siniq chiziqni tashkil etuvchi kesmalar nima deb ataladi?',
        correctAnswer: 'Bo‘g‘inlar',
        distractors: ['Nurlar', 'Burchaklar', 'Uchlar'],
        explanation: 'Siniq chiziq kesmalari uning bo‘g‘inlari deb ataladi.',
      },
      {
        text: 'Siniq chiziq uzunligi qanday topiladi?',
        correctAnswer: 'Barcha bo‘g‘inlari uzunliklari qo‘shiladi',
        distractors: ['Faqat birinchi bo‘g‘in o‘lchanadi', 'Bo‘g‘inlar ayiriladi', 'Faqat eng uzun bo‘g‘in olinadi'],
        explanation: 'Siniq chiziq uzunligi uning hamma bo‘g‘inlari uzunliklari yig‘indisiga teng.',
      },
      {
        text: 'Bo‘g‘inlari 3 sm va 7 sm bo‘lgan 2 bo‘g‘inli siniq chiziq uzunligini toping:',
        correctAnswer: '10 sm (3 + 7 = 10)',
        distractors: ['9 sm', '11 sm', '4 sm'],
        explanation: '3 + 7 = 10 sm.',
      },
      {
        text: 'Uchburchak qanday siniq chiziqqa misol bo‘ladi?',
        correctAnswer: 'Yopiq siniq chiziqqa',
        distractors: ['Ochiq siniq chiziqqa', 'Egri chiziqqa', 'To‘g‘ri chiziqqa'],
        explanation: 'Uchburchak 3 ta bo‘g‘inli yopiq siniq chiziqdir.',
      },
      {
        text: 'Siniq chiziqning 4 ta bo‘g‘ini bor. Har bir bo‘g‘in 2 sm. Siniq chiziq uzunligi qancha?',
        correctAnswer: '8 sm (2 + 2 + 2 + 2 = 8)',
        distractors: ['6 sm', '10 sm', '4 sm'],
        explanation: '2 + 2 + 2 + 2 = 8 sm.',
      },
      {
        text: 'Siniq chiziq turlarini ko‘rsating:',
        correctAnswer: 'Ochiq va yopiq siniq chiziqlar',
        distractors: ['Qora va oq chiziqlar', 'Katta va kichik sonlar', 'Faqat to‘g‘ri chiziqlar'],
        explanation: 'Siniq chiziqlar ochiq yoki yopiq bo‘ladi.',
      },

      // 8 ta o'rtacha
      {
        text: 'Siniq chiziqning 1-bo‘g‘ini 45 sm, 2-bo‘g‘ini undan 12 sm kalta. 2-bo‘g‘in necha santimetr?',
        correctAnswer: '33 sm (45 - 12 = 33)',
        distractors: ['32 sm', '35 sm', '57 sm'],
        explanation: '45 - 12 = 33 sm.',
      },
      {
        text: 'Toshkent metro yo‘nalishida poyezd 3 ta bekat oralig‘ini bosib o‘tdi: 12 km, 8 km va 15 km. Umumiy masofa qancha?',
        correctAnswer: '35 km (12 + 8 + 15 = 35)',
        distractors: ['30 km', '33 km', '40 km'],
        explanation: '12 + 8 = 20, 20 + 15 = 35 km.',
      },
      {
        text: 'Siniq chiziqning bo‘g‘inlari: 5 sm, 6 sm va 9 sm. Uning uzunligi necha detsimetr bo‘ladi? (1 dm = 10 sm)',
        correctAnswer: '2 dm (20 sm = 2 dm)',
        distractors: ['1 dm', '3 dm', '20 dm'],
        explanation: '5 + 6 + 9 = 20 sm = 2 dm.',
      },
      {
        text: 'To‘rtburchak hosil qilgan yopiq siniq chiziqning tomonlari: 4 sm, 6 sm, 4 sm, 6 sm. Uning uzunligi qancha?',
        correctAnswer: '20 sm (4 + 6 + 4 + 6 = 20)',
        distractors: ['18 sm', '22 sm', '24 sm'],
        explanation: '4 + 6 + 4 + 6 = 20 sm.',
      },
      {
        text: 'Siniq chiziq uzunligi 18 sm. U 3 ta teng bo‘g‘indan iborat. Har bir bo‘g‘in necha santimetr?',
        correctAnswer: '6 sm (6 + 6 + 6 = 18)',
        distractors: ['5 sm', '7 sm', '8 sm'],
        explanation: '6 + 6 + 6 = 18 sm.',
      },
      {
        text: '1-bo‘g‘in 14 sm, 2-bo‘g‘in 16 sm. Siniq chiziq uzunligini toping:',
        correctAnswer: '30 sm (14 + 16 = 30)',
        distractors: ['28 sm', '32 sm', '20 sm'],
        explanation: '14 + 16 = 30 sm.',
      },
      {
        text: 'Chiziqlar orasidan siniq chiziqni toping:',
        correctAnswer: 'Burchaklar hosil qilib ulangan kesmalar',
        distractors: ['Doira aylanasi', 'To‘g‘ri chiziq', 'Nuqta'],
        explanation: 'Kesmalar burchak hosil qilib ulanganda siniq chiziq bo‘ladi.',
      },
      {
        text: 'Bo‘g‘inlari 8 sm, 7 sm va 5 sm bo‘lgan siniq chiziq uzunligini toping:',
        correctAnswer: '20 sm (8 + 7 + 5 = 20)',
        distractors: ['19 sm', '21 sm', '15 sm'],
        explanation: '8 + 7 + 5 = 20 sm.',
      },

      // 4 ta qiyinroq
      {
        text: 'Siniq chiziqning uzunligi 25 sm. 1-bo‘g‘in 10 sm, 2-bo‘g‘in 8 sm bo‘lsa, 3-bo‘g‘in uzunligi qancha?',
        correctAnswer: '7 sm (25 - 10 - 8 = 7)',
        distractors: ['6 sm', '8 sm', '9 sm'],
        explanation: '10 + 8 = 18 sm, 25 - 18 = 7 sm.',
      },
      {
        text: 'Siniq chiziq 5 ta bo‘g‘indan iborat: har biri 3 sm dan. Siniq chiziq uzunligi necha santimetr?',
        correctAnswer: '15 sm (3 + 3 + 3 + 3 + 3 = 15)',
        distractors: ['12 sm', '18 sm', '20 sm'],
        explanation: '3 + 3 + 3 + 3 + 3 = 15 sm.',
      },
      {
        text: 'Sayyoh Samarqand shahrida 3 ta ko‘cha bo‘ylab yurdi: 200 m, 300 m va 400 m. Jami necha metr yo‘l bosdi?',
        correctAnswer: '900 metr (200 + 300 + 400 = 900)',
        distractors: ['800 metr', '1000 metr', '700 metr'],
        explanation: '200 + 300 + 400 = 900 m.',
      },
      {
        text: 'Ochiq siniq chiziq 4 ta bo‘g‘indan iborat: 7 sm, 8 sm, 3 sm, 2 sm. Qulay usulda uning uzunligini hisoblang:',
        correctAnswer: '20 sm ((7 + 3) + (8 + 2) = 10 + 10 = 20)',
        distractors: ['19 sm', '21 sm', '22 sm'],
        explanation: '(7 + 3) + (8 + 2) = 10 + 10 = 20 sm.',
      },

      // 2 ta murakkab masala
      {
        text: 'Chumoli siniq chiziq bo‘ylab harakatlandi: 1-bo‘g‘in 15 sm, 2-bo‘g‘in undan 5 sm kalta, 3-bo‘g‘in esa 2-bo‘g‘indan 2 sm uzun. Chumoli jami necha santimetr yurdi?',
        correctAnswer: '37 sm (1-bo‘g‘in: 15, 2-bo‘g‘in: 10, 3-bo‘g‘in: 12; 15 + 10 + 12 = 37)',
        distractors: ['35 sm', '38 sm', '40 sm'],
        explanation: '1-bo‘g‘in: 15 sm. 2-bo‘g‘in: 15 - 5 = 10 sm. 3-bo‘g‘in: 10 + 2 = 12 sm. Jami: 15 + 10 + 12 = 37 sm.',
      },
      {
        text: 'Beshburchak shaklidagi yopiq siniq chiziqning barcha 5 ta bo‘g‘ini teng bo‘lib, har biri 6 sm ga teng. Uning umumiy uzunligi qancha?',
        correctAnswer: '30 sm (6 + 6 + 6 + 6 + 6 = 30)',
        distractors: ['25 sm', '32 sm', '36 sm'],
        explanation: '6 + 6 + 6 + 6 + 6 = 30 sm = 3 dm.',
      },
    ],
  },
];

console.log('Generating Part 4 Chapter 1 lessons (112-115)...');
for (const lessonDef of lessonsPart4Ch1) {
  const seed = buildLessonSeed(lessonDef);
  saveLessonFile(4, lessonDef.bookNumber, seed, false);
  console.log(`✅ Saved lesson-${lessonDef.bookNumber}.json`);
}
