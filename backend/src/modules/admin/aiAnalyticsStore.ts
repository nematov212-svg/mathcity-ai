export interface AiQueryLog {
  id: string;
  userId: string;
  displayName: string;
  username: string;
  prompt: string;
  answer: string;
  latencySeconds: number;
  topic: string;
  status: 'SUCCESS' | 'ERROR';
  isSuspicious: boolean;
  suspiciousReason?: string;
  createdAt: string;
}

const SUSPICIOUS_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /system\s+prompt/i,
  /jailbreak/i,
  /bypass\s+rules/i,
  /drop\s+table/i,
  /select\s+.*from/i,
  /<script>/i,
  /you\s+are\s+now\s+in\s+developer\s+mode/i,
  /dan\s+mode/i,
  /parolni\s+ber/i,
  /bazani\s+ko'rsat/i,
];

class AiAnalyticsStore {
  private logs: AiQueryLog[] = [];

  detectSuspicious(prompt: string): { isSuspicious: boolean; reason?: string } {
    for (const pattern of SUSPICIOUS_PATTERNS) {
      if (pattern.test(prompt)) {
        return {
          isSuspicious: true,
          reason: `Shubhali matn yoki prompt injection belgisi aniqlandi: ${pattern.toString()}`,
        };
      }
    }
    return { isSuspicious: false };
  }

  logQuery(entry: {
    userId: string;
    displayName: string;
    username: string;
    prompt: string;
    answer: string;
    latencySeconds: number;
    topic?: string;
    status?: 'SUCCESS' | 'ERROR';
  }): AiQueryLog {
    const { isSuspicious, reason } = this.detectSuspicious(entry.prompt);

    const log: AiQueryLog = {
      id: `ai-log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      userId: entry.userId,
      displayName: entry.displayName,
      username: entry.username || '—',
      prompt: entry.prompt,
      answer: entry.answer,
      latencySeconds: Math.max(0.1, Number(entry.latencySeconds.toFixed(2))),
      topic: entry.topic || 'Umumiy matematika',
      status: entry.status || 'SUCCESS',
      isSuspicious,
      suspiciousReason: reason,
      createdAt: new Date().toISOString(),
    };

    this.logs.unshift(log);
    // Keep last 1000 logs in memory
    if (this.logs.length > 1000) {
      this.logs.pop();
    }
    return log;
  }

  getAllLogs(options?: {
    search?: string;
    onlySuspicious?: boolean;
    topic?: string;
    limit?: number;
  }): AiQueryLog[] {
    let result = this.logs;
    if (options?.onlySuspicious) {
      result = result.filter((l) => l.isSuspicious);
    }
    if (options?.topic) {
      result = result.filter((l) => l.topic.toLowerCase() === options.topic!.toLowerCase());
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      result = result.filter(
        (l) =>
          l.prompt.toLowerCase().includes(q) ||
          l.answer.toLowerCase().includes(q) ||
          l.displayName.toLowerCase().includes(q) ||
          l.username.toLowerCase().includes(q)
      );
    }
    if (options?.limit) {
      result = result.slice(0, options.limit);
    }
    return result;
  }

  getAnalyticsSummary() {
    const total = this.logs.length;
    const now = new Date();
    const todayStr = new Date(now.getTime() + 5 * 3600000).toISOString().split('T')[0];

    const todayLogs = this.logs.filter((l) => l.createdAt.startsWith(todayStr));
    const errors = this.logs.filter((l) => l.status === 'ERROR');
    const suspicious = this.logs.filter((l) => l.isSuspicious);

    const totalLatency = this.logs.reduce((sum, l) => sum + l.latencySeconds, 0);
    const avgLatency = total > 0 ? Number((totalLatency / total).toFixed(2)) : 0;

    // Top asking students
    const studentCounts = new Map<string, { count: number; name: string; username: string }>();
    for (const l of this.logs) {
      const existing = studentCounts.get(l.userId);
      if (existing) {
        existing.count++;
      } else {
        studentCounts.set(l.userId, {
          count: 1,
          name: l.displayName,
          username: l.username,
        });
      }
    }
    const topStudents = Array.from(studentCounts.entries())
      .map(([userId, val]) => ({ userId, ...val }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top topics
    const topicCounts = new Map<string, number>();
    for (const l of this.logs) {
      topicCounts.set(l.topic, (topicCounts.get(l.topic) || 0) + 1);
    }
    const topTopics = Array.from(topicCounts.entries())
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalQueries: total,
      todayQueries: todayLogs.length,
      avgLatencySeconds: avgLatency,
      errorCount: errors.length,
      suspiciousCount: suspicious.length,
      topStudents,
      topTopics,
    };
  }
}

export const aiAnalyticsStore = new AiAnalyticsStore();
