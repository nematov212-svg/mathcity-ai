// ignore_for_file: avoid_print
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mathcity_ai/core/responsive/responsive.dart';
import 'package:mathcity_ai/core/responsive/responsive_layout.dart';
import 'package:mathcity_ai/core/responsive/app_responsive_scaffold.dart';
import 'package:mathcity_ai/features/home/kids_home_screen.dart';
import 'package:mathcity_ai/features/home/kids_tablet_screen.dart';
import 'package:mathcity_ai/features/home/kids_desktop_screen.dart';
import 'package:mathcity_ai/features/lessons/lessons_screen.dart';
import 'package:mathcity_ai/features/ai_teacher/ziyo_tutor_screen.dart';
import 'package:mathcity_ai/features/leaderboard/leaderboard_screen.dart';
import 'package:mathcity_ai/features/profile/profile_screen.dart';
import 'package:mathcity_ai/features/settings/mathcity_pro_screen.dart';
import 'package:mathcity_ai/features/practice/exercise_screen.dart';
import 'package:mathcity_ai/shared/providers/student_provider.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('6-QADAM: Multi-Resolution & Responsive Architecture Tests', () {
    test('1. getScreenType correctly classifies screen types', () {
      expect(getScreenType(360), ScreenType.phone);
      expect(getScreenType(599), ScreenType.phone);
      expect(getScreenType(600), ScreenType.tablet);
      expect(getScreenType(768), ScreenType.tablet);
      expect(getScreenType(1023), ScreenType.tablet);
      expect(getScreenType(1024), ScreenType.desktop);
      expect(getScreenType(1440), ScreenType.desktop);
      expect(getScreenType(1920), ScreenType.desktop);
    });

    testWidgets('2. ResponsiveLayout adapts dynamically to mobile, tablet, and desktop', (tester) async {
      final widget = MaterialApp(
        home: ResponsiveLayout(
          mobile: const Text('MOBILE_VIEW'),
          tablet: const Text('TABLET_VIEW'),
          desktop: const Text('DESKTOP_VIEW'),
        ),
      );

      // Phone
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      await tester.pumpWidget(widget);
      expect(find.text('MOBILE_VIEW'), findsOneWidget);
      expect(find.text('TABLET_VIEW'), findsNothing);
      expect(find.text('DESKTOP_VIEW'), findsNothing);

      // Tablet
      tester.view.physicalSize = const Size(768, 1024);
      await tester.pumpWidget(widget);
      expect(find.text('MOBILE_VIEW'), findsNothing);
      expect(find.text('TABLET_VIEW'), findsOneWidget);
      expect(find.text('DESKTOP_VIEW'), findsNothing);

      // Desktop
      tester.view.physicalSize = const Size(1440, 900);
      await tester.pumpWidget(widget);
      expect(find.text('MOBILE_VIEW'), findsNothing);
      expect(find.text('TABLET_VIEW'), findsNothing);
      expect(find.text('DESKTOP_VIEW'), findsOneWidget);

      tester.view.resetPhysicalSize();
    });

    testWidgets('3. AppResponsiveScaffold shows Sidebar on desktop and Rail on tablet', (tester) async {
      Widget buildTest(Size size) {
        return const ProviderScope(
          child: MaterialApp(
            home: AppResponsiveScaffold(
              currentNavIndex: 1,
              title: 'Darslar Test',
              phoneBody: Text('PHONE_BODY'),
              tabletBody: Text('TABLET_BODY'),
              desktopBody: Text('DESKTOP_BODY'),
            ),
          ),
        );
      }

      // Phone: phoneBody directly, no sidebar/rail
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      await tester.pumpWidget(buildTest(const Size(390, 844)));
      expect(find.text('PHONE_BODY'), findsOneWidget);
      expect(find.text('M²'), findsNothing);

      // Tablet: Navigation Rail present with mini logo M²
      tester.view.physicalSize = const Size(768, 1024);
      await tester.pumpWidget(buildTest(const Size(768, 1024)));
      await tester.pumpAndSettle();
      expect(find.text('M²'), findsOneWidget);
      expect(find.text('TABLET_BODY'), findsOneWidget);

      // Desktop: 260px Sidebar present with MathCity logo and Ziyo mascot
      tester.view.physicalSize = const Size(1280, 800);
      await tester.pumpWidget(buildTest(const Size(1280, 800)));
      await tester.pumpAndSettle();
      expect(find.text('MathCity AI'), findsOneWidget);
      expect(find.text('Asosiy'), findsOneWidget);
      expect(find.text('Darslar'), findsOneWidget);
      expect(find.text('AI Ustoz'), findsOneWidget);
      expect(find.text('Reyting'), findsOneWidget);
      expect(find.text('Profil'), findsOneWidget);

      tester.view.resetPhysicalSize();
    });

    // Multi-Resolution Rendering across Tablet and Desktop
    final wideResolutions = {
      'Tablet 768x1024': const Size(768, 1024),
      'Tablet 820x1180': const Size(820, 1180),
      'Tablet 1024x768': const Size(1024, 768),
      'Desktop 1280x720': const Size(1280, 720),
      'Desktop 1440x900': const Size(1440, 900),
      'Desktop 1920x1080': const Size(1920, 1080),
    };

    for (final entry in wideResolutions.entries) {
      final resName = entry.key;
      final size = entry.value;

      group('Resolution: $resName (${size.width}x${size.height})', () {
        testWidgets('LessonsScreen renders cleanly on $resName', (tester) async {
          FlutterErrorDetails? caughtDetails;
          final oldHandler = FlutterError.onError;
          FlutterError.onError = (details) => caughtDetails = details;

          tester.view.physicalSize = size;
          tester.view.devicePixelRatio = 1.0;
          addTearDown(tester.view.resetPhysicalSize);

          await tester.pumpWidget(
            const ProviderScope(child: MaterialApp(home: LessonsScreen())),
          );
          await tester.pump(const Duration(milliseconds: 300));
          FlutterError.onError = oldHandler;
          if (caughtDetails != null) {
            print('LESSONS ERROR at $resName: ${caughtDetails!.exception}');
            if (caughtDetails!.informationCollector != null) {
              for (final node in caughtDetails!.informationCollector!()) {
                print('LESSONS NODE: ${node.toDescription()}');
              }
            }
          }
          expect(caughtDetails, isNull);
        });

        testWidgets('ZiyoTutorScreen renders cleanly on $resName', (tester) async {
          FlutterErrorDetails? caughtDetails;
          final oldHandler = FlutterError.onError;
          FlutterError.onError = (details) => caughtDetails = details;

          tester.view.physicalSize = size;
          tester.view.devicePixelRatio = 1.0;
          addTearDown(tester.view.resetPhysicalSize);

          await tester.pumpWidget(
            const ProviderScope(child: MaterialApp(home: ZiyoTutorScreen())),
          );
          await tester.pump(const Duration(milliseconds: 300));
          FlutterError.onError = oldHandler;
          if (caughtDetails != null) {
            print('ZIYO ERROR at $resName: ${caughtDetails!.exception}');
            if (caughtDetails!.informationCollector != null) {
              for (final node in caughtDetails!.informationCollector!()) {
                print('ZIYO NODE: ${node.toDescription()}');
              }
            }
          }
          expect(caughtDetails, isNull);
        });

        testWidgets('LeaderboardScreen renders cleanly on $resName', (tester) async {
          tester.view.physicalSize = size;
          tester.view.devicePixelRatio = 1.0;
          addTearDown(tester.view.resetPhysicalSize);

          await tester.pumpWidget(
            const ProviderScope(child: MaterialApp(home: LeaderboardScreen())),
          );
          await tester.pump(const Duration(milliseconds: 300));
          expect(tester.takeException(), isNull);
        });

        testWidgets('ProfileScreen renders cleanly on $resName', (tester) async {
          tester.view.physicalSize = size;
          tester.view.devicePixelRatio = 1.0;
          addTearDown(tester.view.resetPhysicalSize);

          final container = ProviderContainer();
          addTearDown(container.dispose);

          await tester.pumpWidget(
            UncontrolledProviderScope(
              container: container,
              child: const MaterialApp(home: ProfileScreen()),
            ),
          );
          await tester.pump(const Duration(seconds: 1));
          container.read(studentProvider.notifier).stopHeartbeat();
          expect(tester.takeException(), isNull);
        });

        testWidgets('MathCityProScreen renders cleanly on $resName', (tester) async {
          FlutterErrorDetails? caughtDetails;
          final oldHandler = FlutterError.onError;
          FlutterError.onError = (details) {
            caughtDetails = details;
          };

          tester.view.physicalSize = size;
          tester.view.devicePixelRatio = 1.0;
          addTearDown(tester.view.resetPhysicalSize);

          await tester.pumpWidget(
            const ProviderScope(child: MaterialApp(home: MathCityProScreen())),
          );
          await tester.pump(const Duration(milliseconds: 300));
          FlutterError.onError = oldHandler;
          if (caughtDetails != null) {
            print('PRO ERROR at $resName: ${caughtDetails!.exception}');
            if (caughtDetails!.informationCollector != null) {
              for (final node in caughtDetails!.informationCollector!()) {
                print('NODE: ${node.toDescription()}');
              }
            }
          }
          expect(caughtDetails, isNull);
        });

        testWidgets('ExerciseScreen renders cleanly on $resName', (tester) async {
          tester.view.physicalSize = size;
          tester.view.devicePixelRatio = 1.0;
          addTearDown(tester.view.resetPhysicalSize);

          await tester.pumpWidget(
            const ProviderScope(child: MaterialApp(home: ExerciseScreen())),
          );
          await tester.pump(const Duration(milliseconds: 300));
          expect(tester.takeException(), isNull);
        });

        testWidgets('KidsHomeScreen/Desktop/Tablet renders cleanly on $resName', (tester) async {
          tester.view.physicalSize = size;
          tester.view.devicePixelRatio = 1.0;
          addTearDown(tester.view.resetPhysicalSize);

          await tester.pumpWidget(
            const ProviderScope(
              child: MaterialApp(
                home: ResponsiveLayout(
                  mobile: KidsHomeScreen(),
                  tablet: KidsTabletScreen(),
                  desktop: KidsDesktopScreen(),
                ),
              ),
            ),
          );
          await tester.pump(const Duration(milliseconds: 300));
          expect(tester.takeException(), isNull);
        });
      });
    }

    testWidgets('ExerciseScreen desktop keyboard shortcuts select option and advance', (tester) async {
      tester.view.physicalSize = const Size(1280, 800);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        const ProviderScope(child: MaterialApp(home: ExerciseScreen())),
      );
      await tester.pump(const Duration(milliseconds: 300));

      // Press key '1' to select first option
      await tester.sendKeyEvent(LogicalKeyboardKey.digit1);
      await tester.pump();
      expect(tester.takeException(), isNull);

      // Press 'Enter' to check answer
      await tester.sendKeyEvent(LogicalKeyboardKey.enter);
      await tester.pump(const Duration(milliseconds: 200));
      expect(tester.takeException(), isNull);
    });
  });
}
