import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Design tokens and typography specifically crafted for MathCity AI Onboarding Flow v2.
class OnboardingTheme {
  OnboardingTheme._();

  // ─── Colors ───────────────────────────────────────────────────────────────
  static const Color primary = Color(0xFF6C55E0);
  static const Color primaryLight = Color(0xFF8D74FF);
  static const Color primaryDark = Color(0xFF5B45D6);
  static const Color ink = Color(0xFF1F1D3D);
  static const Color muted = Color(0xFF7A7898);
  static const Color border = Color(0xFFE4E3F5);
  static const Color lilac = Color(0xFFEAE7FB);
  static const Color success = Color(0xFF1B8A55);
  static const Color successBg = Color(0xFFDDF5E8);
  static const Color gold = Color(0xFFFFB938);
  static const Color goldBg = Color(0xFFFFF6DF);
  static const Color pink = Color(0xFFFF7A9C);
  static const Color error = Color(0xFFE5484D);

  // ─── Background Gradient ──────────────────────────────────────────────────
  static const LinearGradient bgGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [
      Color(0xFFE9E4FF),
      Color(0xFFF6F4FF),
      Color(0xFFF5F6FC),
    ],
    stops: [0.0, 0.45, 1.0],
  );

  // ─── CTA Button Gradient ──────────────────────────────────────────────────
  static const LinearGradient ctaGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0xFF8D74FF),
      Color(0xFF5B45D6),
    ],
  );

  // ─── Corners ──────────────────────────────────────────────────────────────
  static const double buttonRadius = 20.0;
  static const double inputRadius = 18.0;
  static const double cardRadius = 22.0;

  // ─── Shadows ──────────────────────────────────────────────────────────────
  static List<BoxShadow> primaryShadow({double opacity = 0.28, double blur = 20}) => [
    BoxShadow(
      color: primary.withOpacity(opacity),
      blurRadius: blur,
      offset: const Offset(0, 8),
    ),
  ];

  static List<BoxShadow> cardShadow({double opacity = 0.08, double blur = 18}) => [
    BoxShadow(
      color: primary.withOpacity(opacity),
      blurRadius: blur,
      offset: const Offset(0, 6),
    ),
  ];

  static const List<String> fallbackFonts = [
    'Nunito',
    'Noto Sans',
    'Noto Sans Math',
    'Noto Color Emoji',
    'sans-serif',
  ];

  // ─── Typography ───────────────────────────────────────────────────────────
  static TextStyle titleStyle({Color color = ink, double fontSize = 30}) {
    try {
      return GoogleFonts.nunito(
        fontSize: fontSize,
        fontWeight: FontWeight.w700,
        color: color,
        letterSpacing: -0.5,
        height: 1.25,
      ).copyWith(fontFamilyFallback: fallbackFonts);
    } catch (_) {
      return TextStyle(
        fontFamily: 'Nunito',
        fontFamilyFallback: fallbackFonts,
        fontSize: fontSize,
        fontWeight: FontWeight.w700,
        color: color,
        letterSpacing: -0.5,
        height: 1.25,
      );
    }
  }

  static TextStyle subStyle({Color color = muted, double fontSize = 15}) {
    try {
      return GoogleFonts.nunito(
        fontSize: fontSize,
        fontWeight: FontWeight.w500,
        color: color,
        height: 1.45,
      ).copyWith(fontFamilyFallback: fallbackFonts);
    } catch (_) {
      return TextStyle(
        fontFamily: 'Nunito',
        fontFamilyFallback: fallbackFonts,
        fontSize: fontSize,
        fontWeight: FontWeight.w500,
        color: color,
        height: 1.45,
      );
    }
  }

  static TextStyle labelStyle({Color color = ink, double fontSize = 15}) {
    try {
      return GoogleFonts.nunito(
        fontSize: fontSize,
        fontWeight: FontWeight.w700,
        color: color,
      ).copyWith(fontFamilyFallback: fallbackFonts);
    } catch (_) {
      return TextStyle(
        fontFamily: 'Nunito',
        fontFamilyFallback: fallbackFonts,
        fontSize: fontSize,
        fontWeight: FontWeight.w700,
        color: color,
      );
    }
  }

  static TextStyle inputStyle({Color color = ink, double fontSize = 16}) {
    try {
      return GoogleFonts.nunito(
        fontSize: fontSize,
        fontWeight: FontWeight.w700,
        color: color,
      ).copyWith(fontFamilyFallback: fallbackFonts);
    } catch (_) {
      return TextStyle(
        fontFamily: 'Nunito',
        fontFamilyFallback: fallbackFonts,
        fontSize: fontSize,
        fontWeight: FontWeight.w700,
        color: color,
      );
    }
  }

  static TextStyle buttonStyle({Color color = Colors.white, double fontSize = 17}) {
    try {
      return GoogleFonts.nunito(
        fontSize: fontSize,
        fontWeight: FontWeight.w700,
        color: color,
        letterSpacing: 0.2,
      ).copyWith(fontFamilyFallback: fallbackFonts);
    } catch (_) {
      return TextStyle(
        fontFamily: 'Nunito',
        fontFamilyFallback: fallbackFonts,
        fontSize: fontSize,
        fontWeight: FontWeight.w700,
        color: color,
        letterSpacing: 0.2,
      );
    }
  }
}
