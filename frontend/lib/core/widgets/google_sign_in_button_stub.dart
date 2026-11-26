import 'package:flutter/material.dart';
import '../theme/auth_design_tokens.dart';
import 'google_logo.dart';

class GoogleSignInButton extends StatelessWidget {
  final VoidCallback? onFallbackPressed;
  final bool isLoading;
  final String text;

  const GoogleSignInButton({
    super.key,
    this.onFallbackPressed,
    this.isLoading = false,
    this.text = 'Continue with Google',
  });

  @override
  Widget build(BuildContext context) {
    final isDark = AuthTokens.isDark(context);

    return SizedBox(
      width: double.infinity,
      height: 56,
      child: OutlinedButton(
        style: OutlinedButton.styleFrom(
          backgroundColor: AuthTokens.card(context),
          side: BorderSide(
            color: isDark ? AuthTokens.lineDark : AuthTokens.lineLight,
            width: 2.0,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 16),
        ),
        onPressed: isLoading ? null : onFallbackPressed,
        child: isLoading
            ? SizedBox(
                width: 22,
                height: 22,
                child: CircularProgressIndicator(
                  strokeWidth: 2.5,
                  valueColor:
                      AlwaysStoppedAnimation<Color>(AuthTokens.brand(context)),
                ),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Image.asset(
                    'assets/icons/google_g_logo.png',
                    width: 22,
                    height: 22,
                    errorBuilder: (_, __, ___) => const GoogleLogo(size: 22),
                  ),
                  const SizedBox(width: 12),
                  Flexible(
                    child: Text(
                      text,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontFamily: 'Nunito',
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: AuthTokens.ink(context),
                      ),
                    ),
                  ),
                ],
              ),
      ),
    );
  }
}
