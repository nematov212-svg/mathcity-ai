import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'house_build_colors.dart';
import 'house_mode_chips.dart';

/// 3D House Scene View inside Expanded:
/// Displays the 3D diorama canvas with rounded radius 28,
/// floating mode chips at top (Kun/Tun, Markaz, Ichki, Ovozli),
/// floating 90° rotate button at bottom-right,
/// and interactive onboarding hint tooltips.
class HouseSceneView extends StatelessWidget {
  final Widget? game3DView;
  final bool isNightMode;
  final bool isInteriorMode;
  final bool isMuted;
  final String? onboardingTooltip;
  final String? celebrationBadge;
  final VoidCallback onToggleNightMode;
  final VoidCallback onResetCamera;
  final VoidCallback onToggleInteriorMode;
  final VoidCallback onToggleMute;
  final VoidCallback onRotate90;
  final VoidCallback onDismissTooltip;

  const HouseSceneView({
    super.key,
    required this.game3DView,
    required this.isNightMode,
    required this.isInteriorMode,
    required this.isMuted,
    this.onboardingTooltip,
    this.celebrationBadge,
    required this.onToggleNightMode,
    required this.onResetCamera,
    required this.onToggleInteriorMode,
    required this.onToggleMute,
    required this.onRotate90,
    required this.onDismissTooltip,
  });

  @override
  Widget build(BuildContext context) {
    final colors = HouseBuildColors.of(context);

    return Container(
      decoration: BoxDecoration(
        color: isNightMode ? const Color(0xFF0A0F1D) : const Color(0xFFDCEEFF),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: colors.border, width: 1.2),
        boxShadow: colors.cardShadow,
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(28),
        child: Stack(
          alignment: Alignment.center,
          children: [
            // 1. 3D WebGL Canvas View or Visual Fallback
            Positioned.fill(
              child: game3DView ??
                  _buildVisualFallback(isNightMode, colors),
            ),

            // 2. Floating Mode Chips at Top (Single Row)
            Positioned(
              top: 10,
              left: 10,
              right: 10,
              child: Align(
                alignment: Alignment.topCenter,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: (isNightMode
                            ? const Color(0xFF151A2B)
                            : Colors.white)
                        .withValues(alpha: 0.88),
                    borderRadius: BorderRadius.circular(22),
                    border: Border.all(
                      color: colors.border.withValues(alpha: 0.6),
                      width: 1,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.08),
                        blurRadius: 10,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: HouseModeChips(
                    isNightMode: isNightMode,
                    isInteriorMode: isInteriorMode,
                    isMuted: isMuted,
                    onToggleNightMode: onToggleNightMode,
                    onResetCamera: onResetCamera,
                    onToggleInteriorMode: onToggleInteriorMode,
                    onToggleMute: onToggleMute,
                  ),
                ),
              ),
            ),

            // 3. Floating 90° Rotate Button at Bottom-Right
            Positioned(
              bottom: 12,
              right: 12,
              child: Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: (isNightMode
                          ? const Color(0xFF151A2B)
                          : Colors.white)
                      .withValues(alpha: 0.92),
                  shape: BoxShape.circle,
                  border: Border.all(color: colors.border, width: 1.2),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.12),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    borderRadius: BorderRadius.circular(22),
                    onTap: () {
                      HapticFeedback.lightImpact();
                      onRotate90();
                    },
                    child: Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.rotate_right_rounded,
                            size: 18,
                            color: colors.primary,
                          ),
                          Text(
                            '90°',
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.w900,
                              color: colors.primary,
                              height: 1.0,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),

            // 4. Onboarding Tooltip (Dismissible)
            if (onboardingTooltip != null)
              Positioned(
                bottom: 12,
                left: 12,
                right: 68,
                child: GestureDetector(
                  onTap: onDismissTooltip,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      gradient: colors.primaryGradient,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: colors.primary.withValues(alpha: 0.35),
                          blurRadius: 10,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.tips_and_updates_rounded,
                            size: 16, color: Colors.white),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            onboardingTooltip!,
                            style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              color: Colors.white,
                            ),
                          ),
                        ),
                        const Icon(Icons.close_rounded,
                            size: 14, color: Colors.white70),
                      ],
                    ),
                  ),
                ),
              ),

            // 5. Celebration Badge Banner ("Poydevor qurildi!")
            if (celebrationBadge != null)
              Positioned(
                top: 64,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF10B981), Color(0xFF059669)],
                    ),
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: const [
                      BoxShadow(
                        color: Color(0x3310B981),
                        blurRadius: 12,
                        offset: Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.stars_rounded,
                          size: 18, color: Colors.white),
                      const SizedBox(width: 6),
                      Text(
                        celebrationBadge!,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildVisualFallback(bool isDark, HouseBuildColors colors) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.villa_rounded,
              size: 56,
              color: colors.primary.withValues(alpha: 0.6),
            ),
            const SizedBox(height: 8),
            Text(
              '3D Uy Qurish Maydoni',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w800,
                color: colors.textPrimary,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Barmog‘ingiz bilan aylantiring va uyni quring',
              textAlign: TextAlign.center,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontSize: 12,
                color: colors.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
