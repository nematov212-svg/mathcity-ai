import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

class XPBar extends StatelessWidget {
  final int currentXP;
  final int level;
  final bool isDark;

  const XPBar({
    super.key,
    required this.currentXP,
    required this.level,
    this.isDark = false,
  });

  @override
  Widget build(BuildContext context) {
    final int levelBaseXP = (level - 1) * 200;
    final int progressXP = currentXP - levelBaseXP;
    final double percent = (progressXP / 200.0).clamp(0.0, 1.0);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: isDark ? AppColors.teenSurfaceElevated : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? AppColors.teenBorder : AppColors.kidsBorder,
          width: 1.2,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '$level-daraja',
                style: TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 13,
                  color: isDark ? AppColors.teenPrimaryLime : AppColors.kidsPrimary,
                ),
              ),
              Text(
                '$currentXP XP',
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 12,
                  color: isDark ? AppColors.teenMutedText : AppColors.kidsSecondaryText,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Container(
              height: 8,
              width: 130,
              color: isDark ? const Color(0xFF232D42) : const Color(0xFFE8EBFA),
              child: FractionallySizedBox(
                alignment: Alignment.centerLeft,
                widthFactor: percent,
                child: Container(
                  decoration: BoxDecoration(
                    gradient: isDark
                        ? AppColors.teenLimeGradient
                        : AppColors.kidsPrimaryGradient,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
