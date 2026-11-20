import 'package:flutter/foundation.dart';

class AppConfig {
  static const String appName = 'MathCity AI';
  static const String appVersion = '1.0.0';

  /// Primary Production API Base URL on Render (Authoritative Default)
  static const String productionApiUrl = 'https://mathcity-ai-api.onrender.com';

  /// Single Local Development API Base URL for Web/Desktop/iOS (Optional)
  static const String localApiUrl = 'http://localhost:4000';

  /// Single Local Development API Base URL for Android Emulator (Optional)
  static const String androidEmulatorApiUrl = 'http://10.0.2.2:4000';

  /// Environment-specific API Base URL (passed via --dart-define=API_BASE_URL=...)
  static const String _envApiBase = String.fromEnvironment('API_BASE_URL');

  /// Optional flag to use local backend instead of Render (passed via --dart-define=USE_LOCAL_BACKEND=true)
  static const bool _useLocalBackend = bool.fromEnvironment('USE_LOCAL_BACKEND', defaultValue: false);

  static String? _overrideBaseUrl;

  /// Returns active API base URL - defaults to Render production across all platforms and modes
  static String get baseUrl {
    if (_overrideBaseUrl != null && _overrideBaseUrl!.isNotEmpty) {
      return _formatApiUrl(_overrideBaseUrl!);
    }

    // 1. Explicit API_BASE_URL via --dart-define takes highest priority
    if (_envApiBase.isNotEmpty) {
      return _formatApiUrl(_envApiBase);
    }

    // 2. Optional local backend ONLY if explicitly requested via --dart-define=USE_LOCAL_BACKEND=true
    if (_useLocalBackend) {
      if (!kIsWeb && defaultTargetPlatform == TargetPlatform.android) {
        return _formatApiUrl(androidEmulatorApiUrl);
      }
      return _formatApiUrl(localApiUrl);
    }

    // 3. DEFAULT ACROSS ALL MODES (Debug, Release, Profile, Web, Android, iOS): Render Production
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
