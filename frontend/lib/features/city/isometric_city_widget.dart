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
  final int citizenCount;
  final int carLevel;
  final Color carColor;
  final double carSpeed;
  final String carModel;

  const IsometricCityWidget({
    super.key,
    required this.placedBuildings,
    this.onBuildingTap,
    this.onEmptyPlotTap,
    this.animatingGridX,
    this.animatingGridY,
    this.constructionProgress = 1.0,
    this.citizenCount = 15,
    this.carLevel = 1,
    this.carColor = const Color(0xFFE53E3E),
    this.carSpeed = 1.0,
    this.carModel = 'Sedan',
  });

  @override
  State<IsometricCityWidget> createState() => _IsometricCityWidgetState();
}

class _IsometricCityWidgetState extends State<IsometricCityWidget>
    with TickerProviderStateMixin, WidgetsBindingObserver {
  final TransformationController _transformController = TransformationController();
  double _zoomLevel = 1.0;
  late AnimationController _ambientController;
  late AnimationController _carController;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _ambientController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 4),
    )..repeat();

    _carController = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: (7000 / widget.carSpeed).clamp(2500, 10000).round()),
    )..repeat();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      if (!_ambientController.isAnimating) _ambientController.repeat();
      if (!_carController.isAnimating) _carController.repeat();
    } else {
      if (_ambientController.isAnimating) _ambientController.stop();
      if (_carController.isAnimating) _carController.stop();
    }
  }

  @override
  void didUpdateWidget(covariant IsometricCityWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.carSpeed != widget.carSpeed) {
      _carController.duration =
          Duration(milliseconds: (7000 / widget.carSpeed).clamp(2500, 10000).round());
      if (!_carController.isAnimating) {
        _carController.repeat();
      }
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _ambientController.dispose();
    _carController.dispose();
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
        // Sky, Clouds & 7-Color Rainbow Background
        RepaintBoundary(
          child: AnimatedBuilder(
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
        ),

        // Interactive 3D Isometric Island Canvas (Pan & Zoom, 60fps Cars & Citizens)
        InteractiveViewer(
          transformationController: _transformController,
          minScale: 0.6,
          maxScale: 2.2,
          boundaryMargin: const EdgeInsets.all(240),
          child: Center(
            child: SizedBox(
              width: 540,
              height: 540,
              child: GestureDetector(
                onTapUp: (details) {
                  _handleTap(details.localPosition);
                },
                child: RepaintBoundary(
                  child: AnimatedBuilder(
                    animation: Listenable.merge([_ambientController, _carController]),
                    builder: (context, _) {
                      return CustomPaint(
                      size: const Size(540, 540),
                      painter: IsometricIslandPainter(
                        placedBuildings: widget.placedBuildings,
                        animatingGridX: widget.animatingGridX,
                        animatingGridY: widget.animatingGridY,
                        constructionProgress: widget.constructionProgress,
                        ambientOffset: _ambientController.value,
                        carProgress: _carController.value,
                        citizenCount: widget.citizenCount,
                        carColor: widget.carColor,
                        carLevel: widget.carLevel,
                        carModel: widget.carModel,
                      ),
                    );
                  },
                ),
              ),
            ),
          ),
        ),
      ),

        // Floating Zoom Controls
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
    const originX = 270.0;
    const originY = 175.0;
    const tileW = 76.0;
    const tileH = 38.0;

    final dx = localPos.dx - originX;
    final dy = localPos.dy - originY;

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

/// 7-Color Rainbow and Drifting Pastel Clouds
class SkyAndRainbowPainter extends CustomPainter {
  final double ambientOffset;

  SkyAndRainbowPainter({this.ambientOffset = 0.0});

  @override
  void paint(Canvas canvas, Size size) {
    final rainbowCenter = Offset(size.width * 0.72, size.height * 0.44);
    final rainbowColors = [
      const Color(0xFFEF4444).withOpacity(0.40), // Red
      const Color(0xFFF97316).withOpacity(0.40), // Orange
      const Color(0xFFFBBF24).withOpacity(0.40), // Yellow
      const Color(0xFF10B981).withOpacity(0.40), // Green
      const Color(0xFF06B6D4).withOpacity(0.40), // Cyan
      const Color(0xFF3B82F6).withOpacity(0.40), // Blue
      const Color(0xFF8B5CF6).withOpacity(0.40), // Purple
    ];

    double radius = size.width * 0.54;
    for (final col in rainbowColors) {
      final paint = Paint()
        ..color = col
        ..style = PaintingStyle.stroke
        ..strokeWidth = 6.5;
      canvas.drawArc(
        Rect.fromCircle(center: rainbowCenter, radius: radius),
        math.pi * 0.86,
        math.pi * 0.88,
        false,
        paint,
      );
      radius -= 5.5;
    }

    _drawCloud(canvas, Offset(size.width * 0.18 + ambientOffset * 12, size.height * 0.15), 32);
    _drawCloud(canvas, Offset(size.width * 0.84 - ambientOffset * 9, size.height * 0.11), 26);
    _drawCloud(canvas, Offset(size.width * 0.52 + ambientOffset * 6, size.height * 0.08), 22);
  }

  void _drawCloud(Canvas canvas, Offset pos, double radius) {
    final cloudPaint = Paint()..color = Colors.white.withOpacity(0.75);
    canvas.drawCircle(pos, radius, cloudPaint);
    canvas.drawCircle(Offset(pos.dx - radius * 0.6, pos.dy + radius * 0.2), radius * 0.7, cloudPaint);
    canvas.drawCircle(Offset(pos.dx + radius * 0.7, pos.dy + radius * 0.1), radius * 0.8, cloudPaint);
  }

  @override
  bool shouldRepaint(covariant SkyAndRainbowPainter oldDelegate) =>
      oldDelegate.ambientOffset != ambientOffset;
}

/// Comprehensive Isometric Island Painter:
/// 3D Cliff base, Roads, Shimmering Lake, Cobblestones, Trees, 3D Buildings,
/// Animated 60fps Cars, and Citizens.
class IsometricIslandPainter extends CustomPainter {
  final List<PlacedBuildingModel> placedBuildings;
  final int? animatingGridX;
  final int? animatingGridY;
  final double constructionProgress;
  final double ambientOffset;
  final double carProgress;
  final int citizenCount;
  final Color carColor;
  final int carLevel;
  final String carModel;

  IsometricIslandPainter({
    required this.placedBuildings,
    this.animatingGridX,
    this.animatingGridY,
    this.constructionProgress = 1.0,
    this.ambientOffset = 0.0,
    this.carProgress = 0.0,
    this.citizenCount = 15,
    this.carColor = const Color(0xFFE53E3E),
    this.carLevel = 1,
    this.carModel = 'Sedan',
  });

  @override
  void paint(Canvas canvas, Size size) {
    const originX = 270.0;
    const originY = 175.0;
    const tileW = 76.0;
    const tileH = 38.0;

    // 1. Draw 3D Island Base (Earthen depth beneath floating island)
    final cliffPath = Path();
    final topFrontLeft = _toScreen(0, 3, originX, originY, tileW, tileH);
    final topFrontRight = _toScreen(3, 0, originX, originY, tileW, tileH);
    final topFrontBottom = _toScreen(3, 3, originX, originY, tileW, tileH);

    cliffPath.moveTo(topFrontLeft.dx, topFrontLeft.dy);
    cliffPath.lineTo(topFrontBottom.dx, topFrontBottom.dy);
    cliffPath.lineTo(topFrontRight.dx, topFrontRight.dy);
    cliffPath.lineTo(topFrontRight.dx, topFrontRight.dy + 80);
    cliffPath.lineTo(topFrontBottom.dx, topFrontBottom.dy + 100);
    cliffPath.lineTo(topFrontLeft.dx, topFrontLeft.dy + 80);
    cliffPath.close();

    final cliffPaint = Paint()
      ..shader = const LinearGradient(
        colors: [Color(0xFF8C715A), Color(0xFF6B533F)],
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
      ).createShader(Rect.fromLTWH(0, originY, size.width, 180));

    canvas.drawPath(cliffPath, cliffPaint);

    // Island Soil crystals / roots
    canvas.drawCircle(Offset(topFrontBottom.dx - 32, topFrontBottom.dy + 75), 5, Paint()..color = const Color(0xFF5A4432));
    canvas.drawCircle(Offset(topFrontBottom.dx + 28, topFrontBottom.dy + 70), 4, Paint()..color = const Color(0xFF5A4432));

    // 2. 4x4 Isometric Grid: Grass Plots & Lake
    final bool hasLakeBuilding = placedBuildings.any((b) => b.gridX == 0 && b.gridY == 0);

    for (int y = 0; y < 4; y++) {
      for (int x = 0; x < 4; x++) {
        final pos = _toScreen(x, y, originX, originY, tileW, tileH);
        final tilePath = Path()
          ..moveTo(pos.dx, pos.dy - tileH / 2)
          ..lineTo(pos.dx + tileW / 2, pos.dy)
          ..lineTo(pos.dx, pos.dy + tileH / 2)
          ..lineTo(pos.dx - tileW / 2, pos.dy)
          ..close();

        // Corner Lake at (0, 0) if no building placed
        if (x == 0 && y == 0 && !hasLakeBuilding) {
          _drawLakeTile(canvas, pos, tileW, tileH, ambientOffset);
          continue;
        }

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

        // Central fountain plaza at (1,2)
        if (x == 1 && y == 2) {
          final fountainPlazaPaint = Paint()..color = const Color(0xFFE2E8F0);
          canvas.drawCircle(pos, 16, fountainPlazaPaint);
          final fountainWaterPaint = Paint()..color = const Color(0xFF38BDF8);
          canvas.drawCircle(pos, 11, fountainWaterPaint);
          final rimPaint = Paint()
            ..color = Colors.white
            ..style = PaintingStyle.stroke
            ..strokeWidth = 2.5;
          canvas.drawCircle(pos, 11, rimPaint);
        }
      }
    }

    // 3. Draw Road Network (Cobblestone/Asphalt with Dashed Centerlines)
    _drawRoadNetwork(canvas, originX, originY, tileW, tileH);

    // 4. Draw Trees on perimeter
    _drawPerimeterTrees(canvas, originX, originY, tileW, tileH);

    // 5. Draw 3D Isometric Buildings in Painter-Depth Order (x + y sorting)
    final sortedBuildings = List<PlacedBuildingModel>.from(placedBuildings)
      ..sort((a, b) => (a.gridX + a.gridY).compareTo(b.gridX + b.gridY));

    for (final b in sortedBuildings) {
      final pos = _toScreen(b.gridX, b.gridY, originX, originY, tileW, tileH);

      final isCurrentlyBuilding = animatingGridX == b.gridX && animatingGridY == b.gridY;
      final scale = isCurrentlyBuilding
          ? Curves.elasticOut.transform(constructionProgress.clamp(0.0, 1.0))
          : 1.0;

      canvas.save();
      canvas.translate(pos.dx, pos.dy);
      canvas.scale(scale);
      canvas.translate(-pos.dx, -pos.dy);

      _drawBuildingByType(canvas, pos, b.buildingKey);

      // Construction confetti & dust puff animation
      if (isCurrentlyBuilding && constructionProgress < 0.95) {
        _drawConstructionEffects(canvas, pos, constructionProgress);
      }

      canvas.restore();
    }

    // 6. Draw Citizens (Fuqarolar) strolling around plaza and paths
    _drawCitizens(canvas, originX, originY, tileW, tileH, ambientOffset, citizenCount);

    // 7. Draw 60fps Moving Isometric Car along the Road Loop
    _drawMovingCar(canvas, originX, originY, tileW, tileH, carProgress, carColor, carLevel, carModel);
  }

  // --- Natural Shimmering Lake ---
  void _drawLakeTile(Canvas canvas, Offset pos, double tw, double th, double offset) {
    final lakePath = Path()
      ..moveTo(pos.dx, pos.dy - th / 2)
      ..lineTo(pos.dx + tw / 2, pos.dy)
      ..lineTo(pos.dx, pos.dy + th / 2)
      ..lineTo(pos.dx - tw / 2, pos.dy)
      ..close();

    // Sand shoreline
    final sandPaint = Paint()..color = const Color(0xFFFDE68A);
    canvas.drawPath(lakePath, sandPaint);

    // Water pool
    final waterRect = Rect.fromCenter(center: pos, width: tw * 0.78, height: th * 0.78);
    final waterPaint = Paint()
      ..shader = const LinearGradient(
        colors: [Color(0xFF38BDF8), Color(0xFF0284C7)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ).createShader(waterRect);
    canvas.drawOval(waterRect, waterPaint);

    // Animated water ripples
    final ripplePaint = Paint()
      ..color = Colors.white.withOpacity(0.5)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.2;
    final r1 = (waterRect.width * 0.25) + math.sin(offset * 2 * math.pi) * 3;
    final r2 = (waterRect.width * 0.45) + math.cos(offset * 2 * math.pi) * 4;
    canvas.drawOval(Rect.fromCenter(center: pos, width: r1, height: r1 * 0.5), ripplePaint);
    canvas.drawOval(Rect.fromCenter(center: pos, width: r2, height: r2 * 0.5), ripplePaint);

    // Lotus Water Lily
    canvas.drawCircle(Offset(pos.dx - 8, pos.dy - 2), 4, Paint()..color = const Color(0xFF10B981));
    canvas.drawCircle(Offset(pos.dx - 8, pos.dy - 2), 2, Paint()..color = const Color(0xFFF43F5E));
  }

  // --- Road Network ---
  void _drawRoadNetwork(Canvas canvas, double ox, double oy, double tw, double th) {
    final roadPaint = Paint()
      ..color = const Color(0xFF94A3B8)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 6.0
      ..strokeCap = StrokeCap.round;

    final dashPaint = Paint()
      ..color = Colors.white.withOpacity(0.8)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.2;

    // Outer road ring linking (0,0) -> (3,0) -> (3,3) -> (0,3) -> (0,0)
    final p0 = _toScreen(0, 0, ox, oy, tw, th);
    final p1 = _toScreen(3, 0, ox, oy, tw, th);
    final p2 = _toScreen(3, 3, ox, oy, tw, th);
    final p3 = _toScreen(0, 3, ox, oy, tw, th);

    final roadLoop = Path()
      ..moveTo(p0.dx, p0.dy)
      ..lineTo(p1.dx, p1.dy)
      ..lineTo(p2.dx, p2.dy)
      ..lineTo(p3.dx, p3.dy)
      ..close();

    canvas.drawPath(roadLoop, roadPaint);
    canvas.drawPath(roadLoop, dashPaint);
  }

  // --- Perimeter 3D Trees ---
  void _drawPerimeterTrees(Canvas canvas, double ox, double oy, double tw, double th) {
    final treePlots = [
      _toScreen(0, 1, ox, oy, tw, th) + const Offset(-24, 0),
      _toScreen(1, 0, ox, oy, tw, th) + const Offset(0, -18),
      _toScreen(2, 3, ox, oy, tw, th) + const Offset(18, 12),
      _toScreen(3, 2, ox, oy, tw, th) + const Offset(20, -10),
    ];

    for (final tPos in treePlots) {
      _drawSingleTree(canvas, tPos);
    }
  }

  void _drawSingleTree(Canvas canvas, Offset pos) {
    // Tree Trunk
    canvas.drawRect(
      Rect.fromLTWH(pos.dx - 2, pos.dy - 8, 4, 10),
      Paint()..color = const Color(0xFF78350F),
    );
    // Tree Foliage (Double dome)
    canvas.drawCircle(Offset(pos.dx, pos.dy - 14), 9, Paint()..color = const Color(0xFF15803D));
    canvas.drawCircle(Offset(pos.dx, pos.dy - 17), 7, Paint()..color = const Color(0xFF22C55E));
  }

  // --- Moving 60fps Isometric Car ---
  void _drawMovingCar(
    Canvas canvas,
    double ox,
    double oy,
    double tw,
    double th,
    double progress,
    Color color,
    int level,
    String model,
  ) {
    // 4 Waypoints around road perimeter
    final p0 = _toScreen(0, 0, ox, oy, tw, th);
    final p1 = _toScreen(3, 0, ox, oy, tw, th);
    final p2 = _toScreen(3, 3, ox, oy, tw, th);
    final p3 = _toScreen(0, 3, ox, oy, tw, th);
    final points = [p0, p1, p2, p3, p0];

    final tScaled = (progress * 4.0);
    final segment = tScaled.floor().clamp(0, 3);
    final segT = tScaled - segment;

    final start = points[segment];
    final end = points[segment + 1];
    final carX = start.dx + (end.dx - start.dx) * segT;
    final carY = start.dy + (end.dy - start.dy) * segT;

    final carPos = Offset(carX, carY);

    // Car Shadow
    canvas.drawOval(
      Rect.fromCenter(center: carPos + const Offset(0, 2), width: 22, height: 10),
      Paint()..color = Colors.black.withOpacity(0.25),
    );

    // Chassis Box
    final chassisPath = Path()
      ..moveTo(carPos.dx, carPos.dy - 4)
      ..lineTo(carPos.dx + 10, carPos.dy)
      ..lineTo(carPos.dx, carPos.dy + 4)
      ..lineTo(carPos.dx - 10, carPos.dy)
      ..close();
    canvas.drawPath(chassisPath, Paint()..color = color);

    // Roof / Windshield
    final roofPath = Path()
      ..moveTo(carPos.dx, carPos.dy - 7)
      ..lineTo(carPos.dx + 6, carPos.dy - 4)
      ..lineTo(carPos.dx, carPos.dy - 1)
      ..lineTo(carPos.dx - 6, carPos.dy - 4)
      ..close();
    canvas.drawPath(roofPath, Paint()..color = Colors.lightBlueAccent.withOpacity(0.9));

    // Headlights
    canvas.drawCircle(carPos + const Offset(7, 2), 1.8, Paint()..color = const Color(0xFFFDE047));

    // Wheels
    canvas.drawCircle(carPos + const Offset(-6, 2), 2.2, Paint()..color = const Color(0xFF1E293B));
    canvas.drawCircle(carPos + const Offset(4, 3), 2.2, Paint()..color = const Color(0xFF1E293B));

    // Sportkar / Cyber-avto upgrades
    if (level >= 2) {
      // Rear spoiler
      canvas.drawRect(
        Rect.fromLTWH(carPos.dx - 9, carPos.dy - 7, 3, 2),
        Paint()..color = const Color(0xFF0F172A),
      );
    }
    if (level >= 3) {
      // Neon Cyber glow
      canvas.drawCircle(
        carPos,
        14,
        Paint()
          ..color = const Color(0xFF06B6D4).withOpacity(0.3)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1.5,
      );
    }
  }

  // --- Citizens (Fuqarolar) Strolling ---
  void _drawCitizens(
    Canvas canvas,
    double ox,
    double oy,
    double tw,
    double th,
    double offset,
    int count,
  ) {
    final plazaCenter = _toScreen(1, 2, ox, oy, tw, th);
    final visibleCount = count.clamp(4, 10);
    final citizenColors = [
      const Color(0xFF4F46E5),
      const Color(0xFFEC4899),
      const Color(0xFF10B981),
      const Color(0xFFF59E0B),
      const Color(0xFF06B6D4),
    ];

    for (int i = 0; i < visibleCount; i++) {
      final angle = (i * (2 * math.pi / visibleCount)) + (offset * 2 * math.pi);
      final radius = 24.0 + (i % 3) * 6.0;
      final citizenX = plazaCenter.dx + math.cos(angle) * radius;
      final citizenY = plazaCenter.dy + math.sin(angle) * (radius * 0.5);

      final bob = math.sin((offset * 4 * math.pi) + i) * 2.0;

      final pos = Offset(citizenX, citizenY - bob);

      // Shadow
      canvas.drawOval(
        Rect.fromCenter(center: Offset(citizenX, citizenY + 3), width: 8, height: 4),
        Paint()..color = Colors.black.withOpacity(0.2),
      );

      // Body (Shirt)
      final shirtCol = citizenColors[i % citizenColors.length];
      canvas.drawRRect(
        RRect.fromRectAndRadius(
          Rect.fromLTWH(pos.dx - 3, pos.dy - 6, 6, 7),
          const Radius.circular(2),
        ),
        Paint()..color = shirtCol,
      );

      // Head
      canvas.drawCircle(
        Offset(pos.dx, pos.dy - 9),
        3,
        Paint()..color = const Color(0xFFFED7AA),
      );
    }
  }

  // --- Construction Effects (Confetti & Dust) ---
  void _drawConstructionEffects(Canvas canvas, Offset pos, double progress) {
    final random = math.Random(42);
    final colors = [
      const Color(0xFFFFD700),
      const Color(0xFFFF69B4),
      const Color(0xFF00CED1),
      const Color(0xFF32CD32),
    ];

    for (int i = 0; i < 12; i++) {
      final angle = (i / 12) * math.pi * 2;
      final dist = (1.0 - progress) * 35.0;
      final pX = pos.dx + math.cos(angle) * dist + (random.nextDouble() * 6);
      final pY = pos.dy - 30 - ((1.0 - progress) * 25.0) + math.sin(angle) * 8;

      canvas.drawCircle(
        Offset(pX, pY),
        2.5,
        Paint()..color = colors[i % colors.length].withOpacity((1.0 - progress).clamp(0.0, 1.0)),
      );
    }
  }

  void _drawBuildingByType(Canvas canvas, Offset pos, String key) {
    switch (key) {
      case 'house_small':
        _drawSmallHouse(canvas, pos);
        break;
      case 'house_basic':
        _drawPastelHouse(canvas, pos);
        break;
      case 'house_modern':
        _drawModernHouse(canvas, pos);
        break;
      case 'house_villa':
        _drawVilla(canvas, pos);
        break;
      case 'house_premium':
        _drawPremiumCastle(canvas, pos);
        break;
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
      default:
        _drawPastelHouse(canvas, pos);
        break;
    }
  }

  void _drawSmallHouse(Canvas canvas, Offset pos) {
    const w = 18.0;
    const h = 20.0;
    final leftWall = Path()
      ..moveTo(pos.dx, pos.dy)
      ..lineTo(pos.dx - w, pos.dy - w / 2)
      ..lineTo(pos.dx - w, pos.dy - w / 2 - h)
      ..lineTo(pos.dx, pos.dy - h)
      ..close();
    canvas.drawPath(leftWall, Paint()..color = const Color(0xFFFFD54F));

    final rightWall = Path()
      ..moveTo(pos.dx, pos.dy)
      ..lineTo(pos.dx + w, pos.dy - w / 2)
      ..lineTo(pos.dx + w, pos.dy - w / 2 - h)
      ..lineTo(pos.dx, pos.dy - h)
      ..close();
    canvas.drawPath(rightWall, Paint()..color = const Color(0xFFFFB300));

    final roof = Path()
      ..moveTo(pos.dx, pos.dy - h - 10)
      ..lineTo(pos.dx + w + 2, pos.dy - w / 2 - h)
      ..lineTo(pos.dx, pos.dy - h)
      ..lineTo(pos.dx - w - 2, pos.dy - w / 2 - h)
      ..close();
    canvas.drawPath(roof, Paint()..color = const Color(0xFF26A69A));
  }

  void _drawModernHouse(Canvas canvas, Offset pos) {
    const w = 28.0;
    const h = 40.0;
    final leftWall = Path()
      ..moveTo(pos.dx, pos.dy)
      ..lineTo(pos.dx - w, pos.dy - w / 2)
      ..lineTo(pos.dx - w, pos.dy - w / 2 - h)
      ..lineTo(pos.dx, pos.dy - h)
      ..close();
    canvas.drawPath(leftWall, Paint()..color = const Color(0xFF81D4FA));

    final rightWall = Path()
      ..moveTo(pos.dx, pos.dy)
      ..lineTo(pos.dx + w, pos.dy - w / 2)
      ..lineTo(pos.dx + w, pos.dy - w / 2 - h)
      ..lineTo(pos.dx, pos.dy - h)
      ..close();
    canvas.drawPath(rightWall, Paint()..color = const Color(0xFF29B6F6));
  }

  void _drawVilla(Canvas canvas, Offset pos) {
    const w = 32.0;
    const h = 42.0;
    final leftWall = Path()
      ..moveTo(pos.dx, pos.dy)
      ..lineTo(pos.dx - w, pos.dy - w / 2)
      ..lineTo(pos.dx - w, pos.dy - w / 2 - h)
      ..lineTo(pos.dx, pos.dy - h)
      ..close();
    canvas.drawPath(leftWall, Paint()..color = const Color(0xFFFFCC80));

    final rightWall = Path()
      ..moveTo(pos.dx, pos.dy)
      ..lineTo(pos.dx + w, pos.dy - w / 2)
      ..lineTo(pos.dx + w, pos.dy - w / 2 - h)
      ..lineTo(pos.dx, pos.dy - h)
      ..close();
    canvas.drawPath(rightWall, Paint()..color = const Color(0xFFFFA726));
  }

  void _drawPremiumCastle(Canvas canvas, Offset pos) {
    const w = 34.0;
    const h = 54.0;
    final leftWall = Path()
      ..moveTo(pos.dx, pos.dy)
      ..lineTo(pos.dx - w, pos.dy - w / 2)
      ..lineTo(pos.dx - w, pos.dy - w / 2 - h)
      ..lineTo(pos.dx, pos.dy - h)
      ..close();
    canvas.drawPath(leftWall, Paint()..color = const Color(0xFFCE93D8));

    final rightWall = Path()
      ..moveTo(pos.dx, pos.dy)
      ..lineTo(pos.dx + w, pos.dy - w / 2)
      ..lineTo(pos.dx + w, pos.dy - w / 2 - h)
      ..lineTo(pos.dx, pos.dy - h)
      ..close();
    canvas.drawPath(rightWall, Paint()..color = const Color(0xFFAB47BC));
  }

  void _drawPastelHouse(Canvas canvas, Offset pos) {
    const w = 24.0;
    const h = 32.0;
    final leftWall = Path()
      ..moveTo(pos.dx, pos.dy)
      ..lineTo(pos.dx - w, pos.dy - w / 2)
      ..lineTo(pos.dx - w, pos.dy - w / 2 - h)
      ..lineTo(pos.dx, pos.dy - h)
      ..close();
    canvas.drawPath(leftWall, Paint()..color = const Color(0xFFF9A8D4));

    final rightWall = Path()
      ..moveTo(pos.dx, pos.dy)
      ..lineTo(pos.dx + w, pos.dy - w / 2)
      ..lineTo(pos.dx + w, pos.dy - w / 2 - h)
      ..lineTo(pos.dx, pos.dy - h)
      ..close();
    canvas.drawPath(rightWall, Paint()..color = const Color(0xFFF472B6));

    final roof = Path()
      ..moveTo(pos.dx, pos.dy - h - 14)
      ..lineTo(pos.dx + w + 2, pos.dy - w / 2 - h)
      ..lineTo(pos.dx, pos.dy - h)
      ..lineTo(pos.dx - w - 2, pos.dy - w / 2 - h)
      ..close();
    canvas.drawPath(roof, Paint()..color = const Color(0xFF6366F1));
  }

  void _drawMediumHouse(Canvas canvas, Offset pos) {
    _drawPastelHouse(canvas, pos);
  }

  void _drawObservatoryTower(Canvas canvas, Offset pos) {
    const w = 24.0;
    const h = 46.0;
    final leftWall = Path()
      ..moveTo(pos.dx, pos.dy)
      ..lineTo(pos.dx - w, pos.dy - w / 2)
      ..lineTo(pos.dx - w, pos.dy - w / 2 - h)
      ..lineTo(pos.dx, pos.dy - h)
      ..close();
    canvas.drawPath(leftWall, Paint()..color = const Color(0xFF475569));

    final rightWall = Path()
      ..moveTo(pos.dx, pos.dy)
      ..lineTo(pos.dx + w, pos.dy - w / 2)
      ..lineTo(pos.dx + w, pos.dy - w / 2 - h)
      ..lineTo(pos.dx, pos.dy - h)
      ..close();
    canvas.drawPath(rightWall, Paint()..color = const Color(0xFF334155));

    // Dome on top
    canvas.drawArc(
      Rect.fromCircle(center: Offset(pos.dx, pos.dy - h - 4), radius: 14),
      math.pi,
      math.pi,
      true,
      Paint()..color = const Color(0xFF38BDF8),
    );
  }

  void _drawSchool(Canvas canvas, Offset pos) {
    const w = 30.0;
    const h = 34.0;
    final leftWall = Path()
      ..moveTo(pos.dx, pos.dy)
      ..lineTo(pos.dx - w, pos.dy - w / 2)
      ..lineTo(pos.dx - w, pos.dy - w / 2 - h)
      ..lineTo(pos.dx, pos.dy - h)
      ..close();
    canvas.drawPath(leftWall, Paint()..color = const Color(0xFFFDBA74));

    final rightWall = Path()
      ..moveTo(pos.dx, pos.dy)
      ..lineTo(pos.dx + w, pos.dy - w / 2)
      ..lineTo(pos.dx + w, pos.dy - w / 2 - h)
      ..lineTo(pos.dx, pos.dy - h)
      ..close();
    canvas.drawPath(rightWall, Paint()..color = const Color(0xFFFB923C));
  }

  void _drawLibrary(Canvas canvas, Offset pos) {
    const w = 28.0;
    const h = 36.0;
    final leftWall = Path()
      ..moveTo(pos.dx, pos.dy)
      ..lineTo(pos.dx - w, pos.dy - w / 2)
      ..lineTo(pos.dx - w, pos.dy - w / 2 - h)
      ..lineTo(pos.dx, pos.dy - h)
      ..close();
    canvas.drawPath(leftWall, Paint()..color = const Color(0xFFA5B4FC));

    final rightWall = Path()
      ..moveTo(pos.dx, pos.dy)
      ..lineTo(pos.dx + w, pos.dy - w / 2)
      ..lineTo(pos.dx + w, pos.dy - w / 2 - h)
      ..lineTo(pos.dx, pos.dy - h)
      ..close();
    canvas.drawPath(rightWall, Paint()..color = const Color(0xFF818CF8));
  }

  void _drawTreesPark(Canvas canvas, Offset pos) {
    _drawSingleTree(canvas, pos + const Offset(-10, 0));
    _drawSingleTree(canvas, pos + const Offset(10, -4));
  }

  void _drawMuseum(Canvas canvas, Offset pos) {
    _drawLibrary(canvas, pos);
  }

  void _drawPlayground(Canvas canvas, Offset pos) {
    canvas.drawCircle(pos, 8, Paint()..color = const Color(0xFFFBBF24));
  }

  void _drawCrystalFountain(Canvas canvas, Offset pos) {
    canvas.drawCircle(pos, 12, Paint()..color = const Color(0xFF38BDF8));
  }

  void _drawDecorativeTrees(Canvas canvas, Offset pos) {
    _drawSingleTree(canvas, pos);
  }

  Offset _toScreen(int gx, int gy, double ox, double oy, double tw, double th) {
    return Offset(
      ox + (gx - gy) * (tw / 2),
      oy + (gx + gy) * (th / 2),
    );
  }

  @override
  bool shouldRepaint(covariant IsometricIslandPainter oldDelegate) => true;
}
