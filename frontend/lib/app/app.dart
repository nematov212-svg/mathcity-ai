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
    );
  }
}
