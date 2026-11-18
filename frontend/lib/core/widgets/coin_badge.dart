import 'package:flutter/material.dart';
import 'coin_icon.dart';

export 'coin_icon.dart';

/// Reusable Coin Badge displaying the official gold coin ($) and animated balance count.
class CoinBadge extends StatelessWidget {
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
            color: const Color(0xFFF59E0B).withValues(alpha: 0.18),
            blurRadius: 14,
            offset: const Offset(0, 3),
          ),
          BoxShadow(
            color: Colors.white.withValues(alpha: 0.8),
            blurRadius: 6,
            offset: const Offset(0, -1),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Official Golden MathCity Coin ($ Design)
          CoinIcon(
            size: size,
            floating: animate,
            popOnAppear: animate,
            sparkle: animate,
          ),
          const SizedBox(width: 8),
          if (disableAnimations)
            Text(
              '$count',
              style: const TextStyle(
                color: Color(0xFF291A04),
                fontWeight: FontWeight.w900,
                fontSize: 16,
                letterSpacing: 0.2,
              ),
            )
          else
            TweenAnimationBuilder<double>(
              tween: Tween<double>(begin: count.toDouble(), end: count.toDouble()),
              duration: const Duration(milliseconds: 500),
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
