import 'dart:async';
import 'dart:ui' show ImageFilter;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../network/api_client.dart';
import 'announcement_popup.dart';

/// Professional Animated Urgent Announcement Dialog
/// High-contrast Dark Purple (#1A1030) + Thin Purple Border (#5B3FA8)
/// Podium-style Rewards Cards (Gold, Silver, Bronze)
/// Dynamic Progress & Shine/Pulse CTA
class UrgentAnnouncementDialog extends StatefulWidget {
  final AnnouncementItem item;
  final VoidCallback? onDismiss;

  const UrgentAnnouncementDialog({
    super.key,
    required this.item,
    this.onDismiss,
  });

  static Future<void> show(BuildContext context, AnnouncementItem item) {
    return showDialog<void>(
      context: context,
      barrierDismissible: true,
      barrierColor: const Color(0x990A0618),
      builder: (ctx) => UrgentAnnouncementDialog(item: item),
    );
  }

  @override
  State<UrgentAnnouncementDialog> createState() => _UrgentAnnouncementDialogState();
}

class _UrgentAnnouncementDialogState extends State<UrgentAnnouncementDialog>
    with TickerProviderStateMixin {
  late AnimationController _entranceController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;

  late AnimationController _floatingController;
  late Animation<double> _floatingAnimation;

  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  late AnimationController _shineController;

  bool _isClosing = false;

  @override
  void initState() {
    super.initState();

    // 1. Entrance animation (scale 0.9 -> 1.0, fade 0 -> 1)
    _entranceController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 380),
    );
    _scaleAnimation = Tween<double>(begin: 0.90, end: 1.0).animate(
      CurvedAnimation(parent: _entranceController, curve: Curves.easeOutBack),
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _entranceController, curve: Curves.easeOut),
    );
    _entranceController.forward();

    // 2. Slow floating animation for trophy/medal (2.5s loop)
    _floatingController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2500),
    )..repeat(reverse: true);
    _floatingAnimation = Tween<double>(begin: -3.5, end: 3.5).animate(
      CurvedAnimation(parent: _floatingController, curve: Curves.easeInOutSine),
    );

    // 3. Subtle CTA pulse animation (scale 1.0 <-> 1.035)
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..repeat(reverse: true);
    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.035).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );

    // 4. Shine sweep line across button every ~3 seconds
    _shineController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 3000),
    )..repeat();
  }

  @override
  void dispose() {
    _entranceController.dispose();
    _floatingController.dispose();
    _pulseController.dispose();
    _shineController.dispose();
    super.dispose();
  }

  Future<void> _handleDismiss() async {
    if (_isClosing) return;
    _isClosing = true;

    // Record dismissal on server & shared_preferences for 24 hours
    try {
      ApiClient().dio.post('/announcements/${widget.item.id}/dismiss').ignore();
      final prefs = await SharedPreferences.getInstance();
      final expiryMs = DateTime.now().add(const Duration(hours: 24)).millisecondsSinceEpoch;
      await prefs.setInt('dismissed_until_${widget.item.id}', expiryMs);
      await prefs.setString(
        'announcement_last_viewed_date_${widget.item.id}',
        DateTime.now().toIso8601String().substring(0, 10),
      );
    } catch (_) {}

    AnnouncementManager.markDismissed(widget.item.id);
    widget.onDismiss?.call();

    if (mounted) {
      await _entranceController.reverse();
      if (mounted) {
        Navigator.of(context, rootNavigator: true).pop();
      }
    }
  }

  void _handleAction() {
    HapticFeedback.mediumImpact();
    AnnouncementManager.recordClick(widget.item.id);
    _handleDismiss();

    final route = widget.item.buttonRoute ?? '/kids/leaderboard';
    if (context.mounted) {
      context.push(route);
    }
  }

  @override
  Widget build(BuildContext context) {
    final mediaQuery = MediaQuery.of(context);
    final reduceMotion = mediaQuery.disableAnimations;

    // Extract dynamic rewards and progress
    final rewards = widget.item.rewards ?? [
      {'rank': 1, 'coins': 500},
      {'rank': 2, 'coins': 250},
      {'rank': 3, 'coins': 150},
    ];

    final totalDays = widget.item.competitionTotalDays ?? 30;
    final daysElapsed = (widget.item.daysElapsed ?? 1).clamp(1, totalDays);
    final progressValue = (daysElapsed / totalDays).clamp(0.0, 1.0);

    final title = widget.item.title.isNotEmpty
        ? widget.item.title
        : '30 kun ichida TOP-3 ga kiring va coin yutib oling';
    final subtitle = widget.item.text.isNotEmpty
        ? widget.item.text
        : 'Eng ko‘p coin to‘plagan o‘quvchilar mukofot oladi';
    final buttonText = widget.item.buttonText ?? '1-o‘rinni egallash uchun harakat';

    return Dialog(
      backgroundColor: Colors.transparent,
      elevation: 0,
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 420, minWidth: 280),
            child: AnimatedBuilder(
              animation: _entranceController,
              builder: (context, child) {
                final scale = reduceMotion ? 1.0 : _scaleAnimation.value;
                final opacity = reduceMotion ? 1.0 : _fadeAnimation.value;

                return Transform.scale(
                  scale: scale,
                  child: Opacity(
                    opacity: opacity.clamp(0.0, 1.0),
                    child: child,
                  ),
                );
              },
              child: Container(
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [
                      Color(0xFF1E1238),
                      Color(0xFF140B28),
                      Color(0xFF0F0820),
                    ],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(
                    color: const Color(0xFF5B3FA8),
                    width: 1.4,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF5B3FA8).withOpacity(0.35),
                      blurRadius: 32,
                      offset: const Offset(0, 10),
                    ),
                    BoxShadow(
                      color: Colors.black.withOpacity(0.6),
                      blurRadius: 20,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(22),
                  child: Stack(
                    children: [
                      // Scrollable content (prevents any overflow on 320px screens)
                      SingleChildScrollView(
                        padding: const EdgeInsets.fromLTRB(20, 20, 20, 20),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            // 1. Top Pill Badge: "Shoshilinch e'lon" with flame icon
                            Semantics(
                              label: 'Shoshilinch e‘lon',
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                                decoration: BoxDecoration(
                                  gradient: const LinearGradient(
                                    colors: [Color(0xFFEF4444), Color(0xFFDC2626)],
                                  ),
                                  borderRadius: BorderRadius.circular(20),
                                  boxShadow: [
                                    BoxShadow(
                                      color: const Color(0xFFEF4444).withOpacity(0.4),
                                      blurRadius: 10,
                                      offset: const Offset(0, 2),
                                    ),
                                  ],
                                ),
                                child: const Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      Icons.local_fire_department_rounded,
                                      color: Colors.white,
                                      size: 15,
                                    ),
                                    SizedBox(width: 6),
                                    Text(
                                      'SHOSHILINCH E‘LON',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 11,
                                        fontWeight: FontWeight.w900,
                                        letterSpacing: 0.8,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(height: 14),

                            // 2. Title & Subtitle
                            Text(
                              title,
                              textAlign: TextAlign.center,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.w900,
                                height: 1.25,
                                letterSpacing: 0.1,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              subtitle,
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.85),
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                                height: 1.35,
                              ),
                            ),
                            const SizedBox(height: 16),

                            // 3. Podium Style Reward Cards (Vertical List)
                            _buildPodiumCard(
                              rank: 1,
                              title: '1-o‘rin',
                              coins: '${rewards.isNotEmpty ? rewards[0]['coins'] : 500} coin',
                              borderColor: const Color(0xFFE8A33D),
                              bgColor: const Color(0xFF281A10),
                              icon: Icons.emoji_events_rounded,
                              iconColor: const Color(0xFFFFD700),
                              isFloating: !reduceMotion,
                              isHighest: true,
                            ),
                            const SizedBox(height: 8),
                            _buildPodiumCard(
                              rank: 2,
                              title: '2-o‘rin',
                              coins: '${rewards.length > 1 ? rewards[1]['coins'] : 250} coin',
                              borderColor: const Color(0xFFA0AEC0),
                              bgColor: const Color(0xFF1B202E),
                              icon: Icons.military_tech_rounded,
                              iconColor: const Color(0xFFE2E8F0),
                              isHighest: false,
                            ),
                            const SizedBox(height: 8),
                            _buildPodiumCard(
                              rank: 3,
                              title: '3-o‘rin',
                              coins: '${rewards.length > 2 ? rewards[2]['coins'] : 150} coin',
                              borderColor: const Color(0xFFCD7F32),
                              bgColor: const Color(0xFF261914),
                              icon: Icons.workspace_premium_rounded,
                              iconColor: const Color(0xFFE59866),
                              isHighest: false,
                            ),
                            const SizedBox(height: 16),

                            // 4. Progress Bar: "Musobaqa davom etmoqda — X / 30 kun"
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.05),
                                borderRadius: BorderRadius.circular(14),
                                border: Border.all(
                                  color: Colors.white.withOpacity(0.10),
                                  width: 1,
                                ),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        'Musobaqa davom etmoqda',
                                        style: TextStyle(
                                          color: Colors.white.withOpacity(0.85),
                                          fontSize: 12,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                      Text(
                                        '$daysElapsed / $totalDays kun',
                                        style: const TextStyle(
                                          color: Color(0xFFFFD66B),
                                          fontSize: 12,
                                          fontWeight: FontWeight.w800,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(8),
                                    child: LinearProgressIndicator(
                                      value: progressValue,
                                      minHeight: 7,
                                      backgroundColor: Colors.white.withOpacity(0.12),
                                      valueColor: const AlwaysStoppedAnimation<Color>(
                                        Color(0xFFEE6A3C),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 18),

                            // 5. Action CTA Button: "1-o'rinni egallash uchun harakat" with Rocket, Pulse & Shine
                            _buildActionButton(
                              buttonText: buttonText,
                              reduceMotion: reduceMotion,
                              onPressed: _handleAction,
                            ),
                          ],
                        ),
                      ),

                      // Close (X) button with minimum 44x44 tap area
                      Positioned(
                        top: 8,
                        right: 8,
                        child: Semantics(
                          label: 'E‘lonni yopish',
                          button: true,
                          child: Material(
                            color: Colors.transparent,
                            child: InkWell(
                              borderRadius: BorderRadius.circular(22),
                              onTap: _handleDismiss,
                              child: Container(
                                width: 44,
                                height: 44,
                                alignment: Alignment.center,
                                child: Container(
                                  width: 32,
                                  height: 32,
                                  decoration: BoxDecoration(
                                    color: Colors.white.withOpacity(0.12),
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(
                                    Icons.close_rounded,
                                    color: Colors.white70,
                                    size: 19,
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
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPodiumCard({
    required int rank,
    required String title,
    required String coins,
    required Color borderColor,
    required Color bgColor,
    required IconData icon,
    required Color iconColor,
    bool isFloating = false,
    bool isHighest = false,
  }) {
    return Semantics(
      label: '$title uchun mukofot: $coins',
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: borderColor, width: isHighest ? 1.8 : 1.2),
          boxShadow: [
            BoxShadow(
              color: borderColor.withOpacity(isHighest ? 0.30 : 0.15),
              blurRadius: isHighest ? 12 : 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Row(
          children: [
            // Floating medal/trophy icon
            isFloating
                ? AnimatedBuilder(
                    animation: _floatingAnimation,
                    builder: (context, child) {
                      return Transform.translate(
                        offset: Offset(0, _floatingAnimation.value),
                        child: child,
                      );
                    },
                    child: _buildBadgeIcon(icon, iconColor, borderColor),
                  )
                : _buildBadgeIcon(icon, iconColor, borderColor),
            const SizedBox(width: 12),

            // Rank Name
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.95),
                      fontSize: 14,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  Text(
                    rank == 1
                        ? 'Mutloq g‘olib'
                        : (rank == 2 ? 'Kumush o‘rin' : 'Bronza o‘rin'),
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.60),
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),

            // Coins badge (1st place has largest font)
            Container(
              padding: EdgeInsets.symmetric(
                horizontal: isHighest ? 12 : 10,
                vertical: isHighest ? 6 : 4,
              ),
              decoration: BoxDecoration(
                color: borderColor.withOpacity(0.18),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: borderColor.withOpacity(0.4), width: 1),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.monetization_on_rounded,
                    color: borderColor,
                    size: isHighest ? 18 : 15,
                  ),
                  const SizedBox(width: 5),
                  Text(
                    coins,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: isHighest ? 16 : 14,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 0.2,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBadgeIcon(IconData icon, Color iconColor, Color borderColor) {
    return Container(
      width: 40,
      height: 40,
      decoration: BoxDecoration(
        color: borderColor.withOpacity(0.2),
        shape: BoxShape.circle,
        border: Border.all(color: borderColor.withOpacity(0.5), width: 1.2),
      ),
      child: Icon(icon, color: iconColor, size: 22),
    );
  }

  Widget _buildActionButton({
    required String buttonText,
    required bool reduceMotion,
    required VoidCallback onPressed,
  }) {
    Widget buttonContent = Container(
      width: double.infinity,
      height: 50,
      decoration: BoxDecoration(
        color: const Color(0xFFEE6A3C),
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFEE6A3C).withOpacity(0.40),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(14),
        child: Stack(
          children: [
            // Shine sweep effect every ~3 seconds
            if (!reduceMotion)
              AnimatedBuilder(
                animation: _shineController,
                builder: (context, child) {
                  final progress = _shineController.value;
                  return Positioned.fill(
                    child: FractionallySizedBox(
                      alignment: Alignment(-2.0 + progress * 4.0, 0.0),
                      widthFactor: 0.35,
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              Colors.white.withOpacity(0.0),
                              Colors.white.withOpacity(0.35),
                              Colors.white.withOpacity(0.0),
                            ],
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),

            // Button label & Rocket icon
            Center(
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(
                    Icons.rocket_launch_rounded,
                    color: Colors.white,
                    size: 19,
                  ),
                  const SizedBox(width: 8),
                  Flexible(
                    child: Text(
                      buttonText,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 14,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 0.2,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );

    if (!reduceMotion) {
      buttonContent = AnimatedBuilder(
        animation: _pulseAnimation,
        builder: (context, child) {
          return Transform.scale(
            scale: _pulseAnimation.value,
            child: child,
          );
        },
        child: buttonContent,
      );
    }

    return Semantics(
      label: buttonText,
      button: true,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(14),
          onTap: onPressed,
          child: buttonContent,
        ),
      ),
    );
  }
}
