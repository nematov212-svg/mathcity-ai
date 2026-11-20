import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';

class KidsTheme {
  /// Local unicode and mathematical symbol fallback fonts
  static const List<String> fallbackFonts = [
    'Noto Sans',
    'Noto Sans Math',
    'Noto Color Emoji',
    'sans-serif',
  ];

  static ThemeData get theme {
    final textTheme = GoogleFonts.nunitoTextTheme().apply(
      bodyColor: AppColors.kidsDarkText,
      displayColor: AppColors.kidsDarkText,
      fontFamilyFallback: fallbackFonts,
    );

    return ThemeData(
      useMaterial3: true,
      fontFamily: 'Nunito',
      fontFamilyFallback: fallbackFonts,
      scaffoldBackgroundColor: AppColors.kidsBackground,
      colorScheme: const ColorScheme.light(
        primary: AppColors.kidsPrimary,
        secondary: AppColors.kidsGreen,
        surface: AppColors.kidsSurface,
        error: AppColors.kidsError,
      ),
      textTheme: textTheme.copyWith(
        displayLarge: GoogleFonts.nunito(
          fontSize: 28,
          fontWeight: FontWeight.w800,
          color: AppColors.kidsDarkText,
        ).copyWith(fontFamilyFallback: fallbackFonts),
        titleLarge: GoogleFonts.nunito(
          fontSize: 22,
          fontWeight: FontWeight.w700,
          color: AppColors.kidsDarkText,
        ).copyWith(fontFamilyFallback: fallbackFonts),
        titleMedium: GoogleFonts.nunito(
          fontSize: 18,
          fontWeight: FontWeight.w700,
          color: AppColors.kidsDarkText,
        ).copyWith(fontFamilyFallback: fallbackFonts),
        bodyLarge: GoogleFonts.nunito(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: AppColors.kidsDarkText,
        ).copyWith(fontFamilyFallback: fallbackFonts),
        bodyMedium: GoogleFonts.nunito(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: AppColors.kidsSecondaryText,
        ).copyWith(fontFamilyFallback: fallbackFonts),
      ),
      cardTheme: CardThemeData(
        color: AppColors.kidsSurface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: const BorderSide(color: AppColors.kidsBorder, width: 1.5),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.kidsPrimary,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          textStyle: GoogleFonts.nunito(
            fontSize: 16,
            fontWeight: FontWeight.w700,
          ).copyWith(fontFamilyFallback: fallbackFonts),
        ),
      ),
    );
  }
}
