import 'dart:async';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../network/api_client.dart';
import '../../shared/providers/student_provider.dart';
import 'announcement_popup.dart';
import 'urgent_announcement_dialog.dart';
import 'promo_dialog_controller.dart';

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
  static Timer? _dashboardTimer;

  static bool get isShowing => _isPopupShowing;

  /// Triggered 1.5 seconds after dashboard is loaded and rendered
  static void onDashboardLoaded(BuildContext context, WidgetRef ref) {
    if (_hasScheduledDashboardCheck) return;
    _hasScheduledDashboardCheck = true;

    _dashboardTimer?.cancel();
    _dashboardTimer = Timer(const Duration(milliseconds: 1500), () {
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
    _dashboardTimer?.cancel();
    _dashboardTimer = null;
    _hasScheduledDashboardCheck = false;
  }

  /// Core arbitration logic
  static Future<void> checkAndShowPopups(
      BuildContext context, WidgetRef ref) async {
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
    // PRIORITY 1: New User 30% Discount Popup (Controlled by PromoDialogController)
    // =========================================================================
    if (!isPro &&
        PromoDialogController.instance.sessionShowCount < 1 &&
        !PromoDialogController.instance.isCancelled) {
      _isPopupShowing = true;
      await PromoDialogController.instance.onHomeEntered(context, ref);
      _isPopupShowing = false;
      _lastPopupClosedAt = DateTime.now();
      return;
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

      if (res.statusCode == 200 &&
          res.data != null &&
          res.data['success'] == true) {
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
