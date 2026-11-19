import 'package:dio/dio.dart';
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
        connectTimeout: const Duration(seconds: 60),
        receiveTimeout: const Duration(seconds: 60),
        sendTimeout: const Duration(seconds: 60),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // Do not send Authorization header for public authentication routes
          final publicAuthPaths = [
            '/auth/login',
            '/auth/register',
            '/auth/google',
            '/auth/forgot-password',
            '/auth/reset-password',
            '/auth/demo',
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
          final path = error.requestOptions.path;
          // Retry once on Render cold-start timeout (connection timeout or 503/502)
          if ((error.type == DioExceptionType.connectionTimeout ||
               error.type == DioExceptionType.receiveTimeout ||
               error.response?.statusCode == 502 ||
               error.response?.statusCode == 503) &&
              error.requestOptions.extra['retried'] != true) {
            try {
              error.requestOptions.extra['retried'] = true;
              await Future.delayed(const Duration(seconds: 2));
              final retryResponse = await dio.fetch(error.requestOptions);
              return handler.resolve(retryResponse);
            } catch (_) {
              // fallback to normal error handler
            }
          }

          // Only clear stored token when the refresh endpoint itself is rejected with 401
          if (error.response?.statusCode == 401 && path.contains('/auth/refresh')) {
            _authToken = null;
            await StorageService.saveAuthToken('');
          }
          return handler.next(error);
        },
      ),
    );
  }

  void setAuthToken(String? token) {
    _authToken = token;
  }

  String? get authToken => _authToken;
}
