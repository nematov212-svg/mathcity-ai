import 'package:flutter/material.dart';
import 'breakpoints.dart';

enum ScreenSize {
  compact,
  medium,
  expanded,
}

extension ScreenSizeContext on BuildContext {
  ScreenSize get screenSize {
    final media = MediaQuery.maybeOf(this);
    if (media == null) return ScreenSize.compact;
    final size = media.size;

    // 0.5 qoidasi:
    // - Kenglik < 600 -> compact (hozirgi telefon dizayni).
    // - Telefon landscape (kenglik 600+ lekin eng qisqa tomon < 500) ham compact hisoblansin.
    if (size.width < Breakpoints.compact || size.shortestSide < 500) {
      return ScreenSize.compact;
    }
    if (size.width < Breakpoints.medium) {
      return ScreenSize.medium;
    }
    return ScreenSize.expanded;
  }

  bool get isCompact => screenSize == ScreenSize.compact;
  bool get isMedium => screenSize == ScreenSize.medium;
  bool get isExpanded => screenSize == ScreenSize.expanded;
}
