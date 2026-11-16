import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/widgets/coin_badge.dart';
import '../../core/widgets/custom_button.dart';
import '../../shared/providers/student_provider.dart';

class SpaceMathGameScreen extends ConsumerStatefulWidget {
  const SpaceMathGameScreen({super.key});

  @override
  ConsumerState<SpaceMathGameScreen> createState() => _SpaceMathGameScreenState();
}

class _SpaceMathGameScreenState extends ConsumerState<SpaceMathGameScreen> {
  int _score = 0;
  int _lives = 3;
  int _currentQuestionIndex = 0;
  int _secondsLeft = 15;
  Timer? _timer;
  bool _isGameOver = false;
  String? _feedbackState; // 'correct', 'wrong', null

  final List<Map<String, dynamic>> _questions = [
    {
      'prompt': '7 + 8 = ?',
      'options': ['14', '15', '16', '13'],
      'correct': '15',
    },
    {
      'prompt': '12 - 5 = ?',
      'options': ['7', '6', '8', '9'],
      'correct': '7',
    },
    {
      'prompt': '4 × 6 = ?',
      'options': ['20', '22', '24', '28'],
      'correct': '24',
    },
    {
      'prompt': '18 ÷ 3 = ?',
      'options': ['5', '6', '7', '8'],
      'correct': '6',
    },
    {
      'prompt': '9 + 7 = ?',
      'options': ['15', '16', '17', '18'],
      'correct': '16',
    },
  ];

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  void _startTimer() {
    _timer?.cancel();
    _secondsLeft = 15;
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_secondsLeft > 0) {
        setState(() => _secondsLeft--);
      } else {
        _handleAnswer(''); // Time out
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _handleAnswer(String answer) {
    _timer?.cancel();
    final currentQ = _questions[_currentQuestionIndex];
    final isCorrect = answer == currentQ['correct'];

    if (isCorrect) {
      setState(() {
        _score += 20;
        _feedbackState = 'correct'; // Figma 2:463
      });
    } else {
      setState(() {
        _lives--;
        _feedbackState = 'wrong'; // Figma 2:495
      });
    }

    Future.delayed(const Duration(milliseconds: 1200), () {
      if (!mounted) return;

      if (_lives <= 0 || _currentQuestionIndex >= _questions.length - 1) {
        setState(() {
          _isGameOver = true;
          _feedbackState = null;
        });
        // Award coins & XP to student
        final earnedCoins = (_score ~/ 20) * 5;
        final earnedXP = (_score ~/ 20) * 10;
        ref.read(studentProvider.notifier).updateCoins(earnedCoins);
        ref.read(studentProvider.notifier).updateXP(earnedXP);
      } else {
        setState(() {
          _currentQuestionIndex++;
          _feedbackState = null;
        });
        _startTimer();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isGameOver) {
      return _buildGameOverView();
    }

    final currentQ = _questions[_currentQuestionIndex];

    return Scaffold(
      backgroundColor: const Color(0xFF0F1426), // Space dark theme (Figma 2:34)
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Kosmik hisob',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w800,
            fontSize: 18,
          ),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Row(
              children: List.generate(
                3,
                (i) => Icon(
                  i < _lives ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                  color: const Color(0xFFFF5353),
                  size: 24,
                ),
              ),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: Column(
            children: [
              // HUD: Score & Timer
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1C243B),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFF2C395B)),
                    ),
                    child: Text(
                      'Ball: $_score',
                      style: const TextStyle(
                        color: Color(0xFFC7FA74),
                        fontWeight: FontWeight.w800,
                        fontSize: 15,
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1C243B),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: _secondsLeft <= 5 ? Colors.redAccent : const Color(0xFF2C395B),
                      ),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          Icons.timer_rounded,
                          color: _secondsLeft <= 5 ? Colors.redAccent : Colors.white,
                          size: 18,
                        ),
                        const SizedBox(width: 6),
                        Text(
                          '${_secondsLeft}s',
                          style: TextStyle(
                            color: _secondsLeft <= 5 ? Colors.redAccent : Colors.white,
                            fontWeight: FontWeight.w800,
                            fontSize: 15,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const Spacer(flex: 1),

              // Spaceship visual hub
              Container(
                width: 110,
                height: 110,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFF1E2845),
                  border: Border.all(
                    color: _feedbackState == 'correct'
                        ? const Color(0xFF4EFA9D)
                        : _feedbackState == 'wrong'
                            ? const Color(0xFFFF5353)
                            : const Color(0xFF38476F),
                    width: 3,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: (_feedbackState == 'correct'
                              ? const Color(0xFF4EFA9D)
                              : const Color(0xFF5F3EEA))
                          .withOpacity(0.35),
                      blurRadius: 24,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: const Center(
                  child: Icon(Icons.rocket_launch_rounded, color: Colors.white, size: 56),
                ),
              ),
              const SizedBox(height: 24),

              // Question Statement Card (Figma 2:34)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 20),
                decoration: BoxDecoration(
                  color: const Color(0xFF182038),
                  borderRadius: BorderRadius.circular(28),
                  border: Border.all(color: const Color(0xFF2B375C), width: 1.5),
                ),
                child: Center(
                  child: Text(
                    currentQ['prompt'],
                    style: const TextStyle(
                      fontSize: 34,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                      letterSpacing: 1.2,
                    ),
                  ),
                ),
              ),

              // Feedback Banner (Figma 2:463 & 2:495)
              if (_feedbackState != null) ...[
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: _feedbackState == 'correct'
                        ? const Color(0xFF13533E)
                        : const Color(0xFF5B1A1A),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Text(
                    _feedbackState == 'correct' ? 'To‘g‘ri javob! +20 ball' : 'Xato! Qayta urinib ko‘ring',
                    style: TextStyle(
                      color: _feedbackState == 'correct'
                          ? const Color(0xFF4EFA9D)
                          : const Color(0xFFFF8B8B),
                      fontWeight: FontWeight.w800,
                      fontSize: 14,
                    ),
                  ),
                ),
              ],

              const Spacer(flex: 2),

              // 4 Choice Options
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  mainAxisSpacing: 14,
                  crossAxisSpacing: 14,
                  childAspectRatio: 1.6,
                ),
                itemCount: (currentQ['options'] as List<String>).length,
                itemBuilder: (context, index) {
                  final opt = (currentQ['options'] as List<String>)[index];
                  return InkWell(
                    onTap: _feedbackState != null ? null : () => _handleAnswer(opt),
                    borderRadius: BorderRadius.circular(20),
                    child: Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFF1C243B),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFF323F66), width: 1.5),
                      ),
                      child: Center(
                        child: Text(
                          opt,
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildGameOverView() {
    final earnedCoins = (_score ~/ 20) * 5;
    final earnedXP = (_score ~/ 20) * 10;

    return Scaffold(
      backgroundColor: const Color(0xFF0F1426),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Spacer(flex: 1),
              Container(
                width: 110,
                height: 110,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: Color(0xFF1E2845),
                ),
                child: const Center(
                  child: Icon(Icons.stars_rounded, color: Color(0xFFC7FA74), size: 64),
                ),
              ),
              const SizedBox(height: 24),
              const Text(
                'O‘yin yakunlandi!',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 26,
                  fontWeight: FontWeight.w900,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'Siz to‘plagan ball: $_score',
                style: const TextStyle(
                  color: Color(0xFFA5AFC7),
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const Spacer(flex: 1),

              // Reward display
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: const Color(0xFF182038),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: const Color(0xFF2B375C)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    CoinBadge(count: earnedCoins, size: 28),
                    Container(width: 1, height: 40, color: const Color(0xFF2B375C)),
                    Text(
                      '+$earnedXP XP',
                      style: const TextStyle(
                        color: Color(0xFFC7FA74),
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ],
                ),
              ),
              const Spacer(flex: 2),

              CustomButton(
                text: 'Bosh sahifaga qaytish',
                backgroundColor: const Color(0xFFC7FA74),
                textColor: const Color(0xFF101526),
                borderRadius: 18,
                onPressed: () => context.go('/kids/home'),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
