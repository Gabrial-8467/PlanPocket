import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/add_transaction_dialog.dart';
import 'dashboard_screen.dart';
import 'summary_screen.dart';
import 'profile_screen.dart';
import 'gabrial_signature_screen.dart';

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;
  final List<DateTime> _logoTaps = [];

  void _onTabTapped(int index) {
    setState(() => _currentIndex = index);
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> screens = [
      DashboardScreen(onNavigateToTab: _onTabTapped),
      const SummaryScreen(),
      const ProfileScreen(),
    ];

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            GestureDetector(
              behavior: HitTestBehavior.opaque,
              onTap: () => GabrialSignatureScreen.checkAndTrigger(
                context: context,
                tapTimestamps: _logoTaps,
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.asset(
                  'assets/icon/app_icon.png',
                  width: 32,
                  height: 32,
                  fit: BoxFit.cover,
                ),
              ),
            ),
            const SizedBox(width: 10),
            const Text('PlanPocket'),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.add, color: AppTheme.primaryBlueLight),
            tooltip: 'Add Transaction',
            onPressed: () {
              showDialog(
                context: context,
                builder: (_) => const AddTransactionDialog(),
              );
            },
          ),
        ],
      ),
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: _onTabTapped,
        backgroundColor: AppTheme.surface,
        selectedItemColor: AppTheme.primaryBlueLight,
        unselectedItemColor: AppTheme.textMuted,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard_outlined),
            activeIcon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.pie_chart_outline),
            activeIcon: Icon(Icons.pie_chart),
            label: 'Summary',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            activeIcon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
      floatingActionButton: _currentIndex == 0
          ? FloatingActionButton(
              backgroundColor: AppTheme.primaryBlue,
              foregroundColor: Colors.white,
              tooltip: 'Add Transaction',
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (_) => const AddTransactionDialog(),
                );
              },
              child: const Icon(Icons.add),
            )
          : null,
    );
  }
}
