import 'dart:convert';
import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class UserAvatar extends StatelessWidget {
  final String? avatarUrl;
  final String displayName;
  final double size;
  final Color? borderColor;
  final double borderWidth;
  final bool showCameraBadge;
  final VoidCallback? onCameraTap;

  const UserAvatar({
    super.key,
    this.avatarUrl,
    required this.displayName,
    this.size = 48,
    this.borderColor,
    this.borderWidth = 2.0,
    this.showCameraBadge = false,
    this.onCameraTap,
  });

  String get _initial {
    final clean = displayName.trim();
    if (clean.isEmpty) return 'U';
    return clean[0].toUpperCase();
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final effectiveBorderColor = borderColor ?? colors.primary;

    Widget imageContent;

    final url = avatarUrl?.trim();
    if (url != null && url.isNotEmpty) {
      if (url.startsWith('data:image')) {
        try {
          final commaIndex = url.indexOf(',');
          final base64Data = commaIndex != -1 ? url.substring(commaIndex + 1) : url;
          final bytes = base64Decode(base64Data);
          imageContent = Image.memory(
            bytes,
            width: size,
            height: size,
            fit: BoxFit.cover,
            errorBuilder: (_, __, ___) => _buildFallbackInitial(colors, isDark),
          );
        } catch (_) {
          imageContent = _buildFallbackInitial(colors, isDark);
        }
      } else if (url.startsWith('http://') || url.startsWith('https://')) {
        imageContent = Image.network(
          url,
          width: size,
          height: size,
          fit: BoxFit.cover,
          loadingBuilder: (context, child, loadingProgress) {
            if (loadingProgress == null) return child;
            return Container(
              color: isDark ? const Color(0xFF281F5E) : const Color(0xFFEDE8FF),
              child: Center(
                child: SizedBox(
                  width: size * 0.4,
                  height: size * 0.4,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(colors.primary),
                  ),
                ),
              ),
            );
          },
          errorBuilder: (_, __, ___) => _buildFallbackInitial(colors, isDark),
        );
      } else if (url.startsWith('assets/')) {
        imageContent = Image.asset(
          url,
          width: size,
          height: size,
          fit: BoxFit.cover,
          errorBuilder: (_, __, ___) => _buildFallbackInitial(colors, isDark),
        );
      } else {
        imageContent = _buildFallbackInitial(colors, isDark);
      }
    } else {
      imageContent = _buildFallbackInitial(colors, isDark);
    }

    final avatarCircle = Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: colors.card,
        border: Border.all(color: effectiveBorderColor, width: borderWidth),
        boxShadow: [
          BoxShadow(
            color: effectiveBorderColor.withOpacity(0.18),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: ClipOval(
        child: imageContent,
      ),
    );

    if (!showCameraBadge) {
      return avatarCircle;
    }

    return Stack(
      clipBehavior: Clip.none,
      children: [
        avatarCircle,
        Positioned(
          right: -2,
          bottom: -2,
          child: Semantics(
            button: true,
            label: 'Rasmni o‘zgartirish',
            child: InkWell(
              onTap: onCameraTap,
              borderRadius: BorderRadius.circular(size * 0.35),
              child: Container(
                width: size * 0.36,
                height: size * 0.36,
                decoration: BoxDecoration(
                  color: colors.primary,
                  shape: BoxShape.circle,
                  border: Border.all(color: colors.card, width: 2.0),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x336C47FF),
                      blurRadius: 6,
                      offset: Offset(0, 2),
                    ),
                  ],
                ),
                child: Icon(
                  Icons.camera_alt_rounded,
                  color: Colors.white,
                  size: size * 0.18,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildFallbackInitial(AppThemeColors colors, bool isDark) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF281F5E) : const Color(0xFFEDE8FF),
        shape: BoxShape.circle,
      ),
      alignment: Alignment.center,
      child: Text(
        _initial,
        style: TextStyle(
          fontSize: size * 0.44,
          fontWeight: FontWeight.w900,
          color: isDark ? const Color(0xFFC7B3FF) : const Color(0xFF6C47FF),
        ),
      ),
    );
  }
}
