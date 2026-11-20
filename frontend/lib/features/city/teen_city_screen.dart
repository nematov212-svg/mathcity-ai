import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/coin_badge.dart';
import '../../shared/providers/student_provider.dart';

class TeenCityScreen extends ConsumerStatefulWidget {
  const TeenCityScreen({super.key});

  @override
  ConsumerState<TeenCityScreen> createState() => _TeenCityScreenState();
}

class _TeenCityScreenState extends ConsumerState<TeenCityScreen> {
  final List<Map<String, dynamic>> _buildings = [
    {'name': 'Kvant laboratoriyasi', 'icon': Icons.biotech_rounded, 'x': 1, 'y': 1},
    {'name': 'Kiber minora', 'icon': Icons.cell_tower_rounded, 'x': 2, 'y': 1},
    {'name': 'Rasadxona', 'icon': Icons.visibility_rounded, 'x': 2, 'y': 2},
  ];

  @override
  Widget build(BuildContext context) {
    final studentState = ref.watch(studentProvider);
    final coins = studentState.student?.coinBalance ?? 0;

    return Scaffold(
      backgroundColor: AppColors.teenBackground,
      appBar: AppBar(
        backgroundColor: AppColors.teenSurface,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Kelajak Shahri • Ilmiy Markaz',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w800,
            fontSize: 18,
          ),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Center(child: CoinBadge(count: coins, size: 24)),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Status bar
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              color: AppColors.teenSurface,
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Megapolis holati: Faol',
                    style: TextStyle(color: AppColors.teenPrimaryLime, fontWeight: FontWeight.w700),
                  ),
                  Text(
                    'Fazo va Hisob-kitoblar Klasteri',
                    style: TextStyle(color: AppColors.teenMutedText, fontSize: 12),
                  ),
                ],
              ),
            ),

            // High-Tech Sci-Fi Matrix Grid (Figma 2:86)
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: GridView.builder(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 4,
                    mainAxisSpacing: 12,
                    crossAxisSpacing: 12,
                  ),
                  itemCount: 16,
                  itemBuilder: (context, index) {
                    final gridX = index % 4;
                    final gridY = index ~/ 4;

                    final building = _buildings.cast<Map<String, dynamic>?>().firstWhere(
                          (b) => b?['x'] == gridX && b?['y'] == gridY,
                          orElse: () => null,
                        );

                    final hasBuilding = building != null;

                    return Container(
                      decoration: BoxDecoration(
                        color: hasBuilding ? AppColors.teenSurfaceElevated : const Color(0xFF131A2B),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: hasBuilding
                              ? AppColors.teenPrimaryLime
                              : const Color(0xFF1E2840),
                          width: hasBuilding ? 1.5 : 1,
                        ),
                      ),
                      child: Center(
                        child: hasBuilding
                            ? Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(building['icon'] as IconData,
                                      color: AppColors.teenPrimaryLime, size: 28),
                                  const SizedBox(height: 4),
                                  Text(
                                    (building['name'] as String).split(' ').first,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 10,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ],
                              )
                            : const Icon(Icons.add_rounded, color: Color(0xFF2B3859), size: 22),
                      ),
                    );
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
