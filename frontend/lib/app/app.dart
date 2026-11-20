import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/constants/app_strings.dart';
import '../core/theme/app_theme.dart';
import 'router.dart';

class MathCityApp extends ConsumerWidget {
  const MathCityApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeProvider);

    return MaterialApp.router(
      title: AppStrings.appTitle,
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: themeMode,
      routerConfig: appRouter,
      builder: (context, child) {
        final mediaQuery = MediaQuery.of(context);
        final insets = mediaQuery.viewInsets;
        // Fix for Flutter Web bug: Assertion failed: _viewInsets.isNonNegative
        final safeInsets = EdgeInsets.fromLTRB(
          insets.left < 0 ? 0 : insets.left,
          insets.top < 0 ? 0 : insets.top,
          insets.right < 0 ? 0 : insets.right,
          insets.bottom < 0 ? 0 : insets.bottom,
        );
        return MediaQuery(
          data: mediaQuery.copyWith(viewInsets: safeInsets),
          child: child ?? const SizedBox.shrink(),
        );
      },
    );
  }
}
