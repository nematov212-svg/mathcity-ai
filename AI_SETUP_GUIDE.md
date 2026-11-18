# MathCity AI — AI Ustoz (Gemini) Sozlash va Integratsiya Qo‘llanmasi

Ushbu qo‘llanma **MathCity AI** platformasining **AI Ustoz (Ziyo Tutor)** modulini Gemini API bilan xavfsiz va samarali ulash bo‘yicha to‘liq texnik ko‘rsatmalarni o‘z ichiga oladi.

---

## 1. Arxitektura va Xavfsizlik Tamoyillari

MathCity AI arxitekturasida **Zero-Trust Client** tamoyiliga amal qilinadi:
1. **Faqat Backend Ulanishi (Backend-Only):**
   Foydalanuvchining mobil yoki veb ilovasi (Flutter Web/iOS/Android) **hech qachon to‘g‘ridan-to‘g‘ri Google Gemini API ga murojaat qilmaydi**. Barcha so‘rovlar autentifikatsiyadan o‘tgan ichki API (`POST /api/ai/chat`, `POST /api/ai/chat/image`, `POST /api/ai/chat/voice`) orqali boradi.
2. **Maxfiy Kalit Xavfsizligi:**
   `GEMINI_API_KEY` faqat `backend/.env` faylida saqlanadi. U hech qachon Flutter kodiga, Git repozitoriyasiga, brauzer keshiga yoki foydalanuvchi loglariga yozilmaydi.
3. **Resilient Fallback (To‘xtovsizlik Kafolati):**
   Agar Gemini API `403 Forbidden` (billing/tier yoqilmagan), `429 Too Many Requests` (Google kvotasi yetarli emas) yoki tarmoq uzilishi qaytarsa, backend darhol ichki deterministik pedagogik matematika dvigateli (`MathSolver`) orqali qadamma-qadam yechimni taqdim etadi. Talaba hech qachon xatosiz javobsiz qolmaydi.

---

## 2. Muhit O‘zgaruvchilarini Sozlash (`backend/.env`)

Backend katalogidagi `.env` fayliga quyidagi qatorlarni kiriting:

```env
# Google Gemini API Kaliti (Google AI Studio orqali olingan)
GEMINI_API_KEY="SIZNING_GEMINI_API_KALITINGIZ"

# Tanlangan Gemini modeli (Standart: gemini-2.5-flash)
GEMINI_MODEL="gemini-2.5-flash"
```

> [!NOTE]
> `backend/.env.example` faylida maxfiy qiymatlarsiz shablon joylashtirilgan:
> ```env
> GEMINI_API_KEY=""
> GEMINI_MODEL="gemini-2.5-flash"
> ```

---

## 3. Gemini API Kalitini Olish va Sozlash (Google AI Studio)

1. [Google AI Studio (aistudio.google.com)](https://aistudio.google.com/) platformasiga kiring.
2. **Get API key** tugmasini bosing va yangi API kalit yarating.
3. **Billing & Tier Holati:**
   * Yangi ochilgan oddiy loyihalarda Google ba'zi mintaqalar uchun bepul kvotani cheklashi mumkin (`403 Forbidden: The Gemini API free tier is not available for this project`).
   * Buni bartaraf qilish uchun [aistudio.google.com/billing](https://aistudio.google.com/billing) bo‘limiga kirib, to‘lov hisobini (Pay-as-you-go) ulang yoki to‘lov hisobi ulangan Google Cloud Project ni tanlang (birinchi 1 million token ko‘p holatlarda bepul yoki juda arzon).
4. **Kalit Cheklovlari (Key Restrictions):**
   * Google Cloud Console > APIs & Services > Credentials bo‘limida yaratilgan kalitni oching.
   * **API restrictions:** Faqat `Generative Language API` ga ruxsat bering.
   * **Application restrictions:** Backend serveringiz IP manzilini (masalan, Render server IP yoki `None`) tanlang. Hech qachon HTTP Referrer cheklovini tanlamang (chunki so‘rov server orqali yuboriladi, brauzer orqali emas).

---

## 4. Kalitni Yangilash (Rotation)

Agar kalitni almashtirish yoki xavfsizlik maqsadida yangilash zarur bo‘lsa:
1. Google AI Studio da yangi API kalit yarating.
2. `backend/.env` faylidagi `GEMINI_API_KEY` qiymatini yangisiga almashtiring.
3. Render boshqaruv panelida: **Environment Variables > GEMINI_API_KEY** qiymatini yangilang.
4. Backend serverini qayta ishga tushiring:
   ```bash
   cd backend && node dist/server.js
   ```
5. Eski kalitni Google Cloud Console orqali o‘chirib tashlang (Revoke).

---

## 5. API Endpoints Ro‘yxati (Faqat Autentifikatsiyalangan Talabalar Uchun)

| Endpoint | Metod | Tavsif | Kiruvchi ma'lumotlar |
| :--- | :---: | :--- | :--- |
| `/api/ai/chat` | `POST` | Matnli matematika savoli | `{ message: string, conversationId?: string, action?: string }` |
| `/api/ai/chat/image` | `POST` | Galereyadan rasm orqali savol | `{ imageBase64: string, mimeType: string, fileName?: string }` |
| `/api/ai/chat/voice` | `POST` | Ovozli matematika savoli | `{ transcribedText: string, audioBase64?: string, mimeType?: string }` |
| `/api/ai/conversations` | `GET` | O‘quvchining barcha suhbatlari | Bo‘sh (JWT token orqali aniqlanadi) |
| `/api/ai/conversations/:id` | `GET` | Muayyan suhbat va uning xabarlari | `:id` (faqat o‘ziga tegishli) |
| `/api/ai/conversations/:id` | `DELETE` | Suhbatni o‘chirish | `:id` (faqat egasi o‘chira oladi) |
| `/api/ai/quota` | `GET` | 24 soatlik AI kvotasi holati | Bo‘sh (Free: 5/5, Pro: cheksiz) |

---

## 6. Kvotalar va Foydalanish Limitlari

* **Bepul Tarif (Free Trial / Standart):**
  * Rolling 24-soatlik davr uchun **5 ta bepul AI so‘rovi** beriladi.
  * 5 ta tugagach, HTTP 429 (`AI_QUOTA_EXCEEDED`) qaytariladi va MathCity Pro ga o‘tish taklif qilinadi.
* **MathCity Pro Ta'rifi (29 000 UZS/oy):**
  * Cheksiz savol-javoblar.
  * Tezkor javob va barcha yechim qadamlari.
