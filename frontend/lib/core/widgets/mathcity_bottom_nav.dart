import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import '../theme/app_theme.dart';

class MathCityBottomNav extends StatefulWidget {
  final int currentIndex;

  const MathCityBottomNav({
    super.key,
    required this.currentIndex,
  });

  @override
  State<MathCityBottomNav> createState() => _MathCityBottomNavState();
}

class _MathCityBottomNavState extends State<MathCityBottomNav> with TickerProviderStateMixin {
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;
  int _activeTab = 0;

  // The 5 primary tabs: Asosiy, Darslar, AI Ustoz, Reyting, Profil
  final List<({String label, IconData icon, String route})> _items = const [
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

    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );

    _pulseAnimation = TweenSequence<double>([
      TweenSequenceItem(
        tween: Tween<double>(begin: 1.0, end: 1.15).chain(CurveTween(curve: Curves.easeOutBack)),
        weight: 50,
      ),
      TweenSequenceItem(
        tween: Tween<double>(begin: 1.15, end: 1.0).chain(CurveTween(curve: Curves.easeInCubic)),
        weight: 50,
      ),
    ]).animate(_pulseController);
  }

  @override
  void didUpdateWidget(covariant MathCityBottomNav oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.currentIndex != widget.currentIndex) {
      setState(() {
        _activeTab = widget.currentIndex.clamp(0, _items.length - 1);
      });
      _pulseController.forward(from: 0.0);
    }
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  void _onTap(int index) {
    if (index == _activeTab) return;
    HapticFeedback.selectionClick();
    setState(() {
      _activeTab = index;
    });
    _pulseController.forward(from: 0.0);
    context.go(_items[index].route);
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final screenW = MediaQuery.of(context).size.width;
    final horizMargin = screenW < 360 ? 10.0 : 16.0;

    // Alignment calculation for the sliding pill: -1.0 (leftmost) to +1.0 (rightmost)
    final double pillAlignX = _items.isEmpty
        ? 0.0
        : -1.0 + (_activeTab / (_items.length - 1)) * 2.0;

    return Container(
      height: 70,
      margin: EdgeInsets.only(left: horizMargin, right: horizMargin, bottom: 14),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(28),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
          child: Container(
            decoration: BoxDecoration(
              color: isDark
                  ? const Color(0xFF1E1742).withValues(alpha: 0.35)
                  : Colors.white.withValues(alpha: 0.22),
              borderRadius: BorderRadius.circular(28),
              border: Border.all(
                color: Colors.white.withValues(alpha: isDark ? 0.15 : 0.25),
                width: 1.0,
              ),
              boxShadow: [
                BoxShadow(
                  color: const Color(0x1A5B3BE8),
                  blurRadius: 24,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Stack(
              alignment: Alignment.center,
              children: [
                // 1. Sliding Pill Background Indicator
                AnimatedAlign(
                  alignment: Alignment(pillAlignX, 0.0),
                  duration: const Duration(milliseconds: 280),
                  curve: Curves.easeOutCubic,
                  child: FractionallySizedBox(
                    widthFactor: 1.0 / _items.length,
                    heightFactor: 0.82,
                    child: Container(
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFF6C55E0).withValues(alpha: isDark ? 0.28 : 0.16),
                        borderRadius: BorderRadius.circular(22),
                        border: Border.all(
                          color: const Color(0xFF6C55E0).withValues(alpha: 0.32),
                          width: 1.0,
                        ),
                      ),
                    ),
                  ),
                ),

                // 2. Interactive Tab Buttons Row
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: List.generate(_items.length, (index) {
                    final item = _items[index];
                    final isSelected = index == _activeTab;
                    const primaryColor = Color(0xFF6C55E0);
                    final color = isSelected
                        ? primaryColor
                        : (isDark ? Colors.white60 : colors.inactive);

                    return Expanded(
                      child: InkWell(
                        onTap: () => _onTap(index),
                        borderRadius: BorderRadius.circular(24),
                        splashColor: Colors.transparent,
                        highlightColor: Colors.transparent,
                        child: AnimatedBuilder(
                          animation: _pulseAnimation,
                          builder: (context, child) {
                            final pulseScale = isSelected ? _pulseAnimation.value : 1.0;
                            return Transform.scale(
                              scale: isSelected ? 1.08 * pulseScale : 1.0,
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  AnimatedContainer(
                                    duration: const Duration(milliseconds: 250),
                                    curve: Curves.easeOut,
                                    child: Icon(
                                      item.icon,
                                      size: isSelected ? 23 : 21,
                                      color: color,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  AnimatedOpacity(
                                    opacity: isSelected ? 1.0 : 0.7,
                                    duration: const Duration(milliseconds: 200),
                                    child: FittedBox(
                                      fit: BoxFit.scaleDown,
                                      child: Text(
                                        item.label,
                                        maxLines: 1,
                                        style: TextStyle(
                                          fontSize: 10.5,
                                          fontWeight: isSelected
                                              ? FontWeight.w900
                                              : FontWeight.w600,
                                          color: color,
                                        ),
                                      ),
                                    ),
                                  ),
                                  if (isSelected)
                                    Container(
                                      margin: const EdgeInsets.only(top: 2),
                                      width: 4,
                                      height: 4,
                                      decoration: const BoxDecoration(
                                        shape: BoxShape.circle,
                                        color: primaryColor,
                                      ),
                                    ),
                                ],
                              ),
                            );
                          },
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
    );
  }
}
