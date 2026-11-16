import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';

class TeenTheme {
  static ThemeData get theme {
    final textTheme = GoogleFonts.interTextTheme().apply(
      bodyColor: AppColors.teenWhiteText,
      displayColor: AppColors.teenWhiteText,
    );

    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: AppColors.teenBackground,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.teenPrimaryLime,
        secondary: AppColors.teenAccentPurple,
        surface: AppColors.teenSurface,
        error: Colors.redAccent,
      ),
      textTheme: textTheme.copyWith(
        displayLarge: GoogleFonts.inter(
          fontSize: 30,
          fontWeight: FontWeight.w800,
          color: AppColors.teenWhiteText,
        ),
        titleLarge: GoogleFonts.inter(
          fontSize: 22,
          fontWeight: FontWeight.w700,
          color: AppColors.teenWhiteText,
        ),
        titleMedium: GoogleFonts.inter(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: AppColors.teenWhiteText,
        ),
        bodyLarge: GoogleFonts.inter(
          fontSize: 15,
          fontWeight: FontWeight.w400,
          color: AppColors.teenWhiteText,
        ),
        bodyMedium: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w400,
          color: AppColors.teenMutedText,
        ),
      ),
      cardTheme: CardThemeData(
        color: AppColors.teenSurface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppColors.teenBorder, width: 1.0),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.teenPrimaryLime,
          foregroundColor: AppColors.teenLimeTextDark,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          textStyle: GoogleFonts.inter(
            fontSize: 15,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
    );
  }
}
