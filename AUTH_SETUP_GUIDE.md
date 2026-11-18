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

- **Kirish Ekranı (LoginScreen):**
  - Foydalanuvchi logini yoki elektron pochta kiritiladi.
  - Parol kiritish maydoni (ko‘zcha belgisi bilan ko‘rsatish/yashirish).
  - "Parolni unutdingizmi?" havolasi.
  - Google va Apple tugmalari.

- **Ro‘yxatdan O‘tish (RegisterScreen):**
  - Ism (`displayName`) — AI Ustoz va bosh sahifada shaxsiylashtirilgan tarzda chiqadi.
  - Login yoki email.
  - Parol (kamida 8 ta belgi).
  - Parolni tasdiqlash (moslik tekshiruvi).
  - Boshlang‘ich hisob 0 tanga bilan ochiladi.

---

## 3. Google OAuth Sozlamalari

### Web Muhiti:
- `frontend/web/index.html` faylida Google Identity Services (GSI) skripti yuklanadi.
- GSI takroriy inisializatsiya xatosini oldini olish uchun `_isGsiInitialized` bittalik nazoratchisi o‘rnatilgan.

### iOS Muhiti (iPhone Simulator / Real Device):
- Bundle Identifier: `com.mathcityai.mathcityAi`
- `ios/Runner/Info.plist` faylida:
  - `GIDClientID`: Google Cloud Console'da iOS uchun yaratilgan Client ID.
  - `CFBundleURLTypes`: Klientskiy ID ning teskari tartibi (`com.googleusercontent.apps.CLIENT_ID`).
  - Web Client ID faqat `serverClientId` sifatida ishlatiladi.

---

## 4. Parolni Tiklash (Password Reset)

1. Foydalanuvchi o‘z emailini kiritadi.
2. Server bir martalik 15 daqiqalik xavfsiz tiklash tokenini yaratadi (`/api/auth/forgot-password`).
3. Foydalanuvchi yangi parolni token bilan birga kiritadi (`/api/auth/reset-password`).
4. Yangi parol `bcrypt` bilan qayta shifrlanadi.
