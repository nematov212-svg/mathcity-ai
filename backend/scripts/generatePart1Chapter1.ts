import { LessonDataDef, buildLessonSeed, saveLessonFile } from './generatorTypes.js';

const lessons: LessonDataDef[] = [
  // 1. Narsalarning xossalari
  {
    bookNumber: 1,
    title: "Narsalarning xossalari",
    emoji: "🔷",
    shortDesc: "Shakl, rang va o‘lcham bo‘yicha taqqoslash va katak daftarga chizish.",
    intro: "Narsalar o‘z shakli, rangi va o‘lchami bilan bir-biridan farq qiladi.",
    keyPoints: [
      "Narsalarni shakli, rangi va o‘lchamiga qarab guruhlaymiz.",
      "Shakllarni taqqoslab, o‘xshash va farqli tomonlarini topamiz.",
      "Katak daftarda shakllarni chizish qo‘lni mashq qildiradi."
    ],
    miniExample: {
      emojis: "🔴 🟦",
      text: "Qizil doira va ko‘k kvadrat — shakli va rangi har xil!"
    },
    xpReward: 80,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Quyidagilardan qaysi biri qizil rangda?",
        correctAnswer: "Qulupnay 🍓",
        distractors: ["Bodring 🥒", "Limon 🍋", "Baqlaajon 🍆"],
        explanation: "Qulupnay qizil rangda bo‘ladi."
      },
      {
        text: "Shakl jihatidan doiraga o‘xshash narsani toping.",
        correctAnswer: "Koptok ⚽",
        distractors: ["Kitob 📚", "Chizg‘ich 📏", "Qalam ✏️"],
        explanation: "Koptok dumaloq doira shakliga ega."
      },
      {
        text: "Qaysi narsa eng katta o‘lchamga ega?",
        correctAnswer: "Avtobus 🚌",
        distractors: ["Velosiped 🚲", "Koptok ⚽", "Qalam ✏️"],
        explanation: "Avtobus berilgan narsalar ichida eng kattasidir."
      }
    ],
    test: [
      {
        text: "Quyidagilardan qaysi biri rang xossasini bildiradi?",
        correctAnswer: "Sariq",
        distractors: ["Katta", "Dumaloq", "Og‘ir"],
        explanation: "Sariq — bu rang xossasi, katta o‘lcham, dumaloq esa shakldir."
      },
      {
        text: "Quyidagi mevalardan qaysi biri yashil rangda bo‘ladi?",
        correctAnswer: "Bodring 🥒",
        distractors: ["Banan 🍌", "Apelsin 🍊", "Qulupnay 🍓"],
        explanation: "Bodring yashil rangga ega sabzavotdir."
      },
      {
        text: "Shakli kvadratga o‘xshash buyumni toping.",
        correctAnswer: "Shaxmat taxtasi ♟️",
        distractors: ["Tuxum 🥚", "Koptok ⚽", "Tarvuz 🍉"],
        explanation: "Shaxmat taxtasi to‘rt tomoni teng kvadrat shaklidadir."
      },
      {
        text: "Olma 🍎 va pomidor 🍅 qaysi xossasi bo‘yicha bir xil?",
        correctAnswer: "Rangi bo‘yicha (ikkalasi ham qizil)",
        distractors: ["Ta’mi bo‘yicha", "Daraxtda o‘sishi bo‘yicha", "Bargi bo‘yicha"],
        explanation: "Olma va qizil pomidor ikkalasi ham qizil rangda bo‘ladi."
      },
      {
        text: "Qaysi narsa shakli jihatidan uchburchakka o‘xshaydi?",
        correctAnswer: "Pitsa bo‘lagi 🍕",
        distractors: ["Tanga 🪙", "Daftar 📓", "G‘ildirak 🛞"],
        explanation: "Pitsaning kesilgan bo‘lagi 3 ta burchakka ega bo‘ladi."
      },
      {
        text: "Quyidagilardan qaysi biri eng kichik o‘lchamda?",
        correctAnswer: "Chumoli 🐜",
        distractors: ["Mushuk 🐱", "Ot 🐎", "Fil 🐘"],
        explanation: "Chumoli berilgan jonzotlar orasida eng mittisidir."
      },
      {
        text: "Katak daftarga chizilgan shakllardan qaysi biri to‘g‘ri to‘rtburchak?",
        correctAnswer: "Eshik shaklidagi to‘rtburchak 🚪",
        distractors: ["Quyosh shakli ☀️", "Yulduzcha ⭐", "Oy shakli 🌙"],
        explanation: "Eshik va derazalar to‘g‘ri to‘rtburchak shaklida bo‘ladi."
      },
      {
        text: "Qaysi juftlikdagi narsalarning shakli bir xil?",
        correctAnswer: "Tanga 🪙 va likopcha 🍽️",
        distractors: ["Qalam ✏️ va koptok ⚽", "Kitob 📖 va olma 🍎", "Chizg‘ich 📏 va tuxum 🥚"],
        explanation: "Tanga ham, likopcha ham doira (dumaloq) shaklidadir."
      },
      {
        text: "Limon 🍋 va banan 🍌 qaysi xossasi bilan o‘xshash?",
        correctAnswer: "Ikkalasi ham sariq rangda",
        distractors: ["Ikkalasi ham dumaloq", "Ikkalasi ham qizil", "Ikkalasi ham achchiq"],
        explanation: "Limon va banan ikkalasi ham sariq rangga ega."
      },
      {
        text: "Qaysi narsa yumshoq xossaga ega?",
        correctAnswer: "Paxta ☁️",
        distractors: ["Tosh 🪨", "Temir qoshiq 🥄", "G‘isht 🧱"],
        explanation: "Paxta juda yumshoq bo‘ladi."
      },
      {
        text: "Tuxum 🥚 qanday shaklga ega?",
        correctAnswer: "Oval (cho‘ziq doira)",
        distractors: ["Kvadrat", "Uchburchak", "To‘rtburchak"],
        explanation: "Tuxum cho‘ziq doira, ya’ni oval shaklidadir."
      },
      {
        text: "Katak daftarda 4 ta katakdan iborat kvadrat chizish uchun nima kerak?",
        correctAnswer: "Oddiy qalam va chizg‘ich 📏",
        distractors: ["Bo‘yoq cho‘tkasi 🖌️", "Qaychi ✂️", "Yelim 🧴"],
        explanation: "Katak daftarga to‘g‘ri chiziq chizishda chizg‘ich va qalam ishlatiladi."
      },
      {
        text: "Baland bino 🏢 va pastki kulba 🛖 qaysi xossasi bilan farqlanadi?",
        correctAnswer: "Balandligi va o‘lchami",
        distractors: ["Nomi bilan faqat", "Eshigi yo‘qligi bilan", "Ranglari faqat sariqligi bilan"],
        explanation: "Bino baland va ulkan, kulba esa past va kichikdir."
      },
      {
        text: "Tarvuz 🍉 va no‘xat 🟢 shakli bo‘yicha qanday?",
        correctAnswer: "Ikkalasi ham dumaloq",
        distractors: ["Ikkalasi ham burchakli", "Tarvuz uchburchak", "No‘xat kvadrat"],
        explanation: "Tarvuz ham, no‘xat ham dumaloq sharsimon shaklga ega."
      },
      {
        text: "Quyidagilardan qaysi biri o‘lcham xossasini bildiradi?",
        correctAnswer: "Uzun",
        distractors: ["Ko‘k", "Qizil", "Shirin"],
        explanation: "Uzun — bu narsaning o‘lchamini bildiruvchi xossadir."
      },
      {
        text: "Qaysi narsa qattiq xossaga ega?",
        correctAnswer: "Temir bolg‘a 🔨",
        distractors: ["Yostiq 🛋️", "Qor ❄️", "Xamir 🥟"],
        explanation: "Temir bolg‘a juda qattiq jismdir."
      },
      {
        text: "Qaysi rang svetoforning eng yuqori chirog‘i hisoblanadi?",
        correctAnswer: "Qizil 🔴",
        distractors: ["Yashil 🟢", "Sariq 🟡", "Ko‘k 🔵"],
        explanation: "Svetoforning tepasida qizil chiroq turadi."
      },
      {
        text: "Bir xil shakl va rangdagi ikkita narsani toping:",
        correctAnswer: "Ikkita bir xil qizil olma 🍎🍎",
        distractors: ["Qizil olma 🍎 va ko‘k koptok ⚽", "Sariq banan 🍌 va yashil bodring 🥒", "Kitob 📕 va qalam ✏️"],
        explanation: "Ikkita qizil olma ham shakli, ham rangi bilan bir xildir."
      },
      {
        text: "Anvar bog‘dan katta va qizil olma uzdi. Olmaning nechta xossasi aytildi?",
        correctAnswer: "2 ta xossasi (katta — o‘lchami, qizil — rangi)",
        distractors: ["1 ta xossasi", "3 ta xossasi", "Xossasi aytilmadi"],
        explanation: "Katta — bu o‘lcham, qizil — bu rang xossasi, jami 2 ta."
      },
      {
        text: "Zahro stol ustiga dumaloq likopcha va to‘rtburchak salfetka qo‘ydi. Ular qaysi belgisi bilan farqlanadi?",
        correctAnswer: "Shakli bo‘yicha",
        distractors: ["Yeyilishi bo‘yicha", "Oyoqlari soni bo‘yicha", "O‘zbekiston xaritasi bo‘yicha"],
        explanation: "Likopcha dumaloq, salfetka esa to‘rtburchak — demak, shakli bilan farqlanadi."
      }
    ]
  },

  // 2. O‘xshashlik va farq
  {
    bookNumber: 2,
    title: "O‘xshashlik va farq",
    emoji: "🗼",
    shortDesc: "Baland-past, keng-tor, uzun-qisqa va katta-kichik juftlari.",
    intro: "Atrofdagi narsalarni baland-past, keng-tor va katta-kichik deb taqqoslash mumkin.",
    keyPoints: [
      "Baland–past va uzun–qisqa so‘zlari bo‘y va o‘lchamni bildiradi.",
      "Keng–tor so‘zlari yo‘l yoki daryoning kengligini bildiradi.",
      "Shakllar qatorini mantiqiy tartib bilan davom ettiramiz."
    ],
    miniExample: {
      emojis: "🦒 🦔",
      text: "Jirafa baland, tipratikan esa past bo‘yli!"
    },
    xpReward: 80,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Fil 🐘 va quyon 🐇 solishtirilsa, qaysi biri katta?",
        correctAnswer: "Fil 🐘",
        distractors: ["Quyon 🐇", "Ikkalasi teng", "Bilmayman"],
        explanation: "Fil ulkan hayvon, quyon esa unga nisbatan kichik."
      },
      {
        text: "Avtomobil yo‘li 🛣️ va piyodalar so‘qmog‘i solishtirilsa, qaysi biri keng?",
        correctAnswer: "Avtomobil yo‘li 🛣️",
        distractors: ["Piyodalar so‘qmog‘i 🚶", "Ikkalasi bir xil", "So‘qmoq kengroq"],
        explanation: "Katta yo‘l mashinalar uchun keng qilib quriladi."
      },
      {
        text: "Qatorni davom ettiring: 🔴 🔵 🔴 🔵 ... keyingi nima?",
        correctAnswer: "🔴 Qizil doira",
        distractors: ["🔵 Ko‘k doira", "🟡 Sariq doira", "🟢 Yashil doira"],
        explanation: "Qizil va ko‘k ketma-ket almashib kelmoqda, ko‘kdan keyin qizil keladi."
      }
    ],
    test: [
      {
        text: "Jirafa 🦒 va tulki 🦊 solishtirilsa, qaysi biri baland?",
        correctAnswer: "Jirafa 🦒",
        distractors: ["Tulki 🦊", "Ikkalasi teng", "Tulki balandroq"],
        explanation: "Jirafaning bo‘yni juda uzun va u hayvonlar ichida eng balandidir."
      },
      {
        text: "Qaysi juftlik 'uzun – qisqa' ma’nosini to‘g‘ri bildiradi?",
        correctAnswer: "Yangi qalam ✏️ va ishlatilgan kalta qalam",
        distractors: ["Fil 🐘 va chumoli 🐜", "Tog‘ ⛰️ va daryo 🌊", "Quyosh ☀️ va oy 🌙"],
        explanation: "Qalamlarning uzunligi bir-biridan uzun va qisqa bo‘lishi mumkin."
      },
      {
        text: "Avtomobil yo‘li keng bo‘lsa, daraxtlar orasidagi tor yo‘lakcha nima deyiladi?",
        correctAnswer: "So‘qmoq (tor yo‘l)",
        distractors: ["Katta trassa", "Ko‘prik", "Temir yo‘l"],
        explanation: "Kichik va tor yo‘lakka so‘qmoq deyiladi."
      },
      {
        text: "Quyidagi qatorda qaysi jonzot ortiqcha: 🦆, 🦅, 🦉, 🚗?",
        correctAnswer: "Mashina 🚗 (u jonzot emas)",
        distractors: ["O‘rdak 🦆", "Burgut 🦅", "Boyqush 🦉"],
        explanation: "O‘rdak, burgut va boyqush qushlar, mashina esa transportdir."
      },
      {
        text: "Qatorni davom ettiring: 🟩 🟨 🟩 🟨 ... keyingi shakl qaysi?",
        correctAnswer: "🟩 Yashil kvadrat",
        distractors: ["🟨 Sariq kvadrat", "🔴 Qizil doira", "🔷 Ko‘k romb"],
        explanation: "Yashil va sariq navbat bilan takrorlanmoqda, sariqdan keyin yashil keladi."
      },
      {
        text: "Qalin kitob 📚 va yupqa daftar 📓 qaysi xossasi bilan farqlanadi?",
        correctAnswer: "Qalinligi (qalin – yupqa)",
        distractors: ["Daftarning harflari yo‘qligi bilan", "Ikkalasi ham yeyilishi bilan", "Shakli doiraligi bilan"],
        explanation: "Kitobning varaqlari ko‘p bo‘lib qalin, daftar esa yupqa bo‘ladi."
      },
      {
        text: "Daryo 🌊 va ariqcha solishtirilsa, qaysi biri keng?",
        correctAnswer: "Daryo 🌊",
        distractors: ["Ariqcha", "Ikkalasi teng", "Ariqcha kengroq"],
        explanation: "Daryo ulkan suv havzasi bo‘lib, ariqdan ancha kengdir."
      },
      {
        text: "Terak daraxti 🌲 va rayhon guli 🌿 solishtirilsa, rayhon qanday?",
        correctAnswer: "Past",
        distractors: ["Baland", "Uchburchak", "Og‘ir"],
        explanation: "Terak juda baland o‘sadi, rayhon esa past bo‘yli o‘simlikdir."
      },
      {
        text: "Quyidagilardan qaysi biri 'katta – kichik' juftiga misol bo‘ladi?",
        correctAnswer: "Tarvuz 🍉 va gilos 🍒",
        distractors: ["Ikkita bir xil olma 🍎🍎", "Ko‘k qalam va qizil qalam ✏️✏️", "Baland daraxt va past devor"],
        explanation: "Tarvuz ulkan, gilos esa mitti mevadir."
      },
      {
        text: "Naqshni davom ettiring: 🔺 🔹 🔺 🔹 🔺 ... keyingi shakl nima?",
        correctAnswer: "🔹 Kichik romb",
        distractors: ["🔺 Uchburchak", "🟡 Sariq doira", "⬛ Qora kvadrat"],
        explanation: "Uchburchakdan keyin doim ko‘k romb kelmoqda."
      },
      {
        text: "Qaysi kiyim sovuq qish fasliga xos va issiq tutadi?",
        correctAnswer: "Qalin palto 🧥",
        distractors: ["Yupqa futbolka 👕", "Yozgi shortik 🩳", "Cho‘milish kiyimi 🩱"],
        explanation: "Qishda qalin palto va etik kiyiladi."
      },
      {
        text: "Poyezd 🚆 va yengil mashina 🚗 solishtirilsa, poyezd qanday?",
        correctAnswer: "Uzun",
        distractors: ["Kalta", "Yengil", "Tor"],
        explanation: "Poyezd ko‘plab vagonlardan iborat bo‘lib, juda uzundir."
      },
      {
        text: "Quyidagi mevalar orasida qaysi biri ortiqcha: 🍏, 🍐, 🍇, 🥕?",
        correctAnswer: "Sabzi 🥕 (u meva emas, sabzavot)",
        distractors: ["Olma 🍏", "Nok 🍐", "Uzum 🍇"],
        explanation: "Olma, nok va uzum mevalar, sabzi esa sabzavotdir."
      },
      {
        text: "Baland tog‘ 🏔️ tepasiga chiqish uchun qaysi narvon kerak?",
        correctAnswer: "Baland va uzun narvon",
        distractors: ["Past va kalta narvon", "Yupqa qog‘oz", "Kichik qoshiq"],
        explanation: "Baland joylarga chiqish uchun uzun narvon ishlatiladi."
      },
      {
        text: "Keng daryodan o‘tish uchun qanday ko‘prik quriladi?",
        correctAnswer: "Uzun va keng ko‘prik 🌉",
        distractors: ["Kalta taxtacha", "Kichik quti", "Yupqa ip"],
        explanation: "Keng daryoning ikki qirg‘og‘ini tutashtirish uchun uzun va mustahkam ko‘prik kerak."
      },
      {
        text: "Qatorni davom ettiring: ☀️ 🌙 ☀️ 🌙 ... keyingi belgi nima?",
        correctAnswer: "☀️ Quyosh",
        distractors: ["🌙 Yarim oy", "⭐ Yulduz", "☁️ Bulut"],
        explanation: "Oy belgisidan so‘ng quyosh belgisi keladi."
      },
      {
        text: "Qaysi hayvon eng tez yuguradi va tezlikda farqlanadi?",
        correctAnswer: "Gepard 🐆",
        distractors: ["Toshbaqa 🐢", "Shilliqqurt 🐌", "Tipratikan 🦔"],
        explanation: "Gepard quruqlikdagi eng tez yuguruvchi hayvondir."
      },
      {
        text: "O‘xshash shakllar juftini toping:",
        correctAnswer: "Dumaloq soat ⏰ va dumaloq koptok ⚽",
        distractors: ["Kvadrat rom 🪟 va uzun tayoq 🪄", "Kitob 📖 va olma 🍎", "Chizg‘ich 📏 va quticha 📦"],
        explanation: "Soat va koptok ikkalasi ham dumaloq shaklga ega."
      },
      {
        text: "Botir 1-sinfda o‘qiydi, uning akasi Sardor esa 9-sinfda. Ulardan qaysi biri baland bo‘yli?",
        correctAnswer: "Akasi Sardor (9-sinf o‘quvchisi)",
        distractors: ["Botir (1-sinf)", "Ikkalasi bir xil", "Botir akasidan baland"],
        explanation: "Katta yoshli aka ukasiga qaraganda baland bo‘ladi."
      },
      {
        text: "Toshkent teleminorasi 🗼 bilan shahar avtobusi 🚌 taqqoslansa, teleminora qanday?",
        correctAnswer: "Juda baland",
        distractors: ["Past", "Kalta", "Yengil"],
        explanation: "Toshkent teleminorasi O‘zbekistondagi eng baland inshootlardan biridir."
      }
    ]
  },

  // 3. Narsalarning joylashishi
  {
    bookNumber: 3,
    title: "Narsalarning joylashishi",
    emoji: "🧭",
    shortDesc: "Tepada, pastda, chapda, o‘ngda va katak tomonlari.",
    intro: "Narsalarning qayerda turganini tepada, pastda, chapda yoki o‘ngda deb aytamiz.",
    keyPoints: [
      "Tepada va pastda yo‘nalishlari balandlikni ko‘rsatadi.",
      "Chap va o‘ng tomonlar qo‘llarimizga qarab aniqlanadi.",
      "O‘zbekiston bayrog‘ida ko‘k chiziq tepada, yashil chiziq pastda joylashgan."
    ],
    miniExample: {
      emojis: "☀️ 🌻",
      text: "Quyosh tepada, kungaboqar esa pastda!"
    },
    xpReward: 85,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Osmonda quyosh ☀️ qayerda turadi?",
        correctAnswer: "Tepada",
        distractors: ["Pastda", "Yer tagida", "Yon tomonda"],
        explanation: "Quyosh osmonda, ya’ni tepada porlaydi."
      },
      {
        text: "Qalamni o‘ng qo‘lingizga olsangiz, u qaysi tomonda bo‘ladi?",
        correctAnswer: "O‘ng tomonda",
        distractors: ["Chap tomonda", "Tepada", "Orqada"],
        explanation: "O‘ng qo‘ldagi narsa o‘ng tomonda bo‘ladi."
      },
      {
        text: "Katakning yuqori tomoni qayerga qaraydi?",
        correctAnswer: "Tepaga",
        distractors: ["Pastga", "Chapga", "O‘ngga"],
        explanation: "Yuqori tomon doimo tepaga yo‘nalgan bo‘ladi."
      }
    ],
    test: [
      {
        text: "Qushlar osmonda uchmoqda. Ular qayerda?",
        correctAnswer: "Tepada",
        distractors: ["Pastda", "Yer tagida", "Orqada faqat"],
        explanation: "Qushlar balandda, osmonda, ya’ni tepada uchadi."
      },
      {
        text: "Baliqlar suv tagida suzmoqda. Ular qayerda joylashgan?",
        correctAnswer: "Pastda (suv tubida)",
        distractors: ["Tepada bulutda", "Daraxt shoxida", "Osmonda"],
        explanation: "Baliqlar pastda, suv havzalarida suzadi."
      },
      {
        text: "Ko‘prik ustidan mashina 🚗, ostidan esa qayiq ⛵ o‘tmoqda. Qayiq qayerda?",
        correctAnswer: "Pastda (ko‘prik ostida)",
        distractors: ["Tepada", "Ko‘prik ustida", "Osmonda"],
        explanation: "Qayiq ko‘prikning pastki qismida, suvda harakatlanadi."
      },
      {
        text: "O‘zbekiston bayrog‘ida ko‘k tasma qayerda joylashgan?",
        correctAnswer: "Eng tepada",
        distractors: ["O‘rtada", "Eng pastda", "Yonboshda"],
        explanation: "Davlatimiz bayrog‘ining yuqori qismi havorang (ko‘k) tasmadir."
      },
      {
        text: "O‘zbekiston bayrog‘ida yashil tasma qayerda joylashgan?",
        correctAnswer: "Eng pastda",
        distractors: ["Eng tepada", "O‘rtada", "Bayroq orqasida"],
        explanation: "Bayroqdagi yashil tasma pastki chiziqda joylashgan."
      },
      {
        text: "Qatorda: 🍎 🍐 🍊. Olma 🍎 qaysi tomonda turibdi?",
        correctAnswer: "Chap tomonda",
        distractors: ["O‘ng tomonda", "O‘rtada", "Pastda"],
        explanation: "Olma birinchi bo‘lib chap tomonda turibdi."
      },
      {
        text: "Qatorda: 🍎 🍐 🍊. Apelsin 🍊 qaysi tomonda turibdi?",
        correctAnswer: "O‘ng tomonda",
        distractors: ["Chap tomonda", "O‘rtada", "Tepada"],
        explanation: "Apelsin eng oxirgi bo‘lib o‘ng tomonda turibdi."
      },
      {
        text: "Qatorda: 🍎 🍐 🍊. Nok 🍐 qayerda turibdi?",
        correctAnswer: "O‘rtada (olma va apelsin orasida)",
        distractors: ["Eng chapda", "Eng o‘ngda", "Tepada"],
        explanation: "Nok olma va apelsinning o‘rtasida joylashgan."
      },
      {
        text: "Daftarning bitta katagida nechta tomon bor?",
        correctAnswer: "4 ta tomon (tepa, past, chap, o‘ng)",
        distractors: ["3 ta tomon", "2 ta tomon", "5 ta tomon"],
        explanation: "Katak to‘rtburchak bo‘lib, 4 ta tomonga ega."
      },
      {
        text: "Sinf doskasi 🗂️ oldida turgan o‘qituvchining chap qo‘li qaysi tomonda bo‘ladi?",
        correctAnswer: "Chap tomonda",
        distractors: ["O‘ng tomonda", "Tepada", "Pastda"],
        explanation: "Chap qo‘l doimo chap tarafda bo‘ladi."
      },
      {
        text: "Katak daftarda qalamni bir katak o‘ngga yurgizish qaysi tomonga harakat?",
        correctAnswer: "O‘ng tomonga",
        distractors: ["Chap tomonga", "Tepaga", "Pastga"],
        explanation: "O‘ngga yurish o‘ng qo‘l tomonga yo‘nalishdir."
      },
      {
        text: "Daraxt tagida qo‘ziqorin 🍄 o‘smoqda. Qo‘ziqorin qayerda?",
        correctAnswer: "Pastda (yerda)",
        distractors: ["Tepada", "Osmonda", "Bulutda"],
        explanation: "Qo‘ziqorin yerda, daraxtning tagida o‘sadi."
      },
      {
        text: "Samolyot ✈️ uchayotganda uyning qayerida bo‘ladi?",
        correctAnswer: "Tepasida (osmonda)",
        distractors: ["Ostida", "Ichida", "Zaminida"],
        explanation: "Samolyot uylardan balandda, tepada uchadi."
      },
      {
        text: "Stol ustida kitob 📖, stol tagida koptok ⚽ bor. Koptok qayerda?",
        correctAnswer: "Pastda (stol tagida)",
        distractors: ["Tepada (stol ustida)", "Shiftda", "Stol yonida"],
        explanation: "Koptok pastda, stol ostida turibdi."
      },
      {
        text: "Chiziq chizganda tepadan pastga qarab chizilsa, bu qanday chiziq?",
        correctAnswer: "Tik (vertikal) chiziq",
        distractors: ["Yotiq chiziq", "Aylanma chiziq", "Nuqta"],
        explanation: "Tepadan pastga tortilgan chiziq tik chiziq deyiladi."
      },
      {
        text: "Chapdan o‘ngga tortilgan chiziq qanday chiziq deyiladi?",
        correctAnswer: "Yotiq (gorizontal) chiziq",
        distractors: ["Tik chiziq", "Siniq chiziq", "Doira"],
        explanation: "Chapdan o‘ngga qarab yotgan chiziq yotiq chiziqdir."
      },
      {
        text: "Qatorda 5 ta o‘quvchi turibdi. Chapdan 2-o‘rindagi kim bo‘ladi?",
        correctAnswer: "Chap tomondan hisoblaganda ikkinchi bola",
        distractors: ["O‘ng tomondan birinchi bola", "O‘rtadagi bola", "Eng oxirgi bola"],
        explanation: "Chap tomondan sanalganda 1, 2-o‘rindagi o‘quvchi bo‘ladi."
      },
      {
        text: "Ko‘chada piyoda yurayotganda yo‘lning qaysi tomonidan yurish qoidasi bor?",
        correctAnswer: "O‘ng tomonidan (yoki piyodalar yo‘lkasidan)",
        distractors: ["Yo‘lning qoq o‘rtasidan", "Mashinalar orasidan", "Faqat chap chekkadan"],
        explanation: "Piyodalar yo‘lkasining o‘ng tomonidan yurish odob va qoidadir."
      },
      {
        text: "Malika daftariga quyosh rasmini chizdi. Quyosh odatda sahifaning qayeriga chiziladi?",
        correctAnswer: "Yuqori qismiga (tepaga)",
        distractors: ["Eng pastki qismiga", "Daftar orqasiga", "Stol tagiga"],
        explanation: "Quyosh osmonda bo‘lgani uchun rasmning yuqori qismiga chiziladi."
      },
      {
        text: "Sinf xonasida soat 🕒 devorning qayeriga osiladi?",
        correctAnswer: "Yuqoriga (tepaga, hamma ko‘rishi uchun)",
        distractors: ["Polga (pastga)", "Parta tagiga", "Eshik orqasidagi polga"],
        explanation: "Soat barchaga ko‘rinishi uchun devorning yuqori qismiga ilinadi."
      }
    ]
  },

  // 4. Narsalar sanog‘i
  {
    bookNumber: 4,
    title: "Narsalar sanog‘i",
    emoji: "🥕",
    shortDesc: "1–9 emoji sanash, tayoqchalar, kattalashish tartibi va nechanchi.",
    intro: "Atrofdagi narsalarni birma-bir sanab, ularning umumiy sonini aniqlaymiz.",
    keyPoints: [
      "Sanashda har bir narsaga bitta son mos keladi.",
      "Oxirgi aytilgan son narsalarning jami miqdorini bildiradi.",
      "Narsalarni kattalashish va kichrayish tartibida sanash mumkin."
    ],
    miniExample: {
      emojis: "🍎 🍎 🍎",
      text: "Bir, ikki, uch — jami 3 ta olma!"
    },
    xpReward: 80,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Nechta yulduzcha bor: ⭐ ⭐ ⭐ ⭐?",
        correctAnswer: "4 ta",
        distractors: ["3 ta", "5 ta", "6 ta"],
        explanation: "Bir, ikki, uch, to‘rt — jami 4 ta yulduzcha."
      },
      {
        text: "Savatchada 2 ta nok bor edi, yana 1 ta solindi. Nechta bo‘ldi?",
        correctAnswer: "3 ta",
        distractors: ["2 ta", "4 ta", "1 ta"],
        explanation: "2 ga 1 qo‘shilsa 3 ta bo‘ladi."
      },
      {
        text: "Barmoqlaringizni sanang: bitta qo‘lda nechta barmoq bor?",
        correctAnswer: "5 ta",
        distractors: ["4 ta", "6 ta", "10 ta"],
        explanation: "Odamning bir qo‘lida 5 ta barmoq bo‘ladi."
      }
    ],
    test: [
      {
        text: "Nechta olma bor: 🍎 🍎 🍎?",
        correctAnswer: "3 ta",
        distractors: ["2 ta", "4 ta", "5 ta"],
        explanation: "Sanamiz: 1, 2, 3. Jami 3 ta olma."
      },
      {
        text: "Nechta koptok bor: ⚽ ⚽ ⚽ ⚽ ⚽?",
        correctAnswer: "5 ta",
        distractors: ["4 ta", "6 ta", "7 ta"],
        explanation: "Koptoklar soni roppa-rosa 5 ta."
      },
      {
        text: "Quyidagi tayoqchalar nechta: ||||||?",
        correctAnswer: "6 ta",
        distractors: ["5 ta", "7 ta", "8 ta"],
        explanation: "Birma-bir sanaganda 6 ta tayoqcha bor."
      },
      {
        text: "Quyidagi mashinalar sonini toping: 🚗 🚗?",
        correctAnswer: "2 ta",
        distractors: ["1 ta", "3 ta", "4 ta"],
        explanation: "Bu yerda 2 ta mashina turibdi."
      },
      {
        text: "Nechta gul bor: 🌸 🌸 🌸 🌸?",
        correctAnswer: "4 ta",
        distractors: ["3 ta", "5 ta", "6 ta"],
        explanation: "Gullar soni 4 ta."
      },
      {
        text: "1, 2, 3, 4, 5 sonlaridan qaysi biri eng katta?",
        correctAnswer: "5",
        distractors: ["1", "3", "4"],
        explanation: "Ushbu qatorda 5 soni eng kattadir."
      },
      {
        text: "1, 2, 3, 4, 5 sonlaridan qaysi biri eng kichik?",
        correctAnswer: "1",
        distractors: ["2", "3", "5"],
        explanation: "1 soni sanoq boshidagi eng kichik son."
      },
      {
        text: "Qatorda: 🦆 🦆 🦆 🦆 🦆 🦆 🦆. Nechta o‘rdakcha bor?",
        correctAnswer: "7 ta",
        distractors: ["6 ta", "8 ta", "9 ta"],
        explanation: "Sanamiz: 1, 2, 3, 4, 5, 6, 7. Jami 7 ta."
      },
      {
        text: "Quyidagi kapalaklarni sanang: 🦋 🦋 🦋 🦋 🦋 🦋 🦋 🦋.",
        correctAnswer: "8 ta",
        distractors: ["7 ta", "9 ta", "6 ta"],
        explanation: "Kapalaklar soni roppa-rosa 8 ta."
      },
      {
        text: "9 ta olxo‘ri 🫐 sanashda 8 dan keyin qaysi son aytiladi?",
        correctAnswer: "To‘qqiz (9)",
        distractors: ["Yetti (7)", "O‘n (10)", "Olti (6)"],
        explanation: "8 dan keyin 9 soni keladi."
      },
      {
        text: "Bitta velosipedda 🚲 nechta g‘ildirak bor?",
        correctAnswer: "2 ta",
        distractors: ["3 ta", "4 ta", "1 ta"],
        explanation: "Oddiy velosipedda 2 ta g‘ildirak bo‘ladi."
      },
      {
        text: "Svetoforda 🚦 nechta chiroq bor?",
        correctAnswer: "3 ta (qizil, sariq, yashil)",
        distractors: ["2 ta", "4 ta", "5 ta"],
        explanation: "Svetofor 3 ta rangli chiroqqa ega."
      },
      {
        text: "Narsalarni sanash qaysi sondan boshlanadi?",
        correctAnswer: "1 dan",
        distractors: ["0 dan", "2 dan", "5 dan"],
        explanation: "Sanoq 1 sonidan boshlanadi: bir, ikki, uch..."
      },
      {
        text: "Qatorda turgan quyonchalardan uchinchisi qaysi: 🐇 🐇 🐇 🐇?",
        correctAnswer: "Chapdan hisoblaganda 3-o‘rindagi quyoncha",
        distractors: ["1-quyoncha", "Oxirgi quyoncha", "Barcha quyonchalar"],
        explanation: "Uchinchi so‘zi tartib bo‘yicha 3-narsani bildiradi."
      },
      {
        text: "Daftarga 5 ta katak bo‘yash kerak. Nechta katak bo‘yaladi?",
        correctAnswer: "5 ta katak",
        distractors: ["4 ta katak", "6 ta katak", "3 ta katak"],
        explanation: "5 soni 5 ta katakni bildiradi."
      },
      {
        text: "Nechta jo‘ja bor: 🐣 🐣 🐣 🐣 🐣 🐣?",
        correctAnswer: "6 ta",
        distractors: ["5 ta", "7 ta", "8 ta"],
        explanation: "Sanamiz: 1, 2, 3, 4, 5, 6 ta jo‘ja."
      },
      {
        text: "Stol ustida 4 ta qalam bor edi. Ali yana 1 ta qo‘ydi. Qalamlar nechta bo‘ldi?",
        correctAnswer: "5 ta",
        distractors: ["4 ta", "6 ta", "3 ta"],
        explanation: "4 ta qalamga 1 ta qo‘shilsa 5 ta bo‘ladi."
      },
      {
        text: "Kattalashish tartibida to‘g‘ri yozilgan qatorni toping:",
        correctAnswer: "1, 2, 3, 4, 5",
        distractors: ["5, 4, 3, 2, 1", "1, 3, 2, 5, 4", "2, 4, 1, 3, 5"],
        explanation: "1 dan 5 gacha bo‘lgan sonlar kichigidan kattasiga qarab o‘sadi."
      },
      {
        text: "Jasur akvariumda 3 ta qizil va 2 ta sariq baliqchani ko‘rdi. Jami nechta baliqcha bor?",
        correctAnswer: "5 ta",
        distractors: ["4 ta", "6 ta", "3 ta"],
        explanation: "3 + 2 = 5 ta baliqcha."
      },
      {
        text: "Madina bog‘dan 1 ta nok, 2 ta olma va 1 ta shaftoli uzdi. U jami nechta meva uzdi?",
        correctAnswer: "4 ta meva",
        distractors: ["3 ta meva", "5 ta meva", "6 ta meva"],
        explanation: "1 + 2 + 1 = 4 ta meva."
      }
    ]
  },

  // 5. Yassi va hajmli shakllar
  {
    bookNumber: 5,
    title: "Yassi va hajmli shakllar",
    emoji: "🧊",
    shortDesc: "Doira, kvadrat, uchburchak, shar, kub, silindr va piramida.",
    intro: "Shakllar yassi (chiziladigan) va hajmli (ushlab ko‘riladigan) turlarga bo‘linadi.",
    keyPoints: [
      "Doira, kvadrat va uchburchak — yassi geometrik shakllar.",
      "Kub, shar, silindr va konus — fazoviy (hajmli) shakllar.",
      "Kublardan minoralar qurishda ularning tekis tomonlari ustma-ust qo‘yiladi."
    ],
    miniExample: {
      emojis: "🟡 ⚽ 🧊",
      text: "Qog‘ozdagi doira yassi, haqiqiy koptok esa hajmli shar!"
    },
    xpReward: 85,
    coinReward: 10,
    estMinutes: 7,
    practice: [
      {
        text: "Futbol to‘pi ⚽ qaysi shaklga misol bo‘ladi?",
        correctAnswer: "Shar (hajmli shakl)",
        distractors: ["Kvadrat", "Uchburchak", "To‘g‘ri to‘rtburchak"],
        explanation: "Futbol to‘pi dumaloq hajmli shar shaklidadir."
      },
      {
        text: "Qog‘ozga chizilgan kvadrat qanday shakl?",
        correctAnswer: "Yassi shakl",
        distractors: ["Hajmli shakl", "Shar", "Piramida"],
        explanation: "Qog‘ozdagi chizma tekis yassi yuzada joylashgan."
      },
      {
        text: "Bolalar o‘ynaydigan kubik 🧊 qanday shakl?",
        correctAnswer: "Kub (hajmli shakl)",
        distractors: ["Doira", "Uchburchak", "Kesma"],
        explanation: "O‘yin kubigi 6 ta tomoni teng bo‘lgan hajmli jismdir."
      }
    ],
    test: [
      {
        text: "Quyidagilardan qaysi biri yassi shakl hisoblanadi?",
        correctAnswer: "Uchburchak 🔺",
        distractors: ["Kub 🧊", "Shar ⚽", "Silindr 🛢️"],
        explanation: "Uchburchak tekislikdagi yassi shakldir."
      },
      {
        text: "Quyidagilardan qaysi biri hajmli (fazoviy) shakl?",
        correctAnswer: "Kub 🧊",
        distractors: ["Kvadrat", "Doira", "To‘g‘ri to‘rtburchak"],
        explanation: "Kub fazoda joy egallaydigan hajmli shakldir."
      },
      {
        text: "Doira ⭕ va shar ⚽ o‘rtasidagi asosiy farq nima?",
        correctAnswer: "Doira yassi, shar esa hajmli",
        distractors: ["Doira burchakli", "Shar uchburchak", "Farqi yo‘q"],
        explanation: "Doira tekis qog‘ozda bo‘ladi, shar esa qo‘l bilan ushlanadigan dumaloq jismdir."
      },
      {
        text: "Konserva bankasi 🥫 qaysi geometrik shaklga o‘xshaydi?",
        correctAnswer: "Silindr",
        distractors: ["Kub", "Konus", "Shar"],
        explanation: "Konserva bankasi yuqori va pasti doira bo‘lgan silindr shaklidadir."
      },
      {
        text: "Muzqaymoq qolipi (rojok) 🍦 qaysi shaklga o‘xshaydi?",
        correctAnswer: "Konus",
        distractors: ["Kub", "Silindr", "Shar"],
        explanation: "Muzqaymoq naychasi pastga qarab toraygan konus shaklidadir."
      },
      {
        text: "Misr ehromlari 🏜️ qaysi shaklga misol bo‘ladi?",
        correctAnswer: "Piramida",
        distractors: ["Shar", "Kub", "Silindr"],
        explanation: "Qadimgi Misr ehromlari piramida shaklida qurilgan."
      },
      {
        text: "Kvadratning nechta burchagi bor?",
        correctAnswer: "4 ta burchagi",
        distractors: ["3 ta burchagi", "5 ta burchagi", "Burchagi yo‘q"],
        explanation: "Kvadratda 4 ta to‘g‘ri burchak va 4 ta teng tomon bor."
      },
      {
        text: "Uchburchakning nechta tomoni bor?",
        correctAnswer: "3 ta tomoni",
        distractors: ["4 ta tomoni", "2 ta tomoni", "5 ta tomoni"],
        explanation: "Uchburchak uchta tomonga va uchta burchakka ega."
      },
      {
        text: "Doiraning nechta burchagi bor?",
        correctAnswer: "Burchagi yo‘q (0 ta)",
        distractors: ["1 ta burchagi", "2 ta burchagi", "4 ta burchagi"],
        explanation: "Doira silliq egri chiziqdan iborat, uning burchagi bo‘lmaydi."
      },
      {
        text: "3 ta kubikni 🧊🧊🧊 ustma-ust qo‘ysak nima hosil bo‘ladi?",
        correctAnswer: "Minora",
        distractors: ["Shar", "Doira", "Uchburchak"],
        explanation: "Kubiklarni ustma-ust terib baland minora yasaladi."
      },
      {
        text: "Qaysi shaklni stol ustida oson dumalatish mumkin?",
        correctAnswer: "Shar ⚽",
        distractors: ["Kub 🧊", "Kvadrat taxtacha", "Kitob 📖"],
        explanation: "Shar dumaloq bo‘lgani uchun har qanday tomonga oson dumalaydi."
      },
      {
        text: "G‘isht 🧱 qaysi shaklga misol bo‘ladi?",
        correctAnswer: "To‘g‘ri to‘rtburchakli parallelepiped (quti shakli)",
        distractors: ["Shar", "Konus", "Doira"],
        explanation: "G‘isht va kitoblar quti kabi to‘rtburchakli hajmli shaklga ega."
      },
      {
        text: "Quyidagilardan qaysi biri yassi shakllar guruhiga kiradi?",
        correctAnswer: "Doira, kvadrat, uchburchak",
        distractors: ["Shar, kub, silindr", "Konus, piramida, kub", "Koptok, muzqaymoq, quti"],
        explanation: "Doira, kvadrat va uchburchak yassi geometrik shakllardir."
      },
      {
        text: "Quyidagilardan qaysi biri hajmli jismlar guruhiga kiradi?",
        correctAnswer: "Kub, shar, silindr",
        distractors: ["Kvadrat, uchburchak, doira", "Nuqta, kesma, nur", "Chiziq, burchak, qalam"],
        explanation: "Kub, shar va silindr fazoviy hajmli shakllardir."
      },
      {
        text: "Kvadrat bilan to‘g‘ri to‘rtburchakning o‘xshashligi nimada?",
        correctAnswer: "Ikkalasida ham 4 ta burchak va 4 ta tomon bor",
        distractors: ["Ikkalasi ham dumaloq", "Burchaklari yo‘q", "Faqat 3 ta tomoni bor"],
        explanation: "Kvadrat ham, to‘rtburchak ham to‘rtta tomon va burchakka ega."
      },
      {
        text: "Yo‘l belgisidagi 'Xavfli burilish' belgisi ⚠️ qanday shaklda?",
        correctAnswer: "Uchburchak",
        distractors: ["Doira", "Kvadrat", "Shar"],
        explanation: "Ogohlantiruvchi yo‘l belgilari uchburchak shaklida bo‘ladi."
      },
      {
        text: "Tanga 🪙 yuzasi qanday shaklda?",
        correctAnswer: "Doira",
        distractors: ["Kvadrat", "Uchburchak", "Kub"],
        explanation: "Tanganing ustki yuzasi doira shaklidadir."
      },
      {
        text: "Akmal 4 ta kubikdan minora qurdi. Kubiklar soni nechta?",
        correctAnswer: "4 ta",
        distractors: ["3 ta", "5 ta", "6 ta"],
        explanation: "Minorada 4 ta kubik ishlatilgan."
      },
      {
        text: "Quyosh nuri yerga tushganda yerdagi soya qanday shakl?",
        correctAnswer: "Yassi soya",
        distractors: ["Hajmli kub", "Shar", "Silindr"],
        explanation: "Soya yer yuzasida yassi holda ko‘rinadi."
      },
      {
        text: "Sardor qog‘ozdan kub yasadi. Kubning barcha tomonlari qanday shaklda?",
        correctAnswer: "Kvadrat shaklida",
        distractors: ["Doira shaklida", "Uchburchak shaklida", "Oval shaklida"],
        explanation: "Kubning 6 ta tomoni bir xil kvadratlardan iborat."
      }
    ]
  },

  // 6. Vaqt bo‘yicha ketma-ketlik
  {
    bookNumber: 6,
    title: "Vaqt bo‘yicha ketma-ketlik",
    emoji: "⏰",
    shortDesc: "Oldin va keyin, birinchi va oxirgi, hafta kunlari va fasllar.",
    intro: "Voqealar vaqt bo‘yicha ketma-ket, birin-ketin sodir bo‘ladi.",
    keyPoints: [
      "Kunda ertalab, tush va kechqurun vaqtlari almashadi.",
      "Haftada 7 kun bor: Dushanbadan Yakshangabagacha.",
      "Yilda 4 fasl bor: bahor, yoz, kuz va qish."
    ],
    miniExample: {
      emojis: "🌱 🌿 🌸",
      text: "Urug‘ ekiladi, unib chiqadi, so‘ng gul ochadi!"
    },
    xpReward: 80,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Kunning boshlanishi qaysi vaqt?",
        correctAnswer: "Ertalab 🌅",
        distractors: ["Tush payti ☀️", "Kechqurun 🌙", "Yarim tun 🌌"],
        explanation: "Kun quyosh chiqishi bilan, ertalab boshlanadi."
      },
      {
        text: "Haftada nechta kun bor?",
        correctAnswer: "7 ta kun",
        distractors: ["5 ta kun", "6 ta kun", "10 ta kun"],
        explanation: "Bir hafta roppa-rosa 7 kundan iborat."
      },
      {
        text: "Qor qaysi faslda yog‘adi?",
        correctAnswer: "Qishda ❄️",
        distractors: ["Yozda ☀️", "Bahorda 🌸", "Kuzda 🍂"],
        explanation: "Qor sovuq qish faslida yog‘adi."
      }
    ],
    test: [
      {
        text: "Uyg‘ongandan so‘ng birinchi navbatda nima qilinadi?",
        correctAnswer: "Yuvinib, badantarbiya qilinadi 🪥",
        distractors: ["Dars qilib uxlab qolinadi", "Kechki ovqat yeyiladi", "Quyosh botishi kutiladi"],
        explanation: "Ertalab turib yuz-qo‘lni yuvish va badantarbiya qilish salomatlik garovidir."
      },
      {
        text: "Maktabga borishdan oldin nima qilinadi?",
        correctAnswer: "Ertalabki nonushta qilinadi 🥪",
        distractors: ["Uyquga yotiladi", "Daftarlar yig‘ishtirib uxlab qolinadi", "Kechki chiroq o‘chiriladi"],
        explanation: "Ertalab nonushta qilib, so‘ng maktabga boriladi."
      },
      {
        text: "Ertalabdan keyin kunning qaysi qismi keladi?",
        correctAnswer: "Kunduzi (tush payti) ☀️",
        distractors: ["Kechqurun 🌙", "Tong saharlik", "Tungi uyqu"],
        explanation: "Ertalabdan so‘ng kunduzi (tush vaqti) keladi."
      },
      {
        text: "Kechqurundan keyin qaysi vaqt keladi?",
        correctAnswer: "Tun (uyqu vaqti) 🌌",
        distractors: ["Tush payti", "Tong", "Kunduzi"],
        explanation: "Kechqurundan so‘ng tun kiradi va dam olinadi."
      },
      {
        text: "Haftaning birinchi kuni qaysi?",
        correctAnswer: "Dushanba",
        distractors: ["Seshanba", "Juma", "Yakshanba"],
        explanation: "Hafta Dushanba kunidan boshlanadi."
      },
      {
        text: "Dushanbadan keyin qaysi kun keladi?",
        correctAnswer: "Seshanba",
        distractors: ["Chorshanba", "Payshanba", "Shanba"],
        explanation: "Dushanbadan keyin Seshanba kuni keladi."
      },
      {
        text: "Jumadan keyin qaysi kun keladi?",
        correctAnswer: "Shanba",
        distractors: ["Payshanba", "Yakshanba", "Chorshanba"],
        explanation: "Juma kunidan so‘ng Shanba kuni keladi."
      },
      {
        text: "Haftaning oxirgi (dam olish) kuni qaysi?",
        correctAnswer: "Yakshanba",
        distractors: ["Dushanba", "Juma", "Seshanba"],
        explanation: "Yakshanba haftaning yettinchi, dam olish kunidir."
      },
      {
        text: "Bir yilda nechta fasl bor?",
        correctAnswer: "4 ta fasl (bahor, yoz, kuz, qish)",
        distractors: ["3 ta fasl", "5 ta fasl", "12 ta fasl"],
        explanation: "Yil 4 ta fasldan iborat."
      },
      {
        text: "Daraxtlar gullab, tabiat uyg‘onadigan fasl qaysi?",
        correctAnswer: "Bahor 🌸",
        distractors: ["Qish ❄️", "Kuz 🍂", "Yoz ☀️"],
        explanation: "Bahorda kunlar isib, gullar va daraxtlar ochiladi."
      },
      {
        text: "Meva va poliz ekinlari pishib, eng issiq bo‘ladigan fasl qaysi?",
        correctAnswer: "Yoz ☀️",
        distractors: ["Qish ❄️", "Bahor 🌸", "Kuz 🍂"],
        explanation: "Yoz eng issiq fasl bo‘lib, mevalar g‘arq pishadi."
      },
      {
        text: "Daraxt barglari sarg‘ayib to‘kiladigan fasl qaysi?",
        correctAnswer: "Kuz 🍂",
        distractors: ["Bahor 🌸", "Yoz ☀️", "Qish ❄️"],
        explanation: "Kuzda barglar sarg‘ayadi va hosil yig‘ishtirib olinadi."
      },
      {
        text: "Qishdan keyin qaysi fasl keladi?",
        correctAnswer: "Bahor 🌸",
        distractors: ["Kuz 🍂", "Yoz ☀️", "Yana qish ❄️"],
        explanation: "Qahraton qishdan so‘ng iliq bahor fasli boshlanadi."
      },
      {
        text: "Svetofor qizil chirog‘idan 🔴 so‘ng tayyorgarlik uchun qaysi rang yonadi?",
        correctAnswer: "Sariq 🟡",
        distractors: ["Yashil 🟢", "Ko‘k 🔵", "Oq ⚪"],
        explanation: "Qizildan keyin sariq chiroq yonib, harakatga tayyorlanishni bildiradi."
      },
      {
        text: "Sariq chiroqdan so‘ng o‘tishga ruxsat beruvchi qaysi rang yonadi?",
        correctAnswer: "Yashil 🟢",
        distractors: ["Qizil 🔴", "Ko‘k 🔵", "Binafsha 🟣"],
        explanation: "Yashil chiroq yonganda yo‘ldan o‘tish mumkin."
      },
      {
        text: "Tuxumdan 🥚 jo‘ja 🐣 chiqishi uchun avval nima bo‘lishi kerak?",
        correctAnswer: "Tovuq tuxumni bosib, isitishi kerak",
        distractors: ["Jo‘ja tuxumga kirishi kerak", "Tuxum muzlatgichga qo‘yilishi kerak", "Tuxum qovurilishi kerak"],
        explanation: "Tovuq mehr bilan tuxumni isitgach, undan mitti jo‘ja ochib chiqadi."
      },
      {
        text: "Kitob o‘qishdan oldin nima qilinadi?",
        correctAnswer: "Kitob ochiladi 📖",
        distractors: ["Kitob yopiladi", "Uxlab dam olinadi", "Kitob javonga solinadi"],
        explanation: "O‘qish uchun avval kitobning kerakli sahifasi ochiladi."
      },
      {
        text: "Bugun Dushanba bo‘lsa, ertaga qaysi kun bo‘ladi?",
        correctAnswer: "Seshanba",
        distractors: ["Chorshanba", "Yakshanba", "Juma"],
        explanation: "Dushanbadan keyingi kun — Seshanbadir."
      },
      {
        text: "Bugun Juma bo‘lsa, kecha qaysi kun edi?",
        correctAnswer: "Payshanba",
        distractors: ["Shanba", "Chorshanba", "Seshanba"],
        explanation: "Jumadan oldingi kun — Payshanba bo‘lgan."
      },
      {
        text: "Ali nonushta qildi, so‘ng maktabga bordi, darsdan keyin uyga qaytib dars tayyorladi. Eng oxirgi ish qaysi?",
        correctAnswer: "Uyda dars tayyorlash",
        distractors: ["Nonushta qilish", "Maktabga borish", "Tongda uyg‘onish"],
        explanation: "Ketma-ketlikdagi oxirgi voqea dars tayyorlashdir."
      }
    ]
  },

  // 7. Narsalar guruhi
  {
    bookNumber: 7,
    title: "Narsalar guruhi",
    emoji: "🍎",
    shortDesc: "Umumiy nom, mevalar, hayvonlar, kiyimlar, ortiqchasini topish.",
    intro: "Umumiy xossaga ega narsalarni bir guruhga to‘plab, ularga bitta nom beramiz.",
    keyPoints: [
      "Olma, nok va anor — bu mevalar guruhi.",
      "Mushuk, it va ot — bu hayvonlar guruhi.",
      "Guruhdagi boshqalarga o‘xshamagan narsaga ortiqcha narsa deyiladi."
    ],
    miniExample: {
      emojis: "🍎 🍐 🍇 👟",
      text: "Olma, nok, uzum — mevalar. Poyabzal esa ortiqcha!"
    },
    xpReward: 80,
    coinReward: 10,
    estMinutes: 6,
    practice: [
      {
        text: "Quyidagilarni bitta so‘z bilan nima deymiz: olma 🍎, o‘rik 🍑, gilos 🍒?",
        correctAnswer: "Mevalar",
        distractors: ["Sabzavotlar", "O‘yinchoqlar", "Idishlar"],
        explanation: "Olma, o‘rik va gilos mevalar hisoblanadi."
      },
      {
        text: "Quyidagi guruhda qaysi biri ortiqcha: ko‘ylak 👗, shim 👖, etik 👢, qalam ✏️?",
        correctAnswer: "Qalam ✏️ (u o‘quv quroli, kiyim emas)",
        distractors: ["Ko‘ylak 👗", "Shim 👖", "Etik 👢"],
        explanation: "Qolgan uchtasi kiyim-kechak, qalam esa kiyim emas."
      },
      {
        text: "Likopcha 🍽️, piyola 🥣 va qoshiq 🥄 qaysi guruhga kiradi?",
        correctAnswer: "Idish-tovoqlar",
        distractors: ["Mevalar", "Kiyimlar", "Transport"],
        explanation: "Ovqatlanishda ishlatiladigan narsalar idish-tovoqlar deyiladi."
      }
    ],
    test: [
      {
        text: "Bodring 🥒, pomidor 🍅 va sabzi 🥕 bitta so‘z bilan nima deyiladi?",
        correctAnswer: "Sabzavotlar",
        distractors: ["Mevalar", "Kiyimlar", "O‘yinchoqlar"],
        explanation: "Bodring, pomidor va sabzi sabzavotlar guruhiga kiradi."
      },
      {
        text: "Bo‘ri 🐺, tulki 🦊 va ayiq 🐻 qaysi guruhga kiradi?",
        correctAnswer: "Yovvoyi hayvonlar",
        distractors: ["Uy hayvonlari", "Qushlar", "Hasharotlar"],
        explanation: "Ular o‘rmonda yashaydigan yovvoyi hayvonlardir."
      },
      {
        text: "Sigir 🐄, qo‘y 🐑 va echki 🐐 qaysi guruhga kiradi?",
        correctAnswer: "Uy hayvonlari",
        distractors: ["Yovvoyi hayvonlar", "Baliqlar", "O‘simliklar"],
        explanation: "Odamlar parvarish qiladigan hayvonlar uy hayvonlari deyiladi."
      },
      {
        text: "Chumoli 🐜, kapalak 🦋 va asalari 🐝 qaysi guruhga kiradi?",
        correctAnswer: "Hasharotlar",
        distractors: ["Qushlar", "Baliqlar", "Sutemizuvchilar"],
        explanation: "Kapalak, asalari va chumoli hasharotlar oilasiga mansub."
      },
      {
        text: "Avtobus 🚌, metro 🚇 va tramvay 🚋 qaysi guruhga kiradi?",
        correctAnswer: "Jamoat transporti",
        distractors: ["Uy jihozlari", "O‘quv qurollari", "Oziq-ovqat"],
        explanation: "Odamlarni tashiydigan vositalar transport deyiladi."
      },
      {
        text: "Daftar 📓, qalam ✏️, o‘chirg‘ich 🧼 va chizg‘ich 📏 nima deyiladi?",
        correctAnswer: "O‘quv qurollari",
        distractors: ["Oshxona anjomlari", "Kiyimlar", "Musiqa asboblari"],
        explanation: "Maktabda ishlatiladigan narsalar o‘quv qurollaridir."
      },
      {
        text: "Quyidagi qatorda qaysi narsa ortiqcha: 🍎, 🍌, 🍊, 🪑?",
        correctAnswer: "Stul 🪑 (u mebel, meva emas)",
        distractors: ["Olma 🍎", "Banan 🍌", "Apelsin 🍊"],
        explanation: "Stul o‘tirish uchun mebel, qolganlari esa mevadir."
      },
      {
        text: "Quyidagilar ichida qaysi biri ortiqcha: 🚌, 🚗, 🚲, 🦅?",
        correctAnswer: "Burgut 🦅 (u qush, transport emas)",
        distractors: ["Avtobus 🚌", "Mashina 🚗", "Velosiped 🚲"],
        explanation: "Burgut tirik qush, qolganlari esa texnika vositalaridir."
      },
      {
        text: "Qaysi guruhdagi barcha narsalar mevalardan iborat?",
        correctAnswer: "Olma 🍎, anor 🫐, shaftoli 🍑",
        distractors: ["Pomidor 🍅, sabzi 🥕, kartoshka 🥔", "Non 🍞, choy ☕, qand 🍬", "Koptok ⚽, qo‘g‘irchoq 🪆, mashina 🚗"],
        explanation: "Olma, anor va shaftoli shirin mevalardir."
      },
      {
        text: "Qaysi guruhdagi barcha narsalar idish-tovoqlardan iborat?",
        correctAnswer: "Choynak 🫖, piyola 🥣, qoshiq 🥄",
        distractors: ["Etik 👢, do‘ppi 🧢, ro‘mol 🧣", "Kitob 📖, daftar 📓, ruchka 🖊️", "Velosiped 🚲, aravacha 🛒, samolyot ✈️"],
        explanation: "Choynak, piyola va qoshiq oshxona idishlaridir."
      },
      {
        text: "Do‘ppi 🧢, chopon 👘 va kamzul 🦺 qaysi guruhga kiradi?",
        correctAnswer: "Milliy kiyimlar",
        distractors: ["O‘yinchoqlar", "O‘quv anjomlari", "Meva-chevalar"],
        explanation: "Do‘ppi va chopon o‘zbek xalqining milliy kiyimlaridir."
      },
      {
        text: "Guruhda nechta meva bor: 🍎, 🍐, 🚗, 🍌?",
        correctAnswer: "3 ta meva (olma, nok, banan)",
        distractors: ["4 ta meva", "2 ta meva", "1 ta meva"],
        explanation: "Mashina meva emas, mevalar soni 3 ta."
      },
      {
        text: "Guruhda nechta hayvon bor: 🐶, 🐱, 📱, 🐰?",
        correctAnswer: "3 ta hayvon (kuchukcha, mushukcha, quyoncha)",
        distractors: ["4 ta hayvon", "2 ta hayvon", "5 ta hayvon"],
        explanation: "Telefon hayvon emas, hayvonlar 3 ta."
      },
      {
        text: "Dutor, doira va nay qaysi guruhga kiradi?",
        correctAnswer: "Milliy musiqa asboblari 🎵",
        distractors: ["Sport jihozlari", "Oshxona anjomlari", "Bog‘dorchilik asboblari"],
        explanation: "Dutor va doira o‘zbek milliy musiqa cholg‘ularidir."
      },
      {
        text: "Koptok ⚽, charxpalak 🎡 va piramida 🪆 o‘yinchog‘i nima deyiladi?",
        correctAnswer: "O‘yinchoqlar",
        distractors: ["Sabzavotlar", "Kiyimlar", "Darsliklar"],
        explanation: "Bolalar o‘ynaydigan buyumlar o‘yinchoqlar deyiladi."
      },
      {
        text: "Quyidagilardan qaysi biri ortiqcha: ⚽, 🏀, 🏐, 🥪?",
        correctAnswer: "Sendvich 🥪 (u yegulik, koptok emas)",
        distractors: ["Futbol koptogi ⚽", "Basketbol koptogi 🏀", "Voleybol koptogi 🏐"],
        explanation: "Uchtasi sport koptoklari, sendvich esa oziq-ovqat."
      },
      {
        text: "Quyidagilardan qaysi biri 'Uy hayvonlari' guruhiga kirmaydi?",
        correctAnswer: "Sher (arslon) 🦁",
        distractors: ["Kuchukcha 🐕", "Mushukcha 🐈", "Echki 🐐"],
        explanation: "Sher yirtqich yovvoyi hayvon, uyda boqilmaydi."
      },
      {
        text: "Ikki guruh berilgan: 1-guruhda 3 ta olma 🍎🍎🍎, 2-guruhda 3 ta nok 🍐🍐🍐. Guruhlar soni tengmi?",
        correctAnswer: "Teng (ikkalasida ham 3 tadan)",
        distractors: ["1-guruh ko‘p", "2-guruh ko‘p", "Taqqoslab bo‘lmaydi"],
        explanation: "3 ta olma va 3 ta nok miqdor jihatdan bir-biriga tengdir (3 = 3)."
      },
      {
        text: "Anvar savatga 2 ta daftar, 3 ta qalam va 1 ta olma soldi. Savatda nechta o‘quv quroli bor?",
        correctAnswer: "5 ta o‘quv quroli (2 ta daftar + 3 ta qalam)",
        distractors: ["6 ta", "4 ta", "1 ta"],
        explanation: "Olma meva, o‘quv qurollari esa 2 + 3 = 5 ta."
      },
      {
        text: "Zeboxon xonasini yig‘ishtirib, qo‘g‘irchoqlarni bitta qutiga, kitoblarni esa javonga qo‘ydi. U buyumlarni nima qildi?",
        correctAnswer: "Guruhlarga ajratib tartibga soldi",
        distractors: ["Hammasini aralashtirib tashladi", "Buzib qo‘ydi", "Yo‘qotib qo‘ydi"],
        explanation: "Buyumlarni xossasiga qarab ajratish tartib-intizom keltiradi."
      }
    ]
  },

  // 8. Guruhlarni taqqoslash
  {
    bookNumber: 8,
    title: "Guruhlarni taqqoslash",
    emoji: "⚖️",
    shortDesc: "Ko‘p, kam, teng, shuncha, juftlab taqqoslash va yetmayotgan narsa.",
    intro: "Guruhlardagi narsalarni birma-bir juftlab, qaysi biri ko‘p yoki kamligini bilamiz.",
    keyPoints: [
      "Har bir narsaga juft topilsa va ortib qolmasa, guruhlar teng bo‘ladi.",
      "Jufti yetmagan guruh kam, ortib qolgani esa ko‘p bo‘ladi.",
      "Tenglikni bildirish uchun 'teng' (=) so‘zi ishlatiladi."
    ],
    miniExample: {
      emojis: "☕ ☕ ☕ va 🍽️ 🍽️",
      text: "3 ta finjon va 2 ta likopcha: finjonlar ko‘p, likopcha kam!"
    },
    xpReward: 85,
    coinReward: 10,
    estMinutes: 7,
    practice: [
      {
        text: "3 ta quyonchaga 🐰🐰🐰 3 ta sabzi 🥕🥕🥕 berildi. Har biriga yetadimi?",
        correctAnswer: "Yetadi, sabzilar quyonchalar soniga teng",
        distractors: ["Yetmaydi", "Sabzi ko‘p", "Quyonlar ko‘p"],
        explanation: "3 ta quyonchaga 3 ta sabzi teng bo‘ladi (3 = 3)."
      },
      {
        text: "4 ta bola 👦👦👦👦 va 3 ta stul 🪑🪑🪑 bor. Stul yetadimi?",
        correctAnswer: "Yetmaydi, 1 ta stul yetishmaydi",
        distractors: ["Yetadi", "Stul ortib qoladi", "2 ta stul yetmaydi"],
        explanation: "4 ta bolaga 3 ta stul yetmaydi, 1 ta stul kam."
      },
      {
        text: "5 ta olma 🍎 va 5 ta nok 🍐 soni haqida nima deyish mumkin?",
        correctAnswer: "Ular teng miqdorda (shuncha)",
        distractors: ["Olma ko‘p", "Nok ko‘p", "Ikkalasi ham nol"],
        explanation: "5 va 5 o‘zaro teng sonlardir."
      }
    ],
    test: [
      {
        text: "1-guruhda: 🍎 🍎 🍎 🍎 (4 ta olma). 2-guruhda: 🍐 🍐 (2 ta nok). Qaysi biri ko‘p?",
        correctAnswer: "Olma ko‘p",
        distractors: ["Nok ko‘p", "Ikkalasi teng", "Olma kam"],
        explanation: "4 ta olma 2 ta nokdan ko‘pdir (4 > 2)."
      },
      {
        text: "1-guruhda: ⚽ ⚽ (2 ta to‘p). 2-guruhda: ⚽ ⚽ ⚽ ⚽ ⚽ (5 ta to‘p). 1-guruh haqida nima deymiz?",
        correctAnswer: "1-guruhda to‘plar kam",
        distractors: ["1-guruhda to‘plar ko‘p", "Ikkalasi teng", "1-guruhda to‘p yo‘q"],
        explanation: "2 ta to‘p 5 tadan kamdir."
      },
      {
        text: "3 ta bolaga 3 ta muzqaymoq 🍦 berildi. Muzqaymoq yetadimi?",
        correctAnswer: "Yetadi, bolalar soni bilan teng",
        distractors: ["Yetmaydi, kam", "Ortib qoladi", "Muzqaymoq yo‘q"],
        explanation: "3 ta bolaga 3 ta muzqaymoq to‘liq yetadi."
      },
      {
        text: "Stolda 5 ta piyola 🥣 va 4 ta qoshiq 🥄 bor. Nechta qoshiq yetishmayapti?",
        correctAnswer: "1 ta qoshiq yetishmayapti",
        distractors: ["2 ta qoshiq", "Yetarli", "Qoshiq ortib qolgan"],
        explanation: "5 ta piyolaga 5 ta qoshiq kerak, demak 1 ta qoshiq yetmaydi (5 − 4 = 1)."
      },
      {
        text: "Bog‘chada 6 ta stul va 6 ta bola bor. Bolalar stulga o‘tirsa stul qoladimi?",
        correctAnswer: "Hamma bolaga stul yetadi va ortib qolmaydi",
        distractors: ["1 ta stul ortib qoladi", "2 ta stul yetmaydi", "Bolalar sig‘maydi"],
        explanation: "6 = 6 bo‘lgani uchun stullar va bolalar soni teng."
      },
      {
        text: "Savatda 7 ta qizil olma va 4 ta sariq olma bor. Qaysi rangdagi olma ko‘p?",
        correctAnswer: "Qizil olma ko‘p",
        distractors: ["Sariq olma ko‘p", "Ikkalasi teng", "Qizil olma kam"],
        explanation: "7 soni 4 dan katta, shuning uchun qizil olmalar ko‘p."
      },
      {
        text: "Quyidagi taqqoslashlardan qaysi biri to‘g‘ri?",
        correctAnswer: "5 ta kapalak 🦋 > 3 ta kapalak 🦋",
        distractors: ["2 ta koptok > 4 ta koptok", "1 ta kitob > 3 ta kitob", "3 ta gul = 5 ta gul"],
        explanation: "5 soni 3 dan katta (5 > 3)."
      },
      {
        text: "4 ta mashinaga 4 ta haydovchi kerak. 3 ta haydovchi kelsa, nechta yetmaydi?",
        correctAnswer: "1 ta haydovchi yetmaydi",
        distractors: ["2 ta yetmaydi", "Hamma mashina yuradi", "Haydovchi ko‘p"],
        explanation: "4 − 3 = 1 ta haydovchi kam."
      },
      {
        text: "O‘rdakchalar 🦆🦆🦆 va jo‘jalar 🐣🐣🐣🐣🐣 sonini taqqoslang.",
        correctAnswer: "O‘rdakchalar kam (3 < 5)",
        distractors: ["O‘rdakchalar ko‘p", "Ikkalasi teng", "Jo‘jalar kam"],
        explanation: "3 ta o‘rdakcha 5 ta jo‘jadan kamdir."
      },
      {
        text: "2 ta quyonchaga 🐰🐰 4 ta sabzi 🥕🥕🥕🥕 berildi. Sabzilar haqida nima deymiz?",
        correctAnswer: "Sabzilar quyonchalardan ko‘p",
        distractors: ["Sabzilar yetmaydi", "Sabzilar teng", "Sabzi kam"],
        explanation: "4 ta sabzi 2 ta quyondan ko‘p, har biriga 2 tadan to‘g‘ri keladi."
      },
      {
        text: "Guldonada 3 ta atirgul va 3 ta chinnigul bor. Guldondagi gullar soni qanday?",
        correctAnswer: "Atirgul va chinnigullar soni teng",
        distractors: ["Atirgul ko‘p", "Chinnigul ko‘p", "Gullar yo‘q"],
        explanation: "3 ta atirgul va 3 ta chinnigul soni teng (3 = 3)."
      },
      {
        text: "Daftar va qalam juftlandi. 5 ta daftar va 3 ta qalam bo‘lsa, nechta daftar juftsiz qoladi?",
        correctAnswer: "2 ta daftar juftsiz qoladi",
        distractors: ["1 ta daftar", "3 ta daftar", "Hech biri"],
        explanation: "5 − 3 = 2 ta daftar ortib qoladi."
      },
      {
        text: "8 ta bola maydonda o‘ynamoqda. Ulardan 5 tasi o‘g‘il bola, 3 tasi qiz bola. Qaysi biri ko‘p?",
        correctAnswer: "O‘g‘il bolalar ko‘p (5 > 3)",
        distractors: ["Qiz bolalar ko‘p", "Ikkalasi teng", "O‘g‘il bolalar kam"],
        explanation: "5 ta o‘g‘il bola 3 ta qiz boladan ko‘p."
      },
      {
        text: "1 ta mushukcha 🐱 va 3 ta sichqoncha 🐭. Qaysi biri kam?",
        correctAnswer: "Mushukcha kam (1 < 3)",
        distractors: ["Sichqoncha kam", "Ikkalasi teng", "Mushukcha ko‘p"],
        explanation: "1 soni 3 dan kam, demak mushukcha bitta bo‘lib kam."
      },
      {
        text: "Quyidagilardan qaysi biri 'shuncha' so‘zi ma’nosini bildiradi?",
        correctAnswer: "Teng miqdorda (bir xil sonda)",
        distractors: ["Juda ko‘p", "Juda kam", "Bitta ham yo‘q"],
        explanation: "'Shuncha' degani bir xil, teng miqdordagi sonni bildiradi."
      },
      {
        text: "Akmalda 4 ta yong‘oq bor, Salimda ham shuncha yong‘oq bor. Salimda nechta yong‘oq bor?",
        correctAnswer: "4 ta yong‘oq",
        distractors: ["5 ta yong‘oq", "3 ta yong‘oq", "8 ta yong‘oq"],
        explanation: "Shuncha degani 4 ta deganidir."
      },
      {
        text: "Dilnoza 6 ta gul terdi, singlisi esa 4 ta gul terdi. Dilnoza singlisidan nechta ko‘p gul terdi?",
        correctAnswer: "2 ta ko‘p gul terdi",
        distractors: ["1 ta ko‘p", "3 ta ko‘p", "Teng terdi"],
        explanation: "6 − 4 = 2 ta gul ko‘p."
      },
      {
        text: "Tovoqda 5 ta somsa bor edi. 5 ta mehmon keldi. Har bir mehmonga bittadan bersa somsa yetadimi?",
        correctAnswer: "Ha, roppa-rosa yetadi",
        distractors: ["Yo‘q, 1 ta kam", "Somsa ortib qoladi", "2 ta somsa yetmaydi"],
        explanation: "5 ta mehmonga 5 ta somsa aniq yetadi."
      },
      {
        text: "1-bob bo‘yicha xulosa: Narsalarni qaysi belgilari bo‘yicha taqqosladik?",
        correctAnswer: "Shakli, rangi, o‘lchami va soni bo‘yicha",
        distractors: ["Faqat og‘irligi bo‘yicha", "Faqat narxi bo‘yicha", "Hech qanday belgisi bo‘yicha"],
        explanation: "1-bobda narsalarning shakli, rangi, o‘lchami va sanog‘ini o‘rgandik."
      },
      {
        text: "To‘g‘ri tenglikni toping:",
        correctAnswer: "4 = 4",
        distractors: ["4 = 5", "3 = 2", "1 = 0"],
        explanation: "Faqat bir xil sonlar o‘rtasiga tenglik belgisi qo‘yiladi: 4 = 4."
      }
    ]
  }
];

export function runPart1Chapter1() {
  console.log('--- 1-qism I bob (1–8-darslar) yaratilmoqda ---');
  for (const l of lessons) {
    const seed = buildLessonSeed(l);
    saveLessonFile(1, l.bookNumber, seed);
    console.log(`  ✓ Dars ${l.bookNumber}: ${l.title} saqlandi.`);
  }
}

runPart1Chapter1();
