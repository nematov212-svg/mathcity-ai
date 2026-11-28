import 'dart:async';
import 'dart:math' as math;
import 'dart:ui' show ImageFilter;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Professional Apple & Ibrat-inspired Animated New User 30% Discount Dialog
/// - Entrance: Bottom spring slide & scale (0.9 -> 1.0, 450ms, Curves.easeOutBack) with backdrop blur
/// - Header: Bright Indigo -> Purple gradient with floating, rotating math symbols (+ − × ÷ π √)
/// - Badge: "-30%" pulsing (1.0 <-> 1.08) with continuous diagonal shimmer sweep
/// - Count-up price animation on plan switch (29 000 -> 20 300) with strikethrough original price
/// - Interactive Monthly / Yearly cards with scale & animated border; "Eng tejamkor" shining badge
/// - Timer: Digit flip/slide animation; turns vivid RED in the final hour (< 1h)
/// - CTA Button: Gradient + breathing glow, haptic bounce on tap, particle spark/confetti burst
/// - Exit: Smooth slide down with fade-out
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
      barrierColor: const Color(0xAA080318),
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
  // 1. Entrance & Exit animation
  late AnimationController _entranceController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  // 2. Floating math symbols in header
  late AnimationController _mathSymbolsController;

  // 3. "-30%" badge pulse & shimmer
  late AnimationController _badgePulseController;
  late Animation<double> _badgePulseAnimation;
  late AnimationController _shimmerController;

  // 4. CTA button breathing glow & bounce
  late AnimationController _glowController;
  late Animation<double> _glowAnimation;
  late AnimationController _buttonBounceController;
  late Animation<double> _buttonBounceAnimation;

  // 5. Price count-up animation
  late AnimationController _countUpController;
  late Animation<int> _priceCountAnimation;
  int _displayedPrice = 175000;
  int _targetPrice = 175000;

  // 6. Confetti & Spark particle animation
  late AnimationController _sparkController;
  final List<_SparkParticle> _sparks = [];

  // 7. Auto close controller
  AnimationController? _autoCloseController;

  Timer? _countdownTimer;
  Duration _remainingTime = Duration.zero;
  bool _isClosing = false;
  late String _selectedPlan; // 'monthly' | 'yearly'

  @override
  void initState() {
    super.initState();
    _selectedPlan = widget.initialPlan;
    _targetPrice = _selectedPlan == 'yearly'
        ? widget.yearlyDiscountedPrice
        : widget.monthlyDiscountedPrice;
    _displayedPrice = _targetPrice;

    // 1. Entrance spring animation (scale 0.90 -> 1.0, slide up 450ms)
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
      begin: const Offset(0, 0.12),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(parent: _entranceController, curve: Curves.easeOutBack),
    );
    _entranceController.forward();

    // 2. Floating math symbols background loop (6 seconds)
    _mathSymbolsController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 6),
    )..repeat();

    // 3. Badge pulse (1.0 <-> 1.08, 1200ms) & continuous shimmer (2600ms)
    _badgePulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat(reverse: true);
    _badgePulseAnimation = Tween<double>(begin: 1.0, end: 1.08).animate(
      CurvedAnimation(parent: _badgePulseController, curve: Curves.easeInOut),
    );

    _shimmerController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2600),
    )..repeat();

    // 4. CTA Breathing glow (1800ms)
    _glowController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1800),
    )..repeat(reverse: true);
    _glowAnimation = Tween<double>(begin: 0.25, end: 0.65).animate(
      CurvedAnimation(parent: _glowController, curve: Curves.easeInOut),
    );

    // 5. Button tap spring bounce (200ms)
    _buttonBounceController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 200),
    );
    _buttonBounceAnimation = Tween<double>(begin: 1.0, end: 0.96).animate(
      CurvedAnimation(parent: _buttonBounceController, curve: Curves.easeInOut),
    );

    // 6. Price count-up animation
    _countUpController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 180),
    );
    _priceCountAnimation = IntTween(
      begin: _targetPrice,
      end: _targetPrice,
    ).animate(
      CurvedAnimation(parent: _countUpController, curve: Curves.easeOutCubic),
    )..addListener(() {
        if (mounted) {
          setState(() {
            _displayedPrice = _priceCountAnimation.value;
          });
        }
      });

    // 7. Confetti / Sparks particle burst on CTA
    _sparkController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );
    _initSparks();

    // 8. Auto-close timer controller (5 seconds)
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

    // 9. Countdown timer
    _updateRemainingTime();
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      _updateRemainingTime();
    });
  }

  void _initSparks() {
    final rand = math.Random();
    _sparks.clear();
    const colors = [
      Color(0xFFFFD700),
      Color(0xFF8B5CF6),
      Color(0xFFEC4899),
      Color(0xFF38BDF8),
      Color(0xFF10B981),
      Color(0xFFF97316),
    ];
    for (int i = 0; i < 36; i++) {
      final angle = rand.nextDouble() * 2 * math.pi;
      final speed = 40.0 + rand.nextDouble() * 110.0;
      _sparks.add(
        _SparkParticle(
          dx: math.cos(angle) * speed,
          dy: math.sin(angle) * speed - 20,
          color: colors[rand.nextInt(colors.length)],
          size: 3.5 + rand.nextDouble() * 4.5,
          rotation: rand.nextDouble() * 2 * math.pi,
        ),
      );
    }
  }

  void _triggerSparksBurst() {
    _initSparks();
    _sparkController.forward(from: 0.0);
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
    _mathSymbolsController.dispose();
    _badgePulseController.dispose();
    _shimmerController.dispose();
    _glowController.dispose();
    _buttonBounceController.dispose();
    _countUpController.dispose();
    _sparkController.dispose();
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

  Future<void> _handleClaimDiscount() async {
    if (_isClosing) return;
    _isClosing = true;
    _autoCloseController?.stop();

    final chosenPlan = _selectedPlan;
    widget.onClaimWithPlan?.call(chosenPlan);
    widget.onDismiss?.call();

    // Haptic feedback + button spring bounce
    HapticFeedback.heavyImpact();
    _triggerSparksBurst();
    try {
      await _buttonBounceController.forward();
      await _buttonBounceController.reverse();
    } catch (_) {}

    if (mounted) {
      Navigator.of(context, rootNavigator: true).pop();
      if (widget.onClaimWithPlan == null) {
        context.push('/kids/pro?plan=$chosenPlan');
      }
    }
  }

  void _selectPlan(String plan) {
    if (_selectedPlan == plan) return;
    _pauseAutoClose();
    HapticFeedback.selectionClick();

    final prevPrice = _displayedPrice;
    final nextPrice = plan == 'yearly'
        ? widget.yearlyDiscountedPrice
        : widget.monthlyDiscountedPrice;

    setState(() {
      _selectedPlan = plan;
      _targetPrice = nextPrice;
      _displayedPrice = prevPrice;
    });

    _countUpController.reset();
    _priceCountAnimation = IntTween(
      begin: prevPrice,
      end: nextPrice,
    ).animate(
      CurvedAnimation(parent: _countUpController, curve: Curves.easeOutCubic),
    )..addListener(() {
        if (mounted) {
          setState(() {
            _displayedPrice = _priceCountAnimation.value;
          });
        }
      });
    _countUpController.forward();
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

    // Check if within final 1 hour for urgent RED styling
    final isFinalHour = _remainingTime.inHours < 1;

    // Countdown formatting (7-day rule): >24h -> X kun Y soat qoldi, <=24h -> HH:mm:ss
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
                  // Main Dialog Container
                  Container(
                    decoration: BoxDecoration(
                      color: isDark
                          ? const Color(0xFF130D26)
                          : const Color(0xFFFFFFFF),
                      borderRadius: BorderRadius.circular(26),
                      border: Border.all(
                        color: isDark
                            ? const Color(0xFF4C1D95).withOpacity(0.55)
                            : const Color(0xFFDDD6FE),
                        width: 1.5,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF7C3AED).withOpacity(0.32),
                          blurRadius: 36,
                          offset: const Offset(0, 12),
                        ),
                        BoxShadow(
                          color: Colors.black.withOpacity(isDark ? 0.65 : 0.16),
                          blurRadius: 20,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(26),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          // 1. Top Auto-Close Progress Bar (5s)
                          if (_autoCloseController != null)
                            AnimatedBuilder(
                              animation: _autoCloseController!,
                              builder: (context, _) {
                                return LinearProgressIndicator(
                                  value: 1.0 - _autoCloseController!.value,
                                  minHeight: 3.5,
                                  backgroundColor: Colors.transparent,
                                  valueColor:
                                      const AlwaysStoppedAnimation<Color>(
                                    Color(0xFFFBBF24),
                                  ),
                                );
                              },
                            ),

                          // 2. Header with Indigo -> Purple Gradient + Floating Math Symbols
                          _buildHeader(isDark, reduceMotion),

                          // 3. Main Dialog Body
                          Flexible(
                            child: SingleChildScrollView(
                              padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  // Plan Cards: Oylik and Yillik
                                  Row(
                                    children: [
                                      Expanded(
                                        child: _buildPlanCard(
                                          id: 'monthly',
                                          title: 'Oylik',
                                          badge: null,
                                          originalPrice:
                                              widget.monthlyOriginalPrice,
                                          discountedPrice:
                                              widget.monthlyDiscountedPrice,
                                          periodText: '/ oy',
                                          isSelected:
                                              _selectedPlan == 'monthly',
                                          isDark: isDark,
                                          reduceMotion: reduceMotion,
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: _buildPlanCard(
                                          id: 'yearly',
                                          title: 'Yillik',
                                          badge: 'Eng tejamkor',
                                          originalPrice:
                                              widget.yearlyOriginalPrice,
                                          discountedPrice:
                                              widget.yearlyDiscountedPrice,
                                          periodText: '/ yil',
                                          isSelected: _selectedPlan == 'yearly',
                                          isDark: isDark,
                                          reduceMotion: reduceMotion,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 12),

                                  // Features Mini Checklist (3 key bullets)
                                  _buildFeatureRow(
                                    Icons.bolt_rounded,
                                    'Barcha 1–4 sinf darslari va 20 ta nazorat testi',
                                    isDark,
                                  ),
                                  const SizedBox(height: 5),
                                  _buildFeatureRow(
                                    Icons.smart_toy_rounded,
                                    'Cheksiz AI Ziyo Ustoz yordamchisi',
                                    isDark,
                                  ),
                                  const SizedBox(height: 5),
                                  _buildFeatureRow(
                                    Icons.monetization_on_rounded,
                                    'Har darsda 3 baravar ko‘p coin va sovrinlar',
                                    isDark,
                                  ),
                                  const SizedBox(height: 12),

                                  // Flip / Slide Server Countdown Timer
                                  _buildCountdownTimer(
                                    countdownString: countdownString,
                                    isFinalHour: isFinalHour,
                                    isDark: isDark,
                                    reduceMotion: reduceMotion,
                                  ),
                                  const SizedBox(height: 14),

                                  // CTA Button with Breathing Glow & Bounce
                                  _buildCtaButton(
                                    price: _displayedPrice,
                                    isDark: isDark,
                                    reduceMotion: reduceMotion,
                                  ),
                                  const SizedBox(height: 4),

                                  // Secondary Action: "Keyinroq"
                                  TextButton(
                                    onPressed: _handleDismiss,
                                    style: TextButton.styleFrom(
                                      foregroundColor: isDark
                                          ? const Color(0xFF94A3B8)
                                          : const Color(0xFF64748B),
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 16, vertical: 4),
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
                          ),
                        ],
                      ),
                    ),
                  ),

                  // Close (X) Circular Button (Top Right)
                  Positioned(
                    top: 10,
                    right: 10,
                    child: Semantics(
                      label: 'Yopish',
                      button: true,
                      child: Material(
                        color: Colors.transparent,
                        child: InkWell(
                          borderRadius: BorderRadius.circular(22),
                          onTap: _handleDismiss,
                          child: Container(
                            width: 34,
                            height: 34,
                            decoration: BoxDecoration(
                              color: Colors.black.withOpacity(0.35),
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: Colors.white.withOpacity(0.22),
                                width: 1,
                              ),
                            ),
                            child: const Icon(
                              Icons.close_rounded,
                              color: Colors.white,
                              size: 18,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),

                  // Confetti / Sparks Particle Overlay
                  if (!reduceMotion)
                    Positioned.fill(
                      child: IgnorePointer(
                        child: AnimatedBuilder(
                          animation: _sparkController,
                          builder: (context, _) {
                            if (_sparkController.value == 0 ||
                                _sparkController.value == 1.0) {
                              return const SizedBox.shrink();
                            }
                            return CustomPaint(
                              painter: _SparksPainter(
                                progress: _sparkController.value,
                                sparks: _sparks,
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

  /// Header with Indigo -> Purple gradient and floating math symbols (+ − × ÷ π √)
  Widget _buildHeader(bool isDark, bool reduceMotion) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(16, 18, 16, 14),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Color(0xFF3730A3), // Deep Indigo
            Color(0xFF6D28D9), // Vibrant Purple
            Color(0xFF7C3AED), // Violet
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Floating math symbols background
          if (!reduceMotion)
            Positioned.fill(
              child: RepaintBoundary(
                child: AnimatedBuilder(
                  animation: _mathSymbolsController,
                  builder: (context, _) {
                    return CustomPaint(
                      painter: _FloatingMathSymbolsPainter(
                        progress: _mathSymbolsController.value,
                      ),
                    );
                  },
                ),
              ),
            ),

          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Pulsing & Shimmering -30% Badge
              AnimatedBuilder(
                animation: _badgePulseAnimation,
                builder: (context, child) {
                  final scale =
                      reduceMotion ? 1.0 : _badgePulseAnimation.value;
                  return Transform.scale(
                    scale: scale,
                    child: child,
                  );
                },
                child: _buildPulsingShimmerBadge(),
              ),
              const SizedBox(height: 8),

              // Title
              const Text(
                'MathCity Pro ga ulaning',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18.5,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -0.3,
                  shadows: [
                    Shadow(
                      color: Colors.black38,
                      offset: Offset(0, 2),
                      blurRadius: 4,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 3),

              // Subtitle
              Text(
                'Yangi o‘quvchilar uchun eksklyuziv chegirma',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.white.withOpacity(0.90),
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  /// Shimmering -30% Pill Badge
  Widget _buildPulsingShimmerBadge() {
    return AnimatedBuilder(
      animation: _shimmerController,
      builder: (context, child) {
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFFF59E0B), Color(0xFFEF4444)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFFF59E0B).withOpacity(0.55),
                blurRadius: 14,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(20),
            child: Stack(
              alignment: Alignment.center,
              children: [
                const FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.local_fire_department_rounded,
                          color: Colors.white, size: 14),
                      SizedBox(width: 4),
                      Text(
                        'MAXSUS TAKLIF • -30%',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 11,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ],
                  ),
                ),

                // Shimmer overlay bar
                Positioned.fill(
                  child: Transform.translate(
                    offset: Offset(
                      (_shimmerController.value * 200) - 80,
                      0,
                    ),
                    child: Container(
                      width: 30,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            Colors.white.withOpacity(0.0),
                            Colors.white.withOpacity(0.45),
                            Colors.white.withOpacity(0.0),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  /// Plan Card: Monthly or Yearly with smooth scale and border glow
  Widget _buildPlanCard({
    required String id,
    required String title,
    required String? badge,
    required int originalPrice,
    required int discountedPrice,
    required String periodText,
    required bool isSelected,
    required bool isDark,
    required bool reduceMotion,
  }) {
    final activeBorderColor =
        isDark ? const Color(0xFF8B5CF6) : const Color(0xFF6D28D9);
    final inactiveBorderColor = isDark
        ? const Color(0xFF281D45)
        : const Color(0xFFE2E8F0);

    final activeBgColor = isDark
        ? const Color(0xFF1E143B)
        : const Color(0xFFF5F3FF);
    final inactiveBgColor = isDark
        ? const Color(0xFF160F2C)
        : const Color(0xFFF8FAFC);

    return Semantics(
      label: '$title rejasi, narxi ${_formatNumber(discountedPrice)} so‘m',
      button: true,
      selected: isSelected,
      child: GestureDetector(
        onTap: () => _selectPlan(id),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 240),
          curve: Curves.easeOutCubic,
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? activeBgColor : inactiveBgColor,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isSelected ? activeBorderColor : inactiveBorderColor,
              width: isSelected ? 2.0 : 1.2,
            ),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: activeBorderColor.withOpacity(0.35),
                      blurRadius: 12,
                      offset: const Offset(0, 3),
                    ),
                  ]
                : [],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top Row: Title + Badge / Radio Icon
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Flexible(
                    child: Text(
                      title,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        color: isDark ? Colors.white : const Color(0xFF1E293B),
                        fontSize: 13,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                  const SizedBox(width: 4),
                  Icon(
                    isSelected
                        ? Icons.check_circle_rounded
                        : Icons.radio_button_unchecked_rounded,
                    size: 16,
                    color: isSelected
                        ? activeBorderColor
                        : (isDark
                            ? const Color(0xFF64748B)
                            : const Color(0xFF94A3B8)),
                  ),
                ],
              ),

              if (badge != null) ...[
                const SizedBox(height: 5),
                _buildBestValueBadge(badge),
              ] else
                const SizedBox(height: 22),

              const SizedBox(height: 6),

              // Original strikethrough price
              Text(
                '${_formatNumber(originalPrice)} so‘m',
                style: TextStyle(
                  color: isDark
                      ? const Color(0xFF94A3B8)
                      : const Color(0xFF94A3B8),
                  fontSize: 10.5,
                  fontWeight: FontWeight.w600,
                  decoration: TextDecoration.lineThrough,
                  decorationColor: const Color(0xFFEF4444),
                  decorationThickness: 1.8,
                ),
              ),

              const SizedBox(height: 2),

              // Discounted price with FittedBox to prevent any 320px overflow
              FittedBox(
                fit: BoxFit.scaleDown,
                alignment: Alignment.centerLeft,
                child: Text(
                  '${_formatNumber(discountedPrice)} so‘m',
                  style: TextStyle(
                    color: isDark ? Colors.white : const Color(0xFF0F172A),
                    fontSize: 14.5,
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBestValueBadge(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFF59E0B), Color(0xFFD97706)],
        ),
        borderRadius: BorderRadius.circular(6),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFF59E0B).withOpacity(0.4),
            blurRadius: 6,
          ),
        ],
      ),
      child: Text(
        text,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 9.5,
          fontWeight: FontWeight.w800,
          letterSpacing: 0.2,
        ),
      ),
    );
  }

  Widget _buildFeatureRow(IconData icon, String text, bool isDark) {
    return Row(
      children: [
        Container(
          width: 19,
          height: 19,
          decoration: BoxDecoration(
            color: const Color(0xFF8B5CF6).withOpacity(0.20),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: const Color(0xFF8B5CF6), size: 11.5),
        ),
        const SizedBox(width: 7),
        Expanded(
          child: Text(
            text,
            style: TextStyle(
              color: isDark ? const Color(0xFFCBD5E1) : const Color(0xFF475569),
              fontSize: 11,
              fontWeight: FontWeight.w600,
              height: 1.25,
            ),
          ),
        ),
      ],
    );
  }

  /// Flip / Slide Countdown Timer (FittedBox protected against any 320px overflow)
  Widget _buildCountdownTimer({
    required String countdownString,
    required bool isFinalHour,
    required bool isDark,
    required bool reduceMotion,
  }) {
    final timerColor = isFinalHour
        ? const Color(0xFFEF4444) // Urgent red in the last hour
        : (isDark ? const Color(0xFFFBBF24) : const Color(0xFFD97706));

    final timerBgColor = isFinalHour
        ? const Color(0xFFEF4444).withOpacity(0.12)
        : (isDark ? const Color(0xFF1E143B) : const Color(0xFFFEF3C7));

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
      decoration: BoxDecoration(
        color: timerBgColor,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: timerColor.withOpacity(0.35),
          width: 1.2,
        ),
      ),
      child: FittedBox(
        fit: BoxFit.scaleDown,
        alignment: Alignment.center,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              isFinalHour ? Icons.warning_amber_rounded : Icons.timer_outlined,
              color: timerColor,
              size: 15,
            ),
            const SizedBox(width: 6),
            Text(
              'Chegirma tugashiga: ',
              style: TextStyle(
                color: isDark ? Colors.white70 : const Color(0xFF475569),
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
            // AnimatedSwitcher for smooth flip / slide effect on digit change
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 250),
              transitionBuilder: (child, animation) {
                return SlideTransition(
                  position: Tween<Offset>(
                    begin: const Offset(0.0, -0.35),
                    end: Offset.zero,
                  ).animate(animation),
                  child: FadeTransition(opacity: animation, child: child),
                );
              },
              child: Text(
                countdownString,
                key: ValueKey<String>(countdownString),
                style: TextStyle(
                  color: timerColor,
                  fontSize: 13,
                  fontWeight: FontWeight.w900,
                  fontFeatures: const [FontFeature.tabularFigures()],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Gradient CTA Button with Breathing Glow & Bounce
  Widget _buildCtaButton({
    required int price,
    required bool isDark,
    required bool reduceMotion,
  }) {
    return AnimatedBuilder(
      animation: _glowAnimation,
      builder: (context, child) {
        final glowOpacity = reduceMotion ? 0.35 : _glowAnimation.value;
        return AnimatedBuilder(
          animation: _buttonBounceAnimation,
          builder: (context, _) {
            final bounceScale =
                reduceMotion ? 1.0 : _buttonBounceAnimation.value;
            return Transform.scale(
              scale: bounceScale,
              child: Container(
                width: double.infinity,
                height: 50,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [
                      Color(0xFF6366F1), // Indigo
                      Color(0xFF7C3AED), // Purple
                      Color(0xFF8B5CF6), // Violet
                    ],
                    begin: Alignment.centerLeft,
                    end: Alignment.centerRight,
                  ),
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF7C3AED).withOpacity(glowOpacity),
                      blurRadius: 18,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    borderRadius: BorderRadius.circular(16),
                    onTap: _handleClaimDiscount,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.stars_rounded,
                              color: Color(0xFFFFD700), size: 20),
                          const SizedBox(width: 7),
                          Flexible(
                            child: FittedBox(
                              fit: BoxFit.scaleDown,
                              child: Text(
                                '30% chegirma bilan olish • ${_formatNumber(price)} so‘m',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: 0.2,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 5),
                          const Icon(Icons.arrow_forward_rounded,
                              color: Colors.white, size: 17),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }
}

/// Floating Math Symbols Custom Painter for Header
class _FloatingMathSymbolsPainter extends CustomPainter {
  final double progress;

  _FloatingMathSymbolsPainter({required this.progress});

  static const _symbols = ['+', '−', '×', '÷', 'π', '√', '%', '∑'];
  static const _positions = [
    Offset(0.12, 0.25),
    Offset(0.28, 0.70),
    Offset(0.48, 0.20),
    Offset(0.68, 0.65),
    Offset(0.85, 0.30),
    Offset(0.92, 0.75),
    Offset(0.38, 0.45),
    Offset(0.78, 0.15),
  ];

  @override
  void paint(Canvas canvas, Size size) {
    for (int i = 0; i < _symbols.length; i++) {
      final basePos = _positions[i];
      // Vertical upward drift with looping reset
      final yOffset = ((basePos.dy - progress * 0.35) % 1.0) * size.height;
      final xOffset =
          (basePos.dx + math.sin(progress * 2 * math.pi + i) * 0.04) *
              size.width;

      final textPainter = TextPainter(
        text: TextSpan(
          text: _symbols[i],
          style: TextStyle(
            color: Colors.white.withOpacity(0.16),
            fontSize: 16 + (i % 3) * 3.0,
            fontWeight: FontWeight.w700,
          ),
        ),
        textDirection: TextDirection.ltr,
      )..layout();

      canvas.save();
      canvas.translate(xOffset, yOffset);
      canvas.rotate(progress * math.pi * 0.5 + i);
      textPainter.paint(
        canvas,
        Offset(-textPainter.width / 2, -textPainter.height / 2),
      );
      canvas.restore();
    }
  }

  @override
  bool shouldRepaint(covariant _FloatingMathSymbolsPainter oldDelegate) {
    return oldDelegate.progress != progress;
  }
}

/// Lightweight Spark / Confetti Particle Model & Painter
class _SparkParticle {
  final double dx;
  final double dy;
  final Color color;
  final double size;
  final double rotation;

  _SparkParticle({
    required this.dx,
    required this.dy,
    required this.color,
    required this.size,
    required this.rotation,
  });
}

class _SparksPainter extends CustomPainter {
  final double progress;
  final List<_SparkParticle> sparks;

  _SparksPainter({required this.progress, required this.sparks});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height * 0.75);
    final paint = Paint()..style = PaintingStyle.fill;

    for (final p in sparks) {
      final currentX = center.dx + p.dx * progress;
      final currentY = center.dy + p.dy * progress + (progress * progress * 80);
      final alpha = ((1.0 - progress) * 255).clamp(0, 255).toInt();

      paint.color = p.color.withAlpha(alpha);

      canvas.save();
      canvas.translate(currentX, currentY);
      canvas.rotate(p.rotation + progress * 4);
      canvas.drawCircle(Offset.zero, p.size * (1.0 - progress * 0.3), paint);
      canvas.restore();
    }
  }

  @override
  bool shouldRepaint(covariant _SparksPainter oldDelegate) {
    return oldDelegate.progress != progress;
  }
}
