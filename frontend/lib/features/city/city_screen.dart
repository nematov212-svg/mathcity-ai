import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/coin_badge.dart';
import '../../core/widgets/custom_button.dart';
import '../../shared/models/building_model.dart';
import '../../shared/providers/student_provider.dart';
import 'isometric_city_widget.dart';

class CityScreen extends ConsumerStatefulWidget {
  const CityScreen({super.key});

  @override
  ConsumerState<CityScreen> createState() => _CityScreenState();
}

class _CityScreenState extends ConsumerState<CityScreen> with SingleTickerProviderStateMixin {
  late AnimationController _constructionController;
  int? _animatingGridX;
  int? _animatingGridY;

  // Island placed buildings (matches REFERENCE IMAGE 1)
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

  // 10 3D Models in Catalog (All 100 coins)
  final List<BuildingModel> _shopCatalog = [
    // 5 Master Buildings (Master Prompt V6 Step 18)
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
      name: 'Premium uy',
      category: 'Turar-joy',
      costInCoins: 500,
      requiredLevel: 4,
      description: 'Eng yuqori darajadagi futuristik aqlli saroy.',
      iconName: 'castle',
      mode: 'KIDS',
    ),
    // Community & Landmark Buildings
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
      description: 'Yulduzlar va osmon sirlarini o‘rganuvchi teleskopli rasadxona.',
      iconName: 'visibility',
      mode: 'KIDS',
    ),
    BuildingModel(
      key: 'museum_art',
      name: 'Tarix va san’at muzeyi',
      category: 'Madaniyat',
      costInCoins: 100,
      requiredLevel: 1,
      description: 'Matematik ixtirolar va qadimiy osori-atiqalar muzeyi.',
      iconName: 'museum',
      mode: 'KIDS',
    ),
    BuildingModel(
      key: 'playground_fun',
      name: 'Bolalar maydonchasi',
      category: 'Dam olish',
      costInCoins: 100,
      requiredLevel: 1,
      description: 'Arg‘imchoqlar va quvnoq attraksionlar maydonchasi.',
      iconName: 'sports_kabaddi',
      mode: 'KIDS',
    ),
    BuildingModel(
      key: 'fountain_crystal',
      name: 'Kristall favvora',
      category: 'Shahar ko‘rki',
      costInCoins: 100,
      requiredLevel: 1,
      description: 'Shahar markaziy maydonini bezab turuvchi shaffof suvli favvora.',
      iconName: 'water_drop',
      mode: 'KIDS',
    ),
    BuildingModel(
      key: 'trees_decorative',
      name: 'Mavsumiy yashil daraxtlar',
      category: 'Tabiat',
      costInCoins: 100,
      requiredLevel: 1,
      description: 'Orol landshaftini yashnatuvchi oltin rangli manzarali daraxtlar.',
      iconName: 'forest',
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
  }

  @override
  void dispose() {
    _constructionController.dispose();
    super.dispose();
  }

  void _openShop([int? targetX, int? targetY]) {
    final studentState = ref.read(studentProvider);
    final userCoins = studentState.student?.coinBalance ?? 0;

    int gridX = targetX ?? 0;
    int gridY = targetY ?? 0;
    if (targetX == null || targetY == null) {
      bool found = false;
      for (int y = 0; y < 4; y++) {
        for (int x = 0; x < 4; x++) {
          final isOccupied = _placedBuildings.any((b) => b.gridX == x && b.gridY == y);
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
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: const Color(0xFF7154EC).withOpacity(0.12),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.storefront_rounded, color: Color(0xFF7154EC), size: 24),
                        ),
                        const SizedBox(width: 12),
                        const Expanded(
                          child: Text(
                            'Qurilish do‘koni',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w900,
                              color: AppColors.kidsDarkText,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  CoinBadge(count: userCoins, size: 24),
                ],
              ),
              const SizedBox(height: 6),
              const Text(
                'Shahringizni yangi 3D binolar bilan kengaytiring. Har bir bino 100 oltin tanga.',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                  color: AppColors.kidsSecondaryText,
                ),
              ),
              const SizedBox(height: 16),

              // Buildings list
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
                        color: const Color(0xFFF9FAFF),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: canAfford ? const Color(0xFFE2E8F0) : const Color(0xFFF1F5F9),
                        ),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 54,
                            height: 54,
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                colors: [Color(0xFF7154EC), Color(0xFFA29BFE)],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                              borderRadius: BorderRadius.circular(16),
                              boxShadow: [
                                BoxShadow(
                                  color: const Color(0xFF7154EC).withOpacity(0.2),
                                  blurRadius: 8,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: Icon(_getIconData(building.iconName), color: Colors.white, size: 26),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  building.name,
                                  style: const TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w800,
                                    color: AppColors.kidsDarkText,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  building.description,
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: AppColors.kidsSecondaryText,
                                  ),
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 6),
                                Row(
                                  children: [
                                    const Icon(Icons.monetization_on_rounded, color: Color(0xFFFFB800), size: 15),
                                    const SizedBox(width: 4),
                                    Text(
                                      '${building.costInCoins} oltin',
                                      style: const TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w800,
                                        color: Color(0xFF7A4800),
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
                              backgroundColor: canAfford ? const Color(0xFF7154EC) : const Color(0xFFD4D7E5),
                              foregroundColor: Colors.white,
                              elevation: canAfford ? 3 : 0,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(14),
                              ),
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                            ),
                            onPressed: () async {
                              Navigator.pop(context);
                              if (canAfford) {
                                await _executePurchase(building, gridX, gridY);
                              } else {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Oltin tangalaringiz yetarli emas! Misollarni to‘g‘ri yechib tanga to‘plang.'),
                                    backgroundColor: Color(0xFFE53935),
                                  ),
                                );
                              }
                            },
                            child: const Text('Qurish', style: TextStyle(fontWeight: FontWeight.w800)),
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

  Future<void> _executePurchase(BuildingModel building, int gridX, int gridY) async {
    final success = await ref.read(studentProvider.notifier).purchaseBuilding(building.key, gridX, gridY);

    if (success) {
      setState(() {
        _animatingGridX = gridX;
        _animatingGridY = gridY;
        _placedBuildings.removeWhere((b) => b.gridX == gridX && b.gridY == gridY);
        _placedBuildings.add(PlacedBuildingModel(
          buildingKey: building.key,
          name: building.name,
          iconName: building.iconName,
          gridX: gridX,
          gridY: gridY,
        ));
      });

      // Play 8-stage construction animation
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
              Text('${building.name} Bilimobod orolida muvaffaqiyatli qurildi!'),
            ],
          ),
          backgroundColor: const Color(0xFF168865),
        ),
      );
    }
  }

  void _inspectBuilding(PlacedBuildingModel building) {
    showModalBottomSheet(
      context: context,
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
                  gradient: const LinearGradient(
                    colors: [Color(0xFF7154EC), Color(0xFFA29BFE)],
                  ),
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Icon(_getIconData(building.iconName), color: Colors.white, size: 32),
              ),
              const SizedBox(height: 14),
              Text(
                building.name,
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
              ),
              const SizedBox(height: 6),
              const Text(
                'Bu bino faoliyat yuritmoqda va shahringiz aholisiga xizmat qilmoqda.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 13, color: AppColors.kidsSecondaryText),
              ),
              const SizedBox(height: 20),
              CustomButton(
                text: 'Yopish',
                backgroundColor: const Color(0xFF7154EC),
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
        return Icons.apartment_rounded;
    }
  }

  @override
  Widget build(BuildContext context) {
    final studentState = ref.watch(studentProvider);
    final userCoins = studentState.student?.coinBalance ?? 100;
    final cityLevel = studentState.student?.cityLevel ?? 1;
    final buildingsCount = _placedBuildings.length;
    final areaPercentage = ((buildingsCount / 16) * 100).round();

    return Scaffold(
      backgroundColor: const Color(0xFFE5DEFF),
      body: SafeArea(
        bottom: false,
        child: Column(
          children: [
            // TOP HEADER (REFERENCE IMAGE 1)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              color: Colors.white,
              child: Row(
                children: [
                  // Title & Subtitle (Expanded to prevent overflow on small screens)
                  Expanded(
                    child: Row(
                      children: [
                        IconButton(
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
                          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.kidsDarkText, size: 18),
                          onPressed: () => context.pop(),
                        ),
                        const SizedBox(width: 4),
                        const Expanded(
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
                                  color: AppColors.kidsDarkText,
                                ),
                              ),
                              SizedBox(height: 1),
                              Text(
                                'Biliming bilan qurilgan go‘zal olam.',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w500,
                                  color: AppColors.kidsSecondaryText,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  // Level & Coins Badges
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
                        decoration: BoxDecoration(
                          color: const Color(0xFFEEEAFE),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          '$cityLevel-daraja',
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF7154EC),
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

            // MAIN CITY AREA (Interactive 3D Isometric Island)
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
                        onBuildingTap: (building) => _inspectBuilding(building),
                        onEmptyPlotTap: (gridX, gridY) => _openShop(gridX, gridY),
                      );
                    },
                  ),

                  // CITY LABEL: "Bilimobod" (REFERENCE IMAGE 1)
                  Positioned(
                    left: 20,
                    top: 20,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.08),
                            blurRadius: 12,
                            offset: const Offset(0, 4),
                          ),
                        ],
                        border: Border.all(color: AppColors.kidsBorder),
                      ),
                      child: const Row(
                        children: [
                          Icon(Icons.location_on_rounded, color: Color(0xFF7154EC), size: 18),
                          SizedBox(width: 6),
                          Text(
                            'Bilimobod',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w800,
                              color: AppColors.kidsDarkText,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  // LOWER INFORMATION CARD (REFERENCE IMAGE 1)
                  Positioned(
                    left: 20,
                    right: 20,
                    bottom: 16,
                    child: Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(28),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 20,
                            offset: const Offset(0, 8),
                          ),
                        ],
                        border: Border.all(color: AppColors.kidsBorder, width: 1.5),
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
                                    const Text(
                                      'Har bir bino — yangi bilim',
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: TextStyle(
                                        fontSize: 15,
                                        fontWeight: FontWeight.w900,
                                        color: AppColors.kidsDarkText,
                                      ),
                                    ),
                                    const SizedBox(height: 3),
                                    Text(
                                      '$buildingsCount ta bino · $areaPercentage% hudud ochilgan',
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w600,
                                        color: AppColors.kidsSecondaryText,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFDFF5EF),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text(
                                  '$areaPercentage%',
                                  style: const TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w800,
                                    color: Color(0xFF168865),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          // Large Purple "Yangi bino qurish" Button
                          SizedBox(
                            width: double.infinity,
                            height: 52,
                            child: ElevatedButton.icon(
                              onPressed: () => _openShop(),
                              icon: const Icon(Icons.add_circle_outline_rounded, color: Colors.white, size: 22),
                              label: const Text(
                                'Yangi bino qurish',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w800,
                                  color: Colors.white,
                                ),
                              ),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF7154EC),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(18),
                                ),
                                elevation: 0,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // BOTTOM NAVIGATION (REFERENCE IMAGE 1)
            Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                border: Border(top: BorderSide(color: AppColors.kidsBorder, width: 1.2)),
              ),
              child: SafeArea(
                top: false,
                child: BottomNavigationBar(
                  currentIndex: 2, // "Shahrim" is active
                  elevation: 0,
                  backgroundColor: Colors.white,
                  selectedItemColor: const Color(0xFF7154EC),
                  unselectedItemColor: AppColors.kidsSecondaryText,
                  selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w800, fontSize: 11),
                  unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 11),
                  type: BottomNavigationBarType.fixed,
                  onTap: (index) {
                    if (index == 0) context.go('/kids/home');
                    if (index == 1) context.push('/kids/lessons');
                    if (index == 2) {} // Current
                    if (index == 3) context.push('/kids/games');
                    if (index == 4) context.push('/kids/profile');
                  },
                  items: const [
                    BottomNavigationBarItem(
                      icon: Icon(Icons.home_rounded),
                      label: 'Bosh sahifa',
                    ),
                    BottomNavigationBarItem(
                      icon: Icon(Icons.menu_book_rounded),
                      label: 'Darslar',
                    ),
                    BottomNavigationBarItem(
                      icon: Icon(Icons.location_city_rounded),
                      label: 'Shahrim',
                    ),
                    BottomNavigationBarItem(
                      icon: Icon(Icons.sports_esports_rounded),
                      label: 'O‘yinlar',
                    ),
                    BottomNavigationBarItem(
                      icon: Icon(Icons.person_rounded),
                      label: 'Profil',
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
}
