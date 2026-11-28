import 'package:flutter/material.dart';
import '../../../core/widgets/coin_badge.dart';
import '../../../core/widgets/xp_coin.dart';
import 'house_build_colors.dart';

/// Top bar with circular back button (44x44), screen title "Uy qurish", and compact XP & Coin capsule.
class HouseBuildTopBar extends StatelessWidget {
  final VoidCallback onBack;
  final int coins;
  final int xp;
  final String title;

  const HouseBuildTopBar({
    super.key,
    required this.onBack,
    required this.coins,
    required this.xp,
    this.title = 'Uy qurish',
  });

  @override
  Widget build(BuildContext context) {
    final colors = HouseBuildColors.of(context);

    return SizedBox(
      height: 48,
      child: Row(
        children: [
          // 1. Circular Back Button (44x44)
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: colors.cardBackground,
              shape: BoxShape.circle,
              border: Border.all(color: colors.border, width: 1.2),
              boxShadow: colors.cardShadow,
            ),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                borderRadius: BorderRadius.circular(22),
                onTap: onBack,
                child: Center(
                  child: Icon(
                    Icons.arrow_back_ios_new_rounded,
                    size: 18,
                    color: colors.textPrimary,
                  ),
                ),
              ),
            ),
          ),

          const SizedBox(width: 10),

          // 2. Screen Title
          Expanded(
            child: Text(
              title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: colors.textPrimary,
                letterSpacing: -0.3,
              ),
            ),
          ),

          const SizedBox(width: 8),

          // 3. Compact XP and Coin Capsule (Single row)
          Container(
            height: 38,
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: colors.cardBackground,
              borderRadius: BorderRadius.circular(19),
              border: Border.all(color: colors.border, width: 1.2),
              boxShadow: colors.cardShadow,
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Coin Section
                const CoinIcon(size: 18),
                const SizedBox(width: 5),
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  transitionBuilder: (child, anim) =>
                      ScaleTransition(scale: anim, child: child),
                  child: Text(
                    '$coins',
                    key: ValueKey<int>(coins),
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w800,
                      color: colors.gold,
                    ),
                  ),
                ),

                // Separator
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 8),
                  width: 1,
                  height: 16,
                  color: colors.border,
                ),

                // XP Section
                const XpCoin(size: 18),
                const SizedBox(width: 5),
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  transitionBuilder: (child, anim) =>
                      ScaleTransition(scale: anim, child: child),
                  child: Text(
                    '$xp',
                    key: ValueKey<int>(xp),
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w800,
                      color: colors.primary,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
