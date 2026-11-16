import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mathcity_ai/core/auth/auth_service.dart';
import 'package:mathcity_ai/features/home/kids_home_screen.dart';
import 'package:mathcity_ai/features/home/teen_home_screen.dart';
import 'package:mathcity_ai/features/onboarding/welcome_screen.dart';
import 'package:mathcity_ai/features/settings/settings_screen.dart';
import 'package:mathcity_ai/features/city/city_screen.dart';
import 'package:mathcity_ai/shared/providers/student_provider.dart';

void main() {
  group('1. Google Sign-In Resiliency (Error A Recovery)', () {
    test('AuthService initializes safely without throwing uncaught assertions', () {
      final authService = AuthService();
      expect(authService, isNotNull);
      expect(authService.isGoogleSignInAvailable, isTrue);
    });

    testWidgets('WelcomeScreen renders without crashing on missing Google OAuth', (tester) async {


      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            
            home: WelcomeScreen(),

          ),

        ),

      );


      await tester.pump(const Duration(milliseconds: 300));

      expect(find.text('Google bilan davom etish'), findsOneWidget);
    });
  });

  group('2. Responsive Layout & RenderFlex Overflow Regression Tests', () {
    final testWidths = [320.0, 360.0, 390.0, 768.0, 1024.0];

    for (final width in testWidths) {
      testWidgets('KidsHomeScreen does NOT overflow at width: $width', (tester) async {
        tester.view.physicalSize = Size(width, 800);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(tester.view.resetPhysicalSize);

        await tester.pumpWidget(
          const ProviderScope(
            child: MaterialApp(
              home: KidsHomeScreen(),
            ),
          ),
        );
        await tester.pump(const Duration(milliseconds: 300));

        // Verify top bar and coin badge exist without overflow
        expect(find.byType(KidsHomeScreen), findsOneWidget);
        expect(tester.takeException(), isNull);
      });

      testWidgets('TeenHomeScreen does NOT overflow at width: $width', (tester) async {
        tester.view.physicalSize = Size(width, 800);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(tester.view.resetPhysicalSize);

        await tester.pumpWidget(
          const ProviderScope(
            child: MaterialApp(
              home: TeenHomeScreen(),
            ),
          ),
        );
        await tester.pump(const Duration(milliseconds: 300));

        expect(find.byType(TeenHomeScreen), findsOneWidget);
        expect(tester.takeException(), isNull);
      });
    }
  });

  group('3. ListTile Material Ancestry Assertion Verification', () {
    testWidgets('SettingsScreen ListTiles and SwitchListTiles render without Material assertions', (tester) async {
      tester.view.physicalSize = const Size(390, 1000);
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

      expect(find.text('Tovush effektlari'), findsOneWidget);
      expect(find.text('Animatsiyalar'), findsOneWidget);
      expect(find.text('O‘quv ma’lumotlarini yuklab olish'), findsOneWidget);
      expect(tester.takeException(), isNull);
    });
  });

  group('4. Coin Economy and 100-Coin Building Purchase', () {
    testWidgets('Student begins with 100 coins and purchases 100-coin building down to 0', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final notifier = container.read(studentProvider.notifier);
      expect(container.read(studentProvider).student?.coinBalance, 100);

      // Execute 100-coin building purchase
      final success = await notifier.purchaseBuilding('house_basic', 0, 0);
      expect(success, isTrue);
      expect(container.read(studentProvider).student?.coinBalance, 0);

      // Attempt second purchase with 0 balance: must fail
      final secondSuccess = await notifier.purchaseBuilding('school_math', 1, 0);
      expect(secondSuccess, isFalse);
      expect(container.read(studentProvider).student?.coinBalance, 0);
    });

    testWidgets('Submit answer adds exactly 1 coin to student balance', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final notifier = container.read(studentProvider.notifier);
      final initialCoins = container.read(studentProvider).student?.coinBalance ?? 100;

      final result = await notifier.submitAnswer('q-math-01', '20');
      expect(result['isCorrect'], isTrue);
      expect(result['coinsAwarded'], 1);
      expect(container.read(studentProvider).student?.coinBalance, initialCoins + 1);
    });
  });
}
