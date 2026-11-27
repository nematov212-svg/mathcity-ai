import { LessonDataDef, buildLessonSeed, saveLessonFile } from './generatorTypes.js';

const lessonsPart3Ch2B: LessonDataDef[] = [
  // 21-dars. Taqqoslashga doir masalalar (4)
  {
    bookNumber: 21,
    title: 'Taqqoslashga doir masalalar (4)',
    emoji: '🔍',
    shortDesc: 'Yig‘indi va ayirmani topish, sonlarni o‘sish tartibida joylashtirish.',
    intro: 'Bir vaqtning o‘zida yig‘indi va ayirmani hisoblash hamda natijalarni taqqoslab tartiblashni o‘rganamiz.',
    keyPoints: [
      '76 soni 88 dan qancha kichik: 88 − 76 = 12 ga kichik.',
      'Natijalarni o‘sish tartibida (kichigidan kattasiga) joylashtirish.',
      'Sonlar orasidagi munosabatlarni aniqlashda hisoblash aniqligi zarur.',
    ],
    miniExample: {
      emojis: '🔍 76 soni 88 dan: 88 - 76 = 12 ga kichik',
      text: '76 soni 88 dan qancha kichik? Ayiramiz: 88 - 76 = 12 ga kichik.',
    },
    xpReward: 100,
    coinReward: 10,
    estMinutes: 8,
    practice: [
      {
        text: '76 soni 88 sonidan qancha kichik?',
        correctAnswer: '12 ga (88 - 76 = 12)',
        distractors: ['10 ga', '14 ga', '164 ga'],
        explanation: '88 - 76 = 12.',
      },
      {
        text: '50 va 30 sonlarining yig‘indisi ularning ayirmasidan qancha katta?',
        correctAnswer: '60 ga (Yig‘indi: 80, Ayirma: 20; 80 - 20 = 60)',
        distractors: ['50 ga', '40 ga', '70 ga'],
        explanation: '50 + 30 = 80, 50 - 30 = 20. Farq: 80 - 20 = 60.',
      },
      {
        text: 'Qaysi son 45 dan 15 ta kichik?',
        correctAnswer: '30 (45 - 15 = 30)',
        distractors: ['60 (45 + 15 = 60)', '25', '35'],
        explanation: '45 - 15 = 30.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: '76 soni 88 dan qancha kichik?',
        correctAnswer: '12 ga kichik',
        distractors: ['10 ga kichik', '14 ga kichik', '16 ga kichik'],
        explanation: '88 - 76 = 12.',
      },
      {
        text: '40 va 20 sonlarining yig‘indisini toping:',
        correctAnswer: '60 (40 + 20 = 60)',
        distractors: ['20 (40 - 20 = 20)', '50', '70'],
        explanation: '40 + 20 = 60.',
      },
      {
        text: '40 va 20 sonlarining ayirmasini toping:',
        correctAnswer: '20 (40 - 20 = 20)',
        distractors: ['60 (40 + 20 = 60)', '10', '30'],
        explanation: '40 - 20 = 20.',
      },
      {
        text: '55 soni 75 sonidan qancha kam?',
        correctAnswer: '20 ga kam (75 - 55 = 20)',
        distractors: ['15 ga kam', '25 ga kam', '130 ga'],
        explanation: '75 - 55 = 20.',
      },
      {
        text: '68 soni 48 sonidan qancha katta?',
        correctAnswer: '20 ga katta (68 - 48 = 20)',
        distractors: ['18 ga katta', '22 ga katta', '116 ga'],
        explanation: '68 - 48 = 20.',
      },
      {
        text: 'Natijalarni o‘sish tartibida joylashtiring: 12, 5, 20, 8',
        correctAnswer: '5, 8, 12, 20',
        distractors: ['20, 12, 8, 5', '5, 12, 8, 20', '8, 5, 12, 20'],
        explanation: 'Kichigidan kattasiga: 5 < 8 < 12 < 20.',
      },

      // 8 ta o'rtacha
      {
        text: '60 va 25 sonlarining yig‘indisi nechaga teng?',
        correctAnswer: '85 (60 + 25 = 85)',
        distractors: ['35 (60 - 25 = 35)', '80', '90'],
        explanation: '60 + 25 = 85.',
      },
      {
        text: '60 va 25 sonlarining ayirmasi nechaga teng?',
        correctAnswer: '35 (60 - 25 = 35)',
        distractors: ['85 (60 + 25 = 85)', '30', '40'],
        explanation: '60 - 25 = 35.',
      },
      {
        text: '85 soni 35 sonidan qancha katta?',
        correctAnswer: '50 ga (85 - 35 = 50)',
        distractors: ['40 ga', '60 ga', '120 ga'],
        explanation: '85 - 35 = 50.',
      },
      {
        text: '34 va 43 sonlarining yig‘indisi ularning ayirmasidan (9) qancha katta?',
        correctAnswer: '68 ga (77 - 9 = 68)',
        distractors: ['77 ga', '60 ga', '70 ga'],
        explanation: 'Yig‘indi: 34 + 43 = 77. Ayirma: 43 - 34 = 9. Farq: 77 - 9 = 68.',
      },
      {
        text: 'Quyidagi ifodalarning eng kattasini toping: A) 40 + 30, B) 90 - 30, C) 50 + 15, D) 85 - 10',
        correctAnswer: 'D) 85 - 10 = 75',
        distractors: ['A) 40 + 30 = 70', 'B) 90 - 30 = 60', 'C) 50 + 15 = 65'],
        explanation: 'A=70, B=60, C=65, D=75. Eng kattasi 75.',
      },
      {
        text: '72 soni 96 dan qancha kichik?',
        correctAnswer: '24 ga (96 - 72 = 24)',
        distractors: ['20 ga', '26 ga', '168 ga'],
        explanation: '96 - 72 = 24.',
      },
      {
        text: '58 va 22 sonlarining yig‘indisi necha bo‘ladi?',
        correctAnswer: '80 (58 + 22 = 80)',
        distractors: ['36 (58 - 22 = 36)', '78', '82'],
        explanation: '58 + 22 = 80.',
      },
      {
        text: '58 va 22 sonlarining ayirmasi nechaga teng?',
        correctAnswer: '36 (58 - 22 = 36)',
        distractors: ['80', '34', '38'],
        explanation: '58 - 22 = 36.',
      },

      // 4 ta qiyinroq
      {
        text: 'Ikki sonning yig‘indisi 70 ga, ayirmasi 10 ga teng. Bu qaysi sonlar?',
        correctAnswer: '40 va 30 (40 + 30 = 70, 40 - 30 = 10)',
        distractors: ['50 va 20 (50 - 20 = 30)', '45 va 25 (45 - 25 = 20)', '35 va 35 (35 - 35 = 0)'],
        explanation: '40 + 30 = 70 va 40 - 30 = 10.',
      },
      {
        text: 'Sonlarni kamayish tartibida to‘g‘ri joylashtiring: 35 + 20, 80 - 15, 45 + 30, 90 - 40',
        correctAnswer: '75, 65, 55, 50',
        distractors: ['50, 55, 65, 75', '75, 55, 65, 50', '65, 75, 55, 50'],
        explanation: '45+30=75, 80-15=65, 35+20=55, 90-40=50. Kamayish tartibi: 75, 65, 55, 50.',
      },
      {
        text: '88 soni 99 dan qancha kichik bo‘lsa, 55 soni 66 dan shuncha kichikmi?',
        correctAnswer: 'Ha, ikkalasi ham 11 ga kichik (99 - 88 = 11, 66 - 55 = 11)',
        distractors: ['Yo‘q, biri 10 ga, biri 12 ga kichik', 'Yo‘q, teng emas', 'Bilib bo‘lmaydi'],
        explanation: '99 - 88 = 11 va 66 - 55 = 11. Ikkala farq 11 ga teng.',
      },
      {
        text: 'Birinchi son 50, ikkinchi son undan 20 ta kam, uchinchi son esa ikkinchi sondan 15 ta ko‘p. Uchinchi son qaysi?',
        correctAnswer: '45 (II: 30; 30 + 15 = 45)',
        distractors: ['35', '40', '55'],
        explanation: 'II son: 50 - 20 = 30. III son: 30 + 15 = 45.',
      },

      // 2 ta murakkab masala
      {
        text: 'O‘quvchi uchta misol yechdi: 1-misol natijasi 30, 2-misol natijasi 1-dan 15 ta ko‘p, 3-misol natijasi esa 1-va 2-misol yig‘indisidan 25 ta kam. 3-misol natijasi nechaga teng?',
        correctAnswer: '50 (2-misol: 45; 30 + 45 = 75; 75 - 25 = 50)',
        distractors: ['45', '55', '60'],
        explanation: '2-misol: 30 + 15 = 45. Yig‘indi: 30 + 45 = 75. 3-misol: 75 - 25 = 50.',
      },
      {
        text: 'Ahmad 48 ta misol yechdi. Bu Sardor yechganidan 12 ta ko‘p. Ikkala bola birgalikda nechta misol yechgan?',
        correctAnswer: '84 ta (Sardor: 36; 48 + 36 = 84)',
        distractors: ['60 ta', '72 ta', '96 ta'],
        explanation: 'Sardor Ahmadnikidan 12 ta kam: 48 - 12 = 36 ta. Jami: 48 + 36 = 84 ta.',
      },
    ],
  },

  // 22-dars. Murakkab masalalar yechish
  {
    bookNumber: 22,
    title: 'Murakkab masalalar yechish',
    emoji: '🎤',
    shortDesc: 'Murakkab ifodalar, qavslar, amallar tartibi va qulay hisoblash.',
    intro: 'Bir necha amalli murakkab ifodalarda amallar tartibi (avval qavs ichi) va qulay hisoblash usullarini qo‘llaymiz.',
    keyPoints: [
      'Amallar tartibi: har doim birinchi bo‘lib qavs ichidagi amal bajariladi.',
      'Uch miqdor yig‘indisi: 3 + 2 + 4 daqiqa = 9 daqiqa.',
      'Qulay hisoblash: yaxlit sonlarni hosil qiluvchi qo‘shiluvchilar birinchi qo‘shiladi.',
    ],
    miniExample: {
      emojis: '🎤 3 daqiqa + 2 daqiqa + 4 daqiqa = 9 daqiqa',
      text: 'Sahna nutqi: 3 daqiqa, qo‘shiq: 2 daqiqa, raqs: 4 daqiqa. Jami: 3 + 2 + 4 = 9 daqiqa.',
    },
    xpReward: 110,
    coinReward: 11,
    estMinutes: 9,
    practice: [
      {
        text: 'Konsertda qo‘shiq 3 daqiqa, raqs 2 daqiqa, sahna ko‘rinishi 4 daqiqa davom etdi. Konsert jami necha daqiqa davom etdi?',
        correctAnswer: '9 daqiqa (3 + 2 + 4 = 9)',
        distractors: ['8 daqiqa', '10 daqiqa', '7 daqiqa'],
        explanation: '3 + 2 + 4 = 9 daqiqa.',
      },
      {
        text: 'Ifodada qavs bo‘lsa, qaysi amal birinchi bajariladi?',
        correctAnswer: 'Qavs ichidagi amal',
        distractors: ['Chapdan o‘ngga qarab istalgani', 'Eng oxirgi amal', 'Faqat ayirish amali'],
        explanation: 'Matematik qoidaga ko‘ra, har doim avval qavs ichidagi amal bajariladi.',
      },
      {
        text: '15 + (10 - 4) ifodaning qiymatini hisoblang:',
        correctAnswer: '21 (qavs ichi: 6; 15 + 6 = 21)',
        distractors: ['25', '19', '29'],
        explanation: 'Qavs ichi: 10 - 4 = 6. So‘ng: 15 + 6 = 21.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: '3 + 2 + 4 ifodaning qiymati nechaga teng?',
        correctAnswer: '9',
        distractors: ['8', '10', '7'],
        explanation: '3 + 2 = 5, 5 + 4 = 9.',
      },
      {
        text: '20 + (15 - 5) ifodada birinchi qaysi amal bajariladi?',
        correctAnswer: 'Qavs ichidagi 15 - 5 ayirish amali',
        distractors: ['20 + 15 qo‘shish amali', 'Ixtiyoriy amal', 'Hech biri'],
        explanation: 'Avval qavs ichidagi amal bajariladi.',
      },
      {
        text: '20 + (15 - 5) ifodaning yakuniy qiymatini toping:',
        correctAnswer: '30 (15 - 5 = 10, 20 + 10 = 30)',
        distractors: ['25', '35', '40'],
        explanation: 'Qavs ichi 10, 20 + 10 = 30.',
      },
      {
        text: '50 - (20 + 10) ifodaning qiymati necha bo‘ladi?',
        correctAnswer: '20 (20 + 10 = 30, 50 - 30 = 20)',
        distractors: ['40', '30', '10'],
        explanation: '50 - 30 = 20.',
      },
      {
        text: 'Qulay usulda hisoblang: (14 + 6) + 15',
        correctAnswer: '35 (20 + 15 = 35)',
        distractors: ['30', '40', '25'],
        explanation: '14 + 6 = 20, 20 + 15 = 35.',
      },
      {
        text: 'Maktab festivalida 4 ta she’r, 3 ta qo‘shiq va 5 ta raqs ijro etildi. Jami nechta chiqish bo‘ldi?',
        correctAnswer: '12 ta (4 + 3 + 5 = 12)',
        distractors: ['10 ta', '11 ta', '13 ta'],
        explanation: '4 + 3 + 5 = 12 ta chiqish.',
      },

      // 8 ta o'rtacha
      {
        text: 'Qulay hisoblash usulini qo‘llang: 27 + 13 + 30',
        correctAnswer: '70 (27 + 13 = 40, 40 + 30 = 70)',
        distractors: ['60', '80', '65'],
        explanation: '27 + 13 = 40 (yaxlit son). 40 + 30 = 70.',
      },
      {
        text: '68 - (18 + 20) ifodaning qiymatini toping:',
        correctAnswer: '30 (18 + 20 = 38, 68 - 38 = 30)',
        distractors: ['20', '40', '50'],
        explanation: '68 - 38 = 30.',
      },
      {
        text: 'Xonandaning 1-qo‘shig‘i 4 daqiqa, 2-qo‘shig‘i 3 daqiqa, 3-qo‘shig‘i 5 daqiqa davom etdi. Qo‘shiqlar jami necha daqiqa yangragan?',
        correctAnswer: '12 daqiqa (4 + 3 + 5 = 12)',
        distractors: ['10 daqiqa', '11 daqiqa', '14 daqiqa'],
        explanation: '4 + 3 = 7, 7 + 5 = 12 daqiqa.',
      },
      {
        text: '(45 + 25) - 30 ifodaning qiymatini hisoblang:',
        correctAnswer: '40 (45 + 25 = 70, 70 - 30 = 40)',
        distractors: ['30', '50', '60'],
        explanation: '70 - 30 = 40.',
      },
      {
        text: 'Qaysi ifodaning qiymati 50 ga teng?',
        correctAnswer: '80 - (20 + 10)',
        distractors: ['80 - (20 - 10)', '80 + (20 - 10)', '50 - (20 + 10)'],
        explanation: '80 - 30 = 50.',
      },
      {
        text: 'Bog‘bon 1-daraxtdan 18 kg, 2-daraxtdan 12 kg, 3-daraxtdan 25 kg meva uzdi. Qulay usulda jami hosilni toping:',
        correctAnswer: '55 kg (18 + 12 = 30, 30 + 25 = 55)',
        distractors: ['50 kg', '60 kg', '45 kg'],
        explanation: '18 + 12 = 30, 30 + 25 = 55 kg.',
      },
      {
        text: '90 - (45 + 15) ifodaning qiymatini hisoblang:',
        correctAnswer: '30 (45 + 15 = 60, 90 - 60 = 30)',
        distractors: ['20', '40', '50'],
        explanation: '90 - 60 = 30.',
      },
      {
        text: '34 + (56 - 26) ifodaning qiymatini toping:',
        correctAnswer: '64 (56 - 26 = 30, 34 + 30 = 64)',
        distractors: ['60', '70', '54'],
        explanation: '34 + 30 = 64.',
      },

      // 4 ta qiyinroq
      {
        text: 'Konsert zalida 100 ta joy bor. 1-qatorga 25 ta, 2-qatorga 25 ta, 3-qatorga 30 ta tomoshabin o‘tirdi. Nechta bo‘sh joy qoldi?',
        correctAnswer: '20 ta (25 + 25 + 30 = 80; 100 - 80 = 20)',
        distractors: ['15 ta', '25 ta', '30 ta'],
        explanation: 'Jami tomoshabinlar: 25 + 25 + 30 = 80. Bo‘sh joylar: 100 - 80 = 20 ta.',
      },
      {
        text: '(36 + 14) + (28 + 12) ifodani qulay usulda hisoblang:',
        correctAnswer: '90 (50 + 40 = 90)',
        distractors: ['80', '100', '85'],
        explanation: '36 + 14 = 50, 28 + 12 = 40. Jami: 50 + 40 = 90.',
      },
      {
        text: '100 - (35 + 25 + 10) ifodaning qiymatini toping:',
        correctAnswer: '30 (35 + 25 + 10 = 70; 100 - 70 = 30)',
        distractors: ['20', '40', '25'],
        explanation: 'Qavs ichi: 70. 100 - 70 = 30.',
      },
      {
        text: 'Avtobusda 45 yo‘lovchi bor edi. 1-bekatda (10 - 2) nafar tushdi, 2-bekatda 12 nafar chiqdi. Yo‘lovchilar soni qancha bo‘ldi?',
        correctAnswer: '49 nafar (45 - 8 + 12 = 49)',
        distractors: ['47 nafar', '50 nafar', '45 nafar'],
        explanation: 'Tushganlar: 10 - 2 = 8 nafar. 45 - 8 = 37 nafar. 37 + 12 = 49 nafar.',
      },

      // 2 ta murakkab masala
      {
        text: 'Sahna pardasi uchun 3 ta bo‘lak mato olindi: 1-bo‘lak 16 metr, 2-bo‘lak 14 metr va 3-bo‘lak 20 metr. Tikuvchi 40 metr ishlatdi. Necha metr mato qoldi?',
        correctAnswer: '10 metr (16 + 14 + 20 = 50; 50 - 40 = 10)',
        distractors: ['15 metr', '5 metr', '20 metr'],
        explanation: 'Jami mato: 16 + 14 + 20 = 50 metr. Qolgani: 50 - 40 = 10 metr.',
      },
      {
        text: 'Kutubxonada 3 ta sinf o‘quvchilari kitob o‘qishmoqda: 1-sinfdan 22 nafar, 2-sinfdan 18 nafar, 3-sinfdan 25 nafar. 30 nafar bola uyiga ketgach, kutubxonada necha bola qoldi?',
        correctAnswer: '35 nafar (22 + 18 + 25 = 65; 65 - 30 = 35)',
        distractors: ['30 nafar', '40 nafar', '25 nafar'],
        explanation: 'Jami bolalar: 22 + 18 + 25 = 65 nafar. Qolgani: 65 - 30 = 35 nafar bola.',
      },
    ],
  },

  // 23-dars. Shartni yetishmayotgan ma’lumotlar bilan to‘ldirish
  {
    bookNumber: 23,
    title: 'Shartni yetishmayotgan ma’lumotlar bilan to‘ldirish',
    emoji: '📝',
    shortDesc: 'To‘liqsiz shartni aniqlash, savol qo‘yish va vaqt birliklari (60 minut).',
    intro: 'Masalani yechish uchun yetishmayotgan son yoki ma’lumotni aniqlash va shartni to‘ldirishni o‘rganamiz.',
    keyPoints: [
      'To‘liqsiz shart: ma’lumot yetarli bo‘lmasa, masalani yechib bo‘lmaydi.',
      'Shartni to‘ldirish: fotosuratlar masalasi (12 ta oq-qora va 45 ta rangli).',
      'Vaqt birliklari munosabati: 1 soat = 60 minut.',
    ],
    miniExample: {
      emojis: '📸 12 ta oq-qora + 45 ta rangli fotosurat = 57 ta',
      text: 'Albomda 12 ta oq-qora fotosurat bor. Yana 45 ta rangli surat qo‘shildi. Jami: 12 + 45 = 57 ta.',
    },
    xpReward: 110,
    coinReward: 11,
    estMinutes: 9,
    practice: [
      {
        text: '«Savatda 15 ta olma bor edi, bir nechtasi yeyildi. Nechta olma qoldi?» Masalani yechish uchun nima yetishmayapti?',
        correctAnswer: 'Nechta olma yeyilgani (son ma’lumoti)',
        distractors: ['Olmaning rangi', 'Savatning kattaligi', 'Savol yetishmayapti'],
        explanation: 'Yeyilgan olmalar soni aytilmagani sababli masalani yechib bo‘lmaydi.',
      },
      {
        text: 'Albomda 12 ta oq-qora va 45 ta rangli fotosurat bor. Albomda jami nechta fotosurat bor?',
        correctAnswer: '57 ta (12 + 45 = 57)',
        distractors: ['55 ta', '60 ta', '33 ta'],
        explanation: '12 + 45 = 57 ta fotosurat.',
      },
      {
        text: '1 soat necha minutga teng?',
        correctAnswer: '60 minut',
        distractors: ['100 minut', '30 minut', '24 minut'],
        explanation: '1 soat 60 minutdan iborat.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: '1 soat necha minutdan iborat?',
        correctAnswer: '60 minut',
        distractors: ['30 minut', '100 minut', '24 minut'],
        explanation: '1 soat = 60 minut.',
      },
      {
        text: '«Anvar 10 ta qalam sotib oldi. U qancha pul to‘ladi?» Bu masalani yechish uchun nima yetishmayapti?',
        correctAnswer: 'Bitta qalamning narxi',
        distractors: ['Anvarning yoshi', 'Qalamning rangi', 'Do‘konning nomi'],
        explanation: 'Bitta qalam narxi ma’lum bo‘lsa, umumiy to‘lovni hisoblash mumkin.',
      },
      {
        text: '12 ta oq-qora va 45 ta rangli fotosurat jami nechta bo‘ladi?',
        correctAnswer: '57 ta (12 + 45 = 57)',
        distractors: ['55 ta', '58 ta', '33 ta'],
        explanation: '12 + 45 = 57 ta.',
      },
      {
        text: 'Dars 45 minut davom etdi. Tanaffus 15 minut bo‘ldi. Ikkalasi birgalikda necha minut bo‘ladi?',
        correctAnswer: '60 minut (1 soat)',
        distractors: ['50 minut', '70 minut', '30 minut'],
        explanation: '45 + 15 = 60 minut = 1 soat.',
      },
      {
        text: '«Sinfda 25 ta o‘quvchi bor. Bugun bir necha kishi kelmadi.» Masala bo‘lishi uchun qaysi savol mos keladi?',
        correctAnswer: 'Necha kishi darsga qatnashmoqda?',
        distractors: ['Ertaga ob-havo qanday bo‘ladi?', 'Partalar nechanchi xonada?', 'Tanaffus qachon?'],
        explanation: 'Davomatga oid savol masalani to‘ldiradi.',
      },
      {
        text: 'Yarim soat necha minutga teng?',
        correctAnswer: '30 minut (60 minutning yarmi)',
        distractors: ['15 minut', '45 minut', '50 minut'],
        explanation: '60 minutning yarmi 30 minutdir.',
      },

      // 8 ta o'rtacha
      {
        text: 'Sayyoh Toshkentdan poyezdda 40 minut, so‘ng avtobusda 20 minut yurdi. U jami necha soat yo‘l yurgan?',
        correctAnswer: '1 soat (40 + 20 = 60 minut = 1 soat)',
        distractors: ['2 soat', 'yarim soat', '60 soat'],
        explanation: '40 + 20 = 60 minut = 1 soat.',
      },
      {
        text: '«Fotogalereyada 30 ta tabiat manzarasi bor edi. Yana bir qancha shahar suratlari osildi va jami 50 ta surat bo‘ldi.» Shahar suratlari nechta?',
        correctAnswer: '20 ta (50 - 30 = 20)',
        distractors: ['80 ta', '15 ta', '25 ta'],
        explanation: '50 - 30 = 20 ta shahar surati.',
      },
      {
        text: 'Albomdagi 60 ta rasmdan 25 tasi rangli, qolgani oq-qora. Oq-qora suratlar nechta?',
        correctAnswer: '35 ta (60 - 25 = 35)',
        distractors: ['85 ta', '30 ta', '40 ta'],
        explanation: '60 - 25 = 35 ta.',
      },
      {
        text: '«Gulnoza 20 ta misol yechdi. Nodira esa undan □ ta ortiq yechdi. Nodira nechta misol yechgan?» Masala to‘liq bo‘lishi uchun bo‘sh katakka nima kerak?',
        correctAnswer: 'Aniq son (masalan, 5)',
        distractors: ['Rangli rasm', 'Nuqta belgisi', 'So‘roq belgisi'],
        explanation: 'Shart to‘liq bo‘lishi uchun qancha ortiqligi aniq son bilan ifodalanishi kerak.',
      },
      {
        text: '1 soatdan 15 minut kam vaqt necha minut bo‘ladi?',
        correctAnswer: '45 minut (60 - 15 = 45)',
        distractors: ['50 minut', '40 minut', '75 minut'],
        explanation: '60 - 15 = 45 minut.',
      },
      {
        text: '1 soatdan 20 minut kam vaqt qancha bo‘ladi?',
        correctAnswer: '40 minut (60 - 20 = 40)',
        distractors: ['35 minut', '50 minut', '80 minut'],
        explanation: '60 - 20 = 40 minut.',
      },
      {
        text: 'Albomga 1-kuni 14 ta, 2-kuni 22 ta surat joylandi. Yana 10 ta surat joylansa, jami suratlar soni nechta bo‘ladi?',
        correctAnswer: '46 ta (14 + 22 + 10 = 46)',
        distractors: ['44 ta', '48 ta', '36 ta'],
        explanation: '14 + 22 = 36, 36 + 10 = 46 ta.',
      },
      {
        text: 'Poyezd bekatda 25 minut turdi. 1 soat bo‘lishi uchun yana necha minut turishi kerak edi?',
        correctAnswer: '35 minut (60 - 25 = 35)',
        distractors: ['30 minut', '40 minut', '85 minut'],
        explanation: '60 - 25 = 35 minut.',
      },

      // 4 ta qiyinroq
      {
        text: 'Film 1 soat (60 minut) davom etadi. Dilorom filmning 35 minutini ko‘rdi. Film tugashiga yana necha minut qoldi?',
        correctAnswer: '25 minut (60 - 35 = 25)',
        distractors: ['20 minut', '30 minut', '15 minut'],
        explanation: '60 - 35 = 25 minut.',
      },
      {
        text: 'Shartni to‘ldiring: «Avtobusda 50 yo‘lovchi bor edi. Bekatda bir nechta tushib, 10 tasi chiqdi va 40 kishi bo‘ldi». Necha kishi tushgan?',
        correctAnswer: '20 nafar (50 + 10 - 40 = 20)',
        distractors: ['10 nafar', '15 nafar', '25 nafar'],
        explanation: '50 + 10 = 60 nafar bo‘lardi, lekin 40 nafar qoldi. Demak 60 - 40 = 20 nafar tushgan.',
      },
      {
        text: 'Akmal uy vazifasini bajarishga 1 soat (60 minut) sarfladi: 25 minut matematika, 20 minut ona tili, qolgan vaqtda rasm chizdi. Rasm chizishga necha minut ketgan?',
        correctAnswer: '15 minut (60 - 25 - 20 = 15)',
        distractors: ['10 minut', '20 minut', '25 minut'],
        explanation: '25 + 20 = 45 minut. Rasmga: 60 - 45 = 15 minut.',
      },
      {
        text: 'Albomdagi 80 ta rasmdan 30 tasi oq-qora, 35 tasi rangli, qolgani esa chizilgan rasmlar. Chizilgan rasmlar nechta?',
        correctAnswer: '15 ta (80 - 30 - 35 = 15)',
        distractors: ['10 ta', '20 ta', '25 ta'],
        explanation: '30 + 35 = 65 ta. Chizilgan rasmlar: 80 - 65 = 15 ta.',
      },

      // 2 ta murakkab masala
      {
        text: 'Sportchi 1 soat (60 minut) mashg‘ulot o‘tkazdi: 20 minut yugurdi, 15 minut sakradi, 10 minut dam oldi va qolgan vaqtda suzdi. Sportchi necha minut suzgan?',
        correctAnswer: '15 minut (60 - 20 - 15 - 10 = 15)',
        distractors: ['10 minut', '20 minut', '25 minut'],
        explanation: '20 + 15 + 10 = 45 minut. Suzishga: 60 - 45 = 15 minut sarflagan.',
      },
      {
        text: 'Fotoapparat xotirasida 90 ta rasm bor edi. Ulardan 40 tasi Toshkentda, 25 tasi Samarqandda, qolgani Buxoroda olingan. Buxoroda nechta rasm olingan?',
        correctAnswer: '25 ta (90 - 40 - 25 = 25)',
        distractors: ['20 ta', '30 ta', '35 ta'],
        explanation: '40 + 25 = 65 ta. Buxoroda: 90 - 65 = 25 ta rasm olingan.',
      },
    ],
  },

  // 24-dars. Nostandart masalalar
  {
    bookNumber: 24,
    title: 'Nostandart masalalar',
    emoji: '🧠',
    shortDesc: 'Mantiqiy masalalar va kombinatsiyalarni sanash.',
    intro: 'Mantiqiy fikrlash, tanlov variantlarini sanash va nostandart yondashuv talab qiladigan qiziqarli masalalar.',
    keyPoints: [
      'Variantlarni sanash: 2 xil sharbat va 2 xil somsa ➔ 2 × 2 = 4 xil tushlik kombinatsiyasi.',
      'Finjon tanlash: 4 ta turli finjondan 2 tasini tanlash usullari.',
      'Mantiqiy xulosalar: qatorlar, o‘rindiqlar va qoidalar asosida to‘g‘ri javob topiladi.',
    ],
    miniExample: {
      emojis: '🧠 2 xil sharbat (olma, o‘rik) va 2 xil somsa (go‘shtli, qovoqli) ➔ 4 kombinatsiya',
      text: 'Har bir sharbat bilan somsa tanlansa: 2 x 2 = 4 xil tanlov qilish mumkin.',
    },
    xpReward: 115,
    coinReward: 11,
    estMinutes: 9,
    practice: [
      {
        text: 'Oshxonada 2 xil sharbat (olma, nok) va 2 xil somsa (go‘shtli, ko‘katli) bor. Necha xil tushlik tanlash mumkin?',
        correctAnswer: '4 xil (2 x 2 = 4)',
        distractors: ['2 xil', '3 xil', '5 xil'],
        explanation: 'Har bir sharbatga 2 xil somsa to‘g‘ri keladi: 2 x 2 = 4 xil kombinatsiya.',
      },
      {
        text: 'Stolda 4 ta turli finjon turibdi. Ulardan 2 tasini tanlab olish mumkin bo‘lgan usullar soni nechta?',
        correctAnswer: '6 ta usul',
        distractors: ['4 ta usul', '8 ta usul', '2 ta usul'],
        explanation: '4 ta finjondan juftliklar: (1,2), (1,3), (1,4), (2,3), (2,4), (3,4) — jami 6 ta usul.',
      },
      {
        text: '3 ta bola (Ali, Vali, G‘ani) bir qatorda necha xil usulda saflanishi mumkin?',
        correctAnswer: '6 xil usulda',
        distractors: ['3 xil', '4 xil', '9 xil'],
        explanation: '1-o‘ringa 3 ta, 2-o‘ringa 2 ta, 3-o‘ringa 1 ta tanlov: 3 x 2 x 1 = 6 xil usul.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'Jasurda 2 xil ko‘ylak va 2 xil shim bor. U necha xil kiyim to‘plamini kiyishi mumkin?',
        correctAnswer: '4 xil (2 x 2 = 4)',
        distractors: ['2 xil', '3 xil', '5 xil'],
        explanation: '2 xil ko‘ylak x 2 xil shim = 4 xil to‘plam.',
      },
      {
        text: 'Diloromda qizil va sariq lenta bor. U ularni necha xil tartibda taqishi mumkin?',
        correctAnswer: '2 xil (qizil-sariq yoki sariq-qizil)',
        distractors: ['1 xil', '3 xil', '4 xil'],
        explanation: 'Faqat 2 xil tartib mavjud.',
      },
      {
        text: 'Bo‘sh stollar raqamlangan: 1, 2, 3, 4. Ikki do‘st nechanchi stollarga o‘tirishi mumkin?',
        correctAnswer: 'Istalgan ikkita bo‘sh stolga (masalan, 1 va 2)',
        distractors: ['Faqat bitta stolga birga', 'Faqat 0-stolga', 'Stolga o‘tirish mumkin emas'],
        explanation: 'Bo‘sh stollardan istalgan ikkitasini tanlash mumkin.',
      },
      {
        text: '3 xil meva bor: olma, nok, shaftoli. Ulardan 2 xilini tanlashning necha usuli bor?',
        correctAnswer: '3 ta usul (olma-nok, olma-shaftoli, nok-shaftoli)',
        distractors: ['2 ta usul', '4 ta usul', '6 ta usul'],
        explanation: 'Jami 3 ta juftlik hosil qilish mumkin.',
      },
      {
        text: 'Shoxruhning 3 ta o‘yinchog‘i bor: mashina, robot, to‘p. U qutiga 1 ta o‘yinchoq solmoqchi. Necha xil tanlov bor?',
        correctAnswer: '3 xil tanlov',
        distractors: ['1 xil', '2 xil', '6 xil'],
        explanation: 'Har bir o‘yinchoq bitta tanlov imkoniyatidir (jami 3 xil).',
      },
      {
        text: 'Tanga tashlanganda necha xil natija chiqishi mumkin?',
        correctAnswer: '2 xil (gerb yoki raqam)',
        distractors: ['1 xil', '3 xil', '4 xil'],
        explanation: 'Tanganing 2 ta tomoni bor: gerb yoki raqam.',
      },

      // 8 ta o'rtacha
      {
        text: 'Oshxonada 3 xil ichimlik (choy, qahva, sharbat) va 2 xil shirinlik (tort, pirog) bor. Necha xil tushlik to‘plami tanlash mumkin?',
        correctAnswer: '6 xil (3 x 2 = 6)',
        distractors: ['5 xil', '7 xil', '9 xil'],
        explanation: '3 x 2 = 6 xil kombinatsiya.',
      },
      {
        text: '4 ta finjondan 2 tasini tanlash necha xil usulda bo‘ladi?',
        correctAnswer: '6 xil usulda',
        distractors: ['4 xil', '8 xil', '2 xil'],
        explanation: 'Juftliklar soni 6 ta bo‘ladi.',
      },
      {
        text: 'Sinfda 4 ta bo‘sh parta bor. 2 nafar yangi o‘quvchi qaysi partalarga o‘tirishi mumkin? Variantlar soni nechta?',
        correctAnswer: '6 xil partalar juftligi',
        distractors: ['4 xil', '8 xil', '2 xil'],
        explanation: '4 ta partadan 2 tasini tanlash: 6 xil usul.',
      },
      {
        text: 'Anvar qora va jigarrang poyabzalga, oq, kulrang va qora paypoqlarga ega. Necha xil kombinatsiya kiyishi mumkin?',
        correctAnswer: '6 xil (2 x 3 = 6)',
        distractors: ['5 xil', '8 xil', '4 xil'],
        explanation: '2 xil poyabzal x 3 xil paypoq = 6 xil kombinatsiya.',
      },
      {
        text: 'Akrom, Botir va Sardor marraga ketma-ket yetib kelishdi. Hech kim bir vaqtda kelmagan bo‘lsa, ular necha xil tartibda kelgan bo‘lishi mumkin?',
        correctAnswer: '6 xil tartibda (3 x 2 x 1 = 6)',
        distractors: ['3 xil', '4 xil', '9 xil'],
        explanation: '3 kishining o‘rin almashishi: 3 x 2 x 1 = 6 xil tartib.',
      },
      {
        text: 'Qutida 1 ta qizil, 1 ta yashil va 1 ta ko‘k shar bor. Ikkita shar olinganda necha xil rang juftligi chiqishi mumkin?',
        correctAnswer: '3 xil (qizil-yashil, qizil-ko‘k, yashil-ko‘k)',
        distractors: ['2 xil', '4 xil', '6 xil'],
        explanation: 'Uchta shardan 2 tasini tanlash 3 xil usulda bo‘ladi.',
      },
      {
        text: 'Muzqaymoq do‘konida 2 xil idish (stakan, vafli) va 4 xil ta’m (qulupnay, shokolad, vanil, banan) bor. Necha xil muzqaymoq buyurtma qilish mumkin?',
        correctAnswer: '8 xil (2 x 4 = 8)',
        distractors: ['6 xil', '10 xil', '12 xil'],
        explanation: '2 x 4 = 8 xil variant.',
      },
      {
        text: 'Doskaga 1 va 2 raqamlarini ishlatib, raqamlari takrorlanmaydigan nechta ikki xonali son yozish mumkin?',
        correctAnswer: '2 ta (12 va 21)',
        distractors: ['1 ta', '3 ta', '4 ta'],
        explanation: '12 va 21 — jami 2 ta son.',
      },

      // 4 ta qiyinroq
      {
        text: 'Doskaga 1, 2 va 3 raqamlarini ishlatib, raqamlari takrorlanmaydigan nechta ikki xonali son yozish mumkin?',
        correctAnswer: '6 ta (12, 13, 21, 23, 31, 32)',
        distractors: ['3 ta', '5 ta', '9 ta'],
        explanation: 'Birinchi o‘ringa 3 ta, ikkinchi o‘ringa 2 ta raqam: 3 x 2 = 6 ta son.',
      },
      {
        text: 'To‘rtta do‘st (A, B, C, D) bir-biri bilan qo‘l berib ko‘rishdi. Jami necha marta qo‘l berib ko‘rishilgan?',
        correctAnswer: '6 marta (3 + 2 + 1 = 6)',
        distractors: ['4 marta', '8 marta', '12 marta'],
        explanation: 'Har bir juftlik 1 marta ko‘rishadi: 3 + 2 + 1 = 6 marta.',
      },
      {
        text: 'Pochta qutisiga 2 xil marka yopishtirish kerak. 4 xil turli marka bor bo‘lsa, necha xil usulda 2 ta marka tanlash mumkin?',
        correctAnswer: '6 xil usulda',
        distractors: ['4 xil', '8 xil', '12 xil'],
        explanation: '4 tadan 2 tasini tanlash: 6 xil usul.',
      },
      {
        text: 'Uchta harfdan (A, B, C) foydalanib, harflari takrorlanmaydigan nechta 3 harfli so‘z (kod) tuzish mumkin?',
        correctAnswer: '6 ta kod',
        distractors: ['3 ta', '4 ta', '9 ta'],
        explanation: 'ABC, ACB, BAC, BCA, CAB, CBA — jami 6 ta kod.',
      },

      // 2 ta murakkab masala
      {
        text: 'Restoranda 3 xil birinchi taom, 3 xil ikkinchi taom va 2 xil ichimlik bor. Bir kishi to‘liq tushlik (1-taom, 2-taom, ichimlik) tanlashining necha xil usuli mavjud?',
        correctAnswer: '18 xil usul (3 x 3 x 2 = 18)',
        distractors: ['8 xil', '12 xil', '15 xil'],
        explanation: '3 x 3 x 2 = 18 xil to‘liq tushlik kombinatsiyasi.',
      },
      {
        text: '5 ta do‘st uchrashib, har biri qolgan barcha do‘stlari bilan bittadan esdalik sovg‘asi almashdi. Jami nechta sovg‘a berilgan?',
        correctAnswer: '20 ta (har biri 4 tadan: 5 x 4 = 20)',
        distractors: ['10 ta', '15 ta', '25 ta'],
        explanation: 'Har bir bola 4 ta do‘stiga sovg‘a beradi: 5 x 4 = 20 ta sovg‘a beriladi.',
      },
    ],
  },

  // 25-dars. Ikki amalli masalalar yechish
  {
    bookNumber: 25,
    title: 'Ikki amalli masalalar yechish',
    emoji: '🪆',
    shortDesc: 'Tarkibli masalalar va ikki amalli murakkab ifodalar.',
    intro: 'Bir vaqtning o‘zida ikkita savolga javob beruvchi ikki amalli tarkibli masalalarni yechishni o‘rganamiz.',
    keyPoints: [
      'Tarkibli masala: savoliga javob berish uchun kamida 2 ta amal bajariladi.',
      'Misol: 12 ta ko‘ylak, Komila undan 2 ta ko‘p tikdi ➔ 12 + (12 + 2) = 26 ta.',
      'Avval oraliq noma’lum miqdor, so‘ng masalaning asosiy savoli topiladi.',
    ],
    miniExample: {
      emojis: '🪆 Oysha: 12 ta ko‘ylak, Komila: 12 + 2 = 14 ta ➔ Jami = 26 ta',
      text: 'Oysha 12 ta ko‘ylak tikdi. Komila undan 2 ta ko‘p tikdi. Ikkalasi birgalikda: 12 + (12 + 2) = 26 ta.',
    },
    xpReward: 115,
    coinReward: 11,
    estMinutes: 9,
    practice: [
      {
        text: 'Oysha 12 ta ko‘ylak tikdi. Komila undan 2 ta ko‘p tikdi. Ikkala qiz jami nechta ko‘ylak tikdi?',
        correctAnswer: '26 ta (Komila: 14; 12 + 14 = 26)',
        distractors: ['14 ta', '24 ta', '28 ta'],
        explanation: 'Komila: 12 + 2 = 14 ta. Jami: 12 + 14 = 26 ta.',
      },
      {
        text: 'Bir amalda yechib bo‘lmaydigan, kamida ikkita amal talab qiluvchi masala nima deb ataladi?',
        correctAnswer: 'Tarkibli (ikki amalli) masala',
        distractors: ['Sodda masala', 'Amalsiz masala', 'Boshqotirma'],
        explanation: 'Ikki yoki undan ortiq amal bilan yechiladigan masala tarkibli masala deyiladi.',
      },
      {
        text: 'Anvarda 10 ta yong‘oq bor. Akmalda undan 4 ta ko‘p. Ikkala bolada jami nechta yong‘oq bor?',
        correctAnswer: '24 ta (Akmal: 14; 10 + 14 = 24)',
        distractors: ['14 ta', '20 ta', '28 ta'],
        explanation: 'Akmal: 10 + 4 = 14 ta. Jami: 10 + 14 = 24 ta.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'Tarkibli masalada kamida nechta amal bajariladi?',
        correctAnswer: 'Kamida 2 ta amal',
        distractors: ['Faqat 1 ta amal', 'Hech qanday amal', 'Faqat taqqoslash'],
        explanation: 'Tarkibli masalalar 2 yoki undan ortiq amal yordamida yechiladi.',
      },
      {
        text: '12 + (12 + 2) ifodaning qiymatini hisoblang:',
        correctAnswer: '26',
        distractors: ['24', '28', '14'],
        explanation: 'Qavs ichi 14, 12 + 14 = 26.',
      },
      {
        text: 'Jasur 8 ta rasm chizdi, ukasi esa undan 2 ta kam chizdi. Ikkala bola jami nechta rasm chizgan?',
        correctAnswer: '14 ta (Ukasi: 6; 8 + 6 = 14)',
        distractors: ['6 ta', '16 ta', '12 ta'],
        explanation: 'Ukasi: 8 - 2 = 6 ta. Jami: 8 + 6 = 14 ta rasm.',
      },
      {
        text: '1-javonda 15 ta kitob, 2-javonda undan 5 ta ko‘p kitob bor. Ikkala javonda jami nechta kitob bor?',
        correctAnswer: '35 ta (2-javon: 20; 15 + 20 = 35)',
        distractors: ['20 ta', '30 ta', '40 ta'],
        explanation: '2-javon: 15 + 5 = 20 ta. Jami: 15 + 20 = 35 ta.',
      },
      {
        text: '10 + (10 - 3) ifodaning qiymati necha bo‘ladi?',
        correctAnswer: '17',
        distractors: ['7', '20', '13'],
        explanation: '10 - 3 = 7, 10 + 7 = 17.',
      },
      {
        text: 'Dardona 7 ta gul terdi, singlisi undan 3 ta ko‘p terdi. Ikkalasi birgalikda nechta gul tergan?',
        correctAnswer: '17 ta (Singlisi: 10; 7 + 10 = 17)',
        distractors: ['10 ta', '14 ta', '20 ta'],
        explanation: 'Singlisi: 7 + 3 = 10 ta. Jami: 7 + 10 = 17 ta.',
      },

      // 8 ta o'rtacha
      {
        text: 'Tikuvchi 1-kuni 16 ta, 2-kuni undan 4 ta ko‘p ko‘ylak tikdi. Tikuvchi ikki kunda jami nechta ko‘ylak tikkan?',
        correctAnswer: '36 ta (2-kun: 20; 16 + 20 = 36)',
        distractors: ['20 ta', '32 ta', '40 ta'],
        explanation: '2-kun: 16 + 4 = 20 ta. Jami: 16 + 20 = 36 ta.',
      },
      {
        text: 'Savatda 25 ta qizil olma bor. Yashil olmalar qizil olmalardan 10 ta kam. Savatda jami nechta olma bor?',
        correctAnswer: '40 ta (Yashil: 15; 25 + 15 = 40)',
        distractors: ['15 ta', '35 ta', '50 ta'],
        explanation: 'Yashil: 25 - 10 = 15 ta. Jami: 25 + 15 = 40 ta.',
      },
      {
        text: '20 + (20 + 15) ifodaning qiymatini hisoblang:',
        correctAnswer: '55',
        distractors: ['35', '50', '60'],
        explanation: 'Qavs ichi 35, 20 + 35 = 55.',
      },
      {
        text: 'Avtobusda 30 yo‘lovchi bor edi. Bekatda 10 kishi tushdi va 5 kishi chiqdi. Avtobusda necha yo‘lovchi qoldi?',
        correctAnswer: '25 nafar (30 - 10 + 5 = 25)',
        distractors: ['20 nafar', '35 nafar', '15 nafar'],
        explanation: '30 - 10 = 20, 20 + 5 = 25 nafar.',
      },
      {
        text: 'Do‘konda 34 ta qalam bor edi. Ertalab 12 ta, tushda 10 ta qalam sotildi. Nechta qalam qoldi?',
        correctAnswer: '12 ta (34 - 12 - 10 = 12)',
        distractors: ['22 ta', '14 ta', '10 ta'],
        explanation: '34 - 22 = 12 ta qalam qoldi.',
      },
      {
        text: '1-idishda 18 litr sharbat bor, 2-idishda undan 6 litr kam. Ikkala idishda jami necha litr sharbat bor?',
        correctAnswer: '30 l (2-idish: 12 l; 18 + 12 = 30)',
        distractors: ['12 l', '24 l', '36 l'],
        explanation: '2-idish: 18 - 6 = 12 l. Jami: 18 + 12 = 30 litr.',
      },
      {
        text: 'Usta 1-kuni 22 ta stul yasadi, 2-kuni undan 6 ta ko‘p yasadi. Usta ikki kunda jami nechta stul yasagan?',
        correctAnswer: '50 ta (2-kun: 28; 22 + 28 = 50)',
        distractors: ['28 ta', '44 ta', '56 ta'],
        explanation: '2-kun: 22 + 6 = 28 ta. Jami: 22 + 28 = 50 ta.',
      },
      {
        text: 'Madina 30 bet kitob o‘qidi. Nodira undan 10 bet kam o‘qidi. Ikkala qiz jami necha bet o‘qigan?',
        correctAnswer: '50 bet (Nodira: 20; 30 + 20 = 50)',
        distractors: ['20 bet', '40 bet', '60 bet'],
        explanation: 'Nodira: 30 - 10 = 20 bet. Jami: 30 + 20 = 50 bet.',
      },

      // 4 ta qiyinroq
      {
        text: 'Bog‘bon 40 kg olma terdi. Nok olmadan 15 kg kam, shaftoli esa nokdan 5 kg ko‘p terildi. Shaftoli necha kg terilgan?',
        correctAnswer: '30 kg (Nok: 25 kg; 25 + 5 = 30)',
        distractors: ['25 kg', '35 kg', '20 kg'],
        explanation: 'Nok: 40 - 15 = 25 kg. Shaftoli: 25 + 5 = 30 kg.',
      },
      {
        text: 'Fermada 45 ta sigir bor. Qo‘ylar sigirlardan 20 ta ko‘p, otlar esa qo‘ylardan 30 ta kam. Fermada nechta ot bor?',
        correctAnswer: '35 ta (Qo‘y: 65; 65 - 30 = 35)',
        distractors: ['65 ta', '25 ta', '40 ta'],
        explanation: 'Qo‘y: 45 + 20 = 65 ta. Otlar: 65 - 30 = 35 ta.',
      },
      {
        text: 'Pochta xizmatida 1-mashina 28 ta posilka, 2-mashina undan 12 ta ko‘p posilka yetkazdi. Ikkala mashina birgalikda nechta posilka yetkazgan?',
        correctAnswer: '68 ta (2-mashina: 40; 28 + 40 = 68)',
        distractors: ['40 ta', '56 ta', '70 ta'],
        explanation: '2-mashina: 28 + 12 = 40 ta. Jami: 28 + 40 = 68 ta.',
      },
      {
        text: 'Kutubxonaga 50 ta yangi kitob keldi. 1-kun 15 tasi, 2-kun undan 5 ta ko‘p kitob javonga qo‘yildi. Yana nechta kitob qo‘yilishi kerak?',
        correctAnswer: '15 ta (2-kun: 20; 50 - 15 - 20 = 15)',
        distractors: ['20 ta', '10 ta', '25 ta'],
        explanation: '2-kuni: 15 + 5 = 20 ta. Jami qo‘yilgani: 15 + 20 = 35 ta. Qolgani: 50 - 35 = 15 ta.',
      },

      // 2 ta murakkab masala
      {
        text: 'Maktab oshxonasiga ertalab 30 kg kartoshka va 20 kg piyoz keltirildi. Tushgacha 15 kg kartoshka va 10 kg piyoz ishlatildi. Oshxonada jami necha kg sabzavot qoldi?',
        correctAnswer: '25 kg (Kartoshka: 15 kg, Piyoz: 10 kg; 15 + 10 = 25)',
        distractors: ['20 kg', '30 kg', '35 kg'],
        explanation: 'Kartoshka qoldi: 30 - 15 = 15 kg. Piyoz qoldi: 20 - 10 = 10 kg. Jami: 15 + 10 = 25 kg.',
      },
      {
        text: 'Alisher 1-kuni 20 ta, 2-kuni 1-kunidagidan 10 ta ko‘p, 3-kuni esa 2-kunidagidan 5 ta kam misol yechdi. Alisher uch kunda jami nechta misol yechgan?',
        correctAnswer: '75 ta (2-kun: 30, 3-kun: 25; 20 + 30 + 25 = 75)',
        distractors: ['65 ta', '70 ta', '80 ta'],
        explanation: '2-kun: 20 + 10 = 30 ta. 3-kun: 30 - 5 = 25 ta. Jami: 20 + 30 + 25 = 75 ta misol.',
      },
    ],
  },

  // 26-dars. Murakkab masalalar
  {
    bookNumber: 26,
    title: 'Murakkab masalalar',
    emoji: '🏁',
    shortDesc: 'Ketma-ketliklar, hafta kunlari mantiqi va narxlar tartibi.',
    intro: 'Mantiqiy ketma-ketliklar, hafta kunlari hisobi va narxlar bo‘yicha taqqoslash masalalarini yechamiz.',
    keyPoints: [
      'Ketma-ketlik qonuniyati: 2, 4, 3, 5, 4, 6, 5... (avval +2, so‘ng -1).',
      'Hafta kunlari mantiqi: agar ertaga juma bo‘lsa, bugun payshanba, kecha esa chorshanba bo‘lgan.',
      'Narxlar tartibi: arzonidan qimmatiga yoki qimmatidan arzoniga to‘g‘ri joylashtirish.',
    ],
    miniExample: {
      emojis: '📅 Ertaga juma ➔ Bugun payshanba ➔ Kecha chorshanba',
      text: 'Agar ertaga juma bo‘lsa, kecha haftaning qaysi kuni edi? Javob: Chorshanba.',
    },
    xpReward: 120,
    coinReward: 12,
    estMinutes: 10,
    practice: [
      {
        text: 'Agar ertaga juma bo‘lsa, kecha haftaning qaysi kuni edi?',
        correctAnswer: 'Chorshanba (bugun payshanba, kecha chorshanba)',
        distractors: ['Seshanba', 'Payshanba', 'Shanba'],
        explanation: 'Ertaga juma bo‘lsa, bugun payshanba. Kecha esa chorshanba bo‘lgan.',
      },
      {
        text: 'Ketma-ketlikni davom ettiring: 2, 4, 3, 5, 4, 6, □. Keyingi son qaysi?',
        correctAnswer: '5 (chunki +2, keyin -1 qonuniyati)',
        distractors: ['7', '6', '8'],
        explanation: 'Qonuniyat: 2(+2)=4, 4(-1)=3, 3(+2)=5, 5(-1)=4, 4(+2)=6, 6(-1)=5.',
      },
      {
        text: 'Daftar 1000 so‘m, qalam 500 so‘m, chizg‘ich 800 so‘m. Eng arzonidan eng qimmatiga tartiblang:',
        correctAnswer: 'Qalam, chizg‘ich, daftar',
        distractors: ['Daftar, chizg‘ich, qalam', 'Chizg‘ich, qalam, daftar', 'Qalam, daftar, chizg‘ich'],
        explanation: '500 so‘m < 800 so‘m < 1000 so‘m.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'Agar bugun seshanba bo‘lsa, indinga (2 kundan keyin) haftaning qaysi kuni bo‘ladi?',
        correctAnswer: 'Payshanba (seshanbadan 2 kun keyin)',
        distractors: ['Chorshanba', 'Juma', 'Dushanba'],
        explanation: 'Seshanbadan keyin chorshanba, so‘ng payshanba keladi.',
      },
      {
        text: 'Agar bugun shanba bo‘lsa, kecha qaysi kun edi?',
        correctAnswer: 'Juma',
        distractors: ['Payshanba', 'Yakshanba', 'Chorshanba'],
        explanation: 'Shanbadan oldingi kun juma.',
      },
      {
        text: 'Ketma-ketlikdagi bo‘sh joyni to‘ldiring: 5, 10, 15, 20, □',
        correctAnswer: '25 (5 tadan ortmoqda)',
        distractors: ['22', '30', '24'],
        explanation: 'Har bir son 5 taga ortmoqda: 20 + 5 = 25.',
      },
      {
        text: 'Non 3000 so‘m, sut 8000 so‘m, shokolad 5000 so‘m. Eng qimmat mahsulot qaysi?',
        correctAnswer: 'Sut (8000 so‘m)',
        distractors: ['Non (3000 so‘m)', 'Shokolad (5000 so‘m)', 'Hammasi teng'],
        explanation: '8000 so‘m eng yuqori narx hisoblanadi.',
      },
      {
        text: 'Haftada necha kun bor?',
        correctAnswer: '7 kun',
        distractors: ['5 kun', '6 kun', '8 kun'],
        explanation: 'Haftada 7 kun bor.',
      },
      {
        text: 'Ketma-ketlikni davom ettiring: 10, 20, 30, 40, □',
        correctAnswer: '50 (10 tadan ortmoqda)',
        distractors: ['45', '60', '55'],
        explanation: '10 tadan ortib bormoqda: 40 + 10 = 50.',
      },

      // 8 ta o'rtacha
      {
        text: 'Agar ertaga yakshanba bo‘lsa, kecha qaysi kun edi?',
        correctAnswer: 'Juma (bugun shanba, kecha juma)',
        distractors: ['Payshanba', 'Shanba', 'Dushanba'],
        explanation: 'Ertaga yakshanba bo‘lsa, bugun shanba, kecha esa juma bo‘lgan.',
      },
      {
        text: 'Ketma-ketlik qoidasini toping va keyingi sonni aniqlang: 1, 3, 2, 4, 3, 5, □',
        correctAnswer: '4 (+2, so‘ng -1)',
        distractors: ['6', '5', '7'],
        explanation: '1(+2)=3, 3(-1)=2, 2(+2)=4, 4(-1)=3, 3(+2)=5, 5(-1)=4.',
      },
      {
        text: 'Olma 6000 so‘m, nok 9000 so‘m. Nok olmadan qancha qimmat?',
        correctAnswer: '3000 so‘m (9000 - 6000 = 3000)',
        distractors: ['15000 so‘m', '2000 so‘m', '4000 so‘m'],
        explanation: '9000 - 6000 = 3000 so‘m qimmat.',
      },
      {
        text: 'Agar kecha dushanba bo‘lgan bo‘lsa, ertaga qaysi kun bo‘ladi?',
        correctAnswer: 'Chorshanba (kecha dushanba ➔ bugun seshanba ➔ ertaga chorshanba)',
        distractors: ['Seshanba', 'Payshanba', 'Juma'],
        explanation: 'Kecha dushanba bo‘lsa, bugun seshanba, ertaga chorshanba bo‘ladi.',
      },
      {
        text: 'Ketma-ketlikdagi keyingi sonni toping: 30, 25, 20, 15, □',
        correctAnswer: '10 (5 tadan kamaymoqda)',
        distractors: ['5', '12', '14'],
        explanation: 'Har bir qadam 5 taga kamaymoqda: 15 - 5 = 10.',
      },
      {
        text: 'Kitob 15000 so‘m, daftar 5000 so‘m. 1 ta kitob va 2 ta daftar jami necha so‘m bo‘ladi?',
        correctAnswer: '25000 so‘m (15000 + 5000 + 5000 = 25000)',
        distractors: ['20000 so‘m', '30000 so‘m', '10000 so‘m'],
        explanation: '15000 + 10000 = 25000 so‘m.',
      },
      {
        text: 'Ketma-ketlikdagi tushirib qoldirilgan sonni toping: 2, 5, 8, □, 14',
        correctAnswer: '11 (3 tadan ortmoqda)',
        distractors: ['10', '12', '9'],
        explanation: '8 + 3 = 11, 11 + 3 = 14.',
      },
      {
        text: 'Agar kecha juma bo‘lsa, bugun haftaning nechanchi kuni?',
        correctAnswer: 'Shanba (6-kuni)',
        distractors: ['Juma (5-kuni)', 'Yakshanba (7-kuni)', 'Payshanba (4-kuni)'],
        explanation: 'Jumadan keyingi kun shanba (haftaning 6-kuni).',
      },

      // 4 ta qiyinroq
      {
        text: 'Ketma-ketlik: 3, 6, 5, 8, 7, 10, □. Keyingi son qaysi?',
        correctAnswer: '9 (+3, so‘ng -1)',
        distractors: ['11', '8', '12'],
        explanation: '3(+3)=6, 6(-1)=5, 5(+3)=8, 8(-1)=7, 7(+3)=10, 10(-1)=9.',
      },
      {
        text: 'Agar indinga seshanba bo‘lsa, kecha haftaning qaysi kuni edi?',
        correctAnswer: 'Shanba (indinga seshanba ➔ ertaga dushanba ➔ bugun yakshanba ➔ kecha shanba)',
        distractors: ['Yakshanba', 'Juma', 'Dushanba'],
        explanation: 'Indinga seshanba bo‘lsa, ertaga dushanba, bugun yakshanba, kecha esa shanba bo‘lgan.',
      },
      {
        text: 'Narxlar berilgan: ruchka 2000 so‘m, o‘chirg‘ich 1000 so‘m, albom 7000 so‘m. Azizda 10000 so‘m bor edi. U barcha narsalardan bittadan olsa, qancha qaytim oladi?',
        correctAnswer: '0 so‘m (jami 10000 so‘m bo‘ladi)',
        distractors: ['1000 so‘m', '2000 so‘m', '500 so‘m'],
        explanation: '2000 + 1000 + 7000 = 10000 so‘m. Qaytim: 0 so‘m.',
      },
      {
        text: 'Ketma-ketlik qonuniyatini toping: 10, 12, 11, 13, 12, 14, □',
        correctAnswer: '13 (+2, so‘ng -1)',
        distractors: ['15', '16', '12'],
        explanation: '14 dan 1 ayirilsa 13 bo‘ladi.',
      },

      // 2 ta murakkab masala
      {
        text: 'O‘quvchi 1-kuni 2 bet, 2-kuni 4 bet, 3-kuni 6 bet kitob o‘qidi. Shu qonuniyat bilan u 4-kuni va 5-kuni jami necha bet o‘qiydi?',
        correctAnswer: '18 bet (4-kun: 8 bet, 5-kun: 10 bet; 8 + 10 = 18)',
        distractors: ['16 bet', '20 bet', '14 bet'],
        explanation: '4-kuni 8 bet, 5-kuni 10 bet o‘qiydi: 8 + 10 = 18 bet.',
      },
      {
        text: 'Dilnozada 20000 so‘m pul bor edi. U 8000 so‘mga kitob va 4000 so‘mga daftar sotib oldi. Qolgan puliga 4000 so‘mlik qalamdan nechta sotib olishi mumkin?',
        correctAnswer: '2 ta (qolgan pul: 8000 so‘m; 4000 + 4000 = 8000)',
        distractors: ['1 ta', '3 ta', '4 ta'],
        explanation: 'Sarflandi: 8000 + 4000 = 12000 so‘m. Qoldi: 20000 - 12000 = 8000 so‘m. 8000 so‘mga 2 ta qalam olish mumkin.',
      },
    ],
  },

  // 27-dars. 2-nazorat ishi (isReview: true)
  {
    bookNumber: 27,
    isReview: true,
    title: '2-nazorat ishi',
    emoji: '📝',
    shortDesc: 'II bob bo‘yicha nazorat mini-testi (orttirish, kamaytirish, taqqoslash, ikki amalli masalalar).',
    intro: 'II bobda o‘rganilgan barcha mavzular (orttirish, kamaytirish, taqqoslash, murakkab va ikki amalli masalalar) bo‘yicha 20 savolli nazorat testi.',
    keyPoints: [
      'Orttirish: biror sondan n ta ko‘p (+).',
      'Kamaytirish: biror sondan n ta kam (-).',
      'Taqqoslash: kattasidan kichigi ayirilib farq topiladi.',
      'Ikki amalli masalalar: amallar tartibi va qavslar.',
    ],
    miniExample: {
      emojis: '📝 20 ta nazorat savoli ➔ 60% dan yuqori natija III bobni ochadi!',
      text: 'II bob mavzulari bo‘yicha 20 ta savolga to‘g‘ri javob berib, bilimingizni sinang.',
    },
    xpReward: 120,
    coinReward: 12,
    estMinutes: 10,
    practice: [],
    test: [
      // 14-26 darslardan teng ulushda olingan 20 ta maxsus nazorat savoli
      // 6 ta oson
      {
        text: '«7 dan 3 ta ko‘p» bo‘lgan son nechaga teng?',
        correctAnswer: '10 (7 + 3 = 10)',
        distractors: ['4 (7 - 3 = 4)', '9', '11'],
        explanation: '7 + 3 = 10.',
      },
      {
        text: '«12 dan 4 ta kam» bo‘lgan son qaysi?',
        correctAnswer: '8 (12 - 4 = 8)',
        distractors: ['16 (12 + 4 = 16)', '7', '9'],
        explanation: '12 - 4 = 8.',
      },
      {
        text: 'Taqqoslashda farqni topish uchun qaysi amal bajariladi?',
        correctAnswer: 'Katta sondan kichik son ayiriladi',
        distractors: ['Sonlar bir-biriga qo‘shiladi', 'Sonlar o‘rni almashtiriladi', 'Hech qanday amal bajarilmaydi'],
        explanation: 'Qancha ko‘p yoki kamligini topish uchun kattasidan kichigi ayiriladi.',
      },
      {
        text: '1 soat necha minutga teng?',
        correctAnswer: '60 minut',
        distractors: ['100 minut', '30 minut', '24 minut'],
        explanation: '1 soat = 60 minut.',
      },
      {
        text: 'Haftada necha kun bor?',
        correctAnswer: '7 kun',
        distractors: ['5 kun', '6 kun', '8 kun'],
        explanation: 'Haftada 7 kun bor.',
      },
      {
        text: '20 + (15 - 5) ifodaning qiymatini hisoblang:',
        correctAnswer: '30 (15 - 5 = 10, 20 + 10 = 30)',
        distractors: ['25', '35', '40'],
        explanation: '15 - 5 = 10, 20 + 10 = 30.',
      },

      // 8 ta o'rtacha
      {
        text: 'Jasurda 6 ta qalam bor, Anvarda undan 4 ta ko‘p. Anvarda nechta qalam bor?',
        correctAnswer: '10 ta (6 + 4 = 10)',
        distractors: ['2 ta', '9 ta', '12 ta'],
        explanation: '6 + 4 = 10 ta qalam.',
      },
      {
        text: '52 sonidan 17 ta ortiq bo‘lgan sonni toping:',
        correctAnswer: '69 (52 + 17 = 69)',
        distractors: ['35', '68', '70'],
        explanation: '52 + 17 = 69.',
      },
      {
        text: '49 sonidan 18 ta kam bo‘lgan son nechaga teng?',
        correctAnswer: '31 (49 - 18 = 31)',
        distractors: ['67', '30', '32'],
        explanation: '49 - 18 = 31.',
      },
      {
        text: '8 ta rangli rasm 6 ta oq-qora rasmdan nechta ko‘p?',
        correctAnswer: '2 ta (8 - 6 = 2)',
        distractors: ['14 ta', '3 ta', '1 ta'],
        explanation: '8 - 6 = 2 ta.',
      },
      {
        text: 'Saturnning 82 ta, Yupiterning 79 ta yo‘ldoshi bor. Saturnning yo‘ldoshlari nechta ko‘p?',
        correctAnswer: '3 ta (82 - 79 = 3)',
        distractors: ['2 ta', '4 ta', '161 ta'],
        explanation: '82 - 79 = 3 ta.',
      },
      {
        text: '70 soni 85 sonidan qancha kam?',
        correctAnswer: '15 ga kam (85 - 70 = 15)',
        distractors: ['10 ga kam', '20 ga kam', '25 ga kam'],
        explanation: '85 - 70 = 15.',
      },
      {
        text: '76 soni 88 sonidan qancha kichik?',
        correctAnswer: '12 ga kichik (88 - 76 = 12)',
        distractors: ['10 ga', '14 ga', '16 ga'],
        explanation: '88 - 76 = 12.',
      },
      {
        text: 'Oshxonada 2 xil sharbat va 2 xil somsa bor. Necha xil tushlik to‘plami tanlash mumkin?',
        correctAnswer: '4 xil (2 x 2 = 4)',
        distractors: ['2 xil', '3 xil', '5 xil'],
        explanation: '2 x 2 = 4 xil kombinatsiya.',
      },

      // 4 ta qiyinroq
      {
        text: 'Oysha 12 ta ko‘ylak tikdi. Komila undan 2 ta ko‘p tikdi. Ikkala qiz jami nechta ko‘ylak tikkan?',
        correctAnswer: '26 ta (Komila: 14; 12 + 14 = 26)',
        distractors: ['14 ta', '24 ta', '28 ta'],
        explanation: 'Komila: 12 + 2 = 14 ta. Jami: 12 + 14 = 26 ta.',
      },
      {
        text: 'Ketma-ketlikni davom ettiring: 2, 4, 3, 5, 4, 6, □',
        correctAnswer: '5 (+2, so‘ng -1)',
        distractors: ['7', '6', '8'],
        explanation: '6 - 1 = 5.',
      },
      {
        text: 'Agar ertaga juma bo‘lsa, kecha haftaning qaysi kuni edi?',
        correctAnswer: 'Chorshanba (bugun payshanba, kecha chorshanba)',
        distractors: ['Seshanba', 'Payshanba', 'Shanba'],
        explanation: 'Ertaga juma bo‘lsa, bugun payshanba, kecha chorshanba bo‘lgan.',
      },
      {
        text: 'Albomda 12 ta oq-qora va 45 ta rangli fotosurat bor. Albomda jami nechta fotosurat bor?',
        correctAnswer: '57 ta (12 + 45 = 57)',
        distractors: ['55 ta', '58 ta', '33 ta'],
        explanation: '12 + 45 = 57 ta fotosurat.',
      },

      // 2 ta murakkab masala
      {
        text: 'Avtobusda 35 yo‘lovchi bor edi. Bekatda 15 kishi tushdi va 20 kishi chiqdi. Avtobusda necha yo‘lovchi bo‘ldi?',
        correctAnswer: '40 nafar (35 - 15 + 20 = 40)',
        distractors: ['30 nafar', '45 nafar', '50 nafar'],
        explanation: '35 - 15 = 20, 20 + 20 = 40 nafar.',
      },
      {
        text: 'Fermer xo‘jaligida 1-kuni 25 quti, 2-kuni undan 10 quti ko‘p olma terildi. Ikki kunda jami necha quti olma terilgan?',
        correctAnswer: '60 quti (2-kun: 35; 25 + 35 = 60)',
        distractors: ['35 quti', '55 quti', '70 quti'],
        explanation: '2-kun: 25 + 10 = 35 quti. Jami: 25 + 35 = 60 quti.',
      },
    ],
  },
];

console.log('Generating Part 3 Chapter 2B lessons (21-26 and review 27)...');
for (const lessonDef of lessonsPart3Ch2B) {
  const seed = buildLessonSeed(lessonDef);
  saveLessonFile(3, lessonDef.bookNumber, seed, lessonDef.isReview);
  console.log(`✅ Saved ${lessonDef.isReview ? 'review' : 'lesson'}-${lessonDef.bookNumber}.json`);
}

