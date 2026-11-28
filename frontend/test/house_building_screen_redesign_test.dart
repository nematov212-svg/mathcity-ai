import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mathcity_ai/features/games/house_building_screen.dart';
import 'package:mathcity_ai/features/games/widgets/house_build_colors.dart';
import 'package:mathcity_ai/features/games/widgets/house_build_top_bar.dart';
import 'package:mathcity_ai/features/games/widgets/house_progress_card.dart';
import 'package:mathcity_ai/features/games/widgets/house_mode_chips.dart';
import 'package:mathcity_ai/features/games/widgets/house_stage_tile.dart';
import 'package:mathcity_ai/features/games/widgets/house_scene.dart';
import 'package:mathcity_ai/features/games/widgets/store_button.dart';

void main() {
  group('House Building Redesigned Widgets Unit Tests', () {
    testWidgets('HouseBuildTopBar displays title, 44x44 back button, coin & XP capsule',
        (tester) async {
      bool backPressed = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: HouseBuildTopBar(
              onBack: () => backPressed = true,
              coins: 350,
              xp: 1200,
            ),
          ),
        ),
      );

      expect(find.text('Uy qurish'), findsOneWidget);
      expect(find.text('350'), findsOneWidget);
      expect(find.text('1200'), findsOneWidget);

      final backButtonFinder = find.byIcon(Icons.arrow_back_ios_new_rounded);
      expect(backButtonFinder, findsOneWidget);

      await tester.tap(backButtonFinder);
      await tester.pumpAndSettle();
      expect(backPressed, isTrue);
    });

    testWidgets('HouseProgressCard renders 0/6 badge, stage name and animated progress bar',
        (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: HouseProgressCard(
              currentStage: 0,
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('0/6 bosqich'), findsOneWidget);
      expect(find.textContaining('Poydevor'), findsWidgets);
      expect(find.byIcon(Icons.home_work_rounded), findsOneWidget);
    });

    testWidgets('HouseModeChips renders all 4 mode chips and allows toggling',
        (tester) async {
      bool nightToggled = false;
      bool cameraReset = false;
      bool interiorToggled = false;
      bool muteToggled = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: HouseModeChips(
              isNightMode: false,
              isInteriorMode: false,
              isMuted: false,
              onToggleNightMode: () => nightToggled = true,
              onResetCamera: () => cameraReset = true,
              onToggleInteriorMode: () => interiorToggled = true,
              onToggleMute: () => muteToggled = true,
            ),
          ),
        ),
      );

      expect(find.text('Kun'), findsOneWidget);
      expect(find.text('Markaz'), findsOneWidget);
      expect(find.text('Ichki'), findsOneWidget);
      expect(find.text('Ovozli'), findsOneWidget);

      await tester.tap(find.text('Kun'));
      expect(nightToggled, isTrue);

      await tester.tap(find.text('Markaz'));
      expect(cameraReset, isTrue);

      await tester.tap(find.text('Ichki'));
      expect(interiorToggled, isTrue);

      await tester.tap(find.text('Ovozli'));
      expect(muteToggled, isTrue);
    });

    testWidgets('StoreButton triggers tap callback with scale animation',
        (tester) async {
      bool storeTapped = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: StoreButton(
              onTap: () => storeTapped = true,
            ),
          ),
        ),
      );

      expect(find.text('Qurilish do‘koni'), findsOneWidget);
      expect(find.byIcon(Icons.storefront_rounded), findsOneWidget);

      await tester.tap(find.text('Qurilish do‘koni'));
      await tester.pumpAndSettle();
      expect(storeTapped, isTrue);
    });

    testWidgets('HouseStageTile displays completed, in progress and locked states',
        (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Column(
              children: [
                HouseStageTile(
                  stage: kHouseStagesData[0],
                  status: HouseStageStatus.completed,
                ),
                HouseStageTile(
                  stage: kHouseStagesData[1],
                  status: HouseStageStatus.inProgress,
                ),
                HouseStageTile(
                  stage: kHouseStagesData[2],
                  status: HouseStageStatus.locked,
                ),
              ],
            ),
          ),
        ),
      );

      expect(find.text('Tayyor'), findsOneWidget);
      expect(find.text('Jarayonda'), findsOneWidget);
      expect(find.text('Qulflangan'), findsOneWidget);
    });
  });

  group('HouseBuildingScreen Full Screen & Responsiveness Tests', () {
    testWidgets('Renders properly without overflow on 360x640 screen (narrow mobile)',
        (tester) async {
      tester.view.physicalSize = const Size(360, 640);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: HouseBuildingScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Uy qurish'), findsWidgets);
      expect(find.text('Qurilish do‘koni'), findsOneWidget);
      expect(find.text('Poydevor qo‘yishdan boshlang!'), findsOneWidget);
      expect(find.text('90°'), findsOneWidget);
    });

    testWidgets('Renders properly on 430x932 screen (large mobile)',
        (tester) async {
      tester.view.physicalSize = const Size(430, 932);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: HouseBuildingScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Uy qurish'), findsWidgets);
      expect(find.text('Qurilish do‘koni'), findsOneWidget);
    });

    testWidgets('Supports Dark Mode and Light Mode cleanly', (tester) async {
      tester.view.physicalSize = const Size(400, 800);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      // Light mode
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            theme: ThemeData.light(),
            home: const HouseBuildingScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();
      expect(find.text('Uy qurish'), findsWidgets);

      // Dark mode
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            theme: ThemeData.dark(),
            home: const HouseBuildingScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();
      expect(find.text('Uy qurish'), findsWidgets);
    });

    testWidgets('Tapping Store Button opens the Store bottom sheet',
        (tester) async {
      tester.view.physicalSize = const Size(400, 800);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: HouseBuildingScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      final storeButton = find.text('Qurilish do‘koni');
      expect(storeButton, findsOneWidget);

      await tester.tap(storeButton);
      await tester.pumpAndSettle();

      expect(find.text('Qurilish katalogi'), findsOneWidget);
      expect(find.text('Poydevor'), findsWidgets);
      expect(find.text('Devorlar'), findsWidgets);
    });
  });
}
