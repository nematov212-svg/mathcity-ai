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

class _MathCityBottomNavState extends State<MathCityBottomNav> with SingleTickerProviderStateMixin {
  late AnimationController _bounceController;
  late Animation<double> _bounceAnimation;
  int _lastSelectedIndex = -1;

  final List<({String label, IconData icon, String route})> _items = const [
    (label: 'Bosh sahifa', icon: Icons.home_rounded, route: '/kids/home'),
    (label: 'Darslar', icon: Icons.menu_book_rounded, route: '/kids/lessons'),
    (label: 'AI Ustoz', icon: Icons.smart_toy_rounded, route: '/kids/ai-tutor'),
    (label: 'O‘yinlar', icon: Icons.sports_esports_rounded, route: '/kids/games'),
    (label: 'Shahrim', icon: Icons.location_city_rounded, route: '/kids/city'),
    (label: 'Profil', icon: Icons.person_rounded, route: '/kids/profile'),
  ];

  @override
  void initState() {
    super.initState();
    _lastSelectedIndex = widget.currentIndex;
    _bounceController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 350),
    );
    _bounceAnimation = TweenSequence<double>([
      TweenSequenceItem(tween: Tween<double>(begin: 0.0, end: -6.0).chain(CurveTween(curve: Curves.easeOut)), weight: 50),
      TweenSequenceItem(tween: Tween<double>(begin: -6.0, end: 0.0).chain(CurveTween(curve: Curves.bounceOut)), weight: 50),
    ]).animate(_bounceController);
  }

  @override
  void didUpdateWidget(covariant MathCityBottomNav oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.currentIndex != widget.currentIndex) {
      _lastSelectedIndex = widget.currentIndex;
      _bounceController.forward(from: 0.0);
    }
  }

  @override
  void dispose() {
    _bounceController.dispose();
    super.dispose();
  }

  void _onTap(int index) {
    if (index == widget.currentIndex) return;
    HapticFeedback.selectionClick();
    _lastSelectedIndex = index;
    _bounceController.forward(from: 0.0);
    context.go(_items[index].route);
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final screenW = MediaQuery.of(context).size.width;
    final horizMargin = screenW < 360 ? 8.0 : 16.0;

    return Container(
      height: 68,
      margin: EdgeInsets.only(left: horizMargin, right: horizMargin, bottom: 12),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(36),
        border: Border.all(color: colors.border, width: 1.2),
        boxShadow: [
          BoxShadow(
            color: isDark ? const Color(0x33000000) : const Color(0x185232D9),
            blurRadius: 24,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: List.generate(_items.length, (index) {
          final item = _items[index];
          final isSelected = index == widget.currentIndex;
          final color = isSelected ? colors.primaryDark : colors.inactive;

          return Expanded(
            child: InkWell(
              onTap: () => _onTap(index),
              borderRadius: BorderRadius.circular(36),
              splashColor: Colors.transparent,
              highlightColor: Colors.transparent,
              child: AnimatedBuilder(
                animation: _bounceAnimation,
                builder: (context, child) {
                  final offset = (isSelected && _lastSelectedIndex == index)
                      ? _bounceAnimation.value
                      : 0.0;
                  return Transform.translate(
                    offset: Offset(0, offset),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 2),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            item.icon,
                            size: 22,
                            color: color,
                          ),
                          const SizedBox(height: 2),
                          FittedBox(
                            fit: BoxFit.scaleDown,
                            child: Text(
                              item.label,
                              maxLines: 1,
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                                color: color,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          );
        }),
      ),
    );
  }
}
