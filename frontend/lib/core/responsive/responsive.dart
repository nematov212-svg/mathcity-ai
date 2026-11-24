import 'package:flutter/material.dart';

/// Screen classification based on standard device widths.
/// - [phone]: < 600px (strict zero-regression phone layout)
/// - [tablet]: 600px - 1023px
/// - [desktop]: >= 1024px
enum ScreenType {
  phone,
  tablet,
  desktop,
}

class ResponsiveBreakpoints {
  static const double phoneMax = 599.99;
  static const double tabletMin = 600.0;
  static const double tabletMax = 1023.99;
  static const double desktopMin = 1024.0;

  static const double maxContentWidth = 1200.0;
  static const double maxDialogWidth = 520.0;
  static const double maxCardWidth = 720.0;
}

ScreenType getScreenType(double width) {
  if (width < ResponsiveBreakpoints.tabletMin) {
    return ScreenType.phone;
  } else if (width < ResponsiveBreakpoints.desktopMin) {
    return ScreenType.tablet;
  } else {
    return ScreenType.desktop;
  }
}

extension ResponsiveContext on BuildContext {
  double get screenWidth => MediaQuery.of(this).size.width;
  double get screenHeight => MediaQuery.of(this).size.height;

  ScreenType get screenType => getScreenType(screenWidth);

  bool get isPhone => screenWidth < ResponsiveBreakpoints.tabletMin;
  bool get isTablet =>
      screenWidth >= ResponsiveBreakpoints.tabletMin &&
      screenWidth < ResponsiveBreakpoints.desktopMin;
  bool get isDesktop => screenWidth >= ResponsiveBreakpoints.desktopMin;
}

typedef ResponsiveWidgetBuilder = Widget Function(
  BuildContext context,
  ScreenType screenType,
  BoxConstraints constraints,
);

/// A widget that provides the current [ScreenType] and [BoxConstraints]
/// based on layout constraints rather than media query, making it resilient
/// during animations and split-screen mode.
class ResponsiveBuilder extends StatelessWidget {
  final ResponsiveWidgetBuilder builder;

  const ResponsiveBuilder({super.key, required this.builder});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final screenType = getScreenType(constraints.maxWidth);
        return builder(context, screenType, constraints);
      },
    );
  }
}
