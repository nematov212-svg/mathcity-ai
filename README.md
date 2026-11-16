# MathCity AI — Full-Stack Educational Mathematics Platform

<p align="center">
  <img src="frontend/assets/logos/mathcity_logo.png" alt="MathCity AI Logo" width="180" />
</p>

MathCity AI is an enterprise-grade, cross-platform educational mathematics application built with **Flutter & Dart** on the frontend, and **Node.js, TypeScript, Express, and PostgreSQL (Prisma ORM)** on the backend.

The platform is designed specifically for students aged **6–16** in Uzbekistan (`O'zbek tili`), featuring an interactive 3D city-building gamification economy, real-time AI pedagogical guidance (**Ziyo AI**), and dual adaptive visual modes (**Kids Mode** & **Teen Mode**).

---

## 🌟 Architecture & Key Features

1. **Dual Visual Design Systems**:
   - **Kids Mode (Ages 6–12)**: Friendly 3D aesthetic, vibrant brand purple (`#7154EC`), soft rounded cards (radius 24), Nunito typography, and cheerful celebratory animations.
   - **Teen Mode (Ages 13–16)**: High-tech dark theme (`#101526`), lime-green neon accent (`#C7FA74`), dark surfaces (`#151C2D`), Inter typography, high school mathematics workspace.
2. **Strict Age Eligibility & Minor Privacy (COPPA / GDPR-K / ASVS 5.0)**:
   - Server-side date of birth validation on every authenticated request.
   - Ages 6–12: Auto-assigned to Kids Mode.
   - Ages 13–16: Auto-assigned to Teen Mode.
   - Age 17+: Access strictly forbidden (`403 Forbidden`). Zero parent dashboard or adult surveillance.
3. **Mening Shahrim (3D Isometric City Builder)**:
   - Persistent 4x4 interactive plot grid stored with per-student tenant isolation.
   - Purchase and upgrade 7 distinct buildings (*Shinam uy*, *Maktab*, *Kutubxona*, *Bog'*, *Stadion*, *Muzey*, *Rasadxona*) using earned gold coins.
4. **Anti-Farming Golden Coin Economy**:
   - Earn exactly 1 gold coin per unique correct exercise answer.
   - Backend idempotency & anti-farming guard: repeat solves award exactly 0 extra coins, completely preventing replay or bot farming.
5. **Ziyo AI Ustoz (Pedagogical Math Tutor)**:
   - Step-by-step pedagogical AI guidance in Uzbek powered by Google Gemini API.
   - Prompt sanitization, input length restrictions ($\le 500$ chars), sliding-window rate limiting (25 req/hour), and LaTeX formula rendering.
6. **Billing & Subscriptions (MathCity Pro)**:
   - 30-day free trial for eligible new students.
   - 29,000 UZS/month intended subscription pricing.
   - Server-side purchase token replay protection across student accounts.

---

## 🔒 Cybersecurity & Hardening (OWASP ASVS 5.0 / API Top 10)

| Security Domain | Implementation Details |
| :--- | :--- |
| **Password Security** | Bcrypt hashing with 12 salt rounds; constant-time hash comparison; 8+ chars policy. |
| **Headers & CSP** | Helmet with Content-Security-Policy, HSTS, noSniff, frameguard (anti-clickjacking). |
| **CORS Policy** | Strict origin whitelisting (`ALLOWED_ORIGINS`); rejects unauthorized origins. |
| **Rate Limiting** | Multi-tier sliding window: Auth (10 req/min), AI (25 req/hr), Practice (60 req/min), General (300 req/min). |
| **Student Isolation** | Tenant-level query scoping (`WHERE studentId = req.student.id`); zero cross-tenant IDOR access. |
| **Anti-Replay Billing**| Global purchase token uniqueness table preventing multi-account receipt reuse. |
| **Error Sanitization** | Production error handler stripping internal stack traces, database metadata, and diagnostics. |
| **Reliability Probes** | Independent `/health/live` (liveness) and `/health/ready` (database readiness) endpoints. |

---

## 📁 Repository Structure

```text
MathCity Ai/
│
├── .github/                   # GitHub Actions CI/CD workflows & Dependabot
│   ├── workflows/
│   │   ├── backend-ci.yml     # Node.js tests, Prisma validate, TypeScript build
│   │   ├── flutter-ci.yml     # Flutter analyze, widget tests, web compilation
│   │   ├── security-scan.yml  # Gitleaks secret detection & dependency audit
│   │   └── deploy.yml         # Container build & smoke health verification
│   └── dependabot.yml         # Automated dependency vulnerability updates
│
├── frontend/                  # Flutter & Dart cross-platform client
│   ├── assets/                # Official brand logos, launcher icons, illustrations
│   ├── lib/
│   │   ├── app/               # App entrypoint, GoRouter
│   │   ├── core/              # Theme (Kids/Teen), network (Dio), responsive
│   │   ├── features/          # 20+ feature screens (Home, Lessons, City, Games, AI, Tariflar)
│   │   └── shared/            # Riverpod providers, data models
│   └── test/                  # Automated Flutter widget & unit tests (10 passing)
│
├── backend/                   # Node.js + TypeScript Express REST API
│   ├── src/
│   │   ├── config/            # Strict Zod env validation, security headers
│   │   ├── middleware/        # Sliding-window rate limiters, JWT auth, age guard, error sanitization
│   │   ├── modules/           # Auth, eligibility, lessons, games, city, AI, wallet, subscriptions
│   │   └── utils/             # MathEngine, age calculator, repository (Bcrypt 12 rounds)
│   ├── prisma/                # Prisma schema and seed script
│   ├── tests/                 # Jest test suites (OWASP security, economy, age gate, math engine)
│   └── Dockerfile             # Multi-stage production container build
│
├── docs/                      # Enterprise documentation
│   ├── security-audit.md      # Full OWASP vulnerability findings register & remediations
│   ├── backend-audit.md       # Architecture, database schema, concurrency boundaries
│   ├── disaster-recovery.md   # RPO/RTO specs, automated backup script, restore drills
│   ├── incident-response.md   # Incident response playbooks & communication matrices
│   ├── api-documentation.md   # Complete REST API specification
│   ├── architecture.md        # Full-stack system architecture & entity diagrams
│   └── implementation-progress.md # Checklist of implemented screens & security phases
│
├── docker-compose.yml         # PostgreSQL 16 + Backend container composition
├── .env.example               # Root environment template
└── README.md
```

---

## 🚀 Quick Start Instructions

### 1. Prerequisites
- [Flutter SDK](https://docs.flutter.dev/get-started/install) (3.3.0+)
- [Node.js](https://nodejs.org/) (v20+)
- [Docker & Docker Compose](https://www.docker.com/) (Optional, for PostgreSQL)

### 2. Backend Setup & Run

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Copy and configure environment
cp .env.example .env

# 3. Validate Prisma schema & generate client
npx prisma generate

# 4. Run automated test suites (24/24 tests pass)
npm test

# 5. Build and run server
npm run build
npm start
# Server listens on http://localhost:4000
```

### 3. Frontend Setup & Run

```bash
cd frontend

# 1. Install Flutter dependencies
flutter pub get

# 2. Run automated Flutter tests (10/10 tests pass)
flutter test

# 3. Launch application on Chrome Web
flutter run -d chrome --web-port=8085

# Or launch for macOS desktop / Mobile
flutter run -d macos
```

---

## 🧪 Automated Testing Verification

### Backend Jest Test Suites (24 Passed)
- `tests/securityAndIsolation.test.ts`: OWASP Auth, password complexity, student data isolation (IDOR), anti-farming coin security, subscription replay attack protection, rate limiting.
- `tests/learningAndEconomy.test.ts`: Lesson navigation, coin rewards, city building purchases.
- `tests/age.test.ts`: Exact date of birth calculation, Kids vs Teen routing, 17+ strict access rejection.
- `tests/mathEngine.test.ts`: Grades 1–11 formula and exercise validation.

### Frontend Flutter Test Suites (10 Passed)
- `test/widget_test.dart`: App smoke test, official branding, and accessibility verification.
- `test/age_flow_test.dart`: Kids & Teen personalized dashboard routing and feature availability.
- `test/full_feature_test.dart`: Exercise screen 10-question sequence, 3D isometric city with plot purchasing CTA, TariflarScreen pricing (29 000 UZS/oy) and 30-day trial, SettingsScreen subscription tile.

---

## 🛡️ Disaster Recovery & Backup

The production database is managed with an automated backup utility in `backend/scripts/backup.sh`.
- **RPO (Recovery Point Objective)**: $\le 1$ hour (hourly WAL archiving and automated snapshots).
- **RTO (Recovery Time Objective)**: $\le 15$ minutes via automated restore procedures.
- See full recovery drills in `docs/disaster-recovery.md` and incident response playbooks in `docs/incident-response.md`.
