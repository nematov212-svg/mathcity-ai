import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/custom_button.dart';
import '../../shared/providers/student_provider.dart';

class TariflarScreen extends ConsumerStatefulWidget {
  const TariflarScreen({super.key});

  @override
  ConsumerState<TariflarScreen> createState() => _TariflarScreenState();
}

class _TariflarScreenState extends ConsumerState<TariflarScreen> {
  bool _isLoading = false;

  void _upgradeToPro() async {
    setState(() => _isLoading = true);
    final success = await ref.read(studentProvider.notifier).purchasePro();
    setState(() => _isLoading = false);

    if (!mounted) return;

    if (success) {
      showDialog(
        context: context,
        builder: (ctx) => Dialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFFFFB800), Color(0xFFFF8C00)],
                    ),
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFFFFB800).withOpacity(0.35),
                        blurRadius: 16,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Icon(Icons.workspace_premium_rounded, color: Colors.white, size: 48),
                  ),
                ),
                const SizedBox(height: 20),
                const Text(
                  'MathCity Pro faollashtirildi!',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w900,
                    color: AppColors.kidsDarkText,
                  ),
                ),
                const SizedBox(height: 10),
                const Text(
                  'Endi sizda barcha 11 sinf kurslari, 3D shahar binolari va Ziyo AI cheksiz ochiq!',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 14, color: AppColors.kidsSecondaryText),
                ),
                const SizedBox(height: 24),
                CustomButton(
                  text: 'Ajoyib!',
                  backgroundColor: AppColors.kidsPrimary,
                  borderRadius: 16,
                  onPressed: () => Navigator.pop(ctx),
                ),
              ],
            ),
          ),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Xatolik yuz berdi yoki to‘lov bekor qilindi.'),
          backgroundColor: Colors.red,
        ),
      );
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

  @override
  Widget build(BuildContext context) {
    final studentState = ref.watch(studentProvider);
    final student = studentState.student;
    final sub = student?.subscription;

    final isPro = sub?.isProActive ?? false;
    final trialDays = sub?.trialDaysRemaining ?? 30;
    final planName = isPro ? 'MathCity Pro' : '30 Kunlik Bepul Sinov';

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
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Current Plan Banner
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(22),
                decoration: BoxDecoration(
                  gradient: isPro
                      ? const LinearGradient(
                          colors: [Color(0xFF6C5CE7), Color(0xFFA29BFE)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        )
                      : const LinearGradient(
                          colors: [Color(0xFF2E7D32), Color(0xFF4CAF50)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: (isPro ? const Color(0xFF6C5CE7) : const Color(0xFF2E7D32)).withOpacity(0.3),
                      blurRadius: 16,
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
                            color: Colors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            isPro ? 'FAOL OBUNA' : 'BEPUL SINOV',
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
                          ? 'Barcha ta’lim imkoniyatlari cheksiz ochiq'
                          : 'Sinov muddatiga $trialDays kun qoldi (Jami 30 kun)',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.9),
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Pro Plan Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(22),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(28),
                  border: Border.all(
                    color: isPro ? const Color(0xFF6C5CE7) : AppColors.kidsBorder,
                    width: isPro ? 2 : 1.5,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.kidsDarkText.withOpacity(0.04),
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
                      'Ziyo AI 24/7 shaxsiy matematika repetitori',
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
                              'Siz Pro tarifidasiz',
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF13533E),
                              ),
                            ),
                          ],
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
                      'To‘lov Google Play, App Store yoki milliy to‘lov tizimlari (Payme, Click, Uzum) orqali O‘zbekiston so‘mida (UZS) amalga oshiriladi. Obuna har oy avtomatik uzaytiriladi va istalgan vaqtda bekor qilinishi mumkin.',
                      style: TextStyle(fontSize: 11, color: AppColors.kidsSecondaryText, height: 1.45),
                    ),
                  ],
                ),
              ),
            ],
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
