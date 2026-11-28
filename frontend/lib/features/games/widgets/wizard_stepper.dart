import 'package:flutter/material.dart';
import 'game_colors.dart';

const List<String> kWizardStepLabels = [
  'Vaqt',
  'Amallar',
  'Sonlar',
  'Jamoalar',
];

/// 4-step wizard stepper (1 Vaqt — 2 Amallar — 3 Sonlar — 4 Jamoalar)
class WizardStepper extends StatelessWidget {
  final int currentStep; // 0 to 3

  const WizardStepper({
    super.key,
    required this.currentStep,
  });

  @override
  Widget build(BuildContext context) {
    final colors = GameColors.of(context);

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          children: List.generate(4, (index) {
            final isCompleted = index < currentStep;
            final isCurrent = index == currentStep;
            final isLast = index == 3;

            return Expanded(
              child: Row(
                children: [
                  // Step Indicator Circle
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 250),
                    curve: Curves.easeInOut,
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: isCurrent
                          ? colors.primaryBlue
                          : isCompleted
                              ? colors.blueTeamBg
                              : colors.borderSubtle,
                      border: Border.all(
                        color: (isCurrent || isCompleted)
                            ? colors.primaryBlue
                            : colors.border,
                        width: 1.5,
                      ),
                    ),
                    child: Center(
                      child: isCompleted
                          ? Icon(
                              Icons.check_rounded,
                              size: 18,
                              color: colors.primaryBlue,
                            )
                          : Text(
                              '${index + 1}',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w800,
                                color: isCurrent
                                    ? Colors.white
                                    : colors.textMuted,
                              ),
                            ),
                    ),
                  ),

                  // Connecting Line
                  if (!isLast)
                    Expanded(
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 250),
                        height: 3,
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        decoration: BoxDecoration(
                          color: isCompleted
                              ? colors.primaryBlue
                              : colors.borderSubtle,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                ],
              ),
            );
          }),
        ),
        const SizedBox(height: 6),

        // Step Label Names
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: List.generate(4, (index) {
            final isCurrent = index == currentStep;
            final isCompleted = index < currentStep;

            return SizedBox(
              width: 60,
              child: Text(
                kWizardStepLabels[index],
                textAlign: TextAlign.center,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: isCurrent ? FontWeight.w800 : FontWeight.w600,
                  color: isCurrent
                      ? colors.primaryBlue
                      : isCompleted
                          ? colors.textPrimary
                          : colors.textMuted,
                ),
              ),
            );
          }),
        ),
      ],
    );
  }
}
