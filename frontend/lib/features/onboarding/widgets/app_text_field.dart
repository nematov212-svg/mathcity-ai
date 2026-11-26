import 'package:flutter/material.dart';
import '../../../theme/onboarding_theme.dart';

class AppTextField extends StatefulWidget {
  final TextEditingController controller;
  final String placeholder;
  final Widget? prefix;
  final Widget? suffix;
  final ValueChanged<String>? onChanged;
  final bool hasError;
  final bool isValid;
  final bool isShake;

  const AppTextField({
    super.key,
    required this.controller,
    required this.placeholder,
    this.prefix,
    this.suffix,
    this.onChanged,
    this.hasError = false,
    this.isValid = false,
    this.isShake = false,
  });

  @override
  State<AppTextField> createState() => _AppTextFieldState();
}

class _AppTextFieldState extends State<AppTextField>
    with SingleTickerProviderStateMixin {
  late final AnimationController _shakeCtrl;
  late final Animation<double> _shakeAnimation;
  final FocusNode _focusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    _shakeCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    _shakeAnimation = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: 0.0, end: -6.0), weight: 1),
      TweenSequenceItem(tween: Tween(begin: -6.0, end: 6.0), weight: 2),
      TweenSequenceItem(tween: Tween(begin: 6.0, end: -4.0), weight: 2),
      TweenSequenceItem(tween: Tween(begin: -4.0, end: 4.0), weight: 2),
      TweenSequenceItem(tween: Tween(begin: 4.0, end: 0.0), weight: 1),
    ]).animate(CurvedAnimation(parent: _shakeCtrl, curve: Curves.easeInOut));

    _focusNode.addListener(() => setState(() {}));
  }

  @override
  void didUpdateWidget(covariant AppTextField oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.isShake && !oldWidget.isShake) {
      _shakeCtrl.forward(from: 0.0);
    }
  }

  @override
  void dispose() {
    _shakeCtrl.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isTablet = MediaQuery.sizeOf(context).width >= 600;
    final isFocused = _focusNode.hasFocus;

    Color borderColor = OnboardingTheme.border;
    List<BoxShadow> glow = [];

    if (widget.hasError) {
      borderColor = OnboardingTheme.error;
      glow = [
        BoxShadow(
          color: OnboardingTheme.error.withOpacity(0.16),
          blurRadius: 10,
          offset: const Offset(0, 2),
        ),
      ];
    } else if (widget.isValid) {
      borderColor = OnboardingTheme.primary;
      glow = [
        BoxShadow(
          color: OnboardingTheme.primary.withOpacity(0.12),
          blurRadius: 10,
          offset: const Offset(0, 2),
        ),
      ];
    } else if (isFocused) {
      borderColor = OnboardingTheme.primary;
      glow = [
        BoxShadow(
          color: OnboardingTheme.primary.withOpacity(0.16),
          blurRadius: 12,
          offset: const Offset(0, 2),
        ),
      ];
    }

    return AnimatedBuilder(
      animation: _shakeAnimation,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(_shakeAnimation.value, 0),
          child: child,
        );
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        height: isTablet ? 62.0 : 56.0,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(OnboardingTheme.inputRadius),
          border: Border.all(color: borderColor, width: 2.0),
          boxShadow: glow,
        ),
        child: Row(
          children: [
            if (widget.prefix != null) ...[
              widget.prefix!,
              const SizedBox(width: 12),
            ],
            Expanded(
              child: TextField(
                controller: widget.controller,
                focusNode: _focusNode,
                onChanged: widget.onChanged,
                style: OnboardingTheme.inputStyle(),
                decoration: InputDecoration(
                  border: InputBorder.none,
                  hintText: widget.placeholder,
                  hintStyle: OnboardingTheme.inputStyle(
                      color: OnboardingTheme.muted.withOpacity(0.65)),
                  isDense: true,
                  contentPadding: EdgeInsets.zero,
                ),
              ),
            ),
            if (widget.suffix != null) ...[
              const SizedBox(width: 8),
              widget.suffix!,
            ],
          ],
        ),
      ),
    );
  }
}
