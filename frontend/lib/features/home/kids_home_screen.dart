import 'dart:io' show Platform;
import 'dart:math' as math;
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/network/api_client.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/announcement_popup.dart';
import '../../core/widgets/animated_math_background.dart';
import '../../core/widgets/coin_badge.dart';
import '../../core/widgets/kids_shell_layout.dart';
import '../../core/widgets/mathcity_bottom_nav.dart';
import '../../core/widgets/user_avatar.dart';
import '../../core/widgets/xp_coin.dart';
import '../../shared/providers/student_provider.dart';
import '../../shared/providers/weekly_activity_provider.dart';
import 'widgets/weekly_streak_card.dart';

class KidsHomeScreen extends ConsumerStatefulWidget {
  const KidsHomeScreen({super.key});

  @override
  ConsumerState<KidsHomeScreen> createState() => _KidsHomeScreenState();
}

class _KidsHomeScreenState extends ConsumerState<KidsHomeScreen>
    with SingleTickerProviderStateMixin, WidgetsBindingObserver {
  late AnimationController _mathAnimController;
  int _completedTasksCount = 0;
  int _totalTasksCount = 4;
  String _taskProgressText = '5 ta matematika masalasini to‘g‘ri yeching';
  int _houseStage = 0;
  bool _isLoadingHouse = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _mathAnimController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 6),
    )..repeat();
    _loadDailyTasks();
    _loadHouseProgress();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        AnnouncementManager.checkAndShowAnnouncements(context, ref);
        AnnouncementManager.startLivePolling(context, ref);
      }
    });
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      if (!_mathAnimController.isAnimating) {
        _mathAnimController.repeat();
      }
      if (mounted) {
        AnnouncementManager.checkAndShowAnnouncements(context, ref);
        _loadHouseProgress();
        ref.read(weeklyActivityProvider.notifier).refresh();
      }
    } else {
      if (_mathAnimController.isAnimating) {
        _mathAnimController.stop();
      }
    }
  }

  Future<void> _loadHouseProgress() async {
    if (_isLoadingHouse) return;
    _isLoadingHouse = true;
    try {
      final prefs = await SharedPreferences.getInstance();
      final cached = prefs.getInt('mc_house_building_stage') ?? 0;
      if (mounted) setState(() => _houseStage = cached);

      if (!kIsWeb && Platform.environment.containsKey('FLUTTER_TEST')) return;

      final res = await ApiClient().dio.get(
        '/games/house-building',
        options: Options(
          validateStatus: (status) => true,
          sendTimeout: const Duration(seconds: 5),
          receiveTimeout: const Duration(seconds: 5),
        ),
      );
      if (res.statusCode == 200 && res.data != null && res.data['success'] == true) {
        final s = (res.data['data']['currentStage'] as num?)?.toInt() ?? 0;
        if (mounted) {
          setState(() => _houseStage = s);
        }
        await prefs.setInt('mc_house_building_stage', s);
      }
    } catch (_) {
    } finally {
      _isLoadingHouse = false;
    }
  }

  Future<void> _loadDailyTasks() async {
    if (!kIsWeb && Platform.environment.containsKey('FLUTTER_TEST')) return;
    try {
      final data = await ref.read(studentProvider.notifier).fetchDailyMissions();
      if (data != null && mounted) {
        final missions = data['missions'] as List<dynamic>? ?? [];
        final completed = data['completedCount'] as int? ?? 0;
        String taskDesc = '5 ta matematika masalasini to‘g‘ri yeching';
        if (missions.isNotEmpty) {
          final firstPending = missions.firstWhere(
            (m) => m['isCompleted'] != true,
            orElse: () => missions.first,
          );
          final title = firstPending['title'] ?? 'Matematika vazifasi';
          final curr = firstPending['currentProgress'] ?? firstPending['currentCount'] ?? 0;
          final target = firstPending['targetProgress'] ?? firstPending['targetCount'] ?? 5;
          taskDesc = '$title ($curr/$target)';
        }
        setState(() {
          _completedTasksCount = completed;
          _totalTasksCount = missions.isNotEmpty ? missions.length : 4;
          _taskProgressText = taskDesc;
        });
      }
    } catch (_) {}
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    AnnouncementManager.stopLivePolling();
    _mathAnimController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);
    final disableAnim = MediaQuery.of(context).disableAnimations;

    final studentState = ref.watch(studentProvider);
    final student = studentState.student;

    final coins = student?.coinBalance ?? 0;
    final xp = student?.totalXP ?? 0;
    final level = student?.level ?? 1;
    final name = (student != null && student.displayName.trim().isNotEmpty)
        ? student.displayName.trim()
        : 'O‘quvchi';

    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: colors.bg,
      body: Stack(
        children: [
          AnimatedMathBackground(isDark: isDark),
          SafeArea(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 100),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // ==============================================================
                  // 1. TOP HEADER: Username Pill + XP & Coin Pills (No Overflow at 320px)
                  // ==============================================================
                  Row(
                    children: [
                      // Username pill
                      Expanded(
                        child: Align(
                          alignment: Alignment.centerLeft,
                          child: FittedBox(
                            fit: BoxFit.scaleDown,
                            alignment: Alignment.centerLeft,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                              decoration: BoxDecoration(
                                color: isDark
                                    ? const Color(0xFF160E36).withValues(alpha: 0.85)
                                    : colors.card,
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                  color: isDark
                                      ? const Color(0xFF8B5CF6).withValues(alpha: 0.35)
                                      : colors.border,
                                  width: 1.2,
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: isDark
                                        ? const Color(0xFF7C3AED).withValues(alpha: 0.15)
                                        : Colors.black.withValues(alpha: 0.04),
                                    blurRadius: 8,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    student?.username != null && student!.username!.trim().isNotEmpty
                                        ? (student.username!.startsWith('@') ? student.username! : '@${student.username}')
                                        : (name.startsWith('@') ? name : '@$name'),
                                    style: TextStyle(
                                      fontFamily: 'Nunito',
                                      fontSize: 13,
                                      fontWeight: FontWeight.w800,
                                      color: colors.ink,
                                    ),
                                  ),
                                  if (student?.isPro == true) ...[
                                    const SizedBox(width: 6),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                      decoration: BoxDecoration(
                                        gradient: const LinearGradient(
                                          colors: [Color(0xFFFFB800), Color(0xFFFF8A00)],
                                        ),
                                        borderRadius: BorderRadius.circular(10),
                                      ),
                                      child: const Text(
                                        'PRO',
                                        style: TextStyle(
                                          fontFamily: 'Nunito',
                                          fontSize: 9,
                                          fontWeight: FontWeight.w900,
                                          color: Colors.white,
                                          letterSpacing: 0.5,
                                        ),
                                      ),
                                    ),
                                  ],
                                ],
                              ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 6),
                      // XP & Coin pills
                      FittedBox(
                        fit: BoxFit.scaleDown,
                        alignment: Alignment.centerRight,
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            XpBadge(count: xp, size: 22),
                            const SizedBox(width: 6),
                            CoinBadge(count: coins, size: 22),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // ==============================================================
                  // 2. AVATAR + WEEKLY STREAK IN ONE COMPACT ROW (NO SALOM TEXT)
                  // ==============================================================
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      GestureDetector(
                        onTap: () => context.push('/kids/profile'),
                        child: Stack(
                          clipBehavior: Clip.none,
                          children: [
                            UserAvatar(
                              avatarUrl: student?.avatarUrl,
                              displayName: name,
                              size: 56,
                              borderColor: const Color(0xFFA855F7),
                              borderWidth: 2.2,
                            ),
                            Positioned(
                              bottom: -4,
                              right: -4,
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  gradient: const LinearGradient(
                                    colors: [Color(0xFF8B5CF6), Color(0xFF6D28D9)],
                                  ),
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(color: Colors.white, width: 1.5),
                                  boxShadow: [
                                    BoxShadow(
                                      color: const Color(0xFF8B5CF6).withValues(alpha: 0.4),
                                      blurRadius: 6,
                                      offset: const Offset(0, 2),
                                    ),
                                  ],
                                ),
                                child: Text(
                                  'Lvl $level',
                                  style: const TextStyle(
                                    fontFamily: 'Nunito',
                                    fontSize: 10,
                                    fontWeight: FontWeight.w900,
                                    color: Colors.white,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: WeeklyStreakCard(colors: colors),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // ==============================================================
                  // 3. MILESTONE PILL (Level Progress with XpCoin)
                  // ==============================================================
                  _buildMilestonePill(xp, level, colors),
                  const SizedBox(height: 16),

                  // ==============================================================
                  // 4. MAIN HERO CARD: "MISOLLAR ISHLASH" with floating symbols
                  // ==============================================================
                  Container(
                    width: double.infinity,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(30),
                      gradient: const LinearGradient(
                        colors: [
                          Color(0xFF5B3BE8),
                          Color(0xFF7A58F8),
                          Color(0xFF9886FE),
                        ],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      border: Border.all(
                        color: const Color(0xFFDDD6FE).withValues(alpha: 0.4),
                        width: 1.2,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF6C47FF).withValues(alpha: 0.4),
                          blurRadius: 24,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(30),
                      child: Stack(
                        children: [
                          Positioned.fill(
                            child: RepaintBoundary(
                              child: AnimatedBuilder(
                                animation: _mathAnimController,
                                builder: (context, _) {
                                  final progress = disableAnim ? 0.0 : _mathAnimController.value;
                                  return CustomPaint(
                                    painter: _FloatingMathSymbolsPainter(progress: progress),
                                  );
                                },
                              ),
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 22),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(
                                      child: Align(
                                        alignment: Alignment.centerLeft,
                                        child: FittedBox(
                                          fit: BoxFit.scaleDown,
                                          child: Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                                            decoration: BoxDecoration(
                                              color: Colors.white.withValues(alpha: 0.22),
                                              borderRadius: BorderRadius.circular(999),
                                            ),
                                            child: const Row(
                                              mainAxisSize: MainAxisSize.min,
                                              children: [
                                                Icon(Icons.auto_awesome, color: Color(0xFFFFD66B), size: 14),
                                                SizedBox(width: 5),
                                                Text(
                                                  'MISOLLAR ISHLASH',
                                                  style: TextStyle(
                                                    color: Colors.white,
                                                    fontWeight: FontWeight.w800,
                                                    fontSize: 11,
                                                    letterSpacing: 1.0,
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 6),
                                    FittedBox(
                                      fit: BoxFit.scaleDown,
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          const XpCoin(size: 16, showGlow: false),
                                          const SizedBox(width: 4),
                                          const Text(
                                            '+XP',
                                            style: TextStyle(
                                              color: Colors.white,
                                              fontWeight: FontWeight.w900,
                                              fontSize: 12,
                                            ),
                                          ),
                                          const SizedBox(width: 8),
                                          const CoinIcon(size: 16),
                                          const SizedBox(width: 4),
                                          const Text(
                                            '+10',
                                            style: TextStyle(
                                              color: Colors.amberAccent,
                                              fontWeight: FontWeight.w900,
                                              fontSize: 12,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 16),
                                const Text(
                                  'Misollar ishlash',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 22,
                                    fontWeight: FontWeight.w900,
                                    letterSpacing: -0.3,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Bilimingni sinovdan o‘tkaz va tangalar yut!',
                                  style: TextStyle(
                                    color: Colors.white.withValues(alpha: 0.9),
                                    fontSize: 13,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                const SizedBox(height: 18),
                                FittedBox(
                                  fit: BoxFit.scaleDown,
                                  alignment: Alignment.centerLeft,
                                  child: ElevatedButton(
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.white,
                                      foregroundColor: const Color(0xFF5B3BE8),
                                      elevation: 0,
                                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 11),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(999),
                                      ),
                                    ),
                                    onPressed: () {
                                      context.push('/kids/exercise');
                                    },
                                    child: const Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Text(
                                          'Misollarni yechish',
                                          style: TextStyle(
                                            fontWeight: FontWeight.w800,
                                            fontSize: 14,
                                            color: Color(0xFF5B3BE8),
                                          ),
                                        ),
                                        SizedBox(width: 6),
                                        Icon(
                                          Icons.arrow_forward_rounded,
                                          size: 17,
                                          color: Color(0xFF5B3BE8),
                                        ),
                                      ],
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
                  const SizedBox(height: 14),

                  // ==============================================================
                  // 5. TWO FEATURE CARDS: "Reyting" & "Uy qurish" (Replaces Kosmik hisob)
                  // ==============================================================
                  Row(
                    children: [
                      // Card 1: Reyting
                      Expanded(
                        child: InkWell(
                          onTap: () => context.push('/kids/leaderboard'),
                          borderRadius: BorderRadius.circular(24),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                            decoration: BoxDecoration(
                              color: isDark
                                  ? const Color(0xFF160E36).withValues(alpha: 0.85)
                                  : colors.card,
                              borderRadius: BorderRadius.circular(24),
                              border: Border.all(
                                color: isDark
                                    ? const Color(0xFFFFD66B).withValues(alpha: 0.4)
                                    : colors.border,
                                width: 1.3,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: isDark
                                      ? const Color(0xFFF59E0B).withValues(alpha: 0.08)
                                      : Colors.black.withValues(alpha: 0.04),
                                  blurRadius: 14,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  width: 42,
                                  height: 42,
                                  decoration: BoxDecoration(
                                    gradient: const LinearGradient(
                                      colors: [Color(0xFFFFE082), Color(0xFFFFB300)],
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                    ),
                                    borderRadius: BorderRadius.circular(14),
                                    boxShadow: [
                                      BoxShadow(
                                        color: const Color(0xFFFFB300).withValues(alpha: 0.3),
                                        blurRadius: 8,
                                        offset: const Offset(0, 2),
                                      ),
                                    ],
                                  ),
                                  child: const Center(
                                    child: Icon(
                                      Icons.emoji_events_rounded,
                                      color: Colors.white,
                                      size: 24,
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  'Reyting',
                                  style: TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w900,
                                    color: colors.ink,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  student != null
                                      ? 'Siz ${student.rank}-o‘rindasiz'
                                      : 'Hali reytingda emassiz',
                                  style: const TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w700,
                                    color: Color(0xFFFBBF24),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),

                      // Card 2: Uy qurish
                      Expanded(
                        child: InkWell(
                          onTap: () => context.push('/kids/house-building'),
                          borderRadius: BorderRadius.circular(24),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                            decoration: BoxDecoration(
                              color: isDark
                                  ? const Color(0xFF160E36).withValues(alpha: 0.85)
                                  : colors.card,
                              borderRadius: BorderRadius.circular(24),
                              border: Border.all(
                                color: isDark
                                    ? const Color(0xFFA855F7).withValues(alpha: 0.4)
                                    : colors.border,
                                width: 1.3,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: isDark
                                      ? const Color(0xFF7C3AED).withValues(alpha: 0.12)
                                      : Colors.black.withValues(alpha: 0.04),
                                  blurRadius: 14,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  width: 42,
                                  height: 42,
                                  decoration: BoxDecoration(
                                    gradient: const LinearGradient(
                                      colors: [Color(0xFF8B5CF6), Color(0xFF6D28D9)],
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                    ),
                                    borderRadius: BorderRadius.circular(14),
                                    boxShadow: [
                                      BoxShadow(
                                        color: const Color(0xFF8B5CF6).withValues(alpha: 0.35),
                                        blurRadius: 8,
                                        offset: const Offset(0, 2),
                                      ),
                                    ],
                                  ),
                                  child: const Center(
                                    child: Icon(
                                      Icons.home_work_rounded,
                                      color: Colors.white,
                                      size: 24,
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  'Uy qurish',
                                  style: TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w900,
                                    color: colors.ink,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  _houseStage >= 6 ? 'Uy to‘liq tayyor! 🏆' : '$_houseStage/6 bosqich',
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w800,
                                    color: isDark ? const Color(0xFFC084FC) : colors.primary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // ==============================================================
                  // 6. AI USTOZ CARD (With official logo and online badge)
                  // ==============================================================
                  InkWell(
                    onTap: () => context.push('/kids/ai-tutor'),
                    borderRadius: BorderRadius.circular(24),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      decoration: BoxDecoration(
                        color: isDark
                            ? const Color(0xFF160E36).withValues(alpha: 0.85)
                            : colors.card,
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(
                          color: isDark
                              ? const Color(0xFFA855F7).withValues(alpha: 0.35)
                              : colors.border,
                          width: 1.3,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: isDark
                                ? const Color(0xFF7C3AED).withValues(alpha: 0.1)
                                : Colors.black.withValues(alpha: 0.04),
                            blurRadius: 14,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 46,
                            height: 46,
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(14),
                              boxShadow: [
                                BoxShadow(
                                  color: const Color(0xFF7C3AED).withValues(alpha: 0.35),
                                  blurRadius: 8,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(14),
                              child: Image.asset(
                                'assets/images/ai_ustoz_logo.png',
                                fit: BoxFit.cover,
                                errorBuilder: (_, __, ___) => Container(
                                  color: const Color(0xFF7C3AED),
                                  child: const Icon(Icons.school_rounded, color: Colors.white, size: 24),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Text(
                                      'AI Ustoz',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w900,
                                        color: colors.ink,
                                      ),
                                    ),
                                    const SizedBox(width: 6),
                                    Container(
                                      width: 7,
                                      height: 7,
                                      decoration: const BoxDecoration(
                                        color: Color(0xFF10B981),
                                        shape: BoxShape.circle,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Matematika ustozing • Har qanday misolni so‘rang',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w500,
                                    color: colors.muted,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const Icon(
                            Icons.chat_bubble_outline_rounded,
                            color: Color(0xFFA855F7),
                            size: 22,
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 14),

                  // ==============================================================
                  // 7. BUGUNGI VAZIFALAR (Daily Tasks)
                  // ==============================================================
                  InkWell(
                    onTap: () => context.push('/kids/daily-tasks'),
                    borderRadius: BorderRadius.circular(24),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
                      decoration: BoxDecoration(
                        color: isDark
                            ? const Color(0xFF160E36).withValues(alpha: 0.85)
                            : colors.card,
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(
                          color: isDark
                              ? const Color(0xFF8B5CF6).withValues(alpha: 0.25)
                              : colors.border,
                          width: 1.2,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: isDark
                                ? const Color(0xFF7C3AED).withValues(alpha: 0.08)
                                : Colors.black.withValues(alpha: 0.04),
                            blurRadius: 14,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Row(
                                  children: [
                                    const Icon(
                                      Icons.checklist_rounded,
                                      color: Color(0xFF34D399),
                                      size: 22,
                                    ),
                                    const SizedBox(width: 8),
                                    Expanded(
                                      child: Text(
                                        'Bugungi vazifalar',
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: TextStyle(
                                          fontSize: 15,
                                          fontWeight: FontWeight.w900,
                                          color: colors.ink,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF065F46).withValues(alpha: 0.6),
                                  borderRadius: BorderRadius.circular(999),
                                ),
                                child: Text(
                                  '$_completedTasksCount / $_totalTasksCount bajarildi',
                                  style: const TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w800,
                                    color: Color(0xFF34D399),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            _taskProgressText,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                              color: colors.muted,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: KidsNavShellScope.of(context)
          ? null
          : const MathCityBottomNav(currentIndex: 0),
    );
  }

  Widget _buildMilestonePill(int xp, int level, AppThemeColors colors) {
    final xpInCurrentLevel = xp % 100;
    final remainingXP = 100 - xpInCurrentLevel;
    final progress = (xpInCurrentLevel / 100.0).clamp(0.0, 1.0);
    final isDark = colors.isDark;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: isDark
            ? const Color(0xFF160E36).withValues(alpha: 0.85)
            : colors.card,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark
              ? const Color(0xFF8B5CF6).withValues(alpha: 0.25)
              : colors.border,
        ),
        boxShadow: isDark
            ? null
            : [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.03),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
      ),
      child: Row(
        children: [
          const XpCoin(size: 22, showGlow: false),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Flexible(
                      child: Text(
                        'Keyingi darajaga $remainingXP XP qoldi',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontFamily: 'Nunito',
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          color: isDark ? const Color(0xFFE9D5FF) : colors.ink,
                        ),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      '$xpInCurrentLevel / 100 XP',
                      style: TextStyle(
                        fontFamily: 'Nunito',
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: isDark ? const Color(0xFFC084FC) : colors.primary,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                ClipRRect(
                  borderRadius: BorderRadius.circular(999),
                  child: LinearProgressIndicator(
                    value: progress,
                    minHeight: 6,
                    backgroundColor: Colors.white12,
                    valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFFA855F7)),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Custom painter for floating mathematical symbols and light beams
class _FloatingMathSymbolsPainter extends CustomPainter {
  final double progress; // 0.0 to 1.0

  const _FloatingMathSymbolsPainter({required this.progress});

  static const List<({String symbol, double x, double y, double size})> _symbols = [
    (symbol: '+', x: 0.12, y: 0.22, size: 24),
    (symbol: '−', x: 0.82, y: 0.18, size: 22),
    (symbol: '×', x: 0.65, y: 0.68, size: 20),
    (symbol: '÷', x: 0.28, y: 0.78, size: 22),
    (symbol: 'π', x: 0.88, y: 0.58, size: 20),
    (symbol: '√', x: 0.44, y: 0.16, size: 24),
    (symbol: 'x²', x: 0.72, y: 0.38, size: 18),
    (symbol: '25+17=?', x: 0.15, y: 0.52, size: 14),
  ];

  @override
  void paint(Canvas canvas, Size size) {
    for (int i = 0; i < _symbols.length; i++) {
      final s = _symbols[i];
      final offset = (progress + (i * 0.125)) % 1.0;
      final waveY = math.sin(offset * math.pi * 2) * 8.0;
      final opacity = 0.12 + (math.sin(offset * math.pi * 2) + 1.0) * 0.08;

      final textSpan = TextSpan(
        text: s.symbol,
        style: TextStyle(
          color: Colors.white.withValues(alpha: opacity.clamp(0.06, 0.35)),
          fontSize: s.size,
          fontWeight: FontWeight.w900,
          fontFamily: 'Nunito',
        ),
      );
      final textPainter = TextPainter(
        text: textSpan,
        textDirection: TextDirection.ltr,
      )..layout();

      final posX = (s.x * size.width);
      final posY = (s.y * size.height) + waveY;
      textPainter.paint(canvas, Offset(posX, posY));
    }
  }

  @override
  bool shouldRepaint(covariant _FloatingMathSymbolsPainter oldDelegate) =>
      oldDelegate.progress != progress;
}
