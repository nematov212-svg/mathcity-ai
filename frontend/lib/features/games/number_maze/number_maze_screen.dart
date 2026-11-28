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

class _MazeStep {
  final String question;
  final int answer;
  final List<int> paths;

  _MazeStep({
    required this.question,
    required this.answer,
    required this.paths,
  });
}

/// "Raqamlar labirinti" (Number Maze) Game Screen
/// 3 lives (hearts), 5 gates to escape the maze, step progression,
/// server session start and finish.
class NumberMazeScreen extends ConsumerStatefulWidget {
  const NumberMazeScreen({super.key});

  @override
  ConsumerState<NumberMazeScreen> createState() => _NumberMazeScreenState();
}

class _NumberMazeScreenState extends ConsumerState<NumberMazeScreen> {
  static const int kTotalGates = 5;
  static const int kMaxLives = 3;

  int _lives = kMaxLives;
  int _currentGate = 1; // 1 to 5
  int _score = 0;
  String? _sessionId;
  bool _isLoading = true;

  late List<_MazeStep> _steps;
  int? _selectedPathIndex;
  bool? _isStepCorrect;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _showRulesAndStart();
    });
  }

  Future<void> _showRulesAndStart() async {
    final start = await GameRulesDialog.show(
      context,
      title: 'Raqamlar labirinti',
      description: 'To‘g‘ri yo‘lni tanlab labirintdan chiqing!',
      icon: Icons.explore_rounded,
      gradient: const [Color(0xFFF59E0B), Color(0xFFD97706)],
      rules: const [
        'Labirintdan chiqish uchun 5 ta darvozadan to‘g‘ri o‘tishingiz kerak.',
        'Har bir darvozada to‘g‘ri hisob-kitobli yo‘lni tanlang.',
        'Sizda 3 ta jon mavjud (❤️❤️❤️).',
        'Har bir xato 1 ta jonni yo‘qotadi. 5-darvozaga yetib boring va g‘olib bo‘ling!',
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
      _lives = kMaxLives;
      _currentGate = 1;
      _score = 0;
      _selectedPathIndex = null;
      _isStepCorrect = null;
    });

    try {
      final res = await ApiClient().dio.post('/games/raqamlar_labirinti/start');
      if (res.data['success'] == true) {
        _sessionId = res.data['data']['sessionId'];
      }
    } catch (_) {}

    _generateSteps();

    if (!mounted) return;
    setState(() => _isLoading = false);
  }

  void _generateSteps() {
    final rand = math.Random();
    final List<_MazeStep> list = [];

    final formulas = [
      {'q': '7 × 8', 'a': 56},
      {'q': '45 + 38', 'a': 83},
      {'q': '72 ÷ 8', 'a': 9},
      {'q': '100 − 47', 'a': 53},
      {'q': '9 × 6', 'a': 54},
      {'q': '64 ÷ 8', 'a': 8},
      {'q': '36 + 49', 'a': 85},
      {'q': '12 × 5', 'a': 60},
    ]..shuffle(rand);

    for (int i = 0; i < kTotalGates; i++) {
      final f = formulas[i];
      final ans = f['a'] as int;
      final Set<int> opts = {ans};
      while (opts.length < 3) {
        final delta = (rand.nextInt(6) + 1) * (rand.nextBool() ? 1 : -1);
        final w = ans + delta;
        if (w >= 0 && w != ans) opts.add(w);
      }
      final pathList = opts.toList()..shuffle(rand);
      list.add(_MazeStep(
        question: f['q'] as String,
        answer: ans,
        paths: pathList,
      ));
    }

    _steps = list;
  }

  void _onChoosePath(int index, int value) {
    if (_selectedPathIndex != null || _lives <= 0) return;

    final step = _steps[_currentGate - 1];
    final isCorrect = value == step.answer;

    setState(() {
      _selectedPathIndex = index;
      _isStepCorrect = isCorrect;
    });

    if (isCorrect) {
      HapticFeedback.mediumImpact();
      _score += 10;

      Future.delayed(const Duration(milliseconds: 600), () {
        if (!mounted) return;
        if (_currentGate >= kTotalGates) {
          _finishGame(isWin: true);
        } else {
          setState(() {
            _currentGate++;
            _selectedPathIndex = null;
            _isStepCorrect = null;
          });
        }
      });
    } else {
      HapticFeedback.heavyImpact();
      setState(() => _lives--);

      Future.delayed(const Duration(milliseconds: 700), () {
        if (!mounted) return;
        if (_lives <= 0) {
          _finishGame(isWin: false);
        } else {
          setState(() {
            _selectedPathIndex = null;
            _isStepCorrect = null;
          });
        }
      });
    }
  }

  Future<void> _finishGame({required bool isWin}) async {
    final resType = isWin ? 'win' : _currentGate >= 3 ? 'draw' : 'participated';

    int coinsEarned = isWin ? 20 : _currentGate >= 3 ? 10 : 5;
    int xpEarned = isWin ? 35 : 15;
    int remainingPlays = 0;
    bool isPro = false;

    try {
      final res = await ApiClient().dio.post(
        '/games/raqamlar_labirinti/finish',
        data: {
          'sessionId': _sessionId,
          'result': resType,
          'score': _score,
          'durationSeconds': 40,
        },
      );

      if (res.data['success'] == true) {
        final d = res.data['data'];
        coinsEarned = d['coinsAwarded'] ?? coinsEarned;
        xpEarned = d['xpAwarded'] ?? xpEarned;
        remainingPlays = d['remaining'] ?? 0;
        isPro = d['unlimited'] == true;
        ref.read(studentProvider.notifier).refreshProfile();
      }
    } catch (_) {}

    if (!mounted) return;

    GamePlayResultDialog.show(
      context,
      gameTitle: 'Raqamlar labirinti',
      result: resType,
      score: _score,
      coinsEarned: coinsEarned,
      xpEarned: xpEarned,
      remainingPlays: remainingPlays,
      isPro: isPro,
      stats: [
        {'label': 'Bosib o‘tilgan darvozalar', 'value': '$_currentGate / $kTotalGates'},
        {'label': 'Qolgan jonlar', 'value': '$_lives ta'},
        {'label': 'Natija', 'value': isWin ? 'Labirintdan chiqildi! 🎉' : 'Labirintda qolib ketildi'},
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

    final currentStep = _steps[_currentGate - 1];

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
          'Raqamlar labirinti',
          style: TextStyle(
            color: colors.ink,
            fontSize: 17,
            fontWeight: FontWeight.w900,
          ),
        ),
        centerTitle: true,
        actions: [
          // Hearts Display
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Row(
              children: List.generate(kMaxLives, (index) {
                final hasHeart = index < _lives;
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 2),
                  child: Icon(
                    Icons.favorite_rounded,
                    color: hasHeart ? const Color(0xFFEF4444) : colors.border,
                    size: 22,
                  ),
                );
              }),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              // Maze Progress Track (5 stages)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: colors.card,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: colors.border),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: List.generate(kTotalGates, (i) {
                    final gateNum = i + 1;
                    final isPassed = gateNum < _currentGate;
                    final isCurrent = gateNum == _currentGate;

                    Color circleBg = colors.bg;
                    Color circleBorder = colors.border;
                    Color textColor = colors.muted;

                    if (isPassed) {
                      circleBg = const Color(0xFF10B981);
                      circleBorder = const Color(0xFF059669);
                      textColor = Colors.white;
                    } else if (isCurrent) {
                      circleBg = const Color(0xFFF59E0B);
                      circleBorder = const Color(0xFFD97706);
                      textColor = Colors.white;
                    }

                    return Row(
                      children: [
                        Container(
                          width: 32,
                          height: 32,
                          decoration: BoxDecoration(
                            color: circleBg,
                            shape: BoxShape.circle,
                            border: Border.all(color: circleBorder, width: 2),
                          ),
                          alignment: Alignment.center,
                          child: isPassed
                              ? const Icon(Icons.check_rounded, color: Colors.white, size: 18)
                              : Text(
                                  '$gateNum',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w900,
                                    color: textColor,
                                  ),
                                ),
                        ),
                        if (i < kTotalGates - 1)
                          Container(
                            width: 24,
                            height: 3,
                            color: isPassed ? const Color(0xFF10B981) : colors.border,
                          ),
                      ],
                    );
                  }),
                ),
              ),
              const Spacer(flex: 1),

              // Gate Problem Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF78350F), Color(0xFF451A03)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(26),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF78350F).withValues(alpha: 0.35),
                      blurRadius: 20,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.door_front_door_rounded,
                            color: Color(0xFFFBBF24), size: 24),
                        const SizedBox(width: 8),
                        Text(
                          '$_currentGate-darvoza kaliti',
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFFFDE68A),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(
                      currentStep.question,
                      style: const TextStyle(
                        fontSize: 44,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                        letterSpacing: 2,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'To‘g‘ri yo‘lni tanlang va oldinga yuring:',
                      style: TextStyle(
                        fontSize: 12.5,
                        fontWeight: FontWeight.w600,
                        color: Colors.white70,
                      ),
                    ),
                  ],
                ),
              ),
              const Spacer(flex: 2),

              // 3 Path options
              Column(
                children: List.generate(currentStep.paths.length, (index) {
                  final val = currentStep.paths[index];
                  final isSelected = _selectedPathIndex == index;

                  Color bg = colors.card;
                  Color border = colors.border;
                  Color text = colors.ink;

                  if (isSelected) {
                    if (_isStepCorrect == true) {
                      bg = const Color(0xFF10B981);
                      border = const Color(0xFF059669);
                      text = Colors.white;
                    } else {
                      bg = const Color(0xFFEF4444);
                      border = const Color(0xFFDC2626);
                      text = Colors.white;
                    }
                  }

                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: InkWell(
                      onTap: () => _onChoosePath(index, val),
                      borderRadius: BorderRadius.circular(18),
                      child: Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
                        decoration: BoxDecoration(
                          color: bg,
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(color: border, width: 2),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: colors.isDark ? 0.35 : 0.08),
                              blurRadius: 10,
                              offset: const Offset(0, 3),
                            ),
                          ],
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Container(
                                  width: 30,
                                  height: 30,
                                  decoration: BoxDecoration(
                                    color: border.withValues(alpha: 0.2),
                                    shape: BoxShape.circle,
                                  ),
                                  alignment: Alignment.center,
                                  child: Text(
                                    String.fromCharCode(65 + index),
                                    style: TextStyle(
                                      fontWeight: FontWeight.w900,
                                      color: text,
                                      fontSize: 14,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 14),
                                Text(
                                  'Yo‘l: $val',
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.w900,
                                    color: text,
                                  ),
                                ),
                              ],
                            ),
                            Icon(
                              Icons.arrow_forward_rounded,
                              color: text,
                              size: 20,
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                }),
              ),
              const SizedBox(height: 10),
            ],
          ),
        ),
      ),
    );
  }
}
