import 'dart:async';
import 'dart:io' show Platform;
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../network/api_client.dart';
import '../../shared/providers/student_provider.dart';
import '../pricing/pricing_provider.dart';
import 'new_user_discount_dialog.dart';

/// PromoDialogController orchestrates "Maxsus taklif • 30% chegirma" popups:
/// Rules:
/// 1. Discount strictly for new users within 7 days of registration (user.createdAt).
/// 2. If > 7 days or already Pro, popup never shows.
/// 3. App entry delay: shows 5 minutes after opening the app.
/// 4. Max 1 show per day.
/// 5. If user clicks "Keyinroq" (dismisses), will not show again for the rest of that day.
/// 6. Pricing & eligibility fetched authoritatively from server (/user/offer).
/// 7. Automatically suppressed during active lessons/exercises.

class PromoDialogController {
  PromoDialogController._();
  static final PromoDialogController instance = PromoDialogController._();

  int _sessionShowCount = 0;
  bool _isDialogVisible = false;
  bool _isCancelled = false;
  bool _isLessonActive = false;

  DateTime? _appLaunchTime;
  Timer? _launchDelayTimer;

  static Duration launchDelayDuration = const Duration(minutes: 5);

  int get sessionShowCount => _sessionShowCount;
  bool get isDialogVisible => _isDialogVisible;
  bool get isCancelled => _isCancelled;
  bool get isLessonActive => _isLessonActive;

  /// Called when student starts a lesson or exercise to ensure NO interruption
  void onLessonStarted() {
    _isLessonActive = true;
    _launchDelayTimer?.cancel();
    _launchDelayTimer = null;
  }

  /// Called when student finishes or exits lesson
  void onLessonEnded() {
    _isLessonActive = false;
  }

  /// Called when user clicks "Chegirmani olish" or buys Pro
  void cancelPromoFlow() {
    _isCancelled = true;
    _launchDelayTimer?.cancel();
    _launchDelayTimer = null;
  }

  /// Reset session (for testing or fresh app session)
  void resetForTesting() {
    _sessionShowCount = 0;
    _isDialogVisible = false;
    _isCancelled = false;
    _isLessonActive = false;
    _appLaunchTime = null;
    _launchDelayTimer?.cancel();
    _launchDelayTimer = null;
  }

  /// Main trigger on home/dashboard entry
  Future<void> onHomeEntered(BuildContext context, WidgetRef ref) async {
    if (_isCancelled) return;
    if (_sessionShowCount >= 1) return;
    if (_isDialogVisible) return;
    if (_isLessonActive) return;

    final student = ref.read(studentProvider).student;
    if (student?.subscription.isProActive == true || student?.isPro == true) {
      _isCancelled = true;
      return;
    }

    // Check SharedPreferences for daily frequency and "Keyinroq" dismiss
    try {
      final prefs = await SharedPreferences.getInstance();
      final todayStr = DateTime.now().toIso8601String().split('T').first;

      // Rule 6: Max 1 show per day
      final lastShown = prefs.getString('special_offer_last_shown_date');
      if (lastShown == todayStr) {
        return;
      }

      // Rule 6: If user clicked "Keyinroq", do not show again for the rest of today
      final dismissedToday = prefs.getString('special_offer_dismissed_date');
      if (dismissedToday == todayStr) {
        return;
      }
    } catch (_) {}

    // Check 5-minute launch delay
    final isTestEnv =
        !kIsWeb && Platform.environment.containsKey('FLUTTER_TEST');
    final requiredDelay = isTestEnv ? Duration.zero : launchDelayDuration;

    _appLaunchTime ??= DateTime.now();
    final elapsed = DateTime.now().difference(_appLaunchTime!);

    if (elapsed < requiredDelay) {
      final remaining = requiredDelay - elapsed;
      _launchDelayTimer?.cancel();
      _launchDelayTimer = Timer(remaining, () {
        if (context.mounted &&
            !_isCancelled &&
            !_isLessonActive &&
            _sessionShowCount < 1) {
          _showPromoDialog(context, ref);
        }
      });
      return;
    }

    await _showPromoDialog(context, ref);
  }

  Future<void> _showPromoDialog(BuildContext context, WidgetRef ref) async {
    if (!context.mounted ||
        _isDialogVisible ||
        _isCancelled ||
        _isLessonActive ||
        _sessionShowCount >= 1) {
      return;
    }

    final student = ref.read(studentProvider).student;
    if (student?.subscription.isProActive == true || student?.isPro == true) {
      _isCancelled = true;
      return;
    }

    // Check SharedPreferences again before rendering
    final todayStr = DateTime.now().toIso8601String().split('T').first;
    try {
      final prefs = await SharedPreferences.getInstance();
      if (prefs.getString('special_offer_last_shown_date') == todayStr) return;
      if (prefs.getString('special_offer_dismissed_date') == todayStr) return;
    } catch (_) {}

    // Fetch freshest authoritative offer data from server
    DateTime expiresAt = DateTime.now().add(const Duration(days: 7));
    int discountPercent = 30;
    int monthlyOriginal = 29000;
    int monthlyDiscounted = 20300;
    int yearlyOriginal = 250000;
    int yearlyDiscounted = 175000;

    try {
      final res = await ApiClient().dio.get(
            '/user/offer',
            options: Options(
              validateStatus: (status) => true,
              sendTimeout: const Duration(seconds: 4),
              receiveTimeout: const Duration(seconds: 4),
            ),
          );

      if (res.statusCode == 200 && res.data != null) {
        final pData = (res.data is Map<String, dynamic>)
            ? res.data as Map<String, dynamic>
            : (res.data['data'] as Map<String, dynamic>? ?? {});

        if (pData['eligible'] != true) {
          _isDialogVisible = false;
          _isCancelled = true;
          return;
        }

        final expStr = (pData['expiresAt'] ?? pData['discountEndsAt']) as String?;
        if (expStr != null) {
          final exp = DateTime.tryParse(expStr);
          if (exp != null) expiresAt = exp;
        }

        discountPercent = (pData['discountPercent'] as num?)?.toInt() ?? 30;
        monthlyOriginal =
            (pData['baseMonthlyPrice'] as num?)?.toInt() ?? 29000;
        monthlyDiscounted =
            (pData['monthlyPrice'] as num?)?.toInt() ?? 20300;
        yearlyOriginal =
            (pData['baseYearlyPrice'] as num?)?.toInt() ?? 250000;
        yearlyDiscounted =
            (pData['yearlyPrice'] as num?)?.toInt() ?? 175000;
      } else {
        // Fallback to pricing provider
        final pricing = ref.read(pricingProvider).data;
        if (!pricing.hasActiveDiscount) {
          _isCancelled = true;
          return;
        }
        if (pricing.discountEndsAt != null) {
          expiresAt = pricing.discountEndsAt!;
        }
      }
    } catch (_) {
      final pricing = ref.read(pricingProvider).data;
      if (!pricing.hasActiveDiscount) {
        return;
      }
      if (pricing.discountEndsAt != null) {
        expiresAt = pricing.discountEndsAt!;
      }
    }

    if (!context.mounted) {
      _isDialogVisible = false;
      return;
    }

    _sessionShowCount++;
    _isDialogVisible = true;

    // Mark as shown today in SharedPreferences
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('special_offer_last_shown_date', todayStr);
    } catch (_) {}

    await showDialog<void>(
      context: context,
      barrierDismissible: true,
      barrierColor: const Color(0x990A0618),
      builder: (dialogCtx) {
        return NewUserDiscountDialog(
          expiresAt: expiresAt,
          discountPercent: discountPercent,
          monthlyOriginalPrice: monthlyOriginal,
          monthlyDiscountedPrice: monthlyDiscounted,
          yearlyOriginalPrice: yearlyOriginal,
          yearlyDiscountedPrice: yearlyDiscounted,
          autoCloseDuration: const Duration(seconds: 5),
          onClaimWithPlan: (selectedPlan) {
            cancelPromoFlow();
            if (context.mounted) {
              final planParam = selectedPlan == 'yearly' ? 'yearly' : 'monthly';
              context.push('/kids/pro?plan=$planParam');
            }
          },
        );
      },
    );

    _isDialogVisible = false;
  }

  void dispose() {
    _launchDelayTimer?.cancel();
    _launchDelayTimer = null;
  }
}
