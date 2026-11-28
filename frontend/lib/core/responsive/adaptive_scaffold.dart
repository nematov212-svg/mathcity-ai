import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../theme/app_theme.dart';
import '../widgets/coin_badge.dart';
import '../widgets/xp_bar.dart';
import '../../shared/providers/student_provider.dart';
import 'breakpoints.dart';
import 'screen_size.dart';

/// Adaptive scaffold for MathCity AI
/// - compact (< 600px or shortestSide < 500): renders the body directly (or phone layout)
/// - medium (600–1024px): NavigationRail on left, top bar, content on right
/// - expanded (> 1024px): 260px Sidebar on left, top bar, centered content on right
class AdaptiveScaffold extends ConsumerWidget {
  final Widget body;
  final int currentNavIndex;
  final String? title;
  final List<Widget>? topBarActions;
  final bool hideNavOnWide;
  final double? maxContentWidth;
  
  const AdaptiveScaffold({
    super.key,
    required this.body,
    this.currentNavIndex = -1,
    this.title,
    this.topBarActions,
    this.hideNavOnWide = false,
    this.maxContentWidth,
  });

  static const List<({String label, IconData icon, String route})> navItems = [
    (label: 'Asosiy', icon: Icons.home_rounded, route: '/kids/home'),
    (label: 'Darslar', icon: Icons.menu_book_rounded, route: '/kids/lessons'),
    (label: 'AI Ustoz', icon: Icons.smart_toy_rounded, route: '/kids/ai-tutor'),
    (
      label: 'Reyting',
      icon: Icons.leaderboard_rounded,
      route: '/kids/leaderboard'
    ),
    (label: 'Profil', icon: Icons.person_rounded, route: '/kids/profile'),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // 0.5 qoidasi: compact qurilmalarda karkas tegilmaydi
    if (context.isCompact) {
      return body;
    }

    final colors = AppThemeColors.of(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final student = ref.watch(studentProvider).student;
    final isPro = ref.watch(studentProvider).isPro;
    final coins = student?.coinBalance ?? 0;
    final xp = student?.totalXP ?? 0;
    final level = student?.level ?? 1;
    final name = student?.displayName ?? 'O‘quvchi';

    final effectiveMaxWidth =
        maxContentWidth ?? Breakpoints.maxContentWidth;

    if (hideNavOnWide) {
      return Scaffold(
        backgroundColor: colors.bg,
        body: Center(
          child: ConstrainedBox(
            constraints: BoxConstraints(maxWidth: effectiveMaxWidth),
            child: body,
          ),
        ),
      );
    }

    if (context.isMedium) {
      return Scaffold(
        backgroundColor: colors.bg,
        body: Row(
          children: [
            _buildTabletRail(context, colors, isDark),
            Expanded(
              child: Column(
                children: [
                  _buildTopBar(
                    context,
                    colors,
                    isDark,
                    name,
                    coins,
                    xp,
                    level,
                    isPro,
                    isCompact: true,
                  ),
                  Expanded(
                    child: Center(
                      child: ConstrainedBox(
                        constraints: BoxConstraints(maxWidth: effectiveMaxWidth),
                        child: body,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      );
    }

    // Expanded (> 1024px)
    return Scaffold(
      backgroundColor: colors.bg,
      body: Row(
        children: [
          _buildDesktopSidebar(
            context,
            colors,
            isDark,
            student,
            name,
            coins,
            xp,
            level,
            isPro,
          ),
          Expanded(
            child: Column(
              children: [
                _buildTopBar(
                  context,
                  colors,
                  isDark,
                  name,
                  coins,
                  xp,
                  level,
                  isPro,
                  isCompact: false,
                ),
                Expanded(
                  child: Center(
                    child: ConstrainedBox(
                      constraints: BoxConstraints(maxWidth: effectiveMaxWidth),
                      child: body,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTopBar(
    BuildContext context,
    AppThemeColors colors,
    bool isDark,
    String name,
    int coins,
    int xp,
    int level,
    bool isPro, {
    required bool isCompact,
  }) {
    final barBg = isDark ? const Color(0xFF151A2B) : Colors.white;
    final borderColor = isDark
        ? Colors.white.withValues(alpha: 0.08)
        : colors.border.withValues(alpha: 0.5);

    return Container(
      height: 68,
      padding: EdgeInsets.symmetric(horizontal: isCompact ? 16 : 28),
      decoration: BoxDecoration(
        color: barBg,
        border: Border(
          bottom: BorderSide(color: borderColor, width: 1),
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: Text(
              title ?? 'Salom, $name! 👋',
              style: TextStyle(
                fontFamily: 'Nunito',
                fontSize: isCompact ? 17 : 20,
                fontWeight: FontWeight.w900,
                color: colors.ink,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          const SizedBox(width: 12),
          if (!isCompact) ...[
            ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 160),
              child: FittedBox(
                fit: BoxFit.scaleDown,
                child: SizedBox(
                  width: 170,
                  child: XPBar(currentXP: xp, level: level),
                ),
              ),
            ),
            const SizedBox(width: 12),
          ],
          CoinBadge(count: coins, size: 24),
          const SizedBox(width: 12),
          if (isPro)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFFFFB800), Color(0xFFFF8A00)],
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.workspace_premium_rounded,
                      color: Colors.white, size: 14),
                  SizedBox(width: 4),
                  Text(
                    'PRO',
                    style: TextStyle(
                      fontFamily: 'Nunito',
                      color: Colors.white,
                      fontSize: 11,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 0.5,
                    ),
                  ),
                ],
              ),
            )
          else
            MouseRegion(
              cursor: SystemMouseCursors.click,
              child: GestureDetector(
                onTap: () => context.push('/pro'),
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: isDark
                        ? const Color(0xFF261D4E)
                        : const Color(0xFFF3E8FF),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: isDark
                          ? const Color(0xFF7C4DFF)
                          : const Color(0xFFC084FC),
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.star_rounded,
                          color: isDark
                              ? const Color(0xFFB388FF)
                              : const Color(0xFF9333EA),
                          size: 16),
                      const SizedBox(width: 6),
                      Text(
                        'PRO olish',
                        style: TextStyle(
                          fontFamily: 'Nunito',
                          color: isDark
                              ? const Color(0xFFE2DCFF)
                              : const Color(0xFF9333EA),
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          if (topBarActions != null) ...[
            const SizedBox(width: 8),
            ...topBarActions!,
          ],
        ],
      ),
    );
  }

  Widget _buildTabletRail(
    BuildContext context,
    AppThemeColors colors,
    bool isDark,
  ) {
    final railBg = isDark ? const Color(0xFF151A2B) : Colors.white;
    final borderColor = isDark
        ? Colors.white.withValues(alpha: 0.08)
        : colors.border.withValues(alpha: 0.5);

    return Container(
      width: 76,
      decoration: BoxDecoration(
        color: railBg,
        border: Border(
          right: BorderSide(color: borderColor, width: 1),
        ),
      ),
      child: Column(
        children: [
          const SizedBox(height: 18),
          // Mini Logo
          MouseRegion(
            cursor: SystemMouseCursors.click,
            child: GestureDetector(
              onTap: () => context.go('/kids/home'),
              child: Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF6C3CE0), Color(0xFF7C4DFF)],
                  ),
                  borderRadius: BorderRadius.circular(14),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF6C3CE0).withValues(alpha: 0.3),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: const Center(
                  child: Text(
                    'M²',
                    style: TextStyle(
                      fontFamily: 'Nunito',
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 24),
          // Nav items
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              itemCount: navItems.length,
              separatorBuilder: (_, __) => const SizedBox(height: 8),
              itemBuilder: (context, index) {
                final item = navItems[index];
                final isSelected = index == currentNavIndex;
                return Tooltip(
                  message: item.label,
                  child: MouseRegion(
                    cursor: SystemMouseCursors.click,
                    child: InkWell(
                      onTap: () {
                        HapticFeedback.selectionClick();
                        context.go(item.route);
                      },
                      borderRadius: BorderRadius.circular(16),
                      child: Container(
                        height: 52,
                        decoration: BoxDecoration(
                          color: isSelected
                              ? (isDark
                                  ? const Color(0xFF261D4E)
                                  : const Color(0xFFF3F0FF))
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(16),
                          border: isSelected
                              ? Border.all(
                                  color: const Color(0xFF6C3CE0)
                                      .withValues(alpha: 0.4))
                              : null,
                        ),
                        child: Center(
                          child: Icon(
                            item.icon,
                            color: isSelected
                                ? const Color(0xFF7C4DFF)
                                : colors.muted,
                            size: 26,
                          ),
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          // Bottom settings
          Tooltip(
            message: 'Sozlamalar',
            child: MouseRegion(
              cursor: SystemMouseCursors.click,
              child: IconButton(
                icon: Icon(Icons.settings_outlined,
                    color: colors.muted),
                onPressed: () => context.push('/settings'),
              ),
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  Widget _buildDesktopSidebar(
    BuildContext context,
    AppThemeColors colors,
    bool isDark,
    dynamic student,
    String name,
    int coins,
    int xp,
    int level,
    bool isPro,
  ) {
    final sidebarBg = isDark ? const Color(0xFF151A2B) : Colors.white;
    final borderColor = isDark
        ? Colors.white.withValues(alpha: 0.08)
        : colors.border.withValues(alpha: 0.5);

    return Container(
      width: 260,
      decoration: BoxDecoration(
        color: sidebarBg,
        border: Border(
          right: BorderSide(color: borderColor, width: 1),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 24, 20, 20),
            child: MouseRegion(
              cursor: SystemMouseCursors.click,
              child: GestureDetector(
                onTap: () => context.go('/kids/home'),
                child: Row(
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF6C3CE0), Color(0xFF7C4DFF)],
                        ),
                        borderRadius: BorderRadius.circular(14),
                        boxShadow: [
                          BoxShadow(
                            color:
                                const Color(0xFF6C3CE0).withValues(alpha: 0.28),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: const Center(
                        child: Text(
                          'M²',
                          style: TextStyle(
                            fontFamily: 'Nunito',
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'MathCity AI',
                            style: TextStyle(
                              fontFamily: 'Nunito',
                              fontSize: 18,
                              fontWeight: FontWeight.w900,
                              color: colors.ink,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Row(
                            children: [
                              Container(
                                width: 8,
                                height: 8,
                                decoration: const BoxDecoration(
                                  color: Color(0xFF2EB67D),
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 6),
                              Flexible(
                                child: Text(
                                  'Bolalar rejimi',
                                  style: TextStyle(
                                    fontFamily: 'Nunito',
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: colors.muted,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const Divider(height: 1, thickness: 1),
          const SizedBox(height: 16),
          // Nav items
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 14),
              itemCount: navItems.length,
              separatorBuilder: (_, __) => const SizedBox(height: 6),
              itemBuilder: (context, index) {
                final item = navItems[index];
                final isSelected = index == currentNavIndex;
                return MouseRegion(
                  cursor: SystemMouseCursors.click,
                  child: InkWell(
                    onTap: () {
                      HapticFeedback.selectionClick();
                      context.go(item.route);
                    },
                    borderRadius: BorderRadius.circular(16),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      padding: const EdgeInsets.symmetric(
                          horizontal: 14, vertical: 12),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? (isDark
                                ? const Color(0xFF261D4E)
                                : const Color(0xFFF3F0FF))
                            : Colors.transparent,
                        borderRadius: BorderRadius.circular(16),
                        border: isSelected
                            ? Border.all(
                                color: const Color(0xFF6C3CE0)
                                    .withValues(alpha: 0.35))
                            : null,
                      ),
                      child: Row(
                        children: [
                          Icon(
                            item.icon,
                            color: isSelected
                                ? const Color(0xFF7C4DFF)
                                : colors.muted,
                            size: 22,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              item.label,
                              style: TextStyle(
                                fontFamily: 'Nunito',
                                fontSize: 14,
                                fontWeight: isSelected
                                    ? FontWeight.w900
                                    : FontWeight.w700,
                                color: isSelected
                                    ? const Color(0xFF7C4DFF)
                                    : colors.ink,
                              ),
                            ),
                          ),
                          if (isSelected)
                            Container(
                              width: 6,
                              height: 6,
                              decoration: const BoxDecoration(
                                color: Color(0xFF7C4DFF),
                                shape: BoxShape.circle,
                              ),
                            ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          // Student Profile Card
          Container(
            margin: const EdgeInsets.all(14),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1B2136) : const Color(0xFFF6F5FC),
              borderRadius: BorderRadius.circular(18),
              border: Border.all(
                color: isDark
                    ? Colors.white.withValues(alpha: 0.08)
                    : colors.border.withValues(alpha: 0.5),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    CircleAvatar(
                      radius: 18,
                      backgroundColor:
                          const Color(0xFF6C3CE0).withValues(alpha: 0.15),
                      child: const Text('🎓', style: TextStyle(fontSize: 16)),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            name,
                            style: TextStyle(
                              fontFamily: 'Nunito',
                              fontSize: 13,
                              fontWeight: FontWeight.w800,
                              color: colors.ink,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Text(
                            '$level-daraja o‘quvchi',
                            style: TextStyle(
                              fontFamily: 'Nunito',
                              fontSize: 11,
                              color: colors.muted,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                XPBar(currentXP: xp, level: level),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
