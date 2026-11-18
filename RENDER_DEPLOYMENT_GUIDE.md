# MathCity AI — Render Bulutiga Joylash va Sozlash Qo‘llanmasi (Render Cloud Deployment Guide)

Ushbu to‘liq amaliy qo‘llanma **MathCity AI** loyihasini Render bulut platformasiga joylashtirish, **Render Managed PostgreSQL** bazasini ulash, Flutter Web ilovasini ishlab chiqarishga chiqarish va Administrator portalini ishga tushirish qadamlarini batafsil tushuntiradi.

---

## 1. Loyihaning Xizmatlar Xaritasi (Architecture Overview)

Loyiha uchun Render platformasida 4 ta o‘zaro bog‘langan resurs ishlatiladi:

1. **`mathcity-ai-db`** — Render Managed PostgreSQL (baza nomi: `mathcity_ai`).
2. **`mathcity-ai-api`** — Backend Node.js/Express Web Service (HTTPS API).
3. **`mathcity-ai-web`** — Flutter Web Static Site (O‘quvchilar veb-ilovasi).
4. **`mathcity-ai-admin`** — Administrator Paneli Static Site (yoki API orqali `/admin`).

---

## 2. 1-USUL: Blueprint orqali 1-Tugma bilan Joylash (Tavsiya etiladi)

Loyiha ildiz papkasida maxsus tayyorlangan **`render.yaml`** mavjud. Bu fayl barcha xizmatlar va bazani avtomatik sozlaydi.

1. **[dashboard.render.com](https://dashboard.render.com)** saytiga GitHub hisobingiz orqali kiring.
2. Yuqori o‘ng burchakdagi **New +** tugmasini bosing va **Blueprint** ni tanlang.
3. O‘zingizning **MathCity AI** GitHub repozitoriysini tanlang.
4. Render avtomatik ravishda `render.yaml` ni o‘qiydi va quyidagilarni ko‘rsatadi:
   - `mathcity-ai-db` (PostgreSQL)
   - `mathcity-ai-api` (Web Service)
   - `mathcity-ai-web` (Static Site)
   - `mathcity-ai-admin` (Static Site)
5. **Apply** tugmasini bosing. Render barcha 4 ta xizmatni o‘zi yaratadi va o‘zaro bog‘laydi.

---

## 3. 2-USUL: Qo‘lda Bosqichma-bosqich Joylash (Manual Step-by-Step)

Agar xizmatlarni alohida qo‘lda yaratmoqchi bo‘lsangiz:

### 1-qadam: Render Managed PostgreSQL yaratish
1. Render Dashboard -> **New +** -> **PostgreSQL**.
2. Quyidagi parametrlarni kiriting:
   - **Name**: `mathcity-ai-db`
   - **Database**: `mathcity_ai`
   - **User**: `mathcity_admin`
   - **Region**: `Frankfurt (EU Central)`
   - **Plan**: `Starter` yoki `Standard` (Eslatma: Free rejasidagi baza 30 kundan keyin to‘xtatiladi, shuning uchun o‘quvchilar maʼlumotlari xavfsizligi uchun Starter/Standard tavsiya etiladi).
3. **Create Database** tugmasini bosing.
4. Baza yaratilgach, uning **Internal Database URL** manzilini nusxalab oling.

### 2-qadam: Backend API Web Service yaratish
1. Render Dashboard -> **New +** -> **Web Service**.
2. GitHub repozitoriyingizni bog‘lang.
3. Parametrlarni to‘ldiring:
   - **Name**: `mathcity-ai-api`
   - **Region**: `Frankfurt (EU Central)`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm run render:build`
   - **Start Command**: `npm run render:start`
   - **Plan**: `Starter`
4. **Health Check Path**: `/health` deb kiriting.

### 3-qadam: Backend Muhit O‘zgaruvchilari (Environment Variables)
**Environment** bo‘limiga o‘ting va quyidagi qiymatlarni qo‘shing:

| O‘zgaruvchi | Qiymat | Tushuntirish |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Ishlab chiqarish rejimi |
| `PORT` | `10000` | Render porti |
| `DATABASE_URL` | `postgresql://mathcity_admin:...@dpg-xxx-a/mathcity_ai` | PostgreSQL Internal Connection String |
| `JWT_SECRET` | `kamida-32-belgidan-iborat-maxfiy-kalit` | Sessiya tokenlari xavfsizligi uchun |
| `ALLOWED_ORIGINS` | `https://mathcity-ai-web.onrender.com,https://mathcity-ai-admin.onrender.com,http://localhost:7357` | CORS ruxsatnomalari |
| `GOOGLE_CLIENT_ID` | `608766203356-d6oq3gvc5n199671ho1npgr240afkjup.apps.googleusercontent.com` | Google OAuth Client ID |
| `GEMINI_API_KEY` | *(Sizning Gemini API kalitingiz)* | AI Ustoz javoblari uchun |

### 4-qadam: Maʼlumotlar Bazasi Migratsiyasi va Boshlang‘ich Darslarni Yuklash
Backend avtomatik tarzda `render:start` buyrug‘i orqali jadvallarni yangilaydi. 15 ta matematika darsini yuklash uchun Render Web Service panelidagi **Shell** bo‘limiga kiring va buyruqni bering:
```bash
npm run prisma:seed
```
yoki mahalliy zaxiradagi barcha maʼlumotlarni ko‘chirish uchun:
```bash
npm run prisma:migrate-local
```
Natijada barcha 15 ta dars, yuzlab mashqlar, 3D shahar binolari va kunlik vazifalar PostgreSQL-ga to‘liq yoziladi.

---

## 4. Flutter Web Ilovasini Joylashtirish (`mathcity-ai-web`)

1. Render Dashboard -> **New +** -> **Static Site**.
2. Repozitoriyingizni bog‘lang.
3. Parametrlarni kiriting:
   - **Name**: `mathcity-ai-web`
   - **Root Directory**: `frontend`
   - **Build Command**: `./build_web.sh`
   - **Publish Directory**: `build/web`
4. **Environment Variables** ga qo‘shing:
   - `API_BASE_URL`: `https://mathcity-ai-api.onrender.com`
5. **Redirects/Rewrites** bo‘limiga o‘tib, marshrutlash (routing) qoidasini qo‘shing:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
   *(Bu qoida brauzerda sahifani yangilaganda (Refresh) 404 xatosi chiqmasligini taʼminlaydi).*

---

## 5. Administrator Dashboardini Joylashtirish (`mathcity-ai-admin`)

Administrator paneli 2 usulda ishlay oladi:

- **1-usul (Statik sayt):** Render Static Site sifatida `backend/public/admin` papkasidan publish qilinadi.
- **2-usul (To‘g‘ridan-to‘g‘ri API orqali):** Backend API avtomatik ravishda `https://mathcity-ai-api.onrender.com/admin` manzilida to‘liq boshqaruv panelini taqdim etadi.

---

## 6. Google Cloud Console va Apple Developer Sozlamalari

Ishlab chiqarish domenlari o‘zgargani sababli OAuth sozlamalarini yangilang:

### Google Cloud Console:
1. **[console.cloud.google.com](https://console.cloud.google.com)** ga kiring.
2. **APIs & Services** -> **Credentials** -> Web Client ID ni oching.
3. **Authorized JavaScript origins** ga quyidagilarni qo‘shing:
   - `https://mathcity-ai-web.onrender.com`
   - `http://localhost:7357`
4. **Authorized redirect URIs** ga qo‘shing:
   - `https://mathcity-ai-web.onrender.com`
   - `https://mathcity-ai-web.onrender.com/auth/callback`
5. O‘zgarishlarni saqlang (Save).

### Apple Developer:
1. **developer.apple.com** -> **Certificates, Identifiers & Profiles** -> **Services IDs**.
2. **Domains and Subdomains**: `mathcity-ai-web.onrender.com`
3. **Return URLs**: `https://mathcity-ai-api.onrender.com/api/auth/apple/callback`

---

## 7. Xizmatlarni Monitoring Qilish va Jurnallar (Logs)

1. **Deploy Logs**: Har bir deploy jarayonida Render konsolidagi `npm run render:build` va `tsc` natijalarini ko‘rsatadi.
2. **Live Service Logs**: Backend ishlayotgan paytda barcha kiruvchi so‘rovlar, API statuslari va xatolar real vaqtda ko‘rinadi.
3. **Database Metrics**: Render Dashboard -> `mathcity-ai-db` -> **Metrics** bo‘limida RAM, CPU va faol ulanishlar sonini (Connections count) kuzatib borishingiz mumkin.
