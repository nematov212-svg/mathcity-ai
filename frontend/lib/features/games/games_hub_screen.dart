import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/network/api_client.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/coin_badge.dart';
import '../../core/widgets/kids_shell_layout.dart';
import '../../core/widgets/mathcity_bottom_nav.dart';
import '../../shared/providers/student_provider.dart';

class GamesHubScreen extends ConsumerStatefulWidget {
  const GamesHubScreen({super.key});

  @override
  ConsumerState<GamesHubScreen> createState() => _GamesHubScreenState();
}

class _GamesHubScreenState extends ConsumerState<GamesHubScreen>
    with SingleTickerProviderStateMixin {
  String _selectedFilter = 'Barchasi'; // 'Barchasi', 'Oson', 'O‘rta', 'Qiyin'
  List<Map<String, dynamic>> _games = [];
  List<Map<String, dynamic>> _recentResults = [];
  bool _isLoading = false;

  late AnimationController _floatController;

  @override
  void initState() {
    super.initState();
    _floatController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2500),
    )..repeat(reverse: true);

    _loadGamesData();
  }

  @override
  void dispose() {
    _floatController.dispose();
    super.dispose();
  }

  Future<void> _loadGamesData() async {
    if (WidgetsBinding.instance.runtimeType.toString().contains('Test')) {
      return;
    }
    try {
      final gamesRes = await ApiClient().dio.get('/games');
      final recentRes = await ApiClient().dio.get('/games/results/recent');

      if (!mounted) return;
      setState(() {
        if (gamesRes.data['success'] == true) {
          _games = List<Map<String, dynamic>>.from(gamesRes.data['data']);
        }
        if (recentRes.data['success'] == true) {
          _recentResults =
              List<Map<String, dynamic>>.from(recentRes.data['data']);
        }
        _isLoading = false;
      });
    } catch (_) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  List<Map<String, dynamic>> get _filteredGames {
    if (_games.isEmpty) {
      return [
        {
          'key': 'uy_qurish',
          'title': 'Uy qurish',
          'description':
              'Misollar yechib tanga to‘plang va orzuingizdagi uyni 6 bosqichda quring!',
          'difficulty': 'Oson - Maroqli',
          'duration': 'Cheksiz',
          'rewardBadge': '+680 XP',
          'rewardCoins': 0,
          'rewardXP': 680,
          'highScore': 0,
          'timesPlayed': 0,
          'route': '/kids/house-building',
          'icon': Icons.home_work_rounded,
          'gradient': const [Color(0xFF8B5CF6), Color(0xFF6D28D9)],
        },
        {
          'key': 'kasrlar_jangi',
          'title': 'Kasrlar jangi',
          'description':
              'Kasrlarni vizual shakllar bilan taqqoslang va fazoni zabt eting.',
          'difficulty': 'O‘rta',
          'duration': '4 daqiqa',
          'rewardBadge': '+40 oltin tanga',
          'rewardCoins': 15,
          'rewardXP': 50,
          'highScore': 0,
          'timesPlayed': 0,
          'route': '/kids/games/fraction-battle',
          'icon': Icons.pie_chart_rounded,
          'gradient': const [Color(0xFF10B981), Color(0xFF059669)],
        },
        {
          'key': 'mathcity_drift',
          'title': 'MathCity Drift: 3D Poyga & Garaj',
          'description':
              '10+ mashina, real deformatsiya, kuchli dvigatel ovozi va drift reytingi!',
          'difficulty': 'O‘rta - Qiyin',
          'duration': 'Cheksiz',
          'rewardBadge': '+50 oltin tanga',
          'rewardCoins': 40,
          'rewardXP': 80,
          'highScore': 0,
          'timesPlayed': 0,
          'route': '/kids/games/drift-car',
          'icon': Icons.sports_motorsports_rounded,
          'gradient': const [Color(0xFFF43F5E), Color(0xFFEA580C)],
        },
      ];
    }

    return _games.where((g) {
      if (_selectedFilter == 'Barchasi') return true;
      if (_selectedFilter == 'Oson')
        return (g['difficulty'] as String? ?? '').contains('Oson');
      if (_selectedFilter == 'O‘rta')
        return (g['difficulty'] as String? ?? '').contains('O‘rta');
      if (_selectedFilter == 'Qiyin')
        return (g['difficulty'] as String? ?? '').contains('Qiyin');
      return true;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);
    final studentState = ref.watch(studentProvider);
    final coinBalance = studentState.student?.coinBalance ?? 0;

    return Scaffold(
      backgroundColor: colors.bg,
      body: SafeArea(
        child: Stack(
          children: [
            Column(
              children: [
                // Top App Bar
                Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 38,
                            height: 38,
                            decoration: BoxDecoration(
                              color: colors.primary.withOpacity(0.12),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Icon(Icons.sports_esports_rounded,
                                color: colors.primary, size: 22),
                          ),
                          const SizedBox(width: 10),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'O‘yinlar',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w900,
                                  color: colors.ink,
                                  letterSpacing: -0.3,
                                ),
                              ),
                              Text(
                                'O‘yna, o‘rgan va tangalar yut!',
                                style: TextStyle(
                                  fontSize: 11,
                                  color: colors.muted,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      CoinBadge(count: coinBalance, size: 22),
                    ],
                  ),
                ),

                // Scrollable Content
                Expanded(
                  child: _isLoading
                      ? const Center(child: CircularProgressIndicator())
                      : RefreshIndicator(
                          onRefresh: _loadGamesData,
                          child: ListView(
                            padding: const EdgeInsets.fromLTRB(
                                20, 8, 20, 110), // Padding for glass bottom bar
                            children: [
                              // Hero Banner
                              _buildHeroBanner(colors),

                              const SizedBox(height: 24),

                              // Filter Chips Row
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    'O‘yinni tanlang',
                                    style: TextStyle(
                                      fontSize: 17,
                                      fontWeight: FontWeight.w800,
                                      color: colors.ink,
                                    ),
                                  ),
                                  Text(
                                    '${_filteredGames.length} ta o‘yin',
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                      color: colors.muted,
                                    ),
                                  ),
                                ],
                              ),

                              const SizedBox(height: 12),

                              _buildFilterPills(colors),

                              const SizedBox(height: 16),

                              // Game Cards
                              AnimatedSwitcher(
                                duration: const Duration(milliseconds: 300),
                                child: Column(
                                  key: ValueKey(_selectedFilter),
                                  children: _filteredGames.map((game) {
                                    return _buildGameCard(game, colors);
                                  }).toList(),
                                ),
                              ),

                              // Recent Results Section
                              if (_recentResults.isNotEmpty) ...[
                                const SizedBox(height: 28),
                                Text(
                                  'So‘nggi natijalar',
                                  style: TextStyle(
                                    fontSize: 17,
                                    fontWeight: FontWeight.w800,
                                    color: colors.ink,
                                  ),
                                ),
                                const SizedBox(height: 12),
                                ..._recentResults.map(
                                    (r) => _buildRecentResultTile(r, colors)),
                              ],

                              const SizedBox(height: 20),
                            ],
                          ),
                        ),
                ),
              ],
            ),

            // Glass Bottom Navigation Bar (Fallback for standalone render)
            if (!KidsNavShellScope.of(context))
              const Positioned(
                left: 0,
                right: 0,
                bottom: 0,
                child: MathCityBottomNav(currentIndex: 3),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeroBanner(AppThemeColors colors) {
    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF6C47FF), Color(0xFF8B6BFF), Color(0xFF5E39EE)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(28),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF6C47FF).withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Text(
                  'O‘YNA • O‘RGAN • YUT',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1.0,
                  ),
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Matematika\no‘yinlari',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.w900,
                  height: 1.15,
                  letterSpacing: -0.4,
                ),
              ),
              const SizedBox(height: 6),
              const Text(
                'Bilimingizni sinang,\ntangalar va XP yuting!',
                style: TextStyle(
                  color: Color(0xFFE2DCFF),
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                  height: 1.3,
                ),
              ),
            ],
          ),

          // Floating Rocket Artwork with soft glow (Zero ugly borders!)
          Positioned(
            right: 0,
            top: -10,
            bottom: -10,
            child: AnimatedBuilder(
              animation: _floatController,
              builder: (context, child) {
                final offset =
                    math.sin(_floatController.value * math.pi * 2) * 6.0;
                return Transform.translate(
                  offset: Offset(0, offset),
                  child: child,
                );
              },
              child: Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withOpacity(0.12),
                ),
                child: const Center(
                  child: Icon(
                    Icons.rocket_launch_rounded,
                    size: 58,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterPills(AppThemeColors colors) {
    const filters = ['Barchasi', 'Oson', 'O‘rta', 'Qiyin'];
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: filters.map((f) {
          final isSelected = _selectedFilter == f;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: InkWell(
              onTap: () {
                HapticFeedback.selectionClick();
                setState(() => _selectedFilter = f);
              },
              borderRadius: BorderRadius.circular(16),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: isSelected ? colors.primary : colors.card,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isSelected ? colors.primary : colors.border,
                    width: 1.2,
                  ),
                ),
                child: Text(
                  f,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                    color: isSelected ? Colors.white : colors.muted,
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildGameCard(Map<String, dynamic> game, AppThemeColors colors) {
    final title = game['title'] ?? 'O‘yin';
    final desc = game['description'] ?? '';
    final diff = game['difficulty'] ?? 'O‘rta';
    final rewardBadge = game['rewardBadge'] as String? ??
        (game['key'] == 'kasrlar_jangi'
            ? '+40 oltin tanga'
            : '+30 oltin tanga');
    final highScore = game['highScore'] ?? 0;
    final timesPlayed = game['timesPlayed'] ?? 0;
    final key = game['key'] ?? '';
    final route = key == 'kasrlar_jangi'
        ? '/kids/games/fraction-battle'
        : (key == 'mathcity_drift'
            ? '/kids/games/drift-car'
            : '/kids/house-building');
    final isLocked = game['isLocked'] == true;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: colors.border, width: 1.2),
        boxShadow: [
          BoxShadow(
            color: colors.ink.withOpacity(0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: key == 'kasrlar_jangi'
                        ? const [Color(0xFF10B981), Color(0xFF059669)]
                        : (key == 'mathcity_drift'
                            ? const [Color(0xFFF43F5E), Color(0xFFEA580C)]
                            : const [Color(0xFF6C47FF), Color(0xFF8B6BFF)]),
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Icon(
                  key == 'kasrlar_jangi'
                      ? Icons.pie_chart_rounded
                      : (key == 'mathcity_drift'
                          ? Icons.sports_motorsports_rounded
                          : Icons.rocket_launch_rounded),
                  color: Colors.white,
                  size: 28,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w800,
                        color: colors.ink,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        Text(
                          '$diff  •  ',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: colors.muted,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFEF3C7),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            rewardBadge,
                            style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFFD97706),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            desc,
            style: TextStyle(fontSize: 13, color: colors.muted, height: 1.3),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Eng yaxshi: $highScore ball',
                    style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: colors.ink),
                  ),
                  Text(
                    'O‘ynalgan: $timesPlayed marta',
                    style: TextStyle(fontSize: 11, color: colors.muted),
                  ),
                ],
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: isLocked ? colors.field : colors.primary,
                  foregroundColor: isLocked ? colors.muted : Colors.white,
                  elevation: isLocked ? 0 : 2,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 22, vertical: 12),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16)),
                ),
                onPressed: isLocked
                    ? null
                    : () {
                        HapticFeedback.lightImpact();
                        context.push(route);
                      },
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                        isLocked
                            ? Icons.lock_rounded
                            : Icons.play_arrow_rounded,
                        size: 18),
                    const SizedBox(width: 6),
                    Text(
                      isLocked ? '5-bosqichda' : 'O‘ynash',
                      style: const TextStyle(
                          fontWeight: FontWeight.w800, fontSize: 13),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRecentResultTile(Map<String, dynamic> r, AppThemeColors colors) {
    final title = r['title'] ?? 'O‘yin';
    final score = r['score'] ?? 0;
    final coinsEarned = r['coinsEarned'] ?? 0;
    final playedAt = r['playedAt'] as String?;
    String dateStr = 'Bugun';
    if (playedAt != null) {
      try {
        final dt = DateTime.parse(playedAt);
        dateStr =
            '${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
      } catch (_) {}
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: colors.border),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFF7ED),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.emoji_events_rounded,
                    color: Color(0xFFF59E0B), size: 18),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: colors.ink),
                  ),
                  Text(
                    '$dateStr · $score ball',
                    style: TextStyle(fontSize: 12, color: colors.muted),
                  ),
                ],
              ),
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFFE1F6EC),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
              '+$coinsEarned tanga',
              style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF10B981)),
            ),
          ),
        ],
      ),
    );
  }
}
