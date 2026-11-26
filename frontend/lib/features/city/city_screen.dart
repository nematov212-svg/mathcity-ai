import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/network/api_client.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/coin_badge.dart';
import '../../core/widgets/custom_button.dart';
import '../../core/widgets/mathcity_bottom_nav.dart';
import '../../shared/models/building_model.dart';
import '../../shared/providers/student_provider.dart';
import 'isometric_city_widget.dart';

class CityScreen extends ConsumerStatefulWidget {
  const CityScreen({super.key});

  @override
  ConsumerState<CityScreen> createState() => _CityScreenState();
}

class _CityScreenState extends ConsumerState<CityScreen>
    with TickerProviderStateMixin {
  late AnimationController _constructionController;
  late AnimationController _coinDeductController;
  String? _coinDeductText;
  int? _animatingGridX;
  int? _animatingGridY;

  int _citizenCount = 15;
  int _carLevel = 1;
  String _carModel = 'Sedan';
  Color _carColor = const Color(0xFFE53E3E);
  double _carSpeed = 1.0;

  // Island placed buildings (matches reference design)
  final List<PlacedBuildingModel> _placedBuildings = [
    PlacedBuildingModel(
      buildingKey: 'observatory_space',
      name: 'Kosmik rasadxona',
      iconName: 'visibility',
      gridX: 1,
      gridY: 1,
    ),
    PlacedBuildingModel(
      buildingKey: 'school_math',
      name: 'Matematika maktabi',
      iconName: 'school',
      gridX: 2,
      gridY: 1,
    ),
    PlacedBuildingModel(
      buildingKey: 'house_basic',
      name: 'Kichik shinam uy',
      iconName: 'home',
      gridX: 0,
      gridY: 2,
    ),
  ];

  // Configurable Shop Catalog
  final List<BuildingModel> _shopCatalog = [
    BuildingModel(
      key: 'house_small',
      name: 'Kichik uy',
      category: 'Turar-joy',
      costInCoins: 50,
      requiredLevel: 1,
      description: 'Boshlang‘ich shinam 3D pastel uy.',
      iconName: 'home',
      mode: 'KIDS',
    ),
    BuildingModel(
      key: 'park_green',
      name: 'Eko bog‘ va daraxtlar',
      category: 'Dam olish',
      costInCoins: 100,
      requiredLevel: 1,
      description: 'Shahar havosini tozalovchi gullar va yashil daraxtlar.',
      iconName: 'park',
      mode: 'KIDS',
    ),
    BuildingModel(
      key: 'house_basic',
      name: 'Rangli uy',
      category: 'Turar-joy',
      costInCoins: 100,
      requiredLevel: 1,
      description: 'Shahar aholisi uchun shinam va yorug‘ 3D rangli uy.',
      iconName: 'home',
      mode: 'KIDS',
    ),
    BuildingModel(
      key: 'library_city',
      name: 'Shahar kutubxonasi',
      category: 'Ta’lim',
      costInCoins: 150,
      requiredLevel: 2,
      description: 'Klassik ustunlar va gumbazli ulkan kitoblar xazinasi.',
      iconName: 'menu_book',
      mode: 'KIDS',
    ),
    BuildingModel(
      key: 'house_modern',
      name: 'Zamonaviy uy',
      category: 'Turar-joy',
      costInCoins: 200,
      requiredLevel: 2,
      description: 'Quyosh panellari va terassali zamonaviy arxitektura.',
      iconName: 'apartment',
      mode: 'KIDS',
    ),
    BuildingModel(
      key: 'school_math',
      name: 'Matematika maktabi',
      category: 'Ta’lim',
      costInCoins: 250,
      requiredLevel: 2,
      description: 'Soat minorasi va qo‘ng‘iroqli zamonaviy bilim maskani.',
      iconName: 'school',
      mode: 'KIDS',
    ),
    BuildingModel(
      key: 'observatory_space',
      name: 'Kosmik rasadxona',
      category: 'Ilm-fan',
      costInCoins: 300,
      requiredLevel: 3,
      description:
          'Yulduzlar va osmon sirlarini o‘rganuvchi teleskopli rasadxona.',
      iconName: 'visibility',
      mode: 'KIDS',
    ),
    BuildingModel(
      key: 'house_villa',
      name: 'Katta villa',
      category: 'Turar-joy',
      costInCoins: 350,
      requiredLevel: 3,
      description: 'Katta bog‘li va basseynli hashamatli shahar villasi.',
      iconName: 'villa',
      mode: 'KIDS',
    ),
    BuildingModel(
      key: 'house_premium',
      name: 'Premium saroy',
      category: 'Turar-joy',
      costInCoins: 500,
      requiredLevel: 4,
      description: 'Eng yuqori darajadagi futuristik aqlli saroy.',
      iconName: 'castle',
      mode: 'KIDS',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _constructionController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );
    _coinDeductController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );
    _loadCityState();
  }

  @override
  void dispose() {
    _constructionController.dispose();
    _coinDeductController.dispose();
    super.dispose();
  }

  Future<void> _loadCityState() async {
    try {
      final res = await ApiClient().dio.get('/city');
      if (res.data != null && res.data['success'] == true) {
        final data = res.data['data'];
        if (mounted) {
          setState(() {
            _citizenCount = data['citizenCount'] ?? _citizenCount;
            if (data['carConfig'] != null) {
              _carLevel = data['carConfig']['level'] ?? _carLevel;
              _carModel = data['carConfig']['model'] ?? _carModel;
              _carSpeed =
                  (data['carConfig']['speed'] as num?)?.toDouble() ?? _carSpeed;
              final colHex = data['carConfig']['color'] as String?;
              if (colHex != null && colHex.startsWith('#')) {
                _carColor = Color(int.parse(colHex.replaceFirst('#', '0xFF')));
              }
            }
          });
        }
      }
    } catch (_) {}
  }

  void _triggerCoinDeduction(int coins) {
    setState(() {
      _coinDeductText = '-$coins 🪙';
    });
    _coinDeductController.forward(from: 0.0);
  }

  Future<void> _recruitCitizens() async {
    final studentState = ref.read(studentProvider);
    final userCoins = studentState.student?.coinBalance ?? 0;
    const cost = 25;

    if (userCoins < cost) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
              'Fuqarolarni taklif qilish uchun kamida 25 ta oltin tanga kerak!'),
          backgroundColor: Color(0xFFE53935),
        ),
      );
      return;
    }

    _triggerCoinDeduction(cost);

    try {
      final res = await ApiClient().dio.post('/city/citizens/recruit');
      if (!mounted) return;
      if (res.data != null && res.data['success'] == true) {
        final newCount =
            res.data['data']['citizenCount'] ?? (_citizenCount + 5);
        final newBalance = res.data['data']['newCoinBalance'];
        setState(() {
          _citizenCount = newCount;
        });
        if (newBalance != null && studentState.student != null) {
          ref.read(studentProvider.notifier).updateStudentLocally(
                studentState.student!.copyWith(coinBalance: newBalance),
              );
        }
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content:
                  Text('5 nafar yangi fuqaro shahringizga ko‘chib keldi! 🎉'),
              backgroundColor: Color(0xFF0F9D58),
            ),
          );
        }
        return;
      }
    } catch (_) {}

    // Fallback optimistic update
    setState(() {
      _citizenCount += 5;
    });
    if (studentState.student != null) {
      ref.read(studentProvider.notifier).updateStudentLocally(
            studentState.student!.copyWith(coinBalance: userCoins - cost),
          );
    }
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('5 nafar yangi fuqaro shahringizga ko‘chib keldi! 🎉'),
        backgroundColor: Color(0xFF0F9D58),
      ),
    );
  }

  Future<void> _upgradeCar() async {
    final studentState = ref.read(studentProvider);
    final userCoins = studentState.student?.coinBalance ?? 0;
    const cost = 50;

    if (userCoins < cost) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
              'Mashinani kuchaytirish uchun kamida 50 ta oltin tanga kerak!'),
          backgroundColor: Color(0xFFE53935),
        ),
      );
      return;
    }

    _triggerCoinDeduction(cost);

    try {
      final res = await ApiClient().dio.post('/city/car/upgrade');
      if (res.data != null && res.data['success'] == true) {
        final carCfg = res.data['data']['carConfig'];
        final newBalance = res.data['data']['newCoinBalance'];
        if (carCfg != null && mounted) {
          setState(() {
            _carLevel = carCfg['level'] ?? (_carLevel + 1);
            _carModel = carCfg['model'] ?? 'Sportkar';
            _carSpeed =
                (carCfg['speed'] as num?)?.toDouble() ?? (_carSpeed + 0.3);
            final colHex = carCfg['color'] as String?;
            if (colHex != null && colHex.startsWith('#')) {
              _carColor = Color(int.parse(colHex.replaceFirst('#', '0xFF')));
            }
          });
        }
        if (newBalance != null && studentState.student != null) {
          ref.read(studentProvider.notifier).updateStudentLocally(
                studentState.student!.copyWith(coinBalance: newBalance),
              );
        }
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                  'Mashina yangilandi: $_carModel (Tezlik: ${_carSpeed}x)! 🚗💨'),
              backgroundColor: const Color(0xFF0F9D58),
            ),
          );
        }
        return;
      }
    } catch (_) {}

    // Fallback optimistic update
    final nextLvl = _carLevel + 1;
    final models = [
      'Sedan',
      'Sportkar',
      'Cyber-avto',
      'Superkar',
      'Uchuvchi avto'
    ];
    final colors = [
      const Color(0xFFE53E3E),
      const Color(0xFF3182CE),
      const Color(0xFF38A169),
      const Color(0xFFD69E2E)
    ];
    setState(() {
      _carLevel = nextLvl;
      _carModel = models[(nextLvl - 1) % models.length];
      _carColor = colors[(nextLvl - 1) % colors.length];
      _carSpeed = 1.0 + (nextLvl * 0.3);
    });
    if (studentState.student != null) {
      ref.read(studentProvider.notifier).updateStudentLocally(
            studentState.student!.copyWith(coinBalance: userCoins - cost),
          );
    }
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
            'Mashina yangilandi: $_carModel (Tezlik: ${_carSpeed}x)! 🚗💨'),
        backgroundColor: const Color(0xFF0F9D58),
      ),
    );
  }

  void _openShop([int? targetX, int? targetY]) {
    final colors = AppThemeColors.of(context);
    final studentState = ref.read(studentProvider);
    final userCoins = studentState.student?.coinBalance ?? 0;

    int gridX = targetX ?? 0;
    int gridY = targetY ?? 0;
    if (targetX == null || targetY == null) {
      bool found = false;
      for (int y = 0; y < 4; y++) {
        for (int x = 0; x < 4; x++) {
          final isOccupied =
              _placedBuildings.any((b) => b.gridX == x && b.gridY == y);
          if (!isOccupied) {
            gridX = x;
            gridY = y;
            found = true;
            break;
          }
        }
        if (found) break;
      }
    }

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          height: MediaQuery.of(context).size.height * 0.78,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
          decoration: BoxDecoration(
            color: colors.card,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: colors.primary.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(Icons.storefront_rounded,
                            color: colors.primary, size: 24),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        'Qurilish do‘koni',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w900,
                          color: colors.ink,
                        ),
                      ),
                    ],
                  ),
                  CoinBadge(count: userCoins, size: 24),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                'Shahringizni yangi 3D binolar bilan obod qiling. Narxlar oson va shaffof.',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                  color: colors.muted,
                ),
              ),
              const SizedBox(height: 16),
              Expanded(
                child: ListView.builder(
                  itemCount: _shopCatalog.length,
                  itemBuilder: (context, index) {
                    final building = _shopCatalog[index];
                    final canAfford = userCoins >= building.costInCoins;

                    return Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: colors.bg,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: canAfford
                              ? colors.primary.withOpacity(0.3)
                              : colors.border,
                        ),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 50,
                            height: 50,
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [colors.primary, colors.primaryDark],
                              ),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Icon(_getIconData(building.iconName),
                                color: Colors.white, size: 26),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  building.name,
                                  style: TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w800,
                                    color: colors.ink,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  building.description,
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: colors.muted,
                                  ),
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 6),
                                Row(
                                  children: [
                                    const CoinIcon(size: 16),
                                    const SizedBox(width: 5),
                                    Text(
                                      '${building.costInCoins} tanga',
                                      style: const TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w800,
                                        color: Color(0xFFD97706),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 10),
                          ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor:
                                  canAfford ? colors.primary : colors.inactive,
                              foregroundColor: Colors.white,
                              elevation: 0,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(14),
                              ),
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 16, vertical: 10),
                            ),
                            onPressed: () async {
                              Navigator.pop(context);
                              if (canAfford) {
                                await _executePurchase(building, gridX, gridY);
                              } else {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text(
                                        'Oltin tangalaringiz yetarli emas! Misollarni to‘g‘ri yechib tanga to‘plang.'),
                                    backgroundColor: Color(0xFFE53935),
                                  ),
                                );
                              }
                            },
                            child: const Text('Qurish',
                                style: TextStyle(fontWeight: FontWeight.w800)),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _executePurchase(
      BuildingModel building, int gridX, int gridY) async {
    _triggerCoinDeduction(building.costInCoins);

    final success = await ref
        .read(studentProvider.notifier)
        .purchaseBuilding(building.key, gridX, gridY);
    if (!mounted) return;

    if (success) {
      setState(() {
        _animatingGridX = gridX;
        _animatingGridY = gridY;
        _placedBuildings
            .removeWhere((b) => b.gridX == gridX && b.gridY == gridY);
        _placedBuildings.add(PlacedBuildingModel(
          buildingKey: building.key,
          name: building.name,
          iconName: building.iconName,
          gridX: gridX,
          gridY: gridY,
        ));
      });

      _constructionController.forward(from: 0.0).then((_) {
        setState(() {
          _animatingGridX = null;
          _animatingGridY = null;
        });
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: [
              const Icon(Icons.check_circle_rounded, color: Colors.white),
              const SizedBox(width: 8),
              Expanded(
                  child: Text(
                      '${building.name} shahringizda muvaffaqiyatli qurildi! 🏰')),
            ],
          ),
          backgroundColor: const Color(0xFF0F9D58),
        ),
      );
    }
  }

  void _inspectBuilding(PlacedBuildingModel building) {
    final colors = AppThemeColors.of(context);
    showModalBottomSheet(
      context: context,
      backgroundColor: colors.card,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [colors.primary, colors.primaryDark],
                  ),
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Icon(_getIconData(building.iconName),
                    color: Colors.white, size: 32),
              ),
              const SizedBox(height: 14),
              Text(
                building.name,
                style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    color: colors.ink),
              ),
              const SizedBox(height: 6),
              Text(
                'Bu bino shahringizni bezab turibdi va fuqarolarga bilim ulashmoqda.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 13, color: colors.muted),
              ),
              const SizedBox(height: 20),
              CustomButton(
                text: 'Yopish',
                backgroundColor: colors.primary,
                borderRadius: 16,
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
        );
      },
    );
  }

  IconData _getIconData(String name) {
    switch (name) {
      case 'home':
        return Icons.home_rounded;
      case 'apartment':
        return Icons.apartment_rounded;
      case 'villa':
        return Icons.holiday_village_rounded;
      case 'castle':
        return Icons.fort_rounded;
      case 'school':
        return Icons.school_rounded;
      case 'menu_book':
        return Icons.menu_book_rounded;
      case 'park':
        return Icons.park_rounded;
      case 'visibility':
        return Icons.visibility_rounded;
      case 'museum':
        return Icons.museum_rounded;
      case 'sports_kabaddi':
        return Icons.sports_kabaddi_rounded;
      case 'water_drop':
        return Icons.water_drop_rounded;
      case 'forest':
        return Icons.forest_rounded;
      default:
        return Icons.domain_rounded;
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);
    final studentState = ref.watch(studentProvider);
    final userCoins = studentState.student?.coinBalance ?? 0;
    final cityLevel = studentState.student?.cityLevel ?? 1;
    final buildingsCount = _placedBuildings.length;

    return Scaffold(
      backgroundColor: colors.bg,
      body: SafeArea(
        bottom: false,
        child: Column(
          children: [
            // TOP HEADER
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              color: colors.card,
              child: Row(
                children: [
                  Expanded(
                    child: Row(
                      children: [
                        IconButton(
                          padding: EdgeInsets.zero,
                          constraints:
                              const BoxConstraints(minWidth: 32, minHeight: 32),
                          icon: Icon(Icons.arrow_back_ios_new_rounded,
                              color: colors.ink, size: 18),
                          onPressed: () => context.canPop()
                              ? context.pop()
                              : context.go('/kids/home'),
                        ),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                'Mening shahrim',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  fontSize: 17,
                                  fontWeight: FontWeight.w900,
                                  color: colors.ink,
                                ),
                              ),
                              const SizedBox(height: 1),
                              Text(
                                'Bilimlar bilan barpo etilgan isometrik shahar',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w500,
                                  color: colors.muted,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 5),
                        decoration: BoxDecoration(
                          color: colors.primary.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          '$cityLevel-daraja',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            color: colors.primary,
                          ),
                        ),
                      ),
                      const SizedBox(width: 6),
                      CoinBadge(count: userCoins, size: 20),
                    ],
                  ),
                ],
              ),
            ),

            // MAIN CITY AREA (3D Isometric Island Canvas)
            Expanded(
              child: Stack(
                children: [
                  AnimatedBuilder(
                    animation: _constructionController,
                    builder: (context, child) {
                      return IsometricCityWidget(
                        placedBuildings: _placedBuildings,
                        animatingGridX: _animatingGridX,
                        animatingGridY: _animatingGridY,
                        constructionProgress: _constructionController.value,
                        citizenCount: _citizenCount,
                        carLevel: _carLevel,
                        carColor: _carColor,
                        carSpeed: _carSpeed,
                        carModel: _carModel,
                        onBuildingTap: (building) => _inspectBuilding(building),
                        onEmptyPlotTap: (gridX, gridY) =>
                            _openShop(gridX, gridY),
                      );
                    },
                  ),

                  // Top Pill Badges: City Name + Citizens & Car Info
                  Positioned(
                    left: 16,
                    top: 16,
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 14, vertical: 7),
                          decoration: BoxDecoration(
                            color: colors.card,
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.08),
                                blurRadius: 12,
                                offset: const Offset(0, 4),
                              ),
                            ],
                            border: Border.all(color: colors.border),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.location_on_rounded,
                                  color: colors.primary, size: 16),
                              const SizedBox(width: 5),
                              Text(
                                'Bilimobod',
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w800,
                                  color: colors.ink,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 12, vertical: 7),
                          decoration: BoxDecoration(
                            color: colors.card,
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.08),
                                blurRadius: 12,
                                offset: const Offset(0, 4),
                              ),
                            ],
                            border: Border.all(color: colors.border),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(Icons.people_alt_rounded,
                                  color: Color(0xFF10B981), size: 16),
                              const SizedBox(width: 5),
                              Text(
                                '$_citizenCount fuqaro',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w800,
                                  color: colors.ink,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Floating Coin Deduction Animation Pop-up
                  if (_coinDeductText != null)
                    AnimatedBuilder(
                      animation: _coinDeductController,
                      builder: (context, _) {
                        final val = _coinDeductController.value;
                        if (val >= 0.99) return const SizedBox.shrink();
                        final dy = -30.0 * val;
                        final opacity = (1.0 - val).clamp(0.0, 1.0);
                        return Positioned(
                          top: 80 + dy,
                          right: 24,
                          child: Opacity(
                            opacity: opacity,
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 14, vertical: 6),
                              decoration: BoxDecoration(
                                color: const Color(0xFFEF4444),
                                borderRadius: BorderRadius.circular(999),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.red.withOpacity(0.3),
                                    blurRadius: 10,
                                    offset: const Offset(0, 4),
                                  ),
                                ],
                              ),
                              child: Text(
                                _coinDeductText!,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w900,
                                  fontSize: 14,
                                ),
                              ),
                            ),
                          ),
                        );
                      },
                    ),

                  // LOWER ACTION & STATS CARD
                  Positioned(
                    left: 16,
                    right: 16,
                    bottom: 12,
                    child: Container(
                      padding: const EdgeInsets.all(18),
                      decoration: BoxDecoration(
                        color: colors.card,
                        borderRadius: BorderRadius.circular(26),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.08),
                            blurRadius: 20,
                            offset: const Offset(0, 6),
                          ),
                        ],
                        border: Border.all(color: colors.border, width: 1.2),
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Shaharni rivojlantiring',
                                      style: TextStyle(
                                        fontSize: 15,
                                        fontWeight: FontWeight.w900,
                                        color: colors.ink,
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      '$buildingsCount ta bino · $_citizenCount fuqaro · $_carModel',
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w600,
                                        color: colors.muted,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 10, vertical: 5),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFD4F8E6),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text(
                                  '${((buildingsCount / 16) * 100).round()}% ochilgan',
                                  style: const TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w800,
                                    color: Color(0xFF0F9D58),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 14),

                          // 3 Action Buttons: Build, Recruit Citizens (25c), Upgrade Car (50c)
                          Row(
                            children: [
                              // 1. Build
                              Expanded(
                                flex: 5,
                                child: ElevatedButton.icon(
                                  onPressed: () => _openShop(),
                                  icon: const Icon(Icons.add_rounded, size: 18),
                                  label: const FittedBox(
                                    fit: BoxFit.scaleDown,
                                    child: Text('Yangi bino qurish',
                                        style: TextStyle(
                                            fontWeight: FontWeight.w800)),
                                  ),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: colors.primary,
                                    foregroundColor: Colors.white,
                                    elevation: 0,
                                    padding: const EdgeInsets.symmetric(
                                        vertical: 12),
                                    shape: RoundedRectangleBorder(
                                        borderRadius:
                                            BorderRadius.circular(16)),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),

                              // 2. Recruit Citizens (25 coins)
                              Expanded(
                                flex: 4,
                                child: OutlinedButton.icon(
                                  onPressed: _recruitCitizens,
                                  icon: const Icon(Icons.person_add_rounded,
                                      size: 17),
                                  label: const FittedBox(
                                    fit: BoxFit.scaleDown,
                                    child: Text('+5 Fuqaro (25 🪙)',
                                        style: TextStyle(
                                            fontWeight: FontWeight.w800,
                                            fontSize: 11)),
                                  ),
                                  style: OutlinedButton.styleFrom(
                                    foregroundColor: const Color(0xFF059669),
                                    side: const BorderSide(
                                        color: Color(0xFF10B981), width: 1.2),
                                    padding: const EdgeInsets.symmetric(
                                        vertical: 12, horizontal: 4),
                                    shape: RoundedRectangleBorder(
                                        borderRadius:
                                            BorderRadius.circular(16)),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),

                              // 3. Upgrade Car (50 coins)
                              Expanded(
                                flex: 4,
                                child: OutlinedButton.icon(
                                  onPressed: _upgradeCar,
                                  icon: const Icon(Icons.directions_car_rounded,
                                      size: 17),
                                  label: const FittedBox(
                                    fit: BoxFit.scaleDown,
                                    child: Text('Mashina (50 🪙)',
                                        style: TextStyle(
                                            fontWeight: FontWeight.w800,
                                            fontSize: 11)),
                                  ),
                                  style: OutlinedButton.styleFrom(
                                    foregroundColor: const Color(0xFFD97706),
                                    side: const BorderSide(
                                        color: Color(0xFFF59E0B), width: 1.2),
                                    padding: const EdgeInsets.symmetric(
                                        vertical: 12, horizontal: 4),
                                    shape: RoundedRectangleBorder(
                                        borderRadius:
                                            BorderRadius.circular(16)),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: const MathCityBottomNav(currentIndex: 4),
    );
  }
}
