import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/coin_badge.dart';
import '../../shared/providers/student_provider.dart';

class LessonMapScreen extends ConsumerWidget {
  const LessonMapScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = AppThemeColors.of(context);
    final coinBalance = ref.watch(studentProvider).student?.coinBalance ?? 0;

    return Scaffold(
      backgroundColor: colors.bg,
      appBar: AppBar(
        backgroundColor: colors.card,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new_rounded, color: colors.ink),
          onPressed: () => context.canPop() ? context.pop() : context.go('/kids/home'),
        ),
        title: Text(
          'Darslar xaritasi',
          style: TextStyle(
            fontWeight: FontWeight.w800,
            fontSize: 18,
            color: colors.ink,
          ),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Center(child: CoinBadge(count: coinBalance, size: 24)),
          ),
        ],
      ),
      body: const LessonMapContent(),
    );
  }
}

class LessonMapContent extends StatelessWidget {
  const LessonMapContent({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);

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

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.fromLTRB(0, 24, 0, 100),
      child: Column(
        children: [
          // Chapter banner
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 20),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: colors.card,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: colors.border, width: 1.5),
            ),
            child: Row(
              children: [
                Icon(Icons.flag_rounded, color: colors.primary, size: 28),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '4-bob: Kasrlar va Bo‘laklar',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: colors.ink,
                        ),
                      ),
                      Text(
                        'Kasrlarni tasavvur qilish va solishtirish',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: colors.muted,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),

          // Roadmap Path Nodes
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
                                      ? colors.primary
                                      : colors.border,
                              border: Border.all(
                                color: Colors.white,
                                width: isCurrent ? 4 : 3,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: (isCurrent
                                          ? colors.primary
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
                                      ? const Icon(Icons.play_arrow_rounded, color: Colors.white, size: 40)
                                      : const Icon(Icons.lock_rounded, color: Color(0xFF8B8EA0), size: 26),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: colors.card,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: isCurrent ? colors.primary : colors.border,
                              ),
                            ),
                            child: Text(
                              node['title'] as String,
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                color: isCurrent
                                    ? colors.primary
                                    : isLocked
                                        ? colors.muted
                                        : colors.ink,
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
                      color: colors.border,
                    ),
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}
