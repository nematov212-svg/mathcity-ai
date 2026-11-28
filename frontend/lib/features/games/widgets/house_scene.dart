import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../house_building_screen.dart';
import 'house_build_colors.dart';
import 'house_stage_tile.dart';

/// Main House Scene card inside Expanded:
/// Displays the 6-stage construction path, unbuilt silhouettes, 90° rotate button,
/// interactive visual house preview, 3D viewport toggle, and active placement/selection overlays.
class HouseScene extends StatefulWidget {
  final int currentStage;
  final Widget? game3DView;
  final VoidCallback onRotate;
  final ValueChanged<String> onOpenStoreCategory;
  final HouseCatalogItem? activePlacingItem;
  final VoidCallback onRotateGhost;
  final VoidCallback onCancelPlacement;
  final Map<String, dynamic>? selectedPlacedItem;
  final ValueChanged<String>? onRotatePlacedItem;
  final ValueChanged<String>? onSellPlacedItem;
  final VoidCallback? onCloseSelection;

  const HouseScene({
    super.key,
    required this.currentStage,
    this.game3DView,
    required this.onRotate,
    required this.onOpenStoreCategory,
    this.activePlacingItem,
    required this.onRotateGhost,
    required this.onCancelPlacement,
    this.selectedPlacedItem,
    this.onRotatePlacedItem,
    this.onSellPlacedItem,
    this.onCloseSelection,
  });

  @override
  State<HouseScene> createState() => _HouseSceneState();
}

class _HouseSceneState extends State<HouseScene> {
  // Toggle between Stages view and 3D Interactive view
  bool _show3DView = false;

  @override
  Widget build(BuildContext context) {
    final colors = HouseBuildColors.of(context);
    final clampedStage = widget.currentStage.clamp(0, 6);

    return Container(
      decoration: BoxDecoration(
        color: colors.cardBackground,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: colors.border, width: 1.2),
        boxShadow: colors.cardShadow,
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(24),
        child: Stack(
          children: [
            // Main Content: either 3D View or Visual Stages Roadmap
            Positioned.fill(
              child: _show3DView && widget.game3DView != null
                  ? widget.game3DView!
                  : _buildStagesRoadmapView(context, colors, clampedStage),
            ),

            // Top-right Corner Controls inside Scene (3D/Bosqichlar toggle + 90° Rotate Button)
            Positioned(
              top: 10,
              right: 10,
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (widget.game3DView != null) ...[
                    Container(
                      height: 34,
                      decoration: BoxDecoration(
                        color: colors.cardBackground.withValues(alpha: 0.92),
                        borderRadius: BorderRadius.circular(17),
                        border: Border.all(color: colors.border, width: 1),
                        boxShadow: colors.cardShadow,
                      ),
                      child: Material(
                        color: Colors.transparent,
                        child: InkWell(
                          borderRadius: BorderRadius.circular(17),
                          onTap: () {
                            HapticFeedback.selectionClick();
                            setState(() => _show3DView = !_show3DView);
                          },
                          child: Padding(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 9, vertical: 4),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  _show3DView
                                      ? Icons.alt_route_rounded
                                      : Icons.view_in_ar_rounded,
                                  size: 15,
                                  color: colors.primary,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  _show3DView ? 'Bosqichlar' : '3D',
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: colors.textPrimary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 6),
                  ],

                  // 90° Rotate Button in Scene Corner
                  Container(
                    height: 34,
                    decoration: BoxDecoration(
                      color: colors.cardBackground.withValues(alpha: 0.92),
                      borderRadius: BorderRadius.circular(17),
                      border: Border.all(color: colors.border, width: 1),
                      boxShadow: colors.cardShadow,
                    ),
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        borderRadius: BorderRadius.circular(17),
                        onTap: () {
                          HapticFeedback.lightImpact();
                          widget.onRotate();
                        },
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 4),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                Icons.rotate_right_rounded,
                                size: 16,
                                color: colors.primary,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                '90°',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w800,
                                  color: colors.textPrimary,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Active Placement Ghost HUD
            if (widget.activePlacingItem != null)
              Positioned(
                bottom: 10,
                left: 10,
                right: 10,
                child: _buildActivePlacementBar(colors),
              ),

            // Selected Placed Item Inspection Bar
            if (widget.selectedPlacedItem != null &&
                widget.activePlacingItem == null)
              Positioned(
                bottom: 10,
                left: 10,
                right: 10,
                child: _buildSelectedItemBar(colors),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildViewTab({
    required String title,
    required IconData icon,
    required bool isActive,
    required HouseBuildColors colors,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: isActive ? colors.primary : Colors.transparent,
          borderRadius: BorderRadius.circular(14),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 14,
              color: isActive ? Colors.white : colors.textSecondary,
            ),
            const SizedBox(width: 4),
            Text(
              title,
              style: TextStyle(
                fontSize: 11,
                fontWeight: isActive ? FontWeight.w700 : FontWeight.w600,
                color: isActive ? Colors.white : colors.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStagesRoadmapView(
    BuildContext context,
    HouseBuildColors colors,
    int clampedStage,
  ) {
    return ListView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.fromLTRB(12, 54, 12, 16),
      children: [
        // 1. Visual House Silhouette & Construction Blueprint Preview
        _buildHouseVisualIllustration(colors, clampedStage),

        const SizedBox(height: 12),

        // 2. Visual CTA Banner if 0/6 or Next Stage CTA
        if (clampedStage == 0)
          GestureDetector(
            onTap: () {
              HapticFeedback.mediumImpact();
              widget.onOpenStoreCategory('foundation');
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              decoration: BoxDecoration(
                gradient: colors.primaryGradient,
                borderRadius: BorderRadius.circular(16),
                boxShadow: colors.buttonShadow,
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.2),
                      shape: BoxShape.circle,
                    ),
                    child: const Text('🧱', style: TextStyle(fontSize: 20)),
                  ),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Poydevor qo‘yishdan boshlang!',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                          ),
                        ),
                        SizedBox(height: 2),
                        Text(
                          'Katalogdan mos poydevor tanlang va o‘rnating',
                          style: TextStyle(
                            fontSize: 11,
                            color: Colors.white70,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.arrow_forward_ios_rounded,
                      color: Colors.white, size: 16),
                ],
              ),
            ),
          )
        else if (clampedStage < 6)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: colors.primary.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: colors.primary.withValues(alpha: 0.3),
                width: 1,
              ),
            ),
            child: Row(
              children: [
                Icon(Icons.lightbulb_outline_rounded,
                    size: 18, color: colors.primary),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Keyingi qadam: ${kHouseStagesData[clampedStage].title} o‘rnatish',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: colors.primary,
                    ),
                  ),
                ),
              ],
            ),
          ),

        const SizedBox(height: 12),

        // 3. 6-Stage Roadmap Tiles
        ...kHouseStagesData.map((stageInfo) {
          final HouseStageStatus status;
          if (stageInfo.stageNumber <= clampedStage) {
            status = HouseStageStatus.completed;
          } else if (stageInfo.stageNumber == clampedStage + 1) {
            status = HouseStageStatus.inProgress;
          } else {
            status = HouseStageStatus.locked;
          }

          return Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: HouseStageTile(
              stage: stageInfo,
              status: status,
              onTap: () => widget.onOpenStoreCategory(stageInfo.categoryKey),
            ),
          );
        }),
      ],
    );
  }

  /// Interactive visual illustration representing the house layers
  Widget _buildHouseVisualIllustration(
      HouseBuildColors colors, int clampedStage) {
    return Container(
      height: 140,
      decoration: BoxDecoration(
        color: colors.cardBackgroundSecondary,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: colors.borderSubtle, width: 1),
      ),
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Background Grid / Blueprint Lines
          CustomPaint(
            size: const Size(double.infinity, 140),
            painter: _BlueprintGridPainter(
              color: colors.border.withValues(alpha: 0.4),
            ),
          ),

          // Visual House Elements Stack
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // 1. Roof (Stage 3)
              _buildVisualComponent(
                isBuilt: clampedStage >= 3,
                builtIcon: Icons.roofing_rounded,
                unbuiltIcon: Icons.roofing_outlined,
                label: 'Tom',
                color: const Color(0xFFEF4444),
                colors: colors,
                width: 90,
                height: 32,
              ),
              const SizedBox(height: 2),

              // 2. Walls with Window and Door (Stages 2, 4, 5)
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Window Left (Stage 4)
                  _buildVisualComponent(
                    isBuilt: clampedStage >= 4,
                    builtIcon: Icons.window_rounded,
                    unbuiltIcon: Icons.window_outlined,
                    label: 'Deraza',
                    color: const Color(0xFF3B82F6),
                    colors: colors,
                    width: 30,
                    height: 36,
                  ),
                  const SizedBox(width: 4),

                  // Walls Center (Stage 2)
                  _buildVisualComponent(
                    isBuilt: clampedStage >= 2,
                    builtIcon: Icons.cottage_rounded,
                    unbuiltIcon: Icons.crop_square_rounded,
                    label: 'Devor',
                    color: const Color(0xFF8B5CF6),
                    colors: colors,
                    width: 44,
                    height: 36,
                  ),
                  const SizedBox(width: 4),

                  // Door Right (Stage 5)
                  _buildVisualComponent(
                    isBuilt: clampedStage >= 5,
                    builtIcon: Icons.door_front_door_rounded,
                    unbuiltIcon: Icons.door_front_door_outlined,
                    label: 'Eshik',
                    color: const Color(0xFF10B981),
                    colors: colors,
                    width: 30,
                    height: 36,
                  ),
                ],
              ),
              const SizedBox(height: 2),

              // 3. Foundation (Stage 1)
              _buildVisualComponent(
                isBuilt: clampedStage >= 1,
                builtIcon: Icons.foundation_rounded,
                unbuiltIcon: Icons.horizontal_rule_rounded,
                label: 'Poydevor',
                color: const Color(0xFFF59E0B),
                colors: colors,
                width: 120,
                height: 18,
              ),
            ],
          ),

          // Mashina / Yard Badge on corner (Stage 6)
          Positioned(
            bottom: 8,
            right: 12,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: clampedStage >= 6
                    ? colors.success.withValues(alpha: 0.2)
                    : colors.borderSubtle,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: clampedStage >= 6
                      ? colors.success.withValues(alpha: 0.4)
                      : colors.border,
                ),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.directions_car_rounded,
                    size: 14,
                    color: clampedStage >= 6 ? colors.success : colors.textMuted,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    clampedStage >= 6 ? 'Hovli va Mashina' : 'Hovli (6-bosqich)',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                      color:
                          clampedStage >= 6 ? colors.success : colors.textMuted,
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

  Widget _buildVisualComponent({
    required bool isBuilt,
    required IconData builtIcon,
    required IconData unbuiltIcon,
    required String label,
    required Color color,
    required HouseBuildColors colors,
    required double width,
    required double height,
  }) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: isBuilt ? color.withValues(alpha: 0.22) : colors.silhouette,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: isBuilt ? color : colors.border.withValues(alpha: 0.5),
          width: isBuilt ? 1.5 : 1,
        ),
      ),
      child: Center(
        child: Icon(
          isBuilt ? builtIcon : unbuiltIcon,
          size: height * 0.55,
          color: isBuilt ? color : colors.textMuted.withValues(alpha: 0.45),
        ),
      ),
    );
  }

  Widget _buildActivePlacementBar(HouseBuildColors colors) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: colors.cardBackground.withValues(alpha: 0.96),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: colors.primary, width: 1.5),
        boxShadow: colors.cardShadow,
      ),
      child: Row(
        children: [
          Text(
            widget.activePlacingItem!.iconEmoji,
            style: const TextStyle(fontSize: 22),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  widget.activePlacingItem!.name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: colors.textPrimary,
                  ),
                ),
                Text(
                  'Joylashtirish uchun katakni bosing',
                  style: TextStyle(fontSize: 11, color: colors.textSecondary),
                ),
              ],
            ),
          ),
          ElevatedButton.icon(
            onPressed: widget.onRotateGhost,
            icon: const Icon(Icons.rotate_right_rounded, size: 16),
            label: const Text('90°'),
            style: ElevatedButton.styleFrom(
              backgroundColor: colors.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10)),
              textStyle:
                  const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
            ),
          ),
          const SizedBox(width: 6),
          IconButton(
            onPressed: widget.onCancelPlacement,
            icon: Icon(Icons.close_rounded, color: colors.textMuted, size: 20),
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(),
            tooltip: 'Bekor qilish',
          ),
        ],
      ),
    );
  }

  Widget _buildSelectedItemBar(HouseBuildColors colors) {
    final item = widget.selectedPlacedItem!;
    final instanceId = item['instanceId']?.toString();

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: colors.cardBackground.withValues(alpha: 0.96),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: colors.success, width: 1.5),
        boxShadow: colors.cardShadow,
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: colors.success.withValues(alpha: 0.15),
              shape: BoxShape.circle,
            ),
            child: Icon(Icons.check_circle_rounded,
                color: colors.success, size: 18),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  item['name']?.toString() ?? 'Tanlangan buyum',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: colors.textPrimary,
                  ),
                ),
                Text(
                  'Katak: (${item['cellX']}, ${item['cellY']}) • Burish: ${item['rotation'] ?? 0}°',
                  style: TextStyle(fontSize: 11, color: colors.textSecondary),
                ),
              ],
            ),
          ),
          if (instanceId != null) ...[
            IconButton(
              onPressed: () => widget.onRotatePlacedItem?.call(instanceId),
              icon: Icon(Icons.rotate_right_rounded,
                  color: colors.primary, size: 20),
              tooltip: '90° burish',
            ),
            IconButton(
              onPressed: () => widget.onSellPlacedItem?.call(instanceId),
              icon: const Icon(Icons.delete_outline_rounded,
                  color: Color(0xFFEF4444), size: 20),
              tooltip: 'Sotish (50% coin)',
            ),
          ],
          IconButton(
            onPressed: widget.onCloseSelection,
            icon: Icon(Icons.close_rounded, color: colors.textMuted, size: 20),
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(),
            tooltip: 'Yopish',
          ),
        ],
      ),
    );
  }
}

class _BlueprintGridPainter extends CustomPainter {
  final Color color;

  _BlueprintGridPainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 0.8
      ..style = PaintingStyle.stroke;

    const double step = 20;
    for (double x = 0; x < size.width; x += step) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = 0; y < size.height; y += step) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(covariant _BlueprintGridPainter oldDelegate) => false;
}
