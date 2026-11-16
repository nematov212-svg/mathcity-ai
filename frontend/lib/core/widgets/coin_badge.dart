import 'package:flutter/material.dart';

class CoinBadge extends StatelessWidget {
  final int count;
  final double size;
  final bool animate;

  const CoinBadge({
    super.key,
    required this.count,
    this.size = 30,
    this.animate = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF5DF),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: const Color(0xFFFFE8B8), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFF59E0B).withOpacity(0.18),
            blurRadius: 16,
            offset: const Offset(0, 4),
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
          // 3D Golden π Coin (Exact reference design)
          Container(
            width: size,
            height: size,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: const RadialGradient(
                center: Alignment(-0.2, -0.3),
                radius: 0.9,
                colors: [
                  Color(0xFFFFDF70),
                  Color(0xFFF59E0B),
                  Color(0xFFD97706),
                ],
              ),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFFB45309).withOpacity(0.35),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
              border: Border.all(color: const Color(0xFFFFFBEB), width: 1.5),
            ),
            child: const Center(
              child: Text(
                'π',
                style: TextStyle(
                  color: Color(0xFF78350F),
                  fontWeight: FontWeight.w900,
                  fontSize: 15,
                  height: 1.0,
                ),
              ),
            ),
          ),
          const SizedBox(width: 10),
          Text(
            '$count',
            style: const TextStyle(
              color: Color(0xFF291A04),
              fontWeight: FontWeight.w900,
              fontSize: 16,
              letterSpacing: 0.2,
            ),
          ),
        ],
      ),
    );
  }
}
