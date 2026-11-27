import 'package:flutter_test/flutter_test.dart';
import 'package:mathcity_ai/shared/models/lesson_model.dart';
import 'package:mathcity_ai/shared/models/module_model.dart';

void main() {
  group('Grade 1 Part 3 Curriculum & Review Tests', () {
    test('ModuleModel correctly supports Part 3 metadata', () {
      final module = ModuleModel(
        id: 'module-g1-p3',
        grade: 1,
        subject: 'Matematika',
        part: 3,
        title: 'Matematika · 3-qism',
        orderIndex: 3,
        comingSoon: false,
        lessonCount: 40,
        questionCount: 800,
        totalMinutes: 341,
        percent: 0,
        earnedXp: 0,
        totalXp: 4060,
      );

      expect(module.id, 'module-g1-p3');
      expect(module.part, 3);
      expect(module.lessonCount, 40);
      expect(module.questionCount, 800);
      expect(module.totalMinutes, 341);
      expect(module.totalXp, 4060);
      expect(module.comingSoon, false);
    });

    test('LessonModel correctly parses review lessons', () {
      final json = {
        'id': 'lesson-g1-p3-12',
        'courseId': 'course-g1-p3',
        'moduleId': 'module-g1-p3',
        'grade': 1,
        'title': '1-nazorat ishi',
        'bookNumber': 12,
        'isReview': true,
        'emoji': '📝',
        'rewardXP': 120,
        'rewardCoins': 12,
        'orderIndex': 12,
        'sectionCount': 20,
        'isCompleted': false,
        'isLocked': true,
        'test': List.generate(
          20,
          (i) => {
            'id': 'q$i',
            'prompt': 'Savol $i',
            'options': ['A', 'B', 'C', 'D'],
            'correctIndex': 0,
            'explanation': 'Tushuntirish $i',
          },
        ),
      };

      final lesson = LessonModel.fromJson(json);

      expect(lesson.id, 'lesson-g1-p3-12');
      expect(lesson.bookNumber, 12);
      expect(lesson.isReview, true);
      expect(lesson.rewardXP, 120);
      expect(lesson.rewardCoins, 12);
      expect(lesson.test.length, 20);
    });

    test('LessonModel correctly parses regular Part 3 lessons', () {
      final json = {
        'id': 'lesson-g1-p3-01',
        'courseId': 'course-g1-p3',
        'moduleId': 'module-g1-p3',
        'grade': 1,
        'title': 'Masalaning tarkibi',
        'bookNumber': 1,
        'isReview': false,
        'emoji': '🧩',
        'rewardXP': 100,
        'rewardCoins': 10,
        'orderIndex': 1,
        'sectionCount': 20,
        'practice': [
          {
            'id': 'p1',
            'prompt': 'Mashq 1',
            'options': ['1', '2', '3', '4'],
            'correctIndex': 3,
            'explanation': 'To‘g‘ri',
          }
        ],
        'test': List.generate(
          20,
          (i) => {
            'id': 't$i',
            'prompt': 'Test savoli $i',
            'options': ['1', '2', '3', '4'],
            'correctIndex': 0,
            'explanation': 'Tushuntirish',
          },
        ),
      };

      final lesson = LessonModel.fromJson(json);

      expect(lesson.id, 'lesson-g1-p3-01');
      expect(lesson.bookNumber, 1);
      expect(lesson.isReview, false);
      expect(lesson.rewardXP, 100);
      expect(lesson.rewardCoins, 10);
      expect(lesson.practice.length, 1);
      expect(lesson.test.length, 20);
    });
  });
}
