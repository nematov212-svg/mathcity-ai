import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

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
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF7E6),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFFFE099), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: Colors.amber.withOpacity(0.12),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          // 3D Gold Coin with math symbol (strictly no stars)
          Container(
            width: size,
            height: size,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: AppColors.coinGradient,
              boxShadow: [
                BoxShadow(
                  color: AppColors.coinGoldDark.withOpacity(0.4),
                  blurRadius: 3,
                  offset: const Offset(0, 2),
                ),
              ],
              border: Border.all(color: const Color(0xFFFFFAEB), width: 1.5),
            ),
            child: const Center(
              child: Text(
                'π',
                style: TextStyle(
                  color: Color(0xFF7A4800),
                  fontWeight: FontWeight.w900,
                  fontSize: 14,
                ),
              ),
            ),
          ),
          const SizedBox(width: 8),
          Text(
            '$count',
            style: const TextStyle(
              color: Color(0xFF6B4500),
              fontWeight: FontWeight.w800,
              fontSize: 15,
            ),
          ),
        ],
      ),
    );
  }
}
