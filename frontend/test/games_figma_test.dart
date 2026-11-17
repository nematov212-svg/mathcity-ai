import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mathcity_ai/features/games/games_hub_screen.dart';
import 'package:mathcity_ai/features/games/space_math_game_screen.dart';
import 'package:mathcity_ai/features/games/fraction_battle_game_screen.dart';
import 'package:mathcity_ai/features/games/game_result_screen.dart';

void main() {
  testWidgets('GamesHubScreen renders Figma design elements correctly', (tester) async {
    tester.view.physicalSize = const Size(800, 1400);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: GamesHubScreen(),
        ),
      ),
    );

    expect(find.text('O‘yinlar'), findsWidgets);
    expect(find.text('O‘YNA • O‘RGAN • YUT'), findsOneWidget);
    expect(find.text('Matematika\no‘yinlari'), findsOneWidget);
    expect(find.text('O‘yinni tanlang'), findsOneWidget);
    expect(find.text('Barchasi'), findsOneWidget);
    expect(find.text('Oson'), findsOneWidget);
    expect(find.text('O‘rta'), findsOneWidget);
    expect(find.text('Kosmik hisob'), findsOneWidget);
    expect(find.text('Kasrlar jangi'), findsOneWidget);
    expect(find.text('+30 oltin tanga'), findsOneWidget);
    expect(find.text('+40 oltin tanga'), findsOneWidget);
  });

  testWidgets('SpaceMathGameScreen renders cosmic card and answer grid', (tester) async {
    tester.view.physicalSize = const Size(800, 1400);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: SpaceMathGameScreen(),
        ),
      ),
    );

    expect(find.text('Kosmik hisob'), findsWidgets);
    expect(find.text('Raketamizga kuch bering!'), findsOneWidget);
    expect(find.text('Javobni tanlang'), findsOneWidget);
    expect(find.textContaining('Yordam olish'), findsOneWidget);
  });

  testWidgets('FractionBattleGameScreen renders fraction cards and operator buttons', (tester) async {
    tester.view.physicalSize = const Size(800, 1400);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: FractionBattleGameScreen(),
        ),
      ),
    );

    expect(find.text('Kasrlar jangi'), findsWidgets);
    expect(find.text('Qaysi kasr\nkattaroq?'), findsOneWidget);
    expect(find.text('To‘g‘ri belgini tanlang'), findsOneWidget);
    expect(find.text('<'), findsOneWidget);
    expect(find.text('='), findsOneWidget);
    expect(find.text('>'), findsOneWidget);
  });

  testWidgets('GameResultScreen renders celebration and reward banner', (tester) async {
    tester.view.physicalSize = const Size(800, 1400);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: GameResultScreen(),
        ),
      ),
    );

    expect(find.text('Natija'), findsWidgets);
    expect(find.text('Ajoyib natija!'), findsOneWidget);
    expect(find.text('+70 oltin tanga'), findsOneWidget);
    expect(find.text('Savollar'), findsOneWidget);
    expect(find.text('To‘g‘ri'), findsOneWidget);
    expect(find.text('Aniqllik'), findsOneWidget);
    expect(find.textContaining('Yana o‘ynash'), findsOneWidget);
    expect(find.text('O‘yinlar markaziga qaytish'), findsOneWidget);
  });
}
