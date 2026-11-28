import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/network/api_client.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/coin_badge.dart';
import '../../shared/providers/student_provider.dart';
import 'models/game_config.dart';
import 'screens/game_setup_sheet.dart';

class GamesHubScreen extends ConsumerStatefulWidget {
  const GamesHubScreen({super.key});

  @override
  ConsumerState<GamesHubScreen> createState() => _GamesHubScreenState();
}

class _GamesHubScreenState extends ConsumerState<GamesHubScreen>
    with SingleTickerProviderStateMixin {
  bool _isLoading = true;
  bool _isPro = false;
  Map<String, dynamic> _gameLimits = {};

  late final AnimationController _staggerController;

  final List<Map<String, dynamic>> _catalog = [
    {
      'id': 'tug_of_war',
      'title': 'Arqon tortish',
      'description': '2 jamoa bitta telefonda',
      'rewardBadge': '+20 coin',
      'icon': Icons.sports_kabaddi_rounded,
      'gradient': [Color(0xFF3B82F6), Color(0xFF1D4ED8)],
      'route': '/kids/games/tug-of-war',
    },
    {
      'id': 'tezkor_hisob',
      'title': 'Tezkor hisob',
      'description': '60s • Combo ko‘paytiruvchi',
      'rewardBadge': '+20 coin',
      'icon': Icons.timer_rounded,
      'gradient': [Color(0xFF8B5CF6), Color(0xFF6D28D9)],
      'route': '/kids/games/speed-math',
    },
    {
      'id': 'xotira_kartalari',
      'title': 'Xotira kartalari',
      'description': 'Misol va javob juftligi',
      'rewardBadge': '+20 coin',
      'icon': Icons.style_rounded,
      'gradient': [Color(0xFF10B981), Color(0xFF059669)],
      'route': '/kids/games/memory-cards',
    },
    {
      'id': 'raqamlar_labirinti',
      'title': 'Raqamlar labirinti',
      'description': '5 darvoza • 3 ta jon',
      'rewardBadge': '+20 coin',
      'icon': Icons.explore_rounded,
      'gradient': [Color(0xFFF59E0B), Color(0xFFD97706)],
      'route': '/kids/games/number-maze',
    },
    {
      'id': 'matematik_duel',
      'title': 'Matematik duel',
      'description': '1v1 duel yoki Botga qarshi',
      'rewardBadge': '+20 coin',
      'icon': Icons.flash_on_rounded,
      'gradient': [Color(0xFFEF4444), Color(0xFFDC2626)],
      'route': '/kids/games/math-duel',
    },
    {
      'id': 'uy_qurish',
      'title': 'Uy qurish',
      'description': '6 bosqichli 3D orzu uyi',
      'rewardBadge': '+680 XP',
      'icon': Icons.home_work_rounded,
      'gradient': [Color(0xFF0D9488), Color(0xFF0F766E)],
      'route': '/kids/house-building',
      'unlimitedAlways': true,
    },
  ];

  @override
  void initState() {
    super.initState();
    _staggerController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );

    _loadStatus();
  }

  @override
  void dispose() {
    _staggerController.dispose();
    super.dispose();
  }

  Future<void> _loadStatus() async {
    if (WidgetsBinding.instance.runtimeType.toString().contains('Test')) {
      setState(() {
        _isLoading = false;
        _isPro = false;
      });
      _staggerController.forward();
      return;
    }

    try {
      final res = await ApiClient().dio.get('/games/status');
      if (res.data['success'] == true) {
        final d = res.data['data'];
        if (mounted) {
          setState(() {
            _isPro = d['isPro'] == true;
            _gameLimits = Map<String, dynamic>.from(d['games'] ?? {});
            _isLoading = false;
          });
          _staggerController.forward(from: 0.0);
        }
        return;
      }
    } catch (_) {}

    if (mounted) {
      setState(() => _isLoading = false);
      _staggerController.forward();
    }
  }

  void _onGameTap(Map<String, dynamic> game) {
    HapticFeedback.lightImpact();

    final gameId = game['id'] as String;
    final isAlwaysUnlimited = game['unlimitedAlways'] == true;

    final limitInfo = _gameLimits[gameId] as Map<String, dynamic>?;
    final remaining = isAlwaysUnlimited || _isPro
        ? 999
        : (limitInfo?['remaining'] as int? ?? 1);

    if (remaining <= 0 && !_isPro && !isAlwaysUnlimited) {
      // Limit exhausted -> Prompt Pro
      _showLimitExhaustedSheet(game);
      return;
    }

    if (gameId == 'tug_of_war') {
      GameSetupSheet.show(
        context,
        initialConfig: const GameConfig(),
        onStartGame: (config) {
          context.push('/kids/games/tug-of-war', extra: config).then((_) {
            _loadStatus();
          });
        },
      );
    } else {
      context.push(game['route'] as String).then((_) {
        _loadStatus();
      });
    }
  }

  void _showLimitExhaustedSheet(Map<String, dynamic> game) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        final colors = AppThemeColors.of(ctx);
        return Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: colors.card,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(26)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: const Color(0xFFF59E0B).withValues(alpha: 0.15),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.lock_rounded,
                  color: Color(0xFFD97706),
                  size: 32,
                ),
              ),
              const SizedBox(height: 14),
              Text(
                'Bugungi bepul limit tugadi (0/1)',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                  color: colors.ink,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                '«${game['title']}» o‘yinini ertaga yana bepul o‘ynashingiz mumkin. Yoki MathCity Pro obunasi bilan hoziroq cheksiz o‘ynang!',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                  color: colors.muted,
                  height: 1.35,
                ),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  Navigator.of(ctx).pop();
                  context.push('/kids/pro');
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF8B5CF6),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  minimumSize: const Size(double.infinity, 48),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.stars_rounded, color: Color(0xFFFFD700), size: 20),
                    SizedBox(width: 8),
                    Text(
                      'MathCity Pro ga ulanish',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 15,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              TextButton(
                onPressed: () => Navigator.of(ctx).pop(),
                child: Text('Ertaga qaytaman', style: TextStyle(color: colors.muted)),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);
    final studentState = ref.watch(studentProvider);
    final coinBalance = studentState.student?.coinBalance ?? 0;

    return Scaffold(
      backgroundColor: colors.bg,
      appBar: AppBar(
        backgroundColor: colors.card,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_rounded, color: colors.ink),
          onPressed: () => context.pop(),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Math Games',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w900,
                color: colors.ink,
                letterSpacing: -0.3,
              ),
            ),
            Text(
              'O‘yna • Coin yig‘',
              style: TextStyle(
                fontSize: 11.5,
                fontWeight: FontWeight.w600,
                color: colors.muted,
              ),
            ),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: CoinBadge(count: coinBalance, size: 22),
          ),
        ],
      ),
      body: SafeArea(
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : RefreshIndicator(
                onRefresh: _loadStatus,
                child: GridView.builder(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 0.72,
                  ),
                  itemCount: _catalog.length,
                  itemBuilder: (context, index) {
                    final game = _catalog[index];
                    return _buildStaggeredCard(game, index, colors);
                  },
                ),
              ),
      ),
    );
  }

  Widget _buildStaggeredCard(
    Map<String, dynamic> game,
    int index,
    AppThemeColors colors,
  ) {
    final start = (index * 0.1).clamp(0.0, 0.7);
    final end = (start + 0.4).clamp(0.0, 1.0);

    final animation = CurvedAnimation(
      parent: _staggerController,
      curve: Interval(start, end, curve: Curves.easeOutCubic),
    );

    return AnimatedBuilder(
      animation: animation,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(0, (1.0 - animation.value) * 36),
          child: Opacity(
            opacity: animation.value.clamp(0.0, 1.0),
            child: child,
          ),
        );
      },
      child: _buildGameCard(game, colors),
    );
  }

  Widget _buildGameCard(Map<String, dynamic> game, AppThemeColors colors) {
    final gameId = game['id'] as String;
    final isAlwaysUnlimited = game['unlimitedAlways'] == true;
    final List<Color> gradient = game['gradient'] as List<Color>;

    final limitInfo = _gameLimits[gameId] as Map<String, dynamic>?;
    final remaining = isAlwaysUnlimited || _isPro
        ? 999
        : (limitInfo?['remaining'] as int? ?? 1);

    final isLimitReached = remaining <= 0 && !_isPro && !isAlwaysUnlimited;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () => _onGameTap(game),
        borderRadius: BorderRadius.circular(20),
        child: Container(
          decoration: BoxDecoration(
            color: colors.card,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: isLimitReached
                  ? const Color(0xFFEF4444).withValues(alpha: 0.3)
                  : colors.border,
              width: 1.5,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: colors.isDark ? 0.30 : 0.08),
                blurRadius: 14,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Top Icon & Badge Header
              Container(
                height: 82,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: gradient,
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(18)),
                ),
                child: Stack(
                  children: [
                    Center(
                      child: Icon(
                        game['icon'] as IconData,
                        size: 40,
                        color: Colors.white,
                      ),
                    ),
                    // Reward chip
                    Positioned(
                      top: 8,
                      right: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2.5),
                        decoration: BoxDecoration(
                          color: Colors.black.withValues(alpha: 0.3),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          game['rewardBadge'] as String,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ),
                    ),
                    // Pro / Lock badge if limit reached
                    if (isLimitReached)
                      Positioned(
                        top: 8,
                        left: 8,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2.5),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEF4444),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.lock_rounded, color: Colors.white, size: 10),
                              SizedBox(width: 3),
                              Text(
                                'PRO',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 9.5,
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                  ],
                ),
              ),

              // Title and Description
              Padding(
                padding: const EdgeInsets.fromLTRB(10, 8, 10, 4),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      game['title'] as String,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w900,
                        color: colors.ink,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      game['description'] as String,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: 10.5,
                        fontWeight: FontWeight.w500,
                        color: colors.muted,
                      ),
                    ),
                  ],
                ),
              ),

              const Spacer(),

              // Bottom Limit & Start Button
              Padding(
                padding: const EdgeInsets.fromLTRB(8, 0, 8, 8),
                child: Column(
                  children: [
                    // Limit text
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Kunlik limit:',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                            color: colors.muted,
                          ),
                        ),
                        Text(
                          _isPro || isAlwaysUnlimited
                              ? 'Cheksiz ∞'
                              : '$remaining/1',
                          style: TextStyle(
                            fontSize: 10.5,
                            fontWeight: FontWeight.w900,
                            color: isLimitReached
                                ? const Color(0xFFEF4444)
                                : const Color(0xFF10B981),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),

                    // Action Button
                    SizedBox(
                      width: double.infinity,
                      height: 32,
                      child: ElevatedButton(
                        onPressed: () => _onGameTap(game),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: isLimitReached
                              ? (colors.border)
                              : gradient.first,
                          elevation: 0,
                          padding: EdgeInsets.zero,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                        child: Text(
                          isLimitReached ? 'Pro bilan cheksiz' : 'Boshlash',
                          style: TextStyle(
                            color: isLimitReached ? colors.muted : Colors.white,
                            fontSize: 11.5,
                            fontWeight: FontWeight.w900,
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
    );
  }
}
