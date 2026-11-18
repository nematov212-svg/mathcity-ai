# MathCity AI — Ma'lumotlarni Saqlash va Izolyatsiya Qo‘llanmasi (Data Storage Guide)

## 1. Arxitektura va Ma'lumotlar Bazasining Tuzilishi

MathCity AI foydalanuvchilar ma'lumotlarini to‘liq xavfsiz va bir-biridan izolyatsiya qilingan holda saqlash uchun **PostgreSQL** va **Prisma ORM** arxitekturasidan foydalanadi.

### Asosiy Jadvallar (Schema Entities):
1. **`users`:**
   - `id` (UUIDv4): Asosiy unikal kalit.
   - `displayName`: O‘quvchining haqiqiy ismi (UI va AI Ustozda ko‘rsatiladi).
   - `email`: Elektron pochta (unikal).
   - `username`: Foydalanuvchi logini (unikal).
   - `passwordHash`: Bcrypt (12-tuzli) xesh.
   - `age`: 6–16 yosh oralig‘ida (tekshiriladi).
   - `mode`: `KIDS` (6–12 yosh) yoki `TEEN` (13–16 yosh).
   - `grade`: 3-sinfdan 11-sinfgacha.
   - `coinBalance`: Oltin tangalar balansi (musbat butun son).
   - `totalXP`: Umumiy tajriba ballari.
   - `level`: Shahar va bilim darajasi.
   - `cityLevel`: Qurilgan binolar va obodonlik darajasi.
   - `resetToken`: Parolni tiklash uchun bir martalik 15 daqiqalik token.
   - `resetTokenExpiresAt`: Token muddati.

2. **`subscriptions`:**
   - `userId`: Bog‘langan talaba identifikatori.
   - `planName`: `MATHCITY_FREE` yoki `MATHCITY_PRO`.
   - `status`: `PRO_ACTIVE`, `FREE_TRIAL_ACTIVE`, yoki `INACTIVE`.
   - `proStartedAt` / `proExpiresAt`: Obuna muddatlari.
   - `priceMonthlyUzs`: 29,000 UZS.

3. **`lessons` va `questions`:**
   - Dars mavzulari, sinflar, LaTeX formulalari, nazariy matnlar (`contentMd`).
   - Savollar varianti, to‘g‘ri javob indeksi va qadam-baqam tushuntirishlar.

4. **`user_progress`:**
   - O‘quvchining har bir dars va test bo‘yicha natijalari, ballari va yechilgan vaqtlari.

5. **`transactions` va `payouts`:**
   - To‘lov buyurtmalari (Click, Karta), holati (`SUCCESS`, `PENDING`, `FAILED`).
   - Eganing hisob-kitob kartasi (`•••• •••• •••• 7821`) audit yozuvlari.

---

## 2. Foydalanuvchilar Izolyatsiyasi (Data Isolation)

- **JWT Tokeni:** Har bir so‘rov `Authorization: Bearer <token>` sarlavhasi orqali tekshiriladi.
- **Kontekst:** `authMiddleware` har bir so‘rovda tokendagi `userId` bo‘yicha o‘quvchini aniqlaydi va faqat o‘ziga tegishli resurslarni qaytaradi.
- Talaba A boshqa bir Talaba B ning tangalarini, yutuqlarini yoki test natijalarini ko‘ra olmaydi va o‘zgartira olmaydi.
- Admin portalida talabalarning elektron pochtalari maxfiylikni ta'minlash maqsadida maskalanadi (`al***@mathcity.ai`).

---

## 3. Zaxira Nusxalash va Tiklash (Backup & Recovery)

- Kunlik avtomatik `pg_dump` orqali ma'lumotlar bazasi nusxalanadi.
- Tranzaksiya jurnallari alohida shifrlangan saqlagichda yuritiladi.
