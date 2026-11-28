import 'package:flutter_test/flutter_test.dart';
import 'package:mathcity_ai/features/games/logic/question_generator.dart';
import 'package:mathcity_ai/features/games/models/game_config.dart';

void main() {
  group('QuestionGenerator Comprehensive Tests', () {
    late QuestionGenerator generator;

    setUp(() {
      generator = QuestionGenerator();
    });

    test('Addition generates valid equations across all number ranges', () {
      for (final range in NumberRange.values) {
        final config = GameConfig(
          operations: {MathOperation.addition},
          numberRange: range,
        );

        for (int i = 0; i < 50; i++) {
          final q = generator.generateQuestion(config);
          expect(q.operation, MathOperation.addition);
          expect(q.questionText, contains('+'));
          expect(q.questionText, contains('= ?'));

          // Parse operands
          final parts = q.questionText.replaceAll(' = ?', '').split(' + ');
          final a = int.parse(parts[0]);
          final b = int.parse(parts[1]);
          final ans = int.parse(q.correctAnswer);

          expect(ans, equals(a + b));
          expect(a, greaterThanOrEqualTo(range.min));
          expect(a, lessThanOrEqualTo(range.max));
          expect(b, greaterThanOrEqualTo(range.min));
          expect(b, lessThanOrEqualTo(range.max));
        }
      }
    });

    test('Subtraction never generates negative results across all ranges', () {
      for (final range in NumberRange.values) {
        final config = GameConfig(
          operations: {MathOperation.subtraction},
          numberRange: range,
        );

        for (int i = 0; i < 50; i++) {
          final q = generator.generateQuestion(config);
          expect(q.operation, MathOperation.subtraction);
          expect(q.questionText, contains('−'));

          final parts = q.questionText.replaceAll(' = ?', '').split(' − ');
          final a = int.parse(parts[0]);
          final b = int.parse(parts[1]);
          final ans = int.parse(q.correctAnswer);

          expect(a, greaterThanOrEqualTo(b),
              reason: 'Operand A must be >= Operand B for non-negative result');
          expect(ans, greaterThanOrEqualTo(0));
          expect(ans, equals(a - b));
        }
      }
    });

    test('Multiplication generates valid integer product without extreme digits', () {
      for (final range in NumberRange.values) {
        final config = GameConfig(
          operations: {MathOperation.multiplication},
          numberRange: range,
        );

        for (int i = 0; i < 50; i++) {
          final q = generator.generateQuestion(config);
          expect(q.operation, MathOperation.multiplication);
          expect(q.questionText, contains('×'));

          final parts = q.questionText.replaceAll(' = ?', '').split(' × ');
          final a = int.parse(parts[0]);
          final b = int.parse(parts[1]);
          final ans = int.parse(q.correctAnswer);

          expect(ans, equals(a * b));
          expect(a, greaterThan(0));
          expect(b, greaterThan(0));
        }
      }
    });

    test('Division generates exact whole integer quotients without zero divisors', () {
      for (final range in NumberRange.values) {
        final config = GameConfig(
          operations: {MathOperation.division},
          numberRange: range,
        );

        for (int i = 0; i < 50; i++) {
          final q = generator.generateQuestion(config);
          expect(q.operation, MathOperation.division);
          expect(q.questionText, contains('÷'));

          final parts = q.questionText.replaceAll(' = ?', '').split(' ÷ ');
          final dividend = int.parse(parts[0]);
          final divisor = int.parse(parts[1]);
          final quotient = int.parse(q.correctAnswer);

          expect(divisor, greaterThan(0), reason: 'Cannot divide by 0');
          expect(dividend % divisor, equals(0),
              reason: 'Result must be exact integer');
          expect(dividend ~/ divisor, equals(quotient));
        }
      }
    });

    test('Comparison generates valid <, =, > symbols with ~25% equal rate', () {
      for (final range in NumberRange.values) {
        final config = GameConfig(
          operations: {MathOperation.comparison},
          numberRange: range,
        );

        int equalCount = 0;
        const total = 100;

        for (int i = 0; i < total; i++) {
          final q = generator.generateQuestion(config);
          expect(q.operation, MathOperation.comparison);
          expect(q.isComparison, isTrue);
          expect(q.questionText, contains('?'));

          final parts = q.questionText.split(' ? ');
          final a = int.parse(parts[0]);
          final b = int.parse(parts[1]);

          if (q.correctAnswer == '=') {
            expect(a, equals(b));
            equalCount++;
          } else if (q.correctAnswer == '<') {
            expect(a, lessThan(b));
          } else if (q.correctAnswer == '>') {
            expect(a, greaterThan(b));
          } else {
            fail('Invalid comparison answer: ${q.correctAnswer}');
          }
        }

        expect(equalCount, greaterThan(5),
            reason: 'Equal case should occur reasonably often');
      }
    });

    test('Avoiding back-to-back duplicate questions', () {
      final config = GameConfig(
        operations: {MathOperation.addition, MathOperation.subtraction},
        numberRange: NumberRange.doubleDigit,
      );

      String? lastText;
      for (int i = 0; i < 30; i++) {
        final q = generator.generateQuestion(config, lastQuestionText: lastText);
        if (lastText != null) {
          expect(q.questionText, isNot(equals(lastText)));
        }
        lastText = q.questionText;
      }
    });
  });
}
