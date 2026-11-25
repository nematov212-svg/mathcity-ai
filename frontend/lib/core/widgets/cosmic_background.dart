import 'dart:io' show Platform;
import 'dart:math' as math;
import 'dart:ui' as ui;
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

/// Common, performant Cosmic Starry & Subtle Floating Coins Background
///
/// Features:
/// - Deep indigo to cosmic purple vertical gradient
/// - Soft floating aurora radial patches (Lissajous drift)
/// - 18 twinkling stars (sparkles and dots, varying twinkle speed and phase)
/// - 8 subtle floating gold coins drifting downward with gentle 3D horizontal flip
/// - Single AnimationController + CustomPainter wrapped in RepaintBoundary & IgnorePointer
/// - Pauses automatically when tab/screen is backgrounded or in test environment
/// - Content is 100% legible (effects rendered with low subtle opacity)
class CosmicBackground extends StatefulWidget {
  final Widget? child;
  final bool hasContent;

  const CosmicBackground({
    super.key,
    this.child,
    this.hasContent = true,
  });

  @override
  State<CosmicBackground> createState() => _CosmicBackgroundState();
}

class _CosmicBackgroundState extends State<CosmicBackground>
    with SingleTickerProviderStateMixin, WidgetsBindingObserver {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 16),
    );
    if (!kIsWeb && Platform.environment.containsKey('FLUTTER_TEST')) {
      _controller.value = 0.5;
    } else {
      _controller.repeat();
    }
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      if (!_controller.isAnimating &&
          !(kDebugMode && !kIsWeb && Platform.environment.containsKey('FLUTTER_TEST'))) {
        _controller.repeat();
      }
    } else {
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
    final disableAnim = MediaQuery.of(context).disableAnimations;

    final backgroundLayer = Positioned.fill(
      child: IgnorePointer(
        child: RepaintBoundary(
          child: AnimatedBuilder(
            animation: _controller,
            builder: (context, _) {
              return CustomPaint(
                painter: _CosmicPainter(
                  progress: disableAnim ? 0.0 : _controller.value,
                  hasContent: widget.hasContent,
                ),
              );
            },
          ),
        ),
      ),
    );

    if (widget.child == null) {
      return Stack(
        fit: StackFit.expand,
        children: [backgroundLayer],
      );
    }

    return Stack(
      fit: StackFit.expand,
      children: [
        backgroundLayer,
        widget.child!,
      ],
    );
  }
}

class _CosmicPainterStar {
  final double x;
  final double y;
  final double size;
  final double twinkleSpeed;
  final double phase;
  final bool isSparkle;
  final bool isGold;

  const _CosmicPainterStar({
    required this.x,
    required this.y,
    required this.size,
    required this.twinkleSpeed,
    required this.phase,
    required this.isSparkle,
    required this.isGold,
  });
}

class _CosmicPainterCoin {
  final double x;
  final double initialY;
  final double speed;
  final double size;
  final double flipSpeed;
  final double phase;
  final double opacity;

  const _CosmicPainterCoin({
    required this.x,
    required this.initialY,
    required this.speed,
    required this.size,
    required this.flipSpeed,
    required this.phase,
    required this.opacity,
  });
}

class _CosmicPainter extends CustomPainter {
  final double progress;
  final bool hasContent;

  const _CosmicPainter({
    required this.progress,
    required this.hasContent,
  });

  static const List<_CosmicPainterStar> _stars = [
    _CosmicPainterStar(x: 0.10, y: 0.07, size: 3.2, twinkleSpeed: 2.2, phase: 0.0, isSparkle: true, isGold: true),
    _CosmicPainterStar(x: 0.88, y: 0.11, size: 3.8, twinkleSpeed: 1.8, phase: 1.2, isSparkle: true, isGold: false),
    _CosmicPainterStar(x: 0.25, y: 0.18, size: 1.9, twinkleSpeed: 3.1, phase: 2.4, isSparkle: false, isGold: false),
    _CosmicPainterStar(x: 0.75, y: 0.22, size: 3.5, twinkleSpeed: 2.5, phase: 0.7, isSparkle: true, isGold: true),
    _CosmicPainterStar(x: 0.05, y: 0.35, size: 2.0, twinkleSpeed: 1.9, phase: 3.1, isSparkle: false, isGold: true),
    _CosmicPainterStar(x: 0.93, y: 0.38, size: 2.8, twinkleSpeed: 2.8, phase: 1.9, isSparkle: true, isGold: false),
    _CosmicPainterStar(x: 0.42, y: 0.14, size: 1.8, twinkleSpeed: 3.4, phase: 0.3, isSparkle: false, isGold: false),
    _CosmicPainterStar(x: 0.65, y: 0.42, size: 2.2, twinkleSpeed: 2.1, phase: 2.8, isSparkle: false, isGold: true),
    _CosmicPainterStar(x: 0.16, y: 0.52, size: 3.6, twinkleSpeed: 1.7, phase: 1.5, isSparkle: true, isGold: false),
    _CosmicPainterStar(x: 0.82, y: 0.55, size: 2.0, twinkleSpeed: 3.2, phase: 0.9, isSparkle: false, isGold: false),
    _CosmicPainterStar(x: 0.32, y: 0.62, size: 3.2, twinkleSpeed: 2.6, phase: 2.1, isSparkle: true, isGold: true),
    _CosmicPainterStar(x: 0.91, y: 0.67, size: 2.0, twinkleSpeed: 1.6, phase: 3.5, isSparkle: false, isGold: false),
    _CosmicPainterStar(x: 0.09, y: 0.72, size: 3.4, twinkleSpeed: 2.3, phase: 0.4, isSparkle: true, isGold: true),
    _CosmicPainterStar(x: 0.55, y: 0.74, size: 1.9, twinkleSpeed: 3.0, phase: 1.8, isSparkle: false, isGold: false),
    _CosmicPainterStar(x: 0.28, y: 0.82, size: 2.4, twinkleSpeed: 2.4, phase: 2.9, isSparkle: false, isGold: true),
    _CosmicPainterStar(x: 0.80, y: 0.86, size: 3.6, twinkleSpeed: 1.9, phase: 0.6, isSparkle: true, isGold: false),
    _CosmicPainterStar(x: 0.46, y: 0.92, size: 2.0, twinkleSpeed: 3.3, phase: 1.3, isSparkle: false, isGold: false),
    _CosmicPainterStar(x: 0.70, y: 0.94, size: 3.0, twinkleSpeed: 2.0, phase: 2.6, isSparkle: true, isGold: true),
  ];

  static const List<_CosmicPainterCoin> _coins = [
    _CosmicPainterCoin(x: 0.08, initialY: 0.06, speed: 0.18, size: 20.0, flipSpeed: 1.4, phase: 0.3, opacity: 0.50),
    _CosmicPainterCoin(x: 0.88, initialY: 0.16, speed: 0.15, size: 24.0, flipSpeed: 1.8, phase: 1.7, opacity: 0.55),
    _CosmicPainterCoin(x: 0.20, initialY: 0.32, speed: 0.20, size: 16.0, flipSpeed: 2.1, phase: 2.8, opacity: 0.40),
    _CosmicPainterCoin(x: 0.78, initialY: 0.45, speed: 0.17, size: 22.0, flipSpeed: 1.6, phase: 0.9, opacity: 0.50),
    _CosmicPainterCoin(x: 0.12, initialY: 0.58, speed: 0.21, size: 18.0, flipSpeed: 1.9, phase: 3.2, opacity: 0.42),
    _CosmicPainterCoin(x: 0.85, initialY: 0.68, speed: 0.16, size: 24.0, flipSpeed: 1.3, phase: 1.4, opacity: 0.55),
    _CosmicPainterCoin(x: 0.32, initialY: 0.80, speed: 0.19, size: 19.0, flipSpeed: 2.0, phase: 2.2, opacity: 0.45),
    _CosmicPainterCoin(x: 0.68, initialY: 0.88, speed: 0.18, size: 18.0, flipSpeed: 1.7, phase: 0.5, opacity: 0.40),
  ];

  @override
  void paint(Canvas canvas, Size size) {
    final globalAlpha = hasContent ? 0.35 : 0.80;

    // 1. Deep Celestial Gradient
    final bgRect = Offset.zero & size;
    final bgPaint = Paint()
      ..shader = ui.Gradient.linear(
        Offset.zero,
        Offset(0, size.height),
        const [
          Color(0xFF0F0A2A), // Deep indigo night sky
          Color(0xFF1E104A), // Rich royal violet
          Color(0xFF14194A), // Midnight cosmic blue
          Color(0xFF090D24), // Deep space footer
        ],
        const [0.0, 0.40, 0.75, 1.0],
      );
    canvas.drawRect(bgRect, bgPaint);

    // 2. Soft Aurora Glows
    final aurora1Center = Offset(
      size.width * (0.35 + 0.15 * math.sin(progress * 2 * math.pi * 0.5)),
      size.height * (0.22 + 0.08 * math.cos(progress * 2 * math.pi * 0.7)),
    );
    final aurora1Paint = Paint()
      ..shader = ui.Gradient.radial(
        aurora1Center,
        size.width * 0.55,
        const [
          Color(0x287C3AED), // bright violet
          Color(0x103B82F6), // soft electric blue
          Colors.transparent,
        ],
        const [0.0, 0.5, 1.0],
      );
    canvas.drawCircle(aurora1Center, size.width * 0.55, aurora1Paint);

    final aurora2Center = Offset(
      size.width * (0.72 + 0.12 * math.cos(progress * 2 * math.pi * 0.6)),
      size.height * (0.68 + 0.10 * math.sin(progress * 2 * math.pi * 0.4)),
    );
    final aurora2Paint = Paint()
      ..shader = ui.Gradient.radial(
        aurora2Center,
        size.width * 0.50,
        const [
          Color(0x200284C7), // electric cyan
          Color(0x106D28D9), // purple
          Colors.transparent,
        ],
        const [0.0, 0.5, 1.0],
      );
    canvas.drawCircle(aurora2Center, size.width * 0.50, aurora2Paint);

    // 3. 18 Twinkling Stars
    for (final star in _stars) {
      final sx = star.x * size.width;
      final sy = star.y * size.height;
      final wave = math.sin((progress * 2 * math.pi * star.twinkleSpeed) + star.phase).abs();
      final alpha = (0.25 + 0.75 * wave).clamp(0.0, 1.0) * globalAlpha;

      final color = star.isGold
          ? Color.fromRGBO(251, 191, 36, alpha)
          : Color.fromRGBO(255, 255, 255, alpha);

      final starPaint = Paint()..color = color;

      if (star.isSparkle) {
        _drawSparkle(canvas, Offset(sx, sy), star.size * (0.85 + 0.3 * wave), starPaint);
      } else {
        canvas.drawCircle(Offset(sx, sy), (star.size / 2) * (0.8 + 0.3 * wave), starPaint);
      }
    }

    // 4. Subtle Floating Coins
    for (final coin in _coins) {
      final coinX = coin.x * size.width;
      final coinY = ((coin.initialY + progress * coin.speed * 4) % 1.0) * size.height;

      final flip = math.cos((progress * 2 * math.pi * coin.flipSpeed) + coin.phase);
      final widthFactor = flip.abs().clamp(0.08, 1.0);
      final isBack = flip < 0;

      canvas.save();
      canvas.translate(coinX, coinY);
      canvas.rotate(0.10 * math.sin(progress * 2 * math.pi + coin.phase));

      final r = coin.size / 2;
      final w = r * widthFactor;
      final h = r;

      final rimRect = Rect.fromCenter(center: Offset.zero, width: w * 2, height: h * 2);
      final coinPaint = Paint()
        ..shader = ui.Gradient.linear(
          Offset(-w, -h),
          Offset(w, h),
          isBack
              ? const [Color(0xFFD97706), Color(0xFFFBBF24), Color(0xFF92400E)]
              : const [Color(0xFFFFFBEB), Color(0xFFFBBF24), Color(0xFFD97706)],
          const [0.0, 0.5, 1.0],
        )
        ..color = Colors.white.withOpacity(coin.opacity * globalAlpha);

      canvas.drawOval(rimRect, coinPaint);

      if (w > 5) {
        final innerRect = Rect.fromCenter(center: Offset.zero, width: (w - 2.0) * 2, height: (h - 2.0) * 2);
        final innerPaint = Paint()
          ..shader = ui.Gradient.linear(
            Offset(-w, -h),
            Offset(w, h),
            const [Color(0xFFF59E0B), Color(0xFFB45309)],
          )
          ..color = Colors.white.withOpacity(coin.opacity * globalAlpha);
        canvas.drawOval(innerRect, innerPaint);
      }

      canvas.restore();
    }
  }

  void _drawSparkle(Canvas canvas, Offset center, double size, Paint paint) {
    final path = Path();
    final half = size / 2;
    path.moveTo(center.dx, center.dy - half);
    path.quadraticBezierTo(center.dx, center.dy, center.dx + half, center.dy);
    path.quadraticBezierTo(center.dx, center.dy, center.dx, center.dy + half);
    path.quadraticBezierTo(center.dx, center.dy, center.dx - half, center.dy);
    path.quadraticBezierTo(center.dx, center.dy, center.dx, center.dy - half);
    path.close();
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant _CosmicPainter oldDelegate) {
    return oldDelegate.progress != progress || oldDelegate.hasContent != hasContent;
  }
}
