import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'house_build_colors.dart';

/// Horizontal scrollable single row of mode action chips:
/// Kun/Tun, Markaz, Ichki/Tashqi, Ovozli/Ovozsiz.
/// Selected chip is filled with primary color; unselected is outlined.
class HouseModeChips extends StatelessWidget {
  final bool isNightMode;
  final bool isInteriorMode;
  final bool isMuted;
  final VoidCallback onToggleNightMode;
  final VoidCallback onResetCamera;
  final VoidCallback onToggleInteriorMode;
  final VoidCallback onToggleMute;

  const HouseModeChips({
    super.key,
    required this.isNightMode,
    required this.isInteriorMode,
    required this.isMuted,
    required this.onToggleNightMode,
    required this.onResetCamera,
    required this.onToggleInteriorMode,
    required this.onToggleMute,
  });

  @override
  Widget build(BuildContext context) {
    final colors = HouseBuildColors.of(context);

    return SizedBox(
      height: 38,
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        child: Row(
          children: [
            // 1. Kun / Tun Chip
            _ModeChip(
              icon: isNightMode
                  ? Icons.nightlight_round
                  : Icons.wb_sunny_rounded,
              label: isNightMode ? 'Tun' : 'Kun',
              isSelected: isNightMode,
              colors: colors,
              onTap: () {
                HapticFeedback.selectionClick();
                onToggleNightMode();
              },
            ),

            const SizedBox(width: 8),

            // 2. Markaz Chip
            _ModeChip(
              icon: Icons.center_focus_strong_rounded,
              label: 'Markaz',
              isSelected: false,
              colors: colors,
              onTap: () {
                HapticFeedback.lightImpact();
                onResetCamera();
              },
            ),

            const SizedBox(width: 8),

            // 3. Ichki / Tashqi Chip
            _ModeChip(
              icon: Icons.meeting_room_rounded,
              label: isInteriorMode ? 'Tashqi' : 'Ichki',
              isSelected: isInteriorMode,
              colors: colors,
              onTap: () {
                HapticFeedback.selectionClick();
                onToggleInteriorMode();
              },
            ),

            const SizedBox(width: 8),

            // 4. Ovozli / Ovozsiz Chip
            _ModeChip(
              icon: isMuted
                  ? Icons.volume_off_rounded
                  : Icons.volume_up_rounded,
              label: isMuted ? 'Ovozsiz' : 'Ovozli',
              isSelected: !isMuted,
              colors: colors,
              onTap: () {
                HapticFeedback.selectionClick();
                onToggleMute();
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _ModeChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isSelected;
  final HouseBuildColors colors;
  final VoidCallback onTap;

  const _ModeChip({
    required this.icon,
    required this.label,
    required this.isSelected,
    required this.colors,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final bgColor = isSelected ? colors.chipSelectedBg : colors.chipBackground;
    final borderColor = isSelected ? colors.chipSelectedBg : colors.chipBorder;
    final contentColor = isSelected ? Colors.white : colors.textPrimary;

    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      curve: Curves.easeInOut,
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(19),
        border: Border.all(color: borderColor, width: 1.2),
        boxShadow: isSelected ? colors.glowShadow : colors.cardShadow,
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(19),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(icon, size: 16, color: contentColor),
                const SizedBox(width: 6),
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: isSelected ? FontWeight.w700 : FontWeight.w600,
                    color: contentColor,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
