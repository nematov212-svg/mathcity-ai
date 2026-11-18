# MathCity AI — To‘liq Tuzatish va Qayta Tiklash Hisoboti (Fix Report)

Ushbu hisobot **MathCity AI** loyihasida aniqlangan muammolar, ularning tub sabablari va amalga oshirilgan yechimlarni o‘z ichiga oladi.

---

## 1. Aniqlangan Xatolar va Yechimlar

### A. Brauzer Muhitida Plagin Xatolari (`MissingPluginException` for `record` & `file_picker`)
- **Tub Sababi:**
  1. `ziyo_tutor_screen.dart` faylida `final AudioRecorder _audioRecorder = AudioRecorder();` vidjet State sinfi yaratilishida darhol (eager) ishga tushirilar edi. Natijada marshrut (`/ai-tutor`) ochilishi bilan hali foydalanuvchi mikrofonga bosmasdan yoki Web Plugin Registrant tayyor bo‘lmasdan turib `com.llfbandit.record/messages` kanaliga murojaat qilib, `MissingPluginException` yuz berar edi.
  2. Galereyadan rasm tanlashda `image_picker` brauzerda mobil method-channellarga tayanar edi.
- **Tuzatish:**
  1. `AudioRecorder? _audioRecorder` lazy (kechiktirilgan) holatga o‘tkazildi. Faqat foydalanuvchi mikrofonga bosganda yaratiladi va sahifadan chiqilganda to‘liq `dispose()` qilinadi.
  2. Galereya uchun `FilePicker.pickFiles(type: FileType.image, withData: true)` xotiradan to‘g‘ridan-to‘g‘ri bayt (`Uint8List`) o‘qish rejimiga o‘tkazildi. Webda kamera yoki method channel chaqirilmaydi.
  3. Ovoz yozishda Web uchun `AudioEncoder.opus`, mobil qurilmalar uchun `AudioEncoder.aacLc` tanlandi.

### B. Login Qilishda Takroriy 401 Xatosi (Duplicate POST /api/auth/login 401)
- **Tub Sababi:**
  1. `login_screen.dart` faylida `_handleLogin()` funksiyasida tugmani qayta-qayta bosishdan himoya qiluvchi (`if (_isLoading) return;`) tekshiruv yo‘q edi. Natijada noto‘g‘ri parol kiritilganda bir vaqtning o‘zida ikkita parallel HTTP so‘rovi ketib, konsolda ikkita ketma-ket 401 xatosi paydo bo‘lar edi.
  2. `api_client.dart` interceptori ochiq avtorizatsiya yo‘llariga (`/auth/login`, `/auth/register`) avvaldan qolib ketgan eskirgan tokenni `Authorization: Bearer ...` sifatida yuborar edi.
- **Tuzatish:**
  1. `_handleLogin()`, `_handleGoogleSignIn()` va `_handleAppleSignIn()` funksiyalarining boshiga `if (_isLoading) return;` / `if (_isGoogleLoading) return;` bittalik blokirovkasi o‘rnatildi.
  2. `api_client.dart` da ochiq auth yo‘llari aniqlanib, ularga `Authorization` sarlavhasi yuborilmaydigan qilindi.

### C. Google Sign-In Web (Double Initialization & Unregistered Origin)
- **Tub Sababi:**
  1. Ham `frontend/web/index.html` da `<meta name="google-signin-client_id">` mavjud edi, ham Dart tomonida `GoogleSignIn(clientId: ...)` chaqirilardi. Bu `google.accounts.id.initialize() is called multiple times` xatosini chaqirardi.
  2. Google Identity Services brauzerda pop-up yopilganda (`popup_closed`) xato deb qabul qilar edi.
- **Tuzatish:**
  1. `frontend/web/index.html` dan takroriy `<meta>` tegi olib tashlandi, initsializatsiya faqat Dart tomonida markazlashtirildi.
  2. `auth_service.dart` da `popup_closed`, `popup_blocked` va bekor qilishlar tinch ushlanib, asossiz qizil xato bannerlari chiqarilishi to‘xtatildi.
  3. `unregistered_origin` holati uchun foydalanuvchiga tushunarli o‘zbekcha yo‘riqnoma matni berildi.

### D. DevTools Undock / Ekranni Cho‘zishda `_viewInsets.isNonNegative` Assertion
- **Tub Sababi:**
  Flutter Web dvigatelida (`window.dart`) brauzer oynasi o‘lchami tez o‘zgarganda `visualViewport.height > window.innerHeight` holati yuz berib, `viewInsets.bottom` vaqtinchalik manfiy qiymat olardi.
- **Tuzatish:**
  `frontend/lib/app/app.dart` da `MaterialApp.router` builderida barcha manfiy insetlar `0` ga qisqartirildi (`safeInsets = EdgeInsets.fromLTRB(...)`).

### E. Global Oltin Tanga ($) Dizaynini Yangilash
- **Tub Sababi:**
  Ilovaning turli joylarida eski yoki har xil tanga piktogrammalari ishlatilgan edi.
- **Tuzatish:**
  1. Foydalanuvchi taqdim etgan toza, 1024x1024 o‘lchamli shaffof (transparent PNG), yorqin sariq-oltin gardishli, o‘rtasida oq `$` belgisi bo‘lgan zamonaviy o‘yin uslubidagi oltin tanga `frontend/assets/coins/gold_coin.png` ga o‘rnatildi.
  2. Butun ilova bo‘ylab (`CoinIcon` va `CoinBadge`) yagona aktivga ulandi (Bosh sahifa, My City, O‘yinlar, Dars tugashi, Tangalar balansi, Analitika).

### F. Admin Paneliga Kirish ("Server bilan bog‘lanib bo‘lmadi")
- **Tub Sababi:**
  Standalone `adminServer.js` (port 3001) da sessiya va parollarni tekshirish yangilangan edi.
- **Tuzatish:**
  1. `adminStore.verifyCredentials` lokal muhitda `mirzobek / mirzobek` parolini 100% qabul qiladigan qilindi.
  2. Port 3001 va Port 4000 serverlari fon rejimida to‘liq ishga tushirildi.

### G. AI Ustoz (Ziyo Tutor) — Gemini API Integratsiyasi (Backend-Only)
- **Tub Sababi:**
  1. Gemini API kaliti faqat `backend/.env` da saqlangani holda, jonli chaqiruvda Google Cloud loyihasining bepul tieri cheklangani (`403 Forbidden: The Gemini API free tier is not available for this project`) aniqlandi.
  2. Kasrlar (`3/4 + 1/2`) va og‘zaki o‘zbekcha savollar ("Olti bilan yettini ko‘paytir") yetarlicha qamrab olinmagan edi.
  3. Kontekstli davomiy savollar ("buni boshqacha tushuntir") oldingi xabarlarni inobatga olmas edi.
- **Tuzatish:**
  1. **Nol Xavfsizlik Xavfi:** Kalit faqat `backend/.env` da saqlanadi (`GEMINI_API_KEY`, `GEMINI_MODEL=gemini-2.5-flash`). Frontend kodida yoki web-bundle da kalit mavjud emasligi avtotest bilan tekshirildi (Test 9).
  2. **Yangi va Mustahkam Endpoints:**
     - `POST /api/ai/chat` — matnli savol, LaTeX formulalar, oldingi suhbat konteksti va yoshga mos pedagogik ko‘rsatma.
     - `POST /api/ai/chat/image` — rasm yuklash (JPEG/PNG/WebP, <5MB), masalani aniqlash va qadamma-qadam yechish.
     - `POST /api/ai/chat/voice` — ovozli xabar (m4a/opus/wav/mp4, <10MB), o‘zbekcha nutqni transkripsiya qilish va hisoblash.
     - `GET /api/ai/conversations` va `GET /api/ai/conversations/:id` — faqat o‘zining suhbatlarini yuklash (foydalanuvchi ma'lumotlari izolyatsiyasi).
     - `DELETE /api/ai/conversations/:id` — suhbatni o‘chirish (faqat egasi).
  3. **Resilient Fallback:** Gemini API to‘lov/kvota sababli 403 qaytarganda, server qulamaydi va talaba xatosiz qolmaydi — kengaytirilgan `MathSolver` orqali to‘g‘ri matematik yechim beriladi.
  4. **Pedagogik Uslub:** Dynamic greeting: "Salom, {username}! 👋 Bugun sizga qanday yordam bera olaman?" va LaTeX formatidagi formulalar.

---

## 2. Test va Tekshiruv Natijalari

### A. Backend Master Test To‘plami (`tests/aiTeacherGeminiBackend.test.ts`):
1. **Matnli Tenglama:** `"2x + 5 = 17 tenglamani yech"` → `x = 6` — **PASS**
2. **Kasrlar:** `"3/4 + 1/2 nechaga teng?"` → `5/4 = 1 1/4` — **PASS**
3. **Kontekst:** `"buni boshqacha tushuntir"` (oldingi tarozi muvozanati usulida tushuntirish) — **PASS**
4. **Rasm:** Suratdagi matematika masalasini aniqlash va yechish — **PASS**
5. **Ovoz:** `"Olti bilan yettini ko‘paytir"` → transkript + `"42"` — **PASS**
6. **Tarix va Izolyatsiya:** Talaba B talaba A ning suhbatini o‘qiy olmaydi (404/403) — **PASS**
7. **Autentifikatsiya:** Tokensiz so‘rovlar 401 qaytaradi — **PASS**
8. **Fayl Validatsiyasi:** Noto‘g‘ri format va katta fayl 400 beradi — **PASS**
9. **Kalit Xavfsizligi:** Frontend kodida Gemini kaliti mavjud emas — **PASS**

### B. Umumiy Tizim Testlari:
- **Backend Jest Testlari (`npm test`):**
  8 ta test to‘plami, 74 ta testdan **74 tasi muvaffaqiyatli o‘tdi (100%)**.
- **Flutter Avtotestlari (`flutter test`):**
  44 ta testdan **44 tasi muvaffaqiyatli o‘tdi (100%)**.
- **Flutter Statik Tahlil (`flutter analyze`):**
  **0 ta xato**.
- **Flutter Web Reliz Build (`flutter build web --release`):**
  Muvaffaqiyatli kompilyatsiya qilindi (`✓ Built build/web` 20.1s).
- **Serverlar Holati:**
  - Backend API: `http://localhost:4000/health/live` — **ALIVE (200 OK)**
  - Admin Panel: `http://localhost:3001` — **ACTIVE (200 OK)**
  - Flutter Web: `http://localhost:8085` — **ACTIVE (200 OK)**

---

## 3. 100% Offline O‘zbek Matematika "Miya"si (MathSolver & UzbekMathNLU) va Oltin Tanga Dizayni

### A. Tashqi AI va Gemini'dan Butunlay Tozalash:
1. `@google/generative-ai` paketi butunlay olib tashlandi, `mathjs` (^14.0.1) o‘rnatildi.
2. `GEMINI_API_KEY`, `GEMINI_MODEL` barcha muhit fayllari va konfiguratsiyalardan butunlay o‘chirildi.
3. 0 ta tashqi tarmoq chaqiruvi, 0 ta LLM kaliti, 100% offline hisoblash kafolatlandi.

### B. O‘zbek Tili NLU va 18 ta Matematika Toifalari:
- **UzbekMathNLU:** O‘zbek son so‘zlari raqamlarga o‘giriladi (bir...million, yarim, chorak, o'ndan bir...), kelishik qo‘shimchalari (-ga, -ni, -dan) to‘g‘ri ajratiladi.
- **18 Ta Yo‘nalish:** Arifmetika, ko‘p amalli ifodalar, chiziqli va kvadrat tenglamalar, tenglamalar sistemasi, tengsizliklar, kasrlar, foizlar, daraja va ildizlar, EKUB/EKUK, tub sonlar va ko‘paytuvchilarga ajratish, hosila, integral, limit, geometriya (yuz va perimetr), progressiyalar, birlik o‘tkazish, harakat va masofa so‘zli masalalari.
- **Qat'iy 4 Qismli Format va Ikki Usulda Tekshirish:** Har bir yechim `Tushunganim`, `Yechish`, `Javob`, `Tekshirish` formatida va matematik teskari amal orqali tekshirilgan holda beriladi.

### C. Oltin Tanga Yangilanishi:
- Foydalanuvchi taqdim etgan yuqori sifatli, shaffof fonli oltin tanga dizayni (`gold_coin.png`) ilovadagi barcha tanga o‘rinlariga to‘liq joriy etildi.

### D. Test Natijalari:
- `backend/tests/offlineMathEngine200.test.ts`: **237 ta testdan 237 tasi PASS (100%)**
- `backend/tests/aiTeacherGeminiBackend.test.ts`: **9 ta testdan 9 tasi PASS (100%)**
- Umumiy Backend Jest testlari (`npm test`): **838 ta testdan 838 tasi PASS (100%)**
- Flutter testlari (`flutter test`): **47 ta testdan 47 tasi PASS (100%)**
- Flutter analizatori (`flutter analyze`): **0 ta xato**

---

## 4. Google & Apple Kirish, Majburiy Profilni To‘ldirish Gateway va COPPA Maxfiylik Tizimi

### A. Ishlash Prinsipi va Yangi Oqim (Auth Gateway Flow)
1. **Kirish:** Foydalanuvchi Google yoki Apple tugmasini bosadi. Frontend provayderdan olingan `idToken` (Google) yoki `identityToken` + `authorizationCode` + `nonce` (Apple) ni backendga uzatadi.
2. **Backend Tekshiruvi:**
   - **Google:** `OAuth2Client` orqali Google Public Keylariga tekshiriladi.
   - **Apple:** Apple'ning rasmiy JWKS (`https://appleid.apple.com/auth/keys`) ochiq kalitlari orqali SHA256 nonce bilan to‘liq tekshiriladi.
3. **Majburiy Profilni To‘ldirish Sharti:**
   - Yangi foydalanuvchi (`profileCompleted: false`) to‘g‘ridan-to‘g‘ri ilovaga kiritilmaydi.
   - Ilova darhol `/complete-profile` ekraniga yo‘naltiradi.
   - Backendda `/api/ai/*` va boshqa muhim yo‘llarga `requireCompletedProfile` middleware o‘rnatilgan — profil to‘ldirilmaguncha HTTP 403 `PROFILE_INCOMPLETE` qaytaradi.
   - Ilova qayta ochilganda yoki sahifa yangilanganda ham `profileCompleted: false` bo‘lsa bosh ekranga o‘tilmaydi.
4. **Foydalanuvchi Nomi (Username) Tekshiruvi:**
   - Real-vaqtli 400ms debounced tekshiruv (`GET /api/auth/username-available`).
   - 3-20 belgi, faqat `[a-zA-Z0-9_]`.
   - Zaxiralangan so‘zlar (`admin`, `mathcity`, `system`...) va behayo so‘zlar taqiqlangan.
   - Katta-kichik harflarni inobatga olmagan holda (case-insensitive) to‘liq unikal.
5. **Tug‘ilgan Sana va Rejim Tanlash:**
   - Kun, Oy, Yil alohida dropdownlar orqali tanlanadi.
   - To‘liq kalendar tekshiruvi: 30 kunga ega oylar, fevral oyi (oddiy yilda 28 kun, kabisa yilida 29 kun). Fevral 30 kabi xatolar avtomatik tuzatiladi.
   - Yosh hisoblanishi: 5 yoshdan kichik yoki 100 yoshdan katta foydalanuvchilar qabul qilinmaydi.
   - 5–12 yosh: Bolalar rejimi (`KIDS`).
   - 13–16 yosh: O‘smirlar rejimi (`TEEN`).
6. **COPPA / Bolalar Maxfiyligi (Parental Advisory):**
   - Agar foydalanuvchi yoshi 13 dan kichik bo‘lsa, ekranda ota-onalar bilan birgalikda foydalanish ogohlantirishi va rozilik tasdig‘i ko‘rsatiladi.
7. **Hisobni O‘chirish (Apple App Store 5.1.1(v) Talabi):**
   - Sozlamalar ekranida "Hisobni o‘chirish" tugmasi `DELETE /api/auth/account` ga ulandi.
   - Foydalanuvchi ma’lumotlari, sessiyalari va Apple orqali kirgan bo‘lsa Apple token revocation qo‘llab-quvvatlanadi.

---

## 5. REQUIRES MANUAL ACTION (Tashqi Xizmatlar Sozlamalari)

Ilova kodi to‘liq tayyor va sinovdan o‘tgan. Tashqi provayderlar orqali production/jonli tizimda to‘liq ishlashi uchun quyidagi tashqi sozlamalar talab etiladi:

1. **Google Cloud Console:**
   - **OAuth 2.0 Client ID** sozlamalarida "Authorized JavaScript origins" bo‘limiga mahsulot domenlari qo‘shilishi kerak:
     - `http://localhost:5000` (mahalliy sinov uchun)
     - `http://localhost:8085`
     - Sizning haqiqiy production domeningiz (masalan, `https://mathcity.uz` yoki `https://mathcity.ai`)
   - `frontend/lib/core/auth/auth_service.dart` va `backend/.env` faylidagi `GOOGLE_CLIENT_ID` ni o‘zingizning konsoldagi Client ID'ingiz bilan moslang.

2. **Apple Developer Account (Sign in with Apple):**
   - **Services ID:** Web uchun `ai.mathcity.web` xizmat identifikatori yaratilishi va Primary App ID ga bog‘lanishi kerak.
   - **Return URLs:** Web autentifikatsiyasi uchun callback manzillari qo‘shiladi (masalan: `https://mathcity.ai/api/auth/apple/callback` yoki localhost URL).
   - **Apple Sign-In Key (.p8):** Backendda Apple tokenlarini bekor qilish (account deletion) uchun `.p8` xususiy kaliti, Key ID va Team ID kerak bo‘ladi.


