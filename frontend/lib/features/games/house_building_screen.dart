import 'dart:math' as math;
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/network/api_client.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/coin_badge.dart';
import '../../core/widgets/xp_coin.dart';
import '../../shared/providers/student_provider.dart';

/// Data model for each construction stage of the 3D modern villa
class HouseStage {
  final int stage;
  final String title;
  final String description;
  final int cost;
  final int xp;
  final IconData icon;

  const HouseStage({
    required this.stage,
    required this.title,
    required this.description,
    required this.cost,
    required this.xp,
    required this.icon,
  });
}

/// Authoritative 6-stage construction sequence matching backend and requirements
const List<HouseStage> kHouseStages = [
  HouseStage(
    stage: 1,
    title: 'Poydevor',
    description: 'Mustahkam beton poydevor va yer maydoni',
    cost: 50,
    xp: 50,
    icon: Icons.foundation_rounded,
  ),
  HouseStage(
    stage: 2,
    title: 'Uy devorlari',
    description: 'Zamonaviy arxitektura va g‘ishtli devorlar',
    cost: 150,
    xp: 150,
    icon: Icons.apartment_rounded,
  ),
  HouseStage(
    stage: 3,
    title: 'Uy tomi',
    description: 'Zamonaviy terassali tekis tom va basseyn',
    cost: 100,
    xp: 100,
    icon: Icons.roofing_rounded,
  ),
  HouseStage(
    stage: 4,
    title: 'Derazalar',
    description: 'Panoramali shaffof oynali derazalar',
    cost: 50,
    xp: 80,
    icon: Icons.window_rounded,
  ),
  HouseStage(
    stage: 5,
    title: 'Eshiklar',
    description: 'Yog‘och kirish eshigi va garaj darvozasi',
    cost: 90,
    xp: 100,
    icon: Icons.meeting_room_rounded,
  ),
  HouseStage(
    stage: 6,
    title: 'Mashina',
    description: 'Hovlida zamonaviy sport avtomobili va landshaft',
    cost: 300,
    xp: 300,
    icon: Icons.directions_car_rounded,
  ),
];

class HouseBuildingScreen extends ConsumerStatefulWidget {
  const HouseBuildingScreen({super.key});

  @override
  ConsumerState<HouseBuildingScreen> createState() => _HouseBuildingScreenState();
}

class _HouseBuildingScreenState extends ConsumerState<HouseBuildingScreen>
    with TickerProviderStateMixin {
  int _currentStage = 0;
  bool _isLoading = false;
  bool _isBuilding = false;

  // 3D Camera Controls
  double _theta = 45.0 * (math.pi / 180.0); // Horizontal azimuth angle
  double _phi = 32.0 * (math.pi / 180.0);   // Vertical elevation angle (isometric)
  double _zoom = 1.0;                       // Zoom scale (0.75 - 2.2)
  Offset _panOffset = Offset.zero;          // Pan offset

  // Touch tracking for gestures
  double _baseZoom = 1.0;
  Offset _lastPan = Offset.zero;

  // Night Mode inside 3D viewer (can toggle independently or follow app theme)
  bool? _is3DNightModeOverride;

  // Fullscreen mode
  bool _isFullscreen = false;

  // Animation controllers
  late AnimationController _buildAnimController;
  late Animation<double> _buildScaleAnim;
  late AnimationController _particleAnimController;
  late AnimationController _confettiAnimController;

  // Confetti particles for stage 6 completion
  final List<_ConfettiParticle> _confetti = [];
  final math.Random _random = math.Random();

  @override
  void initState() {
    super.initState();

    _buildAnimController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );
    _buildScaleAnim = TweenSequence<double>([
      TweenSequenceItem(
        tween: Tween<double>(begin: 1.0, end: 1.08)
            .chain(CurveTween(curve: Curves.easeOutBack)),
        weight: 50,
      ),
      TweenSequenceItem(
        tween: Tween<double>(begin: 1.08, end: 1.0)
            .chain(CurveTween(curve: Curves.bounceOut)),
        weight: 50,
      ),
    ]).animate(_buildAnimController);

    _particleAnimController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    );

    _confettiAnimController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2500),
    )..addListener(() {
        if (mounted) setState(() {});
      });

    _loadProgress();
  }

  @override
  void dispose() {
    _buildAnimController.dispose();
    _particleAnimController.dispose();
    _confettiAnimController.dispose();
    super.dispose();
  }

  void _triggerConfetti() {
    _confetti.clear();
    for (int i = 0; i < 60; i++) {
      _confetti.add(_ConfettiParticle(
        x: 0.1 + _random.nextDouble() * 0.8,
        y: -0.1 - _random.nextDouble() * 0.4,
        vx: (_random.nextDouble() - 0.5) * 0.4,
        vy: 0.3 + _random.nextDouble() * 0.7,
        size: 5 + _random.nextDouble() * 7,
        color: [
          const Color(0xFFF59E0B),
          const Color(0xFF8B5CF6),
          const Color(0xFFEC4899),
          const Color(0xFF10B981),
          const Color(0xFF3B82F6),
          const Color(0xFFEAB308),
        ][_random.nextInt(6)],
        rotation: _random.nextDouble() * math.pi * 2,
        vRot: (_random.nextDouble() - 0.5) * 6,
      ));
    }
    _confettiAnimController.forward(from: 0.0);
  }

  Future<void> _loadProgress() async {
    final prefs = await SharedPreferences.getInstance();
    final cachedStage = prefs.getInt('mc_house_building_stage') ?? 0;
    if (mounted) {
      setState(() {
        _currentStage = cachedStage;
      });
    }

    try {
      final res = await ApiClient().dio.get('/games/house-building');
      if (res.data != null && res.data['success'] == true) {
        final data = res.data['data'];
        final stage = (data['currentStage'] as num?)?.toInt() ?? 0;
        if (mounted) {
          setState(() {
            _currentStage = stage;
            _isLoading = false;
          });
          await prefs.setInt('mc_house_building_stage', stage);
        }
        return;
      }
    } catch (_) {
      // Offline fallback
    }

    if (mounted) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _resetCamera() {
    HapticFeedback.lightImpact();
    setState(() {
      _theta = 45.0 * (math.pi / 180.0);
      _phi = 32.0 * (math.pi / 180.0);
      _zoom = 1.0;
      _panOffset = Offset.zero;
    });
  }

  Future<void> _buildStage(HouseStage stage) async {
    final student = ref.read(studentProvider).student;
    final currentCoins = student?.coinBalance ?? 0;

    if (currentCoins < stage.cost) {
      HapticFeedback.mediumImpact();
      _showNotEnoughCoinsDialog(stage);
      return;
    }

    HapticFeedback.heavyImpact();
    setState(() {
      _isBuilding = true;
    });
    _particleAnimController.forward(from: 0.0);

    final prefs = await SharedPreferences.getInstance();

    try {
      final res = await ApiClient().dio.post(
        '/games/house-building/build',
        data: {'stage': stage.stage},
      );

      if (res.data != null && res.data['success'] == true) {
        final newStage = stage.stage;
        ref.read(studentProvider.notifier).updateCoins(-stage.cost);
        ref.read(studentProvider.notifier).updateXP(stage.xp);
        await prefs.setInt('mc_house_building_stage', newStage);

        if (mounted) {
          setState(() {
            _currentStage = newStage;
            _isBuilding = false;
          });
          _buildAnimController.forward(from: 0.0);
          if (newStage >= 6) {
            _triggerConfetti();
          }
          _showStageCelebration(stage);
        }
        return;
      }
    } catch (_) {
      // Fallback offline progression
      final newStage = stage.stage;
      ref.read(studentProvider.notifier).updateCoins(-stage.cost);
      ref.read(studentProvider.notifier).updateXP(stage.xp);
      await prefs.setInt('mc_house_building_stage', newStage);

      if (mounted) {
        setState(() {
          _currentStage = newStage;
          _isBuilding = false;
        });
        _buildAnimController.forward(from: 0.0);
        if (newStage >= 6) {
          _triggerConfetti();
        }
        _showStageCelebration(stage);
      }
    }
  }

  void _showNotEnoughCoinsDialog(HouseStage stage) {
    final appColors = Theme.of(context).extension<AppThemeColors>();
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final needed = stage.cost;
    final student = ref.read(studentProvider).student;
    final userCoins = student?.coinBalance ?? 0;

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: appColors?.card ?? (isDark ? const Color(0xFF1B182C) : Colors.white),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: BorderSide(
            color: appColors?.border ?? (isDark ? const Color(0xFF302A46) : const Color(0xFFE2E5EF)),
          ),
        ),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.amber.withValues(alpha: 0.2),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.monetization_on_rounded, color: Colors.amber, size: 28),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                'Tangalar yetarli emas!',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: appColors?.ink ?? (isDark ? Colors.white : const Color(0xFF17152B)),
                ),
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '${stage.title} bosqichini qurish uchun sizga $needed ta tanga kerak.',
              style: TextStyle(
                fontSize: 14,
                color: appColors?.muted ?? (isDark ? const Color(0xFFB5B2C7) : const Color(0xFF626579)),
              ),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF26213B) : const Color(0xFFF1F3F9),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Sizdagi tangalar:',
                    style: TextStyle(
                      fontSize: 13,
                      color: appColors?.ink ?? (isDark ? Colors.white : const Color(0xFF17152B)),
                    ),
                  ),
                  Row(
                    children: [
                      const CoinBadge(count: 0, size: 18),
                      const SizedBox(width: 4),
                      Text(
                        '$userCoins ta',
                        style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.amber),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            Text(
              '💡 Maslahat: Yangi misollar yechib tangalaringizni ko‘paytiring!',
              style: TextStyle(
                fontSize: 12,
                fontStyle: FontStyle.italic,
                color: appColors?.primary ?? const Color(0xFF7C3AED),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: Text(
              'Tushundim',
              style: TextStyle(
                color: appColors?.muted ?? (isDark ? Colors.white70 : const Color(0xFF626579)),
              ),
            ),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(ctx).pop();
              context.push('/lessons');
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF7C3AED),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            ),
            child: const Text('Misol yechish', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  void _showStageCelebration(HouseStage stage) {
    final isFinal = stage.stage >= 6;
    final appColors = Theme.of(context).extension<AppThemeColors>();
    final isDark = Theme.of(context).brightness == Brightness.dark;

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: appColors?.card ?? (isDark ? const Color(0xFF1B182C) : Colors.white),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(26),
          side: BorderSide(
            color: isFinal ? Colors.amber : (appColors?.primary ?? const Color(0xFF7C3AED)),
            width: 2,
          ),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 76,
              height: 76,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: isFinal
                      ? [const Color(0xFFF59E0B), const Color(0xFFEF4444)]
                      : [const Color(0xFF8B5CF6), const Color(0xFF3B82F6)],
                ),
                boxShadow: [
                  BoxShadow(
                    color: (isFinal ? Colors.amber : const Color(0xFF8B5CF6)).withValues(alpha: 0.5),
                    blurRadius: 20,
                    spreadRadius: 4,
                  ),
                ],
              ),
              child: Icon(
                isFinal ? Icons.emoji_events_rounded : Icons.check_circle_rounded,
                color: Colors.white,
                size: 44,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              isFinal ? 'G‘ALABA! VILLA TAYYOR! 🏆' : '${stage.title} qurildi! ✨',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: isFinal
                    ? Colors.amber
                    : (appColors?.ink ?? (isDark ? Colors.white : const Color(0xFF17152B))),
                fontWeight: FontWeight.bold,
                fontSize: isFinal ? 20 : 18,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              isFinal
                  ? 'Tabriklaymiz! Siz o‘z orzuingizdagi zamonaviy 3D villani to‘liq barpo etdingiz va katta me’mor unvoniga sazovor bo‘ldingiz!'
                  : 'Ajoyib natija! Uyingizning yangi bosqichi muvaffaqiyatli qurildi.',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: appColors?.muted ?? (isDark ? const Color(0xFFB5B2C7) : const Color(0xFF626579)),
                fontSize: 13,
              ),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFF7C3AED).withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFA855F7).withValues(alpha: 0.4)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const XpCoin(size: 22, showGlow: false),
                  const SizedBox(width: 8),
                  Text(
                    '+${stage.xp} XP mukofoti!',
                    style: const TextStyle(
                      color: Color(0xFF7C3AED),
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          Center(
            child: ElevatedButton(
              onPressed: () => Navigator.of(ctx).pop(),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF7C3AED),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              child: const Text('Davom etish', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final student = ref.watch(studentProvider).student;
    final coins = student?.coinBalance ?? 0;
    final xp = student?.totalXP ?? 0;

    final appColors = Theme.of(context).extension<AppThemeColors>();
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final effective3DNight = _is3DNightModeOverride ?? isDark;

    return Scaffold(
      backgroundColor: appColors?.bg ?? (isDark ? const Color(0xFF0D0B18) : const Color(0xFFF7F8FC)),
      body: SafeArea(
        child: Column(
          children: [
            _buildTopBar(coins, xp, appColors, isDark),
            Expanded(
              child: _isLoading
                  ? Center(
                      child: CircularProgressIndicator(
                        color: appColors?.primary ?? const Color(0xFF7C3AED),
                      ),
                    )
                  : Stack(
                      children: [
                        // Main content: 3D Stage on top, overview & cards below
                        Column(
                          children: [
                            // 3D Viewport container
                            Expanded(
                              flex: _isFullscreen ? 1 : 5,
                              child: _build3DViewport(effective3DNight, appColors, isDark),
                            ),
                            if (!_isFullscreen) ...[
                              // Progress overview bar
                              _buildProgressOverview(appColors, isDark),
                              // Horizontal scrollable stage cards
                              _buildStagesHorizontalList(coins, appColors, isDark),
                            ],
                          ],
                        ),

                        // Confetti overlay on stage 6 completion
                        if (_confettiAnimController.isAnimating)
                          IgnorePointer(
                            child: CustomPaint(
                              size: Size.infinite,
                              painter: _ConfettiPainter(
                                particles: _confetti,
                                progress: _confettiAnimController.value,
                              ),
                            ),
                          ),
                      ],
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopBar(int coins, int xp, AppThemeColors? appColors, bool isDark) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: appColors?.card ?? (isDark ? const Color(0xFF1B182C) : Colors.white),
        border: Border(
          bottom: BorderSide(
            color: appColors?.border ?? (isDark ? const Color(0xFF302A46) : const Color(0xFFE2E5EF)),
          ),
        ),
      ),
      child: Row(
        children: [
          IconButton(
            onPressed: () => context.pop(),
            icon: Icon(
              Icons.arrow_back_ios_new_rounded,
              color: appColors?.ink ?? (isDark ? Colors.white : const Color(0xFF17152B)),
              size: 20,
            ),
            tooltip: 'Orqaga',
          ),
          const SizedBox(width: 4),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Uy qurish',
                  style: TextStyle(
                    color: appColors?.ink ?? (isDark ? Colors.white : const Color(0xFF17152B)),
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                  ),
                ),
                Text(
                  'Orzuingizdagi uyni quring',
                  style: TextStyle(
                    color: appColors?.muted ?? (isDark ? const Color(0xFFB5B2C7) : const Color(0xFF626579)),
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          CoinBadge(count: coins, size: 26),
          const SizedBox(width: 8),
          XpBadge(count: xp, size: 26),
        ],
      ),
    );
  }

  Widget _build3DViewport(bool effectiveNight, AppThemeColors? appColors, bool isDark) {
    return ScaleTransition(
      scale: _buildScaleAnim,
      child: Container(
        margin: _isFullscreen ? EdgeInsets.zero : const EdgeInsets.fromLTRB(16, 12, 16, 8),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(_isFullscreen ? 0 : 24),
          border: Border.all(
            color: effectiveNight
                ? const Color(0xFF382963)
                : const Color(0xFFC7D2FE),
            width: 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: effectiveNight
                  ? const Color(0xFF6D28D9).withValues(alpha: 0.25)
                  : const Color(0xFF6366F1).withValues(alpha: 0.15),
              blurRadius: 20,
              spreadRadius: 2,
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(_isFullscreen ? 0 : 24),
          child: Stack(
            children: [
              // Interactive 3D Canvas
              GestureDetector(
                onScaleStart: (details) {
                  _baseZoom = _zoom;
                  _lastPan = details.localFocalPoint;
                },
                onScaleUpdate: (details) {
                  setState(() {
                    // Zoom with clamp
                    _zoom = (_baseZoom * details.scale).clamp(0.7, 2.2);

                    // Orbit rotation when dragging
                    final delta = details.localFocalPoint - _lastPan;
                    _lastPan = details.localFocalPoint;

                    _theta += delta.dx * 0.01;
                    _phi = (_phi - delta.dy * 0.008).clamp(0.25, 1.15); // Clamp elevation 14° - 66°
                  });
                },
                child: CustomPaint(
                  size: Size.infinite,
                  painter: _Realistic3DHousePainter(
                    stage: _currentStage,
                    theta: _theta,
                    phi: _phi,
                    zoom: _zoom,
                    panOffset: _panOffset,
                    isNightMode: effectiveNight,
                    isBuilding: _isBuilding,
                    buildingParticleProgress: _particleAnimController.value,
                  ),
                ),
              ),

              // Status badge top-left
              Positioned(
                top: 14,
                left: 14,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: effectiveNight
                        ? const Color(0xFF0D0B18).withValues(alpha: 0.8)
                        : Colors.white.withValues(alpha: 0.9),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                      color: effectiveNight ? const Color(0xFF7C3AED) : const Color(0xFFE2E5EF),
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.15),
                        blurRadius: 8,
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        _currentStage >= 6 ? Icons.verified_rounded : Icons.construction_rounded,
                        color: _currentStage >= 6 ? Colors.amber : const Color(0xFF7C3AED),
                        size: 16,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        _currentStage >= 6
                            ? 'Villa to‘liq qurildi!'
                            : '$_currentStage/6: ${kHouseStages[math.max(0, _currentStage - 1)].title}',
                        style: TextStyle(
                          color: effectiveNight ? Colors.white : const Color(0xFF17152B),
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Floating camera control buttons top-right
              Positioned(
                top: 12,
                right: 12,
                child: Column(
                  children: [
                    // Day / Night Toggle
                    _buildFloatingButton(
                      icon: effectiveNight ? Icons.nightlight_round : Icons.wb_sunny_rounded,
                      tooltip: effectiveNight ? 'Kun rejimiga o‘tish' : 'Tun rejimiga o‘tish',
                      iconColor: effectiveNight ? const Color(0xFFFDE047) : const Color(0xFFF59E0B),
                      effectiveNight: effectiveNight,
                      onPressed: () {
                        HapticFeedback.lightImpact();
                        setState(() {
                          _is3DNightModeOverride = !effectiveNight;
                        });
                      },
                    ),
                    const SizedBox(height: 8),
                    // Reset Camera
                    _buildFloatingButton(
                      icon: Icons.restart_alt_rounded,
                      tooltip: 'Kamerani asl holatga qaytarish',
                      iconColor: effectiveNight ? Colors.white70 : const Color(0xFF626579),
                      effectiveNight: effectiveNight,
                      onPressed: _resetCamera,
                    ),
                    const SizedBox(height: 8),
                    // Zoom In
                    _buildFloatingButton(
                      icon: Icons.add_rounded,
                      tooltip: 'Kattalashtirish',
                      iconColor: effectiveNight ? Colors.white70 : const Color(0xFF626579),
                      effectiveNight: effectiveNight,
                      onPressed: () {
                        HapticFeedback.selectionClick();
                        setState(() {
                          _zoom = (_zoom * 1.2).clamp(0.7, 2.2);
                        });
                      },
                    ),
                    const SizedBox(height: 8),
                    // Zoom Out
                    _buildFloatingButton(
                      icon: Icons.remove_rounded,
                      tooltip: 'Kichiklashtirish',
                      iconColor: effectiveNight ? Colors.white70 : const Color(0xFF626579),
                      effectiveNight: effectiveNight,
                      onPressed: () {
                        HapticFeedback.selectionClick();
                        setState(() {
                          _zoom = (_zoom / 1.2).clamp(0.7, 2.2);
                        });
                      },
                    ),
                    const SizedBox(height: 8),
                    // Fullscreen
                    _buildFloatingButton(
                      icon: _isFullscreen ? Icons.fullscreen_exit_rounded : Icons.fullscreen_rounded,
                      tooltip: _isFullscreen ? 'Kichraytirish' : 'To‘liq ekran',
                      iconColor: effectiveNight ? Colors.white70 : const Color(0xFF626579),
                      effectiveNight: effectiveNight,
                      onPressed: () {
                        HapticFeedback.lightImpact();
                        setState(() {
                          _isFullscreen = !_isFullscreen;
                        });
                      },
                    ),
                  ],
                ),
              ),

              // Touch rotate hint bottom-left
              Positioned(
                bottom: 12,
                left: 14,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: effectiveNight
                        ? Colors.black.withValues(alpha: 0.6)
                        : Colors.white.withValues(alpha: 0.8),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.rotate_right_rounded,
                        color: effectiveNight ? Colors.white70 : const Color(0xFF626579),
                        size: 16,
                      ),
                      const SizedBox(width: 5),
                      Text(
                        'Aylantirish uchun bosing va suring',
                        style: TextStyle(
                          color: effectiveNight ? Colors.white70 : const Color(0xFF626579),
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Building loading indicator overlay
              if (_isBuilding)
                Container(
                  color: Colors.black45,
                  child: Center(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                      decoration: BoxDecoration(
                        color: effectiveNight
                            ? const Color(0xFF1B182C).withValues(alpha: 0.95)
                            : Colors.white.withValues(alpha: 0.95),
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(color: const Color(0xFF7C3AED)),
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const CircularProgressIndicator(color: Color(0xFF7C3AED)),
                          const SizedBox(height: 14),
                          Text(
                            'Qurilmoqda... 🔨',
                            style: TextStyle(
                              color: effectiveNight ? Colors.white : const Color(0xFF17152B),
                              fontWeight: FontWeight.bold,
                              fontSize: 15,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFloatingButton({
    required IconData icon,
    required String tooltip,
    required Color iconColor,
    required bool effectiveNight,
    required VoidCallback onPressed,
  }) {
    return Container(
      width: 36,
      height: 36,
      decoration: BoxDecoration(
        color: effectiveNight
            ? const Color(0xFF1B182C).withValues(alpha: 0.85)
            : Colors.white.withValues(alpha: 0.9),
        shape: BoxShape.circle,
        border: Border.all(
          color: effectiveNight ? const Color(0xFF4C3D77) : const Color(0xFFE2E5EF),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.15),
            blurRadius: 6,
          ),
        ],
      ),
      child: IconButton(
        icon: Icon(icon, color: iconColor, size: 18),
        padding: EdgeInsets.zero,
        tooltip: tooltip,
        onPressed: onPressed,
      ),
    );
  }

  Widget _buildProgressOverview(AppThemeColors? appColors, bool isDark) {
    final double percent = (_currentStage / 6.0).clamp(0.0, 1.0);
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: appColors?.card ?? (isDark ? const Color(0xFF1B182C) : Colors.white),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: appColors?.border ?? (isDark ? const Color(0xFF302A46) : const Color(0xFFE2E5EF)),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Qurilish jarayoni',
                  style: TextStyle(
                    color: appColors?.ink ?? (isDark ? Colors.white : const Color(0xFF17152B)),
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                Text(
                  '${(percent * 100).toInt()}% bajarildi',
                  style: const TextStyle(
                    color: Color(0xFF7C3AED),
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: LinearProgressIndicator(
                value: percent,
                minHeight: 10,
                backgroundColor: isDark ? const Color(0xFF302A46) : const Color(0xFFE2E5EF),
                valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF7C3AED)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStagesHorizontalList(int userCoins, AppThemeColors? appColors, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          child: Text(
            'Qurilish bosqichlari',
            style: TextStyle(
              color: appColors?.ink ?? (isDark ? Colors.white : const Color(0xFF17152B)),
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
        ),
        Container(
          height: 175,
          padding: const EdgeInsets.only(bottom: 8),
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: kHouseStages.length,
            itemBuilder: (context, index) {
          final st = kHouseStages[index];
          final isBuilt = _currentStage >= st.stage;
          final isNext = _currentStage == st.stage - 1;
          final isLocked = _currentStage < st.stage - 1;
          final canAfford = userCoins >= st.cost;

          return Container(
            width: 230,
            margin: const EdgeInsets.only(right: 12),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
            decoration: BoxDecoration(
              color: isBuilt
                  ? (isDark ? const Color(0xFF102620) : const Color(0xFFECFDF5))
                  : isNext
                      ? (isDark ? const Color(0xFF231846) : const Color(0xFFF5F3FF))
                      : (appColors?.card ?? (isDark ? const Color(0xFF1B182C) : Colors.white)),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: isBuilt
                    ? const Color(0xFF10B981)
                    : isNext
                        ? const Color(0xFF7C3AED)
                        : (appColors?.border ?? (isDark ? const Color(0xFF302A46) : const Color(0xFFE2E5EF))),
                width: isNext ? 2.0 : 1.0,
              ),
              boxShadow: isNext
                  ? [
                      BoxShadow(
                        color: const Color(0xFF7C3AED).withValues(alpha: 0.2),
                        blurRadius: 10,
                        spreadRadius: 1,
                      )
                    ]
                  : null,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: isBuilt
                            ? const Color(0xFF10B981).withValues(alpha: 0.2)
                            : isNext
                                ? const Color(0xFF7C3AED).withValues(alpha: 0.2)
                                : Colors.grey.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(
                        isBuilt
                            ? Icons.check_circle_rounded
                            : isLocked
                                ? Icons.lock_outline_rounded
                                : st.icon,
                        color: isBuilt
                            ? const Color(0xFF10B981)
                            : isNext
                                ? const Color(0xFF7C3AED)
                                : (appColors?.muted ?? (isDark ? Colors.white38 : Colors.grey)),
                        size: 20,
                      ),
                    ),
                    Row(
                      children: [
                        const XpCoin(size: 15, showGlow: false),
                        const SizedBox(width: 4),
                        Text(
                          '+${st.xp} XP',
                          style: TextStyle(
                            color: appColors?.primary ?? const Color(0xFF7C3AED),
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${st.stage}. ${st.title}',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        color: isLocked
                            ? (appColors?.muted ?? (isDark ? Colors.white38 : Colors.grey))
                            : (appColors?.ink ?? (isDark ? Colors.white : const Color(0xFF17152B))),
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      st.description,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        color: appColors?.muted ?? (isDark ? const Color(0xFFB5B2C7) : const Color(0xFF626579)),
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    if (!isBuilt)
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.monetization_on_rounded, color: Colors.amber, size: 16),
                          const SizedBox(width: 4),
                          Text(
                            '${st.cost}',
                            style: const TextStyle(
                              color: Colors.amber,
                              fontWeight: FontWeight.bold,
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                    const Spacer(),
                    if (isBuilt)
                      const Text(
                        'Qurildi ✓',
                        style: TextStyle(
                          color: Color(0xFF10B981),
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                        ),
                      )
                    else if (isNext)
                      ElevatedButton(
                        onPressed: _isBuilding ? null : () => _buildStage(st),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: canAfford ? const Color(0xFF7C3AED) : Colors.grey.shade600,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          minimumSize: const Size(52, 28),
                          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        child: Text(
                          canAfford ? 'Qurish' : 'Tanga kam',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11),
                        ),
                      )
                    else
                      Text(
                        'Qulflangan 🔒',
                        style: TextStyle(
                          color: appColors?.muted ?? (isDark ? Colors.white38 : Colors.grey),
                          fontSize: 11,
                        ),
                      ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    ),
    ],
    );
  }
}

/// Realistic 3D Isometric Painter that projects and renders 3D villa geometry
class _Realistic3DHousePainter extends CustomPainter {
  final int stage;
  final double theta; // Azimuth orbit angle (radians)
  final double phi;   // Elevation tilt angle (radians)
  final double zoom;  // Camera zoom factor
  final Offset panOffset;
  final bool isNightMode;
  final bool isBuilding;
  final double buildingParticleProgress;

  _Realistic3DHousePainter({
    required this.stage,
    required this.theta,
    required this.phi,
    required this.zoom,
    required this.panOffset,
    required this.isNightMode,
    required this.isBuilding,
    required this.buildingParticleProgress,
  });

  // Projection math: 3D (x, y, z) -> 2D (u, v)
  Offset project(double x, double y, double z, double centerX, double centerY, double scale) {
    // 1. Azimuth rotation around Z axis
    final rx = x * math.cos(theta) - y * math.sin(theta);
    final ry = x * math.sin(theta) + y * math.cos(theta);
    final rz = z;

    // 2. Isometric projection with elevation angle phi
    final u = centerX + (rx) * scale + panOffset.dx;
    final v = centerY + (ry * math.sin(phi) - rz * math.cos(phi)) * scale + panOffset.dy;
    return Offset(u, v);
  }

  // Calculate face normal brightness based on light source direction
  double getFaceBrightness(double nx, double ny, double nz) {
    // Fixed sunlight/moonlight vector
    const lx = 0.6;
    const ly = -0.4;
    const lz = 0.7;
    final dot = nx * lx + ny * ly + nz * lz;
    return (0.35 + 0.65 * math.max(0.0, dot)).clamp(0.2, 1.0);
  }

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;
    final centerX = w / 2;
    final centerY = h * 0.52;
    final scale = 1.35 * zoom * (math.min(w, h) / 360.0);

    // 1. Sky & Environment Background
    _drawSkyBackground(canvas, size, w, h);

    // 2. The Plot Pedestal (Photos 1, 3, 4)
    // Draw deep 3D earth block with perimeter road and lush lawn
    _drawBasePlotAndRoad(canvas, centerX, centerY, scale);

    // 3. Stage 1: Poydevor (Foundation Slab)
    if (stage >= 1) {
      _drawFoundation(canvas, centerX, centerY, scale);
    }

    // 4. Stage 2: Uy Devorlari (Walls)
    if (stage >= 2) {
      _drawWalls(canvas, centerX, centerY, scale);
    }

    // 5. Stage 3: Uy Tomi (Roof, Terraces & Pool)
    if (stage >= 3) {
      _drawRoofTerraceAndPool(canvas, centerX, centerY, scale);
    }

    // 6. Stage 4: Derazalar (Panoramic Glass Windows)
    if (stage >= 4) {
      _drawWindows(canvas, centerX, centerY, scale);
    }

    // 7. Stage 5: Eshiklar (Front Wooden Door & Garage Door)
    if (stage >= 5) {
      _drawDoors(canvas, centerX, centerY, scale);
    }

    // 8. Stage 6: Mashina va Landshaft (Sports Car & Bushes)
    if (stage >= 6) {
      _drawSportsCarAndLandscape(canvas, centerX, centerY, scale);
    }

    // 9. Construction Dust / Sparks Particle Animation
    if (isBuilding) {
      _drawBuildingParticles(canvas, centerX, centerY, scale);
    }
  }

  void _drawSkyBackground(Canvas canvas, Size size, double w, double h) {
    final skyPaint = Paint();
    if (isNightMode) {
      skyPaint.shader = ui.Gradient.linear(
        Offset(w / 2, 0),
        Offset(w / 2, h),
        [const Color(0xFF070414), const Color(0xFF120B2E), const Color(0xFF1B1143)],
        [0.0, 0.5, 1.0],
      );
      canvas.drawRect(Rect.fromLTWH(0, 0, w, h), skyPaint);

      // Starry sky (Photo 4)
      final starPaint = Paint()..color = Colors.white.withValues(alpha: 0.8);
      final random = math.Random(42);
      for (int i = 0; i < 45; i++) {
        final sx = random.nextDouble() * w;
        final sy = random.nextDouble() * h * 0.45;
        final sRadius = 0.75 + random.nextDouble() * 1.5;
        canvas.drawCircle(Offset(sx, sy), sRadius, starPaint);
      }

      // Distant glowing moon
      final moonPaint = Paint()
        ..shader = ui.Gradient.radial(
          Offset(w * 0.82, h * 0.14),
          32,
          [const Color(0xFFFEF9C3), const Color(0xFFFDE047).withValues(alpha: 0.2), Colors.transparent],
          [0.0, 0.4, 1.0],
        );
      canvas.drawCircle(Offset(w * 0.82, h * 0.14), 28, moonPaint);
      canvas.drawCircle(Offset(w * 0.82, h * 0.14), 10, Paint()..color = const Color(0xFFFEF9C3));
    } else {
      skyPaint.shader = ui.Gradient.linear(
        Offset(w / 2, 0),
        Offset(w / 2, h),
        [const Color(0xFFBAE6FD), const Color(0xFFE0F2FE), const Color(0xFFF0F9FF)],
        [0.0, 0.5, 1.0],
      );
      canvas.drawRect(Rect.fromLTWH(0, 0, w, h), skyPaint);

      // Sun with warm glow
      final sunPaint = Paint()
        ..shader = ui.Gradient.radial(
          Offset(w * 0.82, h * 0.14),
          42,
          [const Color(0xFFFDE047), const Color(0xFFFBBF24).withValues(alpha: 0.3), Colors.transparent],
          [0.0, 0.4, 1.0],
        );
      canvas.drawCircle(Offset(w * 0.82, h * 0.14), 36, sunPaint);
      canvas.drawCircle(Offset(w * 0.82, h * 0.14), 14, Paint()..color = const Color(0xFFFDE047));
    }
  }

  void _drawBasePlotAndRoad(Canvas canvas, double cx, double cy, double scale) {
    // Plot Dimensions in 3D world space
    const pw = 120.0; // Half width
    const pd = 120.0; // Half depth
    const plotZ = 0.0; // Ground elevation
    const earthDepth = -28.0; // Soil thickness below ground

    // Pedestal Bottom Corner Points
    final pB1 = project(pw, -pd, earthDepth, cx, cy, scale);
    final pB2 = project(pw, pd, earthDepth, cx, cy, scale);
    final pB3 = project(-pw, pd, earthDepth, cx, cy, scale);

    // Pedestal Top Corner Points
    final pT0 = project(-pw, -pd, plotZ, cx, cy, scale);
    final pT1 = project(pw, -pd, plotZ, cx, cy, scale);
    final pT2 = project(pw, pd, plotZ, cx, cy, scale);
    final pT3 = project(-pw, pd, plotZ, cx, cy, scale);

    // 1. Soil Pedestal Left and Right Sides
    final sidePaint1 = Paint()
      ..color = isNightMode ? const Color(0xFF1E172F) : const Color(0xFF785E4F);
    final sidePath1 = Path()
      ..moveTo(pT3.dx, pT3.dy)
      ..lineTo(pT2.dx, pT2.dy)
      ..lineTo(pB2.dx, pB2.dy)
      ..lineTo(pB3.dx, pB3.dy)
      ..close();
    canvas.drawPath(sidePath1, sidePaint1);

    final sidePaint2 = Paint()
      ..color = isNightMode ? const Color(0xFF150F24) : const Color(0xFF5D473B);
    final sidePath2 = Path()
      ..moveTo(pT2.dx, pT2.dy)
      ..lineTo(pT1.dx, pT1.dy)
      ..lineTo(pB1.dx, pB1.dy)
      ..lineTo(pB2.dx, pB2.dy)
      ..close();
    canvas.drawPath(sidePath2, sidePaint2);

    // Top Lawn Polygon
    final topLawnPath = Path()
      ..moveTo(pT0.dx, pT0.dy)
      ..lineTo(pT1.dx, pT1.dy)
      ..lineTo(pT2.dx, pT2.dy)
      ..lineTo(pT3.dx, pT3.dy)
      ..close();

    final lawnPaint = Paint()
      ..shader = ui.Gradient.linear(
        pT0,
        pT2,
        isNightMode
            ? [const Color(0xFF0F2618), const Color(0xFF091B10)]
            : [const Color(0xFF65A30D), const Color(0xFF4D7C0F)],
      );
    canvas.drawPath(topLawnPath, lawnPaint);

    // 2. Perimeter Roadway & Curb (Photo 1)
    // Front curb & asphalt strip
    const rw = 120.0;
    const roadY1 = 88.0;
    const roadY2 = 120.0;

    final rA = project(-rw, roadY1, plotZ + 0.5, cx, cy, scale);
    final rB = project(rw, roadY1, plotZ + 0.5, cx, cy, scale);
    final rC = project(rw, roadY2, plotZ + 0.5, cx, cy, scale);
    final rD = project(-rw, roadY2, plotZ + 0.5, cx, cy, scale);

    final roadPath = Path()
      ..moveTo(rA.dx, rA.dy)
      ..lineTo(rB.dx, rB.dy)
      ..lineTo(rC.dx, rC.dy)
      ..lineTo(rD.dx, rD.dy)
      ..close();

    final roadPaint = Paint()
      ..color = isNightMode ? const Color(0xFF1C1D24) : const Color(0xFF475569);
    canvas.drawPath(roadPath, roadPaint);

    // Dashed center line on asphalt road
    final roadLinePaint = Paint()
      ..color = Colors.white.withValues(alpha: isNightMode ? 0.4 : 0.8)
      ..strokeWidth = 2.0;

    for (double rx = -rw + 15; rx < rw - 15; rx += 25) {
      final lineStart = project(rx, 104.0, plotZ + 0.8, cx, cy, scale);
      final lineEnd = project(rx + 12, 104.0, plotZ + 0.8, cx, cy, scale);
      canvas.drawLine(lineStart, lineEnd, roadLinePaint);
    }

    // Concrete curb along lawn edge
    final curbPaint = Paint()
      ..color = isNightMode ? const Color(0xFF334155) : const Color(0xFFCBD5E1)
      ..strokeWidth = 3.0;
    canvas.drawLine(rA, rB, curbPaint);

    // 3. Driveway pavers connecting road to garage area (Photo 3 & 4)
    final dP1 = project(15, 20, plotZ + 0.6, cx, cy, scale);
    final dP2 = project(65, 20, plotZ + 0.6, cx, cy, scale);
    final dP3 = project(65, roadY1, plotZ + 0.6, cx, cy, scale);
    final dP4 = project(15, roadY1, plotZ + 0.6, cx, cy, scale);

    final drivewayPath = Path()
      ..moveTo(dP1.dx, dP1.dy)
      ..lineTo(dP2.dx, dP2.dy)
      ..lineTo(dP3.dx, dP3.dy)
      ..lineTo(dP4.dx, dP4.dy)
      ..close();

    final drivewayPaint = Paint()
      ..color = isNightMode ? const Color(0xFF242636) : const Color(0xFF94A3B8);
    canvas.drawPath(drivewayPath, drivewayPaint);

    // Empty plot construction pegs if stage == 0
    if (stage == 0) {
      final pegPaint = Paint()
        ..color = isNightMode ? const Color(0xFFA855F7) : const Color(0xFF7C3AED)
        ..strokeWidth = 2;
      final pegDash = Paint()
        ..color = (isNightMode ? Colors.white70 : const Color(0xFF7C3AED)).withValues(alpha: 0.6)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.5;

      final p0 = project(-55, -55, plotZ + 0.5, cx, cy, scale);
      final p1 = project(55, -55, plotZ + 0.5, cx, cy, scale);
      final p2 = project(55, 30, plotZ + 0.5, cx, cy, scale);
      final p3 = project(-55, 30, plotZ + 0.5, cx, cy, scale);

      final pegArea = Path()..moveTo(p0.dx, p0.dy)..lineTo(p1.dx, p1.dy)..lineTo(p2.dx, p2.dy)..lineTo(p3.dx, p3.dy)..close();
      canvas.drawPath(pegArea, pegDash);

      for (final p in [p0, p1, p2, p3]) {
        canvas.drawCircle(p, 4, pegPaint);
      }
    }
  }

  void _drawFoundation(Canvas canvas, double cx, double cy, double scale) {
    // 3D Concrete Foundation Slab (Photo 2)
    const fw = 60.0;
    const fd = 55.0;
    const slabHeight = 7.0;

    _drawBox(
      canvas: canvas,
      cx: cx,
      cy: cy,
      scale: scale,
      x: -5,
      y: -15,
      z: 0,
      dx: fw,
      dy: fd,
      dz: slabHeight,
      topColor: isNightMode ? const Color(0xFF33384A) : const Color(0xFFE2E8F0),
      frontColor: isNightMode ? const Color(0xFF222634) : const Color(0xFF94A3B8),
      sideColor: isNightMode ? const Color(0xFF1B1E29) : const Color(0xFF64748B),
    );

    // Foundation Rebar Grid / Joint lines (Photo 2)
    final gridPaint = Paint()
      ..color = isNightMode ? const Color(0xFF1E212D) : const Color(0xFFCBD5E1)
      ..strokeWidth = 1.0;

    for (double gx = -fw + 10; gx <= fw - 10; gx += 20) {
      final s = project(gx - 5, -fd - 15, slabHeight + 0.2, cx, cy, scale);
      final e = project(gx - 5, fd - 15, slabHeight + 0.2, cx, cy, scale);
      canvas.drawLine(s, e, gridPaint);
    }
  }

  void _drawWalls(Canvas canvas, double cx, double cy, double scale) {
    // Ground Floor: Main Living Block + Garage
    // 1. Garage / Service wing (Right side)
    _drawBox(
      canvas: canvas,
      cx: cx,
      cy: cy,
      scale: scale,
      x: 32,
      y: -5,
      z: 7,
      dx: 22,
      dy: 28,
      dz: 32,
      topColor: isNightMode ? const Color(0xFF28253B) : const Color(0xFFF1F5F9),
      frontColor: isNightMode ? const Color(0xFF1F1C30) : const Color(0xFFE2E8F0),
      sideColor: isNightMode ? const Color(0xFF161323) : const Color(0xFFCBD5E1),
    );

    // 2. Main 1st Floor Living room (Left side)
    _drawBox(
      canvas: canvas,
      cx: cx,
      cy: cy,
      scale: scale,
      x: -28,
      y: -10,
      z: 7,
      dx: 34,
      dy: 42,
      dz: 34,
      topColor: isNightMode ? const Color(0xFF2E2942) : const Color(0xFFFFFFFF),
      frontColor: isNightMode ? const Color(0xFF231E35) : const Color(0xFFF8FAFC),
      sideColor: isNightMode ? const Color(0xFF1B172C) : const Color(0xFFE2E8F0),
    );

    // 3. Second Floor Cantilevered Master Suite (Photo 3 & 4)
    // Timber / Wood slat feature box on upper level
    _drawBox(
      canvas: canvas,
      cx: cx,
      cy: cy,
      scale: scale,
      x: -12,
      y: -14,
      z: 41,
      dx: 38,
      dy: 36,
      dz: 30,
      topColor: isNightMode ? const Color(0xFF3F2B1C) : const Color(0xFFD97706),
      frontColor: isNightMode ? const Color(0xFF332014) : const Color(0xFFB45309),
      sideColor: isNightMode ? const Color(0xFF27170E) : const Color(0xFF92400E),
    );

    // Wood slat horizontal texture lines (Photo 3)
    final slatPaint = Paint()
      ..color = isNightMode ? const Color(0xFF1E120A) : const Color(0xFF78350F)
      ..strokeWidth = 1.0;
    for (double sz = 43; sz < 71; sz += 4) {
      final s = project(-12 + 38, -14 - 36, sz, cx, cy, scale);
      final e = project(-12 + 38, -14 + 36, sz, cx, cy, scale);
      canvas.drawLine(s, e, slatPaint);
    }
  }

  void _drawRoofTerraceAndPool(Canvas canvas, double cx, double cy, double scale) {
    // Rooftop Terrace with Swimming Pool (Photo 3 & 4)
    // 1. Lower Garage Rooftop Terrace Deck (Over right wing)
    _drawBox(
      canvas: canvas,
      cx: cx,
      cy: cy,
      scale: scale,
      x: 32,
      y: -5,
      z: 39,
      dx: 22,
      dy: 28,
      dz: 2.5,
      topColor: isNightMode ? const Color(0xFF2A2338) : const Color(0xFFE2E8F0),
      frontColor: isNightMode ? const Color(0xFF1E1829) : const Color(0xFFCBD5E1),
      sideColor: isNightMode ? const Color(0xFF171221) : const Color(0xFF94A3B8),
    );

    // Terrace Metal / Glass Railing
    final railPaint = Paint()
      ..color = isNightMode ? const Color(0xFF4C3D77) : const Color(0xFF94A3B8)
      ..strokeWidth = 1.5;

    final r1 = project(32 - 22, -5 + 28, 41.5, cx, cy, scale);
    final r2 = project(32 + 22, -5 + 28, 41.5, cx, cy, scale);
    final r3 = project(32 + 22, -5 - 28, 41.5, cx, cy, scale);
    final r1Top = project(32 - 22, -5 + 28, 49.0, cx, cy, scale);
    final r2Top = project(32 + 22, -5 + 28, 49.0, cx, cy, scale);
    final r3Top = project(32 + 22, -5 - 28, 49.0, cx, cy, scale);

    canvas.drawLine(r1Top, r2Top, railPaint);
    canvas.drawLine(r2Top, r3Top, railPaint);
    canvas.drawLine(r1, r1Top, railPaint);
    canvas.drawLine(r2, r2Top, railPaint);
    canvas.drawLine(r3, r3Top, railPaint);

    // 2. Rooftop Swimming Pool (Photo 3)
    // Pool basin on the upper deck
    final poolP0 = project(-38, -32, 71.5, cx, cy, scale);
    final poolP1 = project(-14, -32, 71.5, cx, cy, scale);
    final poolP2 = project(-14, 0, 71.5, cx, cy, scale);
    final poolP3 = project(-38, 0, 71.5, cx, cy, scale);

    final poolPath = Path()
      ..moveTo(poolP0.dx, poolP0.dy)
      ..lineTo(poolP1.dx, poolP1.dy)
      ..lineTo(poolP2.dx, poolP2.dy)
      ..lineTo(poolP3.dx, poolP3.dy)
      ..close();

    final poolWaterPaint = Paint()
      ..shader = ui.Gradient.linear(
        poolP0,
        poolP2,
        isNightMode
            ? [const Color(0xFF0284C7), const Color(0xFF0369A1)]
            : [const Color(0xFF38BDF8), const Color(0xFF0284C7)],
      );
    canvas.drawPath(poolPath, poolWaterPaint);

    // Pool water ripple / glow highlight
    final ripplePaint = Paint()
      ..color = Colors.white.withValues(alpha: isNightMode ? 0.35 : 0.6)
      ..strokeWidth = 1.0;
    canvas.drawLine(
      Offset((poolP0.dx + poolP1.dx) / 2, (poolP0.dy + poolP1.dy) / 2),
      Offset((poolP3.dx + poolP2.dx) / 2, (poolP3.dy + poolP2.dy) / 2),
      ripplePaint,
    );

    // Patio Lounge Sun Umbrella & Chair on lower terrace (Photo 3)
    final umbrellaPostB = project(38, -12, 41.5, cx, cy, scale);
    final umbrellaPostT = project(38, -12, 58.0, cx, cy, scale);
    canvas.drawLine(umbrellaPostB, umbrellaPostT, Paint()..color = Colors.grey.shade700..strokeWidth = 2);

    final umbrellaP = project(38, -12, 60.0, cx, cy, scale);
    canvas.drawCircle(
      umbrellaP,
      12 * scale,
      Paint()..color = const Color(0xFFEF4444),
    );
  }

  void _drawWindows(Canvas canvas, double cx, double cy, double scale) {
    // Panoramic Floor-to-Ceiling Windows (Photo 3 & 4)
    // In Day mode: clear sky reflection; In Night mode: warm glowing golden light radiating outward!
    final glassColor = isNightMode
        ? const Color(0xFFFDE047).withValues(alpha: 0.85) // Warm golden glow
        : const Color(0xFFBAE6FD).withValues(alpha: 0.8);  // Crisp daylight reflection

    final framePaint = Paint()
      ..color = isNightMode ? const Color(0xFF28253B) : const Color(0xFF0F172A)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;

    // 1. Lower Level Living Room Panoramic Glass
    final w1A = project(-28 + 34, 0, 10, cx, cy, scale);
    final w1B = project(-28 + 34, 25, 10, cx, cy, scale);
    final w1C = project(-28 + 34, 25, 36, cx, cy, scale);
    final w1D = project(-28 + 34, 0, 36, cx, cy, scale);

    final winPath1 = Path()..moveTo(w1A.dx, w1A.dy)..lineTo(w1B.dx, w1B.dy)..lineTo(w1C.dx, w1C.dy)..lineTo(w1D.dx, w1D.dy)..close();
    canvas.drawPath(winPath1, Paint()..color = glassColor);
    canvas.drawPath(winPath1, framePaint);

    // 2. Upper Level Master Bedroom Panoramic Glass (Photo 3 & 4)
    final w2A = project(-12 + 38, -10, 44, cx, cy, scale);
    final w2B = project(-12 + 38, 16, 44, cx, cy, scale);
    final w2C = project(-12 + 38, 16, 68, cx, cy, scale);
    final w2D = project(-12 + 38, -10, 68, cx, cy, scale);

    final winPath2 = Path()..moveTo(w2A.dx, w2A.dy)..lineTo(w2B.dx, w2B.dy)..lineTo(w2C.dx, w2C.dy)..lineTo(w2D.dx, w2D.dy)..close();
    canvas.drawPath(winPath2, Paint()..color = glassColor);
    canvas.drawPath(winPath2, framePaint);

    // Cross mullions on glass
    canvas.drawLine(
      Offset((w2A.dx + w2B.dx) / 2, (w2A.dy + w2B.dy) / 2),
      Offset((w2D.dx + w2C.dx) / 2, (w2D.dy + w2C.dy) / 2),
      framePaint,
    );
    canvas.drawLine(
      Offset((w2A.dx + w2D.dx) / 2, (w2A.dy + w2D.dy) / 2),
      Offset((w2B.dx + w2C.dx) / 2, (w2B.dy + w2C.dy) / 2),
      framePaint,
    );

    // Night Mode Window Light Projection onto Lawn
    if (isNightMode) {
      final glowPaint = Paint()
        ..shader = ui.Gradient.radial(
          Offset((w1A.dx + w1B.dx) / 2, (w1A.dy + w1B.dy) / 2 + 10),
          30 * scale,
          [const Color(0xFFFDE047).withValues(alpha: 0.35), Colors.transparent],
        );
      canvas.drawCircle(Offset((w1A.dx + w1B.dx) / 2, (w1A.dy + w1B.dy) / 2 + 10), 30 * scale, glowPaint);
    }
  }

  void _drawDoors(Canvas canvas, double cx, double cy, double scale) {
    // 1. Garage Door (Photo 3 & 4)
    // Modern dark horizontal slat garage door
    final gA = project(32 + 22, -18, 8, cx, cy, scale);
    final gB = project(32 + 22, 10, 8, cx, cy, scale);
    final gC = project(32 + 22, 10, 32, cx, cy, scale);
    final gD = project(32 + 22, -18, 32, cx, cy, scale);

    final garagePath = Path()..moveTo(gA.dx, gA.dy)..lineTo(gB.dx, gB.dy)..lineTo(gC.dx, gC.dy)..lineTo(gD.dx, gD.dy)..close();
    final garagePaint = Paint()..color = isNightMode ? const Color(0xFF0F172A) : const Color(0xFF334155);
    canvas.drawPath(garagePath, garagePaint);

    // Garage door horizontal lines
    final gLinePaint = Paint()..color = isNightMode ? const Color(0xFF1E293B) : const Color(0xFF64748B)..strokeWidth = 1.0;
    for (double gz = 12; gz < 32; gz += 4) {
      final s = project(32 + 22.2, -18, gz, cx, cy, scale);
      final e = project(32 + 22.2, 10, gz, cx, cy, scale);
      canvas.drawLine(s, e, gLinePaint);
    }

    // 2. Main Entry Door
    // Warm vertical wooden plank door
    final dA = project(6, 12, 7.5, cx, cy, scale);
    final dB = project(18, 12, 7.5, cx, cy, scale);
    final dC = project(18, 12, 28, cx, cy, scale);
    final dD = project(6, 12, 28, cx, cy, scale);

    final doorPath = Path()..moveTo(dA.dx, dA.dy)..lineTo(dB.dx, dB.dy)..lineTo(dC.dx, dC.dy)..lineTo(dD.dx, dD.dy)..close();
    final doorPaint = Paint()..color = const Color(0xFF92400E);
    canvas.drawPath(doorPath, doorPaint);

    // Brushed metal door handle
    final handlePos = project(15, 12.2, 17, cx, cy, scale);
    canvas.drawCircle(handlePos, 2.5 * scale, Paint()..color = const Color(0xFFE2E8F0));
  }

  void _drawSportsCarAndLandscape(Canvas canvas, double cx, double cy, double scale) {
    // 1. Modern Sports Car on the Driveway (Photo 3 & 4)
    // Red luxury sports car (Photo 3) or Silver Audi R8 (Photo 4)
    const carX = 42.0;
    const carY = 48.0;
    const carZ = 1.0;

    final carPaint = Paint()..color = isNightMode ? const Color(0xFFCBD5E1) : const Color(0xFFDC2626);

    // Car Body Main Chassis
    _drawBox(
      canvas: canvas,
      cx: cx,
      cy: cy,
      scale: scale,
      x: carX,
      y: carY,
      z: carZ,
      dx: 11,
      dy: 20,
      dz: 7,
      topColor: carPaint.color,
      frontColor: isNightMode ? const Color(0xFF94A3B8) : const Color(0xFFB91C1C),
      sideColor: isNightMode ? const Color(0xFF64748B) : const Color(0xFF991B1B),
    );

    // Car Roof / Cabin Glass
    _drawBox(
      canvas: canvas,
      cx: cx,
      cy: cy,
      scale: scale,
      x: carX,
      y: carY - 2,
      z: carZ + 7,
      dx: 9,
      dy: 12,
      dz: 5,
      topColor: const Color(0xFF0F172A),
      frontColor: const Color(0xFF1E293B),
      sideColor: const Color(0xFF0F172A),
    );

    // Car Headlights (Photo 4)
    
    final hL1 = project(carX - 8, carY + 20.2, carZ + 3.5, cx, cy, scale);
    final hL2 = project(carX + 8, carY + 20.2, carZ + 3.5, cx, cy, scale);
    final lightColor = isNightMode ? const Color(0xFFFEF08A) : Colors.white;

    canvas.drawCircle(hL1, 2.5 * scale, Paint()..color = lightColor);
    canvas.drawCircle(hL2, 2.5 * scale, Paint()..color = lightColor);

    // Night Mode Headlight Beam Light Cast on Driveway (Photo 4)
    if (isNightMode) {
      final beamPaint = Paint()
        ..shader = ui.Gradient.radial(
          Offset((hL1.dx + hL2.dx) / 2, (hL1.dy + hL2.dy) / 2 + 20),
          35 * scale,
          [const Color(0xFFFEF08A).withValues(alpha: 0.4), Colors.transparent],
        );
      canvas.drawCircle(Offset((hL1.dx + hL2.dx) / 2, (hL1.dy + hL2.dy) / 2 + 20), 35 * scale, beamPaint);
    }

    // 2. Purple Flowering Perimeter Bushes & Trees (Photo 4)
    // Left boundary lush purple floral hedges
    final bushColor = isNightMode ? const Color(0xFF701A75) : const Color(0xFFA21CAF);
    for (double by = -90; by <= 80; by += 22) {
      final bPos = project(-105, by, 2.0, cx, cy, scale);
      canvas.drawCircle(bPos, 10 * scale, Paint()..color = bushColor);
      canvas.drawCircle(
        Offset(bPos.dx + 2, bPos.dy - 3),
        7 * scale,
        Paint()..color = isNightMode ? const Color(0xFF86198F) : const Color(0xFFC026D3),
      );
    }

    // Lawn Inground Spotlights (Photo 3 & 4)
    for (double lx = -20; lx <= 10; lx += 15) {
      final lPos = project(lx, 26, 0.8, cx, cy, scale);
      canvas.drawCircle(lPos, 2.5 * scale, Paint()..color = Colors.amber);
      if (isNightMode) {
        canvas.drawCircle(
          lPos,
          10 * scale,
          Paint()..shader = ui.Gradient.radial(lPos, 10 * scale, [Colors.amber.withValues(alpha: 0.5), Colors.transparent]),
        );
      }
    }
  }

  void _drawBuildingParticles(Canvas canvas, double cx, double cy, double scale) {
    // Dynamic dust/spark particle burst during active building
    final pRand = math.Random(1337);
    final particlePaint = Paint()..color = Colors.amber;

    for (int i = 0; i < 24; i++) {
      final progress = (buildingParticleProgress + (i / 24.0)) % 1.0;
      final angle = pRand.nextDouble() * math.pi * 2;
      final dist = (20 + pRand.nextDouble() * 50) * progress * scale;

      final px = cx + math.cos(angle) * dist;
      final py = cy - 20 - (progress * 40 * scale) + math.sin(angle) * (dist * 0.4);

      particlePaint.color = [
        Colors.amber,
        const Color(0xFFF97316),
        const Color(0xFFA855F7),
        Colors.white,
      ][i % 4].withValues(alpha: (1.0 - progress).clamp(0.0, 1.0));

      canvas.drawCircle(Offset(px, py), (3.0 * (1.0 - progress * 0.7)) * scale, particlePaint);
    }
  }

  // 3D Prism (Box) rendering helper
  void _drawBox({
    required Canvas canvas,
    required double cx,
    required double cy,
    required double scale,
    required double x,
    required double y,
    required double z,
    required double dx,
    required double dy,
    required double dz,
    required Color topColor,
    required Color frontColor,
    required Color sideColor,
  }) {
    // 7 Visible Vertices (p0 is occluded)
    final p1 = project(x + dx, y - dy, z, cx, cy, scale);
    final p2 = project(x + dx, y + dy, z, cx, cy, scale);
    final p3 = project(x - dx, y + dy, z, cx, cy, scale);

    final p4 = project(x - dx, y - dy, z + dz, cx, cy, scale);
    final p5 = project(x + dx, y - dy, z + dz, cx, cy, scale);
    final p6 = project(x + dx, y + dy, z + dz, cx, cy, scale);
    final p7 = project(x - dx, y + dy, z + dz, cx, cy, scale);

    // Front Face (p2, p3, p7, p6)
    final frontPath = Path()..moveTo(p3.dx, p3.dy)..lineTo(p2.dx, p2.dy)..lineTo(p6.dx, p6.dy)..lineTo(p7.dx, p7.dy)..close();
    canvas.drawPath(frontPath, Paint()..color = frontColor);

    // Side Face (p1, p2, p6, p5)
    final sidePath = Path()..moveTo(p2.dx, p2.dy)..lineTo(p1.dx, p1.dy)..lineTo(p5.dx, p5.dy)..lineTo(p6.dx, p6.dy)..close();
    canvas.drawPath(sidePath, Paint()..color = sideColor);

    // Top Face (p4, p5, p6, p7)
    final topPath = Path()..moveTo(p4.dx, p4.dy)..lineTo(p5.dx, p5.dy)..lineTo(p6.dx, p6.dy)..lineTo(p7.dx, p7.dy)..close();
    canvas.drawPath(topPath, Paint()..color = topColor);
  }

  @override
  bool shouldRepaint(covariant _Realistic3DHousePainter old) {
    return old.stage != stage ||
        old.theta != theta ||
        old.phi != phi ||
        old.zoom != zoom ||
        old.panOffset != panOffset ||
        old.isNightMode != isNightMode ||
        old.isBuilding != isBuilding ||
        old.buildingParticleProgress != buildingParticleProgress;
  }
}

/// Particle model for completion celebration
class _ConfettiParticle {
  double x;
  double y;
  double vx;
  double vy;
  double size;
  Color color;
  double rotation;
  double vRot;

  _ConfettiParticle({
    required this.x,
    required this.y,
    required this.vx,
    required this.vy,
    required this.size,
    required this.color,
    required this.rotation,
    required this.vRot,
  });
}

class _ConfettiPainter extends CustomPainter {
  final List<_ConfettiParticle> particles;
  final double progress;

  _ConfettiPainter({required this.particles, required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    for (final p in particles) {
      final currentX = (p.x + p.vx * progress) * w;
      final currentY = (p.y + p.vy * progress) * h;
      final rot = p.rotation + p.vRot * progress;

      final paint = Paint()
        ..color = p.color.withValues(alpha: (1.0 - progress * 0.8).clamp(0.0, 1.0));

      canvas.save();
      canvas.translate(currentX, currentY);
      canvas.rotate(rot);
      canvas.drawRect(
        Rect.fromCenter(center: Offset.zero, width: p.size, height: p.size * 0.6),
        paint,
      );
      canvas.restore();
    }
  }

  @override
  bool shouldRepaint(covariant _ConfettiPainter oldDelegate) => true;
}
