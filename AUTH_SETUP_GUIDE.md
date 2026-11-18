# MathCity AI — Autentifikatsiyani Sozlash Qo‘llanmasi (Auth Setup Guide)

## 1. Ilova Oqimi (Authentication Flow)

Ilova ishga tushganda quyidagi mantiqiy ketma-ketlik amalga oshiriladi:

```text
ILOVA ISHGA TUSHISHI
        |
        v
SPLASH SCREEN (Brend logosi va animatsiya)
        |
        v
SEANSIYANI TEKSHIRISH (StorageService.getAuthToken)
        |
   +----+----+
   |         |
Mavjud     Mavjud emas
   |         |
   v         v
BOSH SAHIFA  KIRISH EKRANI (LoginScreen)
                |
                +-- "Ro‘yxatdan o‘tish" --> Ro‘yxatdan o‘tish (RegisterScreen)
                |
                +-- "Parolni unutdingizmi?" --> Parolni tiklash (ForgotPasswordScreen)
                |
                +-- "Continue with Google" --> Google OAuth
                |
                +-- "Apple orqali davom etish" --> Apple Sign-In
```

---

## 2. Kirish va Ro‘yxatdan O‘tish Ekranlari

- **Kirish Ekrani (LoginScreen):**
  - Foydalanuvchi logini yoki elektron pochta kiritiladi.
  - Parol kiritish maydoni (ko‘zcha belgisi bilan ko‘rsatish/yashirish).
  - Takroriy bosishdan himoyalangan (`if (_isLoading) return;`).
  - "Parolni unutdingizmi?" havolasi.
  - Google va Apple tugmalari (takroriy bosish bloklangan).

- **Ro‘yxatdan O‘tish (RegisterScreen):**
  - Ism (`displayName`) — AI Ustoz va bosh sahifada shaxsiylashtirilgan tarzda chiqadi.
  - Login yoki email.
  - Parol (kamida 8 ta belgi).
  - Parolni tasdiqlash (moslik tekshiruvi).
  - Boshlang‘ich hisob 0 tanga bilan ochiladi.

---

## 3. Google OAuth Sozlamalari (Google Identity Services)

### Web Muhiti:
- `frontend/web/index.html` faylida faqat `flutter_bootstrap.js` chaqiriladi.
- Takroriy `<meta name="google-signin-client_id">` olib tashlangan, initsializatsiya `AuthService` orqali markaziy nazorat qilinadi.
- Dev Origin: `http://localhost:8085` (yoki `--web-port=8085 --web-hostname=localhost`).

> [!IMPORTANT]
> ### REQUIRES MANUAL ACTION (Google Cloud Console'da Sozlash Qadamlari):
> Google orqali kirishda `unregistered_origin` yoki `403` xatosi chiqmasligi uchun quyidagi qadamlarni bajaring:
> 1. [Google Cloud Console](https://console.cloud.google.com/) ga kiring.
> 2. **APIs & Services > Credentials** bo‘limini oching.
> 3. MathCity AI loyihasiga tegishli **OAuth 2.0 Client IDs > Web Client** ni tanlang (Client ID: `608766203356-d6oq3gvc5n199671ho1npgr240afkjup.apps.googleusercontent.com`).
> 4. **Authorized JavaScript origins** maydoniga quyidagilarni qo‘shing:
>    - `http://localhost:8085`
>    - `http://localhost:5000`
>    - `http://localhost`
>    - `https://your-production-domain.com` (agar production mavjud bo‘lsa)
> 5. **Authorized redirect URIs** bo‘limiga ham qo‘shing:
>    - `http://localhost:8085`
>    - `http://localhost:5000`
> 6. **Save** tugmasini bosing (o‘zgarishlar 5 daqiqa ichida kuchga kiradi).

### iOS Muhiti (iPhone Simulator / Real Device):
- Bundle Identifier: `com.mathcityai.mathcityAi`
- `ios/Runner/Info.plist` faylida:
  - `GIDClientID`: Google Cloud Console'da iOS uchun yaratilgan Client ID.
  - `CFBundleURLTypes`: Klientskiy ID ning teskari tartibi (`com.googleusercontent.apps.CLIENT_ID`).
  - Web Client ID faqat `serverClientId` sifatida backend tokenini olish uchun ishlatiladi.

---

## 4. Parolni Tiklash (Password Reset)

1. Foydalanuvchi o‘z emailini kiritadi.
2. Server bir martalik 15 daqiqalik xavfsiz tiklash tokenini yaratadi (`/api/auth/forgot-password`).
3. Foydalanuvchi yangi parolni token bilan birga kiritadi (`/api/auth/reset-password`).
4. Yangi parol `bcrypt` bilan qayta shifrlanadi.
