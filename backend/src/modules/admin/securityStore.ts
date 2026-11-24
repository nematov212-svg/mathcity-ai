export interface SecurityEventLog {
  id: string;
  type: 'BRUTE_FORCE_ATTEMPT' | 'IP_BLOCKED' | 'SUSPICIOUS_PAYLOAD' | 'PASSWORD_FAIL' | 'UNAUTHORIZED_ACCESS' | 'PROMPT_INJECTION' | 'ALERT_SENT';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  ipAddress: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface BlockedIpEntry {
  ip: string;
  reason: string;
  blockedAt: string;
  expiresAt?: string; // If undefined, permanently blocked until manual removal
  isManual: boolean;
}

class SecurityStore {
  private failedAttemptsByIp = new Map<string, { count: number; firstAttempt: number }>();
  private blockedIps = new Map<string, BlockedIpEntry>();
  private securityLogs: SecurityEventLog[] = [];
  private lastAlertsSent = new Map<string, number>(); // type -> timestamp

  // 2FA settings for Admin
  public is2FAEnabled = false;
  public twoFactorSecret = 'JBSWY3DPEHPK3PXP'; // Base32 TOTP demo/setup secret
  public telegramChatId = process.env.ADMIN_TELEGRAM_CHAT_ID || '';
  public telegramBotToken = process.env.TELEGRAM_BOT_TOKEN || '';

  constructor() {
    // Seed some initial benign event
    this.logEvent({
      type: 'ALERT_SENT',
      severity: 'LOW',
      ipAddress: '127.0.0.1',
      description: 'Xavfsizlik monitori va Brute-Force himoyasi faollashtirildi.',
    });
  }

  isIpBlocked(ip: string): boolean {
    const cleanIp = (ip || '').replace('::ffff:', '').trim();
    const entry = this.blockedIps.get(cleanIp);
    if (!entry) return false;

    // Check expiration if temporary
    if (entry.expiresAt) {
      if (new Date(entry.expiresAt).getTime() < Date.now()) {
        this.blockedIps.delete(cleanIp);
        this.logEvent({
          type: 'IP_BLOCKED',
          severity: 'LOW',
          ipAddress: cleanIp,
          description: `IP manzilining 15 daqiqalik blok muddati tugadi va blokdan chiqarildi: ${cleanIp}`,
        });
        return false;
      }
    }
    return true;
  }

  recordFailedLogin(ip: string, username?: string): { isNowBlocked: boolean; remainingAttempts: number } {
    const cleanIp = (ip || '127.0.0.1').replace('::ffff:', '').trim();
    const now = Date.now();
    const record = this.failedAttemptsByIp.get(cleanIp) || { count: 0, firstAttempt: now };

    // Reset window after 15 minutes
    if (now - record.firstAttempt > 15 * 60 * 1000) {
      record.count = 1;
      record.firstAttempt = now;
    } else {
      record.count++;
    }
    this.failedAttemptsByIp.set(cleanIp, record);

    this.logEvent({
      type: 'PASSWORD_FAIL',
      severity: record.count >= 3 ? 'HIGH' : 'MEDIUM',
      ipAddress: cleanIp,
      description: `Noto‘g‘ri parol kiritildi (Urinish ${record.count}/5). Login: ${username || 'noma‘lum'}`,
      metadata: { username, attempt: record.count },
    });

    if (record.count >= 5) {
      // Auto-block IP for 15 minutes
      const expiresAt = new Date(now + 15 * 60 * 1000).toISOString();
      this.blockIp(cleanIp, '5 marta ketma-ket noto‘g‘ri login/parol kiritilgani sababli Brute-force himoyasi ishga tushdi.', expiresAt, false);
      this.sendSecurityAlert(
        'BRUTE_FORCE',
        `⚠️ DIQQAT! IP manzilidan 5 marta noto‘g‘ri login kiritildi va 15 daqiqaga bloklandi: ${cleanIp}`
      );
      return { isNowBlocked: true, remainingAttempts: 0 };
    }

    return { isNowBlocked: false, remainingAttempts: Math.max(0, 5 - record.count) };
  }

  resetFailedAttempts(ip: string) {
    const cleanIp = (ip || '').replace('::ffff:', '').trim();
    this.failedAttemptsByIp.delete(cleanIp);
  }

  blockIp(ip: string, reason: string, expiresAt?: string, isManual = true): BlockedIpEntry {
    const cleanIp = (ip || '').replace('::ffff:', '').trim();
    const entry: BlockedIpEntry = {
      ip: cleanIp,
      reason,
      blockedAt: new Date().toISOString(),
      expiresAt,
      isManual,
    };
    this.blockedIps.set(cleanIp, entry);

    this.logEvent({
      type: 'IP_BLOCKED',
      severity: 'CRITICAL',
      ipAddress: cleanIp,
      description: `IP bloklandi: ${cleanIp} — Sabab: ${reason}`,
      metadata: { expiresAt, isManual },
    });

    return entry;
  }

  unblockIp(ip: string): boolean {
    const cleanIp = (ip || '').replace('::ffff:', '').trim();
    const existed = this.blockedIps.delete(cleanIp);
    this.failedAttemptsByIp.delete(cleanIp);

    if (existed) {
      this.logEvent({
        type: 'IP_BLOCKED',
        severity: 'LOW',
        ipAddress: cleanIp,
        description: `IP muvaffaqiyatli blokdan chiqarildi: ${cleanIp}`,
      });
    }
    return existed;
  }

  getAllBlockedIps(): BlockedIpEntry[] {
    return Array.from(this.blockedIps.values());
  }

  logEvent(entry: Omit<SecurityEventLog, 'id' | 'createdAt'>): SecurityEventLog {
    const event: SecurityEventLog = {
      ...entry,
      id: `sec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.securityLogs.unshift(event);
    if (this.securityLogs.length > 500) {
      this.securityLogs.pop();
    }
    return event;
  }

  getAllSecurityLogs(limit = 100): SecurityEventLog[] {
    return this.securityLogs.slice(0, limit);
  }

  /**
   * Telegram or SMS alert integration (Strictly throttled to max 1 per 5 mins per type)
   */
  async sendSecurityAlert(type: string, message: string): Promise<boolean> {
    const now = Date.now();
    const last = this.lastAlertsSent.get(type) || 0;
    // 5 minutes cooldown
    if (now - last < 5 * 60 * 1000) {
      return false;
    }
    this.lastAlertsSent.set(type, now);

    this.logEvent({
      type: 'ALERT_SENT',
      severity: 'HIGH',
      ipAddress: 'SYSTEM',
      description: `Administratorga xavfsizlik bildirishnomasi yuborildi: ${message}`,
    });

    // If Telegram credentials configured
    if (this.telegramBotToken && this.telegramChatId) {
      try {
        await fetch(`https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: this.telegramChatId,
            text: `🔒 [MathCity Xavfsizlik Portali]\n${message}\nVaqt: ${new Date().toLocaleString('uz-UZ')}`,
          }),
        });
      } catch (_) {}
    }

    return true;
  }
}

export const securityStore = new SecurityStore();
