import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/coin_badge.dart';
import '../../core/widgets/xp_bar.dart';
import '../../shared/providers/student_provider.dart';

class KidsDesktopScreen extends ConsumerWidget {
  const KidsDesktopScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final student = ref.watch(studentProvider).student;
    final coins = student?.coinBalance ?? 250;
    final xp = student?.totalXP ?? 380;
    final level = student?.level ?? 3;
    final name = student?.displayName ?? 'Ali';

    return Scaffold(
      backgroundColor: AppColors.kidsBackground,
      body: Row(
        children: [
          // Persistent Left Navigation Rail (Figma 2:90 >= 1024px)
          SizedBox(
            width: 260,
            child: Material(
              color: Colors.white,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        gradient: AppColors.kidsPrimaryGradient,
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: const Center(
                        child: Text(
                          'M²',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 22,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    const Text(
                      'MathCity AI',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w900,
                        color: AppColors.kidsDarkText,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 36),
                _buildNavItem(Icons.home_rounded, 'Bosh sahifa', true, () {}),
                _buildNavItem(Icons.map_rounded, 'Darslar xaritasi', false, () => context.push('/kids/lessons')),
                _buildNavItem(Icons.sports_esports_rounded, 'O‘yinlar', false, () => context.push('/kids/games')),
                _buildNavItem(Icons.location_city_rounded, 'Mening shahrim', false, () => context.push('/kids/city')),
                _buildNavItem(Icons.smart_toy_rounded, 'Ziyo AI Ustoz', false, () => context.push('/kids/ai-tutor')),
                _buildNavItem(Icons.bar_chart_rounded, 'Natijalar', false, () => context.push('/kids/analytics')),
                const Spacer(),
                _buildNavItem(Icons.settings_outlined, 'Sozlamalar', false, () => context.push('/settings')),
              ],
            ),
          ),
        ),
      ),

          // Main Responsive Content Area
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Top Status Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Xush kelibsiz, $name! 🚀',
                            style: const TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.w900,
                              color: AppColors.kidsDarkText,
                            ),
                          ),
                          const Text(
                            'Keng ekranli interaktiv matematika muhiti',
                            style: TextStyle(
                              fontSize: 14,
                              color: AppColors.kidsSecondaryText,
                            ),
                          ),
                        ],
                      ),
                      Row(
                        children: [
                          CoinBadge(count: coins, size: 28),
                          const SizedBox(width: 16),
                          XPBar(currentXP: xp, level: level),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 28),

                  // Large Desktop Hero Adventure Card
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(32),
                    decoration: BoxDecoration(
                      gradient: AppColors.kidsPrimaryGradient,
                      borderRadius: BorderRadius.circular(32),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.kidsPrimary.withOpacity(0.3),
                          blurRadius: 24,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Text(
                                  '4-SINF ASOSIY MAVZUSI',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 12,
                                    fontWeight: FontWeight.w800,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 14),
                              const Text(
                                'Oddiy kasrlar va Ulushlar',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 28,
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                              const SizedBox(height: 8),
                              const Text(
                                'Butunning bo‘laklarini interaktiv shakllarda o‘rganing va shahar uchun oltin tangalar yuting.',
                                style: TextStyle(
                                  color: Color(0xFFE2DCFF),
                                  fontSize: 15,
                                ),
                              ),
                              const SizedBox(height: 24),
                              ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.white,
                                  foregroundColor: AppColors.kidsPrimary,
                                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                                ),
                                onPressed: () => context.push('/kids/lesson/lesson-k4-01'),
                                child: const Text(
                                  'Darsni boshlash',
                                  style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 32),
                        Container(
                          width: 140,
                          height: 140,
                          decoration: const BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                          ),
                          child: const Center(
                            child: Icon(Icons.pie_chart_rounded, size: 80, color: AppColors.kidsPrimary),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Desktop Grid: City Builder & Ziyo AI
                  Row(
                    children: [
                      Expanded(
                        child: InkWell(
                          onTap: () => context.push('/kids/city'),
                          borderRadius: BorderRadius.circular(28),
                          child: Container(
                            height: 200,
                            padding: const EdgeInsets.all(24),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(28),
                              border: Border.all(color: AppColors.kidsBorder, width: 1.5),
                            ),
                            child: const Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Icon(Icons.location_city_rounded, color: AppColors.kidsGreen, size: 40),
                                Spacer(),
                                Text(
                                  'Mening shahrim',
                                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
                                ),
                                SizedBox(height: 4),
                                Text(
                                  'Kengaytirilgan reja asosida shahar binolarini quring.',
                                  style: TextStyle(color: AppColors.kidsSecondaryText),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 20),
                      Expanded(
                        child: InkWell(
                          onTap: () => context.push('/kids/ai-tutor'),
                          borderRadius: BorderRadius.circular(28),
                          child: Container(
                            height: 200,
                            padding: const EdgeInsets.all(24),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(28),
                              border: Border.all(color: AppColors.kidsBorder, width: 1.5),
                            ),
                            child: const Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Icon(Icons.smart_toy_rounded, color: AppColors.kidsPrimary, size: 40),
                                Spacer(),
                                Text(
                                  'Ziyo AI Ustoz',
                                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
                                ),
                                SizedBox(height: 4),
                                Text(
                                  'Katta ekranda interaktiv masalalar tahlili va yechimlari.',
                                  style: TextStyle(color: AppColors.kidsSecondaryText),
                                ),
                              ],
                            ),
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
    );
  }

  Widget _buildNavItem(IconData icon, String title, bool active, VoidCallback onTap) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      child: Material(
        color: active ? const Color(0xFFF3F0FF) : Colors.transparent,
        borderRadius: BorderRadius.circular(16),
        child: ListTile(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          leading: Icon(icon, color: active ? AppColors.kidsPrimary : AppColors.kidsSecondaryText),
          title: Text(
            title,
            style: TextStyle(
              fontSize: 15,
              fontWeight: active ? FontWeight.w800 : FontWeight.w600,
              color: active ? AppColors.kidsPrimary : AppColors.kidsDarkText,
            ),
          ),
          onTap: onTap,
        ),
      ),
    );
  }
}
