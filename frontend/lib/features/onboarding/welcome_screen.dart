import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_strings.dart';
import '../../core/widgets/custom_button.dart';
import '../../core/widgets/google_sign_in_button.dart';
import '../../core/widgets/mathcity_logo.dart';
import '../../shared/providers/student_provider.dart';

class WelcomeScreen extends ConsumerStatefulWidget {
  const WelcomeScreen({super.key});

  @override
  ConsumerState<WelcomeScreen> createState() => _WelcomeScreenState();
}

class _WelcomeScreenState extends ConsumerState<WelcomeScreen> {
  bool _isGoogleLoading = false;

  void _handleGoogleSignIn() async {
    setState(() => _isGoogleLoading = true);
    final result = await ref.read(studentProvider.notifier).signInWithGoogle();
    setState(() => _isGoogleLoading = false);

    if (!mounted) return;

    if (result.success) {
      if (result.isNewUser) {
        context.push('/onboarding/intro');
      } else {
        context.go('/kids/home');
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            result.errorMessage ?? 'Google orqali kirishda xatolik yuz berdi.',
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    // Automatically navigate when GIS button or silent login authenticates a student
    ref.listen<StudentState>(studentProvider, (prev, next) {
      if (next.student != null && prev?.student?.id != next.student?.id) {
        context.go('/kids/home');
      }
    });

    return Scaffold(
      backgroundColor: AppColors.kidsBackground,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            children: [
              const SizedBox(height: 16),

              // Official MathCity AI Logo & Mascot Hub (IMAGE 2)
              const Center(
                child: MathCityLogo(
                  size: 170,
                  showText: true,
                ),
              ),

              const SizedBox(height: 24),

              // Typography
              const Text(
                AppStrings.welcomeTitle,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.w900,
                  color: AppColors.kidsDarkText,
                  height: 1.25,
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                AppStrings.welcomeSubtitle,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                  color: AppColors.kidsSecondaryText,
                  height: 1.45,
                ),
              ),
              const SizedBox(height: 32),

              // Primary Start Button
              CustomButton(
                text: AppStrings.startButton,
                backgroundColor: AppColors.kidsPrimary,
                borderRadius: 20,
                onPressed: () {
                  context.push('/onboarding/intro');
                },
              ),
              const SizedBox(height: 14),

              // Official Google Sign-In Button (GIS Web supported + cross-platform fallback)
              GoogleSignInButton(
                isLoading: _isGoogleLoading,
                onFallbackPressed: _handleGoogleSignIn,
              ),
              const SizedBox(height: 20),

              // Privacy Policy Footer Link
              GestureDetector(
                onTap: () => context.push('/privacy-policy'),
                child: const Text(
                  'Maxfiylik siyosati',
                  style: TextStyle(
                    fontFamily: 'Nunito',
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppColors.kidsSecondaryText,
                    decoration: TextDecoration.underline,
                  ),
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
