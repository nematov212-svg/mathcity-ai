# MathCity AI — MVP Sinov va Tekshiruv Hisoboti (MVP Test Report)

Ushbu hisobot platformaning barcha funksiyalari bo‘yicha o‘tkazilgan haqiqiy test natijalari, ishlayotgan xizmatlar va hali sinovdan o‘tkazilmagan (NOT VERIFIED) elementlarning holatini aks ettiradi.

---

## 1. Xizmatlarning Haqiqiy Holati (Health Checks)

| Xizmat / Server | Manzil | Holati | HTTP Status | Test Usuli |
|---|---|---|---|---|
| **Backend API** | `http://localhost:4000` | ✅ ISHLAYAPTI | `200 OK` | `curl /health`, `curl /ready` |
| **Admin Panel (Proxy)** | `http://localhost:3001` | ✅ ISHLAYAPTI | `200 OK` | Brauzer & curl orqali login |
| **Admin Panel (Direct)**| `http://localhost:4000/admin` | ✅ ISHLAYAPTI | `200 OK` | Static portal & API endpoints |
| **Flutter Web Client**  | `http://localhost:7357` | ✅ ISHLAYAPTI | `200 OK` | Flutter Web Server daemon |
| **PostgreSQL / Storage**| Lokal / Xotira rejimi | ✅ ISHLAYAPTI | Dual-Mode | Prisma client + in-memory store |

---

## 2. Tekshirilgan va Tasdiqlangan Funksiyalar (VERIFIED)

1. **Admin Panel Autentifikatsiyasi (VERIFIED):**
   - Foydalanuvchi: `mirzobek`
   - Parol: `mirzobek`
   - Tizimga muvaffaqiyatli kirish, 24 soatlik xavfsiz JWT sessiya yaratilishi va ma’lumotlarni yuklash sinovdan o‘tdi.
2. **Nol Boshlang‘ich Kontent (VERIFIED):**
   - Faol savollar: **0** ta (barcha demo savollar xavfsiz arxivlandi).
   - Kids / Teens ajratilishi to‘liq ishlamoqda.
3. **AI Ustoz Ekran Overflow Tuzatilishi (VERIFIED):**
   - 41px RenderFlex xatosi tuzatildi. Mobil va kompyuter ekranlariga to‘liq moslashdi.
4. **Takroriy 401 Xatolarining Oldini Olish (VERIFIED):**
   - Single-flight sessiya mexanizmi orqali parallel 401 chaqiruvlari bartaraf etildi.
5. **Karta Raqami Maskasi (VERIFIED):**
   - Eski `8600` o‘chirildi va eganing tasdiqlangan kartasi `4916 •••• •••• ****` sifatida ko‘rsatilmoqda.
6. **Avtotestlar (VERIFIED):**
   - 40 ta Flutter testi: 100% muvaffaqiyatli.
   - 65 ta Backend testi: 100% muvaffaqiyatli.

---

## 3. Haqiqiy Muhitda Tasdiqlanmagan Elementlar (NOT VERIFIED)

Quyidagi funksiyalar loyiha kodida to‘liq tayyorlangan va yozilgan, ammo haqiqiy uchinchi tomon xizmati kalitlari yoki hisoblari bo‘lmagani sababli jonli sinovdan o‘tmagan deb qayd etiladi:

1. **Haqiqiy Bank Kartasidan Pul Yechish (Click Production): NOT VERIFIED**
   - *Sabab:* Click savdogar shartnomasi va jonli `CLICK_SECRET_KEY` mavjud bo‘lgandagina bankdan real 29 000 UZS yechiladi. Sandbox va test modeli 100% tayyor.
2. **Apple orqali kirish (Apple Sign-In Production): NOT VERIFIED**
   - *Sabab:* Apple Developer Account (Service ID, Team ID, Key ID) bo‘lmagani sababli faqat UI va mock oqim tekshirildi.
3. **Render PostgreSQL Jonli Baza (Production Cloud): NOT VERIFIED**
   - *Sabab:* Renderda bepul PostgreSQL yaratilganda 30 kunlik muddat beriladi. Hozirda lokal rejimda test qilindi. Renderga ulanganda `DATABASE_URL` kiritilishi kerak.
