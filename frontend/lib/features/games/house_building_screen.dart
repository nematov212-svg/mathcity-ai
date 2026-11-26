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
import '../../core/widgets/coin_badge.dart';
import '../../core/widgets/xp_coin.dart';
import '../../shared/providers/student_provider.dart';
import 'house_game_view.dart';

/// Data class representing a catalog item in the 3D House Store
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
  // Foundation
  HouseCatalogItem(
      id: 'clean_lot',
      name: 'Maydonni tozalash',
      category: 'foundation',
      stage: 1,
      coinPrice: 1,
      iconEmoji: '🧹'),
  HouseCatalogItem(
      id: 'gravel_base',
      name: 'Qum-shag‘al asos',
      category: 'foundation',
      stage: 1,
      coinPrice: 5,
      iconEmoji: '🪨'),
  HouseCatalogItem(
      id: 'concrete_foundation',
      name: 'Beton poydevor',
      category: 'foundation',
      stage: 1,
      coinPrice: 30,
      iconEmoji: '🧱'),
  HouseCatalogItem(
      id: 'reinforced_basement',
      name: 'Mustahkam poydevor',
      category: 'foundation',
      stage: 1,
      coinPrice: 120,
      iconEmoji: '🏗️'),

  // Walls
  HouseCatalogItem(
      id: 'mud_brick_wall',
      name: 'Paxsa devor',
      category: 'walls',
      stage: 2,
      coinPrice: 40,
      iconEmoji: '🧱'),
  HouseCatalogItem(
      id: 'white_brick_wall',
      name: 'Oq g‘isht devor',
      category: 'walls',
      stage: 2,
      coinPrice: 80,
      iconEmoji: '🏠'),
  HouseCatalogItem(
      id: 'red_brick_wall',
      name: 'Pishiq qizil g‘isht devor',
      category: 'walls',
      stage: 2,
      coinPrice: 150,
      iconEmoji: '🧱'),
  HouseCatalogItem(
      id: 'stone_wall',
      name: 'Tabiiy tosh devor',
      category: 'walls',
      stage: 2,
      coinPrice: 250,
      iconEmoji: '🪨'),
  HouseCatalogItem(
      id: 'modern_glass_wall',
      name: 'Zamonaviy shisha-panoramik',
      category: 'walls',
      stage: 2,
      coinPrice: 400,
      iconEmoji: '✨'),

  // Roofs
  HouseCatalogItem(
      id: 'flat_roof',
      name: 'Yassi tom (Terrasa & Panjara)',
      category: 'roof',
      stage: 3,
      coinPrice: 40,
      iconEmoji: '🛖'),
  HouseCatalogItem(
      id: 'shed_roof',
      name: 'Bir nishabli tom',
      category: 'roof',
      stage: 3,
      coinPrice: 60,
      iconEmoji: '🛖'),
  HouseCatalogItem(
      id: 'gable_roof',
      name: 'Ikki nishabli tom',
      category: 'roof',
      stage: 3,
      coinPrice: 100,
      iconEmoji: '🛖'),
  HouseCatalogItem(
      id: 'pyramid_roof',
      name: 'Piramida tom',
      category: 'roof',
      stage: 3,
      coinPrice: 120,
      iconEmoji: '🛖'),
  HouseCatalogItem(
      id: 'tile_roof',
      name: 'Koshinli (cherepitsa) tom',
      category: 'roof',
      stage: 3,
      coinPrice: 180,
      iconEmoji: '🛖'),
  HouseCatalogItem(
      id: 'solar_roof',
      name: 'Quyosh panelli tom',
      category: 'roof',
      stage: 3,
      coinPrice: 450,
      iconEmoji: '☀️'),

  // Doors
  HouseCatalogItem(
      id: 'simple_wood_door',
      name: 'Oddiy yog‘och eshik',
      category: 'doors',
      stage: 5,
      coinPrice: 40,
      iconEmoji: '🚪'),
  HouseCatalogItem(
      id: 'standard_door',
      name: 'Klassik eshik',
      category: 'doors',
      stage: 5,
      coinPrice: 90,
      iconEmoji: '🚪'),
  HouseCatalogItem(
      id: 'double_door',
      name: 'Ikki tabaqali hashamatli eshik',
      category: 'doors',
      stage: 5,
      coinPrice: 160,
      iconEmoji: '🚪'),
  HouseCatalogItem(
      id: 'garage_gate',
      name: 'Avtomat garaj darvozasi (108)',
      category: 'doors',
      stage: 5,
      coinPrice: 220,
      iconEmoji: '🚪'),
  HouseCatalogItem(
      id: 'modern_glass_door',
      name: 'Zamonaviy shisha eshik',
      category: 'doors',
      stage: 5,
      coinPrice: 300,
      iconEmoji: '🚪'),

  // Windows
  HouseCatalogItem(
      id: 'small_window',
      name: 'Kichik deraza',
      category: 'windows',
      stage: 4,
      coinPrice: 15,
      iconEmoji: '🪟'),
  HouseCatalogItem(
      id: 'standard_window',
      name: 'Standart oq romli deraza',
      category: 'windows',
      stage: 4,
      coinPrice: 50,
      iconEmoji: '🪟'),
  HouseCatalogItem(
      id: 'panoramic_window',
      name: 'Katta panoramik vitrina',
      category: 'windows',
      stage: 4,
      coinPrice: 150,
      iconEmoji: '🪟'),
  HouseCatalogItem(
      id: 'stained_glass_window',
      name: 'Rangli vitraj deraza',
      category: 'windows',
      stage: 4,
      coinPrice: 200,
      iconEmoji: '🪟'),

  // Yard & Garden
  HouseCatalogItem(
      id: 'stone_path',
      name: 'Tosh yo‘lak & LED chiroqlar',
      category: 'yard',
      stage: 6,
      coinPrice: 5,
      iconEmoji: '🛤️',
      multiPlace: true),
  HouseCatalogItem(
      id: 'bush',
      name: 'Binafsha gulli butazor',
      category: 'yard',
      stage: 6,
      coinPrice: 6,
      iconEmoji: '🌺',
      multiPlace: true),
  HouseCatalogItem(
      id: 'flower',
      name: 'Gulzordagi rang-barang gullar',
      category: 'yard',
      stage: 6,
      coinPrice: 4,
      iconEmoji: '🌸',
      multiPlace: true),
  HouseCatalogItem(
      id: 'tree',
      name: 'Salobatli manzarali daraxt',
      category: 'yard',
      stage: 6,
      coinPrice: 15,
      iconEmoji: '🌳',
      multiPlace: true),
  HouseCatalogItem(
      id: 'fruit_tree',
      name: 'Mevazor olma daraxti',
      category: 'yard',
      stage: 6,
      coinPrice: 25,
      iconEmoji: '🍎',
      multiPlace: true),
  HouseCatalogItem(
      id: 'street_lantern',
      name: 'Zamonaviy LED tungi fonar',
      category: 'yard',
      stage: 6,
      coinPrice: 18,
      iconEmoji: '💡',
      multiPlace: true),
  HouseCatalogItem(
      id: 'bench',
      name: 'Yog‘och o‘rindiq (skameyka)',
      category: 'yard',
      stage: 6,
      coinPrice: 12,
      iconEmoji: '🪑',
      multiPlace: true),
  HouseCatalogItem(
      id: 'wooden_fence',
      name: 'Oq yog‘och panjara',
      category: 'yard',
      stage: 6,
      coinPrice: 8,
      iconEmoji: '🪵',
      multiPlace: true),
  HouseCatalogItem(
      id: 'swimming_pool',
      name: 'Hashamatli basseyn & soyabon',
      category: 'yard',
      stage: 6,
      coinPrice: 220,
      iconEmoji: '🏊'),
  HouseCatalogItem(
      id: 'fountain',
      name: 'Marmar favvora',
      category: 'yard',
      stage: 6,
      coinPrice: 160,
      iconEmoji: '⛲'),

  // Transport
  HouseCatalogItem(
      id: 'bicycle',
      name: 'Tezyurar sport velosiped',
      category: 'vehicles',
      stage: 6,
      coinPrice: 40,
      iconEmoji: '🚲'),
  HouseCatalogItem(
      id: 'scooter',
      name: 'Elektr skuter',
      category: 'vehicles',
      stage: 6,
      coinPrice: 70,
      iconEmoji: '🛴'),
  HouseCatalogItem(
      id: 'motorcycle',
      name: 'Klassik mototsikl',
      category: 'vehicles',
      stage: 6,
      coinPrice: 150,
      iconEmoji: '🏍️'),
  HouseCatalogItem(
      id: 'standard_car',
      name: 'Oila uchun qulay sedan',
      category: 'vehicles',
      stage: 6,
      coinPrice: 300,
      iconEmoji: '🚗'),
  HouseCatalogItem(
      id: 'sports_car',
      name: 'Hashamatli sportkar (Supercar)',
      category: 'vehicles',
      stage: 6,
      coinPrice: 450,
      iconEmoji: '🏎️'),
  HouseCatalogItem(
      id: 'large_suv',
      name: 'Katta jip (SUV)',
      category: 'vehicles',
      stage: 6,
      coinPrice: 500,
      iconEmoji: '🚙'),

  // Interior
  HouseCatalogItem(
      id: 'carpet',
      name: 'Milliy gilam',
      category: 'interior',
      stage: 2,
      coinPrice: 8,
      iconEmoji: '🛋️'),
  HouseCatalogItem(
      id: 'table',
      name: 'Yog‘och stol',
      category: 'interior',
      stage: 2,
      coinPrice: 12,
      iconEmoji: '🪵'),
  HouseCatalogItem(
      id: 'sofa',
      name: 'Yumshoq zamonaviy divan',
      category: 'interior',
      stage: 2,
      coinPrice: 35,
      iconEmoji: '🛋️'),
  HouseCatalogItem(
      id: 'bed',
      name: 'Katta qulay karavot',
      category: 'interior',
      stage: 2,
      coinPrice: 40,
      iconEmoji: '🛏️'),
  HouseCatalogItem(
      id: 'tv',
      name: 'Katta ekranli Smart TV',
      category: 'interior',
      stage: 2,
      coinPrice: 60,
      iconEmoji: '📺'),

  // Extras
  HouseCatalogItem(
      id: 'stairs',
      name: 'Pelepoya (zinapoya)',
      category: 'extras',
      stage: 2,
      coinPrice: 15,
      iconEmoji: '🪜'),
  HouseCatalogItem(
      id: 'balcony',
      name: 'Shisha panjarali balkon',
      category: 'extras',
      stage: 3,
      coinPrice: 45,
      iconEmoji: '🏢'),
  HouseCatalogItem(
      id: 'second_floor',
      name: 'Ikkinchi qavat (2-etaj)',
      category: 'extras',
      stage: 3,
      coinPrice: 300,
      iconEmoji: '🏰'),
  HouseCatalogItem(
      id: 'chimney',
      name: 'Kamin mo‘risi',
      category: 'extras',
      stage: 3,
      coinPrice: 20,
      iconEmoji: '🧱'),
  HouseCatalogItem(
      id: 'roof_antenna',
      name: 'Tom antennasi',
      category: 'extras',
      stage: 3,
      coinPrice: 12,
      iconEmoji: '📡'),
];

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
  bool _isSceneReady = false;

  // 3D Scene Controls State
  bool _isNightMode = false;
  bool _isInteriorMode = false;
  bool _isMuted = false;

  // Catalog & Inventory Data from Backend
  List<HouseCatalogItem> _catalog = [];
  List<Map<String, dynamic>> _placedItems = [];
  List<String> _inventory = [];

  // Active Placement Ghost State
  HouseCatalogItem? _activePlacingItem;
  String _activePlacingColor = '#1E3A8A';

  // Selected Placed Item for Inspection & Editing
  Map<String, dynamic>? _selectedPlacedItem;

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
  }

  @override
  void dispose() {
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
              sendTimeout: const Duration(seconds: 6),
              receiveTimeout: const Duration(seconds: 6),
            ),
          );
      if (res.statusCode == 200 &&
          res.data != null &&
          res.data['success'] == true) {
        final data = res.data['data'];
        final stage = (data['currentStage'] as num?)?.toInt() ?? 0;
        final catalogRaw = data['catalog'] as List? ?? [];
        final myState = data['myState'] as Map<String, dynamic>? ?? {};

        final catalogList = catalogRaw
            .whereType<Map<String, dynamic>>()
            .map((e) => HouseCatalogItem.fromJson(e))
            .toList();

        final placedRaw = myState['placedItems'] as List? ?? [];
        final placedList = placedRaw.whereType<Map<String, dynamic>>().toList();
        final inventoryList = (myState['inventory'] as List? ?? [])
            .map((e) => e.toString())
            .toList();

        if (mounted) {
          setState(() {
            _currentStage = stage;
            _catalog = catalogList;
            _placedItems = placedList;
            _inventory = inventoryList;
            _isLoading = false;
          });
          await prefs.setInt('mc_house_building_stage', stage);
          _syncStateTo3DScene();
        }
        return;
      }
    } catch (_) {
      // Fallback gracefully to local catalog and offline state
    }

    if (mounted) {
      setState(() {
        if (_catalog.isEmpty) {
          _catalog = kFallbackHouseCatalog;
        }
        _isLoading = false;
      });
      _syncStateTo3DScene();
    }
  }

  void _syncStateTo3DScene() {
    if (!_isSceneReady) return;
    postMessageToHouseGame('LOAD_STATE', {
      'placedItems': _placedItems,
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

      case 'REQUEST_PLACE_ITEM':
        _handlePlacementRequest(data);
        break;

      case 'ITEM_SELECTED':
        HapticFeedback.selectionClick();
        setState(() {
          _selectedPlacedItem = data;
          _activePlacingItem = null;
        });
        break;

      case 'CAMERA_RESET':
        HapticFeedback.lightImpact();
        break;

      case 'GHOST_ROTATED':
        HapticFeedback.selectionClick();
        break;

      default:
        break;
    }
  }

  Future<void> _handlePlacementRequest(Map<String, dynamic> data) async {
    final itemId = data['itemId']?.toString() ?? '';
    final cellX = (data['cellX'] as num?)?.toInt() ?? 6;
    final cellY = (data['cellY'] as num?)?.toInt() ?? 6;
    final rotation = (data['rotation'] as num?)?.toInt() ?? 0;
    final color = data['color']?.toString() ?? _activePlacingColor;

    try {
      final res = await ApiClient().dio.post(
        '/games/house-building/place',
        data: {
          'itemId': itemId,
          'cellX': cellX,
          'cellY': cellY,
          'rotation': rotation,
          'color': color,
        },
      );

      if (res.data != null && res.data['success'] == true) {
        final placedItem =
            Map<String, dynamic>.from(res.data['data']['placedItem']);
        final newStage = (res.data['data']['currentStage'] as num?)?.toInt() ??
            _currentStage;
        final xpAwarded =
            (res.data['data']['xpAwarded'] as num?)?.toInt() ?? 10;

        // Update local state
        setState(() {
          _placedItems
              .removeWhere((p) => p['instanceId'] == placedItem['instanceId']);
          _placedItems.add(placedItem);
          _currentStage = newStage;
          _activePlacingItem = null;
        });

        // Award XP to student provider
        ref.read(studentProvider.notifier).updateXP(xpAwarded);

        // Notify 3D engine to add placed mesh with bounce animation
        postMessageToHouseGame('ITEM_PLACED', {'item': placedItem});

        HapticFeedback.heavyImpact();

        final prefs = await SharedPreferences.getInstance();
        await prefs.setInt('mc_house_building_stage', newStage);

        if (newStage >= 6) {
          _triggerConfetti();
          _showCelebrationDialog();
        } else {
          _showSnackbar(
              'Qurilish muvaffaqiyatli amalga oshirildi! ✨ (+$xpAwarded XP)');
        }
      } else {
        final errorMsg = res.data?['error']?.toString() ??
            'Joylashtirishda xatolik yuz berdi';
        _showSnackbar(errorMsg, isError: true);
        postMessageToHouseGame('CANCEL_PLACEMENT', {});
      }
    } catch (e) {
      debugPrint(
          'Error placing item on backend, applying resilient local placement: $e');
      final localInstanceId = 'placed_${DateTime.now().millisecondsSinceEpoch}';
      final placedItem = {
        'instanceId': localInstanceId,
        'itemId': itemId,
        'cellX': cellX,
        'cellY': cellY,
        'rotation': rotation,
        'color': color,
        'placedAt': DateTime.now().toIso8601String(),
      };
      final newStage = math.min(6, _currentStage + 1);
      setState(() {
        _placedItems.removeWhere((p) => p['instanceId'] == localInstanceId);
        _placedItems.add(placedItem);
        _currentStage = newStage;
        _activePlacingItem = null;
      });
      ref.read(studentProvider.notifier).updateXP(10);
      postMessageToHouseGame('ITEM_PLACED', {'item': placedItem});
      HapticFeedback.heavyImpact();
      final prefs = await SharedPreferences.getInstance();
      await prefs.setInt('mc_house_building_stage', newStage);
      if (newStage >= 6) {
        _triggerConfetti();
        _showCelebrationDialog();
      } else {
        _showSnackbar('Qurilish muvaffaqiyatli amalga oshirildi! ✨ (+10 XP)');
      }
    }
  }

  Future<void> _buyItem(HouseCatalogItem item,
      {bool placeImmediately = true}) async {
    final student = ref.read(studentProvider).student;
    final currentCoins = student?.coinBalance ?? 0;

    if (currentCoins < item.coinPrice) {
      HapticFeedback.mediumImpact();
      _showNotEnoughCoinsDialog(item);
      return;
    }

    try {
      final res = await ApiClient().dio.post(
        '/games/house-building/buy',
        data: {'itemId': item.id},
      );

      if (res.data != null && res.data['success'] == true) {
        // Debit coin and award XP
        ref.read(studentProvider.notifier).updateCoins(-item.coinPrice);
        final xp = (res.data['data']['xp'] as num?)?.toInt() ?? 5;
        ref.read(studentProvider.notifier).updateXP(xp);

        setState(() {
          _inventory.add(item.id);
        });

        HapticFeedback.lightImpact();

        if (placeImmediately) {
          Navigator.of(context).pop(); // Close store bottom sheet
          _startPlacement(item);
        } else {
          _showSnackbar('${item.name} inventarga qo‘shildi!');
        }
      }
    } catch (e) {
      debugPrint(
          'Error purchasing item on backend, applying resilient local purchase: $e');
      ref.read(studentProvider.notifier).updateCoins(-item.coinPrice);
      ref.read(studentProvider.notifier).updateXP(5);
      setState(() {
        _inventory.add(item.id);
      });
      HapticFeedback.lightImpact();
      if (placeImmediately) {
        Navigator.of(context).pop();
        _startPlacement(item);
      } else {
        _showSnackbar('${item.name} xarid qilindi!');
      }
    }
  }

  void _startPlacement(HouseCatalogItem item) {
    setState(() {
      _activePlacingItem = item;
      _selectedPlacedItem = null;
    });

    postMessageToHouseGame('SELECT_ITEM_TO_PLACE', {
      'itemId': item.id,
      'color': _activePlacingColor,
    });

    _showSnackbar('Katakni bosing va joylashtiring!');
  }

  void _cancelPlacement() {
    setState(() {
      _activePlacingItem = null;
    });
    postMessageToHouseGame('CANCEL_PLACEMENT', {});
  }

  void _rotateGhost() {
    HapticFeedback.selectionClick();
    postMessageToHouseGame('ROTATE_GHOST', {});
  }

  Future<void> _rotatePlacedItem(String instanceId) async {
    try {
      final res = await ApiClient().dio.post(
        '/games/house-building/rotate',
        data: {'instanceId': instanceId},
      );
      if (res.data != null && res.data['success'] == true) {
        final updated =
            Map<String, dynamic>.from(res.data['data']['placedItem']);
        setState(() {
          final idx =
              _placedItems.indexWhere((p) => p['instanceId'] == instanceId);
          if (idx != -1) _placedItems[idx] = updated;
          if (_selectedPlacedItem?['instanceId'] == instanceId) {
            _selectedPlacedItem = updated;
          }
        });
        postMessageToHouseGame('ITEM_PLACED', {'item': updated});
        HapticFeedback.lightImpact();
      }
    } catch (e) {
      debugPrint('Error rotating item: $e');
    }
  }

  Future<void> _sellPlacedItem(String instanceId) async {
    try {
      final res = await ApiClient().dio.post(
        '/games/house-building/sell',
        data: {'instanceId': instanceId},
      );
      if (res.data != null && res.data['success'] == true) {
        final refund = (res.data['data']['refund'] as num?)?.toInt() ?? 0;
        final newStage = (res.data['data']['currentStage'] as num?)?.toInt() ??
            _currentStage;

        ref.read(studentProvider.notifier).updateCoins(refund);

        setState(() {
          _placedItems.removeWhere((p) => p['instanceId'] == instanceId);
          _selectedPlacedItem = null;
          _currentStage = newStage;
        });

        postMessageToHouseGame('ITEM_REMOVED', {'instanceId': instanceId});
        HapticFeedback.mediumImpact();
        _showSnackbar('Buyum sotildi! +$refund coin qaytarildi.');
      }
    } catch (e) {
      debugPrint('Error selling item: $e');
    }
  }

  void _toggleTheme() {
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

  void _showNotEnoughCoinsDialog(HouseCatalogItem item) {
    final appColors = Theme.of(context).extension<AppThemeColors>();
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final student = ref.read(studentProvider).student;
    final userCoins = student?.coinBalance ?? 0;

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: appColors?.card ??
            (isDark ? const Color(0xFF1B182C) : Colors.white),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: BorderSide(
            color: appColors?.border ??
                (isDark ? const Color(0xFF302A46) : const Color(0xFFE2E5EF)),
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
              child: const Icon(Icons.monetization_on_rounded,
                  color: Colors.amber, size: 28),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                'Coinlar yetarli emas!',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: appColors?.ink ??
                      (isDark ? Colors.white : const Color(0xFF17152B)),
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
              '«${item.name}» uchun ${item.coinPrice} coin kerak. Sizda esa $userCoins coin mavjud.',
              style: TextStyle(
                fontSize: 14,
                color: appColors?.muted ??
                    (isDark
                        ? const Color(0xFFB5B2C7)
                        : const Color(0xFF626579)),
              ),
            ),
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color:
                    isDark ? const Color(0xFF26213B) : const Color(0xFFF1F3F9),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Sizdagi coinlar:',
                    style: TextStyle(
                      fontSize: 13,
                      color: appColors?.ink ??
                          (isDark ? Colors.white : const Color(0xFF17152B)),
                    ),
                  ),
                  Row(
                    children: [
                      const CoinBadge(count: 0, size: 18),
                      const SizedBox(width: 4),
                      Text(
                        '$userCoins ta',
                        style: const TextStyle(
                            fontWeight: FontWeight.bold, color: Colors.amber),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),
            Text(
              '💡 Maslahat: Matematika darslari va misollarni yechib, ko‘plab coinlar yutib oling!',
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
              'Bekor qilish',
              style: TextStyle(
                color: appColors?.muted ??
                    (isDark ? Colors.white70 : const Color(0xFF626579)),
              ),
            ),
          ),
          ElevatedButton.icon(
            onPressed: () {
              Navigator.of(ctx).pop();
              context.push('/practice');
            },
            icon: const Icon(Icons.calculate_rounded, size: 18),
            label: const Text('Misol yechishga o‘tish'),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF8B5CF6),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ],
      ),
    );
  }

  void _openStoreBottomSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _HouseStoreBottomSheet(
        catalog: _catalog,
        placedItems: _placedItems,
        inventory: _inventory,
        activeRoofColor: _activePlacingColor,
        onSelectRoofColor: (hex) {
          setState(() {
            _activePlacingColor = hex;
          });
        },
        onBuyItem: (item) => _buyItem(item),
        onPlaceItem: (item) {
          Navigator.of(ctx).pop();
          _startPlacement(item);
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final student = ref.read(studentProvider).student;
    final coinBalance = student?.coinBalance ?? 0;
    final xpBalance = student?.totalXP ?? 0;

    return Scaffold(
      backgroundColor:
          isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
      body: Stack(
        children: [
          // 1. Embedded 3D House Scene Viewport
          Positioned.fill(
            child: buildHouseGameView(
              context: context,
              onMessageFromGame: _onMessageFromGame,
            ),
          ),

          if (_isLoading)
            const Positioned.fill(
              child: Center(
                child: CircularProgressIndicator(color: Color(0xFF8B5CF6)),
              ),
            ),

          // 2. Confetti Particle Layer for Stage 6 Complete
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

          // 3. Top HUD: Back Button, Progress Pill, Coin/XP Badges, Tool Buttons
          SafeArea(
            child: Padding(
              padding: EdgeInsets.symmetric(
                horizontal: MediaQuery.of(context).size.width < 360 ? 8 : 14,
                vertical: 8,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    children: [
                      // Back Button
                      _buildCircleButton(
                        icon: Icons.arrow_back_ios_new_rounded,
                        onTap: () => context.pop(),
                        tooltip: 'Orqaga',
                        isDark: isDark,
                      ),
                      const SizedBox(width: 8),

                      // Stage Pill
                      Expanded(
                        child: Container(
                          padding: EdgeInsets.symmetric(
                            horizontal: MediaQuery.of(context).size.width < 360
                                ? 8
                                : 12,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: (isDark
                                    ? const Color(0xFF1E1B4B)
                                    : Colors.white)
                                .withValues(alpha: 0.9),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: const Color(0xFF8B5CF6)
                                  .withValues(alpha: 0.4),
                              width: 1.5,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.15),
                                blurRadius: 8,
                                offset: const Offset(0, 3),
                              ),
                            ],
                          ),
                          child: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(6),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF8B5CF6)
                                      .withValues(alpha: 0.2),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  Icons.home_work_rounded,
                                  color: Color(0xFF8B5CF6),
                                  size: 18,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    FittedBox(
                                      fit: BoxFit.scaleDown,
                                      alignment: Alignment.centerLeft,
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Text(
                                            'Uy qurish',
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                            style: TextStyle(
                                              fontSize: 13,
                                              fontWeight: FontWeight.bold,
                                              color: isDark
                                                  ? Colors.white
                                                  : const Color(0xFF0F172A),
                                            ),
                                          ),
                                          const SizedBox(width: 6),
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                                horizontal: 5, vertical: 1.5),
                                            decoration: BoxDecoration(
                                              color: const Color(0xFF8B5CF6)
                                                  .withValues(alpha: 0.15),
                                              borderRadius:
                                                  BorderRadius.circular(6),
                                            ),
                                            child: Text(
                                              '$_currentStage/6 bosqich',
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                              style: const TextStyle(
                                                fontSize: 9,
                                                color: Color(0xFF8B5CF6),
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      kHouseStageTitles[
                                          (_currentStage).clamp(0, 5)],
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(
                                        fontSize: 10,
                                        color: Color(0xFF10B981),
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(4),
                                      child: LinearProgressIndicator(
                                        value: (_currentStage / 6.0)
                                            .clamp(0.0, 1.0),
                                        backgroundColor: (isDark
                                                ? Colors.white
                                                : Colors.black)
                                            .withValues(alpha: 0.08),
                                        valueColor:
                                            const AlwaysStoppedAnimation<Color>(
                                                Color(0xFF8B5CF6)),
                                        minHeight: 5,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),

                      // Coin & XP Pill
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color:
                              (isDark ? const Color(0xFF1E1B4B) : Colors.white)
                                  .withValues(alpha: 0.9),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: Colors.amber.withValues(alpha: 0.4),
                            width: 1.5,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.15),
                              blurRadius: 8,
                              offset: const Offset(0, 3),
                            ),
                          ],
                        ),
                        child: FittedBox(
                          fit: BoxFit.scaleDown,
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const CoinIcon(size: 16),
                              const SizedBox(width: 4),
                              Text(
                                '$coinBalance',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 13,
                                  color: Colors.amber,
                                ),
                              ),
                              const SizedBox(width: 8),
                              const XpCoin(size: 16),
                              const SizedBox(width: 4),
                              Text(
                                '$xpBalance',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 13,
                                  color: Color(0xFF8B5CF6),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  // Tool Buttons Row (Theme, Reset Camera, Interior, Audio)
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    reverse: true,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        _buildQuickActionChip(
                          icon: _isNightMode
                              ? Icons.nightlight_round
                              : Icons.wb_sunny_rounded,
                          label: _isNightMode ? 'Tun' : 'Kun',
                          onTap: _toggleTheme,
                          isActive: _isNightMode,
                          isDark: isDark,
                        ),
                        const SizedBox(width: 6),
                        _buildQuickActionChip(
                          icon: Icons.videocam_rounded,
                          label: 'Markaz',
                          onTap: _resetCamera,
                          isActive: false,
                          isDark: isDark,
                        ),
                        const SizedBox(width: 6),
                        _buildQuickActionChip(
                          icon: Icons.meeting_room_rounded,
                          label: _isInteriorMode ? 'Tashqi' : 'Ichki',
                          onTap: _toggleInterior,
                          isActive: _isInteriorMode,
                          isDark: isDark,
                        ),
                        const SizedBox(width: 6),
                        _buildQuickActionChip(
                          icon: _isMuted
                              ? Icons.volume_off_rounded
                              : Icons.volume_up_rounded,
                          label: _isMuted ? 'Ovozsiz' : 'Ovozli',
                          onTap: _toggleMute,
                          isActive: !_isMuted,
                          isDark: isDark,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // 4. Active Placement Overlay (When user is placing a ghost item)
          if (_activePlacingItem != null)
            Positioned(
              bottom: 24,
              left: 16,
              right: 16,
              child: SafeArea(
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E1B4B).withValues(alpha: 0.94),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: const Color(0xFF8B5CF6).withValues(alpha: 0.6),
                      width: 2,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.35),
                        blurRadius: 16,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Text(
                        _activePlacingItem!.iconEmoji,
                        style: const TextStyle(fontSize: 26),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              _activePlacingItem!.name,
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                              ),
                            ),
                            const Text(
                              'Joylashtirish uchun katakni bosing',
                              style: TextStyle(
                                color: Color(0xFFCBD5E1),
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                      // 90 Deg Rotate Button
                      ElevatedButton.icon(
                        onPressed: _rotateGhost,
                        icon: const Icon(Icons.rotate_right_rounded, size: 18),
                        label: const Text('90°'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF3B82F6),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(
                              horizontal: 12, vertical: 10),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                      const SizedBox(width: 8),
                      // Cancel Button
                      IconButton(
                        onPressed: _cancelPlacement,
                        icon: const Icon(Icons.close_rounded,
                            color: Colors.white70),
                        tooltip: 'Bekor qilish',
                      ),
                    ],
                  ),
                ),
              ),
            ),

          // 5. Selected Placed Item Overlay (Inspect, Rotate, Sell)
          if (_selectedPlacedItem != null && _activePlacingItem == null)
            Positioned(
              bottom: 24,
              left: 16,
              right: 16,
              child: SafeArea(
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0F172A).withValues(alpha: 0.94),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: const Color(0xFF10B981).withValues(alpha: 0.6),
                      width: 2,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.35),
                        blurRadius: 16,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981).withValues(alpha: 0.2),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.check_circle_rounded,
                            color: Color(0xFF10B981), size: 22),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              _selectedPlacedItem!['name']?.toString() ??
                                  'Tanlangan buyum',
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                              ),
                            ),
                            Text(
                              'Katak: (${_selectedPlacedItem!['cellX']}, ${_selectedPlacedItem!['cellY']}) • Burish: ${_selectedPlacedItem!['rotation'] ?? 0}°',
                              style: const TextStyle(
                                color: Color(0xFF94A3B8),
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                      // Rotate
                      IconButton(
                        onPressed: () {
                          final instanceId =
                              _selectedPlacedItem!['instanceId']?.toString();
                          if (instanceId != null) _rotatePlacedItem(instanceId);
                        },
                        icon: const Icon(Icons.rotate_right_rounded,
                            color: Color(0xFF60A5FA)),
                        tooltip: '90° burish',
                      ),
                      // Sell for 50%
                      IconButton(
                        onPressed: () {
                          final instanceId =
                              _selectedPlacedItem!['instanceId']?.toString();
                          if (instanceId != null) _sellPlacedItem(instanceId);
                        },
                        icon: const Icon(Icons.delete_outline_rounded,
                            color: Color(0xFFF87171)),
                        tooltip: 'Sotish (50% coin qaytariladi)',
                      ),
                      // Close selection
                      IconButton(
                        onPressed: () {
                          setState(() {
                            _selectedPlacedItem = null;
                          });
                        },
                        icon: const Icon(Icons.close_rounded,
                            color: Colors.white70),
                      ),
                    ],
                  ),
                ),
              ),
            ),

          // 6. Floating Bottom Store Button (When not placing)
          if (_activePlacingItem == null && _selectedPlacedItem == null)
            Positioned(
              bottom: 24,
              left: 20,
              right: 20,
              child: SafeArea(
                child: Center(
                  child: Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(24),
                      gradient: const LinearGradient(
                        colors: [Color(0xFF8B5CF6), Color(0xFF6D28D9)],
                      ),
                      boxShadow: [
                        BoxShadow(
                          color:
                              const Color(0xFF8B5CF6).withValues(alpha: 0.45),
                          blurRadius: 18,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        onTap: _openStoreBottomSheet,
                        borderRadius: BorderRadius.circular(24),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 20, vertical: 12),
                          child: FittedBox(
                            fit: BoxFit.scaleDown,
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: const [
                                Icon(Icons.storefront_rounded,
                                    color: Colors.white, size: 22),
                                SizedBox(width: 10),
                                Text(
                                  'Qurilish do‘koni',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 15,
                                    letterSpacing: 0.3,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildCircleButton({
    required IconData icon,
    required VoidCallback onTap,
    required String tooltip,
    required bool isDark,
  }) {
    return Tooltip(
      message: tooltip,
      child: Material(
        color: (isDark ? const Color(0xFF1E1B4B) : Colors.white)
            .withValues(alpha: 0.9),
        shape: const CircleBorder(),
        elevation: 3,
        shadowColor: Colors.black26,
        child: InkWell(
          customBorder: const CircleBorder(),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(10),
            child: Icon(
              icon,
              size: 20,
              color: isDark ? Colors.white : const Color(0xFF1E293B),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildQuickActionChip({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
    required bool isActive,
    required bool isDark,
  }) {
    return Material(
      color: isActive
          ? const Color(0xFF8B5CF6)
          : (isDark ? const Color(0xFF1E1B4B) : Colors.white)
              .withValues(alpha: 0.88),
      borderRadius: BorderRadius.circular(14),
      elevation: 2,
      shadowColor: Colors.black26,
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                icon,
                size: 15,
                color: isActive
                    ? Colors.white
                    : (isDark
                        ? const Color(0xFFCBD5E1)
                        : const Color(0xFF334155)),
              ),
              const SizedBox(width: 4),
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: isActive
                      ? Colors.white
                      : (isDark
                          ? const Color(0xFFCBD5E1)
                          : const Color(0xFF334155)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Store Bottom Sheet Modal with Category Tabs & Swatches
class _HouseStoreBottomSheet extends StatefulWidget {
  final List<HouseCatalogItem> catalog;
  final List<Map<String, dynamic>> placedItems;
  final List<String> inventory;
  final String activeRoofColor;
  final ValueChanged<String> onSelectRoofColor;
  final Function(HouseCatalogItem item) onBuyItem;
  final Function(HouseCatalogItem item) onPlaceItem;

  const _HouseStoreBottomSheet({
    required this.catalog,
    required this.placedItems,
    required this.inventory,
    required this.activeRoofColor,
    required this.onSelectRoofColor,
    required this.onBuyItem,
    required this.onPlaceItem,
  });

  @override
  State<_HouseStoreBottomSheet> createState() => _HouseStoreBottomSheetState();
}

class _HouseStoreBottomSheetState extends State<_HouseStoreBottomSheet>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController =
        TabController(length: kStoreCategories.length, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final appColors = Theme.of(context).extension<AppThemeColors>();

    return Container(
      height: MediaQuery.of(context).size.height * 0.72,
      decoration: BoxDecoration(
        color: appColors?.card ??
            (isDark ? const Color(0xFF0F172A) : Colors.white),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
        border: Border(
          top: BorderSide(
            color: const Color(0xFF8B5CF6).withValues(alpha: 0.35),
            width: 2,
          ),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.35),
            blurRadius: 24,
            offset: const Offset(0, -6),
          ),
        ],
      ),
      child: Column(
        children: [
          // Drag handle
          Container(
            margin: const EdgeInsets.only(top: 10, bottom: 8),
            width: 44,
            height: 5,
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF334155) : const Color(0xFFCBD5E1),
              borderRadius: BorderRadius.circular(10),
            ),
          ),

          // Header: Title and Close
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.storefront_rounded,
                        color: Color(0xFF8B5CF6), size: 24),
                    const SizedBox(width: 8),
                    Text(
                      'Qurilish katalogi',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: appColors?.ink ??
                            (isDark ? Colors.white : const Color(0xFF0F172A)),
                      ),
                    ),
                  ],
                ),
                IconButton(
                  onPressed: () => Navigator.of(context).pop(),
                  icon: Icon(
                    Icons.close_rounded,
                    color: appColors?.muted ??
                        (isDark ? Colors.white70 : const Color(0xFF64748B)),
                  ),
                ),
              ],
            ),
          ),

          // Category TabBar
          TabBar(
            controller: _tabController,
            isScrollable: true,
            indicatorColor: const Color(0xFF8B5CF6),
            indicatorWeight: 3,
            labelColor: const Color(0xFF8B5CF6),
            unselectedLabelColor: appColors?.muted ??
                (isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B)),
            labelStyle:
                const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
            tabs: kStoreCategories
                .map((cat) => Tab(
                      icon: Icon(cat.icon, size: 18),
                      text: cat.title,
                    ))
                .toList(),
          ),

          const Divider(height: 1, thickness: 1),

          // Category Content TabBarView
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: kStoreCategories.map((cat) {
                final items =
                    widget.catalog.where((c) => c.category == cat.key).toList();
                return _buildCategoryGrid(cat.key, items, isDark, appColors);
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryGrid(
    String categoryKey,
    List<HouseCatalogItem> items,
    bool isDark,
    AppThemeColors? appColors,
  ) {
    return Column(
      children: [
        // If roof category, display 5 roof color swatches
        if (categoryKey == 'roof')
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF8FAFC),
              border: Border(
                bottom: BorderSide(
                  color: isDark
                      ? const Color(0xFF334155)
                      : const Color(0xFFE2E8F0),
                ),
              ),
            ),
            child: Row(
              children: [
                Text(
                  'Tom rangi:',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: appColors?.ink ??
                        (isDark ? Colors.white : const Color(0xFF1E293B)),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: kRoofColors.map((rc) {
                        final hex = rc['hex']!;
                        final isSelected =
                            widget.activeRoofColor.toLowerCase() ==
                                hex.toLowerCase();
                        final color =
                            Color(int.parse(hex.replaceFirst('#', '0xFF')));
                        return GestureDetector(
                          onTap: () => widget.onSelectRoofColor(hex),
                          child: Container(
                            margin: const EdgeInsets.only(right: 8),
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 5),
                            decoration: BoxDecoration(
                              color: color.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: isSelected
                                    ? const Color(0xFF8B5CF6)
                                    : color,
                                width: isSelected ? 2.5 : 1,
                              ),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  width: 12,
                                  height: 12,
                                  decoration: BoxDecoration(
                                      color: color, shape: BoxShape.circle),
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  rc['name']!,
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: isSelected
                                        ? FontWeight.bold
                                        : FontWeight.normal,
                                    color: isSelected
                                        ? const Color(0xFF8B5CF6)
                                        : (isDark
                                            ? Colors.white70
                                            : const Color(0xFF334155)),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                ),
              ],
            ),
          ),

        // Items Grid
        Expanded(
          child: items.isEmpty
              ? Center(
                  child: Text(
                    'Ushbu bo‘limda buyumlar yo‘q',
                    style: TextStyle(
                      color: appColors?.muted ??
                          (isDark ? Colors.white60 : const Color(0xFF64748B)),
                    ),
                  ),
                )
              : GridView.builder(
                  padding: const EdgeInsets.all(14),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 0.95,
                  ),
                  itemCount: items.length,
                  itemBuilder: (ctx, idx) {
                    final item = items[idx];
                    final isPlaced =
                        widget.placedItems.any((p) => p['itemId'] == item.id);
                    final isOwned = widget.inventory.contains(item.id);

                    // Check dependency
                    bool isLocked = false;
                    String lockReason = '';
                    if (item.category == 'walls') {
                      final hasFoundation = widget.placedItems.any((p) =>
                          (p['category'] ?? '').toString() == 'foundation' ||
                          (p['itemId'] ?? '')
                              .toString()
                              .contains('foundation'));
                      if (!hasFoundation) {
                        isLocked = true;
                        lockReason = 'Avval poydevor quring';
                      }
                    } else if (item.category == 'roof' ||
                        item.category == 'doors' ||
                        item.category == 'windows') {
                      final hasWall = widget.placedItems.any((p) =>
                          (p['category'] ?? '').toString() == 'walls' ||
                          (p['itemId'] ?? '').toString().contains('wall'));
                      if (!hasWall) {
                        isLocked = true;
                        lockReason = 'Avval devor quring';
                      }
                    }

                    return _buildItemCard(item, isPlaced, isOwned, isLocked,
                        lockReason, isDark, appColors);
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildItemCard(
    HouseCatalogItem item,
    bool isPlaced,
    bool isOwned,
    bool isLocked,
    String lockReason,
    bool isDark,
    AppThemeColors? appColors,
  ) {
    return Container(
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: isPlaced
              ? const Color(0xFF10B981).withValues(alpha: 0.5)
              : (isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0)),
          width: isPlaced ? 1.5 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(item.iconEmoji, style: const TextStyle(fontSize: 26)),
              if (isPlaced)
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: const Color(0xFF10B981).withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Text(
                    'O‘rnatilgan',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF10B981),
                    ),
                  ),
                )
              else
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const CoinBadge(count: 0, size: 14),
                    const SizedBox(width: 4),
                    Text(
                      '${item.coinPrice}',
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                        color: Colors.amber,
                      ),
                    ),
                  ],
                ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            item.name,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: appColors?.ink ??
                  (isDark ? Colors.white : const Color(0xFF0F172A)),
            ),
          ),
          const Spacer(),
          if (isLocked)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 6),
              decoration: BoxDecoration(
                color: const Color(0xFFEF4444).withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                lockReason,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFFEF4444),
                ),
              ),
            )
          else if (isPlaced && !item.multiPlace)
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: () => widget.onPlaceItem(item),
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xFF10B981),
                  side: const BorderSide(color: Color(0xFF10B981)),
                  padding: const EdgeInsets.symmetric(vertical: 6),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10)),
                ),
                child: const Text('Ko‘chirish',
                    style:
                        TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
              ),
            )
          else if (isOwned)
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => widget.onPlaceItem(item),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF10B981),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 6),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10)),
                ),
                child: const Text('Joylashtirish',
                    style:
                        TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
              ),
            )
          else
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => widget.onBuyItem(item),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF8B5CF6),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 6),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10)),
                ),
                child: Text('Sotib olish (${item.coinPrice})',
                    style: const TextStyle(
                        fontSize: 11, fontWeight: FontWeight.bold)),
              ),
            ),
        ],
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
