import 'package:flutter/material.dart';
import 'package:google_sign_in_web/web_only.dart' as gsi_web;
import '../constants/app_colors.dart';

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
        height: 48,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(999),
          border: Border.all(color: AppColors.kidsBorder, width: 1.5),
        ),
        child: const Center(
          child: SizedBox(
            width: 24,
            height: 24,
            child: CircularProgressIndicator(strokeWidth: 2.5),
          ),
        ),
      );
    }

    return Container(
      constraints: const BoxConstraints(minHeight: 44, maxHeight: 52),
      alignment: Alignment.center,
      child: gsi_web.renderButton(
        configuration: gsi_web.GSIButtonConfiguration(
          type: gsi_web.GSIButtonType.standard,
          theme: gsi_web.GSIButtonTheme.outline,
          size: gsi_web.GSIButtonSize.large,
          text: gsi_web.GSIButtonText.continueWith,
          shape: gsi_web.GSIButtonShape.pill,
          logoAlignment: gsi_web.GSIButtonLogoAlignment.left,
        ),
      ),
    );
  }
}
