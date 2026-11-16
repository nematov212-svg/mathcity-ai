import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/coin_badge.dart';

class AchievementsScreen extends StatelessWidget {
  const AchievementsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final achievements = [
      {
        'title': 'Birinchi qadam',
        'desc': 'MathCity AI da birinchi darsni muvaffaqiyatli yakunladingiz.',
        'icon': Icons.flag_rounded,
        'coins': 50,
        'xp': 50,
        'isUnlocked': true,
      },
      {
        'title': 'Hisob ustasi',
        'desc': 'Ketma-ket 10 ta masalaga xatosiz to‘g‘ri javob berdingiz.',
        'icon': Icons.bolt_rounded,
        'coins': 100,
        'xp': 120,
        'isUnlocked': true,
      },
      {
        'title': 'Fazogir',
        'desc': 'Kosmik hisob o‘yinida 1-darajani yengib o‘tdingiz.',
        'icon': Icons.rocket_launch_rounded,
        'coins': 75,
        'xp': 80,
        'isUnlocked': true,
      },
      {
        'title': 'Shahar bunyodkori',
        'desc': 'Mening shahrimda birinchi binoni quring.',
        'icon': Icons.apartment_rounded,
        'coins': 60,
        'xp': 60,
        'isUnlocked': true,
      },
      {
        'title': 'Yulduzlar tadqiqotchisi',
        'desc': 'Figma 2:712: Shahar rasadxonasini quring va astronomiya sirini oching.',
        'icon': Icons.visibility_rounded,
        'coins': 200,
        'xp': 250,
        'isUnlocked': false,
      },
    ];

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
          'Yutuqlar',
          style: TextStyle(
            fontWeight: FontWeight.w800,
            fontSize: 18,
            color: AppColors.kidsDarkText,
          ),
        ),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        itemCount: achievements.length,
        itemBuilder: (context, index) {
          final ach = achievements[index];
          final isUnlocked = ach['isUnlocked'] as bool;

          return Container(
            margin: const EdgeInsets.only(bottom: 14),
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: isUnlocked ? Colors.white : const Color(0xFFF3F4F8),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(
                color: isUnlocked ? AppColors.kidsBorder : const Color(0xFFE2E4EC),
                width: 1.5,
              ),
              boxShadow: isUnlocked
                  ? [
                      BoxShadow(
                        color: AppColors.kidsDarkText.withOpacity(0.04),
                        blurRadius: 14,
                        offset: const Offset(0, 5),
                      ),
                    ]
                  : null,
            ),
            child: Row(
              children: [
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    color: isUnlocked ? const Color(0xFFF0EDFF) : const Color(0xFFE2E4EC),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    ach['icon'] as IconData,
                    color: isUnlocked ? AppColors.kidsPrimary : const Color(0xFF989AA8),
                    size: 30,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        ach['title'] as String,
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: isUnlocked ? AppColors.kidsDarkText : const Color(0xFF8B8EA0),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        ach['desc'] as String,
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppColors.kidsSecondaryText,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          CoinBadge(count: ach['coins'] as int, size: 20),
                          const SizedBox(width: 8),
                          Text(
                            '+${ach['xp']} XP',
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w800,
                              color: AppColors.kidsPrimary,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                Icon(
                  isUnlocked ? Icons.verified_rounded : Icons.lock_outline_rounded,
                  color: isUnlocked ? AppColors.kidsGreen : const Color(0xFF989AA8),
                  size: 26,
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
