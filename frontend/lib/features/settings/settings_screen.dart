import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/animated_math_background.dart';
import '../../core/widgets/user_avatar.dart';
import '../../core/widgets/xp_coin.dart';
import '../../shared/models/student_model.dart';
import '../../shared/providers/student_provider.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  bool _soundEnabled = true;
  bool _animationsEnabled = true;
  bool _dailyReminderEnabled = true;
  String _reminderTime = '19:00';

  @override
  void initState() {
    super.initState();
    _loadRemoteSettings();
  }

  Future<void> _loadRemoteSettings() async {
    final settings = await ref.read(studentProvider.notifier).fetchSettings();
    if (mounted && settings != null) {
      setState(() {
        _soundEnabled = settings['soundEnabled'] ?? true;
        _animationsEnabled = settings['animationsEnabled'] ?? true;
        _dailyReminderEnabled = settings['dailyReminderEnabled'] ?? true;
        _reminderTime = settings['reminderTime'] ?? '19:00';
      });
    }
  }

  Future<void> _syncSettings({
    bool? sound,
    bool? anim,
    bool? reminder,
    String? time,
  }) async {
    HapticFeedback.lightImpact();
    final newSound = sound ?? _soundEnabled;
    final newAnim = anim ?? _animationsEnabled;
    final newReminder = reminder ?? _dailyReminderEnabled;
    final newTime = time ?? _reminderTime;

    setState(() {
      _soundEnabled = newSound;
      _animationsEnabled = newAnim;
      _dailyReminderEnabled = newReminder;
      _reminderTime = newTime;
    });

    if (anim != null) {
      ref
          .read(animationsEnabledProvider.notifier)
          .setAnimationsEnabled(newAnim);
    }

    await ref.read(studentProvider.notifier).updateSettings({
      'soundEnabled': newSound,
      'animationsEnabled': newAnim,
      'dailyReminderEnabled': newReminder,
      'reminderTime': newTime,
    });
  }

  Future<void> _pickReminderTime() async {
    HapticFeedback.lightImpact();
    final parts = _reminderTime.split(':');
    final initialTime = TimeOfDay(
      hour: int.tryParse(parts[0]) ?? 19,
      minute: int.tryParse(parts[1]) ?? 0,
    );

    final picked = await showTimePicker(
      context: context,
      initialTime: initialTime,
      builder: (context, child) {
        return MediaQuery(
          data: MediaQuery.of(context).copyWith(alwaysUse24HourFormat: true),
          child: child ?? const SizedBox(),
        );
      },
    );

    if (picked != null) {
      final formatted =
          '${picked.hour.toString().padLeft(2, '0')}:${picked.minute.toString().padLeft(2, '0')}';
      await _syncSettings(time: formatted);
    }
  }

  void _showEditProfileDialog(StudentModel student) {
    HapticFeedback.lightImpact();
    final nameCtrl = TextEditingController(text: student.displayName);
    int selectedGrade = student.grade;

    showDialog(
      context: context,
      builder: (ctx) {
        final colors = AppThemeColors.of(context);
        return StatefulBuilder(
          builder: (context, setDlgState) {
            return AlertDialog(
              backgroundColor: colors.card,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(24)),
              title: Text(
                'Profilni tahrirlash',
                style:
                    TextStyle(fontWeight: FontWeight.w800, color: colors.ink),
              ),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(
                      controller: nameCtrl,
                      decoration: InputDecoration(
                        labelText: 'Ismingiz',
                        filled: true,
                        fillColor: colors.field,
                        border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16)),
                      ),
                    ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<int>(
                      value: selectedGrade,
                      decoration: InputDecoration(
                        labelText: 'Sinf',
                        filled: true,
                        fillColor: colors.field,
                        border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16)),
                      ),
                      items: List.generate(11, (i) => i + 1)
                          .map((g) => DropdownMenuItem(
                              value: g, child: Text('$g-sinf')))
                          .toList(),
                      onChanged: (val) {
                        if (val != null) setDlgState(() => selectedGrade = val);
                      },
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(ctx),
                  child: Text('Bekor qilish',
                      style: TextStyle(color: colors.muted)),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: colors.primary,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14)),
                  ),
                  onPressed: () async {
                    HapticFeedback.lightImpact();
                    Navigator.pop(ctx);
                    await ref
                        .read(studentProvider.notifier)
                        .updateProfileDetails(
                          displayName: nameCtrl.text.trim(),
                          grade: selectedGrade,
                        );
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                            content: Text('Profil muvaffaqiyatli saqlandi!')),
                      );
                    }
                  },
                  child: const Text('Saqlash',
                      style: TextStyle(
                          color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              ],
            );
          },
        );
      },
    );
  }

  void _showProCertificateLockedSheet() {
    HapticFeedback.lightImpact();
    final colors = AppThemeColors.of(context);
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: colors.card,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: colors.muted.withValues(alpha: 0.3),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFFFA000), Color(0xFFFF6F00)],
                  ),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFFFA000).withValues(alpha: 0.4),
                      blurRadius: 14,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: const Icon(Icons.workspace_premium_rounded,
                    color: Colors.white, size: 36),
              ),
              const SizedBox(height: 16),
              Text(
                'MathCity Pro Sertifikati',
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                    color: colors.ink),
              ),
              const SizedBox(height: 10),
              Text(
                'Sertifikat faqat MathCity Pro obunachilari uchun mavjud. Kursni muvaffaqiyatli tugatib, rasmiy sertifikat oling!',
                textAlign: TextAlign.center,
                style:
                    TextStyle(fontSize: 14, color: colors.muted, height: 1.4),
              ),
              const SizedBox(height: 22),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF6C47FF),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16)),
                  ),
                  icon: const Icon(Icons.bolt_rounded),
                  label: const Text('Pro\'ga o‘tish',
                      style:
                          TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
                  onPressed: () {
                    Navigator.pop(ctx);
                    context.push('/tariflar');
                  },
                ),
              ),
              const SizedBox(height: 8),
            ],
          ),
        );
      },
    );
  }

  void _showExportDataSheet() async {
    HapticFeedback.lightImpact();
    final colors = AppThemeColors.of(context);
    final data = await ref.read(studentProvider.notifier).exportUserData();
    if (!mounted) return;

    final jsonStr = const JsonEncoder.withIndent('  ').convert(data ?? {});

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          height: MediaQuery.of(context).size.height * 0.7,
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: colors.card,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: colors.muted.withValues(alpha: 0.3),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'O‘quv ma’lumotlari (JSON)',
                    style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        color: colors.ink),
                  ),
                  IconButton(
                    icon: const Icon(Icons.copy_rounded),
                    onPressed: () {
                      HapticFeedback.lightImpact();
                      Clipboard.setData(ClipboardData(text: jsonStr));
                      Navigator.pop(ctx);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                            content: Text('Ma’lumotlar nusxalandi!')),
                      );
                    },
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: colors.field,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: colors.border),
                  ),
                  child: SingleChildScrollView(
                    child: Text(
                      jsonStr,
                      style: TextStyle(
                          fontSize: 12,
                          fontFamily: 'monospace',
                          color: colors.ink),
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _showDeleteAccountSheet(StudentModel student) {
    HapticFeedback.lightImpact();
    final colors = AppThemeColors.of(context);
    final confirmCtrl = TextEditingController();
    String? errorText;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return Padding(
              padding: EdgeInsets.only(
                  bottom: MediaQuery.of(context).viewInsets.bottom),
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: colors.card,
                  borderRadius:
                      const BorderRadius.vertical(top: Radius.circular(28)),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: Container(
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(
                          color: colors.muted.withValues(alpha: 0.3),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    const Row(
                      children: [
                        Icon(Icons.warning_amber_rounded,
                            color: AppColors.kidsError, size: 28),
                        SizedBox(width: 10),
                        Text(
                          'Hisobni butunlay o‘chirish',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                            color: AppColors.kidsError,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'Barcha o‘quv natijalari, tangalar, XP va yutuqlaringiz serverdan butunlay o‘chirib tashlanadi va qayta tiklab bo‘lmaydi.',
                      style: TextStyle(
                          fontSize: 13, color: colors.muted, height: 1.4),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Tasdiqlash uchun foydalanuvchi nomingizni yozing: "${student.username ?? student.displayName}"',
                      style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: colors.ink),
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: confirmCtrl,
                      decoration: InputDecoration(
                        hintText: student.username ?? student.displayName,
                        errorText: errorText,
                        filled: true,
                        fillColor: colors.field,
                        border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16)),
                      ),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14)),
                            ),
                            onPressed: () => Navigator.pop(ctx),
                            child: const Text('Bekor qilish'),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.kidsError,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14)),
                            ),
                            onPressed: () async {
                              HapticFeedback.lightImpact();
                              final expected =
                                  student.username ?? student.displayName;
                              if (confirmCtrl.text.trim() != expected.trim()) {
                                setSheetState(() => errorText =
                                    'Foydalanuvchi nomi mos kelmadi');
                                return;
                              }
                              Navigator.pop(ctx);
                              final success = await ref
                                  .read(studentProvider.notifier)
                                  .deleteAccountConfirm(
                                    username: confirmCtrl.text.trim(),
                                  );
                              if (context.mounted) {
                                if (success) {
                                  context.go('/login');
                                } else {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                        content: Text(
                                            'Hisobni o‘chirishda xatolik yuz berdi.')),
                                  );
                                }
                              }
                            },
                            child: const Text('O‘chirish',
                                style: TextStyle(fontWeight: FontWeight.bold)),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final studentState = ref.watch(studentProvider);
    final student = studentState.student;
    final isPro = student?.subscription.isProActive == true;

    return Scaffold(
      backgroundColor: colors.bg,
      appBar: AppBar(
        backgroundColor: colors.card,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new_rounded, color: colors.ink),
          onPressed: () =>
              context.canPop() ? context.pop() : context.go('/kids/home'),
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
      body: Stack(
        children: [
          Positioned.fill(
            child: AnimatedMathBackground(isDark: isDark),
          ),
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 20),
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 720),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // 1. TOP PROFILE CARD
                      _buildProfileCard(student, colors, isDark, isPro),

                      const SizedBox(height: 24),

                      // 2. KO'RINISH (APPEARANCE)
                      _buildSectionTitle('ILOVA KO‘RINISHI VA REJIMI', colors),
                      const SizedBox(height: 10),
                      _buildCardGroup(
                        colors: colors,
                        isDark: isDark,
                        children: [
                          _buildThemeModeSelector(colors, isDark),
                          Divider(height: 24, color: colors.border),
                          _buildSettingRow(
                            colors: colors,
                            icon: Icons.auto_awesome_rounded,
                            iconColor: const Color(0xFF6C47FF),
                            iconBg:
                                const Color(0xFF6C47FF).withValues(alpha: 0.12),
                            title: 'Ta’lim rejimi',
                            subtitle: 'Matematika kursi (barcha yoshlar)',
                            trailing: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: colors.primary.withValues(alpha: 0.12),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                'Faol',
                                style: TextStyle(
                                  color: colors.primary,
                                  fontWeight: FontWeight.w800,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 24),

                      // 3. TOVUSH VA ANIMATSIYA
                      _buildSectionTitle('TOVUSH VA ANIMATSIYA', colors),
                      const SizedBox(height: 10),
                      _buildCardGroup(
                        colors: colors,
                        isDark: isDark,
                        children: [
                          _buildSwitchRow(
                            colors: colors,
                            icon: Icons.volume_up_rounded,
                            iconColor: const Color(0xFF3B82F6),
                            iconBg:
                                const Color(0xFF3B82F6).withValues(alpha: 0.12),
                            title: 'Tovush effektlari',
                            subtitle: 'To‘g‘ri javoblar va tangalar ovozi',
                            value: _soundEnabled,
                            onChanged: (val) => _syncSettings(sound: val),
                          ),
                          Divider(height: 16, color: colors.border),
                          _buildSwitchRow(
                            colors: colors,
                            icon: Icons.animation_rounded,
                            iconColor: const Color(0xFFA855F7),
                            iconBg:
                                const Color(0xFFA855F7).withValues(alpha: 0.12),
                            title: 'Animatsiyalar',
                            subtitle:
                                'Harakatlanuvchi fon va bayram effektlari',
                            value: _animationsEnabled,
                            onChanged: (val) => _syncSettings(anim: val),
                          ),
                        ],
                      ),

                      const SizedBox(height: 24),

                      // 4. ESLATMALAR
                      _buildSectionTitle('ESLATMALAR', colors),
                      const SizedBox(height: 10),
                      _buildCardGroup(
                        colors: colors,
                        isDark: isDark,
                        children: [
                          _buildSwitchRow(
                            colors: colors,
                            icon: Icons.notifications_active_rounded,
                            iconColor: const Color(0xFFF59E0B),
                            iconBg:
                                const Color(0xFFF59E0B).withValues(alpha: 0.12),
                            title: 'Kunlik eslatma',
                            subtitle: 'Har kuni darslarni eslatib turish',
                            value: _dailyReminderEnabled,
                            onChanged: (val) => _syncSettings(reminder: val),
                          ),
                          if (_dailyReminderEnabled) ...[
                            Divider(height: 16, color: colors.border),
                            _buildSettingRow(
                              colors: colors,
                              icon: Icons.access_time_filled_rounded,
                              iconColor: const Color(0xFF10B981),
                              iconBg: const Color(0xFF10B981)
                                  .withValues(alpha: 0.12),
                              title: 'Eslatma vaqti',
                              subtitle: 'Eslatish soati (Toshkent vaqti)',
                              trailing: Chip(
                                label: Text(
                                  _reminderTime,
                                  style: TextStyle(
                                      fontWeight: FontWeight.w800,
                                      color: colors.primary),
                                ),
                                backgroundColor:
                                    colors.primary.withValues(alpha: 0.12),
                              ),
                              onTap: _pickReminderTime,
                            ),
                          ],
                        ],
                      ),

                      const SizedBox(height: 24),

                      // 5. MATHCITY PRO CARD
                      _buildMathCityProCard(colors, isPro),

                      const SizedBox(height: 24),

                      // 6. MENING SERTIFIKATIM
                      _buildSectionTitle('MENING SERTIFIKATIM', colors),
                      const SizedBox(height: 10),
                      _buildCardGroup(
                        colors: colors,
                        isDark: isDark,
                        children: [
                          _buildCertificateRow(colors, isPro),
                        ],
                      ),

                      const SizedBox(height: 24),

                      // 7. XAVFSIZLIK VA MAXFIYLIK
                      _buildSectionTitle('XAVFSIZLIK VA MAXFIYLIK', colors),
                      const SizedBox(height: 10),
                      _buildCardGroup(
                        colors: colors,
                        isDark: isDark,
                        children: [
                          _buildSettingRow(
                            colors: colors,
                            icon: Icons.download_rounded,
                            iconColor: const Color(0xFF6C47FF),
                            iconBg:
                                const Color(0xFF6C47FF).withValues(alpha: 0.12),
                            title: 'O‘quv ma’lumotlarini yuklab olish',
                            subtitle:
                                'O‘qish statistikasi va yutuqlarni JSON shaklida olish',
                            trailing: const Icon(
                                Icons.arrow_forward_ios_rounded,
                                size: 16),
                            onTap: _showExportDataSheet,
                          ),
                          Divider(height: 16, color: colors.border),
                          _buildSettingRow(
                            colors: colors,
                            icon: Icons.delete_outline_rounded,
                            iconColor: AppColors.kidsError,
                            iconBg: AppColors.kidsError.withValues(alpha: 0.12),
                            title: 'Hisobni butunlay o‘chirish',
                            subtitle: 'Barcha ma’lumotlarni o‘chirish',
                            titleColor: AppColors.kidsError,
                            trailing: const Icon(
                                Icons.arrow_forward_ios_rounded,
                                size: 16),
                            onTap: student != null
                                ? () => _showDeleteAccountSheet(student)
                                : null,
                          ),
                        ],
                      ),

                      const SizedBox(height: 28),

                      // 8. TIZIMDAN CHIQISH (LOGOUT)
                      ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFFFECEC),
                          foregroundColor: AppColors.kidsError,
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(20)),
                        ),
                        icon: const Icon(Icons.logout_rounded, size: 20),
                        label: const Text(
                          'Hisobdan chiqish',
                          style: TextStyle(
                              fontWeight: FontWeight.w800, fontSize: 15),
                        ),
                        onPressed: () async {
                          HapticFeedback.lightImpact();
                          final confirm = await showDialog<bool>(
                            context: context,
                            builder: (ctx) => AlertDialog(
                              title: const Text('Hisobdan chiqish'),
                              content: const Text(
                                  'Haqiqatan ham hisobdan chiqmoqchimisiz?'),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.pop(ctx, false),
                                  child: const Text('Yo‘q'),
                                ),
                                TextButton(
                                  onPressed: () => Navigator.pop(ctx, true),
                                  child: const Text('Chiqish',
                                      style: TextStyle(color: Colors.red)),
                                ),
                              ],
                            ),
                          );
                          if (confirm == true) {
                            await ref.read(studentProvider.notifier).logout();
                            if (context.mounted) context.go('/login');
                          }
                        },
                      ),

                      const SizedBox(height: 24),

                      // 9. FOOTER
                      Center(
                        child: Column(
                          children: [
                            Text(
                              'MathCity AI · v1.0.0 (Toshkent vaqti UTC+5)',
                              style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: colors.muted),
                            ),
                            const SizedBox(height: 8),
                            Wrap(
                              spacing: 16,
                              children: [
                                GestureDetector(
                                  onTap: () {
                                    HapticFeedback.lightImpact();
                                    context.push('/privacy-policy');
                                  },
                                  child: Text(
                                    'Maxfiylik siyosati',
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w700,
                                      color: colors.primary,
                                      decoration: TextDecoration.underline,
                                    ),
                                  ),
                                ),
                                GestureDetector(
                                  onTap: () {
                                    HapticFeedback.lightImpact();
                                    context.push('/privacy-policy');
                                  },
                                  child: Text(
                                    'Foydalanish shartlari',
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w700,
                                      color: colors.primary,
                                      decoration: TextDecoration.underline,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 32),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileCard(
    StudentModel? student,
    AppThemeColors colors,
    bool isDark,
    bool isPro,
  ) {
    final name = (student != null && student.displayName.trim().isNotEmpty)
        ? student.displayName.trim()
        : 'O‘quvchi';
    final username = student?.username ?? 'user';
    final level = student?.level ?? 1;
    final totalXp = student?.totalXP ?? 0;

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: colors.border, width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.25 : 0.04),
            blurRadius: 14,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              UserAvatar(
                displayName: name,
                size: 56,
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Text(
                            name,
                            style: TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.w800,
                              color: colors.ink,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 8),
                        if (isPro)
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                colors: [Color(0xFFFFA000), Color(0xFFFF6F00)],
                              ),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(Icons.star_rounded,
                                    color: Colors.white, size: 12),
                                SizedBox(width: 3),
                                Text(
                                  'PRO',
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w900,
                                    color: Colors.white,
                                  ),
                                ),
                              ],
                            ),
                          )
                        else
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: colors.field,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: colors.border),
                            ),
                            child: Text(
                              'Oddiy',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w700,
                                color: colors.muted,
                              ),
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 3),
                    Text(
                      '@$username · ${student?.grade ?? 4}-sinf',
                      style: TextStyle(fontSize: 13, color: colors.muted),
                    ),
                  ],
                ),
              ),
              OutlinedButton(
                style: OutlinedButton.styleFrom(
                  side: BorderSide(color: colors.primary),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14)),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                ),
                onPressed: student != null
                    ? () => _showEditProfileDialog(student)
                    : null,
                child: Text(
                  'Tahrirlash',
                  style: TextStyle(
                    color: colors.primary,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          // Level & XP row
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: colors.field,
              borderRadius: BorderRadius.circular(14),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                Row(
                  children: [
                    Icon(Icons.military_tech_rounded,
                        size: 18, color: colors.primary),
                    const SizedBox(width: 6),
                    Text(
                      'Lvl $level',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w800,
                        color: colors.ink,
                      ),
                    ),
                  ],
                ),
                Container(width: 1, height: 16, color: colors.border),
                Row(
                  children: [
                    const XpCoin(size: 16, showGlow: false),
                    const SizedBox(width: 6),
                    Text(
                      '$totalXp XP',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w800,
                        color: colors.ink,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title, AppThemeColors colors) {
    return Padding(
      padding: const EdgeInsets.only(left: 4),
      child: Text(
        title,
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w800,
          color: colors.muted,
          letterSpacing: 1.1,
        ),
      ),
    );
  }

  Widget _buildCardGroup({
    required AppThemeColors colors,
    required bool isDark,
    required List<Widget> children,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: colors.border, width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.03),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: children,
      ),
    );
  }

  Widget _buildThemeModeSelector(AppThemeColors colors, bool isDark) {
    final currentMode = ref.watch(themeModeProvider);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFF6C47FF).withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.palette_rounded,
                  color: Color(0xFF6C47FF), size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Mavzu rejimi',
                    style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                        color: colors.ink),
                  ),
                  Text(
                    'Yorug‘, tungi yoki tizim mavzusiga moslash',
                    style: TextStyle(fontSize: 12, color: colors.muted),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity,
          child: SegmentedButton<ThemeMode>(
            segments: const [
              ButtonSegment(
                value: ThemeMode.light,
                icon: Icon(Icons.wb_sunny_rounded, size: 16),
                label: Text('Yorug‘',
                    style:
                        TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
              ),
              ButtonSegment(
                value: ThemeMode.dark,
                icon: Icon(Icons.dark_mode_rounded, size: 16),
                label: Text('Tungi',
                    style:
                        TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
              ),
              ButtonSegment(
                value: ThemeMode.system,
                icon: Icon(Icons.settings_suggest_rounded, size: 16),
                label: Text('Tizim',
                    style:
                        TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
              ),
            ],
            selected: {currentMode},
            onSelectionChanged: (newSelection) {
              HapticFeedback.lightImpact();
              ref
                  .read(themeModeProvider.notifier)
                  .setThemeMode(newSelection.first);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildSettingRow({
    required AppThemeColors colors,
    required IconData icon,
    required Color iconColor,
    required Color iconBg,
    required String title,
    required String subtitle,
    Color? titleColor,
    Widget? trailing,
    VoidCallback? onTap,
  }) {
    return InkWell(
      onTap: onTap != null
          ? () {
              HapticFeedback.lightImpact();
              onTap();
            }
          : null,
      borderRadius: BorderRadius.circular(14),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 6),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: iconBg,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: iconColor, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: titleColor ?? colors.ink,
                    ),
                  ),
                  const SizedBox(height: 1),
                  Text(
                    subtitle,
                    style: TextStyle(fontSize: 12, color: colors.muted),
                  ),
                ],
              ),
            ),
            if (trailing != null) trailing,
          ],
        ),
      ),
    );
  }

  Widget _buildSwitchRow({
    required AppThemeColors colors,
    required IconData icon,
    required Color iconColor,
    required Color iconBg,
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: iconBg,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: iconColor, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: colors.ink,
                  ),
                ),
                const SizedBox(height: 1),
                Text(
                  subtitle,
                  style: TextStyle(fontSize: 12, color: colors.muted),
                ),
              ],
            ),
          ),
          Switch(
            value: value,
            activeColor: colors.primary,
            onChanged: (val) {
              HapticFeedback.lightImpact();
              onChanged(val);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildMathCityProCard(AppThemeColors colors, bool isPro) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: isPro
              ? [const Color(0xFF10B981), const Color(0xFF059669)]
              : [const Color(0xFF6C47FF), const Color(0xFF8B6BFF)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: (isPro ? const Color(0xFF10B981) : const Color(0xFF6C47FF))
                .withValues(alpha: 0.35),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.workspace_premium_rounded,
                  color: Colors.white,
                  size: 26,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      isPro ? 'MathCity Pro faol' : 'MathCity Pro',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                      ),
                    ),
                    Text(
                      isPro
                          ? 'Barcha imtiyozlar va cheksiz AI ochiq'
                          : 'Oyiga 29 000 so‘m',
                      style:
                          const TextStyle(fontSize: 12, color: Colors.white70),
                    ),
                  ],
                ),
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor:
                      isPro ? const Color(0xFF059669) : const Color(0xFF6C47FF),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14)),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                ),
                onPressed: () {
                  HapticFeedback.lightImpact();
                  context.push('/tariflar');
                },
                child: Text(
                  isPro ? 'Boshqarish' : 'Pro olish',
                  style: const TextStyle(
                      fontWeight: FontWeight.w800, fontSize: 13),
                ),
              ),
            ],
          ),
          if (!isPro) ...[
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Column(
                children: const [
                  _ProBenefitRow(text: 'Cheksiz AI Ustoz va ovozli suhbat'),
                  SizedBox(height: 6),
                  _ProBenefitRow(
                      text: 'Rasmiy tasdiqlangan matematika sertifikati'),
                  SizedBox(height: 6),
                  _ProBenefitRow(
                      text: 'Barcha yuqori darajadagi darslar va yutuqlar'),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildCertificateRow(AppThemeColors colors, bool isPro) {
    return _buildSettingRow(
      colors: colors,
      icon: Icons.workspace_premium_rounded,
      iconColor: const Color(0xFFD4AF37),
      iconBg: const Color(0xFFD4AF37).withValues(alpha: 0.14),
      title: 'Mening sertifikatim',
      subtitle: 'Rasmiy ta’lim va malaka sertifikati',
      trailing: isPro
          ? const Icon(Icons.arrow_forward_ios_rounded, size: 16)
          : Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFFFFA000), Color(0xFFFF6F00)],
                    ),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Text(
                    'PRO',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(width: 6),
                const Icon(Icons.lock_rounded,
                    size: 16, color: Color(0xFFF59E0B)),
              ],
            ),
      onTap: () {
        if (isPro) {
          context.push('/settings/certificate');
        } else {
          _showProCertificateLockedSheet();
        }
      },
    );
  }
}

class _ProBenefitRow extends StatelessWidget {
  final String text;
  const _ProBenefitRow({required this.text});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const Icon(Icons.check_circle_rounded,
            color: Color(0xFF34D399), size: 16),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            text,
            style: const TextStyle(
                fontSize: 12, color: Colors.white, fontWeight: FontWeight.w600),
          ),
        ),
      ],
    );
  }
}
