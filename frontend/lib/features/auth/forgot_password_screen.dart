import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/auth/auth_service.dart';
import '../../core/widgets/mathcity_logo.dart';
import '../../core/widgets/responsive_layout.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _emailController = TextEditingController();
  final _codeController = TextEditingController();
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  bool _codeSent = false;
  bool _isLoading = false;
  bool _isPasswordVisible = false;
  bool _isConfirmPasswordVisible = false;
  String? _errorMessage;
  String? _successMessage;

  @override
  void dispose() {
    _emailController.dispose();
    _codeController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _handleRequestCode() async {
    final email = _emailController.text.trim();
    if (email.isEmpty) {
      setState(() => _errorMessage = 'Email yoki loginingizni kiriting.');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
      _successMessage = null;
    });

    final res = await AuthService().requestPasswordReset(email);

    if (!mounted) return;
    setState(() => _isLoading = false);

    if (res['success'] == true) {
      setState(() {
        _codeSent = true;
        _successMessage = res['message'] ?? 'Tiklash kodi yuborildi.';
        if (res['debugCode'] != null) {
          _codeController.text = res['debugCode'].toString();
        }
      });
    } else {
      setState(() {
        _errorMessage = res['message'] ?? 'Xatolik yuz berdi.';
      });
    }
  }

  Future<void> _handleResetPassword() async {
    final email = _emailController.text.trim();
    final code = _codeController.text.trim();
    final newPassword = _newPasswordController.text;
    final confirmPassword = _confirmPasswordController.text;

    if (code.isEmpty) {
      setState(() => _errorMessage = 'Tiklash kodini kiriting.');
      return;
    }
    if (newPassword.isEmpty) {
      setState(() => _errorMessage = 'Yangi parolni kiriting.');
      return;
    }
    if (newPassword.length < 8) {
      setState(
          () => _errorMessage = 'Parol kamida 8 ta belgidan iborat bo‘lsin.');
      return;
    }
    if (newPassword != confirmPassword) {
      setState(() => _errorMessage = 'Parollar bir xil emas.');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final res = await AuthService().resetPassword(
      emailOrUsername: email,
      resetToken: code,
      newPassword: newPassword,
    );

    if (!mounted) return;
    setState(() => _isLoading = false);

    if (res['success'] == true) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(res['message'] ?? 'Parol muvaffaqiyatli yangilandi.'),
          backgroundColor: const Color(0xFF10B981),
        ),
      );
      context.go('/login');
    } else {
      setState(() {
        _errorMessage = res['message'] ?? 'Tiklashda xatolik yuz berdi.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F6FC),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded,
              color: Color(0xFF1E1742)),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/login');
            }
          },
        ),
      ),
      body: SafeArea(
        child: ResponsiveAuthCard(
          maxCardWidth: 480,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Logo
              Center(
                child: Container(
                  width: 120,
                  height: 120,
                  decoration: const BoxDecoration(
                    color: Color(0xFFECE7FD),
                    shape: BoxShape.circle,
                  ),
                  child: const Center(
                    child: MathCityLogo(
                      size: 95,
                      showText: true,
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 18),

              const Text(
                'Parolni unutdingizmi?',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF1E1742),
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                _codeSent
                    ? 'Yangi parolingizni o‘rnating va tasdiqlang.'
                    : 'Hisobingizga ulangan email yoki loginni kiriting.',
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF7E79A4),
                ),
              ),

              const SizedBox(height: 24),

              // Form Container
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(32),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x0C000000),
                      blurRadius: 24,
                      offset: Offset(0, 10),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (_errorMessage != null) ...[
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 14, vertical: 10),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFEE2E2),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFFCA5A5)),
                        ),
                        child: Text(
                          _errorMessage!,
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFFB91C1C),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],

                    if (_successMessage != null) ...[
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 14, vertical: 10),
                        decoration: BoxDecoration(
                          color: const Color(0xFFD1FAE5),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFF6EE7B7)),
                        ),
                        child: Text(
                          _successMessage!,
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF047857),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],

                    // Email / Login field
                    const Text(
                      'Login yoki email',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF1E1742),
                      ),
                    ),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _emailController,
                      enabled: !_codeSent,
                      style: const TextStyle(
                          fontSize: 15, color: Color(0xFF1E1742)),
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: const Color(0xFFFAFAFE),
                        prefixIcon: const Icon(Icons.person_outline_rounded,
                            color: Color(0xFF9E9AA8), size: 22),
                        hintText: 'Login yoki emailingizni kiriting',
                        hintStyle: const TextStyle(
                            color: Color(0xFF9E9AA8), fontSize: 14),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: const BorderSide(
                              color: Color(0xFFEAE7F4), width: 1.2),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: const BorderSide(
                              color: Color(0xFFEAE7F4), width: 1.2),
                        ),
                      ),
                    ),

                    if (!_codeSent) ...[
                      const SizedBox(height: 24),
                      SizedBox(
                        width: double.infinity,
                        height: 52,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF6C47FF),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(18)),
                            elevation: 0,
                          ),
                          onPressed: _isLoading ? null : _handleRequestCode,
                          child: _isLoading
                              ? const SizedBox(
                                  width: 22,
                                  height: 22,
                                  child: CircularProgressIndicator(
                                      color: Colors.white, strokeWidth: 2))
                              : const Text(
                                  'Tiklash kodini olish',
                                  style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w700,
                                      color: Colors.white),
                                ),
                        ),
                      ),
                    ] else ...[
                      const SizedBox(height: 18),
                      // Code field
                      const Text(
                        'Tiklash kodi',
                        style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF1E1742)),
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _codeController,
                        style: const TextStyle(
                            fontSize: 15, color: Color(0xFF1E1742)),
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: const Color(0xFFFAFAFE),
                          prefixIcon: const Icon(Icons.key_rounded,
                              color: Color(0xFF9E9AA8), size: 22),
                          hintText: '6 xonali kodni kiriting',
                          hintStyle: const TextStyle(
                              color: Color(0xFF9E9AA8), fontSize: 14),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: const BorderSide(
                                color: Color(0xFFEAE7F4), width: 1.2),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: const BorderSide(
                                color: Color(0xFFEAE7F4), width: 1.2),
                          ),
                        ),
                      ),
                      const SizedBox(height: 18),

                      // New Password
                      const Text(
                        'Yangi parol',
                        style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF1E1742)),
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _newPasswordController,
                        obscureText: !_isPasswordVisible,
                        style: const TextStyle(
                            fontSize: 15, color: Color(0xFF1E1742)),
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: const Color(0xFFFAFAFE),
                          prefixIcon: const Icon(Icons.lock_outline_rounded,
                              color: Color(0xFF9E9AA8), size: 22),
                          suffixIcon: IconButton(
                            icon: Icon(_isPasswordVisible
                                ? Icons.visibility_outlined
                                : Icons.visibility_off_outlined),
                            onPressed: () => setState(
                                () => _isPasswordVisible = !_isPasswordVisible),
                          ),
                          hintText: 'Yangi parol (kamida 8 ta belgi)',
                          hintStyle: const TextStyle(
                              color: Color(0xFF9E9AA8), fontSize: 14),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: const BorderSide(
                                color: Color(0xFFEAE7F4), width: 1.2),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: const BorderSide(
                                color: Color(0xFFEAE7F4), width: 1.2),
                          ),
                        ),
                      ),
                      const SizedBox(height: 18),

                      // Confirm Password
                      const Text(
                        'Yangi parolni tasdiqlang',
                        style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF1E1742)),
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _confirmPasswordController,
                        obscureText: !_isConfirmPasswordVisible,
                        style: const TextStyle(
                            fontSize: 15, color: Color(0xFF1E1742)),
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: const Color(0xFFFAFAFE),
                          prefixIcon: const Icon(Icons.lock_outline_rounded,
                              color: Color(0xFF9E9AA8), size: 22),
                          suffixIcon: IconButton(
                            icon: Icon(_isConfirmPasswordVisible
                                ? Icons.visibility_outlined
                                : Icons.visibility_off_outlined),
                            onPressed: () => setState(() =>
                                _isConfirmPasswordVisible =
                                    !_isConfirmPasswordVisible),
                          ),
                          hintText: 'Parolni qayta kiriting',
                          hintStyle: const TextStyle(
                              color: Color(0xFF9E9AA8), fontSize: 14),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: const BorderSide(
                                color: Color(0xFFEAE7F4), width: 1.2),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: const BorderSide(
                                color: Color(0xFFEAE7F4), width: 1.2),
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Reset button
                      SizedBox(
                        width: double.infinity,
                        height: 52,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF6C47FF),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(18)),
                            elevation: 0,
                          ),
                          onPressed: _isLoading ? null : _handleResetPassword,
                          child: _isLoading
                              ? const SizedBox(
                                  width: 22,
                                  height: 22,
                                  child: CircularProgressIndicator(
                                      color: Colors.white, strokeWidth: 2))
                              : const Text(
                                  'Parolni yangilash',
                                  style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w700,
                                      color: Colors.white),
                                ),
                        ),
                      ),
                    ],
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Return to login
              GestureDetector(
                onTap: () => context.go('/login'),
                child: const Text(
                  'Kirish oynasiga qaytish',
                  style: TextStyle(
                    color: Color(0xFF6C47FF),
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
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
