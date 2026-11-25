import 'dart:async';
import 'dart:io' show Platform;
import 'dart:math' as math;
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/coin_badge.dart';
import '../../core/widgets/xp_coin.dart';
import '../../core/services/sound_service.dart';
import '../../shared/models/lesson_model.dart';
import '../../shared/repositories/exercise_repository.dart';
import '../../shared/providers/student_provider.dart';

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
  bool _isSubmitting = false;
  String _revealedCorrectAnswer = '';
  String _explanation = '';

  int _sessionCoinsEarned = 0;
  int _sessionXpEarned = 0;
  int _correctCount = 0;
  int _wrongCount = 0;
  bool _isCompleted = false;
  bool _isLoading = true;

  late List<QuestionModel> _questions;

  // GlobalKeys for flight trajectory
  final GlobalKey _coinBadgeKey = GlobalKey();
  final Map<int, GlobalKey> _optionKeys = {
    0: GlobalKey(),
    1: GlobalKey(),
    2: GlobalKey(),
    3: GlobalKey(),
  };

  // Animations
  late AnimationController _shakeController;
  late Animation<double> _shakeAnimation;

  late AnimationController _cardTransitionController;
  late Animation<double> _cardScaleAnimation;
  late Animation<double> _cardFadeAnimation;
  late Animation<Offset> _cardSlideAnimation;

  late AnimationController _particlesController;
  late FocusNode _focusNode;

  Timer? _autoAdvanceTimer;
  DateTime _questionStartTime = DateTime.now();

  @override
  void initState() {
    super.initState();
    _focusNode = FocusNode();
    _questions = [];

    // Shake animation for incorrect answer
    _shakeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 380),
    );
    _shakeAnimation = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: 0.0, end: -8.0), weight: 1),
      TweenSequenceItem(tween: Tween(begin: -8.0, end: 8.0), weight: 2),
      TweenSequenceItem(tween: Tween(begin: 8.0, end: -6.0), weight: 2),
      TweenSequenceItem(tween: Tween(begin: -6.0, end: 6.0), weight: 2),
      TweenSequenceItem(tween: Tween(begin: 6.0, end: 0.0), weight: 1),
    ]).animate(CurvedAnimation(parent: _shakeController, curve: Curves.easeInOut));

    // Question Card transition animation
    _cardTransitionController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 350),
    );
    _cardScaleAnimation = Tween<double>(begin: 0.96, end: 1.0).animate(
      CurvedAnimation(parent: _cardTransitionController, curve: Curves.easeOutCubic),
    );
    _cardFadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _cardTransitionController, curve: Curves.easeOut),
    );
    _cardSlideAnimation = Tween<Offset>(begin: const Offset(0.06, 0.0), end: Offset.zero).animate(
      CurvedAnimation(parent: _cardTransitionController, curve: Curves.easeOutCubic),
    );

    // Particle burst on correct answer
    _particlesController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );

    SoundService().init();
    _loadQuestions();
  }

  @override
  void dispose() {
    _focusNode.dispose();
    _autoAdvanceTimer?.cancel();
    _shakeController.dispose();
    _cardTransitionController.dispose();
    _particlesController.dispose();
    super.dispose();
  }

  void _loadQuestions() async {
    final isTest = !kIsWeb && Platform.environment.containsKey('FLUTTER_TEST');

    if (isTest) {
      final fallbackList = List.generate(20, (i) {
        final a = (i + 2) * 3;
        final b = (i + 1) * 2;
        final sum = a + b;
        final opts = [
          '$sum',
          '${sum + 2}',
          '${sum - 3}',
          '${sum + 4}',
        ]..shuffle(math.Random(i + 42));
        return QuestionModel(
          id: 'q-practice-${i + 1}',
          prompt: '$a + $b = ?',
          options: opts,
          correctAnswer: '$sum',
          hint: '$a ga $b sonini qo‘shing.',
          explanation: '$a + $b = $sum bo‘ladi.',
          orderIndex: i + 1,
        );
      });
      setState(() {
        _questions = fallbackList;
        _isLoading = false;
      });
      _cardTransitionController.forward(from: 0.0);
      return;
    }

    try {
      final student = ref.read(studentProvider).student;
      final exercises = await ExerciseRepository().getSessionExercises(
        age: student?.age,
        count: 20,
      );

      if (!mounted) return;

      if (exercises.isNotEmpty) {
        final questionsList = exercises.asMap().entries.map((entry) {
          final i = entry.key;
          final ex = entry.value;
          return QuestionModel(
            id: 'q-${ex.id}',
            prompt: ex.question,
            options: ex.options,
            correctAnswer: ex.answer,
            hint: ex.hint,
            explanation: ex.explanation,
            orderIndex: i + 1,
          );
        }).toList();

        setState(() {
          _questions = questionsList;
          _isLoading = false;
        });
        _cardTransitionController.forward(from: 0.0);
        return;
      }
    } catch (e) {
      debugPrint('ℹ️ [ExerciseScreen] Savollarni yuklashda xatolik: $e');
    }

    // Secondary fallback
    final fallbackList = List.generate(20, (i) {
      final a = (i + 1) * 3;
      final b = (i + 2) * 2;
      final sum = a + b;
      return QuestionModel(
        id: 'q-fallback-${i + 1}',
        prompt: '$a + $b = ?',
        options: ['$sum', '${sum + 1}', '${sum - 2}', '${sum + 3}'],
        correctAnswer: '$sum',
        hint: '$a ga $b sonini qo‘shing.',
        explanation: '$a + $b = $sum bo‘ladi.',
        orderIndex: i + 1,
      );
    });

    if (mounted) {
      setState(() {
        _questions = fallbackList;
        _isLoading = false;
      });
      _cardTransitionController.forward(from: 0.0);
    }
  }

  void _onOptionSelected(String option) {
    if (_isAnswerChecked || _isSubmitting) return;
    HapticFeedback.selectionClick();
    setState(() {
      _selectedOption = option;
    });
  }

  void _checkAnswer() async {
    if (_selectedOption == null || _isAnswerChecked || _isSubmitting) return;

    setState(() => _isSubmitting = true);
    final currentQ = _questions[_currentIndex];
    final selected = _selectedOption!;
    final timeSpentMs = DateTime.now().difference(_questionStartTime).inMilliseconds;

    // Check correctness locally
    final bool isCorrect = selected == currentQ.correctAnswer ||
        (currentQ.options.contains(selected) &&
         currentQ.options.indexOf(selected) == currentQ.options.indexOf(currentQ.correctAnswer));

    // Call student notifier submitAnswer with local correctness evaluated
    final result = await ref.read(studentProvider.notifier).submitAnswer(
          currentQ.id,
          selected,
          timeSpentMs: timeSpentMs,
          isCorrectLocally: isCorrect,
          correctAnswer: currentQ.correctAnswer,
          explanation: currentQ.explanation,
        );

    if (!mounted) return;

    final String serverCorrect = result['correctAnswer'] ?? currentQ.correctAnswer;
    final String serverExplanation = result['explanation'] ?? currentQ.explanation;
    final int coinsAwarded = result['coinsAwarded'] ?? (isCorrect ? 1 : 0);
    final int xpAwarded = result['xpAwarded'] ?? (isCorrect ? 10 : 0);

    setState(() {
      _isSubmitting = false;
      _isAnswerChecked = true;
      _isCorrect = isCorrect;
      _revealedCorrectAnswer = serverCorrect.isNotEmpty ? serverCorrect : selected;
      _explanation = serverExplanation;
    });

    if (isCorrect) {
      _correctCount++;
      _sessionCoinsEarned += coinsAwarded;
      _sessionXpEarned += xpAwarded;

      SoundService().playCorrect();
      _particlesController.forward(from: 0.0);

      // Trigger curved flying coin animation
      _triggerFlyingCoin();

      // Auto advance after coin flight & celebration (~1.2s)
      _autoAdvanceTimer?.cancel();
      _autoAdvanceTimer = Timer(const Duration(milliseconds: 1200), () {
        if (mounted && _isAnswerChecked && _isCorrect) {
          _advanceToNext();
        }
      });
    } else {
      _wrongCount++;
      _shakeController.forward(from: 0.0);
      HapticFeedback.mediumImpact();
      SoundService().playWrong();

      // Educational review: give time to read explanation or tap Davom etish
      _autoAdvanceTimer?.cancel();
      _autoAdvanceTimer = Timer(const Duration(milliseconds: 2500), () {
        if (mounted && _isAnswerChecked && !_isCorrect) {
          _advanceToNext();
        }
      });
    }
  }

  /// Curved Bezier Flight Animation: Coin flies from chosen option to top coin badge
  void _triggerFlyingCoin() {
    final disableAnimations = MediaQuery.of(context).disableAnimations;
    if (disableAnimations) return;

    final currentQ = _questions[_currentIndex];
    final selectedIdx = currentQ.options.indexOf(_selectedOption ?? '');

    final optionBox = _optionKeys[selectedIdx]?.currentContext?.findRenderObject() as RenderBox?;
    final coinBadgeBox = _coinBadgeKey.currentContext?.findRenderObject() as RenderBox?;

    if (optionBox == null || coinBadgeBox == null) return;

    final startPos = optionBox.localToGlobal(Offset(optionBox.size.width / 2, optionBox.size.height / 2));
    final endPos = coinBadgeBox.localToGlobal(Offset(coinBadgeBox.size.width * 0.25, coinBadgeBox.size.height / 2));

    final overlay = Overlay.of(context);
    late OverlayEntry entry;

    final flightController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 750),
    );

    entry = OverlayEntry(
      builder: (ctx) {
        return AnimatedBuilder(
          animation: flightController,
          builder: (ctx, child) {
            final t = flightController.value;
            // Quadratic Bezier arc
            final controlX = (startPos.dx + endPos.dx) / 2 + 30;
            final controlY = math.min(startPos.dy, endPos.dy) - 70;

            final x = (1 - t) * (1 - t) * startPos.dx + 2 * (1 - t) * t * controlX + t * t * endPos.dx;
            final y = (1 - t) * (1 - t) * startPos.dy + 2 * (1 - t) * t * controlY + t * t * endPos.dy;
            final scale = (1.25 - 0.35 * t).clamp(0.8, 1.3);

            return Positioned(
              left: x - 18,
              top: y - 18,
              child: Transform.scale(
                scale: scale,
                child: Material(
                  color: Colors.transparent,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const CoinIcon(size: 28, sparkle: true),
                      const SizedBox(width: 4),
                      Text(
                        '+1',
                        style: TextStyle(
                          color: const Color(0xFFFFB300),
                          fontSize: 18 * scale,
                          fontWeight: FontWeight.w900,
                          shadows: const [
                            Shadow(color: Colors.black26, blurRadius: 4, offset: Offset(0, 2)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );

    overlay.insert(entry);
    flightController.forward().then((_) {
      entry.remove();
      flightController.dispose();
      HapticFeedback.lightImpact();
    });
  }

  void _advanceToNext() {
    _autoAdvanceTimer?.cancel();
    _questionStartTime = DateTime.now();
    if (_currentIndex < _questions.length - 1) {
      setState(() {
        _currentIndex++;
        _selectedOption = null;
        _isAnswerChecked = false;
        _isCorrect = false;
        _revealedCorrectAnswer = '';
        _explanation = '';
      });
      _cardTransitionController.forward(from: 0.0);
    } else {
      setState(() {
        _isCompleted = true;
      });
      HapticFeedback.heavyImpact();
    }
  }

  void _confirmExit() {
    HapticFeedback.lightImpact();
    showDialog(
      context: context,
      builder: (ctx) {
        final colors = AppThemeColors.of(context);
        return AlertDialog(
          backgroundColor: colors.card,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          title: Text(
            'Mashqni to‘xtatmoqchimisiz?',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: colors.ink),
          ),
          content: Text(
            'Hozirgacha to‘plangan $_sessionCoinsEarned ta tanga va $_sessionXpEarned XP balansingizda saqlanadi.',
            style: TextStyle(fontSize: 14, color: colors.muted),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: Text(
                'Davom etish',
                style: TextStyle(color: colors.primary, fontWeight: FontWeight.w700),
              ),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFEF4444),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              onPressed: () {
                Navigator.pop(ctx);
                context.go('/kids/home');
              },
              child: const Text(
                'Chiqish',
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700),
              ),
            ),
          ],
        );
      },
    );
  }

  void _handleKeyEvent(KeyEvent event) {
    if (event is! KeyDownEvent) return;
    final key = event.logicalKey;

    if (key == LogicalKeyboardKey.escape) {
      _confirmExit();
      return;
    }

    if (key == LogicalKeyboardKey.enter ||
        key == LogicalKeyboardKey.numpadEnter ||
        key == LogicalKeyboardKey.space) {
      if (_isAnswerChecked) {
        _advanceToNext();
      } else if (_selectedOption != null && !_isSubmitting) {
        _checkAnswer();
      }
      return;
    }

    if (!_isAnswerChecked && !_isSubmitting && _questions.isNotEmpty) {
      final opts = _questions[_currentIndex].options;
      int? targetIdx;
      if (key == LogicalKeyboardKey.digit1 ||
          key == LogicalKeyboardKey.numpad1 ||
          key == LogicalKeyboardKey.keyA) {
        targetIdx = 0;
      } else if (key == LogicalKeyboardKey.digit2 ||
          key == LogicalKeyboardKey.numpad2 ||
          key == LogicalKeyboardKey.keyB) {
        targetIdx = 1;
      } else if (key == LogicalKeyboardKey.digit3 ||
          key == LogicalKeyboardKey.numpad3 ||
          key == LogicalKeyboardKey.keyC) {
        targetIdx = 2;
      } else if (key == LogicalKeyboardKey.digit4 ||
          key == LogicalKeyboardKey.numpad4 ||
          key == LogicalKeyboardKey.keyD) {
        targetIdx = 3;
      }
      if (targetIdx != null && targetIdx < opts.length) {
        _onOptionSelected(opts[targetIdx]);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);
    final student = ref.watch(studentProvider).student;
    final totalCoins = student?.coinBalance ?? 0;

    if (_isLoading) {
      return Scaffold(
        backgroundColor: colors.bg,
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    if (_isCompleted) {
      return _buildResultScreen(colors, totalCoins);
    }

    final currentQ = _questions[_currentIndex];
    final totalQ = _questions.length;
    final progress = (totalQ > 0) ? (_currentIndex + 1) / totalQ : 0.0;
    final optionList = currentQ.options;
    final screenWidth = MediaQuery.of(context).size.width;

    Widget content = Column(
      children: [
        // ==============================================================
        // 1. TOP BAR: X (exit), Real Coin Counter, Animated Progress Bar
        // ==============================================================
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Exit Button X
              MouseRegion(
                cursor: SystemMouseCursors.click,
                child: InkWell(
                  onTap: _confirmExit,
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: colors.card,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: colors.border),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.04),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Icon(Icons.close_rounded, color: colors.ink, size: 22),
                  ),
                ),
              ),

              // Coin Badge Target
              CoinBadge(
                key: _coinBadgeKey,
                count: totalCoins,
                size: 26,
              ),
            ],
          ),
        ),

        // Progress Header: "Misol X / 20" & Animated Bar
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Misol ${_currentIndex + 1} / $totalQ',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w800,
                      color: colors.muted,
                    ),
                  ),
                  Text(
                    '${(progress * 100).round()}%',
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF6C55E0),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              ClipRRect(
                borderRadius: BorderRadius.circular(6),
                child: SizedBox(
                  height: 8,
                  child: TweenAnimationBuilder<double>(
                    tween: Tween<double>(begin: 0.0, end: progress),
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.easeOutCubic,
                    builder: (context, val, child) {
                      return LinearProgressIndicator(
                        value: val,
                        backgroundColor: colors.border,
                        valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF6C55E0)),
                      );
                    },
                  ),
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 16),

        // ==============================================================
        // 2. SCROLLABLE QUESTION CARD & OPTIONS
        // ==============================================================
        Expanded(
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            child: Column(
              children: [
                // Question Card with entrance animation & shake on error
                AnimatedBuilder(
                  animation: _shakeAnimation,
                  builder: (context, child) {
                    return Transform.translate(
                      offset: Offset(_shakeAnimation.value, 0),
                      child: child,
                    );
                  },
                  child: SlideTransition(
                    position: _cardSlideAnimation,
                    child: FadeTransition(
                      opacity: _cardFadeAnimation,
                      child: ScaleTransition(
                        scale: _cardScaleAnimation,
                        child: _buildQuestionCard(currentQ, colors),
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                // Options A, B, C, D
                Column(
                  children: List.generate(optionList.length, (idx) {
                    final option = optionList[idx];
                    final letter = String.fromCharCode(65 + idx); // A, B, C, D
                    return _buildOptionCard(
                      key: _optionKeys[idx],
                      letter: letter,
                      optionText: option,
                      isSelected: _selectedOption == option,
                      colors: colors,
                      currentQ: currentQ,
                    );
                  }),
                ),

                const SizedBox(height: 24),
              ],
            ),
          ),
        ),

        // ==============================================================
        // 3. BOTTOM ACTION BAR ("Javobni tekshirish" / "Keyingi")
        // ==============================================================
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 10, 20, 20),
          child: _buildBottomButton(colors),
        ),
      ],
    );

    if (screenWidth >= 600) {
      content = Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 720),
          child: content,
        ),
      );
    }

    return KeyboardListener(
      focusNode: _focusNode,
      autofocus: true,
      onKeyEvent: _handleKeyEvent,
      child: Scaffold(
        backgroundColor: colors.bg,
        body: SafeArea(
          child: content,
        ),
      ),
    );
  }

  Widget _buildQuestionCard(QuestionModel q, AppThemeColors colors) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 30),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: colors.border, width: 1.4),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF6C55E0).withOpacity(0.08),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          // Mathematical Formula in large prominent typography
          Text(
            q.prompt,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.w900,
              color: colors.ink,
              letterSpacing: 0.5,
            ),
          ),

          if (q.hint.isNotEmpty && !_isAnswerChecked) ...[
            const SizedBox(height: 14),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.lightbulb_outline_rounded, color: Color(0xFFF59E0B), size: 16),
                const SizedBox(width: 6),
                Flexible(
                  child: Text(
                    q.hint,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: colors.muted,
                    ),
                  ),
                ),
              ],
            ),
          ],

          if (_isAnswerChecked && _explanation.isNotEmpty) ...[
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color: _isCorrect ? const Color(0xFFDDF5E8) : const Color(0xFFFDECEC),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                _explanation,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: _isCorrect ? const Color(0xFF1B8A55) : const Color(0xFFE24B4A),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildOptionCard({
    required Key? key,
    required String letter,
    required String optionText,
    required bool isSelected,
    required AppThemeColors colors,
    required QuestionModel currentQ,
  }) {
    Color borderColor = colors.border;
    Color bgColor = colors.card;
    Color letterBgColor = colors.bg;
    Color letterTextColor = colors.ink;
    Color optionTextColor = colors.ink;
    Widget letterChild = Text(
      letter,
      style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: letterTextColor),
    );

    if (_isAnswerChecked) {
      final isThisChoice = _selectedOption == optionText;
      final isRealCorrect = optionText == _revealedCorrectAnswer;

      if (isThisChoice && _isCorrect) {
        // Correct selection: Green
        borderColor = const Color(0xFF10B981);
        bgColor = const Color(0xFFDDF5E8);
        letterBgColor = const Color(0xFF10B981);
        optionTextColor = const Color(0xFF064E3B);
        letterChild = const Icon(Icons.check_rounded, color: Colors.white, size: 18);
      } else if (isThisChoice && !_isCorrect) {
        // Wrong selection: Red
        borderColor = const Color(0xFFEF4444);
        bgColor = const Color(0xFFFDECEC);
        letterBgColor = const Color(0xFFEF4444);
        optionTextColor = const Color(0xFF7F1D1D);
        letterChild = const Icon(Icons.close_rounded, color: Colors.white, size: 18);
      } else if (isRealCorrect) {
        // Reveal correct answer: Soft Green
        borderColor = const Color(0xFF10B981);
        bgColor = const Color(0xFFF0FDF4);
        letterBgColor = const Color(0xFF10B981);
        optionTextColor = const Color(0xFF064E3B);
        letterChild = const Icon(Icons.check_rounded, color: Colors.white, size: 18);
      }
    } else if (isSelected) {
      // Selected state: Primary purple background with high contrast dark text
      borderColor = const Color(0xFF6C55E0);
      bgColor = const Color(0xFFEDE8FF);
      letterBgColor = const Color(0xFF6C55E0);
      optionTextColor = const Color(0xFF1E1742);
      letterChild = Text(
        letter,
        style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: Colors.white),
      );
    }

    return Padding(
      key: key,
      padding: const EdgeInsets.only(bottom: 12),
      child: AnimatedScale(
        scale: isSelected ? 1.0 : 0.985,
        duration: const Duration(milliseconds: 150),
        child: MouseRegion(
          cursor: SystemMouseCursors.click,
          child: InkWell(
            onTap: () => _onOptionSelected(optionText),
            borderRadius: BorderRadius.circular(20),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 250),
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
              decoration: BoxDecoration(
                color: bgColor,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: borderColor, width: isSelected || _isAnswerChecked ? 2.0 : 1.2),
                boxShadow: [
                  BoxShadow(
                    color: isSelected ? const Color(0x226C55E0) : Colors.black.withOpacity(0.02),
                    blurRadius: 10,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: Row(
                children: [
                  // Letter badge
                  Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                      color: letterBgColor,
                      shape: BoxShape.circle,
                    ),
                    child: Center(child: letterChild),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Text(
                      optionText,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: isSelected ? FontWeight.w800 : FontWeight.w700,
                        color: optionTextColor,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBottomButton(AppThemeColors colors) {
    if (_isAnswerChecked) {
      return SizedBox(
        width: double.infinity,
        height: 56,
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF6C55E0),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            elevation: 4,
          ),
          onPressed: _advanceToNext,
          child: const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Keyingi misol',
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: Colors.white),
              ),
              SizedBox(width: 8),
              Icon(Icons.arrow_forward_rounded, color: Colors.white, size: 20),
            ],
          ),
        ),
      );
    }

    final isEnabled = _selectedOption != null && !_isSubmitting;

    return MouseRegion(
      cursor: isEnabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 250),
        width: double.infinity,
        height: 56,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          gradient: isEnabled
              ? const LinearGradient(
                  colors: [Color(0xFF6C55E0), Color(0xFF8B6BFF)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                )
              : null,
          color: isEnabled ? null : colors.inactive.withOpacity(0.35),
          boxShadow: isEnabled
              ? [
                  BoxShadow(
                    color: const Color(0xFF6C55E0).withOpacity(0.35),
                    blurRadius: 16,
                    offset: const Offset(0, 6),
                  ),
                ]
              : null,
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: isEnabled ? _checkAnswer : null,
            borderRadius: BorderRadius.circular(20),
            child: Center(
              child: _isSubmitting
                  ? const SizedBox(
                      width: 24,
                      height: 24,
                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
                    )
                  : Text(
                      'Javobni tekshirish',
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w800,
                        color: isEnabled ? Colors.white : colors.muted.withOpacity(0.7),
                      ),
                    ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildResultScreen(AppThemeColors colors, int totalCoins) {
    final accuracy = _questions.isNotEmpty
        ? ((_correctCount / _questions.length) * 100).round()
        : 0;

    return Scaffold(
      backgroundColor: colors.bg,
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 600),
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
              child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Big celebration trophy badge
                Container(
                  width: 96,
                  height: 96,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFFFFE082), Color(0xFFFFB300)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFFFFB300).withOpacity(0.35),
                        blurRadius: 24,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Icon(Icons.emoji_events_rounded, color: Colors.white, size: 52),
                  ),
                ),
                const SizedBox(height: 20),

                Text(
                  'Mashq muvaffaqiyatli yakunlandi!',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: colors.ink),
                ),
                const SizedBox(height: 6),
                Text(
                  'Barcha 20 ta misol ko‘rib chiqildi',
                  style: TextStyle(fontSize: 14, color: colors.muted),
                ),
                const SizedBox(height: 28),

                // Stats Card
                Container(
                  padding: const EdgeInsets.all(22),
                  decoration: BoxDecoration(
                    color: colors.card,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: colors.border),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.04),
                        blurRadius: 16,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _buildResultStat(
                            title: 'To‘g‘ri',
                            value: '$_correctCount',
                            color: const Color(0xFF10B981),
                          ),
                          _buildResultStat(
                            title: 'Aniqlik',
                            value: '$accuracy%',
                            color: const Color(0xFF6C55E0),
                          ),
                          _buildResultStat(
                            title: 'Noto‘g‘ri',
                            value: '$_wrongCount',
                            color: const Color(0xFFEF4444),
                          ),
                        ],
                      ),
                      const Divider(height: 28),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          Row(
                            children: [
                              const CoinIcon(size: 24),
                              const SizedBox(width: 8),
                              TweenAnimationBuilder<double>(
                                tween: Tween<double>(begin: 0.0, end: _sessionCoinsEarned.toDouble()),
                                duration: const Duration(milliseconds: 700),
                                curve: Curves.easeOutCubic,
                                builder: (context, val, child) {
                                  return Text(
                                    '+${val.round()} tanga',
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w900,
                                      color: Color(0xFFD97706),
                                    ),
                                  );
                                },
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                            decoration: BoxDecoration(
                              color: const Color(0xFFEDE8FF),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const XpCoin(size: 16, showGlow: false),
                                const SizedBox(width: 4),
                                Text(
                                  '+$_sessionXpEarned XP',
                                  style: const TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w900,
                                    color: Color(0xFF6C55E0),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 32),

                // Action Buttons
                SizedBox(
                  width: double.infinity,
                  height: 54,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF6C55E0),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                      elevation: 4,
                    ),
                    onPressed: () => context.go('/kids/leaderboard'),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.leaderboard_rounded, color: Colors.white, size: 20),
                        SizedBox(width: 8),
                        Text(
                          'Reytingni ko‘rish',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Colors.white),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  height: 54,
                  child: OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: Color(0xFF6C55E0), width: 1.5),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                    ),
                    onPressed: () {
                      setState(() {
                        _isLoading = true;
                        _isCompleted = false;
                        _currentIndex = 0;
                        _selectedOption = null;
                        _isAnswerChecked = false;
                        _sessionCoinsEarned = 0;
                        _sessionXpEarned = 0;
                        _correctCount = 0;
                        _wrongCount = 0;
                      });
                      _loadQuestions();
                    },
                    child: const Text(
                      'Yana mashq qilish',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF6C55E0)),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    ),
  );
}

  Widget _buildResultStat({required String title, required String value, required Color color}) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: color),
        ),
        const SizedBox(height: 2),
        Text(
          title,
          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF94A3B8)),
        ),
      ],
    );
  }
}
