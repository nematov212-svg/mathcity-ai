import 'dart:math' as math;
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import '../theme/auth_design_tokens.dart';
import 'mathcity_logo.dart';

/// A premium, highly responsive shell for MathCity AI authentication screens.
/// Implements:
/// - Desktop (>= 1024px & landscape): Split-screen with Left Brand Panel + Right Form Card
/// - Tablet (600 - 1023px): Centered single column with 520px card
/// - Mobile (< 600px): Centered single column, 132px floating logo, 320px safe
class ResponsiveAuthShell extends StatefulWidget {
  final String title;
  final String subtitle;
  final Widget cardChild;
  final Widget bottomChild;
  final Widget? brandHeaderExtra;

  const ResponsiveAuthShell({
    super.key,
    required this.title,
    required this.subtitle,
    required this.cardChild,
    required this.bottomChild,
    this.brandHeaderExtra,
  });

  @override
  State<ResponsiveAuthShell> createState() => _ResponsiveAuthShellState();
}

class _ResponsiveAuthShellState extends State<ResponsiveAuthShell>
    with SingleTickerProviderStateMixin, WidgetsBindingObserver {
  late final AnimationController _animCtrl;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _animCtrl = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 4),
    );
    // Don't repeat animation in test environments to keep widget tests synchronous
    if (!kIsWeb && kDebugMode && _isTesting()) {
      // Keep static for test harness
    } else {
      _animCtrl.repeat(reverse: true);
    }
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      if (!_animCtrl.isAnimating && !(!kIsWeb && kDebugMode && _isTesting())) {
        _animCtrl.repeat(reverse: true);
      }
    } else {
      if (_animCtrl.isAnimating) {
        _animCtrl.stop();
      }
    }
  }

  bool _isTesting() {
    try {
      return WidgetsBinding.instance is! WidgetsFlutterBinding;
    } catch (_) {
      return false;
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _animCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final screenWidth = constraints.maxWidth;
        final screenHeight = constraints.maxHeight;

        // Desktop split-screen is used when width >= 1024 and orientation is landscape/desktop
        final isDesktop = screenWidth >= 1024 && screenWidth >= screenHeight;
        final isTablet = screenWidth >= 600 && !isDesktop;
        final isMobileLandscape = !isDesktop && !isTablet && screenHeight <= 500;

        if (isDesktop) {
          return _buildDesktopLayout(context, screenWidth);
        }

        return _buildMobileTabletLayout(
          context,
          screenWidth: screenWidth,
          screenHeight: screenHeight,
          isTablet: isTablet,
          isMobileLandscape: isMobileLandscape,
        );
      },
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DESKTOP SPLIT-SCREEN LAYOUT (>= 1024px & Landscape)
  // ─────────────────────────────────────────────────────────────────────────
  Widget _buildDesktopLayout(BuildContext context, double screenWidth) {
    final isUltraWide = screenWidth >= 1440;
    final cardWidth = isUltraWide ? 520.0 : 480.0;
    final isDark = AuthTokens.isDark(context);

    return Scaffold(
      backgroundColor: AuthTokens.bg(context),
      body: Row(
        children: [
          // ─── LEFT BRAND PANEL (1.1fr / ~52-55%) ───
          Expanded(
            flex: isUltraWide ? 11 : 10,
            child: Container(
              height: double.infinity,
              decoration: const BoxDecoration(
                gradient: AuthTokens.desktopLeftPanelGradient,
                borderRadius: BorderRadius.horizontal(
                  right: Radius.circular(40),
                ),
              ),
              child: Stack(
                clipBehavior: Clip.none,
                children: [
                  // Golden blur circle in bottom-right corner
                  Positioned(
                    bottom: -40,
                    right: -40,
                    child: Container(
                      width: 260,
                      height: 260,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: AuthTokens.goldLight.withOpacity(0.24),
                      ),
                    ),
                  ),

                  // Ambient Math Symbols in white (14% opacity)
                  _buildFloatingSymbol('+', top: 90, left: 70, size: 48, rotation: 0.1),
                  _buildFloatingSymbol('−', top: 180, right: 90, size: 42, rotation: -0.15),
                  _buildFloatingSymbol('×', top: 340, left: 110, size: 56, rotation: 0.2),
                  _buildFloatingSymbol('÷', bottom: 220, right: 100, size: 46, rotation: -0.1),
                  _buildFloatingSymbol('π', bottom: 120, left: 80, size: 64, rotation: 0.05),
                  _buildFloatingSymbol('√', top: 120, right: 180, size: 54, rotation: -0.08),

                  // Central Brand Content
                  Center(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 48),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          // 220px Logo inside crisp white circular plate
                          RepaintBoundary(
                            child: AnimatedBuilder(
                              animation: _animCtrl,
                              builder: (context, child) {
                                final offset = math.sin(_animCtrl.value * math.pi * 2) * 4;
                                return Transform.translate(
                                  offset: Offset(0, offset),
                                  child: child,
                                );
                              },
                              child: Container(
                              width: 240,
                              height: 240,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.12),
                                    blurRadius: 36,
                                    offset: const Offset(0, 14),
                                  ),
                                ],
                              ),
                              child: const Center(
                                child: MathCityLogo(
                                  size: 210,
                                  showText: true,
                                ),
                              ),
                            ),
                          ),
                        ),

                          const SizedBox(height: 32),

                          const Text(
                            'MathCity AI',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontFamily: 'Nunito',
                              fontSize: 44,
                              fontWeight: FontWeight.w800,
                              color: Colors.white,
                              letterSpacing: -0.8,
                            ),
                          ),

                          const SizedBox(height: 12),

                          Text(
                            'Bolalar uchun qiziqarli va interaktiv matematika olami',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontFamily: 'Nunito',
                              fontSize: 18,
                              fontWeight: FontWeight.w500,
                              color: Colors.white.withOpacity(0.88),
                              height: 1.4,
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

          // ─── RIGHT FORM PANEL (1fr / ~45-48%) ───
          Expanded(
            flex: 9,
            child: Container(
              height: double.infinity,
              color: AuthTokens.bg(context),
              child: Center(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 48),
                  child: ConstrainedBox(
                    constraints: BoxConstraints(maxWidth: cardWidth),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        // White Form Card Container
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 40),
                          decoration: BoxDecoration(
                            color: AuthTokens.card(context),
                            borderRadius: BorderRadius.circular(36),
                            border: Border.all(
                              color: isDark ? AuthTokens.lineDark : AuthTokens.lineLight,
                              width: 1.5,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: AuthTokens.shadow(context),
                                blurRadius: 48,
                                offset: const Offset(0, 20),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              // Form Headline
                              Text(
                                widget.title,
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontFamily: 'Nunito',
                                  fontSize: 32,
                                  fontWeight: FontWeight.w800,
                                  color: AuthTokens.ink(context),
                                  letterSpacing: -0.5,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                widget.subtitle,
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontFamily: 'Nunito',
                                  fontSize: 15,
                                  fontWeight: FontWeight.w500,
                                  color: AuthTokens.mute(context),
                                ),
                              ),
                              const SizedBox(height: 28),

                              // Form Fields & Buttons
                              widget.cardChild,
                            ],
                          ),
                        ),

                        const SizedBox(height: 20),

                        // Bottom Link
                        widget.bottomChild,
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MOBILE (< 600px) & TABLET (600 - 1023px) LAYOUT
  // ─────────────────────────────────────────────────────────────────────────
  Widget _buildMobileTabletLayout(
    BuildContext context, {
    required double screenWidth,
    required double screenHeight,
    required bool isTablet,
    required bool isMobileLandscape,
  }) {
    final isDark = AuthTokens.isDark(context);

    // Responsive sizing tokens
    final logoSize = isMobileLandscape
        ? 80.0
        : isTablet
            ? 160.0
            : (screenWidth < 360 ? 116.0 : 132.0);

    final cardMaxWidth = isTablet ? 520.0 : 440.0;
    final cardRadius = isTablet ? 34.0 : 30.0;
    final cardPaddingH = screenWidth < 360 ? 16.0 : (isTablet ? 32.0 : 22.0);
    final cardPaddingV = isTablet ? 36.0 : 26.0;

    final horizontalPadding = screenWidth < 360
        ? 12.0
        : (screenWidth < 600
            ? 18.0
            : math.max(20.0, (screenWidth - cardMaxWidth) / 2));

    final h1FontSize = isTablet
        ? 34.0
        : (screenWidth < 360 ? 22.0 : 26.0);

    return Scaffold(
      backgroundColor: AuthTokens.bg(context),
      body: SafeArea(
        child: Stack(
          children: [
            // Ambient Blur Orbs (Purple Top-Left, Gold Bottom-Right)
            Positioned(
              top: -60,
              left: -60,
              child: Container(
                width: isTablet ? 380 : 240,
                height: isTablet ? 380 : 240,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AuthTokens.brandLight.withOpacity(isDark ? 0.18 : 0.12),
                ),
              ),
            ),
            Positioned(
              bottom: -60,
              right: -60,
              child: Container(
                width: isTablet ? 340 : 220,
                height: isTablet ? 340 : 220,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AuthTokens.goldLight.withOpacity(isDark ? 0.12 : 0.15),
                ),
              ),
            ),

            // Floating Ambient Math Symbols (Hidden in tight landscape)
            if (!isMobileLandscape) ...[
              _buildFloatingSymbol('+', top: 70, left: 16, size: 28, rotation: 0.1),
              _buildFloatingSymbol('−', top: 150, right: 18, size: 24, rotation: -0.15),
              _buildFloatingSymbol('×', top: 380, left: 16, size: 30, rotation: 0.2),
              _buildFloatingSymbol('÷', bottom: 180, right: 18, size: 28, rotation: -0.1),
              _buildFloatingSymbol('π', bottom: 80, left: 22, size: 32, rotation: 0.05),
              if (isTablet) ...[
                _buildFloatingSymbol('=', top: 260, right: 40, size: 30, rotation: 0.1),
                _buildFloatingSymbol('√', bottom: 280, left: 45, size: 32, rotation: -0.2),
                _buildFloatingSymbol('%', top: 90, right: 80, size: 26, rotation: 0.15),
              ],
            ],

            // Main Scrollable Content
            Center(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: EdgeInsets.symmetric(
                  horizontal: horizontalPadding,
                  vertical: isMobileLandscape ? 12.0 : (isTablet ? 36.0 : 24.0),
                ),
                child: ConstrainedBox(
                  constraints: BoxConstraints(maxWidth: cardMaxWidth),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      // Top Mascot Logo Container
                      Center(
                        child: RepaintBoundary(
                          child: AnimatedBuilder(
                            animation: _animCtrl,
                            builder: (context, child) {
                              final floatY = math.sin(_animCtrl.value * math.pi * 2) * (isMobileLandscape ? 2 : 4);
                              return Transform.translate(
                                offset: Offset(0, floatY),
                                child: child,
                              );
                            },
                            child: Stack(
                            alignment: Alignment.center,
                            children: [
                              // Pulse ring behind emblem
                              Container(
                                width: logoSize + 16,
                                height: logoSize + 16,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: (isDark ? const Color(0xFF282054) : const Color(0xFFECE7FD))
                                      .withOpacity(0.55),
                                ),
                              ),
                              // Emblem plate
                              Container(
                                width: logoSize,
                                height: logoSize,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: isDark ? const Color(0xFF231D4D) : const Color(0xFFECE7FD),
                                  boxShadow: [
                                    BoxShadow(
                                      color: AuthTokens.brandLight.withOpacity(0.18),
                                      blurRadius: 24,
                                      offset: const Offset(0, 8),
                                    ),
                                  ],
                                ),
                                child: Center(
                                  child: MathCityLogo(
                                    size: logoSize * 0.82,
                                    showText: true,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),

                      SizedBox(height: isMobileLandscape ? 8 : 16),

                      // Sarlavha (H1) & Subtitle
                      Text(
                        widget.title,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontFamily: 'Nunito',
                          fontSize: h1FontSize,
                          fontWeight: FontWeight.w800,
                          color: AuthTokens.ink(context),
                          letterSpacing: -0.4,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 10),
                        child: Text(
                          widget.subtitle,
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontFamily: 'Nunito',
                            fontSize: isTablet ? 16 : 14,
                            fontWeight: FontWeight.w500,
                            color: AuthTokens.mute(context),
                          ),
                        ),
                      ),

                      SizedBox(height: isMobileLandscape ? 12 : 20),

                      // White Form Card
                      Container(
                        width: double.infinity,
                        padding: EdgeInsets.symmetric(
                          horizontal: cardPaddingH,
                          vertical: cardPaddingV,
                        ),
                        decoration: BoxDecoration(
                          color: AuthTokens.card(context),
                          borderRadius: BorderRadius.circular(cardRadius),
                          border: Border.all(
                            color: isDark ? AuthTokens.lineDark : AuthTokens.lineLight,
                            width: 1.5,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: AuthTokens.shadow(context),
                              blurRadius: 36,
                              offset: const Offset(0, 14),
                            ),
                          ],
                        ),
                        child: widget.cardChild,
                      ),

                      const SizedBox(height: 18),

                      // Bottom switch link
                      widget.bottomChild,
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Helper to build ambient floating math glyph
  Widget _buildFloatingSymbol(
    String symbol, {
    double? top,
    double? bottom,
    double? left,
    double? right,
    required double size,
    required double rotation,
  }) {
    return Positioned(
      top: top,
      bottom: bottom,
      left: left,
      right: right,
      child: IgnorePointer(
        child: RepaintBoundary(
          child: AnimatedBuilder(
            animation: _animCtrl,
            builder: (context, child) {
              final dy = math.sin((_animCtrl.value + rotation.abs()) * math.pi * 2) * 5;
              return Transform.translate(
                offset: Offset(0, dy),
                child: Transform.rotate(
                  angle: rotation,
                  child: child,
                ),
              );
            },
            child: Text(
              symbol,
              style: TextStyle(
                fontFamily: 'Nunito',
                fontSize: size,
                fontWeight: FontWeight.w800,
                color: AuthTokens.brandLight.withOpacity(0.14),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
