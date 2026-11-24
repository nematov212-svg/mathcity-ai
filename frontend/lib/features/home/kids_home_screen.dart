import 'dart:io' show Platform;
import 'dart:math' as math;
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/announcement_popup.dart';
import '../../core/widgets/coin_badge.dart';
import '../../core/widgets/mathcity_bottom_nav.dart';
import '../../core/widgets/user_avatar.dart';
import '../../shared/providers/student_provider.dart';

class KidsHomeScreen extends ConsumerStatefulWidget {
  const KidsHomeScreen({super.key});

  @override
  ConsumerState<KidsHomeScreen> createState() => _KidsHomeScreenState();
}

class _KidsHomeScreenState extends ConsumerState<KidsHomeScreen> with SingleTickerProviderStateMixin {
  late AnimationController _mathAnimController;
  int _completedTasksCount = 0;
  int _totalTasksCount = 4;
  String _taskProgressText = '5 ta matematika masalasini to‘g‘ri yeching';

  @override
  void initState() {
    super.initState();
    _mathAnimController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 6),
    )..repeat();
    _loadDailyTasks();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        AnnouncementManager.checkAndShowAnnouncements(context, ref);
      }
    });
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
    _mathAnimController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final disableAnim = MediaQuery.of(context).disableAnimations;

    final studentState = ref.watch(studentProvider);
    final student = studentState.student;

    final coins = student?.coinBalance ?? 0;
    final xp = student?.totalXP ?? 0;
    final level = student?.level ?? 1;
    final name = (student != null && student.displayName.trim().isNotEmpty) ? student.displayName.trim() : 'O‘quvchi';

    return Scaffold(
      backgroundColor: colors.bg,
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 100),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ==============================================================
              // 1. IBRAT AKADEMIYA STYLE HEADER
              // ==============================================================
              // Row 1: Bayroq / PRO / XP / Coin status pills
              FittedBox(
                fit: BoxFit.scaleDown,
                alignment: Alignment.centerLeft,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Country/Language Flag Pill
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: colors.card,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: colors.border.withOpacity(0.5)),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.04),
                            blurRadius: 6,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Text('🇺🇿', style: TextStyle(fontSize: 14)),
                          const SizedBox(width: 4),
                          Text(
                            'O‘zbek',
                            style: TextStyle(
                              fontFamily: 'Nunito',
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: colors.ink,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    // PRO Status Pill
                    GestureDetector(
                      onTap: () => context.push('/kids/pricing'),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFFFFB800), Color(0xFFFF8A00)],
                          ),
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFFFFB800).withOpacity(0.35),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              student?.isPro == true ? Icons.workspace_premium_rounded : Icons.star_rounded,
                              color: Colors.white,
                              size: 14,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              student?.isPro == true ? 'PRO' : 'PRO',
                              style: const TextStyle(
                                fontFamily: 'Nunito',
                                fontSize: 11,
                                fontWeight: FontWeight.w900,
                                color: Colors.white,
                                letterSpacing: 0.5,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    // XP Pill
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: const Color(0xFFEDE9FE),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFFDDD6FE)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.bolt_rounded, color: Color(0xFF7C3AED), size: 15),
                          const SizedBox(width: 3),
                          Text(
                            '$xp XP',
                            style: const TextStyle(
                              fontFamily: 'Nunito',
                              fontSize: 12,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF6D28D9),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    // Coin Badge
                    CoinBadge(count: coins, size: 26),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Row 2: Avatar with Level Badge Overlay + Greeting
              Row(
                children: [
                  GestureDetector(
                    onTap: () => context.push('/kids/profile'),
                    child: Stack(
                      clipBehavior: Clip.none,
                      children: [
                        UserAvatar(
                          avatarUrl: student?.avatarUrl,
                          displayName: name,
                          size: 52,
                          borderColor: colors.primary,
                          borderWidth: 2.2,
                        ),
                        Positioned(
                          bottom: -4,
                          right: -4,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: const Color(0xFF6A4CFF),
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: Colors.white, width: 1.5),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.18),
                                  blurRadius: 4,
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
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Salom, $name! 👋',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w900,
                            color: colors.ink,
                            letterSpacing: -0.3,
                          ),
                        ),
                        const SizedBox(height: 3),
                        Text(
                          'Bugun yangi marralarni zabt etamiz!',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: colors.muted,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Row 3: Weekly Streak tracker (7 days: D, S, Ch, P, J, Sh, Ya)
              _buildWeeklyStreakCard(student?.currentStreak ?? 1, colors),
              const SizedBox(height: 12),

              // Row 4: Milestone Pill (Next level progress)
              _buildMilestonePill(xp, level, colors),
              const SizedBox(height: 18),

              // ==============================================================
              // 3. MAIN HERO CARD: "MISOLLAR ISHLASH" with floating math symbols
              // ==============================================================
              Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(36),
                  gradient: const LinearGradient(
                    colors: [
                      Color(0xFF5B3BE8),
                      Color(0xFF7A58F8),
                      Color(0xFF9886FE),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF6C47FF).withOpacity(0.35),
                      blurRadius: 24,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(36),
                  child: Stack(
                    children: [
                      // Floating Animated Math Expressions
                      Positioned.fill(
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
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 26),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Top Row: "MISOLLAR ISHLASH" pill badge and calculation icon
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: Align(
                                    alignment: Alignment.centerLeft,
                                    child: FittedBox(
                                      fit: BoxFit.scaleDown,
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                                        decoration: BoxDecoration(
                                          color: Colors.white.withOpacity(0.24),
                                          borderRadius: BorderRadius.circular(999),
                                        ),
                                        child: const Row(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Icon(Icons.auto_awesome, color: Color(0xFFFFD66B), size: 14),
                                            SizedBox(width: 6),
                                            Text(
                                              'MISOLLAR ISHLASH',
                                              style: TextStyle(
                                                color: Colors.white,
                                                fontWeight: FontWeight.w800,
                                                fontSize: 11,
                                                letterSpacing: 1.1,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                const Icon(
                                  Icons.calculate_rounded,
                                  color: Colors.white,
                                  size: 28,
                                ),
                              ],
                            ),
                            const SizedBox(height: 18),

                            // Title & Subtitle
                            const Text(
                              'Misollar ishlash',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 24,
                                fontWeight: FontWeight.w900,
                                letterSpacing: -0.3,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              'Kundalik mashqlar, misollar va darajangizni oshiring',
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.9),
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(height: 22),

                            // White Pill Button: "Misollarni yechish →"
                            ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.white,
                                foregroundColor: const Color(0xFF5B3BE8),
                                elevation: 0,
                                padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 12),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(999),
                                ),
                              ),
                              onPressed: () {
                                context.push('/kids/exercise');
                              },
                              child: const FittedBox(
                                fit: BoxFit.scaleDown,
                                child: Row(
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
                                    SizedBox(width: 8),
                                    Icon(
                                      Icons.arrow_forward_rounded,
                                      size: 18,
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
              const SizedBox(height: 16),

              // ==============================================================
              // 4. TWO FEATURE CARDS: "Mening shahrim" & "Kosmik hisob"
              // ==============================================================
              Row(
                children: [
                  // Card 1: Reyting
                  Expanded(
                    child: InkWell(
                      onTap: () => context.push('/kids/leaderboard'),
                      borderRadius: BorderRadius.circular(28),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 20),
                        decoration: BoxDecoration(
                          color: colors.card,
                          borderRadius: BorderRadius.circular(28),
                          border: Border.all(
                            color: const Color(0xFFFFD66B).withOpacity(0.5),
                            width: 1.4,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFFF59E0B).withOpacity(0.08),
                              blurRadius: 16,
                              offset: const Offset(0, 6),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              width: 46,
                              height: 46,
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [Color(0xFFFFE082), Color(0xFFFFB300)],
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                ),
                                borderRadius: BorderRadius.circular(16),
                                boxShadow: [
                                  BoxShadow(
                                    color: const Color(0xFFFFB300).withOpacity(0.3),
                                    blurRadius: 8,
                                    offset: const Offset(0, 3),
                                  ),
                                ],
                              ),
                              child: const Center(
                                child: Icon(
                                  Icons.emoji_events_rounded,
                                  color: Colors.white,
                                  size: 26,
                                ),
                              ),
                            ),
                            const SizedBox(height: 14),
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
                                color: Color(0xFFD97706),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),

                  // Card 2: Kosmik hisob (O‘yinlar)
                  Expanded(
                    child: InkWell(
                      onTap: () => context.push('/kids/games/space-math'),
                      borderRadius: BorderRadius.circular(28),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 20),
                        decoration: BoxDecoration(
                          color: colors.card,
                          borderRadius: BorderRadius.circular(28),
                          border: Border.all(color: colors.border, width: 1.2),
                          boxShadow: [
                            BoxShadow(
                              color: isDark ? Colors.black26 : const Color(0xFF7154EC).withOpacity(0.04),
                              blurRadius: 16,
                              offset: const Offset(0, 6),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              width: 46,
                              height: 46,
                              decoration: BoxDecoration(
                                color: const Color(0xFFFEE8DC),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: const Center(
                                child: Icon(
                                  Icons.rocket_launch_rounded,
                                  color: Color(0xFFEA580C),
                                  size: 26,
                                ),
                              ),
                            ),
                            const SizedBox(height: 14),
                            Text(
                              'Kosmik hisob',
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w900,
                                color: colors.ink,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const CoinIcon(size: 13),
                                const SizedBox(width: 4),
                                Flexible(
                                  child: Text(
                                    coins > 0 ? '+$coins oltin tanga' : '0 oltin tanga',
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      fontSize: 12,
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
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // ==============================================================
              // 5. ZIYO AI USTOZ CARD
              // ==============================================================
              InkWell(
                onTap: () => context.push('/kids/ai-tutor'),
                borderRadius: BorderRadius.circular(28),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF1E1748) : const Color(0xFFF2F0FF),
                    borderRadius: BorderRadius.circular(28),
                    border: Border.all(color: colors.primary.withOpacity(0.2), width: 1.2),
                    boxShadow: [
                      BoxShadow(
                        color: colors.primary.withOpacity(0.06),
                        blurRadius: 16,
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
                          shape: BoxShape.circle,
                          color: colors.primary,
                        ),
                        child: const Center(
                          child: Icon(
                            Icons.smart_toy_rounded,
                            color: Colors.white,
                            size: 24,
                          ),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'AI Ustoz',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w900,
                                color: colors.ink,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Tushunmagan misolingiz bormi? So‘rang!',
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
                      Icon(
                        Icons.chat_bubble_outline_rounded,
                        color: colors.primary,
                        size: 22,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // ==============================================================
              // 6. DARSLAR XARITASI (Preserved below AI Ustoz as requested)
              // ==============================================================
              InkWell(
                onTap: () => context.push('/kids/lessons'),
                borderRadius: BorderRadius.circular(28),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
                  decoration: BoxDecoration(
                    color: colors.card,
                    borderRadius: BorderRadius.circular(28),
                    border: Border.all(color: colors.border, width: 1.2),
                    boxShadow: [
                      BoxShadow(
                        color: isDark ? Colors.black26 : const Color(0xFF7154EC).withOpacity(0.04),
                        blurRadius: 16,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: colors.primary.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Icon(
                          Icons.map_rounded,
                          color: colors.primary,
                          size: 24,
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Darslar xaritasi',
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w900,
                                color: colors.ink,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Sinflar bo‘yicha bosqichma-bosqich o‘rganish',
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
                      Icon(
                        Icons.arrow_forward_ios_rounded,
                        color: colors.muted,
                        size: 16,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // ==============================================================
              // 7. BUGUNGI VAZIFALAR
              // ==============================================================
              InkWell(
                onTap: () => context.push('/kids/daily-tasks'),
                borderRadius: BorderRadius.circular(28),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
                  decoration: BoxDecoration(
                    color: colors.card,
                    borderRadius: BorderRadius.circular(28),
                    border: Border.all(color: colors.border, width: 1.2),
                    boxShadow: [
                      BoxShadow(
                        color: isDark ? Colors.black26 : const Color(0xFF7154EC).withOpacity(0.04),
                        blurRadius: 16,
                        offset: const Offset(0, 6),
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
                                  color: Color(0xFF0F9D58),
                                  size: 22,
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    'Bugungi vazifalar',
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w900,
                                      color: colors.ink,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          // Mint Pill Progress Badge
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                            decoration: BoxDecoration(
                              color: const Color(0xFFD4F8E6),
                              borderRadius: BorderRadius.circular(999),
                            ),
                            child: Text(
                              '$_completedTasksCount / $_totalTasksCount bajarildi',
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF0F9D58),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Text(
                        _taskProgressText,
                        style: TextStyle(
                          fontSize: 13,
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
      // ==============================================================
      // 8. UNIFIED 5-TAB FLOATING GLASS BOTTOM NAVIGATION BAR
      // ==============================================================
      bottomNavigationBar: const MathCityBottomNav(currentIndex: 0),
    );
  }

  Widget _buildWeeklyStreakCard(int streak, AppThemeColors colors) {
    final now = DateTime.now();
    final todayWeekday = now.weekday; // 1 = Monday, 7 = Sunday
    final dayNames = ['D', 'S', 'Ch', 'P', 'J', 'Sh', 'Ya'];

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: colors.border.withOpacity(0.5)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Text('🔥', style: TextStyle(fontSize: 18)),
                  const SizedBox(width: 6),
                  Text(
                    '$streak kunlik seriya',
                    style: TextStyle(
                      fontFamily: 'Nunito',
                      fontSize: 14,
                      fontWeight: FontWeight.w800,
                      color: colors.ink,
                    ),
                  ),
                ],
              ),
              const SizedBox(width: 8),
              Flexible(
                child: Text(
                  'Har kuni shug‘ullaning',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontFamily: 'Nunito',
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: colors.muted,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: List.generate(7, (index) {
              final dayIndex = index + 1; // 1 to 7
              final isToday = dayIndex == todayWeekday;
              final isPastOrToday = dayIndex <= todayWeekday;
              final isActive = isPastOrToday && (todayWeekday - dayIndex < (streak > 0 ? streak : 1));

              return Expanded(
                child: Column(
                  children: [
                    Container(
                      constraints: const BoxConstraints(maxWidth: 36, maxHeight: 36),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: isActive
                            ? const LinearGradient(
                                colors: [Color(0xFFFF7A00), Color(0xFFFF4800)],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              )
                            : null,
                        color: isActive ? null : (isToday ? const Color(0xFFEDE9FE) : const Color(0xFFF1F5F9)),
                        border: isToday && !isActive
                            ? Border.all(color: const Color(0xFF6A4CFF), width: 1.5)
                            : null,
                        boxShadow: isActive
                            ? [
                                BoxShadow(
                                  color: const Color(0xFFFF7A00).withOpacity(0.35),
                                  blurRadius: 6,
                                  offset: const Offset(0, 2),
                                ),
                              ]
                            : null,
                      ),
                      child: Center(
                        child: isActive
                            ? const Icon(Icons.local_fire_department_rounded, color: Colors.white, size: 20)
                            : Text(
                                dayNames[index],
                                style: TextStyle(
                                  fontFamily: 'Nunito',
                                  fontSize: 12,
                                  fontWeight: isToday ? FontWeight.w900 : FontWeight.w700,
                                  color: isToday ? const Color(0xFF6A4CFF) : const Color(0xFF94A3B8),
                                ),
                              ),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      dayNames[index],
                      style: TextStyle(
                        fontFamily: 'Nunito',
                        fontSize: 10,
                        fontWeight: isToday ? FontWeight.w800 : FontWeight.w600,
                        color: isToday ? const Color(0xFF6A4CFF) : colors.muted,
                      ),
                    ),
                  ],
                ),
              );
            }),
          ),
        ],
      ),
    );
  }

  Widget _buildMilestonePill(int xp, int level, AppThemeColors colors) {
    final xpInCurrentLevel = xp % 100;
    final remainingXP = 100 - xpInCurrentLevel;
    final progress = (xpInCurrentLevel / 100.0).clamp(0.0, 1.0);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFDDD6FE)),
        gradient: LinearGradient(
          colors: [
            const Color(0xFFF5F3FF),
            colors.card,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: const BoxDecoration(
              color: Color(0xFFEDE9FE),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.track_changes_rounded, color: Color(0xFF7C3AED), size: 16),
          ),
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
                        '🎯 Keyingi darajaga $remainingXP XP qoldi',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontFamily: 'Nunito',
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF5B21B6),
                        ),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      '$xpInCurrentLevel / 100 XP',
                      style: const TextStyle(
                        fontFamily: 'Nunito',
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF7C3AED),
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
                    backgroundColor: const Color(0xFFDDD6FE),
                    valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF7C3AED)),
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
          color: Colors.white.withOpacity(opacity.clamp(0.06, 0.35)),
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
