import 'dart:async';
import 'dart:ui' show ImageFilter;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Professional Apple Style Animated New User 30% Discount Dialog
/// - 24px border radius, glassmorphism backdrop blur
/// - Smooth Fade + Scale entry and exit animations
/// - Interactive selectable monthly / yearly plan cards
/// - Dynamic CTA button with selected plan price
/// - 5-second auto-close progress bar
/// - Real server-backed 24-hour countdown timer (HH:MM:SS)
/// - Light & Dark mode support with clear contrast
class NewUserDiscountDialog extends ConsumerStatefulWidget {
  final DateTime expiresAt;
  final int discountPercent;
  final int monthlyOriginalPrice;
  final int monthlyDiscountedPrice;
  final int yearlyOriginalPrice;
  final int yearlyDiscountedPrice;
  final Duration? autoCloseDuration;
  final VoidCallback? onDismiss;
  final ValueChanged<String>? onClaimWithPlan;
  final String initialPlan;

  const NewUserDiscountDialog({
    super.key,
    required this.expiresAt,
    this.discountPercent = 30,
    this.monthlyOriginalPrice = 29000,
    this.monthlyDiscountedPrice = 20300,
    this.yearlyOriginalPrice = 250000,
    this.yearlyDiscountedPrice = 175000,
    this.autoCloseDuration = const Duration(seconds: 5),
    this.onDismiss,
    this.onClaimWithPlan,
    this.initialPlan = 'yearly',
  });

  static Future<void> show(
    BuildContext context, {
    required DateTime expiresAt,
    int discountPercent = 30,
    int monthlyOriginalPrice = 29000,
    int monthlyDiscountedPrice = 20300,
    int yearlyOriginalPrice = 250000,
    int yearlyDiscountedPrice = 175000,
    Duration autoCloseDuration = const Duration(seconds: 5),
    ValueChanged<String>? onClaimWithPlan,
  }) {
    return showDialog<void>(
      context: context,
      barrierDismissible: true,
      barrierColor: const Color(0x990A0618),
      builder: (ctx) => NewUserDiscountDialog(
        expiresAt: expiresAt,
        discountPercent: discountPercent,
        monthlyOriginalPrice: monthlyOriginalPrice,
        monthlyDiscountedPrice: monthlyDiscountedPrice,
        yearlyOriginalPrice: yearlyOriginalPrice,
        yearlyDiscountedPrice: yearlyDiscountedPrice,
        autoCloseDuration: autoCloseDuration,
        onClaimWithPlan: onClaimWithPlan,
      ),
    );
  }

  @override
  ConsumerState<NewUserDiscountDialog> createState() =>
      _NewUserDiscountDialogState();
}

class _NewUserDiscountDialogState extends ConsumerState<NewUserDiscountDialog>
    with TickerProviderStateMixin {
  late AnimationController _entranceController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;

  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  late AnimationController _countUpController;
  late Animation<int> _monthlyCountAnimation;
  late Animation<int> _yearlyCountAnimation;

  AnimationController? _autoCloseController;

  Timer? _countdownTimer;
  Duration _remainingTime = Duration.zero;
  bool _isClosing = false;
  late String _selectedPlan; // 'monthly' | 'yearly'

  @override
  void initState() {
    super.initState();
    _selectedPlan = widget.initialPlan;

    // 1. Entrance animation (scale 0.90 -> 1.0, fade)
    _entranceController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 320),
    );
    _scaleAnimation = Tween<double>(begin: 0.92, end: 1.0).animate(
      CurvedAnimation(parent: _entranceController, curve: Curves.easeOutCubic),
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _entranceController, curve: Curves.easeOut),
    );
    _entranceController.forward();

    // 2. Subtle CTA pulse animation
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1600),
    )..repeat(reverse: true);
    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.025).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );

    // 3. Price count-up animation
    _countUpController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    );
    _monthlyCountAnimation = IntTween(
      begin: 0,
      end: widget.monthlyDiscountedPrice,
    ).animate(
      CurvedAnimation(parent: _countUpController, curve: Curves.easeOutCubic),
    );
    _yearlyCountAnimation = IntTween(
      begin: 0,
      end: widget.yearlyDiscountedPrice,
    ).animate(
      CurvedAnimation(parent: _countUpController, curve: Curves.easeOutCubic),
    );
    _countUpController.forward();

    // 4. Auto-close timer controller (5 seconds)
    if (widget.autoCloseDuration != null &&
        widget.autoCloseDuration!.inSeconds > 0) {
      _autoCloseController = AnimationController(
        vsync: this,
        duration: widget.autoCloseDuration,
      );
      _autoCloseController!.forward();
      _autoCloseController!.addStatusListener((status) {
        if (status == AnimationStatus.completed && mounted && !_isClosing) {
          _handleDismiss();
        }
      });
    }

    // 5. 24-hour server countdown timer
    _updateRemainingTime();
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      _updateRemainingTime();
    });
  }

  void _updateRemainingTime() {
    final now = DateTime.now();
    final diff = widget.expiresAt.difference(now);
    if (diff.isNegative || diff.inSeconds <= 0) {
      _countdownTimer?.cancel();
      _remainingTime = Duration.zero;
      if (mounted && !_isClosing) {
        _handleDismiss();
      }
    } else {
      if (mounted) {
        setState(() {
          _remainingTime = diff;
        });
      }
    }
  }

  void _pauseAutoClose() {
    if (_autoCloseController?.isAnimating == true) {
      _autoCloseController?.stop();
    }
  }

  @override
  void dispose() {
    _countdownTimer?.cancel();
    _autoCloseController?.dispose();
    _entranceController.dispose();
    _pulseController.dispose();
    _countUpController.dispose();
    super.dispose();
  }

  Future<void> _handleDismiss() async {
    if (_isClosing) return;
    _isClosing = true;
    _autoCloseController?.stop();

    try {
      final prefs = await SharedPreferences.getInstance();
      final todayStr = DateTime.now().toIso8601String().split('T').first;
      await prefs.setString('special_offer_dismissed_date', todayStr);
    } catch (_) {}

    widget.onDismiss?.call();

    if (mounted) {
      await _entranceController.reverse();
      if (mounted) {
        Navigator.of(context, rootNavigator: true).pop();
      }
    }
  }

  void _handleClaimDiscount() {
    if (_isClosing) return;
    _isClosing = true;
    _autoCloseController?.stop();
    HapticFeedback.mediumImpact();

    final chosenPlan = _selectedPlan;
    widget.onDismiss?.call();
    widget.onClaimWithPlan?.call(chosenPlan);

    Navigator.of(context, rootNavigator: true).pop();

    // Navigate to MathCity Pro with selected plan
    if (widget.onClaimWithPlan == null && context.mounted) {
      context.push('/kids/pro?plan=$chosenPlan');
    }
  }

  String _formatNumber(int number) {
    final str = number.toString();
    final reg = RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))');
    return str.replaceAllMapped(reg, (Match m) => '${m[1]} ');
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final mediaQuery = MediaQuery.of(context);
    final reduceMotion = mediaQuery.disableAnimations;

    final String countdownString;
    if (_remainingTime.inHours >= 24) {
      final days = _remainingTime.inDays;
      final remHours = _remainingTime.inHours % 24;
      countdownString =
          remHours > 0 ? '$days kun $remHours soat qoldi' : '$days kun qoldi';
    } else {
      final hours = _remainingTime.inHours.toString().padLeft(2, '0');
      final minutes =
          (_remainingTime.inMinutes % 60).toString().padLeft(2, '0');
      final seconds =
          (_remainingTime.inSeconds % 60).toString().padLeft(2, '0');
      countdownString = '$hours:$minutes:$seconds';
    }

    final selectedPrice = _selectedPlan == 'yearly'
        ? widget.yearlyDiscountedPrice
        : widget.monthlyDiscountedPrice;

    return Dialog(
      backgroundColor: Colors.transparent,
      elevation: 0,
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
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
                  color: isDark
                      ? const Color(0xFF161233).withValues(alpha: 0.96)
                      : Colors.white.withValues(alpha: 0.96),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(
                    color: isDark
                        ? const Color(0xFF6366F1).withValues(alpha: 0.35)
                        : const Color(0xFFE2E8F0),
                    width: 1.5,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: isDark
                          ? const Color(0xFF6366F1).withValues(alpha: 0.20)
                          : Colors.black.withValues(alpha: 0.12),
                      blurRadius: 36,
                      offset: const Offset(0, 12),
                    ),
                  ],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(24),
                  child: Stack(
                    children: [
                      // 5-second auto-close subtle progress bar at very top
                      if (_autoCloseController != null)
                        Positioned(
                          top: 0,
                          left: 0,
                          right: 0,
                          child: AnimatedBuilder(
                            animation: _autoCloseController!,
                            builder: (context, _) {
                              final progress =
                                  1.0 - _autoCloseController!.value;
                              return LinearProgressIndicator(
                                value: progress.clamp(0.0, 1.0),
                                minHeight: 3,
                                backgroundColor: Colors.transparent,
                                valueColor: AlwaysStoppedAnimation<Color>(
                                  const Color(0xFF6366F1)
                                      .withValues(alpha: 0.6),
                                ),
                              );
                            },
                          ),
                        ),

                      // Content Body
                      SingleChildScrollView(
                        padding: const EdgeInsets.fromLTRB(20, 24, 20, 20),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            // 1. Apple-style Pill Badge
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 14, vertical: 5),
                              decoration: BoxDecoration(
                                color: const Color(0xFF6366F1)
                                    .withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                  color: const Color(0xFF6366F1)
                                      .withValues(alpha: 0.3),
                                  width: 1,
                                ),
                              ),
                              child: FittedBox(
                                fit: BoxFit.scaleDown,
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Icon(
                                      Icons.auto_awesome_rounded,
                                      color: Color(0xFF818CF8),
                                      size: 14,
                                    ),
                                    const SizedBox(width: 6),
                                    Text(
                                      'MAXSUS TAKLIF • 30% CHEGIRMA',
                                      style: TextStyle(
                                        color: isDark
                                            ? const Color(0xFFA5B4FC)
                                            : const Color(0xFF4F46E5),
                                        fontSize: 11,
                                        fontWeight: FontWeight.w800,
                                        letterSpacing: 0.6,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(height: 14),

                            // 2. Title & Subtitle
                            Text(
                              'MathCity Pro ga ulaning',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: isDark
                                    ? Colors.white
                                    : const Color(0xFF0F172A),
                                fontSize: 20,
                                fontWeight: FontWeight.w900,
                                letterSpacing: -0.3,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Birinchi to‘lovingiz uchun maxsus 30% chegirma',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: isDark
                                    ? const Color(0xFF94A3B8)
                                    : const Color(0xFF64748B),
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(height: 18),

                            // 3. Interactive Selectable Plan Cards (Monthly vs Yearly)
                            AnimatedBuilder(
                              animation: _countUpController,
                              builder: (context, _) {
                                final currentMonthly = reduceMotion
                                    ? widget.monthlyDiscountedPrice
                                    : _monthlyCountAnimation.value;
                                final currentYearly = reduceMotion
                                    ? widget.yearlyDiscountedPrice
                                    : _yearlyCountAnimation.value;

                                return Row(
                                  children: [
                                    // Monthly Plan Card
                                    Expanded(
                                      child: _buildSelectablePlanCard(
                                        isDark: isDark,
                                        planKey: 'monthly',
                                        title: 'Oylik',
                                        subtitle: 'Birinchi oy uchun',
                                        originalPrice:
                                            widget.monthlyOriginalPrice,
                                        discountedPrice: currentMonthly,
                                        badge: null,
                                        isSelected: _selectedPlan == 'monthly',
                                        onTap: () {
                                          _pauseAutoClose();
                                          HapticFeedback.selectionClick();
                                          setState(
                                              () => _selectedPlan = 'monthly');
                                        },
                                      ),
                                    ),
                                    const SizedBox(width: 10),

                                    // Yearly Plan Card
                                    Expanded(
                                      child: _buildSelectablePlanCard(
                                        isDark: isDark,
                                        planKey: 'yearly',
                                        title: 'Yillik',
                                        subtitle: '12 oylik obuna',
                                        originalPrice:
                                            widget.yearlyOriginalPrice,
                                        discountedPrice: currentYearly,
                                        badge: 'Eng tejamkor',
                                        isSelected: _selectedPlan == 'yearly',
                                        onTap: () {
                                          _pauseAutoClose();
                                          HapticFeedback.selectionClick();
                                          setState(
                                              () => _selectedPlan = 'yearly');
                                        },
                                      ),
                                    ),
                                  ],
                                );
                              },
                            ),
                            const SizedBox(height: 16),

                            // 4. Live 24-hour server countdown timer
                            Container(
                              width: double.infinity,
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 14, vertical: 8),
                              decoration: BoxDecoration(
                                color: isDark
                                    ? Colors.white.withValues(alpha: 0.05)
                                    : const Color(0xFFF1F5F9),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: isDark
                                      ? Colors.white.withValues(alpha: 0.08)
                                      : const Color(0xFFE2E8F0),
                                  width: 1,
                                ),
                              ),
                              child: FittedBox(
                                fit: BoxFit.scaleDown,
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(
                                      Icons.timer_outlined,
                                      color: isDark
                                          ? const Color(0xFFFBBF24)
                                          : const Color(0xFFD97706),
                                      size: 16,
                                    ),
                                    const SizedBox(width: 6),
                                    Text(
                                      'Chegirma tugashiga: ',
                                      style: TextStyle(
                                        color: isDark
                                            ? const Color(0xFFCBD5E1)
                                            : const Color(0xFF475569),
                                        fontSize: 12,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                    Text(
                                      countdownString,
                                      style: TextStyle(
                                        color: isDark
                                            ? const Color(0xFFFBBF24)
                                            : const Color(0xFFB45309),
                                        fontSize: 13,
                                        fontWeight: FontWeight.w900,
                                        letterSpacing: 0.5,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(height: 18),

                            // 5. Dynamic CTA Button
                            _buildDynamicActionButton(
                              isDark: isDark,
                              reduceMotion: reduceMotion,
                              priceText: '${_formatNumber(selectedPrice)} so‘m',
                              onPressed: _handleClaimDiscount,
                            ),
                            const SizedBox(height: 8),

                            // 6. Secondary button: "Keyinroq"
                            TextButton(
                              onPressed: _handleDismiss,
                              style: TextButton.styleFrom(
                                foregroundColor: isDark
                                    ? const Color(0xFF94A3B8)
                                    : const Color(0xFF64748B),
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 16, vertical: 8),
                              ),
                              child: const Text(
                                'Keyinroq',
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                  decoration: TextDecoration.underline,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Close X button with accessible tap target
                      Positioned(
                        top: 10,
                        right: 10,
                        child: Semantics(
                          label: 'Taklifni yopish',
                          button: true,
                          child: Material(
                            color: Colors.transparent,
                            child: InkWell(
                              borderRadius: BorderRadius.circular(20),
                              onTap: _handleDismiss,
                              child: Container(
                                width: 36,
                                height: 36,
                                decoration: BoxDecoration(
                                  color: isDark
                                      ? Colors.white.withValues(alpha: 0.08)
                                      : Colors.black.withValues(alpha: 0.05),
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(
                                  Icons.close_rounded,
                                  color: isDark
                                      ? Colors.white70
                                      : const Color(0xFF475569),
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

  Widget _buildSelectablePlanCard({
    required bool isDark,
    required String planKey,
    required String title,
    required String subtitle,
    required int originalPrice,
    required int discountedPrice,
    required String? badge,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected
              ? (isDark
                  ? const Color(0xFF6366F1).withValues(alpha: 0.16)
                  : const Color(0xFFEEF2FF))
              : (isDark
                  ? Colors.white.withValues(alpha: 0.03)
                  : const Color(0xFFF8FAFC)),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: isSelected
                ? const Color(0xFF6366F1)
                : (isDark
                    ? Colors.white.withValues(alpha: 0.10)
                    : const Color(0xFFE2E8F0)),
            width: isSelected ? 2.0 : 1.0,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: const Color(0xFF6366F1).withValues(alpha: 0.25),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ]
              : null,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      color: isDark ? Colors.white : const Color(0xFF0F172A),
                      fontSize: 14,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
                Icon(
                  isSelected
                      ? Icons.check_circle_rounded
                      : Icons.radio_button_unchecked_rounded,
                  color: isSelected
                      ? const Color(0xFF6366F1)
                      : (isDark ? Colors.white38 : const Color(0xFF94A3B8)),
                  size: 18,
                ),
              ],
            ),
            const SizedBox(height: 2),

            if (badge != null) ...[
              Container(
                margin: const EdgeInsets.only(top: 2, bottom: 4),
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: const Color(0xFF10B981).withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: const Text(
                  'Eng tejamkor',
                  style: TextStyle(
                    color: Color(0xFF10B981),
                    fontSize: 9,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
            ] else ...[
              const SizedBox(height: 6),
            ],

            Text(
              subtitle,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                color:
                    isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                fontSize: 10.5,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 6),

            // Strikethrough original price
            FittedBox(
              fit: BoxFit.scaleDown,
              alignment: Alignment.centerLeft,
              child: Text(
                '${_formatNumber(originalPrice)} so‘m',
                style: TextStyle(
                  color: isDark ? Colors.white38 : const Color(0xFF94A3B8),
                  fontSize: 11,
                  fontWeight: FontWeight.w500,
                  decoration: TextDecoration.lineThrough,
                  decorationColor: const Color(0xFFEF4444),
                  decorationThickness: 1.8,
                ),
              ),
            ),
            const SizedBox(height: 1),

            // Discounted price
            FittedBox(
              fit: BoxFit.scaleDown,
              alignment: Alignment.centerLeft,
              child: Text(
                '${_formatNumber(discountedPrice)} so‘m',
                style: TextStyle(
                  color: isSelected
                      ? (isDark
                          ? const Color(0xFFA5B4FC)
                          : const Color(0xFF4338CA))
                      : (isDark ? Colors.white : const Color(0xFF0F172A)),
                  fontSize: 15,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -0.2,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDynamicActionButton({
    required bool isDark,
    required bool reduceMotion,
    required String priceText,
    required VoidCallback onPressed,
  }) {
    Widget buttonContent = Container(
      width: double.infinity,
      height: 52,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF6366F1), Color(0xFF4F46E5)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF6366F1).withValues(alpha: 0.35),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.bolt_rounded,
                color: Color(0xFFFBBF24),
                size: 20,
              ),
              const SizedBox(width: 8),
              Flexible(
                child: Text(
                  '30% chegirma bilan olish • $priceText',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 0.1,
                  ),
                ),
              ),
            ],
          ),
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
      label: '30% chegirma bilan MathCity Pro olish',
      button: true,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: onPressed,
          child: buttonContent,
        ),
      ),
    );
  }
}
