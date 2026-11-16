import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_strings.dart';
import '../../core/widgets/custom_button.dart';
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
    final success = await ref.read(studentProvider.notifier).signInWithGoogle();
    setState(() => _isGoogleLoading = false);

    if (!mounted) return;

    if (success) {
      final student = ref.read(studentProvider).student;
      final age = student?.age ?? 10;

      if (age >= 17) {
        context.go('/access-denied');
      } else if (age >= 13) {
        context.go('/teen/home');
      } else {
        context.go('/kids/home');
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Google orqali kirishda xatolik yuz berdi.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
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

              // Real Google Sign-In Button (Requirement #10)
              SizedBox(
                width: double.infinity,
                height: 56,
                child: OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    backgroundColor: Colors.white,
                    side: const BorderSide(color: AppColors.kidsBorder, width: 1.5),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    elevation: 0,
                  ),
                  onPressed: _isGoogleLoading ? null : _handleGoogleSignIn,
                  child: _isGoogleLoading
                      ? const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(strokeWidth: 2.5),
                        )
                      : Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            // Multi-colored G icon
                            Container(
                              width: 24,
                              height: 24,
                              decoration: const BoxDecoration(shape: BoxShape.circle),
                              child: const Center(
                                child: Text(
                                  'G',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w900,
                                    color: Color(0xFF4285F4),
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 10),
                            const Text(
                              'Google bilan davom etish',
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w800,
                                color: AppColors.kidsDarkText,
                              ),
                            ),
                          ],
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
