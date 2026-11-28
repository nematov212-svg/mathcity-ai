import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/widgets/coin_badge.dart';
import '../models/store_item.dart';
import '../widgets/house_build_colors.dart';
import '../widgets/purchase_confirm_dialog.dart';
import '../widgets/store_category_tabs.dart';
import '../widgets/store_item_card.dart';
import '../widgets/store_item_detail_sheet.dart';

/// Construction Store Sheet & Dialog
/// Mobile: Bottom sheet (~85% height, top radius 28, drag handle)
/// Tablet/Web: Centered dialog (maxWidth: 560px)
class StoreSheet extends StatefulWidget {
  final int userCoins;
  final int currentStage;
  final Set<String> ownedItemIds;
  final Set<String> placedItemIds;
  final Function(StoreItem item) onPurchaseItem;
  final Function(StoreItem item) onTogglePlacement;

  const StoreSheet({
    super.key,
    required this.userCoins,
    required this.currentStage,
    required this.ownedItemIds,
    required this.placedItemIds,
    required this.onPurchaseItem,
    required this.onTogglePlacement,
  });

  static Future<void> show(
    BuildContext context, {
    required int userCoins,
    required int currentStage,
    required Set<String> ownedItemIds,
    required Set<String> placedItemIds,
    required Function(StoreItem item) onPurchaseItem,
    required Function(StoreItem item) onTogglePlacement,
  }) {
    final isDesktop = MediaQuery.of(context).size.width >= 600;

    if (isDesktop) {
      return showDialog(
        context: context,
        barrierColor: Colors.black54,
        builder: (ctx) => Dialog(
          backgroundColor: Colors.transparent,
          insetPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
          child: Container(
            constraints: const BoxConstraints(maxWidth: 560, maxHeight: 720),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(28),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(28),
              child: StoreSheet(
                userCoins: userCoins,
                currentStage: currentStage,
                ownedItemIds: ownedItemIds,
                placedItemIds: placedItemIds,
                onPurchaseItem: onPurchaseItem,
                onTogglePlacement: onTogglePlacement,
              ),
            ),
          ),
        ),
      );
    }

    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => FractionallySizedBox(
        heightFactor: 0.85,
        child: StoreSheet(
          userCoins: userCoins,
          currentStage: currentStage,
          ownedItemIds: ownedItemIds,
          placedItemIds: placedItemIds,
          onPurchaseItem: onPurchaseItem,
          onTogglePlacement: onTogglePlacement,
        ),
      ),
    );
  }

  @override
  State<StoreSheet> createState() => _StoreSheetState();
}

class _StoreSheetState extends State<StoreSheet> {
  StoreCategory _selectedCategory = StoreCategory.all;
  bool _isPurchasing = false;

  List<StoreItem> get _filteredItems {
    return kDefaultStoreCatalog.map((item) {
      final isOwned = widget.ownedItemIds.contains(item.id);
      final isPlaced = widget.placedItemIds.contains(item.id);
      return item.copyWith(isOwned: isOwned, isPlaced: isPlaced);
    }).where((item) {
      if (_selectedCategory == StoreCategory.all) return true;
      return item.category == _selectedCategory;
    }).toList();
  }

  Future<void> _handleBuy(StoreItem item) async {
    if (_isPurchasing) return;
    if (widget.userCoins < item.price) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Coin yetmaydi! Yana ${item.price - widget.userCoins} coin kerak.',
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          backgroundColor: const Color(0xFFDC2626),
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    final confirmed = await PurchaseConfirmDialog.show(context, item);
    if (confirmed == true && mounted) {
      setState(() => _isPurchasing = true);
      try {
        widget.onPurchaseItem(item);
      } finally {
        if (mounted) {
          setState(() => _isPurchasing = false);
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = HouseBuildColors.of(context);
    final width = MediaQuery.of(context).size.width;
    final crossAxisCount = width >= 720 ? 4 : (width >= 480 ? 3 : 2);

    return Container(
      decoration: BoxDecoration(
        color: colors.cardBackground,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
        border: Border.all(color: colors.border, width: 1.2),
        boxShadow: colors.cardShadow,
      ),
      child: Column(
        children: [
          // Drag handle
          Center(
            child: Container(
              margin: const EdgeInsets.only(top: 10, bottom: 8),
              width: 38,
              height: 4,
              decoration: BoxDecoration(
                color: colors.textMuted.withValues(alpha: 0.3),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),

          // 1. Sarlavha qatori: "Qurilish do‘koni" | Coin kapsulasi | Yopish
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    'Qurilish do‘koni',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                      color: colors.textPrimary,
                      letterSpacing: -0.3,
                    ),
                  ),
                ),

                // Animated Coin balance capsule
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: colors.cardBackgroundSecondary,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: colors.border),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const CoinIcon(size: 16),
                      const SizedBox(width: 5),
                      AnimatedSwitcher(
                        duration: const Duration(milliseconds: 300),
                        transitionBuilder: (child, anim) =>
                            ScaleTransition(scale: anim, child: child),
                        child: Text(
                          '${widget.userCoins}',
                          key: ValueKey<int>(widget.userCoins),
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w900,
                            color: colors.gold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(width: 8),

                // Close button
                IconButton(
                  icon: const Icon(Icons.close_rounded, size: 20),
                  onPressed: () => Navigator.of(context).pop(),
                  color: colors.textMuted,
                  visualDensity: VisualDensity.compact,
                ),
              ],
            ),
          ),

          const SizedBox(height: 6),

          // 2. Kategoriya tablari (gorizontal, pill)
          StoreCategoryTabs(
            selectedCategory: _selectedCategory,
            onSelectCategory: (cat) {
              setState(() => _selectedCategory = cat);
            },
          ),

          const SizedBox(height: 12),

          // 3. Mahsulotlar to‘ri
          Expanded(
            child: _filteredItems.isEmpty
                ? Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.inventory_2_outlined,
                            size: 48, color: colors.textMuted),
                        const SizedBox(height: 8),
                        Text(
                          'Bu kategoriyada buyumlar tez orada qo‘shiladi',
                          style: TextStyle(
                            fontSize: 13,
                            color: colors.textMuted,
                          ),
                        ),
                      ],
                    ),
                  )
                : GridView.builder(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 4),
                    physics: const BouncingScrollPhysics(),
                    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: crossAxisCount,
                      crossAxisSpacing: 10,
                      mainAxisSpacing: 10,
                      childAspectRatio: 0.68,
                    ),
                    itemCount: _filteredItems.length,
                    itemBuilder: (context, index) {
                      final item = _filteredItems[index];
                      return StoreItemCard(
                        item: item,
                        userCoins: widget.userCoins,
                        currentStage: widget.currentStage,
                        onTap: () {
                          StoreItemDetailSheet.show(
                            context,
                            item: item,
                            userCoins: widget.userCoins,
                            currentStage: widget.currentStage,
                            onBuy: () => _handleBuy(item),
                            onTogglePlacement: () =>
                                widget.onTogglePlacement(item),
                          );
                        },
                        onBuy: () => _handleBuy(item),
                      );
                    },
                  ),
          ),

          // 4. Pastki sticky qator: "Misol yechib coin top"
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: colors.cardBackground,
              border: Border(top: BorderSide(color: colors.border)),
            ),
            child: SafeArea(
              top: false,
              child: Row(
                children: [
                  Icon(Icons.auto_awesome_rounded,
                      size: 18, color: colors.primary),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Ko‘proq tanga kerakmi?',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: colors.textSecondary,
                      ),
                    ),
                  ),
                  Flexible(
                    child: FittedBox(
                      fit: BoxFit.scaleDown,
                      child: TextButton(
                        onPressed: () {
                          Navigator.of(context).pop();
                          context.push('/kids/exercise');
                        },
                        style: TextButton.styleFrom(
                          foregroundColor: colors.primary,
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 6),
                        ),
                        child: const Text(
                          'Misol yechib coin top →',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
