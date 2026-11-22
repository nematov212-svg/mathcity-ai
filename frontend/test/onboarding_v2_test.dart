import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mathcity_ai/features/onboarding/intro_screen.dart';
import 'package:mathcity_ai/features/onboarding/widgets/mode_card.dart';
import 'package:mathcity_ai/features/onboarding/widgets/primary_button.dart';

void main() {
  group('MathCity AI Onboarding Flow v2 Tests (Figma Match)', () {
    testWidgets('Screen 1 renders # badge, title, chips, suggestions, and input', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: IntroScreen(),
          ),
        ),
      );
      await tester.pump(const Duration(seconds: 1));

      // Header & Badge
      expect(find.text('1/3'), findsOneWidget);
      expect(find.text('#'), findsOneWidget);
      expect(find.text('MathCity AI’ga xush kelibsiz'), findsOneWidget);
      expect(find.text('Foydalanuvchi nomi'), findsOneWidget);

      // Chips & Suggestions
      expect(find.text('3–20 belgi'), findsOneWidget);
      expect(find.text('Lotin harflari'), findsOneWidget);
      expect(find.text('Raqamlar'), findsOneWidget);
      expect(find.text('Tavsiyalar'), findsOneWidget);
      expect(find.text('MathNinja'), findsOneWidget);
      expect(find.text('AlgebraStar'), findsOneWidget);
      expect(find.text('NumberKing'), findsOneWidget);

      // Tap suggestion to verify live check
      await tester.tap(find.text('MathNinja'));
      await tester.pump();
      expect(find.text('Bu nom bo‘sh'), findsOneWidget);

      // Action button
      expect(find.text('Davom etish'), findsOneWidget);
    });

    testWidgets('Step navigation 1 -> 2 -> 3 works seamlessly', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: IntroScreen(),
          ),
        ),
      );
      await tester.pump(const Duration(seconds: 1));

      // Tap suggestion to choose valid username
      await tester.tap(find.text('MathNinja'));
      await tester.pump();

      // Tap Davom etish to go to Step 2
      final davomBtn1 = find.widgetWithText(PrimaryButton, 'Davom etish').last;
      await tester.tap(davomBtn1);
      await tester.pumpAndSettle();

      // Step 2 Verification
      expect(find.text('2/3'), findsOneWidget);
      expect(find.text('Tug‘ilgan sanangizni kiriting'), findsOneWidget);
      expect(find.text('Kun'), findsOneWidget);
      expect(find.text('Oy'), findsOneWidget);
      expect(find.text('Yil'), findsOneWidget);
      expect(find.text('Tavsiya etilgan ta’lim rejimi'), findsOneWidget);
      expect(find.text('Bolalar rejimi'), findsOneWidget);
      expect(find.text('O‘smirlar rejimi'), findsOneWidget);
      expect(find.byType(ModeCard), findsNWidgets(2));

      // Open date picker and select default valid date
      await tester.tap(find.text('Kun'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Tayyor'));
      await tester.pumpAndSettle();

      // Tap Davom etish to go to Step 3
      final davomBtn2 = find.widgetWithText(PrimaryButton, 'Davom etish').last;
      await tester.tap(davomBtn2);
      await tester.pumpAndSettle();

      // Step 3 Verification
      expect(find.text('3/3'), findsOneWidget);
      expect(find.text('Hisobingiz tayyor'), findsOneWidget);
      expect(find.text('Foydalanuvchi'), findsOneWidget);
      expect(find.text('Yosh'), findsOneWidget);
      expect(find.text('Ta’lim rejimi'), findsOneWidget);
      expect(find.text('Boshlang‘ich balans'), findsOneWidget);
      expect(find.text('0 oltin tanga'), findsOneWidget);
      expect(find.text('Birinchi darsni tugating va birinchi oltin tangangizni oling.'), findsOneWidget);
      expect(find.text('Ro‘yxatdan o‘tish'), findsOneWidget);
    });

    testWidgets('Responsive Layout - IntroScreen does NOT overflow on 320px width', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(320, 568);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: IntroScreen(),
          ),
        ),
      );
      await tester.pump(const Duration(seconds: 1));

      expect(tester.takeException(), isNull);

      // Navigate to Step 2 at 320px width
      final davomBtn1 = find.widgetWithText(PrimaryButton, 'Davom etish').last;
      await tester.ensureVisible(davomBtn1);
      await tester.tap(davomBtn1);
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 500));
      expect(tester.takeException(), isNull);

      // Navigate to Step 3 at 320px width
      final davomBtn2 = find.widgetWithText(PrimaryButton, 'Davom etish').last;
      await tester.ensureVisible(davomBtn2);
      await tester.tap(davomBtn2);
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 500));
      expect(tester.takeException(), isNull);
    });
  });
}
