import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mathcity_ai/features/games/screens/games_section.dart';
import 'package:mathcity_ai/features/games/games_hub_screen.dart';
import 'package:mathcity_ai/features/games/speed_math/speed_math_screen.dart';
import 'package:mathcity_ai/features/games/memory_cards/memory_cards_screen.dart';
import 'package:mathcity_ai/features/games/number_maze/number_maze_screen.dart';
import 'package:mathcity_ai/features/games/math_duel/math_duel_screen.dart';
import 'package:mathcity_ai/features/games/common/game_rules_dialog.dart';
import 'package:mathcity_ai/features/games/common/game_play_result_dialog.dart';

void main() {
  group('MathCity AI — Games Hub & 5 Games Integration Tests', () {
    testWidgets('1. GamesSection renders stylish single card matching Bugungi vazifalar style', (tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: Scaffold(
              body: GamesSection(),
            ),
          ),
        ),
      );

      expect(find.text('O‘yinlar'), findsOneWidget);
      expect(find.text('Math Games • Coin yig‘ing'), findsOneWidget);
      expect(find.text('+20 coin'), findsOneWidget);
      expect(find.byIcon(Icons.sports_esports_rounded), findsOneWidget);
      expect(find.byIcon(Icons.chevron_right_rounded), findsOneWidget);
    });

    testWidgets('2. GamesHubScreen renders 2-column grid with 5 Math games, limits and coin badge', (tester) async {
      tester.view.physicalSize = const Size(800, 1600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: GamesHubScreen(),
          ),
        ),
      );

      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300));

      expect(find.text('Math Games'), findsOneWidget);
      expect(find.text('O‘yna • Coin yig‘'), findsOneWidget);

      // Verify the 5 games are present
      expect(find.text('Arqon tortish'), findsOneWidget);
      expect(find.text('Tezkor hisob'), findsOneWidget);
      expect(find.text('Xotira kartalari'), findsOneWidget);
      expect(find.text('Raqamlar labirinti'), findsOneWidget);
      expect(find.text('Matematik duel'), findsOneWidget);

      // Verify limits and buttons
      expect(find.textContaining('Kunlik limit:'), findsWidgets);
      expect(find.textContaining('Boshlash'), findsWidgets);
    });

    testWidgets('3. GameRulesDialog modal renders rules, icon and start button cleanly', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Builder(
            builder: (ctx) => Scaffold(
              body: Center(
                child: ElevatedButton(
                  onPressed: () {
                    GameRulesDialog.show(
                      ctx,
                      title: 'Tezkor hisob',
                      description: '60 soniya ichida maksimal misol yeching!',
                      icon: Icons.timer_rounded,
                      gradient: const [Color(0xFF8B5CF6), Color(0xFF6D28D9)],
                      rules: const [
                        '60 soniya davomida berilgan misollarni tez va to‘g‘ri yeching.',
                        'To‘g‘ri javob +1 ball beradi.',
                      ],
                    );
                  },
                  child: const Text('Open Rules'),
                ),
              ),
            ),
          ),
        ),
      );

      await tester.tap(find.text('Open Rules'));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300));

      expect(find.text('Tezkor hisob'), findsOneWidget);
      expect(find.text('O‘YIN QOIDALARI'), findsOneWidget);
      expect(find.text('Boshlash'), findsOneWidget);
    });

    testWidgets('4. GamePlayResultDialog renders rewards and stats cleanly', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Builder(
            builder: (ctx) => Scaffold(
              body: Center(
                child: ElevatedButton(
                  onPressed: () {
                    GamePlayResultDialog.show(
                      ctx,
                      gameTitle: 'Tezkor hisob',
                      result: 'win',
                      score: 25,
                      coinsEarned: 20,
                      remainingPlays: 0,
                      isPro: false,
                      stats: [
                        {'label': 'Umumiy ball', 'value': '25 ball'},
                      ],
                      onPlayAgain: () {},
                      onGoHome: () {},
                    );
                  },
                  child: const Text('Open Result'),
                ),
              ),
            ),
          ),
        ),
      );

      await tester.tap(find.text('Open Result'));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300));

      expect(find.text('G‘alaba! 🏆'), findsOneWidget);
      expect(find.text('+20'), findsOneWidget);
      expect(find.text('Umumiy ball'), findsOneWidget);
      expect(find.text('Pro bilan cheksiz'), findsOneWidget);
    });

    testWidgets('5. SpeedMathScreen renders without overflow', (tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(home: SpeedMathScreen()),
        ),
      );
      await tester.pump(const Duration(milliseconds: 300));
      expect(tester.takeException(), isNull);
    });

    testWidgets('6. MemoryCardsScreen renders without overflow', (tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(home: MemoryCardsScreen()),
        ),
      );
      await tester.pump(const Duration(milliseconds: 300));
      expect(tester.takeException(), isNull);
    });

    testWidgets('7. NumberMazeScreen renders without overflow', (tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(home: NumberMazeScreen()),
        ),
      );
      await tester.pump(const Duration(milliseconds: 300));
      expect(tester.takeException(), isNull);
    });

    testWidgets('8. MathDuelScreen renders without overflow', (tester) async {
      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(home: MathDuelScreen()),
        ),
      );
      await tester.pump(const Duration(milliseconds: 300));
      expect(tester.takeException(), isNull);
    });
  });
}
