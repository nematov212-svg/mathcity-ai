import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../theme/onboarding_theme.dart';

enum ChipVariant {
  rule,
  suggestion,
}

class ChipTag extends StatefulWidget {
  final String label;
  final ChipVariant variant;
  final VoidCallback? onTap;

  const ChipTag({
    super.key,
    required this.label,
    this.variant = ChipVariant.rule,
    this.onTap,
  });

  @override
  State<ChipTag> createState() => _ChipTagState();
}

class _ChipTagState extends State<ChipTag> with SingleTickerProviderStateMixin {
  late final AnimationController _pulseCtrl;
  late final Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _pulseCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 140),
      lowerBound: 0.0,
      upperBound: 1.0,
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.94).animate(
      CurvedAnimation(parent: _pulseCtrl, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pulseCtrl.dispose();
    super.dispose();
  }

  void _handleTap() {
    if (widget.onTap != null) {
      HapticFeedback.selectionClick();
      _pulseCtrl.forward().then((_) => _pulseCtrl.reverse());
      widget.onTap!();
    }
  }

  @override
  Widget build(BuildContext context) {
    final isRule = widget.variant == ChipVariant.rule;

    return ScaleTransition(
      scale: _scaleAnimation,
      child: Material(
        color: isRule ? OnboardingTheme.lilac : Colors.white,
        borderRadius: BorderRadius.circular(999),
        child: InkWell(
          borderRadius: BorderRadius.circular(999),
          onTap: widget.onTap != null ? _handleTap : null,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(999),
              border: isRule ? null : Border.all(color: OnboardingTheme.border, width: 1.4),
              boxShadow: isRule
                  ? []
                  : [
                      BoxShadow(
                        color: OnboardingTheme.primary.withOpacity(0.04),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
            ),
            child: Text(
              widget.label,
              style: OnboardingTheme.labelStyle(
                color: isRule ? OnboardingTheme.primary : OnboardingTheme.ink,
                fontSize: 13,
              ).copyWith(fontWeight: FontWeight.w700),
            ),
          ),
        ),
      ),
    );
  }
}
