import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mathcity_ai/features/games/logic/tug_of_war_controller.dart';
import 'package:mathcity_ai/features/games/models/game_config.dart';
import 'package:mathcity_ai/features/games/screens/games_section.dart';
import 'package:mathcity_ai/features/games/screens/game_setup_sheet.dart';
import 'package:mathcity_ai/features/games/screens/game_result_dialog.dart';
import 'package:mathcity_ai/features/games/screens/tug_of_war_screen.dart';
import 'package:mathcity_ai/features/home/kids_home_screen.dart';

void main() {
  group('GamesSection & Home Screen Integration Tests', () {
    testWidgets('GamesSection renders "O‘yinlar", badge and "Arqon tortish" card',
        (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: SingleChildScrollView(
              child: GamesSection(),
            ),
          ),
        ),
      );

      expect(find.text('O‘yinlar'), findsOneWidget);
      expect(find.text('Tez orada ko‘proq'), findsOneWidget);
      expect(find.text('Arqon tortish'), findsOneWidget);
      expect(find.text('Ro‘yxatdan o‘tmasdan'), findsOneWidget);
      expect(find.text('Boshlash'), findsOneWidget);
    });

    testWidgets('KidsHomeScreen displays GamesSection below Bugungi vazifalar',
        (tester) async {
      tester.view.physicalSize = const Size(400, 1600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: KidsHomeScreen(),
          ),
        ),
      );
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300));

      expect(find.text('Bugungi vazifalar'), findsOneWidget);
      expect(find.text('O‘yinlar'), findsOneWidget);
      expect(find.text('Arqon tortish'), findsOneWidget);
    });
  });

  group('GameSetupSheet Wizard 4-Step Tests', () {
    testWidgets('Wizard steps through Time -> Operations -> Range -> Teams',
        (tester) async {
      GameConfig? selectedConfig;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: GameSetupSheet(
              onStartGame: (cfg) => selectedConfig = cfg,
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      // Step 1: Vaqt
      expect(find.text('Jamoalarni tayyorlash'), findsOneWidget);
      expect(find.text('O‘yin vaqti'), findsOneWidget);
      expect(find.text('1 daqiqa'), findsOneWidget);
      expect(find.text('Cheksiz (∞)'), findsOneWidget);

      // Tap Next to Step 2
      await tester.tap(find.text('Keyingi →'));
      await tester.pumpAndSettle();

      // Step 2: Amallar
      expect(find.text('Amallar'), findsWidgets);
      expect(find.textContaining('Qo‘shish'), findsWidgets);
      expect(find.textContaining('Ayirish'), findsWidgets);

      // Tap Next to Step 3
      await tester.tap(find.text('Keyingi →'));
      await tester.pumpAndSettle();

      // Step 3: Sonlar
      expect(find.text('Sonlar xonasini tanlang'), findsOneWidget);
      expect(find.text('0–9'), findsOneWidget);

      // Tap Next to Step 4
      await tester.tap(find.text('Keyingi →'));
      await tester.pumpAndSettle();

      // Step 4: Jamoalar
      expect(find.text('Jamoalar nomini kiriting'), findsOneWidget);
      expect(find.text('1-jamoa'), findsOneWidget);
      expect(find.text('2-jamoa'), findsOneWidget);
      expect(find.text('VS'), findsOneWidget);

      // Tap "Boshlash"
      await tester.tap(find.text('Boshlash'));
      await tester.pumpAndSettle();

      expect(selectedConfig, isNotNull);
      expect(selectedConfig!.team1Name, equals('Ko‘k jamoa'));
      expect(selectedConfig!.team2Name, equals('Qizil jamoa'));
    });
  });

  group('TugOfWarScreen Layout & Responsiveness Tests', () {
    testWidgets('TugOfWarScreen renders cleanly on 360x640 (narrow mobile) without overflow',
        (tester) async {
      tester.view.physicalSize = const Size(360, 640);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        const MaterialApp(
          home: TugOfWarScreen(
            config: GameConfig(durationMinutes: null),
          ),
        ),
      );
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300));

      expect(find.text('MathCity'), findsOneWidget);
      expect(find.textContaining('KO‘K JAMOA'), findsOneWidget);
      expect(find.textContaining('QIZIL JAMOA'), findsOneWidget);
      expect(find.text('Javob kiriting'), findsNWidgets(2));
      expect(tester.takeException(), isNull);
    });

    testWidgets('TugOfWarScreen renders cleanly on 430x932 (large mobile)',
        (tester) async {
      tester.view.physicalSize = const Size(430, 932);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        const MaterialApp(
          home: TugOfWarScreen(
            config: GameConfig(durationMinutes: null),
          ),
        ),
      );
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300));

      expect(find.text('MathCity'), findsOneWidget);
      expect(tester.takeException(), isNull);
    });

    testWidgets('TugOfWarScreen supports Dark Mode and Light Mode cleanly',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      // Light mode
      await tester.pumpWidget(
        MaterialApp(
          theme: ThemeData.light(),
          home: const TugOfWarScreen(
            config: GameConfig(durationMinutes: null),
          ),
        ),
      );
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300));
      expect(find.text('MathCity'), findsOneWidget);
      expect(tester.takeException(), isNull);

      // Dark mode
      await tester.pumpWidget(
        MaterialApp(
          theme: ThemeData.dark(),
          home: const TugOfWarScreen(
            config: GameConfig(durationMinutes: null),
          ),
        ),
      );
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300));
      expect(find.text('MathCity'), findsOneWidget);
      expect(tester.takeException(), isNull);
    });

    testWidgets('GameResultDialog displays trophy, winner and restart buttons',
        (tester) async {
      final controller = TugOfWarController(
        config: const GameConfig(durationMinutes: 1),
      );
      final dummyResult = GameResult(
        winner: controller.team1,
        isDraw: false,
        team1: controller.team1..score = 8,
        team2: controller.team2..score = 4,
        durationSeconds: 60,
      );

      bool playAgainTapped = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: GameResultDialog(
              result: dummyResult,
              onPlayAgain: () => playAgainTapped = true,
              onChangeSettings: () {},
              onGoHome: () {},
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.textContaining('G‘olib: Ko‘k jamoa!'), findsOneWidget);
      expect(find.text('8 ball'), findsOneWidget);
      expect(find.text('4 ball'), findsOneWidget);
      expect(find.text('Qayta o‘ynash'), findsOneWidget);
      expect(find.text('Sozlamalarni o‘zgartirish'), findsOneWidget);
      expect(find.text('Bosh sahifa'), findsOneWidget);

      await tester.tap(find.text('Qayta o‘ynash'));
      expect(playAgainTapped, isTrue);

      controller.dispose();
    });
  });
}
