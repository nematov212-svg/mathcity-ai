# MathCity AI — Click Business To‘lov Tizimi Qo‘llanmasi (Payment Setup Guide)

Ushbu qo‘llanma **MathCity Pro** (oyiga 29 000 so‘m) obunasini Click Business to‘lov provayderi orqali qabul qilish, hisob-kitoblar va xavfsizlikni to‘liq sozlash bo‘yicha qo‘llanmadir.

---

## 1. Umumiy To‘lov Arxitekturasi

```text
[O‘quvchi / Ota-ona]
        |
        v
1. "MathCity Pro — 29 000 UZS/oy" tanlanadi
        |
        v
2. POST /api/payments/create-order
   (OrderId, Amount=29000, ReturnUrl shakllantiriladi)
        |
        v
3. Click Sandbox / Production Checkout havolasiga yo‘naltiriladi
        |
        v
4. Click serveridan Webhook so‘rovlari:
   a) Action 0 (PREPARE): Click backend so‘rovi tekshiradi (MD5 sign, order mavjudligi, summa)
   b) Action 1 (COMPLETE): To‘lov yechilgach, Pro status 30 kunga faollashtiriladi
        |
        v
5. Eganing tasdiqlangan kartasiga (4916 •••• •••• ****) mablag‘ o‘tkaziladi (Click 2% komissiyasi: 580 UZS, Sof tushum: 28 420 UZS)
```

---

## 2. Muhit O‘zgaruvchilari (Environment Variables)

`.env` yoki Render Dashboard'da quyidagi parametrlarni kiriting:

```env
# Click Business Merchant Sozlamalari
CLICK_SERVICE_ID="SIZNING_SERVICE_ID"
CLICK_MERCHANT_ID="SIZNING_MERCHANT_ID"
CLICK_SECRET_KEY="SIZNING_CLICK_SECRET_KEY"
CLICK_SANDBOX="false" # Test uchun "true", jonli uchun "false"
```

> [!CAUTION]
> Hech qachon `CLICK_SECRET_KEY` yoki to‘liq bank karta raqamini Git omboriga yuklamang. To‘liq karta raqamlari, CVV kodlari serverda saqlanmaydi va loglarga yozilmaydi (PCI-DSS talabi).

---

## 3. Webhook Endpoints & Imzo Tekshiruvi (MD5 Sign)

Click serveri backend'ingizning quyidagi yagona webhook endpointiga POST so‘rov yuboradi:
`POST /api/payments/click/webhook`

### Imzo hisoblash formulasi:
- **Prepare so‘rovi (action = 0):**
  `MD5(click_trans_id + service_id + secret_key + merchant_trans_id + amount + action + sign_time)`
- **Complete so‘rovi (action = 1):**
  `MD5(click_trans_id + service_id + secret_key + merchant_trans_id + merchant_prepare_id + amount + action + sign_time)`

Agar hisoblangan imzo kelgan `sign_string` bilan mos kelmasa, tizim `error: -1 (Sign check failed)` qaytaradi va to‘lov bekor qilinadi.

---

## 4. Click Xato Kodlari va Javoblari

| Xato Kodi | Izoh | Backend Javobi |
|---|---|---|
| `0` | Muvaffaqiyatli | `{ "error": 0, "error_note": "Success" }` |
| `-1` | Imzo xatosi (Sign check failed) | `{ "error": -1, "error_note": "Sign failed" }` |
| `-2` | Noto‘g‘ri summa (29 000 UZS emas) | `{ "error": -2, "error_note": "Incorrect amount" }` |
| `-4` | Tranzaksiya allaqachon bekor qilingan | `{ "error": -4, "error_note": "Already cancelled" }` |
| `-8` | Foydalanuvchi yoki buyurtma topilmadi | `{ "error": -8, "error_note": "Order not found" }` |
| `-9` | Tranzaksiya allaqachon muvaffaqiyatli bajarilgan (Idempotent) | `{ "error": 0, "error_note": "Already completed" }` |

---

## 5. Pul Mablag‘larini Chiqarish (Payout Destination)

- **Qabul qiluvchi karta:** `4916 •••• •••• ****` (Eganing rasmiy tasdiqlangan bank kartasi).
- **Komissiya:** Click 2% (29 000 dan 580 UZS).
- **Sof tushum (Net):** 28 420 UZS har bir to‘lovdan.
- **Hisobot:** Administrator panelining "Moliya va karta" bo‘limida barcha tranzaksiyalar real vaqt rejimida ko‘rinadi.

---

## 6. Jonli Ishga Tushirish Tekshiruv Ro‘yxati (Production Checklist)

1. [ ] Click Business (merchant.click.uz) kabinetiga kiring.
2. [ ] Shartnoma imzolanganligi va "Service ID" olinganligini tekshiring.
3. [ ] URL manzillarni kiriting:
   - Prepare / Complete URL: `https://<sizning-backend-domen>/api/payments/click/webhook`
4. [ ] `.env` faylida `CLICK_SERVICE_ID`, `CLICK_MERCHANT_ID`, `CLICK_SECRET_KEY` qiymatlarini yangilang.
5. [ ] 1 ta haqiqiy sinov to‘lovini (29 000 UZS) o‘tkazib, Pro status faollashganini tekshiring.

> [!NOTE]
> **NOT VERIFIED STATUS:** Haqiqiy Click savdo hisob ma'lumotlari (`CLICK_SERVICE_ID` va `CLICK_SECRET_KEY`) kiritilmaguncha, real pul yechish funksiyasi jonli rejimda sinovdan o‘tkazilmagan deb belgilanadi. Hozirda sinov muhiti (Sandbox & local mock flow) 100% integratsiya qilingan va tayyor.
