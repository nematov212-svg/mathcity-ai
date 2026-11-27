import { LessonDataDef, buildLessonSeed, saveLessonFile } from './generatorTypes.js';

const lessonsPart3Ch1A: LessonDataDef[] = [
  // 1-dars. Masalaning tarkibi
  {
    bookNumber: 1,
    title: 'Masalaning tarkibi',
    emoji: '🧩',
    shortDesc: 'Masalaning sharti, savoli, yechimi va javobi.',
    intro: 'Har bir masala shart, savol, yechim va javobdan iborat bo‘ladi.',
    keyPoints: [
      'Masala shartida ma’lum sonlar va vaziyat beriladi.',
      'Masala savoli nimani topish kerakligini ko‘rsatadi.',
      'Yechim amallar ifodasi, javob esa savolga aniq xulosadir.',
    ],
    miniExample: {
      emojis: '🔴🔴🔴 + 🔵🔵 = 5 ta',
      text: '3 ta qizil va 2 ta ko‘k shar bor. Jami nechta shar bor? Yechim: 3 + 2 = 5 ta shar.',
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 7,
    practice: [
      {
        text: 'Masalaning qaysi qismida bizga ma’lum bo‘lgan ma’lumotlar aytiladi?',
        correctAnswer: 'Shartida',
        distractors: ['Savolida', 'Javobida', 'Yechimida'],
        explanation: 'Masala shartida berilgan ma’lumotlar bayon qilinadi.',
      },
      {
        text: '«Savatda 5 ta olma bor edi, yana 3 ta solindi. Nechta olma bo‘ldi?» Masalaning savoli qaysi?',
        correctAnswer: 'Nechta olma bo‘ldi?',
        distractors: ['Savatda 5 ta olma bor edi', 'Yana 3 ta solindi', 'Jami 8 ta olma'],
        explanation: '«Nechta olma bo‘ldi?» jumlasi masala savolidir.',
      },
      {
        text: 'Masalada shart va savol bo‘lsa, keyingi bosqich nima?',
        correctAnswer: 'Yechimini topish',
        distractors: ['Yangi shart to‘qish', 'Kitobni yopish', 'Rasm chizmaslik'],
        explanation: 'Shart va savoldan so‘ng ifoda tuzilib, yechim topiladi.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'Masala nechta asosiy tarkibiy qismdan iborat?',
        correctAnswer: '4 ta (shart, savol, yechim, javob)',
        distractors: ['2 ta (faqat sonlar)', '1 ta (faqat javob)', '6 ta (harflar)'],
        explanation: 'Masala to‘rtta asosiy qismdan iborat: shart, savol, yechim, javob.',
      },
      {
        text: '«Bog‘da 7 ta chinor va 3 ta archa ko‘chati ekildi.» Bu jumla masalaning qaysi qismi?',
        correctAnswer: 'Sharti',
        distractors: ['Savoli', 'Yechimi', 'Javobi'],
        explanation: 'Bu yerda ma’lumot berilgan, shuning uchun bu masala sharti.',
      },
      {
        text: 'Quyidagilardan qaysi biri masala SAVOLI hisoblanadi?',
        correctAnswer: 'Avtobusda jami nechta yo‘lovchi qoldi?',
        distractors: ['Avtobus bekatga to‘xtadi', '12 ta bola maktabga bordi', '7 qo‘shilgan 2 teng 9'],
        explanation: 'So‘roq belgisi bilan tugab, noma’lumni so‘ragan jumla savoldir.',
      },
      {
        text: 'Masala yechimi ifoda ko‘rinishida qanday yoziladi?',
        correctAnswer: 'Amallar bilan (masalan: 12 + 7 = 19)',
        distractors: ['Faqat so‘zlar bilan', 'Faqat nuqtalar bilan', 'Hech narsa yozilmaydi'],
        explanation: 'Yechim arifmetik ifoda shaklida amallar yordamida yoziladi.',
      },
      {
        text: 'Savolsiz berilgan matn to‘liq masala bo‘la oladimi?',
        correctAnswer: 'Yo‘q, savol bo‘lmasa masala hisoblanmaydi',
        distractors: ['Ha, har doim masala bo‘ladi', 'Faqat darsda bo‘ladi', 'Faqat son bo‘lsa bo‘ladi'],
        explanation: 'Savoli bo‘lmagan matn shunchaki hikoya yoki xabar bo‘ladi, masala emas.',
      },
      {
        text: '«Doskada 6 ta misol bor edi, Salim 2 tasini yechdi.» Masala bo‘lishi uchun nima yetishmayapti?',
        correctAnswer: 'Savol',
        distractors: ['Shart', 'Sonlar', 'O‘quvchi ismi'],
        explanation: 'Matnda shart bor, lekin «Nechtasi qoldi?» kabi savol yetishmayapti.',
      },

      // 8 ta o'rtacha
      {
        text: 'Fotimada 12 ta rangli va 7 ta oq-qora rasm bor. Jami nechta rasm bor? Yechim ifodasini toping:',
        correctAnswer: '12 + 7 = 19 ta',
        distractors: ['12 - 7 = 5 ta', '12 + 10 = 22 ta', '7 + 7 = 14 ta'],
        explanation: 'Jami rasmlarni topish uchun qo‘shiladi: 12 + 7 = 19 ta.',
      },
      {
        text: '«Akmal 15 ta daftar sotib oldi. Ulardan 5 tasi katak daftar, qolgani chiziqli daftar.» Savol qanday bo‘lishi kerak?',
        correctAnswer: 'Nechta chiziqli daftar sotib oldi?',
        distractors: ['Daftar qayerda sotiladi?', 'Akmal nechanchi sinfda o‘qiydi?', 'Katak daftar nechta?'],
        explanation: 'Shartda katak daftar ma’lum, qolgan chiziqli daftarlar sonini so‘rash mantiqiydir.',
      },
      {
        text: 'Qaysi matn TO‘LIQ masala hisoblanadi?',
        correctAnswer: 'Bog‘da 8 ta olma bor edi, 3 tasi uzildi. Nechta olma qoldi?',
        distractors: ['Bog‘da 8 ta olma va 3 ta nok bor.', 'Savatchada anorlar juda shirin ekan.', 'Nechta qalam bor?'],
        explanation: 'Bu matnda ham shart, ham aniq savol mavjud.',
      },
      {
        text: 'Masalaning javobi qanday yoziladi?',
        correctAnswer: 'Javob: 19 ta rasm',
        distractors: ['Javob: 19 daqiqa', 'Javob: son', 'Javob: noma’lum'],
        explanation: 'Javob savolga mos ravishda birligi bilan aniq yoziladi.',
      },
      {
        text: 'Agar masalada «jami», «birgalikda» so‘zlari bo‘lsa, ko‘pincha qaysi amal bajariladi?',
        correctAnswer: 'Qo‘shish amali (+)',
        distractors: ['Ayirish amali (-)', 'Taqqoslash amali', 'Amal bajarilmaydi'],
        explanation: 'Jami miqdorni topish uchun butunni hisoblashda qo‘shish amali qo‘llaniladi.',
      },
      {
        text: 'Agar masalada «qoldi», «kamaydi» so‘zlari bo‘lsa, qaysi amal tanlanadi?',
        correctAnswer: 'Ayirish amali (-)',
        distractors: ['Qo‘shish amali (+)', 'O‘rin almashtirish', 'Hech qanday amal'],
        explanation: 'Qolgan qismni topish uchun ayirish amali bajariladi.',
      },
      {
        text: 'Quyidagi ifodaga qaysi masala sharti mos keladi: 14 - 4 = 10 ta?',
        correctAnswer: 'Avtobusda 14 yo‘lovchi bor edi, 4 nafari tushdi. Nechtasi qoldi?',
        distractors: ['14 ta qalam va 4 ta o‘chirg‘ich sotib olindi.', '10 ta olmaga 4 ta olma qo‘shildi.', 'Doskada 14 ta son bor edi, yana 4 ta yozildi.'],
        explanation: '14 dan 4 kamayishi yo‘lovchilar tushib ketishiga to‘g‘ri keladi.',
      },
      {
        text: 'Masala shartidagi ma’lumotlarni qisqacha yozib olish qanday nomlanadi?',
        correctAnswer: 'Qisqa yozuv',
        distractors: ['Uzun hikoya', 'Yechim formulasi', 'Lug‘at daftari'],
        explanation: 'Masala berilganlarini qisqa va qulay shaklda yozish qisqa yozuv deyiladi.',
      },

      // 4 ta qiyinroq
      {
        text: 'Qaysi holatda berilgan matn MASALA EMAS?',
        correctAnswer: '«Dukonda 20 ta non bor edi. Non juda issiq edi.»',
        distractors: ['«Dukonda 20 ta non bor edi, 5 tasi sotildi. Nechta non qoldi?»', '«Kutubxonada 30 ta kitob bor, 10 tasi olindi. Qancha qoldi?»', '«Savatda 6 ta shaftoli va 4 ta nok bor. Jami nechta meva bor?»'],
        explanation: 'Bu yerda savol yo‘q, shuning uchun u masala emas.',
      },
      {
        text: 'Matnni to‘g‘rilang: «Sinfda 10 ta parta bor. Nechta o‘quvchi o‘tiribdi?» Bu yerda xatolik nimada?',
        correctAnswer: 'Shart yetarli emas (bitta partaga nechtadan o‘tirish aytilmagan)',
        distractors: ['Savol juda uzun', 'Parta soni noto‘g‘ri', 'Hamma narsa to‘liq'],
        explanation: 'Masala yechilishi uchun shartda yetarli ma’lumot bo‘lishi shart.',
      },
      {
        text: 'Aziz 8 ta, Said esa undan 4 ta ko‘p misol yechdi. Masalani yechish uchun birinchi qadam qaysi?',
        correctAnswer: 'Said nechta misol yechganini topish (8 + 4)',
        distractors: ['Azizdan Saidni ayirish (8 - 4)', 'Saidning daftarlarini sanash', 'Javobni darhol 8 deb yozish'],
        explanation: 'Oldin noma’lum ikkinchi qism topiladi: 8 + 4 = 12 ta.',
      },
      {
        text: 'Masala sharti: «I savatda 16 ta olma, II savatda esa 6 ta olma kam». II savatda nechta olma bor?',
        correctAnswer: '10 ta (16 - 6 = 10)',
        distractors: ['22 ta (16 + 6 = 22)', '12 ta', '8 ta'],
        explanation: 'Kam bo‘lgani uchun ayiramiz: 16 - 6 = 10 ta.',
      },

      // 2 ta murakkab masala
      {
        text: 'Gulshanda 15 ta atirgul bor edi. Ertalab 3 ta, tushdan keyin yana 2 ta atirgul ochildi. Jami nechta atirgul bo‘ldi?',
        correctAnswer: '20 ta (15 + 3 + 2 = 20)',
        distractors: ['18 ta', '19 ta', '16 ta'],
        explanation: 'Barcha ochilgan gullar qo‘shiladi: 15 + 3 + 2 = 20 ta.',
      },
      {
        text: 'Kutubxonadagi 18 ta ertak kitobidan 5 tasini Anvar, 3 tasini Malika o‘qishga oldi. Kutubxonada nechta kitob qoldi?',
        correctAnswer: '10 ta (18 - 5 - 3 = 10)',
        distractors: ['12 ta', '13 ta', '8 ta'],
        explanation: 'Olingan kitoblar ayirib tashlanadi: 18 - 5 = 13, 13 - 3 = 10 ta kitob qoldi.',
      },
    ],
  },

  // 2-dars. Masalani yechish algoritmi
  {
    bookNumber: 2,
    title: 'Masalani yechish algoritmi',
    emoji: '📋',
    shortDesc: 'Masalani reja va qadamlar asosida yechish.',
    intro: 'Masalani to‘g‘ri yechish uchun 4 qadamdan iborat rejaga rioya qilinadi.',
    keyPoints: [
      '1-qadam: Shartni o‘qish va berilganlarni ajratish.',
      '2-qadam: Savolni aniqlash va qidirilayotgan narsani tushunish.',
      '3-qadam: Ifoda tuzish va hisoblash.',
      '4-qadam: Javobni yozish va tekshirish.',
    ],
    miniExample: {
      emojis: '📋 1) O‘qi ➔ 2) Savol ➔ 3) Ifoda ➔ 4) Javob',
      text: 'Reja: Berilganlar ajratiladi, ifoda tuziladi va javob tekshirib yoziladi.',
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 7,
    practice: [
      {
        text: 'Masalani yechish rejasining birinchi bandi nima?',
        correctAnswer: 'Berilganlarni ajratish va tushunish',
        distractors: ['Darhol javobni yozish', 'Faqat sonlarni qo‘shish', 'Savolni o‘chirish'],
        explanation: 'Masala shartini sinchkovlik bilan o‘qib, ma’lumotlarni ajratish 1-qadamdir.',
      },
      {
        text: 'Ifoda tuzish va hisoblash masalani yechish rejasining nechanchi bandi?',
        correctAnswer: '3-bandi',
        distractors: ['1-bandi', '2-bandi', '4-bandi'],
        explanation: 'Shart va savoldan so‘ng 3-bandda ifoda tuziladi va hisoblanadi.',
      },
      {
        text: 'Masala yechib bo‘lingach, oxirgi qadamda nima qilinadi?',
        correctAnswer: 'Javob yoziladi va tekshiriladi',
        distractors: ['Yana boshidan boshlanadi', 'Kitob yirtiladi', 'Savol o‘zgartiriladi'],
        explanation: 'To‘rtinchi yakuniy qadamda natija tekshirilib, javob yoziladi.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'Masala yechish algoritmi deganda nima tushuniladi?',
        correctAnswer: 'Masalani yechishning tartibli rejasi',
        distractors: ['Faqat daftarning chizig‘i', 'Faqatgina bitta son', 'O‘yin qoidasi'],
        explanation: 'Algoritm — bu maqsadga yetaklovchi ketma-ket qadamlar va reja.',
      },
      {
        text: 'Masala shartini o‘qiyotganda eng avvalo nimalarga e’tibor berish kerak?',
        correctAnswer: 'Nimalar ma’lum va nimani topish kerakligiga',
        distractors: ['Harflarning chiroyliligiga', 'Matn qanchalik uzunligiga', 'Rasmning rangiga'],
        explanation: 'Masalada ma’lum kattaliklar va savolga asosiy e’tibor qaratiladi.',
      },
      {
        text: 'Quyidagilardan qaysi biri 2-qadam: «Savolni aniqlash»ga misol bo‘ladi?',
        correctAnswer: '«Mendan nima so‘ralyapti: jami miqdormi yoki qolgani?»',
        distractors: ['«10 ga 5 ni qo‘shdim»', '«Javob: 15 ta»', '«Kitobni ochdim»'],
        explanation: 'Nimani topish kerakligini aniqlash savolni tushunishdir.',
      },
      {
        text: '«12 + 6 = 18» yozuvi rejaning qaysi bosqichiga tegishli?',
        correctAnswer: 'Ifoda tuzish va hisoblash (3-qadam)',
        distractors: ['Shartni o‘qish', 'Savol tanlash', 'Daftarni yopish'],
        explanation: 'Arifmetik amalni yozib hisoblash 3-bosqich hisoblanadi.',
      },
      {
        text: 'Nima uchun masalaning javobini tekshirish muhim?',
        correctAnswer: 'Xatoga yo‘l qo‘yilmaganiga ishonch hosil qilish uchun',
        distractors: ['Vaqtni cho‘zish uchun', 'Doskani bo‘yash uchun', 'Tekshirish shart emas'],
        explanation: 'Javobni tekshirish hisob-kitobning to‘g‘riligini kafolatlaydi.',
      },
      {
        text: 'Reja bo‘yicha to‘g‘ri ketma-ketlikni ko‘rsating:',
        correctAnswer: 'Shart ➔ Savol ➔ Yechim ➔ Javob',
        distractors: ['Javob ➔ Yechim ➔ Savol ➔ Shart', 'Yechim ➔ Shart ➔ Javob ➔ Savol', 'Savol ➔ Javob ➔ Shart ➔ Yechim'],
        explanation: 'Klassik algoritm: Shart, keyin Savol, so‘ng Yechim va nihoyat Javob.',
      },

      // 8 ta o'rtacha
      {
        text: 'Masala: «Akbar 14 ta yong‘oq terdi, ukasiga 4 tasini berdi. Akbarda nechta qoldi?» Reja bo‘yicha ifoda qanday bo‘ladi?',
        correctAnswer: '14 - 4 = 10 ta',
        distractors: ['14 + 4 = 18 ta', '10 + 4 = 14 ta', '14 - 10 = 4 ta'],
        explanation: 'Akbar ukasiga bergani uchun uning yong‘oqlari kamayadi: 14 - 4 = 10 ta.',
      },
      {
        text: '«Toshkentdan Samarqandga 25 ta poyezd yo‘lovchisi, Samarqanddan Buxoroga yana 12 ta yo‘lovchi chiqdi.» Jami yo‘lovchilarni topish uchun rejaning qaysi amali qo‘llanadi?',
        correctAnswer: 'Qo‘shish: 25 + 12',
        distractors: ['Ayirish: 25 - 12', 'Taqqoslash: 25 > 12', 'Bo‘lish'],
        explanation: 'Jami yo‘lovchilar sonini topishda qo‘shish amali ishlatiladi.',
      },
      {
        text: 'O‘quvchi masalani o‘qimasdan darhol sonlarni qo‘shib yubordi. U rejaning qaysi qoidasini buzdi?',
        correctAnswer: 'Shart va savolni diqqat bilan o‘rganish qoidasini',
        distractors: ['Daftar chetini chizish qoidasini', 'Ruchkani to‘g‘ri ushlashni', 'Qoidani buzmagan'],
        explanation: 'Shart va savolni to‘liq tushunmasdan turib yechishga o‘tish xatolikka olib keladi.',
      },
      {
        text: 'Masalani qisqa yozuv bilan ifodalash rejaning qaysi bosqichiga yordam beradi?',
        correctAnswer: 'Shartni tushunish va ifoda tuzishga',
        distractors: ['Faqat daftarni bezashga', 'Darsni tezroq tugatishga', 'Hech qanday foydasi yo‘q'],
        explanation: 'Qisqa yozuv berilganlarni ko‘rgazmali qilib, to‘g‘ri ifoda tanlashga yordam beradi.',
      },
      {
        text: 'Masala savoli: «Avtobusda qancha yo‘lovchi QOLDI?» Qaysi ifoda to‘g‘ri keladi?',
        correctAnswer: 'Dastlabki yo‘lovchilar soni - tushganlar soni',
        distractors: ['Dastlabki yo‘lovchilar soni + tushganlar soni', 'Tushganlar soni + 10', 'Dastlabki yo‘lovchilar soni'],
        explanation: 'Qolgan miqdorni topish uchun butundan ketgan qism ayiriladi.',
      },
      {
        text: 'Nodirada 20 ta stiker bor edi. Dugonasi unga yana 10 ta sovg‘a qildi. Nodirada jami nechta stiker bo‘ldi?',
        correctAnswer: '30 ta (20 + 10 = 30)',
        distractors: ['10 ta (20 - 10 = 10)', '25 ta', '35 ta'],
        explanation: 'Stikerlar soni ortgani sababli qo‘shiladi: 20 + 10 = 30 ta.',
      },
      {
        text: 'Qaysi savolga «18 - 8 = 10» yechimi mos keladi?',
        correctAnswer: 'Do‘konda 18 ta to‘p bor edi, 8 tasi sotildi. Nechta to‘p qoldi?',
        distractors: ['Do‘konda 18 ta to‘p bor edi, yana 8 ta keltirildi. Nechta bo‘ldi?', '18 ta to‘p 8 ta qutiga bo‘lindi.', 'Do‘konda 10 ta to‘p bor edi.'],
        explanation: '18 dan 8 ayrilishi to‘plar sotilib kamayishiga mos keladi.',
      },
      {
        text: 'Reja bo‘yicha javob yozishda nima ko‘rsatilishi shart?',
        correctAnswer: 'Son va uning o‘lchov birligi (masalan: 15 ta qalam)',
        distractors: ['Faqat harflar', 'Faqat plyus belgisi', 'Faqat o‘quvchining ismi'],
        explanation: 'Javobda olingan son va uning birligi aniq yoziladi.',
      },

      // 4 ta qiyinroq
      {
        text: 'Sinfda 28 ta o‘quvchi bor. Ulardan 14 nafari o‘g‘il bola. Qizlar sonini topish rejasi qanday?',
        correctAnswer: 'Jami o‘quvchilardan o‘g‘il bolalar sonini ayirish: 28 - 14 = 14',
        distractors: ['Jami o‘quvchilarga o‘g‘il bolalarni qo‘shish: 28 + 14 = 42', 'O‘g‘il bolalarni ikkiga ko‘paytirish', 'Faqat 28 ni yozish'],
        explanation: 'Butundan ma’lum qism ayrilsa, ikkinchi qism topiladi: 28 - 14 = 14 nafar qiz.',
      },
      {
        text: 'Bog‘bon 36 tup olma va 20 tup nok ko‘chati o‘tqazdi. Olma ko‘chatlari nok ko‘chatlaridan nechta ko‘p?',
        correctAnswer: '16 ta (36 - 20 = 16)',
        distractors: ['56 ta (36 + 20 = 56)', '10 ta', '26 ta'],
        explanation: 'Qancha ko‘pligini bilish uchun kattasidan kichigi ayiriladi: 36 - 20 = 16 ta.',
      },
      {
        text: 'Robota buyruq berildi: 15 qadam oldinga, so‘ng 5 qadam orqaga yuring. Robot boshlang‘ich nuqtadan necha qadam uzoqlashdi?',
        correctAnswer: '10 qadam (15 - 5 = 10)',
        distractors: ['20 qadam (15 + 5 = 20)', '5 qadam', '15 qadam'],
        explanation: 'Oldinga va orqaga harakatlar qarama-qarshi bo‘lgani uchun ayiriladi: 15 - 5 = 10 qadam.',
      },
      {
        text: 'Daftarda 40 ta katak bor edi. Jasur 12 tasini bo‘yadi. Nechta bo‘yalmagan katak qoldi?',
        correctAnswer: '28 ta (40 - 12 = 28)',
        distractors: ['52 ta (40 + 12 = 52)', '20 ta', '38 ta'],
        explanation: 'Jami kataklardan bo‘yalganlari ayiriladi: 40 - 12 = 28 ta.',
      },

      // 2 ta murakkab masala
      {
        text: 'Avtobusda 30 yo‘lovchi bor edi. Birinchi bekatda 6 kishi tushdi, ikkinchi bekatda 4 kishi tushdi. Avtobusda nechta yo‘lovchi qoldi?',
        correctAnswer: '20 nafar (30 - 6 - 4 = 20)',
        distractors: ['24 nafar', '22 nafar', '18 nafar'],
        explanation: '30 dan 6 ayrilsa 24, undan 4 ayrilsa 20 nafar qoladi.',
      },
      {
        text: 'Madinada 12 ta qalam bor edi. Onasi unga 5 ta, otasi esa yana 3 ta qalam olib berdi. Madinada jami nechta qalam bo‘ldi?',
        correctAnswer: '20 ta (12 + 5 + 3 = 20)',
        distractors: ['18 ta', '19 ta', '15 ta'],
        explanation: 'Barcha qo‘shilgan qalamlar jamlanadi: 12 + 5 + 3 = 20 ta.',
      },
    ],
  },

  // 3-dars. Sodda masalalar
  {
    bookNumber: 3,
    title: 'Sodda masalalar',
    emoji: '🚆',
    shortDesc: 'Bir amalli masalalar va butun-qism sxemasi.',
    intro: 'Birgina arifmetik amal (qo‘shish yoki ayirish) bilan yechiladigan masalalar sodda masalalardir.',
    keyPoints: [
      'Sxema: Butun = Qism + Qism.',
      'Butunni topish uchun qismlar qo‘shiladi.',
      'Noma’lum qismni topish uchun butundan ma’lum qism ayiriladi.',
    ],
    miniExample: {
      emojis: '📦 [ 88 ta darslik ] ➔ 30 tasi olindi, 58 tasi qoldi',
      text: '88 ta darslikdan 30 tasi olindi. Qolganini topish: 88 - 30 = 58 ta.',
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 7,
    practice: [
      {
        text: 'Bir amalli masala nima deb ataladi?',
        correctAnswer: 'Sodda masala',
        distractors: ['Murakkab masala', 'Mantiqiy jumboq', 'Geometrik shakl'],
        explanation: 'Faqat bitta amal yordamida yechiladigan masalalar sodda masalalar deyiladi.',
      },
      {
        text: 'Sxemada butun 50 ga, birinchi qism 20 ga teng bo‘lsa, ikkinchi qism qanday topiladi?',
        correctAnswer: '50 - 20 = 30',
        distractors: ['50 + 20 = 70', '50 - 50 = 0', '20 + 20 = 40'],
        explanation: 'Noma’lum qismni topish uchun butundan ma’lum qism ayiriladi: 50 - 20 = 30.',
      },
      {
        text: 'Avtobusda 64 ta o‘rindiq bor. Shulardan 42 tasi band. Nechta bo‘sh o‘rindiq bor?',
        correctAnswer: '22 ta (64 - 42 = 22)',
        distractors: ['20 ta', '106 ta', '12 ta'],
        explanation: 'Bo‘sh o‘rindiqlar: 64 - 42 = 22 ta.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'Sodda masalani yechish uchun nechta amal bajariladi?',
        correctAnswer: 'Faqat 1 ta amal',
        distractors: ['Kamida 3 ta amal', '2 ta amal', 'Hech qanday amal'],
        explanation: 'Sodda masalalar bitta arifmetik amal (qo‘shish yoki ayirish) bilan yechiladi.',
      },
      {
        text: 'Sxemadagi ikki qism ma’lum: 10 va 7. Butunni qanday topamiz?',
        correctAnswer: 'Qo‘shamiz: 10 + 7 = 17',
        distractors: ['Ayiramiz: 10 - 7 = 3', 'Taqqoslaymiz: 10 > 7', 'Nolga tenglaymiz'],
        explanation: 'Qism + Qism = Butun. Shuning uchun: 10 + 7 = 17.',
      },
      {
        text: 'Poyezd vagonida 30 nafar yo‘lovchi bor edi, yana 10 nafar chiqdi. Yo‘lovchilar nechta bo‘ldi?',
        correctAnswer: '40 nafar (30 + 10 = 40)',
        distractors: ['20 nafar', '35 nafar', '25 nafar'],
        explanation: 'Yo‘lovchilar soni ortdi: 30 + 10 = 40 nafar.',
      },
      {
        text: 'Kutubxonada 88 ta darslik bor edi. 30 tasi o‘quvchilarga tarqatildi. Nechta darslik qoldi?',
        correctAnswer: '58 ta (88 - 30 = 58)',
        distractors: ['50 ta', '60 ta', '48 ta'],
        explanation: 'Darsliklar kamaygani uchun ayiramiz: 88 - 30 = 58 ta.',
      },
      {
        text: 'Idishda 25 litr suv bor edi. Undan 5 litr ishlatildi. Qancha suv qoldi?',
        correctAnswer: '20 l (25 - 5 = 20)',
        distractors: ['30 l', '15 l', '22 l'],
        explanation: 'Ishlatilgan suv ayiriladi: 25 - 5 = 20 litr.',
      },
      {
        text: 'Guldastada 9 ta oq va 6 ta qizil chinnigul bor. Jami nechta gul bor?',
        correctAnswer: '15 ta (9 + 6 = 15)',
        distractors: ['12 ta', '14 ta', '16 ta'],
        explanation: 'Jami gullar soni: 9 + 6 = 15 ta.',
      },

      // 8 ta o'rtacha
      {
        text: 'Samolyotda 64 ta o‘rindiqdan 42 tasi band bo‘lsa, bo‘sh o‘rindiqlar soni nechta?',
        correctAnswer: '22 ta (64 - 42 = 22)',
        distractors: ['24 ta', '18 ta', '26 ta'],
        explanation: '64 dan 42 ayirilsa: 64 - 42 = 22 ta bo‘sh joy.',
      },
      {
        text: 'Sxema: Butun = 75, I qism = 25, II qism = ? II qismni toping:',
        correctAnswer: '50 (75 - 25 = 50)',
        distractors: ['100 (75 + 25 = 100)', '45', '55'],
        explanation: 'Butundan ma’lum qism ayiriladi: 75 - 25 = 50.',
      },
      {
        text: 'Sxema: I qism = 34, II qism = 23, Butun = ? Butunni toping:',
        correctAnswer: '57 (34 + 23 = 57)',
        distractors: ['11 (34 - 23 = 11)', '55', '60'],
        explanation: 'Butunni topish uchun qismlar qo‘shiladi: 34 + 23 = 57.',
      },
      {
        text: 'Quruvchilar 48 ta g‘ishtdan 18 tasini ishlatishdi. Nechta g‘isht ortib qoldi?',
        correctAnswer: '30 ta (48 - 18 = 30)',
        distractors: ['28 ta', '32 ta', '66 ta'],
        explanation: 'Ortib qolgan g‘ishtlar: 48 - 18 = 30 ta.',
      },
      {
        text: 'Sinfdagi 15 nafar o‘quvchidan 8 nafari shaxmat to‘garagiga qatnashadi. Qolganlari esa rasm to‘garagiga. Nechtasi rasm to‘garagiga qatnashadi?',
        correctAnswer: '7 nafar (15 - 8 = 7)',
        distractors: ['8 nafar', '6 nafar', '23 nafar'],
        explanation: '15 dan 8 ayirilsa, rasm to‘garagidagilar chiqadi: 15 - 8 = 7 nafar.',
      },
      {
        text: 'Bozorda birinchi xaridor 14 kg, ikkinchi xaridor esa 12 kg meva sotib oldi. Ikkala xaridor jami necha kg meva oldi?',
        correctAnswer: '26 kg (14 + 12 = 26)',
        distractors: ['2 kg (14 - 12 = 2)', '24 kg', '28 kg'],
        explanation: 'Ikkala xaridor birgalikda: 14 + 12 = 26 kg meva olgan.',
      },
      {
        text: 'Nonvoyxonada 90 ta issiq non yopildi. Tushgacha 50 tasi sotildi. Nechta non qoldi?',
        correctAnswer: '40 ta (90 - 50 = 40)',
        distractors: ['50 ta', '30 ta', '140 ta'],
        explanation: 'Qolgan nonlar: 90 - 50 = 40 ta.',
      },
      {
        text: 'Daftarda 16 ta misol bor edi. Sardor bir nechtasini yechgach, 6 ta misol qoldi. Sardor nechta misol yechgan?',
        correctAnswer: '10 ta (16 - 6 = 10)',
        distractors: ['22 ta (16 + 6 = 22)', '8 ta', '12 ta'],
        explanation: 'Yechilgan misollar noma’lum qismdir: 16 - 6 = 10 ta.',
      },

      // 4 ta qiyinroq
      {
        text: 'Sxemada butun 96 ga teng. I qism 40 bo‘lsa, II qism I qismdan qancha katta?',
        correctAnswer: '16 ga katta (II qism = 56, 56 - 40 = 16)',
        distractors: ['56 ga katta', '10 ga katta', '20 ga katta'],
        explanation: 'II qism = 96 - 40 = 56. Ular orasidagi farq: 56 - 40 = 16.',
      },
      {
        text: 'Avtosaroyda 55 ta avtomobil bor edi. Ertalab bir nechta mashina chiqib ketgach, 25 ta mashina qoldi. Nechta mashina yo‘lga chiqqan?',
        correctAnswer: '30 ta (55 - 25 = 30)',
        distractors: ['35 ta', '20 ta', '80 ta'],
        explanation: 'Chiqib ketgan mashinalar: 55 - 25 = 30 ta.',
      },
      {
        text: 'Bir tup uzumdan 32 kg, ikkinchisidan 15 kg uzum uzildi. Jami necha kg uzum uzilgan?',
        correctAnswer: '47 kg (32 + 15 = 47)',
        distractors: ['17 kg (32 - 15 = 17)', '45 kg', '50 kg'],
        explanation: 'Jami hosil: 32 + 15 = 47 kg.',
      },
      {
        text: 'Toshkent - Samarqand poyezdida 80 ta bo‘sh joy bor edi. Toshkentdan 60 kishi chiqdi. Poyezdda nechta bo‘sh joy qoldi?',
        correctAnswer: '20 ta (80 - 60 = 20)',
        distractors: ['30 ta', '140 ta', '10 ta'],
        explanation: 'Qolgan bo‘sh joylar: 80 - 60 = 20 ta.',
      },

      // 2 ta murakkab masala
      {
        text: 'Stadionda 70 ta to‘p bor edi. Futbolchilar 20 ta, voleybolchilar 10 ta to‘p olishdi. Nechta to‘p qoldi?',
        correctAnswer: '40 ta (70 - 20 - 10 = 40)',
        distractors: ['50 ta', '30 ta', '45 ta'],
        explanation: 'Ketma-ket ayiramiz: 70 - 20 = 50, 50 - 10 = 40 ta to‘p qoldi.',
      },
      {
        text: 'Omborga 25 qop un keltirildi. So‘ng yana 15 qop un keltirildi. Nonvoyxona 10 qop ishlatdi. Omborda nechta qop un qoldi?',
        correctAnswer: '30 qop (25 + 15 - 10 = 30)',
        distractors: ['40 qop', '20 qop', '35 qop'],
        explanation: 'Dastlab: 25 + 15 = 40 qop bo‘ldi. Ishlatilgach: 40 - 10 = 30 qop qoldi.',
      },
    ],
  },

  // 4-dars. Masala shartining berilish usullari
  {
    bookNumber: 4,
    title: 'Masala shartining berilish usullari',
    emoji: '🖼️',
    shortDesc: 'Shartning matn, rasm, qisqa yozuv va sxemada berilishi.',
    intro: 'Masala sharti faqat matn bilan emas, balki rasm, qisqa yozuv, jadval va sxemalar orqali ham berilishi mumkin.',
    keyPoints: [
      'Matnli usul — voqea so‘zlar bilan batafsil hikoya qilinadi.',
      'Qisqa yozuv — sonlar va kalit so‘zlar qisqartirib yoziladi.',
      'Sxema va chizma — butun va uning qismlari grafik ko‘rinishda chiziladi.',
    ],
    miniExample: {
      emojis: '🖼️ Qisqa yozuv: I qism − 12, II qism − 8. Jami = ?',
      text: 'Qisqa yozuvdan ifoda: 12 + 8 = 20 ta.',
    },
    xpReward: 90,
    coinReward: 10,
    estMinutes: 7,
    practice: [
      {
        text: 'Masala sharti qanday usullarda berilishi mumkin?',
        correctAnswer: 'Matn, rasm, qisqa yozuv va sxema orqali',
        distractors: ['Faqat telefonda ovoz orqali', 'Faqat jim turish orqali', 'Faqat raqamsiz so‘zlar bilan'],
        explanation: 'Masala sharti matn, rasm, jadval, qisqa yozuv yoki sxema shaklida berilishi mumkin.',
      },
      {
        text: 'Qisqa yozuv: «I — 15 ta, II — 5 ta kam. II = ?» Ifoda qanday bo‘ladi?',
        correctAnswer: '15 - 5 = 10 ta',
        distractors: ['15 + 5 = 20 ta', '15 - 10 = 5 ta', '5 + 5 = 10 ta'],
        explanation: '5 ta kam bo‘lgani uchun ayirish amali bajariladi: 15 - 5 = 10 ta.',
      },
      {
        text: 'Sehrli kvadratda har bir qator, ustun va diagonal yig‘indisi bir xil bo‘ladi. 3x3 kvadratda bu yig‘indi ko‘pincha necha bo‘ladi?',
        correctAnswer: '15',
        distractors: ['10', '20', '30'],
        explanation: '1 dan 9 gacha sonlardan tuzilgan sehrli kvadratda yig‘indi 15 ga teng.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: 'Masala shartini qisqa yozuvda ifodalash nimasi bilan qulay?',
        correctAnswer: 'Keraksiz so‘zlarsiz, asosiy sonlarni aniq ko‘rsatadi',
        distractors: ['Daftarda joyni ko‘proq egallaydi', 'Chizish shart bo‘lmaydi', 'Hech qanday qulayligi yo‘q'],
        explanation: 'Qisqa yozuv asosiy sonlar va bog‘lanishlarni ko‘rgazmali qilib beradi.',
      },
      {
        text: '«I — 20 kg, II — 10 kg ortiq. Jami = ?» Bu qaysi usulda berilgan?',
        correctAnswer: 'Qisqa yozuv usulida',
        distractors: ['Matnli hikoya usulida', 'Faqat rasm usulida', 'Ovozli usulda'],
        explanation: 'Rim raqamlari va qisqartirishlar bilan yozilgan shakl qisqa yozuvdir.',
      },
      {
        text: 'Rasmda 5 ta qushchaga yana 3 ta qushcha uchib kelayotgani tasvirlangan. Mos ifodani toping:',
        correctAnswer: '5 + 3 = 8 ta',
        distractors: ['5 - 3 = 2 ta', '8 - 3 = 5 ta', '3 + 3 = 6 ta'],
        explanation: 'Uchib kelayotgani uchun qushlar qo‘shiladi: 5 + 3 = 8 ta.',
      },
      {
        text: 'Sehrli kvadratda har bir yo‘nalishdagi sonlar yig‘indisi qanday bo‘ladi?',
        correctAnswer: 'Har doim teng bo‘ladi',
        distractors: ['Har doim turlicha bo‘ladi', 'Faqat 0 bo‘ladi', 'Hech qachon yig‘indi chiqmaydi'],
        explanation: 'Sehrli kvadratning qator, ustun va diagonallari yig‘indisi bir-biriga teng bo‘ladi.',
      },
      {
        text: 'Sxemada butun chiziq ikkiga bo‘lingan: 30 va 20. Butun chiziq uzunligini toping:',
        correctAnswer: '50 (30 + 20 = 50)',
        distractors: ['10 (30 - 20 = 10)', '40', '60'],
        explanation: 'Butun uzunlik qismlar yig‘indisidir: 30 + 20 = 50.',
      },
      {
        text: 'Quyidagi qisqa yozuvga qaysi amal mos: «Bor edi: 18 ta, Sotildi: 8 ta, Qoldi: ?»',
        correctAnswer: 'Ayirish (18 - 8)',
        distractors: ['Qo‘shish (18 + 8)', 'Taqqoslash', 'Hech qanday amal'],
        explanation: 'Sotilgan miqdor kamaygani uchun ayirish amali mos keladi.',
      },

      // 8 ta o'rtacha
      {
        text: 'Sehrli kvadrat qatorida 8 va 6 sonlari bor. Yig‘indi 15 bo‘lishi uchun uchinchi son necha bo‘lishi kerak?',
        correctAnswer: '1 (chunki 8 + 6 = 14, 15 - 14 = 1)',
        distractors: ['2', '3', '0'],
        explanation: '8 + 6 = 14, 15 bo‘lishi uchun yana 1 kerak: 15 - 14 = 1.',
      },
      {
        text: 'Sehrli kvadrat ustunida 4 va 9 sonlari turibdi. Yig‘indi 15 bo‘lishi uchun bo‘sh katakka qaysi son qo‘yiladi?',
        correctAnswer: '2 (chunki 4 + 9 = 13, 15 - 13 = 2)',
        distractors: ['3', '1', '4'],
        explanation: '4 + 9 = 13. 15 bo‘lishi uchun: 15 - 13 = 2.',
      },
      {
        text: 'Qisqa yozuv: «Anor — 16 kg, Behi — 4 kg kam. Behi qancha?» Ifodani toping:',
        correctAnswer: '16 - 4 = 12 kg',
        distractors: ['16 + 4 = 20 kg', '16 - 12 = 4 kg', '12 + 4 = 16 kg'],
        explanation: '4 kg kam bo‘lgani uchun ayiramiz: 16 - 4 = 12 kg.',
      },
      {
        text: 'Qisqa yozuv: «I qism — 40 metr, II qism — 30 metr. Jami — ?»',
        correctAnswer: '70 metr (40 + 30 = 70)',
        distractors: ['10 metr (40 - 30 = 10)', '60 metr', '80 metr'],
        explanation: 'Jami uzunlik: 40 + 30 = 70 metr.',
      },
      {
        text: 'Rasmda avtoturargohda 12 ta mashina bor edi. 5 tasi chiqib ketdi. Nechta mashina qolganini bildiruvchi ifoda qaysi?',
        correctAnswer: '12 - 5 = 7 ta',
        distractors: ['12 + 5 = 17 ta', '7 + 5 = 12 ta', '10 - 5 = 5 ta'],
        explanation: 'Ketgan mashinalar soni ayriladi: 12 - 5 = 7 ta.',
      },
      {
        text: 'Sxemada butun 60, bir qismi 25 ga teng. Ikkinchi noma’lum qismni toping:',
        correctAnswer: '35 (60 - 25 = 35)',
        distractors: ['85 (60 + 25 = 85)', '45', '30'],
        explanation: 'Noma’lum qism: 60 - 25 = 35.',
      },
      {
        text: 'Sehrli kvadratning markazida qaysi son turishi odat tusiga kirgan?',
        correctAnswer: '5 soni',
        distractors: ['1 soni', '9 soni', '0 soni'],
        explanation: '1 dan 9 gacha bo‘lgan sonlardan tuzilgan 3x3 kvadrat markazida har doim 5 soni turadi.',
      },
      {
        text: 'Qisqa yozuv bo‘yicha masala tuzing: «Oq qog‘oz — 14 ta, Sariq qog‘oz — 6 ta ko‘p». Sariq qog‘ozlar nechta?',
        correctAnswer: '20 ta (14 + 6 = 20)',
        distractors: ['8 ta (14 - 6 = 8)', '18 ta', '22 ta'],
        explanation: '6 ta ko‘p bo‘lgani uchun qo‘shamiz: 14 + 6 = 20 ta.',
      },

      // 4 ta qiyinroq
      {
        text: 'Sehrli kvadrat burchaklarida 2 va 6 sonlari turibdi. Ular orasidagi son necha bo‘lsa, yig‘indi 15 bo‘ladi?',
        correctAnswer: '7 (chunki 2 + 6 = 8, 15 - 8 = 7)',
        distractors: ['5', '8', '6'],
        explanation: '2 + 6 = 8. Qatordagi uchinchi son: 15 - 8 = 7.',
      },
      {
        text: 'Qisqa yozuv: «I kun — 22 bet, II kun — 15 bet, III kun — 10 bet. Jami o‘qilgan betlar soni = ?»',
        correctAnswer: '47 bet (22 + 15 + 10 = 47)',
        distractors: ['37 bet', '45 bet', '50 bet'],
        explanation: 'Uchala kunda o‘qilgan betlar yig‘indisi: 22 + 15 + 10 = 47 bet.',
      },
      {
        text: 'Sxema bo‘yicha: Butun 84 ta detal. 1-usta 40 ta, 2-usta 30 ta yasadi. 3-usta nechta detal yasagan?',
        correctAnswer: '14 ta (84 - 40 - 30 = 14)',
        distractors: ['24 ta', '10 ta', '18 ta'],
        explanation: '84 dan 40 va 30 ayriladi: 84 - 70 = 14 ta.',
      },
      {
        text: 'Jadvalda do‘kondagi mevalar berilgan: olma 35 kg, nok 20 kg. Olma nokdan necha kg ortiq?',
        correctAnswer: '15 kg (35 - 20 = 15)',
        distractors: ['55 kg (35 + 20 = 55)', '10 kg', '25 kg'],
        explanation: 'Ortiq miqdorni topish uchun ayiramiz: 35 - 20 = 15 kg.',
      },

      // 2 ta murakkab masala
      {
        text: 'Sehrli kvadratning bitta diagonalida 8, 5, 2 sonlari bor. Ularning yig‘indisi necha bo‘ladi?',
        correctAnswer: '15 (chunki 8 + 5 + 2 = 15)',
        distractors: ['14', '16', '12'],
        explanation: '8 + 5 = 13, 13 + 2 = 15. Diagonal yig‘indisi 15 ga teng.',
      },
      {
        text: 'Qisqa yozuv: «Keltirildi: 50 ta ko‘chat. 1-kun ekildi: 20 ta, 2-kun ekildi: 15 ta. Ekilmagan ko‘chatlar qancha?»',
        correctAnswer: '15 ta (50 - 20 - 15 = 15)',
        distractors: ['25 ta', '10 ta', '20 ta'],
        explanation: 'Jami ekilgani: 20 + 15 = 35 ta. Qolgani: 50 - 35 = 15 ta ko‘chat.',
      },
    ],
  },

  // 5-dars. Masalalar yechish
  {
    bookNumber: 5,
    title: 'Masalalar yechish',
    emoji: '🤖',
    shortDesc: 'Butun va qismlar, 2 xonali sonlarni qo‘shish va ayirish.',
    intro: 'Ikki xonali sonlar ishtirokidagi amaliy masalalarni butun va qismlar munosabatiga tayanib yechamiz.',
    keyPoints: [
      'O‘nliklar o‘nliklarga, birliklar birliklarga qo‘shiladi yoki ayiriladi.',
      'Masalani yechishda avval berilgan miqdorlar aniqlanadi.',
      'Natija har doim mantiqiy jihatdan tekshirib ko‘riladi.',
    ],
    miniExample: {
      emojis: '🤖 46 qop bug‘doy + 42 qop arpa = 88 qop don',
      text: 'Omborda 46 qop bug‘doy va 42 qop arpa bor. Jami: 46 + 42 = 88 qop don.',
    },
    xpReward: 95,
    coinReward: 10,
    estMinutes: 8,
    practice: [
      {
        text: 'Omborda 46 qop bug‘doy va 42 qop arpa bor. Omborda jami necha qop don bor?',
        correctAnswer: '88 qop (46 + 42 = 88)',
        distractors: ['84 qop', '90 qop', '78 qop'],
        explanation: 'O‘nliklar: 40 + 40 = 80, birliklar: 6 + 2 = 8. Jami: 88 qop.',
      },
      {
        text: 'Bolalar bog‘chasida 12 ta o‘yinchoqdan 8 tasi olindi. Nechta o‘yinchoq qoldi?',
        correctAnswer: '4 ta (12 - 8 = 4)',
        distractors: ['5 ta', '6 ta', '20 ta'],
        explanation: 'Qolgan o‘yinchoqlar: 12 - 8 = 4 ta.',
      },
      {
        text: 'Robot 35 ta qizil va 23 ta ko‘k detalni yig‘di. U jami nechta detal yig‘di?',
        correctAnswer: '58 ta (35 + 23 = 58)',
        distractors: ['57 ta', '68 ta', '12 ta'],
        explanation: 'Jami detallar: 35 + 23 = 58 ta.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: '46 + 42 ifodaning qiymatini hisoblang:',
        correctAnswer: '88',
        distractors: ['84', '90', '78'],
        explanation: '46 + 42 = 88.',
      },
      {
        text: 'Omborga 30 qop guruch va 20 qop shakar keltirildi. Jami necha qop mahsulot keltirildi?',
        correctAnswer: '50 qop (30 + 20 = 50)',
        distractors: ['40 qop', '60 qop', '10 qop'],
        explanation: '30 + 20 = 50 qop mahsulot.',
      },
      {
        text: '56 - 24 ifodaning qiymatini hisoblang:',
        correctAnswer: '32',
        distractors: ['30', '34', '22'],
        explanation: '50 - 20 = 30, 6 - 4 = 2. Natija: 32.',
      },
      {
        text: 'Kutubxonada 45 ta darslik bor edi. 15 tasi berildi. Nechta darslik qoldi?',
        correctAnswer: '30 ta (45 - 15 = 30)',
        distractors: ['25 ta', '35 ta', '60 ta'],
        explanation: '45 - 15 = 30 ta darslik qoldi.',
      },
      {
        text: 'Robot maydonchada 14 qadam oldinga, yana 15 qadam oldinga yurdi. Jami necha qadam yurdi?',
        correctAnswer: '29 qadam (14 + 15 = 29)',
        distractors: ['28 qadam', '30 qadam', '1 qadam'],
        explanation: '14 + 15 = 29 qadam.',
      },
      {
        text: '77 - 30 ifodaning qiymati nechaga teng?',
        correctAnswer: '47',
        distractors: ['37', '57', '40'],
        explanation: '70 - 30 = 40, yana 7 birlik: 47.',
      },

      // 8 ta o'rtacha
      {
        text: 'Muzeyga ertalab 34 nafar, tushdan keyin esa 43 nafar sayyoh keldi. Kun davomida jami necha nafar sayyoh kelgan?',
        correctAnswer: '77 nafar (34 + 43 = 77)',
        distractors: ['75 nafar', '87 nafar', '67 nafar'],
        explanation: '34 + 43 = 77 nafar sayyoh.',
      },
      {
        text: 'Fermada 68 ta qo‘y bor edi. Ulardan 25 tasi yaylovga chiqarildi. Qo‘rada nechta qo‘y qoldi?',
        correctAnswer: '43 ta (68 - 25 = 43)',
        distractors: ['40 ta', '45 ta', '33 ta'],
        explanation: '68 - 25 = 43 ta qo‘y qoldi.',
      },
      {
        text: 'Dardona 24 bet ertak o‘qidi. Sardor esa undan 13 bet ko‘p o‘qidi. Sardor necha bet o‘qigan?',
        correctAnswer: '37 bet (24 + 13 = 37)',
        distractors: ['11 bet (24 - 13 = 11)', '35 bet', '47 bet'],
        explanation: 'Sardor 13 bet ko‘p o‘qigan: 24 + 13 = 37 bet.',
      },
      {
        text: 'Dukonga 95 kg un keltirildi. 1-kuni 40 kg, 2-kuni 30 kg sotildi. Necha kg un qoldi?',
        correctAnswer: '25 kg (95 - 40 - 30 = 25)',
        distractors: ['35 kg', '20 kg', '15 kg'],
        explanation: '95 - 70 = 25 kg un qoldi.',
      },
      {
        text: 'Avtobusda 48 nafar yo‘lovchi bor edi. Bekatda 16 kishi tushdi. Nechta yo‘lovchi qoldi?',
        correctAnswer: '32 nafar (48 - 16 = 32)',
        distractors: ['34 nafar', '30 nafar', '64 nafar'],
        explanation: '48 - 16 = 32 nafar yo‘lovchi.',
      },
      {
        text: 'Toshkent - Samarqand poyezdining 1-vagonida 36 yo‘lovchi, 2-vagonida 31 yo‘lovchi bor. Ikkala vagonda jami qancha yo‘lovchi bor?',
        correctAnswer: '67 nafar (36 + 31 = 67)',
        distractors: ['65 nafar', '77 nafar', '5 nafar'],
        explanation: '36 + 31 = 67 nafar yo‘lovchi.',
      },
      {
        text: 'Noma’lum sonni toping: □ + 24 = 66',
        correctAnswer: '42 (chunki 66 - 24 = 42)',
        distractors: ['40', '90', '44'],
        explanation: 'Noma’lum qo‘shiluvchini topish uchun yig‘indidan ayiramiz: 66 - 24 = 42.',
      },
      {
        text: 'Noma’lum sonni toping: 89 - □ = 54',
        correctAnswer: '35 (chunki 89 - 54 = 35)',
        distractors: ['25', '45', '143'],
        explanation: 'Ayriluvchini topish uchun kamayuvchidan ayirmani ayiramiz: 89 - 54 = 35.',
      },

      // 4 ta qiyinroq
      {
        text: 'Sinf kutubxonasida 78 ta kitob bor edi. 1-hafta 23 ta, 2-hafta 21 ta kitob o‘qishga olindi. Nechta kitob qoldi?',
        correctAnswer: '34 ta (78 - 23 - 21 = 34)',
        distractors: ['44 ta', '30 ta', '35 ta'],
        explanation: 'Jami olingan kitoblar: 23 + 21 = 44 ta. Qolgani: 78 - 44 = 34 ta.',
      },
      {
        text: 'Dron Toshkent bo‘ylab 44 km, so‘ng Samarqandda 35 km parvoz qildi. Dron jami necha km parvoz qilgan?',
        correctAnswer: '79 km (44 + 35 = 79)',
        distractors: ['69 km', '89 km', '9 km'],
        explanation: '44 + 35 = 79 km.',
      },
      {
        text: 'Tikuvchi 58 metr matodan 24 metr ko‘ylakka, 12 metr yubkaga ishlatdi. Necha metr mato qoldi?',
        correctAnswer: '22 metr (58 - 24 - 12 = 22)',
        distractors: ['20 metr', '24 metr', '36 metr'],
        explanation: 'Ishlatilgan mato: 24 + 12 = 36 metr. Qolgani: 58 - 36 = 22 metr.',
      },
      {
        text: 'Do‘konda 38 ta planshet bor edi. Kun davomida 15 tasi sotildi, kechqurun yana 10 ta yangi planshet keltirildi. Do‘konda nechta planshet bo‘ldi?',
        correctAnswer: '33 ta (38 - 15 + 10 = 33)',
        distractors: ['30 ta', '35 ta', '28 ta'],
        explanation: '38 - 15 = 23 ta, 23 + 10 = 33 ta planshet.',
      },

      // 2 ta murakkab masala
      {
        text: 'Sayyohlar 1-kuni 25 km, 2-kuni undan 10 km kam yo‘l yurishdi. Sayyohlar ikki kunda jami necha km yo‘l yurishgan?',
        correctAnswer: '40 km (2-kun: 15 km; 25 + 15 = 40)',
        distractors: ['35 km', '45 km', '50 km'],
        explanation: '2-kun: 25 - 10 = 15 km. Ikki kunda: 25 + 15 = 40 km.',
      },
      {
        text: 'Bog‘bon 50 kg shaftoli va 40 kg o‘rik uzdi. U 30 kg mevani bozorga sotishga jo‘natdi. Bog‘bonda necha kg meva qoldi?',
        correctAnswer: '60 kg (50 + 40 - 30 = 60)',
        distractors: ['50 kg', '70 kg', '80 kg'],
        explanation: 'Jami mevalar: 50 + 40 = 90 kg. Sotishga ketgach: 90 - 30 = 60 kg qoldi.',
      },
    ],
  },

  // 6-dars. Butunni topishga doir masalalar
  {
    bookNumber: 6,
    title: 'Butunni topishga doir masalalar',
    emoji: '🛸',
    shortDesc: 'Qismlar yig‘indisi orqali butun miqdorni topish.',
    intro: 'Barcha qismlar ma’lum bo‘lganda, butun miqdorni topish uchun qo‘shish amali bajariladi: Qism + Qism = Butun.',
    keyPoints: [
      'Butun — bu barcha bo‘laklar yoki qismlarning umumiy yig‘indisi.',
      'Dron yetkazib berish masalalari: katta va kichik jo‘natmalar birlashtiriladi.',
      'Agar noma’lum butun bo‘lsa, har doim qo‘shish ifodasi tuziladi.',
    ],
    miniExample: {
      emojis: '🛸 14 ta katta jo‘natma + 32 ta kichik jo‘natma = 46 ta',
      text: 'Pochta droni 14 ta katta va 32 ta kichik jo‘natma tashidi. Jami: 14 + 32 = 46 ta jo‘natma.',
    },
    xpReward: 95,
    coinReward: 10,
    estMinutes: 8,
    practice: [
      {
        text: 'Dron 14 ta katta va 32 ta kichik jo‘natma yetkazib berdi. Jami jo‘natmalar soni nechta?',
        correctAnswer: '46 ta (14 + 32 = 46)',
        distractors: ['44 ta', '48 ta', '18 ta'],
        explanation: 'Qismlar qo‘shiladi: 14 + 32 = 46 ta jo‘natma.',
      },
      {
        text: 'Butunni topish uchun qismlar ustida qaysi amal bajariladi?',
        correctAnswer: 'Qo‘shish amali (+)',
        distractors: ['Ayirish amali (-)', 'Taqqoslash amali', 'Bo‘lish amali'],
        explanation: 'Qismlardan butun hosil qilish uchun ular qo‘shiladi.',
      },
      {
        text: 'Birinchi qutida 21 ta, ikkinchi qutida 35 ta qalam bor. Ikkala qutida jami nechta qalam bor?',
        correctAnswer: '56 ta (21 + 35 = 56)',
        distractors: ['54 ta', '58 ta', '14 ta'],
        explanation: '21 + 35 = 56 ta qalam.',
      },
    ],
    test: [
      // 6 ta oson
      {
        text: '«Qism + Qism = ?» formulasida so‘roq belgisi o‘rnida nima turadi?',
        correctAnswer: 'Butun',
        distractors: ['Yana bir qism', 'Nol', 'Ayirma'],
        explanation: 'Qismlarning yig‘indisi butunni tashkil qiladi.',
      },
      {
        text: 'Pochta droni ertalab 12 ta, tushdan keyin 15 ta xat tashidi. Dron jami nechta xat tashigan?',
        correctAnswer: '27 ta (12 + 15 = 27)',
        distractors: ['25 ta', '29 ta', '3 ta'],
        explanation: '12 + 15 = 27 ta xat.',
      },
      {
        text: '20 + 35 yig‘indisi butun bo‘lsa, uning qiymati nechaga teng?',
        correctAnswer: '55',
        distractors: ['45', '65', '15'],
        explanation: '20 + 35 = 55.',
      },
      {
        text: 'Dasturchi bola 1-soatda 11 ta qator kod, 2-soatda 24 ta qator kod yozdi. Jami necha qator kod yozilgan?',
        correctAnswer: '35 qator (11 + 24 = 35)',
        distractors: ['33 qator', '37 qator', '13 qator'],
        explanation: '11 + 24 = 35 qator kod.',
      },
      {
        text: 'Toshkentdagi avtoparkka 30 ta yangi elektrobus va 15 ta oddiy avtobus keltirildi. Jami nechta yangi transport keldi?',
        correctAnswer: '45 ta (30 + 15 = 45)',
        distractors: ['35 ta', '55 ta', '15 ta'],
        explanation: '30 + 15 = 45 ta yangi transport.',
      },
      {
        text: '43 + 25 ifodaning qiymatini toping:',
        correctAnswer: '68',
        distractors: ['66', '70', '18'],
        explanation: '40 + 20 = 60, 3 + 5 = 8. Natija: 68.',
      },

      // 8 ta o'rtacha
      {
        text: 'Pochta xizmatida 23 ta robot va 34 ta dron ishlayapti. Xizmatda jami nechta qurilma ishlamoqda?',
        correctAnswer: '57 ta (23 + 34 = 57)',
        distractors: ['55 ta', '59 ta', '11 ta'],
        explanation: '23 + 34 = 57 ta qurilma.',
      },
      {
        text: 'Sxema: I qism = 42, II qism = 36. Butunni toping:',
        correctAnswer: '78 (42 + 36 = 78)',
        distractors: ['76', '80', '6'],
        explanation: '42 + 36 = 78.',
      },
      {
        text: 'Bog‘dan 1-kun 33 quti shaftoli, 2-kun 24 quti shaftoli terildi. Jami necha quti shaftoli terilgan?',
        correctAnswer: '57 quti (33 + 24 = 57)',
        distractors: ['55 quti', '60 quti', '9 quti'],
        explanation: '33 + 24 = 57 quti.',
      },
      {
        text: 'Gulzorga 26 tup atirgul va 21 tup lola ekildi. Gulzordagi jami gullar sonini toping:',
        correctAnswer: '47 tup (26 + 21 = 47)',
        distractors: ['45 tup', '49 tup', '5 tup'],
        explanation: '26 + 21 = 47 tup gul.',
      },
      {
        text: 'Dron Buxoroda 16 ta manzilga, Navoiyda 22 ta manzilga dori yetkazdi. Dron jami nechta manzilga xizmat ko‘rsatdi?',
        correctAnswer: '38 ta (16 + 22 = 38)',
        distractors: ['36 ta', '40 ta', '6 ta'],
        explanation: '16 + 22 = 38 ta manzil.',
      },
      {
        text: 'Tenglikni to‘g‘ri qiladigan butunni toping: 35 + 44 = □',
        correctAnswer: '79',
        distractors: ['69', '89', '77'],
        explanation: '30 + 40 = 70, 5 + 4 = 9. Butun: 79.',
      },
      {
        text: 'Kutubxona uchun 52 ta badiiy kitob va 26 ta ensiklopediya sotib olindi. Jami nechta kitob olingan?',
        correctAnswer: '78 ta (52 + 26 = 78)',
        distractors: ['76 ta', '80 ta', '26 ta'],
        explanation: '52 + 26 = 78 ta kitob.',
      },
      {
        text: 'Sport do‘konida 40 ta futbol to‘pi va 35 ta basketbol to‘pi bor. Do‘konda jami nechta to‘p bor?',
        correctAnswer: '75 ta (40 + 35 = 75)',
        distractors: ['70 ta', '80 ta', '5 ta'],
        explanation: '40 + 35 = 75 ta to‘p.',
      },

      // 4 ta qiyinroq
      {
        text: 'Pochta markazida uch turdagi jo‘natmalar tayyorlandi: 20 ta xat, 15 ta kichik quti va 12 ta katta posilka. Jami jo‘natmalar nechta?',
        correctAnswer: '47 ta (20 + 15 + 12 = 47)',
        distractors: ['45 ta', '50 ta', '37 ta'],
        explanation: '20 + 15 = 35, 35 + 12 = 47 ta jo‘natma.',
      },
      {
        text: 'Samolyot 1-reysda 42 yo‘lovchi, 2-reysda 37 yo‘lovchi tashidi. Ikkala reysda jami necha kishi uchgan?',
        correctAnswer: '79 nafar (42 + 37 = 79)',
        distractors: ['75 nafar', '80 nafar', '5 nafar'],
        explanation: '42 + 37 = 79 nafar yo‘lovchi.',
      },
      {
        text: 'Sxema bo‘yicha butunni hisoblang: I qism = 15, II qism = 23, III qism = 31. Butun = ?',
        correctAnswer: '69 (15 + 23 + 31 = 69)',
        distractors: ['59', '68', '70'],
        explanation: '15 + 23 = 38, 38 + 31 = 69.',
      },
      {
        text: 'Maktab bog‘ida 34 tup olma, 22 tup gilos va 11 tup o‘rik daraxti bor. Bog‘da jami nechta mevali daraxt bor?',
        correctAnswer: '67 tup (34 + 22 + 11 = 67)',
        distractors: ['65 tup', '69 tup', '57 tup'],
        explanation: '34 + 22 = 56, 56 + 11 = 67 tup daraxt.',
      },

      // 2 ta murakkab masala
      {
        text: 'Dron uchta shaharchaga xat yetkazdi: 1-shaharchaga 14 ta, 2-shaharchaga 16 ta va 3-shaharchaga 20 ta. Dron jami nechta xat yetkazgan?',
        correctAnswer: '50 ta (14 + 16 + 20 = 50)',
        distractors: ['40 ta', '48 ta', '52 ta'],
        explanation: '14 + 16 = 30, 30 + 20 = 50 ta xat.',
      },
      {
        text: 'Akfa romlar fabrikasida ertalab 32 ta, tushda 25 ta, kechqurun 13 ta deraza romi yasaldi. Kun davomida jami nechta rom yasalgan?',
        correctAnswer: '70 ta (32 + 25 + 13 = 70)',
        distractors: ['68 ta', '72 ta', '65 ta'],
        explanation: '32 + 25 = 57, 57 + 13 = 70 ta deraza romi.',
      },
    ],
  },
];

console.log('Generating Part 3 Chapter 1A lessons (1-6)...');
for (const lessonDef of lessonsPart3Ch1A) {
  const seed = buildLessonSeed(lessonDef);
  saveLessonFile(3, lessonDef.bookNumber, seed);
  console.log(`✅ Saved lesson-${lessonDef.bookNumber < 10 ? '0' : ''}${lessonDef.bookNumber}.json`);
}
