class SubscriptionModel {
  final String status; // 'FREE_TRIAL_ACTIVE', 'FREE_TRIAL_EXPIRED', 'PRO_ACTIVE', 'PRO_EXPIRED'
  final int trialDaysRemaining;
  final bool isProActive;
  final String planName;
  final int priceMonthlyUzs;
  final String? proExpiresAt;
  final String? trialExpiresAt;

  SubscriptionModel({
    required this.status,
    required this.trialDaysRemaining,
    required this.isProActive,
    required this.planName,
    required this.priceMonthlyUzs,
    this.proExpiresAt,
    this.trialExpiresAt,
  });

  factory SubscriptionModel.fromJson(Map<String, dynamic> json) {
    return SubscriptionModel(
      status: json['status'] ?? 'FREE_TRIAL_ACTIVE',
      trialDaysRemaining: json['trialDaysRemaining'] ?? 30,
      isProActive: json['isProActive'] ?? false,
      planName: json['planName'] ?? 'MathCity Free Trial',
      priceMonthlyUzs: json['priceMonthlyUzs'] ?? 29000,
      proExpiresAt: json['proExpiresAt'],
      trialExpiresAt: json['trialExpiresAt'],
    );
  }

  SubscriptionModel copyWith({
    String? status,
    int? trialDaysRemaining,
    bool? isProActive,
    String? planName,
    String? proExpiresAt,
  }) {
    return SubscriptionModel(
      status: status ?? this.status,
      trialDaysRemaining: trialDaysRemaining ?? this.trialDaysRemaining,
      isProActive: isProActive ?? this.isProActive,
      planName: planName ?? this.planName,
      priceMonthlyUzs: priceMonthlyUzs,
      proExpiresAt: proExpiresAt ?? this.proExpiresAt,
    );
  }
}

class StudentModel {
  final String id;
  final String email;
  final String displayName;
  final String? username;
  final String? dateOfBirth;
  final bool profileCompleted;
  final bool parentalConsentRequired;
  final int age;
  final String mode; // 'KIDS' or 'TEEN'
  final int grade;
  final int coinBalance;
  final int totalXP;
  final int level;
  final int cityLevel;
  final int attemptedQuestionCount;
  final int correctQuestionCount;
  final SubscriptionModel subscription;

  StudentModel({
    required this.id,
    required this.email,
    required this.displayName,
    this.username,
    this.dateOfBirth,
    this.profileCompleted = true,
    this.parentalConsentRequired = false,
    required this.age,
    required this.mode,
    required this.grade,
    required this.coinBalance,
    required this.totalXP,
    required this.level,
    required this.cityLevel,
    this.attemptedQuestionCount = 0,
    this.correctQuestionCount = 0,
    required this.subscription,
  });

  int get accuracyPercentage {
    if (attemptedQuestionCount == 0) return 100;
    return ((correctQuestionCount / attemptedQuestionCount) * 100).round();
  }

  factory StudentModel.fromJson(Map<String, dynamic> json) {
    final rawUsername = json['username'] as String?;
    final rawDob = json['dateOfBirth'] as String?;
    final isComplete = json['profileCompleted'] == true ||
        (rawUsername != null && rawUsername.trim().isNotEmpty && rawDob != null && rawDob.trim().isNotEmpty);

    return StudentModel(
      id: json['id'] ?? '',
      email: json['email'] ?? '',
      displayName: json['displayName'] ?? (rawUsername ?? 'O‘quvchi'),
      username: rawUsername,
      dateOfBirth: rawDob,
      profileCompleted: json['profileCompleted'] != null ? json['profileCompleted'] == true : isComplete,
      parentalConsentRequired: json['parentalConsentRequired'] ?? ((json['age'] ?? 10) < 13),
      age: json['age'] ?? 10,
      mode: json['mode'] ?? 'KIDS',
      grade: json['grade'] ?? 4,
      coinBalance: json['coinBalance'] ?? 100,
      totalXP: json['totalXP'] ?? 0,
      level: json['level'] ?? 1,
      cityLevel: json['cityLevel'] ?? 1,
      attemptedQuestionCount: json['attemptedQuestionCount'] ?? 0,
      correctQuestionCount: json['correctQuestionCount'] ?? 0,
      subscription: json['subscription'] != null
          ? SubscriptionModel.fromJson(json['subscription'])
          : SubscriptionModel(
              status: 'FREE_TRIAL_ACTIVE',
              trialDaysRemaining: 30,
              isProActive: false,
              planName: 'MathCity Free Trial',
              priceMonthlyUzs: 29000,
            ),
    );
  }

  StudentModel copyWith({
    String? displayName,
    String? username,
    String? dateOfBirth,
    bool? profileCompleted,
    bool? parentalConsentRequired,
    int? coinBalance,
    int? totalXP,
    int? level,
    int? cityLevel,
    String? mode,
    int? attemptedQuestionCount,
    int? correctQuestionCount,
    SubscriptionModel? subscription,
  }) {
    return StudentModel(
      id: id,
      email: email,
      displayName: displayName ?? this.displayName,
      username: username ?? this.username,
      dateOfBirth: dateOfBirth ?? this.dateOfBirth,
      profileCompleted: profileCompleted ?? this.profileCompleted,
      parentalConsentRequired: parentalConsentRequired ?? this.parentalConsentRequired,
      age: age,
      mode: mode ?? this.mode,
      grade: grade,
      coinBalance: coinBalance ?? this.coinBalance,
      totalXP: totalXP ?? this.totalXP,
      level: level ?? this.level,
      cityLevel: cityLevel ?? this.cityLevel,
      attemptedQuestionCount: attemptedQuestionCount ?? this.attemptedQuestionCount,
      correctQuestionCount: correctQuestionCount ?? this.correctQuestionCount,
      subscription: subscription ?? this.subscription,
    );
  }
}
