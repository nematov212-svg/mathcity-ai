# MathCity AI — Backend Architecture & Reliability Audit

**Date:** 2026-11-16  
**Auditor:** Senior Backend Architect & Database Reliability Engineer  
**Framework:** Node.js / Express / TypeScript / Prisma ORM / PostgreSQL

---

## 1. Architectural Structure

The backend follows a domain-driven, modular micro-modular architecture:

```text
backend/
├── src/
│   ├── app.ts                 # Express application definition, middleware & routing
│   ├── server.ts              # Server lifecycle & graceful shutdown
│   ├── config/
│   │   ├── env.ts             # Runtime environment configuration & Zod validation
│   │   └── security.ts        # Helmet, CORS & Security headers configuration
│   ├── middleware/
│   │   ├── auth.ts            # JWT verification & Dynamic age checking
│   │   ├── rateLimit.ts       # Route-specific sliding window rate limiters
│   │   ├── validation.ts      # Request body & query Zod validators
│   │   └── errorHandler.ts    # Centralized production error sanitization
│   ├── modules/
│   │   ├── auth/              # Registration, Login, Google Sign-In, Token verification
│   │   ├── eligibility/       # Age verification (Ages 6-16)
│   │   ├── courses/           # Curriculum hierarchy (Grades 1-11)
│   │   ├── lessons/           # Chapter & lesson sections query
│   │   ├── practice/          # Authoritative question evaluation & +1 coin reward
│   │   ├── games/             # Space Math arithmetic generator
│   │   ├── coins/             # Authoritative coin wallet & balance
│   │   ├── xp/                # Level & XP calculation
│   │   ├── city/              # 3D building store (100 coins) & island coordinates
│   │   ├── ai_teacher/        # Ziyo AI Ustoz (Gemini API + pedagogical rule engine)
│   │   ├── subscriptions/     # 30-day trial status & MathCity Pro store verification
│   │   ├── analytics/         # Real-time student learning statistics
│   │   ├── daily_tasks/       # 4 daily math tasks tracking
│   │   ├── achievements/      # Achievement unlocks
│   │   └── students/          # Student profile & GDPR/Child privacy export
│   ├── utils/
│   │   ├── age.ts             # Exact date-of-birth age calculator
│   │   ├── dataStore.ts       # Full curriculum & building definitions
│   │   ├── mathEngine.ts      # LaTeX & fraction evaluation engine
│   │   └── repository.ts      # Authoritative database & ledger service
├── prisma/
│   ├── schema.prisma          # PostgreSQL models, enums & relational indexes
│   └── seed.ts               # Seed data for curriculum & courses
└── tests/
    ├── age.test.ts
    ├── mathEngine.test.ts
    ├── learningAndEconomy.test.ts
    └── securityAndIsolation.test.ts
```

---

## 2. Database Models & Schema Reliability

- **PostgreSQL Database:** Scalable relational schema mapped using Prisma ORM.
- **Relational Integrity:**
  - Cascading deletes (`onDelete: Cascade`) for user-owned records ensuring clean deletion upon student account removal.
  - Foreign key constraints between `User`, `StudentProfile`, `Subscription`, `CoinWallet`, `CoinTransaction`, `OwnedBuilding`, and `RewardedQuestion`.
- **Compound Unique Constraints:**
  - `RewardedQuestion`: `@@unique([userId, questionId])` preventing duplicate coin rewards.
  - `CoinTransaction`: `idempotencyKey String? @unique` protecting financial ledger consistency.
- **Performance Indexes:**
  - `@@index([userId])` on all student-partitioned tables.
  - `@@index([createdAt])` on transactions, attempts, and sessions for efficient timeline sorting.

---

## 3. High-Concurrency & Atomic Transactions

- **Coin Ledger:**
  - Balance updates use atomic ledger adjustments.
  - Negative coin balance is prevented at both the application repository level and database constraint level.
- **Building Purchases:**
  - A purchase transaction requires: `user.coinBalance >= building.costInCoins` (100 coins).
  - Coins are deducted and the building is atomically added to `placedBuildings`.
  - Replayed requests with the same building coordinates do not charge double.

---

## 4. Disaster Recovery & Health Probes

- **Liveness Probe:** `GET /health/live` returns HTTP 200 immediately if event loop is responsive.
- **Readiness Probe:** `GET /health/ready` verifies PostgreSQL database connectivity and memory availability.
- **Graceful Shutdown:** `SIGTERM` and `SIGINT` handlers close HTTP listeners, complete active transactions, and disconnect Prisma connections gracefully within a 10-second timeout.
