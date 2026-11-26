import 'dart:async';
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/network/api_client.dart';
import '../../core/responsive/app_responsive_scaffold.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/coin_badge.dart';
import '../../core/widgets/animated_math_background.dart';
import '../../core/widgets/kids_shell_layout.dart';
import '../../core/widgets/mathcity_bottom_nav.dart';
import '../../core/widgets/xp_coin.dart';
import '../../shared/providers/student_provider.dart';

class LessonsScreen extends ConsumerStatefulWidget {
  const LessonsScreen({super.key});

  @override
  ConsumerState<LessonsScreen> createState() => _LessonsScreenState();
}

class _LessonsScreenState extends ConsumerState<LessonsScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';
  int? _selectedGrade;

  bool _isLoading = false;
  List<Map<String, dynamic>> _apiLessons = [];
  Timer? _autoSyncTimer;

  // Baseline starter lessons
  final List<Map<String, dynamic>> _defaultTopics = [
    {
      'id': 'lesson-k1-01',
      'title': '1 dan 10 gacha sonlar va sanash',
      'description':
          'Narsalarni sanash, sonlar ketma-ketligi va taqqoslash asoslari.',
      'grade': 1,
      'chapterTitle': 'Boshlang‘ich hisob',
      'rewardXP': 80,
      'rewardCoins': 10,
      'progress': 1.0,
      'isCompleted': true,
      'isLocked': false,
      'icon': '123',
      'accentColor': const Color(0xFF10B981),
    },
    {
      'id': 'lesson-k2-01',
      'title': '20 ichida qo‘shish va ayirish',
      'description': 'O‘nlikdan oshirib qo‘shish va qulay ayirish usullari.',
      'grade': 2,
      'chapterTitle': 'Arifmetika',
      'rewardXP': 90,
      'rewardCoins': 10,
      'progress': 0.75,
      'isCompleted': false,
      'isLocked': false,
      'icon': '±',
      'accentColor': const Color(0xFF3B82F6),
    },
    {
      'id': 'lesson-k3-01',
      'title': 'Ko‘paytirish jadvali: Karra jadvali sirlari',
      'description':
          '1 dan 10 gacha bo‘lgan karra jadvalining oson va tez hisoblash usullari.',
      'grade': 3,
      'chapterTitle': 'Ko‘paytirish va Bo‘lish',
      'rewardXP': 120,
      'rewardCoins': 15,
      'progress': 0.80,
      'isCompleted': true,
      'isLocked': false,
      'icon': '×',
      'accentColor': const Color(0xFF059669),
    },
    {
      'id': 'lesson-k4-01',
      'title': 'Oddiy kasrlar: Butunning bo‘laklari',
      'description':
          'Surat, maxraj va teng bo‘laklar tushunchasi hamda taqqoslash.',
      'grade': 4,
      'chapterTitle': 'Kasrlar va Bo‘laklar',
      'rewardXP': 100,
      'rewardCoins': 10,
      'progress': 0.65,
      'isCompleted': false,
      'isLocked': false,
      'icon': '½',
      'accentColor': const Color(0xFF6C47FF),
    },
    {
      'id': 'lesson-k4-02',
      'title': 'Perimetr va Yuza hisoblash asoslari',
      'description':
          'To‘g‘ri to‘rtburchak va kvadrat perimetri hamda yuzasi formulalari.',
      'grade': 4,
      'chapterTitle': 'Geometriya asoslari',
      'rewardXP': 110,
      'rewardCoins': 12,
      'progress': 0.40,
      'isCompleted': false,
      'isLocked': false,
      'icon': '📐',
      'accentColor': const Color(0xFFD97706),
    },
    {
      'id': 'lesson-g5-01',
      'title': 'O‘nli kasrlar va ular ustida amallar',
      'description':
          'Vergul bilan yozish, o‘nli kasrlarni qo‘shish, ayirish va ko‘paytirish.',
      'grade': 5,
      'chapterTitle': 'Kasrlar',
      'rewardXP': 115,
      'rewardCoins': 12,
      'progress': 0.0,
      'isCompleted': false,
      'isLocked': false,
      'icon': '0.5',
      'accentColor': const Color(0xFF8B5CF6),
    },
    {
      'id': 'lesson-g6-01',
      'title': 'Foizlar: Sonning foizini topish',
      'description':
          'Yuzdan bir qism ma’nosi, hayotiy foiz masalalari va formulalar.',
      'grade': 6,
      'chapterTitle': 'Foizlar va Nisbatlar',
      'rewardXP': 120,
      'rewardCoins': 15,
      'progress': 0.0,
      'isCompleted': false,
      'isLocked': false,
      'icon': '%',
      'accentColor': const Color(0xFF0891B2),
    },
    {
      'id': 'lesson-g7-01',
      'title': 'Chiziqli bir noma’lumli tenglamalar',
      'description':
          'ax + b = c ko‘rinishidagi tenglamalarni yechish va ildizni topish.',
      'grade': 7,
      'chapterTitle': 'Algebra va Tenglamalar',
      'rewardXP': 130,
      'rewardCoins': 15,
      'progress': 0.0,
      'isCompleted': false,
      'isLocked': false,
      'icon': 'x=',
      'accentColor': const Color(0xFFE11D48),
    },
    {
      'id': 'lesson-g8-01',
      'title': 'Kvadrat tenglamalar va Viyet teoremasi',
      'description':
          'Diskriminant formulasi yordamida ildizlarni topish va tekshirish.',
      'grade': 8,
      'chapterTitle': 'Kvadrat tenglamalar',
      'rewardXP': 140,
      'rewardCoins': 18,
      'progress': 0.0,
      'isCompleted': false,
      'isLocked': false,
      'icon': 'x²',
      'accentColor': const Color(0xFFF59E0B),
    },
    {
      'id': 'lesson-g9-01',
      'title': 'Funksiyalar va ularning grafiklari',
      'description':
          'Chiziqli va kvadratik funksiyalar, aniqlanish va qiymatlar sohasi.',
      'grade': 9,
      'chapterTitle': 'Funksiyalar',
      'rewardXP': 145,
      'rewardCoins': 20,
      'progress': 0.0,
      'isCompleted': false,
      'isLocked': false,
      'icon': 'f(x)',
      'accentColor': const Color(0xFF10B981),
    },
    {
      'id': 'lesson-g10-01',
      'title': 'Trigonometriya asoslari va formulalari',
      'description':
          'Sinus, kosinus, tangens va asosiy trigonometrik ayniyatlar.',
      'grade': 10,
      'chapterTitle': 'Trigonometriya',
      'rewardXP': 150,
      'rewardCoins': 20,
      'progress': 0.0,
      'isCompleted': false,
      'isLocked': false,
      'icon': 'sin',
      'accentColor': const Color(0xFF6366F1),
    },
    {
      'id': 'lesson-g11-01',
      'title': 'Hosila va uning geometrik ma’nosi',
      'description':
          'Funksiyaning o‘sish va kamayish oraliqlari, urinma tenglamasi.',
      'grade': 11,
      'chapterTitle': 'Matematik analiz',
      'rewardXP': 160,
      'rewardCoins': 25,
      'progress': 0.0,
      'isCompleted': false,
      'isLocked': false,
      'icon': '∫dx',
      'accentColor': const Color(0xFF4F46E5),
    },
  ];

  @override
  void initState() {
    super.initState();
    _fetchLessons();

    _autoSyncTimer = Timer.periodic(const Duration(seconds: 25), (_) {
      if (mounted) _fetchLessons(silent: true);
    });
  }

  @override
  void dispose() {
    _autoSyncTimer?.cancel();
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _fetchLessons({bool silent = false}) async {
    final isTest = !kIsWeb && Platform.environment.containsKey('FLUTTER_TEST');
    if (isTest) return;

    if (!silent) {
      setState(() => _isLoading = true);
    }
    try {
      final res = await ApiClient()
          .dio
          .get('/lessons', queryParameters: {'limit': 300});
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
    if (catLower.contains('kasr')) return const Color(0xFF8B5CF6);
    if (catLower.contains('arifmet') ||
        catLower.contains('karra') ||
        catLower.contains('hisob')) {
      return const Color(0xFF10B981);
    }
    if (catLower.contains('geom') || catLower.contains('shakl'))
      return const Color(0xFFF59E0B);
    if (catLower.contains('tenglam') || catLower.contains('algeb'))
      return const Color(0xFFEF4444);
    if (catLower.contains('foiz') || catLower.contains('nisbat'))
      return const Color(0xFF06B6D4);
    if (catLower.contains('trigono')) return const Color(0xFFA855F7);
    if (catLower.contains('analiz') ||
        catLower.contains('hosila') ||
        catLower.contains('integral')) {
      return const Color(0xFF6366F1);
    }
    return const Color(0xFF8B5CF6);
  }

  String _resolveCategoryName(Map<String, dynamic> lesson) {
    final chapter = (lesson['chapterTitle'] ?? '').toString();
    if (chapter.isNotEmpty && chapter != 'Matematika' && chapter != 'Algebra') {
      return chapter;
    }
    final title = (lesson['title'] ?? '').toString().toLowerCase();
    if (title.contains('kasr')) return 'Kasrlar va Bo‘laklar';
    if (title.contains('karra') ||
        title.contains('jadval') ||
        title.contains('qo‘shish') ||
        title.contains('ayirish')) {
      return 'Arifmetika va Hisoblash';
    }
    if (title.contains('shakl') ||
        title.contains('perimetr') ||
        title.contains('yuza') ||
        title.contains('geometriya')) {
      return 'Geometriya asoslari';
    }
    if (title.contains('tenglama') ||
        title.contains('viyet') ||
        title.contains('ildiz')) {
      return 'Tenglamalar va Algebra';
    }
    if (title.contains('foiz') || title.contains('proporsiya'))
      return 'Foizlar va Nisbatlar';
    if (title.contains('trigonometriya') || title.contains('sinus'))
      return 'Trigonometriya';
    if (title.contains('hosila') ||
        title.contains('integral') ||
        title.contains('funksiya')) {
      return 'Funksiyalar va Analiz';
    }
    return chapter.isNotEmpty ? chapter : 'Umumiy matematika';
  }

  String _getDifficulty(int grade) {
    if (grade <= 4) return 'Boshlang‘ich';
    if (grade <= 8) return 'O‘rta daraja';
    return 'Yuqori daraja';
  }

  String _getEstimatedTime(int grade) {
    if (grade <= 4) return '10–12 daq';
    if (grade <= 8) return '15–18 daq';
    return '20–25 daq';
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final studentState = ref.watch(studentProvider);
    final student = studentState.student;
    final coins = student?.coinBalance ?? 0;
    final xp = student?.totalXP ?? 0;

    final screenWidth = MediaQuery.of(context).size.width;
    if (screenWidth < 600) {
      return _buildPhoneScaffold(colors, isDark, student, coins, xp);
    }

    final wideBody = Stack(
      children: [
        AnimatedMathBackground(isDark: isDark),
        Column(
          children: [
            _buildGlassHeader(coins, xp, colors, isDark),
            Expanded(
              child: RefreshIndicator(
                onRefresh: _fetchLessons,
                color: const Color(0xFFA855F7),
                child: _buildTopicsList(
                    colors, isDark, student?.completedLessons ?? []),
              ),
            ),
          ],
        ),
      ],
    );

    return AppResponsiveScaffold(
      currentNavIndex: 1,
      title: 'Matematika darslari',
      phoneBody: _buildPhoneScaffold(colors, isDark, student, coins, xp),
      tabletBody: wideBody,
      desktopBody: wideBody,
    );
  }

  Widget _buildGlassHeader(
      int coins, int xp, AppThemeColors colors, bool isDark) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
      decoration: BoxDecoration(
        color: isDark
            ? const Color(0xFF130A2A).withValues(alpha: 0.85)
            : colors.card.withValues(alpha: 0.90),
        border: Border(
          bottom: BorderSide(
            color: isDark
                ? const Color(0xFF8B5CF6).withValues(alpha: 0.25)
                : colors.border,
            width: 1,
          ),
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Darslar',
                  style: TextStyle(
                    fontWeight: FontWeight.w900,
                    fontSize: 22,
                    color: colors.ink,
                    letterSpacing: -0.3,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Bugun nimani o‘rganamiz?',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: colors.muted,
                  ),
                ),
              ],
            ),
          ),
          XpBadge(count: xp, size: 24),
          const SizedBox(width: 8),
          CoinBadge(count: coins, size: 24),
        ],
      ),
    );
  }

  Widget _buildPhoneScaffold(
    AppThemeColors colors,
    bool isDark,
    dynamic student,
    int coins,
    int xp,
  ) {
    return Scaffold(
      backgroundColor: colors.bg,
      body: Stack(
        children: [
          AnimatedMathBackground(isDark: isDark),
          SafeArea(
            child: Column(
              children: [
                _buildGlassHeader(coins, xp, colors, isDark),
                Expanded(
                  child: RefreshIndicator(
                    onRefresh: _fetchLessons,
                    color: const Color(0xFFA855F7),
                    child: _buildTopicsList(
                        colors, isDark, student?.completedLessons ?? []),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: KidsNavShellScope.of(context)
          ? null
          : const MathCityBottomNav(currentIndex: 1),
    );
  }

  Widget _buildTopicsList(
      AppThemeColors colors, bool isDark, List<String> userCompletedLessons) {
    // 1. Merge default and API lessons uniquely
    final allLessons = <Map<String, dynamic>>[];
    allLessons.addAll(_defaultTopics);

    for (final apiL in _apiLessons) {
      final id = apiL['id']?.toString() ?? '';
      final idx = allLessons.indexWhere((l) => l['id'] == id);
      final isDone =
          userCompletedLessons.contains(id) || apiL['isCompleted'] == true;
      final item = {
        'id': id,
        'title': apiL['title'] ?? 'Yangi dars',
        'description': apiL['description'] ??
            'Matematika fani bo‘yicha to‘liq va tushunarli darslik.',
        'grade': apiL['grade'] ?? 4,
        'chapterTitle': apiL['chapterTitle'] ?? 'Matematika',
        'rewardXP': apiL['rewardXP'] ?? 100,
        'rewardCoins': apiL['rewardCoins'] ?? 12,
        'progress': isDone ? 1.0 : (apiL['progress'] as double? ?? 0.0),
        'isCompleted': isDone,
        'isLocked': apiL['isLocked'] == true && !isDone,
        'icon': apiL['icon'] ?? '📚',
        'accentColor': apiL['accentColor'] != null
            ? _resolveCategoryColor('', apiL['accentColor'])
            : const Color(0xFF8B5CF6),
      };

      if (idx >= 0) {
        allLessons[idx] = item;
      } else {
        allLessons.add(item);
      }
    }

    // 2. Filter by Grade and Search Query
    final filtered = allLessons.where((l) {
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
      physics:
          const AlwaysScrollableScrollPhysics(parent: BouncingScrollPhysics()),
      slivers: [
        // Top search bar and grade filter chips
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Modern Glass Search Bar
                Container(
                  decoration: BoxDecoration(
                    color: isDark
                        ? const Color(0xFF160E36).withValues(alpha: 0.85)
                        : colors.card,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: isDark
                          ? const Color(0xFF8B5CF6).withValues(alpha: 0.3)
                          : colors.border,
                      width: 1.2,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: isDark
                            ? const Color(0xFF7C3AED).withValues(alpha: 0.1)
                            : Colors.black.withValues(alpha: 0.04),
                        blurRadius: 10,
                        offset: const Offset(0, 3),
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
                      hintText:
                          'Dars yoki mavzuni qidirish (masalan: kasr, tenglama)...',
                      hintStyle: TextStyle(
                        color: colors.muted,
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                      ),
                      prefixIcon: const Icon(Icons.search_rounded,
                          color: Color(0xFFA855F7), size: 22),
                      suffixIcon: _searchQuery.isNotEmpty
                          ? IconButton(
                              icon: Icon(Icons.clear_rounded,
                                  color: colors.muted, size: 18),
                              onPressed: () {
                                _searchController.clear();
                                setState(() => _searchQuery = '');
                              },
                            )
                          : null,
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 13),
                    ),
                  ),
                ),
                const SizedBox(height: 12),

                // Grade Filter Chips: "Barchasi" + 1..11
                SizedBox(
                  height: 38,
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
                          duration: const Duration(milliseconds: 220),
                          padding: const EdgeInsets.symmetric(
                              horizontal: 14, vertical: 8),
                          decoration: BoxDecoration(
                            gradient: isSelected
                                ? const LinearGradient(
                                    colors: [
                                      Color(0xFF8B5CF6),
                                      Color(0xFF6D28D9)
                                    ],
                                  )
                                : null,
                            color: isSelected
                                ? null
                                : (isDark
                                    ? const Color(0xFF160E36)
                                        .withValues(alpha: 0.8)
                                    : colors.card),
                            borderRadius: BorderRadius.circular(999),
                            border: Border.all(
                              color: isSelected
                                  ? const Color(0xFFA855F7)
                                  : (isDark
                                      ? const Color(0xFF8B5CF6)
                                          .withValues(alpha: 0.25)
                                      : colors.border),
                              width: 1.2,
                            ),
                            boxShadow: isSelected
                                ? [
                                    BoxShadow(
                                      color: const Color(0xFF8B5CF6)
                                          .withValues(alpha: 0.4),
                                      blurRadius: 8,
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
                              fontWeight: isSelected
                                  ? FontWeight.w900
                                  : FontWeight.w700,
                              color: isSelected
                                  ? Colors.white
                                  : (isDark ? Colors.white70 : colors.muted),
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

        // Skeleton loading state
        if (_isLoading && _apiLessons.isEmpty)
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) => _buildSkeletonCard(colors, isDark),
                childCount: 4,
              ),
            ),
          )
        else if (filtered.isEmpty)
          // Empty State Design
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 60),
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 72,
                      height: 72,
                      decoration: BoxDecoration(
                        color: const Color(0xFF8B5CF6).withValues(alpha: 0.15),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.search_off_rounded,
                          color: Color(0xFFA855F7), size: 36),
                    ),
                    const SizedBox(height: 18),
                    Text(
                      'Mos darslar topilmadi',
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w900,
                        color: colors.ink,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Qidiruv so‘zini o‘zgartiring yoki boshqa sinfni tanlab ko‘ring.',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 13, color: colors.muted),
                    ),
                  ],
                ),
              ),
            ),
          )
        else
          // Grouped Categories with Glass Cards
          ...grouped.entries.map((entry) {
            final categoryName = entry.key;
            final lessons = entry.value;
            final catColor = _resolveCategoryColor(
                categoryName, lessons.first['accentColor']);

            return SliverMainAxisGroup(
              slivers: [
                // Category Header
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(18, 16, 18, 10),
                    child: Row(
                      children: [
                        Container(
                          width: 10,
                          height: 10,
                          decoration: BoxDecoration(
                            color: catColor,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: catColor.withValues(alpha: 0.5),
                                blurRadius: 6,
                                spreadRadius: 1,
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            categoryName,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w900,
                              color: colors.ink,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: catColor.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(
                                color: catColor.withValues(alpha: 0.3)),
                          ),
                          child: Text(
                            '${lessons.length} ta mavzu',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              color: catColor,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                // Cards list (Grid on wide screens, List on phone)
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  sliver: MediaQuery.of(context).size.width >= 600
                      ? SliverGrid(
                          gridDelegate:
                              SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount:
                                MediaQuery.of(context).size.width >= 1280
                                    ? 3
                                    : 2,
                            mainAxisSpacing: 14,
                            crossAxisSpacing: 14,
                            mainAxisExtent: 280,
                          ),
                          delegate: SliverChildBuilderDelegate(
                            (context, index) {
                              return _buildFullWidthLessonCard(
                                  lessons[index], colors, isDark, catColor);
                            },
                            childCount: lessons.length,
                          ),
                        )
                      : SliverList(
                          delegate: SliverChildBuilderDelegate(
                            (context, index) {
                              return Padding(
                                padding: const EdgeInsets.only(bottom: 12),
                                child: _buildFullWidthLessonCard(
                                    lessons[index], colors, isDark, catColor),
                              );
                            },
                            childCount: lessons.length,
                          ),
                        ),
                ),
              ],
            );
          }),

        // Safe bottom padding so nothing is cut off by bottom nav
        const SliverToBoxAdapter(
          child: SizedBox(height: 120),
        ),
      ],
    );
  }

  Widget _buildFullWidthLessonCard(
    Map<String, dynamic> lesson,
    AppThemeColors colors,
    bool isDark,
    Color catColor,
  ) {
    final title = (lesson['title'] ?? '').toString();
    final description = (lesson['description'] ?? '').toString();
    final grade = (lesson['grade'] as int?) ?? 4;
    final xp = (lesson['rewardXP'] as int?) ?? 100;
    final coins = (lesson['rewardCoins'] as int?) ?? 12;
    final progress = (lesson['progress'] as double?) ?? 0.0;
    final isCompleted = lesson['isCompleted'] == true;
    final isLocked = lesson['isLocked'] == true;
    final icon = (lesson['icon'] ?? '📚').toString();
    final lessonId = lesson['id']?.toString() ?? '';
    final difficulty = _getDifficulty(grade);
    final estTime = _getEstimatedTime(grade);

    return Container(
      decoration: BoxDecoration(
        color: isDark
            ? const Color(0xFF160E36).withValues(alpha: 0.88)
            : colors.card,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: isCompleted
              ? const Color(0xFF10B981).withValues(alpha: 0.45)
              : isLocked
                  ? (isDark ? Colors.white10 : colors.border)
                  : (isDark ? catColor.withValues(alpha: 0.35) : colors.border),
          width: 1.3,
        ),
        boxShadow: [
          BoxShadow(
            color: isCompleted
                ? const Color(0xFF10B981).withValues(alpha: 0.08)
                : (isDark
                    ? const Color(0xFF7C3AED).withValues(alpha: 0.08)
                    : Colors.black.withValues(alpha: 0.04)),
            blurRadius: 14,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(22),
          onTap: isLocked
              ? () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text(
                          'Bu dars hozircha qulflangan. Oldingi darslarni bajaring!'),
                      duration: Duration(seconds: 2),
                    ),
                  );
                }
              : () {
                  context.push('/kids/lesson/$lessonId');
                },
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Row: Math symbol squircle + Badges
                Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [catColor, catColor.withValues(alpha: 0.8)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(15),
                        boxShadow: [
                          BoxShadow(
                            color: catColor.withValues(alpha: 0.35),
                            blurRadius: 8,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        icon,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: FittedBox(
                        fit: BoxFit.scaleDown,
                        alignment: Alignment.centerLeft,
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: catColor.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                '$grade-sinf',
                                style: TextStyle(
                                  color: catColor,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ),
                            const SizedBox(width: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: isDark
                                    ? Colors.white.withValues(alpha: 0.08)
                                    : colors.field,
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                    color: isDark
                                        ? Colors.transparent
                                        : colors.border),
                              ),
                              child: Text(
                                difficulty,
                                style: TextStyle(
                                  color: isDark ? Colors.white70 : colors.muted,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ),
                            const SizedBox(width: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: isDark
                                    ? Colors.white.withValues(alpha: 0.08)
                                    : colors.field,
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                    color: isDark
                                        ? Colors.transparent
                                        : colors.border),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(Icons.access_time_rounded,
                                      size: 12,
                                      color: isDark
                                          ? Colors.white54
                                          : colors.muted),
                                  const SizedBox(width: 4),
                                  Text(
                                    estTime,
                                    style: TextStyle(
                                      color: isDark
                                          ? Colors.white54
                                          : colors.muted,
                                      fontSize: 11,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    if (isCompleted)
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF065F46).withValues(alpha: 0.6),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                              color: const Color(0xFF10B981)
                                  .withValues(alpha: 0.4)),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.check_circle_rounded,
                                color: Color(0xFF34D399), size: 15),
                            SizedBox(width: 4),
                            Text(
                              'Tugatildi',
                              style: TextStyle(
                                color: Color(0xFF34D399),
                                fontSize: 11,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ],
                        ),
                      )
                    else if (isLocked)
                      Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.08),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.lock_rounded,
                            color: Colors.white38, size: 16),
                      ),
                  ],
                ),
                const SizedBox(height: 12),

                // Title
                Text(
                  title,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w900,
                    color: colors.ink,
                    height: 1.3,
                  ),
                ),
                const SizedBox(height: 6),

                // Description
                Text(
                  description,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    color: colors.muted,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 14),

                // Bottom Row: Rewards (XP + Coin) + Progress + Action Button
                FittedBox(
                  fit: BoxFit.scaleDown,
                  alignment: Alignment.centerLeft,
                  child: Row(
                    children: [
                      // XP Reward Pill (With real XpCoin)
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: isDark
                              ? const Color(0xFF7C3AED).withValues(alpha: 0.2)
                              : colors.primaryLight.withValues(alpha: 0.6),
                          borderRadius: BorderRadius.circular(999),
                          border: Border.all(
                            color: isDark
                                ? const Color(0xFFA855F7).withValues(alpha: 0.4)
                                : colors.primary.withValues(alpha: 0.35),
                            width: 1,
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const XpCoin(size: 14, showGlow: false),
                            const SizedBox(width: 4),
                            Text(
                              '+$xp XP',
                              style: TextStyle(
                                color: isDark
                                    ? const Color(0xFFE9D5FF)
                                    : colors.primary,
                                fontSize: 11,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 6),

                      // Coin Reward Pill
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.amber
                              .withValues(alpha: isDark ? 0.15 : 0.2),
                          borderRadius: BorderRadius.circular(999),
                          border: Border.all(
                            color: Colors.amber
                                .withValues(alpha: isDark ? 0.3 : 0.5),
                            width: 1,
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const CoinIcon(size: 14),
                            const SizedBox(width: 4),
                            Text(
                              '+$coins',
                              style: TextStyle(
                                color: isDark
                                    ? Colors.amber
                                    : const Color(0xFFD97706),
                                fontSize: 11,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(width: 16),

                      // Progress indicator if in progress
                      if (!isCompleted && !isLocked && progress > 0.0) ...[
                        Text(
                          '${(progress * 100).toInt()}%',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                            color: catColor,
                          ),
                        ),
                        const SizedBox(width: 8),
                        SizedBox(
                          width: 46,
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(999),
                            child: LinearProgressIndicator(
                              value: progress,
                              backgroundColor:
                                  isDark ? Colors.white12 : colors.border,
                              valueColor:
                                  AlwaysStoppedAnimation<Color>(catColor),
                              minHeight: 6,
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                      ],

                      // Action Button
                      SizedBox(
                        height: 34,
                        child: ElevatedButton.icon(
                          onPressed: isLocked
                              ? null
                              : () {
                                  context.push('/kids/lesson/$lessonId');
                                },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: isCompleted
                                ? const Color(0xFF10B981)
                                : isLocked
                                    ? Colors.grey.shade800
                                    : catColor,
                            foregroundColor: Colors.white,
                            disabledBackgroundColor: Colors.white10,
                            disabledForegroundColor: Colors.white30,
                            elevation: 0,
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          icon: Icon(
                            isCompleted
                                ? Icons.replay_rounded
                                : isLocked
                                    ? Icons.lock_outline_rounded
                                    : Icons.play_arrow_rounded,
                            size: 15,
                          ),
                          label: Text(
                            isCompleted
                                ? 'Qayta ko‘rish'
                                : isLocked
                                    ? 'Qulflangan'
                                    : (progress > 0
                                        ? 'Davom etish'
                                        : 'Boshlash'),
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
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSkeletonCard(AppThemeColors colors, bool isDark) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Container(
        height: 120,
        decoration: BoxDecoration(
          color: const Color(0xFF160E36).withValues(alpha: 0.8),
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: Colors.white10),
        ),
        padding: const EdgeInsets.all(16),
        child: const Center(
          child: CircularProgressIndicator(color: Color(0xFFA855F7)),
        ),
      ),
    );
  }
}
