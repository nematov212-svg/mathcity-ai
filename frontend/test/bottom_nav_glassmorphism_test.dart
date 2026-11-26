import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mathcity_ai/core/widgets/mathcity_bottom_nav.dart';
import 'package:mathcity_ai/core/widgets/kids_shell_layout.dart';

void main() {
  group('MathCity AI — Glassmorphic Bottom Navigation & Shell Tests', () {
    testWidgets(
        '1. MathCityBottomNav renders all 5 primary tabs with equal width',
        (WidgetTester tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            bottomNavigationBar: MathCityBottomNav(currentIndex: 0),
          ),
        ),
      );
      await tester.pumpAndSettle();

      // Check all 5 labels
      expect(find.text('Asosiy'), findsOneWidget);
      expect(find.text('Darslar'), findsOneWidget);
      expect(find.text('AI Ustoz'), findsOneWidget);
      expect(find.text('Reyting'), findsOneWidget);
      expect(find.text('Profil'), findsOneWidget);

      // Check all 5 icons
      expect(find.byIcon(Icons.home_rounded), findsOneWidget);
      expect(find.byIcon(Icons.menu_book_rounded), findsOneWidget);
      expect(find.byIcon(Icons.smart_toy_rounded), findsOneWidget);
      expect(find.byIcon(Icons.leaderboard_rounded), findsOneWidget);
      expect(find.byIcon(Icons.person_rounded), findsOneWidget);

      // Check BackdropFilter glassmorphism
      expect(find.byType(BackdropFilter), findsOneWidget);
    });

    testWidgets(
        '2. Tab switching in persistent KidsShellLayout keeps MathCityBottomNav mounted',
        (WidgetTester tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final router = GoRouter(
        initialLocation: '/kids/home',
        routes: [
          ShellRoute(
            builder: (context, state, child) => KidsShellLayout(child: child),
            routes: [
              GoRoute(
                path: '/kids/home',
                builder: (context, state) => const Text('CONTENT_ASOSIY'),
              ),
              GoRoute(
                path: '/kids/lessons',
                builder: (context, state) => const Text('CONTENT_DARSLAR'),
              ),
              GoRoute(
                path: '/kids/ai-tutor',
                builder: (context, state) => const Text('CONTENT_AI_USTOZ'),
              ),
              GoRoute(
                path: '/kids/leaderboard',
                builder: (context, state) => const Text('CONTENT_RETYING'),
              ),
              GoRoute(
                path: '/kids/profile',
                builder: (context, state) => const Text('CONTENT_PROFIL'),
              ),
            ],
          ),
        ],
      );

      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp.router(
            routerConfig: router,
          ),
        ),
      );
      await tester.pumpAndSettle();

      // 1. Initial tab: Asosiy
      expect(find.text('CONTENT_ASOSIY'), findsOneWidget);
      expect(find.byType(MathCityBottomNav), findsOneWidget);

      // 2. Switch to Darslar
      await tester.tap(find.text('Darslar'));
      await tester.pumpAndSettle();
      expect(find.text('CONTENT_DARSLAR'), findsOneWidget);
      expect(find.byType(MathCityBottomNav), findsOneWidget);

      // 3. Switch to AI Ustoz
      await tester.tap(find.text('AI Ustoz'));
      await tester.pumpAndSettle();
      expect(find.text('CONTENT_AI_USTOZ'), findsOneWidget);
      expect(find.byType(MathCityBottomNav), findsOneWidget);

      // 4. Switch to Reyting
      await tester.tap(find.text('Reyting'));
      await tester.pumpAndSettle();
      expect(find.text('CONTENT_RETYING'), findsOneWidget);
      expect(find.byType(MathCityBottomNav), findsOneWidget);

      // 5. Switch to Profil
      await tester.tap(find.text('Profil'));
      await tester.pumpAndSettle();
      expect(find.text('CONTENT_PROFIL'), findsOneWidget);
      expect(find.byType(MathCityBottomNav), findsOneWidget);

      // 6. Switch back to Asosiy
      await tester.tap(find.text('Asosiy'));
      await tester.pumpAndSettle();
      expect(find.text('CONTENT_ASOSIY'), findsOneWidget);
      expect(find.byType(MathCityBottomNav), findsOneWidget);
    });

    testWidgets(
        '3. Responsive behavior: 360px and 390px widths render without overflow',
        (WidgetTester tester) async {
      for (final width in [360.0, 390.0, 430.0]) {
        tester.view.physicalSize = Size(width, 700);
        tester.view.devicePixelRatio = 1.0;

        await tester.pumpWidget(
          const MaterialApp(
            home: Scaffold(
              bottomNavigationBar: MathCityBottomNav(currentIndex: 2),
            ),
          ),
        );
        await tester.pumpAndSettle();

        expect(tester.takeException(), isNull);
      }
    });
  });
}
