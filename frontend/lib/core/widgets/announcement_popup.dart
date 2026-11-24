import 'dart:async';
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../network/api_client.dart';
import '../widgets/coin_icon.dart';
import '../../shared/providers/student_provider.dart';

class AnnouncementItem {
  final String id;
  final String type; // URGENT_ANNOUNCEMENT, SPECIAL_OFFER, ANNOUNCEMENT, AD
  final String title;
  final String text;
  final String? imageUrl;
  final String? buttonText;
  final String? buttonRoute;
  final int delaySeconds;
  final int? autoCloseSeconds;
  final int? discountPercent;
  final int? discountPrice;
  final int? originalPrice;

  AnnouncementItem({
    required this.id,
    required this.type,
    required this.title,
    required this.text,
    this.imageUrl,
    this.buttonText,
    this.buttonRoute,
    this.delaySeconds = 0,
    this.autoCloseSeconds,
    this.discountPercent,
    this.discountPrice,
    this.originalPrice,
  });

  factory AnnouncementItem.fromJson(Map<String, dynamic> json) {
    return AnnouncementItem(
      id: (json['id'] ?? '').toString(),
      type: (json['type'] ?? 'ANNOUNCEMENT').toString(),
      title: (json['title'] ?? '').toString(),
      text: (json['text'] ?? '').toString(),
      imageUrl: json['imageUrl'] as String?,
      buttonText: json['buttonText'] as String?,
      buttonRoute: json['buttonRoute'] as String?,
      delaySeconds: (json['delaySeconds'] as num?)?.toInt() ?? 0,
      autoCloseSeconds: (json['autoCloseSeconds'] as num?)?.toInt(),
      discountPercent: (json['discountPercent'] as num?)?.toInt(),
      discountPrice: (json['discountPrice'] as num?)?.toInt(),
      originalPrice: (json['originalPrice'] as num?)?.toInt(),
    );
  }
}

class AnnouncementManager {
  static final Set<String> _dismissedAnnouncementIds = {};
  static bool _urgentShownThisSession = false;
  static bool _specialOfferScheduled = false;
  static Timer? _pollingTimer;

  static void markDismissed(String id) {
    _dismissedAnnouncementIds.add(id);
  }

  static void startLivePolling(BuildContext context, WidgetRef ref) {
    _pollingTimer?.cancel();
    _pollingTimer = Timer.periodic(const Duration(seconds: 60), (_) {
      if (context.mounted) {
        checkAndShowAnnouncements(context, ref);
      }
    });
  }

  static void stopLivePolling() {
    _pollingTimer?.cancel();
    _pollingTimer = null;
  }

  /// Call once when home screen is initialized, on app resume, or every 60s
  static Future<void> checkAndShowAnnouncements(BuildContext context, WidgetRef ref) async {
    if (!kIsWeb && Platform.environment.containsKey('FLUTTER_TEST')) return;
    try {
      final res = await ApiClient().dio.get('/announcements/active');
      if (res.statusCode != 200 || res.data == null) return;

      final data = res.data;
      if (data['success'] != true || data['data'] is! List) return;

      final rawList = data['data'] as List;
      final announcements = rawList
          .map((e) => AnnouncementItem.fromJson(e))
          .where((a) => !_dismissedAnnouncementIds.contains(a.id))
          .toList();

      final meta = data['meta'] as Map<String, dynamic>? ?? {};
      final hasNewUserDiscount = meta['hasNewUserDiscount'] == true;

      // 1. Check Urgent Announcement (Show on open if not shown this session)
      if (!_urgentShownThisSession) {
        final urgentItem = announcements.cast<AnnouncementItem?>().firstWhere(
              (a) => a?.type == 'URGENT_ANNOUNCEMENT' || a?.type == 'ANNOUNCEMENT',
              orElse: () => null,
            );

        if (urgentItem != null && context.mounted) {
          _urgentShownThisSession = true;
          // Show with small delay so the initial screen renders smoothly
          final delayMs = urgentItem.delaySeconds > 0 ? (urgentItem.delaySeconds * 1000) : 700;
          Future.delayed(Duration(milliseconds: delayMs), () {
            if (context.mounted && !_dismissedAnnouncementIds.contains(urgentItem.id)) {
              showUrgentAnnouncementDialog(context, urgentItem);
            }
          });
        }
      }

      // 2. Check Special Offer Announcement (Show after delay if user registered <= 7 days ago and not Pro)
      if (!_specialOfferScheduled && hasNewUserDiscount) {
        final student = ref.read(studentProvider).student;
        if (student != null && student.isPro) {
          return; // Already pro, do not show discount popup
        }

        final specialOfferItem = announcements.cast<AnnouncementItem?>().firstWhere(
              (a) => a?.type == 'SPECIAL_OFFER',
              orElse: () => null,
            );

        if (specialOfferItem != null) {
          // Check daily frequency limit (max 2 times per day)
          final prefs = await SharedPreferences.getInstance();
          final todayKey = 'offer_shown_${DateTime.now().toIso8601String().substring(0, 10)}';
          final shownToday = prefs.getInt(todayKey) ?? 0;
          if (shownToday >= 2) return;

          _specialOfferScheduled = true;
          final delaySec = specialOfferItem.delaySeconds > 0 ? specialOfferItem.delaySeconds : 300; // default 5 min

          Timer(Duration(seconds: delaySec), () async {
            if (!context.mounted) return;
            if (_dismissedAnnouncementIds.contains(specialOfferItem.id)) return;
            final currentStudent = ref.read(studentProvider).student;
            if (currentStudent != null && currentStudent.isPro) return;

            await prefs.setInt(todayKey, shownToday + 1);
            if (context.mounted) {
              showSpecialOfferDialog(context, specialOfferItem);
            }
          });
        }
      }
    } catch (e) {
      debugPrint('AnnouncementManager error: $e');
    }
  }
}

/// ---------------------------------------------------------------------------
/// 1. SHOSHILINCH E'LON POPUP DIALOG
/// ---------------------------------------------------------------------------
void showUrgentAnnouncementDialog(BuildContext context, AnnouncementItem item) {
  showDialog(
    context: context,
    barrierDismissible: true,
    builder: (ctx) => _UrgentAnnouncementDialog(item: item),
  );
}

class _UrgentAnnouncementDialog extends StatefulWidget {
  final AnnouncementItem item;

  const _UrgentAnnouncementDialog({required this.item});

  @override
  State<_UrgentAnnouncementDialog> createState() => _UrgentAnnouncementDialogState();
}

class _UrgentAnnouncementDialogState extends State<_UrgentAnnouncementDialog>
    with SingleTickerProviderStateMixin {
  late AnimationController _progressController;
  Timer? _autoCloseTimer;

  void _dismissDialog() {
    AnnouncementManager.markDismissed(widget.item.id);
    if (mounted) {
      Navigator.of(context, rootNavigator: true).pop();
    }
  }

  @override
  void initState() {
    super.initState();
    final autoCloseSec = widget.item.autoCloseSeconds ?? 5;

    _progressController = AnimationController(
      vsync: this,
      duration: Duration(seconds: autoCloseSec),
    );

    _progressController.forward();

    _autoCloseTimer = Timer(Duration(seconds: autoCloseSec), () {
      _dismissDialog();
    });
  }

  @override
  void dispose() {
    _autoCloseTimer?.cancel();
    _progressController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final route = widget.item.buttonRoute ?? '/kids/leaderboard';

    return Dialog(
      backgroundColor: Colors.transparent,
      elevation: 0,
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 420),
          child: Container(
            decoration: BoxDecoration(
              color: const Color(0xFF1E143E),
              borderRadius: BorderRadius.circular(28),
              border: Border.all(color: const Color(0xFFE53935).withOpacity(0.6), width: 1.5),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFFE53935).withOpacity(0.35),
                  blurRadius: 36,
                  offset: const Offset(0, 12),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(28),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Header Bar with Red Badge and Close Button
                  Padding(
                    padding: const EdgeInsets.fromLTRB(20, 16, 14, 8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEF4444),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text('🚨', style: TextStyle(fontSize: 12)),
                              SizedBox(width: 4),
                              Text(
                                'SHOSHILINCH E‘LON',
                                style: TextStyle(
                                  fontSize: 10.5,
                                  fontWeight: FontWeight.w900,
                                  color: Colors.white,
                                  letterSpacing: 0.5,
                                ),
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close_rounded, color: Colors.white70, size: 22),
                          onPressed: _dismissDialog,
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(),
                        ),
                      ],
                    ),
                  ),

                  // Main Content
                  Padding(
                    padding: const EdgeInsets.fromLTRB(20, 4, 20, 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        const SizedBox(height: 4),
                        const Text('🏆', style: TextStyle(fontSize: 44)),
                        const SizedBox(height: 8),
                        Text(
                          widget.item.text,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                            height: 1.35,
                          ),
                        ),
                        const SizedBox(height: 16),

                        // 3 Prize Cards (500, 250, 150)
                        Row(
                          children: [
                            _buildUrgentPrizeCard('1-o‘rin', '500', const Color(0xFFFFD700), '🥇'),
                            const SizedBox(width: 8),
                            _buildUrgentPrizeCard('2-o‘rin', '250', const Color(0xFFFF9800), '🥈'),
                            const SizedBox(width: 8),
                            _buildUrgentPrizeCard('3-o‘rin', '150', const Color(0xFFB0BEC5), '🥉'),
                          ],
                        ),

                        const SizedBox(height: 18),

                        // Action Button
                        SizedBox(
                          width: double.infinity,
                          height: 48,
                          child: Container(
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                colors: [Color(0xFFE53935), Color(0xFFFF7043)],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                              borderRadius: BorderRadius.circular(16),
                              boxShadow: [
                                BoxShadow(
                                  color: const Color(0xFFE53935).withOpacity(0.4),
                                  blurRadius: 14,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: Material(
                              color: Colors.transparent,
                              child: InkWell(
                                borderRadius: BorderRadius.circular(16),
                                onTap: () {
                                  _dismissDialog();
                                  context.push(route);
                                },
                                child: Center(
                                  child: Text(
                                    widget.item.buttonText ?? '1-o‘rinni egallash uchun harakat',
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      fontSize: 13.5,
                                      fontWeight: FontWeight.w900,
                                      color: Colors.white,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  // 5-second Progress Bar Auto-close indicator
                  AnimatedBuilder(
                    animation: _progressController,
                    builder: (context, child) {
                      return LinearProgressIndicator(
                        value: 1.0 - _progressController.value,
                        backgroundColor: Colors.white.withOpacity(0.08),
                        valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFFEF4444)),
                        minHeight: 4,
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildUrgentPrizeCard(String rank, String coins, Color accent, String badge) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
        decoration: BoxDecoration(
          color: accent.withOpacity(0.12),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: accent.withOpacity(0.4), width: 1.2),
        ),
        child: Column(
          children: [
            Text(badge, style: const TextStyle(fontSize: 18)),
            const SizedBox(height: 2),
            Text(
              rank,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w800,
                color: accent,
              ),
            ),
            const SizedBox(height: 4),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const CoinIcon(size: 13),
                const SizedBox(width: 4),
                Text(
                  coins,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

/// ---------------------------------------------------------------------------
/// 2. MAXSUS TAKLIF POPUP DIALOG (30% DISCOUNT)
/// ---------------------------------------------------------------------------
void showSpecialOfferDialog(BuildContext context, AnnouncementItem item) {
  showDialog(
    context: context,
    barrierDismissible: true,
    builder: (ctx) => _SpecialOfferDialog(item: item),
  );
}

class _SpecialOfferDialog extends StatefulWidget {
  final AnnouncementItem item;

  const _SpecialOfferDialog({required this.item});

  @override
  State<_SpecialOfferDialog> createState() => _SpecialOfferDialogState();
}

class _SpecialOfferDialogState extends State<_SpecialOfferDialog> {
  Timer? _timer;
  late int _remainingSeconds;

  void _dismissDialog() {
    AnnouncementManager.markDismissed(widget.item.id);
    if (mounted) {
      Navigator.of(context, rootNavigator: true).pop();
    }
  }

  @override
  void initState() {
    super.initState();
    // Default 7 days (604800 seconds) countdown or remaining time from registration
    _remainingSeconds = 7 * 24 * 3600 - 1800; // Simulated active countdown
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (mounted) {
        setState(() {
          if (_remainingSeconds > 0) _remainingSeconds--;
        });
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  String _formatTimer(int totalSec) {
    final days = totalSec ~/ 86400;
    final hours = (totalSec % 86400) ~/ 3600;
    final mins = (totalSec % 3600) ~/ 60;
    final secs = totalSec % 60;
    return '${days.toString().padLeft(2, '0')} : ${hours.toString().padLeft(2, '0')} : ${mins.toString().padLeft(2, '0')} : ${secs.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    final route = widget.item.buttonRoute ?? '/kids/pro';
    final discountPrice = widget.item.discountPrice ?? 20300;
    final originalPrice = widget.item.originalPrice ?? 29000;

    return Dialog(
      backgroundColor: Colors.transparent,
      elevation: 0,
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 420),
          child: Container(
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF261245), Color(0xFF16092E)],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
              borderRadius: BorderRadius.circular(30),
              border: Border.all(color: const Color(0xFFFFD700).withOpacity(0.55), width: 1.5),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF8B5CF6).withOpacity(0.4),
                  blurRadius: 36,
                  offset: const Offset(0, 12),
                ),
              ],
            ),
            child: Stack(
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(22, 22, 22, 24),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Top Badges
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                colors: [Color(0xFFFFD700), Color(0xFFFFA000)],
                              ),
                              borderRadius: BorderRadius.circular(20),
                              boxShadow: [
                                BoxShadow(
                                  color: const Color(0xFFFFD700).withOpacity(0.35),
                                  blurRadius: 10,
                                ),
                              ],
                            ),
                            child: const Text(
                              '⚡ MAXSUS TAKLIF',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFF451A03),
                                letterSpacing: 0.5,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.12),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: const Text(
                              'MathCity AI dan',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: Colors.white70,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),

                      // Mascot & 30% Discount Badge Ticket
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        decoration: BoxDecoration(
                          color: const Color(0xFF3B1D6B),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xFF8B5CF6).withOpacity(0.5)),
                        ),
                        child: Row(
                          children: [
                            const Text('🤖', style: TextStyle(fontSize: 36)),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'MATHCITY PRO · 30% CHEGIRMA',
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w900,
                                      color: Color(0xFFFFD700),
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    widget.item.text,
                                    style: const TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.white,
                                      height: 1.25,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Countdown Timer Card
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 14),
                        decoration: BoxDecoration(
                          color: Colors.black.withOpacity(0.25),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: Colors.white.withOpacity(0.1)),
                        ),
                        child: Column(
                          children: [
                            const Text(
                              'Taklif tugashiga:',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFFCBD5E1),
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              _formatTimer(_remainingSeconds),
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFFFFD700),
                                fontFamily: 'monospace',
                                letterSpacing: 2.0,
                              ),
                            ),
                            const SizedBox(height: 2),
                            const Text(
                              'kun : soat : daqiqa : soniya',
                              style: TextStyle(
                                fontSize: 9.5,
                                color: Colors.white54,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Price Strikethrough & Discount Tag
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.baseline,
                        textBaseline: TextBaseline.alphabetic,
                        children: [
                          Text(
                            '$originalPrice so‘m',
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: Colors.white54,
                              decoration: TextDecoration.lineThrough,
                              decorationColor: Colors.redAccent,
                              decorationThickness: 2,
                            ),
                          ),
                          const SizedBox(width: 10),
                          Text(
                            '$discountPrice so‘m',
                            style: const TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFFFFD700),
                            ),
                          ),
                          const SizedBox(width: 4),
                          const Text(
                            '/oy',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: Colors.white70,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 18),

                      // CTA Button
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFF7C3AED), Color(0xFF6366F1)],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            borderRadius: BorderRadius.circular(16),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFF7C3AED).withOpacity(0.45),
                                blurRadius: 18,
                                offset: const Offset(0, 6),
                              ),
                            ],
                          ),
                          child: Material(
                            color: Colors.transparent,
                            child: InkWell(
                              borderRadius: BorderRadius.circular(16),
                              onTap: () {
                                _dismissDialog();
                                context.push(route);
                              },
                              child: Center(
                                child: Text(
                                  widget.item.buttonText ?? 'PRO sotib olish',
                                  style: const TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w900,
                                    color: Colors.white,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                // Top Right Close Button
                Positioned(
                  top: 12,
                  right: 12,
                  child: IconButton(
                    icon: const Icon(Icons.close_rounded, color: Colors.white60, size: 22),
                    onPressed: _dismissDialog,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
