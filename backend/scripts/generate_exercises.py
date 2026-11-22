import json, random
from fractions import Fraction
random.seed(2026)
items, seen = [], set()

def fr(f):
    return f"{f.numerator}" if f.denominator == 1 else f"{f.numerator}/{f.denominator}"

def int_options(ans, lo=0):
    c = set()
    for d in [1, -1, 2, -2, 10, -10, 3, -3, 5, -5, 20, 100]:
        v = ans + d
        if v != ans and v >= lo: c.add(v)
    s = str(ans)
    if len(s) > 1:
        sw = int(s[::-1])
        if sw != ans and sw >= lo: c.add(sw)
    c = list(c); random.shuffle(c)
    return [str(x) for x in c[:3]]

def add(level, topic, q, hint, ans, wrong, expl):
    if q in seen: return False
    wrong = [w for w in dict.fromkeys(wrong) if w != ans][:3]
    if len(wrong) < 3: return False
    seen.add(q)
    opts = wrong + [ans]; random.shuffle(opts)
    items.append({"id": len(items) + 1, "level": level, "topic": topic, "question": q,
                  "hint": hint, "options": opts, "correctIndex": opts.index(ans),
                  "answer": ans, "explanation": expl})
    return True

def gen(n, fn):
    cnt = tries = 0
    while cnt < n and tries < 20000:
        tries += 1
        if fn(): cnt += 1
    return cnt

# LEVEL 1 (6-8 yosh): 1..20 doirasi
def add1():
    a, b = random.randint(1, 12), random.randint(1, 9); r = a + b
    return add(1, "qo'shish", f"{a} + {b} = ?", f"{a} ga {b} sonini qo'shing.", str(r), int_options(r),
               f"{a} + {b} = {r}. {a} dan boshlab {b} marta sanaymiz.")
def sub1():
    a = random.randint(5, 20); b = random.randint(1, a); r = a - b
    return add(1, "ayirish", f"{a} - {b} = ?", f"{a} dan {b} sonini ayiring.", str(r), int_options(r),
               f"{a} - {b} = {r}.")
def word1():
    a, b = random.randint(2, 9), random.randint(1, 8)
    things = ["olma", "qalam", "konfet", "kitob", "sharcha"]; t = random.choice(things)
    if random.random() < .5:
        r = a + b
        return add(1, "masala", f"Alisherda {a} ta {t} bor edi. Unga yana {b} ta berishdi. Hammasi nechta bo'ldi?",
                   "Qo'shish kerak.", str(r), int_options(r, 1), f"{a} + {b} = {r} ta.")
    a += b; r = a - b
    return add(1, "masala", f"Malikada {a} ta {t} bor edi. U {b} tasini do'stiga berdi. Nechta qoldi?",
               "Ayirish kerak.", str(r), int_options(r), f"{a} - {b} = {r} ta.")

# LEVEL 2 (9-12 yosh)
def add2():
    a, b = random.randint(20, 899), random.randint(20, 99); r = a + b
    return add(2, "qo'shish", f"{a} + {b} = ?", "Xonalab qo'shing.", str(r), int_options(r),
               f"{a} + {b} = {r}.")
def sub2():
    a = random.randint(100, 999); b = random.randint(11, a - 1); r = a - b
    return add(2, "ayirish", f"{a} - {b} = ?", "Xonalab ayiring.", str(r), int_options(r),
               f"{a} - {b} = {r}.")
def mul2():
    a, b = random.randint(2, 12), random.randint(2, 12)
    if random.random() < .4: a = random.randint(13, 40)
    r = a * b
    return add(2, "ko'paytirish", f"{a} × {b} = ?", f"{a} ni {b} marta qo'shing.", str(r), int_options(r),
               f"{a} × {b} = {r}.")
def div2():
    b = random.randint(2, 12); r = random.randint(2, 15 if random.random() < .6 else 30); a = b * r
    return add(2, "bo'lish", f"{a} ÷ {b} = ?", f"{b} ga qanday son ko'paytirilsa {a} chiqadi?", str(r), int_options(r, 1),
               f"{b} × {r} = {a}, demak {a} ÷ {b} = {r}.")
def frac2():
    d = random.randint(3, 12); a = random.randint(1, d - 2); b = random.randint(1, d - a - 1 if d - a - 1 >= 1 else 1)
    if random.random() < .5:
        r = Fraction(a + b, d)
        w = [fr(Fraction(a + b, 2 * d)), f"{a*b}/{d}", f"{a+b}/{d+1}", f"{abs(a-b)+1}/{d}", f"{a+b+1}/{d}"]
        return add(2, "kasrlar", f"{a}/{d} + {b}/{d} = ?", "Maxrajlar bir xil: suratlarni qo'shing.", fr(r), w,
                   f"Maxraj o'zgarmaydi: ({a}+{b})/{d} = {a+b}/{d}" + (f" = {fr(r)}." if fr(r) != f"{a+b}/{d}" else "."))
    if a == b: return False
    x, y = max(a, b), min(a, b); r = Fraction(x - y, d)
    w = [fr(Fraction(x + y, d)), f"{x-y}/{2*d}", f"{x-y+1}/{d}", f"{x-y}/{d+1}", f"{x-y+2}/{d}"]
    return add(2, "kasrlar", f"{x}/{d} - {y}/{d} = ?", "Maxrajlar bir xil: suratlarni ayiring.", fr(r), w,
               f"({x}-{y})/{d} = {x-y}/{d}" + (f" = {fr(r)}." if fr(r) != f"{x-y}/{d}" else "."))
def word2():
    k = random.choice(["ko'paytirish", "bo'lish", "perimetr", "yuza"])
    if k == "ko'paytirish":
        a, b = random.randint(3, 12), random.randint(3, 15); r = a * b
        return add(2, "masala", f"Bir qutida {b} ta qalam bor. {a} ta qutida nechta qalam bor?", "Ko'paytiring.",
                   str(r), int_options(r, 1), f"{a} × {b} = {r} ta.")
    if k == "bo'lish":
        n, r = random.randint(3, 9), random.randint(3, 12); a = n * r
        return add(2, "masala", f"{a} ta konfet {n} ta bolaga teng bo'linsa, har biriga nechtadan tegadi?", "Bo'ling.",
                   str(r), int_options(r, 1), f"{a} ÷ {n} = {r} ta.")
    a, b = random.randint(3, 20), random.randint(3, 20)
    if a == b: return False
    if k == "perimetr":
        r = 2 * (a + b)
        return add(2, "geometriya", f"To'g'ri to'rtburchakning tomonlari {a} sm va {b} sm. Perimetri necha sm?",
                   "P = 2 × (a + b)", str(r), int_options(r, 1), f"P = 2 × ({a} + {b}) = {r} sm.")
    r = a * b
    return add(2, "geometriya", f"To'g'ri to'rtburchakning tomonlari {a} sm va {b} sm. Yuzi necha sm²?",
               "S = a × b", str(r), int_options(r, 1), f"S = {a} × {b} = {r} sm².")

# LEVEL 3 (13-16 yosh)
def pct3():
    p = random.choice([5, 10, 15, 20, 25, 30, 40, 50, 60, 75]); n = random.choice(range(20, 500, 20)); r = n * p // 100
    if n * p % 100: return False
    return add(3, "foizlar", f"{n} ning {p}% i nechaga teng?", f"{n} × {p} ÷ 100", str(r), int_options(r, 1),
               f"{n} × {p} / 100 = {r}.")
def eq3():
    k = random.choice(["a", "b", "c"]); x = random.randint(2, 20)
    if k == "a":
        a = random.randint(2, 30); b = x + a
        return add(3, "tenglama", f"x + {a} = {b}. x = ?", f"x = {b} - {a}", str(x), int_options(x, 1), f"x = {b} - {a} = {x}.")
    if k == "b":
        a = random.randint(2, 12); b = a * x
        return add(3, "tenglama", f"{a}x = {b}. x = ?", f"x = {b} ÷ {a}", str(x), int_options(x, 1), f"x = {b} ÷ {a} = {x}.")
    a, b = random.randint(2, 9), random.randint(1, 20); c = a * x + b
    return add(3, "tenglama", f"{a}x + {b} = {c}. x = ?", f"Avval {b} ni ayiring, keyin {a} ga bo'ling.",
               str(x), int_options(x, 1), f"{a}x = {c} - {b} = {c-b}, x = {c-b} ÷ {a} = {x}.")
def pow3():
    k = random.choice(["sq", "rt", "p2"])
    if k == "sq":
        n = random.randint(2, 25); r = n * n
        return add(3, "daraja", f"{n}² = ?", f"{n} × {n}", str(r), int_options(r, 1), f"{n}² = {n} × {n} = {r}.")
    if k == "rt":
        n = random.randint(2, 25); r = n * n
        return add(3, "ildiz", f"√{r} = ?", "Qaysi son kvadratga ko'tarilsa shu son chiqadi?", str(n), int_options(n, 1), f"{n}² = {r}, demak √{r} = {n}.")
    e = random.randint(3, 10); r = 2 ** e
    return add(3, "daraja", f"2^{e} = ?", "2 ni o'ziga ko'paytiring.", str(r), int_options(r, 1), f"2^{e} = {r}.")
def frac3():
    b1, b2 = random.sample([2, 3, 4, 5, 6, 8, 10], 2); a1, a2 = random.randint(1, b1 - 1 if b1 > 1 else 1), random.randint(1, b2 - 1 if b2 > 1 else 1)
    r = Fraction(a1, b1) + Fraction(a2, b2)
    w = [fr(Fraction(a1 + a2, b1 + b2)), fr(r + Fraction(1, b1 * b2)), fr(r - Fraction(1, b1 * b2)), fr(Fraction(a1 * a2, b1 * b2)), fr(r + 1)]
    return add(3, "kasrlar", f"{a1}/{b1} + {a2}/{b2} = ?", "Umumiy maxrajga keltiring.", fr(r), w,
               f"Umumiy maxraj orqali: {a1}/{b1} + {a2}/{b2} = {fr(r)}.")
def word3():
    k = random.choice(["disc", "speed"])
    if k == "disc":
        p = random.choice([10, 20, 25, 30, 50]); n = random.choice(range(40, 400, 20))
        if n * p % 100: return False
        r = n - n * p // 100
        return add(3, "masala", f"Narxi {n} 000 so'm bo'lgan kitobga {p}% chegirma qilindi. Yangi narxi necha ming so'm?",
                   "Avval chegirmani toping.", str(r), int_options(r, 1), f"Chegirma = {n*p//100}, yangi narx = {n} - {n*p//100} = {r} ming so'm.")
    v, t = random.randint(30, 90), random.randint(2, 6); r = v * t
    return add(3, "masala", f"Mashina soatiga {v} km tezlik bilan {t} soat yurdi. Qancha yo'l bosdi?", "S = v × t",
               str(r), int_options(r, 1), f"S = {v} × {t} = {r} km.")

plan = [(add1, 90), (sub1, 90), (word1, 60), (add2, 70), (sub2, 70), (mul2, 120), (div2, 90),
        (frac2, 80), (word2, 70), (pct3, 80), (eq3, 90), (pow3, 45), (frac3, 30), (word3, 30), (add2, 0)]
for fn, n in plan: gen(n, fn)
random.shuffle(items)
for i, it in enumerate(items, 1): it["id"] = i
json.dump(items, open("/mnt/user-data/outputs/exercises_1000.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(items))
