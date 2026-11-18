import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/custom_button.dart';
import '../../core/widgets/mathcity_logo.dart';
import '../../core/widgets/responsive_layout.dart';
import '../../core/auth/auth_service.dart';
import '../../shared/providers/student_provider.dart';

class CompleteProfileScreen extends ConsumerStatefulWidget {
  const CompleteProfileScreen({super.key});

  @override
  ConsumerState<CompleteProfileScreen> createState() => _CompleteProfileScreenState();
}

class _CompleteProfileScreenState extends ConsumerState<CompleteProfileScreen> {
  final _usernameController = TextEditingController();
  Timer? _debounceTimer;

  bool _isCheckingUsername = false;
  bool _isUsernameAvailable = false;
  String? _usernameStatusMessage;
  bool _hasCheckedUsername = false;

  // Birth date selectors
  int? _selectedDay;
  int? _selectedMonth;
  int? _selectedYear;

  bool _parentalConsentChecked = true;
  bool _isSubmitting = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    // Default pre-fill to reasonable student age (11 years old)
    final now = DateTime.now();
    _selectedYear = now.year - 11;
    _selectedMonth = 5;
    _selectedDay = 15;

    // Pre-fill username from current student display name if applicable
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final student = ref.read(studentProvider).student;
      if (student != null && student.displayName.isNotEmpty && !student.displayName.contains(' ')) {
        _usernameController.text = student.displayName.toLowerCase();
        _onUsernameChanged(_usernameController.text);
      }
    });
  }

  @override
  void dispose() {
    _debounceTimer?.cancel();
    _usernameController.dispose();
    super.dispose();
  }

  void _onUsernameChanged(String value) {
    _debounceTimer?.cancel();
    final clean = value.trim();

    if (clean.isEmpty) {
      setState(() {
        _isCheckingUsername = false;
        _isUsernameAvailable = false;
        _hasCheckedUsername = false;
        _usernameStatusMessage = null;
      });
      return;
    }

    if (clean.length < 3 || clean.length > 20) {
      setState(() {
        _isCheckingUsername = false;
        _isUsernameAvailable = false;
        _hasCheckedUsername = true;
        _usernameStatusMessage = 'Foydalanuvchi nomi 3 dan 20 tagacha belgidan iborat bo‘lishi kerak.';
      });
      return;
    }

    if (!RegExp(r'^[a-zA-Z0-9_]+$').hasMatch(clean)) {
      setState(() {
        _isCheckingUsername = false;
        _isUsernameAvailable = false;
        _hasCheckedUsername = true;
        _usernameStatusMessage = 'Faqat lotin harflari, raqamlar va pastki chiziq ruxsat etiladi.';
      });
      return;
    }

    if (clean.contains('@')) {
      setState(() {
        _isCheckingUsername = false;
        _isUsernameAvailable = false;
        _hasCheckedUsername = true;
        _usernameStatusMessage = 'Email manzilini foydalanuvchi nomi sifatida kiritmang.';
      });
      return;
    }

    setState(() {
      _isCheckingUsername = true;
      _hasCheckedUsername = false;
      _usernameStatusMessage = 'Tekshirilmoqda...';
    });

    _debounceTimer = Timer(const Duration(milliseconds: 400), () async {
      final res = await AuthService().checkUsername(clean);
      if (!mounted) return;

      setState(() {
        _isCheckingUsername = false;
        _hasCheckedUsername = true;
        _isUsernameAvailable = res['available'] == true;
        _usernameStatusMessage = res['message'] as String? ?? (_isUsernameAvailable ? 'Foydalanuvchi nomi bo‘sh!' : 'Band nom.');
      });
    });
  }

  int _maxDaysInMonth(int? year, int? month) {
    if (month == null) return 31;
    if (year == null) return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
    final isLeapYear = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
    final days = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return days[month - 1];
  }

  int? get _calculatedAge {
    if (_selectedYear == null || _selectedMonth == null || _selectedDay == null) return null;
    final now = DateTime.now();
    int age = now.year - _selectedYear!;
    final monthDiff = now.month - _selectedMonth!;
    if (monthDiff < 0 || (monthDiff == 0 && now.day < _selectedDay!)) {
      age--;
    }
    return age;
  }

  bool get _isDateValid {
    if (_selectedYear == null || _selectedMonth == null || _selectedDay == null) return false;
    final maxDays = _maxDaysInMonth(_selectedYear, _selectedMonth);
    if (_selectedDay! > maxDays || _selectedDay! < 1) return false;

    final age = _calculatedAge;
    if (age == null) return false;
    if (age < 5 || age > 100) return false;
    return true;
  }

  bool get _isFormValid {
    if (!_isUsernameAvailable) return false;
    if (!_isDateValid) return false;
    final age = _calculatedAge;
    if (age != null && age < 13 && !_parentalConsentChecked) return false;
    return true;
  }

  Future<void> _handleSubmit() async {
    if (!_isFormValid || _isSubmitting) return;

    setState(() {
      _isSubmitting = true;
      _errorMessage = null;
    });

    final username = _usernameController.text.trim();
    final result = await ref.read(studentProvider.notifier).completeProfile(
          username: username,
          day: _selectedDay!,
          month: _selectedMonth!,
          year: _selectedYear!,
        );

    if (!mounted) return;
    setState(() => _isSubmitting = false);

    if (result.success && result.student != null) {
      final age = result.student!.age;
      if (age >= 17) {
        context.go('/access-denied');
      } else if (age >= 13 || result.student!.mode == 'TEEN') {
        context.go('/teen/home');
      } else {
        context.go('/kids/home');
      }
    } else {
      setState(() {
        _errorMessage = result.errorMessage ?? 'Profilni saqlashda xatolik yuz berdi. Qayta urinib ko‘ring.';
      });
    }
  }

  static const List<String> _uzbekMonths = [
    'Yanvar',
    'Fevral',
    'Mart',
    'Aprel',
    'May',
    'Iyun',
    'Iyul',
    'Avgust',
    'Sentyabr',
    'Oktyabr',
    'Noyabr',
    'Dekabr',
  ];

  @override
  Widget build(BuildContext context) {
    final currentYear = DateTime.now().year;
    final student = ref.watch(studentProvider).student;
    final age = _calculatedAge;
    final isMinor = age != null && age < 13;

    return Scaffold(
      backgroundColor: const Color(0xFFF7F6FC),
      body: SafeArea(
        child: ResponsiveAuthCard(
          maxCardWidth: 500,
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 12),
                Center(
                  child: Hero(
                    tag: 'mathcity_logo',
                    child: MathCityLogo(size: 72, showText: false),
                  ),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Profilni to‘ldiring',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF1E1B4B),
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  student?.email.isNotEmpty == true
                      ? 'Uланган hisob: ${student!.email}\nIlovaga to‘liq kirish uchun foydalanuvchi nomi va tug‘ilgan sanangizni kiriting.'
                      : 'Ilovaga to‘liq kirish uchun foydalanuvchi nomi va tug‘ilgan sanangizni kiriting.',
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 13,
                    color: Color(0xFF64748B),
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 24),

                if (_errorMessage != null) ...[
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFEF2F2),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFFCA5A5), width: 1),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.error_outline, color: Color(0xFFDC2626), size: 20),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            _errorMessage!,
                            style: const TextStyle(
                              color: Color(0xFFB91C1C),
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                ],

                // 1. Username Field
                const Text(
                  'Foydalanuvchi nomi (Username)',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF334155),
                  ),
                ),
                const SizedBox(height: 6),
                TextField(
                  controller: _usernameController,
                  onChanged: _onUsernameChanged,
                  textInputAction: TextInputAction.next,
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: Color(0xFF1E293B)),
                  decoration: InputDecoration(
                    hintText: 'masalan: sarvar_2026',
                    prefixIcon: const Icon(Icons.alternate_email, color: AppColors.kidsPrimary, size: 20),
                    suffixIcon: _isCheckingUsername
                        ? const Padding(
                            padding: EdgeInsets.all(12.0),
                            child: SizedBox(
                              width: 16,
                              height: 16,
                              child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.kidsPrimary),
                            ),
                          )
                        : _hasCheckedUsername
                            ? Icon(
                                _isUsernameAvailable ? Icons.check_circle : Icons.cancel,
                                color: _isUsernameAvailable ? const Color(0xFF16A34A) : const Color(0xFFDC2626),
                                size: 20,
                              )
                            : null,
                    filled: true,
                    fillColor: Colors.white,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide(
                        color: _hasCheckedUsername
                            ? (_isUsernameAvailable ? const Color(0xFF86EFAC) : const Color(0xFFFCA5A5))
                            : const Color(0xFFCBD5E1),
                      ),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: const BorderSide(color: AppColors.kidsPrimary, width: 2),
                    ),
                  ),
                ),
                if (_usernameStatusMessage != null) ...[
                  const SizedBox(height: 4),
                  Padding(
                    padding: const EdgeInsets.only(left: 4),
                    child: Text(
                      _usernameStatusMessage!,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: _isCheckingUsername
                            ? const Color(0xFF64748B)
                            : _isUsernameAvailable
                                ? const Color(0xFF16A34A)
                                : const Color(0xFFDC2626),
                      ),
                    ),
                  ),
                ],
                const SizedBox(height: 20),

                // 2. Birth Date Selectors (Day, Month, Year)
                const Text(
                  'Tug‘ilgan sana',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF334155),
                  ),
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    // Day Selector
                    Expanded(
                      flex: 2,
                      child: DropdownButtonFormField<int>(
                        value: _selectedDay,
                        isExpanded: true,
                        decoration: _dropdownDecoration('Kun'),
                        items: List.generate(_maxDaysInMonth(_selectedYear, _selectedMonth), (i) => i + 1)
                            .map((day) => DropdownMenuItem(
                                  value: day,
                                  child: Text('$day', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                                ))
                            .toList(),
                        onChanged: (val) {
                          setState(() => _selectedDay = val);
                        },
                      ),
                    ),
                    const SizedBox(width: 8),

                    // Month Selector
                    Expanded(
                      flex: 3,
                      child: DropdownButtonFormField<int>(
                        value: _selectedMonth,
                        isExpanded: true,
                        decoration: _dropdownDecoration('Oy'),
                        items: List.generate(12, (i) => i + 1)
                            .map((m) => DropdownMenuItem(
                                  value: m,
                                  child: Text(_uzbekMonths[m - 1],
                                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                                ))
                            .toList(),
                        onChanged: (val) {
                          setState(() {
                            _selectedMonth = val;
                            final max = _maxDaysInMonth(_selectedYear, val);
                            if (_selectedDay != null && _selectedDay! > max) {
                              _selectedDay = max;
                            }
                          });
                        },
                      ),
                    ),
                    const SizedBox(width: 8),

                    // Year Selector
                    Expanded(
                      flex: 3,
                      child: DropdownButtonFormField<int>(
                        value: _selectedYear,
                        isExpanded: true,
                        decoration: _dropdownDecoration('Yil'),
                        items: List.generate(currentYear - 5 - (currentYear - 100) + 1, (i) => currentYear - 5 - i)
                            .map((y) => DropdownMenuItem(
                                  value: y,
                                  child: Text('$y', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                                ))
                            .toList(),
                        onChanged: (val) {
                          setState(() {
                            _selectedYear = val;
                            final max = _maxDaysInMonth(val, _selectedMonth);
                            if (_selectedDay != null && _selectedDay! > max) {
                              _selectedDay = max;
                            }
                          });
                        },
                      ),
                    ),
                  ],
                ),

                // Age Indicator Badge
                if (age != null) ...[
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: age < 5 || age > 100
                          ? const Color(0xFFFEF2F2)
                          : const Color(0xFFEDE9FE),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          age < 5 || age > 100 ? Icons.warning_amber_rounded : Icons.cake_outlined,
                          size: 18,
                          color: age < 5 || age > 100 ? const Color(0xFFDC2626) : AppColors.kidsPrimary,
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            age < 5 || age > 100
                                ? 'Yoshingiz 5 dan kichik yoki 100 dan katta bo‘lmasligi kerak.'
                                : 'Yoshingiz: $age yosh • ${age <= 12 ? 'Bolalar rejimi (Kids)' : 'O‘smirlar rejimi (Teen)'}',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: age < 5 || age > 100 ? const Color(0xFFDC2626) : AppColors.kidsPrimary,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],

                // Parental Consent Advisory (COPPA compliance for < 13 y.o.)
                if (isMinor) ...[
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFFBEB),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFFDE68A)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.family_restroom, color: Color(0xFFD97706), size: 20),
                            SizedBox(width: 8),
                            Text(
                              'Ota-onalar bilan birgalikda',
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF92400E),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        const Text(
                          'Ota-onangiz bilan birga foydalaning. MathCity AI bolalar xavfsizligi va maxfiyligi qoidalariga to‘liq rioya qiladi.',
                          style: TextStyle(fontSize: 12, color: Color(0xFF78350F), height: 1.35),
                        ),
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            Checkbox(
                              value: _parentalConsentChecked,
                              activeColor: AppColors.kidsPrimary,
                              onChanged: (val) {
                                setState(() => _parentalConsentChecked = val ?? false);
                              },
                            ),
                            const Expanded(
                              child: Text(
                                'Tushundim, ota-onam bilan birga foydalanaman',
                                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF92400E)),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],

                const SizedBox(height: 28),

                // Continue Button
                CustomButton(
                  text: 'Davom etish',
                  isLoading: _isSubmitting,
                  onPressed: _isFormValid ? _handleSubmit : null,
                  backgroundColor: AppColors.kidsPrimary,
                  textColor: Colors.white,
                  height: 52,
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
        ),
      ),
    );
  }

  InputDecoration _dropdownDecoration(String label) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
      filled: true,
      fillColor: Colors.white,
      contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 12),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFFCBD5E1)),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: AppColors.kidsPrimary, width: 2),
      ),
    );
  }
}
