import 'package:flutter/foundation.dart';
import 'package:google_sign_in/google_sign_in.dart';
import '../network/api_client.dart';
import '../storage/storage_service.dart';
import '../../shared/models/student_model.dart';

class AuthResult {
  final bool success;
  final StudentModel? student;
  final String? token;
  final String? errorMessage;
  final bool isAgeDenied;

  const AuthResult({
    required this.success,
    this.student,
    this.token,
    this.errorMessage,
    this.isAgeDenied = false,
  });
}

class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  GoogleSignIn? _googleSignInInstance;
  bool _googleSignInInitFailed = false;

  /// Web OAuth Client ID from Google Cloud Console
  /// Authorized JavaScript origins: http://localhost:8085
  static String webClientId = const String.fromEnvironment(
    'GOOGLE_CLIENT_ID',
    defaultValue:
        '608766203356-d6oq3gvc5n199671ho1npgr240afkjup.apps.googleusercontent.com',
  );

  /// Allows setting web client id at runtime if needed
  static void setWebClientId(String clientId) {
    webClientId = clientId;
  }

  /// Controlled lazy initialization for GoogleSignIn
  GoogleSignIn? _getGoogleSignIn() {
    if (_googleSignInInitFailed) return null;
    if (_googleSignInInstance != null) return _googleSignInInstance;

    try {
      _googleSignInInstance = GoogleSignIn(
        clientId: kIsWeb ? webClientId : null,
        scopes: const ['email', 'profile'],
      );
      return _googleSignInInstance;
    } catch (e, stack) {
      debugPrint('⚠️ GoogleSignIn initsializatsiya xatosi: $e\n$stack');
      _googleSignInInitFailed = true;
      return null;
    }
  }

  /// Stream of Google user accounts (fired by GIS button or silent login)
  Stream<GoogleSignInAccount?> get onGoogleAccountChanged {
    final gsi = _getGoogleSignIn();
    if (gsi == null) return const Stream.empty();
    return gsi.onCurrentUserChanged;
  }

  /// Authenticate Google User with Backend
  Future<AuthResult> authenticateGoogleUser(GoogleSignInAccount googleUser) async {
    try {
      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;

      final res = await ApiClient().dio.post('/auth/google', data: {
        'googleId': googleUser.id,
        'email': googleUser.email,
        'displayName': googleUser.displayName ?? 'O‘quvchi',
        'idToken': googleAuth.idToken,
      });

      if (res.data['success'] == true) {
        final token = res.data['data']['token'] as String;
        ApiClient().setAuthToken(token);
        await StorageService.saveAuthToken(token);

        final userData = res.data['data']['user'];
        final student = StudentModel.fromJson(userData);
        return AuthResult(success: true, student: student, token: token);
      } else {
        return AuthResult(
          success: false,
          errorMessage: res.data['error'] ?? 'Google orqali kirishda xatolik yuz berdi.',
        );
      }
    } catch (e) {
      debugPrint('⚠️ Google orqali kirish backend xatoligi: $e');
      return const AuthResult(
        success: false,
        errorMessage: 'Google orqali tizimga kirishda server bilan aloqa uzildi.',
      );
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
      final GoogleSignInAccount? googleUser = await googleSignIn.signIn();
      if (googleUser == null) {
        // Foydalanuvchi oynani bekor qildi
        return const AuthResult(
          success: false,
          errorMessage: 'Google orqali kirish bekor qilindi.',
        );
      }

      return await authenticateGoogleUser(googleUser);
    } catch (e) {
      debugPrint('⚠️ Google orqali kirish xatoligi: $e');
      return const AuthResult(
        success: false,
        errorMessage:
            'Google tizimiga ulanib bo‘lmadi. Internet aloqasini tekshiring yoki ro‘yxatdan o‘tish orqali kiring.',
      );
    }
  }

  /// Login with Email and Password
  Future<AuthResult> loginWithEmailPassword({
    required String email,
    required String password,
  }) async {
    try {
      final res = await ApiClient().dio.post('/auth/login', data: {
        'email': email.trim().toLowerCase(),
        'password': password,
      });

      if (res.data['success'] == true) {
        final token = res.data['data']['token'] as String;
        ApiClient().setAuthToken(token);
        await StorageService.saveAuthToken(token);

        final userData = res.data['data']['user'];
        final student = StudentModel.fromJson(userData);
        return AuthResult(success: true, student: student, token: token);
      } else {
        return AuthResult(
          success: false,
          errorMessage: res.data['error'] ?? 'Kirishda xatolik yuz berdi.',
        );
      }
    } catch (e) {
      return AuthResult(
        success: false,
        errorMessage: 'Email yoki parol noto‘g‘ri yoki server bilan aloqa yo‘q.',
      );
    }
  }

  /// Register new student with strict age eligibility check
  Future<AuthResult> register({
    required String name,
    required DateTime dob,
    required String email,
    required String password,
  }) async {
    final now = DateTime.now();
    int age = now.year - dob.year;
    if (now.month < dob.month || (now.month == dob.month && now.day < dob.day)) {
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
      final res = await ApiClient().dio.post('/auth/register', data: {
        'displayName': name.trim(),
        'dateOfBirth': dob.toIso8601String(),
        'email': email.trim().toLowerCase(),
        'password': password,
        'grade': (age - 5).clamp(1, 11),
      });

      if (res.data['success'] == true) {
        final token = res.data['data']['token'] as String;
        ApiClient().setAuthToken(token);
        await StorageService.saveAuthToken(token);

        final userData = res.data['data']['user'];
        final student = StudentModel.fromJson(userData);
        return AuthResult(success: true, student: student, token: token);
      } else {
        return AuthResult(
          success: false,
          errorMessage: res.data['error'] ?? 'Ro‘yxatdan o‘tishda xatolik.',
        );
      }
    } catch (e) {
      return const AuthResult(
        success: false,
        errorMessage: 'Server bilan aloqa o‘rnatib bo‘lmadi. Qayta urinib ko‘ring.',
      );
    }
  }

  /// Establish or Restore Authenticated Session
  Future<AuthResult> restoreSession() async {
    try {
      final savedToken = await StorageService.getAuthToken();
      if (savedToken != null && savedToken.isNotEmpty) {
        ApiClient().setAuthToken(savedToken);
        final res = await ApiClient().dio.get('/auth/me');
        if (res.data['success'] == true) {
          final student = StudentModel.fromJson(res.data['data']);
          return AuthResult(success: true, student: student, token: savedToken);
        }
      }

      // No token or token expired: obtain a genuine signed demo token from backend
      final demoRes = await ApiClient().dio.post('/auth/demo');
      if (demoRes.data['success'] == true) {
        final token = demoRes.data['data']['token'] as String;
        ApiClient().setAuthToken(token);
        await StorageService.saveAuthToken(token);
        final student = StudentModel.fromJson(demoRes.data['data']['user']);
        return AuthResult(success: true, student: student, token: token);
      }
    } catch (e) {
      debugPrint('⚠️ Sessiyani tiklashda ogohlantirish: $e');
    }

    // Default offline fallback student model
    final fallbackStudent = StudentModel(
      id: 'demo-student-id',
      email: 'ali@mathcity.ai',
      displayName: 'Ali',
      age: 11,
      mode: 'KIDS',
      grade: 4,
      coinBalance: 100,
      totalXP: 380,
      level: 3,
      cityLevel: 2,
      attemptedQuestionCount: 15,
      correctQuestionCount: 14,
      subscription: SubscriptionModel(
        status: 'FREE_TRIAL_ACTIVE',
        trialDaysRemaining: 30,
        isProActive: false,
        planName: 'MathCity Free Trial',
        priceMonthlyUzs: 29000,
      ),
    );
    return AuthResult(success: true, student: fallbackStudent);
  }

  /// Sign Out
  Future<void> signOut() async {
    ApiClient().setAuthToken(null);
    await StorageService.clear();
    final googleSignIn = _getGoogleSignIn();
    if (googleSignIn != null) {
      try {
        await googleSignIn.signOut();
      } catch (_) {}
    }
  }
}
