import 'package:flutter/material.dart';

/// Official multi-color Google "G" logo rendered via CustomPainter.
/// Colors: Blue (#4285F4), Red (#EA4335), Yellow (#FBBC05), Green (#34A853).
class GoogleLogo extends StatelessWidget {
  final double size;

  const GoogleLogo({super.key, this.size = 22});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: CustomPaint(
        size: Size(size, size),
        painter: _GoogleLogoPainter(),
      ),
    );
  }
}

class _GoogleLogoPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final double w = size.width;
    final double h = size.height;
    final Offset center = Offset(w / 2, h / 2);
    final double radius = w / 2;
    final double strokeWidth = w * 0.21;
    final double innerRadius = radius - strokeWidth / 2;

    final Paint bluePaint = Paint()
      ..color = const Color(0xFF4285F4)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;

    final Paint greenPaint = Paint()
      ..color = const Color(0xFF34A853)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;

    final Paint yellowPaint = Paint()
      ..color = const Color(0xFFFBBC05)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;

    final Paint redPaint = Paint()
      ..color = const Color(0xFFEA4335)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;

    final Rect arcRect = Rect.fromCircle(center: center, radius: innerRadius);

    // Blue arc (bottom-right upward)
    canvas.drawArc(arcRect, -0.6, 0.9, false, bluePaint);

    // Green arc (bottom)
    canvas.drawArc(arcRect, 0.3, 1.4, false, greenPaint);

    // Yellow arc (bottom-left to left)
    canvas.drawArc(arcRect, 1.7, 1.4, false, yellowPaint);

    // Red arc (top-left to top)
    canvas.drawArc(arcRect, 3.1, 1.6, false, redPaint);

    // Blue horizontal bar
    final Paint barPaint = Paint()
      ..color = const Color(0xFF4285F4)
      ..style = PaintingStyle.fill;

    final Rect barRect = Rect.fromLTWH(
      center.dx,
      center.dy - strokeWidth / 2,
      innerRadius + strokeWidth / 2,
      strokeWidth,
    );
    canvas.drawRRect(
      RRect.fromRectAndRadius(barRect, Radius.circular(strokeWidth / 6)),
      barPaint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
