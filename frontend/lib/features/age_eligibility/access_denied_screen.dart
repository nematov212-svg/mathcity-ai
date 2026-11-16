import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_strings.dart';
import '../../core/widgets/custom_button.dart';

class AccessDeniedScreen extends StatelessWidget {
  const AccessDeniedScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.kidsBackground,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Spacer(flex: 2),
              // Warning shield illustration container
              Container(
                width: 120,
                height: 120,
                decoration: BoxDecoration(
                  color: const Color(0xFFFFECEC),
                  shape: BoxShape.circle,
                  border: Border.all(color: const Color(0xFFFFD1D1), width: 3),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.red.withOpacity(0.12),
                      blurRadius: 20,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: const Center(
                  child: Icon(
                    Icons.shield_outlined,
                    size: 60,
                    color: AppColors.kidsError,
                  ),
                ),
              ),
              const SizedBox(height: 32),
              const Text(
                AppStrings.ageDeniedTitle,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.w900,
                  color: AppColors.kidsDarkText,
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                AppStrings.ageDeniedMessage,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppColors.kidsSecondaryText,
                  height: 1.5,
                ),
              ),
              const Spacer(flex: 3),
              CustomButton(
                text: AppStrings.backToHome,
                backgroundColor: AppColors.kidsPrimary,
                borderRadius: 20,
                onPressed: () {
                  context.go('/welcome');
                },
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
