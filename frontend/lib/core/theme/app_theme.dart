import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Semantic Design Extension for MathCity AI (Light & Dark Mode)
class AppThemeColors extends ThemeExtension<AppThemeColors> {
  final Color primary;
  final Color primaryDark;
  final Color primaryLight;
  final Color ink;
  final Color muted;
  final Color inactive;
  final Color bg;
  final Color card;
  final Color cardGlass;
  final Color field;
  final Color border;
  final Color gold;
  final Color proDark;
  final Color flame;
  final Color podiumGold;
  final Color podiumSilver;
  final Color podiumBronze;
  final LinearGradient goldGradient;
  final LinearGradient proGradient;
  final LinearGradient cosmicGradient;
  final bool isDark;

  const AppThemeColors({
    required this.primary,
    required this.primaryDark,
    required this.primaryLight,
    required this.ink,
    required this.muted,
    required this.inactive,
    required this.bg,
    required this.card,
    required this.cardGlass,
    required this.field,
    required this.border,
    required this.gold,
    required this.proDark,
    required this.flame,
    required this.podiumGold,
    required this.podiumSilver,
    required this.podiumBronze,
    required this.goldGradient,
    required this.proGradient,
    required this.cosmicGradient,
    required this.isDark,
  });

  static const light = AppThemeColors(
    primary: Color(0xFF6C47FF),
    primaryDark: Color(0xFF5232D9),
    primaryLight: Color(0xFFEDE9FE),
    ink: Color(0xFF1E1B3A),
    muted: Color(0xFF6B6785),
    inactive: Color(0xFF9A97B0),
    bg: Color(0xFFF6F5FD),
    card: Color(0xFFFFFFFF),
    cardGlass: Color(0xEEFFFFFF),
    field: Color(0xFFF3F0FC),
    border: Color(0xFFE5E0FA),
    gold: Color(0xFFFFD66B),
    proDark: Color(0xFF2A1B7A),
    flame: Color(0xFFE5611B),
    podiumGold: Color(0xFFFFD700),
    podiumSilver: Color(0xFF94A3B8),
    podiumBronze: Color(0xFFF97316),
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
    cosmicGradient: LinearGradient(
      colors: [Color(0xFFF6F5FD), Color(0xFFEDE8FE)],
      begin: Alignment.topCenter,
      end: Alignment.bottomCenter,
    ),
    isDark: false,
  );

  static const dark = AppThemeColors(
    primary: Color(0xFF8B6BFF),
    primaryDark: Color(0xFFB8A6FF),
    primaryLight: Color(0xFF2E1E6B),
    ink: Color(0xFFF8F7FF),
    muted: Color(0xFFA9A4CF),
    inactive: Color(0xFF6E69A0),
    bg: Color(0xFF0A061E),
    card: Color(0xFF160E36),
    cardGlass: Color(0xD9160E36),
    field: Color(0xFF221648),
    border: Color(0xFF2E1E5C),
    gold: Color(0xFFFFD66B),
    proDark: Color(0xFF2A1B7A),
    flame: Color(0xFFE5611B),
    podiumGold: Color(0xFFFFD700),
    podiumSilver: Color(0xFF94A3B8),
    podiumBronze: Color(0xFFF97316),
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
    cosmicGradient: LinearGradient(
      colors: [Color(0xFF0A061E), Color(0xFF140B32)],
      begin: Alignment.topCenter,
      end: Alignment.bottomCenter,
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
    Color? primaryLight,
    Color? ink,
    Color? muted,
    Color? inactive,
    Color? bg,
    Color? card,
    Color? cardGlass,
    Color? field,
    Color? border,
    Color? gold,
    Color? proDark,
    Color? flame,
    Color? podiumGold,
    Color? podiumSilver,
    Color? podiumBronze,
    LinearGradient? goldGradient,
    LinearGradient? proGradient,
    LinearGradient? cosmicGradient,
    bool? isDark,
  }) {
    return AppThemeColors(
      primary: primary ?? this.primary,
      primaryDark: primaryDark ?? this.primaryDark,
      primaryLight: primaryLight ?? this.primaryLight,
      ink: ink ?? this.ink,
      muted: muted ?? this.muted,
      inactive: inactive ?? this.inactive,
      bg: bg ?? this.bg,
      card: card ?? this.card,
      cardGlass: cardGlass ?? this.cardGlass,
      field: field ?? this.field,
      border: border ?? this.border,
      gold: gold ?? this.gold,
      proDark: proDark ?? this.proDark,
      flame: flame ?? this.flame,
      podiumGold: podiumGold ?? this.podiumGold,
      podiumSilver: podiumSilver ?? this.podiumSilver,
      podiumBronze: podiumBronze ?? this.podiumBronze,
      goldGradient: goldGradient ?? this.goldGradient,
      proGradient: proGradient ?? this.proGradient,
      cosmicGradient: cosmicGradient ?? this.cosmicGradient,
      isDark: isDark ?? this.isDark,
    );
  }

  @override
  AppThemeColors lerp(ThemeExtension<AppThemeColors>? other, double t) {
    if (other is! AppThemeColors) return this;
    return AppThemeColors(
      primary: Color.lerp(primary, other.primary, t) ?? primary,
      primaryDark: Color.lerp(primaryDark, other.primaryDark, t) ?? primaryDark,
      primaryLight: Color.lerp(primaryLight, other.primaryLight, t) ?? primaryLight,
      ink: Color.lerp(ink, other.ink, t) ?? ink,
      muted: Color.lerp(muted, other.muted, t) ?? muted,
      inactive: Color.lerp(inactive, other.inactive, t) ?? inactive,
      bg: Color.lerp(bg, other.bg, t) ?? bg,
      card: Color.lerp(card, other.card, t) ?? card,
      cardGlass: Color.lerp(cardGlass, other.cardGlass, t) ?? cardGlass,
      field: Color.lerp(field, other.field, t) ?? field,
      border: Color.lerp(border, other.border, t) ?? border,
      gold: Color.lerp(gold, other.gold, t) ?? gold,
      proDark: Color.lerp(proDark, other.proDark, t) ?? proDark,
      flame: Color.lerp(flame, other.flame, t) ?? flame,
      podiumGold: Color.lerp(podiumGold, other.podiumGold, t) ?? podiumGold,
      podiumSilver: Color.lerp(podiumSilver, other.podiumSilver, t) ?? podiumSilver,
      podiumBronze: Color.lerp(podiumBronze, other.podiumBronze, t) ?? podiumBronze,
      goldGradient: LinearGradient.lerp(goldGradient, other.goldGradient, t) ?? goldGradient,
      proGradient: LinearGradient.lerp(proGradient, other.proGradient, t) ?? proGradient,
      cosmicGradient: LinearGradient.lerp(cosmicGradient, other.cosmicGradient, t) ?? cosmicGradient,
      isDark: t < 0.5 ? isDark : other.isDark,
    );
  }
}

/// ThemeData Factory for MathCity AI
class AppTheme {
  static const List<String> fallbackFonts = [
    'Nunito',
    'Noto Sans',
    'Noto Sans Math',
    'Noto Color Emoji',
    'sans-serif',
  ];

  static ThemeData get lightTheme {
    const colors = AppThemeColors.light;
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      fontFamily: 'Nunito',
      fontFamilyFallback: fallbackFonts,
      scaffoldBackgroundColor: colors.bg,
      cardColor: colors.card,
      dividerColor: colors.border,
      colorScheme: ColorScheme.light(
        primary: colors.primary,
        onPrimary: Colors.white,
        primaryContainer: colors.primaryLight,
        onPrimaryContainer: colors.primaryDark,
        secondary: colors.primaryDark,
        onSecondary: Colors.white,
        surface: colors.card,
        onSurface: colors.ink,
        error: const Color(0xFFEF4444),
        onError: Colors.white,
      ),
      cardTheme: CardThemeData(
        color: colors.card,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(color: colors.border, width: 1.2),
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: colors.card,
        foregroundColor: colors.ink,
        elevation: 0,
        centerTitle: false,
        systemOverlayStyle: const SystemUiOverlayStyle(
          statusBarColor: Colors.transparent,
          statusBarIconBrightness: Brightness.dark,
          statusBarBrightness: Brightness.light,
          systemNavigationBarColor: Colors.transparent,
          systemNavigationBarIconBrightness: Brightness.dark,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: colors.field,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: colors.border, width: 1.2),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: colors.border, width: 1.2),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: colors.primary, width: 1.8),
        ),
        hintStyle: TextStyle(color: colors.muted, fontSize: 13),
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: colors.card,
        elevation: 8,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        titleTextStyle: TextStyle(
          color: colors.ink,
          fontWeight: FontWeight.w800,
          fontSize: 18,
          fontFamily: 'Nunito',
        ),
        contentTextStyle: TextStyle(
          color: colors.muted,
          fontSize: 14,
          fontFamily: 'Nunito',
        ),
      ),
      switchTheme: SwitchThemeData(
        thumbColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) return Colors.white;
          return colors.muted;
        }),
        trackColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) return colors.primary;
          return colors.border;
        }),
      ),
      extensions: const [colors],
    );
  }

  static ThemeData get darkTheme {
    const colors = AppThemeColors.dark;
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      fontFamily: 'Nunito',
      fontFamilyFallback: fallbackFonts,
      scaffoldBackgroundColor: colors.bg,
      cardColor: colors.card,
      dividerColor: colors.border,
      colorScheme: ColorScheme.dark(
        primary: colors.primary,
        onPrimary: const Color(0xFF0A061E),
        primaryContainer: colors.primaryLight,
        onPrimaryContainer: Colors.white,
        secondary: colors.primaryDark,
        onSecondary: Colors.white,
        surface: colors.card,
        onSurface: colors.ink,
        error: const Color(0xFFEF4444),
        onError: Colors.white,
      ),
      cardTheme: CardThemeData(
        color: colors.card,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(color: colors.border, width: 1.2),
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: colors.card,
        foregroundColor: colors.ink,
        elevation: 0,
        centerTitle: false,
        systemOverlayStyle: const SystemUiOverlayStyle(
          statusBarColor: Colors.transparent,
          statusBarIconBrightness: Brightness.light,
          statusBarBrightness: Brightness.dark,
          systemNavigationBarColor: Colors.transparent,
          systemNavigationBarIconBrightness: Brightness.light,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: colors.field,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: colors.border, width: 1.2),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: colors.border, width: 1.2),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: colors.primary, width: 1.8),
        ),
        hintStyle: TextStyle(color: colors.muted, fontSize: 13),
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: colors.card,
        elevation: 8,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        titleTextStyle: TextStyle(
          color: colors.ink,
          fontWeight: FontWeight.w800,
          fontSize: 18,
          fontFamily: 'Nunito',
        ),
        contentTextStyle: TextStyle(
          color: colors.muted,
          fontSize: 14,
          fontFamily: 'Nunito',
        ),
      ),
      switchTheme: SwitchThemeData(
        thumbColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) return Colors.white;
          return colors.muted;
        }),
        trackColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) return colors.primary;
          return colors.border;
        }),
      ),
      extensions: const [colors],
    );
  }
}

/// Theme Mode Notifier with persistent shared_preferences storage
class ThemeModeNotifier extends StateNotifier<ThemeMode> {
  static const _prefKey = 'app_theme_mode';
  static const _legacyPrefKey = 'mc_theme_mode';

  ThemeModeNotifier() : super(ThemeMode.system) {
    _loadThemeMode();
  }

  Future<void> _loadThemeMode() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final saved = prefs.getString(_prefKey) ?? prefs.getString(_legacyPrefKey);
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
      final val = mode == ThemeMode.light
          ? 'light'
          : mode == ThemeMode.dark
              ? 'dark'
              : 'system';
      await prefs.setString(_prefKey, val);
      await prefs.setString(_legacyPrefKey, val);
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

/// Global Animation Preference Provider (persisted in SharedPreferences)
class AnimationPreferenceNotifier extends StateNotifier<bool> {
  static const _prefKey = 'mc_animations_enabled';

  AnimationPreferenceNotifier() : super(true) {
    _loadPreference();
  }

  Future<void> _loadPreference() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final val = prefs.getBool(_prefKey);
      if (val != null) {
        state = val;
      }
    } catch (_) {}
  }

  Future<void> setAnimationsEnabled(bool enabled) async {
    state = enabled;
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool(_prefKey, enabled);
    } catch (_) {}
  }

  Future<void> setEnabled(bool enabled) => setAnimationsEnabled(enabled);
}

final animationsEnabledProvider =
    StateNotifierProvider<AnimationPreferenceNotifier, bool>((ref) {
  return AnimationPreferenceNotifier();
});
