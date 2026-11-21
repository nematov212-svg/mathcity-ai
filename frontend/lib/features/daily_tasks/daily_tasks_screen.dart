import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/coin_badge.dart';
import '../../shared/providers/student_provider.dart';

class DailyTasksScreen extends ConsumerStatefulWidget {
  const DailyTasksScreen({super.key});

  @override
  ConsumerState<DailyTasksScreen> createState() => _DailyTasksScreenState();
}

class _DailyTasksScreenState extends ConsumerState<DailyTasksScreen> with SingleTickerProviderStateMixin {
  List<Map<String, dynamic>> _missions = [];
  bool _isLoading = true;
  int _secondsUntilMidnight = 0;
  Timer? _countdownTimer;

  // Pulse animation for claimable buttons
  late AnimationController _pulseController;

  // Flying coin animation state
  bool _showFlyingCoin = false;
  Offset _flyingCoinStart = Offset.zero;
  Offset _flyingCoinEnd = Offset.zero;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    )..repeat(reverse: true);

    _loadMissions();
  }

  @override
  void dispose() {
    _countdownTimer?.cancel();
    _pulseController.dispose();
    super.dispose();
  }

  Future<void> _loadMissions() async {
    final data = await ref.read(studentProvider.notifier).fetchDailyMissions();
    if (!mounted) return;

    if (data != null && data['missions'] != null) {
      final list = List<Map<String, dynamic>>.from(data['missions']);
      final secs = (data['secondsUntilMidnight'] ?? 0) as int;
      setState(() {
        _missions = list;
        _secondsUntilMidnight = secs;
        _isLoading = false;
      });
      _startTimer();
    } else {
      setState(() => _isLoading = false);
    }
  }

  void _startTimer() {
    _countdownTimer?.cancel();
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }
      if (_secondsUntilMidnight > 0) {
        setState(() => _secondsUntilMidnight--);
      } else {
        timer.cancel();
        _loadMissions(); // Midnight reached, refresh missions
      }
    });
  }

  String _formatCountdown(int totalSeconds) {
    if (totalSeconds <= 0) return '00:00:00';
    final hours = totalSeconds ~/ 3600;
    final minutes = (totalSeconds % 3600) ~/ 60;
    final seconds = totalSeconds % 60;
    return '${hours.toString().padLeft(2, '0')}:${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }

  Future<void> _claimReward(Map<String, dynamic> mission, GlobalKey cardKey) async {
    HapticFeedback.mediumImpact();
    final missionId = mission['id'] ?? mission['templateId'];

    // Capture render position for flying coin animation
    final renderBox = cardKey.currentContext?.findRenderObject() as RenderBox?;
    if (renderBox != null) {
      final startPos = renderBox.localToGlobal(Offset(renderBox.size.width - 60, renderBox.size.height / 2));
      setState(() {
        _flyingCoinStart = startPos;
        _flyingCoinEnd = const Offset(320, 48); // Top right coin badge area
        _showFlyingCoin = true;
      });
      Future.delayed(const Duration(milliseconds: 700), () {
        if (mounted) setState(() => _showFlyingCoin = false);
      });
    }

    final res = await ref.read(studentProvider.notifier).claimDailyMission(missionId);
    if (!mounted) return;

    if (res['success'] == true) {
      final coins = res['data']?['coinsAwarded'] ?? mission['rewardCoins'] ?? 1;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          behavior: SnackBarBehavior.floating,
          backgroundColor: const Color(0xFF10B981),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          content: Row(
            children: [
              const Icon(Icons.stars_rounded, color: Colors.white, size: 24),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  'Tabriklaymiz! +$coins oltin tanga hisobingizga qo‘shildi!',
                  style: const TextStyle(fontWeight: FontWeight.w700, color: Colors.white),
                ),
              ),
            ],
          ),
        ),
      );
      _loadMissions();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          behavior: SnackBarBehavior.floating,
          backgroundColor: const Color(0xFFEF4444),
          content: Text(res['error'] ?? 'Mukofotni olib bo‘lmadi.'),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);
    final studentState = ref.watch(studentProvider);
    final coinBalance = studentState.student?.coinBalance ?? 0;

    final completedCount = _missions.where((m) => m['isCompleted'] == true || m['status'] == 'COMPLETED' || m['status'] == 'CLAIMED').length;

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
          'Kunlik vazifalar',
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
              : RefreshIndicator(
                  onRefresh: _loadMissions,
                  child: ListView(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
                    children: [
                      // Top Progress & Live Countdown Card
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFF6C47FF), Color(0xFF8B6BFF)],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(24),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFF6C47FF).withOpacity(0.28),
                              blurRadius: 18,
                              offset: const Offset(0, 6),
                            ),
                          ],
                        ),
                        child: Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text(
                                      'Bugungi reja',
                                      style: TextStyle(
                                        color: Colors.white70,
                                        fontSize: 13,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      '$completedCount / 3 bajarildi',
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 22,
                                        fontWeight: FontWeight.w900,
                                      ),
                                    ),
                                  ],
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withOpacity(0.18),
                                    borderRadius: BorderRadius.circular(16),
                                  ),
                                  child: Row(
                                    children: [
                                      const Icon(Icons.timer_outlined, color: Colors.white, size: 16),
                                      const SizedBox(width: 6),
                                      Text(
                                        _formatCountdown(_secondsUntilMidnight),
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontWeight: FontWeight.w800,
                                          fontSize: 13,
                                          fontFeatures: [FontFeature.tabularFigures()],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 20),

                            // 3 Step Dots
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                              children: List.generate(3, (idx) {
                                final isDone = idx < completedCount;
                                final isCurrent = idx == completedCount;
                                return Row(
                                  children: [
                                    Container(
                                      width: 40,
                                      height: 40,
                                      decoration: BoxDecoration(
                                        color: isDone
                                            ? const Color(0xFF10B981)
                                            : isCurrent
                                                ? Colors.white
                                                : Colors.white.withOpacity(0.22),
                                        shape: BoxShape.circle,
                                        boxShadow: isDone || isCurrent
                                            ? const [BoxShadow(color: Colors.black26, blurRadius: 6)]
                                            : null,
                                      ),
                                      child: Center(
                                        child: isDone
                                            ? const Icon(Icons.check_rounded, color: Colors.white, size: 22)
                                            : isCurrent
                                                ? const Text(
                                                    '⏳',
                                                    style: TextStyle(fontSize: 18),
                                                  )
                                                : Text(
                                                    '${idx + 1}',
                                                    style: const TextStyle(
                                                      color: Colors.white,
                                                      fontWeight: FontWeight.w800,
                                                      fontSize: 16,
                                                    ),
                                                  ),
                                      ),
                                    ),
                                    if (idx < 2)
                                      Container(
                                        width: 50,
                                        height: 4,
                                        margin: const EdgeInsets.symmetric(horizontal: 8),
                                        decoration: BoxDecoration(
                                          color: idx < completedCount ? const Color(0xFF10B981) : Colors.white.withOpacity(0.25),
                                          borderRadius: BorderRadius.circular(2),
                                        ),
                                      ),
                                  ],
                                );
                              }),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 24),
                      Text(
                        'Bugungi vazifalar',
                        style: TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w800,
                          color: colors.ink,
                        ),
                      ),
                      const SizedBox(height: 12),

                      // 3 Task Cards
                      ..._missions.map((mission) {
                        final cardKey = GlobalKey();
                        final current = (mission['currentCount'] ?? 0) as int;
                        final target = (mission['targetCount'] ?? 1) as int;
                        final rewardCoins = (mission['rewardCoins'] ?? 1) as int;
                        final isCompleted = mission['isCompleted'] == true || current >= target;
                        final isClaimed = mission['claimed'] == true || mission['status'] == 'CLAIMED';
                        final double progress = (current / target).clamp(0.0, 1.0);

                        return Container(
                          key: cardKey,
                          margin: const EdgeInsets.only(bottom: 14),
                          padding: const EdgeInsets.all(18),
                          decoration: BoxDecoration(
                            color: colors.card,
                            borderRadius: BorderRadius.circular(22),
                            border: Border.all(
                              color: isCompleted && !isClaimed
                                  ? const Color(0xFF10B981).withOpacity(0.5)
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
                                    width: 44,
                                    height: 44,
                                    decoration: BoxDecoration(
                                      color: isClaimed
                                          ? const Color(0xFFE1F6EC)
                                          : isCompleted
                                              ? const Color(0xFFD1FAE5)
                                              : colors.primary.withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(14),
                                    ),
                                    child: Icon(
                                      isClaimed
                                          ? Icons.check_circle_rounded
                                          : isCompleted
                                              ? Icons.celebration_rounded
                                              : Icons.task_alt_rounded,
                                      color: isClaimed
                                          ? const Color(0xFF10B981)
                                          : isCompleted
                                              ? const Color(0xFF059669)
                                              : colors.primary,
                                      size: 24,
                                    ),
                                  ),
                                  const SizedBox(width: 14),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          mission['title'] ?? 'Kunlik vazifa',
                                          style: TextStyle(
                                            fontSize: 16,
                                            fontWeight: FontWeight.w800,
                                            color: colors.ink,
                                          ),
                                        ),
                                        const SizedBox(height: 3),
                                        Text(
                                          mission['description'] ?? '',
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
                                      border: Border.all(color: const Color(0xFFFFEDD5)),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        const Icon(Icons.monetization_on_rounded, color: Color(0xFFF59E0B), size: 14),
                                        const SizedBox(width: 4),
                                        Text(
                                          '+$rewardCoins',
                                          style: const TextStyle(
                                            fontSize: 12,
                                            fontWeight: FontWeight.w800,
                                            color: Color(0xFFD97706),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 14),

                              // Progress bar
                              Row(
                                children: [
                                  Expanded(
                                    child: ClipRRect(
                                      borderRadius: BorderRadius.circular(6),
                                      child: LinearProgressIndicator(
                                        value: progress,
                                        minHeight: 7,
                                        backgroundColor: isClaimed
                                            ? const Color(0xFFE2E8F0)
                                            : const Color(0xFFEDE9FE),
                                        color: isClaimed
                                            ? const Color(0xFF94A3B8)
                                            : isCompleted
                                                ? const Color(0xFF10B981)
                                                : colors.primary,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Text(
                                    '$current / $target',
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w800,
                                      color: colors.muted,
                                    ),
                                  ),
                                ],
                              ),

                              const SizedBox(height: 14),

                              // Action Button
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
                                    : isCompleted
                                        ? AnimatedBuilder(
                                            animation: _pulseController,
                                            builder: (context, child) {
                                              final scale = 1.0 + _pulseController.value * 0.04;
                                              return Transform.scale(
                                                scale: scale,
                                                child: ElevatedButton(
                                                  style: ElevatedButton.styleFrom(
                                                    backgroundColor: const Color(0xFF10B981),
                                                    foregroundColor: Colors.white,
                                                    elevation: 2,
                                                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                                                    shape: RoundedRectangleBorder(
                                                      borderRadius: BorderRadius.circular(14),
                                                    ),
                                                  ),
                                                  onPressed: () => _claimReward(mission, cardKey),
                                                  child: const Row(
                                                    mainAxisSize: MainAxisSize.min,
                                                    children: [
                                                      Icon(Icons.card_giftcard_rounded, size: 18),
                                                      SizedBox(width: 6),
                                                      Text(
                                                        'Mukofotni olish',
                                                        style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13),
                                                      ),
                                                    ],
                                                  ),
                                                ),
                                              );
                                            },
                                          )
                                        : Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                            decoration: BoxDecoration(
                                              color: colors.field,
                                              borderRadius: BorderRadius.circular(14),
                                              border: Border.all(color: colors.border),
                                            ),
                                            child: Text(
                                              'Bajarilmoqda',
                                              style: TextStyle(
                                                color: colors.muted,
                                                fontWeight: FontWeight.w700,
                                                fontSize: 13,
                                              ),
                                            ),
                                          ),
                              ),
                            ],
                          ),
                        );
                      }),
                    ],
                  ),
                ),

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
}
