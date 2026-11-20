import 'dart:async';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../config/app_config.dart';
import '../storage/storage_service.dart';

class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;

  late final Dio dio;
  String? _authToken;

  /// Global notifier when server is sleeping/waking up on Render free tier
  final ValueNotifier<bool> isServerWakingUp = ValueNotifier<bool>(false);
  final ValueNotifier<String?> serverStatusMessage = ValueNotifier<String?>(null);

  ApiClient._internal() {
    dio = Dio(
      BaseOptions(
        baseUrl: AppConfig.baseUrl,
        // Increased timeouts to accommodate Render free-tier cold starts (up to 45-60s)
        connectTimeout: const Duration(seconds: 45),
        receiveTimeout: const Duration(seconds: 60),
        sendTimeout: const Duration(seconds: 30),
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
          final statusCode = error.response?.statusCode;
          final reqOptions = error.requestOptions;

          // Safe diagnostic logging for Auth endpoints (no sensitive token values logged)
          if (reqOptions.path.contains('/auth/')) {
            final responseBody = error.response?.data;
            final reqData = reqOptions.data;
            Map<String, dynamic>? sanitizedFields;
            if (reqData is Map) {
              sanitizedFields = {};
              reqData.forEach((key, val) {
                if (val is String) {
                  sanitizedFields![key.toString()] = '<string len=${val.length}>';
                } else {
                  sanitizedFields![key.toString()] = val?.runtimeType.toString() ?? 'null';
                }
              });
            }
            debugPrint('⚠️ [API Client] ${reqOptions.path} xatoligi (HTTP $statusCode): $responseBody | Yuborilgan maydonlar: $sanitizedFields');
          }

          // If 401 Unauthorized occurs on token refresh, clear stored session
          if (statusCode == 401 && reqOptions.path.contains('/auth/refresh')) {
            _authToken = null;
            await StorageService.clearAuthToken();
            return handler.next(error);
          }

          // 1. Localhost Fallback: In Debug Web mode, switch IMMEDIATELY if Render is unreachable/suspended
          if (AppConfig.isLocalhostFallbackAllowed &&
              reqOptions.baseUrl.contains('onrender.com') &&
              (error.type == DioExceptionType.connectionError ||
               error.type == DioExceptionType.connectionTimeout ||
               error.type == DioExceptionType.unknown ||
               statusCode == 503)) {
            try {
              const localFallbackUrl = 'http://localhost:4000/api';
              final pingDio = Dio(BaseOptions(connectTimeout: const Duration(milliseconds: 1000)));
              final pingRes = await pingDio.get('http://localhost:4000/health');
              if (pingRes.statusCode == 200) {
                debugPrint('ℹ️ [Web Debug] Render servisi o‘rniga mahalliy backendga ($localFallbackUrl) ulandi.');
                AppConfig.setBaseUrl(localFallbackUrl);

                reqOptions.baseUrl = localFallbackUrl;
                final retryRes = await dio.fetch(reqOptions);
                return handler.resolve(retryRes);
              }
            } catch (_) {
              // Local backend not reachable either; continue with normal cold-start retry
            }
          }

          // 2. Cold Start Retry Logic (up to 3 retries with exponential backoff on 502/503/504 or connection timeouts)
          final retryCount = (reqOptions.extra['retryCount'] as int?) ?? 0;
          final isColdStartError = error.type == DioExceptionType.connectionTimeout ||
              error.type == DioExceptionType.receiveTimeout ||
              error.type == DioExceptionType.connectionError ||
              statusCode == 503 ||
              statusCode == 502 ||
              statusCode == 504;

          if (isColdStartError && retryCount < 3) {
            final nextRetry = retryCount + 1;
            reqOptions.extra['retryCount'] = nextRetry;

            isServerWakingUp.value = true;
            serverStatusMessage.value = 'Server uyg‘onmoqda, biroz kuting... ($nextRetry/3)';
            debugPrint('⏳ [API Client] Server uyg‘onmoqda... Qayta urinish: $nextRetry/3');

            // Exponential backoff: 2s, 4s, 8s
            final delaySeconds = 2 * (1 << (retryCount));
            await Future.delayed(Duration(seconds: delaySeconds));

            try {
              final response = await dio.fetch(reqOptions);
              isServerWakingUp.value = false;
              serverStatusMessage.value = null;
              return handler.resolve(response);
            } catch (retryErr) {
              if (retryErr is DioException) {
                return handler.next(retryErr);
              }
            }
          } else {
            isServerWakingUp.value = false;
            serverStatusMessage.value = null;
          }

          return handler.next(error);
        },
      ),
    );
  }

  /// Sends a background warm-up request to the health endpoint when the app starts
  Future<void> warmUp() async {
    // In Web debug mode, probe local backend first to prevent CORS noise from suspended Render
    if (AppConfig.isLocalhostFallbackAllowed) {
      try {
        final localDio = Dio(BaseOptions(connectTimeout: const Duration(milliseconds: 1000)));
        final localRes = await localDio.get('http://localhost:4000/health');
        if (localRes.statusCode == 200) {
          AppConfig.setBaseUrl('http://localhost:4000/api');
          debugPrint('☀️ [API Client] Mahalliy backend faol va ulandi: http://localhost:4000/api');
          return;
        }
      } catch (_) {}
    }

    try {
      final warmupDio = Dio(
        BaseOptions(
          baseUrl: AppConfig.baseUrl,
          connectTimeout: const Duration(seconds: 15),
          receiveTimeout: const Duration(seconds: 15),
        ),
      );
      // Remove '/api' from end if checking root /health, or check /health directly
      final rootUrl = AppConfig.baseUrl.replaceAll(RegExp(r'/api/?$'), '');
      await warmupDio.get('$rootUrl/health');
      debugPrint('☀️ [API Client] Server uyg‘oq va faol: $rootUrl/health');
    } catch (e) {
      debugPrint('ℹ️ [API Client] Serverni isitish so‘rovi yakunlandi.');
    }
  }

  /// User-friendly error message in Uzbek for UI snackbars and dialogues
  static String getErrorMessage(dynamic error) {
    if (error is DioException) {
      switch (error.type) {
        case DioExceptionType.connectionTimeout:
        case DioExceptionType.receiveTimeout:
        case DioExceptionType.sendTimeout:
          return 'Server javob berishga ulgurmadi yoki uyg‘onmoqda. Iltimos, yana bir bor urinib ko‘ring.';
        case DioExceptionType.connectionError:
          return 'Internet aloqasi yo‘q yoki serverga ulanib bo‘lmadi. Tarmoqni tekshiring.';
        case DioExceptionType.badResponse:
          final status = error.response?.statusCode;
          final data = error.response?.data;
          if (data is Map && data['error'] is String) {
            return data['error'] as String;
          }
          if (status == 401) return 'Sessiya muddati tugadi. Iltimos, qaytadan kiring.';
          if (status == 403) return 'Ushbu amalni bajarishga ruxsat yo‘q.';
          if (status == 404) return 'So‘ralgan ma’lumot topilmadi.';
          if (status == 502 || status == 503 || status == 504) {
            return 'Server vaqtincha band yoki uyg‘onmoqda. Birozdan so‘ng qayta urinib ko‘ring.';
          }
          return 'Server xatoligi yuz berdi (HTTP $status).';
        default:
          return 'Tarmoqqa ulanishda kutilmagan xatolik yuz berdi.';
      }
    }
    return error?.toString() ?? 'Noma’lum xatolik yuz berdi.';
  }

  void setAuthToken(String token) {
    _authToken = token;
  }

  void clearAuthToken() {
    _authToken = null;
  }

  String? get authToken => _authToken;
}
