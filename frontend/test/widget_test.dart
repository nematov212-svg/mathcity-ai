import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mathcity_ai/app/app.dart';

void main() {
  testWidgets('MathCity AI app smoke test and brand verification', (WidgetTester tester) async {
    SharedPreferences.setMockInitialValues({});

    // Build MathCityApp within ProviderScope
    await tester.pumpWidget(
      const ProviderScope(
        child: MathCityApp(),
      ),
    );

    // Initial splash frame verification
    expect(find.text('MathCity AI'), findsOneWidget);
    expect(find.text('Matematika va Kelajak Shahri'), findsOneWidget);

    // Advance timer past splash transition
    await tester.pump(const Duration(milliseconds: 2000));
    await tester.pumpAndSettle();

    // Login screen frame verification (Reference Image 2)
    expect(find.text('Yana xush kelibsiz!'), findsOneWidget);
    expect(find.text('Kirish'), findsOneWidget);
  });
}
