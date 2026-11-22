import 'dart:async';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app/app.dart';
import 'core/auth/auth_service.dart';
import 'core/network/api_client.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Central error handling to prevent uncaught promise or Dart runtime crashes
  FlutterError.onError = (FlutterErrorDetails details) {
    FlutterError.presentError(details);
    debugPrint('🚨 [FlutterError] ${details.exceptionAsString()}');
  };

  PlatformDispatcher.instance.onError = (error, stack) {
    debugPrint('🚨 [PlatformDispatcher] Kutilmagan asinxron xato: $error\n$stack');
    return true; // Mark as handled to prevent uncaught app termination
  };

  // Single global initialization of Google Sign-In singleton
  await AuthService.init();

  // Warm up backend in background (especially useful for Render free-tier instance cold start)
  unawaited(ApiClient().warmUp());

  runApp(
    const ProviderScope(
      child: MathCityApp(),
    ),
  );
}
