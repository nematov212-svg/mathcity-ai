# MathCity AI — Maʼlumotlar Bazasi va Doimiy Saqlash Qo‘llanmasi (PostgreSQL Guide)

Ushbu qo‘llanma **MathCity AI** platformasining barcha foydalanuvchi hisoblari, matematika darslari, tanga (Coin) balansi, XP darajalari, 3D shahar binolari, AI suhbatlari va obunalari qayerda, qanday saqlanishi hamda ularni qanday boshqarishni to‘liq tushuntirib beradi.

---

## 1. Asosiy Mezon: Doimiy Bulut Xotirasi (Cloud Source of Truth)

Platformaning barcha muhim maʼlumotlari endi brauzerning vaqtinchalik xotirasida (`localStorage`), kompyuterdagi SQLite faylida yoki Render veb-serverining o‘chib ketuvchi vaqtinchalik diskida **emas**, balki **Render Managed PostgreSQL** xizmatida markazlashtirilgan holda doimiy saqlanadi.

```text
               MATHCITY AI
                     |
       Flutter Web / Android / iOS
                     |
                 HTTPS API
                     |
                     v
           RENDER BACKEND (Node.js)
                     |
       +-------------+-------------+
       |             |             |
       v             v             v
  POSTGRESQL     AI PROVIDER   OBJECT STORAGE
  DATABASE       (Gemini API)  (Photos/Audio)
       ^
       |
  ADMIN PANEL
  (Xavfsiz API orqali)
```

> [!IMPORTANT]
> Flutter ilovasi hech qachon bevosita PostgreSQL bazasiga ulanmaydi. Barcha so‘rovlar token orqali tekshiriladigan Backend API (`https://mathcity-ai-api.onrender.com/api`) orqali o‘tadi.

---

## 2. Render Dashboard orqali Baza Boshqaruvi

1. **Render.com** paneliga kiring: [dashboard.render.com](https://dashboard.render.com).
2. **Databases** bo‘limiga o‘ting va `mathcity-ai-db` bazasini tanlang.
3. Quyidagi parametrlarni ko‘rasiz:
   - **Internal Database URL**: Faqat Render ichidagi backend servisi ulanishi uchun (masalan: `postgresql://mathcity_admin:***@dpg-xxxxx-a/mathcity_ai`).
   - **External Database URL**: Tashqi boshqaruv dasturlari (DBeaver, TablePlus, pgAdmin) orqali ulanish uchun.
   - **Status**: `Available` (Faol).
   - **Region**: `Frankfurt (EU Central)` — O‘zbekiston uchun eng past kechikish (ping).

---

## 3. PostgreSQL Jadvallari va Ularning Vazifalari

Platforma quyidagi relyatsion jadvallar arxitekturasiga ega:

| Jadval nomi | Vazifasi va Saqlanadigan Maʼlumotlar |
| :--- | :--- |
| `users` | Foydalanuvchining login/emaili, shifrlangan paroli (`bcrypt`), Google ID, Apple ID va roli. |
| `student_profiles` | O‘quvchining ismi (`displayName`), tug‘ilgan sanasi, yoshi, sinfi (Grade 1–11), avatar va shahar darajasi. |
| `auth_sessions` | Faol JWT sessiyalari va ularning amal qilish muddati. |
| `courses` | Matematika kurslari (5-sinf, 6-sinf, 7-sinf). |
| `lessons` | 15 ta matematika darsi, tushuntirish matnlari (`contentMd`), LaTeX formulalari, XP va tanga mukofotlari. |
| `sections` | Dars bo‘limlari (1-qism, 2-qism, xulosalar). |
| `questions` | Interaktiv mashqlar, variantlar (`optionsJson`), to‘g‘ri javob va xatoliklar tushuntirishi (`explanation`). |
| `exercise_attempts` | O‘quvchi topshirgan barcha javoblar, urinishlar va har bir savol uchun 1-marta berilgan 1 ta tanga rekordi. |
| `rewarded_questions` | Tangani qayta-qayta olishni oldini oluvchi unikal `[userId, questionId]` indekslari. |
| `lesson_progress` | Yakunlangan darslar, to‘plangan ballar va yakunlangan vaqti. |
| `coin_wallets` | Har bir o‘quvchining joriy oltin tanga balansi (`balance`). |
| `coin_transactions` | Tanga kirim-chiqim tarixi (dars mukofoti, mashq mukofoti, bino sotib olish xarajati). |
| `student_xp` | Jami to‘plangan tajriba ballari (`totalXP`) va darajasi (`level`). |
| `xp_transactions` | XP ballari qo‘shilish tarixi. |
| `building_definitions` | 3D shahar binolari katalogi (Maktab, Uy, Kutubxona, Planetariy, narxi, kerakli darajasi). |
| `owned_buildings` | O‘quvchi shaharchasida qurilgan binolar, ularning koordinatalari (`gridX, gridY`) va qurilgan vaqti. |
| `daily_tasks` | Kunlik vazifalar katalogi (5 ta misol yechish, darsni tugatish, AI bilan maslahatlashish). |
| `student_daily_tasks`| O‘quvchining kunlik vazifalari bo‘yicha ko‘rsatkichlari va mukofot olinganligi holati. |
| `achievements` | Yutuqlar va medallar ro‘yxati. |
| `student_achievements`| O‘quvchi ochgan yutuqlar. |
| `ai_conversations` | AI Ustoz bilan ochilgan suhbat mavzulari. |
| `ai_messages` | AI Ustoz va o‘quvchi o‘rtasidagi xabarlar tarixi, LaTeX formulalari va qadam-baqadam yechimlar. |
| `ai_usage` | Kunlik AI kvotasi va sarflangan savollar soni. |
| `subscriptions` | Obuna holati (`FREE_TRIAL_ACTIVE`, `PRO_ACTIVE`), boshlangan va tugash vaqti. |
| `purchase_events` | Click / Payme / In-App orqali tasdiqlangan to‘lovlar va tranzaksiya ID lari. |
| `media_attachments` | O‘quvchi yuklagan masalalar rasmlari yoki ovozli xabarlari metamaʼlumotlari. |
| `admin_audit_logs` | Administratorlarning dars qo‘shish, o‘chirish yoki foydalanuvchini bloklash amallari jurnali. |

---

## 4. Xavfsiz Tekshirish SQL So‘rovlari (Example Queries)

Maʼlumotlar to‘g‘ri saqlanayotganini tekshirish uchun DBeaver, TablePlus yoki Render Shell orqali xavfsiz so‘rovlarni bajarishingiz mumkin:

### A. O‘quvchilar va ularning tanga balansini ko‘rish
```sql
SELECT 
    u.id, 
    p.display_name, 
    u.email, 
    p.grade, 
    p.age, 
    w.balance AS coin_balance, 
    x.total_xp, 
    x.level
FROM users u
JOIN student_profiles p ON u.id = p.user_id
LEFT JOIN coin_wallets w ON u.id = w.user_id
LEFT JOIN student_xp x ON u.id = x.user_id
ORDER BY x.total_xp DESC;
```

### B. O‘quvchi qurgan binolarni tekshirish
```sql
SELECT 
    p.display_name, 
    b.name AS bino_nomi, 
    o.grid_x, 
    o.grid_y, 
    o.constructed_at
FROM owned_buildings o
JOIN users u ON o.user_id = u.id
JOIN student_profiles p ON u.id = p.user_id
JOIN building_definitions b ON o.building_key = b.key;
```

### C. Darslarni yakunlash holatini tekshirish
```sql
SELECT 
    p.display_name, 
    l.title AS dars_nomi, 
    lp.is_completed, 
    lp.score, 
    lp.updated_at
FROM lesson_progress lp
JOIN users u ON lp.user_id = u.id
JOIN student_profiles p ON u.id = p.user_id
JOIN lessons l ON lp.lesson_id = l.id;
```

### D. AI Ustoz bilan yozishmalar tarixini ko‘rish
```sql
SELECT 
    p.display_name, 
    m.role, 
    m.text, 
    m.created_at
FROM ai_messages m
JOIN users u ON m.user_id = u.id
JOIN student_profiles p ON u.id = p.user_id
ORDER BY m.created_at DESC
LIMIT 50;
```

---

## 5. Zaxiralash va Qayta Tiklash (Backups & Disaster Recovery)

### A. Render avtomatik zaxiralari
- Render pullik rejalarida (`Standard` / `Pro`) har 24 soatda avtomatik zaxira nusxasi yaratiladi va 7 kun davomida saqlanadi.
- Render Dashboard -> **mathcity-ai-db** -> **Backups** bo‘limida bir tugma orqali tiklash mumkin.

### B. Qo‘lda zaxira nusxa olish (`pg_dump`)
O‘z kompyuteringizga to‘liq zaxirani ko‘chirib olish:
```bash
pg_dump "POSTGRES_EXTERNAL_CONNECTION_STRING" \
  --format=c \
  --file=mathcity_backup_$(date +%Y%m%d).dump
```

### C. Bazasini qayta tiklash (`pg_restore`)
```bash
pg_restore --clean --no-owner --no-privileges \
  -d "POSTGRES_EXTERNAL_CONNECTION_STRING" \
  mathcity_backup_20261118.dump
```

---

## 6. Ulanish Salomatligini Tekshirish (Health Check)

Backend server doimo bazaga ulanishni nazorat qiladi:
- **`GET https://mathcity-ai-api.onrender.com/health`** -> Server ishlayotganini ko‘rsatadi (`{ "status": "healthy", "uptime": 1240.5 }`).
- **`GET https://mathcity-ai-api.onrender.com/ready`** -> PostgreSQL bazasi ulanganligini tasdiqlaydi (`{ "status": "ready", "database": "connected" }`).
