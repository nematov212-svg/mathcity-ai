import { LessonDataDef, buildLessonSeed, saveLessonFile } from './generatorTypes.js';

const lessonsPart3Ch3B: LessonDataDef[] = [
  // 37-dars. Hajm va hajm birliklari
  {
    bookNumber: 37,
    title: 'Hajm va hajm birliklari',
    emoji: '🛢️',
    shortDesc: 'Suyuqliklar hajmini o‘lchash birligi — litr (l) bilan tanishish.',
    intro: 'Suyuqliklar (suv, sut, sharbat, choy) sig‘imini o‘lchashda litr (l) o‘lchov birligidan foydalaniladi.',
    keyPoints: [
      'Suyuqliklar hajmi litrlarda (l) o‘lchanadi.',
      '1 litr — asosiy hajm o‘lchov birligi.',
      'Suyuqliklar miqdori qo‘shiladi yoki ayiriladi: 50 l + 20 l = 70 l, 80 l − 30 l = 50 l.',
    ],
    miniExample: {
      emojis: '🛢️ 50 l + 20 l = 70 l suv',
      text: 'Katta bochkada 50 litr va chelakda 20 litr suv bor. Jami: 50 l + 20 l = 70 l.',
    },
    xpReward: 100,
    coinReward: 10,
    estMinutes: 8,
    practice: [
      {
        text: 'Suyuqliklar hajmi qaysi birlikda o‘lchanadi?',
        correctAnswer: 'Litr (l)',
        distractors: ['Kilogramm (kg)', 'Santimetr (sm)', 'Detsimetr (dm)'],
        explanation: 'Suyuqliklar hajmi litrlarda (l) o‘lchanadi.',
      },
      {
        text: 'Bochkada 50 l suv bor edi. Unga yana 20 l suv quyildi. Bochkada necha litr suv bo‘ldi?',
        correctAnswer: '70 l (50 + 20 = 70)',
        distractors: ['60 l', '30 l', '80 l'],
        explanation: '50 l + 20 l = 70 l.',
      },
      {
        text: 'Idishda 80 l sut bor edi. Undan 30 l sut olindi. Idishda necha litr sut qoldi?',
        correctAnswer: '50 l (80 - 30 = 50)',
        distractors: ['40 l', '60 l', '110 l'],
        explanation: '80 l - 30 l = 50 l.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'Suyuqliklar (suv, sut, sharbat) hajmi qaysi birlikda o‘lchanadi?',
        correctAnswer: 'Litrda (l)',
        distractors: ['Santimetrda (sm)', 'Kilogrammda (kg)', 'Detsimetrda (dm)'],
        explanation: 'Suyuqliklar hajmi litrda (l) o‘lchanadi.',
      },
      {
        text: 'Litr qisqacha qanday belgilanadi?',
        correctAnswer: 'l',
        distractors: ['kg', 'sm', 'm'],
        explanation: 'Litr qisqacha «l» harfi bilan belgilanadi.',
      },
      {
        text: '50 l + 20 l amalini hisoblang:',
        correctAnswer: '70 l',
        distractors: ['60 l', '80 l', '30 l'],
        explanation: '50 + 20 = 70 l.',
      },
      {
        text: '80 l - 30 l amalini hisoblang:',
        correctAnswer: '50 l',
        distractors: ['40 l', '60 l', '110 l'],
        explanation: '80 - 30 = 50 l.',
      },
      {
        text: 'Chelakda 10 l suv bor. Yana 5 l qo‘shilsa, necha litr suv bo‘ladi?',
        correctAnswer: '15 l (10 + 5 = 15)',
        distractors: ['5 l', '20 l', '14 l'],
        explanation: '10 + 5 = 15 l.',
      },
      {
        text: 'Konditsioner idishida 25 l suv bor edi. Undan 5 l to‘kildi. Necha litr qoldi?',
        correctAnswer: '20 l (25 - 5 = 20)',
        distractors: ['30 l', '15 l', '22 l'],
        explanation: '25 - 5 = 20 l.',
      },

      // 8 ta o'rtacha
      {
        text: 'Bochkada 40 l, chelakda 10 l suv bor. Jami necha litr suv bor?',
        correctAnswer: '50 l (40 + 10 = 50)',
        distractors: ['30 l', '45 l', '60 l'],
        explanation: '40 + 10 = 50 l.',
      },
      {
        text: 'Bankada 3 l sharbat bor. 3 ta shunday bankada jami necha litr sharbat bo‘ladi?',
        correctAnswer: '9 l (3 + 3 + 3 = 9)',
        distractors: ['6 l', '8 l', '10 l'],
        explanation: '3 + 3 + 3 = 9 l.',
      },
      {
        text: 'Hovuzdagi 65 l suvdan 25 l sarflandi. Necha litr suv qoldi?',
        correctAnswer: '40 l (65 - 25 = 40)',
        distractors: ['45 l', '35 l', '90 l'],
        explanation: '65 - 25 = 40 l.',
      },
      {
        text: '30 l + 45 l amalini hisoblang:',
        correctAnswer: '75 l',
        distractors: ['70 l', '65 l', '85 l'],
        explanation: '30 + 45 = 75 l.',
      },
      {
        text: '90 l - 40 l amalini hisoblang:',
        correctAnswer: '50 l',
        distractors: ['40 l', '60 l', '130 l'],
        explanation: '90 - 40 = 50 l.',
      },
      {
        text: 'Avtomobil bakida 35 l benzin bor edi. Haydovchi yana 15 l quydi. Bakda necha litr benzin bo‘ldi?',
        correctAnswer: '50 l (35 + 15 = 50)',
        distractors: ['45 l', '55 l', '20 l'],
        explanation: '35 + 15 = 50 l.',
      },
      {
        text: 'Kattaroq sig‘imni ko‘rsating: 35 l mi yoki 53 l?',
        correctAnswer: '53 l katta (53 l > 35 l)',
        distractors: ['35 l katta', 'Ikkalasi teng', 'Taqqoslab bo‘lmaydi'],
        explanation: '53 soni 35 dan katta, demak 53 l > 35 l.',
      },
      {
        text: '70 l suv 40 l suvdan necha litr ko‘p?',
        correctAnswer: '30 l ga ko‘p (70 - 40 = 30)',
        distractors: ['20 l ga', '40 l ga', '110 l ga'],
        explanation: '70 - 40 = 30 l.',
      },

      // 4 ta qiyinroq
      {
        text: 'Idishda 18 l olma sharbati va 12 l o‘rik sharbati bor. Jami necha litr sharbat bor?',
        correctAnswer: '30 l (18 + 12 = 30)',
        distractors: ['28 l', '32 l', '20 l'],
        explanation: '18 + 12 = 30 l.',
      },
      {
        text: 'Bir bochkada 48 l, ikkinchisida undan 15 l kam suv bor. Ikkinchi bochkada necha litr suv bor?',
        correctAnswer: '33 l (48 - 15 = 33)',
        distractors: ['35 l', '63 l', '23 l'],
        explanation: '48 - 15 = 33 l.',
      },
      {
        text: 'Akvariumga 50 l suv sig‘adi. Hozir unda 32 l suv bor. To‘lishi uchun yana necha litr suv quyish kerak?',
        correctAnswer: '18 l (50 - 32 = 18)',
        distractors: ['15 l', '20 l', '28 l'],
        explanation: '50 - 32 = 18 l.',
      },
      {
        text: '1-kuni 22 l, 2-kuni 18 l sut sotildi. Ikki kunda jami necha litr sut sotilgan?',
        correctAnswer: '40 l (22 + 18 = 40)',
        distractors: ['38 l', '42 l', '30 l'],
        explanation: '22 + 18 = 40 l.',
      },

      // 2 ta murakkab masala
      {
        text: 'Katta qozonda 60 l sho‘rva bor edi. Tushlikda 35 l, kechki ovqatda 15 l tarqatildi. Qozonda necha litr sho‘rva qoldi?',
        correctAnswer: '10 l (60 - 35 - 15 = 10)',
        distractors: ['15 l', '20 l', '5 l'],
        explanation: '60 - 35 = 25 l, 25 - 15 = 10 l.',
      },
      {
        text: 'Birinchi idishda 24 l suv bor. Ikkinchi idishda undan 6 l ko‘p suv bor. Ikkala idishda birgalikda necha litr suv bor?',
        correctAnswer: '54 l (2-idish: 30; 24 + 30 = 54)',
        distractors: ['30 l', '50 l', '60 l'],
        explanation: '2-idishda: 24 + 6 = 30 l. Jami: 24 + 30 = 54 l.',
      },
    ],
  },

  // 38-dars. Hajm va hajm birliklari (2)
  {
    bookNumber: 38,
    title: 'Hajm va hajm birliklari (2)',
    emoji: '🥤',
    shortDesc: 'Idishlar sig‘imini taqqoslash, ichimliklar aralashmasi va amaliy masalalar.',
    intro: 'Turli idishlardagi suyuqliklarni taqqoslash va kundalik hayotdagi hajm masalalarini yechamiz.',
    keyPoints: [
      'Sig‘imlarni taqqoslash: 15 l < 20 l, 45 l > 30 l.',
      'Farqni topish uchun katta hajmdan kichik hajm ayiriladi.',
      'Suyuqliklarni quyish va taqsimlashda hisob-kitoblar aniq bo‘lishi lozim.',
    ],
    miniExample: {
      emojis: '🥤 15 l sharbat < 20 l sharbat',
      text: '1-idishda 15 l, 2-idishda 20 l sharbat bor. 2-idishdagi sharbat 5 l ga ko‘p: 20 - 15 = 5 l.',
    },
    xpReward: 100,
    coinReward: 10,
    estMinutes: 8,
    practice: [
      {
        text: 'Taqqoslang: 25 l va 30 l',
        correctAnswer: '25 l < 30 l',
        distractors: ['25 l > 30 l', '25 l = 30 l', 'Taqqoslab bo‘lmaydi'],
        explanation: '25 soni 30 dan kichik bo‘lgani uchun 25 l < 30 l.',
      },
      {
        text: 'Bir idishda 40 l, ikkinchisida 15 l sharbat bor. 1-idishdagi sharbat ikkinchisidagidan necha litr ko‘p?',
        correctAnswer: '25 l ga ko‘p (40 - 15 = 25)',
        distractors: ['20 l ga', '30 l ga', '55 l ga'],
        explanation: '40 - 15 = 25 l.',
      },
      {
        text: '10 l li chelakka 3 l suv quysak, to‘lishi uchun yana necha litr kerak?',
        correctAnswer: '7 l (10 - 3 = 7)',
        distractors: ['6 l', '8 l', '13 l'],
        explanation: '10 - 3 = 7 l.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'Taqqoslang: 15 l va 20 l',
        correctAnswer: '15 l < 20 l',
        distractors: ['15 l > 20 l', '15 l = 20 l', 'Taqqoslab bo‘lmaydi'],
        explanation: '15 l < 20 l.',
      },
      {
        text: 'Taqqoslang: 50 l va 40 l',
        correctAnswer: '50 l > 40 l',
        distractors: ['50 l < 40 l', '50 l = 40 l', 'Taqqoslab bo‘lmaydi'],
        explanation: '50 l > 40 l.',
      },
      {
        text: 'Taqqoslang: 30 l + 10 l va 40 l',
        correctAnswer: 'Teng (30 l + 10 l = 40 l)',
        distractors: ['Birinchisi katta', 'Ikkinchisi katta', 'Taqqoslab bo‘lmaydi'],
        explanation: '30 + 10 = 40 l, demak teng.',
      },
      {
        text: '20 l suv 12 l suvdan necha litr ko‘p?',
        correctAnswer: '8 l ga ko‘p (20 - 12 = 8)',
        distractors: ['6 l ga', '10 l ga', '32 l ga'],
        explanation: '20 - 12 = 8 l.',
      },
      {
        text: '14 l sut 20 l sutdan necha litr kam?',
        correctAnswer: '6 l ga kam (20 - 14 = 6)',
        distractors: ['5 l ga kam', '7 l ga kam', '34 l ga'],
        explanation: '20 - 14 = 6 l.',
      },
      {
        text: 'O‘sish tartibida joylashtiring: 30 l, 10 l, 25 l',
        correctAnswer: '10 l, 25 l, 30 l',
        distractors: ['30 l, 25 l, 10 l', '10 l, 30 l, 25 l', '25 l, 10 l, 30 l'],
        explanation: 'Kichigidan kattasiga: 10 < 25 < 30.',
      },

      // 8 ta o'rtacha
      {
        text: 'Bir chelakda 12 l, ikkinchisida 8 l suv bor. Ikkala chelakda necha litr suv bor?',
        correctAnswer: '20 l (12 + 8 = 20)',
        distractors: ['18 l', '22 l', '4 l'],
        explanation: '12 + 8 = 20 l.',
      },
      {
        text: 'Bir idishda 60 l, ikkinchisida 35 l moy bor. Birinchi idishda necha litr ko‘p moy bor?',
        correctAnswer: '25 l (60 - 35 = 25)',
        distractors: ['30 l', '20 l', '95 l'],
        explanation: '60 - 35 = 25 l.',
      },
      {
        text: 'Konditsionerga har kuni 4 l suv quyiladi. 3 kunda necha litr suv quyiladi?',
        correctAnswer: '12 l (4 + 4 + 4 = 12)',
        distractors: ['10 l', '14 l', '16 l'],
        explanation: '4 + 4 + 4 = 12 l.',
      },
      {
        text: 'Bochkadan 15 l suv olgach, unda 25 l suv qoldi. Bochkada avval necha litr suv bo‘lgan?',
        correctAnswer: '40 l (25 + 15 = 40)',
        distractors: ['35 l', '45 l', '10 l'],
        explanation: '25 + 15 = 40 l.',
      },
      {
        text: '45 l - 15 l ifodaning qiymati 30 l dan kattami yoki tengmi?',
        correctAnswer: 'Teng (45 - 15 = 30 l)',
        distractors: ['Katta', 'Kichik', 'Taqqoslab bo‘lmaydi'],
        explanation: '45 - 15 = 30 l, demak teng.',
      },
      {
        text: '5 litrli idishdan 4 marta to‘ldirib suv olinsa, jami necha litr suv olingan bo‘ladi?',
        correctAnswer: '20 l (5 + 5 + 5 + 5 = 20)',
        distractors: ['15 l', '25 l', '10 l'],
        explanation: '5 + 5 + 5 + 5 = 20 l.',
      },
      {
        text: 'Oshxonada 34 l sut bor edi. Pishiriqlarga 14 l ishlatildi. Necha litr sut qoldi?',
        correctAnswer: '20 l (34 - 14 = 20)',
        distractors: ['18 l', '22 l', '48 l'],
        explanation: '34 - 14 = 20 l.',
      },
      {
        text: '75 l - 25 l amalini hisoblang:',
        correctAnswer: '50 l',
        distractors: ['40 l', '60 l', '100 l'],
        explanation: '75 - 25 = 50 l.',
      },

      // 4 ta qiyinroq
      {
        text: 'Avtomashina baki 60 l. Safarga chiqishdan oldin unda 25 l benzin bor edi. Bak to‘lishi uchun necha litr benzin quyildi?',
        correctAnswer: '35 l (60 - 25 = 35)',
        distractors: ['30 l', '40 l', '85 l'],
        explanation: '60 - 25 = 35 l.',
      },
      {
        text: '1-chelakda 14 l, 2-chelakda undan 4 l kam suv bor. Ikkala chelakda jami necha litr suv bor?',
        correctAnswer: '24 l (2-chelak: 10; 14 + 10 = 24)',
        distractors: ['20 l', '26 l', '18 l'],
        explanation: '2-chelakda: 14 - 4 = 10 l. Jami: 14 + 10 = 24 l.',
      },
      {
        text: 'Idishda 80 l sharbat bor edi. Ertalab 25 l, kechqurun 30 l sotildi. Necha litr sharbat qoldi?',
        correctAnswer: '25 l (80 - 25 - 30 = 25)',
        distractors: ['30 l', '20 l', '35 l'],
        explanation: '80 - 25 = 55 l, 55 - 30 = 25 l.',
      },
      {
        text: 'Tenglik to‘g‘ri bo‘lishi uchun bo‘sh katakka mos sonni toping: 40 l + □ l = 75 l',
        correctAnswer: '35 (75 - 40 = 35)',
        distractors: ['30', '45', '25'],
        explanation: '75 - 40 = 35.',
      },

      // 2 ta murakkab masala
      {
        text: 'Fermadagi 3 ta sigirdan ertalab 15 l, 18 l va 17 l sut sog‘ib olindi. Jami necha litr sut sog‘ilgan?',
        correctAnswer: '50 l (15 + 18 + 17 = 50)',
        distractors: ['48 l', '52 l', '45 l'],
        explanation: '15 + 18 = 33, 33 + 17 = 50 l.',
      },
      {
        text: 'Hovuzdagi 90 l suvdan 1-soatda 30 l, 2-soatda 20 l oqib ketdi. Hovuzda necha litr suv qoldi?',
        correctAnswer: '40 l (90 - 30 - 20 = 40)',
        distractors: ['50 l', '35 l', '45 l'],
        explanation: '90 - 30 = 60 l, 60 - 20 = 40 l.',
      },
    ],
  },

  // 39-dars. Kattaliklar: uzunlik, massa, hajm
  {
    bookNumber: 39,
    title: 'Kattaliklar: uzunlik, massa, hajm',
    emoji: '📦',
    shortDesc: 'Uzunlik (sm, dm), massa (kg) va hajm (l) birliklarini umumlashtirish va moslashtirish.',
    intro: 'Biz o‘rgangan uchta asosiy kattalik: uzunlik, massa va hajmni bir-biridan farqlashni va to‘g‘ri qo‘llashni o‘rganamiz.',
    keyPoints: [
      'Uzunlik santimetr (sm) va detsimetr (dm)da o‘lchanadi.',
      'Massa kilogramm (kg)da o‘lchanadi.',
      'Hajm litr (l)da o‘lchanadi.',
      'Faqat bir xil birlikdagi kattaliklarni qo‘shish yoki ayirish mumkin (5 kg + 5 kg + 2 kg + 3 kg = 15 kg).',
    ],
    miniExample: {
      emojis: '📦 Uzunlik: 10 sm, Massa: 5 kg, Hajm: 2 l',
      text: 'Har bir narsa o‘z birligiga ega: daftar uzunligi 20 sm, qovun massasi 4 kg, sut hajmi 1 l.',
    },
    xpReward: 100,
    coinReward: 10,
    estMinutes: 8,
    practice: [
      {
        text: 'Tarvuzning og‘irligi (massasi) qaysi birlikda o‘lchanadi?',
        correctAnswer: 'Kilogramm (kg)',
        distractors: ['Santimetr (sm)', 'Litr (l)', 'Minut'],
        explanation: 'Massa kilogrammda (kg) o‘lchanadi.',
      },
      {
        text: 'Chizg‘ich bilan nimani o‘lchaymiz?',
        correctAnswer: 'Uzunlikni (sm, dm)',
        distractors: ['Massani (kg)', 'Hajmni (l)', 'Vaqtni (soat)'],
        explanation: 'Chizg‘ich yordamida uzunlik o‘lchanadi.',
      },
      {
        text: '5 kg + 5 kg + 2 kg + 3 kg amalini hisoblang:',
        correctAnswer: '15 kg',
        distractors: ['12 kg', '14 kg', '16 kg'],
        explanation: '5 + 5 = 10, 10 + 2 = 12, 12 + 3 = 15 kg.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'Uzunlik birliklarini ko‘rsating:',
        correctAnswer: 'Santimetr (sm) va detsimetr (dm)',
        distractors: ['Kilogramm (kg)', 'Litr (l)', 'Soat va minut'],
        explanation: 'Uzunlik sm va dm da o‘lchanadi.',
      },
      {
        text: 'Massa o‘lchov birligi qaysi?',
        correctAnswer: 'Kilogramm (kg)',
        distractors: ['Litr (l)', 'Santimetr (sm)', 'Detsimetr (dm)'],
        explanation: 'Massa kilogrammda o‘lchanadi.',
      },
      {
        text: 'Suyuqliklar hajmi qaysi birlikda o‘lchanadi?',
        correctAnswer: 'Litr (l)',
        distractors: ['Kilogramm (kg)', 'Santimetr (sm)', 'Gramm'],
        explanation: 'Hajm litrda o‘lchanadi.',
      },
      {
        text: 'Daftarning eni 15 sm. Bu qaysi kattalikka tegishli?',
        correctAnswer: 'Uzunlik',
        distractors: ['Massa', 'Hajm', 'Vaqt'],
        explanation: 'Santimetr — uzunlik birligi.',
      },
      {
        text: 'Bir qop un 50 kg. Bu qaysi kattalikka tegishli?',
        correctAnswer: 'Massa',
        distractors: ['Uzunlik', 'Hajm', 'Tezlik'],
        explanation: 'Kilogramm — massa birligi.',
      },
      {
        text: 'Bir chelak suv 10 l. Bu qaysi kattalikka tegishli?',
        correctAnswer: 'Hajm',
        distractors: ['Massa', 'Uzunlik', 'Harorat'],
        explanation: 'Litr — hajm birligi.',
      },

      // 8 ta o'rtacha
      {
        text: '5 kg + 5 kg + 2 kg + 3 kg ifodaning qiymatini toping:',
        correctAnswer: '15 kg',
        distractors: ['14 kg', '16 kg', '12 kg'],
        explanation: '5 + 5 + 2 + 3 = 15 kg.',
      },
      {
        text: '20 l + 15 l + 5 l amalini hisoblang:',
        correctAnswer: '40 l',
        distractors: ['35 l', '45 l', '50 l'],
        explanation: '20 + 15 + 5 = 40 l.',
      },
      {
        text: '3 dm + 4 dm + 2 dm amalini hisoblang:',
        correctAnswer: '9 dm',
        distractors: ['8 dm', '10 dm', '7 dm'],
        explanation: '3 + 4 + 2 = 9 dm.',
      },
      {
        text: 'Qaysi qo‘shish to‘g‘ri ma’noga ega?',
        correctAnswer: '5 kg + 3 kg = 8 kg',
        distractors: ['5 kg + 3 sm = 8 kg', '4 l + 2 dm = 6 l', '7 sm + 1 kg = 8 sm'],
        explanation: 'Faqat bir xil birlikdagi kattaliklarni qo‘shish mumkin.',
      },
      {
        text: '1 detsimetr necha santimetrga teng?',
        correctAnswer: '10 sm',
        distractors: ['100 sm', '1 sm', '5 sm'],
        explanation: '1 dm = 10 sm.',
      },
      {
        text: 'Savatda 4 kg olma va 3 kg nok bor. Savatdagi mevalar massasi qancha?',
        correctAnswer: '7 kg (4 + 3 = 7)',
        distractors: ['6 kg', '8 kg', '1 kg'],
        explanation: '4 + 3 = 7 kg.',
      },
      {
        text: 'Bochkadan 12 l suv olindi, keyin yana 8 l olindi. Jami necha litr suv olingan?',
        correctAnswer: '20 l (12 + 8 = 20)',
        distractors: ['18 l', '22 l', '4 l'],
        explanation: '12 + 8 = 20 l.',
      },
      {
        text: 'Tasmadan avval 25 sm, so‘ng 15 sm qirqib olindi. Jami necha santimetr qirqib olingan?',
        correctAnswer: '40 sm (25 + 15 = 40)',
        distractors: ['35 sm', '45 sm', '10 sm'],
        explanation: '25 + 15 = 40 sm.',
      },

      // 4 ta qiyinroq
      {
        text: 'Sutkasiga sigir 18 l sut beradi. 2 kunda necha litr sut beradi?',
        correctAnswer: '36 l (18 + 18 = 36)',
        distractors: ['34 l', '38 l', '20 l'],
        explanation: '18 + 18 = 36 l.',
      },
      {
        text: 'Bir qop shakar 25 kg, ikkinchisi 30 kg. Ikkala qop jami necha kilogramm?',
        correctAnswer: '55 kg (25 + 30 = 55)',
        distractors: ['50 kg', '60 kg', '5 kg'],
        explanation: '25 + 30 = 55 kg.',
      },
      {
        text: 'Mubina 4 dm, Dilnoza esa 50 sm uzunlikda tasma sotib oldi. Kimning tasmasi uzunroq? (1 dm = 10 sm)',
        correctAnswer: 'Dilnozaniki (4 dm = 40 sm; 50 sm > 40 sm)',
        distractors: ['Mubinani', 'Ikkalasi teng', 'Taqqoslab bo‘lmaydi'],
        explanation: '4 dm = 40 sm. 50 sm > 40 sm, demak Dilnozaniki uzunroq.',
      },
      {
        text: 'Uchta toshning massasi: 10 kg, 5 kg va 2 kg. Ularning umumiy massasi qancha?',
        correctAnswer: '17 kg (10 + 5 + 2 = 17)',
        distractors: ['16 kg', '18 kg', '15 kg'],
        explanation: '10 + 5 + 2 = 17 kg.',
      },

      // 2 ta murakkab masala
      {
        text: 'Do‘konga 45 kg kartoshka va 35 kg sabzi keltirildi. Kun davomida 50 kg sabzavot sotildi. Do‘konda necha kilogramm sabzavot qoldi?',
        correctAnswer: '30 kg (45 + 35 = 80; 80 - 50 = 30)',
        distractors: ['25 kg', '35 kg', '40 kg'],
        explanation: 'Jami: 45 + 35 = 80 kg. Qoldi: 80 - 50 = 30 kg.',
      },
      {
        text: 'Idishda 28 l suv bor edi. Undan 8 l gul sug‘orishga, 10 l ovqatga ishlatildi. Idishda necha litr suv qoldi?',
        correctAnswer: '10 l (28 - 8 - 10 = 10)',
        distractors: ['12 l', '8 l', '15 l'],
        explanation: '28 - 8 = 20 l, 20 - 10 = 10 l.',
      },
    ],
  },

  // 40-dars. Kattaliklar va ularning xossalari
  {
    bookNumber: 40,
    title: 'Kattaliklar va ularning xossalari',
    emoji: '🎂',
    shortDesc: 'Kattaliklarni qo‘shishda o‘rin almashtirish xossasi va xonalar bo‘yicha yoyish.',
    intro: 'Qo‘shiluvchilarning o‘rni almashgani bilan yig‘indi o‘zgarmaydi: 30 l + 40 l = 40 l + 30 l = 70 l.',
    keyPoints: [
      'Kattaliklarda ham qo‘shishning o‘rin almashtirish xossasi o‘rinli: a + b = b + a.',
      'Kattaliklarni xona qo‘shiluvchilari yig‘indisi ko‘rinishida yozish: 24 kg = 20 kg + 4 kg.',
      'Hisoblashda qulay tartibni tanlash vaqтни tejaydi va hisoblashni osonlashtiradi.',
    ],
    miniExample: {
      emojis: '🎂 30 l + 40 l = 40 l + 30 l = 70 l',
      text: '30 l va 40 l yig‘indisi 70 litrga teng. O‘rni almashsa ham natija bir xil: 70 litr.',
    },
    xpReward: 100,
    coinReward: 10,
    estMinutes: 8,
    practice: [
      {
        text: '30 l + 40 l yig‘indisi 40 l + 30 l yig‘indisiga tengmi?',
        correctAnswer: 'Ha, ikkalasi ham 70 l ga teng',
        distractors: ['Yo‘q, teng emas', 'Birinchisi katta', 'Ikkinchisi katta'],
        explanation: 'Qo‘shishning o‘rin almashtirish xossasiga ko‘ra yig‘indi o‘zgarmaydi.',
      },
      {
        text: '24 kg ni xona birliklari yig‘indisiga ajrating:',
        correctAnswer: '20 kg + 4 kg',
        distractors: ['10 kg + 14 kg', '22 kg + 2 kg', '20 kg + 14 kg'],
        explanation: '24 soni 2 ta o‘nlik (20) va 4 ta birlikdan (4) iborat.',
      },
      {
        text: '35 sm = 30 sm + □ sm. Bo‘sh katakdagi sonni toping:',
        correctAnswer: '5',
        distractors: ['3', '15', '30'],
        explanation: '35 sm = 30 sm + 5 sm.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: '30 l + 40 l nechaga teng?',
        correctAnswer: '70 l',
        distractors: ['60 l', '80 l', '50 l'],
        explanation: '30 + 40 = 70 l.',
      },
      {
        text: '40 l + 30 l nechaga teng?',
        correctAnswer: '70 l',
        distractors: ['60 l', '80 l', '50 l'],
        explanation: '40 + 30 = 70 l.',
      },
      {
        text: 'Qo‘shiluvchilarning o‘rni almashsa yig‘indi qanday o‘zgaradi?',
        correctAnswer: 'O‘zgarmaydi',
        distractors: ['Kattalashadi', 'Kichrayadi', 'Nolga teng bo‘ladi'],
        explanation: 'Qo‘shishning o‘rin almashtirish qonuni: a + b = b + a.',
      },
      {
        text: '24 kg sonini xonalar bo‘yicha to‘g‘ri yoyilmasini ko‘rsating:',
        correctAnswer: '20 kg + 4 kg',
        distractors: ['2 kg + 4 kg', '20 kg + 40 kg', '24 kg + 0 kg'],
        explanation: '24 kg = 20 kg + 4 kg.',
      },
      {
        text: '56 sm sonini xonalar bo‘yicha yoying:',
        correctAnswer: '50 sm + 6 sm',
        distractors: ['5 sm + 6 sm', '50 sm + 16 sm', '40 sm + 6 sm'],
        explanation: '56 sm = 50 sm + 6 sm.',
      },
      {
        text: '68 l sonini xonalar bo‘yicha to‘g‘ri yozing:',
        correctAnswer: '60 l + 8 l',
        distractors: ['6 l + 8 l', '60 l + 18 l', '50 l + 8 l'],
        explanation: '68 l = 60 l + 8 l.',
      },

      // 8 ta o'rtacha
      {
        text: '12 kg + 25 kg va 25 kg + 12 kg qiymatlarini taqqoslang:',
        correctAnswer: 'Teng (ikkalasi ham 37 kg)',
        distractors: ['Birinchisi katta', 'Ikkinchisi katta', 'Taqqoslab bo‘lmaydi'],
        explanation: 'Qo‘shiluvchilar o‘rni almashsa ham natija bir xil: 37 kg.',
      },
      {
        text: '73 kg = 70 kg + □ kg. Bo‘sh katakdagi sonni toping:',
        correctAnswer: '3',
        distractors: ['7', '13', '30'],
        explanation: '73 = 70 + 3.',
      },
      {
        text: '85 dm = □ dm + 5 dm. Bo‘sh katakdagi sonni toping:',
        correctAnswer: '80',
        distractors: ['8', '85', '70'],
        explanation: '85 = 80 + 5.',
      },
      {
        text: '47 l = 40 l + □ l. Bo‘sh katakdagi sonni toping:',
        correctAnswer: '7',
        distractors: ['4', '17', '47'],
        explanation: '47 = 40 + 7.',
      },
      {
        text: 'Qulay usulda hisoblang: 15 l + 40 l + 5 l',
        correctAnswer: '60 l (15 + 5 = 20; 20 + 40 = 60)',
        distractors: ['55 l', '65 l', '50 l'],
        explanation: '15 + 5 = 20 l, 20 + 40 = 60 l.',
      },
      {
        text: 'Qulay usulda hisoblang: 23 kg + 50 kg + 7 kg',
        correctAnswer: '80 kg (23 + 7 = 30; 30 + 50 = 80)',
        distractors: ['75 kg', '85 kg', '70 kg'],
        explanation: '23 + 7 = 30 kg, 30 + 50 = 80 kg.',
      },
      {
        text: 'Qulay usulda hisoblang: 34 sm + 20 sm + 6 sm',
        correctAnswer: '60 sm (34 + 6 = 40; 40 + 20 = 60)',
        distractors: ['54 sm', '64 sm', '50 sm'],
        explanation: '34 + 6 = 40 sm, 40 + 20 = 60 sm.',
      },
      {
        text: 'Tenglik to‘g‘rimi: 18 kg + 4 kg = 4 kg + 18 kg?',
        correctAnswer: 'To‘g‘ri (22 kg = 22 kg)',
        distractors: ['Noto‘g‘ri', 'Birinchisi katta', 'Ikkinchisi katta'],
        explanation: 'O‘rin almashtirish xossasiga ko‘ra har doim teng.',
      },

      // 4 ta qiyinroq
      {
        text: 'Qulay usulda hisoblang: 14 l + 25 l + 6 l + 5 l',
        correctAnswer: '50 l (14 + 6 = 20, 25 + 5 = 30; 20 + 30 = 50)',
        distractors: ['45 l', '55 l', '40 l'],
        explanation: '(14 + 6) + (25 + 5) = 20 + 30 = 50 l.',
      },
      {
        text: 'Qulay usulda hisoblang: 32 kg + 18 kg + 25 kg',
        correctAnswer: '75 kg (32 + 18 = 50; 50 + 25 = 75)',
        distractors: ['70 kg', '80 kg', '65 kg'],
        explanation: '32 + 18 = 50 kg, 50 + 25 = 75 kg.',
      },
      {
        text: '94 sm = 90 sm + □ sm. Bo‘sh katakdagi son nechaga teng?',
        correctAnswer: '4',
        distractors: ['9', '14', '40'],
        explanation: '94 = 90 + 4.',
      },
      {
        text: 'Omborda 23 qop bug‘doy va 17 qop arpa bor edi. Yana 40 qop makkajo‘xori keltirildi. Jami necha qop don bo‘ldi?',
        correctAnswer: '80 qop (23 + 17 = 40; 40 + 40 = 80)',
        distractors: ['70 qop', '85 qop', '75 qop'],
        explanation: '23 + 17 = 40, 40 + 40 = 80 qop.',
      },

      // 2 ta murakkab masala
      {
        text: 'Do‘konda ertalab 16 kg konfet, tushda 25 kg va kechqurun 14 kg sotildi. Kun davomida qulay usulda jami necha kg konfet sotilganini hisoblang:',
        correctAnswer: '55 kg (16 + 14 = 30; 30 + 25 = 55)',
        distractors: ['50 kg', '60 kg', '45 kg'],
        explanation: '16 + 14 = 30 kg, 30 + 25 = 55 kg.',
      },
      {
        text: 'Uchta idishda 13 l, 27 l va 35 l sharbat bor. Sharbatlarni bitta bochkaga quysak, unda necha litr sharbat bo‘ladi?',
        correctAnswer: '75 l (13 + 27 = 40; 40 + 35 = 75)',
        distractors: ['70 l', '80 l', '65 l'],
        explanation: '13 + 27 = 40 l, 40 + 35 = 75 l.',
      },
    ],
  },

  // 41-dars. Kattaliklar va ularning xossalari (2)
  {
    bookNumber: 41,
    title: 'Kattaliklar va ularning xossalari (2)',
    emoji: '🧪',
    shortDesc: 'Guruhlash xossasi va jadval asosida kattaliklarga doir masalalar yechish.',
    intro: 'Uch yoki undan ortiq kattalikni qo‘shishda qulaylarini guruhlab qo‘shishni o‘rganamiz: (10 + 20) + 30 = 60.',
    keyPoints: [
      'Guruhlash xossasi: (a + b) + c = a + (b + c).',
      'Qulay usulda hisoblash: (12 kg + 8 kg) + 15 kg = 20 kg + 15 kg = 35 kg.',
      'Jadval va diagrammalardagi kattaliklarni tahlil qilib amallar bajarish.',
    ],
    miniExample: {
      emojis: '🧪 (10 l + 20 l) + 30 l = 30 l + 30 l = 60 l',
      text: 'Avval 10 va 20 litrni qo‘shamiz (30 l), so‘ng 30 litrni qo‘shamiz (60 l).',
    },
    xpReward: 100,
    coinReward: 10,
    estMinutes: 8,
    practice: [
      {
        text: '(12 kg + 8 kg) + 15 kg ifodaning qiymatini hisoblang:',
        correctAnswer: '35 kg (20 + 15 = 35)',
        distractors: ['30 kg', '40 kg', '25 kg'],
        explanation: '12 + 8 = 20 kg, 20 + 15 = 35 kg.',
      },
      {
        text: 'Qaysi guruhlash qulayroq: 27 + 13 + 30 ifoda uchun?',
        correctAnswer: '(27 + 13) + 30 = 40 + 30 = 70',
        distractors: ['27 + (13 + 30) = 27 + 43', 'Barchasi bir xil qiyin', 'Guruhlab bo‘lmaydi'],
        explanation: '27 + 13 = 40 (yaxlit son hosil bo‘ladi), 40 + 30 = 70.',
      },
      {
        text: 'Jadvalda: 1-kuni 20 l, 2-kuni 25 l, 3-kuni 10 l sut berilgan. Jami necha litr sut berilgan?',
        correctAnswer: '55 l (20 + 25 + 10 = 55)',
        distractors: ['50 l', '60 l', '45 l'],
        explanation: '20 + 10 = 30, 30 + 25 = 55 l.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: '(10 l + 20 l) + 30 l ifodani hisoblang:',
        correctAnswer: '60 l',
        distractors: ['50 l', '70 l', '40 l'],
        explanation: '10 + 20 = 30 l, 30 + 30 = 60 l.',
      },
      {
        text: '(5 kg + 15 kg) + 10 kg ifodani hisoblang:',
        correctAnswer: '30 kg',
        distractors: ['25 kg', '35 kg', '20 kg'],
        explanation: '5 + 15 = 20 kg, 20 + 10 = 30 kg.',
      },
      {
        text: 'Qo‘shishning guruhlash xossasini ko‘rsating:',
        correctAnswer: '(a + b) + c = a + (b + c)',
        distractors: ['a - b = b - a', 'a + b = a - b', 'a + 0 = 0'],
        explanation: 'Qo‘shishning guruhlash qonuni: (a + b) + c = a + (b + c).',
      },
      {
        text: '(14 sm + 6 sm) + 20 sm nechaga teng?',
        correctAnswer: '40 sm',
        distractors: ['35 sm', '45 sm', '30 sm'],
        explanation: '14 + 6 = 20 sm, 20 + 20 = 40 sm.',
      },
      {
        text: '20 dm + (10 dm + 30 dm) ifodani hisoblang:',
        correctAnswer: '60 dm',
        distractors: ['50 dm', '70 dm', '40 dm'],
        explanation: '10 + 30 = 40 dm, 20 + 40 = 60 dm.',
      },
      {
        text: '(25 kg + 25 kg) + 15 kg ifodani hisoblang:',
        correctAnswer: '65 kg',
        distractors: ['60 kg', '70 kg', '55 kg'],
        explanation: '25 + 25 = 50 kg, 50 + 15 = 65 kg.',
      },

      // 8 ta o'rtacha
      {
        text: 'Qulay usulda guruhlang va hisoblang: 17 l + 40 l + 3 l',
        correctAnswer: '60 l ((17 + 3) + 40 = 20 + 40 = 60)',
        distractors: ['50 l', '55 l', '65 l'],
        explanation: '17 + 3 = 20 l, 20 + 40 = 60 l.',
      },
      {
        text: 'Qulay usulda hisoblang: 36 kg + 20 kg + 4 kg',
        correctAnswer: '60 kg ((36 + 4) + 20 = 40 + 20 = 60)',
        distractors: ['50 kg', '56 kg', '65 kg'],
        explanation: '36 + 4 = 40 kg, 40 + 20 = 60 kg.',
      },
      {
        text: 'Qulay usulda hisoblang: 21 sm + 50 sm + 9 sm',
        correctAnswer: '80 sm ((21 + 9) + 50 = 30 + 50 = 80)',
        distractors: ['70 sm', '85 sm', '75 sm'],
        explanation: '21 + 9 = 30 sm, 30 + 50 = 80 sm.',
      },
      {
        text: 'Jadval: 1-javonda 15 ta, 2-javonda 25 ta, 3-javonda 18 ta kitob bor. Jami kitoblar sonini toping:',
        correctAnswer: '58 ta ((15 + 25) + 18 = 40 + 18 = 58)',
        distractors: ['55 ta', '60 ta', '48 ta'],
        explanation: '15 + 25 = 40 ta, 40 + 18 = 58 ta.',
      },
      {
        text: 'Jadval: Dushanba 30 kg, Seshanba 22 kg, Chorshanba 8 kg sabzi sotildi. Uch kunda jami necha kg sabzi sotilgan?',
        correctAnswer: '60 kg ((22 + 8) + 30 = 30 + 30 = 60)',
        distractors: ['50 kg', '65 kg', '55 kg'],
        explanation: '22 + 8 = 30 kg, 30 + 30 = 60 kg.',
      },
      {
        text: '(28 l + 12 l) + (15 l + 5 l) amalini hisoblang:',
        correctAnswer: '60 l (40 + 20 = 60)',
        distractors: ['50 l', '55 l', '65 l'],
        explanation: '28 + 12 = 40 l, 15 + 5 = 20 l; 40 + 20 = 60 l.',
      },
      {
        text: 'Qaysi ifoda to‘g‘ri guruhlangan: 19 + 25 + 1?',
        correctAnswer: '(19 + 1) + 25',
        distractors: ['(19 + 25) - 1', '(25 - 1) + 19', '19 + 1 - 25'],
        explanation: '19 ga 1 ni qo‘shib 20 hosil qilish eng qulay.',
      },
      {
        text: '(35 kg + 15 kg) - 20 kg amalini hisoblang:',
        correctAnswer: '30 kg (50 - 20 = 30)',
        distractors: ['25 kg', '35 kg', '40 kg'],
        explanation: '35 + 15 = 50 kg, 50 - 20 = 30 kg.',
      },

      // 4 ta qiyinroq
      {
        text: 'Qulay usulda hisoblang: 16 l + 27 l + 14 l + 13 l',
        correctAnswer: '70 l ((16 + 14) + (27 + 13) = 30 + 40 = 70)',
        distractors: ['60 l', '65 l', '75 l'],
        explanation: '16 + 14 = 30 l, 27 + 13 = 40 l; 30 + 40 = 70 l.',
      },
      {
        text: 'Qulay usulda hisoblang: 31 kg + 24 kg + 9 kg + 16 kg',
        correctAnswer: '80 kg ((31 + 9) + (24 + 16) = 40 + 40 = 80)',
        distractors: ['70 kg', '85 kg', '75 kg'],
        explanation: '31 + 9 = 40 kg, 24 + 16 = 40 kg; 40 + 40 = 80 kg.',
      },
      {
        text: 'Jadval: 1-idishda 18 l, 2-idishda 24 l, 3-idishda 12 l sut bor. Sutlar 60 litrli bochkaga quyilsa, bochka to‘ladimi?',
        correctAnswer: 'To‘lmaydi (18 + 12 + 24 = 54 l; 54 l < 60 l)',
        distractors: ['To‘ladi (to‘liq 60 l bo‘ladi)', 'To‘lib toshadi', 'Hisoblab bo‘lmaydi'],
        explanation: '18 + 12 = 30 l, 30 + 24 = 54 l. 54 l < 60 l, demak to‘lmaydi.',
      },
      {
        text: 'Tenglik to‘g‘ri bo‘lishi uchun bo‘sh joyga son qo‘ying: (15 + □) + 20 = 50',
        correctAnswer: '15 (15 + 15 = 30; 30 + 20 = 50)',
        distractors: ['10', '20', '25'],
        explanation: '50 - 20 = 30, 30 - 15 = 15.',
      },

      // 2 ta murakkab masala
      {
        text: 'Bog‘bon dushanba kuni 28 kg, seshanba kuni 15 kg, chorshanba kuni 22 kg olma terdi. Qulay usulda uch kunda terilgan olma massasini toping:',
        correctAnswer: '65 kg ((28 + 22) + 15 = 50 + 15 = 65)',
        distractors: ['60 kg', '70 kg', '55 kg'],
        explanation: '28 + 22 = 50 kg, 50 + 15 = 65 kg.',
      },
      {
        text: 'Avtobusda uch guruh sayyohlar bor: 1-guruhda 17 kishi, 2-guruhda 24 kishi, 3-guruhda 13 kishi. Sayyohlar jami necha kishi?',
        correctAnswer: '54 nafar ((17 + 13) + 24 = 30 + 24 = 54)',
        distractors: ['50 nafar', '58 nafar', '48 nafar'],
        explanation: '17 + 13 = 30 kishi, 30 + 24 = 54 kishi.',
      },
    ],
  },

  // 42-dars. Masalalar yechish (takrorlash)
  {
    bookNumber: 42,
    title: 'Masalalar yechish (takrorlash)',
    emoji: '🏆',
    shortDesc: '3-qism bo‘yicha o‘rganilgan barcha amallar va masalalarni mustahkamlash.',
    intro: 'Ikki xonali sonlar, amallar, tenglamasimon noma’lum son masalalari (□ + 33 = 76), zanjirli amallar va matnli masalalarni mustahkamlaymiz.',
    keyPoints: [
      'Amallarni hisoblash: 25 + 43 = 68, 80 − 60 = 20.',
      'Noma’lum qo‘shiluvchini topish: □ + 33 = 76 bo‘lsa, □ = 76 − 33 = 43.',
      'Uchta qo‘shiluvchili amallar: 12 + 8 + □ = 27 bo‘lsa, 20 + 7 = 27.',
    ],
    miniExample: {
      emojis: '🏆 □ + 33 = 76 => □ = 76 - 33 = 43',
      text: 'O‘ylangan songa 33 qo‘shilsa 76 bo‘ldi. O‘ylangan son: 76 - 33 = 43.',
    },
    xpReward: 100,
    coinReward: 10,
    estMinutes: 8,
    practice: [
      {
        text: '25 + 43 amalini hisoblang:',
        correctAnswer: '68',
        distractors: ['67', '69', '58'],
        explanation: '20 + 40 = 60, 5 + 3 = 8. 60 + 8 = 68.',
      },
      {
        text: '80 - 60 amalini hisoblang:',
        correctAnswer: '20',
        distractors: ['10', '30', '140'],
        explanation: '80 - 60 = 20.',
      },
      {
        text: 'O‘ylangan songa 33 qo‘shilsa, 76 hosil bo‘ldi (□ + 33 = 76). O‘ylangan son nechaga teng?',
        correctAnswer: '43 (76 - 33 = 43)',
        distractors: ['40', '45', '109'],
        explanation: '76 - 33 = 43.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: '25 + 43 amalini hisoblang:',
        correctAnswer: '68',
        distractors: ['67', '69', '58'],
        explanation: '25 + 43 = 68.',
      },
      {
        text: '80 - 60 amalini hisoblang:',
        correctAnswer: '20',
        distractors: ['10', '30', '140'],
        explanation: '80 - 60 = 20.',
      },
      {
        text: '54 + 20 amalini hisoblang:',
        correctAnswer: '74',
        distractors: ['70', '75', '34'],
        explanation: '54 + 20 = 74.',
      },
      {
        text: '76 - 30 amalini hisoblang:',
        correctAnswer: '46',
        distractors: ['40', '56', '36'],
        explanation: '76 - 30 = 46.',
      },
      {
        text: '12 + 8 + □ = 27 bo‘lsa, bo‘sh katakdagi son nechaga teng?',
        correctAnswer: '7 (20 + 7 = 27)',
        distractors: ['5', '8', '9'],
        explanation: '12 + 8 = 20. 27 - 20 = 7.',
      },
      {
        text: '45 + □ = 55 bo‘lsa, noma’lum sonni toping:',
        correctAnswer: '10 (55 - 45 = 10)',
        distractors: ['5', '15', '20'],
        explanation: '55 - 45 = 10.',
      },

      // 8 ta o'rtacha
      {
        text: 'O‘ylangan songa 33 qo‘shilsa 76 hosil bo‘ladi (□ + 33 = 76). O‘ylangan son nechaga teng?',
        correctAnswer: '43 (76 - 33 = 43)',
        distractors: ['40', '42', '109'],
        explanation: '76 - 33 = 43.',
      },
      {
        text: '68 - □ = 25 tenglikdagi noma’lum sonni toping:',
        correctAnswer: '43 (68 - 25 = 43)',
        distractors: ['40', '45', '93'],
        explanation: '68 - 25 = 43.',
      },
      {
        text: '□ - 24 = 32 tenglikdagi noma’lum son nechaga teng?',
        correctAnswer: '56 (32 + 24 = 56)',
        distractors: ['54', '58', '8'],
        explanation: '32 + 24 = 56.',
      },
      {
        text: '15 + 15 + □ = 40 bo‘lsa, bo‘sh katakdagi son nechaga teng?',
        correctAnswer: '10 (30 + 10 = 40)',
        distractors: ['5', '15', '20'],
        explanation: '15 + 15 = 30. 40 - 30 = 10.',
      },
      {
        text: '34 + 23 ifodani hisoblang:',
        correctAnswer: '57',
        distractors: ['55', '59', '67'],
        explanation: '34 + 23 = 57.',
      },
      {
        text: '89 - 46 amalini hisoblang:',
        correctAnswer: '43',
        distractors: ['45', '41', '33'],
        explanation: '89 - 46 = 43.',
      },
      {
        text: 'Akromda 34 ta yong‘oq bor edi. Ukasiga 12 ta berdi. Akromda nechta yong‘oq qoldi?',
        correctAnswer: '22 ta (34 - 12 = 22)',
        distractors: ['20 ta', '24 ta', '46 ta'],
        explanation: '34 - 12 = 22 ta.',
      },
      {
        text: 'Zanjirli amalni bajaring: 50 + 20 - 30',
        correctAnswer: '40 (70 - 30 = 40)',
        distractors: ['30', '50', '60'],
        explanation: '50 + 20 = 70, 70 - 30 = 40.',
      },

      // 4 ta qiyinroq
      {
        text: 'Taqqoslang: 35 + 24 va 70 - 10',
        correctAnswer: '35 + 24 < 70 - 10 (59 < 60)',
        distractors: ['Birinchisi katta', 'Ikkalasi teng', 'Taqqoslab bo‘lmaydi'],
        explanation: '35 + 24 = 59, 70 - 10 = 60. 59 < 60.',
      },
      {
        text: 'Kutubxonada 42 ta ertak kitobi va undan 15 ta ko‘p darslik bor. Kutubxonada nechta darslik bor?',
        correctAnswer: '57 ta (42 + 15 = 57)',
        distractors: ['55 ta', '59 ta', '27 ta'],
        explanation: '42 + 15 = 57 ta.',
      },
      {
        text: '28 + □ + 12 = 65 bo‘lsa, □ o‘rnidagi sonni toping:',
        correctAnswer: '25 (28 + 12 = 40; 65 - 40 = 25)',
        distractors: ['20', '30', '35'],
        explanation: '28 + 12 = 40. 65 - 40 = 25.',
      },
      {
        text: 'Maktab bog‘ida 26 ta olma daraxti va 14 ta nok daraxti bor. Yana 20 ta o‘rik ko‘chati ekildi. Bog‘da jami nechta daraxt bo‘ldi?',
        correctAnswer: '60 ta ((26 + 14) + 20 = 40 + 20 = 60)',
        distractors: ['50 ta', '55 ta', '65 ta'],
        explanation: '26 + 14 = 40, 40 + 20 = 60 ta.',
      },

      // 2 ta murakkab masala
      {
        text: 'Avtobusda 38 yo‘lovchi bor edi. Bekatda 12 yo‘lovchi tushdi va 14 yangi yo‘lovchi chiqdi. Avtobusda endi necha yo‘lovchi bo‘ldi?',
        correctAnswer: '40 nafar (38 - 12 + 14 = 40)',
        distractors: ['36 nafar', '42 nafar', '50 nafar'],
        explanation: '38 - 12 = 26 nafar, 26 + 14 = 40 nafar.',
      },
      {
        text: 'Bir qutida 35 ta, ikkinchi qutida undan 10 ta kam qalam bor. Ikkala qutida jami nechta qalam bor?',
        correctAnswer: '60 ta (2-quti: 25; 35 + 25 = 60)',
        distractors: ['50 ta', '55 ta', '70 ta'],
        explanation: '2-qutida: 35 - 10 = 25 ta. Jami: 35 + 25 = 60 ta.',
      },
    ],
  },

  // 43-dars. 3-nazorat ishi (isReview: true)
  {
    bookNumber: 43,
    title: '3-nazorat ishi',
    emoji: '📝',
    isReview: true,
    shortDesc: '1-sinf Matematika 3-qism bo‘yicha yakuniy bilim va ko‘nikmalarni sinovdan o‘tkazish.',
    intro: '3-qismda o‘rganilgan barcha mavzular (masalalar, taqqoslash, kattaliklar — sm, dm, kg, l) bo‘yicha 20 ta savolli nazorat testi.',
    keyPoints: [
      'Masalaning tarkibiy qismlari va ularni yechish tartibi.',
      'Sonlarni taqqoslash, orttirish va kamaytirish amallari.',
      'Kattaliklar (uzunlik, massa, hajm) va ularning xossalari bo‘yicha hisoblashlar.',
    ],
    miniExample: {
      emojis: '📝 3-nazorat ishi: 20 ta savol',
      text: 'Barcha mavzulardan 20 ta savol. Diqqat bilan o‘qib, to‘g‘ri javobni belgilang!',
    },
    xpReward: 120,
    coinReward: 12,
    estMinutes: 15,
    practice: [],
    test: [
      // 6 ta oson
      {
        text: 'Masalaning tarkibiy qismlari to‘g‘ri ko‘rsatilgan qatorni toping:',
        correctAnswer: 'Shart, savol, yechim, javob',
        distractors: ['Faqat savol va javob', 'Rasm, son, chiziq', 'Shart va belgi'],
        explanation: 'Masala to‘rtta asosiy qismdan iborat: shart, savol, yechim va javob.',
      },
      {
        text: '«15 dan 5 ta ko‘p» bo‘lgan son qaysi?',
        correctAnswer: '20 (15 + 5 = 20)',
        distractors: ['10 (15 - 5 = 10)', '18', '25'],
        explanation: '15 + 5 = 20.',
      },
      {
        text: '«30 dan 10 ta kam» bo‘lgan son nechaga teng?',
        correctAnswer: '20 (30 - 10 = 20)',
        distractors: ['40 (30 + 10 = 40)', '25', '15'],
        explanation: '30 - 10 = 20.',
      },
      {
        text: '1 detsimetr necha santimetrga teng?',
        correctAnswer: '10 sm',
        distractors: ['100 sm', '1 sm', '20 sm'],
        explanation: '1 dm = 10 sm.',
      },
      {
        text: 'Massa o‘lchov birligi qaysi?',
        correctAnswer: 'Kilogramm (kg)',
        distractors: ['Litr (l)', 'Santimetr (sm)', 'Detsimetr (dm)'],
        explanation: 'Massa kilogrammda (kg) o‘lchanadi.',
      },
      {
        text: 'Suyuqliklar sig‘imi qaysi birlikda o‘lchanadi?',
        correctAnswer: 'Litr (l)',
        distractors: ['Kilogramm (kg)', 'Santimetr (sm)', 'Gramm'],
        explanation: 'Hajm litrda (l) o‘lchanadi.',
      },

      // 8 ta o'rtacha
      {
        text: '45 + 32 amalini hisoblang:',
        correctAnswer: '77',
        distractors: ['75', '79', '67'],
        explanation: '40 + 30 = 70, 5 + 2 = 7; 70 + 7 = 77.',
      },
      {
        text: '88 - 35 amalini hisoblang:',
        correctAnswer: '53',
        distractors: ['55', '51', '43'],
        explanation: '80 - 30 = 50, 8 - 5 = 3; 50 + 3 = 53.',
      },
      {
        text: '76 soni 88 sonidan qancha kichik?',
        correctAnswer: '12 ga kichik (88 - 76 = 12)',
        distractors: ['10 ga', '14 ga', '16 ga'],
        explanation: '88 - 76 = 12.',
      },
      {
        text: 'Bochkada 50 l suv bor edi. Undan 20 l olindi. Necha litr suv qoldi?',
        correctAnswer: '30 l (50 - 20 = 30)',
        distractors: ['25 l', '35 l', '70 l'],
        explanation: '50 - 20 = 30 l.',
      },
      {
        text: 'Tarvuz 6 kg, qovun 4 kg. Ular birgalikda necha kilogramm?',
        correctAnswer: '10 kg (6 + 4 = 10)',
        distractors: ['9 kg', '11 kg', '2 kg'],
        explanation: '6 + 4 = 10 kg.',
      },
      {
        text: 'O‘ylangan songa 33 qo‘shilsa 76 hosil bo‘ldi (□ + 33 = 76). O‘ylangan sonni toping:',
        correctAnswer: '43 (76 - 33 = 43)',
        distractors: ['40', '45', '109'],
        explanation: '76 - 33 = 43.',
      },
      {
        text: '12 + 8 + □ = 27 bo‘lsa, □ o‘rnidagi son nechaga teng?',
        correctAnswer: '7 (20 + 7 = 27)',
        distractors: ['6', '8', '9'],
        explanation: '12 + 8 = 20; 27 - 20 = 7.',
      },
      {
        text: 'Qo‘shishning o‘rin almashtirish xossasini ko‘rsating:',
        correctAnswer: 'a + b = b + a',
        distractors: ['a - b = b - a', 'a + b = a - b', 'a + 0 = 0'],
        explanation: 'a + b = b + a — qo‘shishning o‘rin almashtirish xossasi.',
      },

      // 4 ta qiyinroq
      {
        text: 'Qulay usulda hisoblang: 23 kg + 40 kg + 7 kg',
        correctAnswer: '70 kg ((23 + 7) + 40 = 30 + 40 = 70)',
        distractors: ['60 kg', '65 kg', '75 kg'],
        explanation: '23 + 7 = 30 kg, 30 + 40 = 70 kg.',
      },
      {
        text: 'Taqqoslang: 3 dm 5 sm va 40 sm (1 dm = 10 sm)',
        correctAnswer: '3 dm 5 sm < 40 sm (35 sm < 40 sm)',
        distractors: ['3 dm 5 sm > 40 sm', 'Ikkalasi teng', 'Taqqoslab bo‘lmaydi'],
        explanation: '3 dm 5 sm = 35 sm. 35 sm < 40 sm.',
      },
      {
        text: 'Bir qutida 24 ta, ikkinchisida undan 6 ta ko‘p qalam bor. Ikkala qutida jami nechta qalam bor?',
        correctAnswer: '54 ta (2-quti: 30; 24 + 30 = 54)',
        distractors: ['30 ta', '50 ta', '60 ta'],
        explanation: '2-qutida: 24 + 6 = 30 ta. Jami: 24 + 30 = 54 ta.',
      },
      {
        text: 'Avtobusda 35 yo‘lovchi bor edi. Bekatda 15 kishi tushdi va 20 kishi chiqdi. Avtobusda necha yo‘lovchi bo‘ldi?',
        correctAnswer: '40 nafar (35 - 15 + 20 = 40)',
        distractors: ['30 nafar', '45 nafar', '50 nafar'],
        explanation: '35 - 15 = 20, 20 + 20 = 40 nafar.',
      },

      // 2 ta murakkab masala
      {
        text: 'Do‘konga 45 kg kartoshka va 35 kg piyoz keltirildi. Kun davomida 50 kg sabzavot sotildi. Necha kilogramm sabzavot qoldi?',
        correctAnswer: '30 kg (45 + 35 = 80; 80 - 50 = 30)',
        distractors: ['25 kg', '35 kg', '40 kg'],
        explanation: 'Jami: 45 + 35 = 80 kg. Qoldi: 80 - 50 = 30 kg.',
      },
      {
        text: 'Bir bochkada 48 l suv bor. Ikkinchisida undan 15 l kam suv bor. Ikkala bochkada jami necha litr suv bor?',
        correctAnswer: '81 l (2-bochka: 33; 48 + 33 = 81)',
        distractors: ['75 l', '85 l', '33 l'],
        explanation: '2-bochkada: 48 - 15 = 33 l. Jami: 48 + 33 = 81 l.',
      },
    ],
  },
];

console.log('Generating Part 3 Chapter 3B lessons (37-42 and review 43)...');
for (const lessonDef of lessonsPart3Ch3B) {
  const seed = buildLessonSeed(lessonDef);
  saveLessonFile(3, lessonDef.bookNumber, seed, lessonDef.isReview);
  console.log(`✅ Saved ${lessonDef.isReview ? 'review' : 'lesson'}-${lessonDef.bookNumber}.json`);
}
