import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/network/api_client.dart';
import '../../core/widgets/coin_badge.dart';
import '../../core/widgets/cosmic_background.dart';
import '../../core/widgets/xp_coin.dart';
import '../../shared/providers/student_provider.dart';

class HouseStage {
  final int stage;
  final String title;
  final String description;
  final int cost;
  final int xp;
  final IconData icon;

  const HouseStage({
    required this.stage,
    required this.title,
    required this.description,
    required this.cost,
    required this.xp,
    required this.icon,
  });
}

const List<HouseStage> kHouseStages = [
  HouseStage(
    stage: 1,
    title: 'Poydevor',
    description: 'Mustahkam beton plita va poydevor toshlari',
    cost: 10,
    xp: 40,
    icon: Icons.foundation_rounded,
  ),
  HouseStage(
    stage: 2,
    title: 'Devorlar',
    description: 'Issiq va mustahkam g‘isht devorlar',
    cost: 15,
    xp: 60,
    icon: Icons.holiday_village_rounded,
  ),
  HouseStage(
    stage: 3,
    title: 'Tom',
    description: 'Qizil shiferli shinam tom va mo‘ri',
    cost: 20,
    xp: 80,
    icon: Icons.roofing_rounded,
  ),
  HouseStage(
    stage: 4,
    title: 'Deraza va eshiklar',
    description: 'Yorug‘ derazalar va mustahkam yog‘och eshik',
    cost: 25,
    xp: 100,
    icon: Icons.door_front_door_rounded,
  ),
  HouseStage(
    stage: 5,
    title: 'Bog‘ va hovli',
    description: 'Yam-yashil maysazor, tosh yo‘lak va mevali daraxt',
    cost: 30,
    xp: 120,
    icon: Icons.park_rounded,
  ),
  HouseStage(
    stage: 6,
    title: 'Gullar va bezaklar',
    description: 'Rang-barang gullar, chiroqlar va bayroqcha (+100 XP bonus!)',
    cost: 40,
    xp: 280,
    icon: Icons.celebration_rounded,
  ),
];

class HouseBuildingScreen extends ConsumerStatefulWidget {
  const HouseBuildingScreen({super.key});

  @override
  ConsumerState<HouseBuildingScreen> createState() => _HouseBuildingScreenState();
}

class _HouseBuildingScreenState extends ConsumerState<HouseBuildingScreen>
    with SingleTickerProviderStateMixin {
  int _currentStage = 0;
  bool _isLoading = false;
  bool _isBuilding = false;
  late AnimationController _buildAnimController;
  late Animation<double> _buildScaleAnim;

  @override
  void initState() {
    super.initState();
    _buildAnimController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );
    _buildScaleAnim = TweenSequence<double>([
      TweenSequenceItem(
        tween: Tween<double>(begin: 1.0, end: 1.15)
            .chain(CurveTween(curve: Curves.easeOutBack)),
        weight: 50,
      ),
      TweenSequenceItem(
        tween: Tween<double>(begin: 1.15, end: 1.0)
            .chain(CurveTween(curve: Curves.bounceOut)),
        weight: 50,
      ),
    ]).animate(_buildAnimController);

    _loadProgress();
  }

  @override
  void dispose() {
    _buildAnimController.dispose();
    super.dispose();
  }

  Future<void> _loadProgress() async {
    final prefs = await SharedPreferences.getInstance();
    final cachedStage = prefs.getInt('mc_house_building_stage') ?? 0;
    if (mounted) {
      setState(() {
        _currentStage = cachedStage;
      });
    }

    try {
      final res = await ApiClient().dio.get('/games/house-building');
      if (res.data != null && res.data['success'] == true) {
        final data = res.data['data'];
        final stage = (data['currentStage'] as num?)?.toInt() ?? 0;
        if (mounted) {
          setState(() {
            _currentStage = stage;
            _isLoading = false;
          });
          await prefs.setInt('mc_house_building_stage', stage);
        }
        return;
      }
    } catch (_) {
      // Offline fallback
    }

    if (mounted) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _buildStage(HouseStage stage) async {
    final student = ref.read(studentProvider).student;
    final currentCoins = student?.coinBalance ?? 0;

    if (currentCoins < stage.cost) {
      _showNotEnoughCoinsDialog(stage);
      return;
    }

    setState(() {
      _isBuilding = true;
    });

    final prefs = await SharedPreferences.getInstance();

    try {
      final res = await ApiClient().dio.post(
        '/games/house-building/build',
        data: {'stage': stage.stage},
      );

      if (res.data != null && res.data['success'] == true) {
        final newStage = stage.stage;
        ref.read(studentProvider.notifier).updateCoins(-stage.cost);
        ref.read(studentProvider.notifier).updateXP(stage.xp);
        await prefs.setInt('mc_house_building_stage', newStage);

        if (mounted) {
          setState(() {
            _currentStage = newStage;
            _isBuilding = false;
          });
          _buildAnimController.forward(from: 0.0);
          _showStageCelebration(stage);
        }
        return;
      }
    } catch (_) {
      // Fallback offline progression
      final newStage = stage.stage;
      ref.read(studentProvider.notifier).updateCoins(-stage.cost);
      ref.read(studentProvider.notifier).updateXP(stage.xp);
      await prefs.setInt('mc_house_building_stage', newStage);

      if (mounted) {
        setState(() {
          _currentStage = newStage;
          _isBuilding = false;
        });
        _buildAnimController.forward(from: 0.0);
        _showStageCelebration(stage);
      }
      return;
    }

    if (mounted) {
      setState(() {
        _isBuilding = false;
      });
    }
  }

  void _showNotEnoughCoinsDialog(HouseStage stage) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF160E36),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: BorderSide(color: Colors.amber.withValues(alpha: 0.4), width: 1.5),
        ),
        title: Row(
          children: [
            const Icon(Icons.monetization_on_rounded, color: Colors.amber, size: 28),
            const SizedBox(width: 8),
            const Expanded(
              child: Text(
                'Tangalar yetarli emas!',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '${stage.title} bosqichini qurish uchun sizga ${stage.cost} ta oltin tanga kerak.',
              style: const TextStyle(color: Colors.white70, fontSize: 14),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.amber.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.amber.withValues(alpha: 0.3)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.lightbulb_rounded, color: Colors.amber, size: 20),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Misollar ishlab tangalaringizni ko‘paytirishingiz mumkin!',
                      style: TextStyle(color: Colors.amber, fontSize: 12, fontWeight: FontWeight.w600),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Keyinroq', style: TextStyle(color: Colors.white60)),
          ),
          ElevatedButton.icon(
            onPressed: () {
              Navigator.of(ctx).pop();
              context.push('/kids/exercise');
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF7C3AED),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            ),
            icon: const Icon(Icons.calculate_rounded, size: 18),
            label: const Text('Misol yechish'),
          ),
        ],
      ),
    );
  }

  void _showStageCelebration(HouseStage stage) {
    final isFinal = stage.stage >= 6;
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF180F3E),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(26),
          side: BorderSide(
            color: isFinal ? Colors.amber : const Color(0xFFA855F7),
            width: 2,
          ),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 72,
              height: 72,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: isFinal
                      ? [const Color(0xFFF59E0B), const Color(0xFFEF4444)]
                      : [const Color(0xFF8B5CF6), const Color(0xFF3B82F6)],
                ),
                boxShadow: [
                  BoxShadow(
                    color: (isFinal ? Colors.amber : const Color(0xFF8B5CF6)).withValues(alpha: 0.5),
                    blurRadius: 20,
                    spreadRadius: 4,
                  ),
                ],
              ),
              child: Icon(
                isFinal ? Icons.emoji_events_rounded : Icons.check_circle_rounded,
                color: Colors.white,
                size: 42,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              isFinal ? 'G‘ALABA! UY QURILDI! 🏆' : '${stage.title} qurildi! ✨',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: isFinal ? Colors.amber : Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: isFinal ? 20 : 18,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              isFinal
                  ? 'Tabriklaymiz! Siz o‘z orzuingizdagi uyni to‘liq qurib bitkazdingiz va katta me’mor unvoniga sazovor bo‘ldingiz!'
                  : 'Ajoyib natija! Uyingiz yanada chiroyli va qulay bo‘ldi.',
              textAlign: TextAlign.center,
              style: const TextStyle(color: Colors.white70, fontSize: 13),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFF7C3AED).withValues(alpha: 0.25),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFA855F7).withValues(alpha: 0.4)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const XpCoin(size: 20, showGlow: false),
                  const SizedBox(width: 8),
                  Text(
                    '+${stage.xp} XP qo‘shildi!',
                    style: const TextStyle(
                      color: Color(0xFFE9D5FF),
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          Center(
            child: ElevatedButton(
              onPressed: () => Navigator.of(ctx).pop(),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF7C3AED),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              child: const Text('Davom etish', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final student = ref.watch(studentProvider).student;
    final coins = student?.coinBalance ?? 0;
    final xp = student?.totalXP ?? 0;

    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF090518) : const Color(0xFFF6F5FD),
      body: Stack(
        children: [
          const CosmicBackground(),
          SafeArea(
            child: Column(
              children: [
                _buildHeader(coins, xp),
                Expanded(
                  child: _isLoading
                      ? const Center(
                          child: CircularProgressIndicator(color: Color(0xFFA855F7)),
                        )
                      : ListView(
                          padding: const EdgeInsets.fromLTRB(16, 8, 16, 32),
                          children: [
                            _buildHouseViewer(),
                            const SizedBox(height: 20),
                            _buildProgressOverview(),
                            const SizedBox(height: 20),
                            _buildStagesList(coins),
                          ],
                        ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(int coins, int xp) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: const Color(0xFF130A2A).withValues(alpha: 0.85),
        border: Border(
          bottom: BorderSide(
            color: const Color(0xFF8B5CF6).withValues(alpha: 0.25),
            width: 1,
          ),
        ),
      ),
      child: Row(
        children: [
          IconButton(
            onPressed: () => context.pop(),
            icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white, size: 20),
            tooltip: 'Orqaga',
          ),
          const SizedBox(width: 4),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Uy qurish',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                  ),
                ),
                Text(
                  'Orzuingizdagi uyni quring',
                  style: TextStyle(color: Colors.white60, fontSize: 12),
                ),
              ],
            ),
          ),
          CoinBadge(count: coins, size: 26),
          const SizedBox(width: 8),
          XpBadge(count: xp, size: 26),
        ],
      ),
    );
  }

  Widget _buildHouseViewer() {
    return ScaleTransition(
      scale: _buildScaleAnim,
      child: Container(
        height: 250,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(24),
          gradient: const LinearGradient(
            colors: [Color(0xFF1A103F), Color(0xFF0F0826)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
          border: Border.all(
            color: const Color(0xFF8B5CF6).withValues(alpha: 0.4),
            width: 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF7C3AED).withValues(alpha: 0.25),
              blurRadius: 24,
              spreadRadius: 2,
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(24),
          child: Stack(
            children: [
              CustomPaint(
                size: const Size(double.infinity, 250),
                painter: _HousePainter(stage: _currentStage),
              ),
              Positioned(
                top: 12,
                left: 14,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.45),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white12),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        _currentStage >= 6 ? Icons.verified_rounded : Icons.construction_rounded,
                        color: _currentStage >= 6 ? Colors.amber : const Color(0xFFA855F7),
                        size: 16,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        _currentStage >= 6 ? 'Uy to‘liq tayyor!' : '$_currentStage/6 bosqich',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              if (_isBuilding)
                Container(
                  color: Colors.black38,
                  child: const Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        CircularProgressIndicator(color: Colors.amber),
                        SizedBox(height: 12),
                        Text(
                          'Qurilmoqda...',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildProgressOverview() {
    final double percent = (_currentStage / 6.0).clamp(0.0, 1.0);
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF150C31),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFF8B5CF6).withValues(alpha: 0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Qurilish jarayoni',
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
              ),
              Text(
                '${(percent * 100).toInt()}%',
                style: const TextStyle(color: Color(0xFFA855F7), fontWeight: FontWeight.bold, fontSize: 14),
              ),
            ],
          ),
          const SizedBox(height: 10),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: percent,
              minHeight: 10,
              backgroundColor: Colors.white10,
              valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF8B5CF6)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStagesList(int userCoins) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Qurilish bosqichlari',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
        const SizedBox(height: 12),
        ...kHouseStages.map((st) {
          final isBuilt = _currentStage >= st.stage;
          final isNext = _currentStage == st.stage - 1;
          final isLocked = _currentStage < st.stage - 1;
          final canAfford = userCoins >= st.cost;

          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: isBuilt
                  ? const Color(0xFF101D2B)
                  : isNext
                      ? const Color(0xFF1B0E3C)
                      : const Color(0xFF120A24).withValues(alpha: 0.6),
              borderRadius: BorderRadius.circular(18),
              border: Border.all(
                color: isBuilt
                    ? const Color(0xFF10B981).withValues(alpha: 0.4)
                    : isNext
                        ? const Color(0xFFA855F7)
                        : Colors.white10,
                width: isNext ? 1.5 : 1.0,
              ),
            ),
            child: Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: isBuilt
                        ? const Color(0xFF10B981).withValues(alpha: 0.2)
                        : isNext
                            ? const Color(0xFF8B5CF6).withValues(alpha: 0.25)
                            : Colors.white.withValues(alpha: 0.05),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    isBuilt
                        ? Icons.check_circle_rounded
                        : isLocked
                            ? Icons.lock_outline_rounded
                            : st.icon,
                    color: isBuilt
                        ? const Color(0xFF34D399)
                        : isNext
                            ? const Color(0xFFC084FC)
                            : Colors.white30,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            '${st.stage}. ${st.title}',
                            style: TextStyle(
                              color: isLocked ? Colors.white54 : Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 15,
                            ),
                          ),
                          const Spacer(),
                          Row(
                            children: [
                              const XpCoin(size: 15, showGlow: false),
                              const SizedBox(width: 4),
                              Text(
                                '+${st.xp} XP',
                                style: const TextStyle(
                                  color: Color(0xFFC084FC),
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        st.description,
                        style: const TextStyle(color: Colors.white60, fontSize: 12),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          if (!isBuilt) ...[
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: Colors.amber.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Row(
                                children: [
                                  const Icon(Icons.monetization_on_rounded, color: Colors.amber, size: 14),
                                  const SizedBox(width: 4),
                                  Text(
                                    '${st.cost} tanga',
                                    style: const TextStyle(
                                      color: Colors.amber,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 12,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const Spacer(),
                          ],
                          if (isBuilt)
                            const Align(
                              alignment: Alignment.centerRight,
                              child: Text(
                                'Qurildi ✓',
                                style: TextStyle(
                                  color: Color(0xFF34D399),
                                  fontWeight: FontWeight.bold,
                                  fontSize: 13,
                                ),
                              ),
                            )
                          else if (isNext)
                            ElevatedButton(
                              onPressed: _isBuilding ? null : () => _buildStage(st),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: canAfford ? const Color(0xFF7C3AED) : Colors.grey.shade800,
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                              ),
                              child: Text(
                                canAfford ? 'Qurish' : 'Tanga yetmaydi',
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                              ),
                            )
                          else
                            const Text(
                              'Qulflangan',
                              style: TextStyle(color: Colors.white30, fontSize: 12),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        }),
      ],
    );
  }
}

/// Custom painter that procedurally illustrates the house based on current stage
class _HousePainter extends CustomPainter {
  final int stage;

  _HousePainter({required this.stage});

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // 0. Sky background & stars
    final skyPaint = Paint()
      ..shader = ui.Gradient.linear(
        Offset(w / 2, 0),
        Offset(w / 2, h),
        [const Color(0xFF1E1145), const Color(0xFF0F0826)],
      );
    canvas.drawRect(Rect.fromLTWH(0, 0, w, h), skyPaint);

    // Subtle stars in sky
    final starPaint = Paint()..color = Colors.white.withValues(alpha: 0.6);
    final randomStars = [
      Offset(w * 0.15, h * 0.15),
      Offset(w * 0.35, h * 0.08),
      Offset(w * 0.75, h * 0.12),
      Offset(w * 0.88, h * 0.22),
      Offset(w * 0.22, h * 0.30),
      Offset(w * 0.65, h * 0.28),
    ];
    for (final s in randomStars) {
      canvas.drawCircle(s, 1.5, starPaint);
    }

    // Ground / Hill
    final hillPaint = Paint()
      ..shader = ui.Gradient.linear(
        Offset(w / 2, h * 0.6),
        Offset(w / 2, h),
        [const Color(0xFF15803D), const Color(0xFF14532D)],
      );
    final hillPath = Path()
      ..moveTo(0, h * 0.75)
      ..quadraticBezierTo(w * 0.5, h * 0.65, w, h * 0.75)
      ..lineTo(w, h)
      ..lineTo(0, h)
      ..close();
    canvas.drawPath(hillPath, hillPaint);

    final centerX = w / 2;
    final groundY = h * 0.72;

    // If stage 0, draw empty plot marker
    if (stage == 0) {
      final plotPaint = Paint()
        ..color = Colors.white24
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2;
      canvas.drawRect(
        Rect.fromCenter(center: Offset(centerX, groundY - 20), width: 140, height: 40),
        plotPaint,
      );
      final textPainter = TextPainter(
        text: const TextSpan(
          text: 'Bo‘sh qurilish maydoni\n1-bosqichni boshlang!',
          style: TextStyle(color: Colors.white60, fontSize: 11, fontWeight: FontWeight.bold),
        ),
        textAlign: TextAlign.center,
        textDirection: TextDirection.ltr,
      )..layout();
      textPainter.paint(
        canvas,
        Offset(centerX - textPainter.width / 2, groundY - 28),
      );
      return;
    }

    // STAGE 1: Foundation
    if (stage >= 1) {
      final foundationRect = Rect.fromCenter(
        center: Offset(centerX, groundY + 5),
        width: 150,
        height: 22,
      );
      final foundationPaint = Paint()
        ..shader = ui.Gradient.linear(
          Offset(centerX, groundY - 6),
          Offset(centerX, groundY + 16),
          [const Color(0xFF94A3B8), const Color(0xFF475569)],
        );
      canvas.drawRRect(
        RRect.fromRectAndRadius(foundationRect, const Radius.circular(4)),
        foundationPaint,
      );

      final linePaint = Paint()
        ..color = const Color(0xFF334155)
        ..strokeWidth = 1.5;
      for (double x = centerX - 60; x <= centerX + 60; x += 30) {
        canvas.drawLine(Offset(x, groundY - 6), Offset(x, groundY + 16), linePaint);
      }
    }

    // STAGE 2: Walls
    if (stage >= 2) {
      final wallRect = Rect.fromCenter(
        center: Offset(centerX, groundY - 45),
        width: 130,
        height: 80,
      );
      final wallPaint = Paint()
        ..shader = ui.Gradient.linear(
          Offset(centerX, groundY - 85),
          Offset(centerX, groundY - 5),
          [const Color(0xFFEA580C), const Color(0xFFC2410C)],
        );
      canvas.drawRRect(
        RRect.fromRectAndRadius(wallRect, const Radius.circular(6)),
        wallPaint,
      );

      // Brick pattern
      final brickPaint = Paint()
        ..color = const Color(0xFF9A3412).withValues(alpha: 0.6)
        ..strokeWidth = 1;
      for (double y = groundY - 80; y < groundY - 10; y += 15) {
        canvas.drawLine(Offset(centerX - 63, y), Offset(centerX + 63, y), brickPaint);
      }
    }

    // STAGE 3: Roof
    if (stage >= 3) {
      // Chimney
      final chimneyPaint = Paint()..color = const Color(0xFF991B1B);
      canvas.drawRect(
        Rect.fromLTWH(centerX + 28, groundY - 130, 20, 35),
        chimneyPaint,
      );
      // Roof Triangle
      final roofPaint = Paint()
        ..shader = ui.Gradient.linear(
          Offset(centerX, groundY - 135),
          Offset(centerX, groundY - 80),
          [const Color(0xFFDC2626), const Color(0xFF991B1B)],
        );
      final roofPath = Path()
        ..moveTo(centerX - 80, groundY - 80)
        ..lineTo(centerX, groundY - 135)
        ..lineTo(centerX + 80, groundY - 80)
        ..close();
      canvas.drawPath(roofPath, roofPaint);

      // Shingle line
      final roofTrimPaint = Paint()
        ..color = const Color(0xFF7F1D1D)
        ..strokeWidth = 3;
      canvas.drawLine(
        Offset(centerX - 82, groundY - 78),
        Offset(centerX + 82, groundY - 78),
        roofTrimPaint,
      );
    }

    // STAGE 4: Windows and Door
    if (stage >= 4) {
      // Door
      final doorPaint = Paint()
        ..shader = ui.Gradient.linear(
          Offset(centerX, groundY - 45),
          Offset(centerX, groundY - 5),
          [const Color(0xFFB45309), const Color(0xFF78350F)],
        );
      final doorRect = Rect.fromCenter(
        center: Offset(centerX, groundY - 26),
        width: 32,
        height: 48,
      );
      canvas.drawRRect(
        RRect.fromRectAndCorners(
          doorRect,
          topLeft: const Radius.circular(16),
          topRight: const Radius.circular(16),
        ),
        doorPaint,
      );
      // Door knob
      canvas.drawCircle(Offset(centerX + 10, groundY - 24), 2.5, Paint()..color = Colors.amber);

      // Windows (left and right)
      void drawWindow(double winX) {
        final winRect = Rect.fromCenter(
          center: Offset(winX, groundY - 50),
          width: 28,
          height: 28,
        );
        final winPaint = Paint()..color = const Color(0xFFFEF08A);
        canvas.drawRRect(RRect.fromRectAndRadius(winRect, const Radius.circular(6)), winPaint);
        final winFrame = Paint()
          ..color = const Color(0xFF78350F)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 2;
        canvas.drawRRect(RRect.fromRectAndRadius(winRect, const Radius.circular(6)), winFrame);
        canvas.drawLine(Offset(winX - 14, groundY - 50), Offset(winX + 14, groundY - 50), winFrame);
        canvas.drawLine(Offset(winX, groundY - 64), Offset(winX, groundY - 36), winFrame);
      }

      drawWindow(centerX - 38);
      drawWindow(centerX + 38);
    }

    // STAGE 5: Garden and Yard
    if (stage >= 5) {
      // Stepping stones
      final stonePaint = Paint()..color = const Color(0xFFE2E8F0);
      canvas.drawOval(
        Rect.fromCenter(center: Offset(centerX, groundY + 18), width: 22, height: 8),
        stonePaint,
      );
      canvas.drawOval(
        Rect.fromCenter(center: Offset(centerX, groundY + 30), width: 28, height: 9),
        stonePaint,
      );

      // Tree on left
      final trunkPaint = Paint()..color = const Color(0xFF78350F);
      canvas.drawRect(Rect.fromLTWH(centerX - 110, groundY - 45, 12, 45), trunkPaint);
      final leavesPaint = Paint()
        ..shader = ui.Gradient.radial(
          Offset(centerX - 104, groundY - 60),
          30,
          [const Color(0xFF22C55E), const Color(0xFF15803D)],
        );
      canvas.drawCircle(Offset(centerX - 104, groundY - 60), 28, leavesPaint);
      canvas.drawCircle(Offset(centerX - 92, groundY - 50), 18, leavesPaint);
      canvas.drawCircle(Offset(centerX - 116, groundY - 52), 18, leavesPaint);

      // Fence on right
      final fencePaint = Paint()
        ..color = Colors.white70
        ..strokeWidth = 3;
      for (double fx = centerX + 75; fx <= centerX + 115; fx += 10) {
        canvas.drawLine(Offset(fx, groundY - 18), Offset(fx, groundY + 2), fencePaint);
      }
      canvas.drawLine(Offset(centerX + 72, groundY - 10), Offset(centerX + 118, groundY - 10), fencePaint);
    }

    // STAGE 6: Flowers and Decorations
    if (stage >= 6) {
      // Flag on top of roof
      final flagPolePaint = Paint()
        ..color = Colors.white
        ..strokeWidth = 2;
      canvas.drawLine(
        Offset(centerX, groundY - 135),
        Offset(centerX, groundY - 165),
        flagPolePaint,
      );
      final flagPath = Path()
        ..moveTo(centerX, groundY - 165)
        ..lineTo(centerX + 24, groundY - 153)
        ..lineTo(centerX, groundY - 141)
        ..close();
      canvas.drawPath(flagPath, Paint()..color = const Color(0xFFF59E0B));

      // Colorful flower bushes
      final flowerColors = [
        const Color(0xFFEC4899),
        const Color(0xFFEAB308),
        const Color(0xFF8B5CF6),
        const Color(0xFFEF4444),
      ];
      final flowerPositions = [
        Offset(centerX - 50, groundY + 4),
        Offset(centerX - 35, groundY + 6),
        Offset(centerX + 35, groundY + 6),
        Offset(centerX + 50, groundY + 4),
      ];
      for (int i = 0; i < flowerPositions.length; i++) {
        canvas.drawCircle(flowerPositions[i], 5, Paint()..color = flowerColors[i]);
        canvas.drawCircle(flowerPositions[i], 2, Paint()..color = Colors.white);
      }

      // Sparkles in the air
      final sparklePaint = Paint()..color = Colors.amberAccent;
      final sparkles = [
        Offset(centerX - 60, groundY - 120),
        Offset(centerX + 65, groundY - 110),
        Offset(centerX, groundY - 180),
      ];
      for (final sp in sparkles) {
        canvas.drawCircle(sp, 3, sparklePaint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant _HousePainter oldDelegate) => oldDelegate.stage != stage;
}
