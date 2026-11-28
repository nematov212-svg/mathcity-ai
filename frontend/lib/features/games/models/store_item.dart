import 'package:flutter/material.dart';

/// Store category definition
enum StoreCategory {
  all('all', 'Hammasi', Icons.grid_view_rounded),
  materials('materials', 'Materiallar', Icons.foundation_rounded),
  walls('walls', 'Devor', Icons.apartment_rounded),
  roof('roof', 'Tom', Icons.roofing_rounded),
  doorsWindows('doors_windows', 'Eshik-Deraza', Icons.meeting_room_rounded),
  interior('interior', 'Mebel', Icons.chair_rounded),
  yard('yard', 'Hovli', Icons.park_rounded),
  decor('decor', 'Bezak', Icons.auto_awesome_rounded);

  final String key;
  final String title;
  final IconData icon;

  const StoreCategory(this.key, this.title, this.icon);
}

/// Store item item model
class StoreItem {
  final String id;
  final String name;
  final String description;
  final StoreCategory category;
  final int price;
  final int unlockStage; // 1 to 6
  final String? badge; // 'Yangi', 'Mashhur', etc.
  final IconData icon;
  final Color accentColor;
  final String? defaultColor;
  final bool isOwned;
  final bool isPlaced;

  const StoreItem({
    required this.id,
    required this.name,
    required this.description,
    required this.category,
    required this.price,
    required this.unlockStage,
    this.badge,
    required this.icon,
    required this.accentColor,
    this.defaultColor,
    this.isOwned = false,
    this.isPlaced = false,
  });

  int get stage => unlockStage;
  int get xpReward => (price ~/ 5).clamp(5, 50);

  StoreItem copyWith({
    bool? isOwned,
    bool? isPlaced,
  }) {
    return StoreItem(
      id: id,
      name: name,
      description: description,
      category: category,
      price: price,
      unlockStage: unlockStage,
      badge: badge,
      icon: icon,
      accentColor: accentColor,
      defaultColor: defaultColor,
      isOwned: isOwned ?? this.isOwned,
      isPlaced: isPlaced ?? this.isPlaced,
    );
  }
}

/// Rich catalog of at least 18 items across all 7 categories
const List<StoreItem> kDefaultStoreCatalog = [
  // 1. Materiallar
  StoreItem(
    id: 'clean_lot',
    name: 'Maydonni tozalash',
    description: 'Qurilish uchun tekis va toza shinam yer maydoni.',
    category: StoreCategory.materials,
    price: 15,
    unlockStage: 1,
    badge: 'Boshlang‘ich',
    icon: Icons.cleaning_services_rounded,
    accentColor: Color(0xFF10B981),
  ),
  StoreItem(
    id: 'concrete_foundation',
    name: 'Mustahkam beton plita',
    description: 'Temir-beton qorishmali mustahkam seysmik asos.',
    category: StoreCategory.materials,
    price: 40,
    unlockStage: 1,
    badge: 'Mashhur',
    icon: Icons.foundation_rounded,
    accentColor: Color(0xFF64748B),
  ),
  StoreItem(
    id: 'marble_base',
    name: 'Marmar asos plitasi',
    description: 'Hashamatli tabiiy marmar va granit qoplamali maydon.',
    category: StoreCategory.materials,
    price: 85,
    unlockStage: 1,
    badge: 'Yangi',
    icon: Icons.layers_rounded,
    accentColor: Color(0xFF8B5CF6),
  ),

  // 2. Devor
  StoreItem(
    id: 'white_brick_wall',
    name: 'Oq suvoqli zamonaviy devor',
    description: 'Issiqlikni saqlovchi ekologik toza oq g‘isht va suvoq.',
    category: StoreCategory.walls,
    price: 65,
    unlockStage: 2,
    badge: 'Mashhur',
    icon: Icons.apartment_rounded,
    accentColor: Color(0xFF3B82F6),
  ),
  StoreItem(
    id: 'red_brick_wall',
    name: 'Pishiq qizil g‘isht devor',
    description: 'Klassik va uzoq yillik bardoshli tabiiy qizil g‘isht.',
    category: StoreCategory.walls,
    price: 90,
    unlockStage: 2,
    icon: Icons.view_compact_rounded,
    accentColor: Color(0xFFDC2626),
  ),
  StoreItem(
    id: 'modern_glass_wall',
    name: 'Panoramik shisha fasad',
    description: 'Keng nurli quyoshli xonalar uchun panoramik shisha devor.',
    category: StoreCategory.walls,
    price: 140,
    unlockStage: 2,
    badge: 'Yangi',
    icon: Icons.window_rounded,
    accentColor: Color(0xFF06B6D4),
  ),

  // 3. Tom
  StoreItem(
    id: 'navy_tile_roof',
    name: 'Moviy koshinli cherepitsa',
    description: 'Suv o‘tkazmaydigan zamonaviy to‘q ko‘k emallangan koshin.',
    category: StoreCategory.roof,
    price: 80,
    unlockStage: 3,
    badge: 'Mashhur',
    icon: Icons.roofing_rounded,
    accentColor: Color(0xFF1E3A8A),
  ),
  StoreItem(
    id: 'terracotta_roof',
    name: 'Klassik qizil koshin',
    description: 'Yevropa uslubidagi shinam qizil sopol cherepitsa.',
    category: StoreCategory.roof,
    price: 95,
    unlockStage: 3,
    icon: Icons.cottage_rounded,
    accentColor: Color(0xFFEA580C),
  ),
  StoreItem(
    id: 'pyramid_roof',
    name: 'Piramida shaklli hashamatli tom',
    description: 'Chodir uslubidagi murakkab to‘rt nishabli arxitektura.',
    category: StoreCategory.roof,
    price: 130,
    unlockStage: 3,
    icon: Icons.villa_rounded,
    accentColor: Color(0xFF7C3AED),
  ),

  // 4. Eshik-Deraza
  StoreItem(
    id: 'wooden_door',
    name: 'Eman daraxtli naqshdor eshik',
    description: 'Qo‘lda o‘yilgan milliy naqshli va tilla tutqichli eshik.',
    category: StoreCategory.doorsWindows,
    price: 50,
    unlockStage: 4,
    badge: 'Mashhur',
    icon: Icons.meeting_room_rounded,
    accentColor: Color(0xFF92400E),
  ),
  StoreItem(
    id: 'panoramic_windows',
    name: 'Uch qavatli panoramik derazalar',
    description: 'Shovqinni to‘liq to‘suvchi va yorug‘lik baxsh etuvchi deraza.',
    category: StoreCategory.doorsWindows,
    price: 60,
    unlockStage: 4,
    icon: Icons.grid_on_rounded,
    accentColor: Color(0xFF38BDF8),
  ),

  // 5. Mebel (Interior)
  StoreItem(
    id: 'sofa',
    name: 'Yumshoq burchak divan',
    description: 'Katta oila uchun qulay zamonaviy indigo rangli divan.',
    category: StoreCategory.interior,
    price: 45,
    unlockStage: 5,
    badge: 'Mashhur',
    icon: Icons.weekend_rounded,
    accentColor: Color(0xFF6366F1),
  ),
  StoreItem(
    id: 'uzbek_carpet',
    name: 'Milliy ipak gilam',
    description: 'Yorqin geometrik milliy naqshli xona ko‘rki bo‘lgan gilam.',
    category: StoreCategory.interior,
    price: 35,
    unlockStage: 5,
    badge: 'Yangi',
    icon: Icons.texture_rounded,
    accentColor: Color(0xFF8B5CF6),
  ),
  StoreItem(
    id: 'bed',
    name: 'Katta qulay karavot',
    description: 'Ortoppedik matrasli shinam uxlash karavoti.',
    category: StoreCategory.interior,
    price: 55,
    unlockStage: 5,
    icon: Icons.bed_rounded,
    accentColor: Color(0xFF0284C7),
  ),

  // 6. Hovli (Yard)
  StoreItem(
    id: 'stone_path',
    name: 'Tosh yo‘lak & LED chiroqlar',
    description: 'Tabiiy yassi toshlardan terilgan manzarali yo‘lak.',
    category: StoreCategory.yard,
    price: 25,
    unlockStage: 6,
    icon: Icons.timeline_rounded,
    accentColor: Color(0xFF64748B),
  ),
  StoreItem(
    id: 'wooden_fence',
    name: 'Oq yog‘och panjara va darvoza',
    description: 'Hovlini o‘rab turuvchi shinam oq yog‘och to‘siq.',
    category: StoreCategory.yard,
    price: 30,
    unlockStage: 6,
    icon: Icons.fence_rounded,
    accentColor: Color(0xFF475569),
  ),
  StoreItem(
    id: 'yard_tree',
    name: 'Salobatli yashil manzarali daraxt',
    description: 'Hovliga salqin soya beruvchi go‘zal manzarali daraxt.',
    category: StoreCategory.yard,
    price: 35,
    unlockStage: 6,
    badge: 'Mashhur',
    icon: Icons.park_rounded,
    accentColor: Color(0xFF16A34A),
  ),
  StoreItem(
    id: 'family_car',
    name: 'Qizil oilaviy avtomobil',
    description: 'Hovli yo‘lida turgan zamonaviy oilaviy yengil avtomobil.',
    category: StoreCategory.yard,
    price: 150,
    unlockStage: 6,
    badge: 'Mashhur',
    icon: Icons.directions_car_rounded,
    accentColor: Color(0xFFDC2626),
  ),

  // 7. Bezak (Decor)
  StoreItem(
    id: 'street_lantern',
    name: 'Zamonaviy LED tungi fonar',
    description: 'Tunda uyni yoritib turuvchi tejamkor chiroq.',
    category: StoreCategory.decor,
    price: 20,
    unlockStage: 6,
    icon: Icons.lightbulb_rounded,
    accentColor: Color(0xFFF59E0B),
  ),
  StoreItem(
    id: 'fountain',
    name: 'Marmar favvora',
    description: 'Hovli markazidagi salqin suvli marmar favvora.',
    category: StoreCategory.decor,
    price: 90,
    unlockStage: 6,
    badge: 'Yangi',
    icon: Icons.water_drop_rounded,
    accentColor: Color(0xFF0EA5E9),
  ),
];
