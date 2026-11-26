import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/popup_manager.dart';
import '../../core/widgets/coin_badge.dart';
import '../../core/widgets/xp_bar.dart';
import '../../shared/providers/student_provider.dart';

class TeenHomeScreen extends ConsumerStatefulWidget {
  const TeenHomeScreen({super.key});

  @override
  ConsumerState<TeenHomeScreen> createState() => _TeenHomeScreenState();
}

class _TeenHomeScreenState extends ConsumerState<TeenHomeScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        PopupManager.onDashboardLoaded(context, ref);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final studentState = ref.watch(studentProvider);
    final student = studentState.student;

    final coins = student?.coinBalance ?? 0;
    final xp = student?.totalXP ?? 0;
    final level = student?.level ?? 1;
    final name = (student != null && student.displayName.trim().isNotEmpty) ? student.displayName.trim() : 'O‘quvchi';

    final isDark = Theme.of(context).brightness == Brightness.dark;
    final colors = AppThemeColors.of(context);

    return Scaffold(
      backgroundColor: isDark ? AppColors.teenBackground : colors.bg,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top Bar: Teen Avatar, Greeting, Coin Badge & Settings
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Row(
                      children: [
                        Container(
                          width: 48,
                          height: 48,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: AppColors.teenSurface,
                            border: Border.all(color: AppColors.teenPrimaryLime, width: 2),
                          ),
                          child: const Center(
                            child: Icon(Icons.person_rounded,
                                color: AppColors.teenPrimaryLime, size: 28),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Salom, $name',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w800,
                                  color: Colors.white,
                                ),
                              ),
                              const Text(
                                'O‘smirlar ilmiy portali',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w500,
                                  color: AppColors.teenMutedText,
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
                      CoinBadge(count: coins, size: 26),
                      const SizedBox(width: 4),
                      IconButton(
                        icon: const Icon(Icons.settings_outlined, color: AppColors.teenMutedText),
                        onPressed: () => context.push('/settings'),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Level & XP Bar (Teen Dark Style)
              XPBar(currentXP: xp, level: level, isDark: true),
              const SizedBox(height: 24),

              // Hero Course Banner: Kvadrat tenglamalar (Figma 2:70)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
                decoration: BoxDecoration(
                  color: AppColors.teenSurface,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: AppColors.teenBorder),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.teenPrimaryLime.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Text(
                            'ALGEBRA • 8-SINF',
                            style: TextStyle(
                              color: AppColors.teenPrimaryLime,
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 1.1,
                            ),
                          ),
                        ),
                        const Icon(Icons.functions_rounded, color: AppColors.teenPrimaryLime, size: 24),
                      ],
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Kvadrat tenglamalar va Diskriminant',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'D = b² - 4ac va Viyet teoremasi orqali ildizlarni topish usullari',
                      style: TextStyle(
                        color: AppColors.teenMutedText,
                        fontSize: 13,
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                    const SizedBox(height: 20),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.teenPrimaryLime,
                        foregroundColor: AppColors.teenLimeTextDark,
                        elevation: 0,
                        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      onPressed: () => context.push('/kids/lesson/lesson-g7-01'),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Flexible(
                            child: Text(
                              'Darsni boshlash',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(fontWeight: FontWeight.w800),
                            ),
                          ),
                          SizedBox(width: 8),
                          Icon(Icons.arrow_forward_rounded, size: 18),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Two Column Cards: Reyting & Ziyo AI
              Row(
                children: [
                  Expanded(
                    child: InkWell(
                      onTap: () => context.push('/kids/leaderboard'),
                      borderRadius: BorderRadius.circular(20),
                      child: Container(
                        padding: const EdgeInsets.all(18),
                        decoration: BoxDecoration(
                          color: AppColors.teenSurface,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppColors.teenBorder),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Icon(Icons.emoji_events_rounded, color: Color(0xFFFFB300), size: 32),
                            const SizedBox(height: 12),
                            const Text(
                              'Reyting',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              (student != null && (student.coinBalance > 0 || student.totalXP > 0))
                                  ? 'Siz ${student.rank}-o‘rindasiz'
                                  : 'Hali reytingda emassiz',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 11,
                                color: AppColors.teenMutedText,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: InkWell(
                      onTap: () => context.push('/teen/ai-tutor'),
                      borderRadius: BorderRadius.circular(20),
                      child: Container(
                        padding: const EdgeInsets.all(18),
                        decoration: BoxDecoration(
                          color: AppColors.teenSurface,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppColors.teenBorder),
                        ),
                        child: const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Icon(Icons.psychology_rounded, color: AppColors.teenPrimaryLime, size: 32),
                            SizedBox(height: 12),
                            Text(
                              'AI Ustoz',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              'LaTeX formula va isbotlar',
                              style: TextStyle(
                                fontSize: 11,
                                color: AppColors.teenMutedText,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Teen Analytics Shortcut
              InkWell(
                onTap: () => context.push('/teen/analytics'),
                borderRadius: BorderRadius.circular(20),
                child: Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: AppColors.teenSurface,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppColors.teenBorder),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.insights_rounded, color: AppColors.teenPrimaryLime, size: 28),
                      SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Akademik tahlil va Natijalar',
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                              ),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'O‘zlashtirish koeffitsienti: 92% • Algebra & Geometriya',
                              style: TextStyle(
                                fontSize: 12,
                                color: AppColors.teenMutedText,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Icon(Icons.arrow_forward_ios_rounded, color: AppColors.teenMutedText, size: 16),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
      bottomNavigationBar: _buildTeenBottomNav(context, 0),
    );
  }

  Widget _buildTeenBottomNav(BuildContext context, int currentIndex) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.teenSurface,
        border: Border(top: BorderSide(color: AppColors.teenBorder, width: 1.0)),
      ),
      child: BottomNavigationBar(
        currentIndex: currentIndex,
        elevation: 0,
        backgroundColor: AppColors.teenSurface,
        selectedItemColor: AppColors.teenPrimaryLime,
        unselectedItemColor: AppColors.teenMutedText,
        selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 11),
        unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 11),
        type: BottomNavigationBarType.fixed,
        onTap: (index) {
          if (index == 0) context.go('/teen/home');
          if (index == 1) context.push('/teen/courses');
          if (index == 2) context.push('/teen/ai-tutor');
          if (index == 3) context.push('/kids/leaderboard');
          if (index == 4) context.push('/teen/analytics');
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_filled),
            label: 'Asosiy',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.menu_book_rounded),
            label: 'Kurslar',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.psychology_rounded),
            label: 'AI Ustoz',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.leaderboard_rounded),
            label: 'Reyting',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.insights_rounded),
            label: 'Tahlil',
          ),
        ],
      ),
    );
  }
}
