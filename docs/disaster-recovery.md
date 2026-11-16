# MathCity AI — Disaster Recovery & Backup Plan

**Date:** 2026-11-16  
**Target:** PostgreSQL Database, User Ledgers, City State, and Configuration  
**RPO (Recovery Point Objective):** $\le 1$ hour  
**RTO (Recovery Time Objective):** $\le 15$ minutes

---

## 1. Automated Backup Strategy

### Daily Full Backup & Hourly WAL Archiving
- Daily full logical dump using `pg_dump` with gzip compression.
- Backups are encrypted with AES-256 before uploading to isolated S3-compatible cold storage.
- Continuous WAL (Write-Ahead Logging) archiving enables Point-in-Time Recovery (PITR).

### Backup Script Example (`scripts/backup_db.sh`)
```bash
#!/bin/bash
set -euo pipefail

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/var/backups/mathcity_db"
BACKUP_FILE="${BACKUP_DIR}/mathcity_${TIMESTAMP}.sql.gz"

mkdir -p "${BACKUP_DIR}"

# Execute PostgreSQL binary dump
pg_dump "${DATABASE_URL}" | gzip -9 > "${BACKUP_FILE}"

# Encrypt backup
gpg --batch --yes --encrypt --recipient ops@mathcity.ai "${BACKUP_FILE}"

echo "Backup created successfully: ${BACKUP_FILE}.gpg"
```

---

## 2. Restoration Procedures

### Restoring from Full Backup
1. **Prepare clean database instance:**
   ```bash
   dropdb -h localhost -U postgres mathcity_db || true
   createdb -h localhost -U postgres mathcity_db
   ```
2. **Decrypt and restore data:**
   ```bash
   gpg --decrypt mathcity_YYYYMMDD_HHMMSS.sql.gz.gpg | gunzip | psql "${DATABASE_URL}"
   ```
3. **Verify data integrity:**
   - Verify total user accounts: `SELECT COUNT(*) FROM users;`
   - Verify coin ledger balance: `SELECT SUM(balance) FROM coin_wallets;`
   - Verify total placed buildings: `SELECT COUNT(*) FROM owned_buildings;`
   - Verify schema migrations: `npx prisma migrate status`

---

## 3. Rollback Plan for Failed Migrations

If a production Prisma migration fails:
1. Prevent new traffic by setting application to maintenance mode (`HTTP 503`).
2. Restore database to the pre-migration snapshot taken immediately before deployment.
3. Mark migration as rolled back:
   ```bash
   npx prisma migrate resolve --rolled-back <migration_name>
   ```
4. Re-verify health probes: `GET /health/ready`
5. Re-enable traffic and alert engineering team.
