import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mathcity_ai/features/games/house_building_screen.dart'
    hide StoreCategory;
import 'package:mathcity_ai/features/games/models/store_item.dart';
import 'package:mathcity_ai/features/games/screens/games_section.dart';
import 'package:mathcity_ai/features/games/widgets/house_bottom_bar.dart';
import 'package:mathcity_ai/features/games/widgets/house_progress_card.dart';
import 'package:mathcity_ai/features/games/widgets/house_scene_view.dart';
import 'package:mathcity_ai/features/games/widgets/store_category_tabs.dart';
import 'package:mathcity_ai/features/games/widgets/store_item_card.dart';

void main() {
  group('HouseSceneView & Floating Controls Unit Tests', () {
    testWidgets('Renders 3D container, floating mode chips and 90 degree rotate button',
        (tester) async {
      bool rotated = false;
      bool nightToggled = false;
      bool cameraReset = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: SizedBox(
              width: 380,
              height: 480,
              child: HouseSceneView(
                game3DView: const Center(child: Text('3D Canvas Mock')),
                isNightMode: false,
                isInteriorMode: false,
                isMuted: false,
                onboardingTooltip: '3D uyni aylantirish uchun barmog‘ingiz bilan suring',
                celebrationBadge: 'Poydevor qurildi! ✨',
                onToggleNightMode: () => nightToggled = true,
                onResetCamera: () => cameraReset = true,
                onToggleInteriorMode: () {},
                onToggleMute: () {},
                onRotate90: () => rotated = true,
                onDismissTooltip: () {},
              ),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('3D Canvas Mock'), findsOneWidget);
      expect(find.text('Kun'), findsOneWidget);
      expect(find.text('Markaz'), findsOneWidget);
      expect(find.text('Ichki'), findsOneWidget);
      expect(find.text('Ovozli'), findsOneWidget);
      expect(find.text('90°'), findsOneWidget);
      expect(find.text('Poydevor qurildi! ✨'), findsOneWidget);
      expect(
          find.text('3D uyni aylantirish uchun barmog‘ingiz bilan suring'),
          findsOneWidget);

      await tester.tap(find.text('90°'));
      expect(rotated, isTrue);

      await tester.tap(find.text('Kun'));
      expect(nightToggled, isTrue);

      await tester.tap(find.text('Markaz'));
      expect(cameraReset, isTrue);
    });
  });

  group('HouseBottomBar Unit Tests', () {
    testWidgets('Renders affordable stage button and triggers onBuildNextStage',
        (tester) async {
      bool buildTriggered = false;
      bool storeTriggered = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Padding(
              padding: const EdgeInsets.all(16),
              child: HouseBottomBar(
                currentStage: 0,
                userCoins: 100,
                isBuilding: false,
                onBuildNextStage: () => buildTriggered = true,
                onOpenStore: () => storeTriggered = true,
              ),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Qurish • 50 coin'), findsOneWidget);
      expect(find.byIcon(Icons.construction_rounded), findsOneWidget);
      expect(find.byIcon(Icons.storefront_rounded), findsOneWidget);

      await tester.tap(find.text('Qurish • 50 coin'));
      expect(buildTriggered, isTrue);

      await tester.tap(find.byIcon(Icons.storefront_rounded));
      expect(storeTriggered, isTrue);
    });

    testWidgets('Displays insufficient coins state and "Misol yechib coin top" link',
        (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Padding(
              padding: const EdgeInsets.all(16),
              child: HouseBottomBar(
                currentStage: 1, // stage 1 costs 120 coins
                userCoins: 20,   // user has only 20 coins
                isBuilding: false,
                onBuildNextStage: () {},
                onOpenStore: () {},
              ),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Coin yetmaydi • 120 coin'), findsOneWidget);
      expect(find.text('Misol yechib coin top →'), findsOneWidget);
    });

    testWidgets('Displays completion badge when stage is 6', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Padding(
              padding: const EdgeInsets.all(16),
              child: HouseBottomBar(
                currentStage: 6,
                userCoins: 500,
                isBuilding: false,
                onBuildNextStage: () {},
                onOpenStore: () {},
              ),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Uy to‘liq qurildi! 🏆'), findsOneWidget);
    });
  });

  group('StoreSheet & StoreItemCard Unit Tests', () {
    testWidgets('StoreCategoryTabs displays all categories and selects active',
        (tester) async {
      tester.view.physicalSize = const Size(1000, 200);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      StoreCategory selected = StoreCategory.all;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: StoreCategoryTabs(
              selectedCategory: selected,
              onSelectCategory: (cat) => selected = cat,
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Hammasi'), findsOneWidget);
      expect(find.text('Materiallar'), findsOneWidget);
      expect(find.text('Devor'), findsOneWidget);
      expect(find.text('Tom'), findsOneWidget);
      expect(find.text('Eshik-Deraza'), findsOneWidget);
      expect(find.text('Mebel'), findsOneWidget);
      expect(find.text('Hovli'), findsOneWidget);
      expect(find.text('Bezak'), findsOneWidget);

      await tester.tap(find.text('Devor'));
      expect(selected, equals(StoreCategory.walls));
    });

    testWidgets('StoreItemCard renders item title, price, and responds to buy tap',
        (tester) async {
      bool buyTapped = false;

      final testItem = kDefaultStoreCatalog.first;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: SizedBox(
              width: 170,
              height: 220,
              child: StoreItemCard(
                item: testItem,
                userCoins: 200,
                currentStage: 2,
                onTap: () {},
                onBuy: () => buyTapped = true,
              ),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text(testItem.name), findsOneWidget);
      expect(find.text('${testItem.price}'), findsOneWidget);
      expect(find.text('Olish'), findsOneWidget);

      await tester.tap(find.text('Olish'));
      expect(buyTapped, isTrue);
    });
  });

  group('GamesSection Snap Carousel Tests', () {
    testWidgets('GamesSection displays snap carousel with locked teaser cards',
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
      await tester.pumpAndSettle();

      expect(find.text('O‘yinlar'), findsOneWidget);
      expect(find.text('Tez orada ko‘proq'), findsOneWidget);
      expect(find.text('Arqon tortish'), findsOneWidget);
      expect(find.text('Ro‘yxatdan o‘tmasdan'), findsOneWidget);
      expect(find.text('Boshlash'), findsOneWidget);
    });
  });

  group('Multi-Device Responsive Screen Tests', () {
    final screenSizes = [
      const Size(320, 568), // iPhone SE 1st gen
      const Size(360, 640), // Compact Android
      const Size(390, 844), // iPhone 13/14
      const Size(430, 932), // iPhone Pro Max
      const Size(768, 1024), // iPad Tablet
    ];

    for (final size in screenSizes) {
      testWidgets('HouseBuildingScreen renders cleanly on ${size.width}x${size.height}',
          (tester) async {
        tester.view.physicalSize = size;
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
        expect(find.byType(HouseProgressCard), findsOneWidget);
        expect(find.byType(HouseBottomBar), findsOneWidget);
        expect(tester.takeException(), isNull);
      });
    }
  });
}
