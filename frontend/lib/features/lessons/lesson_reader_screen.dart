import 'dart:io' show Platform;
import 'dart:math' as math;
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/coin_badge.dart';
import '../../core/widgets/xp_coin.dart';
import '../../core/network/api_client.dart';
import '../../core/widgets/promo_dialog_controller.dart';
import '../../shared/models/lesson_model.dart';
import '../../shared/providers/student_provider.dart';
import 'widgets/math_markdown_view.dart';

class LessonReaderScreen extends ConsumerStatefulWidget {
  final String lessonId;

  const LessonReaderScreen({super.key, required this.lessonId});

  @override
  ConsumerState<LessonReaderScreen> createState() => _LessonReaderScreenState();
}

class _LessonReaderScreenState extends ConsumerState<LessonReaderScreen>
    with SingleTickerProviderStateMixin {
  LessonModel? _lesson;
  bool _isLoading = true;
  String? _errorMessage;
  int _currentStep =
      0; // 0: Kirish, 1: Tushuntirish, 2: Misollar, 3: Mashq, 4: Mini-test

  // Quiz & Test state
  List<Map<String, dynamic>> _quizQuestions = [];
  final Map<int, String> _selectedAnswers = {};
  final Map<int, int> _selectedAnswerIndices = {};
  String? _testAttemptId;
  Map<String, dynamic>? _testResult;
  int? _unansweredHighlightIndex;
  bool _showErrorsOnly = false;
  int _correctCount = 0;
  bool _quizSubmitted = false;
  bool _isSavingProgress = false;

  late AnimationController _animationController;
  late Animation<double> _floatAnimation;
  late Animation<double> _pulseAnimation;

  final List<String> _stepTitles = [
    'Kirish',
    'Tushuntirish',
    'Misollar',
    'Mashqlar',
    'Mini-test',
  ];

  @override
  void initState() {
    super.initState();
    PromoDialogController.instance.onLessonStarted();

    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);

    _floatAnimation = Tween<double>(begin: -8, end: 8).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );

    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.18).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );

    _fetchLesson();
  }

  @override
  void dispose() {
    _animationController.dispose();
    PromoDialogController.instance.onLessonEnded();
    super.dispose();
  }

  Future<void> _recordStep(int step) async {
    if (_lesson == null) return;
    try {
      final res = await ApiClient().dio.post(
        '/lessons/${_lesson!.id}/step',
        data: {'step': step},
      );
      if (res.data != null && res.data['success'] == true) {
        final data = res.data['data'];
        final xpAwarded = data['xpAwarded'] as int? ?? 0;
        final coinsAwarded = data['coinsAwarded'] as int? ?? 0;
        if (xpAwarded > 0) {
          ref.read(studentProvider.notifier).updateXP(xpAwarded);
        }
        if (coinsAwarded > 0) {
          ref.read(studentProvider.notifier).updateCoins(coinsAwarded);
        }
      }
    } catch (_) {}
  }

  Future<void> _startTestAttempt() async {
    if (_lesson == null) return;
    try {
      final res = await ApiClient().dio.post('/lessons/${_lesson!.id}/test/start');
      if (res.data != null && res.data['success'] == true) {
        final data = res.data['data'];
        final attemptId = data['attemptId'] as String?;
        final qList = (data['questions'] as List<dynamic>? ?? []).map((q) => {
          'id': q['id']?.toString() ?? '',
          'prompt': (q['text'] ?? q['prompt'] ?? '').toString(),
          'options': List<String>.from(q['options'] ?? []),
        }).toList();

        if (mounted && qList.isNotEmpty) {
          setState(() {
            _testAttemptId = attemptId;
            _quizQuestions = qList;
            _selectedAnswerIndices.clear();
            _quizSubmitted = false;
            _testResult = null;
            _unansweredHighlightIndex = null;
          });
        }
      }
    } catch (_) {}
  }

  Future<void> _submitTestAttempt() async {
    if (_lesson == null) return;

    final totalQ = _quizQuestions.length;
    int firstUnanswered = -1;
    for (int i = 0; i < totalQ; i++) {
      if (!_selectedAnswerIndices.containsKey(i) || _selectedAnswerIndices[i] == -1) {
        firstUnanswered = i;
        break;
      }
    }

    if (firstUnanswered != -1) {
      setState(() {
        _unansweredHighlightIndex = firstUnanswered;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Iltimos, barcha $totalQ ta savolga javob bering! (${_selectedAnswerIndices.length}/$totalQ bajarildi)',
            style: const TextStyle(fontWeight: FontWeight.w700),
          ),
          backgroundColor: const Color(0xFFE5484D),
          duration: const Duration(seconds: 2),
        ),
      );
      return;
    }

    setState(() => _isSavingProgress = true);

    try {
      final answersMap = <String, int>{};
      for (int i = 0; i < _quizQuestions.length; i++) {
        final qId = _quizQuestions[i]['id']?.toString() ?? '$i';
        answersMap[qId] = _selectedAnswerIndices[i] ?? 0;
      }

      final res = await ApiClient().dio.post(
        '/lessons/${_lesson!.id}/test/submit',
        data: {
          'attemptId': _testAttemptId ?? 'att_offline',
          'answers': answersMap,
        },
      );

      if (res.data != null && res.data['success'] == true) {
        final resultData = res.data['data'] as Map<String, dynamic>;
        final xpAwarded = resultData['xpAwarded'] as int? ?? 0;
        final coinsAwarded = resultData['coinsAwarded'] as int? ?? 0;
        final correctCount = resultData['correctCount'] as int? ?? 0;

        if (xpAwarded > 0) {
          ref.read(studentProvider.notifier).updateXP(xpAwarded);
        }
        if (coinsAwarded > 0) {
          ref.read(studentProvider.notifier).updateCoins(coinsAwarded);
        }

        if (mounted) {
          setState(() {
            _testResult = resultData;
            _correctCount = correctCount;
            _quizSubmitted = true;
            _isSavingProgress = false;
          });
        }
        return;
      }
    } catch (_) {}

    // Offline / Test fallback
    if (mounted) {
      int correct = 0;
      final reviews = <Map<String, dynamic>>[];
      for (int i = 0; i < _quizQuestions.length; i++) {
        final q = _quizQuestions[i];
        final selected = _selectedAnswerIndices[i] ?? 0;
        final opts = List<String>.from(q['options'] ?? []);
        final correctAns = q['correctAnswer'] ?? (opts.isNotEmpty ? opts[0] : '');
        final isCorr = opts.isNotEmpty && opts[selected] == correctAns;
        if (isCorr) correct++;
        reviews.add({
          'text': q['prompt'],
          'options': opts,
          'selectedOption': selected,
          'correctOption': opts.indexOf(correctAns),
          'isCorrect': isCorr,
          'explanation': q['explanation'] ?? '',
        });
      }
      final pct = totalQ > 0 ? ((correct / totalQ) * 100).round() : 100;
      setState(() {
        _correctCount = correct;
        _quizSubmitted = true;
        _isSavingProgress = false;
        _testResult = {
          'percent': pct,
          'isPassed': pct >= 60,
          'correctCount': correct,
          'totalCount': totalQ,
          'xpAwarded': pct >= 60 ? 40 : 0,
          'coinsAwarded': pct >= 60 ? 10 : 0,
          'questions': reviews,
        };
      });
      _recordStep(5);
    }
  }

  void _retryTest() {
    setState(() {
      _selectedAnswerIndices.clear();
      _quizSubmitted = false;
      _testResult = null;
      _unansweredHighlightIndex = null;
      _showErrorsOnly = false;
    });
    _startTestAttempt();
  }

  void _fetchLesson() async {
    final isTest = !kIsWeb && Platform.environment.containsKey('FLUTTER_TEST');
    if (isTest) {
      _loadFallbackLesson();
      return;
    }

    if (!mounted) return;
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final res = await ApiClient().dio.get(
            '/lessons/${widget.lessonId}',
            options: Options(
              validateStatus: (status) => true,
              sendTimeout: const Duration(seconds: 6),
              receiveTimeout: const Duration(seconds: 6),
            ),
          );

      if (res.statusCode == 200 &&
          res.data != null &&
          res.data['success'] == true) {
        final data = res.data['data'];
        final lesson = LessonModel.fromJson(data);

        // Extract quiz questions from lesson.questions or sections
        final questions = <Map<String, dynamic>>[];
        if (lesson.questions.isNotEmpty) {
          for (final q in lesson.questions) {
            questions.add({
              'id': q.id,
              'prompt': q.prompt,
              'options': q.options.isNotEmpty ? q.options : ['A', 'B', 'C', 'D'],
              'correctAnswer': q.correctAnswer,
              'explanation': q.explanation,
            });
          }
        } else if (data['sections'] != null && (data['sections'] as List).isNotEmpty) {
          for (final sec in data['sections']) {
            if (sec['questions'] != null &&
                (sec['questions'] as List).isNotEmpty) {
              for (final q in sec['questions']) {
                questions.add({
                  'id': q['id'],
                  'prompt': q['prompt'] ?? '',
                  'options':
                      List<String>.from(q['options'] ?? ['A', 'B', 'C', 'D']),
                  'correctAnswer': q['correctAnswer'] ?? '',
                  'explanation': q['explanation'] ?? '',
                });
              }
            }
          }
        }

        if (questions.isEmpty) {
          questions.addAll(_generateFallbackQuiz(lesson));
        }

        if (mounted) {
          setState(() {
            _lesson = lesson;
            _quizQuestions = questions;
            _isLoading = false;
            _errorMessage = null;
            if (lesson.isReview) {
              _currentStep = 4;
            }
          });
          if (lesson.isReview && _testAttemptId == null) {
            _startTestAttempt();
          }
          return;
        }
      } else if (res.statusCode == 404) {
        // Safe graceful fallback for offline / unseeded lesson IDs
        if (mounted) {
          _loadFallbackLesson();
          return;
        }
      }
    } catch (e) {
      if (kDebugMode) {
        debugPrint('ℹ️ [LessonReader] Darsni yuklashda ogohlantirish: $e');
      }
    }

    if (mounted) {
      _loadFallbackLesson();
    }
  }

  void _loadFallbackLesson() {
    final isG1 = widget.lessonId.contains('g1') || widget.lessonId.contains('k1');
    final lesson = LessonModel(
      id: widget.lessonId,
      courseId: isG1 ? 'course-g1' : 'course-g4-math',
      grade: isG1 ? 1 : 4,
      mode: 'KIDS',
      chapterTitle: isG1 ? 'Narsalar va ularning xossalari' : 'Kasrlar va Bo‘laklar',
      title: isG1 ? 'Narsalarning xossalari' : 'Oddiy kasrlar: Butunning bo‘laklari',
      topicKey: isG1 ? 'objects_properties' : 'fractions_intro',
      description: isG1
          ? 'Shakl, rang va o‘lcham bo‘yicha taqqoslash va katak daftarga chizish.'
          : 'Kasr nima? Surat va maxraj ma’nosi hamda qismlarga ajratish.',
      formulaLatex: isG1 ? null : r'\frac{1}{4} = \text{to‘rtdan bir}',
      contentMd: isG1
          ? 'Narsalar o‘z shakli, rangi va o‘lchami bilan bir-biridan farq qiladi.'
          : 'Kasr butunning bir yoki bir nechta teng bo‘laklarini ifodalaydi. Yuqoridagi son surat, pastdagi son esa maxraj deb ataladi.',
      emoji: isG1 ? '🔷' : '½',
      intro: isG1
          ? 'Narsalar o‘z shakli, rangi va o‘lchami bilan bir-biridan farq qiladi.'
          : 'Kasr butunning bir yoki bir nechta teng bo‘laklarini ifodalaydi.',
      keyPoints: isG1
          ? [
              'Narsalarni shakli, rangi va o‘lchamiga qarab guruhlaymiz.',
              'Shakllarni taqqoslab, o‘xshash va farqli tomonlarini topamiz.',
              'Katak daftarda shakllarni chizish qo‘lni mashq qildiradi.',
            ]
          : [
              'Kasr butunning teng bo‘laklarini ifodalaydi.',
              'Surat tepada, maxraj pastda bo‘ladi.',
            ],
      miniExample: isG1
          ? '🔴 (doira) va 🟦 (kvadrat) — har xil shakllar!'
          : '1/4 — to‘rtdan bir qism',
      rewardCoins: 12,
      rewardXP: 100,
      orderIndex: 1,
      sectionCount: 1,
      isCompleted: false,
    );

    if (mounted) {
      setState(() {
        _lesson = lesson;
        _quizQuestions = _generateFallbackQuiz(lesson);
        _isLoading = false;
      });
    }
  }

  List<Map<String, dynamic>> _generateFallbackQuiz(LessonModel lesson) {
    return [
      {
        'id': 'q1',
        'prompt': 'Kasrning chiziq ustidagi soni nima deb ataladi?',
        'options': ['Surat', 'Maxraj', 'Bo‘linuvchi', 'Ko‘paytuvchi'],
        'correctAnswer': 'Surat',
        'explanation':
            'Kasr chizig‘i ustidagi son surat bo‘lib, olingan teng bo‘laklar sonini bildiradi.',
      },
      {
        'id': 'q2',
        'prompt': 'Kasrning maxraji nimani bildiradi?',
        'options': [
          'Butun nechta teng bo‘lakka bo‘linganini',
          'Nechta qism olinganini',
          'Yig‘indini',
          'Ko‘paytmani'
        ],
        'correctAnswer': 'Butun nechta teng bo‘lakka bo‘linganini',
        'explanation':
            'Maxraj butun jami nechta teng qismga bo‘linganini ko‘rsatadi.',
      },
      {
        'id': 'q3',
        'prompt':
            'Pitsaning 4 ta teng bo‘lagidan 1 tasini yesak, qancha qismi qoladi?',
        'options': ['3/4', '1/4', '2/4', '4/4'],
        'correctAnswer': '3/4',
        'explanation':
            '4 ta bo‘lakdan 1 tasi yeyilsa, 3 ta bo‘lak qoladi, ya’ni 3/4 qismi.',
      },
    ];
  }

  Future<void> _completeLesson() async {
    if (_lesson == null || _isSavingProgress) return;
    setState(() => _isSavingProgress = true);

    try {
      final res =
          await ApiClient().dio.post('/lessons/${_lesson!.id}/complete');
      if (res.data['success'] == true) {
        final data = res.data['data'];
        final isFirst = data['isFirstCompletion'] == true;
        final coins = data['coinsAwarded'] as int? ??
            (isFirst ? _lesson!.rewardCoins : 0);
        final xp =
            data['xpAwarded'] as int? ?? (isFirst ? _lesson!.rewardXP : 0);

        ref.read(studentProvider.notifier).markLessonCompleted(
              lessonId: _lesson!.id,
              rewardCoins: coins,
              rewardXP: xp,
            );

        if (!mounted) return;
        _showSuccessDialog(isFirst, coins, xp);
        return;
      }
    } catch (_) {}

    // Offline / fallback completion
    ref.read(studentProvider.notifier).markLessonCompleted(
          lessonId: _lesson!.id,
          rewardCoins: _lesson!.rewardCoins,
          rewardXP: _lesson!.rewardXP,
        );

    if (mounted) {
      _showSuccessDialog(true, _lesson!.rewardCoins, _lesson!.rewardXP);
    }
  }

  void _showSuccessDialog(bool isFirst, int coins, int xp) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) {
        return AlertDialog(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
          contentPadding: const EdgeInsets.fromLTRB(24, 24, 24, 20),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 72,
                height: 72,
                decoration: const BoxDecoration(
                  color: Color(0xFFECFDF5),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.stars_rounded,
                    color: Color(0xFF10B981), size: 44),
              ),
              const SizedBox(height: 16),
              const Text(
                'Dars muvaffaqiyatli yakunlandi!',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
              ),
              const SizedBox(height: 8),
              Text(
                isFirst
                    ? 'Siz ${_quizQuestions.length} ta savoldan $_correctCount tasiga to‘g‘ri javob berdingiz va yutuqlarni qo‘lga kiritdingiz!'
                    : 'Siz ${_quizQuestions.length} ta savoldan $_correctCount tasiga to‘g‘ri javob berdingiz.',
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 13, color: Colors.grey),
              ),
              const SizedBox(height: 18),
              if (isFirst)
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFF7ED),
                        borderRadius: BorderRadius.circular(999),
                        border: Border.all(color: const Color(0xFFFED7AA)),
                      ),
                      child: Row(
                        children: [
                          const XpCoin(size: 16, showGlow: false),
                          const SizedBox(width: 4),
                          Text('+$xp XP',
                              style: const TextStyle(
                                  color: Color(0xFFD97706),
                                  fontWeight: FontWeight.w900)),
                        ],
                      ),
                    ),
                    const SizedBox(width: 10),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFEFCE8),
                        borderRadius: BorderRadius.circular(999),
                        border: Border.all(color: const Color(0xFFFEF08A)),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.monetization_on_rounded,
                              color: Color(0xFFCA8A04), size: 16),
                          const SizedBox(width: 4),
                          Text('+$coins',
                              style: const TextStyle(
                                  color: Color(0xFFCA8A04),
                                  fontWeight: FontWeight.w900)),
                        ],
                      ),
                    ),
                  ],
                ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                height: 44,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.of(ctx).pop();
                    context.pop(); // Go back to lesson list or map
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF6C47FF),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14)),
                  ),
                  child: const Text('Darslar ro‘yxatiga qaytish',
                      style: TextStyle(fontWeight: FontWeight.w800)),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);
    final student = ref.watch(studentProvider).student;
    final coins = student?.coinBalance ?? 0;

    if (_isLoading) {
      return Scaffold(
        backgroundColor: colors.bg,
        body: Center(
          child: CircularProgressIndicator(color: colors.primary),
        ),
      );
    }

    if (_lesson == null) {
      return Scaffold(
        backgroundColor: colors.bg,
        appBar: AppBar(
          backgroundColor: colors.card,
          elevation: 0,
          leading: IconButton(
            icon: Icon(Icons.arrow_back_ios_rounded, color: colors.ink),
            onPressed: () => context.pop(),
          ),
          title: Text('Dars',
              style: TextStyle(color: colors.ink, fontWeight: FontWeight.bold)),
        ),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.menu_book_rounded, size: 64, color: colors.primary),
                const SizedBox(height: 16),
                Text(
                  _errorMessage ?? 'Dars topilmadi yoki vaqtincha ochilmadi.',
                  style: TextStyle(
                      color: colors.ink,
                      fontSize: 16,
                      fontWeight: FontWeight.w600),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 24),
                ElevatedButton.icon(
                  onPressed: _fetchLesson,
                  icon: const Icon(Icons.refresh_rounded),
                  label: const Text('Qayta urinish'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: colors.primary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 24, vertical: 12),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14)),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    final lesson = _lesson!;

    return Scaffold(
      backgroundColor: colors.bg,
      appBar: AppBar(
        backgroundColor: colors.card,
        elevation: 0,
        title: Text(
          lesson.title,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: TextStyle(
            fontWeight: FontWeight.w900,
            fontSize: 16,
            color: colors.ink,
          ),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Center(
              child: CoinBadge(count: coins, size: 24),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Top Step Progress Indicator (1 of 5)
            _buildStepIndicator(colors),

            // Step Content Area
            Expanded(
              child: SingleChildScrollView(
                padding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                child: _buildCurrentStepContent(colors, lesson),
              ),
            ),

            // Bottom Navigation Bar (Orqaga / Keyingi)
            _buildBottomNav(colors),
          ],
        ),
      ),
    );
  }

  Widget _buildStepIndicator(AppThemeColors colors) {
    if (_lesson?.isReview == true) {
      return Container(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
        decoration: BoxDecoration(
          color: colors.card,
          border: Border(bottom: BorderSide(color: colors.border, width: 1)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFFFFC83D).withOpacity(0.18),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Text('📝', style: TextStyle(fontSize: 18)),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _lesson?.title ?? 'Nazorat ishi',
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF6C3CE0),
                    ),
                  ),
                  const SizedBox(height: 2),
                  const Text(
                    '20 ta test savoli · 120 XP · 12 🪙',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFFB45309),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
      decoration: BoxDecoration(
        color: colors.card,
        border: Border(bottom: BorderSide(color: colors.border, width: 1)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  '${_currentStep + 1}-qadam: ${_stepTitles[_currentStep]}',
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF6C3CE0),
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                '${_currentStep + 1} / ${_stepTitles.length}',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: colors.muted,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          // 5 Circular Progress Dots with connecting lines
          Row(
            children: [
              for (int i = 0; i < _stepTitles.length; i++) ...[
                // Dot
                AnimatedBuilder(
                  animation: _pulseAnimation,
                  builder: (context, child) {
                    final isPassed = i < _currentStep;
                    final isCurrent = i == _currentStep;

                    return Transform.scale(
                      scale: isCurrent ? _pulseAnimation.value : 1.0,
                      child: Container(
                        width: isCurrent ? 18 : 12,
                        height: isCurrent ? 18 : 12,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: isCurrent || isPassed
                              ? const LinearGradient(
                                  colors: [Color(0xFF6C3CE0), Color(0xFF7C4DFF)],
                                )
                              : null,
                          color: isCurrent || isPassed ? null : colors.border,
                          boxShadow: isCurrent
                              ? [
                                  BoxShadow(
                                    color: const Color(0xFF7C4DFF).withOpacity(0.5),
                                    blurRadius: 8,
                                    spreadRadius: 1,
                                  ),
                                ]
                              : null,
                        ),
                        child: isPassed
                            ? const Icon(
                                Icons.check,
                                size: 8,
                                color: Colors.white,
                              )
                            : null,
                      ),
                    );
                  },
                ),
                // Connector line
                if (i < _stepTitles.length - 1)
                  Expanded(
                    child: Container(
                      height: 3,
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      decoration: BoxDecoration(
                        color: i < _currentStep
                            ? const Color(0xFF7C4DFF)
                            : colors.border,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
              ],
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCurrentStepContent(AppThemeColors colors, LessonModel lesson) {
    switch (_currentStep) {
      case 0:
        return _buildStepKirish(colors, lesson);
      case 1:
        return _buildStepTushuntirish(colors, lesson);
      case 2:
        return _buildStepMisollar(colors, lesson);
      case 3:
        return _buildStepMashq(colors, lesson);
      case 4:
        return _buildStepMiniTest(colors, lesson);
      default:
        return const SizedBox();
    }
  }

  Widget _buildStepKirish(AppThemeColors colors, LessonModel lesson) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final emoji = lesson.emoji ?? lesson.icon ?? '🔷';
    final keyPoints = lesson.keyPoints.isNotEmpty
        ? lesson.keyPoints
        : [
            'Mavzuni diqqat bilan o‘rganamiz.',
            'Misollarni qadam-baqadam ko‘rib chiqamiz.',
            'Mashqlarni mustaqil bajarib ko‘ramiz.'
          ];
    final miniExample = lesson.miniExample ?? '🔴 (doira) va 🟦 (kvadrat) — har xil shakllar!';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // 1. Hero Card (~220px, radius 28, gradient #7C4DFF -> #5B2EE6)
        Container(
          constraints: const BoxConstraints(minHeight: 220),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF7C4DFF), Color(0xFF5B2EE6)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(28),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF5B2EE6).withOpacity(0.35),
                blurRadius: 18,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Chapter pill
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  '${lesson.grade}-SINF • ${(lesson.chapterTitle ?? 'MATEMATIKA').toUpperCase()}',
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Floating 2s Animated Emoji
              AnimatedBuilder(
                animation: _floatAnimation,
                builder: (context, child) {
                  return Transform.translate(
                    offset: Offset(0, _floatAnimation.value),
                    child: child,
                  );
                },
                child: Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.18),
                    shape: BoxShape.circle,
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    emoji,
                    style: const TextStyle(fontSize: 48),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Title
              Text(
                lesson.title,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w900,
                  color: Colors.white,
                  height: 1.25,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),

        // 2. "Bugun nimani o‘rganamiz?" Card
        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF160E36) : Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFF6C3CE0).withOpacity(0.2)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.03),
                blurRadius: 10,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: const Color(0xFF6C3CE0).withOpacity(0.12),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(Icons.track_changes_rounded,
                        color: Color(0xFF6C3CE0), size: 18),
                  ),
                  const SizedBox(width: 8),
                  const Expanded(
                    child: Text(
                      'Bugun nimani o‘rganamiz?',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF6C3CE0),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                lesson.intro ?? lesson.description,
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.w800,
                  color: colors.ink,
                  height: 1.45,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // 3. "Esda tuting" Block (#FFF6D6)
        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF282010) : const Color(0xFFFFF6D6),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: isDark ? const Color(0xFF6B5310) : const Color(0xFFFFE082),
              width: 1.2,
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: const [
                  Text('💡', style: TextStyle(fontSize: 20)),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Esda tuting!',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFFB45309),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              ...keyPoints.map((point) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        '• ',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFFD97706),
                        ),
                      ),
                      Expanded(
                        child: Text(
                          point,
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: isDark ? const Color(0xFFFDE68A) : const Color(0xFF78350F),
                            height: 1.4,
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              }),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // 4. "Keling, ko‘ramiz" Visual Example Card
        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF1E1738) : const Color(0xFFF8F7FF),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFF7C4DFF).withOpacity(0.2)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: const [
                  Text('👀', style: TextStyle(fontSize: 20)),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Keling, ko‘ramiz!',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF6C3CE0),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Center(
                child: Text(
                  miniExample,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    color: colors.ink,
                    height: 1.4,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // 5. "Boshlaymiz! 🚀" Big Button
        GestureDetector(
          onTap: () {
            _recordStep(1);
            setState(() {
              _currentStep = 1;
            });
          },
          child: Container(
            height: 56,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF6C3CE0), Color(0xFF7C4DFF)],
              ),
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF6C3CE0).withOpacity(0.4),
                  blurRadius: 14,
                  offset: const Offset(0, 5),
                ),
              ],
            ),
            alignment: Alignment.center,
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'Boshlaymiz! 🚀',
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 8),

        // Subtext under button
        Center(
          child: Text(
            '~${lesson.estMinutes} daqiqa · +${lesson.rewardXP} XP · +${lesson.rewardCoins} 🪙',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: colors.muted,
            ),
          ),
        ),
        const SizedBox(height: 16),
      ],
    );
  }

  Widget _buildStepTushuntirish(AppThemeColors colors, LessonModel lesson) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Formula Banner if available
        if (lesson.formulaLatex != null && lesson.formulaLatex!.isNotEmpty) ...[
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  colors.primary.withOpacity(0.12),
                  colors.primary.withOpacity(0.04)
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: colors.primary.withOpacity(0.3)),
            ),
            child: Column(
              children: [
                Text(
                  'Asosiy Formula / Qoida',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    color: colors.primary,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  lesson.formulaLatex!,
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    color: colors.ink,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),
        ],

        // Visual Diagram
        _buildVisualDiagram(lesson),
        const SizedBox(height: 18),

        // Detailed Explanation Card
        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: colors.card,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: colors.border),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(Icons.menu_book_rounded,
                      color: colors.primary, size: 22),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Nazariy tushunchalar',
                      style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: colors.ink),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              MathMarkdownView(
                content: '''### Qoidaning mohiyati
Har qanday matematik amal va formula aniq mantiqqa tayanadi.
Qoidalarni yodlashdan ko‘ra, ularning kelib chiqish sababini tushunish muhimroq.

- Diqqat bilan shartni o‘qing.
- Amallar tartibiga e’tibor bering.
- Natijani tekshirishni unutmang.''',
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildStepMisollar(AppThemeColors colors, LessonModel lesson) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(Icons.calculate_rounded, color: colors.primary, size: 24),
            const SizedBox(width: 8),
            Text(
              'Ishlangan misollar',
              style: TextStyle(
                  fontSize: 18, fontWeight: FontWeight.w900, color: colors.ink),
            ),
          ],
        ),
        const SizedBox(height: 14),

        // Example 1
        _buildExampleCard(
          number: '1',
          title: 'Asosiy misol',
          problem:
              'Berilgan qoida asosida hisoblash amalini qadam-baqadam bajaring.',
          solution:
              '1-qadam: Formulani yozamiz.\n2-qadam: Qiymatlarni o‘rniga qo‘yamiz.\n3-qadam: Yakuniy to‘g‘ri natijani olamiz.',
          colors: colors,
        ),
        const SizedBox(height: 14),

        // Example 2
        _buildExampleCard(
          number: '2',
          title: 'Amaliy masala',
          problem: 'Kundalik hayotda ushbu mavzu qanday qo‘llaniladi?',
          solution:
              'Tushunchani real narsalar (taqsimot, o‘lchash, hisob) bilan solishtirib yechim topamiz.',
          colors: colors,
        ),
      ],
    );
  }

  Widget _buildExampleCard({
    required String number,
    required String title,
    required String problem,
    required String solution,
    required AppThemeColors colors,
  }) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: colors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: colors.primary,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  'Misol $number',
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 11,
                      fontWeight: FontWeight.w900),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                title,
                style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w800,
                    color: colors.ink),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            problem,
            style: TextStyle(
                fontSize: 13, fontWeight: FontWeight.w600, color: colors.ink),
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: colors.bg,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: colors.border.withOpacity(0.5)),
            ),
            child: Text(
              solution,
              style: TextStyle(fontSize: 12, height: 1.45, color: colors.muted),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStepMashq(AppThemeColors colors, LessonModel lesson) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Common Mistakes Card
        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: const Color(0xFFFEF2F2),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFFCA5A5).withOpacity(0.4)),
          ),
          child: const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(Icons.warning_amber_rounded,
                      color: Color(0xFFEF4444), size: 22),
                  SizedBox(width: 8),
                  Text(
                    'Keng tarqalgan xatolar',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFFB91C1C),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 10),
              Text(
                '• Amallar tartibini buzish (ko‘paytirish/bo‘lishni qo‘shish/ayirishdan keyin bajarish).\n'
                '• Ishoralarni unutib qoldirish (minus va plyus qoidalari).\n'
                '• Masala shartini oxirigacha diqqat bilan o‘qimaslik.',
                style: TextStyle(
                    fontSize: 13, height: 1.45, color: Color(0xFF991B1B)),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // AI Ustoz Tip Card
        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: const Color(0xFFF0FDF4),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFF86EFAC).withOpacity(0.4)),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Icon(Icons.smart_toy_rounded,
                  color: Color(0xFF16A34A), size: 28),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'AI Ustoz maslahati',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF15803D),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Keyingi bosqichda siz 20 ta nazorat test savollariga javob berasiz. '
                      '60% dan yuqori natija bilan keyingi mavzuni ochasiz hamda XP va tangalarga ega bo‘lasiz. Tayyormisiz?',
                      style: TextStyle(
                          fontSize: 13,
                          height: 1.4,
                          color: const Color(0xFF166534).withOpacity(0.9)),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildStepMiniTest(AppThemeColors colors, LessonModel lesson) {
    if (_quizSubmitted && _testResult != null) {
      return _buildTestResultView(colors, lesson, _testResult!);
    }

    final totalCount = _quizQuestions.length;
    final answeredCount = _selectedAnswerIndices.length;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Header
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Icon(Icons.quiz_rounded, color: colors.primary, size: 24),
                const SizedBox(width: 8),
                Text(
                  'Nazorat mini-testi',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                    color: colors.ink,
                  ),
                ),
              ],
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: colors.primary.withOpacity(0.12),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                '$totalCount ta savol',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  color: colors.primary,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 14),

        // Sticky progress counter card
        Container(
          margin: const EdgeInsets.only(bottom: 18),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: colors.card,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: colors.border),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.03),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Javob berildi: $answeredCount/$totalCount',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w800,
                      color: colors.ink,
                    ),
                  ),
                  Text(
                    '${totalCount > 0 ? ((answeredCount / totalCount) * 100).round() : 0}%',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w800,
                      color: colors.primary,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              ClipRRect(
                borderRadius: BorderRadius.circular(999),
                child: LinearProgressIndicator(
                  value: totalCount > 0 ? answeredCount / totalCount : 0.0,
                  backgroundColor: colors.border,
                  valueColor: AlwaysStoppedAnimation<Color>(colors.primary),
                  minHeight: 8,
                ),
              ),
            ],
          ),
        ),

        // Render each question card
        ..._quizQuestions.asMap().entries.map((entry) {
          final qIdx = entry.key;
          final q = entry.value;
          final prompt = q['prompt'] as String;
          final options = List<String>.from(q['options'] ?? []);
          final userSelectedIdx = _selectedAnswerIndices[qIdx];
          final isHighlighted = _unansweredHighlightIndex == qIdx;

          return Container(
            margin: const EdgeInsets.only(bottom: 18),
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: colors.card,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: isHighlighted
                    ? const Color(0xFFE5484D)
                    : colors.border,
                width: isHighlighted ? 2.0 : 1.0,
              ),
              boxShadow: [
                BoxShadow(
                  color: isHighlighted
                      ? const Color(0xFFE5484D).withOpacity(0.08)
                      : Colors.black.withOpacity(0.02),
                  blurRadius: 10,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 26,
                      height: 26,
                      decoration: BoxDecoration(
                        color: userSelectedIdx != null
                            ? colors.primary.withOpacity(0.12)
                            : (isHighlighted ? const Color(0xFFFEE2E2) : colors.bg),
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: isHighlighted ? const Color(0xFFE5484D) : colors.border,
                        ),
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        '${qIdx + 1}',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          color: userSelectedIdx != null
                              ? colors.primary
                              : (isHighlighted ? const Color(0xFFE5484D) : colors.muted),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        prompt,
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w800,
                          color: colors.ink,
                          height: 1.35,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),

                // Option Cards
                ...options.asMap().entries.map((optEntry) {
                  final optIdx = optEntry.key;
                  final optText = optEntry.value;
                  final isSelected = userSelectedIdx == optIdx;
                  final optLetter = String.fromCharCode(65 + optIdx);

                  Color tileColor = colors.bg;
                  Color borderColor = colors.border;
                  Color textColor = colors.ink;

                  if (isSelected) {
                    tileColor = colors.primary.withOpacity(0.08);
                    borderColor = colors.primary;
                    textColor = colors.primary;
                  }

                  return Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: InkWell(
                      borderRadius: BorderRadius.circular(12),
                      onTap: () {
                        setState(() {
                          _selectedAnswerIndices[qIdx] = optIdx;
                          _selectedAnswers[qIdx] = optText;
                          if (_unansweredHighlightIndex == qIdx) {
                            _unansweredHighlightIndex = null;
                          }
                        });
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        decoration: BoxDecoration(
                          color: tileColor,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: borderColor, width: 1.5),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 24,
                              height: 24,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: isSelected ? colors.primary : Colors.transparent,
                                border: Border.all(color: borderColor, width: 1.5),
                              ),
                              alignment: Alignment.center,
                              child: isSelected
                                  ? const Icon(Icons.check, size: 14, color: Colors.white)
                                  : Text(
                                      optLetter,
                                      style: TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w800,
                                        color: colors.muted,
                                      ),
                                    ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                optText,
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                                  color: textColor,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                }),
              ],
            ),
          );
        }),
      ],
    );
  }

  Widget _buildTestResultView(
    AppThemeColors colors,
    LessonModel lesson,
    Map<String, dynamic> result,
  ) {
    final percent = result['percent'] as int? ?? 0;
    final correctCount = result['correctCount'] as int? ?? 0;
    final totalCount = result['totalCount'] as int? ?? 20;
    final isPassed = result['isPassed'] as bool? ?? (percent >= 60);
    final xpAwarded = result['xpAwarded'] as int? ?? 0;
    final coinsAwarded = result['coinsAwarded'] as int? ?? 0;
    final rawReviews = result['questions'] as List<dynamic>? ?? [];

    Color ringColor;
    String tierTitle;
    if (percent >= 90) {
      ringColor = const Color(0xFF2EB67D);
      tierTitle = 'Ajoyib! 🏆';
    } else if (percent >= 70) {
      ringColor = const Color(0xFF6C3CE0);
      tierTitle = 'Zo‘r! 👏';
    } else if (percent >= 60) {
      ringColor = const Color(0xFF3B82F6);
      tierTitle = 'Yaxshi, mavzu o‘tildi ✅';
    } else {
      ringColor = const Color(0xFFE5484D);
      tierTitle = 'Yana bir urinib ko‘ring 💪';
    }

    final filteredReviews = _showErrorsOnly
        ? rawReviews.where((r) => r['isCorrect'] != true).toList()
        : rawReviews;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        // 1. Big Circular Percentage Ring
        Container(
          width: 140,
          height: 140,
          margin: const EdgeInsets.only(top: 8, bottom: 16),
          child: Stack(
            alignment: Alignment.center,
            children: [
              SizedBox(
                width: 140,
                height: 140,
                child: CircularProgressIndicator(
                  value: (percent / 100).clamp(0.0, 1.0),
                  backgroundColor: colors.border.withOpacity(0.5),
                  valueColor: AlwaysStoppedAnimation<Color>(ringColor),
                  strokeWidth: 10,
                ),
              ),
              Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    '$percent%',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.w900,
                      color: ringColor,
                      letterSpacing: -1,
                    ),
                  ),
                  Text(
                    '$correctCount / $totalCount',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: colors.muted,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),

        // 2. Tier Title & Encouragement
        Text(
          tierTitle,
          style: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.w900,
            color: colors.ink,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 6),
        Text(
          isPassed
              ? 'Tabriklaymiz! Siz 60% dan yuqori natija bilan keyingi mavzuni ochdingiz!'
              : 'O‘tish bali 60% (12 ta to‘g‘ri javob). Qaytadan urinib ko‘ring va yuqoriroq bal to‘plang!',
          style: TextStyle(
            fontSize: 13,
            color: colors.muted,
            height: 1.35,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 16),

        // 3. Rewards Banner
        if (xpAwarded > 0 || coinsAwarded > 0)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            margin: const EdgeInsets.only(bottom: 16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  const Color(0xFF6C3CE0).withOpacity(0.12),
                  const Color(0xFFFFC83D).withOpacity(0.15),
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: colors.primary.withOpacity(0.2)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (xpAwarded > 0) ...[
                  const Icon(Icons.bolt_rounded, color: Color(0xFF6C3CE0), size: 20),
                  const SizedBox(width: 4),
                  Text(
                    '+$xpAwarded XP',
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF6C3CE0),
                    ),
                  ),
                  const SizedBox(width: 14),
                ],
                if (coinsAwarded > 0) ...[
                  const Text('🪙', style: TextStyle(fontSize: 16)),
                  const SizedBox(width: 5),
                  Text(
                    '+$coinsAwarded tanga',
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFFB45309),
                    ),
                  ),
                ],
              ],
            ),
          ),

        // 4. Confetti notice for high performers
        if (percent >= 80)
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(12),
            margin: const EdgeInsets.only(bottom: 16),
            decoration: BoxDecoration(
              color: const Color(0xFFECFDF5),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFF10B981).withOpacity(0.3)),
            ),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('🎉', style: TextStyle(fontSize: 18)),
                SizedBox(width: 8),
                Text(
                  'Ajoyib yutuq! Maxsus mahorat ko‘rsatildi!',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF047857),
                  ),
                ),
              ],
            ),
          ),

        // 5. Action Buttons (Apple Style)
        Row(
          children: [
            Expanded(
              child: ElevatedButton.icon(
                onPressed: _retryTest,
                icon: const Icon(Icons.refresh_rounded, size: 18),
                label: const Text('Qayta urinish'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: isPassed ? colors.bg : const Color(0xFF6C3CE0),
                  foregroundColor: isPassed ? colors.ink : Colors.white,
                  elevation: 0,
                  side: isPassed ? BorderSide(color: colors.border) : BorderSide.none,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
              ),
            ),
            if (isPassed) ...[
              const SizedBox(width: 10),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    // Navigate to next lesson if available, else back to list
                    final nextBookNum = lesson.bookNumber + 1;
                    if (nextBookNum <= 74) {
                      final pad = nextBookNum < 10 ? '0$nextBookNum' : '$nextBookNum';
                      context.pushReplacement('/kids/lesson/lesson-g1-$pad');
                    } else {
                      context.pop();
                    }
                  },
                  icon: const Icon(Icons.arrow_forward_rounded, size: 18),
                  label: const Text('Keyingi mavzu'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF2EB67D),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                ),
              ),
            ],
          ],
        ),
        const SizedBox(height: 8),

        OutlinedButton.icon(
          onPressed: () => context.pop(),
          icon: const Icon(Icons.list_alt_rounded, size: 18),
          label: const Text('Mavzular ro‘yxatiga qaytish'),
          style: OutlinedButton.styleFrom(
            foregroundColor: colors.muted,
            side: BorderSide(color: colors.border),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          ),
        ),
        const SizedBox(height: 24),

        // 6. "Xatolarni ko‘rish" (Answers Review)
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Savollar tahlili (${filteredReviews.length})',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w900,
                color: colors.ink,
              ),
            ),
            TextButton.icon(
              onPressed: () {
                setState(() {
                  _showErrorsOnly = !_showErrorsOnly;
                });
              },
              icon: Icon(
                _showErrorsOnly ? Icons.visibility_rounded : Icons.filter_alt_outlined,
                size: 16,
                color: colors.primary,
              ),
              label: Text(
                _showErrorsOnly ? 'Barchasini ko‘rish' : 'Faqat xatolar',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  color: colors.primary,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),

        ...filteredReviews.asMap().entries.map((revEntry) {
          final rev = revEntry.value as Map<String, dynamic>;
          final qNum = revEntry.key + 1;
          final prompt = rev['text']?.toString() ?? '';
          final options = List<String>.from(rev['options'] ?? []);
          final selectedIdx = rev['selectedOption'] as int? ?? -1;
          final correctIdx = rev['correctOption'] as int? ?? 0;
          final isCorr = rev['isCorrect'] as bool? ?? false;
          final explanation = rev['explanation']?.toString() ?? '';

          return Container(
            margin: const EdgeInsets.only(bottom: 14),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: colors.card,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isCorr ? const Color(0xFF10B981).withOpacity(0.4) : const Color(0xFFE5484D).withOpacity(0.4),
                width: 1.2,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(
                      isCorr ? Icons.check_circle_rounded : Icons.cancel_rounded,
                      color: isCorr ? const Color(0xFF10B981) : const Color(0xFFE5484D),
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        '$qNum. $prompt',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w800,
                          color: colors.ink,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),

                // Options review
                ...options.asMap().entries.map((optEntry) {
                  final idx = optEntry.key;
                  final text = optEntry.value;
                  final wasSelected = selectedIdx == idx;
                  final isAnswer = correctIdx == idx;

                  Color optBg = colors.bg;
                  Color optBorder = colors.border;
                  Color optColor = colors.ink;
                  IconData? optIcon;

                  if (isAnswer) {
                    optBg = const Color(0xFFECFDF5);
                    optBorder = const Color(0xFF10B981);
                    optColor = const Color(0xFF047857);
                    optIcon = Icons.check_circle_rounded;
                  } else if (wasSelected && !isAnswer) {
                    optBg = const Color(0xFFFEF2F2);
                    optBorder = const Color(0xFFE5484D);
                    optColor = const Color(0xFFB91C1C);
                    optIcon = Icons.cancel_rounded;
                  }

                  return Container(
                    margin: const EdgeInsets.only(bottom: 6),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: optBg,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: optBorder),
                    ),
                    child: Row(
                      children: [
                        if (optIcon != null) ...[
                          Icon(optIcon, size: 16, color: optBorder),
                          const SizedBox(width: 8),
                        ],
                        Expanded(
                          child: Text(
                            text,
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: isAnswer || wasSelected ? FontWeight.w800 : FontWeight.w600,
                              color: optColor,
                            ),
                          ),
                        ),
                        if (wasSelected)
                          Text(
                            isAnswer ? '(Sizning javobingiz ✓)' : '(Sizning javobingiz ✗)',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: optColor,
                            ),
                          ),
                      ],
                    ),
                  );
                }),

                if (explanation.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: colors.bg,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Icon(Icons.lightbulb_outline_rounded, size: 15, color: Color(0xFFD97706)),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            explanation,
                            style: TextStyle(
                              fontSize: 12,
                              color: colors.muted,
                              height: 1.35,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          );
        }),
      ],
    );
  }

  Widget _buildVisualDiagram(LessonModel lesson) {
    final title = lesson.title.toLowerCase();
    final isFraction = title.contains('kasr');
    final isPercentage = title.contains('foiz');

    if (isFraction) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: AppColors.kidsBorder, width: 1.2),
        ),
        child: Column(
          children: [
            SizedBox(
              width: 120,
              height: 120,
              child: CustomPaint(
                painter:
                    FractionPiePainter(highlightedSlices: 1, totalSlices: 4),
              ),
            ),
            const SizedBox(height: 14),
            const Text(
              '1/4 — To‘rtdan bir qism (chorak)',
              style: TextStyle(
                  fontWeight: FontWeight.w800,
                  fontSize: 13,
                  color: AppColors.kidsDarkText),
            ),
          ],
        ),
      );
    } else if (isPercentage) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: AppColors.kidsBorder, width: 1.2),
        ),
        child: Column(
          children: [
            const Text('Foiz shkalasi: 100% — Butun',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
            const SizedBox(height: 12),
            ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: Container(
                height: 28,
                color: const Color(0xFFEFF0FA),
                child: Row(
                  children: [
                    Expanded(
                        flex: 25,
                        child: Container(
                            color: const Color(0xFF6C5CE7),
                            child: const Center(
                                child: Text('25%',
                                    style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold))))),
                    Expanded(
                        flex: 25,
                        child: Container(
                            color: const Color(0xFF8B7CF6),
                            child: const Center(
                                child: Text('50%',
                                    style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold))))),
                    Expanded(
                        flex: 50,
                        child: Container(
                            color: const Color(0xFFDED6FF),
                            child: const Center(
                                child: Text('100%',
                                    style: TextStyle(
                                        color: Color(0xFF4C3EC7),
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold))))),
                  ],
                ),
              ),
            ),
          ],
        ),
      );
    } else {
      final emoji = lesson.emoji ?? lesson.icon ?? '📐';
      final example = lesson.miniExample ?? lesson.intro ?? lesson.title;
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: AppColors.kidsBorder, width: 1.2),
        ),
        child: Column(
          children: [
            Text(emoji, style: const TextStyle(fontSize: 40)),
            const SizedBox(height: 10),
            Text(
              example,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
                color: Color(0xFF6C47FF),
              ),
            ),
          ],
        ),
      );
    }
  }

  Widget _buildBottomNav(AppThemeColors colors) {
    if (_currentStep == 0) {
      return const SizedBox.shrink();
    }

    final isLastStep = _currentStep == _stepTitles.length - 1;

    if (isLastStep && _quizSubmitted && _testResult != null) {
      return const SizedBox.shrink();
    }

    return Container(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 16),
      decoration: BoxDecoration(
        color: colors.card,
        border: Border(top: BorderSide(color: colors.border, width: 1)),
      ),
      child: Row(
        children: [
          // "Orqaga" / "Chiqish" Button
          OutlinedButton(
            onPressed: () {
              if (_lesson?.isReview == true) {
                context.pop();
              } else {
                setState(() {
                  _currentStep--;
                });
              }
            },
            style: OutlinedButton.styleFrom(
              foregroundColor: colors.ink,
              side: BorderSide(color: colors.border),
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            ),
            child: Text(
              _lesson?.isReview == true ? 'Chiqish' : 'Orqaga',
              style: const TextStyle(fontWeight: FontWeight.w700),
            ),
          ),
          const SizedBox(width: 12),

          // "Keyingi" or "Testni tekshirish" Button
          Expanded(
            child: SizedBox(
              height: 48,
              child: ElevatedButton(
                onPressed: () {
                  if (!isLastStep) {
                    final nextStep = _currentStep + 1;
                    _recordStep(nextStep + 1);
                    if (nextStep == 4 && _testAttemptId == null) {
                      _startTestAttempt();
                    }
                    setState(() {
                      _currentStep = nextStep;
                    });
                  } else {
                    if (!_quizSubmitted) {
                      _submitTestAttempt();
                    } else {
                      _completeLesson();
                    }
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6C3CE0),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  elevation: 0,
                ),
                child: Text(
                  !isLastStep
                      ? 'Keyingi bosqich'
                      : (!_quizSubmitted ? 'Testni tekshirish' : 'Darsni yakunlash'),
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class FractionPiePainter extends CustomPainter {
  final int highlightedSlices;
  final int totalSlices;

  FractionPiePainter(
      {required this.highlightedSlices, required this.totalSlices});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;
    final sweepAngle = 2 * math.pi / totalSlices;

    final basePaint = Paint()
      ..color = const Color(0xFFF3F0FF)
      ..style = PaintingStyle.fill;

    final highlightPaint = Paint()
      ..color = const Color(0xFF6C5CE7)
      ..style = PaintingStyle.fill;

    final borderPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5;

    for (int i = 0; i < totalSlices; i++) {
      final startAngle = -math.pi / 2 + i * sweepAngle;
      final isHighlighted = i < highlightedSlices;
      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        startAngle,
        sweepAngle,
        true,
        isHighlighted ? highlightPaint : basePaint,
      );
      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        startAngle,
        sweepAngle,
        true,
        borderPaint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant FractionPiePainter oldDelegate) {
    return oldDelegate.highlightedSlices != highlightedSlices ||
        oldDelegate.totalSlices != totalSlices;
  }
}
