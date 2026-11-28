import 'dart:math';
import '../models/game_config.dart';

/// Representation of a single generated math question
class MathQuestion {
  final String questionText;
  final String correctAnswer;
  final MathOperation operation;
  final bool isComparison;

  const MathQuestion({
    required this.questionText,
    required this.correctAnswer,
    required this.operation,
    this.isComparison = false,
  });

  @override
  String toString() => '$questionText => $correctAnswer';
}

/// Generates valid, curriculum-accurate questions according to GameConfig
class QuestionGenerator {
  final Random _random;

  QuestionGenerator({Random? random}) : _random = random ?? Random();

  /// Generates a math question respecting operations, number range, and avoiding repeat
  MathQuestion generateQuestion(
    GameConfig config, {
    String? lastQuestionText,
  }) {
    final ops = config.operations.toList();
    if (ops.isEmpty) {
      // Fallback to addition if empty
      return _generateAddition(config.numberRange);
    }

    // Try up to 10 times to avoid exact repeat of lastQuestionText
    for (int i = 0; i < 10; i++) {
      final op = ops[_random.nextInt(ops.length)];
      final q = _buildQuestionForOperation(op, config.numberRange);
      if (q.questionText != lastQuestionText || ops.length == 1 && i > 3) {
        return q;
      }
    }

    return _buildQuestionForOperation(ops.first, config.numberRange);
  }

  MathQuestion _buildQuestionForOperation(
    MathOperation op,
    NumberRange range,
  ) {
    switch (op) {
      case MathOperation.addition:
        return _generateAddition(range);
      case MathOperation.subtraction:
        return _generateSubtraction(range);
      case MathOperation.multiplication:
        return _generateMultiplication(range);
      case MathOperation.division:
        return _generateDivision(range);
      case MathOperation.comparison:
        return _generateComparison(range);
    }
  }

  MathQuestion _generateAddition(NumberRange range) {
    final a = _getRandomNumberInRange(range);
    final b = _getRandomNumberInRange(range);
    final answer = (a + b).toString();
    return MathQuestion(
      questionText: '$a + $b = ?',
      correctAnswer: answer,
      operation: MathOperation.addition,
    );
  }

  MathQuestion _generateSubtraction(NumberRange range) {
    var a = _getRandomNumberInRange(range);
    var b = _getRandomNumberInRange(range);

    // Ensure non-negative result (a >= b)
    if (a < b) {
      final temp = a;
      a = b;
      b = temp;
    }

    final answer = (a - b).toString();
    return MathQuestion(
      questionText: '$a − $b = ?',
      correctAnswer: answer,
      operation: MathOperation.subtraction,
    );
  }

  MathQuestion _generateMultiplication(NumberRange range) {
    int a;
    int b;

    switch (range) {
      case NumberRange.singleDigit:
        a = _random.nextInt(9) + 1; // 1..9
        b = _random.nextInt(9) + 1; // 1..9
        break;
      case NumberRange.doubleDigit:
        a = _random.nextInt(90) + 10; // 10..99
        b = _random.nextInt(8) + 2; // 2..9 (keep mental math friendly)
        break;
      case NumberRange.tripleDigit:
        a = _random.nextInt(900) + 100; // 100..999
        b = _random.nextInt(8) + 2; // 2..9 (3-digit x 1-digit)
        break;
    }

    final answer = (a * b).toString();
    return MathQuestion(
      questionText: '$a × $b = ?',
      correctAnswer: answer,
      operation: MathOperation.multiplication,
    );
  }

  MathQuestion _generateDivision(NumberRange range) {
    int divisor;
    int quotient;

    switch (range) {
      case NumberRange.singleDigit:
        divisor = _random.nextInt(8) + 2; // 2..9
        quotient = _random.nextInt(4) + 1; // 1..4 so product <= 36
        break;
      case NumberRange.doubleDigit:
        divisor = _random.nextInt(8) + 2; // 2..9
        quotient = _random.nextInt(9) + 2; // 2..10
        break;
      case NumberRange.tripleDigit:
        divisor = _random.nextInt(8) + 2; // 2..9
        quotient = _random.nextInt(40) + 10; // 10..49
        break;
    }

    final dividend = divisor * quotient;
    final answer = quotient.toString();

    return MathQuestion(
      questionText: '$dividend ÷ $divisor = ?',
      correctAnswer: answer,
      operation: MathOperation.division,
    );
  }

  MathQuestion _generateComparison(NumberRange range) {
    // 25% chance of equal numbers
    final isEqual = _random.nextInt(4) == 0;
    final a = _getRandomNumberInRange(range);
    final b = isEqual ? a : _getRandomNumberInRange(range);

    final String answer;
    if (a < b) {
      answer = '<';
    } else if (a > b) {
      answer = '>';
    } else {
      answer = '=';
    }

    return MathQuestion(
      questionText: '$a ? $b',
      correctAnswer: answer,
      operation: MathOperation.comparison,
      isComparison: true,
    );
  }

  int _getRandomNumberInRange(NumberRange range) {
    final count = range.max - range.min + 1;
    return range.min + _random.nextInt(count);
  }
}
