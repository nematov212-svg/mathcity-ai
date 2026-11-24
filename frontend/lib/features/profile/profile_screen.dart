import 'dart:convert';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import '../../core/responsive/app_responsive_scaffold.dart';
import '../../core/responsive/responsive.dart';
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
  int _selectedDayIndex = -1;
  List<Map<String, dynamic>> _weeklyActivity = [];
  bool _isLoadingWeekly = true;
  StudentNotifier? _studentNotifier;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _studentNotifier = ref.read(studentProvider.notifier);
  }

  @override
  void initState() {
    super.initState();
    _loadWeeklyActivity();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(studentProvider.notifier).startHeartbeat();
    });

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
    _studentNotifier?.stopHeartbeat();
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

  Future<void> _loadWeeklyActivity() async {
    final data = await ref.read(studentProvider.notifier).fetchWeeklyActivity();
    if (mounted && data != null && data['week'] != null) {
      setState(() {
        _weeklyActivity = List<Map<String, dynamic>>.from(data['week']);
        _isLoadingWeekly = false;
        final todayIdx = _weeklyActivity.indexWhere((w) => w['isToday'] == true);
        _selectedDayIndex = todayIdx != -1 ? todayIdx : (data['currentDayIndex'] ?? 0);
      });
    } else if (mounted) {
      setState(() {
        _isLoadingWeekly = false;
        if (_weeklyActivity.isEmpty) {
          _weeklyActivity = [
            {'dayKey': 'Du', 'dayName': 'Dushanba', 'minutes': 0, 'lessonsDone': 0, 'problemsSolved': 0, 'isToday': false},
            {'dayKey': 'Se', 'dayName': 'Seshanba', 'minutes': 0, 'lessonsDone': 0, 'problemsSolved': 0, 'isToday': false},
            {'dayKey': 'Ch', 'dayName': 'Chorshanba', 'minutes': 0, 'lessonsDone': 0, 'problemsSolved': 0, 'isToday': false},
            {'dayKey': 'Pa', 'dayName': 'Payshanba', 'minutes': 0, 'lessonsDone': 0, 'problemsSolved': 0, 'isToday': false},
            {'dayKey': 'Ju', 'dayName': 'Juma', 'minutes': 0, 'lessonsDone': 0, 'problemsSolved': 0, 'isToday': false},
            {'dayKey': 'Sh', 'dayName': 'Shanba', 'minutes': 0, 'lessonsDone': 0, 'problemsSolved': 0, 'isToday': true},
            {'dayKey': 'Ya', 'dayName': 'Yakshanba', 'minutes': 0, 'lessonsDone': 0, 'problemsSolved': 0, 'isToday': false},
          ];
          _selectedDayIndex = 5;
        }
      });
    }
  }

  void _showStudyHistorySheet() async {
    HapticFeedback.lightImpact();
    final colors = AppThemeColors.of(context);
    final history = await ref.read(studentProvider.notifier).fetchStudyHistory();
    if (!mounted) return;

    final days = history != null && history['history'] != null
        ? List<Map<String, dynamic>>.from(history['history'])
        : <Map<String, dynamic>>[];
    final totalMin = history != null ? (history['totalMinutes'] ?? 0) : (ref.read(studentProvider).student?.studyMinutes ?? 0);

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (ctx) {
        return Container(
          padding: const EdgeInsets.fromLTRB(24, 16, 24, 32),
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
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'O‘qish vaqti tarixi',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: colors.ink,
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: colors.primary.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      'Jami: $totalMin min',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        color: colors.primary,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              if (days.isEmpty)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 24),
                  child: Center(
                    child: Text(
                      'So‘nggi 7 kunda o‘rganish qayd etilmagan.',
                      style: TextStyle(color: colors.muted, fontSize: 13),
                    ),
                  ),
                )
              else
                ...days.map((d) {
                  return Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    decoration: BoxDecoration(
                      color: colors.field,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: colors.border),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '${d['dayName']} (${d['date']})',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: colors.ink,
                          ),
                        ),
                        Text(
                          '${d['minutes']} daqiqa',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w800,
                            color: colors.primary,
                          ),
                        ),
                      ],
                    ),
                  );
                }),
            ],
          ),
        );
      },
    );
  }

  void _showDayActivityDetail(Map<String, dynamic> day) {
    HapticFeedback.selectionClick();
    final dayName = day['dayName'] ?? day['dayKey'] ?? 'Kun';
    final minutes = day['minutes'] ?? 0;
    final lessons = day['lessonsDone'] ?? 0;
    final problems = day['problemsSolved'] ?? 0;

    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        behavior: SnackBarBehavior.floating,
        backgroundColor: const Color(0xFF1C1450),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        duration: const Duration(seconds: 3),
        content: Text(
          '$dayName · $minutes min · $lessons dars · $problems ta misol',
          style: const TextStyle(fontWeight: FontWeight.w700, color: Colors.white, fontSize: 13),
        ),
      ),
    );
  }

  Future<void> _handleRefresh() async {
    HapticFeedback.lightImpact();
    await Future.wait([
      ref.read(studentProvider.notifier).refreshProfile(),
      _loadWeeklyActivity(),
    ]);
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

    final screenWidth = MediaQuery.of(context).size.width;
    if (screenWidth >= 600) {
      return _buildWideProfile(
        colors: colors,
        isDark: isDark,
        disableAnim: disableAnim,
        student: student,
        name: name,
        username: username,
        grade: grade,
        joinedText: joinedText,
        level: level,
        xp: xp,
        nextLevelXP: nextLevelXP,
        isPro: isPro,
        coins: coins,
      );
    }

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
                              FittedBox(
                                fit: BoxFit.scaleDown,
                                alignment: Alignment.centerLeft,
                                child: SizedBox(
                                  width: 380,
                                  child: Row(
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
                                ),
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
                                  child: GestureDetector(
                                    behavior: HitTestBehavior.opaque,
                                    onTap: _showStudyHistorySheet,
                                    child: _buildDetailStatTile(
                                      icon: Icons.access_time_rounded,
                                      iconBg: const Color(0xFFE5EEFF),
                                      iconColor: const Color(0xFF3B82F6),
                                      value: _formatStudyMinutes(student?.studyMinutes ?? 0),
                                      label: 'Bugun · Tarix >',
                                      colors: colors,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: _buildDetailStatTile(
                                    icon: Icons.menu_book_rounded,
                                    iconBg: const Color(0xFFFFF1D6),
                                    iconColor: const Color(0xFFF59E0B),
                                    value: '${student?.completedLessonsCount ?? 0} dars · ${student?.completedTopicsCount ?? 0} mavzu',
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
                                    value: '${student?.currentStreak ?? 1} kun',
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
                                    value: '${student?.longestStreak ?? 1} kun',
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
                              FittedBox(
                                fit: BoxFit.scaleDown,
                                alignment: Alignment.centerLeft,
                                child: SizedBox(
                                  width: 540,
                                  child: Row(
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
                                          mainAxisSize: MainAxisSize.min,
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
                                              '${student?.currentStreak ?? 1} kunlik seriya',
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
                                ),
                              ),

                              const SizedBox(height: 24),

                              // 7 Column Chart
                              SizedBox(
                                height: 130,
                                child: _isLoadingWeekly
                                    ? const Center(child: CircularProgressIndicator())
                                    : Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        crossAxisAlignment: CrossAxisAlignment.end,
                                        children: List.generate(_weeklyActivity.length, (i) {
                                          final dayData = _weeklyActivity[i];
                                          final isSelected = _selectedDayIndex == i;
                                          final minutes = (dayData['minutes'] ?? 0) as int;
                                          final hasActivity = minutes > 0;
                                          final isToday = dayData['isToday'] == true;
                                          final dayLabel = (dayData['dayKey'] ?? dayData['day'] ?? '') as String;

                                          return Expanded(
                                            child: GestureDetector(
                                              behavior: HitTestBehavior.opaque,
                                              onTap: () {
                                                setState(() => _selectedDayIndex = i);
                                                _showDayActivityDetail(dayData);
                                              },
                                              child: Column(
                                                mainAxisAlignment: MainAxisAlignment.end,
                                                children: [
                                                  // Tooltip bubble
                                                  if (isSelected && minutes > 0)
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
                                                        '$minutes min',
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
                                                      const maxMinutes = 15;
                                                      final calculatedHeight = minutes == 0
                                                          ? 10.0
                                                          : (minutes / maxMinutes * 84.0).clamp(10.0, 84.0);
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
                                                    dayLabel,
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
                                subtitle: isPro
                                    ? '${student?.achievementsCount ?? 0} ta yutuq ochilgan'
                                    : 'Pro tarifda ochiladi',
                                isLocked: !isPro,
                                trailingBadge: isPro ? null : 'PRO',
                                colors: colors,
                                onTap: () => context.push('/kids/achievements'),
                              ),
                              _buildDivider(colors),
                              _buildMenuItem(
                                icon: Icons.checklist_rounded,
                                tileColor: const Color(0xFFE1F6EC),
                                iconColor: const Color(0xFF10B981),
                                title: 'Kunlik vazifalar',
                                subtitle: '3 ta vazifa · Tangalar yuting',
                                colors: colors,
                                onTap: () => context.push('/kids/daily-tasks'),
                              ),
                              _buildDivider(colors),
                              _buildMenuItem(
                                icon: Icons.bar_chart_rounded,
                                tileColor: const Color(0xFFE5EEFF),
                                iconColor: const Color(0xFF3B82F6),
                                title: 'O‘quv statistikasi',
                                subtitle: 'O‘zlashtirish va aniqlik',
                                colors: colors,
                                onTap: () => context.push('/kids/analytics'),
                              ),
                              _buildDivider(colors),
                              _buildMenuItem(
                                icon: isDark ? Icons.dark_mode_rounded : Icons.wb_sunny_rounded,
                                tileColor: isDark ? const Color(0xFF2E2660) : const Color(0xFFEDE9FE),
                                iconColor: colors.primary,
                                title: 'Tungi rejim',
                                subtitle: () {
                                  final mode = ref.watch(themeModeProvider);
                                  if (mode == ThemeMode.dark) return 'Tungi rejim (Faol)';
                                  if (mode == ThemeMode.light) return 'Kunduzgi rejim (Faol)';
                                  return 'Tizim bo‘yicha (Avtomatik)';
                                }(),
                                colors: colors,
                                onTap: () => _showThemeModeDialog(context, colors),
                              ),
                              _buildDivider(colors),
                              _buildMenuItem(
                                icon: Icons.settings_rounded,
                                tileColor: isDark ? const Color(0xFF2A2452) : const Color(0xFFECEBF3),
                                iconColor: isDark ? const Color(0xFFA9A4CF) : const Color(0xFF6B6785),
                                title: 'Sozlamalar',
                                subtitle: 'Mavzu, tovush va xavfsizlik',
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
              child: MathCityBottomNav(currentIndex: 4),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWideProfile({
    required AppThemeColors colors,
    required bool isDark,
    required bool disableAnim,
    required dynamic student,
    required String name,
    required String username,
    required int grade,
    required String joinedText,
    required int level,
    required int xp,
    required int nextLevelXP,
    required bool isPro,
    required int coins,
  }) {
    return ResponsiveBuilder(
      builder: (context, screenType, constraints) {
        final isDesktop = screenType == ScreenType.desktop;

        final profileCard = _buildProfileCardContent(
          colors: colors,
          isDark: isDark,
          disableAnim: disableAnim,
          student: student,
          name: name,
          username: username,
          grade: grade,
          joinedText: joinedText,
          level: level,
          xp: xp,
          nextLevelXP: nextLevelXP,
        );

        final proCard = _buildProCard(colors, isPro, disableAnim);

        final statsCard = _buildStatsSectionContent(
          colors: colors,
          student: student,
          coins: coins,
          xp: xp,
        );

        final weeklyCard = _buildWeeklyActivityContent(
          colors: colors,
          isDark: isDark,
          disableAnim: disableAnim,
          student: student,
        );

        final menuCard = _buildMenuCardContent(
          colors: colors,
          isDark: isDark,
          isPro: isPro,
          student: student,
        );

        final Widget bodyWidget;
        if (isDesktop) {
          bodyWidget = SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 24),
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 1040),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      flex: 5,
                      child: Column(
                        children: [
                          profileCard,
                          const SizedBox(height: 16),
                          statsCard,
                          const SizedBox(height: 16),
                          proCard,
                        ],
                      ),
                    ),
                    const SizedBox(width: 24),
                    Expanded(
                      flex: 5,
                      child: Column(
                        children: [
                          weeklyCard,
                          const SizedBox(height: 16),
                          menuCard,
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        } else {
          bodyWidget = SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 720),
                child: Column(
                  children: [
                    profileCard,
                    const SizedBox(height: 16),
                    proCard,
                    const SizedBox(height: 16),
                    statsCard,
                    const SizedBox(height: 16),
                    weeklyCard,
                    const SizedBox(height: 16),
                    menuCard,
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
          );
        }

        return AppResponsiveScaffold(
          currentNavIndex: 4,
          title: 'Mening profilim',
          phoneBody: const SizedBox.shrink(),
          tabletBody: bodyWidget,
          desktopBody: bodyWidget,
        );
      },
    );
  }

  Widget _buildProfileCardContent({
    required AppThemeColors colors,
    required bool isDark,
    required bool disableAnim,
    required dynamic student,
    required String name,
    required String username,
    required int grade,
    required String joinedText,
    required int level,
    required int xp,
    required int nextLevelXP,
  }) {
    return Container(
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
          Center(
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                Container(
                  width: 96,
                  height: 96,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: colors.primary, width: 3),
                    boxShadow: [
                      BoxShadow(
                        color: colors.primary.withOpacity(0.25),
                        blurRadius: 16,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: ClipOval(
                    child: _buildAvatarImage(student?.avatarUrl, colors),
                  ),
                ),
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
                Positioned(
                  right: -2,
                  bottom: -2,
                  child: MouseRegion(
                    cursor: SystemMouseCursors.click,
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
                          child: const Icon(Icons.camera_alt_rounded, size: 20, color: Colors.white),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),
          Text(
            name,
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: colors.ink),
          ),
          const SizedBox(height: 4),
          Text(
            '@$username · $grade-sinf o‘quvchisi',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: colors.muted),
          ),
          const SizedBox(height: 12),
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
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: colors.muted),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerLeft,
            child: SizedBox(
              width: 380,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  AnimatedBuilder(
                    animation: _xpController,
                    builder: (context, child) {
                      return Text(
                        '$xp XP',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w800,
                          color: colors.primary,
                        ),
                      );
                    },
                  ),
                  Text(
                    'Keyingi daraja: $nextLevelXP XP',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: colors.muted),
                  ),
                ],
              ),
            ),
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
          MouseRegion(
            cursor: SystemMouseCursors.click,
            child: SizedBox(
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
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: colors.primary),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsSectionContent({
    required AppThemeColors colors,
    required dynamic student,
    required int coins,
    required int xp,
  }) {
    return Column(
      children: [
        Row(
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
        const SizedBox(height: 14),
        Column(
          children: [
            Row(
              children: [
                Expanded(
                  child: GestureDetector(
                    behavior: HitTestBehavior.opaque,
                    onTap: _showStudyHistorySheet,
                    child: _buildDetailStatTile(
                      icon: Icons.access_time_rounded,
                      iconBg: const Color(0xFFE5EEFF),
                      iconColor: const Color(0xFF3B82F6),
                      value: _formatStudyMinutes(student?.studyMinutes ?? 0),
                      label: 'Bugun · Tarix >',
                      colors: colors,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildDetailStatTile(
                    icon: Icons.menu_book_rounded,
                    iconBg: const Color(0xFFFFF1D6),
                    iconColor: const Color(0xFFF59E0B),
                    value: '${student?.completedLessonsCount ?? 0} dars · ${student?.completedTopicsCount ?? 0} mavzu',
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
                    value: '${student?.currentStreak ?? 1} kun',
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
                    value: '${student?.longestStreak ?? 1} kun',
                    label: 'Eng uzun seriya',
                    colors: colors,
                  ),
                ),
              ],
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildWeeklyActivityContent({
    required AppThemeColors colors,
    required bool isDark,
    required bool disableAnim,
    required dynamic student,
  }) {
    return Container(
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
          FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerLeft,
            child: SizedBox(
              width: 540,
              child: Row(
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
                      mainAxisSize: MainAxisSize.min,
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
                          '${student?.currentStreak ?? 1} kunlik seriya',
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
            ),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: List.generate(_weeklyActivity.length, (index) {
              final dayData = _weeklyActivity[index];
              final minutes = (dayData['minutes'] ?? 0) as int;
              final hasActivity = minutes > 0;
              final isToday = dayData['isToday'] == true;
              final dayLabel = (dayData['dayKey'] ?? dayData['day'] ?? '') as String;

              return Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 3),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      if (isToday)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          margin: const EdgeInsets.only(bottom: 6),
                          decoration: BoxDecoration(
                            color: colors.primaryDark,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            '$minutes min',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        )
                      else
                        const SizedBox(height: 23),
                      AnimatedBuilder(
                        animation: _columnGrowthController,
                        builder: (context, child) {
                          final animVal = disableAnim ? 1.0 : _columnGrowthController.value;
                          const maxMinutes = 15;
                          final calculatedHeight = minutes == 0
                              ? 10.0
                              : (minutes / maxMinutes * 84.0).clamp(10.0, 84.0);
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
                      Text(
                        dayLabel,
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
        ],
      ),
    );
  }

  Widget _buildMenuCardContent({
    required AppThemeColors colors,
    required bool isDark,
    required bool isPro,
    required dynamic student,
  }) {
    return Container(
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
            subtitle: isPro
                ? '${student?.achievementsCount ?? 0} ta yutuq ochilgan'
                : 'Pro tarifda ochiladi',
            isLocked: !isPro,
            trailingBadge: isPro ? null : 'PRO',
            colors: colors,
            onTap: () => context.push('/kids/achievements'),
          ),
          _buildDivider(colors),
          _buildMenuItem(
            icon: Icons.checklist_rounded,
            tileColor: const Color(0xFFE1F6EC),
            iconColor: const Color(0xFF10B981),
            title: 'Kunlik vazifalar',
            subtitle: '3 ta vazifa · Tangalar yuting',
            colors: colors,
            onTap: () => context.push('/kids/daily-tasks'),
          ),
          _buildDivider(colors),
          _buildMenuItem(
            icon: Icons.bar_chart_rounded,
            tileColor: const Color(0xFFE5EEFF),
            iconColor: const Color(0xFF3B82F6),
            title: 'O‘quv statistikasi',
            subtitle: 'O‘zlashtirish va aniqlik',
            colors: colors,
            onTap: () => context.push('/kids/analytics'),
          ),
          _buildDivider(colors),
          _buildMenuItem(
            icon: isDark ? Icons.dark_mode_rounded : Icons.wb_sunny_rounded,
            tileColor: isDark ? const Color(0xFF2E2660) : const Color(0xFFEDE9FE),
            iconColor: colors.primary,
            title: 'Tungi rejim',
            subtitle: () {
              final mode = ref.watch(themeModeProvider);
              if (mode == ThemeMode.dark) return 'Tungi rejim (Faol)';
              if (mode == ThemeMode.light) return 'Kunduzgi rejim (Faol)';
              return 'Tizim bo‘yicha (Avtomatik)';
            }(),
            colors: colors,
            onTap: () => _showThemeModeDialog(context, colors),
          ),
          _buildDivider(colors),
          _buildMenuItem(
            icon: Icons.settings_rounded,
            tileColor: isDark ? const Color(0xFF2A2452) : const Color(0xFFECEBF3),
            iconColor: isDark ? const Color(0xFFA9A4CF) : const Color(0xFF6B6785),
            title: 'Sozlamalar',
            subtitle: 'Mavzu, tovush va xavfsizlik',
            colors: colors,
            onTap: () => context.push('/settings'),
          ),
        ],
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
                child: FittedBox(
                  fit: BoxFit.scaleDown,
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
    bool isLocked = false,
    String? trailingBadge,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        height: 72,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Row(
          children: [
            Stack(
              clipBehavior: Clip.none,
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
                if (isLocked)
                  Positioned(
                    right: -2,
                    bottom: -2,
                    child: Container(
                      padding: const EdgeInsets.all(3),
                      decoration: const BoxDecoration(
                        color: Color(0xFF1C1450),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.lock_rounded, color: Colors.white, size: 10),
                    ),
                  ),
              ],
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Flexible(
                        child: Text(
                          title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w800,
                            color: colors.ink,
                          ),
                        ),
                      ),
                      if (trailingBadge != null) ...[
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFFD66B),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            trailingBadge,
                            style: const TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFF2A1B7A),
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                      color: isLocked ? colors.primary : colors.muted,
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

  void _showThemeModeDialog(BuildContext context, AppThemeColors colors) {
    final currentMode = ref.read(themeModeProvider);
    showModalBottomSheet(
      context: context,
      backgroundColor: colors.card,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Mavzu rejimini tanlang',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        color: colors.ink,
                      ),
                    ),
                    IconButton(
                      icon: Icon(Icons.close_rounded, color: colors.muted),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                _buildThemeOptionTile(
                  title: 'Kunduzgi rejim',
                  subtitle: 'Yorqin va toza fon',
                  icon: Icons.wb_sunny_rounded,
                  iconColor: const Color(0xFFF59E0B),
                  selected: currentMode == ThemeMode.light,
                  colors: colors,
                  onTap: () {
                    ref.read(themeModeProvider.notifier).setThemeMode(ThemeMode.light);
                    Navigator.pop(context);
                  },
                ),
                const SizedBox(height: 10),
                _buildThemeOptionTile(
                  title: 'Tungi rejim',
                  subtitle: 'Ko‘zga qulay qorong‘i fon',
                  icon: Icons.dark_mode_rounded,
                  iconColor: const Color(0xFF8B6BFF),
                  selected: currentMode == ThemeMode.dark,
                  colors: colors,
                  onTap: () {
                    ref.read(themeModeProvider.notifier).setThemeMode(ThemeMode.dark);
                    Navigator.pop(context);
                  },
                ),
                const SizedBox(height: 10),
                _buildThemeOptionTile(
                  title: 'Tizim bo‘yicha',
                  subtitle: 'Qurilma sozlamasiga avtomatik moslashadi',
                  icon: Icons.settings_brightness_rounded,
                  iconColor: const Color(0xFF3B82F6),
                  selected: currentMode == ThemeMode.system,
                  colors: colors,
                  onTap: () {
                    ref.read(themeModeProvider.notifier).setThemeMode(ThemeMode.system);
                    Navigator.pop(context);
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildThemeOptionTile({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color iconColor,
    required bool selected,
    required AppThemeColors colors,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: selected
              ? colors.primary.withOpacity(0.12)
              : colors.field,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: selected ? colors.primary : colors.border,
            width: selected ? 1.8 : 1.0,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: iconColor.withOpacity(0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: iconColor, size: 22),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: colors.ink,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: TextStyle(
                      fontSize: 12,
                      color: colors.muted,
                    ),
                  ),
                ],
              ),
            ),
            if (selected)
              Icon(Icons.check_circle_rounded, color: colors.primary, size: 22)
            else
              Icon(Icons.circle_outlined, color: colors.inactive, size: 22),
          ],
        ),
      ),
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
