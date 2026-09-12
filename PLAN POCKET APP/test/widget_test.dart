import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:plan_pocket_app/main.dart';
import 'package:plan_pocket_app/providers/app_provider.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    SharedPreferences.setMockInitialValues({});

    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => AppProvider()),
        ],
        child: const PlanPocketApp(),
      ),
    );
    expect(find.byType(PlanPocketApp), findsOneWidget);
  });

  testWidgets('Tapping logo 5 times within 2 seconds opens GabrialSignatureScreen', (WidgetTester tester) async {
    SharedPreferences.setMockInitialValues({});

    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => AppProvider()),
        ],
        child: const PlanPocketApp(),
      ),
    );
    await tester.pump();

    // Find the logo GestureDetector
    final logoFinder = find.byType(GestureDetector).first;
    expect(logoFinder, findsOneWidget);

    // Tap 4 times -> Should NOT open yet
    for (int i = 0; i < 4; i++) {
      await tester.tap(logoFinder);
      await tester.pump(const Duration(milliseconds: 50));
    }
    expect(find.text('Gabrial Deora'), findsNothing);

    // 5th tap within 2 seconds -> Triggers Easter Egg
    await tester.tap(logoFinder);
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 600));

    expect(find.text('Gabrial Deora'), findsOneWidget);
    expect(find.text('Creator & Lead Engineer'), findsOneWidget);
    expect(find.text('AUTHOR SIGNATURE VERIFIED'), findsOneWidget);
  });
}