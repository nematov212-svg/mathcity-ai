import 'package:flutter_test/flutter_test.dart';
import 'package:mathcity_ai/shared/models/lesson_model.dart';
import 'package:mathcity_ai/shared/models/module_model.dart';

void main() {
  group('Grade 1 Part 4 Curriculum Tests', () {
    test('ModuleModel correctly supports Part 4 metadata', () {
      final module = ModuleModel(
        id: 'module-g1-p4',
        grade: 1,
        subject: 'Matematika',
        part: 4,
        title: 'Matematika · 4-qism',
        orderIndex: 4,
        comingSoon: false,
        lessonCount: 33,
        questionCount: 660,
        totalMinutes: 266,
        percent: 0,
        earnedXp: 0,
        totalXp: 3275,
      );

      expect(module.id, 'module-g1-p4');
      expect(module.part, 4);
      expect(module.lessonCount, 33);
      expect(module.questionCount, 660);
      expect(module.totalMinutes, 266);
      expect(module.totalXp, 3275);
      expect(module.comingSoon, false);
    });

    test('LessonModel correctly parses Part 4 geometric lesson (112)', () {
      final json = {
        'id': 'lesson-g1-p4-112',
        'courseId': 'course-g1-p4',
        'moduleId': 'module-g1-p4',
        'grade': 1,
        'title': 'Kesma va uning uzunligi',
        'bookNumber': 112,
        'isReview': false,
        'emoji': '📏',
        'rewardXP': 90,
        'rewardCoins': 10,
        'orderIndex': 1,
        'sectionCount': 20,
        'practice': [
          {
            'id': 'p1',
            'prompt': 'Kesma nima?',
            'options': ['To‘g‘ri chiziq bo‘lagi', 'Egri chiziq', 'Nuqta', 'Nur'],
            'correctIndex': 0,
            'explanation': 'Kesma — ikki nuqta bilan chegaralangan to‘g‘ri chiziq bo‘lagi.',
          }
        ],
        'test': List.generate(
          20,
          (i) => {
            'id': 't$i',
            'prompt': 'Savol $i',
            'options': ['A', 'B', 'C', 'D'],
            'correctIndex': i % 4,
            'explanation': 'Izoh $i',
          },
        ),
      };

      final lesson = LessonModel.fromJson(json);

      expect(lesson.id, 'lesson-g1-p4-112');
      expect(lesson.bookNumber, 112);
      expect(lesson.rewardXP, 90);
      expect(lesson.test.length, 20);
      expect(lesson.practice.length, 1);
    });

    test('LessonModel correctly parses Part 4 equation lesson (137)', () {
      final json = {
        'id': 'lesson-g1-p4-137',
        'courseId': 'course-g1-p4',
        'moduleId': 'module-g1-p4',
        'grade': 1,
        'title': 'Tenglamalar',
        'bookNumber': 137,
        'isReview': false,
        'emoji': '🧩',
        'rewardXP': 110,
        'rewardCoins': 12,
        'orderIndex': 26,
        'sectionCount': 20,
        'test': List.generate(
          20,
          (i) => {
            'id': 't$i',
            'prompt': 'x + 5 = 20 tenglamada x nimaga teng?',
            'options': ['x = 15', 'x = 25', 'x = 10', 'x = 20'],
            'correctIndex': 0,
            'explanation': 'x = 20 - 5 = 15.',
          },
        ),
      };

      final lesson = LessonModel.fromJson(json);

      expect(lesson.id, 'lesson-g1-p4-137');
      expect(lesson.bookNumber, 137);
      expect(lesson.rewardXP, 110);
      expect(lesson.rewardCoins, 12);
      expect(lesson.test.length, 20);
      expect(lesson.test[0].prompt, contains('x + 5 = 20'));
    });

    test('LessonModel correctly parses Part 4 Roman numerals lesson (136)', () {
      final json = {
        'id': 'lesson-g1-p4-136',
        'courseId': 'course-g1-p4',
        'moduleId': 'module-g1-p4',
        'grade': 1,
        'title': 'Rim raqamlari',
        'bookNumber': 136,
        'isReview': false,
        'emoji': '🏛️',
        'rewardXP': 95,
        'rewardCoins': 10,
        'orderIndex': 25,
        'sectionCount': 20,
        'test': List.generate(
          20,
          (i) => {
            'id': 't$i',
            'prompt': 'V + V nimaga teng?',
            'options': ['X (10)', 'XV (15)', 'L (50)', 'VV (10)'],
            'correctIndex': 0,
            'explanation': 'V = 5, 5 + 5 = 10 (X).',
          },
        ),
      };

      final lesson = LessonModel.fromJson(json);

      expect(lesson.id, 'lesson-g1-p4-136');
      expect(lesson.bookNumber, 136);
      expect(lesson.rewardXP, 95);
      expect(lesson.test.length, 20);
      expect(lesson.test[0].prompt, contains('V + V'));
    });

    test('LessonModel correctly parses Part 4 final review lesson (144)', () {
      final json = {
        'id': 'lesson-g1-p4-144',
        'courseId': 'course-g1-p4',
        'moduleId': 'module-g1-p4',
        'grade': 1,
        'title': 'Takrorlash (3)',
        'bookNumber': 144,
        'isReview': true,
        'emoji': '🎓',
        'rewardXP': 120,
        'rewardCoins': 15,
        'orderIndex': 33,
        'sectionCount': 20,
        'test': List.generate(
          20,
          (i) => {
            'id': 't$i',
            'prompt': '18 < x < 22 tengsizlik yechimlari:',
            'options': ['19, 20, 21', '18, 19, 20', '20, 21, 22', '17, 18, 19'],
            'correctIndex': 0,
            'explanation': '18 dan katta va 22 dan kichik sonlar: 19, 20, 21.',
          },
        ),
      };

      final lesson = LessonModel.fromJson(json);

      expect(lesson.id, 'lesson-g1-p4-144');
      expect(lesson.bookNumber, 144);
      expect(lesson.isReview, true);
      expect(lesson.rewardXP, 120);
      expect(lesson.rewardCoins, 15);
      expect(lesson.test.length, 20);
      expect(lesson.test[0].prompt, contains('18 < x < 22'));
    });
  });
}
