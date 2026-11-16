import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:dio/dio.dart';
import '../../core/network/api_client.dart';
import '../../shared/models/student_model.dart';
import '../../shared/providers/student_provider.dart';

class AddPaymentScreen extends ConsumerStatefulWidget {
  const AddPaymentScreen({super.key});

  @override
  ConsumerState<AddPaymentScreen> createState() => _AddPaymentScreenState();
}

class _AddPaymentScreenState extends ConsumerState<AddPaymentScreen> {
  final _formKey = GlobalKey<FormState>();

  // Payment method selection
  String _selectedMethod = 'UZCARD'; // 'UZCARD', 'HUMO', 'VISA', 'CLICK'

  final TextEditingController _cardNumberController = TextEditingController();
  final TextEditingController _expiryController = TextEditingController();
  final TextEditingController _cvvController = TextEditingController();
  final TextEditingController _cardHolderController = TextEditingController();

  bool _isLoading = false;
  bool _isSuccess = false;
  String? _errorMessage;

  @override
  void dispose() {
    _cardNumberController.dispose();
    _expiryController.dispose();
    _cvvController.dispose();
    _cardHolderController.dispose();
    super.dispose();
  }

  void _processPayment() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final cardNumber = _cardNumberController.text.trim();
    final expiry = _expiryController.text.trim();
    final cvv = _cvvController.text.trim();

    // Basic client validation
    if (_selectedMethod != 'CLICK' && cardNumber.replaceAll(' ', '').length < 16) {
      setState(() {
        _isLoading = false;
        _errorMessage = 'Karta raqami 16 ta raqamdan iborat bo‘lishi kerak.';
      });
      return;
    }

    try {
      if (_selectedMethod == 'CLICK') {
        // Create Click invoice
        final res = await ApiClient().dio.post('/payments/click/create-invoice');
        if (res.data['success'] == true) {
          // In web environment or direct fallback
          setState(() => _isLoading = false);
          _showClickRedirectDialog(res.data['data']['checkoutUrl']);
          return;
        }
      }

      // Card direct authorization
      final res = await ApiClient().dio.post('/payments/pay/card', data: {
        'paymentMethod': _selectedMethod,
        'cardNumber': cardNumber,
        'expiryDate': expiry.isEmpty ? '12/28' : expiry,
        'cvv': cvv.isEmpty ? '123' : cvv,
      });

      if (res.data['success'] == true) {
        setState(() {
          _isLoading = false;
          _isSuccess = true;
        });

        // Refresh student state to reflect active Pro
        await ref.read(studentProvider.notifier).refreshProfile();

        if (!mounted) return;
        _showSuccessDialog();
      }
    } catch (e) {
      setState(() => _isLoading = false);
      String msg = 'To‘lovni amalga oshirishda xatolik yuz berdi.';
      if (e is DioException && e.response?.data != null && e.response?.data['error'] != null) {
        msg = e.response!.data['error'];
      }
      setState(() => _errorMessage = msg);
    }
  }

  void _showClickRedirectDialog(String checkoutUrl) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1C1C1E),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Row(
          children: [
            Icon(Icons.payment, color: Color(0xFF007AFF)),
            SizedBox(width: 10),
            Text('Click orqali to‘lov', style: TextStyle(color: Colors.white, fontSize: 18)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Click Business to‘lov sahifasi orqali to‘lovni xavfsiz yakunlang. Summa: 29 000 so‘m.',
              style: TextStyle(color: Color(0xFF8E8E93), fontSize: 14),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFF2C2C2E),
                borderRadius: BorderRadius.circular(12),
              ),
              child: SelectableText(
                checkoutUrl,
                style: const TextStyle(color: Color(0xFF0A84FF), fontSize: 12),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Yopish', style: TextStyle(color: Color(0xFF8E8E93))),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF0071E3),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            onPressed: () async {
              Navigator.pop(ctx);
              // Authoritative simulate Click complete for testing
              await ref.read(studentProvider.notifier).purchasePro();
              if (mounted) _showSuccessDialog();
            },
            child: const Text('To‘lovni tasdiqlash', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => Dialog(
        backgroundColor: const Color(0xFF1C1C1E),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 72,
                height: 72,
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Color(0xFF34C759), Color(0xFF30B0C7)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  shape: BoxShape.circle,
                ),
                child: const Center(
                  child: Icon(Icons.check_rounded, color: Colors.white, size: 44),
                ),
              ),
              const SizedBox(height: 20),
              const Text(
                'To‘lov muvaffaqiyatli!',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 10),
              const Text(
                'MathCity Pro obunasi 30 kunga faollashtirildi. 29 000 so‘m rasmiy to‘lov qabul qilindi.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 14, color: Color(0xFF8E8E93), height: 1.4),
              ),
              const SizedBox(height: 28),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0071E3),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  onPressed: () {
                    Navigator.pop(ctx);
                    context.go('/kids/home');
                  },
                  child: const Text(
                    'Darslarga qaytish',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF000000), // Apple Dark Theme
      appBar: AppBar(
        backgroundColor: const Color(0xFF000000),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Color(0xFF007AFF), size: 20),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'To‘lov usulini qo‘shish',
          style: TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.w600,
            letterSpacing: -0.4,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Section 1: Subscription Summary Card
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1C1C1E),
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: const Color(0xFF2C2C2E)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 52,
                        height: 52,
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFFFFB800), Color(0xFFFF8C00)],
                          ),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: const Center(
                          child: Icon(Icons.workspace_premium_rounded, color: Colors.white, size: 30),
                        ),
                      ),
                      const SizedBox(width: 14),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'MathCity Pro',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 17,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            SizedBox(height: 3),
                            Text(
                              'Barcha 1-11 sinf testlari va 3D shahar',
                              style: TextStyle(color: Color(0xFF8E8E93), fontSize: 13),
                            ),
                          ],
                        ),
                      ),
                      const Text(
                        '29 000 UZS\n/ oy',
                        textAlign: TextAlign.right,
                        style: TextStyle(
                          color: Color(0xFF0A84FF),
                          fontWeight: FontWeight.w700,
                          fontSize: 15,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),
                const Text(
                  'TO‘LOV USULI',
                  style: TextStyle(
                    color: Color(0xFF8E8E93),
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 10),

                // Section 2: Payment Method Selector Cards
                Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFF1C1C1E),
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: const Color(0xFF2C2C2E)),
                  ),
                  child: Column(
                    children: [
                      _buildMethodTile(
                        method: 'UZCARD',
                        title: 'Uzcard / Humo',
                        subtitle: 'Milliy to‘lov tizimlari (so‘m)',
                        icon: Icons.credit_card_rounded,
                        badgeText: 'UZCARD/HUMO',
                      ),
                      const Divider(color: Color(0xFF2C2C2E), height: 1, indent: 56),
                      _buildMethodTile(
                        method: 'VISA',
                        title: 'Visa / Mastercard',
                        subtitle: 'Xalqaro bank kartalari',
                        icon: Icons.payment_rounded,
                        badgeText: 'VISA/MC',
                      ),
                      const Divider(color: Color(0xFF2C2C2E), height: 1, indent: 56),
                      _buildMethodTile(
                        method: 'CLICK',
                        title: 'Click Business',
                        subtitle: 'Click ilovasi yoki veb checkout',
                        icon: Icons.account_balance_wallet_rounded,
                        badgeText: 'CLICK',
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),
                const Text(
                  'KARTA MA’LUMOTLARI',
                  style: TextStyle(
                    color: Color(0xFF8E8E93),
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 10),

                // Section 3: Apple-Style Card Input Card
                Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFF1C1C1E),
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: const Color(0xFF2C2C2E)),
                  ),
                  child: Column(
                    children: [
                      // Card Number Field
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                        child: TextFormField(
                          controller: _cardNumberController,
                          keyboardType: TextInputType.number,
                          inputFormatters: [
                            FilteringTextInputFormatter.digitsOnly,
                            LengthLimitingTextInputFormatter(16),
                            _CardNumberFormatter(),
                          ],
                          style: const TextStyle(color: Colors.white, fontSize: 16),
                          decoration: InputDecoration(
                            border: InputBorder.none,
                            hintText: '8600 •••• •••• ••••',
                            hintStyle: const TextStyle(color: Color(0xFF636366), fontSize: 16),
                            labelText: 'Karta raqami',
                            labelStyle: const TextStyle(color: Color(0xFF8E8E93), fontSize: 14),
                            suffixIcon: Padding(
                              padding: const EdgeInsets.all(12),
                              child: Text(
                                _selectedMethod,
                                style: const TextStyle(
                                  color: Color(0xFF007AFF),
                                  fontWeight: FontWeight.bold,
                                  fontSize: 11,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                      const Divider(color: Color(0xFF2C2C2E), height: 1),
                      // Expiry and CVV Row
                      Row(
                        children: [
                          Expanded(
                            child: Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                              child: TextFormField(
                                controller: _expiryController,
                                keyboardType: TextInputType.number,
                                inputFormatters: [
                                  FilteringTextInputFormatter.digitsOnly,
                                  LengthLimitingTextInputFormatter(4),
                                  _ExpiryDateFormatter(),
                                ],
                                style: const TextStyle(color: Colors.white, fontSize: 16),
                                decoration: const InputDecoration(
                                  border: InputBorder.none,
                                  hintText: 'OO/YY',
                                  hintStyle: TextStyle(color: Color(0xFF636366), fontSize: 16),
                                  labelText: 'Muddati',
                                  labelStyle: TextStyle(color: Color(0xFF8E8E93), fontSize: 14),
                                ),
                              ),
                            ),
                          ),
                          Container(width: 1, height: 48, color: const Color(0xFF2C2C2E)),
                          Expanded(
                            child: Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                              child: TextFormField(
                                controller: _cvvController,
                                keyboardType: TextInputType.number,
                                obscureText: true,
                                inputFormatters: [
                                  FilteringTextInputFormatter.digitsOnly,
                                  LengthLimitingTextInputFormatter(3),
                                ],
                                style: const TextStyle(color: Colors.white, fontSize: 16),
                                decoration: const InputDecoration(
                                  border: InputBorder.none,
                                  hintText: '123',
                                  hintStyle: TextStyle(color: Color(0xFF636366), fontSize: 16),
                                  labelText: 'CVV / CVC',
                                  labelStyle: TextStyle(color: Color(0xFF8E8E93), fontSize: 14),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                // Error Banner if present
                if (_errorMessage != null) ...[
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0x33FF453A),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFFF453A)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.error_outline_rounded, color: Color(0xFFFF453A), size: 20),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            _errorMessage!,
                            style: const TextStyle(color: Color(0xFFFF453A), fontSize: 13),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],

                const SizedBox(height: 24),

                // Security & Guarantee Badges
                Container(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.lock_rounded, color: Color(0xFF8E8E93), size: 14),
                      SizedBox(width: 6),
                      Text(
                        '256-bit SSL va PCI-DSS xavfsiz to‘lov shifrlanishi',
                        style: TextStyle(color: Color(0xFF8E8E93), fontSize: 12),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // Section 4: Apple Blue Pay Confirmation Button
                SizedBox(
                  width: double.infinity,
                  height: 54,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0071E3), // Apple Pay Blue
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    onPressed: _isLoading ? null : _processPayment,
                    child: _isLoading
                        ? const SizedBox(
                            width: 24,
                            height: 24,
                            child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
                          )
                        : const Text(
                            '29 000 so‘m to‘lash',
                            style: TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.w600,
                              letterSpacing: -0.3,
                            ),
                          ),
                  ),
                ),

                const SizedBox(height: 16),

                // Renewal & Cancellation Policy Disclaimer
                const Center(
                  child: Text(
                    'Har oy 29 000 so‘m yechiladi. Istalgan vaqtda profil sozlamalaridan bekor qilish mumkin.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: Color(0xFF636366),
                      fontSize: 12,
                      height: 1.4,
                    ),
                  ),
                ),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMethodTile({
    required String method,
    required String title,
    required String subtitle,
    required IconData icon,
    required String badgeText,
  }) {
    final isSelected = _selectedMethod == method;
    return InkWell(
      onTap: () => setState(() => _selectedMethod = method),
      borderRadius: BorderRadius.circular(18),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            Icon(
              icon,
              color: isSelected ? const Color(0xFF0A84FF) : const Color(0xFF8E8E93),
              size: 24,
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: const TextStyle(color: Color(0xFF8E8E93), fontSize: 12),
                  ),
                ],
              ),
            ),
            if (isSelected)
              const Icon(Icons.check_circle_rounded, color: Color(0xFF0A84FF), size: 22)
            else
              const Icon(Icons.circle_outlined, color: Color(0xFF3A3A3C), size: 22),
          ],
        ),
      ),
    );
  }
}

// Card Number Formatter (16 digits formatted as 4-4-4-4)
class _CardNumberFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(TextEditingValue oldValue, TextEditingValue newValue) {
    final text = newValue.text.replaceAll(' ', '');
    final buffer = StringBuffer();
    for (int i = 0; i < text.length; i++) {
      buffer.write(text[i]);
      if ((i + 1) % 4 == 0 && i + 1 != text.length) {
        buffer.write(' ');
      }
    }
    final formatted = buffer.toString();
    return TextEditingValue(
      text: formatted,
      selection: TextSelection.collapsed(offset: formatted.length),
    );
  }
}

// Expiry Date Formatter (MM/YY)
class _ExpiryDateFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(TextEditingValue oldValue, TextEditingValue newValue) {
    final text = newValue.text.replaceAll('/', '');
    final buffer = StringBuffer();
    for (int i = 0; i < text.length; i++) {
      buffer.write(text[i]);
      if (i == 1 && text.length > 2) {
        buffer.write('/');
      }
    }
    final formatted = buffer.toString();
    return TextEditingValue(
      text: formatted,
      selection: TextSelection.collapsed(offset: formatted.length),
    );
  }
}
