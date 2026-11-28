import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../games/screens/games_section.dart';

class KidsDesktopScreen extends ConsumerWidget {
  const KidsDesktopScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Material(
      color: Colors.transparent,
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 24),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 1300),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Large Hero Adventure Card
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(
                    gradient: AppColors.kidsPrimaryGradient,
                    borderRadius: BorderRadius.circular(32),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.kidsPrimary.withValues(alpha: 0.28),
                        blurRadius: 28,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        flex: 6,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 14, vertical: 6),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.2),
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
                              'Misollar ishlash',
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
                            MouseRegion(
                              cursor: SystemMouseCursors.click,
                              child: ElevatedButton.icon(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.white,
                                  foregroundColor: AppColors.kidsPrimary,
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 26, vertical: 16),
                                  shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(18)),
                                  elevation: 0,
                                ),
                                onPressed: () => context.push('/kids/lessons'),
                                icon: const Icon(Icons.play_circle_fill_rounded,
                                    size: 22),
                                label: const Text(
                                  'Boshlash',
                                  style: TextStyle(
                                      fontWeight: FontWeight.w800,
                                      fontSize: 15),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 32),
                      Expanded(
                        flex: 4,
                        child: Align(
                          alignment: Alignment.centerRight,
                          child: Container(
                            width: 140,
                            height: 140,
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.15),
                              shape: BoxShape.circle,
                            ),
                            child: const Center(
                              child: Icon(Icons.pie_chart_rounded,
                                  size: 84, color: Colors.white),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 32),

                // 3-Column Keng Dashboard Layout (Figma 2:90)
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Column 1: Kunlik vazifalar & Streak
                    Expanded(
                      child: Column(
                        children: [
                          _buildDashboardCard(
                            title: 'Kunlik vazifalar 🎯',
                            subtitle: 'Kunlik maqsadlaringiz sari intiling',
                            child: Column(
                              children: [
                                _buildTaskItem(
                                    '10 ta kasr misoli yechish', true),
                                const SizedBox(height: 12),
                                _buildTaskItem(
                                    '1 ta dars videosini ko‘rish', true),
                                const SizedBox(height: 12),
                                _buildTaskItem(
                                    'AI Ustoz bilan 5 daqiqa mashq', false),
                              ],
                            ),
                          ),
                          const SizedBox(height: 20),
                          _buildDashboardCard(
                            title: 'Haftalik ketma-ketlik 🔥',
                            subtitle: 'Har kuni 1 tadan dars bajaring',
                            child: FittedBox(
                              fit: BoxFit.scaleDown,
                              alignment: Alignment.center,
                              child: Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceAround,
                                children: ['D', 'S', 'Ch', 'P', 'J', 'Sh', 'Ya']
                                    .map((d) {
                                  final isToday = d == 'S';
                                  return Column(
                                    children: [
                                      Text(
                                        d,
                                        style: const TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.w700,
                                          color: AppColors.kidsSecondaryText,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      Container(
                                        width: 36,
                                        height: 36,
                                        decoration: BoxDecoration(
                                          color: isToday
                                              ? AppColors.kidsOrange
                                              : const Color(0xFFF3F0FF),
                                          shape: BoxShape.circle,
                                        ),
                                        child: Center(
                                          child: Icon(
                                            Icons.local_fire_department_rounded,
                                            size: 20,
                                            color: isToday
                                                ? Colors.white
                                                : AppColors.kidsPrimary
                                                    .withValues(alpha: 0.4),
                                          ),
                                        ),
                                      ),
                                    ],
                                  );
                                }).toList(),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 24),

                    // Column 2: Mening shahrim & AI Ustoz
                    Expanded(
                      child: Column(
                        children: [
                          _buildInteractiveBanner(
                            icon: Icons.home_work_rounded,
                            color: AppColors.kidsGreen,
                            title: 'Uy qurish',
                            description:
                                'Kengaytirilgan reja asosida shahar binolarini va uylarni quring.',
                            buttonText: 'Uy qurish',
                            onTap: () => context.push('/kids/games/house-building'),
                          ),
                          const SizedBox(height: 20),
                          _buildInteractiveBanner(
                            icon: Icons.smart_toy_rounded,
                            color: AppColors.kidsPrimary,
                            title: 'Ziyo — AI Ustoz 🤖',
                            description:
                                'Katta ekranda interaktiv masalalar tahlili, ovozli savol-javob va qadam-baqadam yechimlar.',
                            buttonText: 'Savol berish',
                            onTap: () => context.push('/kids/ai-tutor'),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 24),

                    // Column 3: O'yinlar markazi & Shohsupa / Reyting
                    Expanded(
                      child: Column(
                        children: [
                          _buildInteractiveBanner(
                            icon: Icons.sports_esports_rounded,
                            color: const Color(0xFFFF8A00),
                            title: 'O‘yinlar markazi 🎮',
                            description:
                                'Koinot jangi, kasrlar to‘qnashuvi va tezkor poyga orqali ko‘paytirish jadvalini mustahkamlang.',
                            buttonText: 'O‘yinlarni ochish',
                            onTap: () => context.push('/kids/games'),
                          ),
                          const SizedBox(height: 20),
                          _buildDashboardCard(
                            title: 'Haftalik reyting 🏆',
                            subtitle: 'Eng faol o‘quvchilar ro‘yxati',
                            child: Column(
                              children: [
                                _buildLeaderboardPreviewItem(
                                    1, 'Jasur R.', '2,450 XP', '🥇'),
                                const SizedBox(height: 10),
                                _buildLeaderboardPreviewItem(
                                    2, 'Malika T.', '2,120 XP', '🥈'),
                                const SizedBox(height: 10),
                                _buildLeaderboardPreviewItem(
                                    3, 'Samir K.', '1,890 XP', '🥉'),
                                const SizedBox(height: 14),
                                MouseRegion(
                                  cursor: SystemMouseCursors.click,
                                  child: InkWell(
                                    onTap: () =>
                                        context.push('/kids/leaderboard'),
                                    child: const FittedBox(
                                      fit: BoxFit.scaleDown,
                                      alignment: Alignment.center,
                                      child: Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        children: [
                                          Text(
                                            'To‘liq reytingni ko‘rish',
                                            style: TextStyle(
                                              color: AppColors.kidsPrimary,
                                              fontSize: 13,
                                              fontWeight: FontWeight.w800,
                                            ),
                                          ),
                                          SizedBox(width: 4),
                                          Icon(Icons.arrow_forward_rounded,
                                              size: 16,
                                              color: AppColors.kidsPrimary),
                                        ],
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 32),
                const GamesSection(),
                const SizedBox(height: 40),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDashboardCard({
    required String title,
    required String subtitle,
    required Widget child,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.kidsBorder),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w900,
                color: AppColors.kidsDarkText),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: const TextStyle(
                fontSize: 12, color: AppColors.kidsSecondaryText),
          ),
          const SizedBox(height: 16),
          child,
        ],
      ),
    );
  }

  Widget _buildTaskItem(String title, bool isDone) {
    return Row(
      children: [
        Container(
          width: 24,
          height: 24,
          decoration: BoxDecoration(
            color: isDone ? AppColors.kidsGreen : Colors.transparent,
            shape: BoxShape.circle,
            border: Border.all(
              color: isDone ? AppColors.kidsGreen : AppColors.kidsBorder,
              width: 1.5,
            ),
          ),
          child: isDone
              ? const Icon(Icons.check_rounded, color: Colors.white, size: 16)
              : null,
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            title,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              decoration: isDone ? TextDecoration.lineThrough : null,
              color:
                  isDone ? AppColors.kidsSecondaryText : AppColors.kidsDarkText,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildInteractiveBanner({
    required IconData icon,
    required Color color,
    required String title,
    required String description,
    required String buttonText,
    required VoidCallback onTap,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.kidsBorder),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(icon, color: color, size: 26),
          ),
          const SizedBox(height: 14),
          Text(
            title,
            style: const TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.w900,
                color: AppColors.kidsDarkText),
          ),
          const SizedBox(height: 6),
          Text(
            description,
            style: const TextStyle(
                fontSize: 13, color: AppColors.kidsSecondaryText, height: 1.4),
          ),
          const SizedBox(height: 18),
          MouseRegion(
            cursor: SystemMouseCursors.click,
            child: SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                style: OutlinedButton.styleFrom(
                  foregroundColor: color,
                  side: BorderSide(
                      color: color.withValues(alpha: 0.5), width: 1.5),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14)),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
                onPressed: onTap,
                child: Text(
                  buttonText,
                  style: const TextStyle(
                      fontWeight: FontWeight.w800, fontSize: 13),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLeaderboardPreviewItem(
      int rank, String name, String score, String medal) {
    return Row(
      children: [
        Text(medal, style: const TextStyle(fontSize: 18)),
        const SizedBox(width: 10),
        Expanded(
          child: Text(
            name,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w800,
              color: AppColors.kidsDarkText,
            ),
          ),
        ),
        Text(
          score,
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w800,
            color: AppColors.kidsPrimary,
          ),
        ),
      ],
    );
  }
}
