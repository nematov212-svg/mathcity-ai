import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/game_card_model.dart';
import 'game_colors.dart';

/// Compact game card (approx 35% height reduction from initial prototype)
/// Features 16:9 vector illustration with Uzbek traditional doppi and ikat clothing,
/// green guest badge, Nunito typography, and full-width "Boshlash" action button.
class GameCard extends StatefulWidget {
  final GameCardModel model;
  final VoidCallback onStart;

  const GameCard({
    super.key,
    required this.model,
    required this.onStart,
  });

  @override
  State<GameCard> createState() => _GameCardState();
}

class _GameCardState extends State<GameCard>
    with SingleTickerProviderStateMixin {
  late final AnimationController _scaleController;
  late final Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _scaleController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 140),
      lowerBound: 0.0,
      upperBound: 1.0,
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.98).animate(
      CurvedAnimation(parent: _scaleController, curve: Curves.easeOutCubic),
    );
  }

  @override
  void dispose() {
    _scaleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = GameColors.of(context);
    final isLocked = widget.model.isLocked;

    return AnimatedBuilder(
      animation: _scaleAnimation,
      builder: (context, child) => Transform.scale(
        scale: _scaleAnimation.value,
        child: child,
      ),
      child: Container(
        decoration: BoxDecoration(
          color: colors.cardBackground,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(
            color: isLocked
                ? colors.border.withValues(alpha: 0.6)
                : colors.border,
            width: 1.2,
          ),
          boxShadow: [
            BoxShadow(
              color: colors.isDark
                  ? Colors.black.withValues(alpha: 0.28)
                  : const Color(0x0C1F2937),
              blurRadius: 14,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            borderRadius: BorderRadius.circular(22),
            onTapDown: (_) => _scaleController.forward(),
            onTapUp: (_) => _scaleController.reverse(),
            onTapCancel: () => _scaleController.reverse(),
            onTap: () {
              HapticFeedback.lightImpact();
              widget.onStart();
            },
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  // 1. Compact 16:9 Illustration (no emojis, pure clean vector / asset)
                  ConstrainedBox(
                    constraints: const BoxConstraints(maxHeight: 135),
                    child: AspectRatio(
                      aspectRatio: 16 / 9,
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: Stack(
                          fit: StackFit.expand,
                          children: [
                            if (widget.model.imageAsset != null)
                              Image.asset(
                                widget.model.imageAsset!,
                                fit: BoxFit.cover,
                                errorBuilder: (_, __, ___) =>
                                    _buildVectorIllustration(colors, isLocked),
                              )
                            else
                              _buildVectorIllustration(colors, isLocked),

                            // Lock Overlay if game is locked / coming soon
                            if (isLocked)
                              Container(
                                color: Colors.black.withValues(alpha: 0.38),
                                child: Center(
                                  child: Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      color: Colors.black54,
                                      shape: BoxShape.circle,
                                      border: Border.all(
                                          color: Colors.white24, width: 1),
                                    ),
                                    child: const Icon(
                                      Icons.lock_rounded,
                                      color: Colors.white,
                                      size: 20,
                                    ),
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 10),

                  // 2. Green Guest Badge: "Ro‘yxatdan o‘tmasdan"
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: isLocked
                          ? colors.borderSubtle
                          : colors.successGreen.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: isLocked
                            ? colors.border
                            : colors.successGreen.withValues(alpha: 0.3),
                        width: 1,
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          isLocked ? Icons.schedule_rounded : Icons.bolt_rounded,
                          size: 13,
                          color: isLocked
                              ? colors.textMuted
                              : colors.successGreen,
                        ),
                        const SizedBox(width: 4),
                        Flexible(
                          child: Text(
                            widget.model.badge,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w800,
                              color: isLocked
                                  ? colors.textMuted
                                  : colors.successGreen,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 6),

                  // 3. Game Title
                  Text(
                    widget.model.title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.w900,
                      color: isLocked ? colors.textMuted : colors.textPrimary,
                      letterSpacing: -0.3,
                    ),
                  ),

                  const SizedBox(height: 3),

                  // 4. Description (1-2 lines)
                  Text(
                    widget.model.description,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: colors.textSecondary,
                      height: 1.3,
                    ),
                  ),

                  const SizedBox(height: 12),

                  // 5. Full-width Action Button ("Boshlash" or "Tez orada")
                  Container(
                    height: 42,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      gradient: isLocked
                          ? null
                          : LinearGradient(
                              colors: [colors.primaryBlue, const Color(0xFF6366F1)],
                              begin: Alignment.centerLeft,
                              end: Alignment.centerRight,
                            ),
                      color: isLocked ? colors.borderSubtle : null,
                      borderRadius: BorderRadius.circular(14),
                      boxShadow: isLocked
                          ? null
                          : [
                              BoxShadow(
                                color: colors.primaryBlue.withValues(alpha: 0.3),
                                blurRadius: 8,
                                offset: const Offset(0, 3),
                              ),
                            ],
                    ),
                    child: Center(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            isLocked
                                ? Icons.lock_clock_rounded
                                : Icons.play_arrow_rounded,
                            color: isLocked ? colors.textMuted : Colors.white,
                            size: 18,
                          ),
                          const SizedBox(width: 6),
                          Text(
                            isLocked ? 'Tez orada' : 'Boshlash',
                            style: TextStyle(
                              color: isLocked ? colors.textMuted : Colors.white,
                              fontSize: 14,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 0.2,
                            ),
                          ),
                        ],
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

  Widget _buildVectorIllustration(GameColors colors, bool isLocked) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: colors.isDark
              ? [const Color(0xFF1E293B), const Color(0xFF0F172A)]
              : [const Color(0xFFEFF6FF), const Color(0xFFDBEAFE)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: CustomPaint(
        painter: _TugOfWarVectorPainter(
          isDark: colors.isDark,
          isLocked: isLocked,
        ),
      ),
    );
  }
}

/// CustomPainter rendering a vector scene with Uzbek doppi caps, blue/red chapans,
/// rope, red flag, and "VS" badge — completely free of emojis.
class _TugOfWarVectorPainter extends CustomPainter {
  final bool isDark;
  final bool isLocked;

  const _TugOfWarVectorPainter({
    required this.isDark,
    required this.isLocked,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;
    final centerY = h * 0.58;

    // 1. Background soft circular glow
    final bgGlowPaint = Paint()
      ..color = isDark
          ? const Color(0x1A38BDF8)
          : const Color(0x3393C5FD)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 24);
    canvas.drawCircle(Offset(w / 2, centerY), h * 0.38, bgGlowPaint);

    // 2. Thick Braided Tug Rope
    final ropePaint = Paint()
      ..color = const Color(0xFFD97706)
      ..strokeWidth = 6.0
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;
    canvas.drawLine(
      Offset(w * 0.22, centerY + 2),
      Offset(w * 0.78, centerY + 2),
      ropePaint,
    );

    // Rope central red ribbon / flag
    final flagPaint = Paint()..color = const Color(0xFFEF4444);
    final flagPath = Path()
      ..moveTo(w * 0.5 - 6, centerY - 8)
      ..lineTo(w * 0.5 + 6, centerY - 8)
      ..lineTo(w * 0.5, centerY + 14)
      ..close();
    canvas.drawPath(flagPath, flagPaint);

    // 3. Central "VS" Badge Pill
    final vsBgPaint = Paint()..color = const Color(0xFFF59E0B);
    final vsRect = RRect.fromRectAndRadius(
      Rect.fromCenter(
          center: Offset(w * 0.5, centerY - 24), width: 34, height: 18),
      const Radius.circular(9),
    );
    canvas.drawRRect(vsRect, vsBgPaint);

    final vsTextPainter = TextPainter(
      text: const TextSpan(
        text: 'VS',
        style: TextStyle(
          color: Colors.black87,
          fontSize: 10,
          fontWeight: FontWeight.w900,
        ),
      ),
      textDirection: TextDirection.ltr,
    )..layout();
    vsTextPainter.paint(
      canvas,
      Offset(w * 0.5 - vsTextPainter.width / 2,
          centerY - 24 - vsTextPainter.height / 2),
    );

    // 4. Blue Team Puller (Left side, pulling left)
    _drawTeamFigure(
      canvas: canvas,
      center: Offset(w * 0.22, centerY),
      color: const Color(0xFF2563EB),
      isLeft: true,
    );

    // 5. Red Team Puller (Right side, pulling right)
    _drawTeamFigure(
      canvas: canvas,
      center: Offset(w * 0.78, centerY),
      color: const Color(0xFFDC2626),
      isLeft: false,
    );
  }

  void _drawTeamFigure({
    required Canvas canvas,
    required Offset center,
    required Color color,
    required bool isLeft,
  }) {
    final bodyTilt = isLeft ? -0.18 : 0.18;
    canvas.save();
    canvas.translate(center.dx, center.dy);
    canvas.rotate(bodyTilt);

    // Chapan Body
    final bodyPaint = Paint()..color = color;
    final bodyRect = RRect.fromRectAndRadius(
      const Rect.fromLTWH(-16, -14, 32, 28),
      const Radius.circular(8),
    );
    canvas.drawRRect(bodyRect, bodyPaint);

    // White Ikat trim on Chapan
    final trimPaint = Paint()
      ..color = Colors.white.withValues(alpha: 0.7)
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke;
    canvas.drawLine(const Offset(0, -14), const Offset(0, 14), trimPaint);

    // Head
    final headPaint = Paint()..color = const Color(0xFFFFD1A4);
    canvas.drawCircle(const Offset(0, -28), 11, headPaint);

    // Uzbek Traditional Doppi Cap (Dark with white diamond motifs)
    final doppiPaint = Paint()
      ..color = isDark ? Colors.white70 : const Color(0xFF1E293B);
    final doppiPath = Path()
      ..moveTo(-12, -28)
      ..quadraticBezierTo(0, -40, 12, -28)
      ..close();
    canvas.drawPath(doppiPath, doppiPaint);

    // 4 white decorative ornament dots on the doppi
    final dotPaint = Paint()..color = Colors.white;
    for (int i = -6; i <= 6; i += 4) {
      canvas.drawCircle(Offset(i.toDouble(), -33), 1.2, dotPaint);
    }

    // Arm pulling rope
    final armPaint = Paint()
      ..color = color
      ..strokeWidth = 5.0
      ..strokeCap = StrokeCap.round;
    final armTargetX = isLeft ? 18.0 : -18.0;
    canvas.drawLine(const Offset(0, -6), Offset(armTargetX, 4), armPaint);

    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant _TugOfWarVectorPainter oldDelegate) {
    return oldDelegate.isDark != isDark || oldDelegate.isLocked != isLocked;
  }
}
