import 'package:flutter/material.dart';

class AppTheme {
  // Brand & Palette Colors matching PlanPocket React frontend
  static const Color background = Color(0xFF111827); // gray-900
  static const Color surface = Color(0xFF1F2937); // gray-800
  static const Color surfaceLight = Color(0xFF374151); // gray-700
  static const Color surfaceLighter = Color(0xFF4B5563); // gray-600

  static const Color primaryBlue = Color(0xFF2563EB); // blue-600
  static const Color primaryBlueLight = Color(0xFF3B82F6); // blue-500
  static const Color successGreen = Color(0xFF10B981); // green-500
  static const Color successGreenDark = Color(0xFF059669); // green-600
  static const Color dangerRed = Color(0xFFEF4444); // red-500
  static const Color dangerRedDark = Color(0xFFDC2626); // red-600
  static const Color warningYellow = Color(0xFFF59E0B); // yellow-500
  static const Color warningYellowDark = Color(0xFFD97706); // yellow-600
  static const Color purpleAccent = Color(0xFF9333EA); // purple-600

  static const Color textPrimary = Color(0xFFF9FAFB); // gray-50
  static const Color textSecondary = Color(0xFF9CA3AF); // gray-400
  static const Color textMuted = Color(0xFF6B7280); // gray-500

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      fontFamily: 'Nata Sans',
      scaffoldBackgroundColor: background,
      primaryColor: primaryBlue,
      colorScheme: const ColorScheme.dark(
        primary: primaryBlue,
        secondary: primaryBlueLight,
        surface: surface,
        error: dangerRed,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: textPrimary,
        onError: Colors.white,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: surface,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: textPrimary,
          fontSize: 22,
          fontWeight: FontWeight.bold,
        ),
        iconTheme: IconThemeData(color: textPrimary),
      ),
      cardTheme: CardThemeData(
        color: surface,
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surfaceLight,
        hintStyle: const TextStyle(color: textMuted, fontSize: 14),
        labelStyle: const TextStyle(color: textSecondary, fontSize: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: primaryBlueLight, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: dangerRed, width: 1.5),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: dangerRed, width: 2),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryBlue,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          textStyle: const TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: surface,
        selectedItemColor: primaryBlueLight,
        unselectedItemColor: textMuted,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
    );
  }
}
