import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/widgets/coin_badge.dart';
import '../models/store_item.dart';
import 'house_build_colors.dart';

/// Bottom sheet showing full details for a store item:
/// Large view, name, full description, price, "Sotib olish" and (if owned) "Uyga qo‘yish / Olib tashlash".
class StoreItemDetailSheet extends StatelessWidget {
  final StoreItem item;
  final int userCoins;
  final int currentStage;
  final VoidCallback onBuy;
  final VoidCallback onTogglePlacement;

  const StoreItemDetailSheet({
    super.key,
    required this.item,
    required this.userCoins,
    required this.currentStage,
    required this.onBuy,
    required this.onTogglePlacement,
  });

  static void show(
    BuildContext context, {
    required StoreItem item,
    required int userCoins,
    required int currentStage,
    required VoidCallback onBuy,
    required VoidCallback onTogglePlacement,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StoreItemDetailSheet(
        item: item,
        userCoins: userCoins,
        currentStage: currentStage,
        onBuy: onBuy,
        onTogglePlacement: onTogglePlacement,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = HouseBuildColors.of(context);
    final isLocked = item.unlockStage > currentStage;
    final canAfford = userCoins >= item.price;

    return Container(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
      decoration: BoxDecoration(
        color: colors.cardBackground,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
        border: Border.all(color: colors.border, width: 1.2),
        boxShadow: colors.cardShadow,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Drag handle
          Center(
            child: Container(
              width: 38,
              height: 4,
              decoration: BoxDecoration(
                color: colors.textMuted.withValues(alpha: 0.3),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),

          const SizedBox(height: 16),

          // Large Visual Box
          Container(
            height: 120,
            width: double.infinity,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  item.accentColor.withValues(alpha: 0.22),
                  item.accentColor.withValues(alpha: 0.08),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Center(
              child: Icon(item.icon, size: 56, color: item.accentColor),
            ),
          ),

          const SizedBox(height: 16),

          // Title & Category
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  item.name,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                    color: colors.textPrimary,
                    letterSpacing: -0.3,
                  ),
                ),
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: colors.primary.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  item.category.title,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    color: colors.primary,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 8),

          // Description
          Text(
            item.description,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: colors.textSecondary,
              height: 1.4,
            ),
          ),

          const SizedBox(height: 14),

          // Stage Info & Price row
          Row(
            children: [
              // Price Capsule
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: colors.gold.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: colors.gold.withValues(alpha: 0.3),
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const CoinIcon(size: 16),
                    const SizedBox(width: 6),
                    Text(
                      '${item.price} coin',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w900,
                        color: colors.gold,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(width: 10),

              // Unlock Stage Pill
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: colors.cardBackgroundSecondary,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: colors.border),
                ),
                child: Text(
                  '${item.unlockStage}-bosqich',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: colors.textMuted,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 20),

          // Action Button
          SizedBox(
            width: double.infinity,
            height: 48,
            child: _buildActionButton(context, colors, isLocked, canAfford),
          ),
        ],
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
      return ElevatedButton.icon(
        onPressed: () {
          HapticFeedback.lightImpact();
          Navigator.of(context).pop();
          onTogglePlacement();
        },
        icon: Icon(
          item.isPlaced ? Icons.remove_circle_outline : Icons.add_task_rounded,
          size: 18,
        ),
        label: Text(
          item.isPlaced ? 'Uydan olib tashlash' : 'Uyga qo‘yish',
          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
        ),
        style: ElevatedButton.styleFrom(
          backgroundColor: item.isPlaced ? colors.textMuted : colors.primary,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        ),
      );
    }

    if (isLocked) {
      return Container(
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: colors.borderSubtle,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Text(
          'Ushbu buyum ${item.unlockStage}-bosqichda ochiladi',
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w700,
            color: colors.textMuted,
          ),
        ),
      );
    }

    if (!canAfford) {
      return Container(
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: Colors.red.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Text(
          'Coin yetmaydi (yana ${item.price - userCoins} coin kerak)',
          style: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w800,
            color: Color(0xFFDC2626),
          ),
        ),
      );
    }

    return ElevatedButton.icon(
      onPressed: () {
        HapticFeedback.mediumImpact();
        Navigator.of(context).pop();
        onBuy();
      },
      icon: const Icon(Icons.shopping_bag_rounded, size: 18),
      label: Text(
        'Sotib olish (${item.price} coin)',
        style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
      ),
      style: ElevatedButton.styleFrom(
        backgroundColor: colors.primary,
        foregroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
    );
  }
}
