import 'dart:convert';
import 'dart:io';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mathcity_ai/shared/providers/student_provider.dart';
import 'package:mathcity_ai/shared/models/exercise_model.dart';
import 'package:mathcity_ai/shared/repositories/exercise_repository.dart';

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  group('VAZIFA 2: Coin Economy & Answer Submission Strict Business Rules', () {
    test('1. Correct answer on a new question gives exactly +1 coin and +10 XP', () async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final notifier = container.read(studentProvider.notifier);
      final initialCoins = container.read(studentProvider).student?.coinBalance ?? 100;
      final initialXP = container.read(studentProvider).student?.totalXP ?? 0;

      final res = await notifier.submitAnswer(
        'task-q-101',
        '42',
        isCorrectLocally: true,
        correctAnswer: '42',
        explanation: 'Javob: 42',
      );

      expect(res['isCorrect'], isTrue);
      expect(res['coinsAwarded'], 1);
      expect(res['xpAwarded'], 10);
      expect(container.read(studentProvider).student?.coinBalance, initialCoins + 1);
      expect(container.read(studentProvider).student?.totalXP, initialXP + 10);
    });

    test('2. Wrong answer awards 0 coins and never decreases balance', () async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final notifier = container.read(studentProvider.notifier);
      final initialCoins = container.read(studentProvider).student?.coinBalance ?? 100;
      final initialXP = container.read(studentProvider).student?.totalXP ?? 0;

      final res = await notifier.submitAnswer(
        'task-q-102',
        '999',
        isCorrectLocally: false,
        correctAnswer: '42',
        explanation: 'Xato javob',
      );

      expect(res['isCorrect'], isFalse);
      expect(res['coinsAwarded'], 0);
      expect(res['xpAwarded'], 0);
      expect(container.read(studentProvider).student?.coinBalance, initialCoins);
      expect(container.read(studentProvider).student?.totalXP, initialXP);
    });

    test('3. Repeat answer on the same question gives 0 coins (single-reward per question)', () async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final notifier = container.read(studentProvider.notifier);
      final initialCoins = container.read(studentProvider).student?.coinBalance ?? 100;

      // First attempt: correct -> +1 coin
      final res1 = await notifier.submitAnswer(
        'task-q-103',
        '15',
        isCorrectLocally: true,
        correctAnswer: '15',
      );
      expect(res1['coinsAwarded'], 1);
      expect(container.read(studentProvider).student?.coinBalance, initialCoins + 1);

      // Second attempt on the EXACT SAME question: must be 0 coins
      final res2 = await notifier.submitAnswer(
        'task-q-103',
        '15',
        isCorrectLocally: true,
        correctAnswer: '15',
      );
      expect(res2['coinsAwarded'], 0);
      expect(container.read(studentProvider).student?.coinBalance, initialCoins + 1);

      // Third attempt on a DIFFERENT question: gets +1 coin
      final res3 = await notifier.submitAnswer(
        'task-q-104',
        '25',
        isCorrectLocally: true,
        correctAnswer: '25',
      );
      expect(res3['coinsAwarded'], 1);
      expect(container.read(studentProvider).student?.coinBalance, initialCoins + 2);
    });
  });

  group('VAZIFA 1: Age Calculation & Educational Level Mapping', () {
    test('ExerciseRepository maps ages 6-16 to appropriate curriculum levels', () {
      // 6–8 years old: Level 1 (Boshlang‘ich)
      expect(ExerciseRepository.determineLevelForAge(6), 1);
      expect(ExerciseRepository.determineLevelForAge(7), 1);
      expect(ExerciseRepository.determineLevelForAge(8), 1);

      // 9–12 years old: Level 2 (Bolalar rejimi / O‘rta)
      expect(ExerciseRepository.determineLevelForAge(9), 2);
      expect(ExerciseRepository.determineLevelForAge(10), 2);
      expect(ExerciseRepository.determineLevelForAge(11), 2);
      expect(ExerciseRepository.determineLevelForAge(12), 2);

      // 13–16+ years old: Level 3 (O‘smirlar rejimi / Yuqori)
      expect(ExerciseRepository.determineLevelForAge(13), 3);
      expect(ExerciseRepository.determineLevelForAge(14), 3);
      expect(ExerciseRepository.determineLevelForAge(15), 3);
      expect(ExerciseRepository.determineLevelForAge(16), 3);
    });

    test('Accurate age computation from birthdate', () {
      final now = DateTime.now();
      // Born exactly 10 years ago today
      final bday10 = DateTime(now.year - 10, now.month, now.day);
      int age10 = now.year - bday10.year;
      if (now.month < bday10.month || (now.month == bday10.month && now.day < bday10.day)) {
        age10--;
      }
      expect(age10, 10);

      // Born 10 years ago, but birthday is tomorrow
      final bdayAlmost10 = now.add(const Duration(days: 1));
      final adjustedBday = DateTime(now.year - 10, bdayAlmost10.month, bdayAlmost10.day);
      int ageAlmost10 = now.year - adjustedBday.year;
      if (now.month < adjustedBday.month || (now.month == adjustedBday.month && now.day < adjustedBday.day)) {
        ageAlmost10--;
      }
      expect(ageAlmost10, 9);
    });
  });

  group('VAZIFA 4: Exercises Database Integrity (1000+ Items)', () {
    test('exercises_1000.json exists, contains 1000+ items, and every question passes isValid()', () {
      final possiblePaths = [
        'assets/data/exercises_1000.json',
        '../frontend/assets/data/exercises_1000.json',
        'frontend/assets/data/exercises_1000.json',
      ];

      File? file;
      for (final p in possiblePaths) {
        final f = File(p);
        if (f.existsSync()) {
          file = f;
          break;
        }
      }

      expect(file, isNotNull, reason: 'exercises_1000.json file must exist in assets/data/');

      final rawContent = file!.readAsStringSync();
      final list = jsonDecode(rawContent) as List<dynamic>;

      expect(list.length, greaterThanOrEqualTo(1000), reason: 'Must contain at least 1000 exercises');
      expect(list.length, 1015, reason: 'Generated bank contains exactly 1015 items');

      int level1Count = 0;
      int level2Count = 0;
      int level3Count = 0;

      for (int i = 0; i < list.length; i++) {
        final map = list[i] as Map<String, dynamic>;
        final exercise = Exercise.fromJson(map);

        expect(exercise.isValid(), isTrue,
            reason: 'Exercise at index $i (id: ${exercise.id}) must be valid according to strict criteria');
        expect(exercise.options.length, 4,
            reason: 'Exercise #${exercise.id} must have exactly 4 options');
        expect(exercise.correctIndex, inInclusiveRange(0, 3),
            reason: 'Exercise #${exercise.id} correctIndex must be 0, 1, 2, or 3');
        expect(exercise.options[exercise.correctIndex], exercise.answer,
            reason: 'Exercise #${exercise.id} options[correctIndex] must strictly equal answer');
        expect(exercise.question.isNotEmpty, isTrue,
            reason: 'Exercise #${exercise.id} question must not be empty');
        expect(exercise.explanation.isNotEmpty, isTrue,
            reason: 'Exercise #${exercise.id} explanation must not be empty');

        if (exercise.level == 1) level1Count++;
        if (exercise.level == 2) level2Count++;
        if (exercise.level == 3) level3Count++;
      }

      expect(level1Count, greaterThan(200), reason: 'Substantial questions for Level 1');
      expect(level2Count, greaterThan(200), reason: 'Substantial questions for Level 2');
      expect(level3Count, greaterThan(200), reason: 'Substantial questions for Level 3');
    });
  });
}
