import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/coin_badge.dart';
import '../../shared/providers/student_provider.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final studentState = ref.watch(studentProvider);
    final student = studentState.student;

    final name = student?.displayName ?? 'Ali';
    final age = student?.age ?? 10;
    final grade = student?.grade ?? 4;
    final mode = student?.mode ?? 'KIDS';
    final coins = student?.coinBalance ?? 250;
    final xp = student?.totalXP ?? 380;
    final level = student?.level ?? 3;

    return Scaffold(
      backgroundColor: AppColors.kidsBackground,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.kidsDarkText),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Mening profilim',
          style: TextStyle(
            fontWeight: FontWeight.w800,
            fontSize: 18,
            color: AppColors.kidsDarkText,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined, color: AppColors.kidsDarkText),
            onPressed: () => context.push('/settings'),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        child: Column(
          children: [
            // Student Card Header (Figma 2:62)
            Container(
              padding: const EdgeInsets.all(22),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(28),
                border: Border.all(color: AppColors.kidsBorder, width: 1.5),
              ),
              child: Column(
                children: [
                  Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: const Color(0xFFF3F0FF),
                      border: Border.all(color: AppColors.kidsPrimary, width: 2.5),
                    ),
                    child: const Center(
                      child: Icon(Icons.face_rounded, color: AppColors.kidsPrimary, size: 52),
                    ),
                  ),
                  const SizedBox(height: 14),
                  Text(
                    name,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w900,
                      color: AppColors.kidsDarkText,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '$grade-sinf o‘quvchisi • $age yosh (${mode == 'KIDS' ? 'Bolalar rejimi' : 'O‘smirlar rejimi'})',
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: AppColors.kidsSecondaryText,
                    ),
                  ),
                  const SizedBox(height: 18),
                  Wrap(
                    alignment: WrapAlignment.center,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    spacing: 12,
                    runSpacing: 8,
                    children: [
                      CoinBadge(count: coins, size: 26),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF0EDFF),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFDED6FF)),
                        ),
                        child: Text(
                          '$level-daraja ($xp XP)',
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w800,
                            color: AppColors.kidsPrimary,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Navigation Links
            _buildProfileTile(
              icon: Icons.emoji_events_rounded,
              color: const Color(0xFFFFB800),
              title: 'Yutuqlarim',
              subtitle: '4 ta medal qo‘lga kiritilgan',
              onTap: () => context.push('/kids/achievements'),
            ),
            const SizedBox(height: 12),
            _buildProfileTile(
              icon: Icons.checklist_rounded,
              color: AppColors.kidsGreen,
              title: 'Kunlik vazifalar',
              subtitle: 'Mukofotlarni tekshiring',
              onTap: () => context.push('/kids/daily-tasks'),
            ),
            const SizedBox(height: 12),
            _buildProfileTile(
              icon: Icons.bar_chart_rounded,
              color: AppColors.kidsPrimary,
              title: 'O‘quv statistikasi',
              subtitle: 'Aniqlik va mavzular o‘zlashtirilishi',
              onTap: () => context.push('/kids/analytics'),
            ),
            const SizedBox(height: 12),
            _buildProfileTile(
              icon: Icons.settings_rounded,
              color: const Color(0xFF57606F),
              title: 'Sozlamalar',
              subtitle: 'Til, ovoz va hisob maxfiyligi',
              onTap: () => context.push('/settings'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileTile({
    required IconData icon,
    required Color color,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(22),
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: AppColors.kidsBorder, width: 1.5),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.withOpacity(0.12),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(icon, color: color, size: 26),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w800,
                      color: AppColors.kidsDarkText,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppColors.kidsSecondaryText,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.arrow_forward_ios_rounded, size: 16, color: AppColors.kidsSecondaryText),
          ],
        ),
      ),
    );
  }
}
