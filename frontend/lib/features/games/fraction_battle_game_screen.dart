import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/network/api_client.dart';
import '../../core/widgets/coin_badge.dart';
import '../../shared/providers/student_provider.dart';

class FractionBattleGameScreen extends ConsumerStatefulWidget {
  const FractionBattleGameScreen({super.key});

  @override
  ConsumerState<FractionBattleGameScreen> createState() => _FractionBattleGameScreenState();
}

class _FractionBattleGameScreenState extends ConsumerState<FractionBattleGameScreen> {
  int _currentQuestionIndex = 0;
  final int _totalQuestions = 10;
  int _lives = 3;
  int _correctCount = 0;
  int _score = 0;

  bool _isAnswered = false;
  String? _selectedOperator;
  String? _hintMessage;

  late List<_FractionQuestion> _questions;

  @override
  void initState() {
    super.initState();
    _initQuestions();
  }

  void _initQuestions() {
    _questions = [
      _FractionQuestion(
        levelTitle: '01 • KASRLAR OROLI',
        fANum: 3,
        fADen: 4,
        fBNum: 1,
        fBDen: 2,
        correctOperator: '>',
      ),
      _FractionQuestion(
        levelTitle: '01 • KASRLAR OROLI',
        fANum: 2,
        fADen: 4,
        fBNum: 1,
        fBDen: 2,
        correctOperator: '=',
      ),
      _FractionQuestion(
        levelTitle: '02 • KASRLAR BO‘G‘OZI',
        fANum: 1,
        fADen: 4,
        fBNum: 2,
        fBDen: 4,
        correctOperator: '<',
      ),
      _FractionQuestion(
        levelTitle: '02 • KASRLAR BO‘G‘OZI',
        fANum: 2,
        fADen: 3,
        fBNum: 1,
        fBDen: 3,
        correctOperator: '>',
      ),
      _FractionQuestion(
        levelTitle: '03 • PIROT KASRLAR',
        fANum: 3,
        fADen: 6,
        fBNum: 1,
        fBDen: 2,
        correctOperator: '=',
      ),
      _FractionQuestion(
        levelTitle: '03 • PIROT KASRLAR',
        fANum: 4,
        fADen: 6,
        fBNum: 5,
        fBDen: 6,
        correctOperator: '<',
      ),
      _FractionQuestion(
        levelTitle: '04 • OLTIN QUTI KASRLARI',
        fANum: 5,
        fADen: 8,
        fBNum: 3,
        fBDen: 8,
        correctOperator: '>',
      ),
      _FractionQuestion(
        levelTitle: '04 • OLTIN QUTI KASRLARI',
        fANum: 2,
        fADen: 4,
        fBNum: 4,
        fBDen: 8,
        correctOperator: '=',
      ),
      _FractionQuestion(
        levelTitle: '05 • KASRLAR SHAHRI',
        fANum: 3,
        fADen: 5,
        fBNum: 4,
        fBDen: 5,
        correctOperator: '<',
      ),
      _FractionQuestion(
        levelTitle: '05 • KASRLAR SHAHRI',
        fANum: 7,
        fADen: 8,
        fBNum: 3,
        fBDen: 4,
        correctOperator: '>',
      ),
    ];
  }

  void _onOperatorSelected(String operator) {
    if (_isAnswered) return;

    final currentQ = _questions[_currentQuestionIndex];
    final isCorrect = operator == currentQ.correctOperator;

    setState(() {
      _isAnswered = true;
      _selectedOperator = operator;
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
          _selectedOperator = null;
          _hintMessage = null;
        });
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
    } catch (_) {}

    ref.read(studentProvider.notifier).updateCoins(-5);
    final currentQ = _questions[_currentQuestionIndex];
    final valA = currentQ.fANum / currentQ.fADen;
    final valB = currentQ.fBNum / currentQ.fBDen;

    setState(() {
      _hintMessage =
          '✦ Maslahat: ${currentQ.fANum}/${currentQ.fADen} (${valA.toStringAsFixed(2)}) va ${currentQ.fBNum}/${currentQ.fBDen} (${valB.toStringAsFixed(2)})';
    });
  }

  Future<void> _finishGame() async {
    int earnedCoins = 40;
    int earnedXP = 50;

    try {
      final res = await ApiClient().dio.post('/games/kasrlar-jangi/result', data: {
        'score': _score,
        'correctAnswersCount': _correctCount,
        'level': 2,
      });

      if (res.data['success'] == true) {
        earnedCoins = res.data['data']['coinsEarned'] ?? 40;
        earnedXP = res.data['data']['xpEarned'] ?? 50;
        await ref.read(studentProvider.notifier).refreshProfile();
      }
    } catch (e) {
      debugPrint('Fraction game submit fallback: $e');
    }

    if (!mounted) return;

    context.pushReplacement(
      '/kids/games/result',
      extra: {
        'gameTitle': 'Kasrlar jangi',
        'totalQuestions': _totalQuestions,
        'correctAnswersCount': _correctCount,
        'coinsEarned': earnedCoins,
        'xpEarned': earnedXP,
        'isFractionBattle': true,
      },
    );
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
                          'Kasrlar jangi',
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
                        '$_lives ta jon  •  +40 tanga',
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

            // Content
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                children: [
                  // Warm Cream Question Card
                  Container(
                    padding: const EdgeInsets.all(22),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFFBEB),
                      borderRadius: BorderRadius.circular(32),
                      border: Border.all(color: const Color(0xFFFDE68A), width: 1.2),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF92400E).withOpacity(0.06),
                          blurRadius: 18,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          currentQ.levelTitle,
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF92400E),
                            letterSpacing: 0.8,
                          ),
                        ),
                        const SizedBox(height: 10),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Qaysi kasr\nkattaroq?',
                              style: TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFF1E1B4B),
                                height: 1.2,
                              ),
                            ),
                            Image.asset(
                              'assets/games/fraction_island.png',
                              width: 86,
                              height: 86,
                              fit: BoxFit.contain,
                              errorBuilder: (_, __, ___) => const Icon(
                                Icons.pie_chart_rounded,
                                size: 55,
                                color: Color(0xFFD97706),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),

                        // Visual Fractions Comparison Row
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            // Fraction A (Purple)
                            Column(
                              children: [
                                SizedBox(
                                  width: 96,
                                  height: 96,
                                  child: CustomPaint(
                                    painter: _PieChartPainter(
                                      numerator: currentQ.fANum,
                                      denominator: currentQ.fADen,
                                      fillColor: const Color(0xFF8B5CF6),
                                      emptyColor: const Color(0xFFEDE9FE),
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 10),
                                Text(
                                  '${currentQ.fANum}/${currentQ.fADen}',
                                  style: const TextStyle(
                                    fontSize: 22,
                                    fontWeight: FontWeight.w900,
                                    color: Color(0xFF1E1B4B),
                                  ),
                                ),
                              ],
                            ),

                            // Center Question Mark Pill
                            Container(
                              width: 38,
                              height: 38,
                              decoration: const BoxDecoration(
                                color: Colors.white,
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(
                                    color: Color(0x10000000),
                                    blurRadius: 8,
                                    offset: Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: const Center(
                                child: Text(
                                  '?',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w800,
                                    color: Color(0xFF64748B),
                                  ),
                                ),
                              ),
                            ),

                            // Fraction B (Coral/Orange)
                            Column(
                              children: [
                                SizedBox(
                                  width: 96,
                                  height: 96,
                                  child: CustomPaint(
                                    painter: _PieChartPainter(
                                      numerator: currentQ.fBNum,
                                      denominator: currentQ.fBDen,
                                      fillColor: const Color(0xFFFB923C),
                                      emptyColor: const Color(0xFFFFEDD5),
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 10),
                                Text(
                                  '${currentQ.fBNum}/${currentQ.fBDen}',
                                  style: const TextStyle(
                                    fontSize: 22,
                                    fontWeight: FontWeight.w900,
                                    color: Color(0xFF1E1B4B),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 22),

                  // "To‘g‘ri belgini tanlang"
                  const Text(
                    'To‘g‘ri belgini tanlang',
                    style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF1E1B4B),
                    ),
                  ),

                  const SizedBox(height: 12),

                  // 3 Operator Buttons: < , = , >
                  Row(
                    children: ['<', '=', '>'].map((op) {
                      final isSelected = _selectedOperator == op;
                      final isCorrect = op == currentQ.correctOperator;

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

                      return Expanded(
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 5),
                          child: InkWell(
                            onTap: _isAnswered ? null : () => _onOperatorSelected(op),
                            borderRadius: BorderRadius.circular(18),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 180),
                              height: 64,
                              decoration: BoxDecoration(
                                color: bgColor,
                                borderRadius: BorderRadius.circular(18),
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
                                  op,
                                  style: TextStyle(
                                    fontSize: 26,
                                    fontWeight: FontWeight.w800,
                                    color: textColor,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),

                  const SizedBox(height: 18),

                  // Hint message if active
                  if (_hintMessage != null) ...[
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFEF3C7),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Text(
                        _hintMessage!,
                        style: const TextStyle(
                          fontSize: 12.5,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF92400E),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                  ],

                  // Reminder Card (Eslatma)
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
                    ),
                    child: const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Eslatma',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF6B42F5),
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Bo‘laklar soniga emas, ularning umumiy kattaligiga e’tibor bering.',
                          style: TextStyle(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w500,
                            color: Color(0xFF64748B),
                            height: 1.3,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 18),

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

class _FractionQuestion {
  final String levelTitle;
  final int fANum;
  final int fADen;
  final int fBNum;
  final int fBDen;
  final String correctOperator;

  _FractionQuestion({
    required this.levelTitle,
    required this.fANum,
    required this.fADen,
    required this.fBNum,
    required this.fBDen,
    required this.correctOperator,
  });
}

class _PieChartPainter extends CustomPainter {
  final int numerator;
  final int denominator;
  final Color fillColor;
  final Color emptyColor;

  _PieChartPainter({
    required this.numerator,
    required this.denominator,
    required this.fillColor,
    required this.emptyColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;

    final segmentAngle = (2 * math.pi) / denominator;

    final emptyPaint = Paint()
      ..color = emptyColor
      ..style = PaintingStyle.fill;

    final fillPaint = Paint()
      ..color = fillColor
      ..style = PaintingStyle.fill;

    final dividerPaint = Paint()
      ..color = Colors.white
      ..strokeWidth = 2.5
      ..style = PaintingStyle.stroke;

    for (int i = 0; i < denominator; i++) {
      final startAngle = -math.pi / 2 + (i * segmentAngle);
      final isFilled = i < numerator;

      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        startAngle,
        segmentAngle,
        true,
        isFilled ? fillPaint : emptyPaint,
      );

      // Draw dividing ray
      final endX = center.dx + radius * math.cos(startAngle);
      final endY = center.dy + radius * math.sin(startAngle);
      canvas.drawLine(center, Offset(endX, endY), dividerPaint);
    }

    // Outer circle border
    final borderPaint = Paint()
      ..color = Colors.white
      ..strokeWidth = 2.5
      ..style = PaintingStyle.stroke;
    canvas.drawCircle(center, radius, borderPaint);
  }

  @override
  bool shouldRepaint(covariant _PieChartPainter oldDelegate) =>
      oldDelegate.numerator != numerator ||
      oldDelegate.denominator != denominator ||
      oldDelegate.fillColor != fillColor;
}
