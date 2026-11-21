import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/coin_badge.dart';
import '../../shared/providers/student_provider.dart';

class AchievementsScreen extends ConsumerStatefulWidget {
  const AchievementsScreen({super.key});

  @override
  ConsumerState<AchievementsScreen> createState() => _AchievementsScreenState();
}

class _AchievementsScreenState extends ConsumerState<AchievementsScreen> {
  bool _isLoading = true;
  bool _isPro = false;
  List<Map<String, dynamic>> _achievements = [];

  // Flying coin state
  bool _showFlyingCoin = false;
  Offset _flyingCoinStart = Offset.zero;
  Offset _flyingCoinEnd = Offset.zero;

  @override
  void initState() {
    super.initState();
    _loadAchievements();
  }

  Future<void> _loadAchievements() async {
    final res = await ref.read(studentProvider.notifier).fetchAchievements();
    if (!mounted) return;

    if (res['isPro'] == true && res['data'] != null) {
      setState(() {
        _isPro = true;
        _achievements = List<Map<String, dynamic>>.from(res['data']);
        _isLoading = false;
      });
    } else {
      setState(() {
        _isPro = false;
        _isLoading = false;
      });
    }
  }

  Future<void> _claimAchievement(Map<String, dynamic> ach, GlobalKey key) async {
    HapticFeedback.mediumImpact();
    final achKey = ach['key'] as String;

    final renderBox = key.currentContext?.findRenderObject() as RenderBox?;
    if (renderBox != null) {
      final startPos = renderBox.localToGlobal(Offset(renderBox.size.width - 60, renderBox.size.height / 2));
      setState(() {
        _flyingCoinStart = startPos;
        _flyingCoinEnd = const Offset(320, 48);
        _showFlyingCoin = true;
      });
      Future.delayed(const Duration(milliseconds: 700), () {
        if (mounted) setState(() => _showFlyingCoin = false);
      });
    }

    final res = await ref.read(studentProvider.notifier).claimAchievement(achKey);
    if (!mounted) return;

    if (res['success'] == true) {
      final coins = res['data']?['coinsAwarded'] ?? ach['rewardCoins'] ?? 10;
      final xp = res['data']?['xpAwarded'] ?? ach['rewardXP'] ?? 50;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          behavior: SnackBarBehavior.floating,
          backgroundColor: const Color(0xFF10B981),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          content: Text(
            'Tabriklaymiz! +$coins oltin tanga va +$xp XP hisobingizga qo‘shildi!',
            style: const TextStyle(fontWeight: FontWeight.w700, color: Colors.white),
          ),
        ),
      );
      _loadAchievements();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          behavior: SnackBarBehavior.floating,
          backgroundColor: const Color(0xFFEF4444),
          content: Text(res['error'] ?? 'Yutuq mukofotini olib bo‘lmadi.'),
        ),
      );
    }
  }

  IconData _getIconData(String? iconName) {
    switch (iconName) {
      case 'flag':
      case 'flag_rounded':
        return Icons.flag_rounded;
      case 'bolt':
      case 'bolt_rounded':
        return Icons.bolt_rounded;
      case 'rocket_launch':
      case 'rocket_launch_rounded':
        return Icons.rocket_launch_rounded;
      case 'local_fire_department':
      case 'local_fire_department_rounded':
        return Icons.local_fire_department_rounded;
      case 'adjust':
      case 'adjust_rounded':
        return Icons.adjust_rounded;
      default:
        return Icons.emoji_events_rounded;
    }
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
          icon: Icon(Icons.arrow_back_ios_new_rounded, color: colors.ink),
          onPressed: () => context.pop(),
        ),
        title: Text(
          'Yutuqlarim',
          style: TextStyle(
            fontWeight: FontWeight.w800,
            fontSize: 18,
            color: colors.ink,
          ),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Center(
              child: CoinBadge(count: coinBalance, size: 22),
            ),
          ),
        ],
      ),
      body: Stack(
        children: [
          _isLoading
              ? const Center(child: CircularProgressIndicator())
              : _isPro
                  ? _buildProAchievementsList(colors)
                  : _buildFreeProGatedView(colors),

          // Flying Coin Overlay
          if (_showFlyingCoin)
            TweenAnimationBuilder<double>(
              tween: Tween<double>(begin: 0.0, end: 1.0),
              duration: const Duration(milliseconds: 650),
              curve: Curves.easeInOutCubic,
              builder: (context, anim, child) {
                final currentOffset = Offset.lerp(_flyingCoinStart, _flyingCoinEnd, anim)!;
                final scale = 1.0 + 0.4 * (1.0 - (anim - 0.5).abs() * 2);
                return Positioned(
                  left: currentOffset.dx,
                  top: currentOffset.dy,
                  child: Transform.scale(
                    scale: scale,
                    child: Container(
                      width: 32,
                      height: 32,
                      decoration: const BoxDecoration(
                        color: Color(0xFFFFD66B),
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(color: Color(0x66F5A623), blurRadius: 10, offset: Offset(0, 2)),
                        ],
                      ),
                      child: const Center(
                        child: Icon(Icons.monetization_on_rounded, color: Color(0xFFD97706), size: 22),
                      ),
                    ),
                  ),
                );
              },
            ),
        ],
      ),
    );
  }

  Widget _buildProAchievementsList(AppThemeColors colors) {
    return RefreshIndicator(
      onRefresh: _loadAchievements,
      child: ListView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        itemCount: _achievements.length,
        itemBuilder: (context, index) {
          final ach = _achievements[index];
          final cardKey = GlobalKey();
          final isUnlocked = ach['isUnlocked'] == true;
          final isClaimed = ach['isClaimed'] == true;
          final coins = ach['rewardCoins'] ?? 10;
          final xp = ach['rewardXP'] ?? 50;
          final double progress = ((ach['progressRatio'] ?? 0.0) as num).toDouble().clamp(0.0, 1.0);
          final progressText = (ach['progressText'] ?? (isUnlocked ? 'Ochilgan' : '0/1')) as String;

          return Container(
            key: cardKey,
            margin: const EdgeInsets.only(bottom: 16),
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: colors.card,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(
                color: isUnlocked && !isClaimed
                    ? const Color(0xFFFFB800).withOpacity(0.5)
                    : colors.border,
                width: 1.5,
              ),
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
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        gradient: isUnlocked
                            ? const LinearGradient(
                                colors: [Color(0xFFFFD66B), Color(0xFFF5A623)],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              )
                            : null,
                        color: isUnlocked ? null : colors.field,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Icon(
                        _getIconData(ach['iconName']),
                        color: isUnlocked ? const Color(0xFF2A1B7A) : colors.muted,
                        size: 26,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            ach['title'] ?? 'Yutuq',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w800,
                              color: colors.ink,
                            ),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            ach['description'] ?? '',
                            style: TextStyle(
                              fontSize: 13,
                              color: colors.muted,
                              height: 1.3,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFF7ED),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        '+$coins tanga · $xp XP',
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFFD97706),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),

                // Progress Bar
                Row(
                  children: [
                    Expanded(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(6),
                        child: LinearProgressIndicator(
                          value: progress,
                          minHeight: 7,
                          backgroundColor: colors.field,
                          color: isUnlocked ? const Color(0xFF10B981) : colors.primary,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Text(
                      progressText,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: colors.muted,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),

                // Claim Button
                Align(
                  alignment: Alignment.centerRight,
                  child: isClaimed
                      ? Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          decoration: BoxDecoration(
                            color: const Color(0xFFE1F6EC),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.check_rounded, color: Color(0xFF10B981), size: 16),
                              SizedBox(width: 4),
                              Text(
                                'Olingan ✓',
                                style: TextStyle(
                                  color: Color(0xFF10B981),
                                  fontWeight: FontWeight.w800,
                                  fontSize: 13,
                                ),
                              ),
                            ],
                          ),
                        )
                      : isUnlocked
                          ? ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF10B981),
                                foregroundColor: Colors.white,
                                elevation: 2,
                                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14),
                                ),
                              ),
                              onPressed: () => _claimAchievement(ach, cardKey),
                              child: const Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(Icons.stars_rounded, size: 18),
                                  SizedBox(width: 6),
                                  Text(
                                    'Mukofotni olish',
                                    style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13),
                                  ),
                                ],
                              ),
                            )
                          : Container(
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                              decoration: BoxDecoration(
                                color: colors.field,
                                borderRadius: BorderRadius.circular(14),
                                border: Border.all(color: colors.border),
                              ),
                              child: const Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(Icons.lock_outline_rounded, size: 14, color: Color(0xFF94A3B8)),
                                  SizedBox(width: 4),
                                  Text(
                                    'Bajarilmoqda',
                                    style: TextStyle(
                                      color: Color(0xFF94A3B8),
                                      fontWeight: FontWeight.w700,
                                      fontSize: 13,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildFreeProGatedView(AppThemeColors colors) {
    return Stack(
      children: [
        // Blurred mockup background
        Opacity(
          opacity: 0.35,
          child: ImageFiltered(
            imageFilter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
              itemCount: 4,
              itemBuilder: (context, idx) {
                return Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  height: 120,
                  decoration: BoxDecoration(
                    color: colors.card,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: colors.border),
                  ),
                );
              },
            ),
          ),
        ),

        // Centered Lock Card
        Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 28),
            child: Container(
              padding: const EdgeInsets.all(28),
              decoration: BoxDecoration(
                color: colors.card,
                borderRadius: BorderRadius.circular(28),
                border: Border.all(color: colors.border, width: 1.5),
                boxShadow: [
                  BoxShadow(
                    color: colors.primary.withOpacity(0.18),
                    blurRadius: 30,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFFFFD66B), Color(0xFFF5A623)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFFF5A623).withOpacity(0.35),
                          blurRadius: 16,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: const Center(
                      child: Icon(Icons.lock_rounded, color: Color(0xFF2A1B7A), size: 36),
                    ),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    'Yutuqlar Pro tarifda ochiladi',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                      color: colors.ink,
                      letterSpacing: -0.3,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Har bir yutuq uchun 10–20 oltin tanga, maxsus XP va eksklyuziv nishonlar beriladi.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 14,
                      color: colors.muted,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: colors.primary,
                        foregroundColor: Colors.white,
                        elevation: 4,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                      onPressed: () {
                        context.push('/tariflar');
                      },
                      child: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.workspace_premium_rounded, size: 20),
                          SizedBox(width: 8),
                          Text(
                            'MathCity Pro olish',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
