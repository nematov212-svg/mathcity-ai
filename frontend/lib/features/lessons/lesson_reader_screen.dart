import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/custom_button.dart';

class LessonReaderScreen extends StatelessWidget {
  final String lessonId;

  const LessonReaderScreen({super.key, required this.lessonId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.kidsBackground,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.kidsDarkText),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Yangi mavzu',
          style: TextStyle(
            fontWeight: FontWeight.w800,
            fontSize: 18,
            color: AppColors.kidsDarkText,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Lesson Header Tag & Title
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: AppColors.kidsPrimary.withOpacity(0.12),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Text(
                '4-SINF • ODDIY KASRLAR',
                style: TextStyle(
                  color: AppColors.kidsPrimary,
                  fontWeight: FontWeight.w800,
                  fontSize: 12,
                  letterSpacing: 1.1,
                ),
              ),
            ),
            const SizedBox(height: 12),
            const Text(
              'Kasr nima? Surat va maxraj tushunchasi',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w900,
                color: AppColors.kidsDarkText,
                height: 1.3,
              ),
            ),
            const SizedBox(height: 20),

            // Visual Mathematics Illustration (Figma 2:18 Fraction Pie Slices)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(28),
                border: Border.all(color: AppColors.kidsBorder, width: 1.5),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.kidsDarkText.withOpacity(0.04),
                    blurRadius: 18,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                children: [
                  // Pie Diagram Custom Paint
                  SizedBox(
                    width: 140,
                    height: 140,
                    child: CustomPaint(
                      painter: FractionPiePainter(highlightedSlices: 1, totalSlices: 4),
                    ),
                  ),
                  const SizedBox(height: 20),
                  // Fraction Display
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF3F0FF),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFDED6FF)),
                        ),
                        child: const Column(
                          children: [
                            Text(
                              '1',
                              style: TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.w900,
                                color: AppColors.kidsPrimary,
                              ),
                            ),
                            SizedBox(
                              width: 32,
                              child: Divider(color: AppColors.kidsPrimary, thickness: 2.5, height: 8),
                            ),
                            Text(
                              '4',
                              style: TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.w900,
                                color: AppColors.kidsDarkText,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 16),
                      const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '1 — Surat (bo‘yalgan qism)',
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                              color: AppColors.kidsPrimary,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            '4 — Maxraj (jami teng bo‘laklar)',
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                              color: AppColors.kidsDarkText,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Lesson Explanation Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppColors.kidsBorder, width: 1.5),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Dars qoidasi',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                      color: AppColors.kidsDarkText,
                    ),
                  ),
                  SizedBox(height: 10),
                  Text(
                    'Bir butun narsani bir necha teng bo‘laklarga bo‘lsak, hosil bo‘lgan har bir qism kasr deb ataladi.\n\n'
                    'Agar pitsani 4 ta teng bo‘lakka bo‘lib, 1 bo‘lagini yesangiz, siz uning to‘rtdan bir (1/4) qismini yegan bo‘lasiz.',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: AppColors.kidsDarkText,
                      height: 1.5,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Ziyo AI Ustoz Tip (Figma 2:18)
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: const Color(0xFFF1F8F5),
                borderRadius: BorderRadius.circular(22),
                border: Border.all(color: const Color(0xFFC7EBDD), width: 1.5),
              ),
              child: const Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(Icons.lightbulb_rounded, color: AppColors.kidsGreen, size: 28),
                  SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Ziyo ustozdan maslahat',
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w800,
                            color: AppColors.kidsGreen,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Eslab qoling: Maxraj doimo pastda turadi va butun nechta bo‘lakka bo‘linganini ko‘rsatadi!',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                            color: Color(0xFF13533E),
                            height: 1.4,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Start Exercises CTA
            CustomButton(
              text: 'Mashqlarga o‘tish',
              backgroundColor: AppColors.kidsPrimary,
              borderRadius: 20,
              icon: const Icon(Icons.arrow_forward_rounded, color: Colors.white),
              onPressed: () {
                context.push('/kids/exercise/q-k4-01');
              },
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}

class FractionPiePainter extends CustomPainter {
  final int highlightedSlices;
  final int totalSlices;

  FractionPiePainter({required this.highlightedSlices, required this.totalSlices});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;
    const double startAngle = -3.14159265 / 2;
    final sweepAngle = (2 * 3.14159265) / totalSlices;

    final paintEmpty = Paint()
      ..color = const Color(0xFFE8EBFA)
      ..style = PaintingStyle.fill;

    final paintHighlighted = Paint()
      ..color = AppColors.kidsPrimary
      ..style = PaintingStyle.fill;

    final paintBorder = Paint()
      ..color = Colors.white
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke;

    for (int i = 0; i < totalSlices; i++) {
      final isHighlighted = i < highlightedSlices;
      final angle = startAngle + i * sweepAngle;

      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        angle,
        sweepAngle,
        true,
        isHighlighted ? paintHighlighted : paintEmpty,
      );

      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        angle,
        sweepAngle,
        true,
        paintBorder,
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
