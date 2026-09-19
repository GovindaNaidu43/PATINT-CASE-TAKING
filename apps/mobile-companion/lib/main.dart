import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'screens/home_screen.dart';
import 'theme/medikiosk_theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      systemNavigationBarColor: MediKioskTheme.royalSurface,
      systemNavigationBarIconBrightness: Brightness.dark,
    ),
  );
  runApp(const MediKioskCompanionApp());
}

class MediKioskCompanionApp extends StatelessWidget {
  const MediKioskCompanionApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MediKiosk Companion',
      debugShowCheckedModeBanner: false,
      theme: MediKioskTheme.themeData,
      home: const HomeScreen(),
    );
  }
}
