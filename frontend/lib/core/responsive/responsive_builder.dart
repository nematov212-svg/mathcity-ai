import 'package:flutter/material.dart';
import 'screen_size.dart';

/// Widget that builds different UI layouts based on [ScreenSize].
/// Fallbacks:
/// - medium not provided -> uses expanded, or compact.
/// - expanded not provided -> uses medium, or compact.
class ResponsiveBuilder extends StatelessWidget {
  final Widget Function(BuildContext context) compact;
  final Widget Function(BuildContext context)? medium;
  final Widget Function(BuildContext context)? expanded;

  const ResponsiveBuilder({
    super.key,
    required this.compact,
    this.medium,
    this.expanded,
  });

  @override
  Widget build(BuildContext context) {
    final size = context.screenSize;
    switch (size) {
      case ScreenSize.compact:
        return compact(context);
      case ScreenSize.medium:
        if (medium != null) return medium!(context);
        if (expanded != null) return expanded!(context);
        return compact(context);
      case ScreenSize.expanded:
        if (expanded != null) return expanded!(context);
        if (medium != null) return medium!(context);
        return compact(context);
    }
  }
}
