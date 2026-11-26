import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../../theme/onboarding_theme.dart';

class OnboardingScaffold extends StatefulWidget {
  final Widget child;

  const OnboardingScaffold({
    super.key,
    required this.child,
  });

  @override
  State<OnboardingScaffold> createState() => _OnboardingScaffoldState();
}

class _OnboardingScaffoldState extends State<OnboardingScaffold>
    with SingleTickerProviderStateMixin {
  late final AnimationController _floatCtrl;
  bool get _isTesting =>
      WidgetsBinding.instance.runtimeType.toString().contains('Test');

  @override
  void initState() {
    super.initState();
    _floatCtrl = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 8),
    );
    if (!_isTesting) {
      _floatCtrl.repeat(reverse: true);
    }
  }

  @override
  void dispose() {
    _floatCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final media = MediaQuery.sizeOf(context);
    final isTablet = media.width >= 600;
    final disableAnimations =
        MediaQuery.maybeOf(context)?.disableAnimations ?? false;

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: OnboardingTheme.bgGradient,
        ),
        child: Stack(
          children: [
            // ─── 1. Decorative Blurred Circles ──────────────────────────────
            Positioned(
              top: -80,
              left: -80,
              child: Container(
                width: 320,
                height: 320,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: OnboardingTheme.primary.withOpacity(0.12),
                ),
              ),
            ),
            Positioned(
              bottom: -90,
              right: -90,
              child: Container(
                width: 340,
                height: 340,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: OnboardingTheme.pink.withOpacity(0.12),
                ),
              ),
            ),

            // ─── 2. Floating Math Glyphs (+ × π ÷ √) ────────────────────────
            if (!disableAnimations) ...[
              _buildMathSymbol('+', top: 90, left: 24, size: 28, rotation: 0.1),
              _buildMathSymbol('×',
                  top: 220, right: 28, size: 30, rotation: -0.15),
              _buildMathSymbol('π',
                  bottom: 260, left: 32, size: 32, rotation: 0.2),
              _buildMathSymbol('÷',
                  bottom: 120, right: 30, size: 30, rotation: -0.1),
              _buildMathSymbol('√',
                  top: 380, left: 18, size: 28, rotation: 0.05),
            ],

            // ─── 3. Main Responsive Content ──────────────────────────────────
            SafeArea(
              child: Center(
                child: SingleChildScrollView(
                  physics: const ClampingScrollPhysics(),
                  child: ConstrainedBox(
                    constraints: BoxConstraints(
                        maxWidth: isTablet ? 560 : double.infinity),
                    child: isTablet
                        ? Container(
                            margin: const EdgeInsets.symmetric(
                                horizontal: 24, vertical: 24),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(32),
                              border: Border.all(
                                  color: OnboardingTheme.border, width: 1.5),
                              boxShadow: OnboardingTheme.cardShadow(
                                  opacity: 0.14, blur: 32),
                            ),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(32),
                              child: widget.child,
                            ),
                          )
                        : widget.child,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMathSymbol(
    String symbol, {
    double? top,
    double? bottom,
    double? left,
    double? right,
    required double size,
    required double rotation,
  }) {
    return Positioned(
      top: top,
      bottom: bottom,
      left: left,
      right: right,
      child: AnimatedBuilder(
        animation: _floatCtrl,
        builder: (context, child) {
          final dy = math.sin(_floatCtrl.value * math.pi * 2) * 8.0;
          return Transform.translate(
            offset: Offset(0, dy),
            child: Transform.rotate(
              angle: rotation,
              child: child,
            ),
          );
        },
        child: Text(
          symbol,
          style: TextStyle(
            fontFamily: 'Nunito',
            fontSize: size,
            fontWeight: FontWeight.w800,
            color: OnboardingTheme.primary.withOpacity(0.18),
          ),
        ),
      ),
    );
  }
}
