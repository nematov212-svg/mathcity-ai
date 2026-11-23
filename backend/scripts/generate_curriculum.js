import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const curriculumData = [
  // Grade 1
  {
    grade: 1,
    chapter: 'Boshlang‘ich hisob va sonlar',
    lessons: [
      { title: '1 dan 10 gacha bo‘lgan sonlar va sanash', desc: 'Narsalarni sanash, sonlar qatori va miqdorni aniqlash.', formula: '1, 2, 3, \\dots, 10', icon: '123', color: '#10B981' },
      { title: 'Predmetlarni taqqoslash: Katta, kichik, teng', desc: 'Predmetlar miqdorini taqqoslash belgilari: >, <, =.', formula: '5 > 3, \\quad 4 = 4', icon: '><', color: '#3B82F6' },
      { title: '10 ichida qo‘shish amali', desc: 'Predmetlarni birlashtirish orqali qo‘shish amalini bajarish.', formula: '3 + 4 = 7', icon: '+', color: '#059669' },
      { title: '10 ichida ayirish amali', desc: 'Predmetlardan ayirib tashlash va qoldiqni hisoblash.', formula: '8 - 3 = 5', icon: '-', color: '#D97706' },
      { title: 'Nol (0) soni va uning xossasi', desc: 'Bo‘sh to‘plam, son bilan 0 ning yig‘indisi va ayirmasi.', formula: 'a + 0 = a, \\quad a - 0 = a', icon: '0', color: '#6366F1' },
      { title: 'Geometrik shakllar: Doira, kvadrat, uchburchak', desc: 'Atrofdagi geometrik shakllarni ajratish va tanish.', formula: '\\triangle, \\quad \\square, \\quad \\bigcirc', icon: '📐', color: '#8B5CF6' },
      { title: 'Kesma va uning uzunligini o‘lchash (sm)', desc: 'Chizg‘ich bilan kesma chizish va uzunligini aniqlash.', formula: 'AB = 5\\text{ sm}', icon: '📏', color: '#EC4899' },
      { title: '11 dan 20 gacha bo‘lgan sonlar', desc: 'O‘nlik va birliklar xonasi, sonlarni o‘qish va yozish.', formula: '10 + 5 = 15', icon: '15', color: '#14B8A6' },
      { title: '20 ichida xonasidan oshirmay qo‘shish', desc: 'O‘nlikka birlikni qo‘shish va oson hisoblash usuli.', formula: '12 + 3 = 15', icon: '+', color: '#059669' },
      { title: '20 ichida xonasidan oshirmay ayirish', desc: 'O‘nlikdan ortiqcha qismini ayirish qoidalari.', formula: '17 - 4 = 13', icon: '-', color: '#D97706' },
      { title: '20 ichida o‘nlikdan oshirib qo‘shish', desc: 'Sonni 10 ga to‘ldirib qo‘shish usuli.', formula: '8 + 5 = 8 + 2 + 3 = 13', icon: '+', color: '#059669' },
      { title: '20 ichida o‘nlikdan qarz olib ayirish', desc: '10 likdan qarz olib ayirish va tekshirish.', formula: '14 - 6 = 14 - 4 - 2 = 8', icon: '-', color: '#E11D48' },
      { title: 'O‘lchov birliklari: Santimetr va Detsimetr', desc: '1 dm = 10 sm bog‘lanishi va amaliy o‘lchashlar.', formula: '1\\text{ dm} = 10\\text{ sm}', icon: '📏', color: '#F59E0B' },
      { title: 'Massani o‘lchash: Kilogramm (kg)', desc: 'Tarozi, og‘irlikni solishtirish va kilogramm tushunchasi.', formula: 'm = 1\\text{ kg}', icon: '⚖️', color: '#84CC16' },
      { title: 'Sig‘imni o‘lchash: Litr (l)', desc: 'Suyuqliklar hajmini o‘lchash va idishlar sig‘imi.', formula: 'V = 1\\text{ l}', icon: '🥛', color: '#06B6D4' },
      { title: 'Vaqt o‘lchovlari: Soat va minut', desc: 'Soat siferblati, soat millari va kun tartibi.', formula: '1\\text{ soat} = 60\\text{ daqiqa}', icon: '⏰', color: '#8B5CF6' },
      { title: 'Qavsli ifodalar va amallar tartibi', desc: 'Qavs ichidagi amal birinchi bajarilishi qoidasi.', formula: '(4 + 2) + 3 = 9', icon: '()', color: '#6366F1' },
      { title: 'Sonli tengliklar va tengsizliklar', desc: 'Tengliklarni hosil qilish va noma’lum sonni topish.', formula: 'x + 3 = 7 \\implies x = 4', icon: '=', color: '#3B82F6' },
      { title: 'To‘g‘ri to‘rtburchak va ko‘pburchaklar', desc: 'Burchaklar, tomonlar va uchlarni sanash.', formula: 'n = 4\\text{ (to‘rtburchak)}', icon: '🔲', color: '#059669' },
      { title: '1-sinf bo‘yicha takrorlash va mantiqiy misollar', desc: 'Yil davomida o‘rganilgan barcha tushunchalarni mustahkamlash.', formula: '1 \\dots 20\\text{ hisob-kitob}', icon: '🏆', color: '#E11D48' },
    ]
  },

  // Grade 2
  {
    grade: 2,
    chapter: '100 ichida hisoblash va ko‘paytirish asoslari',
    lessons: [
      { title: '100 ichida o‘nliklar bilan sanash', desc: 'O‘nliklar: 10, 20, 30... 100 gacha sanash va yozish.', formula: '10, 20, \\dots, 100', icon: '100', color: '#10B981' },
      { title: 'Ikki xonali sonlarning xona birliklari', desc: 'O‘nliklar va birliklar xona qo‘shiluvchilari yig‘indisi.', formula: '47 = 40 + 7', icon: '47', color: '#3B82F6' },
      { title: '100 ichida qo‘shish va ayirish (ustun shaklida)', desc: 'Xonama-xona ustun usulida to‘g‘ri hisoblash.', formula: '25 + 34 = 59', icon: '±', color: '#059669' },
      { title: 'Qo‘shishning o‘rin almashtirish qonuni', desc: 'Qo‘shiluvchilar o‘rni almashgani bilan yig‘indi o‘zgarmaydi.', formula: 'a + b = b + a', icon: '↔️', color: '#6366F1' },
      { title: 'Qo‘shishning guruhlash qonuni', desc: 'Qulay qo‘shish uchun qo‘shiluvchilarni guruhlash.', formula: '(a + b) + c = a + (b + c)', icon: '∑', color: '#8B5CF6' },
      { title: 'Noma’lum qo‘shiluvchini topish tenglamalari', desc: 'Yig‘indidan ma’lum qo‘shiluvchini ayirib noma’lumni topish.', formula: 'x + 15 = 40 \\implies x = 25', icon: 'x=', color: '#E11D48' },
      { title: 'Ko‘paytirish amali mohiyati', desc: 'Bir xil qo‘shiluvchilar yig‘indisini ko‘paytirish bilan almashtirish.', formula: '3 + 3 + 3 + 3 = 3 \\times 4 = 12', icon: '×', color: '#059669' },
      { title: '2 soniga ko‘paytirish va bo‘lish', desc: '2 ning karra jadvali va juft sonlar tushunchasi.', formula: '2 \\times 6 = 12, \\quad 12 : 2 = 6', icon: '2×', color: '#D97706' },
      { title: '3 soniga ko‘paytirish va bo‘lish', desc: '3 ga ko‘paytirish jadvali va teng 3 qismga taqsimlash.', formula: '3 \\times 7 = 21, \\quad 21 : 3 = 7', icon: '3×', color: '#059669' },
      { title: '4 soniga ko‘paytirish va bo‘lish', desc: '4 karra jadvali va to‘rtdan bir qismni hisoblash.', formula: '4 \\times 8 = 32, \\quad 32 : 4 = 8', icon: '4×', color: '#3B82F6' },
      { title: '5 soniga ko‘paytirish va bo‘lish', desc: '5 ga karra sonlarning 0 yoki 5 bilan tugashi qonuniyati.', formula: '5 \\times 9 = 45, \\quad 45 : 5 = 9', icon: '5×', color: '#10B981' },
      { title: 'Bo‘lish amali va qoldiqsiz bo‘lish', desc: 'Predmetlarni teng ulushlarga ajratish va bo‘linuvchi, bo‘luvchi.', formula: 'a : b = c', icon: '÷', color: '#F59E0B' },
      { title: 'Ko‘paytirish va bo‘lish o‘rtasidagi bog‘lanish', desc: 'Ko‘paytirish natijasini bo‘lish orqali tekshirish.', formula: 'a \\times b = c \\iff c : a = b', icon: '🔄', color: '#6366F1' },
      { title: 'Perimetr tushunchasi: To‘g‘ri to‘rtburchak perimetri', desc: 'Barcha tomonlar uzunliklari yig‘indisini hisoblash.', formula: 'P = 2 \\times (a + b)', icon: '📐', color: '#8B5CF6' },
      { title: 'Kvadrat perimetri va xossalari', desc: 'Kvadratning to‘rtta tomoni tengligi va perimetr formulasi.', formula: 'P = 4 \\times a', icon: '⬜', color: '#EC4899' },
      { title: 'Uzunlik birliklari: Metr (m) va Millimetr (mm)', desc: '1 m = 100 sm = 1000 mm munosabatlari.', formula: '1\\text{ m} = 100\\text{ sm}', icon: '📏', color: '#0891B2' },
      { title: 'Vaqt: Hafta kunlari, oylar va fasllar', desc: 'Kalendar bilan ishlash, 12 oy va 4 fasl ketma-ketligi.', formula: '1\\text{ hafta} = 7\\text{ kun}', icon: '📅', color: '#10B981' },
      { title: 'Massani o‘lchash: Gram (g) va Sentnerlar', desc: '1 kg = 1000 g nisbati va amaliy tortish masalalari.', formula: '1\\text{ kg} = 1000\\text{ g}', icon: '⚖️', color: '#D97706' },
      { title: 'Matnli amaliy masalalarni yechish', desc: '2 bosqichli amaliy matnli masalalar sxemasi.', formula: '(A + B) - C = ?', icon: '📝', color: '#E11D48' },
      { title: '2-sinf bo‘yicha takrorlash va yakuniy test', desc: '2-sinf arifmetika va geometriya materiallari sarhisobi.', formula: '100\\text{ ichida karra jadvali}', icon: '🏆', color: '#059669' },
    ]
  },

  // Grade 3
  {
    grade: 3,
    chapter: '1000 ichida hisoblash va to‘liq karra jadvali',
    lessons: [
      { title: '1000 ichida uch xonali sonlar va xona qo‘shiluvchilari', desc: 'Yuzliklar, o‘nliklar va birliklar xonalari.', formula: '348 = 300 + 40 + 8', icon: '1000', color: '#10B981' },
      { title: 'Uch xonali sonlarni ustun shaklida qo‘shish', desc: 'O‘nlik va yuzlikka o‘tish orqali qo‘shish.', formula: '264 + 158 = 422', icon: '+', color: '#3B82F6' },
      { title: 'Uch xonali sonlarni ustun shaklida ayirish', desc: 'Xonalardan ketma-ket qarz olib ayirish usuli.', formula: '532 - 186 = 346', icon: '-', color: '#D97706' },
      { title: '6 soniga ko‘paytirish va bo‘lish jadvali', desc: '6 ning karra qonuniyatlari va hisoblash sirlari.', formula: '6 \\times 7 = 42, \\quad 42 : 6 = 7', icon: '6×', color: '#059669' },
      { title: '7 soniga ko‘paytirish va bo‘lish jadvali', desc: '7 ning karra jadvali va taqsimot qoidasi.', formula: '7 \\times 8 = 56, \\quad 56 : 7 = 8', icon: '7×', color: '#6366F1' },
      { title: '8 soniga ko‘paytirish va bo‘lish jadvali', desc: '8 karra jadvali va 2 va 4 bilan bog‘liqligi.', formula: '8 \\times 9 = 72, \\quad 72 : 8 = 9', icon: '8×', color: '#8B5CF6' },
      { title: '9 va 10 ga ko‘paytirish hamda bo‘lish', desc: '9 ga ko‘paytirishda raqamlar yig‘indisi xossasi va 10 ga nol qo‘shish.', formula: '9 \\times 6 = 54, \\quad 10 \\times a = a0', icon: '9×', color: '#E11D48' },
      { title: 'Qoldiqli bo‘lish amali', desc: 'Qoldiq bo‘luvchidan doimo kichik bo‘lishi qoidasi.', formula: 'a = b \\times q + r, \\quad r < b', icon: 'r', color: '#F59E0B' },
      { title: 'Amallar bajarilish tartibi va qavslar', desc: 'Ko‘paytirish va bo‘lish birinchi, qo‘shish va ayirish keyin.', formula: '20 + 5 \\times 4 = 40', icon: '()', color: '#0891B2' },
      { title: 'Bir noma’lumli oddiy tenglamalar', desc: 'Noma’lum ko‘paytuvchi va bo‘linuvchini topish.', formula: 'x \\times 6 = 48 \\implies x = 8', icon: 'x=', color: '#10B981' },
      { title: 'Yuza tushunchasi: Kvadrat santimetr (sm²)', desc: 'Yuzani kvadrat panjara yordamida o‘lchash.', formula: 'S = 1\\text{ sm}^2', icon: '⬛', color: '#3B82F6' },
      { title: 'To‘g‘ri to‘rtburchakning yuzini hisoblash', desc: 'Bo‘yi va enini bir-biriga ko‘paytirish formulasi.', formula: 'S = a \\times b', icon: '📐', color: '#059669' },
      { title: 'Kvadratning yuzini hisoblash formulasi', desc: 'Kvadrat tomonining ikkinchi darajasi (kvadrati).', formula: 'S = a \\times a = a^2', icon: '◻️', color: '#D97706' },
      { title: 'Vaqt birliklari: Asr, yil, sutka, sekund', desc: '1 asr = 100 yil, 1 sutka = 24 soat, 1 daqiqa = 60 sek.', formula: '1\\text{ sutka} = 24\\text{ soat}', icon: '⏳', color: '#6366F1' },
      { title: 'Tezlik, vaqt va masofa formulasi (S = v × t)', desc: 'Harakat masalalarining boshlang‘ich formulasi.', formula: 'S = v \\times t, \\quad v = S : t', icon: '🚗', color: '#8B5CF6' },
      { title: 'Narx, miqdor va qiymat masalalari', desc: 'Qiymat = Narx × Miqdor iqtisodiy formulasi.', formula: 'C = p \\times n', icon: '💰', color: '#CA8A04' },
      { title: 'Aylana va doira: Radius va Diametr', desc: 'Sirkul yordamida chizish, d = 2 × r munosabati.', formula: 'd = 2 \\times r', icon: '⭕', color: '#EC4899' },
      { title: 'Simmetriya o‘qi va geometrik naqshlar', desc: 'O‘q bo‘yicha simmetrik shakllar va naqshlar yaratish.', formula: 'A \\leftrightarrow A\'', icon: '🦋', color: '#0891B2' },
      { title: 'Diagrammalar va jadvallar bilan ishlash', desc: 'Ustunli diagrammalardan ma’lumotlarni o‘qish.', formula: '\\text{Ma’lumotlar tahlili}', icon: '📊', color: '#10B981' },
      { title: '3-sinf bo‘yicha takrorlash va karra jadvali olimpiadasi', desc: '3-sinf materiallari yuzasidan tezkor olimpiada savollari.', formula: '10 \\times 10\\text{ to‘liq jadval}', icon: '🏆', color: '#E11D48' },
    ]
  },

  // Grade 4
  {
    grade: 4,
    chapter: 'Ko‘p xonali sonlar va kasrlar asoslari',
    lessons: [
      { title: 'Ko‘p xonali sonlar: Millionlar va sinflar', desc: 'Birliklar, mingliklar va millionlar sinflari.', formula: '1\\ 000\\ 000\\text{ (million)}', icon: '1M', color: '#10B981' },
      { title: 'Ko‘p xonali sonlarni qo‘shish va ayirish', desc: 'Katta sonlarni ustun shaklida xatolariz bajarish.', formula: '145\\ 200 + 328\\ 950', icon: '±', color: '#3B82F6' },
      { title: 'Ko‘p xonali sonni bir xonali songa ko‘paytirish', desc: 'Ustun ko‘rinishida o‘ngdan chapga ko‘paytirish.', formula: '4\\ 215 \\times 3 = 12\\ 645', icon: '×', color: '#059669' },
      { title: 'Ko‘p xonali sonni ikki xonali songa ko‘paytirish', desc: 'Oraliq natijalarni yozib qo‘shish usuli.', formula: '342 \\times 25 = 8\\ 550', icon: '×', color: '#D97706' },
      { title: 'Ko‘p xonali sonni burchak usulida bo‘lish', desc: 'Burchakli bo‘lish bosqichlari va qoldiqni tekshirish.', formula: '7\\ 848 : 6 = 1\\ 308', icon: '÷', color: '#6366F1' },
      { title: 'Oddiy kasrlar tushunchasi: Surat va maxraj', desc: 'Butunning teng bo‘laklari, surat va maxraj ma’nosi.', formula: '\\frac{3}{4} = \\text{to‘rtdan uch}', icon: '½', color: '#8B5CF6' },
      { title: 'To‘g‘ri va noto‘g‘ri kasrlar', desc: 'Surati maxrajidan kichik yoki katta bo‘lgan kasrlar.', formula: '\\frac{2}{5} < 1, \\quad \\frac{7}{4} > 1', icon: '><', color: '#E11D48' },
      { title: 'Aralash sonlar va ularni noto‘g‘ri kasrga aylantirish', desc: 'Butun va kasr qismdan iborat sonlar.', formula: '2\\frac{1}{3} = \\frac{7}{3}', icon: '2½', color: '#F59E0B' },
      { title: 'Bir xil maxrajli kasrlarni qo‘shish', desc: 'Maxraj o‘zgarmaydi, faqat suratlar qo‘shiladi.', formula: '\\frac{a}{c} + \\frac{b}{c} = \\frac{a+b}{c}', icon: '+', color: '#059669' },
      { title: 'Bir xil maxrajli kasrlarni ayirish', desc: 'Birinchi suratdan ikkinchisi ayiriladi.', formula: '\\frac{a}{c} - \\frac{b}{c} = \\frac{a-b}{c}', icon: '-', color: '#3B82F6' },
      { title: 'Harakatga doir masalalar: Uchrashuv harakati', desc: 'Yaqinlashish tezligi: v = v1 + v2.', formula: 'S = (v_1 + v_2) \\times t', icon: '🚗', color: '#10B981' },
      { title: 'Qarama-qarshi yo‘nalishdagi harakat masalalari', desc: 'Uzoqlashish tezligi va masofani topish.', formula: 'S = (v_1 + v_2) \\times t + S_0', icon: '🚙', color: '#D97706' },
      { title: 'Maydon o‘lchov birliklari: Gektar (ga) va Ar (sotix)', desc: '1 ga = 100 ar = 10 000 m² munosabatlari.', formula: '1\\text{ ga} = 10\\ 000\\text{ m}^2', icon: '🌾', color: '#059669' },
      { title: 'Burchaklar turlari: O‘tkir, to‘g‘ri, o‘tmas va yoyiq', desc: 'Burchaklar gradus o‘lchoviga ko‘ra tasnifi.', formula: '90^\\circ\\text{ to‘g‘ri burchak}', icon: '📐', color: '#6366F1' },
      { title: 'Transportir yordamida burchaklarni o‘lchash (gradus)', desc: 'Transportirni to‘g‘ri qo‘yish va gradusni aniqlash.', formula: '\\angle ABC = 45^\\circ', icon: '🧭', color: '#8B5CF6' },
      { title: 'Uchburchak turlari va uning burchaklari yig‘indisi', desc: 'Teng tomonli, teng yonli va turli tomonli uchburchaklar.', formula: '\\alpha + \\beta + \\gamma = 180^\\circ', icon: '△', color: '#E11D48' },
      { title: 'Fazoviy shakllar: Kub va to‘g‘ri burchakli parallelepiped', desc: 'Yoqlar, qirralar va uchlar sonini aniqlash.', formula: '6\\text{ yoq, } 12\\text{ qirra, } 8\\text{ uch}', icon: '📦', color: '#0891B2' },
      { title: 'Parallelepiped hajmi (V = a × b × c)', desc: 'Uzunlik, kenglik va balandlik ko‘paytmasi.', formula: 'V = a \\times b \\times c', icon: '🧊', color: '#F59E0B' },
      { title: 'Mantiqiy va kombinatorik masalalar', desc: 'Variantlar daraxti va mantiqiy mulohazalar zanjiri.', formula: 'N = n_1 \\times n_2', icon: '💡', color: '#10B981' },
      { title: 'Boshlang‘ich sinf (1–4) bo‘yicha umumiy attestatsiya', desc: 'Boshlang‘ich maktab dasturi bo‘yicha keng qamrovli sinov.', formula: '1\\dots 4\\text{ sinf bilimlari}', icon: '🏆', color: '#E11D48' },
    ]
  },

  // Grade 5
  {
    grade: 5,
    chapter: 'Natural sonlar, bo‘linish va o‘nli kasrlar',
    lessons: [
      { title: 'Natural sonlar va natural sonlar qatori', desc: 'Sanashda ishlatiladigan sonlar va ularning xossalari.', formula: '\\mathbb{N} = \\{1, 2, 3, \\dots\\}', icon: 'N', color: '#10B981' },
      { title: 'Bo‘linish alomatlari: 2, 3, 5, 9 va 10 ga bo‘linish', desc: 'Oxirgi raqam va raqamlar yig‘indisiga ko‘ra bo‘linishni aniqlash.', formula: '3\\mid n \\iff 3\\mid \\sum d_i', icon: '÷', color: '#3B82F6' },
      { title: 'Tub va murakkab sonlar', desc: 'Faqat 1 ga va o‘ziga bo‘linadigan sonlar: 2, 3, 5, 7...', formula: 'p > 1, \\quad D(p) = \\{1, p\\}', icon: 'P', color: '#059669' },
      { title: 'Tub ko‘paytuvchilarga ajratish', desc: 'Har qanday murakkab sonni tub sonlar ko‘paytmasi sifatida yozish.', formula: '60 = 2^2 \\times 3 \\times 5', icon: '∏', color: '#D97706' },
      { title: 'Eng Katta Umumiy Bo‘luvchi (EKUB)', desc: 'Ikkita sonning umumiy tub ko‘paytuvchilari eng kichik darajalari.', formula: '\\text{EKUB}(24, 36) = 12', icon: 'GCD', color: '#6366F1' },
      { title: 'Eng Kichik Umumiy Karrali (EKUK)', desc: 'Berilgan sonlarga qoldiqsiz bo‘linadigan eng kichik natural son.', formula: '\\text{EKUK}(12, 18) = 36', icon: 'LCM', color: '#8B5CF6' },
      { title: 'Oddiy kasrlarning asosiy xossasi', desc: 'Surat va maxrajni bir xil noldan farqli songa ko‘paytirish yoki bo‘lish.', formula: '\\frac{a}{b} = \\frac{a \\times k}{b \\times k}', icon: '½', color: '#E11D48' },
      { title: 'Kasrlarni qisqartirish', desc: 'Kasrning surat va maxrajini ularning EKUBiga bo‘lish.', formula: '\\frac{18}{24} = \\frac{3}{4}', icon: '✂️', color: '#0891B2' },
      { title: 'Turli maxrajli kasrlarni umumiy maxrajga keltirish', desc: 'Maxrajlarning EKUKini topish va qo‘shimcha ko‘paytuvchilar.', formula: '\\frac{1}{6} + \\frac{1}{4} = \\frac{2+3}{12} = \\frac{5}{12}', icon: 'LCD', color: '#F59E0B' },
      { title: 'Turli maxrajli kasrlarni qo‘shish va ayirish', desc: 'Umumiy maxrajga keltirib amallarni bajarish.', formula: '\\frac{a}{b} \\pm \\frac{c}{d} = \\frac{ad \\pm bc}{bd}', icon: '±', color: '#059669' },
      { title: 'Kasrlarni ko‘paytirish va teskari kasrlar', desc: 'Surat suratga, maxraj maxrajga ko‘paytiriladi.', formula: '\\frac{a}{b} \\times \\frac{c}{d} = \\frac{ac}{bd}', icon: '×', color: '#3B82F6' },
      { title: 'Kasrlarni bo‘lish qoidasi', desc: 'Bo‘luvchining teskarisiga ko‘paytirish qoidasi.', formula: '\\frac{a}{b} : \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c}', icon: '÷', color: '#10B981' },
      { title: 'O‘nli kasrlar tushunchasi va yozilishi', desc: 'Maxraji 10, 100, 1000 bo‘lgan kasrlarni vergul bilan yozish.', formula: '\\frac{7}{10} = 0.7, \\quad \\frac{25}{100} = 0.25', icon: '0.1', color: '#6366F1' },
      { title: 'O‘nli kasrlarni qo‘shish va ayirish', desc: 'Vergulni vergul ostiga to‘g‘rilab ustun shaklida hisoblash.', formula: '2.45 + 1.30 = 3.75', icon: '+', color: '#8B5CF6' },
      { title: 'O‘nli kasrlarni ko‘paytirish', desc: 'Vergullarga e’tibor bermay ko‘paytirib, o‘ngdan ajratish.', formula: '0.3 \\times 0.2 = 0.06', icon: '×', color: '#D97706' },
      { title: 'O‘nli kasrlarni natural songa va o‘nli kasrga bo‘lish', desc: 'Bo‘luvchidagi vergulni surish orqali butun songa keltirish.', formula: '4.8 : 1.2 = 48 : 12 = 4', icon: '÷', color: '#059669' },
      { title: 'O‘rta arifmetik qiymatni hisoblash', desc: 'Barcha sonlar yig‘indisini ularning soniga bo‘lish.', formula: '\\bar{x} = \\frac{x_1 + x_2 + \\dots + x_n}{n}', icon: 'Avg', color: '#E11D48' },
      { title: 'O‘nli kasrlarni yaxlitlash qoidalari', desc: 'Keyingi raqam 5 yoki undan katta bo‘lsa bir birlik oshirish.', formula: '3.1415 \\approx 3.14', icon: '≈', color: '#0891B2' },
      { title: 'Masshtab tushunchasi va xaritada masofa', desc: 'Xaritadagi uzunlikning haqiqiy masofaga nisbati.', formula: 'M = 1 : 100\\ 000', icon: '🗺️', color: '#F59E0B' },
      { title: '5-sinf bo‘yicha umumiy takrorlash va yakuniy test', desc: '5-sinf kasrlar va arifmetika mavzularini to‘liq mustahkamlash.', formula: '\\text{Arifmetika yakuni}', icon: '🏆', color: '#10B981' },
    ]
  },

  // Grade 6
  {
    grade: 6,
    chapter: 'Nisbat, proporsiya, foiz va manfiy sonlar',
    lessons: [
      { title: 'Nisbat va proporsiya tushunchasi', desc: 'Ikki sonning bo‘linmasi — nisbat, teng nisbatlar — proporsiya.', formula: '\\frac{a}{b} = \\frac{c}{d}', icon: 'a:b', color: '#10B981' },
      { title: 'Proporsiyaning asosiy xossasi', desc: 'Chetki hadlar ko‘paytmasi o‘rta hadlar ko‘paytmasiga teng.', formula: 'a \\times d = b \\times c', icon: '⚔️', color: '#3B82F6' },
      { title: 'To‘g‘ri va teskari proporsional miqdorlar', desc: 'Bir miqdor ortganda ikkinchisining mutanosib o‘zgarishi.', formula: 'y = kx, \\quad y = \\frac{k}{x}', icon: '📈', color: '#059669' },
      { title: 'Foizlar tushunchasi va o‘nli kasrga aylantirish', desc: '1% — sonning yuzdan bir qismi.', formula: 'p\\% = \\frac{p}{100} = 0.01 \\times p', icon: '%', color: '#D97706' },
      { title: 'Sonning berilgan foizini topish', desc: 'Sonni foizga ko‘paytirib 100 ga bo‘lish.', formula: 'B = \\frac{A \\times p}{100}', icon: '%×', color: '#6366F1' },
      { title: 'Foiziga ko‘ra sonning o‘zini topish', desc: 'Qiymatni 100 ga ko‘paytirib foiz miqdoriga bo‘lish.', formula: 'A = \\frac{B \\times 100}{p}', icon: '100%', color: '#8B5CF6' },
      { title: 'Ikki sonning foiz nisbatini hisoblash', desc: 'Birinchi son ikkinchi sonning necha foizini tashkil etishi.', formula: 'p = \\frac{a}{b} \\times 100\\%', icon: '%%', color: '#E11D48' },
      { title: 'Musbat va manfiy sonlar: Koordinata to‘g‘ri chizig‘i', desc: 'Noldan chapdagi manfiy sonlar va o‘ngdagi musbat sonlar.', formula: '-3 < -1 < 0 < 2', icon: '±', color: '#0891B2' },
      { title: 'Qarama-qarshi sonlar va modul (mutlaq qiymat)', desc: 'Koordinata boshidan berilgan nuqtagacha bo‘lgan masofa.', formula: '|-a| = |a| = a', icon: '|x|', color: '#F59E0B' },
      { title: 'Manfiy sonlarni qo‘shish va ayirish', desc: 'Bir xil va har xil ishorali sonlarni qo‘shish qoidalari.', formula: '(-5) + (-3) = -8, \\quad 5 - 8 = -3', icon: '-+', color: '#059669' },
      { title: 'Butun sonlarni ko‘paytirish va bo‘lish', desc: 'Minus bilan minus plyus beradi qoidasi.', formula: '(-a) \\times (-b) = ab', icon: '×÷', color: '#3B82F6' },
      { title: 'Ratsional sonlar to‘plami', desc: 'Kasr va butun sonlarning umumiy to‘plami (Q).', formula: '\\mathbb{Q} = \\left\\{\\frac{m}{n} : m\\in\\mathbb{Z}, n\\in\\mathbb{N}\\right\\}', icon: 'Q', color: '#10B981' },
      { title: 'Qavslarni ochish va o‘xshash hadlarni ixchamlash', desc: 'Qavs oldida minus tursa ishoralar qarama-qarshisiga o‘zgaradi.', formula: '-(a - b) = -a + b', icon: '()', color: '#6366F1' },
      { title: 'Chiziqli bir noma’lumli tenglamalar', desc: 'ax = b tenglamaning ildizini topish.', formula: 'ax = b \\implies x = \\frac{b}{a}', icon: 'x=', color: '#8B5CF6' },
      { title: 'Tenglamalar yordamida matnli masalalarni yechish', desc: 'Masala shartidan matematik tenglama modelini tuzish.', formula: 'x + (x + 5) = 25', icon: '📝', color: '#D97706' },
      { title: 'To‘g‘ri burchakli koordinatalar sistemasi', desc: 'Dekart tekisligi, absissalar (Ox) va ordinatalar (Oy) o‘qi.', formula: 'A(x, y)', icon: '📈', color: '#059669' },
      { title: 'Doiraviy va ustunli diagrammalar chizish', desc: 'Foiz taqsimotini doiraviy sektorda tasvirlash (360°).', formula: '1\\% = 3.6^\\circ', icon: '🥧', color: '#E11D48' },
      { title: 'Doiraning yuzi va aylana uzunligi formulasi', desc: 'Pi soni ishtirokidagi formulalar.', formula: 'C = 2\\pi r, \\quad S = \\pi r^2', icon: 'π', color: '#0891B2' },
      { title: 'Shar va silindr haqida boshlang‘ich tushuncha', desc: 'Aylanma fazoviy shakllarning ko‘rinishi va tuzilishi.', formula: 'V = \\pi r^2 h', icon: '🌐', color: '#F59E0B' },
      { title: '6-sinf kursi bo‘yicha umumiy sinov', desc: 'Ratsional sonlar, foizlar va proporsiyalar yakuni.', formula: '6\\text{-sinf imtihoni}', icon: '🏆', color: '#10B981' },
    ]
  },

  // Grade 7
  {
    grade: 7,
    chapter: 'Algebraik ifodalar va Geometriya asoslari',
    lessons: [
      { title: 'Birhadlar va ular ustida amallar', desc: 'Birhadning standart shakli va darajasi.', formula: '3x^2 y \\times 2xy^3 = 6x^3 y^4', icon: 'axⁿ', color: '#10B981' },
      { title: 'Ko‘phadlar: Ko‘phadlarni qo‘shish va ayirish', desc: 'O‘xshash hadlarni birlashtirib ko‘phad darajasini aniqlash.', formula: '(2x+3) + (5x-1) = 7x+2', icon: 'P(x)', color: '#3B82F6' },
      { title: 'Ko‘phadni birhadga ko‘paytirish va bo‘lish', desc: 'Taqsimot qonuni bo‘yicha har bir hadni ko‘paytirish.', formula: 'a(b + c) = ab + ac', icon: '×', color: '#059669' },
      { title: 'Ko‘phadlarni ko‘paytirish qoidasi', desc: 'Har bir hadni ikkinchi ko‘phadning har bir hadiga ko‘paytirish.', formula: '(a+b)(c+d) = ac+ad+bc+bd', icon: '××', color: '#D97706' },
      { title: 'Yig‘indining va ayirmaning kvadrati formulalari', desc: 'Qisqa ko‘paytirish formulalarining asosi.', formula: '(a \\pm b)^2 = a^2 \\pm 2ab + b^2', icon: 'a²', color: '#6366F1' },
      { title: 'Kvadratlar ayirmasi formulasi', desc: 'Ikkita son kvadratlari ayirmasini ko‘paytuvchilarga ajratish.', formula: 'a^2 - b^2 = (a - b)(a + b)', icon: 'a²-b²', color: '#8B5CF6' },
      { title: 'Yig‘indi va ayirmaning kubi formulalari', desc: 'Uchinchi darajali qisqa ko‘paytirish formulalari.', formula: '(a \\pm b)^3 = a^3 \\pm 3a^2 b + 3ab^2 \\pm b^3', icon: 'a³', color: '#E11D48' },
      { title: 'Kublar yig‘indisi va ayirmasi formulalari', desc: 'Chala kvadrat bilan ko‘paytirish formulalari.', formula: 'a^3 \\pm b^3 = (a \\pm b)(a^2 \\mp ab + b^2)', icon: 'a³±b³', color: '#0891B2' },
      { title: 'Ko‘phadni umumiy ko‘paytuvchini chiqarish bilan ajratish', desc: 'Qavsdan tashqariga eng katta umumiy ko‘paytuvchini chiqarish.', formula: 'ax + ay = a(x + y)', icon: 'a()', color: '#F59E0B' },
      { title: 'Guruhlash usuli bilan ko‘paytuvchilarga ajratish', desc: 'Hadlarni qulay juftliklarga ajratib umumiy qavs hosil qilish.', formula: 'ax+ay+bx+by = (a+b)(x+y)', icon: '🗂️', color: '#059669' },
      { title: 'Geometriya boshlang‘ich tushunchalari: Nuqta, to‘g‘ri chiziq, nur', desc: 'Geometriya aksiomalari va kesmalar taqqoslash.', formula: 'A \\in l, \\quad [AB]', icon: '✏️', color: '#3B82F6' },
      { title: 'Qo‘shni va vertikal burchaklar xossalari', desc: 'Qo‘shni burchaklar yig‘indisi 180°, vertikal burchaklar teng.', formula: '\\alpha + \\beta = 180^\\circ, \\quad \\angle 1 = \\angle 2', icon: '∠', color: '#10B981' },
      { title: 'Parallel to‘g‘ri chiziqlar va kesuvchi hosil qilgan burchaklar', desc: 'Ichki almashinuvchi va mos burchaklarning tengligi.', formula: 'a \\parallel b \\iff \\alpha = \\beta', icon: '∥', color: '#6366F1' },
      { title: 'Uchburchaklar tengligining birinchi belgisi (TBT)', desc: 'Ikki tomon va ular orasidagi burchak tengligi alomati.', formula: 'AB=A_1 B_1, \\ AC=A_1 C_1, \\ \\angle A=\\angle A_1', icon: '△₁≅△₂', color: '#8B5CF6' },
      { title: 'Uchburchaklar tengligining ikkinchi belgisi (BTB)', desc: 'Bir tomon va unga yopishgan ikki burchak bo‘yicha tenglik.', formula: 'BC=B_1 C_1, \\ \\angle B=\\angle B_1, \\ \\angle C=\\angle C_1', icon: 'BTB', color: '#D97706' },
      { title: 'Uchburchaklar tengligining uchinchi belgisi (TTT)', desc: 'Mos ravishda uchta tomon tengligi alomati.', formula: 'a=a_1, \\ b=b_1, \\ c=c_1', icon: 'TTT', color: '#059669' },
      { title: 'Teng yonli uchburchak va uning xossalari', desc: 'Asosidagi burchaklar tengligi, bissektrisa balandlik va medianadir.', formula: 'h = m = l', icon: '🔺', color: '#E11D48' },
      { title: 'Uchburchak burchaklari yig‘indisi haqida teorema (180°)', desc: 'Ixtiyoriy uchburchak ichki burchaklari yig‘indisi isboti.', formula: '\\alpha + \\beta + \\gamma = 180^\\circ', icon: '180°', color: '#0891B2' },
      { title: 'To‘g‘ri burchakli uchburchaklar tengligi alomatlari', desc: 'Gipotenuza va o‘tkir burchak, gipotenuza va katet bo‘yicha.', formula: 'c = c_1, \\quad a = a_1', icon: '⊿', color: '#F59E0B' },
      { title: '7-sinf algebra va geometriya integratsion testi', desc: 'Qisqa ko‘paytirish formulalari va uchburchaklar sinovi.', formula: '7\\text{-sinf imtihoni}', icon: '🏆', color: '#10B981' },
    ]
  },

  // Grade 8
  {
    grade: 8,
    chapter: 'Kvadrat ildiz, kvadrat tenglamalar va To‘rtburchaklar',
    lessons: [
      { title: 'Arifmetik kvadrat ildiz tushunchasi va xossalari', desc: 'Kvadrati berilgan songa teng bo‘lgan nomanfiy son.', formula: '\\sqrt{a} = b \\iff b \\ge 0 \\land b^2 = a', icon: '√', color: '#10B981' },
      { title: 'Ko‘paytma va kasrdan kvadrat ildiz chiqarish', desc: 'Ko‘paytuvchilar bo‘yicha ildiz chiqarish teoremalari.', formula: '\\sqrt{ab} = \\sqrt{a}\\sqrt{b}, \\quad \\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}}', icon: '√ab', color: '#3B82F6' },
      { title: 'Ildiz belgisi ostidan ko‘paytuvchini chiqarish va kiritish', desc: 'Murakkab ildizli ifodalarni soddalashtirish.', formula: '\\sqrt{a^2 b} = a\\sqrt{b}', icon: 'a√b', color: '#059669' },
      { title: 'Kvadrat tenglamalar: To‘liq va to‘liqsiz kvadrat tenglamalar', desc: 'ax² + bx + c = 0 ko‘rinishidagi tenglamalar.', formula: 'ax^2 + bx + c = 0, \\quad a \\ne 0', icon: 'x²', color: '#D97706' },
      { title: 'Kvadrat tenglama diskriminanti formulasi', desc: 'D > 0, D = 0, D < 0 holatlarida ildizlar soni va formulasi.', formula: 'D = b^2 - 4ac, \\quad x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}', icon: 'D', color: '#6366F1' },
      { title: 'Viyet teoremasi va ildizlarni og‘zaki topish', desc: 'Keltirilgan kvadrat tenglama ildizlari yig‘indisi va ko‘paytmasi.', formula: 'x_1 + x_2 = -p, \\quad x_1 \\times x_2 = q', icon: 'x₁+x₂', color: '#8B5CF6' },
      { title: 'Kvadrat uchhadni chiziqli ko‘paytuvchilarga ajratish', desc: 'Ildizlari orqali ko‘paytuvchilarga ajratish formulasi.', formula: 'ax^2 + bx + c = a(x - x_1)(x - x_2)', icon: 'a(x-x₁)', color: '#E11D48' },
      { title: 'Bikvadrat tenglamalar va yangi o‘zgaruvchi kiritish usuli', desc: 'x² = t almashtirish yordamida yechiladigan 4-darajali tenglamalar.', formula: 'ax^4 + bx^2 + c = 0 \\implies at^2 + bt + c = 0', icon: 'x⁴', color: '#0891B2' },
      { title: 'Kvadrat tenglamalarga keltiriladigan matnli masalalar', desc: 'Geometrik shakllar va tezlikka doir masalalarni yechish.', formula: 'S = x(x + 4) = 96', icon: '📝', color: '#F59E0B' },
      { title: 'Chiziqli tengsizliklar va ularni sonlar o‘qida tasvirlash', desc: 'Orqaliqlarni sonlar to‘g‘ri chizig‘ida bo‘yash va yozish.', formula: 'ax > b \\implies x \\in (c, \\infty)', icon: '>', color: '#059669' },
      { title: 'Chiziqli tengsizliklar sistemasi', desc: 'Bir vaqtda bajarilishi kerak bo‘lgan oraliqlar kesishmasi.', formula: '\\begin{cases} x > a \\\\ x < b \\end{cases} \\implies x \\in (a, b)', icon: '{<', color: '#3B82F6' },
      { title: 'To‘rtburchaklar: Parallelogramm va uning xossalari', desc: 'Qarama-qarshi tomonlar teng va parallel, diagonallar kesishadi.', formula: 'AB = CD, \\quad BC = AD', icon: '▱', color: '#10B981' },
      { title: 'Romb va kvadratning alohida xossalari', desc: 'Romb diagonallari o‘zaro perpendikulyar va bissektrisadir.', formula: 'd_1 \\perp d_2, \\quad S = \\frac{1}{2}d_1 d_2', icon: '◇', color: '#6366F1' },
      { title: 'Trapetsiya va uning o‘rta chizig‘i haqida teorema', desc: 'O‘rta chiziq asoslarga parallel va asoslar yig‘indisining yarmiga teng.', formula: 'm = \\frac{a + b}{2}', icon: '⏢', color: '#8B5CF6' },
      { title: 'Pifagor teoremasi: To‘g‘ri burchakli uchburchak tomonlari', desc: 'Gipotenuza kvadrati katetlar kvadratlari yig‘indisiga teng.', formula: 'a^2 + b^2 = c^2', icon: 'a²+b²', color: '#E11D48' },
      { title: 'To‘g‘ri to‘rtburchak, parallelogramm va romb yuzlari', desc: 'Asos va balandlik ko‘paytmasi formulalari.', formula: 'S = a \\times h_a = ab \\sin \\alpha', icon: 'S', color: '#0891B2' },
      { title: 'Uchburchakning yuzini topish formulalari (Geron formulasi)', desc: 'Uchta tomoni orqali yuzni hisoblash.', formula: 'S = \\sqrt{p(p-a)(p-b)(p-c)}', icon: 'S△', color: '#F59E0B' },
      { title: 'Trapetsiyaning yuzini hisoblash formulasi', desc: 'Asoslar yig‘indisi yarmi bilan balandlik ko‘paytmasi.', formula: 'S = \\frac{a + b}{2} \\times h', icon: 'S⏢', color: '#059669' },
      { title: 'O‘xshash uchburchaklar va Fales teoremasi', desc: 'Burchaklar tengligi va mos tomonlar mutanosibligi koeffitsiyenti.', formula: '\\frac{a}{a_1} = \\frac{b}{b_1} = k, \\quad \\frac{S}{S_1} = k^2', icon: 'k²', color: '#3B82F6' },
      { title: '8-sinf algebra va geometriya bo‘yicha nazorat ishi', desc: 'Kvadrat tenglamalar va Pifagor teoremasi mustahkam sinovi.', formula: '8\\text{-sinf imtihoni}', icon: '🏆', color: '#10B981' },
    ]
  },

  // Grade 9
  {
    grade: 9,
    chapter: 'Funksiyalar, progressiyalar va Trigonometriya',
    lessons: [
      { title: 'Kvadratik funksiya: y = ax² + bx + c va uning parabolasi', desc: 'Parabola tarmoqlari yo‘nalishi va grafik chizish.', formula: 'y = ax^2 + bx + c', icon: 'parab', color: '#10B981' },
      { title: 'Parabola uchining koordinatalarini topish formulasi', desc: 'Simmetriya o‘qi va eng katta/kichik qiymat nuqtasi.', formula: 'x_0 = -\\frac{b}{2a}, \\quad y_0 = -\\frac{D}{4a}', icon: '(x₀,y₀)', color: '#3B82F6' },
      { title: 'Kvadrat tengsizliklarni intervallar usulida yechish', desc: 'Parabola ildizlari va oraliqlarda ishoralarni aniqlash.', formula: 'ax^2 + bx + c > 0', icon: '+-+', color: '#059669' },
      { title: 'Ratsional tengsizliklar va kasrli ifodalar', desc: 'Kasr surat va maxraji nollarini sonlar o‘qiga qo‘yish.', formula: '\\frac{P(x)}{Q(x)} \\ge 0', icon: 'P/Q', color: '#D97706' },
      { title: 'Ikki noma’lumli ikkinchi darajali tenglamalar sistemasi', desc: 'O‘rniga qo‘yish va qo‘shish usullari.', formula: '\\begin{cases} x^2 + y^2 = 25 \\\\ x + y = 7 \\end{cases}', icon: '{xy', color: '#6366F1' },
      { title: 'Arifmetik progressiya: n-hadi formulasi', desc: 'Har bir hadi oldingisiga d sonini qo‘shish orqali hosil bo‘ladigan ketma-ketlik.', formula: 'a_n = a_1 + (n - 1)d', icon: 'aₙ', color: '#8B5CF6' },
      { title: 'Arifmetik progressiya dastlabki n ta hadi yig‘indisi (Sn)', desc: 'Birinchi va oxirgi hadlar yig‘indisi orqali hisoblash.', formula: 'S_n = \\frac{a_1 + a_n}{2} \\times n = \\frac{2a_1 + (n-1)d}{2} \\times n', icon: 'Sₙ', color: '#E11D48' },
      { title: 'Geometrik progressiya: n-hadi formulasi', desc: 'Har bir hadi oldingisini q maxrajga ko‘paytirish orqali hosil bo‘ladi.', formula: 'b_n = b_1 \\times q^{n-1}', icon: 'bₙ', color: '#0891B2' },
      { title: 'Geometrik progressiya dastlabki n ta hadi yig‘indisi', desc: 'Geometrik progressiya yig‘indisi formulasi va qo‘llanilishi.', formula: 'S_n = \\frac{b_1(q^n - 1)}{q - 1}, \\quad q \\ne 1', icon: 'Sₙ(q)', color: '#F59E0B' },
      { title: 'Cheksiz kamayuvchi geometrik progressiya yig‘indisi', desc: '|q| < 1 bo‘lganda cheksiz hadlar yig‘indisini topish.', formula: 'S = \\frac{b_1}{1 - q}', icon: 'S_∞', color: '#059669' },
      { title: 'Burchakning sinusi, kosinusi, tangensi va kotangensi', desc: 'To‘g‘ri burchakli uchburchakda trigonometrik nisbatlar.', formula: '\\sin \\alpha = \\frac{a}{c}, \\quad \\cos \\alpha = \\frac{b}{c}', icon: 'sin', color: '#3B82F6' },
      { title: 'Asosiy trigonometrik ayniyat: sin²α + cos²α = 1', desc: 'Pifagor teoremasining trigonometrik ifodasi va xossalari.', formula: '\\sin^2 \\alpha + \\cos^2 \\alpha = 1, \\quad \\text{tg}\\alpha = \\frac{\\sin\\alpha}{\\cos\\alpha}', icon: 'sin²', color: '#10B981' },
      { title: 'Sinuslar teoremasi (a / sinA = 2R)', desc: 'Uchburchak tomonlari va qarshisidagi burchaklar sinusi nisbati.', formula: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R', icon: 'sinTh', color: '#6366F1' },
      { title: 'Kosinuslar teoremasi (c² = a² + b² - 2ab cosC)', desc: 'Ixtiyoriy uchburchakning uchinchi tomonini topish.', formula: 'c^2 = a^2 + b^2 - 2ab \\cos C', icon: 'cosTh', color: '#8B5CF6' },
      { title: 'Ko‘pburchaklar: Muntazam ko‘pburchaklar va burchaklar yig‘indisi', desc: 'Qavariq ko‘pburchak ichki burchaklari yig‘indisi.', formula: '\\sum = (n - 2) \\times 180^\\circ', icon: '⬡', color: '#E11D48' },
      { title: 'Aylanaga ichki va tashqi chizilgan ko‘pburchaklar', desc: 'Aylanaga tashqi chizilgan to‘rtburchak qarama-qarshi tomonlari yig‘indisi.', formula: 'a + c = b + d', icon: '⭕⬡', color: '#0891B2' },
      { title: 'Vektorlar: Vektorlarning koordinatalari va qo‘shish qoidasi', desc: 'Yo‘naltirilgan kesma, uchburchak va parallelogramm qoidasi.', formula: '\\vec{a} + \\vec{b} = (x_1+x_2, \\ y_1+y_2)', icon: '→', color: '#F59E0B' },
      { title: 'Vektorlarning skalyar ko‘paytmasi formulasi', desc: 'Modullar va ular orasidagi burchak kosinusi ko‘paytmasi.', formula: '\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos \\varphi = x_1 x_2 + y_1 y_2', icon: 'a·b', color: '#059669' },
      { title: 'Ehtimollar nazariyasi asoslari: Hodisaning ehtimolligi', desc: 'Klassik ehtimollik formulasi: qulay hollar sonining jamiga nisbati.', formula: 'P(A) = \\frac{m}{n}', icon: 'P(A)', color: '#3B82F6' },
      { title: '9-sinf bitiruv attestatsiyasi va davlat imtihoni savollari', desc: 'Umumiy o‘rta ta’lim bitiruvchilari uchun to‘liq sinov.', formula: '9\\text{-sinf imtihoni}', icon: '🏆', color: '#10B981' },
    ]
  },

  // Grade 10
  {
    grade: 10,
    chapter: 'Trigonometriya, Ko‘rsatkichli funksiyalar va Stereometriya',
    lessons: [
      { title: 'Haqiqiy sonlar va daraja tushunchasining umumlashtirilishi', desc: 'Haqiqiy ko‘rsatkichli daraja va ildizlar arifmetikasi.', formula: 'a^r, \\quad r \\in \\mathbb{R}', icon: 'aʳ', color: '#10B981' },
      { title: 'Ratsional ko‘rsatkichli daraja va uning xossalari', desc: 'Ildizni kasr daraja ko‘rinishida ifodalash.', formula: 'a^{m/n} = \\sqrt[n]{a^m}', icon: 'aᵐᐟⁿ', color: '#3B82F6' },
      { title: 'Ixtiyoriy burchak trigonometriyasi: Radianda o‘lchash', desc: 'Birlik aylana, radian va gradus bog‘lanishi.', formula: '1\\text{ rad} = \\frac{180^\\circ}{\\pi} \\approx 57.3^\\circ', icon: 'rad', color: '#059669' },
      { title: 'Keltirish formulalari', desc: 'Koordinata choraklariga qarab ishora va funksiya nomining o‘zgarishi.', formula: '\\sin\\left(\\frac{\\pi}{2} - \\alpha\\right) = \\cos\\alpha, \\quad \\cos(\\pi - \\alpha) = -\\cos\\alpha', icon: 'π±α', color: '#D97706' },
      { title: 'Qo‘shish formulalari: sin(α ± β) va cos(α ± β)', desc: 'Burchaklar yig‘indisi va ayirmasi trigonometrik funksiyalari.', formula: '\\cos(\\alpha - \\beta) = \\cos\\alpha\\cos\\beta + \\sin\\alpha\\sin\\beta', icon: 'α+β', color: '#6366F1' },
      { title: 'Ikkilangan va yarim burchak formulalari', desc: '2α va α/2 trigonometrik formulalari orqali ifodalash.', formula: '\\sin 2\\alpha = 2\\sin\\alpha\\cos\\alpha, \\quad \\cos 2\\alpha = \\cos^2\\alpha - \\sin^2\\alpha', icon: '2α', color: '#8B5CF6' },
      { title: 'Trigonometrik funksiyalarning yig‘indisini ko‘paytmaga aylantirish', desc: 'Yig‘indidan ko‘paytmaga o‘tish formulalari.', formula: '\\sin\\alpha + \\sin\\beta = 2\\sin\\frac{\\alpha+\\beta}{2}\\cos\\frac{\\alpha-\\beta}{2}', icon: '∑→∏', color: '#E11D48' },
      { title: 'Eng sodda trigonometrik tenglamalar: sin x = a, cos x = a', desc: 'Arksinus va arkkosinus orqali umumiy yechimlarni topish.', formula: 'x = (-1)^k \\arcsin a + \\pi k, \\quad x = \\pm \\arccos a + 2\\pi k', icon: 'arcsin', color: '#0891B2' },
      { title: 'Bir jinsli trigonometrik tenglamalar', desc: 'cos²x yoki cos x ga bo‘lish orqali kvadrat tenglamaga keltirish.', formula: 'a\\sin^2 x + b\\sin x\\cos x + c\\cos^2 x = 0', icon: 'tg²x', color: '#F59E0B' },
      { title: 'Ko‘rsatkichli funksiya va uning grafigi', desc: 'y = aˣ funksiyaning o‘sish va kamayish xususiyatlari.', formula: 'y = a^x, \\quad a > 0, \\ a \\ne 1', icon: 'aˣ', color: '#059669' },
      { title: 'Ko‘rsatkichli tenglamalar va yechish usullari', desc: 'Bir xil asosga keltirish va o‘zgaruvchi almashtirish usuli.', formula: 'a^{f(x)} = a^{g(x)} \\implies f(x) = g(x)', icon: '2ˣ=8', color: '#3B82F6' },
      { title: 'Ko‘rsatkichli tengsizliklar', desc: 'Asos 1 dan katta bo‘lsa ishora saqlanadi, kichik bo‘lsa o‘zgaradi.', formula: 'a^{f(x)} > a^{g(x)}, \\quad a > 1 \\implies f(x) > g(x)', icon: 'aˣ>aʸ', color: '#10B981' },
      { title: 'Logarifm tushunchasi va asosiy logarifmik ayniyat', desc: 'b sonini hosil qilish uchun a ni ko‘tarish kerak bo‘lgan daraja.', formula: 'a^{\\log_a b} = b, \\quad \\log_a b = c \\iff a^c = b', icon: 'log', color: '#6366F1' },
      { title: 'Logarifm xossalari (ko‘paytma, bo‘linma va daraja)', desc: 'Logarifmlarni qo‘shish, ayirish va asosini almashtirish.', formula: '\\log_a(xy) = \\log_a x + \\log_a y, \\quad \\log_a(x^p) = p\\log_a x', icon: 'log(xy)', color: '#8B5CF6' },
      { title: 'Logarifmik tenglamalar', desc: 'Aniqlanish sohasini (x > 0) hisobga olib tenglamalarni yechish.', formula: '\\log_a f(x) = \\log_a g(x) \\implies f(x) = g(x) > 0', icon: 'log x=b', color: '#E11D48' },
      { title: 'Logarifmik tengsizliklar', desc: 'Asosga qarab tengsizlik ishorasining yo‘nalishi.', formula: '\\log_a f(x) > \\log_a g(x)', icon: 'log>', color: '#0891B2' },
      { title: 'Stereometriya aksiomalari va ulardan kelib chiqadigan natijalar', desc: 'Fazoda tekislikni aniqlovchi uchta nuqta aksiomasi.', formula: '\\alpha \\cap \\beta = l', icon: '📐3D', color: '#F59E0B' },
      { title: 'Fazoda to‘g‘ri chiziqlar va tekisliklarning o‘zaro vaziyati', desc: 'Kesişuvchi, parallel va ayqash to‘g‘ri chiziqlar.', formula: 'a \\parallel \\alpha, \\quad a \\cap \\alpha = \\{A\\}', icon: '∦', color: '#059669' },
      { title: 'To‘g‘ri chiziq va tekislikning perpendikulyarligi', desc: 'Uch perpendikulyar haqida teorema va masofalar.', formula: 'l \\perp \\alpha \\iff l \\perp a_1 \\land l \\perp a_2', icon: '⊥', color: '#3B82F6' },
      { title: 'Ikki yoqli burchaklar va tekisliklar orasidagi burchak', desc: 'Chiziqli burchak va fazoviy burchaklarni o‘lchash.', formula: '\\cos \\varphi = \\frac{S_{\\text{pr}}}{S}', icon: '∠3D', color: '#10B981' },
    ]
  },

  // Grade 11
  {
    grade: 11,
    chapter: 'Matematik analiz asoslari va Fazoviy jismlar geometriyasi',
    lessons: [
      { title: 'Funksiyaning limiti va uzluksizligi haqida tushuncha', desc: 'Argument nuqtaga intilgandagi funksiya chegaraviy qiymati.', formula: '\\lim_{x \\to x_0} f(x) = L', icon: 'lim', color: '#10B981' },
      { title: 'Hosila ta’rifi va uning fizik hamda geometrik ma’nosi', desc: 'Urinmaning burchak koeffitsiyenti (k = f\'(x₀)) va tezlik.', formula: 'f\'(x) = \\lim_{\\Delta x \\to 0} \\frac{\\Delta y}{\\Delta x}', icon: 'dy/dx', color: '#3B82F6' },
      { title: 'Yig‘indi, ko‘paytma va bo‘linmaning hosilasi formulalari', desc: 'Differensiallash qoidalari va jadvallari.', formula: '(uv)\' = u\'v + uv\', \\quad \\left(\\frac{u}{v}\\right)\' = \\frac{u\'v - uv\'}{v^2}', icon: '(uv)\'', color: '#059669' },
      { title: 'Murakkab funksiyaning hosilasi', desc: 'Zanjir qoidasi: ichki va tashqi funksiya hosilalari ko‘paytmasi.', formula: '(f(g(x)))\' = f\'(g(x)) \\times g\'(x)', icon: 'f\'(g)', color: '#D97706' },
      { title: 'Trigonometrik, ko‘rsatkichli va logarifmik funksiyalar hosilalari', desc: 'Asosiy elementar funksiyalar hosilalari jadvali.', formula: '(\\sin x)\' = \\cos x, \\quad (e^x)\' = e^x, \\quad (\\ln x)\' = \\frac{1}{x}', icon: 'd/dx', color: '#6366F1' },
      { title: 'Urinma tenglamasini tuzish', desc: 'Funksiya grafigiga berilgan nuqtada o‘tkazilgan to‘g‘ri chiziq tenglamasi.', formula: 'y = f(x_0) + f\'(x_0)(x - x_0)', icon: 'y=kx+b', color: '#8B5CF6' },
      { title: 'Funksiyaning o‘sish va kamayish oraliqlarini hosila yordamida tekshirish', desc: 'f\'(x) > 0 bo‘lsa funksiya o‘sadi, f\'(x) < 0 bo‘lsa kamayadi.', formula: 'f\'(x) > 0 \\implies f(x) \\uparrow', icon: '↗↘', color: '#E11D48' },
      { title: 'Funksiyaning ekstremumlari: Maksimum va minimum nuqtalar', desc: 'Statsionar nuqtalar va hosila ishorasining o‘zgarishi.', formula: 'f\'(x) = 0 \\implies x_{\\text{extr}}', icon: 'max/min', color: '#0891B2' },
      { title: 'Funksiyaning kesmadagi eng katta va eng kichik qiymatlarini topish', desc: 'Ekstremumlar va kesma chetki nuqtalaridagi qiymatlarni solishtirish.', formula: '\\max_{[a,b]} f(x), \\quad \\min_{[a,b]} f(x)', icon: 'min/max', color: '#F59E0B' },
      { title: 'Boshlang‘ich funksiya (aniqmas integral) tushunchasi va jadvali', desc: 'Differensiallashga teskari amal: F\'(x) = f(x).', formula: '\\int f(x)\\,dx = F(x) + C', icon: '∫', color: '#059669' },
      { title: 'Boshlang‘ich funksiyaning asosiy qoidalari', desc: 'Ko‘paytuvchini chiqarish va yig‘indi integrali.', formula: '\\int (af + bg)\\,dx = a\\int f\\,dx + b\\int g\\,dx', icon: '∫(f+g)', color: '#3B82F6' },
      { title: 'Aniq integral va Nyuton-Leybnits formulasi', desc: 'Boshlang‘ich funksiyalar ayirmasi orqali aniq integralni hisoblash.', formula: '\\int_a^b f(x)\\,dx = F(b) - F(a)', icon: '∫ₐᵇ', color: '#10B981' },
      { title: 'Egri chiziqli trapetsiya yuzini integral yordamida hisoblash', desc: 'Funksiya grafigi ostidagi maydon yuzini aniq integral bilan topish.', formula: 'S = \\int_a^b (f_1(x) - f_2(x))\\,dx', icon: 'S_∫', color: '#6366F1' },
      { title: 'Fazoda ko‘pyoqlar: Prizma va uning to‘la sirti hamda hajmi', desc: 'Asos yuzi va balandlik ko‘paytmasi.', formula: 'S_{\\text{to‘la}} = 2S_{\\text{asos}} + S_{\\text{yon}}, \\quad V = S_{\\text{asos}} \\times h', icon: 'Prizm', color: '#8B5CF6' },
      { title: 'Piramida va qirqiq piramida: Yon sirt va hajm formulasi', desc: 'Uchdan bir asos yuzi va balandlik ko‘paytmasi.', formula: 'V = \\frac{1}{3}S_{\\text{asos}} \\times h', icon: 'Piram', color: '#E11D48' },
      { title: 'Aylanma jismlar: Silindr va uning sirti hamda hajmi', desc: 'Doiraviy asosli aylanma silindr formulalari.', formula: 'V = \\pi r^2 h, \\quad S_{\\text{yon}} = 2\\pi rh', icon: 'Silindr', color: '#0891B2' },
      { title: 'Konus va qirqiq konus: Yon sirt va hajm formulalari', desc: 'Aylanma konus hajmi va yasovchisi.', formula: 'V = \\frac{1}{3}\\pi r^2 h, \\quad S_{\\text{yon}} = \\pi r l', icon: 'Konus', color: '#F59E0B' },
      { title: 'Shar va sfera: Sirt yuzi va hajm formulasi', desc: 'Sfera sirti yuzi va shar hajmining radiusga bog‘liqligi.', formula: 'S = 4\\pi R^2, \\quad V = \\frac{4}{3}\\pi R^3', icon: 'Shar', color: '#059669' },
      { title: 'Fazoda Dekart koordinatalari va sferaning tenglamasi', desc: 'Markazi (x₀, y₀, z₀) bo‘lgan sfera sirti tenglamasi.', formula: '(x - x_0)^2 + (y - y_0)^2 + (z - z_0)^2 = R^2', icon: 'R²', color: '#3B82F6' },
      { title: '11-sinf maktab bitiruv imtihoni va OTM kirish testlari integratsiyasi', desc: '1-11 sinf maktab matematika kursining to‘liq sinovi va repetitsiyasi.', formula: '\\text{OTM Kirish Imtihoni 100%}', icon: '🏆', color: '#10B981' },
    ]
  }
];

function generateQuestionsForLesson(lessonId, grade, title) {
  // Generates 5 high-quality curriculum-appropriate quiz questions
  const qList = [];
  for (let i = 1; i <= 5; i++) {
    const qId = `q-${lessonId}-${i}`;
    let prompt = '';
    let options = [];
    let correctAnswer = '';
    let explanation = '';
    let hint = '';

    if (grade === 1) {
      if (i === 1) {
        prompt = `Hisoblang: 4 + 3 nechchi bo‘ladi?`;
        options = ['7', '6', '8', '9'];
        correctAnswer = '7';
        explanation = `4 ga 3 ni qo‘shsak: 4, 5, 6, 7 bo‘ladi. To‘g‘ri javob: 7.`;
        hint = `Birliklarni ketma-ket qo‘shib sanang.`;
      } else if (i === 2) {
        prompt = `Taqqoslang: 8 va 5 sonlari o‘rtasiga qaysi belgi qo‘yiladi?`;
        options = ['>', '<', '=', '+'];
        correctAnswer = '>';
        explanation = `8 soni 5 sonidan katta bo‘lgani uchun ">" belgisi qo‘yiladi (8 > 5).`;
        hint = `Katta songa tomon belgining ochiq uchi qaragan bo‘ladi.`;
      } else if (i === 3) {
        prompt = `Hisoblang: 9 - 4 ayirmasi nimaga teng?`;
        options = ['5', '4', '6', '3'];
        correctAnswer = '5';
        explanation = `9 dan 4 ni ayirsak, 5 qoladi (9 - 4 = 5).`;
        hint = `9 dan 4 ta orqaga sanang.`;
      } else if (i === 4) {
        prompt = `Qaysi shaklning burchaklari bo‘lmaydi?`;
        options = ['Doira', 'Kvadrat', 'Uchburchak', 'To‘rtburchak'];
        correctAnswer = 'Doira';
        explanation = `Doira silliq egri chiziq bilan chegaralangan, unda burchaklar yo‘q.`;
        hint = `Quyosh yoki tanga shaklini eslang.`;
      } else {
        prompt = `1 detsimetr (dm) necha santimetrga (sm) teng?`;
        options = ['10 sm', '100 sm', '5 sm', '1 sm'];
        correctAnswer = '10 sm';
        explanation = `1 dm = 10 sm qoidasi mavjud.`;
        hint = `Chizg‘ichdagi 10 sm bo‘lagini eslang.`;
      }
    } else if (grade === 2) {
      if (i === 1) {
        prompt = `Hisoblang: 24 + 35 yig‘indisi nechchi?`;
        options = ['59', '58', '69', '60'];
        correctAnswer = '59';
        explanation = `O‘nliklar: 20 + 30 = 50. Birliklar: 4 + 5 = 9. Jami: 59.`;
        hint = `O‘nliklarni va birliklarni alohida qo‘shing.`;
      } else if (i === 2) {
        prompt = `Ko‘paytirishni bajaring: 3 × 7 nechchi bo‘ladi?`;
        options = ['21', '24', '18', '27'];
        correctAnswer = '21';
        explanation = `3 × 7 = 21 (3 sonini 7 marta o‘ziga qo‘shish).`;
        hint = `3 karra jadvalini eslang: 3, 6, 9, 12, 15, 18, 21.`;
      } else if (i === 3) {
        prompt = `Tenglamani yeching: x + 16 = 40. x nechchi?`;
        options = ['24', '26', '34', '14'];
        correctAnswer = '24';
        explanation = `Noma’lum qo‘shiluvchini topish uchun: x = 40 - 16 = 24.`;
        hint = `Yig‘indidan ma’lum qo‘shiluvchini ayiring.`;
      } else if (i === 4) {
        prompt = `Tomonlari 5 sm va 3 sm bo‘lgan to‘g‘ri to‘rtburchak perimetri (P) qancha?`;
        options = ['16 sm', '15 sm', '8 sm', '18 sm'];
        correctAnswer = '16 sm';
        explanation = `P = 2 × (a + b) = 2 × (5 + 3) = 2 × 8 = 16 sm.`;
        hint = `Barcha to‘rtta tomon uzunligini qo‘shing.`;
      } else {
        prompt = `Bo‘lishni bajaring: 32 : 4 nechchi bo‘ladi?`;
        options = ['8', '7', '9', '6'];
        correctAnswer = '8';
        explanation = `32 : 4 = 8, chunki 8 × 4 = 32.`;
        hint = `4 ni nechaga ko‘paytirsa 32 chiqadi?`;
      }
    } else if (grade === 3) {
      if (i === 1) {
        prompt = `Hisoblang: 7 × 8 nechchiga teng?`;
        options = ['56', '54', '64', '58'];
        correctAnswer = '56';
        explanation = `7 × 8 = 56. Karra jadvalining asosiy natijalaridan biri.`;
        hint = `7 karra jadvalini eslang.`;
      } else if (i === 2) {
        prompt = `Tomoni 6 sm bo‘lgan kvadratning yuzi (S) qancha?`;
        options = ['36 sm²', '24 sm²', '30 sm²', '12 sm²'];
        correctAnswer = '36 sm²';
        explanation = `Kvadrat yuzi formulasi: S = a × a = 6 × 6 = 36 sm².`;
        hint = `Tomonni o‘zini o‘ziga ko‘paytiring.`;
      } else if (i === 3) {
        prompt = `Avtomobil 60 km/soat tezlik bilan 3 soatda qancha masofa bosib o‘tadi?`;
        options = ['180 km', '120 km', '200 km', '150 km'];
        correctAnswer = '180 km';
        explanation = `Masofa formulasi: S = v × t = 60 × 3 = 180 km.`;
        hint = `Tezlikni vaqtga ko‘paytiring.`;
      } else if (i === 4) {
        prompt = `Qoldiqli bo‘lishni bajaring: 27 : 5 natijasi nima?`;
        options = ['5 (qoldiq 2)', '5 (qoldiq 3)', '4 (qoldiq 7)', '6 (qoldiq 1)'];
        correctAnswer = '5 (qoldiq 2)';
        explanation = `27 = 5 × 5 + 2. To‘liqsiz bo‘linma 5, qoldiq 2.`;
        hint = `5 × 5 = 25, 27 dan 25 ni ayiring.`;
      } else {
        prompt = `Hisoblang: 45 + 15 : 3 nechchi bo‘ladi?`;
        options = ['50', '20', '55', '48'];
        correctAnswer = '50';
        explanation = `Avval bo‘lish bajariladi: 15 : 3 = 5. Keyin qo‘shish: 45 + 5 = 50.`;
        hint = `Bo‘lish amali qo‘shishdan oldin bajariladi!`;
      }
    } else if (grade === 4) {
      if (i === 1) {
        prompt = `Hisoblang: 3/7 + 2/7 kasrlar yig‘indisi nechchi?`;
        options = ['5/7', '5/14', '6/7', '1'];
        correctAnswer = '5/7';
        explanation = `Bir xil maxrajli kasrlarda faqat suratlar qo‘shiladi: (3 + 2)/7 = 5/7.`;
        hint = `Maxraj 7 o‘zgarishsiz qoladi.`;
      } else if (i === 2) {
        prompt = `1 gektar (ga) necha kvadrat metrga (m²) teng?`;
        options = ['10 000 m²', '1 000 m²', '100 m²', '100 000 m²'];
        correctAnswer = '10 000 m²';
        explanation = `1 ga = 100 m × 100 m = 10 000 m².`;
        hint = `100 metrga 100 metr maydonni hisoblang.`;
      } else if (i === 3) {
        prompt = `O‘lchamlari 4 sm, 3 sm va 5 sm bo‘lgan to‘g‘ri burchakli parallelepiped hajmi (V) qancha?`;
        options = ['60 sm³', '48 sm³', '12 sm³', '50 sm³'];
        correctAnswer = '60 sm³';
        explanation = `Hajm formulasi: V = a × b × c = 4 × 3 × 5 = 60 sm³.`;
        hint = `Uchta o‘lchamni o‘zaro ko‘paytiring.`;
      } else if (i === 4) {
        prompt = `Uchburchakning ikkita burchagi 50° va 60°. Uchinchi burchak necha gradus?`;
        options = ['70°', '80°', '60°', '90°'];
        correctAnswer = '70°';
        explanation = `Uchburchak ichki burchaklari yig‘indisi 180° ga teng: 180° - (50° + 60°) = 70°.`;
        hint = `180 dan ma’lum ikkita burchak yig‘indisini ayiring.`;
      } else {
        prompt = `Aralash sonni noto‘g‘ri kasrga aylantiring: 3 butun 2/5 = ?`;
        options = ['17/5', '15/5', '11/5', '13/5'];
        correctAnswer = '17/5';
        explanation = `3 × 5 + 2 = 17, demak 17/5 bo‘ladi.`;
        hint = `Butun qismni maxrajga ko‘paytirib, suratni qo‘shing.`;
      }
    } else if (grade === 5) {
      if (i === 1) {
        prompt = `24 va 36 sonlarining Eng Katta Umumiy Bo‘luvchisi (EKUB) nechchi?`;
        options = ['12', '6', '18', '24'];
        correctAnswer = '12';
        explanation = `24 = 2³ × 3, 36 = 2² × 3². Umumiy ko‘paytuvchilar: 2² × 3 = 12.`;
        hint = `Ikkala son ham qoldiqsiz bo‘linadigan eng katta sonni toping.`;
      } else if (i === 2) {
        prompt = `Hisoblang: 0.4 × 0.5 ko‘paytmasi nechchi?`;
        options = ['0.2', '0.20', '0.02', '2.0'];
        correctAnswer = '0.2';
        explanation = `4 × 5 = 20. Verguldan keyin 2 ta raqam bo‘lishi kerak: 0.20 = 0.2.`;
        hint = `4 ni 5 ga ko‘paytirib, 2 ta xona vergul suring.`;
      } else if (i === 3) {
        prompt = `Qisqartiring: 18/24 kasrning eng sodda ko‘rinishi qanday?`;
        options = ['3/4', '9/12', '6/8', '2/3'];
        correctAnswer = '3/4';
        explanation = `Surat va maxrajni 6 ga bo‘lamiz: 18:6 = 3, 24:6 = 4. Natija: 3/4.`;
        hint = `Surat va maxrajni ularning EKUBiga (6 ga) bo‘ling.`;
      } else if (i === 4) {
        prompt = `O‘rta arifmetikni toping: 10, 15, 20 sonlarining o‘rta arifmetigi nechchi?`;
        options = ['15', '14', '16', '12'];
        correctAnswer = '15';
        explanation = `Yig‘indi: 10 + 15 + 20 = 45. Sonlar soni: 3. O‘rta arifmetik: 45 : 3 = 15.`;
        hint = `Sonlarni qo‘shib ularning soniga bo‘ling.`;
      } else {
        prompt = `Kasrlarni bo‘ling: (2/3) : (4/9) natijasi nimaga teng?`;
        options = ['3/2', '8/27', '2/3', '4/3'];
        correctAnswer = '3/2';
        explanation = `(2/3) × (9/4) = (2 × 9) / (3 × 4) = 18 / 12 = 3/2.`;
        hint = `Ikkinchi kasrni teskarisiga aylantirib ko‘paytiring.`;
      }
    } else if (grade === 6) {
      if (i === 1) {
        prompt = `400 sonining 25 foizi (25%) qanchaga teng?`;
        options = ['100', '150', '80', '120'];
        correctAnswer = '100';
        explanation = `25% bu chorak (1/4) qism: 400 × 25 / 100 = 100.`;
        hint = `25% = 1/4 ekanligidan foydalaning.`;
      } else if (i === 2) {
        prompt = `Proporsiyadan x ni toping: 3 : 5 = 12 : x`;
        options = ['20', '15', '25', '18'];
        correctAnswer = '20';
        explanation = `Proporsiyaning asosiy xossasiga ko‘ra: 3 × x = 5 × 12 = 60. Demak x = 60 : 3 = 20.`;
        hint = `Chetki hadlar ko‘paytmasi o‘rta hadlar ko‘paytmasiga teng.`;
      } else if (i === 3) {
        prompt = `Hisoblang: (-15) + (-25) nechchi bo‘ladi?`;
        options = ['-40', '40', '-10', '10'];
        correctAnswer = '-40';
        explanation = `Ikkita manfiy son qo‘shilganda modullari qo‘shilib oldiga minus qo‘yiladi: -(15 + 25) = -40.`;
        hint = `Qarzga yana qarz qo‘shilishi kabi tasavvur qiling.`;
      } else if (i === 4) {
        prompt = `Radius r = 7 sm bo‘lgan aylananing uzunligi (C) qancha? (π ≈ 22/7)`;
        options = ['44 sm', '154 sm', '22 sm', '88 sm'];
        correctAnswer = '44 sm';
        explanation = `C = 2πr = 2 × (22/7) × 7 = 44 sm.`;
        hint = `C = 2 × π × r formulasini qo‘llang.`;
      } else {
        prompt = `Tenglamani yeching: 3x - 7 = 14. x nechchi?`;
        options = ['7', '6', '8', '5'];
        correctAnswer = '7';
        explanation = `3x = 14 + 7 = 21. x = 21 : 3 = 7.`;
        hint = `-7 ni o‘ng tarafga +7 qilib o‘tkazing.`;
      }
    } else if (grade === 7) {
      if (i === 1) {
        prompt = `Qisqa ko‘paytirish formulasini oching: (x + 3)² = ?`;
        options = ['x² + 6x + 9', 'x² + 9', 'x² + 3x + 9', 'x² + 6x + 6'];
        correctAnswer = 'x² + 6x + 9';
        explanation = `(a + b)² = a² + 2ab + b² formulasi bo‘yicha: x² + 2×3×x + 3² = x² + 6x + 9.`;
        hint = `Birinchi son kvadrati + ikkilangan ko‘paytma + ikkinchi son kvadrati.`;
      } else if (i === 2) {
        prompt = `Kvadratlar ayirmasini hisoblang: 52² - 48² = ?`;
        options = ['400', '200', '300', '500'];
        correctAnswer = '400';
        explanation = `a² - b² = (a - b)(a + b) = (52 - 48)(52 + 48) = 4 × 100 = 400.`;
        hint = `(a - b)(a + b) formulasidan foydalanib oson hisoblang!`;
      } else if (i === 3) {
        prompt = `Uchburchaklar tengligining TBT belgisi nimani bildiradi?`;
        options = ['Tomon - Burchak - Tomon', 'Burchak - Tomon - Burchak', 'Uchta tomon tengligi', 'Balandlik tengligi'];
        correctAnswer = 'Tomon - Burchak - Tomon';
        explanation = `TBT: Ikki tomon va ular orasidagi burchak mos ravishda teng bo‘lsa, uchburchaklar teng bo‘ladi.`;
        hint = `T = Tomon, B = Burchak.`;
      } else if (i === 4) {
        prompt = `Ko‘paytuvchilarga ajrating: 5x + 15 = ?`;
        options = ['5(x + 3)', '5(x + 15)', 'x(5 + 3)', '15(x + 1)'];
        correctAnswer = '5(x + 3)';
        explanation = `Umumiy ko‘paytuvchi 5 qavsdan tashqariga chiqariladi: 5(x + 3).`;
        hint = `Ikkala hadda ham mavjud bo‘lgan 5 sonini qavs oldiga chiqaring.`;
      } else {
        prompt = `Teng yonli uchburchakning asosi 10 sm, perimetri 36 sm. Yon tomoni uzunligi qancha?`;
        options = ['13 sm', '12 sm', '14 sm', '15 sm'];
        correctAnswer = '13 sm';
        explanation = `Ikkita yon tomon teng: 36 - 10 = 26 sm. Yon tomon = 26 : 2 = 13 sm.`;
        hint = `Perimetrdan asosni ayirib, ikkiga bo‘ling.`;
      }
    } else if (grade === 8) {
      if (i === 1) {
        prompt = `Kvadrat tenglama diskriminantini toping: x² - 5x + 6 = 0`;
        options = ['1', '25', '4', '0'];
        correctAnswer = '1';
        explanation = `D = b² - 4ac = (-5)² - 4(1)(6) = 25 - 24 = 1.`;
        hint = `D = b² - 4ac formulasini qo‘llang.`;
      } else if (i === 2) {
        prompt = `Viyet teoremasiga ko‘ra x² - 7x + 12 = 0 tenglama ildizlari yig‘indisi nechchi?`;
        options = ['7', '-7', '12', '-12'];
        correctAnswer = '7';
        explanation = `Viyet teoremasi bo‘yicha: x₁ + x₂ = -(-7) = 7.`;
        hint = `x₁ + x₂ = -p qoidasini eslang.`;
      } else if (i === 3) {
        prompt = `To‘g‘ri burchakli uchburchak katetlari 6 sm va 8 sm. Gipotenuza uzunligi (c) qancha?`;
        options = ['10 sm', '14 sm', '12 sm', '11 sm'];
        correctAnswer = '10 sm';
        explanation = `Pifagor teoremasi: c² = a² + b² = 6² + 8² = 36 + 64 = 100. c = √100 = 10 sm.`;
        hint = `Pifagor sonlari: 6, 8, 10.`;
      } else if (i === 4) {
        prompt = `Hisoblang: √75 - √12 ifodaning qiymati nimaga teng?`;
        options = ['3√3', '2√3', '√63', '5√3'];
        correctAnswer = '3√3';
        explanation = `√75 = 5√3, √12 = 2√3. Demak: 5√3 - 2√3 = 3√3.`;
        hint = `75 = 25 × 3 va 12 = 4 × 3 deb yozing.`;
      } else {
        prompt = `Rombning diagonallari 12 sm va 16 sm. Rombning yuzi (S) qancha?`;
        options = ['96 sm²', '192 sm²', '48 sm²', '100 sm²'];
        correctAnswer = '96 sm²';
        explanation = `Romb yuzi diagonallar ko‘paytmasining yarmiga teng: S = (12 × 16) / 2 = 192 / 2 = 96 sm².`;
        hint = `S = (d₁ × d₂) / 2 formulasini eslang.`;
      }
    } else if (grade === 9) {
      if (i === 1) {
        prompt = `Arifmetik progressiyada a₁ = 3, d = 4 bo‘lsa, a₁₀ ni toping.`;
        options = ['39', '43', '36', '40'];
        correctAnswer = '39';
        explanation = `a₁₀ = a₁ + 9d = 3 + 9 × 4 = 3 + 36 = 39.`;
        hint = `aₙ = a₁ + (n - 1)d formulasini qo‘llang.`;
      } else if (i === 2) {
        prompt = `Asosiy trigonometrik ayniyatdan foydalaning: Agar sin α = 0.6 bo‘lsa, cos²α nimaga teng?`;
        options = ['0.64', '0.8', '0.36', '0.4'];
        correctAnswer = '0.64';
        explanation = `cos²α = 1 - sin²α = 1 - (0.6)² = 1 - 0.36 = 0.64.`;
        hint = `sin²α + cos²α = 1 ekanligini yodga oling.`;
      } else if (i === 3) {
        prompt = `Parabola uchi koordinatasini toping: y = x² - 4x + 7. x₀ nuqta nechchi?`;
        options = ['2', '-2', '4', '-4'];
        correctAnswer = '2';
        explanation = `x₀ = -b / (2a) = -(-4) / (2 × 1) = 4 / 2 = 2.`;
        hint = `x₀ = -b / (2a) formulasini ishlating.`;
      } else if (i === 4) {
        prompt = `Geometrik progressiyada b₁ = 2, q = 3 bo‘lsa, dastlabki 3 ta hadi yig‘indisi (S₃) nechchi?`;
        options = ['26', '24', '18', '20'];
        correctAnswer = '26';
        explanation = `Hadlar: b₁ = 2, b₂ = 6, b₃ = 18. Yig‘indi: 2 + 6 + 18 = 26.`;
        hint = `Har bir hadni oldingisini 3 ga ko‘paytirib toping.`;
      } else {
        prompt = `Oddiy o‘yin soqqasi (zarik) tashlanganda toq son tushish ehtimolligi qancha?`;
        options = ['1/2', '1/3', '1/6', '2/3'];
        correctAnswer = '1/2';
        explanation = `Jami hollar: 6 ta (1, 2, 3, 4, 5, 6). Qulay hollar: 3 ta (1, 3, 5). Ehtimollik: 3/6 = 1/2.`;
        hint = `Toq sonlar nechta va jami yuzlar nechta?`;
      }
    } else if (grade === 10) {
      if (i === 1) {
        prompt = `Hisoblang: log₂ 32 qiymati nimaga teng?`;
        options = ['5', '4', '6', '16'];
        correctAnswer = '5';
        explanation = `2 ning 5-darajasi 32 ga teng bo‘lgani uchun log₂ 32 = 5.`;
        hint = `2 ning nechanchi darajasi 32 bo‘ladi?`;
      } else if (i === 2) {
        prompt = `Keltirish formulasini qo‘llang: sin(π - α) nimaga teng?`;
        options = ['sin α', '-sin α', 'cos α', '-cos α'];
        correctAnswer = 'sin α';
        explanation = `II chorakda sinus musbat va π da funksiya nomi o‘zgarmaydi: sin(π - α) = sin α.`;
        hint = `II koordinata choragida sinus ishorasini eslang.`;
      } else if (i === 3) {
        prompt = `Tenglamani yeching: 2ˣ = 64. x nimaga teng?`;
        options = ['6', '5', '7', '8'];
        correctAnswer = '6';
        explanation = `64 = 2⁶ bo‘lgani uchun 2ˣ = 2⁶, demak x = 6.`;
        hint = `64 ni 2 ning darajasi sifatida tasvirlang.`;
      } else if (i === 4) {
        prompt = `Logarifm xossasidan foydalaning: log₃ 6 + log₃ 1.5 = ?`;
        options = ['2', '3', '1', '4'];
        correctAnswer = '2';
        explanation = `log₃ 6 + log₃ 1.5 = log₃(6 × 1.5) = log₃ 9 = 2.`;
        hint = `Logarifmlar yig‘indisi ko‘paytma logarifmiga teng.`;
      } else {
        prompt = `Fazoda ikki tekislikning umumiy nuqtasi bo‘lmasa, bu tekisliklar qanday joylashgan?`;
        options = ['Parallel', 'Kesişuvchi', 'Perpendikulyar', 'Ayqash'];
        correctAnswer = 'Parallel';
        explanation = `Fazoda hech qanday umumiy nuqtaga ega bo‘lmagan tekisliklar parallel tekisliklar deyiladi.`;
        hint = `Xonaning poli va shiftini tasavvur qiling.`;
      }
    } else {
      // Grade 11
      if (i === 1) {
        prompt = `Hisoblang: f(x) = x³ - 5x² + 7 funksiyaning hosilasi f'(x) nimaga teng?`;
        options = ['3x² - 10x', '3x² - 5x', 'x² - 10x', '3x² - 10x + 7'];
        correctAnswer = '3x² - 10x';
        explanation = `(x³)' = 3x², (-5x²)' = -10x, o‘zgarmas (7)' = 0. Demak: 3x² - 10x.`;
        hint = `(xⁿ)' = n × xⁿ⁻¹ qoidasini qo‘llang.`;
      } else if (i === 2) {
        prompt = `Aniq integralni hisoblang: ∫₀² 2x dx qiymati nechchi?`;
        options = ['4', '2', '8', '6'];
        correctAnswer = '4';
        explanation = `Boshlang‘ich funksiya F(x) = x². Nyuton-Leybnits bo‘yicha: F(2) - F(0) = 2² - 0² = 4.`;
        hint = `2x ning boshlang‘ichi x² bo‘ladi.`;
      } else if (i === 3) {
        prompt = `f(x) = sin x funksiyaning x = 0 nuqtadagi hosilasi f'(0) nimaga teng?`;
        options = ['1', '0', '-1', '1/2'];
        correctAnswer = '1';
        explanation = `(sin x)' = cos x. x = 0 bo‘lganda: cos 0 = 1.`;
        hint = `(sin x)' = cos x formulasini eslang.`;
      } else if (i === 4) {
        prompt = `Radiusi R = 3 bo‘lgan shar hajmi (V) qaysi formula bilan hisoblanadi?`;
        options = ['V = 4/3 πR³', 'V = 4πR²', 'V = πR²h', 'V = 1/3 πR³'];
        correctAnswer = 'V = 4/3 πR³';
        explanation = `Shar hajmi formulasi: V = 4/3 π R³. R = 3 bo‘lganda V = 36π.`;
        hint = `Shar hajmi radiusning kubiga to‘g‘ri mutanosib.`;
      } else {
        prompt = `Funksiya grafigiga x₀ nuqtada o‘tkazilgan urinmaning burchak koeffitsiyenti nimaga teng?`;
        options = ['k = f\'(x₀)', 'k = f(x₀)', 'k = 1/f\'(x₀)', 'k = x₀'];
        correctAnswer = 'k = f\'(x₀)';
        explanation = `Hosilaning geometrik ma’nosi: k = tg α = f\'(x₀).`;
        hint = `Hosilaning geometrik ma’nosini eslang.`;
      }
    }

    qList.push({
      id: qId,
      lessonId: lessonId,
      sectionId: `sec-${lessonId}-s1`,
      prompt,
      type: 'MULTIPLE_CHOICE',
      options,
      correctAnswer,
      explanation,
      hint,
      orderIndex: i,
    });
  }
  return qList;
}

function generateWorkedExamples(grade, title) {
  return [
    {
      id: 'ex-1',
      title: '1-misol: Asosiy qoidani qo‘llash',
      problem: `Mavzuga oid namunaviy topshiriqni qadamma-qadam yechish va tushuntirish.`,
      solution: `1-qadam: Shartni matematik tilda yozamiz.\n2-qadam: Tegishli qoida yoki formulani qo‘llaymiz.\n3-qadam: Natijani tekshirib yakuniy javobni olamiz.`,
      formulaLatex: `a + b = c`,
    },
    {
      id: 'ex-2',
      title: '2-misol: Murakkabroq amaliy holat',
      problem: `Hayotiy amaliyotda ushbu mavzu qanday qo‘llanilishini ko‘rib chiqamiz.`,
      solution: `Berilgan ma’lumotlarni tizimlashtiramiz va oraliq amallarni xatolariz bajaramiz. Javob to‘g‘riligini qayta hisoblab tasdiqlaymiz.`,
      formulaLatex: `S = v \\times t`,
    }
  ];
}

const allGeneratedLessons = [];

curriculumData.forEach((gradeData) => {
  const { grade, chapter, lessons } = gradeData;
  lessons.forEach((l, idx) => {
    const orderIndex = idx + 1;
    const lessonId = `lesson-g${grade}-${String(orderIndex).padStart(2, '0')}`;
    const courseId = `course-g${grade}-math`;
    const chapterId = `chap-g${grade}-01`;
    const topicKey = `topic_g${grade}_${orderIndex}`;

    const contentMd = `### Dars maqsadi va qisqacha mazmuni
Ushbu darsda siz "${l.title}" mavzusi bilan atroflicha tanishasiz. Matematika fanining ushbu bo‘limi nazariy va amaliy jihatdan juda muhim o‘rin tutadi.

### Asosiy tushuntirish va qoidalar
Matematikani o‘rganishda har bir qadam ketma-ketlikka asoslanadi. ${l.desc}
Asosiy qoida: Amallarni bajarishda belgilangan ketma-ketlik va xossalarga qat’iy rioya qiling.

### Xulosa va amaliy ko‘nikma
Mavzuni to‘liq o‘zlashtirish uchun berilgan ishlangan misollarni o‘rganing va dars oxiridagi 5 ta nazorat testini bajaring!`;

    const questions = generateQuestionsForLesson(lessonId, grade, l.title);
    const examples = generateWorkedExamples(grade, l.title);

    allGeneratedLessons.push({
      id: lessonId,
      courseId,
      chapterId,
      chapterTitle: chapter,
      grade,
      mode: 'KIDS',
      title: l.title,
      topicKey,
      description: l.desc,
      formulaLatex: l.formula,
      contentMd,
      rewardXP: 80 + grade * 6,
      rewardCoins: 10 + grade * 1,
      orderIndex,
      icon: l.icon,
      accentColor: l.color,
      status: 'PUBLISHED',
      sections: [
        {
          id: `sec-${lessonId}-s1`,
          lessonId,
          title: '1-qism: Asosiy mavzu va testlar',
          orderIndex: 1,
          questions,
        }
      ],
      examples,
    });
  });
});

console.log(`Jami generatsiya qilingan darslar: ${allGeneratedLessons.length}`);

// Generate TypeScript file
const tsContent = `// Auto-generated 220+ Curriculum lessons for MathCity AI
// Exactly 20 lessons per grade for Grades 1 to 11 (Total: ${allGeneratedLessons.length})
import { LessonModel } from './dataStore.js';

export const curriculum220Lessons: LessonModel[] = ${JSON.stringify(allGeneratedLessons, null, 2)};
`;

const outputPath = path.join(__dirname, '../src/utils/curriculum220.ts');
fs.writeFileSync(outputPath, tsContent, 'utf-8');
console.log(`Muvaffaqiyatli saqlandi: ${outputPath}`);
