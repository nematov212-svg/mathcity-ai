import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/coin_badge.dart';
import '../../core/network/api_client.dart';
import '../../shared/providers/student_provider.dart';

class LessonMapScreen extends ConsumerStatefulWidget {
  const LessonMapScreen({super.key});

  @override
  ConsumerState<LessonMapScreen> createState() => _LessonMapScreenState();
}

class _LessonMapScreenState extends ConsumerState<LessonMapScreen> {
  int _selectedGrade = 4;

  @override
  void initState() {
    super.initState();
    final student = ref.read(studentProvider).student;
    if (student != null && student.grade >= 1 && student.grade <= 11) {
      _selectedGrade = student.grade;
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);
    final coinBalance = ref.watch(studentProvider).student?.coinBalance ?? 0;

    return Scaffold(
      backgroundColor: colors.bg,
      appBar: AppBar(
        backgroundColor: colors.card,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new_rounded, color: colors.ink),
          onPressed: () => context.canPop() ? context.pop() : context.go('/kids/home'),
        ),
        title: Text(
          'Darslar xaritasi',
          style: TextStyle(
            fontWeight: FontWeight.w900,
            fontSize: 18,
            color: colors.ink,
          ),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Center(child: CoinBadge(count: coinBalance, size: 24)),
          ),
        ],
      ),
      body: LessonMapContent(
        initialGrade: _selectedGrade,
      ),
    );
  }
}

class LessonMapContent extends ConsumerStatefulWidget {
  final int? initialGrade;

  const LessonMapContent({super.key, this.initialGrade});

  @override
  ConsumerState<LessonMapContent> createState() => _LessonMapContentState();
}

class _LessonMapContentState extends ConsumerState<LessonMapContent> with TickerProviderStateMixin {
  late int _selectedGrade;
  late AnimationController _animController;
  late AnimationController _pulseController;
  late AnimationController _confettiController;

  bool _isLoading = false;
  List<Map<String, dynamic>> _lessons = [];
  bool _showConfetti = false;

  @override
  void initState() {
    super.initState();
    _selectedGrade = widget.initialGrade ?? 4;

    _animController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 12),
    )..repeat();

    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..repeat(reverse: true);

    _confettiController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2000),
    );

    _loadLessonsForGrade(_selectedGrade);
  }

  @override
  void dispose() {
    _animController.dispose();
    _pulseController.dispose();
    _confettiController.dispose();
    super.dispose();
  }

  Future<void> _loadLessonsForGrade(int grade) async {
    setState(() => _isLoading = true);
    try {
      final res = await ApiClient().dio.get('/lessons', queryParameters: {'grade': grade, 'limit': 50});
      if (res.data['success'] == true) {
        final list = List<Map<String, dynamic>>.from(res.data['data'] ?? []);
        if (mounted) {
          setState(() {
            _lessons = list;
            _isLoading = false;
          });
          return;
        }
      }
    } catch (_) {}

    // Fallback baseline topics if offline
    final fallbackList = List.generate(20, (i) {
      final idx = i + 1;
      final idxStr = idx.toString().padLeft(2, '0');
      return {
        'id': 'lesson-g$grade-$idxStr',
        'title': '$grade-sinf $idx-mavzu',
        'chapterTitle': '$grade-sinf Matematika kursi',
        'grade': grade,
        'orderIndex': idx,
      };
    });

    if (mounted) {
      setState(() {
        _lessons = fallbackList;
        _isLoading = false;
      });
    }
  }

  void _triggerConfetti() {
    setState(() => _showConfetti = true);
    _confettiController.forward(from: 0.0).then((_) {
      if (mounted) setState(() => _showConfetti = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final student = ref.watch(studentProvider).student;
    final completedSet = Set<String>.from(student?.completedLessons ?? []);

    return Stack(
      children: [
        // 1. Live 60fps Animated Background (RepaintBoundary)
        Positioned.fill(
          child: RepaintBoundary(
            child: AnimatedBuilder(
              animation: _animController,
              builder: (context, child) {
                return CustomPaint(
                  painter: LiveMathCityBackgroundPainter(
                    animationProgress: _animController.value,
                    isDark: isDark,
                  ),
                );
              },
            ),
          ),
        ),

        // 2. Main Scrollable Roadmap
        Column(
          children: [
            // Grade Selector Bar (1..11)
            Container(
              padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
              decoration: BoxDecoration(
                color: colors.card.withOpacity(0.92),
                border: Border(bottom: BorderSide(color: colors.border.withOpacity(0.5))),
              ),
              child: SizedBox(
                height: 36,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: 11,
                  separatorBuilder: (_, __) => const SizedBox(width: 8),
                  itemBuilder: (context, idx) {
                    final grade = idx + 1;
                    final isSelected = grade == _selectedGrade;
                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          _selectedGrade = grade;
                        });
                        _loadLessonsForGrade(grade);
                      },
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                        decoration: BoxDecoration(
                          color: isSelected ? colors.primary : colors.card,
                          borderRadius: BorderRadius.circular(999),
                          border: Border.all(
                            color: isSelected ? colors.primary : colors.border,
                            width: 1.2,
                          ),
                          boxShadow: isSelected
                              ? [
                                  BoxShadow(
                                    color: colors.primary.withOpacity(0.3),
                                    blurRadius: 6,
                                    offset: const Offset(0, 2),
                                  ),
                                ]
                              : null,
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          '$grade-sinf',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: isSelected ? FontWeight.w900 : FontWeight.w700,
                            color: isSelected ? Colors.white : colors.ink,
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),

            // Roadmap Path ScrollView
            Expanded(
              child: _isLoading
                  ? Center(child: CircularProgressIndicator(color: colors.primary))
                  : SingleChildScrollView(
                      physics: const BouncingScrollPhysics(),
                      padding: const EdgeInsets.fromLTRB(20, 20, 20, 120),
                      child: _buildRoadmapNodes(colors, completedSet),
                    ),
            ),
          ],
        ),

        // 3. Confetti Celebration Burst (if triggered)
        if (_showConfetti)
          Positioned.fill(
            child: IgnorePointer(
              child: AnimatedBuilder(
                animation: _confettiController,
                builder: (context, child) {
                  return CustomPaint(
                    painter: ConfettiBurstPainter(progress: _confettiController.value),
                  );
                },
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildRoadmapNodes(AppThemeColors colors, Set<String> completedSet) {
    if (_lessons.isEmpty) {
      return Center(
        child: Text(
          'Darslar mavjud emas',
          style: TextStyle(color: colors.muted, fontWeight: FontWeight.bold),
        ),
      );
    }

    // Determine current active node (first incomplete lesson)
    int currentIndex = _lessons.indexWhere((l) => !completedSet.contains(l['id']));
    if (currentIndex == -1) {
      currentIndex = _lessons.length - 1; // All completed
    }

    final screenWidth = MediaQuery.of(context).size.width - 40; // accounted for padding
    const nodeSpacingY = 110.0;
    final totalHeight = (_lessons.length - 1) * nodeSpacingY + 120;

    // Precalculate zig-zag positions: x oscillates smoothly
    final positions = <Offset>[];
    for (int i = 0; i < _lessons.length; i++) {
      // Zig-zag pattern: center -> right -> center -> left -> center...
      final cycle = i % 4;
      double xRatio;
      if (cycle == 0) {
        xRatio = 0.5;
      } else if (cycle == 1) {
        xRatio = 0.76;
      } else if (cycle == 2) {
        xRatio = 0.5;
      } else {
        xRatio = 0.24;
      }

      final x = xRatio * screenWidth;
      final y = i * nodeSpacingY + 40;
      positions.add(Offset(x, y));
    }

    return SizedBox(
      width: double.infinity,
      height: totalHeight,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          // Connecting Spline Path between nodes
          Positioned.fill(
            child: RepaintBoundary(
              child: CustomPaint(
                painter: RoadmapPathPainter(
                  positions: positions,
                  completedCount: currentIndex,
                  primaryColor: colors.primary,
                  borderColor: colors.border,
                ),
              ),
            ),
          ),

          // Render each node at exact coordinates
          ..._lessons.asMap().entries.map((entry) {
            final idx = entry.key;
            final lesson = entry.value;
            final lessonId = lesson['id']?.toString() ?? '';
            final title = (lesson['title'] ?? '').toString();
            final isCompleted = completedSet.contains(lessonId);
            final isCurrent = idx == currentIndex;
            final isLocked = !isCompleted && !isCurrent;
            final pos = positions[idx];

            return Positioned(
              left: pos.dx - 45,
              top: pos.dy - 40,
              width: 90,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Interactive Node Button
                  GestureDetector(
                    onTap: isLocked
                        ? () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Bu dars qulflangan. Oldingi darslarni bajaring!'),
                                duration: Duration(seconds: 2),
                              ),
                            );
                          }
                        : () {
                            if (isCompleted) {
                              _triggerConfetti();
                            }
                            context.push('/kids/lesson/$lessonId');
                          },
                    child: AnimatedBuilder(
                      animation: _pulseController,
                      builder: (context, child) {
                        final scale = isCurrent
                            ? (1.0 + _pulseController.value * 0.08)
                            : 1.0;

                        return Transform.scale(
                          scale: scale,
                          child: Container(
                            width: 68,
                            height: 68,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: isCompleted
                                  ? const LinearGradient(
                                      colors: [Color(0xFF10B981), Color(0xFF059669)],
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                    )
                                  : isCurrent
                                      ? LinearGradient(
                                          colors: [colors.primary, const Color(0xFF4338CA)],
                                          begin: Alignment.topLeft,
                                          end: Alignment.bottomRight,
                                        )
                                      : LinearGradient(
                                          colors: [colors.border, colors.border.withOpacity(0.7)],
                                        ),
                              border: Border.all(
                                color: Colors.white,
                                width: isCurrent ? 3.5 : 2.5,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: (isCurrent
                                          ? colors.primary
                                          : isCompleted
                                              ? const Color(0xFF10B981)
                                              : Colors.black)
                                      .withOpacity(isLocked ? 0.08 : 0.35),
                                  blurRadius: isCurrent ? 14 : 8,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: Center(
                              child: isCompleted
                                  ? const Icon(Icons.check_rounded, color: Colors.white, size: 34)
                                  : isCurrent
                                      ? const Icon(Icons.play_arrow_rounded, color: Colors.white, size: 38)
                                      : const Icon(Icons.lock_rounded, color: Color(0xFF94A3B8), size: 24),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 6),

                  // Title Tag Pill
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: colors.card.withOpacity(0.95),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: isCurrent
                            ? colors.primary
                            : isCompleted
                                ? const Color(0xFF10B981).withOpacity(0.4)
                                : colors.border,
                        width: 1,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.04),
                          blurRadius: 4,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Text(
                      title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: isCurrent ? FontWeight.w900 : FontWeight.w700,
                        color: isCurrent
                            ? colors.primary
                            : isLocked
                                ? colors.muted
                                : colors.ink,
                      ),
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}

/// CustomPainter that draws a smooth continuous Bézier spline connecting all nodes
class RoadmapPathPainter extends CustomPainter {
  final List<Offset> positions;
  final int completedCount;
  final Color primaryColor;
  final Color borderColor;

  RoadmapPathPainter({
    required this.positions,
    required this.completedCount,
    required this.primaryColor,
    required this.borderColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (positions.length < 2) return;

    final completedPaint = Paint()
      ..color = const Color(0xFF10B981)
      ..strokeWidth = 6.0
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    final lockedPaint = Paint()
      ..color = borderColor.withOpacity(0.6)
      ..strokeWidth = 4.0
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    for (int i = 0; i < positions.length - 1; i++) {
      final p1 = positions[i];
      final p2 = positions[i + 1];

      final path = Path();
      path.moveTo(p1.dx, p1.dy);

      final midY = (p1.dy + p2.dy) / 2;
      path.cubicTo(p1.dx, midY, p2.dx, midY, p2.dx, p2.dy);

      final isPast = i < completedCount;
      canvas.drawPath(path, isPast ? completedPaint : lockedPaint);
    }
  }

  @override
  bool shouldRepaint(covariant RoadmapPathPainter oldDelegate) {
    return oldDelegate.positions.length != positions.length ||
        oldDelegate.completedCount != completedCount;
  }
}

/// 60fps high-performance background painter: floating clouds, sunshine rays, flying birds & butterflies, mini isometric houses
class LiveMathCityBackgroundPainter extends CustomPainter {
  final double animationProgress;
  final bool isDark;

  LiveMathCityBackgroundPainter({
    required this.animationProgress,
    required this.isDark,
  });

  @override
  void paint(Canvas canvas, Size size) {
    // 1. Warm Sun / Moon in upper corner
    final sunCenter = Offset(size.width * 0.85, 80);
    final sunRadius = 36.0;

    final sunPaint = Paint()
      ..color = isDark ? const Color(0xFF38BDF8).withOpacity(0.18) : const Color(0xFFFDE047).withOpacity(0.35)
      ..style = PaintingStyle.fill;
    canvas.drawCircle(sunCenter, sunRadius, sunPaint);

    final sunCorePaint = Paint()
      ..color = isDark ? const Color(0xFF67E8F9) : const Color(0xFFFACC15)
      ..style = PaintingStyle.fill;
    canvas.drawCircle(sunCenter, sunRadius * 0.65, sunCorePaint);

    // 2. Animated Floating Clouds moving horizontally
    _drawCloud(canvas, (size.width * 0.15 + animationProgress * size.width) % (size.width + 100) - 50, 60, 40, isDark);
    _drawCloud(canvas, (size.width * 0.60 + animationProgress * size.width * 0.8) % (size.width + 120) - 60, 140, 50, isDark);
    _drawCloud(canvas, (size.width * 0.35 + animationProgress * size.width * 0.6) % (size.width + 90) - 45, 260, 35, isDark);

    // 3. Animated Flying Birds
    final birdX1 = (animationProgress * (size.width + 80)) - 40;
    final birdY1 = 110 + math.sin(animationProgress * math.pi * 4) * 12;
    _drawBird(canvas, birdX1, birdY1, isDark);

    final birdX2 = ((animationProgress + 0.5) * (size.width + 80)) % (size.width + 80) - 40;
    final birdY2 = 180 + math.cos(animationProgress * math.pi * 3) * 10;
    _drawBird(canvas, birdX2, birdY2, isDark);

    // 4. Animated Fluttering Butterfly
    final butterflyX = size.width * 0.2 + math.sin(animationProgress * math.pi * 6) * 40;
    final butterflyY = size.height * 0.45 + math.cos(animationProgress * math.pi * 4) * 25;
    _drawButterfly(canvas, butterflyX, butterflyY, animationProgress);

    // 5. Mini City Buildings & Trees in background
    _drawMiniBuilding(canvas, 20, size.height * 0.35, 36, 50, const Color(0xFF818CF8).withOpacity(0.2));
    _drawMiniBuilding(canvas, size.width - 60, size.height * 0.60, 42, 60, const Color(0xFF34D399).withOpacity(0.2));
    _drawMiniBuilding(canvas, 15, size.height * 0.80, 40, 55, const Color(0xFFF472B6).withOpacity(0.2));

    // 6. Cute Little Animated Cat
    final catX = size.width - 50;
    final catY = size.height * 0.42;
    _drawCuteCat(canvas, catX, catY, animationProgress, isDark);
  }

  void _drawCloud(Canvas canvas, double x, double y, double width, bool isDark) {
    final cloudPaint = Paint()
      ..color = isDark ? Colors.white.withOpacity(0.04) : Colors.white.withOpacity(0.55)
      ..style = PaintingStyle.fill;

    final r = width * 0.35;
    canvas.drawCircle(Offset(x, y), r, cloudPaint);
    canvas.drawCircle(Offset(x + r * 0.8, y - r * 0.2), r * 0.9, cloudPaint);
    canvas.drawCircle(Offset(x + r * 1.6, y), r * 0.8, cloudPaint);
  }

  void _drawBird(Canvas canvas, double x, double y, bool isDark) {
    final birdPaint = Paint()
      ..color = isDark ? Colors.white38 : const Color(0xFF475569).withOpacity(0.4)
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke;

    final path = Path();
    path.moveTo(x - 8, y);
    path.quadraticBezierTo(x - 4, y - 6, x, y);
    path.quadraticBezierTo(x + 4, y - 6, x + 8, y);
    canvas.drawPath(path, birdPaint);
  }

  void _drawButterfly(Canvas canvas, double x, double y, double progress) {
    final wingFlap = math.sin(progress * math.pi * 14).abs() * 6 + 2;
    final wingPaint = Paint()
      ..color = const Color(0xFFF43F5E).withOpacity(0.6)
      ..style = PaintingStyle.fill;

    // Left and right wings
    canvas.drawOval(Rect.fromCenter(center: Offset(x - 4, y), width: wingFlap, height: 10), wingPaint);
    canvas.drawOval(Rect.fromCenter(center: Offset(x + 4, y), width: wingFlap, height: 10), wingPaint);

    // Body
    final bodyPaint = Paint()..color = Colors.black45;
    canvas.drawCircle(Offset(x, y), 1.5, bodyPaint);
  }

  void _drawMiniBuilding(Canvas canvas, double x, double y, double width, double height, Color color) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    final rrect = RRect.fromRectAndRadius(
      Rect.fromLTWH(x, y, width, height),
      const Radius.circular(8),
    );
    canvas.drawRRect(rrect, paint);
  }

  void _drawCuteCat(Canvas canvas, double x, double y, double progress, bool isDark) {
    final bodyPaint = Paint()
      ..color = isDark ? const Color(0xFF94A3B8).withOpacity(0.4) : const Color(0xFFF97316).withOpacity(0.5)
      ..style = PaintingStyle.fill;

    // Cat Body
    canvas.drawOval(Rect.fromCenter(center: Offset(x, y), width: 20, height: 16), bodyPaint);
    // Cat Head
    canvas.drawCircle(Offset(x, y - 10), 8, bodyPaint);
    // Cat Ears
    final earPath = Path();
    earPath.moveTo(x - 6, y - 14);
    earPath.lineTo(x - 3, y - 20);
    earPath.lineTo(x, y - 15);
    earPath.lineTo(x + 3, y - 20);
    earPath.lineTo(x + 6, y - 14);
    canvas.drawPath(earPath, bodyPaint);

    // Waving Tail
    final tailWiggle = math.sin(progress * math.pi * 8) * 4;
    final tailPaint = Paint()
      ..color = bodyPaint.color
      ..strokeWidth = 2.5
      ..style = PaintingStyle.stroke;
    final tailPath = Path();
    tailPath.moveTo(x + 8, y + 4);
    tailPath.quadraticBezierTo(x + 14 + tailWiggle, y - 2, x + 16, y - 8);
    canvas.drawPath(tailPath, tailPaint);
  }

  @override
  bool shouldRepaint(covariant LiveMathCityBackgroundPainter oldDelegate) {
    return oldDelegate.animationProgress != animationProgress ||
        oldDelegate.isDark != isDark;
  }
}

/// Celebratory colorful confetti burst painter
class ConfettiBurstPainter extends CustomPainter {
  final double progress;

  ConfettiBurstPainter({required this.progress});

  final List<Color> _colors = const [
    Color(0xFFFFD66B),
    Color(0xFF6C47FF),
    Color(0xFF10B981),
    Color(0xFFEF4444),
    Color(0xFF3B82F6),
    Color(0xFFEC4899),
  ];

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height * 0.45);
    final particleCount = 40;

    for (int i = 0; i < particleCount; i++) {
      final angle = (i * 2 * math.pi / particleCount) + (i % 3);
      final distance = progress * (120 + (i % 5) * 25);
      final x = center.dx + math.cos(angle) * distance;
      final y = center.dy + math.sin(angle) * distance + (progress * progress * 80);

      final paint = Paint()
        ..color = _colors[i % _colors.length].withOpacity((1.0 - progress).clamp(0.0, 1.0))
        ..style = PaintingStyle.fill;

      canvas.drawCircle(Offset(x, y), 3.5, paint);
    }
  }

  @override
  bool shouldRepaint(covariant ConfettiBurstPainter oldDelegate) {
    return oldDelegate.progress != progress;
  }
}
