import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mathcity_ai/features/auth/login_screen.dart';
import 'package:mathcity_ai/features/auth/register_screen.dart';
import 'package:mathcity_ai/features/auth/forgot_password_screen.dart';
import 'package:mathcity_ai/core/widgets/mathcity_logo.dart';

void main() {
  group('MathCity AI Authentication System Tests', () {
    testWidgets('Test 1 & 8: LoginScreen renders all UI elements, inputs, social buttons, and toggle works', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: LoginScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      // Header verification
      expect(find.byType(MathCityLogo), findsOneWidget);
      expect(find.text('Yana xush kelibsiz!'), findsOneWidget);
      expect(find.text('Shahringizdagi sarguzashtni davom ettiring.'), findsOneWidget);

      // Form labels and placeholders
      expect(find.text('Login yoki email'), findsOneWidget);
      expect(find.text('Login yoki emailingizni kiriting'), findsOneWidget);
      expect(find.text('Parol'), findsOneWidget);
      expect(find.text('Parolingizni kiriting'), findsOneWidget);
      expect(find.text('Parolni unutdingizmi?'), findsOneWidget);

      // Action button
      expect(find.text('Kirish'), findsOneWidget);

      // Divider & Social logins
      expect(find.text('yoki davom eting'), findsOneWidget);
      expect(find.text('Continue with Google'), findsOneWidget);
      expect(find.text('Apple orqali davom etish'), findsNothing);

      // Bottom link
      expect(find.text('Hisobingiz yo‘qmi? '), findsOneWidget);
      expect(find.text('Ro‘yxatdan o‘tish'), findsOneWidget);

      // Test Password visibility toggle (Test 8)
      expect(find.byIcon(Icons.visibility_off_outlined), findsOneWidget);
      await tester.tap(find.byIcon(Icons.visibility_off_outlined));
      await tester.pumpAndSettle();
      expect(find.byIcon(Icons.visibility_outlined), findsOneWidget);
    });

    testWidgets('Test 2 & 4: RegisterScreen renders all 4 fields, helper text, and validates password mismatch', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: RegisterScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      // Header verification
      expect(find.byType(MathCityLogo), findsOneWidget);
      expect(find.text('Yangi hisob yarating'), findsOneWidget);
      expect(find.text('O‘rganing, tangalar yig‘ing va shahringizni quring.'), findsOneWidget);

      // 4 Required fields
      expect(find.text('Ismingiz'), findsOneWidget);
      expect(find.text('Ismingizni kiriting'), findsOneWidget);
      expect(find.text('Login yoki email'), findsOneWidget);
      expect(find.text('Login yoki emailingizni kiriting'), findsOneWidget);
      expect(find.text('Parol'), findsOneWidget);
      expect(find.text('Yangi parol yarating'), findsOneWidget);
      expect(find.text('Parolni tasdiqlang'), findsOneWidget);
      expect(find.text('Parolni qayta kiriting'), findsOneWidget);

      // Helper text
      expect(find.text('Parol kamida 8 ta belgidan iborat bo‘lsin.'), findsOneWidget);
      expect(find.text('Hisob yaratish'), findsOneWidget);
      expect(find.text('Hisobingiz bormi? '), findsOneWidget);
      expect(find.text('Kirish'), findsOneWidget);

      // Fill in mismatching passwords
      final nameField = find.widgetWithText(TextFormField, 'Ismingizni kiriting');
      final loginField = find.widgetWithText(TextFormField, 'Login yoki emailingizni kiriting');
      final passField = find.widgetWithText(TextFormField, 'Yangi parol yarating');
      final confirmField = find.widgetWithText(TextFormField, 'Parolni qayta kiriting');

      await tester.enterText(nameField, 'Dilshod');
      await tester.enterText(loginField, 'dilshod99');
      await tester.enterText(passField, 'Password123');
      await tester.enterText(confirmField, 'DifferentPass123');
      await tester.pump();

      // Tap Create Account
      await tester.tap(find.text('Hisob yaratish'));
      await tester.pumpAndSettle();

      // Verify clear mismatch error
      expect(find.text('Parollar bir xil emas.'), findsOneWidget);
    });

    testWidgets('Test 9: ForgotPasswordScreen renders step-by-step recovery UI', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: ForgotPasswordScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Parolni unutdingizmi?'), findsOneWidget);
      expect(find.text('Tiklash kodini olish'), findsOneWidget);
      expect(find.text('Kirish oynasiga qaytish'), findsOneWidget);
    });

    testWidgets('Test 14a: Responsive Layout - LoginScreen does not overflow on 320px width', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(320, 568);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: LoginScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      final err = tester.takeException();
      if (err != null) {
        debugPrint('LOGIN ERROR: $err');
      }
      expect(err, isNull);
    });

    testWidgets('Test 14b: Responsive Layout - RegisterScreen does not overflow on 320px width', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(320, 568);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: RegisterScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      final err = tester.takeException();
      expect(err, isNull);
    });
  });
}
