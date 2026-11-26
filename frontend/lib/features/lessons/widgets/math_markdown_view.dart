import 'package:flutter/material.dart';
import 'package:flutter_math_fork/flutter_math.dart';
import '../../../core/theme/app_theme.dart';

class MathMarkdownView extends StatelessWidget {
  final String content;
  final TextStyle? baseStyle;
  final Color? accentColor;

  const MathMarkdownView({
    super.key,
    required this.content,
    this.baseStyle,
    this.accentColor,
  });

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);
    final themeAccent = accentColor ?? colors.primary;
    final defaultStyle = baseStyle ??
        TextStyle(
          fontSize: 14,
          height: 1.55,
          color: colors.ink,
          fontWeight: FontWeight.w500,
        );

    final lines = content.split('\n');
    final List<Widget> widgets = [];

    for (int i = 0; i < lines.length; i++) {
      final line = lines[i].trim();
      if (line.isEmpty) {
        widgets.add(const SizedBox(height: 8));
        continue;
      }

      // 1. Headers: ###, ##, #
      if (line.startsWith('### ')) {
        final title = line.replaceFirst('### ', '').trim();
        widgets
            .add(_buildHeader(title, 16, FontWeight.w800, themeAccent, colors));
      } else if (line.startsWith('## ')) {
        final title = line.replaceFirst('## ', '').trim();
        widgets
            .add(_buildHeader(title, 18, FontWeight.w900, themeAccent, colors));
      } else if (line.startsWith('# ')) {
        final title = line.replaceFirst('# ', '').trim();
        widgets
            .add(_buildHeader(title, 20, FontWeight.w900, themeAccent, colors));
      }
      // 2. Blockquote / Callout
      else if (line.startsWith('> ')) {
        final quoteText = line.replaceFirst('> ', '').trim();
        widgets.add(_buildQuote(quoteText, themeAccent, colors));
      }
      // 3. Bullet list item
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        final itemText = line.substring(2).trim();
        widgets.add(_buildBulletItem(itemText, defaultStyle, themeAccent));
      }
      // 4. Numbered list item
      else if (RegExp(r'^\d+\.\s').hasMatch(line)) {
        final match = RegExp(r'^(\d+)\.\s(.*)$').firstMatch(line);
        final numStr = match?.group(1) ?? '1';
        final itemText = match?.group(2) ?? '';
        widgets.add(
            _buildNumberedItem(numStr, itemText, defaultStyle, themeAccent));
      }
      // 5. Standalone LaTeX block (e.g. $$...$$ or \[...\])
      else if (line.startsWith(r'$$') &&
          line.endsWith(r'$$') &&
          line.length > 4) {
        final latex = line.substring(2, line.length - 2).trim();
        widgets.add(_buildLatexBlock(latex, colors));
      }
      // 6. Regular paragraph with possible bold/italic spans
      else {
        widgets.add(_buildParagraph(line, defaultStyle, themeAccent));
      }
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: widgets,
    );
  }

  Widget _buildHeader(String title, double fontSize, FontWeight weight,
      Color accent, AppThemeColors colors) {
    return Padding(
      padding: const EdgeInsets.only(top: 14, bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            width: 4,
            height: fontSize + 2,
            decoration: BoxDecoration(
              color: accent,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              title,
              style: TextStyle(
                fontSize: fontSize,
                fontWeight: weight,
                color: colors.ink,
                height: 1.25,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuote(String text, Color accent, AppThemeColors colors) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: accent.withOpacity(0.08),
        borderRadius: BorderRadius.circular(12),
        border: Border(left: BorderSide(color: accent, width: 3.5)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.lightbulb_outline_rounded, color: accent, size: 18),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              text,
              style: TextStyle(
                fontSize: 13,
                fontStyle: FontStyle.italic,
                fontWeight: FontWeight.w600,
                color: colors.ink,
                height: 1.4,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBulletItem(String text, TextStyle baseStyle, Color accent) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            margin: const EdgeInsets.only(top: 6, right: 8),
            width: 6,
            height: 6,
            decoration: BoxDecoration(
              color: accent,
              shape: BoxShape.circle,
            ),
          ),
          Expanded(
            child: _buildRichText(text, baseStyle, accent),
          ),
        ],
      ),
    );
  }

  Widget _buildNumberedItem(
      String numStr, String text, TextStyle baseStyle, Color accent) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            margin: const EdgeInsets.only(right: 8),
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
            decoration: BoxDecoration(
              color: accent.withOpacity(0.12),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Text(
              numStr,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w800,
                color: accent,
              ),
            ),
          ),
          Expanded(
            child: _buildRichText(text, baseStyle, accent),
          ),
        ],
      ),
    );
  }

  Widget _buildLatexBlock(String latex, AppThemeColors colors) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.symmetric(vertical: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: colors.border),
      ),
      alignment: Alignment.center,
      child: Math.tex(
        latex,
        mathStyle: MathStyle.display,
        textStyle: TextStyle(fontSize: 16, color: colors.ink),
      ),
    );
  }

  Widget _buildParagraph(String text, TextStyle baseStyle, Color accent) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: _buildRichText(text, baseStyle, accent),
    );
  }

  Widget _buildRichText(String text, TextStyle baseStyle, Color accent) {
    final spans = <InlineSpan>[];
    // Regex for bold **...**
    final regExp = RegExp(r'\*\*(.*?)\*\*');
    int lastIndex = 0;

    for (final match in regExp.allMatches(text)) {
      if (match.start > lastIndex) {
        spans.add(TextSpan(
          text: text.substring(lastIndex, match.start),
          style: baseStyle,
        ));
      }
      final boldContent = match.group(1) ?? '';
      spans.add(TextSpan(
        text: boldContent,
        style: baseStyle.copyWith(
          fontWeight: FontWeight.w800,
          color: baseStyle.color,
        ),
      ));
      lastIndex = match.end;
    }

    if (lastIndex < text.length) {
      spans.add(TextSpan(
        text: text.substring(lastIndex),
        style: baseStyle,
      ));
    }

    return Text.rich(
      TextSpan(children: spans),
      style: baseStyle,
    );
  }
}
