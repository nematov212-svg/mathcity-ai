import 'dart:convert';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/mathcity_bottom_nav.dart';
import '../../shared/models/student_model.dart';
import '../../shared/providers/student_provider.dart';

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> with TickerProviderStateMixin {
  // Animation Controllers
  late AnimationController _entranceController;
  late AnimationController _crownController;
  late AnimationController _starController;
  late AnimationController _arrowController;
  late AnimationController _flameController;
  late AnimationController _shimmerController;
  late AnimationController _xpController;
  late AnimationController _columnGrowthController;

  final ImagePicker _picker = ImagePicker();
  bool _isUploadingAvatar = false;
  int _selectedDayIndex = 4; // 0 = Du, 1 = Se, 2 = Ch, 3 = Pa, 4 = Ju (Default Today), 5 = Sh, 6 = Yak

  final List<({String day, int minutes, bool isToday})> _weeklyDays = const [
    (day: 'Du', minutes: 0, isToday: false),
    (day: 'Se', minutes: 5, isToday: false),
    (day: 'Ch', minutes: 6, isToday: false),
    (day: 'Pa', minutes: 4, isToday: false),
    (day: 'Ju', minutes: 7, isToday: true),
    (day: 'Sh', minutes: 0, isToday: false),
    (day: 'Yak', minutes: 0, isToday: false),
  ];

  @override
  void initState() {
    super.initState();

    _entranceController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..forward();

    _crownController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 3000),
    )..repeat(reverse: true);

    _starController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2200),
    )..repeat(reverse: true);

    _arrowController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..repeat(reverse: true);

    _flameController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1600),
    )..repeat(reverse: true);

    _shimmerController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 3600),
    )..repeat();

    _xpController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1100),
    );
    Future.delayed(const Duration(milliseconds: 500), () {
      if (mounted) _xpController.forward();
    });

    _columnGrowthController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );
    Future.delayed(const Duration(milliseconds: 600), () {
      if (mounted) _columnGrowthController.forward();
    });
  }

  @override
  void dispose() {
    _entranceController.dispose();
    _crownController.dispose();
    _starController.dispose();
    _arrowController.dispose();
    _flameController.dispose();
    _shimmerController.dispose();
    _xpController.dispose();
    _columnGrowthController.dispose();
    super.dispose();
  }

  Future<void> _handleRefresh() async {
    HapticFeedback.lightImpact();
    await ref.read(studentProvider.notifier).refreshProfile();
    _xpController.reset();
    _xpController.forward();
    _columnGrowthController.reset();
    _columnGrowthController.forward();
  }

  void _showAvatarOptions() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        final colors = AppThemeColors.of(context);
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
          decoration: BoxDecoration(
            color: colors.card,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: SafeArea(
            top: false,
            child: Material(
              color: Colors.transparent,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: colors.muted.withOpacity(0.3),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  const SizedBox(height: 18),
                  Text(
                    'Profil rasmini o‘zgartirish',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: colors.ink,
                    ),
                  ),
                  const SizedBox(height: 18),
                  ListTile(
                    leading: Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: colors.primary.withOpacity(0.12),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(Icons.photo_library_rounded, color: colors.primary),
                    ),
                    title: Text(
                      'Galereyadan tanlash',
                      style: TextStyle(fontWeight: FontWeight.w700, color: colors.ink),
                    ),
                    onTap: () {
                      Navigator.pop(ctx);
                      _pickImage(ImageSource.gallery);
                    },
                  ),
                  ListTile(
                    leading: Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: colors.primary.withOpacity(0.12),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(Icons.camera_alt_rounded, color: colors.primary),
                    ),
                    title: Text(
                      'Kameradan olish',
                      style: TextStyle(fontWeight: FontWeight.w700, color: colors.ink),
                    ),
                    onTap: () {
                      Navigator.pop(ctx);
                      _pickImage(ImageSource.camera);
                    },
                  ),
                  ListTile(
                    leading: Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: const Color(0xFFEF4444).withOpacity(0.12),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.delete_outline_rounded, color: Color(0xFFEF4444)),
                    ),
                    title: const Text(
                      'Rasmni o‘chirish',
                      style: TextStyle(fontWeight: FontWeight.w700, color: Color(0xFFEF4444)),
                    ),
                    onTap: () {
                      Navigator.pop(ctx);
                      _removeAvatar();
                    },
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Future<void> _pickImage(ImageSource source) async {
    try {
      final XFile? pickedFile = await _picker.pickImage(
        source: source,
        maxWidth: 512,
        maxHeight: 512,
        imageQuality: 85,
      );

      if (pickedFile == null) return;

      final bytes = await pickedFile.readAsBytes();
      if (bytes.lengthInBytes > 2 * 1024 * 1024) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Rasm hajmi 2 MB dan oshmasligi kerak.'),
            backgroundColor: Color(0xFFEF4444),
          ),
        );
        return;
      }

      setState(() => _isUploadingAvatar = true);

      final base64String = 'data:image/jpeg;base64,${base64Encode(bytes)}';
      final success = await ref.read(studentProvider.notifier).updateAvatar(base64String);

      if (!mounted) return;
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Profil rasmi muvaffaqiyatli yangilandi!'),
            backgroundColor: Color(0xFF10B981),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Rasmni yuklashda xatolik yuz berdi.'),
            backgroundColor: Color(0xFFEF4444),
          ),
        );
      }
    } catch (_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Rasmni tanlashda xatolik yuz berdi.'),
          backgroundColor: Color(0xFFEF4444),
        ),
      );
    } finally {
      if (mounted) setState(() => _isUploadingAvatar = false);
    }
  }

  Future<void> _removeAvatar() async {
    setState(() => _isUploadingAvatar = true);
    await ref.read(studentProvider.notifier).updateAvatar('');
    if (mounted) {
      setState(() => _isUploadingAvatar = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Profil rasmi o‘chirildi.'),
          backgroundColor: Color(0xFF10B981),
        ),
      );
    }
  }

  void _showEditProfileDialog(StudentModel student) {
    final nameController = TextEditingController(text: student.displayName);
    int selectedGrade = student.grade;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) {
          final colors = AppThemeColors.of(context);
          return AlertDialog(
            backgroundColor: colors.card,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
            title: Text(
              'Profilni tahrirlash',
              style: TextStyle(fontWeight: FontWeight.w800, color: colors.ink),
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Ism va familiya', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: colors.muted)),
                const SizedBox(height: 6),
                TextField(
                  controller: nameController,
                  style: TextStyle(color: colors.ink, fontWeight: FontWeight.w600),
                  decoration: InputDecoration(
                    filled: true,
                    fillColor: colors.bg,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: colors.border)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  ),
                ),
                const SizedBox(height: 16),
                Text('Sinf', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: colors.muted)),
                const SizedBox(height: 6),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14),
                  decoration: BoxDecoration(
                    color: colors.bg,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: colors.border),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<int>(
                      value: selectedGrade,
                      isExpanded: true,
                      dropdownColor: colors.card,
                      items: List.generate(11, (i) => i + 1).map((g) {
                        return DropdownMenuItem<int>(
                          value: g,
                          child: Text('$g-sinf', style: TextStyle(color: colors.ink, fontWeight: FontWeight.w600)),
                        );
                      }).toList(),
                      onChanged: (val) {
                        if (val != null) {
                          setDialogState(() => selectedGrade = val);
                        }
                      },
                    ),
                  ),
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: Text('Bekor qilish', style: TextStyle(color: colors.muted, fontWeight: FontWeight.w700)),
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: colors.primary,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                onPressed: () async {
                  final newName = nameController.text.trim();
                  if (newName.isNotEmpty) {
                    await ref.read(studentProvider.notifier).updateProfileDetails(
                      displayName: newName,
                      grade: selectedGrade,
                    );
                  }
                  if (ctx.mounted) Navigator.pop(ctx);
                },
                child: const Text('Saqlash', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
              ),
            ],
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);
    final studentState = ref.watch(studentProvider);
    final student = studentState.student;
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final disableAnim = MediaQuery.of(context).disableAnimations;

    final name = student?.displayName ?? 'Mirzobek Nematov';
    final username = student?.username ?? 'mirzobek';
    final grade = student?.grade ?? 4;
    final coins = student?.coinBalance ?? 0;
    final xp = student?.totalXP ?? 10;
    final level = student?.level ?? 1;
    final nextLevelXP = 100;
    final isPro = student?.subscription.isProActive == true;

    final joinedText = _formatJoinDate(student?.createdAt);

    return Scaffold(
      backgroundColor: colors.bg,
      body: SafeArea(
        bottom: false,
        child: Stack(
          children: [
            // Scrollable Content
            Positioned.fill(
              child: RefreshIndicator(
                onRefresh: _handleRefresh,
                color: colors.primary,
                backgroundColor: colors.card,
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(parent: BouncingScrollPhysics()),
                  padding: const EdgeInsets.only(left: 16, right: 16, top: 12, bottom: 110),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // a) Header
                      _buildEntranceWidget(
                        index: 0,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Profil',
                              style: TextStyle(
                                fontSize: 26,
                                fontWeight: FontWeight.w800,
                                color: colors.ink,
                              ),
                            ),
                            Row(
                              children: [
                                _buildCircleIconButton(
                                  icon: Icons.notifications_none_rounded,
                                  onTap: () {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content: Text('Yangi bildirishnomalar yo‘q.'),
                                        duration: Duration(seconds: 1),
                                      ),
                                    );
                                  },
                                ),
                                const SizedBox(width: 10),
                                _buildCircleIconButton(
                                  icon: isDark ? Icons.wb_sunny_outlined : Icons.dark_mode_outlined,
                                  onTap: () {
                                    ref.read(themeModeProvider.notifier).toggleTheme();
                                    HapticFeedback.selectionClick();
                                  },
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 16),

                      // b) Profile Card
                      _buildEntranceWidget(
                        index: 1,
                        child: Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 22),
                          decoration: BoxDecoration(
                            color: colors.card,
                            borderRadius: BorderRadius.circular(24),
                            border: Border.all(color: colors.border, width: 1.2),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              // Avatar with camera button
                              Center(
                                child: Stack(
                                  clipBehavior: Clip.none,
                                  children: [
                                    Container(
                                      width: 108,
                                      height: 108,
                                      padding: const EdgeInsets.all(3.5),
                                      decoration: const BoxDecoration(
                                        shape: BoxShape.circle,
                                        gradient: LinearGradient(
                                          colors: [Color(0xFF6C47FF), Color(0xFFA58BFF)],
                                          begin: Alignment.topLeft,
                                          end: Alignment.bottomRight,
                                        ),
                                      ),
                                      child: Container(
                                        decoration: BoxDecoration(
                                          shape: BoxShape.circle,
                                          color: isDark ? const Color(0xFF1E1945) : const Color(0xFFEDE9FE),
                                        ),
                                        child: ClipOval(
                                          child: _buildAvatarImage(student?.avatarUrl, colors),
                                        ),
                                      ),
                                    ),

                                    // Uploading loader overlay
                                    if (_isUploadingAvatar)
                                      Positioned.fill(
                                        child: Container(
                                          decoration: BoxDecoration(
                                            shape: BoxShape.circle,
                                            color: Colors.black.withOpacity(0.45),
                                          ),
                                          child: const Center(
                                            child: SizedBox(
                                              width: 28,
                                              height: 28,
                                              child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
                                            ),
                                          ),
                                        ),
                                      ),

                                    // Camera button
                                    Positioned(
                                      right: -2,
                                      bottom: -2,
                                      child: Semantics(
                                        button: true,
                                        label: 'Rasmni o‘zgartirish',
                                        child: InkWell(
                                          onTap: _showAvatarOptions,
                                          borderRadius: BorderRadius.circular(22),
                                          child: Container(
                                            width: 44,
                                            height: 44,
                                            decoration: BoxDecoration(
                                              color: colors.primary,
                                              shape: BoxShape.circle,
                                              border: Border.all(color: colors.card, width: 2.5),
                                              boxShadow: const [
                                                BoxShadow(
                                                  color: Color(0x336C47FF),
                                                  blurRadius: 8,
                                                  offset: Offset(0, 3),
                                                ),
                                              ],
                                            ),
                                            child: const Icon(
                                              Icons.camera_alt_rounded,
                                              color: Colors.white,
                                              size: 20,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),

                              const SizedBox(height: 14),

                              // Name & Subtitle
                              Text(
                                name,
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: 22,
                                  fontWeight: FontWeight.w800,
                                  color: colors.ink,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                '@$username · $grade-sinf o‘quvchisi',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: colors.muted,
                                ),
                              ),

                              const SizedBox(height: 12),

                              // Chips Row: Daraja & Qo'shilgan
                              Wrap(
                                alignment: WrapAlignment.center,
                                spacing: 8,
                                runSpacing: 8,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                                    decoration: BoxDecoration(
                                      color: isDark ? const Color(0xFF281F5E) : const Color(0xFFEDE8FF),
                                      borderRadius: BorderRadius.circular(20),
                                    ),
                                    child: Text(
                                      '$level-daraja',
                                      style: TextStyle(
                                        fontSize: 13,
                                        fontWeight: FontWeight.w800,
                                        color: isDark ? const Color(0xFFC7B3FF) : const Color(0xFF6C47FF),
                                      ),
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                                    decoration: BoxDecoration(
                                      color: isDark ? const Color(0xFF231E48) : const Color(0xFFF3F2F8),
                                      borderRadius: BorderRadius.circular(20),
                                    ),
                                    child: Text(
                                      'Qo‘shilgan: $joinedText',
                                      style: TextStyle(
                                        fontSize: 13,
                                        fontWeight: FontWeight.w600,
                                        color: colors.muted,
                                      ),
                                    ),
                                  ),
                                ],
                              ),

                              const SizedBox(height: 16),

                              // XP Progress Bar
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  AnimatedBuilder(
                                    animation: _xpController,
                                    builder: (context, child) {
                                      final animatedXP = (xp * (disableAnim ? 1.0 : _xpController.value)).round();
                                      return Text(
                                        '$animatedXP XP',
                                        style: TextStyle(
                                          fontSize: 13,
                                          fontWeight: FontWeight.w800,
                                          color: colors.ink,
                                        ),
                                      );
                                    },
                                  ),
                                  Text(
                                    'Keyingi daraja: $nextLevelXP XP',
                                    style: TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w700,
                                      color: colors.muted,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 6),
                              Container(
                                width: double.infinity,
                                height: 8,
                                decoration: BoxDecoration(
                                  color: isDark ? const Color(0xFF2B2456) : const Color(0xFFEBE7F7),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: AnimatedBuilder(
                                  animation: _xpController,
                                  builder: (context, child) {
                                    final progress = (xp / nextLevelXP).clamp(0.05, 1.0);
                                    final animatedWidth = progress * (disableAnim ? 1.0 : _xpController.value);
                                    return FractionallySizedBox(
                                      alignment: Alignment.centerLeft,
                                      widthFactor: animatedWidth,
                                      child: Container(
                                        decoration: BoxDecoration(
                                          borderRadius: BorderRadius.circular(4),
                                          gradient: const LinearGradient(
                                            colors: [Color(0xFF6C47FF), Color(0xFF8B6BFF)],
                                          ),
                                        ),
                                      ),
                                    );
                                  },
                                ),
                              ),

                              const SizedBox(height: 18),

                              // "Profilni tahrirlash" button
                              SizedBox(
                                width: double.infinity,
                                height: 44,
                                child: OutlinedButton(
                                  style: OutlinedButton.styleFrom(
                                    side: BorderSide(color: colors.primary, width: 1.5),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
                                  ),
                                  onPressed: student != null ? () => _showEditProfileDialog(student) : null,
                                  child: Text(
                                    'Profilni tahrirlash',
                                    style: TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w800,
                                      color: colors.primary,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),

                      const SizedBox(height: 16),

                      // c) Pro Card
                      _buildEntranceWidget(
                        index: 2,
                        child: _buildProCard(colors, isPro, disableAnim),
                      ),

                      const SizedBox(height: 16),

                      // d) Three Stat Cards
                      _buildEntranceWidget(
                        index: 3,
                        child: Row(
                          children: [
                            Expanded(
                              child: _buildStatCard(
                                icon: Icons.monetization_on_rounded,
                                iconBg: const Color(0xFFFFF1D6),
                                iconColor: const Color(0xFFF5A623),
                                value: '$coins',
                                label: 'Tangalar',
                                colors: colors,
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: _buildStatCard(
                                icon: Icons.bolt_rounded,
                                iconBg: const Color(0xFFEDE8FF),
                                iconColor: const Color(0xFF6C47FF),
                                value: '$xp',
                                label: 'XP',
                                colors: colors,
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: _buildStatCard(
                                icon: Icons.people_alt_rounded,
                                iconBg: const Color(0xFFE1F6EC),
                                iconColor: const Color(0xFF10B981),
                                value: '${student?.friendsCount ?? 0}',
                                label: 'Do‘stlar',
                                colors: colors,
                              ),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 14),

                      // e) 2x2 Grid Stats
                      _buildEntranceWidget(
                        index: 4,
                        child: Column(
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: _buildDetailStatTile(
                                    icon: Icons.access_time_rounded,
                                    iconBg: const Color(0xFFE5EEFF),
                                    iconColor: const Color(0xFF3B82F6),
                                    value: _formatStudyMinutes(student?.studyMinutes ?? 7),
                                    label: 'O‘qish vaqti',
                                    colors: colors,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: _buildDetailStatTile(
                                    icon: Icons.menu_book_rounded,
                                    iconBg: const Color(0xFFFFF1D6),
                                    iconColor: const Color(0xFFF59E0B),
                                    value: '${student?.completedLessonsCount ?? 1}',
                                    label: 'Darslar',
                                    colors: colors,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Row(
                              children: [
                                Expanded(
                                  child: _buildDetailStatTile(
                                    icon: Icons.local_fire_department_rounded,
                                    iconBg: const Color(0xFFFFE9DB),
                                    iconColor: const Color(0xFFE5611B),
                                    value: '${student?.currentStreak ?? 4} kun',
                                    label: 'Joriy seriya',
                                    colors: colors,
                                    isPulsing: true,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: _buildDetailStatTile(
                                    icon: Icons.emoji_events_rounded,
                                    iconBg: const Color(0xFFEDE8FF),
                                    iconColor: const Color(0xFF6C47FF),
                                    value: '${student?.longestStreak ?? 4} kun',
                                    label: 'Eng uzun seriya',
                                    colors: colors,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 16),

                      // f) Weekly Activity Card
                      _buildEntranceWidget(
                        index: 5,
                        child: Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            color: colors.card,
                            borderRadius: BorderRadius.circular(24),
                            border: Border.all(color: colors.border, width: 1.2),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    'Haftalik faollik',
                                    style: TextStyle(
                                      fontSize: 17,
                                      fontWeight: FontWeight.w800,
                                      color: colors.ink,
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFFFE9DB),
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    child: Row(
                                      children: [
                                        AnimatedBuilder(
                                          animation: _flameController,
                                          builder: (context, child) {
                                            final scale = disableAnim ? 1.0 : 1.0 + _flameController.value * 0.14;
                                            return Transform.scale(
                                              scale: scale,
                                              child: const Icon(Icons.local_fire_department_rounded, color: Color(0xFFE5611B), size: 16),
                                            );
                                          },
                                        ),
                                        const SizedBox(width: 4),
                                        Text(
                                          '${student?.currentStreak ?? 4} kunlik seriya',
                                          style: const TextStyle(
                                            color: Color(0xFFC2500F),
                                            fontSize: 12,
                                            fontWeight: FontWeight.w800,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),

                              const SizedBox(height: 24),

                              // 7 Column Chart
                              SizedBox(
                                height: 130,
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  crossAxisAlignment: CrossAxisAlignment.end,
                                  children: List.generate(_weeklyDays.length, (i) {
                                    final dayData = _weeklyDays[i];
                                    final isSelected = _selectedDayIndex == i;
                                    final hasActivity = dayData.minutes > 0;
                                    final isToday = dayData.isToday;

                                    return Expanded(
                                      child: GestureDetector(
                                        behavior: HitTestBehavior.opaque,
                                        onTap: () {
                                          setState(() => _selectedDayIndex = i);
                                          HapticFeedback.selectionClick();
                                        },
                                        child: Column(
                                          mainAxisAlignment: MainAxisAlignment.end,
                                          children: [
                                            // Tooltip bubble
                                            if (isSelected && dayData.minutes > 0)
                                              Container(
                                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                                margin: const EdgeInsets.only(bottom: 6),
                                                decoration: BoxDecoration(
                                                  color: const Color(0xFF1C1450),
                                                  borderRadius: BorderRadius.circular(8),
                                                  boxShadow: const [
                                                    BoxShadow(
                                                      color: Color(0x33000000),
                                                      blurRadius: 4,
                                                      offset: Offset(0, 2),
                                                    ),
                                                  ],
                                                ),
                                                child: Text(
                                                  '${dayData.minutes} min',
                                                  style: const TextStyle(
                                                    color: Colors.white,
                                                    fontSize: 11,
                                                    fontWeight: FontWeight.w800,
                                                  ),
                                                ),
                                              )
                                            else
                                              const SizedBox(height: 23),

                                            // Bar capsule
                                            AnimatedBuilder(
                                              animation: _columnGrowthController,
                                              builder: (context, child) {
                                                final animVal = disableAnim ? 1.0 : _columnGrowthController.value;
                                                final maxMinutes = 10;
                                                final calculatedHeight = dayData.minutes == 0
                                                    ? 10.0
                                                    : (dayData.minutes / maxMinutes * 84.0).clamp(10.0, 84.0);
                                                final barHeight = calculatedHeight * animVal;

                                                return Container(
                                                  width: 24,
                                                  height: barHeight,
                                                  decoration: BoxDecoration(
                                                    borderRadius: BorderRadius.circular(12),
                                                    gradient: isToday
                                                        ? const LinearGradient(
                                                            colors: [Color(0xFF8B6BFF), Color(0xFF5232D9)],
                                                            begin: Alignment.topCenter,
                                                            end: Alignment.bottomCenter,
                                                          )
                                                        : null,
                                                    color: isToday
                                                        ? null
                                                        : (hasActivity
                                                            ? (isDark ? const Color(0xFF4A3B8C) : const Color(0xFFC9BBFF))
                                                            : (isDark ? const Color(0xFF2A2352) : const Color(0xFFEDEBF7))),
                                                  ),
                                                );
                                              },
                                            ),

                                            const SizedBox(height: 8),

                                            // Day label
                                            Text(
                                              dayData.day,
                                              style: TextStyle(
                                                fontSize: 12,
                                                fontWeight: isToday ? FontWeight.w800 : FontWeight.w600,
                                                color: isToday ? colors.primaryDark : colors.muted,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    );
                                  }),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),

                      const SizedBox(height: 16),

                      // g) Menu Card
                      _buildEntranceWidget(
                        index: 6,
                        child: Container(
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color: colors.card,
                            borderRadius: BorderRadius.circular(24),
                            border: Border.all(color: colors.border, width: 1.2),
                          ),
                          child: Column(
                            children: [
                              _buildMenuItem(
                                icon: Icons.emoji_events_rounded,
                                tileColor: const Color(0xFFFFF1D6),
                                iconColor: const Color(0xFFF59E0B),
                                title: 'Yutuqlarim',
                                subtitle: '${student?.achievementsCount ?? 4} ta medal qo‘lga kiritilgan',
                                colors: colors,
                                onTap: () => context.push('/kids/achievements'),
                              ),
                              _buildDivider(colors),
                              _buildMenuItem(
                                icon: Icons.checklist_rounded,
                                tileColor: const Color(0xFFE1F6EC),
                                iconColor: const Color(0xFF10B981),
                                title: 'Kunlik vazifalar',
                                subtitle: 'Mukofotlarni tekshiring',
                                colors: colors,
                                onTap: () => context.push('/kids/daily-tasks'),
                              ),
                              _buildDivider(colors),
                              _buildMenuItem(
                                icon: Icons.bar_chart_rounded,
                                tileColor: const Color(0xFFEDE8FF),
                                iconColor: const Color(0xFF6C47FF),
                                title: 'O‘quv statistikasi',
                                subtitle: 'Aniqllik va mavzular',
                                colors: colors,
                                onTap: () => context.push('/kids/analytics'),
                              ),
                              _buildDivider(colors),
                              _buildMenuItem(
                                icon: Icons.settings_rounded,
                                tileColor: isDark ? const Color(0xFF2A2452) : const Color(0xFFECEBF3),
                                iconColor: isDark ? const Color(0xFFA9A4CF) : const Color(0xFF6B6785),
                                title: 'Sozlamalar',
                                subtitle: 'Ilova va hisob sozlamalari',
                                colors: colors,
                                onTap: () => context.push('/settings'),
                              ),
                            ],
                          ),
                        ),
                      ),

                      const SizedBox(height: 20),
                    ],
                  ),
                ),
              ),
            ),

            // h) Floating Bottom Navigation Bar
            const Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: MathCityBottomNav(currentIndex: 5),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEntranceWidget({required int index, required Widget child}) {
    final disableAnim = MediaQuery.of(context).disableAnimations;
    if (disableAnim) return child;

    return AnimatedBuilder(
      animation: _entranceController,
      builder: (context, _) {
        final delay = index * 0.07;
        final animVal = (_entranceController.value - delay).clamp(0.0, 1.0) / (1.0 - delay);
        final curved = Curves.easeOutCubic.transform(animVal);
        final opacity = curved.clamp(0.0, 1.0);
        final translateY = 16.0 * (1.0 - curved);

        return Opacity(
          opacity: opacity,
          child: Transform.translate(
            offset: Offset(0, translateY),
            child: child,
          ),
        );
      },
    );
  }

  Widget _buildCircleIconButton({required IconData icon, required VoidCallback onTap}) {
    final colors = AppThemeColors.of(context);
    return Semantics(
      button: true,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(22),
        child: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: colors.card,
            shape: BoxShape.circle,
            border: Border.all(color: colors.border, width: 1.2),
          ),
          child: Icon(icon, color: colors.ink, size: 22),
        ),
      ),
    );
  }

  Widget _buildAvatarImage(String? url, AppThemeColors colors) {
    if (url != null && url.isNotEmpty) {
      if (url.startsWith('data:image')) {
        try {
          final base64Part = url.split(',').last;
          return Image.memory(base64Decode(base64Part), fit: BoxFit.cover);
        } catch (_) {}
      } else if (url.startsWith('http')) {
        return Image.network(url, fit: BoxFit.cover);
      }
    }
    return Icon(
      Icons.person_outline_rounded,
      color: colors.primary,
      size: 56,
    );
  }

  Widget _buildProCard(AppThemeColors colors, bool isPro, bool disableAnim) {
    final student = ref.watch(studentProvider).student;
    int remainingDays = 30;
    String expireDateStr = '30 kun';
    if (student?.subscription.proExpiresAt != null) {
      try {
        final exp = DateTime.parse(student!.subscription.proExpiresAt!);
        remainingDays = exp.difference(DateTime.now()).inDays.clamp(0, 365);
        expireDateStr = '${exp.day.toString().padLeft(2, '0')}.${exp.month.toString().padLeft(2, '0')}.${exp.year}';
      } catch (_) {}
    } else if (student?.subscription.trialExpiresAt != null) {
      try {
        final exp = DateTime.parse(student!.subscription.trialExpiresAt!);
        remainingDays = exp.difference(DateTime.now()).inDays.clamp(0, 365);
        expireDateStr = '${exp.day.toString().padLeft(2, '0')}.${exp.month.toString().padLeft(2, '0')}.${exp.year}';
      } catch (_) {}
    }
    final progressFraction = (remainingDays / 30.0).clamp(0.05, 1.0);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(28),
        gradient: const LinearGradient(
          colors: [Color(0xFF2A1B7A), Color(0xFF5B3BE8), Color(0xFF9B7CFF)],
          begin: Alignment(-0.7, -0.7),
          end: Alignment(0.7, 0.7),
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x335B3BE8),
            blurRadius: 20,
            offset: Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Gold Crown Tile with float & wobble
              AnimatedBuilder(
                animation: _crownController,
                builder: (context, child) {
                  final floatVal = disableAnim ? 0.0 : math.sin(_crownController.value * math.pi * 2) * 4.0;
                  final angle = disableAnim ? 0.0 : (math.sin(_crownController.value * math.pi * 2) * 0.06);
                  return Transform.translate(
                    offset: Offset(0, floatVal),
                    child: Transform.rotate(
                      angle: angle,
                      child: child,
                    ),
                  );
                },
                child: Container(
                  width: 68,
                  height: 68,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(22),
                    gradient: const LinearGradient(
                      colors: [Color(0xFFFFD66B), Color(0xFFF5A623)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    boxShadow: const [
                      BoxShadow(
                        color: Color(0x40F5A623),
                        blurRadius: 12,
                        offset: Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Center(
                    child: Icon(
                      isPro ? Icons.workspace_premium_rounded : Icons.star_rounded,
                      color: const Color(0xFF2A1B7A),
                      size: 38,
                    ),
                  ),
                ),
              ),

              const SizedBox(width: 16),

              // Title, PRO Badge, Price & Sparkles
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2.5),
                          decoration: BoxDecoration(
                            color: isPro ? const Color(0xFF10B981) : const Color(0xFFFFD66B),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            isPro ? 'PRO FAOL' : 'PRO',
                            style: TextStyle(
                              color: isPro ? Colors.white : const Color(0xFF2A1B7A),
                              fontSize: 11,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 0.1,
                            ),
                          ),
                        ),
                        const Spacer(),
                        Icon(
                          Icons.auto_awesome,
                          color: Colors.white.withOpacity(0.85),
                          size: 16,
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      isPro ? 'MathCity Pro faol' : 'MathCity Pro',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      isPro ? 'Pro faol · $remainingDays kun qoldi' : 'Oyiga 29 000 so‘m',
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 14),

          if (isPro) ...[
            // Progress Bar showing remaining Pro days
            ClipRRect(
              borderRadius: BorderRadius.circular(6),
              child: LinearProgressIndicator(
                value: progressFraction,
                minHeight: 8,
                backgroundColor: Colors.white.withOpacity(0.2),
                valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFFFFD66B)),
              ),
            ),
            const SizedBox(height: 6),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Tugash sanasi: $expireDateStr',
                  style: const TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.w600),
                ),
                Text(
                  '$remainingDays kun qoldi',
                  style: const TextStyle(color: Color(0xFFFFD66B), fontSize: 12, fontWeight: FontWeight.w800),
                ),
              ],
            ),
          ] else
            // 3 Benefit Chips
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                _buildProChip('AI Ustoz cheksiz'),
                _buildProChip('Reklamasiz'),
                _buildProChip('Barcha darslar'),
              ],
            ),

          const SizedBox(height: 16),

          // Pro Action Button
          SizedBox(
            width: double.infinity,
            height: 50,
            child: DecoratedBox(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(25),
                gradient: const LinearGradient(
                  colors: [Color(0xFFFFD66B), Color(0xFFF5A623)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x4DFFD66B),
                    blurRadius: 14,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
                ),
                onPressed: () {
                  context.push('/tariflar');
                },
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      isPro ? 'Pro obunani boshqarish' : 'Pro tarifga o‘tish',
                      style: const TextStyle(
                        color: Color(0xFF2A1B7A),
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(width: 8),
                    AnimatedBuilder(
                      animation: _arrowController,
                      builder: (context, child) {
                        final shift = disableAnim ? 0.0 : _arrowController.value * 5.0;
                        return Transform.translate(
                          offset: Offset(shift, 0),
                          child: const Icon(Icons.arrow_forward_rounded, color: Color(0xFF2A1B7A), size: 18),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProChip(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.18),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.check_rounded, color: Colors.white, size: 14),
          const SizedBox(width: 4),
          Text(
            text,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 12,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard({
    required IconData icon,
    required Color iconBg,
    required Color iconColor,
    required String value,
    required String label,
    required AppThemeColors colors,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 10),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: colors.border, width: 1.2),
      ),
      child: Column(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: iconBg,
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: iconColor, size: 20),
          ),
          const SizedBox(height: 10),
          Text(
            value,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w800,
              color: colors.ink,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: colors.muted,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailStatTile({
    required IconData icon,
    required Color iconBg,
    required Color iconColor,
    required String value,
    required String label,
    required AppThemeColors colors,
    bool isPulsing = false,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: colors.border, width: 1.2),
      ),
      child: Row(
        children: [
          AnimatedBuilder(
            animation: _flameController,
            builder: (context, child) {
              final scale = (isPulsing && !MediaQuery.of(context).disableAnimations)
                  ? 1.0 + _flameController.value * 0.14
                  : 1.0;
              return Transform.scale(
                scale: scale,
                child: Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: iconBg,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Icon(icon, color: iconColor, size: 22),
                ),
              );
            },
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w800,
                    color: colors.ink,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: colors.muted,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuItem({
    required IconData icon,
    required Color tileColor,
    required Color iconColor,
    required String title,
    required String subtitle,
    required AppThemeColors colors,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        height: 72,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: tileColor,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(icon, color: iconColor, size: 22),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                      color: colors.ink,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                      color: colors.muted,
                    ),
                  ),
                ],
              ),
            ),
            Icon(Icons.chevron_right_rounded, color: colors.inactive, size: 22),
          ],
        ),
      ),
    );
  }

  Widget _buildDivider(AppThemeColors colors) {
    return Divider(
      height: 1,
      thickness: 1,
      indent: 74,
      endIndent: 16,
      color: colors.border.withOpacity(0.8),
    );
  }

  String _formatJoinDate(String? raw) {
    if (raw == null) return 'Noyabr 2026';
    try {
      final dt = DateTime.parse(raw);
      final months = [
        'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
        'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
      ];
      return '${months[dt.month - 1]} ${dt.year}';
    } catch (_) {
      return 'Noyabr 2026';
    }
  }

  String _formatStudyMinutes(int minutes) {
    if (minutes < 60) return '$minutes min';
    final hours = minutes ~/ 60;
    final remaining = minutes % 60;
    if (remaining == 0) return '$hours soat';
    return '$hours soat $remaining min';
  }
}
