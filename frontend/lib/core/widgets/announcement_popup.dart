import 'dart:async';
import 'dart:io' show Platform;
import 'dart:ui' show ImageFilter;
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../network/api_client.dart';
import '../pricing/pricing_provider.dart';
import '../../shared/providers/student_provider.dart';

class AnnouncementButtonConfig {
  final String text;
  final String? color;
  final String? style;
  final String? action;
  final String? route;

  AnnouncementButtonConfig({
    required this.text,
    this.color,
    this.style,
    this.action,
    this.route,
  });

  factory AnnouncementButtonConfig.fromJson(Map<String, dynamic> json) {
    return AnnouncementButtonConfig(
      text: (json['text'] ?? '').toString(),
      color: json['color'] as String?,
      style: json['style'] as String?,
      action: json['action'] as String?,
      route: json['route'] as String?,
    );
  }
}

class AnnouncementDesign {
  final String layout; // popup, bottom_sheet, full_screen, top_banner
  final String? backgroundType;
  final String? backgroundValue;
  final String? textColor;
  final String? accentColor;
  final bool showTimer;
  final bool livePricing;
  final List<AnnouncementButtonConfig> buttons;

  AnnouncementDesign({
    this.layout = 'popup',
    this.backgroundType,
    this.backgroundValue,
    this.textColor,
    this.accentColor,
    this.showTimer = true,
    this.livePricing = true,
    this.buttons = const [],
  });

  factory AnnouncementDesign.fromJson(Map<String, dynamic> json) {
    final btns = (json['buttons'] as List?)
            ?.map((b) => AnnouncementButtonConfig.fromJson(b as Map<String, dynamic>))
            .toList() ??
        [];
    final bg = json['background'] as Map<String, dynamic>?;
    return AnnouncementDesign(
      layout: (json['layout'] ?? 'popup').toString(),
      backgroundType: bg?['type'] as String?,
      backgroundValue: bg?['value'] as String?,
      textColor: bg?['textColor'] as String?,
      accentColor: bg?['accentColor'] as String?,
      showTimer: json['showTimer'] != false,
      livePricing: json['livePricing'] != false,
      buttons: btns,
    );
  }
}

class AnnouncementItem {
  final String id;
  final String type; // urgent, special_offer, info, URGENT_ANNOUNCEMENT, SPECIAL_OFFER, ANNOUNCEMENT, AD
  final String title;
  final String text;
  final String? imageUrl;
  final String? buttonText;
  final String? buttonAction;
  final String? buttonRoute;
  final int delaySeconds;
  final int? autoCloseSeconds;
  final int priority;
  final String frequency; // once, every_open, once_per_day
  final String audience;
  final int? discountPercent;
  final int? discountPrice;
  final int? originalPrice;
  final AnnouncementDesign? design;

  AnnouncementItem({
    required this.id,
    required this.type,
    required this.title,
    required this.text,
    this.imageUrl,
    this.buttonText,
    this.buttonAction,
    this.buttonRoute,
    this.delaySeconds = 0,
    this.autoCloseSeconds,
    this.priority = 0,
    this.frequency = 'every_open',
    this.audience = 'all',
    this.discountPercent,
    this.discountPrice,
    this.originalPrice,
    this.design,
  });

  factory AnnouncementItem.fromJson(Map<String, dynamic> json) {
    final act = (json['buttonAction'] ?? json['buttonRoute']) as String?;
    final delay = (json['showDelaySeconds'] ?? json['delaySeconds'] as num?)?.toInt() ?? 0;
    return AnnouncementItem(
      id: (json['id'] ?? '').toString(),
      type: (json['type'] ?? 'ANNOUNCEMENT').toString(),
      title: (json['title'] ?? '').toString(),
      text: (json['text'] ?? '').toString(),
      imageUrl: json['imageUrl'] as String?,
      buttonText: json['buttonText'] as String?,
      buttonAction: act,
      buttonRoute: act,
      delaySeconds: delay,
      autoCloseSeconds: (json['autoCloseSeconds'] as num?)?.toInt(),
      priority: (json['priority'] as num?)?.toInt() ?? 0,
      frequency: (json['frequency'] ?? 'every_open').toString(),
      audience: (json['audience'] ?? 'all').toString(),
      discountPercent: (json['discountPercent'] as num?)?.toInt(),
      discountPrice: (json['discountPrice'] as num?)?.toInt(),
      originalPrice: (json['originalPrice'] as num?)?.toInt(),
      design: json['design'] != null
          ? AnnouncementDesign.fromJson(json['design'] as Map<String, dynamic>)
          : null,
    );
  }
}

class AnnouncementManager {
  static final Set<String> _dismissedAnnouncementIds = {};
  static bool _urgentShownThisSession = false;
  static bool _specialOfferScheduled = false;
  static Timer? _pollingTimer;
  static DateTime? _lastFailedCheckAt;

  static void markDismissed(String id) {
    _dismissedAnnouncementIds.add(id);
  }

  static void recordView(String id) {
    try {
      ApiClient().dio.post('/announcements/$id/view').ignore();
    } catch (_) {}
  }

  static void recordClick(String id) {
    try {
      ApiClient().dio.post('/announcements/$id/click').ignore();
    } catch (_) {}
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

  /// Call once when home screen is initialized, on app resume, or periodically.
  /// Backend endpoint: GET /api/announcements/active
  static Future<void> checkAndShowAnnouncements(BuildContext context, WidgetRef ref) async {
    if (!kIsWeb && Platform.environment.containsKey('FLUTTER_TEST')) return;
    if (_lastFailedCheckAt != null &&
        DateTime.now().difference(_lastFailedCheckAt!) < const Duration(minutes: 5)) {
      return;
    }
    try {
      dynamic responseData;

      try {
        final res = await ApiClient().dio.get(
          '/announcements/active',
          options: Options(
            validateStatus: (status) => true,
            sendTimeout: const Duration(seconds: 6),
            receiveTimeout: const Duration(seconds: 6),
          ),
        );
        if (res.statusCode == 200 && res.data != null) {
          responseData = res.data;
          _lastFailedCheckAt = null;
        } else {
          _lastFailedCheckAt = DateTime.now();
          if (kDebugMode) {
            debugPrint('ℹ️ [Announcements] Hozircha e‘lonlar yo‘q.');
          }
        }
      } catch (e) {
        _lastFailedCheckAt = DateTime.now();
        if (kDebugMode) {
          debugPrint('ℹ️ [Announcements] Hozircha e‘lonlar yo‘q.');
        }
      }

      if (responseData == null || responseData['success'] != true || responseData['data'] is! List) {
        return;
      }

      final rawList = responseData['data'] as List;
      final prefs = await SharedPreferences.getInstance();
      final todayStr = DateTime.now().toIso8601String().substring(0, 10);

      final announcements = rawList
          .map((e) => AnnouncementItem.fromJson(e as Map<String, dynamic>))
          .where((a) {
            if (_dismissedAnnouncementIds.contains(a.id)) return false;
            if (a.frequency == 'once') {
              final viewed = prefs.getBool('announcement_viewed_${a.id}') ?? false;
              if (viewed) return false;
            } else if (a.frequency == 'once_per_day') {
              final lastDate = prefs.getString('announcement_last_viewed_date_${a.id}');
              if (lastDate == todayStr) return false;
            }
            return true;
          })
          .toList();

      final meta = responseData['meta'] as Map<String, dynamic>? ?? {};
      final hasNewUserDiscount = meta['hasNewUserDiscount'] == true;

      // 1. Check Urgent Announcement (Show on open if not shown this session)
      if (!_urgentShownThisSession) {
        final urgentItem = announcements.cast<AnnouncementItem?>().firstWhere(
              (a) =>
                  a?.type == 'urgent' ||
                  a?.type == 'URGENT_ANNOUNCEMENT' ||
                  a?.type == 'ANNOUNCEMENT' ||
                  a?.type == 'info',
              orElse: () => null,
            );

        if (urgentItem != null && context.mounted) {
          _urgentShownThisSession = true;
          final delayMs = urgentItem.delaySeconds > 0 ? (urgentItem.delaySeconds * 1000) : 700;
          Future.delayed(Duration(milliseconds: delayMs), () async {
            if (context.mounted && !_dismissedAnnouncementIds.contains(urgentItem.id)) {
              if (urgentItem.frequency == 'once') {
                await prefs.setBool('announcement_viewed_${urgentItem.id}', true);
              } else if (urgentItem.frequency == 'once_per_day') {
                await prefs.setString('announcement_last_viewed_date_${urgentItem.id}', todayStr);
              }
              recordView(urgentItem.id);
              showUrgentAnnouncementDialog(context, urgentItem);
            }
          });
        }
      }

      // 2. Check Special Offer Announcement (Show after delay if user registered <= 7 days ago and not Pro)
      if (!_specialOfferScheduled && hasNewUserDiscount) {
        final student = ref.read(studentProvider).student;
        if (student != null && student.isPro) {
          return;
        }

        final specialOfferItem = announcements.cast<AnnouncementItem?>().firstWhere(
              (a) => a?.type == 'special_offer' || a?.type == 'SPECIAL_OFFER',
              orElse: () => null,
            );

        if (specialOfferItem != null) {
          final todayKey = 'offer_shown_$todayStr';
          final shownToday = prefs.getInt(todayKey) ?? 0;
          if (shownToday >= 3) return;

          _specialOfferScheduled = true;
          final delaySec = specialOfferItem.delaySeconds > 0 ? specialOfferItem.delaySeconds : 2;

          Timer(Duration(seconds: delaySec), () async {
            if (!context.mounted) return;
            if (_dismissedAnnouncementIds.contains(specialOfferItem.id)) return;
            final currentStudent = ref.read(studentProvider).student;
            if (currentStudent != null && currentStudent.isPro) return;

            if (specialOfferItem.frequency == 'once') {
              await prefs.setBool('announcement_viewed_${specialOfferItem.id}', true);
            } else if (specialOfferItem.frequency == 'once_per_day') {
              await prefs.setString('announcement_last_viewed_date_${specialOfferItem.id}', todayStr);
            }
            await prefs.setInt(todayKey, shownToday + 1);
            recordView(specialOfferItem.id);
            if (context.mounted) {
              showSpecialOfferDialog(context, specialOfferItem);
            }
          });
        }
      }
    } catch (_) {
      // Graceful fallback
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
    final autoCloseSec = widget.item.autoCloseSeconds ?? 6;

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
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 8, sigmaY: 8),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 420),
            child: Container(
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF1E1035), Color(0xFF130924)],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
                borderRadius: BorderRadius.circular(28),
                border: Border.all(color: const Color(0xFFEF4444).withOpacity(0.4), width: 1.5),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFFEF4444).withOpacity(0.3),
                    blurRadius: 32,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Stack(
                children: [
                  Padding(
                    padding: const EdgeInsets.fromLTRB(22, 22, 22, 20),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Badge
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFFEF4444), Color(0xFFDC2626)],
                            ),
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFFEF4444).withOpacity(0.4),
                                blurRadius: 10,
                              ),
                            ],
                          ),
                          child: const Text(
                            '🚨 SHOSHILINCH E‘LON',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w900,
                              color: Colors.white,
                              letterSpacing: 0.6,
                            ),
                          ),
                        ),
                        const SizedBox(height: 14),

                        // Title
                        Text(
                          widget.item.title,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                            height: 1.25,
                          ),
                        ),
                        const SizedBox(height: 10),

                        // Text
                        Text(
                          widget.item.text,
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                            color: Colors.white.withOpacity(0.85),
                            height: 1.4,
                          ),
                        ),
                        const SizedBox(height: 20),

                        // Action Button
                        SizedBox(
                          width: double.infinity,
                          height: 48,
                          child: Container(
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                colors: [Color(0xFFEF4444), Color(0xFFF97316)],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                              borderRadius: BorderRadius.circular(16),
                              boxShadow: [
                                BoxShadow(
                                  color: const Color(0xFFEF4444).withOpacity(0.35),
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
                                  HapticFeedback.lightImpact();
                                  AnnouncementManager.recordClick(widget.item.id);
                                  _dismissDialog();
                                  context.push(route);
                                },
                                child: Center(
                                  child: Text(
                                    widget.item.buttonText ?? 'Batafsil',
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      fontSize: 14,
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

                  // Close button
                  Positioned(
                    top: 10,
                    right: 10,
                    child: IconButton(
                      constraints: const BoxConstraints(minWidth: 44, minHeight: 44),
                      icon: const Icon(Icons.close_rounded, color: Colors.white60, size: 22),
                      onPressed: _dismissDialog,
                    ),
                  ),

                  // Auto close progress bar
                  Positioned(
                    left: 0,
                    right: 0,
                    bottom: 0,
                    child: ClipRRect(
                      borderRadius: const BorderRadius.vertical(bottom: Radius.circular(28)),
                      child: AnimatedBuilder(
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
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// ---------------------------------------------------------------------------
/// 2. MAXSUS TAKLIF POPUP DIALOG (30% DISCOUNT WITH MATHCITY MASCOT)
/// ---------------------------------------------------------------------------
void showSpecialOfferDialog(BuildContext context, AnnouncementItem item) {
  showDialog(
    context: context,
    barrierDismissible: true,
    builder: (ctx) => _SpecialOfferDialog(item: item),
  );
}

class _SpecialOfferDialog extends ConsumerStatefulWidget {
  final AnnouncementItem item;

  const _SpecialOfferDialog({required this.item});

  @override
  ConsumerState<_SpecialOfferDialog> createState() => _SpecialOfferDialogState();
}

class _SpecialOfferDialogState extends ConsumerState<_SpecialOfferDialog>
    with TickerProviderStateMixin {
  late AnimationController _springController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;

  late AnimationController _floatingController;
  late Animation<double> _floatingOffset;

  void _dismissDialog() {
    AnnouncementManager.markDismissed(widget.item.id);
    if (mounted) {
      Navigator.of(context, rootNavigator: true).pop();
    }
  }

  @override
  void initState() {
    super.initState();

    // 1. Spring entrance animation (scale + fade-in)
    _springController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 550),
    );
    _scaleAnimation = Tween<double>(begin: 0.78, end: 1.0).animate(
      CurvedAnimation(parent: _springController, curve: Curves.easeOutBack),
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _springController, curve: Curves.easeOut),
    );
    _springController.forward();

    // 2. Subtle floating animation for math symbols
    _floatingController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2200),
    )..repeat(reverse: true);
    _floatingOffset = Tween<double>(begin: -3.0, end: 4.0).animate(
      CurvedAnimation(parent: _floatingController, curve: Curves.easeInOutSine),
    );
  }

  @override
  void dispose() {
    _springController.dispose();
    _floatingController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Read live pricing data synchronized with authoritative server time
    final pricingState = ref.watch(pricingProvider);
    final pricing = pricingState.data;

    final route = widget.item.buttonRoute ?? '/kids/pro';
    final hasActiveDiscount = pricing.hasActiveDiscount;
    final discountPrice = hasActiveDiscount
        ? pricing.monthlyPlan.finalPrice
        : (widget.item.discountPrice ?? 20300);
    final originalPrice = pricing.monthlyPlan.basePrice > 0
        ? pricing.monthlyPlan.basePrice
        : (widget.item.originalPrice ?? 29000);
    final savings = originalPrice - discountPrice;

    // Remaining duration based on authoritative server clock offset
    final remaining = pricing.remainingDiscountDuration;
    final totalSec = remaining.inSeconds > 0 ? remaining.inSeconds : (6 * 86400 + 7200);

    final days = (totalSec ~/ 86400).toString().padLeft(2, '0');
    final hours = ((totalSec % 86400) ~/ 3600).toString().padLeft(2, '0');
    final mins = ((totalSec % 3600) ~/ 60).toString().padLeft(2, '0');
    final secs = (totalSec % 60).toString().padLeft(2, '0');

    return Dialog(
      backgroundColor: Colors.transparent,
      elevation: 0,
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: FadeTransition(
          opacity: _fadeAnimation,
          child: ScaleTransition(
            scale: _scaleAnimation,
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 420),
                child: Container(
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF1E0E38), Color(0xFF110724)],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                    ),
                    borderRadius: BorderRadius.circular(32),
                    border: Border.all(
                      color: const Color(0xFFFFD700).withOpacity(0.5),
                      width: 1.5,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF7C3AED).withOpacity(0.35),
                        blurRadius: 36,
                        spreadRadius: 2,
                        offset: const Offset(0, 10),
                      ),
                      BoxShadow(
                        color: const Color(0xFFFFD700).withOpacity(0.12),
                        blurRadius: 20,
                        spreadRadius: -4,
                      ),
                    ],
                  ),
                  child: Stack(
                    clipBehavior: Clip.none,
                    children: [
                      Padding(
                        padding: const EdgeInsets.fromLTRB(20, 24, 20, 22),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            // 1. MathCity Brand Mascot with Floating Math Symbols
                            _buildMascotSection(),
                            const SizedBox(height: 12),

                            // 2. Badge: -30% Chegirma
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [Color(0xFFFFD700), Color(0xFFF59E0B)],
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                ),
                                borderRadius: BorderRadius.circular(20),
                                boxShadow: [
                                  BoxShadow(
                                    color: const Color(0xFFFFD700).withOpacity(0.4),
                                    blurRadius: 12,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: const Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    '⚡ YANGI O‘QUVCHILARGA -30%',
                                    style: TextStyle(
                                      fontSize: 11.5,
                                      fontWeight: FontWeight.w900,
                                      color: Color(0xFF3B1700),
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 10),

                            // 3. Title & Subtitle
                            Text(
                              widget.item.title.isNotEmpty
                                  ? widget.item.title
                                  : 'MathCity PRO taklifi',
                              textAlign: TextAlign.center,
                              style: const TextStyle(
                                fontSize: 19,
                                fontWeight: FontWeight.w900,
                                color: Colors.white,
                                letterSpacing: 0.2,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              widget.item.text.isNotEmpty
                                  ? widget.item.text
                                  : 'Barcha cheksiz sun‘iy intellekt darslari va premium shaharni 30% tejab oching!',
                              textAlign: TextAlign.center,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 12.5,
                                fontWeight: FontWeight.w500,
                                color: Colors.white.withOpacity(0.8),
                                height: 1.3,
                              ),
                            ),
                            const SizedBox(height: 16),

                            // 4. Tabular Figures Countdown Box (Server Synchronized)
                            _buildCountdownBox(days, hours, mins, secs),
                            const SizedBox(height: 16),

                            // 5. Price Block with Strikethrough & Savings
                            _buildPriceBlock(originalPrice, discountPrice, savings),
                            const SizedBox(height: 18),

                            // 6. Primary Action CTA Button
                            SizedBox(
                              width: double.infinity,
                              height: 52,
                              child: Container(
                                decoration: BoxDecoration(
                                  gradient: const LinearGradient(
                                    colors: [Color(0xFF8B5CF6), Color(0xFF6366F1)],
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                  ),
                                  borderRadius: BorderRadius.circular(18),
                                  boxShadow: [
                                    BoxShadow(
                                      color: const Color(0xFF8B5CF6).withOpacity(0.45),
                                      blurRadius: 18,
                                      offset: const Offset(0, 6),
                                    ),
                                  ],
                                ),
                                child: Material(
                                  color: Colors.transparent,
                                  child: InkWell(
                                    borderRadius: BorderRadius.circular(18),
                                    onTap: () {
                                      HapticFeedback.mediumImpact();
                                      AnnouncementManager.recordClick(widget.item.id);
                                      _dismissDialog();
                                      context.push(route);
                                    },
                                    child: Center(
                                      child: Row(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: [
                                          const Icon(Icons.stars_rounded, color: Color(0xFFFFD700), size: 20),
                                          const SizedBox(width: 8),
                                          Text(
                                            widget.item.buttonText ?? 'PRO sotib olish',
                                            style: const TextStyle(
                                              fontSize: 15.5,
                                              fontWeight: FontWeight.w900,
                                              color: Colors.white,
                                              letterSpacing: 0.3,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Accessible Top Right Close Button (Touch target >= 44x44px)
                      Positioned(
                        top: 10,
                        right: 10,
                        child: Material(
                          color: Colors.transparent,
                          child: InkWell(
                            borderRadius: BorderRadius.circular(22),
                            onTap: () {
                              HapticFeedback.lightImpact();
                              _dismissDialog();
                            },
                            child: Container(
                              width: 44,
                              height: 44,
                              alignment: Alignment.center,
                              child: Container(
                                width: 28,
                                height: 28,
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.12),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  Icons.close_rounded,
                                  color: Colors.white70,
                                  size: 18,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  /// MathCity Mascot with subtle floating math symbols
  Widget _buildMascotSection() {
    return AnimatedBuilder(
      animation: _floatingOffset,
      builder: (context, child) {
        return SizedBox(
          height: 84,
          child: Stack(
            alignment: Alignment.center,
            children: [
              // Floating Math Symbols around the mascot
              Positioned(
                left: 60,
                top: 8 + _floatingOffset.value,
                child: _buildFloatingSymbol('+', const Color(0xFF60A5FA), 16),
              ),
              Positioned(
                right: 64,
                top: 4 - _floatingOffset.value,
                child: _buildFloatingSymbol('×', const Color(0xFFF472B6), 18),
              ),
              Positioned(
                left: 88,
                bottom: 4 - _floatingOffset.value * 0.7,
                child: _buildFloatingSymbol('√', const Color(0xFF34D399), 16),
              ),
              Positioned(
                right: 88,
                bottom: 6 + _floatingOffset.value * 0.7,
                child: _buildFloatingSymbol('π', const Color(0xFFFBBF24), 16),
              ),

              // Glowing Circle Avatar containing the MathCity Logo Mascot
              Container(
                width: 74,
                height: 74,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: const RadialGradient(
                    colors: [Color(0xFF4C1D95), Color(0xFF2E1065)],
                  ),
                  border: Border.all(
                    color: const Color(0xFFFFD700).withOpacity(0.6),
                    width: 2,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF8B5CF6).withOpacity(0.4),
                      blurRadius: 18,
                      spreadRadius: 2,
                    ),
                  ],
                ),
                padding: const EdgeInsets.all(8),
                child: ClipOval(
                  child: Image.asset(
                    'assets/images/mathcity_logo.png',
                    fit: BoxFit.contain,
                    errorBuilder: (context, error, stackTrace) {
                      return const Center(
                        child: Text('🎓', style: TextStyle(fontSize: 32)),
                      );
                    },
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildFloatingSymbol(String symbol, Color color, double size) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: color.withOpacity(0.18),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.4), width: 1),
      ),
      child: Text(
        symbol,
        style: TextStyle(
          color: color,
          fontSize: size,
          fontWeight: FontWeight.w900,
        ),
      ),
    );
  }

  /// Clean Tabular Figure Countdown with separate tiles
  Widget _buildCountdownBox(String days, String hours, String mins, String secs) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 10),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.32),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Colors.white.withOpacity(0.12)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.timer_outlined, size: 14, color: Colors.white.withOpacity(0.7)),
              const SizedBox(width: 5),
              Text(
                'Taklif tugashiga qoldi:',
                style: TextStyle(
                  fontSize: 11.5,
                  fontWeight: FontWeight.w700,
                  color: Colors.white.withOpacity(0.75),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _buildTimeTile(days, 'kun'),
              _buildTimeSeparator(),
              _buildTimeTile(hours, 'soat'),
              _buildTimeSeparator(),
              _buildTimeTile(mins, 'daq'),
              _buildTimeSeparator(),
              _buildTimeTile(secs, 'son'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTimeTile(String value, String label) {
    return Column(
      children: [
        Container(
          constraints: const BoxConstraints(minWidth: 44),
          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
          decoration: BoxDecoration(
            color: const Color(0xFF28144E),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: const Color(0xFFFFD700).withOpacity(0.35)),
          ),
          child: Text(
            value,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.w900,
              color: Color(0xFFFFD700),
              fontFeatures: [FontFeature.tabularFigures()],
            ),
          ),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: TextStyle(
            fontSize: 9.5,
            fontWeight: FontWeight.w600,
            color: Colors.white.withOpacity(0.6),
          ),
        ),
      ],
    );
  }

  Widget _buildTimeSeparator() {
    return const Padding(
      padding: EdgeInsets.symmetric(horizontal: 4, vertical: 8),
      child: Text(
        ':',
        style: TextStyle(
          color: Color(0xFFFFD700),
          fontSize: 16,
          fontWeight: FontWeight.w900,
        ),
      ),
    );
  }

  /// Price Block with original strikethrough, large discounted amount and savings
  Widget _buildPriceBlock(int original, int discounted, int savings) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.baseline,
          textBaseline: TextBaseline.alphabetic,
          children: [
            Text(
              '$original so‘m',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: Colors.white.withOpacity(0.5),
                decoration: TextDecoration.lineThrough,
                decorationColor: const Color(0xFFEF4444),
                decorationThickness: 2.2,
              ),
            ),
            const SizedBox(width: 10),
            Text(
              '$discounted so‘m',
              style: const TextStyle(
                fontSize: 26,
                fontWeight: FontWeight.w900,
                color: Color(0xFFFFD700),
                letterSpacing: -0.5,
              ),
            ),
            const SizedBox(width: 4),
            Text(
              '/oy',
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: Colors.white.withOpacity(0.7),
              ),
            ),
          ],
        ),
        if (savings > 0) ...[
          const SizedBox(height: 4),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
            decoration: BoxDecoration(
              color: const Color(0xFF10B981).withOpacity(0.15),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF10B981).withOpacity(0.4)),
            ),
            child: Text(
              'Siz $savings so‘m tejaysiz • Faqat 1-to‘lov uchun',
              style: const TextStyle(
                fontSize: 10.5,
                fontWeight: FontWeight.w700,
                color: Color(0xFF6EE7B7),
              ),
            ),
          ),
        ],
      ],
    );
  }
}
