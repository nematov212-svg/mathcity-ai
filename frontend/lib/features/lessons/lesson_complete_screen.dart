import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/coin_badge.dart';
import '../../core/widgets/custom_button.dart';
import '../../shared/providers/student_provider.dart';

class LessonCompleteScreen extends ConsumerWidget {
  const LessonCompleteScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppColors.kidsBackground,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            children: [
              const Spacer(flex: 1),
              // Trophy & Celebration Graphic
              Container(
                width: 130,
                height: 130,
                decoration: BoxDecoration(
                  gradient: AppColors.kidsPrimaryGradient,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.kidsPrimary.withOpacity(0.3),
                      blurRadius: 28,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: const Center(
                  child: Icon(Icons.emoji_events_rounded, color: Colors.white, size: 68),
                ),
              ),
              const SizedBox(height: 28),
              const Text(
                'Barakalla!',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w900,
                  color: AppColors.kidsDarkText,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Siz "Oddiy kasrlar" darsini a’lo darajada yakunladingiz!',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                  color: AppColors.kidsSecondaryText,
                ),
              ),
              const Spacer(flex: 1),

              // Reward Cards (Figma 2:26)
              Container(
                padding: const EdgeInsets.all(22),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(28),
                  border: Border.all(color: AppColors.kidsBorder, width: 1.5),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.kidsDarkText.withOpacity(0.04),
                      blurRadius: 16,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    const Text(
                      'YUTUQLARINGIZ',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        color: AppColors.kidsSecondaryText,
                        letterSpacing: 1.2,
                      ),
                    ),
                    const SizedBox(height: 18),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        // Coins Reward (Figma 2:26)
                        Column(
                          children: [
                            const CoinBadge(count: 50, size: 32),
                            const SizedBox(height: 8),
                            const Text(
                              '+50 Oltin tanga',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF6B4500),
                              ),
                            ),
                          ],
                        ),
                        Container(width: 1.5, height: 48, color: AppColors.kidsBorder),
                        // XP Reward
                        Column(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF0EDFF),
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(color: const Color(0xFFDED6FF)),
                              ),
                              child: const Text(
                                '+50 XP',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w900,
                                  color: AppColors.kidsPrimary,
                                ),
                              ),
                            ),
                            const SizedBox(height: 8),
                            const Text(
                              'Tajriba bali',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                                color: AppColors.kidsPrimary,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const Spacer(flex: 2),

              // Action button
              CustomButton(
                text: 'Bosh sahifaga qaytish',
                backgroundColor: AppColors.kidsPrimary,
                borderRadius: 20,
                onPressed: () {
                  ref.read(studentProvider.notifier).refreshProfile();
                  context.go('/kids/home');
                },
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
