import 'package:flutter/material.dart';

class AppColors {
  // KIDS MODE (Ages 6-12)
  static const Color kidsPrimary = Color(0xFF7154EC); // Primary Purple
  static const Color kidsPrimaryLight = Color(0xFF8E77F7);
  static const Color kidsBackground = Color(0xFFF6F7FE); // Background
  static const Color kidsDarkText = Color(0xFF242344); // Dark Text
  static const Color kidsSecondaryText = Color(0xFF7B7A98);
  static const Color kidsSoftLavender = Color(0xFFEEEAFE); // Soft Lavender
  static const Color kidsGoldCoin = Color(0xFFFFD33D); // Gold Coin
  static const Color kidsWarmYellow = Color(0xFFFFF4D2); // Warm Yellow
  static const Color kidsGreen = Color(0xFF168865); // Success Green
  static const Color kidsSoftMint = Color(0xFFDFF5EF); // Soft Mint
  static const Color kidsSkyBlue = Color(0xFF70BFFF); // Sky Blue
  static const Color kidsSoftPink = Color(0xFFFFB9D7); // Soft Pink
  static const Color kidsSurface = Color(0xFFFFFFFF); // White
  static const Color kidsBorder = Color(0xFFECEEFA);
  static const Color kidsError = Color(0xFFFF5353);
  static const Color kidsErrorLight = Color(0xFFFFECEC);
  static const Color kidsOrange = Color(0xFFFF8B38);

  // TEEN MODE (Ages 13-16)
  static const Color teenBackground = Color(0xFF101526); // Main Background
  static const Color teenSurface = Color(0xFF151C2D); // Secondary Surface
  static const Color teenDeepSurface = Color(0xFF1B2338); // Deep Surface
  static const Color teenSurfaceElevated = Color(0xFF1E273D);
  static const Color teenPrimaryLime = Color(0xFFC7FA74); // Primary Accent
  static const Color teenLimeTextDark = Color(0xFF101526);
  static const Color teenLightText = Color(0xFFF1F4FC); // Light Text
  static const Color teenWhiteText = Color(0xFFFFFFFF);
  static const Color teenMutedText = Color(0xFFA5AFC7); // Secondary Text
  static const Color teenBorder = Color(0x1FFFFFFF);
  static const Color teenAccentPurple = Color(0xFF6C5CE7);
  static const Color teenAccentCyan = Color(0xFF00CEC9);
  static const Color teenSuccess = Color(0xFF4EFA9D);

  // GOLD COIN CURRENCY (Bright Gold, NEVER stars)
  static const Color coinGold = Color(0xFFFFD33D);
  static const Color coinGoldLight = Color(0xFFFFF4D2);
  static const Color coinGoldDark = Color(0xFFD48B00);

  static const LinearGradient coinGradient = LinearGradient(
    colors: [Color(0xFFFFD33D), Color(0xFFFFB800)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient kidsPrimaryGradient = LinearGradient(
    colors: [Color(0xFF8E77F7), Color(0xFF7154EC)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient teenLimeGradient = LinearGradient(
    colors: [Color(0xFFD8FFA0), Color(0xFFC7FA74)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
