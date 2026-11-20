import 'dart:async';
import 'dart:io' show Platform;
import 'dart:math' as math;
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/coin_badge.dart';
import '../../core/network/api_client.dart';
import '../../core/services/sound_service.dart';
import '../../shared/models/lesson_model.dart';
import '../../shared/providers/student_provider.dart';

class _QueueItem {
  final QuestionModel question;
  final bool isMistakeRetry;

  _QueueItem({required this.question, this.isMistakeRetry = false});
}

class ExerciseScreen extends ConsumerStatefulWidget {
  final String? questionId;
  final String? lessonId;
  final String? sectionId;
  final int? testLength;

  const ExerciseScreen({
    super.key,
    this.questionId,
    this.lessonId,
    this.sectionId,
    this.testLength,
  });

  @override
  ConsumerState<ExerciseScreen> createState() => _ExerciseScreenState();
}

class _ExerciseScreenState extends ConsumerState<ExerciseScreen>
    with TickerProviderStateMixin {
  int _currentIndex = 0;
  String? _selectedOption;
  bool _isAnswerChecked = false;
  bool _isCorrect = false;
  String _revealedCorrectAnswer = '';
  String _explanation = '';

  int _sessionCoinsEarned = 0;
  int _sessionXpEarned = 0;
  int _correctCount = 0;
  int _wrongCount = 0;
  int _streak = 0;
  bool _isCompleted = false;
  bool _isLoading = true;

  late List<_QueueItem> _queue;
  String _sessionTitle = 'Misollar ishlash';
  int _grade = 4;

  // Animations
  late AnimationController _shakeController;
  late AnimationController _correctScaleController;
  late AnimationController _coinFlyController;
  late AnimationController _flamePulseController;

  // Auto-advance timer for incorrect answers
  Timer? _autoAdvanceTimer;
  int _autoAdvanceSecondsLeft = 5;

  @override
  void initState() {
    super.initState();
    _queue = [];

    _shakeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    );

    _correctScaleController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );

    _coinFlyController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );

    _flamePulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    )..repeat(reverse: true);

    SoundService().init();
    _loadQuestions();
  }

  @override
  void dispose() {
    _autoAdvanceTimer?.cancel();
    _shakeController.dispose();
    _correctScaleController.dispose();
    _coinFlyController.dispose();
    _flamePulseController.dispose();
    super.dispose();
  }

  void _loadQuestions() async {
    final isTest = !kIsWeb && Platform.environment.containsKey('FLUTTER_TEST');

    // 20 Math questions bank for offline fallback / widget testing
    final fallbackList = List.generate(20, (i) {
      final a = (i + 2) * 3;
      final b = (i + 1) * 2;
      final sum = a + b;
      final opts = [
        '$sum',
        '${sum + 2}',
        '${sum - 3}',
        '${sum + 5}',
      ]..shuffle(math.Random(i));
      return QuestionModel(
        id: 'q-auto-$i',
        prompt: '$a + $b = ?',
        options: opts,
        correctAnswer: '$sum',
        hint: '$a ga $b ni qo‘shing.',
        explanation: '$a + $b = $sum bo‘ladi.',
        orderIndex: i + 1,
      );
    });

    if (isTest) {
      setState(() {
        _queue = fallbackList.map((q) => _QueueItem(question: q)).toList();
        _isLoading = false;
      });
      return;
    }

    try {
      final res = await ApiClient().dio.get(
        '/practice/session',
        queryParameters: {
          'grade': _grade,
          'topic': widget.lessonId ?? 'Misollar',
        },
      );

      if (res.data['success'] == true) {
        final data = res.data['data'];
        final questionsList = (data['questions'] as List<dynamic>?)
            ?.map((q) => QuestionModel.fromJson(q))
            .toList();

        if (questionsList != null && questionsList.isNotEmpty) {
          setState(() {
            _queue = questionsList.map((q) => _QueueItem(question: q)).toList();
            _sessionTitle = data['topic'] ?? _sessionTitle;
            _grade = data['grade'] ?? _grade;
            _isLoading = false;
          });
          return;
        }
      }
    } catch (_) {}

    setState(() {
      _queue = fallbackList.map((q) => _QueueItem(question: q)).toList();
      _isLoading = false;
    });
  }

  void _selectOption(String option) {
    if (_isAnswerChecked) return;
    setState(() {
      _selectedOption = option;
    });
    _checkAnswer();
  }

  void _checkAnswer() async {
    if (_selectedOption == null || _isAnswerChecked) return;

    final currentItem = _queue[_currentIndex];
    final answer = _selectedOption!;

    // Authoritative Server-side evaluation:
    // POST /api/practice/submit { questionId, answer, isRetry }
    final result = await ref.read(studentProvider.notifier).submitQuestion(
          currentItem.question.id,
          answer,
        );

    final bool isCorrect = result['isCorrect'] == true ||
        (currentItem.question.correctAnswer.isNotEmpty &&
            answer == currentItem.question.correctAnswer);

    final String serverCorrect =
        result['correctAnswer'] ?? currentItem.question.correctAnswer;
    final String serverExplanation =
        result['explanation'] ?? currentItem.question.explanation;
    final int coinsAwarded = result['coinsAwarded'] ?? (isCorrect ? 1 : 0);
    final int xpAwarded = result['xpAwarded'] ?? (isCorrect ? 10 : 0);

    setState(() {
      _isAnswerChecked = true;
      _isCorrect = isCorrect;
      _revealedCorrectAnswer = serverCorrect.isNotEmpty ? serverCorrect : answer;
      _explanation = serverExplanation;
    });

    if (isCorrect) {
      // Correct answer actions
      _correctCount++;
      _sessionCoinsEarned += coinsAwarded;
      _sessionXpEarned += xpAwarded;
      _streak++;

      // Trigger animations
      _correctScaleController.forward(from: 0.0);
      _coinFlyController.forward(from: 0.0);

      // Play audio sounds
      SoundService().playCorrect();
      if (_streak == 3 || _streak == 5) {
        SoundService().playStreak();
      }

      // Auto advance to next question after 1.4 seconds
      _autoAdvanceTimer?.cancel();
      _autoAdvanceTimer = Timer(const Duration(milliseconds: 1400), () {
        if (mounted && _isAnswerChecked && _isCorrect) {
          _advanceToNext();
        }
      });
    } else {
      // Wrong answer actions
      _wrongCount++;
      _streak = 0; // Streak reset to 0

      // Screen shake animation
      _shakeController.forward(from: 0.0);
      SoundService().playWrong();

      // If question was not already a retry, queue it at the end of the session!
      if (!currentItem.isMistakeRetry) {
        _queue.add(_QueueItem(
          question: currentItem.question,
          isMistakeRetry: true,
        ));
      }

      // Start 5-second countdown timer
      _autoAdvanceSecondsLeft = 5;
      _autoAdvanceTimer?.cancel();
      _autoAdvanceTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
        if (!mounted) {
          timer.cancel();
          return;
        }
        setState(() {
          if (_autoAdvanceSecondsLeft > 1) {
            _autoAdvanceSecondsLeft--;
          } else {
            timer.cancel();
            _advanceToNext();
          }
        });
      });
    }
  }

  void _advanceToNext() {
    _autoAdvanceTimer?.cancel();
    if (_currentIndex < _queue.length - 1) {
      setState(() {
        _currentIndex++;
        _selectedOption = null;
        _isAnswerChecked = false;
        _isCorrect = false;
        _revealedCorrectAnswer = '';
        _explanation = '';
      });
    } else {
      setState(() {
        _isCompleted = true;
      });
    }
  }

  void _restartNewSession() {
    setState(() {
      _isLoading = true;
      _isCompleted = false;
      _currentIndex = 0;
      _selectedOption = null;
      _isAnswerChecked = false;
      _isCorrect = false;
      _revealedCorrectAnswer = '';
      _explanation = '';
      _sessionCoinsEarned = 0;
      _sessionXpEarned = 0;
      _correctCount = 0;
      _wrongCount = 0;
      _streak = 0;
      _queue = [];
    });
    _loadQuestions();
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final studentState = ref.watch(studentProvider);
    final coins = studentState.student?.coinBalance ?? 0;

    if (_isLoading) {
      return Scaffold(
        backgroundColor: colors.bg,
        body: const Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircularProgressIndicator(),
              SizedBox(height: 16),
              Text(
                '20 ta misol tayyorlanmoqda...',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700),
              ),
            ],
          ),
        ),
      );
    }

    if (_isCompleted) {
      return _buildResultsScreen(colors, isDark);
    }

    final currentItem = _queue[_currentIndex];
    final currentQ = currentItem.question;
    final totalInSession = _queue.length;

    return Scaffold(
      backgroundColor: colors.bg,
      body: SafeArea(
        child: Stack(
          children: [
            // Screen Shake AnimatedBuilder
            AnimatedBuilder(
              animation: _shakeController,
              builder: (context, child) {
                final offset = math.sin(_shakeController.value * 6 * math.pi) * 8.0;
                return Transform.translate(
                  offset: Offset(offset, 0),
                  child: child,
                );
              },
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Top Navigation Header
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.close_rounded, size: 28),
                          color: colors.ink,
                          onPressed: () {
                            if (context.canPop()) {
                              context.pop();
                            } else {
                              context.go('/kids/home');
                            }
                          },
                        ),
                        // Current Streak & Extra Flame
                        if (_streak >= 3)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                colors: [Color(0xFFFF5722), Color(0xFFFF9800)],
                              ),
                              borderRadius: BorderRadius.circular(20),
                              boxShadow: [
                                BoxShadow(
                                  color: const Color(0xFFFF5722).withOpacity(0.4),
                                  blurRadius: 10,
                                  offset: const Offset(0, 3),
                                ),
                              ],
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Text('🔥', style: TextStyle(fontSize: 16)),
                                const SizedBox(width: 4),
                                Text(
                                  _streak >= 5 ? 'EXTRA ×$_streak' : '$_streak STREAK',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.w900,
                                    fontSize: 12,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        // Real-time Single Source of Truth Coin Badge
                        CoinBadge(count: coins, size: 28),
                      ],
                    ),

                    const SizedBox(height: 12),

                    // Progress bar
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: LinearProgressIndicator(
                        value: (_currentIndex + 1) / totalInSession,
                        backgroundColor: colors.border,
                        valueColor: AlwaysStoppedAnimation<Color>(
                          currentItem.isMistakeRetry
                              ? const Color(0xFFF59E0B)
                              : colors.primary,
                        ),
                        minHeight: 8,
                      ),
                    ),

                    const SizedBox(height: 12),

                    // Progress Counter & Retry Badge
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Misol ${_currentIndex + 1} / $totalInSession',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w800,
                            color: colors.muted,
                          ),
                        ),
                        if (currentItem.isMistakeRetry)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                            decoration: BoxDecoration(
                              color: const Color(0xFFFEF3C7),
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: const Color(0xFFF59E0B)),
                            ),
                            child: const Text(
                              'Qayta urinish',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFFB45309),
                              ),
                            ),
                          ),
                      ],
                    ),

                    const SizedBox(height: 20),

                    // Question Card
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: colors.card,
                        borderRadius: BorderRadius.circular(32),
                        border: Border.all(color: colors.border, width: 1.5),
                        boxShadow: [
                          BoxShadow(
                            color: isDark
                                ? Colors.black26
                                : colors.primary.withOpacity(0.06),
                            blurRadius: 20,
                            offset: const Offset(0, 8),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          Text(
                            currentQ.prompt,
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 30,
                              fontWeight: FontWeight.w900,
                              color: colors.ink,
                              letterSpacing: 0.5,
                            ),
                          ),
                          if (currentQ.hint.isNotEmpty && !_isAnswerChecked) ...[
                            const SizedBox(height: 12),
                            Text(
                              'Maslahat: ${currentQ.hint}',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: colors.muted,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Options A, B, C, D
                    ...currentQ.options.map((opt) {
                      final isSelected = _selectedOption == opt;
                      final isRevealedCorrect =
                          _isAnswerChecked && opt == _revealedCorrectAnswer;
                      final isWrongSelected =
                          _isAnswerChecked && isSelected && !_isCorrect;

                      Color cardBg = colors.card;
                      Color borderColor = colors.border;
                      Color textColor = colors.ink;

                      if (isRevealedCorrect) {
                        cardBg = const Color(0xFFDCFCE7);
                        borderColor = const Color(0xFF22C55E);
                        textColor = const Color(0xFF15803D);
                      } else if (isWrongSelected) {
                        cardBg = const Color(0xFFFEE2E2);
                        borderColor = const Color(0xFFEF4444);
                        textColor = const Color(0xFFB91C1C);
                      } else if (isSelected) {
                        cardBg = colors.primary.withOpacity(0.12);
                        borderColor = colors.primary;
                        textColor = colors.primary;
                      }

                      return Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: InkWell(
                          onTap: _isAnswerChecked ? null : () => _selectOption(opt),
                          borderRadius: BorderRadius.circular(22),
                          child: Container(
                            width: double.infinity,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 20,
                              vertical: 18,
                            ),
                            decoration: BoxDecoration(
                              color: cardBg,
                              borderRadius: BorderRadius.circular(22),
                              border: Border.all(color: borderColor, width: 2),
                              boxShadow: [
                                if (isRevealedCorrect)
                                  BoxShadow(
                                    color: const Color(0xFF22C55E).withOpacity(0.25),
                                    blurRadius: 12,
                                    offset: const Offset(0, 4),
                                  ),
                              ],
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  opt,
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w800,
                                    color: textColor,
                                  ),
                                ),
                                if (isRevealedCorrect)
                                  const Icon(
                                    Icons.check_circle_rounded,
                                    color: Color(0xFF15803D),
                                    size: 24,
                                  )
                                else if (isWrongSelected)
                                  const Icon(
                                    Icons.cancel_rounded,
                                    color: Color(0xFFB91C1C),
                                    size: 24,
                                  ),
                              ],
                            ),
                          ),
                        ),
                      );
                    }),

                    const SizedBox(height: 16),

                    // Explanation & Next Button on Incorrect Answer
                    if (_isAnswerChecked && !_isCorrect) ...[
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: isDark ? const Color(0xFF281C2A) : const Color(0xFFFFF1F2),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xFFFDA4AF)),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                const Icon(Icons.info_outline_rounded,
                                    color: Color(0xFFE11D48), size: 18),
                                const SizedBox(width: 8),
                                const Text(
                                  'Tushuntirish',
                                  style: TextStyle(
                                    fontWeight: FontWeight.w800,
                                    fontSize: 14,
                                    color: Color(0xFFE11D48),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 6),
                            Text(
                              _explanation.isNotEmpty
                                  ? _explanation
                                  : 'To‘g‘ri javob: $_revealedCorrectAnswer. Ushbu savol seans oxirida yana takrorlanadi.',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: colors.ink,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        height: 52,
                        child: ElevatedButton.icon(
                          onPressed: _advanceToNext,
                          icon: const Icon(Icons.arrow_forward_rounded, color: Colors.white),
                          label: Text(
                            'Keyingi ($_autoAdvanceSecondsLeft s)',
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w800,
                              color: Colors.white,
                            ),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: colors.primary,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(20),
                            ),
                          ),
                        ),
                      ),
                    ] else if (!_isAnswerChecked) ...[
                      // Submit Answer Button
                      SizedBox(
                        width: double.infinity,
                        height: 54,
                        child: ElevatedButton(
                          onPressed: _selectedOption == null ? null : _checkAnswer,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: colors.primary,
                            disabledBackgroundColor: colors.border,
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(20),
                            ),
                          ),
                          child: const Text(
                            'Javobni tekshirish',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w800,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ],

                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ),

            // Floating Coin Animation (+1 Coin)
            if (_coinFlyController.isAnimating)
              AnimatedBuilder(
                animation: _coinFlyController,
                builder: (context, child) {
                  final progress = _coinFlyController.value;
                  final startY = MediaQuery.of(context).size.height * 0.55;
                  final endY = 40.0;
                  final currentY = startY - (startY - endY) * progress;
                  final opacity = (1.0 - progress * 0.3).clamp(0.0, 1.0);

                  return Positioned(
                    top: currentY,
                    right: 30 + progress * 20,
                    child: Opacity(
                      opacity: opacity,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFFFFD66B), Color(0xFFF5A623)],
                          ),
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFFF5A623).withOpacity(0.5),
                              blurRadius: 12,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            CoinIcon(size: 20),
                            SizedBox(width: 6),
                            Text(
                              '+1 tanga',
                              style: TextStyle(
                                fontWeight: FontWeight.w900,
                                fontSize: 14,
                                color: Color(0xFF6A3B00),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildResultsScreen(AppThemeColors colors, bool isDark) {
    final total = _correctCount + _wrongCount;
    final accuracy = total > 0 ? ((_correctCount / total) * 100).round() : 100;

    return Scaffold(
      backgroundColor: colors.bg,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Cup / Trophy
                Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFFFFD66B), Color(0xFFF5A623)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFFF5A623).withOpacity(0.4),
                        blurRadius: 24,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Icon(Icons.emoji_events_rounded, color: Colors.white, size: 54),
                  ),
                ),
                const SizedBox(height: 20),
                Text(
                  'Ajoyib natija!',
                  style: TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.w900,
                    color: colors.ink,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Siz 20 ta misoldan iborat seansni muvaffaqiyatli yakunladingiz!',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: colors.muted,
                  ),
                ),
                const SizedBox(height: 28),

                // Stats Grid
                Row(
                  children: [
                    Expanded(
                      child: _buildResultStat(
                        label: 'Olingan tangalar',
                        value: '+$_sessionCoinsEarned',
                        icon: Icons.monetization_on_rounded,
                        color: const Color(0xFFF5A623),
                        colors: colors,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildResultStat(
                        label: 'Olingan XP',
                        value: '+$_sessionXpEarned',
                        icon: Icons.bolt_rounded,
                        color: colors.primary,
                        colors: colors,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: _buildResultStat(
                        label: 'To‘g‘ri javoblar',
                        value: '$_correctCount ta',
                        icon: Icons.check_circle_rounded,
                        color: const Color(0xFF10B981),
                        colors: colors,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildResultStat(
                        label: 'Aniqlik foizi',
                        value: '$accuracy%',
                        icon: Icons.pie_chart_rounded,
                        color: const Color(0xFF3B82F6),
                        colors: colors,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 36),

                // Action Buttons
                SizedBox(
                  width: double.infinity,
                  height: 54,
                  child: ElevatedButton.icon(
                    onPressed: _restartNewSession,
                    icon: const Icon(Icons.replay_rounded, color: Colors.white),
                    label: const Text(
                      'Keyingi 20 ta misol',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: colors.primary,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: OutlinedButton(
                    onPressed: () => context.go('/kids/home'),
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: colors.border, width: 1.5),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                    ),
                    child: Text(
                      'Bosh sahifa',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                        color: colors.ink,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildResultStat({
    required String label,
    required String value,
    required IconData icon,
    required Color color,
    required AppThemeColors colors,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: colors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 26),
          const SizedBox(height: 10),
          Text(
            value,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w900,
              color: colors.ink,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: colors.muted,
            ),
          ),
        ],
      ),
    );
  }
}
