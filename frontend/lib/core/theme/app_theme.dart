import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Semantic Design Extension for MathCity AI (Light & Dark Mode)
class AppThemeColors extends ThemeExtension<AppThemeColors> {
  final Color primary;
  final Color primaryDark;
  final Color ink;
  final Color muted;
  final Color inactive;
  final Color bg;
  final Color card;
  final Color border;
  final Color gold;
  final Color proDark;
  final Color flame;
  final LinearGradient goldGradient;
  final LinearGradient proGradient;
  final bool isDark;

  const AppThemeColors({
    required this.primary,
    required this.primaryDark,
    required this.ink,
    required this.muted,
    required this.inactive,
    required this.bg,
    required this.card,
    required this.border,
    required this.gold,
    required this.proDark,
    required this.flame,
    required this.goldGradient,
    required this.proGradient,
    required this.isDark,
  });

  static const light = AppThemeColors(
    primary: Color(0xFF6C47FF),
    primaryDark: Color(0xFF5232D9),
    ink: Color(0xFF1E1B3A),
    muted: Color(0xFF6B6785),
    inactive: Color(0xFF9A97B0),
    bg: Color(0xFFF5F4FC),
    card: Color(0xFFFFFFFF),
    border: Color(0xFFE7E4F5),
    gold: Color(0xFFFFD66B),
    proDark: Color(0xFF2A1B7A),
    flame: Color(0xFFE5611B),
    goldGradient: LinearGradient(
      colors: [Color(0xFFFFD66B), Color(0xFFF5A623)],
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
    ),
    proGradient: LinearGradient(
      colors: [Color(0xFF2A1B7A), Color(0xFF5B3BE8), Color(0xFF9B7CFF)],
      begin: Alignment(-0.7, -0.7),
      end: Alignment(0.7, 0.7),
    ),
    isDark: false,
  );

  static const dark = AppThemeColors(
    primary: Color(0xFF8B6BFF),
    primaryDark: Color(0xFFB8A6FF),
    ink: Color(0xFFF4F2FF),
    muted: Color(0xFFA9A4CF),
    inactive: Color(0xFF6E69A0),
    bg: Color(0xFF0F0C24),
    card: Color(0xFF1A1638),
    border: Color(0xFF2A2452),
    gold: Color(0xFFFFD66B),
    proDark: Color(0xFF2A1B7A),
    flame: Color(0xFFE5611B),
    goldGradient: LinearGradient(
      colors: [Color(0xFFFFD66B), Color(0xFFF5A623)],
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
    ),
    proGradient: LinearGradient(
      colors: [Color(0xFF2A1B7A), Color(0xFF5B3BE8), Color(0xFF9B7CFF)],
      begin: Alignment(-0.7, -0.7),
      end: Alignment(0.7, 0.7),
    ),
    isDark: true,
  );

  static AppThemeColors of(BuildContext context) {
    return Theme.of(context).extension<AppThemeColors>() ??
        (Theme.of(context).brightness == Brightness.dark ? dark : light);
  }

  @override
  AppThemeColors copyWith({
    Color? primary,
    Color? primaryDark,
    Color? ink,
    Color? muted,
    Color? inactive,
    Color? bg,
    Color? card,
    Color? border,
    Color? gold,
    Color? proDark,
    Color? flame,
    LinearGradient? goldGradient,
    LinearGradient? proGradient,
    bool? isDark,
  }) {
    return AppThemeColors(
      primary: primary ?? this.primary,
      primaryDark: primaryDark ?? this.primaryDark,
      ink: ink ?? this.ink,
      muted: muted ?? this.muted,
      inactive: inactive ?? this.inactive,
      bg: bg ?? this.bg,
      card: card ?? this.card,
      border: border ?? this.border,
      gold: gold ?? this.gold,
      proDark: proDark ?? this.proDark,
      flame: flame ?? this.flame,
      goldGradient: goldGradient ?? this.goldGradient,
      proGradient: proGradient ?? this.proGradient,
      isDark: isDark ?? this.isDark,
    );
  }

  @override
  AppThemeColors lerp(ThemeExtension<AppThemeColors>? other, double t) {
    if (other is! AppThemeColors) return this;
    return AppThemeColors(
      primary: Color.lerp(primary, other.primary, t) ?? primary,
      primaryDark: Color.lerp(primaryDark, other.primaryDark, t) ?? primaryDark,
      ink: Color.lerp(ink, other.ink, t) ?? ink,
      muted: Color.lerp(muted, other.muted, t) ?? muted,
      inactive: Color.lerp(inactive, other.inactive, t) ?? inactive,
      bg: Color.lerp(bg, other.bg, t) ?? bg,
      card: Color.lerp(card, other.card, t) ?? card,
      border: Color.lerp(border, other.border, t) ?? border,
      gold: Color.lerp(gold, other.gold, t) ?? gold,
      proDark: Color.lerp(proDark, other.proDark, t) ?? proDark,
      flame: Color.lerp(flame, other.flame, t) ?? flame,
      goldGradient: LinearGradient.lerp(goldGradient, other.goldGradient, t) ?? goldGradient,
      proGradient: LinearGradient.lerp(proGradient, other.proGradient, t) ?? proGradient,
      isDark: t < 0.5 ? isDark : other.isDark,
    );
  }
}

/// ThemeData Factory for MathCity AI
class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      fontFamily: 'Nunito',
      scaffoldBackgroundColor: AppThemeColors.light.bg,
      colorScheme: ColorScheme.light(
        primary: AppThemeColors.light.primary,
        onPrimary: Colors.white,
        secondary: AppThemeColors.light.primaryDark,
        surface: AppThemeColors.light.card,
        onSurface: AppThemeColors.light.ink,
      ),
      extensions: const [AppThemeColors.light],
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      fontFamily: 'Nunito',
      scaffoldBackgroundColor: AppThemeColors.dark.bg,
      colorScheme: ColorScheme.dark(
        primary: AppThemeColors.dark.primary,
        onPrimary: const Color(0xFF0F0C24),
        secondary: AppThemeColors.dark.primaryDark,
        surface: AppThemeColors.dark.card,
        onSurface: AppThemeColors.dark.ink,
      ),
      extensions: const [AppThemeColors.dark],
    );
  }
}

/// Theme Mode Notifier with persistent shared_preferences storage
class ThemeModeNotifier extends StateNotifier<ThemeMode> {
  static const _prefKey = 'app_theme_mode';

  ThemeModeNotifier() : super(ThemeMode.system) {
    _loadThemeMode();
  }

  Future<void> _loadThemeMode() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final saved = prefs.getString(_prefKey);
      if (saved == 'light') {
        state = ThemeMode.light;
      } else if (saved == 'dark') {
        state = ThemeMode.dark;
      } else {
        state = ThemeMode.system;
      }
    } catch (_) {}
  }

  Future<void> setThemeMode(ThemeMode mode) async {
    state = mode;
    try {
      final prefs = await SharedPreferences.getInstance();
      if (mode == ThemeMode.light) {
        await prefs.setString(_prefKey, 'light');
      } else if (mode == ThemeMode.dark) {
        await prefs.setString(_prefKey, 'dark');
      } else {
        await prefs.setString(_prefKey, 'system');
      }
    } catch (_) {}
  }

  void toggleTheme() {
    if (state == ThemeMode.light) {
      setThemeMode(ThemeMode.dark);
    } else {
      setThemeMode(ThemeMode.light);
    }
  }
}

final themeModeProvider = StateNotifierProvider<ThemeModeNotifier, ThemeMode>((ref) {
  return ThemeModeNotifier();
});
