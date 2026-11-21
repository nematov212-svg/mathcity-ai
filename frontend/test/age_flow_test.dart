import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mathcity_ai/features/age_eligibility/access_denied_screen.dart';
import 'package:mathcity_ai/features/home/kids_home_screen.dart';
import 'package:mathcity_ai/features/home/teen_home_screen.dart';
import 'package:mathcity_ai/core/widgets/coin_badge.dart';

void main() {
  testWidgets('Access denied screen renders exact Uzbek message', (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: AccessDeniedScreen(),
      ),
    );

    expect(find.text('Yosh cheklovi'), findsOneWidget);
    expect(
      find.text('MathCity AI faqat 16 yoshgacha bo‘lgan o‘quvchilar uchun mo‘ljallangan. Afsuski, siz kira olmaysiz.'),
      findsOneWidget,
    );
    expect(find.text('Bosh sahifaga qaytish'), findsOneWidget);
  });

  testWidgets('CoinBadge displays yellow gold currency with official dollar coin (never stars)', (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: CoinBadge(count: 350),
        ),
      ),
    );

    expect(find.text('350'), findsOneWidget);
    expect(find.byType(CoinIcon), findsOneWidget);
    expect(find.byIcon(Icons.star), findsNothing);
  });

  testWidgets('Kids Home Screen displays personalized dashboard and features', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: KidsHomeScreen(),
        ),
      ),
    );

    expect(find.text('Misollar ishlash'), findsOneWidget);
    expect(find.text('Reyting'), findsOneWidget);
    expect(find.text('Kosmik hisob'), findsOneWidget);
    expect(find.text('AI Ustoz'), findsAtLeastNWidgets(1));
  });

  testWidgets('Teen Home Screen displays mature dark theme and high school math', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: TeenHomeScreen(),
        ),
      ),
    );

    expect(find.text('Kvadrat tenglamalar va Diskriminant'), findsOneWidget);
    expect(find.text('Ilmiy shahar'), findsOneWidget);
    expect(find.text('AI Ustoz'), findsAtLeastNWidgets(1));
  });
}
