import 'package:flutter/material.dart';
import 'package:google_sign_in_web/web_only.dart' as gsi_web;
import '../auth/auth_service.dart';

class GoogleSignInButton extends StatelessWidget {
  final VoidCallback? onFallbackPressed;
  final bool isLoading;

  const GoogleSignInButton({
    super.key,
    this.onFallbackPressed,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return Container(
        width: double.infinity,
        height: 52,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: const Color(0xFFE5E7EB), width: 1.2),
        ),
        child: const Center(
          child: SizedBox(
            width: 22,
            height: 22,
            child: CircularProgressIndicator(strokeWidth: 2),
          ),
        ),
      );
    }

    // Guard: Check if the current origin is allowed for Google OAuth
    if (!AuthService.isOriginAllowedForGoogle()) {
      return SizedBox(
        width: double.infinity,
        height: 52,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          decoration: BoxDecoration(
            color: const Color(0xFFF3F4F6),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: const Color(0xFFE5E7EB), width: 1.2),
          ),
          child: const Center(
            child: Text(
              'Google kirishi faqat http://localhost:8085 da ishlaydi',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: Color(0xFF6B7280),
              ),
            ),
          ),
        ),
      );
    }

    // Render official Google Identity Services button with rectangular full-width geometry matching Apple button
    return SizedBox(
      width: double.infinity,
      height: 52,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(18),
        child: gsi_web.renderButton(
          configuration: gsi_web.GSIButtonConfiguration(
            type: gsi_web.GSIButtonType.standard,
            theme: gsi_web.GSIButtonTheme.outline,
            size: gsi_web.GSIButtonSize.large,
            text: gsi_web.GSIButtonText.continueWith,
            shape: gsi_web.GSIButtonShape.rectangular,
            logoAlignment: gsi_web.GSIButtonLogoAlignment.left,
            minimumWidth: 400,
          ),
        ),
      ),
    );
  }
}
