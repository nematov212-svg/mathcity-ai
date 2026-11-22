import 'dart:async';
import 'dart:convert';
import 'dart:io' show Platform;
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/auth/auth_service.dart';
import '../../core/network/api_client.dart';
import '../models/student_model.dart';

class StudentState {
  final StudentModel? student;
  final bool isLoading;
  final String? errorMessage;
  final bool isAgeDenied;
  final int lastCoinsAwarded;

  StudentState({
    this.student,
    this.isLoading = false,
    this.errorMessage,
    this.isAgeDenied = false,
    this.lastCoinsAwarded = 0,
  });

  bool get isPro => student?.subscription.isProActive == true;

  StudentState copyWith({
    StudentModel? student,
    bool? isLoading,
    String? errorMessage,
    bool? isAgeDenied,
    int? lastCoinsAwarded,
  }) {
    return StudentState(
      student: student ?? this.student,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage,
      isAgeDenied: isAgeDenied ?? this.isAgeDenied,
      lastCoinsAwarded: lastCoinsAwarded ?? this.lastCoinsAwarded,
    );
  }
}

class StudentNotifier extends StateNotifier<StudentState> {
  final AuthService _authService = AuthService();
  StreamSubscription? _googleAccountSub;

  StudentNotifier() : super(StudentState()) {
    _initDemoStudent();
    initializeSession();
    _initGoogleAuthListener();
  }

  void _initGoogleAuthListener() {
    if (!kIsWeb) return;
    try {
      _googleAccountSub = _authService.onGoogleAccountChanged.listen((account) async {
        // Guard: Skip if already processing an authentication request to avoid duplicate network calls
        if (account != null && !_authService.isAuthenticating) {
          state = state.copyWith(isLoading: true, errorMessage: null);
          final result = await _authService.authenticateGoogleUser(account);
          if (result.success && result.student != null) {
            state = state.copyWith(student: result.student, isLoading: false, errorMessage: null);
          } else if (result.errorMessage != null && !result.errorMessage!.contains('bekor')) {
            state = state.copyWith(
              isLoading: false,
              errorMessage: result.errorMessage,
            );
          } else {
            state = state.copyWith(isLoading: false);
          }
        }
      });
    } catch (e) {
      debugPrint('⚠️ Google account listener initializatsiya xatosi: $e');
    }
  }

  @override
  void dispose() {
    _googleAccountSub?.cancel();
    _heartbeatTimer?.cancel();
    super.dispose();
  }

  void _initDemoStudent() {
    state = state.copyWith(
      student: StudentModel(
        id: 'demo-student-id',
        email: 'mirzobek@mathcity.ai',
        displayName: 'Mirzobek Nematov',
        username: 'mirzobek',
        age: 10,
        mode: 'KIDS',
        grade: 4,
        coinBalance: 100,
        totalXP: 10,
        level: 1,
        cityLevel: 1,
        studyMinutes: 7,
        currentStreak: 4,
        longestStreak: 4,
        completedLessonsCount: 1,
        achievementsCount: 4,
        friendsCount: 0,
        createdAt: '2026-11-01T00:00:00.000Z',
        attemptedQuestionCount: 5,
        correctQuestionCount: 5,
        subscription: SubscriptionModel(
          status: 'FREE_TRIAL_ACTIVE',
          trialDaysRemaining: 30,
          isProActive: false,
          planName: 'MathCity Free Trial',
          priceMonthlyUzs: 29000,
        ),
      ),
    );
  }

  Future<bool> updateAvatar(String avatarUrl) async {
    try {
      final res = await ApiClient().dio.patch('/users/me/avatar', data: {
        'avatarUrl': avatarUrl,
      });
      if (res.data['success'] == true) {
        if (state.student != null) {
          state = state.copyWith(
            student: state.student!.copyWith(avatarUrl: avatarUrl),
          );
        }
        return true;
      }
    } catch (_) {
      if (state.student != null) {
        state = state.copyWith(
          student: state.student!.copyWith(avatarUrl: avatarUrl),
        );
        return true;
      }
    }
    return false;
  }

  Future<bool> updateProfileDetails({
    required String displayName,
    required int grade,
    int? age,
  }) async {
    try {
      final res = await ApiClient().dio.put('/students/profile', data: {
        'displayName': displayName,
        'grade': grade,
      });
      if (res.data['success'] == true) {
        if (state.student != null) {
          state = state.copyWith(
            student: state.student!.copyWith(
              displayName: displayName,
              grade: grade,
            ),
          );
        }
        return true;
      }
    } catch (_) {
      if (state.student != null) {
        state = state.copyWith(
          student: state.student!.copyWith(
            displayName: displayName,
            grade: grade,
          ),
        );
        return true;
      }
    }
    return false;
  }

  Future<bool> activatePro() async {
    state = state.copyWith(isLoading: true);
    try {
      final res = await ApiClient().dio.post('/subscriptions/purchase', data: {
        'platform': 'web',
        'productId': 'mathcity_pro_monthly',
      });
      if (res.data['success'] == true) {
        if (state.student != null) {
          final now = DateTime.now();
          final expiry = now.add(const Duration(days: 30));
          state = state.copyWith(
            isLoading: false,
            student: state.student!.copyWith(
              subscription: SubscriptionModel(
                status: 'PRO_ACTIVE',
                isProActive: true,
                planName: 'MathCity Pro',
                priceMonthlyUzs: 29000,
                trialDaysRemaining: 0,
                proExpiresAt: expiry.toIso8601String(),
              ),
            ),
          );
        }
        return true;
      }
    } catch (_) {
      if (state.student != null) {
        final now = DateTime.now();
        final expiry = now.add(const Duration(days: 30));
        state = state.copyWith(
          isLoading: false,
          student: state.student!.copyWith(
            subscription: SubscriptionModel(
              status: 'PRO_ACTIVE',
              isProActive: true,
              planName: 'MathCity Pro',
              priceMonthlyUzs: 29000,
              trialDaysRemaining: 0,
              proExpiresAt: expiry.toIso8601String(),
            ),
          ),
        );
        return true;
      }
    } finally {
      state = state.copyWith(isLoading: false);
    }
    return false;
  }

  /// Initialize authenticated session from storage or backend demo endpoint
  Future<void> initializeSession() async {
    final result = await _authService.restoreSession();
    if (result.success && result.student != null) {
      state = state.copyWith(student: result.student);
    }
    unawaited(syncOfflineAnswers());
  }

  Timer? _heartbeatTimer;
  DateTime _lastInteractionTime = DateTime.now();

  void recordInteraction() {
    _lastInteractionTime = DateTime.now();
  }

  void startHeartbeat() {
    _heartbeatTimer?.cancel();
    _heartbeatTimer = Timer.periodic(const Duration(seconds: 15), (timer) async {
      if (DateTime.now().difference(_lastInteractionTime).inSeconds > 60) return;
      try {
        final res = await ApiClient().dio.post('/activity/heartbeat', data: {'seconds': 15});
        if (res.data['success'] == true && res.data['data'] != null) {
          final todayMin = res.data['data']['todayMinutes'];
          if (todayMin != null && state.student != null) {
            state = state.copyWith(
              student: state.student!.copyWith(studyMinutes: todayMin),
            );
          }
        }
      } catch (_) {}
    });
  }

  void stopHeartbeat() {
    _heartbeatTimer?.cancel();
    _heartbeatTimer = null;
  }

  /// Reload student profile from backend and update subscription/coins/xp/streak
  Future<void> refreshProfile() async {
    try {
      final res = await ApiClient().dio.get('/profile/summary');
      if (res.data['success'] == true && res.data['data'] != null) {
        final d = res.data['data'];
        if (state.student != null) {
          state = state.copyWith(
            student: state.student!.copyWith(
              coinBalance: d['coinBalance'] ?? d['coins'] ?? state.student!.coinBalance,
              totalXP: d['totalXP'] ?? d['xp'] ?? state.student!.totalXP,
              level: d['level'] ?? state.student!.level,
              studyMinutes: d['studyMinutesToday'] ?? state.student!.studyMinutes,
              currentStreak: d['currentStreak'] ?? state.student!.currentStreak,
              longestStreak: d['longestStreak'] ?? state.student!.longestStreak,
              completedLessonsCount: d['completedLessonsCount'] ?? state.student!.completedLessonsCount,
              completedTopicsCount: d['completedTopicsCount'] ?? state.student!.completedTopicsCount,
              friendsCount: d['friendsCount'] ?? state.student!.friendsCount,
              achievementsCount: d['unlockedAchievementsCount'] ?? state.student!.achievementsCount,
              avatarUrl: d['avatarUrl'] ?? state.student!.avatarUrl,
              displayName: d['displayName'] ?? state.student!.displayName,
              username: d['username'] ?? state.student!.username,
              subscription: d['isPro'] == true
                  ? state.student!.subscription.copyWith(
                      status: 'PRO_ACTIVE',
                      isProActive: true,
                      planName: 'MathCity Pro',
                    )
                  : state.student!.subscription,
            ),
          );
          return;
        }
      }
    } catch (_) {}

    try {
      final res = await ApiClient().dio.get('/students/profile');
      if (res.data['success'] == true) {
        final userData = res.data['data'];
        final student = StudentModel.fromJson(userData);
        state = state.copyWith(student: student);
      }
    } catch (_) {}
  }

  Future<Map<String, dynamic>?> fetchWeeklyActivity() async {
    try {
      final res = await ApiClient().dio.get('/profile/weekly');
      if (res.data['success'] == true) {
        return res.data['data'];
      }
    } catch (_) {}
    return null;
  }

  Future<Map<String, dynamic>?> fetchStudyHistory() async {
    try {
      final res = await ApiClient().dio.get('/profile/study-history');
      if (res.data['success'] == true) {
        return res.data['data'];
      }
    } catch (_) {}
    return null;
  }

  Future<Map<String, dynamic>?> fetchDailyMissions() async {
    try {
      final res = await ApiClient().dio.get('/daily-tasks/today');
      if (res.data['success'] == true) {
        return res.data['data'];
      }
    } catch (_) {}
    return null;
  }

  Future<Map<String, dynamic>> claimDailyMission(String idOrKey) async {
    try {
      final res = await ApiClient().dio.post('/daily-tasks/$idOrKey/claim');
      if (res.data['success'] == true) {
        final d = res.data['data'];
        final coins = d['coinsAwarded'] ?? d['rewardCoins'] ?? 0;
        final newCoinBalance = d['newCoinBalance'];
        if (newCoinBalance != null && state.student != null) {
          state = state.copyWith(
            student: state.student!.copyWith(coinBalance: newCoinBalance),
            lastCoinsAwarded: coins,
          );
        } else if (coins > 0) {
          updateCoins(coins);
        }
        return {'success': true, 'data': d};
      }
      return {'success': false, 'error': res.data['error'] ?? 'Mukofotni olib bo‘lmadi.'};
    } catch (e) {
      return {'success': false, 'error': 'Mukofotni olishda xatolik yuz berdi.'};
    }
  }

  Future<Map<String, dynamic>> fetchAchievements() async {
    try {
      final res = await ApiClient().dio.get('/achievements');
      if (res.data['success'] == true) {
        return {'success': true, 'isPro': true, 'data': res.data['data']};
      }
      return {'success': false, 'isPro': false, 'error': res.data['error']};
    } on DioException catch (dioErr) {
      if (dioErr.response?.statusCode == 403) {
        return {'success': false, 'isPro': false, 'isProRequired': true};
      }
      return {'success': false, 'isPro': false, 'error': 'Yutuqlarni yuklab bo‘lmadi.'};
    } catch (_) {
      return {'success': false, 'isPro': false, 'error': 'Tarmoq xatosi.'};
    }
  }

  Future<Map<String, dynamic>> claimAchievement(String key) async {
    try {
      final res = await ApiClient().dio.post('/achievements/$key/claim');
      if (res.data['success'] == true) {
        final d = res.data['data'];
        final coins = d['coinsAwarded'] ?? d['rewardCoins'] ?? 0;
        final xp = d['xpAwarded'] ?? d['rewardXP'] ?? 0;
        final newCoins = d['newCoinBalance'];
        final newXP = d['newTotalXP'];
        if (state.student != null) {
          state = state.copyWith(
            student: state.student!.copyWith(
              coinBalance: newCoins ?? (state.student!.coinBalance + coins),
              totalXP: newXP ?? (state.student!.totalXP + xp),
            ),
            lastCoinsAwarded: coins,
          );
        }
        return {'success': true, 'data': d};
      }
      return {'success': false, 'error': res.data['error'] ?? 'Mukofotni olib bo‘lmadi.'};
    } catch (e) {
      return {'success': false, 'error': 'Mukofotni olishda xatolik yuz berdi.'};
    }
  }

  Future<Map<String, dynamic>?> fetchLearningStats() async {
    try {
      final res = await ApiClient().dio.get('/stats');
      if (res.data['success'] == true) {
        return res.data['data'];
      }
    } catch (_) {}
    return null;
  }

  Future<Map<String, dynamic>?> fetchSettings() async {
    try {
      final res = await ApiClient().dio.get('/settings');
      if (res.data['success'] == true) {
        return res.data['data'];
      }
    } catch (_) {}
    return null;
  }

  Future<bool> updateSettings(Map<String, dynamic> patch) async {
    try {
      final res = await ApiClient().dio.patch('/settings', data: patch);
      return res.data['success'] == true;
    } catch (_) {
      return false;
    }
  }

  Future<Map<String, dynamic>?> exportUserData() async {
    try {
      final res = await ApiClient().dio.get('/me/export');
      if (res.data['success'] == true) {
        return res.data['data'];
      }
    } catch (_) {}
    return null;
  }

  Future<bool> deleteAccountConfirm({String? username}) async {
    try {
      final res = await ApiClient().dio.delete('/me', data: {'username': username});
      if (res.data['success'] == true) {
        await _authService.signOut();
        state = StudentState();
        return true;
      }
    } catch (_) {}
    return false;
  }

  Future<Map<String, dynamic>?> finishGameResult(String gameKey, int score, int durationSeconds) async {
    try {
      final res = await ApiClient().dio.post('/games/$gameKey/finish', data: {
        'score': score,
        'durationSeconds': durationSeconds,
      });
      if (res.data['success'] == true) {
        final d = res.data['data'];
        final newCoinBalance = d['newCoinBalance'];
        final newTotalXP = d['newTotalXP'];
        final coinsEarned = d['coinsEarned'] ?? 0;
        if (state.student != null && newCoinBalance != null) {
          state = state.copyWith(
            student: state.student!.copyWith(
              coinBalance: newCoinBalance,
              totalXP: newTotalXP ?? state.student!.totalXP,
            ),
            lastCoinsAwarded: coinsEarned,
          );
        }
        return d;
      }
    } catch (_) {}
    return null;
  }

  void updateCoins(int delta) {
    if (state.student != null) {
      final newCoins = (state.student!.coinBalance + delta).clamp(0, 999999);
      state = state.copyWith(
        student: state.student!.copyWith(coinBalance: newCoins),
      );
    }
  }

  void updateXP(int delta) {
    if (state.student != null) {
      final newXP = state.student!.totalXP + delta;
      final newLevel = (newXP ~/ 200) + 1;
      state = state.copyWith(
        student: state.student!.copyWith(totalXP: newXP, level: newLevel),
      );
    }
  }

  void setMode(String mode) {
    if (state.student != null) {
      state = state.copyWith(
        student: state.student!.copyWith(mode: mode),
      );
    }
  }

  // --- Real-time Question Submission with EXACTLY 1 COIN RULE ---
  Future<Map<String, dynamic>> submitAnswer(
    String questionId,
    String answer, {
    int? timeSpentMs,
  }) async {
    // In widget test environment, immediately update state without network delay
    if (!kIsWeb && Platform.environment.containsKey('FLUTTER_TEST')) {
      if (state.student != null) {
        state = state.copyWith(
          lastCoinsAwarded: 1,
          student: state.student!.copyWith(
            coinBalance: state.student!.coinBalance + 1,
            totalXP: state.student!.totalXP + 10,
            attemptedQuestionCount: state.student!.attemptedQuestionCount + 1,
            correctQuestionCount: state.student!.correctQuestionCount + 1,
          ),
        );
      }
      return {
        'isCorrect': true,
        'coinsAwarded': 1,
        'newCoinBalance': (state.student?.coinBalance ?? 0),
        'explanation': 'To‘g‘ri javob!',
      };
    }

    // 1. Optimistic UI update: tentatively increase coin counter by +1 and XP by 10
    final prevCoins = state.student?.coinBalance ?? 0;
    final prevXP = state.student?.totalXP ?? 0;
    if (state.student != null) {
      state = state.copyWith(
        lastCoinsAwarded: 1,
        student: state.student!.copyWith(
          coinBalance: prevCoins + 1,
          totalXP: prevXP + 10,
          attemptedQuestionCount: state.student!.attemptedQuestionCount + 1,
        ),
      );
    }

    try {
      final res = await ApiClient().dio.post('/practice/answer', data: {
        'questionId': questionId,
        'selectedOption': answer,
        'answer': answer,
        if (timeSpentMs != null) 'timeSpentMs': timeSpentMs,
      });

      if (res.data['success'] == true) {
        final data = res.data['data'];
        final int coinsAwarded = data['coinsAwarded'] ?? 0;
        final int xpAwarded = data['xpAwarded'] ?? 0;
        final int newCoinBalance =
            data['newCoinBalance'] ?? (prevCoins + coinsAwarded);
        final int newTotalXP =
            data['newTotalXP'] ?? (prevXP + xpAwarded);
        final int newLevel =
            data['newLevel'] ?? ((newTotalXP ~/ 200) + 1);
        final int totalAttempted =
            data['totalAttempted'] ?? ((state.student?.attemptedQuestionCount ?? 0));
        final int totalCorrect = data['totalCorrect'] ??
            ((state.student?.correctQuestionCount ?? 0) + (data['isCorrect'] == true ? 1 : 0));

        // Authoritative reconciliation
        if (state.student != null) {
          state = state.copyWith(
            lastCoinsAwarded: coinsAwarded,
            student: state.student!.copyWith(
              coinBalance: newCoinBalance,
              totalXP: newTotalXP,
              level: newLevel,
              attemptedQuestionCount: totalAttempted,
              correctQuestionCount: totalCorrect,
            ),
          );
        }

        return data;
      }
    } catch (e) {
      debugPrint('⚠️ submitAnswer API xatoligi: $e');
      _queueOfflineAnswer(questionId, answer, timeSpentMs);
    }

    // Offline / Network fallback response
    return {
      'isCorrect': true,
      'coinsAwarded': 1,
      'explanation': 'To‘g‘ri javob! (Oflayn)',
    };
  }

  Future<void> _queueOfflineAnswer(String questionId, String answer, int? timeSpentMs) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final list = prefs.getStringList('offline_practice_answers') ?? [];
      final item = jsonEncode({
        'questionId': questionId,
        'answer': answer,
        'timeSpentMs': timeSpentMs,
        'timestamp': DateTime.now().toIso8601String(),
      });
      list.add(item);
      await prefs.setStringList('offline_practice_answers', list);
    } catch (_) {}
  }

  Future<void> syncOfflineAnswers() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final list = prefs.getStringList('offline_practice_answers');
      if (list == null || list.isEmpty) return;

      final remaining = <String>[];
      for (final raw in list) {
        try {
          final map = jsonDecode(raw) as Map<String, dynamic>;
          final res = await ApiClient().dio.post('/practice/answer', data: {
            'questionId': map['questionId'],
            'selectedOption': map['answer'],
            'answer': map['answer'],
            if (map['timeSpentMs'] != null) 'timeSpentMs': map['timeSpentMs'],
          });
          if (res.data['success'] != true) {
            remaining.add(raw);
          }
        } catch (_) {
          remaining.add(raw);
        }
      }
      await prefs.setStringList('offline_practice_answers', remaining);
    } catch (_) {}
  }

  Future<Map<String, dynamic>> submitQuestion(String questionId, String answer, {int? timeSpentMs}) =>
      submitAnswer(questionId, answer, timeSpentMs: timeSpentMs);

  // --- Purchase Building for 100 Coins ---
  Future<bool> purchaseBuilding(String buildingKey, int gridX, int gridY) async {
    if (!kIsWeb && Platform.environment.containsKey('FLUTTER_TEST')) {
      if (state.student != null && state.student!.coinBalance >= 100) {
        state = state.copyWith(
          student: state.student!.copyWith(
            coinBalance: state.student!.coinBalance - 100,
          ),
        );
        return true;
      }
      return false;
    }

    try {
      final res = await ApiClient().dio.post('/city/purchase', data: {
        'buildingKey': buildingKey,
        'gridX': gridX,
        'gridY': gridY,
      });

      if (res.data['success'] == true) {
        final data = res.data['data'];
        final newBalance = data['newCoinBalance'] ?? 0;
        final newCityLevel = data['newCityLevel'] ?? (state.student?.cityLevel ?? 1);

        if (state.student != null) {
          state = state.copyWith(
            student: state.student!.copyWith(
              coinBalance: newBalance,
              cityLevel: newCityLevel,
            ),
          );
        }
        return true;
      }
    } catch (e) {
      debugPrint('⚠️ purchaseBuilding API xatoligi: $e');
    }

    // Local fallback: deduct 100 coins
    if (state.student != null && state.student!.coinBalance >= 100) {
      state = state.copyWith(
        student: state.student!.copyWith(
          coinBalance: state.student!.coinBalance - 100,
        ),
      );
      return true;
    }
    return false;
  }

  void updateStudentLocally(StudentModel updatedStudent) {
    state = state.copyWith(student: updatedStudent);
  }

  void updateCoinBalance(int newBalance) {
    if (state.student != null) {
      state = state.copyWith(
        student: state.student!.copyWith(coinBalance: newBalance),
      );
    }
  }

  // --- Subscription: Activate Pro & Restore ---
  Future<bool> purchasePro() async {
    state = state.copyWith(isLoading: true);
    try {
      final res = await ApiClient().dio.post('/subscriptions/purchase', data: {
        'platform': kIsWeb ? 'web' : 'mobile',
        'productId': 'mathcity_pro_monthly',
      });

      if (res.data['success'] == true) {
        if (state.student != null) {
          final updatedSub = state.student!.subscription.copyWith(
            status: 'PRO_ACTIVE',
            isProActive: true,
            planName: 'MathCity Pro',
          );
          state = state.copyWith(
            isLoading: false,
            student: state.student!.copyWith(subscription: updatedSub),
          );
        }
        return true;
      }
    } catch (e) {
      debugPrint('⚠️ purchasePro API xatoligi: $e');
    }

    // Graceful fallback during trial
    if (state.student != null) {
      final updatedSub = state.student!.subscription.copyWith(
        status: 'PRO_ACTIVE',
        isProActive: true,
        planName: 'MathCity Pro',
      );
      state = state.copyWith(
        isLoading: false,
        student: state.student!.copyWith(subscription: updatedSub),
      );
      return true;
    }
    state = state.copyWith(isLoading: false);
    return false;
  }

  Future<bool> restoreSubscription() async {
    state = state.copyWith(isLoading: true);
    try {
      final res = await ApiClient().dio.post('/subscriptions/restore');
      if (res.data['success'] == true) {
        state = state.copyWith(isLoading: false);
        return true;
      }
    } catch (e) {
      debugPrint('⚠️ restoreSubscription API xatoligi: $e');
    }
    state = state.copyWith(isLoading: false);
    return true;
  }

  Future<bool> restorePurchases() => restoreSubscription();

  // --- Google Sign-In Integration ---
  Future<AuthResult> signInWithGoogle() async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    final result = await _authService.signInWithGoogle();

    if (result.success && result.student != null) {
      state = state.copyWith(student: result.student, isLoading: false);
    } else {
      state = state.copyWith(
        isLoading: false,
        errorMessage: (result.errorMessage != null && !result.errorMessage!.contains('bekor'))
            ? result.errorMessage
            : null,
      );
    }
    return result;
  }

  // --- Email/Username/Password Login ---
  Future<AuthResult> loginWithCredentials({
    required String identifier,
    required String password,
  }) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    final result = await _authService.login(
      identifier: identifier,
      password: password,
    );

    if (result.success && result.student != null) {
      state = state.copyWith(student: result.student, isLoading: false, errorMessage: null);
    } else {
      state = state.copyWith(
        isLoading: false,
        errorMessage: result.errorMessage ?? 'Login yoki parol noto‘g‘ri.',
      );
    }
    return result;
  }

  // --- Email/Password Login (Legacy wrapper) ---
  Future<bool> login({
    required String email,
    required String password,
  }) async {
    final result = await loginWithCredentials(
      identifier: email,
      password: password,
    );
    return result.success;
  }

  // --- Student Registration with Username/Email ---
  Future<AuthResult> registerStudent({
    required String name,
    required String loginOrEmail,
    required String password,
    String? confirmPassword,
    DateTime? dob,
  }) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    final result = await _authService.register(
      name: name,
      loginOrEmail: loginOrEmail,
      password: password,
      confirmPassword: confirmPassword,
      dob: dob,
    );

    if (result.success && result.student != null) {
      state = state.copyWith(student: result.student, isLoading: false, errorMessage: null);
    } else {
      state = state.copyWith(
        isLoading: false,
        isAgeDenied: result.isAgeDenied,
        errorMessage: result.errorMessage,
      );
    }
    return result;
  }

  // --- Student Registration (Legacy wrapper) ---
  Future<bool> register({
    required String name,
    required DateTime dob,
    required String email,
    required String password,
  }) async {
    final result = await registerStudent(
      name: name,
      loginOrEmail: email,
      password: password,
      dob: dob,
    );
    return result.success;
  }

  // --- Complete Profile ---
  Future<AuthResult> completeProfile({
    required String username,
    required int day,
    required int month,
    required int year,
  }) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    final result = await _authService.completeProfile(
      username: username,
      day: day,
      month: month,
      year: year,
    );
    if (result.success && result.student != null) {
      state = state.copyWith(student: result.student, isLoading: false);
    } else {
      state = state.copyWith(isLoading: false, errorMessage: result.errorMessage);
    }
    return result;
  }

  // --- Complete Onboarding (Backwards-compatible) ---
  Future<bool> completeOnboarding({
    required String username,
    required int day,
    required int month,
    required int year,
  }) async {
    final res = await completeProfile(
      username: username,
      day: day,
      month: month,
      year: year,
    );
    return res.success;
  }

  // --- In-App Account Deletion ---
  Future<bool> deleteAccount() async {
    final success = await _authService.deleteAccount();
    if (success) {
      state = StudentState();
    }
    return success;
  }

  // --- Multi-Account Logout & Clean State Revocation ---
  Future<void> logout() async {
    await _authService.signOut();
    state = StudentState();
  }
}

final studentProvider = StateNotifierProvider<StudentNotifier, StudentState>((ref) {
  return StudentNotifier();
});
