import 'dart:async';
import 'dart:math' as math;
import 'dart:ui' show ImageFilter;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../network/api_client.dart';
import 'announcement_popup.dart';

/// Professional Esports & Ibrat-inspired Animated Urgent Announcement Dialog
/// - Premium Dark Purple background (#14092A -> #090414) with multi-layer neon glow
/// - Top Flame badge with high-frequency animated flickering flame
/// - Title with word-by-word staggered reveal animation
/// - 1-, 2-, 3-o'rin reward cards sliding in from the right with 80ms stagger delay
///   * 1-o'rin: Gold gradient + swaying trophy + diagonal shimmer sweep
///   * 2-o'rin: Silver gradient
///   * 3-o'rin: Bronze gradient
/// - Coin numbers count-up from 0 + spinning 3D gold coin along Y-axis
/// - Animated progress bar (1/30 kun) filling from 0 with a glowing pulsing tip dot
/// - Action CTA: Deep orange gradient + floating rocket icon + navigation to Reyting
/// - Confetti & Gold Coin rain shower for 1.5 seconds upon entrance
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
      barrierColor: const Color(0xBB080318),
      builder: (ctx) => UrgentAnnouncementDialog(item: item),
    );
  }

  @override
  State<UrgentAnnouncementDialog> createState() =>
      _UrgentAnnouncementDialogState();
}

class _UrgentAnnouncementDialogState extends State<UrgentAnnouncementDialog>
    with TickerProviderStateMixin {
  // 1. Entrance & Exit animation
  late AnimationController _entranceController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  // 2. Flame flicker animation
  late AnimationController _flameController;
  late Animation<double> _flameScaleAnimation;
  late Animation<double> _flameRotateAnimation;

  // 3. Staggered cards controller
  late AnimationController _staggerController;

  // 4. Gold Trophy sway & shimmer
  late AnimationController _trophySwayController;
  late Animation<double> _trophySwayAnimation;
  late AnimationController _goldShimmerController;

  // 5. 3D Spinning Coin along Y axis
  late AnimationController _coinSpinController;

  // 6. Progress bar fill animation
  late AnimationController _progressController;
  late Animation<double> _progressAnimation;

  // 7. Rocket float & CTA glow
  late AnimationController _rocketController;
  late Animation<double> _rocketFloatAnimation;
  late AnimationController _ctaGlowController;
  late Animation<double> _ctaGlowAnimation;

  // 8. 1.5-second Confetti & Coin Rain Shower
  late AnimationController _rainController;
  final List<_RainDrop> _rainDrops = [];

  bool _isClosing = false;

  @override
  void initState() {
    super.initState();

    // 1. Entrance spring animation (450ms, easeOutBack)
    _entranceController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 450),
    );
    _scaleAnimation = Tween<double>(begin: 0.90, end: 1.0).animate(
      CurvedAnimation(parent: _entranceController, curve: Curves.easeOutBack),
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _entranceController, curve: Curves.easeOut),
    );
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.10),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(parent: _entranceController, curve: Curves.easeOutBack),
    );
    _entranceController.forward();

    // 2. High-frequency flame flicker (350ms loop)
    _flameController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 350),
    )..repeat(reverse: true);
    _flameScaleAnimation = Tween<double>(begin: 0.94, end: 1.14).animate(
      CurvedAnimation(parent: _flameController, curve: Curves.easeInOutSine),
    );
    _flameRotateAnimation = Tween<double>(begin: -0.05, end: 0.05).animate(
      CurvedAnimation(parent: _flameController, curve: Curves.easeInOutSine),
    );

    // 3. Staggered card entrance controller (900ms)
    _staggerController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..forward();

    // 4. Gold Trophy sway (2200ms) & Gold shimmer sweep (2500ms)
    _trophySwayController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2200),
    )..repeat(reverse: true);
    _trophySwayAnimation = Tween<double>(begin: -0.08, end: 0.08).animate(
      CurvedAnimation(
          parent: _trophySwayController, curve: Curves.easeInOutSine),
    );

    _goldShimmerController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2500),
    )..repeat();

    // 5. 3D Coin Rotation along Y axis (2800ms continuous spin)
    _coinSpinController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2800),
    )..repeat();

    // 6. Progress bar animated fill (1000ms, easeOutCubic)
    final totalDays = widget.item.competitionTotalDays ?? 30;
    final daysElapsed = (widget.item.daysElapsed ?? 1).clamp(1, totalDays);
    final targetProgress = (daysElapsed / totalDays).clamp(0.0, 1.0);

    _progressController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );
    _progressAnimation = Tween<double>(begin: 0.0, end: targetProgress).animate(
      CurvedAnimation(parent: _progressController, curve: Curves.easeOutCubic),
    );
    _progressController.forward();

    // 7. Rocket float (1500ms) & CTA breathing glow (1600ms)
    _rocketController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);
    _rocketFloatAnimation = Tween<double>(begin: -3.5, end: 3.5).animate(
      CurvedAnimation(parent: _rocketController, curve: Curves.easeInOutSine),
    );

    _ctaGlowController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1600),
    )..repeat(reverse: true);
    _ctaGlowAnimation = Tween<double>(begin: 0.35, end: 0.75).animate(
      CurvedAnimation(parent: _ctaGlowController, curve: Curves.easeInOut),
    );

    // 8. Confetti & Coin Rain Shower (1.5 seconds single-shot)
    _initRainDrops();
    _rainController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );
    _rainController.forward();
  }

  void _initRainDrops() {
    final rand = math.Random();
    _rainDrops.clear();
    const colors = [
      Color(0xFFFFD700),
      Color(0xFFF59E0B),
      Color(0xFFEC4899),
      Color(0xFF8B5CF6),
      Color(0xFF38BDF8),
      Color(0xFF10B981),
    ];
    for (int i = 0; i < 40; i++) {
      _rainDrops.add(
        _RainDrop(
          startX: rand.nextDouble(),
          speed: 0.5 + rand.nextDouble() * 0.9,
          delay: rand.nextDouble() * 0.4,
          color: colors[rand.nextInt(colors.length)],
          isCoin: rand.nextBool(),
          size: 5.0 + rand.nextDouble() * 7.0,
          rotationSpeed: (rand.nextDouble() - 0.5) * 6,
        ),
      );
    }
  }

  @override
  void dispose() {
    _entranceController.dispose();
    _flameController.dispose();
    _staggerController.dispose();
    _trophySwayController.dispose();
    _goldShimmerController.dispose();
    _coinSpinController.dispose();
    _progressController.dispose();
    _rocketController.dispose();
    _ctaGlowController.dispose();
    _rainController.dispose();
    super.dispose();
  }

  Future<void> _handleDismiss() async {
    if (_isClosing) return;
    _isClosing = true;

    // Record dismissal for 24h
    try {
      ApiClient().dio.post('/announcements/${widget.item.id}/dismiss').ignore();
      final prefs = await SharedPreferences.getInstance();
      final expiryMs =
          DateTime.now().add(const Duration(hours: 24)).millisecondsSinceEpoch;
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
    HapticFeedback.heavyImpact();
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

    final rewards = widget.item.rewards ??
        [
          {'rank': 1, 'coins': 500},
          {'rank': 2, 'coins': 250},
          {'rank': 3, 'coins': 150},
        ];

    final totalDays = widget.item.competitionTotalDays ?? 30;
    final daysElapsed = (widget.item.daysElapsed ?? 1).clamp(1, totalDays);

    final title = widget.item.title.isNotEmpty
        ? widget.item.title
        : '30 kun ichida TOP-3 ga kiring va coin yutib oling';
    final subtitle = widget.item.text.isNotEmpty
        ? widget.item.text
        : 'Eng ko‘p coin to‘plagan o‘quvchilar mukofot oladi';
    final buttonText =
        widget.item.buttonText ?? '1-o‘rinni egallash uchun harakat';

    return Dialog(
      backgroundColor: Colors.transparent,
      elevation: 0,
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 400, minWidth: 280),
            child: AnimatedBuilder(
              animation: _entranceController,
              builder: (context, child) {
                final scale = reduceMotion ? 1.0 : _scaleAnimation.value;
                final opacity = reduceMotion ? 1.0 : _fadeAnimation.value;
                final slide = reduceMotion ? Offset.zero : _slideAnimation.value;

                return Transform.translate(
                  offset: Offset(0, slide.dy * 180),
                  child: Transform.scale(
                    scale: scale,
                    child: Opacity(
                      opacity: opacity.clamp(0.0, 1.0),
                      child: child,
                    ),
                  ),
                );
              },
              child: Stack(
                clipBehavior: Clip.none,
                alignment: Alignment.center,
                children: [
                  // Main Card with Dark Purple Gradient & Multi-layer Neon Glow
                  Container(
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [
                          Color(0xFF160A2C), // Deep Indigo-Purple
                          Color(0xFF0F0620), // Midnight Purple
                          Color(0xFF090314), // Near Black
                        ],
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ),
                      borderRadius: BorderRadius.circular(26),
                      border: Border.all(
                        color: const Color(0xFF7C3AED).withOpacity(0.65),
                        width: 1.5,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF7C3AED).withOpacity(0.40),
                          blurRadius: 36,
                          spreadRadius: 1,
                          offset: const Offset(0, 10),
                        ),
                        BoxShadow(
                          color: const Color(0xFFEC4899).withOpacity(0.18),
                          blurRadius: 48,
                          offset: const Offset(0, 14),
                        ),
                        BoxShadow(
                          color: Colors.black.withOpacity(0.70),
                          blurRadius: 22,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(26),
                      child: SingleChildScrollView(
                        padding: const EdgeInsets.fromLTRB(16, 18, 16, 18),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            // 1. Top Red Pill Badge with Animated Flickering Flame
                            _buildFlameBadge(reduceMotion),
                            const SizedBox(height: 12),

                            // 2. Staggered Word-by-Word Title Reveal
                            _buildStaggeredTitle(title, reduceMotion),
                            const SizedBox(height: 5),

                            // Subtitle
                            Text(
                              subtitle,
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.85),
                                fontSize: 12.5,
                                fontWeight: FontWeight.w500,
                                height: 1.3,
                              ),
                            ),
                            const SizedBox(height: 14),

                            // 3. Staggered 1-, 2-, 3-o'rin Reward Cards
                            _buildStaggeredCards(rewards, reduceMotion),
                            const SizedBox(height: 14),

                            // 4. Animated Progress Bar with Glowing Tip Dot
                            _buildAnimatedProgressBar(
                              daysElapsed: daysElapsed,
                              totalDays: totalDays,
                              reduceMotion: reduceMotion,
                            ),
                            const SizedBox(height: 16),

                            // 5. Action CTA Button with Floating Rocket & Neon Glow
                            _buildActionButton(
                              buttonText: buttonText,
                              reduceMotion: reduceMotion,
                              onPressed: _handleAction,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),

                  // Close (X) circular button
                  Positioned(
                    top: 10,
                    right: 10,
                    child: Semantics(
                      label: 'E‘lonni yopish',
                      button: true,
                      child: Material(
                        color: Colors.transparent,
                        child: InkWell(
                          borderRadius: BorderRadius.circular(22),
                          onTap: _handleDismiss,
                          child: Container(
                            width: 36,
                            height: 36,
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.12),
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: Colors.white.withOpacity(0.20),
                                width: 1,
                              ),
                            ),
                            child: const Icon(
                              Icons.close_rounded,
                              color: Colors.white,
                              size: 19,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),

                  // 6. Confetti & Coin Rain Shower (1.5 seconds)
                  if (!reduceMotion)
                    Positioned.fill(
                      child: IgnorePointer(
                        child: AnimatedBuilder(
                          animation: _rainController,
                          builder: (context, _) {
                            if (_rainController.value >= 1.0) {
                              return const SizedBox.shrink();
                            }
                            return RepaintBoundary(
                              child: CustomPaint(
                                painter: _ConfettiShowerPainter(
                                  progress: _rainController.value,
                                  drops: _rainDrops,
                                ),
                              ),
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

  /// Top Red Pill Badge with Animated Flickering Flame
  Widget _buildFlameBadge(bool reduceMotion) {
    return Semantics(
      label: 'Shoshilinch e‘lon',
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFFEF4444), Color(0xFFDC2626)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(22),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFFEF4444).withOpacity(0.55),
              blurRadius: 14,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Flickering Flame Icon
            AnimatedBuilder(
              animation: _flameController,
              builder: (context, child) {
                final scale =
                    reduceMotion ? 1.0 : _flameScaleAnimation.value;
                final rot =
                    reduceMotion ? 0.0 : _flameRotateAnimation.value;
                return Transform.scale(
                  scale: scale,
                  child: Transform.rotate(
                    angle: rot,
                    child: child,
                  ),
                );
              },
              child: const Icon(
                Icons.local_fire_department_rounded,
                color: Color(0xFFFFFBEB),
                size: 16,
              ),
            ),
            const SizedBox(width: 5),
            const Text(
              'SHOSHILINCH E‘LON',
              style: TextStyle(
                color: Colors.white,
                fontSize: 11,
                fontWeight: FontWeight.w900,
                letterSpacing: 0.9,
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Word-by-Word Staggered Title Reveal
  Widget _buildStaggeredTitle(String title, bool reduceMotion) {
    if (reduceMotion) {
      return Text(
        title,
        textAlign: TextAlign.center,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 17.5,
          fontWeight: FontWeight.w900,
          height: 1.25,
          letterSpacing: 0.1,
        ),
      );
    }

    final words = title.split(' ');
    return Stack(
      alignment: Alignment.center,
      children: [
        // Hidden full title for test finders and accessibility screen readers
        Opacity(
          opacity: 0.0,
          child: Text(
            title,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 17.5,
              fontWeight: FontWeight.w900,
              height: 1.25,
              letterSpacing: 0.1,
            ),
          ),
        ),
        Wrap(
          alignment: WrapAlignment.center,
          spacing: 4,
          runSpacing: 3,
          children: List.generate(words.length, (index) {
            final start = (index / (words.length + 1)).clamp(0.0, 0.7);
            final end = (start + 0.35).clamp(0.0, 1.0);

            final wordAnim = CurvedAnimation(
              parent: _staggerController,
              curve: Interval(start, end, curve: Curves.easeOutBack),
            );

            return AnimatedBuilder(
              animation: wordAnim,
              builder: (context, child) {
                return Transform.translate(
                  offset: Offset(0, (1.0 - wordAnim.value) * 14),
                  child: Opacity(
                    opacity: wordAnim.value.clamp(0.0, 1.0),
                    child: child,
                  ),
                );
              },
              child: Text(
                words[index],
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 17.5,
                  fontWeight: FontWeight.w900,
                  height: 1.25,
                  letterSpacing: 0.1,
                ),
              ),
            );
          }),
        ),
      ],
    );
  }

  /// 1-, 2-, 3-o'rin Reward Cards with 80ms Stagger Delay from Right
  Widget _buildStaggeredCards(List<dynamic> rewards, bool reduceMotion) {
    final rankData = [
      {
        'rank': 1,
        'title': '1-o‘rin',
        'coins': rewards.isNotEmpty ? rewards[0]['coins'] ?? 500 : 500,
        'borderColor': const Color(0xFFFFD700),
        'bgColors': [const Color(0xFF3B240B), const Color(0xFF221305)],
        'icon': Icons.emoji_events_rounded,
        'iconColor': const Color(0xFFFFD700),
        'isHighest': true,
      },
      {
        'rank': 2,
        'title': '2-o‘rin',
        'coins': rewards.length > 1 ? rewards[1]['coins'] ?? 250 : 250,
        'borderColor': const Color(0xFFA0AEC0),
        'bgColors': [const Color(0xFF1E2638), const Color(0xFF111724)],
        'icon': Icons.military_tech_rounded,
        'iconColor': const Color(0xFFE2E8F0),
        'isHighest': false,
      },
      {
        'rank': 3,
        'title': '3-o‘rin',
        'coins': rewards.length > 2 ? rewards[2]['coins'] ?? 150 : 150,
        'borderColor': const Color(0xFFCD7F32),
        'bgColors': [const Color(0xFF2E170F), const Color(0xFF1C0D08)],
        'icon': Icons.workspace_premium_rounded,
        'iconColor': const Color(0xFFE59866),
        'isHighest': false,
      },
    ];

    return Column(
      children: List.generate(rankData.length, (index) {
        final data = rankData[index];
        final rank = data['rank'] as int;
        final title = data['title'] as String;
        final targetCoins = data['coins'] as int;
        final borderColor = data['borderColor'] as Color;
        final bgColors = data['bgColors'] as List<Color>;
        final icon = data['icon'] as IconData;
        final iconColor = data['iconColor'] as Color;
        final isHighest = data['isHighest'] as bool;

        // 80ms staggered interval on _staggerController
        final start = (index * 0.16).clamp(0.0, 0.7);
        final end = (start + 0.45).clamp(0.0, 1.0);

        final cardAnim = CurvedAnimation(
          parent: _staggerController,
          curve: Interval(start, end, curve: Curves.easeOutCubic),
        );

        return Padding(
          padding: EdgeInsets.only(bottom: index < 2 ? 7.0 : 0.0),
          child: AnimatedBuilder(
            animation: cardAnim,
            builder: (context, child) {
              final slideOffset = reduceMotion
                  ? Offset.zero
                  : Offset((1.0 - cardAnim.value) * 60, 0);
              final opacity = reduceMotion ? 1.0 : cardAnim.value;

              return Transform.translate(
                offset: slideOffset,
                child: Opacity(
                  opacity: opacity.clamp(0.0, 1.0),
                  child: child,
                ),
              );
            },
            child: _buildPodiumCard(
              rank: rank,
              title: title,
              targetCoins: targetCoins,
              borderColor: borderColor,
              bgColors: bgColors,
              icon: icon,
              iconColor: iconColor,
              isHighest: isHighest,
              reduceMotion: reduceMotion,
            ),
          ),
        );
      }),
    );
  }

  Widget _buildPodiumCard({
    required int rank,
    required String title,
    required int targetCoins,
    required Color borderColor,
    required List<Color> bgColors,
    required IconData icon,
    required Color iconColor,
    required bool isHighest,
    required bool reduceMotion,
  }) {
    return Semantics(
      label: '$title uchun mukofot: $targetCoins coin',
      child: Stack(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 9),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: bgColors,
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: borderColor,
                width: isHighest ? 1.8 : 1.2,
              ),
              boxShadow: [
                BoxShadow(
                  color: borderColor.withOpacity(isHighest ? 0.35 : 0.15),
                  blurRadius: isHighest ? 14 : 8,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: Row(
              children: [
                // Trophy / Medal Icon (Swaying on 1-o'rin)
                isHighest && !reduceMotion
                    ? AnimatedBuilder(
                        animation: _trophySwayAnimation,
                        builder: (context, child) {
                          return Transform.rotate(
                            angle: _trophySwayAnimation.value,
                            child: child,
                          );
                        },
                        child: _buildBadgeIcon(icon, iconColor, borderColor),
                      )
                    : _buildBadgeIcon(icon, iconColor, borderColor),
                const SizedBox(width: 10),

                // Rank Title
                Expanded(
                  child: Text(
                    title,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight:
                          isHighest ? FontWeight.w900 : FontWeight.w700,
                    ),
                  ),
                ),
                const SizedBox(width: 6),

                // Count-up Coins + 3D Spinning Coin Icon
                FittedBox(
                  fit: BoxFit.scaleDown,
                  child: _buildAnimatedCoinReward(targetCoins, reduceMotion),
                ),
              ],
            ),
          ),

          // Diagonal Shimmer Highlight on 1st Place Card
          if (isHighest && !reduceMotion)
            Positioned.fill(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: AnimatedBuilder(
                  animation: _goldShimmerController,
                  builder: (context, _) {
                    return Transform.translate(
                      offset: Offset(
                        (_goldShimmerController.value * 350) - 150,
                        0,
                      ),
                      child: Container(
                        width: 40,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              Colors.white.withOpacity(0.0),
                              Colors.white.withOpacity(0.30),
                              Colors.white.withOpacity(0.0),
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildBadgeIcon(IconData icon, Color iconColor, Color borderColor) {
    return Container(
      width: 36,
      height: 36,
      decoration: BoxDecoration(
        color: borderColor.withOpacity(0.20),
        shape: BoxShape.circle,
        border: Border.all(color: borderColor, width: 1.2),
      ),
      child: Icon(icon, color: iconColor, size: 20),
    );
  }

  /// Coin Reward Count-up from 0 + 3D Spinning Coin
  Widget _buildAnimatedCoinReward(int targetCoins, bool reduceMotion) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        // 3D Spinning Coin along Y-Axis
        AnimatedBuilder(
          animation: _coinSpinController,
          builder: (context, child) {
            final angle = reduceMotion
                ? 0.0
                : _coinSpinController.value * 2 * math.pi;
            return Transform(
              alignment: Alignment.center,
              transform: Matrix4.identity()
                ..setEntry(3, 2, 0.002)
                ..rotateY(angle),
              child: child,
            );
          },
          child: Container(
            width: 19,
            height: 19,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: const LinearGradient(
                colors: [Color(0xFFFFDF00), Color(0xFFD97706)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              border: Border.all(color: const Color(0xFFFFFBEB), width: 1.2),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFFF59E0B).withOpacity(0.55),
                  blurRadius: 6,
                ),
              ],
            ),
            child: const Center(
              child: Text(
                '¢',
                style: TextStyle(
                  color: Color(0xFF78350F),
                  fontSize: 11.5,
                  fontWeight: FontWeight.w900,
                  height: 1.0,
                ),
              ),
            ),
          ),
        ),
        const SizedBox(width: 5),

        // Count-up Coin Number from 0
        TweenAnimationBuilder<int>(
          tween: IntTween(begin: 0, end: targetCoins),
          duration: const Duration(milliseconds: 900),
          curve: Curves.easeOutCubic,
          builder: (context, value, _) {
            return Text(
              '$value coin',
              style: const TextStyle(
                color: Color(0xFFFFD700),
                fontSize: 14.5,
                fontWeight: FontWeight.w900,
                letterSpacing: 0.2,
                fontFeatures: [FontFeature.tabularFigures()],
              ),
            );
          },
        ),
      ],
    );
  }

  /// Animated Progress Bar (0 -> progressValue) with Glowing Tip Dot
  Widget _buildAnimatedProgressBar({
    required int daysElapsed,
    required int totalDays,
    required bool reduceMotion,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 9),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.06),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.white.withOpacity(0.12),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  'Musobaqa davom etmoqda',
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.85),
                    fontSize: 11.5,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(width: 6),
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
          const SizedBox(height: 7),

          // Custom Progress Track with Glowing Tip Dot
          AnimatedBuilder(
            animation: _progressAnimation,
            builder: (context, _) {
              final val = reduceMotion
                  ? (daysElapsed / totalDays).clamp(0.0, 1.0)
                  : _progressAnimation.value;

              return LayoutBuilder(
                builder: (context, constraints) {
                  final totalWidth = constraints.maxWidth;
                  final filledWidth = (totalWidth * val).clamp(0.0, totalWidth);

                  return Stack(
                    clipBehavior: Clip.none,
                    alignment: Alignment.centerLeft,
                    children: [
                      // Background Track
                      Container(
                        width: totalWidth,
                        height: 7,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),

                      // Filled Gradient Track
                      Container(
                        width: filledWidth,
                        height: 7,
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFFEE6A3C), Color(0xFFFF9500)],
                          ),
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),

                      // Glowing Tip Dot
                      if (filledWidth > 6)
                        Positioned(
                          left: filledWidth - 5,
                          child: Container(
                            width: 10,
                            height: 10,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: const Color(0xFFFFFBEB),
                              boxShadow: [
                                BoxShadow(
                                  color:
                                      const Color(0xFFFF9500).withOpacity(0.95),
                                  blurRadius: 8,
                                  spreadRadius: 2,
                                ),
                              ],
                            ),
                          ),
                        ),
                    ],
                  );
                },
              );
            },
          ),
        ],
      ),
    );
  }

  /// Deep Orange Gradient CTA Button with Floating Rocket
  Widget _buildActionButton({
    required String buttonText,
    required bool reduceMotion,
    required VoidCallback onPressed,
  }) {
    return AnimatedBuilder(
      animation: _ctaGlowAnimation,
      builder: (context, child) {
        final glow = reduceMotion ? 0.35 : _ctaGlowAnimation.value;
        return Container(
          width: double.infinity,
          height: 50,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [
                Color(0xFFFF5400), // Vibrant Orange
                Color(0xFFFF8500), // Amber-Orange
                Color(0xFFEA580C), // Deep Orange
              ],
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
            ),
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFFFF6A00).withOpacity(glow),
                blurRadius: 20,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              borderRadius: BorderRadius.circular(16),
              onTap: onPressed,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 10),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Floating Rocket Icon
                    AnimatedBuilder(
                      animation: _rocketFloatAnimation,
                      builder: (context, rocketChild) {
                        final dy =
                            reduceMotion ? 0.0 : _rocketFloatAnimation.value;
                        return Transform.translate(
                          offset: Offset(0, dy),
                          child: rocketChild,
                        );
                      },
                      child: const Icon(
                        Icons.rocket_launch_rounded,
                        color: Colors.white,
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Flexible(
                      child: FittedBox(
                        fit: BoxFit.scaleDown,
                        child: Text(
                          buttonText,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 14,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 0.2,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 4),
                    const Icon(Icons.arrow_forward_rounded,
                        color: Colors.white, size: 16),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

/// 1.5-Second Confetti & Gold Coin Rain Shower Painter
class _RainDrop {
  final double startX; // 0.0 -> 1.0
  final double speed;
  final double delay;
  final Color color;
  final bool isCoin;
  final double size;
  final double rotationSpeed;

  _RainDrop({
    required this.startX,
    required this.speed,
    required this.delay,
    required this.color,
    required this.isCoin,
    required this.size,
    required this.rotationSpeed,
  });
}

class _ConfettiShowerPainter extends CustomPainter {
  final double progress;
  final List<_RainDrop> drops;

  _ConfettiShowerPainter({required this.progress, required this.drops});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..style = PaintingStyle.fill;

    for (final d in drops) {
      if (progress < d.delay) continue;
      final localProgress =
          ((progress - d.delay) / (1.0 - d.delay)).clamp(0.0, 1.0);

      final x = d.startX * size.width +
          math.sin(localProgress * 2 * math.pi + d.startX * 10) * 15;
      final y = localProgress * size.height * d.speed * 1.2;
      final alpha = ((1.0 - localProgress) * 255).clamp(0, 255).toInt();

      paint.color = d.color.withAlpha(alpha);

      canvas.save();
      canvas.translate(x, y);
      canvas.rotate(localProgress * d.rotationSpeed * math.pi);

      if (d.isCoin) {
        // Gold coin circle
        canvas.drawCircle(Offset.zero, d.size * 0.7, paint);
      } else {
        // Confetti ribbon rectangle
        canvas.drawRect(
          Rect.fromCenter(
            center: Offset.zero,
            width: d.size,
            height: d.size * 0.45,
          ),
          paint,
        );
      }
      canvas.restore();
    }
  }

  @override
  bool shouldRepaint(covariant _ConfettiShowerPainter oldDelegate) {
    return oldDelegate.progress != progress;
  }
}
