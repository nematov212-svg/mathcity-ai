import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../theme/onboarding_theme.dart';

class PrimaryButton extends StatefulWidget {
  final String text;
  final Widget? trailing;
  final VoidCallback? onPressed;
  final bool isLoading;
  final bool isSuccess;

  const PrimaryButton({
    super.key,
    required this.text,
    this.trailing,
    this.onPressed,
    this.isLoading = false,
    this.isSuccess = false,
  });

  @override
  State<PrimaryButton> createState() => _PrimaryButtonState();
}

class _PrimaryButtonState extends State<PrimaryButton> with SingleTickerProviderStateMixin {
  late final AnimationController _scaleCtrl;
  late final Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _scaleCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 100),
      lowerBound: 0.0,
      upperBound: 1.0,
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.96).animate(
      CurvedAnimation(parent: _scaleCtrl, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _scaleCtrl.dispose();
    super.dispose();
  }

  void _onTapDown(TapDownDetails _) {
    if (widget.onPressed != null && !widget.isLoading && !widget.isSuccess) {
      _scaleCtrl.forward();
      HapticFeedback.lightImpact();
    }
  }

  void _onTapUp(TapUpDetails _) {
    _scaleCtrl.reverse();
  }

  void _onTapCancel() {
    _scaleCtrl.reverse();
  }

  @override
  Widget build(BuildContext context) {
    final isEnabled = widget.onPressed != null && !widget.isLoading;
    final isTablet = MediaQuery.sizeOf(context).width >= 600;
    final buttonHeight = isTablet ? 62.0 : 58.0;

    return ScaleTransition(
      scale: _scaleAnimation,
      child: GestureDetector(
        onTapDown: _onTapDown,
        onTapUp: _onTapUp,
        onTapCancel: _onTapCancel,
        onTap: isEnabled ? widget.onPressed : null,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 250),
          width: double.infinity,
          height: buttonHeight,
          decoration: BoxDecoration(
            gradient: widget.isSuccess
                ? const LinearGradient(colors: [Color(0xFF22C55E), Color(0xFF16A34A)])
                : (isEnabled
                    ? OnboardingTheme.ctaGradient
                    : LinearGradient(colors: [
                        OnboardingTheme.muted.withOpacity(0.35),
                        OnboardingTheme.muted.withOpacity(0.5),
                      ])),
            borderRadius: BorderRadius.circular(OnboardingTheme.buttonRadius),
            boxShadow: isEnabled
                ? (widget.isSuccess
                    ? [
                        BoxShadow(
                          color: const Color(0xFF22C55E).withOpacity(0.35),
                          blurRadius: 24,
                          offset: const Offset(0, 8),
                        ),
                      ]
                    : OnboardingTheme.primaryShadow(opacity: 0.38, blur: 24))
                : [],
          ),
          child: Center(
            child: widget.isLoading
                ? const SizedBox(
                    width: 24,
                    height: 24,
                    child: CircularProgressIndicator(
                      strokeWidth: 2.8,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  )
                : Row(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        widget.text,
                        style: OnboardingTheme.buttonStyle(
                          color: isEnabled ? Colors.white : Colors.white.withOpacity(0.85),
                          fontSize: isTablet ? 18 : 17,
                        ),
                      ),
                      if (widget.trailing != null) ...[
                        const SizedBox(width: 8),
                        widget.trailing!,
                      ],
                    ],
                  ),
          ),
        ),
      ),
    );
  }
}
