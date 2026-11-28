import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/game_card_model.dart';
import 'game_colors.dart';

/// Game Card widget displayed in the Games section of Home Screen
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
  late final AnimationController _animController;
  late final Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 120),
      lowerBound: 0.0,
      upperBound: 1.0,
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.97).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeOutCubic),
    );
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = GameColors.of(context);

    return Container(
      decoration: BoxDecoration(
        color: colors.cardBackground,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: colors.border, width: 1.2),
        boxShadow: colors.cardShadow,
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(24),
          onTap: widget.onStart,
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                // 1. Illustration Area (16:10 ratio, rounded 20)
                AspectRatio(
                  aspectRatio: 16 / 10,
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(20),
                    child: _buildIllustration(colors),
                  ),
                ),

                const SizedBox(height: 14),

                // 2. Green Badge: "Ro'yxatdan o'tmasdan"
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: colors.successGreen.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(999),
                    border: Border.all(
                      color: colors.successGreen.withValues(alpha: 0.35),
                      width: 1,
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.bolt_rounded,
                          size: 14, color: colors.successGreen),
                      const SizedBox(width: 4),
                      Flexible(
                        child: Text(
                          widget.model.badge,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            color: colors.successGreen,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 8),

                // 3. Title: "Arqon tortish"
                Text(
                  widget.model.title,
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                    color: colors.textPrimary,
                    letterSpacing: -0.3,
                  ),
                ),

                const SizedBox(height: 6),

                // 4. Description (2-3 lines)
                Text(
                  widget.model.description,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    color: colors.textSecondary,
                    height: 1.4,
                  ),
                ),

                // 5. 14px comfortable gap between text and button
                const SizedBox(height: 16),

                // 6. Full-width "Boshlash" button
                AnimatedBuilder(
                  animation: _scaleAnimation,
                  builder: (context, child) => Transform.scale(
                    scale: _scaleAnimation.value,
                    child: child,
                  ),
                  child: GestureDetector(
                    onTapDown: (_) => _animController.forward(),
                    onTapUp: (_) => _animController.reverse(),
                    onTapCancel: () => _animController.reverse(),
                    onTap: () {
                      HapticFeedback.mediumImpact();
                      widget.onStart();
                    },
                    child: Container(
                      width: double.infinity,
                      height: 52,
                      decoration: BoxDecoration(
                        gradient: colors.blueGradient,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: colors.buttonShadow,
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: const [
                          Icon(Icons.play_arrow_rounded,
                              color: Colors.white, size: 22),
                          SizedBox(width: 8),
                          Text(
                            'Boshlash',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 0.2,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildIllustration(GameColors colors) {
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
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Background Uzbek Ikat decorative pattern / geometric circles
          CustomPaint(
            size: Size.infinite,
            painter: _IkatDecorPainter(isDark: colors.isDark),
          ),

          // Central Visual: Blue team vs Red team pulling rope with Uzbek doppi caps
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10),
            child: FittedBox(
              fit: BoxFit.scaleDown,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  // Blue Team Figure (Left)
                  _buildTeamFigure(
                    isLeft: true,
                    teamColor: const Color(0xFF2563EB),
                    label: 'Ko‘k jamoa',
                    isDark: colors.isDark,
                  ),

                  const SizedBox(width: 12),

                  // Rope & Central Flag
                  Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        padding:
                            const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.amber,
                          borderRadius: BorderRadius.circular(8),
                          boxShadow: const [
                            BoxShadow(
                              color: Colors.black26,
                              blurRadius: 4,
                              offset: Offset(0, 2),
                            ),
                          ],
                        ),
                        child: const Text(
                          'VS',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w900,
                            color: Colors.black87,
                          ),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Container(
                        width: 70,
                        height: 8,
                        decoration: BoxDecoration(
                          color: const Color(0xFFD97706),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Center(
                          child: Container(
                            width: 6,
                            height: 14,
                            color: const Color(0xFFEF4444),
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(width: 12),

                  // Red Team Figure (Right)
                  _buildTeamFigure(
                    isLeft: false,
                    teamColor: const Color(0xFFDC2626),
                    label: 'Qizil jamoa',
                    isDark: colors.isDark,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTeamFigure({
    required bool isLeft,
    required Color teamColor,
    required String label,
    required bool isDark,
  }) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // Uzbek Doppi cap ornament
        Container(
          width: 32,
          height: 12,
          decoration: BoxDecoration(
            color: isDark ? Colors.white70 : Colors.black87,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(6)),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: List.generate(
              3,
              (_) => Container(
                width: 2,
                height: 4,
                color: Colors.white,
              ),
            ),
          ),
        ),
        // Head
        Container(
          width: 34,
          height: 34,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: const Color(0xFFFFD1A4),
            border: Border.all(color: Colors.black12, width: 1),
          ),
          child: const Center(
            child: Text(
              '💪',
              style: TextStyle(fontSize: 16),
            ),
          ),
        ),
        const SizedBox(height: 4),
        // Body (Traditional Uzbek Chapan in team color)
        Transform.rotate(
          angle: isLeft ? -0.15 : 0.15,
          child: Container(
            width: 48,
            height: 40,
            decoration: BoxDecoration(
              color: teamColor,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: Colors.white24, width: 1.5),
            ),
            child: Icon(
              isLeft
                  ? Icons.arrow_back_ios_rounded
                  : Icons.arrow_forward_ios_rounded,
              color: Colors.white70,
              size: 16,
            ),
          ),
        ),
      ],
    );
  }
}

class _IkatDecorPainter extends CustomPainter {
  final bool isDark;

  _IkatDecorPainter({required this.isDark});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = (isDark ? Colors.white : Colors.blue).withValues(alpha: 0.05)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.2;

    const step = 28.0;
    for (double x = 0; x < size.width; x += step) {
      for (double y = 0; y < size.height; y += step) {
        final path = Path();
        path.moveTo(x, y - 8);
        path.lineTo(x + 8, y);
        path.lineTo(x, y + 8);
        path.lineTo(x - 8, y);
        path.close();
        canvas.drawPath(path, paint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant _IkatDecorPainter oldDelegate) => false;
}
