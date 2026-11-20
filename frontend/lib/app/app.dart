import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/constants/app_strings.dart';
import '../core/network/api_client.dart';
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
          child: Stack(
            children: [
              child ?? const SizedBox.shrink(),
              ValueListenableBuilder<bool>(
                valueListenable: ApiClient().isServerWakingUp,
                builder: (context, wakingUp, _) {
                  if (!wakingUp) return const SizedBox.shrink();
                  return Positioned(
                    top: mediaQuery.padding.top + 8,
                    left: 20,
                    right: 20,
                    child: Material(
                      elevation: 8,
                      borderRadius: BorderRadius.circular(20),
                      color: const Color(0xFF6C47FF),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const SizedBox(
                              width: 18,
                              height: 18,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Color(0xFFFFD66B),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: ValueListenableBuilder<String?>(
                                valueListenable: ApiClient().serverStatusMessage,
                                builder: (context, msg, _) => Text(
                                  msg ?? 'Server uyg‘onmoqda, biroz kuting...',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 13,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }
}
