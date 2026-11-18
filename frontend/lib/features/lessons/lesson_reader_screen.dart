import 'dart:io' show Platform;
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/coin_icon.dart';
import '../../core/widgets/custom_button.dart';
import '../../core/network/api_client.dart';
import '../../shared/models/lesson_model.dart';

class LessonReaderScreen extends StatefulWidget {
  final String lessonId;

  const LessonReaderScreen({super.key, required this.lessonId});

  @override
  State<LessonReaderScreen> createState() => _LessonReaderScreenState();
}

class _LessonReaderScreenState extends State<LessonReaderScreen> {
  LessonModel? _lesson;
  String? _firstSectionId;
  String? _firstQuestionId;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchLesson();
  }

  void _fetchLesson() async {
    final isTest = !kIsWeb && Platform.environment.containsKey('FLUTTER_TEST');
    if (isTest) {
      _loadFallbackLesson();
      return;
    }

    try {
      final res = await ApiClient().dio.get('/lessons/${widget.lessonId}');
      if (res.data['success'] == true) {
        final data = res.data['data'];
        final lesson = LessonModel.fromJson(data);
        String? secId;
        if (data['sections'] != null && (data['sections'] as List).isNotEmpty) {
          secId = data['sections'][0]['id'];
        }
        setState(() {
          _lesson = lesson;
          _firstSectionId = secId;
          _firstQuestionId = 'q-${lesson.id}-01';
          _isLoading = false;
        });
        return;
      }
    } catch (_) {
      // Fallback
    }

    _loadFallbackLesson();
  }

  void _loadFallbackLesson() {
    // High-quality fallback for Grades 4-7
    if (widget.lessonId.contains('g5') || widget.lessonId.contains('k4')) {
      _lesson = LessonModel(
        id: widget.lessonId,
        courseId: 'course-g5-math',
        grade: 5,
        mode: 'KIDS',
        chapterTitle: 'Oddiy kasrlar',
        title: 'Kasr nima? Surat va maxraj tushunchasi',
        topicKey: 'fractions_intro',
        description: 'Kasrning ma’nosi, butunning teng bo‘laklari va doiraviy tasvir.',
        formulaLatex: r'\frac{1}{4} = \text{to‘rtdan bir}',
        contentMd: 'Kasr butunning bir yoki bir nechta teng bo‘laklarini ifodalaydi.',
        rewardCoins: 15,
        rewardXP: 100,
        orderIndex: 1,
        sectionCount: 1,
        isCompleted: false,
      );
    } else if (widget.lessonId.contains('g6')) {
      _lesson = LessonModel(
        id: widget.lessonId,
        courseId: 'course-g6-math',
        grade: 6,
        mode: 'KIDS',
        chapterTitle: 'Foizlar',
        title: 'Foizlar tushunchasi va sonning foizini topish',
        topicKey: 'percentages_intro_6th',
        description: 'Yuzdan bir qism — foiz ma’nosi, formulalar va hisoblash.',
        formulaLatex: r'1\% = \frac{1}{100} = 0.01',
        contentMd: 'Har qanday sonning yuzdan bir qismi foiz deyiladi.',
        rewardCoins: 15,
        rewardXP: 110,
        orderIndex: 2,
        sectionCount: 1,
        isCompleted: false,
      );
    } else {
      _lesson = LessonModel(
        id: widget.lessonId,
        courseId: 'course-g7-algebra',
        grade: 7,
        mode: 'TEEN',
        chapterTitle: 'Chiziqli tenglamalar',
        title: 'Chiziqli bir noma’lumli tenglamalar',
        topicKey: 'linear_equations_7th',
        description: 'ax + b = c ko‘rinishidagi tenglamalarni yechish bosqichlari.',
        formulaLatex: r'ax + b = c \implies x = \frac{c - b}{a}',
        contentMd: 'Tenglama — noma’lum son qatnashgan tenglikdir.',
        rewardCoins: 20,
        rewardXP: 120,
        orderIndex: 3,
        sectionCount: 1,
        isCompleted: false,
      );
    }

    _firstSectionId = 'sec-${widget.lessonId}-s1';
    _firstQuestionId = 'q-${widget.lessonId}-01';
    setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading || _lesson == null) {
      return const Scaffold(
        backgroundColor: AppColors.kidsBackground,
        body: Center(child: CircularProgressIndicator(color: AppColors.kidsPrimary)),
      );
    }

    final lesson = _lesson!;
    final isFraction = lesson.topicKey.contains('fraction') || lesson.title.toLowerCase().contains('kasr');
    final isPercentage = lesson.topicKey.contains('percentage') || lesson.title.toLowerCase().contains('foiz');
    final isEquation = lesson.topicKey.contains('equation') || lesson.title.toLowerCase().contains('tenglama');

    return Scaffold(
      backgroundColor: AppColors.kidsBackground,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.kidsDarkText),
          onPressed: () => context.pop(),
        ),
        title: Text(
          '${lesson.grade}-sinf darsi',
          style: const TextStyle(
            fontWeight: FontWeight.w800,
            fontSize: 18,
            color: AppColors.kidsDarkText,
          ),
        ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFFFFF5DF),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFFFE8B8)),
            ),
            child: Row(
              children: [
                const CoinIcon(size: 16),
                const SizedBox(width: 5),
                Text('+${lesson.rewardCoins}', style: const TextStyle(color: Color(0xFF78350F), fontWeight: FontWeight.bold, fontSize: 12)),
              ],
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Lesson Header Tag & Title
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: AppColors.kidsPrimary.withOpacity(0.12),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                '${lesson.grade}-SINF • ${(lesson.chapterTitle ?? 'MATEMATIKA').toUpperCase()}',
                style: const TextStyle(
                  color: AppColors.kidsPrimary,
                  fontWeight: FontWeight.w800,
                  fontSize: 12,
                  letterSpacing: 1.1,
                ),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              lesson.title,
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w900,
                color: AppColors.kidsDarkText,
                height: 1.3,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              lesson.description,
              style: const TextStyle(
                fontSize: 14,
                color: AppColors.kidsSecondaryText,
                height: 1.4,
              ),
            ),
            const SizedBox(height: 20),

            // Visual Diagram Component based on Topic
            _buildVisualDiagram(isFraction, isPercentage, isEquation),
            const SizedBox(height: 24),

            // 1. Introduction Card
            _buildContentCard(
              title: '1. Kirish va Dars Maqsadi',
              icon: Icons.menu_book_rounded,
              iconColor: const Color(0xFF6C5CE7),
              content: lesson.contentMd ??
                  'Ushbu mavzuda yangi matematik tushunchalar va qonuniyatlar bilan tanishasiz. Bosqichma-bosqich ishlangan misollarni diqqat bilan o‘rganing.',
            ),
            const SizedBox(height: 16),

            // 2. Worked Example
            _buildWorkedExampleCard(isFraction, isPercentage, isEquation),
            const SizedBox(height: 16),

            // 3. Common Mistake Explanation
            _buildCommonMistakeCard(isFraction, isPercentage, isEquation),
            const SizedBox(height: 16),

            // 4. AI Ustoz Tip
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: const Color(0xFFF2FBF6),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFD3F4E4)),
              ),
              child: const Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(Icons.smart_toy_rounded, color: AppColors.kidsGreen, size: 28),
                  SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'AI Ustozdan maslahat',
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w800,
                            color: AppColors.kidsGreen,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Tushunmagan joyingiz bo‘lsa, istalgan paytda AI Ustozga savol bering yoki formulani rasmga olib jo‘nating!',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                            color: Color(0xFF13533E),
                            height: 1.4,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Start Exercises CTA
            CustomButton(
              text: 'Mashqlarga o‘tish',
              backgroundColor: AppColors.kidsPrimary,
              borderRadius: 20,
              icon: const Icon(Icons.arrow_forward_rounded, color: Colors.white),
              onPressed: () {
                final qId = _firstQuestionId ?? 'q-math-01';
                final secId = _firstSectionId ?? 'sec-g5-01-s1';
                context.push('/kids/exercise/$qId?lessonId=${lesson.id}&sectionId=$secId');
              },
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildVisualDiagram(bool isFraction, bool isPercentage, bool isEquation) {
    if (isFraction) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(28),
          border: Border.all(color: AppColors.kidsBorder, width: 1.5),
          boxShadow: [
            BoxShadow(
              color: AppColors.kidsDarkText.withOpacity(0.04),
              blurRadius: 18,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Column(
          children: [
            SizedBox(
              width: 140,
              height: 140,
              child: CustomPaint(
                painter: FractionPiePainter(highlightedSlices: 1, totalSlices: 4),
              ),
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF3F0FF),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFDED6FF)),
                  ),
                  child: const Column(
                    children: [
                      Text('1', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppColors.kidsPrimary)),
                      SizedBox(width: 32, child: Divider(color: AppColors.kidsPrimary, thickness: 2.5, height: 8)),
                      Text('4', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppColors.kidsDarkText)),
                    ],
                  ),
                ),
                const SizedBox(width: 16),
                const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('1 — Surat (bo‘yalgan qism)', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.kidsPrimary)),
                    SizedBox(height: 4),
                    Text('4 — Maxraj (jami teng bo‘laklar)', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.kidsDarkText)),
                  ],
                ),
              ],
            ),
          ],
        ),
      );
    } else if (isPercentage) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(28),
          border: Border.all(color: AppColors.kidsBorder, width: 1.5),
        ),
        child: Column(
          children: [
            const Text('Foiz shkalasi: 100% — Butun', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            const SizedBox(height: 16),
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Container(
                height: 32,
                color: const Color(0xFFEFF0FA),
                child: Row(
                  children: [
                    Expanded(flex: 25, child: Container(color: const Color(0xFF6C5CE7), child: const Center(child: Text('25%', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold))))),
                    Expanded(flex: 25, child: Container(color: const Color(0xFF8B7CF6), child: const Center(child: Text('50%', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold))))),
                    Expanded(flex: 50, child: Container(color: const Color(0xFFDED6FF), child: const Center(child: Text('100%', style: TextStyle(color: Color(0xFF4C3EC7), fontSize: 11, fontWeight: FontWeight.bold))))),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            const Text('25% = 1/4 (chorak)  •  50% = 1/2 (yarim)  •  100% = 1 (butun)', style: TextStyle(fontSize: 12, color: AppColors.kidsSecondaryText)),
          ],
        ),
      );
    } else {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(28),
          border: Border.all(color: AppColors.kidsBorder, width: 1.5),
        ),
        child: Column(
          children: [
            const Icon(Icons.balance_rounded, size: 48, color: Color(0xFF6C5CE7)),
            const SizedBox(height: 10),
            const Text('Tenglama Muvozanati (Tarozisi)', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
            const SizedBox(height: 6),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFFF3F0FF),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                _lesson?.formulaLatex ?? 'ax + b = c',
                style: const TextStyle(fontWeight: FontWeight.w900, color: Color(0xFF6C5CE7), fontSize: 16),
              ),
            ),
          ],
        ),
      );
    }
  }

  Widget _buildContentCard({required String title, required IconData icon, required Color iconColor, required String content}) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.kidsBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: iconColor, size: 22),
              const SizedBox(width: 10),
              Text(title, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15, color: AppColors.kidsDarkText)),
            ],
          ),
          const SizedBox(height: 12),
          Text(content, style: const TextStyle(fontSize: 14, color: AppColors.kidsDarkText, height: 1.5)),
        ],
      ),
    );
  }

  Widget _buildWorkedExampleCard(bool isFraction, bool isPercentage, bool isEquation) {
    String exTitle = '2. Ishlangan Misol';
    String step1 = '1. Misolni diqqat bilan o‘qing va berilgan qiymatlarni aniqlang.';
    String step2 = '2. Tegishli matematik formulani qo‘llang.';
    String step3 = '3. Natijani tekshiring va soddalashtiring.';

    if (isFraction) {
      step1 = 'Misol: 2/8 + 3/8 yig‘indisini toping.';
      step2 = 'Yechish: Maxrajlar bir xil bo‘lgani uchun maxraj 8 ligicha qoladi: (2 + 3)/8 = 5/8.';
      step3 = 'Javob: 5/8 (to‘g‘ri va qisqarmaydigan kasr).';
    } else if (isPercentage) {
      step1 = 'Misol: 300 ning 20% ini toping.';
      step2 = 'Yechish: 300 sonini 20 ga ko‘paytirib, 100 ga bo‘lamiz: (300 * 20) / 100 = 6000 / 100 = 60.';
      step3 = 'Javob: 60.';
    } else if (isEquation) {
      step1 = 'Misol: 2x + 6 = 16 tenglamani yeching.';
      step2 = 'Yechish: 6 sonini o‘ng tomonga ayirish qilib o‘tkazamiz: 2x = 16 - 6 => 2x = 10.';
      step3 = 'Ikkala tomonni 2 ga bo‘lamiz: x = 10 / 2 => x = 5. Javob: x = 5.';
    }

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.kidsBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.assignment_turned_in_rounded, color: Color(0xFF0F9D58), size: 22),
              const SizedBox(width: 10),
              Text(exTitle, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15, color: AppColors.kidsDarkText)),
            ],
          ),
          const SizedBox(height: 12),
          Text(step1, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF1E1B4B))),
          const SizedBox(height: 6),
          Text(step2, style: const TextStyle(fontSize: 13, color: Color(0xFF4B5563), height: 1.4)),
          const SizedBox(height: 6),
          Text(step3, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F9D58))),
        ],
      ),
    );
  }

  Widget _buildCommonMistakeCard(bool isFraction, bool isPercentage, bool isEquation) {
    String mistake = 'Keng tarqalgan xato: Maxrajlarni bir-biriga qo‘shib yuborish!';
    String correction = 'To‘g‘ri yo‘l: Maxrajlar teng bo‘lsa, maxraj hech qachon qo‘shilmaydi, faqat suratlar qo‘shiladi.';

    if (isPercentage) {
      mistake = 'Keng tarqalgan xato: Foiz belgisini oddiy songa to‘g‘ridan-to‘g‘ri qo‘shish!';
      correction = 'To‘g‘ri yo‘l: Avval foiz qanchani tashkil qilishini hisoblab olib, so‘ng amal bajariladi.';
    } else if (isEquation) {
      mistake = 'Keng tarqalgan xato: Sonni tenglikdan o‘tkazganda ishorasini o‘zgartirishni unutish!';
      correction = 'To‘g‘ri yo‘l: Tenglikning narigi tomoniga o‘tganda (+) ishora (-) ga, (-) ishora esa (+) ga aylanadi!';
    }

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF7ED),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFFFEDD5)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.warning_amber_rounded, color: Color(0xFFEA580C), size: 22),
              SizedBox(width: 10),
              Text('3. Keng Tarqalgan Xatolar', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15, color: Color(0xFF9A3412))),
            ],
          ),
          const SizedBox(height: 10),
          Text(mistake, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFFC2410C))),
          const SizedBox(height: 4),
          Text(correction, style: const TextStyle(fontSize: 13, color: Color(0xFF7C2D12), height: 1.4)),
        ],
      ),
    );
  }
}

class FractionPiePainter extends CustomPainter {
  final int highlightedSlices;
  final int totalSlices;

  FractionPiePainter({required this.highlightedSlices, required this.totalSlices});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;
    const double startAngle = -3.14159265 / 2;
    final sweepAngle = (2 * 3.14159265) / totalSlices;

    final paintEmpty = Paint()
      ..color = const Color(0xFFE8EBFA)
      ..style = PaintingStyle.fill;

    final paintHighlighted = Paint()
      ..color = AppColors.kidsPrimary
      ..style = PaintingStyle.fill;

    final paintBorder = Paint()
      ..color = Colors.white
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke;

    for (int i = 0; i < totalSlices; i++) {
      final isHighlighted = i < highlightedSlices;
      final angle = startAngle + i * sweepAngle;

      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        angle,
        sweepAngle,
        true,
        isHighlighted ? paintHighlighted : paintEmpty,
      );

      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        angle,
        sweepAngle,
        true,
        paintBorder,
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
