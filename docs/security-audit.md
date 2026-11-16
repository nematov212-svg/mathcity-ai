# MathCity AI — Comprehensive Security Audit Report

**Date:** 2026-11-16  
**Auditor:** Senior DevSecOps & Security Specialist  
**Target:** MathCity AI Backend (Node.js/TypeScript/PostgreSQL) & Frontend (Flutter)  
**Standard:** OWASP ASVS 5.0 (Application Security Verification Standard) & OWASP API Security Top 10 (2023)

---

## 1. Executive Summary

A comprehensive, defense-in-depth security audit was conducted on the MathCity AI educational platform. MathCity AI serves minor students aged 6–16 across Uzbekistan and globally. As a child-directed mathematics platform, data isolation, strict age gating, economy integrity, anti-farming controls, and subscription entitlement protection are non-negotiable requirements.

### Audit Statistics
- **Total Components Audited:** 15 modules (Auth, Eligibility, Lessons, Practice, Coins, XP, City, AI, Subscriptions, Analytics, Profile, Daily Tasks, Achievements, Storage, Routing)
- **Vulnerabilities Identified:** 8
- **Critical Severity:** 2
- **High Severity:** 3
- **Medium Severity:** 2
- **Low Severity:** 1
- **Remediation Status:** 100% remediated & verified with automated tests.

---

## 2. Vulnerability Findings & Remediation Register

| ID | Vulnerability | Severity | Affected Module | Root Cause | Proposed & Implemented Fix | Verification |
|---|---|---|---|---|---|---|
| **VULN-01** | Plaintext Password Storage in Memory & DB | **CRITICAL** | `auth.routes.ts` | Password was assigned directly to `passwordHash` field | Implemented `bcryptjs` hashing with 12 salt rounds before persisting. Secure comparison with constant-time check. | PASS (Unit & Auth test) |
| **VULN-02** | Unverified Google ID Token (Identity Spoofing) | **CRITICAL** | `auth.routes.ts` | `/api/auth/google` trusted client-provided `email` and `googleId` without token claims validation | Added server-side Google ID token cryptographic signature, issuer, audience (`GOOGLE_CLIENT_ID`), and expiry verification. | PASS (Google Auth test) |
| **VULN-03** | Lack of Rate Limiting on Authentication & AI Endpoints | **HIGH** | `app.ts`, `ai.routes.ts` | Endpoints were vulnerable to credential stuffing, brute force, and Denial-of-Wallet API exhaustion | Created sliding-window rate limiters: Auth (5 req/min), AI (20 req/hour per student), Answer Submission (60 req/min). | PASS (Rate Limit test) |
| **VULN-04** | Missing Daily AI Quotas & Prompt Injection Safeguards | **HIGH** | `ai.routes.ts` | Students could issue unrestricted large queries; no prompt sanitization | Added input length limits (500 chars), prompt injection sanitization, and server-tracked daily usage limits. | PASS (AI Security test) |
| **VULN-05** | Potential Purchase Token Reuse Across Accounts | **HIGH** | `subscriptions.routes.ts` | `purchaseToken` was not checked against a global redeemed tokens ledger | Added global `usedPurchaseTokens` unique tracking in ledger. Tokens cannot be replayed across different user IDs. | PASS (Subscription Replay test) |
| **VULN-06** | Wildcard CORS Header in Production | **MEDIUM** | `app.ts` | `cors({ origin: '*' })` was enabled for all requests | Replaced with strict CORS configuration using validated `ALLOWED_ORIGINS` from environment variables. | PASS (CORS test) |
| **VULN-07** | Information Leakage in Error Responses | **MEDIUM** | `app.ts` | Global error handler returned unformatted `err.message` in all environments | Sanitized error handler: returns localized, generic safe messages in production, hiding internal stack traces. | PASS (Error Handler test) |
| **VULN-08** | Missing Health Probes for Container Orchestration | **LOW** | `app.ts` | Only `/api/health` existed; missing Kubernetes/Docker standard `/health/live` and `/health/ready` | Implemented `/health/live` and `/health/ready` probes with dependency readiness checks. | PASS (Health Check test) |

---

## 3. Student Data Isolation Verification (Phase 6)

Every protected endpoint in MathCity AI derives the active user from the cryptographically verified JWT bearer token:
```typescript
const user = req.user!; // Verified by authMiddleware from Authorization: Bearer <token>
```
- No client-provided `studentId` or `userId` in query parameters, request bodies, or route paths is trusted as proof of ownership.
- Direct cross-user isolation test:
  - Student A (`student_a@mathcity.ai`) creates city buildings and earns 50 coins.
  - Student B (`student_b@mathcity.ai`) calls `/api/students/profile`, `/api/city`, `/api/coins/balance`.
  - Result: Student B strictly receives only Student B's data. Student B has zero access to Student A's records.

---

## 4. Coin & Economy Integrity (Phases 7 & 8)

1. **Server-Authoritative Answer Evaluation:** Client sends `{ questionId, answer }`. Client NEVER sends coin or XP amounts.
2. **Exactly 1 Coin Rule:**
   - Database model `RewardedQuestion` enforces `@@unique([userId, questionId])`.
   - First correct solve: `+1 gold coin` and `+10 XP`.
   - Subsequent attempts / retries / refreshes: `+0 coins` (idempotent 0 extra coins).
   - Race condition protection: Atomic upsert / transaction boundaries prevent duplicate coin awards on parallel requests.

---

## 5. Age Eligibility Verification (Phase 5)

MathCity AI enforces strict age eligibility dynamically on every authentication:
- $\text{Age} \le 5$: Unsupported.
- $6 \le \text{Age} \le 12$: Kids Mode (`KIDS`).
- $13 \le \text{Age} \le 16$: Teen Mode (`TEEN`).
- $\text{Age} = 16$: Allowed.
- $\text{Age} \ge 17$: Strictly Denied (`HTTP 403 Forbidden`, `ELIGIBILITY_FAILED`).

Age is calculated server-side based on `dateOfBirth` and `UTC` server time. Local client clock manipulation has zero effect.
