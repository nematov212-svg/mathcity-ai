import { LessonDef, buildLessonSeed, saveLessonFile } from './generatorTypes';

console.log("Generating Part 4 Chapter 2B lessons (123-128)...");

export const lesson123: LessonDef = {
  bookNumber: 123,
  title: "Sohalar va chegaralar",
  emoji: "🗺️",
  shortDesc: "Yopiq chiziq bilan chegaralangan ichki va tashqi soha hamda chegara",
  intro: "Har qanday yopiq chiziq (aylana, ko'pburchak yoki panjara) tekislikni ikki sohaga ajratadi: ichki soha va tashqi soha. Chiziqning o'zi esa chegara hisoblanadi.",
  keyPoints: [
    "Ichki soha — yopiq chiziq ichidagi qism (masalan, hovli ichi).",
    "Chegara — yopiq chiziqning o'zi (masalan, hovli devori yoki panjara).",
    "Tashqi soha — yopiq chiziqdan tashqaridagi qism (masalan, ko'cha).",
    "Nuqta ichki sohada, chegarada yoki tashqi sohada yotishi mumkin."
  ],
  miniExample: {
    emojis: "⭕ 🟢 🔴",
    text: "Aylana chizilgan. Yashil nuqta aylana ichida (ichki soha), qizil nuqta aylanadan tashqarida (tashqi soha), qora nuqta aylana chizig'ida (chegara)."
  },
  xpReward: 95,
  coinReward: 10,
  estMinutes: 8,
  practice: [
    {
      text: "Hovli panjara bilan o'ralgan. Bog'dagi daraxt qayerda joylashgan?",
      correctAnswer: "Ichki sohada",
      distractors: ["Tashqi sohada", "Chegarada", "Osmon sohasida"],
      explanation: "Panjara bilan o'ralgan hovli ichidagi narsalar ichki sohada bo'ladi."
    },
    {
      text: "Nuqta to'rtburchakning chizig'i ustida turibdi. Bu nuqta qayerda?",
      correctAnswer: "Chegarada",
      distractors: ["Ichki sohada", "Tashqi sohada", "Burchak tashqarisida"],
      explanation: "Shaklning chizig'i ustida joylashgan nuqta chegarada hisoblanadi."
    },
    {
      text: "Aylana tashqarisida turgan nuqta qaysi sohaga tegishli?",
      correctAnswer: "Tashqi soha",
      distractors: ["Ichki soha", "Chegara", "Markaz"],
      explanation: "Aylana chizig'idan tashqaridagi hamma nuqtalar tashqi sohada bo'ladi."
    }
  ],
  test: [
    {
      text: "Yopiq chiziq tekislikni necha sohaga ajratadi?",
      correctAnswer: "2 ta (ichki va tashqi)",
      distractors: ["1 ta", "3 ta", "4 ta"],
      explanation: "Yopiq chiziq tekislikni ichki va tashqi sohalarga ajratadi."
    },
    {
      text: "Shaklning ichki va tashqi sohalarini bir-biridan nima ajratib turadi?",
      correctAnswer: "Chegara (shakl chizig'i)",
      distractors: ["Markaz", "Balandlik", "Rang"],
      explanation: "Ichki va tashqi sohalarni shaklning yopiq chizig'i (chegarasi) ajratadi."
    },
    {
      text: "Kvadrat ichiga chizilgan nuqta qaysi sohada joylashgan?",
      correctAnswer: "Ichki sohada",
      distractors: ["Tashqi sohada", "Chegarada", "To'g'ri chiziqda"],
      explanation: "Kvadrat chiziqlari orasidagi maydonda bo'lsa, u ichki sohada."
    },
    {
      text: "Aylana chizig'ida yotgan A nuqta qayerda hisoblanadi?",
      correctAnswer: "Chegarada",
      distractors: ["Ichki sohada", "Tashqi sohada", "Kvadratda"],
      explanation: "Shakl chizig'i ustidagi nuqtalar chegarada joylashgan."
    },
    {
      text: "Futbol maydonining chizig'i nima hisoblanadi?",
      correctAnswer: "Chegara",
      distractors: ["Ichki soha", "Tashqi soha", "Darvoza"],
      explanation: "Maydon chizig'i maydonning ichi va tashqarisini ajratuvchi chegara."
    },
    {
      text: "To'p maydon chizig'idan tashqariga chiqib ketdi. U qaysi sohaga o'tdi?",
      correctAnswer: "Tashqi sohaga",
      distractors: ["Ichki sohaga", "Chegaraga", "Darvoza to'riga"],
      explanation: "Chiziqdan nariga o'tgan narsa tashqi sohada bo'ladi."
    },
    {
      text: "Quyidagilardan qaysi biri yopiq chiziq chegarasi hisoblanadi?",
      correctAnswer: "Aylana chizig'i",
      distractors: ["Ochiq kesma", "Nur", "To'g'ri chiziq"],
      explanation: "Aylana yopiq chiziq bo'lib, o'z chegarasiga ega."
    },
    {
      text: "Nuqta uchburchakdan tashqarida turibdi. U qayerda?",
      correctAnswer: "Tashqi sohada",
      distractors: ["Ichki sohada", "Chegarada", "Uchburchak uchida"],
      explanation: "Uchburchakdan tashqarida bo'lgan nuqta tashqi sohada."
    },
    {
      text: "Doira yuzasi (bo'yalgan qismi) qaysi sohaga tegishli?",
      correctAnswer: "Ichki sohaga",
      distractors: ["Tashqi sohaga", "Faqat chegaraga", "Uchburchakka"],
      explanation: "Doiraning bo'yalgan ichki yuzasi ichki soha hisoblanadi."
    },
    {
      text: "Chiziq ochiq bo'lsa, tekislikni ichki va tashqi sohaga ajrata oladimi?",
      correctAnswer: "Yo'q, ajrata olmaydi",
      distractors: ["Ha, ajratadi", "Faqat burchak hosil qiladi", "Faqat 1 ta nuqtada"],
      explanation: "Faqat yopiq chiziq tekislikni to'liq ichki va tashqi sohalarga ajratadi."
    },
    {
      text: "Akvariumdagi baliqcha qaysi sohada suzmoqda?",
      correctAnswer: "Ichki sohada",
      distractors: ["Tashqi sohada", "Chegarada", "Xonada"],
      explanation: "Akvarium devorlari ichida suzayotgan baliqcha ichki sohada."
    },
    {
      text: "Akvariumning shishasi nima vazifasini bajaradi?",
      correctAnswer: "Chegara",
      distractors: ["Ichki soha", "Tashqi soha", "Suv o'ti"],
      explanation: "Akvariumning shisha devori chegara bo'ladi."
    },
    {
      text: "Akvarium yonidagi mushuk qaysi sohada turibdi?",
      correctAnswer: "Tashqi sohada",
      distractors: ["Ichki sohada", "Chegarada", "Suvda"],
      explanation: "Mushuk akvariumdan tashqarida, demak u tashqi sohada."
    },
    {
      text: "Doira ichida 4 ta nuqta, chegarasida 2 ta nuqta bor. Ichki sohada nechta nuqta bor?",
      correctAnswer: "4 ta",
      distractors: ["2 ta", "6 ta", "0 ta"],
      explanation: "Doira ichida 4 ta nuqta bor, demak ichki sohada aynan 4 ta nuqta."
    },
    {
      text: "Doira ichida 3 ta, chegarasida 1 ta, tashqarisida 5 ta nuqta bor. Tashqi sohada nechta nuqta bor?",
      correctAnswer: "5 ta",
      distractors: ["3 ta", "1 ta", "9 ta"],
      explanation: "Tashqi sohadagi nuqtalar soni 5 ta."
    },
    {
      text: "Doira chegarasida nechta nuqta bor (oldingi savoldagi ma'lumotga ko'ra)?",
      correctAnswer: "1 ta",
      distractors: ["3 ta", "5 ta", "4 ta"],
      explanation: "Chegarasida 1 ta nuqta yotgani aytilgan edi."
    },
    {
      text: "Qalam bilan qog'ozga kvadrat chizdik. Kvadrat qog'ozni nechta qismga bo'ldi?",
      correctAnswer: "Ichki va tashqi qismlarga",
      distractors: ["Faqat 1 ta qismga", "3 ta teng qismga", "Hech qanday qismga"],
      explanation: "Kvadrat yopiq chiziq sifatida ichki va tashqi sohalarga ajratadi."
    },
    {
      text: "Agar nuqta na ichkarida, na tashqarida bo'lsa, u qayerda joylashgan?",
      correctAnswer: "Chegara chizig'ida",
      distractors: ["Hech qayerda", "Osmon sohasida", "Burchak markazida"],
      explanation: "Ichkarida ham, tashqarida ham bo'lmagan nuqta aynan chegara chizig'ida yotadi."
    },
    {
      text: "Uydagi bolalar xonaning qaysi sohasida?",
      correctAnswer: "Ichki sohasida",
      distractors: ["Tashqi sohasida", "Devor ustida", "Ko'chada"],
      explanation: "Uy ichida turgan bolalar uyning ichki sohasida."
    },
    {
      text: "Sohalar va chegaralar haqidagi qaysi fikr TO'G'RI?",
      correctAnswer: "Chegara ichki va tashqi sohalarni bir-biridan ajratadi",
      distractors: [
        "Chegara bo'lmasa ham ichki soha bo'ladi",
        "Ochiq chiziq ham ichki sohani ajratadi",
        "Tashqi soha faqat 1 ta nuqtadan iborat"
      ],
      explanation: "Chegara aynan ichki va tashqi sohani ajratib turuvchi chiziqdir."
    }
  ]
};

export const lesson124: LessonDef = {
  bookNumber: 124,
  title: "Teng shakllar",
  emoji: "🟰",
  shortDesc: "Ustma-ust qo'yganda to'liq ustma-ust tushadigan teng shakllar",
  intro: "Agar ikki shaklni bir-birining ustiga qo'yganda ular to'liq mos tushsa, bunday shakllar teng shakllar deyiladi. Teng shakllarning o'lchamlari va ko'rinishi bir xil bo'ladi.",
  keyPoints: [
    "Teng shakllar ustma-ust qo'yilganda bir-birini to'liq qoplaydi.",
    "Teng kesmalarning uzunliklari teng bo'ladi.",
    "Teng kvadratlarning tomonlari bir xil uzunlikda bo'ladi.",
    "Shaklning burilgani uning tengligini o'zgartirmaydi (o'lchami o'zgarmasa)."
  ],
  miniExample: {
    emojis: "🟦 🟦",
    text: "Tomoni 3 sm bo'lgan ikkita ko'k kvadrat. Biri ikkinchisining ustiga qo'yilsa, to'liq mos tushadi — ular teng shakllar!"
  },
  xpReward: 95,
  coinReward: 10,
  estMinutes: 8,
  practice: [
    {
      text: "Ikkita shaklni ustma-ust qo'yganda to'liq mos tushdi. Ular qanday shakllar?",
      correctAnswer: "Teng shakllar",
      distractors: ["Har xil shakllar", "Katta va kichik", "To'g'ri chiziqlar"],
      explanation: "Ustma-ust qo'yganda to'liq mos tushadigan shakllar teng shakllar deyiladi."
    },
    {
      text: "Birinchi kvadratning tomoni 4 sm, ikkinchisiniki ham 4 sm. Ular tengmi?",
      correctAnswer: "Ha, ular teng",
      distractors: ["Yo'q, teng emas", "Faqat ranglari teng", "Biri kattaroq"],
      explanation: "Tomonlari teng bo'lgan kvadratlar o'zaro teng shakllardir."
    },
    {
      text: "Kesma A = 5 sm, kesma B = 5 sm. Bu kesmalar haqida nima deyish mumkin?",
      correctAnswer: "Ular teng kesmalar",
      distractors: ["A uzunroq", "B uzunroq", "Ular siniq chiziq"],
      explanation: "Uzunliklari teng bo'lgan kesmalar teng hisoblanadi."
    }
  ],
  test: [
    {
      text: "Teng shakllar deb qanday shakllarga aytiladi?",
      correctAnswer: "Ustma-ust qo'yganda to'liq mos tushadigan shakllarga",
      distractors: [
        "Faqat ranglari bir xil bo'lgan shakllarga",
        "Biri kattaroq bo'lgan shakllarga",
        "Har xil shakllarga"
      ],
      explanation: "Teng shakllar ustma-ust qo'yilganda bir-birini to'liq qoplab, mos tushadi."
    },
    {
      text: "Tomoni 5 sm bo'lgan kvadrat bilan tomoni 3 sm bo'lgan kvadrat tengmi?",
      correctAnswer: "Yo'q, teng emas",
      distractors: ["Ha, teng", "Faqat burilsa teng", "Burchaklari har xil"],
      explanation: "Tomonlari har xil (5 sm va 3 sm) bo'lgani uchun ular teng emas."
    },
    {
      text: "Ikkita doira ustma-ust qo'yildi va to'liq mos tushdi. Bu doiralar haqida nima deyish mumkin?",
      correctAnswer: "Ular o'zaro teng",
      distractors: ["Biri kichikroq", "Biri kattaroq", "Ularning burchaklari teng"],
      explanation: "To'liq mos tushgan shakllar teng shakllar bo'ladi."
    },
    {
      text: "Kesma A = 6 sm, Kesma B = 8 sm. Kesmalar tengmi?",
      correctAnswer: "Teng emas, B uzunroq",
      distractors: ["Teng", "A uzunroq", "Ikkalasi ham 7 sm"],
      explanation: "6 sm va 8 sm teng emas, 8 sm uzunroq."
    },
    {
      text: "Bir xil o'lchamdagi ikkita tanga o'zaro qanday shakllar?",
      correctAnswer: "Teng shakllar",
      distractors: ["Turlicha shakllar", "Uchburchaklar", "Kvadratlar"],
      explanation: "Bir xil tangalar ustma-ust qo'yilsa to'liq mos tushadi, demak ular teng."
    },
    {
      text: "Teng tomonli uchburchakning tomoni 4 sm. Unga teng bo'lgan uchburchakning tomoni necha sm?",
      correctAnswer: "4 sm",
      distractors: ["3 sm", "5 sm", "8 sm"],
      explanation: "Teng shaklning tomoni ham xuddi shunday 4 sm bo'ladi."
    },
    {
      text: "Shaklni o'ngga yoki chapga burib qo'ysak, uning o'lchami o'zgaradimi?",
      correctAnswer: "Yo'q, o'zgarmaydi",
      distractors: ["Ha, kichrayadi", "Ha, kattalashadi", "Shakli doiraga aylanadi"],
      explanation: "Shaklni burish uning o'lchamini o'zgartirmaydi, u avvalgidek teng bo'lib qoladi."
    },
    {
      text: "To'g'ri to'rtburchakning bo'yi 4 sm, eni 2 sm. Unga teng to'rtburchakning bo'yi va eni necha sm?",
      correctAnswer: "Bo'yi 4 sm, eni 2 sm",
      distractors: ["Bo'yi 5 sm, eni 1 sm", "Bo'yi 3 sm, eni 3 sm", "Bo'yi 6 sm, eni 4 sm"],
      explanation: "Teng to'g'ri to'rtburchakning tomonlari aynan 4 sm va 2 sm bo'ladi."
    },
    {
      text: "A shakl B shaklga teng, B shakl C shaklga teng. A shakl C shaklga tengmi?",
      correctAnswer: "Ha, A va C ham o'zaro teng",
      distractors: ["Yo'q, teng emas", "Faqat B katta", "A kichikroq"],
      explanation: "Agar A=B va B=C bo'lsa, u holda A=C bo'ladi."
    },
    {
      text: "Daftar varag'i bilan bir xil o'lchamdagi ikkinchi varaq tengmi?",
      correctAnswer: "Ha, ular teng",
      distractors: ["Yo'q, teng emas", "Biri qalinroq", "Faqat kataklari teng"],
      explanation: "Bir xil o'lchamdagi daftarning varaqlari teng to'rtburchaklardir."
    },
    {
      text: "Tomonlari 2 sm, 3 sm, 4 sm bo'lgan uchburchakka teng bo'lgan uchburchak tomonlari qanday?",
      correctAnswer: "2 sm, 3 sm, 4 sm",
      distractors: ["2 sm, 2 sm, 2 sm", "3 sm, 3 sm, 3 sm", "4 sm, 4 sm, 4 sm"],
      explanation: "Teng uchburchakning mos tomonlari bir xil bo'ladi: 2 sm, 3 sm va 4 sm."
    },
    {
      text: "Rangi qizil kvadrat bilan rangi ko'k kvadratning o'lchami bir xil bo'lsa, ular tengmi?",
      correctAnswer: "Ha, geometrik jihatdan teng",
      distractors: ["Yo'q, ranglari boshqa", "Faqat qizili katta", "Faqat ko'ki katta"],
      explanation: "Geometriyada shakllarning o'lchami va ko'rinishi mos tushsa, ular teng hisoblanadi (rang muhim emas)."
    },
    {
      text: "Uzunligi 7 sm bo'lgan kesmaga teng kesmani toping:",
      correctAnswer: "7 sm bo'lgan kesma",
      distractors: ["6 sm bo'lgan kesma", "8 sm bo'lgan kesma", "5 sm bo'lgan kesma"],
      explanation: "7 sm uzunlikdagi kesmaga faqat 7 sm kesma teng bo'ladi."
    },
    {
      text: "Ikkita teng kvadratning perimetrlari qanday bo'ladi?",
      correctAnswer: "Perimetrlari ham teng bo'ladi",
      distractors: ["Biriniki kattaroq", "Ikkinchisiniki kattaroq", "Har xil bo'ladi"],
      explanation: "Shakllar teng bo'lsa, ularning perimetrlari ham albatta teng bo'ladi."
    },
    {
      text: "Kvadratning perimetri 16 sm. Unga teng bo'lgan kvadratning perimetri necha sm?",
      correctAnswer: "16 sm",
      distractors: ["12 sm", "20 sm", "8 sm"],
      explanation: "Teng shakllarning perimetri ham bir xil bo'ladi: 16 sm."
    },
    {
      text: "Bitta kvadratni diagonali bo'yicha teng ikkiga bo'lsak, qanday shakllar hosil bo'ladi?",
      correctAnswer: "Ikkita teng uchburchak",
      distractors: ["Ikkita teng kvadrat", "Bitta doira", "Ikkita har xil shakl"],
      explanation: "Kvadratni diagonali bo'yicha kessak, ikkita teng to'g'ri burchakli uchburchak hosil bo'ladi."
    },
    {
      text: "Hosil bo'lgan bu ikki uchburchak ustma-ust qo'yilsa nima bo'ladi?",
      correctAnswer: "To'liq mos tushadi",
      distractors: ["Mos tushmaydi", "Biri chiqib qoladi", "Uchburchak yo'qoladi"],
      explanation: "Ular teng bo'lgani uchun ustma-ust qo'yilganda to'liq mos tushadi."
    },
    {
      text: "Doirani teng ikkiga buklasak, ikkala yarmi qanday bo'ladi?",
      correctAnswer: "O'zaro teng bo'ladi",
      distractors: ["Biri katta, biri kichik", "Kvadratga aylanadi", "Uchburchak bo'ladi"],
      explanation: "Teng ikkiga buklanganda ikkala yarim doira o'zaro teng bo'ladi."
    },
    {
      text: "Agar ikki shakl ustma-ust tushmasa, ularni teng deb bo'ladimi?",
      correctAnswer: "Yo'q, ularni teng deb bo'lmaydi",
      distractors: ["Ha, baribir teng", "Faqat bir tomoni teng", "Rangiga qarab teng"],
      explanation: "Mos tushmagan shakllar teng shakllar emas."
    },
    {
      text: "Qaysi xususiyat teng shakllarga xos?",
      correctAnswer: "Ustma-ust qo'yganda to'liq mos tushishi",
      distractors: [
        "Har xil o'lchamga ega bo'lishi",
        "Burchaklari soni har xil bo'lishi",
        "Faqat bir xil rangda bo'lishi"
      ],
      explanation: "Teng shakllarning asosiy belgisi — ularning to'liq mos tushishidir."
    }
  ]
};

export const lesson125: LessonDef = {
  bookNumber: 125,
  title: "Alohida berilgan qismlardan shakllar tuzish",
  emoji: "🧩",
  shortDesc: "Oddiy qismlar (uchburchak, to'rtburchak) yordamida yangi shakllar yasash",
  intro: "Kichik geometrik shakllarni birlashtirib, yangi va murakkabroq shakllar hosil qilish mumkin. Masalan, qadimiy 'Tangram' boshqotirmasi 7 ta geometrik qismdan iborat bo'lib, ulardan minglab turli shakllar yasash mumkin!",
  keyPoints: [
    "2 ta teng uchburchakdan kvadrat yoki to'g'ri to'rtburchak yasash mumkin.",
    "2 ta kvadratni yonma-yon qo'ysak, to'g'ri to'rtburchak hosil bo'ladi.",
    "Tangram boshqotirmasi 7 qismdan iborat: 5 ta uchburchak, 1 ta kvadrat va 1 ta to'rtburchak.",
    "Qismlardan uy, qayiqcha, qush va boshqa ko'plab qiziqarli shakllar yasash mumkin."
  ],
  miniExample: {
    emojis: "🔺 + 🔺 = 🟦",
    text: "Ikkita teng uchburchakni gipotenuzasi (uzun tomoni) bo'yicha birlashtirsak, chiroyli kvadrat hosil bo'ladi!"
  },
  xpReward: 95,
  coinReward: 10,
  estMinutes: 8,
  practice: [
    {
      text: "Ikkita bir xil kvadratni yonma-yon qo'ysak, qanday shakl hosil bo'ladi?",
      correctAnswer: "To'g'ri to'rtburchak",
      distractors: ["Uchburchak", "Doira", "Beshburchak"],
      explanation: "2 ta kvadrat yonma-yon qo'yilsa, uzun to'g'ri to'rtburchak hosil bo'ladi."
    },
    {
      text: "Ikkita teng to'g'ri burchakli uchburchakdan qanday shakl yasash mumkin?",
      correctAnswer: "Kvadrat yoki to'g'ri to'rtburchak",
      distractors: ["Doira", "Shar", "Chiziq"],
      explanation: "2 ta mos uchburchakni birlashtirib kvadrat yoki to'g'ri to'rtburchak yasash mumkin."
    },
    {
      text: "Qadimiy 'Tangram' o'yini nechta geometrik qismdan iborat?",
      correctAnswer: "7 ta qismdan",
      distractors: ["3 ta qismdan", "5 ta qismdan", "10 ta qismdan"],
      explanation: "Tangram boshqotirmasi aynan 7 ta geometrik bo'lakdan iborat."
    }
  ],
  test: [
    {
      text: "Tangram boshqotirmasi jami nechta bo'lakdan iborat?",
      correctAnswer: "7 ta",
      distractors: ["5 ta", "6 ta", "8 ta"],
      explanation: "Tangram 7 ta geometrik bo'lakdan tashkil topgan."
    },
    {
      text: "Tangram qismlari orasida nechta uchburchak bor?",
      correctAnswer: "5 ta",
      distractors: ["3 ta", "4 ta", "6 ta"],
      explanation: "Tangramda 5 ta uchburchak (2 ta katta, 1 ta o'rta, 2 ta kichik) bor."
    },
    {
      text: "Tangramda nechta kvadrat bor?",
      correctAnswer: "1 ta",
      distractors: ["2 ta", "3 ta", "0 ta"],
      explanation: "Tangramda aynan 1 ta kichik kvadrat mavjud."
    },
    {
      text: "Ikkita bir xil to'g'ri burchakli uchburchakdan nima yasash mumkin?",
      correctAnswer: "To'g'ri to'rtburchak",
      distractors: ["Doira", "Silindr", "Konus"],
      explanation: "Ikkita mos to'g'ri burchakli uchburchakni birlashtirib to'g'ri to'rtburchak hosil qilinadi."
    },
    {
      text: "Bitta kvadrat va bitta uchburchakni birlashtirib nima tasvirini yasash mumkin?",
      correctAnswer: "Uycha (tomli uy)",
      distractors: ["Avtomobil g'ildiragi", "Doira", "Shar"],
      explanation: "Kvadrat — uyning devori, uchburchak — uning tomi bo'ladi."
    },
    {
      text: "4 ta bir xil kichik kvadratdan bitta katta shakl yasadik. Bu qanday shakl bo'lishi mumkin?",
      correctAnswer: "Katta kvadrat",
      distractors: ["Doira", "Uchburchak", "Oltiburchak"],
      explanation: "2x2 qilib 4 ta kvadratni terilsa, katta kvadrat hosil bo'ladi."
    },
    {
      text: "Qismlardan yangi shakl yasaganda qismlar ustma-ust chiqishi kerakmi?",
      correctAnswer: "Yo'q, qismlar yonma-yon qo'yiladi",
      distractors: ["Ha, ustma-ust taxlanadi", "Faqat burchaklari yopiladi", "Hammasi bir joyga qo'yiladi"],
      explanation: "Mozaika va tangramda qismlar bir-birining ustiga chiqmasdan yonma-yon birlashtiriladi."
    },
    {
      text: "Doirani teng 2 qismga bo'lsak, qanday bo'laklar hosil bo'ladi?",
      correctAnswer: "Ikkita yarim doira",
      distractors: ["Ikkita kvadrat", "Ikkita uchburchak", "Bitta to'rtburchak"],
      explanation: "Doira teng ikkiga bo'linsa, 2 ta yarim doira hosil bo'ladi."
    },
    {
      text: "Ikkita yarim doirani birlashtirsak nima hosil bo'ladi?",
      correctAnswer: "To'liq doira",
      distractors: ["Kvadrat", "Uchburchak", "Kesma"],
      explanation: "Ikkita yarim doira qo'shilsa, butun doira hosil bo'ladi."
    },
    {
      text: "6 ta bir xil teng tomonli uchburchakdan qanday chiroyli shakl yasash mumkin?",
      correctAnswer: "Muntazam oltiburchak",
      distractors: ["Doira", "To'g'ri to'rtburchak", "Kesma"],
      explanation: "6 ta teng tomonli uchburchak uchi bilan markazda birlashib muntazam oltiburchak hosil qiladi."
    },
    {
      text: "3 ta bir xil kvadratdan qanday to'rtburchak tuzish mumkin?",
      correctAnswer: "Uzun to'g'ri to'rtburchak",
      distractors: ["Kvadrat", "Uchburchak", "Beshburchak"],
      explanation: "3 ta kvadratni qator qilib qo'ysak, uzun to'g'ri to'rtburchak chiqadi."
    },
    {
      text: "Uchburchak qismlaridan qayiqcha yasash mumkinmi?",
      correctAnswer: "Ha, mumkin",
      distractors: ["Yo'q, faqat doira yasash mumkin", "Faqat kvadratdan bo'ladi", "Iloji yo'q"],
      explanation: "Tangram va geometrik qismlardan qayiqcha, yelkan va korpus osongina yasaladi."
    },
    {
      text: "Qog'ozdan shakllarni qirqib yangi rasm yasash san'ati nima deyiladi?",
      correctAnswer: "Applikatsiya (mozaika)",
      distractors: ["Tenglama", "Qo'shish", "Perimetr"],
      explanation: "Geometrik shakllarni qirqib yopishtirish applikatsiya yoki mozaika deyiladi."
    },
    {
      text: "Bir nechta shaklni birlashtirganda umumiy bo'laklar soni qanday bo'ladi?",
      correctAnswer: "Qismlarning yig'indisiga teng",
      distractors: ["Kamayadi", "Doim 10 ta bo'ladi", "Nolga teng"],
      explanation: "Qismlar yig'ilib umumiy yangi shaklni tashkil etadi."
    },
    {
      text: "Kvadratni 4 ta teng bo'lakka bo'lish uchun qanday chiziqlar o'tkazish mumkin?",
      correctAnswer: "O'rtalaridan ikkita kesuvchi to'g'ri chiziq",
      distractors: ["Faqat 1 ta burchakka", "Hech qanday chiziq", "Faqat tashqariga"],
      explanation: "Kvadrat markazidan o'tuvchi gorizontal va vertikal chiziqlar uni 4 ta teng kvadratga bo'ladi."
    },
    {
      text: "Yelkanli qayiq yasash uchun qaysi shakl yelkan vazifasini o'taydi?",
      correctAnswer: "Uchburchak",
      distractors: ["Doira", "Nuqta", "Shar"],
      explanation: "Uchburchak yelkan (parus) shakliga juda mos keladi."
    },
    {
      text: "Avtomobil yasashda g'ildiraklar uchun qaysi shakl qulay?",
      correctAnswer: "Doiralar",
      distractors: ["Kvadratlar", "Uchburchaklar", "Yulduzchalar"],
      explanation: "Doira dumalash xususiyatiga ega bo'lgani uchun g'ildirak doira shaklida bo'ladi."
    },
    {
      text: "Shakllardan naqsh (ornament) tuzishda qanday qoida qo'llaniladi?",
      correctAnswer: "Shakllar ma'lum tartibda takrorlanadi",
      distractors: ["Faqat 1 ta shakl ishlatiladi", "Shakllar aralashtirib tashlanadi", "Faqat nuqta qo'yiladi"],
      explanation: "Naqshda geometrik shakllar chiroyli tartibda va ketma-ket takrorlanadi."
    },
    {
      text: "Uchburchak va kvadratning jami tomonlari nechta?",
      correctAnswer: "7 ta (3 + 4)",
      distractors: ["6 ta", "8 ta", "5 ta"],
      explanation: "Uchburchakda 3 ta, kvadratda 4 ta tomon bor: 3 + 4 = 7 ta."
    },
    {
      text: "Qismlardan yangi shakl yasash bolada qaysi qobiliyatni rivojlantiradi?",
      correctAnswer: "Fazoviy tasavvur va ijodkorlikni",
      distractors: ["Tez yugurishni", "Faqat uxlashni", "Baland sakrashni"],
      explanation: "Shakllarni yasash fazoviy tasavvur, mantiq va ijodkorlikni o'stiradi."
    }
  ]
};

export const lesson126: LessonDef = {
  bookNumber: 126,
  title: "Simmetriya",
  emoji: "🦋",
  shortDesc: "Simmetrik shakllar va simmetriya o'qi tushunchasi",
  intro: "Agar shaklni to'g'ri chiziq bo'yicha buklaganda uning ikki yarmi bir-biriga to'liq mos tushsa, bunday shakl simmetrik shakl deyiladi. Buklangan chiziq esa simmetriya o'qi deb ataladi.",
  keyPoints: [
    "Simmetriya o'qi shaklni ikki teng va akslangan qismga bo'ladi.",
    "Kapalak qanotlari, daraxt bargi, inson chehrasi tabiatdagi simmetriyaga misoldir.",
    "Shaklning chap va o'ng tomonlari ko'zgudagi aks kabi bir-biriga teng bo'ladi.",
    "Buklanganda qismlar to'liq ustma-ust tushishi shart."
  ],
  miniExample: {
    emojis: "🦋 | 🦋",
    text: "Kapalak o'rtasidan to'g'ri chiziq o'tkazib buklasak, uning chap qanoti o'ng qanotiga to'liq mos tushadi. Bu — simmetriya!"
  },
  xpReward: 95,
  coinReward: 10,
  estMinutes: 8,
  practice: [
    {
      text: "Shakl buklanganda uning ikki yarmi to'liq ustma-ust tushdi. Bu shakl qanday shakl?",
      correctAnswer: "Simmetrik shakl",
      distractors: ["Nodir shakl", "Egik shakl", "Siniq shakl"],
      explanation: "Ikki yarmi to'liq mos tushadigan shakllar simmetrik shakllar deyiladi."
    },
    {
      text: "Shaklni ikki teng mos qismga ajratuvchi to'g'ri chiziq nima deyiladi?",
      correctAnswer: "Simmetriya o'qi",
      distractors: ["Balandlik", "Kesma uzunligi", "Radius"],
      explanation: "Buklanish chizig'i simmetriya o'qi deb ataladi."
    },
    {
      text: "Quyidagilardan qaysi biri tabiatdagi simmetriyaga misol bo'ladi?",
      correctAnswer: "Kapalak",
      distractors: ["Shaklsiz tosh", "Daraxtning singan shoxi", "Egri yo'l"],
      explanation: "Kapalakning ikkala qanoti simmetrik joylashgan."
    }
  ],
  test: [
    {
      text: "Simmetrik shakl deb nimaga aytiladi?",
      correctAnswer: "Buklaganda ikki yarmi to'liq mos tushadigan shaklga",
      distractors: [
        "Faqat uchburchak shakliga",
        "Har doim dumaloq shaklga",
        "Ikki tomoni har xil bo'lgan shaklga"
      ],
      explanation: "Simmetrik shakl o'q bo'yicha buklanganda uning qismlari to'liq mos tushadi."
    },
    {
      text: "Simmetriya o'qi nima?",
      correctAnswer: "Shaklni ikki teng aks qismga bo'luvchi to'g'ri chiziq",
      distractors: ["Shaklning rangi", "Shaklning eng katta tomoni", "Aylana radiusi"],
      explanation: "Simmetriya o'qi shaklni ikki ko'zgudek teng qismga ajratuvchi to'g'ri chiziqdir."
    },
    {
      text: "Qaysi harf vertikal (tik) simmetriya o'qiga ega?",
      correctAnswer: "A harfi",
      distractors: ["F harfi", "G harfi", "R harfi"],
      explanation: "A harfini o'rtasidan tik chiziq bilan buklasak, chap va o'ng tomoni to'liq mos tushadi."
    },
    {
      text: "Qaysi harf gorizontal (yotiq) simmetriya o'qiga ega?",
      correctAnswer: "B harfi (yoki H)",
      distractors: ["L harfi", "P harfi", "Q harfi"],
      explanation: "B va H harflari o'rtasidan yotiq chiziq bo'yicha simmetrik buklanadi."
    },
    {
      text: "Kapalakning o'rtasidagi simmetriya o'qi qanday yo'nalgan?",
      correctAnswer: "Vertikal (yuqoridan pastga)",
      distractors: ["Gorizontal (yotiq)", "Aylanma", "Egri"],
      explanation: "Kapalak tanasi bo'ylab tik simmetriya o'qi o'tadi."
    },
    {
      text: "Ko'zgu oldida turganingizda nima hosil bo'ladi?",
      correctAnswer: "Simmetrik aksingiz",
      distractors: ["Boshqa odam", "Kvadrat", "Soyangiz"],
      explanation: "Ko'zgudagi aks — simmetriyaning eng yaqqol hayotiy namunasidir."
    },
    {
      text: "Ko'zguda o'ng qo'lingizni ko'tarsangiz, aksingiz qaysi qo'lini ko'taradi?",
      correctAnswer: "Uning chap qo'lini (ko'zgu aksi)",
      distractors: ["O'ng qo'lini", "Ikkala qo'lini", "Hech qaysi"],
      explanation: "Ko'zgu aksi chap va o'ngni almashtirib ko'rsatadi (ko'zguli simmetriya)."
    },
    {
      text: "Yurakcha shakli (❤️) simmetrikmi?",
      correctAnswer: "Ha, vertikal simmetriya o'qi bor",
      distractors: ["Yo'q, simmetrik emas", "Faqat yotiq o'qi bor", "Uchta o'qi bor"],
      explanation: "Yurakchani o'rtasidan tik buklasak, ikkala yarmi to'liq mos tushadi."
    },
    {
      text: "Bargning o'rtasidan o'tgan asosiy tomir nima vazifasini o'taydi?",
      correctAnswer: "Simmetriya o'qi",
      distractors: ["Chegara tashqarisi", "Uchburchak uchi", "Aylana markazi"],
      explanation: "Barg o'rtasidagi asosiy tomir bo'ylab barg ikki simmetrik qismga bo'linadi."
    },
    {
      text: "Doira shakli simmetrikmi?",
      correctAnswer: "Ha, juda ko'p simmetriya o'qlariga ega",
      distractors: ["Yo'q, uning o'qi yo'q", "Faqat 1 ta o'qi bor", "Faqat 2 ta o'qi bor"],
      explanation: "Doira simmetrik bo'lib, uning markazidan istalgancha simmetriya o'qi o'tkazish mumkin."
    },
    {
      text: "Quyidagi sonlardan qaysi biri simmetrik ko'rinishga ega?",
      correctAnswer: "8",
      distractors: ["4", "7", "5"],
      explanation: "8 soni o'rtasidan gorizontal va vertikal chiziq bo'yicha simmetrik ko'rinadi."
    },
    {
      text: "0 (nol) raqami simmetrikmi?",
      correctAnswer: "Ha, simmetrik",
      distractors: ["Yo'q, simmetrik emas", "Faqat burchakli", "Faqat egri"],
      explanation: "0 raqami oval yoki aylana shaklida bo'lib, simmetriya o'qlariga ega."
    },
    {
      text: "Odam yuzi simmetrik tuzilganmi?",
      correctAnswer: "Ha, o'rtadan vertikal chiziq bo'yicha",
      distractors: ["Yo'q, mutlaqo simmetriyasiz", "Faqat peshona qismi", "Faqat burni"],
      explanation: "Inson yuzida 2 ta ko'z, 2 ta quloq o'rtadagi tik chiziqqa nisbatan simmetrik joylashgan."
    },
    {
      text: "Agar shakl simmetriya o'qi bo'yicha buklansa, qismlar orasida nima bo'lmaydi?",
      correctAnswer: "Ortiqcha chiqib turgan qism bo'lmaydi",
      distractors: ["Moslik bo'lmaydi", "Burchak bo'lmaydi", "Nuqta bo'lmaydi"],
      explanation: "To'liq mos tushgani sababli hech qanday ortiqcha qism chiqib qolmaydi."
    },
    {
      text: "Qaysi geometrik shakl simmetriyaga ega emas (noto'g'ri shakl)?",
      correctAnswer: "Tomonlari turlicha bo'lgan ixtiyoriy uchburchak",
      distractors: ["Kvadrat", "Doira", "Teng tomonli uchburchak"],
      explanation: "Har xil tomonli ixtiyoriy uchburchakda simmetriya o'qi bo'lmaydi."
    },
    {
      text: "Qaychi shakli ochilmagan holatda simmetrikmi?",
      correctAnswer: "Ha, simmetrik",
      distractors: ["Yo'q", "Faqat tig'i simmetrik", "Faqat dastasi"],
      explanation: "Qaychi o'rtasidan tik chiziq bo'yicha simmetrik tuzilishga ega."
    },
    {
      text: "Ko'zoynak simmetrik shaklga egami?",
      correctAnswer: "Ha, ikkita oynasi o'rtaga nisbatan simmetrik",
      distractors: ["Yo'q", "Faqat bir ko'zi", "Faqat bandi"],
      explanation: "Ko'zoynakning chap va o'ng oynalari burun ko'prigiga nisbatan simmetrikdir."
    },
    {
      text: "Avtomobilning old qismi (faralari, panjarasi) simmetrikmi?",
      correctAnswer: "Ha, vertikal o'q bo'yicha simmetrik",
      distractors: ["Yo'q, har xil", "Faqat bitta farasi bor", "Gorizontal simmetrik"],
      explanation: "Mashinaning old ko'rinishi markaziy vertikal o'qqa nisbatan simmetrik qilib yasaladi."
    },
    {
      text: "Qor parchasi (snezhinka) simmetrikmi?",
      correctAnswer: "Ha, juda go'zal simmetriyaga ega",
      distractors: ["Yo'q, qor parchasida o'q yo'q", "Faqat 1 ta nuri bor", "Faqat kvadrat shaklida"],
      explanation: "Qor parchalari 6 qirrali ajoyib simmetriyaga ega tabiat mo''jizasidir."
    },
    {
      text: "Simmetriya tushunchasi bizga nima uchun kerak?",
      correctAnswer: "Go'zallik, uyg'unlik va aniqlikni tushunish uchun",
      distractors: [
        "Faqat qog'ozni yirtish uchun",
        "Shakllarni buzish uchun",
        "Raqamlarni yo'qotish uchun"
      ],
      explanation: "Simmetriya arxitekturada, san'atda va tabiatda uyg'unlik hamda go'zallik asosidir."
    }
  ]
};

export const lesson127: LessonDef = {
  bookNumber: 127,
  title: "Simmetriya o'qlariga ega bo'lgan yassi shakllar",
  emoji: "🔶",
  shortDesc: "Kvadrat, to'g'ri to'rtburchak va uchburchaklarning simmetriya o'qlari soni",
  intro: "Turli yassi shakllar turlicha sondagi simmetriya o'qlariga ega. Kvadratda 4 ta, to'g'ri to'rtburchakda 2 ta, teng tomonli uchburchakda 3 ta simmetriya o'qi bor. Doirada esa ularning soni cheksiz ko'p!",
  keyPoints: [
    "Kvadratda 4 ta simmetriya o'qi bor (2 ta tomonlar o'rtasidan, 2 ta burchaklardan).",
    "To'g'ri to'rtburchakda 2 ta simmetriya o'qi bor (qarama-qarshi tomonlar o'rtasidan).",
    "Teng tomonli uchburchakda 3 ta simmetriya o'qi bor.",
    "Teng yonli uchburchakda 1 ta simmetriya o'qi bor.",
    "Doirada cheksiz ko'p simmetriya o'qlari mavjud."
  ],
  miniExample: {
    emojis: "🟦 (4) | 🟨 (2)",
    text: "Kvadratni 4 xil usulda buklab teng mos keltirish mumkin (4 ta o'q). To'g'ri to'rtburchakni esa faqat 2 xil usulda (2 ta o'q)."
  },
  xpReward: 95,
  coinReward: 10,
  estMinutes: 8,
  practice: [
    {
      text: "Kvadratda nechta simmetriya o'qi bor?",
      correctAnswer: "4 ta",
      distractors: ["2 ta", "3 ta", "1 ta"],
      explanation: "Kvadratda 4 ta simmetriya o'qi bor: 2 ta to'g'ri va 2 ta diagonal."
    },
    {
      text: "To'g'ri to'rtburchakda nechta simmetriya o'qi bor?",
      correctAnswer: "2 ta",
      distractors: ["4 ta", "3 ta", "1 ta"],
      explanation: "To'g'ri to'rtburchak qarama-qarshi tomonlari o'rtasidan o'tuvchi 2 ta simmetriya o'qiga ega."
    },
    {
      text: "Doirada nechta simmetriya o'qi bor?",
      correctAnswer: "Cheksiz ko'p",
      distractors: ["Faqat 1 ta", "Faqat 4 ta", "10 ta"],
      explanation: "Doira markazidan o'tuvchi har qanday to'g'ri chiziq simmetriya o'qi bo'ladi."
    }
  ],
  test: [
    {
      text: "Kvadratning simmetriya o'qlari soni nechta?",
      correctAnswer: "4 ta",
      distractors: ["2 ta", "3 ta", "5 ta"],
      explanation: "Kvadrat 4 ta simmetriya o'qiga ega."
    },
    {
      text: "To'g'ri to'rtburchakning nechta simmetriya o'qi bor?",
      correctAnswer: "2 ta",
      distractors: ["4 ta", "1 ta", "3 ta"],
      explanation: "To'g'ri to'rtburchakda faqat 2 ta simmetriya o'qi bor."
    },
    {
      text: "To'g'ri to'rtburchakning diagonallari simmetriya o'qi bo'la oladimi?",
      correctAnswer: "Yo'q, diagonali bo'yicha buklansa mos tushmaydi",
      distractors: ["Ha, albatta bo'ladi", "Faqat kichik to'rtburchakda bo'ladi", "Ha, 4 ta bo'ladi"],
      explanation: "To'g'ri to'rtburchak diagonal bo'yicha buklanganda uchlari chetga chiqib qoladi, mos tushmaydi."
    },
    {
      text: "Kvadratning diagonallari simmetriya o'qi bo'la oladimi?",
      correctAnswer: "Ha, kvadrat diagonallari simmetriya o'qidir",
      distractors: ["Yo'q, bo'la olmaydi", "Faqat bittasi bo'ladi", "Faqat eni bo'ladi"],
      explanation: "Kvadrat barcha tomonlari teng bo'lgani uchun diagonali bo'yicha to'liq mos tushadi."
    },
    {
      text: "Teng tomonli uchburchakda nechta simmetriya o'qi bor?",
      correctAnswer: "3 ta",
      distractors: ["1 ta", "2 ta", "4 ta"],
      explanation: "Teng tomonli uchburchakning 3 ta uchidan qarama-qarshi tomonga tushirilgan 3 ta simmetriya o'qi bor."
    },
    {
      text: "Teng yonli (ikki tomoni teng) uchburchakda nechta simmetriya o'qi bor?",
      correctAnswer: "1 ta",
      distractors: ["2 ta", "3 ta", "0 ta"],
      explanation: "Teng yonli uchburchakda faqat tepa burchagidan tushirilgan 1 ta simmetriya o'qi bo'ladi."
    },
    {
      text: "Turli tomonli ixtiyoriy uchburchakda nechta simmetriya o'qi bor?",
      correctAnswer: "0 ta (simmetriya o'qi yo'q)",
      distractors: ["1 ta", "2 ta", "3 ta"],
      explanation: "Tomonlari turlicha bo'lgan uchburchakda hech qanday simmetriya o'qi yo'q."
    },
    {
      text: "Doiraning barcha simmetriya o'qlari qayerdan o'tadi?",
      correctAnswer: "Doiraning markazidan",
      distractors: ["Doiraning chetidan", "Doiradan tashqaridan", "Faqat yuqorisidan"],
      explanation: "Doiraning barcha simmetriya o'qlari uning markazidan o'tuvchi to'g'ri chiziqlardir."
    },
    {
      text: "Doirada simmetriya o'qlari soni nechta?",
      correctAnswer: "Cheksiz ko'p",
      distractors: ["100 ta", "4 ta", "360 ta"],
      explanation: "Doira markazidan cheksiz ko'p to'g'ri chiziq o'tkazish mumkin, demak simmetriya o'qlari cheksiz ko'p."
    },
    {
      text: "Qaysi shaklda simmetriya o'qlari ko'proq: kvadratdami yoki to'g'ri to'rtburchakdami?",
      correctAnswer: "Kvadratda (4 > 2)",
      distractors: ["To'g'ri to'rtburchakda", "Ikkalasida teng", "Barchasida 1 ta"],
      explanation: "Kvadratda 4 ta, to'g'ri to'rtburchakda esa 2 ta simmetriya o'qi bor."
    },
    {
      text: "Romb (barcha tomonlari teng) shaklida nechta simmetriya o'qi bor?",
      correctAnswer: "2 ta (diagonallari)",
      distractors: ["4 ta", "1 ta", "3 ta"],
      explanation: "Romb o'zining ikkita diagonali bo'ylab simmetrikdir (2 ta o'q)."
    },
    {
      text: "Kvadratni to'g'ri to'rtburchakka aylantirsak, simmetriya o'qlari nima bo'ladi?",
      correctAnswer: "Kamayadi (4 tadan 2 taga)",
      distractors: ["Ko'payadi", "O'zgarmaydi", "Nolga aylanadi"],
      explanation: "To'g'ri to'rtburchakda diagonallar simmetriya o'qi bo'lmay qoladi, shuning uchun 2 taga kamayadi."
    },
    {
      text: "Besh qirrali muntazam yulduzchada nechta simmetriya o'qi bor?",
      correctAnswer: "5 ta",
      distractors: ["3 ta", "4 ta", "10 ta"],
      explanation: "Besh qirrali muntazam yulduzchaning har bir uchidan 1 tadan, jami 5 ta simmetriya o'qi o'tadi."
    },
    {
      text: "Muntazam oltiburchakda nechta simmetriya o'qi bor?",
      correctAnswer: "6 ta",
      distractors: ["4 ta", "5 ta", "8 ta"],
      explanation: "Muntazam oltiburchakda 6 ta simmetriya o'qi mavjud."
    },
    {
      text: "Doiraning yarmi bo'lgan yarim doirada nechta simmetriya o'qi bor?",
      correctAnswer: "1 ta",
      distractors: ["2 ta", "Cheksiz ko'p", "0 ta"],
      explanation: "Yarim doirani faqat o'rtasidan tik chiziq bo'yicha buklab tenglashtirish mumkin (1 ta o'q)."
    },
    {
      text: "Kvadratning simmetriya o'qlari soni bilan uchburchakning (teng tomonli) simmetriya o'qlari soni ayirmasi nechaga teng?",
      correctAnswer: "1 ga (4 - 3 = 1)",
      distractors: ["2 ga", "0 ga", "3 ga"],
      explanation: "Kvadratda 4 ta, teng tomonli uchburchakda 3 ta: 4 - 3 = 1."
    },
    {
      text: "Quyidagi shakllardan qaysi biri eng ko'p simmetriya o'qiga ega?",
      correctAnswer: "Doira",
      distractors: ["Kvadrat", "Uchburchak", "To'g'ri to'rtburchak"],
      explanation: "Doira cheksiz ko'p simmetriya o'qiga ega bo'lib, eng ko'p o'qqa ega shakldir."
    },
    {
      text: "Burchakning simmetriya o'qi qayerdan o'tadi?",
      correctAnswer: "Burchakni teng ikkiga bo'luvchi nurlan",
      distractors: ["Burchak tashqarisidan", "Faqat bir tomoni bo'ylab", "Burchak uchidan narida"],
      explanation: "Burchak uchidan chiquvchi va uni teng ikkiga bo'luvchi nur (bissektrisa) uning simmetriya o'qidir."
    },
    {
      text: "Kesmaning simmetriya o'qi qanday o'tadi?",
      correctAnswer: "Kesma o'rtasidan perpendikulyar (tik) o'tadi",
      distractors: ["Kesma bo'ylab o'tadi", "Kesma uchidan o'tadi", "Kesmadan chetda"],
      explanation: "Kesmaning o'rtasidan tik o'tuvchi to'g'ri chiziq kesmani teng ikkiga buklash imkonini beradi."
    },
    {
      text: "Simmetriya o'qlariga ega bo'lgan shakllar qanday ko'rinadi?",
      correctAnswer: "Chiroyli, tartibli va mutanosib",
      distractors: ["Qiyshiq va xunuk", "Faqat kichkina", "Ko'rinmas"],
      explanation: "Simmetrik shakllar doimo tartibli, mutanosib va chiroyli ko'rinadi."
    }
  ]
};

export const lesson128: LessonDef = {
  bookNumber: 128,
  title: "Hajmli shakllar",
  emoji: "🧊",
  shortDesc: "Yassi va fazoviy shakllar: kub, shar, silindr, konus, piramida",
  intro: "Biz yashayotgan olamda buyumlar faqat yassi emas, balki fazoviy (hajmli) bo'ladi. Kub, shar, silindr, konus va piramida fazoviy shakllarga misol bo'ladi. Ular qalinlikka, bo'yga va hajmga ega!",
  keyPoints: [
    "Yassi shakllar qog'ozda chiziladi (kvadrat, doira, uchburchak).",
    "Fazoviy (hajmli) shakllar fazoda joy egallaydi (kub, shar, silindr, konus, piramida).",
    "Kubning 6 ta yog'i bo'lib, ularning hammasi bir xil kvadratlardir.",
    "Sharning uchi va qirrasi yo'q, u hamma tomonga dumalaydi.",
    "Silindrning 2 ta asosi doira bo'lib, yon tomoni egri sirt.",
    "Konusning asosi doira, yuqori qismida esa bitta o'tkir uchi bor."
  ],
  miniExample: {
    emojis: "🎲 ⚽ 🥫 🍦",
    text: "O'yin zarchasi — bu kub. Koptok — bu shar. Konserva qutisi — silindr. Muzqaymoq idishi — konus!"
  },
  xpReward: 95,
  coinReward: 10,
  estMinutes: 8,
  practice: [
    {
      text: "Futbol koptogi qaysi fazoviy shaklga misol bo'ladi?",
      correctAnswer: "Shar",
      distractors: ["Kub", "Piramida", "Silindr"],
      explanation: "Koptok yumaloq fazoviy shakl — shar hisoblanadi."
    },
    {
      text: "O'yin zarchasi (toshi) qaysi shaklda bo'ladi?",
      correctAnswer: "Kub",
      distractors: ["Konus", "Silindr", "Shar"],
      explanation: "Zarcha 6 ta kvadrat yoqdan iborat kub shaklidadir."
    },
    {
      text: "Konserva bankasi qaysi shaklga o'xshaydi?",
      correctAnswer: "Silindr",
      distractors: ["Shar", "Piramida", "Kub"],
      explanation: "Ikkala asosi doira bo'lgan truba shakli silindr deyiladi."
    }
  ],
  test: [
    {
      text: "Quyidagilardan qaysi biri yassi shakl hisoblanadi?",
      correctAnswer: "Kvadrat",
      distractors: ["Kub", "Shar", "Silindr"],
      explanation: "Kvadrat qog'ozda chiziladigan yassi shakldir, qolganlari hajmli shakllar."
    },
    {
      text: "Quyidagilardan qaysi biri hajmli (fazoviy) shakl?",
      correctAnswer: "Kub",
      distractors: ["Uchburchak", "Doira", "To'g'ri to'rtburchak"],
      explanation: "Kub fazoviy shakl bo'lib, hajmga ega."
    },
    {
      text: "Kubning nechta yog'i (devori) bor?",
      correctAnswer: "6 ta",
      distractors: ["4 ta", "8 ta", "12 ta"],
      explanation: "Kubning 6 ta tekis kvadrat yog'i bor."
    },
    {
      text: "Kubning barcha yoqlari qanday shaklda?",
      correctAnswer: "Kvadrat shaklida",
      distractors: ["Doira shaklida", "Uchburchak shaklida", "Oltiburchak shaklida"],
      explanation: "Kubning barcha 6 ta yog'i o'zaro teng kvadratlardan iborat."
    },
    {
      text: "Sharning uchi yoki qirrasi bormi?",
      correctAnswer: "Yo'q, uchi ham, qirrasi ham yo'q",
      distractors: ["Ha, 4 ta uchi bor", "1 ta qirrasi bor", "6 ta uchi bor"],
      explanation: "Shar silliq dumaloq sirtga ega bo'lib, unda qirra va uchlar bo'lmaydi."
    },
    {
      text: "Muzqaymoq vafli idishi qaysi shaklga o'xshaydi?",
      correctAnswer: "Konus",
      distractors: ["Kub", "Silindr", "Piramida"],
      explanation: "Vafli qalpog'i asosi doira va bitta uchi bo'lgan konus shaklidadir."
    },
    {
      text: "Silindrning asoslari qanday shaklda?",
      correctAnswer: "Doira shaklida",
      distractors: ["Kvadrat shaklida", "Uchburchak shaklida", "Chiziq shaklida"],
      explanation: "Silindrning pastki va yuqori asoslari doiralardan iborat."
    },
    {
      text: "Misr ehromlari qaysi fazoviy shaklga misol bo'ladi?",
      correctAnswer: "Piramida",
      distractors: ["Shar", "Silindr", "Kub"],
      explanation: "Mashhur ehromlar to'rtburchak asosli piramida shaklida qurilgan."
    },
    {
      text: "G'isht qaysi shaklga o'xshaydi?",
      correctAnswer: "To'g'ri burchakli parallelepiped (kuboid)",
      distractors: ["Shar", "Konus", "Silindr"],
      explanation: "G'isht yoqlari to'g'ri to'rtburchaklardan iborat parallelepipeddir."
    },
    {
      text: "Qalamning shakli nimalardan iborat bo'lishi mumkin?",
      correctAnswer: "Silindr va konus (uchlangan qismi)",
      distractors: ["Faqat shar", "Kub va piramida", "Doira va kvadrat"],
      explanation: "Oddiy qalam tanasi silindrga, uning ochilgan uchi esa konusga o'xshaydi."
    },
    {
      text: "Qaysi shakl tekis yuzada har tomonga dumalay oladi?",
      correctAnswer: "Shar",
      distractors: ["Kub", "Piramida", "Kvadrat"],
      explanation: "Shar dumaloq sirtga ega bo'lgani uchun hamma yo'nalishda erkin dumalaydi."
    },
    {
      text: "Silindr qanday harakatlana oladi?",
      correctAnswer: "Yonboshlatib dumalatish yoki tik sirg'antirish mumkin",
      distractors: ["Faqat ucha oladi", "Umuman qimirlamaydi", "Faqat sakraydi"],
      explanation: "Silindr asosi bilan turganda sirg'aladi, yonboshiga qo'yilganda esa dumalaydi."
    },
    {
      text: "Kubni dumalatish osonmi?",
      correctAnswer: "Yo'q, uning tekis yoqlari va burchaklari bor",
      distractors: ["Ha, koptokdek dumalaydi", "Juda oson", "Dumaloq bo'lgani uchun oson"],
      explanation: "Kubning burchaklari va qirralari borligi uchun u koptokdek dumalamaydi."
    },
    {
      text: "Kubning nechta uchi (burchagi) bor?",
      correctAnswer: "8 ta uchi bor",
      distractors: ["6 ta", "4 ta", "12 ta"],
      explanation: "Kubning tepasida 4 ta, pastida 4 ta, jami 8 ta uchi bor."
    },
    {
      text: "Kubning nechta qirrasi (tomon chiziqlari) bor?",
      correctAnswer: "12 ta qirrasi bor",
      distractors: ["6 ta", "8 ta", "16 ta"],
      explanation: "Kubda jami 12 ta teng qirra mavjud."
    },
    {
      text: "Hajmli shakllar yassi shakllardan nima bilan farq qiladi?",
      correctAnswer: "Hajmga (qalinlikka va bo'yga) ega ekanligi bilan",
      distractors: ["Rangi bilan", "Nomidagi harflar soni bilan", "Farqi yo'q"],
      explanation: "Hajmli shakllar fazoda ma'lum hajm va joy egallaydi."
    },
    {
      text: "Apelsin mevasi qaysi shaklga yaqin?",
      correctAnswer: "Shar",
      distractors: ["Kub", "Piramida", "Konus"],
      explanation: "Apelsin tabiiy shar shakliga juda yaqin dumaloq shakldadir."
    },
    {
      text: "Qutidagi choy qadog'i qaysi shaklga misol?",
      correctAnswer: "Parallelepiped yoki kub",
      distractors: ["Shar", "Konus", "Aylana"],
      explanation: "Choy qutisi to'rtburchak yoqlarga ega kuboid (parallelepiped) shaklida bo'ladi."
    },
    {
      text: "Yo'l harakatidagi qizil-oq konuslar qaysi shaklda?",
      correctAnswer: "Konus",
      distractors: ["Shar", "Silindr", "Kub"],
      explanation: "Yo'l belgilash uchun ishlatiladigan uchli moslama konus deb ataladi."
    },
    {
      text: "Hajmli shakllar haqidagi qaysi tasdiq TO'G'RI?",
      correctAnswer: "Kubning barcha 6 ta yog'i o'zaro teng kvadratlardir",
      distractors: [
        "Sharning 4 ta burchagi bor",
        "Silindrning asoslari uchburchak",
        "Konusning 3 ta uchi bor"
      ],
      explanation: "Kubning har bir yog'i bir xil kvadrat bo'lib, jami 6 ta yog'i bor."
    }
  ]
};

// Save all Chapter 2B lessons
const lessons = [lesson123, lesson124, lesson125, lesson126, lesson127, lesson128];
for (const lessonDef of lessons) {
  const seed = buildLessonSeed(lessonDef);
  saveLessonFile(4, lessonDef.bookNumber, seed, false);
  console.log(`✅ Saved lesson-${lessonDef.bookNumber}.json`);
}
