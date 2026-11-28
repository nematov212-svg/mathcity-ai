import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'house_build_colors.dart';

const List<int> kHouseStageCosts = [50, 120, 100, 70, 90, 150];

const List<String> kHouseStageTargetTitles = [
  'Poydevor',
  'Devorlar',
  'Tom',
  'Eshik va derazalar',
  'Ichki bezak',
  'Hovli va mashina',
];

/// Bottom action bar containing:
/// 1. Big primary "Qurish • 120 coin" button with insufficient coins state & "Misol yechib coin top" link
/// 2. "Do‘kon" button (store icon)
class HouseBottomBar extends StatefulWidget {
  final int currentStage;
  final int userCoins;
  final bool isBuilding;
  final VoidCallback onBuildNextStage;
  final VoidCallback onOpenStore;

  const HouseBottomBar({
    super.key,
    required this.currentStage,
    required this.userCoins,
    required this.isBuilding,
    required this.onBuildNextStage,
    required this.onOpenStore,
  });

  @override
  State<HouseBottomBar> createState() => _HouseBottomBarState();
}

class _HouseBottomBarState extends State<HouseBottomBar>
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
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.97).animate(
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
    final colors = HouseBuildColors.of(context);
    final isFullyBuilt = widget.currentStage >= 6;
    final int nextCost =
        !isFullyBuilt ? kHouseStageCosts[widget.currentStage] : 0;
    final bool canAfford = widget.userCoins >= nextCost;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          children: [
            // 1. Big Primary "Qurish" Button
            Expanded(
              child: AnimatedBuilder(
                animation: _scaleAnimation,
                builder: (context, child) => Transform.scale(
                  scale: _scaleAnimation.value,
                  child: child,
                ),
                child: GestureDetector(
                  onTapDown: (_) => _scaleController.forward(),
                  onTapUp: (_) => _scaleController.reverse(),
                  onTapCancel: () => _scaleController.reverse(),
                  onTap: () {
                    HapticFeedback.heavyImpact();
                    widget.onBuildNextStage();
                  },
                  child: Container(
                    height: 52,
                    decoration: BoxDecoration(
                      gradient: isFullyBuilt
                          ? const LinearGradient(
                              colors: [Color(0xFFF59E0B), Color(0xFFD97706)],
                            )
                          : (!canAfford
                              ? LinearGradient(
                                  colors: [
                                    colors.primary.withValues(alpha: 0.6),
                                    colors.primaryDark.withValues(alpha: 0.6),
                                  ],
                                )
                              : colors.primaryGradient),
                      borderRadius: BorderRadius.circular(18),
                      boxShadow: canAfford && !isFullyBuilt
                          ? [
                              BoxShadow(
                                color: colors.primary.withValues(alpha: 0.35),
                                blurRadius: 12,
                                offset: const Offset(0, 4),
                              ),
                            ]
                          : null,
                    ),
                    child: Center(
                      child: widget.isBuilding
                          ? const SizedBox(
                              width: 22,
                              height: 22,
                              child: CircularProgressIndicator(
                                strokeWidth: 2.5,
                                valueColor:
                                    AlwaysStoppedAnimation<Color>(Colors.white),
                              ),
                            )
                          : Padding(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 10),
                              child: FittedBox(
                                fit: BoxFit.scaleDown,
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(
                                      isFullyBuilt
                                          ? Icons.emoji_events_rounded
                                          : Icons.construction_rounded,
                                      color: Colors.white,
                                      size: 20,
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      isFullyBuilt
                                          ? 'Uy to‘liq qurildi! 🏆'
                                          : (!canAfford
                                              ? 'Coin yetmaydi • $nextCost coin'
                                              : 'Qurish • $nextCost coin'),
                                      style: const TextStyle(
                                        fontSize: 15,
                                        fontWeight: FontWeight.w900,
                                        color: Colors.white,
                                        letterSpacing: -0.2,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                    ),
                  ),
                ),
              ),
            ),

            const SizedBox(width: 10),

            // 2. "Do‘kon" Button
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: colors.cardBackground,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: colors.border, width: 1.2),
                boxShadow: colors.cardShadow,
              ),
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  borderRadius: BorderRadius.circular(18),
                  onTap: () {
                    HapticFeedback.lightImpact();
                    widget.onOpenStore();
                  },
                  child: Center(
                    child: Icon(
                      Icons.storefront_rounded,
                      color: colors.primary,
                      size: 24,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),

        // Insufficient coin prompt & exercise link
        if (!canAfford && !isFullyBuilt) ...[
          const SizedBox(height: 6),
          InkWell(
            onTap: () => context.push('/kids/exercise'),
            borderRadius: BorderRadius.circular(10),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.bolt_rounded, size: 14, color: colors.gold),
                  const SizedBox(width: 4),
                  Text(
                    'Misol yechib coin top →',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      color: colors.primary,
                      decoration: TextDecoration.underline,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ],
    );
  }
}
