import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/coin_badge.dart';

class TeenCourseMapScreen extends StatelessWidget {
  const TeenCourseMapScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final modules = [
      {
        'title': 'Kvadrat tenglamalar va Diskriminant',
        'grade': '8-sinf',
        'tag': 'ALGEBRA',
        'status': 'active',
        'lessonsCount': 6,
        'formula': 'ax^2 + bx + c = 0',
      },
      {
        'title': 'Pifagor teoremasi va Planimetriya',
        'grade': '8-sinf',
        'tag': 'GEOMETRIYA',
        'status': 'unlocked',
        'lessonsCount': 5,
        'formula': 'a^2 + b^2 = c^2',
      },
      {
        'title': 'Funksiyalar va grafiklar',
        'grade': '9-sinf',
        'tag': 'ANALIZ',
        'status': 'unlocked',
        'lessonsCount': 8,
        'formula': 'y = kx + b',
      },
      {
        'title': 'Trigonometriya asoslari',
        'grade': '9-sinf',
        'tag': 'TRIGONOMETRIYA',
        'status': 'locked',
        'lessonsCount': 7,
        'formula': '\\sin^2(x) + \\cos^2(x) = 1',
      },
      {
        'title': 'Logarifmlar va ko‘rsatkichli tenglamalar',
        'grade': '10-sinf',
        'tag': 'ALGEBRA',
        'status': 'locked',
        'lessonsCount': 9,
        'formula': '\\log_a(b) = c',
      },
    ];

    return Scaffold(
      backgroundColor: AppColors.teenBackground,
      appBar: AppBar(
        backgroundColor: AppColors.teenSurface,
        elevation: 0,
        leading: IconButton(
          icon:
              const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'O‘quv yo‘li va Kurslar',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w800,
            fontSize: 18,
          ),
        ),
        actions: const [
          Padding(
            padding: EdgeInsets.only(right: 16),
            child: Center(child: CoinBadge(count: 450, size: 24)),
          ),
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        itemCount: modules.length,
        itemBuilder: (context, index) {
          final m = modules[index];
          final isActive = m['status'] == 'active';
          final isLocked = m['status'] == 'locked';

          return Container(
            margin: const EdgeInsets.only(bottom: 16),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.teenSurface,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color:
                    isActive ? AppColors.teenPrimaryLime : AppColors.teenBorder,
                width: isActive ? 2 : 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: (isActive
                                ? AppColors.teenPrimaryLime
                                : Colors.white)
                            .withOpacity(0.12),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        '${m['tag']} • ${m['grade']}',
                        style: TextStyle(
                          color: isActive
                              ? AppColors.teenPrimaryLime
                              : AppColors.teenMutedText,
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ),
                    Icon(
                      isLocked
                          ? Icons.lock_outline_rounded
                          : Icons.check_circle_outline_rounded,
                      color: isLocked
                          ? AppColors.teenMutedText
                          : AppColors.teenPrimaryLime,
                      size: 20,
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  m['title'] as String,
                  style: const TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  '${m['lessonsCount']} ta dars va amaliy masalalar',
                  style: const TextStyle(
                    fontSize: 13,
                    color: AppColors.teenMutedText,
                  ),
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: isLocked
                        ? const Color(0xFF1E273D)
                        : AppColors.teenPrimaryLime,
                    foregroundColor: isLocked
                        ? AppColors.teenMutedText
                        : AppColors.teenLimeTextDark,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 18, vertical: 10),
                  ),
                  onPressed: isLocked
                      ? null
                      : () {
                          context.push('/kids/lesson/lesson-t8-01');
                        },
                  child: Text(
                    isLocked ? 'Qulflangan' : 'Darslarni boshlash',
                    style: const TextStyle(
                        fontWeight: FontWeight.w800, fontSize: 13),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
