import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import 'flying_coins_overlay.dart';

/// Universal result dialog for MathCity games with animated score,
/// flying coins celebration and daily limit check for replay.
class GamePlayResultDialog extends StatefulWidget {
  final String gameTitle;
  final String result; // 'win' | 'draw' | 'loss' | 'participated'
  final int score;
  final int coinsEarned;
  final int xpEarned;
  final int remainingPlays;
  final bool isPro;
  final List<Map<String, String>> stats;
  final VoidCallback onPlayAgain;
  final VoidCallback onGoHome;

  const GamePlayResultDialog({
    super.key,
    required this.gameTitle,
    required this.result,
    required this.score,
    required this.coinsEarned,
    this.xpEarned = 35,
    required this.remainingPlays,
    required this.isPro,
    required this.stats,
    required this.onPlayAgain,
    required this.onGoHome,
  });

  static Future<void> show(
    BuildContext context, {
    required String gameTitle,
    required String result,
    required int score,
    required int coinsEarned,
    int xpEarned = 35,
    required int remainingPlays,
    required bool isPro,
    required List<Map<String, String>> stats,
    required VoidCallback onPlayAgain,
    required VoidCallback onGoHome,
  }) {
    return showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => GamePlayResultDialog(
        gameTitle: gameTitle,
        result: result,
        score: score,
        coinsEarned: coinsEarned,
        xpEarned: xpEarned,
        remainingPlays: remainingPlays,
        isPro: isPro,
        stats: stats,
        onPlayAgain: onPlayAgain,
        onGoHome: onGoHome,
      ),
    );
  }

  @override
  State<GamePlayResultDialog> createState() => _GamePlayResultDialogState();
}

class _GamePlayResultDialogState extends State<GamePlayResultDialog> {
  bool _showFlyingCoins = true;

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);
    final isWin = widget.result == 'win';
    final isDraw = widget.result == 'draw';

    final bannerColors = isWin
        ? const [Color(0xFF10B981), Color(0xFF059669)]
        : isDraw
            ? const [Color(0xFF3B82F6), Color(0xFF1D4ED8)]
            : const [Color(0xFFF59E0B), Color(0xFFD97706)];

    final titleText = isWin
        ? 'G‘alaba! 🏆'
        : isDraw
            ? 'Durang! 🤝'
            : 'Yaxshi natija! 👏';

    final canReplay = widget.isPro || widget.remainingPlays > 0;

    return PopScope(
      canPop: false,
      child: Stack(
        alignment: Alignment.center,
        children: [
          Dialog(
            backgroundColor: Colors.transparent,
            insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 14, sigmaY: 14),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 380),
                child: Container(
                  decoration: BoxDecoration(
                    color: colors.card,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: colors.border, width: 1.5),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: colors.isDark ? 0.35 : 0.15),
                        blurRadius: 32,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Top Celebration Banner
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: bannerColors,
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(22)),
                      ),
                      child: Column(
                        children: [
                          Icon(
                            isWin
                                ? Icons.emoji_events_rounded
                                : isDraw
                                    ? Icons.handshake_rounded
                                    : Icons.military_tech_rounded,
                            size: 56,
                            color: const Color(0xFFFFD700),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            titleText,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 22,
                              fontWeight: FontWeight.w900,
                              letterSpacing: -0.3,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            widget.gameTitle,
                            style: TextStyle(
                              color: Colors.white.withValues(alpha: 0.9),
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),

                    Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        children: [
                          // Coin & XP Rewards Card
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF59E0B).withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: const Color(0xFFF59E0B).withValues(alpha: 0.35),
                                width: 1.2,
                              ),
                            ),
                            child: FittedBox(
                              fit: BoxFit.scaleDown,
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.spaceAround,
                                children: [
                                  Row(
                                    children: [
                                      const Icon(Icons.monetization_on_rounded,
                                          color: Color(0xFFFFD700), size: 28),
                                      const SizedBox(width: 8),
                                      Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            '+${widget.coinsEarned}',
                                            style: const TextStyle(
                                              fontSize: 20,
                                              fontWeight: FontWeight.w900,
                                              color: Color(0xFFD97706),
                                            ),
                                          ),
                                          const Text(
                                            'Oltin tanga',
                                            style: TextStyle(
                                              fontSize: 11,
                                              fontWeight: FontWeight.w700,
                                              color: Color(0xFFB45309),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                  const SizedBox(width: 16),
                                  Container(
                                    width: 1,
                                    height: 36,
                                    color: const Color(0xFFF59E0B).withValues(alpha: 0.3),
                                  ),
                                  const SizedBox(width: 16),
                                  Row(
                                    children: [
                                      const Icon(Icons.bolt_rounded,
                                          color: Color(0xFF8B5CF6), size: 28),
                                      const SizedBox(width: 8),
                                      Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            '+${widget.xpEarned}',
                                            style: const TextStyle(
                                              fontSize: 20,
                                              fontWeight: FontWeight.w900,
                                              color: Color(0xFF7C3AED),
                                            ),
                                          ),
                                          const Text(
                                            'Tajriba (XP)',
                                            style: TextStyle(
                                              fontSize: 11,
                                              fontWeight: FontWeight.w700,
                                              color: Color(0xFF6D28D9),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),

                          // Match Statistics Rows
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                            decoration: BoxDecoration(
                              color: colors.bg,
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(color: colors.border),
                            ),
                            child: Column(
                              children: widget.stats.map((s) {
                                return Padding(
                                  padding: const EdgeInsets.symmetric(vertical: 4),
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        s['label'] ?? '',
                                        style: TextStyle(
                                          fontSize: 12.5,
                                          fontWeight: FontWeight.w600,
                                          color: colors.muted,
                                        ),
                                      ),
                                      Text(
                                        s['value'] ?? '',
                                        style: TextStyle(
                                          fontSize: 13.5,
                                          fontWeight: FontWeight.w800,
                                          color: colors.ink,
                                        ),
                                      ),
                                    ],
                                  ),
                                );
                              }).toList(),
                            ),
                          ),
                          const SizedBox(height: 14),

                          // Daily Limit Indicator
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                            decoration: BoxDecoration(
                              color: canReplay
                                  ? const Color(0xFF10B981).withValues(alpha: 0.1)
                                  : const Color(0xFFEF4444).withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: FittedBox(
                              fit: BoxFit.scaleDown,
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    canReplay
                                        ? (widget.isPro ? Icons.all_inclusive_rounded : Icons.check_circle_outline_rounded)
                                        : Icons.lock_outline_rounded,
                                    size: 15,
                                    color: canReplay ? const Color(0xFF059669) : const Color(0xFFDC2626),
                                  ),
                                  const SizedBox(width: 6),
                                  Text(
                                    widget.isPro
                                        ? 'Pro obuna: Cheksiz o‘yinlar'
                                        : canReplay
                                            ? 'Bugun qolgan urinish: ${widget.remainingPlays}/1'
                                            : 'Bugungi bepul urinish tugadi (0/1)',
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w700,
                                      color: canReplay ? const Color(0xFF059669) : const Color(0xFFDC2626),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 18),

                          // Action Buttons
                          Row(
                            children: [
                              Expanded(
                                child: OutlinedButton(
                                  onPressed: widget.onGoHome,
                                  style: OutlinedButton.styleFrom(
                                    padding: const EdgeInsets.symmetric(vertical: 13),
                                    side: BorderSide(color: colors.border),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(14),
                                    ),
                                  ),
                                  child: FittedBox(
                                    fit: BoxFit.scaleDown,
                                    child: Text(
                                      'Chiqish',
                                      style: TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w700,
                                        color: colors.muted,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                flex: 2,
                                child: ElevatedButton(
                                  onPressed: canReplay
                                      ? widget.onPlayAgain
                                      : () {
                                          Navigator.of(context).pop();
                                          context.push('/kids/pro');
                                        },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: canReplay
                                        ? const Color(0xFF8B5CF6)
                                        : const Color(0xFFD97706),
                                    padding: const EdgeInsets.symmetric(vertical: 13),
                                    elevation: 3,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(14),
                                    ),
                                  ),
                                  child: FittedBox(
                                    fit: BoxFit.scaleDown,
                                    child: Row(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Icon(
                                          canReplay
                                              ? Icons.replay_rounded
                                              : Icons.stars_rounded,
                                          color: Colors.white,
                                          size: 19,
                                        ),
                                        const SizedBox(width: 6),
                                        Text(
                                          canReplay
                                              ? 'Qayta o‘ynash'
                                              : 'Pro bilan cheksiz',
                                          style: const TextStyle(
                                            color: Colors.white,
                                            fontSize: 14,
                                            fontWeight: FontWeight.w900,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),

          // Flying Coins Overlay celebration
          if (_showFlyingCoins)
            Positioned.fill(
              child: FlyingCoinsOverlay(
                coinCount: widget.coinsEarned.clamp(8, 16),
                onComplete: () {
                  if (mounted) setState(() => _showFlyingCoins = false);
                },
              ),
            ),
        ],
      ),
    );
  }
}
