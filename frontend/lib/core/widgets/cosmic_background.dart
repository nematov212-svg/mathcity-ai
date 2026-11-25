import 'package:flutter/material.dart';
import 'animated_math_background.dart';

/// Legacy adapter for [AnimatedMathBackground] to ensure backwards compatibility.
class CosmicBackground extends StatelessWidget {
  final Widget? child;
  final bool hasContent;

  const CosmicBackground({
    super.key,
    this.child,
    this.hasContent = true,
  });

  @override
  Widget build(BuildContext context) {
    if (child != null) {
      return Stack(
        children: [
          const AnimatedMathBackground(),
          child!,
        ],
      );
    }
    return const AnimatedMathBackground();
  }
}
