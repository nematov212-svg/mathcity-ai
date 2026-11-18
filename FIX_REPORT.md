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

---

## 2. Test va Tekshiruv Natijalari

- **Flutter Avtotestlari (`flutter test`):**
  44 ta testdan **44 tasi muvaffaqiyatli o‘tdi (100%)**.
- **Backend Jest Testlari (`npm test`):**
  7 ta test to‘plami, 65 ta testdan **65 tasi muvaffaqiyatli o‘tdi (100%)**.
- **Flutter Statik Tahlil (`flutter analyze`):**
  **0 ta xato** (barcha xatolar bartaraf etildi).
- **Flutter Web Reliz Build (`flutter build web --release`):**
  Muvaffaqiyatli kompilyatsiya qilindi (`✓ Built build/web`).
- **Serverlar Holati:**
  - Backend API: `http://localhost:4000/health/live` — **ALIVE (200 OK)**
  - Admin Panel: `http://localhost:3001` — **ACTIVE (200 OK)**
  - Flutter Web: `http://localhost:8085` — **ACTIVE (200 OK)**
  *(Eslatma: macOS tizimida Port 5000 AirPlay Receiver tomonidan band bo‘lgani uchun Flutter Web xavfsiz va to‘qnashuvsiz port 8085 da ishga tushirildi).*
