import 'dart:async';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../../theme/onboarding_theme.dart';

enum MascotMood {
  normal, // Step 1: Username
  partyHat, // Step 2: Birth date
  celebrate, // Step 3: Finish
}

/// A lively, breathing, blinking robot mascot "Ustoz AI"
class MascotView extends StatefulWidget {
  final MascotMood mood;
  final double size;

  const MascotView({
    super.key,
    this.mood = MascotMood.normal,
    this.size = 110,
  });

  @override
  State<MascotView> createState() => _MascotViewState();
}

class _MascotViewState extends State<MascotView> with TickerProviderStateMixin {
  late final AnimationController _breatheCtrl;
  late final Animation<double> _breatheAnimation;

  late final AnimationController _blinkCtrl;
  late final Animation<double> _blinkAnimation;
  Timer? _blinkTimer;

  late final AnimationController _jumpCtrl;
  late final Animation<double> _jumpAnimation;

  bool get _isTesting =>
      WidgetsBinding.instance.runtimeType.toString().contains('Test');

  @override
  void initState() {
    super.initState();

    // Breathing float animation (2.4s up and down 4px)
    _breatheCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2400),
    );
    _breatheAnimation = Tween<double>(begin: -3.0, end: 3.0).animate(
      CurvedAnimation(parent: _breatheCtrl, curve: Curves.easeInOut),
    );

    // Blinking animation
    _blinkCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 160),
    );
    _blinkAnimation = Tween<double>(begin: 1.0, end: 0.1).animate(
      CurvedAnimation(parent: _blinkCtrl, curve: Curves.easeInOut),
    );

    // Jump animation for celebration
    _jumpCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );
    _jumpAnimation = TweenSequence<double>([
      TweenSequenceItem(
          tween: Tween(begin: 0.0, end: -14.0)
              .chain(CurveTween(curve: Curves.easeOut)),
          weight: 45),
      TweenSequenceItem(
          tween: Tween(begin: -14.0, end: 0.0)
              .chain(CurveTween(curve: Curves.bounceOut)),
          weight: 55),
    ]).animate(_jumpCtrl);

    if (!_isTesting) {
      _startBreathe();
      _scheduleNextBlink();

      if (widget.mood == MascotMood.celebrate) {
        _jumpCtrl.repeat(period: const Duration(milliseconds: 2200));
      }
    }
  }

  void _startBreathe() {
    _breatheCtrl.repeat(reverse: true);
  }

  void _scheduleNextBlink() {
    _blinkTimer?.cancel();
    final nextMs = 3000 + math.Random().nextInt(1500);
    _blinkTimer = Timer(Duration(milliseconds: nextMs), () {
      if (!mounted) return;
      _blinkCtrl.forward().then((_) {
        if (!mounted) return;
        _blinkCtrl.reverse().then((_) {
          if (!mounted) return;
          _scheduleNextBlink();
        });
      });
    });
  }

  @override
  void didUpdateWidget(covariant MascotView oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.mood == MascotMood.celebrate &&
        oldWidget.mood != MascotMood.celebrate) {
      _jumpCtrl.repeat(period: const Duration(milliseconds: 2200));
    } else if (widget.mood != MascotMood.celebrate) {
      _jumpCtrl.stop();
      _jumpCtrl.reset();
    }
  }

  @override
  void dispose() {
    _blinkTimer?.cancel();
    _breatheCtrl.dispose();
    _blinkCtrl.dispose();
    _jumpCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final disableAnimations =
        MediaQuery.maybeOf(context)?.disableAnimations ?? false;

    return AnimatedBuilder(
      animation: Listenable.merge([_breatheCtrl, _blinkCtrl, _jumpCtrl]),
      builder: (context, child) {
        final floatY = disableAnimations
            ? 0.0
            : _breatheAnimation.value + _jumpAnimation.value;
        return Transform.translate(
          offset: Offset(0, floatY),
          child: SizedBox(
            width: widget.size,
            height: widget.size * 1.15,
            child: CustomPaint(
              painter: _MascotPainter(
                mood: widget.mood,
                eyeScaleY: disableAnimations ? 1.0 : _blinkAnimation.value,
              ),
            ),
          ),
        );
      },
    );
  }
}

class _MascotPainter extends CustomPainter {
  final MascotMood mood;
  final double eyeScaleY;

  _MascotPainter({
    required this.mood,
    required this.eyeScaleY,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;
    final center = Offset(w * 0.5, h * 0.58);

    // ─── 1. Shadow ────────────────────────────────────────────────────────────
    final shadowPaint = Paint()
      ..color = OnboardingTheme.primary.withOpacity(0.18)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 10);
    canvas.drawOval(
      Rect.fromCenter(
          center: Offset(center.dx, h * 0.95), width: w * 0.72, height: 14),
      shadowPaint,
    );

    // ─── 2. Antenna & Ball ────────────────────────────────────────────────────
    final antennaStemPaint = Paint()
      ..color = const Color(0xFF5B45D6)
      ..strokeWidth = 3.5
      ..strokeCap = StrokeCap.round;
    canvas.drawLine(
      Offset(center.dx, center.dy - h * 0.36),
      Offset(center.dx, center.dy - h * 0.48),
      antennaStemPaint,
    );

    // Antenna Ball
    final isGoldAntenna = mood == MascotMood.celebrate;
    final ballColor =
        isGoldAntenna ? OnboardingTheme.gold : const Color(0xFFFF7A9C);
    final ballPaint = Paint()..color = ballColor;
    final ballPos = Offset(center.dx, center.dy - h * 0.49);

    if (isGoldAntenna) {
      // Radiant glow around gold ball
      final glowPaint = Paint()
        ..color = OnboardingTheme.gold.withOpacity(0.4)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 6);
      canvas.drawCircle(ballPos, 10, glowPaint);
    }
    canvas.drawCircle(ballPos, 6.5, ballPaint);

    // ─── 3. Left & Right Ears ────────────────────────────────────────────────
    final earPaint = Paint()..color = const Color(0xFF5B45D6);
    final innerEarPaint = Paint()..color = const Color(0xFF8D74FF);
    final earY = center.dy - h * 0.05;

    // Left Ear
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromCenter(
            center: Offset(center.dx - w * 0.38, earY), width: 14, height: 26),
        const Radius.circular(7),
      ),
      earPaint,
    );
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromCenter(
            center: Offset(center.dx - w * 0.38, earY), width: 7, height: 16),
        const Radius.circular(4),
      ),
      innerEarPaint,
    );

    // Right Ear
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromCenter(
            center: Offset(center.dx + w * 0.38, earY), width: 14, height: 26),
        const Radius.circular(7),
      ),
      earPaint,
    );
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromCenter(
            center: Offset(center.dx + w * 0.38, earY), width: 7, height: 16),
        const Radius.circular(4),
      ),
      innerEarPaint,
    );

    // ─── 4. Robot Body ────────────────────────────────────────────────────────
    final bodyPaint = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [Color(0xFF8D74FF), Color(0xFF5B45D6)],
      ).createShader(
          Rect.fromCenter(center: center, width: w * 0.76, height: h * 0.68));

    final bodyRect =
        Rect.fromCenter(center: center, width: w * 0.74, height: h * 0.68);
    canvas.drawRRect(
        RRect.fromRectAndRadius(bodyRect, Radius.circular(w * 0.32)),
        bodyPaint);

    // ─── 5. Face Screen ───────────────────────────────────────────────────────
    final faceRect = Rect.fromCenter(
      center: Offset(center.dx, center.dy - h * 0.02),
      width: w * 0.58,
      height: h * 0.44,
    );
    final facePaint = Paint()..color = const Color(0xFFF9F8FF);
    canvas.drawRRect(
        RRect.fromRectAndRadius(faceRect, Radius.circular(w * 0.22)),
        facePaint);

    // Face Inner Screen Border
    final faceBorderPaint = Paint()
      ..color = OnboardingTheme.lilac
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0;
    canvas.drawRRect(
        RRect.fromRectAndRadius(faceRect, Radius.circular(w * 0.22)),
        faceBorderPaint);

    // ─── 6. Cheeks ───────────────────────────────────────────────────────────
    final cheekPaint = Paint()
      ..color = const Color(0xFFFF9EB7).withOpacity(0.55);
    final cheekY = center.dy + h * 0.05;
    canvas.drawOval(
      Rect.fromCenter(
          center: Offset(center.dx - w * 0.18, cheekY), width: 11, height: 7),
      cheekPaint,
    );
    canvas.drawOval(
      Rect.fromCenter(
          center: Offset(center.dx + w * 0.18, cheekY), width: 11, height: 7),
      cheekPaint,
    );

    // ─── 7. Eyes (with blinking & sparkle) ────────────────────────────────────
    final eyeY = center.dy - h * 0.05;
    final eyeWidth = 8.5;

    final eyePaint = Paint()..color = const Color(0xFF1E1B3A);

    // Left Eye
    canvas.save();
    canvas.translate(center.dx - w * 0.11, eyeY);
    canvas.scale(1.0, eyeScaleY);
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromCenter(center: Offset.zero, width: eyeWidth, height: 13.0),
        const Radius.circular(4.5),
      ),
      eyePaint,
    );
    if (eyeScaleY > 0.4) {
      // Eye reflection sparkle
      final sparklePaint = Paint()..color = Colors.white;
      canvas.drawCircle(const Offset(-1.5, -2.5), 2.0, sparklePaint);
    }
    canvas.restore();

    // Right Eye
    canvas.save();
    canvas.translate(center.dx + w * 0.11, eyeY);
    canvas.scale(1.0, eyeScaleY);
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromCenter(center: Offset.zero, width: eyeWidth, height: 13.0),
        const Radius.circular(4.5),
      ),
      eyePaint,
    );
    if (eyeScaleY > 0.4) {
      final sparklePaint = Paint()..color = Colors.white;
      canvas.drawCircle(const Offset(-1.5, -2.5), 2.0, sparklePaint);
    }
    canvas.restore();

    // ─── 8. Mouth ─────────────────────────────────────────────────────────────
    final mouthY = center.dy + h * 0.06;
    final mouthPaint = Paint()
      ..color = const Color(0xFF1E1B3A)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5
      ..strokeCap = StrokeCap.round;

    if (mood == MascotMood.celebrate) {
      // Big beaming open smile with tongue
      final openMouthPath = Path();
      openMouthPath.moveTo(center.dx - 10, mouthY - 2);
      openMouthPath.quadraticBezierTo(
          center.dx, mouthY + 12, center.dx + 10, mouthY - 2);
      openMouthPath.close();

      final openMouthFill = Paint()..color = const Color(0xFF1E1B3A);
      canvas.drawPath(openMouthPath, openMouthFill);

      // Cute tongue
      canvas.save();
      canvas.clipPath(openMouthPath);
      final tonguePaint = Paint()..color = const Color(0xFFFF7A9C);
      canvas.drawCircle(Offset(center.dx, mouthY + 8), 6.5, tonguePaint);
      canvas.restore();
    } else {
      // Gentle sweet smile arc
      final smilePath = Path();
      smilePath.moveTo(center.dx - 7.5, mouthY);
      smilePath.quadraticBezierTo(
          center.dx, mouthY + 5.5, center.dx + 7.5, mouthY);
      canvas.drawPath(smilePath, mouthPaint);
    }

    // ─── 9. Party Hat for Screen 2 ────────────────────────────────────────────
    if (mood == MascotMood.partyHat) {
      final hatPath = Path();
      final hatPeak = Offset(center.dx + w * 0.08, center.dy - h * 0.58);
      hatPath.moveTo(center.dx - w * 0.08, center.dy - h * 0.35);
      hatPath.lineTo(hatPeak.dx, hatPeak.dy);
      hatPath.lineTo(center.dx + w * 0.22, center.dy - h * 0.32);
      hatPath.close();

      final hatPaint = Paint()
        ..shader = const LinearGradient(
          colors: [Color(0xFFFFB938), Color(0xFFFF7A9C)],
        ).createShader(hatPath.getBounds());
      canvas.drawPath(hatPath, hatPaint);

      // Pom-pom on hat peak
      final pomPaint = Paint()..color = Colors.white;
      canvas.drawCircle(hatPeak, 4.5, pomPaint);
    }
  }

  @override
  bool shouldRepaint(covariant _MascotPainter oldDelegate) {
    return oldDelegate.mood != mood || oldDelegate.eyeScaleY != eyeScaleY;
  }
}
