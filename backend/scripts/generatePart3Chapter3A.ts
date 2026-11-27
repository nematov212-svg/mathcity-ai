import { LessonDataDef, buildLessonSeed, saveLessonFile } from './generatorTypes.js';

const lessonsPart3Ch3A: LessonDataDef[] = [
  // 30-dars. Uzunlik. Santimetr
  {
    bookNumber: 30,
    title: 'Uzunlik. Santimetr',
    emoji: '📏',
    shortDesc: 'Uzunlik o‘lchovi, santimetr (cm) va chizg‘ichda o‘lchash.',
    intro: 'Predmetlarning uzunligini o‘lchash uchun santimetr (cm) birligi va chizg‘ichdan foydalaniladi.',
    keyPoints: [
      'Chizg‘ichda 0 dan 1 gacha bo‘lgan oraliq 1 santimetr (1 cm) deyiladi.',
      'Qadimda uzunlik duym (bosh barmoq eni), tirsak va fut (qadam) bilan o‘lchangan.',
      'Uzunlikni aniq o‘lchashda o‘lchov birligi sifatida santimetr (cm) ishlatiladi.',
    ],
    miniExample: {
      emojis: '📏 [ 0 —— 1 —— 2 —— 3 —— 4 —— 5 ] cm',
      text: 'Chizg‘ichda 0 dan 5 gacha bo‘lgan kesma uzunligi 5 cm ga teng.',
    },
    xpReward: 95,
    coinReward: 10,
    estMinutes: 8,
    practice: [
      {
        text: 'Santimetr qisqacha qanday yoziladi?',
        correctAnswer: 'cm',
        distractors: ['kg', 'litr', 'dm'],
        explanation: 'Santimetr qisqacha «cm» deb belgilanadi.',
      },
      {
        text: 'Chizg‘ichda kesmaning boshi qaysi songa to‘g‘rilanadi?',
        correctAnswer: '0 soniga',
        distractors: ['1 soniga', '10 soniga', 'Ixtiyoriy songa'],
        explanation: 'O‘lchash har doim 0 chizig‘idan boshlanadi.',
      },
      {
        text: 'Qadimda odamlar uzunlikni nimalar bilan o‘lchaganlar?',
        correctAnswer: 'Qadam, tirsak va barmoq bilan',
        distractors: ['Soat va daqiqa bilan', 'Tarozi bilan', 'Telefon bilan'],
        explanation: 'Qadimda inson tana a’zolari (qadam, tirsak, quloch) o‘lchov bo‘lgan.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'Uzunlik o‘lchov birligini toping:',
        correctAnswer: 'Santimetr (cm)',
        distractors: ['Kilogramm (kg)', 'Litr (l)', 'Soat'],
        explanation: 'Santimetr uzunlik birligidir.',
      },
      {
        text: 'Chizg‘ichda 0 dan 7 gacha chizilgan kesmaning uzunligi necha santimetr?',
        correctAnswer: '7 cm',
        distractors: ['6 cm', '8 cm', '5 cm'],
        explanation: '0 dan 7 gacha bo‘lgan masofa 7 cm bo‘ladi.',
      },
      {
        text: 'Qalamning uzunligi 12 cm, o‘chirg‘ich 4 cm. Qalam o‘chirg‘ichdan qancha uzun?',
        correctAnswer: '8 cm (12 - 4 = 8)',
        distractors: ['16 cm', '6 cm', '10 cm'],
        explanation: '12 - 4 = 8 cm.',
      },
      {
        text: '5 cm va 4 cm uzunlikdagi ikkita kesma birlashtirilsa, jami uzunlik qancha bo‘ladi?',
        correctAnswer: '9 cm (5 + 4 = 9)',
        distractors: ['1 cm', '8 cm', '10 cm'],
        explanation: '5 + 4 = 9 cm.',
      },
      {
        text: 'Chizg‘ichda 0 dan 10 gacha bo‘lgan oraliq necha cm?',
        correctAnswer: '10 cm',
        distractors: ['9 cm', '11 cm', '1 cm'],
        explanation: '0 dan 10 gacha oraliq 10 cm ga teng.',
      },
      {
        text: 'Qaysi asbob yordamida kesma uzunligi o‘lchanadi?',
        correctAnswer: 'Chizg‘ich',
        distractors: ['Tarozi', 'Termometr', 'Soat'],
        explanation: 'Kesmalar chizg‘ich yordamida o‘lchanadi.',
      },

      // 8 ta o'rtacha
      {
        text: 'Qizil tasma 15 cm, ko‘k tasma 10 cm. Qizil tasma ko‘k tasmadan necha cm uzun?',
        correctAnswer: '5 cm (15 - 10 = 5)',
        distractors: ['25 cm', '4 cm', '6 cm'],
        explanation: '15 - 10 = 5 cm.',
      },
      {
        text: 'Daftarning bo‘yi 20 cm, eni 15 cm. Daftarning bo‘yi enidan qancha uzun?',
        correctAnswer: '5 cm (20 - 15 = 5)',
        distractors: ['35 cm', '10 cm', '4 cm'],
        explanation: '20 - 15 = 5 cm.',
      },
      {
        text: 'Chizg‘ichda kesma 2 dan boshlanib 9 da tugadi. Kesmaning uzunligi necha cm?',
        correctAnswer: '7 cm (9 - 2 = 7)',
        distractors: ['9 cm', '2 cm', '11 cm'],
        explanation: '9 - 2 = 7 cm.',
      },
      {
        text: 'Uzunligi 14 cm bo‘lgan ipdan 6 cm kesib olindi. Necha cm ip qoldi?',
        correctAnswer: '8 cm (14 - 6 = 8)',
        distractors: ['20 cm', '7 cm', '9 cm'],
        explanation: '14 - 6 = 8 cm.',
      },
      {
        text: 'Tenglikni to‘ldiring: 12 cm + 7 cm = □ cm',
        correctAnswer: '19 cm',
        distractors: ['18 cm', '20 cm', '5 cm'],
        explanation: '12 + 7 = 19 cm.',
      },
      {
        text: 'Tenglikni to‘ldiring: 18 cm - 8 cm = □ cm',
        correctAnswer: '10 cm',
        distractors: ['26 cm', '8 cm', '12 cm'],
        explanation: '18 - 8 = 10 cm.',
      },
      {
        text: '1-kesma 11 cm, 2-kesma undan 4 cm uzun. 2-kesma uzunligini toping:',
        correctAnswer: '15 cm (11 + 4 = 15)',
        distractors: ['7 cm', '14 cm', '16 cm'],
        explanation: '11 + 4 = 15 cm.',
      },
      {
        text: 'Ipning uzunligi 25 cm. Undan 15 cm ishlatildi. Necha cm ip qoldi?',
        correctAnswer: '10 cm (25 - 15 = 10)',
        distractors: ['40 cm', '12 cm', '8 cm'],
        explanation: '25 - 15 = 10 cm.',
      },

      // 4 ta qiyinroq
      {
        text: 'Uchta kesmaning uzunliklari: 6 cm, 4 cm va 8 cm. Ularning umumiy uzunligi qancha?',
        correctAnswer: '18 cm (6 + 4 + 8 = 18)',
        distractors: ['16 cm', '20 cm', '14 cm'],
        explanation: '6 + 4 = 10, 10 + 8 = 18 cm.',
      },
      {
        text: 'Chizg‘ichda 3 dan boshlanib 15 da tugagan kesma uzunligini toping:',
        correctAnswer: '12 cm (15 - 3 = 12)',
        distractors: ['15 cm', '18 cm', '11 cm'],
        explanation: '15 - 3 = 12 cm.',
      },
      {
        text: 'Mixning uzunligi 9 cm, vintning uzunligi undan 3 cm qisqa. Ikkala buyumning umumiy uzunligi qancha?',
        correctAnswer: '15 cm (Vint: 6 cm; 9 + 6 = 15)',
        distractors: ['6 cm', '12 cm', '18 cm'],
        explanation: 'Vint: 9 - 3 = 6 cm. Jami: 9 + 6 = 15 cm.',
      },
      {
        text: 'Uzunligi 30 cm bo‘lgan lentadan 1-marta 10 cm, 2-marta 12 cm kesib olindi. Necha cm lenta qoldi?',
        correctAnswer: '8 cm (30 - 10 - 12 = 8)',
        distractors: ['10 cm', '6 cm', '22 cm'],
        explanation: '30 - 22 = 8 cm.',
      },

      // 2 ta murakkab masala
      {
        text: 'Chizg‘ichda AB kesma 8 cm, BC kesma 7 cm, CD kesma 5 cm. AD kesmaning umumiy uzunligi qancha bo‘ladi?',
        correctAnswer: '20 cm (8 + 7 + 5 = 20)',
        distractors: ['19 cm', '21 cm', '18 cm'],
        explanation: '8 + 7 = 15, 15 + 5 = 20 cm.',
      },
      {
        text: 'Jasur 1-kuni qog‘ozdan 25 cm, 2-kuni undan 5 cm kam lenta qirqdi. Jasur ikki kunda jami necha cm lenta qirqqan?',
        correctAnswer: '45 cm (2-kun: 20 cm; 25 + 20 = 45)',
        distractors: ['40 cm', '50 cm', '35 cm'],
        explanation: '2-kun: 25 - 5 = 20 cm. Jami: 25 + 20 = 45 cm.',
      },
    ],
  },

  // 31-dars. Kesmalarni o‘lchash
  {
    bookNumber: 31,
    title: 'Kesmalarni o‘lchash',
    emoji: '📍',
    shortDesc: 'Kesma uchlari, lotin harflari (A, B, C) va kesma uzunligini o‘zgartirish.',
    intro: 'Kesmaning ikki uchi nuqtalar bilan chegaralanadi va katta lotin harflari (A, B, C) bilan belgilanadi.',
    keyPoints: [
      'Kesma — bu ikki nuqtani tutashtiruvchi to‘g‘ri chiziq bo‘lagi.',
      'Kesmaning uchlari A va B harflari bilan belgilansa, u «AB kesma» deyiladi.',
      'Kesma uzunligini 1 cm ga ko‘paytirish yoki kamaytirish amallar orqali bajariladi.',
    ],
    miniExample: {
      emojis: '📍 A •————————————• B (AB = 6 cm)',
      text: 'AB kesmaning uzunligi 6 cm. Agar uni 2 cm ga uzaytirsak: 6 + 2 = 8 cm bo‘ladi.',
    },
    xpReward: 95,
    coinReward: 10,
    estMinutes: 8,
    practice: [
      {
        text: 'Kesmaning uchlari qanday belgilanadi?',
        correctAnswer: 'Katta lotin harflari (A, B, C) bilan',
        distractors: ['Kichik raqamlar bilan', 'Faqat nuqtalar bilan harfsiz', 'Rasmlar bilan'],
        explanation: 'Geometriyada nuqtalar va kesma uchlari katta lotin harflari bilan belgilanadi.',
      },
      {
        text: 'AB kesmaning uzunligi 8 cm. Agar uni 1 cm ga qisqartirsak, uzunligi necha cm bo‘ladi?',
        correctAnswer: '7 cm (8 - 1 = 7)',
        distractors: ['9 cm', '8 cm', '6 cm'],
        explanation: '8 - 1 = 7 cm.',
      },
      {
        text: 'CD kesma 10 cm, MN kesma 12 cm. Qaysi kesma uzun?',
        correctAnswer: 'MN kesma (12 cm > 10 cm)',
        distractors: ['CD kesma', 'Ikkalasi teng', 'Bilib bo‘lmaydi'],
        explanation: '12 cm 10 cm dan katta, demak MN kesma uzun.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'Kesmaning nechta uchi bo‘ladi?',
        correctAnswer: '2 ta uchi bo‘ladi',
        distractors: ['1 ta uchi', '3 ta uchi', 'Uchi bo‘lmaydi'],
        explanation: 'Kesma ikki tomondan nuqtalar bilan chegaralangan bo‘ladi.',
      },
      {
        text: 'AB kesmaning uzunligi 5 cm. Uni 1 cm ga uzaytirsak, uzunligi necha cm bo‘ladi?',
        correctAnswer: '6 cm (5 + 1 = 6)',
        distractors: ['4 cm', '5 cm', '7 cm'],
        explanation: '5 + 1 = 6 cm.',
      },
      {
        text: 'KL kesma 9 cm. Uni 2 cm ga qisqartirsak, uzunligi qancha bo‘ladi?',
        correctAnswer: '7 cm (9 - 2 = 7)',
        distractors: ['11 cm', '8 cm', '6 cm'],
        explanation: '9 - 2 = 7 cm.',
      },
      {
        text: 'A nuqtadan B nuqtagacha masofa 14 cm. AB kesmaning uzunligi qancha?',
        correctAnswer: '14 cm',
        distractors: ['12 cm', '16 cm', '0 cm'],
        explanation: 'A va B nuqtalar orasidagi masofa AB kesma uzunligiga teng.',
      },
      {
        text: 'AB = 6 cm va BC = 4 cm kesmalar bitta to‘g‘ri chiziqda yotsa, AC kesma uzunligi necha cm?',
        correctAnswer: '10 cm (6 + 4 = 10)',
        distractors: ['2 cm', '9 cm', '12 cm'],
        explanation: '6 + 4 = 10 cm.',
      },
      {
        text: 'Qaysi kesma qisqa: AB = 7 cm yoki CD = 9 cm?',
        correctAnswer: 'AB kesma qisqa',
        distractors: ['CD kesma qisqa', 'Ikkalasi teng', 'Ikkalasi ham uzun'],
        explanation: '7 cm < 9 cm bo‘lgani uchun AB qisqa.',
      },

      // 8 ta o'rtacha
      {
        text: 'AB kesma 15 cm. CD kesma undan 5 cm qisqa. CD kesma uzunligini toping:',
        correctAnswer: '10 cm (15 - 5 = 10)',
        distractors: ['20 cm', '12 cm', '8 cm'],
        explanation: '15 - 5 = 10 cm.',
      },
      {
        text: 'MN kesma 12 cm. KP kesma undan 4 cm uzun. KP kesma uzunligi nechaga teng?',
        correctAnswer: '16 cm (12 + 4 = 16)',
        distractors: ['8 cm', '15 cm', '18 cm'],
        explanation: '12 + 4 = 16 cm.',
      },
      {
        text: 'AB kesmaning uzunligi 20 cm. Unda C nuqta shunday belgilandiki, AC = 12 cm bo‘ldi. CB kesma uzunligi qancha?',
        correctAnswer: '8 cm (20 - 12 = 8)',
        distractors: ['32 cm', '10 cm', '7 cm'],
        explanation: '20 - 12 = 8 cm.',
      },
      {
        text: 'AB = 14 cm, CD = 11 cm. AB kesma CD kesmadan necha cm uzun?',
        correctAnswer: '3 cm (14 - 11 = 3)',
        distractors: ['25 cm', '2 cm', '4 cm'],
        explanation: '14 - 11 = 3 cm.',
      },
      {
        text: 'Chizg‘ichda kesma 4 dan 16 gacha chizildi. Kesma uzunligini toping:',
        correctAnswer: '12 cm (16 - 4 = 12)',
        distractors: ['16 cm', '20 cm', '10 cm'],
        explanation: '16 - 4 = 12 cm.',
      },
      {
        text: 'Kesmaning uzunligi 18 cm edi. U har tomondan 2 cm dan qisqartirildi. Kesmaning yangi uzunligi necha cm?',
        correctAnswer: '14 cm (18 - 2 - 2 = 14)',
        distractors: ['16 cm', '12 cm', '15 cm'],
        explanation: 'Ikkala tomondan 2 cm dan, ya’ni 4 cm qisqardi: 18 - 4 = 14 cm.',
      },
      {
        text: 'Tenglikni to‘ldiring: 24 cm + 13 cm = □ cm',
        correctAnswer: '37 cm',
        distractors: ['35 cm', '38 cm', '11 cm'],
        explanation: '24 + 13 = 37 cm.',
      },
      {
        text: 'Tenglikni to‘ldiring: 45 cm - 20 cm = □ cm',
        correctAnswer: '25 cm',
        distractors: ['65 cm', '20 cm', '30 cm'],
        explanation: '45 - 20 = 25 cm.',
      },

      // 4 ta qiyinroq
      {
        text: 'AB = 10 cm, BC = 8 cm, CD = 6 cm. Agar ular ketma-ket joylashsa, AD umumiy kesma necha cm bo‘ladi?',
        correctAnswer: '24 cm (10 + 8 + 6 = 24)',
        distractors: ['22 cm', '26 cm', '18 cm'],
        explanation: '10 + 8 + 6 = 24 cm.',
      },
      {
        text: 'AB kesma 16 cm. Undan 4 cm kesildi, so‘ng qolgan qismi 2 cm ga uzaytirildi. Yangi kesma uzunligi qancha?',
        correctAnswer: '14 cm (16 - 4 + 2 = 14)',
        distractors: ['12 cm', '15 cm', '18 cm'],
        explanation: '16 - 4 = 12 cm, 12 + 2 = 14 cm.',
      },
      {
        text: 'Uchta kesmaning uzunligi yig‘indisi 30 cm. 1-kesma 10 cm, 2-kesma 12 cm bo‘lsa, 3-kesma uzunligi necha cm?',
        correctAnswer: '8 cm (30 - 10 - 12 = 8)',
        distractors: ['10 cm', '6 cm', '12 cm'],
        explanation: '10 + 12 = 22 cm. 3-kesma: 30 - 22 = 8 cm.',
      },
      {
        text: 'Kvadratning har bir tomoni 5 cm ga teng. Uning barcha 4 ta tomoni uzunliklari yig‘indisi necha cm?',
        correctAnswer: '20 cm (5 + 5 + 5 + 5 = 20)',
        distractors: ['15 cm', '25 cm', '10 cm'],
        explanation: '5 + 5 + 5 + 5 = 20 cm.',
      },

      // 2 ta murakkab masala
      {
        text: 'To‘g‘ri to‘rtburchakning bo‘yi 12 cm, eni 8 cm. Bo‘yi va eni uzunliklari yig‘indisi necha cm bo‘ladi?',
        correctAnswer: '20 cm (12 + 8 = 20)',
        distractors: ['4 cm', '24 cm', '16 cm'],
        explanation: '12 + 8 = 20 cm.',
      },
      {
        text: 'Simning uzunligi 50 cm edi. Undan har biri 15 cm bo‘lgan ikkita bo‘lak kesib olindi. Necha cm sim qoldi?',
        correctAnswer: '20 cm (50 - 15 - 15 = 20)',
        distractors: ['30 cm', '25 cm', '35 cm'],
        explanation: 'Kesildi: 15 + 15 = 30 cm. Qoldi: 50 - 30 = 20 cm.',
      },
    ],
  },

  // 32-dars. Santimetr. Detsimetr
  {
    bookNumber: 32,
    title: 'Santimetr. Detsimetr',
    emoji: '🧶',
    shortDesc: 'Detsimetr (dm) tushunchasi va 1 dm = 10 cm qoidasi.',
    intro: 'Kattaroq predmetlarni o‘lchashda detsimetr (dm) birligi ishlatiladi: 1 dm = 10 cm.',
    keyPoints: [
      'Asosiy qoida: 1 dm = 10 cm.',
      '10 santimetr birlashib, 1 detsimetrni hosil qiladi.',
      'Katta predmetlar (parta, kitob, doska) ko‘pincha detsimetrda o‘lchanadi.',
    ],
    miniExample: {
      emojis: '🧶 1 dm = 10 cm ➔ 2 dm = 20 cm',
      text: '1 detsimetr 10 santimetrga teng. 2 dm = 20 cm, 3 dm = 30 cm.',
    },
    xpReward: 95,
    coinReward: 10,
    estMinutes: 8,
    practice: [
      {
        text: '1 detsimetr necha santimetrga teng?',
        correctAnswer: '10 cm',
        distractors: ['100 cm', '1 cm', '5 cm'],
        explanation: '1 dm = 10 cm qat’iy qoidadir.',
      },
      {
        text: '20 santimetr necha detsimetr bo‘ladi?',
        correctAnswer: '2 dm',
        distractors: ['20 dm', '1 dm', '200 dm'],
        explanation: 'Har 10 cm = 1 dm, demak 20 cm = 2 dm.',
      },
      {
        text: 'Qaysi predmetni detsimetrda o‘lchash qulayroq?',
        correctAnswer: 'Partaning bo‘yini',
        distractors: ['Chumolining uzunligini', 'Tugmaning enini', 'Qalam uchini'],
        explanation: 'Kattaroq buyumlar (parta, doska) detsimetrda o‘lchanadi.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: '1 dm necha santimetr?',
        correctAnswer: '10 cm',
        distractors: ['100 cm', '1 cm', '50 cm'],
        explanation: '1 dm = 10 cm.',
      },
      {
        text: '2 dm necha santimetrga teng?',
        correctAnswer: '20 cm',
        distractors: ['2 cm', '200 cm', '12 cm'],
        explanation: '2 dm = 20 cm.',
      },
      {
        text: '30 cm necha detsimetr bo‘ladi?',
        correctAnswer: '3 dm',
        distractors: ['30 dm', '300 dm', '13 dm'],
        explanation: '30 cm = 3 dm.',
      },
      {
        text: 'Detsimetr qisqacha qanday belgilanadi?',
        correctAnswer: 'dm',
        distractors: ['cm', 'kg', 'm'],
        explanation: 'Detsimetr qisqacha «dm» deb yoziladi.',
      },
      {
        text: '5 dm necha santimetrga teng?',
        correctAnswer: '50 cm',
        distractors: ['5 cm', '500 cm', '15 cm'],
        explanation: '5 dm = 50 cm.',
      },
      {
        text: '40 cm necha detsimetr?',
        correctAnswer: '4 dm',
        distractors: ['40 dm', '14 dm', '400 dm'],
        explanation: '40 cm = 4 dm.',
      },

      // 8 ta o'rtacha
      {
        text: 'Taqqoslang: 1 dm va 9 cm. Qaysi biri katta?',
        correctAnswer: '1 dm katta (chunki 1 dm = 10 cm, 10 > 9)',
        distractors: ['9 cm katta', 'Ikkalasi teng', 'Bilib bo‘lmaydi'],
        explanation: '1 dm = 10 cm bo‘lgani uchun 9 cm dan katta.',
      },
      {
        text: 'Taqqoslang: 2 dm va 25 cm. Qaysi biri katta?',
        correctAnswer: '25 cm katta (chunki 2 dm = 20 cm, 20 < 25)',
        distractors: ['2 dm katta', 'Ikkalasi teng', 'Bilib bo‘lmaydi'],
        explanation: '2 dm = 20 cm, 25 cm esa 20 cm dan katta.',
      },
      {
        text: '6 dm necha santimetr bo‘ladi?',
        correctAnswer: '60 cm',
        distractors: ['6 cm', '16 cm', '600 cm'],
        explanation: '6 dm = 60 cm.',
      },
      {
        text: '70 cm necha detsimetrga teng?',
        correctAnswer: '7 dm',
        distractors: ['70 dm', '17 dm', '700 dm'],
        explanation: '70 cm = 7 dm.',
      },
      {
        text: 'Tasmaning uzunligi 1 dm 2 cm. U jami necha santimetr?',
        correctAnswer: '12 cm (10 + 2 = 12)',
        distractors: ['10 cm', '3 cm', '21 cm'],
        explanation: '1 dm = 10 cm, 10 + 2 = 12 cm.',
      },
      {
        text: 'Qalamdonning uzunligi 18 cm. Uni detsimetr va santimetrda yozing:',
        correctAnswer: '1 dm 8 cm',
        distractors: ['8 dm 1 cm', '18 dm', '2 dm'],
        explanation: '18 cm = 10 cm + 8 cm = 1 dm 8 cm.',
      },
      {
        text: '8 dm necha santimetr?',
        correctAnswer: '80 cm',
        distractors: ['8 cm', '800 cm', '18 cm'],
        explanation: '8 dm = 80 cm.',
      },
      {
        text: '90 cm necha detsimetr bo‘ladi?',
        correctAnswer: '9 dm',
        distractors: ['90 dm', '19 dm', '900 dm'],
        explanation: '90 cm = 9 dm.',
      },

      // 4 ta qiyinroq
      {
        text: 'Taqqoslang: 3 dm 5 cm va 32 cm. Qaysi biri uzun?',
        correctAnswer: '3 dm 5 cm uzun (chunki 35 cm > 32 cm)',
        distractors: ['32 cm uzun', 'Ikkalasi teng', 'Bilib bo‘lmaydi'],
        explanation: '3 dm 5 cm = 35 cm. 35 cm > 32 cm.',
      },
      {
        text: 'Kitobning bo‘yi 2 dm, eni 1 dm 5 cm. Kitobning bo‘yi enidan necha santimetr uzun?',
        correctAnswer: '5 cm (20 cm - 15 cm = 5 cm)',
        distractors: ['10 cm', '15 cm', '1 cm'],
        explanation: 'Bo‘yi: 20 cm, eni: 15 cm. Farq: 20 - 15 = 5 cm.',
      },
      {
        text: 'Tasma 1 dm bo‘lishi uchun 7 cm uzunlikdagi ipga yana necha santimetr qo‘shish kerak?',
        correctAnswer: '3 cm (10 - 7 = 3)',
        distractors: ['2 cm', '4 cm', '17 cm'],
        explanation: '1 dm = 10 cm. 10 - 7 = 3 cm kerak.',
      },
      {
        text: 'Partaning uzunligi 8 dm, eni 5 dm. Partaning uzunligi enidan necha dm ortiq?',
        correctAnswer: '3 dm (8 - 5 = 3)',
        distractors: ['13 dm', '2 dm', '4 dm'],
        explanation: '8 - 5 = 3 dm ortiq.',
      },

      // 2 ta murakkab masala
      {
        text: 'O‘quvchi 1-kesmani 1 dm, 2-kesmani undan 4 cm uzun qilib chizdi. Ikkala kesmaning umumiy uzunligi necha santimetr?',
        correctAnswer: '24 cm (1-kesma: 10 cm, 2-kesma: 14 cm; 10 + 14 = 24)',
        distractors: ['20 cm', '25 cm', '18 cm'],
        explanation: '1-kesma: 10 cm. 2-kesma: 10 + 4 = 14 cm. Jami: 10 + 14 = 24 cm.',
      },
      {
        text: 'Duradgor 6 dm uzunlikdagi taxtadan 2 dm 5 cm kesib oldi. Necha santimetr taxta qoldi?',
        correctAnswer: '35 cm (60 cm - 25 cm = 35 cm)',
        distractors: ['40 cm', '30 cm', '45 cm'],
        explanation: '6 dm = 60 cm. Kesildi: 25 cm. Qoldi: 60 - 25 = 35 cm.',
      },
    ],
  },

  // 33-dars. Detsimetr bilan santimetr orasidagi o‘zaro bog‘lanish
  {
    bookNumber: 33,
    title: 'Detsimetr bilan santimetr orasidagi o‘zaro bog‘lanish',
    emoji: '🔁',
    shortDesc: 'O‘zaro aylantirish: 4 dm = 40 cm, 30 cm = 3 dm, 2 dm 4 cm = 24 cm.',
    intro: 'Detsimetrni santimetrga va santimetrni detsimetrga o‘tkazish qoidalarini mustahkamlaymiz.',
    keyPoints: [
      '4 dm = 40 cm, 30 cm = 3 dm.',
      'Aralash o‘lchov: 2 dm 4 cm = 20 cm + 4 cm = 24 cm.',
      'O‘lchov birliklari bir xil qilingandan keyin taqqoslanadi va qo‘shiladi.',
    ],
    miniExample: {
      emojis: '🔁 2 dm 4 cm = 20 cm + 4 cm = 24 cm',
      text: 'Bloknot eni 2 dm 4 cm. Santimetrda: 20 + 4 = 24 cm.',
    },
    xpReward: 95,
    coinReward: 10,
    estMinutes: 8,
    practice: [
      {
        text: '4 dm necha santimetrga teng?',
        correctAnswer: '40 cm',
        distractors: ['4 cm', '400 cm', '14 cm'],
        explanation: '4 dm = 40 cm.',
      },
      {
        text: '30 cm necha detsimetr bo‘ladi?',
        correctAnswer: '3 dm',
        distractors: ['30 dm', '300 dm', '13 dm'],
        explanation: '30 cm = 3 dm.',
      },
      {
        text: '2 dm 4 cm necha santimetrga teng?',
        correctAnswer: '24 cm (20 + 4 = 24)',
        distractors: ['6 cm', '240 cm', '20 cm'],
        explanation: '2 dm = 20 cm, 20 + 4 = 24 cm.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: '4 dm necha santimetr?',
        correctAnswer: '40 cm',
        distractors: ['4 cm', '400 cm', '14 cm'],
        explanation: '4 dm = 40 cm.',
      },
      {
        text: '30 cm necha detsimetrga teng?',
        correctAnswer: '3 dm',
        distractors: ['30 dm', '300 dm', '13 dm'],
        explanation: '30 cm = 3 dm.',
      },
      {
        text: '2 dm 4 cm necha santimetr bo‘ladi?',
        correctAnswer: '24 cm',
        distractors: ['20 cm', '6 cm', '42 cm'],
        explanation: '20 + 4 = 24 cm.',
      },
      {
        text: '35 cm ni detsimetr va santimetrda ifodalang:',
        correctAnswer: '3 dm 5 cm',
        distractors: ['5 dm 3 cm', '35 dm', '8 dm'],
        explanation: '35 cm = 3 dm 5 cm.',
      },
      {
        text: '5 dm 0 cm necha santimetr?',
        correctAnswer: '50 cm',
        distractors: ['5 cm', '500 cm', '15 cm'],
        explanation: '5 dm = 50 cm.',
      },
      {
        text: '63 cm da necha detsimetr va necha santimetr bor?',
        correctAnswer: '6 dm 3 cm',
        distractors: ['3 dm 6 cm', '63 dm', '9 dm'],
        explanation: '63 cm = 6 dm 3 cm.',
      },

      // 8 ta o'rtacha
      {
        text: 'Taqqoslang: 4 dm va 45 cm. Qaysi biri katta?',
        correctAnswer: '45 cm katta (chunki 4 dm = 40 cm, 40 < 45)',
        distractors: ['4 dm katta', 'Ikkalasi teng', 'Bilib bo‘lmaydi'],
        explanation: '4 dm = 40 cm, 45 cm esa 40 cm dan katta.',
      },
      {
        text: 'Bloknotning eni 2 dm 4 cm. Kitobning eni esa 20 cm. Qaysi biri enliroq va qancha?',
        correctAnswer: 'Bloknot 4 cm ga enliroq (24 cm > 20 cm)',
        distractors: ['Kitob enliroq', 'Ikkalasi teng', 'Bloknot 10 cm ga enliroq'],
        explanation: 'Bloknot: 24 cm, Kitob: 20 cm. 24 - 20 = 4 cm.',
      },
      {
        text: '1 dm 5 cm + 2 dm 3 cm ifodaning qiymati necha bo‘ladi?',
        correctAnswer: '3 dm 8 cm (38 cm)',
        distractors: ['3 dm 5 cm', '4 dm', '30 cm'],
        explanation: '1 dm + 2 dm = 3 dm; 5 cm + 3 cm = 8 cm. Natija: 3 dm 8 cm.',
      },
      {
        text: '4 dm 8 cm - 2 dm 3 cm ayirmani hisoblang:',
        correctAnswer: '2 dm 5 cm (25 cm)',
        distractors: ['2 dm 8 cm', '3 dm', '20 cm'],
        explanation: '4 - 2 = 2 dm, 8 - 3 = 5 cm. Natija: 2 dm 5 cm.',
      },
      {
        text: '7 dm 2 cm necha santimetrga teng?',
        correctAnswer: '72 cm',
        distractors: ['27 cm', '70 cm', '9 cm'],
        explanation: '70 + 2 = 72 cm.',
      },
      {
        text: '85 cm necha detsimetr va santimetr bo‘ladi?',
        correctAnswer: '8 dm 5 cm',
        distractors: ['5 dm 8 cm', '85 dm', '13 dm'],
        explanation: '85 cm = 8 dm 5 cm.',
      },
      {
        text: 'Taqqoslang: 6 dm va 60 cm. Qaysi belgi to‘g‘ri?',
        correctAnswer: '=',
        distractors: ['>', '<', 'aniqlab bo‘lmaydi'],
        explanation: '6 dm = 60 cm, shuning uchun ular teng.',
      },
      {
        text: 'Kesmaning uzunligi 3 dm. Undan 10 cm kesib tashlansa, necha dm qoladi?',
        correctAnswer: '2 dm (chunki 10 cm = 1 dm; 3 - 1 = 2 dm)',
        distractors: ['1 dm', '20 dm', '0 dm'],
        explanation: '10 cm = 1 dm. 3 dm - 1 dm = 2 dm.',
      },

      // 4 ta qiyinroq
      {
        text: 'Tasma uzunligi 5 dm. Undan 20 cm kesib olindi. Necha detsimetr tasma qoldi?',
        correctAnswer: '3 dm (20 cm = 2 dm; 5 - 2 = 3 dm)',
        distractors: ['2 dm', '4 dm', '30 dm'],
        explanation: '20 cm = 2 dm. 5 - 2 = 3 dm qoldi.',
      },
      {
        text: 'Doskaning bo‘yi 1 metr (10 dm). Partaning bo‘yi 7 dm. Doska partadan necha dm uzun?',
        correctAnswer: '3 dm (10 - 7 = 3)',
        distractors: ['17 dm', '2 dm', '4 dm'],
        explanation: '10 - 7 = 3 dm.',
      },
      {
        text: '2 dm 6 cm uzunlikdagi simga 1 dm 4 cm sim ulandi. Jami sim necha santimetr bo‘ldi?',
        correctAnswer: '40 cm (4 dm)',
        distractors: ['30 cm', '38 cm', '45 cm'],
        explanation: '26 cm + 14 cm = 40 cm = 4 dm.',
      },
      {
        text: 'Chizg‘ich 30 cm. Qalam 1 dm 5 cm. Chizg‘ich qalamdan necha santimetr uzun?',
        correctAnswer: '15 cm (30 - 15 = 15)',
        distractors: ['10 cm', '20 cm', '5 cm'],
        explanation: '1 dm 5 cm = 15 cm. 30 - 15 = 15 cm.',
      },

      // 2 ta murakkab masala
      {
        text: 'Akrom 3 dm uzunlikdagi tasmadan 12 cm kesdi. Sardor esa 2 dm uzunlikdagi tasmadan 5 cm kesdi. Kimda ko‘proq tasma qoldi va qancha?',
        correctAnswer: 'Akromda 3 cm ko‘proq qoldi (Akrom: 18 cm, Sardor: 15 cm; 18 - 15 = 3)',
        distractors: ['Sardorda ko‘proq qoldi', 'Ikkalasida teng qoldi', 'Akromda 5 cm ko‘p qoldi'],
        explanation: 'Akrom: 30 - 12 = 18 cm. Sardor: 20 - 5 = 15 cm. Farq: 18 - 15 = 3 cm.',
      },
      {
        text: 'Karton qutining bo‘yi 4 dm 5 cm, eni esa undan 1 dm 2 cm qisqa. Qutining eni necha santimetr?',
        correctAnswer: '33 cm (45 cm - 12 cm = 33 cm)',
        distractors: ['30 cm', '35 cm', '57 cm'],
        explanation: 'Bo‘yi: 45 cm. 1 dm 2 cm = 12 cm. Eni: 45 - 12 = 33 cm.',
      },
    ],
  },

  // 34-dars. Masalalar yechish (uzunlik)
  {
    bookNumber: 34,
    title: 'Masalalar yechish (uzunlik)',
    emoji: '📎',
    shortDesc: 'Mixlar, tomonlar uzunligi va yaxlit sonlar (10, 20, … 90).',
    intro: 'Mixlarni taqqoslash, shakllarning tomonlarini hisoblash va yaxlit o‘nliklar bilan amallarni o‘rganamiz.',
    keyPoints: [
      'Mixlar uzunligini taqqoslash: 7 cm va 5 cm mixlar farqi 2 cm.',
      'Yaxlit sonlar: 10, 20, 30, 40, 50, 60, 70, 80, 90 (birliklari 0 bo‘lgan sonlar).',
      'Bir xil o‘lchov birligidagi uzunliklar ustida amallar bajariladi.',
    ],
    miniExample: {
      emojis: '📎 Katta mix: 8 cm, Kichik mix: 5 cm ➔ Farq = 3 cm',
      text: '8 cm li mix 5 cm li mixdan 3 cm uzun: 8 - 5 = 3 cm.',
    },
    xpReward: 95,
    coinReward: 10,
    estMinutes: 8,
    practice: [
      {
        text: 'Katta mix 8 cm, kichik mix 5 cm. Katta mix kichigidan necha cm uzun?',
        correctAnswer: '3 cm (8 - 5 = 3)',
        distractors: ['13 cm', '2 cm', '4 cm'],
        explanation: '8 - 5 = 3 cm.',
      },
      {
        text: 'Quyidagilardan qaysi biri yaxlit o‘nlik (yaxlit son) hisoblanadi?',
        correctAnswer: '40',
        distractors: ['43', '25', '17'],
        explanation: 'Oxiri 0 bilan tugaydigan o‘nliklar yaxlit sonlar deyiladi.',
      },
      {
        text: 'Uchburchakning tomonlari 10 cm, 20 cm va 30 cm. Tomonlari yig‘indisi necha cm?',
        correctAnswer: '60 cm (10 + 20 + 30 = 60)',
        distractors: ['50 cm', '70 cm', '40 cm'],
        explanation: '10 + 20 + 30 = 60 cm.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: '8 cm li mix 5 cm li mixdan necha cm uzun?',
        correctAnswer: '3 cm',
        distractors: ['2 cm', '4 cm', '13 cm'],
        explanation: '8 - 5 = 3 cm.',
      },
      {
        text: 'Qaysi qatorda faqat yaxlit sonlar yozilgan?',
        correctAnswer: '10, 20, 30, 40, 50',
        distractors: ['11, 22, 33, 44', '10, 15, 20, 25', '5, 10, 15, 20'],
        explanation: 'Birliklar xonasi 0 bo‘lgan sonlar yaxlit o‘nliklardir.',
      },
      {
        text: '20 cm + 30 cm yig‘indisi necha santimetr bo‘ladi?',
        correctAnswer: '50 cm',
        distractors: ['10 cm', '60 cm', '40 cm'],
        explanation: '20 + 30 = 50 cm.',
      },
      {
        text: '70 cm - 40 cm ayirmaning qiymatini toping:',
        correctAnswer: '30 cm',
        distractors: ['110 cm', '20 cm', '40 cm'],
        explanation: '70 - 40 = 30 cm.',
      },
      {
        text: 'Mixning uzunligi 10 cm, vint 6 cm. Vint mixdan necha cm qisqa?',
        correctAnswer: '4 cm (10 - 6 = 4)',
        distractors: ['16 cm', '3 cm', '5 cm'],
        explanation: '10 - 6 = 4 cm.',
      },
      {
        text: '50 cm necha detsimetr bo‘ladi?',
        correctAnswer: '5 dm',
        distractors: ['50 dm', '15 dm', '500 dm'],
        explanation: '50 cm = 5 dm.',
      },

      // 8 ta o'rtacha
      {
        text: 'Quruvchida 90 cm li yog‘och bor edi. U 40 cm kesib oldi. Necha santimetr yog‘och qoldi?',
        correctAnswer: '50 cm (90 - 40 = 50)',
        distractors: ['130 cm', '40 cm', '60 cm'],
        explanation: '90 - 40 = 50 cm.',
      },
      {
        text: 'Uchburchakning uchala tomoni ham 20 cm dan bo‘lsa, uning perimetri (tomonlari yig‘indisi) qancha?',
        correctAnswer: '60 cm (20 + 20 + 20 = 60)',
        distractors: ['40 cm', '50 cm', '80 cm'],
        explanation: '20 + 20 + 20 = 60 cm.',
      },
      {
        text: '1-mix 12 cm, 2-mix 8 cm, 3-mix 10 cm. Eng uzun va eng qisqa mixlar farqi qancha?',
        correctAnswer: '4 cm (12 - 8 = 4)',
        distractors: ['2 cm', '6 cm', '20 cm'],
        explanation: 'Eng uzuni 12 cm, eng qisqasi 8 cm. Farq: 12 - 8 = 4 cm.',
      },
      {
        text: '40 cm + 50 cm - 30 cm ifodaning qiymatini hisoblang:',
        correctAnswer: '60 cm (40 + 50 = 90, 90 - 30 = 60)',
        distractors: ['70 cm', '50 cm', '80 cm'],
        explanation: '90 - 30 = 60 cm.',
      },
      {
        text: 'Kvadratning tomoni 10 cm bo‘lsa, uning 4 ta tomoni yig‘indisi necha detsimetr bo‘ladi?',
        correctAnswer: '4 dm (40 cm = 4 dm)',
        distractors: ['40 dm', '2 dm', '10 dm'],
        explanation: '4 x 10 cm = 40 cm = 4 dm.',
      },
      {
        text: 'Duradgor 80 cm li taxtani 2 ta teng bo‘lakka bo‘ldi. Har bir bo‘lak necha cm?',
        correctAnswer: '40 cm (40 + 40 = 80)',
        distractors: ['30 cm', '50 cm', '20 cm'],
        explanation: '40 cm dan 2 ta bo‘lak.',
      },
      {
        text: 'Ipning uzunligi 100 cm (1 metr). Undan 30 cm va 20 cm kesib olindi. Necha cm ip qoldi?',
        correctAnswer: '50 cm (100 - 30 - 20 = 50)',
        distractors: ['40 cm', '60 cm', '70 cm'],
        explanation: '100 - 50 = 50 cm.',
      },
      {
        text: '1-sim 35 cm, 2-sim undan 15 cm uzun. 2-simning uzunligi necha dm bo‘ladi?',
        correctAnswer: '5 dm (35 + 15 = 50 cm = 5 dm)',
        distractors: ['50 dm', '4 dm', '6 dm'],
        explanation: '35 + 15 = 50 cm = 5 dm.',
      },

      // 4 ta qiyinroq
      {
        text: 'To‘g‘ri to‘rtburchakning bo‘yi 30 cm, eni 20 cm. Uning barcha 4 ta tomoni yig‘indisi qancha?',
        correctAnswer: '100 cm (30 + 20 + 30 + 20 = 100)',
        distractors: ['50 cm', '80 cm', '120 cm'],
        explanation: '30 + 20 = 50, 50 + 50 = 100 cm (1 metr).',
      },
      {
        text: 'Usta 1-kuni 30 metr, 2-kuni 40 metr, 3-kuni 20 metr to‘siq o‘rnatdi. Usta jami necha metr to‘siq o‘rnatgan?',
        correctAnswer: '90 metr (30 + 40 + 20 = 90)',
        distractors: ['80 metr', '100 metr', '70 metr'],
        explanation: '30 + 40 + 20 = 90 metr.',
      },
      {
        text: 'Lenta uzunligi 70 cm. Undan 25 cm va 15 cm kesib olindi. Necha detsimetr lenta qoldi?',
        correctAnswer: '3 dm (70 - 40 = 30 cm = 3 dm)',
        distractors: ['4 dm', '2 dm', '30 dm'],
        explanation: '70 - 40 = 30 cm = 3 dm.',
      },
      {
        text: 'Beshta har xil mix uzunliklari berilgan: 4 cm, 6 cm, 8 cm, 10 cm, 12 cm. Ularning barchasi qo‘shilsa necha santimetr bo‘ladi?',
        correctAnswer: '40 cm (4 + 6 + 8 + 10 + 12 = 40)',
        distractors: ['35 cm', '45 cm', '50 cm'],
        explanation: '4+6=10, 8+12=20, 10+20+10=40 cm.',
      },

      // 2 ta murakkab masala
      {
        text: 'Qurilishda 90 cm li temir truba ishlatildi. Undan 35 cm va 25 cm li bo‘laklar kesib olindi. Qolgan truba uzunligi necha cm bo‘ladi?',
        correctAnswer: '30 cm (90 - 35 - 25 = 30)',
        distractors: ['25 cm', '35 cm', '40 cm'],
        explanation: 'Kesildi: 35 + 25 = 60 cm. Qoldi: 90 - 60 = 30 cm.',
      },
      {
        text: 'Bog‘ yo‘lagi 100 metr. 1-brigada 40 metr, 2-brigada undan 10 metr kam yo‘lakka tosh yotqizdi. Yana necha metr yo‘lak qoldi?',
        correctAnswer: '30 metr (2-brigada: 30 m; 100 - 40 - 30 = 30)',
        distractors: ['20 metr', '40 metr', '50 metr'],
        explanation: '2-brigada: 40 - 10 = 30 m. Jami qilingani: 70 m. Qolgani: 100 - 70 = 30 metr.',
      },
    ],
  },

  // 35-dars. Massa va massa birliklari
  {
    bookNumber: 35,
    title: 'Massa va massa birliklari',
    emoji: '⚖️',
    shortDesc: 'Massa tushunchasi, kilogramm (kg) va tarozi.',
    intro: 'Predmetlarning massasini (og‘irligini) aniqlash uchun tarozi va kilogramm (kg) birligi qo‘llaniladi.',
    keyPoints: [
      'Massa o‘lchov birligi — kilogramm (kg).',
      'Tarozi poyalari teng bo‘lsa, ulardagi massalar ham teng bo‘ladi.',
      'Xarid massasi: 5 kg + 5 kg + 1 kg = 11 kg.',
    ],
    miniExample: {
      emojis: '⚖️ 5 kg olma + 5 kg nok + 1 kg uzum = 11 kg',
      text: 'Xarid savatida: 5 kg + 5 kg + 1 kg = 11 kg meva bor.',
    },
    xpReward: 95,
    coinReward: 10,
    estMinutes: 8,
    practice: [
      {
        text: 'Massa o‘lchov birligini toping:',
        correctAnswer: 'Kilogramm (kg)',
        distractors: ['Santimetr (cm)', 'Litr (l)', 'Minut'],
        explanation: 'Massa kilogrammda (kg) o‘lchanadi.',
      },
      {
        text: 'Predmetlarning massasi qaysi asbobda o‘lchanadi?',
        correctAnswer: 'Tarozi',
        distractors: ['Chizg‘ich', 'Termometr', 'Soat'],
        explanation: 'Massa tarozi yordamida o‘lchanadi.',
      },
      {
        text: 'Xaridor 5 kg un, 5 kg shakar va 1 kg tuz oldi. Jami xarid necha kg?',
        correctAnswer: '11 kg (5 + 5 + 1 = 11)',
        distractors: ['10 kg', '12 kg', '15 kg'],
        explanation: '5 + 5 + 1 = 11 kg.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'Kilogramm qisqacha qanday yoziladi?',
        correctAnswer: 'kg',
        distractors: ['km', 'cm', 'l'],
        explanation: 'Kilogramm qisqacha «kg» deb yoziladi.',
      },
      {
        text: '5 kg + 3 kg yig‘indisi necha kilogramm bo‘ladi?',
        correctAnswer: '8 kg',
        distractors: ['2 kg', '7 kg', '9 kg'],
        explanation: '5 + 3 = 8 kg.',
      },
      {
        text: 'Tarozining bir pallasida 6 kg tosh, ikkinchi pallasida tarvuz turibdi va tarozi muvozanatda. Tarvuzning massasi qancha?',
        correctAnswer: '6 kg',
        distractors: ['5 kg', '7 kg', '12 kg'],
        explanation: 'Tarozi muvozanatda bo‘lsa, tarvuz massasi tosh massasiga teng: 6 kg.',
      },
      {
        text: '10 kg un bor edi. 4 kg ishlatildi. Necha kg un qoldi?',
        correctAnswer: '6 kg (10 - 4 = 6)',
        distractors: ['14 kg', '5 kg', '7 kg'],
        explanation: '10 - 4 = 6 kg.',
      },
      {
        text: 'Qaysi biri og‘ir: 4 kg temir yoki 3 kg paxta?',
        correctAnswer: '4 kg temir (chunki 4 kg > 3 kg)',
        distractors: ['3 kg paxta', 'Ikkalasi teng', 'Bilib bo‘lmaydi'],
        explanation: '4 kg har doim 3 kg dan og‘ir.',
      },
      {
        text: '2 kg + 2 kg + 2 kg yig‘indisi necha kg?',
        correctAnswer: '6 kg',
        distractors: ['5 kg', '8 kg', '4 kg'],
        explanation: '2 + 2 + 2 = 6 kg.',
      },

      // 8 ta o'rtacha
      {
        text: 'Onam 5 kg kartoshka, 3 kg sabzi va 2 kg piyoz sotib oldilar. Xaridning jami massasi necha kg?',
        correctAnswer: '10 kg (5 + 3 + 2 = 10)',
        distractors: ['9 kg', '11 kg', '8 kg'],
        explanation: '5 + 3 + 2 = 10 kg.',
      },
      {
        text: 'Qovun 8 kg, tarvuz undan 4 kg og‘ir. Tarvuzning massasi necha kg?',
        correctAnswer: '12 kg (8 + 4 = 12)',
        distractors: ['4 kg', '10 kg', '14 kg'],
        explanation: '8 + 4 = 12 kg.',
      },
      {
        text: 'Qopda 45 kg shakar bor edi. 20 kg sotildi. Necha kg shakar qoldi?',
        correctAnswer: '25 kg (45 - 20 = 25)',
        distractors: ['65 kg', '20 kg', '30 kg'],
        explanation: '45 - 20 = 25 kg.',
      },
      {
        text: 'Tarozi pallasida 10 kg tosh bor. Ikkinchi pallasida 6 kg guruch va kichik toshcha turibdi. Tarozi teng bo‘lishi uchun toshcha necha kg bo‘lishi kerak?',
        correctAnswer: '4 kg (10 - 6 = 4)',
        distractors: ['16 kg', '5 kg', '3 kg'],
        explanation: '10 - 6 = 4 kg.',
      },
      {
        text: '1-yeshikda 14 kg olma, 2-yeshikda 12 kg nok bor. Ikkala yeshikdagi mevalar jami necha kg?',
        correctAnswer: '26 kg (14 + 12 = 26)',
        distractors: ['24 kg', '28 kg', '2 kg'],
        explanation: '14 + 12 = 26 kg.',
      },
      {
        text: 'Bozordan 18 kg meva olindi. Ulardan 10 kg olma, qolgani uzum. Necha kg uzum olingan?',
        correctAnswer: '8 kg (18 - 10 = 8)',
        distractors: ['28 kg', '7 kg', '9 kg'],
        explanation: '18 - 10 = 8 kg.',
      },
      {
        text: '50 kg bug‘doy 20 kg bug‘doydan necha kg og‘ir?',
        correctAnswer: '30 kg (50 - 20 = 30)',
        distractors: ['70 kg', '25 kg', '35 kg'],
        explanation: '50 - 20 = 30 kg.',
      },
      {
        text: 'Tenglikni to‘ldiring: 22 kg + 16 kg = □ kg',
        correctAnswer: '38 kg',
        distractors: ['36 kg', '40 kg', '6 kg'],
        explanation: '22 + 16 = 38 kg.',
      },

      // 4 ta qiyinroq
      {
        text: 'Xarid savatida 5 kg olma, 5 kg nok, 3 kg shaftoli va 2 kg anor bor. Savatdagi mevalar jami necha kg?',
        correctAnswer: '15 kg (5 + 5 + 3 + 2 = 15)',
        distractors: ['14 kg', '16 kg', '13 kg'],
        explanation: '5 + 5 = 10, 3 + 2 = 5, 10 + 5 = 15 kg.',
      },
      {
        text: 'Qopda 50 kg un bor edi. 1-kun 15 kg, 2-kun 20 kg ishlatildi. Qopda necha kg un qoldi?',
        correctAnswer: '15 kg (50 - 15 - 20 = 15)',
        distractors: ['20 kg', '10 kg', '25 kg'],
        explanation: '50 - 35 = 15 kg.',
      },
      {
        text: 'Qo‘zichoq 12 kg, buzoqcha esa undan 25 kg og‘ir. Buzoqchaning massasi qancha?',
        correctAnswer: '37 kg (12 + 25 = 37)',
        distractors: ['13 kg', '35 kg', '40 kg'],
        explanation: '12 + 25 = 37 kg.',
      },
      {
        text: 'Tarozining bir pallasida 20 kg tosh, ikkinchi pallasida esa 5 kg dan bo‘lgan 3 ta quticha turibdi. Tarozi teng bo‘lishi uchun yana necha kg qo‘yish kerak?',
        correctAnswer: '5 kg (20 - 15 = 5)',
        distractors: ['10 kg', '15 kg', '2 kg'],
        explanation: '3 x 5 = 15 kg. 20 bo‘lishi uchun: 20 - 15 = 5 kg kerak.',
      },

      // 2 ta murakkab masala
      {
        text: 'Fermer 60 kg uzum uzdi. U 25 kg uzumni bozorga sotishga jo‘natdi, 15 kg uzumdan mayiz qildi. Necha kg uzum qoldi?',
        correctAnswer: '20 kg (60 - 25 - 15 = 20)',
        distractors: ['25 kg', '15 kg', '30 kg'],
        explanation: '60 - 40 = 20 kg uzum qoldi.',
      },
      {
        text: 'Omborga 35 kg kartoshka va 25 kg sabzi keltirildi. Oshxona 30 kg sabzavot ishlatdi. Omborda necha kg sabzavot qoldi?',
        correctAnswer: '30 kg (35 + 25 - 30 = 30)',
        distractors: ['25 kg', '35 kg', '40 kg'],
        explanation: 'Jami: 35 + 25 = 60 kg. Qolgani: 60 - 30 = 30 kg.',
      },
    ],
  },

  // 36-dars. Massa va massa birliklari (2)
  {
    bookNumber: 36,
    title: 'Massa va massa birliklari (2)',
    emoji: '🌾',
    shortDesc: 'Tegirmon, uchtalab sanash (3, 6, 9, 12, 15 kg) va noma’lum massani topish.',
    intro: 'Don mahsulotlarini uchtalab sanash, noma’lum dastlabki massani topish va amallarni o‘rganamiz.',
    keyPoints: [
      'Uchtalab sanash: 3, 6, 9, 12, 15, 18 kg.',
      'Dastlabki massani topish: 8 kg olindi va 6 kg qoldi ➔ Dastlab 8 + 6 = 14 kg bo‘lgan.',
      '«30 kg va undan 2 kg ortiq» ifodasi: 30 + 2 = 32 kg.',
    ],
    miniExample: {
      emojis: '🌾 8 kg olindi ➔ 6 kg qoldi ➔ Dastlab: 8 + 6 = 14 kg',
      text: 'Qopdan 8 kg un olindi va 6 kg qoldi. Dastlab: 8 + 6 = 14 kg un bo‘lgan.',
    },
    xpReward: 95,
    coinReward: 10,
    estMinutes: 8,
    practice: [
      {
        text: 'Qopdan 8 kg bug‘doy olingach, 6 kg qoldi. Dastlab qopda necha kg bug‘doy bo‘lgan?',
        correctAnswer: '14 kg (8 + 6 = 14)',
        distractors: ['2 kg (8 - 6 = 2)', '12 kg', '16 kg'],
        explanation: 'Dastlabki massani topish uchun qo‘shamiz: 8 + 6 = 14 kg.',
      },
      {
        text: 'Uchtalab sanang: 3, 6, 9, 12, □ kg. Bo‘sh o‘rindagi son qaysi?',
        correctAnswer: '15 kg',
        distractors: ['14 kg', '16 kg', '13 kg'],
        explanation: 'Har safar 3 kg ga ortadi: 12 + 3 = 15 kg.',
      },
      {
        text: '«30 kg va undan 2 kg ortiq» massa necha kg bo‘ladi?',
        correctAnswer: '32 kg (30 + 2 = 32)',
        distractors: ['28 kg (30 - 2 = 28)', '35 kg', '30 kg'],
        explanation: '30 + 2 = 32 kg.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'Qopdan 8 kg un olingach, 6 kg un qoldi. Dastlab qopda qancha un bo‘lgan?',
        correctAnswer: '14 kg',
        distractors: ['2 kg', '12 kg', '16 kg'],
        explanation: '8 + 6 = 14 kg.',
      },
      {
        text: 'Uchtalab sanash ketma-ketligini davom ettiring: 3, 6, 9, □',
        correctAnswer: '12',
        distractors: ['10', '11', '15'],
        explanation: '9 + 3 = 12.',
      },
      {
        text: '30 kg dan 2 kg ortiq massa necha kg bo‘ladi?',
        correctAnswer: '32 kg',
        distractors: ['28 kg', '34 kg', '30 kg'],
        explanation: '30 + 2 = 32 kg.',
      },
      {
        text: '40 kg dan 5 kg kam massa necha kg?',
        correctAnswer: '35 kg',
        distractors: ['45 kg', '30 kg', '38 kg'],
        explanation: '40 - 5 = 35 kg.',
      },
      {
        text: '3 kg dan bo‘lgan 4 ta xaltada jami necha kg don bor? (3 + 3 + 3 + 3)',
        correctAnswer: '12 kg',
        distractors: ['10 kg', '15 kg', '9 kg'],
        explanation: '3 + 3 + 3 + 3 = 12 kg.',
      },
      {
        text: 'Idishdan 5 kg shakar olingach, 10 kg qoldi. Dastlab necha kg shakar bo‘lgan?',
        correctAnswer: '15 kg (5 + 10 = 15)',
        distractors: ['5 kg', '20 kg', '12 kg'],
        explanation: '5 + 10 = 15 kg.',
      },

      // 8 ta o'rtacha
      {
        text: 'Tegirmonchi 1-qopga 15 kg, 2-qopga 18 kg un soldi. Ikkala qopda necha kg un bor?',
        correctAnswer: '33 kg (15 + 18 = 33)',
        distractors: ['30 kg', '35 kg', '3 kg'],
        explanation: '15 + 18 = 33 kg.',
      },
      {
        text: 'Uchtalab sanash: 9, 12, 15, 18, □. Keyingi son qaysi?',
        correctAnswer: '21 kg',
        distractors: ['20 kg', '22 kg', '24 kg'],
        explanation: '18 + 3 = 21 kg.',
      },
      {
        text: 'Qutidan 14 kg mix olingach, 12 kg mix qoldi. Dastlab qutida necha kg mix bo‘lgan?',
        correctAnswer: '26 kg (14 + 12 = 26)',
        distractors: ['2 kg', '24 kg', '28 kg'],
        explanation: '14 + 12 = 26 kg.',
      },
      {
        text: 'Bir xaltada 25 kg, ikkinchisida undan 5 kg ortiq un bor. Ikkinchi xaltada necha kg un bor?',
        correctAnswer: '30 kg (25 + 5 = 30)',
        distractors: ['20 kg', '35 kg', '28 kg'],
        explanation: '25 + 5 = 30 kg.',
      },
      {
        text: 'Ombordan 22 kg guruch olindi va 18 kg qoldi. Dastlab omborda necha kg guruch bo‘lgan?',
        correctAnswer: '40 kg (22 + 18 = 40)',
        distractors: ['4 kg', '38 kg', '42 kg'],
        explanation: '22 + 18 = 40 kg.',
      },
      {
        text: '3 kg lik 5 ta qutining umumiy massasi qancha? (3 + 3 + 3 + 3 + 3)',
        correctAnswer: '15 kg',
        distractors: ['12 kg', '18 kg', '14 kg'],
        explanation: '3 x 5 = 15 kg.',
      },
      {
        text: 'Fermer 48 kg olma terdi. 18 kg sotilgach, necha kg olma qoldi?',
        correctAnswer: '30 kg (48 - 18 = 30)',
        distractors: ['66 kg', '28 kg', '32 kg'],
        explanation: '48 - 18 = 30 kg.',
      },
      {
        text: 'Tenglikni to‘ldiring: □ kg - 15 kg = 20 kg',
        correctAnswer: '35 kg (20 + 15 = 35)',
        distractors: ['5 kg', '30 kg', '40 kg'],
        explanation: '20 + 15 = 35 kg.',
      },

      // 4 ta qiyinroq
      {
        text: 'Tegirmonda 3 ta xalta un tortildi: 1-xalta 12 kg, 2-xalta 15 kg, 3-xalta 18 kg. Uchala xaltaning umumiy massasi necha kg?',
        correctAnswer: '45 kg (12 + 15 + 18 = 45)',
        distractors: ['40 kg', '48 kg', '42 kg'],
        explanation: '12 + 18 = 30, 30 + 15 = 45 kg.',
      },
      {
        text: 'Qopdagi bug‘doydan ertalab 15 kg, tushda 15 kg olingach, 20 kg bug‘doy qoldi. Dastlab qopda necha kg bug‘doy bo‘lgan?',
        correctAnswer: '50 kg (15 + 15 + 20 = 50)',
        distractors: ['40 kg', '45 kg', '55 kg'],
        explanation: 'Olingani: 30 kg. Qolgani: 20 kg. Jami: 30 + 20 = 50 kg.',
      },
      {
        text: 'Uchtalab sanashda 3 dan 18 gacha nechta son aytiladi? (3, 6, 9, 12, 15, 18)',
        correctAnswer: '6 ta son',
        distractors: ['5 ta son', '7 ta son', '4 ta son'],
        explanation: '3, 6, 9, 12, 15, 18 — jami 6 ta son.',
      },
      {
        text: '1-qopda 34 kg, 2-qopda undan 12 kg kam shakar bor. Ikkala qopda jami necha kg shakar bor?',
        correctAnswer: '56 kg (2-qop: 22 kg; 34 + 22 = 56)',
        distractors: ['22 kg', '54 kg', '60 kg'],
        explanation: '2-qop: 34 - 12 = 22 kg. Jami: 34 + 22 = 56 kg.',
      },

      // 2 ta murakkab masala
      {
        text: 'Tegirmon omborida 80 kg don bor edi. 1-kuni 25 kg, 2-kuni 25 kg tortildi. Qolgan don har biri 3 kg dan bo‘lgan necha xaltaga to‘g‘ri keladi? (30 kg qoldi)',
        correctAnswer: '10 ta xaltaga (30 kg = 10 x 3 kg)',
        distractors: ['8 ta xaltaga', '12 ta xaltaga', '9 ta xaltaga'],
        explanation: 'Qoldi: 80 - 50 = 30 kg. 30 kg ni 3 kg lik qilsak, 10 ta xalta bo‘ladi.',
      },
      {
        text: 'Novvoyxonaga ertalab 40 kg, tushda 35 kg un keltirildi. Kun davomida 50 kg un ishlatildi. Necha kg un qoldi?',
        correctAnswer: '25 kg (40 + 35 - 50 = 25)',
        distractors: ['20 kg', '30 kg', '35 kg'],
        explanation: 'Jami keltirilgan: 75 kg. Qolgani: 75 - 50 = 25 kg.',
      },
    ],
  },
];

console.log('Generating Part 3 Chapter 3A lessons (30-36)...');
for (const lessonDef of lessonsPart3Ch3A) {
  const seed = buildLessonSeed(lessonDef);
  saveLessonFile(3, lessonDef.bookNumber, seed);
  console.log(`✅ Saved lesson-${lessonDef.bookNumber}.json`);
}
