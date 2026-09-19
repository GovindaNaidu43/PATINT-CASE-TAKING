import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class MediKioskTheme {
  // Palette matching Web Kiosk and Doctor Dashboard
  static const Color royalBg = Color(0xFFFAF3E8);        // Warm cream
  static const Color royalSurface = Color(0xFFFFFDF8);   // Warm card white
  static const Color royalGold = Color(0xFFB8863C);      // Primary muted gold
  static const Color royalGoldAccent = Color(0xFFC9974B);// Bright gold accent
  static const Color royalGoldLight = Color(0xFFF0DEC0); // Light parchment gold
  static const Color royalCrimson = Color(0xFFA7685D);   // Terracotta / alert
  static const Color royalIvory = Color(0xFF3E2E1E);     // Dark brown typography
  static const Color royalMuted = Color(0xFF8A745A);     // Muted earthy brown
  static const Color royalBorder = Color(0xFFE8D9BC);    // Subtle gold border
  static const Color royalTeal = Color(0xFF8CA383);      // Ayurvedic sage green
  static const Color royalDarkBrown = Color(0xFF2C1F12);

  static ThemeData get themeData {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: royalBg,
      colorScheme: const ColorScheme.light(
        primary: royalGold,
        secondary: royalTeal,
        surface: royalSurface,
        error: royalCrimson,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: royalIvory,
      ),
      textTheme: TextTheme(
        displayLarge: GoogleFonts.cormorantGaramond(
          color: royalIvory,
          fontSize: 32,
          fontWeight: FontWeight.bold,
          letterSpacing: 0.5,
        ),
        displayMedium: GoogleFonts.cormorantGaramond(
          color: royalIvory,
          fontSize: 24,
          fontWeight: FontWeight.w700,
        ),
        titleLarge: GoogleFonts.cormorantGaramond(
          color: royalGold,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),
        titleMedium: GoogleFonts.nunitoSans(
          color: royalIvory,
          fontSize: 16,
          fontWeight: FontWeight.bold,
        ),
        bodyLarge: GoogleFonts.nunitoSans(
          color: royalIvory,
          fontSize: 14,
        ),
        bodyMedium: GoogleFonts.nunitoSans(
          color: royalMuted,
          fontSize: 13,
        ),
        labelSmall: GoogleFonts.nunitoSans(
          color: royalMuted,
          fontSize: 11,
          fontWeight: FontWeight.w700,
          letterSpacing: 1.0,
        ),
      ),
    );
  }
}
