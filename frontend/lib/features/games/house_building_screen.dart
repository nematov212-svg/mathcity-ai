import 'dart:io';
import 'dart:math' as math;
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/network/api_client.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/xp_coin.dart';
import '../../shared/providers/student_provider.dart';
import 'house_game_view.dart';
import 'models/store_item.dart';
import 'screens/store_sheet.dart';
import 'widgets/house_bottom_bar.dart';
import 'widgets/house_build_colors.dart';
import 'widgets/house_build_top_bar.dart';
import 'widgets/house_progress_card.dart';
import 'widgets/house_scene_view.dart';

/// Legacy Catalog item kept for compatibility with existing tests/routes
class HouseCatalogItem {
  final String id;
  final String name;
  final String category;
  final int stage;
  final int coinPrice;
  final String? dependency;
  final bool multiPlace;
  final String? defaultColor;
  final String iconEmoji;

  const HouseCatalogItem({
    required this.id,
    required this.name,
    required this.category,
    required this.stage,
    required this.coinPrice,
    this.dependency,
    this.multiPlace = false,
    this.defaultColor,
    required this.iconEmoji,
  });

  factory HouseCatalogItem.fromJson(Map<String, dynamic> json) {
    String emoji = '📦';
    final cat = (json['category'] ?? '').toString();
    if (cat == 'foundation') {
      emoji = '🧱';
    } else if (cat == 'walls') {
      emoji = '🏠';
    } else if (cat == 'roof') {
      emoji = '🛖';
    } else if (cat == 'doors') {
      emoji = '🚪';
    } else if (cat == 'windows') {
      emoji = '🪟';
    } else if (cat == 'interior') {
      emoji = '🛋️';
    } else if (cat == 'yard') {
      emoji = '🌳';
    } else if (cat == 'vehicles') {
      emoji = '🚗';
    } else if (cat == 'extras') {
      emoji = '✨';
    }

    return HouseCatalogItem(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      category: cat,
      stage: (json['stage'] as num?)?.toInt() ?? 1,
      coinPrice: (json['coinPrice'] as num?)?.toInt() ?? 10,
      dependency: json['dependency']?.toString(),
      multiPlace: json['multiPlace'] == true,
      defaultColor: json['defaultColor']?.toString(),
      iconEmoji: emoji,
    );
  }
}

/// Category metadata
class StoreCategory {
  final String key;
  final String title;
  final IconData icon;

  const StoreCategory(this.key, this.title, this.icon);
}

const List<String> kHouseStageTitles = [
  'Poydevor',
  'Uy devorlari',
  'Uy tomi',
  'Derazalar',
  'Eshiklar',
  'Mashina va hovli',
];

const List<StoreCategory> kStoreCategories = [
  StoreCategory('foundation', 'Poydevor', Icons.foundation_rounded),
  StoreCategory('walls', 'Devorlar', Icons.apartment_rounded),
  StoreCategory('roof', 'Tomlar', Icons.roofing_rounded),
  StoreCategory('doors', 'Eshiklar', Icons.meeting_room_rounded),
  StoreCategory('windows', 'Derazalar', Icons.window_rounded),
  StoreCategory('interior', 'Jihozlar', Icons.chair_rounded),
  StoreCategory('yard', 'Hovli & Bog‘', Icons.park_rounded),
  StoreCategory('vehicles', 'Transport', Icons.directions_car_rounded),
  StoreCategory('extras', 'Qo‘shimcha', Icons.auto_awesome_rounded),
];

const List<Map<String, String>> kRoofColors = [
  {'id': 'blue', 'name': 'To‘q ko‘k', 'hex': '#1E3A8A'},
  {'id': 'red', 'name': 'Qizil koshin', 'hex': '#DC2626'},
  {'id': 'gray', 'name': 'Kulrang', 'hex': '#475569'},
  {'id': 'green', 'name': 'Zangori yashil', 'hex': '#059669'},
  {'id': 'black', 'name': 'Qora shifer', 'hex': '#18181B'},
];

const List<HouseCatalogItem> kFallbackHouseCatalog = [
  HouseCatalogItem(
      id: 'clean_lot',
      name: 'Maydonni tozalash',
      category: 'foundation',
      stage: 1,
      coinPrice: 1,
      iconEmoji: '🧹'),
  HouseCatalogItem(
      id: 'concrete_foundation',
      name: 'Beton poydevor',
      category: 'foundation',
      stage: 1,
      coinPrice: 30,
      iconEmoji: '🧱'),
  HouseCatalogItem(
      id: 'red_brick_wall',
      name: 'Pishiq g‘isht devor',
      category: 'walls',
      stage: 2,
      coinPrice: 150,
      iconEmoji: '🧱'),
  HouseCatalogItem(
      id: 'gable_roof',
      name: 'Uchburchak shiferli tom',
      category: 'roof',
      stage: 3,
      coinPrice: 100,
      iconEmoji: '🛖'),
  HouseCatalogItem(
      id: 'standard_window',
      name: 'Shisha deraza',
      category: 'windows',
      stage: 4,
      coinPrice: 50,
      iconEmoji: '🪟'),
  HouseCatalogItem(
      id: 'standard_door',
      name: 'Yog‘och eshik',
      category: 'doors',
      stage: 5,
      coinPrice: 90,
      iconEmoji: '🚪'),
  HouseCatalogItem(
      id: 'standard_car',
      name: 'Oila mashinasi',
      category: 'vehicles',
      stage: 6,
      coinPrice: 300,
      iconEmoji: '🚗'),
];

/// Redesigned House Building Screen:
/// - SafeArea + Column + Row + Expanded layout without manual Positioned overlap
/// - Cohesive unified theme (light/dark)
/// - 3D diorama canvas with ghost outlines, 90° rotate, floating mode chips
/// - Bottom bar with "Qurish • $cost coin" & "Do‘kon" button
/// - Construction store sheet & onboarding guidance
class HouseBuildingScreen extends ConsumerStatefulWidget {
  const HouseBuildingScreen({super.key});

  @override
  ConsumerState<HouseBuildingScreen> createState() =>
      _HouseBuildingScreenState();
}

class _HouseBuildingScreenState extends ConsumerState<HouseBuildingScreen>
    with TickerProviderStateMixin {
  int _currentStage = 0;
  bool _isLoading = true;
  bool _isBuilding = false;
  bool _isSceneReady = false;

  // 3D Scene Controls State
  bool _isNightMode = false;
  bool _isInteriorMode = false;
  bool _isMuted = false;

  // Inventory & Store State
  final Set<String> _ownedItemIds = {};
  final Set<String> _placedItemIds = {};

  // Onboarding Tooltip State
  int _tooltipStep = 0;
  String? _onboardingTooltip;
  String? _celebrationBadge;

  // Confetti Animation Controller for Stage 6 Celebration
  late AnimationController _confettiAnimController;
  final List<_ConfettiParticle> _confetti = [];
  final math.Random _random = math.Random();

  @override
  void initState() {
    super.initState();
    _confettiAnimController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2500),
    )..addListener(() {
        if (mounted) setState(() {});
      });

    _loadGameData();
    _checkOnboarding();
  }

  @override
  void dispose() {
    _confettiAnimController.dispose();
    super.dispose();
  }

  Future<void> _checkOnboarding() async {
    final prefs = await SharedPreferences.getInstance();
    final completed = prefs.getBool('mc_house_onboarding_completed') ?? false;
    if (!completed && mounted) {
      setState(() {
        _tooltipStep = 0;
        _onboardingTooltip =
            '3D uyni aylantirish uchun barmog‘ingiz bilan suring';
      });
    }
  }

  void _nextOnboardingStep() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      if (_tooltipStep == 0) {
        _tooltipStep = 1;
        _onboardingTooltip = 'Qurish tugmasini bosib keyingi bosqichga o‘ting';
      } else if (_tooltipStep == 1) {
        _tooltipStep = 2;
        _onboardingTooltip = 'Do‘kondan yangi buyumlar va bezaklar xarid qiling';
      } else {
        _onboardingTooltip = null;
        prefs.setBool('mc_house_onboarding_completed', true);
      }
    });
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

  Future<void> _loadGameData() async {
    if (!kIsWeb && Platform.environment.containsKey('FLUTTER_TEST')) {
      setState(() {
        _isLoading = false;
      });
      return;
    }

    final prefs = await SharedPreferences.getInstance();
    final cachedStage = prefs.getInt('mc_house_building_stage') ?? 0;
    if (mounted) {
      setState(() {
        _currentStage = cachedStage;
      });
    }

    try {
      final res = await ApiClient().dio.get(
            '/games/house-building',
            options: Options(
              validateStatus: (status) => true,
              sendTimeout: const Duration(seconds: 5),
              receiveTimeout: const Duration(seconds: 5),
            ),
          );
      if (res.statusCode == 200 &&
          res.data != null &&
          res.data['success'] == true) {
        final data = res.data['data'];
        final stage = (data['currentStage'] as num?)?.toInt() ?? cachedStage;
        final myState = data['myState'] as Map<String, dynamic>? ?? {};
        final placedRaw = myState['placedItems'] as List? ?? [];
        final inventoryList = (myState['inventory'] as List? ?? [])
            .map((e) => e.toString())
            .toList();

        if (mounted) {
          setState(() {
            _currentStage = stage;
            _ownedItemIds.addAll(inventoryList);
            for (final p in placedRaw) {
              if (p is Map && p['itemId'] != null) {
                _placedItemIds.add(p['itemId'].toString());
              }
            }
            _isLoading = false;
          });
          await prefs.setInt('mc_house_building_stage', stage);
          _syncStateTo3DScene();
        }
        return;
      }
    } catch (_) {
      // Fallback gracefully
    }

    if (mounted) {
      setState(() {
        _isLoading = false;
      });
      _syncStateTo3DScene();
    }
  }

  void _syncStateTo3DScene() {
    if (!_isSceneReady) return;
    postMessageToHouseGame('LOAD_STATE', {
      'stage': _currentStage,
      'isDark': _isNightMode,
    });
  }

  void _onMessageFromGame(String type, Map<String, dynamic> data) {
    debugPrint('Message received from 3D House Game: $type, data: $data');

    switch (type) {
      case 'SCENE_READY':
        setState(() {
          _isSceneReady = true;
        });
        _syncStateTo3DScene();
        break;

      case 'STAGE_BUILT':
        HapticFeedback.heavyImpact();
        break;

      case 'CAMERA_RESET':
      case 'CAMERA_ROTATED_90':
        HapticFeedback.lightImpact();
        break;

      default:
        break;
    }
  }

  /// Build the next stage of the 3D House
  Future<void> _buildNextStage() async {
    if (_isBuilding) return;

    if (_currentStage >= 6) {
      _showCelebrationDialog();
      return;
    }

    final nextCost = kHouseStageCosts[_currentStage];
    final student = ref.read(studentProvider).student;
    final userCoins = student?.coinBalance ?? 0;

    if (userCoins < nextCost) {
      HapticFeedback.mediumImpact();
      _showSnackbar('Qurilish uchun coin yetarli emas! Misol yechib coin to‘plang.',
          isError: true);
      return;
    }

    setState(() {
      _isBuilding = true;
    });

    final nextStage = _currentStage + 1;
    final stageName = kHouseStageTargetTitles[nextStage - 1];

    try {
      await ApiClient().dio.post(
        '/games/house-building/build',
        data: {'stage': nextStage},
        options: Options(
          validateStatus: (status) => true,
          sendTimeout: const Duration(seconds: 6),
          receiveTimeout: const Duration(seconds: 6),
        ),
      );
    } catch (e) {
      debugPrint('Backend build request fallback: $e');
    }

    // Debit coins & award XP locally
    ref.read(studentProvider.notifier).updateCoins(-nextCost);
    ref.read(studentProvider.notifier).updateXP(30);

    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('mc_house_building_stage', nextStage);

    if (mounted) {
      setState(() {
        _currentStage = nextStage;
        _isBuilding = false;
        _celebrationBadge = '$stageName qurildi! ✨';
      });

      // Notify 3D engine to trigger pop and particle burst
      postMessageToHouseGame('SET_STAGE', {
        'stage': nextStage,
        'animate': true,
      });

      HapticFeedback.heavyImpact();

      // Clear celebration badge after 3 seconds
      Future.delayed(const Duration(seconds: 3), () {
        if (mounted) {
          setState(() {
            _celebrationBadge = null;
          });
        }
      });

      if (nextStage >= 6) {
        _triggerConfetti();
        _showCelebrationDialog();
      } else {
        _showSnackbar('$stageName muvaffaqiyatli qurildi! (+30 XP)');
      }
    }
  }

  /// Rotate 3D camera by 90 degrees
  void _rotate90() {
    HapticFeedback.lightImpact();
    postMessageToHouseGame('ROTATE_90', {});
  }

  void _toggleNightMode() {
    HapticFeedback.lightImpact();
    setState(() {
      _isNightMode = !_isNightMode;
    });
    postMessageToHouseGame('SET_THEME', {'isDark': _isNightMode});
  }

  void _toggleInterior() {
    HapticFeedback.lightImpact();
    setState(() {
      _isInteriorMode = !_isInteriorMode;
    });
    postMessageToHouseGame(
        'SET_INTERIOR_MODE', {'isInterior': _isInteriorMode});
  }

  void _toggleMute() {
    HapticFeedback.lightImpact();
    setState(() {
      _isMuted = !_isMuted;
    });
    postMessageToHouseGame('SET_MUTE', {'muted': _isMuted});
  }

  void _resetCamera() {
    HapticFeedback.lightImpact();
    postMessageToHouseGame('RESET_CAMERA', {});
  }

  /// Open Construction Store Bottom Sheet / Dialog
  void _openStore() {
    final student = ref.read(studentProvider).student;
    final userCoins = student?.coinBalance ?? 0;

    StoreSheet.show(
      context,
      userCoins: userCoins,
      currentStage: _currentStage,
      ownedItemIds: _ownedItemIds,
      placedItemIds: _placedItemIds,
      onPurchaseItem: (item) => _handleStorePurchase(item),
      onTogglePlacement: (item) => _handleTogglePlacement(item),
    );
  }

  Future<void> _handleStorePurchase(StoreItem item) async {
    final student = ref.read(studentProvider).student;
    final userCoins = student?.coinBalance ?? 0;

    if (userCoins < item.price) {
      _showSnackbar('Xarid qilish uchun coin yetarli emas!', isError: true);
      return;
    }

    try {
      await ApiClient().dio.post(
        '/games/house-building/buy',
        data: {'itemId': item.id},
        options: Options(
          validateStatus: (status) => true,
          sendTimeout: const Duration(seconds: 5),
          receiveTimeout: const Duration(seconds: 5),
        ),
      );
    } catch (e) {
      debugPrint('Store purchase fallback: $e');
    }

    ref.read(studentProvider.notifier).updateCoins(-item.price);
    ref.read(studentProvider.notifier).updateXP(item.xpReward);

    setState(() {
      _ownedItemIds.add(item.id);
      _placedItemIds.add(item.id);
    });

    postMessageToHouseGame('ITEM_PLACED', {
      'item': {
        'itemId': item.id,
        'name': item.name,
        'category': item.category.name,
        'stage': item.stage,
      }
    });

    _showSnackbar('«${item.name}» xarid qilindi va o‘rnatildi! (+${item.xpReward} XP)');
  }

  void _handleTogglePlacement(StoreItem item) {
    setState(() {
      if (_placedItemIds.contains(item.id)) {
        _placedItemIds.remove(item.id);
        postMessageToHouseGame('ITEM_REMOVED', {'instanceId': item.id});
        _showSnackbar('«${item.name}» sahnadan olib tashlandi.');
      } else {
        _placedItemIds.add(item.id);
        postMessageToHouseGame('ITEM_PLACED', {
          'item': {
            'itemId': item.id,
            'name': item.name,
            'category': item.category.name,
            'stage': item.stage,
          }
        });
        _showSnackbar('«${item.name}» sahnaga o‘rnatildi!');
      }
    });
  }

  void _showSnackbar(String text, {bool isError = false}) {
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          text,
          style:
              const TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
        ),
        backgroundColor:
            isError ? const Color(0xFFEF4444) : const Color(0xFF10B981),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  void _showCelebrationDialog() {
    final appColors = Theme.of(context).extension<AppThemeColors>();
    final isDark = Theme.of(context).brightness == Brightness.dark;

    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (ctx) => AlertDialog(
        backgroundColor: appColors?.card ??
            (isDark ? const Color(0xFF1E1B4B) : Colors.white),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(28),
          side: const BorderSide(color: Color(0xFFF59E0B), width: 2),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFFF59E0B), Color(0xFFD97706)],
                ),
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFFF59E0B).withValues(alpha: 0.4),
                    blurRadius: 24,
                    spreadRadius: 4,
                  ),
                ],
              ),
              child: const Icon(Icons.emoji_events_rounded,
                  color: Colors.white, size: 48),
            ),
            const SizedBox(height: 18),
            Text(
              'TABRIKLAYMIZ! 🎉',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w900,
                color: appColors?.ink ??
                    (isDark ? Colors.white : const Color(0xFF17152B)),
                letterSpacing: 0.5,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              'Siz orzuingizdagi 3D zamonaviy uyni to‘liq qurib bitkazdingiz! Barcha 6 ta bosqich muvaffaqiyatli yakunlandi.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14,
                color: appColors?.muted ??
                    (isDark
                        ? const Color(0xFFB5B2C7)
                        : const Color(0xFF626579)),
                height: 1.4,
              ),
            ),
            const SizedBox(height: 18),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              decoration: BoxDecoration(
                color: const Color(0xFF10B981).withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                    color: const Color(0xFF10B981).withValues(alpha: 0.4)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: const [
                  XpCoin(size: 24),
                  SizedBox(width: 8),
                  Text(
                    '+500 XP Usta Quruvchi Mukofoti!',
                    style: TextStyle(
                      color: Color(0xFF10B981),
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => Navigator.of(ctx).pop(),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF8B5CF6),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16)),
                padding:
                    const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
                elevation: 4,
              ),
              child: const Text('Ajoyib!',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = HouseBuildColors.of(context);
    final student = ref.watch(studentProvider).student;
    final coinBalance = student?.coinBalance ?? 0;
    final xpBalance = student?.totalXP ?? 0;

    return Scaffold(
      backgroundColor: colors.background,
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 480),
          child: Stack(
            children: [
              // Main Clean Layout: SafeArea + Column + Row + Expanded
              SafeArea(
                child: Padding(
                  padding: EdgeInsets.symmetric(
                    horizontal:
                        MediaQuery.of(context).size.width < 360 ? 10 : 16,
                    vertical: 8,
                  ),
                  child: Column(
                    children: [
                      // 1. Top Bar: Back (44x44), Title, XP & Coin Capsule
                      HouseBuildTopBar(
                        onBack: () => context.pop(),
                        coins: coinBalance,
                        xp: xpBalance,
                      ),

                      const SizedBox(height: 10),

                      // 2. Progress Card: Stage 0/6, Title, Progress bar
                      HouseProgressCard(
                        currentStage: _currentStage,
                      ),

                      const SizedBox(height: 10),

                      // 3. 3D House Scene View inside Expanded
                      Expanded(
                        child: HouseSceneView(
                          game3DView: buildHouseGameView(
                            context: context,
                            onMessageFromGame: _onMessageFromGame,
                          ),
                          isNightMode: _isNightMode,
                          isInteriorMode: _isInteriorMode,
                          isMuted: _isMuted,
                          onboardingTooltip: _onboardingTooltip,
                          celebrationBadge: _celebrationBadge,
                          onToggleNightMode: _toggleNightMode,
                          onResetCamera: _resetCamera,
                          onToggleInteriorMode: _toggleInterior,
                          onToggleMute: _toggleMute,
                          onRotate90: _rotate90,
                          onDismissTooltip: _nextOnboardingStep,
                        ),
                      ),

                      const SizedBox(height: 12),

                      // 4. Bottom Action Bar: "Qurish • $cost coin" + "Do‘kon"
                      HouseBottomBar(
                        currentStage: _currentStage,
                        userCoins: coinBalance,
                        isBuilding: _isBuilding,
                        onBuildNextStage: _buildNextStage,
                        onOpenStore: _openStore,
                      ),
                    ],
                  ),
                ),
              ),

              // Loading overlay
              if (_isLoading)
                Positioned.fill(
                  child: Container(
                    color: colors.background.withValues(alpha: 0.6),
                    child: Center(
                      child: CircularProgressIndicator(color: colors.primary),
                    ),
                  ),
                ),

              // Confetti Particle Layer for Stage 6 Complete
              if (_confettiAnimController.isAnimating)
                Positioned.fill(
                  child: IgnorePointer(
                    child: CustomPaint(
                      painter: _ConfettiPainter(
                        particles: _confetti,
                        progress: _confettiAnimController.value,
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
}

/// Particle model for confetti celebration
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
    final paint = Paint()..style = PaintingStyle.fill;
    for (final p in particles) {
      final currentX = (p.x + p.vx * progress) * size.width;
      final currentY = (p.y + p.vy * progress) * size.height;
      if (currentY > size.height) continue;

      paint.color = p.color;
      canvas.save();
      canvas.translate(currentX, currentY);
      canvas.rotate(p.rotation + p.vRot * progress);
      canvas.drawRect(
        Rect.fromCenter(
            center: Offset.zero, width: p.size, height: p.size * 0.6),
        paint,
      );
      canvas.restore();
    }
  }

  @override
  bool shouldRepaint(covariant _ConfettiPainter oldDelegate) => true;
}
