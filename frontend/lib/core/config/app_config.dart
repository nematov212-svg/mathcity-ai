class AppConfig {
  static const String appName = 'MathCity AI';
  static const String appVersion = '1.0.0';

  /// Environment-specific API Base URL (passed via --dart-define=API_BASE_URL=...)
  /// In production on Render: https://mathcity-ai-api.onrender.com
  /// In development: http://localhost:4000
  static const String _envApiBase = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:4000',
  );

  static String? _overrideBaseUrl;

  /// Returns active API base URL guaranteed to point to /api endpoint
  static String get baseUrl {
    if (_overrideBaseUrl != null && _overrideBaseUrl!.isNotEmpty) {
      final clean = _overrideBaseUrl!.endsWith('/')
          ? _overrideBaseUrl!.substring(0, _overrideBaseUrl!.length - 1)
          : _overrideBaseUrl!;
      return clean.endsWith('/api') ? clean : '$clean/api';
    }

    final clean = _envApiBase.endsWith('/')
        ? _envApiBase.substring(0, _envApiBase.length - 1)
        : _envApiBase;
    return clean.endsWith('/api') ? clean : '$clean/api';
  }

  /// Allows setting or overriding API URL at runtime (e.g. staging or proxy)
  static void setBaseUrl(String url) {
    _overrideBaseUrl = url;
  }
}
