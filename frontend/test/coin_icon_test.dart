import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mathcity_ai/core/widgets/coin_badge.dart';
import 'package:mathcity_ai/core/widgets/coin_icon.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group(r'MathCity AI — Global Golden Coin ($) Widget Tests', () {
    testWidgets('CoinIcon renders successfully across all requested size presets', (WidgetTester tester) async {
      const sizes = [16.0, 20.0, 24.0, 32.0, 48.0, 64.0];

      for (final size in sizes) {
        await tester.pumpWidget(
          MaterialApp(
            home: Scaffold(
              body: Center(
                child: CoinIcon(size: size),
              ),
            ),
          ),
        );

        expect(find.byType(CoinIcon), findsOneWidget);
        final imageFinder = find.byType(Image);
        expect(imageFinder, findsOneWidget);

        final imageWidget = tester.widget<Image>(imageFinder);
        expect(imageWidget.width, equals(size));
        expect(imageWidget.height, equals(size));
      }
    });

    testWidgets('CoinIcon handles floating, pop, and sparkle animations smoothly without crash', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Column(
              children: [
                CoinIcon(size: 24, floating: true),
                CoinIcon(size: 32, popOnAppear: true),
                CoinIcon(size: 48, sparkle: true),
              ],
            ),
          ),
        ),
      );

      expect(find.byType(CoinIcon), findsNWidgets(3));

      // Pump frames to verify animation ticks
      await tester.pump(const Duration(milliseconds: 250));
      await tester.pump(const Duration(milliseconds: 500));
      expect(find.byType(CoinIcon), findsNWidgets(3));
    });

    testWidgets('CoinBadge displays new CoinIcon and animated balance text', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: CoinBadge(count: 750, size: 28),
          ),
        ),
      );

      expect(find.byType(CoinBadge), findsOneWidget);
      expect(find.byType(CoinIcon), findsOneWidget);
      expect(find.text('750'), findsOneWidget);
    });

    testWidgets('CoinBadge respects reduced motion when animations are disabled', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MediaQuery(
          data: MediaQueryData(disableAnimations: true),
          child: MaterialApp(
            home: Scaffold(
              body: CoinBadge(count: 100, animate: true),
            ),
          ),
        ),
      );

      expect(find.text('100'), findsOneWidget);
      expect(find.byType(CoinIcon), findsOneWidget);
    });
  });
}
