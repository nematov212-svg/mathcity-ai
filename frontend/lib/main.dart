import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_web_plugins/url_strategy.dart';
import 'app/app.dart';
import 'core/auth/auth_service.dart';
import 'core/config/app_config.dart';
import 'core/network/api_client.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  usePathUrlStrategy();

  if (kDebugMode) {
    debugPrint('🚀 [MathCity AI] Active API Base URL: ${AppConfig.apiBaseUrl}');
  }

  // Central error handling to prevent uncaught promise or Dart runtime crashes
  FlutterError.onError = (FlutterErrorDetails details) {
    FlutterError.presentError(details);
    debugPrint('🚨 [FlutterError] ${details.exceptionAsString()}');
  };

  PlatformDispatcher.instance.onError = (error, stack) {
    debugPrint(
        '🚨 [PlatformDispatcher] Kutilmagan asinxron xato: $error\n$stack');
    return true; // Mark as handled to prevent uncaught app termination
  };

  // Single global initialization of Google Sign-In singleton (safely guarded)
  try {
    await AuthService.init();
  } catch (e, stack) {
    debugPrint(
        '⚠️ [AuthService.init] Google Sign-In initsializatsiya ogohlantirishi: $e\n$stack');
  }

  // Warm up backend in background (especially useful for Render free-tier instance cold start)
  unawaited(ApiClient().warmUp());

  runApp(
    const ProviderScope(
      child: MathCityApp(),
    ),
  );
}
