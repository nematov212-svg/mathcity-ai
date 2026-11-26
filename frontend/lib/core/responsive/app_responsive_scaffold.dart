import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../constants/app_colors.dart';
import '../widgets/coin_badge.dart';
import '../widgets/xp_bar.dart';
import '../../shared/providers/student_provider.dart';
import 'responsive.dart';

/// Adaptive scaffold that provides:
/// - Exact, untouched phone layout on `< 600px`
/// - Compact NavigationRail + TopBar on Tablet (`600 - 1023px`)
/// - 260px Left Sidebar + TopBar + Centered Content on Desktop (`>= 1024px`)
class AppResponsiveScaffold extends ConsumerWidget {
  final Widget phoneBody;
  final Widget? tabletBody;
  final Widget? desktopBody;
  final int
      currentNavIndex; // 0: Home, 1: Lessons, 2: AI Tutor, 3: Leaderboard, 4: Profile, -1: none
  final String? title;
  final List<Widget>? topBarActions;
  final bool hideNavOnWide;
  final Color? backgroundColor;
  final double? maxContentWidth;

  const AppResponsiveScaffold({
    super.key,
    required this.phoneBody,
    this.tabletBody,
    this.desktopBody,
    this.currentNavIndex = -1,
    this.title,
    this.topBarActions,
    this.hideNavOnWide = false,
    this.backgroundColor,
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
    return ResponsiveBuilder(
      builder: (context, screenType, constraints) {
        // STRICT ZERO-REGRESSION: Phone (< 600px) gets the exact phoneBody untouched
        if (screenType == ScreenType.phone) {
          return phoneBody;
        }

        final student = ref.watch(studentProvider).student;
        final isPro = ref.watch(studentProvider).isPro;
        final coins = student?.coinBalance ?? 0;
        final xp = student?.totalXP ?? 0;
        final level = student?.level ?? 1;
        final name = student?.displayName ?? 'O‘quvchi';

        final effectiveBg = backgroundColor ?? AppColors.kidsBackground;
        final effectiveMaxWidth =
            maxContentWidth ?? ResponsiveBreakpoints.maxContentWidth;

        final contentWidget = screenType == ScreenType.desktop
            ? (desktopBody ?? tabletBody ?? phoneBody)
            : (tabletBody ?? desktopBody ?? phoneBody);

        if (hideNavOnWide) {
          return Scaffold(
            backgroundColor: effectiveBg,
            body: Center(
              child: ConstrainedBox(
                constraints: BoxConstraints(maxWidth: effectiveMaxWidth),
                child: contentWidget,
              ),
            ),
          );
        }

        if (screenType == ScreenType.tablet) {
          return Scaffold(
            backgroundColor: effectiveBg,
            body: Row(
              children: [
                _buildTabletRail(context, isPro),
                Expanded(
                  child: Column(
                    children: [
                      _buildTopBar(context, name, coins, xp, level, isPro,
                          isCompact: true),
                      Expanded(
                        child: Center(
                          child: ConstrainedBox(
                            constraints:
                                BoxConstraints(maxWidth: effectiveMaxWidth),
                            child: contentWidget,
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

        // Desktop layout (>= 1024px)
        return Scaffold(
          backgroundColor: effectiveBg,
          body: Row(
            children: [
              _buildDesktopSidebar(
                  context, student, name, coins, xp, level, isPro),
              Expanded(
                child: Column(
                  children: [
                    _buildTopBar(context, name, coins, xp, level, isPro,
                        isCompact: false),
                    Expanded(
                      child: Center(
                        child: ConstrainedBox(
                          constraints:
                              BoxConstraints(maxWidth: effectiveMaxWidth),
                          child: contentWidget,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildTopBar(
    BuildContext context,
    String name,
    int coins,
    int xp,
    int level,
    bool isPro, {
    required bool isCompact,
  }) {
    return Container(
      height: 70,
      padding: EdgeInsets.symmetric(horizontal: isCompact ? 16 : 28),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(
          bottom: BorderSide(
              color: AppColors.kidsBorder.withValues(alpha: 0.6), width: 1),
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: Text(
              title ?? 'Salom, $name! 👋',
              style: TextStyle(
                fontSize: isCompact ? 17 : 20,
                fontWeight: FontWeight.w900,
                color: AppColors.kidsDarkText,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          const SizedBox(width: 8),
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
          const SizedBox(width: 10),
          if (isPro)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
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
                    color: const Color(0xFFF3E8FF),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFC084FC)),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.star_rounded,
                          color: Color(0xFF9333EA), size: 16),
                      SizedBox(width: 6),
                      Text(
                        'PRO olish',
                        style: TextStyle(
                          color: Color(0xFF9333EA),
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

  Widget _buildTabletRail(BuildContext context, bool isPro) {
    return Container(
      width: 76,
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(
          right: BorderSide(
              color: AppColors.kidsBorder.withValues(alpha: 0.6), width: 1),
        ),
      ),
      child: Column(
        children: [
          const SizedBox(height: 20),
          // Mini Logo
          MouseRegion(
            cursor: SystemMouseCursors.click,
            child: GestureDetector(
              onTap: () => context.go('/kids/home'),
              child: Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  gradient: AppColors.kidsPrimaryGradient,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Center(
                  child: Text(
                    'M²',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 28),
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
                              ? const Color(0xFFF3F0FF)
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(16),
                          border: isSelected
                              ? Border.all(
                                  color: AppColors.kidsPrimary
                                      .withValues(alpha: 0.3))
                              : null,
                        ),
                        child: Center(
                          child: Icon(
                            item.icon,
                            color: isSelected
                                ? AppColors.kidsPrimary
                                : AppColors.kidsSecondaryText,
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
                icon: const Icon(Icons.settings_outlined,
                    color: AppColors.kidsSecondaryText),
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
    dynamic student,
    String name,
    int coins,
    int xp,
    int level,
    bool isPro,
  ) {
    return Container(
      width: 260,
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(
          right: BorderSide(
              color: AppColors.kidsBorder.withValues(alpha: 0.6), width: 1),
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
                        gradient: AppColors.kidsPrimaryGradient,
                        borderRadius: BorderRadius.circular(14),
                        boxShadow: [
                          BoxShadow(
                            color:
                                AppColors.kidsPrimary.withValues(alpha: 0.25),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: const Center(
                        child: Text(
                          'M²',
                          style: TextStyle(
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
                          const Text(
                            'MathCity AI',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w900,
                              color: AppColors.kidsDarkText,
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
                                  color: AppColors.kidsGreen,
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 6),
                              const Flexible(
                                child: Text(
                                  'Interaktiv ta’lim',
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.kidsSecondaryText,
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
          const Divider(height: 1, color: AppColors.kidsBorder),
          const SizedBox(height: 12),
          // Nav items
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 14),
              children: [
                ...navItems.asMap().entries.map((entry) {
                  final index = entry.key;
                  final item = entry.value;
                  final isSelected = index == currentNavIndex;
                  return _buildDesktopNavItem(
                    icon: item.icon,
                    title: item.label,
                    active: isSelected,
                    onTap: () {
                      HapticFeedback.selectionClick();
                      context.go(item.route);
                    },
                  );
                }),
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 12),
                  child: Divider(height: 1, color: AppColors.kidsBorder),
                ),
                _buildDesktopNavItem(
                  icon: Icons.location_city_rounded,
                  title: 'Mening shahrim',
                  active: false,
                  onTap: () => context.push('/kids/city'),
                ),
                _buildDesktopNavItem(
                  icon: Icons.sports_esports_rounded,
                  title: 'O‘yinlar',
                  active: false,
                  onTap: () => context.push('/kids/games'),
                ),
                _buildDesktopNavItem(
                  icon: Icons.settings_outlined,
                  title: 'Sozlamalar',
                  active: false,
                  onTap: () => context.push('/settings'),
                ),
              ],
            ),
          ),
          // Bottom mini user profile card
          Container(
            padding: const EdgeInsets.all(16),
            margin: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFF7F5FF),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.kidsBorder),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    CircleAvatar(
                      radius: 18,
                      backgroundColor:
                          AppColors.kidsPrimary.withValues(alpha: 0.15),
                      child: Text(
                        name.isNotEmpty ? name[0].toUpperCase() : 'O',
                        style: const TextStyle(
                          color: AppColors.kidsPrimary,
                          fontWeight: FontWeight.w900,
                          fontSize: 14,
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            name,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w800,
                              color: AppColors.kidsDarkText,
                            ),
                          ),
                          Text(
                            'Daraja $level',
                            style: const TextStyle(
                              fontSize: 11,
                              color: AppColors.kidsSecondaryText,
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (isPro)
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFB800),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          'PRO',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '$xp XP',
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        color: AppColors.kidsPrimary,
                      ),
                    ),
                    Row(
                      children: [
                        const Icon(Icons.monetization_on_rounded,
                            size: 14, color: Color(0xFFFFB800)),
                        const SizedBox(width: 4),
                        Text(
                          '$coins',
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                            color: AppColors.kidsDarkText,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDesktopNavItem({
    required IconData icon,
    required String title,
    required bool active,
    required VoidCallback onTap,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 4),
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        child: Material(
          color: active ? const Color(0xFFF3F0FF) : Colors.transparent,
          borderRadius: BorderRadius.circular(14),
          child: InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(14),
            hoverColor: const Color(0xFFF8F6FF),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
              child: Row(
                children: [
                  Icon(
                    icon,
                    color: active
                        ? AppColors.kidsPrimary
                        : AppColors.kidsSecondaryText,
                    size: 22,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      title,
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: active ? FontWeight.w800 : FontWeight.w600,
                        color: active
                            ? AppColors.kidsPrimary
                            : AppColors.kidsDarkText,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
