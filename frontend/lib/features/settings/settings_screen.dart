import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/theme/app_theme.dart';
import '../../shared/providers/student_provider.dart';

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
    final colors = AppThemeColors.of(context);
    final studentState = ref.watch(studentProvider);
    final student = studentState.student;
    final currentMode = student?.mode ?? 'KIDS';

    return Scaffold(
      backgroundColor: colors.bg,
      appBar: AppBar(
        backgroundColor: colors.card,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new_rounded, color: colors.ink),
          onPressed: () => context.canPop() ? context.pop() : context.go('/kids/home'),
        ),
        title: Text(
          'Sozlamalar',
          style: TextStyle(
            fontWeight: FontWeight.w800,
            fontSize: 18,
            color: colors.ink,
          ),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        children: [
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
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Mavzu rejimi',
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
                      ),
                      const SizedBox(height: 8),
                      SizedBox(
                        width: double.infinity,
                        child: SegmentedButton<ThemeMode>(
                          segments: const [
                            ButtonSegment(
                              value: ThemeMode.light,
                              icon: Icon(Icons.wb_sunny_outlined, size: 14),
                              label: Text('Yorug‘', style: TextStyle(fontSize: 11)),
                            ),
                            ButtonSegment(
                              value: ThemeMode.dark,
                              icon: Icon(Icons.dark_mode_outlined, size: 14),
                              label: Text('Tungi', style: TextStyle(fontSize: 11)),
                            ),
                            ButtonSegment(
                              value: ThemeMode.system,
                              icon: Icon(Icons.settings_suggest_outlined, size: 14),
                              label: Text('Tizim', style: TextStyle(fontSize: 11)),
                            ),
                          ],
                          selected: {ref.watch(themeModeProvider)},
                          onSelectionChanged: (newSelection) {
                            ref.read(themeModeProvider.notifier).setThemeMode(newSelection.first);
                          },
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
                                final success = await ref.read(studentProvider.notifier).deleteAccount();
                                if (context.mounted) {
                                  if (success) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(content: Text('Hisobingiz muvaffaqiyatli o‘chirildi.')),
                                    );
                                    context.go('/login');
                                  } else {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(content: Text('Hisobni o‘chirishda xatolik yuz berdi.')),
                                    );
                                  }
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
