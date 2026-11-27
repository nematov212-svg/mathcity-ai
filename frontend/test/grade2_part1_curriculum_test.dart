import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mathcity_ai/shared/models/lesson_model.dart';
import 'package:mathcity_ai/shared/models/module_model.dart';
import 'package:mathcity_ai/features/lessons/widgets/grade2_visual_widgets.dart';

void main() {
  group('Grade 2 Part 1 Curriculum Tests', () {
    test('ModuleModel correctly supports Grade 2 Part 1 metadata', () {
      final module = ModuleModel(
        id: 'module-g2-p1',
        grade: 2,
        subject: 'Matematika',
        part: 1,
        title: 'Matematika · 1-qism',
        orderIndex: 1,
        comingSoon: false,
        lessonCount: 44,
        questionCount: 880,
        totalMinutes: 318,
        percent: 0,
        earnedXp: 0,
        totalXp: 4095,
      );

      expect(module.id, 'module-g2-p1');
      expect(module.grade, 2);
      expect(module.part, 1);
      expect(module.lessonCount, 44);
      expect(module.questionCount, 880);
      expect(module.totalMinutes, 318);
      expect(module.totalXp, 4095);
      expect(module.comingSoon, false);
    });

    test('LessonModel correctly parses Grade 2 unit 1 (Takrorlash)', () {
      final json = {
        'id': 'lesson-g2-01',
        'courseId': 'course-g2-p1',
        'moduleId': 'module-g2-p1',
        'grade': 2,
        'title': 'Takrorlash',
        'bookNumber': 1,
        'isReview': false,
        'emoji': '🎒',
        'rewardXP': 90,
        'rewardCoins': 10,
        'orderIndex': 1,
        'sectionCount': 20,
        'practice': [
          {
            'id': 'p1',
            'prompt': 'Hisoblang: 7 + 5',
            'options': ['12', '11', '13', '10'],
            'correctIndex': 0,
            'explanation': '7 + 5 = 12.',
          }
        ],
        'test': List.generate(
          20,
          (i) => {
            'id': 't$i',
            'prompt': 'Savol $i',
            'options': ['A', 'B', 'C', 'D'],
            'correctIndex': 0,
            'explanation': 'Tushuntirish $i',
          },
        ),
      };

      final lesson = LessonModel.fromJson(json);
      expect(lesson.id, 'lesson-g2-01');
      expect(lesson.title, 'Takrorlash');
      expect(lesson.bookNumber, 1);
      expect(lesson.orderIndex, 1);
      expect(lesson.isReview, false);
      expect(lesson.rewardXP, 90);
    });

    test('LessonModel correctly parses Final review unit 19 and practice unit 44', () {
      final u19Json = {
        'id': 'lesson-g2-19',
        'courseId': 'course-g2-p1',
        'moduleId': 'module-g2-p1',
        'grade': 2,
        'title': 'Mavzu bo‘yicha yakuniy dars',
        'bookNumber': null,
        'isReview': true,
        'emoji': '🌍',
        'rewardXP': 130,
        'rewardCoins': 15,
        'orderIndex': 19,
        'sectionCount': 20,
      };

      final lesson19 = LessonModel.fromJson(u19Json);
      expect(lesson19.id, 'lesson-g2-19');
      expect(lesson19.title, 'Mavzu bo‘yicha yakuniy dars');
      expect(lesson19.isReview, true);
      expect(lesson19.rewardXP, 130);
      expect(lesson19.rewardCoins, 15);

      final u44Json = {
        'id': 'lesson-g2-44',
        'courseId': 'course-g2-p1',
        'moduleId': 'module-g2-p1',
        'grade': 2,
        'title': 'Amaliy topshiriqlar',
        'bookNumber': null,
        'isReview': true,
        'emoji': '🧩',
        'rewardXP': 140,
        'rewardCoins': 15,
        'orderIndex': 44,
        'sectionCount': 20,
      };

      final lesson44 = LessonModel.fromJson(u44Json);
      expect(lesson44.id, 'lesson-g2-44');
      expect(lesson44.title, 'Amaliy topshiriqlar');
      expect(lesson44.isReview, true);
      expect(lesson44.rewardXP, 140);
      expect(lesson44.rewardCoins, 15);
    });

    testWidgets('Grade 2 visual widgets render without overflow', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: SingleChildScrollView(
              child: Column(
                children: [
                  const PlaceValueBlocks(tens: 4, ones: 3, customLabel: '43'),
                  const NumberLine(
                    start: 20,
                    end: 35,
                    jumps: [NumberLineJump(from: 30, to: 23, label: '-7')],
                    highlightValue: 23,
                  ),
                  const ColumnArithmetic(a: 28, b: 14, operation: '+', carryOrBorrow: 1),
                  const ColumnArithmetic(a: 52, b: 27, operation: '-', carryOrBorrow: 1),
                  const BarDiagram(
                    title: 'Taqsimot',
                    totalLabel: '60 dona',
                    segments: [
                      BarDiagramSegment(label: '1-qism', value: 21, color: Colors.blue),
                      BarDiagramSegment(label: '2-qism', value: 39, color: Colors.orange),
                    ],
                  ),
                  const ShapeDraw(shapeType: ShapeType.rectangle),
                  const ShapeDraw(shapeType: ShapeType.acuteAngle),
                ],
              ),
            ),
          ),
        ),
      );

      await tester.pumpAndSettle();
      expect(find.byType(PlaceValueBlocks), findsOneWidget);
      expect(find.byType(NumberLine), findsOneWidget);
      expect(find.byType(ColumnArithmetic), findsNWidgets(2));
      expect(find.byType(BarDiagram), findsOneWidget);
      expect(find.byType(ShapeDraw), findsNWidgets(2));
    });
  });
}
