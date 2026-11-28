import 'dart:async';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/network/api_client.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/providers/student_provider.dart';
import '../common/game_play_result_dialog.dart';
import '../common/game_rules_dialog.dart';

/// "Tezkor hisob" (Speed Math) Game Screen
/// 60s countdown, consecutive combos, increasing question difficulty,
/// server session start and finish.
class SpeedMathScreen extends ConsumerStatefulWidget {
  const SpeedMathScreen({super.key});

  @override
  ConsumerState<SpeedMathScreen> createState() => _SpeedMathScreenState();
}

class _SpeedMathScreenState extends ConsumerState<SpeedMathScreen> {
  static const int kTotalGameSeconds = 60;
  final math.Random _random = math.Random();

  Timer? _gameTimer;
  int _secondsLeft = kTotalGameSeconds;
  bool _isPlaying = false;
  bool _isFinished = false;

  int _score = 0;
  int _correctCount = 0;
  int _wrongCount = 0;
  int _combo = 0;
  int _maxCombo = 0;

  String? _sessionId;
  bool _isLoading = true;

  // Current problem
  String _problemText = '';
  int _correctAnswer = 0;
  List<int> _options = [];
  int? _selectedAnswer;
  bool? _isCurrentCorrect;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _showRulesAndStart();
    });
  }

  @override
  void dispose() {
    _gameTimer?.cancel();
    super.dispose();
  }

  Future<void> _showRulesAndStart() async {
    final start = await GameRulesDialog.show(
      context,
      title: 'Tezkor hisob',
      description: '60 soniya ichida maksimal misol yeching!',
      icon: Icons.timer_rounded,
      gradient: const [Color(0xFF8B5CF6), Color(0xFF6D28D9)],
      rules: const [
        '60 soniya davomida berilgan misollarni tez va to‘g‘ri yeching.',
        'To‘g‘ri javob +1 ball beradi.',
        'Ketma-ket to‘g‘ri javoblar combo ko‘paytiruvchisini (1x, 2x, 3x) oshiradi!',
        'Qancha ko‘p to‘g‘ri yechsangiz, sonlar murakkablashadi.',
      ],
    );

    if (start == true && mounted) {
      _startGame();
    } else if (mounted) {
      context.pop();
    }
  }

  Future<void> _startGame() async {
    setState(() {
      _isLoading = true;
      _secondsLeft = kTotalGameSeconds;
      _score = 0;
      _correctCount = 0;
      _wrongCount = 0;
      _combo = 0;
      _maxCombo = 0;
      _isFinished = false;
    });

    try {
      final res = await ApiClient().dio.post('/games/tezkor_hisob/start');
      if (res.data['success'] == true) {
        _sessionId = res.data['data']['sessionId'];
      }
    } catch (_) {}

    if (!mounted) return;
    setState(() {
      _isLoading = false;
      _isPlaying = true;
    });

    _generateNextProblem();
    _startTimer();
  }

  void _startTimer() {
    _gameTimer?.cancel();
    _gameTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }
      if (_secondsLeft <= 1) {
        timer.cancel();
        _finishGame();
      } else {
        setState(() => _secondsLeft--);
      }
    });
  }

  void _generateNextProblem() {
    // Difficulty escalates with score
    int num1, num2, answer;
    String op;

    if (_score < 5) {
      // Level 1: Single digit addition / subtraction
      num1 = 2 + _random.nextInt(8);
      num2 = 1 + _random.nextInt(8);
      if (_random.nextBool()) {
        op = '+';
        answer = num1 + num2;
      } else {
        op = '−';
        if (num1 < num2) {
          final t = num1;
          num1 = num2;
          num2 = t;
        }
        answer = num1 - num2;
      }
    } else if (_score < 12) {
      // Level 2: Two digit addition or simple multiplication
      if (_random.nextBool()) {
        num1 = 10 + _random.nextInt(25);
        num2 = 5 + _random.nextInt(20);
        op = '+';
        answer = num1 + num2;
      } else {
        num1 = 2 + _random.nextInt(8);
        num2 = 2 + _random.nextInt(9);
        op = '×';
        answer = num1 * num2;
      }
    } else {
      // Level 3: Mixed (+, -, *, /)
      final type = _random.nextInt(4);
      if (type == 0) {
        num1 = 15 + _random.nextInt(35);
        num2 = 10 + _random.nextInt(30);
        op = '+';
        answer = num1 + num2;
      } else if (type == 1) {
        num1 = 30 + _random.nextInt(50);
        num2 = 10 + _random.nextInt(25);
        op = '−';
        answer = num1 - num2;
      } else if (type == 2) {
        num1 = 3 + _random.nextInt(9);
        num2 = 3 + _random.nextInt(9);
        op = '×';
        answer = num1 * num2;
      } else {
        num2 = 2 + _random.nextInt(7);
        answer = 2 + _random.nextInt(9);
        num1 = num2 * answer;
        op = '÷';
      }
    }

    final Set<int> opts = {answer};
    while (opts.length < 4) {
      final delta = (_random.nextInt(7) + 1) * (_random.nextBool() ? 1 : -1);
      final wrong = answer + delta;
      if (wrong >= 0 && wrong != answer) {
        opts.add(wrong);
      }
    }

    final optList = opts.toList()..shuffle();

    setState(() {
      _problemText = '$num1 $op $num2';
      _correctAnswer = answer;
      _options = optList;
      _selectedAnswer = null;
      _isCurrentCorrect = null;
    });
  }

  void _onAnswerSelected(int ans) {
    if (_selectedAnswer != null || !_isPlaying || _isFinished) return;

    final isCorrect = ans == _correctAnswer;
    setState(() {
      _selectedAnswer = ans;
      _isCurrentCorrect = isCorrect;
    });

    if (isCorrect) {
      HapticFeedback.lightImpact();
      _combo++;
      if (_combo > _maxCombo) _maxCombo = _combo;
      final multiplier = (_combo ~/ 3) + 1; // 1x, 2x, 3x...
      _score += multiplier;
      _correctCount++;
    } else {
      HapticFeedback.heavyImpact();
      _combo = 0;
      _wrongCount++;
    }

    Future.delayed(const Duration(milliseconds: 280), () {
      if (mounted && _isPlaying && !_isFinished) {
        _generateNextProblem();
      }
    });
  }

  Future<void> _finishGame() async {
    _gameTimer?.cancel();
    setState(() {
      _isPlaying = false;
      _isFinished = true;
    });

    final resType = _score >= 12
        ? 'win'
        : _score >= 6
            ? 'draw'
            : 'participated';

    int coinsEarned = 5;
    int xpEarned = 15;
    int remainingPlays = 0;
    bool isPro = false;

    try {
      final res = await ApiClient().dio.post(
        '/games/tezkor_hisob/finish',
        data: {
          'sessionId': _sessionId,
          'result': resType,
          'score': _score,
          'durationSeconds': kTotalGameSeconds - _secondsLeft,
          'correctAnswers': _correctCount,
          'totalQuestions': _correctCount + _wrongCount,
        },
      );

      if (res.data['success'] == true) {
        final d = res.data['data'];
        coinsEarned = d['coinsAwarded'] ?? 20;
        xpEarned = d['xpAwarded'] ?? 35;
        remainingPlays = d['remaining'] ?? 0;
        isPro = d['unlimited'] == true;
        ref.read(studentProvider.notifier).refreshProfile();
      }
    } catch (_) {
      coinsEarned = resType == 'win' ? 20 : resType == 'draw' ? 10 : 5;
    }

    if (!mounted) return;

    GamePlayResultDialog.show(
      context,
      gameTitle: 'Tezkor hisob',
      result: resType,
      score: _score,
      coinsEarned: coinsEarned,
      xpEarned: xpEarned,
      remainingPlays: remainingPlays,
      isPro: isPro,
      stats: [
        {'label': 'Umumiy to‘plangan ball', 'value': '$_score ball'},
        {'label': 'To‘g‘ri javoblar', 'value': '$_correctCount ta'},
        {'label': 'Xatolar', 'value': '$_wrongCount ta'},
        {'label': 'Maksimal combo', 'value': '${_maxCombo}x combo'},
      ],
      onPlayAgain: () {
        Navigator.of(context).pop();
        _startGame();
      },
      onGoHome: () {
        Navigator.of(context).pop();
        context.pop();
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);

    if (_isLoading) {
      return Scaffold(
        backgroundColor: colors.bg,
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    final timerColor = _secondsLeft <= 10 ? const Color(0xFFEF4444) : colors.ink;

    return Scaffold(
      backgroundColor: colors.bg,
      appBar: AppBar(
        backgroundColor: colors.card,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.close_rounded, color: colors.ink),
          onPressed: () => context.pop(),
        ),
        title: Text(
          'Tezkor hisob',
          style: TextStyle(
            color: colors.ink,
            fontSize: 17,
            fontWeight: FontWeight.w900,
          ),
        ),
        centerTitle: true,
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 14),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFF8B5CF6).withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                const Icon(Icons.bolt_rounded,
                    color: Color(0xFF8B5CF6), size: 18),
                const SizedBox(width: 4),
                Text(
                  '$_score',
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF7C3AED),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              // Timer & Combo Status Bar
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: colors.card,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: colors.border),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.timer_rounded, color: timerColor, size: 18),
                        const SizedBox(width: 6),
                        Text(
                          '$_secondsLeft s',
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w900,
                            color: timerColor,
                          ),
                        ),
                      ],
                    ),
                  ),
                  if (_combo >= 2)
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFFF59E0B), Color(0xFFEF4444)],
                        ),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Text(
                        '🔥 ${_combo}x Combo!',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 13,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ),
                ],
              ),
              const Spacer(flex: 1),

              // Main Problem Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 36, horizontal: 20),
                decoration: BoxDecoration(
                  color: colors.card,
                  borderRadius: BorderRadius.circular(28),
                  border: Border.all(color: colors.border, width: 2),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: colors.isDark ? 0.35 : 0.08),
                      blurRadius: 24,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Text(
                      'Hisoblang:',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: colors.muted,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      _problemText,
                      style: TextStyle(
                        fontSize: 48,
                        fontWeight: FontWeight.w900,
                        color: colors.ink,
                        letterSpacing: 2,
                      ),
                    ),
                  ],
                ),
              ),
              const Spacer(flex: 2),

              // 4 Choice Options
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 14,
                  mainAxisSpacing: 14,
                  childAspectRatio: 2.1,
                ),
                itemCount: _options.length,
                itemBuilder: (context, index) {
                  final opt = _options[index];
                  final isSelected = _selectedAnswer == opt;

                  Color btnBg = colors.card;
                  Color borderColor = colors.border;
                  Color textColor = colors.ink;

                  if (isSelected) {
                    if (_isCurrentCorrect == true) {
                      btnBg = const Color(0xFF10B981);
                      borderColor = const Color(0xFF059669);
                      textColor = Colors.white;
                    } else {
                      btnBg = const Color(0xFFEF4444);
                      borderColor = const Color(0xFFDC2626);
                      textColor = Colors.white;
                    }
                  }

                  return InkWell(
                    onTap: () => _onAnswerSelected(opt),
                    borderRadius: BorderRadius.circular(18),
                    child: Container(
                      decoration: BoxDecoration(
                        color: btnBg,
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(color: borderColor, width: 2),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: colors.isDark ? 0.35 : 0.08),
                            blurRadius: 12,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        '$opt',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w900,
                          color: textColor,
                        ),
                      ),
                    ),
                  );
                },
              ),
              const SizedBox(height: 14),
            ],
          ),
        ),
      ),
    );
  }
}
