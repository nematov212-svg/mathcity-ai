import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/widgets/mathcity_logo.dart';
import '../../core/widgets/responsive_layout.dart';
import '../../shared/providers/student_provider.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _loginController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  bool _isPasswordVisible = false;
  bool _isConfirmPasswordVisible = false;
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void dispose() {
    _nameController.dispose();
    _loginController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _handleRegister() async {
    final name = _nameController.text.trim();
    final loginOrEmail = _loginController.text.trim();
    final password = _passwordController.text;
    final confirmPassword = _confirmPasswordController.text;

    if (name.isEmpty) {
      setState(() => _errorMessage = 'Ismingizni kiriting.');
      return;
    }
    if (name.length < 2) {
      setState(() => _errorMessage = 'Ism kamida 2 ta harfdan iborat bo‘lishi kerak.');
      return;
    }
    if (loginOrEmail.isEmpty) {
      setState(() => _errorMessage = 'Login yoki emailingizni kiriting.');
      return;
    }
    if (loginOrEmail.length < 3) {
      setState(() => _errorMessage = 'Login kamida 3 ta belgidan iborat bo‘lishi kerak.');
      return;
    }
    if (password.isEmpty) {
      setState(() => _errorMessage = 'Parolingizni kiriting.');
      return;
    }
    if (password.length < 8) {
      setState(() => _errorMessage = 'Parol kamida 8 ta belgidan iborat bo‘lsin.');
      return;
    }
    if (password != confirmPassword) {
      setState(() => _errorMessage = 'Parollar bir xil emas.');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final result = await ref.read(studentProvider.notifier).registerStudent(
      name: name,
      loginOrEmail: loginOrEmail,
      password: password,
      confirmPassword: confirmPassword,
    );

    if (!mounted) return;
    setState(() => _isLoading = false);

    if (result.success && result.student != null) {
      // Navigate to onboarding to pick age & avatar or directly to dashboard
      context.go('/onboarding/intro');
    } else {
      setState(() {
        _errorMessage = result.errorMessage ?? 'Ro‘yxatdan o‘tishda xatolik yuz berdi.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F6FC),
      body: SafeArea(
        child: ResponsiveAuthCard(
          maxCardWidth: 480,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 12),

              // Soft lavender circular container behind MathCity AI logo
              Center(
                child: Container(
                  width: 140,
                  height: 140,
                  decoration: const BoxDecoration(
                    color: Color(0xFFECE7FD),
                    shape: BoxShape.circle,
                  ),
                  child: const Center(
                    child: MathCityLogo(
                      size: 110,
                      showText: true,
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 18),

              // Headline & Subtitle
              const Text(
                'Yangi hisob yarating',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF1E1742),
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'O‘rganing, tangalar yig‘ing va shahringizni quring.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF7E79A4),
                ),
              ),

              const SizedBox(height: 24),

              // White Form Card Container
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
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Error banner if any
                      if (_errorMessage != null) ...[
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFEE2E2),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: const Color(0xFFFCA5A5)),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.error_outline_rounded, color: Color(0xFFDC2626), size: 20),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  _errorMessage!,
                                  style: const TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                    color: Color(0xFFB91C1C),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),
                      ],

                      // Field 1: Ismingiz
                      const Text(
                        'Ismingiz',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF1E1742),
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _nameController,
                        textCapitalization: TextCapitalization.words,
                        textInputAction: TextInputAction.next,
                        style: const TextStyle(
                          fontSize: 15,
                          color: Color(0xFF1E1742),
                          fontWeight: FontWeight.w500,
                        ),
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: const Color(0xFFFAFAFE),
                          prefixIcon: const Icon(
                            Icons.person_outline_rounded,
                            color: Color(0xFF9E9AA8),
                            size: 22,
                          ),
                          hintText: 'Ismingizni kiriting',
                          hintStyle: const TextStyle(
                            color: Color(0xFF9E9AA8),
                            fontSize: 14,
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: const BorderSide(color: Color(0xFFEAE7F4), width: 1.2),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: const BorderSide(color: Color(0xFFEAE7F4), width: 1.2),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: const BorderSide(color: Color(0xFF6C47FF), width: 1.5),
                          ),
                        ),
                      ),

                      const SizedBox(height: 18),

                      // Field 2: Login yoki email
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
                        controller: _loginController,
                        textInputAction: TextInputAction.next,
                        style: const TextStyle(
                          fontSize: 15,
                          color: Color(0xFF1E1742),
                          fontWeight: FontWeight.w500,
                        ),
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: const Color(0xFFFAFAFE),
                          prefixIcon: const Icon(
                            Icons.person_outline_rounded,
                            color: Color(0xFF9E9AA8),
                            size: 22,
                          ),
                          hintText: 'Login yoki emailingizni kiriting',
                          hintStyle: const TextStyle(
                            color: Color(0xFF9E9AA8),
                            fontSize: 14,
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: const BorderSide(color: Color(0xFFEAE7F4), width: 1.2),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: const BorderSide(color: Color(0xFFEAE7F4), width: 1.2),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: const BorderSide(color: Color(0xFF6C47FF), width: 1.5),
                          ),
                        ),
                      ),

                      const SizedBox(height: 18),

                      // Field 3: Parol
                      const Text(
                        'Parol',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF1E1742),
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _passwordController,
                        obscureText: !_isPasswordVisible,
                        textInputAction: TextInputAction.next,
                        style: const TextStyle(
                          fontSize: 15,
                          color: Color(0xFF1E1742),
                          fontWeight: FontWeight.w500,
                        ),
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: const Color(0xFFFAFAFE),
                          prefixIcon: const Icon(
                            Icons.lock_outline_rounded,
                            color: Color(0xFF9E9AA8),
                            size: 22,
                          ),
                          suffixIcon: IconButton(
                            icon: Icon(
                              _isPasswordVisible ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                              color: const Color(0xFF6B7280),
                              size: 22,
                            ),
                            onPressed: () => setState(() => _isPasswordVisible = !_isPasswordVisible),
                          ),
                          hintText: 'Yangi parol yarating',
                          hintStyle: const TextStyle(
                            color: Color(0xFF9E9AA8),
                            fontSize: 14,
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: const BorderSide(color: Color(0xFFEAE7F4), width: 1.2),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: const BorderSide(color: Color(0xFFEAE7F4), width: 1.2),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: const BorderSide(color: Color(0xFF6C47FF), width: 1.5),
                          ),
                        ),
                      ),

                      const SizedBox(height: 18),

                      // Field 4: Parolni tasdiqlang
                      const Text(
                        'Parolni tasdiqlang',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF1E1742),
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _confirmPasswordController,
                        obscureText: !_isConfirmPasswordVisible,
                        textInputAction: TextInputAction.done,
                        onFieldSubmitted: (_) => _handleRegister(),
                        style: const TextStyle(
                          fontSize: 15,
                          color: Color(0xFF1E1742),
                          fontWeight: FontWeight.w500,
                        ),
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: const Color(0xFFFAFAFE),
                          prefixIcon: const Icon(
                            Icons.lock_outline_rounded,
                            color: Color(0xFF9E9AA8),
                            size: 22,
                          ),
                          suffixIcon: IconButton(
                            icon: Icon(
                              _isConfirmPasswordVisible ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                              color: const Color(0xFF6B7280),
                              size: 22,
                            ),
                            onPressed: () => setState(() => _isConfirmPasswordVisible = !_isConfirmPasswordVisible),
                          ),
                          hintText: 'Parolni qayta kiriting',
                          hintStyle: const TextStyle(
                            color: Color(0xFF9E9AA8),
                            fontSize: 14,
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: const BorderSide(color: Color(0xFFEAE7F4), width: 1.2),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: const BorderSide(color: Color(0xFFEAE7F4), width: 1.2),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: const BorderSide(color: Color(0xFF6C47FF), width: 1.5),
                          ),
                        ),
                      ),

                      const SizedBox(height: 12),

                      // Helper text: Parol kamida 8 ta belgidan iborat bo‘lsin.
                      const Text(
                        'Parol kamida 8 ta belgidan iborat bo‘lsin.',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                          color: Color(0xFF7E79A4),
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Primary Button: Hisob yaratish ->
                      SizedBox(
                        width: double.infinity,
                        height: 54,
                        child: DecoratedBox(
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(18),
                            boxShadow: const [
                              BoxShadow(
                                color: Color(0x406C47FF),
                                blurRadius: 18,
                                offset: Offset(0, 6),
                              ),
                            ],
                          ),
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF6C47FF),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(18),
                              ),
                              elevation: 0,
                            ),
                            onPressed: _isLoading ? null : _handleRegister,
                            child: _isLoading
                                ? const SizedBox(
                                    width: 24,
                                    height: 24,
                                    child: CircularProgressIndicator(
                                      color: Colors.white,
                                      strokeWidth: 2.5,
                                    ),
                                  )
                                : Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    mainAxisSize: MainAxisSize.min,
                                    children: const [
                                      Flexible(
                                        child: Text(
                                          'Hisob yaratish',
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                          style: TextStyle(
                                            fontSize: 16,
                                            fontWeight: FontWeight.w700,
                                            color: Colors.white,
                                          ),
                                        ),
                                      ),
                                      SizedBox(width: 8),
                                      Icon(
                                        Icons.arrow_forward_rounded,
                                        color: Colors.white,
                                        size: 20,
                                      ),
                                    ],
                                  ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 28),

              // Bottom navigation: Hisobingiz bormi? Kirish
              Wrap(
                alignment: WrapAlignment.center,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: [
                  const Text(
                    'Hisobingiz bormi? ',
                    style: TextStyle(
                      color: Color(0xFF6B7280),
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  GestureDetector(
                    onTap: () {
                      if (context.canPop()) {
                        context.pop();
                      } else {
                        context.go('/login');
                      }
                    },
                    child: const Text(
                      'Kirish',
                      style: TextStyle(
                        color: Color(0xFF6C47FF),
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
