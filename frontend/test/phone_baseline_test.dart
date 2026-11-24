// ignore_for_file: avoid_print
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mathcity_ai/features/home/kids_home_screen.dart';
import 'package:mathcity_ai/features/lessons/lessons_screen.dart';
import 'package:mathcity_ai/features/ai_teacher/ziyo_tutor_screen.dart';
import 'package:mathcity_ai/features/leaderboard/leaderboard_screen.dart';
import 'package:mathcity_ai/features/profile/profile_screen.dart';
import 'package:mathcity_ai/features/settings/mathcity_pro_screen.dart';
import 'package:mathcity_ai/features/practice/exercise_screen.dart';
import 'package:mathcity_ai/features/auth/login_screen.dart';
import 'package:mathcity_ai/features/auth/register_screen.dart';
import 'package:mathcity_ai/features/auth/complete_profile_screen.dart';
import 'package:mathcity_ai/core/widgets/announcement_popup.dart';
import 'package:mathcity_ai/shared/providers/student_provider.dart';

void main() {
  const phoneWidths = [320.0, 360.0, 390.0, 430.0];

  group('0-QADAM: Phone Baseline Rendering Tests (< 600px)', () {
    for (final width in phoneWidths) {
      group('Width: ${width}px', () {
        testWidgets('1. KidsHomeScreen renders without overflow', (tester) async {
          tester.view.physicalSize = Size(width, 800);
          tester.view.devicePixelRatio = 1.0;
          addTearDown(tester.view.resetPhysicalSize);

          await tester.pumpWidget(
            const ProviderScope(
              child: MaterialApp(home: KidsHomeScreen()),
            ),
          );
          await tester.pump(const Duration(milliseconds: 300));
          expect(tester.takeException(), isNull);
        });

        testWidgets('2. LessonsScreen renders without overflow', (tester) async {
          FlutterErrorDetails? caughtDetails;
          final oldHandler = FlutterError.onError;
          FlutterError.onError = (details) {
            caughtDetails = details;
          };

          tester.view.physicalSize = Size(width, 800);
          tester.view.devicePixelRatio = 1.0;
          addTearDown(tester.view.resetPhysicalSize);

          await tester.pumpWidget(
            const ProviderScope(
              child: MaterialApp(home: LessonsScreen()),
            ),
          );
          await tester.pump(const Duration(milliseconds: 300));
          FlutterError.onError = oldHandler;
          if (caughtDetails != null && caughtDetails!.informationCollector != null) {
            for (final node in caughtDetails!.informationCollector!()) {
              print('LESSONS ERROR at $width: ${node.toDescription()}');
            }
          }
          expect(caughtDetails, isNull);
        });

        testWidgets('3. ZiyoTutorScreen renders without overflow', (tester) async {
          tester.view.physicalSize = Size(width, 800);
          tester.view.devicePixelRatio = 1.0;
          addTearDown(tester.view.resetPhysicalSize);

          await tester.pumpWidget(
            const ProviderScope(
              child: MaterialApp(home: ZiyoTutorScreen()),
            ),
          );
          await tester.pump(const Duration(milliseconds: 300));
          expect(tester.takeException(), isNull);
        });

        testWidgets('4. LeaderboardScreen renders without overflow', (tester) async {
          FlutterErrorDetails? caughtDetails;
          final oldHandler = FlutterError.onError;
          FlutterError.onError = (details) {
            caughtDetails = details;
          };

          tester.view.physicalSize = Size(width, 800);
          tester.view.devicePixelRatio = 1.0;
          addTearDown(tester.view.resetPhysicalSize);

          await tester.pumpWidget(
            const ProviderScope(
              child: MaterialApp(home: LeaderboardScreen()),
            ),
          );
          await tester.pump(const Duration(milliseconds: 300));
          FlutterError.onError = oldHandler;
          if (caughtDetails != null && caughtDetails!.informationCollector != null) {
            for (final node in caughtDetails!.informationCollector!()) {
              print('LEADERBOARD ERROR at $width: ${node.toDescription()}');
            }
          }
          expect(caughtDetails, isNull);
        });

        testWidgets('5. ProfileScreen renders without overflow', (tester) async {
          FlutterErrorDetails? caughtDetails;
          final oldHandler = FlutterError.onError;
          FlutterError.onError = (details) {
            caughtDetails = details;
          };

          tester.view.physicalSize = Size(width, 800);
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
          FlutterError.onError = oldHandler;
          if (caughtDetails != null && caughtDetails!.informationCollector != null) {
            for (final node in caughtDetails!.informationCollector!()) {
              print('PROFILE ERROR at $width: ${node.toDescription()}');
            }
          }
          expect(caughtDetails, isNull);
        });

        testWidgets('6. MathCityProScreen renders without overflow', (tester) async {
          FlutterErrorDetails? caughtDetails;
          final oldHandler = FlutterError.onError;
          FlutterError.onError = (details) {
            caughtDetails = details;
          };

          tester.view.physicalSize = Size(width, 800);
          tester.view.devicePixelRatio = 1.0;
          addTearDown(tester.view.resetPhysicalSize);

          await tester.pumpWidget(
            const ProviderScope(
              child: MaterialApp(home: MathCityProScreen()),
            ),
          );
          await tester.pump(const Duration(milliseconds: 300));
          FlutterError.onError = oldHandler;
          if (caughtDetails != null && caughtDetails!.informationCollector != null) {
            for (final node in caughtDetails!.informationCollector!()) {
              print('DIAGNOSTIC: ${node.toDescription()}');
            }
          }
          expect(caughtDetails, isNull);
        });

        testWidgets('7. Announcement Dialog renders properly', (tester) async {
          tester.view.physicalSize = Size(width, 800);
          tester.view.devicePixelRatio = 1.0;
          addTearDown(tester.view.resetPhysicalSize);

          final item = AnnouncementItem(
            id: 'test-1',
            type: 'URGENT_ANNOUNCEMENT',
            title: 'Muhim e’lon',
            text: 'Test matni',
            buttonText: 'Boshlash',
            delaySeconds: 0,
          );

          await tester.pumpWidget(
            ProviderScope(
              child: MaterialApp(
                home: Builder(
                  builder: (ctx) => Scaffold(
                    body: Center(
                      child: ElevatedButton(
                        onPressed: () => showUrgentAnnouncementDialog(ctx, item),
                        child: const Text('Open'),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          );

          await tester.tap(find.text('Open'));
          await tester.pump(const Duration(milliseconds: 300));
          expect(find.text('Muhim e’lon'), findsOneWidget);
          expect(tester.takeException(), isNull);
        });

        testWidgets('8. ExerciseScreen renders without overflow', (tester) async {
          tester.view.physicalSize = Size(width, 800);
          tester.view.devicePixelRatio = 1.0;
          addTearDown(tester.view.resetPhysicalSize);

          await tester.pumpWidget(
            const ProviderScope(
              child: MaterialApp(home: ExerciseScreen()),
            ),
          );
          await tester.pump(const Duration(milliseconds: 300));
          expect(tester.takeException(), isNull);
        });

        testWidgets('9. LoginScreen renders without overflow', (tester) async {
          tester.view.physicalSize = Size(width, 800);
          tester.view.devicePixelRatio = 1.0;
          addTearDown(tester.view.resetPhysicalSize);

          await tester.pumpWidget(
            const ProviderScope(
              child: MaterialApp(home: LoginScreen()),
            ),
          );
          await tester.pump(const Duration(milliseconds: 300));
          expect(tester.takeException(), isNull);
        });

        testWidgets('10. RegisterScreen renders without overflow', (tester) async {
          tester.view.physicalSize = Size(width, 800);
          tester.view.devicePixelRatio = 1.0;
          addTearDown(tester.view.resetPhysicalSize);

          await tester.pumpWidget(
            const ProviderScope(
              child: MaterialApp(home: RegisterScreen()),
            ),
          );
          await tester.pump(const Duration(milliseconds: 300));
          expect(tester.takeException(), isNull);
        });

        testWidgets('11. CompleteProfileScreen renders without overflow', (tester) async {
          tester.view.physicalSize = Size(width, 800);
          tester.view.devicePixelRatio = 1.0;
          addTearDown(tester.view.resetPhysicalSize);

          await tester.pumpWidget(
            const ProviderScope(
              child: MaterialApp(home: CompleteProfileScreen()),
            ),
          );
          await tester.pump(const Duration(milliseconds: 300));
          expect(tester.takeException(), isNull);
        });
      });
    }
  });
}
