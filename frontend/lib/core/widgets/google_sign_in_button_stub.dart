import 'package:flutter/material.dart';
import 'google_logo.dart';

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
    return SizedBox(
      width: double.infinity,
      height: 52,
      child: OutlinedButton(
        style: OutlinedButton.styleFrom(
          backgroundColor: Colors.white,
          side: const BorderSide(color: Color(0xFFE5E7EB), width: 1.2),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
          elevation: 0,
        ),
        onPressed: isLoading ? null : onFallbackPressed,
        child: isLoading
            ? const SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(strokeWidth: 2.5),
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
                  const SizedBox(width: 10),
                  const Flexible(
                    child: Text(
                      'Continue with Google',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF1F2937),
                      ),
                    ),
                  ),
                ],
              ),
      ),
    );
  }
}
