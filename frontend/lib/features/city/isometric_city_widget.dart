import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../shared/models/building_model.dart';

class IsometricCityWidget extends StatefulWidget {
  final List<PlacedBuildingModel> placedBuildings;
  final Function(PlacedBuildingModel building)? onBuildingTap;
  final Function(int gridX, int gridY)? onEmptyPlotTap;
  final int? animatingGridX;
  final int? animatingGridY;
  final double constructionProgress; // 0.0 to 1.0

  const IsometricCityWidget({
    super.key,
    required this.placedBuildings,
    this.onBuildingTap,
    this.onEmptyPlotTap,
    this.animatingGridX,
    this.animatingGridY,
    this.constructionProgress = 1.0,
  });

  @override
  State<IsometricCityWidget> createState() => _IsometricCityWidgetState();
}

class _IsometricCityWidgetState extends State<IsometricCityWidget> with SingleTickerProviderStateMixin {
  final TransformationController _transformController = TransformationController();
  double _zoomLevel = 1.0;
  late AnimationController _ambientController;

  @override
  void initState() {
    super.initState();
    _ambientController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 4),
    );
  }

  @override
  void dispose() {
    _ambientController.dispose();
    super.dispose();
  }

  void _zoomIn() {
    setState(() {
      _zoomLevel = (_zoomLevel + 0.2).clamp(0.6, 2.2);
      _transformController.value = Matrix4.identity()..scale(_zoomLevel);
    });
  }

  void _zoomOut() {
    setState(() {
      _zoomLevel = (_zoomLevel - 0.2).clamp(0.6, 2.2);
      _transformController.value = Matrix4.identity()..scale(_zoomLevel);
    });
  }

  void _resetView() {
    setState(() {
      _zoomLevel = 1.0;
      _transformController.value = Matrix4.identity();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Sky, Clouds & Rainbow Background (REFERENCE IMAGE 1)
        AnimatedBuilder(
          animation: _ambientController,
          builder: (context, child) {
            return Container(
              width: double.infinity,
              height: double.infinity,
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFFE5DEFF), Color(0xFFF3F0FF), Color(0xFFE8F6FE)],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
              ),
              child: CustomPaint(
                painter: SkyAndRainbowPainter(ambientOffset: _ambientController.value),
              ),
            );
          },
        ),

        // Interactive 3D Isometric Island Canvas (Pan & Zoom)
        InteractiveViewer(
          transformationController: _transformController,
          minScale: 0.6,
          maxScale: 2.2,
          boundaryMargin: const EdgeInsets.all(240),
          child: Center(
            child: SizedBox(
              width: 520,
              height: 520,
              child: GestureDetector(
                onTapUp: (details) {
                  _handleTap(details.localPosition);
                },
                child: CustomPaint(
                  size: const Size(520, 520),
                  painter: IsometricIslandPainter(
                    placedBuildings: widget.placedBuildings,
                    animatingGridX: widget.animatingGridX,
                    animatingGridY: widget.animatingGridY,
                    constructionProgress: widget.constructionProgress,
                  ),
                ),
              ),
            ),
          ),
        ),

        // Floating Zoom Controls (REFERENCE IMAGE 1)
        Positioned(
          right: 20,
          top: 20,
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.08),
                  blurRadius: 16,
                  offset: const Offset(0, 4),
                ),
              ],
              border: Border.all(color: AppColors.kidsBorder, width: 1.5),
            ),
            child: Column(
              children: [
                IconButton(
                  icon: const Icon(Icons.add_rounded, color: Color(0xFF7154EC), size: 24),
                  tooltip: 'Kattalashtirish',
                  onPressed: _zoomIn,
                ),
                Container(width: 24, height: 1, color: AppColors.kidsBorder),
                IconButton(
                  icon: const Icon(Icons.remove_rounded, color: Color(0xFF7154EC), size: 24),
                  tooltip: 'Kichiklashtirish',
                  onPressed: _zoomOut,
                ),
                Container(width: 24, height: 1, color: AppColors.kidsBorder),
                IconButton(
                  icon: const Icon(Icons.center_focus_strong_rounded, color: Color(0xFF7154EC), size: 20),
                  tooltip: 'Markazga qaytish',
                  onPressed: _resetView,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  void _handleTap(Offset localPos) {
    const originX = 260.0;
    const originY = 170.0;
    const tileW = 76.0;
    const tileH = 38.0;

    final dx = localPos.dx - originX;
    final dy = localPos.dy - originY;

    // Inverse isometric projection to find tile (gridX, gridY)
    final gridX = ((dx / (tileW / 2) + dy / (tileH / 2)) / 2).round();
    final gridY = ((dy / (tileH / 2) - dx / (tileW / 2)) / 2).round();

    if (gridX >= 0 && gridX < 4 && gridY >= 0 && gridY < 4) {
      final building = widget.placedBuildings.cast<PlacedBuildingModel?>().firstWhere(
            (b) => b?.gridX == gridX && b?.gridY == gridY,
            orElse: () => null,
          );

      if (building != null) {
        widget.onBuildingTap?.call(building);
      } else {
        widget.onEmptyPlotTap?.call(gridX, gridY);
      }
    }
  }
}

class SkyAndRainbowPainter extends CustomPainter {
  final double ambientOffset;

  SkyAndRainbowPainter({this.ambientOffset = 0.0});

  @override
  void paint(Canvas canvas, Size size) {
    // Rainbow Arch in background (REFERENCE IMAGE 1)
    final rainbowCenter = Offset(size.width * 0.72, size.height * 0.42);
    final colors = [
      Colors.redAccent.withOpacity(0.35),
      Colors.orangeAccent.withOpacity(0.35),
      Colors.amberAccent.withOpacity(0.35),
      Colors.lightGreenAccent.withOpacity(0.35),
      Colors.lightBlueAccent.withOpacity(0.35),
      Colors.purpleAccent.withOpacity(0.35),
    ];

    double radius = size.width * 0.52;
    for (final col in colors) {
      final paint = Paint()
        ..color = col
        ..style = PaintingStyle.stroke
        ..strokeWidth = 7;
      canvas.drawArc(
        Rect.fromCircle(center: rainbowCenter, radius: radius),
        math.pi * 0.88,
        math.pi * 0.85,
        false,
        paint,
      );
      radius -= 6;
    }

    // Soft fluffy floating clouds
    _drawCloud(canvas, Offset(size.width * 0.2 + ambientOffset * 10, size.height * 0.16), 34);
    _drawCloud(canvas, Offset(size.width * 0.82 - ambientOffset * 8, size.height * 0.12), 26);
  }

  void _drawCloud(Canvas canvas, Offset pos, double radius) {
    final cloudPaint = Paint()..color = Colors.white.withOpacity(0.7);
    canvas.drawCircle(pos, radius, cloudPaint);
    canvas.drawCircle(Offset(pos.dx - radius * 0.6, pos.dy + radius * 0.2), radius * 0.7, cloudPaint);
    canvas.drawCircle(Offset(pos.dx + radius * 0.7, pos.dy + radius * 0.1), radius * 0.8, cloudPaint);
  }

  @override
  bool shouldRepaint(covariant SkyAndRainbowPainter oldDelegate) =>
      oldDelegate.ambientOffset != ambientOffset;
}

class IsometricIslandPainter extends CustomPainter {
  final List<PlacedBuildingModel> placedBuildings;
  final int? animatingGridX;
  final int? animatingGridY;
  final double constructionProgress;

  IsometricIslandPainter({
    required this.placedBuildings,
    this.animatingGridX,
    this.animatingGridY,
    this.constructionProgress = 1.0,
  });

  @override
  void paint(Canvas canvas, Size size) {
    const originX = 260.0;
    const originY = 170.0;
    const tileW = 76.0;
    const tileH = 38.0;

    // 1. Draw 3D Island Base (Earthen depth / cliff beneath floating island)
    final cliffPath = Path();
    final topFrontLeft = _toScreen(0, 3, originX, originY, tileW, tileH);
    final topFrontRight = _toScreen(3, 0, originX, originY, tileW, tileH);
    final topFrontBottom = _toScreen(3, 3, originX, originY, tileW, tileH);

    cliffPath.moveTo(topFrontLeft.dx, topFrontLeft.dy);
    cliffPath.lineTo(topFrontBottom.dx, topFrontBottom.dy);
    cliffPath.lineTo(topFrontRight.dx, topFrontRight.dy);
    cliffPath.lineTo(topFrontRight.dx, topFrontRight.dy + 75);
    cliffPath.lineTo(topFrontBottom.dx, topFrontBottom.dy + 95);
    cliffPath.lineTo(topFrontLeft.dx, topFrontLeft.dy + 75);
    cliffPath.close();

    final cliffPaint = Paint()
      ..shader = const LinearGradient(
        colors: [Color(0xFF8C715A), Color(0xFF6B533F)],
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
      ).createShader(Rect.fromLTWH(0, originY, size.width, 160));

    canvas.drawPath(cliffPath, cliffPaint);

    // Decorative floating soil roots/crystals under island
    canvas.drawCircle(Offset(topFrontBottom.dx - 30, topFrontBottom.dy + 70), 5, Paint()..color = const Color(0xFF5A4432));
    canvas.drawCircle(Offset(topFrontBottom.dx + 25, topFrontBottom.dy + 65), 4, Paint()..color = const Color(0xFF5A4432));

    // 2. Draw 4x4 Isometric Grass Plots with Cobblestone paths
    for (int y = 0; y < 4; y++) {
      for (int x = 0; x < 4; x++) {
        final pos = _toScreen(x, y, originX, originY, tileW, tileH);
        final tilePath = Path()
          ..moveTo(pos.dx, pos.dy - tileH / 2)
          ..lineTo(pos.dx + tileW / 2, pos.dy)
          ..lineTo(pos.dx, pos.dy + tileH / 2)
          ..lineTo(pos.dx - tileW / 2, pos.dy)
          ..close();

        // Pastel island grass pattern
        final isEven = (x + y) % 2 == 0;
        final tilePaint = Paint()
          ..color = isEven ? const Color(0xFFBCE7BE) : const Color(0xFFB1E1B4)
          ..style = PaintingStyle.fill;
        canvas.drawPath(tilePath, tilePaint);

        // Tile border outline
        final borderPaint = Paint()
          ..color = const Color(0xFF9FD4A3)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1.0;
        canvas.drawPath(tilePath, borderPaint);

        // Draw central fountain plaza at (1,2)
        if (x == 1 && y == 2) {
          final fountainPlazaPaint = Paint()..color = const Color(0xFFE2E8F0);
          canvas.drawCircle(pos, 16, fountainPlazaPaint);
          final fountainWaterPaint = Paint()..color = const Color(0xFF68C8E8);
          canvas.drawCircle(pos, 11, fountainWaterPaint);
          final rimPaint = Paint()
            ..color = Colors.white
            ..style = PaintingStyle.stroke
            ..strokeWidth = 2.5;
          canvas.drawCircle(pos, 11, rimPaint);
        }
      }
    }

    // 3. Draw 3D Isometric Buildings in Painter-Depth Order (x + y sorting)
    final sortedBuildings = List<PlacedBuildingModel>.from(placedBuildings)
      ..sort((a, b) => (a.gridX + a.gridY).compareTo(b.gridX + b.gridY));

    for (final b in sortedBuildings) {
      final pos = _toScreen(b.gridX, b.gridY, originX, originY, tileW, tileH);

      final isCurrentlyBuilding = animatingGridX == b.gridX && animatingGridY == b.gridY;
      final scale = isCurrentlyBuilding ? constructionProgress : 1.0;

      canvas.save();
      canvas.translate(pos.dx, pos.dy);
      canvas.scale(scale);
      canvas.translate(-pos.dx, -pos.dy);

      _drawBuildingByType(canvas, pos, b.buildingKey);

      canvas.restore();
    }
  }

  void _drawBuildingByType(Canvas canvas, Offset pos, String key) {
    switch (key) {
      case 'observatory_space':
        _drawObservatoryTower(canvas, pos);
        break;
      case 'school_math':
        _drawSchool(canvas, pos);
        break;
      case 'library_city':
        _drawLibrary(canvas, pos);
        break;
      case 'park_green':
        _drawTreesPark(canvas, pos);
        break;
      case 'house_medium':
        _drawMediumHouse(canvas, pos);
        break;
      case 'museum_art':
        _drawMuseum(canvas, pos);
        break;
      case 'playground_fun':
        _drawPlayground(canvas, pos);
        break;
      case 'fountain_crystal':
        _drawCrystalFountain(canvas, pos);
        break;
      case 'trees_decorative':
        _drawDecorativeTrees(canvas, pos);
        break;
      case 'house_basic':
      default:
        _drawPastelHouse(canvas, pos);
        break;
    }
  }

  Offset _toScreen(int gx, int gy, double ox, double oy, double tw, double th) {
    final sx = ox + (gx - gy) * (tw / 2);
    final sy = oy + (gx + gy) * (th / 2);
    return Offset(sx, sy);
  }

  // 1. Small pastel house
  void _drawPastelHouse(Canvas canvas, Offset pos) {
    const w = 24.0;
    const h = 28.0;

    final leftWall = Path()
      ..moveTo(pos.dx, pos.dy)
      ..lineTo(pos.dx - w, pos.dy - w / 2)
      ..lineTo(pos.dx - w, pos.dy - w / 2 - h)
      ..lineTo(pos.dx, pos.dy - h)
      ..close();
    canvas.drawPath(leftWall, Paint()..color = const Color(0xFFFF9E9E));

    final rightWall = Path()
      ..moveTo(pos.dx, pos.dy)
      ..lineTo(pos.dx + w, pos.dy - w / 2)
      ..lineTo(pos.dx + w, pos.dy - w / 2 - h)
      ..lineTo(pos.dx, pos.dy - h)
      ..close();
    canvas.drawPath(rightWall, Paint()..color = const Color(0xFFF07D7D));

    final roof = Path()
      ..moveTo(pos.dx, pos.dy - h - 14)
      ..lineTo(pos.dx + w + 2, pos.dy - w / 2 - h)
      ..lineTo(pos.dx, pos.dy - h)
      ..lineTo(pos.dx - w - 2, pos.dy - w / 2 - h)
      ..close();
    canvas.drawPath(roof, Paint()..color = const Color(0xFFFF5E5E));

    canvas.drawRect(
      Rect.fromLTWH(pos.dx - 12, pos.dy - 16, 8, 12),
      Paint()..color = const Color(0xFF5A3E2A),
    );
  }

  // 2. Medium house (Two-story lavender)
  void _drawMediumHouse(Canvas canvas, Offset pos) {
    const w = 28.0;
    const h = 38.0;

    final leftWall = Path()
      ..moveTo(pos.dx, pos.dy)
      ..lineTo(pos.dx - w, pos.dy - w / 2)
      ..lineTo(pos.dx - w, pos.dy - w / 2 - h)
      ..lineTo(pos.dx, pos.dy - h)
      ..close();
    canvas.drawPath(leftWall, Paint()..color = const Color(0xFFA29BFE));

    final rightWall = Path()
      ..moveTo(pos.dx, pos.dy)
      ..lineTo(pos.dx + w, pos.dy - w / 2)
      ..lineTo(pos.dx + w, pos.dy - w / 2 - h)
      ..lineTo(pos.dx, pos.dy - h)
      ..close();
    canvas.drawPath(rightWall, Paint()..color = const Color(0xFF6C5CE7));

    final roof = Path()
      ..moveTo(pos.dx, pos.dy - h - 16)
      ..lineTo(pos.dx + w + 2, pos.dy - w / 2 - h)
      ..lineTo(pos.dx, pos.dy - h)
      ..lineTo(pos.dx - w - 2, pos.dy - w / 2 - h)
      ..close();
    canvas.drawPath(roof, Paint()..color = const Color(0xFF5352ED));
  }

  // 3. Central Observatory Tower with Blue Dome & Telescope (REFERENCE IMAGE 1)
  void _drawObservatoryTower(Canvas canvas, Offset pos) {
    const radius = 20.0;
    const height = 52.0;

    final towerPath = Path()
      ..moveTo(pos.dx - radius, pos.dy - 6)
      ..lineTo(pos.dx + radius, pos.dy - 6)
      ..lineTo(pos.dx + radius, pos.dy - height)
      ..lineTo(pos.dx - radius, pos.dy - height)
      ..close();
    canvas.drawPath(
      towerPath,
      Paint()
        ..shader = const LinearGradient(
          colors: [Color(0xFFFFFFFF), Color(0xFFD8D3FF)],
        ).createShader(Rect.fromLTWH(pos.dx - radius, pos.dy - height, radius * 2, height)),
    );

    // Blue Dome
    canvas.drawArc(
      Rect.fromCircle(center: Offset(pos.dx, pos.dy - height), radius: radius),
      math.pi,
      math.pi,
      true,
      Paint()..color = const Color(0xFF5352ED),
    );

    // Telescope
    final telescopePaint = Paint()
      ..color = const Color(0xFFFFB800)
      ..strokeWidth = 5
      ..strokeCap = StrokeCap.round;
    canvas.drawLine(
      Offset(pos.dx + 4, pos.dy - height - 8),
      Offset(pos.dx + 22, pos.dy - height - 26),
      telescopePaint,
    );
  }

  // 4. Mathematics School with Clock
  void _drawSchool(Canvas canvas, Offset pos) {
    const w = 30.0;
    const h = 34.0;

    final wall = Path()
      ..moveTo(pos.dx, pos.dy)
      ..lineTo(pos.dx - w, pos.dy - w / 2)
      ..lineTo(pos.dx - w, pos.dy - w / 2 - h)
      ..lineTo(pos.dx, pos.dy - h)
      ..close();
    canvas.drawPath(wall, Paint()..color = const Color(0xFF70A1FF));

    final rightWall = Path()
      ..moveTo(pos.dx, pos.dy)
      ..lineTo(pos.dx + w, pos.dy - w / 2)
      ..lineTo(pos.dx + w, pos.dy - w / 2 - h)
      ..lineTo(pos.dx, pos.dy - h)
      ..close();
    canvas.drawPath(rightWall, Paint()..color = const Color(0xFF1E90FF));

    // Clock
    canvas.drawCircle(Offset(pos.dx, pos.dy - h + 10), 6, Paint()..color = Colors.white);
    canvas.drawCircle(Offset(pos.dx, pos.dy - h + 10), 2, Paint()..color = const Color(0xFF242344));
  }

  // 5. Library with Pillars
  void _drawLibrary(Canvas canvas, Offset pos) {
    const w = 28.0;
    const h = 28.0;

    canvas.drawRect(
      Rect.fromLTWH(pos.dx - w / 2, pos.dy - h, w, h),
      Paint()..color = const Color(0xFFDFE4EA),
    );

    // Pillars
    final pillarPaint = Paint()..color = const Color(0xFFCED6E0)..strokeWidth = 3;
    canvas.drawLine(Offset(pos.dx - 10, pos.dy), Offset(pos.dx - 10, pos.dy - h), pillarPaint);
    canvas.drawLine(Offset(pos.dx, pos.dy), Offset(pos.dx, pos.dy - h), pillarPaint);
    canvas.drawLine(Offset(pos.dx + 10, pos.dy), Offset(pos.dx + 10, pos.dy - h), pillarPaint);

    final pediment = Path()
      ..moveTo(pos.dx - w / 2 - 4, pos.dy - h)
      ..lineTo(pos.dx + w / 2 + 4, pos.dy - h)
      ..lineTo(pos.dx, pos.dy - h - 14)
      ..close();
    canvas.drawPath(pediment, Paint()..color = const Color(0xFF747D8C));
  }

  // 6. Park with Green Trees
  void _drawTreesPark(Canvas canvas, Offset pos) {
    final trunkPaint = Paint()..color = const Color(0xFF795548)..strokeWidth = 3.5;
    canvas.drawLine(pos, Offset(pos.dx, pos.dy - 18), trunkPaint);

    final foliagePaint = Paint()..color = const Color(0xFF2ED573);
    canvas.drawCircle(Offset(pos.dx, pos.dy - 24), 14, foliagePaint);

    canvas.drawLine(Offset(pos.dx + 12, pos.dy + 4), Offset(pos.dx + 12, pos.dy - 10), trunkPaint);
    canvas.drawCircle(Offset(pos.dx + 12, pos.dy - 16), 9, Paint()..color = const Color(0xFF7BED9F));
  }

  // 7. Museum
  void _drawMuseum(Canvas canvas, Offset pos) {
    const w = 32.0;
    const h = 30.0;
    canvas.drawRect(
      Rect.fromLTWH(pos.dx - w / 2, pos.dy - h, w, h),
      Paint()..color = const Color(0xFFF1F2F6),
    );
    final roof = Path()
      ..moveTo(pos.dx - w / 2 - 6, pos.dy - h)
      ..lineTo(pos.dx + w / 2 + 6, pos.dy - h)
      ..lineTo(pos.dx, pos.dy - h - 16)
      ..close();
    canvas.drawPath(roof, Paint()..color = const Color(0xFFFFB800));
  }

  // 8. Playground
  void _drawPlayground(Canvas canvas, Offset pos) {
    // Colorful slide
    final slidePaint = Paint()..color = const Color(0xFFFF4757)..strokeWidth = 4;
    canvas.drawLine(Offset(pos.dx - 12, pos.dy - 18), Offset(pos.dx + 12, pos.dy), slidePaint);

    // Ladder
    final ladderPaint = Paint()..color = const Color(0xFF2ED573)..strokeWidth = 3;
    canvas.drawLine(Offset(pos.dx - 12, pos.dy), Offset(pos.dx - 12, pos.dy - 18), ladderPaint);
  }

  // 9. Crystal Fountain
  void _drawCrystalFountain(Canvas canvas, Offset pos) {
    final basinPaint = Paint()..color = const Color(0xFFDFE4EA);
    canvas.drawCircle(pos, 14, basinPaint);

    final waterPaint = Paint()..color = const Color(0xFF70BFFF);
    canvas.drawCircle(pos, 10, waterPaint);

    final jetPaint = Paint()
      ..color = Colors.white
      ..strokeWidth = 3
      ..strokeCap = StrokeCap.round;
    canvas.drawLine(pos, Offset(pos.dx, pos.dy - 14), jetPaint);
  }

  // 10. Decorative seasonal trees
  void _drawDecorativeTrees(Canvas canvas, Offset pos) {
    final trunkPaint = Paint()..color = const Color(0xFF6B533F)..strokeWidth = 3;
    canvas.drawLine(pos, Offset(pos.dx, pos.dy - 14), trunkPaint);
    canvas.drawCircle(Offset(pos.dx, pos.dy - 20), 12, Paint()..color = const Color(0xFFFFA502)); // Autumn golden
  }

  @override
  bool shouldRepaint(covariant IsometricIslandPainter oldDelegate) => true;
}
