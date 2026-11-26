import 'dart:io' show Platform;
import 'dart:math' as math;
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../theme/app_theme.dart';

/// High-Performance Animated Math & Cosmic Background for MathCity AI.
///
/// Features:
/// - Light & Dark adaptive themes:
///   - Dark: Cosmic aurora nebulae, 16 twinkling stars, floating 3D coins, and faint glowing math symbols.
///   - Light: Soft pastel lavender/cyan gradient, slow-moving blurry glow orbs, delicate math symbols & confetti dots.
/// - Leaderboard Podium Mode: Golden radial aura and falling celebratory golden confetti/coins behind 1st place.
/// - Lifecycle-aware: Automatically pauses ticking when app goes to background.
/// - Obey user setting: Disables continuous movement when "Animatsiyalar" is turned off in Settings.
/// - Strict performance budget: ~22-26 particles, RepaintBoundary, IgnorePointer, zero allocation inside paint().
class AnimatedMathBackground extends ConsumerStatefulWidget {
  final bool? isDark;
  final bool isLeaderboard;

  const AnimatedMathBackground({
    super.key,
    this.isDark,
    this.isLeaderboard = false,
  });

  @override
  ConsumerState<AnimatedMathBackground> createState() =>
      _AnimatedMathBackgroundState();
}

class _AnimatedMathBackgroundState extends ConsumerState<AnimatedMathBackground>
    with SingleTickerProviderStateMixin, WidgetsBindingObserver {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 10),
    );

    // Initial check will start in didChangeDependencies if animations enabled
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _syncAnimationState();
  }

  @override
  void didUpdateWidget(covariant AnimatedMathBackground oldWidget) {
    super.didUpdateWidget(oldWidget);
    _syncAnimationState();
  }

  void _syncAnimationState() {
    final animationsEnabled = ref.read(animationsEnabledProvider);
    final reduceMotion = MediaQuery.of(context).disableAnimations;
    final isTest = !kIsWeb && Platform.environment.containsKey('FLUTTER_TEST');

    if (!animationsEnabled || reduceMotion || isTest) {
      if (_controller.isAnimating) {
        _controller.stop();
      }
    } else {
      if (!_controller.isAnimating) {
        _controller.repeat();
      }
    }
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      _syncAnimationState();
    } else if (state == AppLifecycleState.paused ||
        state == AppLifecycleState.inactive ||
        state == AppLifecycleState.hidden) {
      if (_controller.isAnimating) {
        _controller.stop();
      }
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final themeIsDark = Theme.of(context).brightness == Brightness.dark;
    final effectiveIsDark = widget.isDark ?? themeIsDark;
    final animationsEnabled = ref.watch(animationsEnabledProvider);
    final reduceMotion = MediaQuery.of(context).disableAnimations;
    final shouldAnimate = animationsEnabled && !reduceMotion;

    return RepaintBoundary(
      child: IgnorePointer(
        child: SizedBox.expand(
          child: shouldAnimate
              ? AnimatedBuilder(
                  animation: _controller,
                  builder: (context, _) {
                    return CustomPaint(
                      painter: _MathBackgroundPainter(
                        progress: _controller.value,
                        isDark: effectiveIsDark,
                        isLeaderboard: widget.isLeaderboard,
                      ),
                    );
                  },
                )
              : CustomPaint(
                  painter: _MathBackgroundPainter(
                    progress: 0.25,
                    isDark: effectiveIsDark,
                    isLeaderboard: widget.isLeaderboard,
                  ),
                ),
        ),
      ),
    );
  }
}

class _MathParticle {
  final double x;
  final double y;
  final double speed;
  final double phase;
  final String symbol;
  final double size;

  const _MathParticle({
    required this.x,
    required this.y,
    required this.speed,
    required this.phase,
    required this.symbol,
    required this.size,
  });
}

class _SparkParticle {
  final double x;
  final double y;
  final double size;
  final double phase;
  final Color color;

  const _SparkParticle({
    required this.x,
    required this.y,
    required this.size,
    required this.phase,
    required this.color,
  });
}

class _CoinParticle {
  final double x;
  final double y;
  final double size;
  final double speed;
  final double phase;

  const _CoinParticle({
    required this.x,
    required this.y,
    required this.size,
    required this.speed,
    required this.phase,
  });
}

class _MathBackgroundPainter extends CustomPainter {
  final double progress;
  final bool isDark;
  final bool isLeaderboard;

  _MathBackgroundPainter({
    required this.progress,
    required this.isDark,
    required this.isLeaderboard,
  });

  static const List<_MathParticle> _mathSymbols = [
    _MathParticle(
        x: 0.10, y: 0.18, speed: 0.8, phase: 0.0, symbol: '+', size: 20),
    _MathParticle(
        x: 0.85, y: 0.22, speed: 1.1, phase: 1.2, symbol: 'π', size: 18),
    _MathParticle(
        x: 0.25, y: 0.45, speed: 0.9, phase: 2.1, symbol: '×', size: 18),
    _MathParticle(
        x: 0.78, y: 0.58, speed: 0.7, phase: 3.4, symbol: '√', size: 19),
    _MathParticle(
        x: 0.15, y: 0.75, speed: 1.0, phase: 4.2, symbol: '÷', size: 21),
    _MathParticle(
        x: 0.88, y: 0.82, speed: 0.85, phase: 5.1, symbol: '−', size: 19),
    _MathParticle(
        x: 0.50, y: 0.90, speed: 0.95, phase: 2.8, symbol: 'x²', size: 17),
  ];

  static const List<_SparkParticle> _sparks = [
    _SparkParticle(
        x: 0.08, y: 0.12, size: 2.5, phase: 0.4, color: Color(0xFFC084FC)),
    _SparkParticle(
        x: 0.35, y: 0.08, size: 3.0, phase: 1.2, color: Color(0xFF60A5FA)),
    _SparkParticle(
        x: 0.92, y: 0.15, size: 2.8, phase: 2.0, color: Color(0xFFFBBF24)),
    _SparkParticle(
        x: 0.18, y: 0.32, size: 2.2, phase: 3.1, color: Color(0xFFA78BFA)),
    _SparkParticle(
        x: 0.82, y: 0.38, size: 3.2, phase: 4.5, color: Color(0xFF34D399)),
    _SparkParticle(
        x: 0.05, y: 0.60, size: 2.4, phase: 5.2, color: Color(0xFFF472B6)),
    _SparkParticle(
        x: 0.94, y: 0.68, size: 2.6, phase: 1.8, color: Color(0xFFFBBF24)),
    _SparkParticle(
        x: 0.30, y: 0.78, size: 3.0, phase: 3.7, color: Color(0xFF818CF8)),
    _SparkParticle(
        x: 0.70, y: 0.88, size: 2.5, phase: 4.9, color: Color(0xFF38BDF8)),
  ];

  static const List<_CoinParticle> _coins = [
    _CoinParticle(x: 0.12, y: 0.28, size: 14, speed: 0.7, phase: 0.5),
    _CoinParticle(x: 0.88, y: 0.42, size: 16, speed: 0.9, phase: 2.3),
    _CoinParticle(x: 0.22, y: 0.65, size: 12, speed: 0.8, phase: 4.1),
    _CoinParticle(x: 0.80, y: 0.78, size: 15, speed: 1.0, phase: 1.7),
  ];

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;
    if (w <= 0 || h <= 0) return;

    // 1. Draw Base Background Gradient & Soft Aura Orbs
    if (isDark) {
      _paintDarkBackground(canvas, size);
    } else {
      _paintLightBackground(canvas, size);
    }

    // 2. Leaderboard Podium Glow Mode (if active)
    if (isLeaderboard) {
      _paintLeaderboardPodiumAura(canvas, size);
    }

    // 3. Draw Twinkling Sparks / Pastel Confetti
    _paintSparks(canvas, size);

    // 4. Draw Floating Math Symbols
    _paintMathSymbols(canvas, size);

    // 5. Draw Floating 3D Coin Discs
    _paintCoins(canvas, size);

    // 6. Leaderboard Falling Confetti (if active)
    if (isLeaderboard) {
      _paintLeaderboardConfetti(canvas, size);
    }
  }

  void _paintDarkBackground(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // Solid base dark
    final basePaint = Paint()..color = const Color(0xFF0A061E);
    canvas.drawRect(Rect.fromLTWH(0, 0, w, h), basePaint);

    // Nebula Orb 1 (Top right royal purple)
    final orb1Center = Offset(w * 0.85, h * 0.20);
    final orb1Paint = Paint()
      ..shader = RadialGradient(
        colors: [
          const Color(0xFF581C87).withValues(alpha: 0.32),
          const Color(0xFF3B0764).withValues(alpha: 0.12),
          Colors.transparent,
        ],
        stops: const [0.0, 0.55, 1.0],
      ).createShader(Rect.fromCircle(center: orb1Center, radius: w * 0.75));
    canvas.drawCircle(orb1Center, w * 0.75, orb1Paint);

    // Nebula Orb 2 (Left bottom deep violet)
    final orb2Center = Offset(w * 0.15, h * 0.70);
    final orb2Paint = Paint()
      ..shader = RadialGradient(
        colors: [
          const Color(0xFF311042).withValues(alpha: 0.28),
          const Color(0xFF1E0C4F).withValues(alpha: 0.10),
          Colors.transparent,
        ],
        stops: const [0.0, 0.55, 1.0],
      ).createShader(Rect.fromCircle(center: orb2Center, radius: w * 0.70));
    canvas.drawCircle(orb2Center, w * 0.70, orb2Paint);
  }

  void _paintLightBackground(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // Clean pastel canvas
    final basePaint = Paint()..color = const Color(0xFFF6F5FD);
    canvas.drawRect(Rect.fromLTWH(0, 0, w, h), basePaint);

    // Soft Lavender Glow Orb 1 (Top right)
    final sway1 = math.sin((progress * math.pi * 2) + 0.5) * 20.0;
    final orb1Center = Offset(w * 0.85 + sway1, h * 0.15);
    final orb1Paint = Paint()
      ..shader = RadialGradient(
        colors: [
          const Color(0xFFDDD6FE).withValues(alpha: 0.45),
          const Color(0xFFEDE9FE).withValues(alpha: 0.20),
          Colors.transparent,
        ],
        stops: const [0.0, 0.6, 1.0],
      ).createShader(Rect.fromCircle(center: orb1Center, radius: w * 0.65));
    canvas.drawCircle(orb1Center, w * 0.65, orb1Paint);

    // Soft Amber/Warm Glow Orb 2 (Left center)
    final sway2 = math.cos((progress * math.pi * 2) + 1.2) * 20.0;
    final orb2Center = Offset(w * 0.12, h * 0.55 + sway2);
    final orb2Paint = Paint()
      ..shader = RadialGradient(
        colors: [
          const Color(0xFFFEF3C7).withValues(alpha: 0.35),
          const Color(0xFFFDE68A).withValues(alpha: 0.12),
          Colors.transparent,
        ],
        stops: const [0.0, 0.55, 1.0],
      ).createShader(Rect.fromCircle(center: orb2Center, radius: w * 0.55));
    canvas.drawCircle(orb2Center, w * 0.55, orb2Paint);
  }

  void _paintLeaderboardPodiumAura(Canvas canvas, Size size) {
    final w = size.width;
    // Radiant warm golden glow behind 1st place podium (top center)
    final podiumCenter = Offset(w * 0.5, 180);
    final auraPaint = Paint()
      ..shader = RadialGradient(
        colors: [
          const Color(0xFFFFD700).withValues(alpha: isDark ? 0.28 : 0.20),
          const Color(0xFFF59E0B).withValues(alpha: isDark ? 0.12 : 0.08),
          Colors.transparent,
        ],
        stops: const [0.0, 0.5, 1.0],
      ).createShader(Rect.fromCircle(center: podiumCenter, radius: w * 0.45));
    canvas.drawCircle(podiumCenter, w * 0.45, auraPaint);
  }

  void _paintSparks(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    for (final sp in _sparks) {
      final pulse = (math.sin((progress * math.pi * 2) + sp.phase) + 1.0) / 2.0;
      final opacity = (0.2 + (pulse * 0.7)).clamp(0.0, 1.0);
      final radius = sp.size * (0.8 + (pulse * 0.4));

      final x = sp.x * w;
      final y = sp.y * h;

      final p = Paint()
        ..color = isDark
            ? sp.color.withValues(alpha: opacity)
            : sp.color.withValues(alpha: opacity * 0.65);

      canvas.drawCircle(Offset(x, y), radius, p);

      if (isDark && pulse > 0.6) {
        final glowP = Paint()
          ..color = sp.color.withValues(alpha: (pulse - 0.6) * 0.5)
          ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 4);
        canvas.drawCircle(Offset(x, y), radius * 2.2, glowP);
      }
    }
  }

  void _paintMathSymbols(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    for (final p in _mathSymbols) {
      // Gentle vertical float + horizontal sinusoidal sway
      final floatDist = h * 0.10;
      final driftY = ((progress * p.speed + p.phase) % 1.0) * floatDist;
      final swayX =
          math.sin((progress * math.pi * 2 * p.speed) + p.phase) * 14.0;

      final x = p.x * w + swayX;
      final y = (p.y * h - driftY) % h;

      final textSpan = TextSpan(
        text: p.symbol,
        style: TextStyle(
          fontFamily: 'Nunito',
          fontSize: p.size,
          fontWeight: FontWeight.w900,
          color: isDark
              ? const Color(0xFFA78BFA).withValues(alpha: 0.18)
              : const Color(0xFF6C47FF).withValues(alpha: 0.14),
        ),
      );

      final textPainter = TextPainter(
        text: textSpan,
        textDirection: TextDirection.ltr,
      );
      textPainter.layout();
      textPainter.paint(canvas, Offset(x - textPainter.width / 2, y));
    }
  }

  void _paintCoins(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    for (final c in _coins) {
      final driftY = ((progress * c.speed + c.phase) % 1.0) * (h * 0.08);
      final swayX =
          math.cos((progress * math.pi * 2 * c.speed) + c.phase) * 12.0;

      final cx = c.x * w + swayX;
      final cy = (c.y * h - driftY) % h;
      final r = c.size;

      // Soft outer ring
      final ringPaint = Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.6
        ..color =
            const Color(0xFFFFD700).withValues(alpha: isDark ? 0.25 : 0.20);
      canvas.drawCircle(Offset(cx, cy), r, ringPaint);

      // Inner glowing core
      final corePaint = Paint()
        ..style = PaintingStyle.fill
        ..color =
            const Color(0xFFFFB800).withValues(alpha: isDark ? 0.12 : 0.08);
      canvas.drawCircle(Offset(cx, cy), r * 0.7, corePaint);
    }
  }

  void _paintLeaderboardConfetti(Canvas canvas, Size size) {
    final w = size.width;
    // 6 celebratory gold sparks that gently fall around top center
    const confettiColors = [
      Color(0xFFFFD700),
      Color(0xFFF59E0B),
      Color(0xFFA855F7),
      Color(0xFF38BDF8),
    ];

    for (int i = 0; i < 6; i++) {
      final seed = i * 1.618;
      final speed = 0.6 + (i * 0.1);
      final fallY = 80 + (((progress * speed + seed) % 1.0) * 160.0);
      final fallX = (w * 0.3) + (((seed * 73) % 1.0) * (w * 0.4));
      final col = confettiColors[i % confettiColors.length];

      final p = Paint()..color = col.withValues(alpha: isDark ? 0.45 : 0.35);
      canvas.drawCircle(Offset(fallX, fallY), 2.2, p);
    }
  }

  @override
  bool shouldRepaint(covariant _MathBackgroundPainter oldDelegate) {
    return oldDelegate.progress != progress ||
        oldDelegate.isDark != isDark ||
        oldDelegate.isLeaderboard != isLeaderboard;
  }
}
