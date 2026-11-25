import 'dart:io' show Platform;
import 'dart:math' as math;
import 'dart:ui' as ui;
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

/// Reusable XP Coin Widget matching the MathCity AI flagship 3D neon-purple design.
///
/// Features:
/// - Outer neon-purple/lavender 3D bevel rim
/// - Thin dark inset groove ring
/// - Deep indigo/violet center coin face
/// - Bold, rounded embossed 'XP' typography with gradient fill
/// - Top-left specular glint/highlight
/// - Optional soft violet outer glow
/// - Smooth micro-animations (optional floating, bounce, or sparkle)

class XpCoin extends StatefulWidget {
  final double size;
  final bool showGlow;
  final bool animate;
  final String? tooltip;

  const XpCoin({
    super.key,
    this.size = 24.0,
    this.showGlow = true,
    this.animate = false,
    this.tooltip,
  });

  @override
  State<XpCoin> createState() => _XpCoinState();
}

class _XpCoinState extends State<XpCoin> with SingleTickerProviderStateMixin {
  AnimationController? _animController;
  Animation<double>? _floatAnimation;

  @override
  void initState() {
    super.initState();
    if (widget.animate && !(!kIsWeb && Platform.environment.containsKey('FLUTTER_TEST'))) {
      _animController = AnimationController(
        vsync: this,
        duration: const Duration(milliseconds: 1800),
      )..repeat(reverse: true);
      _floatAnimation = Tween<double>(begin: 0.0, end: -3.0).animate(
        CurvedAnimation(parent: _animController!, curve: Curves.easeInOutSine),
      );
    }
  }

  @override
  void dispose() {
    _animController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final media = MediaQuery.maybeOf(context);
    final disableAnimations = media?.disableAnimations ?? false;

    Widget coin = RepaintBoundary(
      child: CustomPaint(
        size: Size(widget.size, widget.size),
        painter: _XpCoinPainter(showGlow: widget.showGlow),
      ),
    );

    if (widget.tooltip != null) {
      coin = Tooltip(message: widget.tooltip!, child: coin);
    }

    if (!disableAnimations && widget.animate && _floatAnimation != null) {
      return AnimatedBuilder(
        animation: _floatAnimation!,
        builder: (context, child) {
          return Transform.translate(
            offset: Offset(0, _floatAnimation!.value),
            child: child,
          );
        },
        child: coin,
      );
    }

    return coin;
  }
}

class _XpCoinPainter extends CustomPainter {
  final bool showGlow;

  const _XpCoinPainter({required this.showGlow});

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;
    final radius = math.min(w, h) / 2;
    final center = Offset(w / 2, h / 2);

    // 1. Soft Violet Glow
    if (showGlow && radius >= 10) {
      final glowPaint = Paint()
        ..color = const Color(0x668B5CF6)
        ..maskFilter = MaskFilter.blur(BlurStyle.normal, radius * 0.35);
      canvas.drawCircle(center, radius * 0.90, glowPaint);
    }

    // 2. Outer Bevel Rim (Neon purple to lavender 3D metallic gradient)
    final outerRimPaint = Paint()
      ..shader = ui.Gradient.linear(
        Offset(center.dx - radius, center.dy - radius),
        Offset(center.dx + radius, center.dy + radius),
        const [
          Color(0xFFF3E8FF), // Crisp bright highlight
          Color(0xFFC084FC), // Radiant neon purple
          Color(0xFF9333EA), // Deep vibrant violet
          Color(0xFF581C87), // Dark shadow edge
        ],
        const [0.0, 0.35, 0.75, 1.0],
      );
    canvas.drawCircle(center, radius, outerRimPaint);

    // 3. Inner Dark Groove / Bevel Inset
    final grooveRadius = radius * 0.88;
    final groovePaint = Paint()
      ..color = const Color(0xFF0F0529)
      ..style = PaintingStyle.stroke
      ..strokeWidth = math.max(1.0, radius * 0.04);
    canvas.drawCircle(center, grooveRadius, groovePaint);

    // 4. Center Coin Face (Deep Indigo/Violet Celestial Base)
    final faceRadius = radius * 0.84;
    final facePaint = Paint()
      ..shader = ui.Gradient.radial(
        Offset(center.dx - faceRadius * 0.25, center.dy - faceRadius * 0.30),
        faceRadius * 1.3,
        const [
          Color(0xFF3B187B), // Vibrant cosmic purple
          Color(0xFF200C4D), // Deep royal violet
          Color(0xFF0D0424), // Midnight indigo
        ],
        const [0.0, 0.60, 1.0],
      );
    canvas.drawCircle(center, faceRadius, facePaint);

    // 5. Embossed "XP" Typography
    final fontSize = radius * 0.92;
    final textSpan = TextSpan(
      text: 'XP',
      style: TextStyle(
        fontFamily: 'Nunito',
        fontWeight: FontWeight.w900,
        fontSize: fontSize,
        letterSpacing: -radius * 0.06,
        foreground: Paint()
          ..shader = ui.Gradient.linear(
            Offset(center.dx, center.dy - faceRadius * 0.5),
            Offset(center.dx, center.dy + faceRadius * 0.5),
            const [
              Color(0xFFFFFFFF), // Pure white top
              Color(0xFFF3E8FF), // Light lavender
              Color(0xFFD8B4FE), // Vibrant purple bottom
            ],
            const [0.0, 0.45, 1.0],
          ),
        shadows: [
          // Emboss bottom shadow
          Shadow(
            color: const Color(0xFF070214).withOpacity(0.9),
            offset: Offset(radius * 0.05, radius * 0.06),
            blurRadius: radius * 0.06,
          ),
          // Subtle top highlight glow
          Shadow(
            color: const Color(0xFFE9D5FF).withOpacity(0.6),
            offset: Offset(-radius * 0.02, -radius * 0.02),
            blurRadius: radius * 0.04,
          ),
        ],
      ),
    );

    final textPainter = TextPainter(
      text: textSpan,
      textAlign: TextAlign.center,
      textDirection: TextDirection.ltr,
    );
    textPainter.layout();
    final textOffset = Offset(
      center.dx - (textPainter.width / 2),
      center.dy - (textPainter.height / 2),
    );
    textPainter.paint(canvas, textOffset);

    // 6. Top-Left Glossy Highlight Arc
    final glintPath = Path();
    final glintRect = Rect.fromCircle(
      center: Offset(center.dx - radius * 0.22, center.dy - radius * 0.25),
      radius: radius * 0.55,
    );
    glintPath.addOval(glintRect);
    final glintPaint = Paint()
      ..shader = ui.Gradient.linear(
        Offset(center.dx - radius, center.dy - radius),
        Offset(center.dx, center.dy),
        [
          Colors.white.withOpacity(0.35),
          Colors.white.withOpacity(0.0),
        ],
        const [0.0, 1.0],
      );
    canvas.save();
    canvas.clipPath(Path()..addOval(Rect.fromCircle(center: center, radius: faceRadius)));
    canvas.drawPath(glintPath, glintPaint);
    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant _XpCoinPainter oldDelegate) {
    return oldDelegate.showGlow != showGlow;
  }
}

/// Reusable XP Badge Capsule with count-up animation and luminous pulse when XP increases.
class XpBadge extends StatefulWidget {
  final int count;
  final double coinSize;
  final bool animate;
  final VoidCallback? onTap;

  const XpBadge({
    super.key,
    required this.count,
    double? size,
    double coinSize = 24.0,
    this.animate = false,
    this.onTap,
  }) : coinSize = size ?? coinSize;

  @override
  State<XpBadge> createState() => _XpBadgeState();
}

class _XpBadgeState extends State<XpBadge> with SingleTickerProviderStateMixin {
  late int _previousCount;
  late AnimationController _pulseController;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _previousCount = widget.count;
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    );
    _scaleAnimation = TweenSequence<double>([
      TweenSequenceItem(
        tween: Tween<double>(begin: 1.0, end: 1.18).chain(CurveTween(curve: Curves.easeOutBack)),
        weight: 50,
      ),
      TweenSequenceItem(
        tween: Tween<double>(begin: 1.18, end: 1.0).chain(CurveTween(curve: Curves.easeInOutCubic)),
        weight: 50,
      ),
    ]).animate(_pulseController);
  }

  @override
  void didUpdateWidget(covariant XpBadge oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.count != widget.count) {
      _previousCount = oldWidget.count;
      if (!(!kIsWeb && Platform.environment.containsKey('FLUTTER_TEST'))) {
        _pulseController.forward(from: 0.0);
      }
    }
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final media = MediaQuery.maybeOf(context);
    final disableAnim = media?.disableAnimations ?? false;

    Widget badge = Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [
            Color(0x337C3AED), // Soft cosmic purple
            Color(0x224F46E5), // Indigo shade
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(
          color: const Color(0xFFA78BFA).withOpacity(0.55),
          width: 1.2,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF8B5CF6).withOpacity(0.25),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          XpCoin(
            size: widget.coinSize,
            showGlow: true,
            animate: widget.animate,
          ),
          const SizedBox(width: 6),
          if (disableAnim)
            Text(
              '${widget.count} XP',
              style: const TextStyle(
                fontFamily: 'Nunito',
                fontSize: 12,
                fontWeight: FontWeight.w800,
                color: Colors.white,
              ),
            )
          else
            TweenAnimationBuilder<int>(
              tween: IntTween(begin: _previousCount, end: widget.count),
              duration: const Duration(milliseconds: 600),
              curve: Curves.easeOutCubic,
              builder: (context, value, child) {
                return Text(
                  '$value XP',
                  style: const TextStyle(
                    fontFamily: 'Nunito',
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                  ),
                );
              },
            ),
        ],
      ),
    );

    if (widget.onTap != null) {
      badge = GestureDetector(
        onTap: widget.onTap,
        child: badge,
      );
    }

    if (!disableAnim && _pulseController.isAnimating) {
      return ScaleTransition(
        scale: _scaleAnimation,
        child: badge,
      );
    }

    return badge;
  }
}
