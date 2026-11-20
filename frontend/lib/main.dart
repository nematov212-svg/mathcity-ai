import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app/app.dart';
import 'core/auth/auth_service.dart';
import 'core/network/api_client.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

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
