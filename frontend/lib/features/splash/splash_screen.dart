import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/auth/auth_service.dart';
import '../../core/constants/app_colors.dart';
import '../../core/storage/storage_service.dart';
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
    AuthService.warmUpBackend();
    _checkAuthAndNavigate();
  }

  Future<void> _checkAuthAndNavigate() async {
    try {
      final tokenCheck = StorageService.hasAuthToken();
      final cachedCheck = StorageService.getCachedStudent();
      final minDelay = Future.delayed(const Duration(milliseconds: 1200));

      // Trigger background session warm-up / restore without blocking splash screen
      unawaited(AuthService().restoreSession(allowDemoFallback: false));

      final results = await Future.wait([tokenCheck, cachedCheck, minDelay]);
      if (!mounted) return;

      final bool hasToken = results[0] as bool;
      final Map<String, dynamic>? cachedStudent = results[1] as Map<String, dynamic>?;

      if (hasToken) {
        // Authenticated user: go straight to dashboard (or complete-profile if profile incomplete)
        if (cachedStudent != null && cachedStudent['profileCompleted'] == false) {
          context.go('/complete-profile');
          return;
        }
        context.go('/kids/home');
      } else {
        // First-time or signed-out user
        context.go('/login');
      }
    } catch (_) {
      if (!mounted) return;
      try {
        final hasToken = await StorageService.hasAuthToken();
        if (hasToken) {
          context.go('/kids/home');
          return;
        }
      } catch (_) {}
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
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            physics: const ClampingScrollPhysics(),
            child: FadeTransition(
              opacity: _fadeAnimation,
              child: ScaleTransition(
                scale: _scaleAnimation,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Official MathCity AI Full Logo (REFERENCE IMAGE 2)
                    const MathCityLogo(
                      size: 160,
                      showText: true,
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'MathCity AI',
                      style: TextStyle(
                        fontSize: 28,
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
                    const SizedBox(height: 24),
                    const SizedBox(
                      width: 28,
                      height: 28,
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
        ),
      ),
    );
  }
}
