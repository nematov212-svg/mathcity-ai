import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/coin_badge.dart';
import '../../core/widgets/xp_bar.dart';
import '../../shared/providers/student_provider.dart';

class TeenDesktopScreen extends ConsumerWidget {
  const TeenDesktopScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final student = ref.watch(studentProvider).student;
    final coins = student?.coinBalance ?? 0;
    final xp = student?.totalXP ?? 0;
    final level = student?.level ?? 1;
    final name = student?.displayName ?? 'O‘quvchi';

    return Scaffold(
      backgroundColor: AppColors.teenBackground,
      body: Row(
        children: [
          // Left Rail Navigation (Figma 2:91 >= 1024px)
          SizedBox(
            width: 260,
            child: Material(
              color: AppColors.teenSurface,
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
                        color: AppColors.teenPrimaryLime,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Center(
                        child: Text(
                          'M²',
                          style: TextStyle(
                            color: AppColors.teenLimeTextDark,
                            fontSize: 22,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    const Text(
                      'MathCity Pro',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 36),
                _buildNavItem(Icons.dashboard_rounded, 'Boshqaruv paneli', true, () {}),
                _buildNavItem(Icons.menu_book_rounded, 'O‘quv kursi', false, () => context.push('/teen/courses')),
                _buildNavItem(Icons.psychology_rounded, 'AI Ustoz', false, () => context.push('/teen/ai-tutor')),
                _buildNavItem(Icons.location_city_rounded, 'Ilmiy shahar', false, () => context.push('/teen/city')),
                _buildNavItem(Icons.insights_rounded, 'Akademik tahlil', false, () => context.push('/teen/analytics')),
                const Spacer(),
                _buildNavItem(Icons.settings_outlined, 'Sozlamalar', false, () => context.push('/settings')),
              ],
            ),
          ),
        ),
      ),

          // Main Teen Desktop Workspace
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Salom, $name ⚡️',
                            style: const TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.w800,
                              color: Colors.white,
                            ),
                          ),
                          const Text(
                            'O‘smirlar ilmiy tahlil va matematika dasturi',
                            style: TextStyle(fontSize: 14, color: AppColors.teenMutedText),
                          ),
                        ],
                      ),
                      Row(
                        children: [
                          CoinBadge(count: coins, size: 28),
                          const SizedBox(width: 16),
                          SizedBox(
                            width: 240,
                            child: XPBar(currentXP: xp, level: level, isDark: true),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 28),

                  // Hero Course Banner
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(32),
                    decoration: BoxDecoration(
                      color: AppColors.teenSurface,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: AppColors.teenBorder),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                decoration: BoxDecoration(
                                  color: AppColors.teenPrimaryLime.withOpacity(0.15),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Text(
                                  'FAOL ILMIY MODUL',
                                  style: TextStyle(
                                    color: AppColors.teenPrimaryLime,
                                    fontSize: 11,
                                    fontWeight: FontWeight.w800,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 12),
                              const Text(
                                'Kvadrat tenglamalar va Funksiyalar tahlili',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 26,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                              const SizedBox(height: 8),
                              const Text(
                                'Nazariya, diskriminant qoidalari, grafiklar va haqiqiy ildizlarni hisoblash amaliyoti.',
                                style: TextStyle(color: AppColors.teenMutedText, fontSize: 14),
                              ),
                              const SizedBox(height: 24),
                              ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.teenPrimaryLime,
                                  foregroundColor: AppColors.teenLimeTextDark,
                                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                ),
                                onPressed: () => context.push('/teen/courses'),
                                child: const Text('Kursni davom ettirish', style: TextStyle(fontWeight: FontWeight.w800)),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 32),
                        Container(
                          width: 130,
                          height: 130,
                          decoration: BoxDecoration(
                            color: const Color(0xFF1E273D),
                            borderRadius: BorderRadius.circular(24),
                            border: Border.all(color: AppColors.teenBorder),
                          ),
                          child: const Center(
                            child: Icon(Icons.functions_rounded, size: 64, color: AppColors.teenPrimaryLime),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 28),

                  // Lower Split Console
                  Row(
                    children: [
                      Expanded(
                        child: InkWell(
                          onTap: () => context.push('/teen/ai-tutor'),
                          borderRadius: BorderRadius.circular(20),
                          child: Container(
                            height: 180,
                            padding: const EdgeInsets.all(24),
                            decoration: BoxDecoration(
                              color: AppColors.teenSurface,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: AppColors.teenBorder),
                            ),
                            child: const Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Icon(Icons.psychology_rounded, color: AppColors.teenPrimaryLime, size: 36),
                                Spacer(),
                                Text(
                                  'AI Ustoz',
                                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white),
                                ),
                                SizedBox(height: 4),
                                Text(
                                  'LaTeX formula renderlash va bosqichma-bosqich isbotlar.',
                                  style: TextStyle(color: AppColors.teenMutedText, fontSize: 13),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 20),
                      Expanded(
                        child: InkWell(
                          onTap: () => context.push('/teen/analytics'),
                          borderRadius: BorderRadius.circular(20),
                          child: Container(
                            height: 180,
                            padding: const EdgeInsets.all(24),
                            decoration: BoxDecoration(
                              color: AppColors.teenSurface,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: AppColors.teenBorder),
                            ),
                            child: const Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Icon(Icons.insights_rounded, color: Color(0xFF00CEC9), size: 36),
                                Spacer(),
                                Text(
                                  'Akademik telemetriya',
                                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white),
                                ),
                                SizedBox(height: 4),
                                Text(
                                  'Kuchli va kuchaytirish talab etiladigan mavzular tahlili.',
                                  style: TextStyle(color: AppColors.teenMutedText, fontSize: 13),
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
      margin: const EdgeInsets.only(bottom: 6),
      child: Material(
        color: active ? const Color(0xFF1E273D) : Colors.transparent,
        borderRadius: BorderRadius.circular(12),
        child: ListTile(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          leading: Icon(icon, color: active ? AppColors.teenPrimaryLime : AppColors.teenMutedText),
          title: Text(
            title,
            style: TextStyle(
              fontSize: 14,
              fontWeight: active ? FontWeight.w700 : FontWeight.w500,
              color: active ? AppColors.teenPrimaryLime : AppColors.teenMutedText,
            ),
          ),
          onTap: onTap,
        ),
      ),
    );
  }
}
