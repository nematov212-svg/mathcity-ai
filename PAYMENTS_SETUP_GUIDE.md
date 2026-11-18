# MathCity AI — To‘lov Tizimlari va Hisob-kitob Qo‘llanmasi (Payments Setup Guide)

## 1. To‘lov Modellari va Tariflar

- **MathCity Pro Ta'rifi:**
  - Oylik obuna narxi: **29 000 UZS** (server tomonidan tekshiriladi).
  - 30 kunlik sinov muddati (Trial).
  - Imkoniyatlar: Cheksiz AI Ustoz so‘rovlari, barcha dars va murakkab olimpiada masalalariga kirish.

---

## 2. Qo‘llab-quvvatlanuvchi To‘lov Usullari

1. **Uzcard / Humo / Click Business:**
   - Click Merchant orqali to‘lov havola yaratiladi.
   - O‘quvchi yoki ota-ona o‘z bank ilovasi (Click Up, Payme, yoki bank ilovasi) orqali to‘lovni tasdiqlaydi.

2. **Visa / Mastercard:**
   - Xalqaro sertifikatlangan shlyuz orqali amalga oshiriladi.
   - 3-D Secure xavfsizlik tekshiruvi.
   - **Xavfsizlik talabi:** MathCity AI serveri xom karta raqamlari yoki CVV kodlarini aslo saqlamaydi (PCI-DSS Muvofiqligi).

---

## 3. Eganing Hisob-kitob Kartasi (Owner Settlement Payouts)

- Barcha yig‘ilgan to‘lovlar va tushumlar avtomatik tarzda platforma egasining tasdiqlangan bank kartasiga yo‘naltiriladi:
  - **Maskalangan karta raqami:** `•••• •••• •••• 7821`
  - **Xizmat haqi (Acquiring fee):** Taxminan 2%.
  - **Audit va hisobot:** Barcha pul o‘tkazmalari administrator panelidagi *Moliya va Karta* bo‘limida qayd etiladi.

---

## 4. Webhook va To‘lovni Tasdiqlash

1. Foydalanuvchi to‘lovni yakunlagach, Click Business serveri `/api/payments/click/complete` webhook manziliga so‘rov yuboradi.
2. Server tranzaksiya imzosi va to‘langan summani (29 000 UZS) tekshiradi.
3. Tasdiqlangach, talaba hisobidagi `subscription.status` maydoni avtomatik tarzda `PRO_ACTIVE` holatiga o‘tkaziladi.
