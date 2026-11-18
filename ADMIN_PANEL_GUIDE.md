# MathCity AI — Boshqaruv Paneli Qo‘llanmasi (Admin Panel Guide)

## 1. Kirish va Portlar

MathCity AI mustaqil administrator paneli ikki xil rejimda ishlashi mumkin:

1. **Markaziy Server Portali:**
   - URL: `http://localhost:4000/admin`
   - Markaziy Express backend orqali to‘g‘ridan-to‘g‘ri taqdim etiladi.

2. **Mustaqil Server (Standalone Admin Daemon):**
   - URL: `http://localhost:3001`
   - Ishga tushirish: `npm run admin` (yoki `tsx src/adminServer.ts`)

---

## 2. Administrator Autentifikatsiyasi

- **Maxfiy kalit (API Key):** `mathcity_admin_master_secret_2026` (yoki `.env` faylidagi `ADMIN_API_KEY`).
- Tizimga kirishda ushbu kalit kiritiladi va brauzerning xavfsiz saqlagichida (`localStorage`) saqlanadi.
- Har bir API so‘rovida `Authorization: Bearer <ADMIN_API_KEY>` yuboriladi.

---

## 3. Asosiy Bo‘limlar va Vazifalar

### A. Asosiy Tahlil (Overview Metrics)
- **Jami o‘quvchilar:** Ro‘yxatdan o‘tgan faol talabalar soni.
- **MathCity Pro obunalar:** 29 000 UZS oylik to‘lov qilgan foydalanuvchilar soni.
- **Tasdiqlangan tushum:** Real yig‘ilgan jami mablag‘ (UZS).
- **Eganing hisob-kitob kartasi:** Mablag‘lar avtomatik tarzda tushuvchi `•••• •••• •••• 7821` kartasi holati.

### B. Darslar Boshqaruvi (Lessons Management)
- Darslar jadvali (Sinfi, Yo‘nalishi, Mavzu nomi, Savollar soni, Tanga mukofoti).
- **Yangi dars qo‘shish:** Mavzu nomi, 3–11 sinf tanlovi, rejim (`KIDS`/`TEEN`), LaTeX formulasi va tushuntirish kiritiladi.
- Darsni o‘chirish yoki yangilash.

### C. Savollar Bazasi (Question Bank)
- Mavzular bo‘yicha matematik misollar, test variantlari, to‘g‘ri javoblar va LaTeX yechimlari.
- Yangi savol qo‘shish imkoniyati.

### D. O‘quvchilar Ro‘yxati (Students List)
- O‘quvchilarning balansi, shahar darajasi, yoshi va sinfi.
- Talabalar shaxsiy ma'lumotlari xavfsiz tarzda maskalangan holda ko‘rsatiladi.

### E. Moliya va Karta (Finance & Payments)
- Click Business va bank kartalari orqali amalga oshirilgan to‘lovlar tarixi.
- To‘lov holati (`SUCCESS`, `PENDING`, `FAILED`).
