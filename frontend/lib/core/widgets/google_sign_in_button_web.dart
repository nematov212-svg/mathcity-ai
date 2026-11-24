import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:google_sign_in_platform_interface/google_sign_in_platform_interface.dart';
import 'package:google_sign_in_web/google_sign_in_web.dart' as web_plugin;
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
    this.text = 'Google orqali kirish',
  });

  @override
  Widget build(BuildContext context) {
    final isDark = AuthTokens.isDark(context);

    // Styled visual button matching MathCity AI design tokens
    final visualButton = Container(
      width: double.infinity,
      height: 56,
      decoration: BoxDecoration(
        color: AuthTokens.card(context),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isDark ? AuthTokens.lineDark : AuthTokens.lineLight,
          width: 2.0,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(isDark ? 0.25 : 0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: isLoading
          ? Center(
              child: SizedBox(
                width: 22,
                height: 22,
                child: CircularProgressIndicator(
                  strokeWidth: 2.5,
                  valueColor: AlwaysStoppedAnimation<Color>(AuthTokens.brand(context)),
                ),
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
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: AuthTokens.ink(context),
                    ),
                  ),
                ),
              ],
            ),
    );

    // On web, overlay the official GIS button with minimal opacity so clicking anywhere
    // on our custom styled button activates Google's native GIS flow without deprecated popup warnings
    if (kIsWeb) {
      final plugin = GoogleSignInPlatform.instance;
      if (plugin is web_plugin.GoogleSignInPlugin) {
        return SizedBox(
          width: double.infinity,
          height: 56,
          child: Stack(
            alignment: Alignment.center,
            children: [
              visualButton,
              Positioned.fill(
                child: Opacity(
                  opacity: 0.001,
                  child: plugin.renderButton(
                    configuration: web_plugin.GSIButtonConfiguration(
                      type: web_plugin.GSIButtonType.standard,
                      size: web_plugin.GSIButtonSize.large,
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      }
    }

    return Material(
      color: Colors.transparent,
      borderRadius: BorderRadius.circular(20),
      child: InkWell(
        onTap: isLoading ? null : onFallbackPressed,
        borderRadius: BorderRadius.circular(20),
        child: visualButton,
      ),
    );
  }
}
