import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/widgets/coin_badge.dart';
import '../../shared/providers/student_provider.dart';

class GameResultScreen extends ConsumerWidget {
  final Map<String, dynamic>? resultData;

  const GameResultScreen({super.key, this.resultData});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final student = ref.watch(studentProvider).student;
    final totalBalance = student?.coinBalance ?? 0;

    final correct = resultData?['correctAnswersCount'] ?? 9;
    final isFraction = resultData?['isFractionBattle'] == true;

    final totalQuestionsPlayed = 20;
    final totalCorrectAnswers = correct + 9; // combined summary
    final accuracyPercent = ((totalCorrectAnswers / totalQuestionsPlayed) * 100).round();

    return Scaffold(
      backgroundColor: const Color(0xFFF9F8FE),
      body: SafeArea(
        child: Column(
          children: [
            // Top App Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  InkWell(
                    onTap: () => context.go('/kids/games'),
                    borderRadius: BorderRadius.circular(12),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.arrow_back_ios_new_rounded,
                          size: 18,
                          color: Color(0xFF1E1B4B),
                        ),
                        SizedBox(width: 8),
                        Text(
                          'Natija',
                          style: TextStyle(
                            fontSize: 19,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF1E1B4B),
                          ),
                        ),
                      ],
                    ),
                  ),
                  CoinBadge(count: totalBalance, size: 22),
                ],
              ),
            ),

            // Scrollable Results Content
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                children: [
                  // Dual Celebration Illustration
                  Center(
                    child: Image.asset(
                      'assets/games/result_celebration.png',
                      height: 120,
                      fit: BoxFit.contain,
                      errorBuilder: (_, __, ___) => const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.rocket_launch_rounded, size: 60, color: Color(0xFF7C5CF8)),
                          SizedBox(width: 20),
                          Icon(Icons.pie_chart_rounded, size: 60, color: Color(0xFFFB923C)),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Title & Subtitle
                  const Center(
                    child: Text(
                      'Ajoyib natija!',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF1E1B4B),
                      ),
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Center(
                    child: Text(
                      'Ikkala o‘yinni ham yakunladingiz.',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF64748B),
                      ),
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Golden Reward Banner
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFEF9C3),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: const Color(0xFFFDE047), width: 1.2),
                    ),
                    child: Row(
                      children: [
                        const CoinIcon(size: 48, floating: true, popOnAppear: true),
                        const SizedBox(width: 16),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              '+70 oltin tanga',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFF854D0E),
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Jami balans: $totalBalance tanga',
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFFA16207),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // 3-Column Stats Row
                  Container(
                    padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 10),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(22),
                      border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF1E1B4B).withOpacity(0.03),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        _buildStatCol('$totalQuestionsPlayed', 'Savollar'),
                        Container(height: 36, width: 1, color: const Color(0xFFE2E8F0)),
                        _buildStatCol('$totalCorrectAnswers', 'To‘g‘ri'),
                        Container(height: 36, width: 1, color: const Color(0xFFE2E8F0)),
                        _buildStatCol('$accuracyPercent%', 'Aniqllik'),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Game Breakdown List
                  _buildBreakdownItem(
                    assetPath: 'assets/games/kosmik_icon.png',
                    fallbackIcon: Icons.rocket_launch_rounded,
                    title: 'Kosmik hisob',
                    subtitle: '9 / 10 ta to‘g‘ri javob',
                    reward: '+30 π',
                  ),

                  const SizedBox(height: 10),

                  _buildBreakdownItem(
                    assetPath: 'assets/games/fraction_icon.png',
                    fallbackIcon: Icons.pie_chart_rounded,
                    title: 'Kasrlar jangi',
                    subtitle: '9 / 10 ta to‘g‘ri javob',
                    reward: '+40 π',
                  ),

                  const SizedBox(height: 28),

                  // Primary Button: "Yana o‘ynash →"
                  SizedBox(
                    height: 54,
                    child: ElevatedButton(
                      onPressed: () {
                        if (isFraction) {
                          context.pushReplacement('/kids/games/fraction-battle');
                        } else {
                          context.pushReplacement('/kids/house-building');
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF6B42F5),
                        foregroundColor: Colors.white,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                        ),
                      ),
                      child: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Yana o‘ynash',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
                          ),
                          SizedBox(width: 8),
                          Icon(Icons.arrow_forward_rounded, size: 18),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 12),

                  // Secondary Button: "O‘yinlar markaziga qaytish"
                  SizedBox(
                    height: 52,
                    child: ElevatedButton(
                      onPressed: () => context.go('/kids/games'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFEDE9FE),
                        foregroundColor: const Color(0xFF6B42F5),
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                        ),
                      ),
                      child: const Text(
                        'O‘yinlar markaziga qaytish',
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
                      ),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Motivational Footer
                  const Center(
                    child: Text(
                      'O‘rganishda davom eting. Har bir urinish — yutuq!',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF94A3B8),
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCol(String value, String label) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.w900,
            color: Color(0xFF1E1B4B),
          ),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: const TextStyle(
            fontSize: 11.5,
            fontWeight: FontWeight.w600,
            color: Color(0xFF64748B),
          ),
        ),
      ],
    );
  }

  Widget _buildBreakdownItem({
    required String assetPath,
    required IconData fallbackIcon,
    required String title,
    required String subtitle,
    required String reward,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: const Color(0xFFF5F3FF),
              borderRadius: BorderRadius.circular(14),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(14),
              child: Image.asset(
                assetPath,
                fit: BoxFit.contain,
                errorBuilder: (_, __, ___) => Icon(fallbackIcon, color: const Color(0xFF7C5CF8), size: 24),
              ),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 14.5,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF0F172A),
                  ),
                ),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontSize: 11.5,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF94A3B8),
                  ),
                ),
              ],
            ),
          ),
          Text(
            reward,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w900,
              color: Color(0xFF854D0E),
            ),
          ),
        ],
      ),
    );
  }
}
