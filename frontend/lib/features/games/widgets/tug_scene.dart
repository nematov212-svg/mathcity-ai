import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../models/team.dart';

/// Scene card displaying the rope pulling battle, players, center line, and animated timer
class TugScene extends StatefulWidget {
  final int ropeMarker; // -5 to +5
  final int? remainingSeconds; // null for infinite
  final int elapsedSeconds;
  final Team team1;
  final Team team2;
  final bool isDark;

  const TugScene({
    super.key,
    required this.ropeMarker,
    required this.remainingSeconds,
    required this.elapsedSeconds,
    required this.team1,
    required this.team2,
    required this.isDark,
  });

  @override
  State<TugScene> createState() => _TugSceneState();
}

class _TugSceneState extends State<TugScene>
    with SingleTickerProviderStateMixin {
  late final AnimationController _pulseController;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  String _formatTimer(int? remaining, int elapsed) {
    if (remaining == null) {
      final m = (elapsed ~/ 60).toString().padLeft(2, '0');
      final s = (elapsed % 60).toString().padLeft(2, '0');
      return '$m:$s';
    }
    final m = (remaining ~/ 60).toString().padLeft(2, '0');
    final s = (remaining % 60).toString().padLeft(2, '0');
    return '$m:$s';
  }

  @override
  Widget build(BuildContext context) {
    final isLowTime =
        widget.remainingSeconds != null && widget.remainingSeconds! <= 10;
    final timeStr = _formatTimer(widget.remainingSeconds, widget.elapsedSeconds);

    // Normalize marker: -5 to +5 maps to horizontal offset factor
    final double markerShift =
        (widget.ropeMarker / 5.0).clamp(-1.0, 1.0); // -1.0 to +1.0

    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: widget.isDark ? const Color(0xFF151A2B) : Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: widget.isDark ? const Color(0x26FFFFFF) : const Color(0xFFE2E8F0),
          width: 1.2,
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0A000000),
            blurRadius: 12,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Stack(
        alignment: Alignment.center,
        children: [
          // 1. Center Dashed Line
          CustomPaint(
            size: Size.infinite,
            painter: _CenterDashedLinePainter(
              color: widget.isDark
                  ? Colors.white.withValues(alpha: 0.15)
                  : Colors.black.withValues(alpha: 0.1),
            ),
          ),

          // 2. Animated Tug of War Battle Field
          TweenAnimationBuilder<double>(
            tween: Tween<double>(begin: 0.0, end: markerShift),
            duration: const Duration(milliseconds: 350),
            curve: Curves.easeOutBack,
            builder: (context, shift, child) {
              return LayoutBuilder(
                builder: (context, constraints) {
                  final maxOffset = constraints.maxWidth * 0.18;
                  final currentOffset = shift * maxOffset;

                  return Transform.translate(
                    offset: Offset(currentOffset, 12),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        // Left Team (Blue)
                        _buildTeamSquad(
                          isLeft: true,
                          color: widget.team1.getPrimaryColor(widget.isDark),
                          tiltAngle: shift < 0 ? -0.25 : -0.05,
                          isWinning: shift < 0,
                          isDark: widget.isDark,
                        ),

                        // Rope with Red Center Marker Flag
                        _buildRopeSegment(shift),

                        // Right Team (Red)
                        _buildTeamSquad(
                          isLeft: false,
                          color: widget.team2.getPrimaryColor(widget.isDark),
                          tiltAngle: shift > 0 ? 0.25 : 0.05,
                          isWinning: shift > 0,
                          isDark: widget.isDark,
                        ),
                      ],
                    ),
                  );
                },
              );
            },
          ),

          // 3. Top Center Timer Capsule
          Positioned(
            top: 10,
            child: AnimatedBuilder(
              animation: _pulseController,
              builder: (context, child) {
                final scale = isLowTime ? 1.0 + _pulseController.value * 0.06 : 1.0;
                return Transform.scale(
                  scale: scale,
                  child: child,
                );
              },
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                decoration: BoxDecoration(
                  color: isLowTime
                      ? const Color(0xFFEF4444).withValues(alpha: 0.18)
                      : (widget.isDark
                          ? const Color(0xFF1E293B)
                          : const Color(0xFFF1F5F9)),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: isLowTime
                        ? const Color(0xFFEF4444)
                        : (widget.isDark
                            ? const Color(0x33FFFFFF)
                            : const Color(0xFFCBD5E1)),
                    width: 1.5,
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      widget.remainingSeconds == null
                          ? Icons.all_inclusive_rounded
                          : Icons.timer_outlined,
                      size: 16,
                      color: isLowTime
                          ? const Color(0xFFEF4444)
                          : (widget.isDark ? Colors.white70 : Colors.black87),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      timeStr,
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w900,
                        color: isLowTime
                            ? const Color(0xFFEF4444)
                            : (widget.isDark ? Colors.white : const Color(0xFF0F172A)),
                        letterSpacing: 0.5,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRopeSegment(double shift) {
    return SizedBox(
      width: 70,
      height: 24,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Rope line
          Container(
            height: 7,
            decoration: BoxDecoration(
              color: const Color(0xFFD97706),
              borderRadius: BorderRadius.circular(3),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x20000000),
                  blurRadius: 3,
                  offset: Offset(0, 1),
                ),
              ],
            ),
          ),

          // Central Marker Ribbon
          Container(
            width: 8,
            height: 22,
            decoration: BoxDecoration(
              color: const Color(0xFFEF4444),
              borderRadius: BorderRadius.circular(2),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x30EF4444),
                  blurRadius: 4,
                  offset: Offset(0, 2),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTeamSquad({
    required bool isLeft,
    required Color color,
    required double tiltAngle,
    required bool isWinning,
    required bool isDark,
  }) {
    return Transform.rotate(
      angle: tiltAngle,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: isLeft
            ? [
                _buildPlayerFigure(color, isLeft, isWinning, isDark, 0.9),
                _buildPlayerFigure(color, isLeft, isWinning, isDark, 1.05),
              ]
            : [
                _buildPlayerFigure(color, isLeft, isWinning, isDark, 1.05),
                _buildPlayerFigure(color, isLeft, isWinning, isDark, 0.9),
              ],
      ),
    );
  }

  Widget _buildPlayerFigure(
    Color color,
    bool isLeft,
    bool isWinning,
    bool isDark,
    double scale,
  ) {
    return Transform.scale(
      scale: scale,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 2),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Uzbek Doppi Cap
            Container(
              width: 22,
              height: 8,
              decoration: BoxDecoration(
                color: isDark ? Colors.white70 : Colors.black87,
                borderRadius:
                    const BorderRadius.vertical(top: Radius.circular(5)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: List.generate(
                  3,
                  (_) => Container(width: 1.5, height: 3, color: Colors.white),
                ),
              ),
            ),
            // Head
            Container(
              width: 24,
              height: 24,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                color: Color(0xFFFFD1A4),
              ),
              child: Center(
                child: Text(
                  isWinning ? '😤' : '😬',
                  style: const TextStyle(fontSize: 12),
                ),
              ),
            ),
            // Body
            Container(
              width: 32,
              height: 28,
              decoration: BoxDecoration(
                color: color,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Center(
                child: Icon(
                  isLeft ? Icons.arrow_back : Icons.arrow_forward,
                  size: 14,
                  color: Colors.white,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CenterDashedLinePainter extends CustomPainter {
  final Color color;

  _CenterDashedLinePainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    const dashHeight = 6.0;
    const dashSpace = 4.0;
    double startY = 0;
    final centerX = size.width / 2;

    while (startY < size.height) {
      canvas.drawLine(
        Offset(centerX, startY),
        Offset(centerX, math.min(startY + dashHeight, size.height)),
        paint,
      );
      startY += dashHeight + dashSpace;
    }
  }

  @override
  bool shouldRepaint(covariant _CenterDashedLinePainter oldDelegate) => false;
}
