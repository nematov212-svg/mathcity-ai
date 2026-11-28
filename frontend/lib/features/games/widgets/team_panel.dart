import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../logic/question_generator.dart';
import '../models/team.dart';
import 'number_pad.dart';

/// Single team's interactive half of the screen
class TeamPanel extends StatefulWidget {
  final Team team;
  final MathQuestion question;
  final String currentInput;
  final ValueChanged<String> onInputChar;
  final VoidCallback onClear;
  final VoidCallback onSubmit;
  final bool isDark;

  const TeamPanel({
    super.key,
    required this.team,
    required this.question,
    required this.currentInput,
    required this.onInputChar,
    required this.onClear,
    required this.onSubmit,
    required this.isDark,
  });

  @override
  State<TeamPanel> createState() => TeamPanelState();
}

class TeamPanelState extends State<TeamPanel>
    with SingleTickerProviderStateMixin {
  late final AnimationController _shakeController;
  late final Animation<double> _shakeAnimation;
  Color? _flashColor;

  @override
  void initState() {
    super.initState();
    _shakeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 320),
    );
    _shakeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _shakeController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _shakeController.dispose();
    super.dispose();
  }

  /// Triggers red flash and shake on wrong answer
  void triggerWrong() {
    setState(() => _flashColor = const Color(0xFFEF4444));
    _shakeController.forward(from: 0.0).then((_) {
      if (mounted) setState(() => _flashColor = null);
    });
  }

  /// Triggers green flash on correct answer
  void triggerCorrect() {
    setState(() => _flashColor = const Color(0xFF10B981));
    Future.delayed(const Duration(milliseconds: 300), () {
      if (mounted) setState(() => _flashColor = null);
    });
  }

  @override
  Widget build(BuildContext context) {
    final team = widget.team;
    final primary = team.getPrimaryColor(widget.isDark);
    final bg = team.getBgColor(widget.isDark);

    return AnimatedBuilder(
      animation: _shakeAnimation,
      builder: (context, child) {
        final offset =
            math.sin(_shakeAnimation.value * math.pi * 4) * 8 * (1.0 - _shakeAnimation.value);
        return Transform.translate(
          offset: Offset(offset, 0),
          child: child,
        );
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        decoration: BoxDecoration(
          color: _flashColor?.withValues(alpha: 0.15) ??
              (widget.isDark ? const Color(0xFF151A2B) : Colors.white),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: _flashColor ?? primary.withValues(alpha: 0.4),
            width: _flashColor != null ? 2.5 : 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: primary.withValues(alpha: 0.08),
              blurRadius: 10,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        padding: const EdgeInsets.all(10),
        child: Column(
          children: [
            // 1. Question Card
            Container(
              height: 48,
              width: double.infinity,
              decoration: BoxDecoration(
                color: bg,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: primary.withValues(alpha: 0.25),
                  width: 1,
                ),
              ),
              child: Center(
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 8),
                    child: Text(
                      widget.question.questionText,
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.w900,
                        color: primary,
                        letterSpacing: -0.5,
                      ),
                    ),
                  ),
                ),
              ),
            ),

            const SizedBox(height: 8),

            // 2. Answer Field (Dashed style border)
            Container(
              height: 42,
              width: double.infinity,
              decoration: BoxDecoration(
                color: widget.isDark
                    ? const Color(0xFF0F172A)
                    : const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: widget.currentInput.isNotEmpty
                      ? primary
                      : (widget.isDark
                          ? const Color(0xFF334155)
                          : const Color(0xFFCBD5E1)),
                  width: widget.currentInput.isNotEmpty ? 2 : 1.2,
                ),
              ),
              child: Center(
                child: Text(
                  widget.currentInput.isEmpty
                      ? 'Javob kiriting'
                      : widget.currentInput,
                  style: TextStyle(
                    fontSize: widget.currentInput.isEmpty ? 13 : 20,
                    fontWeight: widget.currentInput.isEmpty
                        ? FontWeight.w500
                        : FontWeight.w900,
                    color: widget.currentInput.isEmpty
                        ? (widget.isDark
                            ? const Color(0xFF64748B)
                            : const Color(0xFF94A3B8))
                        : (widget.isDark ? Colors.white : const Color(0xFF0F172A)),
                  ),
                ),
              ),
            ),

            const SizedBox(height: 8),

            // 3. Number Pad or Comparison Pad
            Expanded(
              child: FittedBox(
                fit: BoxFit.contain,
                alignment: Alignment.topCenter,
                child: SizedBox(
                  width: 160,
                  child: NumberPad(
                    isComparison: widget.question.isComparison,
                    onInputChar: widget.onInputChar,
                    onClear: widget.onClear,
                    onSubmit: widget.onSubmit,
                    primaryColor: primary,
                    isDark: widget.isDark,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
