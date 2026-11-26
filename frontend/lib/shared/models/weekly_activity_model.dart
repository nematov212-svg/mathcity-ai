/// MathCity AI — Weekly Activity Model
/// Model representing daily activity progress, streak status, and 7-day calendar.
library;

enum ActivityLevel { none, low, medium, high }

extension ActivityLevelX on ActivityLevel {
  String get nameUpper {
    switch (this) {
      case ActivityLevel.high:
        return 'HIGH';
      case ActivityLevel.medium:
        return 'MEDIUM';
      case ActivityLevel.low:
        return 'LOW';
      case ActivityLevel.none:
        return 'NONE';
    }
  }

  String get labelUz {
    switch (this) {
      case ActivityLevel.high:
        return 'Ko‘p';
      case ActivityLevel.medium:
        return 'O‘rtacha';
      case ActivityLevel.low:
        return 'Kam';
      case ActivityLevel.none:
        return 'Bajarilmagan';
    }
  }

  static ActivityLevel fromString(String? val) {
    switch (val?.toUpperCase()) {
      case 'HIGH':
        return ActivityLevel.high;
      case 'MEDIUM':
        return ActivityLevel.medium;
      case 'LOW':
        return ActivityLevel.low;
      case 'NONE':
      default:
        return ActivityLevel.none;
    }
  }

  static ActivityLevel fromScore(int score) {
    if (score >= 25) return ActivityLevel.high;
    if (score >= 10) return ActivityLevel.medium;
    if (score >= 1) return ActivityLevel.low;
    return ActivityLevel.none;
  }
}

class ActivityDayItem {
  final String date;
  final String weekday; // Du, Se, Ch, Pa, Ju, Sh, Ya
  final String weekdayName; // Dushanba, ...
  final int correctAnswers;
  final int lessonsCompleted;
  final int score;
  final ActivityLevel level;
  final bool isToday;
  final bool isFuture;

  const ActivityDayItem({
    required this.date,
    required this.weekday,
    required this.weekdayName,
    this.correctAnswers = 0,
    this.lessonsCompleted = 0,
    this.score = 0,
    this.level = ActivityLevel.none,
    this.isToday = false,
    this.isFuture = false,
  });

  factory ActivityDayItem.fromJson(Map<String, dynamic> json) {
    return ActivityDayItem(
      date: json['date'] as String? ?? '',
      weekday: json['weekday'] as String? ?? '',
      weekdayName: json['weekdayName'] as String? ?? '',
      correctAnswers: (json['correctAnswers'] as num?)?.toInt() ?? 0,
      lessonsCompleted: (json['lessonsCompleted'] as num?)?.toInt() ?? 0,
      score: (json['score'] as num?)?.toInt() ?? 0,
      level: ActivityLevelX.fromString(json['level'] as String?),
      isToday: json['isToday'] as bool? ?? false,
      isFuture: json['isFuture'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'date': date,
      'weekday': weekday,
      'weekdayName': weekdayName,
      'correctAnswers': correctAnswers,
      'lessonsCompleted': lessonsCompleted,
      'score': score,
      'level': level.nameUpper,
      'isToday': isToday,
      'isFuture': isFuture,
    };
  }

  ActivityDayItem copyWith({
    String? date,
    String? weekday,
    String? weekdayName,
    int? correctAnswers,
    int? lessonsCompleted,
    int? score,
    ActivityLevel? level,
    bool? isToday,
    bool? isFuture,
  }) {
    return ActivityDayItem(
      date: date ?? this.date,
      weekday: weekday ?? this.weekday,
      weekdayName: weekdayName ?? this.weekdayName,
      correctAnswers: correctAnswers ?? this.correctAnswers,
      lessonsCompleted: lessonsCompleted ?? this.lessonsCompleted,
      score: score ?? this.score,
      level: level ?? this.level,
      isToday: isToday ?? this.isToday,
      isFuture: isFuture ?? this.isFuture,
    );
  }
}

class WeeklyActivityData {
  final List<ActivityDayItem> days;
  final int currentStreak;
  final int maxStreak;
  final ActivityLevel todayLevel;
  final int todayScore;
  final bool todayNeedSave;
  final String serverDate;
  final int secondsUntilMidnight;

  const WeeklyActivityData({
    required this.days,
    this.currentStreak = 0,
    this.maxStreak = 0,
    this.todayLevel = ActivityLevel.none,
    this.todayScore = 0,
    this.todayNeedSave = false,
    this.serverDate = '',
    this.secondsUntilMidnight = 0,
  });

  factory WeeklyActivityData.empty() {
    final now = DateTime.now();
    final todayWeekday = now.weekday; // 1 = Du, 7 = Ya
    final dayNames = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];
    final fullNames = [
      'Dushanba',
      'Seshanba',
      'Chorshanba',
      'Payshanba',
      'Juma',
      'Shanba',
      'Yakshanba'
    ];

    final days = List.generate(7, (i) {
      final dayIndex = i + 1;
      return ActivityDayItem(
        date: '',
        weekday: dayNames[i],
        weekdayName: fullNames[i],
        isToday: dayIndex == todayWeekday,
        isFuture: dayIndex > todayWeekday,
      );
    });

    return WeeklyActivityData(
      days: days,
      currentStreak: 0,
      maxStreak: 0,
      todayLevel: ActivityLevel.none,
      todayScore: 0,
      todayNeedSave: false,
    );
  }

  factory WeeklyActivityData.fromJson(Map<String, dynamic> json) {
    final rawDays = json['days'] as List<dynamic>? ?? [];
    final days = rawDays
        .map((d) => ActivityDayItem.fromJson(d as Map<String, dynamic>))
        .toList();

    return WeeklyActivityData(
      days: days,
      currentStreak: (json['currentStreak'] as num?)?.toInt() ?? 0,
      maxStreak: (json['maxStreak'] as num?)?.toInt() ?? 0,
      todayLevel: ActivityLevelX.fromString(json['todayLevel'] as String?),
      todayScore: (json['todayScore'] as num?)?.toInt() ?? 0,
      todayNeedSave: json['todayNeedSave'] as bool? ?? false,
      serverDate: json['serverDate'] as String? ?? '',
      secondsUntilMidnight:
          (json['secondsUntilMidnight'] as num?)?.toInt() ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'days': days.map((d) => d.toJson()).toList(),
      'currentStreak': currentStreak,
      'maxStreak': maxStreak,
      'todayLevel': todayLevel.nameUpper,
      'todayScore': todayScore,
      'todayNeedSave': todayNeedSave,
      'serverDate': serverDate,
      'secondsUntilMidnight': secondsUntilMidnight,
    };
  }

  WeeklyActivityData copyWith({
    List<ActivityDayItem>? days,
    int? currentStreak,
    int? maxStreak,
    ActivityLevel? todayLevel,
    int? todayScore,
    bool? todayNeedSave,
    String? serverDate,
    int? secondsUntilMidnight,
  }) {
    return WeeklyActivityData(
      days: days ?? this.days,
      currentStreak: currentStreak ?? this.currentStreak,
      maxStreak: maxStreak ?? this.maxStreak,
      todayLevel: todayLevel ?? this.todayLevel,
      todayScore: todayScore ?? this.todayScore,
      todayNeedSave: todayNeedSave ?? this.todayNeedSave,
      serverDate: serverDate ?? this.serverDate,
      secondsUntilMidnight: secondsUntilMidnight ?? this.secondsUntilMidnight,
    );
  }
}
