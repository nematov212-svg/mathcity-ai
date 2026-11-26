import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mathcity_ai/core/theme/app_theme.dart';
import 'package:mathcity_ai/features/home/widgets/weekly_streak_card.dart';
import 'package:mathcity_ai/shared/models/weekly_activity_model.dart';
import 'package:mathcity_ai/shared/providers/weekly_activity_provider.dart';

void main() {
  group('MathCity AI — Weekly Activity & Streak Calendar Widget Tests', () {
    test('ActivityLevel and score calculations match business rules', () {
      expect(ActivityLevelX.fromScore(0), ActivityLevel.none);
      expect(ActivityLevelX.fromScore(1), ActivityLevel.low);
      expect(ActivityLevelX.fromScore(9), ActivityLevel.low);
      expect(ActivityLevelX.fromScore(10), ActivityLevel.medium);
      expect(ActivityLevelX.fromScore(24), ActivityLevel.medium);
      expect(ActivityLevelX.fromScore(25), ActivityLevel.high);
      expect(ActivityLevelX.fromScore(100), ActivityLevel.high);

      expect(ActivityLevel.high.labelUz, 'Ko‘p');
      expect(ActivityLevel.medium.labelUz, 'O‘rtacha');
      expect(ActivityLevel.low.labelUz, 'Kam');
      expect(ActivityLevel.none.labelUz, 'Bajarilmagan');
    });

    test('WeeklyActivityData model serialization and copyWith works properly', () {
      final data = WeeklyActivityData(
        days: [
          ActivityDayItem(
            date: '2026-11-23',
            weekday: 'Du',
            weekdayName: 'Dushanba',
            correctAnswers: 5,
            lessonsCompleted: 1,
            score: 10,
            level: ActivityLevel.medium,
            isToday: false,
            isFuture: false,
          ),
          ActivityDayItem(
            date: '2026-11-24',
            weekday: 'Se',
            weekdayName: 'Seshanba',
            correctAnswers: 25,
            lessonsCompleted: 2,
            score: 35,
            level: ActivityLevel.high,
            isToday: false,
            isFuture: false,
          ),
        ],
        currentStreak: 4,
        maxStreak: 12,
        todayLevel: ActivityLevel.high,
        todayScore: 35,
        todayNeedSave: false,
        serverDate: '2026-11-26',
        secondsUntilMidnight: 3600,
      );

      final json = data.toJson();
      final parsed = WeeklyActivityData.fromJson(json);

      expect(parsed.currentStreak, 4);
      expect(parsed.maxStreak, 12);
      expect(parsed.todayLevel, ActivityLevel.high);
      expect(parsed.days.length, 2);
      expect(parsed.days[0].level, ActivityLevel.medium);
      expect(parsed.days[1].level, ActivityLevel.high);
    });

    testWidgets('WeeklyStreakCard renders streak counter, day names, and opens bottom sheet modal', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final mockDays = [
        ActivityDayItem(date: '2026-11-23', weekday: 'Du', weekdayName: 'Dushanba', score: 10, level: ActivityLevel.medium),
        ActivityDayItem(date: '2026-11-24', weekday: 'Se', weekdayName: 'Seshanba', score: 30, level: ActivityLevel.high),
        ActivityDayItem(date: '2026-11-25', weekday: 'Ch', weekdayName: 'Chorshanba', score: 5, level: ActivityLevel.low),
        ActivityDayItem(date: '2026-11-26', weekday: 'Pa', weekdayName: 'Payshanba', score: 0, level: ActivityLevel.none, isToday: true),
        ActivityDayItem(date: '2026-11-27', weekday: 'Ju', weekdayName: 'Juma', score: 0, level: ActivityLevel.none, isFuture: true),
        ActivityDayItem(date: '2026-11-28', weekday: 'Sh', weekdayName: 'Shanba', score: 0, level: ActivityLevel.none, isFuture: true),
        ActivityDayItem(date: '2026-11-29', weekday: 'Ya', weekdayName: 'Yakshanba', score: 0, level: ActivityLevel.none, isFuture: true),
      ];

      final testData = WeeklyActivityData(
        days: mockDays,
        currentStreak: 3,
        maxStreak: 10,
        todayLevel: ActivityLevel.none,
        todayScore: 0,
        todayNeedSave: true,
        serverDate: '2026-11-26',
        secondsUntilMidnight: 1800,
      );

      final container = ProviderContainer(
        overrides: [
          weeklyActivityProvider.overrideWith((ref) => MockWeeklyActivityNotifier(testData)),
        ],
      );
      addTearDown(container.dispose);

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: MaterialApp(
            home: Scaffold(
              body: Padding(
                padding: const EdgeInsets.all(16),
                child: WeeklyStreakCard(
                  colors: AppThemeColors.light,
                ),
              ),
            ),
          ),
        ),
      );

      await tester.pump(const Duration(milliseconds: 300));

      // Verifies 7 weekdays are present
      expect(find.text('Du'), findsOneWidget);
      expect(find.text('Se'), findsOneWidget);
      expect(find.text('Ch'), findsOneWidget);
      expect(find.text('Pa'), findsOneWidget);
      expect(find.text('Ju'), findsOneWidget);
      expect(find.text('Sh'), findsOneWidget);
      expect(find.text('Ya'), findsOneWidget);

      // Verifies streak count "3 kunlik seriya"
      expect(find.text('3 kunlik seriya'), findsOneWidget);

      // Tap on Tuesday ('Se') to open day details bottom sheet
      await tester.tap(find.text('Se'));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300));

      // Bottom sheet should show Seshanba details
      expect(find.textContaining('Seshanba'), findsOneWidget);
      expect(find.text('Ko‘p faollik 🔥'), findsOneWidget);
      expect(find.text('To‘g‘ri javoblar'), findsOneWidget);
      expect(find.text('Tugatilgan darslar'), findsOneWidget);
      expect(find.text('Jami kunlik bal'), findsOneWidget);
    });
  });
}

class MockWeeklyActivityNotifier extends WeeklyActivityNotifier {
  MockWeeklyActivityNotifier(WeeklyActivityData initialData) {
    state = WeeklyActivityState(data: initialData, isLoading: false);
  }

  @override
  Future<void> loadActivity() async {}

  @override
  Future<void> refresh() async {}
}
