import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'game_colors.dart';

/// Card used in the wizard steps (Time, Operations, Number range)
class OptionCard extends StatelessWidget {
  final String title;
  final String? subtitle;
  final IconData? icon;
  final Widget? leading;
  final bool isSelected;
  final VoidCallback onTap;
  final bool isFullWidth;

  const OptionCard({
    super.key,
    required this.title,
    this.subtitle,
    this.icon,
    this.leading,
    required this.isSelected,
    required this.onTap,
    this.isFullWidth = false,
  });

  @override
  Widget build(BuildContext context) {
    final colors = GameColors.of(context);

    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      curve: Curves.easeInOut,
      decoration: BoxDecoration(
        color: isSelected ? colors.blueTeamBg : colors.cardBackground,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: isSelected ? colors.primaryBlue : colors.border,
          width: isSelected ? 2.0 : 1.2,
        ),
        boxShadow: isSelected ? colors.buttonShadow : colors.cardShadow,
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(18),
          onTap: () {
            HapticFeedback.selectionClick();
            onTap();
          },
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            child: Row(
              children: [
                // Icon / Leading Box
                if (leading != null)
                  leading!
                else if (icon != null)
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: isSelected
                          ? colors.primaryBlue
                          : colors.cardSecondary,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Center(
                      child: Icon(
                        icon,
                        size: 20,
                        color: isSelected ? Colors.white : colors.primaryBlue,
                      ),
                    ),
                  ),

                if (leading != null || icon != null) const SizedBox(width: 12),

                // Title and Subtitle
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        title,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight:
                              isSelected ? FontWeight.w800 : FontWeight.w700,
                          color: isSelected
                              ? colors.primaryBlue
                              : colors.textPrimary,
                        ),
                      ),
                      if (subtitle != null && subtitle!.isNotEmpty) ...[
                        const SizedBox(height: 2),
                        Text(
                          subtitle!,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w500,
                            color: colors.textSecondary,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),

                const SizedBox(width: 8),

                // Check circle
                AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  width: 22,
                  height: 22,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: isSelected ? colors.primaryBlue : Colors.transparent,
                    border: Border.all(
                      color: isSelected ? colors.primaryBlue : colors.border,
                      width: 1.5,
                    ),
                  ),
                  child: isSelected
                      ? const Center(
                          child: Icon(Icons.check_rounded,
                              size: 14, color: Colors.white),
                        )
                      : null,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
