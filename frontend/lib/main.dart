import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app/app.dart';
import 'core/auth/auth_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Single global initialization of Google Sign-In singleton
  await AuthService.init();

  runApp(
    const ProviderScope(
      child: MathCityApp(),
    ),
  );
}
