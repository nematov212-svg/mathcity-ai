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

class _DuelRound {
  final String question;
  final int answer;
  final List<int> options;

  _DuelRound({
    required this.question,
    required this.answer,
    required this.options,
  });
}

/// "Matematik duel" (Math Duel) Game Screen
/// 1v1 on one phone (Split-screen) or vs Bot, 10 rounds,
/// first to answer correctly gets the point!
class MathDuelScreen extends ConsumerStatefulWidget {
  const MathDuelScreen({super.key});

  @override
  ConsumerState<MathDuelScreen> createState() => _MathDuelScreenState();
}

class _MathDuelScreenState extends ConsumerState<MathDuelScreen> {
  static const int kTotalRounds = 10;
  final math.Random _random = math.Random();

  bool _isVsBot = true; // true: vs Bot, false: 2 players on one phone
  int _currentRound = 1;
  int _p1Score = 0;
  int _p2Score = 0; // Bot or Player 2

  bool _isLoading = true;
  String? _sessionId;

  late List<_DuelRound> _rounds;
  bool _roundResolved = false;
  int? _p1Chosen;
  int? _p2Chosen;
  Timer? _botTimer;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _showRulesAndStart();
    });
  }

  @override
  void dispose() {
    _botTimer?.cancel();
    super.dispose();
  }

  Future<void> _showRulesAndStart() async {
    final start = await GameRulesDialog.show(
      context,
      title: 'Matematik duel',
      description: '1v1 shiddatli jang: kim tezroq yechadi?',
      icon: Icons.flash_on_rounded,
      gradient: const [Color(0xFFEF4444), Color(0xFFDC2626)],
      rules: const [
        'Jami 10 ta raund davom etadi.',
        'Kim to‘g‘ri javobni birinchi bo‘lib bossa, o‘sha ball oladi!',
        'Botga qarshi yoki bitta telefonda do‘stingiz bilan o‘ynashingiz mumkin.',
        '10 raunddan so‘ng eng ko‘p ball to‘plagan tomon g‘olib bo‘ladi.',
      ],
    );

    if (start == true && mounted) {
      _chooseModeAndStart();
    } else if (mounted) {
      context.pop();
    }
  }

  void _chooseModeAndStart() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isDismissible: false,
      builder: (ctx) {
        final colors = AppThemeColors.of(ctx);
        return Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: colors.card,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'O‘yin rejimini tanlang',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                  color: colors.ink,
                ),
              ),
              const SizedBox(height: 18),
              ListTile(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: BorderSide(color: colors.border),
                ),
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: const Color(0xFF8B5CF6).withValues(alpha: 0.15),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.smart_toy_rounded, color: Color(0xFF8B5CF6)),
                ),
                title: const Text('Botga qarshi (Yakkama-yakka)',
                    style: TextStyle(fontWeight: FontWeight.w800)),
                subtitle: const Text('Aqlli MathBot bilan kuch sinashing'),
                onTap: () {
                  Navigator.of(ctx).pop();
                  _startGame(vsBot: true);
                },
              ),
              const SizedBox(height: 12),
              ListTile(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: BorderSide(color: colors.border),
                ),
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEF4444).withValues(alpha: 0.15),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.people_alt_rounded, color: Color(0xFFEF4444)),
                ),
                title: const Text('Do‘st bilan (Bitta telefonda)',
                    style: TextStyle(fontWeight: FontWeight.w800)),
                subtitle: const Text('Ekran ikki tomonga bo‘linadi'),
                onTap: () {
                  Navigator.of(ctx).pop();
                  _startGame(vsBot: false);
                },
              ),
              const SizedBox(height: 12),
            ],
          ),
        );
      },
    );
  }

  Future<void> _startGame({required bool vsBot}) async {
    setState(() {
      _isVsBot = vsBot;
      _isLoading = true;
      _currentRound = 1;
      _p1Score = 0;
      _p2Score = 0;
      _roundResolved = false;
      _p1Chosen = null;
      _p2Chosen = null;
    });

    try {
      final res = await ApiClient().dio.post('/games/matematik_duel/start');
      if (res.data['success'] == true) {
        _sessionId = res.data['data']['sessionId'];
      }
    } catch (_) {}

    _generateRounds();

    if (!mounted) return;
    setState(() => _isLoading = false);

    _setupBotIfActive();
  }

  void _generateRounds() {
    final List<_DuelRound> list = [];
    for (int i = 0; i < kTotalRounds; i++) {
      int num1, num2, ans;
      String op;

      final type = _random.nextInt(3);
      if (type == 0) {
        num1 = 10 + _random.nextInt(30);
        num2 = 5 + _random.nextInt(25);
        op = '+';
        ans = num1 + num2;
      } else if (type == 1) {
        num1 = 20 + _random.nextInt(35);
        num2 = 5 + _random.nextInt(18);
        op = '−';
        ans = num1 - num2;
      } else {
        num1 = 3 + _random.nextInt(8);
        num2 = 2 + _random.nextInt(9);
        op = '×';
        ans = num1 * num2;
      }

      final Set<int> opts = {ans};
      while (opts.length < 4) {
        final delta = (_random.nextInt(6) + 1) * (_random.nextBool() ? 1 : -1);
        final w = ans + delta;
        if (w >= 0 && w != ans) opts.add(w);
      }
      final optList = opts.toList()..shuffle(_random);
      list.add(_DuelRound(
        question: '$num1 $op $num2',
        answer: ans,
        options: optList,
      ));
    }
    _rounds = list;
  }

  void _setupBotIfActive() {
    _botTimer?.cancel();
    if (!_isVsBot || _roundResolved) return;

    // Bot reacts between 1.6s and 3.5s
    final delayMs = 1600 + _random.nextInt(1900);
    _botTimer = Timer(Duration(milliseconds: delayMs), () {
      if (!mounted || _roundResolved) return;

      final current = _rounds[_currentRound - 1];
      // 80% accuracy for bot
      final willBeCorrect = _random.nextDouble() < 0.80;
      int botAns = current.answer;
      if (!willBeCorrect) {
        final wrongOpts = current.options.where((o) => o != current.answer).toList();
        botAns = wrongOpts.isNotEmpty ? wrongOpts.first : current.answer;
      }

      _onPlayer2Tap(botAns);
    });
  }

  void _onPlayer1Tap(int answer) {
    if (_roundResolved) return;
    _resolveRound(player: 1, answer: answer);
  }

  void _onPlayer2Tap(int answer) {
    if (_roundResolved) return;
    _resolveRound(player: 2, answer: answer);
  }

  void _resolveRound({required int player, required int answer}) {
    if (_roundResolved) return;
    final current = _rounds[_currentRound - 1];
    final isCorrect = answer == current.answer;

    setState(() {
      _roundResolved = true;
      if (player == 1) {
        _p1Chosen = answer;
        if (isCorrect) _p1Score++;
      } else {
        _p2Chosen = answer;
        if (isCorrect) _p2Score++;
      }
    });

    HapticFeedback.mediumImpact();

    Future.delayed(const Duration(milliseconds: 900), () {
      if (!mounted) return;
      if (_currentRound >= kTotalRounds) {
        _finishGame();
      } else {
        setState(() {
          _currentRound++;
          _roundResolved = false;
          _p1Chosen = null;
          _p2Chosen = null;
        });
        _setupBotIfActive();
      }
    });
  }

  Future<void> _finishGame() async {
    _botTimer?.cancel();

    final isWin = _p1Score > _p2Score;
    final isDraw = _p1Score == _p2Score;
    final resType = isWin ? 'win' : isDraw ? 'draw' : 'participated';

    int coinsEarned = isWin ? 20 : isDraw ? 10 : 5;
    int xpEarned = isWin ? 35 : isDraw ? 25 : 15;
    int remainingPlays = 0;
    bool isPro = false;

    try {
      final res = await ApiClient().dio.post(
        '/games/matematik_duel/finish',
        data: {
          'sessionId': _sessionId,
          'result': resType,
          'score': _p1Score,
          'durationSeconds': 50,
        },
      );

      if (res.data['success'] == true) {
        final d = res.data['data'];
        coinsEarned = d['coinsAwarded'] ?? coinsEarned;
        xpEarned = d['xpAwarded'] ?? xpEarned;
        remainingPlays = d['remaining'] ?? 0;
        isPro = d['unlimited'] == true;
        ref.read(studentProvider.notifier).refreshProfile();
      }
    } catch (_) {}

    if (!mounted) return;

    GamePlayResultDialog.show(
      context,
      gameTitle: 'Matematik duel',
      result: resType,
      score: _p1Score,
      coinsEarned: coinsEarned,
      xpEarned: xpEarned,
      remainingPlays: remainingPlays,
      isPro: isPro,
      stats: [
        {'label': 'Sizning ballingiz', 'value': '$_p1Score ball'},
        {'label': _isVsBot ? 'MathBot bali' : '2-o‘yinchi bali', 'value': '$_p2Score ball'},
        {'label': 'Umumiy raundlar', 'value': '$kTotalRounds raund'},
      ],
      onPlayAgain: () {
        Navigator.of(context).pop();
        _chooseModeAndStart();
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

    final current = _rounds[_currentRound - 1];

    if (!_isVsBot) {
      // Split Screen 2 Players
      return Scaffold(
        backgroundColor: colors.bg,
        body: SafeArea(
          child: Column(
            children: [
              // Player 2 Side (Upside Down 180 deg)
              Expanded(
                child: RotatedBox(
                  quarterTurns: 2,
                  child: _buildPlayerHalf(
                    playerNum: 2,
                    playerName: '2-O‘yinchi',
                    score: _p2Score,
                    chosenAnswer: _p2Chosen,
                    current: current,
                    onTap: _onPlayer2Tap,
                    colors: colors,
                    themeColor: const Color(0xFFEF4444),
                  ),
                ),
              ),

              // Middle Divider
              Container(
                height: 38,
                color: colors.card,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('P1: $_p1Score',
                        style: const TextStyle(fontWeight: FontWeight.w900, color: Color(0xFF3B82F6))),
                    Text('Raund $_currentRound / $kTotalRounds',
                        style: TextStyle(fontWeight: FontWeight.w800, color: colors.muted)),
                    Text('P2: $_p2Score',
                        style: const TextStyle(fontWeight: FontWeight.w900, color: Color(0xFFEF4444))),
                  ],
                ),
              ),

              // Player 1 Side
              Expanded(
                child: _buildPlayerHalf(
                  playerNum: 1,
                  playerName: 'Siz (1-O‘yinchi)',
                  score: _p1Score,
                  chosenAnswer: _p1Chosen,
                  current: current,
                  onTap: _onPlayer1Tap,
                  colors: colors,
                  themeColor: const Color(0xFF3B82F6),
                ),
              ),
            ],
          ),
        ),
      );
    }

    // Vs Bot Mode
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
          'Duel vs MathBot',
          style: TextStyle(color: colors.ink, fontSize: 17, fontWeight: FontWeight.w900),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              // Scoreboard Card
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                decoration: BoxDecoration(
                  color: colors.card,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: colors.border),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    Column(
                      children: [
                        const Text('Siz', style: TextStyle(fontWeight: FontWeight.w700)),
                        const SizedBox(height: 4),
                        Text('$_p1Score',
                            style: const TextStyle(
                                fontSize: 28, fontWeight: FontWeight.w900, color: Color(0xFF10B981))),
                      ],
                    ),
                    Text('Raund $_currentRound / $kTotalRounds',
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: colors.muted)),
                    Column(
                      children: [
                        const Text('MathBot', style: TextStyle(fontWeight: FontWeight.w700)),
                        const SizedBox(height: 4),
                        Text('$_p2Score',
                            style: const TextStyle(
                                fontSize: 28, fontWeight: FontWeight.w900, color: Color(0xFFEF4444))),
                      ],
                    ),
                  ],
                ),
              ),
              const Spacer(flex: 1),

              // Question
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 36, horizontal: 20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFDC2626), Color(0xFF991B1B)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(26),
                ),
                alignment: Alignment.center,
                child: Text(
                  current.question,
                  style: const TextStyle(
                    fontSize: 44,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                    letterSpacing: 2,
                  ),
                ),
              ),
              const Spacer(flex: 2),

              // Options
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 14,
                  mainAxisSpacing: 14,
                  childAspectRatio: 2.1,
                ),
                itemCount: current.options.length,
                itemBuilder: (context, index) {
                  final opt = current.options[index];
                  final isChosen = _p1Chosen == opt;

                  Color bg = colors.card;
                  Color border = colors.border;
                  Color text = colors.ink;

                  if (_roundResolved) {
                    if (opt == current.answer) {
                      bg = const Color(0xFF10B981);
                      border = const Color(0xFF059669);
                      text = Colors.white;
                    } else if (isChosen) {
                      bg = const Color(0xFFEF4444);
                      border = const Color(0xFFDC2626);
                      text = Colors.white;
                    }
                  }

                  return InkWell(
                    onTap: () => _onPlayer1Tap(opt),
                    borderRadius: BorderRadius.circular(18),
                    child: Container(
                      decoration: BoxDecoration(
                        color: bg,
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(color: border, width: 2),
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        '$opt',
                        style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: text),
                      ),
                    ),
                  );
                },
              ),
              const SizedBox(height: 10),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPlayerHalf({
    required int playerNum,
    required String playerName,
    required int score,
    required int? chosenAnswer,
    required _DuelRound current,
    required Function(int) onTap,
    required AppThemeColors colors,
    required Color themeColor,
  }) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Text(current.question,
              style: TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: colors.ink)),
          const SizedBox(height: 12),
          Expanded(
            child: GridView.builder(
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
                childAspectRatio: 2.2,
              ),
              itemCount: current.options.length,
              itemBuilder: (context, index) {
                final opt = current.options[index];
                return InkWell(
                  onTap: () => onTap(opt),
                  borderRadius: BorderRadius.circular(14),
                  child: Container(
                    decoration: BoxDecoration(
                      color: colors.card,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: colors.border, width: 1.5),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      '$opt',
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: colors.ink),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
