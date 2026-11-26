import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/models/weekly_activity_model.dart';
import '../../../shared/providers/weekly_activity_provider.dart';

class WeeklyStreakCard extends ConsumerStatefulWidget {
  final AppThemeColors colors;

  const WeeklyStreakCard({
    super.key,
    required this.colors,
  });

  @override
  ConsumerState<WeeklyStreakCard> createState() => _WeeklyStreakCardState();
}

class _WeeklyStreakCardState extends ConsumerState<WeeklyStreakCard>
    with SingleTickerProviderStateMixin {
  late final AnimationController _pulseController;
  late final Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..repeat(reverse: true);

    _pulseAnimation = CurvedAnimation(
      parent: _pulseController,
      curve: Curves.easeInOut,
    );
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final activityState = ref.watch(weeklyActivityProvider);
    final data = activityState.data;
    final colors = widget.colors;
    final isDark = colors.isDark;

    final streak = data.currentStreak;
    final todayLevel = data.todayLevel;
    final todayNeedSave = data.todayNeedSave;

    // Dynamic right-side status text
    String statusText = 'Har kuni';
    Color statusColor = colors.muted;

    if (todayLevel == ActivityLevel.high) {
      statusText = 'Ajoyib kun! 🔥';
      statusColor = const Color(0xFFFF7A00);
    } else if (todayLevel == ActivityLevel.medium) {
      statusText = 'Yana ozgina qoldi ⚡';
      statusColor = const Color(0xFFFBBF24);
    } else if (todayNeedSave) {
      statusText = 'Bugun saqlab qoling';
      statusColor = const Color(0xFFF59E0B);
    } else if (todayLevel == ActivityLevel.low) {
      statusText = 'Yaxshi boshlanish 🌱';
      statusColor = const Color(0xFF10B981);
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: isDark
            ? const Color(0xFF160E36).withValues(alpha: 0.85)
            : colors.card,
        borderRadius: BorderRadius.circular(20),
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (streak > 0)
                      const Text('🔥', style: TextStyle(fontSize: 14))
                    else
                      Icon(
                        Icons.local_fire_department_rounded,
                        color: colors.muted.withValues(alpha: 0.4),
                        size: 16,
                      ),
                    const SizedBox(width: 4),
                    Flexible(
                      child: Text(
                        '$streak kunlik seriya',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontFamily: 'Nunito',
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          color: colors.ink,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 4),
              Text(
                statusText,
                style: TextStyle(
                  fontFamily: 'Nunito',
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  color: statusColor,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),

          // 7 Day Circles Row
          Row(
            children: List.generate(data.days.length, (index) {
              final day = data.days[index];
              return Expanded(
                child: _buildDayItem(day, isDark, colors),
              );
            }),
          ),
        ],
      ),
    );
  }

  Widget _buildDayItem(
      ActivityDayItem day, bool isDark, AppThemeColors colors) {
    final isToday = day.isToday;

    return GestureDetector(
      onTap: () => _showDayDetails(day, colors),
      behavior: HitTestBehavior.opaque,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Weekday label
          Text(
            day.weekday,
            style: TextStyle(
              fontFamily: 'Nunito',
              fontSize: 9,
              fontWeight: isToday ? FontWeight.w900 : FontWeight.w700,
              color: isToday ? const Color(0xFFFBBF24) : colors.muted,
            ),
          ),
          const SizedBox(height: 3),

          // Circle representation
          _buildDayCircle(day, isDark, colors),
        ],
      ),
    );
  }

  Widget _buildDayCircle(
      ActivityDayItem day, bool isDark, AppThemeColors colors) {
    final isToday = day.isToday;
    final isFuture = day.isFuture;
    final level = day.level;

    // 1. Future day: empty light circle without icon
    if (isFuture) {
      return Container(
        height: 22,
        width: 22,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: isDark
              ? Colors.white.withValues(alpha: 0.03)
              : colors.field.withValues(alpha: 0.5),
          border: Border.all(
            color: isDark
                ? Colors.white.withValues(alpha: 0.08)
                : colors.border.withValues(alpha: 0.6),
            width: 0.8,
          ),
        ),
      );
    }

    // 2. Today with NO activity yet (level == NONE): pulsing purple dashed border
    if (isToday && level == ActivityLevel.none) {
      return AnimatedBuilder(
        animation: _pulseAnimation,
        builder: (context, child) {
          final scale = 1.0 + (_pulseAnimation.value * 0.08);
          final glowAlpha = 0.2 + (_pulseAnimation.value * 0.3);

          return Transform.scale(
            scale: scale,
            child: Container(
              height: 22,
              width: 22,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isDark
                    ? const Color(0xFF8B5CF6).withValues(alpha: 0.12)
                    : const Color(0xFF8B5CF6).withValues(alpha: 0.06),
                border: Border.all(
                  color: const Color(0xFF8B5CF6),
                  width: 1.5,
                ),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF8B5CF6).withValues(alpha: glowAlpha),
                    blurRadius: 6,
                    spreadRadius: 1,
                  ),
                ],
              ),
              child: Center(
                child: Container(
                  width: 4,
                  height: 4,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    color: Color(0xFF8B5CF6),
                  ),
                ),
              ),
            ),
          );
        },
      );
    }

    // 3. Passed day with NO activity: dimmed "×" icon
    if (!isToday && level == ActivityLevel.none) {
      return Container(
        height: 22,
        width: 22,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: isDark ? Colors.white.withValues(alpha: 0.05) : colors.field,
          border: Border.all(
            color: isDark ? Colors.white12 : colors.border,
            width: 1.0,
          ),
        ),
        child: Center(
          child: Icon(
            Icons.close_rounded,
            color: colors.muted.withValues(alpha: 0.45),
            size: 11,
          ),
        ),
      );
    }

    // 4. Active day (LOW, MEDIUM, HIGH)
    Gradient gradient;
    List<BoxShadow>? shadows;
    Widget iconWidget;

    switch (level) {
      case ActivityLevel.high:
        gradient = const LinearGradient(
          colors: [Color(0xFFFF7A00), Color(0xFFFF4800)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        );
        shadows = [
          BoxShadow(
            color: const Color(0xFFFF7A00).withValues(alpha: 0.5),
            blurRadius: 6,
            spreadRadius: 1,
          ),
        ];
        iconWidget = const Icon(
          Icons.local_fire_department_rounded,
          color: Colors.white,
          size: 13,
        );
        break;

      case ActivityLevel.medium:
        gradient = const LinearGradient(
          colors: [Color(0xFFFBBF24), Color(0xFFD97706)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        );
        shadows = [
          BoxShadow(
            color: const Color(0xFFF59E0B).withValues(alpha: 0.4),
            blurRadius: 6,
            spreadRadius: 1,
          ),
        ];
        iconWidget = const Icon(
          Icons.bolt_rounded,
          color: Colors.white,
          size: 13,
        );
        break;

      case ActivityLevel.low:
      default:
        gradient = const LinearGradient(
          colors: [Color(0xFF34D399), Color(0xFF059669)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        );
        shadows = [
          BoxShadow(
            color: const Color(0xFF10B981).withValues(alpha: 0.4),
            blurRadius: 6,
            spreadRadius: 1,
          ),
        ];
        iconWidget = const Icon(
          Icons.eco_rounded,
          color: Colors.white,
          size: 12,
        );
        break;
    }

    return Container(
      height: 22,
      width: 22,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: gradient,
        boxShadow: shadows,
        border: isToday ? Border.all(color: Colors.amber, width: 1.2) : null,
      ),
      child: Center(
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 300),
          transitionBuilder: (child, animation) {
            return ScaleTransition(
              scale: animation,
              child: FadeTransition(opacity: animation, child: child),
            );
          },
          child: KeyedSubtree(
            key: ValueKey(level),
            child: iconWidget,
          ),
        ),
      ),
    );
  }

  void _showDayDetails(ActivityDayItem day, AppThemeColors colors) {
    final isDark = colors.isDark;
    String badgeText;
    Color badgeBg;
    Color badgeTextColor;

    if (day.isFuture) {
      badgeText = 'Kutilmoqda ⏳';
      badgeBg = Colors.grey.withValues(alpha: 0.2);
      badgeTextColor = colors.muted;
    } else {
      switch (day.level) {
        case ActivityLevel.high:
          badgeText = 'Ko‘p faollik 🔥';
          badgeBg = const Color(0xFFFF7A00).withValues(alpha: 0.2);
          badgeTextColor = const Color(0xFFFF7A00);
          break;
        case ActivityLevel.medium:
          badgeText = 'O‘rtacha faollik ⚡';
          badgeBg = const Color(0xFFFBBF24).withValues(alpha: 0.2);
          badgeTextColor = const Color(0xFFD97706);
          break;
        case ActivityLevel.low:
          badgeText = 'Kam faollik 🌱';
          badgeBg = const Color(0xFF10B981).withValues(alpha: 0.2);
          badgeTextColor = const Color(0xFF059669);
          break;
        case ActivityLevel.none:
          badgeText =
              day.isToday ? 'Bugun hali bajarilmadi 🎯' : 'Bajarilmagan ❄️';
          badgeBg = colors.muted.withValues(alpha: 0.15);
          badgeTextColor = colors.muted;
          break;
      }
    }

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 22),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF160E36) : colors.card,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
            border: Border.all(
              color: isDark
                  ? const Color(0xFF8B5CF6).withValues(alpha: 0.3)
                  : colors.border,
            ),
          ),
          child: SafeArea(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top handle
                Center(
                  child: Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: colors.muted.withValues(alpha: 0.3),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Title row
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        '${day.weekdayName}${day.date.isNotEmpty ? ' (${day.date})' : ''}',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontFamily: 'Nunito',
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: colors.ink,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: badgeBg,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        badgeText,
                        style: TextStyle(
                          fontFamily: 'Nunito',
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                          color: badgeTextColor,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Stats breakdown
                _buildStatRow(
                  icon: Icons.check_circle_rounded,
                  iconColor: const Color(0xFF10B981),
                  title: 'To‘g‘ri javoblar',
                  value: '${day.correctAnswers} ta',
                  sub: '+${day.correctAnswers} bal',
                  colors: colors,
                ),
                const SizedBox(height: 10),
                _buildStatRow(
                  icon: Icons.menu_book_rounded,
                  iconColor: const Color(0xFF8B5CF6),
                  title: 'Tugatilgan darslar',
                  value: '${day.lessonsCompleted} ta',
                  sub: '+${day.lessonsCompleted * 5} bal',
                  colors: colors,
                ),
                const SizedBox(height: 10),
                _buildStatRow(
                  icon: Icons.stars_rounded,
                  iconColor: const Color(0xFFFBBF24),
                  title: 'Jami kunlik bal',
                  value: '${day.score} bal',
                  sub: 'Daraja: ${day.level.labelUz}',
                  colors: colors,
                  isHighlight: true,
                ),
                const SizedBox(height: 16),

                // Info note
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: isDark
                        ? Colors.white.withValues(alpha: 0.05)
                        : colors.field,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Row(
                    children: [
                      const Text('💡', style: TextStyle(fontSize: 16)),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Har bir to‘g‘ri javob 1 bal, dars tugatish 5 bal beradi. Kamida 1 bal to‘plasangiz seriya davom etadi.',
                          style: TextStyle(
                            fontFamily: 'Nunito',
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: colors.muted,
                            height: 1.3,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Close button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () => Navigator.pop(ctx),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF7C3AED),
                      foregroundColor: Colors.white,
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    child: const Text(
                      'Tushundim',
                      style: TextStyle(
                        fontFamily: 'Nunito',
                        fontSize: 14,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildStatRow({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String value,
    required String sub,
    required AppThemeColors colors,
    bool isHighlight = false,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: isHighlight
            ? (colors.isDark
                ? const Color(0xFF7C3AED).withValues(alpha: 0.15)
                : const Color(0xFF7C3AED).withValues(alpha: 0.08))
            : (colors.isDark
                ? Colors.white.withValues(alpha: 0.04)
                : colors.field),
        borderRadius: BorderRadius.circular(14),
        border: isHighlight
            ? Border.all(
                color: const Color(0xFF7C3AED).withValues(alpha: 0.4),
                width: 1.2)
            : null,
      ),
      child: Row(
        children: [
          Icon(icon, color: iconColor, size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              title,
              style: TextStyle(
                fontFamily: 'Nunito',
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: colors.ink,
              ),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                value,
                style: TextStyle(
                  fontFamily: 'Nunito',
                  fontSize: 13,
                  fontWeight: FontWeight.w900,
                  color: isHighlight ? const Color(0xFF7C3AED) : colors.ink,
                ),
              ),
              Text(
                sub,
                style: TextStyle(
                  fontFamily: 'Nunito',
                  fontSize: 10,
                  fontWeight: FontWeight.w600,
                  color: colors.muted,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
