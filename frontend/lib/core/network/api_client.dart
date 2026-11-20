import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../config/app_config.dart';
import '../storage/storage_service.dart';

class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;

  late final Dio dio;
  String? _authToken;

  ApiClient._internal() {
    dio = Dio(
      BaseOptions(
        baseUrl: AppConfig.baseUrl,
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 20),
        sendTimeout: const Duration(seconds: 10),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );
    
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // Dynamically ensure options.baseUrl matches AppConfig.baseUrl
          options.baseUrl = AppConfig.baseUrl;

          // Do not send Authorization header for public authentication routes
          final publicAuthPaths = [
            '/auth/login',
            '/auth/register',
            '/auth/google',
            '/auth/forgot-password',
            '/auth/reset-password',
            '/auth/demo',
            '/health',
          ];
          final isPublicAuth = publicAuthPaths.any((p) => options.path.contains(p));

          if (!isPublicAuth) {
            // If token not in memory, restore from storage
            if (_authToken == null || _authToken!.isEmpty) {
              _authToken = await StorageService.getAuthToken();
            }

            if (_authToken != null && _authToken!.isNotEmpty) {
              options.headers['Authorization'] = 'Bearer $_authToken';
            }
          }
          return handler.next(options);
        },
        onError: (DioException error, handler) async {
          // If 401 Unauthorized occurs on token refresh, clear stored session
          if (error.response?.statusCode == 401 && error.requestOptions.path.contains('/auth/refresh')) {
            _authToken = null;
            await StorageService.clearAuthToken();
            return handler.next(error);
          }

          // Intelligent Development Failover:
          // If running locally in debug mode and Render backend is suspended (503, connection error, or CORS blocked),
          // check if local backend (http://localhost:4000/api) is active and retry seamlessly.
          if (kDebugMode &&
              error.requestOptions.baseUrl.contains('onrender.com') &&
              (error.type == DioExceptionType.connectionError ||
               error.type == DioExceptionType.unknown ||
               error.response?.statusCode == 503)) {
            try {
              final localFallbackUrl = 'http://localhost:4000/api';
              final pingDio = Dio(BaseOptions(connectTimeout: const Duration(seconds: 2)));
              final pingRes = await pingDio.get('http://localhost:4000/health');
              if (pingRes.statusCode == 200) {
                debugPrint('ℹ️ Render servisi to‘xtatilgan (503/CORS). Mahalliy backendga ($localFallbackUrl) ulandi.');
                AppConfig.setBaseUrl(localFallbackUrl);

                final reqOptions = error.requestOptions;
                reqOptions.baseUrl = localFallbackUrl;

                final retryRes = await dio.fetch(reqOptions);
                return handler.resolve(retryRes);
              }
            } catch (_) {
              // Local backend not reachable either; continue with normal error handler
            }
          }

          return handler.next(error);
        },
      ),
    );
  }

  void setAuthToken(String token) {
    _authToken = token;
  }

  void clearAuthToken() {
    _authToken = null;
  }

  String? get authToken => _authToken;
}
