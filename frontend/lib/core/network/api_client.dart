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
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // If token not in memory, restore from storage
          if (_authToken == null || _authToken!.isEmpty) {
            _authToken = await StorageService.getAuthToken();
          }

          if (_authToken != null && _authToken!.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $_authToken';
          }
          return handler.next(options);
        },
        onError: (DioException error, handler) async {
          final path = error.requestOptions.path;
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
