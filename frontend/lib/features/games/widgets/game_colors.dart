import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';

/// Semantic colors token for games and the Tug of War game
class GameColors {
  final bool isDark;
  final Color background;
  final Color cardBackground;
  final Color cardSecondary;
  final Color border;
  final Color borderSubtle;
  final Color textPrimary;
  final Color textSecondary;
  final Color textMuted;
  final Color primaryBlue;
  final Color blueTeam;
  final Color blueTeamBg;
  final Color blueTeamBorder;
  final Color redTeam;
  final Color redTeamBg;
  final Color redTeamBorder;
  final Color successGreen;
  final Color gold;
  final LinearGradient blueGradient;
  final List<BoxShadow> cardShadow;
  final List<BoxShadow> buttonShadow;

  const GameColors({
    required this.isDark,
    required this.background,
    required this.cardBackground,
    required this.cardSecondary,
    required this.border,
    required this.borderSubtle,
    required this.textPrimary,
    required this.textSecondary,
    required this.textMuted,
    required this.primaryBlue,
    required this.blueTeam,
    required this.blueTeamBg,
    required this.blueTeamBorder,
    required this.redTeam,
    required this.redTeamBg,
    required this.redTeamBorder,
    required this.successGreen,
    required this.gold,
    required this.blueGradient,
    required this.cardShadow,
    required this.buttonShadow,
  });

  static const light = GameColors(
    isDark: false,
    background: Color(0xFFF4F6FB),
    cardBackground: Color(0xFFFFFFFF),
    cardSecondary: Color(0xFFF8FAFC),
    border: Color(0xFFE2E8F0),
    borderSubtle: Color(0xFFEDF2F7),
    textPrimary: Color(0xFF111827),
    textSecondary: Color(0xFF4B5563),
    textMuted: Color(0xFF6B7280),
    primaryBlue: Color(0xFF2563EB),
    blueTeam: Color(0xFF2563EB),
    blueTeamBg: Color(0xFFEFF6FF),
    blueTeamBorder: Color(0xFF93C5FD),
    redTeam: Color(0xFFDC2626),
    redTeamBg: Color(0xFFFEF2F2),
    redTeamBorder: Color(0xFFFCA5A5),
    successGreen: Color(0xFF10B981),
    gold: Color(0xFFF59E0B),
    blueGradient: LinearGradient(
      colors: [Color(0xFF3B82F6), Color(0xFF1D4ED8)],
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
    ),
    cardShadow: [
      BoxShadow(
        color: Color(0x0C1F2937),
        blurRadius: 16,
        offset: Offset(0, 4),
      ),
    ],
    buttonShadow: [
      BoxShadow(
        color: Color(0x352563EB),
        blurRadius: 14,
        offset: Offset(0, 4),
      ),
    ],
  );

  static const dark = GameColors(
    isDark: true,
    background: Color(0xFF0B0F1A),
    cardBackground: Color(0xFF151A2B),
    cardSecondary: Color(0xFF1E2638),
    border: Color(0x26FFFFFF),
    borderSubtle: Color(0x1AFFFFFF),
    textPrimary: Color(0xFFFFFFFF),
    textSecondary: Color(0xFFCBD5E1),
    textMuted: Color(0xFF94A3B8),
    primaryBlue: Color(0xFF3B82F6),
    blueTeam: Color(0xFF60A5FA),
    blueTeamBg: Color(0xFF172554),
    blueTeamBorder: Color(0xFF1E40AF),
    redTeam: Color(0xFFF87171),
    redTeamBg: Color(0xFF450A0A),
    redTeamBorder: Color(0xFF991B1B),
    successGreen: Color(0xFF34D399),
    gold: Color(0xFFFBBF24),
    blueGradient: LinearGradient(
      colors: [Color(0xFF2563EB), Color(0xFF1E40AF)],
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
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
        color: Color(0x403B82F6),
        blurRadius: 16,
        offset: Offset(0, 5),
      ),
    ],
  );

  static GameColors of(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final appTheme = Theme.of(context).extension<AppThemeColors>();

    if (appTheme != null) {
      if (isDark) {
        return dark;
      } else {
        return light;
      }
    }
    return isDark ? dark : light;
  }
}
