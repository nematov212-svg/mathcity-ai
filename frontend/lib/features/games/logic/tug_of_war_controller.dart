import 'dart:async';
import 'package:flutter/material.dart';
import '../models/game_config.dart';
import '../models/team.dart';
import 'question_generator.dart';

/// Maximum steps the rope marker can move in either direction to trigger instant win
const int kMaxRopePullSteps = 5;

/// Result of submitting an answer
enum AnswerResult {
  correct,
  wrong,
  empty,
}

/// Final summary data passed to GameResultDialog
class GameResult {
  final Team? winner;
  final bool isDraw;
  final Team team1;
  final Team team2;
  final int durationSeconds;

  const GameResult({
    required this.winner,
    required this.isDraw,
    required this.team1,
    required this.team2,
    required this.durationSeconds,
  });
}

/// Controller managing Tug of War state, questions, timer, and win conditions
class TugOfWarController extends ChangeNotifier {
  final GameConfig config;
  final QuestionGenerator _questionGenerator;
  final void Function(GameResult result)? onGameFinished;

  late final Team team1;
  late final Team team2;

  int _ropeMarker = 0; // -5 (Team 1 wins) to +5 (Team 2 wins)
  int? _remainingSeconds;
  int _elapsedSeconds = 0;
  bool _isGameOver = false;
  Team? _winner;
  bool _isDraw = false;

  late MathQuestion _team1Question;
  late MathQuestion _team2Question;

  String _team1Input = '';
  String _team2Input = '';

  Timer? _timer;
  bool _isPaused = false;

  TugOfWarController({
    required this.config,
    QuestionGenerator? questionGenerator,
    this.onGameFinished,
  }) : _questionGenerator = questionGenerator ?? QuestionGenerator() {
    team1 = Team(
      id: 1,
      name: config.team1Name.trim().isEmpty ? 'Ko‘k jamoa' : config.team1Name,
      primaryColor: const Color(0xFF2563EB),
      darkPrimaryColor: const Color(0xFF60A5FA),
      lightBgColor: const Color(0xFFEFF6FF),
      darkBgColor: const Color(0xFF172554),
    );

    team2 = Team(
      id: 2,
      name: config.team2Name.trim().isEmpty ? 'Qizil jamoa' : config.team2Name,
      primaryColor: const Color(0xFFDC2626),
      darkPrimaryColor: const Color(0xFFF87171),
      lightBgColor: const Color(0xFFFEF2F2),
      darkBgColor: const Color(0xFF450A0A),
    );

    _ropeMarker = 0;
    _remainingSeconds =
        config.durationMinutes != null ? config.durationMinutes! * 60 : null;

    _team1Question = _questionGenerator.generateQuestion(config);
    _team2Question = _questionGenerator.generateQuestion(config);

    _startTimer();
  }

  // Getters
  int get ropeMarker => _ropeMarker;
  int? get remainingSeconds => _remainingSeconds;
  int get elapsedSeconds => _elapsedSeconds;
  bool get isGameOver => _isGameOver;
  Team? get winner => _winner;
  bool get isDraw => _isDraw;
  MathQuestion get team1Question => _team1Question;
  MathQuestion get team2Question => _team2Question;
  String get team1Input => _team1Input;
  String get team2Input => _team2Input;
  bool get isInfinite => config.isInfinite;
  bool get isPaused => _isPaused;

  void _startTimer() {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_isPaused || _isGameOver) return;

      _elapsedSeconds++;

      if (_remainingSeconds != null) {
        if (_remainingSeconds! > 0) {
          _remainingSeconds = _remainingSeconds! - 1;
          notifyListeners();
        }

        if (_remainingSeconds! <= 0) {
          _handleTimeUp();
        }
      } else {
        notifyListeners();
      }
    });
  }

  void pauseTimer() {
    _isPaused = true;
  }

  void resumeTimer() {
    _isPaused = false;
  }

  /// Appends digit or input for team (1 or 2)
  void inputChar(int teamId, String char) {
    if (_isGameOver) return;

    if (teamId == 1) {
      if (_team1Question.isComparison) {
        // Direct comparison symbol input
        _team1Input = char;
      } else {
        if (_team1Input.length < 5) {
          _team1Input += char;
        }
      }
    } else {
      if (_team2Question.isComparison) {
        _team2Input = char;
      } else {
        if (_team2Input.length < 5) {
          _team2Input += char;
        }
      }
    }
    notifyListeners();
  }

  /// Clears current input for team
  void clearInput(int teamId) {
    if (_isGameOver) return;

    if (teamId == 1) {
      _team1Input = '';
    } else {
      _team2Input = '';
    }
    notifyListeners();
  }

  /// Submits answer for a team and checks correctness
  AnswerResult submitAnswer(int teamId) {
    if (_isGameOver) return AnswerResult.empty;

    final input = teamId == 1 ? _team1Input.trim() : _team2Input.trim();
    final question = teamId == 1 ? _team1Question : _team2Question;

    if (input.isEmpty) {
      return AnswerResult.empty;
    }

    final isCorrect = input == question.correctAnswer.trim();

    if (isCorrect) {
      if (teamId == 1) {
        team1.score++;
        team1.correctAnswers++;
        _team1Input = '';
        _ropeMarker--; // Pull left
        _team1Question = _questionGenerator.generateQuestion(
          config,
          lastQuestionText: _team1Question.questionText,
        );
      } else {
        team2.score++;
        team2.correctAnswers++;
        _team2Input = '';
        _ropeMarker++; // Pull right
        _team2Question = _questionGenerator.generateQuestion(
          config,
          lastQuestionText: _team2Question.questionText,
        );
      }

      // Check boundary win condition
      if (_ropeMarker <= -kMaxRopePullSteps) {
        _finishGame(winner: team1, isDraw: false);
      } else if (_ropeMarker >= kMaxRopePullSteps) {
        _finishGame(winner: team2, isDraw: false);
      }

      notifyListeners();
      return AnswerResult.correct;
    } else {
      // Wrong answer
      if (teamId == 1) {
        team1.wrongAnswers++;
        _team1Input = '';
      } else {
        team2.wrongAnswers++;
        _team2Input = '';
      }
      notifyListeners();
      return AnswerResult.wrong;
    }
  }

  void _handleTimeUp() {
    if (_isGameOver) return;

    if (_ropeMarker < 0) {
      // Pulled toward team 1
      _finishGame(winner: team1, isDraw: false);
    } else if (_ropeMarker > 0) {
      // Pulled toward team 2
      _finishGame(winner: team2, isDraw: false);
    } else {
      // Marker in exact center: compare scores
      if (team1.score > team2.score) {
        _finishGame(winner: team1, isDraw: false);
      } else if (team2.score > team1.score) {
        _finishGame(winner: team2, isDraw: false);
      } else {
        // Exact tie
        _finishGame(winner: null, isDraw: true);
      }
    }
  }

  void _finishGame({required Team? winner, required bool isDraw}) {
    if (_isGameOver) return;

    _isGameOver = true;
    _winner = winner;
    _isDraw = isDraw;
    _timer?.cancel();

    final result = GameResult(
      winner: _winner,
      isDraw: _isDraw,
      team1: team1,
      team2: team2,
      durationSeconds: _elapsedSeconds,
    );

    onGameFinished?.call(result);
    notifyListeners();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
