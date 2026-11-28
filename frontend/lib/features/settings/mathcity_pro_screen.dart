import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../core/network/api_client.dart';
import '../../core/pricing/pricing_provider.dart';
import '../../core/pricing/pricing_model.dart';
import '../../core/responsive/screen_size.dart';
import '../../core/widgets/promo_dialog_controller.dart';
import '../../shared/providers/student_provider.dart';

class MathCityProScreen extends ConsumerStatefulWidget {
  final String? initialPlan;
  const MathCityProScreen({super.key, this.initialPlan});

  @override
  ConsumerState<MathCityProScreen> createState() => _MathCityProScreenState();
}

class _MathCityProScreenState extends ConsumerState<MathCityProScreen>
    with TickerProviderStateMixin {
  late AnimationController _mascotController;
  late AnimationController _starController;
  late AnimationController _pulseController;

  bool _isLoading = false;
  int _selectedPlanIndex = 0; // 0 = 1 oylik, 1 = 1 yillik

  String _formatNumber(int number) {
    final str = number.toString();
    final reg = RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))');
    return str.replaceAllMapped(reg, (Match m) => '${m[1]} ');
  }

  @override
  void initState() {
    super.initState();

    if (widget.initialPlan != null) {
      if (widget.initialPlan!.toLowerCase().contains('year')) {
        _selectedPlanIndex = 1;
      } else {
        _selectedPlanIndex = 0;
      }
    }

    // Entering the Pro screen cancels remaining auto-promos
    PromoDialogController.instance.cancelPromoFlow();

    _mascotController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 3400),
    )..repeat(reverse: true);

    _starController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2200),
    )..repeat(reverse: true);

    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2200),
    )..repeat();
  }

  @override
  void dispose() {
    _mascotController.dispose();
    _starController.dispose();
    _pulseController.dispose();
    super.dispose();
  }

  void _handlePurchase() {
    _showPaymentSheet(context);
  }

  void _showPaymentSheet(BuildContext context) {
    final isYearly = _selectedPlanIndex == 1;
    final planType = isYearly ? 'YEARLY' : 'MONTHLY';
    final pricing = ref.read(pricingProvider).data;
    final hasDiscount = pricing.hasActiveDiscount;
    final monthlyPrice = (hasDiscount && pricing.monthlyPlan.isDiscounted)
        ? pricing.monthlyPlan.finalPrice
        : pricing.monthlyPlan.basePrice;
    final yearlyPrice = (hasDiscount && pricing.yearlyPlan.isDiscounted)
        ? pricing.yearlyPlan.finalPrice
        : pricing.yearlyPlan.basePrice;
    final amountUzs = isYearly ? yearlyPrice : monthlyPrice;
    final amountFormatted = '${_formatNumber(amountUzs)} so‘m';

    String selectedProvider = 'PAYME';
    bool isProcessing = false;
    String? sheetError;

    showModalBottomSheet<void>(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (BuildContext sheetCtx) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            final providerLogo = selectedProvider == 'PAYME'
                ? 'assets/images/payme_logo.png'
                : 'assets/images/click_logo.png';
            final providerName =
                selectedProvider == 'PAYME' ? 'Payme' : 'Click';

            return Container(
              constraints: BoxConstraints(
                maxHeight: MediaQuery.of(sheetCtx).size.height * 0.9,
              ),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Color(0xFF261868),
                    Color(0xFF160E42),
                  ],
                ),
                borderRadius:
                    const BorderRadius.vertical(top: Radius.circular(28)),
                border: Border.all(
                  color: Colors.white.withOpacity(0.12),
                  width: 1.2,
                ),
                boxShadow: const [
                  BoxShadow(
                    color: Colors.black54,
                    blurRadius: 30,
                    offset: Offset(0, -8),
                  ),
                ],
              ),
              child: SafeArea(
                top: false,
                child: SingleChildScrollView(
                  padding: const EdgeInsets.fromLTRB(20, 14, 20, 28),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Handle bar
                      Container(
                        width: 44,
                        height: 5,
                        decoration: BoxDecoration(
                          color: Colors.white24,
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      const SizedBox(height: 18),

                      // Sarlavha
                      const Text(
                        'To‘lov usulini tanlang',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 21,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 0.2,
                        ),
                      ),
                      const SizedBox(height: 8),

                      // Tarif ma'lumoti pilli
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 14, vertical: 6),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFD66B).withOpacity(0.12),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: const Color(0xFFFFD66B).withOpacity(0.35),
                            width: 1,
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              isYearly
                                  ? Icons.stars_rounded
                                  : Icons.calendar_today_rounded,
                              size: 15,
                              color: const Color(0xFFFFD66B),
                            ),
                            const SizedBox(width: 7),
                            Text(
                              isYearly
                                  ? '1 Yillik tarif • $amountFormatted'
                                  : '1 Oylik tarif • $amountFormatted',
                              style: const TextStyle(
                                color: Color(0xFFFFD66B),
                                fontSize: 13,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                            if (isYearly) ...[
                              const SizedBox(width: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 5, vertical: 1.5),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFFFD66B),
                                  borderRadius: BorderRadius.circular(5),
                                ),
                                child: const Text(
                                  'ENG TEJAMKOR',
                                  style: TextStyle(
                                    color: Color(0xFF1C1450),
                                    fontSize: 9,
                                    fontWeight: FontWeight.w900,
                                  ),
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                      const SizedBox(height: 6),

                      // Trust note
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.lock_rounded,
                            size: 13,
                            color: const Color(0xFFA9A4CF).withOpacity(0.8),
                          ),
                          const SizedBox(width: 5),
                          const Text(
                            '256-bit xavfsiz to‘lov shlyuzi orqali',
                            style: TextStyle(
                              color: Color(0xFFA9A4CF),
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 22),

                      // Payme Card
                      _buildPaymentProviderCard(
                        title: 'Payme',
                        subtitle: 'Uzcard, Humo, Visa, Mastercard',
                        logoAsset: 'assets/images/payme_logo.png',
                        brandColor: const Color(0xFF00CCCC),
                        fallbackIcon: Icons.credit_card_rounded,
                        isSelected: selectedProvider == 'PAYME',
                        onTap: isProcessing
                            ? () {}
                            : () => setSheetState(() {
                                  selectedProvider = 'PAYME';
                                  sheetError = null;
                                }),
                      ),
                      const SizedBox(height: 12),

                      // Click Card
                      _buildPaymentProviderCard(
                        title: 'Click',
                        subtitle: 'Click Up, Uzcard, Humo',
                        logoAsset: 'assets/images/click_logo.png',
                        brandColor: const Color(0xFF0073FF),
                        fallbackIcon: Icons.touch_app_rounded,
                        isSelected: selectedProvider == 'CLICK',
                        onTap: isProcessing
                            ? () {}
                            : () => setSheetState(() {
                                  selectedProvider = 'CLICK';
                                  sheetError = null;
                                }),
                      ),

                      const SizedBox(height: 20),

                      // Error message if any
                      if (sheetError != null) ...[
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(
                              horizontal: 14, vertical: 10),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEF4444).withOpacity(0.15),
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(
                              color: const Color(0xFFEF4444).withOpacity(0.4),
                              width: 1,
                            ),
                          ),
                          child: Row(
                            children: [
                              const Icon(
                                Icons.error_outline_rounded,
                                color: Color(0xFFEF4444),
                                size: 18,
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  sheetError!,
                                  style: const TextStyle(
                                    color: Color(0xFFFCA5A5),
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 14),
                      ],

                      // Action Button with selected provider logo & dynamic price
                      SizedBox(
                        width: double.infinity,
                        height: 56,
                        child: DecoratedBox(
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFFFFD66B), Color(0xFFF5A623)],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            borderRadius: BorderRadius.circular(28),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFFFFD66B).withOpacity(0.4),
                                blurRadius: 18,
                                offset: const Offset(0, 5),
                              ),
                            ],
                          ),
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.transparent,
                              shadowColor: Colors.transparent,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(28),
                              ),
                            ),
                            onPressed: isProcessing
                                ? null
                                : () async {
                                    setSheetState(() {
                                      isProcessing = true;
                                      sheetError = null;
                                    });

                                    final success = await _executePayment(
                                      selectedProvider,
                                      planType,
                                      amountUzs,
                                    );

                                    if (!sheetCtx.mounted) return;

                                    if (success) {
                                      Navigator.of(sheetCtx).pop();
                                    } else {
                                      setSheetState(() {
                                        isProcessing = false;
                                        sheetError =
                                            'To‘lov amalga oshmadi. Qayta urinib ko‘ring.';
                                      });
                                    }
                                  },
                            child: isProcessing
                                ? const SizedBox(
                                    width: 24,
                                    height: 24,
                                    child: CircularProgressIndicator(
                                      color: Color(0xFF1C1450),
                                      strokeWidth: 2.6,
                                    ),
                                  )
                                : Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Container(
                                        width: 26,
                                        height: 26,
                                        decoration: BoxDecoration(
                                          color: Colors.white,
                                          borderRadius:
                                              BorderRadius.circular(7),
                                        ),
                                        padding: const EdgeInsets.all(3),
                                        child: Image.asset(
                                          providerLogo,
                                          fit: BoxFit.contain,
                                        ),
                                      ),
                                      const SizedBox(width: 10),
                                      Flexible(
                                        child: FittedBox(
                                          fit: BoxFit.scaleDown,
                                          child: Text(
                                            '$providerName orqali $amountFormatted to‘lash',
                                            style: const TextStyle(
                                              fontSize: 16,
                                              fontWeight: FontWeight.w900,
                                              color: Color(0xFF1C1450),
                                            ),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      const Text(
                        'Xarid amalga oshirilgach, barcha Pro imkoniyatlar darhol faollashadi',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Color(0xFF9C96C8),
                          fontSize: 11,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildPaymentProviderCard({
    required String title,
    required String subtitle,
    required String logoAsset,
    required Color brandColor,
    required IconData fallbackIcon,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: AnimatedScale(
        scale: isSelected ? 1.02 : 1.0,
        duration: const Duration(milliseconds: 180),
        curve: Curves.easeOutBack,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 180),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          decoration: BoxDecoration(
            color: isSelected
                ? const Color(0xFF2E2070).withOpacity(0.75)
                : Colors.white.withOpacity(0.05),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: isSelected
                  ? const Color(0xFFFFD66B)
                  : Colors.white.withOpacity(0.12),
              width: isSelected ? 2.0 : 1.2,
            ),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: const Color(0xFFFFD66B).withOpacity(0.24),
                      blurRadius: 16,
                      spreadRadius: 1,
                      offset: const Offset(0, 4),
                    ),
                  ]
                : null,
          ),
          child: Row(
            children: [
              // 56x56 Container with radius 16 and light background
              Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                padding: const EdgeInsets.all(7),
                child: Image.asset(
                  logoAsset,
                  fit: BoxFit.contain,
                  errorBuilder: (_, __, ___) => Icon(
                    fallbackIcon,
                    color: brandColor,
                    size: 28,
                  ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Text(
                            title,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 17,
                              fontWeight: FontWeight.w800,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: brandColor.withOpacity(0.18),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            isSelected ? 'Tanlandi' : 'Tezkor',
                            style: TextStyle(
                              color: brandColor,
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      subtitle,
                      style: const TextStyle(
                        color: Color(0xFFA9A4CF),
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 10),
              // Animated selection indicator
              AnimatedContainer(
                duration: const Duration(milliseconds: 180),
                width: 26,
                height: 26,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: isSelected
                        ? const Color(0xFFFFD66B)
                        : Colors.white.withOpacity(0.25),
                    width: 2,
                  ),
                  color:
                      isSelected ? const Color(0xFFFFD66B) : Colors.transparent,
                ),
                child: isSelected
                    ? const Icon(
                        Icons.check_rounded,
                        color: Color(0xFF1C1450),
                        size: 17,
                      )
                    : null,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<bool> _executePayment(
      String provider, String planType, int amountUzs) async {
    setState(() => _isLoading = true);
    try {
      final orderRes =
          await ApiClient().dio.post('/payments/create-order', data: {
        'provider': provider,
        'planType': planType,
      });

      if (orderRes.data['success'] == true && orderRes.data['data'] != null) {
        final orderId = orderRes.data['data']['orderId'] as String;

        final confirmRes =
            await ApiClient().dio.post('/payments/confirm-order', data: {
          'orderId': orderId,
          'provider': provider,
        });

        if (confirmRes.data['success'] == true) {
          await ref.read(studentProvider.notifier).refreshProfile();
          await ref.read(pricingProvider.notifier).refreshPricing();
          if (!mounted) return true;
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                  'Tabriklaymiz! $provider orqali MathCity Pro obunasi muvaffaqiyatli faollashtirildi!'),
              backgroundColor: const Color(0xFF10B981),
              behavior: SnackBarBehavior.floating,
            ),
          );
          return true;
        }
      }

      // Direct fallback
      final success = await ref.read(studentProvider.notifier).activatePro(
            planType: planType,
            provider: provider,
          );
      if (!mounted) return success;
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
                'Tabriklaymiz! $provider orqali MathCity Pro obunasi muvaffaqiyatli faollashtirildi!'),
            backgroundColor: const Color(0xFF10B981),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
      return success;
    } catch (_) {
      return false;
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final student = ref.watch(studentProvider).student;
    final isPro = student?.subscription.isProActive == true;
    final disableAnim = MediaQuery.of(context).disableAnimations;
    final pricing = ref.watch(pricingProvider).data;
    final hasActiveDiscount = !isPro && pricing.hasActiveDiscount;
    if (!context.isCompact) {
      return _buildWideProScreen(
        context,
        student: student,
        isPro: isPro,
        disableAnim: disableAnim,
        pricing: pricing,
        hasActiveDiscount: hasActiveDiscount,
        screenWidth: screenWidth,
      );
    }

    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            center: Alignment(0.0, -0.4),
            radius: 1.2,
            colors: [
              Color(0xFF4A2BD6), // vibrant purple center glow
              Color(0xFF1C1450), // deep violet
              Color(0xFF0C0A22), // cosmic dark background
            ],
            stops: [0.0, 0.55, 1.0],
          ),
        ),
        child: SafeArea(
          child: Stack(
            children: [
              // Scrollable Body
              Positioned.fill(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.only(
                      left: 20, right: 20, top: 12, bottom: 120),
                  child: Column(
                    children: [
                      // Top Bar
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Semantics(
                            label: 'Yopish',
                            button: true,
                            child: InkWell(
                              onTap: () => context.pop(),
                              borderRadius: BorderRadius.circular(22),
                              child: Container(
                                width: 44,
                                height: 44,
                                alignment: Alignment.center,
                                child: Container(
                                  width: 40,
                                  height: 40,
                                  decoration: BoxDecoration(
                                    color: Colors.white.withOpacity(0.12),
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                      color: Colors.white.withOpacity(0.15),
                                      width: 1,
                                    ),
                                  ),
                                  child: const Icon(
                                    Icons.close_rounded,
                                    color: Colors.white,
                                    size: 20,
                                  ),
                                ),
                              ),
                            ),
                          ),
                          const Text(
                            'MathCity PRO',
                            style: TextStyle(
                              color: Color(0xFFFFD66B),
                              fontSize: 15,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 0.6,
                            ),
                          ),
                          const SizedBox(width: 44), // Balancer
                        ],
                      ),

                      const SizedBox(height: 12),

                      // Mascot Robot Hero with Halo and Stars (Balanced EdTech Size)
                      SizedBox(
                        width: 180,
                        height: 140,
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            // Radial Halo Glow behind robot
                            RepaintBoundary(
                              child: AnimatedBuilder(
                                animation: _mascotController,
                                builder: (context, child) {
                                  final scale = disableAnim
                                      ? 1.0
                                      : (1.0 + _mascotController.value * 0.08);
                                  final opacity = disableAnim
                                      ? 0.7
                                      : (0.55 + _mascotController.value * 0.45);
                                  return Transform.scale(
                                    scale: scale,
                                    child: Container(
                                      width: 140,
                                      height: 140,
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        gradient: RadialGradient(
                                          colors: [
                                            const Color(0xFFFFD66B)
                                                .withOpacity(opacity * 0.4),
                                            const Color(0xFF6C47FF)
                                                .withOpacity(opacity * 0.25),
                                            Colors.transparent,
                                          ],
                                          stops: const [0.0, 0.45, 1.0],
                                        ),
                                      ),
                                    ),
                                  );
                                },
                              ),
                            ),

                            // Sparkling Star 1 (Top-Left)
                            Positioned(
                              top: 14,
                              left: 16,
                              child: _buildSparkle(
                                  14, _starController, 0.0, disableAnim),
                            ),

                            // Sparkling Star 2 (Top-Right)
                            Positioned(
                              top: 18,
                              right: 18,
                              child: _buildSparkle(
                                  12, _starController, 0.4, disableAnim),
                            ),

                            // Robot Mascot Image
                            RepaintBoundary(
                              child: AnimatedBuilder(
                                animation: _mascotController,
                                builder: (context, child) {
                                  final floatOffset = disableAnim
                                      ? 0.0
                                      : math.sin(_mascotController.value *
                                              math.pi) *
                                          6.0;
                                  return Transform.translate(
                                    offset: Offset(0, -floatOffset),
                                    child: child,
                                  );
                                },
                                child: Image.asset(
                                  'assets/logo.png',
                                  width: 110,
                                  height: 110,
                                  fit: BoxFit.contain,
                                  errorBuilder: (_, __, ___) => Image.asset(
                                    'assets/images/mathcity_logo.png',
                                    width: 110,
                                    height: 110,
                                    fit: BoxFit.contain,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 10),

                      // Title & Subtitle
                      RichText(
                        textAlign: TextAlign.center,
                        text: const TextSpan(
                          text: 'MathCity ',
                          style: TextStyle(
                            fontFamily: 'Nunito',
                            fontSize: 26,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                          ),
                          children: [
                            TextSpan(
                              text: 'Pro',
                              style: TextStyle(
                                color: Color(0xFFFFD66B),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'Matematikani o‘ynab va tushunib o‘rganing',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: Color(0xFFA9A4CF),
                        ),
                      ),

                      const SizedBox(height: 18),

                      // Three Metrics Panel
                      Container(
                        padding: const EdgeInsets.symmetric(
                            vertical: 14, horizontal: 10),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.06),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: Colors.white.withOpacity(0.1),
                            width: 1.2,
                          ),
                        ),
                        child: Row(
                          children: [
                            Expanded(
                                child:
                                    _buildMetricCol('AI Ustoz', '24/7 yordam')),
                            Container(
                                width: 1,
                                height: 32,
                                color: Colors.white.withOpacity(0.12)),
                            Expanded(
                                child: _buildMetricCol('Full', 'darsliklar')),
                            Container(
                                width: 1,
                                height: 32,
                                color: Colors.white.withOpacity(0.12)),
                            Expanded(child: _buildMetricCol('0', 'reklama')),
                          ],
                        ),
                      ),

                      const SizedBox(height: 18),

                      // 6 Pro Benefits List
                      _buildAllBenefitCards(isWide: false),

                      const SizedBox(height: 18),

                      // Pro Active banner OR Tariff cards
                      if (isPro)
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            color: const Color(0xFF10B981).withOpacity(0.15),
                            borderRadius: BorderRadius.circular(22),
                            border: Border.all(
                                color: const Color(0xFF10B981), width: 1.5),
                          ),
                          child: Column(
                            children: [
                              const Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(Icons.verified_rounded,
                                      color: Color(0xFF10B981), size: 24),
                                  SizedBox(width: 8),
                                  Text(
                                    'MathCity Pro faol',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 17,
                                      fontWeight: FontWeight.w800,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 6),
                              Text(
                                'Tugash sanasi: ${_formatDate(student?.subscription.proExpiresAt)} (${_calculateRemainingDays(student?.subscription.proExpiresAt)} kun qoldi)',
                                style: const TextStyle(
                                  color: Color(0xFFFFD66B),
                                  fontSize: 13,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ],
                          ),
                        )
                      else ...[
                        if (hasActiveDiscount) ...[
                          _buildDiscountHeaderRibbon(pricing),
                          const SizedBox(height: 14),
                        ],
                        // Tariffs 2 columns (Flexible, responsive, zero RenderFlex overflow)
                        Row(
                          children: [
                            // 1 oylik
                            Expanded(
                              child: GestureDetector(
                                onTap: () =>
                                    setState(() => _selectedPlanIndex = 0),
                                child: AnimatedContainer(
                                  duration: const Duration(milliseconds: 200),
                                  constraints:
                                      const BoxConstraints(minHeight: 124),
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 14, vertical: 12),
                                  decoration: BoxDecoration(
                                    gradient: _selectedPlanIndex == 0
                                        ? const LinearGradient(
                                            colors: [
                                              Color(0xFF2E1C7A),
                                              Color(0xFF1E1452)
                                            ],
                                            begin: Alignment.topLeft,
                                            end: Alignment.bottomRight,
                                          )
                                        : null,
                                    color: _selectedPlanIndex == 0
                                        ? null
                                        : Colors.white.withOpacity(0.04),
                                    borderRadius: BorderRadius.circular(20),
                                    border: Border.all(
                                      color: _selectedPlanIndex == 0
                                          ? const Color(0xFFFFD66B)
                                          : Colors.white.withOpacity(0.2),
                                      width:
                                          _selectedPlanIndex == 0 ? 2.0 : 1.2,
                                    ),
                                    boxShadow: _selectedPlanIndex == 0
                                        ? [
                                            BoxShadow(
                                              color: const Color(0xFFFFD66B)
                                                  .withOpacity(0.25),
                                              blurRadius: 14,
                                              offset: const Offset(0, 4),
                                            ),
                                          ]
                                        : null,
                                  ),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      FittedBox(
                                        fit: BoxFit.scaleDown,
                                        alignment: Alignment.centerLeft,
                                        child: Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceBetween,
                                          children: [
                                            const Text(
                                              '1 oylik',
                                              style: TextStyle(
                                                color: Colors.white,
                                                fontSize: 14,
                                                fontWeight: FontWeight.w800,
                                              ),
                                            ),
                                            if (_selectedPlanIndex == 0) ...[
                                              const SizedBox(width: 8),
                                              const Icon(
                                                Icons.check_circle_rounded,
                                                color: Color(0xFFFFD66B),
                                                size: 18,
                                              ),
                                            ],
                                          ],
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      if (hasActiveDiscount) ...[
                                        FittedBox(
                                          fit: BoxFit.scaleDown,
                                          alignment: Alignment.centerLeft,
                                          child: Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              Text(
                                                '${pricing.monthlyPlan.basePrice} so‘m',
                                                style: TextStyle(
                                                  color: Colors.white
                                                      .withOpacity(0.45),
                                                  fontSize: 11.5,
                                                  fontWeight: FontWeight.w600,
                                                  decoration: TextDecoration
                                                      .lineThrough,
                                                  decorationColor:
                                                      const Color(0xFFEF4444),
                                                  decorationThickness: 2,
                                                ),
                                              ),
                                              const SizedBox(width: 4),
                                              Container(
                                                padding:
                                                    const EdgeInsets.symmetric(
                                                        horizontal: 4,
                                                        vertical: 1),
                                                decoration: BoxDecoration(
                                                  color:
                                                      const Color(0xFFFFD700),
                                                  borderRadius:
                                                      BorderRadius.circular(4),
                                                ),
                                                child: const Text(
                                                  '-30%',
                                                  style: TextStyle(
                                                    color: Color(0xFF3B1700),
                                                    fontSize: 8.5,
                                                    fontWeight: FontWeight.w900,
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                        const SizedBox(height: 2),
                                        FittedBox(
                                          fit: BoxFit.scaleDown,
                                          child: Text(
                                            '${pricing.monthlyPlan.finalPrice} so‘m',
                                            style: const TextStyle(
                                              color: Color(0xFFFFD700),
                                              fontSize: 18,
                                              fontWeight: FontWeight.w900,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(height: 3),
                                        const Text(
                                          'Har oy (Tejov: 8 700 so‘m)',
                                          style: TextStyle(
                                            color: Color(0xFFA9A4CF),
                                            fontSize: 10,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ] else ...[
                                        const FittedBox(
                                          fit: BoxFit.scaleDown,
                                          child: Text(
                                            '29 000 so‘m',
                                            style: TextStyle(
                                              color: Colors.white,
                                              fontSize: 19,
                                              fontWeight: FontWeight.w900,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(height: 4),
                                        const Text(
                                          'Har oyda to‘lanadi',
                                          style: TextStyle(
                                            color: Color(0xFFA9A4CF),
                                            fontSize: 11,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ],
                                    ],
                                  ),
                                ),
                              ),
                            ),

                            const SizedBox(width: 12),

                            // 1 yillik (Eng tejamkor)
                            Expanded(
                              child: GestureDetector(
                                onTap: () =>
                                    setState(() => _selectedPlanIndex = 1),
                                child: AnimatedContainer(
                                  duration: const Duration(milliseconds: 200),
                                  constraints:
                                      const BoxConstraints(minHeight: 124),
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 14, vertical: 12),
                                  decoration: BoxDecoration(
                                    gradient: _selectedPlanIndex == 1
                                        ? const LinearGradient(
                                            colors: [
                                              Color(0xFF2E1C7A),
                                              Color(0xFF1E1452)
                                            ],
                                            begin: Alignment.topLeft,
                                            end: Alignment.bottomRight,
                                          )
                                        : null,
                                    color: _selectedPlanIndex == 1
                                        ? null
                                        : Colors.white.withOpacity(0.04),
                                    borderRadius: BorderRadius.circular(20),
                                    border: Border.all(
                                      color: _selectedPlanIndex == 1
                                          ? const Color(0xFFFFD66B)
                                          : Colors.white.withOpacity(0.2),
                                      width:
                                          _selectedPlanIndex == 1 ? 2.0 : 1.2,
                                    ),
                                    boxShadow: _selectedPlanIndex == 1
                                        ? [
                                            BoxShadow(
                                              color: const Color(0xFFFFD66B)
                                                  .withOpacity(0.25),
                                              blurRadius: 14,
                                              offset: const Offset(0, 4),
                                            ),
                                          ]
                                        : null,
                                  ),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      FittedBox(
                                        fit: BoxFit.scaleDown,
                                        alignment: Alignment.centerLeft,
                                        child: Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceBetween,
                                          children: [
                                            Container(
                                              padding:
                                                  const EdgeInsets.symmetric(
                                                      horizontal: 6,
                                                      vertical: 2),
                                              decoration: BoxDecoration(
                                                color: const Color(0xFFFFD66B),
                                                borderRadius:
                                                    BorderRadius.circular(6),
                                              ),
                                              child: const Text(
                                                'Eng tejamkor',
                                                style: TextStyle(
                                                  color: Color(0xFF1C1450),
                                                  fontSize: 9,
                                                  fontWeight: FontWeight.w900,
                                                ),
                                              ),
                                            ),
                                            if (_selectedPlanIndex == 1) ...[
                                              const SizedBox(width: 8),
                                              const Icon(
                                                Icons.check_circle_rounded,
                                                color: Color(0xFFFFD66B),
                                                size: 18,
                                              ),
                                            ],
                                          ],
                                        ),
                                      ),
                                      const SizedBox(height: 6),
                                      const Text(
                                        '1 yillik',
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 14,
                                          fontWeight: FontWeight.w800,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      if (hasActiveDiscount &&
                                          pricing.yearlyPlan.isDiscounted) ...[
                                        FittedBox(
                                          fit: BoxFit.scaleDown,
                                          alignment: Alignment.centerLeft,
                                          child: Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              Text(
                                                '${_formatNumber(pricing.yearlyPlan.basePrice)} so‘m',
                                                style: TextStyle(
                                                  color: Colors.white
                                                      .withOpacity(0.45),
                                                  fontSize: 11.5,
                                                  fontWeight: FontWeight.w600,
                                                  decoration: TextDecoration
                                                      .lineThrough,
                                                  decorationColor:
                                                      const Color(0xFFEF4444),
                                                  decorationThickness: 2,
                                                ),
                                              ),
                                              const SizedBox(width: 4),
                                              Container(
                                                padding:
                                                    const EdgeInsets.symmetric(
                                                        horizontal: 4,
                                                        vertical: 1),
                                                decoration: BoxDecoration(
                                                  color:
                                                      const Color(0xFFFFD700),
                                                  borderRadius:
                                                      BorderRadius.circular(4),
                                                ),
                                                child: const Text(
                                                  '-30%',
                                                  style: TextStyle(
                                                    color: Color(0xFF3B1700),
                                                    fontSize: 8.5,
                                                    fontWeight: FontWeight.w900,
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                        const SizedBox(height: 2),
                                        FittedBox(
                                          fit: BoxFit.scaleDown,
                                          child: Text(
                                            '${_formatNumber(pricing.yearlyPlan.finalPrice)} so‘m',
                                            style: const TextStyle(
                                              color: Color(0xFFFFD700),
                                              fontSize: 18,
                                              fontWeight: FontWeight.w900,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(height: 3),
                                        const Text(
                                          '12 oy (Tejov: 75 000 so‘m)',
                                          style: TextStyle(
                                            color: Color(0xFFA9A4CF),
                                            fontSize: 10,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ] else ...[
                                        const FittedBox(
                                          fit: BoxFit.scaleDown,
                                          child: Text(
                                            '250 000 so‘m',
                                            style: TextStyle(
                                              color: Colors.white,
                                              fontSize: 19,
                                              fontWeight: FontWeight.w900,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(height: 2),
                                        const Text(
                                          '≈20 833 so‘m/oy (12 oy)',
                                          style: TextStyle(
                                            color: Color(0xFFFFD66B),
                                            fontSize: 10,
                                            fontWeight: FontWeight.w700,
                                          ),
                                        ),
                                      ],
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],

                      const SizedBox(height: 18),

                      // Transparent renewal disclosure
                      if (hasActiveDiscount) ...[
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(
                              horizontal: 14, vertical: 8),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.04),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                                color: Colors.white.withOpacity(0.08)),
                          ),
                          child: const Text(
                            'Chegirma birinchi to‘lov davri uchun amal qiladi. Keyingi davrlarda standart tarif narxida yangilanadi. Istalgan vaqtda bekor qilish mumkin.',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 11,
                              color: Color(0xFFA9A4CF),
                              fontWeight: FontWeight.w500,
                              height: 1.35,
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                      ],

                      // Footer disclaimer
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Flexible(
                            child: Text(
                              'Istalgan vaqtda bekor qilish mumkin · ',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF9C96C8),
                              ),
                            ),
                          ),
                          GestureDetector(
                            onTap: () {},
                            child: const Text(
                              'Shartlar',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                color: Colors.white,
                                decoration: TextDecoration.underline,
                              ),
                            ),
                          ),
                          const Text(
                            ' · ',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF9C96C8),
                            ),
                          ),
                          GestureDetector(
                            onTap: () => context.push('/privacy-policy'),
                            child: const Text(
                              'Maxfiylik',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                color: Colors.white,
                                decoration: TextDecoration.underline,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                    ],
                  ),
                ),
              ),

              // Docked Bottom Button with SafeArea
              Positioned(
                left: 20,
                right: 20,
                bottom: 16,
                child: SafeArea(
                  top: false,
                  child: Stack(
                    alignment: Alignment.center,
                    clipBehavior: Clip.none,
                    children: [
                      if (!disableAnim && !isPro)
                        AnimatedBuilder(
                          animation: _pulseController,
                          builder: (context, child) {
                            final pulseValue = _pulseController.value;
                            final pulseScale = 1.0 + (pulseValue * 0.08);
                            final pulseOpacity = (1.0 - pulseValue) * 0.5;
                            return Positioned.fill(
                              child: Transform.scale(
                                scale: pulseScale,
                                child: DecoratedBox(
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(32),
                                    border: Border.all(
                                      color: const Color(0xFFFFD66B)
                                          .withOpacity(pulseOpacity),
                                      width: 2.0,
                                    ),
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                      SizedBox(
                        width: double.infinity,
                        height: 58,
                        child: DecoratedBox(
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFFFFD66B), Color(0xFFF5A623)],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            borderRadius: BorderRadius.circular(29),
                            boxShadow: [
                              BoxShadow(
                                color:
                                    const Color(0xFFFFD66B).withOpacity(0.45),
                                blurRadius: 20,
                                offset: const Offset(0, 6),
                              ),
                            ],
                          ),
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.transparent,
                              shadowColor: Colors.transparent,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(29),
                              ),
                            ),
                            onPressed: _isLoading
                                ? null
                                : (isPro
                                    ? () => context.pop()
                                    : _handlePurchase),
                            child: _isLoading
                                ? const SizedBox(
                                    width: 24,
                                    height: 24,
                                    child: CircularProgressIndicator(
                                      color: Color(0xFF1C1450),
                                      strokeWidth: 2.5,
                                    ),
                                  )
                                : Text(
                                    isPro
                                        ? 'Boshqarish'
                                        : 'Pro ga ulanish • ${_formatNumber(_selectedPlanIndex == 1 ? ((hasActiveDiscount && pricing.yearlyPlan.isDiscounted) ? pricing.yearlyPlan.finalPrice : pricing.yearlyPlan.basePrice) : ((hasActiveDiscount && pricing.monthlyPlan.isDiscounted) ? pricing.monthlyPlan.finalPrice : pricing.monthlyPlan.basePrice))} so‘m',
                                    style: const TextStyle(
                                      fontSize: 16.5,
                                      fontWeight: FontWeight.w900,
                                      color: Color(0xFF1C1450),
                                    ),
                                  ),
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
    );
  }

  Widget _buildDiscountHeaderRibbon(PricingData pricing) {
    final remaining = pricing.remainingDiscountDuration;
    final days = remaining.inDays;
    final hours = (remaining.inHours % 24).toString().padLeft(2, '0');
    final mins = (remaining.inMinutes % 60).toString().padLeft(2, '0');
    final secs = (remaining.inSeconds % 60).toString().padLeft(2, '0');

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF381566), Color(0xFF220E42)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
            color: const Color(0xFFFFD700).withOpacity(0.5), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFFFD700).withOpacity(0.15),
            blurRadius: 14,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFFFD700), Color(0xFFF59E0B)],
                  ),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  '-30%',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF3B1700),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              const Expanded(
                child: Text(
                  'Yangi o‘quvchilar uchun 30% chegirma!',
                  style: TextStyle(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.28),
              borderRadius: BorderRadius.circular(10),
            ),
            child: FittedBox(
              fit: BoxFit.scaleDown,
              child: Row(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.timer_outlined,
                      color: Color(0xFFFFD700), size: 13),
                  const SizedBox(width: 6),
                  Text(
                    days > 0
                        ? 'Tugashiga: $days kun $hours:$mins:$secs'
                        : 'Tugashiga: $hours:$mins:$secs',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFFFFD700),
                      fontFeatures: [FontFeature.tabularFigures()],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSparkle(double size, AnimationController controller,
      double offset, bool disableAnim) {
    if (disableAnim) {
      return Icon(Icons.auto_awesome,
          color: const Color(0xFFFFD66B).withOpacity(0.85), size: size);
    }
    return RepaintBoundary(
      child: AnimatedBuilder(
        animation: controller,
        builder: (context, child) {
          final val = (controller.value + offset) % 1.0;
          final scale = 0.7 + (math.sin(val * math.pi * 2) + 1.0) * 0.22;
          final opacity = 0.25 + (math.sin(val * math.pi * 2) + 1.0) * 0.35;
          return Transform.scale(
            scale: scale,
            child: Opacity(
              opacity: opacity.clamp(0.0, 1.0),
              child: Icon(
                Icons.auto_awesome,
                color: const Color(0xFFFFD66B),
                size: size,
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildMetricCol(String top, String bottom) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        FittedBox(
          fit: BoxFit.scaleDown,
          child: Text(
            top,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.w800,
            ),
          ),
        ),
        const SizedBox(height: 2),
        FittedBox(
          fit: BoxFit.scaleDown,
          child: Text(
            bottom,
            style: const TextStyle(
              color: Color(0xFFA9A4CF),
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildAllBenefitCards({required bool isWide}) {
    final benefits = [
      (
        icon: Icons.smart_toy_rounded,
        tileColor: const Color(0x2BFFD66B),
        iconColor: const Color(0xFFFFD66B),
        title: 'Cheksiz AI Ustoz',
        description:
            'Istalgan mavzuda savol bering, qadam-baqadam tushuntirib beradi.',
      ),
      (
        icon: Icons.menu_book_rounded,
        tileColor: const Color(0x338B6BFF),
        iconColor: const Color(0xFFB8A6FF),
        title: 'To‘liq matematika darsliklari',
        description:
            'Sinflar bo‘yicha barcha mavzular, misol va nazorat testlari bir joyda.',
      ),
      (
        icon: Icons.calculate_rounded,
        tileColor: const Color(0x333B82F6),
        iconColor: const Color(0xFF60A5FA),
        title: 'Cheksiz mashqlar',
        description:
            'Kunlik cheklovlarsiz mashq qiling va o‘z tempingizda rivojlaning.',
      ),
      (
        icon: Icons.verified_user_rounded,
        tileColor: const Color(0x3310B981),
        iconColor: const Color(0xFF34D399),
        title: 'Reklamasiz o‘qish muhiti',
        description:
            'Hech qanday reklama va to‘xtatishlarsiz, toza o‘qish maydoni.',
      ),
      (
        icon: Icons.monetization_on_rounded,
        tileColor: const Color(0x33F59E0B),
        iconColor: const Color(0xFFFBBF24),
        title: '3 baravar ko‘p coin',
        description:
            'Har bir to‘g‘ri yechilgan masala uchun 3 baravar ko‘proq tangalar.',
      ),
      (
        icon: Icons.workspace_premium_rounded,
        tileColor: const Color(0x33EC4899),
        iconColor: const Color(0xFFF472B6),
        title: 'Qo‘shimcha premium imkoniyatlar',
        description:
            'Uy qurishdagi eksklyuziv buyumlar va maxsus reyting sovrinlari.',
      ),
    ];

    return Column(
      children: benefits.map((b) {
        return Padding(
          padding: EdgeInsets.only(bottom: isWide ? 16 : 12),
          child: _buildBenefitItem(
            icon: b.icon,
            tileColor: b.tileColor,
            iconColor: b.iconColor,
            title: b.title,
            description: b.description,
          ),
        );
      }).toList(),
    );
  }

  Widget _buildBenefitItem({
    required IconData icon,
    required Color tileColor,
    required Color iconColor,
    required String title,
    required String description,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: tileColor,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: iconColor, size: 22),
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                description,
                style: const TextStyle(
                  color: Color(0xFFA9A4CF),
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                  height: 1.35,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  int _calculateRemainingDays(String? raw) {
    if (raw == null) return 30;
    try {
      final dt = DateTime.parse(raw);
      final diff = dt.difference(DateTime.now()).inDays;
      return diff > 0 ? diff : 0;
    } catch (_) {
      return 0;
    }
  }

  String _formatDate(String? raw) {
    if (raw == null) return '30 kun';
    try {
      final dt = DateTime.parse(raw);
      return DateFormat('dd.MM.yyyy').format(dt);
    } catch (_) {
      return '30 kun';
    }
  }

  Widget _buildWideProScreen(
    BuildContext context, {
    required dynamic student,
    required bool isPro,
    required bool disableAnim,
    required PricingData pricing,
    required bool hasActiveDiscount,
    required double screenWidth,
  }) {
    final isDesktop = screenWidth >= 1024;
    final isYearly = _selectedPlanIndex == 1;
    final planPrice = isYearly
        ? ((hasActiveDiscount && pricing.yearlyPlan.isDiscounted)
            ? '${_formatNumber(pricing.yearlyPlan.finalPrice)} so‘m'
            : '250 000 so‘m')
        : ((hasActiveDiscount && pricing.monthlyPlan.isDiscounted)
            ? '${_formatNumber(pricing.monthlyPlan.finalPrice)} so‘m'
            : '29 000 so‘m');

    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            center: Alignment(0.0, -0.4),
            radius: 1.4,
            colors: [
              Color(0xFF4A2BD6),
              Color(0xFF1C1450),
              Color(0xFF0C0A22),
            ],
            stops: [0.0, 0.55, 1.0],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Top Bar with Close button
              Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Semantics(
                      label: 'Yopish',
                      button: true,
                      child: MouseRegion(
                        cursor: SystemMouseCursors.click,
                        child: InkWell(
                          onTap: () => context.pop(),
                          borderRadius: BorderRadius.circular(22),
                          child: Container(
                            width: 44,
                            height: 44,
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.12),
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: Colors.white.withOpacity(0.18),
                                width: 1.2,
                              ),
                            ),
                            child: const Icon(
                              Icons.close_rounded,
                              color: Colors.white,
                              size: 22,
                            ),
                          ),
                        ),
                      ),
                    ),
                    const Row(
                      children: [
                        Icon(Icons.star_rounded,
                            color: Color(0xFFFFD66B), size: 22),
                        SizedBox(width: 8),
                        Text(
                          'MathCity PRO',
                          style: TextStyle(
                            color: Color(0xFFFFD66B),
                            fontSize: 17,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 0.8,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(width: 44),
                  ],
                ),
              ),

              // Main content
              Expanded(
                child: SingleChildScrollView(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  child: Center(
                    child: ConstrainedBox(
                      constraints: BoxConstraints(
                        maxWidth: isDesktop ? 1080 : 680,
                      ),
                      child: isDesktop
                          ? _buildDesktopProLayout(
                              student: student,
                              isPro: isPro,
                              disableAnim: disableAnim,
                              pricing: pricing,
                              hasActiveDiscount: hasActiveDiscount,
                              planPrice: planPrice,
                            )
                          : _buildTabletProLayout(
                              student: student,
                              isPro: isPro,
                              disableAnim: disableAnim,
                              pricing: pricing,
                              hasActiveDiscount: hasActiveDiscount,
                              planPrice: planPrice,
                            ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDesktopProLayout({
    required dynamic student,
    required bool isPro,
    required bool disableAnim,
    required PricingData pricing,
    required bool hasActiveDiscount,
    required String planPrice,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Left Column: Hero, Features, Metrics, Guarantee
        Expanded(
          flex: 6,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Image.asset(
                    'assets/logo.png',
                    width: 88,
                    height: 88,
                    fit: BoxFit.contain,
                    errorBuilder: (_, __, ___) => Image.asset(
                      'assets/images/mathcity_logo.png',
                      width: 88,
                      height: 88,
                      fit: BoxFit.contain,
                    ),
                  ),
                  const SizedBox(width: 20),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        RichText(
                          text: const TextSpan(
                            text: 'MathCity ',
                            style: TextStyle(
                              fontFamily: 'Nunito',
                              fontSize: 28,
                              fontWeight: FontWeight.w900,
                              color: Colors.white,
                            ),
                            children: [
                              TextSpan(
                                text: 'Pro',
                                style: TextStyle(
                                  color: Color(0xFFFFD66B),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 6),
                        const Text(
                          'Matematikani o‘ynab va tushunib o‘rganing — barcha cheklovlarsiz',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                            color: Color(0xFFA9A4CF),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Metrics Panel
              Container(
                padding:
                    const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.06),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: Colors.white.withOpacity(0.12),
                    width: 1.2,
                  ),
                ),
                child: Row(
                  children: [
                    Expanded(child: _buildMetricCol('AI Ustoz', '24/7 yordam')),
                    Container(
                        width: 1,
                        height: 36,
                        color: Colors.white.withOpacity(0.12)),
                    Expanded(child: _buildMetricCol('Full', 'darsliklar')),
                    Container(
                        width: 1,
                        height: 36,
                        color: Colors.white.withOpacity(0.12)),
                    Expanded(child: _buildMetricCol('0', 'reklama')),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // 6 Pro Benefits
              _buildAllBenefitCards(isWide: true),
              const SizedBox(height: 24),

              // Guarantee Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: Colors.white.withOpacity(0.1)),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.shield_outlined,
                        color: Color(0xFFFFD66B), size: 30),
                    SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '100% Xavfsiz to‘lov kafolati',
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w800,
                              fontSize: 14,
                            ),
                          ),
                          SizedBox(height: 3),
                          Text(
                            'Payme va Click rasmiy shlyuzlari orqali xavfsiz himoyalangan to‘lov.',
                            style: TextStyle(
                              color: Color(0xFFA9A4CF),
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),

        const SizedBox(width: 36),

        // Right Column: Tariffs, Checkout & Status
        Expanded(
          flex: 5,
          child: Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFF261868), Color(0xFF160E42)],
              ),
              borderRadius: BorderRadius.circular(28),
              border:
                  Border.all(color: Colors.white.withOpacity(0.14), width: 1.4),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.35),
                  blurRadius: 24,
                  offset: const Offset(0, 10),
                ),
              ],
            ),
            child: isPro
                ? Column(
                    children: [
                      const Icon(Icons.verified_rounded,
                          color: Color(0xFF10B981), size: 48),
                      const SizedBox(height: 12),
                      const Text(
                        'MathCity Pro faol',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Tugash sanasi: ${_formatDate(student?.subscription.proExpiresAt)} (${_calculateRemainingDays(student?.subscription.proExpiresAt)} kun qoldi)',
                        style: const TextStyle(
                          color: Color(0xFFFFD66B),
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 20),
                      const Text(
                        'Siz barcha Pro imkoniyatlaridan to‘liq foydalanmoqdasiz.',
                        textAlign: TextAlign.center,
                        style:
                            TextStyle(color: Color(0xFFA9A4CF), fontSize: 13),
                      ),
                    ],
                  )
                : Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Obuna rejasini tanlang',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      const SizedBox(height: 14),

                      if (hasActiveDiscount) ...[
                        _buildDiscountHeaderRibbon(pricing),
                        const SizedBox(height: 16),
                      ],

                      // Tariff 0: Monthly
                      _buildWideTariffCard(
                        index: 0,
                        title: '1 oylik obuna',
                        price: hasActiveDiscount
                            ? '${pricing.monthlyPlan.finalPrice} so‘m'
                            : '29 000 so‘m',
                        originalPrice: hasActiveDiscount
                            ? '${pricing.monthlyPlan.basePrice} so‘m'
                            : null,
                        subtitle: hasActiveDiscount
                            ? 'Har oy (Tejov: 8 700 so‘m)'
                            : 'Har oyda to‘lanadi',
                        badge: hasActiveDiscount ? '-30%' : null,
                      ),
                      const SizedBox(height: 14),

                      // Tariff 1: Yearly
                      _buildWideTariffCard(
                        index: 1,
                        title: '1 yillik obuna',
                        price: (hasActiveDiscount &&
                                pricing.yearlyPlan.isDiscounted)
                            ? '${_formatNumber(pricing.yearlyPlan.finalPrice)} so‘m'
                            : '250 000 so‘m',
                        originalPrice: (hasActiveDiscount &&
                                pricing.yearlyPlan.isDiscounted)
                            ? '${_formatNumber(pricing.yearlyPlan.basePrice)} so‘m'
                            : null,
                        subtitle: (hasActiveDiscount &&
                                pricing.yearlyPlan.isDiscounted)
                            ? '12 oylik obuna (Tejov: 75 000 so‘m)'
                            : '≈20 833 so‘m/oy (12 oy)',
                        badge: (hasActiveDiscount &&
                                pricing.yearlyPlan.isDiscounted)
                            ? 'Eng tejamkor • -30%'
                            : 'Eng tejamkor',
                      ),
                      const SizedBox(height: 14),

                      // Transparent renewal disclosure
                      if (hasActiveDiscount) ...[
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(
                              horizontal: 14, vertical: 8),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.04),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                                color: Colors.white.withOpacity(0.08)),
                          ),
                          child: const Text(
                            'Chegirma birinchi to‘lov davri uchun amal qiladi. Keyingi davrlarda standart tarif narxida yangilanadi. Istalgan vaqtda bekor qilish mumkin.',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 11,
                              color: Color(0xFFA9A4CF),
                              fontWeight: FontWeight.w500,
                              height: 1.35,
                            ),
                          ),
                        ),
                        const SizedBox(height: 14),
                      ],
                      const SizedBox(height: 24),

                      // CTA Button
                      SizedBox(
                        width: double.infinity,
                        height: 56,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFFFD66B),
                            foregroundColor: const Color(0xFF1C1450),
                            elevation: 4,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(28),
                            ),
                          ),
                          onPressed: _isLoading ? null : _handlePurchase,
                          child: _isLoading
                              ? const SizedBox(
                                  width: 24,
                                  height: 24,
                                  child: CircularProgressIndicator(
                                    color: Color(0xFF1C1450),
                                    strokeWidth: 2.6,
                                  ),
                                )
                              : Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    const Icon(Icons.bolt_rounded, size: 22),
                                    const SizedBox(width: 8),
                                    Flexible(
                                      child: Text(
                                        'Pro obunaga o‘tish ($planPrice)',
                                        style: const TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w900,
                                        ),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                  ],
                                ),
                        ),
                      ),
                      const SizedBox(height: 14),

                      // Providers info
                      FittedBox(
                        fit: BoxFit.scaleDown,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.lock_outline_rounded,
                                color: Color(0xFF9C96C8), size: 14),
                            const SizedBox(width: 6),
                            const Text(
                              'Payme va Click orqali xavfsiz to‘lov',
                              style: TextStyle(
                                color: Color(0xFF9C96C8),
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Terms
                      FittedBox(
                        fit: BoxFit.scaleDown,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text(
                              'Istalgan vaqtda bekor qilish mumkin · ',
                              style: TextStyle(
                                  fontSize: 11, color: Color(0xFF9C96C8)),
                            ),
                            GestureDetector(
                              onTap: () => context.push('/privacy-policy'),
                              child: const Text(
                                'Maxfiylik',
                                style: TextStyle(
                                  fontSize: 11,
                                  color: Colors.white,
                                  decoration: TextDecoration.underline,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
          ),
        ),
      ],
    );
  }

  Widget _buildTabletProLayout({
    required dynamic student,
    required bool isPro,
    required bool disableAnim,
    required PricingData pricing,
    required bool hasActiveDiscount,
    required String planPrice,
  }) {
    return Column(
      children: [
        // Mascot
        Image.asset(
          'assets/logo.png',
          width: 140,
          height: 140,
          fit: BoxFit.contain,
          errorBuilder: (_, __, ___) => Image.asset(
            'assets/images/mathcity_logo.png',
            width: 140,
            height: 140,
            fit: BoxFit.contain,
          ),
        ),
        const SizedBox(height: 10),
        RichText(
          textAlign: TextAlign.center,
          text: const TextSpan(
            text: 'MathCity ',
            style: TextStyle(
              fontFamily: 'Nunito',
              fontSize: 26,
              fontWeight: FontWeight.w900,
              color: Colors.white,
            ),
            children: [
              TextSpan(
                text: 'Pro',
                style: TextStyle(color: Color(0xFFFFD66B)),
              ),
            ],
          ),
        ),
        const SizedBox(height: 6),
        const Text(
          'Matematikani o‘ynab va tushunib o‘rganing',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: Color(0xFFA9A4CF),
          ),
        ),
        const SizedBox(height: 20),

        // Metrics
        Container(
          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.06),
            borderRadius: BorderRadius.circular(20),
            border:
                Border.all(color: Colors.white.withOpacity(0.1), width: 1.2),
          ),
          child: Row(
            children: [
              Expanded(child: _buildMetricCol('AI Ustoz', '24/7 yordam')),
              Container(
                  width: 1, height: 32, color: Colors.white.withOpacity(0.12)),
              Expanded(child: _buildMetricCol('Full', 'darsliklar')),
              Container(
                  width: 1, height: 32, color: Colors.white.withOpacity(0.12)),
              Expanded(child: _buildMetricCol('0', 'reklama')),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // 6 Pro Benefits
        _buildAllBenefitCards(isWide: false),
        const SizedBox(height: 24),

        if (isPro)
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: const Color(0xFF10B981).withOpacity(0.15),
              borderRadius: BorderRadius.circular(22),
              border: Border.all(color: const Color(0xFF10B981), width: 1.5),
            ),
            child: Column(
              children: [
                const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.verified_rounded,
                        color: Color(0xFF10B981), size: 24),
                    SizedBox(width: 8),
                    Text(
                      'MathCity Pro faol',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 17,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  'Tugash sanasi: ${_formatDate(student?.subscription.proExpiresAt)} (${_calculateRemainingDays(student?.subscription.proExpiresAt)} kun qoldi)',
                  style: const TextStyle(
                    color: Color(0xFFFFD66B),
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          )
        else ...[
          if (hasActiveDiscount) ...[
            _buildDiscountHeaderRibbon(pricing),
            const SizedBox(height: 16),
          ],

          Row(
            children: [
              Expanded(
                child: _buildWideTariffCard(
                  index: 0,
                  title: '1 oylik',
                  price: hasActiveDiscount
                      ? '${pricing.monthlyPlan.finalPrice} so‘m'
                      : '29 000 so‘m',
                  originalPrice: hasActiveDiscount
                      ? '${pricing.monthlyPlan.basePrice} so‘m'
                      : null,
                  subtitle: hasActiveDiscount
                      ? 'Har oy (Tejov: 8 700 so‘m)'
                      : 'Har oyda to‘lanadi',
                  badge: hasActiveDiscount ? '-30%' : null,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: _buildWideTariffCard(
                  index: 1,
                  title: '1 yillik',
                  price: (hasActiveDiscount && pricing.yearlyPlan.isDiscounted)
                      ? '${_formatNumber(pricing.yearlyPlan.finalPrice)} so‘m'
                      : '250 000 so‘m',
                  originalPrice: (hasActiveDiscount &&
                          pricing.yearlyPlan.isDiscounted)
                      ? '${_formatNumber(pricing.yearlyPlan.basePrice)} so‘m'
                      : null,
                  subtitle:
                      (hasActiveDiscount && pricing.yearlyPlan.isDiscounted)
                          ? '12 oylik obuna (Tejov: 75 000 so‘m)'
                          : '≈20 833 so‘m/oy (12 oy)',
                  badge: (hasActiveDiscount && pricing.yearlyPlan.isDiscounted)
                      ? 'Eng tejamkor • -30%'
                      : 'Eng tejamkor',
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Transparent renewal disclosure
          if (hasActiveDiscount) ...[
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.04),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.white.withOpacity(0.08)),
              ),
              child: const Text(
                'Chegirma birinchi to‘lov davri uchun amal qiladi. Keyingi davrlarda standart tarif narxida yangilanadi. Istalgan vaqtda bekor qilish mumkin.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 11,
                  color: Color(0xFFA9A4CF),
                  fontWeight: FontWeight.w500,
                  height: 1.35,
                ),
              ),
            ),
            const SizedBox(height: 14),
          ],
          const SizedBox(height: 24),

          // Action button
          SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFFFD66B),
                foregroundColor: const Color(0xFF1C1450),
                elevation: 4,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(28),
                ),
              ),
              onPressed: _isLoading ? null : _handlePurchase,
              child: _isLoading
                  ? const SizedBox(
                      width: 24,
                      height: 24,
                      child: CircularProgressIndicator(
                        color: Color(0xFF1C1450),
                        strokeWidth: 2.6,
                      ),
                    )
                  : Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.bolt_rounded, size: 22),
                        const SizedBox(width: 8),
                        Text(
                          'Pro obunaga o‘tish ($planPrice)',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ],
                    ),
            ),
          ),
          const SizedBox(height: 16),

          FittedBox(
            fit: BoxFit.scaleDown,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text(
                  'Istalgan vaqtda bekor qilish mumkin · ',
                  style: TextStyle(fontSize: 12, color: Color(0xFF9C96C8)),
                ),
                GestureDetector(
                  onTap: () => context.push('/privacy-policy'),
                  child: const Text(
                    'Maxfiylik',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.white,
                      decoration: TextDecoration.underline,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildWideTariffCard({
    required int index,
    required String title,
    required String price,
    String? originalPrice,
    required String subtitle,
    String? badge,
  }) {
    final isSelected = _selectedPlanIndex == index;
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: () => setState(() => _selectedPlanIndex = index),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
          decoration: BoxDecoration(
            gradient: isSelected
                ? const LinearGradient(
                    colors: [Color(0xFF2E1C7A), Color(0xFF1E1452)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  )
                : null,
            color: isSelected ? null : Colors.white.withOpacity(0.04),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: isSelected
                  ? const Color(0xFFFFD66B)
                  : Colors.white.withOpacity(0.2),
              width: isSelected ? 2.0 : 1.2,
            ),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: const Color(0xFFFFD66B).withOpacity(0.22),
                      blurRadius: 14,
                      offset: const Offset(0, 4),
                    ),
                  ]
                : null,
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Radio selection indicator
              Container(
                width: 22,
                height: 22,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color:
                        isSelected ? const Color(0xFFFFD66B) : Colors.white38,
                    width: 2,
                  ),
                  color:
                      isSelected ? const Color(0xFFFFD66B) : Colors.transparent,
                ),
                child: isSelected
                    ? const Icon(Icons.check,
                        size: 14, color: Color(0xFF1C1450))
                    : null,
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    FittedBox(
                      fit: BoxFit.scaleDown,
                      alignment: Alignment.centerLeft,
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            title,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 15,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                          if (badge != null) ...[
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: const Color(0xFFFFD66B),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                badge,
                                style: const TextStyle(
                                  color: Color(0xFF1C1450),
                                  fontSize: 9.5,
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                    const SizedBox(height: 4),
                    FittedBox(
                      fit: BoxFit.scaleDown,
                      alignment: Alignment.centerLeft,
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          if (originalPrice != null) ...[
                            Text(
                              originalPrice,
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.4),
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                decoration: TextDecoration.lineThrough,
                                decorationColor: const Color(0xFFEF4444),
                              ),
                            ),
                            const SizedBox(width: 6),
                          ],
                          Text(
                            price,
                            style: TextStyle(
                              color: isSelected
                                  ? const Color(0xFFFFD66B)
                                  : Colors.white,
                              fontSize: 17,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      subtitle,
                      style: const TextStyle(
                        color: Color(0xFFA9A4CF),
                        fontSize: 11,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
