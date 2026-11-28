import 'dart:math' as math;
import 'package:flutter/material.dart';

/// Animated Flying Coins Effect where gold coins fly up towards the balance
class FlyingCoinsOverlay extends StatefulWidget {
  final int coinCount;
  final VoidCallback? onComplete;

  const FlyingCoinsOverlay({
    super.key,
    this.coinCount = 10,
    this.onComplete,
  });

  @override
  State<FlyingCoinsOverlay> createState() => _FlyingCoinsOverlayState();
}

class _FlyingCoinsOverlayState extends State<FlyingCoinsOverlay>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  final List<_CoinParticle> _particles = [];
  final math.Random _random = math.Random();

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    );

    // Spawn 10-15 coins
    final count = widget.coinCount.clamp(8, 16);
    for (int i = 0; i < count; i++) {
      _particles.add(
        _CoinParticle(
          startOffset: Offset(
            (_random.nextDouble() - 0.5) * 80,
            (_random.nextDouble() - 0.5) * 40,
          ),
          midOffset: Offset(
            (_random.nextDouble() - 0.5) * 160,
            -100 - _random.nextDouble() * 120,
          ),
          targetOffset: const Offset(80, -280),
          delay: i * 0.05,
          speed: 0.65 + _random.nextDouble() * 0.35,
          scale: 0.8 + _random.nextDouble() * 0.4,
          rotationSpeed: (_random.nextDouble() - 0.5) * 12,
        ),
      );
    }

    _controller.forward().then((_) {
      if (mounted) {
        widget.onComplete?.call();
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, _) {
          return CustomPaint(
            size: Size.infinite,
            painter: _CoinsPainter(
              progress: _controller.value,
              particles: _particles,
            ),
          );
        },
      ),
    );
  }
}

class _CoinParticle {
  final Offset startOffset;
  final Offset midOffset;
  final Offset targetOffset;
  final double delay;
  final double speed;
  final double scale;
  final double rotationSpeed;

  _CoinParticle({
    required this.startOffset,
    required this.midOffset,
    required this.targetOffset,
    required this.delay,
    required this.speed,
    required this.scale,
    required this.rotationSpeed,
  });
}

class _CoinsPainter extends CustomPainter {
  final double progress;
  final List<_CoinParticle> particles;

  _CoinsPainter({required this.progress, required this.particles});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final target = Offset(size.width - 60, 60); // top right coin balance

    for (final p in particles) {
      if (progress < p.delay) continue;
      final localP = ((progress - p.delay) / (1.0 - p.delay)).clamp(0.0, 1.0);
      if (localP >= 1.0) continue;

      // Quadratic bezier curve from center+start to target
      final start = center + p.startOffset;
      final mid = center + p.midOffset;
      final t = Curves.easeInOutCubic.transform(localP);

      final x = (1 - t) * (1 - t) * start.dx + 2 * (1 - t) * t * mid.dx + t * t * target.dx;
      final y = (1 - t) * (1 - t) * start.dy + 2 * (1 - t) * t * mid.dy + t * t * target.dy;

      final currentScale = p.scale * (1.0 - t * 0.4);
      final opacity = (1.0 - t * 0.3).clamp(0.0, 1.0);

      canvas.save();
      canvas.translate(x, y);
      canvas.scale(currentScale);

      // 3D Coin flip effect
      final rotX = math.sin(localP * math.pi * 4 * p.rotationSpeed);
      canvas.scale(rotX.abs().clamp(0.2, 1.0), 1.0);

      // Gold coin outer
      final outerPaint = Paint()
        ..color = const Color(0xFFFFD700).withValues(alpha: opacity)
        ..style = PaintingStyle.fill;
      canvas.drawCircle(Offset.zero, 12, outerPaint);

      // Dark golden border
      final borderPaint = Paint()
        ..color = const Color(0xFFD97706).withValues(alpha: opacity)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2;
      canvas.drawCircle(Offset.zero, 12, borderPaint);

      // Inner star/circle
      final innerPaint = Paint()
        ..color = const Color(0xFFFBBF24).withValues(alpha: opacity)
        ..style = PaintingStyle.fill;
      canvas.drawCircle(Offset.zero, 7, innerPaint);

      canvas.restore();
    }
  }

  @override
  bool shouldRepaint(covariant _CoinsPainter oldDelegate) =>
      oldDelegate.progress != progress;
}
