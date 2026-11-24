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
    return PricingPlan(
      id: (json['id'] ?? '').toString(),
      name: (json['name'] ?? '').toString(),
      basePrice: (json['basePrice'] as num?)?.toInt() ?? 29000,
      finalPrice: (json['finalPrice'] as num?)?.toInt() ?? 29000,
      discountPercent: (json['discountPercent'] as num?)?.toInt() ?? 0,
      isDiscounted: json['isDiscounted'] == true,
      savings: (json['savings'] as num?)?.toInt() ?? 0,
      billingCycle: (json['billingCycle'] ?? 'month').toString(),
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

  /// Remaining duration until the 7-day discount expires
  Duration get remainingDiscountDuration {
    if (!isEligible || discountEndsAt == null) return Duration.zero;
    final diff = discountEndsAt!.difference(authoritativeNow);
    return diff.isNegative ? Duration.zero : diff;
  }

  bool get hasActiveDiscount => isEligible && remainingDiscountDuration.inSeconds > 0 && monthlyPlan.isDiscounted;

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

  factory PricingData.fromJson(Map<String, dynamic> json, DateTime localReceivedAt) {
    final serverNowStr = json['serverNow'] as String?;
    final serverNow = serverNowStr != null ? DateTime.tryParse(serverNowStr) ?? localReceivedAt : localReceivedAt;
    final serverOffset = serverNow.difference(localReceivedAt);

    final endsAtStr = json['discountEndsAt'] as String?;
    final discountEndsAt = endsAtStr != null ? DateTime.tryParse(endsAtStr) : null;

    final elig = json['eligibility'] as Map<String, dynamic>? ?? {};
    final isEligible = elig['eligible'] == true;
    final reason = (elig['reason'] ?? '').toString();

    final plans = json['plans'] as Map<String, dynamic>? ?? {};
    final monthly = plans['monthly'] != null
        ? PricingPlan.fromJson(plans['monthly'] as Map<String, dynamic>)
        : PricingPlan.monthlyDefault;
    final yearly = plans['yearly'] != null
        ? PricingPlan.fromJson(plans['yearly'] as Map<String, dynamic>)
        : PricingPlan.yearlyDefault;

    return PricingData(
      serverNow: serverNow,
      serverOffset: serverOffset,
      discountEndsAt: discountEndsAt,
      isEligible: isEligible,
      eligibilityReason: reason,
      monthlyPlan: monthly,
      yearlyPlan: yearly,
    );
  }
}
