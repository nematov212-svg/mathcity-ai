# MathCity AI — 100% Offline AI Ustoz (MathSolver) Tizim Qo‘llanmasi

Ushbu hujjat **MathCity AI** platformasining **AI Ustoz (Ziyo Tutor)** moduli arxitekturasi haqida to‘liq texnik ma'lumot beradi. Tizim tashqi AI/LLM API'lariga (Google Gemini, OpenAI, Claude va h.k.) mutlaqo bog‘liq emas — u 100% mahalliy (offline), qoidalarga asoslangan matematik tahlilchi va o‘zbek tili tabiiy tilini tushunish dvigateli (UzbekMathNLU & MathSolver) asosida ishlaydi.

---

## 1. Nima Uchun 100% Offline MathSolver?

1. **Hech qanday tashqi API kalit talab etilmaydi:**
   Serverda yoki `.env` da `GEMINI_API_KEY` yoki boshqa tashqi kalitlar bo‘lishi shart emas. Loyiha nol tashqi xarajat va nol kvota blokirovkasi bilan ishlaydi.
2. **Qat'iy aniqlik va gallyutsinatsiyasiz javob:**
   Katta til modellari (LLM) ba'zan matematik hisoblarda xato (gallyutsinatsiya) qilishi mumkin. MathCity MathSolver qat'iy matematik qoidalar, kasrlar qisqartmasi, algebraik tenglama algoritmlari va Vieta formulalari orqali hisoblaydi va har bir yechimni **ikkilamchi tekshiruv (dual-method verification)** orqali tasdiqlaydi.
3. **Maksimal tezlik:**
   Tashqi tarmoq kechikishlari (HTTP latency) yo‘q. Matematika masalasi millisoniyalarda tahlil qilinadi va javob qaytariladi.
4. **To‘liq ma'lumotlar xavfsizligi:**
   O‘quvchining savollari, rasmlari yoki ovozli xabarlari hech qachon tashqi serverlarga uzatilmaydi.

---

## 2. Standart Yechim Formati

Dvigatel qat'iy ravishda quyidagi 4 qismli standart o‘zbekcha formatda javob beradi:

```text
Tushunganim: <savolni o'z so'zimiz bilan qayta ifodalash>

Yechish:
1-qadam: ...
2-qadam: ...

Javob: <aniq natija>

Tekshirish: <teskari amal yoki tenglamaga qo'yish orqali tekshiruv>
```

---

## 3. O‘zbek Tili Tushunish Tizimi (UzbekMathNLU)

- **Normalizatsiya:** Kichik harfga o‘tkazish, turli apostroflarni (`o‘`, `o'`, `o``, `oʻ`) standartlashtirish, matematik belgilarni (`×`, `·`, `:`, `÷`) umumiy standartga keltirish.
- **Son so‘zlarini raqamga o‘girish:** Bir, ikki, uch, ..., o‘n, yigirma, ..., yuz, ming, million, shuningdek aralash sonlar ("bir yuz yigirma uch" $\to$ 123, "yarim" $\to$ 0.5, "chorak" $\to$ 0.25).
- **Kelishik qo‘shimchalarini tahlil qilish:**
  - `4 ga 5 ni qo'sh` $\implies 4 + 5$
  - `10 dan 3 ni ayir` $\implies 10 - 3$
  - `6 bilan 7 ni ko'paytir` $\implies 6 \times 7$
  - `20 ni 4 ga bo'l` $\implies 20 / 4$

---

## 4. Qamrab Olingan 18 ta Matematika Toifasi

1. **Arifmetika:** Qo‘shish, ayirish, ko‘paytirish, bo‘lish (matnli va belgili).
2. **Ifoda hisoblash:** Qavslar, amallar tartibi, murakkab algebraik ifodalar.
3. **Chiziqli tenglamalar:** $ax + b = c$ va $ax + b = cx + d$.
4. **Kvadrat tenglamalar:** $ax^2 + bx + c = 0$, diskriminant ($D = b^2 - 4ac$) va Vieta formulasi orqali tekshirish.
5. **Tenglamalar sistemasi:** 2 noma'lumli chiziqli tenglamalar sistemasi.
6. **Tengsizliklar:** Chiziqli tengsizliklar va oraliqlar ($x \in (a, b)$).
7. **Kasrlar:** Oddiy kasrlar amallari, qisqartirish, aralash kasrga aylantirish.
8. **Foiz masalalari:** Sonning foizi, foizga oshirish yoki kamaytirish.
9. **Daraja va ildiz:** $a^b$, $\sqrt{x}$, $\sqrt[3]{x}$, daraja xossalari.
10. **EKUB va EKUK:** Evklid algoritmi orqali eng katta umumiy bo‘luvchi va eng kichik umumiy karrali.
11. **Tub sonlar va ko‘paytuvchilar:** Tublikni tekshirish, tub ko‘paytuvchilarga ajratish.
12. **Hosila:** Darajali funksiyalar va ko‘phadlarning hosilasi ($(x^n)' = n \cdot x^{n-1}$).
13. **Integral:** Aniqmas integral ($\int x^n dx = \frac{x^{n+1}}{n+1} + C$).
14. **Limit:** $\lim_{x \to a} f(x)$ sodda algebraik limitlar.
15. **Geometriya:** Uchburchak, to‘g‘ri to‘rtburchak, kvadrat, doira yuzi va perimetri.
16. **Progressiyalar:** Arifmetik va geometrik progressiya hadlari va yig‘indisi.
17. **Birlik o‘zgartirish:** Uzunlik (km, m, sm, mm), og‘irlik (kg, g, t), vaqt (soat, minut, sekund).
18. **Matnli so‘zli masalalar:** Masofa, tezlik, vaqt ($S = v \cdot t$), yoshga doir masalalar.

---

## 5. Tushunilmagan Savollar va Xavfsizlik

Agar savol yuqoridagi qoidalarga to‘g‘ri kelmasa:
- Tizim **hech qachon gallyutsinatsiya qilmaydi** yoki yolg‘on javob to‘qimaydi.
- Quyidagi do‘stona yordam xabari qaytariladi:
  ```text
  Savolni to‘liq tushunmadim. Iltimos, quyidagi namunalardan biri kabi yozing:
  • 2x + 6 = 16 (tenglamalar)
  • 15 ning 20 foizi (foizlar)
  • EKUB(24, 36) yoki EKUK(12, 18)
  • 4 ga 5 ni qo‘shsa nechi chiqadi
  ```
- Savol matni `repository.logUnrecognizedQuery` orqali tizim loglariga kiritiladi, bu esa tizimni kelajakda yangi shablonlar bilan kengaytirish imkonini beradi.
