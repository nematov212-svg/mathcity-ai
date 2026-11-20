import 'package:flutter/foundation.dart';

class AppConfig {
  static const String appName = 'MathCity AI';
  static const String appVersion = '1.0.1';

  /// Primary Production API Base URL on Render (Authoritative Default)
  static const String productionApiUrl = 'https://mathcity-ai-api.onrender.com';

  /// Single Local Development API Base URL for Web (Debug-only)
  static const String localApiUrl = 'http://localhost:4000';

  /// Optional Environment-specific API URL (passed via --dart-define=API_URL=... or API_BASE_URL=...)
  static const String _envApiUrl = String.fromEnvironment('API_URL');
  static const String _envApiBase = String.fromEnvironment('API_BASE_URL');

  /// Optional flag to use local backend in debug web (passed via --dart-define=USE_LOCAL_BACKEND=true)
  static const bool _useLocalBackend = bool.fromEnvironment('USE_LOCAL_BACKEND', defaultValue: false);

  static String? _overrideBaseUrl;

  /// Returns active API base URL:
  /// - In Release mode or on Mobile (Android / iOS): Strictly Render Production (or explicit --dart-define=API_URL=...)
  /// - Localhost fallback: ONLY allowed in Debug mode on Web when explicitly requested or during local dev
  static String get baseUrl {
    if (_overrideBaseUrl != null && _overrideBaseUrl!.isNotEmpty) {
      return _formatApiUrl(_overrideBaseUrl!);
    }

    // 1. Explicit API_URL or API_BASE_URL via --dart-define takes highest priority
    if (_envApiUrl.isNotEmpty) {
      return _formatApiUrl(_envApiUrl);
    }
    if (_envApiBase.isNotEmpty) {
      return _formatApiUrl(_envApiBase);
    }

    // 2. Local fallback ONLY allowed in Debug mode on Web (never in release or on mobile)
    if (kDebugMode && kIsWeb && _useLocalBackend) {
      return _formatApiUrl(localApiUrl);
    }

    // 3. DEFAULT FOR ALL PLATFORMS (Web, Android, iOS) & ALL MODES (Release, Debug):
    return _formatApiUrl(productionApiUrl);
  }

  /// Whether localhost fallback is permitted (strictly debug + web only)
  static bool get isLocalhostFallbackAllowed => kDebugMode && kIsWeb;

  /// Helper to ensure URL does not end with trailing slash and ends with /api
  static String _formatApiUrl(String rawUrl) {
    final clean = rawUrl.endsWith('/')
        ? rawUrl.substring(0, rawUrl.length - 1)
        : rawUrl;
    return clean.endsWith('/api') ? clean : '$clean/api';
  }

  /// Allows setting or overriding API URL at runtime
  static void setBaseUrl(String url) {
    _overrideBaseUrl = url;
  }
}
