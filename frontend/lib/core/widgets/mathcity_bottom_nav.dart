import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import '../theme/app_theme.dart';

/// Glassmorphic Floating Bottom Navigation Bar for MathCity AI
///
/// Features:
/// - Realtime BackdropFilter blur (18px) with semi-transparent brand purple backdrop.
/// - Persistent, zero-flicker mounting in KidsShellLayout.
/// - Sliding active pill with spring overshoot curve (cubic-bezier(0.34, 1.35, 0.64, 1)).
/// - Active icon elevation (-2px) & scaling (1.12x) with smooth color transitions.
/// - Active dot indicator beneath label.
/// - Interactive tap-down micro-scale (0.93x) feedback.
/// - Reduced-motion accessibility support.
class MathCityBottomNav extends StatefulWidget {
  final int currentIndex;

  const MathCityBottomNav({
    super.key,
    required this.currentIndex,
  });

  @override
  State<MathCityBottomNav> createState() => _MathCityBottomNavState();
}

class _MathCityBottomNavState extends State<MathCityBottomNav> {
  late int _activeTab;
  int? _pressedIndex;

  // The 5 primary tabs: Asosiy, Darslar, AI Ustoz, Reyting, Profil
  static const List<({String label, IconData icon, String route})> _items = [
    (label: 'Asosiy', icon: Icons.home_rounded, route: '/kids/home'),
    (label: 'Darslar', icon: Icons.menu_book_rounded, route: '/kids/lessons'),
    (label: 'AI Ustoz', icon: Icons.smart_toy_rounded, route: '/kids/ai-tutor'),
    (label: 'Reyting', icon: Icons.leaderboard_rounded, route: '/kids/leaderboard'),
    (label: 'Profil', icon: Icons.person_rounded, route: '/kids/profile'),
  ];

  @override
  void initState() {
    super.initState();
    _activeTab = widget.currentIndex.clamp(0, _items.length - 1);
  }

  @override
  void didUpdateWidget(covariant MathCityBottomNav oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.currentIndex != widget.currentIndex) {
      final targetIndex = widget.currentIndex.clamp(0, _items.length - 1);
      if (_activeTab != targetIndex) {
        setState(() {
          _activeTab = targetIndex;
        });
      }
    }
  }

  void _onTap(int index) {
    if (index == _activeTab) return;
    HapticFeedback.selectionClick();
    setState(() {
      _activeTab = index;
    });
    context.go(_items[index].route);
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final screenW = MediaQuery.of(context).size.width;
    final reduceMotion = MediaQuery.of(context).disableAnimations;
    final horizMargin = screenW < 360 ? 10.0 : 16.0;

    // Alignment: -1.0 (leftmost) to +1.0 (rightmost) across 5 equal tabs
    final double pillAlignX = _items.isEmpty
        ? 0.0
        : -1.0 + (_activeTab / (_items.length - 1)) * 2.0;

    // Adaptive frosted glass background
    final Color glassBgColor = isDark
        ? const Color(0xFF19163C).withValues(alpha: 0.65)
        : colors.cardGlass;

    final Color glassBorderColor = isDark
        ? Colors.white.withValues(alpha: 0.12)
        : const Color(0xFF6C47FF).withValues(alpha: 0.16);

    final Color pillBorderColor = isDark
        ? const Color(0xFF8B6BFF).withValues(alpha: 0.38)
        : const Color(0xFF6C47FF).withValues(alpha: 0.32);

    final List<Color> pillGradient = isDark
        ? [
            const Color(0xFF6C47FF).withValues(alpha: 0.35),
            const Color(0xFF5232D9).withValues(alpha: 0.22),
          ]
        : [
            const Color(0xFFEDE9FE),
            const Color(0xFFDDD6FE),
          ];

    final Color activeColor = isDark
        ? const Color(0xFFFFFFFF)
        : const Color(0xFF6C47FF);
    final Color inactiveColor = isDark
        ? const Color(0xFFA9A4CF).withValues(alpha: 0.72)
        : const Color(0xFF6B6785);

    // Spring curve matching cubic-bezier(0.34, 1.35, 0.64, 1)
    const springCurve = Cubic(0.34, 1.35, 0.64, 1.0);

    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: 1.0, end: 0.0),
      duration: reduceMotion ? Duration.zero : const Duration(milliseconds: 450),
      curve: Curves.easeOutCubic,
      builder: (context, entryProgress, childWidget) {
        return Transform.translate(
          offset: Offset(0, entryProgress * 20.0),
          child: Opacity(
            opacity: (1.0 - entryProgress).clamp(0.0, 1.0),
            child: childWidget,
          ),
        );
      },
      child: Container(
        height: 68,
        margin: EdgeInsets.only(left: horizMargin, right: horizMargin, bottom: 12),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(26),
          boxShadow: [
            // Soft outer shadow
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.35),
              blurRadius: 30,
              offset: const Offset(0, 10),
            ),
            // Subtle purple accent ambient glow
            BoxShadow(
              color: const Color(0xFF6C47FF).withValues(alpha: 0.16),
              blurRadius: 20,
              offset: const Offset(0, 4),
            ),
            // Delicate top highlight
            BoxShadow(
              color: Colors.white.withValues(alpha: isDark ? 0.10 : 0.16),
              blurRadius: 1,
              offset: const Offset(0, 1),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(26),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
            child: Container(
              decoration: BoxDecoration(
                color: glassBgColor,
                borderRadius: BorderRadius.circular(26),
                border: Border.all(
                  color: glassBorderColor,
                  width: 1.0,
                ),
              ),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  // 1. Sliding Active Pill Indicator
                  AnimatedAlign(
                    alignment: Alignment(pillAlignX, 0.0),
                    duration: reduceMotion
                        ? Duration.zero
                        : const Duration(milliseconds: 420),
                    curve: springCurve,
                    child: FractionallySizedBox(
                      widthFactor: 1.0 / _items.length,
                      heightFactor: 0.82,
                      child: Container(
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: pillGradient,
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: pillBorderColor,
                            width: 1.0,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFF6C47FF).withValues(alpha: isDark ? 0.24 : 0.12),
                              blurRadius: 12,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),

                  // 2. Interactive Equal-Width Tab Buttons
                  Row(
                    children: List.generate(_items.length, (index) {
                      final item = _items[index];
                      final isSelected = index == _activeTab;
                      final isPressed = _pressedIndex == index;

                      return Expanded(
                        child: GestureDetector(
                          behavior: HitTestBehavior.opaque,
                          onTapDown: (_) => setState(() => _pressedIndex = index),
                          onTapUp: (_) {
                            setState(() => _pressedIndex = null);
                            _onTap(index);
                          },
                          onTapCancel: () => setState(() => _pressedIndex = null),
                          child: AnimatedScale(
                            scale: isPressed ? 0.93 : 1.0,
                            duration: const Duration(milliseconds: 150),
                            curve: Curves.easeOutQuad,
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                // Icon with elevation & scale
                                AnimatedSlide(
                                  offset: Offset(0, isSelected ? -0.08 : 0.0),
                                  duration: reduceMotion
                                      ? Duration.zero
                                      : const Duration(milliseconds: 300),
                                  curve: Curves.easeOutBack,
                                  child: AnimatedScale(
                                    scale: isSelected ? 1.12 : 1.0,
                                    duration: reduceMotion
                                        ? Duration.zero
                                        : const Duration(milliseconds: 300),
                                    curve: Curves.easeOutBack,
                                    child: Icon(
                                      item.icon,
                                      size: 22,
                                      color: isSelected ? activeColor : inactiveColor,
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 2),

                                // Label with smooth opacity & font weight transition
                                AnimatedDefaultTextStyle(
                                  duration: const Duration(milliseconds: 250),
                                  curve: Curves.easeOut,
                                  style: TextStyle(
                                    fontFamily: 'Nunito',
                                    fontSize: 10.5,
                                    fontWeight: isSelected
                                        ? FontWeight.w800
                                        : FontWeight.w600,
                                    color: isSelected ? activeColor : inactiveColor,
                                  ),
                                  child: Text(
                                    item.label,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),

                                // Active accent dot
                                AnimatedOpacity(
                                  opacity: isSelected ? 1.0 : 0.0,
                                  duration: const Duration(milliseconds: 250),
                                  curve: Curves.easeOut,
                                  child: Container(
                                    margin: const EdgeInsets.only(top: 2),
                                    width: 4,
                                    height: 4,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: activeColor,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    }),
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
