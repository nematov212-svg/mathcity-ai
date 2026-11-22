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
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';
  int? _selectedGrade; // null = Barchasi

  bool _isLoading = false;
  List<Map<String, dynamic>> _apiLessons = [];
  Timer? _autoSyncTimer;

  // Baseline flagship lessons
  final List<Map<String, dynamic>> _defaultTopics = [
    {
      'id': 'lesson-k4-01',
      'title': 'Oddiy kasrlar: Butunning bo‘laklari',
      'description': 'Surat, maxraj va teng bo‘laklar tushunchasi.',
      'grade': 4,
      'chapterTitle': 'Kasrlar',
      'rewardXP': 100,
      'rewardCoins': 10,
      'progress': 0.65,
      'isCompleted': false,
      'isLocked': false,
      'icon': '½',
      'accentColor': const Color(0xFF6C47FF),
    },
    {
      'id': 'lesson-k3-01',
      'title': 'Ko‘paytirish jadvali sirlari',
      'description': '1 dan 10 gacha karra jadvali va tezkor hisob.',
      'grade': 3,
      'chapterTitle': 'Arifmetika',
      'rewardXP': 120,
      'rewardCoins': 15,
      'progress': 0.80,
      'isCompleted': true,
      'isLocked': false,
      'icon': '×',
      'accentColor': const Color(0xFF059669),
    },
    {
      'id': 'lesson-k4-02',
      'title': 'Perimetr va Yuza hisoblash',
      'description': 'To‘rtburchak va shakllar perimetri hamda yuzasi.',
      'grade': 4,
      'chapterTitle': 'Geometriya',
      'rewardXP': 110,
      'rewardCoins': 12,
      'progress': 0.40,
      'isCompleted': false,
      'isLocked': false,
      'icon': '📐',
      'accentColor': const Color(0xFFD97706),
    },
    {
      'id': 'lesson-g7-01',
      'title': 'Chiziqli bir noma’lumli tenglamalar',
      'description': 'ax + b = c ko‘rinishidagi tenglamalarni yechish.',
      'grade': 7,
      'chapterTitle': 'Tenglamalar va Algebra',
      'rewardXP': 130,
      'rewardCoins': 15,
      'progress': 0.0,
      'isCompleted': false,
      'isLocked': false,
      'icon': 'x=',
      'accentColor': const Color(0xFFE11D48),
    },
    {
      'id': 'lesson-g6-01',
      'title': 'Foizlar: Sonning qismini topish',
      'description': 'Yuzdan bir qism ma’nosi va formulalar.',
      'grade': 6,
      'chapterTitle': 'Foizlar',
      'rewardXP': 115,
      'rewardCoins': 12,
      'progress': 0.0,
      'isCompleted': false,
      'isLocked': false,
      'icon': '%',
      'accentColor': const Color(0xFF0891B2),
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _fetchLessons();

    _autoSyncTimer = Timer.periodic(const Duration(seconds: 30), (_) {
      if (mounted) _fetchLessons(silent: true);
    });
  }

  @override
  void dispose() {
    _autoSyncTimer?.cancel();
    _searchController.dispose();
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
      final res = await ApiClient().dio.get('/lessons', queryParameters: {'mode': 'ALL'});
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

  Color _resolveCategoryColor(String category, dynamic customColor) {
    if (customColor is Color) return customColor;
    if (customColor is String && customColor.startsWith('#')) {
      final hex = customColor.replaceFirst('#', '');
      final val = int.tryParse('FF$hex', radix: 16);
      if (val != null) return Color(val);
    }

    final catLower = category.toLowerCase();
    if (catLower.contains('kasr')) return const Color(0xFF6C47FF);
    if (catLower.contains('arifmet') || catLower.contains('karra') || catLower.contains('hisob')) return const Color(0xFF059669);
    if (catLower.contains('geom')) return const Color(0xFFD97706);
    if (catLower.contains('tenglam') || catLower.contains('algeb')) return const Color(0xFFE11D48);
    if (catLower.contains('foiz')) return const Color(0xFF0891B2);
    return const Color(0xFF7C3AED);
  }

  String _resolveCategoryName(Map<String, dynamic> lesson) {
    final chapter = (lesson['chapterTitle'] ?? '').toString();
    if (chapter.isNotEmpty && chapter != 'Matematika' && chapter != 'Algebra') {
      return chapter;
    }
    final title = (lesson['title'] ?? '').toString().toLowerCase();
    if (title.contains('kasr')) return 'Kasrlar';
    if (title.contains('karra') || title.contains('jadval') || title.contains('qo‘shish') || title.contains('ayirish')) return 'Arifmetika';
    if (title.contains('shakl') || title.contains('perimetr') || title.contains('yuza') || title.contains('burchak')) return 'Geometriya';
    if (title.contains('tenglama') || title.contains('noma’lum')) return 'Tenglamalar';
    if (title.contains('foiz')) return 'Foizlar';
    return chapter.isNotEmpty ? chapter : 'Umumiy matematika';
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
          RefreshIndicator(
            onRefresh: _fetchLessons,
            color: colors.primary,
            child: _buildTopicsList(colors, isDark),
          ),
          const LessonMapContent(),
        ],
      ),
      bottomNavigationBar: const MathCityBottomNav(currentIndex: 1),
    );
  }

  Widget _buildTopicsList(AppThemeColors colors, bool isDark) {
    // 1. Merge default and API lessons uniquely
    final allLessons = <Map<String, dynamic>>[];
    allLessons.addAll(_defaultTopics);

    for (final apiL in _apiLessons) {
      final id = apiL['id']?.toString() ?? '';
      final idx = allLessons.indexWhere((l) => l['id'] == id);
      final item = {
        'id': id,
        'title': apiL['title'] ?? 'Yangi dars',
        'description': apiL['description'] ?? 'Matematika darsi',
        'grade': apiL['grade'] ?? 4,
        'chapterTitle': apiL['chapterTitle'] ?? 'Matematika',
        'rewardXP': apiL['rewardXP'] ?? 50,
        'rewardCoins': apiL['rewardCoins'] ?? 10,
        'progress': (apiL['isCompleted'] == true) ? 1.0 : 0.0,
        'isCompleted': apiL['isCompleted'] == true,
        'isLocked': apiL['isLocked'] == true,
        'icon': apiL['icon'] ?? '📚',
        'accentColor': apiL['accentColor'] != null
            ? _resolveCategoryColor('', apiL['accentColor'])
            : const Color(0xFF6366F1),
      };

      if (idx >= 0) {
        allLessons[idx] = item;
      } else {
        allLessons.add(item);
      }
    }

    // 2. Filter by Grade and Search Query
    final filtered = allLessons.filter((l) {
      final gradeMatch = _selectedGrade == null || l['grade'] == _selectedGrade;
      if (!gradeMatch) return false;

      if (_searchQuery.isEmpty) return true;
      final q = _searchQuery.toLowerCase();
      final title = (l['title'] ?? '').toString().toLowerCase();
      final desc = (l['description'] ?? '').toString().toLowerCase();
      final ch = (l['chapterTitle'] ?? '').toString().toLowerCase();
      return title.contains(q) || desc.contains(q) || ch.contains(q);
    }).toList();

    // 3. Group by Category
    final Map<String, List<Map<String, dynamic>>> grouped = {};
    for (final l in filtered) {
      final cat = _resolveCategoryName(l);
      grouped.putIfAbsent(cat, () => []).add(l);
    }

    return CustomScrollView(
      physics: const AlwaysScrollableScrollPhysics(parent: BouncingScrollPhysics()),
      slivers: [
        // Top search bar and grade filter chips
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Search Input
                Container(
                  decoration: BoxDecoration(
                    color: colors.card,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: colors.border, width: 1),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.03),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: TextField(
                    controller: _searchController,
                    onChanged: (val) {
                      setState(() {
                        _searchQuery = val.trim();
                      });
                    },
                    style: TextStyle(
                      color: colors.ink,
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                    decoration: InputDecoration(
                      hintText: 'Dars yoki mavzuni qidirish...',
                      hintStyle: TextStyle(
                        color: colors.muted,
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                      ),
                      prefixIcon: Icon(Icons.search_rounded, color: colors.primary, size: 22),
                      suffixIcon: _searchQuery.isNotEmpty
                          ? IconButton(
                              icon: Icon(Icons.clear_rounded, color: colors.muted, size: 18),
                              onPressed: () {
                                _searchController.clear();
                                setState(() => _searchQuery = '');
                              },
                            )
                          : null,
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    ),
                  ),
                ),
                const SizedBox(height: 12),

                // Grade Filter Chips (Horizontal Scroll)
                SizedBox(
                  height: 36,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: 12, // Barchasi + 1..11
                    separatorBuilder: (_, __) => const SizedBox(width: 8),
                    itemBuilder: (context, idx) {
                      final isAll = idx == 0;
                      final grade = isAll ? null : idx;
                      final isSelected = _selectedGrade == grade;

                      return GestureDetector(
                        onTap: () {
                          setState(() {
                            _selectedGrade = grade;
                          });
                        },
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                          decoration: BoxDecoration(
                            color: isSelected ? colors.primary : colors.card,
                            borderRadius: BorderRadius.circular(999),
                            border: Border.all(
                              color: isSelected ? colors.primary : colors.border,
                              width: 1,
                            ),
                            boxShadow: isSelected
                                ? [
                                    BoxShadow(
                                      color: colors.primary.withOpacity(0.25),
                                      blurRadius: 6,
                                      offset: const Offset(0, 2),
                                    ),
                                  ]
                                : null,
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            isAll ? 'Barchasi' : '$grade-sinf',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                              color: isSelected ? Colors.white : colors.ink,
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        ),

        // Skeleton loading state if fetching and empty
        if (_isLoading && _apiLessons.isEmpty)
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 0.82,
              ),
              delegate: SliverChildBuilderDelegate(
                (context, index) => _buildSkeletonCard(colors, isDark),
                childCount: 4,
              ),
            ),
          )
        else if (filtered.isEmpty)
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 60),
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 64,
                      height: 64,
                      decoration: BoxDecoration(
                        color: colors.primary.withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(Icons.search_off_rounded, color: colors.primary, size: 32),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Mos darslar topilmadi',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: colors.ink,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Boshqa sinf yoki kalit so‘z bilan qidirib ko‘ring.',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 12, color: colors.muted),
                    ),
                  ],
                ),
              ),
            ),
          )
        else
          // Grouped Categories
          ...grouped.entries.map((entry) {
            final categoryName = entry.key;
            final lessons = entry.value;
            final catColor = _resolveCategoryColor(categoryName, lessons.first['accentColor']);

            return SliverMainAxisGroup(
              slivers: [
                // Category Header
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(18, 16, 18, 8),
                    child: Row(
                      children: [
                        Container(
                          width: 10,
                          height: 10,
                          decoration: BoxDecoration(
                            color: catColor,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          categoryName,
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w900,
                            color: colors.ink,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: catColor.withOpacity(0.12),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            '${lessons.length}',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w800,
                              color: catColor,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                // Compact 2-column grid of lessons
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  sliver: SliverGrid(
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      childAspectRatio: 0.82,
                    ),
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        return _buildCompactLessonCard(lessons[index], colors, isDark, catColor);
                      },
                      childCount: lessons.length,
                    ),
                  ),
                ),
              ],
            );
          }),

        const SliverToBoxAdapter(
          child: SizedBox(height: 100),
        ),
      ],
    );
  }

  Widget _buildCompactLessonCard(
    Map<String, dynamic> lesson,
    AppThemeColors colors,
    bool isDark,
    Color catColor,
  ) {
    final title = (lesson['title'] ?? '').toString();
    final description = (lesson['description'] ?? '').toString();
    final grade = (lesson['grade'] as int?) ?? 4;
    final xp = (lesson['rewardXP'] as int?) ?? 50;
    final progress = (lesson['progress'] as double?) ?? 0.0;
    final isCompleted = lesson['isCompleted'] == true;
    final isLocked = lesson['isLocked'] == true;
    final icon = (lesson['icon'] ?? '📚').toString();
    final lessonId = lesson['id']?.toString() ?? '';

    return Container(
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: isCompleted
              ? const Color(0xFF10B981).withOpacity(0.4)
              : isLocked
                  ? colors.border.withOpacity(0.5)
                  : catColor.withOpacity(0.25),
          width: 1.2,
        ),
        boxShadow: [
          BoxShadow(
            color: isDark ? Colors.black26 : catColor.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(18),
          onTap: isLocked
              ? () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Bu dars hozircha qulflangan. Oldingi darslarni bajaring!'),
                      duration: Duration(seconds: 2),
                    ),
                  );
                }
              : () {
                  context.push('/kids/lesson/$lessonId');
                },
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Row: Math symbol icon + Badges (Grade & XP & Status)
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [catColor, catColor.withOpacity(0.8)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(
                            color: catColor.withOpacity(0.25),
                            blurRadius: 6,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        icon,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ),
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        if (isCompleted)
                          Container(
                            padding: const EdgeInsets.all(4),
                            decoration: const BoxDecoration(
                              color: Color(0xFFECFDF5),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.check_rounded, color: Color(0xFF059669), size: 14),
                          )
                        else if (isLocked)
                          Container(
                            padding: const EdgeInsets.all(4),
                            decoration: BoxDecoration(
                              color: colors.border.withOpacity(0.5),
                              shape: BoxShape.circle,
                            ),
                            child: Icon(Icons.lock_rounded, color: colors.muted, size: 14),
                          )
                        else
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: const Color(0xFFFFF7ED),
                              borderRadius: BorderRadius.circular(999),
                              border: Border.all(color: const Color(0xFFFED7AA), width: 0.8),
                            ),
                            child: Text(
                              '+$xp XP',
                              style: const TextStyle(
                                color: Color(0xFFD97706),
                                fontSize: 9,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 8),

                // Grade Pill
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: catColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    '$grade-sinf',
                    style: TextStyle(
                      color: catColor,
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
                const SizedBox(height: 6),

                // 1-line Title
                Text(
                  title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    color: colors.ink,
                    height: 1.2,
                  ),
                ),
                const SizedBox(height: 2),

                // 1-line Description
                Text(
                  description,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                    color: colors.muted,
                  ),
                ),
                const Spacer(),

                // Progress Bar
                ClipRRect(
                  borderRadius: BorderRadius.circular(999),
                  child: LinearProgressIndicator(
                    value: isCompleted ? 1.0 : progress,
                    backgroundColor: colors.border,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      isCompleted ? const Color(0xFF10B981) : catColor,
                    ),
                    minHeight: 4,
                  ),
                ),
                const SizedBox(height: 8),

                // Prominent "Boshlash" or "Ko‘rish" Button
                SizedBox(
                  width: double.infinity,
                  height: 32,
                  child: ElevatedButton(
                    onPressed: isLocked
                        ? null
                        : () {
                            context.push('/kids/lesson/$lessonId');
                          },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isCompleted
                          ? const Color(0xFF10B981)
                          : isLocked
                              ? colors.border
                              : catColor,
                      foregroundColor: Colors.white,
                      disabledBackgroundColor: colors.border.withOpacity(0.6),
                      disabledForegroundColor: colors.muted,
                      elevation: 0,
                      padding: EdgeInsets.zero,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: Text(
                      isCompleted
                          ? '✓ Qayta ko‘rish'
                          : isLocked
                              ? '🔒 Qulflangan'
                              : 'Boshlash',
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSkeletonCard(AppThemeColors colors, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: colors.border, width: 1),
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
                  color: colors.border,
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              Container(
                width: 48,
                height: 16,
                decoration: BoxDecoration(
                  color: colors.border,
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Container(
            width: double.infinity,
            height: 14,
            decoration: BoxDecoration(
              color: colors.border,
              borderRadius: BorderRadius.circular(6),
            ),
          ),
          const SizedBox(height: 6),
          Container(
            width: 80,
            height: 10,
            decoration: BoxDecoration(
              color: colors.border,
              borderRadius: BorderRadius.circular(6),
            ),
          ),
          const Spacer(),
          Container(
            width: double.infinity,
            height: 4,
            decoration: BoxDecoration(
              color: colors.border,
              borderRadius: BorderRadius.circular(999),
            ),
          ),
          const SizedBox(height: 8),
          Container(
            width: double.infinity,
            height: 32,
            decoration: BoxDecoration(
              color: colors.border,
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        ],
      ),
    );
  }
}

extension _ListFilter<T> on List<T> {
  Iterable<T> filter(bool Function(T element) test) sync* {
    for (final element in this) {
      if (test(element)) yield element;
    }
  }
}
