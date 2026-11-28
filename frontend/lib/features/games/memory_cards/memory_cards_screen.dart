import 'dart:async';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/network/api_client.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/providers/student_provider.dart';
import '../common/game_play_result_dialog.dart';
import '../common/game_rules_dialog.dart';

class _MemoryCardItem {
  final int id;
  final int pairId;
  final String text;
  final bool isExpression;
  bool isFlipped = false;
  bool isMatched = false;

  _MemoryCardItem({
    required this.id,
    required this.pairId,
    required this.text,
    required this.isExpression,
  });
}

/// "Xotira kartalari" (Memory Cards) Game Screen
/// 12 cards, 6 matching pairs (formula and answer), flip animations, moves counter
class MemoryCardsScreen extends ConsumerStatefulWidget {
  const MemoryCardsScreen({super.key});

  @override
  ConsumerState<MemoryCardsScreen> createState() => _MemoryCardsScreenState();
}

class _MemoryCardsScreenState extends ConsumerState<MemoryCardsScreen> {
  final math.Random _random = math.Random();
  List<_MemoryCardItem> _cards = [];
  _MemoryCardItem? _firstSelected;
  _MemoryCardItem? _secondSelected;
  bool _isProcessing = false;

  Timer? _stopwatchTimer;
  int _elapsedSeconds = 0;
  int _moves = 0;
  int _matchedPairs = 0;
  String? _sessionId;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _showRulesAndStart();
    });
  }

  @override
  void dispose() {
    _stopwatchTimer?.cancel();
    super.dispose();
  }

  Future<void> _showRulesAndStart() async {
    final start = await GameRulesDialog.show(
      context,
      title: 'Xotira kartalari',
      description: 'Misol va uning javobini juftlang!',
      icon: Icons.style_rounded,
      gradient: const [Color(0xFF3B82F6), Color(0xFF1D4ED8)],
      rules: const [
        'Ekranda 12 ta yopiq karta mavjud (jami 6 juftlik).',
        'Bitta kartada misol (masalan, 6 × 7), ikkinchisida uning javobi (42) yashiringan.',
        'Bir vaqtda 2 ta kartani oching. Agar mos kelsa, ochiq qoladi!',
        'Imkon qadar kam harakat va qisqa vaqtda barchasini toping.',
      ],
    );

    if (start == true && mounted) {
      _startGame();
    } else if (mounted) {
      context.pop();
    }
  }

  Future<void> _startGame() async {
    setState(() {
      _isLoading = true;
      _elapsedSeconds = 0;
      _moves = 0;
      _matchedPairs = 0;
      _firstSelected = null;
      _secondSelected = null;
      _isProcessing = false;
    });

    try {
      final res = await ApiClient().dio.post('/games/xotira_kartalari/start');
      if (res.data['success'] == true) {
        _sessionId = res.data['data']['sessionId'];
      }
    } catch (_) {}

    _generateCards();

    if (!mounted) return;
    setState(() => _isLoading = false);

    _stopwatchTimer?.cancel();
    _stopwatchTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (mounted) setState(() => _elapsedSeconds++);
    });
  }

  void _generateCards() {
    final allPairs = [
      {'expr': '6 × 7', 'ans': '42'},
      {'expr': '15 + 9', 'ans': '24'},
      {'expr': '36 ÷ 4', 'ans': '9'},
      {'expr': '8 × 8', 'ans': '64'},
      {'expr': '50 − 18', 'ans': '32'},
      {'expr': '7 × 9', 'ans': '63'},
      {'expr': '25 + 25', 'ans': '50'},
      {'expr': '45 ÷ 5', 'ans': '9'},
      {'expr': '12 × 4', 'ans': '48'},
      {'expr': '80 − 35', 'ans': '45'},
    ]..shuffle(_random);

    final selectedPairs = allPairs.take(6).toList();
    final List<_MemoryCardItem> list = [];

    int idCounter = 1;
    for (int i = 0; i < selectedPairs.length; i++) {
      final p = selectedPairs[i];
      list.add(_MemoryCardItem(
        id: idCounter++,
        pairId: i,
        text: p['expr']!,
        isExpression: true,
      ));
      list.add(_MemoryCardItem(
        id: idCounter++,
        pairId: i,
        text: p['ans']!,
        isExpression: false,
      ));
    }

    list.shuffle(_random);
    _cards = list;
  }

  void _onCardTap(_MemoryCardItem card) {
    if (_isProcessing || card.isFlipped || card.isMatched) return;

    HapticFeedback.lightImpact();

    setState(() {
      card.isFlipped = true;
    });

    if (_firstSelected == null) {
      _firstSelected = card;
    } else {
      _secondSelected = card;
      _moves++;
      _isProcessing = true;

      // Check match
      if (_firstSelected!.pairId == _secondSelected!.pairId) {
        // Matched!
        HapticFeedback.mediumImpact();
        _firstSelected!.isMatched = true;
        _secondSelected!.isMatched = true;
        _matchedPairs++;
        _firstSelected = null;
        _secondSelected = null;
        _isProcessing = false;

        if (_matchedPairs >= 6) {
          _finishGame();
        }
      } else {
        // Not matched, flip back after 700ms
        Future.delayed(const Duration(milliseconds: 700), () {
          if (mounted) {
            setState(() {
              _firstSelected?.isFlipped = false;
              _secondSelected?.isFlipped = false;
              _firstSelected = null;
              _secondSelected = null;
              _isProcessing = false;
            });
          }
        });
      }
    }
  }

  Future<void> _finishGame() async {
    _stopwatchTimer?.cancel();

    final score = math.max(10, 30 - (_moves - 6) * 2);
    final resType = _moves <= 10 ? 'win' : _moves <= 16 ? 'draw' : 'participated';

    int coinsEarned = 20;
    int xpEarned = 35;
    int remainingPlays = 0;
    bool isPro = false;

    try {
      final res = await ApiClient().dio.post(
        '/games/xotira_kartalari/finish',
        data: {
          'sessionId': _sessionId,
          'result': resType,
          'score': score,
          'durationSeconds': _elapsedSeconds,
          'moves': _moves,
        },
      );

      if (res.data['success'] == true) {
        final d = res.data['data'];
        coinsEarned = d['coinsAwarded'] ?? 20;
        xpEarned = d['xpAwarded'] ?? 35;
        remainingPlays = d['remaining'] ?? 0;
        isPro = d['unlimited'] == true;
        ref.read(studentProvider.notifier).refreshProfile();
      }
    } catch (_) {}

    if (!mounted) return;

    final m = (_elapsedSeconds ~/ 60).toString().padLeft(2, '0');
    final s = (_elapsedSeconds % 60).toString().padLeft(2, '0');

    GamePlayResultDialog.show(
      context,
      gameTitle: 'Xotira kartalari',
      result: resType,
      score: score,
      coinsEarned: coinsEarned,
      xpEarned: xpEarned,
      remainingPlays: remainingPlays,
      isPro: isPro,
      stats: [
        {'label': 'Umumiy yurishlar', 'value': '$_moves ta'},
        {'label': 'Sarflangan vaqt', 'value': '$m:$s'},
        {'label': 'Topilgan juftliklar', 'value': '6 / 6'},
      ],
      onPlayAgain: () {
        Navigator.of(context).pop();
        _startGame();
      },
      onGoHome: () {
        Navigator.of(context).pop();
        context.pop();
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);

    if (_isLoading) {
      return Scaffold(
        backgroundColor: colors.bg,
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    final m = (_elapsedSeconds ~/ 60).toString().padLeft(2, '0');
    final s = (_elapsedSeconds % 60).toString().padLeft(2, '0');

    return Scaffold(
      backgroundColor: colors.bg,
      appBar: AppBar(
        backgroundColor: colors.card,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.close_rounded, color: colors.ink),
          onPressed: () => context.pop(),
        ),
        title: Text(
          'Xotira kartalari',
          style: TextStyle(
            color: colors.ink,
            fontSize: 17,
            fontWeight: FontWeight.w900,
          ),
        ),
        centerTitle: true,
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 14),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFF3B82F6).withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                const Icon(Icons.touch_app_rounded,
                    color: Color(0xFF3B82F6), size: 16),
                const SizedBox(width: 4),
                Text(
                  '$_moves yurish',
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF1D4ED8),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              // Top Bar: Timer & Pairs matched
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: colors.card,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: colors.border),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.timer_outlined, color: colors.muted, size: 16),
                        const SizedBox(width: 5),
                        Text(
                          '$m:$s',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w800,
                            color: colors.ink,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFF10B981).withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      'Juftliklar: $_matchedPairs / 6',
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF059669),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // 3x4 Grid of Cards
              Expanded(
                child: GridView.builder(
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    crossAxisSpacing: 10,
                    mainAxisSpacing: 10,
                    childAspectRatio: 0.88,
                  ),
                  itemCount: _cards.length,
                  itemBuilder: (context, index) {
                    final card = _cards[index];
                    return _buildCardItem(card, colors);
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCardItem(_MemoryCardItem card, AppThemeColors colors) {
    return GestureDetector(
      onTap: () => _onCardTap(card),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 250),
        curve: Curves.easeOutCubic,
        decoration: BoxDecoration(
          color: card.isFlipped
              ? (card.isMatched
                  ? const Color(0xFF10B981)
                  : colors.card)
              : const Color(0xFF2563EB),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: card.isFlipped
                ? (card.isMatched
                    ? const Color(0xFF059669)
                    : const Color(0xFF3B82F6))
                : const Color(0xFF1D4ED8),
            width: 2,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: colors.isDark ? 0.35 : 0.08),
              blurRadius: 10,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        alignment: Alignment.center,
        child: card.isFlipped
            ? FittedBox(
                fit: BoxFit.scaleDown,
                child: Padding(
                  padding: const EdgeInsets.all(8),
                  child: Text(
                    card.text,
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w900,
                      color: card.isMatched ? Colors.white : colors.ink,
                    ),
                  ),
                ),
              )
            : const Icon(
                Icons.help_outline_rounded,
                color: Colors.white70,
                size: 28,
              ),
      ),
    );
  }
}
