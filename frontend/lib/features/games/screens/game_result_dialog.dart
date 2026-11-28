import 'dart:math' as math;
import 'dart:ui';
import 'package:flutter/material.dart';
import '../logic/tug_of_war_controller.dart';
import '../models/team.dart';
import '../widgets/game_colors.dart';

/// Modal dialog shown at game finish with celebration confetti and match statistics
class GameResultDialog extends StatefulWidget {
  final GameResult result;
  final VoidCallback onPlayAgain;
  final VoidCallback onChangeSettings;
  final VoidCallback onGoHome;

  const GameResultDialog({
    super.key,
    required this.result,
    required this.onPlayAgain,
    required this.onChangeSettings,
    required this.onGoHome,
  });

  static Future<void> show(
    BuildContext context, {
    required GameResult result,
    required VoidCallback onPlayAgain,
    required VoidCallback onChangeSettings,
    required VoidCallback onGoHome,
  }) {
    return showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => GameResultDialog(
        result: result,
        onPlayAgain: onPlayAgain,
        onChangeSettings: onChangeSettings,
        onGoHome: onGoHome,
      ),
    );
  }

  @override
  State<GameResultDialog> createState() => _GameResultDialogState();
}

class _GameResultDialogState extends State<GameResultDialog>
    with SingleTickerProviderStateMixin {
  late final AnimationController _confettiController;
  final List<_ConfettiParticle> _particles = [];
  final math.Random _random = math.Random();

  @override
  void initState() {
    super.initState();
    _confettiController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2500),
    )..addListener(() {
        if (mounted) setState(() {});
      });

    _spawnConfetti();
    _confettiController.forward();
  }

  void _spawnConfetti() {
    final winnerColor = widget.result.winner?.primaryColor ?? Colors.amber;
    final secondaryColor = widget.result.winner?.id == 1
        ? const Color(0xFF60A5FA)
        : const Color(0xFFF87171);

    for (int i = 0; i < 70; i++) {
      _particles.add(_ConfettiParticle(
        x: 0.1 + _random.nextDouble() * 0.8,
        y: -0.1 - _random.nextDouble() * 0.4,
        vx: (_random.nextDouble() - 0.5) * 0.5,
        vy: 0.35 + _random.nextDouble() * 0.7,
        size: 5 + _random.nextDouble() * 7,
        color: [
          winnerColor,
          secondaryColor,
          Colors.amber,
          const Color(0xFF10B981),
          Colors.purpleAccent,
        ][_random.nextInt(5)],
        rotation: _random.nextDouble() * math.pi * 2,
        vRot: (_random.nextDouble() - 0.5) * 6,
      ));
    }
  }

  @override
  void dispose() {
    _confettiController.dispose();
    super.dispose();
  }

  String _formatDuration(int seconds) {
    final m = (seconds ~/ 60).toString().padLeft(2, '0');
    final s = (seconds % 60).toString().padLeft(2, '0');
    return '$m:$s';
  }

  @override
  Widget build(BuildContext context) {
    final colors = GameColors.of(context);
    final isDraw = widget.result.isDraw;
    final winner = widget.result.winner;
    final winnerColor = winner != null
        ? winner.getPrimaryColor(colors.isDark)
        : Colors.amber;

    return PopScope(
      canPop: false,
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
        child: Stack(
          children: [
            // Confetti Overlay
            if (_confettiController.isAnimating)
              Positioned.fill(
                child: IgnorePointer(
                  child: CustomPaint(
                    painter: _ConfettiPainter(
                      particles: _particles,
                      progress: _confettiController.value,
                    ),
                  ),
                ),
              ),

            // Dialog Box
            Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 420),
                child: Dialog(
                  backgroundColor: colors.cardBackground,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(26),
                    side: BorderSide(
                      color: winnerColor.withValues(alpha: 0.5),
                      width: 2,
                    ),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(22),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Trophy Icon with glow
                        Container(
                          width: 72,
                          height: 72,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            gradient: LinearGradient(
                              colors: isDraw
                                  ? [Colors.amber, const Color(0xFFD97706)]
                                  : [winnerColor, winnerColor.withValues(alpha: 0.7)],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: winnerColor.withValues(alpha: 0.4),
                                blurRadius: 20,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: const Center(
                            child: Icon(
                              Icons.emoji_events_rounded,
                              size: 40,
                              color: Colors.white,
                            ),
                          ),
                        ),

                        const SizedBox(height: 16),

                        // Winner Title
                        Text(
                          isDraw ? 'Durang! 🤝' : 'G‘olib: ${winner!.name}! 🎉',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w900,
                            color: isDraw ? colors.gold : winnerColor,
                            letterSpacing: -0.3,
                          ),
                        ),

                        const SizedBox(height: 6),

                        Text(
                          isDraw
                              ? 'Har ikki jamoa teng kuch bilan kurashdi!'
                              : 'Arqon to‘liq ${winner!.name} tomoniga tortildi!',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 13,
                            color: colors.textSecondary,
                          ),
                        ),

                        const SizedBox(height: 18),

                        // Score & Stats Comparison Card
                        Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: colors.cardSecondary,
                            borderRadius: BorderRadius.circular(18),
                            border:
                                Border.all(color: colors.border, width: 1.2),
                          ),
                          child: Column(
                            children: [
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceAround,
                                children: [
                                  Expanded(
                                    child: _buildTeamStats(
                                      widget.result.team1,
                                      colors.blueTeam,
                                      colors,
                                    ),
                                  ),
                                  Container(
                                    width: 1,
                                    height: 48,
                                    color: colors.border,
                                  ),
                                  Expanded(
                                    child: _buildTeamStats(
                                      widget.result.team2,
                                      colors.redTeam,
                                      colors,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 10),
                              Divider(
                                  height: 1,
                                  thickness: 1,
                                  color: colors.border),
                              const SizedBox(height: 8),
                              FittedBox(
                                fit: BoxFit.scaleDown,
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(Icons.timer_outlined,
                                        size: 15, color: colors.textMuted),
                                    const SizedBox(width: 4),
                                    Text(
                                      'O‘yin davomiyligi: ${_formatDuration(widget.result.durationSeconds)}',
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w600,
                                        color: colors.textSecondary,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),

                        const SizedBox(height: 20),

                        // 1. "Qayta o‘ynash" Button
                        SizedBox(
                          width: double.infinity,
                          height: 48,
                          child: ElevatedButton.icon(
                            onPressed: () {
                              Navigator.of(context).pop();
                              widget.onPlayAgain();
                            },
                            icon: const Icon(Icons.replay_rounded, size: 20),
                            label: const Text(
                              'Qayta o‘ynash',
                              style: TextStyle(
                                  fontSize: 15, fontWeight: FontWeight.w800),
                            ),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: colors.primaryBlue,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14)),
                              elevation: 2,
                            ),
                          ),
                        ),

                        const SizedBox(height: 10),

                        // 2. "Sozlamalarni o‘zgartirish" Button
                        SizedBox(
                          width: double.infinity,
                          height: 44,
                          child: OutlinedButton.icon(
                            onPressed: () {
                              Navigator.of(context).pop();
                              widget.onChangeSettings();
                            },
                            icon: const Icon(Icons.tune_rounded, size: 18),
                            label: const Text(
                              'Sozlamalarni o‘zgartirish',
                              style: TextStyle(
                                  fontSize: 13, fontWeight: FontWeight.w700),
                            ),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: colors.textPrimary,
                              side: BorderSide(color: colors.border),
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14)),
                            ),
                          ),
                        ),

                        const SizedBox(height: 6),

                        // 3. "Bosh sahifa" Link
                        TextButton(
                          onPressed: () {
                            Navigator.of(context).pop();
                            widget.onGoHome();
                          },
                          child: Text(
                            'Bosh sahifa',
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color: colors.textMuted,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTeamStats(Team team, Color color, GameColors colors) {
    return Column(
      children: [
        Text(
          team.name,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w800,
            color: color,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          '${team.score} ball',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w900,
            color: colors.textPrimary,
          ),
        ),
        const SizedBox(height: 2),
        FittedBox(
          fit: BoxFit.scaleDown,
          child: Text(
            '${team.correctAnswers} to‘g‘ri • ${team.wrongAnswers} xato',
            style: TextStyle(
              fontSize: 11,
              color: colors.textMuted,
            ),
          ),
        ),
      ],
    );
  }
}

class _ConfettiParticle {
  double x;
  double y;
  double vx;
  double vy;
  double size;
  Color color;
  double rotation;
  double vRot;

  _ConfettiParticle({
    required this.x,
    required this.y,
    required this.vx,
    required this.vy,
    required this.size,
    required this.color,
    required this.rotation,
    required this.vRot,
  });
}

class _ConfettiPainter extends CustomPainter {
  final List<_ConfettiParticle> particles;
  final double progress;

  _ConfettiPainter({required this.particles, required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..style = PaintingStyle.fill;
    for (final p in particles) {
      final currentX = (p.x + p.vx * progress) * size.width;
      final currentY = (p.y + p.vy * progress) * size.height;
      if (currentY > size.height) continue;

      paint.color = p.color;
      canvas.save();
      canvas.translate(currentX, currentY);
      canvas.rotate(p.rotation + p.vRot * progress);
      canvas.drawRect(
        Rect.fromCenter(
            center: Offset.zero, width: p.size, height: p.size * 0.6),
        paint,
      );
      canvas.restore();
    }
  }

  @override
  bool shouldRepaint(covariant _ConfettiPainter oldDelegate) => true;
}
