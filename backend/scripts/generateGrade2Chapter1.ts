import { Grade2UnitDef, buildGrade2UnitSeed, saveGrade2UnitFile } from './generatorTypes';

console.log("Generating Grade 2 Part 1 Chapter I (order 1-8)...");

export const unit01: Grade2UnitDef = {
  order: 1,
  bookNumber: 1,
  unitType: "LESSON",
  title: "Takrorlash",
  emoji: "🍂",
  crossTopic: "Kuzgi hodisalar",
  shortDesc: "20 gacha bo‘lgan sonlar, ularning tarkibi, yig‘indi va ayirma",
  intro: "Kuz faslida tabiat o‘zgaradi: barglar sarg‘ayadi, havo salqinlashadi. Ushbu darsda 1-sinfda o‘rgangan 20 ichida qo‘shish va ayirish amallarini takrorlaymiz.",
  keyPoints: [
    "20 gacha sonlar 1 ta o‘nlik va birliklardan tashkil topadi.",
    "Qo‘shish amali natijasi yig‘indi, ayirish amali natijasi esa ayirma deyiladi.",
    "Sonlarni taqqoslashda >, < va = belgilaridan foydalanamiz."
  ],
  miniExample: {
    emojis: "🍁 10 + 4 = 14 | 14 > 12",
    text: "Daraxt ostida 10 ta sariq va 4 ta qizil barg tushdi. Jami 14 ta barg: 10 + 4 = 14!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Hisoblang: 12 + 5",
      correctAnswer: "17",
      distractors: ["16", "18", "15"],
      explanation: "12 + 5 = 17."
    },
    {
      text: "Hisoblang: 19 - 7",
      correctAnswer: "12",
      distractors: ["11", "13", "10"],
      explanation: "19 - 7 = 12."
    },
    {
      text: "14 ... 19 taqqoslashga mos belgini tanlang:",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "14 soni 19 dan kichik: 14 < 19."
    }
  ],
  test: [
    // 6 ta oson
    {
      text: "Hisoblang: 13 + 4",
      correctAnswer: "17",
      distractors: ["16", "18", "15"],
      explanation: "13 + 4 = 17."
    },
    {
      text: "Hisoblang: 18 - 5",
      correctAnswer: "13",
      distractors: ["12", "14", "15"],
      explanation: "18 - 5 = 13."
    },
    {
      text: "10 + 10 ... 19 ifodasiga qaysi belgi mos keladi?",
      correctAnswer: ">",
      distractors: ["<", "=", "-"],
      explanation: "10 + 10 = 20, 20 soni 19 dan katta (20 > 19)."
    },
    {
      text: "20 - 5 ... 10 + 2 ifodalarini taqqoslang:",
      correctAnswer: ">",
      distractors: ["<", "=", "+"],
      explanation: "20 - 5 = 15 va 10 + 2 = 12. 15 > 12."
    },
    {
      text: "16 sonida nechta o‘nlik va nechta birlik bor?",
      correctAnswer: "1 ta o‘nlik va 6 ta birlik",
      distractors: ["6 ta o‘nlik va 1 ta birlik", "16 ta o‘nlik", "2 ta o‘nlik"],
      explanation: "16 soni 1 ta o‘nlik (10) va 6 ta birlikdan iborat."
    },
    {
      text: "Qaysi qatorda sonlar o‘sish tartibida to‘g‘ri joylashtirilgan?",
      correctAnswer: "7, 11, 15, 19",
      distractors: ["19, 15, 11, 7", "11, 7, 15, 19", "7, 15, 11, 19"],
      explanation: "7 < 11 < 15 < 19 — sonlar kichikdan kattaga qarab o‘sish tartibida."
    },

    // 8 ta o'rta
    {
      text: "Kuzgi bog‘da 6 tup terak, 7 tup chinor va 4 tup eman ekildi. Jami nechta daraxt ekilgan?",
      correctAnswer: "17 ta",
      distractors: ["16 ta", "18 ta", "15 ta"],
      explanation: "6 + 4 + 7 = 10 + 7 = 17 ta daraxt."
    },
    {
      text: "Hisoblang: 7 + 8",
      correctAnswer: "15",
      distractors: ["14", "16", "13"],
      explanation: "7 + 8 = 15."
    },
    {
      text: "Hisoblang: 14 - 8",
      correctAnswer: "6",
      distractors: ["5", "7", "8"],
      explanation: "14 - 8 = 6."
    },
    {
      text: "Kuz faslida sentabr oyida 12 kun quyoshli, 8 kun tumanli bo‘ldi. Quyoshli kunlar tumanli kunlardan nechtaga ko‘p?",
      correctAnswer: "4 kunga ko‘p",
      distractors: ["3 kunga", "5 kunga", "20 kunga"],
      explanation: "12 - 8 = 4 kunga ko‘p."
    },
    {
      text: "Oktabr oyida 10 kun yomg‘ir yog‘di, 9 kun havo ochiq bo‘ldi. Jami necha kun hisobga olindi?",
      correctAnswer: "19 kun",
      distractors: ["18 kun", "20 kun", "1 kun"],
      explanation: "10 + 9 = 19 kun."
    },
    {
      text: "Jadvaldagi yig‘indini toping: 1-qo‘shiluvchi 9, 2-qo‘shiluvchi 5. Yig‘indi nechaga teng?",
      correctAnswer: "14",
      distractors: ["13", "15", "4"],
      explanation: "9 + 5 = 14."
    },
    {
      text: "Kamayuvchi 16, ayriluvchi 9 bo‘lsa, ayirmani hisoblang:",
      correctAnswer: "7",
      distractors: ["6", "8", "25"],
      explanation: "16 - 9 = 7."
    },
    {
      text: "15 - 6 ... 16 - 7 ifodalariga mos belgini toping:",
      correctAnswer: "=",
      distractors: [">", "<", "+"],
      explanation: "15 - 6 = 9 va 16 - 7 = 9. Ikkala tomon teng (9 = 9)."
    },

    // 4 ta qiyinroq
    {
      text: "Noma’lum sonni toping: 11 + x = 19",
      correctAnswer: "8",
      distractors: ["7", "9", "6"],
      explanation: "x = 19 - 11 = 8."
    },
    {
      text: "Noma’lum sonni toping: x - 6 = 8",
      correctAnswer: "14",
      distractors: ["12", "13", "2"],
      explanation: "x = 8 + 6 = 14."
    },
    {
      text: "14 □ 19 taqqoslashiga to‘g‘ri belgi qaysi?",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "14 soni 19 dan kichik: 14 < 19."
    },
    {
      text: "Bolalar parkda 8 ta qizil va 5 ta sariq barg yig‘ishdi. Ulardan 4 tasini daftarga yopishtirishdi. Nechta barg qoldi?",
      correctAnswer: "9 ta",
      distractors: ["8 ta", "10 ta", "17 ta"],
      explanation: "8 + 5 = 13, 13 - 4 = 9 ta barg qoldi."
    },

    // 2 ta murakkab masala
    {
      text: "Toshkentdagi botanika bog‘ida maktab o‘quvchilari sayr qilishdi. Birinchi guruhda 9 nafar, ikkinchi guruhda 8 nafar o‘quvchi bor edi. Tushdan keyin 7 nafar bola uyga qaytdi. Bog‘da necha nafar o‘quvchi qoldi?",
      correctAnswer: "10 nafar",
      distractors: ["11 nafar", "9 nafar", "12 nafar"],
      explanation: "Jami o‘quvchilar: 9 + 8 = 17 nafar. Qolganlar: 17 - 7 = 10 nafar."
    },
    {
      text: "Maktab hovlisiga ekish uchun 20 tup gul ko‘chati keltirildi. Ertalab 6 tup, kechki payt 7 tup ko‘chat o‘tqazildi. Ekish uchun yana nechta gul ko‘chati qoldi?",
      correctAnswer: "7 tup",
      distractors: ["6 tup", "8 tup", "13 tup"],
      explanation: "Ekilgan ko‘chatlar: 6 + 7 = 13 tup. Qolgani: 20 - 13 = 7 tup."
    }
  ]
};

export const unit02: Grade2UnitDef = {
  order: 2,
  bookNumber: 2,
  unitType: "LESSON",
  title: "Takrorlash",
  emoji: "🥕",
  crossTopic: "Kuzgi hosil",
  shortDesc: "100 gacha bo‘lgan sonlar, o‘nliklar va ular ustida amallar",
  intro: "Kuz — to‘kin-sochinlik fasli. Dalalardan sabzavot va mevalar yig‘ib olinadi. Bu darsda 100 ichidagi yaxlit o‘nliklar va sonlar ustida amallarni takrorlaymiz.",
  keyPoints: [
    "Yaxlit o‘nliklar: 10, 20, 30, 40, 50, 60, 70, 80, 90, 100.",
    "4 ta o‘nlik va 3 ta birlik 43 sonini hosil qiladi (4 o‘nl. 3 birl. = 43).",
    "Ketma-ket amallar chapdan o‘ngga qarab bajariladi."
  ],
  miniExample: {
    emojis: "🥕 40 + 50 - 20 = 70",
    text: "40 ga 50 ni qo‘shsak 90 bo‘ladi, 90 dan 20 ni ayirsak 70 qoladi!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Hisoblang: 40 + 30",
      correctAnswer: "70",
      distractors: ["60", "80", "50"],
      explanation: "4 o‘nlik + 3 o‘nlik = 7 o‘nlik = 70."
    },
    {
      text: "Hisoblang: 90 - 40",
      correctAnswer: "50",
      distractors: ["40", "60", "30"],
      explanation: "90 - 40 = 50."
    },
    {
      text: "4 o‘nl. 3 birl. qaysi songa teng?",
      correctAnswer: "43",
      distractors: ["34", "40", "430"],
      explanation: "4 ta o‘nlik (40) va 3 ta birlik = 43."
    }
  ],
  test: [
    // 6 ta oson
    {
      text: "Hisoblang: 40 + 50 - 20",
      correctAnswer: "70",
      distractors: ["60", "80", "50"],
      explanation: "40 + 50 = 90, 90 - 20 = 70."
    },
    {
      text: "4 o‘nl. 3 birl. sonini toping:",
      correctAnswer: "43",
      distractors: ["34", "40", "430"],
      explanation: "4 ta o‘nlik va 3 ta birlik 43 sonini beradi."
    },
    {
      text: "7 o‘nl. 5 birl. qaysi son?",
      correctAnswer: "75",
      distractors: ["57", "70", "750"],
      explanation: "7 ta o‘nlik va 5 ta birlik = 75."
    },
    {
      text: "Hisoblang: 60 + 20",
      correctAnswer: "80",
      distractors: ["70", "90", "40"],
      explanation: "60 + 20 = 80."
    },
    {
      text: "Hisoblang: 80 - 30",
      correctAnswer: "50",
      distractors: ["40", "60", "70"],
      explanation: "80 - 30 = 50."
    },
    {
      text: "Sonlar nurida 30 dan 20 birlik o‘ngga yursak, qaysi songa boramiz?",
      correctAnswer: "50 ga",
      distractors: ["40 ga", "60 ga", "10 ga"],
      explanation: "30 + 20 = 50."
    },

    // 8 ta o'rta
    {
      text: "Hisoblang: 73 - 40 + 24",
      correctAnswer: "57",
      distractors: ["55", "56", "58"],
      explanation: "73 - 40 = 33, 33 + 24 = 57."
    },
    {
      text: "Fermer birinchi maydondan 50 chelak sabzi, ikkinchisidan undan 20 chelak ko‘p sabzi yig‘di. Ikkinchi maydondan necha chelak sabzi olingan?",
      correctAnswer: "70 chelak",
      distractors: ["60 chelak", "30 chelak", "80 chelak"],
      explanation: "50 + 20 = 70 chelak."
    },
    {
      text: "Ikkala maydondan jami necha chelak sabzi yig‘ilgan (oldingi masala shartiga ko‘ra)?",
      correctAnswer: "120 chelak",
      distractors: ["100 chelak", "110 chelak", "70 chelak"],
      explanation: "50 + 70 = 120 chelak (yoki 5 o‘nlik + 7 o‘nlik = 12 o‘nlik)."
    },
    {
      text: "Hisoblang: 100 - 30 - 20",
      correctAnswer: "50",
      distractors: ["40", "60", "70"],
      explanation: "100 - 30 = 70, 70 - 20 = 50."
    },
    {
      text: "6 ta o‘nlik 8 ta birlikdan nechaga katta?",
      correctAnswer: "52 ga (60 - 8 = 52)",
      distractors: ["68 ga", "50 ga", "54 ga"],
      explanation: "6 ta o‘nlik = 60. 60 - 8 = 52."
    },
    {
      text: "85 sonida nechta o‘nlik bor?",
      correctAnswer: "8 ta o‘nlik",
      distractors: ["5 ta o‘nlik", "85 ta o‘nlik", "80 ta o‘nlik"],
      explanation: "85 sonida 8 ta o‘nlik va 5 ta birlik mavjud."
    },
    {
      text: "Hisoblang: 30 + 30 + 30",
      correctAnswer: "90",
      distractors: ["80", "100", "60"],
      explanation: "30 + 30 + 30 = 90."
    },
    {
      text: "Hisoblang: 90 - 50 + 10",
      correctAnswer: "50",
      distractors: ["40", "60", "30"],
      explanation: "90 - 50 = 40, 40 + 10 = 50."
    },

    // 4 ta qiyinroq
    {
      text: "Omborda 80 qop kartoshka bor edi. Ertalab 30 qop, tushdan keyin 20 qop do‘konga yuborildi. Omborda necha qop kartoshka qoldi?",
      correctAnswer: "30 qop",
      distractors: ["40 qop", "20 qop", "50 qop"],
      explanation: "30 + 20 = 50, 80 - 50 = 30 qop qoldi."
    },
    {
      text: "Tenglamani yeching: x + 30 = 70",
      correctAnswer: "40",
      distractors: ["30", "50", "100"],
      explanation: "x = 70 - 30 = 40."
    },
    {
      text: "Tenglamani yeching: 90 - y = 40",
      correctAnswer: "50",
      distractors: ["40", "60", "30"],
      explanation: "y = 90 - 40 = 50."
    },
    {
      text: "56 sonini xona qo‘shiluvchilari yig‘indisi shaklida yozing:",
      correctAnswer: "50 + 6",
      distractors: ["50 + 16", "40 + 16", "5 + 6"],
      explanation: "56 = 50 + 6."
    },

    // 2 ta murakkab masala
    {
      text: "Samarqand viloyati bog‘bonlari 40 quti olma va 30 quti nok yig‘ishdi. Shundan 50 quti meva bozorga jo‘natildi. Bog‘da necha quti meva qoldi?",
      correctAnswer: "20 quti",
      distractors: ["10 quti", "30 quti", "70 quti"],
      explanation: "Jami yig‘ilgan: 40 + 30 = 70 quti. Qolgani: 70 - 50 = 20 quti."
    },
    {
      text: "Issiqxonada pomidor va bodring yetishtirildi. Birinchi kunda 35 kg, ikkinchi kunda esa birinchisidan 15 kg ortiq hosil uzildi. Ikki kunda jami necha kg hosil olingan?",
      correctAnswer: "85 kg (35 + 50 = 85)",
      distractors: ["50 kg", "75 kg", "80 kg"],
      explanation: "Ikkinchi kunda: 35 + 15 = 50 kg. Jami: 35 + 50 = 85 kg."
    }
  ]
};

export const unit03: Grade2UnitDef = {
  order: 3,
  bookNumber: 3,
  unitType: "LESSON",
  title: "Takrorlash",
  emoji: "🌸",
  crossTopic: "Xonaki gullar",
  shortDesc: "To‘g‘ri va egri chiziqlar, nuqtalar, kesmalar va sodda tenglamalar",
  intro: "Xonaki gullar uylarimizga ko‘rk bag‘ishlaydi. Ushbu darsda geometriya asoslari — to‘g‘ri va egri chiziqlar, nuqtalar hamda sodda tenglamalarni yechishni takrorlaymiz.",
  keyPoints: [
    "To‘g‘ri chiziq cheksiz bo‘lib, chizg‘ich yordamida chiziladi.",
    "Egri chiziq to‘g‘ri emas, u to‘lqinsimon yoki aylanma bo‘lishi mumkin.",
    "Nuqtalar lotin bosh harflari bilan belgilanadi: A, B, C."
  ],
  miniExample: {
    emojis: "🌸 x - 15 = 54 -> x = 69",
    text: "Qaysi sondan 15 ni ayirsak 54 qoladi? 54 ga 15 ni qo‘shamiz: x = 69!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Tenglamani yeching: x - 15 = 54",
      correctAnswer: "69",
      distractors: ["39", "68", "70"],
      explanation: "x = 54 + 15 = 69."
    },
    {
      text: "Tenglamani yeching: 18 + z = 79",
      correctAnswer: "61",
      distractors: ["51", "62", "97"],
      explanation: "z = 79 - 18 = 61."
    },
    {
      text: "Nuqta qanday harflar bilan belgilanadi?",
      correctAnswer: "Lotin bosh harflari bilan (A, B, C)",
      distractors: ["Kichik harflar bilan", "Raqamlar bilan", "Ranglar bilan"],
      explanation: "Geometriyada nuqtalar A, B, C kabi bosh harflar bilan belgilanadi."
    }
  ],
  test: [
    // 6 ta oson
    {
      text: "Tenglamani yeching: x - 15 = 54",
      correctAnswer: "69",
      distractors: ["39", "68", "70"],
      explanation: "x = 54 + 15 = 69."
    },
    {
      text: "Tenglamani yeching: 18 + z = 79",
      correctAnswer: "61",
      distractors: ["51", "62", "97"],
      explanation: "z = 79 - 18 = 61."
    },
    {
      text: "Tenglamani yeching: 61 - b = 40",
      correctAnswer: "21",
      distractors: ["19", "20", "101"],
      explanation: "b = 61 - 40 = 21."
    },
    {
      text: "Ikki nuqta orqali nechta to‘g‘ri chiziq o‘tkazish mumkin?",
      correctAnswer: "Faqat 1 ta",
      distractors: ["2 ta", "Cheksiz ko‘p", "Umuman o‘tkazib bo‘lmaydi"],
      explanation: "Har qanday ikki nuqta orqali faqat bitta to‘g‘ri chiziq o‘tadi."
    },
    {
      text: "Chizg‘ichsiz erkin qo‘l bilan chizilgan chiziq ko‘pincha qanday chiziq bo‘ladi?",
      correctAnswer: "Egri chiziq",
      distractors: ["To‘g‘ri chiziq", "Kesma", "Nur"],
      explanation: "Chizg‘ichsiz chizilgan chiziq to‘g‘ri bo‘lmay, egri chiziq hosil qiladi."
    },
    {
      text: "Kesma to‘g‘ri chiziqdan nima bilan farq qiladi?",
      correctAnswer: "Ikki tomondan nuqtalar bilan chegaralangani bilan",
      distractors: ["Rangi bilan", "Cheksizligi bilan", "Farqi yo‘q"],
      explanation: "Kesma — ikki nuqta bilan chegaralangan to‘g‘ri chiziq bo‘lagidir."
    },

    // 8 ta o'rta
    {
      text: "Uzunliklarni hisoblang: 7 dm + 2 dm + 4 dm + 3 dm",
      correctAnswer: "16 dm",
      distractors: ["15 dm", "17 dm", "14 dm"],
      explanation: "7 + 2 + 4 + 3 = 16 dm."
    },
    {
      text: "Guldon balandligi 3 dm 4 cm. Bu necha santimetrga teng?",
      correctAnswer: "34 cm",
      distractors: ["43 cm", "30 cm", "7 cm"],
      explanation: "3 dm = 30 cm, 30 + 4 = 34 cm."
    },
    {
      text: "Tenglamani yeching: a + 24 = 65",
      correctAnswer: "41",
      distractors: ["39", "40", "89"],
      explanation: "a = 65 - 24 = 41."
    },
    {
      text: "Tenglamani yeching: 75 - x = 32",
      correctAnswer: "43",
      distractors: ["41", "42", "107"],
      explanation: "x = 75 - 32 = 43."
    },
    {
      text: "AB to‘g‘ri chiziq ustida C nuqta belgilandi. C nuqta to‘g‘ri chiziqni nechta nurga ajratadi?",
      correctAnswer: "2 ta nurga",
      distractors: ["1 ta nurga", "3 ta nurga", "4 ta nurga"],
      explanation: "Nuqta to‘g‘ri chiziqni ikki qarama-qarshi nurga ajratadi."
    },
    {
      text: "To‘g‘ri chiziqni kesib o‘tuvchi kesma u bilan nechta umumiy nuqtaga ega bo‘ladi?",
      correctAnswer: "1 ta umumiy nuqtaga",
      distractors: ["2 ta", "Cheksiz ko‘p", "0 ta"],
      explanation: "Kesishuvchi ikkita chiziq faqat bitta umumiy nuqtada kesishadi."
    },
    {
      text: "Hisoblang: 14 dm + 6 dm - 8 dm",
      correctAnswer: "12 dm",
      distractors: ["10 dm", "11 dm", "13 dm"],
      explanation: "14 + 6 = 20, 20 - 8 = 12 dm."
    },
    {
      text: "Derazada 15 tuvak binafsha va 12 tuvak fikus guli bor edi. Yana 5 tuvak atirgul qo‘yildi. Jami gullar nechta bo‘ldi?",
      correctAnswer: "32 tuvak",
      distractors: ["30 tuvak", "31 tuvak", "27 tuvak"],
      explanation: "15 + 12 = 27, 27 + 5 = 32 tuvak."
    },

    // 4 ta qiyinroq
    {
      text: "Tenglamani yeching: y - 27 = 43",
      correctAnswer: "70",
      distractors: ["16", "60", "69"],
      explanation: "y = 43 + 27 = 70."
    },
    {
      text: "Gulzorda 48 ta oq atirgul va undan 16 ta kam qizil atirgul ochildi. Gulzorda nechta qizil atirgul ochilgan?",
      correctAnswer: "32 ta",
      distractors: ["30 ta", "34 ta", "64 ta"],
      explanation: "48 - 16 = 32 ta."
    },
    {
      text: "Gulzorda jami nechta atirgul ochilgan (oldingi masala shartiga ko‘ra)?",
      correctAnswer: "80 ta (48 + 32 = 80)",
      distractors: ["70 ta", "78 ta", "82 ta"],
      explanation: "48 + 32 = 80 ta atirgul."
    },
    {
      text: "Nuqta to‘g‘ri chiziqda yotadimi yoki yo‘qligini qanday bilamiz?",
      correctAnswer: "Nuqta chiziqning ustida joylashgan bo‘lsa yotadi, chetda bo‘lsa yotmaydi",
      distractors: ["Doim yotadi", "Faqat qizil bo‘lsa yotadi", "Nuqta chiziqdan kattaroq bo‘lishi kerak"],
      explanation: "Agar nuqta chiziq ustiga to‘g‘ri kelsa, u chiziqda yotadi deyiladi."
    },

    // 2 ta murakkab masala
    {
      text: "Gulzordagi atirgul ko‘chatlari soni noma’lum edi. Bog‘bon yana 18 tup ko‘chat o‘tqazgach, jami 60 tup bo‘ldi. Gulzorda avval nechta atirgul ko‘chati bo‘lgan?",
      correctAnswer: "42 tup (x + 18 = 60)",
      distractors: ["40 tup", "44 tup", "78 tup"],
      explanation: "x + 18 = 60 -> x = 60 - 18 = 42 tup."
    },
    {
      text: "Gulchi ayol ertalab 45 ta guldasta yasadi. Tushlikkacha bir nechta guldasta sotilgach, 19 ta guldasta qoldi. Nechta guldasta sotilgan?",
      correctAnswer: "26 ta (45 - x = 19)",
      distractors: ["24 ta", "25 ta", "64 ta"],
      explanation: "45 - x = 19 -> x = 45 - 19 = 26 ta."
    }
  ]
};

export const unit04: Grade2UnitDef = {
  order: 4,
  bookNumber: 4,
  unitType: "LESSON",
  title: "Takrorlash",
  emoji: "🐇",
  crossTopic: "Uy hayvonlari",
  shortDesc: "Perimetr, to‘g‘ri to‘rtburchak va siniq chiziq uzunligini hisoblash",
  intro: "Qishloqda uy hayvonlari — quyonlar, tovuqlar, sigirlar boqiladi. Hayvonlar uchun katak va maydonchalar to‘g‘ri to‘rtburchak shaklida yasaladi. Ushbu darsda shakllarning perimetrini hisoblashni takrorlaymiz.",
  keyPoints: [
    "Perimetr — ko‘pburchak barcha tomonlari uzunliklarining yig‘indisi.",
    "To‘g‘ri to‘rtburchak perimetri: P = (a + b) + (a + b) yoki 2 × (a + b).",
    "Siniq chiziq uzunligi uning barcha bo‘g‘inlari yig‘indisiga teng."
  ],
  miniExample: {
    emojis: "🐇 P = 4 + 6 + 4 + 6 = 20 dm",
    text: "Quyon qafasining bo‘yi 6 dm, eni 4 dm. Perimetri: 4 + 6 + 4 + 6 = 20 dm!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Bo‘yi 6 dm, eni 4 dm bo‘lgan to‘g‘ri to‘rtburchak perimetrini hisoblang:",
      correctAnswer: "20 dm",
      distractors: ["10 dm", "24 dm", "18 dm"],
      explanation: "6 + 4 + 6 + 4 = 20 dm."
    },
    {
      text: "Siniq chiziq bo‘g‘inlari 3 cm, 5 cm va 4 cm. Uning uzunligi qancha?",
      correctAnswer: "12 cm",
      distractors: ["11 cm", "13 cm", "10 cm"],
      explanation: "3 + 5 + 4 = 12 cm."
    },
    {
      text: "Hisoblamay taqqoslang: 45 + 12 ... 45 + 18",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "Birinchi qo‘shiluvchilar bir xil (45), 12 soni 18 dan kichik, demak yig‘indi kichik: <."
    }
  ],
  test: [
    // 6 ta oson
    {
      text: "Tomonlari 4 dm va 6 dm bo‘lgan to‘g‘ri to‘rtburchak perimetrini toping:",
      correctAnswer: "20 dm",
      distractors: ["10 dm", "24 dm", "18 dm"],
      explanation: "4 + 6 + 4 + 6 = 20 dm."
    },
    {
      text: "3 ta bo‘g‘indan iborat siniq chiziq bo‘g‘inlari: 5 cm, 7 cm, 3 cm. Siniq chiziq uzunligi nechaga teng?",
      correctAnswer: "15 cm",
      distractors: ["14 cm", "16 cm", "12 cm"],
      explanation: "5 + 7 + 3 = 15 cm."
    },
    {
      text: "Hisoblamay taqqoslang: 38 + 14 ... 38 + 19",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "38 bir xil, 14 < 19 bo‘lgani uchun 38 + 14 < 38 + 19."
    },
    {
      text: "Hisoblamay taqqoslang: 70 - 15 ... 70 - 25",
      correctAnswer: ">",
      distractors: ["<", "=", "-"],
      explanation: "Kamroq son ayirilsa, natija kattaroq qoladi: 70 - 15 > 70 - 25."
    },
    {
      text: "Tomoni 5 cm bo‘lgan kvadratning perimetrini hisoblang:",
      correctAnswer: "20 cm",
      distractors: ["15 cm", "25 cm", "10 cm"],
      explanation: "5 + 5 + 5 + 5 = 20 cm."
    },
    {
      text: "Teng tomonli uchburchakning tomoni 6 cm. Uning perimetri nechaga teng?",
      correctAnswer: "18 cm",
      distractors: ["12 cm", "16 cm", "24 cm"],
      explanation: "6 + 6 + 6 = 18 cm."
    },

    // 8 ta o'rta
    {
      text: "Hovlida tovuqlar boqiladi: 4 ta jigarrang, 2 ta oq, 3 ta qora va 5 ta kulrang tovuq bor. Hovlida jami nechta tovuq bor?",
      correctAnswer: "14 ta tovuq",
      distractors: ["13 ta", "15 ta", "12 ta"],
      explanation: "4 + 2 + 3 + 5 = 14 ta tovuq."
    },
    {
      text: "Oq va qora tovuqlar birgalikda kulrang tovuqlardan nechtaga kam (oldingi masala ma’lumotlariga ko‘ra)?",
      correctAnswer: "Teng (oq+qora = 5 ta, kulrang = 5 ta)",
      distractors: ["1 taga kam", "2 taga ko‘p", "3 taga kam"],
      explanation: "Oq va qora: 2 + 3 = 5 ta. Kulrang ham 5 ta, demak ular teng."
    },
    {
      text: "Bir qop yem 30 kg, ikkinchi qop undan 10 kg kam. Ikkinchi qopda necha kg yem bor?",
      correctAnswer: "20 kg",
      distractors: ["40 kg", "25 kg", "15 kg"],
      explanation: "30 - 10 = 20 kg."
    },
    {
      text: "Ikkala qopda birgalikda necha kg yem bor (oldingi masala bo‘yicha)?",
      correctAnswer: "50 kg",
      distractors: ["40 kg", "60 kg", "45 kg"],
      explanation: "30 + 20 = 50 kg."
    },
    {
      text: "To‘g‘ri to‘rtburchak perimetri 24 cm. Uzunligi 8 cm bo‘lsa, eni necha cm?",
      correctAnswer: "4 cm",
      distractors: ["3 cm", "5 cm", "6 cm"],
      explanation: "8 + 8 = 16 cm; 24 - 16 = 8 cm; 8 / 2 = 4 cm (4 + 8 + 4 + 8 = 24)."
    },
    {
      text: "Siniq chiziq 4 ta teng bo‘g‘indan iborat. Har bir bo‘g‘in 6 cm. Siniq chiziq uzunligi qancha?",
      correctAnswer: "24 cm",
      distractors: ["20 cm", "22 cm", "18 cm"],
      explanation: "6 + 6 + 6 + 6 = 24 cm."
    },
    {
      text: "Kvadrat maydonchaning perimetri 36 metr. Uning bitta tomoni necha metr?",
      correctAnswer: "9 metr",
      distractors: ["8 metr", "10 metr", "12 metr"],
      explanation: "4 ta teng tomon yig‘indisi 36 bo‘lsa: 9 + 9 + 9 + 9 = 36 metr."
    },
    {
      text: "Jadvalda a = 14 bo‘lsa, a + 15 ifodaning qiymati nechaga teng?",
      correctAnswer: "29",
      distractors: ["28", "30", "31"],
      explanation: "14 + 15 = 29."
    },

    // 4 ta qiyinroq
    {
      text: "To‘g‘ri to‘rtburchakning bo‘yi 15 cm, eni esa bo‘yidan 5 cm qisqa. To‘rtburchak perimetrini hisoblang:",
      correctAnswer: "50 cm",
      distractors: ["40 cm", "45 cm", "55 cm"],
      explanation: "Eni: 15 - 5 = 10 cm. Perimetri: 15 + 10 + 15 + 10 = 50 cm."
    },
    {
      text: "Quyon katagi to‘g‘ri to‘rtburchak shaklida: bo‘yi 8 dm, eni 5 dm. Uning atrofiga to‘r tortish uchun necha metr to‘r kerak? (10 dm = 1 m)",
      correctAnswer: "26 dm (2 metr 6 dm)",
      distractors: ["24 dm", "30 dm", "13 dm"],
      explanation: "8 + 5 + 8 + 5 = 26 dm."
    },
    {
      text: "Hisoblamay taqqoslang: 64 - a ... 58 - a (bu yerda a bir xil son)",
      correctAnswer: ">",
      distractors: ["<", "=", "+"],
      explanation: "Kattaroq sondan (64 > 58) bir xil a ayrilsa, natija kattaroq bo‘ladi: >."
    },
    {
      text: "Uchburchakning birinchi tomoni 8 cm, ikkinchi tomoni 6 cm, uchinchi tomoni 7 cm. Uchburchak perimetrini toping:",
      correctAnswer: "21 cm",
      distractors: ["20 cm", "22 cm", "19 cm"],
      explanation: "8 + 6 + 7 = 21 cm."
    },

    // 2 ta murakkab masala
    {
      text: "Fermadagi qo‘yxonaning bo‘yi 12 metr, eni 8 metr bo‘lgan to‘g‘ri to‘rtburchak shaklida. Uning atrofini panjara bilan o‘rashmoqchi. Eshik uchun 2 metr joy ochiq qoldirilsa, necha metr panjara kerak bo‘ladi?",
      correctAnswer: "38 metr",
      distractors: ["40 metr", "36 metr", "39 metr"],
      explanation: "Umumiy perimetr: 12 + 8 + 12 + 8 = 40 metr. Eshik ayirilsa: 40 - 2 = 38 metr panjara."
    },
    {
      text: "Quruvchi bolalar maydonchasi uchun siniq chiziq shaklida chiroyli yo‘lka chizdi: birinchi bo‘lagi 14 m, ikkinchi bo‘lagi birinchisidan 4 m qisqa, uchinchi bo‘lagi esa 8 m. Yo‘lkaning umumiy uzunligi necha metr?",
      correctAnswer: "32 metr",
      distractors: ["30 metr", "34 metr", "36 metr"],
      explanation: "Ikkinchi bo‘lak: 14 - 4 = 10 m. Jami uzunlik: 14 + 10 + 8 = 32 metr."
    }
  ]
};

export const unit05: Grade2UnitDef = {
  order: 5,
  bookNumber: 5,
  unitType: "LESSON",
  title: "Takrorlash",
  emoji: "🐄",
  crossTopic: "Uy hayvonlari",
  shortDesc: "Sonli va harfiy ifodalar, ularning qiymatini hisoblash",
  intro: "Uy hayvonlarining soni va ulardan olinadigan mahsulotlarni ifodalar orqali yozish juda qulay. Ushbu darsda a + b va a - b ko‘rinishidagi harfiy ifodalarni takrorlaymiz.",
  keyPoints: [
    "a + b ifodasi ikki miqdorning yig‘indisini, a - b esa ularning ayirmasini bildiradi.",
    "Agar harf o‘rniga son berilsa, harf o‘rniga o‘sha son qo‘yilib, ifoda qiymati topiladi.",
    "Harfiy ifoda yordamida umumiy matematik qoidalar yoziladi."
  ],
  miniExample: {
    emojis: "🐄 a = 15 bo‘lsa, a + 10 = 25",
    text: "Ertalab a ta chelak sut sog‘ildi. Agar a = 15 bo‘lsa, a + 10 = 15 + 10 = 25 chelak!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Agar a = 12 bo‘lsa, a + 7 ifodaning qiymatini toping:",
      correctAnswer: "19",
      distractors: ["18", "20", "17"],
      explanation: "12 + 7 = 19."
    },
    {
      text: "Agar x = 20 bo‘lsa, x - 8 ifodaning qiymati nechaga teng?",
      correctAnswer: "12",
      distractors: ["11", "13", "28"],
      explanation: "20 - 8 = 12."
    },
    {
      text: "'x va 19 ning yig‘indisi' qanday yoziladi?",
      correctAnswer: "x + 19",
      distractors: ["x - 19", "19 - x", "x = 19"],
      explanation: "Yig‘indi qo‘shish amali bilan yoziladi: x + 19."
    }
  ],
  test: [
    // 6 ta oson
    {
      text: "a + b ifodasi nimani bildiradi?",
      correctAnswer: "a va b sonlarining yig‘indisini",
      distractors: ["a va b ning ayirmasini", "a va b ning tengligini", "Faqat a sonini"],
      explanation: "Qo‘shish belgisi bo‘lgani uchun a + b yig‘indini bildiradi."
    },
    {
      text: "a - b ifodasi nimani bildiradi?",
      correctAnswer: "a va b sonlarining ayirmasini",
      distractors: ["Yig‘indisini", "Taqqoslanishini", "Birligini"],
      explanation: "Ayirish amali qatnashgan ifoda ayirma deyiladi."
    },
    {
      text: "'27 va m sonlarining ayirmasi' qanday yoziladi?",
      correctAnswer: "27 - m",
      distractors: ["27 + m", "m - 27", "27 = m"],
      explanation: "27 dan m ayriladi: 27 - m."
    },
    {
      text: "Agar a = 16 bo‘lsa, b = a - 7 ifodasida b nimaga teng?",
      correctAnswer: "9",
      distractors: ["8", "10", "23"],
      explanation: "b = 16 - 7 = 9."
    },
    {
      text: "Agar x = 25 bo‘lsa, x + 5 ifodaning qiymatini toping:",
      correctAnswer: "30",
      distractors: ["20", "35", "29"],
      explanation: "25 + 5 = 30."
    },
    {
      text: "Sonlar nurida a = 40 nuqtadan 15 qadam o‘ngga yursak, qaysi nuqtaga yetamiz?",
      correctAnswer: "55 ga (40 + 15)",
      distractors: ["25 ga", "50 ga", "60 ga"],
      explanation: "O‘ngga yurish qo‘shish demakdir: 40 + 15 = 55."
    },

    // 8 ta o'rta
    {
      text: "Tovuqxona tokchasida 43 ta tuxum bor edi. Ikkinchi tokchada undan 2 ta ko‘p tuxum bor. Ikkinchi tokchadagi tuxumlar sonini bildiruvchi ifoda qaysi?",
      correctAnswer: "43 + 2",
      distractors: ["43 - 2", "43 + 20", "43 = 2"],
      explanation: "2 ta ko‘p bo‘lsa, qo‘shiladi: 43 + 2."
    },
    {
      text: "Bu ifodaning qiymati nechaga teng (43 + 2)?",
      correctAnswer: "45",
      distractors: ["41", "44", "46"],
      explanation: "43 + 2 = 45 ta tuxum."
    },
    {
      text: "Agar c = 34 bo‘lsa, c - 14 ifodaning natijasini hisoblang:",
      correctAnswer: "20",
      distractors: ["18", "22", "48"],
      explanation: "34 - 14 = 20."
    },
    {
      text: "Agar k = 50 bo‘lsa, 80 - k ifodaning qiymati qancha bo‘ladi?",
      correctAnswer: "30",
      distractors: ["20", "40", "130"],
      explanation: "80 - 50 = 30."
    },
    {
      text: "Jadvalda m = 18 bo‘lsa, 40 - m ifodaning qiymatini toping:",
      correctAnswer: "22",
      distractors: ["21", "23", "58"],
      explanation: "40 - 18 = 22."
    },
    {
      text: "Fermer ertalab a litr, kechqurun b litr sut sog‘di. Kun davomida jami necha litr sut sog‘ilganini qaysi ifoda ko‘rsatadi?",
      correctAnswer: "a + b",
      distractors: ["a - b", "b - a", "a + 10"],
      explanation: "Jami sut miqdori: a + b."
    },
    {
      text: "Agar a = 35 va b = 25 bo‘lsa, a + b necha litr bo‘ladi?",
      correctAnswer: "60 litr",
      distractors: ["50 litr", "55 litr", "10 litr"],
      explanation: "35 + 25 = 60 litr."
    },
    {
      text: "Agar n = 7 bo‘lsa, (n + 8) + 10 ifodaning qiymatini hisoblang:",
      correctAnswer: "25",
      distractors: ["24", "26", "23"],
      explanation: "7 + 8 = 15, 15 + 10 = 25."
    },

    // 4 ta qiyinroq
    {
      text: "Sonlar nurida x nuqta 30 va 50 ning qoq o‘rtasida joylashgan. x soni nechaga teng?",
      correctAnswer: "40",
      distractors: ["35", "45", "38"],
      explanation: "30 va 50 o‘rtasidagi son: (30 + 50) / 2 = 40."
    },
    {
      text: "Agar y = 14 bo‘lsa, 50 - (y + 6) ifodaning qiymatini toping:",
      correctAnswer: "30",
      distractors: ["28", "32", "42"],
      explanation: "y + 6 = 14 + 6 = 20. 50 - 20 = 30."
    },
    {
      text: "Savatda x ta olma bor edi. Undan 8 tasi olindi va 5 tasi qo‘shildi. Savatdagi olmalar soni qanday o‘zgardi?",
      correctAnswer: "3 taga kamaydi (x - 3)",
      distractors: ["3 taga ko‘paydi", "13 taga kamaydi", "O‘zgarmadi"],
      explanation: "-8 + 5 = -3, demak 3 taga kamaydi."
    },
    {
      text: "Quyidagi ifodalardan qaysi biri harfiy ifoda hisoblanadi?",
      correctAnswer: "18 + d",
      distractors: ["18 + 12", "45 - 20", "30 + 40 = 70"],
      explanation: "18 + d ifodasida 'd' harfi qatnashgan."
    },

    // 2 ta murakkab masala
    {
      text: "Molxonada 28 ta sigir va buzoq bor edi. Agar sigirlar soni a ta bo‘lsa, buzoqlar sonini topish uchun qaysi ifoda tuziladi va a = 16 bo‘lganda buzoqlar nechta?",
      correctAnswer: "28 - a ifodasi; 12 ta buzoq",
      distractors: ["28 + a ifodasi; 44 ta buzoq", "a - 28 ifodasi; 12 ta", "28 - a ifodasi; 14 ta"],
      explanation: "Buzoqlar: 28 - a. Agar a = 16 bo‘lsa: 28 - 16 = 12 ta."
    },
    {
      text: "Parrandachilik fermasida dushanba kuni x dona, seshanba kuni esa undan 15 dona ko‘p tuxum olindi. Agar dushanba kuni x = 40 dona tuxum olingan bo‘lsa, ikki kunda jami nechta tuxum olingan?",
      correctAnswer: "95 dona (40 + 55 = 95)",
      distractors: ["85 dona", "90 dona", "55 dona"],
      explanation: "Seshanba kuni: 40 + 15 = 55 dona. Jami: 40 + 55 = 95 dona."
    }
  ]
};

export const unit06: Grade2UnitDef = {
  order: 6,
  bookNumber: 6,
  unitType: "LESSON",
  title: "Takrorlash",
  emoji: "🦁",
  crossTopic: "Yovvoyi hayvonlar",
  shortDesc: "Tenglamalar, tenglamaning yechimi va geometrik xossalar",
  intro: "Yovvoyi tabiatda hayvonlar o‘z hududlariga ega. Ushbu darsda noma’lum sonni topish — tenglamalarni yechish va to‘rtburchaklar geometriyasini takrorlaymiz.",
  keyPoints: [
    "Tenglama — noma’lum son qatnashgan tenglikdir.",
    "Noma’lum qo‘shiluvchini topish uchun yig‘indidan ma’lum qo‘shiluvchi ayriladi.",
    "Noma’lum kamayuvchini topish uchun ayirmaga ayriluvchi qo‘shiladi."
  ],
  miniExample: {
    emojis: "🦁 x + 14 = 30 -> x = 16",
    text: "x ni topish uchun 30 dan 14 ni ayiramiz: x = 30 - 14 = 16!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "Tenglamani yeching: x + 14 = 30",
      correctAnswer: "16",
      distractors: ["14", "15", "44"],
      explanation: "x = 30 - 14 = 16."
    },
    {
      text: "Tenglamani yeching: 25 - y = 10",
      correctAnswer: "15",
      distractors: ["14", "16", "35"],
      explanation: "y = 25 - 10 = 15."
    },
    {
      text: "Noma’lum son qatnashgan tenglik nima deyiladi?",
      correctAnswer: "Tenglama",
      distractors: ["Ifoda", "Kesma", "Perimetr"],
      explanation: "Noma’lum sonli tenglik tenglama deyiladi."
    }
  ],
  test: [
    // 6 ta oson
    {
      text: "Tenglamani yeching: x + 12 = 28",
      correctAnswer: "16",
      distractors: ["15", "17", "40"],
      explanation: "x = 28 - 12 = 16."
    },
    {
      text: "Tenglamani yeching: a - 8 = 22",
      correctAnswer: "30",
      distractors: ["14", "29", "31"],
      explanation: "a = 22 + 8 = 30."
    },
    {
      text: "Tenglamani yeching: 40 - b = 15",
      correctAnswer: "25",
      distractors: ["24", "26", "55"],
      explanation: "b = 40 - 15 = 25."
    },
    {
      text: "Tenglamada noma’lum qo‘shiluvchini topish uchun qaysi amal bajariladi?",
      correctAnswer: "Ayirish amali (yig‘indidan ma’lum qo‘shiluvchi ayriladi)",
      distractors: ["Qo‘shish amali", "Ko‘paytirish amali", "Bo‘lish amali"],
      explanation: "Noma’lum qo‘shiluvchini topish uchun yig‘indidan ma’lum qo‘shiluvchi ayriladi."
    },
    {
      text: "Tenglamada noma’lum kamayuvchini topish uchun nima qilinadi?",
      correctAnswer: "Ayirmaga ayriluvchi qo‘shiladi",
      distractors: ["Ayirmadan ayriluvchi ayriladi", "Sonlar ayiriladi", "Amal o‘zgarmaydi"],
      explanation: "x - a = b bo‘lsa, kamayuvchi x = b + a bo‘ladi."
    },
    {
      text: "Sonlar nurida 10 lab sanang: 20, 30, 40, ? Keyingi son qaysi?",
      correctAnswer: "50",
      distractors: ["45", "60", "55"],
      explanation: "Har safar 10 qo‘shilmoqda: 40 + 10 = 50."
    },

    // 8 ta o'rta
    {
      text: "To‘g‘ri to‘rtburchakning perimetri 14 cm. Uning qarama-qarshi ikkita tomoni yig‘indisi 10 cm bo‘lsa, qolgan ikkita tomoni yig‘indisi necha cm?",
      correctAnswer: "4 cm (14 - 10 = 4)",
      distractors: ["5 cm", "6 cm", "8 cm"],
      explanation: "14 - 10 = 4 cm."
    },
    {
      text: "Bu to‘g‘ri to‘rtburchakning eni necha santimetrga teng (ikkita enining yig‘indisi 4 cm bo‘lsa)?",
      correctAnswer: "2 cm",
      distractors: ["1 cm", "3 cm", "4 cm"],
      explanation: "Eni: 4 / 2 = 2 cm."
    },
    {
      text: "Tenglamani yeching: 50 + x = 85",
      correctAnswer: "35",
      distractors: ["34", "36", "135"],
      explanation: "x = 85 - 50 = 35."
    },
    {
      text: "Tenglamani yeching: y - 24 = 36",
      correctAnswer: "60",
      distractors: ["12", "58", "62"],
      explanation: "y = 36 + 24 = 60."
    },
    {
      text: "Jadvaldan tenglama tuzing: 'Bir son bilan 17 ning yig‘indisi 40 ga teng'. Tenglamani yozing:",
      correctAnswer: "x + 17 = 40",
      distractors: ["x - 17 = 40", "17 - x = 40", "x + 40 = 17"],
      explanation: "Noma’lum son x va 17 yig‘indisi: x + 17 = 40."
    },
    {
      text: "Bu tenglamaning yechimi nechaga teng (x + 17 = 40)?",
      correctAnswer: "23",
      distractors: ["22", "24", "57"],
      explanation: "x = 40 - 17 = 23."
    },
    {
      text: "Tenglamani yeching: 70 - m = 28",
      correctAnswer: "42",
      distractors: ["41", "43", "52"],
      explanation: "m = 70 - 28 = 42."
    },
    {
      text: "Qo‘riqxonada 18 ta bug‘u bor edi. Yana bir nechta bug‘u keltirilgach, ularning soni 30 ta bo‘ldi. Nechta bug‘u keltirilgan?",
      correctAnswer: "12 ta bug‘u (18 + x = 30)",
      distractors: ["10 ta", "14 ta", "48 ta"],
      explanation: "x = 30 - 18 = 12 ta bug‘u."
    },

    // 4 ta qiyinroq
    {
      text: "Tenglamani yeching: k + 35 = 70",
      correctAnswer: "35",
      distractors: ["30", "40", "105"],
      explanation: "k = 70 - 35 = 35."
    },
    {
      text: "Tenglamani yeching: 92 - x = 50",
      correctAnswer: "42",
      distractors: ["40", "44", "142"],
      explanation: "x = 92 - 50 = 42."
    },
    {
      text: "Agar x = 15 bo‘lsa, qaysi tenglama to‘g‘ri tenglikka aylanadi?",
      correctAnswer: "x + 20 = 35",
      distractors: ["x - 5 = 12", "30 - x = 10", "x + 10 = 20"],
      explanation: "15 + 20 = 35 to‘g‘ri."
    },
    {
      text: "To‘g‘ri to‘rtburchak perimetri 18 cm, tomonlaridan biri 6 cm. Ikkinchi tomoni necha cm?",
      correctAnswer: "3 cm (6 + 3 + 6 + 3 = 18)",
      distractors: ["4 cm", "5 cm", "2 cm"],
      explanation: "6 + 6 = 12 cm, 18 - 12 = 6 cm, 6 / 2 = 3 cm."
    },

    // 2 ta murakkab masala
    {
      text: "Zarafshon milliy bog‘ida jayronlar ro‘yxatga olindi. Birinchi to‘dada 24 ta, ikkinchi to‘dada birinchisidan noma’lum x ta kam jayron bor. Agar ikkala to‘dada jami 40 ta jayron bo‘lsa, ikkinchi to‘dada nechta jayron bor?",
      correctAnswer: "16 ta (24 + 16 = 40)",
      distractors: ["14 ta", "18 ta", "20 ta"],
      explanation: "Ikkinchi to‘da: 40 - 24 = 16 ta jayron."
    },
    {
      text: "Hayvonot bog‘idagi ayiqlarga qish mavsumi uchun 80 kg asal ajratildi. Birinchi oyda bir nechta kg, ikkinchi oyda 25 kg asal berilgach, 20 kg asal qoldi. Birinchi oyda necha kg asal berilgan?",
      correctAnswer: "35 kg (80 - x - 25 = 20)",
      distractors: ["30 kg", "40 kg", "45 kg"],
      explanation: "Ishlatilgan asal: 80 - 20 = 60 kg. Birinchi oy: 60 - 25 = 35 kg."
    }
  ]
};

export const unit07: Grade2UnitDef = {
  order: 7,
  bookNumber: 7,
  unitType: "LESSON",
  title: "Takrorlash",
  emoji: "🌿",
  crossTopic: "O‘simliklar",
  shortDesc: "O‘zaro teskari masalalar, xona qo‘shiluvchilari va mantiqiy misollar",
  intro: "O‘simliklar dunyosi xilma-xil va qiziqarli. Ushbu darsda o‘zaro teskari masalalarni tuzish, xona qo‘shiluvchilariga ajratish va mantiqiy bog‘lanishlarni takrorlaymiz.",
  keyPoints: [
    "Berilgan masaladagi ma’lum va noma’lumlarning o‘rni almashsa, teskari masala hosil bo‘ladi.",
    "Har qanday ikki xonali son o‘nlik va birliklar yig‘indisidir: 24 = 20 + 4.",
    "Teng tomonli uchburchakning barcha tomonlari teng bo‘ladi."
  ],
  miniExample: {
    emojis: "🌿 24 = 20 + 4 | P = 4 + 4 + 4 = 12 cm",
    text: "Teng tomonli uchburchakning tomoni 4 cm bo‘lsa, uning perimetri 12 cm: 4 + 4 + 4 = 12 cm!"
  },
  xpReward: 90,
  coinReward: 10,
  estMinutes: 7,
  practice: [
    {
      text: "24 sonini xona qo‘shiluvchilari yig‘indisi ko‘rinishida yozing:",
      correctAnswer: "20 + 4",
      distractors: ["10 + 14", "22 + 2", "20 + 14"],
      explanation: "24 = 20 + 4."
    },
    {
      text: "Teng tomonli uchburchakning tomoni 4 cm. Uning perimetri qancha?",
      correctAnswer: "12 cm",
      distractors: ["8 cm", "16 cm", "10 cm"],
      explanation: "4 + 4 + 4 = 12 cm."
    },
    {
      text: "Agar tomoni 4 cm bo‘lgan uchburchak tomoni 2 cm ga kamaysa, perimetri necha cm ga kamayadi?",
      correctAnswer: "6 cm ga (2 + 2 + 2 = 6)",
      distractors: ["2 cm ga", "4 cm ga", "8 cm ga"],
      explanation: "3 ta tomonning har biri 2 cm ga kamaysa, perimetr 2 × 3 = 6 cm ga kamayadi."
    }
  ],
  test: [
    // 6 ta oson
    {
      text: "24 sonini xona qo‘shiluvchilari yig‘indisiga ajrating:",
      correctAnswer: "20 + 4",
      distractors: ["20 + 14", "10 + 14", "22 + 2"],
      explanation: "24 = 20 + 4."
    },
    {
      text: "67 sonining xona qo‘shiluvchilari qaysilar?",
      correctAnswer: "60 va 7",
      distractors: ["50 va 17", "60 va 17", "6 va 7"],
      explanation: "67 = 60 + 7."
    },
    {
      text: "Teng tomonli uchburchakning tomoni 4 cm bo‘lsa, perimetri nechaga teng?",
      correctAnswer: "12 cm",
      distractors: ["10 cm", "14 cm", "16 cm"],
      explanation: "4 + 4 + 4 = 12 cm."
    },
    {
      text: "Ushbu uchburchak tomoni 2 cm ga kamaytirilsa, yangi perimetr necha cm bo‘ladi?",
      correctAnswer: "6 cm (2 + 2 + 2 = 6)",
      distractors: ["8 cm", "4 cm", "10 cm"],
      explanation: "Yangi tomon: 4 - 2 = 2 cm. Yangi perimetr: 2 + 2 + 2 = 6 cm."
    },
    {
      text: "Shunda perimetr necha santimetrga kamaydi?",
      correctAnswer: "6 cm ga (12 - 6 = 6)",
      distractors: ["4 cm ga", "2 cm ga", "8 cm ga"],
      explanation: "12 - 6 = 6 cm ga kamaydi."
    },
    {
      text: "2, 5, 7 sonlaridan qaysi to‘g‘ri tenglikni tuzish mumkin?",
      correctAnswer: "2 + 5 = 7",
      distractors: ["2 + 7 = 5", "5 - 2 = 7", "7 + 2 = 5"],
      explanation: "2 + 5 = 7 to‘g‘ri arifmetik tenglik."
    },

    // 8 ta o'rta
    {
      text: "Teskari masala nima?",
      correctAnswer: "Boshlang‘ich masaladagi ma’lum va noma’lumlar o‘rni almashgan masala",
      distractors: ["Yechimi yo‘q masala", "Faqat ayirish amali qatnashgan masala", "Noto‘g‘ri tuzilgan masala"],
      explanation: "Boshlang‘ich masalaning javobi ma’lumga, berilgan sonlardan biri noma’lumga aylansa, teskari masala bo‘ladi."
    },
    {
      text: "Masala: 'Bog‘da 15 ta olma daraxti va 10 ta nok daraxti bor. Jami nechta daraxt bor? (25 ta)'. Ushbu masalaga qaysi biri teskari masala bo‘ladi?",
      correctAnswer: "Bog‘da 25 ta daraxt bor. Shundan 15 tasi olma bo‘lsa, noklar nechta?",
      distractors: [
        "Bog‘da 15 ta olma va 20 ta nok bor",
        "Olma daraxtlari nokdan nechtaga ko‘p?",
        "Bog‘da jami necha xil daraxt bor?"
      ],
      explanation: "Jami (25) ma’lum qilinib, nok daraxtlari soni so‘ralsa, bu teskari masaladir."
    },
    {
      text: "Teng tomonli uchburchakning perimetri 15 cm. Bitta tomoni uzunligini toping:",
      correctAnswer: "5 cm",
      distractors: ["4 cm", "6 cm", "3 cm"],
      explanation: "5 + 5 + 5 = 15 cm, demak tomoni 5 cm."
    },
    {
      text: "7, 7, 14 sonlaridan qaysi to‘g‘ri tenglik hosil bo‘ladi?",
      correctAnswer: "7 + 7 = 14",
      distractors: ["14 + 7 = 7", "7 - 7 = 14", "14 - 0 = 7"],
      explanation: "7 + 7 = 14."
    },
    {
      text: "83 sonini xona qo‘shiluvchilariga ajrating:",
      correctAnswer: "80 + 3",
      distractors: ["70 + 13", "80 + 13", "8 + 3"],
      explanation: "83 = 80 + 3."
    },
    {
      text: "Jadvaldagi bo‘sh katakni to‘ldiring: qo‘shiluvchi 30, yig‘indi 48. Ikkinchi qo‘shiluvchi nechaga teng?",
      correctAnswer: "18",
      distractors: ["16", "17", "19"],
      explanation: "48 - 30 = 18."
    },
    {
      text: "Dala chetida 14 tup terak va 16 tup chinor ekilgan. Dala chetida jami nechta daraxt bor?",
      correctAnswer: "30 tup",
      distractors: ["28 tup", "32 tup", "20 tup"],
      explanation: "14 + 16 = 30 tup."
    },
    {
      text: "Ushbu masalaga teskari masala tuzing va uning javobini toping:",
      correctAnswer: "Jami 30 tup daraxtdan 14 tasi terak, chinorlar 16 tup",
      distractors: [
        "Jami 40 tup daraxt ekildi",
        "Teraklar chinorlardan 5 taga kam",
        "Daraxtlar soni noma’lum"
      ],
      explanation: "30 - 14 = 16 tup chinor — to‘g‘ri teskari masala."
    },

    // 4 ta qiyinroq
    {
      text: "Teng tomonli uchburchakning tomoni 8 cm. Agar har bir tomoni 3 cm ga uzaytirilsa, perimetr qanchaga ortadi?",
      correctAnswer: "9 cm ga (3 + 3 + 3 = 9)",
      distractors: ["3 cm ga", "6 cm ga", "8 cm ga"],
      explanation: "Har biri 3 cm ga oshsa: 3 × 3 = 9 cm ga ortadi."
    },
    {
      text: "95 sonida nechta o‘nlik va nechta birlik bor?",
      correctAnswer: "9 ta o‘nlik va 5 ta birlik",
      distractors: ["5 ta o‘nlik va 9 ta birlik", "95 ta birlik", "9 ta birlik"],
      explanation: "95 = 9 o‘nlik va 5 birlik."
    },
    {
      text: "Hisoblang: (30 + 20) - (15 + 15)",
      correctAnswer: "20",
      distractors: ["10", "30", "0"],
      explanation: "50 - 30 = 20."
    },
    {
      text: "2, 5, 7 sonlari yordamida ikkita qo‘shish va ikkita ayirish amalini tuzish mumkinmi?",
      correctAnswer: "Ha: 2+5=7, 5+2=7, 7-2=5, 7-5=2",
      distractors: ["Yo‘q, faqat 1 ta", "Faqat ayirish mumkin", "Iloji yo‘q"],
      explanation: "Uchta o‘zaro bog‘liq sondan 4 ta tenglik tuziladi."
    },

    // 2 ta murakkab masala
    {
      text: "Maktab tajriba maydonchasida 35 tup pomidor va 25 tup qalampir ko‘chati o‘stirildi. O‘quvchilar ushbu maydonchaga jami necha tup ko‘chat ekishgan va bunga teskari masalada qalampirlar soni qanday topiladi?",
      correctAnswer: "Jami 60 tup; Teskari masalada: 60 - 35 = 25 tup",
      distractors: [
        "Jami 50 tup; Teskari masalada: 50 - 25 = 25 tup",
        "Jami 70 tup; Teskari masalada: 70 - 35 = 35 tup",
        "Jami 60 tup; Teskari masalada: 60 + 35 = 95 tup"
      ],
      explanation: "35 + 25 = 60 tup ko‘chat. Teskari masalada: 60 - 35 = 25 tup qalampir."
    },
    {
      text: "Dorivor o‘simliklar to‘plovchi o‘quvchilar 18 kg moychechak va undan 6 kg kam kiyiko‘t yig‘ishdi. Ular jami necha kg dorivor o‘simlik to‘plashgan?",
      correctAnswer: "30 kg (18 + 12 = 30)",
      distractors: ["24 kg", "28 kg", "36 kg"],
      explanation: "Kiyiko‘t: 18 - 6 = 12 kg. Jami: 18 + 12 = 30 kg."
    }
  ]
};

export const unit08: Grade2UnitDef = {
  order: 8,
  bookNumber: 8,
  unitType: "LESSON",
  title: "Takrorlash",
  emoji: "🐝",
  crossTopic: "Foydali va zararli hasharotlar",
  shortDesc: "Tengliklar oilasi, kesmani bo‘laklarga bo‘lish va ifodalarni taqqoslash",
  intro: "Tabiatda asalarilar gul changlatib asal beradi, ba’zi hasharotlar esa ekinlarga ziyon yetkazadi. Ushbu darsda 1-bobning yakuniy takrorlashini o‘tamiz: tengliklar oilasi, kesmalar va mantiqiy masalalar.",
  keyPoints: [
    "Uchta sondan tengliklar oilasi tuziladi: 40 + 6 = 46, 6 + 40 = 46, 46 - 6 = 40, 46 - 40 = 6.",
    "Kesmani 2 ta nuqta bilan bo‘lsak, 3 ta bo‘lak hosil bo‘ladi.",
    "Harfiy ifodalarni taqqoslash: a - 3 < a (chunki ayirma sondan kichik)."
  ],
  miniExample: {
    emojis: "🐝 40 + 6 = 46 | 46 - 6 = 40",
    text: "Qo‘shish va ayirish amallari o‘zaro bog‘liq: 40 + 6 = 46 bo‘lsa, 46 - 6 = 40 bo‘ladi!"
  },
  xpReward: 95,
  coinReward: 10,
  estMinutes: 8,
  practice: [
    {
      text: "40 + 6 = 46 tenglikdan qaysi ayirish amalini hosil qilish mumkin?",
      correctAnswer: "46 - 6 = 40",
      distractors: ["46 + 6 = 52", "40 - 6 = 34", "46 - 46 = 0"],
      explanation: "Yig‘indidan qo‘shiluvchini ayirsak: 46 - 6 = 40."
    },
    {
      text: "Taqqoslang: a - 3 ... a (bu yerda a musbat son)",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "Sondan 3 ni ayirsak, u kamayadi, demak a - 3 < a."
    },
    {
      text: "Taqqoslang: b + 14 ... b + 25",
      correctAnswer: "<",
      distractors: [">", "=", "-"],
      explanation: "14 soni 25 dan kichik bo‘lgani uchun b + 14 < b + 25."
    }
  ],
  test: [
    // 6 ta oson
    {
      text: "40 va 6 sonlaridan qaysi tengliklar oilasini tuzish mumkin?",
      correctAnswer: "40 + 6 = 46, 6 + 40 = 46, 46 - 6 = 40",
      distractors: [
        "40 + 6 = 46, 40 - 6 = 34, 46 + 6 = 52",
        "40 + 6 = 50, 50 - 6 = 44",
        "Faqat 40 + 6 = 46"
      ],
      explanation: "Qo‘shish va ayirishning o‘zaro bog‘liqligi: 40+6=46, 6+40=46, 46-6=40."
    },
    {
      text: "Uzunligi 1 dm (10 cm) bo‘lgan AB kesmada C va D nuqtalar belgilandi. Bu kesma nechta bo‘lakka bo‘lindi?",
      correctAnswer: "3 ta bo‘lakka",
      distractors: ["2 ta bo‘lakka", "4 ta bo‘lakka", "1 ta bo‘lakka"],
      explanation: "Kesma ustidagi 2 ta nuqta uni 3 ta bo‘lakka ajratadi."
    },
    {
      text: "Taqqoslang: a - 3 ... a (a > 3 bo‘lsa)",
      correctAnswer: "<",
      distractors: [">", "=", "+"],
      explanation: "a - 3 har doim a dan kichik bo‘ladi: <."
    },
    {
      text: "Taqqoslang: b + 14 ... b + 25",
      correctAnswer: "<",
      distractors: [">", "=", "-"],
      explanation: "14 < 25 bo‘lgani uchun b + 14 < b + 25."
    },
    {
      text: "Taqqoslang: c - 0 ... c + 0",
      correctAnswer: "=",
      distractors: [">", "<", "≠"],
      explanation: "c - 0 = c va c + 0 = c, ikkala tomon teng."
    },
    {
      text: "50 + 8 = 58 tenglikka teskari bo‘lgan ayirish amali qaysi?",
      correctAnswer: "58 - 8 = 50",
      distractors: ["58 + 8 = 66", "50 - 8 = 42", "58 - 58 = 0"],
      explanation: "58 - 8 = 50."
    },

    // 8 ta o'rta
    {
      text: "Gulzorda 49 ta hasharot bor edi: 12 tasi kapalak, 14 tasi asalari, qolgani esa qo‘ng‘iz. Gulzorda nechta qo‘ng‘iz bor?",
      correctAnswer: "23 ta qo‘ng‘iz",
      distractors: ["21 ta", "22 ta", "25 ta"],
      explanation: "Kapalak va asalarilar: 12 + 14 = 26 ta. Qo‘ng‘izlar: 49 - 26 = 23 ta."
    },
    {
      text: "1 dm kesma C va D nuqtalar bilan 3 cm, 4 cm va noma’lum x cm bo‘laklarga bo‘lindi. x necha cm ga teng? (1 dm = 10 cm)",
      correctAnswer: "3 cm (10 - 7 = 3)",
      distractors: ["2 cm", "4 cm", "5 cm"],
      explanation: "3 + 4 = 7 cm; 10 - 7 = 3 cm."
    },
    {
      text: "Taqqoslang: x + 10 ... x - 10",
      correctAnswer: ">",
      distractors: ["<", "=", "+"],
      explanation: "Qo‘shilganda son ortadi, ayirilganda kamayadi, demak x + 10 > x - 10."
    },
    {
      text: "70 + 5 = 75 bo‘lsa, 75 - 70 nechaga teng bo‘ladi?",
      correctAnswer: "5",
      distractors: ["70", "75", "10"],
      explanation: "75 - 70 = 5."
    },
    {
      text: "Uya atrofida 16 ta asalari uchib yurgan edi. Yana 14 ta asalari guldan qaytib keldi. Asalarilar jami nechta bo‘ldi?",
      correctAnswer: "30 ta",
      distractors: ["28 ta", "32 ta", "20 ta"],
      explanation: "16 + 14 = 30 ta asalari."
    },
    {
      text: "Tenglamani yeching: y + 23 = 50",
      correctAnswer: "27",
      distractors: ["26", "28", "73"],
      explanation: "y = 50 - 23 = 27."
    },
    {
      text: "Hisoblang: 100 - 40 - 30",
      correctAnswer: "30",
      distractors: ["40", "20", "50"],
      explanation: "100 - 40 = 60, 60 - 30 = 30."
    },
    {
      text: "1-bob bo‘yicha to‘g‘ri xulosani toping:",
      correctAnswer: "Yig‘indi va ayirma o‘zaro bog‘liq, qismlar yig‘indisi butunni beradi",
      distractors: [
        "Ayirish amali faqat sonlarni ko‘paytiradi",
        "Tenglamalarda har doim faqat 10 soni chiqadi",
        "Perimetr faqat uchburchakda bo‘ladi"
      ],
      explanation: "Qo‘shish va ayirish amallari butun va uning qismlari o‘rtasidagi bog‘liqlikdir."
    },

    // 4 ta qiyinroq
    {
      text: "Kuzgi bog‘da 26 ta xonqizi va 14 ta ninachi bor edi. Qushlardan qo‘rqib 10 ta hasharot uchib ketdi. Nechta hasharot qoldi?",
      correctAnswer: "30 ta hasharot",
      distractors: ["28 ta", "32 ta", "40 ta"],
      explanation: "26 + 14 = 40 ta, 40 - 10 = 30 ta hasharot qoldi."
    },
    {
      text: "Tenglamani yeching: 85 - x = 45",
      correctAnswer: "40",
      distractors: ["35", "45", "130"],
      explanation: "x = 85 - 45 = 40."
    },
    {
      text: "Taqqoslang: m - 8 ... m - 12 (m > 12 bo‘lsa)",
      correctAnswer: ">",
      distractors: ["<", "=", "+"],
      explanation: "Kamroq son (8) ayirilsa, ayirma kattaroq bo‘ladi: >."
    },
    {
      text: "Kesmaning uzunligi 12 cm. U 3 ta teng bo‘lakka bo‘lindi. Har bir bo‘lak necha cm?",
      correctAnswer: "4 cm (4 + 4 + 4 = 12)",
      distractors: ["3 cm", "5 cm", "6 cm"],
      explanation: "4 + 4 + 4 = 12 cm."
    },

    // 2 ta murakkab masala
    {
      text: "Asalari oilasi uch kunda asal yig‘di: dushanba kuni 14 kg, seshanba kuni 16 kg, chorshanba kuni esa dushanba va seshanba kunlari birgalikda yig‘ilganidan 10 kg kam asal yig‘ildi. Chorshanba kuni necha kg asal yig‘ilgan?",
      correctAnswer: "20 kg",
      distractors: ["18 kg", "22 kg", "30 kg"],
      explanation: "Dushanba va seshanba: 14 + 16 = 30 kg. Chorshanba: 30 - 10 = 20 kg."
    },
    {
      text: "Uch kunda asalari oilasi jami necha kg asal to‘plagan (oldingi masala shartiga ko‘ra)?",
      correctAnswer: "50 kg (30 + 20 = 50)",
      distractors: ["40 kg", "45 kg", "60 kg"],
      explanation: "30 + 20 = 50 kg asal."
    }
  ]
};

// Save all Chapter 1 units (order 1-8)
const chapter1Units = [unit01, unit02, unit03, unit04, unit05, unit06, unit07, unit08];

for (const unit of chapter1Units) {
  const seed = buildGrade2UnitSeed(unit);
  saveGrade2UnitFile(unit.order, seed);
  console.log(`✅ Saved Grade 2 unit-${unit.order < 10 ? '0' + unit.order : unit.order}.json`);
}
