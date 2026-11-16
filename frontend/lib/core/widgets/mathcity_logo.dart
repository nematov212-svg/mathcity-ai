import 'package:flutter/material.dart';

class MathCityLogo extends StatelessWidget {
  final double size;
  final bool showText;
  final bool isDark;

  const MathCityLogo({
    super.key,
    this.size = 180,
    this.showText = true,
    this.isDark = false,
  });

  @override
  Widget build(BuildContext context) {
    if (showText) {
      // Full Brand Logo with Wordmark (REFERENCE IMAGE 2)
      return SizedBox(
        width: size,
        height: size,
        child: Image.asset(
          'assets/logos/mathcity_logo.png',
          width: size,
          height: size,
          fit: BoxFit.contain,
          errorBuilder: (context, error, stackTrace) => _buildFallbackVector(context),
        ),
      );
    }

    // Emblem / Launcher Symbol (Robot + City Silhouette)
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF7154EC).withOpacity(0.25),
            blurRadius: size * 0.2,
            offset: Offset(0, size * 0.08),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(size * 0.28),
        child: Image.asset(
          'assets/logos/mathcity_launcher_icon.png',
          width: size,
          height: size,
          fit: BoxFit.cover,
          errorBuilder: (context, error, stackTrace) => _buildFallbackVector(context),
        ),
      ),
    );
  }

  Widget _buildFallbackVector(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: const LinearGradient(
          colors: [Color(0xFF8E77F7), Color(0xFF6243EA)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Center(
        child: Icon(
          Icons.smart_toy_rounded,
          color: Colors.white,
          size: size * 0.55,
        ),
      ),
    );
  }
}
