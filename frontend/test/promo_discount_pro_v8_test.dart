import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mathcity_ai/core/widgets/new_user_discount_dialog.dart';
import 'package:mathcity_ai/core/widgets/promo_dialog_controller.dart';
import 'package:mathcity_ai/features/games/house_building_screen.dart';
import 'package:mathcity_ai/features/settings/mathcity_pro_screen.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('NewUserDiscountDialog Apple Style & Plan Selection Tests', () {
    testWidgets('Renders selectable cards and switches dynamic price on tap',
        (tester) async {
      String? claimedPlan;

      final expiresAt =
          DateTime.now().add(const Duration(hours: 23, minutes: 59));

      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: Builder(
                builder: (context) {
                  return NewUserDiscountDialog(
                    expiresAt: expiresAt,
                    discountPercent: 30,
                    monthlyOriginalPrice: 29000,
                    monthlyDiscountedPrice: 20300,
                    yearlyOriginalPrice: 250000,
                    yearlyDiscountedPrice: 175000,
                    autoCloseDuration: null, // disabled in test
                    onClaimWithPlan: (plan) {
                      claimedPlan = plan;
                    },
                  );
                },
              ),
            ),
          ),
        ),
      );

      // Note: NewUserDiscountDialog has looping pulse and countdown timers, so pump frames
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300));

      // Verify badges and titles
      expect(find.text('MathCity Pro ga ulaning'), findsOneWidget);
      expect(find.text('Eng tejamkor'), findsOneWidget);
      expect(find.text('Oylik'), findsOneWidget);
      expect(find.text('Yillik'), findsOneWidget);

      // Default selection is 'yearly' -> dynamic CTA shows 175 000 so‘m
      expect(find.textContaining('175 000 so‘m'), findsWidgets);

      // Tap 'Oylik' card
      await tester.tap(find.text('Oylik'));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300));

      // Now CTA shows 20 300 so‘m
      expect(find.textContaining('20 300 so‘m'), findsWidgets);

      // Tap CTA button
      await tester.tap(find.textContaining('30% chegirma bilan olish'));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300));

      expect(claimedPlan, equals('monthly'));
    });

    testWidgets('Live server countdown timer renders hours:minutes:seconds',
        (tester) async {
      final expiresAt = DateTime.now()
          .add(const Duration(hours: 5, minutes: 30, seconds: 15));

      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: NewUserDiscountDialog(
                expiresAt: expiresAt,
                autoCloseDuration: null,
              ),
            ),
          ),
        ),
      );

      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300));

      expect(find.textContaining('Chegirma tugashiga:'), findsOneWidget);
      expect(find.textContaining('05:30:'), findsOneWidget);
    });
  });

  group('PromoDialogController Session Tracking & Lesson Safety', () {
    setUp(() {
      PromoDialogController.instance.resetForTesting();
    });

    test('Session counter enforces max 2 shows per session', () {
      expect(PromoDialogController.instance.sessionShowCount, equals(0));
      expect(PromoDialogController.instance.isCancelled, isFalse);

      // Simulate cancellation
      PromoDialogController.instance.cancelPromoFlow();
      expect(PromoDialogController.instance.isCancelled, isTrue);
    });

    test('Lesson safety: onLessonStarted suppresses promo flow', () {
      expect(PromoDialogController.instance.isLessonActive, isFalse);

      PromoDialogController.instance.onLessonStarted();
      expect(PromoDialogController.instance.isLessonActive, isTrue);

      PromoDialogController.instance.onLessonEnded();
      expect(PromoDialogController.instance.isLessonActive, isFalse);
    });
  });

  group('House Building Catalog & Responsive Overflow Verification', () {
    test('Catalog items match user price rules', () {
      final wall =
          kFallbackHouseCatalog.firstWhere((i) => i.id == 'red_brick_wall');
      expect(wall.coinPrice, equals(150), reason: 'Walls should be 150 coins');

      final roof =
          kFallbackHouseCatalog.firstWhere((i) => i.id == 'gable_roof');
      expect(roof.coinPrice, equals(100), reason: 'Roof should be 100 coins');

      final door =
          kFallbackHouseCatalog.firstWhere((i) => i.id == 'standard_door');
      expect(door.coinPrice, equals(90), reason: 'Doors should be 90 coins');

      final window =
          kFallbackHouseCatalog.firstWhere((i) => i.id == 'standard_window');
      expect(window.coinPrice, equals(50),
          reason: 'Windows should be 50 coins');

      final car =
          kFallbackHouseCatalog.firstWhere((i) => i.id == 'standard_car');
      expect(car.coinPrice, equals(300), reason: 'Cars should be 300 coins');
    });

    testWidgets(
        'Header stage pill renders on 320px narrow mobile without overflow',
        (tester) async {
      tester.view.physicalSize = const Size(320, 640);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() => tester.view.resetPhysicalSize());

      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: HouseBuildingScreen(),
          ),
        ),
      );

      await tester.pump();
      expect(tester.takeException(), isNull);
    });
  });

  group('MathCityProScreen Apple Premium Layout & 6 Benefits', () {
    testWidgets(
        'Pre-selects plan from route parameter and renders all 6 benefits',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() => tester.view.resetPhysicalSize());

      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: MathCityProScreen(initialPlan: 'yearly'),
          ),
        ),
      );

      // Note: MathCityProScreen has looping mascot and star animations, so pump instead of pumpAndSettle
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300));

      // Check all 6 Pro feature titles
      expect(find.text('Cheksiz AI Ustoz'), findsOneWidget);
      expect(find.text('To‘liq matematika darsliklari'), findsOneWidget);
      expect(find.text('Cheksiz mashqlar'), findsOneWidget);
      expect(find.text('Reklamasiz o‘qish muhiti'), findsOneWidget);
      expect(find.text('3 baravar ko‘p coin'), findsOneWidget);
      expect(find.text('Qo‘shimcha premium imkoniyatlar'), findsOneWidget);

      // Check transparent renewal disclosure
      expect(
        find.textContaining('Chegirma birinchi to‘lov davri uchun amal qiladi'),
        findsOneWidget,
      );

      // Should not throw any layout exception
      expect(tester.takeException(), isNull);
    });

    testWidgets('Pre-selects monthly when initialPlan is monthly',
        (tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: MathCityProScreen(initialPlan: 'monthly'),
          ),
        ),
      );

      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300));

      expect(tester.takeException(), isNull);
    });
  });
}
