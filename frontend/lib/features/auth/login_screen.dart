import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/auth_design_tokens.dart';
import '../../core/widgets/google_sign_in_button.dart';
import '../../core/widgets/responsive_auth_shell.dart';
import '../../shared/providers/student_provider.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen>
    with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _identifierController = TextEditingController();
  final _passwordController = TextEditingController();

  final _identifierFocusNode = FocusNode();
  final _passwordFocusNode = FocusNode();

  bool _isPasswordVisible = false;
  bool _isLoading = false;
  bool _isGoogleLoading = false;
  bool _isSuccess = false;
  String? _errorMessage;

  late final AnimationController _shakeCtrl;
  late final Animation<double> _shakeAnimation;

  @override
  void initState() {
    super.initState();
    _identifierFocusNode.addListener(() => setState(() {}));
    _passwordFocusNode.addListener(() => setState(() {}));

    _shakeCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    _shakeAnimation = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: 0.0, end: -7.0), weight: 1),
      TweenSequenceItem(tween: Tween(begin: -7.0, end: 7.0), weight: 2),
      TweenSequenceItem(tween: Tween(begin: 7.0, end: -6.0), weight: 2),
      TweenSequenceItem(tween: Tween(begin: -6.0, end: 6.0), weight: 2),
      TweenSequenceItem(tween: Tween(begin: 6.0, end: 0.0), weight: 1),
    ]).animate(CurvedAnimation(parent: _shakeCtrl, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _identifierController.dispose();
    _passwordController.dispose();
    _identifierFocusNode.dispose();
    _passwordFocusNode.dispose();
    _shakeCtrl.dispose();
    super.dispose();
  }

  void _triggerShake() {
    _shakeCtrl.forward(from: 0.0);
  }

  void _navigateToDashboard(dynamic student) {
    if (!mounted) return;
    context.go('/kids/home');
  }

  Future<void> _handleLogin() async {
    if (_isLoading || _isSuccess) return;

    final identifier = _identifierController.text.trim();
    final password = _passwordController.text;

    if (identifier.isEmpty) {
      setState(() => _errorMessage = 'Login yoki emailingizni kiriting.');
      _triggerShake();
      return;
    }

    if (password.isEmpty) {
      setState(() => _errorMessage = 'Parolingizni kiriting.');
      _triggerShake();
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final result =
          await ref.read(studentProvider.notifier).loginWithCredentials(
                identifier: identifier,
                password: password,
              );

      if (!mounted) return;

      if (result.success && result.student != null) {
        setState(() => _isSuccess = true);
        await Future.delayed(const Duration(milliseconds: 600));
        if (!mounted) return;

        if (!result.profileCompleted || !result.student!.profileCompleted) {
          context.go('/complete-profile');
        } else {
          _navigateToDashboard(result.student);
        }
      } else {
        setState(() {
          _errorMessage = result.errorMessage ?? 'Login yoki parol noto‘g‘ri.';
        });
        _triggerShake();
      }
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _errorMessage =
            'Server bilan aloqa o‘rnatib bo‘lmadi. Qayta urinib ko‘ring.';
      });
      _triggerShake();
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _handleGoogleSignIn() async {
    if (_isGoogleLoading || _isLoading) return;
    setState(() {
      _isGoogleLoading = true;
      _errorMessage = null;
    });

    try {
      final result =
          await ref.read(studentProvider.notifier).signInWithGoogle();

      if (!mounted) return;

      if (result.success && result.student != null) {
        if (!result.profileCompleted || !result.student!.profileCompleted) {
          context.go('/complete-profile');
        } else if (result.isNewUser) {
          context.push('/onboarding/intro');
        } else {
          _navigateToDashboard(result.student);
        }
      } else if (result.errorMessage != null &&
          !result.errorMessage!.contains('bekor')) {
        setState(() {
          _errorMessage = result.errorMessage;
        });
        _triggerShake();
      }
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _errorMessage = 'Google tizimiga ulanib bo‘lmadi.';
      });
      _triggerShake();
    } finally {
      if (mounted) setState(() => _isGoogleLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    ref.listen<StudentState>(studentProvider, (prev, next) {
      if (next.student != null &&
          prev?.student?.id != next.student?.id &&
          mounted) {
        if (!next.student!.profileCompleted) {
          context.go('/complete-profile');
        } else {
          _navigateToDashboard(next.student);
        }
      }
    });

    final screenWidth = MediaQuery.of(context).size.width;
    final isTablet = screenWidth >= 600 && screenWidth < 1024;
    final isDark = AuthTokens.isDark(context);

    final inputHeight = isTablet ? 60.0 : 56.0;
    final buttonHeight = isTablet ? 62.0 : 58.0;

    return ResponsiveAuthShell(
      title: 'Yana xush kelibsiz!',
      subtitle: 'Shahringizdagi sarguzashtni davom ettiring.',
      cardChild: AnimatedBuilder(
        animation: _shakeAnimation,
        builder: (context, child) {
          return Transform.translate(
            offset: Offset(_shakeAnimation.value, 0),
            child: child,
          );
        },
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Error banner
              if (_errorMessage != null) ...[
                Container(
                  width: double.infinity,
                  margin: const EdgeInsets.only(bottom: 16),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
                  decoration: BoxDecoration(
                    color: AuthTokens.errorLight.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: AuthTokens.errorLight.withOpacity(0.35),
                      width: 1.2,
                    ),
                  ),
                  child: Row(
                    children: [
                      const Icon(
                        Icons.error_outline_rounded,
                        color: AuthTokens.errorLight,
                        size: 20,
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          _errorMessage!,
                          style: const TextStyle(
                            fontFamily: 'Nunito',
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                            color: AuthTokens.errorLight,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],

              // Field 1: Login yoki email
              Text(
                'Login yoki email',
                style: TextStyle(
                  fontFamily: 'Nunito',
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: AuthTokens.ink(context),
                ),
              ),
              const SizedBox(height: 8),
              SizedBox(
                height: inputHeight,
                child: TextFormField(
                  controller: _identifierController,
                  focusNode: _identifierFocusNode,
                  keyboardType: TextInputType.emailAddress,
                  autofillHints: const [
                    AutofillHints.username,
                    AutofillHints.email
                  ],
                  style: TextStyle(
                    fontFamily: 'Nunito',
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AuthTokens.ink(context),
                  ),
                  decoration: InputDecoration(
                    hintText: 'Login yoki emailingizni kiriting',
                    hintStyle: TextStyle(
                      fontFamily: 'Nunito',
                      fontSize: 15,
                      fontWeight: FontWeight.w500,
                      color: AuthTokens.mute(context).withOpacity(0.7),
                    ),
                    filled: true,
                    fillColor: AuthTokens.field(context),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16),
                    prefixIcon: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      child: Icon(
                        Icons.person_outline_rounded,
                        color: _identifierFocusNode.hasFocus
                            ? AuthTokens.brand(context)
                            : AuthTokens.mute(context),
                        size: 22,
                      ),
                    ),
                    prefixIconConstraints: const BoxConstraints(minWidth: 48),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(18),
                      borderSide: BorderSide(
                        color:
                            isDark ? AuthTokens.lineDark : AuthTokens.lineLight,
                        width: 2.0,
                      ),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(18),
                      borderSide: BorderSide(
                        color: AuthTokens.brand(context),
                        width: 2.0,
                      ),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 18),

              // Field 2: Parol
              Text(
                'Parol',
                style: TextStyle(
                  fontFamily: 'Nunito',
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: AuthTokens.ink(context),
                ),
              ),
              const SizedBox(height: 8),
              SizedBox(
                height: inputHeight,
                child: TextFormField(
                  controller: _passwordController,
                  focusNode: _passwordFocusNode,
                  obscureText: !_isPasswordVisible,
                  autofillHints: const [AutofillHints.password],
                  style: TextStyle(
                    fontFamily: 'Nunito',
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AuthTokens.ink(context),
                  ),
                  decoration: InputDecoration(
                    hintText: 'Parolingizni kiriting',
                    hintStyle: TextStyle(
                      fontFamily: 'Nunito',
                      fontSize: 15,
                      fontWeight: FontWeight.w500,
                      color: AuthTokens.mute(context).withOpacity(0.7),
                    ),
                    filled: true,
                    fillColor: AuthTokens.field(context),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16),
                    prefixIcon: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      child: Icon(
                        Icons.lock_outline_rounded,
                        color: _passwordFocusNode.hasFocus
                            ? AuthTokens.brand(context)
                            : AuthTokens.mute(context),
                        size: 22,
                      ),
                    ),
                    prefixIconConstraints: const BoxConstraints(minWidth: 48),
                    suffixIcon: SizedBox(
                      width: 48,
                      height: 48,
                      child: IconButton(
                        icon: Icon(
                          _isPasswordVisible
                              ? Icons.visibility_outlined
                              : Icons.visibility_off_outlined,
                          color: AuthTokens.mute(context),
                          size: 20,
                        ),
                        onPressed: () {
                          setState(() {
                            _isPasswordVisible = !_isPasswordVisible;
                          });
                        },
                      ),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(18),
                      borderSide: BorderSide(
                        color:
                            isDark ? AuthTokens.lineDark : AuthTokens.lineLight,
                        width: 2.0,
                      ),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(18),
                      borderSide: BorderSide(
                        color: AuthTokens.brand(context),
                        width: 2.0,
                      ),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 8),

              // Forgot password link
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  style: TextButton.styleFrom(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
                    minimumSize: const Size(48, 44),
                  ),
                  onPressed: () => context.push('/forgot-password'),
                  child: Text(
                    'Parolni unutdingizmi?',
                    style: TextStyle(
                      fontFamily: 'Nunito',
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: AuthTokens.brand(context),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 12),

              // Main Primary Button: Kirish →
              SizedBox(
                height: buttonHeight,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: _isSuccess
                        ? const LinearGradient(
                            colors: [Color(0xFF22C55E), Color(0xFF16A34A)])
                        : AuthTokens.brandGradient,
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: (_isSuccess
                                ? const Color(0xFF22C55E)
                                : AuthTokens.brandLight)
                            .withOpacity(0.38),
                        blurRadius: 28,
                        offset: const Offset(0, 12),
                      ),
                    ],
                  ),
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      backgroundColor: Colors.transparent,
                      shadowColor: Colors.transparent,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                    ),
                    onPressed: (_isLoading || _isSuccess) ? null : _handleLogin,
                    child: _isLoading
                        ? const SizedBox(
                            width: 22,
                            height: 22,
                            child: CircularProgressIndicator(
                              strokeWidth: 2.5,
                              valueColor:
                                  AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          )
                        : _isSuccess
                            ? const FittedBox(
                                fit: BoxFit.scaleDown,
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(Icons.check_circle_rounded,
                                        color: Colors.white, size: 22),
                                    SizedBox(width: 8),
                                    Text(
                                      'Xush kelibsiz!',
                                      style: TextStyle(
                                        fontFamily: 'Nunito',
                                        fontSize: 17,
                                        fontWeight: FontWeight.w800,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ],
                                ),
                              )
                            : const FittedBox(
                                fit: BoxFit.scaleDown,
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      'Kirish',
                                      style: TextStyle(
                                        fontFamily: 'Nunito',
                                        fontSize: 17,
                                        fontWeight: FontWeight.w800,
                                        color: Colors.white,
                                      ),
                                    ),
                                    SizedBox(width: 6),
                                    Text(
                                      '→',
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.w800,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                  ),
                ),
              ),

              const SizedBox(height: 22),

              // Divider "yoki davom eting"
              Row(
                children: [
                  Expanded(
                    child: Divider(
                      color:
                          isDark ? AuthTokens.lineDark : AuthTokens.lineLight,
                      thickness: 1.5,
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    child: Text(
                      'yoki davom eting',
                      style: TextStyle(
                        fontFamily: 'Nunito',
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AuthTokens.mute(context),
                      ),
                    ),
                  ),
                  Expanded(
                    child: Divider(
                      color:
                          isDark ? AuthTokens.lineDark : AuthTokens.lineLight,
                      thickness: 1.5,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 20),

              // Google Sign-In Button
              GoogleSignInButton(
                onFallbackPressed: _handleGoogleSignIn,
                isLoading: _isGoogleLoading,
                text: 'Google orqali kirish',
              ),
            ],
          ),
        ),
      ),
      bottomChild: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Wrap(
            alignment: WrapAlignment.center,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              Text(
                'Hisobingiz yo‘qmi? ',
                style: TextStyle(
                  fontFamily: 'Nunito',
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                  color: AuthTokens.mute(context),
                ),
              ),
              GestureDetector(
                onTap: () => context.go('/register'),
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Text(
                    'Ro‘yxatdan o‘tish',
                    style: TextStyle(
                      fontFamily: 'Nunito',
                      fontSize: 15,
                      fontWeight: FontWeight.w800,
                      color: AuthTokens.brand(context),
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          GestureDetector(
            onTap: () => context.push('/privacy-policy'),
            child: Text(
              'Maxfiylik siyosati',
              style: TextStyle(
                fontFamily: 'Nunito',
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: AuthTokens.mute(context),
                decoration: TextDecoration.underline,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
