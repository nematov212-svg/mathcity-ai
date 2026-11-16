import 'package:flutter/material.dart';

class XPBar extends StatelessWidget {
  final int currentXP;
  final int level;
  final bool isDark;

  const XPBar({
    super.key,
    required this.currentXP,
    required this.level,
    this.isDark = false,
  });

  @override
  Widget build(BuildContext context) {
    final int levelBaseXP = (level - 1) * 200;
    final int progressXP = currentXP - levelBaseXP;
    final double percent = (progressXP / 200.0).clamp(0.08, 1.0); // Minimum gentle visual fill

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF151C2D) : Colors.white,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(
          color: isDark ? const Color(0xFF222B42) : const Color(0xFFEFF0FA),
          width: 1.2,
        ),
        boxShadow: [
          BoxShadow(
            color: (isDark ? Colors.black : const Color(0xFF7154EC)).withOpacity(0.05),
            blurRadius: 18,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '$level-daraja',
                style: TextStyle(
                  fontWeight: FontWeight.w800,
                  fontSize: 14,
                  color: isDark ? const Color(0xFFC7FA74) : const Color(0xFF4F39CE),
                ),
              ),
              Text(
                '$currentXP XP',
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 13,
                  color: isDark ? const Color(0xFF8B9BB4) : const Color(0xFF8C8CA8),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          ClipRRect(
            borderRadius: BorderRadius.circular(999),
            child: Container(
              height: 8,
              width: double.infinity,
              color: isDark ? const Color(0xFF232D42) : const Color(0xFFEDEAFD),
              child: FractionallySizedBox(
                alignment: Alignment.centerLeft,
                widthFactor: percent,
                child: Container(
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFFC7FA74) : const Color(0xFF9E8EFA),
                    borderRadius: BorderRadius.circular(999),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
