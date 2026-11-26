import { randomUUID } from 'crypto';

export type PaymentOrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELED' | 'REFUNDED';
export type PaymentMethod = 'UZCARD' | 'HUMO' | 'VISA' | 'MASTERCARD' | 'CLICK' | 'PAYME';
export type PaymentProvider = 'CLICK' | 'PAYME' | 'CLICK_BUSINESS' | 'CARD_ACQUIRER';
export type PlanType = 'MONTHLY' | 'YEARLY';

export interface PaymentOrder {
  id: string;
  userId: string;
  amountUzs: number;
  currency: 'UZS';
  plan: 'MATHCITY_PRO_MONTHLY' | 'MATHCITY_PRO_YEARLY';
  planType: PlanType;
  provider: PaymentProvider;
  status: PaymentOrderStatus;
  checkoutUrl: string;
  isDiscountApplied?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  userId: string;
  clickTransId?: string;
  amountUzs: number;
  feeUzs: number; // Click 2% fee = 580 UZS
  netAmountUzs: number; // 28,420 UZS
  status: 'SUCCESS' | 'FAILED' | 'REVERSED';
  paymentMethod: PaymentMethod;
  maskedCard: string; // e.g. "8600 **** **** 7821"
  settled: boolean;
  settlementBatchId?: string;
  errorMessage?: string;
  createdAt: string;
}

export interface PayoutRecord {
  id: string;
  destinationType: 'CARD' | 'BANK_ACCOUNT';
  destinationLabel: string;
  maskedCard: string; // "8600 **** **** 7821"
  grossRevenueUzs: number;
  providerFeeUzs: number;
  netPayoutUzs: number;
  status: 'SCHEDULED' | 'PROCESSING' | 'SETTLED';
  settlementBatchId: string;
  createdAt: string;
  settledAt?: string;
}

export interface PaymentAuditLog {
  id: string;
  timestamp: string;
  event: string;
  userId?: string;
  orderId?: string;
  clickTransId?: string;
  ip?: string;
  details: Record<string, any>;
}

class PaymentDataStore {
  private orders: Map<string, PaymentOrder> = new Map();
  private transactions: Map<string, PaymentTransaction> = new Map();
  private payouts: PayoutRecord[] = [];
  private auditLogs: PaymentAuditLog[] = [];

  // Payout destination: Owner's verified card starting with 4916
  // Full card number is NEVER stored or hardcoded; only masked representation
  public readonly ownerMaskedCard = '4916 •••• •••• ****';
  public readonly ownerCardEnding = '****';

  constructor() {
    // Seed initial audit log and sample settled payout record for owner card
    const now = new Date();
    this.payouts.push({
      id: 'payout-init-001',
      destinationType: 'CARD',
      destinationLabel: "Eganing tasdiqlangan kartasi (oxiri 7821)",
      maskedCard: this.ownerMaskedCard,
      grossRevenueUzs: 580000, // 20 subscriptions
      providerFeeUzs: 11600, // 2% fee
      netPayoutUzs: 568400,
      status: 'SETTLED',
      settlementBatchId: 'BATCH-2026-W45',
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      settledAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  createOrder(
    userId: string,
    amountUzs: number = 29000,
    checkoutUrl: string,
    provider: PaymentProvider = 'CLICK_BUSINESS',
    planType: PlanType = 'MONTHLY',
    isDiscountApplied: boolean = false
  ): PaymentOrder {
    const id = `order_${randomUUID().slice(0, 8)}_${Date.now()}`;
    const now = new Date().toISOString();
    const order: PaymentOrder = {
      id,
      userId,
      amountUzs,
      currency: 'UZS',
      plan: planType === 'YEARLY' ? 'MATHCITY_PRO_YEARLY' : 'MATHCITY_PRO_MONTHLY',
      planType,
      provider,
      status: 'PENDING',
      checkoutUrl,
      isDiscountApplied,
      createdAt: now,
      updatedAt: now,
    };
    this.orders.set(id, order);
    this.logAudit({
      event: 'ORDER_CREATED',
      userId,
      orderId: id,
      details: { amountUzs, plan: order.plan, provider, planType },
    });
    return order;
  }

  getOrder(id: string): PaymentOrder | undefined {
    return this.orders.get(id);
  }

  updateOrderStatus(id: string, status: PaymentOrderStatus): void {
    const order = this.orders.get(id);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      this.orders.set(id, order);
      this.logAudit({
        event: `ORDER_STATUS_${status}`,
        orderId: id,
        userId: order.userId,
        details: { status },
      });
    }
  }

  recordTransaction(tx: Omit<PaymentTransaction, 'id' | 'createdAt'>): PaymentTransaction {
    const id = `tx_${randomUUID().slice(0, 8)}_${Date.now()}`;
    const transaction: PaymentTransaction = {
      ...tx,
      id,
      createdAt: new Date().toISOString(),
    };
    this.transactions.set(id, transaction);
    this.logAudit({
      event: `PAYMENT_TRANSACTION_${transaction.status}`,
      userId: transaction.userId,
      orderId: transaction.orderId,
      clickTransId: transaction.clickTransId,
      details: {
        amountUzs: transaction.amountUzs,
        feeUzs: transaction.feeUzs,
        netAmountUzs: transaction.netAmountUzs,
        maskedCard: transaction.maskedCard,
        status: transaction.status,
      },
    });

    // If transaction is SUCCESS, automatically accrue towards next Owner Card payout
    if (transaction.status === 'SUCCESS') {
      this.accrueOwnerPayout(transaction);
    }

    return transaction;
  }

  getTransactionByClickId(clickTransId: string): PaymentTransaction | undefined {
    for (const tx of this.transactions.values()) {
      if (tx.clickTransId === clickTransId) return tx;
    }
    return undefined;
  }

  getAllTransactions(): PaymentTransaction[] {
    return Array.from(this.transactions.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getUserTransactions(userId: string): PaymentTransaction[] {
    return Array.from(this.transactions.values())
      .filter((t) => t.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getAllPayouts(): PayoutRecord[] {
    return [...this.payouts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  private accrueOwnerPayout(tx: PaymentTransaction): void {
    // Check if there is a pending or scheduled batch
    let currentBatch = this.payouts.find((p) => p.status === 'SCHEDULED' || p.status === 'PROCESSING');
    if (!currentBatch) {
      currentBatch = {
        id: `payout_${randomUUID().slice(0, 8)}`,
        destinationType: 'CARD',
        destinationLabel: "Eganing tasdiqlangan kartasi (oxiri 7821)",
        maskedCard: this.ownerMaskedCard,
        grossRevenueUzs: 0,
        providerFeeUzs: 0,
        netPayoutUzs: 0,
        status: 'SCHEDULED',
        settlementBatchId: `BATCH-${new Date().getFullYear()}-M${new Date().getMonth() + 1}`,
        createdAt: new Date().toISOString(),
      };
      this.payouts.unshift(currentBatch);
    }

    currentBatch.grossRevenueUzs += tx.amountUzs;
    currentBatch.providerFeeUzs += tx.feeUzs;
    currentBatch.netPayoutUzs += tx.netAmountUzs;
  }

  logAudit(log: Omit<PaymentAuditLog, 'id' | 'timestamp'>): void {
    this.auditLogs.unshift({
      ...log,
      id: `audit_${randomUUID().slice(0, 8)}`,
      timestamp: new Date().toISOString(),
    });
  }

  getAuditLogs(limit = 50): PaymentAuditLog[] {
    return this.auditLogs.slice(0, limit);
  }
}

export const paymentDataStore = new PaymentDataStore();
