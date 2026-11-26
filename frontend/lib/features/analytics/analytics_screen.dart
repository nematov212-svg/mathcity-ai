import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../core/theme/app_theme.dart';
import '../../shared/providers/student_provider.dart';

class AnalyticsScreen extends ConsumerStatefulWidget {
  const AnalyticsScreen({super.key});

  @override
  ConsumerState<AnalyticsScreen> createState() => _AnalyticsScreenState();
}

class _AnalyticsScreenState extends ConsumerState<AnalyticsScreen> {
  bool _isLoading = true;
  Map<String, dynamic>? _statsData;

  @override
  void initState() {
    super.initState();
    _loadStats();
  }

  Future<void> _loadStats() async {
    final data = await ref.read(studentProvider.notifier).fetchLearningStats();
    if (!mounted) return;
    setState(() {
      _statsData = data;
      _isLoading = false;
    });
  }

  Color _parseColor(String? hexString, Color fallback) {
    if (hexString == null || hexString.isEmpty) return fallback;
    try {
      final hex = hexString.replaceAll('#', '');
      return Color(int.parse('FF$hex', radix: 16));
    } catch (_) {
      return fallback;
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);
    final student = ref.watch(studentProvider).student;

    final attempted = _statsData?['attemptedQuestions'] ??
        student?.attemptedQuestionCount ??
        0;
    final accuracy =
        _statsData?['accuracyPercentage'] ?? student?.accuracyPercentage ?? 100;
    final studyMinutes =
        _statsData?['studyMinutesTotal'] ?? student?.studyMinutes ?? 0;
    final longestStreak =
        _statsData?['longestStreak'] ?? student?.longestStreak ?? 1;
    final totalCoins = _statsData?['totalCoins'] ?? student?.coinBalance ?? 0;
    final level = _statsData?['level'] ?? student?.level ?? 1;

    final weeklyList = _statsData?['weeklyActivity'] is List
        ? List<Map<String, dynamic>>.from(_statsData!['weeklyActivity'])
        : <Map<String, dynamic>>[];

    final topicMastery = _statsData?['topicMastery'] is List
        ? List<Map<String, dynamic>>.from(_statsData!['topicMastery'])
        : <Map<String, dynamic>>[];

    final nextLesson = _statsData?['nextLesson'] as Map<String, dynamic>?;

    return Scaffold(
      backgroundColor: colors.bg,
      appBar: AppBar(
        backgroundColor: colors.card,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new_rounded, color: colors.ink),
          onPressed: () => context.pop(),
        ),
        title: Text(
          'Mening natijalarim',
          style: TextStyle(
            fontWeight: FontWeight.w800,
            fontSize: 18,
            color: colors.ink,
          ),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadStats,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Section Title
                    Text(
                      'Asosiy ko‘rsatkichlar',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: colors.ink,
                      ),
                    ),
                    const SizedBox(height: 12),

                    // 6 KPI Cards (2x3 Grid)
                    Row(
                      children: [
                        Expanded(
                          child: _buildKpiCard(
                            title: 'Jami misollar',
                            value: '$attempted',
                            icon: Icons.calculate_rounded,
                            iconColor: const Color(0xFF6C47FF),
                            iconBg: const Color(0xFFEDE8FF),
                            colors: colors,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildKpiCard(
                            title: 'Aniqlik foizi',
                            value: '$accuracy%',
                            icon: Icons.check_circle_rounded,
                            iconColor: const Color(0xFF10B981),
                            iconBg: const Color(0xFFE1F6EC),
                            colors: colors,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: _buildKpiCard(
                            title: 'O‘rganish vaqti',
                            value: '$studyMinutes min',
                            icon: Icons.access_time_rounded,
                            iconColor: const Color(0xFF3B82F6),
                            iconBg: const Color(0xFFE5EEFF),
                            colors: colors,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildKpiCard(
                            title: 'Eng uzun seriya',
                            value: '$longestStreak kun',
                            icon: Icons.local_fire_department_rounded,
                            iconColor: const Color(0xFFE5611B),
                            iconBg: const Color(0xFFFFE9DB),
                            colors: colors,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: _buildKpiCard(
                            title: 'Olingan tangalar',
                            value: '$totalCoins',
                            icon: Icons.monetization_on_rounded,
                            iconColor: const Color(0xFFF59E0B),
                            iconBg: const Color(0xFFFFF1D6),
                            colors: colors,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildKpiCard(
                            title: 'Joriy daraja',
                            value: '$level-bosqich',
                            icon: Icons.military_tech_rounded,
                            iconColor: const Color(0xFF8B5CF6),
                            iconBg: const Color(0xFFF3E8FF),
                            colors: colors,
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 24),

                    // Weekly Activity Chart Card
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: colors.card,
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: colors.border, width: 1.2),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Haftalik yechilgan misollar',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w800,
                                  color: colors.ink,
                                ),
                              ),
                              const Icon(Icons.bar_chart_rounded,
                                  color: Color(0xFF6C47FF)),
                            ],
                          ),
                          const SizedBox(height: 20),
                          SizedBox(
                            height: 160,
                            child: BarChart(
                              BarChartData(
                                alignment: BarChartAlignment.spaceAround,
                                maxY: _calculateMaxBar(weeklyList),
                                barTouchData: BarTouchData(
                                  touchTooltipData: BarTouchTooltipData(
                                    getTooltipItem:
                                        (group, groupIndex, rod, rodIndex) {
                                      final day = groupIndex < weeklyList.length
                                          ? weeklyList[groupIndex]['dayKey']
                                          : '';
                                      return BarTooltipItem(
                                        '$day: ${rod.toY.toInt()} ta',
                                        const TextStyle(
                                            color: Colors.white,
                                            fontWeight: FontWeight.bold),
                                      );
                                    },
                                  ),
                                ),
                                barGroups:
                                    List.generate(weeklyList.length, (i) {
                                  final count =
                                      (weeklyList[i]['count'] ?? 0) as int;
                                  final isToday =
                                      weeklyList[i]['isToday'] == true;
                                  return BarChartGroupData(
                                    x: i,
                                    barRods: [
                                      BarChartRodData(
                                        toY: count.toDouble(),
                                        color: isToday
                                            ? const Color(0xFF6C47FF)
                                            : const Color(0xFFC4B5FD),
                                        width: 20,
                                        borderRadius:
                                            const BorderRadius.vertical(
                                                top: Radius.circular(8)),
                                      ),
                                    ],
                                  );
                                }),
                                titlesData: FlTitlesData(
                                  leftTitles: const AxisTitles(
                                      sideTitles:
                                          SideTitles(showTitles: false)),
                                  rightTitles: const AxisTitles(
                                      sideTitles:
                                          SideTitles(showTitles: false)),
                                  topTitles: const AxisTitles(
                                      sideTitles:
                                          SideTitles(showTitles: false)),
                                  bottomTitles: AxisTitles(
                                    sideTitles: SideTitles(
                                      showTitles: true,
                                      getTitlesWidget: (val, meta) {
                                        final idx = val.toInt();
                                        if (idx >= 0 &&
                                            idx < weeklyList.length) {
                                          final isToday = weeklyList[idx]
                                                  ['isToday'] ==
                                              true;
                                          return Padding(
                                            padding:
                                                const EdgeInsets.only(top: 8),
                                            child: Text(
                                              weeklyList[idx]['dayKey'] ?? '',
                                              style: TextStyle(
                                                fontSize: 12,
                                                fontWeight: isToday
                                                    ? FontWeight.w800
                                                    : FontWeight.w600,
                                                color: isToday
                                                    ? colors.primary
                                                    : colors.muted,
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

                    const SizedBox(height: 24),

                    // Topic Mastery Section
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: colors.card,
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: colors.border, width: 1.2),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Mavzular bo‘yicha o‘zlashtirish',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w800,
                              color: colors.ink,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            '0.6 * (darslar) + 0.4 * (aniqlik)',
                            style: TextStyle(
                              fontSize: 12,
                              color: colors.muted,
                            ),
                          ),
                          const SizedBox(height: 16),
                          if (topicMastery.isEmpty)
                            Padding(
                              padding: const EdgeInsets.symmetric(vertical: 20),
                              child: Center(
                                child: Text(
                                  'Hozircha darslar boshlanmagan.',
                                  style: TextStyle(
                                      color: colors.muted, fontSize: 13),
                                ),
                              ),
                            )
                          else
                            ...topicMastery.map((topic) {
                              final mastery =
                                  (topic['masteryPercentage'] ?? 0) as int;
                              final statusLabel = (topic['statusLabel'] ??
                                  'Boshlanmagan') as String;
                              final statusColor = _parseColor(
                                  topic['statusColor'],
                                  const Color(0xFF6C47FF));
                              final total = topic['totalLessons'] ?? 1;
                              final completed = topic['completedLessons'] ?? 0;

                              return Container(
                                margin: const EdgeInsets.only(bottom: 14),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Expanded(
                                          child: Text(
                                            topic['chapterTitle'] ?? '',
                                            style: TextStyle(
                                              fontSize: 14,
                                              fontWeight: FontWeight.w700,
                                              color: colors.ink,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                              horizontal: 8, vertical: 3),
                                          decoration: BoxDecoration(
                                            color:
                                                statusColor.withOpacity(0.12),
                                            borderRadius:
                                                BorderRadius.circular(8),
                                          ),
                                          child: Text(
                                            '$mastery% · $statusLabel',
                                            style: TextStyle(
                                              fontSize: 11,
                                              fontWeight: FontWeight.w800,
                                              color: statusColor,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 6),
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(4),
                                      child: LinearProgressIndicator(
                                        value:
                                            (mastery / 100.0).clamp(0.0, 1.0),
                                        minHeight: 7,
                                        backgroundColor: colors.field,
                                        color: statusColor,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      '$completed / $total dars yakunlangan',
                                      style: TextStyle(
                                        fontSize: 11,
                                        color: colors.muted,
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            }),
                        ],
                      ),
                    ),

                    if (nextLesson != null) ...[
                      const SizedBox(height: 20),
                      Container(
                        padding: const EdgeInsets.all(18),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF3F0FF),
                          borderRadius: BorderRadius.circular(22),
                          border: Border.all(
                              color: const Color(0xFFDED6FF), width: 1.5),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.auto_awesome_rounded,
                                color: Color(0xFF6C47FF), size: 28),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Tavsiya etilgan dars',
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w800,
                                      color: Color(0xFF6C47FF),
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    nextLesson['title'] ?? 'Navbatdagi dars',
                                    style: TextStyle(
                                      fontSize: 15,
                                      fontWeight: FontWeight.w800,
                                      color: colors.ink,
                                    ),
                                  ),
                                  Text(
                                    nextLesson['chapterTitle'] ?? '',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: colors.muted,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF6C47FF),
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 14, vertical: 8),
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12)),
                              ),
                              onPressed: () {
                                context
                                    .push('/kids/lesson/${nextLesson['id']}');
                              },
                              child: const Text('Boshlash',
                                  style: TextStyle(
                                      fontWeight: FontWeight.w800,
                                      fontSize: 12)),
                            ),
                          ],
                        ),
                      ),
                    ],
                    const SizedBox(height: 30),
                  ],
                ),
              ),
            ),
    );
  }

  double _calculateMaxBar(List<Map<String, dynamic>> list) {
    double maxVal = 10;
    for (final item in list) {
      final count = (item['count'] ?? 0) as num;
      if (count > maxVal) maxVal = count.toDouble();
    }
    return maxVal + 5;
  }

  Widget _buildKpiCard({
    required String title,
    required String value,
    required IconData icon,
    required Color iconColor,
    required Color iconBg,
    required AppThemeColors colors,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: colors.border, width: 1.2),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: iconBg,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: iconColor, size: 20),
              ),
              Text(
                value,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                  color: colors.ink,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            title,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: colors.muted,
            ),
          ),
        ],
      ),
    );
  }
}
