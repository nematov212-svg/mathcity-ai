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

  testWidgets('ExerciseScreen renders 20-question session with instant choice evaluation', (WidgetTester tester) async {
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

    await tester.pump(const Duration(milliseconds: 200));

    // Step counter
    expect(find.text('Misol 1 / 20'), findsOneWidget);

    // Prompt statement
    expect(find.text('6 + 2 = ?'), findsOneWidget);

    // Coin badge exists
    expect(find.byType(CoinBadge), findsOneWidget);

    // Choices exist
    expect(find.text('8'), findsOneWidget);

    // Tap correct answer 8 to select it
    await tester.tap(find.text('8'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 150));

    // Tap Javobni tekshirish button
    await tester.tap(find.text('Javobni tekshirish'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    // Verify checkmark icon appears on correct option
    expect(find.byIcon(Icons.check_rounded), findsOneWidget);
    await tester.pump(const Duration(milliseconds: 1500));
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

  testWidgets('SettingsScreen includes ILOVA KO‘RINISHI VA REJIMI', (WidgetTester tester) async {
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

    expect(find.text('ILOVA KO‘RINISHI VA REJIMI'), findsOneWidget);
    expect(find.textContaining('Hisobdan chiqish'), findsOneWidget);
  });
}
