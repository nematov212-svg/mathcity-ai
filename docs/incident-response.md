# MathCity AI — Cybersecurity & Incident Response Playbook

**Version:** 1.0.0  
**Scope:** Production Services, Student Data, Financial Coin Ledgers, AI API Quotas  
**Severity Levels:** P1 (Critical), P2 (High), P3 (Medium), P4 (Low)

---

## 1. Incident Response Lifecycle

```text
[Detection & Alert] ──> [Containment] ──> [Eradication] ──> [Recovery] ──> [Post-Mortem]
```

---

## 2. Playbooks by Threat Scenario

### Scenario A: Credential / Secret Key Leakage
1. **Immediate Revocation:** Immediately rotate the compromised secret (JWT secret, Database password, Gemini API key, or Google OAuth secret) in secret manager.
2. **Session Invalidation:** Revoke all active user sessions by bumping token epoch or invalidating cached sessions in database.
3. **Audit Log Inspection:** Inspect access logs for anomalous requests utilizing the leaked credential within the compromise window.
4. **Redeploy Services:** Redeploy backend with fresh environment credentials.

### Scenario B: Coin / XP Manipulation Attempt
1. **Detection:** Anomaly alerts triggered by repeated submissions from single student IP/account within seconds.
2. **Containment:** Rate limiter automatically throttles excessive requests (`HTTP 429 Too Many Requests`).
3. **Ledger Reconciliation:** Run reconciliation query to verify `balance = initial_balance + sum(rewards) - sum(purchases)`.
4. **Account Quarantine:** If suspicious manipulation is verified, set `isActive = false` on user record and notify security team.

### Scenario C: Unauthorized Cross-User Access Attempt (IDOR)
1. **Containment:** Application architecture strictly enforces `req.user.id` from verified token; unauthorized cross-user parameter requests return `HTTP 403 Forbidden` or `HTTP 404 Not Found`.
2. **Logging:** Log attacker IP, attempted resource ID, and token identity.
3. **IP Throttling:** Ban offending IP address at WAF / ingress load balancer level.

### Scenario D: AI API Abuse / Denial of Wallet
1. **Containment:** Per-student sliding window rate limiter restricts requests to 20 per hour.
2. **Quota Enforcement:** Daily AI budget ceiling terminates further outbound calls to Google Gemini API once threshold is reached.
3. **Prompt Injection:** Input sanitization neutralizes jailbreak attempts and system prompt extraction attacks.
