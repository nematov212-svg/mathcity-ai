import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/auth_design_tokens.dart';
import '../../core/widgets/responsive_auth_shell.dart';
import '../../shared/providers/student_provider.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen>
    with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _loginController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  final _nameFocusNode = FocusNode();
  final _loginFocusNode = FocusNode();
  final _passwordFocusNode = FocusNode();
  final _confirmPasswordFocusNode = FocusNode();

  bool _isPasswordVisible = false;
  bool _isConfirmPasswordVisible = false;
  bool _isLoading = false;
  bool _isSuccess = false;
  String? _errorMessage;

  late final AnimationController _shakeCtrl;
  late final Animation<double> _shakeAnimation;

  @override
  void initState() {
    super.initState();
    _nameController.addListener(() => setState(() {}));
    _loginController.addListener(() => setState(() {}));
    _passwordController.addListener(() => setState(() {}));
    _confirmPasswordController.addListener(() => setState(() {}));

    _nameFocusNode.addListener(() => setState(() {}));
    _loginFocusNode.addListener(() => setState(() {}));
    _passwordFocusNode.addListener(() => setState(() {}));
    _confirmPasswordFocusNode.addListener(() => setState(() {}));

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
    _nameController.dispose();
    _loginController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _nameFocusNode.dispose();
    _loginFocusNode.dispose();
    _passwordFocusNode.dispose();
    _confirmPasswordFocusNode.dispose();
    _shakeCtrl.dispose();
    super.dispose();
  }

  void _triggerShake() {
    _shakeCtrl.forward(from: 0.0);
  }

  int _calculatePasswordStrength(String pass) {
    if (pass.isEmpty) return 0;
    int score = 0;
    if (pass.length >= 8) score++;
    if (pass.contains(RegExp(r'[A-Z]')) && pass.contains(RegExp(r'[a-z]'))) {
      score++;
    }
    if (pass.contains(RegExp(r'[0-9]'))) score++;
    if (pass.contains(RegExp(r'[^A-Za-z0-9]')) || pass.length >= 12) score++;
    return score.clamp(1, 4);
  }

  String _getPasswordStrengthLabel(int score, String pass) {
    if (pass.isEmpty) return 'Parol kamida 8 ta belgidan iborat bo‘lsin.';
    switch (score) {
      case 1:
        return 'Zaif parol';
      case 2:
        return 'O‘rtacha parol';
      case 3:
        return 'Yaxshi parol';
      case 4:
        return 'Juda kuchli parol!';
      default:
        return 'Parol kamida 8 ta belgidan iborat bo‘lsin.';
    }
  }

  Color _getPasswordStrengthColor(int score) {
    switch (score) {
      case 1:
        return const Color(0xFFE5484D); // Red
      case 2:
        return const Color(0xFFF59E0B); // Amber
      case 3:
        return const Color(0xFF84CC16); // Light green
      case 4:
        return const Color(0xFF22C55E); // Green
      default:
        return Colors.transparent;
    }
  }

  Future<void> _handleRegister() async {
    if (_isLoading || _isSuccess) return;

    final name = _nameController.text.trim();
    final loginOrEmail = _loginController.text.trim();
    final password = _passwordController.text;
    final confirmPassword = _confirmPasswordController.text;

    if (name.isEmpty) {
      setState(() => _errorMessage = 'Ismingizni kiriting.');
      _triggerShake();
      return;
    }

    if (name.length < 2) {
      setState(() =>
          _errorMessage = 'Ism kamida 2 ta harfdan iborat bo‘lishi kerak.');
      _triggerShake();
      return;
    }

    if (loginOrEmail.isEmpty) {
      setState(() => _errorMessage = 'Login yoki emailingizni kiriting.');
      _triggerShake();
      return;
    }

    if (loginOrEmail.contains('@')) {
      final emailRegex = RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$');
      if (!emailRegex.hasMatch(loginOrEmail)) {
        setState(() => _errorMessage =
            'Email manzili noto‘g‘ri kiritildi (masalan: foydalanuvchi@mail.uz).');
        _triggerShake();
        return;
      }
    } else {
      if (loginOrEmail.length < 4) {
        setState(() => _errorMessage = 'Kamida 4 ta belgi kiriting.');
        _triggerShake();
        return;
      }
      if (loginOrEmail.length > 20) {
        setState(() => _errorMessage =
            'Foydalanuvchi nomi 20 ta belgidan oshmasligi kerak.');
        _triggerShake();
        return;
      }
      final loginRegex = RegExp(r'^[a-zA-Z0-9_.]+$');
      if (!loginRegex.hasMatch(loginOrEmail)) {
        setState(() => _errorMessage =
            'Login faqat lotin harflari, raqamlar, pastki chiziq va nuqtadan iborat bo‘lsin.');
        _triggerShake();
        return;
      }
      if (!RegExp(r'[a-zA-Z]').hasMatch(loginOrEmail)) {
        setState(
            () => _errorMessage = 'Loginda kamida bitta harf bo‘lishi kerak.');
        _triggerShake();
        return;
      }
    }

    if (password.isEmpty) {
      setState(() => _errorMessage = 'Yangi parol kiriting.');
      _triggerShake();
      return;
    }

    if (password.length < 8) {
      setState(
          () => _errorMessage = 'Parol kamida 8 ta belgidan iborat bo‘lsin.');
      _triggerShake();
      return;
    }

    if (password != confirmPassword) {
      setState(() => _errorMessage = 'Parollar bir xil emas.');
      _triggerShake();
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final result = await ref.read(studentProvider.notifier).registerStudent(
            name: name,
            loginOrEmail: loginOrEmail,
            password: password,
            confirmPassword: confirmPassword,
          );

      if (!mounted) return;

      if (result.success && result.student != null) {
        setState(() => _isSuccess = true);
        await Future.delayed(const Duration(milliseconds: 600));
        if (!mounted) return;
        context.go('/onboarding/intro');
      } else {
        setState(() {
          _errorMessage =
              result.errorMessage ?? 'Ro‘yxatdan o‘tishda xatolik yuz berdi.';
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

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isTablet = screenWidth >= 600 && screenWidth < 1024;
    final isDark = AuthTokens.isDark(context);

    final inputHeight = isTablet ? 60.0 : 56.0;
    final buttonHeight = isTablet ? 62.0 : 58.0;

    final password = _passwordController.text;
    final confirmPassword = _confirmPasswordController.text;
    final passStrength = _calculatePasswordStrength(password);
    final strengthLabel = _getPasswordStrengthLabel(passStrength, password);
    final strengthColor = _getPasswordStrengthColor(passStrength);

    final isNameValid = _nameController.text.trim().length >= 2;
    final isLoginValid = _loginController.text.trim().length >= 3;
    final isConfirmPassMatch =
        confirmPassword.isNotEmpty && confirmPassword == password;
    final isConfirmPassMismatch =
        confirmPassword.isNotEmpty && confirmPassword != password;

    return ResponsiveAuthShell(
      title: 'Yangi hisob yarating',
      subtitle: 'O‘rganing, tangalar yig‘ing va shahringizni quring.',
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
              // Error banner if any
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

              // Field 1: Ismingiz
              Text(
                'Ismingiz',
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
                  controller: _nameController,
                  focusNode: _nameFocusNode,
                  keyboardType: TextInputType.name,
                  textCapitalization: TextCapitalization.words,
                  autofillHints: const [AutofillHints.name],
                  style: TextStyle(
                    fontFamily: 'Nunito',
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AuthTokens.ink(context),
                  ),
                  decoration: InputDecoration(
                    hintText: 'Ismingizni kiriting',
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
                        color: _nameFocusNode.hasFocus
                            ? AuthTokens.brand(context)
                            : AuthTokens.mute(context),
                        size: 22,
                      ),
                    ),
                    prefixIconConstraints: const BoxConstraints(minWidth: 48),
                    suffixIcon: isNameValid
                        ? const Padding(
                            padding: EdgeInsets.only(right: 14),
                            child: Icon(
                              Icons.check_circle_rounded,
                              color: Color(0xFF22C55E),
                              size: 22,
                            ),
                          )
                        : null,
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(18),
                      borderSide: BorderSide(
                        color: isNameValid
                            ? const Color(0xFF22C55E).withOpacity(0.6)
                            : (isDark
                                ? AuthTokens.lineDark
                                : AuthTokens.lineLight),
                        width: 2.0,
                      ),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(18),
                      borderSide: BorderSide(
                        color: isNameValid
                            ? const Color(0xFF22C55E)
                            : AuthTokens.brand(context),
                        width: 2.0,
                      ),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // Field 2: Login yoki email
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
                  controller: _loginController,
                  focusNode: _loginFocusNode,
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
                        Icons.alternate_email_rounded,
                        color: _loginFocusNode.hasFocus
                            ? AuthTokens.brand(context)
                            : AuthTokens.mute(context),
                        size: 22,
                      ),
                    ),
                    prefixIconConstraints: const BoxConstraints(minWidth: 48),
                    suffixIcon: isLoginValid
                        ? const Padding(
                            padding: EdgeInsets.only(right: 14),
                            child: Icon(
                              Icons.check_circle_rounded,
                              color: Color(0xFF22C55E),
                              size: 22,
                            ),
                          )
                        : null,
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(18),
                      borderSide: BorderSide(
                        color: isLoginValid
                            ? const Color(0xFF22C55E).withOpacity(0.6)
                            : (isDark
                                ? AuthTokens.lineDark
                                : AuthTokens.lineLight),
                        width: 2.0,
                      ),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(18),
                      borderSide: BorderSide(
                        color: isLoginValid
                            ? const Color(0xFF22C55E)
                            : AuthTokens.brand(context),
                        width: 2.0,
                      ),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // Field 3: Parol
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
                  autofillHints: const [AutofillHints.newPassword],
                  style: TextStyle(
                    fontFamily: 'Nunito',
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AuthTokens.ink(context),
                  ),
                  decoration: InputDecoration(
                    hintText: 'Yangi parol yarating',
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

              // 4-Bar Password Strength Indicator (6px height, gap 6)
              Row(
                children: List.generate(4, (index) {
                  final isFilled = index < passStrength;
                  return Expanded(
                    child: Container(
                      height: 6,
                      margin: EdgeInsets.only(
                        left: index == 0 ? 0 : 3,
                        right: index == 3 ? 0 : 3,
                      ),
                      decoration: BoxDecoration(
                        color: isFilled
                            ? strengthColor
                            : (isDark
                                ? AuthTokens.lineDark
                                : AuthTokens.lineLight),
                        borderRadius: BorderRadius.circular(3),
                      ),
                    ),
                  );
                }),
              ),

              const SizedBox(height: 16),

              // Field 4: Parolni tasdiqlang
              Text(
                'Parolni tasdiqlang',
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
                  controller: _confirmPasswordController,
                  focusNode: _confirmPasswordFocusNode,
                  obscureText: !_isConfirmPasswordVisible,
                  autofillHints: const [AutofillHints.newPassword],
                  style: TextStyle(
                    fontFamily: 'Nunito',
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AuthTokens.ink(context),
                  ),
                  decoration: InputDecoration(
                    hintText: 'Parolni qayta kiriting',
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
                        Icons.lock_reset_rounded,
                        color: _confirmPasswordFocusNode.hasFocus
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
                          _isConfirmPasswordVisible
                              ? Icons.visibility_outlined
                              : Icons.visibility_off_outlined,
                          color: AuthTokens.mute(context),
                          size: 20,
                        ),
                        onPressed: () {
                          setState(() {
                            _isConfirmPasswordVisible =
                                !_isConfirmPasswordVisible;
                          });
                        },
                      ),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(18),
                      borderSide: BorderSide(
                        color: isConfirmPassMatch
                            ? const Color(0xFF22C55E)
                            : (isConfirmPassMismatch
                                ? const Color(0xFFE5484D)
                                : (isDark
                                    ? AuthTokens.lineDark
                                    : AuthTokens.lineLight)),
                        width: 2.0,
                      ),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(18),
                      borderSide: BorderSide(
                        color: isConfirmPassMatch
                            ? const Color(0xFF22C55E)
                            : (isConfirmPassMismatch
                                ? const Color(0xFFE5484D)
                                : AuthTokens.brand(context)),
                        width: 2.0,
                      ),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 8),

              // Helper / Strength Hint Text (Matches: 'Parol kamida 8 ta belgidan iborat bo‘lsin.')
              Text(
                strengthLabel,
                style: TextStyle(
                  fontFamily: 'Nunito',
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: password.isEmpty
                      ? AuthTokens.mute(context)
                      : strengthColor,
                ),
              ),

              const SizedBox(height: 20),

              // Main Primary Button: Hisob yaratish →
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
                    onPressed:
                        (_isLoading || _isSuccess) ? null : _handleRegister,
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
                                      'Hisob yaratildi!',
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
                                      'Hisob yaratish',
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
                'Hisobingiz bormi? ',
                style: TextStyle(
                  fontFamily: 'Nunito',
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                  color: AuthTokens.mute(context),
                ),
              ),
              GestureDetector(
                onTap: () => context.go('/login'),
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Text(
                    'Kirish',
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
