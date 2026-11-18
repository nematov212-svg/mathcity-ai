import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mathcity_ai/features/onboarding/welcome_screen.dart';
import 'package:mathcity_ai/features/practice/exercise_screen.dart';
import 'package:mathcity_ai/features/city/city_screen.dart';
import 'package:mathcity_ai/features/settings/settings_screen.dart';
import 'package:mathcity_ai/features/settings/tariflar_screen.dart';
import 'package:mathcity_ai/core/widgets/mathcity_logo.dart';
import 'package:mathcity_ai/core/widgets/coin_badge.dart';

void main() {
  testWidgets('WelcomeScreen renders MathCityLogo and Google Sign-In button', (WidgetTester tester) async {
    tester.view.physicalSize = const Size(1080, 1920);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: WelcomeScreen(),
        ),
      ),
    );

    await tester.pumpAndSettle();

    // Verify mascot logo presence
    expect(find.byType(MathCityLogo), findsOneWidget);

    // Verify Google sign-in button
    expect(find.textContaining('Google'), findsOneWidget);

    // Verify start button
    expect(find.text('Boshlash'), findsOneWidget);
  });

  testWidgets('ExerciseScreen renders 10-question sequence with 1 / 10 misol and +1 oltin', (WidgetTester tester) async {
    tester.view.physicalSize = const Size(1080, 1920);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: ExerciseScreen(),
        ),
      ),
    );

    await tester.pumpAndSettle();

    // Step counter
    expect(find.text('1 / 10 misol'), findsOneWidget);

    // Exactly +1 gold coin indicator
    expect(find.text('+1 oltin'), findsOneWidget);

    // Prompt statement
    expect(find.text('12 + 8 = ?'), findsOneWidget);

    // Choices
    expect(find.text('20'), findsOneWidget);
    expect(find.text('Javobni tekshirish'), findsOneWidget);

    // Tap answer 20 and submit
    await tester.tap(find.text('20'));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Javobni tekshirish'));
    await tester.pumpAndSettle();

    // Verify green success banner and "+1 oltin tanga qo‘shildi!"
    expect(find.textContaining('To‘g‘ri javob! +1 oltin tanga qo‘shildi!'), findsOneWidget);
    expect(find.text('Keyingi misol'), findsOneWidget);
  });

  testWidgets('CityScreen renders 3D isometric city with Yangi bino qurish CTA', (WidgetTester tester) async {
    tester.view.physicalSize = const Size(1080, 1920);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: CityScreen(),
        ),
      ),
    );

    await tester.pump(const Duration(milliseconds: 300));

    expect(find.textContaining('Mening shahrim'), findsOneWidget);
    expect(find.text('Yangi bino qurish'), findsOneWidget);
    expect(find.byType(CoinBadge), findsOneWidget);
  });

  testWidgets('TariflarScreen renders MathCity Pro, 29 000 UZS/oy, and 30-day trial', (WidgetTester tester) async {
    tester.view.physicalSize = const Size(1080, 1920);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: TariflarScreen(),
        ),
      ),
    );

    await tester.pumpAndSettle();

    expect(find.text('Tariflar va Obuna'), findsOneWidget);
    expect(find.text('MathCity Pro'), findsOneWidget);
    expect(find.text('29 000 so‘m'), findsOneWidget);
    expect(find.textContaining('Sinov muddatiga'), findsOneWidget);
    expect(find.textContaining('Pro tarifiga o‘tish'), findsOneWidget);
    expect(find.textContaining('Xaridlarni tiklash'), findsOneWidget);
  });

  testWidgets('SettingsScreen includes TARIFLAR VA OBUNA tile', (WidgetTester tester) async {
    tester.view.physicalSize = const Size(1080, 1920);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: SettingsScreen(),
        ),
      ),
    );

    await tester.pumpAndSettle();

    expect(find.text('TARIFLAR VA OBUNA'), findsOneWidget);
    expect(find.textContaining('Tariflar (30 kunlik bepul sinov)'), findsOneWidget);
  });
}
