import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mathcity_ai/features/lessons/lessons_screen.dart';
import 'package:mathcity_ai/features/lessons/module_lessons_screen.dart';
import 'package:mathcity_ai/features/lessons/lesson_reader_screen.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Grade 1 & Module Lessons Architecture Tests (v9)', () {
    testWidgets(
        'LessonsScreen: No "Barchasi" chip, default 1-sinf, module cards render cleanly at 360x640',
        (tester) async {
      tester.view.physicalSize = const Size(360, 640);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: LessonsScreen(),
          ),
        ),
      );

      await tester.pump();
      await tester.pump(const Duration(milliseconds: 200));

      // 1. "Barchasi" chip must NOT exist
      expect(find.text('Barchasi'), findsNothing);

      // 2. 1-sinf must be present
      expect(find.text('1-sinf'), findsWidgets);

      // 3. Module cards for Grade 1
      expect(find.text('Matematika · 1-qism'), findsOneWidget);
      expect(find.text('Matematika · 2-qism'), findsOneWidget);

      // 4. Both modules active with lesson counts
      expect(find.textContaining('41 ta mavzu'), findsWidgets);
      expect(find.textContaining('33 ta mavzu'), findsWidgets);
    });

    testWidgets(
        'ModuleLessonsScreen: Displays Grade 1 Part 1 full curriculum with 41 lessons at 360x640',
        (tester) async {
      tester.view.physicalSize = const Size(360, 640);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: ModuleLessonsScreen(moduleId: 'module-g1-p1'),
          ),
        ),
      );

      await tester.pump();
      await tester.pump(const Duration(milliseconds: 200));

      // 1. Summary Card
      expect(find.textContaining('mavzu'), findsWidgets);
      expect(find.textContaining('XP'), findsWidgets);

      // 2. First lesson: "1. Narsalarning xossalari"
      expect(find.textContaining('Narsalarning xossalari'), findsOneWidget);

      // 3. Status action button (Boshlash or Qayta ko'rish)
      expect(find.textContaining('Boshlash'), findsWidgets);
      expect(find.textContaining('XP'), findsWidgets);
      expect(find.textContaining('🪙'), findsWidgets);

      // 4. Scroll to view later lessons (e.g. lesson 5, 10, etc.)
      await tester.drag(find.byType(ListView), const Offset(0, -600));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 100));

      expect(find.byType(Container), findsWidgets);
    });

    testWidgets(
        'LessonReaderScreen: Step 1 (Kirish) redesigned with 5-dot indicator, Hero card, zero LaTeX',
        (tester) async {
      tester.view.physicalSize = const Size(360, 640);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      await tester.pumpWidget(
        const ProviderScope(
          child: MaterialApp(
            home: LessonReaderScreen(lessonId: 'lesson-g1-01'),
          ),
        ),
      );

      // Advance frames for animations
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300));

      // 1. 5-dot step indicator
      expect(find.textContaining('1-qadam: Kirish'), findsOneWidget);
      expect(find.text('1 / 5'), findsOneWidget);

      // 2. Hero card
      expect(find.textContaining('1-SINF'), findsOneWidget);

      // 3. "Bugun nimani o‘rganamiz?" Card
      expect(find.text('Bugun nimani o‘rganamiz?'), findsOneWidget);

      // 4. "Esda tuting!" Block
      expect(find.text('Esda tuting!'), findsOneWidget);

      // 5. "Keling, ko‘ramiz!" Card
      expect(find.text('Keling, ko‘ramiz!'), findsOneWidget);

      // 6. Zero Sigma icon (functions_rounded) or raw LaTeX formula
      expect(find.byIcon(Icons.functions_rounded), findsNothing);
      expect(find.textContaining(r'\frac'), findsNothing);

      // 7. "Boshlaymiz! 🚀" Button
      expect(find.text('Boshlaymiz! 🚀'), findsOneWidget);

      // Scroll into view & tap "Boshlaymiz! 🚀" -> advances to Step 2 (Tushuntirish)
      await tester.ensureVisible(find.text('Boshlaymiz! 🚀'));
      await tester.pump(const Duration(milliseconds: 200));
      await tester.tap(find.text('Boshlaymiz! 🚀'));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300));

      expect(find.textContaining('2-qadam: Tushuntirish'), findsOneWidget);
    });
  });
}
