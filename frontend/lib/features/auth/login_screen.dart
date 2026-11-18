import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/widgets/mathcity_logo.dart';
import '../../shared/providers/student_provider.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _identifierController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _isPasswordVisible = false;
  bool _isLoading = false;
  bool _isGoogleLoading = false;
  bool _isAppleLoading = false;
  String? _errorMessage;

  @override
  void dispose() {
    _identifierController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _navigateToDashboard(dynamic student) {
    if (!mounted) return;
    final age = student?.age ?? 10;
    if (age >= 17) {
      context.go('/access-denied');
    } else if (age >= 13) {
      context.go('/teen/home');
    } else {
      context.go('/kids/home');
    }
  }

  Future<void> _handleLogin() async {
    final identifier = _identifierController.text.trim();
    final password = _passwordController.text;

    if (identifier.isEmpty) {
      setState(() => _errorMessage = 'Login yoki emailingizni kiriting.');
      return;
    }

    if (password.isEmpty) {
      setState(() => _errorMessage = 'Parolingizni kiriting.');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final result = await ref.read(studentProvider.notifier).loginWithCredentials(
      identifier: identifier,
      password: password,
    );

    if (!mounted) return;
    setState(() => _isLoading = false);

    if (result.success && result.student != null) {
      _navigateToDashboard(result.student);
    } else {
      setState(() {
        _errorMessage = result.errorMessage ?? 'Login yoki parol noto‘g‘ri.';
      });
    }
  }

  Future<void> _handleGoogleSignIn() async {
    setState(() {
      _isGoogleLoading = true;
      _errorMessage = null;
    });

    final result = await ref.read(studentProvider.notifier).signInWithGoogle();

    if (!mounted) return;
    setState(() => _isGoogleLoading = false);

    if (result.success && result.student != null) {
      if (result.isNewUser) {
        context.push('/onboarding/intro');
      } else {
        _navigateToDashboard(result.student);
      }
    } else if (result.errorMessage != null && !result.errorMessage!.contains('bekor')) {
      setState(() {
        _errorMessage = result.errorMessage;
      });
    }
  }

  Future<void> _handleAppleSignIn() async {
    setState(() {
      _isAppleLoading = true;
      _errorMessage = null;
    });

    final result = await ref.read(studentProvider.notifier).signInWithApple();

    if (!mounted) return;
    setState(() => _isAppleLoading = false);

    if (result.success && result.student != null) {
      if (result.isNewUser) {
        context.push('/onboarding/intro');
      } else {
        _navigateToDashboard(result.student);
      }
    } else if (result.errorMessage != null && !result.errorMessage!.contains('bekor')) {
      setState(() {
        _errorMessage = result.errorMessage;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F6FC),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
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
                'Yana xush kelibsiz!',
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
                'Shahringizdagi sarguzashtni davom ettiring.',
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

                      // Field 1: Login yoki email
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
                        controller: _identifierController,
                        keyboardType: TextInputType.emailAddress,
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

                      // Field 2: Parol
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
                        textInputAction: TextInputAction.done,
                        onFieldSubmitted: (_) => _handleLogin(),
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
                          hintText: 'Parolingizni kiriting',
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

                      // Parolni unutdingizmi? link
                      Align(
                        alignment: Alignment.centerRight,
                        child: GestureDetector(
                          onTap: () => context.push('/auth/forgot-password'),
                          child: const Text(
                            'Parolni unutdingizmi?',
                            style: TextStyle(
                              color: Color(0xFF6C47FF),
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(height: 20),

                      // Primary Button: Kirish ->
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
                            onPressed: _isLoading ? null : _handleLogin,
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
                                          'Kirish',
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

                      const SizedBox(height: 22),

                      // Divider: yoki davom eting
                      Row(
                        children: const [
                          Expanded(
                            child: Divider(color: Color(0xFFE5E7EB), thickness: 1),
                          ),
                          Padding(
                            padding: EdgeInsets.symmetric(horizontal: 10),
                            child: Text(
                              'yoki davom eting',
                              style: TextStyle(
                                color: Color(0xFF9CA3AF),
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                          Expanded(
                            child: Divider(color: Color(0xFFE5E7EB), thickness: 1),
                          ),
                        ],
                      ),

                      const SizedBox(height: 18),

                      // Google Sign-In Button
                      SizedBox(
                        width: double.infinity,
                        height: 52,
                        child: OutlinedButton(
                          style: OutlinedButton.styleFrom(
                            backgroundColor: Colors.white,
                            side: const BorderSide(color: Color(0xFFE5E7EB), width: 1.2),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(18),
                            ),
                            elevation: 0,
                          ),
                          onPressed: _isGoogleLoading ? null : _handleGoogleSignIn,
                          child: _isGoogleLoading
                              ? const SizedBox(
                                  width: 22,
                                  height: 22,
                                  child: CircularProgressIndicator(strokeWidth: 2),
                                )
                              : Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Image.asset(
                                      'assets/icons/google_g_logo.png',
                                      width: 20,
                                      height: 20,
                                      errorBuilder: (_, __, ___) => const Icon(
                                        Icons.g_mobiledata,
                                        color: Color(0xFF4285F4),
                                        size: 24,
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    const Flexible(
                                      child: Text(
                                        'Continue with Google',
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: TextStyle(
                                          fontSize: 15,
                                          fontWeight: FontWeight.w600,
                                          color: Color(0xFF1F2937),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                        ),
                      ),

                      const SizedBox(height: 12),

                      // Apple Sign-In Button
                      SizedBox(
                        width: double.infinity,
                        height: 52,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF232332),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(18),
                            ),
                            elevation: 0,
                          ),
                          onPressed: _isAppleLoading ? null : _handleAppleSignIn,
                          child: _isAppleLoading
                              ? const SizedBox(
                                  width: 22,
                                  height: 22,
                                  child: CircularProgressIndicator(
                                    color: Colors.white,
                                    strokeWidth: 2,
                                  ),
                                )
                              : Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: const [
                                    Icon(Icons.apple, color: Colors.white, size: 22),
                                    SizedBox(width: 10),
                                    Flexible(
                                      child: Text(
                                        'Apple orqali davom etish',
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: TextStyle(
                                          fontSize: 15,
                                          fontWeight: FontWeight.w600,
                                          color: Colors.white,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 28),

              // Bottom navigation: Hisobingiz yo‘qmi? Ro‘yxatdan o‘tish
              Wrap(
                alignment: WrapAlignment.center,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: [
                  const Text(
                    'Hisobingiz yo‘qmi? ',
                    style: TextStyle(
                      color: Color(0xFF6B7280),
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  GestureDetector(
                    onTap: () => context.push('/register'),
                    child: const Text(
                      'Ro‘yxatdan o‘tish',
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
