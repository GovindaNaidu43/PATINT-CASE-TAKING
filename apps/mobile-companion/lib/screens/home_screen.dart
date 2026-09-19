import 'package:flutter/material.dart';
import '../theme/medikiosk_theme.dart';
import 'abha_card_screen.dart';
import 'summaries_screen.dart';
import 'followup_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    AbhaCardScreen(),
    const SummariesScreen(),
    const FollowUpScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: MediKioskTheme.royalSurface.withOpacity(0.95),
          border: const Border(
            top: BorderSide(color: MediKioskTheme.royalBorder, width: 1.0),
          ),
          boxShadow: [
            BoxShadow(
              color: MediKioskTheme.royalGold.withOpacity(0.08),
              blurRadius: 16,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) => setState(() => _currentIndex = index),
          backgroundColor: Colors.transparent,
          elevation: 0,
          selectedItemColor: MediKioskTheme.royalGold,
          unselectedItemColor: MediKioskTheme.royalMuted,
          selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
          unselectedLabelStyle: const TextStyle(fontSize: 11),
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.badge_outlined),
              activeIcon: Icon(Icons.badge),
              label: 'ABHA & Token',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.history_edu_outlined),
              activeIcon: Icon(Icons.history_edu),
              label: 'Summaries',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.ring_volume_outlined),
              activeIcon: Icon(Icons.ring_volume),
              label: 'Follow-Up',
            ),
          ],
        ),
      ),
    );
  }
}
