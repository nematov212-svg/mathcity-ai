import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';

/// Semantic colors and styling tokens specifically calibrated for House Building Screen
/// Supporting both Light (#F4F6FB) and Dark (#0B0F1A) themes with WCAG AA compliance.
class HouseBuildColors {
  final bool isDark;
  final Color background;
  final Color cardBackground;
  final Color cardBackgroundSecondary;
  final Color textPrimary;
  final Color textSecondary;
  final Color textMuted;
  final Color border;
  final Color borderSubtle;
  final Color primary;
  final Color primaryDark;
  final Color primaryLight;
  final Color success;
  final Color gold;
  final Color chipBackground;
  final Color chipBorder;
  final Color chipSelectedBg;
  final Color silhouette;
  final LinearGradient primaryGradient;
  final LinearGradient progressGradient;
  final LinearGradient cardGradient;
  final List<BoxShadow> cardShadow;
  final List<BoxShadow> buttonShadow;
  final List<BoxShadow> glowShadow;

  const HouseBuildColors({
    required this.isDark,
    required this.background,
    required this.cardBackground,
    required this.cardBackgroundSecondary,
    required this.textPrimary,
    required this.textSecondary,
    required this.textMuted,
    required this.border,
    required this.borderSubtle,
    required this.primary,
    required this.primaryDark,
    required this.primaryLight,
    required this.success,
    required this.gold,
    required this.chipBackground,
    required this.chipBorder,
    required this.chipSelectedBg,
    required this.silhouette,
    required this.primaryGradient,
    required this.progressGradient,
    required this.cardGradient,
    required this.cardShadow,
    required this.buttonShadow,
    required this.glowShadow,
  });

  static const light = HouseBuildColors(
    isDark: false,
    background: Color(0xFFF4F6FB),
    cardBackground: Color(0xFFFFFFFF),
    cardBackgroundSecondary: Color(0xFFF8FAFC),
    textPrimary: Color(0xFF111827),
    textSecondary: Color(0xFF4B5563),
    textMuted: Color(0xFF6B7280),
    border: Color(0xFFE2E8F0),
    borderSubtle: Color(0xFFEDF2F7),
    primary: Color(0xFF7C3AED),
    primaryDark: Color(0xFF6D28D9),
    primaryLight: Color(0xFFEDE9FE),
    success: Color(0xFF10B981),
    gold: Color(0xFFF59E0B),
    chipBackground: Color(0xFFFFFFFF),
    chipBorder: Color(0xFFE2E8F0),
    chipSelectedBg: Color(0xFF7C3AED),
    silhouette: Color(0xFFE2E8F0),
    primaryGradient: LinearGradient(
      colors: [Color(0xFF8B5CF6), Color(0xFF6D28D9)],
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
    ),
    progressGradient: LinearGradient(
      colors: [Color(0xFF8B5CF6), Color(0xFF10B981)],
      begin: Alignment.centerLeft,
      end: Alignment.centerRight,
    ),
    cardGradient: LinearGradient(
      colors: [Color(0xFFFFFFFF), Color(0xFFF8FAFC)],
      begin: Alignment.topCenter,
      end: Alignment.bottomCenter,
    ),
    cardShadow: [
      BoxShadow(
        color: Color(0x0C1F2937),
        blurRadius: 16,
        offset: Offset(0, 4),
        spreadRadius: 0,
      ),
    ],
    buttonShadow: [
      BoxShadow(
        color: Color(0x407C3AED),
        blurRadius: 16,
        offset: Offset(0, 6),
      ),
    ],
    glowShadow: [
      BoxShadow(
        color: Color(0x267C3AED),
        blurRadius: 20,
        spreadRadius: 2,
      ),
    ],
  );

  static const dark = HouseBuildColors(
    isDark: true,
    background: Color(0xFF0B0F1A),
    cardBackground: Color(0xFF151A2B),
    cardBackgroundSecondary: Color(0xFF1B2136),
    textPrimary: Color(0xFFFFFFFF),
    textSecondary: Color(0xFFCBD5E1),
    textMuted: Color(0xFF94A3B8),
    border: Color(0x26FFFFFF),
    borderSubtle: Color(0x1AFFFFFF),
    primary: Color(0xFFA78BFA),
    primaryDark: Color(0xFF8B5CF6),
    primaryLight: Color(0xFF2E1E6B),
    success: Color(0xFF10B981),
    gold: Color(0xFFF59E0B),
    chipBackground: Color(0xFF151A2B),
    chipBorder: Color(0x33FFFFFF),
    chipSelectedBg: Color(0xFF8B5CF6),
    silhouette: Color(0xFF1E2638),
    primaryGradient: LinearGradient(
      colors: [Color(0xFF8B5CF6), Color(0xFF6D28D9)],
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
    ),
    progressGradient: LinearGradient(
      colors: [Color(0xFFA78BFA), Color(0xFF10B981)],
      begin: Alignment.centerLeft,
      end: Alignment.centerRight,
    ),
    cardGradient: LinearGradient(
      colors: [Color(0xFF151A2B), Color(0xFF1B2136)],
      begin: Alignment.topCenter,
      end: Alignment.bottomCenter,
    ),
    cardShadow: [
      BoxShadow(
        color: Color(0x60000000),
        blurRadius: 20,
        offset: Offset(0, 8),
      ),
    ],
    buttonShadow: [
      BoxShadow(
        color: Color(0x508B5CF6),
        blurRadius: 20,
        offset: Offset(0, 6),
      ),
    ],
    glowShadow: [
      BoxShadow(
        color: Color(0x338B5CF6),
        blurRadius: 24,
        spreadRadius: 1,
      ),
    ],
  );

  static HouseBuildColors of(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final appTheme = Theme.of(context).extension<AppThemeColors>();

    if (appTheme != null) {
      if (isDark) {
        return dark.copyWith(
          primary: appTheme.primary,
          primaryDark: appTheme.primaryDark,
          textPrimary: appTheme.ink,
          textMuted: appTheme.muted,
          cardBackground: appTheme.card,
        );
      } else {
        return light.copyWith(
          primary: appTheme.primary,
          primaryDark: appTheme.primaryDark,
          textPrimary: appTheme.ink,
          textMuted: appTheme.muted,
          cardBackground: appTheme.card,
        );
      }
    }

    return isDark ? dark : light;
  }

  HouseBuildColors copyWith({
    bool? isDark,
    Color? background,
    Color? cardBackground,
    Color? cardBackgroundSecondary,
    Color? textPrimary,
    Color? textSecondary,
    Color? textMuted,
    Color? border,
    Color? borderSubtle,
    Color? primary,
    Color? primaryDark,
    Color? primaryLight,
    Color? success,
    Color? gold,
    Color? chipBackground,
    Color? chipBorder,
    Color? chipSelectedBg,
    Color? silhouette,
    LinearGradient? primaryGradient,
    LinearGradient? progressGradient,
    LinearGradient? cardGradient,
    List<BoxShadow>? cardShadow,
    List<BoxShadow>? buttonShadow,
    List<BoxShadow>? glowShadow,
  }) {
    return HouseBuildColors(
      isDark: isDark ?? this.isDark,
      background: background ?? this.background,
      cardBackground: cardBackground ?? this.cardBackground,
      cardBackgroundSecondary:
          cardBackgroundSecondary ?? this.cardBackgroundSecondary,
      textPrimary: textPrimary ?? this.textPrimary,
      textSecondary: textSecondary ?? this.textSecondary,
      textMuted: textMuted ?? this.textMuted,
      border: border ?? this.border,
      borderSubtle: borderSubtle ?? this.borderSubtle,
      primary: primary ?? this.primary,
      primaryDark: primaryDark ?? this.primaryDark,
      primaryLight: primaryLight ?? this.primaryLight,
      success: success ?? this.success,
      gold: gold ?? this.gold,
      chipBackground: chipBackground ?? this.chipBackground,
      chipBorder: chipBorder ?? this.chipBorder,
      chipSelectedBg: chipSelectedBg ?? this.chipSelectedBg,
      silhouette: silhouette ?? this.silhouette,
      primaryGradient: primaryGradient ?? this.primaryGradient,
      progressGradient: progressGradient ?? this.progressGradient,
      cardGradient: cardGradient ?? this.cardGradient,
      cardShadow: cardShadow ?? this.cardShadow,
      buttonShadow: buttonShadow ?? this.buttonShadow,
      glowShadow: glowShadow ?? this.glowShadow,
    );
  }
}
