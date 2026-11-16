import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/custom_button.dart';
import '../../shared/providers/student_provider.dart';

class IntroScreen extends ConsumerStatefulWidget {
  const IntroScreen({super.key});

  @override
  ConsumerState<IntroScreen> createState() => _IntroScreenState();
}

class _IntroScreenState extends ConsumerState<IntroScreen> {
  final _nameController = TextEditingController(text: 'Ali');
  DateTime _selectedDate = DateTime(2015, 5, 20); // Default 11 years old
  String _selectedMode = 'KIDS';

  int _calculateAge(DateTime dob) {
    final now = DateTime.now();
    int age = now.year - dob.year;
    if (now.month < dob.month || (now.month == dob.month && now.day < dob.day)) {
      age--;
    }
    return age;
  }

  void _onDatePicked(DateTime date) {
    setState(() {
      _selectedDate = date;
      final age = _calculateAge(date);
      if (age >= 13 && age <= 16) {
        _selectedMode = 'TEEN';
      } else {
        _selectedMode = 'KIDS';
      }
    });
  }

  void _submit() async {
    final name = _nameController.text.trim();
    if (name.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Iltimos, ismingizni kiriting.')),
      );
      return;
    }

    final age = _calculateAge(_selectedDate);

    // Strict Age Eligibility Guard
    if (age >= 17) {
      context.go('/access-denied');
      return;
    }

    if (age < 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('MathCity AI 6 yoshdan oshgan o‘quvchilar uchun mo‘ljallangan.')),
      );
      return;
    }

    await ref.read(studentProvider.notifier).register(
      name: name,
      dob: _selectedDate,
      email: '${name.toLowerCase()}@mathcity.ai',
      password: 'securepassword123',
    );

    if (mounted) {
      if (age <= 12) {
        context.go('/kids/home');
      } else {
        context.go('/teen/home');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final currentAge = _calculateAge(_selectedDate);

    return Scaffold(
      backgroundColor: AppColors.kidsBackground,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.kidsDarkText),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'O‘zingizni tanishtiring',
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.w900,
                  color: AppColors.kidsDarkText,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Sizga mos matematika darajasini tanlashimiz uchun ma’lumotlaringizni kiriting.',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: AppColors.kidsSecondaryText,
                ),
              ),
              const SizedBox(height: 28),

              // Name Input
              const Text(
                'Ismingiz',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: AppColors.kidsDarkText,
                ),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _nameController,
                decoration: InputDecoration(
                  hintText: 'Ismingizni yozing',
                  filled: true,
                  fillColor: Colors.white,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(18),
                    borderSide: const BorderSide(color: AppColors.kidsBorder, width: 1.5),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(18),
                    borderSide: const BorderSide(color: AppColors.kidsBorder, width: 1.5),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(18),
                    borderSide: const BorderSide(color: AppColors.kidsPrimary, width: 2),
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // Date of Birth Picker
              const Text(
                'Tug‘ilgan sanangiz (Yoshingizni aniqlash uchun)',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: AppColors.kidsDarkText,
                ),
              ),
              const SizedBox(height: 8),
              InkWell(
                onTap: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: _selectedDate,
                    firstDate: DateTime(2005),
                    lastDate: DateTime.now(),
                  );
                  if (picked != null) {
                    _onDatePicked(picked);
                  }
                },
                borderRadius: BorderRadius.circular(18),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: AppColors.kidsBorder, width: 1.5),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '${_selectedDate.year}-${_selectedDate.month.toString().padLeft(2, '0')}-${_selectedDate.day.toString().padLeft(2, '0')} ($currentAge yosh)',
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                          color: AppColors.kidsDarkText,
                        ),
                      ),
                      const Icon(Icons.calendar_month_rounded, color: AppColors.kidsPrimary),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 28),

              // Mode Preview Cards (Figma 2:6)
              const Text(
                'Tavsiya etilgan o‘quv rejimi',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: AppColors.kidsDarkText,
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: _buildModeCard(
                      title: 'Bolalar rejimi',
                      ageRange: '6–12 yosh',
                      mode: 'KIDS',
                      icon: Icons.smart_toy_rounded,
                      color: AppColors.kidsPrimary,
                      isSelected: _selectedMode == 'KIDS',
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: _buildModeCard(
                      title: 'O‘smirlar rejimi',
                      ageRange: '13–16 yosh',
                      mode: 'TEEN',
                      icon: Icons.rocket_launch_rounded,
                      color: const Color(0xFF101526),
                      isSelected: _selectedMode == 'TEEN',
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 40),

              // Continue Button
              CustomButton(
                text: 'Davom etish',
                backgroundColor: AppColors.kidsPrimary,
                borderRadius: 20,
                onPressed: _submit,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildModeCard({
    required String title,
    required String ageRange,
    required String mode,
    required IconData icon,
    required Color color,
    required bool isSelected,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isSelected ? Colors.white : const Color(0xFFF1F3FA),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: isSelected ? AppColors.kidsPrimary : Colors.transparent,
          width: 2.2,
        ),
        boxShadow: isSelected
            ? [
                BoxShadow(
                  color: AppColors.kidsPrimary.withOpacity(0.12),
                  blurRadius: 16,
                  offset: const Offset(0, 6),
                ),
              ]
            : null,
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 28),
          ),
          const SizedBox(height: 12),
          Text(
            title,
            style: const TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: AppColors.kidsDarkText,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            ageRange,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: AppColors.kidsSecondaryText,
            ),
          ),
        ],
      ),
    );
  }
}
