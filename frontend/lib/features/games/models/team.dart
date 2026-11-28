import 'package:flutter/material.dart';

/// Model representing a team in the Tug of War game
class Team {
  final int id;
  final String name;
  final Color primaryColor;
  final Color darkPrimaryColor;
  final Color lightBgColor;
  final Color darkBgColor;
  int score;
  int correctAnswers;
  int wrongAnswers;

  Team({
    required this.id,
    required this.name,
    required this.primaryColor,
    required this.darkPrimaryColor,
    required this.lightBgColor,
    required this.darkBgColor,
    this.score = 0,
    this.correctAnswers = 0,
    this.wrongAnswers = 0,
  });

  Color getPrimaryColor(bool isDark) =>
      isDark ? darkPrimaryColor : primaryColor;

  Color getBgColor(bool isDark) => isDark ? darkBgColor : lightBgColor;

  Team copyWith({
    String? name,
    int? score,
    int? correctAnswers,
    int? wrongAnswers,
  }) {
    return Team(
      id: id,
      name: name ?? this.name,
      primaryColor: primaryColor,
      darkPrimaryColor: darkPrimaryColor,
      lightBgColor: lightBgColor,
      darkBgColor: darkBgColor,
      score: score ?? this.score,
      correctAnswers: correctAnswers ?? this.correctAnswers,
      wrongAnswers: wrongAnswers ?? this.wrongAnswers,
    );
  }
}
