#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import os
import math

def generate_math_knowledge():
    items = []
    current_id = 1

    # 1. Arifmetika (400 ta)
    # Qo'shish, ayirish, ko'paytirish, bo'lish, amallar tartibi, EKUB/EKUK, tub sonlar, daraja
    for i in range(1, 101):
        a = i * 7 + 12
        b = i * 3 + 8
        ans = a + b
        items.append({
            "id": current_id,
            "grade": 2 if i <= 50 else 3,
            "topic": "arifmetika",
            "question": f"{a} ga {b} ni qo‘shing",
            "answer": str(ans),
            "steps": [
                f"Birliklar va o‘nliklarni alohida qo‘shamiz.",
                f"{a} + {b} = {ans}"
            ]
        })
        current_id += 1

    for i in range(1, 101):
        a = i * 9 + 45
        b = i * 4 + 13
        ans = a - b
        items.append({
            "id": current_id,
            "grade": 3 if i <= 50 else 4,
            "topic": "arifmetika",
            "question": f"{a} dan {b} ni ayiring",
            "answer": str(ans),
            "steps": [
                f"Kattasidan kichigini ayirish qoidasi bo‘yicha hisoblaymiz.",
                f"{a} - {b} = {ans}"
            ]
        })
        current_id += 1

    for i in range(1, 101):
        a = (i % 25) + 3
        b = (i % 12) + 2
        ans = a * b
        items.append({
            "id": current_id,
            "grade": 3 if a <= 10 else 4,
            "topic": "arifmetika",
            "question": f"{a} ko‘paytirish {b} nechaga teng?",
            "answer": str(ans),
            "steps": [
                f"Ko‘paytirish jadvali va xossalaridan foydalanamiz.",
                f"{a} × {b} = {ans}"
            ]
        })
        current_id += 1

    for i in range(1, 101):
        b = (i % 15) + 2
        ans = (i % 20) + 4
        a = b * ans
        items.append({
            "id": current_id,
            "grade": 4,
            "topic": "arifmetika",
            "question": f"{a} ni {b} ga bo‘ling",
            "answer": str(ans),
            "steps": [
                f"Bo‘lish amali ko‘paytirishga teskari amaldir.",
                f"{a} ÷ {b} = {ans}"
            ]
        })
        current_id += 1

    # 2. Kasrlar (300 ta)
    # Oddiy kasrlar, o'nli kasrlar, kasrlarni qo'shish, ayirish, ko'paytirish, bo'lish
    for i in range(1, 101):
        den = (i % 8) + 3
        num1 = (i % (den - 1)) + 1
        num2 = ((i + 1) % (den - 1)) + 1
        sum_num = num1 + num2
        g = math.gcd(sum_num, den)
        ans = f"{sum_num // g}/{den // g}" if den // g != 1 else str(sum_num // g)
        items.append({
            "id": current_id,
            "grade": 5,
            "topic": "kasrlar",
            "question": f"{num1}/{den} + {num2}/{den} yig‘indisini hisoblang",
            "answer": ans,
            "steps": [
                f"Maxrajlari bir xil bo‘lgan kasrlarni qo‘shishda suratlari qo‘shiladi, maxraj o‘zgarmaydi: ({num1} + {num2}) / {den} = {sum_num}/{den}.",
                f"Natijani qisqartiramiz: {ans}"
            ]
        })
        current_id += 1

    for i in range(1, 101):
        d1 = 2 if i % 3 == 0 else 4
        d2 = 3 if i % 3 == 0 else 5
        n1 = 1
        n2 = 1
        common_d = d1 * d2
        res_num = n1 * d2 + n2 * d1
        g = math.gcd(res_num, common_d)
        ans = f"{res_num // g}/{common_d // g}"
        items.append({
            "id": current_id,
            "grade": 5,
            "topic": "kasrlar",
            "question": f"{n1}/{d1} va {n2}/{d2} kasrlarini qo‘shing",
            "answer": ans,
            "steps": [
                f"Turli maxrajli kasrlar uchun umumiy maxraj topamiz: EKUK({d1}, {d2}) = {common_d}.",
                f"Suratlarni kengaytiramiz: ({n1 * d2} + {n2 * d1}) / {common_d} = {res_num}/{common_d} = {ans}"
            ]
        })
        current_id += 1

    for i in range(1, 101):
        d1 = (i % 6) + 2
        d2 = (i % 5) + 3
        n1 = 1
        n2 = 2
        p_num = n1 * n2
        p_den = d1 * d2
        g = math.gcd(p_num, p_den)
        ans = f"{p_num // g}/{p_den // g}"
        items.append({
            "id": current_id,
            "grade": 6,
            "topic": "kasrlar",
            "question": f"{n1}/{d1} × {n2}/{d2} ko‘paytmasini toping",
            "answer": ans,
            "steps": [
                f"Kasrlarni ko‘paytirishda surat suratga, maxraj maxrajga ko‘paytiriladi.",
                f"({n1} × {n2}) / ({d1} × {d2}) = {p_num}/{p_den} = {ans}"
            ]
        })
        current_id += 1

    # 3. Foizlar (250 ta)
    for i in range(1, 126):
        pct = (i % 9 + 1) * 10 # 10, 20, 30... 90%
        val = (i % 20 + 1) * 50 # 50, 100, 150...
        ans = (val * pct) // 100
        items.append({
            "id": current_id,
            "grade": 5 if pct in [10, 50] else 6,
            "topic": "foizlar",
            "question": f"{val} ning {pct} foizini toping",
            "answer": str(ans),
            "steps": [
                f"{pct}% ni kasr ko‘rinishida ifodalaymiz: {pct}/100.",
                f"{val} × {pct}/100 = {ans}"
            ]
        })
        current_id += 1

    for i in range(1, 126):
        pct = 25 if i % 2 == 0 else 50
        ans_num = (i % 30 + 2) * 4
        given_val = (ans_num * pct) // 100
        items.append({
            "id": current_id,
            "grade": 6,
            "topic": "foizlar",
            "question": f"{pct} foizi {given_val} ga teng bo‘lgan sonni toping",
            "answer": str(ans_num),
            "steps": [
                f"Sonni topish uchun berilgan qiymatni foizga bo‘lib, 100 ga ko‘paytiramiz.",
                f"{given_val} ÷ {pct} × 100 = {ans_num}"
            ]
        })
        current_id += 1

    # 4. Tenglamalar (300 ta)
    # Chiziqli, qavsli, kvadrat
    for i in range(1, 151):
        a = (i % 8) + 2
        x = (i % 15) + 1
        b = (i % 25) + 3
        c = a * x + b
        items.append({
            "id": current_id,
            "grade": 6 if a <= 3 else 7,
            "topic": "tenglamalar",
            "question": f"{a}x + {b} = {c} tenglamani yeching",
            "answer": f"x = {x}",
            "steps": [
                f"Ozod had {b} ni o‘ng tomonga qarama-qarshi ishora bilan o‘tkazamiz: {a}x = {c} - {b} = {c - b}.",
                f"Ikkala tomonni {a} ga bo‘lamiz: x = {c - b} / {a} = {x}."
            ]
        })
        current_id += 1

    for i in range(1, 101):
        a = (i % 5) + 2
        x = (i % 12) + 2
        b = (i % 10) + 1
        c = a * (x + b)
        items.append({
            "id": current_id,
            "grade": 7,
            "topic": "tenglamalar",
            "question": f"{a}(x + {b}) = {c} tenglamasini yeching",
            "answer": f"x = {x}",
            "steps": [
                f"Tenglamaning ikkala tomonini {a} ga bo‘lamiz: x + {b} = {c // a}.",
                f"{b} ni o‘ng tomonga ayirib o‘tkazamiz: x = {c // a} - {b} = {x}."
            ]
        })
        current_id += 1

    for i in range(1, 51):
        x1 = (i % 7) + 1
        x2 = (i % 5) + 2
        p = -(x1 + x2)
        q = x1 * x2
        sign_p = f"+ {p}" if p > 0 else f"- {abs(p)}"
        items.append({
            "id": current_id,
            "grade": 8,
            "topic": "tenglamalar",
            "question": f"x² {sign_p}x + {q} = 0 kvadrat tenglamani yeching",
            "answer": f"x₁ = {x1}, x₂ = {x2}" if x1 != x2 else f"x = {x1}",
            "steps": [
                f"Viyet teoremasiga ko‘ra: x₁ + x₂ = {-p} va x₁ × x₂ = {q}.",
                f"Ildizlarni topamiz: x₁ = {x1}, x₂ = {x2}."
            ]
        })
        current_id += 1

    # 5. Geometriya (300 ta)
    # Perimetr, yuza, Pifagor, hajm
    for i in range(1, 101):
        a = (i % 20) + 4
        b = (i % 15) + 3
        p = 2 * (a + b)
        s = a * b
        items.append({
            "id": current_id,
            "grade": 5,
            "topic": "geometriya",
            "question": f"To‘g‘ri to‘rtburchakning tomonlari {a} sm va {b} sm. Uning perimetri va yuzini toping",
            "answer": f"P = {p} sm, S = {s} sm²",
            "steps": [
                f"Perimetr formulasi: P = 2 × (a + b) = 2 × ({a} + {b}) = {p} sm.",
                f"Yuza formulasi: S = a × b = {a} × {b} = {s} sm²."
            ]
        })
        current_id += 1

    for i in range(1, 101):
        a = (i % 25) + 2
        p = 4 * a
        s = a * a
        items.append({
            "id": current_id,
            "grade": 5,
            "topic": "geometriya",
            "question": f"Kvadratning tomoni {a} sm ga teng. Yuzini hisoblang",
            "answer": f"S = {s} sm²",
            "steps": [
                f"Kvadrat yuzi formulasi: S = a².",
                f"S = {a}² = {s} sm²."
            ]
        })
        current_id += 1

    # Pifagor uchliklari
    pith_triplets = [(3, 4, 5), (6, 8, 10), (5, 12, 13), (9, 12, 15), (8, 15, 17), (7, 24, 25), (10, 24, 26)]
    for i in range(1, 101):
        trip = pith_triplets[i % len(pith_triplets)]
        mult = (i // len(pith_triplets)) % 3 + 1
        a, b, c = trip[0] * mult, trip[1] * mult, trip[2] * mult
        items.append({
            "id": current_id,
            "grade": 8,
            "topic": "geometriya",
            "question": f"To‘g‘ri burchakli uchburchakning katetlari {a} sm va {b} sm. Gipotenuzasini toping",
            "answer": f"c = {c} sm",
            "steps": [
                f"Pifagor teoremasi: c² = a² + b².",
                f"c² = {a}² + {b}² = {a*a} + {b*b} = {c*c}.",
                f"c = √{c*c} = {c} sm."
            ]
        })
        current_id += 1

    # 6. Algebra (200 ta)
    # Qisqa ko'paytirish, darajalar, ildizlar
    for i in range(1, 101):
        a = (i % 9) + 2
        items.append({
            "id": current_id,
            "grade": 7,
            "topic": "algebra",
            "question": f"(x + {a})² ifodani qisqa ko‘paytirish formulasi bo‘yicha yoying",
            "answer": f"x² + {2*a}x + {a*a}",
            "steps": [
                f"(a + b)² = a² + 2ab + b² formulani qo‘llaymiz.",
                f"(x + {a})² = x² + 2 × x × {a} + {a}² = x² + {2*a}x + {a*a}."
            ]
        })
        current_id += 1

    for i in range(1, 101):
        a = (i % 8) + 2
        items.append({
            "id": current_id,
            "grade": 7,
            "topic": "algebra",
            "question": f"(x - {a})(x + {a}) ko‘paytmasini hisoblang",
            "answer": f"x² - {a*a}",
            "steps": [
                f"Kvadratlar ayirmasi formulasi: (a - b)(a + b) = a² - b².",
                f"(x - {a})(x + {a}) = x² - {a}² = x² - {a*a}."
            ]
        })
        current_id += 1

    # 7. So'zli masalalar (250 ta)
    # Harakat, yosh, birgalikda ishlash, narx
    for i in range(1, 126):
        v = (i % 6 + 4) * 10 # 40, 50, 60... 90 km/soat
        t = (i % 5) + 2      # 2, 3, 4, 5, 6 soat
        s = v * t
        items.append({
            "id": current_id,
            "grade": 4 if v <= 60 else 5,
            "topic": "so'zli masalalar",
            "question": f"Avtomobil {v} km/soat tezlik bilan {t} soat yurdi. U jami qancha masofani bosib o‘tgan?",
            "answer": f"{s} km",
            "steps": [
                f"Masofa formulasi: S = v × t (bu yerda v — tezlik, t — vaqt).",
                f"S = {v} × {t} = {s} km."
            ]
        })
        current_id += 1

    for i in range(1, 126):
        narx = (i % 10 + 2) * 500 # 1000, 1500, 2000...
        dona = (i % 8) + 3
        jami = narx * dona
        items.append({
            "id": current_id,
            "grade": 3,
            "topic": "so'zli masalalar",
            "question": f"Bitta daftar {narx} so‘m turadi. {dona} ta daftar sotib olish uchun necha so‘m kerak?",
            "answer": f"{jami} so‘m",
            "steps": [
                f"Jami narxni topish uchun bitta mahsulot narxini miqdoriga ko‘paytiramiz.",
                f"{narx} × {dona} = {jami} so‘m."
            ]
        })
        current_id += 1

    print(f"Jami yaratilgan savollar soni: {len(items)}")
    return items

if __name__ == '__main__':
    knowledge = generate_math_knowledge()
    
    paths = [
        "/Users/mirzobek/Desktop/MathCity Ai/frontend/assets/data/math_knowledge.json",
        "/Users/mirzobek/Desktop/MathCity Ai/backend/src/data/math_knowledge.json",
        "/Users/mirzobek/Desktop/mathcity-backend/src/data/math_knowledge.json",
    ]
    
    for p in paths:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, "w", encoding="utf-8") as f:
            json.dump(knowledge, f, ensure_ascii=False, indent=2)
        print(f"Saqlandi: {p} ({len(knowledge)} ta)")
