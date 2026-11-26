import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mathcity_ai/core/theme/app_theme.dart';
import 'package:mathcity_ai/core/widgets/animated_math_background.dart';
import 'package:mathcity_ai/features/settings/certificate_screen.dart';
import 'package:mathcity_ai/features/settings/settings_screen.dart';
import 'package:mathcity_ai/shared/models/student_model.dart';
import 'package:mathcity_ai/shared/providers/student_provider.dart';

void main() {
  group('Theme System & ThemeModeNotifier Tests', () {
    test('Default theme mode is light and toggles correctly', () {
      final notifier = ThemeModeNotifier();
      expect(notifier.state, ThemeMode.light);

      notifier.setThemeMode(ThemeMode.dark);
      expect(notifier.state, ThemeMode.dark);

      notifier.setThemeMode(ThemeMode.light);
      expect(notifier.state, ThemeMode.light);
    });

    test('AppTheme defines consistent Light and Dark palettes', () {
      final light = AppTheme.lightTheme;
      final dark = AppTheme.darkTheme;

      expect(light.brightness, Brightness.light);
      expect(dark.brightness, Brightness.dark);

      final lightExt = light.extension<AppThemeColors>();
      final darkExt = dark.extension<AppThemeColors>();

      expect(lightExt, isNotNull);
      expect(darkExt, isNotNull);
      expect(lightExt!.bg, const Color(0xFFF7F8FC));
      expect(darkExt!.bg, const Color(0xFF0D0B18));
    });
  });

  group('AnimatedMathBackground Widget Tests', () {
    testWidgets('AnimatedMathBackground renders cleanly in Dark and Light mode',
        (tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: AnimatedMathBackground(isDark: false),
            ),
          ),
        ),
      );
      await tester.pump(const Duration(milliseconds: 100));
      expect(find.byType(AnimatedMathBackground), findsOneWidget);

      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: AnimatedMathBackground(isDark: true, isLeaderboard: true),
            ),
          ),
        ),
      );
      await tester.pump(const Duration(milliseconds: 100));
      expect(find.byType(AnimatedMathBackground), findsOneWidget);
    });
  });

  group('SettingsScreen Redesign Tests', () {
    testWidgets(
        'SettingsScreen renders profile card, theme mode selector, and certificate row',
        (tester) async {
      tester.view.physicalSize = const Size(800, 1400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: SettingsScreen(),
          ),
        ),
      );
      await tester.pump(const Duration(milliseconds: 300));

      expect(find.text('Sozlamalar'), findsOneWidget);
      expect(find.text('Mavzu rejimi'), findsOneWidget);
      expect(find.text('Yorug‘'), findsOneWidget);
      expect(find.text('Tungi'), findsOneWidget);
      expect(find.text('Tizim'), findsOneWidget);
      expect(find.text('Tovush effektlari'), findsOneWidget);
      expect(find.text('Animatsiyalar'), findsOneWidget);
      expect(find.text('Mening sertifikatim'), findsOneWidget);
      expect(find.text('O‘quv ma’lumotlarini yuklab olish'), findsOneWidget);
    });
  });

  group('CertificateScreen Pro & Lesson Gate Tests', () {
    testWidgets('CertificateScreen shows Pro required message for Free users',
        (tester) async {
      final freeStudent = StudentModel(
        id: 'free-1',
        email: 'ali@mathcity.uz',
        displayName: 'Ali Valiyev',
        username: 'ali',
        age: 10,
        mode: 'kids',
        grade: 4,
        totalXP: 120,
        level: 2,
        cityLevel: 1,
        coinBalance: 50,
        completedLessonsCount: 3,
        completedLessons: ['lesson_1', 'lesson_2', 'lesson_3'],
        subscription: SubscriptionModel(
          status: 'FREE',
          trialDaysRemaining: 0,
          isProActive: false,
          planName: 'Free',
          priceMonthlyUzs: 0,
        ),
      );

      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            studentProvider
                .overrideWith((ref) => _MockStudentNotifier(freeStudent)),
          ],
          child: const MaterialApp(
            home: CertificateScreen(),
          ),
        ),
      );
      await tester.pump(const Duration(milliseconds: 300));

      expect(find.text('MathCity Pro talab qilinadi'), findsOneWidget);
      expect(find.text('Pro obunani ochish'), findsOneWidget);
    });

    testWidgets(
        'CertificateScreen shows empty state for Pro user without completed lessons',
        (tester) async {
      final proStudentNoLessons = StudentModel(
        id: 'pro-1',
        email: 'laylo@mathcity.uz',
        displayName: 'Laylo Karimova',
        username: 'laylo',
        age: 9,
        mode: 'kids',
        grade: 3,
        totalXP: 0,
        level: 1,
        cityLevel: 1,
        coinBalance: 100,
        completedLessonsCount: 0,
        completedLessons: const [],
        subscription: SubscriptionModel(
          status: 'PRO_ACTIVE',
          trialDaysRemaining: 30,
          isProActive: true,
          planName: 'MathCity Pro',
          priceMonthlyUzs: 29000,
        ),
      );

      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            studentProvider.overrideWith(
                (ref) => _MockStudentNotifier(proStudentNoLessons)),
          ],
          child: const MaterialApp(
            home: CertificateScreen(),
          ),
        ),
      );
      await tester.pump(const Duration(milliseconds: 300));

      expect(find.text('Sertifikat hali tayyor emas'), findsOneWidget);
      expect(find.text('Darslarga o‘tish'), findsOneWidget);
    });

    testWidgets(
        'CertificateScreen renders full luxury Certificate for Pro user with completed lessons',
        (tester) async {
      final proStudentWithLessons = StudentModel(
        id: 'pro-2',
        email: 'javohir@mathcity.uz',
        displayName: 'Javohir Toshmatov',
        username: 'javohir',
        age: 11,
        mode: 'kids',
        grade: 5,
        totalXP: 450,
        level: 4,
        cityLevel: 2,
        coinBalance: 280,
        completedLessonsCount: 5,
        completedLessons: ['l1', 'l2', 'l3', 'l4', 'l5'],
        subscription: SubscriptionModel(
          status: 'PRO_ACTIVE',
          trialDaysRemaining: 30,
          isProActive: true,
          planName: 'MathCity Pro',
          priceMonthlyUzs: 29000,
        ),
      );

      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            studentProvider.overrideWith(
                (ref) => _MockStudentNotifier(proStudentWithLessons)),
          ],
          child: const MaterialApp(
            home: CertificateScreen(),
          ),
        ),
      );
      await tester.pump(const Duration(milliseconds: 300));

      expect(find.text('SERTIFIKAT'), findsOneWidget);
      expect(find.text('Javohir Toshmatov'), findsOneWidget);
      expect(find.text('5 ta dars'), findsOneWidget);
      expect(find.text('450 XP'), findsOneWidget);
      expect(find.text('Lvl 4'), findsOneWidget);
      expect(find.text('Rasm sifatida saqlash'), findsOneWidget);
      expect(find.text('PDF yuklab olish'), findsOneWidget);
      expect(find.text('Ulashish'), findsOneWidget);
    });
  });
}

class _MockStudentNotifier extends StudentNotifier {
  _MockStudentNotifier(StudentModel mockStudent) : super() {
    state = StudentState(student: mockStudent, isLoading: false);
  }
}
