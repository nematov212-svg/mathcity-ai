import 'package:flutter/material.dart';

/// Design tokens strictly conforming to the MathCity AI Auth Redesign specification
class AuthTokens {
  // --- Light Palette ---
  static const Color bgLight = Color(0xFFF6F4FF);
  static const Color cardLight = Color(0xFFFFFFFF);
  static const Color fieldLight = Color(0xFFF8F7FF);
  static const Color lineLight = Color(0xFFE6E2FB);
  static const Color inkLight = Color(0xFF1D1646);
  static const Color muteLight = Color(0xFF7A74A3);
  static const Color brandLight = Color(0xFF6A4CFF);
  static const Color brand2Light = Color(0xFF8B5CF6);
  static const Color goldLight = Color(0xFFFFC83D);
  static const Color errorLight = Color(0xFFE5484D);
  static const Color successLight = Color(0xFF22C55E);
  static const Color shadowLight = Color(0x296A4CFF); // rgba(106, 76, 255, 0.16)

  // --- Dark Palette ---
  static const Color bgDark = Color(0xFF120E2B);
  static const Color cardDark = Color(0xFF1C1740);
  static const Color fieldDark = Color(0xFF252050);
  static const Color lineDark = Color(0xFF332D68);
  static const Color inkDark = Color(0xFFF1EEFF);
  static const Color muteDark = Color(0xFF9D97C9);
  static const Color shadowDark = Color(0x73000000); // rgba(0, 0, 0, 0.45)

  // --- Gradients ---
  static const LinearGradient brandGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF6A4CFF), Color(0xFF8B5CF6)],
  );

  static const LinearGradient desktopLeftPanelGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF4B2FE0), Color(0xFF6A4CFF), Color(0xFF8B5CF6)],
  );

  // --- Helper Getters for Active Theme ---
  static bool isDark(BuildContext context) =>
      Theme.of(context).brightness == Brightness.dark;

  static Color bg(BuildContext context) => isDark(context) ? bgDark : bgLight;
  static Color card(BuildContext context) => isDark(context) ? cardDark : cardLight;
  static Color field(BuildContext context) => isDark(context) ? fieldDark : fieldLight;
  static Color line(BuildContext context) => isDark(context) ? lineDark : lineLight;
  static Color ink(BuildContext context) => isDark(context) ? inkDark : inkLight;
  static Color mute(BuildContext context) => isDark(context) ? muteDark : muteLight;
  static Color shadow(BuildContext context) => isDark(context) ? shadowDark : shadowLight;
  static Color brand(BuildContext context) => isDark(context) ? const Color(0xFF8B6BFF) : brandLight;
}
