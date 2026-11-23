import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/theme/app_theme.dart';
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

    await ref.read(studentProvider.notifier).updateSettings({
      'soundEnabled': newSound,
      'animationsEnabled': newAnim,
      'dailyReminderEnabled': newReminder,
      'reminderTime': newTime,
    });
  }

  Future<void> _pickReminderTime() async {
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
      final formatted = '${picked.hour.toString().padLeft(2, '0')}:${picked.minute.toString().padLeft(2, '0')}';
      await _syncSettings(time: formatted);
    }
  }

  void _showEditProfileDialog(StudentModel student) {
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
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
              title: Text('Profilni tahrirlash', style: TextStyle(fontWeight: FontWeight.w800, color: colors.ink)),
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
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                    ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<int>(
                      value: selectedGrade,
                      decoration: InputDecoration(
                        labelText: 'Sinf',
                        filled: true,
                        fillColor: colors.field,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      items: List.generate(11, (i) => i + 1)
                          .map((g) => DropdownMenuItem(value: g, child: Text('$g-sinf')))
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
                  child: Text('Bekor qilish', style: TextStyle(color: colors.muted)),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: colors.primary,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  onPressed: () async {
                    Navigator.pop(ctx);
                    await ref.read(studentProvider.notifier).updateProfileDetails(
                          displayName: nameCtrl.text.trim(),
                          grade: selectedGrade,
                        );
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Profil muvaffaqiyatli saqlandi!')),
                      );
                    }
                  },
                  child: const Text('Saqlash', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              ],
            );
          },
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
                    color: colors.muted.withOpacity(0.3),
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
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: colors.ink),
                  ),
                  IconButton(
                    icon: const Icon(Icons.copy_rounded),
                    onPressed: () {
                      Clipboard.setData(ClipboardData(text: jsonStr));
                      Navigator.pop(ctx);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Ma’lumotlar nusxalandi!')),
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
                      style: TextStyle(fontSize: 12, fontFamily: 'monospace', color: colors.ink),
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
              padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: colors.card,
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
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
                          color: colors.muted.withOpacity(0.3),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    const Row(
                      children: [
                        Icon(Icons.warning_amber_rounded, color: AppColors.kidsError, size: 28),
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
                      style: TextStyle(fontSize: 13, color: colors.muted, height: 1.4),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Tasdiqlash uchun foydalanuvchi nomingizni yozing: "${student.username ?? student.displayName}"',
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: colors.ink),
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: confirmCtrl,
                      decoration: InputDecoration(
                        hintText: student.username ?? student.displayName,
                        errorText: errorText,
                        filled: true,
                        fillColor: colors.field,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
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
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            ),
                            onPressed: () async {
                              final expected = student.username ?? student.displayName;
                              if (confirmCtrl.text.trim() != expected.trim()) {
                                setSheetState(() => errorText = 'Foydalanuvchi nomi mos kelmadi');
                                return;
                              }
                              Navigator.pop(ctx);
                              final success = await ref.read(studentProvider.notifier).deleteAccountConfirm(
                                    username: confirmCtrl.text.trim(),
                                  );
                              if (context.mounted) {
                                if (success) {
                                  context.go('/login');
                                } else {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(content: Text('Hisobni o‘chirishda xatolik yuz berdi.')),
                                  );
                                }
                              }
                            },
                            child: const Text('O‘chirish', style: TextStyle(fontWeight: FontWeight.bold)),
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
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
          // 1. User Profile Card
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: colors.card,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: colors.border, width: 1.2),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 28,
                  backgroundColor: colors.primary.withOpacity(0.12),
                  child: Text(
                    student?.displayName.isNotEmpty == true ? student!.displayName[0].toUpperCase() : 'M',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: colors.primary),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        student?.displayName ?? 'O‘quvchi',
                        style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: colors.ink),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '@${student?.username ?? "user"} · ${student?.grade ?? 4}-sinf',
                        style: TextStyle(fontSize: 13, color: colors.muted),
                      ),
                    ],
                  ),
                ),
                OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    side: BorderSide(color: colors.primary),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  ),
                  onPressed: student != null ? () => _showEditProfileDialog(student) : null,
                  child: Text('Tahrirlash', style: TextStyle(color: colors.primary, fontSize: 12, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // 2. Appearance & Mode Section
          Text(
            'ILOVA KO‘RINISHI VA REJIMI',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w800,
              color: colors.muted,
              letterSpacing: 1.1,
            ),
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: colors.card,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: colors.border, width: 1.2),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Ta’lim rejimi',
                            style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: colors.ink),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Matematika rejimi (barcha yoshlar uchun)',
                            style: TextStyle(fontSize: 12, color: colors.muted),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: colors.primary.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Text(
                        'Faol',
                        style: TextStyle(
                          color: colors.primary,
                          fontWeight: FontWeight.w800,
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ],
                ),
                Divider(height: 24, color: colors.border),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Mavzu rejimi', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: colors.ink)),
                    const SizedBox(height: 10),
                    SizedBox(
                      width: double.infinity,
                      child: SegmentedButton<ThemeMode>(
                        segments: const [
                          ButtonSegment(
                            value: ThemeMode.light,
                            icon: Icon(Icons.wb_sunny_outlined, size: 16),
                            label: Text('Yorug‘', style: TextStyle(fontSize: 12)),
                          ),
                          ButtonSegment(
                            value: ThemeMode.dark,
                            icon: Icon(Icons.dark_mode_outlined, size: 16),
                            label: Text('Tungi', style: TextStyle(fontSize: 12)),
                          ),
                          ButtonSegment(
                            value: ThemeMode.system,
                            icon: Icon(Icons.settings_suggest_outlined, size: 16),
                            label: Text('Tizim', style: TextStyle(fontSize: 12)),
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
              ],
            ),
          ),

          const SizedBox(height: 20),

          // 3. Sound & Animations Section
          Text(
            'TOVUSH VA ANIMATSIYA',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w800,
              color: colors.muted,
              letterSpacing: 1.1,
            ),
          ),
          const SizedBox(height: 10),
          Material(
            color: colors.card,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(24),
              side: BorderSide(color: colors.border, width: 1.2),
            ),
            clipBehavior: Clip.antiAlias,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
              child: Column(
                children: [
                  SwitchListTile(
                    contentPadding: EdgeInsets.zero,
                    title: Text('Tovush effektlari', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: colors.ink)),
                    subtitle: Text('To‘g‘ri javoblar va tangalar ovozi', style: TextStyle(fontSize: 12, color: colors.muted)),
                    value: _soundEnabled,
                    activeColor: colors.primary,
                    onChanged: (val) => _syncSettings(sound: val),
                  ),
                  Divider(height: 16, color: colors.border),
                  SwitchListTile(
                    contentPadding: EdgeInsets.zero,
                    title: Text('Animatsiyalar', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: colors.ink)),
                    subtitle: Text('Tanga harakati va bayram effektlarini ko‘rsatish', style: TextStyle(fontSize: 12, color: colors.muted)),
                    value: _animationsEnabled,
                    activeColor: colors.primary,
                    onChanged: (val) => _syncSettings(anim: val),
                  ),
                  Divider(height: 16, color: colors.border),
                  SwitchListTile(
                    contentPadding: EdgeInsets.zero,
                    title: Text('Kunlik eslatma', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: colors.ink)),
                    subtitle: Text('Har kuni darslarni eslatish', style: TextStyle(fontSize: 12, color: colors.muted)),
                    value: _dailyReminderEnabled,
                    activeColor: colors.primary,
                    onChanged: (val) => _syncSettings(reminder: val),
                  ),
                  if (_dailyReminderEnabled) ...[
                    ListTile(
                      contentPadding: EdgeInsets.zero,
                      title: Text('Eslatma vaqti', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: colors.ink)),
                      trailing: Chip(
                        label: Text(_reminderTime, style: TextStyle(fontWeight: FontWeight.w800, color: colors.primary)),
                        backgroundColor: colors.primary.withOpacity(0.1),
                      ),
                      onTap: _pickReminderTime,
                    ),
                  ],
                ],
              ),
            ),
          ),

          const SizedBox(height: 20),

          // 4. MathCity PRO Status Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: isPro
                    ? [const Color(0xFF10B981), const Color(0xFF059669)]
                    : [const Color(0xFF6C47FF), const Color(0xFF8B6BFF)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.workspace_premium_rounded, color: Colors.white, size: 28),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        isPro ? 'MathCity Pro faol' : 'MathCity Pro',
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Colors.white),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        isPro ? 'Barcha imkoniyatlar ochiq' : 'Oyiga 29 000 so‘m',
                        style: const TextStyle(fontSize: 13, color: Colors.white70),
                      ),
                    ],
                  ),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: isPro ? const Color(0xFF059669) : colors.primary,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  onPressed: () => context.push('/tariflar'),
                  child: Text(isPro ? 'Boshqarish' : 'Pro olish', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13)),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // 5. Privacy & Security Section
          Text(
            'XAVFSIZLIK VA MAXFIYLIK',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w800,
              color: colors.muted,
              letterSpacing: 1.1,
            ),
          ),
          const SizedBox(height: 10),
          Material(
            color: colors.card,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(24),
              side: BorderSide(color: colors.border, width: 1.2),
            ),
            clipBehavior: Clip.antiAlias,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
              child: Column(
                children: [
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: Icon(Icons.download_rounded, color: colors.primary),
                    title: Text(
                      'O‘quv ma’lumotlarini yuklab olish',
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: colors.ink),
                    ),
                    trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16),
                    onTap: _showExportDataSheet,
                  ),
                  Divider(height: 16, color: colors.border),
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: const Icon(Icons.delete_outline_rounded, color: AppColors.kidsError),
                    title: const Text(
                      'Hisobni o‘chirish',
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.kidsError),
                    ),
                    trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16),
                    onTap: student != null ? () => _showDeleteAccountSheet(student) : null,
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 20),

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
              final confirm = await showDialog<bool>(
                context: context,
                builder: (ctx) => AlertDialog(
                  title: const Text('Hisobdan chiqish'),
                  content: const Text('Haqiqatan ham hisobdan chiqmoqchimisiz?'),
                  actions: [
                    TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Yo‘q')),
                    TextButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Chiqish', style: TextStyle(color: Colors.red))),
                  ],
                ),
              );
              if (confirm == true) {
                await ref.read(studentProvider.notifier).logout();
                if (context.mounted) context.go('/login');
              }
            },
            child: const Text(
              'Hisobdan chiqish',
              style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15),
            ),
          ),

          const SizedBox(height: 20),

          // App Version
          Center(
            child: Text(
              'MathCity AI · v1.0.0 (Toshkent vaqti UTC+5)',
              style: TextStyle(fontSize: 12, color: colors.muted),
            ),
          ),
          const SizedBox(height: 20),
        ],
      ),
    ),
  );
  }
}
