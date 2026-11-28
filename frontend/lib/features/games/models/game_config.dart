import 'package:flutter/material.dart';

/// Supported mathematical operations for the game
enum MathOperation {
  addition('+', 'Qo‘shish', Icons.add_rounded),
  subtraction('−', 'Ayirish', Icons.remove_rounded),
  multiplication('×', 'Ko‘paytirish', Icons.close_rounded),
  division('÷', 'Bo‘lish', Icons.safety_divider_rounded),
  comparison('<>', 'Taqqoslash', Icons.compare_arrows_rounded);

  final String symbol;
  final String label;
  final IconData icon;

  const MathOperation(this.symbol, this.label, this.icon);
}

/// Number range/digits options
enum NumberRange {
  singleDigit('0–9', '1 xonali sonlar', 0, 9),
  doubleDigit('10–99', '2 xonali sonlar', 10, 99),
  tripleDigit('100–999', '3 xonali sonlar', 100, 999);

  final String rangeText;
  final String label;
  final int min;
  final int max;

  const NumberRange(this.rangeText, this.label, this.min, this.max);
}

/// Configuration chosen in the setup wizard
class GameConfig {
  final int? durationMinutes; // null for infinite (Cheksiz)
  final Set<MathOperation> operations;
  final NumberRange numberRange;
  final String team1Name;
  final String team2Name;

  const GameConfig({
    this.durationMinutes = 1,
    this.operations = const {MathOperation.addition},
    this.numberRange = NumberRange.singleDigit,
    this.team1Name = 'Ko‘k jamoa',
    this.team2Name = 'Qizil jamoa',
  });

  bool get isInfinite => durationMinutes == null;

  GameConfig copyWith({
    int? durationMinutes,
    bool clearDuration = false,
    Set<MathOperation>? operations,
    NumberRange? numberRange,
    String? team1Name,
    String? team2Name,
  }) {
    return GameConfig(
      durationMinutes:
          clearDuration ? null : (durationMinutes ?? this.durationMinutes),
      operations: operations ?? this.operations,
      numberRange: numberRange ?? this.numberRange,
      team1Name: team1Name ?? this.team1Name,
      team2Name: team2Name ?? this.team2Name,
    );
  }
}
