import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../core/constants/app_colors.dart';
import '../../shared/providers/student_provider.dart';

class AnalyticsScreen extends ConsumerWidget {
  const AnalyticsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final studentState = ref.watch(studentProvider);
    final student = studentState.student;

    final attempted = student?.attemptedQuestionCount ?? 15;
    final correct = student?.correctQuestionCount ?? 14;
    final lessons = 3 + (student?.level ?? 1);
    final totalXp = student?.totalXP ?? 380;
    final totalCoins = student?.coinBalance ?? 100;
    final accuracy = attempted > 0 ? ((correct / attempted) * 100).round() : 95;

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
          'Mening natijalarim',
          style: TextStyle(
            fontWeight: FontWeight.w800,
            fontSize: 18,
            color: AppColors.kidsDarkText,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Row 1: Attempted & Correct
            Row(
              children: [
                Expanded(
                  child: _buildMetricCard(
                    title: 'Yechilgan misollar',
                    value: '$attempted ta',
                    icon: Icons.assignment_turned_in_rounded,
                    color: AppColors.kidsPrimary,
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: _buildMetricCard(
                    title: 'To‘g‘ri javoblar',
                    value: '$correct ta',
                    icon: Icons.check_circle_rounded,
                    color: AppColors.kidsGreen,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),

            // Row 2: Accuracy & Total Coins
            Row(
              children: [
                Expanded(
                  child: _buildMetricCard(
                    title: 'Aniqlik foizi',
                    value: '$accuracy%',
                    icon: Icons.pie_chart_rounded,
                    color: const Color(0xFF6C5CE7),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: _buildMetricCard(
                    title: 'Jami oltin tangalar',
                    value: '$totalCoins',
                    icon: Icons.monetization_on_rounded,
                    color: const Color(0xFFFFB800),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),

            // Row 3: Total XP & Completed Lessons
            Row(
              children: [
                Expanded(
                  child: _buildMetricCard(
                    title: 'Jami to‘plangan XP',
                    value: '$totalXp XP',
                    icon: Icons.bolt_rounded,
                    color: AppColors.kidsOrange,
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: _buildMetricCard(
                    title: 'Tugatilgan darslar',
                    value: '$lessons ta',
                    icon: Icons.school_rounded,
                    color: const Color(0xFF00CEC9),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 22),

            // Weekly Learning Activity Chart
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppColors.kidsBorder, width: 1.5),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Haftalik faollik',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                      color: AppColors.kidsDarkText,
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Kunlar bo‘yicha yechilgan masalalar soni',
                    style: TextStyle(
                      fontSize: 12,
                      color: AppColors.kidsSecondaryText,
                    ),
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    height: 160,
                    child: BarChart(
                      BarChartData(
                        barGroups: [
                          _buildBar(0, 8),
                          _buildBar(1, 14),
                          _buildBar(2, (attempted / 3).clamp(4, 25).toDouble()),
                          _buildBar(3, 18),
                          _buildBar(4, 12),
                          _buildBar(5, 22),
                          _buildBar(6, 16),
                        ],
                        titlesData: FlTitlesData(
                          leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                          rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                          topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                          bottomTitles: AxisTitles(
                            sideTitles: SideTitles(
                              showTitles: true,
                              getTitlesWidget: (val, meta) {
                                const days = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];
                                if (val.toInt() >= 0 && val.toInt() < days.length) {
                                  return Padding(
                                    padding: const EdgeInsets.only(top: 8),
                                    child: Text(
                                      days[val.toInt()],
                                      style: const TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w700,
                                        color: AppColors.kidsSecondaryText,
                                      ),
                                    ),
                                  );
                                }
                                return const SizedBox();
                              },
                            ),
                          ),
                        ),
                        gridData: const FlGridData(show: false),
                        borderData: FlBorderData(show: false),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Subject Mastery Progress
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppColors.kidsBorder, width: 1.5),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Mavzular bo‘yicha o‘zlashtirish',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                      color: AppColors.kidsDarkText,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildSubjectRow('Arifmetika va Sonlar', 0.95, AppColors.kidsGreen),
                  const SizedBox(height: 12),
                  _buildSubjectRow('Oddiy va O‘nli kasrlar', 0.88, AppColors.kidsPrimary),
                  const SizedBox(height: 12),
                  _buildSubjectRow('Geometriya va Shakllar', 0.76, AppColors.kidsOrange),
                  const SizedBox(height: 12),
                  _buildSubjectRow('Tenglamalar va Mantiq', 0.70, const Color(0xFF6C5CE7)),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Recommendation Box
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: const Color(0xFFF3F0FF),
                borderRadius: BorderRadius.circular(22),
                border: Border.all(color: const Color(0xFFDED6FF), width: 1.5),
              ),
              child: const Row(
                children: [
                  Icon(Icons.auto_awesome_rounded, color: AppColors.kidsPrimary, size: 28),
                  SizedBox(width: 14),
                  Expanded(
                    child: Text(
                      'Siz arifmetika va kasrlarni a’lo darajada bajardingiz! Endi geometriya va fazoviy shakllar bo‘yicha mashqlarni sinab ko‘ring.',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.kidsDarkText,
                        height: 1.4,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  BarChartGroupData _buildBar(int x, double y) {
    return BarChartGroupData(
      x: x,
      barRods: [
        BarChartRodData(
          toY: y,
          color: AppColors.kidsPrimary,
          width: 16,
          borderRadius: BorderRadius.circular(8),
        ),
      ],
    );
  }

  Widget _buildMetricCard({
    required String title,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.kidsBorder, width: 1.5),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 26),
          const SizedBox(height: 10),
          Text(
            value,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w900,
              color: AppColors.kidsDarkText,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            title,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: AppColors.kidsSecondaryText,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSubjectRow(String title, double progress, Color color) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              title,
              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
            ),
            Text(
              '${(progress * 100).toInt()}%',
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: color),
            ),
          ],
        ),
        const SizedBox(height: 6),
        ClipRRect(
          borderRadius: BorderRadius.circular(6),
          child: LinearProgressIndicator(
            value: progress,
            minHeight: 7,
            backgroundColor: const Color(0xFFECEEFA),
            color: color,
          ),
        ),
      ],
    );
  }
}
