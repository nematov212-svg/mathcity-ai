import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/network/api_client.dart';
import '../../core/widgets/coin_badge.dart';
import '../../shared/providers/student_provider.dart';

class SpaceMathGameScreen extends ConsumerStatefulWidget {
  const SpaceMathGameScreen({super.key});

  @override
  ConsumerState<SpaceMathGameScreen> createState() => _SpaceMathGameScreenState();
}

class _SpaceMathGameScreenState extends ConsumerState<SpaceMathGameScreen> {
  int _currentQuestionIndex = 0;
  final int _totalQuestions = 10;
  int _lives = 3;
  int _correctCount = 0;
  int _score = 0;
  int _secondsLeft = 25;
  Timer? _timer;

  bool _isAnswered = false;
  String? _selectedAnswer;
  List<String> _hiddenOptions = [];

  // Question data
  late List<_SpaceQuestion> _questions;

  @override
  void initState() {
    super.initState();
    _initQuestions();
    _startTimer();
  }

  void _initQuestions() {
    _questions = [
      _SpaceQuestion(
        levelTitle: '01 • OYGA PARVOZ',
        equation: '7 + 5 = ?',
        correctAnswer: '12',
        options: ['10', '11', '12', '14'],
      ),
      _SpaceQuestion(
        levelTitle: '02 • MARS BEKATI',
        equation: '15 - 6 = ?',
        correctAnswer: '9',
        options: ['8', '9', '11', '7'],
      ),
      _SpaceQuestion(
        levelTitle: '02 • YUPITERGA YO‘L',
        equation: '12 + 8 = ?',
        correctAnswer: '20',
        options: ['16', '18', '20', '24'],
      ),
      _SpaceQuestion(
        levelTitle: '03 • SATURN HALQALARI',
        equation: '6 × 4 = ?',
        correctAnswer: '24',
        options: ['20', '24', '28', '18'],
      ),
      _SpaceQuestion(
        levelTitle: '03 • URAN SOVUQLIGI',
        equation: '30 - 13 = ?',
        correctAnswer: '17',
        options: ['15', '16', '17', '19'],
      ),
      _SpaceQuestion(
        levelTitle: '04 • NEPTUN BO‘RONI',
        equation: '8 × 3 = ?',
        correctAnswer: '24',
        options: ['21', '24', '26', '28'],
      ),
      _SpaceQuestion(
        levelTitle: '04 • PLUTON CHEGARASI',
        equation: '45 - 20 = ?',
        correctAnswer: '25',
        options: ['20', '25', '30', '15'],
      ),
      _SpaceQuestion(
        levelTitle: '05 • GALAKTIKA MARKAZI',
        equation: '9 × 5 = ?',
        correctAnswer: '45',
        options: ['40', '45', '50', '35'],
      ),
      _SpaceQuestion(
        levelTitle: '05 • SUPERNOVA YULDUZI',
        equation: '18 + 14 = ?',
        correctAnswer: '32',
        options: ['30', '31', '32', '34'],
      ),
      _SpaceQuestion(
        levelTitle: '06 • KOINOT CHEKSIZLIGI',
        equation: '60 ÷ 5 = ?',
        correctAnswer: '12',
        options: ['10', '11', '12', '15'],
      ),
    ];
  }

  void _startTimer() {
    _timer?.cancel();
    _secondsLeft = 25;
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (!mounted) return;
      if (_secondsLeft > 0) {
        setState(() => _secondsLeft--);
      } else {
        _handleTimeUp();
      }
    });
  }

  void _handleTimeUp() {
    _timer?.cancel();
    if (_isAnswered) return;
    _onAnswerSelected('TIMEOUT');
  }

  void _onAnswerSelected(String answer) {
    if (_isAnswered) return;
    _timer?.cancel();

    final currentQ = _questions[_currentQuestionIndex];
    final isCorrect = answer == currentQ.correctAnswer;

    setState(() {
      _isAnswered = true;
      _selectedAnswer = answer;
      if (isCorrect) {
        _correctCount++;
        _score += 10;
      } else {
        _lives--;
      }
    });

    Future.delayed(const Duration(milliseconds: 900), () {
      if (!mounted) return;
      if (_lives <= 0 || _currentQuestionIndex >= _totalQuestions - 1) {
        _finishGame();
      } else {
        setState(() {
          _currentQuestionIndex++;
          _isAnswered = false;
          _selectedAnswer = null;
          _hiddenOptions.clear();
        });
        _startTimer();
      }
    });
  }

  Future<void> _handleUseHint() async {
    if (_isAnswered) return;
    final currentCoins = ref.read(studentProvider).student?.coinBalance ?? 0;
    if (currentCoins < 5) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Yordam olish uchun tangalar yetarli emas (5 tanga kerak).'),
        ),
      );
      return;
    }

    try {
      await ApiClient().dio.post('/games/hint');
      ref.read(studentProvider.notifier).updateCoins(-5);

      if (!mounted) return;

      final currentQ = _questions[_currentQuestionIndex];
      final wrongs = currentQ.options.where((o) => o != currentQ.correctAnswer).toList();
      wrongs.shuffle();
      setState(() {
        _hiddenOptions = wrongs.take(2).toList();
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('✦ 2 ta noto‘g‘ri variant olib tashlandi! (-5 tanga)'),
          duration: Duration(seconds: 2),
        ),
      );
    } catch (_) {
      // Local fallback
      ref.read(studentProvider.notifier).updateCoins(-5);
      final currentQ = _questions[_currentQuestionIndex];
      final wrongs = currentQ.options.where((o) => o != currentQ.correctAnswer).toList();
      wrongs.shuffle();
      setState(() {
        _hiddenOptions = wrongs.take(2).toList();
      });
    }
  }

  Future<void> _finishGame() async {
    _timer?.cancel();

    // Submit results to backend to credit real coins and XP
    int earnedCoins = 30;
    int earnedXP = 40;

    try {
      final res = await ApiClient().dio.post('/games/kosmik-hisob/result', data: {
        'score': _score,
        'correctAnswersCount': _correctCount,
        'level': 2,
      });

      if (res.data['success'] == true) {
        earnedCoins = res.data['data']['coinsEarned'] ?? 30;
        earnedXP = res.data['data']['xpEarned'] ?? 40;
        await ref.read(studentProvider.notifier).refreshProfile();
      }
    } catch (e) {
      debugPrint('Game submit local fallback: $e');
    }

    if (!mounted) return;

    context.pushReplacement(
      '/kids/games/result',
      extra: {
        'gameTitle': 'Kosmik hisob',
        'totalQuestions': _totalQuestions,
        'correctAnswersCount': _correctCount,
        'coinsEarned': earnedCoins,
        'xpEarned': earnedXP,
        'isFractionBattle': false,
      },
    );
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final coinBalance = ref.watch(studentProvider).student?.coinBalance ?? 0;
    final currentQ = _questions[_currentQuestionIndex];
    final progress = (_currentQuestionIndex + 1) / _totalQuestions;

    return Scaffold(
      backgroundColor: const Color(0xFFF9F8FE),
      body: SafeArea(
        child: Column(
          children: [
            // Top App Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  InkWell(
                    onTap: () => context.pop(),
                    borderRadius: BorderRadius.circular(12),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.arrow_back_ios_new_rounded,
                          size: 18,
                          color: Color(0xFF1E1B4B),
                        ),
                        SizedBox(width: 8),
                        Text(
                          'Kosmik hisob',
                          style: TextStyle(
                            fontSize: 19,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF1E1B4B),
                          ),
                        ),
                      ],
                    ),
                  ),
                  CoinBadge(count: coinBalance, size: 22),
                ],
              ),
            ),

            // Progress Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'SAVOL ${_currentQuestionIndex + 1} / $_totalQuestions',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF6B42F5),
                          letterSpacing: 0.5,
                        ),
                      ),
                      Text(
                        '$_lives ta jon  •  +30 tanga',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF64748B),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: LinearProgressIndicator(
                      value: progress,
                      backgroundColor: const Color(0xFFEDE9FE),
                      valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF6B42F5)),
                      minHeight: 6,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 12),

            // Dark Cosmic Question Card
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                children: [
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: const Color(0xFF131428),
                      borderRadius: BorderRadius.circular(32),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF131428).withOpacity(0.35),
                          blurRadius: 22,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            currentQ.levelTitle,
                            style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF38BDF8),
                              letterSpacing: 0.8,
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        Image.asset(
                          'assets/games/kosmik_rocket.png',
                          width: 140,
                          height: 110,
                          fit: BoxFit.contain,
                          errorBuilder: (_, __, ___) => const Icon(
                            Icons.rocket_launch_rounded,
                            size: 70,
                            color: Colors.white60,
                          ),
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          'Raketamizga kuch bering!',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFFE2E8F0),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          currentQ.equation,
                          style: const TextStyle(
                            fontSize: 34,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                            letterSpacing: 1.5,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 22),

                  // "Javobni tanlang" & Timer Row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Javobni tanlang',
                        style: TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF1E1B4B),
                        ),
                      ),
                      Row(
                        children: [
                          const Icon(Icons.timer_outlined, size: 16, color: Color(0xFF94A3B8)),
                          const SizedBox(width: 4),
                          Text(
                            '00:${_secondsLeft.toString().padLeft(2, '0')}',
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                              color: _secondsLeft <= 5 ? Colors.red : const Color(0xFF64748B),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),

                  const SizedBox(height: 14),

                  // 2x2 Answer Grid
                  GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    mainAxisSpacing: 12,
                    crossAxisSpacing: 12,
                    childAspectRatio: 2.1,
                    children: currentQ.options.map((option) {
                      final isHidden = _hiddenOptions.contains(option);
                      if (isHidden) {
                        return const SizedBox.shrink();
                      }
                      final isSelected = _selectedAnswer == option;
                      final isCorrect = option == currentQ.correctAnswer;

                      Color bgColor = Colors.white;
                      Color borderColor = const Color(0xFFE2E8F0);
                      Color textColor = const Color(0xFF1E1B4B);

                      if (_isAnswered) {
                        if (isSelected) {
                          if (isCorrect) {
                            bgColor = const Color(0xFFDCFCE7);
                            borderColor = const Color(0xFF22C55E);
                            textColor = const Color(0xFF15803D);
                          } else {
                            bgColor = const Color(0xFFFEE2E2);
                            borderColor = const Color(0xFFEF4444);
                            textColor = const Color(0xFFB91C1C);
                          }
                        } else if (isCorrect) {
                          bgColor = const Color(0xFFDCFCE7);
                          borderColor = const Color(0xFF22C55E);
                          textColor = const Color(0xFF15803D);
                        }
                      } else if (isSelected) {
                        bgColor = const Color(0xFFF3E8FF);
                        borderColor = const Color(0xFF7C5CF8);
                        textColor = const Color(0xFF6B42F5);
                      }

                      return InkWell(
                        onTap: _isAnswered ? null : () => _onAnswerSelected(option),
                        borderRadius: BorderRadius.circular(20),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 180),
                          decoration: BoxDecoration(
                            color: bgColor,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: borderColor, width: 1.6),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFF1E1B4B).withOpacity(0.04),
                                blurRadius: 10,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: Center(
                            child: Text(
                              option,
                              style: TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.w800,
                                color: textColor,
                              ),
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),

                  const SizedBox(height: 20),

                  // Hint Button
                  Center(
                    child: InkWell(
                      onTap: _handleUseHint,
                      borderRadius: BorderRadius.circular(20),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFEF9C3),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xFFFDE047), width: 1),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              '✦ Yordam olish  •  -5 ',
                              style: TextStyle(
                                fontSize: 12.5,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF854D0E),
                              ),
                            ),
                            CoinIcon(size: 14),
                          ],
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Motivational Footer Text
                  const Center(
                    child: Text(
                      'O‘rganishda davom eting. Har bir urinish — yutuq!',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF94A3B8),
                      ),
                    ),
                  ),

                  const SizedBox(height: 20),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SpaceQuestion {
  final String levelTitle;
  final String equation;
  final String correctAnswer;
  final List<String> options;

  _SpaceQuestion({
    required this.levelTitle,
    required this.equation,
    required this.correctAnswer,
    required this.options,
  });
}
