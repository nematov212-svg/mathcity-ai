import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../network/api_client.dart';
import '../../shared/providers/student_provider.dart';
import '../pricing/pricing_provider.dart';
import 'new_user_discount_dialog.dart';

/// PromoDialogController orchestrates new user promotional popups:
/// - Shown 1st time on entering home/dashboard.
/// - Automatically closes after 5 seconds.
/// - After 1st close, waits 10 seconds (cooldown).
/// - Shows 2nd time after 10s cooldown.
/// - Automatically closes 2nd popup after 5 seconds.
/// - Never shows again during the session (max 2 per session).
/// - Does not re-trigger on navigating back and forth in same session.
/// - App restart resets session counter to 0.
/// - Cancelled if user clicks "Chegirmani olish", buys Pro, or discount expires.
/// - Never shown during lessons/exercises.
/// - All timers and state cleanly managed without leaks.
class PromoDialogController {
  PromoDialogController._();
  static final PromoDialogController instance = PromoDialogController._();

  int _sessionShowCount = 0;
  bool _isDialogVisible = false;
  bool _isCancelled = false;
  bool _isInCooldown = false;
  bool _isLessonActive = false;

  Timer? _cooldownTimer;

  int get sessionShowCount => _sessionShowCount;
  bool get isDialogVisible => _isDialogVisible;
  bool get isCancelled => _isCancelled;
  bool get isInCooldown => _isInCooldown;
  bool get isLessonActive => _isLessonActive;

  /// Called when student starts a lesson or exercise to ensure NO interruption
  void onLessonStarted() {
    _isLessonActive = true;
    _cooldownTimer?.cancel();
    _cooldownTimer = null;
    _isInCooldown = false;
  }

  /// Called when student finishes or exits lesson
  void onLessonEnded() {
    _isLessonActive = false;
  }

  /// Called when user clicks "Chegirmani olish" or buys Pro
  void cancelPromoFlow() {
    _isCancelled = true;
    _cooldownTimer?.cancel();
    _cooldownTimer = null;
    _isInCooldown = false;
  }

  /// Reset session (for testing or fresh app session)
  void resetForTesting() {
    _sessionShowCount = 0;
    _isDialogVisible = false;
    _isCancelled = false;
    _isInCooldown = false;
    _isLessonActive = false;
    _cooldownTimer?.cancel();
    _cooldownTimer = null;
  }

  /// Main trigger on home/dashboard entry
  Future<void> onHomeEntered(BuildContext context, WidgetRef ref) async {
    if (_isCancelled) return;
    if (_sessionShowCount >= 2) return;
    if (_isDialogVisible) return;
    if (_isInCooldown) return;
    if (_isLessonActive) return;

    final student = ref.read(studentProvider).student;
    if (student?.subscription.isProActive == true || student?.isPro == true) {
      _isCancelled = true;
      return;
    }

    // Check discount validity
    final pricing = ref.read(pricingProvider).data;
    if (!pricing.hasActiveDiscount) {
      // Check API /promotions/new-user
      try {
        final res = await ApiClient().dio.get('/promotions/new-user');
        if (res.statusCode != 200 || res.data?['eligible'] != true) {
          _isCancelled = true;
          return;
        }
      } catch (_) {
        return;
      }
    }

    // Show 1st or 2nd time
    if (_sessionShowCount < 2) {
      await _showPromoDialog(context, ref);
    }
  }

  Future<void> _showPromoDialog(BuildContext context, WidgetRef ref) async {
    if (!context.mounted || _isDialogVisible || _isCancelled || _isLessonActive) {
      return;
    }

    _sessionShowCount++;
    _isDialogVisible = true;

    // Fetch freshest discount info
    DateTime expiresAt = DateTime.now().add(const Duration(hours: 24));
    int discountPercent = 30;
    int monthlyOriginal = 29000;
    int monthlyDiscounted = 20300;
    int yearlyOriginal = 250000;
    int yearlyDiscounted = 175000;

    try {
      final res = await ApiClient().dio.get('/promotions/new-user');
      if (res.statusCode == 200 && res.data != null) {
        final pData = res.data;
        if (pData['eligible'] != true) {
          _isDialogVisible = false;
          _isCancelled = true;
          return;
        }
        final expStr = pData['expiresAt'] as String?;
        if (expStr != null) {
          final exp = DateTime.tryParse(expStr);
          if (exp != null) expiresAt = exp;
        }
        discountPercent = (pData['discountPercent'] as num?)?.toInt() ?? 30;
        final prices = pData['prices'] as Map<String, dynamic>? ?? {};
        final m = prices['monthly'] as Map<String, dynamic>? ?? {};
        final y = prices['yearly'] as Map<String, dynamic>? ?? {};
        monthlyOriginal = (m['original'] as num?)?.toInt() ?? 29000;
        monthlyDiscounted = (m['discounted'] as num?)?.toInt() ?? 20300;
        yearlyOriginal = (y['original'] as num?)?.toInt() ?? 250000;
        yearlyDiscounted = (y['discounted'] as num?)?.toInt() ?? 175000;
      }
    } catch (_) {
      final pricing = ref.read(pricingProvider).data;
      if (pricing.discountEndsAt != null) {
        expiresAt = pricing.discountEndsAt!;
      }
    }

    if (!context.mounted) {
      _isDialogVisible = false;
      return;
    }

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

    // After 1st dialog closes, if sessionShowCount == 1 and not cancelled -> start 10s cooldown
    if (_sessionShowCount == 1 && !_isCancelled && !_isLessonActive) {
      _isInCooldown = true;
      _cooldownTimer?.cancel();
      _cooldownTimer = Timer(const Duration(seconds: 10), () {
        _isInCooldown = false;
        if (context.mounted &&
            !_isCancelled &&
            !_isLessonActive &&
            _sessionShowCount == 1) {
          _showPromoDialog(context, ref);
        }
      });
    }
  }

  void dispose() {
    _cooldownTimer?.cancel();
    _cooldownTimer = null;
  }
}
