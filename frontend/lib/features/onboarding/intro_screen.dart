import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/coin_icon.dart';
import '../../core/widgets/custom_button.dart';
import '../../core/auth/auth_service.dart';
import '../../shared/providers/student_provider.dart';

class IntroScreen extends ConsumerStatefulWidget {
  const IntroScreen({super.key});

  @override
  ConsumerState<IntroScreen> createState() => _IntroScreenState();
}

class _IntroScreenState extends ConsumerState<IntroScreen> {
  int _currentStep = 0; // 0: Username, 1: Date of Birth, 2: Summary / Finish
  final _usernameController = TextEditingController(text: 'MathHero2026');
  String? _usernameError;
  bool _isCheckingUsername = false;

  DateTime _selectedDate = DateTime(2016, 5, 15); // Default 10 years old
  String _selectedMode = 'KIDS';
  bool _isSubmitting = false;

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

  Future<void> _handleUsernameContinue() async {
    final username = _usernameController.text.trim();
    if (username.isEmpty) {
      setState(() => _usernameError = 'Iltimos, foydalanuvchi nomini kiriting.');
      return;
    }
    if (username.length < 3 || username.length > 20) {
      setState(() => _usernameError = 'Foydalanuvchi nomi 3 dan 20 belgiga bo‘lishi kerak.');
      return;
    }
    if (!RegExp(r'^[a-zA-Z0-9_]+$').hasMatch(username)) {
      setState(() => _usernameError = 'Faqat lotin harflari, raqamlar va pastki chiziq ruxsat etilgan.');
      return;
    }
    if (username.contains('@')) {
      setState(() => _usernameError = 'Email manzilini foydalanuvchi nomi sifatida ishlatib bo‘lmaydi.');
      return;
    }

    setState(() {
      _isCheckingUsername = true;
      _usernameError = null;
    });

    final res = await AuthService().checkUsername(username);

    setState(() => _isCheckingUsername = false);

    if (res['available'] == true) {
      setState(() {
        _currentStep = 1;
      });
    } else {
      setState(() {
        _usernameError = res['message'] ?? 'Bu foydalanuvchi nomi band. Boshqasini tanlang.';
      });
    }
  }

  void _handleDobContinue() {
    final age = _calculateAge(_selectedDate);
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

    setState(() {
      _currentStep = 2;
    });
  }

  Future<void> _handleFinishRegistration() async {
    setState(() => _isSubmitting = true);
    final username = _usernameController.text.trim();
    final age = _calculateAge(_selectedDate);

    // Call backend authoritative onboarding
    final success = await ref.read(studentProvider.notifier).completeOnboarding(
      username: username,
      day: _selectedDate.day,
      month: _selectedDate.month,
      year: _selectedDate.year,
    );

    if (!success) {
      // Fallback registration if not already logged in with Google/Apple
      await ref.read(studentProvider.notifier).register(
        name: username,
        dob: _selectedDate,
        email: '${username.toLowerCase()}@mathcity.ai',
        password: 'securepassword123',
      );
    }

    setState(() => _isSubmitting = false);

    if (!mounted) return;

    if (age <= 12) {
      context.go('/kids/home');
    } else {
      context.go('/teen/home');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.kidsBackground,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.kidsDarkText),
          onPressed: () {
            if (_currentStep > 0) {
              setState(() => _currentStep--);
            } else {
              if (context.canPop()) {
                context.pop();
              } else {
                context.go('/kids/home');
              }
            }
          },
        ),
        title: Text(
          'Bosqich ${_currentStep + 1} / 3',
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: AppColors.kidsSecondaryText,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.fromLTRB(24, 8, 24, 32),
          child: _buildStepContent(),
        ),
      ),
    );
  }

  Widget _buildStepContent() {
    switch (_currentStep) {
      case 0:
        return _buildUsernameStep();
      case 1:
        return _buildDobStep();
      case 2:
      default:
        return _buildSummaryStep();
    }
  }

  // --- SCREEN 1: USERNAME ---
  Widget _buildUsernameStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'MathCity AI\'ga xush kelibsiz!',
          style: TextStyle(
            fontSize: 26,
            fontWeight: FontWeight.w900,
            color: AppColors.kidsDarkText,
          ),
        ),
        const SizedBox(height: 8),
        const Text(
          'O‘zingiz uchun foydalanuvchi nomini tanlang.',
          style: TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w500,
            color: AppColors.kidsSecondaryText,
          ),
        ),
        const SizedBox(height: 32),

        const Text(
          'Foydalanuvchi nomi',
          style: TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w700,
            color: AppColors.kidsDarkText,
          ),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _usernameController,
          decoration: InputDecoration(
            hintText: 'Masalan: MathHero2026',
            filled: true,
            fillColor: Colors.white,
            errorText: _usernameError,
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
        const SizedBox(height: 12),
        const Text(
          'Foydalanuvchi nomi faqat lotin harflari va raqamlardan iborat bo‘lishi lozim.',
          style: TextStyle(fontSize: 12, color: AppColors.kidsSecondaryText),
        ),
        const SizedBox(height: 48),

        CustomButton(
          text: 'Davom etish',
          backgroundColor: AppColors.kidsPrimary,
          borderRadius: 20,
          isLoading: _isCheckingUsername,
          onPressed: _handleUsernameContinue,
        ),
      ],
    );
  }

  // --- SCREEN 2: DATE OF BIRTH ---
  Widget _buildDobStep() {
    final currentAge = _calculateAge(_selectedDate);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Tug‘ilgan sanangizni kiriting',
          style: TextStyle(
            fontSize: 26,
            fontWeight: FontWeight.w900,
            color: AppColors.kidsDarkText,
          ),
        ),
        const SizedBox(height: 8),
        const Text(
          'Yoshingizga mos matematika darajasini tanlashimiz uchun tug‘ilgan sanangizni belgilang.',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: AppColors.kidsSecondaryText,
          ),
        ),
        const SizedBox(height: 28),

        InkWell(
          onTap: () async {
            final picked = await showDatePicker(
              context: context,
              initialDate: _selectedDate,
              firstDate: DateTime(2008),
              lastDate: DateTime.now(),
            );
            if (picked != null) {
              _onDatePicked(picked);
            }
          },
          borderRadius: BorderRadius.circular(18),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: AppColors.kidsBorder, width: 1.5),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Tug‘ilgan sana',
                      style: TextStyle(fontSize: 12, color: AppColors.kidsSecondaryText, fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${_selectedDate.day.toString().padLeft(2, '0')}.${_selectedDate.month.toString().padLeft(2, '0')}.${_selectedDate.year} ($currentAge yosh)',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: AppColors.kidsDarkText,
                      ),
                    ),
                  ],
                ),
                const Icon(Icons.calendar_month_rounded, color: AppColors.kidsPrimary, size: 28),
              ],
            ),
          ),
        ),
        const SizedBox(height: 24),

        // Mode Preview Cards
        const Text(
          'Tavsiya etilgan ta’lim rejimi',
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

        CustomButton(
          text: 'Davom etish',
          backgroundColor: AppColors.kidsPrimary,
          borderRadius: 20,
          onPressed: _handleDobContinue,
        ),
      ],
    );
  }

  // --- SCREEN 3: FINISH REGISTRATION & ZERO-PROGRESS CONFIRMATION ---
  Widget _buildSummaryStep() {
    final currentAge = _calculateAge(_selectedDate);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Ro‘yxatdan o‘tishni yakunlang',
          style: TextStyle(
            fontSize: 26,
            fontWeight: FontWeight.w900,
            color: AppColors.kidsDarkText,
          ),
        ),
        const SizedBox(height: 8),
        const Text(
          'Sizning yangi hisobingiz to‘liq tayyor. Ma’lumotlaringizni tasdiqlang:',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: AppColors.kidsSecondaryText,
          ),
        ),
        const SizedBox(height: 24),

        // Summary Card
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(22),
            border: Border.all(color: AppColors.kidsBorder, width: 1.5),
            boxShadow: [
              BoxShadow(
                color: AppColors.kidsDarkText.withValues(alpha: 0.04),
                blurRadius: 16,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: Column(
            children: [
              _buildSummaryRow(
                icon: Icons.person_rounded,
                label: 'Foydalanuvchi nomi',
                value: _usernameController.text.trim(),
              ),
              const Divider(height: 24),
              _buildSummaryRow(
                icon: Icons.cake_rounded,
                label: 'Yoshi',
                value: '$currentAge yosh',
              ),
              const Divider(height: 24),
              _buildSummaryRow(
                icon: _selectedMode == 'KIDS' ? Icons.smart_toy_rounded : Icons.rocket_launch_rounded,
                label: 'Ta’lim rejimi',
                value: _selectedMode == 'KIDS' ? 'Bolalar rejimi' : 'O‘smirlar rejimi',
              ),
              const Divider(height: 24),
              _buildSummaryRow(
                customIcon: const CoinIcon(size: 22),
                label: 'Boshlang‘ich balans',
                value: '0 oltin tanga',
                valueColor: const Color(0xFF7A4800),
              ),
            ],
          ),
        ),
        const SizedBox(height: 40),

        CustomButton(
          text: 'Ro‘yxatdan o‘tish',
          backgroundColor: AppColors.kidsPrimary,
          borderRadius: 20,
          isLoading: _isSubmitting,
          onPressed: _handleFinishRegistration,
        ),
      ],
    );
  }

  Widget _buildSummaryRow({
    IconData? icon,
    Widget? customIcon,
    required String label,
    required String value,
    Color? valueColor,
  }) {
    return Row(
      children: [
        customIcon ?? Icon(icon, color: AppColors.kidsPrimary, size: 22),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            label,
            style: const TextStyle(fontSize: 14, color: AppColors.kidsSecondaryText, fontWeight: FontWeight.w600),
          ),
        ),
        const SizedBox(width: 8),
        Flexible(
          child: Text(
            value,
            textAlign: TextAlign.end,
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w800,
              color: valueColor ?? AppColors.kidsDarkText,
            ),
          ),
        ),
      ],
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
                  color: AppColors.kidsPrimary.withValues(alpha: 0.12),
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
              color: color.withValues(alpha: 0.1),
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
