import 'dart:async';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../network/api_client.dart';
import '../../shared/providers/student_provider.dart';
import 'announcement_popup.dart';
import 'urgent_announcement_dialog.dart';
import 'new_user_discount_dialog.dart';

/// Centralized PopupManager for MathCity AI
/// - Enforces strictly ONE popup visible at a time
/// - Priority 1: New User 30% Discount (if user <= 24 hours & not Pro & not used)
/// - Priority 2: Urgent Announcement (TOP-3 Competition)
/// - Minimum 10 seconds delay between consecutive popups
/// - Dashboard load delay: 1.5 seconds after skeleton disappears
class PopupManager {
  static bool _isPopupShowing = false;
  static DateTime? _lastPopupClosedAt;
  static bool _hasScheduledDashboardCheck = false;
  static Timer? _pollingTimer;

  static bool get isShowing => _isPopupShowing;

  /// Triggered 1.5 seconds after dashboard is loaded and rendered
  static void onDashboardLoaded(BuildContext context, WidgetRef ref) {
    if (_hasScheduledDashboardCheck) return;
    _hasScheduledDashboardCheck = true;

    Future.delayed(const Duration(milliseconds: 1500), () {
      _hasScheduledDashboardCheck = false;
      if (context.mounted) {
        checkAndShowPopups(context, ref);
      }
    });
  }

  /// Start background polling every 60 seconds
  static void startLivePolling(BuildContext context, WidgetRef ref) {
    _pollingTimer?.cancel();
    _pollingTimer = Timer.periodic(const Duration(seconds: 60), (_) {
      if (context.mounted) {
        checkAndShowPopups(context, ref);
      }
    });
  }

  static void stopLivePolling() {
    _pollingTimer?.cancel();
    _pollingTimer = null;
  }

  /// Core arbitration logic
  static Future<void> checkAndShowPopups(BuildContext context, WidgetRef ref) async {
    // 1. Check if a popup is already showing
    if (_isPopupShowing || !context.mounted) return;

    // 2. Enforce minimum 10s cooldown after previous popup close
    if (_lastPopupClosedAt != null) {
      final elapsed = DateTime.now().difference(_lastPopupClosedAt!);
      if (elapsed < const Duration(seconds: 10)) {
        return;
      }
    }

    final student = ref.read(studentProvider).student;
    final isPro = student?.isPro ?? false;

    // =========================================================================
    // PRIORITY 1: New User 30% Discount Popup (Only for new accounts within 24h)
    // =========================================================================
    if (!isPro) {
      try {
        final promoRes = await ApiClient().dio.get(
          '/promotions/new-user',
          options: Options(
            validateStatus: (status) => true,
            sendTimeout: const Duration(seconds: 4),
            receiveTimeout: const Duration(seconds: 4),
          ),
        );

        if (promoRes.statusCode == 200 && promoRes.data != null) {
          final pData = promoRes.data;
          final isEligible = pData['eligible'] == true;
          final expiresAtStr = pData['expiresAt'] as String?;

          if (isEligible && expiresAtStr != null && context.mounted) {
            final expiresAt = DateTime.tryParse(expiresAtStr);
            if (expiresAt != null && expiresAt.isAfter(DateTime.now())) {
              final prices = pData['prices'] as Map<String, dynamic>? ?? {};
              final monthly = prices['monthly'] as Map<String, dynamic>? ?? {};
              final yearly = prices['yearly'] as Map<String, dynamic>? ?? {};

              _isPopupShowing = true;
              await showDialog<void>(
                context: context,
                barrierDismissible: true,
                barrierColor: const Color(0x990A0618),
                builder: (ctx) => NewUserDiscountDialog(
                  expiresAt: expiresAt,
                  discountPercent: (pData['discountPercent'] as num?)?.toInt() ?? 30,
                  monthlyOriginalPrice: (monthly['original'] as num?)?.toInt() ?? 29000,
                  monthlyDiscountedPrice: (monthly['discounted'] as num?)?.toInt() ?? 20300,
                  yearlyOriginalPrice: (yearly['original'] as num?)?.toInt() ?? 250000,
                  yearlyDiscountedPrice: (yearly['discounted'] as num?)?.toInt() ?? 175000,
                  onDismiss: () {
                    _isPopupShowing = false;
                    _lastPopupClosedAt = DateTime.now();
                  },
                ),
              );
              _isPopupShowing = false;
              _lastPopupClosedAt = DateTime.now();
              return; // Shown Priority 1; do NOT show Priority 2 at the same time
            }
          }
        }
      } catch (_) {
        // Fallback gracefully
      }
    }

    if (!context.mounted || _isPopupShowing) return;

    // =========================================================================
    // PRIORITY 2: Urgent Announcement Popup (TOP-3 Competition)
    // =========================================================================
    try {
      final res = await ApiClient().dio.get(
        '/announcements/active',
        options: Options(
          validateStatus: (status) => true,
          sendTimeout: const Duration(seconds: 4),
          receiveTimeout: const Duration(seconds: 4),
        ),
      );

      if (res.statusCode == 200 && res.data != null && res.data['success'] == true) {
        final rawList = res.data['data'] as List? ?? [];
        if (rawList.isEmpty) return;

        final prefs = await SharedPreferences.getInstance();
        final nowMs = DateTime.now().millisecondsSinceEpoch;

        final urgentMap = rawList.cast<Map<String, dynamic>>().firstWhere(
              (m) {
                final type = (m['type'] ?? '').toString();
                final id = (m['id'] ?? '').toString();

                // 24 hour client-side check
                final dismissedUntil = prefs.getInt('dismissed_until_$id') ?? 0;
                if (nowMs < dismissedUntil) return false;

                return type == 'urgent' ||
                    type == 'URGENT_ANNOUNCEMENT' ||
                    type == 'ANNOUNCEMENT' ||
                    type == 'info';
              },
              orElse: () => {},
            );

        if (urgentMap.isNotEmpty && context.mounted) {
          final item = AnnouncementItem.fromJson(urgentMap);
          _isPopupShowing = true;
          await UrgentAnnouncementDialog.show(context, item);
          _isPopupShowing = false;
          _lastPopupClosedAt = DateTime.now();
        }
      }
    } catch (_) {
      // Fallback gracefully
    }
  }
}
