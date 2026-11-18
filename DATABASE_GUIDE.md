# MathCity AI — Ma’lumotlar Bazasi va Xavfsizlik Qo‘llanmasi (Database Guide)

Ushbu qo‘llanma **MathCity AI** loyihasining PostgreSQL ma’lumotlar bazasi, Prisma ORM konfiguratsiyasi, zaxiralash (backup) va 30 kunlik bepul muddatni boshqarish bo‘yicha to‘liq qo‘llanmadir.

---

## 1. Ma’lumotlar Bazasi Arxitekturasi

Platformada 24 ta ma’lumotlar modeli mavjud (`backend/prisma/schema.prisma`):
- **Autentifikatsiya va Talabalar:** `User`, `Student`, `StudentProfile`, `StudentSession`, `AuditLog`
- **Ta’lim Tizimi:** `Lesson`, `WorkedExample`, `Question`, `QuestionOption`, `ExerciseAttempt`, `DailyTask`
- **O‘yinlar va Iqtisodiyot:** `GameSession`, `CityBuilding`, `BuildingPurchase`, `CoinTransaction`, `XpTransaction`, `Achievement`
- **Sun’iy Intellekt (AI Ustoz):** `AiConversation`, `AiMessage`, `AiQuota`
- **Moliya va Obuna:** `Subscription`, `PaymentOrder`, `PaymentTransaction`, `AdminAuditLog`

---

## 2. Ikki Bosqichli (Dual-Mode) Ulanish Tizimi

Loyihada ishlab chiquvchilar uchun qulay va ishonchli **Dual-Mode** arxitekturasi joriy etilgan:
1. **PostgreSQL Rejimi (Production / Online):**
   `DATABASE_URL` mavjud bo‘lganda, Prisma Client to‘g‘ridan-to‘g‘ri PostgreSQL bazasiga ulanadi va barcha ma’lumotlar ACID tranzaksiyalari bilan saqlanadi.
2. **Lokal / Xotira Rejimi (Local Offline Fallback):**
   Agar lokal PostgreSQL serveri ishlamayotgan bo‘lsa, backend avtomatik ravishda in-memory/faylli xotira rejimiga o‘tadi. Dasturchi login, darslar, savollar va to‘lovlarni xatosiz sinovdan o‘tkazaveradi.

---

## 3. Render 30 Kunlik PostgreSQL Muddatini Boshqarish

> [!WARNING]
> Render platformasining bepul PostgreSQL xizmati 30 kundan so‘ng avtomatik tarzda to‘xtatiladi. Ma’lumotlarni yo‘qotmaslik uchun quyidagi reja joriy qilingan.

### A. Avtomatik Zaxira Olish (Backup)
Zaxira nusxasini olish uchun backend katalogida quyidagi buyruqni bering:
```bash
cd backend
npm run db:backup
```
Yoki to‘g‘ridan-to‘g‘ri `pg_dump` orqali:
```bash
pg_dump "$DATABASE_URL" > backups/mathcity_backup_$(date +%Y%m%d).sql
```

Demo kontentlar (eski 115 ta savol va 15 ta dars) allaqachon xavfsiz holda `backend/backups/demo_content_backup.json` fayliga zaxiralangan.

### B. Bepul Alternativlarga Ko‘chirish (Migration Plan)
30 kunlik muddat yaqinlashganda:
1. **Neon.tech** (Doimiy bepul PostgreSQL, 0.5 GB hajm) yoki **Supabase** (500 MB bepul) xizmatidan bepul hisob oching.
2. Yangi olingan `DATABASE_URL` manzilini Render Dashboard'dagi backend sozlamalariga kiriting.
3. Zaxira faylini tiklang:
```bash
psql "$YANGI_DATABASE_URL" < backups/mathcity_backup_oxirgi.sql
```

---

## 4. Administrator va Kontent Qoidasi

- **0 Savol Boshlang‘ich Holati:**
  Admin panelining savollar bazasi to‘liq tozalangan va 0 holatiga keltirilgan (`Jami: 0`, `Kids: 0`, `O‘smirlar: 0`).
- **O‘quvchilar Ma’lumotlari:**
  Foydalanuvchi hisoblari, parollarining bcrypt xesh qiymatlari, tangalar, XP va AI yozishmalari hech qachon o‘chirilmaydi.
