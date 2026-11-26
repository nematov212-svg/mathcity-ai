import 'package:flutter/material.dart';

enum ScreenType {
  compact, // < 600px (Mobile)
  medium, // 600px - 1023px (Tablet)
  expanded // >= 1024px (Desktop)
}

ScreenType getScreenType(double width) {
  if (width < 600) return ScreenType.compact;
  if (width < 1024) return ScreenType.medium;
  return ScreenType.expanded;
}

/// A responsive wrapper for authentication and centered forms (Login, Register, Forgot Password)
class ResponsiveAuthCard extends StatelessWidget {
  final Widget child;
  final double maxCardWidth;
  final EdgeInsetsGeometry? contentPadding;

  const ResponsiveAuthCard({
    super.key,
    required this.child,
    this.maxCardWidth = 480,
    this.contentPadding,
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final screenType = getScreenType(constraints.maxWidth);

        if (screenType == ScreenType.compact) {
          // Mobile: preserve exact mobile arrangement with scrollability
          return SingleChildScrollView(
            padding: contentPadding ??
                const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: child,
          );
        }

        // Tablet & Desktop: Centered card with professional border and subtle shadow
        final cardWidth =
            screenType == ScreenType.medium ? 520.0 : maxCardWidth;
        final vMargin = screenType == ScreenType.medium ? 32.0 : 48.0;

        return Center(
          child: SingleChildScrollView(
            padding: EdgeInsets.symmetric(horizontal: 24, vertical: vMargin),
            child: ConstrainedBox(
              constraints: BoxConstraints(maxWidth: cardWidth),
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 36, vertical: 36),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(28),
                  border:
                      Border.all(color: const Color(0xFFE5E7EB), width: 1.2),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x0C000000),
                      blurRadius: 28,
                      offset: Offset(0, 10),
                    ),
                    BoxShadow(
                      color: Color(0x04000000),
                      blurRadius: 6,
                      offset: Offset(0, 2),
                    ),
                  ],
                ),
                child: child,
              ),
            ),
          ),
        );
      },
    );
  }
}

/// A responsive wrapper for general screens (Profile, Tariflar, Add Payment, Dashboard)
class ResponsiveContentContainer extends StatelessWidget {
  final Widget child;
  final double maxWidth;
  final EdgeInsetsGeometry padding;

  const ResponsiveContentContainer({
    super.key,
    required this.child,
    this.maxWidth = 720,
    this.padding = const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: maxWidth),
        child: Padding(
          padding: padding,
          child: child,
        ),
      ),
    );
  }
}
