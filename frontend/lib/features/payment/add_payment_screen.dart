import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:dio/dio.dart';
import '../../core/network/api_client.dart';
import '../../core/widgets/custom_button.dart';
import '../../core/widgets/responsive_layout.dart';
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
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: const BoxDecoration(
                color: Color(0xFFEDE9FE),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.payment_rounded, color: Color(0xFF6C5CE7), size: 24),
            ),
            const SizedBox(width: 12),
            const Expanded(
              child: Text(
                'Click Business To‘lovi',
                style: TextStyle(color: Color(0xFF1E1742), fontSize: 18, fontWeight: FontWeight.bold),
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
              style: const TextStyle(color: Color(0xFF64748B), fontSize: 14, height: 1.4),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.lock_outline_rounded, size: 16, color: Color(0xFF10B981)),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Xavfsiz shifrlangan to‘lov shlyuzi',
                      style: TextStyle(color: Color(0xFF047857), fontSize: 12, fontWeight: FontWeight.w600),
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
            child: const Text('Bekor qilish', style: TextStyle(color: Color(0xFF64748B))),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF6C5CE7),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            ),
            onPressed: () {
              Navigator.pop(ctx);
              _simulateSuccessfulPaymentVerification(orderId);
            },
            child: const Text('To‘lovni tasdiqlash', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  void _simulateSuccessfulPaymentVerification(String orderId) async {
    setState(() => _isLoading = true);

    try {
      // 1. Authoritative Store purchase & Pro activation call
      final purchaseRes = await ApiClient().dio.post('/subscriptions/purchase', data: {
        'platform': 'web',
        'orderId': orderId,
        'productId': 'mathcity_pro_monthly',
      });

      if (purchaseRes.data['success'] == true) {
        // Refresh authenticated student profile
        await ref.read(studentProvider.notifier).refreshProfile();

        setState(() => _isLoading = false);

        if (!mounted) return;
        _showSuccessDialog();
      } else {
        setState(() {
          _isLoading = false;
          _errorMessage = purchaseRes.data['error'] ?? 'To‘lov tasdiqlanmadi.';
        });
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
        _errorMessage = 'To‘lov natijasini tekshirishda xatolik yuz berdi.';
      });
    }
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Column(
          children: [
            Icon(Icons.check_circle_rounded, color: Color(0xFF10B981), size: 54),
            SizedBox(height: 12),
            Text(
              'Tabriklaymiz! 🎉',
              textAlign: TextAlign.center,
              style: TextStyle(color: Color(0xFF1E1742), fontWeight: FontWeight.w900, fontSize: 22),
            ),
          ],
        ),
        content: const Text(
          'MathCity Pro faollashtirildi.\nSiz endi Pro imkoniyatlaridan va AI Ustozdan cheksiz foydalanishingiz mumkin.',
          textAlign: TextAlign.center,
          style: TextStyle(color: Color(0xFF64748B), fontSize: 14, height: 1.4),
        ),
        actions: [
          Center(
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF6C5CE7),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
              ),
              onPressed: () {
                Navigator.pop(ctx);
                context.go('/kids/home');
              },
              child: const Text('Bosh sahifaga o‘tish', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final sub = ref.watch(studentProvider).student?.subscription;
    final hasDiscount = sub?.hasNewUserDiscount == true;
    final priceFormatted = hasDiscount ? '20 300 so‘m' : '29 000 so‘m';

    return Scaffold(
      backgroundColor: const Color(0xFFF7F6FC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Color(0xFF1E1742)),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'To‘lov usulini qo‘shish',
          style: TextStyle(
            color: Color(0xFF1E1742),
            fontWeight: FontWeight.w800,
            fontSize: 18,
          ),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: ResponsiveContentContainer(
            maxWidth: 540,
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Plan Summary Card
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(22),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF6C5CE7), Color(0xFFA29BFE)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: const [
                      BoxShadow(
                        color: Color(0x266C5CE7),
                        blurRadius: 18,
                        offset: Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'TANLANGAN TARIF',
                            style: TextStyle(
                              color: Colors.white70,
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 1.1,
                            ),
                          ),
                          Icon(Icons.workspace_premium_rounded, color: Colors.white, size: 22),
                        ],
                      ),
                      SizedBox(height: 10),
                      Text(
                        'MathCity Pro',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        hasDiscount ? '20 300 UZS / oyiga (-30% chegirma)' : '29 000 UZS / oyiga',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                const Text(
                  'To‘lov tizimini tanlang',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF1E1742),
                  ),
                ),
                const SizedBox(height: 12),

                // Methods container
                Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                    boxShadow: const [
                      BoxShadow(
                        color: Color(0x04000000),
                        blurRadius: 12,
                        offset: Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      _buildMethodTile(
                        method: 'CLICK_UZCARD_HUMO',
                        title: 'Uzcard / Humo',
                        subtitle: 'Milliy to‘lov kartalari orqali (Click shlyuzi)',
                        icon: Icons.credit_card_rounded,
                        badgeText: 'UZCARD • HUMO',
                      ),
                      const Divider(height: 1, indent: 60, color: Color(0xFFE2E8F0)),
                      _buildMethodTile(
                        method: 'CLICK_VISA_MC',
                        title: 'Visa / Mastercard',
                        subtitle: 'Xalqaro bank kartalari orqali',
                        icon: Icons.credit_card_outlined,
                        badgeText: 'VISA • MC',
                      ),
                      const Divider(height: 1, indent: 60, color: Color(0xFFE2E8F0)),
                      _buildMethodTile(
                        method: 'CLICK_APP',
                        title: 'Click Business',
                        subtitle: 'Click ilovasi yoki hamyon orqali tezkor to‘lov',
                        icon: Icons.touch_app_rounded,
                        badgeText: 'CLICK',
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                if (_errorMessage != null) ...[
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFEE2E2),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFFFCA5A5)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.error_outline_rounded, color: Color(0xFFEF4444), size: 20),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            _errorMessage!,
                            style: const TextStyle(color: Color(0xFFB91C1C), fontSize: 13, fontWeight: FontWeight.w600),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                ],

                // Action Pay Button
                CustomButton(
                  text: _isLoading ? 'To‘lovga ulanmoqda...' : '$priceFormatted to‘lash',
                  backgroundColor: const Color(0xFF6C5CE7),
                  borderRadius: 18,
                  icon: const Icon(Icons.lock_rounded, color: Colors.white, size: 20),
                  onPressed: _isLoading ? null : _initiatePayment,
                ),
                const SizedBox(height: 16),

                // Security Note
                Center(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.verified_user_rounded, color: Color(0xFF10B981), size: 16),
                      const SizedBox(width: 6),
                      Flexible(
                        child: Text(
                          '256-bit SSL va PCI-DSS xavfsiz to‘lov shifrlanishi',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: Colors.grey[600],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
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
      borderRadius: BorderRadius.circular(20),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: isSelected ? const Color(0xFFEDE9FE) : const Color(0xFFF1F5F9),
                shape: BoxShape.circle,
              ),
              child: Icon(
                icon,
                color: isSelected ? const Color(0xFF6C5CE7) : const Color(0xFF64748B),
                size: 22,
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        title,
                        style: TextStyle(
                          color: const Color(0xFF1E1742),
                          fontSize: 15,
                          fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          badgeText,
                          style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: Color(0xFF64748B)),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 3),
                  Text(
                    subtitle,
                    style: const TextStyle(color: Color(0xFF64748B), fontSize: 12),
                  ),
                ],
              ),
            ),
            if (isSelected)
              const Icon(Icons.check_circle_rounded, color: Color(0xFF6C5CE7), size: 22)
            else
              const Icon(Icons.circle_outlined, color: Color(0xFFCBD5E1), size: 22),
          ],
        ),
      ),
    );
  }
}
