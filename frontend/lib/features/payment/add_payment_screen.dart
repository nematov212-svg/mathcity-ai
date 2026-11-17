import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:dio/dio.dart';
import '../../core/network/api_client.dart';
import '../../shared/providers/student_provider.dart';

class AddPaymentScreen extends ConsumerStatefulWidget {
  const AddPaymentScreen({super.key});

  @override
  ConsumerState<AddPaymentScreen> createState() => _AddPaymentScreenState();
}

class _AddPaymentScreenState extends ConsumerState<AddPaymentScreen> {
  // Payment provider / method selection
  String _selectedMethod = 'CLICK_UZCARD_HUMO'; // 'CLICK_UZCARD_HUMO', 'CLICK_VISA_MC', 'CLICK_APP'

  bool _isLoading = false;
  String? _errorMessage;

  void _initiatePayment() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // 1. Create authoritative payment order on backend
      final res = await ApiClient().dio.post('/payments/create-order', data: {
        'paymentMethod': _selectedMethod,
      });

      if (res.data['success'] == true) {
        final data = res.data['data'];
        final orderId = data['orderId'] as String;
        final checkoutUrl = data['checkoutUrl'] as String;
        final isSandbox = data['isSandbox'] == true;

        setState(() {
          _isLoading = false;
        });

        // 2. Open certified Click checkout modal
        _showProviderCheckoutDialog(orderId, checkoutUrl, isSandbox);
      }
    } catch (e) {
      setState(() => _isLoading = false);
      String msg = 'To‘lov tizimiga ulanishda xatolik yuz berdi.';
      if (e is DioException && e.response?.data != null && e.response?.data['error'] != null) {
        msg = e.response!.data['error'];
      }
      setState(() => _errorMessage = msg);
    }
  }

  void _showProviderCheckoutDialog(String orderId, String checkoutUrl, bool isSandbox) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1C1C1E),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFF007AFF).withOpacity(0.15),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.payment_rounded, color: Color(0xFF007AFF), size: 24),
            ),
            const SizedBox(width: 12),
            const Expanded(
              child: Text(
                'Click Business To‘lovi',
                style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              isSandbox
                  ? 'To‘lov tizimi hozirda sinov rejimida. Rasmiy Click shlyuzi orqali 29 000 so‘m to‘lovni tasdiqlang.'
                  : 'To‘lovni yakunlash uchun Click Business rasmiy sertifikatlangan to‘lov sahifasiga o‘ting. Summa: 29 000 so‘m.',
              style: const TextStyle(color: Color(0xFF8E8E93), fontSize: 14, height: 1.4),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFF2C2C2E),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Row(
                children: [
                  const Icon(Icons.shield_rounded, color: Color(0xFF34C759), size: 20),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'Buyurtma raqami: $orderId',
                      style: const TextStyle(color: Color(0xFFEBEBF5), fontSize: 12, fontWeight: FontWeight.w500),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Bekor qilish', style: TextStyle(color: Color(0xFF8E8E93))),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF0071E3),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            ),
            onPressed: () async {
              Navigator.pop(ctx);
              _checkPaymentVerification(orderId);
            },
            child: const Text(
              'To‘lov holatini tekshirish',
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }

  void _checkPaymentVerification(String orderId) async {
    setState(() => _isLoading = true);

    try {
      final res = await ApiClient().dio.get('/payments/status/$orderId');
      setState(() => _isLoading = false);

      if (res.data['success'] == true) {
        final status = res.data['data']['status'];
        final isPro = res.data['data']['isProActive'] == true;

        if (status == 'PAID' && isPro) {
          // Refresh student state
          await ref.read(studentProvider.notifier).refreshProfile();
          if (mounted) _showSuccessDialog();
        } else if (status == 'FAILED') {
          setState(() {
            _errorMessage = 'Hisobingizda mablag‘ yetarli emas. MathCity Pro tarifini sotib olish uchun kartangizni to‘ldiring.';
          });
        } else {
          setState(() {
            _errorMessage = 'To‘lov hali tasdiqlanmadi yoki bekor qilindi. Iltimos, qayta urinib ko‘ring.';
          });
        }
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
        _errorMessage = 'To‘lov holatini tekshirishda xatolik yuz berdi.';
      });
    }
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
                width: 76,
                height: 76,
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Color(0xFF34C759), Color(0xFF30B0C7)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                    
                  shape: BoxShape.circle,
                ),

                child: const Center(
                  child: Icon(Icons.check_rounded, color: Colors.white, size: 48),
                ),
              ),
              const SizedBox(height: 20),
              const Text(
                'Tabriklaymiz!',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'MathCity Pro muvaffaqiyatli faollashtirildi. 29 000 so‘m to‘lov tasdiqlandi.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 14, color: Color(0xFF8E8E93), height: 1.4),
              ),
              const SizedBox(height: 26),
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
                            'Barcha 1-11 sinf darslari va +3 tanga mukofoti',
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
                'TO‘LOV TIZIMI',
                style: TextStyle(
                  color: Color(0xFF8E8E93),
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.5,
                ),
              ),
              const SizedBox(height: 10),

              // Section 2: Payment Provider Cards
              Container(
                decoration: BoxDecoration(
                  color: const Color(0xFF1C1C1E),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: const Color(0xFF2C2C2E)),
                ),
                child: Column(
                  children: [
                    _buildMethodTile(
                      method: 'CLICK_UZCARD_HUMO',
                      title: 'Uzcard / Humo',
                      subtitle: 'Click Business orqali milliy kartalar (so‘m)',
                      icon: Icons.credit_card_rounded,
                      badgeText: 'UZCARD/HUMO',
                    ),
                    const Divider(color: Color(0xFF2C2C2E), height: 1, indent: 56),
                    _buildMethodTile(
                      method: 'CLICK_VISA_MC',
                      title: 'Visa / Mastercard',
                      subtitle: 'Click orqali xalqaro to‘lov kartalari',
                      icon: Icons.payment_rounded,
                      badgeText: 'VISA/MC',
                    ),
                    const Divider(color: Color(0xFF2C2C2E), height: 1, indent: 56),
                    _buildMethodTile(
                      method: 'CLICK_APP',
                      title: 'Click Business',
                      subtitle: 'Click ilovasi yoki hamyon orqali',
                      icon: Icons.account_balance_wallet_rounded,
                      badgeText: 'CLICK',
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // Truthful security disclosure
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF1C1C1E),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFF2C2C2E)),
                ),
                child: const Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.lock_rounded, color: Color(0xFF34C759), size: 20),
                    SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '256-bit SSL va PCI-DSS xavfsiz to‘lov shifrlanishi',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'To‘lov Click Business rasmiy sertifikatlangan shlyuzi orqali xavfsiz qabul qilinadi. Karta ma’lumotlari yoki CVV kodlari MathCity AI serverlarida saqlanmaydi.',
                            style: TextStyle(
                              color: Color(0xFF8E8E93),
                              fontSize: 12,
                              height: 1.45,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              // Error Banner if present
              if (_errorMessage != null) ...[
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0x33FF453A),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: const Color(0xFFFF453A)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.error_outline_rounded, color: Color(0xFFFF453A), size: 22),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          _errorMessage!,
                          style: const TextStyle(color: Color(0xFFFF453A), fontSize: 13, height: 1.3),
                        ),
                      ),
                    ],
                  ),
                ),
              ],

              const SizedBox(height: 28),

              // Action Pay Button
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
                  onPressed: _isLoading ? null : _initiatePayment,
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
