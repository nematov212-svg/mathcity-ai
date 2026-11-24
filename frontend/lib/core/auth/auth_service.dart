import 'dart:convert';
import 'dart:math' as math;
import 'package:crypto/crypto.dart';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:sign_in_with_apple/sign_in_with_apple.dart';
import '../network/api_client.dart';
import '../storage/storage_service.dart';
import '../config/app_config.dart';
import '../../shared/models/student_model.dart';

class AuthResult {
  final bool success;
  final StudentModel? student;
  final String? token;
  final String? errorMessage;
  final bool isAgeDenied;
  final bool isNewUser;
  final bool profileCompleted;
  final bool requiresParentalConsent;

  const AuthResult({
    
    required this.success,
    this.student,
    this.token,
    this.errorMessage,
    this.isAgeDenied = false,
    this.isNewUser = false,
    this.profileCompleted = true,
    this.requiresParentalConsent = false,
  });
}

class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  static GoogleSignIn? _sharedGoogleSignIn;
  static bool _isGoogleSignInInitialized = false;
  static bool _googleSignInInitFailed = false;

  /// Check whether the current platform origin is allowed for Google Identity Services
  static bool isOriginAllowedForGoogle() {
    return true;
  }

  /// Global singleton initialization for GoogleSignIn
  static Future<void> init() async {
    if (_isGoogleSignInInitialized && _sharedGoogleSignIn != null) return;
    try {
      final String? effectiveClientId;
      if (kIsWeb) {
        effectiveClientId = webClientId.isNotEmpty ? webClientId : null;
      } else if (defaultTargetPlatform == TargetPlatform.iOS ||
          defaultTargetPlatform == TargetPlatform.macOS) {
        effectiveClientId = iosClientId.isNotEmpty ? iosClientId : null;
      } else {
        // Android: MUST be null! Google Play Services uses package name + signing SHA-1 automatically.
        effectiveClientId = null;
      }

      _sharedGoogleSignIn = GoogleSignIn(
        clientId: effectiveClientId,
        serverClientId: kIsWeb ? null : (webClientId.isNotEmpty ? webClientId : null),
        scopes: kIsWeb ? const [] : const ['email', 'profile'],
      );
      _isGoogleSignInInitialized = true;
      _googleSignInInitFailed = false;
    } catch (e, stack) {
      debugPrint('⚠️ GoogleSignIn initsializatsiya xatosi: $e\n$stack');
      _googleSignInInitFailed = true;
    }
  }

  /// Web OAuth Client ID from Google Cloud Console / AppConfig
  static String webClientId = AppConfig.googleWebClientId;

  /// iOS OAuth Client ID from Google Cloud Console
  static String iosClientId = AppConfig.googleIosClientId;

  /// Allows setting web client id at runtime if needed
  static void setWebClientId(String clientId) {
    webClientId = clientId;
    _sharedGoogleSignIn = null;
    _isGoogleSignInInitialized = false;
    _googleSignInInitFailed = false;
  }

  /// Allows setting iOS client id at runtime if needed
  static void setIosClientId(String clientId) {
    iosClientId = clientId;
    _sharedGoogleSignIn = null;
    _isGoogleSignInInitialized = false;
    _googleSignInInitFailed = false;
  }
  
  

  /// Controlled lazy initialization for GoogleSignIn
  GoogleSignIn? _getGoogleSignIn() {
    if (_googleSignInInitFailed) return null;
    if (!_isGoogleSignInInitialized || _sharedGoogleSignIn == null) {
      init();
    }
    return _sharedGoogleSignIn;
  }

  /// Stream of Google user accounts (fired by GIS button or silent login)
  Stream<GoogleSignInAccount?> get onGoogleAccountChanged {
    final gsi = _getGoogleSignIn();
    if (gsi == null) return const Stream.empty();
    return gsi.onCurrentUserChanged;
  }

  Future<AuthResult>? _ongoingGoogleAuth;
  bool _isAuthenticating = false;

  /// Check whether an authentication request is currently in-flight
  bool get isAuthenticating => _isAuthenticating;

  /// Authenticate Google User with Backend (Single-flight in-flight guard)
  Future<AuthResult> authenticateGoogleUser(GoogleSignInAccount googleUser) async {
    if (_ongoingGoogleAuth != null) {
      return _ongoingGoogleAuth!;
    }
    _ongoingGoogleAuth = _doAuthenticateGoogleUser(googleUser).whenComplete(() {
      _ongoingGoogleAuth = null;
    });
    return _ongoingGoogleAuth!;
  }

  Future<AuthResult> _doAuthenticateGoogleUser(GoogleSignInAccount googleUser) async {
    _isAuthenticating = true;
    try {
      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;

      final Map<String, dynamic> requestBody = {
        'email': googleUser.email,
        'displayName': googleUser.displayName ?? 'O‘quvchi',
        'platform': kIsWeb ? 'web' : 'mobile',
      };

      if (googleUser.id.isNotEmpty) {
        requestBody['googleId'] = googleUser.id;
      }
      final idToken = googleAuth.idToken?.trim();
      if (idToken != null && idToken.isNotEmpty) {
        requestBody['idToken'] = idToken;
        requestBody['credential'] = idToken;
      }
      final accessToken = googleAuth.accessToken?.trim();
      if (accessToken != null && accessToken.isNotEmpty) {
        requestBody['accessToken'] = accessToken;
      }

      // Guard: Do not send doomed request to backend if both tokens are missing
      if ((idToken == null || idToken.isEmpty) && (accessToken == null || accessToken.isEmpty)) {
        debugPrint('⚠️ [AuthService] Google autentifikatsiya tokenlari (idToken/accessToken) bo‘sh keldi.');
        return const AuthResult(
          success: false,
          errorMessage: 'Google orqali kirib bo‘lmadi, qayta urinib ko‘ring.',
        );
      }

      final res = await ApiClient().dio.post('/auth/google', data: requestBody);

      if (res.data['success'] == true) {
        final data = res.data['data'];
        final token = (data['token'] ?? data['accessToken']) as String;
        final userData = (data['user'] as Map<String, dynamic>?) ?? {};
        final bool isNewUser = data['isNewUser'] == true;
        final bool needsProfile = data['needsProfile'] == true ||
            userData['username'] == null ||
            (userData['username'] as String).isEmpty ||
            userData['dateOfBirth'] == null ||
            (userData['dateOfBirth'] as String).isEmpty;
        final bool profileCompleted = data['profileCompleted'] == true && !needsProfile;

        ApiClient().setAuthToken(token);
        await StorageService.saveAuthToken(token);
        if (data['refreshToken'] != null && (data['refreshToken'] as String).isNotEmpty) {
          await StorageService.saveRefreshToken(data['refreshToken'] as String);
        }

        final student = StudentModel.fromJson(userData);
        await StorageService.saveCachedStudent(student.toJson());
        return AuthResult(
          success: true,
          student: student,
          token: token,
          isNewUser: isNewUser,
          profileCompleted: profileCompleted,
        );
      } else {
        return AuthResult(
          success: false,
          errorMessage: res.data['error'] ?? 'Google orqali kirishda xatolik yuz berdi.',
        );
      }
    } catch (e) {
      debugPrint('ℹ️ Google orqali kirish backend natijasi: $e');
      if (e is DioException) {
        if (e.response?.data != null && e.response?.data is Map && e.response?.data['error'] != null) {
          return AuthResult(
            success: false,
            errorMessage: e.response!.data['error'].toString(),
          );
        }
        if (e.response?.statusCode == 400 || e.response?.statusCode == 401) {
          return const AuthResult(
            success: false,
            errorMessage: 'Google orqali kirib bo‘lmadi, qayta urinib ko‘ring.',
          );
        }
      }
      return const AuthResult(
        success: false,
        errorMessage: 'Google orqali tizimga kirishda server bilan aloqa uzildi.',
      );
    } finally {
      _isAuthenticating = false;
    }
  }
  
  /// Check whether Google Sign-In is safely available
  bool get isGoogleSignInAvailable => !_googleSignInInitFailed;

  /// Sign In With Google with graceful fallback and no startup crash
  Future<AuthResult> signInWithGoogle() async {
    final googleSignIn = _getGoogleSignIn();
    if (googleSignIn == null) {
      return const AuthResult(
        success: false,
        errorMessage:
            'Google orqali kirish sozlanmagan. Iltimos, to‘g‘ridan-to‘g‘ri hisob bilan kiring.',
      );
    }

    try {
      final GoogleSignInAccount? googleUser = await googleSignIn
          .signIn()
          .timeout(const Duration(seconds: 25), onTimeout: () {
        debugPrint('⚠️ [AuthService/Google] signIn() so‘rovi 25 soniyada javob bermadi.');
        return null;
      });

      if (googleUser == null) {
        // Foydalanuvchi oynani yopdi, bekor qildi yoki vaqt tugadi
        return const AuthResult(
          success: false,
          errorMessage:
              'Google oynasi yopildi yoki javob berilmadi. Iltimos, qaytadan urinib ko‘ring yoki login/parol orqali kiring.',
        );
      }

      return await authenticateGoogleUser(googleUser);
    } catch (e) {
      debugPrint('ℹ️ [AuthService/Google] Kirish xatoligi: $e');
      final errStr = e.toString().toLowerCase();

      // 1. Foydalanuvchi bekor qildi yoki oynani yopdi
      if (errStr.contains('popup_closed') ||
          errStr.contains('popup_blocked') ||
          errStr.contains('cancel') ||
          errStr.contains('canceled') ||
          errStr.contains('cancelled') ||
          errStr.contains('sign_in_canceled') ||
          errStr.contains('closed') ||
          errStr.contains('access_denied')) {
        return const AuthResult(
          success: false,
          errorMessage: null, // Bekor qilindi, qizil xatolik xabari ko'rsatilmaydi
        );
      }

      // 2. Android: ApiException 10 (DEVELOPER_ERROR) — SHA-1 yoki Package Name mos emas
      if (errStr.contains('10') || errStr.contains('developer_error')) {
        debugPrint('❌ [Google Sign-In] ApiException 10 (DEVELOPER_ERROR) aniqlandi!');
        debugPrint('📌 BUNI TUZATISH UCHUN Google Cloud Console ga quyidagilarni kiriting:');
        debugPrint('   Package name: com.mathcityai.mathcity_ai');
        debugPrint('   Debug SHA-1: 9D:02:97:60:C4:AE:DD:81:42:03:AE:70:F1:C7:E2:94:B0:EA:F3:8B');
        debugPrint('   Release SHA-1: 43:3D:D9:C8:8A:D6:90:14:8B:DF:07:F4:0D:42:EB:70:3D:0F:10:E1');
        debugPrint('   Play App Signing SHA-1: Google Play Console > Setup > App Integrity bo‘limidan oling.');
        return const AuthResult(
          success: false,
          errorMessage:
              'Google Sign-In sozlanmagan (ApiException 10: SHA-1 yoki paket nomi konsolda yo‘q). Iltimos, oddiy login orqali kiring.',
        );
      }

      // 3. Android: ApiException 12500 (OAuth rozilik ekrani to‘liq emas yoki tizim xatosi)
      if (errStr.contains('12500')) {
        debugPrint('❌ [Google Sign-In] ApiException 12500 aniqlandi (OAuth rozilik ekrani sozlanmagan).');
        return const AuthResult(
          success: false,
          errorMessage:
              'Google tizimida xatolik (12500: OAuth rozilik ekrani to‘liq sozlanmagan). Iltimos, oddiy hisob bilan kiring.',
        );
      }

      // 4. People API o'chiq
      if (errStr.contains('people.googleapis.com') ||
          errStr.contains('people api') ||
          errStr.contains('service_disabled')) {
        return const AuthResult(
          success: false,
          errorMessage:
              'Google Cloud Console loyihangizda "People API" yoqilmagan. Iltimos, Google konsolidan People API ni faollashtiring yoki to‘g‘ridan-to‘g‘ri login orqali kiring.',
        );
      }

      // 5. Web: Ruxsat etilmagan origin / domen
      if (errStr.contains('unregistered_origin') ||
          errStr.contains('origin_mismatch') ||
          errStr.contains('not allowed for the given client') ||
          errStr.contains('idpiframe_initialization_failed') ||
          errStr.contains('403')) {
        return const AuthResult(
          success: false,
          errorMessage:
              'Ushbu veb-manzil Google Cloud Console da ruxsat etilmagan (Authorized JavaScript origins). Iltimos, konsoldan manzilni qo‘shing yoki login orqali kiring.',
        );
      }

      // 6. Tarmoq xatoligi
      if (errStr.contains('network') || errStr.contains('socket') || errStr.contains('timeout')) {
        return const AuthResult(
          success: false,
          errorMessage:
              'Internet aloqasi mavjud emas yoki server uyg‘onmoqda. Iltimos, birozdan so‘ng qayta urinib ko‘ring.',
        );
      }

      return const AuthResult(
        success: false,
        errorMessage:
            'Google tizimiga ulanib bo‘lmadi. Internet aloqasini tekshiring yoki ro‘yxatdan o‘tish orqali kiring.',
      );
    }
  }

  /// Login with Username/Email and Password
  Future<AuthResult> login({
    required String identifier,
    required String password,
  }) async {
    try {
      final res = await ApiClient().dio.post('/auth/login', data: {
        'identifier': identifier.trim(),
        'password': password,
      });

      if (res.data['success'] == true) {
        final token = res.data['data']['token'] as String;
        final refreshToken = res.data['data']['refreshToken'] as String?;
        final bool isNewUser = res.data['data']['isNewUser'] == true;
        final bool profileCompleted = res.data['data']['profileCompleted'] == true;
        ApiClient().setAuthToken(token);
        await StorageService.saveAuthToken(token);
        if (refreshToken != null && refreshToken.isNotEmpty) {
          await StorageService.saveRefreshToken(refreshToken);
        }

        final userData = res.data['data']['user'];
        final student = StudentModel.fromJson(userData);
        await StorageService.saveCachedStudent(student.toJson());
        return AuthResult(
          success: true,
          student: student,
          token: token,
          isNewUser: isNewUser,
          profileCompleted: profileCompleted,
        );
      } else {
        return AuthResult(
          success: false,
          errorMessage: res.data['error'] ?? 'Login yoki parol noto‘g‘ri.',
        );
      }
    } catch (e) {
      if (e is DioException) {
        if (e.response?.statusCode == 401) {
          final serverMsg = e.response?.data is Map ? e.response?.data['error'] : null;
          return AuthResult(
            success: false,
            errorMessage: serverMsg ?? 'Login yoki parol noto‘g‘ri.',
          );
        }
        if (e.response?.data != null && e.response?.data['error'] != null) {
          return AuthResult(
            success: false,
            errorMessage: e.response!.data['error'].toString(),
          );
        }
      }
      return const AuthResult(
        success: false,
        errorMessage: 'Login yoki parol noto‘g‘ri.',
      );
    }
  }

  /// Legacy compatibility wrapper for loginWithEmailPassword
  Future<AuthResult> loginWithEmailPassword({
    required String email,
    required String password,
  }) async {
    return login(identifier: email, password: password);
  }

  /// Instant Demo Student Login (Ali) without needing external OAuth or credentials
  Future<AuthResult> loginWithDemo() async {
    try {
      final res = await ApiClient().dio.post('/auth/demo');
      if (res.data['success'] == true) {
        final data = res.data['data'];
        final token = data['token'] as String;
        final userData = (data['user'] as Map<String, dynamic>?) ?? {};
        final bool isNewUser = data['isNewUser'] == true;
        final bool profileCompleted =
            data['profileCompleted'] == true || userData['profileCompleted'] == true;

        ApiClient().setAuthToken(token);
        await StorageService.saveAuthToken(token);
        final student = StudentModel.fromJson(userData);
        await StorageService.saveCachedStudent(student.toJson());

        return AuthResult(
          success: true,
          student: student,
          token: token,
          isNewUser: isNewUser,
          profileCompleted: profileCompleted,
        );
      }
      return AuthResult(
        success: false,
        errorMessage: res.data['error'] ?? 'Demo hisobga ulanishda xatolik.',
      );
    } catch (e) {
      return AuthResult(
        success: false,
        errorMessage: ApiClient.getErrorMessage(e),
      );
    }
  }

  /// Register new student with name, loginOrEmail, password and confirmation
  Future<AuthResult> register({
    required String name,
    required String loginOrEmail,
    required String password,
    String? confirmPassword,
    DateTime? dob,
  }) async {
    if (confirmPassword != null && password != confirmPassword) {
      return const AuthResult(
        success: false,
        errorMessage: 'Parollar bir xil emas.',
      );
    }

    if (password.length < 8) {
      return const AuthResult(
        success: false,
        errorMessage: 'Parol kamida 8 ta belgidan iborat bo‘lsin.',
      );
    }

    final birthDate = dob ?? DateTime(2015, 5, 15);
    final now = DateTime.now();
    int age = now.year - birthDate.year;
    if (now.month < birthDate.month || (now.month == birthDate.month && now.day < birthDate.day)) {
      age--;
    }

    if (age >= 17) {
      return const AuthResult(
        success: false,
        isAgeDenied: true,
        errorMessage:
            'MathCity AI faqat 16 yoshgacha bo‘lgan o‘quvchilar uchun mo‘ljallangan. Afsuski, siz kira olmaysiz.',
      );
    }

    try {
      final res = await ApiClient().dio.post(
        '/auth/register',
        data: {
          'displayName': name.trim(),
          'loginOrEmail': loginOrEmail.trim(),
          'password': password,
          'confirmPassword': confirmPassword ?? password,
          'dateOfBirth': birthDate.toIso8601String(),
          'grade': (age - 5).clamp(1, 11),
        },
        options: Options(
          sendTimeout: const Duration(seconds: 10),
          receiveTimeout: const Duration(seconds: 20),
        ),
      ).timeout(const Duration(seconds: 15), onTimeout: () {
        throw DioException(
          requestOptions: RequestOptions(path: '/auth/register'),
          type: DioExceptionType.receiveTimeout,
          error: 'Server javob berish vaqti tugadi (15 soniya).',
        );
      });

      if (res.data['success'] == true) {
        final token = res.data['data']['token'] as String;
        final refreshToken = res.data['data']['refreshToken'] as String?;
        final bool isNewUser = res.data['data']['isNewUser'] == true;
        final bool profileCompleted = res.data['data']['profileCompleted'] == true;
        ApiClient().setAuthToken(token);
        await StorageService.saveAuthToken(token);
        if (refreshToken != null && refreshToken.isNotEmpty) {
          await StorageService.saveRefreshToken(refreshToken);
        }

        final userData = res.data['data']['user'];
        final student = StudentModel.fromJson(userData);
        await StorageService.saveCachedStudent(student.toJson());
        return AuthResult(
          success: true,
          student: student,
          token: token,
          isNewUser: isNewUser,
          profileCompleted: profileCompleted,
        );
      } else {
        return AuthResult(
          success: false,
          errorMessage: res.data['error'] ?? 'Ro‘yxatdan o‘tishda xatolik.',
        );
      }
    } catch (e) {
      if (e is DioException && e.response?.data != null && e.response?.data['error'] != null) {
        return AuthResult(
          success: false,
          errorMessage: e.response!.data['error'].toString(),
        );
      }
      return const AuthResult(
        success: false,
        errorMessage: 'Server bilan aloqa o‘rnatib bo‘lmadi. Qayta urinib ko‘ring.',
      );
    }
  }

  /// Non-blocking background warm-up ping (delegates to centralized ApiClient.warmUp)
  static void warmUpBackend() {
    ApiClient().warmUp().ignore();
  }

  Future<AuthResult>? _ongoingRestore;

  /// Check and restore existing session or attempt token refresh
  Future<AuthResult> restoreSession({bool allowDemoFallback = false}) {
    if (_ongoingRestore != null) {
      return _ongoingRestore!;
    }
    _ongoingRestore = _doRestoreSession(allowDemoFallback: allowDemoFallback).whenComplete(() {
      _ongoingRestore = null;
    });
    return _ongoingRestore!;
  }

  Future<AuthResult> _doRestoreSession({bool allowDemoFallback = false}) async {
    try {
      final savedToken = await StorageService.getAuthToken();
      if (savedToken != null && savedToken.isNotEmpty) {
        ApiClient().setAuthToken(savedToken);

        // Instant offline fallback from local cache
        StudentModel? fallbackStudent;
        final cachedJson = await StorageService.getCachedStudent();
        if (cachedJson != null) {
          try {
            fallbackStudent = StudentModel.fromJson(cachedJson);
          } catch (_) {}
        }

        try {
          final res = await ApiClient().dio.get('/auth/me');
          if (res.data['success'] == true) {
            final student = StudentModel.fromJson(res.data['data']);
            await StorageService.saveCachedStudent(student.toJson());
            return AuthResult(success: true, student: student, token: savedToken);
          }
        } catch (meError) {
          final is401 = meError is DioException && meError.response?.statusCode == 401;
          if (is401) {
            // Token expired - attempt refresh with stored refresh token
            try {
              final storedRefresh = await StorageService.getRefreshToken();
              final refreshRes = await ApiClient().dio.post('/auth/refresh', data: {
                if (storedRefresh != null) 'refreshToken': storedRefresh,
              });
              if (refreshRes.data['success'] == true) {
                final newToken = refreshRes.data['data']['token'] as String;
                final newRefresh = refreshRes.data['data']['refreshToken'] as String?;
                ApiClient().setAuthToken(newToken);
                await StorageService.saveAuthToken(newToken);
                if (newRefresh != null && newRefresh.isNotEmpty) {
                  await StorageService.saveRefreshToken(newRefresh);
                }
                final student = StudentModel.fromJson(refreshRes.data['data']['user']);
                await StorageService.saveCachedStudent(student.toJson());
                return AuthResult(success: true, student: student, token: newToken);
              }
            } catch (refreshError) {
              if (refreshError is DioException &&
                  (refreshError.response?.statusCode == 401 || refreshError.response?.statusCode == 403)) {
                // Token definitely rejected by server
                await StorageService.clear();
                ApiClient().clearAuthToken();
                return const AuthResult(success: false);
              }
            }
          }
          // Server might be sleeping (Render spin-up) or network is offline
          // DO NOT clear tokens! Return cached student so user stays logged in!
          if (fallbackStudent != null) {
            return AuthResult(success: true, student: fallbackStudent, token: savedToken);
          }
          // If we had a token, treat as temporary offline success even without full profile
          return AuthResult(success: true, token: savedToken);
        }
      }

      if (allowDemoFallback) {
        final demoRes = await ApiClient().dio.post('/auth/demo');
        if (demoRes.data['success'] == true) {
          final token = demoRes.data['data']['token'] as String;
          ApiClient().setAuthToken(token);
          await StorageService.saveAuthToken(token);
          final student = StudentModel.fromJson(demoRes.data['data']['user']);
          return AuthResult(success: true, student: student, token: token);
        }
      }
    } catch (e) {
      debugPrint('⚠️ Sessiyani tiklashda ogohlantirish: $e');
    }

    return const AuthResult(success: false);
  }

  /// Request password reset code
  Future<Map<String, dynamic>> requestPasswordReset(String emailOrUsername) async {
    try {
      final res = await ApiClient().dio.post('/auth/forgot-password', data: {
        'email': emailOrUsername.trim(),
      });
      return {
        'success': res.data['success'] == true,
        'message': res.data['message'] ?? 'Tiklash kodi yuborildi.',
        'debugCode': res.data['debugCode'],
      };
    } catch (e) {
      if (e is DioException && e.response?.data != null && e.response?.data['error'] != null) {
        return {
          'success': false,
          'message': e.response!.data['error'].toString(),
        };
      }
      return {
        'success': false,
        'message': 'Server bilan aloqa uzildi. Qayta urinib ko‘ring.',
      };
    }
  }

  /// Reset password with verified token
  Future<Map<String, dynamic>> resetPassword({
    required String emailOrUsername,
    required String resetToken,
    required String newPassword,
  }) async {
    try {
      final res = await ApiClient().dio.post('/auth/reset-password', data: {
        'email': emailOrUsername.trim(),
        'resetToken': resetToken.trim(),
        'newPassword': newPassword,
      });
      return {
        'success': res.data['success'] == true,
        'message': res.data['message'] ?? 'Parol yangilandi.',
      };
    } catch (e) {
      if (e is DioException && e.response?.data != null && e.response?.data['error'] != null) {
        return {
          'success': false,
          'message': e.response!.data['error'].toString(),
        };
      }
      return {
        'success': false,
        'message': 'Parolni yangilashda xatolik yuz berdi.',
      };
    }
  }

  /// Sign In With Apple (Native iOS/macOS & Web flow)
  Future<AuthResult> signInWithApple() async {
    // Apple Sign-In requires secure HTTPS origin on web
    if (kIsWeb) {
      final originScheme = Uri.base.scheme;
      if (originScheme != 'https') {
        return const AuthResult(
          success: false,
          errorMessage:
              'Apple orqali kirish faqat xavfsiz HTTPS muhitida (Render ishlab chiqarish serverida) ishlaydi. Mahalliy rejimda Google yoki login/parol orqali kiring.',
        );
      }
    }

    try {
      // 1. Generate cryptographic raw nonce and sha256 hash
      final rawNonce = base64Url.encode(
        List<int>.generate(32, (_) => math.Random.secure().nextInt(256)),
      );
      final sha256Nonce = sha256.convert(utf8.encode(rawNonce)).toString();

      // 2. Request credential from Apple ID
      final credential = await SignInWithApple.getAppleIDCredential(
        scopes: [
          AppleIDAuthorizationScopes.email,
          AppleIDAuthorizationScopes.fullName,
        ],
        nonce: sha256Nonce,
        webAuthenticationOptions: WebAuthenticationOptions(
          clientId: 'ai.mathcity.web',
          redirectUri: Uri.parse('${AppConfig.productionApiUrl}/api/auth/apple/callback'),
        ),
      );

      // 3. Post authoritative tokens to backend for server-side JWKS validation
      final res = await ApiClient().dio.post('/auth/apple', data: {
        'identityToken': credential.identityToken,
        'authorizationCode': credential.authorizationCode,
        'nonce': rawNonce,
        'appleUserId': credential.userIdentifier,
        'email': credential.email,
        'fullName': credential.givenName != null || credential.familyName != null
            ? {
                'givenName': credential.givenName,
                'familyName': credential.familyName,
              }
            : null,
      });

      if (res.data['success'] == true) {
        final token = res.data['data']['token'] as String;
        final refreshToken = res.data['data']['refreshToken'] as String?;
        final bool isNewUser = res.data['data']['isNewUser'] == true;
        final bool profileCompleted = res.data['data']['profileCompleted'] == true;
        ApiClient().setAuthToken(token);
        await StorageService.saveAuthToken(token);
        if (refreshToken != null && refreshToken.isNotEmpty) {
          await StorageService.saveRefreshToken(refreshToken);
        }

        final userData = res.data['data']['user'];
        final student = StudentModel.fromJson(userData);
        await StorageService.saveCachedStudent(student.toJson());
        return AuthResult(
          success: true,
          student: student,
          token: token,
          isNewUser: isNewUser,
          profileCompleted: profileCompleted,
        );
      } else {
        return AuthResult(
          success: false,
          errorMessage: res.data['error'] ?? 'Apple orqali kirishda xatolik yuz berdi.',
        );
      }
    } on SignInWithAppleAuthorizationException catch (e) {
      if (e.code == AuthorizationErrorCode.canceled) {
        return const AuthResult(success: false, errorMessage: null);
      }
      return AuthResult(
        success: false,
        errorMessage: 'Apple tizimiga kirish bekor qilindi yoki xato yuz berdi (${e.message}).',
      );
    } catch (e) {
      debugPrint('ℹ️ Apple sign in error: $e');
      final err = e.toString().toLowerCase();
      if (err.contains('cancel') || err.contains('closed') || err.contains('dismissed')) {
        return const AuthResult(success: false, errorMessage: null);
      }
      if (err.contains('notsupported') || err.contains('not supported')) {
        return const AuthResult(
          success: false,
          errorMessage:
              'Ushbu qurilmada Apple orqali kirish qo‘llab-quvvatlanmaydi. Login va parol yoki Google orqali kiring.',
        );
      }
      return const AuthResult(
        success: false,
        errorMessage: 'Apple orqali ulanishda xatolik yuz berdi. Internet aloqasini tekshiring.',
      );
    }
  }

  /// Check username availability and uniqueness
  Future<Map<String, dynamic>> checkUsername(String username) async {
    final clean = username.trim();
    try {
      final res = await ApiClient().dio.get('/users/check-username', queryParameters: {
        'u': clean,
      });
      if (res.data['success'] == true) {
        return res.data['data'] as Map<String, dynamic>;
      }
      return {'available': false, 'message': res.data['error'] ?? '✕ Bu nom band, boshqasini tanlang'};
    } catch (e) {
      try {
        final fallbackRes = await ApiClient().dio.get('/auth/username-available', queryParameters: {
          'username': clean,
        });
        if (fallbackRes.data['success'] == true) {
          return fallbackRes.data['data'] as Map<String, dynamic>;
        }
      } catch (_) {}

      if (e is DioException && e.response?.data != null) {
        final data = e.response!.data;
        if (data is Map && data['data'] != null && data['data']['message'] != null) {
          return {'available': false, 'message': data['data']['message'].toString()};
        }
        if (data is Map && data['error'] != null) {
          return {'available': false, 'message': data['error'].toString()};
        }
      }
      return {'available': false, 'message': 'Foydalanuvchi nomini tekshirishda xatolik yuz berdi.'};
    }
  }

  /// Complete student profile with unique username and verified birth date
  Future<AuthResult> completeProfile({
    required String username,
    required int day,
    required int month,
    required int year,
  }) async {
    try {
      final res = await ApiClient().dio.post('/auth/complete-profile', data: {
        'username': username.trim(),
        'birthDay': day,
        'birthMonth': month,
        'birthYear': year,
      });

      if (res.data['success'] == true) {
        final userData = res.data['data']['user'];
        final student = StudentModel.fromJson(userData);
        final bool requiresParentalConsent = res.data['data']['requiresParentalConsent'] == true;
        return AuthResult(
          success: true,
          student: student,
          profileCompleted: true,
          requiresParentalConsent: requiresParentalConsent,
        );
      } else {
        return AuthResult(
          success: false,
          errorMessage: res.data['error'] ?? 'Profilni saqlashda xatolik.',
        );
      }
    } catch (e) {
      if (e is DioException && e.response?.data != null && e.response?.data['error'] != null) {
        return AuthResult(
          success: false,
          errorMessage: e.response!.data['error'].toString(),
        );
      }
      return const AuthResult(
        success: false,
        errorMessage: 'Profilni saqlashda server bilan aloqa uzildi.',
      );
    }
  }

  /// Backwards-compatibility wrapper for completeOnboarding
  Future<AuthResult> completeOnboarding({
    required String username,
    required int day,
    required int month,
    required int year,
  }) async {
    return completeProfile(username: username, day: day, month: month, year: year);
  }

  /// In-App Account Deletion (App Store Guideline compliance)
  Future<bool> deleteAccount() async {
    try {
      final res = await ApiClient().dio.delete('/auth/account');
      if (res.data['success'] == true) {
        await signOut();
        return true;
      }
      return false;
    } catch (e) {
      debugPrint('⚠️ Hisobni o‘chirishda xatolik: $e');
      return false;
    }
  }

  /// Sign Out
  Future<void> signOut() async {
    ApiClient().clearAuthToken();
    await StorageService.clear();
    final googleSignIn = _getGoogleSignIn();
    if (googleSignIn != null) {
      try {
        await googleSignIn.signOut();
      } catch (_) {}
    }
  }
}
