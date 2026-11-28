import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/widgets/coin_badge.dart';
import '../models/store_item.dart';
import 'house_build_colors.dart';

/// Card displaying an individual store product:
/// 3D illustration / gradient + icon, 1-line name, 2-line description,
/// price with coin icon, and action states (Sotib olish, Coin yetmaydi, Sotib olingan, Qulflangan).
class StoreItemCard extends StatelessWidget {
  final StoreItem item;
  final int userCoins;
  final int currentStage;
  final VoidCallback onTap;
  final VoidCallback onBuy;

  const StoreItemCard({
    super.key,
    required this.item,
    required this.userCoins,
    required this.currentStage,
    required this.onTap,
    required this.onBuy,
  });

  @override
  Widget build(BuildContext context) {
    final colors = HouseBuildColors.of(context);
    final isLocked = item.unlockStage > currentStage;
    final canAfford = userCoins >= item.price;

    return Container(
      decoration: BoxDecoration(
        color: colors.cardBackground,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: item.isOwned
              ? colors.success.withValues(alpha: 0.4)
              : colors.border,
          width: item.isOwned ? 1.4 : 1.2,
        ),
        boxShadow: colors.cardShadow,
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 1. Top Illustration Box with Badge or Lock
                Stack(
                  children: [
                    Container(
                      height: 88,
                      width: double.infinity,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            item.accentColor.withValues(alpha: 0.18),
                            item.accentColor.withValues(alpha: 0.06),
                          ],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Center(
                        child: Icon(
                          item.icon,
                          size: 38,
                          color: isLocked
                              ? colors.textMuted.withValues(alpha: 0.6)
                              : item.accentColor,
                        ),
                      ),
                    ),

                    // Badges (Yangi, Mashhur, etc.)
                    if (item.badge != null && !item.isOwned && !isLocked)
                      Positioned(
                        top: 6,
                        left: 6,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            gradient: colors.primaryGradient,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            item.badge!,
                            style: const TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.w900,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),

                    // Lock Icon overlay
                    if (isLocked)
                      Positioned(
                        top: 6,
                        right: 6,
                        child: Container(
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: Colors.black54,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(
                            Icons.lock_rounded,
                            size: 14,
                            color: Colors.white,
                          ),
                        ),
                      ),

                    // Owned Checkmark overlay
                    if (item.isOwned)
                      Positioned(
                        top: 6,
                        right: 6,
                        child: Container(
                          padding: const EdgeInsets.all(3),
                          decoration: BoxDecoration(
                            color: colors.success,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.check_rounded,
                            size: 13,
                            color: Colors.white,
                          ),
                        ),
                      ),
                  ],
                ),

                const SizedBox(height: 8),

                // 2. Title (1 line)
                Text(
                  item.name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    color: isLocked ? colors.textMuted : colors.textPrimary,
                    letterSpacing: -0.2,
                  ),
                ),

                const SizedBox(height: 3),

                // 3. Description (2 lines max)
                Expanded(
                  child: Text(
                    isLocked
                        ? '${item.unlockStage}-bosqichda ochiladi'
                        : item.description,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                      color: isLocked ? colors.primary : colors.textSecondary,
                      height: 1.25,
                    ),
                  ),
                ),

                const SizedBox(height: 8),

                // 4. Action Row: Price & Buy Button
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Price with coin icon
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const CoinIcon(size: 14),
                        const SizedBox(width: 4),
                        Text(
                          '${item.price}',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w900,
                            color: canAfford ? colors.gold : colors.textMuted,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(width: 4),
                    // Buy / Status Pill Button
                    Flexible(
                      child: FittedBox(
                        fit: BoxFit.scaleDown,
                        alignment: Alignment.centerRight,
                        child: _buildActionButton(
                            context, colors, isLocked, canAfford),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildActionButton(
    BuildContext context,
    HouseBuildColors colors,
    bool isLocked,
    bool canAfford,
  ) {
    if (item.isOwned) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: colors.success.withValues(alpha: 0.12),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: colors.success, width: 1),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.check_rounded, size: 12, color: colors.success),
            const SizedBox(width: 3),
            Text(
              'Olingan',
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w800,
                color: colors.success,
              ),
            ),
          ],
        ),
      );
    }

    if (isLocked) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: colors.borderSubtle,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Text(
          'Qulflangan',
          style: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w700,
            color: colors.textMuted,
          ),
        ),
      );
    }

    if (!canAfford) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: Colors.red.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(10),
        ),
        child: const Text(
          'Yetmaydi',
          style: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w800,
            color: Color(0xFFDC2626),
          ),
        ),
      );
    }

    return SizedBox(
      height: 28,
      child: ElevatedButton(
        onPressed: () {
          HapticFeedback.lightImpact();
          onBuy();
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: colors.primary,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 10),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
        child: const Text(
          'Olish',
          style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}
