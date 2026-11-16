import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/coin_badge.dart';

class LessonMapScreen extends StatelessWidget {
  const LessonMapScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final nodes = [
      {
        'id': 'lesson-k1-01',
        'title': 'Sonlar: 1 dan 10 gacha',
        'status': 'completed',
        'x': 0.5,
      },
      {
        'id': 'lesson-k1-02',
        'title': 'Qo‘shish amali (+)',
        'status': 'completed',
        'x': 0.3,
      },
      {
        'id': 'lesson-k2-01',
        'title': 'Ayirish amali (-)',
        'status': 'completed',
        'x': 0.7,
      },
      {
        'id': 'lesson-k3-01',
        'title': 'Ko‘paytirish jadvali',
        'status': 'completed',
        'x': 0.4,
      },
      {
        'id': 'lesson-k4-01',
        'title': 'Oddiy kasrlar sirlari',
        'status': 'current',
        'x': 0.6,
      },
      {
        'id': 'lesson-k4-02',
        'title': 'Perimetr va Geometriya',
        'status': 'locked',
        'x': 0.35,
      },
      {
        'id': 'lesson-m5-01',
        'title': 'O‘nli kasrlar',
        'status': 'locked',
        'x': 0.65,
      },
    ];

    return Scaffold(
      backgroundColor: AppColors.kidsBackground,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Text(
          'Darslar xaritasi',
          style: TextStyle(
            fontWeight: FontWeight.w800,
            fontSize: 18,
            color: AppColors.kidsDarkText,
          ),
        ),
        actions: const [
          Padding(
            padding: EdgeInsets.only(right: 16),
            child: Center(child: CoinBadge(count: 250, size: 24)),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(vertical: 24),
        child: Column(
          children: [
            // Chapter banner
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 20),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.kidsBorder, width: 1.5),
              ),
              child: const Row(
                children: [
                  Icon(Icons.flag_rounded, color: AppColors.kidsPrimary, size: 28),
                  SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '4-bob: Kasrlar va Bo‘laklar',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: AppColors.kidsDarkText,
                        ),
                      ),
                      Text(
                        'Kasrlarni tasavvur qilish va solishtirish',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: AppColors.kidsSecondaryText,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Roadmap Path Nodes (Figma 2:14)
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: nodes.length,
              itemBuilder: (context, index) {
                final node = nodes[index];
                final status = node['status'] as String;
                final isCurrent = status == 'current';
                final isCompleted = status == 'completed';
                final isLocked = status == 'locked';
                final xOffset = (node['x'] as double);

                return Column(
                  children: [
                    Align(
                      alignment: FractionalOffset(xOffset, 0.5),
                      child: InkWell(
                        onTap: isLocked
                            ? null
                            : () {
                                context.push('/kids/lesson/${node['id']}');
                              },
                        borderRadius: BorderRadius.circular(40),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: isCurrent ? 74 : 64,
                              height: isCurrent ? 74 : 64,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: isCompleted
                                    ? AppColors.kidsGreen
                                    : isCurrent
                                        ? AppColors.kidsPrimary
                                        : const Color(0xFFD4D7E5),
                                border: Border.all(
                                  color: Colors.white,
                                  width: isCurrent ? 4 : 3,
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: (isCurrent
                                            ? AppColors.kidsPrimary
                                            : isCompleted
                                                ? AppColors.kidsGreen
                                                : Colors.black)
                                        .withOpacity(isLocked ? 0.05 : 0.25),
                                    blurRadius: 14,
                                    offset: const Offset(0, 6),
                                  ),
                                ],
                              ),
                              child: Center(
                                child: isCompleted
                                    ? const Icon(Icons.check_rounded, color: Colors.white, size: 34)
                                    : isCurrent
                                        ? const Icon(Icons.play_arrow_rounded,
                                            color: Colors.white, size: 40)
                                        : const Icon(Icons.lock_rounded,
                                            color: Color(0xFF8B8EA0), size: 26),
                              ),
                            ),
                            const SizedBox(height: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: isCurrent
                                      ? AppColors.kidsPrimary
                                      : AppColors.kidsBorder,
                                ),
                              ),
                              child: Text(
                                node['title'] as String,
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                  color: isCurrent
                                      ? AppColors.kidsPrimary
                                      : isLocked
                                          ? AppColors.kidsSecondaryText
                                          : AppColors.kidsDarkText,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    if (index < nodes.length - 1)
                      Container(
                        width: 4,
                        height: 36,
                        color: const Color(0xFFD4D7E5),
                      ),
                  ],
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
