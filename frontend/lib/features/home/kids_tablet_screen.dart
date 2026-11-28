import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../shared/providers/student_provider.dart';
import '../games/screens/games_section.dart';

class KidsTabletScreen extends ConsumerWidget {
  const KidsTabletScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final student = ref.watch(studentProvider).student;
    final name = student?.displayName ?? 'O‘quvchi';

    return Material(
      color: Colors.transparent,
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Greeting & Hero
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: AppColors.kidsPrimaryGradient,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.kidsPrimary.withValues(alpha: 0.25),
                    blurRadius: 18,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Text(
                            'KUNLIK MATEMATIKA SARGUZASHTI',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          'Salom, $name! 🌟',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 22,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                        const SizedBox(height: 6),
                        const Text(
                          'Misollar ishlash',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Bugungi matematik mashg‘ulotlarni davom ettiring va yangi binolarni oching!',
                          style: TextStyle(
                            color: Color(0xFFE2DCFF),
                            fontSize: 13,
                          ),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: AppColors.kidsPrimary,
                            padding: const EdgeInsets.symmetric(
                                horizontal: 20, vertical: 12),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(14)),
                            elevation: 0,
                          ),
                          onPressed: () => context.push('/kids/lessons'),
                          icon: const Icon(Icons.play_arrow_rounded, size: 20),
                          label: const Text(
                            'Boshlash',
                            style: TextStyle(
                                fontWeight: FontWeight.w800, fontSize: 14),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 16),
                  Container(
                    width: 90,
                    height: 90,
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                    ),
                    child: const Center(
                      child: Icon(Icons.auto_stories_rounded,
                          size: 48, color: AppColors.kidsPrimary),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // 1) Reyting va Uy qurish yonma-yon
            Row(
              children: [
                Expanded(
                  child: _buildInteractiveActionCard(
                    icon: Icons.leaderboard_rounded,
                    color: const Color(0xFFFFB800),
                    title: 'Reyting',
                    description: 'Do‘stlaringiz bilan kuch sinashing',
                    buttonText: 'Reytingni ko‘rish',
                    onTap: () => context.push('/kids/leaderboard'),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildInteractiveActionCard(
                    icon: Icons.home_work_rounded,
                    color: AppColors.kidsGreen,
                    title: 'Uy qurish',
                    description: 'Misollar yechib yangi uylar quring',
                    buttonText: 'Uy qurish',
                    onTap: () => context.push('/kids/games/house-building'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),

            // 2) AI Ustoz va Bugungi vazifalar ikki ustunda
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // AI Ustoz
                Expanded(
                  flex: 5,
                  child: _buildInteractiveActionCard(
                    icon: Icons.smart_toy_rounded,
                    color: AppColors.kidsPrimary,
                    title: 'AI Ustoz',
                    description: 'Tushunmagan misollaringizni so‘rang (Ziyo)',
                    buttonText: 'Savol berish',
                    onTap: () => context.push('/kids/ai-tutor'),
                  ),
                ),
                const SizedBox(width: 16),
                // Bugungi vazifalar
                Expanded(
                  flex: 5,
                  child: _buildTabletCard(
                    title: 'Bugungi vazifalar 🎯',
                    subtitle: '3 ta topshiriqdan 2 tasi bajarildi',
                    child: Column(
                      children: [
                        _buildTaskRow('10 ta misol yechish', true),
                        const SizedBox(height: 10),
                        _buildTaskRow('1 ta video dars ko‘rish', true),
                        const SizedBox(height: 10),
                        _buildTaskRow('AI Ustozdan savol so‘rash', false),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 28),
            const GamesSection(),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildTabletCard({
    required String title,
    required String subtitle,
    required Widget child,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.kidsBorder),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title,
              style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                  color: AppColors.kidsDarkText)),
          const SizedBox(height: 4),
          Text(subtitle,
              style: const TextStyle(
                  fontSize: 12, color: AppColors.kidsSecondaryText)),
          const SizedBox(height: 16),
          child,
        ],
      ),
    );
  }

  Widget _buildTaskRow(String title, bool isDone) {
    return Row(
      children: [
        Container(
          width: 22,
          height: 22,
          decoration: BoxDecoration(
            color: isDone ? AppColors.kidsGreen : Colors.transparent,
            shape: BoxShape.circle,
            border: Border.all(
                color: isDone ? AppColors.kidsGreen : AppColors.kidsBorder,
                width: 1.5),
          ),
          child: isDone
              ? const Icon(Icons.check_rounded, color: Colors.white, size: 14)
              : null,
        ),
        const SizedBox(width: 10),
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

  Widget _buildInteractiveActionCard({
    required IconData icon,
    required Color color,
    required String title,
    required String description,
    required String buttonText,
    required VoidCallback onTap,
  }) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(22),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(22),
            border: Border.all(color: AppColors.kidsBorder),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.03),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Row(
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
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title,
                        style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w800,
                            color: AppColors.kidsDarkText)),
                    const SizedBox(height: 2),
                    Text(description,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                            fontSize: 12, color: AppColors.kidsSecondaryText)),
                  ],
                ),
              ),
              const Icon(Icons.arrow_forward_ios_rounded,
                  size: 14, color: AppColors.kidsSecondaryText),
            ],
          ),
        ),
      ),
    );
  }
}
