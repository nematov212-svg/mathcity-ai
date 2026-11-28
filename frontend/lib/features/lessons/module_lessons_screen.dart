import 'dart:async';
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/network/api_client.dart';
import '../../core/responsive/app_responsive_scaffold.dart';
import '../../core/responsive/screen_size.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/coin_badge.dart';
import '../../core/widgets/animated_math_background.dart';
import '../../shared/models/lesson_model.dart';
import '../../shared/models/module_model.dart';
import '../../shared/providers/student_provider.dart';

class ModuleLessonsScreen extends ConsumerStatefulWidget {
  final String moduleId;

  const ModuleLessonsScreen({super.key, required this.moduleId});

  @override
  ConsumerState<ModuleLessonsScreen> createState() => _ModuleLessonsScreenState();
}

class _ModuleLessonsScreenState extends ConsumerState<ModuleLessonsScreen> {
  
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';
  bool _isLoading = true;
  ModuleModel? _module;
  List<LessonModel> _lessons = [];

  @override
  void initState() {
    super.initState();
    _fetchModuleData();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _fetchModuleData({bool silent = false}) async {
    final isTest = !kIsWeb && Platform.environment.containsKey('FLUTTER_TEST');
    if (isTest) {
      _loadFallbackData();
      return;
    }

    if (!silent) {
      setState(() => _isLoading = true);
    }

    try {
      final res = await ApiClient().dio.get('/modules/${widget.moduleId}/lessons');
      if (res.data != null && res.data['success'] == true) {
        final list = (res.data['data'] as List<dynamic>? ?? [])
            .map((item) => LessonModel.fromJson(item as Map<String, dynamic>))
            .toList();

        // Also fetch module meta
        final modRes = await ApiClient().dio.get('/modules/${widget.moduleId}');
        ModuleModel? mod;
        if (modRes.data != null && modRes.data['success'] == true) {
          mod = ModuleModel.fromJson(modRes.data['data']);
        }

        if (mounted) {
          setState(() {
            _lessons = list;
            _module = mod ?? _createFallbackModule();
            _isLoading = false;
          });
          return;
        }
      }
    } catch (_) {}

    if (mounted) {
      _loadFallbackData();
    }
  }

  ModuleModel _createFallbackModule() {
    final isG2P1 = widget.moduleId == 'module-g2-p1' || widget.moduleId.contains('g2');
    final isP4 = widget.moduleId.contains('p4');
    final isP3 = widget.moduleId.contains('p3');
    final isP2 = widget.moduleId.contains('p2');
    final completedCount = _lessons.where((l) => l.isCompleted).length;

    if (isG2P1) {
      final total = _lessons.isEmpty ? 44 : _lessons.length;
      final pct = (completedCount / total * 100).round();
      final earnedXp = _lessons.fold(0, (acc, l) => acc + (l.isCompleted ? l.rewardXP : 0));
      final totalXp = _lessons.fold(0, (acc, l) => acc + l.rewardXP);
      return ModuleModel(
        id: widget.moduleId,
        grade: 2,
        subject: 'Matematika',
        part: 1,
        title: 'Matematika · 1-qism',
        orderIndex: 1,
        comingSoon: false,
        lessonCount: total,
        questionCount: 880,
        totalMinutes: 318,
        percent: pct,
        earnedXp: earnedXp,
        totalXp: totalXp > 0 ? totalXp : 4095,
      );
    }

    final total = _lessons.isEmpty ? (isP4 ? 33 : (isP3 ? 40 : (isP2 ? 33 : 41))) : _lessons.length;
    final pct = (completedCount / total * 100).round();
    final earnedXp = _lessons.fold(0, (acc, l) => acc + (l.isCompleted ? l.rewardXP : 0));
    final defaultTotalXp = isP4 ? 3275 : (isP3 ? 4060 : (isP2 ? 3160 : 3440));
    final totalXp = _lessons.fold(0, (acc, l) => acc + l.rewardXP);

    return ModuleModel(
      id: widget.moduleId,
      grade: 1,
      subject: 'Matematika',
      part: isP4 ? 4 : (isP3 ? 3 : (isP2 ? 2 : 1)),
      title: isP4
          ? 'Matematika · 4-qism'
          : (isP3
              ? 'Matematika · 3-qism'
              : (isP2 ? 'Matematika · 2-qism' : 'Matematika · 1-qism')),
      orderIndex: isP4 ? 4 : (isP3 ? 3 : (isP2 ? 2 : 1)),
      comingSoon: false,
      lessonCount: total,
      questionCount: isP4 ? 660 : (isP3 ? 800 : (isP2 ? 660 : 820)),
      totalMinutes: isP4 ? 266 : (isP3 ? 341 : (isP2 ? 217 : 244)),
      percent: pct,
      earnedXp: earnedXp,
      totalXp: totalXp > 0 ? totalXp : defaultTotalXp,
    );
  }

  void _loadFallbackData() {
    final isG2P1 = widget.moduleId == 'module-g2-p1' || widget.moduleId.contains('g2');
    final isP4 = widget.moduleId.contains('p4');
    final isP3 = widget.moduleId.contains('p3');
    final isP2 = widget.moduleId.contains('p2');

    if (isG2P1) {
      final partG2P1Def = [
        {'order': 1, 'num': 1, 'rev': false, 'title': 'Takrorlash', 'emoji': '🎒', 'ch': 'I bob. Takrorlash'},
        {'order': 2, 'num': 2, 'rev': false, 'title': 'Bir xonali sonlarni qo‘shish', 'emoji': '🧮', 'ch': 'I bob. Takrorlash'},
        {'order': 3, 'num': 3, 'rev': false, 'title': 'Bir xonali sonlarni ayirish', 'emoji': '➖', 'ch': 'I bob. Takrorlash'},
        {'order': 4, 'num': 4, 'rev': false, 'title': 'Geometrik shakllar', 'emoji': '📐', 'ch': 'I bob. Takrorlash'},
        {'order': 5, 'num': 5, 'rev': false, 'title': '20 ichida qo‘shish va ayirish', 'emoji': '🎯', 'ch': 'I bob. Takrorlash'},
        {'order': 6, 'num': 6, 'rev': false, 'title': '20 ichida qo‘shish va ayirish', 'emoji': '⚽', 'ch': 'I bob. Takrorlash'},
        {'order': 7, 'num': 7, 'rev': false, 'title': 'Sonlarni taqqoslash', 'emoji': '⚖️', 'ch': 'I bob. Takrorlash'},
        {'order': 8, 'num': 8, 'rev': false, 'title': 'Masalalar yechish', 'emoji': '📝', 'ch': 'I bob. Takrorlash'},
        {'order': 9, 'num': 9, 'rev': false, 'title': 'Sonlarni qo‘shish va ayirish', 'emoji': '🐪', 'ch': 'II bob. Xona birliklari va yaxlit sonlar bilan amallar'},
        {'order': 10, 'num': 10, 'rev': false, 'title': 'O‘nliklar', 'emoji': '🗺️', 'ch': 'II bob. Xona birliklari va yaxlit sonlar bilan amallar'},
        {'order': 11, 'num': 11, 'rev': false, 'title': '100 ichida sonlar', 'emoji': '🦩', 'ch': 'II bob. Xona birliklari va yaxlit sonlar bilan amallar'},
        {'order': 12, 'num': 12, 'rev': false, 'title': '100 ichida sonlar', 'emoji': '💧', 'ch': 'II bob. Xona birliklari va yaxlit sonlar bilan amallar'},
        {'order': 13, 'num': 13, 'rev': false, 'title': 'Sonlarni taqqoslash', 'emoji': '⛸️', 'ch': 'II bob. Xona birliklari va yaxlit sonlar bilan amallar'},
        {'order': 14, 'num': 14, 'rev': false, 'title': 'Sonlarni ayirish (30 - 7)', 'emoji': '📅', 'ch': 'II bob. Xona birliklari va yaxlit sonlar bilan amallar'},
        {'order': 15, 'num': 15, 'rev': false, 'title': 'Sonlarni qo‘shish (21 + 39)', 'emoji': '🤝', 'ch': 'II bob. Xona birliklari va yaxlit sonlar bilan amallar'},
        {'order': 16, 'num': 16, 'rev': false, 'title': 'Sonlarni qo‘shish (21 + 39)', 'emoji': '⛏️', 'ch': 'II bob. Xona birliklari va yaxlit sonlar bilan amallar'},
        {'order': 17, 'num': 17, 'rev': false, 'title': 'Ayirish (50 - 22)', 'emoji': '🧭', 'ch': 'II bob. Xona birliklari va yaxlit sonlar bilan amallar'},
        {'order': 18, 'num': 18, 'rev': false, 'title': 'Ayirish (50 - 22)', 'emoji': '🌱', 'ch': 'II bob. Xona birliklari va yaxlit sonlar bilan amallar'},
        {'order': 19, 'num': 0, 'rev': true, 'title': 'Mavzu bo‘yicha yakuniy dars', 'emoji': '🌍', 'ch': 'II bob. Xona birliklari va yaxlit sonlar bilan amallar', 'xp': 130, 'coin': 15},
        {'order': 20, 'num': 20, 'rev': false, 'title': 'Sonlarni qo‘shish (25 + 6)', 'emoji': '🏗️', 'ch': 'III bob. Xonadan o‘tib qo‘shish va ayirish'},
        {'order': 21, 'num': 21, 'rev': false, 'title': 'Sonlarni qo‘shish (25 + 6)', 'emoji': '🚇', 'ch': 'III bob. Xonadan o‘tib qo‘shish va ayirish'},
        {'order': 22, 'num': 22, 'rev': false, 'title': 'Sonlarni qo‘shish (6 + 25)', 'emoji': '🍳', 'ch': 'III bob. Xonadan o‘tib qo‘shish va ayirish'},
        {'order': 23, 'num': 23, 'rev': false, 'title': 'Sonlarni ayirish (33 - 7)', 'emoji': '🏫', 'ch': 'III bob. Xonadan o‘tib qo‘shish va ayirish'},
        {'order': 24, 'num': 24, 'rev': false, 'title': 'Sonlarni ayirish (43 - 7)', 'emoji': '🧸', 'ch': 'III bob. Xonadan o‘tib qo‘shish va ayirish'},
        {'order': 25, 'num': 25, 'rev': false, 'title': 'Sonlarni ayirish (43 - 7)', 'emoji': '🎲', 'ch': 'III bob. Xonadan o‘tib qo‘shish va ayirish'},
        {'order': 26, 'num': 26, 'rev': false, 'title': 'Sonlarni qo‘shish (28 + 14)', 'emoji': '📱', 'ch': 'III bob. Xonadan o‘tib qo‘shish va ayirish'},
        {'order': 27, 'num': 26, 'rev': false, 'title': 'Sonlarni qo‘shish (28 + 14)', 'emoji': '💻', 'ch': 'III bob. Xonadan o‘tib qo‘shish va ayirish'},
        {'order': 28, 'num': 27, 'rev': false, 'title': 'Ustun ko‘rinishida qo‘shish va ayirish', 'emoji': '🤖', 'ch': 'IV bob. Ustun ko‘rinishida hisoblash'},
        {'order': 29, 'num': 28, 'rev': false, 'title': 'Sonlarni ayirish (43 - 16)', 'emoji': '🎨', 'ch': 'IV bob. Ustun ko‘rinishida hisoblash'},
        {'order': 30, 'num': 29, 'rev': false, 'title': 'Sonlarni ayirish (43 - 16)', 'emoji': '🍰', 'ch': 'IV bob. Ustun ko‘rinishida hisoblash'},
        {'order': 31, 'num': 30, 'rev': false, 'title': 'Ustun ko‘rinishida qo‘shish', 'emoji': '🗣️', 'ch': 'IV bob. Ustun ko‘rinishida hisoblash'},
        {'order': 32, 'num': 31, 'rev': false, 'title': 'Qo‘shishning xossalari', 'emoji': '🌳', 'ch': 'IV bob. Ustun ko‘rinishida hisoblash'},
        {'order': 33, 'num': 32, 'rev': false, 'title': 'Ustun ko‘rinishida ayirish', 'emoji': '🛎️', 'ch': 'IV bob. Ustun ko‘rinishida hisoblash'},
        {'order': 34, 'num': 33, 'rev': false, 'title': 'Og‘zaki hisoblash usullari', 'emoji': '🧠', 'ch': 'IV bob. Ustun ko‘rinishida hisoblash'},
        {'order': 35, 'num': 34, 'rev': false, 'title': 'Yig‘indidan sonni ayirish', 'emoji': '✈️', 'ch': 'V bob. Yig‘indi va ayirma xossalari, masalalar'},
        {'order': 36, 'num': 35, 'rev': false, 'title': 'Yig‘indidan sonni ayirish', 'emoji': '🐮', 'ch': 'V bob. Yig‘indi va ayirma xossalari, masalalar'},
        {'order': 37, 'num': 36, 'rev': false, 'title': 'Sondan yig‘indini ayirish', 'emoji': '🖥️', 'ch': 'V bob. Yig‘indi va ayirma xossalari, masalalar'},
        {'order': 38, 'num': 37, 'rev': false, 'title': 'Sondan yig‘indini ayirish', 'emoji': '🎓', 'ch': 'V bob. Yig‘indi va ayirma xossalari, masalalar'},
        {'order': 39, 'num': 38, 'rev': false, 'title': 'Masalalar yechish va o‘tilgan mavzularni mustahkamlash', 'emoji': '🏥', 'ch': 'V bob. Yig‘indi va ayirma xossalari, masalalar'},
        {'order': 40, 'num': 39, 'rev': false, 'title': 'Masalalar yechish', 'emoji': '💳', 'ch': 'V bob. Yig‘indi va ayirma xossalari, masalalar'},
        {'order': 41, 'num': 0, 'rev': true, 'title': 'Mavzu bo‘yicha yakuniy dars', 'emoji': '💡', 'ch': 'V bob. Yig‘indi va ayirma xossalari, masalalar', 'xp': 130, 'coin': 15},
        {'order': 42, 'num': 40, 'rev': false, 'title': 'Amaliy topshiriqlar', 'emoji': '🏃', 'ch': 'VI bob. Amaliy topshiriqlar'},
        {'order': 43, 'num': 41, 'rev': false, 'title': 'Amaliy topshiriqlar', 'emoji': '🏅', 'ch': 'VI bob. Amaliy topshiriqlar'},
        {'order': 44, 'num': 0, 'rev': true, 'title': 'Amaliy topshiriqlar', 'emoji': '🧩', 'ch': 'VI bob. Amaliy topshiriqlar', 'xp': 140, 'coin': 15},
      ];

      final list = List.generate(partG2P1Def.length, (index) {
        final item = partG2P1Def[index];
        final order = item['order'] as int;
        final bookNum = item['num'] as int;
        final isRev = item['rev'] as bool;
        final title = item['title'] as String;
        final emoji = item['emoji'] as String;
        final ch = item['ch'] as String;
        final xp = (item['xp'] as int?) ?? 90;
        final coin = (item['coin'] as int?) ?? 10;
        final pad = order.toString().padLeft(2, '0');

        return LessonModel(
          id: 'lesson-g2-$pad',
          courseId: 'course-g2-p1',
          moduleId: widget.moduleId,
          grade: 2,
          mode: 'KIDS',
          title: title,
          chapterTitle: ch,
          topicKey: 'topic-g2-$pad',
          description: isRev
              ? 'Mavzular bo‘yicha 20 ta savolli yakuniy test.'
              : '2-sinf matematika 1-qism bo‘yicha $order-dars.',
          emoji: emoji,
          rewardXP: xp,
          rewardCoins: coin,
          orderIndex: order,
          bookNumber: bookNum,
          isReview: isRev,
          sectionCount: 20,
          isCompleted: false,
          isLocked: order > 1,
          completedSteps: 0,
          percent: 0,
          bestPercent: 0,
          estMinutes: isRev ? 10 : 7,
        );
      });

      setState(() {
        _lessons = list;
        _module = _createFallbackModule();
        _isLoading = false;
      });
      return;
    }

    if (isP4) {
      final part4Def = [
        {'num': 112, 'title': 'Kesma va uning uzunligi', 'emoji': '📏'},
        {'num': 113, 'title': 'Berilgan uzunlikda kesma chizish', 'emoji': '✏️'},
        {'num': 114, 'title': 'Kesma xossalari', 'emoji': '⚖️'},
        {'num': 115, 'title': 'Siniq chiziqning uzunligi', 'emoji': '📈'},
        {'num': 116, 'title': 'Ko‘pburchak', 'emoji': '🔷'},
        {'num': 117, 'title': 'Ko‘pburchakning perimetri', 'emoji': '📐'},
        {'num': 118, 'title': 'Ko‘pburchakning perimetri (2)', 'emoji': '📏'},
        {'num': 119, 'title': 'To‘g‘ri to‘rtburchak va kvadrat', 'emoji': '🟨'},
        {'num': 120, 'title': 'To‘g‘ri to‘rtburchak va kvadrat (2)', 'emoji': '🟧'},
        {'num': 121, 'title': 'Burchak', 'emoji': '📐'},
        {'num': 122, 'title': 'To‘rtburchaklar', 'emoji': '🔷'},
        {'num': 123, 'title': 'Sohalar va chegaralar', 'emoji': '🗺️'},
        {'num': 124, 'title': 'Teng shakllar', 'emoji': '🟰'},
        {'num': 125, 'title': 'Alohida berilgan qismlardan shakllar tuzish', 'emoji': '🧩'},
        {'num': 126, 'title': 'Simmetriya', 'emoji': '🦋'},
        {'num': 127, 'title': 'Simmetriya o‘qlariga ega bo‘lgan yassi shakllar', 'emoji': '🔶'},
        {'num': 128, 'title': 'Hajmli shakllar', 'emoji': '🧊'},
        {'num': 129, 'title': 'Tenglik va tengsizliklar', 'emoji': '⚖️'},
        {'num': 130, 'title': 'Sonli va harfiy ifodalar', 'emoji': '🔤'},
        {'num': 131, 'title': 'Ifoda', 'emoji': '✍️'},
        {'num': 132, 'title': 'Ifodalarning qiymatlarini taqqoslash', 'emoji': '🔍'},
        {'num': 133, 'title': 'Ifodaning qiymatini hisoblash', 'emoji': '🧮'},
        {'num': 134, 'title': 'Matematik amallarning xossalari', 'emoji': '🔁'},
        {'num': 135, 'title': 'Sonli va harfiy tengsizliklar', 'emoji': '↔️'},
        {'num': 136, 'title': 'Rim raqamlari', 'emoji': '🏛️'},
        {'num': 137, 'title': 'Tenglamalar', 'emoji': '🧩'},
        {'num': 138, 'title': 'Tenglamalar (2)', 'emoji': '🪜'},
        {'num': 139, 'title': 'Tenglamalar (3)', 'emoji': '🌳'},
        {'num': 140, 'title': 'Masalalarni tenglamalar yordamida yechish', 'emoji': '🏅'},
        {'num': 141, 'title': 'Masalalarni tenglamalar yordamida yechish (2)', 'emoji': '🎳'},
        {'num': 142, 'title': 'Takrorlash (1)', 'emoji': '🏪'},
        {'num': 143, 'title': 'Takrorlash (2)', 'emoji': '📚'},
        {'num': 144, 'title': 'Takrorlash (3)', 'emoji': '🎓'},
      ];

      final list = List.generate(part4Def.length, (index) {
        final item = part4Def[index];
        final order = index + 1;
        final bookNum = item['num'] as int;
        final isRev = bookNum >= 142;
        return LessonModel(
          id: 'lesson-g1-p4-$bookNum',
          courseId: 'course-g1-p4',
          moduleId: widget.moduleId,
          grade: 1,
          mode: 'KIDS',
          title: item['title'] as String,
          chapterTitle: _getPart4Chapter(bookNum),
          topicKey: 'topic-g1-p4-$bookNum',
          description: '1-sinf matematika 4-qism $bookNum-mavzu.',
          emoji: item['emoji'] as String,
          rewardXP: (isRev || bookNum >= 137 || bookNum == 133 || bookNum == 135) ? 115 : 95,
          rewardCoins: (isRev || bookNum >= 137 || bookNum == 133 || bookNum == 135) ? 12 : 10,
          orderIndex: order,
          bookNumber: bookNum,
          sectionCount: 20,
          isCompleted: false,
          isLocked: order > 1,
          completedSteps: 0,
          percent: 0,
          bestPercent: 0,
          estMinutes: 8,
        );
      });

      setState(() {
        _lessons = list;
        _module = _createFallbackModule();
        _isLoading = false;
      });
      return;
    }

    if (isP3) {
      final part3Def = [
        // I bob (1-11) + Nazorat (12)
        {'num': 1, 'rev': false, 'title': 'Masalaning tarkibi'},
        {'num': 2, 'rev': false, 'title': 'Masala yechish'},
        {'num': 3, 'rev': false, 'title': 'Masala yechish (2)'},
        {'num': 4, 'rev': false, 'title': 'Teskari masalalar'},
        {'num': 5, 'rev': false, 'title': 'Teskari masalalar (2)'},
        {'num': 6, 'rev': false, 'title': 'Masalalar yechish (mustahkamlash)'},
        {'num': 7, 'rev': false, 'title': 'Bir necha birlikka orttirish'},
        {'num': 8, 'rev': false, 'title': 'Bir necha birlikka kamaytirish'},
        {'num': 9, 'rev': false, 'title': 'Qavsli ifodalar'},
        {'num': 10, 'rev': false, 'title': 'Qavsli ifodalar (2)'},
        {'num': 11, 'rev': false, 'title': 'Masalalar yechish (takrorlash)'},
        {'num': 12, 'rev': true, 'title': '1-nazorat ishi'},
        // II bob (14-26) + Nazorat (27)
        {'num': 14, 'rev': false, 'title': 'Bir necha birlik ortiq sonni topish'},
        {'num': 15, 'rev': false, 'title': 'Bir necha birlik ortiq sonni topish (2)'},
        {'num': 16, 'rev': false, 'title': 'Bir necha birlik kam sonni topish'},
        {'num': 17, 'rev': false, 'title': 'Bir necha birlik kam sonni topish (2)'},
        {'num': 18, 'rev': false, 'title': 'Taqqoslashga doir masalalar'},
        {'num': 19, 'rev': false, 'title': 'Taqqoslashga doir masalalar (2)'},
        {'num': 20, 'rev': false, 'title': 'Taqqoslashga doir masalalar (3)'},
        {'num': 21, 'rev': false, 'title': 'Taqqoslashga doir masalalar (4)'},
        {'num': 22, 'rev': false, 'title': 'Vaqt. Hafta kunlari'},
        {'num': 23, 'rev': false, 'title': 'Soat. Minut'},
        {'num': 24, 'rev': false, 'title': 'Soat. Minut (2)'},
        {'num': 25, 'rev': false, 'title': 'Kombinatorik masalalar'},
        {'num': 26, 'rev': false, 'title': 'Masalalar yechish (takrorlash)'},
        {'num': 27, 'rev': true, 'title': '2-nazorat ishi'},
        // III bob (30-42) + Nazorat (43)
        {'num': 30, 'rev': false, 'title': 'Uzunlik va uzunlik birliklari'},
        {'num': 31, 'rev': false, 'title': 'Santimetr va detsimetr'},
        {'num': 32, 'rev': false, 'title': 'Detsimetr ustida amallar'},
        {'num': 33, 'rev': false, 'title': 'Massa va massa birliklari'},
        {'num': 34, 'rev': false, 'title': 'Massa va massa birliklari (2)'},
        {'num': 35, 'rev': false, 'title': 'Kilogramm ustida amallar'},
        {'num': 36, 'rev': false, 'title': 'Tarozi va toshlar'},
        {'num': 37, 'rev': false, 'title': 'Hajm va hajm birliklari'},
        {'num': 38, 'rev': false, 'title': 'Hajm va hajm birliklari (2)'},
        {'num': 39, 'rev': false, 'title': 'Kattaliklar: uzunlik, massa, hajm'},
        {'num': 40, 'rev': false, 'title': 'Kattaliklar va ularning xossalari'},
        {'num': 41, 'rev': false, 'title': 'Kattaliklar va ularning xossalari (2)'},
        {'num': 42, 'rev': false, 'title': 'Masalalar yechish (takrorlash)'},
        {'num': 43, 'rev': true, 'title': '3-nazorat ishi'},
      ];

      final list = List.generate(part3Def.length, (index) {
        final item = part3Def[index];
        final order = index + 1;
        final bookNum = item['num'] as int;
        final isRev = item['rev'] as bool;
        final title = item['title'] as String;

        return LessonModel(
          id: 'lesson-g1-p3-${bookNum.toString().padLeft(2, '0')}',
          courseId: 'course-g1-p3',
          moduleId: widget.moduleId,
          grade: 1,
          mode: 'KIDS',
          title: title,
          chapterTitle: _getPart3Chapter(bookNum),
          topicKey: 'topic-g1-p3-$bookNum',
          description: isRev
              ? 'Mavzular bo‘yicha 20 ta savolli nazorat testi.'
              : '1-sinf matematika 3-qism bo‘yicha $bookNum-mavzu.',
          emoji: isRev ? '📝' : _getPart3Emoji(bookNum),
          rewardXP: isRev ? 120 : 100,
          rewardCoins: isRev ? 12 : 10,
          orderIndex: order,
          bookNumber: bookNum,
          isReview: isRev,
          sectionCount: 20,
          isCompleted: false,
          isLocked: order > 1,
          completedSteps: 0,
          percent: 0,
          bestPercent: 0,
          estMinutes: isRev ? 15 : 8,
        );
      });

      setState(() {
        _lessons = list;
        _module = _createFallbackModule();
        _isLoading = false;
      });
      return;
    }

    final count = isP2 ? 33 : 41;
    final startBookNum = isP2 ? 42 : 1;

    final list = List.generate(count, (index) {
      final order = index + 1;
      final bookNum = startBookNum + index;
      return LessonModel(
        id: 'lesson-g1-${bookNum.toString().padLeft(2, '0')}',
        courseId: isP2 ? 'course-g1-p2' : 'course-g1-p1',
        moduleId: widget.moduleId,
        grade: 1,
        mode: 'KIDS',
        title: _getFallbackTitle(bookNum),
        chapterTitle: _getFallbackChapter(bookNum),
        topicKey: 'topic-g1-$bookNum',
        description: '1-sinf matematika fani bo‘yicha $bookNum-mavzu.',
        emoji: _getFallbackEmoji(bookNum),
        rewardXP: (bookNum == 50 || bookNum == 51 || bookNum >= 70) ? 100 : 90,
        rewardCoins: (bookNum >= 70) ? 12 : 10,
        orderIndex: order,
        bookNumber: bookNum,
        sectionCount: 20,
        isCompleted: !isP2 && order == 1,
        isLocked: isP2 ? true : (order > 2),
        completedSteps: (!isP2 && order == 1) ? 5 : 0,
        percent: (!isP2 && order == 1) ? 100 : 0,
        bestPercent: (!isP2 && order == 1) ? 100 : 0,
        estMinutes: 7,
      );
    });

    setState(() {
      _lessons = list;
      _module = _createFallbackModule();
      _isLoading = false;
    });
  }

  String _getPart4Chapter(int bookNum) {
    if (bookNum <= 115) return 'I bob. Kesma va siniq chiziq';
    if (bookNum <= 128) return 'II bob. Geometrik shakllar';
    if (bookNum <= 136) return 'III bob. Ifodalar va tengsizliklar';
    if (bookNum <= 141) return 'IV bob. Tenglamalar';
    return 'V bob. Takrorlash';
  }

  String _getPart3Chapter(int bookNum) {
    if (bookNum <= 11) return 'I bob. Masala va uning yechilishi';
    if (bookNum == 12) return 'I bob. 1-nazorat ishi';
    if (bookNum <= 26) return 'II bob. Orttirish, kamaytirish va taqqoslash';
    if (bookNum == 27) return 'II bob. 2-nazorat ishi';
    if (bookNum <= 42) return 'III bob. Kattaliklar (uzunlik, massa, hajm)';
    return 'III bob. 3-nazorat ishi';
  }

  String _getPart3Emoji(int bookNum) {
    const emojis = {
      1: '🧩', 2: '💡', 3: '✍️', 4: '🔄', 5: '🔁',
      6: '🏆', 7: '➕', 8: '➖', 9: '🧮', 10: '🎯',
      11: '📚', 12: '📝', 14: '📈', 15: '📊', 16: '📉',
      17: '📉', 18: '🔍', 19: '🔎', 20: '⚖️', 21: '🔍',
      22: '📅', 23: '⏰', 24: '⏱️', 25: '🎲', 26: '🏆',
      27: '📝', 30: '📏', 31: '📐', 32: '📏', 33: '⚖️',
      34: '⚖️', 35: '🎒', 36: '⚖️', 37: '🛢️', 38: '🥤',
      39: '📦', 40: '🎂', 41: '🧪', 42: '🏆', 43: '📝',
    };
    return emojis[bookNum] ?? '📘';
  }

  String _getFallbackChapter(int bookNum) {
    if (bookNum <= 8) return 'I bob. Narsalar va ularning xossalari';
    if (bookNum <= 29) return 'II bob. 1 dan 10 gacha bo‘lgan sonlar';
    if (bookNum <= 41) return 'III bob. Ifodalar, tengliklar va xossalar';
    if (bookNum <= 57) return 'IV bob. 11 dan 20 gacha bo‘lgan sonlar va amallar';
    if (bookNum <= 62) return 'V bob. 21 dan 100 gacha bo‘lgan sonlar';
    return 'VI bob. Ikki xonali sonlar ustida amallar va ifodalar';
  }

  String _getFallbackEmoji(int order) {
    const emojis = [
      '🔷', '🗼', '🧭', '🥕', '🧊', '⏰', '🍎', '⚖️',
      '🔢', '🐣', '➕', '➖', '🔍', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '✋', '🧮',
      '6️⃣', '7️⃣', '8️⃣', '9️⃣', '0️⃣', '🔟', '📊', '🌱', '🏠',
      '✏️', '📐', '🧩', '🧩', '❓', '❓', '❓', '🔄', '🔁', '📋', '⚖️', '🧠'
    ];
    if (order >= 1 && order <= emojis.length) {
      return emojis[order - 1];
    }
    return '📘';
  }

  String _getFallbackTitle(int order) {
    const titles = [
      // 1-qism (1–41)
      'Narsalarning xossalari', 'Narsalarning o‘lchamlari', 'Fazoviy tasavvurlar',
      'Taqqoslash va tenglashtirish', 'Geometrik shakllar', 'Vaqt tushunchasi',
      'Narsalarni sanash', 'Narsalarni guruhlash',
      '1 dan 10 gacha sonlar', 'Oldin, keyin, o‘rtasida', 'Qo‘shish amali',
      'Ayirish amali', 'Sonlarni taqqoslash', '1 soni va raqami',
      '2 soni va raqami', '3 soni va raqami', '4 soni va raqami',
      '5 soni va raqami', '5 ichida qo‘shish va ayirish', 'Sonlar tarkibi',
      '6 soni va raqami', '7 soni va raqami', '8 soni va raqami',
      '9 soni va raqami', '0 soni va raqami', '10 soni',
      '10 ichida qo‘shish va ayirish', 'Ketma-ketlik va qonuniyatlar', 'Masala va uning qismlari',
      'To‘g‘ri chiziq, nur, kesma', 'Kesma uzunligini o‘lchash', 'Siniq chiziq va ko‘pburchak',
      'Qo‘shishning hadlari va yig‘indi', 'Noma’lum qo‘shiluvchini topish', 'Ayirishning hadlari',
      'Noma’lum kamayuvchini topish', 'Noma’lum ayriluvchini topish', 'Qo‘shishning o‘rin almashtirish qonuni',
      'Qavsli ifodalar', 'Jadval asosida hisoblash', 'Ifodalar',
      // 2-qism (42–74)
      '11 dan 20 gacha bo‘lgan sonlar', '11 dan 20 gacha sonlarning o‘nlik tarkibi', '11 dan 20 gacha sonlarning tarkibi (2)',
      'Sonlar qatori (1–20)', '11 dan 20 gacha sonlarni taqqoslash', 'O‘nlikdan o‘tmasdan qo‘shish',
      'O‘nlikdan o‘tmasdan ayirish', 'Qo‘shish va ayirish amallari', 'Qavslar',
      'Qavslar (amallar tartibi)', 'Bir xonali sonlarni o‘nlikdan o‘tib qo‘shish', 'Bir xonali sonlarni o‘nlikdan o‘tib qo‘shish (2)',
      'Bir xonali sonlarni o‘nlikdan o‘tib qo‘shish (3)', 'Sonlarni ayirish', 'Sonlarni bo‘laklab ayirish',
      'O‘nlikdan ayirish usuli', 'Yaxlit sonlar (10–100)', '21 dan 100 gacha bo‘lgan sonlar',
      '21 dan 100 gacha sonlarning o‘qilishi va yozilishi', 'Cho‘t va o‘ylangan son', 'Ikki xonali sonlarni taqqoslash',
      'Ikki xonali sonlarni qo‘shish (1)', 'Ikki xonali sonlarni qo‘shish (2)', 'Ikki xonali sonlarni qo‘shish (3)',
      'Ikki xonali sonlarni ayirish (1)', 'Ikki xonali sonlarni ayirish (2)', 'Ikki xonali sonlarni ayirish (3)',
      'Qo‘shish va ayirishning o‘zaro bog‘lanishi', 'Ko‘p komponentli qo‘shish', 'Guruhlash xossasi',
      'Tarkibli ifodalar', 'Qavsli tarkibli ifodalar', 'Misol va masalalar yechish'
    ];
    if (order >= 1 && order <= titles.length) {
      return titles[order - 1];
    }
    return '$order-dars';
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final studentState = ref.watch(studentProvider);
    final isPro = studentState.student?.isPro ?? false;
    final coinBalance = studentState.student?.coinBalance ?? 0;

    final filteredLessons = _lessons.where((l) {
      if (_searchQuery.isEmpty) return true;
      final q = _searchQuery.toLowerCase();
      return l.title.toLowerCase().contains(q) ||
          (l.chapterTitle ?? '').toLowerCase().contains(q) ||
          l.description.toLowerCase().contains(q);
    }).toList();

    final completedLessons = _lessons.where((l) => l.isCompleted).length;
    final totalLessons = _lessons.isEmpty ? 41 : _lessons.length;
    final percent = totalLessons > 0 ? ((completedLessons / totalLessons) * 100).round() : 0;
    final earnedXp = _lessons.fold(0, (acc, l) => acc + (l.isCompleted ? l.rewardXP : 0));
    final totalXp = _lessons.fold(0, (acc, l) => acc + l.rewardXP);

    return AppResponsiveScaffold(
      currentNavIndex: -1,
      phoneBody: Scaffold(
        backgroundColor: colors.bg,
        body: Stack(
          children: [
            const AnimatedMathBackground(),
            SafeArea(
              child: Column(
                children: [
                // Top App Bar
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
                  child: Row(
                    children: [
                      GestureDetector(
                        onTap: () => context.pop(),
                        child: Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: isDark
                                ? const Color(0xFF1E1738)
                                : colors.card,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: colors.border),
                          ),
                          child: Icon(Icons.arrow_back_ios_new_rounded,
                              size: 18, color: colors.ink),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _module?.title ?? 'Matematika · 1-qism',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w900,
                                color: colors.ink,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            Text(
                              widget.moduleId.contains('g2')
                                  ? '2-sinf • Barcha 44 ta mavzu'
                                  : (widget.moduleId.contains('p4')
                                      ? '1-sinf • Barcha 33 ta mavzu'
                                      : (widget.moduleId.contains('p3')
                                          ? '1-sinf • Barcha 40 ta mavzu'
                                          : (widget.moduleId.contains('p2')
                                              ? '1-sinf • Barcha 33 ta mavzu'
                                              : '1-sinf • Barcha 41 ta mavzu'))),
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: colors.muted,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      CoinBadge(count: coinBalance),
                    ],
                  ),
                ),

                // Content
                Expanded(
                  child: _isLoading
                      ? const Center(
                          child: CircularProgressIndicator(
                            color: Color(0xFF6C3CE0),
                          ),
                        )
                      : RefreshIndicator(
                          onRefresh: () => _fetchModuleData(silent: true),
                          color: const Color(0xFF6C3CE0),
                          child: ListView(
                            padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
                            children: [
                              // 1. Module Progress Summary Card
                              _buildSummaryCard(
                                colors,
                                isDark,
                                completedLessons,
                                totalLessons,
                                percent,
                                earnedXp,
                                totalXp,
                              ),
                              const SizedBox(height: 16),

                              // 2. Search Field
                              Container(
                                decoration: BoxDecoration(
                                  color: isDark
                                      ? const Color(0xFF160E36)
                                      : Colors.white,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                    color: colors.border,
                                    width: 1.2,
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withOpacity(0.03),
                                      blurRadius: 8,
                                      offset: const Offset(0, 2),
                                    ),
                                  ],
                                ),
                                child: TextField(
                                  controller: _searchController,
                                  onChanged: (val) {
                                    setState(() {
                                      _searchQuery = val.trim();
                                    });
                                  },
                                  style: TextStyle(
                                    color: colors.ink,
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                  ),
                                  decoration: InputDecoration(
                                    hintText: 'Mavzuni qidirish (masalan: sanash, qo‘shish)...',
                                    hintStyle: TextStyle(
                                      color: colors.muted,
                                      fontSize: 13,
                                    ),
                                    prefixIcon: const Icon(
                                      Icons.search_rounded,
                                      color: Color(0xFF6C3CE0),
                                      size: 22,
                                    ),
                                    suffixIcon: _searchQuery.isNotEmpty
                                        ? IconButton(
                                            icon: Icon(Icons.clear_rounded,
                                                color: colors.muted, size: 18),
                                            onPressed: () {
                                              _searchController.clear();
                                              setState(() => _searchQuery = '');
                                            },
                                          )
                                        : null,
                                    border: InputBorder.none,
                                    contentPadding: const EdgeInsets.symmetric(
                                      horizontal: 16,
                                      vertical: 13,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 16),

                              // 3. Lessons Section Header
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    'Darslar (${filteredLessons.length})',
                                    style: TextStyle(
                                      fontSize: 17,
                                      fontWeight: FontWeight.w900,
                                      color: colors.ink,
                                    ),
                                  ),
                                  if (isPro)
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 8, vertical: 3),
                                      decoration: BoxDecoration(
                                        gradient: const LinearGradient(
                                          colors: [Color(0xFFFFB800), Color(0xFFFF8A00)],
                                        ),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: const Text(
                                        'PRO: Barchasi ochiq 👑',
                                        style: TextStyle(
                                          fontSize: 10,
                                          fontWeight: FontWeight.w900,
                                          color: Colors.white,
                                        ),
                                      ),
                                    ),
                                ],
                              ),
                              const SizedBox(height: 12),

                              // 4. Lessons List
                              if (filteredLessons.isEmpty)
                                Padding(
                                  padding: const EdgeInsets.symmetric(vertical: 40),
                                  child: Center(
                                    child: Column(
                                      children: [
                                        const Icon(Icons.search_off_rounded,
                                            size: 40, color: Colors.grey),
                                        const SizedBox(height: 8),
                                        Text(
                                          'Mavzu topilmadi',
                                          style: TextStyle(
                                            fontSize: 15,
                                            fontWeight: FontWeight.w700,
                                            color: colors.ink,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                )
                              else if (context.isCompact)
                                ...filteredLessons.map((lesson) {
                                  return Padding(
                                    padding: const EdgeInsets.only(bottom: 12),
                                    child: _buildLessonCard(
                                      context,
                                      colors,
                                      isDark,
                                      lesson,
                                      isPro,
                                    ),
                                  );
                                })
                              else
                                GridView.builder(
                                  shrinkWrap: true,
                                  physics: const NeverScrollableScrollPhysics(),
                                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                                    crossAxisCount: context.isExpanded ? 3 : 2,
                                    crossAxisSpacing: 14,
                                    mainAxisSpacing: 14,
                                    mainAxisExtent: 110,
                                  ),
                                  itemCount: filteredLessons.length,
                                  itemBuilder: (context, idx) => _buildLessonCard(
                                    context,
                                    colors,
                                    isDark,
                                    filteredLessons[idx],
                                    isPro,
                                  ),
                                ),
                            ],
                          ),
                        ),
                ),
              ],
            ),
          ),
        ],
      ),
    ),
  );
}

  Widget _buildSummaryCard(
    AppThemeColors colors,
    bool isDark,
    int completedCount,
    int totalCount,
    int percent,
    int earnedXp,
    int totalXp,
  ) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF6C3CE0), Color(0xFF7C4DFF)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF6C3CE0).withOpacity(0.35),
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
              Expanded(
                child: Text(
                  '$completedCount/$totalCount mavzu · $percent%',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                  ),
                ),
              ),
              Text(
                '$earnedXp / $totalXp XP',
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFFFFD54F),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Big Smooth Progress Bar
          ClipRRect(
            borderRadius: BorderRadius.circular(999),
            child: LinearProgressIndicator(
              value: totalCount > 0 ? (completedCount / totalCount).clamp(0.0, 1.0) : 0.0,
              backgroundColor: Colors.white.withOpacity(0.2),
              valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFFFFC83D)),
              minHeight: 10,
            ),
          ),
          const SizedBox(height: 14),

          // Mini Stats Chips
          Wrap(
            spacing: 8,
            runSpacing: 6,
            children: [
              _buildMiniChip(
                icon: Icons.auto_stories_rounded,
                text: '$totalCount ta mavzu',
              ),
              _buildMiniChip(
                icon: Icons.help_outline_rounded,
                text: '${_module?.questionCount ?? (totalCount == 40 ? 800 : (totalCount == 33 ? 660 : 820))} ta savol',
              ),
              _buildMiniChip(
                icon: Icons.timer_outlined,
                text: '~${_module?.totalMinutes ?? (totalCount == 40 ? 341 : (totalCount == 33 ? 217 : 244))} daqiqa',
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMiniChip({required IconData icon, required String text}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.18),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 13, color: Colors.white),
          const SizedBox(width: 5),
          Text(
            text,
            style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLessonCard(
    BuildContext context,
    AppThemeColors colors,
    bool isDark,
    LessonModel lesson,
    bool isPro,
  ) {
    // Determine lock state: if isPro, never locked.
    final effectiveLocked = isPro ? false : lesson.isLocked;

    // Status action details & ring colors
    String actionText = '▶ Boshlash';
    Color actionBg = const Color(0xFF6C3CE0);
    Color actionTextColor = Colors.white;
    IconData actionIcon = Icons.play_arrow_rounded;

    Color ringColor = colors.border;
    if (lesson.percent >= 90) {
      ringColor = const Color(0xFF2EB67D);
    } else if (lesson.percent >= 60) {
      ringColor = const Color(0xFF6C3CE0);
    } else if (lesson.percent > 0) {
      ringColor = const Color(0xFFFFC83D);
    }

    if (effectiveLocked) {
      actionText = '🔒 Qulflangan';
      actionBg = isDark ? const Color(0xFF221A3B) : const Color(0xFFF1F2F6);
      actionTextColor = const Color(0xFF9CA3AF);
      actionIcon = Icons.lock_rounded;
    } else if (lesson.percent >= 90) {
      actionText = '✓ Qayta ko‘rish';
      actionBg = const Color(0xFFE8F8F0);
      actionTextColor = const Color(0xFF2EB67D);
      actionIcon = Icons.check_circle_rounded;
    } else if (lesson.percent >= 60) {
      actionText = '✓ Qayta ko‘rish';
      actionBg = const Color(0xFF6C3CE0).withOpacity(0.12);
      actionTextColor = const Color(0xFF6C3CE0);
      actionIcon = Icons.check_circle_outline_rounded;
    } else if (lesson.attempts > 0 || (lesson.percent > 0 && lesson.percent < 60)) {
      actionText = '🔄 Qayta urinish';
      actionBg = const Color(0xFFFFFBEB);
      actionTextColor = const Color(0xFFD97706);
      actionIcon = Icons.refresh_rounded;
    } else if (lesson.completedSteps > 0) {
      actionText = 'Davom etish (${lesson.completedSteps}/5)';
      actionBg = const Color(0xFF7C4DFF);
      actionTextColor = Colors.white;
      actionIcon = Icons.fast_forward_rounded;
    }

    return GestureDetector(
      onTap: () {
        if (effectiveLocked) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Ushbu dars qulflangan. Oldingi darsni yakunlang yoki Pro obunani faollashtiring! 🔒'),
              duration: Duration(seconds: 2),
            ),
          );
          return;
        }
        context.push('/kids/lesson/${lesson.id}');
      },
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isDark
              ? const Color(0xFF160E36).withOpacity(0.9)
              : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: lesson.isCompleted
                ? const Color(0xFF2EB67D).withOpacity(0.35)
                : (effectiveLocked
                    ? colors.border.withOpacity(0.5)
                    : (lesson.isReview
                        ? const Color(0xFFFFC83D).withOpacity(0.4)
                        : const Color(0xFF6C3CE0).withOpacity(0.2))),
            width: lesson.isCompleted || lesson.isReview ? 1.5 : 1.2,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 10,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Row: Number + Emoji + Title
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Emoji Icon Container
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: effectiveLocked
                        ? (isDark ? const Color(0xFF221A3B) : const Color(0xFFF1F2F6))
                        : const Color(0xFF6C3CE0).withOpacity(0.12),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    effectiveLocked ? '🔒' : (lesson.emoji ?? '📘'),
                    style: const TextStyle(fontSize: 22),
                  ),
                ),
                const SizedBox(width: 12),

                // Title + Short Description
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        (lesson.bookNumber > 0)
                            ? '${lesson.bookNumber}. ${lesson.title}'
                            : (lesson.isReview ? lesson.title : '${lesson.orderIndex}. ${lesson.title}'),
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w800,
                          color: effectiveLocked ? colors.muted : colors.ink,
                          height: 1.25,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        lesson.description,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: colors.muted,
                          height: 1.3,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      if (lesson.isReview) ...[
                        const SizedBox(height: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFFC83D).withOpacity(0.18),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: const Color(0xFFFFC83D).withOpacity(0.5)),
                          ),
                          child: const Text(
                            '📝 Nazorat ishi',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFFB45309),
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
                const SizedBox(width: 8),

                // Circular Progress Indicator
                if (!effectiveLocked)
                  SizedBox(
                    width: 38,
                    height: 38,
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        CircularProgressIndicator(
                          value: (lesson.percent / 100).clamp(0.0, 1.0),
                          backgroundColor: colors.border,
                          valueColor: AlwaysStoppedAnimation<Color>(ringColor),
                          strokeWidth: 3.5,
                        ),
                        Text(
                          '${lesson.percent}%',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w800,
                            color: ringColor == colors.border ? colors.ink : ringColor,
                          ),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 12),

            // Divider
            Divider(color: colors.border.withOpacity(0.6), height: 1),
            const SizedBox(height: 10),

            // Bottom Row: Rewards + Action Button
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // +XP chip
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                      decoration: BoxDecoration(
                        color: const Color(0xFF6C3CE0).withOpacity(0.12),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        '+${lesson.rewardXP} XP',
                        style: const TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF6C3CE0),
                        ),
                      ),
                    ),
                    const SizedBox(width: 5),

                    // +Coin chip
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFC83D).withOpacity(0.2),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        '+${lesson.rewardCoins} 🪙',
                        style: const TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFFB45309),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(width: 6),

                // Action Pill
                Flexible(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: actionBg,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(actionIcon, size: 13, color: actionTextColor),
                        const SizedBox(width: 4),
                        Flexible(
                          child: Text(
                            actionText,
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              color: actionTextColor,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

