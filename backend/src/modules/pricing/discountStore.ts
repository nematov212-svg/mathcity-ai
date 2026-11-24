import { UserAccount } from '../../utils/repository.js';
import { paymentDataStore, PaymentTransaction } from '../payments/paymentStore.js';

export interface DiscountSettings {
  enabled: boolean;
  discountPercent: number; // default: 30
  durationDays: number; // default: 7
  applicablePlans: ('monthly' | 'yearly')[]; // default: ['monthly']
  updatedAt: string;
  updatedBy: string;
}

class DiscountStore {
  private settings: DiscountSettings = {
    enabled: true,
    discountPercent: 30,
    durationDays: 7,
    applicablePlans: ['monthly'],
    updatedAt: new Date().toISOString(),
    updatedBy: 'system',
  };

  getSettings(): DiscountSettings {
    return { ...this.settings };
  }

  updateSettings(data: Partial<DiscountSettings>, adminUsername: string = 'admin'): DiscountSettings {
    if (typeof data.enabled === 'boolean') {
      this.settings.enabled = data.enabled;
    }
    if (typeof data.discountPercent === 'number' && data.discountPercent >= 0 && data.discountPercent <= 100) {
      this.settings.discountPercent = Math.round(data.discountPercent);
    }
    if (typeof data.durationDays === 'number' && data.durationDays > 0) {
      this.settings.durationDays = Math.round(data.durationDays);
    }
    if (Array.isArray(data.applicablePlans)) {
      const valid = data.applicablePlans.filter((p): p is 'monthly' | 'yearly' => p === 'monthly' || p === 'yearly');
      if (valid.length > 0) {
        this.settings.applicablePlans = valid;
      }
    }
    this.settings.updatedAt = new Date().toISOString();
    this.settings.updatedBy = adminUsername;
    return this.getSettings();
  }
}

export const discountStore = new DiscountStore();

export function calculatePricing(user?: UserAccount, nowMs: number = Date.now()) {
  const settings = discountStore.getSettings();
  const serverNow = new Date(nowMs).toISOString();

  let isEligible = false;
  let reason = '';
  let discountEndsAt: string | null = null;
  let secondsRemaining = 0;
  let daysRemaining = 0;

  if (!settings.enabled) {
    isEligible = false;
    reason = 'Chegirma tizimi vaqtincha o‘chirilgan.';
  } else if (!user) {
    // Unauthenticated guest / prospective user
    isEligible = true;
    reason = `Yangi foydalanuvchilar uchun ${settings.discountPercent}% chegirma`;
    secondsRemaining = settings.durationDays * 86400;
    daysRemaining = settings.durationDays;
  } else {
    // Authenticated user checks
    const isPro = user.subscription && user.subscription.status === 'PRO_ACTIVE';
    if (isPro) {
      isEligible = false;
      reason = 'Siz allaqachon PRO obunasiga egasiz.';
    } else {
      const hasPriorPaidOrder = paymentDataStore
        .getUserTransactions(user.id)
        .some((t: PaymentTransaction) => t.status === 'SUCCESS' || (t.status as string) === 'COMPLETED' || (t.status as string) === 'PAID');
      const hasPriorPro = !!user.subscription?.proStartedAt;

      if (hasPriorPaidOrder || hasPriorPro) {
        isEligible = false;
        reason = 'Chegirma bitta foydalanuvchi uchun faqat bir marta amal qiladi.';
      } else {
        const createdAtMs = new Date(user.createdAt).getTime();
        const durationMs = settings.durationDays * 86400 * 1000;
        const expiryMs = (isNaN(createdAtMs) ? nowMs : createdAtMs) + durationMs;

        if (nowMs >= expiryMs) {
          isEligible = false;
          reason = `Chegirma muddati tugagan (${settings.durationDays} kun o‘tgan).`;
        } else {
          isEligible = true;
          reason = `Yangi foydalanuvchi uchun ${settings.discountPercent}% chegirma`;
          discountEndsAt = new Date(expiryMs).toISOString();
          secondsRemaining = Math.max(0, Math.floor((expiryMs - nowMs) / 1000));
          daysRemaining = Math.ceil(secondsRemaining / 86400);
        }
      }
    }
  }

  const basePrices = {
    monthly: 29000,
    yearly: 250000,
  };

  const isMonthlyDiscounted = isEligible && settings.applicablePlans.includes('monthly');
  const isYearlyDiscounted = isEligible && settings.applicablePlans.includes('yearly');

  const monthlyFinalPrice = isMonthlyDiscounted
    ? Math.round(basePrices.monthly * (1 - settings.discountPercent / 100))
    : basePrices.monthly;

  const yearlyFinalPrice = isYearlyDiscounted
    ? Math.round(basePrices.yearly * (1 - settings.discountPercent / 100))
    : basePrices.yearly;

  return {
    plans: [
      {
        planId: 'monthly',
        name: 'Oylik',
        period: 'month',
        basePrice: basePrices.monthly,
        finalPrice: monthlyFinalPrice,
        discountPercent: isMonthlyDiscounted ? settings.discountPercent : 0,
        isDiscounted: isMonthlyDiscounted,
        formattedBasePrice: `${basePrices.monthly.toLocaleString('uz-UZ')} so‘m`,
        formattedFinalPrice: `${monthlyFinalPrice.toLocaleString('uz-UZ')} so‘m`,
      },
      {
        planId: 'yearly',
        name: 'Yillik',
        period: 'year',
        basePrice: basePrices.yearly,
        finalPrice: yearlyFinalPrice,
        discountPercent: isYearlyDiscounted ? settings.discountPercent : 0,
        isDiscounted: isYearlyDiscounted,
        formattedBasePrice: `${basePrices.yearly.toLocaleString('uz-UZ')} so‘m`,
        formattedFinalPrice: `${yearlyFinalPrice.toLocaleString('uz-UZ')} so‘m`,
      },
    ],
    hasDiscount: isEligible,
    discountPercent: isEligible ? settings.discountPercent : 0,
    discountEndsAt,
    serverNow,
    serverTimestampMs: nowMs,
    eligibility: {
      eligible: isEligible,
      reason,
      daysRemaining,
      secondsRemaining,
    },
  };
}
