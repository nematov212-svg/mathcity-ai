import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Touch-friendly on-screen number pad or comparison pad with multi-touch support
class NumberPad extends StatelessWidget {
  final bool isComparison;
  final ValueChanged<String> onInputChar;
  final VoidCallback onClear;
  final VoidCallback onSubmit;
  final Color primaryColor;
  final bool isDark;

  const NumberPad({
    super.key,
    required this.isComparison,
    required this.onInputChar,
    required this.onClear,
    required this.onSubmit,
    required this.primaryColor,
    required this.isDark,
  });

  @override
  Widget build(BuildContext context) {
    if (isComparison) {
      return _buildComparisonPad();
    }
    return _buildNumericPad();
  }

  Widget _buildComparisonPad() {
    return Row(
      children: [
        Expanded(
          child: _PadKey(
            label: '<',
            height: 64,
            fontSize: 26,
            bgColor: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
            textColor: primaryColor,
            onTap: () {
              onInputChar('<');
              onSubmit();
            },
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: _PadKey(
            label: '=',
            height: 64,
            fontSize: 26,
            bgColor: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
            textColor: primaryColor,
            onTap: () {
              onInputChar('=');
              onSubmit();
            },
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: _PadKey(
            label: '>',
            height: 64,
            fontSize: 26,
            bgColor: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
            textColor: primaryColor,
            onTap: () {
              onInputChar('>');
              onSubmit();
            },
          ),
        ),
      ],
    );
  }

  Widget _buildNumericPad() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Row 1: 1, 2, 3
        Row(
          children: [
            _buildNumberKey('1'),
            const SizedBox(width: 6),
            _buildNumberKey('2'),
            const SizedBox(width: 6),
            _buildNumberKey('3'),
          ],
        ),
        const SizedBox(height: 6),

        // Row 2: 4, 5, 6
        Row(
          children: [
            _buildNumberKey('4'),
            const SizedBox(width: 6),
            _buildNumberKey('5'),
            const SizedBox(width: 6),
            _buildNumberKey('6'),
          ],
        ),
        const SizedBox(height: 6),

        // Row 3: 7, 8, 9
        Row(
          children: [
            _buildNumberKey('7'),
            const SizedBox(width: 6),
            _buildNumberKey('8'),
            const SizedBox(width: 6),
            _buildNumberKey('9'),
          ],
        ),
        const SizedBox(height: 6),

        // Row 4: ✕ (Clear), 0, ✓ (Submit)
        Row(
          children: [
            // Clear Key (✕)
            Expanded(
              child: _PadKey(
                icon: Icons.backspace_outlined,
                height: 48,
                bgColor: isDark
                    ? const Color(0xFF450A0A)
                    : const Color(0xFFFEE2E2),
                iconColor: const Color(0xFFDC2626),
                onTap: onClear,
              ),
            ),
            const SizedBox(width: 6),

            // 0 Key
            _buildNumberKey('0'),
            const SizedBox(width: 6),

            // Submit Key (✓)
            Expanded(
              child: _PadKey(
                icon: Icons.check_rounded,
                height: 48,
                bgColor: primaryColor,
                iconColor: Colors.white,
                onTap: onSubmit,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildNumberKey(String number) {
    return Expanded(
      child: _PadKey(
        label: number,
        height: 48,
        fontSize: 20,
        bgColor: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
        textColor: isDark ? Colors.white : const Color(0xFF0F172A),
        onTap: () => onInputChar(number),
      ),
    );
  }
}

class _PadKey extends StatefulWidget {
  final String? label;
  final IconData? icon;
  final double height;
  final double fontSize;
  final Color bgColor;
  final Color? textColor;
  final Color? iconColor;
  final VoidCallback onTap;

  const _PadKey({
    this.label,
    this.icon,
    required this.height,
    this.fontSize = 18,
    required this.bgColor,
    this.textColor,
    this.iconColor,
    required this.onTap,
  });

  @override
  State<_PadKey> createState() => _PadKeyState();
}

class _PadKeyState extends State<_PadKey> with SingleTickerProviderStateMixin {
  late final AnimationController _anim;
  late final Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _anim = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 90),
      lowerBound: 0.0,
      upperBound: 1.0,
    );
    _scale = Tween<double>(begin: 1.0, end: 0.94).animate(
      CurvedAnimation(parent: _anim, curve: Curves.easeOutCubic),
    );
  }

  @override
  void dispose() {
    _anim.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _scale,
      builder: (context, child) => Transform.scale(
        scale: _scale.value,
        child: child,
      ),
      child: Listener(
        onPointerDown: (_) {
          _anim.forward();
          HapticFeedback.lightImpact();
          widget.onTap();
        },
        onPointerUp: (_) => _anim.reverse(),
        onPointerCancel: (_) => _anim.reverse(),
        child: Container(
          height: widget.height,
          decoration: BoxDecoration(
            color: widget.bgColor,
            borderRadius: BorderRadius.circular(12),
            boxShadow: const [
              BoxShadow(
                color: Color(0x0C000000),
                blurRadius: 4,
                offset: Offset(0, 2),
              ),
            ],
          ),
          child: Center(
            child: widget.icon != null
                ? Icon(widget.icon, size: 22, color: widget.iconColor)
                : Text(
                    widget.label ?? '',
                    style: TextStyle(
                      fontSize: widget.fontSize,
                      fontWeight: FontWeight.w800,
                      color: widget.textColor,
                    ),
                  ),
          ),
        ),
      ),
    );
  }
}
