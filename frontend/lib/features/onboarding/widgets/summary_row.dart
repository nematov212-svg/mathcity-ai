import 'package:flutter/material.dart';
import '../../../theme/onboarding_theme.dart';

class SummaryRow extends StatelessWidget {
  final Widget icon;
  final String label;
  final String value;
  final bool isGold;
  final bool showDivider;

  const SummaryRow({
    super.key,
    required this.icon,
    required this.label,
    required this.value,
    this.isGold = false,
    this.showDivider = true,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 14),
          child: Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color:
                      isGold ? OnboardingTheme.goldBg : OnboardingTheme.lilac,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Center(
                  child: icon,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Text(
                  label,
                  style: OnboardingTheme.labelStyle(
                    color: OnboardingTheme.muted,
                    fontSize: 15,
                  ).copyWith(fontWeight: FontWeight.w600),
                ),
              ),
              Text(
                value,
                style: OnboardingTheme.labelStyle(
                  color: isGold ? OnboardingTheme.gold : OnboardingTheme.ink,
                  fontSize: 16,
                ).copyWith(fontWeight: FontWeight.w800),
              ),
            ],
          ),
        ),
        if (showDivider)
          const Divider(
            height: 1,
            thickness: 1,
            color: OnboardingTheme.border,
          ),
      ],
    );
  }
}
