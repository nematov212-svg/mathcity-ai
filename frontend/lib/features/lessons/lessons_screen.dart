import 'dart:async';
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/network/api_client.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/coin_badge.dart';
import '../../core/widgets/mathcity_bottom_nav.dart';
import '../../shared/providers/student_provider.dart';
import 'lesson_map_screen.dart';

class LessonsScreen extends ConsumerStatefulWidget {
  const LessonsScreen({super.key});

  @override
  ConsumerState<LessonsScreen> createState() => _LessonsScreenState();
}

class _LessonsScreenState extends ConsumerState<LessonsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _isLoading = false;
  List<Map<String, dynamic>> _apiLessons = [];
  Timer? _autoSyncTimer;

  // Flagship 3 baseline topics
  final List<Map<String, dynamic>> _defaultTopics = [
    {
      'id': 'lesson-k4-01',
      'title': 'Oddiy kasrlar: Butunning bo‘laklari',
      'description': 'Butun va uning teng bo‘laklari, surat va maxraj, diagrammalar.',
      'grade': 4,
      'rewardXP': 100,
      'rewardCoins': 10,
      'progress': 0.65,
      'icon': '½',
      'gradient': [const Color(0xFF6C47FF), const Color(0xFF8B6BFF)],
      'accentColor': const Color(0xFF6C47FF),
    },
    {
      'id': 'lesson-k3-01',
      'title': 'Ko‘paytirish jadvali: Karra jadvali sirlari',
      'description': '1 dan 10 gacha karra jadvalining oson va tezkor hisoblash usullari.',
      'grade': 3,
      'rewardXP': 120,
      'rewardCoins': 15,
      'progress': 0.80,
      'icon': '×',
      'gradient': [const Color(0xFF059669), const Color(0xFF10B981)],
      'accentColor': const Color(0xFF059669),
    },
    {
      'id': 'lesson-k4-02',
      'title': 'Geometrik shakllar: Perimetr va Yuza',
      'description': 'Kvadrat, to‘g‘ri to‘rtburchak va shakllarning perimetri va yuzasi.',
      'grade': 4,
      'rewardXP': 110,
      'rewardCoins': 12,
      'progress': 0.40,
      'icon': '📐',
      'gradient': [const Color(0xFFD97706), const Color(0xFFF59E0B)],
      'accentColor': const Color(0xFFD97706),
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _fetchLessons();

    // 30-second background check for newly published lessons
    _autoSyncTimer = Timer.periodic(const Duration(seconds: 30), (_) {
      if (mounted) _fetchLessons(silent: true);
    });
  }

  @override
  void dispose() {
    _autoSyncTimer?.cancel();
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _fetchLessons({bool silent = false}) async {
    final isTest = !kIsWeb && Platform.environment.containsKey('FLUTTER_TEST');
    if (isTest) return;

    if (!silent) {
      setState(() => _isLoading = true);
    }
    try {
      final res = await ApiClient().dio.get('/lessons', queryParameters: {'mode': 'KIDS'});
      if (res.data != null && res.data['success'] == true) {
        final list = List<Map<String, dynamic>>.from(res.data['data'] ?? []);
        if (mounted) {
          setState(() {
            _apiLessons = list;
            _isLoading = false;
          });
        }
        return;
      }
    } catch (_) {}

    if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final studentState = ref.watch(studentProvider);
    final student = studentState.student;
    final coins = student?.coinBalance ?? 0;

    return Scaffold(
      backgroundColor: colors.bg,
      appBar: AppBar(
        backgroundColor: colors.card,
        elevation: 0,
        title: Text(
          'Darslar',
          style: TextStyle(
            fontWeight: FontWeight.w900,
            fontSize: 20,
            color: colors.ink,
          ),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Center(
              child: CoinBadge(count: coins, size: 24),
            ),
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          labelColor: colors.primary,
          unselectedLabelColor: colors.muted,
          indicatorColor: colors.primary,
          indicatorWeight: 3,
          labelStyle: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14),
          unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
          tabs: const [
            Tab(text: 'Mavzular ro‘yxati'),
            Tab(text: 'Darslar xaritasi'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // 1. Mavzular ro'yxati (List of Topics with Pull-to-Refresh)
          RefreshIndicator(
            onRefresh: _fetchLessons,
            color: colors.primary,
            child: _buildTopicsList(colors, isDark),
          ),

          // 2. Darslar xaritasi (Visual Road Map)
          const LessonMapContent(),
        ],
      ),
      bottomNavigationBar: const MathCityBottomNav(currentIndex: 1),
    );
  }

  Widget _buildTopicsList(AppThemeColors colors, bool isDark) {
    // Merge dynamic API lessons with baseline topics
    final displayedTopics = <Map<String, dynamic>>[];

    // Add baseline flagship topics first
    displayedTopics.addAll(_defaultTopics);

    // Merge any additional custom lessons created from Admin Panel
    for (final apiL in _apiLessons) {
      final id = apiL['id']?.toString() ?? '';
      // If not already in default topics, append it dynamically
      if (!displayedTopics.any((t) => t['id'] == id)) {
        displayedTopics.add({
          'id': id,
          'title': apiL['title'] ?? 'Yangi dars',
          'description': apiL['description'] ?? 'Admin tomonidan qo‘shilgan yangi dars.',
          'grade': apiL['grade'] ?? 4,
          'rewardXP': apiL['rewardXP'] ?? 50,
          'rewardCoins': apiL['rewardCoins'] ?? 10,
          'progress': (apiL['isCompleted'] == true) ? 1.0 : 0.0,
          'icon': '📚',
          'gradient': [const Color(0xFF6366F1), const Color(0xFF818CF8)],
          'accentColor': const Color(0xFF6366F1),
        });
      }
    }

    return ListView(
      physics: const AlwaysScrollableScrollPhysics(parent: BouncingScrollPhysics()),
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 100),
      children: [
        // Top banner: Curriculum description
        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: isDark
                  ? [const Color(0xFF1E1648), const Color(0xFF2A1F66)]
                  : [const Color(0xFFECE9FE), const Color(0xFFF5F3FF)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: colors.primary.withOpacity(0.2), width: 1.2),
          ),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: colors.primary,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Center(
                  child: Icon(Icons.menu_book_rounded, color: Colors.white, size: 26),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Asosiy darsliklar',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w900,
                        color: colors.ink,
                      ),
                    ),
                    const SizedBox(height: 3),
                    Text(
                      'Har bir mavzuni o‘rganing, misollar yeching va tangalar to‘plang!',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: colors.muted,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        if (_isLoading)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 24),
            child: Center(child: CircularProgressIndicator.adaptive()),
          ),

        // Flagship Cards + Admin Panel Lessons
        ...displayedTopics.map((topic) => _buildTopicCard(topic, colors, isDark)),
      ],
    );
  }

  Widget _buildTopicCard(Map<String, dynamic> topic, AppThemeColors colors, bool isDark) {
    final title = topic['title'] as String;
    final description = topic['description'] as String;
    final grade = topic['grade'] as int;
    final xp = topic['rewardXP'] as int;
    final coinReward = topic['rewardCoins'] as int;
    final progress = (topic['progress'] as double?) ?? 0.0;
    final icon = topic['icon'] as String;
    final gradient = topic['gradient'] as List<Color>;
    final lessonId = topic['id'] as String;

    return Container(
      margin: const EdgeInsets.only(bottom: 18),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(26),
        border: Border.all(color: colors.border, width: 1.2),
        boxShadow: [
          BoxShadow(
            color: isDark ? Colors.black26 : const Color(0xFF7154EC).withOpacity(0.06),
            blurRadius: 18,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(26),
          onTap: () {
            context.push('/kids/lesson/$lessonId');
          },
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top row: Math symbol icon + Class badge + Coin reward
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: gradient,
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(18),
                        boxShadow: [
                          BoxShadow(
                            color: gradient.first.withOpacity(0.3),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Center(
                        child: Text(
                          icon,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ),
                    ),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: colors.primary.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(999),
                          ),
                          child: Text(
                            '$grade-sinf',
                            style: TextStyle(
                              color: colors.primary,
                              fontSize: 12,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFFF7ED),
                            borderRadius: BorderRadius.circular(999),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(Icons.stars_rounded, color: Color(0xFFF59E0B), size: 14),
                              const SizedBox(width: 4),
                              Text(
                                '+$xp XP',
                                style: const TextStyle(
                                  color: Color(0xFFD97706),
                                  fontSize: 11,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Title & Subtitle
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w900,
                    color: colors.ink,
                  ),
                ),
                const SizedBox(height: 5),
                Text(
                  description,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    color: colors.muted,
                  ),
                ),
                const SizedBox(height: 16),

                // Progress Bar
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'O‘zlashtirish',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: colors.muted,
                      ),
                    ),
                    Text(
                      '${(progress * 100).toInt()}%',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        color: colors.ink,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                ClipRRect(
                  borderRadius: BorderRadius.circular(999),
                  child: LinearProgressIndicator(
                    value: progress,
                    backgroundColor: colors.border,
                    valueColor: AlwaysStoppedAnimation<Color>(gradient.first),
                    minHeight: 8,
                  ),
                ),
                const SizedBox(height: 14),

                // Bottom Action Row
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.monetization_on_rounded, color: Color(0xFFF59E0B), size: 16),
                        const SizedBox(width: 4),
                        Text(
                          '+$coinReward tanga',
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFFD97706),
                          ),
                        ),
                      ],
                    ),
                    Row(
                      children: [
                        Text(
                          'Darsni boshlash',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w800,
                            color: colors.primary,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Icon(
                          Icons.arrow_forward_rounded,
                          size: 16,
                          color: colors.primary,
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
