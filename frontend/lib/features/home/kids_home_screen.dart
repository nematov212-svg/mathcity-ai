import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/coin_badge.dart';
import '../../core/widgets/xp_bar.dart';
import '../../shared/providers/student_provider.dart';

class KidsHomeScreen extends ConsumerWidget {
  const KidsHomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final studentState = ref.watch(studentProvider);
    final student = studentState.student;

    final coins = student?.coinBalance ?? 250;
    final xp = student?.totalXP ?? 380;
    final level = student?.level ?? 3;
    final name = student?.displayName ?? 'Ali';

    return Scaffold(
      backgroundColor: AppColors.kidsBackground,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top Bar: Avatar, Greeting, Coin Badge & XP
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.white,
                          border: Border.all(color: AppColors.kidsPrimary, width: 2),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.kidsPrimary.withOpacity(0.15),
                              blurRadius: 10,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: const Center(
                          child: Icon(Icons.face_rounded, color: AppColors.kidsPrimary, size: 30),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Salom, $name! 👋',
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w800,
                              color: AppColors.kidsDarkText,
                            ),
                          ),
                          const Text(
                            'Bugun nima o‘rganamiz?',
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color: AppColors.kidsSecondaryText,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  CoinBadge(count: coins, size: 28),
                ],
              ),
              const SizedBox(height: 16),

              // Level & XP Bar
              XPBar(currentXP: xp, level: level),
              const SizedBox(height: 20),

              // Daily Adventure / Continue Lesson Card (Figma 2:10)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(22),
                decoration: BoxDecoration(
                  gradient: AppColors.kidsPrimaryGradient,
                  borderRadius: BorderRadius.circular(28),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.kidsPrimary.withOpacity(0.3),
                      blurRadius: 20,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: const Text(
                            'DAVOM ETISH',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w800,
                              fontSize: 11,
                              letterSpacing: 1.1,
                            ),
                          ),
                        ),
                        const Icon(Icons.school_rounded, color: Colors.white, size: 26),
                      ],
                    ),
                    const SizedBox(height: 14),
                    const Text(
                      'Oddiy kasrlar',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Butunning bo‘laklari va doirali diagrammalar',
                      style: TextStyle(
                        color: Color(0xFFE2DCFF),
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 20),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: AppColors.kidsPrimary,
                        elevation: 0,
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                      onPressed: () {
                        context.push('/kids/exercise/q-math-01?lessonId=lesson-k3-01&sectionId=section-k3-01-s1');
                      },
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            'Darsni boshlash',
                            style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14),
                          ),
                          SizedBox(width: 8),
                          Icon(Icons.arrow_forward_rounded, size: 18),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 22),

              // Mening Shahrim & Kosmik Hisob Quick Actions
              Row(
                children: [
                  // City Preview Card
                  Expanded(
                    child: InkWell(
                      onTap: () => context.push('/kids/city'),
                      borderRadius: BorderRadius.circular(24),
                      child: Container(
                        padding: const EdgeInsets.all(18),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(color: AppColors.kidsBorder, width: 1.5),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.kidsDarkText.withOpacity(0.04),
                              blurRadius: 16,
                              offset: const Offset(0, 6),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: const Color(0xFFE8F7F0),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: const Icon(Icons.location_city_rounded,
                                  color: AppColors.kidsGreen, size: 28),
                            ),
                            const SizedBox(height: 14),
                            const Text(
                              'Mening shahrim',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                                color: AppColors.kidsDarkText,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${student?.cityLevel ?? 1}-daraja shahar',
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: AppColors.kidsSecondaryText,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  // Space Math Game Card
                  Expanded(
                    child: InkWell(
                      onTap: () => context.push('/kids/games/space-math'),
                      borderRadius: BorderRadius.circular(24),
                      child: Container(
                        padding: const EdgeInsets.all(18),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(color: AppColors.kidsBorder, width: 1.5),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.kidsDarkText.withOpacity(0.04),
                              blurRadius: 16,
                              offset: const Offset(0, 6),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: const Color(0xFFFFF0E6),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: const Icon(Icons.rocket_launch_rounded,
                                  color: AppColors.kidsOrange, size: 28),
                            ),
                            const SizedBox(height: 14),
                            const Text(
                              'Kosmik hisob',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                                color: AppColors.kidsDarkText,
                              ),
                            ),
                            const SizedBox(height: 4),
                            const Text(
                              '+30 oltin tanga',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFFD48B00),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 22),

              // AI Ustoz Ziyo Banner
              InkWell(
                onTap: () => context.push('/kids/ai-tutor'),
                borderRadius: BorderRadius.circular(24),
                child: Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF0EDFF),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: const Color(0xFFD8D1FF), width: 1.5),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 50,
                        height: 50,
                        decoration: const BoxDecoration(
                          color: AppColors.kidsPrimary,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.smart_toy_rounded, color: Colors.white, size: 28),
                      ),
                      const SizedBox(width: 14),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Ziyo AI Ustoz',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                                color: AppColors.kidsDarkText,
                              ),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Tushunmagan misolingiz bormi? So‘rang!',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                                color: AppColors.kidsSecondaryText,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const Icon(Icons.chat_bubble_outline_rounded,
                          color: AppColors.kidsPrimary, size: 24),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 22),

              // Daily Tasks Card (Figma 2:50 preview)
              InkWell(
                onTap: () => context.push('/kids/daily-tasks'),
                borderRadius: BorderRadius.circular(24),
                child: Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: AppColors.kidsBorder, width: 1.5),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Row(
                            children: [
                              Icon(Icons.checklist_rounded, color: AppColors.kidsGreen, size: 22),
                              SizedBox(width: 8),
                              Text(
                                'Bugungi vazifalar',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w800,
                                  color: AppColors.kidsDarkText,
                                ),
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFFE2F6F0),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Text(
                              '1 / 4 bajarildi',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: AppColors.kidsGreen,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      const Text(
                        '5 ta matematika masalasini to‘g‘ri yeching',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.kidsDarkText,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
      bottomNavigationBar: _buildBottomNav(context, 0),
    );
  }

  Widget _buildBottomNav(BuildContext context, int currentIndex) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: AppColors.kidsBorder, width: 1.5)),
      ),
      child: BottomNavigationBar(
        currentIndex: currentIndex,
        elevation: 0,
        backgroundColor: Colors.white,
        selectedItemColor: AppColors.kidsPrimary,
        unselectedItemColor: AppColors.kidsSecondaryText,
        selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 11),
        unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 11),
        type: BottomNavigationBarType.fixed,
        onTap: (index) {
          if (index == 0) context.go('/kids/home');
          if (index == 1) context.push('/kids/lessons');
          if (index == 2) context.push('/kids/games');
          if (index == 3) context.push('/kids/city');
          if (index == 4) context.push('/kids/profile');
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_rounded),
            label: 'Bosh sahifa',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.map_rounded),
            label: 'Xarita',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.sports_esports_rounded),
            label: 'O‘yinlar',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.location_city_rounded),
            label: 'Shahrim',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_rounded),
            label: 'Profil',
          ),
        ],
      ),
    );
  }
}
