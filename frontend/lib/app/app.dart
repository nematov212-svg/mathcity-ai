import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/constants/app_strings.dart';
import '../core/theme/kids_theme.dart';
import '../core/theme/teen_theme.dart';
import '../shared/providers/student_provider.dart';
import 'router.dart';

class MathCityApp extends ConsumerWidget {
  const MathCityApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final studentState = ref.watch(studentProvider);
    final mode = studentState.student?.mode ?? 'KIDS';

    return MaterialApp.router(
      title: AppStrings.appTitle,
      debugShowCheckedModeBanner: false,
      theme: KidsTheme.theme,
      darkTheme: TeenTheme.theme,
      themeMode: mode == 'TEEN' ? ThemeMode.dark : ThemeMode.light,
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
