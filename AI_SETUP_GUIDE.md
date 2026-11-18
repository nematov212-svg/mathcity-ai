# MathCity AI — AI Ustoz Sozlash va Integratsiya Qo‘llanmasi (AI Setup Guide)

## 1. Umumiy Tushuncha

MathCity AI platformasida sun'iy intellekt matematika repetitori **"AI Ustoz"** deb ataladi. U o‘quvchining yoshiga moslashuvchi pedagogik ko‘nikmaga ega bo‘lib, misollarni yechishda bolalarni fikrlashga undaydi.

---

## 2. Server Sozlamalari va Kalitlar

Backend `.env` faylida quyidagi o‘zgaruvchilar sozlanadi:

```env
# Google Gemini API Kaliti
GEMINI_API_KEY=your_gemini_api_key_here
AI_MODEL_NAME=gemini-1.5-flash
```

---

## 3. Qat'iy Kunlik Limit (Quota Management)

- **Bepul foydalanuvchilar:**
  - Kunlik 5 ta bepul so‘rov / 24 soatlik oyna.
  - Har bir so‘rovda qolgan limit hisoblab boriladi (`Qolgan bepul so‘rovlar: X/5`).
  - 6-so‘rov kiritilganda server `429 Too Many Requests` qaytaradi va Pro tarifiga o‘tish taklif qilinadi.

- **MathCity Pro foydalanuvchilari:**
  - Cheksiz so‘rovlar berish imkoniyati (`AI Ustoz Pro — Cheksiz savollar`).

---

## 4. Ovoz va Tasvir Orqali Misollarni Yechish

1. **Kamera / Galereya:**
   - Foydalanuvchi qog‘ozdagi misol yoki geometrik chizmani rasmga olib yuboradi.
   - Serverdagi optik modul matn va tenglamalarni aniqlab, LaTeX ko‘rinishida qadam-baqam yechim tayyorlaydi.

2. **Ovozli Xabarlar (Voice Math):**
   - Foydalanuvchi mikrofon orqali savol beradi (masalan: *"Yigirma beshni beshga bo‘lsak nechchi bo‘ladi?"*).
   - Audio matnga o‘giriladi va matematik yechim taqdim etiladi.

---

## 5. Salomlashish va Shaxsiylashtirish

- AI Ustoz har bir talabaga uning o‘z ismi bilan murojaat qiladi:
  `"Salom, {userDisplayName}! 👋\nMen sizning shaxsiy AI Ustozingizman! 🤖✨"`
- Hech qachon ismlar statik holda qotirilmaydi.
