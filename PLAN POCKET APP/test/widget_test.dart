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
}