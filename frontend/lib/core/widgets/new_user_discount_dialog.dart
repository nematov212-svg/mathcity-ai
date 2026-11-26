import 'dart:async';
import 'dart:ui' show ImageFilter;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

/// Professional Animated New User 30% Discount Dialog
/// Dark (#12102B) + Green-Turquoise (#3FA38A) border
/// Floating -30% Badge, 2-Column Price Card with 600ms Count-Up,
/// Live Server-Synchronized Countdown Timer (HH:MM:SS),
/// Pulse + Shine Green (#1D9E75) CTA Button
class NewUserDiscountDialog extends ConsumerStatefulWidget {
  final DateTime expiresAt;
  final int discountPercent;
  final int monthlyOriginalPrice;
  final int monthlyDiscountedPrice;
  final int yearlyOriginalPrice;
  final int yearlyDiscountedPrice;
  final VoidCallback? onDismiss;

  const NewUserDiscountDialog({
    super.key,
    required this.expiresAt,
    this.discountPercent = 30,
    this.monthlyOriginalPrice = 29000,
    this.monthlyDiscountedPrice = 20300,
    this.yearlyOriginalPrice = 250000,
    this.yearlyDiscountedPrice = 175000,
    this.onDismiss,
  });

  static Future<void> show(
    BuildContext context, {
    required DateTime expiresAt,
    int discountPercent = 30,
    int monthlyOriginalPrice = 29000,
    int monthlyDiscountedPrice = 20300,
    int yearlyOriginalPrice = 250000,
    int yearlyDiscountedPrice = 175000,
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
      ),
    );
  }

  @override
  ConsumerState<NewUserDiscountDialog> createState() => _NewUserDiscountDialogState();
}

class _NewUserDiscountDialogState extends ConsumerState<NewUserDiscountDialog>
    with TickerProviderStateMixin {
  late AnimationController _entranceController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;

  late AnimationController _floatingController;
  late Animation<double> _floatingAnimation;

  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  late AnimationController _shineController;

  late AnimationController _countUpController;
  late Animation<int> _monthlyCountAnimation;
  late Animation<int> _yearlyCountAnimation;

  Timer? _countdownTimer;
  Duration _remainingTime = Duration.zero;
  bool _isClosing = false;

  @override
  void initState() {
    super.initState();

    // 1. Entrance animation (scale 0.9 -> 1.0, fade)
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

    // 2. Slow floating for -30% badge
    _floatingController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2500),
    )..repeat(reverse: true);
    _floatingAnimation = Tween<double>(begin: -3.5, end: 3.5).animate(
      CurvedAnimation(parent: _floatingController, curve: Curves.easeInOutSine),
    );

    // 3. CTA Pulse
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..repeat(reverse: true);
    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.035).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );

    // 4. CTA Shine line sweep
    _shineController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 3000),
    )..repeat();

    // 5. Price count-up animation (600ms)
    _countUpController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
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

    // 6. Live countdown timer ticking every second
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

  @override
  void dispose() {
    _countdownTimer?.cancel();
    _entranceController.dispose();
    _floatingController.dispose();
    _pulseController.dispose();
    _shineController.dispose();
    _countUpController.dispose();
    super.dispose();
  }

  Future<void> _handleDismiss() async {
    if (_isClosing) return;
    _isClosing = true;

    widget.onDismiss?.call();

    if (mounted) {
      await _entranceController.reverse();
      if (mounted) {
        Navigator.of(context, rootNavigator: true).pop();
      }
    }
  }

  void _handleClaimDiscount() {
    HapticFeedback.mediumImpact();
    _handleDismiss();

    // Navigate to MathCity Pro screen with discount applied
    if (context.mounted) {
      context.push('/kids/pro');
    }
  }

  String _formatNumber(int number) {
    final str = number.toString();
    final reg = RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))');
    return str.replaceAllMapped(reg, (Match m) => '${m[1]} ');
  }

  @override
  Widget build(BuildContext context) {
    final mediaQuery = MediaQuery.of(context);
    final reduceMotion = mediaQuery.disableAnimations;

    final hours = _remainingTime.inHours.toString().padLeft(2, '0');
    final minutes = (_remainingTime.inMinutes % 60).toString().padLeft(2, '0');
    final seconds = (_remainingTime.inSeconds % 60).toString().padLeft(2, '0');
    final countdownString = '$hours:$minutes:$seconds';

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
                      Color(0xFF161334),
                      Color(0xFF12102B),
                      Color(0xFF0C0A20),
                    ],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(
                    color: const Color(0xFF3FA38A),
                    width: 1.4,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF3FA38A).withOpacity(0.35),
                      blurRadius: 30,
                      offset: const Offset(0, 8),
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
                      // Scrollable content body
                      SingleChildScrollView(
                        padding: const EdgeInsets.fromLTRB(20, 20, 20, 18),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            // 1. Top Green Pill Badge: "Yangi foydalanuvchilar uchun"
                            Semantics(
                              label: 'Yangi foydalanuvchilar uchun maxsus taklif',
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                                decoration: BoxDecoration(
                                  gradient: const LinearGradient(
                                    colors: [Color(0xFF1D9E75), Color(0xFF10815C)],
                                  ),
                                  borderRadius: BorderRadius.circular(20),
                                  boxShadow: [
                                    BoxShadow(
                                      color: const Color(0xFF1D9E75).withOpacity(0.40),
                                      blurRadius: 10,
                                      offset: const Offset(0, 2),
                                    ),
                                  ],
                                ),
                                child: const Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      Icons.card_giftcard_rounded,
                                      color: Colors.white,
                                      size: 15,
                                    ),
                                    SizedBox(width: 6),
                                    Text(
                                      'YANGI FOYDALANUVCHILAR UCHUN',
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
                            const SizedBox(height: 16),

                            // 2. Center: Floating "-30% CHEGIRMA" badge + Title
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                // Floating -30% round badge
                                reduceMotion
                                    ? _buildDiscountBadge()
                                    : AnimatedBuilder(
                                        animation: _floatingAnimation,
                                        builder: (context, child) {
                                          return Transform.translate(
                                            offset: Offset(0, _floatingAnimation.value),
                                            child: child,
                                          );
                                        },
                                        child: _buildDiscountBadge(),
                                      ),
                                const SizedBox(width: 14),

                                // Title and Subtitle
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        'Birinchi oy MathCity Pro',
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 17,
                                          fontWeight: FontWeight.w900,
                                          letterSpacing: 0.1,
                                        ),
                                      ),
                                      const SizedBox(height: 3),
                                      Text(
                                        'Faqat yangi hisoblar uchun',
                                        style: TextStyle(
                                          color: Colors.white.withOpacity(0.70),
                                          fontSize: 12,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),

                            // 3. Price Cards in Two Columns (Monthly & Yearly) with Count-Up
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
                                      child: _buildPlanPriceCard(
                                        title: 'Oylik',
                                        originalPrice: widget.monthlyOriginalPrice,
                                        discountedPrice: currentMonthly,
                                        isPopular: false,
                                      ),
                                    ),
                                    const SizedBox(width: 10),

                                    // Yearly Plan Card
                                    Expanded(
                                      child: _buildPlanPriceCard(
                                        title: 'Yillik',
                                        originalPrice: widget.yearlyOriginalPrice,
                                        discountedPrice: currentYearly,
                                        isPopular: true,
                                      ),
                                    ),
                                  ],
                                );
                              },
                            ),
                            const SizedBox(height: 16),

                            // 4. Countdown Timer: "Taklif tugashiga: HH:MM:SS"
                            Container(
                              width: double.infinity,
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9),
                              decoration: BoxDecoration(
                                color: const Color(0xFF10815C).withOpacity(0.15),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: const Color(0xFF3FA38A).withOpacity(0.35),
                                  width: 1,
                                ),
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Icon(
                                    Icons.timer_outlined,
                                    color: Color(0xFF3FA38A),
                                    size: 16,
                                  ),
                                  const SizedBox(width: 7),
                                  Text(
                                    'Taklif tugashiga: ',
                                    style: TextStyle(
                                      color: Colors.white.withOpacity(0.85),
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                  Text(
                                    countdownString,
                                    style: const TextStyle(
                                      color: Color(0xFFFFD66B),
                                      fontSize: 13,
                                      fontWeight: FontWeight.w900,
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 18),

                            // 5. Main Action CTA Button: "30% chegirma bilan olish"
                            _buildActionButton(
                              reduceMotion: reduceMotion,
                              onPressed: _handleClaimDiscount,
                            ),
                            const SizedBox(height: 6),

                            // 6. Secondary text button: "Keyinroq"
                            TextButton(
                              onPressed: _handleDismiss,
                              style: TextButton.styleFrom(
                                foregroundColor: Colors.white60,
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
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

                      // Close X button with minimum 44x44 tap area
                      Positioned(
                        top: 8,
                        right: 8,
                        child: Semantics(
                          label: 'Taklifni yopish',
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

  Widget _buildDiscountBadge() {
    return Container(
      width: 58,
      height: 58,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFFF9800), Color(0xFFF57C00), Color(0xFFE65100)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        shape: BoxShape.circle,
        border: Border.all(color: const Color(0xFFFFD700), width: 2),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFFF9800).withOpacity(0.40),
            blurRadius: 14,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: const Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              '-30%',
              style: TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.w900,
                letterSpacing: -0.5,
              ),
            ),
            Text(
              'CHEGIRMA',
              style: TextStyle(
                color: Colors.white,
                fontSize: 6.5,
                fontWeight: FontWeight.w800,
                letterSpacing: 0.4,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlanPriceCard({
    required String title,
    required int originalPrice,
    required int discountedPrice,
    required bool isPopular,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
      decoration: BoxDecoration(
        color: isPopular
            ? const Color(0xFF1D9E75).withOpacity(0.15)
            : Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isPopular ? const Color(0xFF3FA38A) : Colors.white.withOpacity(0.12),
          width: isPopular ? 1.6 : 1.0,
        ),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                title,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 13,
                  fontWeight: FontWeight.w800,
                ),
              ),
              if (isPopular) ...[
                const SizedBox(width: 4),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1D9E75),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Text(
                    'Tejamkor',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 8,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
              ],
            ],
          ),
          const SizedBox(height: 6),

          // Strikethrough original price
          Text(
            '${_formatNumber(originalPrice)} so‘m',
            style: TextStyle(
              color: Colors.white.withOpacity(0.45),
              fontSize: 11,
              fontWeight: FontWeight.w500,
              decoration: TextDecoration.lineThrough,
              decorationColor: const Color(0xFFEF4444),
              decorationThickness: 2,
            ),
          ),
          const SizedBox(height: 2),

          // Discounted price
          Text(
            '${_formatNumber(discountedPrice)} so‘m',
            style: const TextStyle(
              color: Color(0xFFFFD66B),
              fontSize: 15,
              fontWeight: FontWeight.w900,
              letterSpacing: 0.1,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton({
    required bool reduceMotion,
    required VoidCallback onPressed,
  }) {
    Widget buttonContent = Container(
      width: double.infinity,
      height: 52,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF1D9E75), Color(0xFF10815C)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF1D9E75).withOpacity(0.40),
            blurRadius: 18,
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

            // Button Text with badge icon
            const Center(
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.bolt_rounded,
                    color: Color(0xFFFFD66B),
                    size: 21,
                  ),
                  SizedBox(width: 8),
                  Text(
                    '30% chegirma bilan olish',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 15,
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
          borderRadius: BorderRadius.circular(14),
          onTap: onPressed,
          child: buttonContent,
        ),
      ),
    );
  }
}
