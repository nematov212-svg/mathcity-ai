import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../core/constants/app_colors.dart';

class TeenAnalyticsScreen extends StatelessWidget {
  const TeenAnalyticsScreen({super.key});

  @override
  Widget build(BuildContext context) {
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
          'Akademik tahlil',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w800,
            fontSize: 18,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // KPI Tiles
            Row(
              children: [
                Expanded(
                  child: _buildTile(
                    title: 'O‘zlashtirish',
                    value: '92.4%',
                    color: AppColors.teenPrimaryLime,
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: _buildTile(
                    title: 'Yechilgan masalalar',
                    value: '148 ta',
                    color: const Color(0xFF00CEC9),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Performance Chart
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.teenSurface,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.teenBorder),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Haftalik ko‘rsatkichlar',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Kunlik to‘g‘ri yechilgan algebra va geometriya masalalari',
                    style:
                        TextStyle(fontSize: 12, color: AppColors.teenMutedText),
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    height: 160,
                    child: BarChart(
                      BarChartData(
                        barGroups: [
                          _buildBar(0, 12),
                          _buildBar(1, 18),
                          _buildBar(2, 10),
                          _buildBar(3, 24),
                          _buildBar(4, 16),
                          _buildBar(5, 28),
                          _buildBar(6, 20),
                        ],
                        titlesData: FlTitlesData(
                          leftTitles: const AxisTitles(
                              sideTitles: SideTitles(showTitles: false)),
                          rightTitles: const AxisTitles(
                              sideTitles: SideTitles(showTitles: false)),
                          topTitles: const AxisTitles(
                              sideTitles: SideTitles(showTitles: false)),
                          bottomTitles: AxisTitles(
                            sideTitles: SideTitles(
                              showTitles: true,
                              getTitlesWidget: (val, meta) {
                                const days = [
                                  'Du',
                                  'Se',
                                  'Ch',
                                  'Pa',
                                  'Ju',
                                  'Sh',
                                  'Ya'
                                ];
                                if (val.toInt() >= 0 &&
                                    val.toInt() < days.length) {
                                  return Padding(
                                    padding: const EdgeInsets.only(top: 8),
                                    child: Text(
                                      days[val.toInt()],
                                      style: const TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w600,
                                        color: AppColors.teenMutedText,
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

            // Subject Matrix
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.teenSurface,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.teenBorder),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Yo‘nalishlar matritsasi',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildSubjectBar('Algebra va Kvadrat tenglamalar', 0.94,
                      AppColors.teenPrimaryLime),
                  const SizedBox(height: 12),
                  _buildSubjectBar('Geometriya va Pifagor teoremasi', 0.88,
                      const Color(0xFF00CEC9)),
                  const SizedBox(height: 12),
                  _buildSubjectBar('Funksiyalar va Grafiklar', 0.78,
                      const Color(0xFF6C5CE7)),
                  const SizedBox(height: 12),
                  _buildSubjectBar(
                      'Trigonometriya ayniyatlari', 0.65, Colors.amber),
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
          color: AppColors.teenPrimaryLime,
          width: 14,
          borderRadius: BorderRadius.circular(6),
        ),
      ],
    );
  }

  Widget _buildTile(
      {required String title, required String value, required Color color}) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.teenSurface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.teenBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            value,
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w900,
              color: color,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            title,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: AppColors.teenMutedText,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSubjectBar(String title, double progress, Color color) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              title,
              style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: Colors.white),
            ),
            Text(
              '${(progress * 100).toInt()}%',
              style: TextStyle(
                  fontSize: 13, fontWeight: FontWeight.w800, color: color),
            ),
          ],
        ),
        const SizedBox(height: 6),
        ClipRRect(
          borderRadius: BorderRadius.circular(6),
          child: LinearProgressIndicator(
            value: progress,
            minHeight: 6,
            backgroundColor: const Color(0xFF1E273D),
            color: color,
          ),
        ),
      ],
    );
  }
}
