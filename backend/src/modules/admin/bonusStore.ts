export interface BonusRecord {
  id: string;
  userId: string;
  studentName: string;
  studentUsername: string;
  adminId: string;
  adminUsername: string;
  coinsGranted: number;
  xpGranted: number;
  proDaysGranted: number;
  reason: string;
  createdAt: string;
}

class BonusStore {
  private records: BonusRecord[] = [];

  recordBonus(entry: Omit<BonusRecord, 'id' | 'createdAt'>): BonusRecord {
    const record: BonusRecord = {
      ...entry,
      id: `bonus-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    this.records.unshift(record);
    return record;
  }

  getAllRecords(): BonusRecord[] {
    return [...this.records];
  }

  getRecordsByUserId(userId: string): BonusRecord[] {
    return this.records.filter((r) => r.userId === userId);
  }

  getTotalBonusesCount(): number {
    return this.records.length;
  }
}

export const bonusStore = new BonusStore();
