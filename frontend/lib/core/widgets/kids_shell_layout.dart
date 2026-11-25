import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../theme/app_theme.dart';
import 'mathcity_bottom_nav.dart';

/// Scope to signal whether child screens are hosted inside the persistent Shell.
/// When true, child screens omit their individual bottom bars to prevent duplicates.
class KidsNavShellScope extends InheritedWidget {
  final bool hasShell;

  const KidsNavShellScope({
    super.key,
    required this.hasShell,
    required super.child,
  });

  static bool of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<KidsNavShellScope>()?.hasShell ?? false;
  }

  @override
  bool updateShouldNotify(KidsNavShellScope oldWidget) => hasShell != oldWidget.hasShell;
}

/// Persistent Layout Shell for MathCity AI primary navigation tabs:
/// - Index 0: Asosiy (/kids/home)
/// - Index 1: Darslar (/kids/lessons)
/// - Index 2: AI Ustoz (/kids/ai-tutor)
/// - Index 3: Reyting (/kids/leaderboard)
/// - Index 4: Profil (/kids/profile)
///
/// Kept mounted continuously so the glassmorphic bottom navigation bar never
/// remounts, resizes, jumps, or flickers during tab changes.
class KidsShellLayout extends StatelessWidget {
  final Widget child;

  const KidsShellLayout({
    super.key,
    required this.child,
  });

  int _calculateIndex(String location) {
    if (location.startsWith('/kids/lessons')) {
      return 1;
    } else if (location.startsWith('/kids/ai-tutor')) {
      return 2;
    } else if (location.startsWith('/kids/leaderboard')) {
      return 3;
    } else if (location.startsWith('/kids/profile')) {
      return 4;
    }
    return 0; // /kids/home or default
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);
    final location = GoRouterState.of(context).uri.path;
    final currentIndex = _calculateIndex(location);
    final isKeyboardOpen = MediaQuery.of(context).viewInsets.bottom > 0;

    return Scaffold(
      backgroundColor: colors.bg,
      extendBody: true,
      body: KidsNavShellScope(
        hasShell: true,
        child: child,
      ),
      bottomNavigationBar: isKeyboardOpen
          ? null
          : MathCityBottomNav(currentIndex: currentIndex),
    );
  }
}
