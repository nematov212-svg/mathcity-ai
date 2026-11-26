import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mathcity_ai/features/auth/complete_profile_screen.dart';
import 'package:mathcity_ai/core/widgets/custom_button.dart';
import 'package:mathcity_ai/core/widgets/mathcity_logo.dart';

void main() {
  group('MathCity AI Complete Profile Screen Tests', () {
    testWidgets(
        'CompleteProfileScreen renders header, username field, date selectors, and initial age badge',
        (WidgetTester tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: CompleteProfileScreen(),
          ),
        ),
      );
      await tester.pump(const Duration(milliseconds: 200));

      // Verify header
      expect(find.byType(MathCityLogo), findsOneWidget);
      expect(find.text('Profilni to‘ldiring'), findsOneWidget);

      // Verify username input
      expect(find.text('Foydalanuvchi nomi (Username)'), findsOneWidget);
      expect(find.byType(TextField), findsOneWidget);

      // Verify date selectors
      expect(find.text('Tug‘ilgan sana'), findsOneWidget);
      expect(find.byType(DropdownButtonFormField<int>), findsNWidgets(3));

      // Verify action button
      expect(find.text('Davom etish'), findsOneWidget);
      expect(find.byType(CustomButton), findsOneWidget);
    });

    testWidgets(
        'Validates username input rules: too short error and invalid character warnings',
        (WidgetTester tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: CompleteProfileScreen(),
          ),
        ),
      );
      await tester.pump(const Duration(milliseconds: 200));

      final usernameField = find.byType(TextField);

      // Enter short username (2 chars)
      await tester.enterText(usernameField, 'ab');
      await tester.pump(const Duration(milliseconds: 100));
      expect(
          find.text(
              'Foydalanuvchi nomi 3 dan 20 tagacha belgidan iborat bo‘lishi kerak.'),
          findsOneWidget);

      // Enter invalid character (e.g. space)
      await tester.enterText(usernameField, 'user name');
      await tester.pump(const Duration(milliseconds: 100));
      expect(
          find.text(
              'Faqat lotin harflari, raqamlar va pastki chiziq ruxsat etiladi.'),
          findsOneWidget);
    });

    testWidgets(
        'Displays COPPA parental advisory when calculated age is under 13',
        (WidgetTester tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: CompleteProfileScreen(),
          ),
        ),
      );
      await tester.pump(const Duration(milliseconds: 200));

      // Default age in initState is 11 (< 13)
      expect(find.text('Ota-onalar bilan birgalikda'), findsOneWidget);
      expect(find.textContaining('bolalar xavfsizligi'), findsOneWidget);
      expect(find.byType(Checkbox), findsOneWidget);
    });
  });
}
