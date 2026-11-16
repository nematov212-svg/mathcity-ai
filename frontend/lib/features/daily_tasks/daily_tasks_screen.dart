import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/coin_badge.dart';
import '../../shared/providers/student_provider.dart';

class DailyTasksScreen extends ConsumerStatefulWidget {
  const DailyTasksScreen({super.key});

  @override
  ConsumerState<DailyTasksScreen> createState() => _DailyTasksScreenState();
}

class _DailyTasksScreenState extends ConsumerState<DailyTasksScreen> {
  final List<Map<String, dynamic>> _tasks = [
    {
      'key': 'task_solve_5',
      'title': '5 ta masala yeching',
      'desc': 'Dars yoki mashqlardan 5 ta to‘g‘ri javob toping.',
      'current': 3,
      'target': 5,
      'coins': 30,
      'xp': 40,
      'claimed': false,
    },
    {
      'key': 'task_complete_lesson',
      'title': '1 ta yangi darsni yakunlang',
      'desc': 'O‘quv xaritasidagi istalgan darsni to‘liq o‘ting.',
      'current': 1,
      'target': 1,
      'coins': 50,
      'xp': 60,
      'claimed': false,
    },
    {
      'key': 'task_play_space_game',
      'title': 'Kosmik hisob o‘yinini o‘ynang',
      'desc': 'Fazoviy arifmetika o‘yinida kamida 50 ball to‘plang.',
      'current': 1,
      'target': 1,
      'coins': 25,
      'xp': 30,
      'claimed': true,
    },
    {
      'key': 'task_ai_consult',
      'title': 'Ziyo ustozdan yordam so‘rang',
      'desc': 'Tushunmagan misolingiz bo‘yicha Ziyo bilan suhbatlashing.',
      'current': 1,
      'target': 1,
      'coins': 20,
      'xp': 25,
      'claimed': false,
    },
  ];

  void _claimReward(int index) {
    final task = _tasks[index];
    if (task['claimed'] == true) return;

    setState(() {
      task['claimed'] = true;
    });

    ref.read(studentProvider.notifier).updateCoins(task['coins'] as int);
    ref.read(studentProvider.notifier).updateXP(task['xp'] as int);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('+${task['coins']} oltin tanga va +${task['xp']} XP hisobingizga qo‘shildi!'),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.kidsBackground,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.kidsDarkText),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Kunlik vazifalar',
          style: TextStyle(
            fontWeight: FontWeight.w800,
            fontSize: 18,
            color: AppColors.kidsDarkText,
          ),
        ),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        itemCount: _tasks.length,
        itemBuilder: (context, index) {
          final task = _tasks[index];
          final current = task['current'] as int;
          final target = task['target'] as int;
          final isCompleted = current >= target;
          final claimed = task['claimed'] as bool;
          final double progress = (current / target).clamp(0.0, 1.0);

          return Container(
            margin: const EdgeInsets.only(bottom: 16),
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: AppColors.kidsBorder, width: 1.5),
              boxShadow: [
                BoxShadow(
                  color: AppColors.kidsDarkText.withOpacity(0.04),
                  blurRadius: 14,
                  offset: const Offset(0, 5),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        task['title'],
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: AppColors.kidsDarkText,
                        ),
                      ),
                    ),
                    CoinBadge(count: task['coins'], size: 22),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  task['desc'],
                  style: const TextStyle(
                    fontSize: 13,
                    color: AppColors.kidsSecondaryText,
                  ),
                ),
                const SizedBox(height: 14),
                Row(
                  children: [
                    Expanded(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: LinearProgressIndicator(
                          value: progress,
                          minHeight: 8,
                          backgroundColor: const Color(0xFFECEEFA),
                          color: isCompleted ? AppColors.kidsGreen : AppColors.kidsPrimary,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Text(
                      '$current / $target',
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: AppColors.kidsDarkText,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                Align(
                  alignment: Alignment.centerRight,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: claimed
                          ? const Color(0xFFE2F6F0)
                          : isCompleted
                              ? AppColors.kidsGreen
                              : const Color(0xFFD4D7E5),
                      foregroundColor: claimed ? AppColors.kidsGreen : Colors.white,
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    onPressed: isCompleted && !claimed ? () => _claimReward(index) : null,
                    child: Text(
                      claimed
                          ? 'Olingan ✓'
                          : isCompleted
                              ? 'Mukofotni olish'
                              : 'Bajarilmoqda',
                      style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
