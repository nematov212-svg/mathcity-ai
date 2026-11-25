import 'dart:math' as math;
import 'package:flutter/material.dart';

/// Reusable Golden MathCity Coin Icon
///
/// Displays the official MathCity AI golden game-style coin
/// with bright golden-yellow circular shape, thick gold border,
/// orange-gold inner face, large white '$' symbol, and glossy highlights.
/// Features a 100% transparent PNG background with optional lightweight
/// smooth micro-animations (floating, pop, sparkle).
class CoinIcon extends StatefulWidget {
  /// The size (width and height) of the coin in logical pixels.
  /// Common presets: 16, 20, 24, 32, 48, 64. Default: 24.
  final double size;

  /// Whether to enable a gentle, continuous floating hover animation.
  final bool floating;

  /// Whether to play a single pop/celebration bounce animation on appear.
  final bool popOnAppear;

  /// Whether to show a delicate golden sparkle twinkle overlay.
  final bool sparkle;

  /// Optional tooltip message.
  final String? tooltip;

  const CoinIcon({
    super.key,
    this.size = 24.0,
    this.floating = false,
    this.popOnAppear = false,
    this.sparkle = false,
    this.tooltip,
  });

  /// Preset sizes for consistent UI scaling across the app
  static const double sizeXs = 16.0;
  static const double sizeSm = 20.0;
  static const double sizeMd = 24.0;
  static const double sizeLg = 32.0;
  static const double sizeXl = 48.0;
  static const double sizeXxl = 64.0;

  @override
  State<CoinIcon> createState() => _CoinIconState();
}

class _CoinIconState extends State<CoinIcon> with SingleTickerProviderStateMixin {
  AnimationController? _controller;
  Animation<double>? _floatAnimation;
  Animation<double>? _scaleAnimation;
  Animation<double>? _sparkleAnimation;

  @override
  void initState() {
    super.initState();
    if (widget.floating || widget.popOnAppear || widget.sparkle) {
      _initAnimation();
    }
  }

  void _initAnimation() {
    if (widget.floating) {
      _controller = AnimationController(
        vsync: this,
        duration: const Duration(milliseconds: 1800),
      )..repeat(reverse: true);
      _floatAnimation = Tween<double>(begin: 0.0, end: -3.0).animate(
        CurvedAnimation(parent: _controller!, curve: Curves.easeInOutSine),
      );
    } else if (widget.sparkle) {
      _controller = AnimationController(
        vsync: this,
        duration: const Duration(milliseconds: 1600),
      )..repeat();
      _sparkleAnimation = CurvedAnimation(parent: _controller!, curve: Curves.easeInOut);
    } else if (widget.popOnAppear) {
      _controller = AnimationController(
        vsync: this,
        duration: const Duration(milliseconds: 500),
      )..forward();
      _scaleAnimation = TweenSequence<double>([
        TweenSequenceItem(
          tween: Tween<double>(begin: 0.8, end: 1.15).chain(CurveTween(curve: Curves.easeOutQuad)),
          weight: 60,
        ),
        TweenSequenceItem(
          tween: Tween<double>(begin: 1.15, end: 1.0).chain(CurveTween(curve: Curves.easeInOutQuad)),
          weight: 40,
        ),
      ]).animate(_controller!);
    }
  }

  @override
  void didUpdateWidget(CoinIcon oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.floating != widget.floating ||
        oldWidget.popOnAppear != widget.popOnAppear ||
        oldWidget.sparkle != widget.sparkle) {
      _controller?.dispose();
      _controller = null;
      if (widget.floating || widget.popOnAppear || widget.sparkle) {
        _initAnimation();
      }
    }
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final media = MediaQuery.maybeOf(context);
    final disableAnimations = media?.disableAnimations ?? false;

    Widget coinImage = SizedBox(
      width: widget.size,
      height: widget.size,
      child: Stack(
        clipBehavior: Clip.none,
        alignment: Alignment.center,
        children: [
          Image.asset(
            'assets/coins/gold_coin.png',
            width: widget.size,
            height: widget.size,
            fit: BoxFit.contain,
            filterQuality: FilterQuality.medium,
            errorBuilder: (context, error, stackTrace) {
              return _buildVectorFallback(widget.size);
            },
          ),
          if (widget.sparkle && !disableAnimations && _sparkleAnimation != null)
            Positioned(
              top: -widget.size * 0.1,
              right: -widget.size * 0.1,
              child: RepaintBoundary(
                child: AnimatedBuilder(
                  animation: _sparkleAnimation!,
                  builder: (context, child) {
                    final progress = _sparkleAnimation!.value;
                    final scale = 0.5 + 0.5 * math.sin(progress * math.pi);
                    final opacity = (math.sin(progress * math.pi)).clamp(0.0, 1.0);
                    return Opacity(
                      opacity: opacity,
                      child: Transform.scale(
                        scale: scale,
                        child: Icon(
                          Icons.auto_awesome,
                          size: widget.size * 0.45,
                          color: const Color(0xFFFFFBEB),
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

    if (widget.tooltip != null) {
      coinImage = Tooltip(message: widget.tooltip!, child: coinImage);
    }

    if (disableAnimations || _controller == null) {
      return coinImage;
    }

    if (widget.floating && _floatAnimation != null) {
      return RepaintBoundary(
        child: AnimatedBuilder(
          animation: _floatAnimation!,
          builder: (context, child) {
            return Transform.translate(
              offset: Offset(0, _floatAnimation!.value),
              child: child,
            );
          },
          child: coinImage,
        ),
      );
    }

    if (widget.popOnAppear && _scaleAnimation != null) {
      return RepaintBoundary(
        child: ScaleTransition(
          scale: _scaleAnimation!,
          child: coinImage,
        ),
      );
    }

    return coinImage;
  }

  /// Procedural fallback maintaining design fidelity even if asset bundle is unavailable
  Widget _buildVectorFallback(double size) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: const RadialGradient(
          center: Alignment(-0.2, -0.2),
          radius: 0.85,
          colors: [
            Color(0xFFFFEA79), // Bright golden yellow
            Color(0xFFFFB800), // Solid gold
            Color(0xFFE67E00), // Deep orange border
          ],
        ),
        border: Border.all(color: const Color(0xFFFFD54F), width: size * 0.08),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFD97706).withValues(alpha: 0.35),
            blurRadius: size * 0.2,
            offset: Offset(0, size * 0.08),
          ),
        ],
      ),
      child: Center(
        child: Text(
          r'$',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w900,
            fontSize: size * 0.55,
            height: 1.0,
            shadows: [
              Shadow(
                color: const Color(0xFFB45309).withValues(alpha: 0.6),
                blurRadius: 2,
                offset: const Offset(1, 1),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
