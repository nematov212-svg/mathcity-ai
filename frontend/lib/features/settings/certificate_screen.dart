import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/file_saver.dart';
import '../../core/widgets/animated_math_background.dart';
import '../../core/widgets/xp_coin.dart';
import '../../shared/providers/student_provider.dart';

class CertificateScreen extends ConsumerStatefulWidget {
  const CertificateScreen({super.key});

  @override
  ConsumerState<CertificateScreen> createState() => _CertificateScreenState();
}

class _CertificateScreenState extends ConsumerState<CertificateScreen> {
  final GlobalKey _certificateKey = GlobalKey();
  bool _isExporting = false;

  String _formatDateUz(DateTime date) {
    const months = [
      'Yanvar',
      'Fevral',
      'Mart',
      'Aprel',
      'May',
      'Iyun',
      'Iyul',
      'Avgust',
      'Sentabr',
      'Oktabr',
      'Noyabr',
      'Dekabr',
    ];
    final monthName = months[date.month - 1];
    return '${date.day}-$monthName, ${date.year}';
  }

  Future<Uint8List?> _capturePng() async {
    try {
      final boundary = _certificateKey.currentContext?.findRenderObject()
          as RenderRepaintBoundary?;
      if (boundary == null) return null;
      final image = await boundary.toImage(pixelRatio: 3.0);
      final byteData = await image.toByteData(format: ui.ImageByteFormat.png);
      return byteData?.buffer.asUint8List();
    } catch (e) {
      debugPrint('Sertifikatni rasmga aylantirishda xatolik: $e');
      return null;
    }
  }

  Future<void> _downloadImage(String studentName) async {
    HapticFeedback.lightImpact();
    setState(() => _isExporting = true);
    final bytes = await _capturePng();
    setState(() => _isExporting = false);

    if (bytes != null) {
      final cleanName = studentName.replaceAll(RegExp(r'\s+'), '_');
      final filename = 'MathCity_Sertifikat_$cleanName.png';
      final ok = await saveFileBytes(bytes, filename);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(ok
                ? 'Sertifikat muvaffaqiyatli saqlandi!'
                : 'Sertifikat saqlanmoqda...'),
            backgroundColor: const Color(0xFF10B981),
          ),
        );
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Sertifikatni eksport qilishda xatolik yuz berdi.'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

  void _shareCertificate(String certId, String studentName) {
    HapticFeedback.lightImpact();
    final certInfo =
        'MathCity AI Rasmiy Sertifikati\n'
        'Talaba: $studentName\n'
        'Sertifikat ID: $certId\n'
        'Tasdiqlangan: https://mathcity.uz/verify/$certId';
    Clipboard.setData(ClipboardData(text: certInfo));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Sertifikat ma’lumotlari va havola nusxalandi!'),
        backgroundColor: Color(0xFF6C47FF),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final studentState = ref.watch(studentProvider);
    final student = studentState.student;

    final isPro = student?.subscription.isProActive == true;
    final completedCount = student?.completedLessonsCount ??
        student?.completedLessons.length ??
        0;

    final studentName = (student != null && student.displayName.trim().isNotEmpty)
        ? student.displayName.trim()
        : 'O‘quvchi';

    final certDate = _formatDateUz(DateTime.now());
    final rawId = student?.id ?? 'STUDENT';
    final shortId = rawId.length >= 6 ? rawId.substring(0, 6).toUpperCase() : rawId.toUpperCase();
    final certId = 'MC-CERT-${DateTime.now().year}-$shortId';

    return Scaffold(
      backgroundColor: colors.bg,
      appBar: AppBar(
        backgroundColor: colors.card,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new_rounded, color: colors.ink),
          onPressed: () =>
              context.canPop() ? context.pop() : context.go('/settings'),
        ),
        title: Text(
          'Mening sertifikatim',
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
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 820),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Pro Check Guard
                      if (!isPro)
                        _buildProRequiredCard(colors, isDark)
                      // Completed Lessons Guard
                      else if (completedCount == 0)
                        _buildNoLessonsCard(colors, isDark)
                      // Full Certificate Canvas & Actions
                      else ...[
                        // Certificate Canvas (Paper-style suitable for printing/export)
                        RepaintBoundary(
                          key: _certificateKey,
                          child: _buildCertificateCanvas(
                            studentName: studentName,
                            completedCount: completedCount,
                            totalXp: student?.totalXP ?? 0,
                            level: student?.level ?? 1,
                            dateStr: certDate,
                            certId: certId,
                          ),
                        ),
                        const SizedBox(height: 24),

                        // Action Buttons Bar
                        _buildActionButtons(
                          colors: colors,
                          isDark: isDark,
                          studentName: studentName,
                          certId: certId,
                        ),
                        const SizedBox(height: 32),
                      ],
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

  Widget _buildProRequiredCard(AppThemeColors colors, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: colors.border, width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.06),
            blurRadius: 18,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFFFA000), Color(0xFFFF6F00)],
              ),
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFFFFA000).withValues(alpha: 0.4),
                  blurRadius: 16,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: const Icon(
              Icons.workspace_premium_rounded,
              color: Colors.white,
              size: 40,
            ),
          ),
          const SizedBox(height: 18),
          Text(
            'MathCity Pro talab qilinadi',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w900,
              color: colors.ink,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            'Rasmiy sertifikat olish faqat MathCity Pro obunachilari uchun mavjud. Pro obunaga ulanib, matematika kursini tamomlang va xalqaro namunadagi tasdiqlangan sertifikatga ega bo‘ling!',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 14,
              color: colors.muted,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 22),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF6C47FF),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 14),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              elevation: 4,
            ),
            icon: const Icon(Icons.bolt_rounded),
            label: const Text(
              'Pro obunani ochish',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
            ),
            onPressed: () => context.push('/tariflar'),
          ),
        ],
      ),
    );
  }

  Widget _buildNoLessonsCard(AppThemeColors colors, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: colors.border, width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.06),
            blurRadius: 18,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: const Color(0xFF6C47FF).withValues(alpha: 0.12),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.school_outlined,
              color: Color(0xFF6C47FF),
              size: 40,
            ),
          ),
          const SizedBox(height: 18),
          Text(
            'Sertifikat hali tayyor emas',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w900,
              color: colors.ink,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            'Sertifikat olish uchun kamida 1 ta darsni to‘liq tamomlang. Darslarni o‘rganing, misollarni yeching va rasmiy sertifikatingizni qo‘lga kiriting!',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 14,
              color: colors.muted,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 22),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: colors.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 14),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
            ),
            icon: const Icon(Icons.play_arrow_rounded),
            label: const Text(
              'Darslarga o‘tish',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
            ),
            onPressed: () => context.go('/kids/lessons'),
          ),
        ],
      ),
    );
  }

  Widget _buildCertificateCanvas({
    required String studentName,
    required int completedCount,
    required int totalXp,
    required int level,
    required String dateStr,
    required String certId,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFFFFFDF8),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFD4AF37), width: 3),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFB8860B).withValues(alpha: 0.25),
            blurRadius: 28,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(17),
        child: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Color(0xFFFFFDF8),
                Color(0xFFFBF6E9),
                Color(0xFFFFFDF8),
              ],
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                border: Border.all(
                  color: const Color(0xFFD4AF37).withValues(alpha: 0.6),
                  width: 1.5,
                ),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // Top Academy Badge & Logo
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: const LinearGradient(
                            colors: [Color(0xFF5B21B6), Color(0xFF2563EB)],
                          ),
                          border: Border.all(color: const Color(0xFFD4AF37), width: 1.5),
                        ),
                        child: const Icon(Icons.school_rounded, color: Colors.white, size: 24),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text(
                            'MATHCITY AI AKADEMIYASI',
                            style: TextStyle(
                              fontFamily: 'Nunito',
                              fontSize: 14,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFF1E1B4B),
                              letterSpacing: 2.2,
                            ),
                          ),
                          Text(
                            'ZAMONAVIY MATEMATIKA PLATFORMASI',
                            style: TextStyle(
                              fontFamily: 'Nunito',
                              fontSize: 9,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF78716C),
                              letterSpacing: 1.4,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),

                  const SizedBox(height: 18),

                  // Certificate Heading
                  Text(
                    'SERTIFIKAT',
                    style: TextStyle(
                      fontFamily: 'Nunito',
                      fontSize: 32,
                      fontWeight: FontWeight.w900,
                      color: const Color(0xFFB45309),
                      letterSpacing: 6.0,
                      shadows: [
                        Shadow(
                          color: const Color(0xFFD4AF37).withValues(alpha: 0.3),
                          blurRadius: 4,
                          offset: const Offset(1, 2),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 2),
                  Container(
                    width: 140,
                    height: 2,
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Colors.transparent,
                          Color(0xFFD4AF37),
                          Colors.transparent,
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),
                  const Text(
                    'Ushbu rasmiy sertifikat tasdiqlaydiki,',
                    style: TextStyle(
                      fontFamily: 'Nunito',
                      fontSize: 13,
                      fontStyle: FontStyle.italic,
                      color: Color(0xFF57534E),
                    ),
                  ),
                  const SizedBox(height: 10),

                  // Student Name
                  Text(
                    studentName,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontFamily: 'Nunito',
                      fontSize: 26,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF1E1B4B),
                      letterSpacing: 0.8,
                    ),
                  ),

                  const SizedBox(height: 10),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Text(
                      'Ushbu talaba MathCity AI platformasida boshlang‘ich va o‘rta matematika kursini '
                      'muvaffaqiyatli tamomladi hamda interaktiv amaliy topshiriqlarni a’lo baholar bilan bajardi.',
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontFamily: 'Nunito',
                        fontSize: 13,
                        color: Color(0xFF44403C),
                        height: 1.5,
                      ),
                    ),
                  ),

                  const SizedBox(height: 18),

                  // Achievements Ribbon / Stats
                  Wrap(
                    alignment: WrapAlignment.center,
                    spacing: 12,
                    runSpacing: 8,
                    children: [
                      _buildCertStatPill(
                        icon: Icons.menu_book_rounded,
                        label: 'Tamomlangan darslar',
                        value: '$completedCount ta dars',
                      ),
                      _buildCertStatPill(
                        customIcon: const XpCoin(size: 16, showGlow: false),
                        label: 'To‘plangan XP',
                        value: '$totalXp XP',
                      ),
                      _buildCertStatPill(
                        icon: Icons.military_tech_rounded,
                        label: 'Daraja',
                        value: 'Lvl $level',
                      ),
                    ],
                  ),

                  const SizedBox(height: 22),

                  // Divider
                  Container(
                    width: double.infinity,
                    height: 1,
                    color: const Color(0xFFD4AF37).withValues(alpha: 0.3),
                  ),

                  const SizedBox(height: 18),

                  // Footer: Date & ID, Golden Seal, Digital Signature
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      // Date & ID
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Berilgan sana: $dateStr',
                              style: const TextStyle(
                                fontFamily: 'Nunito',
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF44403C),
                              ),
                            ),
                            const SizedBox(height: 3),
                            Text(
                              'ID: $certId',
                              style: const TextStyle(
                                fontFamily: 'monospace',
                                fontSize: 10,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF78716C),
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Golden Seal Badge
                      _buildGoldenSeal(),

                      // Digital Signature
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            const Text(
                              'MathCity AI',
                              style: TextStyle(
                                fontFamily: 'Nunito',
                                fontSize: 16,
                                fontWeight: FontWeight.w900,
                                fontStyle: FontStyle.italic,
                                color: Color(0xFF1E1B4B),
                              ),
                            ),
                            Container(
                              width: 110,
                              height: 1.5,
                              color: const Color(0xFF1E1B4B).withValues(alpha: 0.4),
                              margin: const EdgeInsets.symmetric(vertical: 4),
                            ),
                            const Text(
                              'Bosh Muhandis & AI Ustoz',
                              style: TextStyle(
                                fontFamily: 'Nunito',
                                fontSize: 9,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF78716C),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCertStatPill({
    IconData? icon,
    Widget? customIcon,
    required String label,
    required String value,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: const Color(0xFFFEF3C7).withValues(alpha: 0.6),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFD4AF37).withValues(alpha: 0.4)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (customIcon != null) customIcon,
          if (icon != null) Icon(icon, size: 16, color: const Color(0xFFB45309)),
          const SizedBox(width: 6),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                label,
                style: const TextStyle(
                  fontSize: 9,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF78716C),
                ),
              ),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF1E1B4B),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildGoldenSeal() {
    return Container(
      width: 62,
      height: 62,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: const RadialGradient(
          colors: [
            Color(0xFFFFDF79),
            Color(0xFFD4AF37),
            Color(0xFFB8860B),
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFD4AF37).withValues(alpha: 0.4),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
        border: Border.all(color: const Color(0xFFFFF2B2), width: 2),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: const [
          Icon(Icons.verified_rounded, color: Colors.white, size: 22),
          SizedBox(height: 1),
          Text(
            'VERIFIED',
            style: TextStyle(
              fontSize: 7,
              fontWeight: FontWeight.w900,
              color: Colors.white,
              letterSpacing: 0.8,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons({
    required AppThemeColors colors,
    required bool isDark,
    required String studentName,
    required String certId,
  }) {
    return Wrap(
      spacing: 12,
      runSpacing: 12,
      alignment: WrapAlignment.center,
      children: [
        ElevatedButton.icon(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF6C47FF),
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            elevation: 3,
          ),
          icon: _isExporting
              ? const SizedBox(
                  width: 18,
                  height: 18,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                  ),
                )
              : const Icon(Icons.image_rounded, size: 20),
          label: const Text(
            'Rasm sifatida saqlash',
            style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14),
          ),
          onPressed: _isExporting ? null : () => _downloadImage(studentName),
        ),
        ElevatedButton.icon(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF10B981),
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            elevation: 3,
          ),
          icon: const Icon(Icons.picture_as_pdf_rounded, size: 20),
          label: const Text(
            'PDF yuklab olish',
            style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14),
          ),
          onPressed: () => _downloadImage(studentName),
        ),
        OutlinedButton.icon(
          style: OutlinedButton.styleFrom(
            side: BorderSide(color: colors.primary, width: 1.5),
            foregroundColor: colors.primary,
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
          ),
          icon: const Icon(Icons.share_rounded, size: 20),
          label: const Text(
            'Ulashish',
            style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14),
          ),
          onPressed: () => _shareCertificate(certId, studentName),
        ),
      ],
    );
  }
}
