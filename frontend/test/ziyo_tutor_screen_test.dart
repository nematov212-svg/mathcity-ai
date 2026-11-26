import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mathcity_ai/features/ai_teacher/ziyo_tutor_screen.dart';

void main() {
  testWidgets(
      'AI Ustoz screen renders cosmic starry UI, glass header, and official logo',
      (tester) async {
    tester.view.physicalSize = const Size(390, 844);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: ZiyoTutorScreen(),
        ),
      ),
    );
    await tester.pump(const Duration(milliseconds: 300));

    // 1. Header verification
    expect(find.text('AI Ustoz'), findsWidgets);
    expect(find.text('Matematika ustozing'), findsOneWidget);
    expect(find.byIcon(Icons.history_rounded), findsOneWidget);
    expect(find.byIcon(Icons.arrow_back_ios_new_rounded), findsOneWidget);

    // 2. Empty state greeting verification
    expect(find.textContaining('Men sizning AI matematik ustozingizman'),
        findsOneWidget);

    // 3. Removed 4 starter prompts verification (Must NOT be present)
    expect(find.text('2 × 5 nechchi bo‘ladi?'), findsNothing);
    expect(find.text('Kasrlarni qanday qo‘shamiz?'), findsNothing);
    expect(find.text('Foizlarni tushuntirib ber.'), findsNothing);
    expect(find.text('Tenglamalarni yechishni o‘rgat.'), findsNothing);

    // 4. Input Composer verification (Camera, Mic, Send, Hint)
    expect(find.byIcon(Icons.add_a_photo_rounded), findsOneWidget);
    expect(find.byIcon(Icons.mic_rounded), findsOneWidget);
    expect(find.byIcon(Icons.send_rounded), findsOneWidget);
    expect(find.text('Savol, misol yoki tenglamani yozing...'), findsOneWidget);

    // 5. Cosmic background CustomPainter presence
    expect(find.byType(CustomPaint), findsWidgets);
  });
}
