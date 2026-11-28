import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'house_build_colors.dart';

enum HouseStageStatus {
  completed,
  inProgress,
  locked,
}

class HouseStageInfo {
  final int stageNumber;
  final String title;
  final String subtitle;
  final IconData icon;
  final String emoji;
  final String categoryKey;

  const HouseStageInfo({
    required this.stageNumber,
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.emoji,
    required this.categoryKey,
  });
}

const List<HouseStageInfo> kHouseStagesData = [
  HouseStageInfo(
    stageNumber: 1,
    title: 'Poydevor',
    subtitle: 'Mustahkam asos',
    icon: Icons.foundation_rounded,
    emoji: '🧱',
    categoryKey: 'foundation',
  ),
  HouseStageInfo(
    stageNumber: 2,
    title: 'Devorlar',
    subtitle: 'Asosiy xonalar',
    icon: Icons.cottage_rounded,
    emoji: '🏠',
    categoryKey: 'walls',
  ),
  HouseStageInfo(
    stageNumber: 3,
    title: 'Tom',
    subtitle: 'Zamonaviy qoplama',
    icon: Icons.roofing_rounded,
    emoji: '⛺',
    categoryKey: 'roof',
  ),
  HouseStageInfo(
    stageNumber: 4,
    title: 'Derazalar',
    subtitle: 'Keng panorama',
    icon: Icons.window_rounded,
    emoji: '🪟',
    categoryKey: 'windows',
  ),
  HouseStageInfo(
    stageNumber: 5,
    title: 'Eshiklar',
    subtitle: 'Kirish qismi',
    icon: Icons.door_front_door_rounded,
    emoji: '🚪',
    categoryKey: 'doors',
  ),
  HouseStageInfo(
    stageNumber: 6,
    title: 'Mashina va hovli',
    subtitle: 'Obodonlashtirish',
    icon: Icons.directions_car_rounded,
    emoji: '🚗',
    categoryKey: 'decor',
  ),
];

/// Card representing a single stage in the 6-stage construction journey.
class HouseStageTile extends StatelessWidget {
  final HouseStageInfo stage;
  final HouseStageStatus status;
  final VoidCallback? onTap;

  const HouseStageTile({
    super.key,
    required this.stage,
    required this.status,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final colors = HouseBuildColors.of(context);

    final bool isCompleted = status == HouseStageStatus.completed;
    final bool isInProgress = status == HouseStageStatus.inProgress;
    final bool isLocked = status == HouseStageStatus.locked;

    // Background & Border styling based on status
    final Color bgColor;
    final Color borderColor;
    final double borderWidth;
    final List<BoxShadow> shadows;

    if (isCompleted) {
      bgColor = colors.cardBackground;
      borderColor = colors.success.withValues(alpha: 0.5);
      borderWidth = 1.2;
      shadows = colors.cardShadow;
    } else if (isInProgress) {
      bgColor = colors.cardBackground;
      borderColor = colors.primary;
      borderWidth = 1.8;
      shadows = colors.glowShadow;
    } else {
      // Locked silhouette style
      bgColor = colors.cardBackground.withValues(alpha: 0.6);
      borderColor = colors.borderSubtle;
      borderWidth = 1.0;
      shadows = const [];
    }

    return AnimatedContainer(
      duration: const Duration(milliseconds: 250),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: borderColor, width: borderWidth),
        boxShadow: shadows,
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: isLocked
              ? null
              : () {
                  HapticFeedback.selectionClick();
                  onTap?.call();
                },
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
            child: Row(
              children: [
                // Icon / Avatar container
                Container(
                  width: 38,
                  height: 38,
                  decoration: BoxDecoration(
                    color: isCompleted
                        ? colors.success.withValues(alpha: 0.15)
                        : isInProgress
                            ? colors.primary.withValues(alpha: 0.18)
                            : colors.silhouette,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Center(
                    child: isLocked
                        ? Icon(
                            stage.icon,
                            size: 20,
                            color: colors.textMuted.withValues(alpha: 0.5),
                          )
                        : Text(
                            stage.emoji,
                            style: const TextStyle(fontSize: 18),
                          ),
                  ),
                ),

                const SizedBox(width: 10),

                // Stage Info
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        '${stage.stageNumber}. ${stage.title}',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: isLocked
                              ? colors.textMuted
                              : colors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        stage.subtitle,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w500,
                          color: isLocked
                              ? colors.textMuted.withValues(alpha: 0.7)
                              : colors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(width: 6),

                // Status Badge
                _buildStatusBadge(colors, isCompleted, isInProgress, isLocked),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStatusBadge(
    HouseBuildColors colors,
    bool isCompleted,
    bool isInProgress,
    bool isLocked,
  ) {
    if (isCompleted) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
        decoration: BoxDecoration(
          color: colors.success.withValues(alpha: 0.15),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: colors.success.withValues(alpha: 0.3)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.check_circle_rounded, size: 13, color: colors.success),
            const SizedBox(width: 3),
            Text(
              'Tayyor',
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w700,
                color: colors.success,
              ),
            ),
          ],
        ),
      );
    } else if (isInProgress) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
        decoration: BoxDecoration(
          color: colors.primary.withValues(alpha: 0.15),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: colors.primary.withValues(alpha: 0.4)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.build_circle_rounded, size: 13, color: colors.primary),
            const SizedBox(width: 3),
            Text(
              'Jarayonda',
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w800,
                color: colors.primary,
              ),
            ),
          ],
        ),
      );
    } else {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
        decoration: BoxDecoration(
          color: colors.borderSubtle,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.lock_outline_rounded,
                size: 12, color: colors.textMuted.withValues(alpha: 0.6)),
            const SizedBox(width: 3),
            Text(
              'Qulflangan',
              style: TextStyle(
                fontSize: 9,
                fontWeight: FontWeight.w600,
                color: colors.textMuted.withValues(alpha: 0.8),
              ),
            ),
          ],
        ),
      );
    }
  }
}
