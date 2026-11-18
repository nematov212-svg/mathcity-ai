import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../core/constants/app_colors.dart';
import '../../core/network/api_client.dart';
import '../../core/widgets/custom_button.dart';
import '../../core/widgets/responsive_layout.dart';
import '../../shared/providers/student_provider.dart';

class TariflarScreen extends ConsumerStatefulWidget {
  const TariflarScreen({super.key});

  @override
  ConsumerState<TariflarScreen> createState() => _TariflarScreenState();
}

class _TariflarScreenState extends ConsumerState<TariflarScreen> {
  bool _isLoading = false;

  void _upgradeToPro() {
    context.push('/payment/add');
  }

  void _cancelSubscription() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Text(
          'Obunani bekor qilish',
          style: TextStyle(fontWeight: FontWeight.w800, color: Color(0xFF1E1742)),
        ),
        content: const Text(
          'Haqiqatan ham MathCity Pro obunasini bekor qilmoqchimisiz? To‘langan muddat yakuniga qadar barcha Pro imkoniyatlar saqlanadi.',
          style: TextStyle(color: Color(0xFF64748B), height: 1.4),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Yo‘q, qolsin', style: TextStyle(color: Color(0xFF64748B))),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFEF4444),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            ),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Ha, bekor qilinsin', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );

    if (confirm != true) return;

    setState(() => _isLoading = true);
    try {
      final res = await ApiClient().dio.post('/subscriptions/cancel');
      if (res.data['success'] == true) {
        await ref.read(studentProvider.notifier).refreshProfile();
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Obuna muvaffaqiyatli bekor qilindi.'),
            backgroundColor: Color(0xFF10B981),
          ),
        );
      }
    } catch (_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Obunani bekor qilishda xatolik yuz berdi.'),
          backgroundColor: Color(0xFFEF4444),
        ),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _restorePurchases() async {
    setState(() => _isLoading = true);
    final success = await ref.read(studentProvider.notifier).restorePurchases();
    setState(() => _isLoading = false);

    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          success ? 'Xaridlar muvaffaqiyatli tiklandi!' : 'Faol xaridlar topilmadi.',
        ),
        backgroundColor: success ? Colors.green : Colors.grey[800],
      ),
    );
  }

  String _formatDate(String? isoString) {
    if (isoString == null || isoString.isEmpty) return 'Belgilanmagan';
    try {
      final date = DateTime.parse(isoString);
      return DateFormat('d-MMMM, yyyy', 'uz').format(date);
    } catch (_) {
      return isoString;
    }
  }

  @override
  Widget build(BuildContext context) {
    final studentState = ref.watch(studentProvider);
    final student = studentState.student;
    final sub = student?.subscription;

    final isPro = sub?.isProActive ?? false;
    final trialDays = sub?.trialDaysRemaining ?? 30;
    final isTrialExpired = (sub?.status == 'FREE_TRIAL_EXPIRED');
    final trialExpiresAt = sub?.trialExpiresAt;
    final proExpiresAt = sub?.proExpiresAt;

    final planName = isPro
        ? 'MathCity Pro'
        : (isTrialExpired ? 'Bepul sinov tugagan' : '30 Kunlik Bepul Sinov');

    return Scaffold(
      backgroundColor: AppColors.kidsBackground,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.kidsDarkText),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Tariflar va Obuna',
          style: TextStyle(
            fontWeight: FontWeight.w800,
            fontSize: 18,
            color: AppColors.kidsDarkText,
          ),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: ResponsiveContentContainer(
            maxWidth: 640,
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Current Plan Banner
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    gradient: isPro
                        ? const LinearGradient(
                            colors: [Color(0xFF6C5CE7), Color(0xFFA29BFE)],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          )
                        : (isTrialExpired
                            ? const LinearGradient(
                                colors: [Color(0xFF64748B), Color(0xFF475569)],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              )
                            : const LinearGradient(
                                colors: [Color(0xFF2E7D32), Color(0xFF4CAF50)],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              )),
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: (isPro
                                ? const Color(0xFF6C5CE7)
                                : (isTrialExpired ? const Color(0xFF475569) : const Color(0xFF2E7D32)))
                            .withValues(alpha: 0.3),
                        blurRadius: 18,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.2),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              isPro
                                  ? 'FAOL OBUNA'
                                  : (isTrialExpired ? 'MUDDATI TUGAGAN' : 'BEPUL SINOV'),
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 11,
                                fontWeight: FontWeight.w800,
                                letterSpacing: 1.1,
                              ),
                            ),
                          ),
                          Icon(
                            isPro ? Icons.workspace_premium_rounded : Icons.timer_rounded,
                            color: Colors.white,
                            size: 26,
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      Text(
                        planName,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        isPro
                            ? 'Barcha ta’lim imkoniyatlari va AI Ustoz cheksiz ochiq'
                            : (isTrialExpired
                                ? '30 kunlik bepul sinov muddati tugadi.'
                                : 'Sinov muddatiga $trialDays kun qoldi. (Sinov tugashiga $trialDays kun)'),
                        style: TextStyle(
                          color: Colors.white.withValues(alpha: 0.9),
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        isPro
                            ? 'Amal qilish muddati: ${_formatDate(proExpiresAt)}'
                            : 'Sinov muddati tugaydi: ${_formatDate(trialExpiresAt)}',
                        style: TextStyle(
                          color: Colors.white.withValues(alpha: 0.8),
                          fontSize: 12,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Pro Plan Card
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(28),
                    border: Border.all(
                      color: isPro ? const Color(0xFF6C5CE7) : AppColors.kidsBorder,
                      width: isPro ? 2 : 1.5,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.kidsDarkText.withValues(alpha: 0.04),
                        blurRadius: 18,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'MathCity Pro',
                            style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w900,
                              color: AppColors.kidsDarkText,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFFFFF9E6),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: const Color(0xFFFFD54F)),
                            ),
                            child: const Text(
                              'TAVSIYA ETILADI',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF7A4800),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      const Row(
                        crossAxisAlignment: CrossAxisAlignment.baseline,
                        textBaseline: TextBaseline.alphabetic,
                        children: [
                          Text(
                            '29 000 so‘m',
                            style: TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFF6C5CE7),
                            ),
                          ),
                          SizedBox(width: 6),
                          Text(
                            '/ oyiga',
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                              color: AppColors.kidsSecondaryText,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      const Divider(height: 1, color: AppColors.kidsBorder),
                      const SizedBox(height: 20),

                      // Feature list
                      _buildFeatureItem(
                        Icons.check_circle_rounded,
                        '1-dan 11-sinfgacha barcha matematika darslari',
                      ),
                      const SizedBox(height: 12),
                      _buildFeatureItem(
                        Icons.check_circle_rounded,
                        'AI Ustoz — 24/7 cheksiz savollar va rasm/ovoz tahlili',
                      ),
                      const SizedBox(height: 12),
                      _buildFeatureItem(
                        Icons.check_circle_rounded,
                        '3D shaharda eksklyuziv bino va fazoviy rasadxonalar',
                      ),
                      const SizedBox(height: 12),
                      _buildFeatureItem(
                        Icons.check_circle_rounded,
                        'To‘liq o‘quv statistikasi va tahlillar',
                      ),
                      const SizedBox(height: 12),
                      _buildFeatureItem(
                        Icons.check_circle_rounded,
                        'Oflayn rejimda misollar yechish imkoniyati',
                      ),
                      const SizedBox(height: 24),

                      // Action Button
                      if (isPro) ...[
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          decoration: BoxDecoration(
                            color: const Color(0xFFE8F8EE),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: const Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.verified_rounded, color: AppColors.kidsGreen, size: 20),
                              SizedBox(width: 8),
                              Text(
                                'Siz allaqachon Pro tarifidan foydalanmoqdasiz',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w800,
                                  color: Color(0xFF13533E),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 12),
                        Center(
                          child: TextButton(
                            onPressed: _isLoading ? null : _cancelSubscription,
                            child: const Text(
                              'Obunani bekor qilish',
                              style: TextStyle(
                                color: Color(0xFFEF4444),
                                fontWeight: FontWeight.w600,
                                fontSize: 13,
                              ),
                            ),
                          ),
                        ),
                      ] else ...[
                        CustomButton(
                          text: _isLoading ? 'Yuklanmoqda...' : 'Pro tarifiga o‘tish (29 000 UZS)',
                          backgroundColor: const Color(0xFF6C5CE7),
                          borderRadius: 18,
                          icon: const Icon(Icons.flash_on_rounded, color: Colors.white),
                          onPressed: _isLoading ? null : _upgradeToPro,
                        ),
                      ],
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // Restore Purchases
                Center(
                  child: TextButton.icon(
                    onPressed: _isLoading ? null : _restorePurchases,
                    icon: const Icon(Icons.restore_rounded, size: 18, color: AppColors.kidsSecondaryText),
                    label: const Text(
                      'Xaridlarni tiklash (Restore Purchases)',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: AppColors.kidsSecondaryText,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 12),

                // Payment options & terms note
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: AppColors.kidsBorder),
                  ),
                  child: const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'To‘lov shartlari',
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.kidsDarkText),
                      ),
                      SizedBox(height: 6),
                      Text(
                        'To‘lov Click Business, Uzcard, Humo, Visa va Mastercard orqali O‘zbekiston so‘mida (UZS) xavfsiz amalga oshiriladi. MathCity AI bank kartasi ma’lumotlarini saqlamaydi.',
                        style: TextStyle(fontSize: 11, color: AppColors.kidsSecondaryText, height: 1.45),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFeatureItem(IconData icon, String text) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, color: AppColors.kidsGreen, size: 20),
        const SizedBox(width: 10),
        Expanded(
          child: Text(
            text,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: AppColors.kidsDarkText,
              height: 1.35,
            ),
          ),
        ),
      ],
    );
  }
}
