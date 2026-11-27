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
import '../../core/widgets/xp_coin.dart';
import '../../shared/models/module_model.dart';
import '../../shared/providers/student_provider.dart';

class LessonsScreen extends ConsumerStatefulWidget {
  const LessonsScreen({super.key});

  @override
  ConsumerState<LessonsScreen> createState() => _LessonsScreenState();
}

class _LessonsScreenState extends ConsumerState<LessonsScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';
  int _selectedGrade = 1; // Default to Grade 1 (No "Barchasi" chip)

  bool _isLoading = false;
  List<ModuleModel> _modules = [];
  List<Map<String, dynamic>> _searchResults = [];
  Timer? _autoSyncTimer;

  @override
  void initState() {
    super.initState();
    _fetchModules();

    _autoSyncTimer = Timer.periodic(const Duration(seconds: 30), (_) {
      if (mounted && _searchQuery.isEmpty) _fetchModules(silent: true);
    });
  }

  @override
  void dispose() {
    _autoSyncTimer?.cancel();
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _fetchModules({bool silent = false}) async {
    final isTest = !kIsWeb && Platform.environment.containsKey('FLUTTER_TEST');
    if (isTest) {
      _loadFallbackModules();
      return;
    }

    if (!silent) {
      setState(() => _isLoading = true);
    }

    try {
      final res = await ApiClient().dio.get(
        '/modules',
        queryParameters: {'grade': _selectedGrade},
      );
      if (res.data != null && res.data['success'] == true) {
        final list = (res.data['data'] as List<dynamic>? ?? [])
            .map((item) => ModuleModel.fromJson(item as Map<String, dynamic>))
            .toList();

        if (mounted) {
          setState(() {
            _modules = list;
            _isLoading = false;
          });
          return;
        }
      }
    } catch (_) {}

    if (mounted) {
      _loadFallbackModules();
    }
  }

  void _loadFallbackModules() {
    if (_selectedGrade == 1) {
      setState(() {
        _modules = [
          ModuleModel(
            id: 'module-g1-p1',
            grade: 1,
            subject: 'Matematika',
            part: 1,
            title: 'Matematika · 1-qism',
            orderIndex: 1,
            comingSoon: false,
            lessonCount: 41,
            questionCount: 205,
            totalMinutes: 288,
            percent: 0,
            earnedXp: 0,
            totalXp: 4120,
          ),
          ModuleModel(
            id: 'module-g1-p2',
            grade: 1,
            subject: 'Matematika',
            part: 2,
            title: 'Matematika · 2-qism',
            orderIndex: 2,
            comingSoon: true,
            lessonCount: 41,
            questionCount: 205,
            totalMinutes: 288,
            percent: 0,
            earnedXp: 0,
            totalXp: 4120,
          ),
        ];
        _isLoading = false;
      });
    } else {
      setState(() {
        _modules = [
          ModuleModel(
            id: 'module-g$_selectedGrade-p1',
            grade: _selectedGrade,
            subject: 'Matematika',
            part: 1,
            title: 'Matematika · 1-qism',
            orderIndex: 1,
            comingSoon: true,
            lessonCount: 0,
            questionCount: 0,
            totalMinutes: 0,
            percent: 0,
            earnedXp: 0,
            totalXp: 0,
          ),
          ModuleModel(
            id: 'module-g$_selectedGrade-p2',
            grade: _selectedGrade,
            subject: 'Matematika',
            part: 2,
            title: 'Matematika · 2-qism',
            orderIndex: 2,
            comingSoon: true,
            lessonCount: 0,
            questionCount: 0,
            totalMinutes: 0,
            percent: 0,
            earnedXp: 0,
            totalXp: 0,
          ),
        ];
        _isLoading = false;
      });
    }
  }

  Future<void> _performSearch(String query) async {
    if (query.trim().isEmpty) {
      setState(() {
        _searchQuery = '';
        _searchResults = [];
      });
      return;
    }

    setState(() {
      _searchQuery = query.trim();
      _isLoading = true;
    });

    try {
      final res = await ApiClient().dio.get(
        '/lessons',
        queryParameters: {
          'search': query.trim(),
          'grade': _selectedGrade,
          'limit': 20,
        },
      );
      if (res.data != null && res.data['success'] == true) {
        final list = List<Map<String, dynamic>>.from(res.data['data'] ?? []);
        if (mounted) {
          setState(() {
            _searchResults = list;
            _isLoading = false;
          });
          return;
        }
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
    final coins = studentState.student?.coinBalance ?? 0;
    final xp = studentState.student?.totalXP ?? 0;

    return AppResponsiveScaffold(
      currentNavIndex: 1,
      phoneBody: Scaffold(
        backgroundColor: colors.bg,
        body: Stack(
          children: [
            const AnimatedMathBackground(),
            SafeArea(
              child: Column(
                children: [
                  // Top Header Bar
                  _buildHeader(colors, coins, xp),

                  // Search Bar + Grade Filter Chips (1-sinf .. 11-sinf)
                  _buildFilterSection(colors, isDark),

                  // Main Content: Modules or Search Results
                  Expanded(
                    child: _isLoading && _modules.isEmpty
                        ? const Center(
                            child: CircularProgressIndicator(
                              color: Color(0xFF6C3CE0),
                            ),
                          )
                        : RefreshIndicator(
                            onRefresh: () => _fetchModules(silent: true),
                            color: const Color(0xFF6C3CE0),
                            child: _searchQuery.isNotEmpty
                                ? _buildSearchResultsList(colors, isDark)
                                : _buildModulesList(colors, isDark),
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

  Widget _buildHeader(AppThemeColors colors, int coins, int xp) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Darslar',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w900,
                    color: colors.ink,
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Maktab darsligi asosida',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: colors.muted,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              XpBadge(count: xp),
              const SizedBox(width: 8),
              CoinBadge(count: coins),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFilterSection(AppThemeColors colors, bool isDark) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 6, 16, 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Search Input
          Container(
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF160E36) : Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: colors.border,
                width: 1.2,
              ),
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
              onSubmitted: _performSearch,
              onChanged: (val) {
                if (val.isEmpty) {
                  _performSearch('');
                }
              },
              style: TextStyle(
                color: colors.ink,
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
              decoration: InputDecoration(
                hintText: 'Dars yoki mavzuni qidirish (masalan: sanash, qo‘shish)...',
                hintStyle: TextStyle(
                  color: colors.muted,
                  fontSize: 13,
                ),
                prefixIcon: const Icon(
                  Icons.search_rounded,
                  color: Color(0xFF6C3CE0),
                  size: 22,
                ),
                suffixIcon: _searchQuery.isNotEmpty
                    ? IconButton(
                        icon: Icon(Icons.clear_rounded,
                            color: colors.muted, size: 18),
                        onPressed: () {
                          _searchController.clear();
                          _performSearch('');
                        },
                      )
                    : null,
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 13,
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),

          // Grade Filter Chips: Exactly 1-sinf .. 11-sinf (No "Barchasi")
          SizedBox(
            height: 38,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: 11, // 1-sinf to 11-sinf
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, idx) {
                final grade = idx + 1;
                final isSelected = _selectedGrade == grade;

                return GestureDetector(
                  onTap: () {
                    setState(() {
                      _selectedGrade = grade;
                    });
                    _fetchModules();
                  },
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      gradient: isSelected
                          ? const LinearGradient(
                              colors: [Color(0xFF6C3CE0), Color(0xFF7C4DFF)],
                            )
                          : null,
                      color: isSelected
                          ? null
                          : (isDark ? const Color(0xFF1E1738) : Colors.white),
                      borderRadius: BorderRadius.circular(999),
                      border: Border.all(
                        color: isSelected
                            ? const Color(0xFF6C3CE0)
                            : colors.border,
                        width: 1.2,
                      ),
                      boxShadow: isSelected
                          ? [
                              BoxShadow(
                                color: const Color(0xFF6C3CE0).withOpacity(0.35),
                                blurRadius: 8,
                                offset: const Offset(0, 2),
                              ),
                            ]
                          : null,
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      '$grade-sinf',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: isSelected ? FontWeight.w900 : FontWeight.w700,
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
    );
  }

  Widget _buildModulesList(AppThemeColors colors, bool isDark) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
      children: [
        // Section Header
        Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Modullar',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                  color: colors.ink,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFF6C3CE0).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  '$_selectedGrade-sinf',
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF6C3CE0),
                  ),
                ),
              ),
            ],
          ),
        ),

        // Module Cards
        if (_modules.isEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 40),
            child: Center(
              child: Text(
                'Bu sinf uchun modullar tayyorlanmoqda',
                style: TextStyle(fontSize: 14, color: colors.muted),
              ),
            ),
          )
        else
          ..._modules.map((module) => _buildModuleCard(context, colors, isDark, module)),
      ],
    );
  }

  Widget _buildModuleCard(
    BuildContext context,
    AppThemeColors colors,
    bool isDark,
    ModuleModel module,
  ) {
    final isComingSoon = module.comingSoon;

    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: GestureDetector(
        onTap: () {
          if (isComingSoon) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('"${module.title}" tez kunda qo‘shiladi! 🚀'),
                duration: const Duration(seconds: 2),
              ),
            );
            return;
          }
          context.push('/kids/lessons/module/${module.id}');
        },
        child: Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF160E36).withOpacity(0.9) : Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: isComingSoon
                  ? colors.border.withOpacity(0.6)
                  : const Color(0xFF6C3CE0).withOpacity(0.25),
              width: 1.2,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.04),
                blurRadius: 10,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Row(
            children: [
              // Left Icon Container
              Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  gradient: isComingSoon
                      ? null
                      : const LinearGradient(
                          colors: [Color(0xFF6C3CE0), Color(0xFF7C4DFF)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                  color: isComingSoon
                      ? (isDark ? const Color(0xFF221A3B) : const Color(0xFFF1F2F6))
                      : null,
                  borderRadius: BorderRadius.circular(16),
                ),
                alignment: Alignment.center,
                child: Icon(
                  isComingSoon
                      ? Icons.lock_clock_rounded
                      : Icons.auto_stories_rounded,
                  color: isComingSoon ? colors.muted : Colors.white,
                  size: 24,
                ),
              ),
              const SizedBox(width: 14),

              // Title and Meta Info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      module.title,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: isComingSoon ? colors.muted : colors.ink,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 5),
                    Text(
                      isComingSoon
                          ? 'Tez kunda yangi mavzular taqdim etiladi'
                          : '▶ ${module.lessonCount} ta mavzu · ❓ ${module.questionCount} ta savol · 🕒 ~${module.totalMinutes} daqiqa',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: colors.muted,
                        height: 1.3,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 10),

              // Right Status Badge
              if (isComingSoon)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF221A3B) : const Color(0xFFF1F2F6),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: colors.border.withOpacity(0.5)),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.hourglass_empty_rounded, size: 12, color: colors.muted),
                      const SizedBox(width: 4),
                      Text(
                        'Tez kunda',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: colors.muted,
                        ),
                      ),
                    ],
                  ),
                )
              else if (module.percent == 100)
                Column(
                  mainAxisSize: MainAxisSize.min,
                  children: const [
                    Icon(Icons.verified_rounded, size: 26, color: Color(0xFF2EB67D)),
                    SizedBox(height: 2),
                    Text(
                      'Sertifikat 🏆',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF2EB67D),
                      ),
                    ),
                  ],
                )
              else if (module.percent > 0)
                SizedBox(
                  width: 42,
                  height: 42,
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      CircularProgressIndicator(
                        value: (module.percent / 100).clamp(0.0, 1.0),
                        backgroundColor: colors.border,
                        valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF6C3CE0)),
                        strokeWidth: 3.5,
                      ),
                      Text(
                        '${module.percent}%',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                          color: colors.ink,
                        ),
                      ),
                    ],
                  ),
                )
              else
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF221A3B) : const Color(0xFFF6F5FC),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.military_tech_outlined,
                    size: 22,
                    color: colors.muted,
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSearchResultsList(AppThemeColors colors, bool isDark) {
    if (_searchResults.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.search_off_rounded, size: 48, color: Colors.grey),
            const SizedBox(height: 12),
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
              'Boshqa so‘z bilan qidirib ko‘ring.',
              style: TextStyle(fontSize: 13, color: colors.muted),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
      itemCount: _searchResults.length,
      itemBuilder: (context, index) {
        final item = _searchResults[index];
        final title = item['title'] ?? '';
        final desc = item['description'] ?? item['shortDesc'] ?? '';
        final emoji = item['emoji'] ?? item['icon'] ?? '📘';
        final lessonId = item['id'] ?? '';

        return Padding(
          padding: const EdgeInsets.only(bottom: 10),
          child: GestureDetector(
            onTap: () => context.push('/kids/lesson/$lessonId'),
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF160E36) : Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: colors.border),
              ),
              child: Row(
                children: [
                  Text(emoji, style: const TextStyle(fontSize: 24)),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w800,
                            color: colors.ink,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 3),
                        Text(
                          desc,
                          style: TextStyle(
                            fontSize: 12,
                            color: colors.muted,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Icon(Icons.chevron_right_rounded, color: Colors.grey),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
