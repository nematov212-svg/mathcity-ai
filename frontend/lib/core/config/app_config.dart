import 'package:flutter/foundation.dart';

class AppConfig {
  static const String appName = 'MathCity AI';
  static const String appVersion = '1.0.1';

  /// Primary Production API Base URL on Render (Authoritative Default)
  static const String productionApiUrl = 'https://mathcity-ai-api.onrender.com';
  static const String localApiUrl = 'http://localhost:4000';
  static String get apiBaseUrl => baseUrl;

  /// Web OAuth Client ID from Google Cloud Console (Public ID, not a secret)
  static const String googleWebClientId = String.fromEnvironment(
    'GOOGLE_CLIENT_ID',
    defaultValue: String.fromEnvironment(
      'GOOGLE_WEB_CLIENT_ID',
      defaultValue:
          '608766203356-d6oq3gvc5n199671ho1npgr240afkjup.apps.googleusercontent.com',
    ),
  );

  /// iOS OAuth Client ID from Google Cloud Console
  static const String googleIosClientId = String.fromEnvironment(
    'GOOGLE_IOS_CLIENT_ID',
    defaultValue:
        '608766203356-d6oq3gvc5n199671ho1npgr240afkjup.apps.googleusercontent.com',
  );

  /// Android Application Package Name
  static const String androidPackageName = 'com.mathcityai.mathcity_ai';

  /// Optional Environment-specific API URL (passed via --dart-define=API_BASE_URL=... or API_URL=...)
  static const String _envApiBase = String.fromEnvironment('API_BASE_URL');
  static const String _envApiUrl = String.fromEnvironment('API_URL');

  static String? _overrideBaseUrl;

  /// Returns active API base URL:
  /// - If --dart-define=API_BASE_URL=... or API_URL=... is provided, uses it.
  /// - Otherwise defaults to production Render URL: https://mathcity-ai-api.onrender.com
  static String get baseUrl {
    // 1. Explicit API_BASE_URL or API_URL via --dart-define takes highest priority
    if (_envApiBase.isNotEmpty) {
      return _formatApiUrl(_envApiBase);
    }
    if (_envApiUrl.isNotEmpty) {
      return _formatApiUrl(_envApiUrl);
    }

    if (_overrideBaseUrl != null && _overrideBaseUrl!.isNotEmpty) {
      return _formatApiUrl(_overrideBaseUrl!);
    }

    // 2. Localhost web dev: when tested in Chrome on localhost / 127.0.0.1
    if (kIsWeb) {
      final host = Uri.base.host;
      if (host == 'localhost' || host == '127.0.0.1') {
        if (Uri.base.queryParameters['api'] == 'render') {
          return _formatApiUrl(productionApiUrl);
        }
        return _formatApiUrl(localApiUrl);
      }
    }

    // 3. Default: Strictly Render Production Cloud API (24/7 active)
    return _formatApiUrl(productionApiUrl);
  }

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
