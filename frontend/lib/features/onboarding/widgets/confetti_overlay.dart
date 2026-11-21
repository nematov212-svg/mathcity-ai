import 'dart:math' as math;
import 'package:flutter/material.dart';

class ConfettiParticle {
  double x;
  double y;
  double vx;
  double vy;
  double size;
  Color color;
  double rotation;
  double vRotation;

  ConfettiParticle({
    required this.x,
    required this.y,
    required this.vx,
    required this.vy,
    required this.size,
    required this.color,
    required this.rotation,
    required this.vRotation,
  });
}

class ConfettiOverlay extends StatefulWidget {
  final Widget child;
  final bool isTriggered;

  const ConfettiOverlay({
    super.key,
    required this.child,
    this.isTriggered = false,
  });

  @override
  State<ConfettiOverlay> createState() => _ConfettiOverlayState();
}

class _ConfettiOverlayState extends State<ConfettiOverlay> with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  final List<ConfettiParticle> _particles = [];
  final math.Random _rnd = math.Random();

  final List<Color> _colors = const [
    Color(0xFF6C55E0),
    Color(0xFFFF7A9C),
    Color(0xFFFFB938),
    Color(0xFF22C55E),
    Color(0xFF8D74FF),
    Color(0xFF38BDF8),
  ];

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1600),
    )..addListener(_updateParticles);

    if (widget.isTriggered) {
      _startBurst();
    }
  }

  @override
  void didUpdateWidget(covariant ConfettiOverlay oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.isTriggered && !oldWidget.isTriggered) {
      _startBurst();
    }
  }

  void _startBurst() {
    _particles.clear();
    for (int i = 0; i < 48; i++) {
      final angle = _rnd.nextDouble() * math.pi * 2;
      final speed = 3.0 + _rnd.nextDouble() * 9.0;
      _particles.add(
        ConfettiParticle(
          x: 0.5,
          y: 0.35,
          vx: math.cos(angle) * speed * 0.003,
          vy: math.sin(angle) * speed * 0.003 - 0.004,
          size: 6.0 + _rnd.nextDouble() * 7.0,
          color: _colors[_rnd.nextInt(_colors.length)],
          rotation: _rnd.nextDouble() * math.pi,
          vRotation: (_rnd.nextDouble() - 0.5) * 0.15,
        ),
      );
    }
    _ctrl.forward(from: 0.0);
  }

  void _updateParticles() {
    for (final p in _particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.00025; // gravity
      p.rotation += p.vRotation;
    }
    setState(() {});
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        widget.child,
        if (_ctrl.isAnimating)
          Positioned.fill(
            child: IgnorePointer(
              child: CustomPaint(
                painter: _ConfettiPainter(
                  particles: _particles,
                  progress: _ctrl.value,
                ),
              ),
            ),
          ),
      ],
    );
  }
}

class _ConfettiPainter extends CustomPainter {
  final List<ConfettiParticle> particles;
  final double progress;

  _ConfettiPainter({required this.particles, required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    final opacity = (1.0 - progress).clamp(0.0, 1.0);

    for (final p in particles) {
      final px = p.x * size.width;
      final py = p.y * size.height;

      final paint = Paint()..color = p.color.withOpacity(opacity);

      canvas.save();
      canvas.translate(px, py);
      canvas.rotate(p.rotation);
      canvas.drawRRect(
        RRect.fromRectAndRadius(
          Rect.fromCenter(center: Offset.zero, width: p.size, height: p.size * 0.65),
          const Radius.circular(2),
        ),
        paint,
      );
      canvas.restore();
    }
  }

  @override
  bool shouldRepaint(covariant _ConfettiPainter oldDelegate) => true;
}
