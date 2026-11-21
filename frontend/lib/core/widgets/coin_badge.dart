import 'package:flutter/material.dart';
import 'coin_icon.dart';

export 'coin_icon.dart';

/// Reusable Coin Badge displaying the official gold coin ($) and animated balance count.
class CoinBadge extends StatefulWidget {
  final int count;
  final double size;
  final bool animate;

  const CoinBadge({
    super.key,
    required this.count,
    this.size = 28,
    this.animate = false,
  });

  @override
  State<CoinBadge> createState() => _CoinBadgeState();
}

class _CoinBadgeState extends State<CoinBadge> with SingleTickerProviderStateMixin {
  late int _previousCount;
  late AnimationController _bounceController;
  late Animation<double> _bounceAnimation;

  @override
  void initState() {
    super.initState();
    _previousCount = widget.count;
    _bounceController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 450),
    );
    _bounceAnimation = TweenSequence<double>([
      TweenSequenceItem(tween: Tween<double>(begin: 1.0, end: 1.25).chain(CurveTween(curve: Curves.easeOutBack)), weight: 50),
      TweenSequenceItem(tween: Tween<double>(begin: 1.25, end: 1.0).chain(CurveTween(curve: Curves.easeInCubic)), weight: 50),
    ]).animate(_bounceController);
  }

  @override
  void didUpdateWidget(covariant CoinBadge oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.count != widget.count) {
      _previousCount = oldWidget.count;
      _bounceController.forward(from: 0.0);
    }
  }

  @override
  void dispose() {
    _bounceController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final media = MediaQuery.maybeOf(context);
    final disableAnimations = media?.disableAnimations ?? false;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF5DF),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: const Color(0xFFFFE8B8), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFF59E0B).withOpacity(0.18),
            blurRadius: 14,
            offset: const Offset(0, 3),
          ),
          BoxShadow(
            color: Colors.white.withOpacity(0.8),
            blurRadius: 6,
            offset: const Offset(0, -1),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Official Golden MathCity Coin with dynamic bounce
          ScaleTransition(
            scale: disableAnimations ? const AlwaysStoppedAnimation(1.0) : _bounceAnimation,
            child: CoinIcon(
              size: widget.size,
              floating: widget.animate,
              popOnAppear: widget.animate,
              sparkle: widget.animate,
            ),
          ),
          const SizedBox(width: 8),
          if (disableAnimations)
            Text(
              '${widget.count}',
              style: const TextStyle(
                color: Color(0xFF291A04),
                fontWeight: FontWeight.w900,
                fontSize: 16,
                letterSpacing: 0.2,
              ),
            )
          else
            TweenAnimationBuilder<double>(
              tween: Tween<double>(begin: _previousCount.toDouble(), end: widget.count.toDouble()),
              duration: const Duration(milliseconds: 600),
              curve: Curves.easeOutCubic,
              builder: (context, value, child) {
                return Text(
                  '${value.round()}',
                  style: const TextStyle(
                    color: Color(0xFF291A04),
                    fontWeight: FontWeight.w900,
                    fontSize: 16,
                    letterSpacing: 0.2,
                  ),
                );
              },
            ),
        ],
      ),
    );
  }
}
