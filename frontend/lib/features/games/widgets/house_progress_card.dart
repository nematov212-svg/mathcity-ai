import 'package:flutter/material.dart';
import 'house_build_colors.dart';

const List<String> kHouseStageNames = [
  'Poydevor qo‘yish',
  'Devorlar va oraliqlar',
  'Mustahkam tom qismi',
  'Yorug‘ derazalar',
  'Asosiy kirish eshigi',
  'Mashina va obod hovli',
];

/// Progress card displaying house icon, "Uy qurish" title, "X/6 bosqich" badge,
/// current stage name, and an animated gradient rounded progress bar.
class HouseProgressCard extends StatelessWidget {
  final int currentStage;
  final int maxStages;

  const HouseProgressCard({
    super.key,
    required this.currentStage,
    this.maxStages = 6,
  });

  @override
  Widget build(BuildContext context) {
    final colors = HouseBuildColors.of(context);
    final clampedStage = currentStage.clamp(0, maxStages);
    final double targetProgress = clampedStage / maxStages.toDouble();

    final String stageName;
    if (clampedStage == 0) {
      stageName = '1-bosqich: Poydevor qo‘yish';
    } else if (clampedStage >= maxStages) {
      stageName = 'Usta Quruvchi: Uy to‘liq tayyor! 🎉';
    } else {
      stageName = '${clampedStage + 1}-bosqich: ${kHouseStageNames[clampedStage]}';
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: colors.cardBackground,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: colors.border, width: 1.2),
        boxShadow: colors.cardShadow,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              // House Icon in a glowing pill/box
              Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  gradient: colors.primaryGradient,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: colors.primary.withValues(alpha: 0.3),
                      blurRadius: 8,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.home_work_rounded,
                  color: Colors.white,
                  size: 20,
                ),
              ),

              const SizedBox(width: 10),

              // Title and Stage subtitle
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Flexible(
                          child: Text(
                            'Uy qurish',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w800,
                              color: colors.textPrimary,
                              letterSpacing: -0.2,
                            ),
                          ),
                        ),
                        const SizedBox(width: 6),
                        // 0/6 bosqich Badge
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: colors.primary.withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(
                              color: colors.primary.withValues(alpha: 0.3),
                              width: 1,
                            ),
                          ),
                          child: Text(
                            '$clampedStage/$maxStages bosqich',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              color: colors.primary,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 3),
                    Text(
                      stageName,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: clampedStage >= maxStages
                            ? colors.success
                            : colors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 10),

          // Animated Gradient Rounded Progress Bar
          TweenAnimationBuilder<double>(
            tween: Tween<double>(begin: 0.0, end: targetProgress),
            duration: const Duration(milliseconds: 600),
            curve: Curves.easeOutCubic,
            builder: (context, value, child) {
              return Stack(
                children: [
                  // Track
                  Container(
                    height: 8,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: colors.borderSubtle,
                      borderRadius: BorderRadius.circular(6),
                    ),
                  ),
                  // Animated Fill
                  FractionallySizedBox(
                    widthFactor: value.clamp(0.0, 1.0),
                    child: Container(
                      height: 8,
                      decoration: BoxDecoration(
                        gradient: colors.progressGradient,
                        borderRadius: BorderRadius.circular(6),
                        boxShadow: [
                          BoxShadow(
                            color: colors.primary.withValues(alpha: 0.35),
                            blurRadius: 6,
                            offset: const Offset(0, 1),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}
