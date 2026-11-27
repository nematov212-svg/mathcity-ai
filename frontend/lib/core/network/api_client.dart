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
  final ValueNotifier<String?> serverStatusMessage =
      ValueNotifier<String?>(null);

  ApiClient._internal() {
    dio = Dio(
      BaseOptions(
        baseUrl: AppConfig.baseUrl,
        // Increased timeouts to accommodate Render free-tier cold starts (up to 65-70s)
        connectTimeout: const Duration(seconds: 65),
        receiveTimeout: const Duration(seconds: 65),
        sendTimeout: const Duration(seconds: 40),
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
            '/health',
          ];
          final isPublicAuth =
              publicAuthPaths.any((p) => options.path.contains(p));

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

          // Safe diagnostic logging for Auth endpoints (only log unexpected server 5xx errors)
          if (reqOptions.path.contains('/auth/') &&
              (statusCode == null || statusCode >= 500)) {
            final responseBody = error.response?.data;
            final reqData = reqOptions.data;
            Map<String, dynamic>? sanitizedFields;
            if (reqData is Map) {
              sanitizedFields = {};
              reqData.forEach((key, val) {
                if (val is String) {
                  sanitizedFields![key.toString()] =
                      '<string len=${val.length}>';
                } else {
                  sanitizedFields![key.toString()] =
                      val?.runtimeType.toString() ?? 'null';
                }
              });
            }
            debugPrint(
                '⚠️ [API Client] ${reqOptions.path} server xatoligi (HTTP $statusCode): $responseBody | Yuborilgan maydonlar: $sanitizedFields');
          }

          // If 401 Unauthorized occurs on token refresh, clear stored session
          if (statusCode == 401 && reqOptions.path.contains('/auth/refresh')) {
            _authToken = null;
            await StorageService.clearAuthToken();
            return handler.next(error);
          }

          // Automatic Token Refresh on 401 for authenticated API requests
          if (statusCode == 401 && !reqOptions.path.contains('/auth/')) {
            final isRefreshed = await _attemptTokenRefresh();
            if (isRefreshed && _authToken != null) {
              reqOptions.headers['Authorization'] = 'Bearer $_authToken';
              try {
                final retriedResponse = await dio.fetch(reqOptions);
                return handler.resolve(retriedResponse);
              } catch (_) {}
            }
          }

          // Cold Start Retry Logic:
          // Faqat timeout yoki haqiqiy Render gateway HTML/empty 5xx xatolarida qayta uriniladi.
          // Agar server structured JSON qaytargan bo'lsa (masalan: {"success":false,"error":...}) yoki bu to'lov bo'lsa,
          // server uyg'oq hisoblanadi va "Server uyg'onmoqda" deb kutmasdan darhol xato foydalanuvchiga uzatiladi!
          final is4xxClientError =
              statusCode != null && statusCode >= 400 && statusCode < 500;
          final is5xxServerError =
              statusCode != null && statusCode >= 500 && statusCode < 600;
          final isTimeout = error.type == DioExceptionType.connectionTimeout ||
              error.type == DioExceptionType.receiveTimeout ||
              error.type == DioExceptionType.sendTimeout;

          final hasStructuredJsonBody =
              error.response?.data is Map<String, dynamic>;
          final isPaymentEndpoint = reqOptions.path.contains('payment') ||
              reqOptions.path.contains('click') ||
              reqOptions.path.contains('payme');

          final isColdStartError = !is4xxClientError &&
              !hasStructuredJsonBody &&
              !isPaymentEndpoint &&
              (is5xxServerError || isTimeout);
          final retryCount = (reqOptions.extra['retryCount'] as int?) ?? 0;

          if (isColdStartError && retryCount < 3) {
            final nextRetry = retryCount + 1;
            reqOptions.extra['retryCount'] = nextRetry;

            isServerWakingUp.value = true;
            serverStatusMessage.value =
                'Server uyg‘onmoqda, iltimos kuting... ($nextRetry/3)';
            debugPrint(
                '⏳ [API Client] Server uyg‘onmoqda... Qayta urinish: $nextRetry/3');

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

  Completer<bool>? _refreshCompleter;

  Future<bool> _attemptTokenRefresh() async {
    if (_refreshCompleter != null) {
      return _refreshCompleter!.future;
    }
    _refreshCompleter = Completer<bool>();

    try {
      final refreshToken = await StorageService.getRefreshToken();
      final currentToken = _authToken ?? await StorageService.getAuthToken();

      // Guard: Do not attempt refresh if no tokens are stored
      if ((refreshToken == null || refreshToken.trim().isEmpty) &&
          (currentToken == null || currentToken.trim().isEmpty)) {
        _refreshCompleter!.complete(false);
        _refreshCompleter = null;
        return false;
      }

      final refreshDio = Dio(
        BaseOptions(
          baseUrl: AppConfig.baseUrl,
          connectTimeout: const Duration(seconds: 15),
          receiveTimeout: const Duration(seconds: 15),
          headers: {
            'Content-Type': 'application/json',
            if (currentToken != null && currentToken.isNotEmpty)
              'Authorization': 'Bearer $currentToken',
          },
        ),
      );

      final res = await refreshDio.post('/auth/refresh', data: {
        if (refreshToken != null && refreshToken.isNotEmpty)
          'refreshToken': refreshToken,
      });

      if (res.data['success'] == true && res.data['data'] != null) {
        final newToken = res.data['data']['token'] as String;
        final newRefresh = res.data['data']['refreshToken'] as String?;
        setAuthToken(newToken);
        await StorageService.saveAuthToken(newToken);
        if (newRefresh != null && newRefresh.isNotEmpty) {
          await StorageService.saveRefreshToken(newRefresh);
        }
        _refreshCompleter!.complete(true);
        _refreshCompleter = null;
        return true;
      }
    } catch (e) {
      _authToken = null;
      await StorageService.clearAuthToken();
      if (e is! DioException || e.response?.statusCode != 401) {
        debugPrint(
            'ℹ️ [API Client] Avtomatik token yangilash muvaffaqiyatsiz bo‘ldi: $e');
      }
    }

    _refreshCompleter!.complete(false);
    _refreshCompleter = null;
    return false;
  }

  static bool _hasWarmedUp = false;
  static Future<void>? _inFlightWarmUp;

  /// Sends a background warm-up request to the health endpoint when the app starts (deduplicated & cached)
  Future<void> warmUp() async {
    if (_hasWarmedUp) return;
    if (_inFlightWarmUp != null) {
      await _inFlightWarmUp;
      return;
    }
    _inFlightWarmUp = _performWarmUp();
    await _inFlightWarmUp;
  }

  Future<void> _performWarmUp() async {
    try {
      final warmupDio = Dio(
        BaseOptions(
          connectTimeout: const Duration(seconds: 10),
          receiveTimeout: const Duration(seconds: 10),
          validateStatus: (status) => true,
        ),
      );

      // If running on web localhost, probe local backend first
      if (kIsWeb &&
          (Uri.base.host == 'localhost' || Uri.base.host == '127.0.0.1')) {
        if (Uri.base.queryParameters['api'] != 'render') {
          try {
            final probeDio = Dio(
              BaseOptions(
                connectTimeout: const Duration(milliseconds: 700),
                receiveTimeout: const Duration(milliseconds: 700),
                validateStatus: (status) => true,
              ),
            );
            final localRes = await probeDio.get('http://localhost:4000/health');
            if (localRes.statusCode == 200) {
              AppConfig.setBaseUrl('http://localhost:4000/api');
              dio.options.baseUrl = 'http://localhost:4000/api';
              _hasWarmedUp = true;
              if (kDebugMode) {
                debugPrint(
                    '🚀 [API Client] Lokal server faol va tayyor: http://localhost:4000/api');
              }
              return;
            }
          } catch (_) {
            // Local server offline, fallback to Render production
            AppConfig.setBaseUrl(AppConfig.productionApiUrl);
            dio.options.baseUrl = AppConfig.baseUrl;
          }
        }
      }

      final rootUrl = AppConfig.baseUrl.replaceAll(RegExp(r'/api/?$'), '');
      await warmupDio.get('$rootUrl/health');
      _hasWarmedUp = true;
      if (kDebugMode) {
        debugPrint('☀️ [API Client] Server uyg‘oq va faol: $rootUrl/health');
      }
    } catch (e) {
      if (kDebugMode) {
        debugPrint('ℹ️ [API Client] Serverni isitish so‘rovi yakunlandi.');
      }
    } finally {
      _inFlightWarmUp = null;
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
          if (status == 401) {
            return 'Sessiya muddati tugadi. Iltimos, qaytadan kiring.';
          }
          if (status == 403) {
            return 'Ushbu amalni bajarishga ruxsat yo‘q.';
          }
          if (status == 404) {
            return 'So‘ralgan ma’lumot topilmadi.';
          }
          if (status == 502 || status == 503 || status == 504) {
            final reqPath = error.requestOptions.path;
            if (reqPath.contains('payment') ||
                reqPath.contains('click') ||
                reqPath.contains('payme')) {
              return 'To‘lov tizimi hozircha ishlamayapti, keyinroq urinib ko‘ring.';
            }
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
