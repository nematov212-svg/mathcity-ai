class PricingPlan {
  final String id;
  final String name;
  final int basePrice;
  final int finalPrice;
  final int discountPercent;
  final bool isDiscounted;
  final int savings;
  final String billingCycle;

  const PricingPlan({
    required this.id,
    required this.name,
    required this.basePrice,
    required this.finalPrice,
    required this.discountPercent,
    required this.isDiscounted,
    required this.savings,
    required this.billingCycle,
  });

  factory PricingPlan.fromJson(Map<String, dynamic> json) {
    final basePrice = (json['basePrice'] as num?)?.toInt() ?? 29000;
    final finalPrice = (json['finalPrice'] as num?)?.toInt() ?? basePrice;
    final discountPercent = (json['discountPercent'] as num?)?.toInt() ?? 0;
    final isDiscounted = json['isDiscounted'] == true ||
        (discountPercent > 0 && finalPrice < basePrice);
    final savings =
        (json['savings'] as num?)?.toInt() ?? (basePrice - finalPrice);
    return PricingPlan(
      id: (json['id'] ?? json['planId'] ?? '').toString(),
      name: (json['name'] ?? '').toString(),
      basePrice: basePrice,
      finalPrice: finalPrice,
      discountPercent: discountPercent,
      isDiscounted: isDiscounted,
      savings: savings > 0 ? savings : 0,
      billingCycle:
          (json['billingCycle'] ?? json['period'] ?? 'month').toString(),
    );
  }

  static const monthlyDefault = PricingPlan(
    id: 'monthly',
    name: '1 oylik',
    basePrice: 29000,
    finalPrice: 29000,
    discountPercent: 0,
    isDiscounted: false,
    savings: 0,
    billingCycle: 'month',
  );

  static const yearlyDefault = PricingPlan(
    id: 'yearly',
    name: '1 yillik',
    basePrice: 250000,
    finalPrice: 250000,
    discountPercent: 0,
    isDiscounted: false,
    savings: 0,
    billingCycle: 'year',
  );
}

class PricingData {
  final DateTime serverNow;
  final Duration serverOffset; // serverNow - deviceNow
  final DateTime? discountEndsAt;
  final bool isEligible;
  final String eligibilityReason;
  final PricingPlan monthlyPlan;
  final PricingPlan yearlyPlan;

  const PricingData({
    required this.serverNow,
    required this.serverOffset,
    required this.discountEndsAt,
    required this.isEligible,
    required this.eligibilityReason,
    required this.monthlyPlan,
    required this.yearlyPlan,
  });

  /// Authoritative server-synced time on this device, immune to phone clock tampering
  DateTime get authoritativeNow => DateTime.now().add(serverOffset);

  /// Remaining duration until the discount expires
  Duration get remainingDiscountDuration {
    if (!isEligible || discountEndsAt == null) return Duration.zero;
    final diff = discountEndsAt!.difference(authoritativeNow);
    return diff.isNegative ? Duration.zero : diff;
  }

  bool get hasActiveDiscount =>
      isEligible &&
      remainingDiscountDuration.inSeconds > 0 &&
      (monthlyPlan.isDiscounted || yearlyPlan.isDiscounted);

  factory PricingData.initial() {
    final now = DateTime.now();
    return PricingData(
      serverNow: now,
      serverOffset: Duration.zero,
      discountEndsAt: null,
      isEligible: false,
      eligibilityReason: 'INITIAL',
      monthlyPlan: PricingPlan.monthlyDefault,
      yearlyPlan: PricingPlan.yearlyDefault,
    );
  }

  factory PricingData.fromJson(
      Map<String, dynamic> json, DateTime localReceivedAt) {
    final dataMap = (json['data'] is Map<String, dynamic>)
        ? json['data'] as Map<String, dynamic>
        : json;

    final serverNowStr =
        (dataMap['serverNow'] ?? json['serverNow']) as String?;
    final serverNow = serverNowStr != null
        ? DateTime.tryParse(serverNowStr) ?? localReceivedAt
        : localReceivedAt;
    final serverOffset = serverNow.difference(localReceivedAt);

    final endsAtStr = (dataMap['expiresAt'] ??
        dataMap['discountEndsAt'] ??
        json['expiresAt'] ??
        json['discountEndsAt']) as String?;
    final discountEndsAt =
        endsAtStr != null ? DateTime.tryParse(endsAtStr) : null;

    final elig =
        (dataMap['eligibility'] ?? json['eligibility']) as Map<String, dynamic>? ??
            {};
    final isEligible = dataMap['eligible'] == true ||
        json['eligible'] == true ||
        elig['eligible'] == true ||
        dataMap['hasDiscount'] == true ||
        json['hasDiscount'] == true;
    final reason = (elig['reason'] ??
            dataMap['reason'] ??
            json['reason'] ??
            '')
        .toString();

    final plansSource = dataMap['plans'] ?? json['plans'];

    PricingPlan monthly = PricingPlan.monthlyDefault;
    PricingPlan yearly = PricingPlan.yearlyDefault;

    if (plansSource is List) {
      for (final p in plansSource) {
        if (p is Map<String, dynamic>) {
          final id = (p['planId'] ?? p['id'] ?? '').toString().toLowerCase();
          if (id == 'monthly') {
            monthly = PricingPlan.fromJson(p);
          } else if (id == 'yearly') {
            yearly = PricingPlan.fromJson(p);
          }
        }
      }
    } else if (plansSource is Map) {
      final plans = plansSource as Map<String, dynamic>;
      if (plans['monthly'] != null) {
        monthly =
            PricingPlan.fromJson(plans['monthly'] as Map<String, dynamic>);
      }
      if (plans['yearly'] != null) {
        yearly = PricingPlan.fromJson(plans['yearly'] as Map<String, dynamic>);
      }
    } else {
      final mBase = (dataMap['baseMonthlyPrice'] as num?)?.toInt() ?? 29000;
      final mFinal = (dataMap['monthlyPrice'] as num?)?.toInt() ??
          (isEligible ? 20300 : mBase);
      final yBase = (dataMap['baseYearlyPrice'] as num?)?.toInt() ?? 250000;
      final yFinal = (dataMap['yearlyPrice'] as num?)?.toInt() ??
          (isEligible ? 175000 : yBase);

      monthly = PricingPlan(
        id: 'monthly',
        name: '1 oylik',
        basePrice: mBase,
        finalPrice: isEligible ? mFinal : mBase,
        discountPercent: isEligible ? 30 : 0,
        isDiscounted: isEligible && mFinal < mBase,
        savings: isEligible && mFinal < mBase ? (mBase - mFinal) : 0,
        billingCycle: 'month',
      );
      yearly = PricingPlan(
        id: 'yearly',
        name: '1 yillik',
        basePrice: yBase,
        finalPrice: isEligible ? yFinal : yBase,
        discountPercent: isEligible ? 30 : 0,
        isDiscounted: isEligible && yFinal < yBase,
        savings: isEligible && yFinal < yBase ? (yBase - yFinal) : 0,
        billingCycle: 'year',
      );
    }

    // Force non-discounted if not eligible
    if (!isEligible) {
      monthly = PricingPlan(
        id: monthly.id,
        name: monthly.name,
        basePrice: monthly.basePrice,
        finalPrice: monthly.basePrice,
        discountPercent: 0,
        isDiscounted: false,
        savings: 0,
        billingCycle: monthly.billingCycle,
      );
      yearly = PricingPlan(
        id: yearly.id,
        name: yearly.name,
        basePrice: yearly.basePrice,
        finalPrice: yearly.basePrice,
        discountPercent: 0,
        isDiscounted: false,
        savings: 0,
        billingCycle: yearly.billingCycle,
      );
    }

    return PricingData(
      serverNow: serverNow,
      serverOffset: serverOffset,
      discountEndsAt: isEligible ? discountEndsAt : null,
      isEligible: isEligible,
      eligibilityReason: reason,
      monthlyPlan: monthly,
      yearlyPlan: yearly,
    );
  }
}
