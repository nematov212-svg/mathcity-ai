import 'dart:math' as math;
import 'package:flutter/material.dart';

/// 1. PlaceValueBlocks: Xona birliklari modeli
/// O'nlik = uzun tayoqcha (10 ta kubik), Birlik = kichik kvadrat
class PlaceValueBlocks extends StatelessWidget {
  final int tens;
  final int ones;
  final String? customLabel;
  final Color tensColor;
  final Color onesColor;

  const PlaceValueBlocks({
    super.key,
    required this.tens,
    required this.ones,
    this.customLabel,
    this.tensColor = const Color(0xFF6C3CE0),
    this.onesColor = const Color(0xFFFFC83D),
  });

  @override
  Widget build(BuildContext context) {
    final value = tens * 10 + ones;
    final labelText = customLabel ?? "$tens o‘nl. $ones birl. = $value";

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFF6C3CE0).withOpacity(0.15), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF6C3CE0).withOpacity(0.06),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(
            height: 90,
            child: CustomPaint(
              painter: _PlaceValuePainter(
                tens: tens,
                ones: ones,
                tensColor: tensColor,
                onesColor: onesColor,
              ),
              size: const Size(double.infinity, 90),
            ),
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0xFFF6F5FC),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              labelText,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: Color(0xFF1B1B2F),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _PlaceValuePainter extends CustomPainter {
  final int tens;
  final int ones;
  final Color tensColor;
  final Color onesColor;

  _PlaceValuePainter({
    required this.tens,
    required this.ones,
    required this.tensColor,
    required this.onesColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final tensPaint = Paint()
      ..color = tensColor
      ..style = PaintingStyle.fill;
    final tensStroke = Paint()
      ..color = Colors.white.withOpacity(0.4)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0;

    final onesPaint = Paint()
      ..color = onesColor
      ..style = PaintingStyle.fill;
    final onesStroke = Paint()
      ..color = Colors.black.withOpacity(0.15)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0;

    // Draw tens (vertical rods) on the left side
    const rodWidth = 12.0;
    const rodHeight = 70.0;
    const rodSpacing = 6.0;

    double startX = 20.0;
    final totalTensWidth = tens * (rodWidth + rodSpacing);

    for (int t = 0; t < tens; t++) {
      final x = startX + t * (rodWidth + rodSpacing);
      final y = (size.height - rodHeight) / 2;
      final rect = RRect.fromRectAndRadius(
        Rect.fromLTWH(x, y, rodWidth, rodHeight),
        const Radius.circular(3),
      );
      canvas.drawRRect(rect, tensPaint);

      // Draw segment lines on rod
      for (int seg = 1; seg < 10; seg++) {
        final lineY = y + (rodHeight / 10) * seg;
        canvas.drawLine(Offset(x, lineY), Offset(x + rodWidth, lineY), tensStroke);
      }
    }

    // Divider
    final divX = startX + totalTensWidth + 14;
    final divPaint = Paint()
      ..color = Colors.grey.withOpacity(0.3)
      ..strokeWidth = 1.5;
    canvas.drawLine(Offset(divX, 10), Offset(divX, size.height - 10), divPaint);

    // Draw ones (small squares) on the right side
    const squareSize = 13.0;
    const squareSpacing = 5.0;
    final onesStartX = divX + 16.0;

    // Grid of ones: max 5 per column
    for (int o = 0; o < ones; o++) {
      final col = o ~/ 5;
      final row = o % 5;
      final ox = onesStartX + col * (squareSize + squareSpacing);
      final oy = (size.height - (5 * (squareSize + squareSpacing))) / 2 + row * (squareSize + squareSpacing);

      final rrect = RRect.fromRectAndRadius(
        Rect.fromLTWH(ox, oy, squareSize, squareSize),
        const Radius.circular(3),
      );
      canvas.drawRRect(rrect, onesPaint);
      canvas.drawRRect(rrect, onesStroke);
    }
  }

  @override
  bool shouldRepaint(covariant _PlaceValuePainter oldDelegate) {
    return oldDelegate.tens != tens || oldDelegate.ones != ones;
  }
}

/// 2. NumberLine: Sonlar nuri (sakrashlar bilan)
class NumberLineJump {
  final int from;
  final int to;
  final String label;
  final Color color;

  const NumberLineJump({
    required this.from,
    required this.to,
    required this.label,
    this.color = const Color(0xFF2EB67D),
  });
}

class NumberLine extends StatelessWidget {
  final int start;
  final int end;
  final int step;
  final List<NumberLineJump> jumps;
  final int? highlightValue;

  const NumberLine({
    super.key,
    this.start = 0,
    this.end = 100,
    this.step = 10,
    this.jumps = const [],
    this.highlightValue,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFF6C3CE0).withOpacity(0.15), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF6C3CE0).withOpacity(0.06),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: SizedBox(
        height: jumps.isNotEmpty ? 110 : 70,
        child: CustomPaint(
          painter: _NumberLinePainter(
            start: start,
            end: end,
            step: step,
            jumps: jumps,
            highlightValue: highlightValue,
          ),
          size: Size(double.infinity, jumps.isNotEmpty ? 110 : 70),
        ),
      ),
    );
  }
}

class _NumberLinePainter extends CustomPainter {
  final int start;
  final int end;
  final int step;
  final List<NumberLineJump> jumps;
  final int? highlightValue;

  _NumberLinePainter({
    required this.start,
    required this.end,
    required this.step,
    required this.jumps,
    this.highlightValue,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final lineY = size.height - 24.0;
    const paddingX = 24.0;
    final lineStartX = paddingX;
    final lineEndX = size.width - paddingX;
    final totalRange = (end - start).toDouble();

    final linePaint = Paint()
      ..color = const Color(0xFF6C3CE0)
      ..strokeWidth = 2.5
      ..style = PaintingStyle.stroke;

    // Draw main line
    canvas.drawLine(Offset(lineStartX, lineY), Offset(lineEndX, lineY), linePaint);

    // Arrowhead at lineEndX
    final arrowPaint = Paint()
      ..color = const Color(0xFF6C3CE0)
      ..style = PaintingStyle.fill;
    final arrowPath = Path()
      ..moveTo(lineEndX + 6, lineY)
      ..lineTo(lineEndX - 4, lineY - 5)
      ..lineTo(lineEndX - 4, lineY + 5)
      ..close();
    canvas.drawPath(arrowPath, arrowPaint);

    // Helper to get X position for a value
    double getX(num val) {
      final ratio = (val - start) / totalRange;
      return lineStartX + ratio * (lineEndX - lineStartX);
    }

    // Ticks & Labels
    final tickPaint = Paint()
      ..color = const Color(0xFF6C3CE0)
      ..strokeWidth = 2.0;

    final subTickPaint = Paint()
      ..color = const Color(0xFF7C4DFF).withOpacity(0.3)
      ..strokeWidth = 1.0;

    for (int v = start; v <= end; v += step) {
      final x = getX(v);
      // Main tick
      canvas.drawLine(Offset(x, lineY - 6), Offset(x, lineY + 6), tickPaint);

      // Label
      final tp = TextPainter(
        text: TextSpan(
          text: '$v',
          style: TextStyle(
            fontSize: (v == highlightValue) ? 12 : 10,
            fontWeight: (v == highlightValue) ? FontWeight.w800 : FontWeight.w600,
            color: (v == highlightValue) ? const Color(0xFFE5484D) : const Color(0xFF6B6B80),
          ),
        ),
        textDirection: TextDirection.ltr,
      )..layout();
      tp.paint(canvas, Offset(x - tp.width / 2, lineY + 8));

      // Sub-ticks
      if (v + step <= end) {
        final midX = getX(v + step / 2);
        canvas.drawLine(Offset(midX, lineY - 3), Offset(midX, lineY + 3), subTickPaint);
      }
    }

    // Jumps (curved arcs above line)
    for (final jump in jumps) {
      final jStartX = getX(jump.from);
      final jEndX = getX(jump.to);
      final jumpMidX = (jStartX + jEndX) / 2;
      final arcHeight = (jEndX - jStartX).abs() * 0.45;
      final peakY = math.max(16.0, lineY - math.min(50.0, arcHeight));

      final arcPath = Path()
        ..moveTo(jStartX, lineY - 4)
        ..quadraticBezierTo(jumpMidX, peakY, jEndX, lineY - 4);

      final arcPaint = Paint()
        ..color = jump.color
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2.0;
      canvas.drawPath(arcPath, arcPaint);

      // Arrow on jump end
      final jArrowPaint = Paint()
        ..color = jump.color
        ..style = PaintingStyle.fill;
      final jArrowPath = Path()
        ..moveTo(jEndX, lineY - 4)
        ..lineTo(jEndX - (jEndX > jStartX ? 5 : -5), lineY - 9)
        ..lineTo(jEndX - (jEndX > jStartX ? 3 : -3), lineY - 4)
        ..close();
      canvas.drawPath(jArrowPath, jArrowPaint);

      // Jump text
      final jtp = TextPainter(
        text: TextSpan(
          text: jump.label,
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w800,
            color: jump.color,
          ),
        ),
        textDirection: TextDirection.ltr,
      )..layout();
      jtp.paint(canvas, Offset(jumpMidX - jtp.width / 2, peakY - 14));
    }
  }

  @override
  bool shouldRepaint(covariant _NumberLinePainter oldDelegate) {
    return oldDelegate.start != start ||
        oldDelegate.end != end ||
        oldDelegate.highlightValue != highlightValue;
  }
}

/// 3. ColumnArithmetic: Ustun ko'rinishida hisoblash
class ColumnArithmetic extends StatelessWidget {
  final int a;
  final int b;
  final String operation; // '+' or '-'
  final int? result;
  final int? carryOrBorrow; // carry "1" on top or borrow dot

  const ColumnArithmetic({
    super.key,
    required this.a,
    required this.b,
    this.operation = '+',
    this.result,
    this.carryOrBorrow,
  });

  @override
  Widget build(BuildContext context) {
    final expectedRes = operation == '+' ? a + b : a - b;
    final res = result ?? expectedRes;

    final aStr = a.toString().padLeft(2, '0');
    final bStr = b.toString().padLeft(2, '0');
    final resStr = res.toString().padLeft(2, '0');

    return Container(
      width: 150,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFF6C3CE0).withOpacity(0.2), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF6C3CE0).withOpacity(0.08),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          // Carry / Borrow indicator
          if (carryOrBorrow != null && carryOrBorrow! > 0)
            Padding(
              padding: const EdgeInsets.only(right: 20),
              child: Text(
                operation == '+' ? '¹' : '•',
                style: TextStyle(
                  fontSize: operation == '+' ? 13 : 16,
                  fontWeight: FontWeight.w900,
                  color: const Color(0xFFE5484D),
                ),
              ),
            )
          else
            const SizedBox(height: 12),

          // First operand
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              Text(
                '${aStr[0]} ${aStr[1]}',
                style: const TextStyle(
                  fontFamily: 'monospace',
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 2,
                  color: Color(0xFF1B1B2F),
                ),
              ),
            ],
          ),

          // Operation + Second operand
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                operation,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF6C3CE0),
                ),
              ),
              Text(
                '${bStr[0]} ${bStr[1]}',
                style: const TextStyle(
                  fontFamily: 'monospace',
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 2,
                  color: Color(0xFF1B1B2F),
                ),
              ),
            ],
          ),

          // Divider bar
          Container(
            height: 2.5,
            margin: const EdgeInsets.symmetric(vertical: 4),
            color: const Color(0xFF1B1B2F),
          ),

          // Result
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              Text(
                res >= 100 ? '$res' : '${resStr[0]} ${resStr[1]}',
                style: const TextStyle(
                  fontFamily: 'monospace',
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 2,
                  color: Color(0xFF2EB67D),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

/// 4. BarDiagram: "Bor edi / ishlatildi / qoldi" va "Ko'p / kam" chizmalari
class BarDiagramSegment {
  final String label;
  final double value;
  final Color color;

  const BarDiagramSegment({
    required this.label,
    required this.value,
    this.color = const Color(0xFF6C3CE0),
  });
}

class BarDiagram extends StatelessWidget {
  final String title;
  final List<BarDiagramSegment> segments;
  final String? totalLabel;

  const BarDiagram({
    super.key,
    required this.title,
    required this.segments,
    this.totalLabel,
  });

  @override
  Widget build(BuildContext context) {
    final totalVal = segments.fold(0.0, (acc, s) => acc + s.value);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFF6C3CE0).withOpacity(0.15), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF6C3CE0).withOpacity(0.06),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              color: Color(0xFF1B1B2F),
            ),
          ),
          const SizedBox(height: 12),
          // Stacked Segmented Bar
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: SizedBox(
              height: 28,
              child: Row(
                children: segments.map((seg) {
                  final flex = (seg.value / (totalVal > 0 ? totalVal : 1) * 1000).toInt();
                  return Expanded(
                    flex: math.max(1, flex),
                    child: Container(
                      color: seg.color,
                      alignment: Alignment.center,
                      child: Text(
                        seg.value.toInt().toString(),
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
          ),
          const SizedBox(height: 10),
          // Legend
          Wrap(
            spacing: 12,
            runSpacing: 6,
            children: segments.map((seg) {
              return Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 10,
                    height: 10,
                    decoration: BoxDecoration(
                      color: seg.color,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  const SizedBox(width: 5),
                  Text(
                    '${seg.label}: ${seg.value.toInt()}',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF6B6B80),
                    ),
                  ),
                ],
              );
            }).toList(),
          ),
          if (totalLabel != null) ...[
            const SizedBox(height: 6),
            Text(
              totalLabel!,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w800,
                color: Color(0xFF6C3CE0),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

/// 5. ShapeDraw: Kesma, siniq chiziq, to'rtburchak, burchaklar
enum ShapeType {
  segment,
  straightLine,
  curvedLine,
  brokenLine,
  rectangle,
  square,
  triangle,
  acuteAngle,
  obtuseAngle,
}

class ShapeDraw extends StatelessWidget {
  final ShapeType shapeType;
  final String? label;
  final Color color;

  const ShapeDraw({
    super.key,
    required this.shapeType,
    this.label,
    this.color = const Color(0xFF6C3CE0),
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: color.withOpacity(0.2), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.06),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(
            height: 70,
            width: double.infinity,
            child: CustomPaint(
              painter: _ShapePainter(shapeType: shapeType, color: color),
            ),
          ),
          if (label != null) ...[
            const SizedBox(height: 8),
            Text(
              label!,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: color,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _ShapePainter extends CustomPainter {
  final ShapeType shapeType;
  final Color color;

  _ShapePainter({required this.shapeType, required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 2.5
      ..style = PaintingStyle.stroke;

    final fillPaint = Paint()
      ..color = color.withOpacity(0.12)
      ..style = PaintingStyle.fill;

    final cx = size.width / 2;
    final cy = size.height / 2;

    switch (shapeType) {
      case ShapeType.segment:
        // Segment with dot endpoints
        final p1 = Offset(cx - 50, cy);
        final p2 = Offset(cx + 50, cy);
        canvas.drawLine(p1, p2, paint);
        final dotPaint = Paint()..color = color..style = PaintingStyle.fill;
        canvas.drawCircle(p1, 4, dotPaint);
        canvas.drawCircle(p2, 4, dotPaint);
        break;

      case ShapeType.straightLine:
        // Extended straight line with arrows
        canvas.drawLine(Offset(cx - 65, cy), Offset(cx + 65, cy), paint);
        break;

      case ShapeType.curvedLine:
        final path = Path()
          ..moveTo(cx - 60, cy + 15)
          ..quadraticBezierTo(cx - 20, cy - 30, cx + 10, cy)
          ..quadraticBezierTo(cx + 35, cy + 25, cx + 60, cy - 10);
        canvas.drawPath(path, paint);
        break;

      case ShapeType.brokenLine:
        final path = Path()
          ..moveTo(cx - 60, cy + 15)
          ..lineTo(cx - 20, cy - 20)
          ..lineTo(cx + 20, cy + 20)
          ..lineTo(cx + 60, cy - 15);
        canvas.drawPath(path, paint);
        break;

      case ShapeType.rectangle:
        final rect = Rect.fromCenter(center: Offset(cx, cy), width: 90, height: 45);
        canvas.drawRect(rect, fillPaint);
        canvas.drawRect(rect, paint);
        break;

      case ShapeType.square:
        final rect = Rect.fromCenter(center: Offset(cx, cy), width: 50, height: 50);
        canvas.drawRect(rect, fillPaint);
        canvas.drawRect(rect, paint);
        break;

      case ShapeType.triangle:
        final path = Path()
          ..moveTo(cx, cy - 25)
          ..lineTo(cx - 40, cy + 25)
          ..lineTo(cx + 40, cy + 25)
          ..close();
        canvas.drawPath(path, fillPaint);
        canvas.drawPath(path, paint);
        break;

      case ShapeType.acuteAngle:
        // O'tkir burchak (< 90)
        final v = Offset(cx - 25, cy + 20);
        final p1 = Offset(cx + 35, cy + 20);
        final p2 = Offset(cx + 20, cy - 25);
        canvas.drawLine(v, p1, paint);
        canvas.drawLine(v, p2, paint);
        // Angle arc
        final arcRect = Rect.fromCircle(center: v, radius: 22);
        canvas.drawArc(arcRect, -0.9, 0.9, false, Paint()..color = const Color(0xFFFFC83D)..strokeWidth = 2..style = PaintingStyle.stroke);
        break;

      case ShapeType.obtuseAngle:
        // O'tmas burchak (> 90)
        final v = Offset(cx, cy + 15);
        final p1 = Offset(cx + 45, cy + 15);
        final p2 = Offset(cx - 40, cy - 15);
        canvas.drawLine(v, p1, paint);
        canvas.drawLine(v, p2, paint);
        final arcRect = Rect.fromCircle(center: v, radius: 20);
        canvas.drawArc(arcRect, -2.6, 2.6, false, Paint()..color = const Color(0xFFFFC83D)..strokeWidth = 2..style = PaintingStyle.stroke);
        break;
    }
  }

  @override
  bool shouldRepaint(covariant _ShapePainter oldDelegate) {
    return oldDelegate.shapeType != shapeType || oldDelegate.color != color;
  }
}
