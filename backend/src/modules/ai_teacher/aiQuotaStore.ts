export interface AiRequestLog {
  id: string;
  userId: string;
  timestamp: number; // Unix ms
  type: 'TEXT' | 'IMAGE' | 'VOICE';
}

class AiQuotaStore {
  private requestLogs: AiRequestLog[] = [];
  public readonly FREE_DAILY_LIMIT = 5;
  public readonly ROLLING_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Check remaining quota for a user within the last 24 hours
   */
  public checkQuota(userId: string, isPro: boolean): {
    allowed: boolean;
    remaining: number;
    used: number;
    limit: number;
    resetAt?: string;
    isPro: boolean;
  } {
    if (isPro) {
      return {
        allowed: true,
        remaining: 999999, // Unlimited
        used: 0,
        limit: 999999,
        isPro: true,
      };
    }

    const now = Date.now();
    const windowStart = now - this.ROLLING_WINDOW_MS;

    // Filter requests for this user within rolling 24 hours
    const userRequests = this.requestLogs.filter(
      (log) => log.userId === userId && log.timestamp >= windowStart
    );

    const used = userRequests.length;
    const remaining = Math.max(0, this.FREE_DAILY_LIMIT - used);
    const allowed = used < this.FREE_DAILY_LIMIT;

    let resetAt: string | undefined;
    if (used > 0) {
      // Oldest request in the window + 24 hours is when quota starts freeing up
      const oldest = Math.min(...userRequests.map((l) => l.timestamp));
      resetAt = new Date(oldest + this.ROLLING_WINDOW_MS).toISOString();
    }

    return {
      allowed,
      remaining,
      used,
      limit: this.FREE_DAILY_LIMIT,
      resetAt,
      isPro: false,
    };
  }

  /**
   * Consumes one quota unit if allowed
   */
  public consumeQuota(userId: string, isPro: boolean, type: 'TEXT' | 'IMAGE' | 'VOICE' = 'TEXT'): boolean {
    const status = this.checkQuota(userId, isPro);
    if (!status.allowed) return false;

    this.requestLogs.push({
      id: `ai_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      timestamp: Date.now(),
      type,
    });

    // Prune logs older than 48 hours to conserve memory
    const purgeThreshold = Date.now() - 48 * 60 * 60 * 1000;
    this.requestLogs = this.requestLogs.filter((l) => l.timestamp >= purgeThreshold);

    return true;
  }

  /**
   * Returns total statistics for operator admin dashboard
   */
  public getStats(): {
    totalRequests24h: number;
    freeRequests24h: number;
    proRequests24h: number;
    textCount: number;
    imageCount: number;
    voiceCount: number;
  } {
    const windowStart = Date.now() - this.ROLLING_WINDOW_MS;
    const recent = this.requestLogs.filter((l) => l.timestamp >= windowStart);

    let textCount = 0;
    let imageCount = 0;
    let voiceCount = 0;

    for (const log of recent) {
      if (log.type === 'TEXT') textCount++;
      else if (log.type === 'IMAGE') imageCount++;
      else if (log.type === 'VOICE') voiceCount++;
    }

    return {
      totalRequests24h: recent.length,
      freeRequests24h: recent.length, // conservative active cohort
      proRequests24h: 0,
      textCount,
      imageCount,
      voiceCount,
    };
  }
}

export const aiQuotaStore = new AiQuotaStore();
