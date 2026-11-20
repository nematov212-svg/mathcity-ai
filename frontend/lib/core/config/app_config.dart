import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

class AppConfig {
  static const String appName = 'MathCity AI';
  static const String appVersion = '1.0.0';

  /// Primary Production API Base URL on Render
  static const String productionApiUrl = 'https://mathcity-ai-api.onrender.com';

  /// Single Local Development API Base URL for Web/Desktop/iOS
  static const String localApiUrl = 'http://localhost:4000';

  /// Single Local Development API Base URL for Android Emulator
  static const String androidEmulatorApiUrl = 'http://10.0.2.2:4000';

  /// Environment-specific API Base URL (passed via --dart-define=API_BASE_URL=...)
  static const String _envApiBase = String.fromEnvironment('API_BASE_URL');

  static String? _overrideBaseUrl;
  static bool _initialized = false;

  /// Fast startup initialization: probes local dev server; falls back to Render if inactive
  static Future<void> init() async {
    if (_initialized) return;
    _initialized = true;

    // 1. Explicit dart-define override takes top priority
    if (_envApiBase.isNotEmpty) {
      _overrideBaseUrl = _envApiBase;
      return;
    }

    // 2. In Debug mode: probe local dev port (4000)
    if (kDebugMode) {
      final target = (!kIsWeb && defaultTargetPlatform == TargetPlatform.android)
          ? androidEmulatorApiUrl
          : localApiUrl;

      try {
        final probeDio = Dio(
          BaseOptions(
            connectTimeout: const Duration(milliseconds: 600),
            receiveTimeout: const Duration(milliseconds: 600),
          ),
        );
        final res = await probeDio.get('$target/health');
        if (res.statusCode == 200) {
          _overrideBaseUrl = target;
          debugPrint('🚀 [AppConfig] Mahalliy backend faol: $target');
          return;
        }
      } catch (_) {
        // Port 4000 not listening
      }
      debugPrint('ℹ️ [AppConfig] Mahalliy server topilmadi, Render serveri tanlandi: $productionApiUrl');
      _overrideBaseUrl = productionApiUrl;
    } else {
      _overrideBaseUrl = productionApiUrl;
    }
  }

  /// Returns active API base URL guaranteed to point to /api endpoint
  static String get baseUrl {
    if (_overrideBaseUrl != null && _overrideBaseUrl!.isNotEmpty) {
      return _formatApiUrl(_overrideBaseUrl!);
    }

    // 1. Explicit dart-define override takes highest priority
    if (_envApiBase.isNotEmpty) {
      return _formatApiUrl(_envApiBase);
    }

    // 2. In Debug mode: automatically point to single local backend port (4000)
    if (kDebugMode) {
      if (!kIsWeb && defaultTargetPlatform == TargetPlatform.android) {
        return _formatApiUrl(androidEmulatorApiUrl);
      }
      return _formatApiUrl(localApiUrl);
    }

    // 3. In Release mode: point to production Render backend
    return _formatApiUrl(productionApiUrl);
  }

  /// Helper to ensure URL does not end with trailing slash and ends with /api
  static String _formatApiUrl(String rawUrl) {
    final clean = rawUrl.endsWith('/')
        ? rawUrl.substring(0, rawUrl.length - 1)
        : rawUrl;
    return clean.endsWith('/api') ? clean : '$clean/api';
  }

  /// Allows setting or overriding API URL at runtime (e.g. testing or proxy)
  static void setBaseUrl(String url) {
    _overrideBaseUrl = url;
  }
}
