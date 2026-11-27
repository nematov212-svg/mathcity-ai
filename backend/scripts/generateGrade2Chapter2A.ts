import { Grade2UnitDef, buildGrade2UnitSeed, saveGrade2UnitFile } from './generatorTypes';

console.log("Generating Grade 2 Part 1 Chapter IIA (order 9-13)...");

export const unit09: Grade2UnitDef = {
  order: 9,
  bookNumber: 9,
  unitType: "LESSON",
  title: "Sonlarni qo‘shish va ayirish",
  emoji: "🐪",
  crossTopic: "Tuyalar",
  shortDesc: "Xona birliklari asosida amallar bajarish va sonni yozish usuli",
  intro: "Cho‘l kemasi bo‘lmish tuyalar uzoq masofalarni bosib o‘tadi. Ushbu darsda sonlarni o‘nlik va birliklarga ajratib qo‘shish hamda ayirishni o‘rganamiz.",
  keyPoints: [
    "O‘nliklar o‘nliklarga, birliklar birliklarga qo‘shiladi: 24 + 14 = (20 + 10) + (4 + 4) = 38.",
    "Ayirishda ham o‘nlikdan o‘nlik, birlikdan birlik ayriladi: 76 - 15 = 61.",
    "Xona birliklari modeli hisoblashni oson va xatosiz bajarishga yordam beradi."
  ],
  miniExample: {
    emojis: "🐪 24 + 14 = 38 | 76 - 15 = 61",
    text: "24 ga 14 ni qo‘shish: 2 o‘nlikka 1 o‘nlikni qo‘shsak 3 o‘nlik (30), 4 ga 4 ni qo‘shsak 8. Jami 38!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Hisoblang: 24 + 14",
      correctAnswer: "38",
      distractors: ["36", "40", "34"],
      explanation: "20 + 10 = 30, 4 + 4 = 8; 30 + 8 = 38."
    },
    {
      text: "Hisoblang: 76 - 15",
      correctAnswer: "61",
      distractors: ["60", "62", "51"],
      explanation: "70 - 10 = 60, 6 - 5 = 1; 60 + 1 = 61."
    },
    {
      text: "Taqqoslang: 69 - 15 ... 75 - 14",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "69 - 15 = 54 va 75 - 14 = 61. 54 < 61."
    }
  ],
  test: [
    // 6 ta oson
    {
      text: "Hisoblang: 24 + 14",
      correctAnswer: "38",
      distractors: ["37", "39", "28"],
      explanation: "20 + 10 = 30, 4 + 4 = 8, 30 + 8 = 38."
    },
    {
      text: "Hisoblang: 76 - 15",
      correctAnswer: "61",
      distractors: ["60", "62", "51"],
      explanation: "70 - 10 = 60, 6 - 5 = 1, 60 + 1 = 61."
    },
    {
      text: "Hisoblang: 35 + 23",
      correctAnswer: "58",
      distractors: ["57", "59", "48"],
      explanation: "30 + 20 = 50, 5 + 3 = 8, 50 + 8 = 58."
    },
    {
      text: "Hisoblang: 58 - 25",
      correctAnswer: "33",
      distractors: ["32", "34", "35"],
      explanation: "50 - 20 = 30, 8 - 5 = 3, 30 + 3 = 33."
    },
    {
      text: "4 ta o‘nlik va 5 ta birlik qaysi sonni hosil qiladi?",
      correctAnswer: "45",
      distractors: ["54", "40", "50"],
      explanation: "4 ta o‘nlik (40) va 5 ta birlik = 45."
    },
    {
      text: "Taqqoslang: 42 + 13 ... 32 + 23",
      correctAnswer: "=",
      distractors: [">", "<", "≠"],
      explanation: "42 + 13 = 55 va 32 + 23 = 55. 55 = 55."
    },

    // 8 ta o'rta
    {
      text: "Taqqoslang: 69 - 15 ... 75 - 14",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "69 - 15 = 54 va 75 - 14 = 61. 54 < 61."
    },
    {
      text: "Tuyalar karvoni birinchi kuni 34 km, ikkinchi kuni 25 km yo‘l bosdi. Karvon ikki kunda jami necha km yo‘l yurgan?",
      correctAnswer: "59 km",
      distractors: ["58 km", "60 km", "57 km"],
      explanation: "34 + 25 = 59 km."
    },
    {
      text: "Cho‘l qo‘riqxonasida 48 ta tuya bor edi. Shulardan 16 tasi oq tuya, qolganlari sariq tuya. Sariq tuyalar nechta?",
      correctAnswer: "32 ta",
      distractors: ["30 ta", "34 ta", "64 ta"],
      explanation: "48 - 16 = 32 ta sariq tuya."
    },
    {
      text: "Chizma bo‘yicha hisoblang: asalarilar 36 ta, sariq arilar ulardan 14 ta kam. Sariq arilar nechta?",
      correctAnswer: "22 ta",
      distractors: ["20 ta", "24 ta", "50 ta"],
      explanation: "36 - 14 = 22 ta."
    },
    {
      text: "Asalarilar va sariq arilar jami nechta (oldingi masala bo‘yicha)?",
      correctAnswer: "58 ta (36 + 22 = 58)",
      distractors: ["56 ta", "60 ta", "50 ta"],
      explanation: "36 + 22 = 58 ta hasharot."
    },
    {
      text: "Hisoblang: 87 - 34",
      correctAnswer: "53",
      distractors: ["51", "52", "54"],
      explanation: "80 - 30 = 50, 7 - 4 = 3, 50 + 3 = 53."
    },
    {
      text: "Hisoblang: 41 + 38",
      correctAnswer: "79",
      distractors: ["77", "78", "80"],
      explanation: "40 + 30 = 70, 1 + 8 = 9, 70 + 9 = 79."
    },
    {
      text: "Hisoblang: 99 - 55",
      correctAnswer: "44",
      distractors: ["42", "45", "34"],
      explanation: "90 - 50 = 40, 9 - 5 = 4, 40 + 4 = 44."
    },

    // 4 ta qiyinroq
    {
      text: "Tenglamani yeching: x + 23 = 57",
      correctAnswer: "34",
      distractors: ["32", "35", "80"],
      explanation: "x = 57 - 23 = 34."
    },
    {
      text: "Tenglamani yeching: 68 - y = 35",
      correctAnswer: "33",
      distractors: ["31", "34", "103"],
      explanation: "y = 68 - 35 = 33."
    },
    {
      text: "Tuyaning bir o‘rkachlisida 45 kg, ikkinchisida 42 kg yuk bor. Ikkala tuyada jami necha kg yuk bor?",
      correctAnswer: "87 kg",
      distractors: ["85 kg", "89 kg", "90 kg"],
      explanation: "45 + 42 = 87 kg."
    },
    {
      text: "Xona birliklariga ajratib qulay hisoblang: 31 + 15 + 22",
      correctAnswer: "68",
      distractors: ["66", "69", "67"],
      explanation: "(30 + 10 + 20) + (1 + 5 + 2) = 60 + 8 = 68."
    },

    // 2 ta murakkab masala
    {
      text: "Qizilqum cho‘lidagi fermada 56 ta bir o‘rkachli tuya va 32 ta ikki o‘rkachli tuya boqilmoqda. Qo‘shni fermada esa jami tuyalar soni bu fermadagidan 14 taga kam. Qo‘shni fermada nechta tuya bor?",
      correctAnswer: "74 ta",
      distractors: ["72 ta", "76 ta", "88 ta"],
      explanation: "Birinchi ferma: 56 + 32 = 88 ta. Qo‘shni ferma: 88 - 14 = 74 ta."
    },
    {
      text: "Sayyohlar karvoni birinchi haftada 46 km, ikkinchi haftada birinchisidan 12 km kam, uchinchi haftada esa ikkinchi haftadagidan 15 km ortiq yo‘l yurdi. Uchinchi haftada sayyohlar necha km yo‘l yurgan?",
      correctAnswer: "49 km",
      distractors: ["47 km", "50 km", "34 km"],
      explanation: "Ikkinchi hafta: 46 - 12 = 34 km. Uchinchi hafta: 34 + 15 = 49 km."
    }
  ]
};

export const unit10: Grade2UnitDef = {
  order: 10,
  bookNumber: 10,
  unitType: "LESSON",
  title: "Sonlarni qo‘shish va ayirish",
  emoji: "🗺️",
  crossTopic: "Xaritalar",
  shortDesc: "Xona birliklari, ifodalar ma’nosi va shartli masalalar",
  intro: "Xaritalar yordamida shaharlar, tog‘lar va daryolarning masofalarini aniqlash mumkin. Ushbu darsda xona birliklari bo‘yicha amallar bajarish va ifodalarga savol qo‘yishni o‘rganamiz.",
  keyPoints: [
    "Masalada ikkita son yig‘indisi jami miqdorni, ayirmasi esa farqni bildiradi.",
    "41 - 11 ifodasi 'nechtaga kam yoki nechtaga ortiq' ekanligini ko‘rsatadi.",
    "2 dm = 20 cm bo‘lib, masofalarni o‘lchashda birliklarni o‘zaro aylantiramiz."
  ],
  miniExample: {
    emojis: "🗺️ 41 - 11 = 30 | 41 + 11 = 52",
    text: "Toshkentdan Samarqandgacha yo‘lda 41 ta va 11 ta belgi bor. Farqi: 41 - 11 = 30, jami: 41 + 11 = 52!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Hisoblang: 41 + 11",
      correctAnswer: "52",
      distractors: ["50", "51", "53"],
      explanation: "41 + 11 = 52."
    },
    {
      text: "Hisoblang: 41 - 11",
      correctAnswer: "30",
      distractors: ["31", "29", "20"],
      explanation: "41 - 11 = 30."
    },
    {
      text: "2 dm necha santimetrga teng?",
      correctAnswer: "20 cm",
      distractors: ["2 cm", "200 cm", "12 cm"],
      explanation: "1 dm = 10 cm, 2 dm = 20 cm."
    }
  ],
  test: [
    // 6 ta oson
    {
      text: "Hisoblang: 41 + 11",
      correctAnswer: "52",
      distractors: ["50", "51", "53"],
      explanation: "41 + 11 = 52."
    },
    {
      text: "Hisoblang: 41 - 11",
      correctAnswer: "30",
      distractors: ["29", "31", "20"],
      explanation: "41 - 11 = 30."
    },
    {
      text: "41 + 11 ifodasi qanday savolga javob beradi?",
      correctAnswer: "Ikkala miqdor birgalikda jami qancha?",
      distractors: ["Birinchi miqdor ikkinchisidan qancha kam?", "Noma’lum son nechaga teng?", "Faqat birinchi miqdor qancha?"],
      explanation: "Qo‘shish amali (41 + 11) jami miqdorni aniqlaydi."
    },
    {
      text: "41 - 11 ifodasi qanday savolga javob beradi?",
      correctAnswer: "Birinchi miqdor ikkinchisidan nechtaga ko‘p?",
      distractors: ["Jami miqdor qancha?", "Ular tengmi?", "Hech qanday savolga"],
      explanation: "Ayirish amali (41 - 11) ikki miqdor orasidagi farqni topadi."
    },
    {
      text: "2 dm li kesmaga nechta 10 cm li bo‘lak sig‘adi?",
      correctAnswer: "2 ta (chunki 2 dm = 20 cm)",
      distractors: ["1 ta", "3 ta", "4 ta"],
      explanation: "20 / 10 = 2 ta bo‘lak."
    },
    {
      text: "Tenglamani yeching: x + 11 = 41",
      correctAnswer: "30",
      distractors: ["29", "31", "52"],
      explanation: "x = 41 - 11 = 30."
    },

    // 8 ta o'rta
    {
      text: "Uzunligi 2 dm (20 cm) bo‘lgan qog‘oz tasmasiga har biri 2 cm li belgilardan 7 tasi oraliqlari 1 cm qilib sig‘adimi? (7 ta belgi 14 cm, 6 ta oraliq 6 cm: 14 + 6 = 20 cm)",
      correctAnswer: "Ha, to‘liq sig‘adi (20 cm = 2 dm)",
      distractors: ["Yo‘q, sig‘maydi", "Faqat 5 tasi sig‘adi", "1 cm ortib qoladi"],
      explanation: "7 × 2 cm = 14 cm belgilar, 6 ta oraliq × 1 cm = 6 cm. Jami: 14 + 6 = 20 cm = 2 dm. To‘liq sig‘adi!"
    },
    {
      text: "Xaritada A shahardan B shahargacha 35 cm, B dan C gacha 24 cm. A dan C gacha jami necha cm?",
      correctAnswer: "59 cm",
      distractors: ["58 cm", "60 cm", "11 cm"],
      explanation: "35 + 24 = 59 cm."
    },
    {
      text: "Xaritadagi A shahardan B shahargacha masofa B dan C gacha masofadan necha cm ortiq (oldingi masala bo‘yicha)?",
      correctAnswer: "11 cm ga ortiq (35 - 24 = 11)",
      distractors: ["10 cm", "12 cm", "59 cm"],
      explanation: "35 - 24 = 11 cm."
    },
    {
      text: "Hisoblang: 68 - 25 + 14",
      correctAnswer: "57",
      distractors: ["55", "56", "58"],
      explanation: "68 - 25 = 43, 43 + 14 = 57."
    },
    {
      text: "Tenglamani yeching: 55 - y = 22",
      correctAnswer: "33",
      distractors: ["31", "34", "77"],
      explanation: "y = 55 - 22 = 33."
    },
    {
      text: "Xaritada sayyoh yo‘li 3 bo‘lakdan iborat: 12 cm, 15 cm va 21 cm. Yo‘lning umumiy uzunligi qancha?",
      correctAnswer: "48 cm",
      distractors: ["46 cm", "47 cm", "50 cm"],
      explanation: "12 + 15 + 21 = 48 cm."
    },
    {
      text: "Qaysi ifodaga mantiqiy savol berib bo‘lmaydi?",
      correctAnswer: "5 ta daryo minus 3 ta daftar",
      distractors: ["41 km - 11 km", "15 ta shahar + 12 ta shahar", "30 cm + 20 cm"],
      explanation: "Bir xil bo‘lmagan har xil narsalarni bir-biridan ayirib bo‘lmaydi."
    },
    {
      text: "O‘zaro teskari uchta masala tuzish uchun qanday sonlar kerak bo‘ladi?",
      correctAnswer: "Bir-biri bilan qo‘shish va ayirish orqali bog‘langan uchta son",
      distractors: ["Istalgan har xil sonlar", "Faqat juft sonlar", "Faqat bitta son"],
      explanation: "Teskari masalalar bir xil uchta sonlar bog‘lanishiga tayanadi."
    },

    // 4 ta qiyinroq
    {
      text: "Sayyoh tog‘ xaritasida 14 cm yo‘l yurdi, bu butun yo‘lning yarmidan 6 cm kam. Butun yo‘lning yarmi necha cm?",
      correctAnswer: "20 cm (14 + 6 = 20)",
      distractors: ["18 cm", "22 cm", "8 cm"],
      explanation: "14 + 6 = 20 cm."
    },
    {
      text: "Tenglamani yeching: z - 34 = 43",
      correctAnswer: "77",
      distractors: ["75", "76", "9"],
      explanation: "z = 43 + 34 = 77."
    },
    {
      text: "Hisoblang: 96 - 42 - 24",
      correctAnswer: "30",
      distractors: ["28", "32", "40"],
      explanation: "96 - 42 = 54, 54 - 24 = 30."
    },
    {
      text: "Xarita masshtabida 1 dm uzunlik 10 km ni bildirsa, 5 dm necha km ni bildiradi?",
      correctAnswer: "50 km",
      distractors: ["40 km", "60 km", "15 km"],
      explanation: "5 ta 10 km = 50 km."
    },

    // 2 ta murakkab masala
    {
      text: "O‘zbekiston xaritasida Toshkent va Guliston oralig‘i 12 cm, Guliston va Jizzax oralig‘i 10 cm, Jizzax va Samarqand oralig‘i 14 cm qilib chizilgan. Sayyoh Toshkentdan chiqib Samarqandgacha barcha shaharlardan o‘tsa, xaritada necha cm masofani bosib o‘tgan bo‘ladi?",
      correctAnswer: "36 cm (12 + 10 + 14 = 36)",
      distractors: ["34 cm", "38 cm", "40 cm"],
      explanation: "12 + 10 + 14 = 36 cm."
    },
    {
      text: "Geografiya darsida o‘quvchilar xaritadan 48 ta tog‘ cho‘qqisini va 35 ta ko‘lni belgilashdi. Shulardan 23 ta obekt qizil rang bilan, qolganlari esa ko‘k rang bilan belgilandi. Ko‘k rang bilan nechta obekt belgilangan?",
      correctAnswer: "60 ta obekt (48 + 35 - 23 = 60)",
      distractors: ["58 ta", "62 ta", "83 ta"],
      explanation: "Jami obektlar: 48 + 35 = 83 ta. Ko‘k rangdagilar: 83 - 23 = 60 ta."
    }
  ]
};

export const unit11: Grade2UnitDef = {
  order: 11,
  bookNumber: 11,
  unitType: "LESSON",
  title: "Yaxlit songacha qo‘shish (31 + 9)",
  emoji: "🦢",
  crossTopic: "Laylaklar",
  shortDesc: "Sonni yaxlit o‘nlikkacha to‘ldirib qo‘shish usuli: 31 + 9 = 40",
  intro: "Laylaklar bahorda yurtimizga uchib keladi va baland minoralar ustiga uya quradi. Ushbu darsda birliklarni qo‘shib yangi o‘nlik hosil qilishni (31 + 9 = 40) o‘rganamiz.",
  keyPoints: [
    "31 + 9 amali: 1 birlik va 9 birlik qo‘shilib 1 ta yangi o‘nlik hosil qiladi.",
    "3 ta o‘nlik + 1 ta yangi o‘nlik = 4 ta o‘nlik = 40.",
    "Yaxlit songacha to‘ldirish hisob-kitobni ancha tezlashtiradi."
  ],
  miniExample: {
    emojis: "🦢 31 + 9 = 3 o‘nl. 10 birl. = 40",
    text: "1 ga 9 ni qo‘shsak 10 (1 o‘nlik) bo‘ladi. 30 ga 10 ni qo‘shsak 40 hosil bo‘ladi!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Hisoblang: 31 + 9",
      correctAnswer: "40",
      distractors: ["39", "41", "50"],
      explanation: "31 + 9 = 40."
    },
    {
      text: "Hisoblang: 75 + 5",
      correctAnswer: "80",
      distractors: ["70", "85", "79"],
      explanation: "75 + 5 = 80."
    },
    {
      text: "Tenglamani yeching: x - 4 = 36",
      correctAnswer: "40",
      distractors: ["32", "38", "42"],
      explanation: "x = 36 + 4 = 40."
    }
  ],
  test: [
    // 6 ta oson
    {
      text: "Hisoblang: 31 + 9",
      correctAnswer: "40",
      distractors: ["39", "41", "50"],
      explanation: "1 + 9 = 10, 30 + 10 = 40."
    },
    {
      text: "Hisoblang: 75 + 5",
      correctAnswer: "80",
      distractors: ["70", "85", "79"],
      explanation: "5 + 5 = 10, 70 + 10 = 80."
    },
    {
      text: "Hisoblang: 34 + 6",
      correctAnswer: "40",
      distractors: ["39", "41", "50"],
      explanation: "4 + 6 = 10, 30 + 10 = 40."
    },
    {
      text: "Hisoblang: 92 + 8",
      correctAnswer: "100",
      distractors: ["99", "90", "98"],
      explanation: "2 + 8 = 10, 90 + 10 = 100."
    },
    {
      text: "Tenglamani yeching: x - 4 = 36",
      correctAnswer: "40",
      distractors: ["32", "39", "42"],
      explanation: "x = 36 + 4 = 40."
    },
    {
      text: "31 + 9 amali xona birliklarida qanday ifodalanadi?",
      correctAnswer: "3 o‘nl. 10 birl. = 4 o‘nl. = 40",
      distractors: ["3 o‘nl. 9 birl. = 39", "4 o‘nl. 1 birl. = 41", "30 o‘nlik"],
      explanation: "10 ta birlik 1 ta yangi o‘nlik bo‘lib qo‘shiladi."
    },

    // 8 ta o'rta
    {
      text: "To‘g‘ri to‘rtburchakning eni 13 cm, bo‘yi esa undan 7 cm uzun. To‘rtburchakning bo‘yi necha cm?",
      correctAnswer: "20 cm (13 + 7 = 20)",
      distractors: ["19 cm", "21 cm", "6 cm"],
      explanation: "13 + 7 = 20 cm."
    },
    {
      text: "Ushbu to‘g‘ri to‘rtburchakning perimetrini hisoblang (eni 13 cm, bo‘yi 20 cm):",
      correctAnswer: "66 cm (13 + 20 + 13 + 20 = 66)",
      distractors: ["64 cm", "68 cm", "33 cm"],
      explanation: "13 + 20 + 13 + 20 = 66 cm."
    },
    {
      text: "'21 va 9 ning yig‘indisiga 5 ni qo‘shing'. Ifoda qiymatini toping:",
      correctAnswer: "35 ((21 + 9) + 5 = 35)",
      distractors: ["34", "36", "30"],
      explanation: "21 + 9 = 30, 30 + 5 = 35."
    },
    {
      text: "Hisoblang: 43 + 7 + 10",
      correctAnswer: "60",
      distractors: ["50", "59", "61"],
      explanation: "43 + 7 = 50, 50 + 10 = 60."
    },
    {
      text: "Hisoblang: 62 + 8 - 20",
      correctAnswer: "50",
      distractors: ["40", "60", "70"],
      explanation: "62 + 8 = 70, 70 - 20 = 50."
    },
    {
      text: "Tenglamani yeching: y - 8 = 52",
      correctAnswer: "60",
      distractors: ["44", "58", "62"],
      explanation: "y = 52 + 8 = 60."
    },
    {
      text: "Ko‘l bo‘yida 23 ta laylak qo‘nib turgan edi. Yana 7 ta laylak uchib keldi. Laylaklar nechta bo‘ldi?",
      correctAnswer: "30 ta",
      distractors: ["29 ta", "31 ta", "28 ta"],
      explanation: "23 + 7 = 30 ta laylak."
    },
    {
      text: "Hisoblang: 56 + 4 + 15",
      correctAnswer: "75",
      distractors: ["70", "74", "76"],
      explanation: "56 + 4 = 60, 60 + 15 = 75."
    },

    // 4 ta qiyinroq
    {
      text: "Tenglamani yeching: a - 6 = 84",
      correctAnswer: "90",
      distractors: ["78", "88", "92"],
      explanation: "a = 84 + 6 = 90."
    },
    {
      text: "Bog‘bon 51 tup olma va 9 tup nok ko‘chati o‘tqazdi. Ko‘chatlarning umumiy soni qaysi yaxlit songa teng?",
      correctAnswer: "60 (51 + 9)",
      distractors: ["50", "70", "59"],
      explanation: "51 + 9 = 60."
    },
    {
      text: "Hisoblang: (18 + 2) + (27 + 3)",
      correctAnswer: "50",
      distractors: ["48", "52", "40"],
      explanation: "20 + 30 = 50."
    },
    {
      text: "Qaysi songa 7 ni qo‘shsak 50 hosil bo‘ladi?",
      correctAnswer: "43",
      distractors: ["42", "44", "41"],
      explanation: "50 - 7 = 43."
    },

    // 2 ta murakkab masala
    {
      text: "Qishloqda laylaklar 3 ta baland binoda uya qurgan. Birinchi binoda 11 ta, ikkinchisida 19 ta laylak bor. Uchinchi binodagi laylaklar esa birinchi va ikkinchi binodagi laylaklar yig‘indisidan 10 taga kam. Uchinchi binoda nechta laylak bor?",
      correctAnswer: "20 ta laylak ((11 + 19) - 10 = 20)",
      distractors: ["18 ta", "22 ta", "30 ta"],
      explanation: "11 + 19 = 30 ta. 30 - 10 = 20 ta laylak."
    },
    {
      text: "Qishloqda uchala binoda jami nechta laylak yashaydi (oldingi masala shartiga ko‘ra)?",
      correctAnswer: "50 ta laylak (30 + 20 = 50)",
      distractors: ["40 ta", "48 ta", "60 ta"],
      explanation: "30 + 20 = 50 ta laylak."
    }
  ]
};

export const unit12: Grade2UnitDef = {
  order: 12,
  bookNumber: 12,
  unitType: "LESSON",
  title: "Yaxlit songacha qo‘shish (31 + 9)",
  emoji: "💧",
  crossTopic: "Suv",
  shortDesc: "Guruhlash xossasi yordamida yaxlit songacha to‘ldirib qulay hisoblash",
  intro: "Suv — hayot manbai. Biz har kuni suvni tejab ishlatishimiz kerak. Ushbu darsda 72 + 8 = 70 + (2 + 8) = 80 qoidasi asosida bir nechta sonlarni qulay guruhlab qo‘shishni o‘rganamiz.",
  keyPoints: [
    "72 + 8 = 70 + (2 + 8) = 70 + 10 = 80.",
    "Yig‘indisi 10 bo‘ladigan sonlar: 1+9, 2+8, 3+7, 4+6, 5+5.",
    "Qulay usulda sonlarni o‘rnini almashtirib, avval yaxlit o‘nlik hosil qilinadi."
  ],
  miniExample: {
    emojis: "💧 72 + 8 = 70 + (2 + 8) = 80",
    text: "72 ni 70 va 2 deb olamiz: 2 + 8 = 10, keyin 70 + 10 = 80 bo‘ladi!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Hisoblang: 72 + 8",
      correctAnswer: "80",
      distractors: ["70", "82", "79"],
      explanation: "72 + 8 = 80."
    },
    {
      text: "Hisoblang: 46 + 4",
      correctAnswer: "50",
      distractors: ["40", "48", "52"],
      explanation: "46 + 4 = 50."
    },
    {
      text: "Qulay usulda hisoblang: 21 + 9 + 15",
      correctAnswer: "45 ((21 + 9) + 15 = 45)",
      distractors: ["40", "44", "46"],
      explanation: "21 + 9 = 30, 30 + 15 = 45."
    }
  ],
  test: [
    // 6 ta oson
    {
      text: "Hisoblang: 29 + 1",
      correctAnswer: "30",
      distractors: ["28", "31", "40"],
      explanation: "29 + 1 = 30."
    },
    {
      text: "Hisoblang: 46 + 4",
      correctAnswer: "50",
      distractors: ["40", "48", "52"],
      explanation: "46 + 4 = 50."
    },
    {
      text: "Hisoblang: 54 + 6",
      correctAnswer: "60",
      distractors: ["50", "58", "62"],
      explanation: "54 + 6 = 60."
    },
    {
      text: "Hisoblang: 37 + 3",
      correctAnswer: "40",
      distractors: ["30", "39", "42"],
      explanation: "37 + 3 = 40."
    },
    {
      text: "Hisoblang: 88 + 2",
      correctAnswer: "90",
      distractors: ["80", "89", "100"],
      explanation: "88 + 2 = 90."
    },
    {
      text: "72 + 8 amali qanday qulay guruhlanadi?",
      correctAnswer: "70 + (2 + 8) = 80",
      distractors: ["(70 + 8) + 2 = 80", "72 + 10 - 2 = 80", "70 + 8 = 78"],
      explanation: "72 ni 70 va 2 ga ajratib: 70 + (2 + 8) = 80."
    },

    // 8 ta o'rta
    {
      text: "Qulay usulda hisoblang: 21 + 34 + 15 + 6 + 5 + 9",
      correctAnswer: "90 ((21+9) + (34+6) + (15+5) = 30+40+20 = 90)",
      distractors: ["80", "85", "95"],
      explanation: "(21+9=30) + (34+6=40) + (15+5=20) = 30 + 40 + 20 = 90."
    },
    {
      text: "Madina tishini tozalashda kranni ochiq qoldirmasdan 4 minut, idish yuvishda undan 3 minut ko‘p, dush qabul qilishda esa idish yuvishdan 2 minut kam vaqt sarfladi. Dush qabul qilishga necha minut ketgan?",
      correctAnswer: "5 minut (4 + 3 - 2 = 5)",
      distractors: ["4 minut", "6 minut", "7 minut"],
      explanation: "Idish yuvish: 4 + 3 = 7 minut. Dush: 7 - 2 = 5 minut."
    },
    {
      text: "Madina barcha yumushlarga jami necha minut vaqt sarflagan (oldingi masala shartiga ko‘ra)?",
      correctAnswer: "16 minut (4 + 7 + 5 = 16)",
      distractors: ["15 minut", "17 minut", "18 minut"],
      explanation: "4 + 7 + 5 = 16 minut."
    },
    {
      text: "Qulay usulda hisoblang: 13 + 27 + 18 + 2",
      correctAnswer: "60 ((13+27=40) + (18+2=20) = 60)",
      distractors: ["50", "58", "62"],
      explanation: "40 + 20 = 60."
    },
    {
      text: "Qulay usulda hisoblang: 44 + 16 + 25 + 5",
      correctAnswer: "90 ((44+16=60) + (25+5=30) = 90)",
      distractors: ["80", "85", "95"],
      explanation: "60 + 30 = 90."
    },
    {
      text: "Suv idishida 63 litr suv bor edi. Unga yana 7 litr suv quyildi. Idishdagi suv necha litr bo‘ldi?",
      correctAnswer: "70 litr",
      distractors: ["69 litr", "71 litr", "80 litr"],
      explanation: "63 + 7 = 70 litr."
    },
    {
      text: "Tenglamani yeching: y - 5 = 65",
      correctAnswer: "70",
      distractors: ["60", "69", "72"],
      explanation: "y = 65 + 5 = 70."
    },
    {
      text: "Hisoblang: 76 + 4 + 12",
      correctAnswer: "92",
      distractors: ["90", "91", "88"],
      explanation: "76 + 4 = 80, 80 + 12 = 92."
    },

    // 4 ta qiyinroq
    {
      text: "Qulay usulda hisoblang: 12 + 18 + 14 + 16",
      correctAnswer: "60 ((12+18=30) + (14+16=30) = 60)",
      distractors: ["50", "58", "62"],
      explanation: "30 + 30 = 60."
    },
    {
      text: "Akvariumga 1-kuni 22 litr, 2-kuni 8 litr suv quyildi. Agar akvarium sig‘imi 50 litr bo‘lsa, uni to‘ldirish uchun yana necha litr suv kerak?",
      correctAnswer: "20 litr (50 - 30 = 20)",
      distractors: ["18 litr", "25 litr", "30 litr"],
      explanation: "22 + 8 = 30 litr. Qolgani: 50 - 30 = 20 litr."
    },
    {
      text: "Hisoblang: (81 + 9) - (35 + 5)",
      correctAnswer: "50 (90 - 40 = 50)",
      distractors: ["40", "60", "45"],
      explanation: "90 - 40 = 50."
    },
    {
      text: "Qaysi tenglikda guruhlash xossasi to‘g‘ri qo‘llanilgan?",
      correctAnswer: "63 + 7 + 15 = (63 + 7) + 15 = 70 + 15 = 85",
      distractors: [
        "63 + 7 + 15 = 63 + (7 - 15)",
        "63 + 7 + 15 = (63 - 7) + 15",
        "63 + 7 + 15 = 70 - 15"
      ],
      explanation: "63 va 7 ni qavsga olib avval qo‘shish yaxlit 70 ni beradi."
    },

    // 2 ta murakkab masala
    {
      text: "Maktab oshxonasida choy qaynatish uchun 3 ta katta qozonga suv quyildi: 1-qozonga 24 litr, 2-qozonga 16 litr va 3-qozonga 30 litr. Choy uchun jami necha litr suv quyilgan?",
      correctAnswer: "70 litr ((24 + 16) + 30 = 70)",
      distractors: ["60 litr", "68 litr", "80 litr"],
      explanation: "24 + 16 = 40 litr; 40 + 30 = 70 litr."
    },
    {
      text: "Bog‘dagi hovuzga suv quyish nasosi ertalab 38 litr, tushda esa 12 litr suv haydadi. Agar hovuzdan 20 litr suv ekinlarni sug‘orishga sarflangan bo‘lsa, hovuzda necha litr suv qoldi?",
      correctAnswer: "30 litr ((38 + 12) - 20 = 30)",
      distractors: ["28 litr", "32 litr", "50 litr"],
      explanation: "38 + 12 = 50 litr. Qoldi: 50 - 20 = 30 litr."
    }
  ]
};

export const unit13: Grade2UnitDef = {
  order: 13,
  bookNumber: 13,
  unitType: "LESSON",
  title: "Yaxlit sondan ayirish",
  emoji: "⛷️",
  crossTopic: "Qishki sport turlari",
  shortDesc: "Yaxlit o‘nlikdan bir xonali sonni ayirish usuli: 50 - 6, 70 - 8, 90 - 1",
  intro: "Qishda chang‘i va konki uchish insonni baquvvat qiladi. Muz maydonlarida tezlik va aniqlik muhim bo‘lganidek, matematikada ham yaxlit sondan o‘nlikni maydalab ayirishni aniq bajarish zarur.",
  keyPoints: [
    "50 - 6 amali: 50 dan 1 ta o‘nlik (10) olamiz va 10 dan 6 ni ayiramiz: 10 - 6 = 4.",
    "Qolgan 4 ta o‘nlikka 4 ni qo‘shamiz: 40 + 4 = 44.",
    "4 o‘nl. - 4 birl. = 3 o‘nl. 6 birl. = 36."
  ],
  miniExample: {
    emojis: "⛷️ 50 - 6 = 40 + (10 - 6) = 44",
    text: "50 ni 40 va 10 ga ajratamiz: 10 dan 6 ni ayirsak 4 qoladi. 40 + 4 = 44!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Hisoblang: 50 - 6",
      correctAnswer: "44",
      distractors: ["46", "45", "43"],
      explanation: "10 - 6 = 4, 40 + 4 = 44."
    },
    {
      text: "Hisoblang: 70 - 8",
      correctAnswer: "62",
      distractors: ["68", "60", "63"],
      explanation: "10 - 8 = 2, 60 + 2 = 62."
    },
    {
      text: "Hisoblang: 90 - 1",
      correctAnswer: "89",
      distractors: ["80", "91", "88"],
      explanation: "90 - 1 = 89."
    }
  ],
  test: [
    // 6 ta oson
    {
      text: "Hisoblang: 50 - 6",
      correctAnswer: "44",
      distractors: ["46", "45", "43"],
      explanation: "50 - 6 = 44."
    },
    {
      text: "Hisoblang: 70 - 8",
      correctAnswer: "62",
      distractors: ["68", "60", "63"],
      explanation: "70 - 8 = 62."
    },
    {
      text: "Hisoblang: 90 - 1",
      correctAnswer: "89",
      distractors: ["80", "91", "88"],
      explanation: "90 - 1 = 89."
    },
    {
      text: "Hisoblang: 80 - 1",
      correctAnswer: "79",
      distractors: ["78", "81", "70"],
      explanation: "80 - 1 = 79."
    },
    {
      text: "Hisoblang: 30 - 3",
      correctAnswer: "27",
      distractors: ["26", "28", "23"],
      explanation: "30 - 3 = 27."
    },
    {
      text: "Hisoblang: 20 - 4",
      correctAnswer: "16",
      distractors: ["15", "17", "14"],
      explanation: "20 - 4 = 16."
    },

    // 8 ta o'rta
    {
      text: "4 o‘nl. - 4 birl. amali natijasi nechaga teng?",
      correctAnswer: "3 o‘nl. 6 birl. = 36",
      distractors: ["4 o‘nl. 4 birl. = 44", "3 o‘nl. 4 birl. = 34", "40"],
      explanation: "40 - 4 = 36 = 3 o‘nlik 6 birlik."
    },
    {
      text: "Muz maydonining bo‘yi 20 m, eni esa bo‘yidan 6 m kam. Maydonning eni necha metr?",
      correctAnswer: "14 metr (20 - 6 = 14)",
      distractors: ["13 metr", "15 metr", "16 metr"],
      explanation: "20 - 6 = 14 metr."
    },
    {
      text: "Ushbu muz maydonining perimetrini hisoblang (bo‘yi 20 m, eni 14 m):",
      correctAnswer: "68 metr (20 + 14 + 20 + 14 = 68)",
      distractors: ["64 metr", "66 metr", "70 metr"],
      explanation: "20 + 14 + 20 + 14 = 68 metr."
    },
    {
      text: "Hisoblang: 60 - 7",
      correctAnswer: "53",
      distractors: ["52", "54", "57"],
      explanation: "60 - 7 = 53."
    },
    {
      text: "Hisoblang: 40 - 9",
      correctAnswer: "31",
      distractors: ["30", "32", "39"],
      explanation: "40 - 9 = 31."
    },
    {
      text: "Chang‘i bazasida 50 juft chang‘i bor edi. Ertalab 8 juft chang‘i ijaraga berildi. Bazada necha juft chang‘i qoldi?",
      correctAnswer: "42 juft",
      distractors: ["40 juft", "43 juft", "44 juft"],
      explanation: "50 - 8 = 42 juft."
    },
    {
      text: "Jadvalni to‘ldiring: kamayuvchi 80, ayriluvchi 5. Ayirmani toping:",
      correctAnswer: "75",
      distractors: ["74", "76", "85"],
      explanation: "80 - 5 = 75."
    },
    {
      text: "Hisoblang: 100 - 6",
      correctAnswer: "94",
      distractors: ["92", "95", "96"],
      explanation: "100 - 6 = 94."
    },

    // 4 ta qiyinroq
    {
      text: "Tenglamani yeching: 60 - x = 54",
      correctAnswer: "6",
      distractors: ["4", "5", "14"],
      explanation: "x = 60 - 54 = 6."
    },
    {
      text: "Tenglamani yeching: 80 - y = 72",
      correctAnswer: "8",
      distractors: ["7", "9", "12"],
      explanation: "y = 80 - 72 = 8."
    },
    {
      text: "Hisoblang: (70 - 4) - 20",
      correctAnswer: "46",
      distractors: ["44", "48", "50"],
      explanation: "70 - 4 = 66, 66 - 20 = 46."
    },
    {
      text: "50 dan 7 ni ayirish uchun qaysi ifoda to‘g‘ri?",
      correctAnswer: "40 + (10 - 7) = 43",
      distractors: ["50 - 10 + 7", "40 - (10 - 7)", "30 + 17"],
      explanation: "50 dan bitta 10 lik ajratiladi: 40 + (10 - 7) = 43."
    },

    // 2 ta murakkab masala
    {
      text: "Qishki sport musobaqasida 40 nafar chang‘ichi startga chiqdi. Birinchi marraga 15 nafar, ikkinchi marraga 9 nafar sportchi yetib keldi. Yo‘lda yana necha nafar sportchi harakatlanmoqda?",
      correctAnswer: "16 nafar ((40 - 15) - 9 = 16)",
      distractors: ["14 nafar", "18 nafar", "24 nafar"],
      explanation: "40 - 15 = 25 nafar. Qolganlar: 25 - 9 = 16 nafar."
    },
    {
      text: "Konkichilar maydonchasi to‘g‘ri to‘rtburchak shaklida: perimetri 70 metr. Agar maydonchaning ikkita bo‘yi yig‘indisi 40 metr bo‘lsa, maydonchaning eni necha metr bo‘ladi?",
      correctAnswer: "15 metr ((70 - 40) / 2 = 15)",
      distractors: ["14 metr", "16 metr", "30 metr"],
      explanation: "Ikkita eni: 70 - 40 = 30 metr. Eni: 30 / 2 = 15 metr."
    }
  ]
};

// Save units 9-13
const units = [unit09, unit10, unit11, unit12, unit13];
for (const u of units) {
  const seed = buildGrade2UnitSeed(u);
  saveGrade2UnitFile(u.order, seed);
  console.log(`✅ Saved Grade 2 unit-${u.order < 10 ? '0' + u.order : u.order}.json`);
}
