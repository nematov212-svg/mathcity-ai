import 'package:flutter/material.dart';
import '../../../theme/onboarding_theme.dart';

class OnboardingHeader extends StatelessWidget {
  final int currentStep; // 0, 1, 2
  final VoidCallback? onBack;

  const OnboardingHeader({
    super.key,
    required this.currentStep,
    this.onBack,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Back button
            Material(
              color: Colors.white,
              shape: const CircleBorder(),
              elevation: 0,
              child: InkWell(
                customBorder: const CircleBorder(),
                onTap: onBack,
                child: Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: OnboardingTheme.border, width: 1.5),
                    boxShadow: [
                      BoxShadow(
                        color: OnboardingTheme.primary.withOpacity(0.06),
                        blurRadius: 10,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.arrow_back_rounded,
                      size: 22,
                      color: OnboardingTheme.ink,
                    ),
                  ),
                ),
              ),
            ),

            // 3-Segment Animated Progress Bar
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 14),
                child: Row(
                  children: List.generate(3, (index) {
                    final isFilled = index <= currentStep;
                    return Expanded(
                      child: Container(
                        margin: EdgeInsets.only(
                          left: index == 0 ? 0 : 4,
                          right: index == 2 ? 0 : 4,
                        ),
                        height: 6,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(3),
                          color: isFilled ? null : OnboardingTheme.lilac,
                          gradient: isFilled ? OnboardingTheme.ctaGradient : null,
                        ),
                      ),
                    );
                  }),
                ),
              ),
            ),

            // Step counter
            Text(
              '${currentStep + 1}/3',
              style: OnboardingTheme.labelStyle(
                color: OnboardingTheme.muted,
                fontSize: 14,
              ).copyWith(fontWeight: FontWeight.w700),
            ),
          ],
        ),
      ],
    );
  }
}
