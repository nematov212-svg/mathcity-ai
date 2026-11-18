import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/auth/auth_service.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/mathcity_logo.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    );
    
    _scaleAnimation = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOutBack,
    );

    _fadeAnimation = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeIn,
    );

    _controller.forward();
    _checkAuthAndNavigate();
  }

  Future<void> _checkAuthAndNavigate() async {
    final sessionFuture = AuthService().restoreSession(allowDemoFallback: false);
    final delayFuture = Future.delayed(const Duration(milliseconds: 1500));

    final results = await Future.wait([sessionFuture, delayFuture]);
    if (!mounted) return;

    final authResult = results[0] as AuthResult;
    if (authResult.success && authResult.student != null) {
      final age = authResult.student!.age;
      if (age >= 17) {
        context.go('/access-denied');
      } else if (age >= 13 || authResult.student!.mode == 'TEEN') {
        context.go('/teen/home');
      } else {
        context.go('/kids/home');
      }
    } else {
      context.go('/login');
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.kidsBackground,
      body: Center(
        child: FadeTransition(
          opacity: _fadeAnimation,
          child: ScaleTransition(
            scale: _scaleAnimation,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Official MathCity AI Full Logo (REFERENCE IMAGE 2)
                const MathCityLogo(
                  size: 190,
                  showText: true,
                ),
                const SizedBox(height: 16),
                const Text(
                  'MathCity AI',
                  style: TextStyle(
                    fontSize: 30,
                    fontWeight: FontWeight.w900,
                    color: AppColors.kidsDarkText,
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 6),
                const Text(
                  'Matematika va Kelajak Shahri',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.kidsSecondaryText,
                  ),
                ),
                const SizedBox(height: 28),
                const SizedBox(
                  width: 30,
                  height: 30,
                  child: CircularProgressIndicator(
                    strokeWidth: 3,
                    valueColor: AlwaysStoppedAnimation<Color>(AppColors.kidsPrimary),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
