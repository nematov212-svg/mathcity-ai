import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../shared/providers/student_provider.dart';
import 'tariflar_screen.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  
  bool _soundEnabled = true;
  bool _animationsEnabled = true;

  @override
  Widget build(BuildContext context) {
    final studentState = ref.watch(studentProvider);
    final student = studentState.student;
    final currentMode = student?.mode ?? 'KIDS';
    final sub = student?.subscription;
    final isPro = sub?.isProActive ?? false;
    final trialDays = sub?.trialDaysRemaining ?? 30;

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
          'Sozlamalar',
          style: TextStyle(
            fontWeight: FontWeight.w800,
            fontSize: 18,
            color: AppColors.kidsDarkText,
          ),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        children: [
          // Section: Tariflar va Obuna (Requirement #9)
          const Text(
            'TARIFLAR VA OBUNA',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w800,
              color: AppColors.kidsSecondaryText,
              letterSpacing: 1.1,
            ),
          ),
          const SizedBox(height: 12),
          InkWell(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const TariflarScreen()),
              );
            },
            borderRadius: BorderRadius.circular(24),
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: isPro
                    ? const LinearGradient(
                        colors: [Color(0xFF6C5CE7), Color(0xFFA29BFE)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      )
                    : const LinearGradient(
                        colors: [Color(0xFF101526), Color(0xFF1E2640)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: (isPro ? const Color(0xFF6C5CE7) : const Color(0xFF101526)).withOpacity(0.25),
                    blurRadius: 16,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.18),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Icon(
                      isPro ? Icons.workspace_premium_rounded : Icons.card_membership_rounded,
                      color: isPro ? const Color(0xFFFFD54F) : Colors.white,
                      size: 28,
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          isPro ? 'MathCity Pro faol' : 'Tariflar (30 kunlik bepul sinov)',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          isPro
                              ? 'Barcha 11 sinf va 3D binolar ochiq'
                              : 'Sinov muddatiga $trialDays kun qoldi • 29 000 UZS/oy',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                            color: Colors.white.withOpacity(0.8),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.arrow_forward_ios_rounded, color: Colors.white, size: 16),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          // Section: Appearance & Mode
          const Text(
            'ILOVA KO‘RINISHI VA REJIMI',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w800,
              color: AppColors.kidsSecondaryText,
              letterSpacing: 1.1,
            ),
          ),
          const SizedBox(height: 12),
          Material(
            color: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(24),
              side: const BorderSide(color: AppColors.kidsBorder, width: 1.5),
            ),
            child: Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Interfeys rejimi',
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w800,
                                color: AppColors.kidsDarkText,
                              ),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Bolalar (6-12) yoki O‘smirlar (13-16)',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(fontSize: 12, color: AppColors.kidsSecondaryText),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: currentMode == 'KIDS'
                              ? AppColors.kidsPrimary
                              : const Color(0xFF101526),
                          foregroundColor: currentMode == 'KIDS'
                              ? Colors.white
                              : AppColors.teenPrimaryLime,
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        onPressed: () {
                          if (currentMode == 'KIDS') {
                            ref.read(studentProvider.notifier).setMode('TEEN');
                            context.go('/teen/home');
                          } else {
                            ref.read(studentProvider.notifier).setMode('KIDS');
                            context.go('/kids/home');
                          }
                        },
                        child: Text(
                          currentMode == 'KIDS' ? 'Bolalar rejimi' : 'O‘smirlar rejimi',
                          style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 12),
                        ),
                      ),
                    ],
                  ),
                  const Divider(height: 24, color: AppColors.kidsBorder),
                  SwitchListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text(
                      'Tovush effektlari',
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
                    ),
                    subtitle: const Text('To‘g‘ri javoblar va tangalar ovozi'),
                    value: _soundEnabled,
                    activeColor: AppColors.kidsPrimary,
                    onChanged: (val) => setState(() => _soundEnabled = val),
                  ),
                  SwitchListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text(
                      'Animatsiyalar',
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
                    ),
                    subtitle: const Text('Rasadxona va tangalar harakatini ko‘rsatish'),
                    value: _animationsEnabled,
                    activeColor: AppColors.kidsPrimary,
                    onChanged: (val) => setState(() => _animationsEnabled = val),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Section: Privacy & Security
          const Text(
            'XAVFSIZLIK VA MAXFIYLIK',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w800,
              color: AppColors.kidsSecondaryText,
              letterSpacing: 1.1,
            ),
          ),
          const SizedBox(height: 12),
          Material(
            color: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(24),
              side: const BorderSide(color: AppColors.kidsBorder, width: 1.5),
            ),
            child: Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                children: [
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: const Icon(Icons.download_rounded, color: AppColors.kidsPrimary),
                    title: const Text(
                      'O‘quv ma’lumotlarini yuklab olish',
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700),
                    ),
                    trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16),
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Ma’lumotlar fayli tayyorlandi (JSON).')),
                      );
                    },
                  ),
                  const Divider(height: 16, color: AppColors.kidsBorder),
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: const Icon(Icons.delete_outline_rounded, color: AppColors.kidsError),
                    title: const Text(
                      'Hisobni o‘chirish',
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.kidsError),
                    ),
                    trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16),
                    onTap: () {
                      showDialog(
                        context: context,
                        builder: (ctx) => AlertDialog(
                          title: const Text('Hisobni o‘chirish'),
                          content: const Text(
                            'Hisobingiz va barcha yutuqlaringiz o‘chirib tashlanadi. Buni tasdiqlaysizmi?',
                          ),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(ctx),
                              child: const Text('Bekor qilish'),
                            ),
                            TextButton(
                              onPressed: () async {
                                Navigator.pop(ctx);
                                await ref.read(studentProvider.notifier).logout();
                                if (context.mounted) {
                                  context.go('/login');
                                }
                              },
                              child: const Text(
                                'O‘chirish',
                                style: TextStyle(color: Colors.red),
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Logout Button
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFFFECEC),
              foregroundColor: AppColors.kidsError,
              elevation: 0,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
            ),
            onPressed: () async {
              await ref.read(studentProvider.notifier).logout();
              if (context.mounted) {
                context.go('/login');
              }
            },
            child: const Text(
              'Hisobdan chiqish',
              style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15),
            ),
          ),
        ],
      ),
    );
  }
}
